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
      if(solution){var pattern=/\((?:\d+(?:[.,]\d+)?|½|¼|¾)(?:\s+punten?)?\)/g,match;
        while((match=pattern.exec(text))){if(!ranges.some(function(r){return match.index<r.end&&pattern.lastIndex>r.start;}))ranges.push({start:match.index,end:pattern.lastIndex,red:true});}
      }
      if(!ranges.length)return;
      ranges.sort(function(a,b){return a.start-b.start;});var fragment=document.createDocumentFragment(),offset=0;
      ranges.forEach(function(r){fragment.appendChild(document.createTextNode(text.slice(offset,r.start)));var span=document.createElement(r.bold?'strong':'span');if(r.red)span.className='exam-source-points';span.textContent=text.slice(r.start,r.end);fragment.appendChild(span);offset=r.end;});
      fragment.appendChild(document.createTextNode(text.slice(offset)));node.replaceWith(fragment);
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
        if(table.tHead)table.tHead.classList.add('exam-accessible-head');
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
    var root=document.createElement('div');root.className='exam-document exam-source-document exam-source-'+kind;
    root.innerHTML=html?Editor.sanitize(html):'<p>'+escape(plain)+'</p>';
    var formats=(window.CAFA2_SOURCE_FORMAT||{})[exam.id],runs=formats&&(formats[kind==='solution'?'solution':'exam'])||[];
    styledText(root,runs,kind==='solution');tables(root,kind==='solution');
    // Logo is extracted from the supplied cover, not redrawn or substituted.
    if(formats){var header=document.createElement('div');header.className='exam-source-brand';var logo=document.createElement('img');logo.src='assets/nyenrode-logo.png';logo.alt='Nyenrode Business Universiteit';logo.width=262;logo.height=59;header.appendChild(logo);root.prepend(header);}
    return root.outerHTML;
  }
  window.CafaExamDocument={render:render};
}());
