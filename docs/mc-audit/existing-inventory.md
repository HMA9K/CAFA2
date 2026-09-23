# Inventarisatie van de bestaande 120 MC-vragen

Datum: 23 september 2026. Dit document beschrijft de bestaande vragen vóór aanvulling. De onderwerpindeling bestaat uit de 19 door de gebruiker goedgekeurde onderwerpen. De vier oorspronkelijke delen blijven behouden.

## Methode en afbakening

Alle vier databestanden zijn in een Node-VM ingelezen. Per vraag zijn de daadwerkelijke vraagstam, casusfeiten, juiste antwoordoptie en volledige uitleg inhoudelijk gelezen; de reeds verwerkte revisieteksten en relevante casustabellen zijn betrokken. Er is dus niet uitsluitend op titel, oorspronkelijke module of trefwoord ingedeeld.

Elke bestaande vraag heeft precies één primair onderwerp. De stabiele identificatie is modulecode plus oorspronkelijk vraagnummer, bijvoorbeeld `kap-1` en `nvw-26`. Secundaire onderwerpen leggen samenhang vast en tellen niet als extra zelfstandige vraag bij het primaire minimum van tien. De volledige motivering per vraag staat in [existing-map.json](../../content/practice/existing-map.json).

De indeling telt vragen, niet verschillende historische tentamens. Tentamenfrequenties worden afzonderlijk vastgesteld aan de hand van de oorspronkelijke tentamens en uitwerkingen. Een syllabusverwijzing of een bestaande MC-bronverwijzing is geen bewijs dat een onderwerp in een bepaald tentamen is getoetst.

## Telling en minimaal tekort

| Onderwerp | Bestaand, primair | Tekort tot 10 | Bestaande vraag-ID's |
|---|---:|---:|---|
| Kapitaalbelangen en zeggenschap | 8 | 2 | `kap-1`, `kap-2`, `kap-3`, `kap-6`, `kap-7`, `kap-8`, `kap-9`, `kap-23` |
| Waardering en resultaat van kapitaalbelangen | 17 | 0 | `kap-4`, `kap-5`, `kap-12`, `kap-16`, `kap-17`, `kap-18`, `kap-19`, `kap-22`, `kap-24`, `kap-25`, `kap-28`, `kap-30`, `val-15`, `hk-1`, `hk-2`, `hk-4`, `hk-5` |
| Verwerving, goodwill en badwill | 9 | 1 | `kap-11`, `kap-13`, `kap-14`, `kap-15`, `hk-3`, `hk-8`, `hk-9`, `hk-10`, `hk-26` |
| Wettelijke reserve deelneming en herwaarderingsreserve | 3 | 7 | `kap-20`, `kap-21`, `kap-29` |
| Inkoop van eigen aandelen | 2 | 8 | `kap-26`, `kap-27` |
| Consolidatieplicht, consolidatiekring en vrijstellingen | 1 | 9 | `kap-10` |
| Functionele valuta en methodekeuze | 3 | 7 | `val-1`, `val-2`, `val-3` |
| Tijdstipmethode en koersresultaat | 19 | 0 | `val-4`, `val-5`, `val-6`, `val-7`, `val-11`, `val-12`, `val-13`, `val-14`, `val-16`, `val-17`, `val-18`, `val-19`, `val-20`, `val-21`, `val-22`, `val-23`, `val-24`, `val-25`, `val-29` |
| Slotkoersmethode en reserve omrekenverschillen | 7 | 3 | `val-8`, `val-9`, `val-10`, `val-26`, `val-27`, `val-28`, `val-30` |
| Basisconsolidatie en derdenbelang | 18 | 0 | `nvw-1`, `nvw-2`, `nvw-4`, `nvw-5`, `nvw-20`, `nvw-28`, `nvw-29`, `nvw-30`, `hk-6`, `hk-7`, `hk-11`, `hk-12`, `hk-13`, `hk-14`, `hk-27`, `hk-28`, `hk-29`, `hk-30` |
| Downstream bij NVW | 6 | 4 | `nvw-3`, `nvw-6`, `nvw-7`, `nvw-8`, `nvw-9`, `nvw-10` |
| Downstream bij verkrijgingsprijs | 5 | 5 | `hk-21`, `hk-22`, `hk-23`, `hk-24`, `hk-25` |
| Upstream bij NVW | 5 | 5 | `nvw-11`, `nvw-12`, `nvw-13`, `nvw-14`, `nvw-15` |
| Upstream bij verkrijgingsprijs | 6 | 4 | `hk-15`, `hk-16`, `hk-17`, `hk-18`, `hk-19`, `hk-20` |
| Sidestream bij NVW: niet-afnemend belang | 4 | 6 | `nvw-16`, `nvw-17`, `nvw-18`, `nvw-19` |
| Sidestream bij NVW: afnemend belang | 5 | 5 | `nvw-21`, `nvw-22`, `nvw-23`, `nvw-24`, `nvw-25` |
| Intercompanyverkoop van materiële vaste activa | 2 | 8 | `nvw-26`, `nvw-27` |
| Belastingeffecten bij consolidatie | 0 | 10 | Geen |
| Proportionele consolidatie en joint ventures | 0 | 10 | Geen |
| **Totaal** | **120** | **94** | **120 unieke vragen** |

