(function(){
  'use strict';
  var previousQuestionId = null;
  function node(tag,text,cls){var n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
  function mount(){
    document.querySelectorAll('.question[data-code][data-q]').forEach(function(question){
      var body=question.querySelector('.qbody');if(!body)return;
      if(body.querySelector('.theory-panel')){body.classList.add('has-theory-panel');return;}
      var code=question.dataset.code,id=Number(question.dataset.q),bank=window.CAFA2_DATA&&window.CAFA2_DATA.modules[code];
      var q=bank&&bank.questions.find(function(q){return q.id===id;});
      if(!q||!q.guidance)return;
      var g=q.guidance,panel=node('details',undefined,'theory-panel'),summary=node('summary'),content=node('div',undefined,'theory-content');
      panel.dataset.guidanceId=code+'-'+id;panel.open=false;
      summary.append(node('span','i','theory-icon'),node('span','Basisregels bij deze vraag'),node('span',undefined,'theory-chevron'));
      content.append(node('h3',g.title),node('p',g.rules));
      var refs=node('p',undefined,'theory-source');(q.refs||[]).forEach(function(ref,i){if(i)refs.append(document.createElement('br'));refs.append(document.createTextNode(bank.sources[ref]?bank.sources[ref].label:ref));});content.append(refs);
      var a=node('a','Lees de bijbehorende uitleg','theory-link');a.href=(location.pathname.includes('/fallback/')?'../':'')+'samenvatting.html#'+g.lesson;content.append(a);panel.append(summary,content);
      var task=body.querySelector('.task');if(task)task.after(panel);else body.prepend(panel);body.classList.add('has-theory-panel');
    });
    var match=location.hash.match(/^#(kap|val|nvw|hk)-\d+$/);
    var currentId=match?location.hash.slice(1):null;
    if(currentId!==previousQuestionId){
      document.querySelectorAll('.question .theory-panel[open]').forEach(function(panel){panel.open=false;});
      previousQuestionId=currentId;
    }
  }
  mount();window.addEventListener('hashchange',mount);
}());
