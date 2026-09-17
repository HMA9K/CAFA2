import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const dataScripts = [
  'data/config.js',
  'data/kapitaalbelangen.js',
  'data/vreemde-valuta.js',
  'data/consolidatie-nvw.js',
  'data/consolidatie-hk.js',
];

const indexScripts = [...dataScripts, 'js/bootstrap.js'];
const topicFragments = [
  'fragments/kapitaalbelangen.html',
  'fragments/vreemde-valuta.html',
  'fragments/consolidatie-nvw.html',
  'fragments/consolidatie-hk.html',
];
const fallbackPages = [
  'fallback/kapitaalbelangen.html',
  'fallback/vreemde-valuta.html',
  'fallback/consolidatie-nvw.html',
  'fallback/consolidatie-hk.html',
];

const html = read('index.html');
assert.match(html, /<link rel="stylesheet" href="css\/app\.css">/);
assert.doesNotMatch(html, /<style>/);
assert.doesNotMatch(html, /id="bank"/);
for (const script of indexScripts) {
  assert.match(html, new RegExp(`<script src="${script.replaceAll('.', '\\.')}"`));
}
for (const fallbackPage of fallbackPages) {
  assert.match(html, new RegExp(`href="${fallbackPage.replaceAll('.', '\\.')}"`));
}

const staticQuestionHtml = topicFragments.map(read).join('');
assert.doesNotMatch(staticQuestionHtml, /\{[a-z]+\}/i, 'De vraagfragmenten bevatten een onvervangen placeholder.');
const staticQuestionIds = [...staticQuestionHtml.matchAll(/<section class="screen question frame" id="([a-z]+)-(\d+)"/g)]
  .map((match) => `${match[1]}-${match[2]}`);
assert.equal(staticQuestionIds.length, 120, 'De vier vraagfragmenten moeten samen 120 vragen bevatten.');
assert.equal(new Set(staticQuestionIds).size, 120, 'Iedere statische vraag-ID moet uniek zijn.');

fallbackPages.forEach((fallbackPage) => {
  const fallbackHtml = read(fallbackPage);
  assert.equal([...fallbackHtml.matchAll(/<section class="screen question frame"/g)].length, 30, `${fallbackPage} moet 30 statische vragen bevatten.`);
});

function listFiles(directory, prefix = '') {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.join(prefix, entry.name);
    const absolutePath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(absolutePath, relativePath) : [relativePath];
  });
}

for (const relativePath of listFiles(root)) {
  const size = fs.statSync(path.join(root, relativePath)).size;
  assert.ok(size < 900_000, `${relativePath} is te groot voor betrouwbare publicatie (${size} bytes).`);
}

const sandbox = { window: {} };
vm.createContext(sandbox);
for (const script of dataScripts) {
  new vm.Script(read(script), { filename: script }).runInContext(sandbox);
}

const bank = sandbox.window.CAFA2_DATA;
assert.ok(bank?.id, 'De toets-ID ontbreekt.');
assert.deepEqual(Object.keys(bank.modules), ['kap', 'val', 'nvw', 'hk']);

let questionCount = 0;
let auditedCalculations = 0;
const expectedTopicNames = {
  kap: 'Kapitaalbelangen',
  val: 'Vreemde valuta',
  nvw: 'Consolidatie nettovermogenswaarde',
  hk: 'Consolidatie verkrijgingsprijs',
};

function visit(value, callback) {
  if (Array.isArray(value)) {
    value.forEach((item) => visit(item, callback));
  } else if (value && typeof value === 'object') {
    callback(value);
    Object.values(value).forEach((item) => visit(item, callback));
  }
}

for (const [code, expectedName] of Object.entries(expectedTopicNames)) {
  const module = bank.modules[code];
  assert.equal(module.title, expectedName);
  assert.equal(module.questions.length, 30, `${expectedName} moet 30 vragen bevatten.`);

  module.questions.forEach((question, index) => {
    questionCount += 1;
    assert.equal(question.id, index + 1, `${code}: vraag-ID staat niet op volgorde.`);
    assert.equal(question.options.length, 4, `${code}-${question.id}: verwacht vier antwoordopties.`);
    assert.ok(Number.isInteger(question.correct) && question.correct >= 0 && question.correct <= 3);
    assert.ok(question.title && question.task && question.explanation?.length);
    assert.ok(staticQuestionIds.includes(`${code}-${question.id}`), `${code}-${question.id} ontbreekt in de vraagfragmenten.`);

    visit(question, (object) => {
      if (!Array.isArray(object.auditExpressions)) return;
      for (const [expression, expected] of object.auditExpressions) {
        assert.match(expression, /^[\d\s()+\-*/.]+$/, `Onverwachte tekens in controleberekening: ${expression}`);
        const actual = new vm.Script(expression).runInNewContext(Object.create(null), { timeout: 50 });
        const tolerance = Math.max(1e-8, Math.abs(Number(expected)) * 1e-10);
        assert.ok(Math.abs(actual - Number(expected)) <= tolerance, `${code}-${question.id}: ${expression} geeft ${actual}, verwacht ${expected}.`);
        auditedCalculations += 1;
      }
    });

    for (const related of question.related || []) {
      assert.ok(Number.isInteger(related) && related >= 1 && related <= 30, `${code}-${question.id}: ongeldige gerelateerde vraag ${related}.`);
    }
  });
}

assert.equal(questionCount, 120);
assert.ok(auditedCalculations > 0, 'Er zijn geen controleberekeningen gevonden.');

new vm.Script(read('js/app.js'), { filename: 'js/app.js' });
new vm.Script(read('js/calculator.js'), { filename: 'js/calculator.js' });
new vm.Script(read('js/bootstrap.js'), { filename: 'js/bootstrap.js' });

console.log(`CAFA2-validatie geslaagd: ${questionCount} vragen en ${auditedCalculations} controleberekeningen.`);
