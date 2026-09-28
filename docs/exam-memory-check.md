# Controle van schermupdates en PDF-geheugen

Datum: 28 september 2026. Controle in een afzonderlijk Chrome-testprofiel, op desktop met twee PDF-panelen. De browser bevatte uitsluitend testantwoorden; bezoekmeting stond uit.

## Bevindingen en herstel

| Controle | Voor herstel | Na herstel |
|---|---|---|
| Geplande animatiecallbacks tijdens één seconde stilstand op het startscherm | 190 | 0 |
| Geladen PDF-lezers na achtereenvolgens openen van beide documenten van drie tentamens | 6 | 2 |

De navigatiebalk verving identieke tekst bij iedere schermupdate. De observer zag dat als een nieuwe wijziging en plande opnieuw een update. Identieke tekst wordt nu behouden.

De PDF-cache hield alle eerder geopende documenten vast. De cache bewaart nu twee lezers en verwijdert oudere, inactieve lezers nadat hun arceringen zijn opgeslagen. Bij een opslagfout blijft een lezer met onopgeslagen arceringen behouden, ook als daardoor tijdelijk meer lezers nodig zijn. Opnieuw openen tijdens het opslaan beschermt de actieve lezer.

Binnen hetzelfde tentamen blijven de bestaande lezers beschikbaar bij vraagwisseling, kort sluiten, zoomen en wisselen naar de assistent. Een tijdelijk ontbrekend vraagscherm tijdens het laden sluit het PDF-paneel niet meer. Bij het opnieuw laden van een verwijderd document worden de opgeslagen leespositie en arceringen hersteld.

Deze controle toont twee concrete bronnen van onnodige browserbelasting. Zij stelt niet vast welk aandeel CAFA2 heeft in het totale geheugengebruik van een bestaand Chrome-profiel, en bewijst niet dat ieder incidenteel vastlopen hiermee is verholpen.

## Verificatie

- Het volledige `test`-script slaagt, inclusief de DOM-controles met jsdom.
- `tests/exam-memory-browser.cjs` controleert stilstand op start- en oefenscherm, het aantal PDF-lezers, een ingevulde journaalpost, echte arcering, leespositie na verwijdering en opnieuw openen, opslagfouten en opnieuw openen tijdens opslaan.
- `tests/exam-pdf-state-browser.cjs` controleert dezelfde leescontext bij tentamen- en oefenvraagwisseling, kort sluiten, assistentconcepten en desktop/mobile.
- `tests/pdf-reader-browser.cjs` controleert echte tekstselectie, arceringskleur, verwijderen, opgeslagen arceringen, paginaweergave en smalle vensters.
- De algemene prestatietest controleert behoud van antwoorden, eerste score, markering, feedback, herladen, terugnavigatie, volledige afdruk, mobiel en laadfouten.
- Het herstel is opnieuw getest bovenop de hoofdbranch met de schakelaars voor PDF-paginaweergave. Andere werkmappen zijn niet gewijzigd.

## Bronnen

- [PDF-panelen](https://github.com/HMA9K/CAFA2/blob/codex/exam-freeze/js/exam-original-pdfs.mjs)
- [Schermindeling](https://github.com/HMA9K/CAFA2/blob/codex/exam-freeze/js/exam-cirrus-layout.js)
- [Browsercontrole](https://github.com/HMA9K/CAFA2/blob/codex/exam-freeze/tests/exam-memory-browser.cjs)
