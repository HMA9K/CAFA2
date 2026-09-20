import fs from 'node:fs';
const edit=(path,fn)=>{const old=fs.readFileSync(path,'utf8'),next=fn(old);if(next!==old)fs.writeFileSync(path,next);};
edit('scripts/build-learning-revision.mjs',s=>{
 if(!s.includes("import '../content/summary/addenda.mjs';"))s="import '../content/summary/addenda.mjs';\n"+s;
 s=s.replace('<b>Patroonherkenning<\\/b>','<b>(?:Patroonherkenning|Herken het patroon)<\\/b>');
 s=s.replace('href="index.html#dashboard">Home</a>','href="index.html#start">Home</a>');
 const marker='q.task=p.task;q.guidance=p;';
 if(!s.includes('q.intro=independentIntro'))s=s.replace(marker,"const independentIntro={val:{17:'De hieronder volledig beschreven partij wordt op 31 december afgewaardeerd. Bepaal de afwaarderingslast volgens de tijdstipmethode.'},nvw:{30:'Gebruik de vier afzonderlijke goederenstromen in de casustabel bij deze vraag. Bereken het definitieve aandeel derden na alle goedereneliminaties.'},hk:{30:'Rond de consolidatie van Moer af met de volledige gegevens en beide casustabellen bij deze vraag.'}};q.intro=independentIntro[code]?.[q.id]||q.intro;"+marker);
 return s;
});
edit('content/summary/glossary.mjs',s=>s.replace("'Wisselkoers op de balansdatum.'","'De wisselkoers die geldt op de datum van de balans en voor de daarvoor aangewezen eindstanden wordt gebruikt.'"));
edit('tests/content-revision.mjs',s=>s.replace('(text.match(/class="pattern learning-pattern"/g)||[]).length,1','(text.match(/class="pattern learning-pattern"/g)||[]).length,2').replace('caseCount>=50','caseCount>=45'));
edit('tests/revision-browser.py',s=>{
 s=s.replace("await q.locator('.learning-pattern p').count()==3","await q.locator('.learning-pattern p').count()==6");
 const before="        for code in ['kap','val','nvw','hk']:";
 if(!s.includes('PRACTICE BOOT'))s=s.replace(before,"        print('PRACTICE BOOT', await page.evaluate(\"JSON.stringify({url:location.href,body:document.body.className,target:document.querySelector(':target')?.id,errors:[]})\"),flush=True)\n"+before);
 return s;
});
edit('tests/summary-ui.mjs',s=>{
 s=s.replace("assert.equal((summary.match(/data-lesson=/g) || []).length, 12, 'Samenvatting bevat twaalf lessen');","assert.equal((summary.match(/data-lesson=/g) || []).length, 45, '40 inhoudelijke hoofdstukken en vijf hulpmiddelpagina’s');");
 const begin=s.indexOf("for (const code of ['kap', 'val', 'nvw', 'hk']) {");
 if(begin>=0){const end=s.indexOf('\n}',begin)+2;s=s.slice(0,begin)+"assert.match(theoryJs, /q\\.guidance/, 'Basisregels volgen de expliciete inhoud per vraag, niet nummerreeksen');"+s.slice(end);}
 return s;
});
edit('js/ic-learning-engine.mjs',s=>s.replace('Math.abs(sum)>.031','Math.abs(sum)>.005'));
edit('js/bootstrap.js',s=>{
 if(s.includes('Restore an existing question deep link after'))return s;
 const anchor="      if(root.CafaStartup)root.CafaStartup.finish();\n";
 if(!s.includes(anchor))throw Error('Het gecontroleerde bootstrap-aansluitpunt ontbreekt.');
 return s.replace(anchor,anchor+`      // Restore an existing question deep link after asynchronous fragments exist.
      // Replacing the URL avoids adding an extra navigation-history entry.
      var initialHash = location.hash;
      if (/^#(?:kap|val|nvw|hk)-[0-9]+$/.test(initialHash) && document.getElementById(initialHash.slice(1)) && !document.querySelector('.question:target')) {
        history.replaceState(history.state, '', location.pathname + location.search);
        location.replace(initialHash);
      }
`);
});
console.log('Idempotente migratie van de bronstructuur en kwaliteitscontroles gereed.');
