import {plain,cleanData,refKey,normalizePractice,normalizeExam,recordRevision} from './study-assistant-schema.mjs';
/** Read-only bridge to the existing CAFA2 APIs; never changes answers, scores or timers. */
export function createCafa2Adapter(win=window) {
  const checked=new Set();let pinned=null;
  const key=(ref,attempt)=>refKey(ref)+'|'+attempt;
  function answerValue(a={},q=null) {
    const options=q?.options || [];
    const choice=Number.isInteger(a.choice) ? a.choice
      : a.optionId == null ? -1 : options.findIndex(option=>option.id===a.optionId);
    const selected=choice>=0 && choice<options.length ? choice : null;
    return {choice:selected ?? (q ? null : a.choice ?? null),
      optionId:a.optionId ?? (selected===null ? null : String.fromCharCode(65+selected)),
      text:plain(a.html || a.text || ''),
      rows:cleanData(a.journalRows || a.rows || []),
      tables:a.stockCells ? [{kind:'voorraadtabel',cells:cleanData(a.stockCells)}] : []};
  }
  function practice(code,id,archived=null) {
    const bank=win.CAFA2_DATA?.modules?.[code],q=bank?.questions?.find(x=>String(x.id)===String(id));
    if(!q)return null;
    const module=win.CafaPractice?.getModule(code)||{};
    // A missing answer in an archived attempt must never be borrowed from the live attempt.
    const a=archived ? (archived.answers?.[q.id]||{})
      : (module.answers ? module.answers[q.id] : win.CafaPractice?.getAnswer(code,q.id))||{};
    const study=win.CafaTopics?.context(code,q.id)||module;
    const ref={course:'CAFA2',kind:'practice',bankId:code,questionId:String(q.id)};
    const topic=study!==module ? win.CafaTopics?.getState?.()?.active : null;
    const lastReset=study.history?.at(-1)?.at || 'start';
    const topicRun=topic ? `|topic:${topic}:${study.history?.length||0}:${lastReset}` : '';
    const attempt=String(archived?.id || `${code}-${module.attempt||1}${topicRun}`);
    return {ref,revision:recordRevision(normalizePractice('CAFA2',code,bank,q)),attempt,title:`${bank.title} · Vraag ${q.id}`,questionTitle:q.title,type:q.type||'Vraag',
      prompt:plain(q.task||q.prompt),hasCase:!!(q.intro||q.facts?.length||q.caseTables?.length),
      canReview:true,
      defaultReview:!!archived || !!study.finished || !!a.checked || checked.has(key(ref,attempt)),studentAnswer:answerValue(a,q)};
  }
  function exam(attemptId,index) {
    const a=win.CafaExams?.getAttempts().find(x=>x.id===attemptId);
    if(!a)return null;const q=a.exam.questions[index ?? a.currentIndex];if(!q)return null;
    const ref={course:'CAFA2',kind:'exam',bankId:a.exam.id,questionId:String(q.id)};
    const answer=answerValue(a.answers[q.id]||{},q);
    const schema=win.CafaStockTable?.template(q);
    if(schema){const table=answer.tables[0]||{kind:'voorraadtabel',cells:{}};table.schema=cleanData(schema);answer.tables=[table];}
    return {ref,revision:recordRevision(normalizeExam('CAFA2',a.exam,q)),attempt:a.id,title:`${a.exam.title} ${a.exam.date||''} · ${q.title||`Vraag ${q.originalNumber ?? q.number ?? q.id}`}`,
      questionTitle:q.title,type:q.type==='open'?'Open vraag':q.type,prompt:plain(q.promptHtml||q.prompt),hasCase:!!q.sectionId,
      canReview:true,defaultReview:a.status==='completed'||checked.has(key(ref,a.id)),
      paused:a.pausedAt!=null,studentAnswer:answer};
  }
  function read() {
    if(pinned)return pinned();
    const hash=win.location.hash;
    const p=hash.match(/^#(kap|val|nvw|hk)-(\d+)$/);if(p)return practice(p[1],p[2]);
    const route=hash.slice(1).split('/').map(x=>{try{return decodeURIComponent(x);}catch{return x;}});
    if(route[0]==='tentamen')return exam(route[1]);
    if(route[0]==='inzage'&&route[2]==='vraag'&&/^\d+$/.test(route[3]))return exam(route[1],Number(route[3]));
    return null;
  }
  function markChecked(){const c=read();if(c)checked.add(key(c.ref,c.attempt));}
  function decorate(open) {
    const host=win.document.getElementById('exam-app');if(!host)return;
    const parts=win.location.hash.slice(1).split('/').map(x=>{try{return decodeURIComponent(x);}catch{return x;}});
    const feedback=host.querySelector('#cafa-exam-feedback');
    if(parts[0]==='tentamen' && feedback && !feedback.hidden)
      attach(feedback,()=>exam(parts[1]),open);
    const dialog=win.document.getElementById('exam-info-dialog');
    if(parts[0]==='tentamen' && dialog?.querySelector('#exam-info-title')?.textContent?.startsWith('Antwoord controleren'))
      attach(dialog.querySelector('.exam-modal-body')||dialog,()=>exam(parts[1]),open);
    if(parts[0]==='inzage'&&parts.length===2){
      const a=win.CafaExams?.getAttempts().find(x=>x.id===parts[1]);if(!a)return;
      for(const el of host.querySelectorAll('[data-result-id]')) {
        const index=a.exam.questions.findIndex(q=>q.id===el.dataset.resultId);if(index<0)continue;
        attach(el.querySelector('.result-expanded')||el,()=>exam(a.id,index),open);
      }
    }
    if(parts[0]==='mc-inzage') {
      const attempt=win.CafaPractice?.getCompleted().find(x=>x.id===parts[1]);if(!attempt)return;
      const bank=win.CAFA2_DATA?.modules?.[attempt.code];
      [...host.querySelectorAll('article.exam-review-item')].forEach((el,i)=>{
        if(bank?.questions[i])attach(el,()=>practice(attempt.code,bank.questions[i].id,attempt),open);
      });
    }
  }
  function attach(el,get,open) {
    if(el.querySelector('.study-inline-launch'))return;
    const button=win.document.createElement('button');button.type='button';button.className='study-inline-launch';
    button.textContent='Vraag over dit antwoord';button.addEventListener('click',e=>{e.preventDefault();pinned=get;open();});el.appendChild(button);
  }
  return {course:'CAFA2',read,markChecked,decorate,resetPin:()=>{pinned=null;},answerValue};
}
