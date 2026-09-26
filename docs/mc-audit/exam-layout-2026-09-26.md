# MC-tabellen, deelvragen en patroonherkenning

Datum: 26 september 2026. Vervolg op de eerste invoer van 282 tentamenvragen.

De oudere antwoordmodellen bevatten op spaties uitgelijnde tekst en losgeraakte PDF-kolommen. De MC-conversie nam die opmaak over. Zelf uitwerken gebruikte bovendien uitsluitend de algemene teksteditor. Samengestelde vragen hadden één antwoord en beoordeling voor alle onderdelen.

## Uitvoering

- Journaalposten en financiële tabellen in MC-keuzes en uitwerkingen hebben echte rij- en kolomstructuur. De datumkolom blijft intact wanneer een bron een nulkolom leeg liet. Voor de problematische transcripties zijn 62 expliciete opmaak- en onderdeelregels vastgelegd in `content/practice/exam-structure-overrides.json`.
- 65 samengestelde bronvragen zijn opgesplitst. De 282 bronvragen leveren 380 tentamenoefeningen op. Met 247 syllabusvragen zijn er 627 unieke oefeningen. De oorspronkelijke casus blijft beschikbaar; eerdere onderdelen staan afzonderlijk uitklapbaar in het linker casuspaneel. Per onderdeel bestaat een eigen antwoord en beoordeling. Oorspronkelijke vraag-ID's blijven voor het eerste onderdeel bestaan; aanvullende ID's zijn toegevoegd.
- Zelf uitwerken hergebruikt `CafaJournalTable` en `CafaStockTable` uit de tentamenomgeving. De journaalpost heeft rekeningnaam, debet, credit, toelichting en extra rijen. De voorraadmatrix heeft invulvelden op de lege plaatsen. Vrije toelichting blijft aanvullend beschikbaar. Opslag, JSON-import/export, tekstexport en assistentcontext ondersteunen de ingevulde cellen en toelichtingskolom.
- Oude antwoorden en scores op volledige samengestelde vragen staan bij het eerste onderdeel onder **Je bewaarde antwoord vóór het opsplitsen**. Zij tellen niet als nieuwe deelbeoordeling. Afgeronde eerdere pogingen blijven in de historie staan.
- Patroonherkenning is voor alle 627 oefeningen opgebouwd uit **Herken de vraag**, **Let op de beslissende gegevens** en **Vorm van het antwoord**. De inhoud hangt af van de vraagsoort, onderwerp, enkelvoudige of geconsolideerde verwerking, tijdstip en onderdeel. Voorraad, goodwill, dividend, zeggenschap, reserves en vreemde valuta krijgen verschillende herkenningsuitleg. De generator gebruikt de vraag en bestaande context, niet de juiste antwoordletter of bedragen uit het antwoordmodel.

## Brongebruik en afwijkingen

Alle informatie komt uit de reeds ingevoerde `data/exam-*.js` en de syllabusgerichte vraagbank. De PDF's zijn niet opnieuw gescand. Het oorspronkelijke HTML-antwoordmodel blijft ongewijzigd beschikbaar bij **Bron en oorspronkelijke tentamenvraag**.

Bedragen die in de transcriptie van 2023 bij een volgende vraag terechtkwamen zijn aan de bijbehorende rekeningen en berekeningen gekoppeld, met een toelichting bij de relevante uitwerking. Drie aantoonbare afwijkingen zijn expliciet gecorrigeerd en toegelicht:

- 06-10-2021 vraag 10: belastinglast credit € 4.800, overeenkomstig 25% van € 19.200 en de debetzijde; bronregel credit vermeldt € 4.880.
- 11-04-2023 vraag 12b: aandeel derden credit € 4.800 bij eliminatie van de voorraadtoename; de transcriptie vermeldt D. De zes bedragen sluiten nu aan op het omzetdebet van € 100.000.
- 09-10-2023 vraag 22: machines GBP 660.000 volgens de casus, omrekening € 752.400. De berekeningsregel in de transcriptie vermeldt ten onrechte GBP 660.000.000.

Andere bestaande bronnotities en toegestane alternatieve rekeningen blijven beschikbaar. Deze revisie is geen nieuwe onafhankelijke doorrekening van alle tentamens.

