/* Chapter orientation and exam-specific study routes, derived from supplied CAFA2 material. */
import {esc} from '../summary/helpers.mjs';

export const orientation = {
 'kapitaalbelangen': {
  need:['Het onderscheid tussen een rechtspersoon, vennootschap en natuurlijk persoon. Dit hoofdstuk licht de gevolgen daarvan toe.','Een <a href="#flex-aandelen">aandeel kan stemrecht én winstrecht geven</a>; die percentages hoeven niet gelijk te zijn.'],
  learn:['<a href="#kwalificatie">Deelneming en belegging</a>, <a href="#dochter">dochtermaatschappij</a> en <a href="#consolidatieplicht">groepsverband</a> afzonderlijk beoordelen.','Van invloed van betekenis naar de passende <a href="#waardering">waarderingsgrondslag</a> redeneren.'],
  source:'Syllabus Deel 1, p. 4–19; art. 2:24a–24d en 2:389 BW.'
 },
 'verwerking-kapitaalbelangen': {
  need:['De <a href="#waardering">gekozen waarderingsgrondslag</a> en het belangpercentage van de houder.','Het verband tussen balans, resultaat en een journaalpost, en het onderscheid tussen beginstand en jaarmutatie.'],
  learn:['De aankoop uitsplitsen in <a href="#fair-value">grondslagverschillen</a> en <a href="#goodwill">goodwill</a>.','De deelnemingswaarde laten aansluiten via <a href="#resultaat-deelneming">resultaat</a>, <a href="#dividend">dividend</a> en overige mutaties.','<a href="#wettelijke-reserve">Wettelijke reserves</a>, eigen aandelen en een <a href="#stelselwijziging">stelselwijziging</a> verwerken.'],
  source:'Syllabus Deel 1, p. 15–30; art. 2:389 leden 2–3 en 6–7 BW.'
 },
 'vreemde-valuta': {
  need:['Balansposten en resultaten onderscheiden; bij iedere berekening een bedrag, valuta en datum noteren.','Voor de verwerking bij de moeder: het <a href="#resultaat-deelneming">verloop van een deelneming</a> kunnen volgen.'],
  learn:['<a href="#valuta">Lokale, functionele en presentatievaluta</a> onderscheiden en daaruit de methode afleiden.','Koersen toewijzen aan <a href="#tijdstipmethode">monetaire en niet-monetaire posten</a>, voorraadlagen en waardeverminderingen.','Het verschil tussen <a href="#monetaire-positie">koersresultaat</a> en <a href="#omrekenreserve">omrekeningsreserve</a> verklaren en narekenen.'],
  source:'Syllabus Deel 2, §2–4, p. 4–9; art. 2:384 lid 5 en 2:389 lid 8 BW.'
 },
 'consolidatieproces': {
  need:['De <a href="#dochter">dochtertoets</a>, <a href="#kwalificatie">deelnemingstoets</a> en het groepsbegrip uit hoofdstuk 1.','Een enkelvoudige balans en winst-en-verliesrekening kunnen lezen.'],
  learn:['De <a href="#consolidatieplicht">consolidatieplicht en consolidatiekring</a> met de wet onderbouwen.','Begrijpen waarom je eerst gelijksoortige cijfers samenvoegt en vervolgens <a href="#onderlinge-posten">onderlinge verhoudingen elimineert</a>.','<a href="#streams">Downstream, upstream en sidestream</a> herkennen vóór je een correctie berekent.'],
  source:'Syllabus Deel 1, p. 31–37; Deel 3, p. 5–7; art. 2:405–409 BW.'
 },
 'consolidatie-nettovermogenswaarde': {
  need:['De enkelvoudige <a href="#resultaat-deelneming">NVW-verwerking</a> en de stappen van het <a href="#proces">consolidatieproces</a>.','De <a href="#streams">richting van de levering</a>, begin- en eindvoorraad, interne marge en toepasselijke belasting.'],
  learn:['De <a href="#voorraadtabel">voorraadtabel</a> gebruiken om de totale IC-winst en de verschillende correcties te scheiden.','De <a href="#downstream-nvw">downstream-</a> en <a href="#upstream-nvw">upstreamcorrectie</a> enkelvoudig én geconsolideerd verwerken.','Eindstanden voor de balans onderscheiden van mutaties voor het resultaat en dubbeltelling voorkomen.'],
  source:'Syllabus Deel 3, §3–4, p. 8–103; art. 2:384 lid 2, 2:389 en 2:405 BW.'
 },
 'consolidatie-verkrijgingsprijs': {
  need:['De <a href="#waardering">verkrijgingsprijsmethode</a> onderscheiden van NVW.','Het <a href="#consolidatieproces">consolidatieproces</a>, de leveringsrichting en het belang van derden.'],
  learn:['Verklaren waarom de correcties bij <a href="#consolidatie-hk">verkrijgingsprijs</a> anders over de werkbladen zijn verdeeld dan bij NVW.','Deelneming, derdenbelang, goodwill, dividend en <a href="#upstream-hk">IC-resultaten</a> in de consolidatie verwerken.','Het groepsresultaat laten aansluiten op het <a href="#resultaataansluiting">meerderheidsresultaat en het resultaat derden</a>.'],
  source:'Syllabus Deel 3, §5–6, p. 104–185; art. 2:405, 2:411 lid 2 en 2:413 BW.'
 },
 'bijzondere-consolidatie': {
  need:['De basis van <a href="#consolidatie-nettovermogenswaarde">NVW-</a> en <a href="#consolidatie-verkrijgingsprijs">HK-consolidatie</a>.','Interne winst in begin- en eindvoorraad en de afzonderlijke belangen in verkoper en koper.'],
  learn:['<a href="#proportioneel">Proportionele consolidatie</a> onderscheiden van integrale consolidatie.','Bij <a href="#sidestream">sidestream</a> toenemend en afnemend belang uit elkaar houden.','IC-winst op <a href="#mva">materiële vaste activa</a> en de latere realisatie via afschrijving volgen.'],
  source:'Syllabus Deel 3, §7–8, p. 186–248; art. 2:409 BW.'
 }
};
export function orientationHtml(id) {
 const o=orientation[id]; if(!o)throw Error('Geen hoofdstukoriëntatie: '+id);
 return '<div class="chapter-orientation"><section><h2>Dit heb je nodig</h2><ul>'+o.need.map(t=>'<li>'+t+'</li>').join('')+'</ul></section><section><h2>Dit ga je leren</h2><ul>'+o.learn.map(t=>'<li>'+t+'</li>').join('')+'</ul></section><p class="study-note-source">Leeswijzer afgeleid uit '+esc(o.source)+'</p></div>';
}

