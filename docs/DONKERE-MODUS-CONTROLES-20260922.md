# Centrale correctie donkere modus

Basis: main 12b1743f9f35687a88218b70c30a5d1ed3411346.

## Oorzaak
De gegenereerde donkere stylesheet verwerkte vooral letterlijke kleuren. `color:var(--purple)` bleef daardoor een donkere achtergrondkleur als tekstkleur gebruiken. In de echte DOM zijn Nakijken, Pauzeren, Volgende, Opnieuw beginnen, Verwijder antwoord en de A/B/C/D-filters doorgaans gewoon beschikbaar. De eerdere uitleg dat deze knoppen allemaal uitgeschakeld waren, was onjuist. Alleen bijvoorbeeld Vorige op de eerste vraag en tabelknoppen buiten een tabel zijn werkelijk disabled.

## Oplossing
De builder vertaalt kleurvariabelen voor tekst naar semantische voorgrondkleuren. Achtergrondvariabelen blijven donker. Een centrale bronlaag in content/study/dark-contrast.css regelt geselecteerde, niet-geselecteerde en werkelijk uitgeschakelde bedieningselementen. Uitgeschakelde controls hebben leesbare gedempte tekst zonder extra transparantie en een gestippelde rand; hun werkelijke beschikbaarheid verandert niet. De eerdere homepageverbetering is opgenomen in deze bronlaag. Een herbouw wist de correcties dus niet meer. Alle aanvullingen staan binnen media screen; de lichte en afdrukweergave blijven intact.

## Controle
De nieuwe Node-test wordt onderdeel van npm test. De browsertest controleert berekende tekst/achtergrondcontrasten, echte disabled-statussen, geselecteerde en niet-geselecteerde filters, tabelcontrols, pauzeren/hervatten, beantwoorde oefensets, tentamenvragen, schermbreedtes 320–1440 en automatisch/licht/donker. Bestaande inhouds-, reken-, antwoord-, herstart- en timerregressies blijven actief. Geen wijzigingen aan leerstof, normering, antwoorden of voortgangslogica. Een volledige formele toegankelijkheidsaudit of fysieke iPhone-test is hiermee niet geclaimd.