## Verificatie en onderhoud

De bestaande regressietests en 108 assistenttests zijn geslaagd. De broncontrole verifieert 282 verschillende bronvragen, 380 oefeningen, 65 splitsingen, behouden bron-HTML, unieke opties, antwoordrotatie, correcte deelvolgorde, volledige tabelkolommen en 1.136 eerdere casusverwijzingen. De herkenningscontrole onderscheidt vraagsoorten en controleert onafhankelijkheid van het juiste antwoord.

Browsercontrole: echte MC-tabellen; invulbare voorraad en journaalpost met toelichting en extra rij; behoud na herladen; migratie van oude antwoorden en beoordeling; eerdere deeluitkomsten; bronfilter; casus slepen en toetsenbord; desktop/mobiel en donker. Screenshots staan in `docs/mc-audit/qa-exam-practice/`. Publicatie en live-controle worden na uitrol hieronder vastgelegd.

De studieassistent plaatst het volledige casus/vraagpaneel naast zijn eigen bediening. Ook de syllabusvoorraadtabel is daarmee bruikbaar. De leerbouw vervangt de volledige introductie tot het bronblok: een eerdere reguliere expressie verwijderde geneste basisregels onvolledig, waardoor antwoordvelden buiten het vraaglichaam kwamen. Een regressiecontrole verifieert voor alle 120 oorspronkelijke oefeningen, zowel in fragmenten als HTML-fallbacks, dat bronnen en antwoordvelden binnen het vraaglichaam blijven.

Herbouw: installeer `requirements-practice.txt`, voer `scripts/author-exam-structure.py`, `scripts/author-exam-text-options.py` en `scripts/build-exam-practice.py` uit. Daarna `npm run build:practice` en `npm run build:assistant`. `scripts/question-pattern.mjs` verzorgt herkenningsuitleg in de bestaande leerbouw, syllabusaanvullingen en tentamenoefeningen. Wijzigingen aan transcripties en nieuwe onderdeelregels vragen broncontrole.

De overeenkomstige SRA-punten blijven openstaand en zijn aan de [SRA-takenlijst](https://github.com/HMA9K/SRA/blob/main/docs/cafa2-mc-vervolgtaken-2026-09-26.md) toegevoegd, commit `f6c7a99c9fc829be6a96fa9e951da888115129cc`.

## Publicatie en live-controle

De volledige revisie staat op `HMA9K/CAFA2:main`. Codecommit `1d81fcfc1e21f4040c14a4448563e659dfce4c44` herstelt ook de geneste basisregelopmaak. Controlecommit `82c2ee738cea9cc19202cd2e7e1ccb60abd4cdd3` wacht op het sluitingssignaal van de assistent en beperkt tentamencasuscontroles tot de tentamenomgeving. Cloudflare-productiedeployment `9a71914b-e97d-4b86-9cea-d2a52109028a` heeft status **success**.

`tests/exam-layout-live.mjs` is op `https://cafa2.pages.dev` geslaagd: 627 vragen, vier echte MC-tabellen bij de voorraadvraag, voorraad- en journaalpostinvoer, behouden toelichting na herladen, vraaggerichte herkenning, invulbare syllabusmatrix, assistent naast de casus en sluiting met behoud van invoer, desktop/mobiel en donkere modus. De donkere tabelkoppen voldoen aan contrast 4,5:1. Het gepubliceerde vraagfragment en de HTML-fallback komen overeen met de gebouwde bestanden; in de fallback is de door Cloudflare toegevoegde analyticscode buiten de vergelijking gehouden.

De [algemene repositorycontrole](https://github.com/HMA9K/CAFA2/actions/runs/36246706890) is geslaagd. Ook de uitgebreide [assistentbrowsercontrole](https://github.com/HMA9K/CAFA2/actions/runs/36246707077) is geslaagd in Chromium én WebKit. Deze gebruikt een nagebootste antwoorddienst voor de schermbediening.

Bronnen: [bestaande tentamendata](https://github.com/HMA9K/CAFA2/tree/main/data), [MC-dekking](https://github.com/HMA9K/CAFA2/blob/main/docs/mc-audit/exam-practice-coverage.json), [CAFA2-oefenomgeving](https://cafa2.pages.dev/index.html#oefenen).
