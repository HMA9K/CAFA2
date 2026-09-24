# CAFA2 Assistent: overdracht aan Codex

Versie 2026-09-24.2. Repository: HMA9K/CAFA2. Werkbranch: `codex/cafa2-assistant-handoff`.

## Opdracht en afbakening

Werk de voorbereide assistent verder uit en integreer hem in de bestaande CAFA2-leeromgeving, voor alle oefenvraagtypen en alle volledige tentamens. Bouw voort op deze bestanden. Herstructureer de repository niet: dat is een afzonderlijk, later project. Pas SRA en BELRE3 nu niet aan; houd de interface, server en adapterafspraak wel herbruikbaar.

Deze overdracht is gebaseerd op `main`-commit `dd813848fcb272e23dd54775642066843e91bfd9`. De bestaande rekenmachine-, bronpaneel- en andere wijzigingen uit die commit blijven behouden. De oude branch `feature/study-assistant` en oudere ZIP-pakketten zijn niet het vertrekpunt.

Alleen nieuwe bestanden zijn klaargezet. De bestaande `index.html`, `package.json`, `.gitignore`, vragen, scores, rekenmachine en hostinginstellingen zijn in de overdrachtscommit niet aangepast. De frontend wordt dus nog niet door de website geladen. Endpointtemplates staan bewust onder `assistant/pages-functions/`; pas de voorbereidingsprocedure zet ze onder `functions/api/`. Er is geen backend geactiveerd en geen API-tegoed gebruikt.

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

De browserproef vereist Python Playwright en een geïnstalleerde Chromium-browser:

```bash
python -m pip install playwright==1.57.0
python -m playwright install chromium
python tests/study-assistant/browser.py
```

Een reeds beschikbare Chromium kan via CHROMIUM_PATH worden gekozen. Het testscript start een lokale HTTP-server en simuleert alleen de antwoorddienst. Het gebruikt de echte CAFA2-pagina, niet een nagemaakte voorpagina.

## Werk dat Codex nog moet afronden

1. Integreer en beoordeel de voorbereidende code; lever echte wijzigingen op, niet alleen een plan. Voer de bovengenoemde tests op deze branch uit. Controleer ook de GitHub Actions-resultaten.
2. Test en verbeter alle gebruikersroutes: vier hoofddelen, onderwerpselectie, tentamenvragen, individuele inzage, historisch meerkeuzeresultaat en antwoordmodal. Loop risico's bij routewissels binnen hetzelfde tentamen, inputdebounce en gesloten/open panelen na. Voeg regressietests voor gevonden fouten toe.
3. Controleer de echte mobiele layout bij 320, 390 en 430 px, donker/licht, liggend scherm, geopend toetsenbord en terugnavigatie. Behoud de nieuwe rekenhistorie en het verstelbare rekenmachinevenster. Vermijd overlap met de vaste tentamenknoppen. Test WebKit waar beschikbaar; claim geen fysieke iPhone-test zonder die test.
4. Controleer gekozen antwoordletters versus nulgebaseerde keuze-indexen, de kolommen van journaalposten en voorraadtabellen, procenttekens, bedragen, jaartallen en verwijzingen naar voorgaande deelvragen. Breid context gericht uit als de huidige vraag naar een eerdere berekening verwijst. Geef niet onnodig het hele vak mee.
5. Test modelgedrag met een kleine, traceerbare set echte vragen zodra daarvoor een geautoriseerde API-configuratie beschikbaar is. Technische mocktests bewijzen geen vakinhoudelijk correcte modeluitleg. Controleer ongevraagde spoilers, directe antwoordverzoeken, onjuiste aannames en een gebrekkig antwoordmodel. Gebruik geen betaalde modelcalls zonder beschikbare, toegestane configuratie.
6. Koppel de originele vakbronnen pas wanneer de bestanden en toestemming beschikbaar zijn. De bestaande bronlabels zijn niet hetzelfde als daadwerkelijk geïndexeerde syllabi en slides. Documenteer welke bronnen werkelijk zijn gekoppeld. Meng CAFA2 nooit met SRA/BELRE3.
7. Bereid de Cloudflare-inrichting voor volgens het activatiedocument. Doe al het overige werk ook wanneer secrets ontbreken. Noteer exact welke instellingen Hamudi nog zelf moet invullen. Vraag niet om API-sleutels in een chatbericht en schrijf ze niet in GitHub.
8. Werk deze overdracht en de teststatus bij met concrete resultaten. Lever een controleerbare PR op. Niet zelfstandig naar main mergen of productie activeren.

## Acceptatiecriteria

Alle huidige hoofdapp-vragen kunnen hun eigen context aanleveren. Een expliciet antwoordverzoek krijgt geen didactische weigering. Stijlwissels verliezen geen context. Vraagwissels nemen geen gesprek van een andere vraag mee. Een vertraagd antwoord verschijnt nooit bij een nieuwe vraag. Antwoorden, scores, tijd en bestaande broninhoud blijven intact. Ontbrekende backend of bronkennis wordt eerlijk gemeld. Verbruik is begrensd en credentials blijven server-side. Tests en nog ontbrekende controles zijn afzonderlijk benoemd.

SRA en BELRE3 volgen in een latere opdracht via eigen adapters en eigen broncatalogi. De repo-herstructurering blijft eveneens buiten deze opdracht.
