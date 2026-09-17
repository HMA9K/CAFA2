/* Own basic calculator: expression grammar, never eval/Function. */
(function(){
  var dlg=document.getElementById('calculator-dialog');if(!dlg)return;
  var out=dlg.querySelector('.calc-output'),hist=dlg.querySelector('.calc-expression'),mem=dlg.querySelector('.calc-memory');
  var formula='',memory=0,justResult=false;
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
  function perform(k){try{
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
  document.querySelectorAll('[data-calc]').forEach(function(b){b.addEventListener('click',function(){if(dlg.showModal){dlg.showModal();}else{dlg.setAttribute('open','');}paint();});});
  dlg.querySelector('[data-calc-close]').addEventListener('click',function(){dlg.close();});
  dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close();});
  dlg.querySelectorAll('[data-calc-key]').forEach(function(b){b.addEventListener('click',function(){perform(b.dataset.calcKey);});});
  dlg.addEventListener('keydown',function(e){if(e.ctrlKey||e.metaKey||e.altKey)return;var k=e.key;
    if(k==='Escape')return;
    if(k==='Enter'||k==='='){e.preventDefault();perform('=');}
    else if(k==='Backspace'){e.preventDefault();perform('back');}
    else if(k==='Delete'){e.preventDefault();perform('C');}
    else if(/^[0-9()+\-*/%,.]$/.test(k)){e.preventDefault();perform(k===','?'.':k);}});
  dlg.querySelector('[data-copy-calc]').addEventListener('click',function(){try{var txt=raw(evaluate(formula)).replace('.',',');
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(function(){dlg.querySelector('.calc-copy-result').textContent='Gekopieerd';}).catch(function(){dlg.querySelector('.calc-copy-result').textContent='Uitkomst: '+txt;});}
    else{dlg.querySelector('.calc-copy-result').textContent='Uitkomst: '+txt;}
  }catch(e){dlg.querySelector('.calc-copy-result').textContent=e.message;}});
  window.cafaCalculatorTest={evaluate:evaluate};
})();
