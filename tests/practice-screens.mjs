import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {splitQuestions,buildPracticeScreens} from '../scripts/build-practice-screens.mjs';
const root=new URL('../',import.meta.url),read=file=>readFile(new URL(file,root),'utf8');
const manifest=JSON.parse(await read('data/practice-screens.json'));
const originals=new Map();
for(const source of new Set(Object.values(manifest).map(record=>record.source))){
 for(const question of splitQuestions(await read(source))){
  const id=question.html.match(/^<section\b[^>]*\bid="([^"]+)"/)[1];originals.set(id,question.html);
 }
}
assert.equal(originals.size,627);
assert.equal(Object.keys(manifest).length,originals.size);
for(const [id,html] of originals){
 assert.equal(await read(manifest[id].url),html+'\n',id+': broninhoud moet byte voor byte behouden blijven');
}
assert.doesNotMatch(await read('fragments/practice-shell.html'),/class="[^"]*\bquestion\b/);
assert.match(await read('fragments/practice-shell.html'),/id="overzicht-kap"/);
assert.match(await read('fragments/practice-shell.html'),/id="resultaat-hk"/);
const nested='<section class="question" id="kap-1"><section><p>Inhoud</p></section></section><section id="rest"></section>';
assert.equal(splitQuestions(nested)[0].html,'<section class="question" id="kap-1"><section><p>Inhoud</p></section></section>');
assert.throws(()=>splitQuestions('<section class="question"><section></section>'),/Onvolledige/);
console.log('627 vraagsschermen behouden hun volledige broninhoud; navigatieschermen bevatten geen verborgen vragen.');
