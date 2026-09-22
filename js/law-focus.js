/* Literal source selection: offsets refer only to text in the supplied statute copy. */
(function(root){
 'use strict';
 var cores={
 '24a':{
  '1a':['alleen of samen meer dan de helft van de stemrechten in de algemene vergadering kunnen uitoefenen'],
  '1b':['lid of aandeelhouder zijn','alleen of samen meer dan de helft van de bestuurders of van de commissarissen kunnen benoemen of ontslaan'],
  '2':['onder eigen naam optredende vennootschap','als vennoot volledig jegens schuldeisers aansprakelijk is voor de schulden'],
  '3':['niet toegerekend aan degene die de aandelen voor rekening van anderen houdt','indien deze bevoegd is te bepalen hoe de rechten worden uitgeoefend dan wel zich de aandelen te verschaffen'],
  '4':['toegerekend aan de pandhouder, indien hij mag bepalen hoe de rechten worden uitgeoefend','indien hij deze in eigen belang heeft uitgeoefend']},
 '24b':{'0':['economische eenheid','organisatorisch zijn verbonden']},
 '24c':{'1':['voor eigen rekening','kapitaal verschaffen of doen verschaffen','duurzaam verbonden te zijn ten dienste van de eigen werkzaamheid','Indien een vijfde of meer van het geplaatste kapitaal wordt verschaft, wordt het bestaan van een deelneming vermoed.'],'2a':['als vennoot jegens schuldeisers volledig aansprakelijk is voor de schulden'],'2b':['anderszins vennoot is','duurzaam verbonden te zijn ten dienste van de eigen werkzaamheid']},
 '24d':{'1':['geen rekening gehouden met lidmaatschappen of aandelen','geen stem kan worden uitgebracht'],'2':['In afwijking van lid 1','tevens rekening gehouden met aandelen','geen stem kan worden uitgebracht']},
 '362':{'1':['een zodanig inzicht dat een verantwoord oordeel kan worden gevormd omtrent het vermogen en het resultaat'],'5':['De baten en lasten van het boekjaar worden in de jaarrekening opgenomen, onverschillig of zij tot ontvangsten of uitgaven in dat boekjaar hebben geleid.'],'7':['mag de jaarrekening of alleen de geconsolideerde jaarrekening worden opgesteld in een vreemde geldeenheid']},
 '364':{'1':['naar gelang zij zijn bestemd om de uitoefening van de werkzaamheid van de rechtspersoon al of niet duurzaam te dienen'],'2':['Onder de vaste activa worden afzonderlijk opgenomen de immateriële, materiële en financiële vaste activa.']},
 '365':{'1d':['kosten van goodwill die van derden is verkregen']},
 '373':{'1a':['het geplaatste kapitaal'],'1b':['agio'],'1d':['andere wettelijke reserves, onderscheiden naar hun aard'],'3':['Het kapitaal wordt niet verminderd met het bedrag van eigen aandelen'],'4':['Wettelijke reserves zijn de reserves die moeten worden aangehouden']},
 '374':{'4a':['belastingverplichtingen, die na het boekjaar kunnen ontstaan, doch aan het boekjaar of een voorafgaand boekjaar moeten worden toegerekend']},
 '384':{'1':['de verkrijgings- of vervaardigingsprijs en de actuele waarde'],'2':['Winsten worden slechts opgenomen, voor zover zij op de balansdatum zijn verwezenlijkt.'],'4':['de inhoud, de grenzen en de wijze van toepassing van waardering tegen actuele waarden'],'5':['De grondslagen voor de omrekening van in vreemde valuta luidende bedragen worden uiteengezet; tevens wordt vermeld op welke wijze koersverschillen zijn verwerkt.'],'6':['Slechts wegens gegronde redenen','De reden der verandering wordt in de toelichting uiteengezet.','Tevens wordt inzicht gegeven in haar betekenis voor vermogen en resultaat'],'7c':['onmiddellijk in het resultaat worden opgenomen, tenzij in deze afdeling anders is bepaald']},
 '385':{'2':['gewogen gemiddelde prijzen','"eerst-in, eerst-uit" (Fifo)','"laatst-in, eerst-uit" (Lifo)'],'5':['Eigen aandelen of certificaten daarvan die de rechtspersoon houdt of doet houden, mogen niet worden geactiveerd.','al dan niet evenredig aan het belang','verminderd met de verkrijgingsprijs','hun boekwaarde op dat tijdstip in mindering of een evenredig deel daarvan']},
 '386':{'3':['de geactiveerde kosten van goodwill worden afgeschreven naar gelang van de verwachte gebruiksduur','In uitzonderlijke gevallen waarin de gebruiksduur van kosten van ontwikkeling en goodwill niet op betrouwbare wijze kan worden geschat','ten hoogste tien jaren'],'4':['Op vaste activa met beperkte gebruiksduur wordt jaarlijks afgeschreven volgens een stelsel dat op de verwachte toekomstige gebruiksduur is afgestemd.']},
 '387':{'1':['onafhankelijk van het resultaat van het boekjaar'],'2':['Vlottende activa worden gewaardeerd tegen actuele waarde, indien deze op de balansdatum lager is dan de verkrijgings- of vervaardigingsprijs.'],'3':['indien deze naar verwachting duurzaam is','Bij de waardering van de financiële vaste activa mag in ieder geval met op de balansdatum opgetreden waardevermindering rekening worden gehouden.'],'4':['ten laste van de winst- en verliesrekening gebracht','De afboeking wordt ongedaan gemaakt, zodra de waardevermindering heeft opgehouden te bestaan.'],'5':['De tweede zin van lid 4 geldt niet voor afboekingen van goodwill.']},
 '388':{'1':['omvat de inkoopprijs en de bijkomende kosten']},
 '389':{'1':['invloed van betekenis uitoefent op het zakelijke en financiële beleid','worden verantwoord overeenkomstig de leden 2 en 3','een vijfde of meer van de stemmen','naar eigen inzicht kunnen uitbrengen of doen uitbrengen','wordt vermoed'],'2':['activa, voorzieningen en schulden','haar resultaat te berekenen op de zelfde grondslagen als zijn eigen activa, voorzieningen, schulden en resultaat'],'3':['onvoldoende gegevens ter beschikking staan','een waarde die op andere wijze overeenkomstig deze titel is bepaald','wijzigt hij deze waarde met het bedrag van zijn aandeel in het resultaat en in de uitkeringen'],'6':['aandeel in het positieve resultaat uit deelnemingen en in rechtstreekse vermogensvermeerderingen','cumulatief resultaat sedert die eerste waardering niet positief','uitkeringen die hij zonder beperkingen kan bewerkstelligen, worden eveneens in mindering gebracht','niet begrepen uitkeringen in aandelen'],'7':['lager is dan de verkrijgingsprijs of de voorafgaande boekwaarde van de deelneming, wordt het verschil als goodwill geactiveerd'],'8':['omrekening van het daarin geïnvesteerde vermogen en het resultaat','komen ten gunste respectievelijk ten laste van een reserve omrekeningsverschillen','De reserve kan een negatief saldo hebben.','Indien de reserve omrekeningsverschillen een negatief saldo heeft, kunnen ter hoogte van dit saldo geen uitkeringen worden gedaan ten laste van de reserves.'],'9':['Wegens in de toelichting te vermelden gegronde redenen mag worden afgeweken van toepassing van lid 1.'],'10':['Verschillen in het eigen vermogen en het resultaat','in de toelichting bij de enkelvoudige jaarrekening vermeld']},
 '390':{'1':['worden opgenomen in een herwaarderingsreserve','tenzij ze krachtens artikel 384 ten gunste van het resultaat worden gebracht','Een herwaarderingsreserve wordt niet gevormd voor activa bedoeld in de vorige zin waarvoor frequente marktnoteringen bestaan.'],'3':['niet hoger dan het verschil','ten laste van de herwaarderingsreserve gebracht voor zover dit activum hieraan voorafgaande ten gunste van de herwaarderingsreserve is opgewaardeerd']},
 '405':{'1':['de activa, passiva, baten en lasten','als één geheel worden opgenomen'],'2':['inzicht geven betreffende het geheel']},
 '406':{'1':['aan het hoofd staat van zijn groep','stelt een geconsolideerde jaarrekening op','dochtermaatschappijen in de groep, andere groepsmaatschappijen','overheersende zeggenschap kan uitoefenen of waarover hij de centrale leiding heeft'],'2':['Een rechtspersoon waarop lid 1 niet van toepassing is, maar die in zijn groep een of meer dochtermaatschappijen heeft','stelt een geconsolideerde jaarrekening op','financiële gegevens van het groepsdeel']},
 '407':{'1a':['wier gezamenlijke betekenis te verwaarlozen is op het geheel'],'1b':['slechts tegen onevenredige kosten of met grote vertraging te verkrijgen of te ramen zijn'],'1c':['het belang slechts wordt gehouden om het te vervreemden'],'2':['Consolidatie mag achterwege blijven, indien'],'2a':['bij consolidatie de grenzen van artikel 396 niet zouden worden overschreden'],'2b':['geen in de consolidatie te betrekken maatschappijen een rechtspersoon is als bedoeld in artikel 398 lid 7'],'2c':['niet binnen zes maanden na de aanvang van het boekjaar daartegen schriftelijk bezwaar bij de rechtspersoon is gemaakt door de algemene vergadering']},
 '408':{'1':['Consolidatie van een groepsdeel mag achterwege blijven, mits'],'1a':['niet binnen zes maanden','ten minste een tiende'],'1b':['opgenomen in de geconsolideerde jaarrekening van een groter geheel'],'1c':['overeenkomstig de voorschriften van richtlijn 2013/34/EU','op gelijkwaardige wijze'],'1d':['geconsolideerde jaarrekening met accountantsverklaring en bestuursverslag','Nederlands','Frans, Duits of Engels','in de zelfde taal'],'1e':['binnen zes maanden na de balansdatum of binnen een maand na een geoorloofde latere openbaarmaking','bij het handelsregister','zijn gedeponeerd'],'3':['De rechtspersoon moet de toepassing van lid 1 in de toelichting vermelden.'],'4':['niet van toepassing op een rechtspersoon waarvan effecten zijn toegelaten tot de handel op een gereglementeerde markt']},
 '409':{'0':['naar evenredigheid tot het daarin gehouden belang'],'0a':['krachtens een regeling tot samenwerking','samen de rechten of bevoegdheden kunnen uitoefenen als bedoeld in artikel 24a, lid 1'],'0b':['hiermee voldaan wordt aan het wettelijke inzichtvereiste']},
 '410':{'1':['uitgezonderd','389 leden 6 en 8','zijn van overeenkomstige toepassing op de geconsolideerde jaarrekening'],'3':['Wegens gegronde, in de toelichting te vermelden redenen','andere waarderingsmethoden en grondslagen voor de berekening van het resultaat']},
 '411':{'2':['Het aandeel in het groepsvermogen en in het geconsolideerde resultaat dat niet aan de rechtspersoon toekomt, wordt vermeld.']},
 '413':{'0':['voor het eerst in de consolidatie worden opgenomen','dit verschil en de berekeningswijze worden vermeld','Is de waarde lager, dan is artikel 389 lid 7 van toepassing op het verschil','is de waarde hoger, dan wordt het verschil opgenomen in het groepsvermogen']}
 };
 var signals={
 '24a':{'1':['stem','benoem','dochter'], '2':['vof','volledig aansprakelijk','vennoot'], '3':['rekening van anderen'],'4':['pandhouder','verpand']},
 '24c':{'1':['kapitaal','20%','duurzaam','deelneming'],'2':['vof','volledig aansprakelijk','vennoot']},
 '365':{'1':['goodwill','immaterieel']},
 '373':{'1':['eigen vermogen','geplaatst kapitaal'],'3':['eigen aandelen','verminderen'],'4':['wettelijke reserve']},
 '374':{'4':['belastingvoorziening','latente belasting','belastingverplicht']},
 '385':{'2':['voorraad','fifo','lifo','gemiddelde'],'5':['eigen aandelen','inkoop eigen','kruisparticipatie']},
 '386':{'3':['goodwill','tien','gebruiksduur'],'4':['materiële','afschrijving']},
 '387':{'2':['vlottende','voorraad'],'3':['financiële vaste','duurzaam','deelneming'],'4':['terugnemen','ongedaan'],'5':['goodwill']},
 '390':{'1':['herwaarderingsreserve','actuele waarde'],'3':['afboeking','waardedaling','vermindering']},
 '405':{'1':['één geheel','groep','eliminatie'],'2':['inzicht']},
 '406':{'1':['groepshoofd','hoofd van de groep'],'2':['groepsdeel','subgroep']},
 '411':{'2':['derden','minderheid']},
 '384':{'1':['grondslag','verkrijgingsprijs','actuele waarde'],'2':['realis','intercompany','winst','voorzichtig'],'5':['valuta','koers'],'6':['stelselwijzig','wijziging'],'7':['waardestijg','marktnoter']},
 '389':{'1':['invloed','20%','stem'],'2':['nvw','nettovermogen','grondslag','resultaat deelneming'],'3':['zichtbaar eigen','onvoldoende gegevens'],'6':['wettelijke reserve','bewerkstelligen','stockdividend'],'7':['goodwill','verwerving','fair value'],'8':['omreken','slotkoers','valuta'],'9':['gegronde reden','afwijk'],'10':['verschil enkelvoudig']},
 '407':{'1':['onevenredig','vervreemd','te verwaarlozen'],'2':['kleine groep','klein','396','vrijstelling'],'3':['beheert','beheren en financieren']},
 '408':{'1':['tussenhoudster','groepsdeel','groter geheel'],'3':['toelichting'],'4':['effecten','gereglementeerd']}
 };
 function groups(law){var member='0';return law.paragraphs.map(function(text,i){var m=text.match(/^(\d+)\.\s/),letter=text.match(/^([a-z])\.\s/);if(m)member=m[1];return {text:text,index:i,member:member,letter:letter?letter[1]:'',ranges:[]};});}
 function requested(part){var text=String(part||'').toLowerCase(),numbers=text.match(/\d+/g)||[];var range=/([0-9]+)\s*(?:t\/m|tot en met|[-–])\s*(\d+)/g,m;while((m=range.exec(text)))for(var n=Number(m[1]);n<=Number(m[2])&&n<50;n++)numbers.push(String(n));return Array.from(new Set(numbers));}
 function offsets(text,needles){var ranges=[];needles.forEach(function(s){var pos=0,i;if(!s)return;while((i=text.indexOf(s,pos))>=0){ranges.push([i,i+s.length]);pos=i+s.length;}});ranges.sort(function(a,b){return a[0]-b[0];});return ranges.reduce(function(out,r){var last=out[out.length-1];if(last&&r[0]<=last[1])last[1]=Math.max(last[1],r[1]);else out.push(r);return out;},[]);}
 function resolve(article,law,part,context){
  var rows=groups(law),members=requested(part),explicit=members.length>0,lower=String(context||'').toLowerCase(),map=cores[article]||{},score={};
  if(!explicit){Object.keys(signals[article]||{}).forEach(function(k){score[k]=signals[article][k].reduce(function(n,s){return n+(lower.includes(s)?1:0);},0);});var best=Math.max(0,...Object.values(score));members=best?Object.keys(score).filter(function(k){return score[k]===best;}):[rows[0].member];}
  var letters=[],letterMatch=String(part||'').match(/onder\s+([a-z](?:\s*(?:en|of|,)\s*[a-z])*)/i);if(letterMatch)letters=letterMatch[1].match(/\b[a-z]\b/g)||[];
  if(!letters.length&&article==='374'&&members.includes('4')&&/belasting/.test(lower))letters=['a'];
  if(!letters.length&&article==='24a'&&members.includes('1')&&/stem/.test(lower)&&!/(bestuur|commissaris|benoem|ontsl)/.test(lower))letters=['a'];
  if(!letters.length&&article==='407'&&members.includes('1')&&!members.includes('2')){if(/te verwaarlozen/.test(lower))letters=['a'];else if(/onevenredig|vertraging/.test(lower))letters=['b'];else if(/vervreemd/.test(lower))letters=['c'];}
  var chosen=rows.filter(function(r){return members.includes(r.member)&&(!letters.length||!r.letter||letters.includes(r.letter));});
  if(!chosen.length)chosen=rows.slice(0,1);
  chosen.forEach(function(r){var needles=map[r.member+r.letter]||[];
    // Separate the actual rule from a presumption or exception when that is the point of this link.
    if(article==='24c'&&r.member==='1'&&/(?:20\s*%|vijfde|vermoed)/.test(lower)&&!/(?:duurzaam|eigen rekening|eigen werkzaamheid)/.test(lower))needles=needles.filter(function(t){return t.startsWith('Indien');});
    if(article==='386'&&r.member==='3'&&/(?:tien|10|schatt|schatten)/.test(lower))needles=needles.filter(function(t){return !t.startsWith('de geactiveerde');});
    r.ranges=offsets(r.text,needles);
    if(!r.ranges.length && !/[:;]$/.test(r.text) && r.text.length>40){
      // For an uncurated provision, choose one complete sentence, never synthesize a quotation.
      var sentences=r.text.match(/[^.!?]+[.!?](?=\s|$)|[^.!?]+$/g)||[r.text];
      var tokens=(lower.match(/[a-zà-ÿ]{5,}/g)||[]).filter(function(s){return !['artikel','jaarrekening','worden','waarin','welke','deelneming','rechtspersoon'].includes(s);});
      var ranked=sentences.map(function(s,i){return {s:s,i:i,score:tokens.filter(function(t){return s.toLowerCase().includes(t);}).length};}).sort(function(a,b){return b.score-a.score||a.i-b.i;});
      r.ranges=offsets(r.text,[ranked[0].s.trim()]);
    }
  });
  return {rows:rows,selected:chosen.map(function(r){return r.index;}),members:members,explicit:explicit,contextual:explicit||Object.values(score).some(function(n){return n>0;})};
 }
 root.CafaLawFocus={resolve:resolve,cores:cores,groups:groups,requested:requested};
})(typeof window==='undefined'?globalThis:window);
