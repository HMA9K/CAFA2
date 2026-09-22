import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import child from 'node:child_process';
const read=p=>fs.readFileSync(p,'utf8');
const manifest=JSON.parse(read('docs/study-upgrade-manifest.json'));
assert.deepEqual([manifest.topics,manifest.practiceQuestions,manifest.examNotes,manifest.articles],[40,120,131,74]);
assert.equal(manifest.defaultTheme,'auto');
const box={window:{}};vm.createContext(box);vm.runInContext(read('data/study-support.js'),box);
const {laws,guides,notes}=box.window.CAFA2_STUDY;
for(const [id,g] of Object.entries(guides)) {
 assert.ok(g.why.length>60&&g.practice.length>40,'Concrete understanding/practice connection for '+id);
 for(const ref of g.refs)assert.ok(laws[ref.article],'Known legal reference '+id);
}
for(const [id,law] of Object.entries(laws)) {
 assert.ok(law.page>=1&&law.page<=34,id);assert.ok(law.paragraphs.length,id);
}
const exams={window:{}};vm.createContext(exams);
for(const f of fs.readdirSync('data').filter(f=>/^exam-\d+\.js$/.test(f)))vm.runInContext(read('data/'+f),exams);
for(const ex of exams.window.CAFA2_EXAMS) for(const q of ex.questions){
 const n=notes[ex.id][q.id];assert.ok(n&&n.html.includes('Aanvullende toelichting'),ex.id+'/'+q.id);
 assert.ok(n.html.includes('law-ref'),ex.id+'/'+q.id);
 assert.ok(n.html.includes('samenvatting.html#'),ex.id+'/'+q.id);
}
for(const p of ['index.html','samenvatting.html',...['kapitaalbelangen','vreemde-valuta','consolidatie-nvw','consolidatie-hk'].map(x=>'fallback/'+x+'.html')]){
 const s=read(p);assert.equal((s.match(/src="(?:\.\.\/)?js\/study-theme.js/g)||[]).length,1,p);
 assert.equal((s.match(/src="(?:\.\.\/)?js\/study-shell.js/g)||[]).length,1,p);
 assert.ok(s.indexOf('study-theme.js')<s.indexOf('</head>'),p);
}
const index=read('index.html');assert.ok(index.indexOf('js/study-shell.js')<index.indexOf('js/bootstrap.js'),'Support ready before async runner');
const s=read('samenvatting.html');
for(const id of ['kapitaalboom','wetsartikelen','capital-value-result'])assert.equal((s.match(new RegExp('id="'+id+'"','g'))||[]).length,1,id);
assert.equal((s.match(/class="study-principle"/g)||[]).length,40);
for(const c of ['kap','val','nvw','hk'])assert.ok(read('fragments/home.html').includes('data-reset="'+c+'" hidden'));
// Every authored source note has an explicit PDF page, or explicitly names the repository model.
const sources=JSON.parse(read('content/study/exam-notes.json'));
for(const [eid,qs] of Object.entries(sources))for(const [q,n] of Object.entries(qs))assert.ok(n.page||n.sourceKind==='repository-model',eid+'/'+q);
for(const file of ['js/law-focus.js','js/law-popover.js','js/study-lessons.js','js/study-theme.js','js/study-shell.js','js/study-wizard.js','js/app.js','js/exams.js','js/answer-feedback.js'])new vm.Script(read(file),{filename:file});
const paths=['samenvatting.html','index.html','data/study-support.js','docs/study-upgrade-manifest.json','fragments/home.html',...['kapitaalbelangen','vreemde-valuta','consolidatie-nvw','consolidatie-hk'].flatMap(x=>['fragments/'+x+'.html','fallback/'+x+'.html'])];
const digest=()=>paths.map(p=>crypto.createHash('sha256').update(read(p)).digest('hex')).join();
const before=digest();child.execFileSync(process.execPath,['scripts/build-study-upgrade.mjs']);assert.equal(digest(),before,'Study build is idempotent');
console.log('Study upgrade verified: 40 topic rationales, 120 exercise links, 131 exam explanations, 74 statutes, source pages, default automatic theme and reproducible output.');

// Cloudflare serves clean URLs. Both canonical and local HTML paths must restore.
const shell=read('js/study-shell.js');
const localFunction=shell.slice(shell.indexOf('  function localURL('),shell.indexOf('  function label()'));
const navBox={URL,location:{href:'https://cafa2.pages.dev/samenvatting#begrippen',origin:'https://cafa2.pages.dev'}};
vm.runInNewContext(localFunction+';this.resolveStudyURL=localURL;',navBox);
for(const url of ['/#oefenen','/samenvatting#begrippen','/samenvatting.html#bronnen','/index#voortgang','/index.html#voortgang','/fallback/vreemde-valuta','/fallback/vreemde-valuta.html'])assert.ok(navBox.resolveStudyURL(url),url);
for(const url of ['https://example.com/samenvatting','/samenvatting?token=test','/data/config.js']) {
 assert.equal(navBox.resolveStudyURL(url),null,url);
}
console.log('Navigation accepts canonical Pages URLs and local HTML routes, while rejecting external and unrelated URLs.');
