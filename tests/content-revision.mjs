import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import kap from '../content/summary/kap.mjs';
import val from '../content/summary/val.mjs';
import cons from '../content/summary/cons.mjs';
import glossary from '../content/summary/glossary.mjs';
import {sources,coverage} from '../content/summary/sources.mjs';
import {icScenario} from '../js/ic-learning-engine.mjs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const digest=v=>crypto.createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const modules={kap:'kapitaalbelangen',val:'vreemde-valuta',nvw:'consolidatie-nvw',hk:'consolidatie-hk'};
function questionBody(html){
 const start=html.indexOf('<div class="qbody');let depth=0;
 for(const tag of html.slice(start).matchAll(/<\/?div\b[^>]*>/g)){
  depth+=tag[0].startsWith('</')?-1:1;
  if(depth===0)return html.slice(start,start+tag.index);
 }
 throw Error('Vraaglichaam heeft geen afsluiting');
}
const original={kap:'3693a48853ec15d2580927c3f079731717eedf613e3a544c8530d4cd0529be71',val:'40c3ca4da0c6e749dd238e829d33ea5873797ae8082c0c1681920f2176ec0757',nvw:'db9e5382194a2233854d736e109d995c466727587e039778c8bfcb33be1c2aa3',hk:'1dfd513b2db69c171c12d5a42c620d82287c34ca0ea89e9e45c7e19f6bd98cf7'};
// UI snapshot includes published analytics hooks dashboard date sorting (0703c94/1e927de) and canonical case rendering; official exam transcriptions stay unchanged.
const immutable={'js/app.js':'7aab348afbe0e7c9f0d8b200bd840e0d36b2c2608590d2f41a1ae63f0276f63d','js/exams.js':'6c2b9b08681761817b41582d5efea243af79df24d5039adc223f47fcdecfbe23','js/exam-engine.js':'35330d64e346bad2ec7e16b3d235872e09a9bbef97f565d22a9213f3270cc55e','data/exam-20240422.js':'8346593f40badc4a729879f300eeecb03b4948a1020120c8493d9c73bfd4b8e9','data/exam-20240930.js':'ebe1abd5b292474366ff081b84a9676d1ccc25a4a8dd6738a1cb7190c729cf14','data/exam-20250417.js':'9ca2a7911fe90e34526bf13577d1f1880887ad17cd3e143a957ca612924afa0d','data/exam-20250924.js':'dad786d66db76cb2633653da97f94f4c49fbe61912e635adeeb5305eb584a677','data/exam-20260429.js':'597adf011a2983a1cc6fcd7e65f0daabd36ff5f2498970c0c4974b82d477e488'};
const earlyExams={
 'data/exam-20210419.js':'6aef1018c3cc73fa41dd32f02b6788e408b5f8d69df3c5b5055ffb0db34d605c',
 'data/exam-20211006.js':'252f395bd9c37d722122408e9f1d8a05fb724d7ab51ae4243e342c4d2f3c43c4',
 'data/exam-20220411.js':'da8d30d9165ac48fd1b1867da096f61855c2077b2e5bde635dd6e3e56eb4ee2f',
 'data/exam-20221006.js':'21597c3f55f9ea98ad525e689faf373f671a7d6090c0c03b84194e344e99dc6d',
 'data/exam-20230411.js':'10cf9885654a13d741916b2061301aff8e7f65dad3111bbea69bf5ccb0bc84b6',
 'data/exam-20231009.js':'d8198dce321f228daf2ff6eaa3d03b3d78683283818526eeeec7ba858a2f67bc'
};
for(const [p,sha]of Object.entries({...immutable,...earlyExams}))assert.equal(digest(read(p)),sha,'Gecontroleerde UI-versie of ongewijzigde officiële tentamendata: '+p);
const lessons=[...kap,...val,...cons],ids=new Set([...lessons.map(l=>l.id),'start','kernschema','begrippen','bronnen','tentamen','kapitaalboom','wetsartikelen']);
assert.equal(ids.size,lessons.length+7);assert.ok(kap.length>=12&&val.length>=9&&cons.length>=15);
for(const l of lessons){assert.ok(l.html.length>400);assert.ok(l.sources.length);for(const s of l.sources)assert.ok(sources[s.split('|')[0]],s);}
assert.ok(glossary.length>=70);for(const g of glossary){assert.ok(ids.has(g[3]));assert.ok(sources[g[4].split('|')[0]]);assert.ok(g[1].length>35&&g[2].length>25);}
assert.equal(coverage.length,25);for(const c of coverage)for(const id of c[1].split(','))assert.ok(ids.has(id),id);
const c={window:{CAFA2_DATA:{modules:{}}}};vm.createContext(c);
let total=0,caseCount=0;
for(const [code,name]of Object.entries(modules)){
 vm.runInContext(read('data/'+name+'.js'),c);
 const m=c.window.CAFA2_DATA.modules[code];
 assert.equal(m.questions.length,30);
 assert.equal(digest(m.questions.map(q=>[q.id,q.correct,q.options,q.facts,q.explanation,q.related])),original[code],'Antwoorden, feiten, uitwerkingen en IDs identiek aan onafhankelijke nulmeting: '+code);
 for(const dir of ['fragments','fallback']){
   const html=read(dir+'/'+name+'.html');
   for(const q of m.questions){
    const start=html.indexOf('id="'+code+'-'+q.id+'"'),body=questionBody(html.slice(start));
    for(const cls of ['source','mc-area','own-area'])assert.ok(body.includes('class="'+cls+'"'),'Antwoord en bronnen blijven binnen vraaglichaam: '+dir+' '+code+'-'+q.id+' '+cls);
    assert.equal((body.match(/class="theory-link"/g)||[]).length,1,'Geen los achtergebleven basisregeltags');
   }
   for(const q of m.questions){const match=new RegExp('<section class="screen question frame" id="'+code+'-'+q.id+'"[\\s\\S]*?(?=<section class="screen question frame"|$)').exec(html);assert.ok(match,'Vraag '+code+'-'+q.id);const text=match[0];assert.equal((text.match(/class="theory-panel"/g)||[]).length,1);assert.ok(text.includes('data-guidance-id="'+code+'-'+q.id+'"'));assert.equal((text.match(/class="pattern learning-pattern"/g)||[]).length,2);assert.equal(text.includes('class="learning-case"'),q.caseTables.length>0);assert.ok(text.includes('samenvatting.html#'+q.guidance.lesson));}
 }
 const rules=new Set();
 for(const q of m.questions){total++;assert.ok(q.task.length>40);assert.ok(q.guidance.rules.length>120);assert.equal(q.guidance.pattern.length,3);assert.ok(ids.has(q.guidance.lesson));assert.ok(!/vorige vraag|eerdere vraag|zie vraag\s+\d|bovenstaande vraag/i.test(q.task));rules.add(q.guidance.rules);if(q.caseTables.length)caseCount++;for(const t of q.caseTables){assert.ok(t.headers.length>=2);assert.ok(t.rows.length);for(const row of t.rows)assert.equal(row.length,t.headers.length);}}
 assert.equal(rules.size,30,'Geen generieke herhaling binnen '+code);
}
for(const m of Object.values(c.window.CAFA2_DATA.modules))for(const q of m.questions)if(/(?:de|een) (?:casus)?tabel/.test(q.task))assert.ok(q.caseTables.length,'Elke verwijzing naar een gegeven tabel heeft een eigen tabel: '+m.title+' '+q.id);
let completedStockCount=0;
for(const m of Object.values(c.window.CAFA2_DATA.modules))for(const q of m.questions)for(const t of q.caseTables){
 if(t.completed){completedStockCount++;assert.notEqual(q.type,'Voorraadtabel');for(const row of t.rows.slice(1))assert.ok(Math.abs(row[2]-row.slice(3).reduce((sum,n)=>sum+(Number(n)||0),0))<.005,'Stock allocation reconciles: '+q.id);}
 if(q.type==='Voorraadtabel')assert.ok(!t.completed,'No solution disclosed for table-construction tasks');
}
assert.equal(completedStockCount,23);
assert.equal(total,120);assert.ok(caseCount>=47);
const summary=read('samenvatting.html');assert.equal((summary.match(/data-lesson=/g)||[]).length,ids.size);assert.equal((summary.match(/data-glossary-entry/g)||[]).length,glossary.length);
const htmlIds=Array.from(summary.matchAll(/\bid="([^"]+)"/g),m=>m[1]);assert.equal(new Set(htmlIds).size,htmlIds.length,'Geen dubbele HTML-IDs');
for(const id of ids)assert.ok(summary.includes('id="'+id+'"'));
for(const match of summary.matchAll(/href="#([^"]+)"/g))assert.ok(htmlIds.includes(match[1]),'Geldige interne link '+match[1]);
assert.ok(summary.includes('Eliminatie t.l.v. aandeel derden')&&summary.includes('Interne correctie'));
for(const script of ['js/summary.js','js/theory-panels.js'])new vm.Script(read(script));
const eq=(a,b,msg)=>assert.ok(Math.abs(a-b)<0.005,`${msg||'Gelijk'}: ${a} != ${b}`);
let s=icScenario();eq(s.u0,64000);eq(s.u1,96000);eq(s.rows[1][3],38400);eq(s.rows[2][3],57600);eq(s.rows[3][3],19200);eq(s.rows[3][5],12800);eq(s.controls.additionalMajorityResultChange,-9600);
s=icScenario({direction:'side',sellerShare:.9,buyerShare:.7,stock0:300000,stock1:400000,margin:.3,tax:.2,sales:900000});eq(s.allocation.internal,.7);eq(s.allocation.third,.1);eq(s.allocation.additional,.2);eq(s.internal[0].rows[0][1],16800);eq(s.balance[0].rows.find(r=>r[0]==='Deelneming verkoper')[1],67200);
s=icScenario({basis:'HK',direction:'up',sellerShare:.75,stock0:300000,stock1:240000,margin:.2,tax:.2,sales:900000});assert.equal(s.internal.length,0);eq(s.controls.additionalMajorityResultChange,7200);eq(s.controls.thirdResultChange,2400);
s=icScenario({basis:'HK',direction:'down',buyerShare:.75,stock0:180000,stock1:240000,margin:.2,tax:.2,sales:900000});eq(s.allocation.additional,1);eq(s.income[0].rows[0][1],840000);eq(s.controls.additionalMajorityResultChange,-9600);
let scenarios=0;
for(const basis of ['NVW','HK'])for(const direction of ['down','up','side'])for(const sellerShare of [.6,.75,1])for(const buyerShare of [.6,.9,1])for(const tax of [0,.2,.25])for(const stocks of [[200000,300000],[300000,200000],[200000,200000],[0,100000]]){
 if(basis==='HK'&&direction==='side'&&sellerShare>buyerShare)continue;
 const v=icScenario({basis,direction,sellerShare,buyerShare,tax,stock0:stocks[0],stock1:stocks[1],margin:.2,sales:1000000});scenarios++;
 eq(v.allocation.internal+v.allocation.third+v.allocation.additional,1);
 for(const j of [...v.internal,...v.balance,...v.income])eq(j.rows.reduce((sum,r)=>sum+(Number(r[1])||0)-(Number(r[2])||0),0),0,j.title);
 eq(v.controls.totalMajorityResultChange+v.controls.thirdResultChange,-v.change*(1-tax));
}
assert.throws(()=>icScenario({basis:'HK',direction:'side',sellerShare:.9,buyerShare:.7}),/geen afzonderlijke bronuitwerking/);
assert.throws(()=>icScenario({stock0:-1}));assert.throws(()=>icScenario({tax:1}));assert.throws(()=>icScenario({sales:100}));
console.log(`Inhoudsrevisie geslaagd: ${total} vraagprofielen; ${caseCount} zelfstandige tabelcasussen; ${lessons.length} hoofdstukken; ${glossary.length} begrippen; ${scenarios} IC-rekenscenario's. Antwoorden, feiten en officiële tentamens identiek aan nulmeting. UI-runtime gecontroleerd op goedgekeurde navigatie/herstartrevisie.`);
