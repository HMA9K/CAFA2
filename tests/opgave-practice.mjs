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
assert.equal(typeof practice.sourceSectionId, 'function');
assert.equal(exams.length, 11);
const originalData = JSON.stringify(exams);
const topics = ['kapitaalbelangen', 'vreemde valuta', 'consolidatie nettovermogenswaarde', 'consolidatie verkrijgingsprijs'];
const expectedCounts = [85, 63, 78, 56];
const expectedPoints = [330, 220, 330, 220];
const sourceNumbersByExam = {
  'cafa2-20210419': [1, 4, 2, 3],
  'cafa2-20211006': [1, 4, 2, 3],
  'cafa2-20220411': [1, 4, 2, 3],
  'cafa2-20221006': [1, 4, 2, 3],
  'cafa2-20230411': [1, 4, 2, 3],
  'cafa2-20231009': [1, 4, 2, 3],
  'cafa2-20240422': [1, 2, 3, 4],
  'cafa2-20240930': [1, 2, 3, 4],
  'cafa2-20250417': [1, 2, 3, 4],
  'cafa2-20250924': [1, 2, 3, 4],
  'cafa2-20260429': [1, 2, 3, 4]
};
assert.deepEqual(plain(exams.map(exam => exam.id).sort()), Object.keys(sourceNumbersByExam).sort());
for (const exam of exams) {
  sourceNumbersByExam[exam.id].forEach((sourceNumber, topicIndex) => {
    const topic = topicIndex + 1;
    const sourceId = 'opgave-' + sourceNumber;
    assert.equal(practice.sourceSectionId(exam, topic), sourceId,
      `${exam.id}: vast onderwerp ${topic} moet papieren ${sourceId} kiezen.`);
    const section = exam.sections.find(item => item.id === sourceId);
    assert.ok(section, `${exam.id}: papieren ${sourceId} ontbreekt.`);
    assert.match(section.title.toLowerCase(), new RegExp(topics[topicIndex]),
      `${exam.id}: sectietitel past niet bij onderwerp ${topic}.`);
  });
}

function checkComposite(number, chosen) {
  const selected = exams.filter(exam => chosen.includes(exam.id))
    .sort((a, b) => b.date.localeCompare(a.date));
  const actual = practice.build(exams, number, chosen);
  const originals = selected.map(exam => ({
    exam,
    section: exam.sections.find(section => section.id === 'opgave-' + sourceNumbersByExam[exam.id][number - 1]),
    questions: exam.questions.filter(question => question.sectionId === 'opgave-' + sourceNumbersByExam[exam.id][number - 1])
  }));
  assert.equal(actual.practiceKind, 'opgave');
  assert.equal(actual.opgaveNumber, number);
  assert.equal(actual.selectionBasis, 'topic');
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
    assert.ok(section, `${exam.id} mist de opgave over ${topics[number - 1]}.`);
    const code = exam.date.replaceAll('-', '');
    const combinedSection = actual.sections.find(item => item.sourceExamId === exam.id);
    assert.ok(combinedSection, `De casus van ${code} ontbreekt.`);
    assert.equal(combinedSection.id, exam.id + '-' + section.id);
    assert.equal(combinedSection.sourceCode, code);
    assert.equal(combinedSection.sourceSectionId, section.id);
    assert.equal(combinedSection.sourceOpgaveNumber, sourceNumbersByExam[exam.id][number - 1]);
    assert.equal(combinedSection.topicNumber, number);
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
      assert.equal(question.sourceOpgaveNumber, sourceNumbersByExam[exam.id][number - 1]);
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
  assert.equal(combined.questions.length, expectedCounts[number - 1], `Verkeerd aantal vragen voor onderwerp ${number}.`);
  assert.equal(combined.maxScore, expectedPoints[number - 1], `Verkeerd puntentotaal voor onderwerp ${number}.`);
}

const oldValuta = practice.build(exams, 2, ['cafa2-20231009']);
assert.equal(oldValuta.sections[0].sourceSectionId, 'opgave-4',
  'Vreemde valuta uit examen 20231009 staat in de papieren opgave 4.');
