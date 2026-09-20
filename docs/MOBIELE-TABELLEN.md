# Mobiele leesbaarheid van tabellen

Deze wijziging past uitsluitend de presentatie van de goedgekeurde CAFA2-samenvatting aan. De hoofdstukken, uitleg, bronverwijzingen, woorden in tabelcellen, bedragen en oefenvragen worden niet inhoudelijk gewijzigd.

Op smalle schermen worden tekstvergelijkingen per begrip onder elkaar weergegeven. De oorspronkelijke kolomkoppen blijven als labels boven de bijbehorende tekst staan. Op desktop en bij afdrukken blijft het de oorspronkelijke tabel.

Voorraadtabellen behouden alle zes kolommen. De kolombreedten worden ook in lege sjablonen bewaakt; datum, Percentage en Toe-/afname blijven op één regel. Bij horizontaal vegen blijft de datumkolom zichtbaar. De cijfers en debet-/creditbedragen worden niet in delen afgebroken. Automatische woordafbreking in de mobiele tabelcellen is uitgeschakeld.

De vormgeving wordt tijdens het bouwen als metadata aan de bestaande tabellen toegevoegd. Er wordt geen vervangende inhoud gegenereerd. Ook de opnieuw berekende tabellen in het IC-kernschema gebruiken dezelfde presentatie. De statische leesweergave werkt zonder JavaScript.

De extra controles staan in `tests/mobile-table-layout.mjs` en `tests/mobile-table-browser.py`. Naast paginabreedte controleren deze expliciet de tekstregels van lange begrippen, datums, celbreedten, rijhoogten en de vaste datumkolom tijdens horizontaal scrollen. Een inhoudssignatuur controleert dat de goedgekeurde tekst van versie b75fa48 ongewijzigd blijft. Chromium en WebKit worden op meerdere schermbreedten getest; dit vervangt geen test op de fysieke iPhone van de gebruiker.
