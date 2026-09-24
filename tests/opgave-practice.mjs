import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const read = file => fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
for (const file of [
  'js/exam-engine.js',
  'data/exams.js',
  'data/exam-20210419.js',
  'data/exam-20211006.js',
  'data/exam-20220411.js',
  'data/exam-20221006.js',
  'data/exam-20230411.js',
  'data/exam-20231009.js',
  'data/exam-20240422.js',
  'data/exam-20240930.js',
  'data/exam-20250417.js',
  'data/exam-20250924.js',
  'data/exam-20260429.js',
  'js/opgave-practice.js'
]) new vm.Script(read(file), { filename: file }).runInContext(sandbox);

const { CafaExamEngine: engine, CafaOpgavePractice: practice, CAFA2_EXAMS: exams } = sandbox.window;
const plain = value => JSON.parse(JSON.stringify(value));
assert.ok(practice, 'De samengestelde opgavenmodule moet beschikbaar zijn.');
assert.equal(typeof practice.available, 'function');
assert.equal(typeof practice.build, 'function');
assert.equal(exams.length, 11);
const originalData = JSON.stringify(exams);
const expectedCounts = [85, 70, 64, 63];

function checkComposite(number, chosen) {
  const selected = exams.filter(exam => chosen.includes(exam.id))
    .sort((a, b) => b.date.localeCompare(a.date));
  const actual = practice.build(exams, number, chosen);
  const originals = selected.map(exam => ({
    exam,
    section: exam.sections.find(section => section.id === 'opgave-' + number),
    questions: exam.questions.filter(question => question.sectionId === 'opgave-' + number)
  }));
  assert.equal(actual.practiceKind, 'opgave');
  assert.equal(actual.opgaveNumber, number);
  assert.deepEqual(plain(actual.sourceExamIds), plain(selected.map(exam => exam.id)));
  assert.equal(actual.sections.length, selected.length);
  assert.equal(actual.questions.length, originals.reduce((sum, source) => sum + source.questions.length, 0));
  assert.deepEqual(plain(actual.sourceIntroductions.map(source => source.id)), plain(selected.map(exam => exam.id)));
  assert.equal(engine.validateExam(actual).valid, true, engine.validateExam(actual).errors.join('\n'));
  assert.equal(new Set(actual.sections.map(section => section.id)).size, actual.sections.length,
    'Casus-ID’s uit verschillende tentamens mogen niet samenvallen.');
  assert.equal(new Set(actual.questions.map(question => question.id)).size, actual.questions.length,
    'Vraag-ID’s uit verschillende tentamens mogen niet samenvallen.');

  let index = 0;
  for (const { exam, section, questions } of originals) {
    assert.ok(section, `${exam.id} mist opgave ${number}.`);
    const code = exam.date.replaceAll('-', '');
    const combinedSection = actual.sections.find(item => item.sourceExamId === exam.id);
    assert.ok(combinedSection, `De casus van ${code} ontbreekt.`);
    assert.equal(combinedSection.id, exam.id + '-' + section.id);
    assert.equal(combinedSection.sourceCode, code);
    assert.equal(combinedSection.sourceSectionId, section.id);
    assert.equal(combinedSection.contentHtml, section.contentHtml,
      `De originele casustekst van ${code} moet intact blijven.`);
    assert.equal(combinedSection.points, section.points);
    const sourceIntro = actual.sourceIntroductions.find(item => item.id === exam.id);
    assert.equal(sourceIntro.introduction, exam.introduction);
    assert.equal(sourceIntro.introductionHtml, exam.introductionHtml,
      `De algemene uitgangspunten van ${code} moeten intact blijven.`);
    assert.deepEqual(plain(sourceIntro.instructions || []), plain(exam.instructions || []));

    for (const original of questions) {
      const question = actual.questions[index++];
      assert.equal(question.id, exam.id + '-' + original.id);
      assert.equal(question.sectionId, combinedSection.id);
      assert.equal(question.sourceExamId, exam.id);
      assert.equal(question.sourceCode, code);
      assert.equal(question.sourceQuestionId, original.id);
      for (const field of ['type', 'points', 'prompt', 'promptHtml', 'solution', 'solutionHtml']) {
        assert.equal(question[field], original[field], `${code} ${original.id}: ${field} is gewijzigd.`);
      }
    }
  }

  const attempt = engine.createAttempt(actual, { now: Date.parse('2026-09-24T10:00:00Z') });
  const firstPerExam = originals.map(({ exam }) => actual.questions.find(question => question.sourceExamId === exam.id));
  firstPerExam.forEach((question, i) => {
    attempt.answers[question.id] = { html: `<p>Antwoord van tentamen ${i + 1}</p>` };
    attempt.marked[question.id] = true;
  });
  assert.equal(engine.answeredCount(attempt), selected.length,
    'Antwoorden op gelijk genummerde bronvragen moeten apart worden geteld.');
  assert.equal(Object.keys(attempt.marked).length, selected.length);
  const stored = plain(attempt);
  assert.equal(engine.validateExam(stored.exam).valid, true, 'Een bewaarde samengestelde poging moet opnieuw geldig zijn.');
  assert.equal(engine.answeredCount(stored), selected.length);
  return actual;
}

