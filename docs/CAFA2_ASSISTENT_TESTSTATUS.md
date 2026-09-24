# CAFA2 Assistent: teststatus bij overdracht

Datum: 24 september 2026. Versie 2026-09-24.2. Dit document vervangt eerdere, onderling afwijkende aantallen uit de chat voor deze overdrachtsversie.

## Lokaal daadwerkelijk uitgevoerd

| Controle | Resultaat | Afbakening |
| --- | --- | --- |
| Node core-/servertests | 36 geslaagd | Synthetische testdata; authenticatie, cookies, quota, servercontext, directe antwoordverzoeken en foutafhandeling. Geen echte modeldienst. |
| Node echte vraagbanktests | 4 geslaagd | Alle 247 oefenvragen en alle 134 tentamen-/demovragen genormaliseerd; adapterrevisie en canonieke servercontext gecontroleerd. |
| Totaal nieuwe Node-tests | 40 geslaagd, 0 mislukt | Node.js 22.16.0. |
| Integratieprocedure en build | Geslaagd | Imports, scripts, endpointkopieën, gesplitste catalogus en dist lokaal gegenereerd. |
| Bestaande npm test | Geslaagd na lokale integratie | Uitgevoerd op de beschikbare bronkopie van de eerdere commit; zie versieafbakening hieronder. |
| Browserproef echte pagina | Niet uitgevoerd | De test is gestart, maar browsernavigatie naar localhost werd door het runtimebeleid geblokkeerd: ERR_BLOCKED_BY_ADMINISTRATOR. Er wordt geen geslaagde browsertest geclaimd. |
| Echte modelantwoorden en bronzoekresultaten | Niet getest | Geen API-sleutel, betaalde modelcalls of documentuploads gebruikt. |
| Cloudflare-preview, D1-runtime, fysieke iPhone | Niet getest | Moet na integratie afzonderlijk worden gecontroleerd. |

## Versieafbakening

De lokale bronkopie kwam uit de eerder opgehaalde repository-artifact op `c6dadcfb42481b3688d554cf415343c35c10e1f7`, met applicatiebasis `ad3f494fb24ffa184e7fc390c367ea25205847d6`. De voorbereidingsbranch is opgebouwd op de nieuwere `main`-commit `dd813848fcb272e23dd54775642066843e91bfd9`, zonder bestaande bestanden terug te zetten. De nieuwere rekenmachine-/bronpaneelwijzigingen zijn dus behouden, maar hun samenspel met het chatpaneel is niet lokaal in de browser gevalideerd.

Daarom bevat de branch een GitHub Actions-workflow die op de daadwerkelijk uitgecheckte branch opnieuw de nieuwe tests, integratie, build, bestaande regressietests, bundeling en browserproef uitvoert. Kijk voor de actuele uitslag naar die run; de aanwezigheid van een workflow is niet hetzelfde als een geslaagde run. Codex moet dit document bijwerken met de feitelijke resultaten.

## Gevonden en verholpen tijdens voorbereiding

De oude didactische blokkade is verwijderd uit modelinstructies, servercontext en interface. Een expliciet antwoordverzoek heeft nu toegang tot het huidige antwoordmodel, ook zonder nagekeken of ingeleverde toets. De gesprekssleutel bevat geen hulpstand meer.

De eerste catalogus was groter dan de bestaande grens van 900.000 bytes per bestand. De build schrijft nu delen van maximaal ongeveer 750.000 bytes. De bestaande groottetest blijft intact. Verder is de CSS-import vóór het bestaande study-upgrade-stijlblok geplaatst, zodat het opnieuw draaien van die bestaande build geen andere index.html-volgorde veroorzaakt. Na die correctie slaagde de lokale bestaande regressiesuite.

De nieuwe echte-vraagbanktest valideert 381 vragen, waaronder 12 oefenvraagtypen en de open/meerkeuzevormen uit de tentamenengine. Dit bewijst dat de records en revisies gekoppeld zijn, niet dat elk scherm of ieder gegenereerd vakantwoord al correct werkt.

## Nog te bewijzen

Correcte mobiele bediening en toetsenbordweergave; actuele input uit alle editors; afzonderlijke controlemodals en historische inzages; trage antwoorden bij routewissels; betekenis van optie-indexen; afhankelijkheden tussen deelvragen; modelkwaliteit; correcte passageverwijzingen; runtime-authenticatie, quota en kostengrenzen op Cloudflare.

## Reproduceren

```bash
node --test tests/study-assistant/*.test.mjs
node scripts/prepare-study-assistant.mjs --apply
node scripts/build-study-assistant.mjs
npm test
python tests/study-assistant/browser.py
```

De browserproef vereist Playwright plus Chromium en toegang tot de lokale testserver. Alle automatische antwoordreacties in deze tests zijn expliciet gesimuleerd. Het handler-contract kan zonder modeltegoed worden getest.
