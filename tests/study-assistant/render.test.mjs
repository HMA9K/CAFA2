import test from 'node:test';
import assert from 'node:assert/strict';
import {renderMarkdown} from '../../js/study-assistant-render.mjs';

// Minimal DOM nodes keep the test independent of browser packages.
class Node {
  constructor(tag='',text=''){this.tag=tag;this.children=[];this.value=text;}
  append(...nodes){this.children.push(...nodes);}
  replaceChildren(...nodes){this.children=nodes;this.value='';}
  set textContent(text){this.value=text;this.children=[];}
  get textContent(){return this.value+this.children.map(n=>n.textContent).join('');}
}
const doc={createElement:tag=>new Node(tag),createTextNode:text=>new Node('',text)};
const nodes=(node,tag)=>[...(node.tag===tag?[node]:[]),...node.children.flatMap(n=>nodes(n,tag))];
function render(text){const root=new Node('div');renderMarkdown(root,text,doc);return root;}

test('Kopjes, nadruk en echte lijsten behouden bedragen en stapnummering',()=>{
  const root=render('## Controle\n**Uitkomst: *juist***\n\n- Eerste € 100\n- Tweede € 20\n\n3. Bereken 100 × 80%\n4. Uitkomst € 80');
  assert.equal(nodes(root,'h4')[0].textContent,'Controle');
  assert.equal(nodes(root,'strong')[0].textContent,'Uitkomst: juist');
  assert.equal(nodes(root,'em')[0].textContent,'juist');
  assert.equal(nodes(root,'ul').length,1);assert.equal(nodes(root,'ol')[0].start,3);
  assert.equal(nodes(root,'li').length,4);assert.ok(root.textContent.includes('100 × 80%'));
});
test('HTML en afbeeldingen blijven tekst; code en escaped Markdown worden niet uitgevoerd',()=>{
  const root=render('<img src=x onerror="alert(1)">\n<script>alert(2)</script>\n`**code**` en \\*letterlijk\\*\n> *Toelichting*\n---');
  assert.equal(nodes(root,'img').length,0);assert.equal(nodes(root,'script').length,0);
  assert.ok(root.textContent.includes('<script>'));assert.ok(root.textContent.includes('*letterlijk*'));
  assert.equal(nodes(root,'code')[0].textContent,'**code**');assert.equal(nodes(root,'strong').length,0);
  assert.equal(nodes(root,'blockquote')[0].textContent,'Toelichting');assert.equal(nodes(root,'hr').length,1);
});
test('Standaardtabellen en oudere journaalposten behouden lege creditcellen en escaped pipes',()=>{
  const root=render('| **Stap** | Uitkomst |\n| --- | --- |\n| A \\| B | **€ 80** |\n\nRekening | Debet | Credit\nDeelneming | 100 |\nAgio | | 100');
  assert.equal(nodes(root,'table').length,2);assert.equal(nodes(root,'th')[0].scope,'col');
  assert.equal(nodes(root,'td')[0].textContent,'A | B');
  assert.deepEqual(nodes(nodes(root,'tbody')[1],'tr').map(row=>nodes(row,'td').map(c=>c.textContent)),[['Deelneming','100',''],['Agio','','100']]);
});
