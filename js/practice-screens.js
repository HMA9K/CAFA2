(function(){
  'use strict';
  const cache=new Map(),details=new Map();let manifest,active=null,revision=0,replaying=false;
  function questionId(){const id=location.hash.slice(1);return /^(kap|val|nvw|hk)-\d+$/.test(id)?id:null;}
  function remember(){
    if(!active)return;
    details.set(active.id,Array.from(active.querySelectorAll('details[id]')).map(d=>[d.id,d.open]));
    window.dispatchEvent(new CustomEvent('cafa:question-unmount',{detail:active}));
    active.remove();active=null;
  }
  function replay(){replaying=true;try{window.dispatchEvent(new HashChangeEvent('hashchange'));}finally{replaying=false;}}
  async function text(id){
    if(cache.has(id))return cache.get(id);
    const response=await fetch(manifest[id].url,{credentials:'same-origin'});
    if(!response.ok)throw new Error('De oefenvraag kon niet worden geladen.');
    const html=await response.text();cache.set(id,html);
    // Cache strings only. A visited question never retains an inactive DOM or editor.
    if(cache.size>6)cache.delete(cache.keys().next().value);
    return html;
  }
  async function route(){
    const token=++revision,id=questionId();
    if(active?.id===id)return;
    remember();
    const notice=document.getElementById('practice-loading');
    if(!id){notice.hidden=true;document.documentElement.classList.remove('practice-screen-loading');return;}
    if(!manifest[id]){notice.hidden=false;notice.textContent='Deze oefenvraag bestaat niet.';return;}
    notice.hidden=false;notice.textContent='Oefenvraag wordt geladen…';
    document.documentElement.classList.add('practice-screen-loading');
    try{
      const html=await text(id);if(token!==revision||questionId()!==id)return;
      const template=document.createElement('template');template.innerHTML=html;
      const question=template.content.firstElementChild;
      if(question?.id!==id||!question.matches('.question'))throw new Error('De oefenvraag heeft een ongeldig formaat.');
      active=question;document.getElementById('app-content').append(question);
      window.CafaPractice.mountQuestion(question);
      window.CafaPracticeUpgrades.mountQuestion(question);
      window.CafaTheoryPanels.mount();
      window.CafaPracticeCase.mount(question);
      window.CafaTopics.mountQuestion(question);
      window.CafaPractice.refresh();window.CafaFeedback.mountQuestion(question);
      for(const [key,open] of details.get(id)||[]){const d=document.getElementById(key);if(d&&question.contains(d))d.open=open;}
      notice.hidden=true;document.documentElement.classList.remove('practice-screen-loading');
      // Browsers resolve :target when the hash changes, before an asynchronous
      // question exists. Re-resolve the same history entry after mounting it.
      if(!question.matches(':target')){
        history.replaceState(history.state,'',location.pathname+location.search);
        location.replace('#'+id);
      }else replay();
      window.dispatchEvent(new CustomEvent('cafa:question-mounted',{detail:question}));
    }catch(error){
      if(token!==revision)return;remember();cache.delete(id);notice.hidden=false;notice.textContent=error.message+' ';
      const retry=document.createElement('button');retry.type='button';retry.className='btn';retry.textContent='Opnieuw proberen';retry.addEventListener('click',route);notice.append(retry);
    }
  }
  window.addEventListener('hashchange',event=>{
    if(replaying||!manifest)return;
    if(questionId()){
      if(active?.id!==questionId()){event.stopImmediatePropagation();route();}
    }else{++revision;remember();document.getElementById('practice-loading').hidden=true;document.documentElement.classList.remove('practice-screen-loading');}
  },true);
  window.CafaScreens={async start(){
    const response=await fetch('data/practice-screens.json');if(!response.ok)throw new Error('Vraagindex ontbreekt.');
    manifest=await response.json();await route();
  }};
})();
