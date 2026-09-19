(function () {
  'use strict';

  var theory = {
    kap: [
      [1, 3, 'Deelneming of belegging?', 'Een kapitaalbelang is een deelneming als het duurzaam wordt aangehouden voor de eigen werkzaamheid. Beoordeel daarna afzonderlijk of er zeggenschap en dus een dochtermaatschappij is.', 'BW 2:24a, 2:24c en 2:389', 'samenvatting.html#kwalificatie'],
      [4, 5, 'Invloed van betekenis', 'Bij ten minste 20% van de stemrechten wordt invloed van betekenis vermoed. Dat vermoeden kan worden weerlegd als de feiten aantonen dat de invloed feitelijk ontbreekt.', 'BW 2:389 lid 1; syllabus deel 1, p. 7-10', 'samenvatting.html#kwalificatie'],
      [6, 10, 'Zeggenschap, dochter en groep', 'Meer dan de helft van de stemrechten of de bevoegdheid om de meerderheid van bestuurders te benoemen of ontslaan wijst op een dochtermaatschappij. Een groep vereist daarnaast organisatorische verbondenheid en centrale leiding.', 'BW 2:24a, 2:24b en 2:406', 'samenvatting.html#kwalificatie'],
      [11, 19, 'Nettovermogenswaarde en goodwill', 'Start bij het aandeel in het zichtbare eigen vermogen en verwerk stille reserves en goodwill volgens de gekozen waarderingsgrondslag. Resultaten na verkrijging verhogen de boekwaarde; dividend verlaagt die boekwaarde.', 'Syllabus deel 1, p. 17-29; BW 2:389', 'samenvatting.html#waardering'],
      [20, 22, 'Wettelijke reserve deelneming', 'Vorm een wettelijke reserve voor niet vrij uitkeerbare waardemutaties van de deelneming. Let op het onderscheid tussen het resultaat uit deelneming en ontvangen dividend.', 'BW 2:389 lid 6', 'samenvatting.html#waardering'],
      [23, 25, 'Rechten bepalen het belang', 'Kijk bij bijzondere aandelen en de flex-bv niet alleen naar het kapitaalpercentage. Stemrecht, winstrecht en benoemingsrechten kunnen tot verschillende percentages voor zeggenschap en resultaat leiden.', 'Syllabus deel 1, p. 8-16', 'samenvatting.html#kwalificatie'],
      [26, 27, 'Eigen aandelen', 'Ingekochte eigen aandelen verminderen het eigen vermogen. Presenteer de verkrijgingsprijs niet als een gewoon actief en let op de wettelijke toelichtingsvereisten.', 'BW 2:373 lid 3, 2:378 lid 2 en 2:385 lid 5', 'samenvatting.html#waardering'],
      [28, 30, 'Aansluiting eigen vermogen', 'Maak een brug van beginvermogen naar eindvermogen: resultaat, dividend, rechtstreekse mutaties en eventuele koersverschillen. Zo controleer je de waardering van de deelneming.', 'Syllabus deel 1, p. 17-37', 'samenvatting.html#waardering']
    ],
    val: [
      [1, 3, 'Functionele valuta', 'De functionele valuta is de valuta van de primaire economische omgeving. Let vooral op de valuta van verkoopprijzen, arbeidskosten, materialen en financiering.', 'RJ 122.102 en syllabus deel 2, p. 4-7', 'samenvatting.html#valuta'],
      [4, 8, 'Monetair of niet-monetair', 'Monetaire posten geven recht op of verplichten tot een vast of bepaalbaar aantal valuta-eenheden. Voorbeelden zijn liquide middelen, vorderingen en schulden. Voorraden en vaste activa zijn niet-monetair.', 'RJ 122.106-.109; syllabus deel 2, p. 7-10', 'samenvatting.html#valuta'],
      [9, 10, 'Slotkoers en koersresultaat', 'Monetaire posten worden op balansdatum omgerekend tegen de slotkoers. Het verschil met de eerdere waardering loopt in beginsel via het resultaat.', 'Syllabus deel 2, p. 8-12', 'samenvatting.html#valuta'],
      [11, 20, 'Niet-monetaire posten', 'Een niet-monetaire post tegen historische kostprijs blijft omgerekend tegen de koers op transactiedatum. Bij waardering tegen actuele waarde hoort de koers van het waarderingsmoment.', 'RJ 122.106-.109; syllabus deel 2, p. 8-12', 'samenvatting.html#valuta'],
      [21, 25, 'Valutapositie en resultaat', 'Bepaal eerst de netto monetaire positie per vreemde valuta. Een koersstijging bevoordeelt een netto vordering en benadeelt een netto schuld; bij een koersdaling is dat omgekeerd.', 'Syllabus deel 2, p. 10-17', 'samenvatting.html#valuta'],
      [26, 30, 'Omrekeningsverschillen', 'Bij omrekening van een buitenlandse deelneming worden activa en passiva doorgaans tegen slotkoers omgerekend en resultaten tegen transactie- of gemiddelde koers. Het sluitverschil komt in een afzonderlijke reserve.', 'Syllabus deel 2, p. 12-17', 'samenvatting.html#valuta']
    ],
    nvw: [
      [1, 5, 'Consolidatiebasis', 'Tel gelijksoortige posten op en elimineer de deelneming tegen het bijbehorende eigen vermogen. Intercompanyvorderingen, schulden, opbrengsten en kosten verdwijnen volledig.', 'Syllabus deel 3, p. 5-15', 'samenvatting.html#proces'],
      [6, 10, 'Downstreamtransactie', 'Bij verkoop door moeder aan dochter zit de ongerealiseerde winst in de voorraad van de dochter, maar de winst is door de moeder geboekt. Onder nettovermogenswaarde corrigeer je het nettobedrag al in de enkelvoudige jaarrekening.', 'Syllabus deel 3, p. 16-23 en 64-73', 'samenvatting.html#downstream'],
      [11, 15, 'Upstreamtransactie', 'Bij verkoop door dochter aan moeder is de winst bij de dochter ontstaan. Verdeel de netto eliminatie daarom tussen aandeelhouders van de moeder en minderheidsbelang volgens het belang in de verkopende dochter.', 'Syllabus deel 3, p. 24-34 en 74-84', 'samenvatting.html#upstream'],
      [16, 25, 'Sidestreamtransactie', 'Bij verkoop tussen twee dochters bepaalt het belang in de verkopende dochter de resultaatverdeling. Elimineer de interne winst voor zover de goederen op balansdatum nog binnen de groep aanwezig zijn.', 'Syllabus deel 3, p. 214-238', 'samenvatting.html#sidestream'],
      [26, 27, 'Interne vaste activa', 'Elimineer de interne boekwinst en herstel vervolgens de afschrijving alsof de interne verkoop niet heeft plaatsgevonden. Het verschil werkt in latere jaren geleidelijk terug.', 'Syllabus deel 3, p. 239-248', 'samenvatting.html#mva'],
      [28, 30, 'Gecombineerde consolidatie', 'Werk in vaste volgorde: groepsstructuur, waarderingsgrondslag, intercompanyposities, ongerealiseerde resultaten, belastingeffect en resultaatverdeling. Controleer daarna de aansluiting van het eigen vermogen.', 'Syllabus deel 3, p. 5-15 en 239-248', 'samenvatting.html#tentamen']
    ],
    hk: [
      [1, 13, 'Verkrijgingsprijs als basis', 'Bij historische kostprijs blijft de deelneming enkelvoudig op verkrijgingsprijs staan, afgezien van bijzondere waardevermindering. Het resultaat uit deelneming volgt doorgaans het ontvangen dividend, waardoor consolidatiecorrecties anders lopen dan bij nettovermogenswaarde.', 'Syllabus deel 3, p. 104-112', 'samenvatting.html#nvw-hk'],
      [14, 20, 'Upstream bij kostprijs', 'De interne winst is bij de dochter ontstaan. In de consolidatie elimineer je het nettobedrag en verdeel je dit volgens het belang in de verkopende dochter; corrigeer ook het belastingeffect.', 'Syllabus deel 3, p. 119-124 en 159-165', 'samenvatting.html#upstream'],
      [21, 25, 'Downstream bij kostprijs', 'De winst is bij de moeder ontstaan en is enkelvoudig nog niet gecorrigeerd. Elimineer daarom in de consolidatie de volledige ongerealiseerde nettowinst bij de aandeelhouders van de moeder.', 'Syllabus deel 3, p. 113-118 en 153-158', 'samenvatting.html#downstream'],
      [26, 30, 'Kostprijs en consolidatie', 'Begin met de eliminatie van deelneming en eigen vermogen en verwerk daarna de resultaten sinds verkrijging. Controleer dividend, goodwill, minderheidsbelang en alle interne transacties afzonderlijk.', 'Syllabus deel 3, p. 104-185', 'samenvatting.html#tentamen']
    ]
  };

  function entryFor(code, number) {
    var entries = theory[code] || [];
    for (var i = 0; i < entries.length; i += 1) {
      if (number >= entries[i][0] && number <= entries[i][1]) return entries[i];
    }
    return null;
  }

  function addPanels() {
    document.querySelectorAll('.question[data-code][data-q]').forEach(function (question) {
      if (question.querySelector('.theory-panel')) return;
      var item = entryFor(question.dataset.code, Number(question.dataset.q));
      var body = question.querySelector('.qbody');
      var task = body && body.querySelector('.task');
      if (!item || !body || !task) return;

      var panel = document.createElement('details');
      panel.className = 'theory-panel';
      panel.innerHTML = '<summary><span class="theory-icon" aria-hidden="true">i</span><span>Basisregels bij deze vraag</span><span class="theory-chevron" aria-hidden="true"></span></summary>' +
        '<div class="theory-content"><h3>' + item[2] + '</h3><p>' + item[3] + '</p><p class="theory-source">' + item[4] + '</p><a class="theory-link" href="' + item[5] + '">Bekijk de volledige uitleg <span aria-hidden="true">→</span></a></div>';
      task.insertAdjacentElement('afterend', panel);
      body.classList.add('has-theory-panel');
    });
  }

  addPanels();
  window.addEventListener('hashchange', function () {
    document.querySelectorAll('.theory-panel[open]').forEach(function (panel) {
      panel.open = false;
    });
  });
})();
