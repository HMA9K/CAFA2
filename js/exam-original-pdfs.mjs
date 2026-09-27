import {originalPdfs} from '../data/exam-original-pdfs.mjs';
import {createAssistantPanel} from './study-assistant-panel.mjs';

// Original source documents only. No attempt, answer or assistant conversation is written here.
let left=null,right=null,dock=null,queued=false,currentKey='',rightRequest=0;
const htmlEscape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function context(){
  const question=document.getElementById(location.hash.slice(1));
  if(question?.matches('.question'))return {id:question.dataset.examSource,host:question,key:location.hash};
  const position=window.CafaExams?.getPosition();
  if(position){const a=CafaExams.getAttempts().find(a=>a.id===position.attempt),q=a?.exam.questions[position.index];
    return {id:q?.sourceExamId||a?.exam.id,host:document.getElementById('exam-app'),key:position.attempt+':'+position.index};}
  const match=location.hash.match(/^#welkom\/([^/]+)/);
  return {id:match?.[1],host:document.getElementById('exam-app'),key:location.hash};
}
function actions(id){
  const source=originalPdfs[id];if(!source)return null;
  const group=document.createElement('span');group.className='original-pdf-actions';group.dataset.pdfExam=id;
  for(const [kind,label] of [['questions','Tentamen PDF'],['solutions','Uitwerking PDF']]){
    const button=document.createElement('button');button.type='button';button.className='btn';
    button.dataset.originalPdf=kind;button.dataset.pdfExam=id;button.textContent=label;button.setAttribute('aria-pressed','false');
    if(!source[kind].url){button.disabled=true;button.title=source[kind].reason;button.setAttribute('aria-describedby','original-pdf-missing');}
    group.append(button);
  }
  return group;
}
function viewer(id,kind){
  const source=originalPdfs[id],file=source[kind],label=kind==='questions'?'Origineel tentamen':'Officiële uitwerking';
  const box=document.createElement('section');box.className='original-pdf-viewer';box.dataset.pdfExam=id;
  box.innerHTML='<header class="original-pdf-head"><strong>'+label+' · '+htmlEscape(source.date.split('-').reverse().join('-'))+'</strong><button type="button" class="btn" data-pdf-close="'+kind+'">'+(kind==='questions'?'Terug naar casus':'Sluiten')+'</button></header>'+
    '<p class="original-pdf-link"><a target="_blank" rel="noopener" href="'+file.url+'">Open PDF in een nieuw tabblad</a></p>'+
    '<iframe title="'+htmlEscape(label+' '+file.title)+'" src="'+file.url+'#view=FitH" loading="eager"></iframe>';
  return box;
}
function closeLeft(){
  if(!left)return;
  left.viewer.remove();for(const item of left.children)item.node.hidden=item.hidden;
  left.panel.classList.remove('original-pdf-left');
  if(left.wrapper){let content=left.primary;while(content.parentElement&&content.parentElement!==left.wrapper)content=content.parentElement;
    left.wrapper.before(content);left.wrapper.remove();}
  left=null;updatePressed();
}
function closeRight(){rightRequest++;if(right?.open)dock.hide();document.body.classList.remove('original-pdf-open');}
function updatePressed(){
  document.querySelectorAll('[data-original-pdf]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.originalPdf==='questions'?left?.id===b.dataset.pdfExam:right?.open&&right.dataset.pdfExam===b.dataset.pdfExam)));
}
function openLeft(id,opener){
  if(left?.id===id){closeLeft();return;}
  closeLeft();document.querySelector('.cirrus-case-float [data-float-close]')?.click();
  const ctx=context();let panel=ctx.host?.querySelector('.exam-case-panel'),wrapper=null,primary=null;
  if(panel){
    if(panel.hidden){const toggle=ctx.host.querySelector('[data-exam-action="section"],[data-practice-case]');toggle?.click();panel=ctx.host.querySelector('.exam-case-panel');}
  }else{
    primary=ctx.host?.querySelector('.exam-dashboard-content,.exam-paper,.exam-results-panel');if(!primary)return;
    wrapper=document.createElement('div');wrapper.className='original-pdf-dashboard-layout';
    panel=document.createElement('aside');panel.className='original-pdf-dashboard-pane';
    primary.before(wrapper);wrapper.append(panel,primary);
  }
  if(!panel||panel.hidden)return;
  const children=[...panel.children].map(node=>({node,hidden:node.hidden}));children.forEach(({node})=>node.hidden=true);
  const box=viewer(id,'questions');panel.classList.add('original-pdf-left');panel.append(box);
  left={id,panel,children,viewer:box,wrapper,primary,opener};updatePressed();
}
async function openRight(id,opener){
  if(right?.open&&right.dataset.pdfExam===id){closeRight();return;}
  const request=++rightRequest;
  if(!right){
    right=document.createElement('dialog');right.id='exam-original-solutions';right.className='study-assistant original-pdf-right';right.setAttribute('aria-label','Officiële uitwerking PDF');document.body.append(right);
    dock=createAssistantPanel(right,{fallbackSelector:'.exam-dashboard-content,.exam-paper'});
    right.addEventListener('close',()=>{if(right.open)return;right.replaceChildren();document.body.classList.remove('original-pdf-open');updatePressed();});
  }
  const assistant=document.getElementById('study-assistant'),key=context().key;
  if(assistant?.open)await new Promise(resolve=>{assistant.addEventListener('close',resolve,{once:true});assistant.close();});
  if(context().key!==key||request!==rightRequest)return;
  right.dataset.pdfExam=id;const box=viewer(id,'solutions');
  const restore=document.createElement('button');restore.type='button';restore.className='btn';restore.dataset.pdfAssistant='';restore.textContent='Terug naar assistent';
  if(window.StudyAssistant)box.querySelector('header').append(restore);
  right.replaceChildren(box);dock.show(opener);document.body.classList.add('original-pdf-open');updatePressed();
}
function mount(){
  queued=false;const ctx=context();if(currentKey&&currentKey!==ctx.key){closeLeft();closeRight();}currentKey=ctx.key;
  const target=ctx.host?.querySelector('.exam-cirrus-actions,.question-nav .nav-right,.question-nav,.exam-welcome-actions,.exam-paper .actions');
  if(target&&originalPdfs[ctx.id]&&!target.querySelector('.original-pdf-actions'))target.append(actions(ctx.id));
  const welcome=ctx.host?.querySelector('.exam-paper');
  if(location.hash.startsWith('#welkom/')&&welcome&&originalPdfs[ctx.id]&&!welcome.querySelector('.original-pdf-actions'))welcome.append(actions(ctx.id));
  document.querySelectorAll('#exam-app a.exam-name').forEach(link=>{
    const href=link.getAttribute('href'),m=href?.match(/^#(welkom|tentamen|inzage)\/([^/]+)/);if(!m)return;
    const id=m[1]==='welkom'?m[2]:CafaExams.getAttempts().find(a=>a.id===m[2])?.exam.id;
    if(originalPdfs[id]&&!link.parentElement.querySelector('.original-pdf-actions'))link.parentElement.append(actions(id));
  });
  if(document.querySelector('[data-original-pdf]:disabled')&&!document.getElementById('original-pdf-missing')){
    const notice=document.createElement('p');notice.id='original-pdf-missing';notice.className='original-pdf-missing';notice.textContent='19-04-2021: de originele opgaven-PDF ontbreekt; alleen het oorspronkelijke Word-bestand is beschikbaar. De officiële uitwerking is wel beschikbaar.';
    (document.querySelector('#exam-app .exam-dashboard-help')||ctx.host)?.append(notice);
  }
  updatePressed();
}
function schedule(){if(!queued){queued=true;requestAnimationFrame(mount);}}
document.addEventListener('click',event=>{
  if(event.target.closest('[data-cirrus-float],[data-exam-action="section"],[data-practice-case]')&&left)closeLeft();
  const close=event.target.closest('[data-pdf-close]');if(close){if(close.dataset.pdfClose==='questions')closeLeft();else closeRight();return;}
  if(event.target.closest('[data-pdf-assistant]')){window.StudyAssistant?.open();return;}
  const button=event.target.closest('[data-original-pdf]');if(!button||button.disabled)return;
  if(button.dataset.originalPdf==='questions')openLeft(button.dataset.pdfExam,button);else openRight(button.dataset.pdfExam,button);
},true);
// Keep the source PDF visible until the introductory Continue action is accepted.
window.addEventListener('cafa:assistant-start',event=>{
  const closed=right?.open?new Promise(resolve=>right.addEventListener('close',resolve,{once:true})):null;
  closeRight();if(closed)event.detail?.waitUntil?.(closed);
});
window.addEventListener('hashchange',()=>{closeLeft();closeRight();schedule();});
window.addEventListener('cafa:ready',schedule);
new MutationObserver(records=>{if(records.some(r=>r.type==='childList'||r.target.matches?.('.question')))schedule();}).observe(document.getElementById('app-content'),{childList:true,subtree:true});
mount();
