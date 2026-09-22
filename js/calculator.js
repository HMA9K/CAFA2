/* Own basic calculator: expression grammar, never eval/Function. */
(function(){
  if(window.CafaCalculator)return;
  var original=document.getElementById('calculator-dialog');
  var dlg=document.createElement('section');dlg.id='calculator-dialog';dlg.className='calculator-float';dlg.hidden=true;
  dlg.setAttribute('aria-labelledby','calculator-title');dlg.setAttribute('tabindex','-1');
  var keys=[['MC','MC'],['MR','MR'],['M+','M+'],['M-','M−'],['C','C'],['CE','CE'],['back','⌫'],['/','÷'],['(','('],[')',')'],['%','%'],['*','×'],['7','7'],['8','8'],['9','9'],['-','−'],['4','4'],['5','5'],['6','6'],['+','+'],['1','1'],['2','2'],['3','3'],['sqrt','√'],['sign','±'],['0','0'],['.',','],['=','=']];
  dlg.innerHTML='<header class="calculator-float-head"><div class="calculator-handle" tabindex="0" role="button" aria-label="Rekenmachine verplaatsen. Sleep of gebruik de pijltjestoetsen."><span aria-hidden="true">⠿</span><h2 id="calculator-title">Rekenmachine</h2></div><button type="button" data-calc-minimize aria-label="Rekenmachine inklappen" aria-expanded="true">−</button><button type="button" data-calc-close aria-label="Rekenmachine sluiten">×</button></header><div class="calculator-float-body"><div class="calc-display"><div class="calc-expression"></div><output class="calc-output" aria-live="polite">0</output><div class="calc-memory"></div></div><div class="calc-keys">'+keys.map(function(k){return '<button type="button" data-calc-key="'+k[0]+'"'+(k[0]==='back'?' aria-label="Laatste teken wissen"':'')+'>'+k[1]+'</button>';}).join('')+'</div><p class="calc-help">% = delen door 100. Haakjes en voorrangsregels gelden.</p><footer><span class="calc-copy-result" role="status"></span><button type="button" data-copy-calc>Kopieer uitkomst</button></footer></div>';
  if(original)original.replaceWith(dlg);else document.body.append(dlg);
  var fab=document.createElement('button');fab.type='button';fab.className='calculator-fab';fab.dataset.calcFab='';fab.setAttribute('aria-label','Rekenmachine openen');fab.setAttribute('aria-controls',dlg.id);fab.setAttribute('aria-expanded','false');
  fab.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8 6h8M8 11h2m4 0h2M8 15h2m4 0h2M8 19h2m4 0h2" stroke="currentColor" stroke-width="1.7"/></svg><span>Rekenmachine</span>';document.body.append(fab);
  var storageKey='cafa2-calculator-v2',lastOpener=null;
  var out=dlg.querySelector('.calc-output'),hist=dlg.querySelector('.calc-expression'),mem=dlg.querySelector('.calc-memory');
  var formula='',memory=0,justResult=false;
  try{var saved=JSON.parse(sessionStorage.getItem(storageKey)||'{}');if(typeof saved.formula==='string'&&saved.formula.length<200)formula=saved.formula;if(Number.isFinite(saved.memory))memory=saved.memory;justResult=!!saved.justResult;hist.textContent=saved.history||'';}catch(_){}
  function save(){try{sessionStorage.setItem(storageKey,JSON.stringify({formula:formula,memory:memory,justResult:justResult,history:hist.textContent}));}catch(_){}}

  function lex(s){
    var t=s.replace(/,/g,'.').replace(/[×x]/g,'*').replace(/[÷:]/g,'/').replace(/−/g,'-').replace(/\s/g,'').match(/(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|[()+\-*/%]/g)||[];
    if(t.join('')!==s.replace(/,/g,'.').replace(/[×x]/g,'*').replace(/[÷:]/g,'/').replace(/−/g,'-').replace(/\s/g,''))throw Error('Ongeldige invoer');
    return t;
  }
  function evaluate(s){var ts=lex(s),i=0;
    function atom(){var sign=1;while(ts[i]==='+'||ts[i]==='-'){if(ts[i++]==='-')sign=-sign;}var x;
      if(ts[i]==='('){i++;x=expr();if(ts[i++]!==')')throw Error('Haakje ontbreekt');}
      else{if(!ts[i]||!/^\d|^\./.test(ts[i]))throw Error('Vul een getal in');x=Number(ts[i++]);}
      while(ts[i]==='%'){i++;x/=100;}
      return sign*x;}
    function term(){var x=atom();while(ts[i]==='*'||ts[i]==='/'){var o=ts[i++],y=atom();if(o==='/'&&y===0)throw Error('Delen door nul');x=o==='*'?x*y:x/y;}return x;}
    function expr(){var x=term();while(ts[i]==='+'||ts[i]==='-'){var o=ts[i++],y=term();x=o==='+'?x+y:x-y;}return x;}
    if(!ts.length)return 0;var v=expr();if(i!==ts.length||!isFinite(v))throw Error('Ongeldige berekening');return v;}
  function raw(v){return String(Number(v.toPrecision(13)));}
  function fmt(v){return Number(v.toPrecision(13)).toLocaleString('nl-NL',{maximumFractionDigits:12,useGrouping:true});}
  function nice(s){return s.replace(/\*/g,'×').replace(/\//g,'÷').replace(/\./g,',');}
  function paint(){out.textContent=formula?nice(formula):'0';mem.textContent=memory?'M = '+fmt(memory):'';}
  function command(k){try{
    if(k==='C'){formula='';hist.textContent='';justResult=false;paint();return;}
    if(k==='CE'){formula=formula.replace(/(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?%?$/,'');justResult=false;paint();return;}
    if(k==='back'){formula=justResult?'':formula.slice(0,-1);justResult=false;paint();return;}
    if(k==='MC'){memory=0;paint();return;}
    if(k==='MR'){if(justResult)formula='';formula+=raw(memory);justResult=false;paint();return;}
    if(k==='MS'){memory=evaluate(formula);paint();return;}
    if(k==='M+'||k==='M-'){memory+=(k==='M+'?1:-1)*evaluate(formula);paint();return;}
    if(k==='='){var v=evaluate(formula);hist.textContent=nice(formula)+' =';formula=raw(v);out.textContent=fmt(v);justResult=true;return;}
    if(k==='sqrt'||k==='square'||k==='reciprocal'||k==='sign'){
      var v=evaluate(formula),before=nice(formula||'0');
      if(k==='sqrt'){if(v<0)throw Error('Geen reële wortel');v=Math.sqrt(v);hist.textContent='√('+before+')';}
      if(k==='square'){v=v*v;hist.textContent='('+before+')²';}
      if(k==='reciprocal'){if(v===0)throw Error('Delen door nul');v=1/v;hist.textContent='1 ÷ ('+before+')';}
      if(k==='sign'){v=-v;hist.textContent='−('+before+')';}
      formula=raw(v);justResult=true;out.textContent=fmt(v);mem.textContent=memory?'M = '+fmt(memory):'';return;}
    if(justResult&&/^[0-9.(]$/.test(k)){formula='';hist.textContent='';}
    justResult=false;
    if(k==='.'&&/\d*\.\d*$/.test(formula))return;
    if(formula.length>170)throw Error('Berekening te lang');formula+=k;paint();
  }catch(e){out.textContent=e.message;justResult=true;}}
  function perform(k){command(k);save();}
  function bounds(){var vv=window.visualViewport;return {x:vv?vv.offsetLeft:0,y:vv?vv.offsetTop:0,w:vv?vv.width:innerWidth,h:vv?vv.height:innerHeight};}
  function move(x,y){var b=bounds(),r=dlg.getBoundingClientRect();dlg.style.left=Math.max(b.x+8,Math.min(x,b.x+b.w-r.width-8))+'px';dlg.style.top=Math.max(b.y+8,Math.min(y,b.y+b.h-Math.min(r.height,b.h-16)-8))+'px';dlg.style.right='auto';dlg.style.bottom='auto';}
  function constrain(){if(dlg.hidden)return;var r=dlg.getBoundingClientRect();move(r.left,r.top);}
  function open(from){lastOpener=from||fab;dlg.hidden=false;fab.hidden=true;fab.setAttribute('aria-expanded','true');var b=bounds();if(!dlg.style.left)move(b.x+b.w-dlg.offsetWidth-18,b.y+b.h-dlg.offsetHeight-80);else constrain();paint();if(justResult&&formula)try{out.textContent=fmt(evaluate(formula));}catch(_){}dlg.focus({preventScroll:true});}
  function close(){dlg.hidden=true;fab.hidden=false;fab.setAttribute('aria-expanded','false');save();if(lastOpener&&lastOpener.isConnected&&!lastOpener.hidden)lastOpener.focus({preventScroll:true});}
  document.addEventListener('click',function(e){var b=e.target.closest('[data-calc],[data-calc-fab]');if(b){e.preventDefault();open(b);}});
  dlg.querySelector('[data-calc-close]').addEventListener('click',close);
  dlg.querySelector('[data-calc-minimize]').addEventListener('click',function(){var body=dlg.querySelector('.calculator-float-body');body.hidden=!body.hidden;this.setAttribute('aria-expanded',String(!body.hidden));this.setAttribute('aria-label',body.hidden?'Rekenmachine uitklappen':'Rekenmachine inklappen');this.textContent=body.hidden?'+':'−';constrain();});
  dlg.querySelectorAll('[data-calc-key]').forEach(function(b){b.addEventListener('click',function(){perform(b.dataset.calcKey);});});
  dlg.addEventListener('keydown',function(e){if(e.ctrlKey||e.metaKey||e.altKey||e.target.closest('.calculator-handle'))return;var k=e.key;
    if(k==='Escape'){e.preventDefault();e.stopPropagation();close();return;}
    if(k==='Enter'&&e.target.tagName==='BUTTON')return;
    if(k==='Enter'||k==='='){e.preventDefault();perform('=');}
    else if(k==='Backspace'){e.preventDefault();perform('back');}
    else if(k==='Delete'){e.preventDefault();perform('C');}
    else if(/^[0-9()+\-*/%,.]$/.test(k)){e.preventDefault();perform(k===','?'.':k);}});
  var handle=dlg.querySelector('.calculator-handle'),drag=null;
  handle.addEventListener('pointerdown',function(e){if(e.button!==0)return;var r=dlg.getBoundingClientRect();drag={id:e.pointerId,x:e.clientX-r.left,y:e.clientY-r.top};handle.setPointerCapture(e.pointerId);e.preventDefault();});
  handle.addEventListener('pointermove',function(e){if(drag&&drag.id===e.pointerId)move(e.clientX-drag.x,e.clientY-drag.y);});
  function endDrag(){drag=null;}
  handle.addEventListener('pointerup',endDrag);handle.addEventListener('pointercancel',endDrag);handle.addEventListener('lostpointercapture',endDrag);
  handle.addEventListener('keydown',function(e){var directions={ArrowLeft:[-20,0],ArrowRight:[20,0],ArrowUp:[0,-20],ArrowDown:[0,20]},d=directions[e.key];if(d){e.preventDefault();var r=dlg.getBoundingClientRect();move(r.left+d[0],r.top+d[1]);}});
  window.addEventListener('resize',constrain);if(window.visualViewport)visualViewport.addEventListener('resize',constrain);
  window.addEventListener('pagehide',save);
  window.CafaCalculator={open:open,close:close,getState:function(){return {formula:formula,memory:memory};},perform:perform};
  dlg.querySelector('[data-copy-calc]').addEventListener('click',function(){try{var txt=raw(evaluate(formula)).replace('.',',');
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(function(){dlg.querySelector('.calc-copy-result').textContent='Gekopieerd';}).catch(function(){dlg.querySelector('.calc-copy-result').textContent='Uitkomst: '+txt;});}
    else{dlg.querySelector('.calc-copy-result').textContent='Uitkomst: '+txt;}
  }catch(e){dlg.querySelector('.calc-copy-result').textContent=e.message;}});
  window.cafaCalculatorTest={evaluate:evaluate};
})();
