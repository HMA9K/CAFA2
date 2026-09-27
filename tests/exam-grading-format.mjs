import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {loadSources} from '../scripts/exam-practice-source.mjs';
const require=createRequire(import.meta.url);let JSDOM;
try{({JSDOM}=require(process.env.JSDOM_PATH||'jsdom'));}catch(error){
 if(process.env.JSDOM_PATH)throw error;
 console.log('Normering-DOM overgeslagen: jsdom ontbreekt; stel JSDOM_PATH in om deze te testen.');process.exit(0);
}
const dom=new JSDOM('<!doctype html><html><head></head><body></body></html>',{runScripts:'outside-only'}),win=dom.window;
const style=win.document.createElement('style');style.textContent=fs.readFileSync('css/exam-document.css','utf8');win.document.head.append(style);
win.eval(fs.readFileSync('js/answer-editor.js','utf8'));win.eval(fs.readFileSync('js/exam-document.js','utf8'));
win.eval(fs.readFileSync('data/exam-source-format.js','utf8'));
const {exams}=loadSources();win.CAFA2_EXAMS=exams;
const exam=exams.find(e=>e.id==='cafa2-20240422'),question=exam.questions.find(q=>q.id==='vraag-8');
win.document.body.innerHTML=win.CafaExamDocument.render(exam,'solution',question.solutionHtml);
assert.equal(win.document.querySelector('.exam-source-points').textContent,'(2 g/f)');
assert.equal(win.getComputedStyle(win.document.querySelector('.exam-source-points')).color,'rgb(238, 0, 0)');
assert.ok(win.document.body.textContent.includes('€ 700.000. (2 g/f)'));
const html='<p>(2 g/f) (1 punt g/f) (2 punten g/f) (½) (1/2) (g/f) Normering: 1 punt g/f.</p><p>(2023) (80%) (1/5)</p>';
win.document.body.innerHTML=win.CafaExamDocument.render(exam,'solution',html);
assert.equal(win.document.querySelectorAll('.exam-source-points').length,7);
assert.equal(win.document.querySelectorAll('p')[1].querySelectorAll('.exam-source-points').length,0);
const once=win.document.body.innerHTML;win.document.body.innerHTML=win.CafaExamDocument.render(exam,'solution',once);
assert.equal(win.document.querySelectorAll('.exam-source-points .exam-source-points').length,0);
let models=0;
for(const e of exams)for(const q of e.questions){
 if(!/g\s*\/\s*f/i.test(q.solutionHtml||''))continue;
 win.document.body.innerHTML=win.CafaExamDocument.render(e,'solution',q.solutionHtml);
 const expected=(q.solutionHtml.match(/\((?:\d+\s*(?:punt(?:en)?\s*)?)?g\s*\/\s*f\)|\b\d+\s+punt(?:en)?\s+g\s*\/\s*f\b/gi)||[]);
 for(const text of expected)assert.ok([...win.document.querySelectorAll('.exam-source-points')].some(n=>n.textContent.includes(text)),e.id+'/'+q.id+' '+text);
 models++;
}
console.log('Rode normering: Monopoli vraag 8, g/f-varianten en '+models+' echte antwoordmodellen; jaartallen en percentages behouden.');
dom.window.close();
