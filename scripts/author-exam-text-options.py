"""Source-specific reasoning choices. The official model remains the feedback authority."""
import json
from pathlib import Path
root=Path(__file__).resolve().parent.parent
entries={}
def add(keys,topic,options,reasons=None):
    why=reasons or ['Deze conclusie en motivering volgen het oorspronkelijke antwoordmodel.','Deze redenering gebruikt een ander criterium of een andere verwerking dan de oorspronkelijke casus vereist.','Deze redenering laat een beslissend casusgegeven buiten beschouwing.','Deze conclusie verwart de aard van het belang met de bijbehorende verwerking.']
    for key in keys.split():entries['cafa2-'+key]={'topicId':topic,'options':options,'why':why}

add('20210419/vraag-4','reserves',[
 'Geen wettelijke reserve deelneming: het cumulatieve resultaat van Foreest sinds de eerste waardering is niet positief.',
 'Een wettelijke reserve voor het volledige eigen vermogen van Foreest: iedere deelneming bindt haar volledige vermogen.',
 'Een wettelijke reserve ter hoogte van de betaalde goodwill: die goodwill bepaalt de reserveplicht.',
 'Een wettelijke reserve voor het aandeel in het resultaat van alleen het huidige jaar, ongeacht het cumulatieve resultaat.'])
add('20210419/vraag-5','consolidatiekader',[
 'BV X consolideert als groepshoofd op grond van artikel 2:406 lid 1 BW; BV A consolideert haar groepsdeel op grond van lid 2.',
 'Alleen BV X consolideert: artikel 2:406 lid 2 BW geeft een subgroepshoofd altijd een vrijstelling.',
 'Alleen BV A consolideert: het groepshoofd hoeft geen geconsolideerde jaarrekening op te stellen.',
 'Alle vennootschappen consolideren afzonderlijk: ieder kapitaalbelang brengt automatisch consolidatieplicht mee.'])
add('20210419/vraag-6','consolidatiekader',[
 'X neemt X, A, B en C op en verwerkt E proportioneel volgens artikel 2:409 BW. A neemt A en B op; D valt buiten de consolidatiekring.',
 'X neemt alleen X, A en B op; overheersende zeggenschap over C en gezamenlijke zeggenschap over E zijn niet relevant.',
 'X neemt X, A, B, C, D en E integraal op; A neemt alleen haar eigen gegevens op.',
 'X neemt uitsluitend haar directe dochter A op; indirect gehouden dochter B blijft buiten beide consolidaties.'])
add('20210419/vraag-7','proportioneel',[
 'X, A, B en C worden integraal geconsolideerd; E wordt proportioneel geconsolideerd volgens artikel 2:409 BW.',
 'Alle genoemde vennootschappen worden integraal geconsolideerd, ook joint venture E.',
 'Alle genoemde vennootschappen worden proportioneel geconsolideerd naar het gehouden kapitaalpercentage.',
 'X, A, B en C worden naar het gehouden percentage opgenomen; E wordt integraal geconsolideerd.'])
add('20210419/vraag-20 20211006/vraag-15 20260429/vraag-21','downstream-vp',[
 'Geen intracomptabele correctie voor de niet-gerealiseerde intercompanywinst in de enkelvoudige jaarrekening bij waardering tegen verkrijgingsprijs.',
 'Debiteer resultaat deelneming en crediteer deelneming voor de niet-gerealiseerde intercompanywinst in de enkelvoudige jaarrekening.',
 'Debiteer het enkelvoudige resultaat en crediteer overlopende passiva voor het volledige niet-gerealiseerde intercompanyresultaat.',
 'Debiteer de enkelvoudige voorraad en crediteer het resultaat voor de nog niet-gerealiseerde intercompanywinst.'],[
 'De oorspronkelijke uitwerking geeft geen intracomptabele correctie bij verkrijgingsprijs. De correcties worden in de consolidatie verwerkt.',
 'Deze verwerking hoort bij een andere waarderingsgrondslag; de vraag gaat over verkrijgingsprijs in de enkelvoudige jaarrekening.',
 'Dit neemt een correctie uit de NVW-systematiek over terwijl de casus verkrijgingsprijs voorschrijft.',
 'Dit verhoogt voorraad en resultaat met interne winst en vormt geen correcte verwerking volgens het antwoordmodel.'])
add('20210419/vraag-22','functionele-valuta',[
 'De valuta van de economische omgeving waarin de onderneming actief is en haar transacties hoofdzakelijk afsluit en afwikkelt.',
 'De valuta waarin de moedermaatschappij haar geconsolideerde jaarrekening presenteert, ongeacht de economische omgeving.',
 'De lokale munt van het land van vestiging; de feitelijke transacties en economische omgeving spelen geen rol.',
 'De munt met de hoogste wisselkoers op balansdatum, zodat het gerapporteerde vermogen zo hoog mogelijk is.'])
add('20211006/vraag-3 20260429/vraag-2','waardering',[
 'Invloed van betekenis op het zakelijke en financiële beleid bepaalt de NVW-waardering volgens artikel 2:389 BW; de verworven 60% stemrechten ondersteunen die invloed.',
 'Artikel 2:389 BW staat NVW uitsluitend toe bij een 100%-dochtermaatschappij; een 60%-belang voldoet niet.',
 'De koopsom bepaalt de waarderingsmethode; invloed op het zakelijke en financiële beleid is daarvoor niet relevant.',
 'Een 60%-deelneming wordt altijd tegen verkrijgingsprijs gewaardeerd, omdat NVW alleen voor belangen onder 20% geldt.'])
