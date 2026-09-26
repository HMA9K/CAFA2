# Cirrus-indeling en rekenmachine

De tentamenpagina gebruikt de goedgekeurde compacte indeling: navigatie naast de titel, vraagnummer en punten boven de vraag, een afzonderlijk scrollende casus en antwoordruimte en de bestaande scheidingskolom. De primaire vraag is vet; aanvullende tekst blijft normaal. De casus kan in een verplaatsbaar en schaalbaar venster worden geopend zonder het antwoordveld te vervangen. Markeringen hebben een oranje vlag en een label in het vraagoverzicht.

De titel en bovenbalk gebruiken #444159. De headerbediening staat in de volgorde Lichtmodus, tijd met opslagindicatie, rekenmachine en lettergrootte. De rekenmachine behoudt de begrensde parser, geschiedenis en geheugen. Duizendtallen met punten, decimalen met punt of komma en doorgaan met het laatste antwoord via *0.8 worden ondersteund. Compact formaat: 240 bij 500 pixels.

Het gedeelde bestand js/exam-cirrus-layout.js past uitsluitend de presentatie aan. Het maakt geen poging aan, overschrijft geen voortgang en kiest geen route bij het starten van de app. De bestaande cursuscontroller blijft verantwoordelijk voor antwoorden, tijd, navigatie en opslag. Het Meer-menu heeft een eigen zichtbare kopie; de oorspronkelijke navigatiebediening blijft beschikbaar voor de controller.

## Controle

De bestaande applicatietests en tests/exam-cirrus-layout-browser.cjs controleren de echte controller en interface. De browsercontrole gebruikt een afzonderlijke browsercontext, met desktop op 1366 bij 900 pixels, mobiel op 390 bij 844 pixels en donkere modus. Geef CIRRUS_URL, PLAYWRIGHT_PATH en CHROMIUM_PATH op; QA_OUTPUT bepaalt de lokale bewijsmap. Testmateriaal en bron-PDFs worden niet gepubliceerd.

Negen brongebonden SVG-schema’s zijn hersteld in acht van de elf tentamens. De gedeelde casusrenderer toont ze ook bij MC-oefenvragen. Zie broncontrole/verslag.html voor bronbestanden, paginanummers, reikwijdte en bevindingen. tests/exam-source-diagrams-browser.cjs controleert alle elf tentamens, alle 44 casussecties en meerdere MC-mounts met unieke SVG-verwijzingen.
