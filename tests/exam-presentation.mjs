import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';
import {loadSources,root} from '../scripts/exam-practice-source.mjs';
const read=p=>fs.readFileSync(root+'/'+p,'utf8'),hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const {exams}=loadSources(),financial=JSON.parse(read('content/practice/exam-financial-presentation.json'));
const records=exams.flatMap(e=>JSON.parse(read('content/practice/exam-mc/'+e.id+'.json')));
const tableRows=html=>[...html.matchAll(/<tbody>([\s\S]*?)<\/tbody>/g)].flatMap(t=>[...t[1].matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(r=>[...r[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(c=>c[1])));
const number=s=>Number(s.replaceAll('.','').replace(',','.').replace('−','-'));
assert.equal(Object.keys(financial).length,25);
for(const [key,rule] of Object.entries(financial)){
 const [eid,qid]=key.split('/'),q=exams.find(e=>e.id===eid).questions.find(q=>q.id===qid);
 assert.equal(hash(q.solutionHtml),rule.sourceSha256,'Financiële opmaak blijft aan dezelfde bron gebonden: '+key);
 for(const row of tableRows(rule.display[0]))assert.ok(!row.slice(1).some(c=>/^20\d\d$/.test(c)),'Een jaartal hoort bij datum/omschrijving: '+key);
}
for(const q of records){
 assert.ok(!/<th[^>]*>Bedrag \d+<\/th>/.test(q.solutionHtml),'Geen verzonnen generieke financiële kolommen: '+q.key);
 if(q.answerKind!=='stock')assert.ok(!q.solutionHtml.includes('Voorraad / actief'),'Valutaomrekening is geen intercompanyvoorraadtabel: '+q.key);
}
const toren=records.find(q=>q.key==='cafa2-20210419/vraag-2');
assert.ok(toren.solutionHtml.includes('<th scope="col">100% (€)</th><th scope="col">35% (€)</th>'));
const rows=tableRows(toren.solutionHtml);assert.equal(rows.length,8);
for(const row of rows)assert.ok(Math.abs(number(row[1])*.35-number(row[2]))<.001,'35%-kolom sluit aan op volledige bedrag');
assert.equal(number(rows[0][1])+rows.slice(1,6).reduce((s,r)=>s+number(r[1]),0),number(rows.at(-1)[1]));
assert.equal(number(rows.at(-1)[2]),248850);
assert.ok(rows[0][0].includes('2020'));assert.ok(rows.at(-1)[0].includes('2020'));
const c={window:{}};vm.createContext(c);vm.runInContext(read('data/exam-case-presentation.js'),c);
const cases=JSON.parse(read('content/practice/exam-case-presentation.json'));
assert.deepEqual(JSON.parse(JSON.stringify(c.window.CAFA2_CASE_PRESENTATION)),cases);
for(const [eid,sections] of Object.entries(cases))for(const [sid,p] of Object.entries(sections)){
 const source=exams.find(e=>e.id===eid).sections.find(s=>s.id===sid);assert.equal(hash(source.contentHtml),p.sourceSha256);
 const numbers=html=>new Set(html.replace(/<[^>]*>/g,' ').match(/\d+(?:[.,]\d+)*(?:%)?/g)||[]),shown=numbers(p.html);
 for(const value of numbers(source.contentHtml))assert.ok(shown.has(value),'Casuswaarde behouden: '+eid+'/'+sid+' '+value);
 assert.equal((p.html.match(/<h3>OPGAVE/g)||[]).length,/OPGAVE/.test(source.contentHtml)?1:0);
 assert.ok(!/<p>\d+%<\/p>/.test(p.html),'Geen los uitgelezen diagrampercentages');
 assert.ok(!/<h3>[^<]*(?:NB:|Toelichting:)/.test(p.html),'Casusinhoud is geen lange koptekst');
 if(p.html.includes('<h3>OPGAVE')&&p.html.includes('<table'))assert.ok(p.html.indexOf('<h3>OPGAVE')<p.html.indexOf('<table'));
 assert.ok(!p.html.includes('<pre'),'Geen afgekapt tekstblok met vaste regelbreedte');
 assert.ok(!/<p>(?:€\s*)?\d+[.,\d%]*<\/p>/.test(p.html),'Geen losse bedragen of percentages uit platgelezen tabellen');
}
assert.equal(Object.values(cases).reduce((n,s)=>n+Object.keys(s).length,0),44);
const m=cases['cafa2-20230411']['opgave-1'].html;
assert.equal((m.match(/<table/g)||[]).length,3);assert.equal((m.match(/€ 1.950.000/g)||[]).length,1);
assert.equal((m.match(/€ 760.000/g)||[]).length,1);
assert.ok(m.indexOf('Van Moneglia')<m.indexOf('Organisatieschema'));
assert.ok(m.indexOf('Eind 2021 heeft Moneglia')<m.indexOf('Eigen vermogen Cavola'));
assert.ok(m.includes('3 van de 5 bestuurders')&&m.includes('volledig aansprakelijk'));
assert.ok(m.includes('<p>De financiering van')&&m.includes('<p>Begin 2023 koopt'),'Nieuwe casusgegevens blijven afzonderlijke alinea\'s');
console.log('Financiële presentatie: 25 brongebonden uitwerkingen, echte percentage-/valutakolommen, Toren-aansluiting en 44 leesbaar opgemaakte casussecties.');