add('20211006/vraag-8','consolidatiekader',[
 'Finken is een groepsmaatschappij: Ahorn heeft via aandelen en stemrechtovereenkomst 60% van de stemmen en is door de verbondenheid en directiebevoegdheid beleidsbepalend (artikel 2:24b BW).',
 'Finken is geen groepsmaatschappij: alleen het directe aandelenbezit telt, zodat de stemrechtovereenkomst buiten beschouwing blijft.',
 'Finken is geen groepsmaatschappij: een achtergestelde lening sluit een economische en organisatorische eenheid uit.',
 'Finken is alleen door de 60% winstrechten al een groepsmaatschappij; centrale leiding en organisatorische verbondenheid hoeven niet te worden beoordeeld.'])
add('20220411/vraag-1','zeggenschap',[
 'Stein is aanvankelijk een kortlopende belegging: duurzame verbondenheid en dienstbaarheid ontbreken. Waardering volgt artikel 2:384 lid 1 BW, tegen verkrijgingsprijs of actuele waarde.',
 'Stein is een deelneming en wordt tegen NVW gewaardeerd: ieder aandelenbelang kwalificeert automatisch als deelneming.',
 'Stein is een dochtermaatschappij omdat Rosen 18% van het kapitaal bezit; daarom is integrale consolidatie verplicht.',
 'Stein is een belegging en moet tegen NVW worden gewaardeerd: artikel 2:389 BW geldt ook voor iedere kortlopende belegging.'])
add('20220411/vraag-2','zeggenschap',[
 'Stein wordt een deelneming volgens artikel 2:24c lid 1 BW: de pakketreizen dienen nu de werkzaamheden van Rosen en het verkoopvoornemen vervalt, zodat duurzame verbondenheid ontstaat.',
 'Stein blijft een belegging: een belang onder 20% kan nooit als deelneming kwalificeren.',
 'Stein wordt een dochtermaatschappij: duurzame verbondenheid staat gelijk aan een meerderheid van de stemrechten.',
 'Stein wordt een deelneming uitsluitend omdat de beurskoers stijgt; doel en duur van het belang zijn niet relevant.'])
add('20220411/vraag-3','zeggenschap',[
 'Ram is geen dochtermaatschappij van Rosen: met de stemrechtovereenkomst kan Rosen precies 50% uitoefenen; artikel 2:24a lid 1 BW vraagt meer dan de helft en een andere grond is niet gegeven.',
 'Ram is een dochtermaatschappij: precies 50% van de stemmen voldoet aan het criterium meer dan de helft.',
 'Ram is een dochtermaatschappij: 45% direct aandelenbezit is al een meerderheid.',
 'Ram is een dochtermaatschappij: iedere vennootschap met invloed van betekenis is automatisch ook een dochtermaatschappij.'])
add('20220411/vraag-7','consolidatiekader',[
 'Pols is een groepsmaatschappij van Wald volgens artikel 2:24b BW: de zeggenschap en de verwevenheid van onderhoud, werkplaats, personeel en inkoop vormen een economische en organisatorische eenheid.',
 'Pols is geen groepsmaatschappij omdat zij een eigen rechtspersoon is; afzonderlijke rechtspersonen kunnen geen groep vormen.',
 'Pols is geen groepsmaatschappij omdat onderhoudswerkzaamheden buiten de activiteiten van Wald vallen, ondanks de genoemde verwevenheid.',
 'Pols is alleen een groepsmaatschappij als Wald alle aandelen bezit; een 60%-belang is daarvoor onvoldoende.'])
add('20220411/vraag-8','consolidatiekader',[
 'Rosen consolideert Rosen, Wald, Ram en Pols volgens artikel 2:406 lid 1 BW. Wald consolideert Wald en Pols als subgroep volgens lid 2.',
 'Alleen Rosen consolideert Rosen en Wald; Ram en indirect gehouden Pols blijven buiten de consolidatiekring.',
 'Alleen Wald consolideert Wald en Pols; Rosen is als groepshoofd vrijgesteld zonder aanvullende voorwaarden.',
 'Rosen consolideert Rosen en Stein; Wald consolideert alleen Wald omdat een dochter nooit in een subgroep kan vallen.'])
add('20220411/vraag-19','functionele-valuta',[
 'USD is de functionele valuta van Prizzi: het eigen vermogen bevat reserve omrekenverschillen, passend bij een zelfstandige eenheid en toepassing van de slotkoersmethode.',
 'EUR is de functionele valuta van Prizzi: een reserve omrekenverschillen bewijst dat de tijdstipmethode wordt gebruikt.',
 'EUR is de functionele valuta omdat iedere buitenlandse deelneming automatisch de munt van de Nederlandse moeder hanteert.',
 'De functionele valuta wisselt jaarlijks naar de munt die het hoogste omgerekende eigen vermogen oplevert.'])
add('20221006/vraag-4','consolidatiekader',[
 'Beide stellingen zijn onjuist: een natuurlijke persoon als andere aandeelhouder verhindert verwerking bij Rast Holding niet; Wieder is bij gedeelde zeggenschap zonder centrale leiding geen groepsmaatschappij (artikelen 2:24b en 2:406 BW).',
 'Beide stellingen zijn juist: een natuurlijke persoon als aandeelhouder sluit consolidatie uit, terwijl iedere gezamenlijke onderneming een groepsmaatschappij is.',
 'Alleen de eerste stelling is juist: Wieder kan niet worden verwerkt omdat de andere aandeelhouder geen rechtspersoon is.',
 'Alleen de tweede stelling is juist: bij gedeelde zeggenschap heeft Rast Holding automatisch centrale leiding over Wieder.'])
