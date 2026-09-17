/* Initialiseer de catalogus. De aparte exam-YYYYMMDD.js-bestanden vullen
 * deze hierna met gecontroleerde broninhoud; zie docs/tentamens.md. */
window.CAFA2_EXAMS = [];

/* Alleen een demonstratie van de bediening, geen CAFA2-tentamen. */
window.CAFA2_EXAM_DEMO = {
  id: 'demo-omgeving',
  title: 'Demonstratie tentamenomgeving',
  date: '2026-01-01',
  demo: true,
  durationMinutes: 15,
  introduction: 'Welkom bij de demonstratie. Dit is geen officieel CAFA2-tentamen. Je probeert hier de antwoordeditor, tabellen, navigatie en de aftelklok uit. De drie opdrachten zijn uitsluitend bedoeld om de bediening te testen.',
  instructions: [
    'De klok start pas wanneer je hieronder op Toets starten klikt.',
    'Kies desgewenst vóór de start voor 30 minuten extra tijd.',
    'Je kunt vragen overslaan, markeren en later teruggaan. Antwoorden worden op dit apparaat bewaard.',
    'De klok loopt door als je de pagina sluit. Bij nul wordt je poging automatisch ingeleverd.'
  ],
  questions: [
    {id:'tekst', title:'Tekst opmaken', type:'open', prompt:'Schrijf een korte toelichting. Maak een woord vet en voeg een opsomming met twee punten toe.', solution:'Er is geen inhoudelijk juist of fout antwoord. Controleer of je tekst, vetgedrukte woord en opsomming in je opgeslagen antwoord staan.'},
    {id:'tabel', title:'Een tabel maken', type:'open', prompt:'Voeg een tabel met drie rijen en drie kolommen in. Gebruik als koppen Omschrijving, Debet en Credit. Vul zelf enkele voorbeeldbedragen in.', solution:'Controleer of je tabel en de ingevulde cellen zichtbaar zijn. Dit is alleen een oefening met de editor, geen boekhoudkundige beoordeling.'},
    {id:'navigatie', title:'De bediening controleren', type:'mc', prompt:'Wat gebeurt er met de klok als je tijdens een volledig tentamen de pagina vernieuwt?', options:[{id:'door',text:'De klok loopt door vanaf het oorspronkelijke eindtijdstip.'},{id:'reset',text:'De klok begint opnieuw.'}],correctOptionId:'door',solution:'De eindtijd wordt bij de start opgeslagen. Verversen geeft geen nieuwe tijd.'}
  ]
};
