import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {table, journal} from '../content/summary/helpers.mjs';
import {decorateTables, tableKind} from '../content/summary/table-layout.mjs';
import {icScenario} from '../js/ic-learning-engine.mjs';

const page=fs.readFileSync(new URL('../samenvatting.html',import.meta.url),'utf8');
const courseText=page.match(/<body\b[^>]*>([\s\S]*)<\/body>/)[1]
  .replace(/<script\b[\s\S]*?<\/script>/g,'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
// Approved content at b75fa48. Update deliberately only for a separate content revision.
assert.equal(createHash('sha256').update(courseText).digest('hex'),
  '8891c623adc82eb3f677ab4bd6bc216d28c37cc118525bce13d3917243a416ff',
  'All approved reading text, table contents and source references remain identical');
assert.equal(decorateTables(page),page,'Static decoration is idempotent');
const count=kind=>(page.match(new RegExp('class="study-table" data-table-kind="'+kind+'"','g'))||[]).length;
assert.equal(count('prose'),33);assert.equal(count('stock'),16);assert.equal(count('journal'),106);assert.equal(count('data'),25);
assert.equal(tableKind(['Rekening','Debet (€)','Credit (€)'],[['Post','100','']]),'journal');
assert.equal(tableKind(['Datum','Voorraad','IC-winst','Intern','Derden','Resultaat'],[['31-12-2024','','','','','']]),'stock');
assert.equal(tableKind(['Berekening','Bedrag (€)'],[['Een lange uitleg bij een berekening die wel degelijk numeriek van aard is','180.000']]),'data');
const scenario=icScenario();
for(const raw of [table(scenario.headers,scenario.blank),table(scenario.headers,scenario.rows),journal('Boeking',scenario.internal[0].rows)]){
 const decorated=decorateTables(raw);
 assert.equal(raw.replace(/<[^>]*>/g,''),decorated.replace(/<[^>]*>/g,''),'Original cell text untouched');
 assert.equal(decorateTables(decorated),decorated);
 assert.ok(decorated.includes('role="table"'));
 assert.ok(decorated.includes('data-label='));
}
assert.ok(fs.readFileSync(new URL('../js/summary-reader.js',import.meta.url),'utf8').includes('loaded[2].decorateTables(html)'),'Recalculated IC tables use the same layout metadata');
console.log('Mobile table checks passed: 180 unchanged tables; explanatory layout, stable dates and numeric columns; unchanged approved content.');
