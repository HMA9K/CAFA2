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

test('Alle echte tentamenvragen houden in de vier onderwerpseries hun bronmodel en eigen antwoord',()=>{
  new vm.Script(fs.readFileSync('js/opgave-practice.js','utf8')).runInContext(box);
  const practice=win.CafaOpgavePractice,seen=new Set();
  for(let topic=1;topic<=4;topic++){
    const exams=practice.available(win.CAFA2_EXAMS,topic);
    const combined=practice.build(win.CAFA2_EXAMS,topic,exams.map(exam=>exam.id));
    const attempt={id:`topic-${topic}`,exam:combined,status:'active',currentIndex:0,answers:{}};
    attempts=[attempt];win.location.hash=`#tentamen/${attempt.id}`;
    for(const [index,question] of combined.questions.entries()){
      attempt.currentIndex=index;
      attempt.answers[question.id]={html:`<p>Eigen antwoord ${question.id}</p>`};
      const current=adapter.read(),key=refKey(current.ref),record=catalog.records[key];
      assert.equal(key,`CAFA2:exam:${question.sourceExamId}:${question.sourceQuestionId}`);
      assert.equal(current.revision,record.revision,key);
      assert.equal(current.studentAnswer.text,`Eigen antwoord ${question.id}`,key);
      assert.ok(!seen.has(key),`Dubbele bronvraag: ${key}`);seen.add(key);
      const source=win.CAFA2_EXAMS.find(exam=>exam.id===question.sourceExamId);
      assert.equal(source.questions.find(q=>q.id===question.sourceQuestionId).sectionId,
        practice.sourceSectionId(source,topic));
    }
  }
  assert.equal(seen.size,win.CAFA2_EXAMS.reduce((count,exam)=>count+exam.questions.length,0));
});
test('Real question catalog has no duplicated IDs',()=>{
  assert.equal(Object.keys(catalog.records).length,catalog.counts.practice+catalog.counts.exam);
  console.log('Real CAFA2 question coverage:',JSON.stringify({counts:catalog.counts,types:catalog.types}));
});
test('Echte vervolgvragen krijgen gericht de eerder genoemde voorraadtabel',()=>{
  for(const [question,previous] of [['vraag-15','vraag-14'],['vraag-17','vraag-16']]){
    const current=catalog.records[`CAFA2:exam:cafa2-20240422:${question}`];
    assert.deepEqual(current.context.referencedSolutions.map(item=>item.id),[previous]);
    assert.ok(current.context.referencedSolutions[0].solution.includes('€'));
  }
  const split=catalog.records['CAFA2:exam:cafa2-20250924:vraag-19'];
  assert.deepEqual(split.context.referencedSolutions,[]);
});
test('Elke echte MC-antwoordindex verwijst naar dezelfde zichtbare antwoordletter',()=>{
  for(const record of Object.values(catalog.records)){
    if(record.ref.kind==='practice'){
      assert.equal(record.context.options[record.review.correct]?.letter,record.review.correctLetter,refKey(record.ref));
      assert.equal(record.context.options[record.review.correct]?.choiceIndex,record.review.correct,refKey(record.ref));
    }else if(record.context.options.length){
      assert.ok(record.context.options.some(option=>option.id===record.review.correct),refKey(record.ref));
    }
  }
});
