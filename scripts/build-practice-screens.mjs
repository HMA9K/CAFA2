import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// Split trusted generated fragments without parsing hundreds of hidden questions into a DOM.
// Matching section boundaries also preserves nested section elements byte for byte.
export function splitQuestions(html) {
  const questions=[],tags=/<\/?section\b[^>]*>/gi;let match,start=-1,depth=0;
  while((match=tags.exec(html))){
    if(/^<\/section/i.test(match[0])){
      if(start>=0&&--depth===0){questions.push({start,end:tags.lastIndex,html:html.slice(start,tags.lastIndex)});start=-1;}
    }else if(start>=0)depth++;
    else if(/class="[^"]*\bquestion\b/.test(match[0])){start=match.index;depth=1;}
  }
  if(start>=0)throw new Error('Onvolledige vraagsectie.');
  return questions;
}
export async function buildPracticeScreens(root){
  const bootstrap=await readFile(path.join(root,'js/bootstrap.js'),'utf8');
  const list=bootstrap.match(/var fragmentPaths = \[([\s\S]*?)\];/);
  if(!list)throw new Error('rraagfragmenten ontbreken in bootstrap.');
  const files=[...list[1].matchAll(/'([^']+)'/g)].map(m=>m[1]);
  const shell=[],manifest={},folder=path.join(root,'fragments/questions');
  await mkdir(folder,{recursive:true});
  for(const file of files){
    const html=await readFile(path.join(root,file),'utf8'),questions=splitQuestions(html);
    if(!questions.length)continue;
    let offset=0,remainder='';
    for(const question of questions){
      const id=question.html.match(/^<section\b[^>]*\bid="((?:kap|val|nvw|hk)-\d+)"/)?.[1];
      if(!id||manifest[id])throw new Error('Dubbele of ontbrekende vraag-ID: '+id);
      const url='fragments/questions/'+id+'.html';
      manifest[id]={url,source:file};await writeFile(path.join(root,url),question.html+'\n');
      remainder+=html.slice(offset,question.start);offset=question.end;
    }
    remainder+=html.slice(offset);if(remainder.trim())shell.push(remainder);
  }
  await writeFile(path.join(root,'fragments/practice-shell.html'),shell.join('\n'));
  await writeFile(path.join(root,'data/practice-screens.json'),JSON.stringify(manifest)+'\n');
  return Object.keys(manifest).length;
}
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log('Vraagschermen: '+await buildPracticeScreens(root));