assert.equal(oldValuta.questions.length, 4);
assert.equal(oldValuta.maxScore, 20);

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

  function environment({ hash = '#dashboard', saved, snapshots = {}, failWrite } = {}) {
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
    for(const [key,value] of Object.entries(snapshots))window.localStorage.setItem(key,value);
    if (saved) window.localStorage.setItem(storageKey, saved);
    if(failWrite){const write=window.Storage.prototype.setItem;window.Storage.prototype.setItem=function(key,value){if(failWrite(key,value))throw new window.DOMException('Storage full','QuotaExceededError');return write.call(this,key,value);};}
    for (const file of scripts) window.eval(read(file));
    const $ = selector => document.querySelector(selector);
    function route(value) {
      window.history.replaceState(null, '', value);
      window.dispatchEvent(new window.HashChangeEvent('hashchange'));
    }
    function click(selector) {
      const element = $(selector);
      assert.ok(element, `Verwacht element: ${selector}`);
      const previousHash = window.location.hash;
      element.click();
      if (window.location.hash !== previousHash) window.dispatchEvent(new window.HashChangeEvent('hashchange'));
    }
    function change(selector, checked) {
      const element = $(selector);
      assert.ok(element, `Verwacht keuzeveld: ${selector}`);
      element.checked = checked;
      element.dispatchEvent(new window.Event('change', { bubbles: true }));
    }
    return {
      window, document, $, route, click, change, errors,
      attempts: () => plain(window.CafaExams.getAttempts()),
      saved: () => window.localStorage.getItem(storageKey),
      snapshots: () => Object.fromEntries(Object.keys(window.localStorage).filter(key=>key.startsWith(storageKey+':attempt:')).map(key=>[key,window.localStorage.getItem(key)])),
      close: () => window.close()
    };
  }

  const scoped=environment();
  try {
    scoped.route('#welkom/cafa2-20240422');scoped.click('[data-exam-action="start"]');
    const firstId=scoped.attempts()[0].id;
    scoped.route('#welkom/cafa2-20250924');scoped.click('[data-exam-action="start"]');
    const secondId=scoped.attempts()[1].id;
    scoped.route('#tentamen/'+firstId);scoped.click('[data-exam-action="overview"]');
    const staleQuestion=scoped.$('#exam-info-dialog [data-exam-index="2"]');
    scoped.route('#tentamen/'+secondId);
    assert.equal(scoped.$('#exam-info-dialog'),null,'Een overzicht sluit zodra zijn tentamen wordt verlaten.');
    staleQuestion.click();
    assert.equal(scoped.window.CafaExams.getPosition().index,0,'Een oude overzichtsknop mag geen vraag uit een ander tentamen kiezen.');
    assert.equal(scoped.window.CafaExams.restorePosition(firstId,2),false,'Positieherstel blijft binnen de huidige poging.');
    scoped.click('[data-exam-action="submit"]');assert.equal(scoped.$('#exam-submit-dialog').open,true);
    scoped.route('#tentamen/'+firstId);
    assert.equal(scoped.$('#exam-submit-dialog').open,false,'Het inlevervenster sluit bij wisseling van tentamen.');
    scoped.click('[data-exam-confirm-submit]');
    assert.ok(scoped.attempts().every(a=>a.status==='active'),'Een oude bevestiging levert geen andere poging in.');
    // Between the URL change and hashchange, the previous rendered attempt is stale.
    scoped.window.history.replaceState(null,'','#tentamen/'+secondId);
    assert.equal(scoped.window.CafaExams.getPosition(),null);
    scoped.click('[data-exam-action="next"]');
    assert.ok(scoped.attempts().every(a=>a.currentIndex===0));
    assert.deepEqual(scoped.errors,[]);
    console.log('Tentamennavigatie geslaagd: overzicht, oude knoppen, positieherstel en inlevervenster blijven bij hun eigen poging.');
  } finally { scoped.close(); }

  const ui = environment();
  try {
    assert.ok(ui.$('.exam-table-upcoming a[href="#welkom/opgaven"]'),
      'De nieuwe oefenroute moet direct onder de MC-vragen op het dashboard staan.');
    const firstTwo = Array.from(ui.document.querySelectorAll('.exam-table-upcoming tbody tr')).slice(0, 2);
    assert.match(firstTwo[0].textContent, /CAFA2 oefenvragen/);
    assert.match(firstTwo[1].textContent, /Tentamenvragen per onderwerp/);

    ui.route('#welkom/opgaven');
    assert.equal(ui.document.querySelectorAll('[name="opgave-number"]').length, 4);
    assert.equal(ui.document.querySelectorAll('[data-opgave-exam]').length, 11);
    for (let number = 1; number <= 4; number++) {
      const radio = ui.$(`[name="opgave-number"][value="${number}"]`);
      assert.match(radio.closest('label').textContent.toLowerCase(), new RegExp(topics[number - 1]));
      ui.change(`[name="opgave-number"][value="${number}"]`, true);
      assert.match(ui.$('[data-opgave-summary]').textContent,
        new RegExp(`11 tentamens geselecteerd · ${expectedCounts[number - 1]} vragen`));
    }
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
      ['Examen 20260429 · oorspronkelijke opgave 1',
        'Examen 20250924 · oorspronkelijke opgave 1',
        'Examen 20240422 · oorspronkelijke opgave 1']);
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
    const reopened = environment({ hash: '#tentamen/' + attempt.id, saved, snapshots:ui.snapshots() });
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

  const legacyExam = plain(practice.build(exams, 3, ['cafa2-20231009']));
  legacyExam.id = 'opgave-2-20231009';
  legacyExam.title = 'Tentamenvragen per opgave · Opgave 2';
  legacyExam.opgaveNumber = 2;
  delete legacyExam.selectionBasis;
  legacyExam.sections[0].title = 'Opgave 2 · 20231009 · Gluton bv (Consolidatie nettovermogenswaarde)';
  delete legacyExam.sections[0].topicNumber;
  delete legacyExam.sections[0].sourceOpgaveNumber;
  legacyExam.questions.forEach(question => { delete question.sourceOpgaveNumber; });
  const legacyAttempt = plain(engine.createAttempt(legacyExam, { now, untimed: true }));
  const legacyQuestionId = legacyAttempt.exam.questions[0].id;
  legacyAttempt.answers[legacyQuestionId] = { html: '<p>Historisch antwoord uit bronopgave 2</p>' };
  const legacyUi = environment({ saved: JSON.stringify({ version: 1, attempts: [legacyAttempt] }) });
  try {
    legacyUi.window.confirm = () => true;
    const oldRow = legacyUi.$(`.exam-table-upcoming [data-restart-attempt="${legacyAttempt.id}"]`)
      ?.closest('tr');
    assert.ok(oldRow, 'De oude lopende poging moet op het dashboard staan.');
    assert.match(oldRow.textContent, /Oude indeling/);
    assert.match(oldRow.textContent, /OPG2-OUD/);
    legacyUi.click(`.exam-table-upcoming [data-restart-attempt="${legacyAttempt.id}"]`);
    assert.equal(legacyUi.attempts().length, 1, 'Herstart opent eerst de selectie zonder nieuwe poging.');
    assert.equal(legacyUi.attempts()[0].status, 'active');
    assert.equal(legacyUi.$('[name="opgave-number"]:checked').value, '2');
    assert.deepEqual(Array.from(legacyUi.document.querySelectorAll('[data-opgave-exam]:checked'), input => input.value), ['cafa2-20231009']);
    legacyUi.click('[data-exam-action="start-opgave"]');
    const [oldSaved, newAttempt] = legacyUi.attempts();
    assert.equal(oldSaved.exam.selectionBasis, undefined);
    assert.equal(oldSaved.exam.sections[0].sourceSectionId, 'opgave-2');
    assert.match(oldSaved.answers[legacyQuestionId].html, /Historisch antwoord/);
    assert.equal(oldSaved.status, 'completed');
    assert.equal(newAttempt.exam.selectionBasis, 'topic');
    assert.equal(newAttempt.exam.opgaveNumber, 2);
    assert.deepEqual(plain(newAttempt.exam.sourceExamIds), ['cafa2-20231009']);
    assert.equal(newAttempt.exam.sections[0].sourceSectionId, 'opgave-4');
    assert.equal(newAttempt.exam.questions.length, 4);
    assert.equal(Object.keys(newAttempt.answers).length, 0);
    assert.deepEqual(legacyUi.errors, []);
  } finally {
    legacyUi.close();
  }
  console.log('Oude opgavepoging geslaagd: zichtbaar onderscheid, historische antwoorden bewaard en herstart op onderwerp.');

  const firstExam = exams.find(e => e.id === 'cafa2-20250924');
  const old = plain(engine.createAttempt(firstExam, { now, id: 'restart-original' }));
  const oldQuestion = firstExam.questions[0].id;
  old.answers[oldQuestion] = { html: '<p>Bewaard tentamenantwoord</p>' };
  old.scores = { [oldQuestion]: 1 }; old.marked = { [oldQuestion]: true }; old.currentIndex = 2;
  const other = plain(engine.createAttempt(exams.find(e => e.id === 'cafa2-20240930'), { now, id: 'other-attempt', untimed: true }));
  const done = plain(engine.finishAttempt(engine.createAttempt(firstExam, { now, id: 'completed-attempt' }), { now: now + 1000 }));
  const examSaved = JSON.stringify({ version: 1, attempts: [old, other, done] });
  const storageUi=environment({saved:examSaved,hash:'#tentamen/restart-original'});
  try{
    assert.equal(JSON.parse(storageUi.saved()).version,2);
    assert.deepEqual(storageUi.attempts(),[old,other,done],'Migratie behoudt volledige historische inhoud en antwoorden.');
    const context=storageUi.window.CafaExams.getQuestionContext(old.id);
    context.question.prompt='Gewijzigde testkopie';context.exam.title='Gewijzigde titel';
    const single=storageUi.window.CafaExams.getAttempt(old.id);single.answers[oldQuestion].html='Gewijzigde kopie';
    assert.deepEqual(storageUi.attempts(),[old,other,done],'Gerichte leesfuncties geven zelfstandige kopieën.');
    const panel=storageUi.$('#exam-case-panel'),before=JSON.parse(storageUi.saved()),snapshots=storageUi.snapshots();
    storageUi.click('[data-exam-action="next"]');
    assert.equal(storageUi.$('#exam-case-panel'),panel,'Vraagwisseling binnen dezelfde casus behoudt het bestaande paneel.');
    const after=JSON.parse(storageUi.saved());
    assert.notEqual(after.attempts[0].key,before.attempts[0].key);
    assert.deepEqual(after.attempts.slice(1),before.attempts.slice(1),'Alleen de gewijzigde poging krijgt een nieuw opslagrecord.');
    for(const ref of after.attempts.slice(1))assert.equal(storageUi.snapshots()[ref.key],snapshots[ref.key]);
    assert.equal(Object.keys(storageUi.snapshots()).length,3,'Verouderde opslagrecords worden verwijderd.');
    const durable=storageUi.saved(),durableSnapshots=storageUi.snapshots(),write=storageUi.window.Storage.prototype.setItem;
    storageUi.window.Storage.prototype.setItem=function(key,value){if(key===storageKey)throw new Error('Manifest unavailable');return write.call(this,key,value);};
    storageUi.click('[data-exam-action="mark"]');
    assert.equal(storageUi.saved(),durable);assert.deepEqual(storageUi.snapshots(),durableSnapshots,'Mislukte publicatie van verwijzingen laat de vorige records intact.');
    storageUi.window.Storage.prototype.setItem=write;
    const reload=environment({saved:durable,snapshots:durableSnapshots,hash:'#tentamen/restart-original'});
    try{assert.equal(reload.attempts()[0].currentIndex,old.currentIndex+1);assert.deepEqual(reload.attempts()[0].answers,old.answers);}finally{reload.close();}
    const missing={...durableSnapshots};delete missing[JSON.parse(durable).attempts[0].key];
    const broken=environment({saved:durable,snapshots:missing});
    try{assert.equal(broken.saved(),durable,'Ontbrekend record overschrijft de opgeslagen manifest niet.');assert.deepEqual(broken.attempts(),[]);}finally{broken.close();}
  }finally{storageUi.close();}
  const fallback=environment({saved:examSaved,hash:'#tentamen/restart-original',failWrite:key=>key.startsWith(storageKey+':attempt:')});
  try{
    assert.equal(JSON.parse(fallback.saved()).version,1,'Bij onvoldoende migratieruimte blijft de oude opslag bruikbaar.');
    assert.deepEqual(fallback.attempts(),[old,other,done]);fallback.click('[data-exam-action="next"]');
    const reopened=environment({saved:fallback.saved(),hash:'#tentamen/restart-original'});
    try{assert.equal(reopened.attempts()[0].currentIndex,old.currentIndex+1);assert.deepEqual(reopened.attempts()[0].answers,old.answers);}finally{reopened.close();}
  }finally{fallback.close();}
  console.log('Opslag/context geslaagd: migratie, gerichte kopieën, casusbehoud, afzonderlijke writes, herladen, rollback, ontbrekend record en volle opslag.');
  const restartUi = environment({ saved: examSaved });
  try {
    const before = JSON.stringify(restartUi.attempts());
    restartUi.click('[data-restart-attempt="restart-original"]');
    assert.match(restartUi.window.location.hash, /^#welkom\/cafa2-20250924\/opnieuw\/restart-original$/);
    assert.equal(JSON.stringify(restartUi.attempts()), before, 'Introductie verandert geen antwoorden, status, positie of klok.');
    assert.ok(restartUi.$('[data-exam-extra]')); assert.ok(restartUi.$('[data-exam-untimed]'));
    assert.equal(restartUi.window.CafaExams.getPosition(), null);
    const introReload = environment({ saved: restartUi.saved(), snapshots:restartUi.snapshots(), hash: restartUi.window.location.hash });
    try {
      assert.equal(introReload.attempts().length, 3);assert.ok(introReload.$('[data-exam-extra]'));
      introReload.change('[data-exam-extra]', true);
      assert.equal(introReload.$('[data-exam-detail-duration]').textContent, '210 minuten');
      const originalSet = introReload.window.Storage.prototype.setItem;
      introReload.window.Storage.prototype.setItem = function(key, value) { if (key === storageKey) throw new Error('Storage unavailable'); return originalSet.call(this, key, value); };
      introReload.click('[data-exam-action="start"]');assert.equal(JSON.stringify(introReload.attempts()), before, 'Opslagfout bij starten archiveert of vervangt de vorige poging niet.');
      introReload.window.Storage.prototype.setItem = originalSet;introReload.$('#exam-info-dialog').close();
      introReload.click('[data-exam-action="start"]');
      const next = introReload.attempts().at(-1), archived = introReload.attempts()[0];
      assert.equal(next.extraMinutes, 30);assert.equal(next.untimed, false);assert.equal(next.currentIndex, 0);
      assert.equal(next.deadlineAt - next.startedAt, 210 * 60000);assert.deepEqual(next.answers, {});
      assert.equal(archived.status, 'completed');assert.equal(archived.finishReason, 'restarted');
      assert.deepEqual(archived.answers, old.answers);assert.deepEqual(archived.scores, old.scores);assert.deepEqual(archived.marked, old.marked);
      assert.deepEqual(introReload.attempts()[1], other);assert.deepEqual(introReload.attempts()[2], done);
      introReload.route('#dashboard');introReload.click('[data-restart-attempt="other-attempt"]');
      assert.equal(introReload.$('[data-exam-untimed]').checked, false, 'De instellingen kunnen opnieuw worden gekozen.');
      introReload.click('[data-exam-action="start"]');assert.equal(introReload.attempts().at(-1).untimed, false);
      introReload.route('#dashboard/voltooid');introReload.click('[data-restart-attempt="completed-attempt"]');
      introReload.change('[data-exam-untimed]', true);assert.equal(introReload.$('[data-exam-detail-duration]').textContent, 'Zonder tijdslimiet');
      introReload.click('[data-exam-action="start"]');assert.equal(introReload.attempts().at(-1).untimed, true);
      assert.deepEqual(introReload.attempts()[2], done, 'Een voltooid origineel blijft ongewijzigd.');assert.deepEqual(introReload.errors, []);
    } finally { introReload.close(); }
    restartUi.route('#dashboard');assert.equal(JSON.stringify(restartUi.attempts()), before, 'Teruggaan zonder starten behoudt de eerdere poging.');
    assert.deepEqual(restartUi.errors, []);
  } finally { restartUi.close(); }

  const resetUi = environment({ saved: examSaved, hash: '#dashboard/voltooid' });
  try {
    resetUi.window.localStorage.setItem('mc-preserved', 'Bewaarde MC-voortgang');
    const before = resetUi.saved(),beforeSnapshots=resetUi.snapshots(); resetUi.window.confirm = () => false;
    resetUi.click('[data-exam-action="reset-exams"]');assert.equal(resetUi.saved(), before);assert.equal(resetUi.attempts().length, 3);
    resetUi.window.confirm = () => true;
    const nativeSet = resetUi.window.Storage.prototype.setItem;
    resetUi.window.Storage.prototype.setItem = function(key, value) { if (key === storageKey) throw new Error('Storage unavailable'); return nativeSet.call(this, key, value); };
    resetUi.click('[data-exam-action="reset-exams"]');assert.equal(resetUi.saved(), before);assert.equal(resetUi.attempts().length, 3);
    resetUi.window.Storage.prototype.setItem = nativeSet;resetUi.$('#exam-info-dialog').close();
    resetUi.click('[data-exam-action="reset-exams"]');assert.deepEqual(resetUi.attempts(), []);
    assert.equal(resetUi.window.localStorage.getItem('mc-preserved'), 'Bewaarde MC-voortgang');
    assert.equal(resetUi.window.location.hash, '#dashboard');assert.equal(resetUi.$('[data-exam-action="reset-exams"]').disabled, true);
    const resetReload = environment({ saved: resetUi.saved(), snapshots:resetUi.snapshots() });try { assert.deepEqual(resetReload.attempts(), []); } finally { resetReload.close(); }
    const otherTab = environment({ saved: before, snapshots:beforeSnapshots, hash: '#tentamen/restart-original' });
    try { otherTab.window.localStorage.setItem(storageKey,resetUi.saved());otherTab.window.dispatchEvent(new otherTab.window.StorageEvent('storage', { key: storageKey, newValue: resetUi.saved() }));assert.deepEqual(otherTab.attempts(), []);assert.equal(otherTab.window.CafaExams.getPosition(), null); } finally { otherTab.close(); }
    assert.deepEqual(resetUi.errors, []);
  } finally { resetUi.close(); }
  const corruptUi = environment({ saved: '{invalid' });
  try { corruptUi.window.confirm = () => true;assert.equal(corruptUi.$('[data-exam-action="reset-exams"]').disabled, false);corruptUi.click('[data-exam-action="reset-exams"]');corruptUi.route('#welkom/cafa2-20250924');assert.equal(corruptUi.$('[data-exam-action="start"]').disabled, false);assert.deepEqual(corruptUi.errors, []); } finally { corruptUi.close(); }
  console.log('Herstart/reset geslaagd: eerst intro, herladen en annuleren zonder mutatie, opnieuw tijd kiezen, bewaren bij expliciete start, globale tentamenreset, annulering, opslagfout, herladen en ander tabblad; MC behouden.');
}
