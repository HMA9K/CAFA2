/** Shared, dependency-free normalization for the CAFA2 adapter and build step. */
export const VERSION = '2026-09-24.2';
export const COURSES = Object.freeze(['CAFA2', 'SRA', 'BELRE3']);
export const HISTORY_LIMITS = Object.freeze({messages:8,characters:16000});
export function conversationHistory(chat) {
  const history=[];
  let remaining=HISTORY_LIMITS.characters;
  for(const entry of chat.filter(x=>!x.failed).slice(-HISTORY_LIMITS.messages).reverse()) {
    if(typeof entry.content!=='string'||!['user','assistant'].includes(entry.role))continue;
    let content=entry.content;
    if(content.length>remaining) {
      if(history.length)break;
      const omitted='\n[Het middendeel van dit lange eerdere bericht is weggelaten.]\n';
      const head=Math.floor((remaining-omitted.length)/2);
      content=content.slice(0,head)+omitted+content.slice(-(remaining-omitted.length-head));
    }
    history.unshift({role:entry.role,content});remaining-=content.length;
    if(!remaining)break;
  }
  return history;
}
export function plain(value) {
  const text = String(value ?? '');
  return text.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<br\s*\/?\s*>/gi, '\n').replace(/<\/(td|th)>/gi, '\t')
    .replace(/<\/(p|div|tr|li|h[1-6]|table|blockquote)>/gi, '\n')
    .replace(/<!--[\s\S]*?-->/g, '').replace(/<\/?[a-z][^>]*>/gi, '')
    .replace(/&#(x[0-9a-f]+|\d+);/gi, (_, s) => {
      const n = s[0].toLowerCase() === 'x' ? parseInt(s.slice(1),16) : Number(s);
      return n > 0 && n <= 0x10ffff && !(n >= 0xd800 && n <= 0xdfff) ? String.fromCodePoint(n) : '';
    }).replace(/&(nbsp|amp|lt|gt|quot|apos|euro|ndash|mdash);/gi, (_, s) =>
      ({nbsp:' ',amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",euro:'€',ndash:'–',mdash:','})[s.toLowerCase()])
    .replace(/[\t ]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim();
}
export function cleanData(value, depth = 0) {
  if (depth > 14) throw new Error('De vraagstructuur is te diep.');
  if (value == null || typeof value === 'boolean' || typeof value === 'number') return value;
  if (typeof value === 'string') return plain(value);
  if (Array.isArray(value)) return value.map(v => cleanData(v, depth + 1));
  if (typeof value !== 'object') return null;
  return Object.fromEntries(Object.entries(value).filter(([k,v]) =>
    !['__proto__','constructor','prototype'].includes(k) && typeof v !== 'function'
  ).map(([k,v]) => [k,cleanData(v,depth + 1)]));
}
const privateOptionKeys = /^(why|correct|isCorrect|correctAnswer|correctOptionId|explanation|rationale|feedback|score|points)$/i;
export function publicOption(value) {
  if (Array.isArray(value)) return value.map(publicOption);
  if (!value || typeof value !== 'object') return cleanData(value);
  return Object.fromEntries(Object.entries(value).filter(([k]) => !privateOptionKeys.test(k))
    .map(([k,v]) => [k,publicOption(v)]));
}
function labelledOptions(options) {
  return options.map((option,index) => ({...publicOption(option),choiceIndex:index,letter:String.fromCharCode(65+index)}));
}
export function refKey(ref) {
  if (!ref || !COURSES.includes(ref.course) || !['practice','exam'].includes(ref.kind)) throw new Error('Ongeldige vraagverwijzing.');
  if (![ref.bankId,ref.questionId].every(v => typeof v === 'string' && /^[\w.-]{1,120}$/.test(v))) throw new Error('Ongeldig vraag-ID.');
  return [ref.course,ref.kind,ref.bankId,ref.questionId].join(':');
}
function sources(raw) {
  return (Array.isArray(raw) ? raw : Object.values(raw || {})).filter(Boolean).map((s,i) => {
    if (typeof s === 'string') return {id:`V${i+1}`,label:plain(s),kind:'reference'};
    return {id:`V${i+1}`, label:plain(s.label || s.title || s.file || `Bron ${i+1}`),
      file:plain(s.file || s.title || ''), pages:plain(s.pages || ''), kind:s.kind || 'reference'};
  });
}
export function normalizePractice(course, code, bank, q) {
  const ref = {course,kind:'practice',bankId:code,questionId:String(q.id)};
  const refs = (q.refs || []).map(id => bank.sources?.[id]).filter(Boolean);
  const context = {
    ref, title:plain(q.title), subject:plain(bank.title), number:q.id, type:plain(q.type || 'open'),
    prompt:plain(q.task || q.promptHtml || q.prompt), caseText:plain(q.caseHtml || q.intro || ''),
    ...(q.sourceType==='exam'?{examInstructions:plain(q.examInstructions || ''),referencedSolutions:cleanData(q.referencedSolutions || [])}:{}),
    facts:cleanData(q.facts || []), caseTables:cleanData(q.caseTables || []),
    options:labelledOptions(q.options || []), references:sources(refs),
    answerColumns:(q.options || []).some(option => Array.isArray(option.journal))
      ? ['Grootboekrekening','Debet (€)','Credit (€)'] : []
  };
  if (!context.prompt) throw new Error(`Vraag zonder vraagtekst: ${refKey(ref)}`);
  return {ref,context,review:{correct:q.correct ?? null,
    correctLetter:Number.isInteger(q.correct) ? String.fromCharCode(65+q.correct) : null,
    explanation:cleanData(q.explanation || []),
    pattern:cleanData(q.pattern || ''), guidance:cleanData(q.guidance || {}),
    optionFeedback:(q.options || []).map((o,i) => ({index:i,why:plain(o?.why || '')})),
    solution:cleanData(q.solutionHtml || q.solution || q.answerModel || '')}};
}
export function normalizeExam(course, exam, q) {
  const ref = {course,kind:'exam',bankId:exam.id,questionId:String(q.id)};
  const section = (exam.sections || []).find(s => s.id === q.sectionId);
  if (q.sectionId && !section) throw new Error(`Casus ontbreekt: ${refKey(ref)}`);
  const questionIndex=(exam.questions || []).indexOf(q);
  const prompt=plain(q.promptHtml || q.prompt);
  const referencedNumbers=[...prompt.matchAll(/\bvraag\s+(\d+)\b/gi)]
    .filter(match => !/\boorspronkelijke\s*$/i.test(prompt.slice(Math.max(0,match.index-20),match.index)))
    .map(match => Number(match[1]));
  const referencedSolutions=[...new Set(referencedNumbers)].map(number =>
    (exam.questions || []).slice(0,questionIndex).find(previous =>
      previous.sectionId===q.sectionId && (previous.number===number || previous.originalNumber===number)))
    .filter(Boolean).map(previous => ({id:previous.id,number:previous.originalNumber ?? previous.number,
      prompt:plain(previous.promptHtml || previous.prompt),
      solution:plain(previous.solutionHtml || previous.solution || previous.answerModel || previous.modelAnswer || '')}));
  const context = {ref,title:plain(q.title || `Vraag ${q.number || q.id}`),subject:plain(section?.title || exam.title),
    date:exam.date || '',number:q.originalNumber ?? q.number,type:plain(q.type || 'open'),
    prompt, caseText:plain(section?.contentHtml || section?.content || ''),
    examInstructions:plain(exam.introductionHtml || exam.introduction || ''),
    relatedQuestions:(exam.questions || []).filter(x => x.sectionId === q.sectionId && x.id !== q.id)
      .map(x => ({id:x.id,number:x.originalNumber ?? x.number,prompt:plain(x.promptHtml || x.prompt)})),
    referencedSolutions,
    options:labelledOptions(q.options || []), references:sources(exam.sources).filter(s => s.kind !== 'model-answers'),
    answerColumns:q.type==='open' && /journaalpost|eliminatieboeking|correctieboeking/i.test(prompt)
      ? ['Omschrijving grootboekrekening','Debet','Credit','Ruimte voor eventuele toelichting'] : []};
  if (!context.prompt) throw new Error(`Vraag zonder vraagtekst: ${refKey(ref)}`);
  return {ref,context,review:{solution:plain(q.solutionHtml || q.solution || q.answerModel || q.modelAnswer || ''),
    correct:q.correctOptionId ?? q.correctAnswer ?? q.correct ?? null, rubric:cleanData(q.rubric || ''),
    sourceNotes:cleanData(exam.sourceNotes || []),references:sources(exam.sources)}};
}
/** Content-version marker, not an authentication or cryptographic signature. */
export function recordRevision(record) {
  const text=JSON.stringify({ref:record.ref,context:record.context,review:record.review});let a=2166136261,b=3335557771;
  for(let i=0;i<text.length;i++){const c=text.charCodeAt(i);a=Math.imul(a^c,16777619);b=Math.imul(b^c,2246822519);}
  return 'v1-'+(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');
}
export function buildCatalog(win, course = 'CAFA2') {
  const records = Object.create(null), counts = {practice:0,exam:0}, types = Object.create(null);
  function add(record) {const key=refKey(record.ref);if(records[key])throw new Error(`Dubbel vraag-ID: ${key}`);
    record.revision=recordRevision(record);records[key]=record;counts[record.ref.kind]++;types[record.context.type]=(types[record.context.type]||0)+1;}
  for (const [code,bank] of Object.entries(win.CAFA2_DATA?.modules || {}))
    for (const q of bank.questions || []) add(normalizePractice(course,code,bank,q));
  const exams=[...(win.CAFA2_EXAMS || [])];
  if (win.CAFA2_EXAM_DEMO && !exams.some(e => e.id === win.CAFA2_EXAM_DEMO.id)) exams.push(win.CAFA2_EXAM_DEMO);
  for (const exam of exams) for (const q of exam.questions || []) add(normalizeExam(course,exam,q));
  if (!counts.practice || !counts.exam) throw new Error('De oefenvragen of tentamens ontbreken in de catalogus.');
  return {version:VERSION,course,counts,types,records};
}
