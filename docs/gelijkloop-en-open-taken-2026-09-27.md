# Gelijkloop van CAFA2 en SRA

Controle van 27 september 2026. Dit document is de actuele ingang voor de gezamenlijke bediening en de nog openstaande verschillen. Oudere verslagen blijven historische controles; hun vinkjes bewijzen niet de actuele toestand van de andere omgeving.

## Gezamenlijke opzet

Algemene wijzigingen aan navigatie, thema, paginakoppen en hulpmiddelen moeten in dezelfde wijzigingsronde in beide omgevingen worden verwerkt en getest. Vakinhoud, formules, bronmateriaal en aantallen vragen blijven cursusgebonden. Een financiële voorraadmatrix wordt niet zonder bijbehorende statistische vraag aan SRA toegevoegd.

De bestanden `js/exam-cirrus-layout.js`, `css/exam-cirrus-layout.css` en `tests/learning-layout-browser.cjs` zijn in beide repositories identiek. De cursuscontrollers blijven verantwoordelijk voor routes, antwoorden en opslag. Er is nog geen centrale distributie die beide repositories automatisch bijwerkt.

## In deze wijziging uitgevoerd

- Eén paginakop met Home, de passende terugbestemming, titel en Meer voor home, overzichten, oefenvragen en leerpagina's. Tentamens behouden de goedgekeurde kop.
- Bovenbalk in vaste volgorde: lichtmodus, klok en opslagvinkje wanneer van toepassing, rekenmachine, tekstgrootte en profiel. Het vinkje blijft de werkelijke opslagstatus volgen.
- Geen zichtbaar Home-kruimelpad en geen extra lange route boven oefenvragen. Meetnamen en browserpaginatitels blijven beschikbaar.
- Vraagnummer en Casus-bediening in de vraagkolom; dezelfde uitlijning bij open en gesloten casus. De CAFA2-oefenruimte rekent de nieuwe kophoogte mee, zodat de onderbalk bereikbaar blijft.
- Begrippen vóór Voortgang in Meer en de kleinere home-tegels. SRA heeft dezelfde kleine naslagtegels met zijn eigen bestemmingen.
- Introductie is niet meer zichtbaar of via Tab bereikbaar in de SRA-MC-knoppenbalk, overeenkomstig CAFA2.

`tests/learning-layout-browser.cjs` controleert echte routes, Home, Meer en Escape, knopvolgorde, desktop en mobiel, donkere modus, het bewaren van een SRA-MC-antwoord, de CAFA2-casusschakelaar en de samenvattingsroute. De bestaande tentamencontrole blijft afzonderlijk van deze controle.

## Actuele takenmatrix

