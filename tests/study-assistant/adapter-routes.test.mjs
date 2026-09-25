import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {createCafa2Adapter} from '../../js/study-assistant-cafa2.mjs';
import {buildCatalog,normalizeExam,refKey} from '../../js/study-assistant-schema.mjs';
import {fixtureWindow} from './fixtures.mjs';

function examAttempt(win,id='attempt-1') {
  return {id,exam:win.CAFA2_EXAMS[0],status:'active',currentIndex:0,answers:{},pausedAt:null};
}
function practiceApi(answers={}) {
  return {getModule:()=>({attempt:2,answers}),getAnswer:()=>{throw new Error('Geen opgeslagen antwoord aanmaken tijdens lezen');},
    getCompleted:()=>[]};
}
function opgaveAttempt(win) {
  // De onderwerpindeling accepteert alleen bekende bron-ID's; inhoud blijft synthetisch.
  win.CAFA2_EXAMS[0].id='cafa2-20260429';
  const older=structuredClone(win.CAFA2_EXAMS[0]);
  older.id='cafa2-20210419';older.title='OUD TESTTENTAMEN';older.date='2025-01-01';
  older.questions[0].solutionHtml='<p>OLDER_SECRET_MODEL</p>';
  win.CAFA2_EXAMS.push(older);
  const sandbox={window:{}};
  const script=readFileSync(new URL('../../js/opgave-practice.js',import.meta.url),'utf8');
  new vm.Script(script).runInNewContext(sandbox);
  const combined=sandbox.window.CafaOpgavePractice.build(win.CAFA2_EXAMS,1,win.CAFA2_EXAMS.map(exam=>exam.id));
  return {id:'opgave-attempt-1',exam:combined,status:'active',currentIndex:0,answers:{},pausedAt:null};
}

test('Alle vier oefenroutes leveren hun eigen vraag en antwoordletter',()=>{
  const win=fixtureWindow(),answers={1:{choice:1,text:'Mijn berekening'}};
  win.CafaPractice=practiceApi(answers);
  const catalog=buildCatalog(win),adapter=createCafa2Adapter(win);
  for(const code of ['kap','val','nvw','hk']){
    win.location={hash:`#${code}-1`};
    const current=adapter.read();
    assert.equal(refKey(current.ref),`CAFA2:practice:${code}:1`);
    assert.equal(current.revision,catalog.records[refKey(current.ref)].revision);
    assert.equal(current.studentAnswer.choice,1);
    assert.equal(current.studentAnswer.optionId,'B');
    assert.equal(current.studentAnswer.text,'Mijn berekening');
    assert.equal(catalog.records[refKey(current.ref)].context.options[1].letter,'B');
    assert.equal(catalog.records[refKey(current.ref)].review.correctLetter,'A');
  }
  assert.equal(adapter.read().attempt,'hk-2');
});

test('Lezen van een lege oefenvraag schrijft geen antwoord in de bestaande poging',()=>{
  const win=fixtureWindow(),answers={};
  win.CafaPractice=practiceApi(answers);win.location={hash:'#kap-2'};
  const answer=createCafa2Adapter(win).read().studentAnswer;
  assert.equal(answer.choice,null);
  assert.deepEqual(answers,{});
});

test('Een onderwerpreset begint een eigen gesprek bij dezelfde vraag',()=>{
  const win=fixtureWindow(),topic={history:[],finished:false};
  win.CafaPractice=practiceApi({});
  win.CafaTopics={context:()=>topic,getState:()=>({active:'onderwerp-deelneming'})};
  win.location={hash:'#kap-1'};
  const adapter=createCafa2Adapter(win),first=adapter.read().attempt;
  topic.history.push({at:'2026-09-24T12:00:00.000Z'});
  const second=adapter.read().attempt;
  assert.notEqual(second,first);
  assert.equal(adapter.read().ref.questionId,'1');
});

test('Historische MC-inzage gebruikt nooit een antwoord uit de actuele poging',()=>{
  const win=fixtureWindow();
  win.CafaPractice=practiceApi({1:{choice:1,text:'Actuele poging'}});
  const archived={id:'practice-kap-1',code:'kap',answers:{}};
  const adapter=createCafa2Adapter(win);
  const old=adapter.answerValue(archived.answers[1]||{},win.CAFA2_DATA.modules.kap.questions[0]);
  assert.equal(old.choice,null);
  // De historische route wordt door de resultaatknop op dit archief vastgezet.
  const host=fakeElement();const row=fakeElement();const doc=fakeDocument({
    'exam-app':Object.assign(host,{querySelectorAll:selector=>selector==='article.exam-review-item'?[row]:[]})
  });
  win.document=doc;win.location={hash:'#mc-inzage/practice-kap-1'};
  win.CafaPractice.getCompleted=()=>[archived];
  let opened=0;adapter.decorate(()=>opened++);
  row.children[0].listeners.click({preventDefault(){}});
  assert.equal(opened,1);
  assert.equal(adapter.read().studentAnswer.choice,null);
  assert.equal(adapter.read().attempt,archived.id);
});

