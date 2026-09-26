(function () {
  'use strict';
  function isStock(table) {
    var header=table.tHead && table.tHead.rows[0];
    return !!(header && header.cells.length===6 && /datum/i.test(header.cells[0].textContent) && /voorraad/i.test(header.cells[1].textContent) && /intercompany/i.test(header.cells[2].textContent));
  }
  function esc(value) { return String(value==null?'':value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function template(question) {
    if(question && question.answerSchema)return question.answerSchema;
    if(question && question.type==='Voorraadtabel' && question.caseTables){
      var exercise=question.caseTables.find(function(t){return t.headers&&t.headers.length===6&&/datum/i.test(t.headers[0])&&/voorraad/i.test(t.headers[1]);});
      if(exercise)return {headers:exercise.headers,rows:exercise.rows};
    }
    if(!question || question.type!=='open' || !question.promptHtml)return null;
    var box=document.createElement('div');box.innerHTML=window.CafaAnswerEditor.sanitize(question.promptHtml);
    var table=Array.from(box.querySelectorAll('table')).find(isStock);
    if(!table)return null;
    var headers=Array.from(table.tHead.rows[0].cells,function(c){return c.textContent.trim();});
    var rows=Array.from(table.tBodies[0].rows,function(row){return Array.from(row.cells,function(c){return c.textContent.trim();});});
    if(!rows.some(function(row){return /toe\s*\/\s*afname/i.test(row[0]);}))return null;
    // Earlier saved September 2025 attempts placed percentages in the headings.
    // Restore their original separate percentage row without altering the attempt snapshot.
    if(!rows.some(function(row){return row.some(function(c){return /%/.test(c);});}) && headers.some(function(c){return /\(100%\)/.test(c);})) {
      var percentages=headers.map(function(h){var m=h.match(/\((100|…)%\)/);return m?m[1]+'%':'';});
      headers=headers.map(function(h){return h.replace(/\s*\((100|…)%\)/,'');});rows.unshift(percentages);
    }
    return {headers:headers,rows:rows};
  }
  function render(schema,cells,readonly) {
    cells=cells&&typeof cells==='object'?cells:{};
    function field(key,label,placeholder) {
      var value=typeof cells[key]==='string'?cells[key]:'';
      return readonly?'<span class="stock-value">'+esc(value||'—')+'</span>':'<input type="text" data-stock-cell="'+key+'" aria-label="'+esc(label)+'" value="'+esc(value)+'" placeholder="'+esc(placeholder||'')+'" autocomplete="off" spellcheck="false">';
    }
    var head=schema.headers.map(function(label,c){
      var placeholder=label.match(/…\.?|\.{3,}/);
      return '<th scope="col">'+(placeholder?esc(label.replace(placeholder[0],''))+field('h-'+c,label,'Naam'):esc(label))+'</th>';
    }).join('');
    var rows=schema.rows.map(function(row,r){
      var percentage=row.some(function(cell){return /%/.test(cell);}),total=/toe\s*\/\s*afname|toename|afname/i.test(row[0]);
      return '<tr'+(total?' class="stock-total"':'')+'>'+row.map(function(value,c){
        if(c===0)return '<th scope="row">'+esc(value)+'</th>';
        var editable=percentage?/…|\.{3}/.test(value):!value || /…|\.{3}/.test(value);
        var label=(percentage?'Percentage':row[0])+', '+schema.headers[c];
        return '<td>'+(editable?field('r'+r+'-c'+c,label,percentage?'…%':''):esc(value))+'</td>';
      }).join('')+'</tr>';
    }).join('');
    return '<div class="stock-scroll" tabindex="0" role="region" aria-label="Voorraadtabel, horizontaal verschuifbaar"><table class="stock-matrix"><caption>'+(readonly?'Jouw ingevulde voorraadtabel':'Vul de voorraadtabel in')+'</caption><thead><tr>'+head+'</tr></thead><tbody>'+rows+'</tbody></table></div>';
  }
  function mount(host,schema,cells,onChange) {
    host.innerHTML='<p class="stock-scroll-hint">De tabel heeft dezelfde rijen en kolommen als het tentamen. Veeg of schuif naar rechts voor de overige kolommen. Vul de lege vakken in; gebruik Tab om naar het volgende vak te gaan.</p>'+render(schema,cells,false);
    host.addEventListener('input',function(event){if(!event.target.matches('[data-stock-cell]'))return;
      var values={};host.querySelectorAll('[data-stock-cell]').forEach(function(input){if(input.value.trim())values[input.dataset.stockCell]=input.value;});onChange(values);
    });
  }
  function enhance(root) {
    root.querySelectorAll('table').forEach(function(table){
      if(!isStock(table)||table.classList.contains('stock-matrix'))return;
      table.classList.add('stock-matrix');
      var wrap=document.createElement('div');wrap.className='stock-scroll';wrap.tabIndex=0;wrap.setAttribute('role','region');wrap.setAttribute('aria-label','Voorraadtabel, horizontaal verschuifbaar');
      table.parentNode.insertBefore(wrap,table);wrap.appendChild(table);
      var hint=document.createElement('p');hint.className='stock-scroll-hint';hint.textContent='Veeg of schuif naar rechts om alle kolommen te zien.';wrap.before(hint);
    });
  }
  window.CafaStockTable={template:template,mount:mount,render:render,enhance:enhance};
}());
