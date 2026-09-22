import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {orientation,examRoutes} from '../content/study/learning-route.mjs';
const read=p=>fs.readFileSync(p,'utf8');
const laws=JSON.parse(read('content/study/laws.json')),box={};vm.createContext(box);vm.runInContext(read('js/law-focus.js'),box);
const focus=box.CafaLawFocus;
for(const[a,m]of Object.entries(focus.cores))for(const[p,ss]of Object.entries(m))for(const s of ss)assert.ok(laws[a].paragraphs.some(t=>t.includes(s)),`Only exact source phrases: ${a}/${p}: ${s}`);
for(const[a,law]of Object.entries(laws)){
 for(const part of ['',...new Set(focus.groups(law).map(r=>'lid '+r.member))]){
  const result=focus.resolve(a,law,part,'');
  for(const row of result.rows){assert.equal(row.text,law.paragraphs[row.index]);for(const[start,end]of row.ranges)assert.ok(start>=0&&end>start&&end<=row.text.length);}
 }
}
const selected=(a,part,ctx)=>focus.resolve(a,laws[a],part,ctx).rows.filter(r=>r.ranges.length).map(r=>r.text).join(' ');
assert.match(selected('389','','onvoldoende gegevens'),/onvoldoende gegevens/);
assert.doesNotMatch(selected('389','','onvoldoende gegevens'),/reserve omrekeningsverschillen/);
assert.match(selected('389','','reserve omrekeningsverschillen'),/reserve omrekeningsverschillen/);
assert.match(selected('384','','koersverschillen en vreemde valuta'),/De grondslagen voor de omrekening/);
const exemption=focus.resolve('407',laws['407'],'lid 2','kleine groep');
assert.deepEqual(Array.from(exemption.selected),[4,5,6,7],'All cumulative conditions remain visible');
assert.ok(exemption.rows[5].ranges.some(([a,b])=>exemption.rows[5].text.slice(a,b).includes('niet')));
assert.ok(exemption.rows[6].ranges.some(([a,b])=>exemption.rows[6].text.slice(a,b).includes('geen')));
assert.ok(exemption.rows[7].ranges.some(([a,b])=>exemption.rows[7].text.slice(a,b).includes('niet')));
assert.deepEqual(Array.from(focus.requested('leden 2–3')),['2','3']);
const partial=focus.resolve('24c',laws['24c'],'lid 1','vermoeden vanaf 20%');
assert.equal(partial.rows[0].ranges.length,1,'Presumption reference highlights presumption, not unrelated definition');
const html=read('samenvatting.html');
assert.equal((html.match(/class="chapter-orientation"/g)||[]).length,7);
assert.equal(Object.keys(orientation).length,7);
assert.equal((html.match(/class="exam-route-card"/g)||[]).length,7);
assert.equal(new Set(examRoutes.map(r=>r.exam)).size,4);
for(const r of examRoutes){assert.ok(r.pages&&r.questions);assert.ok(html.includes('exam-route-'+r.id));assert.equal(r.steps.length,3);}
assert.match(html,/zichtbaar eigen vermogen/);assert.doesNotMatch(html,/€ 22.500 afschrijving via Overige reserves/);
// Explicit arithmetic in the reviewed source examples; no change to the original marking models.
for(const[a,b]of [[380/700*100,54.285714285714285],[480/1000*100000,48000],[400000+160000+625000-225000,960000],[50000-27500,22500],[-111550-(-30550),-81000],[2000000*(.97-.87)+400000*(.97-.93),216000],[35000*.8,28000],[52500*.8,42000],[15000*.2,3000],[160000-50000,110000]])assert.ok(Math.abs(a-b)<.001);
const cap=html.match(/<section class="summary-page capital-page capital-route"[\s\S]*?<\/section>/)?.[0];assert.ok(cap);assert.doesNotMatch(cap,/<select|<details/);assert.match(cap,/data-capital-stage="value"/);
assert.doesNotMatch(read('js/law-popover.js'),/showModal|aria-modal','true/);
assert.doesNotMatch(read('js/calculator.js'),/eval\(|new Function|showModal/);
for(const file of ['js/law-popover.js','js/law-focus.js','js/study-lessons.js','js/study-wizard.js','js/calculator.js'])new vm.Script(read(file));
console.log('Study refinement verified: 7 chapter orientations, 7 traceable cases in 4 exams, literal context highlighting and click-only route.');
