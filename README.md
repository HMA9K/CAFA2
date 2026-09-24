# CAFA2 oefenplatform

Mobielvriendelijke oefenomgeving met 247 eigen CAFA2-oefenvragen, verdeeld over vier delen en 19 afzonderlijk te oefenen onderwerpen:

- Kapitaalbelangen
- Vreemde valuta
- Consolidatie tegen nettovermogenswaarde
- Consolidatie tegen verkrijgingsprijs

De delen bevatten 64, 46, 94 en 43 vragen. Ieder van de 19 onderwerpen bevat minimaal 10 vragen. Onder de vier delen staat de nieuwe onderwerpkeuze met per onderwerp het voorkomen in 11 unieke tentamens uit 2021–2026 en de bijbehorende vindplaatsen. De app ondersteunt oefenen met directe feedback, een tentamenstand, zelf uitwerken, een ingebouwde rekenmachine, vraagmarkeringen, resultaten per onderwerp en export of import van voortgang.

Daarnaast bevat de app een dashboard met **Aankomend** en **Voltooid**, en elf volledige tentamens van april 2021 tot april 2026. Samen bevatten die 282 vragen en 44 casussecties. Volledige tentamens hebben een welkomstpagina, 180 minuten toetstijd (optioneel 30 minuten extra), sectiegebonden casussen en officiële antwoordmodellen voor inzage na inleveren. De 247 MC-oefenvragen blijven zonder tijdslimiet. Zie [tentamenformaat en werking](docs/tentamens.md).

Onder de MC-oefenvragen staat **Tentamenvragen per onderwerp**. De vier keuzes zijn vaste onderwerpen: 1 kapitaalbelangen, 2 vreemde valuta, 3 consolidatie nettovermogenswaarde en 4 consolidatie verkrijgingsprijs. Kies een onderwerp en een of meer tentamens. De bijbehorende papieren opgave kan per tentamen een ander nummer hebben: bij de tentamens uit 2021–2023 horen bij de vier keuzes respectievelijk de oorspronkelijke opgaven 1, 4, 2 en 3; bij die uit 2024–2026 zijn dat 1, 2, 3 en 4. De gekozen opgaven volgen elkaar van nieuw naar oud, zonder tijdslimiet. Het vraagoverzicht groepeert ze per examencode. De casussen, vragen, antwoordmodellen, oorspronkelijke opgavenummers en puntentelling blijven gekoppeld aan hun eigen tentamen.

Bij MC-vragen en tentamenvragen staat rechtsonder **Wetboek**. Die knop opent de volledige aangeleverde studiekopie met 74 artikelen uit Boek 2 BW (art. 2:24a–24d en 2:360–414, versie 1 januari 2025), met een zoekveld en uitklapbare artikelen. Artikelverwijzingen in de vragen en antwoordmodellen zijn gewone tekst; het wetboek opent zonder vooraf een relevant artikel te kiezen. Buiten de vraagomgeving blijven de artikelverwijzingen in de studieuitleg bruikbaar.

## Privacy en voortgang

Voortgang en scores worden uitsluitend in `localStorage` van de gebruikte browser bewaard. Er worden geen namen gevraagd of opgeslagen. Via de pagina **Voortgang** kan de gebruiker zelf een lokaal resultaatbestand exporteren.

## Structuur

```text
index.html
css/app.css
data/config.js
data/kapitaalbelangen.js
data/vreemde-valuta.js
data/consolidatie-nvw.js
data/consolidatie-hk.js
fragments/home.html
fragments/kapitaalbelangen.html
fragments/vreemde-valuta.html
fragments/consolidatie-nvw.html
fragments/consolidatie-hk.html
fragments/shared.html
fragments/dialogs.html
fallback/kapitaalbelangen.html
fallback/vreemde-valuta.html
fallback/consolidatie-nvw.html
fallback/consolidatie-hk.html
js/bootstrap.js
js/app.js
js/calculator.js
tests/validate.mjs
```

De startpagina laadt de vier onderwerpen uit losse HTML-fragmenten. Voor omgevingen waarin scripts zijn geblokkeerd, bevat de startpagina directe links naar vier zelfstandige basisversies. Deze basisversies bevatten de oorspronkelijke 120 vragen, antwoordkeuzes en uitwerkingen. De 127 aanvullingen en de onderwerpindeling zijn beschikbaar in de hoofdapp met JavaScript. Automatische scores, lokale opslag, de tentamenstand en de rekenmachine vereisen JavaScript.

## Controleren

```bash
npm test
```

De controle valideert de oorspronkelijke 120 vragen, de 127 aanvullingen, alle 19 onderwerpen, de 11 unieke tentamens, antwoordopties, verwijzingen en rekencontroles. `npm run test:topics-browser` controleert navigatie, feedback, tentamenstand, eigen uitwerkingen, behoud van voortgang en desktop/mobiel in Chromium.

`node tests/opgave-practice.mjs` controleert alle vier gecombineerde opgaven en geselecteerde tentamens. Met `JSDOM_PATH` controleert dezelfde test ook de route van dashboard tot inzage. `npm run test:opgaven-browser` controleert deze route in Chromium op desktop en mobiel; zet zo nodig `PLAYWRIGHT_PATH` en `CHROMIUM_PATH`. Met `TEST_BASE_URL=https://cafa2.pages.dev` draait dezelfde browsercontrole op de gepubliceerde site.

`node tests/law-references-browser.cjs` controleert de niet-klikbare artikelverwijzingen en het Wetboekvenster bij MC-vragen, volledige tentamens en samengestelde opgaven, inclusief antwoordbehoud op desktop en mobiel. Met `TEST_BASE_URL=https://cafa2.pages.dev` draait dezelfde controle op de gepubliceerde site.

## Onderwerpen en aanvullingen

Brondata staan in `content/practice/`. Bouw frequenties en vraagfragmenten met `npm run build:practice`. `question-registry.json` bewaart stabiele nieuwe IDs; de oorspronkelijke 120 IDs, antwoordposities en opslagkey blijven behouden. Onderwerproutes gebruiken dezelfde antwoorden als de vier delen. Nieuwe vragen hebben uitleg per optie, drie patroonstappen en een passende introductie.

Zie het [inhoudelijke auditverslag](docs/mc-audit/README.md) en de [leesbare tentamenfrequentie](tentamenfrequentie.html). Frequentie telt aanwezigheid per tentamen, geen puntengewicht.

## Publiceren

Het project is volledig statisch. Voor Cloudflare Pages of GitHub Pages is geen buildopdracht nodig. Publiceer de repository-root en gebruik `main` voor de live-versie. De branch `test` is bedoeld voor grotere wijzigingen voordat die naar `main` gaan.

## Bronnen

De MC-vragen zijn eigen oefenvarianten op basis van het aangeleverde CAFA2-studiemateriaal. Per MC-vraag staat een specifieke bronverwijzing. De volledige tentamens en antwoordmodellen zijn afkomstig uit de door de gebruiker aangeleverde pdf's; bronvermeldingen en eventuele broninconsistenties blijven behouden. Het platform is een oefenomgeving en geen officiële examenafname.
