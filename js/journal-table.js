(function(){
  'use strict';
  var columns=['Omschrijving grootboekrekening','Debet','Credit','Ruimte voor eventuele toelichting'];
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function supports(q){return !!q && (q.type==='Journaalpost' || q.answerKind==='journal' || /journaalpost|eliminatieboeking|correctieboeking|eliminatiepost/.test(String(q.prompt||q.task||'').toLowerCase()));}
  function normalize(rows){return Array.from({length:Math.max(8,Math.min(100,Array.isArray(rows)?rows.length:0))},function(_,i){return columns.map(function(_,j){return rows&&Array.isArray(rows[i])&&typeof rows[i][j]==='string'?rows[i][j]:'';});});}
  // Identify journal columns by their headings, never by the amounts or caption.
  // A balance with Debet/Bedrag/Credit/Bedrag is a different table.
  function enhance(root){
    root.querySelectorAll('table:not(.journal-table)').forEach(function(table){
      var heads=table.tHead&&table.tHead.rows[0];if(!heads)return;
      var labels=Array.from(heads.cells,function(c){return c.textContent.trim();});
      if((labels.length!==3&&labels.length!==4)||!/^(Omschrijving(?: grootboekrekening)?|Rekening(?: \/ toelichting)?|Grootboekrekening|Post)$/i.test(labels[0])||!/^Debet(?:\s*\(€\))?$/i.test(labels[1])||!/^Credit(?:\s*\(€\))?$/i.test(labels[2]))return;
      if(labels.length===4&&!/^(Punten|Puntentoekenning|Score|Normering)$/i.test(labels[3]))return;
      if(table.classList.contains('journal-display-table'))return;
      table.classList.add('journal-display-table');
      if(labels.length===4)table.classList.add('journal-display-with-points');
      var cols=document.createElement('colgroup');labels.forEach(function(_,i){var col=document.createElement('col');col.className=['journal-account-column','journal-debit-column','journal-credit-column','journal-points-column'][i];cols.appendChild(col);});
      Array.from(table.children).filter(function(c){return c.tagName==='COLGROUP';}).forEach(function(c){c.remove();});
      if(table.caption)table.caption.after(cols);else table.prepend(cols);
      // Older transcriptions hid these headers as if this were a calculation.
      table.tHead.classList.remove('exam-accessible-head');
      var wrap=table.parentElement;
      if(!wrap.classList.contains('table-wrap')&&!wrap.classList.contains('journal-display-scroll')){wrap=document.createElement('div');table.before(wrap);wrap.appendChild(table);}
      wrap.classList.add('journal-display-scroll');wrap.tabIndex=0;wrap.setAttribute('aria-label','Journaalpost, horizontaal schuifbaar');
    });
  }
  function render(rows,readonly){rows=normalize(rows);return '<div class="journal-scroll" tabindex="0" aria-label="Journaalpostentabel, horizontaal schuifbaar"><table class="journal-table"><thead><tr>'+columns.map(function(c){return '<th scope="col">'+c+'</th>';}).join('')+'</tr></thead><tbody>'+rows.map(function(row,i){return '<tr>'+row.map(function(cell,j){return '<td>'+(readonly?'<span>'+esc(cell)+'</span>':'<input type="text" '+(j===1||j===2?'inputmode="decimal" ':'')+'aria-label="Rij '+(i+1)+', '+columns[j]+'" data-journal-row="'+i+'" data-journal-col="'+j+'" value="'+esc(cell)+'">')+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div>'+(readonly?'':'<button type="button" class="btn journal-add">+ Rij toevoegen</button>');}
  function mount(host,rows,onChange){var current=normalize(rows);host.innerHTML=render(current,false);host.addEventListener('input',function(e){if(!e.target.matches('[data-journal-row]'))return;current[Number(e.target.dataset.journalRow)][Number(e.target.dataset.journalCol)]=e.target.value;onChange(current.map(function(r){return r.slice();}));});host.addEventListener('click',function(e){if(!e.target.closest('.journal-add')||current.length>=100)return;current.push(['','','','']);host.innerHTML=render(current,false);onChange(current.map(function(r){return r.slice();}));host.querySelector('[data-journal-row="'+(current.length-1)+'"]').focus();});}
  window.CafaJournalTable={supports:supports,normalize:normalize,render:render,mount:mount,enhance:enhance};
}());
