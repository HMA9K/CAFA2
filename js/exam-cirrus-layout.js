/* Gedeelde tentamenindeling. Bestaande routes, antwoorden en voortgang blijven bij de cursuscontroller. */
(() => {
  'use strict';
  const isSra=!!window.SRA_CIRRUS_EXAMS;
  let floating=null,restoreCase=false;
  const flag='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 22V3m1 1c5-5 9 5 15 0v11c-6 5-10-5-15 0" fill="currentColor" stroke="currentColor" stroke-width="1.5"/></svg>';
  const tag='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h9l9 9-9 9-9-9z" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/></svg>';
  function closeFloat(restore=true){
    if(!floating)return;floating.remove();floating=null;
    if(restore&&restoreCase&&document.querySelector('.exam-case-layout.is-case-hidden'))document.querySelector('.exam-question-identity [data-exam-action="section"]')?.click();
    restoreCase=false;document.querySelector('[data-cirrus-float]')?.focus({preventScroll:true});
  }
  function openFloat(){
    if(floating){floating.focus();return;}const panel=document.querySelector('#exam-case-panel');if(!panel)return;
    restoreCase=!panel.hidden;if(restoreCase)document.querySelector('.exam-question-identity [data-exam-action="section"]').click();
    floating=document.createElement('section');floating.className='cirrus-case-float';floating.tabIndex=-1;
    floating.setAttribute('role','dialog');floating.setAttribute('aria-modal','false');floating.setAttribute('aria-labelledby','cirrus-float-title');
    floating.innerHTML='<header><button class="cirrus-float-move" aria-label="Casus verplaatsen met slepen of pijltoetsen"><b id="cirrus-float-title"></b></button><button data-float-size aria-label="Casus vergroten">⤢</button><button data-float-close aria-label="Zwevende casus sluiten">×</button></header><div class="cirrus-float-content"></div><footer><button data-float-close>Sluiten</button><span>Sleep de hoek om het formaat aan te passen</span></footer>';
    const copy=panel.querySelector('.exam-source-document').cloneNode(true);copy.querySelectorAll('svg').forEach(svg=>{const ids=Array.from(svg.querySelectorAll('[id]')).map(n=>n.id);ids.forEach(id=>{svg.innerHTML=svg.innerHTML.replaceAll(id,'float-'+id);if(svg.hasAttribute('aria-labelledby'))svg.setAttribute('aria-labelledby',svg.getAttribute('aria-labelledby').replaceAll(id,'float-'+id));});});copy.querySelectorAll('[id]').forEach(n=>{if(!n.closest('svg'))n.removeAttribute('id');});
    floating.querySelector('b').textContent=panel.querySelector('#exam-case-heading').textContent.replace(/^Casus · /,'');floating.querySelector('.cirrus-float-content').append(copy);
    floating.querySelectorAll('[data-float-close]').forEach(b=>b.onclick=()=>closeFloat());
    let previousGeometry='';floating.querySelector('[data-float-size]').onclick=e=>{
      const large=!floating.classList.contains('is-large');
      if(large){const scale=window.StudyScale?.get()||1,width=Math.min(850,(innerWidth-32)/scale);previousGeometry=floating.style.cssText;floating.style.width=width+'px';floating.style.height=innerHeight*.8/scale+'px';floating.style.top=innerHeight*.08/scale+'px';floating.style.left=(innerWidth/scale-width)/2+'px';floating.style.transform='none';}else floating.style.cssText=previousGeometry;
      floating.classList.toggle('is-large',large);e.currentTarget.setAttribute('aria-label',large?'Casus verkleinen':'Casus vergroten');
    };
    document.body.append(floating);floating.focus({preventScroll:true});const move=floating.querySelector('.cirrus-float-move');let drag;
    const place=(x,y)=>{const r=floating.getBoundingClientRect(),scale=window.StudyScale?.get()||1;floating.style.transform='none';floating.style.left=Math.max(8,Math.min(innerWidth-r.width-8,x))/scale+'px';floating.style.top=Math.max(8,Math.min(innerHeight-r.height-8,y))/scale+'px';};
    move.onpointerdown=e=>{if(e.button!==0)return;const r=floating.getBoundingClientRect();drag={x:e.clientX-r.x,y:e.clientY-r.y};move.setPointerCapture(e.pointerId);e.preventDefault();};
    move.onpointermove=e=>{if(drag)place(e.clientX-drag.x,e.clientY-drag.y);};move.onpointerup=move.onpointercancel=()=>drag=null;
    move.onkeydown=e=>{const d={ArrowLeft:[-10,0],ArrowRight:[10,0],ArrowUp:[0,-10],ArrowDown:[0,10]}[e.key];if(d){e.preventDefault();const r=floating.getBoundingClientRect();place(r.x+d[0],r.y+d[1]);}};
    floating.onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeFloat();}};
  }
  function layout(){
    observeSizes();const host=document.querySelector('#exam-app');if(!host)return;
    if(!document.body.classList.contains('exam-running')){closeFloat(false);return;}
    const tools=document.querySelector('.top-controls'),theme=tools?.querySelector('.study-theme-control'),clock=tools?.querySelector('.exam-clock'),calculator=tools?.querySelector('[data-calc]'),fonts=tools?.querySelector('.font-group');
    if(theme&&clock&&theme.nextElementSibling!==clock)clock.before(theme);
    if(clock&&calculator&&clock.nextElementSibling!==calculator)clock.after(calculator);
    if(calculator&&fonts&&calculator.nextElementSibling!==fonts)calculator.after(fonts);
    const body=host.querySelector('.exam-question-body'),head=host.querySelector('.exam-work-head');if(!body||!head)return;
    if(!head.dataset.cirrusLayout){
      closeFloat(false);const top=host.querySelector('.exam-question-top,.voorbeeld-opgave'),points=top?.querySelector('.exam-source-points');
      if(points){points.classList.add('cirrus-question-points');head.querySelector('.qnum').after(points);}top?.remove();head.dataset.cirrusLayout='true';body.prepend(head);
      const split=host.querySelector('.exam-case-layout'),footer=host.querySelector('.exam-footer');
      if(split&&footer){const work=document.createElement('div');work.className='cirrus-work-pane';body.before(work);work.append(body,footer);}
      const title=host.querySelector('.exam-runner-title'),pageHead=document.createElement('div');pageHead.className='cirrus-page-head';
      const nav=document.createElement('nav');nav.className='cirrus-page-nav';nav.setAttribute('aria-label','Tentamennavigatie');nav.innerHTML='<a class="btn" href="'+(isSra?'#home':'#start')+'">Home</a><a class="btn" href="'+(isSra?'#tentamen':'#dashboard')+'">Dashboard</a>';
      title.before(pageHead);pageHead.append(nav,title);const menu=document.querySelector(isSra?'#tools-menu':'#study-tools-menu');if(menu){const visibleMenu=menu.cloneNode(true);visibleMenu.id='cirrus-tools-menu';visibleMenu.open=false;visibleMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>visibleMenu.open=false));pageHead.append(visibleMenu);}
      const panel=host.querySelector('#exam-case-panel');
      if(!isSra)window.ExamSourceDiagrams?.restore(panel);
      if(panel){const bar=document.createElement('div');bar.className='cirrus-case-head';const name=document.createElement('span');name.textContent=panel.querySelector('h2').textContent.replace(/^Casus · /,'');const enlarge=document.createElement('button');enlarge.type='button';enlarge.dataset.cirrusFloat='';enlarge.textContent='↗';enlarge.setAttribute('aria-label','Casus in een zwevend venster openen');enlarge.title='Casus los openen en vergroten';enlarge.onclick=openFloat;bar.append(name,enlarge);panel.prepend(bar);const floatButton=enlarge.cloneNode(true);floatButton.className='cirrus-float-trigger';floatButton.textContent='↗';floatButton.onclick=openFloat;head.querySelector('.exam-question-identity').append(floatButton);}
      const actions=body.querySelector('.exam-answer-actions'),help=Array.from(body.querySelectorAll('a')).find(a=>a.textContent.includes('Uitleg bij deze vraag'));
      const check=actions?.querySelector('[data-exam-action="check"]');if(check)check.textContent='Nakijken';
      if(help&&actions){help.classList.add('cirrus-summary-link');actions.append(help);}
      const question=body.querySelector('.exam-source-question');if(question){const blocks=Array.from(question.querySelectorAll(':scope > p,:scope > ol > li,:scope > ul > li'));const instruction=blocks.find(p=>/^(?:(?:\d+|[a-z])[.)]\s*)?(?:Bereken|Bepaal|Geef|Stel|Maak|Licht|Toon|Onderbouw|Motiveer|Beoordeel|Leg|Welke|Wat|Hoe|Selecteer|Vul|Noem|Beschrijf)\b/i.test(p.textContent.trim()))||blocks[0];instruction?.classList.add('cirrus-main-instruction');}
      const primary=question?.querySelector('.cirrus-main-instruction');
      if(primary){const start=primary.textContent.search(/\s+(?=(?:Als (?:je|u)\b|Let op\b|NB\s*:))/i);if(start>=0){const walker=document.createTreeWalker(primary,NodeFilter.SHOW_TEXT);let node,offset=0;while((node=walker.nextNode())){if(offset+node.length>start){const range=document.createRange();range.setStart(node,start-offset);range.setEnd(primary,primary.childNodes.length);const note=document.createElement('span');note.className='cirrus-supplemental';note.append(range.extractContents());primary.append(note);break;}offset+=node.length;}}}
    }
    const marked=head.closest('.frame').querySelector('[data-exam-action="mark"]')?.getAttribute('aria-pressed')==='true';let marker=head.querySelector('.cirrus-question-flag');
    if(!marker){marker=document.createElement('span');marker.className='cirrus-question-flag';marker.innerHTML=flag;marker.setAttribute('aria-label','Gemarkeerde vraag');head.querySelector('.exam-question-identity').prepend(marker);}marker.hidden=!marked;
    host.querySelectorAll('.cae-toolbar button').forEach(button=>{if(button.dataset.cirrusIcon)return;const labels={'• Lijst':'☷','1. Lijst':'≡','Links':'≡','Midden':'☰','Rechts':'≡','Tabel':'▦','Opmaak wissen':'Tx','Vergroten':'⛶'};if(labels[button.textContent]){button.dataset.cirrusIcon=button.textContent;button.textContent=labels[button.textContent];}});
    document.querySelectorAll('.compact-overview-item.is-marked').forEach(row=>{const state=row.querySelector('.compact-overview-state');if(state&&state.textContent!=='Gemarkeerd')state.textContent='Gemarkeerd';const label=row.querySelector('.compact-overview-flag');if(label&&!label.dataset.cirrusIcon){label.innerHTML=tag;label.dataset.cirrusIcon='true';}});
  }
  let pending=false;const schedule=()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;layout();});};new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
  document.addEventListener('click',e=>{const menu=document.querySelector('#cirrus-tools-menu');if(menu&&!e.target.closest('#cirrus-tools-menu'))menu.open=false;});
  document.addEventListener('keydown',e=>{const menu=document.querySelector('#cirrus-tools-menu');if(e.key==='Escape'&&menu?.open){menu.open=false;menu.querySelector('summary').focus();}});
  function updateCalculator(calculator,width,height){
    const small=width<300||height<560,changed=calculator.classList.contains('cirrus-calc-small')!==small;
    const history=calculator.querySelector('.calc-history'),row=history?.querySelector('li'),atEnd=history&&history.scrollHeight-history.clientHeight-history.scrollTop<2,first=row?.offsetHeight?Math.round(history.scrollTop/row.offsetHeight):0;
    calculator.classList.toggle('cirrus-calc-small',small);
    if(changed&&row?.offsetHeight)history.scrollTop=atEnd?history.scrollHeight:first*row.offsetHeight;
  }
  window.ExamCirrusLayout={updateCalculator};
  const observed=new WeakSet();
  function observeSizes(){
    const topbar=document.querySelector('.topbar,.study-header');
    if(topbar&&!observed.has(topbar)){observed.add(topbar);new ResizeObserver(()=>document.documentElement.style.setProperty('--cirrus-top-height',topbar.offsetHeight+'px')).observe(topbar);}
    const calculator=document.querySelector(isSra?'#calculator':'#calculator-dialog');
    if(calculator&&!observed.has(calculator)){observed.add(calculator);new ResizeObserver(entries=>{const r=entries[0].contentRect;updateCalculator(calculator,r.width,r.height);}).observe(calculator);}
  }
  document.addEventListener('DOMContentLoaded',()=>{observeSizes();schedule();},{once:true});
  window.addEventListener('cafa:ready',()=>{observeSizes();schedule();});
  observeSizes();schedule();
})();
