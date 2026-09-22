# CAFA2: navigatie, weergave en wettelijke onderbouwing

Deze wijziging bouwt voort op main 4c475e6. Het meegestuurde HTML-voorbeeld is niet overgenomen als juridische bron.

## Gedrag

De terugbalk bewaart per browsertab de vraag, leespositie en geopende uitleg. Vanuit de samenvatting blijft een afzonderlijke knop naar de oorspronkelijke oefen- of tentamenvraag beschikbaar, ook na verdere navigatie binnen de studiehulpmiddelen. Antwoorden worden door de bestaande opslag bijgehouden. Een tentamenklok wordt door een uitstapje niet opnieuw gestart en loopt door zolang de poging niet is gepauzeerd.

De lichtmodus heeft de keuzes Aan, Uit en Automatisch. Een nieuwe sessie start automatisch volgens de apparaatinstelling. De handmatige keuze blijft binnen dezelfde sessie behouden. Er wordt geen bestaand antwoord of voortgangsveld voor een thema-instelling gewijzigd.

De knop Opnieuw beginnen verschijnt alleen voor begonnen oefenonderwerpen of tentamens. Bij oefeningen wordt de vorige poging in de bestaande geschiedenis bewaard. Bij tentamens wordt de oude actieve poging bij Voltooid bewaard met het label Bewaard vóór opnieuw beginnen. De nieuwe poging begint bij vraag 1 met lege antwoorden en dezelfde keuze voor extra tijd of zonder tijd. Andere pogingen blijven ongewijzigd.

## Inhoud en bronnen

De samenvatting behoudt alle oorspronkelijke 40 onderwerpen binnen 7 hoofdstukken. De extra uitleg verbindt de verwerking met het inzicht in vermogen en resultaat en de betekenis voor de accountant. De 120 oefeningen hebben uitleg en gekleurde wetsverwijzingen in de bestaande feedback. Alle 131 vragen in de vijf beschikbare tentamens hebben een aanvullende toelichting naast het originele model; de oorspronkelijke vragen, cijfers en antwoordmodellen zijn ongewijzigd.

De aparte pagina Kapitaalbelangen toont drie afzonderlijke kwalificatietoetsen, de enkelvoudige waardering en vervolgens consolidatie. Een invulhulp ordent de eigen casusbeoordeling en leidt ontbrekende feiten niet af uit alleen een percentage. De tekst is gebaseerd op de aangeleverde Syllabus CAFA2 Deel 1, p. 4–27 en 31–36, en de relevante consolidatie-uitleg uit Deel 3. De belangrijkste bepalingen zijn art. 2:24a–24d, 2:384, 2:386, 2:389 en 2:405–409 BW. Elke gekleurde verwijzing toont de pagina in de aangeleverde wetboekkopie.

Het wetsartikelenoverzicht bevat de 74 artikelen uit Burgerlijk wetboek Boek 2.pdf (34 PDF-pagina's, versievermelding 01-01-2025). De labels boven de artikelen zijn leeslabels, niet de officiële artikelkoppen. De bronversie is niet vervangen door actuele internetwetgeving.

De uitwerkingen van 22 april 2024, 30 september 2024, 17 april 2025 en 24 september 2025 zijn als PDF aangeleverd; de vindplaatsen staan in content/study/exam-notes.json. Voor 29 april 2026 is het bestaande repository-antwoordmodel gebruikt. Het oorspronkelijke PDF-antwoordmodel van dat tentamen was in deze werksessie niet beschikbaar. Aanvullingen bij mogelijke beperkingen van historische modelmotiveringen zijn als toelichting herkenbaar en vervangen het model niet.

## Onderhoud en kwaliteitscontrole

Bouw met npm run build:study en controleer met npm test. Nieuwe browseracceptatie: npm run test:study-browser (Playwright Chromium en WebKit). Bestaande regressies: npm run test:reader-browser.

Bronbestanden voor de uitbreiding staan in content/study; de additieve builder past alleen presentatielagen aan. De donkere opmaak wordt als paint-only CSS uit bestaande regels gegenereerd. Geen externe webframeworks of CDN-afhankelijkheden zijn toegevoegd. Het schema, de wetboekpagina en de bestaande fallback-oefeningen blijven zonder scripts leesbaar.

De browseracceptatie controleert de terugroute, behoud van antwoorden en klok, herstartisolatie, thema's, wetsvensters, kleine schermen, herladen en scriptvrije weergave. De bestaande invarianten voor vraagdata, antwoordmodellen en rekenengine blijven actief. De referentiehashes van de twee bewust aangepaste UI-runtimes zijn apart bijgewerkt; deze hashcontrole is geen vervanging voor de functionele browsertests.
