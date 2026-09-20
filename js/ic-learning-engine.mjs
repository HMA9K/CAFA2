/* CAFA2 syllabusmethodiek. Geen generieke verslaggevingsengine.
   Bronnen: Syllabus 3 p.64-103,153-185,214-238; college-Excel NAB-HK.
   Voorwaarden: één stroom, constante marge in verkoopprijs, integrale consolidatie,
   winstgevende goederen, geen grondslagverschillen buiten de opgegeven IC-winst. */
export function icScenario(input={}) {
  const x={basis:'NVW',direction:'down',sellerShare:1,buyerShare:.6,stock0:320000,stock1:480000,margin:.2,tax:.25,sales:1200000,year:2025,...input};
  const finite=['sellerShare','buyerShare','stock0','stock1','margin','tax','sales','year'];
  if(finite.some(k=>typeof x[k]!=='number'||!Number.isFinite(x[k])))throw Error('Vul voor alle velden een geldig getal in.');
  if(!['NVW','HK'].includes(x.basis)||!['down','up','side'].includes(x.direction))throw Error('Onbekende waardering of leveringsrichting.');
  if(x.stock0<0||x.stock1<0||x.sales<0||x.margin<0||x.margin>=1||x.tax<0||x.tax>=1)throw Error('Voorraden en leveringen mogen niet negatief zijn; marge en belasting moeten tussen 0% en 100% liggen.');
  if(x.sellerShare<=0||x.sellerShare>1||x.buyerShare<=0||x.buyerShare>1)throw Error('Een deelnemingspercentage moet groter dan 0% en maximaal 100% zijn.');
  if(x.direction==='down')x.sellerShare=1;
  if(x.direction==='up')x.buyerShare=1;
  if(x.direction==='side'&&x.basis==='HK'&&x.sellerShare>x.buyerShare)throw Error('Voor HK-sidestream met afnemend belang is in deze revisie geen afzonderlijke bronuitwerking vastgesteld. De rekentool genereert hiervoor geen onbevestigde journaalposten.');
  const dv=x.stock1-x.stock0;
  if(x.sales+1e-8<Math.max(0,dv))throw Error('De voorraadtoename kan in dit voorbeeld niet groter zijn dan de leveringen van het jaar.');
  const u0=x.stock0*x.margin,u1=x.stock1*x.margin,du=u1-u0,n=1-x.tax;
  const i=x.basis==='HK'?0:x.direction==='down'?x.buyerShare:x.direction==='up'?x.sellerShare:Math.min(x.sellerShare,x.buyerShare);
  const d=x.direction==='down'?0:1-x.sellerShare;
  const a=1-i-d;
  const r=v=>Math.round((v+Number.EPSILON)*100)/100;
  const percent=v=>new Intl.NumberFormat('nl-NL',{maximumFractionDigits:2}).format(v*100)+'%';
  const non=v=>Math.abs(v)<1e-9?'n.v.t.':r(v);
  const headers=['Datum','Voorraad','Niet-gerealiseerde intercompanywinst in voorraad','Interne correctie','Eliminatie t.l.v. aandeel derden','Eliminatie t.l.v. geconsolideerd resultaat'];
  const dataRow=(label,v,u)=>[label,r(v),r(u),i? r(i*u):'n.v.t.',d? r(d*u):'n.v.t.',a>1e-9?r(a*u):'n.v.t.'];
  const rows=[['Percentage','', '100%',percent(i),percent(d),percent(a)],dataRow('31-12-'+(x.year-1),x.stock0,u0),dataRow('31-12-'+x.year,x.stock1,u1),dataRow(du<0?'Afname':du>0?'Toename':'Geen mutatie',dv,du)];
  const blank=[['Percentage','','100%','…%','…%','…%'],['31-12-'+(x.year-1),r(x.stock0),'','','',''],['31-12-'+x.year,r(x.stock1),'','','',''],['Toe-/afname','','','','','']];
  // Signed amounts: positive is debit, negative is credit; negative changes reverse the entry.
  function journal(title,entries){const v=entries.filter(e=>Math.abs(e[1])>1e-8).map(([label,amount])=>[label,amount>0?r(amount):'',amount<0?r(-amount):'']);const sum=v.reduce((s,row)=>s+(Number(row[1])||0)-(Number(row[2])||0),0);if(Math.abs(sum)>.031)throw Error('Afronding veroorzaakt een niet-sluitende journaalpost. Gebruik minder decimalen in de invoer.');return {title,rows:v};}
  let internal=[];
  if(x.basis==='NVW'&&i&&du){
    if(x.direction==='down'){
      const winst=du<0?'9.. Gerealiseerde winst op transacties met deelnemingen':'9.. Niet-gerealiseerde winst op transacties met deelnemingen';
      internal.push(journal('M: interne winstmutatie',[[winst,i*du],['1.. Overlopende passiva',-i*du]]));
      internal.push(journal('M: belasting over de interne winstmutatie',[['0.. Voorziening belastingen (debetcorrectie)',i*du*x.tax],['9.. Belastinglast',-i*du*x.tax]]));
    }else internal.push(journal('M: correctie op de verkopende deelneming',[['9.. Resultaat deelneming verkoper',i*du*n],['0.. Deelneming verkoper',-i*du*n]]));
  }
  let balanceEntries=[];
  if(i){
    if(x.direction==='down')balanceEntries.push(['Overlopende passiva',i*u1]);
    else balanceEntries.push(['Deelneming verkoper',i*u1*n],['Voorziening belastingen (debetcorrectie)',i*u1*x.tax]);
  }
  if(d)balanceEntries.push(['Belang derden',d*u1*n],['Voorziening belastingen (derden)',d*u1*x.tax]);
  if(a>1e-9)balanceEntries.push(['Resultaat boekjaar (aanvullend meerderheidsdeel)',a*u1*n],['Voorziening belastingen (aanvullend)',a*u1*x.tax]);
  balanceEntries.push(['Voorraad bij koper',-u1]);
  const balance=[journal('Geconsolideerde balans: eindwinst uitvoegen',balanceEntries)];
  if(a>1e-9&&u0)balance.push(journal('Geconsolideerde balans: aanvullende beginwinst invoegen',[['Overige reserves',a*u0*n],['Resultaat boekjaar',-a*u0*n]]));
  const income=[];
  const delivered=dv>=0?x.sales-dv:x.sales;
  income.push(journal(dv>=0?'W&V: doorgeleverd deel':'W&V: onderlinge omzet',[['Omzet',delivered],['Kostprijs van de omzet',-delivered]]));
  const resultEntries=dv>=0?[['Omzet (voorraadtoename tegen onderlinge prijs)',dv],['Kostprijs van de omzet',-(dv-du)]]:[['Kostprijs van de omzet',du]];
  if(i){
    if(x.direction==='down')resultEntries.push([du<0?'Gerealiseerde winst op transacties met deelnemingen':'Niet-gerealiseerde winst op transacties met deelnemingen',-i*du]);
    else resultEntries.push(['Resultaat na belastingen verkoper (aansluiting basiseliminatie)',-i*du*n],['Belastinglast (intern aansluitingsdeel)',-i*du*x.tax]);
  }
  if(d)resultEntries.push(['Aandeel derden',-d*du*n],['Belastinglast (derden)',-d*du*x.tax]);
  if(a>1e-9)resultEntries.push(['Resultaat na belastingen (aanvullend meerderheidsdeel)',-a*du*n],['Belastinglast (aanvullend)',-a*du*x.tax]);
  income.push(journal(dv>=0?'W&V: voorraadtoename':'W&V: vrijval van ongerealiseerde winst',resultEntries));
  const variant=x.direction==='side'?(x.sellerShare>x.buyerShare?'Sidestream afnemend belang':'Sidestream niet-afnemend belang'):x.direction==='down'?'Downstream':'Upstream';
  return {input:x,variant,headers,rows,blank,allocation:{internal:i,third:d,additional:a},u0:r(u0),u1:r(u1),change:r(du),internal,balance,income,
    controls:{stockReduction:r(u1),internalResultChange:r(-i*du*n),additionalMajorityResultChange:r(-a*du*n),thirdResultChange:r(-d*du*n),totalMajorityResultChange:r(-(i+a)*du*n)},
    precondition:x.basis==='NVW'&&x.direction!=='down'?'Combineer deze IC-posten met de syllabus-basiseliminatie: in de balans wordt het aandeel in het eigen vermogen vóór IC tegenover deelneming geëlimineerd, waarna deze IC-post het interne deel terugneemt. In de W&V wordt eerst het werkelijk bij M geboekte resultaat deelnemingen geëlimineerd; het interne aansluitingsdeel in de goederenpost gebruikt daarom Resultaat na belastingen verkoper.':'De interne boekingen, indien van toepassing, zijn vóór de consolidatie gemaakt. De deelnemings- en eigenvermogenseliminatie is een afzonderlijke basisstap.',
    source:x.direction==='side'?(x.basis==='HK'?'College-Excel, Sidestream NAB toename, HK-kolommen K:S.':'Syllabus Deel 3, §8.1, p. 214–238.'):(x.basis==='NVW'?(x.direction==='down'?'Syllabus Deel 3, §4.2.1 en §4.3.1, p. 64–73 en 85–94.':'Syllabus Deel 3, §4.2.2 en §4.3.2, p. 74–84 en 95–103.'):(x.direction==='down'?'Syllabus Deel 3, §6.2.1 en §6.3.1, p. 153–158 en 166–175.':'Syllabus Deel 3, §6.2.2 en §6.3.2, p. 159–165 en 176–185.'))};
}
