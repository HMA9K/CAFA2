import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';
import {originalPdfs} from '../data/exam-original-pdfs.mjs';
import {loadSources} from '../scripts/exam-practice-source.mjs';
const ctx={window:{}};vm.createContext(ctx);
for(const file of fs.readdirSync('data').filter(f=>/^exam-\d+\.js$/.test(f)))vm.runInContext(fs.readFileSync('data/'+file,'utf8'),ctx);
assert.equal(Object.keys(originalPdfs).length,11);
let count=0;
for(const exam of ctx.window.CAFA2_EXAMS){
  const entry=originalPdfs[exam.id];assert.ok(entry);assert.equal(entry.date,exam.date);
  for(const kind of ['questions','solutions']){
    const source=entry[kind];assert.ok(source);
    assert.ok(source.url,'Ieder tentamen heeft beide oorspronkelijke PDFs.');
    assert.match(source.url,/^assets\/tentamens\/\d{8}\/(opgaven|uitwerking)\.pdf$/);
    const data=fs.readFileSync(source.url);assert.equal(data.subarray(0,5).toString(),'%PDF-');
    assert.equal(crypto.createHash('sha256').update(data).digest('hex'),source.sha256);assert.ok(source.pages>0);count++;
  }
}
assert.equal(count,22);
const {exams,banks,topics}=loadSources(),practice={window:{CAFA2_EXAMS:exams,CAFA2_DATA:{modules:banks},CAFA2_TOPICS:topics}};vm.createContext(practice);
for(const f of fs.readdirSync('data').filter(f=>/^exam-practice-\d+\.js$/.test(f)))vm.runInContext(fs.readFileSync('data/'+f,'utf8'),practice);
vm.runInContext(fs.readFileSync('data/exam-practice.js','utf8'),practice);
const questions=Object.values(banks).flatMap(b=>b.questions).filter(q=>q.sourceType==='exam');assert.equal(questions.length,380);
for(const q of questions)assert.ok(originalPdfs[q.examId]?.questions.url&&originalPdfs[q.examId]?.solutions.url);
console.log('Alle elf tentamens gekoppeld aan beide oorspronkelijke PDFs: 22 gecontroleerde bestanden.');
