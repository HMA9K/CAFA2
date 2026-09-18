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
  for (const script of ['js/exam-engine.js', 'js/answer-editor.js', 'js/stock-table.js', 'data/exams.js']) window.eval(read(script));
  window.CAFA2_EXAMS = exam ? [exam] : [];
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

try {
  const ui = environment();
  assert.equal(ui.$('[data-exam-filter]').value, 'upcoming');
  assert.match(ui.hostText(), /CAFA2 oefenvragen/);
  assert.match(ui.hostText(), /CAFA2 integratietest/);
  assert.equal(ui.state().length, 0);
  assert.equal(ui.$('.exam-clock').hidden, true);
  assert.equal(ui.$('.exam-dashboard-title h1').textContent, 'Dashboard');
  assert.equal(ui.$('.exam-meta-strip'), null, 'The screenshot layout has no metric strip.');
  assert.deepEqual(Array.from(ui.document.querySelectorAll('.exam-section h2'), el => el.textContent), ['Vandaag', 'Volgende 30 dagen']);
  assert.deepEqual(Array.from(ui.document.querySelectorAll('.exam-table-upcoming th'), el => el.textContent), ['Toetsnaam', 'Code', 'Beschikbaar', 'Deadline', 'Duur', 'Actie']);
  assert.equal(ui.$('.exam-empty-row').textContent, 'Geen toetsen', 'Empty next-30-days section stays visible.');
  assert.equal(ui.document.body.classList.contains('exam-dashboard'), true);

  ui.route('#welkom/practice');
  assert.match(ui.hostText(), /Geen tijdslimiet/);
  assert.equal(ui.$('[data-exam-extra]'), null, 'MC practice must have no extra-time toggle.');
  assert.equal(ui.$('.exam-clock').hidden, true);
  ui.route('#welkom/ui-fixture');
  assert.match(ui.hostText(), /Voorblad testfixture/);
  assert.equal(ui.$('#exam-app script'), null, 'Formatted introductory text must be sanitized.');
  assert.equal(ui.window.unsafe, undefined);
  assert.equal(ui.state().length, 0, 'Opening welcome must not create a timed attempt.');
  ui.setTime(startTime + 120_000);
  assert.equal(ui.$('.exam-clock').hidden, true, 'Welcome time is not counted as exam time.');
  ui.change('[data-exam-extra]', true);
  assert.equal(ui.$('[data-exam-total]').textContent, '45');
  ui.action('start');
  const first = ui.state()[0];
  assert.equal(first.startedAt, startTime + 120_000);
  assert.equal(first.deadlineAt, first.startedAt + 45 * 60_000);
  assert.equal(first.extraMinutes, 30);
  assert.equal(ui.$('.exam-clock').hidden, false);
  assert.equal(ui.$('[role="timer"]').textContent, '45 min');
  assert.equal(ui.$('[data-exam-extra]'), null, 'Extra time is chosen once, before starting.');
  assert.match(ui.hostText(), /Vraaggegeven A/);
  assert.doesNotMatch(ui.hostText(), /GEHEIM ANTWOORD/, 'No solution may appear during an active exam.');
  ui.type('<p><strong>Mijn uitwerking</strong></p><table><tr><td>42</td></tr></table>');
  assert.match(ui.state()[0].answers.q1.html, /<strong>Mijn uitwerking<\/strong>/);
  assert.match(JSON.parse(ui.saved()).attempts[0].answers.q1.html, /<td>42<\/td>/);

  ui.action('section');
  assert.match(ui.$('#exam-info-dialog').textContent, /UITSLUITEND CASUS A/);
  assert.doesNotMatch(ui.$('#exam-info-dialog').textContent, /UITSLUITEND CASUS B/);
  ui.click('[data-close-info]');
  ui.action('introduction');
  assert.match(ui.$('#exam-info-dialog').textContent, /Voorblad testfixture/);
  ui.click('[data-close-info]');
  ui.action('mark');
  assert.equal(ui.state()[0].marked.q1, true);
  ui.action('next');
  assert.equal(ui.state()[0].currentIndex, 1);
  ui.change('input[name="exam-answer"][value="b"]', true);
  assert.equal(ui.state()[0].answers.q2.optionId, 'b');
  ui.action('next');
  assert.equal(ui.state()[0].currentIndex, 2);
  ui.action('section');
  assert.match(ui.$('#exam-info-dialog').textContent, /UITSLUITEND CASUS B/);
  assert.doesNotMatch(ui.$('#exam-info-dialog').textContent, /UITSLUITEND CASUS A/);
  ui.click('[data-close-info]');
  ui.action('overview');
  assert.equal(ui.document.querySelectorAll('#exam-info-dialog [data-exam-index]').length, 3);
  assert.equal(ui.document.querySelectorAll('#exam-info-dialog .exam-overview-section').length, 2);
  assert.equal(ui.$('#exam-info-dialog [data-exam-index="0"] .cafa-overview-title').textContent, 'Uitwerking A');
  assert.match(ui.$('#exam-info-dialog [data-exam-index="0"]').getAttribute('aria-label'), /beantwoord, gemarkeerd/);
  assert.equal(ui.$('#exam-info-dialog [aria-current="step"]').dataset.examIndex, '2');
  assert.equal(ui.$('#exam-info-dialog [data-exam-index="0"]').classList.contains('is-answered'), true);
  assert.equal(ui.$('#exam-info-dialog [data-exam-index="0"]').classList.contains('is-marked'), true);
  ui.click('#exam-info-dialog [data-exam-index="0"]');
  assert.equal(ui.state()[0].currentIndex, 0);
  assert.equal(ui.$('#exam-info-dialog'), null);
  assert.match(ui.$('[contenteditable="true"]').innerHTML, /Mijn uitwerking/);
  ui.action('next');
  ui.action('previous');
  assert.equal(ui.state()[0].currentIndex, 0);
  assert.match(ui.$('[contenteditable="true"]').innerHTML, /<td>42<\/td>/);

  const savedActive = ui.saved();
  ui.close();
  const reopened = environment({ now: first.startedAt + 10 * 60_000, saved: savedActive, hash: '#tentamen/' + first.id });
  assert.equal(reopened.state()[0].deadlineAt, first.deadlineAt, 'Refreshing must retain the original deadline.');
  assert.equal(reopened.$('[role="timer"]').textContent, '35 min');
  assert.match(reopened.$('[contenteditable="true"]').innerHTML, /Mijn uitwerking/);
  reopened.setTime(first.deadlineAt - 601_000);
  assert.equal(reopened.$('[role="timer"]').textContent, '11 min');
  reopened.setTime(first.deadlineAt - 600_000);
  assert.equal(reopened.$('[role="timer"]').textContent, '10:00');
  assert.match(reopened.$('#exam-announcement').textContent, /tien minuten/);
  reopened.setTime(first.deadlineAt - 599_000);
  assert.equal(reopened.$('[role="timer"]').textContent, '09:59');
  reopened.setTime(first.deadlineAt);
  reopened.route(reopened.window.location.hash);
  assert.equal(reopened.state()[0].status, 'completed');
  assert.equal(reopened.state()[0].submittedAt, first.deadlineAt);
  assert.equal(reopened.state()[0].finishReason, 'timeout');
  assert.equal(reopened.$('[contenteditable="true"]'), null, 'Timed-out answers must be read-only.');
  assert.match(reopened.$('.exam-review-answer').textContent, /Mijn uitwerking/);
  assert.equal(reopened.$('.exam-clock').hidden, true);
  assert.match(reopened.hostText(), /GEHEIM ANTWOORD A/);
  assert.match(reopened.hostText(), /GEHEIM ANTWOORD B/);
  assert.match(reopened.hostText(), /Modelbedrag 200/);
  assert.match(reopened.hostText(), /geen cijfer of slagingsuitslag/);
  reopened.route('#dashboard/voltooid');
  assert.match(reopened.hostText(), /CAFA2 integratietest/);
  assert.match(reopened.hostText(), /Tijd verstreken/);
  assert.match(reopened.hostText(), /2 \/ 3/);
  assert.deepEqual(Array.from(reopened.document.querySelectorAll('.exam-section h2'), el => el.textContent), ['Geplande inzages', 'Voltooide toetsen']);
  assert.deepEqual(Array.from(reopened.document.querySelectorAll('.exam-table-completed th'), el => el.textContent), ['Toetsnaam', 'Code', 'Ingeleverd', 'Percentage juist', 'Cijfer', 'Resultaat', 'Actie']);
  assert.match(reopened.hostText(), /Niet beoordeeld/);
  const beforeFilters = reopened.saved();
  reopened.change('[data-completed-type]', 'practice');
  assert.match(reopened.$('.exam-table-completed').textContent, /Geen voltooide toetsen/);
  reopened.change('[data-completed-type]', 'exam');
  assert.match(reopened.$('.exam-table-completed').textContent, /CAFA2 integratietest/);
  reopened.change('[data-completed-attempts]', 'latest');
  assert.equal(reopened.$('[data-completed-attempts]').value, 'latest');
  assert.equal(reopened.saved(), beforeFilters, 'Display filters cannot mutate saved attempts.');
  reopened.action('backup');
  assert.equal(reopened.downloads.length, 1);
  const backupText = await new Promise((resolve, reject) => {
    const reader = new reopened.window.FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(reopened.downloads[0]);
  });
  assert.deepEqual(JSON.parse(backupText), JSON.parse(reopened.saved()), 'Backup must include snapshots and all answers without modifying progress.');

  const expiredWhileClosed = environment({ now: first.deadlineAt + 3_600_000, saved: savedActive });
  assert.equal(expiredWhileClosed.state()[0].status, 'completed', 'Reopening the dashboard after expiry automatically submits.');
  assert.equal(expiredWhileClosed.state()[0].submittedAt, first.deadlineAt);
  assert.match(expiredWhileClosed.state()[0].answers.q1.html, /Mijn uitwerking/);

  const submit = environment();
  submit.route('#welkom/ui-fixture');
  submit.action('start');
  submit.type('<p>Vrijwillig ingeleverd antwoord</p>');
  submit.action('submit');
  assert.equal(submit.$('#exam-submit-dialog').open, true);
  assert.match(submit.$('[data-exam-submit-summary]').textContent, /1 van 3 vragen beantwoord/);
  submit.click('[data-exam-cancel-submit]');
  assert.equal(submit.state()[0].status, 'active', 'Cancel must not submit.');
  submit.action('submit');
  submit.click('[data-exam-confirm-submit]');
  assert.equal(submit.state()[0].status, 'completed');
  assert.equal(submit.state()[0].finishReason, 'submitted');
  assert.equal(submit.$('[contenteditable="true"]'), null);
  assert.match(submit.hostText(), /Vrijwillig ingeleverd antwoord/);

  const demo = environment({ exam: null });
  demo.route('#welkom/demo-omgeving');
  demo.action('start');
  demo.action('overview');
  assert.equal(demo.document.querySelectorAll('#exam-info-dialog [data-exam-index]').length, 3,
    'The sectionless demonstration must list all its questions.');
  demo.click('[data-close-info]');
  assert.equal(demo.$('[data-exam-action="section"]'), null);

  // All real stock questions use the question's blank table, never the answer key.
  const content=environment({exam:null});
  for(const day of ['20240422','20240930','20250417','20250924','20260429'])content.window.eval(read('data/exam-'+day+'.js'));
  let stockQuestions=0;
  for(const exam of content.window.CAFA2_EXAMS){
    const run=environment({exam});run.route('#welkom/'+exam.id);run.action('start');
    for(const [index,q] of exam.questions.entries()){
      const schema=run.window.CafaStockTable.template(q);if(!schema)continue;stockQuestions++;
      run.action('overview');run.click('[data-exam-index="'+index+'"]');
      assert.equal(run.document.querySelectorAll('[data-exam-answer] .stock-matrix thead th').length,6);
      assert.equal(run.document.querySelectorAll('[data-exam-answer] .stock-matrix tbody tr').length,schema.rows.length);
      assert.equal(run.document.querySelectorAll('[data-stock-cell]').length>=15,true);
      assert.equal(run.window.CafaExamEngine.answeredCount(run.state()[0]),0,'Blank headers must not count as answers.');
      const input=run.$('[data-stock-cell]');input.value='0';input.dispatchEvent(new run.window.Event('input',{bubbles:true}));
      assert.equal(run.window.CafaExamEngine.answeredCount(run.state()[0]),1,'An explicit zero is an answer.');
      input.value='';input.dispatchEvent(new run.window.Event('input',{bubbles:true}));
      assert.equal(run.window.CafaExamEngine.answeredCount(run.state()[0]),0);
    }
    assert.deepEqual(run.errors,[]);run.close();
  }
  assert.equal(stockQuestions,14,'Every stock matrix across all five exams must be fillable.');
  const real=content.window.CAFA2_EXAMS.find(exam=>exam.id==='cafa2-20260429');
  const stock=environment({exam:real});stock.route('#welkom/'+real.id);stock.action('start');
  stock.action('overview');stock.click('[data-exam-index="13"]');
  assert.equal(stock.$('[data-stock-cell="r0-c3"]').value,'','Unknown percentages stay blank.');
  const cell=stock.$('[data-stock-cell="r1-c1"]');cell.value='320.000,50';cell.dispatchEvent(new stock.window.Event('input',{bubbles:true}));
  stock.type('<p>Bestaande toelichting behouden</p>');
  const qid=real.questions[13].id;
  assert.equal(stock.state()[0].answers[qid].stockCells['r1-c1'],'320.000,50');
  stock.action('next');stock.action('previous');
  assert.equal(stock.$('[data-stock-cell="r1-c1"]').value,'320.000,50');
  assert.match(stock.$('[contenteditable]').textContent,/Bestaande toelichting/);
  const restored=environment({exam:real,saved:stock.saved(),hash:stock.window.location.hash});
  assert.equal(restored.$('[data-stock-cell="r1-c1"]').value,'320.000,50','Refresh preserves table cells.');
  restored.setTime(restored.state()[0].deadlineAt);restored.route(restored.window.location.hash);
  assert.equal(restored.$('[data-stock-cell]'),null,'Submitted tables are read-only.');
  assert.match(restored.hostText(),/320\.000,50/);assert.match(restored.hostText(),/Bestaande toelichting/);
  assert.deepEqual(restored.errors,[]);assert.deepEqual(stock.errors,[]);
  console.log('Stock tables: 14 templates, blank/zero status, percentages, navigation, reload, notes and read-only expiry passed.');

  for (const run of [ui, reopened, expiredWhileClosed, submit, demo]) assert.deepEqual(run.errors, [], 'No uncaught jsdom errors are permitted.');
  console.log('Exam UI: welcome, untimed MC, +30 minutes, sections, navigation, autosave/reload, timer, expiry, read-only review, completion and backup passed.');
} finally {
  windows.forEach(window => window.close());
}
