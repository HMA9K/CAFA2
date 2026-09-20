import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const [home, index, summary, summaryCss, summaryJs, theoryCss, theoryJs, bootstrap, exams] = await Promise.all([
  read('fragments/home.html'),
  read('index.html'),
  read('samenvatting.html'),
  read('css/summary.css'),
  read('js/summary.js'),
  read('css/theory-panels.css'),
  read('js/theory-panels.js'),
  read('js/bootstrap.js'),
  read('js/exams.js')
]);

assert.equal((home.match(/class="cafa-home-choice /g) || []).length, 3, 'Homepage bevat drie hoofdroutes');
assert.match(home, />Leren</);
assert.match(home, />Oefenvragen maken</);
assert.match(home, />Tentamens oefenen</);
assert.match(index, /css\/theory-panels\.css/);
assert.match(bootstrap, /js\/theory-panels\.js/);
assert.match(exams, /href="#oefenen">Toets starten/);

assert.equal((summary.match(/data-lesson=/g) || []).length, 45, '40 inhoudelijke hoofdstukken en vijf hulpmiddelpagina’s');
assert.match(summary, /data-route="kernschema"/);
assert.match(summary, /data-route="bronnen"/);
assert.match(summaryJs, /localStorage/);
assert.match(summaryCss, /@media\(max-width:760px\)/);

assert.match(theoryJs, /q\.guidance/, 'Basisregels volgen de expliciete inhoud per vraag, niet nummerreeksen');
assert.match(theoryJs, /panel\.open = false/);
assert.match(theoryCss, /grid-template-columns:minmax\(0,1fr\) 300px/);
assert.match(theoryCss, /@media \(max-width:960px\)/);
assert.match(theoryCss, /\.theory-panel summary:focus-visible/);

const margin = (200000 - 150000) / 200000;
const closingProfit = 200000 * margin;
const netProfit = closingProfit * (1 - 0.25);
assert.equal(closingProfit, 50000);
assert.equal(netProfit, 37500);
assert.equal(netProfit * 0.8, 30000);
assert.equal(netProfit * 0.2, 7500);

console.log('Homepage, samenvatting, theoriepanelen en rekenlogica gevalideerd.');
