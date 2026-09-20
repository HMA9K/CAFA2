# CAFA2: leesstructuur van de samenvatting

## Aanleiding

De vorige versie bood veertig losse onderwerpen in één lange mobiele keuzelijst. Veel uitleg bestond uit tabellen en korte aanwijzingen. Het aantal onderwerpen en het slagen van technische tests waren geen voldoende maatstaf voor samenhang en leesbaarheid.

## Referentie en afbakening

De bestaande `HMA9K/SRA/SRA interactieve samenvatting.html` is daadwerkelijk gelezen en als visuele referentie bekeken. Overgenomen zijn de paars-groene presentatie, genummerde hoofdstuknavigatie, een hoofdstukinleiding, korte paragraaflinks en uitklapbare uitleg met voorbeelden. De CAFA2-inhoud komt niet uit SRA, maar uit de aangeleverde CAFA2-syllabi en uitwerkingen. SRA zelf, BELRE3 en het elders opgebouwde masterproject worden niet gewijzigd.

## Nieuwe hoofdstukindeling

1. Kapitaalbelangen en waardering.
2. Verwerking kapitaalbelangen.
3. Vreemde valuta.
4. Consolidatieproces.
5. Consolidatie: nettovermogenswaarde.
6. Consolidatie: verkrijgingsprijs.
7. Proportioneel en capita selecta.

De veertig bestaande onderwerpen zijn ondergebracht in 24 uitklapbare paragrafen. Ieder onderwerp komt precies eenmaal terug. De oorspronkelijke onderwerpankers blijven beschikbaar voor links vanuit oefenvragen, begrippen en oudere verwijzingen.

## Uitleg en samenhang

De nieuwe inleidingen en paragraafteksten leggen uit waarom de verschillende berekeningen en boekingen nodig zijn. Het doorlopende voorbeeld A bv/B bv verbindt verwerving, goodwill, resultaat deelneming, dividend en eindbalans (Syllabus Deel 1, p. 16–18; art. 2:389 leden 2 en 7 BW). De valutatekst verbindt functionele valuta, omrekenmethode en verwerking bij de moeder (Syllabus Deel 2, p. 4–9; RJ 122.106–109). De consolidatietekst onderscheidt intracomptabele correctie, extracomptabele eliminatie, balansstanden en resultaatmutaties (Syllabus Deel 3, p. 5–7, 64–103 en 153–185).

Titels gebruiken begrippen uit de syllabus, zoals Resultaat deelneming, Goodwill, Voorraadtabel en Proportionele consolidatiemethode. Verkrijgingsprijs wordt expliciet onderscheiden van de historische-kostengrondslagen die ook bij NVW kunnen worden toegepast (Syllabus Deel 1, p. 13–16).

## Mobiel en informatiedichtheid

De native lijst met 45 keuzen is verwijderd. Het mobiele menu heeft zeven hoofdstukken in een ondoorzichtig paneel met begrensde hoogte. Paragraaflinks staan vóór de hoofdstukinleiding. De vorige en volgende hoofdstukken zijn vanuit de compacte balk bereikbaar.

Rond schema's en tabellen zijn de marges verkleind. Tabellen met gewone verklarende tekst gebruiken de beschikbare schermbreedte. Brede numerieke tabellen blijven afzonderlijk horizontaal verschuifbaar. Debet- en credittabellen blijven waar mogelijk volledig in beeld zonder de hele pagina te verbreden. Meer tekst is toegevoegd om de stof uit te leggen, niet door extra lege ruimte te creëren.

## Behoud en toetsing

Oefenvraaggegevens, antwoordalternatieven, officiële tentamens en opslag- en scorelogica worden door deze wijziging niet aangepast. De bestaande onderwerpmarkeringen worden per hoofdstuk samengebracht zonder de oude gegevens te wissen.

Controleer met:

```sh
node scripts/prepare-summary-reader.mjs
node scripts/build-learning-revision.mjs
npm test
node tests/summary-ui.mjs
python tests/reader-browser.py
```

Gebruik `TEST_WEBKIT=1` voor een aanvullende WebKit-controle. Een controle in een gesimuleerde mobiele browser is geen test op de fysieke iPhone van de gebruiker. De werkelijke testuitkomsten worden afzonderlijk in het uitvoeringslogboek vastgelegd.
