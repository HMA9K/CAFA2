// Optional DOM integration suite. Run with JSDOM_PATH=/absolute/path/to/jsdom/lib/api.js.
// This tests application state and DOM behavior, not native browser editing commands or layout.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let JSDOM, VirtualConsole;
try {
  ({ JSDOM, VirtualConsole } = require(process.env.JSDOM_PATH || 'jsdom'));
} catch (error) {
  throw new Error('Install jsdom outside the static site or set JSDOM_PATH before running tests/exam-ui.mjs.', { cause: error });
}
const read = path => fs.readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const storageKey = 'cafa2-full-exams-v1';
const startTime = Date.parse('2026-09-17T10:00:00Z');
const fixture = () => ({
  id: 'ui-fixture', title: 'CAFA2 integratietest', date: '2026-09-17', durationMinutes: 15,
  introduction: 'Instructies voor de DOM-test, geen echt tentamen.',
  introductionHtml: '<p>Voorblad testfixture <strong>lees dit eerst</strong>.</p><script>window.unsafe=true</script>',
  instructions: ['Bewaar alle antwoorden.'], maxScore: 10, passPoints: 5.5,
  sections: [
    { id: 'a', title: 'Opgave A', contentHtml: '<p>UITSLUITEND CASUS A</p><table><tr><th>Post A</th><td>100</td></tr></table>' },
    { id: 'b', title: 'Opgave B', contentHtml: '<p>UITSLUITEND CASUS B</p><table><tr><th>Post B</th><td>200</td></tr></table>' }
  ],
  questions: [
    { id: 'q1', type: 'open', title: 'Uitwerking A', sectionId: 'a', prompt: 'Werk A uit.', promptHtml: '<p>Werk A <strong>uit</strong>.</p><table><tr><td>Vraaggegeven A</td></tr></table>', solution: 'GEHEIM ANTWOORD A', points: 4 },
    { id: 'q2', type: 'mc', sectionId: 'a', prompt: 'Kies A of B.', options: [{ id: 'a', text: 'Antwoord A' }, { id: 'b', text: 'Antwoord B' }], correctOptionId: 'b', solution: 'GEHEIM ANTWOORD MC', points: 2 },
    { id: 'q3', type: 'open', sectionId: 'b', prompt: 'Werk B uit.', solutionHtml: '<p>GEHEIM ANTWOORD B</p><table><tr><td>Modelbedrag 200</td></tr></table>', points: 4 }
  ]
});
const windows = [];

function environment({ now = startTime, saved, hash = '#dashboard', exam = fixture(), practice = [] } = {}) {
  const errors = [], downloads = [], intervalCallbacks = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error));
  const dom = new JSDOM('<!doctype html><html lang="nl"><body><header><div class="top-controls"></div></header><main>' + read('fragments/exams.html') + '</main></body></html>', {
    url: 'https://example.invalid/' + hash,
    runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole
  });
  windows.push(dom.window);
  const { window } = dom;
  let currentTime = now;
  window.Date.now = () => currentTime;
  window.scrollTo = () => {};
  window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  window.setInterval = callback => { intervalCallbacks.push(callback); return intervalCallbacks.length; };
  window.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  window.HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); this.dispatchEvent(new window.Event('close')); };
  window.URL.createObjectURL = blob => { downloads.push(blob); return 'blob:fixture-backup'; };
  window.URL.revokeObjectURL = () => {};
  window.HTMLAnchorElement.prototype.click = function () { /* Backups must never navigate or download during tests. */ };
  window.CafaPractice = { getCompleted: () => practice };
  if (saved !== undefined) window.localStorage.setItem(storageKey, saved);
  for (const script of ['js/exam-engine.js', 'js/answer-editor.js', 'js/stock-table.js', 'js/journal-table.js', 'data/exam-source-format.js', 'js/exam-document.js', 'data/exams.js']) window.eval(read(script));
  window.CAFA2_EXAMS = exam ? (Array.isArray(exam)?exam:[exam]) : [];
  window.eval(read('js/exams.js'));
  const document = window.document;
  const $ = selector => document.querySelector(selector);
  function route(value) {
    window.history.replaceState(null, '', value);
    window.dispatchEvent(new window.HashChangeEvent('hashchange'));
  }
  function click(selector) {
    const element = $(selector);
    assert.ok(element, `Expected element: ${selector}`);
    element.click();
    // Hash assignment is synchronous; manually deliver routing without waiting for jsdom's task queue.
    window.dispatchEvent(new window.HashChangeEvent('hashchange'));
  }
  function action(name) { click('[data-exam-action="' + name + '"]'); }
  function setTime(value) { currentTime = value; intervalCallbacks.forEach(callback => callback()); }
  function type(html) {
    const element = $('[contenteditable="true"]');
    assert.ok(element, 'An editable answer must be present.');
    element.innerHTML = html;
    element.dispatchEvent(new window.InputEvent('input', { bubbles: true, inputType: 'insertText' }));
  }
  function change(selector, value) {
    const element = $(selector);
    assert.ok(element, `Expected field: ${selector}`);
    if (element.type === 'checkbox' || element.type === 'radio') element.checked = value;
    else element.value = value;
    element.dispatchEvent(new window.Event('change', { bubbles: true }));
  }
  return {
    window, document, $, route, click, action, setTime, type, change, errors, downloads,
    state: () => window.CafaExams.getAttempts(),
    saved: () => window.localStorage.getItem(storageKey),
    hostText: () => $('#exam-app').textContent,
    close: () => window.close()
  };
}

const seed=environment({exam:null});
for(const name of fs.readdirSync(new URL('../data/',import.meta.url)).filter(n=>/^exam-20/.test(n)))seed.window.eval(read('data/'+name));
const exam=seed.window.CAFA2_EXAMS.find(e=>e.id==='cafa2-20260429');
const sample=seed.window.CafaExamEngine.createAttempt(exam,{now:startTime,id:'layout-preview'});
sample.answers[exam.questions[2].id]={journalRows:[['Deelneming','2.000.000','','Voorbeeldantwoord'],['Aan Bank','','2.000.000','']]};
sample.scores={};exam.questions.forEach((q,i)=>{sample.scores[q.id]=i%3===0?q.points:i%3===1?0:q.points/2;});
const completed=seed.window.CafaExamEngine.finishAttempt(sample,{now:startTime+1000});
const page=environment({exam,saved:JSON.stringify({version:1,attempts:[completed]}),hash:'#inzage/layout-preview'});
const style=['app','answer-editor','exams','stock-table','exam-document','exam-experience'].filter(n=>fs.existsSync(new URL('../css/'+n+'.css',import.meta.url))).map(n=>'<link rel="stylesheet" href="../css/'+n+'.css">').join('');
function write(name){fs.writeFileSync(new URL('./'+name+'.html',import.meta.url),'<!doctype html><html lang="nl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>CAFA2 layoutcontrole</title>'+style+'<body class="enhanced exam-surface"><p style="padding:12px;background:#eee">Layoutcontrole met fictieve voorbeeldscores. <a href="experience-results-preview">Resultaten</a> · <a href="experience-report-preview">Scorerapport</a> · <a href="experience-detail-preview">Vraaginzage</a></p><main id="exam-app">'+page.$('#exam-app').innerHTML+'</main></body></html>');}
write('experience-results-preview');
page.$('[data-tab="report"]').click();write('experience-report-preview');
page.route('#inzage/layout-preview/vraag/2');write('experience-detail-preview');
windows.forEach(w=>w.close());