add('20221006/vraag-5','proportioneel',[
 'Proportionele consolidatie volgens artikel 2:409 BW: de samenwerkingsregeling geeft gezamenlijke zeggenschap en de verwerking moet voldoen aan het wettelijke inzichtvereiste.',
 'Integrale consolidatie: gezamenlijke zeggenschap wordt behandeld alsof Rast Holding alleen alle rechten bezit.',
 'Consolidatie van alleen het dividend: vermogensbestanddelen en schulden worden bij proportionele consolidatie nooit opgenomen.',
 'Integrale consolidatie met uitsluiting van de schulden: alleen het 50%-aandeel in de activa wordt opgenomen.'])
add('20221006/vraag-6','proportioneel',[
 'Geen aandeel derden uit Wieder: bij proportionele consolidatie wordt uitsluitend het gehouden 50%-aandeel in haar financiële gegevens opgenomen.',
 'Een aandeel derden van 50%: proportionele consolidatie neemt eerst altijd 100% van de financiële gegevens op.',
 'Een aandeel derden van 100%: het volledige vermogen van de joint venture wordt als vreemd belang gepresenteerd.',
 'Een aandeel derden van 25%: het belang van de andere aandeelhouder wordt nogmaals met 50% vermenigvuldigd.'])
add('20221006/vraag-7','zeggenschap',[
 'De kwalificatie belegging is onjuist: Schaf dient duurzaam de eigen werkzaamheden, ook via groepsmaatschappij Filzen, en kwalificeert als deelneming volgens artikel 2:24c BW ondanks het belang onder 20%.',
 'De kwalificatie belegging is juist: minder dan 20% kapitaal sluit een deelneming altijd uit.',
 'Schaf is een dochtermaatschappij: dienstverlening aan Filzen vervangt de wettelijke eisen aan stemrechten en benoemingsrechten.',
 'Schaf is een belegging: alleen werkzaamheden rechtstreeks voor Rast Holding kunnen dienstbaar zijn, werkzaamheden voor haar groep tellen nooit mee.'])
add('20221006/vraag-8','waardering',[
 'De NVW-waardering is juist: de casus geeft invloed van betekenis op het zakelijke en financiële beleid; artikel 2:389 BW is van toepassing op de deelneming Schaf.',
 'NVW is onjuist: een deelneming onder 20% moet altijd tegen verkrijgingsprijs worden gewaardeerd, ook bij feitelijke invloed van betekenis.',
 'NVW is onjuist: voor invloed van betekenis is uitsluitend een meerderheidsbelang toegestaan.',
 'NVW is juist uitsluitend omdat Schaf aan Filzen verkoopt; feitelijke beleidsinvloed hoeft niet te worden beoordeeld.'])
add('20221006/vraag-21','functionele-valuta',[
 'De post is niet in lijn met de omrekening: bij functionele valuta CHF wordt voor de presentatie in EUR de slotkoersmethode gebruikt en gaat het omrekenverschil naar eigen vermogen, tenzij het koersresultaat al in de CHF-jaarrekening stond.',
 'De post is altijd in lijn: de slotkoersmethode verwerkt alle omrekenverschillen rechtstreeks in de winst-en-verliesrekening.',
 'De post is in lijn omdat beide ondernemingen dezelfde functionele valuta EUR hebben, ongeacht de gegeven functionele valuta CHF van Kröne Blatten.',
 'De post is niet in lijn omdat wisselkoersverschillen bij de slotkoersmethode volledig buiten de jaarrekening blijven.'])
add('20230411/vraag-1','zeggenschap',[
 'Rapallo is via Toane dochter en vermoede deelneming van Moneglia. Farneta is geen dochter via v.o.f. Levante, maar wel een vermoede deelneming van Moneglia via Levante (artikelen 2:24a en 2:24c BW).',
 'Rapallo en Farneta zijn beide dochter én vermoede deelneming van Moneglia: een v.o.f. kan voor het dochtercriterium zonder meer als rechtspersoon optreden.',
 'Rapallo is geen dochter omdat Moneglia haar aandelen niet rechtstreeks houdt; Farneta is uitsluitend dochter en geen deelneming.',
 'Rapallo is uitsluitend een belegging; Farneta is geen deelneming omdat een v.o.f. nooit een deelneming kan hebben.'])
add('20230411/vraag-19','basisconsolidatie',[
 'Start met resultaat Langeloo, tel resultaat Norch erbij en trek dividend, consolidatieafschrijving goodwill, aandeel derden van 20% en de netto intercompanycorrectie af, zoals in het antwoordmodel.',
 'Start met resultaat Langeloo, tel resultaat Norch en het dividend erbij en trek uitsluitend het aandeel derden af.',
 'Start met resultaat Langeloo en trek resultaat Norch af; tel consolidatieafschrijving goodwill en aandeel derden bij het resultaat op.',
 'Het geconsolideerde resultaat is gelijk aan het vennootschappelijke resultaat Langeloo; dividend, derden en intercompanywinst vereisen geen aansluiting.'])
add('20231009/vraag-1','zeggenschap',[
 'Beide belangen zijn vermoede deelnemingen. Gela volgt volgens het model verkrijgingsprijs/actuele waarde; voor Noto accepteert het gecorrigeerde model zowel de vermogensmutatiemethode als de gemotiveerde conclusie dat artikel 2:389 lid 1 BW niet op een v.o.f. van toepassing is.',
 'Gela en Noto zijn geen vermoede deelnemingen omdat de belangen onder 50% liggen; beide worden uitsluitend als kortlopende belegging behandeld.',
 'Gela moet uitsluitend tegen NVW worden gewaardeerd en bij Noto vervalt het vermoeden van deelneming omdat de aandeelhouder een v.o.f. is.',
 'Gela wordt integraal geconsolideerd op grond van het 30%-belang; Noto wordt proportioneel geconsolideerd uitsluitend op grond van het 45%-belang.'])
