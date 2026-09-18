/* Runs in the head, before the first screen can be painted. */
(function () {
  'use strict';
  var root=document.documentElement,finished=false;
  root.classList.add('cafa-starting');
  function fail(){
    if(finished)return;
    root.classList.remove('cafa-starting');
    root.classList.add('cafa-start-failed');
    clearTimeout(timeout);
  }
  var timeout=setTimeout(fail,15000);
  window.CafaStartup={
    finish:function(){finished=true;clearTimeout(timeout);root.classList.remove('cafa-starting','cafa-start-failed');},
    fail:fail
  };
}());
