/* SRA-style, non-modal calculator. A bounded expression parser; no code execution. */
(function () {
  'use strict';
  if (window.CafaCalculator) return;
  var original = document.getElementById('calculator-dialog');
  var dlg = document.createElement('section');
  dlg.id = 'calculator-dialog';
  dlg.className = 'calculator-float';
  dlg.hidden = true;
  dlg.setAttribute('role', 'dialog');
  dlg.setAttribute('aria-modal', 'false');
  dlg.setAttribute('aria-labelledby', 'calculator-title');
  dlg.setAttribute('tabindex', '-1');
  var keys = [
    ['7','7'], ['8','8'], ['9','9'], ['/','/'],
    ['4','4'], ['5','5'], ['6','6'], ['*','*'],
    ['1','1'], ['2','2'], ['3','3'], ['-','-'],
    ['0','0'], ['.', '.'], ['(', '('], [')', ')'],
    ['sqrt(', '√'], ['ln(', 'ln'], ['exp(', 'exp'], ['^', '^'],
    ['C', 'C'], ['back', '⌫'], ['=', '='], ['+', '+']
  ];
  function keyMarkup(k) {
    var labels = {'back':'Laatste teken wissen', '^':'Macht', 'sqrt(':'Vierkantswortel',
      'ln(':'Natuurlijke logaritme', 'exp(':'Exponentiële functie', 'C':'Berekening wissen', '=':'Bereken uitkomst'};
    return '<button type="button" data-calc-key="' + k[0] + '"' +
      (labels[k[0]] ? ' aria-label="' + labels[k[0]] + '"' : '') + '>' + k[1] + '</button>';
  }
  dlg.innerHTML = '<header class="calculator-float-head">' +
    '<div class="calculator-handle" tabindex="0" role="button" aria-label="Rekenmachine verplaatsen. Sleep of gebruik de pijltjestoetsen.">' +
    '<span aria-hidden="true">⠿</span><h2 id="calculator-title">Rekenmachine</h2></div>' +
    '<button type="button" data-calc-minimize aria-label="Rekenmachine inklappen" aria-expanded="true">−</button>' +
    '<button type="button" data-calc-close aria-label="Rekenmachine sluiten">×</button></header>' +
    '<div class="calculator-float-body"><label for="calc-expression">Berekening</label>' +
    '<input id="calc-expression" class="calc-input" inputmode="text" autocomplete="off" spellcheck="false" maxlength="180" ' +
    'aria-describedby="calc-input-help" placeholder="Bijv. 3740 * (636 - 97185 / 165)">' +
    '<output class="calc-output" for="calc-expression" aria-live="polite" aria-label="Uitkomst">0</output>' +
    '<div class="calc-keys">' + keys.map(keyMarkup).join('') + '</div>' +
    '<p id="calc-input-help" class="calc-help">Sleep de kop om ruimte te maken. Je kunt de vraag blijven lezen en beantwoorden. Punt of komma voor decimalen, zonder duizendtallen.</p>' +
    '<details class="calc-extra"><summary>Geheugen en extra functies<span class="calc-memory-flag" aria-label="Geheugen gevuld" hidden> M</span></summary>' +
    '<div class="calc-extra-keys">' + [['MC','MC'],['MR','MR'],['M+','M+'],['M-','M−'],['CE','CE'],['%','%'],['sign','±'],['reciprocal','1/x']].map(keyMarkup).join('') + '</div>' +
    '<div class="calc-memory" aria-live="polite"></div><p class="calc-extra-help">% deelt door 100. MC wist het geheugen; MR haalt het op. M+ en M− voegen de uitkomst toe of trekken deze af.</p>' +
    '<footer><span class="calc-copy-result" role="status"></span><button type="button" data-copy-calc>Kopieer uitkomst</button></footer></details></div>';
  if (original) original.replaceWith(dlg);
  else document.body.appendChild(dlg);

  // Use the existing topbar control, or add the same compact icon to the summary.
  // Never place another floating button over the question navigation.
  var icon = '<svg class="calc-icon" aria-hidden="true" viewBox="0 0 20 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="1" width="14" height="21" rx="1"/><path d="M6 5h8v4H6zM6 12h2m2 0h2m2 0h1M6 15h2m2 0h2m2 0h1M6 18h2m2 0h2m2 0h1"/></svg>';
  var toolbar = document.querySelector('.top-controls, .reader-top-tools');
  var trigger = toolbar && toolbar.querySelector('[data-calc]');
  if (!trigger) {
    trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.setAttribute('data-calc', '');
    trigger.innerHTML = icon;
    if (toolbar) toolbar.prepend(trigger);
    else {
      toolbar = document.createElement('div');
      toolbar.className = 'calculator-standalone-tools';
      toolbar.appendChild(trigger);
      document.body.prepend(toolbar);
    }
  }
  trigger.classList.add('calculator-toolbar-trigger');
  trigger.title = 'Rekenmachine';
  trigger.setAttribute('aria-label', 'Rekenmachine openen');
  trigger.setAttribute('aria-controls', dlg.id);
  trigger.setAttribute('aria-expanded', 'false');
  var input = dlg.querySelector('.calc-input'), out = dlg.querySelector('.calc-output');
  var mem = dlg.querySelector('.calc-memory'), flag = dlg.querySelector('.calc-memory-flag');
  var body = dlg.querySelector('.calculator-float-body'), minimize = dlg.querySelector('[data-calc-minimize]');
  var storageKey = 'cafa2-calculator-v2', lastOpener = trigger;
  var formula = '', memory = 0, result = '0', justResult = false;
  var errorShown = false, drag = null, manuallyPlaced = false;

  function normalized(s) {
    return s.replace(/,/g, '.').replace(/[×x]/g, '*').replace(/[÷:]/g, '/').replace(/−/g, '-').replace(/\s/g, '');
  }
  function lex(s) {
    // Do not normalize the x in exp: recognize function names before single symbols.
    s = s.replace(/exp/gi, 'EXP');
    s = normalized(s).replace(/EXP/g, 'exp').toLowerCase();
    if (s.length > 180) throw Error('Berekening te lang');
    var ts = s.match(/(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|sqrt|ln|exp|[()+\-*/%^]/g) || [];
    if (ts.join('') !== s) throw Error('Ongeldige invoer');
    return ts;
  }
  function evaluate(s) {
    var ts = lex(String(s)), i = 0;
    function atom() {
      var t = ts[i++], v;
      if (t === '(') {
        v = expr();
        if (ts[i++] !== ')') throw Error('Haakje ontbreekt');
      } else if (t === 'sqrt' || t === 'ln' || t === 'exp') {
        if (ts[i++] !== '(') throw Error('Gebruik haakjes bij ' + t);
        v = expr();
        if (ts[i++] !== ')') throw Error('Haakje ontbreekt');
        if (t === 'sqrt' && v < 0) throw Error('Geen reële wortel');
        if (t === 'ln' && v <= 0) throw Error('ln vereist een positief getal');
        v = t === 'sqrt' ? Math.sqrt(v) : t === 'ln' ? Math.log(v) : Math.exp(v);
      } else {
        if (!t || !/^(?:\d|\.)/.test(t)) throw Error('Vul een getal in');
        v = Number(t);
      }
      while (ts[i] === '%') { i++; v /= 100; }
      return v;
    }
    function power() {
      var v = atom();
      if (ts[i] === '^') { i++; v = Math.pow(v, unary()); }
      return v;
    }
    function unary() {
      if (ts[i] === '+') { i++; return unary(); }
      if (ts[i] === '-') { i++; return -unary(); }
      return power();
    }
    function term() {
      var v = unary();
      while (ts[i] === '*' || ts[i] === '/') {
        var op = ts[i++], rhs = unary();
        if (op === '/' && rhs === 0) throw Error('Delen door nul');
        v = op === '*' ? v * rhs : v / rhs;
      }
      return v;
    }
    function expr() {
      var v = term();
      while (ts[i] === '+' || ts[i] === '-') {
        var op = ts[i++], rhs = term();
        v = op === '+' ? v + rhs : v - rhs;
      }
      return v;
    }
    if (!ts.length) return 0;
    var v = expr();
    if (i !== ts.length || !Number.isFinite(v)) throw Error('Ongeldige berekening');
    return v;
  }
  function raw(v) { return String(Number(v.toPrecision(13))); }
  function fmt(v) { return Number(v.toPrecision(13)).toLocaleString('nl-NL', { maximumFractionDigits:12 }); }
  try {
    var saved = JSON.parse(sessionStorage.getItem(storageKey) || '{}');
    if (typeof saved.formula === 'string' && saved.formula.length <= 180) formula = saved.formula;
    if (Number.isFinite(saved.memory)) memory = saved.memory;
    justResult = !!saved.justResult;
    if (justResult && formula) result = fmt(evaluate(formula));
    else if (typeof saved.result === 'string' && saved.result.length < 100) result = saved.result;
  } catch (_) { /* A blocked store must not prevent calculation. */ }
  function save() {
    try { sessionStorage.setItem(storageKey, JSON.stringify({formula:formula, memory:memory, justResult:justResult, result:result})); }
    catch (_) {}
  }
  function paint() {
    if (input.value !== formula) input.value = formula;
    out.textContent = result;
    out.classList.toggle('calc-error', errorShown);
    input.setAttribute('aria-invalid', String(errorShown));
    mem.textContent = memory ? 'M = ' + fmt(memory) : 'Geheugen leeg';
    flag.hidden = !memory;
  }
  function insert(text) {
    var focused = document.activeElement === input;
    var start = focused ? input.selectionStart : formula.length;
    var end = focused ? input.selectionEnd : formula.length;
    if (justResult && !focused) {
      if (/^[+\-*/^%]$/.test(text)) formula = raw(evaluate(formula));
      else formula = '';
      start = end = formula.length;
    }
    if (formula.length - (end - start) + text.length > 180) throw Error('Berekening te lang');
    formula = formula.slice(0, start) + text + formula.slice(end);
    justResult = false;
    input.value = formula;
    input.setSelectionRange(start + text.length, start + text.length);
  }
  function command(k) {
    errorShown = false;
    dlg.querySelector('.calc-copy-result').textContent = '';
    if (k === 'C') { formula = ''; result = '0'; justResult = false; }
    else if (k === 'CE') { formula = formula.replace(/(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:[eE][+-]?\d+)?%?$/, ''); justResult = false; }
    else if (k === 'back') {
      var focused = document.activeElement === input;
      var start = focused ? input.selectionStart : formula.length;
      var end = focused ? input.selectionEnd : formula.length;
      if (start === end && start) start--;
      formula = formula.slice(0, start) + formula.slice(end);
      input.value = formula;
      input.setSelectionRange(start, start);
      justResult = false;
    } else if (k === 'MC') memory = 0;
    else if (k === 'MR') insert(memory < 0 ? '(' + raw(memory) + ')' : raw(memory));
    else if (k === 'MS') memory = evaluate(formula);
    else if (k === 'M+' || k === 'M-') {
      var next = memory + (k === 'M+' ? 1 : -1) * evaluate(formula);
      if (!Number.isFinite(next)) throw Error('Geheugen buiten bereik');
      memory = next;
    } else if (k === '=') { result = fmt(evaluate(formula)); justResult = true; }
    else if (k === 'sqrt' || k === 'square' || k === 'reciprocal' || k === 'sign') {
      var v = evaluate(formula);
      if (k === 'sqrt') { if (v < 0) throw Error('Geen reële wortel'); v = Math.sqrt(v); }
      else if (k === 'square') v *= v;
      else if (k === 'reciprocal') { if (!v) throw Error('Delen door nul'); v = 1 / v; }
      else v = -v;
      if (!Number.isFinite(v)) throw Error('Ongeldige berekening');
      formula = raw(v); result = fmt(v); justResult = true;
    } else if (/^(?:[0-9.()+\-*/%^]|sqrt\(|ln\(|exp\()$/.test(k)) insert(k);
  }
  function perform(k) {
    try { command(k); } catch (e) { result = e.message; errorShown = true; justResult = false; }
    paint(); save();
  }
  input.addEventListener('input', function () {
    formula = input.value; justResult = false; errorShown = false;
    paint(); save();
  });
  function bounds() {
    var vv = window.visualViewport;
    return {x:vv ? vv.offsetLeft : 0, y:vv ? vv.offsetTop : 0, w:vv ? vv.width : innerWidth, h:vv ? vv.height : innerHeight};
  }
  function move(x, y) {
    var b = bounds();
    dlg.style.maxHeight = Math.max(44, b.h - 16) + 'px';
    dlg.style.maxWidth = Math.max(44, b.w - 16) + 'px';
    var r = dlg.getBoundingClientRect();
    dlg.style.left = Math.max(b.x + 8, Math.min(x, b.x + b.w - r.width - 8)) + 'px';
    dlg.style.top = Math.max(b.y + 8, Math.min(y, b.y + b.h - r.height - 8)) + 'px';
    dlg.style.right = 'auto'; dlg.style.bottom = 'auto';
  }
  function constrain() { if (!dlg.hidden) { var r = dlg.getBoundingClientRect(); move(r.left, r.top); } }
  function expanded(value) {
    body.hidden = !value;
    minimize.setAttribute('aria-expanded', String(value));
    minimize.setAttribute('aria-label', value ? 'Rekenmachine inklappen' : 'Rekenmachine uitklappen');
    minimize.textContent = value ? '−' : '+';
  }
  function open(from) {
    lastOpener = from || trigger;
    dlg.hidden = false;
    expanded(true);
    trigger.setAttribute('aria-expanded', 'true');
    var b = bounds();
    if (!manuallyPlaced) {
      var header = document.querySelector('.topbar, .reader-topbar');
      var top = header ? header.getBoundingClientRect().bottom + 12 : b.y + 16;
      move(b.x + b.w - dlg.offsetWidth - 16, Math.max(b.y + 12, top));
    } else constrain();
    paint();
    // On touch devices do not force the software keyboard open over the keypad.
    if (window.matchMedia('(pointer: fine)').matches) input.focus({preventScroll:true});
    else dlg.focus({preventScroll:true});
  }
  function close() {
    dlg.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    save();
    if (lastOpener && lastOpener.isConnected && !lastOpener.hidden) lastOpener.focus({preventScroll:true});
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-calc]');
    if (b) { e.preventDefault(); open(b); }
  });
  dlg.querySelector('[data-calc-close]').addEventListener('click', close);
  minimize.addEventListener('click', function () { expanded(body.hidden); constrain(); });
  dlg.querySelector('.calc-extra').addEventListener('toggle', constrain);
  dlg.querySelectorAll('[data-calc-key]').forEach(function (button) {
    // Preserve an input selection for inserting a key, without summoning a mobile keyboard.
    button.addEventListener('pointerdown', function (e) { if (e.button === 0) e.preventDefault(); });
    button.addEventListener('click', function () { perform(button.dataset.calcKey); });
  });
  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return; }
    if (e.ctrlKey || e.metaKey || e.altKey || e.target.closest('.calculator-handle')) return;
    if (e.target === input) {
      if (e.key === 'Enter') { e.preventDefault(); perform('='); }
      return;
    }
    if (e.key === 'Enter' && e.target.tagName === 'BUTTON') return;
    if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); perform('='); }
    else if (e.key === 'Backspace') { e.preventDefault(); perform('back'); }
    else if (e.key === 'Delete') { e.preventDefault(); perform('C'); }
    else if (/^[0-9()+\-*/%^,.]$/.test(e.key)) { e.preventDefault(); perform(e.key === ',' ? '.' : e.key); }
  });
  var handle = dlg.querySelector('.calculator-handle');
  handle.addEventListener('pointerdown', function (e) {
    if (e.button !== 0) return;
    var r = dlg.getBoundingClientRect();
    drag = {id:e.pointerId, x:e.clientX - r.left, y:e.clientY - r.top};
    handle.setPointerCapture(e.pointerId); e.preventDefault();
  });
  handle.addEventListener('pointermove', function (e) {
    if (drag && drag.id === e.pointerId) { manuallyPlaced = true; move(e.clientX - drag.x, e.clientY - drag.y); }
  });
  function endDrag() { drag = null; }
  handle.addEventListener('pointerup', endDrag);
  handle.addEventListener('pointercancel', endDrag);
  handle.addEventListener('lostpointercapture', endDrag);
  handle.addEventListener('keydown', function (e) {
    var d = {ArrowLeft:[-20,0], ArrowRight:[20,0], ArrowUp:[0,-20], ArrowDown:[0,20]}[e.key];
    if (d) { e.preventDefault(); manuallyPlaced = true; var r = dlg.getBoundingClientRect(); move(r.left + d[0], r.top + d[1]); }
  });
  window.addEventListener('resize', constrain);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', constrain);
    window.visualViewport.addEventListener('scroll', constrain);
  }
  window.addEventListener('pagehide', save);
  dlg.querySelector('[data-copy-calc]').addEventListener('click', function () {
    var status = dlg.querySelector('.calc-copy-result');
    try {
      var txt = raw(evaluate(formula)).replace('.', ',');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(function () { status.textContent = 'Gekopieerd'; })
          .catch(function () { status.textContent = 'Uitkomst: ' + txt; });
      } else status.textContent = 'Uitkomst: ' + txt;
    } catch (e) { status.textContent = e.message; }
  });
  paint();
  window.CafaCalculator = {open:open, close:close, getState:function () { return {formula:formula, memory:memory}; }, perform:perform};
  window.cafaCalculatorTest = {evaluate:evaluate};
})();
