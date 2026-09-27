# Toestemming en toegang tot de CAFA2 Assistent

De toestemming voor het delen van vraag, casus, eigen antwoord en gesprek staat in het bestaande introductievenster met de toegangscode en **Doorgaan**. Doorgaan is pas beschikbaar na aanvinken. De toestemming wordt alleen in het actieve tabblad bijgehouden, niet in de voortgangsopslag. Herladen en uitloggen vragen opnieuw om toestemming.

Het assistentpaneel bevat geen toestemmingsblok. Bij opnieuw openen binnen dezelfde sessie blijft ook het blok in de introductie verborgen. **Privacy** maakt de keuze opnieuw zichtbaar; intrekken stopt een lopend verzoek en blokkeert nieuwe berichten. Een al verzonden verzoek kan bij de modeldienst al zijn verwerkt.

**Meer** biedt de assistent tijdens MC-oefenvragen en tentamens. Gekopieerde menu's krijgen dezelfde opmaak als het oorspronkelijke menu, met afzonderlijke regels voor de hulpmiddelen. Een extra assistentknop staat bij de antwoordbediening van tentamens. Alle ingangen gebruiken het bestaande introductievenster en de actuele vraagcontext.

De build bewaart de nieuwe cacheversies. De browserregressie `tests/study-assistant/popup-menu-browser.py` controleert toestemming, intrekken, heropenen, beide menu's en het behoud van tentamenopslag met een gesimuleerde dienst. Deze controle doet geen echte modelaanroepen. De reguliere assistentproeven blijven afzonderlijk bestaan.

Deze wijziging kiest geen nieuwe juridische verwerkingsgrondslag. Zonder toestemmingsvinkje werken vergt bij persoonsgegevens een andere toepasselijke grondslag. De informatieplicht blijft bestaan: AVG artikel 6 lid 1 en artikel 13; intrekken van toestemming: artikel 7 lid 3.

Bronnen: [AVG, Verordening (EU) 2016/679](https://eur-lex.europa.eu/eli/reg/2016/679/oj/nld), [Rijksoverheid: persoonsgegevens doorgeven](https://www.rijksoverheid.nl/vraag-en-antwoord/privacy-en-persoonsgegevens/mogen-organisaties-mijn-persoonsgegevens-aan-anderen-doorgeven).
