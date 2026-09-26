import fs from 'node:fs';
import path from 'node:path';
import {root,loadSources} from './exam-practice-source.mjs';
import {question} from './practice-question-renderer.mjs';
const {exams,banks,topics}=loadSources();
const registryFile=path.join(root,'content/practice/exam-question-registry.json');
const registry=fs.existsSync(registryFile)?JSON.parse(fs.readFileSync(registryFile,'utf8')):{};
const next=Object.fromEntries(Object.entries(banks).map(([code,b])=>[code,Math.max(b.questions.length,...Object.values(registry).filter(x=>x.code===code).map(x=>x.id))]));
const count=Object.fromEntries(Object.entries(banks).map(([code,b])=>[code,b.questions.length]));
const authored=fs.readdirSync(path.join(root,'content/practice/exam-mc')).sort().flatMap(f=>JSON.parse(fs.readFileSync(path.join(root,'content/practice/exam-mc',f),'utf8')));
const rows=[];
for(const raw of authored){
 const exam=exams.find(e=>e.id===raw.examId),section=exam.sections.find(s=>s.id===raw.sectionId);
 const code=/kapitaalbelangen/i.test(section.title)?'kap':/vreemde valuta/i.test(section.title)?'val':/verkrijgingsprijs/i.test(section.title)?'hk':'nvw';
 const assigned=registry[raw.key]||(registry[raw.key]={code,id:++next[code]});
 if(assigned.code!==code)throw Error('Gewijzigde deelindeling: '+raw.key);
 const rotation=(assigned.id+Object.keys(banks).indexOf(code))%4;
 const options=raw.options.map((_,i)=>raw.options[(i+rotation)%4]);
 const q={...raw,id:assigned.id,options,correct:(4-rotation)%4,sourceType:'exam',variant:false,stage:0,related:[],code};
 rows.push(q);count[code]++;
}
const byCode=Object.fromEntries(Object.keys(banks).map(c=>[c,rows.filter(q=>q.code===c).sort((a,b)=>a.id-b.id)]));
for(const[c,qs]of Object.entries(byCode))qs.forEach((q,i)=>{if(q.id!==banks[c].questions.length+i+1)throw Error('Niet-aaneengesloten ID: '+q.key);});
fs.writeFileSync(registryFile,JSON.stringify(registry,null,2)+'\n');
const manifest=[];
for(const exam of exams){
 const qs=rows.filter(q=>q.examId===exam.id),date=exam.date.replaceAll('-','');
 const file=`data/exam-practice-${date}.js`,fragment=`fragments/exam-practice-${date}.html`;
 fs.writeFileSync(path.join(root,file),`(function(){var questions=${JSON.stringify(qs)};questions.forEach(function(q){var bank=window.CAFA2_DATA.modules[q.code],exam=window.CAFA2_EXAMS.find(function(e){return e.id===q.examId;});q.caseHtml=exam.sections.find(function(s){return s.id===q.sectionId;}).contentHtml;q.examInstructions=exam.introductionHtml;q.referencedSolutions=q.dependencyQuestionIds.map(function(id){var p=exam.questions.find(function(x){return x.id===id;});return{id:p.id,prompt:p.prompt,solution:p.solution};});bank.questions.push(q);bank.sources[q.refs[0]]=q.sources[0];[q.topicId,...(q.secondaryTopicIds||[])].forEach(function(id){window.CAFA2_TOPICS.find(function(t){return t.id===id;}).questions.push(q.code+'-'+q.id);});});})();\n`);
 fs.writeFileSync(path.join(root,fragment),qs.map(q=>question(q,q.code,count[q.code])).join('\n').replace(/[ \t]+$/gm,''));
 manifest.push({examId:exam.id,file,fragment,count:qs.length});
}
const meta={total:247+rows.length,syllabus:247,exam:rows.length,exams:manifest,modules:count,mapping:rows.map(q=>({examId:q.examId,questionId:q.questionId,practiceId:q.code+'-'+q.id,topicId:q.topicId,secondaryTopicIds:q.secondaryTopicIds,sectionId:q.sectionId,dependencies:q.dependencyQuestionIds}))};
fs.writeFileSync(path.join(root,'data/exam-practice.js'),`window.CAFA2_EXAM_PRACTICE=${JSON.stringify(meta)};Object.values(window.CAFA2_DATA.modules).forEach(function(b){b.questions.sort(function(a,b){return a.id-b.id;});});\n`);
fs.writeFileSync(path.join(root,'docs/mc-audit/exam-practice-coverage.json'),JSON.stringify(meta,null,2)+'\n');
console.log(`MC-dekking: ${rows.length}/${exams.reduce((n,e)=>n+e.questions.length,0)} tentamenvragen; ${meta.total} MC-vragen totaal.`);