Het minimum van tien per onderwerp vereist op deze primaire indeling ten minste **94 nieuwe vragen**, dus **214 vragen totaal**. Meer vragen zijn nodig waar de tentamenfrequentie, complexiteit of ontbrekende subvaardigheden dat rechtvaardigen. De al bestaande aantallen boven tien blijven behouden. Dit is een ondergrens, geen definitieve verdeling van de aanvullingen.

## Belangrijke indelingsbeslissingen

- `nvw-26` en `nvw-27` zijn primair **vaste activa**. De kern is machineboekwinst en latere afschrijving. Downstream en belasting zijn secundair.
- `val-6`, `val-7`, `val-11`, `val-12` en `val-19` gaan wel over materiële vaste activa, maar toetsen valutaomrekening en bevatten geen IC-verkoop. Ze blijven bij **tijdstipmethode**.
- `val-15` vraagt een NVW-dividendboeking met de transactiedatumkoers en noemt geen specifieke omrekenmethode. Het primaire onderwerp is **waardering**, omdat deze dividendverwerking niet exclusief bij tijdstip of slotkoers hoort.
- `kap-7` noemt eigen aandelen maar toetst effectief stemrecht. Daarom primair **zeggenschap**, secundair eigen aandelen.
- `nvw-16` vergelijkt beide sidestreamvarianten. De eerst getoetste stroom, niet-afnemend belang, is primair; afnemend belang is secundair. De vraag wordt niet twee keer meegeteld.
- Gemengde eindcasussen `nvw-28/29/30` en `hk-28/29/30` staan primair bij **basisconsolidatie**. Zij vragen één groepsuitkomst over verschillende stromen. De relevante IC-onderwerpen staan als secundaire tags vermeld.
- `hk-19` en `hk-20` blijven bij **upstream verkrijgingsprijs**: de specifieke vaardigheid is de verwerking van één upstreamvrijval in derden respectievelijk meerderheidsresultaat.
- `nvw-20` vraagt de afzonderlijke eerste resultaateliminatie, waarbij de goedereneliminatie nog volgt. Daarom primair **basisconsolidatie**.
- Er zijn **geen bestaande vragen die uitsluitend of hoofdzakelijk belastinglatenties toetsen**. Dat belasting vaak in een IC-antwoord verwerkt is, levert geen tien zelfstandige belastingvragen op.
- Er zijn **geen bestaande vragen over proportionele consolidatie of joint ventures**.

## Inhoudelijke hiaten

| Onderwerp | Vastgestelde dekking en gewenste uitbreiding |
|---|---|
| Waardering | Zeventien primaire vragen, voornamelijk NVW, dividend, verschillende rechten en stelselwijziging. Actuele waarde, waardevermindering/herstel, verliezen en verkoop zijn niet zelfstandig afgedekt. Een hoog totaalaantal betekent hier geen volledige dekking. |
| Goodwill | Negen vragen over positieve goodwill, verwerving, aandelenruil en afschrijving. Geen zelfstandige vraag over badwill. Geef dit voorrang bij de minimale aanvulling. |
| Reserves | Drie vragen, alle over de wettelijke reserve deelneming. Herwaarderingsreserve ontbreekt als zelfstandige vaardigheid. |
| Eigen aandelen | Slechts twee primaire vragen: rechtstreekse inkoop en middellijke inkoop via een dochter. Breder oefenen met de in bronnen uitgewerkte varianten is nodig. |
| Consolidatiekader | Eén vraag over groepshoofd en tussenholding. Consolidatiekring en vrijstellingsvoorwaarden ontbreken als zelfstandige MC-vragen. |
| Functionele valuta | Drie vragen dekken begrippen en twee methodekeuzen; casusdiagnose en onderbouwde keuze hebben meer variatie nodig. |
| Slotkoers | Zeven vragen, verdeeld over balans, resultaat en omrekenreserve. Aanvulling moet een andere vaardigheid oefenen en niet alleen bedragen veranderen. |
| Basisconsolidatie | Achttien vragen, waarvan verschillende gemengde eindcasussen. De grote telling komt dus niet overeen met achttien eenvoudige vragen zonder IC-transactie. |
| IC-voorraden | De afzonderlijke richtingen en grondslagen hebben vier tot zes primaire vragen. Nieuwe vragen moeten herkenning, marge tegenover opslag, balansstand tegenover jaarmutatie, voorraadgroei tegenover vrijval en eerste tegenover vervolgjaar afwisselen. |
| Vaste activa | Twee vragen uit één downstream-NVW-machinecasus. Andere richting, grondslag, balanscorrectie, meerjarige vrijval en de in tentamens voorkomende soorten activa hebben prioriteit. |
| Belastingen | Veel geïntegreerde verwerking, nul primaire vragen. Benodigd zijn zelfstandige vragen over tijdelijke verschillen, bruto/netto, balanslatentie, jaarmutatie en vrijval. |
| Proportioneel | Geen bestaande vragen. Opbouw vanaf gezamenlijke zeggenschap naar evenredige opname en eliminatie is nodig op basis van de aangeleverde syllabus en, indien aanwezig, tentamens. |

