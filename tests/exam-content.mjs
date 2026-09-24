import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(file)=>fs.readFileSync(path.join(root,file),'utf8');
const sandbox={window:{}};vm.createContext(sandbox);
const examFiles=[
  'data/exam-20210419.js','data/exam-20211006.js','data/exam-20220411.js',
  'data/exam-20221006.js','data/exam-20230411.js','data/exam-20231009.js',
  'data/exam-20240422.js','data/exam-20240930.js','data/exam-20250417.js',
  'data/exam-20250924.js','data/exam-20260429.js'
];
for(const file of ['js/exam-engine.js','data/exams.js',...examFiles])new vm.Script(read(file),{filename:file}).runInContext(sandbox);
const {CafaExamEngine:engine,CAFA2_EXAMS:exams}=sandbox.window;
assert.equal(exams.length,11);
const expected={
  'cafa2-20210419':{date:'2021-04-19',counts:[8,9,4,7],points:[30,30,20,20]},
  'cafa2-20211006':{date:'2021-10-06',counts:[8,5,4,6],points:[30,30,20,20]},
  'cafa2-20220411':{date:'2022-04-11',counts:[8,6,4,6],points:[30,30,20,20]},
  'cafa2-20221006':{date:'2022-10-06',counts:[8,7,5,6],points:[30,30,20,20]},
  'cafa2-20230411':{date:'2023-04-11',counts:[7,7,5,6],points:[30,30,20,20]},
  'cafa2-20231009':{date:'2023-10-09',counts:[7,8,6,4],points:[30,30,20,20]},
  'cafa2-20240422':{date:'2024-04-22',counts:[8,5,6,5],points:[30,20,30,20]},
  'cafa2-20240930':{date:'2024-09-30',counts:[8,5,7,5],points:[30,20,30,20]},
  'cafa2-20250417':{date:'2025-04-17',counts:[8,6,8,6],points:[30,20,30,20]},
  'cafa2-20250924':{date:'2025-09-24',counts:[8,6,9,8],points:[30,20,30,20]},
  'cafa2-20260429':{date:'2026-04-29',counts:[7,6,6,4],points:[30,20,30,20]}
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
    assert.equal(questions.length,spec.counts[i]);assert.equal(questions.reduce((sum,q)=>sum+q.points,0),spec.points[i]);
    assert.ok(section.contentHtml.length>500,'Volledige casus vereist');
  });
  exam.questions.forEach((q,i)=>{
    assert.equal(q.id,'vraag-'+(i+1));assert.ok(q.prompt.length>20);assert.ok(q.solution.length>20);assert.ok(q.solutionHtml);
    assert.ok(exam.sections.some(s=>s.id===q.sectionId));
    for(const html of [q.promptHtml,q.solutionHtml])assert.doesNotMatch(html,/<script|onerror=|javascript:/i);
  });
  assert.ok((exam.sections.map(s=>s.contentHtml).join('').match(/<table[> ]/g)||[]).length>=3,'Casustabellen moeten behouden blijven');
}
for(const file of ['js/answer-editor.js','js/practice-upgrades.js','js/exams.js'])new vm.Script(read(file),{filename:file});
const html=read('index.html');
for(const file of ['data/exams.js',...examFiles,'js/answer-editor.js','js/exam-engine.js'])assert.ok(html.includes('src="'+file+'"'));
const styles=[...html.matchAll(/<link\b[^>]*href="([^"]+)"/g)].map(match=>match[1].split('?')[0]);
for(const file of ['css/answer-editor.css','css/exams.css','css/practice-upgrades.css'])assert.ok(styles.includes(file),'Required stylesheet: '+file);
assert.ok(html.indexOf('src="js/answer-editor.js"')<html.search(/src="js\/bootstrap\.js(?:\?v=[\w-]+)?"/));
console.log('Tentameninhoud gevalideerd: 11 tentamens, 282 vragen, 44 casussecties, 1100 punten.');
