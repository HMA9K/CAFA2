import fs from 'node:fs';
const edit=(path,fn)=>{const old=fs.readFileSync(path,'utf8'),next=fn(old);if(next!==old)fs.writeFileSync(path,next);};
edit('scripts/build-learning-revision.mjs',s=>{
 if(!s.includes("import {visualStyles} from '../content/summary/visuals.mjs';"))s="import {visualStyles} from '../content/summary/visuals.mjs';\n"+s;
 s=s.replace("write('css/summary.css',read('content/summary/styles.css'));","write('css/summary.css',read('content/summary/styles.css')+visualStyles);");
 if(!s.includes('Zelfstandige aandelentabel bij deze vraag')){
  const anchor="  if(code==='nvw'){";
  if(!s.includes(anchor))throw Error('Casustabel-aansluitpunt ontbreekt.');
  s=s.replace(anchor,`  if(code==='kap' && [24,25].includes(id))out.push({caption:'Zelfstandige aandelentabel bij deze vraag',headers:['Aandelensoort','Geplaatst','In bezit van Merwede'],rows:[['Stem- en winstrecht',400,190],['Alleen stemrecht',200,130],['Alleen winstrecht',400,150]],note:'Gewone en uitsluitend winstgerechtigde aandelen hebben in deze casus gelijke winstrechten. Bereken het gevraagde percentage voor deze vraag afzonderlijk.'});\n`+anchor);
 }
 return s;
});
edit('tests/summary-ui.mjs',s=>s.replace('/panel\\.open = false/','/panel\\.open\\s*=\\s*false/'));
edit('tests/content-revision.mjs',s=>{
 s=s.replace('caseCount>=45','caseCount>=47');
 if(!s.includes('Elke verwijzing naar een gegeven tabel'))s=s.replace("assert.equal(total,120);",`for(const m of Object.values(c.window.CAFA2_DATA.modules))for(const q of m.questions)if(/(?:de|een) (?:casus)?tabel/.test(q.task))assert.ok(q.caseTables.length,'Elke verwijzing naar een gegeven tabel heeft een eigen tabel: '+m.title+' '+q.id);\nassert.ok(summaryPlaceholderNotNeeded());\nfunction summaryPlaceholderNotNeeded(){return true;}\nassert.equal(total,120);`).replace("assert.ok(summaryPlaceholderNotNeeded());\nfunction summaryPlaceholderNotNeeded(){return true;}\n",'');
 return s;
});
edit('tests/revision-browser.py',s=>{
 if(!s.includes('Basisregels moeten bij ieder nieuw bezoek dicht staan'))s=s.replace("                await panel.evaluate('(x)=>x.open=true')","                assert await panel.get_attribute('open') is None, 'Basisregels moeten bij ieder nieuw bezoek dicht staan: '+qid\n                await panel.evaluate('(x)=>x.open=true')");
 if(!s.includes("report['answer_persistence']"))s=s.replace("        for width in [320,390,1024,1440]:",`        # Exercise real answer selection in an isolated browser, then navigate and reload.
        await page.evaluate("location.hash='kap-1'")
        await page.locator('#kap-1').wait_for(state='visible')
        await page.locator('#option-kap-1-0').click()
        await page.evaluate("location.hash='kap-2'")
        await page.locator('#kap-2').wait_for(state='visible')
        await page.reload(wait_until='networkidle')
        await page.wait_for_function("!!window.CafaPractice && !document.documentElement.classList.contains('cafa-starting')")
        assert await page.evaluate("window.CafaPractice.getAnswer('kap',1).choice") == 0
        await page.evaluate("location.hash='kap-1'")
        await page.locator('#kap-1').wait_for(state='visible')
        assert await page.locator('#a-kap-1-0').is_checked()
        report['answer_persistence']=True
        for width in [320,390,1024,1440]:`);
 s=s.replace("[(1440,'start'),(1440,'kernschema')","[(1440,'start'),(1440,'streams'),(1440,'kernschema')");
 return s;
});
console.log('Laatste inhoudscontrole: aandelentabellen, visuele IC-routes en interactiecontroles toegevoegd.');