## Concrete tekstproblemen in bestaande vragen

Deze drie problemen volgen rechtstreeks uit vergelijking van de vraagstam met de huidige antwoordopties. De mapping verandert de bestaande inhoud nog niet.

1. **`val-1`: vraagstam past niet bij de opties.** De stam vraagt alle drie valutasoorten te onderscheiden, maar iedere optie geeft slechts één definitie en het juiste antwoord is de definitie van functionele valuta. Exact fixadvies: vervang de taak door **“Welke omschrijving geeft de functionele valuta van een onderneming correct weer?”** De bestaande opties blijven dan passend.
2. **`kap-4`: vraagstam vraagt meer dan de juiste optie geeft.** De stam vraagt zowel het criterium als het wettelijke vermoeden; het juiste antwoord noemt alleen het stemrechtenvermoeden. Exact fixadvies bij behoud van de opties: **“Welk wettelijk vermoeden van invloed van betekenis gebruikt artikel 2:389 lid 1 BW voor toepassing van de vermogensmutatiemethode?”** De toelichting kan het overkoepelende criterium blijven uitleggen.
3. **`kap-27`: gevraagd antwoordtype verschilt van de opties.** De stam vraagt een resterend balansbedrag, maar alle opties bevatten twee journaalposten. Exact fixadvies bij behoud van de opties: **“Welke combinatie van aankoopboeking en evenredige correctie van 80% verwerkt Merwede voor de door Vliet gehouden aandelen Merwede?”** De resterende boekwaarde van € 468.000 blijft als controle in de uitleg.

Verder verdienen bronafhankelijke boekingsvarianten aandacht: `nvw-8`, `nvw-10`, `nvw-25` en `hk-24` leggen een specifieke rekeningbenaming of eliminatievolgorde op. Die expliciete casusvoorwaarden moeten blijven staan; verschillende correcte methoden mogen geen onbedoeld tweede juist antwoord opleveren.

## Patroonherkenning

De bestaande data bevatten al vraaggerichte herkenningsschema's. De nieuwe onderwerpweergave kan deze vóór de verdere antwoorduitleg tonen als **Herken het patroon**. De onderliggende vragen hoeven daardoor niet opnieuw te worden genummerd.

Bij IC-vragen moet het schema de beslissende kenmerken benoemen: verkoper en koper, waarderingsgrondslag, belangenverhouding, voorraad of vast actief, balansstand of jaarmutatie en belasting. Bij valuta is dat: functionele valuta, methode, soort post, waarderingsmoment en toepasselijke koers. Nieuwe vragen moeten deze keuzes expliciet terug laten komen in de uitleg van elke antwoordoptie.

## Verificatie

Gecontroleerd: 120 mappingregels; 120 unieke IDs; alle IDs bestaan in de vier ingelezen modules; precies één geldig primair onderwerp per vraag; alle secundaire onderwerpen bestaan en herhalen het primaire onderwerp niet. De aantallen over de 19 onderwerpen tellen op tot 120; de minimale tekorten tot 94.

Dit is een inhoudelijke inventarisatie en indelingscontrole. Er is geen volledige onafhankelijke herberekening van iedere historische antwoordoptie uitgevoerd en er wordt geen volledige syllabusdekking geclaimd.

## Gebruikte lokale bronnen

- [Kapitaalbelangen, huidige 30 MC-vragen](../../data/kapitaalbelangen.js)
- [Vreemde valuta, huidige 30 MC-vragen](../../data/vreemde-valuta.js)
- [Consolidatie NVW, huidige 30 MC-vragen](../../data/consolidatie-nvw.js)
- [Consolidatie verkrijgingsprijs, huidige 30 MC-vragen](../../data/consolidatie-hk.js)
- [Revisieteksten kapitaalbelangen](../../content/revision/kap.json)
- [Vraagopbouw en casustabelverwerking](../../scripts/build-learning-revision.mjs)
- [Goedgekeurde 19 onderwerpen](../../content/practice/topics.json)

Er zijn voor deze inventarisatie geen externe bronnen gebruikt.