add('20240422/vraag-1','waardering',[
 'Casalini waardeert Gelante volgens artikel 2:389 BW tegen NVW of zichtbaar eigen vermogen: het 40%-belang en de overige aandeelhouders met ieder 10% ondersteunen invloed van betekenis.',
 'Casalini moet tegen verkrijgingsprijs waarderen omdat zij geen meerderheid van de stemmen heeft; invloed van betekenis is onvoldoende.',
 'Casalini waardeert uitsluitend tegen nominale aandelenwaarde omdat 40% precies onder de grens voor een dochtermaatschappij ligt.',
 'Casalini mag de deelneming niet op de balans opnemen zolang zij minder dan 50% van het kapitaal bezit.'])
add('20240422/vraag-2','zeggenschap',[
 'Gelante is een vermoede deelneming van Monopoli: Gelante is een vermoede deelneming van Casalini en Casalini is een dochtermaatschappij van Monopoli (artikelen 2:24a en 2:24c BW).',
 'Gelante is geen deelneming van Monopoli omdat uitsluitend rechtstreeks gehouden kapitaalbelangen meetellen.',
 'Gelante is een dochtermaatschappij van Monopoli uitsluitend omdat Casalini een 40%-belang in Gelante bezit.',
 'Gelante is een belegging van Monopoli omdat ieder indirect belang buiten artikel 2:24c BW valt.'])
add('20240422/vraag-9','functionele-valuta',[
 'Fager is het niet-zelfstandige verlengstuk van Galster en heeft EUR als functionele valuta; Galster regelt financiering en aanschaf, terwijl Fager opbrengsten periodiek afdraagt.',
 'Reiter is het niet-zelfstandige verlengstuk omdat het zelf de activiteiten regelt; Fager is daardoor juist zelfstandig.',
 'Beide vennootschappen zijn volledig zelfstandig: financiering, zeggenschap over aankopen en afdracht van opbrengsten zijn niet relevant.',
 'Fager is niet-zelfstandig maar moet daarom altijd de lokale munt als functionele valuta hanteren.'])
add('20240930/vraag-7','consolidatiekader',[
 'Sasso is geen groepsmaatschappij van Mulini: volgens artikel 2:24b BW ontbreekt centrale leiding en geen van beide samenwerkende aandeelhouders is beleidsbepalend.',
 'Sasso is wel een groepsmaatschappij: een overeenkomst tot samenwerking bewijst altijd centrale leiding van één aandeelhouder.',
 'Sasso is wel een groepsmaatschappij omdat gezamenlijke zeggenschap gelijkstaat aan overheersende zeggenschap van Mulini alleen.',
 'Sasso is geen groepsmaatschappij uitsluitend omdat groepsmaatschappijen altijd één en dezelfde rechtspersoon moeten zijn.'])
add('20240930/vraag-8','proportioneel',[
 'Mulini kan Sasso proportioneel consolideren als aan artikel 2:409 BW is voldaan, of niet consolideren en Sasso als deelneming in de geconsolideerde jaarrekening opnemen.',
 'Mulini moet Sasso altijd integraal consolideren en daarbij een aandeel derden van 50% opnemen.',
 'Mulini mag uitsluitend het dividend opnemen; de deelneming mag niet in de geconsolideerde balans worden verwerkt.',
 'Mulini moet Sasso proportioneel consolideren ongeacht samenwerking of het wettelijke inzichtvereiste; een andere verwerking is uitgesloten.'])
add('20250417/vraag-1','zeggenschap',[
 'Kapitaalverschaffing voor eigen rekening, duurzaam verbonden en ten dienste van de eigen werkzaamheid (artikel 2:24c BW).',
 'Kapitaalverschaffing voor rekening van derden, een tijdelijk belang en uitsluitend gericht op snelle verkoop.',
 'Een meerderheid van stemrechten, volledige eigendom en benoeming van alle bestuurders zijn de vier deelnemingscriteria.',
 'Alleen een percentage van minstens 50% en een beursnotering bepalen of sprake is van een deelneming.'])
add('20250417/vraag-2','waardering',[
 'Het vermoeden van invloed van betekenis bij het 25%-belang wordt volgens de casus weerlegd; feitelijke beleidsinvloed ontbreekt, zodat Todi tegen verkrijgingsprijs wordt gewaardeerd volgens artikel 2:384 lid 1 BW.',
 'Verkrijgingsprijs is verplicht omdat een 25%-belang nooit een deelneming kan zijn.',
 'NVW is verplicht bij ieder belang vanaf 20%, ook wanneer de casus het vermoeden van invloed van betekenis weerlegt.',
 'Verkrijgingsprijs is verplicht uitsluitend omdat Todi dividend uitkeert; het stemrecht en de beleidsinvloed zijn niet relevant.'])
add('20250417/vraag-6','reserves',[
 'Voor geen van beide: Montone kan bij Terni uitkeringen zonder beperking bewerkstelligen; voor Todi met verkrijgingsprijs geldt artikel 2:389 lid 6 BW niet.',
 'Voor beide: iedere deelneming vereist een reserve voor het volledige aandeel in het jaarresultaat, ongeacht waardering en uitkeerbaarheid.',
 'Alleen voor Terni: een meerderheidsbelang vereist altijd een reserve, ook als uitkeringen zonder beperking mogelijk zijn.',
 'Alleen voor Todi: verkrijgingsprijs vereist een wettelijke reserve, terwijl NVW daarvan automatisch is vrijgesteld.'])
