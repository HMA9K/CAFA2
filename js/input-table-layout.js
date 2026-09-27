(function () {
  'use strict';
  const mounted = new WeakMap(), storageKey = 'learning-input-table-layout-v1';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch {}
  if (!saved || Array.isArray(saved) || typeof saved !== 'object') saved = {};
  function persist(key, value) {
    delete saved[key]; saved[key] = value;
    const keys = Object.keys(saved); keys.slice(0, Math.max(0, keys.length - 100)).forEach(k => delete saved[k]);
    try { localStorage.setItem(storageKey, JSON.stringify(saved)); } catch {}
  }
  function mount(table) {
    if (mounted.has(table) || !table.rows.length || !table.getClientRects().length) return;
    const editor = table.closest('.cae-content[contenteditable="true"]');
    if (!editor && !table.querySelector('input:not([readonly]),textarea:not([readonly]),[contenteditable="true"]')) return;
    const row = table.rows[0], count = row.cells.length;
    if (count < 2 || Array.from(table.querySelectorAll('td,th')).some(c => c.colSpan > 1 || c.rowSpan > 1)) return;
    const scope = table.closest('.exam-question-body,.question') || document.body;
    const candidates = Array.from(scope.querySelectorAll('table')).filter(t => t.closest('.cae-content[contenteditable="true"]') || t.querySelector('input,textarea'));
    const position = (window.CafaExams || window.SRACirrus)?.getPosition?.();
    const questionKey = position ? position.examId + ':' + position.index : location.hash + ":" + (document.querySelector(".exam-question-identity .qnum")?.textContent || "");
    const key = location.pathname + ':' + questionKey + ':' + candidates.indexOf(table);
    const initial = Array.from(row.cells, c => c.getBoundingClientRect().width);
    const sum = initial.reduce((a,b) => a+b,0);
    const defaults = count === 6 && table.classList.contains('stock-matrix') ? [12,14,24,16,17,17] : initial.map(n => sum ? n * 100 / sum : 100 / count);
    const prior = saved[key];
    let widths = prior && Array.isArray(prior.widths) && prior.widths.length === count && prior.widths.every(n => Number.isFinite(n) && n >= 3 && n <= 94) && Math.abs(prior.widths.reduce((a,b)=>a+b,0)-100)<1 ? prior.widths.slice() : defaults.slice();
    let height = prior && Number.isFinite(prior.height) && prior.height >= 28 && prior.height <= 120 ? prior.height : 36;
    const settings = document.createElement('details'); settings.className = 'input-table-settings';
    const summary = document.createElement('summary'); summary.textContent = 'Tabel aanpassen'; settings.append(summary);
    const fields = document.createElement('div'); fields.className = 'input-table-settings-fields'; settings.append(fields);
    const widthInputs = [];
    function field(label, value, min, max, onChange) {
      const wrap = document.createElement('label'); wrap.append(document.createTextNode(label));
      const input = document.createElement('input'); input.type = 'number'; input.min = min; input.max = max; input.step = 1; input.value = value;
      input.addEventListener('change', () => {
        if (!input.validity.valid || !Number.isFinite(input.valueAsNumber)) { apply(); return; }
        onChange(input.valueAsNumber);
      }); wrap.append(input); fields.append(wrap); return input;
    }
    Array.from(row.cells).forEach((cell, i) => {
      const label = cell.textContent.trim().replace(/\s+/g,' ') || 'Kolom ' + (i+1);
      widthInputs.push(field(label + ' (%)', Math.round(widths[i]), 3, 94, value => {
        const remaining = 100-widths[i], target = 100-value;
        const next = widths.map((n,j) => j===i ? value : n * target / remaining);
        if (next.some(n => n < 3)) { apply(); return; }
        widths = next; commit();
      }));
    });
    const heightInput = field('Rijhoogte (px)', height, 28, 120, value => { height=value; commit(); });
    const reset = document.createElement('button'); reset.type='button'; reset.textContent='Standaard herstellen';
    reset.addEventListener('click', () => { widths=defaults.slice();height=36;commit(); }); fields.append(reset);
    function apply() {
      table.classList.add('input-table-adjustable'); table.style.setProperty('table-layout','fixed','important');
      Array.from(table.rows[0]?.cells || []).forEach((cell,i) => cell.style.setProperty('width',widths[i]+'%','important'));
      table.style.setProperty('--input-table-row-height',height+'px');
      widthInputs.forEach((input,i) => input.value=String(Math.round(widths[i])));heightInput.value=height;
    }
    function commit() { apply(); persist(key,{widths,height}); }
    if (editor) editor.closest('.cafa-answer-editor').insertBefore(settings,editor);
    else table.parentNode.insertBefore(settings,table);
    settings.inputTableReference=table;mounted.set(table,{settings,apply,count}); apply();
  }
  function scan() {
    document.querySelectorAll('table:has(input:not([readonly]),textarea:not([readonly]),[contenteditable="true"]),.cae-content[contenteditable="true"] table').forEach(table => {
      const state=mounted.get(table);
      if (state) {
        if (!table.rows.length || table.rows[0].cells.length!==state.count) {state.settings.remove();mounted.delete(table);mount(table);}
        else state.apply();
      } else mount(table);
    });
    document.querySelectorAll('.input-table-settings').forEach(settings => {
      if (!settings.inputTableReference?.isConnected) settings.remove();
    });
  }
  let queued=false;
  function queue(){if (!queued) { queued=true;requestAnimationFrame(()=>{queued=false;scan();}); }}
  new MutationObserver(records => {
    if(records.some(record => record.target.closest?.('table') || Array.from(record.addedNodes).concat(Array.from(record.removedNodes)).some(node => node.nodeType===1 && (node.tagName==='TABLE' || node.querySelector('table'))))) queue();
  }).observe(document.body,{childList:true,subtree:true});
  window.addEventListener('hashchange',queue);
  window.addEventListener('resize',queue);
  document.addEventListener('change',queue);
  scan();
})();
