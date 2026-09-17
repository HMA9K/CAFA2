// Run with installed jsdom, or: JSDOM_PATH=/absolute/path/to/jsdom/lib/api.js node tests/answer-editor.mjs
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

const { JSDOM } = await import(process.env.JSDOM_PATH ? pathToFileURL(process.env.JSDOM_PATH).href : 'jsdom');
const dom = new JSDOM('<div id="root"></div><div id="review"></div>', { runScripts: 'outside-only', url: 'https://example.test' });
const w = dom.window;
w.eval(fs.readFileSync(new URL('../js/answer-editor.js', import.meta.url), 'utf8'));
const api = w.CafaAnswerEditor;
const query = selector => w.document.querySelector(selector);
const click = label => query(`[aria-label="${label}"]`).click();
function select(node) {
  const range = w.document.createRange();
  range.selectNodeContents(node);
  range.collapse(true);
  w.getSelection().removeAllRanges();
  w.getSelection().addRange(range);
  w.document.dispatchEvent(new w.Event('selectionchange'));
}

const dirty = '<p id="bad" onclick="alert(1)" style="color:red;text-align:center;background:url(https://bad)">Hi <b>bold</b><img src="bad" onerror="alert(1)"><script>alert(1)</script><svg onload="alert(1)"><text>bad</text></svg><a href="javascript:alert(1)">link</a></p><iframe src="bad"></iframe><table><tr><td contenteditable="false">42</td></tr></table>';
const safe = api.sanitize(dirty);
assert(!/onclick|onerror|script|svg|iframe|img|javascript|href=|background|contenteditable|id=/.test(safe));
assert(safe.includes('<b>bold</b>'));
assert(safe.includes('text-align: center;'));
assert(safe.includes('<td>42</td>'));
assert.equal(api.sanitize(safe), safe);

const merged = api.sanitize('<table class="imported"><caption onclick="bad()">Balans <b>2025</b></caption><tr><th scope="row" colspan="2" rowspan="20">Activa</th><td colspan="1" rowspan="2">100</td></tr><tr><th scope="col">Totaal</th><td colspan="21" rowspan="0">100</td><td colspan="2x" rowspan="-1">50</td></tr></table>');
const fragment = w.document.createElement('div');
fragment.innerHTML = merged;
assert.equal(fragment.querySelector('caption').textContent, 'Balans 2025');
assert.equal(fragment.querySelector('caption').attributes.length, 0);
assert.equal(fragment.querySelector('table').attributes.length, 0);
assert.equal(fragment.querySelector('th').getAttribute('scope'), 'row');
assert.equal(fragment.querySelector('th').getAttribute('colspan'), '2');
assert.equal(fragment.querySelector('th').getAttribute('rowspan'), '20');
assert.equal(fragment.querySelector('td').getAttribute('rowspan'), '2');
assert.equal(fragment.querySelectorAll('th')[1].getAttribute('scope'), 'col');
assert(!fragment.querySelector('[colspan="21"], [rowspan="0"], [colspan="2x"], [rowspan="-1"]'));
assert.equal(api.sanitize(merged), merged);

const changes = [];
const editor = api.mount(query('#root'), { html: '<p>Start</p>', onChange: value => changes.push(value) });
assert.equal(editor.getHTML(), '<p>Start</p>');
const content = query('#root .cae-content');
content.innerHTML = '<p>Een <strong>antwoord</strong></p>';
content.dispatchEvent(new w.InputEvent('input', { inputType: 'insertText', bubbles: true }));
assert.equal(changes.at(-1), '<p>Een <strong>antwoord</strong></p>');
assert(query('.cae-count').textContent.includes('Woorden: 2'));
click('Ongedaan maken (Ctrl+Z)');
assert.equal(editor.getHTML(), '<p>Start</p>');
click('Opnieuw (Ctrl+Shift+Z)');
assert(editor.getHTML().includes('antwoord'));
const previousChanges = changes.length;
editor.setHTML(dirty);
assert.equal(editor.getHTML(), safe);
assert.equal(changes.length, previousChanges);

api.mount(query('#review'), { html: merged + dirty, readOnly: true });
assert.equal(query('#review [contenteditable]').getAttribute('contenteditable'), 'false');
assert(!query('#review .cae-toolbar'));
assert.equal(query('#review th').getAttribute('rowspan'), '20');
assert(!query('#review script, #review img, #review iframe'));

editor.setHTML('');
editor.focus();
click('Tabel invoegen');
click('Tabel invoegen met gekozen afmetingen');
const table = query('#root table');
assert.equal(table.rows.length, 3);
assert.equal(table.rows[0].cells.length, 3);
select(table.rows[0].cells[0]);
click('Rij toevoegen');
assert.equal(table.rows.length, 4);
click('Kolom toevoegen');
assert.equal(table.rows[0].cells.length, 4);
click('Kolom verwijderen');
assert.equal(table.rows[0].cells.length, 3);
click('Rij verwijderen');
assert.equal(table.rows.length, 3);

editor.setHTML(merged);
select(query('#root th'));
for (const label of ['Rij toevoegen', 'Kolom toevoegen', 'Rij verwijderen', 'Kolom verwijderen']) {
  assert(query(`[aria-label="${label}"]`).disabled, `Merged cells must disable ${label}`);
}
assert(query('#root .cae-status').textContent.includes('samengevoegde cellen'));
assert.equal(editor.getHTML(), merged);

// Rich paste is sanitized before insertion, even without native execCommand.
editor.setHTML('');
editor.focus();
const paste = new w.Event('paste', { bubbles: true, cancelable: true });
Object.defineProperty(paste, 'clipboardData', { value: { getData: type => type === 'text/html' ? dirty : 'plain' } });
content.dispatchEvent(paste);
assert(paste.defaultPrevented);
assert.equal(editor.getHTML(), safe);

click('Antwoordvenster vergroten');
assert.equal(w.document.body.style.overflow, 'hidden');
editor.destroy();
assert.equal(w.document.body.style.overflow, '');
assert.equal(query('#root').children.length, 0);
dom.window.close();
console.log('PASS answer editor: sanitizer, merged table attributes, lifecycle, undo/redo, tables, safe paste and readonly review.');
console.log('Native formatting and selection still require a real-browser check.');