add('20250417/vraag-7','zeggenschap',[
 'a nee, b nee, c ja, d ja, e ja: een natuurlijke persoon is geen rechtspersoon; Spoleto is geen aandeelhouder van Gubbio; de stemrechtovereenkomst, volledige aansprakelijkheid via Foligno en 40%/75% = 53,33% bepalen de overige dochterrelaties (artikel 2:24a BW).',
 'a ja, b ja, c nee, d nee, e nee: direct aandelenbezit boven 50% is in iedere situatie de enige toegestane grond.',
 'a nee, b nee, c nee, d ja, e nee: stemrechtovereenkomsten en ingekochte eigen aandelen hebben geen invloed op de dochterrelatie.',
 'a nee, b ja, c ja, d nee, e ja: benoemingsrechten werken zonder aandeelhouderschap en een volledig aansprakelijke v.o.f. telt nooit als dochter.'])
add('20250924/vraag-4','zeggenschap',[
 'Het 10%-belang is een deelneming op grond van de kwalitatieve criteria van artikel 2:24c BW; zonder invloed van betekenis volgt waardering tegen verkrijgingsprijs volgens artikel 2:384 lid 1 BW.',
 'Het 10%-belang is altijd een belegging: de kwalitatieve deelnemingscriteria kunnen de 20%-grens nooit vervangen.',
 'Het 10%-belang is een deelneming en moet daarom altijd tegen NVW worden gewaardeerd, ook zonder invloed van betekenis.',
 'Het 10%-belang is een dochtermaatschappij en wordt daarom integraal geconsolideerd.'])
add('20250924/vraag-5','eigen-aandelen',[
 'Palau is dochter van Monserrato met 80%/90% = 88,9% van de uit te oefenen stemmen. Haar 10%-belang in Monserrato is middellijk ingekocht eigen aandelen: aftrek van eigen vermogen, geen activering en geen vermindering van kapitaal (artikelen 2:24a lid 1a, 2:378 lid 2, 2:373 lid 2 en 2:385 lid 5 BW).',
 'Het belang blijft een gewone financiële belegging bij Monserrato en wordt geactiveerd; de verwerving van Palau verandert niets.',
 'De middellijk ingekochte aandelen worden als actief opgenomen en de bijbehorende nominale waarde verhoogt het kapitaal.',
 'Het 10%-belang wordt volledig afgeboekt op geplaatst kapitaal, ook zonder intrekking; aftrek van overige reserves is verboden.'])
add('20250924/vraag-7','zeggenschap',[
 'Bosa is dochter van Monserrato: 380 van de 700 uit te brengen stemmen is 54,3%, dus meer dan de helft volgens artikel 2:24a lid 1a BW.',
 'Bosa is geen dochter omdat de 380 stemmen moeten worden gedeeld door alle aandelen inclusief aandelen zonder stemrecht.',
 'Bosa is geen dochter omdat artikel 2:24a BW uitsluitend een 100%-belang als dochtermaatschappij erkent.',
 'Bosa is uitsluitend op basis van 55% geplaatst kapitaal dochter; de afzonderlijke stemrechten hoeven niet te worden onderzocht.'])
add('20230411/vraag-12','sidestream-niet-afnemend',[
 'Doorlevering: debet netto-omzet, credit kostprijs netto-omzet. Voorraadtoename: debet netto-omzet en aandeel derden (80% × 6.000); credit kostprijs, resultaat na belastingen (80% × 14.000) en de belastingcomponenten (20% × 14.000 en 20% × 6.000), volgens het model.',
 'De doorlevering vraagt geen omzeteliminatie. Boek de volledige voorraadwinst alleen op resultaat deelneming en deelneming in de enkelvoudige administratie.',
 'Boek de voorraadtoename volledig ten laste van aandeel derden; resultaat van de moeder en de belastingcomponenten blijven buiten de consolidatie.',
 'Boek de doorlevering debet kostprijs en credit omzet. Verwerk de voorraadtoename als extra geconsolideerde omzet zonder resultaat- of belastingcorrectie.'])
add('20230411/vraag-13','downstream-nvw',[
 'Eindvoorraad: debet overlopende passiva, resultaat boekjaar (12.000 × 80%) en voorziening belastingen (12.000 × 20%), credit voorraden. Beginvoorraad: debet overige reserves, credit resultaat boekjaar (14.000 × 80%), volgens het model.',
 'Eindvoorraad: debet voorraden en credit overlopende passiva en resultaat boekjaar. De winst beginvoorraad wordt niet verwerkt.',
 'Elimineer de volledige eindvoorraadwinst alleen ten laste van aandeel derden; overlopende passiva en belastinglatentie veranderen niet.',
 'Neem de interne winst eindvoorraad als geconsolideerde winst op en boek de beginvoorraadwinst als extra omzet; belastingeffecten zijn niet relevant.'])
add('20250417/vraag-8','consolidatiekader',[
 'Spoleto consolideert Spoleto, Foligno, Spello en Cesi; Assisi consolideert Assisi en Corvia (artikel 2:406 lid 1 BW). Foligno consolideert Foligno en Cesi als subgroep (lid 2).',
 'Alleen Spoleto consolideert Spoleto en Foligno; Spello, Cesi en de groep Assisi vallen buiten de consolidatieplicht.',
 'Spoleto en Assisi consolideren ieder uitsluitend hun direct gehouden aandelenbelangen; Foligno hoeft nooit een subgroep te consolideren.',
 'Alle betrokken vennootschappen consolideren de volledige groep, ook zonder zeggenschap of centrale leiding over de andere groepsdelen.'])
add('20250924/vraag-12','functionele-valuta',[
 'Omberg is een zelfstandige eenheid en haar kasstromen zijn voldoende voor haar eigen verplichtingen; Dole hoeft haar geen geldmiddelen ter beschikking te stellen (RJ 122.108).',
 'Omberg vormt uitsluitend een verlengstuk van Dole en kan haar verplichtingen alleen betalen met kasstromen van Dole.',
 'De transacties met Dole bepalen vrijwel alle activiteiten van Omberg en Omberg draagt al haar opbrengsten periodiek aan Dole af.',
 'Omberg heeft een andere functionele valuta uitsluitend doordat zij in een ander land gevestigd is; zelfstandigheid en kasstromen spelen geen rol.'])

