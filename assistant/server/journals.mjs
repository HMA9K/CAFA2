/** Canonical journal columns and deterministic response validation. No provider calls here. */
const side=/^(?:debet|credit)(?:\s|$|\()/i;
export function cents(value){
  if(value==null||value==='')return 0;
  if(typeof value==='number')return Number.isFinite(value)&&Math.abs(value)<1e12&&Math.abs(value*100-Math.round(value*100))<1e-5?Math.round(value*100):null;
  let s=String(value).trim().replace(/[€£$\s]/g,'').replace(/−/g,'-');
  if(!/^-?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/.test(s))return null;
  const n=Number(s.replace(/\./g,'').replace(',','.'));
  return Number.isFinite(n)&&Math.abs(n)<1e12?Math.round(n*100):null;
}
export function journalTotals(rows){
  let debit=0,credit=0;
  for(const row of rows){const d=cents(row.debit),c=cents(row.credit);if(d===null||c===null)return null;debit+=d;credit+=c;}
  return {debit,credit,balanced:debit===credit};
}
export function canonicalJournals(solution){
  if(typeof solution!=='string')return [];
  const lines=solution.split('\n'),journals=[];let title='Uitwerking';
  for(let i=0;i<lines.length;i++){
    const line=lines[i],headers=line.split('\t').map(s=>s.trim());
    const d=headers.findIndex(s=>/^debet(?:\s|$|\()/i.test(s)),c=headers.findIndex(s=>/^credit(?:\s|$|\()/i.test(s));
    if(d>0&&c>d&&!side.test(headers[0])){
      const rows=[];
      for(let j=i+1;j<lines.length;j++){
        if(!lines[j].includes('\t'))break;
        const cells=lines[j].split('\t');
        const account=cells[0]?.trim(),debit=cells[d]?.trim()||'',credit=cells[c]?.trim()||'';
        if(!account||(!debit&&!credit)||side.test(account))break;
        rows.push({account,debit,credit});i=j;
      }
      if(rows.length)journals.push({id:'J'+(journals.length+1),title,rows,totals:journalTotals(rows)});
    }else if(line.trim()&&!line.includes('\t'))title=line.trim().slice(0,200);
  }
  return journals;
}
const object=properties=>({type:'object',properties,required:Object.keys(properties),additionalProperties:false});
const string={type:'string'},nullableNumber={type:['number','null']};
export function ownershipFacts(caseText){
  // Read only explicitly named capital interests; never infer a party from an unrelated percentage.
  return [...String(caseText||'').matchAll(/(\d+(?:[.,]\d+)?)%\s+(?:kapitaal)?belang\s+in\s+([\p{L}\p{N}][\p{L}\p{N}._'-]*)/giu)]
    .map(([,percentage,company])=>({company,share:Number(percentage.replace(',','.'))}))
    .filter(f=>f.share>=0&&f.share<=100&&!/^(?:de|het|een)$/i.test(f.company))
    .map(f=>({...f,minority:Math.round((100-f.share)*10000)/10000}));
}
function checkOwnership(text,facts){
  for(const sentence of text.split(/[.!?\n]/)){
    if(/\b(?:niet|onjuist|fout)\b/i.test(sentence))continue;
    for(const fact of facts){
      const name=fact.company.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
      const match=sentence.match(new RegExp('\\b'+name+'\\s+(?:is\\s+|heeft\\s+|bedraagt\\s+)?(?:het\\s+)?(?:aandeel|belang|percentage)\\s+(?:van\\s+)?derden\\s+(?:is\\s+|bedraagt\\s+|van\\s+)?(\\d+(?:,\\d+)?)%','i'));
      if(match&&Number(match[1].replace(',','.'))!==fact.minority)fail('ownership_mismatch');
    }
  }
}
export function journalContract(record,message){
  const sources=canonicalJournals(record.review.solution);
  // MC journal choices already have typed source columns. Only the correct option is authoritative.
  const correct=record.context.options?.find(o=>Number.isInteger(record.review.correct)?o.choiceIndex===record.review.correct:o.id===record.review.correct);
  if(!sources.length&&Array.isArray(correct?.journal)&&correct.journal.length&&correct.journal.every(row=>Array.isArray(row)&&row.length===3)){
    const rows=correct.journal.map(([account,debit,credit])=>({account,debit,credit}));
    sources.push({id:'J1',title:'Antwoord '+correct.letter,rows,totals:journalTotals(rows)});
  }
  const relevant=sources.length||/journaalpost|eliminatieboeking|correctieboeking|\b(?:debet|credit)\b/i.test(record.context.prompt+' '+message)||record.context.type==='Journaalpost';
  if(!relevant)return null;
  const derivedAllowed=!sources.length||/tegenboeking|omgekeerde boeking|alternatie[fv]|variant|andere boeking|andere bedragen|stel (?:dat|nu)|wat als/i.test(message);
  const types=[object({type:{type:'string',enum:['text']},text:string})];
  if(sources.length)types.push(object({type:{type:'string',enum:['source_journal']},sourceId:{type:'string',enum:sources.map(s=>s.id)},rowIndices:{type:'array',items:{type:'integer'}}}));
  if(derivedAllowed)types.push(object({type:{type:'string',enum:['derived_journal']},title:string,reason:string,rows:{type:'array',items:object({account:string,debit:nullableNumber,credit:nullableNumber})}}));
  return {sources,ownership:ownershipFacts(record.context.caseText),derivedAllowed,format:{type:'json_schema',name:'study_journal_answer',strict:true,
    schema:object({parts:{type:'array',items:{anyOf:types}}})}};
}
export const journalInstructions=`
Boekhoudkundige uitvoercontrole: lever je antwoord als het gevraagde JSON-object met parts, in leesvolgorde.
Een text-onderdeel bevat gewone Nederlandse Markdown-uitleg, hints of feedback. Zet geen journaalpost, debet/credit-tabel of boekingsregel met rekening, zijde en bedrag in vrije tekst. Noem een bedrag bij een boekingszijde uitsluitend via een journaalpostonderdeel. Je mag debet en credit als begrippen uitleggen zonder bedragen. Bespreek een fout eigen antwoord in tekst en toon de juiste regel als een bronfragment.
De meegeleverde sourceJournals hebben vaste rekening-, debet- en creditvelden. Voor de officiële boeking gebruik je uitsluitend source_journal met het betreffende sourceId en rowIndices: [] voor alle regels. Voor één gevraagde regel gebruik je de nulgebaseerde regelnummers in rowIndices. Deze nummers en IDs zijn intern; noem ze niet in je uitleg. De toepassing vult de tabel en balanscontrole in. Verander nooit de zijde, het bedrag of de rekening uit deze bronregels. Noem een boeking met totals.balanced=false tegenstrijdig; corrigeer de bron niet stilzwijgend.
De ownershipFacts bevatten uitsluitend expliciet genoemde kapitaalbelangen en het daaruit volgende derdenbelang per vennootschap. Controleer bij ieder percentage eerst de betreffende vennootschap. Een leveranciersbelang en een afnemersbelang zijn verschillende gegevens; verwissel hun derdenpercentages niet. Een hint moet dezelfde casusfeiten gebruiken als een volledig antwoord.
derived_journal is uitsluitend beschikbaar voor een expliciet gevraagde alternatieve/nieuwe boeking of wanneer geen gestructureerde bronboeking beschikbaar is. Geef een reden met de gebruikte casusgegevens en de valuta/eenheid, numerieke bedragen met maximaal twee decimalen en null voor de lege zijde. Oude uitwerkingen zonder expliciete tabelcellen zijn niet automatisch bronboekingen: leid ze zorgvuldig uit de meegeleverde tekst af en presenteer ze als afleiding. Gebruik geen negatieve bedragen om onjuiste zijden te verbergen. Een afleiding moet debet=credit zijn, inclusief eventuele opgesplitste belasting- en derdenregels. Deze boeking wordt zichtbaar als afleiding aangeduid, nooit als letterlijk officiële uitwerking.
Respecteer de leervraag: een hint hoeft geen boeking te tonen. Een verzoek om de volledige journaalpost geef je direct met alle relevante bronboekingen. Toon bij een gevraagde toelichting alleen relevante regels. Gebruik bij een betwiste boekingszijde de vaste bronregel en controleer de aanname tegen die regel. Houd vervolgvragen bij de actuele casus. Houd de tekst kort; dupliceer de bronregels niet in vrije tekst.`;
export class JournalValidationError extends Error{
  constructor(code){super(code);this.name='JournalValidationError';this.code=code;}
}
const fail=code=>{throw new JournalValidationError(code);};
const cell=s=>String(s).replace(/\|/g,'\\|').replace(/[\r\n]+/g,' ').replace(/[<>]/g,'');
// Totals use the source's unit. Never invent EUR for a foreign-currency case.
const amount=n=>(n/100).toLocaleString('nl-NL',{minimumFractionDigits:2,maximumFractionDigits:2});
function table(rows){return '| Rekening | Debet | Credit |\n| --- | ---: | ---: |\n'+rows.map(r=>'| '+[r.account,r.debit??'',r.credit??''].map(cell).join(' | ')+' |').join('\n');}
function balanceText(totals){
  if(!totals)return 'De bronbedragen bevatten een uitdrukking; de aansluiting is niet automatisch vastgesteld.';
  return totals.balanced?'Controle: totaal debet '+amount(totals.debit)+' = totaal credit '+amount(totals.credit)+' (in dezelfde eenheid als de tabel).'
    :'Broncontrole: de overgenomen uitwerking sluit niet aan ('+amount(totals.debit)+' debet tegenover '+amount(totals.credit)+' credit). De bron is ongewijzigd weergegeven.';
}
function plainJournal(text){
  // No unchecked journal may bypass the typed journal parts through prose/code/Markdown.
  const clean=text.replace(/[*_`]/g,'').replace(/\b\d{1,2}\.\./g,'').replace(/\b(?:vraag|opgave|stap|regel)\s+\d+[a-z]?\b/gi,'').replace(/\d+(?:[.,]\d+)?\s*%/g,'');
  return /\|[^\n]*\bdebet\b[^\n]*\bcredit\b/i.test(clean)||clean.split('\n').some(line=>
    (/\b(?:debet(?:zijde|kant|boeking|saldo)?|credit(?:zijde|kant|boeking|saldo)?|debiteren|crediteren|debit|crédit)\b/i.test(line)||/^\s*(?:[-+>|]|\d+[.)])?\s*aan\b/i.test(line))&&/(?:[€£$]\s*[−-]?\d|\d[\d. ]*(?:,\d{1,2})?)/.test(line));
}
export function validatedJournalAnswer(text,contract){
  let data;try{data=JSON.parse(text);}catch{fail('invalid_json');}
  if(!data||typeof data!=='object'||Array.isArray(data)||Object.keys(data).join()!=='parts'||!Array.isArray(data.parts)||!data.parts.length||data.parts.length>24)fail('invalid_parts');
  const chunks=[],validation={sourceJournals:0,derivedJournals:0,normalizedTextParts:0};
  for(const part of data.parts){
    if(!part||typeof part!=='object'||Array.isArray(part))fail('invalid_part');
    if(part.type==='text'){
      if(Object.keys(part).sort().join()!=='text,type'||typeof part.text!=='string'||part.text.length>18000)fail('invalid_text');
      checkOwnership(part.text,contract.ownership||[]);
      let explanation=part.text.trim();
      if(plainJournal(explanation)){
        validation.normalizedTextParts++;
        // Retain explanatory paragraphs, but never display unchecked booking directions.
        explanation=explanation.split(/\n\s*\n/).filter(p=>!plainJournal(p)).join('\n\n');
      }
      if(explanation)chunks.push(explanation);
    }else if(part.type==='source_journal'){
      if(Object.keys(part).sort().join()!=='rowIndices,sourceId,type')fail('invalid_source_part');
      const source=contract.sources.find(s=>s.id===part.sourceId);
      if(!source||!Array.isArray(part.rowIndices)||part.rowIndices.some(i=>!Number.isInteger(i)||i<0||i>=source.rows.length)||new Set(part.rowIndices).size!==part.rowIndices.length)fail('unknown_source_row');
      const fragment=part.rowIndices.length>0&&part.rowIndices.length<source.rows.length;
      const rows=fragment?source.rows.filter((_,i)=>part.rowIndices.includes(i)):source.rows;
      chunks.push('### '+cell(source.title)+(fragment?' · bronfragment':' · volgens de uitwerking')+'\n\n'+table(rows)+(fragment?'':'\n\n'+balanceText(source.totals)));
      validation.sourceJournals++;
    }else if(part.type==='derived_journal'){
      if(!contract.derivedAllowed||Object.keys(part).sort().join()!=='reason,rows,title,type'||typeof part.title!=='string'||part.title.length>200||typeof part.reason!=='string'||part.reason.length>6000||!part.reason.trim()||!Array.isArray(part.rows)||part.rows.length<2||part.rows.length>60)fail('invalid_derived_journal');
      for(const row of part.rows){
        if(!row||Object.keys(row).sort().join()!=='account,credit,debit'||typeof row.account!=='string'||!row.account.trim()||row.account.length>250)fail('invalid_derived_row');
        if(![row.debit,row.credit].every(v=>v===null||typeof v==='number'&&v>=0&&cents(v)!==null)||(row.debit===null)===(row.credit===null))fail('invalid_derived_amount');
      }
      const totals=journalTotals(part.rows);if(!totals?.balanced)fail('unbalanced_derived_journal');
      if(plainJournal(part.reason)||plainJournal(part.title))fail('unstructured_journal');
      const rows=part.rows.map(r=>({...r,debit:r.debit===null?'':amount(cents(r.debit)),credit:r.credit===null?'':amount(cents(r.credit))}));
      chunks.push('### '+cell(part.title)+' · afleiding\n\n'+part.reason+'\n\n'+table(rows)+'\n\n'+balanceText(totals));
      validation.derivedJournals++;
    }else fail('unknown_part');
  }
  if(validation.normalizedTextParts){
    // A trusted table must be present. Hints or derived journals never get a fabricated fallback.
    if(!validation.sourceJournals||contract.derivedAllowed)fail('unstructured_journal');
    chunks.unshift('De boekingszijden en bedragen volgen hieronder rechtstreeks de uitwerking.');
  }
  if(!chunks.length)fail('empty_answer');
  return {answer:chunks.join('\n\n'),validation};
}
