# CAFA2 Assistent: integratie en overdracht

Versie 2026-09-25.3. Repository: HMA9K/CAFA2. Werkbranch: `codex/cafa2-assistant-handoff`. Pull-request: [#13](https://github.com/HMA9K/CAFA2/pull/13), concept.

## Actuele status: testsite actief, API-tegoed ontbreekt

De eigenaar heeft beide secrets rechtstreeks in Cloudflare opgeslagen. De testsite staat nu op `STUDY_ASSISTANT_ENABLED=true`. Deployment `04952337-5210-4741-a222-fd1064def0e9` van codecommit `994a113` is geslaagd. Status, echte login, beveiligde sessiecookie, ingelogde status en uitloggen zijn gecontroleerd. D1 registreert de login- en chattellers. De oorspronkelijke CAFA2-productiesite is ongewijzigd.

De eerste echte chatproef is geblokkeerd door OpenAI. Na een gerichte verbetering van de foutafhandeling bevestigt de browser `model_credits`, uitsluitend gekoppeld aan providercode `credit_balance_exhausted`: het OpenAI API-account heeft geen prepaid tegoed beschikbaar. De sleutel opnieuw invullen is niet nodig. De eigenaar moet tegoed toevoegen via [OpenAI Billing](https://platform.openai.com/settings/organization/billing/overview); er is geen betaling verricht of bestedingslimiet gewijzigd. Daarna kan dezelfde actieve testsite opnieuw worden beproefd, zonder wijziging van de Cloudflare-secrets.

De foutafhandeling onderscheidt nu tegoed, bestedingslimiet, gebruikslimiet en tijdelijke overbelasting. Alleen bekende foutcodes worden vertaald; providermeldingen, sleutels en invoer worden niet gelogd of teruggestuurd. Zeven nieuwe regressietests slagen, 81 Node-tests totaal. Echte modelkwaliteit is nog niet getest: beide verzonden modelverzoeken leverden een fout op. Zie de actuele teststatus voor de aanvullende controles en CI.

## Inrichting vóór activering

Op verzoek is [cafa2-assistent-test.pages.dev](https://cafa2-assistent-test.pages.dev) ingericht. Deze afzonderlijke site volgt de werkbranch automatisch, voert de assistentbuild en deploycontrole uit en publiceert `dist`. De eerste deployment van `c33f83a` is geslaagd, inclusief alle vier Functions. De statusroute geeft echte JSON en de browser koppelt het paneel aan de actuele vraag.

Een afzonderlijke D1-testdatabase met EU-jurisdictie, schema, binding en willekeurig sessiegeheim staat klaar. Het voorlopige testmodel is `gpt-5.4-mini`; modelkwaliteit en accounttoegang zijn nog niet getest. `STUDY_ASSISTANT_ENABLED=false`. Alleen `OPENAI_API_KEY` en `STUDY_ACCESS_CODE` moeten voor de eerste modelproef nog rechtstreeks als secrets in Cloudflare worden ingevuld. Zie [activering](CAFA2_ASSISTENT_ACTIVEREN.md) voor de korte handmatige stap.

De actuele gepubliceerde codecommit is `b6bc210`, testdeployment `bc07d611-688e-4fe7-afd1-4deb99207a51`. Beide GitHub Actions-workflows zijn geslaagd: [assistentcontrole](https://github.com/HMA9K/CAFA2/actions/runs/36071283868) en [bestaande validatie](https://github.com/HMA9K/CAFA2/actions/runs/36071288614). De afsluitende documentatiecommit publiceert geen nieuwe code.

Op het bestaande project `cafa2` is uitsluitend deze werkbranch uitgesloten van automatische previews, zodat de oude `exit 0`-fout zich daar niet herhaalt bij een volgende push. De bestaande productiebuild en website volgen nog `main`. Niets is naar `main` gemerged. De repetitiecursus en andere originele documenten zijn nog niet extern geïndexeerd. De eerdere lokale/CI-browserantwoorden waren gesimuleerd; de nieuwe online controle test alleen de uitgezette dienst en echte vraagcontext.

Na de eerste publicatie zijn de wijzigingen van `main` tot en met `1a44e3a` in de werkbranch opgenomen. Alle elf volledige tentamens staan nu in de catalogus: 282 echte tentamenvragen, 3 demovragen en 247 oefenvragen. De nieuwe onderwerpindeling en onafhankelijk scrollende tentamencasus blijven behouden. Het importconflict in `index.html` is opgelost met de actuele scripts plus de assistentmodule. De synthetische opgavereekstests zijn aangepast aan de expliciete bronindeling; een nieuwe regressie controleert alle 282 bronvragen in de vier onderwerpseries, inclusief eigen antwoorden en canonieke revisies. Lokaal slagen 74 Node-tests, de bestaande regressies, build/deploycontrole en 115 browsercontroles per engine in Chromium en WebKit, met gesimuleerde antwoorden.

## Eerdere implementatie- en controlerondes

De assistent is op deze branch in de bestaande CAFA2-pagina geïntegreerd. De dry-run van `scripts/prepare-study-assistant.mjs` is eerst gecontroleerd: precies zeven verwachte bestanden. Daarna is `--apply` uitgevoerd; een tweede dry-run gaf geen wijzigingen. De frontendimports, npm-scripts, ignore-regels en vier Pages Functions staan nu op hun bedoelde plaats. De build levert de publieke `dist` en een afzonderlijke servercatalogus. `main`, de bestaande Pages-instellingen en de productiewebsite zijn niet aangepast.

Alle 247 oefenvragen, 131 echte tentamenvragen en 3 demonstratievragen zijn opnieuw door de canonieke catalogus- en revisietests gehaald. De browserproef gebruikt de echte CAFA2-interface met een gesimuleerde antwoorddienst. De inhoudelijke kwaliteit van een echt model en externe bronpassages zijn hiermee nog niet vastgesteld. Zie [CAFA2_ASSISTENT_TESTSTATUS.md](CAFA2_ASSISTENT_TESTSTATUS.md) voor exacte testresultaten en beperkingen.

Op integratiecommit `d2ccac4` zijn beide GitHub Actions-workflows geslaagd, inclusief 96 browsercontroles in Chromium en 96 in WebKit. De Cloudflare-branchpreview van die commit faalde afzonderlijk: de huidige Pages-build voert `exit 0` uit, zodat de Functions de nog niet gegenereerde servercatalogus niet kunnen vinden. De benodigde preview- en runtime-inrichting staat in het activatiedocument.

Na opname van `main` zijn op codecommit `8a8bbf7` beide workflows opnieuw geslaagd: 65 Node-tests, de actuele tien regressiescripts en 103 browsercontroles in elk van Chromium en WebKit. De Pages-preview van dezelfde commit faalde nog steeds op de ongewijzigde projectbuild. De assistent is daardoor nog niet live. De nieuwe opgavereeks is in de assistentproef meegenomen.

Bij de vervolginventarisatie zijn ook de 40 bestanden van de lokale repetitiecursus gevonden. Zij stonden buiten de eerder bekeken collegemap. Het relatieve bronmanifest omvat nu 116 kandidaatbestanden, waaronder repetitieslides, opgaven, uitwerkingen, syllabi uit 2025 en 2026, tentamens en vier aanvullende cursusdocumenten. De 11 oude `.ppt`-bestanden zijn als PDF in een afzonderlijke lokale stagingmap omgezet. Een persoonlijk document is met reden uitgesloten. De lokale controle vindt 116 van 116 kandidaten gereed, zonder ongeclassificeerde bestanden of scanproblemen. Er is nog geen document geüpload of met File Search verbonden. De huidige productiesite bevat de assistent niet. De branchworkflow controleert ook de gegenereerde catalogus, Functions, routes en openbare uitvoermap; de gedeelde Cloudflare-buildinstelling blijft ongewijzigd.

## Opdracht en afbakening

Werk de voorbereide assistent verder uit en integreer hem in de bestaande CAFA2-leeromgeving, voor alle oefenvraagtypen en alle volledige tentamens. Bouw voort op deze bestanden. Herstructureer de repository niet: dat is een afzonderlijk, later project. Pas SRA en BELRE3 nu niet aan; houd de interface, server en adapterafspraak wel herbruikbaar.

Deze overdracht begon bij `main`-commit `dd813848fcb272e23dd54775642066843e91bfd9`. Latere wijzigingen uit `main` tot en met `f494ae7` zijn in de werkbranch opgenomen om de concept-PR samenvoegbaar te houden. De bestaande rekenmachine-, bronpaneel-, wetboek- en opgavereekswijzigingen blijven behouden. De oude branch `feature/study-assistant` en oudere ZIP-pakketten zijn niet het vertrekpunt.

In de oorspronkelijke overdrachtscommit waren alleen nieuwe bestanden klaargezet. In deze werkronde zijn `index.html`, `package.json` en `.gitignore` gericht aangepast; de vier endpointtemplates zijn naar `functions/api/` gekopieerd. De assistentintegratie wijzigt geen vraagdata, scorelogica, timers of rekenmachinecode. De samenvoeging vanuit `main` neemt de daar intussen gemaakte wijzigingen aan de bestaande leeromgeving mee. Hostinginstellingen zijn niet gewijzigd; er is geen backend geactiveerd en geen API-tegoed gebruikt.

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
| `scripts/assistant-inputs.mjs` en `scripts/build-practice-topics.mjs` | Controleren of nieuwe databestanden door de pagina worden geladen en of gegenereerde MC-vragen overeenkomen met de actuele bron-JSON. |
| `scripts/verify-study-assistant-build.mjs` | Controleert voor deployment catalogus, actualiteit van de vraagdata, vier Functions, routes en scheiding van privébestanden uit dist. |
| `assistant/source-manifest.json` en `scripts/prepare-assistant-sources.mjs` | Relatieve lijst met lokale bronkandidaten, herkenning van nieuwe bestanden in de bronmappen, offline controle en expliciete opt-in voor een volledige externe indexering. Bronbestanden blijven buiten Git. |
| `tests/study-assistant/` | Beveiliging, antwoordgedrag, alle echte vraagrecords en browserproef met mockdienst. |
| `.github/workflows/assistant-handoff.yml` | Controleert de branch zonder deployment of echte modelaanroepen. |

De vragenbank is geen handmatig onderhouden duplicaat: de build leest de actuele `data/`-scripts uit index.html. De huidige gegevens omvatten 247 oefenvragen, 282 echte tentamenvragen en 3 demovragen. De oefenbank bevat 12 benoemde vraagtypen, waaronder Theorie, Reken-/Berekenvraag, Journaalpost, Voorraadtabel, Methodekeuze, Vergelijking, Herkenning en Foutdiagnose.

## Nieuwe vragen en cursusmaterialen

Nieuwe MC-vragen in `content/practice/new-*.json` moeten met `node scripts/build-practice-topics.mjs` naar de bestaande vraagbank worden gegenereerd. De assistentbuild vergelijkt een hash van de actuele auteurdata met die gegenereerde vraagbank en stopt bij een vergeten generatie. Nieuwe tentamenvragen in reeds geladen bestanden komen bij de volgende build direct in de servercatalogus. Een nieuw `data/*.js`-bestand moet ook als script in `index.html` staan; de build weigert een bestand dat daar ontbreekt. De deploycontrole weigert een catalogus waarvan de vraagdata intussen zijn gewijzigd. Deze poorten houden de zichtbare vraag en de servercontext gelijk.

Nieuwe originele PDF-, PPTX-, PPT- en DOCX-bestanden in de aangewezen lokale cursusmappen worden met `node scripts/prepare-assistant-sources.mjs --check` gevonden. De controle stopt bij ongeclassificeerde, ontbrekende of nog niet geconverteerde bronnen. Classificeer een nieuw bestand als kandidaat in `assistant/source-manifest.json` of sluit het daar gemotiveerd uit. Een manifestvermelding geeft de assistent nog geen documentkennis: na rechten- en inhoudscontrole moet de volledige gewenste set opnieuw in een nieuwe CAFA2-vector store worden geïndexeerd en de preview-store-ID worden vervangen. De import vereist daarvoor uitdrukkelijk `--all-groups`. De lokale OneDrive-map kan geen GitHub- of Cloudflare-build starten; voer deze broncontrole uit wanneer daar materiaal wordt toegevoegd. Alle uploads blijven opt-in en buiten de repository.

Nieuwe zelfstandig geschreven theorie op de site is alleen beschikbaar voor de assistent voor zover die in de actuele vraagcontext staat of na gecontroleerde bronindexering teruggevonden wordt. Een aparte samenvattingspagina wordt niet stilzwijgend als gelezen bron gepresenteerd. De bestaande `build:study`- en `build:practice`-procedures blijven nodig wanneer hun auteurbestanden veranderen.

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

De inmiddels aan `main` toegevoegde oefenreeks per tentamenopgave gebruikt samengestelde poging- en vraag-ID's. De assistent zoekt het antwoordmodel voor zo'n vraag via het oorspronkelijke tentamen- en vraag-ID op, maar leest het eigen antwoord onder het samengestelde vraag-ID. Zo blijven ook twee vragen met dezelfde oorspronkelijke vraagnaam uit verschillende tentamens gescheiden. De actieve reeks, historische detailroute en antwoordknop in het resultatenoverzicht zijn getest.

Een routewissel controleert de actuele vraag ook wanneer een modelantwoord sneller terugkomt dan de vertraagde schermverversing. Op mobiel staat de zwevende assistentknop boven de vaste tentamenbalk. Bij een geopende rekenmachine is de assistent vanuit de rekenmachinekop bereikbaar. De server begrenst ook de modelrespons, verwerkt onvolledige en ongeldige antwoorden expliciet en geeft bij quota de werkelijke wachttijd terug. Nieuwe regressietests dekken deze fouten.

## Nog nodig voor een echte modelproef

1. De afzonderlijke testsite, build en D1 zijn ingericht. Laat de twee resterende secrets rechtstreeks in Cloudflare invoeren volgens [CAFA2_ASSISTENT_ACTIVEREN.md](CAFA2_ASSISTENT_ACTIVEREN.md), publiceer opnieuw en activeer alleen de testsite voor de echte proef.
2. Controleer toegang tot het voorlopige Responses-model `gpt-5.4-mini` en voer een kleine, traceerbare reeks echte vragen uit. Beoordeel hints, expliciete volledige uitwerkingen, onjuiste aannames over antwoordletters, bedragherleiding, ontbrekende antwoordmodellen en vervolgvragen. De automatische tests gebruiken uitsluitend testreacties. De uitvoerlimiet van 1.800 tokens en het tekstgebaseerde gesprek verdienen daarbij aparte aandacht.
3. Controleer welke originele CAFA2-bronbestanden extern mogen worden geïndexeerd, met name de repetitie- en collegeslides. Het manifest en de lokale conversies zijn klaar; de aangetroffen sets en de dry-run staan in het activatiedocument. Op dit moment is geen syllabus, slide of tentamen-PDF gekoppeld; bronlabels uit de vragenbank bewijzen geen bronpassage.
4. Controleer daarna de echte Cloudflare-status, sessiecookie, D1-quota en File Search-resultaten op de preview. Een fysieke iPhone met geopend toetsenbord is nog een afzonderlijke gebruiksproef.

De repository wordt hier niet geherstructureerd. SRA en BELRE3 krijgen later hun eigen adapter en broncatalogus. Pull-request #13 blijft concept; er volgt geen zelfstandige merge naar `main` of productieactivering.

## Acceptatiecriteria

Alle huidige hoofdapp-vragen kunnen hun eigen context aanleveren. Een expliciet antwoordverzoek krijgt geen didactische weigering. Stijlwissels verliezen geen context. Vraagwissels nemen geen gesprek van een andere vraag mee. Een vertraagd antwoord verschijnt nooit bij een nieuwe vraag. Antwoorden, scores, tijd en bestaande broninhoud blijven intact. Ontbrekende backend of bronkennis wordt eerlijk gemeld. Verbruik is begrensd en credentials blijven server-side. Tests en nog ontbrekende controles zijn afzonderlijk benoemd.

SRA en BELRE3 volgen in een latere opdracht via eigen adapters en eigen broncatalogi. De repo-herstructurering blijft eveneens buiten deze opdracht.
