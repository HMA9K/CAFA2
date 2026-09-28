# Controle casusteksten en tabellen

Gecontroleerd op 28 september 2026 tegen de elf oorspronkelijke vraag-PDF's in `assets/tentamens/*/opgaven.pdf`. De bronbestanden en de opgeslagen tentameninhoud zijn niet gewijzigd.

De vergelijking omvat de 44 casussecties: uitgelezene brontekst, datums, percentages, bedragen en de plaatsing van tabelgegevens. Bij 231 financiële tabelregels met meerdere numerieke waarden zijn de combinaties met de PDF vergeleken. Afwijkende uitleesresultaten zijn nagegaan: de jaaraanduiding bij Kröne Blatten en de vier voorraadregels bij Assemblage komen uit de bijbehorende brontekst. De balansopbouw is daarnaast visueel gecontroleerd in de PDF's.

Herstelde presentatie:

- Pienza: afzonderlijke blokken **Activa (debet)** en **Passiva (credit)**, met behoud van beide brontotalen en alle drie peildatums.
- Overige balansen: herkenbare balanszijden, scheiding tussen naast elkaar geplaatste kolommen en zichtbare totalen. Gedeeltelijke balansen blijven gedeeltelijk.
- Oudere casussen: zes platgelezen voorraad-/machinesjablonen, de grootboekrekeningen van Molina en het koersverloop bij Helena zijn teruggezet in tabellen.
- Iedere casustabel heeft een afzonderlijke horizontale schuifmogelijkheid voor smalle schermen.

Verificatie: alle bestaande projecttests en `tests/exam-case-tables-browser.cjs` op 1440 en 390 pixels. De presentatie blijft gekoppeld aan de SHA-256 van iedere oorspronkelijke casussectie. Bedragen en percentages uit die secties blijven behouden. Het lettertype is Arial.

Dit betreft de casusovername en presentatie. De officiële uitwerkingen en de beoordeling van antwoorden zijn niet opnieuw inhoudelijk beoordeeld.
