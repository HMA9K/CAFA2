/* Shared document rendering for new and previously saved exam attempts. */
(function () {
  'use strict';
  var Editor=window.CafaAnswerEditor;
  function escape(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function styledText(root,runs,solution){
    var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[],node;
    while((node=walker.nextNode()))nodes.push(node);
    nodes.forEach(function(node){
      var text=node.data,ranges=[];
      runs.forEach(function(run){
        if(run.text.length<20 && text.trim()!==run.text)return;
        var start=text.indexOf(run.text);
        while(start!==-1){
          if(!ranges.some(function(r){return start<r.end&&start+run.text.length>r.start;}))ranges.push({start:start,end:start+run.text.length,bold:run.bold,red:run.red});
          start=text.indexOf(run.text,start+run.text.length);
        }
      });
      if(!ranges.length)return;
      ranges.sort(function(a,b){return a.start-b.start;});var fragment=document.createDocumentFragment(),offset=0;
      ranges.forEach(function(r){fragment.appendChild(document.createTextNode(text.slice(offset,r.start)));var span=document.createElement(r.bold?'strong':'span');if(r.red)span.className='exam-source-points';span.textContent=text.slice(r.start,r.end);fragment.appendChild(span);offset=r.end;});
      fragment.appendChild(document.createTextNode(text.slice(offset)));node.replaceWith(fragment);
    });
  }
  function grading(root){
    var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[],node;
    while((node=walker.nextNode()))if(!node.parentElement.closest('.exam-source-points'))nodes.push(node);
    nodes.forEach(function(n){
      var pattern=/\((?:\d{1,2}(?:[.,]\d+)?|½|¼|¾|[1-3]\/[24])(?:\s+punten?)?\)/g,match,offset=0,fragment=document.createDocumentFragment();
      while((match=pattern.exec(n.data))){fragment.appendChild(document.createTextNode(n.data.slice(offset,match.index)));var mark=document.createElement('span');mark.className='exam-source-points';mark.textContent=match[0];fragment.appendChild(mark);offset=pattern.lastIndex;}
      if(offset){fragment.appendChild(document.createTextNode(n.data.slice(offset)));n.replaceWith(fragment);}
    });
  }
  // The Olbia calculation uses an internal fair-value column and a total
  // column on the official model. Reuse only values from its transcription.
  function purchaseCalculation(root){
    root.querySelectorAll('table').forEach(function(table){
      var rows=Array.from(table.querySelectorAll('tbody tr'));
      if(rows.length!==12||rows[0].cells[0].textContent.trim()!=='Eigen vermogen Olbia'||rows[11].cells[0].textContent.trim()!=='Betaalde prijs')return;
      table.classList.add('exam-purchase-calculation');
      var values=rows.map(function(r){return Array.from(r.cells,function(c){return c.textContent.trim();});});
      table.tHead.innerHTML='<tr><th scope="col">Berekening</th><th scope="col">Fair value (€)</th><th scope="col">Totaal (€)</th><th scope="col">Punten</th></tr>';
      table.tBodies[0].innerHTML=values.map(function(c,i){
        var internal=i>=3&&i<=6,amount=c[1],negative=/^-/.test(amount),positive=/^\+/.test(amount);
        amount='€ '+amount.replace(/^[+-]/,'')+(negative?' -/-':positive?' +':'');
        var label=c[0].replace(/^Fair value aanpassing: /,'- ');
        var heading=i===3?'<tr class="exam-calculation-heading"><td colspan="4">Fair value aanpassingen:</td></tr>':'';
        return heading+'<tr'+([2,7,8,11].includes(i)?' class="exam-calculation-subtotal"':i===9?' class="exam-calculation-gap"':'')+'><td>'+escape(label)+'</td><td class="exam-number">'+(internal?escape(amount):'')+'</td><td class="exam-number">'+(internal?'':escape(amount))+'</td><td class="exam-source-points">'+(c[2]?'('+escape(c[2])+')':'')+'</td></tr>';
      }).join('');
    });
  }
  function tables(root,solution){
    root.querySelectorAll('table').forEach(function(table){
      var heads=Array.from(table.querySelectorAll('thead th')),labels=heads.map(function(h){return h.textContent.trim();});
      var pointIndex=labels.findIndex(function(t){return /^(Punten|Puntentoekenning|Score|Normering)$/i.test(t);});
      table.querySelectorAll('tbody tr').forEach(function(row){
        Array.from(row.cells).forEach(function(cell,i){
          if(i===pointIndex){cell.classList.add('exam-source-points');if(/^(?:\d+(?:[.,]\d+)?|½|¼|¾)$/.test(cell.textContent.trim()))cell.textContent='('+cell.textContent.trim()+')';}
          else if(/^[€£$+−–\-\d\s.,%()/×x]+$/.test(cell.textContent.trim())&&cell.textContent.trim())cell.classList.add('exam-number');
        });
      });
      // The transcription added explanatory column headers that do not occur in
      // the financial workings. Keep them accessible, but restore the paper layout.
      if(solution&&/^(Berekening|Rekening \/ toelichting|Rekening|Omschrijving|Post)$/.test(labels[0]||'')){
        table.classList.add('exam-financial-table');
        if(table.tHead&&!labels.some(function(t){return /debet|credit/i.test(t);}))table.tHead.classList.add('exam-accessible-head');
      }
      // Four-column reconciliation tables use a wide description, an internal
      // correction column, a total and grading marks, as on the source paper.
      if(solution&&labels.join('|')==='Berekening|Correctie|Bedrag|Punten'){
        table.classList.add('exam-reconciliation');
        table.querySelectorAll('tbody tr').forEach(function(row){
          var cells=Array.from(row.cells),title=cells[0].textContent.trim();
          if(!cells[1].textContent.trim()){cells[0].colSpan=2;cells[1].remove();}
          if(/^(Netto vermogenswaarde|Betaalde goodwill|Resultaat op netto vermogenswaarde)/i.test(title))row.classList.add('exam-source-total');
          if(/^Fair value correcties/i.test(title)){cells[0].innerHTML='<strong><u>'+escape(title)+'</u></strong>';}
        });
      }
    });
  }
  function render(exam,kind,html,plain){
    if(kind==='case'){
      var section=(exam.sections||[]).find(function(s){return s.contentHtml===html;});
      var presentation=section&&(window.CAFA2_CASE_PRESENTATION||{})[exam.id];
      if(presentation&&presentation[section.id])html=presentation[section.id].html;
    }
    var root=document.createElement('div');root.className='exam-document exam-source-document exam-source-'+kind;
    root.innerHTML=html?Editor.sanitize(html):'<p>'+escape(plain)+'</p>';
    if(kind==='solution'&&root.querySelector('table')&&root.firstElementChild.tagName==='TABLE'){
      var sourceExam=(window.CAFA2_EXAMS||[]).find(function(e){return e.id===exam.id;})||exam;
      var sourceQuestion=(sourceExam.questions||[]).find(function(q){return q.solutionHtml===html;});
      if(sourceQuestion&&sourceQuestion.promptHtml){var prompt=document.createElement('div');prompt.innerHTML=Editor.sanitize(sourceQuestion.promptHtml);var first=prompt.querySelector('p');if(first){first.className='exam-model-question';root.prepend(first);}}
    }
    var formats=(window.CAFA2_SOURCE_FORMAT||{})[exam.id],runs=formats&&(formats[kind==='solution'?'solution':'exam'])||[];
    if(kind==='question'){
      if(window.CafaStockTable)window.CafaStockTable.removeBlankTemplate(root);
      root.querySelectorAll('p').forEach(function(p){
        if(!/\ba\.\s/.test(p.textContent)||!/\bb\.\s/.test(p.textContent))return;
        var walker=document.createTreeWalker(p,NodeFilter.SHOW_TEXT),nodes=[],node;while((node=walker.nextNode()))nodes.push(node);
        nodes.forEach(function(n){var parts=n.data.split(/(?=\s+[a-z]\.\s)/);if(parts.length<2)return;var fragment=document.createDocumentFragment();parts.forEach(function(part,i){if(i){var span=document.createElement('span');span.className='exam-question-part';span.textContent=part;fragment.appendChild(span);}else fragment.appendChild(document.createTextNode(part));});n.replaceWith(fragment);});
      });
    }
    if(kind==='solution')purchaseCalculation(root);
    styledText(root,runs,kind==='solution');tables(root,kind==='solution');
    if(window.CafaJournalTable)window.CafaJournalTable.enhance(root);
    if(kind==='solution')grading(root);
    // All supplied CAFA2 exam covers carry the Nyenrode logo; practice fixtures do not.
    if(/^cafa2-\d{8}$/.test(exam.id) && kind==='exam'){var header=document.createElement('div');header.className='exam-source-brand';var logo=document.createElement('img');logo.src='assets/nyenrode-logo.png';logo.alt='Nyenrode Business Universiteit';logo.width=262;logo.height=59;header.appendChild(logo);root.prepend(header);}
    return root.outerHTML;
  }
  window.CafaExamDocument={render:render};
}());
