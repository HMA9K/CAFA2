# CAFA2 oefenplatform

Mobielvriendelijke oefenomgeving met 120 eigen CAFA2-oefenvragen, verdeeld over vier onderwerpen:

- Kapitaalbelangen
- Vreemde valuta
- Consolidatie tegen nettovermogenswaarde
- Consolidatie tegen verkrijgingsprijs

Elk onderwerp bevat 30 vragen. De app ondersteunt oefenen met directe feedback, een tentamenstand, zelf uitwerken, een ingebouwde rekenmachine, vraagmarkeringen, resultaten per onderwerp en export of import van voortgang.

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
js/app.js
js/calculator.js
tests/validate.mjs
```

De HTML bevat tevens een basisweergave van alle vragen. Daardoor blijven de vragen, antwoordkeuzes, uitwerkingen en navigatie bruikbaar wanneer JavaScript niet wordt uitgevoerd. Automatische scores, lokale opslag, de tentamenstand en de rekenmachine vereisen JavaScript.

## Controleren

```bash
npm test
```

De controle valideert de vier modules, alle 120 vragen, antwoordopties, interne verwijzingen en opgenomen controleberekeningen.

## Publiceren

Het project is volledig statisch. Voor Cloudflare Pages of GitHub Pages is geen buildopdracht nodig. Publiceer de repository-root en gebruik `main` voor de live-versie. De branch `test` is bedoeld voor grotere wijzigingen voordat die naar `main` gaan.

## Bronnen

De vragen zijn eigen oefenvarianten op basis van het door de gebruiker aangeleverde CAFA2-studiemateriaal. In de app staat per vraag een specifieke bronverwijzing. Het platform bevat geen letterlijk overgenomen officiële tentamenvragenset.
