# GoatCounter: paginametingen

De online CAFA2-oefenomgeving en interactieve samenvatting registreren de eerste geopende pagina en wijzigingen van de hashroute. Een hashroute is het adresdeel na `#`, bijvoorbeeld `#oefenen`. Alleen de standaard GoatCounter-tag toevoegen registreert zulke paginawisselingen niet.

`js/page-analytics.js` registreert na het renderen het paginapad en de titel. `no_onload` voorkomt dat de standaardclient daarnaast een tweede meting zonder hash verstuurt. De twee samenvattingsbouwers nemen dezelfde instelling en hetzelfde script op.

`/index.html` en `/` worden samengevoegd; `/samenvatting.html` en `/samenvatting` eveneens. Persoonlijke tijdstempels in tentamenpogingen worden uit het meetpad verwijderd. Previewdomeinen en lokale bestanden leveren geen productiemetingen op. Bestaande samengestelde bezoeken kunnen achteraf niet worden uitgesplitst naar de niet-geregistreerde onderdelen.

GoatCounters `filter()` blijft actief, waaronder uitsluiting van de eigen browser. Open eenmalig [de uitsluitingslink](https://cafa2.pages.dev/#toggle-goatcounter) en controleer de melding `DISABLED`. Herhaal dit voor iedere gebruikte browser en ieder apparaat. Dezelfde link zet de meting bij een volgend bezoek weer aan. Bij het wissen van websiteopslag vervalt deze instelling. SRA heeft [een afzonderlijke uitsluitingslink](https://sra-2xt.pages.dev/#toggle-goatcounter).

Een alternatief is **Instellingen → Tracking → Negeer IPs** in ieder GoatCounter-account. Dit sluit ook andere bezoekers op dat openbare IP-adres uit. Een wisselend IP-adres vereist onderhoud. De browseruitsluiting is daarom geschikter wanneer alleen de beheerder uitgesloten moet worden.

Controle: eerste bezoek, rechtstreekse links, paginawisselingen, herhaalde route-events, terugnavigatie, vertraagd laden van de client, verborgen tabs, uitgesloten browsers, previewdomeinen, tentamenpogingen en asynchrone CAFA2-schermen. De echte GoatCounter-client is gebruikt met onderschepte beacons; zulke technische tests versturen geen bezoeken naar productie.

Bronnen: [GoatCounter voor hash-navigatie](https://www.goatcounter.com/help/spa), [JavaScript-API](https://www.goatcounter.com/help/js), [eigen bezoeken uitsluiten](https://www.goatcounter.com/help/skip-dev), [sessies en bezoeken](https://www.goatcounter.com/help/sessions).
