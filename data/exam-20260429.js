/* Complete transcription of the user-provided exam and official model answers.
 * Amounts, grading annotations and source inconsistencies are preserved.
 * Only page furniture and repeated question headings in the answers are omitted.
 */
(function () {
  'use strict';
  window.CAFA2_EXAMS = window.CAFA2_EXAMS || [];
  var escape = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var p = function (s) { return '<p>' + s + '</p>'; };
  var list = function (items) { return '<ul>' + items.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul>'; };
  var table = function (headers, rows, caption) {
    return '<div class="exam-table-wrap"><table>' + (caption ? '<caption>' + caption + '</caption>' : '') +
      '<thead><tr>' + headers.map(function (x) { return '<th scope="col">' + x + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (row) { return '<tr>' + row.map(function (x) { return '<td>' + x + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  };
  var journal = function (rows, caption) { return table(['Rekening / toelichting', 'Debet', 'Credit', 'Punten'], rows, caption); };
  var stockHeaders = ['Datum', 'Voorraad', 'Niet-gerealiseerde intercompany winst in voorraad', 'Interne correctie', 'Eliminatie t.l.v. aandeel derden', 'Eliminatie t.l.v. geconsolideerd resultaat'];
  var stockBlank = table(stockHeaders, [['', '', '100%', '…%', '…%', '…%'], ['31-12-2024', '', '', '', '', ''], ['31-12-2025', '', '', '', '', ''], ['Toe/afname', '', '', '', '', '']]);
  var stockNote = p('NB. Dit voorraadoverzicht is in de meest uitgebreide vorm weergegeven. U dient zelf te bepalen welke kolommen moeten worden ingevuld.');
  var plain = function (html) { return html.replace(/<\/(?:p|li|h[1-6]|tr|div|table)>/g, '\n').replace(/<\/(?:td|th)>/g, '\t').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\n{3,}/g, '\n\n').trim(); };
  var exam = {
    id: 'cafa2-20260429', title: 'CAFA2', date: '2026-04-29', durationMinutes: 180, maxScore: 100, passPoints: 55,
    introduction: 'Comptabele Aspecten Financial Accounting 2. Tentamen van 29 april 2026. Vier opgaven, 23 vragen, 100 punten. Beschikbare tijd: 3 uur. Grens onvoldoende/voldoende: 54/55 punten.',
    introductionHtml:
      '<h3>Comptabele Aspecten Financial Accounting 2</h3>' +
      p('Datum: 29 april 2026. Beschikbare tijd: 3 uur; 09:30 uur – 12:30 uur. Opgesteld door: Kerngroep Comptabele Aspecten Financial Accounting 2.') +
      p('<strong>Dit is een oefenversie van een historisch tentamen.</strong> De oorspronkelijke tijdstippen en zaalregels hieronder zijn overgenomen van het voorblad en gelden niet als planning of voorwaarden voor deze online oefenversie. Verwijzingen naar Cirrus of tentamenpapier zijn oorspronkelijke broninstructies; in deze oefenversie vul je de antwoorden hier in. De oefentijd begint pas na Toets starten.') +
      '<h3>Legitimeren bij tentamens verplicht</h3>' +
      p('Je bent als student verplicht om je bij het afleggen van een tentamen te (kunnen) legitimeren met een officieel identificatiedocument (ID/ paspoort/ rijbewijs). NB: De studentenpas volstaat niet! Als je je niet kunt legitimeren word je uitgesloten van deelname aan het tentamen. Deze regel is terug te vinden in de Onderwijs- en Examenregeling in de Studiegids.') +
      '<h3>N.B.</h3>' + list([
        "Het tentamen bestaat uit 13 genummerde pagina's. Controleer of deze alle aanwezig zijn.",
        'Voor het tentamen zijn 100 punten te behalen. De puntenverdeling per opgave zal zijn: Opgave 1: 30 punten; Opgave 2: 20 punten; Opgave 3: 30 punten; Opgave 4: 20 punten.',
        'Grens onvoldoende/voldoende: 54/55 punten.', 'Telefonisch worden geen uitslagen bekendgemaakt.'
      ]) + p('Veel succes!') +
      '<h3>De gang van zaken tijdens tentamens</h3>' + p('Tijdens het tentamen is het belangrijk dat u de volgende zaken in acht neemt:') +
      '<ol type="a"><li>Kom in stilte de tentamenzaal binnen; spreken is niet toegestaan.</li><li>Neem plaats bij de tentamentafel met uw tentamennummer.</li><li>Leg uw legitimatie klaar.</li><li>Verlaat aan het einde van het tentamen zonder te spreken de zaal en de sporthal.</li></ol>' +
      p('Volg in alle gevallen de instructies van de surveillanten op.') + p('N.B. Het doorwerken nadat de tentamentijd is verstreken, heeft tot gevolg dat het tentamen niet zal worden ingenomen.') +
      p('© BREUKELEN, Nyenrode Business Universiteit, 2026') +
      p('Niets uit deze uitgave mag worden verveelvoudigd en/of openbaar gemaakt door middel van druk, fotokopie, microfilm, elektronisch op geluidsband of op welke andere wijze dan ook, zonder voorafgaande schriftelijke toestemming van de Nyenrode Business Universiteit.') +
      '<h3>Algemene uitgangspunten alle opgaven in dit tentamen</h3>' +
      p('Hieronder worden de algemene uitgangspunten opgesomd. Van deze algemene uitgangspunten kan worden afgeweken. De afwijkingen worden dan expliciet in de opgave opgenomen.') +
      list([
        'De Nederlandse verslaggevingsvoorschriften zoals opgenomen in Titel 9 boek 2 BW en de Richtlijnen voor de Jaarverslaggeving zijn van toepassing.',
        'Alle vennootschappen zijn naar Nederlands recht opgericht.',
        'Alle vennootschappen kwalificeren als een grote vennootschap in de zin van Titel 9 boek 2 BW.',
        'De vermelde percentages aan kapitaalbelangen weerspiegelen, tenzij expliciet anders vermeld, de mate van zeggenschap en winstrechten.',
        'De deelnemingen passen voor de balanswaardering en resultaatbepaling dezelfde waarderingsgrondslagen toe als de moedermaatschappijen.',
        'Voor wat betreft consolidatie wordt uitgegaan van de integrale consolidatiemethode.',
        'Indien van toepassing moeten de antwoorden gemotiveerd worden en dient eventueel verwezen te worden naar de relevante wetsartikelen.'
      ]),
    sections: [], questions: [],
    sourceNotes: [
      'De officiële uitwerking noemt bij opgave 2 vraag 4 en verschillende vragen van opgave 3 abusievelijk 2020; het tentamen vraagt naar 2025. De bedragen uit de officiële uitwerking zijn ongewijzigd overgenomen.',
      'De officiële uitwerking van opgave 3 vraag 2 vermeldt Doorlevering € 2.400.000,00; deze bronwaarde is behouden.',
      'De officiële uitwerking van opgave 3 vraag 4 verwijst bij € 23.040 naar antwoord vraag 1; die bronverwijzing is behouden.'
    ],
    sources: [
      { title: '20260429 Tentamen CAFA2 def 2 (1).pdf', kind: 'exam' },
      { title: '20260429 Uitwerking Tentamen CAFA2 (1).pdf', kind: 'model-answers' }
    ]
  };

  exam.sections.push({ id: 'opgave-1', title: 'Opgave 1 · Oostermoer bv (kapitaalbelangen)', points: 30,
    contentHtml: p('<strong>NB: In deze opgave wordt afgezien van belastingen.</strong>') +
      '<h3>Deel 1</h3>' +
      p('Oostermoer bv (hierna Oostermoer) is een vennootschap die zich bezighoudt met het organiseren van verschillende festivals in Nederland. De directie van Oostermoer heeft in tegenstelling tot de meeste bedrijven in deze branche een zeer gezonde financiële- en liquiditeitspositie, waardoor zij verschillende groeimogelijkheden ziet. Zo is eind 2024 overeenstemming bereikt over de aankoop van 60% van het geplaatste aandelenkapitaal van Dingspel bv (hierna Dingspel), gebaseerd op de balans per 31 december 2024.') +
      p('De koopsom wordt als volgt bepaald:') + list([
        'Per 1 januari 2025 verkopen de huidige aandeelhouders van Dingspel 60% van de aandelen Dingspel aan Oostermoer.',
        'De aankoopprijs van de aandelen Dingspel wordt door Oostermoer deels betaald in contanten en deels in nieuw uit te geven aandelen van Oostermoer.',
        '100 aandelen Dingspel geeft recht op 15 aandelen Oostermoer.',
        'Daarnaast ontvangen de aandeelhouders van Dingspel per verkocht aandeel Dingspel € 250 in contanten.'
      ]) +
      p('De beurskoers op het moment van uitgifte van de aandelen Oostermoer bedraagt per 31 december 2024 € 1.100 per aandeel (nominale waarde € 500). De nominale waarde van één aandeel Dingspel bedraagt € 75.') +
      p('De balans van Dingspel ziet er per 31 december 2024 als volgt uit:') +
      table(['Debet in €', '31-12-2024', 'Credit in €', '31-12-2024'], [
        ['<strong>Vaste activa</strong>', '', '<strong>Eigen vermogen</strong>', ''],
        ['- Gebouwen', '490.000', '- Geplaatst aandelenkapitaal', '75.000'],
        ['- Vervoermiddelen', '125.000', '- Overige reserves', '270.000'],
        ['', '615.000', '- Resultaat boekjaar', '-50.000'],
        ['<strong>Vlottende activa</strong>', '', '', '295.000'],
        ['- Voorraden', '250.000', '', ''],
        ['- Handelsdebiteuren', '50.000', 'Langlopende schulden', '360.000'],
        ['- Liquide middelen', '25.000', 'Kortlopende schulden', '285.000'],
        ['', '325.000', '', ''], ['Totaal', '940.000', 'Totaal', '940.000']
      ]) +
      p('Ten behoeve van de overname geldt nog het volgende:') + list([
        'De waardering van activa en passiva en de bepaling van het resultaat zijn bij zowel Oostermoer als Dingspil gebaseerd op verkrijgingsprijzen c.q. nominale waarde.',
        'De fair value van het onder de vaste activa van Dingspel opgenomen gebouw is per 31 december 2024 € 100.000 hoger dan de boekwaarde zoals die is opgenomen op de balans van Dingspel. De resterende levensduur bedraagt nog 20 jaar en de restwaarde nihil, hetgeen overeenkomt met de waarderingsgrondslagen van Oostermoer.',
        'Na beoordeling door een deskundige komt naar voren dat onder de voorraden artikelen zijn opgenomen die voor Oostermoer geen waarde hebben. Oostermoer acht hiervoor een voorziening noodzakelijk van € 30.000.',
        'Met één debiteur is nog een dispuut. De directie van Dingspel denkt dat uiteindelijk het openstaande bedrag geheel zal worden betaald. De directie van Oostermoer is van mening dat voor het gehele bedrag een voorziening nodig is ter grootte van € 10.000.'
      ]) +
      p('Oostermoer beschouwt het kapitaalbelang in Dingspel als een deelneming en waardeert deze tegen nettovermogenswaarde.') +
      '<h3>Aanvullende informatie over 2025</h3>' + list([
        'Dingspel heeft over 2025 een netto winst gemaakt van € 60.000.',
        'Op 31 maart 2025 is de jaarrekening over 2024 van Dingspel vastgesteld en is besloten om het (negatieve) resultaat boekjaar 2024 ten laste van de overige reserves te brengen. Daarnaast is besloten om een dividend ten laste van de overige reserves uit te keren ter grootte van € 30.000.',
        'Een deel van de voorraad waarvoor de directie van Oostermoer een voorziening heeft getroffen, is in maart 2025 verkocht en de rest is vernietigd. Per 31 december 2025 is er geen verschil meer in de waardering van de voorraden tussen Oostermoer en Dingspel.',
        'Het dispuut met de debiteur is deels opgelost, waardoor op het openstaande bedrag € 7.000 is ontvangen. De directie van Dingspel verwacht dat op het resterende saldo nog eens € 2.000 zal worden ontvangen en heeft voor de laatste € 1.000 een voorziening getroffen. De directie van Oostermoer is van mening dat voor het gehele resterende saldo een voorziening moet worden getroffen.'
      ]) +
      '<h3>Deel 2</h3>' +
      p('Om de festivals van drank e.d. te voorzien heeft Oostermoer, tezamen met enkele andere aandeelhouders in 2021 Fort bv (hierna Fort) opgericht. Bij oprichting zijn alle aandelen tegen nominale waarde uitgegeven. Het aandelenkapitaal van Fort en het kapitaalbelang van Oostermoer in Fort ziet er per 31 december 2024 als volgt uit:') +
      table(['Aandelensoort', 'Maatschappelijk aantal aandelen Fort', 'Geplaatste Aandelen Fort', 'Nominale waarde per aandeel Fort', 'In bezit van Oostermoer'], [
        ['Alleen winstrechten', '10.000', '6.000', '€ 100', '4.600'], ['Alleen stemrechten', '10.000', '4.000', '€ 100', '2.000'],
        ['Winst- en stemrechten', '20.000', '10.000', '€ 100', '5.000'], ['Totaal', '40.000', '20.000', '€ 100', '11.600']
      ]) +
      p('Oostermoer beschouwt Fort als een deelneming en waardeert deze tegen nettovermogenswaarde. Het eigen vermogen van Fort bedraagt per 31 december 2024:') +
      table(['Eigen vermogen Fort', 'Bedrag'], [['Geplaatst aandelenkapitaal', '€ 2.000.000'], ['Overige reserves', '€ 350.000'], ['Resultaat boekjaar', '€ 80.000'], ['Totaal eigen vermogen', '€ 2.430.000']])
  });

  function add(section, localNumber, points, prompt, solutionHtml, extra) {
    var number = exam.questions.length + 1;
    var q = { id: 'vraag-' + number, number: number, originalNumber: localNumber,
      title: 'Opgave ' + section + ' · Vraag ' + localNumber, sectionId: 'opgave-' + section,
      type: 'open', points: points, prompt: prompt, promptHtml: p(escape(prompt)),
      solution: plain(solutionHtml), solutionHtml: solutionHtml };
    if (extra) Object.keys(extra).forEach(function (key) { q[key] = extra[key]; });
    exam.questions.push(q);
  }

  add(1, 1, 5, 'Bereken per 1 januari 2025 de goodwill die door Oostermoer wordt betaald voor de aankoop van het 60% kapitaalbelang in Dingspel.',
    '<h4>Aankoop door middel van aandelenruil en contanten</h4>' +
    p('100 aandelen Dingspel = 15 aandelen Oostermoer. Door Dingspel zijn 75.000 / 75 =1.000 aandelen geplaats. Oostermoer koopt 60% van deze aandelen hetgeen 600 aandelen betreft. Om deze aandelen 600 aandelen te kopen moet Oostermoer 600 / 100 x 15 = 90 aandelen uitgeven.') +
    p('Daarnaast moet Oostermoer 600 x € 250 = € 150.000 contant betalen.') +
    p('In totaal wordt door Oostermoer betaald:') + list(['Uitgifte aandelen: 90 x € 1.100 = € 99.000 (1)', 'In contanten € 150.000 (1)', 'Totaal € 249.000']) +
    p('Hiervoor verkrijgt Oostermoer het volgende:') +
    table(['Berekening', 'Correctie', 'Bedrag', 'Punten'], [
      ['Zichtbaar intrinsieke waarde van Dingspel volgens de voorlopige balans', '', '295.000', '½'],
      ['Fair value correcties:', '', '', ''], ['Gebouw', '+100.000', '', '½'], ['Voorziening voorraden', '-30.000', '', '½'], ['Voorziening op debiteuren', '-10.000', '', '½'],
      ['Totaal correcties', '', '+60.000', ''], ['Netto vermogenswaarde', '', '355.000', ''], ['60%', '', '213.000', '½'],
      ['Betaald aan aandeelhouders Dingspel', '', '249.000', ''], ['Betaalde goodwill', '', '36.000', '½']
    ]));
  add(1, 2, 4, 'Geef gemotiveerd aan, aan de hand van het toepasselijke wetsartikel, waarom Oostermoer het kapitaalbelang Dingspel moet waarderen tegen nettovermogenswaarde.',
    p('Art 389 (1) geeft de waardering van deelnemingen met invloed van betekenis aan.') +
    p('Deelnemingen in maatschappijen waarin rechtspersonen invloed van betekenis uitoefent op het zakelijke en financiële beleid (1), worden verantwoord overeenkomstig de nettovermogenswaarde. Indien de rechtspersoon of een of meer van zijn dochtermaatschappijen alleen of samen een vijfde of meer van de stemmen van de leden, vennoten of aandeelhouders naar eigen inzicht kunnen uitbrengen of doen uitbrengen, wordt vermoed dat de rechtspersoon invloed van betekenis uitoefent (1).') +
    p('Doordat Oostermoer 60% van de stemrechten heeft verworven is er sprake van een vermoeden van invloed van betekenis. Bij uitoefening van 60% van de stemrechten is dit feitelijk ook het geval (1).'));
  add(1, 3, 5, 'Geef de journaalpost die door Oostermoer wordt gemaakt van de verwerving van de deelneming in Dingspel.',
    journal([
      ['Goodwill', '36.000', '', '½ rekening + ½ bedrag'], ['Deelneming Dingspel', '213.000', '', '½ rekening + ½ bedrag'],
      ['Aan Geplaatst aandelenkapitaal: 90 x € 500', '', '45.000', '½ rekening + ½ bedrag'],
      ['Aan Agioreserve: 90 x (€ 1.100-€ 500)', '', '54.000', '½ rekening + ½ bedrag'], ['Aan Bank', '', '150.000', '½ rekening + ½ bedrag']
    ]));
  add(1, 4, 5, 'Geef de journaalpost(en) die in 2025 worden gemaakt naar aanleiding van de winstbestemming en het dividendbesluit door: a. de administrateur van Dingspel; b. de administrateur van Oostermoer.',
    '<h4>a. de administrateur van Dingspel</h4>' +
    journal([['Overige reserves', '50.000', '', '½ rekening + ½ bedrag'], ['Aan Resultaat boekjaar', '', '50.000', '½ rekening']], 'Winstbestemming') +
    journal([['Overige reserves', '30.000', '', '½ rekening + ½ bedrag'], ['Aan Te betalen dividend / bank', '', '30.000', '½ rekening']], 'Dividendbesluit') +
    '<h4>b. de administrateur van Oostermoer</h4>' + p('Winstbestemming: Geen boeking (½).') +
    journal([['Bank / te ontvangen dividend: 30.000 x 60%', '18.000', '', '½ rekening + ½ bedrag'], ['Aan Deelneming', '', '18.000', '½ rekening']], 'Dividendbesluit'));
  add(1, 5, 4, 'Bereken het resultaat deelneming Dingspel zoals Oostermoer dat in haar enkelvoudige winst-en-verliesrekening over 2025 verantwoordt.',
    table(['Berekening', 'Correctie', 'Bedrag', 'Punten'], [
      ['Resultaat Dingspel volgens eigen grondslagen', '', '60.000', '½'], ['Fair value correcties:', '', '', ''],
      ['Hogere afschrijving gebouwen', '-5.000', '', '½'], ['Vrijval voorziening voorraden', '+30.000', '', '1'], ['Vrijval voorziening debiteuren', '+8.000', '', '1'],
      ['Totaal correcties', '', '+33.000', ''], ['Resultaat op netto vermogenswaarde', '', '93.000', '½'], ['60%', '', '55.800', '½']
    ]));
  add(1, 6, 3, 'Kwalificeert Fort als een dochtermaatschappij van Oostermoer? Motiveer uw antwoord aan de hand van het geldende wetsartikel.',
    p('In art 24a Titel 1 BW 2 wordt bepaald wanneer sprake is van een dochtermaatschappij. (1)') +
    p('Lid 1. Een dochtermaatschappij van een rechtspersoon is:') +
    p('a. Een rechtspersoon waarin de rechtspersoon of een of meer van zijn dochtermaatschappijen, al dan niet krachtens overeenkomst met andere stemgerechtigden, alleen of samen meer dan de helft van de stemrechten in de algemene vergadering kunnen uitoefenen;') +
    p('b. Een rechtspersoon waarvan de rechtspersoon of een of meer van zijn dochtermaatschappijen lid of aandeelhouder zijn en, al dan niet krachtens overeenkomst met andere stemgerechtigden, alleen of samen meer dan de helft van de bestuurders kunnen benoemen of ontslaan, ook indien alle stemgerechtigden stemmen in de algemene vergadering kunnen uitoefenen.') +
    p('Lid 2. Met een dochtermaatschappij wordt gelijk gesteld onder een onder eigen naam optredende vennootschap, waarvan de vennoot volledig aansprakelijk vennoot is.') +
    p('OOSTERMOER heeft het volgende aandelen belang:') + p('Stemrechten: (2.000+5.000) / (4.000+10.000) = 50% (1)') +
    p('Dit houdt in dat Oostermoer geen meerderheid van stemmen in de algemene vergadering van aandeelhouders van Fort heeft. Op basis van art 24a lid 1 is Fort geen dochtermaatschappij van Oostermoer. (1)') +
    p('Er is geen verdere informatie gegeven over de aandelenrelatie, waardoor er ook geen sprake is van een dochtermaatschappij op basis van art 24a lid b.'));
  add(1, 7, 4, 'Bereken het bedrag waartegen Oostermoer haar kapitaalbelang in Fort per 31 december 2024 op haar balans waardeert.',
    p('Winst en stemrechten: (4.600 + 5000) / (6.000+10.000) = 60% (1)') +
    p('60% x (€ 350.000 + € 80.000) (1) + 9.600 x € 100 (1) = € 1.218.000') +
    p('Alleen stemrechten: 2.000 x € 100 = € 200.000 (1)') + p('Totaal: € 1.418.000'));

  exam.sections.push({ id: 'opgave-2', title: 'Opgave 2 · Ruinen bv (vreemde valuta)', points: 20,
    contentHtml: p('<strong>NB: In deze opgave wordt afgezien van winstbelasting.</strong>') +
      p('Ruinen bv (hierna Ruinen), gevestigd in Nederland, is een producent van premium speciaal bier onder de merknaam Ruiner bier. Vanwege het grote succes is Ruinen het Ruiner bier ook vanaf 2024 gaan verkopen in het buitenland, met name in het Verenigd Koninkrijk. Om meer invloed op de markt te krijgen heeft Ruinen per 31 december 2024 70% van de aandelen van de in het Verenigd Koninkrijk gevestigde bierhandelaar The Knight Ltd. (hierna The Knight) gekocht. De lokale valuta van The Knight is de Britse Pond (Great British Pound (GBP), hierna ook weergegeven als £).') +
      p('De aankoopprijs bedraagt £ 700.000 en is per bank betaald. Ruinen waardeert haar 70%-deelneming in The Knight tegen nettovermogenswaarde welke op overnamedatum gelijk is aan het zichtbaar eigen vermogen van The Knight.') +
      p('Ruinen beschouwt de euro als haar functionele valuta en presentatievaluta.') +
      p('Van The Knight zijn de (overname)balans per 31 december 2024 en de balans per 31 december 2025 weergegeven, alsmede de winst-en-verliesrekening over 2025, alle luidende in GBP (£):') +
      table(['Activa', '31-12-2025', '31-12-2024', 'Passiva', '31-12-2025', '31-12-2024'], [
        ['Gebouw', '600.000', '500.000', 'Geplaatst aandelenkapitaal', '100.000', '100.000'],
        ['Voorraad fusten', '165.000', '240.000', 'Overige reserves', '580.000', '530.000'],
        ['Handelsdebiteuren', '120.000', '70.000', 'Resultaat boekjaar', '20.000', '100.000'],
        ['', '', '', 'Langlopende lening', '200.000', '100.000'],
        ['Liquide middelen', '75.000', '50.000', 'Handelscrediteuren', '60.000', '30.000'],
        ['Totaal', '960.000', '860.000', 'Totaal', '960.000', '860.000']
      ], 'Balans The Knight Ltd. ultimo boekjaar (bedragen x GBP 1)') +
      table(['Debet', 'Bedrag', 'Credit', 'Bedrag'], [
        ['Kostprijs van de omzet', '275.000', 'Omzet', '500.000'], ['Afschrijving gebouw', '50.000', '', ''],
        ['Afwaardering voorraad fusten', '35.000', '', ''], ['Afwaardering debiteur', '30.000', '', ''], ['Overige kosten', '90.000', '', ''],
        ['Resultaat', '20.000', '', ''], ['Totaal', '500.000', 'Totaal', '500.000']
      ], 'Winst-en-verliesrekening The Knight Ltd. over 2025 (bedragen x GBP 1)') +
      p('De grondslagen voor waardering en resultaatbepaling geschiedt bij zowel Ruinen als The Knight op basis van verkrijgingsprijs dan wel nominale waarde.') +
      '<h3>Noodzakelijke toelichting over 2025</h3>' + list([
        'Het gebouw is aangekocht in 2023. In het tweede halfjaar van 2025 heeft een verbouwing plaatsgevonden die in totaal £ 150.000 heeft gekost en in het tweede halfjaar volledig is betaald. Afronding van de verbouwing en ingebruikname is op 1 oktober 2025. De afschrijvingslast over het verbouwde deel bedraagt over 2025 £ 15.000. Voor deze gehele investering is een langlopende lening afgesloten met een aflossingsverplichting per 31 december van elk jaar.',
        'Op 31 december 2024 bestaat bij The Knight de bij Ruinen in november 2024 gekochte voorraad Ruiner bier uit 8.000 fusten à £ 30 (£ 240.000). Voor de voorraadwaardering past The Knight het FIFO systeem toe.',
        'In 2025 hebben de volgende goederenleveranties plaatsgevonden:' + list(['01-02-2025: verkoop 5.000 fusten à £ 60 (£ 300.000)', '01-03-2025: inkoop 6.000 fusten à £ 35 (£ 210.000)', '01-08-2025: verkoop 4.000 fusten à £ 50 (£ 200.000)', '01-11-2025: inkoop 1.000 fusten à £ 25 (£ 25.000)']) + 'Alle inkopen en verkopen geschieden op rekening.',
        'Door een overstroming in oktober 2025 moeten 1.000 fusten, ingekocht in maart 2025, als verloren worden beschouwd.',
        'Per 1 februari 2025 is een openstaande debiteur failliet gegaan. Het gehele openstaande bedrag van £ 30.000 is op 31 december 2025 als oninbaar afgeboekt.',
        'Op 1 april 2025 is door The Knight uit het resultaat over 2024 een dividend van £ 50.000 per bank uitgekeerd aan haar aandeelhouders. Het restant is toegevoegd aan de overige reserves.',
        'De overige kosten worden gespreid over het jaar betaald.'
      ]) +
      p('Voor deze opgave geldt het volgende koersverloop van de Britse Pond (£):') +
      table(['Periode', 'Koers'], [['Tot en met 1 december 2024', '£ 1 = € 1,11'], ['Van 2 december 2024 tot met 1 januari 2025', '£ 1 = € 1,12'], ['2 januari 2025 t/m 30 juni 2025', '£ 1 = € 1,20'], ['1 juli 2025 t/m 30 december 2025', '£ 1 = € 1,09'], ['31 december 2025', '£ 1 = € 1,11'], ['Gemiddelde koers 2025', '£ 1 = € 1,13']]) +
      '<h3>Uitgangspunt vragen 2 t/m 4</h3>' + p('Veronderstel dat Ruinen voor de omrekening van de posten van de balans en winst-en-verliesrekening uitgaat van de tijdstipmethode.') +
      '<h3>Uitgangspunt vragen 5 en 6</h3>' + p('Veronderstel dat Ruinen voor de omrekening van de posten van de balans en winst-en-verliesrekening uitgaat van de slotkoersmethode.')
  });

  add(2, 1, 1, 'Geef de journaalpost die Ruinen in haar grootboek heeft gemaakt naar aanleiding van het per 31 december 2024 aangekochte kapitaalbelang in The Knight.',
    journal([['0.. Deelneming (£ 511.000 x € 1,12)', '€ 572.320', '', ''], ['0.. Goodwill (£ 189.000 x € 1,12)', '€ 211.680', '', ''], ['aan 1.. Bank (£ 700.000 x € 1,12)', '', '€ 784.000', '']]) + p('1 punt g/f'));
  add(2, 2, 3, 'Geef een gespecificeerde berekening van de boekwaarde van de posten gebouw en voorraad fusten in de balans van The Knight per 31 december 2025 in euro’s.',
    table(['Gebouw', 'Bedrag GBP', 'Koers', 'Bedrag EUR', 'Punten'], [
      ['31-12-2024', '£ 500.000', '£ 1,12', '€ 560.000', '½'], ['Afschrijving oud bouw', '£ 35.000', '£ 1,12', '€ 39.200 -/-', '½'],
      ['Investering', '£ 150.000', '£ 1,09', '€ 163.500', '½'], ['Afschrijving nieuwbouw', '£ 15.000', '£ 1,09', '€ 16.350 -/-', '½'], ['31-12-2025', '', '', '€ 667.950', '']
    ]) +
    table(['Voorraad fusten', 'Aantal', 'Prijs', 'Bedrag GBP', 'Koers', 'Bedrag EUR', 'Punten'], [
      ['Inkoop 01-03-2025', '4.000', '£ 35', '£ 140.000', '£ 1,20', '€ 168.000', '½'], ['Inkoop 01-11-2025', '1.000', '£ 25', '£ 25.000', '£ 1,09', '€ 27.250', '½'], ['31-12-2025', '', '', '', '', '€ 195.250', '']
    ]), { context: 'Tijdstipmethode' });
  add(2, 3, 2, 'Geef een gespecificeerde berekening van de post kostprijs van de omzet en afwaardering voorraad fusten in de winst-en-verliesrekening van The Knight over 2025 in euro’s.',
    table(['Kostprijs omzet', 'Aantal', 'Prijs', 'Bedrag GBP', 'Koers', 'Bedrag EUR', 'Punten'], [
      ['01-02-2025', '5.000 fusten', '£ 30', '£ 150.000', '€ 1,12', '€ 168.000', '½'],
      ['01-08-2025', '3.000 fusten', '£ 30', '£ 90.000', '€ 1,12', '€ 100.800', '½'],
      ['', '1.000 fusten', '£ 35', '£ 35.000', '€ 1,20', '€ 42.000', '½'], ['Totaal', '', '', '£ 275.000', '', '€ 310.800', '']
    ]) + '<h4>Afwaardering voorraad fusten</h4>' + p('£ 35.000 x € 1,20 = € 42.000 (½)'), { context: 'Tijdstipmethode' });
  add(2, 4, 6, 'Geef een gespecificeerde berekening van het koersverschil/omrekenverschil over 2025. Geef hierbij aan of dit resultaat positief of negatief is én in het eigen vermogen of resultaat wordt verwerkt.',
    p('<strong>Bronnotitie:</strong> de vraagherhaling in de officiële uitwerking noemt 2020; de oorspronkelijke tentamenvraag en de onderstaande berekening betreffen 2025.') +
    table(['Berekening', 'Bedrag GBP', 'Koers €', 'Bedrag €', 'Punten'], [
      ['01-01-2025 monetaire positie', '-/- 10.000', '1,12', '-/- 11.200', '½'], ['Mutaties:', '', '', '', ''],
      ['Verbouwing', '-/- 150.000', '1,09', '-/- 163.500', '½'], ['Verkoop eerste halfjaar', '300.000', '1,20', '360.000', '½'], ['Inkoop eerste halfjaar', '-/- 210.000', '1,20', '-/- 252.000', '½'],
      ['Verkoop tweede halfjaar', '200.000', '1,09', '218.000', '½'], ['Inkoop tweede halfjaar', '-/- 25.000', '1,09', '-/- 27.250', '½'], ['Afwaardering debiteur', '-/- 30.000', '1,11', '-/- 33.300', '½'],
      ['Overige kosten', '-/- 90.000', '1,13', '-/- 101.700', '½'], ['Uitgekeerd dividend', '-/- 50.000', '1,20', '-/- 60.000', '½'],
      ['Monetaire positie theoretisch', '-/- 65.000', '', '-/- 70.950', ''], ['31-12-2025 monetaire positie', '-/- 65.000', '1,11', '-/- 72.150', '½'],
      ['Koersverlies in w&v', '', '', '-/- 1.200', '½ koersverlies + ½ w&v']
    ]), { context: 'Tijdstipmethode' });
  add(2, 5, 3, 'Geef voor het gebouw een gespecificeerde berekening van het koersverschil/omrekenverschil over 2025. Geef hierbij aan of dit resultaat positief of negatief is én in het eigen vermogen of resultaat wordt verwerkt.',
    table(['Mutaties op het vermogen', 'Bedrag GBP', 'Koersverschil', 'Bedrag EUR', 'Punten'], [
      ['Oudbouw', '£ 500.000', '(€ 1,12 -/- € 1,11)', '€ 5.000 -/-', '1'], ['Afschrijving oudbouw', '£ 35.000 -/-', '(€ 1,13 -/- € 1,11)', '€ 700 +', '½'],
      ['Verbouwing', '£ 150.000', '(€ 1,09 -/- € 1,11)', '€ 3.000 +', '½'], ['Afschrijving nieuwbouw', '£ 15.000 -/-', '(€ 1,13 -/- € 1,11)', '€ 300 +', '½'], ['Totaal', '', '', '€ 1.000 -/-', '']
    ]) + p('Verwerken in eigen vermogen (½)') +
    '<h4>Alternatief</h4>' + table(['Berekening', 'Bedrag GBP / koers', 'Bedrag EUR', 'Punten'], [
      ['01-01-2025: oudbouw', '£ 500.000 x 1,12', '€ 560.000', '½'], ['2e hj: nieuwbouw', '£ 150.000 x 1,09', '€ 163.500', '½'],
      ['Afschrijving oudbouw', '-/- £ 35.000 x 1,13', '€ 39.550 -/-', '½'], ['Afschrijving nieuwbouw', '-/- £ 15.000 x 1,13', '€ 16.950 -/-', ''],
      ['31-12-2025 balans gebouw', '', '€ 667.000', ''], ['31-12-2025 gebouw tegen slotkoers', '', '€ 666.000', '½'], ['Koersverschil', '', '€ 1.000 -/-', '½']
    ]) + p('(verwerken in eigen vermogen) (½)'), { context: 'Slotkoersmethode' });
  add(2, 6, 5, 'Geef de journaalpost(en) die Ruinen eind 2025 in haar grootboek heeft gemaakt met betrekking tot haar deelneming in The Knight.',
    journal([['1.. Deelneming', '€ 13.580', '', '½ rekening'], ['0.. Reserve omrekeningsverschillen', '€ 2.240', '', '½ rekening + 3 specificatie'], ['aan 9.. Resultaat deelneming (£ 20.000 x € 1,13 x 70%)', '', '€ 15.820', '½ rekening + ½ bedrag']]) +
    '<h4>Specificatie omrekeningsverschillen (toedeling 3 punten)</h4>' +
    table(['Berekening', 'Bedrag GBP', 'Koersverschil', 'Bedrag EUR', 'Punten'], [
      ['Vermogen 31-12-2024', '£ 730.000', '(€ 1,11 -/- € 1,12)', '€ 7.300 -/-', '½'], ['Dividend', '£ 50.000 -/-', '(€ 1,11 -/- € 1,20)', '€ 4.500 +', '1'],
      ['Resultaat 2025', '£ 20.000', '(€ 1,11 -/- € 1,13)', '€ 400 -/-', '1'], ['Totaal', '', '', '€ 3.200 -/-', ''], ['Aandeel 70%', '', '', '€ 2.240 -/-', '½']
    ]) + '<h4>Controle</h4>' +
    table(['Berekening', 'Bedrag GBP', 'Koers', 'Bedrag EUR', 'Aandeel', '70% in EUR'], [
      ['31-12-2024', '£ 730.000', '€ 1,12', '€ 817.600', '70%', '€ 572.320'], ['Resultaat', '£ 20.000', '€ 1,13', '€ 22.600', '70%', '€ 15.820'],
      ['Dividend', '£ 50.000 -/-', '€ 1,20', '€ 60.000 -/-', '70%', '€ 42.000 -/-'], ['', '', '', '€ 780.200', '70%', '€ 546.140'],
      ['Reserve omrekeningsverschillen', '', '', '€ 3.200 -/-', '70%', '€ 2.240 -/-'], ['31-12-2025', '£ 700.000', '€ 1,11', '€ 777.000', '70%', '€ 543.900']
    ]), { context: 'Slotkoersmethode' });

  exam.sections.push({ id: 'opgave-3', title: 'Opgave 3 · Moderna bv (consolidatie nettovermogenswaarde)', points: 30,
    contentHtml: p('<strong>NB 1: In dit vraagstuk wordt rekening gehouden met een winstbelastingtarief van 20%.</strong>') +
      p('NB 2: Alle antwoorden moeten worden ingevuld in Cirrus. Om veel bladeren in Cirrus te voorkomen adviseren we jullie om de tabellen ook op dit tentamenpapier in te vullen.') +
      p('Het Moderna bv (hierna Moderna) concern levert hoogwaardige onderdelen voor de productie van oplaadpalen voor elektrische auto’s. Moderna heeft sinds enige jaren een tweetal deelnemingen, namelijk een 75% kapitaalbelang in Power4You bv (hierna Power4You) en een 60% kapitaalbelang in ChargeIT bv (hierna ChargeIT). Zowel Moderna als Power4You leveren reeds jaren goederen aan ChargeIT, die de oplaadpalen levert aan derden.') +
      p('Met betrekking tot het boekjaar 2025 zijn de volgende gegevens beschikbaar met betrekking tot de leveringen van Moderna aan ChargeIT:') + list([
        'In 2025 heeft Moderna voor € 4.000.000 aan goederen geleverd aan ChargeIT (hierin is een winst van Moderna begrepen van € 800.000).',
        'De voorraad goederen bij ChargeIT afkomstig van Moderna bedroeg op 1 januari 2025 € 320.000 (hierin is een winst van Moderna begrepen van € 64.000).',
        'De voorraad goederen bij ChargeIT afkomstig van Moderna bedroeg op 31 december 2025 € 480.000 (hierin is een winst van Moderna begrepen van € 96.000).'
      ]) +
      p('Met betrekking tot het boekjaar 2025 zijn de volgende gegevens beschikbaar met betrekking tot de leveringen van Power4You aan ChargeIT:') + list([
        'In 2025 heeft Power4You voor € 2.400.000 aan goederen geleverd aan ChargeIT (hierin is een winst van Power4You begrepen van € 720.000).',
        'De voorraad goederen bij ChargeIT afkomstig van Power4You bedroeg op 1 januari 2025 € 760.000 (hierin is een winst van Power4You begrepen van € 228.000).',
        'De voorraad goederen bij ChargeIT afkomstig van Power4You bedroeg op 31 december 2025 € 600.000 (hierin is een winst van Power4You begrepen van € 180.000).'
      ]) +
      '<h3>Aanvullende informatie voor vragen 4 t/m 6</h3>' +
      p('Na boeking van de bij vraag 3 gevraagde intracomptabele correctieboeking(en) bedraagt het resultaat deelnemingen op de enkelvoudige winst-en-verliesrekening over 2025 van Moderna in totaal € 365.040. Dit resultaat deelnemingen over 2025 heeft voor € 173.040 betrekking op Power4You en voor € 192.000 op ChargeIT. Het resultaat na belastingen van Power4You over 2025 bedraagt € 200.000 en het resultaat na belastingen van ChargeIT over 2025 € 320.000.')
  });

  var prompt31 = 'Stel de onderstaande voorraadtabel samen aan de hand van de goederenleveringen over 2025 van Moderna aan ChargeIT.';
  add(3, 1, 1, prompt31,
    '<h4>Downstreamleveringen van Moderna aan ChargeIT (1 punt)</h4>' + table(stockHeaders, [
      ['', '', '100%', '60%', '…%', '40%'], ['31-12-2024', '320.000', '64.000', '38.400', '', '25.600'],
      ['31-12-2025', '480.000', '96.000', '57.600', '', '38.400'], ['Toename', '160.000', '32.000', '19.200', '', '12.800']
    ]) + table(['Leveringen', 'Bedrag'], [['Moderna → ChargeIT', '€ 4.000.000,00'], ['EV toename', '€ 160.000,00'], ['Doorlevering', '€ 3.840.000,00']]),
    { promptHtml: p(prompt31) + stockBlank + stockNote });
  var prompt32 = 'Stel de onderstaande voorraadtabel samen aan de hand van de goederenleveringen over 2025 van Power4You aan ChargeIT.';
  add(3, 2, 1, prompt32,
    '<h4>Sidestreamleveringen van Power4You aan ChargeIT (1 punt)</h4>' + table(stockHeaders, [
      ['', '', '100%', '60%', '25%', '15%'], ['31-12-2024', '760.000', '228.000', '136.800', '57.000', '34.200'],
      ['31-12-2025', '600.000', '180.000', '108.000', '45.000', '27.000'], ['Afname', '160.000', '48.000', '28.800', '12.000', '7.200']
    ]) + table(['Leveringen', 'Bedrag'], [['Power4You → ChargeIT', '€ 2.400.000,00'], ['EV afname', '€ 160.000,00'], ['Doorlevering', '€ 2.400.000,00']]) +
    p('<strong>Bronnotitie:</strong> Doorlevering € 2.400.000,00 is letterlijk overgenomen uit de officiële uitwerking.'),
    { promptHtml: p(prompt32) + stockBlank + stockNote });
  add(3, 3, 5, 'Welke journaalpost(en) is (zijn) per 31 december 2025 gemaakt in de enkelvoudige jaarrekening van Moderna in verband met de nog niet gerealiseerde intercompanyresultaten (intracomptabele correctieboekingen).',
    p('<strong>Bronnotitie:</strong> de officiële uitwerking herhaalt deze vraag met het jaartal 2020; het oorspronkelijke tentamen vraagt naar 2025.') +
    '<h4>Downstreamleveringen van Moderna aan ChargeIT</h4>' +
    journal([['9.. Niet gerealiseerde winst door transacties met ChargeIT', '€ 19.200', '', '½ rekening + ½ bedrag'], ['1.. aan Overlopende passiva', '', '€ 19.200', '½ bedrag']]) +
    journal([['0.. Voorziening belastingen', '€ 3.840', '', '½ rekening + ½ bedrag'], ['9.. aan Belastinglast', '', '€ 3.840', '½ bedrag']]) +
    '<h4>Sidestreamleveringen (afnemend belang) van Power4You aan ChargeIT</h4>' +
    journal([['9.. Deelnemingen', '€ 23.040', '', '½ rekening + ½ bedrag'], ['0.. aan Resultaat deelnemingen', '', '€ 23.040', '½ rekening + ½ bedrag']]));
  add(3, 4, 4, 'Geef de eliminatieboeking(en) die in verband met het resultaat deelnemingen van Power4You en ChargeIT is (zijn) gemaakt ten behoeve van de samenstelling van de geconsolideerde winst-en-verliesrekening over 2025.',
    p('<strong>Bronnotitie:</strong> de officiële uitwerking herhaalt deze vraag met het jaartal 2020; het oorspronkelijke tentamen vraagt naar 2025.') +
    journal([['Resultaat deelnemingen', '€ 365.040', '', '½ rekening + ½ bedrag'], ['Aandeel derden', '€ 178.000', '', '½ rekening + ½ bedrag'], ['Aan Resultaat na belastingen (Power4You)', '', '€ 223.040', '½ rekening + ½ bedrag'], ['Aan Resultaat na belastingen (ChargeIT)', '', '€ 320.000', '½ rekening + ½ bedrag']]) +
    p('Aandeel derden = 25% x € 200.000 + 40% x € 320.000 = € 178.000') +
    p('Resultaat na belastingen Power4You = € 200.000 + € 23.040 (antwoord vraag 1)') +
    p('<strong>Bronnotitie:</strong> de verwijzing “antwoord vraag 1” staat zo in de officiële uitwerking.'));
  add(3, 5, 12, 'Geef de eliminatieboeking(en) die ten behoeve van de samenstelling van de geconsolideerde winst-en-verliesrekening over 2025 moet(en) worden gemaakt: a. in verband met de onderlinge levering van goederen van Moderna aan ChargeIT; b. in verband met de onderlinge levering van goederen van Power4You aan ChargeIT.',
    p('<strong>Bronnotitie:</strong> de officiële uitwerking herhaalt deze vraag met het jaartal 2020; het oorspronkelijke tentamen vraagt naar 2025.') +
    '<h4>5A. Moderna aan ChargeIT (6 punten)</h4>' +
    journal([['Omzet', '€ 3.840.000', '', '½ rekening + ½ bedrag'], ['Aan Kostprijs van de omzet', '', '€ 3.840.000', '½ bedrag']]) +
    journal([['Omzet', '€ 160.000', '', '½ bedrag'], ['Aan Kostprijs van de omzet', '', '€ 128.000,00', '½ rekening + ½ bedrag'], ['Aan Niet gerealiseerde winst door transacties met ChargeIT', '', '€ 19.200,00', '½ rekening + ½ bedrag'], ['Aan Resultaat na belastingen', '', '€ 10.240,00', '½ rekening + ½ bedrag'], ['Aan Belastinglast', '', '€ 2.560,00', '½ rekening + ½ bedrag']]) +
    '<h4>5B. Power4You aan ChargeIT (6 punten)</h4>' +
    journal([['Omzet', '€ 2.400.000', '', '½ rekening + ½ bedrag'], ['Aan Kostprijs van de omzet', '', '€ 2.400.000', '½ bedrag']]) +
    journal([['Resultaat na belastingen', '€ 23.040', '', '½ rekening + ½ bedrag'], ['Belastinglast', '€ 5.760', '', ''], ['Aandeel derden', '€ 9.600', '', '½ rekening + ½ bedrag'], ['Belastinglast', '€ 2.400', '', ''], ['Resultaat na belastingen', '€ 5.760', '', '½ rekening + ½ bedrag'], ['Belastinglast', '€ 1.440', '', '½ rekening + ½ bedrag'], ['Aan Kostprijs van de omzet', '', '€ 48.000', '½ bedrag']]));
  add(3, 6, 7, 'Geef de eliminatieboeking(en) ten behoeve van de samenstelling van de geconsolideerde balans per 31 december 2025 moet(en) worden gemaakt in verband met de onderlinge levering van goederen van Power4You aan ChargeIT.',
    p('<strong>Bronnotitie:</strong> de officiële uitwerking herhaalt deze vraag met het jaartal 2020; het oorspronkelijke tentamen vraagt naar 2025.') +
    journal([['Deelnemingen', '€ 86.400', '', '½ rekening + ½ bedrag'], ['Voorziening belastingen', '€ 21.600', '', ''], ['Belang derden', '€ 36.000', '', '½ rekening + ½ bedrag'], ['Voorziening belastingen', '€ 9.000', '', ''], ['Resultaat boekjaar', '€ 21.600', '', '½ rekening + ½ bedrag'], ['Voorziening belastingen', '€ 5.400', '', '½ rekening + ½ bedrag'], ['Aan Voorraden', '', '€ 180.000', '½ rekening + ½ bedrag']]) +
    journal([['Overige reserves', '€ 27.360', '', '½ rekening + ½ bedrag'], ['Aan Resultaat boekjaar', '', '€ 27.360', '½ rekening + ½ bedrag']]));

  exam.sections.push({ id: 'opgave-4', title: 'Opgave 4 · Baldetti bv (consolidatie verkrijgingsprijs)', points: 20,
    contentHtml: p('<strong>NB 1: In dit vraagstuk wordt rekening gehouden met een winstbelastingtarief van 20%.</strong>') +
      p('NB 2: Alle antwoorden moeten worden ingevuld in Cirrus. Om veel bladeren in Cirrus te voorkomen adviseren we jullie om de tabellen ook op dit tentamenpapier in te vullen.') +
      p('Wijnhandel Baldetti bv (hierna Baldetti) is een handelsbedrijf gespecialiseerd in Italiaanse wijnen. Op 2 januari 2024 heeft Baldetti 80% van de aandelen van Vinsanto bv (hierna Vinsanto), een handelsbedrijf gespecialiseerd in Italiaanse dessertwijnen, verkregen tegen betaling per bank van € 2.000.000.') +
      p('De gedeeltelijke balans van Vinsanto ziet er aan het einde van 2025 als volgt uit:') +
      table(['Debet', 'Bedrag', 'Credit', 'Bedrag'], [['Voorraad goederen', '1.900.000', 'Geplaatste aandelenkapitaal', '500.000'], ['Diverse activa', '1.600.000', 'Overige reserves', '1.500.000'], ['', '', 'Resultaat boekjaar', '1.000.000'], ['', '', 'Overige kortlopende schulden', '500.000']], 'Gedeeltelijke balans Vinsanto bv per 31-12-2025 (* € 1,-)') +
      p('Over het boekjaar 2025 is verder het volgende bekend over Vinsanto:') + list([
        'De fair value van de activa en passiva van Vinsanto komen op overnametijdstip overeen met het zichtbaar eigen vermogen van Vinsanto.',
        'Na aankoop hebben geen mutaties in het geplaatste aandelenkapitaal en de overige reserves plaatsgevonden (het resultaat over 2024 bedroeg € 0).',
        'De bij de verkrijging van Vinsanto betaalde goodwill van € 400.000 wordt bij consolidatie, ingaande op tijdstip van verkrijging, lineair afgeschreven in 10 jaar.',
        'Over de leveringen van Baldetti aan Vinsanto zijn de volgende gegevens over 2025 beschikbaar:' + list([
          'De voorraad dessertwijnen bij Vinsanto, afkomstig van Baldetti, bedraagt op 1 januari 2025 € 500.000. Hierin is een winst van Baldetti begrepen van € 100.000.',
          'In 2025 heeft Baldetti voor € 2.000.000 aan dessertwijnen geleverd aan Vinsanto. Hierin is een winst van Baldetti begrepen van € 400.000.',
          'De voorraad dessertwijnen bij Vinsanto, afkomstig van Baldetti, bedraagt op 31 december 2025 € 400.000. Hierin is een winst van Baldetti begrepen van € 80.000.'
        ])
      ])
  });
  var prompt41 = 'Stel onderstaande voorraadtabel samen met betrekking tot de intercompany-leveringen van Baldetti aan Vinsanto.';
  add(4, 1, 1, prompt41,
    table(stockHeaders, [['', '', '100%', '…%', '…%', '100%'], ['31-12-2024', '500.000', '100.000', '', '', '100.000'], ['31-12-2025', '400.000', '80.000', '', '', '80.000'], ['Afname', '100.000', '20.000', '', '', '20.000']]),
    { promptHtml: p(prompt41) + stockBlank + stockNote });
  add(4, 2, 1, 'Geef de journaalpost(en) die in 2025 dan wel per 31 december 2025 is (zijn) gemaakt in de enkelvoudige jaarrekening van Baldetti in verband met de nog niet gerealiseerde intercompanyresultaten (intracomptabele correctieboeking(en)).',
    '<h4>Intracomptabele journaalpost</h4>' + p('Geen, er wordt gewaardeerd tegen verkrijgingsprijs. (1)'));
  add(4, 3, 11, 'Geef de eliminatieboeking(en) die ten behoeve van de samenstelling van de geconsolideerde balans per 31 december 2025 moet(en) worden gemaakt: a. in verband met de deelneming in Vinsanto; b. in verband met het belang derden; c. in verband met de goodwill; d. in verband met de onderlinge leveringen van goederen.',
    journal([['Aandelenkapitaal', '€ 400.000', '', '½'], ['Overige reserves', '€ 1.200.000', '', '½'], ['Goodwill', '€ 400.000', '', '½'], ['Aan Deelneming in Vinsanto (80%)', '', '€ 2.000.000', '½']], '3.A. Eliminatieboeking (2 punten)') +
    journal([['Aandelenkapitaal', '€ 100.000', '', '½'], ['Overige reserves', '€ 300.000', '', '½'], ['Resultaat boekjaar', '€ 200.000', '', '½'], ['Aan Belang derden (20%)', '', '€ 600.000', '½']], '3.B. Eliminatieboeking (2 punten)') +
    journal([['Overige reserves', '€ 40.000', '', '½ rekening + ½ bedrag'], ['Resultaat boekjaar', '€ 40.000', '', '½ rekening + ½ bedrag'], ['Aan Goodwill', '', '€ 80.000', '½ rekening + ½ bedrag']], '3.C. Eliminatieboeking (3 punten)') +
    journal([['Resultaat boekjaar', '€ 64.000', '', '½ rekening + ½ bedrag'], ['Voorziening latente belastingen', '€ 16.000', '', '½ rekening + ½ bedrag'], ['Aan Voorraad', '', '€ 80.000', '½ rekening']], '3.D.I. Eliminatieboeking (2,5 punten)') +
    journal([['Overige reserves', '€ 80.000', '', '½ rekening + ½ bedrag'], ['Aan Resultaat boekjaar', '', '€ 80.000', '½ rekening']], '3.D.II. Eliminatieboeking (1,5 punten)'));
  add(4, 4, 7, 'Geef de eliminatieboeking(en) die ten behoeve van de samenstelling van de geconsolideerde winst-en-verliesrekening over 2025 moet(en) worden gemaakt: a. in verband met de aandeel derden; b. in verband met de afschrijving goodwill; c. in verband met de onderlinge leveringen van goederen.',
    journal([['Aandeel derden', '€ 200.000', '', '½ rekening + ½ bedrag'], ['Aan Resultaat na belastingen', '', '€ 200.000', '½ rekening']], '4.A. Eliminatieboeking (1,5 punten)') +
    journal([['Afschrijvingskosten goodwill', '€ 40.000', '', '½ rekening + ½ bedrag'], ['Aan Resultaat na belastingen', '', '€ 40.000', '½ rekening']], '4.B. Eliminatieboeking (1,5 punten)') +
    journal([['Omzet', '€ 2.000.000', '', '½ rekening + ½ bedrag'], ['Aan Kostprijs van de omzet', '', '€ 2.000.000', '½ rekening']], '4.C. Eliminatieboeking (4 punten)') +
    journal([['Resultaat na belastingen (€ 20.000 * 80%)', '€ 16.000', '', '½ rekening + ½ bedrag'], ['Belastinglast (€ 20.000 * 20%)', '€ 4.000', '', '½ rekening + ½ bedrag'], ['Aan Kostprijs van de omzet', '', '€ 20.000', '½ rekening']]));

  // The method changes between questions within opgave 2. Repeat the exact
  // source instruction above the relevant question as well as in its section.
  exam.questions.forEach(function (q) {
    if (q.context) q.promptHtml = p('Veronderstel dat Ruinen voor de omrekening van de posten van de balans en winst-en-verliesrekening uitgaat van de ' + q.context.toLowerCase() + '.') + q.promptHtml;
  });
  window.CAFA2_EXAMS.push(exam);
})();
