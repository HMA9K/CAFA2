import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(file)=>fs.readFileSync(path.join(root,file),'utf8');
const sandbox={window:{}};vm.createContext(sandbox);
for(const file of ['js/exam-engine.js','data/exams.js','data/exam-20250924.js','data/exam-20260429.js'])new vm.Script(read(file),{filename:file}).runInContext(sandbox);
const {CafaExamEngine:engine,CAFA2_EXAMS:exams}=sandbox.window;
assert.equal(exams.length,2);
const expected={
  'cafa2-20250924':{date:'2025-09-24',counts:[8,6,9,8],names:['Monserrato','Dole','Oldemarcke','Livorno']},
  'cafa2-20260429':{date:'2026-04-29',counts:[7,6,6,4],names:['Oostermoer','']}
};
for(const exam of exams){
  const spec=expected[exam.id];assert.ok(spec);
  assert.equal(engine.validateExam(exam).valid,true,engine.validateExam(exam).errors.join('\n'));
  assert.equal(exam.date,spec.date);assert.equal(exam.durationMinutes,180);assert.equal(exam.maxScore,100);assert.equal(exam.passPoints,55);
  assert.equal(exam.questions.length,spec.counts.reduce((a,b)=>a+b,0));
  assert.equal(exam.sections.length,4);
  assert.equal(exam.questions.reduce((sum,q)=>sum+q.points,0),100);
  assert.match(exam.introductionHtml,/54\/55/);assert.match(exam.introductionHtml,/Algemene uitgangspunten/);assert.match(exam.introductionHtml,/Nyenrode/);
  exam.sections.forEach((section,i)=>{
    const questions=exam.questions.filter(q=>q.sectionId===section.id);
    assert.equal(questions.length,spec.counts[i]);assert.equal(questions.reduce((sum,q)=>sum+q.points,0),[30,20,30,20][i]);
    assert.ok(section.contentHtml.length>500,'Volledige casus vereist');
  });
  exam.questions.forEach((q,i)=>{
    assert.equal(q.id,'vraag-'+(i+1));assert.ok(q.prompt.length>20);assert.ok(q.solution.length>20);assert.ok(q.solutionHtml);
    assert.ok(exam.sections.some(s=>s.id===q.sectionId));
    for(const html of [q.promptHtml,q.solutionHtml])assert.doesNotMatch(html,/<script|onerror=|javascript:/i);
  });
  assert.match(exam.sections[0].contentHtml,new RegExp(spec.names[0]));
  assert.ok((exam.sections.map(s=>s.contentHtml).join('').match(/<table[> ]/g)||[]).length>=3,'Casustabellen moeten behouden blijven');
}
for(const file of ['js/answer-editor.js','js/practice-upgrades.js','js/exams.js'])new vm.Script(read(file),{filename:file});
const html=read('index.html');
for(const file of ['data/exams.js','data/exam-20250924.js','data/exam-20260429.js','js/answer-editor.js','js/exam-engine.js'])assert.ok(html.includes('src="'+file+'"'));
for(const file of ['css/answer-editor.css','css/exams.css','css/practice-upgrades.css'])assert.ok(html.includes('href="'+file+'"'));
assert.ok(html.indexOf('src="js/answer-editor.js"')<html.indexOf('src="js/bootstrap.js"'));
console.log('Tentameninhoud gevalideerd: 2 tentamens, 54 vragen, 8 casussecties, 200 punten.');
