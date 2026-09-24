# CAFA2 Assistent: gecontroleerde teststatus bij overdracht

Datum: 24 september 2026. Versie 2026-09-24.2. Dit document vervangt de eerdere, onderling afwijkende aantallen uit de chat voor deze overdrachtsversie.

## GitHub-controle op de daadwerkelijke voorbereidingsbranch

Geteste implementatiecommit: `02ec4f2177a23d9fdedafd9e7eb5ee3ce37d175d`, gebaseerd op main `dd813848fcb272e23dd54775642066843e91bfd9`.

Run: https://github.com/HMA9K/CAFA2/actions/runs/36054839621

De joblogs zijn gelezen. Niet alleen het groene statusicoon is gecontroleerd: de uitvoer vermeldt 40 geslaagde Node-tests zonder fouten, geslaagde bestaande regressiecontroles en 15 expliciete PASS-regels voor de browserproef. De uitvoer en screenshots zijn in het run-artifact `cafa2-assistant-handoff-checks` opgeslagen, met beperkte bewaartermijn.

| Controle | Daadwerkelijk resultaat | Afbakening |
| --- | --- | --- |
| Kern-/servertests | 36 geslaagd | Synthetische testdata; authenticatie, cookies, quota, servercontext, directe antwoordverzoeken en foutafhandeling. Geen echte modeldienst. |
| Echte vraagbanktests | 4 geslaagd | Alle 247 oefenvragen en 134 tentamen-/demovragen genormaliseerd; adapterrevisie en canonieke servercontext gecontroleerd. |
| Nieuwe Node-tests totaal | 40 geslaagd, 0 mislukt | Uitgevoerd op de actuele voorbereidingsbranch, Node.js 22.23.2. |
| Integratieprocedure en build | Geslaagd | Imports, scripts, endpointkopieën, gesplitste catalogus en dist in de runner gegenereerd. Niet naar de repository teruggeschreven. |
| Bestaande npm test | Geslaagd na integratie in de runner | De daadwerkelijke branch bevat de nieuwere rekenmachine-/bronpaneelwijzigingen uit main. |
| Bundeling serverendpoint | Geslaagd | esbuild 0.25.10; geen echte Cloudflare-deployment of runtimeproef. |
| Browserproef echte CAFA2-pagina | 15 controles geslaagd | Chromium via Playwright 1.57.0. De antwoorddienst is gesimuleerd. |
| Echte modelkwaliteit en bronzoekresultaten | Niet getest | Geen API-sleutel, betaalde modelcalls of documentuploads gebruikt. |
| Cloudflare-preview, D1-runtime, fysieke iPhone/Safari | Niet getest | Moet na integratie afzonderlijk worden gecontroleerd. |

De daaropvolgende documentatie-/workflowcorrectie wijzigt geen applicatiecode. De workflow gebruikt nu expliciet `shell: bash`, zodat fouten vóór `tee` door de standaard pipefail-instelling niet als succes worden gemaskeerd. Controleer de meest recente run opnieuw voordat deze PR verder wordt gebouwd of samengevoegd.

## Wat de browserproef daadwerkelijk controleert

1. Geen chatverzoek vóór toegang en toestemming.
2. De actuele echte oefenvraag wordt meegestuurd in de hintstijl.
3. Markdown-tabellen worden weergegeven zonder uitvoerbare model-HTML.
4. Een antwoordgerichte vraag wordt in hintstijl doorgestuurd zonder verplichte omschakeling.
5. Eén klik op de antwoordknop stuurt het verzoek, zonder eerst nakijken of toetsinlevering.
6. De gespreksgeschiedenis blijft bij dezelfde vraag behouden bij stijlwisselingen.
7. Opgeslagen antwoorden en scores blijven ongewijzigd tijdens die chatinteracties.
8. Navigatie naar een andere oefenvraag scheidt de gesprekken.
9. De nieuwe vraag heeft haar eigen context.
10. Een gesimuleerde serverfout bewaart de vraag voor opnieuw verzenden.
11. Het paneel past binnen 390 × 844 px.
12. Het paneel past binnen 320 × 740 px.
13. Het paneel past binnen 740 × 390 px.
14. Het bestaande CAFA2-attribuut voor donkere modus kleurt het chatpaneel correct.
15. Geen JavaScript-runtimefouten tijdens deze proef.

Dit is geen volledige doorloop van ieder vraagtype en elke editor in de browser. De gegevenscontrole dekt alle 381 records; de browserproef richt zich op de basisinteractie met echte oefenvragen. Modelantwoorden zijn testreacties, geen inhoudelijk beoordeelde CAFA2-uitleg.

## Lokale voorbereiding en gevonden fouten

Lokaal slaagden dezelfde 40 nieuwe Node-tests, de build en de bestaande regressiesuite op de beschikbare eerdere bronkopie. Browsernavigatie was lokaal geblokkeerd door runtimebeleid (ERR_BLOCKED_BY_ADMINISTRATOR). Dit is vervolgens niet als geslaagde lokale test voorgesteld; de echte browserproef is in GitHub Actions uitgevoerd en daar wel geslaagd.

De oude didactische blokkade is verwijderd uit modelinstructies, servercontext en interface. Een expliciet antwoordverzoek heeft nu toegang tot het huidige antwoordmodel, ook zonder nagekeken of ingeleverde toets. De gesprekssleutel bevat geen hulpstand meer.

De eerste catalogus was groter dan de bestaande grens van 900.000 bytes per bestand. De build schrijft nu delen van maximaal ongeveer 750.000 bytes. De bestaande groottetest blijft intact. De CSS-import wordt vóór het bestaande study-upgrade-stijlblok geplaatst om de herhaalbaarheid van die build te behouden.

## Wat Codex nog moet bewijzen

Actuele input uit alle editors, afzonderlijke antwoordmodals en historische inzages, routewissels binnen hetzelfde tentamen, vertraagde antwoorden, de betekenis van optie-indexen, afhankelijkheden tussen deelvragen, overlap met de rekenmachine, geopend mobiel toetsenbord, WebKit/fysieke iPhone, echte modelkwaliteit, correcte bronpassages en runtime-authenticatie/quotum op Cloudflare.

## Reproduceren

```bash
node --test tests/study-assistant/*.test.mjs
node scripts/prepare-study-assistant.mjs --apply
node scripts/build-study-assistant.mjs
npm test
python tests/study-assistant/browser.py
```

De browserproef vereist Playwright plus Chromium en toegang tot de lokale testserver. Alle modelreacties in deze automatische tests zijn gesimuleerd. Het handler-contract kan zonder modeltegoed worden getest.
