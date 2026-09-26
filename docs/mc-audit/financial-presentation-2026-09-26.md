# Herstel financiële presentatie, 26 september 2026

De screenshots van Toren/Foreest en Moneglia lieten echte omzettingsfouten zien. De eerdere technische controle was onvoldoende om de betekenis van kolommen en de plaats van casusgegevens te beoordelen.

## Oorzaak en herstel

De algemene omzetter herkende opeenvolgende getallen als financiële kolommen. Daardoor kwamen jaartallen, percentages, aantallen en koersen onder generieke koppen `Bedrag 1/2/3` terecht. Deze automatische kolomindeling is verwijderd. Voor 25 bestaande financiële bronuitwerkingen zijn de kolommen expliciet vastgelegd, met omschrijvingen voor percentages, valuta, aantallen, koersen en bedragen. Niet herkende tekst blijft tekst; de omzetter verzint geen financiële kolommen.

Toren, 19 april 2021 vraag 2, staat nu in één verloopstaat met `Omschrijving`, `100% (€)` en `35% (€)`. Het jaar 2020 staat bij de omschrijving. De afzonderlijke mutaties sluiten aan op € 711.000 en € 248.850. Het totaal van de fair-valuecorrecties is herkenbaar een subtotaal.

Bij Moneglia, 11 april 2023 opgave 1, en Voorn, 9 oktober 2023 opgave 1, staan de reeds overgetypte organisatieschema's en tabellen nu op hun oorspronkelijke plaats in de casustekst. De dubbele, plat uitgelezen weergave is verwijderd. De casus begint met de opgavetitel. De overige tekst heeft gewone alinea's en afzonderlijke toelichtingen. De gedeelde renderer gebruikt dezelfde presentatie in MC-oefeningen en de tentamenomgeving.

De oorspronkelijke tentamendata zijn behouden. Er zijn geen PDF's opnieuw gescand. De nieuwe presentatie is gekoppeld aan een SHA-256-controle van de bestaande brontekst. Als die brontekst wijzigt, faalt de controle totdat de presentatie opnieuw is beoordeeld. De vraag-ID's en voortgang blijven behouden.

## Zichtbare bronafwijkingen

- 6 oktober 2021, vraag 19: het bestaande antwoordmodel vermeldt GBP 25.000 × 1,09 als € 27.750 en totaal € 195.750. Rekenkundig zijn dit € 27.250 en € 195.250. De oefentabel gebruikt deze juiste bedragen en licht het verschil toe.
- 11 april 2022, vraag 10: het bronantwoord noemt ultimo 2020; de vraag noemt 31 december 2021. De bronberekening blijft behouden, met een zichtbare toelichting op het verschil.
- 11 april 2022, vraag 22: de bronberekening noemt bij eindstanden 2017 en in een alternatief CNY. Vraag en casus gaan over 2021 en USD. Die aanduidingen zijn hersteld en toegelicht.

## Onderhoud en controle

De expliciete financiële presentatie staat in `content/practice/exam-financial-presentation.json`, met de bijbehorende authoringbron `scripts/author-exam-financial-presentation.py`. De casuspresentatie staat in `content/practice/exam-case-presentation.json` en wordt gemaakt met `scripts/build-exam-case-presentation.py`. Daarna bouwt `scripts/build-exam-practice.py` de oefenvragen en `scripts/build-study-assistant.mjs` de publicatie.

`tests/exam-presentation.mjs` controleert de bronkoppeling, betekenis van kolommen, de Toren-aansluiting, de twee casussen en de afwezigheid van generieke bedragkolommen in alle 380 tentamenoefeningen. De controle draait als onderdeel van `npm test`.

`tests/exam-presentation-browser.mjs` controleert de werkelijk gerenderde schermen bij Toren en Moneglia, valutakolommen bij Knight en de gedeelde casuspresentatie in de tentamenomgeving. Deze controle maakt screenshots op desktop, mobiel en in donkere modus, onder `docs/mc-audit/qa-financial-presentation/`. Eerdere uitwerkingen blijven als aparte, gesloten onderdelen beschikbaar en vallen buiten de controle op dubbele casustabellen.

De publicatie sluit aan op de inmiddels gepubliceerde analyticswijzigingen in `4222d77`. Na beoordeling van die wijzigingen zijn uitsluitend de verouderde UI-controlehashes voor `js/app.js` en `js/exams.js` bijgewerkt. De hashes van de oorspronkelijke tentamendata blijven gelijk. De vier HTML-fallbacks zijn opnieuw gegenereerd zodat ook de scriptvolgorde overeenkomt met hun generator; de analyticsfunctionaliteit blijft behouden.

De reeds bestaande tentameninventaris blijft 282 bronvragen, 380 tentamenoefeningen en 247 syllabusvragen. Dit herstel is een gerichte presentatiecontrole van 25 uitwerkingen en twee casussen; het bewijst geen volledige onafhankelijke inhoudscontrole van alle antwoorden.

## Publicatiebewijs

Wordt aangevuld na controle van de productiepublicatie en de live schermen.