# Each qualitative part has its own answer and distractors, grounded in its model.
add('20220411/vraag-1#a','zeggenschap',[
 'Stein is een kortlopende belegging: de verbondenheid is niet duurzaam en het belang dient niet de eigen werkzaamheden van Rosen.',
 'Stein is een deelneming omdat ieder kapitaalbelang, ook zonder duurzame verbondenheid, een deelneming vormt.',
 'Stein is een dochtermaatschappij omdat het aandelenbelang van 18% overheersende zeggenschap geeft.',
 'Stein is een joint venture uitsluitend doordat Rosen minder dan 20% van de aandelen bezit.'])
add('20220411/vraag-1#b','waardering',[
 'Verkrijgingsprijs of actuele waarde volgens artikel 2:384 lid 1 BW; Stein kwalificeert als belegging.',
 'Uitsluitend nettovermogenswaarde volgens artikel 2:389 BW, ongeacht de kwalificatie als belegging.',
 'Uitsluitend de nominale waarde van de aandelen; waarderingsgrondslagen spelen geen rol.',
 'Uitsluitend zichtbaar eigen vermogen, omdat een belang beneden 20% deze grondslag verplicht maakt.'])
add('20220411/vraag-8#a','consolidatiekader',[
 'Rosen consolideert als groepshoofd op grond van artikel 2:406 lid 1 BW; Wald als groepsdeelhoofd op grond van lid 2.',
 'Alleen Rosen consolideert; een groepsdeelhoofd hoeft nooit een geconsolideerde jaarrekening op te stellen.',
 'Alleen Wald consolideert; de consolidatieplicht geldt uitsluitend voor de direct gehouden dochter.',
 'Rosen, Wald, Ram en Pols consolideren ieder afzonderlijk de gehele groep, ongeacht hun positie.'])
add('20220411/vraag-8#b','consolidatiekader',[
 'Rosen neemt Rosen, Wald, Ram en Pols op; Wald neemt Wald en Pols op.',
 'Rosen neemt alleen Rosen en Wald op; de indirecte dochter Pols blijft buiten iedere consolidatie.',
 'Wald neemt Wald, Rosen en Ram op; Rosen neemt alleen zijn eigen financiële gegevens op.',
 'Rosen en Wald nemen uitsluitend ondernemingen op waarvan zij rechtstreeks 100% van de aandelen bezitten.'])
add('20221006/vraag-4#a','consolidatiekader',[
 'De controller heeft ongelijk: de natuurlijke persoon als andere aandeelhouder verhindert de consolidatie door Rast Holding niet.',
 'De controller heeft gelijk: een natuurlijke persoon als aandeelhouder sluit iedere vorm van consolidatie uit.',
 'Alleen de natuurlijke persoon moet consolideren; Rast Holding wordt daardoor vrijgesteld.',
 'Consolidatie is alleen toegestaan wanneer alle aandeelhouders rechtspersonen met dezelfde rechtsvorm zijn.'])
add('20221006/vraag-4#b','consolidatiekader',[
 'Wieder is geen groepsmaatschappij: Rast Holding heeft geen overheersende zeggenschap en geeft geen centrale leiding; de zeggenschap is gelijkelijk verdeeld.',
 'Wieder is een groepsmaatschappij omdat een belang van 50% altijd overheersende zeggenschap geeft.',
 'Wieder is een groepsmaatschappij uitsluitend doordat de andere aandeelhouder een natuurlijk persoon is.',
 'Wieder is een groepsmaatschappij omdat een vennootschap met meerdere aandeelhouders altijd tot één groep behoort.'])
add('20230411/vraag-1#a','zeggenschap',[
 'Rapallo is via dochter Toane een dochter van Moneglia en is ook een vermoede deelneming van Moneglia.',
 'Rapallo is geen dochter en geen deelneming omdat Moneglia geen rechtstreeks belang in Rapallo houdt.',
 'Rapallo is alleen een dochter van Cavola omdat een belang van 40% altijd meerderheid van stemmen geeft.',
 'Rapallo is uitsluitend een belegging omdat middellijk gehouden kapitaalbelangen nooit deelnemingen kunnen zijn.'])
add('20230411/vraag-1#b','zeggenschap',[
 'Farneta is volgens het model geen dochter van Moneglia via v.o.f. Levante, maar wel een vermoede deelneming via die vennootschap.',
 'Farneta is automatisch een dochter van Moneglia omdat iedere v.o.f. als directe moederrechtspersoon geldt.',
 'Farneta is geen deelneming omdat een vennootschap zonder rechtspersoonlijkheid nooit een deelneming kan houden.',
 'Farneta is een rechtstreeks gehouden dochter van Moneglia omdat middellijke aandelen direct aan het groepshoofd worden toegerekend.'])
add('20231009/vraag-1#a','waardering',[
 'Gela is een vermoede deelneming van Carini; volgens de casus wordt zij tegen verkrijgingsprijs gewaardeerd omdat Alcamo met 70% overheersende zeggenschap heeft.',
 'Gela is een kortlopende belegging omdat Carini minder dan 50% van de aandelen houdt.',
 'Gela is een dochter van Carini en wordt daarom verplicht tegen nominale waarde gewaardeerd.',
 'Gela wordt verplicht tegen nettovermogenswaarde gewaardeerd, ook wanneer het vermoeden van invloed van betekenis volgens de casus is weerlegd.'])