test('Tentamenvraag wisselt binnen dezelfde route met eigen optie-ID en tabelcellen',()=>{
  const win=fixtureWindow(),attempt=examAttempt(win);
  attempt.answers['vraag-2']={stockCells:{'r0-c1':'25%'},html:'<p>Eigen toelichting</p>'};
  attempt.answers['vraag-4']={optionId:'b'};
  win.CafaExams={getAttempts:()=>[attempt]};
  win.CafaStockTable={template:q=>q.id==='vraag-2'?{headers:['Datum','Voorraad'],rows:[['2025','']]}:null};
  win.location={hash:'#tentamen/attempt-1'};
  const adapter=createCafa2Adapter(win);
  attempt.currentIndex=1;
  const table=adapter.read();
  assert.equal(table.ref.questionId,'vraag-2');
  assert.equal(table.studentAnswer.tables[0].cells['r0-c1'],'25%');
  assert.equal(table.studentAnswer.tables[0].schema.headers[1],'Voorraad');
  attempt.currentIndex=3;
  const mc=adapter.read();
  assert.equal(mc.ref.questionId,'vraag-4');
  assert.equal(mc.studentAnswer.optionId,'b');
  assert.equal(mc.studentAnswer.choice,1);
  assert.equal(buildCatalog(win).records[refKey(mc.ref)].context.options[1].letter,'B');
  assert.equal(table.studentAnswer.text,'Eigen toelichting');
});

test('Individuele tentameninzage gebruikt de index uit de route',()=>{
  const win=fixtureWindow(),attempt=examAttempt(win);
  attempt.status='completed';attempt.currentIndex=0;
  win.CafaExams={getAttempts:()=>[attempt]};win.location={hash:'#inzage/attempt-1/vraag/2'};
  const current=createCafa2Adapter(win).read();
  assert.equal(current.ref.questionId,'vraag-3');
  assert.equal(current.defaultReview,true);
  assert.equal(current.attempt,'attempt-1');
});

test('Opgave-oefenreeks koppelt elk samengesteld vraag-ID aan het oorspronkelijke tentamenmodel',()=>{
  const win=fixtureWindow(),attempt=opgaveAttempt(win),catalog=buildCatalog(win);
  const first=attempt.exam.questions[0];
  const older=attempt.exam.questions.find(q=>q.sourceExamId==='cafa2-20210419'&&q.sourceQuestionId==='vraag-1');
  attempt.answers[first.id]={html:'<p>Antwoord bij nieuwe bron</p>'};
  attempt.answers[older.id]={html:'<p>Antwoord bij oude bron</p>'};
  attempt.answers['vraag-1']={html:'<p>Verkeerde, niet-samengestelde sleutel</p>'};
  win.CafaExams={getAttempts:()=>[attempt]};win.location={hash:'#tentamen/opgave-attempt-1'};
  const adapter=createCafa2Adapter(win);
  const current=adapter.read();
  assert.equal(refKey(current.ref),'CAFA2:exam:cafa2-20260429:vraag-1');
  assert.equal(current.revision,catalog.records[refKey(current.ref)].revision);
  assert.equal(current.studentAnswer.text,'Antwoord bij nieuwe bron');
  assert.equal(current.attempt,attempt.id);
  attempt.currentIndex=attempt.exam.questions.indexOf(older);
  const next=adapter.read();
  assert.equal(refKey(next.ref),'CAFA2:exam:cafa2-20210419:vraag-1');
  assert.equal(next.revision,catalog.records[refKey(next.ref)].revision);
  assert.equal(next.studentAnswer.text,'Antwoord bij oude bron');
  assert.ok(next.title.includes('OUD TESTTENTAMEN'));
  assert.notEqual(refKey(next.ref),refKey(current.ref));
});

