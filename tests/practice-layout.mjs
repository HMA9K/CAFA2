// Optional DOM regression: JSDOM_PATH=/absolute/path/to/jsdom/lib/api.js node tests/practice-layout.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';

const {JSDOM} = await import(process.env.JSDOM_PATH ? pathToFileURL(process.env.JSDOM_PATH).href : 'jsdom');
const read = file => fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const dom = new JSDOM(read('index.html'), {url:'https://cafa2.example/#kap-2', runScripts:'outside-only', pretendToBeVisual:true});
const w = dom.window;
const query = selector => w.document.querySelector(selector);
const all = selector => Array.from(w.document.querySelectorAll(selector));
w.matchMedia = () => ({matches:false});
w.scrollTo = () => {};
w.alert = () => {};
w.confirm = () => true;
w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
w.HTMLDialogElement.prototype.close = function () { this.open = false; };

try {
  query('#app-content').innerHTML = ['home', 'kapitaalbelangen', 'vreemde-valuta', 'consolidatie-nvw', 'consolidatie-hk', 'shared'].map(name => read('fragments/' + name + '.html')).join('');
  query('#dialog-content').innerHTML = read('fragments/dialogs.html');
  for (const file of ['data/config.js', 'data/kapitaalbelangen.js', 'data/vreemde-valuta.js', 'data/consolidatie-nvw.js', 'data/consolidatie-hk.js', 'js/answer-editor.js']) w.eval(read(file));
  const key = w.CAFA2_DATA.id;
  w.localStorage.setItem(key, JSON.stringify({id:key, modules:{kap:{current:2, answers:{2:{choice:1, mode:'own', marked:true, text:'Mijn bewaarde antwoord', rows:[['Deelneming', '100', '']]}}}}}));
  for (const file of ['js/app.js', 'js/practice-upgrades.js']) w.eval(read(file));

  assert.equal(all('.practice-page-title').length, 120);
  assert.equal(all('.practice-question-frame').length, 120);
  assert.equal(all('.question[data-code][data-q]').length, 120);
  assert(w.document.body.classList.contains('practice-surface'));
  assert.equal(query('#kap-2 > .practice-page-title').textContent, 'CAFA2 oefenvragen · Kapitaalbelangen');
  assert.equal(query('#kap-2 > .practice-question-frame > .question-header .qidentity > span').textContent, 'VRAAG');
  assert.equal(query('#kap-2 .qnum').textContent, '2');
  assert.equal(query('#kap-2 .practice-question-count').textContent, 'VRAAG 2 VAN 30');
  assert(query('#kap-2 > .practice-question-frame > .qbody'));
  assert.deepEqual(all('#kap-2 .practice-action').map(element => element.textContent), ['Overzicht', 'Introductie', 'Markeren', 'Toets voltooien']);

  assert.equal(all('.practice-overview-frame .cafa-overview-item').length, 120);
  for (const [code, topic] of Object.entries(w.CAFA2_DATA.modules)) {
    topic.questions.forEach((question, index) => {
      const row = query('#overzicht-' + code + ' [data-nav="' + code + '-' + (index + 1) + '"]');
      assert.equal(row.querySelector('.cafa-overview-number').textContent, String(index + 1));
      assert.equal(row.querySelector('.cafa-overview-title').textContent, question.title);
      assert(row.querySelector('.cafa-overview-meta').textContent.includes(topic.title));
      assert.equal(row.getAttribute('href'), '#' + code + '-' + (index + 1));
    });
  }
  const answered = query('#overzicht-kap [data-nav="kap-2"]');
  assert(answered.classList.contains('answered'));
  assert(answered.classList.contains('marked'));
  assert.equal(answered.getAttribute('aria-current'), 'step');
  assert.equal(answered.querySelector('.cafa-overview-state').textContent, 'Beantwoord');
  assert.equal(answered.querySelector('.cafa-overview-mark').textContent, 'Gemarkeerd');
  assert(answered.getAttribute('aria-label').includes(w.CAFA2_DATA.modules.kap.questions[1].title));

  const before = JSON.stringify(w.CafaPractice.getAnswer('kap', 2));
  query('#kap-2 [data-overview]').click();
  assert.equal(query('#overview-dialog').open, true);
  assert.equal(all('#overview-dialog .compact-overview-item').length, 30);
  assert(query('#overview-dialog [data-nav="kap-2"]').getAttribute('aria-label').includes(w.CAFA2_DATA.modules.kap.questions[1].title));
  assert.equal(query('#overview-dialog .compact-overview-range').textContent,'1-30');
  assert.equal(all('#overview-dialog .compact-overview-divider').length,0);
  assert.equal(query('#overview-dialog [data-nav="kap-2"] .compact-overview-state').textContent,'Beantwoord');
  query('#overview-dialog [data-nav="kap-13"]').click();
  await new Promise(resolve => setTimeout(resolve, 30));
  assert.equal(query('#overview-dialog').open, false);
  assert.equal(w.location.hash, '#kap-13');
  assert.equal(w.cafaAppTest.getState().modules.kap.current, 13);
  assert.equal(query('#overzicht-kap [data-nav="kap-13"]').getAttribute('aria-current'), 'step');
  assert.equal(answered.hasAttribute('aria-current'), false);
  assert.equal(JSON.stringify(w.CafaPractice.getAnswer('kap', 2)), before, 'Overview navigation preserves answer, formatting, rows and mark');

  w.location.hash = '#overzicht-kap';
  await new Promise(resolve => setTimeout(resolve, 30));
  assert.equal(w.document.body.classList.contains('practice-surface'), false);
  w.location.hash = '#kap-2';
  await new Promise(resolve => setTimeout(resolve, 30));
  assert.equal(all('.cafa-answer-editor').length, 1);
  assert.equal(query('#kap-2 .cae-content').textContent, 'Mijn bewaarde antwoord');
  assert.equal(JSON.parse(w.localStorage.getItem(key)).modules.kap.answers[2].rows[0][0], 'Deelneming');
  console.log('MC layout passed: 120 page frames, numbered topic overviews, answered/marked/current status, modal navigation and preserved progress.');
} finally {
  w.close();
}