export const examRoutes=[
 {id:'stemrecht',topic:'kap',label:'Kapitaalbelangen',title:'Niet één percentage, maar het juiste recht',exam:'cafa2-20250924',date:'24 september 2025',questions:'7 en 8a',pages:'4',
  task:'Vraag 7 vraagt met de wet te motiveren of Bosa een dochtermaatschappij is. Vraag 8a vraagt vervolgens om de dividendboeking bij NVW.',
  steps:[['Lees het gevraagde recht.','De dochtertoets draait hier om stemmen. Het model noemt 55% geplaatst kapitaal, maar berekent het stemrecht afzonderlijk: 380 ÷ 700 = 54,3%.'],['Pas de norm toe.','Het model werkt expliciet met Norm, Motivering en Conclusie. Meer dan de helft van de stemmen leidt in deze casus tot een dochtermaatschappij (art. 2:24a lid 1 onder a BW).'],['Bereken het dividend met het winstrecht.','Vraag 8a gebruikt 480 ÷ 1.000 = 48%. Het dividend is dus 48% × € 100.000 = € 48.000; bij NVW boekt het model Bank/Te vorderen dividend aan Deelneming Bosa.']],
  check:'Controleer welke noemer bij het gevraagde recht hoort. 55% kapitaal, 54,3% stemmen en 48% winstrecht zijn in dezelfde casus verschillende gegevens.',lesson:'flex-aandelen'},
 {id:'stelsel',topic:'kap',label:'Kapitaalbelangen',title:'Stelselwijziging: houd de aankooplagen uit elkaar',exam:'cafa2-20240930',date:'30 september 2024',questions:'3 en 4',pages:'4',
  task:'Het antwoordmodel verwerkt de overgang naar waardering tegen zichtbaar eigen vermogen en berekent daarna de totale boekwaarde van de deelneming.',
  steps:[['Scheid het eerder gekochte en het later gekochte belang.','Voor het 35%-belang stijgt de boekwaarde van € 400.000 naar 35% × € 1.600.000 = € 560.000. Het verschil van € 160.000 wordt in het model aan Overige reserves toegevoegd.'],['Zonder de goodwill uit de latere aankoop af.','Bij de 25%-aankoop is de goodwill € 275.000. Na € 27.500 afschrijving resteert € 247.500. De waarde zonder goodwill stijgt van € 350.000 naar € 400.000. Het model boekt daarom € 22.500 naar Overige reserves: € 50.000 vermogenssprong minus € 27.500 afschrijving. Deelneming neemt per saldo € 225.000 af.'],['Sluit de eindwaarde onafhankelijk aan.','Vraag 4 controleert de totale deelneming op 60% × € 1.600.000 = € 960.000. De boekwaardebrug geeft hetzelfde: € 400.000 + € 160.000 + € 625.000 − € 225.000.']],
  check:'Een gemiddeld aankoopbedrag verhult hier welke goodwill en vermogensaanpassing bij welke aankooplaag hoort.',lesson:'stelselwijziging'},
 {id:'monetair',topic:'val',label:'Vreemde valuta',title:'Tijdstipmethode: bouw de monetaire positie op',exam:'cafa2-20250417',date:'17 april 2025',questions:'11',pages:'8',
  task:'Vraag 11 verlangt een gespecificeerde berekening van het koersverschil en vraagt expliciet of het resultaat positief of negatief is.',
  steps:[['Bepaal de monetaire beginpositie.','Het model telt debiteuren en liquide middelen op en trekt lening en crediteuren af: USD −1.192.000. Tegen 0,87 is dat € −1.037.040.'],['Verwerk de mutaties tegen de bijbehorende koersen.','De tabel verwerkt onder meer inkopen, verkopen, kosten, rente, desinvestering en afwaardering. De monetaire positie komt theoretisch uit op USD −115.000 en € −30.550.'],['Vergelijk met de werkelijke eindpositie tegen slotkoers.','USD −115.000 × 0,97 = € −111.550. Het verschil met € −30.550 bedraagt € −81.000: het model neemt dit op als koersverlies in de winst-en-verliesrekening.']],
  check:'Het koersverschil volgt uit twee waarderingen van dezelfde monetaire eindpositie. Alleen de gehele balans tegen slotkoers omrekenen levert deze specificatie niet op.',lesson:'monetaire-positie'},
 {id:'slotkoers',topic:'val',label:'Vreemde valuta',title:'Slotkoersmethode: scheid resultaat en reserve',exam:'cafa2-20250417',date:'17 april 2025',questions:'13 en 14',pages:'9',
  task:'Vraag 13 vraagt het deelnemingsverloop en een gespecificeerd omrekeningsverschil. Vraag 14 vraagt de bijbehorende journaalposten.',
  steps:[['Zet de vermogensbrug neer.','Beginvermogen: USD 2.000.000 × 0,87 = € 1.740.000. Resultaat: USD 400.000 × 0,93 = € 372.000. De voorlopige eindwaarde is € 2.112.000.'],['Specificeer het omrekeningsverschil.','Op het beginvermogen: USD 2.000.000 × (0,97 − 0,87) = € 200.000. Op het resultaat: USD 400.000 × (0,97 − 0,93) = € 16.000. Samen: € 216.000.'],['Laat de journaalpost aansluiten.','De eindwaarde wordt € 2.328.000. Het model boekt Deelneming Glacier debet € 588.000, aan Resultaat deelneming € 372.000 en aan Reserve omrekeningsverschillen € 216.000.']],
  check:'Het verschil van € 216.000 hoort in deze uitwerking bij de omrekeningsreserve, niet bij het resultaat uit de monetaire-positiebrug van vraag 11.',lesson:'omrekenreserve'},
 {id:'nvw',topic:'nvw',label:'NVW-consolidatie',title:'Voorraadtabel: eindstand is niet de jaarmutatie',exam:'cafa2-20240422',date:'22 april 2024',questions:'16, 17 en 19',pages:'10–11',
  task:'Vraag 16 vraagt de sidestreamvoorraadtabel, vraag 17 de intracomptabele correctie en vraag 19 de balanseliminaties.',
  steps:[['Vul begin én einde in en bepaal de mutatie.','Het model geeft € 25.000 IC-winst in de beginvoorraad en € 75.000 in de eindvoorraad. De interne correctiekolom is 70%: € 17.500 en € 52.500. De toename is € 35.000.'],['Gebruik de mutatie voor de interne jaarboeking.','Vraag 17 gebruikt € 35.000 × 80% = € 28.000 na 20% belasting. Het model boekt Resultaat uit deelnemingen aan Deelneming Adoorn. Dit is een enkelvoudige boeking bij de moeder.'],['Gebruik de eindstand voor de geconsolideerde balans.','Vraag 19 elimineert de volledige € 75.000 eindvoorraadwinst. Daarbinnen is € 52.500 de interne correctie, gesplitst in € 42.000 Deelneming en € 10.500 belastingvoorziening; derden en aanvullend resultaat worden apart verwerkt.']],
  check:'Bij vraag 17 gaat het om € 35.000 mutatie vóór belasting; bij de deelnemingscomponent in vraag 19 om € 52.500 eindstand vóór belasting. Dat verschil wordt door de gevraagde werklaag en datum veroorzaakt.',lesson:'sidestream-ab'},
 {id:'hk',topic:'hk',label:'HK-consolidatie',title:'Bij HK is de interne-correctiekolom hier leeg',exam:'cafa2-20240422',date:'22 april 2024',questions:'22',pages:'13',
  task:'Vraag 22 vraagt de voorraadtabel voor de upstreamleveringen van Armweide aan Nolde bij waardering tegen verkrijgingsprijs.',
  steps:[['Bereken eerst de volledige ongerealiseerde winst.','Het model geeft € 27.000 in de beginvoorraad en € 42.000 in de eindvoorraad. De toename is € 15.000.'],['Neem geen NVW-correctie over in de enkelvoudige cijfers.','De kolom Interne correctie bij N blijft in dit HK-antwoordmodel leeg. De IC-correctie wordt in de consolidatie verdeeld.'],['Verdeel over derden en geconsolideerd resultaat.','Derden krijgen 20%: € 5.400 begin, € 8.400 einde en € 3.000 toename. De overige 80% is respectievelijk € 21.600, € 33.600 en € 12.000.']],
  check:'De lege kolom is niet een ontbrekend antwoord. De gekozen enkelvoudige grondslag bepaalt welke correctie al in de eigen administratie thuishoort.',lesson:'upstream-hk'},
 {id:'dividend-hk',topic:'hk',label:'HK-consolidatie',title:'Ontvangen dividend: lees de aankoopgegevens mee',exam:'cafa2-20240422',date:'22 april 2024',questions:'20 en 21',pages:'13',
  task:'Vraag 20 verwerkt de verwerving van het 25%-belang. Vraag 21 vraagt vervolgens de boeking van de winstverdeling over 2022.',
  steps:[['Koppel de uitkering aan de aanschafgegevens.','Vraag 20 boekt de deelneming voor € 2.650.000. Vraag 21 verwerkt niet de volledige ontvangst van € 160.000 als opbrengst.'],['Volg de splitsing in het model.','Het model vermindert Deelneming Armweide met 25% × € 200.000 = € 50.000 en verantwoordt het restant van € 110.000 als Dividendopbrengst.'],['Controleer de ontvangst tegen beide tegenrekeningen.','Bank € 160.000 = Deelneming € 50.000 + Dividendopbrengst € 110.000. De kwalificatie van een uitkering vraagt dus meer dan alleen de naam van de waarderingsmethode.']],
  check:'Het leeradvies is de aankoopvoorwaarden naast de dividendvraag te leggen. De exacte modelbedragen zijn geen algemene formule voor ieder HK-dividend.',lesson:'dividend'}
];
export function examRoutePage(){
 return '<section class="summary-page" data-view="tentamen" data-lesson="tentamen" id="tentamen"><div class="summary-kicker">CAFA2 · Tentamenvragen ontleden</div><h1>Tentamenaanpak met concrete voorbeelden</h1><p class="summary-lead">Begin bij wat de vraag werkelijk verlangt. Hieronder zie je per onderwerp hoe een aangeleverd antwoordmodel van gegevens naar berekening of boeking gaat.</p><p class="exam-route-scope">Deze routes zijn afgeleid leeradvies bij <strong>zeven concrete voorbeelden uit vier aangeleverde uitwerkingen</strong> (22-04-2024, 30-09-2024, 17-04-2025 en 24-09-2025). Ze zijn geen officiële stappenplannen en geen frequentieanalyse of voorspelling van een volgend tentamen. De cijfers en modeluitkomsten worden niet vervangen.</p><div class="exam-route-tabs" role="group" aria-label="Voorbeelden per onderwerp">'+[['all','Alles'],['kap','Kapitaalbelangen'],['val','Vreemde valuta'],['nvw','NVW'],['hk','HK']].map(([id,t])=>'<button type="button" data-exam-route-filter="'+id+'" aria-pressed="'+(id==='all')+'">'+t+'</button>').join('')+'</div><p id="exam-route-count" class="study-note-source" role="status">7 concrete voorbeelden</p>'+examRoutes.map((r,i)=>'<article class="exam-route-card" data-exam-route-topic="'+r.topic+'" id="exam-route-'+r.id+'"><span class="exam-example-label">'+esc(r.label)+' · '+esc(r.date)+'</span><h2>'+esc(r.title)+'</h2><p><strong>Wat wordt gevraagd?</strong> '+esc(r.task)+'</p><ol>'+r.steps.map(([title,text])=>'<li><strong>'+esc(title)+'</strong> '+esc(text)+'</li>').join('')+'</ol><p class="exam-route-check"><strong>Wat neem je hiervan mee?</strong> '+esc(r.check)+'</p><p class="exam-route-source">Bron: Uitwerking tentamen CAFA2 '+esc(r.date)+', vraag '+esc(r.questions)+', p. '+esc(r.pages)+'. '+(r.exam==='cafa2-20250924'?'Versie na normering. ':'')+'<a href="index.html#welkom/'+r.exam+'">Open dit tentamen</a> · <a href="#'+r.lesson+'">Bijbehorende samenvatting</a></p></article>').join('')+'</section>';
}
