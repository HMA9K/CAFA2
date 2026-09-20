import fs from 'node:fs';
import vm from 'node:vm';
const context={window:{},console}; context.window.CAFA2_DATA={modules:{}}; context.CAFA2_DATA=context.window.CAFA2_DATA; vm.createContext(context);
const names={kap:'kapitaalbelangen',val:'vreemde-valuta',nvw:'consolidatie-nvw',hk:'consolidatie-hk'};
const strip=v=>String(v??'').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
for(const [code,name] of Object.entries(names)){
 if(process.argv[2]&&process.argv[2]!==code) continue;
 vm.runInContext(fs.readFileSync('data/'+name+'.js','utf8'),context);
 const bank=context.window.CAFA2_DATA.modules[code];
 console.log('MODULE '+code+' SOURCES '+JSON.stringify(bank.sources));
 for(const q of bank.questions){
   console.log('\nQUESTION '+q.id+' KEYS '+Object.keys(q).join(','));
   for(const [key,value] of Object.entries(q)){
     if(['options','own','checks','answerHtml'].includes(key)) continue;
     console.log(key+': '+(typeof value==='string'?strip(value):JSON.stringify(value)));
   }
   if(q.options)console.log('OPTIONS '+JSON.stringify(q.options.map(o=>typeof o==='string'?strip(o):o)));
 }
}
