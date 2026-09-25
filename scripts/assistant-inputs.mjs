/** The browser and server must use the same complete set of CAFA2 data files. */
import {readdir,readFile} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {readdirSync,readFileSync} from 'node:fs';

export async function listAssistantDataScripts(root,html){
  const scripts=[...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)]
    .map(match=>match[1].split('?')[0]).filter(src=>src.startsWith('data/'));
  if(!scripts.length)throw new Error('Geen CAFA2-databestanden gevonden.');
  const seen=new Set();
  for(const script of scripts){
    if(!/^data\/[a-zA-Z0-9._/-]+\.js$/.test(script)||script.split('/').includes('..'))
      throw new Error(`Onveilig databestand: ${script}`);
    if(seen.has(script))throw new Error(`Databestand wordt tweemaal geladen: ${script}`);
    seen.add(script);
  }
  const available=[];
  async function collect(directory,relative){
    for(const entry of await readdir(directory,{withFileTypes:true})){
      const name=`${relative}/${entry.name}`;
      if(entry.isSymbolicLink())throw new Error(`Symbolische link in data/: ${name}`);
      if(entry.isDirectory())await collect(path.join(directory,entry.name),name);
      else if(entry.isFile()&&entry.name.endsWith('.js'))available.push(name);
    }
  }
  await collect(path.join(root,'data'),'data');
  const missing=available.filter(file=>!seen.has(file));
  if(missing.length)throw new Error(`Nieuw databestand ontbreekt in index.html en de assistentcatalogus: ${missing.join(', ')}`);
  return scripts;
}

export async function assistantInputHashes(root,scripts){
  const hashes={};
  for(const script of scripts){
    const code=await readFile(path.join(root,script),'utf8');
    hashes[script]=createHash('sha256').update(code).digest('hex');
  }
  return hashes;
}

/** A changed authoring file must never be served with yesterday's generated MC bank. */
export function practiceAuthoringHash(root){
  const authored=readdirSync(path.join(root,'content/practice'))
    .filter(name=>/^new-.*\.json$/.test(name)).sort().map(name=>`content/practice/${name}`);
  const files=[
    'content/practice/topics.json','content/practice/topic-groups.json',
    'content/practice/topic-guidance.json','content/practice/existing-map.json',
    'content/practice/question-registry.json','docs/mc-audit/exam-frequency.json',
    'data/config.js','data/kapitaalbelangen.js','data/vreemde-valuta.js',
    'data/consolidatie-nvw.js','data/consolidatie-hk.js',...authored
  ];
  const hash=createHash('sha256');
  for(const file of files){hash.update(file);hash.update('\0');hash.update(readFileSync(path.join(root,file)));hash.update('\0');}
  return hash.digest('hex');
}
