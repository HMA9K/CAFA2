(function () {
  'use strict';
  var api = window.CafaPractice;
  if (!api) return;
  var activeEditor = null;

  function currentQuestion() {
    var match = location.hash.match(/^#(kap|val|nvw|hk)-(\d+)$/);
    return match ? document.getElementById(match[1] + '-' + match[2]) : null;
  }
  function escape(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }
  function syncMark(question) {
    if (!question) return;
    var flag = question.querySelector('.flagbox');
    var button = question.querySelector('[data-practice-mark]');
    if (!flag || !button) return;
    button.classList.toggle('is-marked', flag.checked);
    button.setAttribute('aria-pressed', flag.checked ? 'true' : 'false');
    button.title = flag.checked ? 'Markering verwijderen' : 'Deze vraag markeren';
  }
  function releaseEditor() {
    if (!activeEditor) return;
    activeEditor.editor.destroy();
    activeEditor.host.remove();
    activeEditor.textarea.hidden = false;
    activeEditor.textarea.classList.remove('practice-plain-hidden');
    activeEditor = null;
  }
  function updateCurrent() {
    var question = currentQuestion();
    document.body.classList.toggle('practice-surface', !!question);
    syncMark(question);
    var own = question && question.querySelector('.mode-radio[value="own"]:checked');
    if (!own || !window.CafaAnswerEditor) { releaseEditor(); return; }
    if (activeEditor && activeEditor.id === question.id) return;
    releaseEditor();
    var textarea = question.querySelector('.own-editor');
    if (!textarea) return;
    var code = question.dataset.code, id = Number(question.dataset.q);
    var answer = api.getAnswer(code, id);
    var host = document.createElement('div');
    host.className = 'practice-rich-answer';
    textarea.insertAdjacentElement('afterend', host);
    textarea.hidden = true;
    textarea.classList.add('practice-plain-hidden');
    var editor = window.CafaAnswerEditor.mount(host, {
      label: 'Eigen uitwerking bij vraag ' + id,
      html: answer.html || escape(answer.text).replace(/\r?\n/g, '<br>'),
      onChange: function (html) { api.setRichAnswer(code, id, html); }
    });
    activeEditor = { id: question.id, editor: editor, textarea: textarea, host: host };
  }

  Array.prototype.forEach.call(document.querySelectorAll('.question[data-code][data-q]'), function (question) {
    var code = question.dataset.code, id = Number(question.dataset.q);
    var topic = window.CAFA2_DATA.modules[code];
    question.classList.add('practice-question-page');
    var pageTitle = document.createElement('h1');
    pageTitle.className = 'practice-page-title';
    pageTitle.textContent = 'CAFA2 oefenvragen · ' + topic.title;
    var panel = document.createElement('div');
    panel.className = 'practice-question-frame';
    var header = question.querySelector('.question-header');
    var body = question.querySelector('.qbody');
    question.insertBefore(pageTitle, header);
    question.insertBefore(panel, header);
    panel.appendChild(header);
    panel.appendChild(body);
    var identityLabel = header.querySelector('.qidentity > span:first-child');
    if (identityLabel) identityLabel.textContent = 'VRAAG';
    var count = question.querySelector('.question-count');
    if (count) {
      count.classList.add('practice-question-count');
      count.innerHTML = 'VRAAG <span>' + id + '</span> VAN <span>'+topic.questions.length+'</span>';
      count.setAttribute('aria-label', 'Vraag ' + id + ' van ' + topic.questions.length);
    }
    var footer = question.querySelector('.question-nav');
    var actions = question.querySelector('.nav-right');
    if (!footer || !actions) return;
    footer.classList.add('practice-question-nav');
    actions.classList.add('practice-question-actions');
    var overview = actions.querySelector('[data-overview]');
    if (overview) overview.classList.add('practice-action');
    var intro = document.createElement('a');
    intro.href = '#welkom/practice';
    intro.className = 'practice-action practice-introduction';
    intro.textContent = 'Introductie';
    if (overview) overview.insertAdjacentElement('afterend', intro);
    else actions.appendChild(intro);
    var oldFlag = actions.querySelector('.flag-label');
    var mark = document.createElement('button');
    mark.type = 'button';
    mark.className = 'practice-action practice-mark';
    mark.dataset.practiceMark = '';
    mark.textContent = 'Markeren';
    mark.addEventListener('click', function () { api.toggleMarked(code, id); syncMark(question); });
    if (oldFlag) oldFlag.replaceWith(mark);
    else actions.appendChild(mark);
    var oldFinish = actions.querySelector('.extra-nav');
    var finish = document.createElement('button');
    finish.type = 'button';
    finish.className = 'practice-action practice-finish';
    finish.textContent = 'Toets voltooien';
    finish.addEventListener('click', function () {
      // Reuse the existing finish confirmation and scoring instead of bypassing it.
      var trigger = document.querySelector('#resultaat-' + code + ' [data-finish]');
      if (trigger) trigger.click();
    });
    if (oldFinish) oldFinish.replaceWith(finish);
    else actions.appendChild(finish);
    syncMark(question);
  });

  Array.prototype.forEach.call(document.querySelectorAll('.overview-frame'), function (overview) {
    overview.classList.add('practice-overview-frame');
    var list = overview.querySelector('.overview-list');
    if (!list) return;
    list.classList.add('cafa-overview-list');
    list.setAttribute('aria-label', 'Alle vragen van dit onderwerp');
    Array.prototype.forEach.call(list.querySelectorAll('.ov-item[data-nav]'), function (item) {
      var parts = item.dataset.nav.split('-');
      var topic = window.CAFA2_DATA.modules[parts[0]];
      var data = topic.questions[Number(parts[1]) - 1];
      item.classList.add('cafa-overview-item');
      item.querySelector('.ov-num').classList.add('cafa-overview-number');
      var content = document.createElement('span');
      content.className = 'cafa-overview-content';
      var title = document.createElement('span');
      title.className = 'cafa-overview-title';
      title.textContent = data.title;
      var meta = document.createElement('span');
      meta.className = 'cafa-overview-meta';
      meta.textContent = topic.title + (data.type ? ' · ' + data.type : '');
      content.appendChild(title);
      content.appendChild(meta);
      item.insertBefore(content, item.querySelector('.ov-status'));
      item.querySelector('.ov-status').classList.add('cafa-overview-state');
      var mark = item.querySelector('.ov-mark');
      mark.classList.add('cafa-overview-mark');
      mark.textContent = 'Gemarkeerd';
    });
  });

  document.addEventListener('change', function (event) {
    if (event.target.matches('.mode-radio')) updateCurrent();
  });
  window.addEventListener('hashchange', updateCurrent);
  window.addEventListener('cafa:practice-change', function () { syncMark(currentQuestion()); });
  updateCurrent();
})();
