# CAFA2: inhoudsrevisie 20 september 2026

## Plan en uitvoering

1. Onderwijsprogramma als volledigheidskader; syllabusmethoden en relevante officiële uitwerkingen vergelijken.
2. Alle 120 eigen oefenvragen voorzien van vraaggerichte Basisregels, expliciete opdrachten en concrete herkennings-, aanpak- en controleaanwijzingen.
3. Benodigde voorraad- en partijentabellen bij iedere betrokken vraag opnemen, ook in de zelfstandig leesbare basisversies.
4. Samenvatting opnieuw opbouwen over het gehele vak, met afzonderlijke NVW/HK-routes, volledige IC-boekingssets, bronnenregister en begrippen.
5. Structurele, numerieke en browsercontroles vóór publicatie. De testuitkomst staat in de workflow, niet vooraf als aanname in dit document.

## Uitkomst van de bouw

{
  "chapters": 40,
  "pages": 45,
  "glossary": 81,
  "sources": 30,
  "coverageRows": 25
}

## Bronafbakening

Alle vakinhoud is gebaseerd op de in het gesprek aangeleverde studiestukken. Originele PDF’s, PPTX- en Excelbestanden worden niet opnieuw gepubliceerd. Bronverschillen en niet geverifieerde varianten staan op de bronnenpagina. Geen externe actualisering van wet- of regelgeving.

## Behouden

Vraag-ID’s, antwoordalternatieven, correcte keuzen, feiten, bestaande uitwerkingen en verwijzingen naar gerelateerde vragen zijn gecontroleerd op ongewijzigde inhoud. De officiële tentamendata en de opslaglogica voor antwoorden of scores zijn niet aangepast.

## Onderhoud

De inhoud staat in `content/summary/` en de 120 vraagprofielen in `content/revision/`. Na wijzigingen: `node scripts/build-learning-revision.mjs`, daarna `npm test` en `python tests/revision-browser.py`. De build is idempotent; verander niet uitsluitend de afgeleide HTML.
