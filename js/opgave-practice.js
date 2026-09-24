(function (root, factory) {
  'use strict';
  var practice = factory();
  if (typeof module === 'object' && module.exports) module.exports = practice;
  if (root) root.CafaOpgavePractice = practice;
}(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  function validNumber(number) {
    return Number.isInteger(number) && number >= 1 && number <= 4;
  }

  function available(catalog, number) {
    if (!validNumber(number)) return [];
    return catalog.filter(function (exam) {
      return !exam.demo && Array.isArray(exam.sections) && Array.isArray(exam.questions) &&
        exam.sections.some(function (section) { return section.id === 'opgave-' + number; }) &&
        exam.questions.some(function (question) { return question.sectionId === 'opgave-' + number; });
    });
  }

  function build(catalog, number, examIds) {
    if (!validNumber(number)) throw new RangeError('Kies Opgave 1, 2, 3 of 4.');
    if (!Array.isArray(examIds) || !examIds.length || new Set(examIds).size !== examIds.length) {
      throw new RangeError('Kies minstens één verschillend tentamen.');
    }
    var eligible = available(catalog, number);
    if (examIds.some(function (id) { return !eligible.some(function (exam) { return exam.id === id; }); })) {
      throw new RangeError('Een gekozen tentamen heeft deze opgave niet.');
    }
    var selected = eligible.filter(function (exam) { return examIds.includes(exam.id); })
      .sort(function (a, b) { return b.date.localeCompare(a.date); });
    var sections = [], questions = [];
    selected.forEach(function (exam) {
      var sourceSection = exam.sections.find(function (section) { return section.id === 'opgave-' + number; });
      var code = exam.date.replace(/-/g, '');
      sections.push(Object.assign({}, sourceSection, {
        id: exam.id + '-' + sourceSection.id,
        sourceExamId: exam.id,
        sourceCode: code,
        sourceSectionId: sourceSection.id,
        title: 'Opgave ' + number + ' · ' + code + ' · ' + sourceSection.title.replace(/^Opgave\s+[1-4]\s*[·:–-]?\s*/i, '')
      }));
      exam.questions.filter(function (question) { return question.sectionId === sourceSection.id; }).forEach(function (question) {
        questions.push(Object.assign({}, question, {
          id: exam.id + '-' + question.id,
          sectionId: exam.id + '-' + sourceSection.id,
          sourceExamId: exam.id,
          sourceCode: code,
          sourceQuestionId: question.id
        }));
      });
    });
    return {
      id: 'opgave-' + number + '-' + selected.map(function (exam) { return exam.date.replace(/-/g, ''); }).join('-'),
      title: 'Tentamenvragen per opgave · Opgave ' + number,
      date: selected[0].date,
      durationMinutes: 180,
      introduction: 'Je oefent Opgave ' + number + ' uit de gekozen tentamens achter elkaar, van nieuw naar oud: ' +
        selected.map(function (exam) { return exam.date.replace(/-/g, ''); }).join(', ') +
        '. De oorspronkelijke casussen, vragen en antwoordmodellen blijven per tentamen bij elkaar. Er is geen tijdslimiet.',
      practiceKind: 'opgave',
      opgaveNumber: number,
      sourceExamIds: selected.map(function (exam) { return exam.id; }),
      sourceIntroductions: selected.map(function (exam) {
        return {
          id: exam.id,
          code: exam.date.replace(/-/g, ''),
          introduction: exam.introduction,
          introductionHtml: exam.introductionHtml,
          instructions: exam.instructions
        };
      }),
      maxScore: questions.reduce(function (sum, question) { return sum + (question.points || 0); }, 0),
      sections: sections,
      questions: questions
    };
  }

  return { available: available, build: build };
}));