for (let number = 1; number <= 4; number++) {
  assert.deepEqual(plain(practice.available(exams, number).map(exam => exam.id)), plain(exams.map(exam => exam.id)));
  const combined = checkComposite(number, exams.map(exam => exam.id));
  assert.equal(combined.questions.length, expectedCounts[number - 1], `Verkeerd totaal voor opgave ${number}.`);
}

const subset = ['cafa2-20260429', 'cafa2-20240422', 'cafa2-20250417'];
const selected = checkComposite(1, subset);
assert.equal(selected.sections.length, 3);
assert.equal(selected.questions.length, 23, 'Opgave 1 uit deze drie tentamens bevat 8 + 8 + 7 vragen.');
assert.notEqual(selected.id, checkComposite(2, subset).id, 'Elke opgave heeft een eigen oefentoets-ID.');
assert.throws(() => practice.build(exams, 1, []), 'Zonder gekozen tentamen mag geen oefentoets starten.');
assert.throws(() => practice.build(exams, 1, ['onbekend']), 'Een onbekend tentamen mag niet worden gecombineerd.');
assert.throws(() => practice.build(exams, 5, [exams[0].id]), 'Alleen opgave 1 tot en met 4 zijn beschikbaar.');
assert.equal(JSON.stringify(exams), originalData, 'Samenstellen mag het originele tentamenmateriaal niet wijzigen.');

console.log('Opgave-oefening gevalideerd: 4 opgaven, 11 bronnen, 282 vragen, selectie, bronverwijzingen en afzonderlijke antwoorden.');

// DOM-integratie is optioneel, omdat deze statische site geen npm-afhankelijkheden heeft.
// Gebruik JSDOM_PATH=/absolute/path/to/jsdom/lib/api.js om de volledige route te controleren.
const require = createRequire(import.meta.url);
let JSDOM, VirtualConsole;
try {
  ({ JSDOM, VirtualConsole } = require(process.env.JSDOM_PATH || 'jsdom'));
} catch (error) {
  if (process.env.JSDOM_PATH) throw error;
  console.log('DOM-route overgeslagen: jsdom ontbreekt; stel JSDOM_PATH in om deze te testen.');
}

