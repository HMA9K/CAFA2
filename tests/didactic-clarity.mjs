import assert from 'node:assert/strict';
import fs from 'node:fs';
import {functionalCurrencyHtml} from '../content/study/functional-currency.mjs';
import {examMethods,examEvidence} from '../content/study/exam-approach.mjs';
import {orientation} from '../content/study/learning-route.mjs';
import {summaryBrand} from '../content/study/brand.mjs';
const read=p=>fs.readFileSync(p,'utf8');
const html=read('samenvatting.html');
assert.match(functionalCurrencyHtml,/Weeg de antwoorden, tel ze niet/);
assert.match(functionalCurrencyHtml,/RJ 122\.106/);assert.match(functionalCurrencyHtml,/RJ 122\.109/);
assert.match(functionalCurrencyHtml,/feit → betekenis → gewicht → conclusie/);
assert.doesNotMatch(functionalCurrencyHtml,/Wat onderzoek je in de casus\?/);
assert.match(html,/VOF \/ CV \(zonder rechtspersoonlijkheid\)/);
assert.match(html,/Een bv of nv heet óók een vennootschap/);
assert.match(read('js/study-wizard.js'),/commanditair vennoot zijn is op zichzelf niet voldoende/);
for(const[id,o]of Object.entries(orientation)){
 assert.equal(o.need.length,3,id);
 assert.ok(o.need.every(x=>x.startsWith('Je ')),id+': prior capabilities, not case inputs');
}
assert.match(html,/Voorkennis: dit begrijp je al vóór je begint/);
assert.equal(examMethods.length,4);assert.equal(new Set(examEvidence.map(e=>e.date)).size,7);
for(const m of examMethods){assert.ok(m.html.length>3500,m.topic);assert.match(m.html,/method-steps/);assert.match(m.html,/Uitwerking|uitwerking/);}
assert.equal((html.match(/class="exam-method"/g)||[]).length,4);
assert.match(html,/zeven aangeleverde tentamens/);
assert.equal(html.match(/reader-brand cafa-wordmark/g)?.length,1);
const homeSVG=read('js/bootstrap.js').match(/brand.innerHTML = '(<svg[\s\S]*?<\/svg>)/)?.[1];
assert.equal(summaryBrand.match(/<svg[\s\S]*?<\/svg>/)?.[0],homeSVG,'Identical homepage mark');
assert.ok(html.includes('css/study-clarity.css?v=20260922-clarity1'));
for(const[a,b]of [[803000+75000-30000+20000,868000],[800000-868000*.8,105600],[(125000-7500+25000-20000)*.8,98000],[(49000-35000)*.8,11200],[25920+6480+17280+4320,54000]])assert.equal(a,b);
console.log('Didactic clarity verified: currency interpretation, explicit VOF/CV, 7 prerequisites, 4 methods / 7 exam sources, shared SVG and worked arithmetic.');
