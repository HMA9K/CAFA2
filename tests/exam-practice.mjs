import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {loadSources,root} from '../scripts/exam-practice-source.mjs';
const {exams,banks,topics}=loadSources();
const legacy=JSON.parse(JSON.stringify(banks)),ctx={window:{CAFA2_DATA:{modules:banks},CAFA2_TOPICS:topics,CAFA2_EXAMS:exams}};vm.createContext(ctx);
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const meta=JSON.parse(read('docs/mc-audit/exam-practice-coverage.json'));
for(const e of meta.exams)vm.runInContext(read(e.file),ctx);
vm.runInContext(read('data/exam-practice.js'),ctx);
const all=Object.values(banks).flatMap(b=>b.questions),added=all.filter(q=>q.sourceType==='exam');
assert.equal(all.length,627);assert.equal(added.length,380);assert.equal(meta.exams.length,11);
assert.equal(new Set(added.map(q=>q.key)).size,380);
assert.equal(new Set(added.map(q=>q.sourceKey)).size,282);
assert.equal(new Set(topics.flatMap(t=>t.questions)).size,627);
assert.equal(meta.splitQuestions,65);
for(const q of all){assert.equal(q.guidance.pattern.length,3);assert.ok(q.guidance.pattern[0].startsWith('Herken de vraag:'));assert.ok(q.guidance.pattern[1].startsWith('Let op de beslissende gegevens:'));assert.ok(q.guidance.pattern[2].startsWith('Vorm van het antwoord:'));}
assert.ok(topics.flatMap(t=>t.questions).length>=627);
let dependencies=0;
for(const[code,bank]of Object.entries(banks)){
 assert.deepEqual(bank.questions.slice(0,legacy[code].questions.length),legacy[code].questions);
 bank.questions.forEach((q,i)=>assert.equal(q.id,i+1));
 const order=meta.practiceOrder[code];assert.equal(order.length,bank.questions.length);assert.equal(new Set(order).size,order.length);
 for(const q of bank.questions.filter(q=>q.part==='a')){
  const parts=bank.questions.filter(p=>p.sourceKey===q.sourceKey);
  const start=order.indexOf(code+'-'+q.id);
  assert.deepEqual(order.slice(start,start+parts.length),parts.sort((a,b)=>a.part.localeCompare(b.part)).map(p=>code+'-'+p.id));
 }
}
for(const exam of exams)for(const source of exam.questions){
 const parts=added.filter(q=>q.examId===exam.id&&q.questionId===source.id);assert.ok(parts.length);
 assert.equal(parts.length,parts[0].partCount);
 if(parts.length>1)assert.deepEqual(parts.map(q=>q.part),Array.from({length:parts.length},(_,i)=>String.fromCharCode(97+i)));
 for(const q of parts){
 assert.equal(q.originalPromptHtml,source.promptHtml);assert.equal(q.sourceSolutionHtml,source.solutionHtml);
 if(parts.length===1){assert.equal(q.task,source.prompt);assert.equal(q.promptHtml,source.promptHtml);}
 assert.ok(!q.solutionHtml.includes('<pre>'));assert.ok(q.options.every(o=>!o.html||!o.html.includes('<pre>')));
 if(q.answerKind==='stock'){
  assert.ok(q.answerSchema);assert.ok(q.answerSchema.headers.length>=5);
  assert.ok(q.answerSchema.rows.every(row=>row.length===q.answerSchema.headers.length));
  assert.ok(q.answerSchema.rows.some(row=>row.slice(1).some(cell=>cell==='')));
  assert.ok(q.answerSchema.rows.filter(row=>/^31-12-/.test(row[0])).every(row=>/^31-12-\d{4}$/.test(row[0])));
 }
 assert.equal(q.sectionId,source.sectionId);assert.equal(q.options.length,4);
 assert.equal(new Set(q.options.map(o=>o.html||o.text)).size,4);
 assert.ok(q.options.every(o=>o.why.length>30));
 const raw=JSON.parse(read('content/practice/exam-mc/'+exam.id+'.json')).find(x=>x.key===q.key);
 assert.deepEqual(JSON.parse(JSON.stringify(q.options[q.correct])),raw.options[0]);
 if(q.mutation.kind==='amount'){
  assert.equal(new Set([q.mutation.correctValue,...q.mutation.incorrectValues]).size,4);
  assert.equal(q.options[q.correct].html,q.practiceSolutionHtml);
  const normalized=s=>s.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ');
  assert.ok(normalized(q.practiceSolutionHtml).includes(q.mutation.sourceToken.replace(/\s+/g,' ')),'Mutation must affect a real source amount: '+q.key+' '+q.mutation.sourceToken);
 }
 for(const id of q.dependencyQuestionIds){const prev=exam.questions.find(x=>x.id===id);assert.ok(prev&&prev.sectionId===source.sectionId);assert.ok(exam.questions.indexOf(prev)<exam.questions.indexOf(source));dependencies++;}
 assert.ok(topics.find(t=>t.id===q.topicId).questions.includes(q.code+'-'+q.id));
 for(const key of q.siblingSourceKeys){const sibling=parts.find(p=>p.key===key);assert.ok(sibling&&sibling.part<q.part);}
 }
}
for(const m of meta.exams){const fragment=read(m.fragment);assert.equal((fragment.match(/<section class="screen question frame"/g)||[]).length,m.count);}
console.log(`MC-tentamendekking gevalideerd: 282/282 bronnen, 380 tentamenoefeningen, 65 opgesplitste vragen, 627 unieke vragen, ${dependencies} geldige eerdere casusvragen; oorspronkelijke MC-inhoud behouden.`);
