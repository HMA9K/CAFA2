# CAFA2 Assistent: integratie en overdracht

Versie 2026-09-24.4. Repository: HMA9K/CAFA2. Werkbranch: `codex/cafa2-assistant-handoff`. Pull-request: [#13](https://github.com/HMA9K/CAFA2/pull/13), concept.

## Status van deze werkronde

De assistent is op deze branch in de bestaande CAFA2-pagina geïntegreerd. De dry-run van `scripts/prepare-study-assistant.mjs` is eerst gecontroleerd: precies zeven verwachte bestanden. Daarna is `--apply` uitgevoerd; een tweede dry-run gaf geen wijzigingen. De frontendimports, npm-scripts, ignore-regels en vier Pages Functions staan nu op hun bedoelde plaats. De build levert de publieke `dist` en een afzonderlijke servercatalogus. `main`, de bestaande Pages-instellingen en de productiewebsite zijn niet aangepast.

Alle 247 oefenvragen, 131 echte tentamenvragen en 3 demonstratievragen zijn opnieuw door de canonieke catalogus- en revisietests gehaald. De browserproef gebruikt de echte CAFA2-interface met een gesimuleerde antwoorddienst. De inhoudelijke kwaliteit van een echt model en externe bronpassages zijn hiermee nog niet vastgesteld. Zie [CAFA2_ASSISTENT_TESTSTATUS.md](CAFA2_ASSISTENT_TESTSTATUS.md) voor exacte testresultaten en beperkingen.

Op integratiecommit `d2ccac4` zijn beide GitHub Actions-workflows geslaagd, inclusief 96 browsercontroles in Chromium en 96 in WebKit. De Cloudflare-branchpreview van die commit faalde afzonderlijk: de huidige Pages-build voert `exit 0` uit, zodat de Functions de nog niet gegenereerde servercatalogus niet kunnen vinden. De benodigde preview- en runtime-inrichting staat in het activatiedocument.

Bij de vervolginventarisatie zijn ook de 40 bestanden van de lokale repetitiecursus gevonden. Zij stonden buiten de eerder bekeken collegemap. Het nieuwe relatieve bronmanifest omvat nu 95 kandidaatbestanden, waaronder repetitieslides, opgaven, uitwerkingen, syllabus en tentamens. De 11 oude `.ppt`-bestanden zijn als PDF in een afzonderlijke lokale stagingmap omgezet. Er is nog geen document geüpload of met File Search verbonden. De huidige productiesite bevat de assistent niet. De branchworkflow krijgt een extra controle op de gegenereerde catalogus, Functions, routes en openbare uitvoermap; de gedeelde Cloudflare-buildinstelling blijft ongewijzigd.

## Opdracht en afbakening

Werk de voorbereide assistent verder uit en integreer hem in de bestaande CAFA2-leeromgeving, voor alle oefenvraagtypen en alle volledige tentamens. Bouw voort op deze bestanden. Herstructureer de repository niet: dat is een afzonderlijk, later project. Pas SRA en BELRE3 nu niet aan; houd de interface, server en adapterafspraak wel herbruikbaar.

Deze overdracht is gebaseerd op `main`-commit `dd813848fcb272e23dd54775642066843e91bfd9`. De bestaande rekenmachine-, bronpaneel- en andere wijzigingen uit die commit blijven behouden. De oude branch `feature/study-assistant` en oudere ZIP-pakketten zijn niet het vertrekpunt.

In de oorspronkelijke overdrachtscommit waren alleen nieuwe bestanden klaargezet. In deze werkronde zijn `index.html`, `package.json` en `.gitignore` gericht aangepast; de vier endpointtemplates zijn naar `functions/api/` gekopieerd. Vraagdata, scorelogica, timers, rekenmachinecode en hostinginstellingen zijn niet gewijzigd. Er is geen backend geactiveerd en geen API-tegoed gebruikt.

## Doorslaggevende gebruikerskeuze: hints zijn geen blokkade

Dit is een oefenomgeving, geen beveiligde examenafname. De leerling mag met de bestaande antwoordknoppen de uitwerking zien. De assistent moet daarom niet moeilijk doen wanneer om een antwoord wordt gevraagd.

| Leervraag of situatie | Vereist gedrag |
| --- | --- |
| 'Hoe begin ik?' / 'Ik snap dit niet' | Eerst een gerichte hint of begripsuitleg, niet ongevraagd de volledige oplossing. |
| 'Wat is het antwoord?' | Direct het antwoord met passende toelichting. Geen verplichte poging, inlevering, bevestiging of standwissel. |
| 'Waarom is B goed?' | Controleer het antwoordmodel en licht de betreffende keuze meteen toe. Als B niet goed is, corrigeer die veronderstelling. |
| 'Waar komt dit bedrag uit de uitwerking vandaan?' | Direct de betreffende berekening en casusgegevens uitleggen. |
| 'Geef de volledige berekening/journaalpost' | De volledige relevante uitwerking geven. |
| 'Vergelijk mijn antwoord met de uitwerking' | Gebruik het actuele eigen antwoord. Bij een leeg antwoord gewoon de oplossing toelichten; verzin geen leerlingfout. |
| 'Alleen een hint, nog geen antwoord' | Respecteer dit, ook als eerder het antwoord is besproken. |
| 'Licht stap 2 toe' na een antwoord | Behoud de gesprekscontext bij dezelfde vraag. |
| Toets loopt, is gepauzeerd of niet nagekeken | Geen didactische blokkade. De assistent verandert de timer niet. |

Dit is ook technisch verwerkt: `makeModelRequest()` krijgt in beide voorkeursstijlen het canonieke antwoordmodel. Er is geen keywordfilter dat de toegang tot uitwerkingen bepaalt. De normale leervraag bepaalt de uitlegstijl via modelinstructies. `canReview` is geen toestemmingstoets meer. De antwoordknop verstuurt, na toegang en privacytoestemming, direct een verzoek om antwoord en uitleg. Gespreksgeschiedenis blijft bij een stijlwissel behouden.

Toegangscode, privacytoestemming en kostenlimieten blijven bestaan. Dat zijn technische waarborgen, geen examenbeveiliging.

## Wat er ligt

| Bestanden | Functie |
| --- | --- |
| `js/study-assistant.mjs` | Chatpaneel, geschiedenis per vraag/poging/revisie, antwoordknop, status, toegang en foutafhandeling. |
| `js/study-assistant-cafa2.mjs` | Alleen-lezen adapter voor CafaPractice en CafaExams; eigen tekst, journalRows, stockCells en voorraadtabelschema. |
| `js/study-assistant-schema.mjs` | Canonieke normalisatie van vraag, casus, opties, uitwerking, bronnen en revisie-ID. |
| `js/study-assistant-render.mjs` | Beperkte Markdownrenderer met tekstnodes en tabellen, geen uitvoerbare model-HTML. |
| `css/study-assistant.css` | Afzonderlijke paneelstijl, mobiel en donkere modus via onder meer data-study-theme. |
| `assistant/server/handler.mjs` | Responses API, sessiecookie, inputcontrole, canonieke servercontext, quota en file_search-aansluiting. |
| `assistant/server/schema.sql` | Technische gebruikstellers, geen chat- of antwoordopslag. |
| `assistant/pages-functions/study-*.js` | Vier endpointtemplates: status, auth, chat en logout. |
| `scripts/prepare-study-assistant.mjs` | Expliciete, herhaalbare integratie. Zonder --apply alleen een overzicht. |
| `scripts/build-study-assistant.mjs` | Genereert servercatalogus in delen en publieke uitvoer in dist. |
| `scripts/verify-study-assistant-build.mjs` | Controleert voor deployment catalogus, vier Functions, routes en scheiding van privébestanden uit dist. |
| `assistant/source-manifest.json` en `scripts/prepare-assistant-sources.mjs` | Relatieve lijst met lokale bronkandidaten, offline dry-run en expliciete opt-in voor externe indexering. Bronbestanden blijven buiten Git. |
| `tests/study-assistant/` | Beveiliging, antwoordgedrag, alle echte vraagrecords en browserproef met mockdienst. |
| `.github/workflows/assistant-handoff.yml` | Controleert de branch zonder deployment of echte modelaanroepen. |

De vragenbank is geen handmatig onderhouden duplicaat: de build leest de actuele `data/`-scripts uit index.html. De huidige gegevens omvatten 247 oefenvragen, 131 echte tentamenvragen en 3 demovragen. De oefenbank bevat 12 benoemde vraagtypen, waaronder Theorie, Reken-/Berekenvraag, Journaalpost, Voorraadtabel, Methodekeuze, Vergelijking, Herkenning en Foutdiagnose.

De servercatalogus blijft buiten dist. De bestaande CAFA2-bronbestanden en uitwerkingen die al in de browserdata staan worden hiermee niet ineens privé. Dit project pretendeert geen beveiligde toetsafname te zijn.

## Startprocedure voor Codex

Lees eerst dit document, `docs/CAFA2_ASSISTENT_ACTIVEREN.md` en `docs/CAFA2_ASSISTENT_TESTSTATUS.md`. Respecteer eventuele bestaande AGENTS.md-instructies; maak nu geen nieuwe globale masterstructuur.

Voer vanuit de repository-root uit, met Node.js 22:

```bash
node --test tests/study-assistant/*.test.mjs
node scripts/prepare-study-assistant.mjs
node scripts/prepare-study-assistant.mjs --apply
node scripts/build-study-assistant.mjs
npm test
```

Bekijk daarna de diff. De voorbereidingsprocedure hoort alleen assistentimports, de twee npm-scripts, ignore-regels en vier endpoints toe te voegen. Niet automatisch een oude index.html of hele map uit een ZIP terugplaatsen. Commit geen dist, gegenereerde catalogusdelen, backups of geheimen.

De browserproef vereist Python Playwright en een geïnstalleerde Chromium-browser; WebKit wordt daarnaast in CI gecontroleerd:

```bash
python -m pip install playwright==1.57.0
python -m playwright install chromium webkit
python tests/study-assistant/browser.py
ASSISTANT_BROWSER=webkit python tests/study-assistant/browser.py
```

Een reeds beschikbare Chromium kan via CHROMIUM_PATH worden gekozen. Het testscript start een lokale HTTP-server en simuleert alleen de antwoorddienst. Het gebruikt de echte CAFA2-pagina, niet een nagemaakte voorpagina.

## Uitgevoerde inhoudelijke en technische controle

De CAFA2-adapter onderscheidt nu lege antwoorden van keuze A, koppelt de stabiele optie-ID van tentamens aan de zichtbare antwoordindex en ontleent een historische inzage uitsluitend aan de betreffende poging. Een onderwerpreset begint een eigen gesprek. Journaalpostkolommen en voorraadcellen gaan met het actuele eigen antwoord mee. Bij een expliciete verwijzing naar een eerdere deelvraag in dezelfde casus krijgt het model gericht die eerdere uitwerking. Het antwoordvenster en de historische inzage bieden een knop met de bijbehorende vraagcontext.

Een routewissel controleert de actuele vraag ook wanneer een modelantwoord sneller terugkomt dan de vertraagde schermverversing. Op mobiel staat de zwevende assistentknop boven de vaste tentamenbalk. Bij een geopende rekenmachine is de assistent vanuit de rekenmachinekop bereikbaar. De server begrenst ook de modelrespons, verwerkt onvolledige en ongeldige antwoorden expliciet en geeft bij quota de werkelijke wachttijd terug. Nieuwe regressietests dekken deze fouten.

## Nog nodig voor een echte preview en modelproef

1. Configureer een afzonderlijke Cloudflare-preview met build naar `dist`, een preview-D1-database en de runtimevariabelen uit [CAFA2_ASSISTENT_ACTIVEREN.md](CAFA2_ASSISTENT_ACTIVEREN.md). De huidige Pages-configuratie bouwt de assistent niet en heeft geen D1-binding. De bestaande projectbuild direct omzetten zou ook `main` raken.
2. Kies een beschikbaar Responses-model en voer een kleine, traceerbare reeks echte vragen uit. Beoordeel hints, expliciete volledige uitwerkingen, onjuiste aannames over antwoordletters, bedragherleiding, ontbrekende antwoordmodellen en vervolgvragen. De automatische tests gebruiken uitsluitend testreacties. De uitvoerlimiet van 1.800 tokens en het tekstgebaseerde gesprek verdienen daarbij aparte aandacht.
3. Controleer welke originele CAFA2-bronbestanden extern mogen worden geïndexeerd, met name de repetitie- en collegeslides. Het manifest en de lokale conversies zijn klaar; de aangetroffen sets en de dry-run staan in het activatiedocument. Op dit moment is geen syllabus, slide of tentamen-PDF gekoppeld; bronlabels uit de vragenbank bewijzen geen bronpassage.
4. Controleer daarna de echte Cloudflare-status, sessiecookie, D1-quota en File Search-resultaten op de preview. Een fysieke iPhone met geopend toetsenbord is nog een afzonderlijke gebruiksproef.

De repository wordt hier niet geherstructureerd. SRA en BELRE3 krijgen later hun eigen adapter en broncatalogus. Pull-request #13 blijft concept; er volgt geen zelfstandige merge naar `main` of productieactivering.

## Acceptatiecriteria

Alle huidige hoofdapp-vragen kunnen hun eigen context aanleveren. Een expliciet antwoordverzoek krijgt geen didactische weigering. Stijlwissels verliezen geen context. Vraagwissels nemen geen gesprek van een andere vraag mee. Een vertraagd antwoord verschijnt nooit bij een nieuwe vraag. Antwoorden, scores, tijd en bestaande broninhoud blijven intact. Ontbrekende backend of bronkennis wordt eerlijk gemeld. Verbruik is begrensd en credentials blijven server-side. Tests en nog ontbrekende controles zijn afzonderlijk benoemd.

SRA en BELRE3 volgen in een latere opdracht via eigen adapters en eigen broncatalogi. De repo-herstructurering blijft eveneens buiten deze opdracht.
