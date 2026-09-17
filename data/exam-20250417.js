/* Complete transcription of the supplied 17 April 2025 exam and official answers.
 * Page furniture is omitted. The organisation diagram is represented by an exact relationship table.
 * Source inconsistencies are retained and explicitly marked, not silently corrected.
 */
(function () {
  'use strict';
  window.CAFA2_EXAMS = window.CAFA2_EXAMS || [];
  var p = function (s) { return '<p>' + s + '</p>'; };
  var h = function (s) { return '<h3>' + s + '</h3>'; };
  var ul = function (rows) { return '<ul>' + rows.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul>'; };
  var table = function (headers, rows, caption) {
    return '<div class="exam-table-wrap"><table>' + (caption ? '<caption>' + caption + '</caption>' : '') +
      '<thead><tr>' + headers.map(function (s) { return '<th scope="col">' + s + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (row) { return '<tr>' + row.map(function (s) { return '<td>' + s + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  };
  var journal = function (rows, caption) { return table(['Rekening / toelichting', 'Debet', 'Credit', 'Punten'], rows, caption); };
  var note = function (s) { return p('<strong>Bronnotitie:</strong> ' + s); };
  var plain = function (html) { return html.replace(/<\/(?:p|li|h[1-6]|tr|div|table)>/g, '\n').replace(/<\/(?:td|th)>/g, '\t').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\n{3,}/g, '\n\n').trim(); };
  var stockHeaders = ['Datum', 'Voorraad bij', 'Niet-gerealiseerde intercompany winst in voorraad', 'Interne correctie', 'Eliminatie t.l.v. aandeel derden', 'Eliminatie t.l.v. geconsolideerd resultaat'];
  var stockBlank = table(stockHeaders, [['', '', '100%', '…%', '…%', '…%'], ['31-12-2023', '', '', '', '', ''], ['31-12-2024', '', '', '', '', ''], ['Toe/afname', '', '', '', '', '']]);
  var stockNote = p('NB. Dit voorraadoverzicht is in de meest uitgebreide vorm weergegeven. U dient zelf te bepalen welke kolommen moeten worden ingevuld.');
  var taxNone = p('<strong>NB: In deze opgave wordt afgezien van belastingen.</strong>');
  var tax20 = p('<strong>NB 1: In dit vraagstuk wordt rekening gehouden met een winstbelastingtarief van 20%.</strong>');
  var paperInstruction = p('NB 2: Alle antwoorden moeten worden ingevuld in Cirrus. Om veel bladeren in Cirrus te voorkomen adviseren we jullie om de tabellen ook op dit tentamenpapier in te vullen.');
  var exam = {
    id: 'cafa2-20250417', title: 'CAFA2', date: '2025-04-17', durationMinutes: 180, maxScore: 100, passPoints: 55,
    introduction: 'Comptabele Aspecten Financial Accounting 2. Tentamen van 17 april 2025. Vier opgaven, 28 vragen, 100 punten. Beschikbare tijd: 3 uur. Grens onvoldoende/voldoende: 54/55 punten.',
    introductionHtml: h('Comptabele Aspecten Financial Accounting 2') +
      p('Datum: 17 april 2025. Beschikbare tijd: 3 uur; 9:30 uur - 12:30 uur. Opgesteld door: Kerngroep Comptabele Aspecten Financial Accounting 2.') +
      p('<strong>Dit is een oefenversie van een historisch tentamen.</strong> De oorspronkelijke tijdstippen en zaalregels hieronder zijn overgenomen van het voorblad en gelden niet als planning of voorwaarden voor deze online oefenversie. Verwijzingen naar Cirrus of tentamenpapier zijn oorspronkelijke broninstructies; in deze oefenversie vul je de antwoorden hier in. De oefentijd begint pas na Toets starten.') +
      h('Legitimeren bij tentamens verplicht') + p('Je bent als student verplicht om je bij het afleggen van een tentamen te (kunnen) legitimeren met een officieel identificatiedocument (ID/ paspoort/ rijbewijs). NB: De studentenpas volstaat niet! Als je je niet kunt legitimeren word je uitgesloten van deelname aan het tentamen. Deze regel is terug te vinden in de Onderwijs- en Examenregeling in de Studiegids.') +
      h('N.B.') + ul([
        "Het tentamen bestaat uit 18 genummerde pagina's. Controleer of deze alle aanwezig zijn.",
        'Voor het tentamen zijn 100 punten te behalen. De puntenverdeling per opgave zal zijn: Opgave 1: 30 punten; Opgave 2: 20 punten; Opgave 3: 30 punten; Opgave 4: 20 punten.',
        'Grens onvoldoende/voldoende: 54/55 punten.', 'Telefonisch worden geen uitslagen bekendgemaakt.'
      ]) + note('Het originele voorblad noemt 18 pagina’s. Het aangeleverde tentamen telt 15 pagina’s, doorlopend genummerd van 1 tot en met 15. De bronvermelding is hierboven behouden.') + p('Veel succes!') +
      h('De gang van zaken tijdens tentamens') + p('Tijdens het tentamen is het belangrijk dat u de volgende zaken in acht neemt:') + ul([
        'a. Kom in stilte de tentamenzaal binnen; spreken is niet toegestaan.',
        'b. Neem plaats bij de tentamentafel met uw tentamennummer.',
        'c. Leg uw legitimatie klaar.',
        'd. Verlaat aan het einde van het tentamen zonder te spreken de zaal en de sporthal.'
      ]) + p('Volg in alle gevallen de instructies van de surveillanten op.') + p('N.B. Het doorwerken nadat de tentamentijd is verstreken, heeft tot gevolg dat het tentamen niet zal worden ingenomen.') +
      p('© BREUKELEN, Nyenrode Business Universiteit, 2025') + p('Niets uit deze uitgave mag worden verveelvoudigd en/of openbaar gemaakt door middel van druk, fotokopie, microfilm, elektronisch op geluidsband of op welke andere wijze dan ook, zonder voorafgaande schriftelijke toestemming van de Nyenrode Business Universiteit.') +
      h('Algemene uitgangspunten alle opgaven in dit tentamen') + p('Hieronder worden de algemene uitgangspunten opgesomd. Van deze algemene uitgangspunten kan worden afgeweken. De afwijkingen worden dan expliciet in de opgave opgenomen.') + ul([
        'De Nederlandse verslaggevingsvoorschriften zoals opgenomen in Titel 9 boek 2 BW en de Richtlijnen voor de Jaarverslaggeving zijn van toepassing.',
        'Alle vennootschappen zijn naar Nederlands recht opgericht.',
        'Alle vennootschappen kwalificeren als een grote vennootschap in de zin van Titel 9 boek 2 BW.',
        'De deelnemingen passen voor de balanswaardering en resultaatbepaling dezelfde waarderingsgrondslagen toe als de moedermaatschappijen.',
        'Voor wat betreft consolidatie wordt uitgegaan van de integrale consolidatiemethode.',
        'Indien van toepassing moeten de antwoorden gemotiveerd worden en dient eventueel verwezen te worden naar de relevante wetsartikelen.'
      ]),
    sections: [], questions: [],
    sourceNotes: [
      'Het voorblad noemt 18 pagina’s; het aangeleverde tentamen heeft 15 doorlopend genummerde pagina’s. De vermelding 18 is behouden met bronnotitie.',
      'De uitwerking bij vraag 4 heeft als kop over 2024, terwijl de tentamenvraag en uitwerking betrekking hebben op 2023. Beide zijn behouden met bronnotitie.',
      'De uitwerking gebruikt bij vraag 7d eenmaal Casi in plaats van Cesi; dit is behouden met bronnotitie.',
      'De voorraadtabel bij vraag 9 vermeldt 100.000 in de kolom Aantal op de rij 31-12-2024 en 80.000 in de kolom 31-12-2024. Beide bronwaarden zijn ongewijzigd overgenomen.',
      'Vraag 10 is 3 punten; de tussenkop in het antwoordmodel noemt 2 punten. Tekens en totaal in de afwaarderingstabel zijn letterlijk behouden.',
      'De uitwerking bij vraag 12 vermeldt Stand 31-21-2023; de datumtypefout is behouden.',
      'De uitwerking bij vraag 14 noemt Bedragen zijn een doorwerkfout uit vraag 5. De verwijzing is behouden; de aansluitende deelnemingsberekening staat bij vraag 13.',
      'De uitwerking van vraag 22 heeft de kop GEVRAAGD 23. Deze uitwerking hoort inhoudelijk bij vraag 22 en is daaraan gekoppeld, met behoud van de bronkop.',
      'De uitwerking van vraag 28a verwijst naar antwoord 5a. Deze bronverwijzing is behouden; in het tentamen staat de genoemde eliminatie bij vraag 27a.'
    ],
    sources: [{title:'20250417 Tentamen CAFA2.pdf',kind:'exam'}, {title:'20250417 Uitwerking tentamen CAFA2.pdf',kind:'model-answers'}]
  };

  exam.sections.push({id:'opgave-1', title:'Opgave 1 · Montone bv (kapitaalbelangen)', points:30,
    contentHtml: taxNone + h('Deel I: enkelvoudige jaarrekening (18 punten)') +
      p('Montone bv (hierna: Montone) bezit twee deelnemingen respectievelijk Terni bv (hierna: Terni) en Todi bv (hierna: Todi). Gegevens met betrekking tot de deelnemingen:') +
      table(['Deelneming','Procentueel kapitaalbelang van Montone','Waarderingsgrondslag van de deelneming bij Montone','Door Montone betaalde prijs per bank'],[
        ['Terni','80%','Nettovermogenswaarde','€ 900.000'],['Todi','25%','Verkrijgingsprijs','€ 700.000']
      ]) +
      p('Het 80% kapitaalbelang van Montone in Terni is verworven op 1 januari 2023. Het zichtbare eigen vermogen van Terni, zoals weergegeven in haar jaarrekening, is per 31 december 2022 € 750.000. Op overnamedatum geldt, naar aanleiding van het overname onderzoek bij Terni en ten behoeve van de aankoop van het kapitaalbelang in Terni, het volgende:') + ul([
        'Uit een taxatie van de gebouwen komt naar voren dat de boekwaarde € 200.000 te hoog op de balans is gepresenteerd. Het gaat hier om een duurzame waardevermindering die niet in de jaarrekening van Terni is verwerkt. De gebouwen worden gewaardeerd tegen verkrijgingsprijs en in de resterende 20 jaar lineair afgeschreven zonder rekening te houden met een restwaarde.',
        'Ook blijkt uit de taxatie van de gebouwen dat sprake is van achterstallig onderhoud. Hiervoor wordt een voorziening voor groot onderhoud nodig geacht van € 150.000. Terni heeft geen voorziening groot onderhoud voor gebouwen opgenomen in haar jaarrekening.',
        'De vervoermiddelen hebben een taxatiewaarde (fair value) die € 40.000 hoger ligt dan de boekwaarde. De vervoermiddelen worden in de resterende afschrijvingstermijn van 4 jaar lineair afgeschreven tot een restwaarde van nihil.',
        'Montone waardeert haar voorraad op basis van het historische kostenstelsel met toepassing van het LIFO systeem. Terni waardeert haar voorraad op basis van het historische kostenstelsel op basis van het FIFO systeem. Per 1 januari 2023 is de waarde in het economische verkeer (fair value) van de voorraad bij Terni gelijk aan de historische kosten op basis van het FIFO systeem.'
      ]) + p('De betaalde goodwill wordt in 10 jaar met gelijke bedragen per jaar afgeschreven tot nihil.') +
      h('Over 2023 is voor Terni het volgende gegeven') + ul([
        'Terni heeft begin 2023 de duurzame waardevermindering van het gebouw als bijzondere waardevermindering verwerkt in haar jaarrekening over 2023.',
        'Het achterstallige onderhoud voor de gebouwen heeft nog niet plaatsgevonden in 2023. Dit zal gebeuren in 2024. Terni ziet nog geen reden een voorziening te vormen.',
        'De waardering van de voorraad bij Terni op basis van het FIFO systeem bedraagt per 31 december 2023 € 380.000. De voorraad gewaardeerd tegen historische kosten bij het LIFO systeem bedraagt per 31 december 2023 € 320.000.',
        'Het resultaat van Terni over 2023 bedraagt volgens haar eigen grondslagen voor waardering en resultaatbepaling € 350.000.'
      ]) + h('Over 2024 is het volgende gegeven') + p('Het eigen vermogen per 31 december 2024 van de drie ondernemingen is als volgt samengesteld:') +
      table(['Eigen vermogen','Montone','Terni','Todi'],[
        ['Geplaatst aandelenkapitaal','€ 1.000.000','€ 100.000','€ 100.000'],['Algemene reserve','€ 900.000','€ 950.000','€ 400.000'],['Resultaat boekjaar','€ 400.000','€ 250.000','€ 150.000'],['Totaal','€ 2.300.000','€ 1.300.000','€ 650.000']
      ]) + ul([
        'Het ‘resultaat deelneming Terni’ dat in de administratie van Montone is verantwoord (herrekend naar de grondslagen voor waardering- en resultaatbepaling van Montone) bedraagt over 2024 € 325.000.',
        'In 2024 is door Terni per bank een dividend van 25% uitgekeerd.',
        'In 2024 heeft Montone van Todi per bank een dividend van € 20.000 ontvangen.'
      ]) + h('Deel II: dochtermaatschappij en geconsolideerde jaarrekening (12 punten)') +
      p('Van de zakelijke belangen van de heer Rieti is het volgende organisatieschema weergegeven:') +
      table(['Van','Naar','Belang / bevoegdheid'],[
        ['Dhr. Rieti','Spoleto bv','100%'],['Dhr. Rieti','Assisi bv','100%'],['Spoleto bv','Gubbio bv','Bestuurders benoemen/ontslaan'],['Spoleto bv','Foligno bv','100%'],['Spoleto bv','Spello SA','20% + stemrechtovereenkomst'],['Foligno bv','v.o.f. Cesi','50%'],['Assisi bv','Corvia bv','40%'],['Corvia bv','Corvia bv (eigen aandelen)','25%']
      ],'Organisatieschema, dezelfde relaties in tabelvorm') + h('Toelichting organisatieschema') + ul([
        'De percentages geven de mate van stem- en winstrechten weer.',
        'Spoleto bv is geen aandeelhouder van Gubbio bv maar heeft wel het recht alle bestuurders van Gubbio bv te kunnen benoemen en te ontslaan.',
        'Spello SA is een naar Frans recht opgerichte vennootschap.',
        'Spoleto bv heeft naast het 20% kapitaalbelang in Spello SA tevens met de andere aandeelhouder van Spello SA een stemrechtovereenkomst gesloten waarbij Spoleto bv alle stemrechten kan uitoefenen in de algemene vergadering van aandeelhouders van Spello SA.',
        'Foligno bv is volledig aansprakelijk voor de schulden van de vennootschap onder firma (v.o.f.) Cesi die wordt bestuurd vanuit de centrale leiding van Foligno bv.',
        'Corvia bv heeft jaren geleden 25% van haar eigen aandelen ingekocht.',
        'Spoleto bv is organisatorisch verbonden met Foligno bv, Spello SA en v.o.f. Cesi waarbij Spoleto bv de centrale leiding heeft over Foligno bv en Spello SA.',
        'Assisi bv is organisatorisch verbonden met Corvia bv waarbij Assisi bv de centrale leiding over Corvia bv heeft.'
      ])
  });

  exam.sections.push({id:'opgave-2', title:'Opgave 2 · Hoek bv (vreemde valuta)', points:20,
    contentHtml: p('<strong>NB: In deze opgave wordt afgezien van winstbelasting.</strong>') +
      p('Hoek bv (hierna: Hoek) is een in Nederland gevestigd handelsbedrijf. Enkele jaren geleden heeft zij een 100% kapitaalbelang van de in Amerika gevestigde vennootschap Glacier llc (hierna: Glacier) aangekocht, om zo haar positie op de Noord Amerikaanse markt te verstevigen. De lokale valuta van Glacier is de Amerikaanse dollar (USD).') +
      p('Hoek waardeert haar 100%-deelneming in Glacier tegen nettovermogenswaarde. Hoek beschouwt de euro als haar functionele valuta en presentatievaluta.') +
      p('De balansen per 31 december 2023 en 2024 alsmede de winst-en-verliesrekening over 2024 van Glacier zien er als volgt uit:') +
      table(['Activa','31-12-2024','31-12-2023','Passiva','31-12-2024','31-12-2023'],[
        ['Vervoermiddelen','115.000','192.000','Geplaatst aandelenkapitaal','1.250.000','1.250.000'],
        ['Voorraad','2.400.000','3.000.000','Overige reserves','750.000','250.000'],
        ['Handelsdebiteuren','100.000','433.000','Resultaat boekjaar','400.000','500.000'],
        ['','','','Langlopende lening','1.200.000','1.250.000'],
        ['Liquide middelen','1.385.000','250.000','Handelscrediteuren','400.000','625.000'],
        ['Totaal','4.000.000','3.875.000','Totaal','4.000.000','3.875.000']
      ],'Balansen Glacier (bedragen x USD 1)') +
      table(['Kosten / resultaat','USD','Opbrengsten','USD'],[
        ['Kostprijs van de omzet','2.700.000','Omzet','5.200.000'],['Boekverlies verkoop vervoermiddel','5.250','',''],['Afschrijving vervoermiddelen','51.750','',''],['Afwaardering voorraad','380.000','',''],['Afwaardering debiteur','83.000','',''],['Overige kosten','1.500.000','',''],['Rentekosten','80.000','',''],['Resultaat (winst)','400.000','',''],['Totaal','5.200.000','Totaal','5.200.000']
      ],'Winst-en-verliesrekening Glacier over 2024 (bedragen x USD 1)') +
      p('De grondslagen voor waardering en resultaatbepaling geschiedt bij zowel Hoek als Glacier op basis van verkrijgingsprijs dan wel nominale waarde.') +
      h('Nadere toelichting op de balansen per 31 december 2023 en 31 december 2024 en de winst-en-verliesrekening over 2024') +
      h('Vervoermiddelen') + p('Dit betreft zes vervoermiddelen die op 1 januari 2022 zijn aangeschaft voor een bedrag van USD 50.000 per stuk, in totaal USD 300.000. De vervoermiddelen kennen een economische levensduur van vijf jaar en hebben restwaarde van USD 5.000. Per vervoermiddel wordt over een volledig jaar USD 9.000 afgeschreven. Met tijdsevenredige afschrijving wordt rekening gehouden. Op 1 oktober 2024 wordt één van de zes vervoermiddelen verkocht voor een bedrag van USD 20.000. Dit bedrag is op dezelfde dag per bank ontvangen. De boekwaarde op het moment van verkoop van dit vervoermiddel was USD 25.250.') +
      h('Voorraad') + p('Op 31 december 2023 bestaat bij Glacier de voorraad handelsgoederen uit 100.000 stuks à USD 30 per stuk (USD 3.000.000). Deze voorraad is ingekocht op 30 november 2023. Voor de voorraadwaardering past Glacier het FIFO systeem toe. In 2024 hebben de volgende goederenleveranties plaatsgevonden:') + ul([
        '01-03-2024: verkoop 50.000 stuks à USD 60 (USD 3.000.000);','01-05-2024: inkoop 60.000 stuks à USD 35 (USD 2.100.000);','01-08-2024: verkoop 40.000 stuks à USD 55 (USD 2.200.000);','01-12-2024: inkoop 10.000 stuks à USD 38 (USD 380.000).'
      ]) + p('Door problemen in het verleden over de betalingen en ontvangsten is door de directie van Glacier besloten dat alle inkopen en verkopen vanaf januari 2024 niet meer op rekening worden gedaan, waardoor alle transacties direct, via de bank, worden betaald dan wel ontvangen.') +
      p('Bij de inventarisatie van de voorraad op 31 december 2024 wordt het volgende geconstateerd:') + ul([
        '1. De nog uit 2023 aanwezige voorraad, groot 10.000 stuks, zijn niet meer te verkopen en worden afgeboekt ten laste van het resultaat over 2024.',
        '2. Uit de inkoop van mei 2024 zijn 8.000 stuks beschadigd en hebben nog een verkoopwaarde van USD 25 per stuk.'
      ]) + h('Debiteuren') + p('In 2024 is een dispuut met een afnemer ontstaan waarvan eind 2023 nog USD 433.000 was te vorderen. Op 1 april 2024 is op dit openstaande bedrag USD 250.000 ontvangen. Op 31 december 2024 is overeenstemming bereikt over betaling van het resterende saldo. In totaal zal in januari 2025 nog USD 100.000 worden betaald en het restant van USD 83.000 is op 31 december 2024 als oninbaar ten laste van het resultaat over 2024 afgeboekt.') +
      h('Langlopende lening') + p('De lening o/g kent een jaarlijkse aflossing van USD 50.000, welke op 31 december van elk jaar wordt betaald. Aan rentekosten is op 30 juni 2024 USD 40.000 en op 31 december 2024 USD 40.000 via de bank betaald.') +
      h('Overige kosten') + p('Deze zijn gespreid over het jaar betaald.') +
      h('Koersverloop Amerikaanse dollar (USD)') + p('Voor deze opgave geldt het volgende koersverloop:') + table(['Periode','Koers'],[
        ['Tot en met 1 januari 2024','USD 1 = € 0,87'],['2 januari 2024 t/m 30 juni 2024','USD 1 = € 0,92'],['1 juli 2024 t/m 30 december 2024','USD 1 = € 0,94'],['31 december 2024','USD 1 = € 0,97'],['Gemiddelde koers 2024','USD 1 = € 0,93']
      ])
  });

  exam.sections.push({id:'opgave-3',title:'Opgave 3 · Kisjes bv (consolidatie nettovermogenswaarde)',points:30,
    contentHtml:tax20 + paperInstruction +
      p('Kisjes bv (hierna: Kisjes) is een transportbedrijf gevestigd in Apeldoorn, dat zich heeft gespecialiseerd in palletvervoer en zich de laatste jaren ook richt op de verkoop van houten en kunststof pallets. Kisjes heeft al diverse jaren een tweetal deelnemingen, namelijk een 70% kapitaalbelang in de Palletdiscounter bv (hierna: Palletdiscounter) en een 90% kapitaalbelang in Q-Pall bv (hierna: Q-Pall), beide gevestigd in Vaassen. De houten pallets worden door Kisjes aan de Palletdiscounter geleverd die deze doorlevert aan derden. Q-Pall levert de kunststof pallets aan de Palletdiscounter, die deze vervolgens ook doorlevert aan derden.') +
      p('Met betrekking tot het boekjaar 2024 zijn de volgende gegevens beschikbaar met betrekking tot de intercompanyleveringen van houten pallets van Kisjes aan Palletdiscounter:') + ul([
        'De voorraad goederen bij de Palletdiscounter afkomstig van Kisjes bedroeg op 1 januari 2024 € 320.000 (hierin is een winst van Kisjes begrepen van € 64.000).',
        'In 2024 heeft Kisjes voor € 2.000.000 aan goederen geleverd aan de Palletdiscounter (hierin is een winst van Kisjes begrepen van € 400.000).',
        'De voorraad goederen bij de Palletdiscounter afkomstig van Kisjes bedroeg op 31 december 2024 € 480.000 (hierin is een winst van Kisjes begrepen van € 96.000).'
      ]) + p('Met betrekking tot het boekjaar 2024 zijn de volgende gegevens beschikbaar met betrekking tot de intercompanyleveringen van Q-Pall aan Palletdiscounter:') + ul([
        'De voorraad goederen bij Palletdiscounter afkomstig van Q-Pall bedroeg op 1 januari 2024 € 380.000 (hierin is een winst van Q-Pall begrepen van € 114.000).',
        'In 2024 heeft Q-Pall voor € 2.400.000 aan goederen geleverd aan Palletdiscounter (hierin is een winst van Q-Pall begrepen van € 720.000).',
        'De voorraad goederen bij Palletdiscounter afkomstig van Q-Pall bedroeg op 31 december 2024 € 300.000 (hierin is een winst van Q-Pall begrepen van € 90.000).'
      ]) + p('De Palletdiscounter heeft een grote opslagplaats in Vaassen. Deze opslagplaats is in eigendom van Kisjes. Kisjes verhuurt deze opslagplaats aan Palletdiscounter voor € 140.000 per jaar. Gezien de grootte van de opslagplaats heeft Palletdiscounter ook een gedeelte van de opslagplaats onderverhuurd aan Q-Pall voor € 60.000 per jaar. De verschuldigde huur wordt zowel door de Palletdiscounter als door Q-Pall op 31 december betaald. Verder brengt Kisjes jaarlijks een management fee in rekening aan Palletdiscounter van in totaal € 112.400. Per kwartaal wordt op de laatste dag van het kwartaal 1/4 deel betaald door Palletdiscounter.') +
      p('De gedeeltelijke consolidatiestaat voor de winst-en-verliesrekening over 2024, na verwerking van de intracomptabele correctieboekingen, ziet er in sterk samengevatte vorm als volgt uit:') +
      table(['','Kisjes bv','Q-Pall bv','De Palletdiscounter bv'],[['Resultaat deelnemingen','€ 305.440','',''],['Resultaat na belastingen','€ 445.440','€ 200.000','€ 160.000']])
  });

  exam.sections.push({id:'opgave-4',title:'Opgave 4 · Orvelde bv (consolidatie verkrijgingsprijs)',points:20,
    contentHtml:tax20 + paperInstruction +
      p('Op 2 januari 2023 heeft Orvelde bv (hierna: Orvelde) 70% van de aandelen van Dingspel bv (hierna: Dingspel) gekocht tegen betaling per bank van € 820.000.') +
      p('Per 31 december 2022 en 31 december 2024 (beiden voor winstverdeling) bedroeg het eigen vermogen van Dingspel als volgt:') +
      table(['','31-12-2022','31-12-2024'],[['Geplaatst aandelenkapitaal','€ 50.000','€ 50.000'],['Agio','€ 70.000','€ 70.000'],['Overige reserves','€ 640.000','€ 690.000'],['Resultaat boekjaar na belasting','€ 90.000','€ 110.000'],['Eigen vermogen','€ 850.000','€ 920.000']]) +
      p('Over Orvelde en Dingspel is het volgende bekend:') + ul([
        'De fair value van de activa en passiva van Dingspel komen op overnametijdstip per 2 januari 2023 overeen met het zichtbaar eigen vermogen per 31 december 2022 van Dingspel.',
        'Orvelde merkt haar kapitaalbelang in Dingspel aan als een deelneming die ze waardeert tegen verkrijgingsprijs.',
        'Orvelde stelt vanaf 2023 jaarlijks een geconsolideerde jaarrekening op met daarin opgenomen de eigen financiële gegevens en die van Dingspel.',
        'De bij de verkrijging betaalde goodwill wordt bij consolidatie, ingaande op het tijdstip van verkrijging, geactiveerd en lineair afgeschreven in 5 jaar tot een restwaarde van nihil.',
        'In 2023 heeft Dingspel uit haar resultaat boekjaar over 2022 een dividend van € 60.000 uitgekeerd aan haar aandeelhouders.',
        'In 2024 heeft Dingspel uit haar resultaat boekjaar over 2023 een dividend van € 80.000 uitgekeerd aan haar aandeelhouders.',
        'Vanaf de overname per 2 januari 2023 levert Dingspel goederen aan Orvelde, die deze goederen verkoopt aan afnemers in binnen- en buitenland. Voor de leveringen in het boekjaar 2024 geldt het volgende:' + ul([
          'Per 1 januari 2024 is bij Orvelde voor € 180.000 aan voorraad aanwezig, afkomstig van Dingspel. De in deze voorraad begrepen brutowinst bedraagt € 36.000.',
          'In 2024 is door Dingspel voor € 1.200.000 aan goederen geleverd aan Orvelde.',
          'Per 31 december 2024 is bij Orvelde voor € 140.000 aan voorraad aanwezig, afkomstig van Dingspel. De in deze voorraad begrepen brutowinst bedraagt € 28.000.'
        ])
      ])
  });

  function add(number, points, section, questionHtml, solutionHtml) {
    var assumption = section === 1 ? taxNone : section === 2 ? p('<strong>NB: In deze opgave wordt afgezien van winstbelasting.</strong>') : tax20;
    exam.questions.push({id:'vraag-'+number,title:'Vraag '+number,sourceQuestion:number,sectionId:'opgave-'+section,type:'open',points:points,
      prompt:plain(questionHtml),promptHtml:assumption+questionHtml,solution:plain(solutionHtml),solutionHtml:solutionHtml});
  }

  add(1,2,1,
    p('Noem de wettelijke criteria op grond waarvan de kapitaalbelangen in Terni en Todi kwalificeren als deelneming. (2 punten)'),
    p('Artikel 2:24c geeft de volgende criteria:') + ul(['kapitaalverschaffing (½)','voor eigen rekening (½)','duurzaam (½)','dienstbaar ten behoeve van de eigen werkzaamheid (½)'])
  );
  add(2,2,1,
    p('Geef gemotiveerd aan op grond van welke omstandigheid Montone haar ‘deelneming Todi’ volgens de wet moet waarderen tegen verkrijgingsprijs. (2 punten)'),
    p('Artikel 2:389-1 (1) geeft weer dat er sprake moet zijn van invloed van betekenis op het zakelijke en financiële beleid. Invloed wordt vermoed indien een vijfde of meer van de stemrechten kan worden uitgebracht.') +
    p('In casu wordt gewaardeerd tegen verkrijgingsprijs. Dit kan alleen als feitelijk geen invloed van betekenis op het zakelijke en financiële beleid kan worden uitgeoefend. Bij 25% kapitaalbelang wordt dit wel vermoed maar de andere aandeelhouder(s) heeft/hebben meer dan een 25% kapitaalbelang waardoor Todi feitelijk geen invloed van betekenis kan uitoefenen. Derhalve waarderen op grond van artikel 2:384-1 (1).')
  );
  add(3,4,1,
    p('Geef de journaalpost die Montone in haar administratie maakt van de aankoop van de ‘deelneming Terni’ op 1 januari 2023. (4 punten)'),
    table(['Berekening','Bedrag','Punten'],[
      ['Zichtbaar eigen vermogen 01-01-2023','€ 750.000',''],['Fair value correcties:','',''],['Duurzame waardedaling gebouwen','€ 200.000 -/-','½'],['Voorziening groot onderhoud gebouwen','€ 150.000 -/-','½'],['Correctie vervoermiddelen','€ 40.000','½'],['Nettovermogenswaarde','€ 440.000',''],['Aandeel in nettovermogenswaarde 80%','€ 352.000','½'],['Betaald voor 80% deelneming Terni','€ 900.000',''],['Goodwill','€ 548.000','½']
    ]) + journal([['0.. Deelneming Terni','€ 352.000','','½'],['0.. Goodwill Terni','€ 548.000','','½'],['Aan 1.. Bank','','€ 900.000','½']])
  );
  add(4,3,1,
    p('Geef het verloop van de grootboekrekening ‘deelneming Terni’ over 2023 zoals dit in de administratie van Montone is verwerkt. (3 punten)'),
    note('De kop van de officiële uitwerking luidt: “Geef het verloop van de grootboekrekening ‘deelneming Terni’ over 2024 zoals dit in de administratie van Montone is verwerkt.” De tentamenvraag en de onderstaande berekening betreffen 2023; de bronafwijking is niet stilzwijgend overgenomen in de vraag.') +
    table(['Verloop deelneming Terni','Berekening','Mutatie / stand','Punten'],[
      ['01-01-2023 Boekwaarde Deelneming Terni','','€ 352.000','½; df van 3'],
      ['Resultaat deelneming Terni','','',''],['Resultaat Terni over 2023','€ 350.000','',''],['Afwaardering gebouwen','€ 200.000','','½'],
      ['Fair value correcties:','','',''],['Groot onderhoud','€ 0','','½; indien niet genoemd ook goed rekenen'],['Afschrijving vervoermiddelen','€ 10.000 -/-','','½'],
      ['Correctie voorraad 31-12','€ 60.000 -/-','',''],['Correctie voorraad 01-01','€ 0','',''],['Correctie voorraad totaal','€ 60.000 -/-','','½'],
      ['Fair value correcties totaal','€ 70.000 -/-','',''],['Totaal resultaat','€ 480.000','',''],['Aandeel Montone in resultaat Terni 80%','','€ 384.000','½'],['31-12-2023 Boekwaarde Deelneming Terni','','€ 736.000','']
    ]) + table(['Controle aansluitingsberekening met eigen vermogen van Terni','Bedrag'],[
      ['Zichtbaar eigen vermogen 01-01-2023','€ 750.000'],['Winst 2023','€ 350.000'],['31-12-2023','€ 1.100.000'],['Fair value correcties:',''],['Correctie vervoermiddelen','€ 30.000'],['Correctie voorziening groot onderhoud','€ 150.000 -/-'],['Correctie voorraad','€ 60.000 -/-'],['Totaal','€ 920.000'],['Aandeel 80%','€ 736.000']
    ])
  );
  add(5,4,1,
    p('Geef de journaalposten die Montone in haar administratie over 2024 heeft gemaakt in verband met:') + ul(['a. het resultaat van de deelnemingen;','b. het dividend van de deelnemingen.']) + p('(4 punten)'),
    journal([['0.. Deelneming Terni','€ 325.000','','½ rekening + ½ bedrag'],['Aan 9.. Resultaat Deelneming Terni','','€ 325.000','½']],'a. Resultaat Terni') +
    h('a. Resultaat Todi') + p('Bij waardering tegen verkrijgingprijs wordt niets geboekt. (½; indien niet genoemd ook goed rekenen)') +
    journal([['1.. Bank (25% x € 100.000 x 80%)','€ 20.000','','½'],['Aan 0.. Deelneming Terni','','€ 20.000','½']],'b. Dividend Terni') +
    journal([['1.. Bank','20.000','','½'],['Aan 9.. Resultaat Deelneming Todi','','20.000','½']],'b. Dividend Todi')
  );
  add(6,3,1,
    p('Geef gemotiveerd aan de hand van de wet aan of Montone een wettelijke reserve deelneming moet vormen voor:') + ul(['a. deelneming Terni;','b. deelneming Todi.']) + p('(3 punten)'),
    h('Artikel 2:389-6') + p('De rechtspersoon houdt een reserve aan ter hoogte van zijn aandeel in het positieve resultaat uit deelnemingen en in rechtstreekse vermogensvermeerderingen sedert de eerste waardering overeenkomstig lid 2 of lid 3. Deelnemingen waarvan het cumulatief resultaat sedert die eerste waardering niet positief is, worden daarbij niet in aanmerking genomen. De reserve wordt verminderd met de uitkeringen waarop de rechtspersoon sedertdien tot het moment van het vaststellen van de jaarrekening recht heeft verkregen, alsmede met rechtstreekse vermogensverminderingen bij de deelneming; uitkeringen die hij zonder beperkingen kan bewerkstelligen, worden eveneens in mindering gebracht. Deze reserve kan in kapitaal worden omgezet. Onder de in dit lid bedoelde uitkeringen worden niet begrepen uitkeringen in aandelen.') +
    h('a. deelneming Terni') + p('Norm: Artikel 2:389-6 (½) geeft aan dat “uitkeringen die hij zonder beperking kan bewerkstellingen, worden eveneens in mindering worden gebracht”.') +
    p('Motivering: Montone heeft 80% van de aandelen en daarmee ook van de stemrechten. Montone heeft daarmee overheersende invloed op de dividendpolitiek van Terni kan daarmee uitkeringen zonder beperking bewerkstellingen. (½)') +
    p('Conclusie: Montone hoeft geen wettelijke reserve deelneming te vormen voor de deelneming in Terni. (½)') +
    h('b. deelneming Todi') + p('Norm: Deelneming Todi wordt gewaardeerd tegen verkrijgingsprijs. (½)') + p('Motivering: Hierdoor is artikel 2:389-6 niet van toepassing op de deelneming Todi. (½)') + p('Conclusie: Montone hoeft geen wettelijke reserve deelneming te vormen voor de deelneming Todi. (½)')
  );
  add(7,6,1,
    p('Geef gemotiveerd aan de hand van de wet aan of in de volgende situaties sprake is van een moeder-dochter relatie:') + ul(['a. Dhr. Rieti en Spoleto bv;','b. Spoleto bv en Gubbio bv;','c. Spoleto bv en Spello SA;','d. Spoleto bv en v.o.f. Cesi;','e. Assisi bv en Corvia bv.']) + p('(6 punten)'),
    h('Art 24a Titel 1 BW') + p('1. Dochtermaatschappij van een rechtspersoon is:') + ul([
      'a. een rechtspersoon waarin de rechtspersoon of een of meer van zijn dochtermaatschappijen, al dan niet krachtens overeenkomst met andere stemgerechtigden, alleen of samen meer dan de helft van de stemrechten in de algemene vergadering kunnen uitoefenen;',
      'b. een rechtspersoon waarvan de rechtspersoon of een of meer van zijn dochtermaatschappijen lid of aandeelhouder zijn en, al dan niet krachtens overeenkomst met andere stemgerechtigden, alleen of samen meer dan de helft van de bestuurders of van de commissarissen kunnen benoemen of ontslaan, ook indien alle stemgerechtigden stemmen.'
    ]) + p('2. Met een dochtermaatschappij wordt gelijk gesteld een onder eigen naam optredende vennootschap waarin de rechtspersoon of een of meer dochtermaatschappijen als vennoot volledig jegens schuldeisers aansprakelijk is voor de schulden.') +
    h('a. Dhr. Rieti en Spoleto bv') + p('Motivering: Dhr. Rieti is geen rechtspersoon dus die kan geen dochtermaatschappij onder zich hebben. Daarnaast is BW2 Titel 9 niet van toepassing op natuurlijk personen. (½)') + p('Conclusie: Spoleto bv is geen dochtermaatschappij van dhr. Rieti. (½)') +
    h('b. Spoleto bv en Gubbio bv') + p('Motivering: Op grond van lid 1b moet Spoleto bv aandeelhouder zijn. Dit is hier niet het geval. (½)') + p('Conclusie: Gubbio bv is geen dochtermaatschappij van Spoleto bv. (½)') +
    h('c. Spoleto bv en Spello SA') + p('Motivering: Spoleto bv heeft 20% van de aandelen in Spello SA en kan op grond van lid 1a door middel van de stemrechtovereenkomst meer dan de helft van de stemrechten uitoefenen in de algemene vergadering van aandeelhouders. (½)') + p('Conclusie: Spello SA is een dochter van Spoleto bv. (½)') +
    h('d. Spoleto bv en v.o.f. Casi') + p('Motivering:') + ul([
      'Foligno bv is volledig aansprakelijk voor schulden van v.o.f. Cesi. Hierdoor kwalificeert v.o.f. Cesi op grond van lid 2 als dochtermaatschappij van Foligno bv. (½)',
      'Spoleto bv kan op grond van lid 1a bij Foligno bv meer dan de helft van de stemrechten uitoefenen in de algemene vergadering van aandeelhouders. (½)'
    ]) + p('Conclusie: v.o.f. Cesi kwalificeert via dochtermaatschappij Foligno bv als dochtermaatschappij van Spoleto bv. (½)') + note('Het antwoordmodel noemt in deze tussenkop “Casi”; de casus en de overige tekst noemen “Cesi”. De afwijkende bronkop is behouden.') +
    h('e. Assisi bv en Corvia bv') + p('Motivering: Corvia bv heeft 25% van haar eigen aandelen ingekocht. Hierdoor kan op 75% van de aandelen van Corvia bv stemrecht worden uitgeoefend. Assisi bv heeft 40% van de aandelen in Corvia bv. Hierdoor kan Assisi bv op grond van lid 1a 40%/75% (= 53,33%) van de stemrechten uitoefenen in de algemene vergadering van aandeelhouders. (1)') + p('Conclusie: Corvia bv is een dochtermaatschappij van Assisi bv. (½)')
  );
  add(8,6,1,
    p('Geef aan welke rechtsperso(o)n(en) in beginsel:') + ul(['a. een geconsolideerde jaarrekening moet(en) opstellen én','b. welke rechtsperso(o)n(en) en vennootschap(pen) in deze geconsolideerde jaarrekening(en) word(t)(en) opgenomen.']) + p('Motiveer je antwoord aan de hand van de wet. Geef daarbij zo gedetailleerd mogelijk aan waarom een rechtspersoon of vennootschap opgenomen moet worden. (6 punten)'),
    h('Artikel 406 Titel 9 BW') + p('1. De rechtspersoon die, alleen of samen met een andere groepsmaatschappij, aan het hoofd staat van zijn groep, stelt een geconsolideerde jaarrekening op, waarin opgenomen de eigen financiële gegevens met die van zijn dochtermaatschappijen in de groep, andere groepsmaatschappijen en andere rechtspersonen waarop hij een overheersende zeggenschap kan uitoefenen of waarover hij de centrale leiding heeft.') +
    p('2. Een rechtspersoon waarop lid 1 niet van toepassing is, maar die in zijn groep een of meer dochtermaatschappijen heeft of andere rechtspersonen waarop hij een overheersende zeggenschap kan uitoefenen of waarover hij de centrale leiding heeft, stelt een geconsolideerde jaarrekening op. Deze omvat de financiële gegevens van het groepsdeel, bestaande uit de rechtspersoon, zijn dochtermaatschappijen in de groep, andere groepsmaatschappijen die onder de rechtspersoon vallen en andere rechtspersonen waarop hij een overheersende zeggenschap kan uitoefenen of waarover hij de centrale leiding heeft.') +
    h('a. (2 punten)') + p('Artikel 406 lid 1:') + ul(['Spoleto bv: staat aan het hoofd van een groep (½)','Assisi bv: staat aan het hoofd van een groep (½)']) + p('Artikel 406 lid 2:') + p('Foligno bv is geen groepshoofd maar groepsdeelhoofd. (1)') + p('Indien dhr. Rieti genoemd ½ punt aftrek (met minimum van nul).') +
    h('b. (4 punten)') + table(['Consolidatieplicht','Op te nemen vennootschap','Grond','Punten'],[
      ['Artikel 406 lid 1 Spoleto bv','Spoleto bv','eigen financiële gegevens','½'],['Artikel 406 lid 1 Spoleto bv','Foligno bv','dochtermaatschappij in de groep','½'],['Artikel 406 lid 1 Spoleto bv','Spello SA','dochtermaatschappij in de groep','½'],['Artikel 406 lid 1 Spoleto bv','v.o.f. Cesi','dochtermaatschappij in de groep','½'],
      ['Artikel 406 lid 1 Assisi bv','Assisi bv','eigen financiële gegevens','½'],['Artikel 406 lid 1 Assisi bv','Corvia bv','dochtermaatschappij in de groep','½'],
      ['Artikel 406 lid 2 Foligno bv','Foligno bv','eigen financiële gegevens','½'],['Artikel 406 lid 2 Foligno bv','v.o.f. Cesi','dochtermaatschappij in de groep','½']
    ])
  );

  add(9,4,2,
    p('Geef een gespecificeerde berekening van de boekwaarde van de posten vervoermiddelen en voorraad in de balans van Glacier per 31 december 2024 in euro’s op basis van de tijdstipmethode. (4 punten)'),
    h('a. Vervoermiddelen (1 punt)') + table(['','USD','Koers €','€','Punten'],[
      ['Boekwaarde 31-12-2023','192.000','0,87','167.040',''],['Afschrijving boekjaar','-51.750','0,87','-45.022',''],['Desinvestering','-25.250','0,87','-21.968',''],['Boekwaarde 31-12-2024','115.000','0,87','100.050','1']
    ]) + h('b. Voorraad (3 punten)') + table(['','Datum','Aantal','USD','Verkopen','31-12-2024','Bedrag in USD'],[
      ['Begin voorraad','30-11-2023','100.000','30,00','-50.000; -40.000','10.000','300.000'],['Verkoop','1-3-2024','-50.000','30,00','','',''],['Inkoop','1-5-2024','60.000','35,00','','60.000','2.100.000'],['Verkoop','1-8-2024','-40.000','30,00','','',''],['Inkoop','1-12-2024','10.000','38,00','','10.000','380.000'],
      ['','31-12-2024','100.000','','','80.000','2.780.000'],['Afboeking begin voorraad','','','30,00','','-10.000','-300.000'],['Afwaardering incourante voorraad','','','35,00 - 25,00','','8.000','-80.000'],['Eindvoorraad in USD','','','','','','2.400.000']
    ]) + table(['Waardering','Bedrag in euro'],[
      ['Waardering voorraad uit mei 2024: 52.000 x USD 35 = USD 1.820.000 (½) x € 0,92 (½) =','€ 1.674.400'],
      ['Waardering voorraad uit december 2024: 10.000 x USD 38 = USD 380.000 (½) x € 0,94 (½) =','€ 357.200'],
      ['Waardering voorraad uit mei 2024: 8.000 x USD 25 = USD 200.000 (½) x € 0,97 (½) =','€ 194.000'],['Totaal voorraad','€ 2.225.600']
    ]) + note('De bron vermeldt op de rij 31-12-2024 “100.000” onder Aantal en “80.000” onder 31-12-2024. Beide waarden zijn letterlijk behouden. De eurobedragen bij afschrijving/desinvestering volgen de afronding in het officiële model.')
  );
  add(10,3,2,
    p('Geef een gespecificeerde berekening van de post afwaardering voorraad in de winst-en-verliesrekening van Glacier over 2024 in euro’s op basis van de tijdstipmethode. (3 punten)'),
    h('Afwaardering voorraad (2 punten)') + table(['','Aantal x USD','Bedrag in USD','Koers','In €','Punten'],[
      ['Afwaardering voorraad 30-11-2023','10.000 x 30','300.000','0,87','-261.000','1'],['Afwaardering voorraad 1-5-2024','8.000 x (25 - 35)','80.000','0,92','-73.600','1'],['Koersverschil afwaardering 1-5-2024','8.000 x 25 x (0,92 - 0,97)','','','10.000','1'],['Totaal','','','','324.600','']
    ]) + note('De vraag is 3 punten en bevat drie deelpunten van 1. De tussenkop van het antwoordmodel noemt “2 punten”. De tekens van de tabelposten en het positieve totaal 324.600 zijn ongewijzigd uit het model overgenomen.')
  );
  add(11,5,2,
    p('Geef een gespecificeerde berekening van het koersverschil over 2024 dat ontstaat bij de omrekening volgens de tijdstipmethode. Geef hierbij aan of dit resultaat positief of negatief is. (5 punten)'),
    table(['','Bedrag USD','Koers €','Punten','Bedrag €'],[
      ['01-01-2024 monetaire positie:','','','',''],['Debiteuren','433.000','','',''],['Liquide middelen','250.000','','',''],['Lening','-1.250.000','','',''],['Crediteuren','-625.000','','',''],['Totaal beginpositie','-1.192.000','0,87','½','-1.037.040'],
      ['Mutaties:','','','',''],['Inkoop eerste halfjaar','-2.100.000','0,92','½ samen met verkoop eerste halfjaar','-1.932.000'],['Verkoop eerste halfjaar','3.000.000','0,92','idem','2.760.000'],['Inkoop tweede halfjaar','-380.000','0,94','½ samen met verkoop tweede halfjaar','-357.200'],['Verkoop tweede halfjaar','2.200.000','0,94','idem','2.068.000'],['Overige kosten','-1.500.000','0,93','½','-1.395.000'],['Desinvestering 1-10-2024','20.000','0,94','½','18.800'],['Rentekosten 30-6-2024','-40.000','0,92','½','-36.800'],['Rentekosten 31-12-2024','-40.000','0,97','½','-38.800'],['Afwaardering vordering 31-12-2024','-83.000','0,97','½','-80.510'],['Totaal mutaties','1.077.000','','','1.006.490'],['Monetaire positie theoretisch','-115.000','','','-30.550'],
      ['31-12-2024 monetaire positie:','','','',''],['Debiteuren','100.000','','',''],['Liquide middelen','1.385.000','','',''],['Lening','-1.200.000','','',''],['Crediteuren','-400.000','','',''],['Totaal eindpositie','-115.000','0,97','½','-111.550'],['Koersverlies in w&v','','','½','81.000']
    ])
  );
  add(12,3,2,
    p('Geef het verloop van de boekwaarde van de post vervoermiddelen over 2024 in de balans van Glacier in euro’s op basis van de slotkoersmethode en het omrekeningsverschil dat bij deze omrekening ontstaat. (3 punten)'),
    h('Vervoermiddelen (3 punten)') + table(['','USD','Koers €','€','Punten'],[
      ['Stand 31-21-2023','192.000','0,87','167.040','½'],['Afschrijvingen','-51.750','0,93','-48.127','½'],['Desinvesteringen 1-10-2024','-25.250','0,93','-23.483','½'],['Boekwaarde 31-12-2024','115.000','','95.430',''],
      ['Omrekenverschil:','','','',''],['Beginstand','192.000','x (0,97 - 0,87)','+19.200','½'],['Afschrijving boekjaar','-51.750','x (0,97 - 0,93)','-2.070','½'],['Desinvestering','-25.250','x (0,97 - 0,93)','-1.010','½'],['Totaal','','','+16.120',''],['Stand 31-12-2024','115.000','0,97','111.550','']
    ]) + note('“Stand 31-21-2023” is de letterlijke datumtypefout in het model. Het gaat om de beginstand uit 31-12-2023. De afrondingen -48.127 en -23.483 zijn letterlijk behouden.')
  );
  add(13,2,2,
    p('Geef het verloop van de post deelneming Glacier over 2024 zoals Hoek dit opneemt in haar enkelvoudige jaarrekening op basis van de slotkoersmethode en geef hierbij een gespecificeerde berekening van het omrekeningsverschil dat bij deze omrekening ontstaat. (2 punten)'),
    h('Eigen vermogen') + table(['','USD','Koers € / berekening','€','Punten'],[
      ['Stand 1-1-2024','2.000.000','0,87','1.740.000','½'],['Resultaat 2024','400.000','0,93','372.000','½'],['Subtotaal','2.400.000','','2.112.000',''],['Reserve omrekenverschillen:','','','',''],['Omrekenverschil beginsaldo','2.000.000','x (0,97 - 0,87)','200.000','½'],['Omrekenverschil resultaat','400.000','x (0,97 - 0,93)','16.000','½'],['Totaal omrekenverschillen','','','216.000',''],['Stand 31-12-2024','2.400.000','0,97','2.328.000','']
    ])
  );
  add(14,3,2,
    p('Geef bij toepassing van de slotkoersmethode de journaalpost(en) die Hoek eind 2024 in haar grootboek heeft gemaakt met betrekking tot haar deelneming in Glacier. (3 punten)'),
    journal([['Deelneming Glacier','588.000','','1'],['Aan resultaat deelneming','','372.000','1'],['Aan reserve omrekeningsverschillen','','216.000','1']],'Bedragen in €') +
    p('Bedragen zijn een doorwerkfout uit vraag 5') + note('Het model noemt letterlijk “vraag 5”. De aansluitende berekening van deze deelneming en omrekeningsverschillen staat in dit tentamen bij vraag 13.')
  );

  add(15,1,3,
    p('Stel onderstaande voorraadtabel samen met betrekking tot de intercompanyleveringen van Kisjes aan de Palletdiscounter. (1 punt)') + stockBlank + stockNote,
    h('GEVRAAGD 15. VAN KISJES NAAR DE PALLETDISCOUNTER, DOWNSTREAM (1 PUNT: G/F)') +
    table(['Datum','Voorraad bij Palletdiscounter','(1) Niet-gerealiseerde intercompanywinsten in voorraad bij Palletdiscounter','(2) Interne correctie bij Kisjes (70%)','(3) Ten laste van geconsolideerd resultaat (30%)'],[
      ['31-12-2023','€ 320.000','€ 64.000','€ 44.800','€ 19.200'],['31-12-2024','€ 480.000','€ 96.000','€ 67.200','€ 28.800'],['Toename','€ 160.000','€ 32.000','€ 22.400','€ 9.600']
    ]) + p('(1 punt g/f)')
  );
  add(16,3,3,
    p('Geef de journaalpost(en) die eind 2024 is (zijn) gemaakt in de enkelvoudige jaarrekening van Kisjes in verband met bovenstaande nog niet gerealiseerde intercompanyresultaten (intracomptabele correctieboeking(en)). (3 punten)'),
    h('GEVRAAGD 16. (3 PUNTEN)') + journal([
      ['9.. Niet gerealiseerde winst op tr. met deelnemingen','22.400','','½ rekening + ½ bedrag'],['1.. Aan/ Overlopende passiva','','22.400','½'],
      ['0.. Voorziening belastingen','4.480','','½ rekening + ½ bedrag'],['9.. Aan/ Belastinglast (20% x € 22.400)','','4.480','½']
    ],'Intracomptabele journaalpost · Downstream, voorraadtoename')
  );
  add(17,7,3,
    p('Geef ten behoeve van de samenstelling van de geconsolideerde winst-en-verliesrekening over 2024 de eliminatieboekingen met betrekking tot de intercompanyleveringen van Kisjes aan de Palletdiscounter. (7 punten)'),
    h('GEVRAAGD 17.A. (2 PUNTEN)') + journal([
      ['D- Netto omzet (2.000.000 - 160.000)','1.840.000','','½ rekening + 1 bedrag'],['Cr- Kostprijs netto omzet','','1.840.000','½']
    ],'Eliminatieboeking (* 1 €) · Downstream; doorlevering derden') +
    h('GEVRAAGD 17.B. (5 PUNTEN)') + journal([
      ['D- Netto omzet','160.000','','½ rekening + ½ bedrag'],['Cr- Kostprijs netto omzet','','128.000','½ rekening + ½ bedrag'],['Cr- Niet gereal. winst door tr. met deeln. (70% x 32.000)','','22.400','½ rekening + ½ bedrag'],['Cr- Resultaat na belastingen (80% x 9.600)','','7.680','½ rekening + ½ bedrag'],['Cr- Belastinglast (20% x 9.600)','','1.920','½ rekening + ½ bedrag']
    ],'Eliminatieboeking (* 1 €) · Downstream; toename voorraad')
  );
  add(18,2,3,
    p('Stel onderstaande voorraadtabel samen met betrekking tot de intercompanyleveringen van Q-Pall aan Palletdiscounter. (2 punten)') + stockBlank + stockNote,
    h('GEVRAAGD 18. VAN Q-PALL NAAR DE PALLETDISCOUNTER, SIDESTREAM (2 PUNTEN)') +
    table(['Datum','Voorraad bij Palletdisc.','(1) Niet-gerealiseerde intercompanywinsten in voorraad bij Palletd.','(2) Interne correctie bij Kisjes (70%)','(3) Ten laste van 3e (10%)','(4) Ten laste van geconsolideerd resultaat (20%)'],[
      ['31-12-2023','€ 380.000','€ 114.000','€ 79.800','€ 11.400','€ 22.800'],['31-12-2024','€ 300.000','€ 90.000','€ 63.000','€ 9.000','€ 18.000'],['Afname','-€ 80.000','-€ 24.000','-€ 16.800','-€ 2.400','-€ 4.800']
    ]) + p('(1/2 punt per geheel juiste kolom: (1), (2), (3) en (4))')
  );
  add(19,2,3,
    p('Geef de journaalpost(en) die eind 2024 is (zijn) gemaakt in de enkelvoudige jaarrekening van Kisjes in verband met bovenstaande nog niet gerealiseerde intercompanyresultaten (intracomptabele correctieboeking(en)). (2 punten)'),
    h('GEVRAAGD 19. (2 PUNTEN)') + journal([
      ['0.. Deelnemingen (80% x 16.800)','13.440','','½ rekening + 1 bedrag'],['9.. Aan/ Resultaat deelnemingen','','13.440','½']
    ],'Intracomptabele journaalpost (* 1 €) · Sidestream afnemend')
  );
  add(20,8,3,
    p('Geef ten behoeve van de samenstelling van de geconsolideerde balans per 31 december 2024 de eliminatieboekingen met betrekking tot de intercompanyleveringen van Q-Pall aan de Palletdiscounter. (8 punten)'),
    h('GEVRAAGD 20.B.1. (6 PUNTEN)') + journal([
      ['D- Deelnemingen (80% x 63.000)','50.400','','½ rekening + ½ bedrag'],['D- Voorziening belastingen (20% x 63.000)','12.600','','½ rekening + ½ bedrag'],['D- Belang derden (80% x 9.000)','7.200','','½ rekening + ½ bedrag'],['D- Voorziening belastingen (20% x 9.000)','1.800','','½ rekening + ½ bedrag'],['D- Resultaat boekjaar (80% x 18.000)','14.400','','½ rekening + ½ bedrag'],['D- Voorziening belastingen (20% x 18.000)','3.600','','½ rekening + ½ bedrag'],['Cr- Voorraden','','90.000','']
    ],'Eliminatieboeking (* 1 €) · Sidestream afnemend; uitvoegen voorraad') +
    h('GEVRAAGD 20.B.2. (2 PUNTEN)') + journal([
      ['D- Overige reserves','18.240','','½ rekening + 1 bedrag'],['Cr- Resultaat boekjaar (80% x 22.800)','','18.240','½']
    ],'Eliminatieboeking (* 1 €) · Sidestream afnemend; invoegen winst')
  );
  add(21,3,3,
    p('Geef ten behoeve van de samenstelling van de geconsolideerde winst-en-verliesrekening over 2024 de eliminatieboeking(en) met betrekking tot de intercompany verhuur van het pand en de management fee. (3 punten)'),
    h('GEVRAAGD 21.A. (1,5 PUNTEN)') + journal([
      ['D- Management fee baten (Kisjes)','112.400','','½ rekening + ½ bedrag'],['Cr- Management fee kosten (Palletdiscounter)','','112.400','½']
    ],'Eliminatieboeking (* 1 €) · Management fee') +
    h('GEVRAAGD 21.B. (1,5 PUNTEN)') + journal([
      ['D- Huurbaten','200.000','','½ rekening + ½ bedrag'],['Cr- Huurkosten','','200.000','½']
    ],'Eliminatieboeking (* 1 €) · Huurkosten/baten') +
    journal([['D- Huurbaten Palletdiscounter (bij Kisjes)','140.000','',''],['D- Huurbaten Q-Pall (bij Palletdiscounter)','60.000','',''],['Cr- Huurkosten (Palletdiscounter)','','140.000',''],['Cr- Huurkosten (Q-Pall)','','60.000','']],'Of gesplitst')
  );
  add(22,4,3,
    p('Geef ten behoeve van de samenstelling van de geconsolideerde winst-en-verliesrekening over 2024 de eliminatieboeking(en) met betrekking tot het resultaat deelnemingen (van Q-Pall en Palletdiscounter). (4 punten)'),
    h('GEVRAAGD 23. (4 PUNTEN)') + journal([
      ['D- Resultaat deelnemingen (Kisjes)','305.440','','½ rekening + ½ bedrag'],['D- Aandeel derden (€ 200.000 x 10% + 160.000 x 30%)','68.000','','½ rekening + ½ bedrag'],['Cr- Resultaat na belastingen (Q-Pall) (€ 200.000 + € 13.440)','','213.440','½ rekening + ½ bedrag'],['Cr- Resultaat na belastingen (Palletdiscounter)','','160.000','½ rekening + ½ bedrag']
    ],'Eliminatieboeking (* 1 €) · Resultaat deelneming') + note('De officiële uitwerking gebruikt de kop “GEVRAAGD 23”. De inhoud betreft vraag 22 over de resultaten van Q-Pall en Palletdiscounter. De bronkop is behouden; de koppeling volgt de inhoud van de tentamenvraag.')
  );

  add(23,1,4,
    p('Bereken het bedrag van de door Orvelde betaalde goodwill. (1 punt)'),
    table(['Berekening','Bedrag','Punten'],[['Eigen vermogen Dingspel 31-12-2022','€ 850.000',''],['Door Orvelde gekocht 70%','€ 595.000',''],['Betaald','€ 820.000',''],['Goodwill','€ 225.000','1']])
  );
  add(24,2,4,
    p('Geef de journaalposten die Orvelde in haar financiële administratie heeft gemaakt voor:') + ul(['a. de aankoop van de deelneming in Dingspel op 2 januari 2023;','b. het in 2023 ontvangen dividend.']) + p('(2 punten)'),
    h('a. de aankoop van de deelneming in Dingspel op 2 januari 2023') + journal([
      ['0.. Deelneming Dingspel','€ 820.000','','1 g/f'],['Aan 1.. Bank','','€ 820.000','']
    ],'Intracomptabele journaalpost (€)') +
    h('b. het in 2023 ontvangen dividend') + journal([
      ['1.. Bank / Te vorderen dividend','€ 42.000','','1 g/f'],['Aan 0.. Deelneming Dingspel','','€ 42.000','']
    ],'Intracomptabele journaalpost (€)') + p('70% x € 60.000')
  );
  add(25,1,4,
    p('Stel onderstaande voorraadtabel samen met betrekking tot de intercompanyleveringen van goederen van Dingspel aan Orvelde. (1 punt)') + stockBlank + stockNote,
    p('(1 punt g/f)') + table(['Datum','Voorraad bij Orvelde','Niet-gerealiseerde intercompany winst in voorraad bij Orvelde','Interne correctie bij…','Eliminatie t.l.v. aandeel derden','Eliminatie t.l.v. geconsolideerd resultaat'],[
      ['','','100%','…%','30%','70%'],['31-12-2023','€ 180.000','€ 36.000','','€ 10.800','€ 25.200'],['31-12-2024','€ 140.000','€ 28.000','','€ 8.400','€ 19.600'],['Afname','€ 40.000','€ 8.000','','€ 2.400','€ 5.600']
    ])
  );
  add(26,7,4,
    p('Geef de eliminatieboeking(en) die ten behoeve van de samenstelling van de geconsolideerde balans per 31 december 2024 moet(en) worden gemaakt in verband met de intercompanyleveringen van goederen tussen Dingspel en Orvelde. (7 punten)'),
    journal([
      ['Resultaat boekjaar (80% x € 19.600)','€ 15.680','','½ rekening + ½ bedrag'],['Voorziening latente belastingen (20% x € 19.600)','€ 3.920','','½ rekening + ½ bedrag'],['Aandeel derden (80% x € 8.400)','€ 6.720','','½ rekening + ½ bedrag'],['Voorziening latente belastingen (20% x € 8.400)','€ 1.680','','½ rekening + ½ bedrag'],['Aan Voorraad','','€ 28.000','½ rekening + ½ bedrag']
    ],'Eliminatieboeking') + journal([
      ['Overige reserves','€ 20.160','','½ rekening + 1 bedrag'],['Aan Resultaat boekjaar (80% x € 25.200)','','€ 20.160','½']
    ],'Eliminatieboeking')
  );
  add(27,6,4,
    p('Geef de eliminatieboekingen ten behoeve van de samenstelling van de geconsolideerde winst-en-verliesrekening over 2024 voor:') + ul(['a. het aandeel derden;','b. de afschrijving goodwill;','c. het uitgekeerde dividend.']) + p('(6 punten)'),
    h('a. het aandeel derden') + journal([
      ['Aandeel derden','€ 33.000','','½ rekening + 1 bedrag'],['Aan Resultaat na belastingen (30% x € 110.000)','','€ 33.000','½']
    ],'Eliminatieboeking') +
    h('b. de afschrijving goodwill') + journal([
      ['Afschrijvingskosten goodwill','€ 45.000','','½ rekening + 1 bedrag'],['Aan Resultaat na belastingen (€ 225.000 / 5 jr.)','','€ 45.000','½']
    ],'Eliminatieboeking') +
    h('c. het uitgekeerde dividend') + journal([
      ['Dividendopbrengst/Resultaat deelneming','€ 56.000','','½ rekening + 1 bedrag'],['Aan Resultaat na belastingen (70% x € 80.000)','','€ 56.000','½']
    ],'Eliminatieboeking')
  );
  add(28,3,4,
    p('Bereken voor:') + ul(['a. de geconsolideerde winst-en-verliesrekening over 2024 van Orvelde het aandeel derden;','b. de geconsolideerde balans per 31 december 2024 van Orvelde de balanspost goodwill.']) + p('(3 punten)'),
    h('a. de geconsolideerde winst-en-verliesrekening van Orvelde het aandeel derden') +
    table(['Berekening','Bedrag','Punten'],[['Aandeel derden (antwoord 5a)','€ 33.000','1'],['Aandeel derden in eliminatie intercompany leveringen (€ 2.400 x 80%)','+ € 1.920','1'],['Totaal','€ 34.920','']]) +
    note('“Antwoord 5a” is de bronverwijzing in het model. Het genoemde bedrag € 33.000 staat in dit tentamen bij vraag 27a.') +
    h('b. de geconsolideerde balans van Orvelde de balanspost goodwill') + p('Betaalde goodwill (€ 225.000) -/- 2 jaar afschrijving (ad € 45.000 per jaar) = € 135.000 (1)')
  );
  window.CAFA2_EXAMS.push(exam);
}());
