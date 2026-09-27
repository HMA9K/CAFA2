/** Introduction and access-code handoff; no authentication or study-data writes here. */
const SEEN_KEY='cafa2-assistant-intro-seen-v1';
export function createAssistantIntro({document:doc=document,onContinue,onChange=()=>{},getConsent=()=>false,getAuthenticated=()=>false,onConsentChange=()=>{}}){
  const win=doc.defaultView;let seen=false,launcher=null,dismiss=()=>{},activate=()=>{};
  try{seen=win.localStorage.getItem(SEEN_KEY)==='true';}catch{}
  const dialog=doc.createElement('dialog');dialog.id='study-assistant-intro';dialog.className='study-assistant-intro';
  dialog.setAttribute('aria-labelledby','study-intro-title');
  dialog.innerHTML=`<header class="study-intro-head"><div><p class="study-eyebrow">GERICHTE HULP BIJ JOUW VRAAG</p><h2 id="study-intro-title" tabindex="-1">CAFA2 Assistent</h2></div><button type="button" class="study-intro-close" aria-label="Introductie sluiten" title="Sluiten">×</button></header>
<div class="study-intro-body"><p>Vraag om een hint, begripsuitleg, een volledige berekening of een journaalpost. Laat je ingevulde antwoord nakijken met uitleg over wat klopt, wat beter kan en hoeveel punten het kan verdienen.</p>
<h3>Drie lagen context</h3><ol>
<li><strong>Jouw vraag en antwoord.</strong> De actuele oefen- of tentamenvraag, de casus en wat je hebt ingevuld.</li>
<li><strong>De uitwerking en het gesprek.</strong> De bijbehorende uitwerking, relevante eerdere deelvragen en je vervolgvragen binnen dit gesprek.</li>
<li><strong>Originele vakbronnen.</strong> De gekoppelde syllabi, opgaven, uitwerkingen, tentamens, repetitiecursus met slides en aanvullende literatuur.</li></ol>
<p>Zo kan de assistent bedragen herleiden, stappen vergelijken en uitleg op jouw vraag afstemmen. Je hoeft de casus of je antwoord niet opnieuw over te typen.</p>
<p class="study-intro-access"><strong>Beperkt beschikbaar.</strong> Vraag tijdelijk gratis een toegangscode aan bij de beheerder.</p><div class="study-intro-consent" data-consent><label><input type="checkbox" data-consent-check><span>Bij verzenden mogen de vraag, casus, mijn antwoord en dit gesprek naar de modeldienst worden gestuurd.</span></label><p>De chat wijzigt je tentamenantwoord of score niet. Typ geen persoonsgegevens. De chatgeschiedenis blijft alleen in dit tabblad; de modeldienst kan eigen bewaartermijnen hanteren.</p><p>Je keuze geldt voor dit tabblad. Via Privacy in de assistent kun je de toestemming intrekken.</p></div></div>
<form class="study-intro-form"><label data-code-label for="study-intro-code">Toegangscode <span>(optioneel)</span></label><div class="study-intro-code-row"><input id="study-intro-code" type="password" autocomplete="off" maxlength="256" placeholder="Vul je toegangscode in"><button type="submit">Doorgaan</button></div><p data-code-note>Zonder code kun je doorgaan en deze in de assistent invullen.</p><p data-access-ready hidden>Je toegang is al geactiveerd. Je hoeft de code niet opnieuw in te vullen.</p></form>`;
  doc.body.append(dialog);
  const code=dialog.querySelector('#study-intro-code'),submit=dialog.querySelector('button[type=submit]'),consentCheck=dialog.querySelector('[data-consent-check]');
  let continuing=false;
  consentCheck.addEventListener('change',()=>{onConsentChange(consentCheck.checked);submit.disabled=!getConsent();});
  function close(){code.value='';if(dialog.open)dialog.close();}
  dialog.querySelector('.study-intro-close').addEventListener('click',close);
  dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
  dialog.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();}});
  dialog.addEventListener('close',()=>{code.value='';onChange();if(!continuing){dismiss();if(launcher?.isConnected)launcher.focus({preventScroll:true});}});
  dialog.querySelector('form').addEventListener('submit',async event=>{
    event.preventDefault();if(submit.disabled||!getConsent())return;
    const value=getAuthenticated()?'':code.value.trim(),source=launcher;activate();continuing=true;submit.disabled=true;close();
    try{await onContinue({code:value,launcher:source});}finally{continuing=false;submit.disabled=!getConsent();}
  });
  function show(source=doc.activeElement,onDismiss=()=>{},privacy=false,onActivate=()=>{}){
    if(dialog.open)return;
    const authenticated=getAuthenticated();
    code.hidden=authenticated;code.disabled=authenticated;code.value='';
    dialog.querySelector('[data-code-label]').hidden=authenticated;
    dialog.querySelector('[data-code-note]').hidden=authenticated;
    dialog.querySelector('[data-access-ready]').hidden=!authenticated;
    dialog.querySelector('.study-intro-access').hidden=authenticated;
    consentCheck.checked=getConsent();dialog.querySelector('[data-consent]').hidden=getConsent()&&!privacy;submit.disabled=!getConsent();
    launcher=source;dismiss=onDismiss;activate=onActivate;seen=true;try{win.localStorage.setItem(SEEN_KEY,'true');}catch{}
    dialog.showModal();dialog.querySelector('h2').focus({preventScroll:true});onChange();
  }
  return {show,get seen(){return seen;},get open(){return dialog.open;},
    get label(){return seen?'Start de CAFA2 Assistent':'Stel een vraag of kijk je antwoord na met de CAFA2 Assistent';}};
}
