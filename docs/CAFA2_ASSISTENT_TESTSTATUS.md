# CAFA2 Assistent: teststatus na integratie

Bijgewerkt: 25 september 2026. Werkbranch: `codex/cafa2-assistant-handoff`. Concept-PR: [#13](https://github.com/HMA9K/CAFA2/pull/13).

## Actuele status na opwaarderen, 25 september 2026

De testsite geeft echte antwoorden met `gpt-5.4-mini`. Na de opwaardering zijn 17 succesvolle modelverzoeken uitgevoerd: drie via de echte browserinterface en veertien via de beveiligde Cloudflare-chatroute, met de canonieke vraagcontext. Alle veertien vastgelegde HTTP-antwoorden hadden status 200, de verwachte `questionKey` en `incomplete: false`. De onderstaande inhoudelijke beoordeling is een beperkte steekproef tegen de bestaande vraagbank en antwoordmodellen, geen onafhankelijke audit van alle broninhoud.

| Echte proef | Beoordeeld resultaat |
| --- | --- |
| Kapitaalbelangen 7: alleen een hint | Geeft de berekeningsaanpak zonder 60% of antwoord A te verklappen. |
| Dezelfde vraag: daarna de volledige berekening | Behoudt de gesprekssamenhang en geeft direct 480 ÷ (1.000 − 200) × 100% = 60%, antwoord A. Geen verplichte poging of standwissel. |
| Kapitaalbelangen 1: 'Waarom is B goed?' | Corrigeert de verkeerde aanname naar A en verklaart de verschillen met B vanuit het meegeleverde antwoordmodel. |
| Kapitaalbelangen 13: volledige journaalpost | Deelneming 581.000 en goodwill 99.000 debet; bank 680.000 credit. |
| Vervolgvraag over die 99.000 | Herleidt goodwill als 680.000 − 70% × 830.000 = 99.000 met de voorgaande gesprekstekst. |
| Nettovermogenswaarde 6: volledige voorraadtabel | Geeft beginstand, eindstand en mutatie, met de juiste 80%-, 0%- en 20%-kolommen volgens het antwoordmodel. |
| Kapitaalbelangen 7: eigen foutieve antwoord 48% | Legt uit waarom ingekochte eigen aandelen uit de noemer gaan en herleidt het juiste 60%. |
| Volledig tentamen april 2021, vraag 1 | Geeft goodwill 87.500 en verklaart de correctie van 7.000 en het effect van 2.450 op het 35%-belang. |
| Vraag om een originele repetitiedia te citeren | Zegt dat de originele slides niet zijn gelezen, onderscheidt een bronverwijzing van een gelezen passage en verzint geen documentcitaat. |

De eerste ronde vond zichtbare LaTeX-code, boekhoudkundige tabelkoppen bij een gewone berekening, interne veldnamen en een dubbele voorraadtabel. Commit `b73731d` verduidelijkt gewone formuletekst, passende tabelkoppen, leerlingtaal en het vermijden van herhaling. Zes echte HTTP-proeven zijn herhaald: geen LaTeX of interne veldnamen, en de bedragen en tabelkolommen waren correct. De browser toonde daarna de berekening met `Stap | Berekening | Uitkomst` en leesbare rekentekens.

Bij de herhaalde tentamenuitleg bleef een verwarrende tussenzin staan over een correctiesom, ondanks de juiste einduitkomst. Commit `aaea2a6` vraagt expliciete controle van tekens en tussentotalen vóór de uitleg. Dezelfde tentamenvraag is daarna opnieuw echt beantwoord met een consistente berekening: 265.300 + 8.750 − 6.300 − 5.250 = 262.500; goodwill 350.000 − 262.500 = 87.500. De afsluitende bronkennisvraag is op dezelfde versie getest. Deze herhaalde modelproeven zijn handmatige regressieproeven, geen vaste CI-tests of garantie voor alle toekomstige antwoorden.

- Actuele uitvoerbare code: `aaea2a69720308ea43d13b7782efb004ce50d2ee`. Cloudflare-deployment `7db4b13e-3895-4aea-b0c6-4253e7197383` is geslaagd; de gepubliceerde commit is via de API gecontroleerd.
- GitHub Actions op die commit: [assistentcontrole](https://github.com/HMA9K/CAFA2/actions/runs/36108603933) en [bestaande validatie](https://github.com/HMA9K/CAFA2/actions/runs/36108608355) geslaagd. De assistentjoblog bevestigt 81 geslaagde Node-tests en 230 browsercontroles, 115 per engine, zonder JavaScript-runtimefouten. Build, deploycontrole, bestaande regressies en Function-bundeling slagen. De automatische modelantwoorden blijven gesimuleerd.
- Lokaal na de eerste instructieaanpassing: 81 Node-tests, build/deploycontrole en `git diff --check` geslaagd. Na de laatste gerichte aanpassing: 49 kerntests en de integratie-dry-run geslaagd. De volledige suite is vervolgens op de uiteindelijke commit in CI uitgevoerd.
- De veertien echte HTTP-antwoorden zijn lokaal bewaard in `%USERPROFILE%\Documents\Claude\Projects\CAFA2-assistant-sources\qa-20260925-funded`: `results-before-prompt-change.json`, `results.json` en `results-final.json`. Deze bestanden bevatten geen toegangscode, cookies of API-sleutel. Browserproeven zijn hierboven afzonderlijk beschreven.
- D1 bevat na deze proef 19 dagtellerplaatsen: 17 succesvolle modelverzoeken en twee eerdere tegoedfouten. De ingestelde limieten blijven 30 per UTC-dag en 20 per IP; geen teller is gereset en geen bestedingslimiet verhoogd. De exacte API-kosten zijn niet gemeten.
- Originele documenten en File Search zijn nog niet gekoppeld. Geen API-sleutel uitgelezen of opgeslagen; geen merge naar `main` en geen activering op de oorspronkelijke productiesite.

## Eerdere activering en API-proef zonder tegoed, 25 september 2026

- Beide secrets zijn in Cloudflare Production van `cafa2-assistent-test` bevestigd, uitsluitend op aanwezigheid en type gecontroleerd. Geen API-sleutel uitgelezen of in Git opgeslagen. Activering staat nu op true.
- Activeringsdeployment `1c88fb4f-678d-44a2-8605-25d97bb39c2d` vanaf `2524ae7` geslaagd; `/api/study-status` geeft 200/JSON met `ready: true` en zonder documentkoppeling.
- Echte browserlogin geslaagd. Afzonderlijke HTTP-controle: auth 200; cookie met `__Host-`, `HttpOnly`, `Secure`, `SameSite=Strict`; ingelogde status true; logout 200 en `Max-Age=0`; daarna ingelogde status false. De browsersessie bleef na herladen geldig.
- Een eerste echte hintvraag bij Kapitaalbelangen vraag 7 kreeg een algemene 429-melding. D1 bevatte daarna afzonderlijke login-, minuut-, IP- en dagtellers. Dit bewijst de tellers via de Function, nog geen live overschrijdingsproef.
- De foutafhandeling is verbeterd in `994a113`: bekende tegoed-, bestedings- en gebruikslimietfouten onderscheiden zich van tijdelijke verzoeklimieten. Geen ruwe providermelding wordt weergegeven. Bij tegoedfouten wordt geen misleidende `Retry-After` meegestuurd. Zeven nieuwe regressietests, 81 Node-tests totaal, slagen.
- Automatische testdeployment `04952337-5210-4741-a222-fd1064def0e9` van `994a113` geslaagd. Tweede echte browservraag geeft `Het OpenAI API-tegoed is op`, de vaste vertaling van `credit_balance_exhausted`. De vraag blijft in het invoerveld; opgeslagen oefenantwoorden blijven intact. Geen modelantwoord ontvangen.
- Lokaal: 81 Node-tests, alle tien bestaande regressiescripts, JSDOM-opgaveroutes inclusief historische pogingen, integratie-dry-run, build en deploycontrole geslaagd. Chromium: 115 controles geslaagd, geen JavaScript-runtimefouten; de brede browserproef gebruikt nog steeds een gesimuleerde antwoorddienst.
- GitHub Actions op `994a113`: [assistentcontrole](https://github.com/HMA9K/CAFA2/actions/runs/36100708946) en [bestaande validatie](https://github.com/HMA9K/CAFA2/actions/runs/36100711313) geslaagd. Joblog gelezen: 81 Node-tests, 0 fouten; 115 Chromium- en 115 WebKit-browsercontroles, beide zonder runtimefouten. Deze modelantwoorden zijn gesimuleerd.
- Het oude project slaat de nieuwe branchpush opnieuw over (`is_skipped=true`); oorspronkelijke productiedeployment `8022ca96-d53c-4a28-a5df-90b0c660b8d1` blijft actief. PR #13 blijft concept, niet gemerged.

Op dat moment ontbrak nog API-tegoed. De eigenaar heeft dit daarna opgewaardeerd; de geslaagde vervolgproef staat bovenaan. Bronindexering, File Search en een fysiek mobiel toetsenbord blijven afzonderlijke controles. Codex heeft geen betaling uitgevoerd, geen bestedingslimiet aangepast en geen bronbestand geüpload.

## Eerdere online inrichting met uitgeschakelde dienst, 25 september 2026

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

Bij bovenstaande eerdere inrichting nog niet getest: echte login en sessiecookie, D1-quota via de Function, modelbeschikbaarheid en inhoudelijke kwaliteit, File Search en een fysiek mobiel toetsenbord. De vervolgstappen staan in de actuele activeringssectie bovenaan. Originele documenten zijn niet geüpload.

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

Het bestaande Cloudflare-project blijft `exit 0` en output `.` gebruiken voor `main`. De werkbranch bouwt nu op het afzonderlijke `cafa2-assistent-test` met de juiste opdracht, `STUDY_DB` en beide secrets. Modelaanroepen werken. Voor de nog niet gekoppelde bronbestanden en `OPENAI_COURSE_VECTOR_STORE_ID`: [CAFA2_ASSISTENT_ACTIVEREN.md](CAFA2_ASSISTENT_ACTIVEREN.md).

Echte login, cookie, D1-tellers en een kleine set inhoudelijke modelvragen zijn beproefd. Een live overschrijding van de quota, ontbrekende antwoordmodellen en File Search zijn niet getest. De grens van 1.800 uitvoertokens omvat ook eventuele reasoning-tokens; de geteste antwoorden waren compleet, maar zeer lange uitwerkingen zijn niet gevalideerd. Het gesprek bewaart tekstberichten, niet alle interne reasoning-items. De twee geteste korte vervolggesprekken bleven inhoudelijk samenhangend; langdurige gesprekken zijn niet beoordeeld.

Een fysieke iPhone met geopend toetsenbord blijft een aparte controle. De echte modelproef dekt niet iedere oefen- of tentamenvraag. Er is niets naar `main` gemerged of op de bestaande productiesite geactiveerd.

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
