# CAFA2 Assistent: teststatus na integratie

Datum: 24 september 2026. Werkbranch: `codex/cafa2-assistant-handoff`. Concept-PR: [#13](https://github.com/HMA9K/CAFA2/pull/13).

## Uitgevoerde controles

| Controle | Resultaat | Wat dit bewijst |
| --- | --- | --- |
| Startpunt en bestaande CI | Branchcommit `be418e1` bevestigd; [assistentworkflow](https://github.com/HMA9K/CAFA2/actions/runs/36055009748) en [bestaande validatie](https://github.com/HMA9K/CAFA2/actions/runs/36055015979) geslaagd, jobs en logs gelezen. | De klaargezette branch, niet de oude featurebranch of ZIP, was het vertrekpunt. |
| CI na integratie | Op codecommit `d2ccac4` zijn [assistentworkflow](https://github.com/HMA9K/CAFA2/actions/runs/36059294019) en [Validate CAFA2](https://github.com/HMA9K/CAFA2/actions/runs/36059299889) geslaagd. De assistentjob en logs zijn gelezen: 58 Node-tests, build, `npm test`, Function-bundeling, 96 Chromium- en 96 WebKit-PASS-regels. [Screenshots en logs](https://github.com/HMA9K/CAFA2/actions/runs/36059294019/artifacts/10834096446) staan in het CI-artifact. | De daadwerkelijke geïntegreerde branch slaagt op Node.js 22 en Linux met beide browserengines. |
| Integratie-dry-run | Eerst zeven verwachte bestanden; na `--apply` geen openstaande wijzigingen. | Integratie blijft gericht en herhaalbaar. |
| Nieuwe Node-tests | 63 geslaagd, 0 mislukt, lokaal met Node.js 24; inclusief vijf bronpipelinecontroles. | Servercontract, veiligheidsgrenzen, adapter, revisies, alle echte records en manifest-/importgrenzen. CI gebruikt Node.js 22. |
| Canonieke vraagbank | 247 oefenvragen, 131 echte tentamenvragen en 3 demonstratievragen gecontroleerd. | Alle records passen binnen de contextgrens en behouden hun antwoordmodel en revisie. |
| Bestaande regressiecontroles | Alle negen scripts uit `npm test` afzonderlijk met `node` geslaagd. | Vragen, exam engine, timergrenzen, score- en inhoudsrevisie, lezen, onderwerpen en donkere modus zijn bij deze integratie niet stukgegaan. `npm` is lokaal niet beschikbaar. |
| Assistentbuild en deploycontrole | Geslaagd: 247 oefenvragen, 134 tentamenvragen inclusief 3 demo's, 125 publieke bestanden en 4 actieve Functions-routes. | Publieke `dist` en gesplitste servercatalogus worden gegenereerd; de controle weigert privébestanden in `dist` en ontbrekende routes. |
| Bronneninventaris en conversie | 95 van 95 kandidaten lokaal aanwezig: 84 direct formaatklaar en 11 omgezette legacy-presentaties. De 11 PDF's tellen 113 pagina's, gelijk aan de bron-dia's; tekst per pagina en drie reken-/boekingsdia's visueel gecontroleerd. | De repetitiecursus en eerdere bronsets zijn lokaal gevonden; dit bewijst geen externe indexering of volledige visuele correctheid. |
| Browserproef | Chromium: 96 controles geslaagd, 0 JavaScript-runtimefouten. WebKit 26.0: 96 controles geslaagd, 0 JavaScript-runtimefouten. Beide lokaal op de laatste build. | Werkelijke DOM, routes, editors en schermindeling met gesimuleerde antwoorddienst; geen inhoudelijke modelkwaliteit. |
| Cloudflare-branchpreview | Deployments van `d2ccac4` en `7f48f2e` faalden. Productie antwoordt met HTML zonder assistentimport; `/api/study-status` geeft HTML in plaats van JSON. | De huidige build voert `exit 0` uit; Functions kunnen daarna `catalog.generated.mjs` niet bundelen. De assistent is niet live en de Pages-buildinstelling is niet aangepast. |
| Echte modelaanroepen, File Search en Cloudflare-runtime | Niet uitgevoerd. | Een model, secrets, geautoriseerde uploads en bruikbare preview-inrichting ontbreken. |

## Regels waarvoor regressies zijn toegevoegd

- Lege meerkeuzeantwoorden zijn leeg en niet optie A. Antwoordletters volgen de zichtbare nulgebaseerde index; tentamens bewaren daarnaast hun stabiele optie-ID.
- Een historische inzage leent geen antwoord van de huidige poging. Een reset van een onderwerp begint een afzonderlijk gesprek.
- Journaalposten en voorraadtabellen sturen hun eigen kolommen, cellen en percentages door. Een expliciete verwijzing naar een vorige deelvraag bevat alleen de bijbehorende eerdere uitwerking binnen dezelfde casus.
- Het werkelijke inline antwoordvenster en de historische resultaatrij bieden een vraagknop voor de juiste vraag.
- Een vertraagd antwoord blijft bij de oorspronkelijke vraag, ook bij een snelle routewissel binnen hetzelfde tentamen. Een stijlwissel behoudt de geschiedenis van dezelfde vraag.
- De server weigert ongeldige of te grote modelresponsen, stopt een al afgebroken verzoek voor de modelaanroep en geeft bij een quotaoverschrijding de werkelijke `Retry-After` terug.
- De assistentknop ontwijkt op kleine schermen de vaste tentamenbalk; bij een geopende rekenmachine staat een compacte knop in de rekenmachinekop.

## Browserproef: reikwijdte

De proef opent de vier hoofddelen en alle twaalf benoemde oefenvraagtypen in hun echte route. Hij controleert meerkeuze, eigen tekst, journaalpost, voorraadcellen, onderwerpselectie en reset, historische MC-inzage, het inline antwoordvenster, de vijf volledige tentamens en de navigatie binnen een ingeleverd tentamen. Voor elk van de vijf echte tentamens wordt de eerste vraag in de browser geopend; de Node-tests controleren alle 131 echte tentamenvragen. Eén echt tentamen krijgt in de browser een langere doorloop met eigen antwoord, journaalpost, voorraadcel, vertraagde respons, indiening, historisch overzicht en individuele inzage. Chatten laat opgeslagen tentamenantwoorden, scores en de lopende timerwaarden intact.

Verder worden 320, 390 en 430 px breedte, liggend scherm, licht/donker, een verkorte viewport als toetsenbordsimulatie en de geopende rekenmachine met behouden historie gecontroleerd. De assistent opent boven het rekenmachinevenster, ook op desktop; na sluiten van de rekenmachine keert de zwevende knop terug. Bij de vier beproefde schermgroottes overlapt de knop geen vaste tentamenknop. Een verkorte viewport is geen fysieke mobiele toetsenbordtest. De gesimuleerde dienst retourneert vaste testtekst, geen door een taalmodel gegenereerde CAFA2-uitleg.

## Nog te valideren buiten deze branchcontrole

De huidige Cloudflare Pages-configuratie gebruikt `exit 0`, output `.` en heeft geen `STUDY_DB`-binding of assistentvariabelen voor preview en productie. De eerste branchpreview faalde concreet bij het bundelen van de vier Functions omdat de servercatalogus nog niet was gegenereerd. Voor de ontbrekende instellingen en aangetroffen, nog niet gekoppelde bronbestanden: [CAFA2_ASSISTENT_ACTIVEREN.md](CAFA2_ASSISTENT_ACTIVEREN.md).

Voer na een geautoriseerde preview-inrichting een echte proef uit voor login, beveiligde cookie, D1-quota, een kleine set inhoudelijke modelvragen en indien toegestaan File Search. Beoordeel bij modelvragen vooral ongevraagde spoilers, directe uitwerkingen, een onjuiste veronderstelling zoals 'B is goed', herkomst van bedragen, vervolgstappen en een onvolledig antwoordmodel. De grens van 1.800 uitvoertokens omvat ook eventuele reasoning-tokens; controleer daarom of langere uitwerkingen worden afgebroken. Het huidige gesprek bewaart tekstberichten, niet alle interne reasoning-items. De invloed daarvan op vervolgvragen is nog niet gemeten.

Een fysieke iPhone met geopend toetsenbord en de echte Cloudflare-preview blijven aparte controles. Er is niets naar `main` gemerged of in productie geactiveerd.

De nieuwe bronimporttest gebruikt een gesimuleerde API-respons. Er is geen echte OpenAI-vector store aangemaakt, geen origineel document geüpload en geen modelantwoord op deze documenten beoordeeld. De 2026-tentamenbestanden in het manifest vragen nog controle van hun officiële status. Beeldinformatie in enkele PPTX-dia's en de overige 110 geconverteerde dia's zijn niet volledig visueel geverifieerd.

## Reproduceren

```bash
node --test tests/study-assistant/*.test.mjs
node scripts/prepare-study-assistant.mjs
node scripts/prepare-study-assistant.mjs --apply
node scripts/build-study-assistant.mjs
node scripts/verify-study-assistant-build.mjs
npm test
python tests/study-assistant/browser.py
ASSISTANT_BROWSER=webkit python tests/study-assistant/browser.py
```

De browserproef vereist Playwright 1.57.0 en een geïnstalleerde browser. Op Windows kan de laatste regel met een PowerShell-omgevingsvariabele worden uitgevoerd. Alle antwoorden van de automatische browserproef zijn gesimuleerd.
