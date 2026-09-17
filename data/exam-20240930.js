/* Full transcription of the user-supplied 30 September 2024 paper and answer key.
 * Source inconsistencies are retained and identified, not silently corrected.
 */
(function () {
  'use strict';
  function p(s) { return '<p>' + s + '</p>'; }
  function h(s) { return '<h3>' + s + '</h3>'; }
  function ul(items) { return '<ul>' + items.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul>'; }
  function table(head, rows, caption) {
    return '<div class="exam-table-wrap"><table>' + (caption ? '<caption>' + caption + '</caption>' : '') + '<thead><tr>' + head.map(function (s) { return '<th scope="col">' + s + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.map(function (row) { return '<tr>' + row.map(function (s) { return '<td>' + s + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }
  function jp(rows, caption) { return table(['Rekening / toelichting', 'Debet (€)', 'Credit (€)', 'Normering'], rows, caption || 'Journaalpost'); }
  function plain(s) { return s.replace(/<\/(?:p|h3|li|tr|table|div)>/g, '\n').replace(/<\/(?:td|th)>/g, ' | ').replace(/<br\s*\/?\s*>/g, '\n').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\n{3,}/g, '\n\n').trim(); }
  function note(s) { return p('<strong>Bronnotitie:</strong> ' + s); }
  function q(section, number, points, promptHtml, solutionHtml) {
    return { id: 'vraag-' + number, number: number, originalNumber: number, title: 'Vraag ' + number, sourceQuestion: 'Opgave ' + section + ', vraag ' + number,
      sectionId: 'opgave-' + section, type: 'open', points: points, prompt: plain(promptHtml), promptHtml: promptHtml, solution: plain(solutionHtml), solutionHtml: solutionHtml };
  }
  var stockHeads = ['Datum', 'Voorraad bij ….', 'Niet-gerealiseerde intercompany winst in voorraad bij ….', 'Interne correctie bij …', 'Eliminatie t.l.v. aandeel derden', 'Eliminatie t.l.v. geconsolideerd resultaat'];
  var blankStock = table(stockHeads, [['31-12-2022', '', '', '', '', ''], ['31-12-2023', '', '', '', '', ''], ['Toe/afname', '', '', '', '', '']]) + p('NB. Dit voorraadoverzicht is in de meest uitgebreide vorm weergegeven. U dient zelf te bepalen welke kolommen moeten worden ingevuld.');
  var introductionHtml = h('Comptabele Aspecten Financial Accounting 2') +
    table(['Tentamengegevens', ''], [['Datum', '30 september 2024'], ['Beschikbare tijd', '3 uur; 14:00 uur – 17:00 uur'], ['Opgesteld door', 'Kerngroep Comptabele Aspecten Financial Accounting 2']]) +
    p('<strong>Oefenversie van het oorspronkelijke tentamen.</strong> De oorspronkelijke tijdstippen, zaalregels en instructies over identificatie hieronder zijn historische broninformatie. Ze gelden niet als planning of toegangsvoorwaarden voor deze oefensite. Verwijzingen naar Cirrus en tentamenpapier zijn oorspronkelijke afname-instructies; hier vul je de antwoorden in de antwoordeditor in.') +
    h('Legitimeren bij tentamens verplicht') + p('Je bent als student verplicht om je bij het afleggen van een tentamen te (kunnen) legitimeren met een officieel identificatiedocument (ID/ paspoort/ rijbewijs). NB: De studentenpas volstaat niet! Als je je niet kunt legitimeren word je uitgesloten van deelname aan het tentamen. Deze regel is terug te vinden in de Onderwijs- en Examenregeling in de Studiegids.') +
    h('N.B.') + ul(["Het tentamen bestaat uit 15 genummerde pagina's. Controleer of deze alle aanwezig zijn.", 'Voor het tentamen zijn 100 punten te behalen. De puntenverdeling per opgave zal zijn: Opgave 1: 30 punten; Opgave 2: 20 punten; Opgave 3: 30 punten; Opgave 4: 20 punten.', 'Grens onvoldoende/voldoende: 54/55 punten.', 'Telefonisch worden geen uitslagen bekendgemaakt.']) + p('Veel succes!') +
    h('De gang van zaken tijdens tentamens') + p('Tijdens het tentamen is het belangrijk dat u de volgende zaken in acht neemt:') +
    '<ol type="a"><li>Kom in stilte de tentamenzaal binnen; spreken is niet toegestaan.</li><li>Neem plaats bij de tentamentafel met uw tentamennummer.</li><li>Leg uw legitimatie klaar.</li><li>Verlaat aan het einde van het tentamen zonder te spreken de zaal en de sporthal.</li></ol>' +
    p('Volg in alle gevallen de instructies van de surveillanten op.') + p('N.B. Het doorwerken nadat de tentamentijd is verstreken, heeft tot gevolg dat het tentamen niet zal worden ingenomen.') +
    p('© BREUKELEN, Nyenrode Business Universiteit, 2024') + p('Niets uit deze uitgave mag worden verveelvoudigd en/of openbaar gemaakt door middel van druk, fotokopie, microfilm, elektronisch op geluidsband of op welke andere wijze dan ook, zonder voorafgaande schriftelijke toestemming van de Nyenrode Business Universiteit.') +
    h('Algemene uitgangspunten alle opgaven in dit tentamen') + p('Hieronder worden de algemene uitgangspunten opgesomd. Van deze algemene uitgangspunten kan worden afgeweken. De afwijkingen worden dan expliciet in de opgave opgenomen.') + ul([
      'De Nederlandse verslaggevingsvoorschriften zoals opgenomen in Titel 9 boek 2 BW en de Richtlijnen voor de Jaarverslaggeving zijn van toepassing.',
      'Alle vennootschappen zijn naar Nederlands recht opgericht.',
      'Alle vennootschappen kwalificeren als een grote vennootschap in de zin van Titel 9 boek 2 BW.',
      'De deelnemingen passen voor de balanswaardering en resultaatbepaling dezelfde waarderingsgrondslagen toe als de moedermaatschappijen.',
      'Voor wat betreft consolidatie wordt uitgegaan van de integrale consolidatiemethode.',
      'Indien van toepassing moeten de antwoorden gemotiveerd worden en dient eventueel verwezen te worden naar de relevante wetsartikelen.'
    ]);
  var sections = [
    { id: 'opgave-1', title: 'Opgave 1 · Mulini bv (kapitaalbelangen)', points: 30,
      contentHtml: p('<strong>NB: In deze opgave wordt afgezien van belastingen.</strong>') +
        p('Mulini bv (hierna: Mulini) bezit per 31 december 2023 de volgende kapitaalbelangen:') +
        table(['Houdstermaatschappij', 'Kapitaalbelang', 'Vennootschap'], [['Mulini bv', '60%', 'Pienza bv'], ['Mulini bv', '50%', 'Sasso bv']], 'Kapitaalbelangen per 31 december 2023 (gegevens uit het bronschema)') +
        h('Pienza bv') + p('Mulini bezit sinds 31 december 2015 een kapitaalbelang in Pienza bv (hierna: Pienza). De per bank betaalde verkrijgingsprijs was € 400.000 voor 1.750 aandelen Pienza (nominale waarde van € 100 per aandeel). Na de aankoop door Mulini zijn de overige aandelen Pienza in handen van één derde partij.') +
        p('Per 1 mei 2023 is door Pienza per bank een 6% dividend betaald over het boekjaar 2022.') +
        p('Het kapitaalbelang in Pienza is op 1 juli 2023 uitgebreid door aankoop van 1.250 aandelen Pienza tegen een prijs van € 500 per aandeel Pienza. Mulini heeft deze uitbreiding betaald door uitgifte van 1.500 eigen aandelen (nominale waarde € 150 per aandeel) en een bijbetaling van € 100 per gekocht aandeel Pienza.') +
        p('De aangekochte kapitaalbelangen van Pienza worden door Mulini gewaardeerd tegen verkrijgingsprijs.') +
        p('De gecomprimeerde balansen van Pienza op aankoopdata van de aandelen Pienza en op 31 december 2023 zijn als volgt:') +
        table(['', '31 december 2015', '1 juli 2023', '31 december 2023'], [
          ['Activa', '1.100.000', '2.000.000', '2.300.000'], ['Totaal debetzijde', '1.100.000', '2.000.000', '2.300.000'],
          ['Geplaatst aandelenkapitaal', '500.000', '500.000', '500.000'], ['Overige reserves', '200.000', '600.000', '600.000'],
          ['Resultaat boekjaar', '100.000', '300.000', '500.000'], ['Schulden', '300.000', '600.000', '700.000'], ['Totaal creditzijde', '1.100.000', '2.000.000', '2.300.000']
        ], 'Balansen van Pienza bv (in € en voor winstverdeling)') +
        p('Met ingang van 31 december 2023 besluit Mulini het kapitaalbelang in Pienza te waarderen volgens de vermogensmutatiemethode met als grondslag het zichtbaar eigen vermogen. De betaalde goodwill wordt in 5 jaar lineair afgeschreven waarbij over delen van het jaar naar evenredigheid wordt afgeschreven.') +
        h('Sasso bv') + p('Het 50%-kapitaalbelang in Sasso bv (hierna: Sasso) is verworven op 31 december 2022 tegen een per bank betaalde prijs van € 1.500.000. Het zichtbaar eigen vermogen van Sasso bedroeg per 31 december 2022 € 2.500.000. De waardering van activa en schulden bij zowel Mulini als Sasso geschiedt tegen verkrijgingsprijs c.q. nominale waarde. Mulini beschouwt het 50%-kapitaalbelang in Sasso als deelneming en waardeert deze tegen nettovermogenswaarde.') +
        p('Tijdens het overnameonderzoek zijn de volgende afwijkingen in de waardering van activa en schulden van Sasso geconstateerd:') + ul([
          'De gebouwen hebben een lagere reële waarde van € 250.000. De resterende levensduur is 20 jaar.',
          'Voor de waardering van een langlopend project acht Mulini een voorziening noodzakelijk van € 200.000. Sasso acht dit niet nodig.',
          'Voor een claim van een opdrachtgever is een voorziening getroffen van € 150.000. Mulini acht deze te laag en wenst deze te verhogen tot € 200.000.'
        ]) + p('Goodwill wordt geactiveerd en in 5 jaar lineair afgeschreven tot nihil.') +
        h('Aanvullende informatie over 2023 en over de deelneming Sasso') + ul([
          'Sasso heeft begin 2023 voor de gebouwen een afwaardering van € 250.000 in haar financiële administratie verwerkt.',
          'De voorziening van het langlopende project dat eind 2023 nog niet is afgerond wordt door Mulini geschat op € 130.000. Sasso heeft eind 2023 een voorziening van € 50.000 opgenomen.',
          'De claim van een opdrachtgever is eind 2023 afgewikkeld voor een bedrag van € 170.000.',
          'Sasso heeft over 2023, volgens haar enkelvoudige jaarrekening, een resultaat behaald van € 400.000.'
        ]) +
        p('Mulini is voor haar 50%-kapitaalbelang in Sasso een overeenkomst tot samenwerking aangegaan met de andere aandeelhouder van Sasso die eveneens een 50%-kapitaalbelang heeft in Sasso. Hierbij is afgesproken dat geen van beide aandeelhouders overheersende zeggenschap of centrale leiding heeft in Sasso.')
    },
    { id: 'opgave-2', title: 'Opgave 2 · Bornholm bv (vreemde valuta)', points: 20,
      contentHtml: p('<strong>NB: In deze opgave wordt afgezien van belastingen.</strong>') +
        p('Het in Nederland gevestigde bedrijf Bornholm bv (hierna: Bornholm) importeert en exporteert goederen uit en naar Denemarken via haar 100% dochtermaatschappij Klint A/S (Deense besloten vennootschap) (hierna: Klint). De functionele en presentatievaluta van Bornholm is de euro. De lokale valuta van Klint is de Deense Kroon (DKK).') +
        p('Op 1 januari 2022 heeft Bornhom alle aandelen van Klint gekocht. De aankoopprijs bedroeg DKK 5.000.000 en is per bank betaald. Bornholm waardeert haar 100%-deelneming in Klint tegen nettovermogenswaarde welke op overnamedatum gelijk is aan het zichtbaar eigen vermogen van Klint. Het zichtbaar eigen vermogen per 1 januari 2022 van Klint is als volgt opgebouwd:') +
        table(['', 'DKK'], [['Geplaatst aandelenkapitaal', '80.000'], ['Statutaire reserves', '1.000.000'], ['Overige reserves', '1.830.000'], ['Resultaat boekjaar 2021', '920.000'], ['Totaal', '3.830.000']]) +
        p('De koers van de Deense Kroon in relatie tot de euro bedroeg op het moment van aankoop als volgt: 1 januari 2022: DKK 1,00 = € 0,130.') +
        p('De balans van Klint per 31 december 2023 en per 31 december 2022 en de winst-en-verliesrekening over 2023 in DKK ziet er als volgt uit:') +
        table(['Activa', '31-12-2023', '31-12-2022', 'Passiva', '31-12-2023', '31-12-2022'], [
          ['Gebouw', '4.625.000', '4.875.000', 'Gepl. aandelenkap.', '80.000', '80.000'], ['Voorraad', '4.450.000', '4.000.000', 'Statutaire reserves', '1.000.000', '1.000.000'],
          ['Debiteuren', '1.050.000', '1.250.000', 'Overige reserves', '3.250.000', '2.750.000'], ['Liquide middelen', '300.000', '1.000.000', 'Resultaat boekjaar', '400.000', '750.000'],
          ['', '', '', 'Lening o/g', '3.500.000', '4.000.000'], ['', '', '', 'Crediteuren', '2.195.000', '2.545.000'], ['Totaal', '10.425.000', '11.125.000', 'Totaal', '10.425.000', '11.125.000']
        ], 'Balans Klint (bedragen x DKK 1)') +
        table(['Debet', 'Bedrag', 'Credit', 'Bedrag'], [['Kostprijs van de omzet', '3.600.000', 'Omzet', '5.900.000'], ['Afschrijving gebouw', '250.000', '', ''], ['Afwaardering voorraad', '150.000', '', ''], ['Overige kosten', '1.500.000', '', ''], ['Winst', '400.000', '', ''], ['Totaal', '5.900.000', 'Totaal', '5.900.000']], 'Winst-en-verliesrekening Klint over 2023 (bedragen x DKK 1)') +
        p('In het vervolg van deze opgave geldt dat alle inkopen en verkopen in 2023 op het moment van transactiedatum tegen contante betaling zijn afgewikkeld.') +
        p('Het koersverloop van de Deense Kroon (DKK) is als volgt:') + table(['Periode', 'Koers'], [['Van 1 januari 2022 tot en met 28 februari 2023', 'DKK 1 = € 0,130'], ['1 maart 2023 t/m 30 juni 2023', 'DKK 1 = € 0,135'], ['1 juli t/m 30 december 2023', 'DKK 1 = € 0,140'], ['31 december 2023', 'DKK 1 = € 0,125'], ['Gemiddelde koers 2023', 'DKK 1 = € 0,138']]) +
        h('Nadere toelichting op de balans en winst-en-verliesrekening van Klint') + h('Gebouw') +
        p('Het gebouw is op 30 juni 2022 aangeschaft voor DKK 5.000.000 en wordt in 20 jaar met gelijke bedragen afgeschreven zonder rekening te houden met een restwaarde. Het verloop van de post gebouwen over 2023 is als volgt:') +
        table(['Datum', 'Mutatie', 'DKK'], [['31-12-2022', 'Boekwaarde', '4.875.000'], ['2023', 'Afschrijving boekjaar', '250.000'], ['31-12-2023', 'Boekwaarde', '4.625.000']]) +
        h('Voorraad, inkopen en verkopen') + p('Met betrekking tot de voorraad past Klint het fifo (first in first out) stelsel toe. Op 31 december 2022 bedraagt de voorraad 100.000 stuks à DKK 40,00 per stuk (DKK 4.000.000). Deze voorraad is in november 2022 ingekocht. In 2023 hebben de volgende transacties plaatsgevonden:') + ul([
          '3 maart 2023: verkoop 40.000 stuks à DKK 60,00 per stuk (DKK 2.400.000)',
          '5 april 2023: inkoop 30.000 stuks à DKK 45,00 per stuk (DKK 1.350.000)',
          '11 september 2023: inkoop 60.000 stuks à DKK 47,50 per stuk (DKK 2.850.000)',
          '13 november 2023: verkoop 50.000 stuks à DKK 70,00 per stuk (DKK 3.500.000)'
        ]) +
        p('Op 31 december 2023 wordt geconstateerd dat het restant van de uit 2022 ingekochte goederen nog een te korte houdbaarheidsdatum heeft, waardoor deze alleen tegen een lagere prijs kunnen worden verkocht. De opbrengstwaarde van deze voorraad wordt geschat op DKK 25,00 per stuk.') +
        h('Debiteuren') + p('Op 31 december 2023 is € 200.000 ontvangen van een debiteur die eind 2022 nog open stond.') +
        h('Eigen vermogen') + p('Op 5 februari 2023 is de jaarrekening over 2022 vastgesteld en goedgekeurd. Besloten is om uit de winst over 2022 een dividend uit te keren ter grootte van DKK 250.000 en het restant toe te voegen aan de overige reserves. Op 28 februari 2023 is het dividend per bank betaald.') +
        h('Lening o/g') + p('Dit betreft een door een bank in Denemarken verstrekte langlopende lening. Op 30 december van elk jaar wordt de aflossing ter grootte van DKK 500.000 in een keer betaald. De rente wordt maandelijks betaald en is opgenomen in de post overige kosten in de winst-en-verliesrekening over 2023.') +
        h('Crediteuren') + p('In januari 2023 is op de crediteuren een bedrag van DKK 350.000 betaald.') +
        h('Overige kosten') + p('De rente en overige kosten zijn gespreid over het jaar betaald.')
    },
    { id: 'opgave-3', title: 'Opgave 3 · Oud Avereest bv (consolidatie nettovermogenswaarde)', points: 30,
      contentHtml: p('<strong>NB 1: In dit vraagstuk wordt rekening gehouden met een winstbelastingtarief van 20%.</strong>') +
        p('NB 2: Alle antwoorden moeten worden ingevuld in Cirrus. Om veel bladeren in Cirrus te voorkomen adviseren we jullie om de tabellen ook op het tentamenpapier in te vullen.') +
        p('Oud Avereest bv (hierna: Oud Avereest) heeft reeds jaren een 70% deelneming in Broekhuizen bv (hierna: Broekhuizen). Oud Avereest waardeert haar deelneming in Broekhuizen tegen nettovermogenswaarde en stelt jaarlijks een geconsolideerde jaarrekening op.') +
        p('Het eigen vermogen van Broekhuizen ziet er respectievelijk eind 2022 (na winstverdeling) en eind 2023 (voor winstverdeling) als volgt uit:') +
        table(['', '31-12-2022', '31-12-2023'], [['Geplaatst aandelenkapitaal', '€ 40.000', '€ 40.000'], ['Agioreserve', '€ 120.000', '€ 120.000'], ['Overige reserves', '€ 340.000', '€ 340.000'], ['Resultaat boekjaar', '', '€ 120.000'], ['Totaal', '€ 500.000', '€ 620.000']]) +
        p('De grootboekrekening “Deelneming Broekhuizen” is op 1 januari 2023 geopend met een bedrag van € 334.320.') +
        p('Broekhuizen levert goederen aan Oud Avereest die deze goederen doorlevert aan derden. Op 31 december 2022 bedroeg de voorraad goederen bij Oud Avereest (afkomstig van Broekhuizen) € 280.000 (waarin een winst is begrepen van € 28.000). Op 31 december 2023 bedroeg de voorraad goederen bij Oud Avereest € 320.000 (waarin een winst is begrepen van € 32.000). In 2023 heeft Broekhuizen in totaal voor € 3.600.000 (waarin een winst is begrepen van € 360.000) aan goederen geleverd aan Oud Avereest.') +
        p('Oud Avereest brengt jaarlijks een management fee in rekening aan Broekhuizen van in totaal € 86.400. Maandelijks wordt op de laatste dag van de maand 1/12 deel betaald door Broekhuizen.') +
        h('Aanvullende informatie: vrachtauto (vragen 18 t/m 20)') +
        p('Oud Avereest heeft eind 2022 een vrachtauto verkocht aan Broekhuizen voor € 275.000. De vrachtauto is begin 2020 aangeschaft door Oud Avereest voor € 360.000. Oud Avereest schreef de vrachtauto in 8 jaar met gelijkblijvende bedragen per jaar af zonder rekening te houden met een restwaarde. Broekhuizen schrijft de vrachtauto vanaf begin 2023 in 5 jaar met gelijkblijvende bedragen per jaar af zonder rekening te houden met een restwaarde.') +
        p('De controller van Oud Avereest heeft de tabellen opgesteld over 2022 en 2023, op basis waarvan de intracomptabele correctieboekingen en de eliminatieboekingen gemaakt kunnen worden. De tabellen zien er als volgt uit:') +
        table(['Datum', 'Vrachtauto bij Broekhuizen', 'Niet-gerealiseerde intercompany boekwinst in vrachtauto bij Broekhuizen', 'Interne correctie bij Oud Avereest (70%)', 'Eliminatie t.l.v. geconsolideerd resultaat (30%)'], [
          ['31-12-2021', '€ 0', '€ 0', '€ 0', '€ 0'], ['31-12-2022', '€ 275.000', '€ 50.000', '€ 35.000', '€ 15.000'], ['Toename', '€ 275.000', '€ 50.000', '€ 35.000', '€ 15.000'],
          ['31-12-2022', '€ 275.000', '€ 50.000', '€ 35.000', '€ 15.000'], ['31-12-2023', '€ 220.000', '€ 40.000', '€ 28.000', '€ 12.000'], ['Afname', '€ 55.000', '€ 10.000', '€ 7.000', '€ 3.000']
        ])
    },
    { id: 'opgave-4', title: 'Opgave 4 · Hoza bv (consolidatie verkrijgingsprijs)', points: 20,
      contentHtml: p('<strong>NB 1: In dit vraagstuk wordt rekening gehouden met een winstbelastingtarief van 20%.</strong>') +
        p('NB 2: Alle antwoorden moeten worden ingevuld in Cirrus. Om veel bladeren in Cirrus te voorkomen adviseren we jullie om de tabellen ook op het tentamenpapier in te vullen.') +
        p('Hoza bv (hierna: Hoza) te Apeldoorn is een lokale speler op het gebied van gereedschap, werkkleding, tuinbenodigdheden e.d. De verkopen geschieden vanuit een modern pand met ruime parkeergelegenheid. Hoza heeft al langer de wens om ook op de internetmarkt een rol te gaan spelen. Om deze wens te verwezenlijken heeft zij per 1 januari 2022 een 60% kapitaalbelang verworven in Outdoor Living bv (hierna: Outdoor Living) een onderneming die zich uitsluitend toelegt op het per internet verkopen van tuinbenodigdheden. Hoza heeft voor dit 60% belang € 3.000.000 per bank betaald. Hoza merkt haar kapitaalbelang in Outdoor Living aan als deelneming en waardeert deze tegen verkrijgingsprijs.') +
        p('De samenstelling van het eigen vermogen van Outdoor Living op het overnametijdstip van 1 januari 2022 is al volgt:') +
        table(['', '1 januari 2022 (x € 1,-)'], [['Geplaatst aandelenkapitaal', '2.000.000'], ['Overige reserves', '1.800.000'], ['Resultaat boekjaar 2021', '200.000'], ['Totaal', '4.000.000']]) +
        h('Over het boekjaar 2022 zijn de volgende gegevens bekend') + ul([
          'Op 1 april 2022 werd in de Algemene vergadering van aandeelhouders van Outdoor Living de winstverdeling over 2021 vastgesteld:' + ul(['Een bedrag van € 4,50 per aandeel wordt door Outdoor Living als dividend gedeclareerd;', 'Het restant van de winst wordt aan de overige reserves toegevoegd;', 'De nominale waarde van een aandeel Outdoor Living bedraagt € 200,-.']),
          'Op 1 oktober 2022 werd door Outdoor Living per bank een interimdividend 2022 uitgekeerd van € 40.000,-'
        ]) +
        h('Over het boekjaar 2023 zijn de volgende gegevens bekend') + ul([
          'Met betrekking tot de intercompanylevering van Outdoor Living naar Hoza:' + ul(['De voorraad artikelen bij Hoza afkomstig van Outdoor Living bedraagt per 1 januari 2023 € 360.000, waarin een winst is begrepen van € 60.000', 'De voorraad artikelen bij Hoza afkomstig van Outdoor Living bedraagt per 31 december 2023 € 240.000, waarin een winst begrepen van € 40.000', 'In 2023 heeft Outdoor Living voor € 960.000 aan artikelen geleverd aan Hoza (hierin is een winst van € 160.000 begrepen).']),
          'Hoza heeft op 1 februari 2023 een lening u/g ter grootte van € 250.000 verstrekt aan Outdoor Living.' + ul(['Op 1 oktober 2023 werd door Outdoor Living voor het eerst € 50.000 afgelost op de lening;', 'De rente van 3% per jaar wordt achteraf per halfjaar voldaan op 1 april en 1 oktober.']),
          'De samenstelling van het eigen vermogen van Outdoor Living per 31 december 2023 is als volgt:'
        ]) +
        table(['', '31 december 2023 (x € 1,-)'], [['Geplaatst aandelenkapitaal', '2.000.000'], ['Overige reserves', '2.060.000'], ['Resultaat boekjaar', '250.000'], ['Totaal', '4.310.000']]) +
        p('Per 31 december 2023 stelt Hoza een geconsolideerde jaarrekening samen over 2023. De bij de verkrijging betaalde goodwill wordt bij consolidatie, ingaande het tijdstip van verwerving, in 5 jaar lineair afgeschreven tot nihil.')
    }
  ];
  var questions = [
    q(1, 1, 3, p('Beredeneer, aan de hand van de wet, voor de aankoop per 31 december 2015 waarom:') + ul(['a. er terecht sprake is van een vermoede deelneming;', 'b. het kapitaalbelang terecht tegen verkrijgingsprijs wordt gewaardeerd.']),
      h('Deelneming') + p('Wet: Art. 2:24c-1 geeft o.a. weer “…Indien een vijfde of meer van het geplaatste kapitaal wordt verschaft wordt het bestaan van een deelneming vermoed.” (½)') +
      p('Motivering: Mulini bv bezit 35% (1.750/(€ 500.000/ € 100) aandeel in het geplaatste aandelenkapitaal van Pienza bv. (½)') + p('Conclusie: Pienza bv is een vermoede deelneming van Mulini bv. (½)') +
      h('Waardering') + p('Wet: Art. 389-1 geeft o.a. weer “ Indien een rechtspersoon…een vijfde of meer van de stemmen van de aandeelhouders naar eigen inzicht kunnen uitbrengen, wordt vermoed dat de rechtspersoon invloed van betekenis uitoefent.” (½)') +
      p('Motivering: Mulini bv kan 35% van de stemrechten uitbrengen waardoor wordt vermoed dat invloed van betekenis op het zakelijk en financieel beleid kan worden uitgeoefend (½). Dit vermoeden wordt echter tenietgedaan omdat de andere aandeelhouder 65% bezit en zij derhalve overheersende zeggenschap heeft. (½)') +
      p('Conclusie: Waarderen op basis van art. 384-1 (in casu verkrijgingsprijs). (½)') +
      note('Het officiële correctiemodel vermeldt 3 punten voor deze vraag, maar toont zeven deelwaarderingen van ½ punt. Het maximum van 3 punten en alle bronannotaties zijn behouden.')),
    q(1, 2, 6, p('Geef voor Mulini de journaalposten per:') + ul(['a. 1 mei 2023 (uitkering dividend);', 'b. 1 juli 2023 (aankoop uitbreiding kapitaalbelang).']),
      jp([['0.. Bank', '10.500', '', '½ rekening + 1 bedrag'], ['9.. Dividend deelneming Pienza', '', '10.500', '½ rekening']], 'a. 1 mei 2023') +
      p('Specificatie: 6% x € 500.000 = € 30.000 x 35% = € 10.500.') +
      jp([['0.. Deelneming Pienza', '625.000', '', '½ rekening + ½ bedrag'], ['aan Aandelenkapitaal Mulini', '', '225.000', '½ rekening + ½ bedrag'], ['aan Agio Mulini', '', '275.000', '½ rekening + ½ bedrag'], ['aan Bank', '', '125.000', '½ rekening + ½ bedrag']], 'b. 1 juli 2023') +
      p('Deelneming Pienza bv: 1.250 x € 500 = € 625.000') + p('Aandelenkapitaal: 1.500 x € 150 = € 225.000') + p('Bank: 1.250 x € 100 = € 125.000') + p('Agio: saldopost van € 275.000')),
    q(1, 3, 5, p('Geef voor Mulini de journaalposten per 31 december 2023 in verband met de gewijzigde waarderingsgrondslag van:') + ul(['a. de aankoop op 15 december 2015;', 'b. de aankoop op 1 juli 2023.']),
      note('Vraag 3 noemt 15 december 2015; de casus noemt 31 december 2015. De vraagdatum is letterlijk behouden.') +
      h('a.') + p('Het belang was 35% en gewaardeerd tegen verkrijgingsprijs van € 400.000. Dit belang wordt per 31 december 2023 gewaardeerd tegen zichtbaar eigen vermogen: 35% van € 1.600.000 = € 560.000. Er komt geen goodwill naar voren omdat deze al is afgeschreven.') +
      jp([['0.. Deelneming Pienza', '160.000', '', '½ rekening + 1 bedrag'], ['aan 0.. Overige reserves', '', '160.000', '½ rekening']]) +
      p('NB. i.p.v. de post Overige reserves is ook goed te reken de post ‘Herwaarderingsreserve deelneming’.') +
      h('b.') + p('Het belang was 25% en gewaardeerd tegen verkrijgingsprijs van € 625.000. In het belang van € 625.000 is begrepen een goodwill van € 625.000 -/- (25% x € 1.400.000) = € 275.000. Boekwaarde goodwill is per 31 december 2023: 4,5/5 x € 275.000 = € 247.500. Waarde deelneming wordt per 01-07-2023: € 625.000 -/- € 275.000 = € 350.000. Dit belang wordt per 31 december 2023 gewaardeerd tegen zichtbaar eigen vermogen: 25% van € 1.600.000 = € 400.000. Vermogenssprong van € 50.000.') +
      jp([['0.. Goodwill deelneming Pienza', '247.500', '', '½ rekening + ½ bedrag'], ['aan 0.. Deelneming Pienza', '', '225.000', '½ rekening + ½ bedrag'], ['aan 0.. Overige reserves', '', '22.500', '½ rekening + ½ bedrag']]) +
      p('NB. i.p.v. de post Overige reserves is ook goed te reken de post ‘Herwaarderingsreserve deelneming’.')),
    q(1, 4, 2, p('Bereken voor Mulini per 31 december 2023 de boekwaarde van de deelneming Pienza.'),
      p('60% (1) x € 1.600.000 (1) = € 960.000.') + table(['Controle', 'Bedrag (€)'], [['aankoop 31-12-2015', '400.000'], ['boeking vraag 3a', '160.000'], ['aankoop 01-07-2023', '625.000'], ['boeking vraag 3b', '225.000 -/-'], ['Totaal', '960.000']])),
    q(1, 5, 3, p('Bereken de door Mulini betaalde goodwill van haar deelneming in Sasso.'),
      table(['Berekening', 'Specificatie (€)', 'Bedrag (€)', 'Normering'], [['Betaalde prijs', '', '1.500.000', '½'], ['Eigen vermogen Sasso', '2.500.000', '', '½'], ['Fair value aanpassingen:', '', '', ''], ['- gebouwen', '250.000 -', '', '½'], ['- langlopend project', '200.000 -', '', '½'], ['- claim', '50.000 -', '', '½'], ['Totale nettovermogenswaarde', '2.000.000 +', '', ''], ['Aandeel 50%', '', '1.000.000', '½'], ['Goodwill', '', '500.000', '']])),
    q(1, 6, 5, p('Geef alle journaalposten die Mulini in haar financiële administratie maakt ten aanzien van haar deelneming in Sasso.'),
      note('In de eerste journaalpost noemt de officiële uitwerking “Pienza”, terwijl de vraag en berekeningen over Sasso gaan. Die bronbenamingen zijn hieronder ongewijzigd overgenomen.') +
      jp([['0.. Deelneming Pienza', '410.000', '', '½ rekening + 2 bedrag (specificatie hieronder)'], ['aan 0.. Resultaat Deelneming Pienza', '', '410.000', '½ rekening']]) +
      table(['2023', 'Bedrag (€)', 'Normering'], [['Winst Sasso', '400.000', ''], ['Fair value aanpassingen:', '', ''], ['Gebouwen', '250.000 +', '½'], ['Langlopend project', '120.000 +', '½'], ['Claim', '50.000 +', '½'], ['Winst Sasso aangepast', '820.000 +', ''], ['Aandeel 50%', '410.000 +', '½']]) +
      table(['Controle', 'Bedrag (€)'], [['01-01-2023 Boekwaarde deelneming', '1.000.000'], ['2023 Winst', '410.000'], ['31-12-2023 Waarde deelneming Sasso', '1.410.000']]) +
      table(['Aansluitingsberekening', 'Bedrag (€)'], [['01-01-2023 Eigen vermogen Sasso', '2.500.000'], ['2023 Winst Sasso', '400.000 +'], ['31-12-2023 Eigen vermogen Sasso (nvw)', '2.900.000'], ['2023 Fair value aanpassingen: Langlopend project', '80.000 -'], ['31-12-2023', '2.820.000'], ['Aandeel 50%', '1.410.000']]) +
      jp([['4.. Afschrijvingskosten goodwill', '100.000', '', '½ rekening + 1 bedrag'], ['aan 0.. Goodwill', '', '100.000', '½ rekening']]) + p('Bedrag kan df zijn van vraag 5.')),
    q(1, 7, 3, p('Motiveer aan de hand van de wet of Sasso kwalificeert als groepsmaatschappij van Mulini.'),
      p('Wet: In artikel 2:24b BW (1) is het volgende weergegeven:') + p('“Een groep is een economische eenheid waarin rechtspersonen en vennootschappen organisatorisch zijn verbonden. Groepsmaatschappijen zijn rechtspersonen en vennootschappen die met elkaar in een groep zijn verbonden.”') +
      p('Motivering: Kenmerkend voor een groepsmaatschappij is dat er sprake is van een centrale leiding (economische eenheid) en wel zodanig dat de ene maatschappij beleidsbepalend is in de andere maatschappij (organisatorische verbondenheid). In casu is er een overeenkomst tot samenwerking en heeft geen van beide aandeelhouders de centrale leiding of is deze beleidsbepalend in Sasso. (1)') +
      p('Conclusie: Sasso kwalificeert niet als groepsmaatschappij van Mulini. (1)')),
    q(1, 8, 3, p('Welke mogelijkheden heeft Mulini ten aanzien van de verwerking van de deelneming in Sasso bij het opstellen van haar geconsolideerde jaarrekening?'),
      p('Wet: In artikel 2:409 BW (1) is het volgende weergegeven:') +
      p('“De financiële gegevens van een rechtspersoon of vennootschap mogen in de geconsolideerde jaarrekening worden opgenomen naar evenredigheid tot het daarin gehouden belang, indien:') +
      ul(['a. in die rechtspersoon of vennootschap een of meer in de consolidatie opgenomen maatschappijen krachtens een regeling tot samenwerking met andere aandeelhouders, leden of vennoten samen de rechten of bevoegdheden kunnen uitoefenen als bedoeld in artikel 24a, lid 1; en', 'b. hiermee voldaan wordt aan het wettelijke inzichtvereiste.”']) +
      h('Mogelijkheden') + p('1) Proportioneel consolideren indien aan de voorwaarden van de letters a en b wordt voldaan. (1)') + p('2) Niet consolideren en opnemen als deelneming in de geconsolideerde jaarrekening van Mulini. (1)')),
    q(2, 9, 2, p('Geef de journaalpost die Bornholm in haar grootboek heeft gemaakt naar aanleiding van het per 1 januari 2022 aangekochte kapitaalbelang in Klint.'),
      note('De officiële uitwerking herhaalt deze vraag met 1 januari 2020. Het oorspronkelijke tentamen noemt 1 januari 2022.') +
      table(['Rekening', 'DKK', 'Koers €', 'Debet (€)', 'Credit (€)', 'Normering'], [['Goodwill', '1.170.000', '0,130', '152.100', '', '½ rekening + ½ bedrag'], ['Deelneming', '3.830.000', '0,130', '497.900', '', '½ rekening + ½ bedrag'], ['Aan Bank', '5.000.000', '0,130', '', '650.000', '']])),
    q(2, 10, 4, p('Geef een gespecificeerde berekening van de volgende balansposten van Klint per 31 december 2023 in euro’s op basis van de tijdstipmethode (temporal method):') + ul(['a. Gebouwen;', 'b. Voorraad.']),
      h('a. Gebouwen (1 punt)') + table(['Gebouwen', 'DKK', 'Koers €', '€', 'Normering'], [['Boekwaarde 31-12-2023', '4.875.000', '0,130', '633.750', '½'], ['Afschrijving boekjaar', '-250.000', '0,130', '-32.500', '½'], ['Boekwaarde 31-12-2023', '4.625.000', '0,130', '601.250', '']]) +
      note('De eerste regel noemt in de officiële uitwerking eveneens 31-12-2023; volgens het casusverloop betreft het de beginboekwaarde van 31-12-2022. De bronregel is behouden.') +
      h('b. Voorraad (3 punten)') + table(['Transactie', 'Datum', 'Aantal', 'DKK', 'Verkopen', '31-12', 'Bedrag in DKK'], [
        ['Begin voorraad', '2-12-2022', '100.000', '40,00', '-40.000; -50.000', '10.000', '4.000.000'], ['Verkoop', '3-3-2023', '-40.000', '40,00', '', '', '-1.600.000'],
        ['Inkoop', '5-4-2023', '30.000', '45,00', '', '30.000', '1.350.000'], ['Inkoop', '11-9-2023', '60.000', '47,50', '', '60.000', '2.850.000'],
        ['Verkoop', '13-11-2023', '-50.000', '40,00', '', '', '-2.000.000'], ['Voorraad', '31-12-2023', '100.000', '', '', '100.000', '4.600.000'],
        ['Afwaardering begin voorraad', '', '', '40.00 – 25,00', '', '10.000', '-150.000'], ['Eindvoorraad in DKK', '', '', '', '', '', '4.450.000']
      ]) +
      table(['Waardering', 'Berekening', 'Bedrag (€)'], [['Voorraad uit 1ste halfjaar', 'DKK 1.350.000 (½) x € 0,135 (½)', '182.250'], ['Voorraad uit 2de halfjaar', 'DKK 2.850.000 (½) x € 0,140 (½)', '399.000'], ['Voorraad uit 2022', '10.000 x DKK 25 = DKK 250.000 (½) x € 0,125 (½)', '31.250'], ['Totaal voorraad', '', '612.500']]) +
      note('De uitwerking dateert de beginvoorraad op 2-12-2022; de casus vermeldt aankoop in november 2022. Beide bronvermeldingen zijn behouden.')),
    q(2, 11, 5, p('Geef het verloop van de volgende balansposten van Klint over 2023 in euro’s op basis van de slotkoersmethode (closing rate method):') + ul(['a. Gebouwen;', 'b. Eigen vermogen.']),
      h('a. Gebouwen (2 punten)') + table(['Verloop', 'DKK', 'Koers € / berekening', '€', 'Normering'], [
        ['Stand 1-1-2023', '4.875.000', '0,130', '633.750', '½'], ['Afschrijvingen', '-250.000', '0,138', '-34.500', '½'], ['', '4.625.000', '', '599.250', ''],
        ['Omrekenverschil beginsaldo', '4.875.000', 'x (0,125 – 0,130)', '-24.375', '½'], ['Omrekenverschil afschrijvingen', '-250.000', 'x (0,125 – 0,138)', '3.250', '½'],
        ['Boekwaarde 31-12-2023', '4.625.000', '0,125', '578.125', '']
      ]) +
      h('b. Eigen vermogen (3 punten)') + table(['Verloop', 'DKK', 'Koers € / berekening', '€', 'Normering'], [
        ['Stand 1-1-2023', '4.580.000', '0,130', '595.400', '½'], ['Dividenduitkering', '-250.000', '0.130', '-32.500', '½'], ['Resultaat 2023', '400.000', '0,138', '55.200', '½'], ['', '4.730.000', '', '618.100', ''],
        ['Reserve omrekenverschillen:', '', '', '', ''], ['Omrekenverschil beginsaldo', '4.580.000', 'x (0,125 – 0,130)', '-22.900', '½'], ['Omrekenverschil dividend', '-250.000', 'x (0,125 – 0,130)', '1.250', '½'], ['Omrekenverschil resultaat', '400.000', 'x (0,125 – 0,138)', '-5.200', '½'], ['Boekwaarde 31-12-2023', '4.730.000', '0,125', '591.250', '']
      ])),
    q(2, 12, 4, p('Geef een gespecificeerde berekening van de volgende posten in de winst-en-verliesrekening van Klint over 2023 in euro’s volgens de tijdstipmethode (temporal method):') + ul(['a. Omzet;', 'b. Kostprijs omzet;', 'c. Afwaardering voorraad.']),
      h('a. Omzet (1 punt)') + table(['Periode', 'Aantal x DKK', 'Bedrag in DKK', 'Koers', 'In €', 'Normering'], [['Verkoop 1ste hj', '40.000 x 60', '2.400.000', '0,135', '324.000', '½'], ['Verkoop 2de hj', '50.000 x 70', '3.500.000', '0,140', '490.000', '½'], ['Totaal', '', '5.900.000', '', '814.000', '']]) +
      h('b. Kostprijs omzet (1 punt)') + table(['Periode', 'Aantal x DKK', 'Bedrag in DKK', 'Koers', 'In €', 'Normering'], [['Verkoop 1ste hj', '40.000 x 40', '1.600.000', '0,130', '208.000', '½'], ['Verkoop 2de hj', '50.000 x 40', '2.000.000', '0,130', '260.000', '½'], ['Totaal', '', '3.600.000', '', '468.000', '']]) +
      h('c. Afwaardering voorraad (2 punten)') + table(['', 'Aantal x DKK', 'Bedrag in DKK', 'Koers', 'In €', 'Normering'], [['Afwaardering voorraad', '10.000 x (40 – 25)', '150.000', '0,130', '19.500', '1'], ['Koersverschil op afwaardering', '10.000 x 25 ( (0,130 – 0,125)', '', '', '1.250', '1'], ['Totaal', '', '', '', '20.750', '']])),
    q(2, 13, 5, p('Geef een gespecificeerde berekening van het koersverschil over 2023 in de winst-en-verliesrekening van Klint over 2023 in euro’s wat ontstaat bij de omrekening volgens de tijdstipmethode (temporal method). Geef hierbij aan of dit resultaat positief of negatief is.'),
      table(['Monetaire positie en mutaties', 'Bedrag DKK', 'Koers €', 'Bedrag €', 'Normering'], [
        ['01-01-2023 Debiteuren', '1.250.000', '', '', ''], ['01-01-2023 Liquide middelen', '1.000.000', '', '', ''], ['01-01-2023 Lening', '-4.000.000', '', '', ''], ['01-01-2023 Crediteuren', '-2.545.000', '', '', ''], ['01-01-2023 monetaire positie', '-4.295.000', '0,130', '-558.350', '½'],
        ['Mutaties:', '', '', '', ''], ['Verkoop eerste halfjaar', '2.400.000', '0,135', '324.000', '½'], ['Inkoop eerste halfjaar', '-1.350.000', '0,135', '-182.250', '½'], ['Inkoop tweede halfjaar', '-2.850.000', '0.140', '-399.000', '½'], ['Verkoop tweede halfjaar', '3.500.000', '0.140', '490.000', '½'], ['Overige kosten', '-1.500.000', '0,138', '-/- 207.000', '½'], ['Dividenduitkering', '-250.000', '0.130', '-/- 32.500', '½'],
        ['Totaal mutaties', '-50.000', '', '-/- 6.750', ''], ['Monetaire positie theoretisch', '-4.345.000', '', '-565.100', ''],
        ['31-12-2023 Debiteuren', '1.050.000', '', '', ''], ['31-12-2023 Liquide middelen', '300.000', '', '', ''], ['31-12-2023 Lening', '-3.500.000', '', '', ''], ['31-12-2023 Crediteuren', '-2.195.000', '', '', ''], ['31-12-2023 monetaire positie', '-4.345.000', '0,125', '-543.125', '½'], ['Koerswinst in w&v', '', '', '21.975', '1']
      ]) + note('De debiteurentoelichting in de casus noemt € 200.000, terwijl de DKK-balans van 1.250.000 naar 1.050.000 daalt. De oorspronkelijke valutavermelding en de officiële berekening zijn behouden.')),
    q(3, 14, 2, p('Stel onderstaande voorraadtabel samen met betrekking tot de intercompanyleveringen van Broekhuizen aan Oud Avereest.') + blankStock,
      h('Upstream') + table(['Datum', 'Voorraad bij OA', 'Niet-gerealiseerde intercompany winst in voorraad bij OA', 'Interne correctie bij OA (70%)', 'Eliminatie t.l.v. aandeel derden (30%)', 'Eliminatie t.l.v. geconsolideerd resultaat (0%)'], [['31-12-2022', '280.000', '28.000', '19.600', '8.400', '0'], ['31-12-2023', '320.000', '32.000', '22.400', '9.600', '0'], ['Toename', '40.000', '4.000', '2.800', '1.200', '0']]) + p('Kolomkoppen en bedragen goed ingevuld 2 punt g/f.')),
    q(3, 15, 2, p('Geef een aansluitberekening tussen het eigen vermogen van Broekhuizen per 31 december 2022 en het beginsaldo van de grootboekrekening “Deelneming Broekhuizen” in het grootboek van Oud Avereest per 1 januari 2023.'),
      table(['Berekening', 'Bedrag (€)', 'Normering'], [['Eigen vermogen Broekhuizen', '500.000', ''], ['Aandeel 70%', '350.000', '1'], ['Af: Icwinst in beginvoorraad Oud Avereest: 80% x € 19.600', '15.680 -/-', '1'], ['Deelneming Broekhuizen in grootboek Oud Avereest', '334.320', '']])),
    q(3, 16, 2, p('Geef de journaalpost(en) die eind 2023 is (zijn) gemaakt in de enkelvoudige jaarrekening van Oud Avereest in verband met de nog niet gerealiseerde intercompanyresultaten (intracomptabele correctieboeking(en)).'),
      jp([['9.. Resultaat deelneming', '2.240', '', '½ rekening + 1 bedrag'], ['aan 0.. Deelneming', '', '2.240', '½ rekening']])),
    q(3, 17, 12, p('Geef ten behoeve van de samenstelling van de geconsolideerde winst-en-verliesrekening over 2023 de eliminatieboekingen met betrekking tot:') + ul(['a. het resultaat van de deelneming in Broekhuizen;', 'b. de door Oud Avereest aan Broekhuizen in rekening gebrachte management fee;', 'c. de intercompanyleveringen van Broekhuizen aan Oud Avereest.']),
      jp([['Resultaat deelneming', '81.760', '', '½ rekening + ½ bedrag'], ['Aandeel derden', '36.000', '', '½ rekening + ½ bedrag'], ['aan Resultaat na belastingen', '', '117.760', '½ rekening + ½ bedrag']], 'Eliminatie: resultaat van de deelneming Broekhuizen (3 punten)') +
      jp([['Opbrengst Managementfee', '86.400', '', '½ rekening + ½ bedrag'], ['aan Kosten Managementfee', '', '86.400', '½ rekening']], 'Eliminatie: managementfee (1,5 punten)') +
      h('Eliminatie: intercompanyleveringen van Broekhuizen aan Oud Avereest (7,5 punten)') +
      jp([['Omzet', '3.560.000', '', '½ rekening + ½ bedrag'], ['aan Kostprijs', '', '3.560.000', '½ rekening']], 'Eliminatie: geleverd en doorgeleverd in het boekjaar') +
      jp([['Omzet', '40.000', '', '½ rekening + ½ bedrag'], ['aan Kostprijs', '', '36.000', '½ rekening + ½ bedrag'], ['aan Resultaat na belastingen', '', '2.240', '½ rekening + ½ bedrag'], ['aan Belastinglast', '', '560', '½ rekening + ½ bedrag'], ['aan Aandeel derden', '', '960', '½ rekening + ½ bedrag'], ['aan Belastinglast', '', '240', '½ rekening + ½ bedrag']], 'Eliminatie: intercompanywinst in toename voorraad')),
    q(3, 18, 4, p('Geef de journaalpost(en) die eind 2022 is (zijn) gemaakt in de enkelvoudige jaarrekening van Oud Avereest in verband met de nog niet gerealiseerde boekwinst (intracomptabele correctieboeking(en)).'),
      jp([['9.. Niet gerealiseerde boekwinst vrachtauto', '35.000', '', '½ rekening + 1 bedrag'], ['aan 0.. Overlopende passiva', '', '35.000', '½ rekening']]) +
      jp([['0.. Voorziening latente belastingen', '7.000', '', '½ rekening + 1 bedrag'], ['aan 9.. Belastinglast', '', '7.000', '½ rekening']])),
    q(3, 19, 4, p('Geef de eliminatieboeking(en) die ten behoeve van de samenstelling van de geconsolideerde balans per 31 december 2022 is (zijn) gemaakt in verband met de vrachtauto.'),
      jp([['Overlopende passiva', '35.000', '', '½ rekening + ½ bedrag'], ['Resultaat boekjaar', '12.000', '', '½ rekening + ½ bedrag'], ['Voorziening latente belastingen', '3.000', '', '½ rekening + ½ bedrag'], ['aan Vrachtauto', '', '50.000', '½ rekening + ½ bedrag']], 'Eliminatie: uitvoegen boekwinst magazijn eind jaar') +
      note('De bronkop noemt “magazijn”; de vraag en boeking betreffen de vrachtauto. De bronkop is behouden.')),
    q(3, 20, 4, p('Geef de eliminatieboeking(en) die ten behoeve van de samenstelling van de geconsolideerde winst-en-verliesrekening over 2023 is (zijn) gemaakt in verband met de vrachtauto.'),
      jp([['Gerealiseerde boekwinst vrachtauto', '7.000', '', '½ rekening + ½ bedrag'], ['Resultaat na belasitngen', '2.400', '', '½ rekening + ½ bedrag'], ['Belastinglast', '600', '', '½ rekening + ½ bedrag'], ['aan Afschrijvingskosten', '', '10.000', '½ rekening + ½ bedrag']])),
    q(4, 21, 1, p('Bereken het in de verkrijgingsprijs van € 3.000.000 begrepen bedrag aan goodwill.'),
      table(['Berekening', 'Bedrag (€)', 'Normering'], [['Verkrijgingsprijs (gegeven)', '3.000.000', ''], ['Zichtbaar EV: 60% x 4.000.000', '2.400.000', ''], ['Betaalde Goodwill', '600.000', '1']])),
    q(4, 22, 1, p('Geef de journaalpost die Hoza heeft gemaakt naar aanleiding van de verwerving van het 60% kapitaalbelang in Outdoor Living.'),
      jp([['0.. Deelneming in Outdoor Living', '3.000.000', '', '½'], ['1.. Aan/ Bank (gegeven)', '', '3.000.000', '½']], 'Intracomptabele journaalpost (* 1 €)')),
    q(4, 23, 4, p('Geef de journaalposten die moeten worden gemaakt in de enkelvoudige jaarrekening van Hoza over 2022:') + ul(['a. naar aanleiding van de winstverdeling over 2021 van Outdoor Living;', 'b. naar aanleiding van het uitgekeerde interimdividend 2022 door Outdoor Living.']),
      h('23.A. Winstverdeling over 2021 (2 punten)') +
      table(['Berekening', 'Bedrag'], [['Geplaatst aandelenkapitaal Outdoor Living', '2.000.000,-'], ['Nominale waarde van 1 aandeel', '200,-'], ['Aantal geplaatste aandelen', '10.000'], ['Uitgekeerd dividend Outdoor Living', '10.000 x 4,50 = 45.000,-'], ['Gereserveerde winst Outdoor Living', '200.000 – 45.000 = 155.000,-'], ['Door Hoza ontvangen dividend', '60% x 45.000 = 27.000,-']]) +
      p('(of: 10.000 aandelen x 60% = 6.000 aandelen x 4,50 = 27.000,-)') +
      jp([['1.. Bank (zie boven voor berekening)', '27.000', '', '½ rekening + 1 bedrag'], ['0.. Aan/ Deelneming in Outdoor Living', '', '27.000', '½ rekening']], 'Intracomptabele journaalpost (* 1 €)') +
      p('Aangezien het meegekocht dividend is, moet de rekening Deelneming worden gecrediteerd.') +
      h('23.B. Uitgekeerde interimdividend (2 punten)') +
      jp([['1.. Bank (60% van 40.000,-)', '24.000', '', '½ rekening + 1 bedrag'], ['0.. Aan/ Opbrengst deelneming in Outdoor Living', '', '24.000', '½ rekening']], 'Intracomptabele journaalpost (* 1 €)')),
    q(4, 24, 1, p('Stel onderstaande voorraadtabel samen met betrekking tot de intercompanyleveringen van Outdoor Living aan Hoza.') + blankStock,
      table(['Datum', 'Voorraad bij Hoza', '(1) Niet-gerealiseerde intercompanywinsten in voorraad bij Hoza', '(2) Ten laste geconsolideerd resultaat (60%)', '(3) Ten laste van belang/aandeel derden (40%)'], [['31-12-2022', '€ 360.000', '€ 60.000', '€ 36.000', '€ 24.000'], ['31-12-2023', '€ 240.000', '€ 40.000', '€ 24.000', '€ 16.000'], ['Afname', '€ 120.000', '€ 20.000', '€ 12.000', '€ 8.000']]) + p('(1/2 punt per geheel juiste kolom: (2) en (3))')),
    q(4, 25, 13, p('Geef ten behoeve van de samenstelling van de geconsolideerde balans per 31 december 2023 de eliminatieboeking(en) met betrekking tot:') + ul(['a. de deelneming in Outdoor Living;', 'b. het belang derden;', 'c. de (consolidatie)goodwill;', 'd. de onderlinge vorderingen en schulden;', 'e. de intercompanyleveringen van goederen van Outdoor Living aan Hoza.']),
      jp([['D- Geplaatst aandelenkapitaal (0,6 * 2.000.000)', '1.200.000', '', '½'], ['D- Overige reserves (0,6 * 1.800.000)', '1.080.000', '', '½'], ['D- Overige reserves (v/h res.2021) (200.000-45.000) * 0,6', '93.000', '', '½'], ['D- Goodwil (zie 1.b.)', '600.000', '', '½'], ['Cr-Deelneming in Outdoor Living (zie: 1.a – 3.a)', '', '2.973.000', '½']], '25.A. Deelneming in Outdoor Living (2,5 punten)') +
      jp([['D- Geplaatst aandelenkapitaal (0,4 * 2.000.000)', '800.000', '', '½'], ['D- Overige reserves (0,4 * 2.060.000)', '824.000', '', '½'], ['D- Resultaat boekjaar (0,4 * 250.000)', '100.000', '', '½'], ['Cr-Belang derden', '', '1.724.000', '½']], '25.B. Belang derden (2 punten)') +
      jp([['D- Overige reserves (600.000/5 voor 2022)', '120.000', '', '½'], ['D- Resultaat boekjaar (600.000/5 voor 2023)', '120.000', '', '½'], ['Cr-Goodwill', '', '240.000', '½']], '25.C. Afschrijving goodwill (1,5 punt)') +
      jp([['D- Lening o/g (Outdoor Living)', '200.000', '', '½ rekening + ½ bedrag'], ['Cr-Lening u/g (Hoza)', '', '200.000', '½ rekening']], '25.D.1. Onderlinge vorderingen en schulden: lening (1,5 punt)') + p('(250.000 – aflossing 50.000)') +
      jp([['D- Nog te betalen bedragen (Outdoor Living)', '1.500', '', '½ rekening + ½ bedrag'], ['Cr-Nog te vorderen bedragen (Hoza)', '', '1.500', '½ rekening']], '25.D.2. Onderlinge vorderingen en schulden (1,5 punten)') + p('(250.000 – aflossing 50.000) * 3% * 3/12') +
      h('25.E. Intercompanyleveringen van goederen van Outdoor Living aan Hoza (upstream) (4 punten)') +
      jp([['D- Resultaat boekjaar (80% x 24.000)', '19.200', '', '½'], ['D- Voorziening belastingen (20% x 24.000)', '4.800', '', '½'], ['D- Belang derden (80% x 16.000)', '12.800', '', '½'], ['D- Voorziening belastingen (20% x 16.000)', '3.200', '', '½'], ['Cr-Voorraden', '', '40.000', '½']], '25.E.1. Winst eindvoorraad (2,5 punten)') +
      jp([['D- Overige reserves', '28.800', '', '½ rekening + ½ bedrag'], ['Cr-Resultaat boekjaar (80% x 36.000)', '', '28.800', '½ rekening']], '25.E.2. Invoegen winst beginvoorraad (1,5 punt)') +
      note('De verwijzingen “zie 1.b.” en “zie: 1.a – 3.a” in 25.A staan zo in de officiële uitwerking; ze zijn behouden.'))
  ];
  window.CAFA2_EXAMS = window.CAFA2_EXAMS || [];
  window.CAFA2_EXAMS.push({
    id: 'cafa2-20240930', title: 'CAFA2', date: '2024-09-30', durationMinutes: 180, maxScore: 100, passPoints: 55,
    introduction: 'Comptabele Aspecten Financial Accounting 2, 30 september 2024. 3 uur, 4 opgaven, 25 vragen, 100 punten. Grens onvoldoende/voldoende: 54/55 punten.',
    introductionHtml: introductionHtml,
    instructions: ['De doorlopende vraagnummering 1 t/m 25 volgt het oorspronkelijke tentamen. Alle letteronderdelen blijven bij hun eigen vraag.', 'Punten per vraag zijn overgenomen uit de officiële uitwerking. g/f betekent goed/fout en df betekent doorwerkfout.', 'Historische afname-instructies, wettelijke verwijzingen en gesignaleerde bronfouten zijn broninformatie.'],
    sourceNotes: [
      'Vraag 1: het model noemt 3 punten, maar de zichtbare deelwaarderingen tellen op tot 3,5. Maximum en annotaties zijn beide behouden.',
      'Vraag 3 noemt aankoop 15 december 2015; de casus noemt 31 december 2015.',
      'Vraag 6: de officiële uitwerking noemt Pienza in de journaalpost, terwijl de vraag en berekeningen Sasso betreffen.',
      'Vraag 9: het model herhaalt aankoopdatum 1 januari 2020, terwijl het tentamen 1 januari 2022 vermeldt.',
      'Vraag 10: de eerste boekwaarderegel heet 31-12-2023 in plaats van de beginbalansdatum. De voorraad uit 2022 is in het model gedateerd 2-12-2022, in de casus november 2022.',
      'Opgave 2: bij Debiteuren staat € 200.000, terwijl de DKK-balans met 200.000 daalt. De bronvaluta en de officiële berekening zijn behouden.',
      'Vraag 19: de modelkop noemt magazijn terwijl het om de vrachtauto gaat.',
      'Vraag 25.A: de oorspronkelijke modelverwijzingen zie 1.b. en zie: 1.a – 3.a zijn behouden.'
    ],
    sources: [{ title: '20240930 Tentamen CAFA2.pdf', kind: 'exam', pages: 15 }, { title: '20240930 Uitwerking tentamen CAFA2.pdf', kind: 'model-answers', pages: 14 }],
    sections: sections, questions: questions
  });
})();
