import test from 'node:test';
import assert from 'node:assert/strict';
import {conversationHistory,HISTORY_LIMITS} from '../../js/study-assistant-schema.mjs';

test('lange berekening blijft volledig beschikbaar voor een vervolgvraag',()=>{
  const answer='Berekening: '+ 'stap '.repeat(1500)+'Goodwill = 99.000.';
  const chat=[{role:'user',content:'Geef de volledige berekening.'},{role:'assistant',content:answer}];
  assert.deepEqual(conversationHistory(chat),chat);
});
test('geschiedenis behoudt nieuwste samenhangende berichten en slaat mislukte vragen over',()=>{
  const chat=[{role:'assistant',content:'oud'.repeat(6000)},
    {role:'user',content:'niet verstuurd',failed:true},{role:'user',content:'Bereken goodwill'},
    {role:'assistant',content:'Goodwill = 99.000.'}];
  assert.deepEqual(conversationHistory(chat),chat.slice(-2));
  assert.equal(conversationHistory(Array.from({length:10},()=>({role:'user',content:'x'}))).length,8);
});
test('extreem lang antwoord wordt herkenbaar begrensd zonder het helemaal te verliezen',()=>{
  const answer='BEGIN '+ 'x'.repeat(20000)+' SLOT: 99.000';
  const history=conversationHistory([{role:'assistant',content:answer}]);
  assert.equal(history[0].content.length,HISTORY_LIMITS.characters);
  assert.ok(history[0].content.startsWith('BEGIN '));assert.ok(history[0].content.endsWith('SLOT: 99.000'));
  assert.match(history[0].content,/middendeel.*weggelaten/);
});
