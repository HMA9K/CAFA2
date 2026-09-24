/** Synthetic integration fixtures. These are not CAFA2 source material. */
export function fixtureWindow(){
  const modules={};
  for(const [i,code] of ['kap','val','nvw','hk'].entries())modules[code]={title:`Testonderwerp ${i+1}`,
    sources:{theory:{label:'TESTBRON §1, p. 2',file:'testbron.txt',pages:'2'}},questions:[
      {id:1,title:'Testkeuze',type:'Theorie',intro:'TESTCASUS: A heeft 100 eenheden.',facts:[['Aantal','100']],caseTables:[],task:'Welke bewerking gebruik je?',
        options:[{text:'100 + 20',why:'SECRET_FEEDBACK'},{text:'100 - 20',why:'SECRET_FEEDBACK'}],correct:0,explanation:['SECRET_MODEL'],pattern:'SECRET_PATTERN',guidance:{rules:'SECRET_GUIDANCE'},refs:['theory']},
      {id:2,title:'Testberekening',type:i%2?'Journaalpost':'Berekening',intro:'Tweede TESTCASUS.',facts:[['Begin','100'],['Mutatie','20']],
        caseTables:[{headers:['Rij','Waarde'],rows:[['A','100']]}],task:'Bereken de testmutatie.',options:[{text:'120',journal:[['Testrekening','120','']],why:'SECRET_FEEDBACK'}],correct:0,explanation:['SECRET_MODEL'],refs:['theory']}
    ]};
  const exam={id:'cafa2-test',title:'TESTTENTAMEN',date:'2026-01-01',introduction:'TESTUITGANGSPUNTEN',
    sections:[{id:'opgave-1',title:'Testopgave',contentHtml:'<p>TESTCASUS 100 eenheden.</p><table><tr><th>Jaar</th><th>Bedrag</th></tr><tr><td>2025</td><td>100</td></tr></table>'}],
    sources:[{title:'test-vragen.txt',kind:'exam'},{title:'test-model.txt',kind:'model-answers'}],sourceNotes:['SECRET_SOURCE_NOTE'],questions:[
      {id:'vraag-1',title:'Testjournaalpost',number:1,type:'open',sectionId:'opgave-1',prompt:'Vul de testjournaalpost in.',solutionHtml:'<p>SECRET_MODEL</p>'},
      {id:'vraag-2',title:'Testvoorraadtabel',number:2,type:'open',sectionId:'opgave-1',prompt:'Vul de testtabel in.',promptHtml:'<p>Vul de testtabel in.</p><table><tr><th>Datum</th><th>Voorraad</th></tr><tr><td>2025</td><td></td></tr></table>',solution:'SECRET_MODEL'},
      {id:'vraag-3',title:'Testopenvraag',number:3,type:'open',sectionId:'opgave-1',prompt:'Leg de testberekening uit.',solution:'SECRET_MODEL'},
      {id:'vraag-4',title:'Testmeerkeuze',number:4,type:'mc',sectionId:'opgave-1',prompt:'Kies de testoptie.',options:[{id:'a',text:'A',correct:true},{id:'b',text:'B'}],correctOptionId:'a',solution:'SECRET_MODEL'}]};
  return {CAFA2_DATA:{modules},CAFA2_EXAMS:[exam]};
}
