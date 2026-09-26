import test from 'node:test';
import assert from 'node:assert/strict';
import {windowBounds,windowPreferences} from '../../js/study-assistant-window.mjs';

test('floating assistant starts beside the page and has a bounded default size',()=>{
  assert.deepEqual(windowBounds({w:1366,h:950}),{w:444,h:680,x:914,y:76});
});
test('old desktop coordinates and large sizes fit a narrow or rotated viewport',()=>{
  for(const v of [{w:320,h:740},{w:390,h:844},{w:740,h:390}]){
    const r=windowBounds(v,{size:{w:900,h:1000},position:{x:1500,y:-200}});
    assert.ok(r.x>=8&&r.y>=8&&r.x+r.w<=v.w-8&&r.y+r.h<=v.h-8);
  }
});
test('keyboard viewport offsets are honored without changing preferred desktop geometry',()=>{
  const preferences={size:{w:640,h:760},position:{x:150,y:80}};
  const before=structuredClone(preferences);
  const small=windowBounds({x:30,y:170,w:390,h:260},preferences);
  assert.ok(small.x>=38&&small.y>=178&&small.x+small.w<=412&&small.y+small.h<=422);
  assert.deepEqual(preferences,before);
  assert.deepEqual(windowBounds({w:1366,h:950},preferences),{w:640,h:760,x:150,y:80});
});
test('collapsed title bar remains reachable at the bottom edge',()=>{
  const r=windowBounds({w:390,h:400},{position:{x:2000,y:2000},collapsed:true,headerHeight:58});
  assert.equal(r.h,58);assert.equal(r.y+r.h,392);
});
test('invalid stored preferences cannot put the window outside the usable area',()=>{
  assert.deepEqual(windowPreferences({size:{w:Infinity,h:20},position:{x:'10',y:12},expandedSize:{w:-1,h:900}}),
    {size:null,position:null,expandedSize:null});
  assert.deepEqual(windowPreferences({size:{w:600,h:720},position:{x:120,y:85},expandedSize:{w:700,h:800},chat:'never stored'}),
    {size:{w:600,h:720},position:{x:120,y:85},expandedSize:{w:700,h:800}});
});