| Onderdeel | CAFA2 | SRA | Nog nodig |
|---|---|---|---|
| Algemene paginakop, Home, Meer, thema en knopvolgorde | Uitgevoerd in deze wijziging | Uitgevoerd in deze wijziging | Gezamenlijk onderhouden en beide browsercontroles uitvoeren bij een wijziging |
| Originele tentamen- en uitwerking-PDF in linker en rechter paneel | 22 oorspronkelijke PDF-bronnen gekoppeld; alle elf tentamens volledig beschikbaar | Geparkeerd op verzoek | SRA dezelfde bronknoppen, paneelwissels, herstelbediening en controles geven; zie [specificatie](https://github.com/HMA9K/CAFA2/blob/main/docs/originele-tentamen-pdfs.md) |
| Cirrus-tentamenindeling, zwevende casus, markeringen, compacte rekenmachine | Aanwezig | Aanwezig | Geen afzonderlijke open implementatietaak |
| MC-koppeling van iedere tentamendeelvraag | 282 bronnen gekoppeld; 380 tentamenoefeningen, waarvan 65 samengestelde vragen gesplitst | 134 bestaande MC-vragen; geen volledige deelvraagkoppeling | SRA-dekkingsmatrix maken en ontbrekende tegenhangers uit bestaande tentamenrecords toevoegen |
| MC-casus, eerdere uitkomsten, gedeelde voortgang per onderwerp | Aanwezig voor de ingevoerde tentamenoefeningen | Niet overgenomen voor alle tentamendeelvragen | SRA-bronvragen zelfstandig oefenbaar maken met echte casus en benodigde eerdere uitkomsten |
| Bronfilter Alle vragen / Syllabusvragen / Tentamenvragen | Aanwezig | Ontbreekt | SRA-filter met aantallen, routes, voortgang, resetten en behoud van antwoorden uitvoeren |
| Vraaggerichte patroonherkenning | Ingevoerd | Herkenningsvelden aanwezig voor alle 134 MC-vragen | Bij nieuwe SRA-tentamenoefeningen eveneens brongebonden herkenningsuitleg toevoegen en beoordelen |
| Zelf uitwerken en invoercomponenten in MC | Tekst, journaalposten en voorraadcellen aanwezig | Bestaande MC-bank biedt antwoordkeuze | SRA dezelfde keuze voor Zelf uitwerken en passende invoervormen geven; geen ongeschikte financiële vraagvormen kopiëren |
| Tabellen en casusschema's | Financiële herstelcontrole en 9 schema's aanwezig | Oorspronkelijke statistische bronbeelden behouden | Bij de uitbreiding van SRA-MC tabellen, grafieken en eerdere uitvoer expliciet behouden; semantische kolommen gebruiken |
| Opnieuw beginnen via intro en alle tentamenvoortgang resetten | Beide aanwezig | Intro laat een nieuwe poging toe; dashboard mist overeenkomstige herstart- en resetbediening | SRA-dashboard gelijk trekken; annuleren, opslagfouten en andere tabbladen testen |
| Rekenstappen zelfstandig begrijpelijk, inclusief formuleoverzicht | Bestaande uitleg; geen volledige nieuwe beoordeling in deze wijziging | Aanvullende verbetering lokaal geparkeerd | Doel, gegevens, formule, invulling, eenheid en verbinding naar de volgende stap overal inhoudelijk beoordelen |
| Compactere spacing in alle uitleg en formuleblokken | Vraagruimte compacter; volledige leerinhoud niet opnieuw beoordeeld | Idem | Afzonderlijke controle van alinea's, lijsten, voorbeelden, formules en tabellen in beide thema's |
| Verstelbaar en inklapbaar linker leerpaneel | Readerbediening aanwezig; geen gezamenlijke breedtebediening | Lespaneel heeft nog geen gezamenlijke breedtebediening | Leerpanelen gelijk trekken, los van de reeds bestaande casusresizers; positie en antwoorden behouden |
| Gemeenschappelijke distributie en automatische controle op gelijkloop | Losse gedeelde bestanden | Lokale study-ui-distributie plus losse gedeelde bestanden | Beide afnemers aan dezelfde versiebron koppelen en releasecontrole automatiseren |
| Oefenactiviteit meten | StudyMeasure en gebeurtenissen aanwezig | StudyMeasure en gebeurtenissen aanwezig | Ontvangst en aantallen in de echte GoatCounter-dashboards controleren; code-aanwezigheid is geen ontvangstbewijs |

De lokaal geparkeerde navigatievolgorde en dubbele home-navigatie zijn in deze wijziging meegenomen. De inhoudelijke uitlegverbetering en het linker leerpaneel blijven aparte open taken. De oudere SRA-boekcontrole is opgevolgd door `docs/afronding-sra-2026-09-20.md`; de daar verwerkte boekhiaten worden hier niet opnieuw als ontbrekend vermeld.

De CAFA2-assistent heeft eigen historische controles en resterende validatiepunten in `docs/CAFA2_ASSISTENT_TESTSTATUS.md`. Deze wijziging bevat geen nieuwe modelkwaliteitscontrole of SRA-assistentintegratie. Volledige functionele gelijkloop omvat dus meer dan alleen deze presentatieaanpassing.

## Bronnen

- [CAFA2-dekkingsmatrix](https://github.com/HMA9K/CAFA2/blob/main/docs/mc-audit/exam-practice-coverage.json)
- [CAFA2-herstart en reset](https://github.com/HMA9K/CAFA2/blob/main/docs/mc-audit/exam-restart-reset-2026-09-26.md)
- [SRA-geparkeerde MC-taken](https://github.com/HMA9K/SRA/blob/main/docs/cafa2-mc-vervolgtaken-2026-09-26.md)
- [SRA-afronding van de boekhiaten](https://github.com/HMA9K/SRA/blob/main/docs/afronding-sra-2026-09-20.md)
- [SRA-gedeelde distributie](https://github.com/HMA9K/SRA/blob/main/docs/gedeelde-layout.md)
- [CAFA2-meetimplementatie](https://github.com/HMA9K/CAFA2/blob/main/docs/goatcounter.md)
- [SRA-meetimplementatie](https://github.com/HMA9K/SRA/blob/main/docs/goatcounter.md)
