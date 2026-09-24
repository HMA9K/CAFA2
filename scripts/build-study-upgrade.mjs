import {decorateTables} from '../content/summary/table-layout.mjs';
/* Additive, reproducible presentation build. The original exam models are not mutated. */
import fs from 'node:fs';
import vm from 'node:vm';
import {guides,laws,examNotes,capitalFlow,lawLink,lawPage,topicAddition,noteHtml,lawRail} from '../content/study/render.mjs';
import {orientation,orientationHtml,examRoutePage} from '../content/study/learning-route.mjs';
const read=p=>fs.readFileSync(p,'utf8'),write=(p,s)=>fs.writeFileSync(p,s);
const clean=s=>s.replace(/<!-- study-upgrade:[\s\S]*?<!-- \/study-upgrade -->/g,'').replace(/<!-- study-note:[\s\S]*?<!-- \/study-note -->/g,'');
const wrap=(name,s)=>'<!-- study-upgrade:'+name+' -->'+s+'<!-- /study-upgrade -->';
const block=(name,s)=>'<!-- study-note:'+name+' -->'+s+'<!-- /study-note -->';
function assets(s,p=''){
  s=s.replace(/css\/(exams|exam-experience)\.css(?:\?v=[^"]*)?"/g,'css/$1.css?v=20260923-caseleft1"');
  s=s.replace(/<meta name="color-scheme" content="[^"]*">/,'<meta name="color-scheme" content="light dark">');
  s=s.replace('</head>',wrap('styles','<link rel="stylesheet" href="'+p+'css/study-ui.css?v=20260924-questionnav1"><link rel="stylesheet" href="'+p+'css/study-dark.css?v=20260922-2"><link rel="stylesheet" href="'+p+'css/study-refinement.css?v=20260922-2"><link rel="stylesheet" href="'+p+'css/calculator.css?v=20260922-3"><link rel="stylesheet" href="'+p+'css/study-clarity.css?v=20260923-navrow1">')+'</head>');
  s=s.replace('<head>','<head>'+wrap('early-theme','<script src="'+p+'js/study-theme.js?v=20260922-2"></script>'));
  const scripts='<script defer src="'+p+'js/study-lessons.js?v=20260922-clarity1"></script><script defer src="'+p+'js/law-focus.js?v=20260922-2"></script><script defer src="'+p+'js/law-popover.js?v=20260922-2"></script><script '+(s.includes('js/bootstrap.js')?'':'defer ')+'src="'+p+'data/study-support.js?v=20260922-2"></script><script '+(s.includes('js/bootstrap.js')?'':'defer ')+'src="'+p+'js/study-shell.js?v=20260924-questionnav1"></script><script defer src="'+p+'js/study-wizard.js?v=20260922-clarity1"></script>';
  if(s.includes('<script src="js/bootstrap.js">'))s=s.replace('<script src="js/bootstrap.js">',wrap('scripts',scripts)+'<script src="js/bootstrap.js">');
  else s=s.replace('</head>',wrap('scripts',scripts+'<script defer src="'+p+'js/calculator.js?v=20260922-3"></script>')+'</head>');
  return s;
}
const context={window:{CAFA2_DATA:{modules:{}}}};vm.createContext(context);
const modules={kap:'kapitaalbelangen',val:'vreemde-valuta',nvw:'consolidatie-nvw',hk:'consolidatie-hk'};
for(const file of Object.values(modules))vm.runInContext(read('data/'+file+'.js'),context);
for(const file of fs.readdirSync('data').filter(p=>/^exam-\d+\.js$/.test(p)))vm.runInContext(read('data/'+file),context);
let summary=clean(read('samenvatting.html'));
let topics=0;
for(const id of Object.keys(guides)){
  const opening=new RegExp('(<div class="reader-topic" id="'+id+'"[\\s\\S]*?)(<details class="reader-sources">)');
  if(!opening.test(summary))throw Error('Onderwerp ontbreekt: '+id);
  summary=summary.replace(opening,(_,a,b)=>a+block(id,topicAddition(id))+b);topics++;
}
for(const id of Object.keys(orientation)){
 const opening=new RegExp('(<article class="reader-chapter"[^>]*id="'+id+'"[\\s\\S]*?<h1[^>]*>[\\s\\S]*?</h1>)');
 // Reader chapters are section elements in the source builder.
 const sectionOpening=new RegExp('(<section class="reader-chapter"[^>]*id="'+id+'"[\\s\\S]*?<h1[^>]*>[\\s\\S]*?</h1>)');
 const re=opening.test(summary)?opening:sectionOpening;
 if(!re.test(summary))throw Error('Geen hoofdstukkop: '+id);
 summary=summary.replace(re,m=>m+wrap('orientation-'+id,orientationHtml(id)));
}
summary=summary.replace(/<section class="summary-page" data-view="tentamen"[^>]*>[\s\S]*?<\/section>/,examRoutePage());
summary=summary.replace('</main>',wrap('pages',capitalFlow(lawLink)+lawPage())+'</main>');
const toolLinks='<a data-tool-link="kapitaalboom" href="#kapitaalboom">Kapitaalbelangen</a>';
summary=summary.replace(/(<a [^>]*data-tool-link="summary"[^>]*>[\s\S]*?<\/a>)/,m=>m+wrap('tool-tabs',toolLinks));
summary=summary.replace('<div class="reader-tools">','<div class="reader-tools">'+wrap('tool-home','<a class="study-button" href="#kapitaalboom">Beslisboom kapitaalbelangen</a><a class="study-button" href="#wetsartikelen">Wetsartikelen</a>'));
write('samenvatting.html',assets(decorateTables(summary)));
const readerManifest=JSON.parse(read('docs/summary-reader-manifest.json'));readerManifest.views=14;write('docs/summary-reader-manifest.json',JSON.stringify(readerManifest,null,2)+'\n');
let practice=0;
for(const [code,name] of Object.entries(modules)){
  const mod=context.window.CAFA2_DATA.modules[code];
  for(const dir of ['fragments','fallback']){
    let s=clean(read(dir+'/'+name+'.html')),prefix=dir==='fallback'?'../':'';
    s=s.replace(/<section class="screen question frame" id="([a-z]+)-(\d+)"[\s\S]*?(?=<section class="screen question frame"|$)/g,(chunk,c,n)=>{
      if(c!==code)return chunk;
      const q=mod.questions[Number(n)-1],id=q.guidance.lesson;
      if(!guides[id])throw Error('Geen inhoudelijke onderbouwing voor '+code+'-'+n);
      // The pattern occurs once for MC and once for self-written answers, both behind feedback controls.
      let count=0;
      chunk=chunk.replace(/(<div class="pattern learning-pattern">[\s\S]*?<\/div>)/g,m=>{count++;return m+block(code+'-'+n,noteHtml(id,'',prefix+'samenvatting.html'));});
      if(count!==2)throw Error('Verwacht 2 feedbackvarianten: '+code+'-'+n+', gevonden '+count);
      if(dir==='fragments')practice++;
      return chunk;
    });
    if(dir==='fallback')s=assets(s,prefix);
    write(dir+'/'+name+'.html',s);
  }
}
let home=clean(read('fragments/home.html')).replace('12 lessen · stap voor stap','7 hoofdstukken · stap voor stap');
for(const c of Object.keys(modules))home=home.replace(new RegExp('(<a class="btn primary"[^>]*data-start="'+c+'"[^>]*>[^<]*<\/a>)'),m=>m+wrap('restart-'+c,'<button class="btn compact study-restart" type="button" data-reset="'+c+'" hidden>Opnieuw beginnen</button>'));
home=home.replace('<p class="cafa-home-help">',wrap('home-quick','<nav class="study-home-links" aria-label="Direct naar studiehulpmiddelen"><a href="samenvatting.html#kapitaalboom">Beslisboom kapitaalbelangen →</a><a href="samenvatting.html#wetsartikelen">Wetsartikelen →</a><a href="samenvatting.html#kernschema">IC-kernschema →</a></nav>')+'<p class="cafa-home-help">');
write('fragments/home.html',home);
write('index.html',assets(clean(read('index.html'))));
// Notes are looked up at render time, including for previously saved exam attempts.
const notes={};let noteCount=0;
for(const exam of context.window.CAFA2_EXAMS){
 notes[exam.id]={};
 for(const q of exam.questions){
   const note=examNotes[exam.id]?.[q.id];if(!note)throw Error('Geen toelichting: '+exam.id+'/'+q.id);
   const source=note.source+(note.page?', p. '+note.page:'')+' · '+note.question;
   notes[exam.id][q.id]={lesson:note.lesson,html:noteHtml(note.lesson,note.explanation,'samenvatting.html',source)};noteCount++;
 }
}
write('data/study-support.js','window.CAFA2_STUDY='+JSON.stringify({laws,guides,notes}).replace(/</g,'\\u003c')+';\n');
write('docs/study-upgrade-manifest.json',JSON.stringify({version:'2026-09-22',topics,practiceQuestions:practice,examNotes:noteCount,articles:Object.keys(laws).length,examDataUnchanged:true,defaultTheme:'auto',themePersistence:'browser session',chapterOrientations:7,examRouteExamples:7,examRouteSourceCount:4,examMethodCount:4,examMethodSourceCount:7,prerequisites:'prior knowledge, not case inputs',functionalCurrency:'facts, interpretation, weight and conclusion',lawPresentation:'non-modal anchored literal source',capitalRoute:'three click stages with immediate recomputation',sourceVersion:'Aangeleverde studiekopie 01-01-2025'},null,2)+'\n');
console.log('Study upgrade built:',{topics,practice,noteCount,articles:Object.keys(laws).length});
