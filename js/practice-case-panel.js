(function(){
  'use strict';
  var KEY='cafa2-case-panel-v1',width=100/3,open=true;
  try{var saved=JSON.parse(sessionStorage.getItem(KEY)||'{}');if(typeof saved.width==='number')width=Math.max(25,Math.min(60,saved.width));if(typeof saved.open==='boolean')open=saved.open;}catch(_){}
  function save(){try{sessionStorage.setItem(KEY,JSON.stringify({width:width,open:open}));}catch(_){}}
  function paint(question){
    var layout=question.querySelector('.practice-case-layout');if(!layout)return;
    layout.style.setProperty('--case-width',width+'%');layout.classList.toggle('is-case-hidden',!open);
    layout.querySelector('.exam-case-panel').hidden=!open;var handle=layout.querySelector('.exam-case-resizer');handle.hidden=!open;
    handle.setAttribute('aria-valuenow',String(Math.round(width)));handle.setAttribute('aria-valuetext',Math.round(width)+' procent casusbreedte');
    question.querySelectorAll('[data-practice-case]').forEach(function(b){b.setAttribute('aria-expanded',String(open));b.setAttribute('aria-pressed',String(open));b.title=open?'Casus verbergen':'Casus tonen';});
  }
  function mount(question){
    if(question.querySelector('.practice-case-layout')){paint(question);return;}
    var bank=window.CAFA2_DATA.modules[question.dataset.code],q=bank.questions[Number(question.dataset.q)-1],body=question.querySelector('.qbody');
    if(!body)return;
    var panel=document.createElement('aside'),heading='practice-case-heading-'+question.id;panel.id='practice-case-'+question.id;panel.className='exam-case-panel';panel.setAttribute('aria-labelledby',heading);
    if(q.sourceType==='exam'){
      question.dataset.examSource=q.examId;
      var exam=window.CAFA2_EXAMS.find(function(e){return e.id===q.examId;}),section=exam.sections.find(function(s){return s.id===q.sectionId;});
      panel.innerHTML='<h2 id="'+heading+'"></h2>'+CafaExamDocument.render(exam,'case',section.contentHtml);
      panel.querySelector('h2').textContent=section.title;
      var assumptions=document.createElement('details');assumptions.className='practice-case-assumptions';assumptions.innerHTML='<summary>Algemene uitgangspunten van dit tentamen</summary>';
      var cover=document.createElement('template');cover.innerHTML=exam.introductionHtml;
      var nodes=Array.from(cover.content.children),start=nodes.findIndex(function(n){return /Algemene uitgangspunten/i.test(n.textContent);});
      if(start>=0){nodes.slice(start+1).forEach(function(n){assumptions.append(n.cloneNode(true));});panel.append(assumptions);}
      var previous=(q.dependencyQuestionIds||[]).map(function(id){return exam.questions.find(function(x){return x.id===id;});}).filter(Boolean);
      if(previous.length){
        var dependencies=document.createElement('details');dependencies.className='practice-case-dependencies';dependencies.innerHTML='<summary>Eerdere deelvragen en uitkomsten bij deze casus</summary><p>Open de uitkomst die je nodig hebt om deze vraag zelfstandig te oefenen. Dit zijn de bronuitwerkingen, onafhankelijk van je eigen eerdere antwoorden.</p>';
        previous.forEach(function(source){var detail=document.createElement('details'),summary=document.createElement('summary');summary.textContent=source.title;detail.append(summary);var prompt=document.createElement('p');prompt.textContent=source.prompt;detail.append(prompt);detail.insertAdjacentHTML('beforeend',CafaExamDocument.render(exam,'solution',source.solutionHtml,source.solution));dependencies.append(detail);});panel.append(dependencies);
      }
      if(q.siblingSourceKeys&&q.siblingSourceKeys.length){
        var siblings=document.createElement('details');siblings.className='practice-case-siblings';siblings.innerHTML='<summary>Eerdere onderdelen van deze vraag</summary>';
        var questions=Object.values(window.CAFA2_DATA.modules).flatMap(function(b){return b.questions;});
        q.siblingSourceKeys.forEach(function(key){var source=questions.find(function(x){return x.key===key;});if(!source)return;var detail=document.createElement('details'),summary=document.createElement('summary');summary.textContent=source.title;detail.append(summary);detail.insertAdjacentHTML('beforeend',source.solutionHtml);siblings.append(detail);});panel.append(siblings);
      }
      // The original prompt stays in the answer column, the complete case is on the left.
      body.querySelectorAll(':scope > .intro,:scope > .facts').forEach(function(n){n.remove();});
      panel.dataset.sourceExamId=q.examId;panel.dataset.sourceSectionId=q.sectionId;
    }else{
      var title=document.createElement('h2');title.id=heading;title.textContent='Casus · '+q.title;panel.append(title);
      body.querySelectorAll(':scope > .intro,:scope > .facts,:scope > .table-wrap').forEach(function(n){panel.append(n);});
      if(panel.children.length===1){var p=document.createElement('p');p.textContent='Bij deze begripsvraag staan alle benodigde gegevens in de vraag rechts.';panel.append(p);}
    }
    panel.querySelectorAll('table').forEach(function(t){var wrap=document.createElement('div');wrap.className='exam-case-table-scroll';t.before(wrap);wrap.append(t);});
    var handle=document.createElement('div');handle.className='exam-case-resizer';handle.tabIndex=0;handle.setAttribute('role','separator');handle.setAttribute('aria-label','Breedte van de casus links aanpassen');handle.setAttribute('aria-orientation','vertical');handle.setAttribute('aria-controls',panel.id);handle.setAttribute('aria-valuemin','25');handle.setAttribute('aria-valuemax','60');handle.innerHTML='<span aria-hidden="true">⋮</span>';
    var layout=document.createElement('div');layout.className='exam-case-layout practice-case-layout';body.before(layout);layout.append(panel,handle,body);
    function toggle(){open=!open;paint(question);save();}
    [question.querySelector('.qidentity'),question.querySelector('.nav-right')].filter(Boolean).forEach(function(host){var b=document.createElement('button');b.type='button';b.className='btn practice-action';b.dataset.practiceCase='';b.textContent='Casus';b.setAttribute('aria-controls',panel.id);b.addEventListener('click',toggle);host.append(b);});
    handle.addEventListener('pointerdown',function(e){if(e.button!==0)return;e.preventDefault();handle.setPointerCapture(e.pointerId);layout.classList.add('is-resizing');});
    handle.addEventListener('pointermove',function(e){if(!layout.classList.contains('is-resizing'))return;var r=layout.getBoundingClientRect();width=Math.max(25,Math.min(60,100*(e.clientX-r.left)/r.width));paint(question);});
    function stop(){layout.classList.remove('is-resizing');save();}
    handle.addEventListener('pointerup',stop);handle.addEventListener('pointercancel',stop);handle.addEventListener('lostpointercapture',stop);
    handle.addEventListener('keydown',function(e){var w=width;if(e.key==='ArrowLeft')w-=5;else if(e.key==='ArrowRight')w+=5;else if(e.key==='Home')w=25;else if(e.key==='End')w=60;else return;e.preventDefault();width=Math.max(25,Math.min(60,w));paint(question);save();});
    paint(question);
  }
  function route(){var el=document.getElementById(location.hash.slice(1));if(el&&el.matches('.question[data-code][data-q]'))mount(el);}
  window.addEventListener('hashchange',route);route();
  window.CafaPracticeCase={mount:mount};
}());