if (JSDOM) {
  const storageKey = 'cafa2-full-exams-v1';
  const now = Date.parse('2026-09-24T10:00:00Z');
  const scripts = [
    'js/exam-engine.js', 'js/answer-editor.js', 'js/stock-table.js', 'js/journal-table.js',
    'data/exam-source-format.js', 'js/exam-document.js', 'data/exams.js',
    'data/exam-20210419.js', 'data/exam-20211006.js', 'data/exam-20220411.js',
    'data/exam-20221006.js', 'data/exam-20230411.js', 'data/exam-20231009.js',
    'data/exam-20240422.js', 'data/exam-20240930.js', 'data/exam-20250417.js',
    'data/exam-20250924.js', 'data/exam-20260429.js', 'js/opgave-practice.js', 'js/exams.js'
  ];

  function environment({ hash = '#dashboard', saved } = {}) {
    const errors = [], virtualConsole = new VirtualConsole();
    virtualConsole.on('jsdomError', error => errors.push(error));
    const dom = new JSDOM('<!doctype html><html lang="nl"><body><header><div class="top-controls"></div></header><main>' +
      read('fragments/exams.html') + '</main></body></html>', {
      url: 'https://example.invalid/' + hash, runScripts: 'outside-only',
      pretendToBeVisual: true, virtualConsole
    });
    const { window } = dom, { document } = window;
    window.Date.now = () => now;
    window.scrollTo = () => {};
    window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
    window.setInterval = () => 1;
    window.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
    window.HTMLDialogElement.prototype.close = function () {
      this.removeAttribute('open');
      this.dispatchEvent(new window.Event('close'));
    };
    window.CafaPractice = { getCompleted: () => [] };
    if (saved) window.localStorage.setItem(storageKey, saved);
    for (const file of scripts) window.eval(read(file));
    const $ = selector => document.querySelector(selector);
    function route(value) {
      window.history.replaceState(null, '', value);
      window.dispatchEvent(new window.HashChangeEvent('hashchange'));
    }
    function click(selector) {
      const element = $(selector);
      assert.ok(element, `Verwacht element: ${selector}`);
      element.click();
      window.dispatchEvent(new window.HashChangeEvent('hashchange'));
    }
    function change(selector, checked) {
      const element = $(selector);
      assert.ok(element, `Verwacht keuzeveld: ${selector}`);
      element.checked = checked;
      element.dispatchEvent(new window.Event('change', { bubbles: true }));
    }
    return {
      window, document, $, route, click, change, errors,
      attempts: () => window.CafaExams.getAttempts(),
      saved: () => window.localStorage.getItem(storageKey),
      close: () => window.close()
    };
  }

  const ui = environment();
  try {
    assert.ok(ui.$('.exam-table-upcoming a[href="#welkom/opgaven"]'),
      'De nieuwe oefenroute moet direct onder de MC-vragen op het dashboard staan.');
    const firstTwo = Array.from(ui.document.querySelectorAll('.exam-table-upcoming tbody tr')).slice(0, 2);
    assert.match(firstTwo[0].textContent, /CAFA2 oefenvragen/);
    assert.match(firstTwo[1].textContent, /Tentamenvragen per opgave/);

    ui.route('#welkom/opgaven');
    assert.equal(ui.document.querySelectorAll('[name="opgave-number"]').length, 4);
    assert.equal(ui.document.querySelectorAll('[data-opgave-exam]').length, 11);
    assert.match(ui.$('[data-opgave-summary]').textContent, /11 tentamens geselecteerd · 85 vragen/);
    ui.change('[name="opgave-number"][value="4"]', true);
    assert.match(ui.$('[data-opgave-summary]').textContent, /11 tentamens geselecteerd · 63 vragen/);
    ui.change('[name="opgave-number"][value="1"]', true);

    const chosen = ['cafa2-20260429', 'cafa2-20250924', 'cafa2-20240422'];
    for (const input of ui.document.querySelectorAll('[data-opgave-exam]')) {
      ui.change(`[data-opgave-exam][value="${input.value}"]`, false);
    }
    assert.match(ui.$('[data-opgave-summary]').textContent, /0 tentamens geselecteerd · 0 vragen/);
    assert.equal(ui.$('[data-exam-action="start-opgave"]').disabled, true,
      'Een oefenreeks zonder tentamens mag niet starten.');
    for (const input of ui.document.querySelectorAll('[data-opgave-exam]')) {
      ui.change(`[data-opgave-exam][value="${input.value}"]`, chosen.includes(input.value));
    }
    assert.match(ui.$('[data-opgave-summary]').textContent, /3 tentamens geselecteerd · 23 vragen/);
    assert.equal(ui.$('[data-exam-action="start-opgave"]').disabled, false);
    ui.click('[data-exam-action="start-opgave"]');
    const attempt = ui.attempts()[0];
    assert.ok(attempt, 'Starten moet een bewaarde poging maken.');
    assert.equal(attempt.untimed, true);
    assert.equal(attempt.exam.opgaveNumber, 1);
    assert.deepEqual(plain(attempt.exam.sourceExamIds), chosen);
    assert.equal(attempt.exam.questions.length, 23);
    assert.equal(ui.$('.exam-position').textContent, 'VRAAG 1 VAN 23');
    assert.match(ui.$('[role="timer"]').textContent, /Zonder tijdslimiet/);

    ui.click('[data-exam-action="overview"]');
    assert.deepEqual(Array.from(ui.document.querySelectorAll('.compact-overview-group h3'), node => node.textContent),
      ['Examen 20260429', 'Examen 20250924', 'Examen 20240422']);
    assert.deepEqual(Array.from(ui.document.querySelectorAll('.compact-overview-group'), group => group.querySelectorAll('[data-exam-index]').length),
      [7, 8, 8]);
    ui.click('#exam-info-dialog [data-exam-index="7"]');
    assert.equal(ui.attempts()[0].currentIndex, 7);
    assert.match(ui.$('.exam-question-top h2').textContent, /20250924/);
    ui.click('[data-exam-action="introduction"]');
    assert.match(ui.$('#exam-info-title').textContent, /Examen 20250924/);
    assert.match(ui.$('#exam-info-dialog .exam-modal-body').textContent,
      /Algemene uitgangspunten alle opgaven in dit tentamen/);
    assert.match(ui.$('#exam-info-dialog .exam-modal-body').textContent,
      /Indien van toepassing moeten de antwoorden gemotiveerd worden/);
    ui.click('#exam-info-dialog [data-close-info]');

    const answer = ui.$('#exam-app [contenteditable="true"]');
    assert.ok(answer, 'De gekozen vraag moet een antwoordeditor hebben.');
    answer.innerHTML = '<p>Bewaard antwoord uit examen 20250924</p>';
    answer.dispatchEvent(new ui.window.InputEvent('input', { bubbles: true, inputType: 'insertText' }));
    assert.match(ui.attempts()[0].answers[attempt.exam.questions[7].id].html, /Bewaard antwoord/);
    const saved = ui.saved();
    const reopened = environment({ hash: '#tentamen/' + attempt.id, saved });
    try {
      assert.equal(reopened.attempts()[0].currentIndex, 7);
      assert.match(reopened.$('#exam-app [contenteditable="true"]').innerHTML, /Bewaard antwoord/);
      reopened.click('[data-exam-action="overview"]');
      assert.match(reopened.$('#exam-info-dialog .compact-overview-remaining').textContent, /22/);
      assert.equal(reopened.$('#exam-info-dialog [data-exam-index="7"]').classList.contains('is-answered'), true);
      reopened.click('#exam-info-dialog [data-close-info]');
      reopened.click('[data-exam-action="submit"]');
      reopened.click('[data-exam-confirm-submit]');
      assert.equal(reopened.attempts()[0].status, 'completed');
      assert.equal(reopened.document.querySelectorAll('.result-group').length, 3);
      assert.match(reopened.document.querySelectorAll('.result-group')[1].querySelector(':scope > h3').textContent, /20250924/);
      assert.equal(reopened.$('.result-bottom-actions a[href="#welkom/opgaven"]').textContent, 'Opnieuw oefenen');
      reopened.route('#dashboard/voltooid');
      assert.match(reopened.$('.exam-table-completed tbody').textContent, /OPG1/);
      assert.deepEqual(reopened.errors, []);
    } finally {
      reopened.close();
    }
    assert.deepEqual(ui.errors, []);
    console.log('Opgave-DOM geslaagd: dashboard, selectie, start, bronkopjes, sprong, opslag, herladen en inzage.');
  } finally {
    ui.close();
  }
}
