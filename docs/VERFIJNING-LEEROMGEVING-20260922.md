# CAFA2: compacte klikroute en context bij de bron

Deze wijziging volgt op main dba2ff25671476eef827147986ab21773dbedd19. Het oude HTML-voorbeeld is niet de bouwbasis van de nieuwe route.

## Bediening

Kapitaalbelangen bestaat uit drie rechtstreeks aanklikbare stappen: classificatie, waardering en consolidatie. Slechts één stap is zichtbaar; de andere uitkomsten worden bij elke keuze meteen opnieuw berekend. Er zijn geen selectvelden, inklapformulieren of berekenknoppen. Afhankelijke waarderingskeuzes worden gewist zodra het uitgangspunt verandert. Dochter, deelneming en groep blijven afzonderlijke kwalificaties. De verschillende houders en doelrechtsvormen krijgen geen conclusie buiten de reikwijdte van de betreffende wettelijke bepaling.

Wetsverwijzingen openen een niet-modaal bronvenster bij de aangeklikte tekst. Normaal staat het direct eronder; waar nodig schuift de pagina de verwijzing in beeld. Alleen als een vast schermonderdeel geen ruimte laat, is plaatsing erboven de begrensde terugval. De achtergrond blijft bruikbaar. Escape, sluiten en een klik buiten het venster sluiten het venster. Toetsenbordfocus keert bij expliciet sluiten terug naar de verwijzing.

De oude paarse vlakken waren volledige leden van de letterlijke wettekst, geen interpretatie. Het nieuwe venster vermeldt expliciet Letterlijke wettekst en Gearceerd = kern voor deze verwijzing. Geen vertaling. De nadruk ligt op exacte deelzinnen uit de studiekopie. Een expliciet lid gaat voor; bij een bredere verwijzing kiest de context de passende bepaling. Zonder passende context staat er Algemene kern van het artikel. Cumulatieve voorwaarden, bijvoorbeeld art. 2:407 lid 2 (studiekopie p. 31), blijven samen leesbaar. Volledig artikel toont ook de overige leden, zonder de uitleg met de wettekst te vermengen. De bronversie blijft de aangeleverde studiekopie van 01-01-2025.

De rekenmachine is een verplaatsbare, inklapbare floater zonder schermbedekkende achtergrond. Hij is ook vanuit de samenvatting beschikbaar. De eerdere rekenparser blijft intact; toetsen werken alleen wanneer de rekenmachine zelf focus heeft. Uitkomst en geheugen worden per tab bewaard tijdens navigatie. Open vensters veranderen geen antwoorden, timerinstellingen of normering.

## Hoofdstukoriëntatie

Alle zeven hoofdstukken beginnen met Dit heb je nodig en Dit ga je leren. Deze leeswijzers zijn afgeleid uit de bestaande hoofdstukinhoud en de genoemde syllabuspaginareeksen. Ze zijn geen nieuwe officiële leerdoelen van Nyenrode. Links brengen de student naar de relevante basisstof.

## Herkomst Tentamenaanpak

De eerdere pagina in scripts/build-learning-revision.mjs bevatte algemene stappen en foutsignalen, brede verwijzingen naar het onderwijsprogramma en vier uitwerkingen, maar ook aanwijzingen over de zelfgeschreven oefenvragen. Dat was geen voldoende herleidbare analyse per tentamenvraag.

De zichtbare pagina wordt nu vervangen door zeven concrete, filterbare voorbeelden uit vier aangeleverde uitwerkingen:

| Uitwerking | Vraag | Pagina | Toepassing |
| --- | --- | --- | --- |
| 24-09-2025, na normering | 7 en 8a | 4 | 54,3% stemrecht tegenover 48% winstrecht; Norm, Motivering, Conclusie. |
| 30-09-2024 | 3 en 4 | 4 | Overgang naar zichtbaar eigen vermogen per aankooplaag, goodwill en controle van de eindwaarde. |
| 17-04-2025 | 11 | 8 | Monetaire-positiebrug en € 81.000 koersverlies. |
| 17-04-2025 | 13 en 14 | 9 | Slotkoersverloop, € 216.000 omrekeningsverschil en boeking. |
| 22-04-2024 | 16, 17 en 19 | 10–11 | Sidestream: eindstand tegenover mutatie en belasting. |
| 22-04-2024 | 22 | 13 | Lege interne-correctiekolom bij deze HK-upstreamuitwerking. |
| 22-04-2024 | 20 en 21 | 13 | Splitsing van ontvangen dividend over deelneming en opbrengst. |

De bedragen, tabellen en paginavindplaatsen zijn gecontroleerd in de aangeleverde PDF-uitwerkingen. De nieuwe stappen heten afgeleid leeradvies: geen officiële stappenplannen, frequentieanalyse of voorspelling. Niet elk tentamen is geanalyseerd. Er is geen nieuwe PDF-validatie van het tentamen van 29-04-2026 geclaimd. De oorspronkelijke examendata en antwoordmodellen zijn niet gewijzigd.

Bij 30-09-2024 staat bewust zichtbaar eigen vermogen, conform het model. De afschrijving goodwill is € 27.500; de mutatie Overige reserves van € 22.500 is de vermogenssprong van € 50.000 minus die afschrijving. Deze verschillende bedragen mogen niet met elkaar worden verward.

## Testen

`npm run build:study` bouwt reproduceerbaar. `npm test` controleert bestaande inhoudssignaturen, rekenuitkomsten en de nieuwe bronselectie, zeven oriëntaties en zeven voorbeeldroutes. Elk handmatig opgegeven gearceerd tekstfragment moet exact in de oorspronkelijke artikeltekst voorkomen.

`python tests/study-refinement-browser.py` test de nieuwe bediening in Chromium en WebKit. `python tests/study-upgrade-browser.py` behoudt de bestaande echte HTTP-tests voor terugkeer, voortgang, herstarten, thema en tentamentijd. Alleen de vervangen UI-verwachtingen zijn bijgewerkt.

In de lokale uitvoeromgeving zijn broncontroles en componenttests uitgevoerd met inline pagina-assets op about:blank, zonder netwerkaanvragen of wijziging van browserbeleid. De testmodus gebruikt een tijdelijke geheugenopslag en claimt geen cross-page- of sessiedekking. De normale browserprocedure in GitHub Actions gebruikt een echte HTTP-server en de echte opslag. Testspecificaties en rapporten onderscheiden deze twee modi. Een fysieke iPhone-test wordt niet geclaimd.
