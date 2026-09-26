import {VERSION,refKey,conversationHistory} from './study-assistant-schema.mjs';
import {createCafa2Adapter} from './study-assistant-cafa2.mjs';
import {renderMarkdown} from './study-assistant-render.mjs';
import {createAssistantPanel} from './study-assistant-panel.mjs';
const adapters=new Map(),conversations=new Map(),drafts=new Map();
let adapter=createCafa2Adapter(),current=null,currentKey='',mode='hint',status=null,consent=false;
let controller=null,running=false,refreshTimer=null,observedHost=null,observer=null,opener=null,generation=0,pendingTurn=null;
let measuredFooter=null,placementQueued=false;
let calculator=null,calculatorButton=null,calculatorObserver=null;
const footerResize=window.ResizeObserver?new ResizeObserver(()=>placeLauncher()):null;
adapters.set('CAFA2',adapter);
const doc=document;
const button=doc.createElement('button');button.type='button';button.className='study-assistant-launch';
button.textContent='Vraag over deze vraag';button.hidden=true;button.setAttribute('aria-controls','study-assistant');button.setAttribute('aria-expanded','false');
const panel=doc.createElement('dialog');panel.id='study-assistant';panel.className='study-assistant';panel.setAttribute('aria-labelledby','study-assistant-title');
panel.innerHTML=`<header class="study-head"><div><p class="study-eyebrow">HULP BIJ DEZE VRAAG</p><h2 id="study-assistant-title">CAFA2 Assistent</h2></div><button type="button" class="study-icon-button" data-action="close" aria-label="Assistent verbergen" title="Assistent verbergen">×</button></header>
<div class="study-context"><strong data-context-title></strong><p data-context-question></p><div class="study-context-controls"><label>Stand <select data-mode aria-label="Hulpstand"><option value="hint">Eerst een hint</option><option value="review">Antwoord en uitleg</option></select></label><button type="button" class="study-text-button" data-action="clear">Nieuw gesprek</button></div><small data-mode-note></small></div>
<div class="study-scroll"><div class="study-banner" data-banner role="status"></div>
<form data-login hidden><label for="study-code">Toegangscode leeromgeving</label><div class="study-code-row"><input id="study-code" type="password" autocomplete="off" maxlength="256" required><button type="submit">Ontgrendelen</button></div><p class="study-note">Dit is de toegangscode van de beheerder, niet een API-sleutel of ChatGPT-wachtwoord.</p></form>
<div class="study-consent" data-consent><label><input type="checkbox" data-consent-check><span>Bij verzenden mogen de vraag, casus, mijn antwoord en dit gesprek naar de modeldienst worden gestuurd.</span></label><p>De chat wijzigt je tentamenantwoord of score niet. Typ geen persoonsgegevens. De chatgeschiedenis blijft alleen in dit tabblad; de modeldienst kan eigen bewaartermijnen hanteren.</p></div>
<div class="study-starters" data-starters><button type="button" data-prompt="Geef één hint voor de eerste stap, zonder het antwoord te verklappen.">Geef een hint</button><button type="button" data-prompt="Leg het begrip uit dat ik voor deze vraag moet begrijpen.">Leg het begrip uit</button><button type="button" data-prompt="Welke gegevens uit deze casus heb ik nodig, en waarom?">Welke gegevens?</button><button type="button" data-prompt="Vergelijk mijn antwoord met de uitwerking en leg uit waar het verschil ontstaat." data-review-prompt>Bespreek mijn antwoord</button><button type="button" data-prompt="Geef het antwoord op deze vraag en licht de berekening of redenering toe." data-answer-prompt>Geef antwoord en uitleg</button></div>
<div class="study-messages" role="log" aria-live="polite" aria-relevant="additions" data-messages></div></div>
<footer class="study-compose"><form data-chat-form><label for="study-message" class="study-sr">Je vraag aan de assistent</label><textarea id="study-message" rows="2" maxlength="2500" placeholder="Wat is nog niet duidelijk?" enterkeyhint="enter"></textarea><div class="study-send-row"><span data-counter>0 / 2500</span><button type="button" data-action="stop" hidden>Stop</button><button type="submit" data-send>Versturen</button></div></form><div class="study-bottom"><small data-knowledge></small><button type="button" class="study-text-button" data-action="logout" hidden>Uitloggen</button></div></footer>`;
doc.body.append(button,panel);
const $=s=>panel.querySelector(s),input=$('#study-message'),log=$('[data-messages]');
const dock=createAssistantPanel(panel);
// Teaching-style changes do not discard the same question's conversation.
function scope(){return currentKey;}
function contextKey(value){return value?refKey(value.ref)+'|'+value.revision+'|'+value.attempt:'';}
function conversation(){const k=scope();if(!conversations.has(k)){if(conversations.size>=40)conversations.delete(conversations.keys().next().value);conversations.set(k,[]);}return conversations.get(k);}
function banner(message,isError=false){$('[data-banner]').textContent=message;$('[data-banner]').classList.toggle('is-error',isError);$('[data-banner]').hidden=!message;}
function syncLaunchers() {
  if(!calculator?.isConnected){calculatorObserver?.disconnect();calculator=null;calculatorButton=null;calculatorObserver=null;
    const found=doc.querySelector('#calculator-dialog .calculator-float-head');
    if(found){calculator=found.closest('#calculator-dialog');calculatorButton=doc.createElement('button');
      calculatorButton.type='button';calculatorButton.className='study-calculator-launch';calculatorButton.textContent='?';
      calculatorButton.title='Vraag over deze vraag';calculatorButton.setAttribute('aria-label','Assistent openen voor deze vraag');
      calculatorButton.setAttribute('aria-controls','study-assistant');calculatorButton.setAttribute('aria-expanded','false');
      calculatorButton.addEventListener('click',open);found.insertBefore(calculatorButton,found.querySelector('[data-calc-compact]'));
      calculatorObserver=new MutationObserver(syncLaunchers);
      calculatorObserver.observe(calculator,{attributes:true,attributeFilter:['hidden']});}
  }
  const calculatorOpen=!!calculator&&!calculator.hidden&&!!calculatorButton?.isConnected;
  button.hidden=!current||calculatorOpen||panel.open;
  if(calculatorButton){calculatorButton.hidden=!current;calculatorButton.setAttribute('aria-label',current?`Stel een vraag over ${current.title}`:'Assistent openen voor deze vraag');}
}
function placeLauncher() {
  const footer=current?.ref.kind==='exam' && location.hash.startsWith('#tentamen/')
    ? doc.querySelector('#exam-app .exam-footer') : null;
  if(footer!==measuredFooter){if(measuredFooter)footerResize?.unobserve(measuredFooter);measuredFooter=footer;if(footer)footerResize?.observe(footer);}
  const top=footer?.getBoundingClientRect().top;
  const clearance=Number.isFinite(top)?Math.max(0,Math.ceil(innerHeight-top+12)):0;
  button.style.setProperty('--sa-footer-clearance',`${clearance}px`);
}
function queuePlacement(){if(placementQueued)return;placementQueued=true;requestAnimationFrame(()=>{placementQueued=false;placeLauncher();});}
function controls() {
  const permitted=!!current&&status?.ready&&status?.authenticated&&consent;
  $('[data-consent]').classList.toggle('is-confirmed',consent);
  $('[data-consent] span').textContent=consent?'Vraagcontext delen toegestaan voor dit tabblad.':'Bij verzenden mogen de vraag, casus, mijn antwoord en dit gesprek naar de modeldienst worden gestuurd.';
  $('[data-consent] p').hidden=consent;
  $('[data-send]').disabled=!permitted||running||!input.value.trim();
  $('[data-action="stop"]').hidden=!running;
  $('[data-mode]').disabled=running;// Both teaching styles are always available in this practice environment.
  // Answer explanations are not gated by the selected teaching style.
  $('[data-action="logout"]').hidden=!status?.authenticated;
  $('[data-counter]').textContent=`${input.value.length} / 2500`;
  for(const b of panel.querySelectorAll('[data-prompt]'))b.disabled=running||!current;
}
function stop() {
  generation++;controller?.abort();controller=null;
  if(pendingTurn){pendingTurn.message.failed=true;drafts.set(pendingTurn.scope,pendingTurn.message.content);
    if(pendingTurn.scope===scope()){input.value=pendingTurn.message.content;if(current)renderConversation();}pendingTurn=null;}
  running=false;controls();
}
function renderConversation() {
  log.replaceChildren();$('[data-starters]').hidden=false;
  for(const msg of conversation()) {
    const article=doc.createElement('article');article.className=`study-message is-${msg.role}`;
    const who=doc.createElement('strong');who.className='study-message-who';who.textContent=msg.role==='user'?'Jij':`${current.ref.course} Assistent`;
    const body=doc.createElement('div');renderMarkdown(body,msg.content);article.append(who,body);
    if(msg.failed){const p=doc.createElement('p');p.className='study-message-error';p.textContent='Niet beantwoord. Je vraag staat weer in het invoerveld.';article.append(p);}
    if(msg.incomplete){const p=doc.createElement('p');p.className='study-message-error';p.textContent='Dit antwoord is afgebroken door de uitvoerlimiet. Vraag om uitleg van één stap.';article.append(p);}
    if(msg.role==='assistant'&&(msg.citations?.length||msg.references?.length)){
      const details=doc.createElement('details'),summary=doc.createElement('summary');summary.textContent='Bronnen en vraagverwijzingen';details.append(summary);
      const add=(heading,items)=>{if(!items?.length)return;const h=doc.createElement('strong');h.textContent=heading;details.append(h);
        for(const item of items){const p=doc.createElement('p');p.textContent=item.label;details.append(p);}};
      add('Opgehaalde documenten',msg.citations);add('Verwijzingen uit de vraagbank (geen bewijs dat de volledige bron is gelezen)',msg.references);article.append(details);
    }
    log.append(article);
  }
}
function refresh() {
  let next=null;try{next=adapter.read();}catch{banner('De actuele vraag kon niet worden gelezen. Ververs de leeromgeving.',true);}
  const k=contextKey(next);
  if(k!==currentKey){if(currentKey)drafts.set(scope(),input.value);stop();current=next;currentKey=k;mode=next?.defaultReview?'review':'hint';input.value=drafts.get(scope())||'';if(next)renderConversation();else log.replaceChildren();}
  else current=next;
  syncLaunchers();button.setAttribute('aria-label',current?`Stel een vraag over ${current.title}`:'Vraag over deze vraag');
  placeLauncher();
  if(!current){if(panel.open)panel.close();return;}
  
  $('[data-context-title]').textContent=current.title;$('[data-context-question]').textContent=current.questionTitle||current.type;
  $('#study-assistant-title').textContent=current.ref.course+' Assistent';$('[data-mode]').value=mode;
  $('[data-mode-note]').textContent=(current.paused?'De toets is gepauzeerd; je kunt gewoon vragen stellen. ':'')+(mode==='review'?'Vraag direct om een antwoord, berekening of uitleg. Je punten blijven ongewijzigd.':'Eerst een hint. Vraag gerust om het antwoord of toelichting: je hoeft niets in te leveren of om te schakelen.');
  controls();
  dock.refresh();
}
function schedule(){clearTimeout(refreshTimer);refreshTimer=setTimeout(()=>{refresh();decorate();},80);}
function decorate(){adapter.decorate?.(open);const host=doc.getElementById('exam-app');if(host&&host!==observedHost){observer?.disconnect();observer=new MutationObserver(records=>{if(records.some(record=>!panel.contains(record.target)))schedule();});observer.observe(host,{subtree:true,childList:true});observedHost=host;}}
async function api(action,body,signal) {
  const url=new URL(`api/study-${action}`,doc.baseURI);
  if(url.origin!==location.origin)throw new Error('De assistent moet op dezelfde website worden gehost.');
  const response=await fetch(url,{method:body===undefined?'GET':'POST',credentials:'same-origin',cache:'no-store',signal,
    headers:body===undefined?{}:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
  if(!response.headers.get('Content-Type')?.includes('application/json'))throw new Error('De serverkoppeling is nog niet gepubliceerd. De gewone oefenomgeving blijft werken.');
  const data=await response.json();
  if(!response.ok){const error=new Error(data.error||'Het verzoek kon niet worden verwerkt.');error.status=response.status;throw error;}return data;
}
async function loadStatus() {
  banner('Verbinding controleren…');const timeout=new AbortController(),timer=setTimeout(()=>timeout.abort(),10000);
  try {status=await api('status',undefined,timeout.signal);
    if(status.course!==current?.ref.course)throw new Error('De server en leeromgeving zijn voor verschillende vakken ingesteld.');
    $('[data-login]').hidden=!status.ready||status.authenticated;
    banner(!status.ready?'Nog niet geactiveerd. De beheerder moet de server, toegangscode en API-verbinding instellen.':!status.authenticated?'Vul de toegangscode in om de assistent te gebruiken.':'');
    $('[data-knowledge]').textContent=(mode==='review'?status.knowledge?.reviewFiles:status.knowledge?.theoryFiles)?'Vraagcontext en gekoppelde documenten beschikbaar.':'Vraagcontext beschikbaar. Nog geen aanvullende documenten gekoppeld.';
  }catch(error){status=null;banner(error.name==='AbortError'?'De server reageert niet. Probeer het opnieuw.':error.message,true);$('[data-login]').hidden=true;}
  finally{clearTimeout(timer);controls();}
}
async function open() {
  refresh();if(!current)return;if(current.defaultReview){mode='review';refresh();}opener=doc.activeElement;
  dock.show(opener);syncLaunchers();button.setAttribute('aria-expanded','true');calculatorButton?.setAttribute('aria-expanded','true');
  if(matchMedia('(pointer:fine)').matches)input.focus({preventScroll:true});await loadStatus();
}
button.addEventListener('click',open);
panel.addEventListener('close',()=>{drafts.set(scope(),input.value);stop();adapter.resetPin?.();refresh();button.setAttribute('aria-expanded','false');calculatorButton?.setAttribute('aria-expanded','false');if(opener?.isConnected)opener.focus({preventScroll:true});});
panel.addEventListener('cancel',()=>stop());
$('[data-consent-check]').addEventListener('change',e=>{consent=e.target.checked;controls();});
input.addEventListener('input',()=>{drafts.set(scope(),input.value);controls();});
input.addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();$('[data-chat-form]').requestSubmit();}});
$('[data-mode]').addEventListener('change',e=>{drafts.set(scope(),input.value);mode=e.target.value;input.value=drafts.get(scope())||'';renderConversation();refresh();loadStatus();});
panel.addEventListener('click',async e=>{
  const prompt=e.target.closest('[data-prompt]');if(prompt){input.value=prompt.dataset.prompt;input.focus();controls();if(prompt.hasAttribute('data-answer-prompt')){if(!$('[data-send]').disabled)$('[data-chat-form]').requestSubmit();else banner('Vul de toegangscode in en geef toestemming om de vraaggegevens te delen. Daarna kun je versturen.');}return;}
  const action=e.target.closest('[data-action]')?.dataset.action;
  if(action==='close')panel.close();
  if(action==='stop'){stop();banner('Het verzoek is gestopt. Het kan al API-verbruik hebben veroorzaakt.');}
  if(action==='clear'){stop();conversations.delete(scope());drafts.delete(scope());input.value='';renderConversation();banner('Nieuw gesprek voor deze vraag.');controls();}
  if(action==='logout'){stop();try{await api('logout',{});status.authenticated=false;consent=false;$('[data-consent-check]').checked=false;conversations.clear();drafts.clear();input.value='';renderConversation();await loadStatus();}catch(error){banner(error.message,true);}}
});
$('[data-login]').addEventListener('submit',async e=>{
  e.preventDefault();const code=$('#study-code'),submit=e.target.querySelector('button');submit.disabled=true;
  try{await api('auth',{code:code.value});code.value='';await loadStatus();}catch(error){banner(error.message,true);}finally{submit.disabled=false;}
});
$('[data-chat-form]').addEventListener('submit',async e=>{
  e.preventDefault();refresh();controls();if($('[data-send]').disabled)return;
  const message=input.value.trim(),ctx=current,m=mode,chat=conversation(),id=++generation;
  const history=conversationHistory(chat);
  const userMessage={role:'user',content:message};pendingTurn={message:userMessage,scope:scope()};chat.push(userMessage);if(chat.length>24)chat.splice(0,chat.length-24);
  input.value='';drafts.delete(scope());running=true;controller=new AbortController();renderConversation();controls();banner('Antwoord wordt opgesteld…');
  try {
    const result=await api('chat',{ref:ctx.ref,revision:ctx.revision,mode:m,message,history,studentAnswer:ctx.studentAnswer},controller.signal);
    if(id!==generation)return;
    if(result.questionKey!==refKey(ctx.ref)||result.mode!==m)throw new Error('De antwoordcontext klopt niet. Stel de vraag opnieuw.');
    // Route changes can precede the debounced UI refresh. Keep the answer with
    // its original question even when a fast response wins that race.
    let live=null;try{live=adapter.read();}catch{}
    pendingTurn=null;chat.push({role:'assistant',content:result.answer,references:result.references,citations:result.citations,incomplete:result.incomplete});
    if(contextKey(live)!==scope()){refresh();return;}
    banner('');renderConversation();
    log.lastElementChild?.scrollIntoView({block:'nearest',behavior:'smooth'});
  }catch(error){if(id!==generation)return;pendingTurn=null;userMessage.failed=true;input.value=message;
    if(error.status===401){status.authenticated=false;$('[data-login]').hidden=false;}
    banner(error.name==='AbortError'?'Het verzoek is gestopt.':error.message,true);renderConversation();}
  finally{if(id===generation){running=false;controller=null;controls();}}
});
// Capture the explicit 'check answer' action, without triggering it or changing scores ourselves.
doc.addEventListener('click',e=>{if(e.target.closest('[data-exam-action="check"], [data-self-grade], [data-check-answer]')){adapter.markChecked?.();schedule();}},true);
window.addEventListener('hashchange',()=>{adapter.resetPin?.();schedule();});
window.addEventListener('resize',queuePlacement);
doc.addEventListener('scroll',queuePlacement,true);
for(const event of ['cafa:ready','cafa:exam-route','cafa:practice-change'])window.addEventListener(event,schedule);
window.addEventListener('pagehide',()=>stop());
window.StudyAssistant={version:VERSION,open,refresh:schedule,
  registerAdapter(course,value){if(!value||typeof value.read!=='function')throw new Error('Adapter.read ontbreekt.');adapters.set(course,value);},
  useCourse(course){if(!adapters.has(course))throw new Error('Dit vak is nog niet aangesloten.');stop();adapter=adapters.get(course);currentKey='';status=null;schedule();}};
schedule();