test('Historische opgave-inzage gebruikt bronverwijzing en het antwoord van de gekozen rij',()=>{
  const win=fixtureWindow(),attempt=opgaveAttempt(win),host=fakeElement(),expanded=fakeElement(),row=fakeElement();
  const question=attempt.exam.questions.find(q=>q.sourceExamId==='cafa2-20210419'&&q.sourceQuestionId==='vraag-2');
  const index=attempt.exam.questions.indexOf(question);
  attempt.status='completed';attempt.answers[question.id]={html:'<p>Mijn oude voorraadtabel</p>'};
  row.dataset.resultId=question.id;
  row.querySelector=selector=>selector==='.result-expanded'?expanded:null;
  host.querySelectorAll=selector=>selector==='[data-result-id]'?[row]:[];
  win.CafaExams={getAttempts:()=>[attempt]};
  win.document=fakeDocument({'exam-app':host});win.location={hash:'#inzage/opgave-attempt-1'};
  const adapter=createCafa2Adapter(win);let opened=0;
  adapter.decorate(()=>opened++);
  expanded.children[0].listeners.click({preventDefault(){}});
  assert.equal(opened,1);
  const pinned=adapter.read();
  assert.equal(refKey(pinned.ref),'CAFA2:exam:cafa2-20210419:vraag-2');
  assert.equal(pinned.studentAnswer.text,'Mijn oude voorraadtabel');
  assert.equal(pinned.defaultReview,true);
  adapter.resetPin();win.location.hash=`#inzage/opgave-attempt-1/vraag/${index}`;
  const detail=adapter.read();
  assert.equal(refKey(detail.ref),refKey(pinned.ref));
  assert.equal(detail.studentAnswer.text,pinned.studentAnswer.text);
});

test('Historisch tentamenresultaat opent de bij de rij behorende vraag',()=>{
  const win=fixtureWindow(),attempt=examAttempt(win),host=fakeElement(),expanded=fakeElement(),row=fakeElement();
  attempt.status='completed';attempt.currentIndex=0;row.dataset.resultId='vraag-3';
  row.querySelector=selector=>selector==='.result-expanded'?expanded:null;
  host.querySelectorAll=selector=>selector==='[data-result-id]'?[row]:[];
  win.CafaExams={getAttempts:()=>[attempt]};
  win.document=fakeDocument({'exam-app':host});win.location={hash:'#inzage/attempt-1'};
  const adapter=createCafa2Adapter(win);let opened=0;
  adapter.decorate(()=>opened++);
  expanded.children[0].listeners.click({preventDefault(){}});
  assert.equal(opened,1);
  assert.equal(adapter.read().ref.questionId,'vraag-3');
  adapter.resetPin();
  assert.equal(adapter.read(),null);
});

test('Een expliciete verwijzing bevat alleen de eerdere uitwerking uit dezelfde casus',()=>{
  const win=fixtureWindow(),exam=win.CAFA2_EXAMS[0];
  exam.questions[1].prompt='Gebruik de voorraadtabel van vraag 1. Oorspronkelijke vraag 99.';
  delete exam.questions[1].promptHtml;
  const context=normalizeExam('CAFA2',exam,exam.questions[1]).context;
  assert.deepEqual(context.referencedSolutions.map(item=>item.id),['vraag-1']);
  assert.equal(context.referencedSolutions[0].solution,'SECRET_MODEL');
  assert.ok(!context.referencedSolutions.some(item=>item.number===99));
  assert.deepEqual(normalizeExam('CAFA2',exam,exam.questions[2]).context.referencedSolutions,[]);
});

test('Journaalpostkolommen sluiten aan op beide bestaande editors',()=>{
  const win=fixtureWindow(),catalog=buildCatalog(win);
  assert.deepEqual(catalog.records['CAFA2:practice:val:2'].context.answerColumns,
    ['Grootboekrekening','Debet (€)','Credit (€)']);
  assert.deepEqual(catalog.records['CAFA2:exam:cafa2-test:vraag-1'].context.answerColumns,
    ['Omschrijving grootboekrekening','Debet','Credit','Ruimte voor eventuele toelichting']);
});

test('Het werkelijke inline antwoordvenster biedt een vraagknop voor de huidige index',()=>{
  const win=fixtureWindow(),attempt=examAttempt(win),host=fakeElement(),feedback=fakeElement();
  host.querySelector=selector=>selector==='#cafa-exam-feedback'?feedback:null;
  win.CafaExams={getAttempts:()=>[attempt]};
  win.document=fakeDocument({'exam-app':host});
  win.location={hash:'#tentamen/attempt-1'};
  const adapter=createCafa2Adapter(win);let opened=0;
  feedback.hidden=true;adapter.decorate(()=>opened++);
  assert.equal(feedback.children.length,0);
  feedback.hidden=false;
  adapter.decorate(()=>opened++);adapter.decorate(()=>opened++);
  assert.equal(feedback.children.length,1);
  feedback.children[0].listeners.click({preventDefault(){}});
  assert.equal(opened,1);
  assert.equal(adapter.read().ref.questionId,'vraag-1');
  attempt.currentIndex=1;
  assert.equal(adapter.read().ref.questionId,'vraag-2');
});

function fakeElement() {
  return {children:[],dataset:{},listeners:{},querySelector(selector){return selector==='.study-inline-launch'?this.children.find(c=>c.className==='study-inline-launch')||null:null;},
    querySelectorAll:()=>[],appendChild(child){this.children.push(child);},addEventListener(type,fn){this.listeners[type]=fn;}};
}
function fakeDocument(elements) {
  return {getElementById:id=>elements[id]||null,createElement:()=>fakeElement()};
}
