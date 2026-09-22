# Rekenmachine in SRA-indeling

Op verzoek is alleen de rekenmachine aangepast. Basis: CAFA2 main dda992a; vergelijking met SRA `index.html`, `js/app.js` en `css/app.css`, plus de aangeleverde schermvoorbeelden.

De witte rekenmachine heeft dezelfde paarse titelbalk, het bewerkbare veld Berekening, een afzonderlijke uitkomst en vier kolommen met dezelfde 24 hoofdtoetsen als SRA. De drijvende knop onderaan is verwijderd; in de bovenbalk staat één compact icoon. In de samenvatting is hetzelfde icoon toegevoegd. De rekenmachine opent binnen het venster, standaard rechtsboven onder de bovenbalk, en blijft verplaatsbaar en inklapbaar zonder de vraag te blokkeren. Na sluiten van een ingeklapte rekenmachine opent zij weer uitgeklapt.

De bestaande geheugenfuncties en procentfunctie zijn behouden achter Geheugen en extra functies. Berekening, uitkomst en geheugen blijven in dezelfde browsertab bewaard. SRA-toetsen ln, exp en ^ zijn toegevoegd aan de begrensde parser; de bestaande rekenregels, haakjes, decimalen en foutmeldingen blijven gecontroleerd. Er wordt geen ingevoerde code uitgevoerd. De tekstcursor en selectie in het invoerveld worden gerespecteerd. Op aanraakapparaten wordt het schermtoetsenbord niet ongevraagd geopend.

De eigen stylesheet is beperkt tot de rekenmachine en wordt door de bestaande builder toegevoegd aan hoofdscherm, samenvatting en terugvalpagina's. Geen wijzigingen aan leerstof, vragen, antwoordmodellen, scores of pogingen. De rekenmachine-assets hebben een nieuwe versiesleutel.

Controle: `npm test`, `python tests/study-refinement-browser.py` en `python tests/calculator-browser.py`. Eerst lokaal statische controles en Chromium-componentweergave; dezelfde tests draaien vervolgens volledig via HTTP in Chromium en WebKit op de testbranch. De offline testmodus claimt geen echte paginanavigatie. Een fysieke iPhone is niet getest.
