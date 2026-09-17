# CAFA2 oefenplatform

Mobielvriendelijke oefenomgeving met 120 eigen CAFA2-oefenvragen, verdeeld over vier onderwerpen:

- Kapitaalbelangen
- Vreemde valuta
- Consolidatie tegen nettovermogenswaarde
- Consolidatie tegen verkrijgingsprijs

Elk onderwerp bevat 30 vragen. De app ondersteunt oefenen met directe feedback, een tentamenstand, zelf uitwerken, een ingebouwde rekenmachine, vraagmarkeringen, resultaten per onderwerp en export of import van voortgang.

Daarnaast bevat de app een dashboard met **Aankomend** en **Voltooid**, en de volledige tentamens van 24 september 2025 en 29 april 2026. Volledige tentamens hebben een welkomstpagina, 180 minuten toetstijd (optioneel 30 minuten extra), sectiegebonden casussen en officiële antwoordmodellen voor inzage na inleveren. De 120 MC-oefenvragen blijven zonder tijdslimiet. Zie [tentamenformaat en werking](docs/tentamens.md).

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

De startpagina laadt de vier onderwerpen uit losse HTML-fragmenten. Voor omgevingen waarin scripts zijn geblokkeerd, bevat de startpagina directe links naar vier zelfstandige basisversies. Daardoor blijven alle vragen, antwoordkeuzes, uitwerkingen en navigatie bereikbaar. Automatische scores, lokale opslag, de tentamenstand en de rekenmachine vereisen JavaScript.

## Controleren

```bash
npm test
```

De controle valideert de vier modules, alle 120 vragen, antwoordopties, interne verwijzingen en opgenomen controleberekeningen.

## Publiceren

Het project is volledig statisch. Voor Cloudflare Pages of GitHub Pages is geen buildopdracht nodig. Publiceer de repository-root en gebruik `main` voor de live-versie. De branch `test` is bedoeld voor grotere wijzigingen voordat die naar `main` gaan.

## Bronnen

De MC-vragen zijn eigen oefenvarianten op basis van het aangeleverde CAFA2-studiemateriaal. Per MC-vraag staat een specifieke bronverwijzing. De volledige tentamens en antwoordmodellen zijn afkomstig uit de door de gebruiker aangeleverde pdf's; bronvermeldingen en eventuele broninconsistenties blijven behouden. Het platform is een oefenomgeving en geen officiële examenafname.