add('20231009/vraag-1#b','waardering',[
 'Noto is een vermoede deelneming van v.o.f. Lentini; het bronmodel accepteert verkrijgingsprijs en ook nettovermogenswaarde indien gemotiveerd dat Titel 9 van toepassing is.',
 'Noto is geen deelneming omdat een v.o.f. nooit aandelen in een rechtspersoon kan houden.',
 'Noto is uitsluitend een dochtermaatschappij van Lentini en moet op nominale waarde worden gesteld.',
 'Noto wordt verplicht tegen zichtbaar eigen vermogen gewaardeerd; een andere grondslag is volgens het model uitgesloten.'])
add('20240930/vraag-1#a','zeggenschap',[
 'Pienza is een vermoede deelneming: Mulini houdt 35% van het geplaatste kapitaal, meer dan een vijfde volgens artikel 2:24c lid 1 BW.',
 'Pienza is geen deelneming omdat alleen belangen van meer dan 50% als deelneming kunnen kwalificeren.',
 'Pienza is een dochter van Mulini omdat iedere deelneming automatisch een dochtermaatschappij is.',
 'Pienza is uitsluitend een belegging omdat één andere aandeelhouder de overige aandelen houdt.'])
add('20240930/vraag-1#b','waardering',[
 'Verkrijgingsprijs: volgens het bronmodel wordt het vermoeden van invloed van betekenis van Mulini weerlegd door de andere aandeelhouder met 65% overheersende zeggenschap.',
 'Nettovermogenswaarde is altijd verplicht bij een belang van 35%, ongeacht de omstandigheden in de casus.',
 'Nominale waarde is verplicht omdat Mulini de minderheidsaandeelhouder is.',
 'Zichtbaar eigen vermogen is verplicht omdat iedere deelneming zonder volledige zeggenschap zo wordt gewaardeerd.'])
add('20250417/vraag-6#a','reserves',[
 'Geen wettelijke reserve deelneming voor Terni: Montone kan met 80% van de stemrechten uitkeringen zonder beperking bewerkstelligen.',
 'Een wettelijke reserve voor het volledige vermogen van Terni, ongeacht de uitkeerbaarheid.',
 'Een wettelijke reserve voor alle ontvangen dividenden, omdat een dividend de reserveplicht steeds verhoogt.',
 'Een wettelijke reserve ter grootte van de aankoopprijs, omdat die altijd het gebonden vermogen van een deelneming bepaalt.'])
add('20250417/vraag-6#b','reserves',[
 'Geen wettelijke reserve deelneming voor Todi: bij verkrijgingsprijs is artikel 2:389 lid 6 BW volgens het model niet van toepassing.',
 'Een wettelijke reserve voor de gehele verkrijgingsprijs van Todi.',
 'Een wettelijke reserve voor het aandeel in het resultaat van Todi, ook als dat niet volgens de vermogensmutatiemethode is verwerkt.',
 'Een wettelijke reserve uitsluitend omdat Montone geen overheersende zeggenschap over Todi heeft.'])
add('20250417/vraag-7#a','zeggenschap',[
 'Spoleto is geen dochtermaatschappij van dhr. Rieti volgens artikel 2:24a BW: Rieti is een natuurlijk persoon en geen rechtspersoon.',
 'Spoleto is een dochtermaatschappij van Rieti omdat iedere meerderheidsaandeelhouder een moederrechtspersoon is.',
 'Rieti is een dochtermaatschappij van Spoleto omdat Spoleto rechtspersoonlijkheid heeft.',
 'Spoleto en Rieti zijn automatisch wederzijds dochtermaatschappijen zodra zij economisch verbonden zijn.'])
add('20250417/vraag-7#b','zeggenschap',[
 'Gubbio is geen dochter van Spoleto: voor het benoemingscriterium van artikel 2:24a lid 1 onder b BW moet Spoleto ook lid of aandeelhouder zijn, en dat is niet het geval.',
 'Gubbio is een dochter omdat benoemingsmacht altijd voldoende is, ook zonder lidmaatschap of aandeelhouderschap.',
 'Gubbio is een dochter omdat iedere vennootschap onder centrale leiding automatisch een dochter is.',
 'Spoleto is een dochter van Gubbio omdat de bestuurders door Spoleto kunnen worden benoemd.'])
add('20250417/vraag-7#c','zeggenschap',[
 'Spello is een dochter van Spoleto: de stemrechtovereenkomst geeft Spoleto meer dan de helft van de stemrechten volgens artikel 2:24a lid 1 onder a BW.',
 'Spello is geen dochter omdat alleen het rechtstreeks gehouden aandelenpercentage meetelt, zonder stemrechtovereenkomsten.',
 'Spello is uitsluitend een belegging omdat een buitenlandse rechtsvorm nooit dochtermaatschappij kan zijn.',
 'Spello is een dochter uitsluitend omdat het aandelenpercentage precies 20% bedraagt.'])
add('20250417/vraag-7#d','zeggenschap',[
 'Cesi kwalificeert via dochter Foligno als dochter van Spoleto: Foligno is volledig aansprakelijk voor de schulden van de v.o.f.',
 'Cesi kan nooit dochtermaatschappij zijn omdat een v.o.f. geen rechtspersoon is.',
 'Cesi is alleen een dochter wanneer zij meer dan de helft van de aandelen van Spoleto bezit.',
 'Cesi is een dochter uitsluitend op grond van haar handelsnaam; aansprakelijkheid en de relatie met Foligno spelen geen rol.'])
