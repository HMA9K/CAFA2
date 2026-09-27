/** Introduction and access-code handoff; no authentication or study-data writes here. */
const SEEN_KEY='cafa2-assistant-intro-seen-v1';
export function createAssistantIntro({document:doc=document,onContinue,onChange=()=>{}}){
  const win=doc.defaultView;let seen=false,launcher=null,dismiss=()=>{};
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
<p class="study-intro-access"><strong>Beperkt beschikbaar.</strong> Vraag tijdelijk gratis een toegangscode aan bij de beheerder.</p></div>
<form class="study-intro-form"><label for="study-intro-code">Toegangscode <span>(optioneel)</span></label><div class="study-intro-code-row"><input id="study-intro-code" type="password" autocomplete="off" maxlength="256" placeholder="Vul je toegangscode in"><button type="submit">Doorgaan</button></div><p>Zonder code kun je doorgaan en deze in de assistent invullen.</p></form>`;
  doc.body.append(dialog);
  const code=dialog.querySelector('input'),submit=dialog.querySelector('button[type=submit]');
  function close(){code.value='';if(dialog.open)dialog.close();}
  dialog.querySelector('.study-intro-close').addEventListener('click',close);
  dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
  dialog.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();}});
  dialog.addEventListener('close',()=>{code.value='';onChange();if(!submit.disabled){dismiss();if(launcher?.isConnected)launcher.focus({preventScroll:true});}});
  dialog.querySelector('form').addEventListener('submit',async event=>{
    event.preventDefault();if(submit.disabled)return;
    const value=code.value.trim(),source=launcher;submit.disabled=true;close();
    try{await onContinue({code:value,launcher:source});}finally{submit.disabled=false;}
  });
  function show(source=doc.activeElement,onDismiss=()=>{}){
    if(dialog.open)return;
    launcher=source;dismiss=onDismiss;seen=true;try{win.localStorage.setItem(SEEN_KEY,'true');}catch{}
    dialog.showModal();dialog.querySelector('h2').focus({preventScroll:true});onChange();
  }
  return {show,get seen(){return seen;},get open(){return dialog.open;},
    get label(){return seen?'Start de CAFA2 Assistent':'Stel een vraag of kijk je antwoord na met de CAFA2 Assistent';}};
}
