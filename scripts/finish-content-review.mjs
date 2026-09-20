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
 if(!s.includes('Given stock tables for journal follow-ups')){
  const anchor='  return out;\n}';
  if(!s.includes(anchor))throw Error('Retourpunt voor casuscontexten ontbreekt.');
  s=s.replace(anchor,`  // Given stock tables for journal follow-ups; table-construction tasks stay blank.
  // These parameters were checked against each existing question's stated facts.
  if((code==='nvw'||code==='hk') && q.type!=='Voorraadtabel'){
    const stock=out.find(t=>t.headers.length===6 && t.headers[1]==='Voorraad');
    if(stock){
      let settings;
      if(code==='hk')settings=id<=20?{basis:'HK',direction:'up',sellerShare:.75,margin:.2,tax:.2}:{basis:'HK',direction:'down',buyerShare:.75,margin:.2,tax:.2};
      else if(id<=10)settings={basis:'NVW',direction:'down',buyerShare:.8,margin:.2,tax:.25};
      else if(id<=15)settings={basis:'NVW',direction:'up',sellerShare:.75,margin:.25,tax:.25};
      else if(id<=19)settings={basis:'NVW',direction:'side',sellerShare:.7,buyerShare:.9,margin:.2,tax:.25};
      else settings={basis:'NVW',direction:'side',sellerShare:.9,buyerShare:.7,margin:.3,tax:.2};
      const given=icScenario({...settings,stock0:stock.rows[1][1],stock1:stock.rows[2][1]});
      stock.rows=given.rows.map(r=>r.slice());stock.rows[1][0]='Begin boekjaar';stock.rows[2][0]='Einde boekjaar';
      stock.caption='Ingevulde voorraadtabel bij deze zelfstandige casus';
      stock.note='Gebruik deze hulptabel voor de gevraagde boeking of aansluiting. Alle winst- en correctiebedragen zijn vóór belasting; de mutatie is eindstand minus beginstand.';
      stock.completed=true;
    }
  }
`+anchor);
 }
 return s;
});
edit('tests/summary-ui.mjs',s=>s.replace('/panel\\.open = false/','/panel\\.open\\s*=\\s*false/'));
edit('tests/content-revision.mjs',s=>{
 s=s.replace('caseCount>=45','caseCount>=47');
 if(!s.includes('Elke verwijzing naar een gegeven tabel'))s=s.replace('assert.equal(total,120);',"for(const m of Object.values(c.window.CAFA2_DATA.modules))for(const q of m.questions)if(/(?:de|een) (?:casus)?tabel/.test(q.task))assert.ok(q.caseTables.length,'Elke verwijzing naar een gegeven tabel heeft een eigen tabel: '+m.title+' '+q.id);\nassert.equal(total,120);");
 if(!s.includes('completedStockCount'))s=s.replace('assert.equal(total,120);',`let completedStockCount=0;
for(const m of Object.values(c.window.CAFA2_DATA.modules))for(const q of m.questions)for(const t of q.caseTables){
 if(t.completed){completedStockCount++;assert.notEqual(q.type,'Voorraadtabel');for(const row of t.rows.slice(1))assert.ok(Math.abs(row[2]-row.slice(3).reduce((sum,n)=>sum+(Number(n)||0),0))<.005,'Stock allocation reconciles: '+q.id);}
 if(q.type==='Voorraadtabel')assert.ok(!t.completed,'No solution disclosed for table-construction tasks');
}
assert.equal(completedStockCount,23);
assert.equal(total,120);`);
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
console.log('Laatste inhoudscontrole: zelfstandige tabellen, ingevulde vervolgcasussen, visuele IC-routes en interactiecontroles.');
