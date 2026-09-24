/* The supplied Book 2 study copy is available as a general reference during questions. */
(function () {
  'use strict';
  var dialog, search, count, entries, opener, pending = false;

  function laws() { return window.CAFA2_STUDY && window.CAFA2_STUDY.laws || {}; }
  function sortedArticles() {
    return Object.keys(laws()).sort(function (a, b) {
      return Number.parseInt(a, 10) - Number.parseInt(b, 10) || a.localeCompare(b, 'nl');
    });
  }
  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }
  function ensureDialog() {
    if (dialog) return dialog;
    dialog = element('dialog', 'cafa-law-book');
    dialog.id = 'cafa-law-book';
    dialog.setAttribute('aria-labelledby', 'cafa-law-book-title');

    var head = element('header', 'cafa-law-book-head');
    var titleBlock = element('div');
    titleBlock.append(element('p', '', 'Aangeleverde studiekopie · Boek 2 BW · 01-01-2025'));
    var title = element('h2', '', 'Wetboek');
    title.id = 'cafa-law-book-title';
    titleBlock.append(title);
    var close = element('button', '', 'Sluiten ×');
    close.type = 'button';
    close.setAttribute('data-law-book-close', '');
    close.setAttribute('aria-label', 'Wetboek sluiten');
    head.append(titleBlock, close);

    var tools = element('div', 'cafa-law-book-tools');
    var label = element('label', '', 'Zoek artikelnummer of woord');
    label.htmlFor = 'cafa-law-book-search';
    search = element('input');
    search.id = 'cafa-law-book-search';
    search.type = 'search';
    search.autocomplete = 'off';
    search.placeholder = 'Bijvoorbeeld 389 of deelneming';
    count = element('span', 'cafa-law-book-count');
    count.setAttribute('role', 'status');
    tools.append(label, search, count);

    var list = element('div', 'cafa-law-book-list');
    entries = sortedArticles().map(function (article) {
      var law = laws()[article];
      var item = element('details', 'cafa-law-book-entry');
      item.dataset.lawBookEntry = article;
      var summary = element('summary');
      summary.append(element('span', 'cafa-law-book-article', 'Art. 2:' + article + ' BW'), element('span', 'cafa-law-book-topic', law.title));
      var body = element('div', 'cafa-law-book-text');
      body.append(element('p', 'cafa-law-book-source', 'Studiekopie, p. ' + (law.pages || law.page) + '.'));
      law.paragraphs.forEach(function (paragraph) { body.append(element('p', '', paragraph)); });
      item.append(summary, body);
      item.lawBookSearchText = item.textContent.toLocaleLowerCase('nl');
      list.append(item);
      return item;
    });
    var empty = element('p', 'cafa-law-book-empty', 'Geen artikelen gevonden. Probeer een ander artikelnummer of trefwoord.');
    empty.hidden = true;
    list.append(empty);
    var foot = element('footer', '', 'Art. 2:24a t/m 24d en 2:360 t/m 414, inclusief tussenliggende letterartikelen · ' + entries.length + ' artikelen uit de aangeleverde kopie.');
    dialog.append(head, tools, list, foot);
    document.body.append(dialog);
    search.addEventListener('input', filter);
    close.addEventListener('click', closeDialog);
    dialog.addEventListener('click', function (event) { if (event.target === dialog) closeDialog(); });
    dialog.addEventListener('close', function () {
      if (opener && opener.isConnected) opener.focus({preventScroll:true});
      opener = null;
    });
    filter();
    return dialog;
  }
  function filter() {
    if (!search) return;
    var term = search.value.toLocaleLowerCase('nl').trim();
    var number = term.match(/^(?:(?:art\.?|artikel)\s*)?(?:2\s*:\s*)?(\d+[a-z]?)\s*(?:bw)?$/i);
    var exact = number && entries.some(function (item) { return item.dataset.lawBookEntry === number[1]; });
    var visible = 0;
    entries.forEach(function (item) {
      item.hidden = number ? (exact ? item.dataset.lawBookEntry !== number[1] : !item.dataset.lawBookEntry.startsWith(number[1]))
        : !!term && !item.lawBookSearchText.includes(term);
      if (!item.hidden) visible++;
    });
    count.textContent = visible + (visible === 1 ? ' artikel' : ' artikelen') + ' gevonden';
    dialog.querySelector('.cafa-law-book-empty').hidden = visible !== 0;
  }
  function openDialog(from) {
    if (!Object.keys(laws()).length) return;
    ensureDialog();
    if (window.CafaLaw) window.CafaLaw.close(false);
    opener = from || document.activeElement;
    search.value = '';
    entries.forEach(function (item) { item.open = false; });
    filter();
    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
    } else dialog.setAttribute('open', '');
    search.focus({preventScroll:true});
  }
  function closeDialog() {
    if (!dialog || !dialog.open) return;
    if (typeof dialog.close === 'function') dialog.close();
    else {
      dialog.removeAttribute('open');
      if (opener && opener.isConnected) opener.focus({preventScroll:true});
      opener = null;
    }
  }
  function plainText(link) {
    var label = link.cloneNode(true);
    if (label.classList.contains('law-ref')) label.querySelectorAll('span').forEach(function (span) { span.remove(); });
    link.replaceWith(document.createTextNode(label.textContent.trim()));
  }
  function neutralize(root) {
    if (!root || root.nodeType !== 1) return;
    var links = [];
    if (root.matches && root.matches('a[data-law],a[href*="#wet-"]')) links.push(root);
    root.querySelectorAll('a[data-law],a[href*="#wet-"]').forEach(function (link) { links.push(link); });
    links.forEach(function (link) {
      if (link.isConnected && link.closest('.question,#exam-app,#exam-info-dialog')) plainText(link);
    });
  }
  function button() {
    var item = element('button', 'btn law-book-button', 'Wetboek');
    item.type = 'button';
    item.setAttribute('data-law-book-open', '');
    item.setAttribute('aria-haspopup', 'dialog');
    return item;
  }
  function mountButtons() {
    document.querySelectorAll('.question .question-nav .nav-right').forEach(function (nav) {
      if (!nav.querySelector('[data-law-book-open]')) nav.append(button());
    });
    var examActions = document.querySelector('.exam-running #exam-app .exam-cirrus-actions');
    if (examActions && !examActions.querySelector('[data-law-book-open]')) examActions.append(button());
  }
  function refresh() {
    mountButtons();
    neutralize(document.getElementById('app-content') || document.body);
    neutralize(document.getElementById('exam-app'));
  }
  function schedule() {
    if (pending) return;
    pending = true;
    Promise.resolve().then(function () { pending = false; refresh(); });
  }
  function observe(root) {
    if (!root || !window.MutationObserver) return;
    new MutationObserver(function (changes) {
      changes.forEach(function (change) {
        change.addedNodes.forEach(function (node) { neutralize(node); });
      });
    }).observe(root, {childList:true, subtree:true});
  }
  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-law-book-open]');
    if (trigger) { event.preventDefault(); openDialog(trigger); }
  });
  window.addEventListener('cafa:ready', schedule);
  window.addEventListener('cafa:exam-route', schedule);
  window.addEventListener('hashchange', function () { closeDialog(); schedule(); });
  function init() {
    observe(document.getElementById('app-content') || document.body);
    observe(document.getElementById('exam-app'));
    if (window.MutationObserver) new MutationObserver(function (changes) {
      changes.forEach(function (change) {
        change.addedNodes.forEach(function (node) {
          if (node.nodeType === 1 && node.matches('#exam-info-dialog')) neutralize(node);
        });
      });
    }).observe(document.body, {childList:true});
    refresh();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  window.CafaLawBook = {open:openDialog, close:closeDialog, refresh:refresh};
}());
