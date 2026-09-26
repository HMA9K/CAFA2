import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function loadSources(){
  const ctx={window:{}};vm.createContext(ctx);
  const examFiles=fs.readdirSync(path.join(root,'data')).filter(f=>/^exam-\d{8}\.js$/.test(f)).sort();
  for(const f of ['config.js','kapitaalbelangen.js','vreemde-valuta.js','consolidatie-nvw.js','consolidatie-hk.js','practice-topics.js','exams.js',...examFiles])vm.runInContext(fs.readFileSync(path.join(root,'data',f),'utf8'),ctx);
  return JSON.parse(JSON.stringify({exams:ctx.window.CAFA2_EXAMS,banks:ctx.window.CAFA2_DATA.modules,topics:ctx.window.CAFA2_TOPICS}));
}
if(process.argv.includes('--json'))process.stdout.write(JSON.stringify(loadSources().exams));
if(process.argv.includes('--inventory')){
  const data=loadSources();
  for(const e of data.exams)for(const q of e.questions)console.log(`${e.id}/${q.id} | ${e.sections.find(s=>s.id===q.sectionId).title} | ${q.prompt} | ${q.solution.replace(/\s+/g,' ').slice(-180)}`);
}
