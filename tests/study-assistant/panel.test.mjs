import test from 'node:test';
import assert from 'node:assert/strict';
import {panelMetrics,panelPreference} from '../../js/study-assistant-panel.mjs';
test('right panel reserves a third while a case and answer keep usable room',()=>{
  const r=panelMetrics(1320,100/3,true);assert.equal(r.stacked,false);assert.equal(r.width,440);
  assert.ok(1320-r.width-14>=560);
});
test('an oversized preference cannot squeeze the question below its minimum',()=>{
  for(const width of [900,1024,1366]){
    const r=panelMetrics(width,50,true);assert.ok(r.stacked||width-r.width-14>=560);
  }
});
test('small screens stack without overwriting the remembered desktop fraction',()=>{
  const value={width:42};assert.deepEqual(panelMetrics(390,panelPreference(value),true),{stacked:true,width:390});
  assert.equal(value.width,42);assert.equal(panelMetrics(1400,value.width,true).width,588);
});
test('stored preference accepts only a bounded numeric width, without chat or position data',()=>{
  for(const width of [null,'40',Infinity,19,51])assert.equal(panelPreference({width}),100/3);
  assert.equal(panelPreference({width:40,position:{x:999},chat:'ignored'}),40);
});
test('a previously widened case keeps at least 340 pixels for the answer',()=>{
  for(const width of [900,1024,1320,1600])for(const fraction of [.25,1/3,.6]){
    const r=panelMetrics(width,50,fraction);
    assert.ok(r.stacked||(width-r.width-14)*(1-fraction)-14>=339);
  }
});
