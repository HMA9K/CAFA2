# Eindcontrole 23 september 2026

Alle volgende controles slagen op de definitieve versie:

- tests/validate.mjs: oorspronkelijke 120 vragen en 22 berekeningen.
- tests/exam-engine.mjs en tests/exam-content.mjs: timer, pogingen en 5 bestaande volledige examens met 131 vragen blijven geldig.
- tests/content-revision.mjs: oorspronkelijke antwoordopties/feiten/uitwerkingen intact, 612 IC-scenario's.
- tests/summary-reader.mjs, tests/study-upgrade.mjs, tests/study-refinement.mjs en tests/dark-contrast.mjs: bestaande leerroutes, bronnotities en donkere modus.
- tests/practice-topics.mjs: 247 unieke vragen, 19 onderwerpen met minimaal10, 11 unieke afnames, 84 aanvullende rekencontroles, stabiele IDs en correcte rotatie van antwoorden met hun toelichting.
- tests/practice-topics-browser.mjs: werkelijk Chromium/Chrome op desktop en mobiel; handmatig/direct nakijken, tentamenblokkade, gericht afronden, gedeelde voortgang, zelf uitwerken, herladen, scoped reset, deelreset, oude historische totalen, lichte/donkere modus en geen horizontale documentoverflow.

De UI-bestandshashes in de bestaande inhoudstest zijn bewust bijgewerkt na de runtime-review en browsertests. De hashes van de officiële examenbestanden en de oorspronkelijke antwoordopties zijn niet aangepast.

Opgenomen schermafbeeldingen zijn visueel gecontroleerd. De nieuwe gegevensblokken gebruiken dezelfde fact-rijen als de oorspronkelijke vragen; patroonherkenning staat voor de berekening. De vaste onderbalk blijft bruikbaar op390px.

Voor de browsertest zijn CAFA_PLAYWRIGHT_PATH en CAFA_CHROMIUM_PATH naar de aanwezige gebundelde Playwright-runtime en lokale Chrome gezet. Er is geen publicatie naar productie uitgevoerd.
