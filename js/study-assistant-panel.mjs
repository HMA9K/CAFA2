/** Layout only: reserve a right column without reading or changing study data. */
const DEFAULT_WIDTH=100/3,KEY='cafa2-assistant-panel-v1',DIVIDER=14;
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
export function panelPreference(value){return Number.isFinite(value?.width)&&value.width>=20&&value.width<=50?value.width:DEFAULT_WIDTH;}
export function panelMetrics(width,preference=DEFAULT_WIDTH,hasCase=false){
  const fraction=typeof hasCase==='number'?clamp(hasCase,.25,.6):hasCase?1/3:0;
  const primaryMin=fraction?Math.max(560,Math.ceil(354/(1-fraction))):400,max=Math.min(width/2,width-primaryMin-DIVIDER);
  const stacked=width<860||max<320;
  return {stacked,width:stacked?Math.max(0,width):Math.round(clamp(width*clamp(preference,20,50)/100,320,max))};
}

export function createAssistantPanel(panel){
  const doc=panel.ownerDocument,win=doc.defaultView;
  let width=DEFAULT_WIDTH,layout=null,primary=null,separator=null,page=null,modal=null,anchor=null,hash='',drag=null,queued=false,returnScroll=null,alignNext=false;
  try{width=panelPreference(JSON.parse(win.localStorage.getItem(KEY)||'null'));}catch{}
  const viewport=()=>{const v=win.visualViewport;return {y:v?.offsetTop||0,w:v?.width||doc.documentElement.clientWidth,h:v?.height||win.innerHeight};};
  const save=()=>{try{win.localStorage.setItem(KEY,JSON.stringify({width}));}catch{}};
  function detach(){
    if(!layout)return;
    drag=null;
    resizeObserver?.unobserve(layout);
    if(panel.parentElement===layout)doc.body.append(panel);
    if(primary?.parentElement===layout)layout.before(primary);
    primary?.classList.remove('study-assistant-primary');
    page?.classList.remove('study-assistant-page','study-assistant-short-page');page?.style.removeProperty('--sa-page-height');
    modal?.classList.remove('study-assistant-modal-host');
    layout.remove();layout=null;primary=null;separator=null;page=null;modal=null;
  }
  function target(){
    const activeModal=Array.from(doc.querySelectorAll('dialog[open]')).filter(el=>el!==panel&&el.matches(':modal')).at(-1);
    if(activeModal){
      const body=activeModal.querySelector('.exam-modal-body,.dialog-body');
      if(body&&!body.contains(panel))return {element:body,modal:activeModal};
      if(body&&modal===activeModal)return {element:primary,modal:activeModal};
      // Confirmation and law dialogs keep their own modal interaction until closed.
      return null;
    }
    const row=anchor?.isConnected&&anchor.closest('.result-expanded,article.exam-review-item');
    if(row)return {element:row};
    if(hash===win.location.hash&&primary?.isConnected&&!modal&&primary.matches('.result-expanded,article.exam-review-item'))return {element:primary};
    const question=doc.getElementById(win.location.hash.slice(1));
    if(question?.matches('.question'))return {element:question.querySelector('.practice-case-layout')||question.querySelector('.qbody'),page:question};
    const host=doc.getElementById('exam-app');if(!host||host.hidden)return null;
    return {element:host.querySelector('.exam-case-layout,.exam-question-body,.review-detail-layout,.exam-results-panel')};
  }
  function attach(destination){
    if(!destination?.element)return;
    if(destination.element===primary&&(destination.modal||null)===modal)return;
    detach();primary=destination.element;page=destination.page||null;modal=destination.modal||null;hash=win.location.hash;
    layout=doc.createElement('div');layout.className='study-assistant-layout';
    if(primary.matches('.exam-case-layout,.exam-question-body'))layout.classList.add('is-exam');
    if(modal)layout.classList.add('is-modal');
    separator=doc.createElement('div');separator.className='study-assistant-resizer';separator.tabIndex=0;
    separator.setAttribute('role','separator');separator.setAttribute('aria-orientation','vertical');
    separator.setAttribute('aria-label','Breedte van de assistent rechts aanpassen');separator.setAttribute('aria-controls',panel.id);
    separator.setAttribute('aria-valuemin','20');separator.setAttribute('aria-valuemax','50');
    separator.title='Sleep naar links voor een bredere assistent of naar rechts voor een smallere assistent. Gebruik ook de pijltoetsen, Home en End.';
    separator.innerHTML='<span aria-hidden="true">⋮</span>';
    primary.before(layout);primary.classList.add('study-assistant-primary');layout.append(primary,separator,panel);
    alignNext=true;
    page?.classList.add('study-assistant-page');modal?.classList.add('study-assistant-modal-host');
    separator.addEventListener('pointerdown',event=>{if(event.button!==0)return;event.preventDefault();
      drag={id:event.pointerId,right:layout.getBoundingClientRect().right};separator.setPointerCapture(event.pointerId);layout.classList.add('is-resizing');});
    separator.addEventListener('pointermove',event=>{if(drag?.id!==event.pointerId)return;
      width=clamp(100*(drag.right-event.clientX-DIVIDER/2)/layout.getBoundingClientRect().width,20,50);place();});
    function finish(event){if(drag?.id!==event.pointerId)return;const id=drag.id;drag=null;layout.classList.remove('is-resizing');
      if(separator.hasPointerCapture(id))separator.releasePointerCapture(id);save();}
    for(const event of ['pointerup','pointercancel','lostpointercapture'])separator.addEventListener(event,finish);
    separator.addEventListener('keydown',event=>{
      const step=event.shiftKey?10:5;
      if(event.key==='ArrowLeft')width+=step;else if(event.key==='ArrowRight')width-=step;
      else if(event.key==='Home')width=DEFAULT_WIDTH;else if(event.key==='End')width=50;else return;
      event.preventDefault();width=clamp(width,20,50);place();save();
    });
    resizeObserver?.observe(layout);
  }
  function safeTop(v){
    let top=v.y;
    if(modal){const head=modal.querySelector('.exam-modal-head,.dialog-header');return head?.getBoundingClientRect().height||48;}
    for(const selector of ['.topbar','#study-returnbar']){const r=doc.querySelector(selector)?.getBoundingClientRect();
      if(r&&r.height&&r.bottom>v.y&&r.top<v.y+v.h)top=Math.max(top,r.bottom);}
    return top;
  }
  function place(){
    if(!panel.open)return;
    const destination=target();if(destination)attach(destination);
    if(!layout?.isConnected)return;
    const v=viewport(),casePanel=primary.querySelector('.exam-case-panel:not([hidden])');
    const fraction=casePanel?(parseFloat(primary.style.getPropertyValue('--case-width'))||100/3)/100:false;
    const metrics=panelMetrics(layout.getBoundingClientRect().width/(win.StudyScale?.get()||1),width,fraction);
    const stacked=metrics.stacked||v.w<900;
    layout.classList.toggle('is-stacked',stacked);separator.hidden=stacked;
    doc.body.classList.toggle('study-assistant-stacked',stacked&&!modal);
    layout.style.setProperty('--sa-column-width',metrics.width+'px');
    separator.setAttribute('aria-valuenow',String(Math.round(width)));separator.setAttribute('aria-valuetext',Math.round(width)+' procent assistentbreedte');
    const short=stacked&&v.h<500;doc.body.classList.toggle('study-assistant-short',short);
    page?.classList.toggle('study-assistant-short-page',v.h<600);
    const footer=page?.querySelector('.question-nav')||doc.querySelector('#exam-app:not([hidden]) .exam-footer');
    const top=safeTop(v),footerHeight=!short&&!modal?(footer?.getBoundingClientRect().height||0):0;
    const scale=win.StudyScale?.get()||1;
    const available=Math.max(100,(v.h-top+v.y-footerHeight)/scale-12);
    layout.style.setProperty('--sa-pane-height',Math.min(modal?620:680,available)+'px');
    if(page)page.style.setProperty('--sa-page-height',Math.max(160,(v.h-Math.max(top,page.getBoundingClientRect().top)+v.y)/scale-12)+'px');
    const renderedHeight=stacked?Math.min(680,available):layout.getBoundingClientRect().height;
    panel.classList.toggle('is-short',renderedHeight<500);panel.classList.toggle('is-tiny',renderedHeight<280);
    if(alignNext){alignNext=false;if(stacked)win.requestAnimationFrame(()=>{
      if(!panel.open)return;
      if(modal)panel.scrollIntoView({block:'nearest',behavior:'instant'});
      else win.scrollTo({top:Math.max(0,win.scrollY+panel.getBoundingClientRect().top-safeTop(viewport())-6),behavior:'instant'});
    });}
  }
  function queue(){if(queued)return;queued=true;win.requestAnimationFrame(()=>{queued=false;place();});}
  const resizeObserver=win.ResizeObserver?new win.ResizeObserver(queue):null;
  for(const element of doc.querySelectorAll('.topbar,#study-returnbar'))resizeObserver?.observe(element);
  const observer=new win.MutationObserver(records=>{
    if(records.some(r=>!panel.contains(r.target)&&(r.type==='childList'||r.target.tagName==='DIALOG'||r.target.id==='exam-case-panel'||r.target.matches?.('.exam-case-layout'))))queue();
  });
  observer.observe(doc.body,{subtree:true,childList:true,attributes:true,attributeFilter:['open','hidden','style']});
  function show(opener){
    anchor=opener?.closest('.study-inline-launch')?opener:null;
    const first=!panel.open;if(first)returnScroll={x:win.scrollX,y:win.scrollY,hash:win.location.hash};
    if(!panel.open)panel.show();panel.setAttribute('aria-modal','false');place();
  }
  panel.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();panel.close();}});
  panel.addEventListener('close',()=>{
    const wasStacked=layout?.classList.contains('is-stacked');save();detach();doc.body.classList.remove('study-assistant-short','study-assistant-stacked');
    if(wasStacked&&returnScroll?.hash===win.location.hash)win.scrollTo(returnScroll.x,returnScroll.y);returnScroll=null;anchor=null;
  });
  const resized=()=>{alignNext=true;queue();};
  win.addEventListener('resize',resized);win.visualViewport?.addEventListener('resize',resized);win.visualViewport?.addEventListener('scroll',queue);
  win.addEventListener('pagehide',save);
  return {show,refresh:queue};
}
