# CAFA2: tentamenvragen als MC per onderwerp

Datum: 26 september 2026.

De eerdere bank bevatte 247 syllabusgerichte oefeningen en eigen varianten. Er was geen volledige één-op-éénkoppeling van die oefeningen naar alle tentamendeelvragen. Nu zijn alle **282 deelvragen uit 11 tentamens** afzonderlijk als MC oefenbaar. De bank bevat **529 unieke vragen**. De bestaande 247 vragen, antwoordopties, juiste antwoordposities en opgeslagen vraag-ID's zijn behouden.

## Dekking en bronnen

De invoer is uitsluitend de reeds ingevoerde tentamenomgeving: `data/exam-YYYYMMDD.js`. De tentamen-PDF's zijn niet opnieuw gescand. Elke MC-tegenhanger behoudt oorspronkelijke vraagtekst, casussectie en volledig antwoordmodel. `exam-practice-coverage.json` koppelt iedere tentamenvraag aan haar MC-ID, primaire onderwerp en eerdere casusvragen. Bestaande bronnotities over inconsistenties blijven zichtbaar.

| Bestaande oefeningen | Tentamenvragen als MC | Totaal |
|---:|---:|---:|
| 247 | 282 | 529 |

De termen in het filter geven de oefenreeks aan: **Syllabusvragen** zijn de bestaande onderwerpgerichte oefeningen, inclusief eigen varianten. **Tentamenvragen** zijn de nieuwe tegenhangers van oorspronkelijke deelvragen. De bronnen bij bestaande oefeningen zijn behouden; het filter herclassificeert deze varianten niet als letterlijke tentamenvragen.

Er zijn 42 vragen met afzonderlijk geschreven redeneringsopties. Bij de overige 240 vragen bestaan de afleiders uit gerichte wijzigingen van een concreet bedrag in de bronuitwerking. Die afleiders oefenen de controle van een uitwerking; zij zijn geen officiële antwoordmodellen. Bij meerdere toegestane bronantwoorden, zoals de gecorrigeerde v.o.f.-vraag van oktober 2023, noemt de juiste keuze de door het model toegestane alternatieven. De uitleg onder de gekozen optie verwijst naar het juiste bedrag of de juiste redenering en toont het volledige bronmodel.

Samengestelde vragen blijven volledig behouden. Een vraag met daadwerkelijk berekende belastingeffecten is ook via **Belastingeffecten bij consolidatie** bereikbaar. Die vraag heeft één MC-ID en één gedeelde antwoord-/scorehistorie, ook wanneer zij onder meerdere onderwerpen staat. Onderwerpaantallen mogen daarom niet worden opgeteld tot het aantal unieke vragen.

## Casus en bediening

Bij alle MC-vragen staat de casus links met dezelfde paneel- en schuifrandklassen als bij de tentamens. Breedte: standaard een derde, instelbaar tussen 25% en 60%. Slepen naar rechts vergroot de casus. Pijltjestoetsen, Home en End, verbergen/tonen en sessieopslag zijn ondersteund. Op mobiel staat de casus boven de vraag.

Bij tentamenvragen worden de volledige oorspronkelijke casus en algemene uitgangspunten getoond. Een gesloten blok bevat eerdere deelvragen en hun bronuitkomsten uit dezelfde casus. Deze uitkomsten zijn beschikbaar onafhankelijk van eigen eerdere antwoorden en worden niet vooraf uitgeklapt. Bij bestaande oefeningen verhuist de eigen casusinformatie naar hetzelfde paneel.

Het filter staat rechtsboven onder Werkwijze en geldt voor deel-/onderwerpkeuze, aantallen, voortgang, overzichten, vorige/volgende, opnieuw beginnen en voltooien. Filterkeuze en oefenpositie worden bewaard. Het voltooien van een gefilterde reeks beoordeelt de geselecteerde vragen; scores en antwoorden blijven via hun bestaande vraag-ID gedeeld.

## Verificatie

- De gehele bestaande Node-testset, inclusief bestaande opgaveroutes met jsdom, is geslaagd.
- `tests/exam-practice.mjs`: 282/282 bronkoppelingen, 529 unieke vragen, unieke opties, juiste antwoordrotatie, behoud van oorspronkelijke vraag en antwoordmodel, 807 geldige eerdere casusverwijzingen, oorspronkelijke MC-inhoud behouden.
- Browsercontrole lokaal én op `https://cafa2.pages.dev`: bronfilter, start per deel en onderwerp, doorgaan voorbij de laatste bestaande vraag, afronden van een gefilterde reeks, linkerpositie, slepen, toetsenbord, verbergen/tonen, goed antwoord en feedback, eerdere uitkomsten, filter-/breedtebehoud na herladen, desktop, mobiel en donkere modus.
- Assistent: 108 bestaande tests geslaagd; build en grenscontrole van de publicatiemap geslaagd met 529 MC-records. Nieuwe tentamen-MC-records krijgen ook de volledige casus en eerdere bronuitkomsten als context.

Publicatie: codecommit `8632743eda43078296e0d6e2f923792cb008350b`, Cloudflare-deployment `9efb3059-4ccb-42dc-8b4d-157486430a65`, status **success** op 26 september 2026. Live JS/CSS, MC-dekkingsdata en een vraagfragment komen byte-voor-byte overeen. De hoofd-HTML en vier `fallback/*.html`-pagina's geven HTTP 200 en komen overeen na weglaten van de door Cloudflare toegevoegde Analytics-scriptregel.

Rekenkundige controle bestaat hier uit aansluiting op het reeds ingevoerde officiële model en de bronbedragen waarop de afleiders zijn gebaseerd. De oorspronkelijke tentamencasus is niet opnieuw integraal onafhankelijk doorgerekend. De toegevoegde MC-vragen veranderen geen geconstateerde broninconsistenties stilzwijgend.

## Onderhoud en SRA

`node scripts/build-exam-practice.mjs` genereert publiceerbare data en vraagfragmenten uit `content/practice/exam-mc/`. `npm run build:practice` vernieuwt zowel de bestaande als de nieuwe reeks. Voor opnieuw afleiden uit gewijzigde tentamendata: installeer `requirements-practice.txt`, voer `scripts/author-exam-text-options.py` en `scripts/build-exam-practice.py` uit en herbouw daarna de publiceerbare bestanden. Controleer nieuwe tentamenonderwerpen en afleiders inhoudelijk vóór publicatie.

De SRA-uitvoering is nog openstaand. De [takenlijst](https://github.com/HMA9K/SRA/blob/main/docs/cafa2-mc-vervolgtaken-2026-09-26.md) is op 26 september 2026 naar SRA gepusht, commit `d09fa57775dee088897c44f84f6591bdc9f4466c`.

Bronnen: [bestaande CAFA2-tentamendata](https://github.com/HMA9K/CAFA2/tree/main/data), [dekking per deelvraag](https://github.com/HMA9K/CAFA2/blob/main/docs/mc-audit/exam-practice-coverage.json), [oefenomgeving](https://cafa2.pages.dev/index.html#oefenen).
