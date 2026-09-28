# Antwoordmodellen: consistente tabelopmaak

De gedeelde weergave van antwoordmodellen heeft zichtbare kolomkoppen, subtiele celranden en gelijkmatige rijafstand. Financiële tabellen hebben vaste kolombreedtes. Journaalposten met USD en koers gebruiken dezelfde kolomgrenzen voor alle boekingen. Lange puntentoelichtingen en berekeningen breken binnen hun cel af; bedragen behouden hun uitlijning. Elke modeltabel heeft een eigen horizontaal schuifgebied voor smalle schermen.

## Controle

- Alle 282 oorspronkelijke antwoordmodellen uit elf tentamens zijn gecontroleerd: 201 tabellen, inclusief drie journaalposten met valutakolommen.
- De celteksten zijn vergeleken met de bestaande weergave. Bedragen, rekeningnamen en puntentoekenning zijn behouden.
- Alle modellen zijn op desktop en op 390 px breedte gecontroleerd, zowel licht als donker. Geen overlappende celinhoud of horizontale pagina-overloop gevonden na herstel.
- De bestaande journaalcontrole controleert daarnaast 1.282 tabelinstanties uit MC-opties, uitwerkingen en oorspronkelijke modellen. Inhoud, invoerbehoud, vergroten, versmald casuspaneel en mobiele bediening zijn geslaagd.
- Het Reiter-antwoordmodel is ook via de echte tentamenbediening geopend en nagekeken. Alle vier tabellen hebben zichtbare koppen; de creditkolommen zijn op mobiel bereikbaar.
- De volledige bestaande testopdracht, publicatiebuild en buildverificatie zijn geslaagd.
- De bestaande prestatietest wacht nu op opgeslagen eerste beoordeling en gebruikt de actuele TinyMCE-invoer. De verouderde test las de beoordeling vóór de details-toggle en vulde de inmiddels vervangen fallback-editor in. De antwoordmodelcontrole draait voortaan ook in deze GitHub-workflow.

Gerichte controle: `node tests/answer-model-layout-browser.mjs`. Omgevingsvariabelen `CAFA_PLAYWRIGHT_PATH` en `CAFA_CHROMIUM_PATH` kunnen een lokaal beschikbare testruntime instellen. De controle gebruikt de openbare bestanden als `CAFA_LIVE_URL` is ingesteld.

Dit is een controle van de presentatie en het behoud van bestaande inhoud. Er is geen nieuwe inhoudelijke vergelijking van alle antwoorden met de oorspronkelijke PDFs uitgevoerd.

Bronnen: [bestaande tentamendata](https://github.com/HMA9K/CAFA2/tree/main/data), [gedeelde documentweergave](https://github.com/HMA9K/CAFA2/blob/main/js/exam-document.js), [CAFA2](https://cafa2.pages.dev/).
