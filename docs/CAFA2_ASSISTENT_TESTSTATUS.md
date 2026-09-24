# CAFA2 Assistent: teststatus na integratie

Bijgewerkt: 25 september 2026. Werkbranch: `codex/cafa2-assistant-handoff`. Concept-PR: [#13](https://github.com/HMA9K/CAFA2/pull/13).

## Online testomgeving, 25 september 2026

- Definitieve codecommit `b6bc210`: [CAFA2 assistant handoff checks](https://github.com/HMA9K/CAFA2/actions/runs/36071283868) en [Validate CAFA2](https://github.com/HMA9K/CAFA2/actions/runs/36071288614) geslaagd. Jobstappen en assistentlog gelezen: 74 Node-tests, build/deploycontrole, bestaande regressies, Function-bundeling en 115 browsercontroles in elk van Chromium en WebKit. De aanvullende documentatiecommit verandert geen uitvoerbare code en gebruikt `[skip ci]`.
- [De afzonderlijke testsite](https://cafa2-assistent-test.pages.dev) is gepubliceerd vanaf `c33f83a`: deployment `7dee8e44-2d47-4cbd-a119-8030bed341a4` geslaagd. Cloudflare-log gelezen: Node.js 22.22.0, juiste build en deploycontrole, 247 oefenvragen, 134 tentamenrecords, 128 publieke bestanden en succesvolle Function-bundeling.
- Integratie-dry-run opnieuw zonder wijzigingen. Daarna `main` tot en met `1a44e3a` opgenomen: elf volledige tentamens, 282 echte tentamenvragen, 3 demovragen en 247 oefenvragen. Het importconflict is opgelost met behoud van de actuele scripts en assistentmodule. De build/deploycontrole slaagt met 134 publieke bestanden en vier Functions.
- Na deze samenvoeging slagen 74 Node-tests en alle tien bestaande regressiescripts. De aparte JSDOM-controle van de opgavereeks slaagt ook, inclusief bestaande historische pogingen. Twee synthetische tests gebruikten een bron-ID buiten de nieuwe expliciete onderwerpindeling en zijn bijgewerkt; een nieuwe regressie doorloopt alle 282 echte vragen in de vier onderwerpseries en controleert bronmodel, revisie en eigen antwoord.
- De lokale browserproeven in Chromium en WebKit eindigen beide met exitcode 0: 115 controles per engine, geen JavaScript-runtimefouten. Alle elf tentamens worden daadwerkelijk geopend. De antwoorddienst in deze uitgebreide proeven blijft gesimuleerd.
- De afzonderlijke browsercontroles voor de onderwerpseries en tentamenscroll slagen op desktop en mobiel: bronselectie, eigen antwoorden, herladen, historische inzage, onafhankelijk scrollende kolommen en behoud van leespositie.
- Echte HTTP-controle: `/api/study-status` geeft 200/JSON, `course: "CAFA2"`, `knowledge.questions: true`, `ready: false`, beide documentvlaggen false. Homepage, `/samenvatting`, `/samenvatting.html` en assistentmodule geven 200 met de juiste contenttypen.
- Browserproef op de echte Cloudflare-site: oefenvraag 1 openen, paneel openen, sluiten, naar vraag 2 en paneel opnieuw openen. Titel en vraagcontext volgen de route. De uitgeschakelde status en ontbrekende documentkoppeling worden correct getoond. Er is geen chatantwoord verstuurd.
- D1-database `cafa2-assistent-test` met EU-jurisdictie aangemaakt en gebonden als `STUDY_DB`. Schema uitgevoerd; `study_limits` en `study_limits_expiry` via SQL bevestigd. Dit bewijst de database-inrichting, nog niet de quota via de chatroute.
- `STUDY_SESSION_SECRET` rechtstreeks veilig aangemaakt. Voorlopig model `gpt-5.4-mini`, limieten 30/dag en 20/IP/dag, activering false. `OPENAI_API_KEY` en `STUDY_ACCESS_CODE` ontbreken bewust tot de eigenaar ze rechtstreeks in Cloudflare invult.
- Bestaand project `cafa2`: deze werkbranch uitgesloten van previews. Productieconfiguratie blijft `main` / `exit 0` / `.`; dezelfde productiedeployment blijft actief. De echte homepage geeft 200 zonder assistentimport.
- Automatische Git-publicatie na synchronisatie bevestigd op `b5883d8` en `b6bc210`; laatste testdeployment `bc07d611-688e-4fe7-afd1-4deb99207a51` geslaagd. Op beide commits slaat het oude project de branch aantoonbaar over (`is_skipped=true`). De online catalogus en het dashboard bevatten alle elf tentamens; het paneel is ook bij vraag 1 van april 2021 gecontroleerd.
- Alle vier echte API-routes reageren met JSON: status 200; auth/chat/logout met dezelfde Origin geven bij de uitgeschakelde dienst correct 503 `not_configured`. Geen modelaanroep gedaan. De oude vaste telling van vijf tentamens op de startpagina is verwijderd en de gepubliceerde HTML is gecontroleerd.

Nog niet getest: echte login en sessiecookie, D1-quota via de Function, modelbeschikbaarheid en inhoudelijke kwaliteit, File Search en een fysiek mobiel toetsenbord. Originele documenten zijn niet geüpload.

## Eerdere uitgevoerde controles

| Controle | Resultaat | Wat dit bewijst |
| --- | --- | --- |
| Startpunt en bestaande CI | Branchcommit `be418e1` bevestigd; [assistentworkflow](https://github.com/HMA9K/CAFA2/actions/runs/36055009748) en [bestaande validatie](https://github.com/HMA9K/CAFA2/actions/runs/36055015979) geslaagd, jobs en logs gelezen. | De klaargezette branch, niet de oude featurebranch of ZIP, was het vertrekpunt. |
| CI na integratie | Op codecommit `d2ccac4` zijn [assistentworkflow](https://github.com/HMA9K/CAFA2/actions/runs/36059294019) en [Validate CAFA2](https://github.com/HMA9K/CAFA2/actions/runs/36059299889) geslaagd. De assistentjob en logs zijn gelezen: 58 Node-tests, build, `npm test`, Function-bundeling, 96 Chromium- en 96 WebKit-PASS-regels. [Screenshots en logs](https://github.com/HMA9K/CAFA2/actions/runs/36059294019/artifacts/10834096446) staan in het CI-artifact. | De daadwerkelijke geïntegreerde branch slaagt op Node.js 22 en Linux met beide browserengines. |
| CI na broninventaris | Op `4ec7c76` slaagden in [de assistentworkflow](https://github.com/HMA9K/CAFA2/actions/runs/36061977296) de 63 Node-tests, build/deploycontrole, bestaande `npm test` en bundeling van vier Functions. Chromium liep vast doordat de test na een routewijziging al op de nog uitgeschakelde verzendknop klikte. De test wacht nu op de nieuwe vraagcontext. | Deze eerdere CI-run is geen groen eindresultaat; de fout is onderzocht en in de volgende CI-run hersteld. |
| CI na samenvoeging met actueel `main` | Op codecommit `8a8bbf7` zijn [de assistentworkflow](https://github.com/HMA9K/CAFA2/actions/runs/36063096719) en [Validate CAFA2](https://github.com/HMA9K/CAFA2/actions/runs/36063100981) geslaagd. De jobstappen en logs zijn gelezen: 65 Node-tests, build/deploycontrole, tien bestaande regressiescripts, bundeling van alle vier Functions en 103 PASS-regels in zowel Chromium als WebKit. [Screenshots en logs](https://github.com/HMA9K/CAFA2/actions/runs/36063096719/artifacts/10835885439) staan in het artifact. | De timingfix en assistentadapter voor de nieuwe opgavereeks slagen ook op Node.js 22/Linux. De browserantwoorden blijven gesimuleerd. |
| Integratie-dry-run | Eerst zeven verwachte bestanden; na `--apply` geen openstaande wijzigingen. | Integratie blijft gericht en herhaalbaar. |
| Nieuwe Node-tests | 65 geslaagd, 0 mislukt, lokaal met Node.js 24; inclusief vijf bronpipelinecontroles en twee controles voor de samengestelde opgavereeks. | Servercontract, veiligheidsgrenzen, adapter, revisies, alle echte records en manifest-/importgrenzen. CI gebruikt Node.js 22. |
| Canonieke vraagbank | 247 oefenvragen, 131 echte tentamenvragen en 3 demonstratievragen gecontroleerd. | Alle records passen binnen de contextgrens en behouden hun antwoordmodel en revisie. |
| Bestaande regressiecontroles | Alle tien scripts uit het actuele `npm test` afzonderlijk met `node` geslaagd, inclusief de nieuwe opgavereeks. | Vragen, exam engine, timergrenzen, score- en inhoudsrevisie, lezen, onderwerpen en donkere modus zijn bij deze integratie niet stukgegaan. `npm` is lokaal niet beschikbaar. |
| Assistentbuild en deploycontrole | Geslaagd op de bijgewerkte `main`: 247 oefenvragen, 134 tentamenvragen inclusief 3 demo's, 128 publieke bestanden en 4 actieve Functions-routes. | Publieke `dist` en gesplitste servercatalogus worden gegenereerd; de controle weigert privébestanden in `dist` en ontbrekende routes. |
| Eerste bronneninventaris en conversie | Destijds 95 van 95 kandidaten lokaal aanwezig: 84 direct formaatklaar en 11 omgezette legacy-presentaties. De 11 PDF's tellen 113 pagina's, gelijk aan de bron-dia's; tekst per pagina en drie reken-/boekingsdia's visueel gecontroleerd. | De repetitiecursus en eerdere bronsets zijn lokaal gevonden; dit bewijst geen externe indexering of volledige visuele correctheid. De actuele telling staat in de volgende rij. |
| Controle bij later toegevoegd materiaal | De vraagcatalogus weigert een nieuw `data/*.js` buiten `index.html`, gewijzigde MC-auteurdata zonder hergeneratie en een verouderde servercatalogus. De actuele lokale broncontrole met `--json --check` meldt 116 van 116 kandidaten gereed: 105 direct, 11 geconverteerd, 1 gemotiveerd uitgesloten, 0 ongeclassificeerd en 0 scanproblemen. | Nieuwe vraag- en bronbestanden kunnen niet meer ongemerkt buiten hun respectieve build- of broninventarisatie vallen. Dit bewijst nog geen externe indexering of modelkwaliteit. |
| Lokale regressie na deze aanvulling | 73 Node-tests geslaagd, inclusief nieuwe materiaal- en broncontroles; tien bestaande regressiescripts afzonderlijk met `node` geslaagd; assistentbuild en deploycontrole geslaagd met 247 oefenvragen, 134 tentamenrecords en 128 publieke bestanden. Chromium- en WebKit-browserproeven van de echte interface zijn beide met exitcode 0 afgerond. | De nieuwe poorten verstoren de bestaande vraag-, examen-, antwoord- en schermroutes niet. De browser gebruikt nog steeds uitsluitend een gesimuleerde antwoorddienst. |
| Browserproef | Chromium: 103 controles geslaagd, 0 JavaScript-runtimefouten. WebKit 26.0: 103 controles geslaagd, 0 JavaScript-runtimefouten. De aparte opgave- en wetboekbrowsercontroles op desktop en mobiel slagen. | Werkelijke DOM, routes, editors en schermindeling met gesimuleerde antwoorddienst; geen inhoudelijke modelkwaliteit. |
| Cloudflare-branchpreview | Deployments van `d2ccac4`, `7f48f2e`, `4ec7c76` en `8a8bbf7` faalden. Productie antwoordt met HTML zonder assistentimport; `/api/study-status` geeft HTML in plaats van JSON. | De huidige build voert `exit 0` uit; Functions kunnen daarna `catalog.generated.mjs` niet bundelen. De assistent is niet live en de Pages-buildinstelling is niet aangepast. |
| Echte modelaanroepen en File Search | Niet uitgevoerd. | De testsite en een voorlopig model zijn nu ingesteld; twee secrets, geautoriseerde uploads en inhoudelijke validatie ontbreken nog. De online runtimecontrole hierboven is beperkt tot de uitgeschakelde dienst. |

## Regels waarvoor regressies zijn toegevoegd

- Lege meerkeuzeantwoorden zijn leeg en niet optie A. Antwoordletters volgen de zichtbare nulgebaseerde index; tentamens bewaren daarnaast hun stabiele optie-ID.
- Een historische inzage leent geen antwoord van de huidige poging. Een reset van een onderwerp begint een afzonderlijk gesprek.
- Journaalposten en voorraadtabellen sturen hun eigen kolommen, cellen en percentages door. Een expliciete verwijzing naar een vorige deelvraag bevat alleen de bijbehorende eerdere uitwerking binnen dezelfde casus.
- Het werkelijke inline antwoordvenster en de historische resultaatrij bieden een vraagknop voor de juiste vraag.
- Een vertraagd antwoord blijft bij de oorspronkelijke vraag, ook bij een snelle routewissel binnen hetzelfde tentamen. Een stijlwissel behoudt de geschiedenis van dezelfde vraag.
- De server weigert ongeldige of te grote modelresponsen, stopt een al afgebroken verzoek voor de modelaanroep en geeft bij een quotaoverschrijding de werkelijke `Retry-After` terug.
- De assistentknop ontwijkt op kleine schermen de vaste tentamenbalk; bij een geopende rekenmachine staat een compacte knop in de rekenmachinekop.
- Een samengestelde opgavereeks verwijst voor context en revisie naar de juiste oorspronkelijke tentamenvraag; het eigen antwoord blijft bij de huidige poging. Twee brontentamens met hetzelfde vraag-ID, de historische detailroute en de inline resultaatknop blijven gescheiden.
- Een nieuwe oefenvraag en tentamenvraag vergroten de canonieke catalogus. Een vergeten databestand, gewijzigde auteur-JSON, verouderde catalogus, nieuwe lokale bron, ontbrekende bron of vereiste presentatieconversie stoppen de bijbehorende build of broncontrole.

## Browserproef: reikwijdte

De proef opent de vier hoofddelen en alle twaalf benoemde oefenvraagtypen in hun echte route. Hij controleert meerkeuze, eigen tekst, journaalpost, voorraadcellen, onderwerpselectie en reset, historische MC-inzage, het inline antwoordvenster, de elf volledige tentamens en de navigatie binnen een ingeleverd tentamen. Voor elk van de elf echte tentamens wordt de eerste vraag in de browser geopend; de Node-tests controleren alle 282 echte tentamenvragen, ook in de vier onderwerpseries. Eén echt tentamen krijgt in de browser een langere doorloop met eigen antwoord, journaalpost, voorraadcel, vertraagde respons, indiening, historisch overzicht en individuele inzage. Chatten laat opgeslagen tentamenantwoorden, scores en de lopende timerwaarden intact.

Verder worden 320, 390 en 430 px breedte, liggend scherm, licht/donker, een verkorte viewport als toetsenbordsimulatie en de geopende rekenmachine met behouden historie gecontroleerd. De assistent opent boven het rekenmachinevenster, ook op desktop; na sluiten van de rekenmachine keert de zwevende knop terug. Bij de vier beproefde schermgroottes overlapt de knop geen vaste tentamenknop. Een verkorte viewport is geen fysieke mobiele toetsenbordtest. De gesimuleerde dienst retourneert vaste testtekst, geen door een taalmodel gegenereerde CAFA2-uitleg.

## Nog te valideren buiten deze branchcontrole

Het bestaande Cloudflare-project blijft `exit 0` en output `.` gebruiken voor `main`. De werkbranch bouwt nu op het afzonderlijke `cafa2-assistent-test` met de juiste opdracht en `STUDY_DB`. Voor de twee ontbrekende secrets en aangetroffen, nog niet gekoppelde bronbestanden: [CAFA2_ASSISTENT_ACTIVEREN.md](CAFA2_ASSISTENT_ACTIVEREN.md).

Voer na een geautoriseerde preview-inrichting een echte proef uit voor login, beveiligde cookie, D1-quota, een kleine set inhoudelijke modelvragen en indien toegestaan File Search. Beoordeel bij modelvragen vooral ongevraagde spoilers, directe uitwerkingen, een onjuiste veronderstelling zoals 'B is goed', herkomst van bedragen, vervolgstappen en een onvolledig antwoordmodel. De grens van 1.800 uitvoertokens omvat ook eventuele reasoning-tokens; controleer daarom of langere uitwerkingen worden afgebroken. Het huidige gesprek bewaart tekstberichten, niet alle interne reasoning-items. De invloed daarvan op vervolgvragen is nog niet gemeten.

Een fysieke iPhone met geopend toetsenbord en een geactiveerde modelproef op de testsite blijven aparte controles. Er is niets naar `main` gemerged of op de bestaande productiesite geactiveerd.

De nieuwe bronimporttest gebruikt een gesimuleerde API-respons. Er is geen echte OpenAI-vector store aangemaakt, geen origineel document geüpload en geen modelantwoord op deze documenten beoordeeld. De 2026-tentamenbestanden en het toegevoegde DOCX-tentamenpaar uit 2022 vragen nog controle van hun officiële status. Beeldinformatie in enkele PPTX-dia's en de overige 110 geconverteerde dia's zijn niet volledig visueel geverifieerd. Een bestand dat onder dezelfde naam inhoudelijk wordt vervangen, vereist handmatige herindexering; de huidige broncontrole vergelijkt geen vorige bestandsinhoud.

## Reproduceren

```bash
node --test tests/study-assistant/*.test.mjs
node scripts/prepare-study-assistant.mjs
node scripts/prepare-study-assistant.mjs --apply
node scripts/prepare-assistant-sources.mjs --check
node scripts/build-study-assistant.mjs
node scripts/verify-study-assistant-build.mjs
npm test
python tests/study-assistant/browser.py
ASSISTANT_BROWSER=webkit python tests/study-assistant/browser.py
```

De broncontrole vereist de lokale mapvariabelen uit `CAFA2_ASSISTENT_ACTIVEREN.md`. De browserproef vereist Playwright 1.57.0 en een geïnstalleerde browser. Op Windows kan de laatste regel met een PowerShell-omgevingsvariabele worden uitgevoerd. Alle antwoorden van de automatische browserproef zijn gesimuleerd.
