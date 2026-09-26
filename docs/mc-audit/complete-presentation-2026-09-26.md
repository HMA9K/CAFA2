# Volledige presentatiecontrole, 26 september 2026

De eerdere reparatie controleerde twee oudere casussen en 25 financiële uitwerkingen. De volgende screenshots wezen op extra problemen: recente tabellen kregen geen gedeelde celopmaak, oudere casussen bevatten vaste tekstblokken, en de tentamenpagina overschreef rode puntentoekenning. Dit vervolg herstelt de gedeelde presentatie in oefenen en tentamens.

## Uitgevoerde wijzigingen

- MC-antwoordopties krijgen echte tabelopmaak met celgrenzen, passende kolommen en uitgelijnde bedragen. De voorraadmatrix behoudt alle zes kolommen. Dezelfde matrix is invulbaar bij Zelf uitwerken.
- Alle 44 bestaande casussecties krijgen een brongebonden presentatierecord. Vaste tekstblokken zijn omgezet naar alinea's, kopjes en opsommingen. De zes overige platte casussen uit 2023 hebben expliciete kolomindelingen voor hun financiële gegevens. De reeds herstelde organisatieschema's blijven eenmaal bij de juiste tekst staan.
- Tentamenantwoordmodellen tonen rode punten. De punten blijven rood wanneer ze binnen vetgedrukte tekst staan; jaartallen worden niet als punten aangemerkt. Financiële berekeningen gebruiken een papierachtige opmaak zonder raster. Debet en Credit blijven bij journaalposten zichtbaar. Het Olbia-model van 24 september 2025, vraag 1, heeft een aparte fair-valuekolom, eurobedragen en subtotalen overeenkomstig het aangeleverde voorbeeld.
- Bij een voorraadinvulvraag vervalt de tweede lege vraagmatrix. Er blijft één invulmatrix over, met kleinere cellen en invoervelden. Ook de ruimte boven deze matrix is verkleind. Op desktop staat de assistentknop bovenaan zodat deze geen voorraadcellen bedekt. De oorspronkelijke rij-/kolomindeling en opgeslagen celsleutels blijven behouden.
- Tijdens een tentamen verwijst de knop linksboven naar Dashboard. De browsercontrole verlaat een ingevulde vraag via die knop en hervat dezelfde poging met de bestaande antwoorden.
- De knop Introductie is verwijderd uit MC-oefenvragen.

De oorspronkelijke tentamendata zijn ongewijzigd. Er zijn geen tentamens opnieuw gescand. De presentatie is gebaseerd op de reeds ingevoerde inhoud en de aangeleverde screenshots. De publicatie behoudt de gelijktijdig gepubliceerde dashboardvolgorde en directe assistentknop.

## Controle

`tests/exam-presentation.mjs` controleert de bronhash en het behoud van bedragen/percentages voor alle 44 casussecties, de oorspronkelijke 25 financiële mappings en de bestaande Toren-aansluiting. Daarnaast zijn losse platgelezen bedragen, geïsoleerde diagrampercentages en vaste tekstblokken uitgesloten.

`tests/exam-presentation-complete-browser.mjs` controleert de echte interface:

- SchierGlas/Ridder, 24 september 2025 vraag 30: vier voorraadopties met celgrenzen en een invulmatrix die na herladen behouden blijft.
- Vraag 31 van hetzelfde tentamen: journaalopties en een tentamenmodel met zichtbare debet-/creditkolommen en rode normering.
- Rast Holding/Filzen, 6 oktober 2022: leesbare doorlopende casustekst met opsommingen.
- Neige/TCC/Genser, 9 oktober 2023: brongebonden balansen, verloopstaat en koersoverzichten in echte tabellen.
- Monserrato/Olbia, 24 september 2025 vraag 1: berekeningskolommen, subtotalen en rode puntentoekenning, ook in donkere modus.
- Oldemarcke/Westerbles, vraag 15: één compacte voorraadmatrix, opslag/hervatten via Dashboard en bereikbare kolommen op mobiel.

Schermen zijn gecontroleerd op 1680 × 1186, 1366 × 900 en 390 × 844. Het laptopcriterium controleert ook dat de volledige invulmatrix verticaal binnen het vraagpaneel past. Screenshots staan in `docs/mc-audit/qa-complete-presentation/`.

De overeenkomstige eisen zijn in [SRA als openstaande taken vastgelegd](https://github.com/HMA9K/SRA/blob/main/docs/cafa2-mc-vervolgtaken-2026-09-26.md), commit `48ce102`. De SRA-applicatiecode is voor dit vervolg niet gewijzigd.

Het oorspronkelijke controleverslag blijft beschikbaar in [financial-presentation-2026-09-26.md](https://github.com/HMA9K/CAFA2/blob/main/docs/mc-audit/financial-presentation-2026-09-26.md).

## Publicatiebewijs

- Cloudflare-publicatie `f5166940-b24c-41d0-8190-0009bab36bd9` is succesvol op [CAFA2](https://cafa2.pages.dev/).
- Achttien live-bestanden komen overeen met het gecontroleerde publicatiepakket: index, runtimecomponenten, casuspresentatie, tabel-/documentstijlen en vier directe HTML-fallbacks. Bij HTML is uitsluitend de door Cloudflare toegevoegde analyticsbeacon buiten de vergelijking gehouden.
- De volledige gerichte browsercontrole is op de live website geslaagd, inclusief de aanvankelijke laptopweergave van de hele matrix en de controle dat de assistentknop geen cellen bedekt. De elf opgeslagen screenshots tonen de live schermen.
- [GitHub-validatie](https://github.com/HMA9K/CAFA2/actions/runs/36251362867) is geslaagd. De [algemene assistentcontrole](https://github.com/HMA9K/CAFA2/actions/runs/36251362890) is eveneens geslaagd, inclusief 108 tests, de publicatiebouw, regressietests en echte browsercontroles in Chromium en WebKit.
- De browsercontrole accepteert zowel de lokale `index.html`-route als de schone Pages-route `/`, met dezelfde Dashboard-bestemming op dezelfde origin.
- Controleverslag, testbestand en screenshots zijn gecontroleerd op gebruikersgegevens. De screenshots tonen Anoniem en bevatten geen ingesloten persoonlijke metadata. De aanvullende vastlegging gebruikt de bestaande projectidentiteit en het GitHub-noreplyadres.
