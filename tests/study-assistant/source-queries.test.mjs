import test from 'node:test';
import assert from 'node:assert/strict';
import {documentQueries,sourcePassages} from '../../assistant/server/source-queries.mjs';
test('genummerde bronvragen worden apart gezocht zonder bedragen te splitsen',()=>{
  assert.deepEqual(documentQueries('Zoek beide originele uitwerkingen. 1. Niedorp koers 0.94? 2. Zeevang 540.000?'),['Niedorp koers 0.94?','Zeevang 540.000?']);
  assert.deepEqual(documentQueries('Geef alleen een hint. 1. Hoe beginnen? 2. Waarom?'),[]);
  assert.deepEqual(documentQueries('Welke bron verklaart 1.000 euro?'),[]);
  assert.equal(documentQueries('Zoek documenten: 1. a 2. b 3. c 4. d').length,3);
});
test('zoekpassages zijn begrensd en een ontbrekend resultaat wordt geen bronvermelding',()=>{
  assert.deepEqual(sourcePassages({data:[{filename:'geen tekst',file_id:'f',content:[]}]}),[]);
  assert.throws(()=>sourcePassages({}),/ontbreken/);
  const passages=sourcePassages({data:Array.from({length:20},()=>({filename:'bron.pdf',file_id:'f',content:[{type:'text',text:'x'.repeat(8000)}]}))});
  assert.equal(passages.length,2);assert.equal(passages[0].text.length,3500);
});