add('20250417/vraag-7#e','zeggenschap',[
 'Corvia is een dochter van Assisi: na inkoop van 25% eigen aandelen kan Assisi 40% / 75% = 53,33% van de stemrechten uitoefenen.',
 'Corvia is geen dochter omdat altijd 100% van alle uitgegeven aandelen in de noemer van de stemrechtberekening blijft staan.',
 'Corvia is een dochter omdat 40% aandelenbezit zonder verdere omstandigheden altijd een stemrechtmeerderheid oplevert.',
 'Assisi is een dochter van Corvia omdat Corvia eigen aandelen heeft ingekocht.'])
add('20250417/vraag-8#a','consolidatiekader',[
 'Spoleto en Assisi consolideren als groepshoofden op grond van artikel 2:406 lid 1 BW; Foligno als groepsdeelhoofd op grond van lid 2.',
 'Alleen dhr. Rieti consolideert omdat hij uiteindelijk boven de betrokken vennootschappen staat.',
 'Alleen Spoleto consolideert; Assisi en Foligno zijn zonder verdere toets vrijgesteld.',
 'Elke vennootschap consolideert steeds de gehele groep, ongeacht groepshoofd of groepsdeelhoofd.'])
add('20250417/vraag-8#b','consolidatiekader',[
 'Spoleto neemt Spoleto, Foligno, Spello en Cesi op; Assisi neemt Assisi en Corvia op; Foligno neemt Foligno en Cesi op.',
 'Spoleto neemt alle vennootschappen van beide groepen op, inclusief Assisi en Corvia; Foligno neemt alleen zichzelf op.',
 'Assisi neemt alleen Corvia op en laat zijn eigen financiële gegevens weg; Spoleto neemt alleen directe belangen van 100% op.',
 'De consolidatiekringen omvatten uitsluitend rechtspersonen en sluiten Cesi automatisch uit.'])
add('20250924/vraag-5#a','eigen-aandelen',[
 'Palau is vanaf 1 januari 2024 een dochter van Monserrato: Monserrato kan na de inkoop 80% / 90% = 88,9% van de stemrechten uitoefenen.',
 'Palau is geen dochter omdat de ingekochte eigen aandelen altijd volledig stemrecht behouden.',
 'Monserrato is automatisch een dochter van Palau uitsluitend door het wederzijdse aandelenbelang.',
 'De relatie kwalificeert uitsluitend als joint venture omdat beide vennootschappen aandelen in elkaar houden.'])
add('20250924/vraag-5#b','eigen-aandelen',[
 'De boekwaarde of verkrijgingsprijs van de ingekochte eigen aandelen wordt op het eigen vermogen van Monserrato in mindering gebracht; zij wordt niet geactiveerd en vermindert het geplaatste kapitaal niet.',
 'De ingekochte eigen aandelen worden als nieuwe deelneming geactiveerd zonder wijziging van het eigen vermogen.',
 'De ingekochte eigen aandelen worden uitsluitend van het geplaatste kapitaal afgetrokken, ook zonder intrekking.',
 'De ingekochte eigen aandelen worden als opbrengst verantwoord omdat zij binnen de groep zijn verworven.'])
add('20230411/vraag-6','waardering',[
 'Volgens het bronmodel heeft Cavola feitelijk geen invloed van betekenis omdat Toane de overige 60% bezit. Waardering geschiedt tegen verkrijgingsprijs of actuele waarde volgens artikel 2:384 BW.',
 'Een belang van 40% moet altijd tegen nettovermogenswaarde worden gewaardeerd, ook wanneer het vermoeden van invloed van betekenis in de casus is weerlegd.',
 'Nominale waarde is verplicht omdat Cavola een minderheidsbelang bezit.',
 'De boekwaarde is altijd gelijk aan 40% van het geplaatste kapitaal, zonder rekening te houden met de waarderingsgrondslag.'])
add('20230411/vraag-20','functionele-valuta',[
 'Bora heeft de euro als functionele valuta: inkoop en financiering lopen via Alten in euro’s, de activiteiten zijn een verlengstuk van Alten en de kasstromen zijn direct beschikbaar voor Alten.',
 'Bora heeft altijd de Noorse kroon als functionele valuta omdat alleen het vestigingsland bepalend is.',
 'Beide buitenlandse belangen hebben altijd de euro als functionele valuta omdat Alten in Nederland gevestigd is.',
 'De functionele valuta wordt elk jaar uitsluitend gekozen op basis van de hoogste slotkoers.'])
add('20231009/vraag-5','zeggenschap',[
 'Patti is dochter van Gela: Gela beschikt over 35 van de 65 stemgerechtigde aandelen, dus 53,8% van de stemmen volgens artikel 2:24a lid 1 onder a BW.',
 'Patti is geen dochter omdat aandelen zonder stemrecht ook volledig in de noemer van de stemrechtberekening moeten blijven staan.',
 'Gela is dochter van Patti omdat Gela een belang in Patti houdt.',
 'Patti is alleen dochter bij 100% aandelenbezit; een stemrechtmeerderheid is onvoldoende.'])
add('20211006/vraag-6 20260429/vraag-6','zeggenschap',[
 'Geen dochtermaatschappij: (2.000 + 5.000) / (4.000 + 10.000) = 50% van de stemrechten, geen meerderheid. Ook is geen benoemingsmacht volgens artikel 2:24a lid 1 onder b BW gegeven.',
 'Wel een dochtermaatschappij: precies 50% van de stemmen is volgens het model al meer dan de helft.',
 'Wel een dochtermaatschappij omdat uitsluitend de winstrechten bepalend zijn voor de stemrechtmeerderheid.',
 'Geen dochtermaatschappij omdat alleen 100% aandelenbezit voor artikel 2:24a BW in aanmerking komt.'])
(root/'content/practice/exam-text-options.json').write_text(json.dumps(entries,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(len(entries),'tekstvragen met brongebonden opties')
