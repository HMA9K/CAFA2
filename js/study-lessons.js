/* Filtering changes presentation only; official questions and marking stay intact. */
(function(){
 'use strict';
 document.addEventListener('click',function(e){
  var b=e.target.closest('[data-exam-route-filter]');if(!b)return;
  var root=document.getElementById('tentamen'),topic=b.dataset.examRouteFilter,count=0;
  root.querySelectorAll('[data-exam-route-filter]').forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});
  root.querySelectorAll('[data-exam-route-topic]').forEach(function(x){x.hidden=topic!=='all'&&x.dataset.examRouteTopic!==topic;if(!x.hidden)count++;});
  document.getElementById('exam-route-count').textContent=count+' concrete voorbeelden';
 });
}());
