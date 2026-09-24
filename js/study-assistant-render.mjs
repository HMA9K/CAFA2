/** Small safe Markdown renderer: text nodes only, no remote images or executable HTML. */
function inline(target,text,doc) {
  const pattern=/(`[^`\n]+`|\*\*[^*\n]+\*\*)/g;let cursor=0;
  for(const match of text.matchAll(pattern)) {
    target.append(doc.createTextNode(text.slice(cursor,match.index)));
    const isCode=match[0].startsWith('`'),el=doc.createElement(isCode?'code':'strong');
    el.textContent=match[0].slice(isCode?1:2,isCode?-1:-2);target.append(el);cursor=match.index+match[0].length;
  }
  target.append(doc.createTextNode(text.slice(cursor)));
}
export function renderMarkdown(target,text,doc=document) {
  target.replaceChildren();const lines=String(text).replace(/\r/g,'').split('\n');
  const cells=s=>s.trim().replace(/^\||\|$/g,'').split(/(?<!\\)\|/).map(x=>x.trim().replace(/\\\|/g,'|'));
  for(let i=0;i<lines.length;) {
    if(!lines[i].trim()){i++;continue;}
    if(lines[i].startsWith('```')){const pre=doc.createElement('pre');let body=[];i++;while(i<lines.length&&!lines[i].startsWith('```'))body.push(lines[i++]);i++;pre.textContent=body.join('\n');target.append(pre);continue;}
    if(i+1<lines.length && lines[i].includes('|') && /^\s*\|?\s*:?-{3,}/.test(lines[i+1]) && cells(lines[i+1]).every(x=>/^:?-{3,}:?$/.test(x))) {
      const wrap=doc.createElement('div');wrap.className='study-table-scroll';wrap.tabIndex=0;
      const table=doc.createElement('table'),head=doc.createElement('thead'),tr=doc.createElement('tr');
      for(const value of cells(lines[i])){const th=doc.createElement('th');th.scope='col';inline(th,value,doc);tr.append(th);}head.append(tr);table.append(head);i+=2;
      const body=doc.createElement('tbody');while(i<lines.length&&lines[i].includes('|')&&lines[i].trim()) {
        const row=doc.createElement('tr');for(const value of cells(lines[i++])){const td=doc.createElement('td');inline(td,value,doc);row.append(td);}body.append(row);
      }table.append(body);wrap.append(table);target.append(wrap);continue;
    }
    const heading=lines[i].match(/^#{1,4}\s+(.+)$/);
    if(heading){const h=doc.createElement('h4');inline(h,heading[1],doc);target.append(h);i++;continue;}
    const bullet=lines[i].match(/^\s*(?:[-*]|\d+\.)\s+(.+)$/);
    if(bullet){const p=doc.createElement('p');p.className='study-list-line';inline(p,lines[i++],doc);target.append(p);continue;}
    const p=doc.createElement('p');inline(p,lines[i++],doc);target.append(p);
  }
}
