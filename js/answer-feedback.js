(function () {
  'use strict';
  if (window.CafaFeedback) return;
  var KEY = 'cafa2-direct-check-v1', direct = false;
  var practice = [], examHost = document.getElementById('exam-app'), examUI = null;
  try { direct = localStorage.getItem(KEY) === 'true'; } catch (error) { /* Session-only preference. */ }

  function each(selector, root, fn) {
    Array.prototype.forEach.call((root || document).querySelectorAll(selector), fn);
  }
  function syncCheckboxes() {
    each('[data-direct-check]', document, function (input) { input.defaultChecked = direct; input.checked = direct; });
  }
  function checkbox() {
    var label = document.createElement('label');
    label.className = 'cafa-direct-check';
    var input = document.createElement('input');
    input.type = 'checkbox'; input.defaultChecked = direct; input.checked = direct; input.dataset.directCheck = '';
    label.appendChild(input);
    label.appendChild(document.createTextNode('Direct nakijken'));
    return label;
  }
  function region(id) {
    var box = document.createElement('div');
    box.id = id; box.className = 'review-content cafa-inline-feedback'; box.hidden = true;
    box.setAttribute('role', 'region'); box.setAttribute('aria-label', 'Feedback op je antwoord');
    box.setAttribute('aria-live', 'polite');
    return box;
  }
  function allowed(question) {
    // Keep the existing no-feedback-until-submission practice exam mode intact.
    return !question.classList.contains('is-exam') || question.classList.contains('is-finished');
  }
  function hide(record) {
    record.feedback.hidden = true;
    record.button.setAttribute('aria-expanded', 'false');
  }
  function showPractice(record) {
    var question = record.question, feedback = record.feedback;
    if (!record.source.open || !allowed(question)) { hide(record); return; }
    if (record.mc) {
      var selected = question.querySelector('.answer-radio:checked');
      each('.feedback-part', feedback, function (part) {
        part.hidden = !selected || !part.classList.contains('for-' + selected.value);
      });
      each('.correct-model', feedback, function (model) { model.hidden = !selected; });
      each('.no-choice', feedback, function (notice) { notice.hidden = !!selected; });
      var option = selected && question.querySelector('.option[data-option="' + selected.value + '"]');
      if (option) option.insertAdjacentElement('afterend', feedback);
      else record.controls.insertAdjacentElement('beforebegin', feedback);
    }
    feedback.hidden = false;
    record.button.setAttribute('aria-expanded', 'true');
  }
  function checkPractice(record) {
    if (!allowed(record.question)) return;
    // The original details toggle handler owns scoring and preserves the first attempt.
    record.source.open = true;
    showPractice(record);
  }
  function preparePractice(question) {
    each('details', question, function(d, index) { if (!d.id) d.id = 'cafa-detail-' + question.id + '-' + index; });
    var mcRecord = null;
    each('.review', question, function (source, index) {
      var feedback = source.querySelector('.review-content'), summary = source.querySelector('summary');
      if (!feedback || !summary) return;
      var mc = source.classList.contains('mc-review');
      var controls = document.createElement('div'); controls.className = 'cafa-check-controls';
      var button = document.createElement('button'); button.type = 'button'; button.className = 'btn primary';
      button.textContent = summary.textContent.trim(); button.setAttribute('aria-expanded', 'false');
      feedback.id = 'cafa-feedback-' + question.id + (mc ? '-mc' : '-own-' + index);
      feedback.classList.add('cafa-inline-feedback'); feedback.hidden = true;
      feedback.setAttribute('role', 'region'); feedback.setAttribute('aria-label', 'Feedback op je antwoord');
      feedback.setAttribute('aria-live', 'polite'); button.setAttribute('aria-controls', feedback.id);
      controls.appendChild(button); if (mc) controls.appendChild(checkbox());
      // Move, rather than clone, so the bound self-assessment controls keep working.
      source.insertAdjacentElement('afterend', controls);
      controls.insertAdjacentElement('beforebegin', feedback);
      source.hidden = true;
      var record = {question:question, source:source, feedback:feedback, controls:controls, button:button, mc:mc};
      practice.push(record); if (mc) mcRecord = record;
      button.addEventListener('click', function () { checkPractice(record); });
      source.addEventListener('toggle', function () { showPractice(record); });
      controls.hidden = !allowed(question);
    });
    if (!mcRecord) return;
    // Feedback is a sibling of the selected label, never an interactive child of it.
    each('.options > .option', question, function (option) {
      var slot = document.createElement('div'); slot.className = 'cafa-answer-slot';
      option.parentNode.insertBefore(slot, option); slot.appendChild(option);
    });
    var form = question.querySelector('.mc-area');
    question.addEventListener('change', function (event) {
      if (!event.target.matches('.answer-radio')) return;
      hide(mcRecord);
      if (direct) checkPractice(mcRecord);
    });
    question.addEventListener('click', function (event) {
      if (!direct || !event.target.matches('.answer-radio')) return;
      var input = event.target;
      // Selecting the already selected answer does not fire change (for example after reopening).
      setTimeout(function () {
        if (direct && input.isConnected && input.checked && mcRecord.feedback.hidden) checkPractice(mcRecord);
      }, 0);
    });
    if (form) form.addEventListener('reset', function () { mcRecord.source.open = false; hide(mcRecord); });
  }
  function syncPractice() {
    practice.forEach(function (record) {
      record.controls.hidden = !allowed(record.question);
      if (!allowed(record.question)) hide(record);
    });
  }

  function examContext() {
    var match = location.hash.match(/^#tentamen\/([^/]+)$/);
    if (!match || !window.CafaExams || !window.CafaExamEngine) return null;
    var id;
    try { id = decodeURIComponent(match[1]); } catch (error) { return null; }
    var attempt = window.CafaExams.getAttempts().find(function (item) { return item.id === id; });
    if (!attempt || attempt.status !== 'active' || attempt.pausedAt != null ||
        window.CafaExamEngine.remainingSeconds(attempt) === 0) return null;
    var question = attempt.exam.questions[attempt.currentIndex];
    return question ? {attempt:attempt, question:question, answer:attempt.answers[question.id] || {}} : null;
  }
  function prepareExam() {
    if (!examHost) return;
    var actions = examHost.querySelector('.exam-answer-actions');
    if (!actions || actions.dataset.inlineFeedbackReady) return;
    var answer = examHost.querySelector('[data-exam-answer]'), button = actions.querySelector('[data-exam-action="check"]');
    if (!answer || !button) return;
    actions.dataset.inlineFeedbackReady = 'true';
    var controls = document.createElement('div'); controls.className = 'cafa-check-controls';
    button.parentNode.insertBefore(controls, button); controls.appendChild(button);
    button.textContent = 'Nakijken'; button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', 'cafa-exam-feedback');
    if (answer.querySelector('input[name="exam-answer"]')) controls.appendChild(checkbox());
    var feedback = region('cafa-exam-feedback'); answer.insertAdjacentElement('afterend', feedback);
    examUI = {answer:answer, feedback:feedback, button:button, controls:controls};
  }
  function textLine(box, text, className) {
    var p = document.createElement('p'); p.textContent = text;
    if (className) p.className = className;
    box.appendChild(p); return p;
  }
  function examModel(context, box) {
    var q = context.question, a = context.attempt;
    textLine(box, 'ANTWOORDMODEL', 'model-caption');
    var model = document.createElement('div');
    if (window.CafaExamDocument) {
      model.innerHTML = window.CafaExamDocument.render(a.exam, 'solution', q.solutionHtml,
        q.solution || 'Er is nog geen antwoordmodel toegevoegd.');
    } else if (q.solutionHtml && window.CafaAnswerEditor) {
      model.innerHTML = window.CafaAnswerEditor.sanitize(q.solutionHtml);
    } else { model.textContent = q.solution || 'Er is nog geen antwoordmodel toegevoegd.'; }
    box.appendChild(model);
    if(window.CafaStudy)box.insertAdjacentHTML('beforeend',window.CafaStudy.examNote(a.exam.id,q.id));
    if (window.CafaStockTable) window.CafaStockTable.enhance(model);
  }
  function selfScore(context, box) {
    var a = context.attempt, q = context.question, max = q.points || 0;
    textLine(box, 'Vergelijk je eigen uitwerking met het antwoordmodel en ken zelf punten toe.');
    var label = document.createElement('label'); label.className = 'self-score';
    label.appendChild(document.createTextNode('Zelfbeoordeling: punten (0–' + max + ') '));
    var input = document.createElement('input');
    input.type = 'number'; input.min = '0'; input.max = String(max); input.step = 'any';
    input.dataset.selfScore = ''; input.dataset.attempt = a.id; input.dataset.question = q.id;
    var score = a.scores && a.scores[q.id];
    input.value = typeof score === 'number' && Number.isFinite(score) && score >= 0 && score <= max ? score : '';
    label.appendChild(input);
    var status = document.createElement('span'); status.dataset.scoreSaved = ''; status.setAttribute('role', 'status');
    label.appendChild(status); box.appendChild(label);
    // exams.js handles validation and persistence of this existing data-self-score contract.
  }
  function checkExam() {
    prepareExam();
    var context = examContext();
    if (!context || !examUI || !examUI.answer.isConnected) return;
    var q = context.question, answer = context.answer, box = examUI.feedback;
    box.replaceChildren();
    examUI.answer.insertAdjacentElement('afterend', box);
    if (q.type === 'mc') {
      var selected = examUI.answer.querySelector('input[name="exam-answer"]:checked');
      if (!selected || !answer.optionId) {
        textLine(box, 'Kies eerst een antwoord. De uitwerking verschijnt daarna.', 'no-choice');
      } else {
        var label = selected.closest('label'); if (label) label.insertAdjacentElement('afterend', box);
        var correct = (q.options || []).find(function (option) { return option.id === q.correctOptionId; });
        if (correct) {
          var good = answer.optionId === q.correctOptionId;
          textLine(box, good ? 'Goed' : 'Niet goed', 'cafa-feedback-verdict ' + (good ? 'is-good' : 'is-bad'));
          textLine(box, 'Juiste antwoord: ' + correct.text);
        } else { textLine(box, 'Vergelijk je antwoord met het antwoordmodel.'); }
        examModel(context, box);
      }
    } else {
      examModel(context, box); selfScore(context, box);
    }
    box.hidden = false; examUI.button.setAttribute('aria-expanded', 'true');
  }

  each('.question[data-code][data-q]', document, preparePractice);
  document.addEventListener('change', function (event) {
    if (!event.target.matches('[data-direct-check]')) return;
    direct = event.target.checked;
    try { localStorage.setItem(KEY, String(direct)); } catch (error) { /* Still works without storage. */ }
    syncCheckboxes();
    if (!direct) return;
    var question = event.target.closest('.question');
    if (question) {
      var record = practice.find(function (item) { return item.question === question && item.mc; });
      if (record && question.querySelector('.answer-radio:checked')) checkPractice(record);
    } else if (examUI && examUI.answer.isConnected && examUI.answer.querySelector('input[name="exam-answer"]:checked')) {
      checkExam();
    }
  });
  window.addEventListener('storage', function (event) {
    if (event.key !== KEY) return;
    direct = event.newValue === 'true'; syncCheckboxes();
  });
  window.addEventListener('cafa:practice-change', function () {
    // The app dispatches this just before refreshing exam/finished classes.
    Promise.resolve().then(syncPractice);
  });
  if (examHost) {
    examHost.addEventListener('click', function (event) {
      var button = event.target.closest('[data-exam-action="check"]');
      if (!button || !examHost.querySelector('[data-exam-answer]') || !examContext()) return;
      event.preventDefault(); event.stopPropagation(); checkExam();
    }, true);
    examHost.addEventListener('change', function (event) {
      if (event.target.name !== 'exam-answer') return;
      // Registered after exams.js: the selected answer is saved before it is checked.
      if (examUI) hide(examUI);
      if (direct) checkExam();
    });
    examHost.addEventListener('input', function (event) {
      if (examUI && event.target.closest('[data-exam-answer]')) hide(examUI);
    });
    examHost.addEventListener('click', function (event) {
      if (direct && event.target.name === 'exam-answer') {
        var input = event.target;
        setTimeout(function () {
          if (direct && input.isConnected && input.checked && examUI && examUI.feedback.hidden) checkExam();
        }, 0);
      }
      if (examUI && event.target.closest('[data-exam-answer] button')) hide(examUI);
    });
    new MutationObserver(prepareExam).observe(examHost, {childList:true, subtree:true});
    prepareExam();
  }
  window.CafaFeedback = {storageKey:KEY};
}());
