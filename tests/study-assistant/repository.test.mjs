/** Real repository question data, not synthetic fixtures. No network or paid calls. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {buildCatalog,refKey} from '../../js/study-assistant-schema.mjs';
import {createCafa2Adapter} from '../../js/study-assistant-cafa2.mjs';
import {makeModelRequest} from '../../assistant/server/handler.mjs';
const html=fs.readFileSync('index.html','utf8');
const win={location:{hash:'#kap-1'}};const box=vm.createContext({window:win});
const files=[...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)].map(m=>m[1].split('?')[0]).filter(f=>f.startsWith('data/'));
for(const f of files)new vm.Script(fs.readFileSync(f,'utf8')).runInContext(box,{timeout:5000});
const catalog=buildCatalog(win),allExams=[...win.CAFA2_EXAMS,...(win.CAFA2_EXAM_DEMO?[win.CAFA2_EXAM_DEMO]:[])];
win.CafaPractice={getModule:()=>({attempt:1,exam:true}),getAnswer:()=>({text:'Eigen uitwerking',choice:1})};
let attempts=[];win.CafaExams={getAttempts:()=>attempts};
const adapter=createCafa2Adapter(win);
test('Every real practice record matches its server revision and offers answer help',()=>{
  let count=0;for(const [code,bank] of Object.entries(win.CAFA2_DATA.modules))for(const q of bank.questions){
    win.location.hash='#'+code+'-'+q.id;const c=adapter.read();assert.equal(c.revision,catalog.records[refKey(c.ref)].revision);assert.equal(c.canReview,true);count++;
  }assert.equal(count,catalog.counts.practice);assert.ok(count>=247);
});
test('Every real exam question, including demos, matches its server context',()=>{
  let count=0;for(const exam of allExams){attempts=[{id:'qa',exam,status:'active',currentIndex:0,answers:{}}];
    for(let i=0;i<exam.questions.length;i++){attempts[0].currentIndex=i;win.location.hash='#tentamen/qa';const c=adapter.read();assert.ok(c);assert.equal(c.revision,catalog.records[refKey(c.ref)].revision);assert.equal(c.canReview,true);assert.ok(!c.title.includes('undefined'));count++;}
  }assert.equal(count,catalog.counts.exam);assert.ok(count>=134);
});
test('Every current real record fits the context budget and retains its answer model',()=>{
  for(const record of Object.values(catalog.records))for(const mode of ['hint','review']){
    const p=makeModelRequest({record,mode,history:[],answer:{},message:'Leg het antwoord uit.'},{OPENAI_MODEL:'test-model'});
    const ctx=JSON.parse(p.input[0].content.slice(p.input[0].content.indexOf('\n')+1));assert.equal(JSON.stringify(ctx.review),JSON.stringify(record.review));assert.ok(ctx.prompt);
  }
});
test('Real question catalog has no duplicated IDs',()=>{
  assert.equal(Object.keys(catalog.records).length,catalog.counts.practice+catalog.counts.exam);
  console.log('Real CAFA2 question coverage:',JSON.stringify({counts:catalog.counts,types:catalog.types}));
});
