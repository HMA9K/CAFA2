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

  var TOPICS = {
    1: 'Kapitaalbelangen',
    2: 'Vreemde valuta',
    3: 'Consolidatie nettovermogenswaarde',
    4: 'Consolidatie verkrijgingsprijs'
  };
  // Per vast onderwerp het opgavenummer op het oorspronkelijke tentamenpapier.
  // Een nieuw tentamen krijgt pas een onderwerpkeuze nadat zijn bronindeling is gecontroleerd.
  var SOURCE_ORDER = {
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
  function topicTitle(number) {
    return validNumber(number) ? TOPICS[number] : null;
  }
  function sourceSectionId(exam, number) {
    var order = exam && SOURCE_ORDER[exam.id];
    return validNumber(number) && order ? 'opgave-' + order[number - 1] : null;
  }

  function available(catalog, number) {
    if (!validNumber(number)) return [];
    return catalog.filter(function (exam) {
      var sectionId = sourceSectionId(exam, number);
      return !exam.demo && Array.isArray(exam.sections) && Array.isArray(exam.questions) &&
        sectionId && exam.sections.some(function (section) { return section.id === sectionId; }) &&
        exam.questions.some(function (question) { return question.sectionId === sectionId; });
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
      var originalSectionId = sourceSectionId(exam, number);
      var sourceSection = exam.sections.find(function (section) { return section.id === originalSectionId; });
      var sourceNumber = Number(originalSectionId.slice('opgave-'.length));
      var code = exam.date.replace(/-/g, '');
      sections.push(Object.assign({}, sourceSection, {
        id: exam.id + '-' + sourceSection.id,
        sourceExamId: exam.id,
        sourceCode: code,
        sourceSectionId: sourceSection.id,
        sourceOpgaveNumber: sourceNumber,
        topicNumber: number,
        title: 'Opgave ' + number + ' · ' + TOPICS[number] + ' · ' + code + ' · ' +
          sourceSection.title.replace(/^Opgave\s+[1-4]\s*[·:–-]?\s*/i, '') +
          (sourceNumber === number ? '' : ' · bronopgave ' + sourceNumber)
      }));
      exam.questions.filter(function (question) { return question.sectionId === originalSectionId; }).forEach(function (question) {
        questions.push(Object.assign({}, question, {
          id: exam.id + '-' + question.id,
          sectionId: exam.id + '-' + sourceSection.id,
          sourceExamId: exam.id,
          sourceCode: code,
          sourceOpgaveNumber: sourceNumber,
          sourceQuestionId: question.id
        }));
      });
    });
    return {
      id: 'onderwerp-' + number + '-' + selected.map(function (exam) { return exam.date.replace(/-/g, ''); }).join('-'),
      title: 'Tentamenvragen per onderwerp · Opgave ' + number + ' · ' + TOPICS[number],
      date: selected[0].date,
      durationMinutes: 180,
      introduction: 'Je oefent het onderwerp ' + TOPICS[number] + ' uit de gekozen tentamens achter elkaar, van nieuw naar oud: ' +
        selected.map(function (exam) { return exam.date.replace(/-/g, ''); }).join(', ') +
        '. Het oorspronkelijke opgavenummer kan per tentamen verschillen. De casussen, vragen en antwoordmodellen blijven per tentamen bij elkaar. Er is geen tijdslimiet.',
      practiceKind: 'opgave',
      opgaveNumber: number,
      selectionBasis: 'topic',
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

  return { available: available, build: build, topicTitle: topicTitle, sourceSectionId: sourceSectionId };
}));
