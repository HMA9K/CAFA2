(function(){
window.CAFA2_DATA=window.CAFA2_DATA||{modules:{}};
window.CAFA2_DATA.modules=window.CAFA2_DATA.modules||{};
window.CAFA2_DATA.modules["nvw"]={
  "id": "cafa2-cirrus-nvw-30-v1",
  "title": "Consolidatie nettovermogenswaarde",
  "subtitle": "Opgave 3 · 30 oefenvragen",
  "stages": [
    {
      "title": "Basis en gewone eliminaties",
      "range": "1–5"
    },
    {
      "title": "Downstream",
      "range": "6–10"
    },
    {
      "title": "Upstream",
      "range": "11–15"
    },
    {
      "title": "Sidestream niet-afnemend belang",
      "range": "16–20"
    },
    {
      "title": "Sidestream afnemend belang",
      "range": "21–25"
    },
    {
      "title": "Machine en gemengde eindcasus",
      "range": "26–30"
    }
  ],
  "sources": {
    "basis": {
      "label": "Syllabus CAFA2 (Nyenrode), Deel 3, §2.1–2.2, p. 5–6.",
      "file": "2026 Syllabus CAFA2 Deel 3 Consolideren.pdf",
      "pages": "5–6"
    },
    "down": {
      "label": "Syllabus CAFA2 (Nyenrode), Deel 3, §4.2.1 en §4.3.1, p. 64–73 en 85–94.",
      "file": "2026 Syllabus CAFA2 Deel 3 Consolideren.pdf",
      "pages": "64–73, 85–94"
    },
    "up": {
      "label": "Syllabus CAFA2 (Nyenrode), Deel 3, §4.2.2 en §4.3.2, p. 74–84 en 95–103.",
      "file": "2026 Syllabus CAFA2 Deel 3 Consolideren.pdf",
      "pages": "74–84, 95–103"
    },
    "nab": {
      "label": "Syllabus CAFA2 (Nyenrode), Deel 3, §8.1.1, p. 214–226.",
      "file": "2026 Syllabus CAFA2 Deel 3 Consolideren.pdf",
      "pages": "214–226"
    },
    "ab": {
      "label": "Syllabus CAFA2 (Nyenrode), Deel 3, §8.1.2, p. 226–238.",
      "file": "2026 Syllabus CAFA2 Deel 3 Consolideren.pdf",
      "pages": "226–238"
    },
    "mva": {
      "label": "Syllabus CAFA2 (Nyenrode), Deel 3, §8.2.1, p. 239–243.",
      "file": "2026 Syllabus CAFA2 Deel 3 Consolideren.pdf",
      "pages": "239–243"
    },
    "old": {
      "label": "Nyenrode, uitwerking tentamen 24-09-2025 na normering, opgave 3 Oldemarcke, vraag 15–23, p. 9–11.",
      "file": "20250924 Uitwerking tentamen CAFA2 (na normering).pdf",
      "pages": "9–11"
    },
    "kis": {
      "label": "Nyenrode, uitwerking tentamen 17-04-2025, opgave 3 Kisjes, vraag 15–21 en 23, p. 10–12.",
      "file": "20250417 Uitwerking tentamen CAFA2.pdf",
      "pages": "10–12"
    },
    "brug": {
      "label": "Nyenrode, uitwerking tentamen 11-04-2023, opgave 2 Bruggeman (het NVW-onderdeel), vraag 8–14, p. 6–7.",
      "file": "20230411 Uitwerking tentamen CAFA2.pdf",
      "pages": "6–7"
    },
    "mod": {
      "label": "Nyenrode, uitwerking tentamen 06-10-2021, opgave 2 Moderna (het NVW-onderdeel), vraag 2–5, p. 6–7.",
      "file": "2021-10 CAFA2 - Uitwerking tentamen.pdf",
      "pages": "6–7"
    },
    "mol": {
      "label": "Nyenrode, uitwerking tentamen 06-10-2022, opgave 2 Molina (het NVW-onderdeel), vraag 9–15, p. 7–9.",
      "file": "2022-10 CAFA2 - Uitwerking tentamen.pdf",
      "pages": "7–9"
    },
    "lok": {
      "label": "Syllabus CAFA2 (Nyenrode), uitwerkingen Deel 3a, Lok, vraag 1–2, p. 4.",
      "file": "2026 Syllabus CAFA2 deel 3a - uitwerking opgaven consolidatie owp.pdf",
      "pages": "4"
    },
    "thdown": {
      "label": "Thieu (college-Excel), CAFA2 8. Intercompany Journaaplosten, tab “Downstream toename”, NVW-kolommen A23:D51; voorraadtabel A16:F20. Geen paginanummers in Excel.",
      "file": "CAFA2 8. Intercompany Journaaplosten.xlsx",
      "pages": "tab Downstream toename, A16:F51"
    },
    "thdec": {
      "label": "Thieu (college-Excel), tab “Downstream afname”, NVW-kolommen A23:D50. Geen paginanummers in Excel.",
      "file": "CAFA2 8. Intercompany Journaaplosten.xlsx",
      "pages": "tab Downstream afname, A23:D50"
    },
    "thup": {
      "label": "Thieu (college-Excel), tab “Upstream toename”, NVW-kolommen A16:F32, en tab “Upstream Afname”, A16:F32. Geen paginanummers in Excel.",
      "file": "CAFA2 8. Intercompany Journaaplosten.xlsx",
      "pages": "tabs Upstream toename / Upstream Afname, A16:F32"
    },
    "thnab": {
      "label": "Thieu (college-Excel), tab “Sidestream NAB toename”, NVW-kolommen A19:F35. Geen paginanummers in Excel.",
      "file": "CAFA2 8. Intercompany Journaaplosten.xlsx",
      "pages": "tab Sidestream NAB toename, A19:F35"
    },
    "thab": {
      "label": "Thieu (college-Excel), tab “Sidestream AB toename”, A19:F41: percentages en boekingen; tab “Sidestream AB afname”, A19:F41. Geen paginanummers in Excel.",
      "file": "CAFA2 8. Intercompany Journaaplosten.xlsx",
      "pages": "tabs Sidestream AB toename / Sidestream AB afname, A19:F41"
    }
  },
  "questions": [
    {
      "id": 1,
      "stage": 0,
      "title": "Wat neem je voor 100% mee?",
      "type": "Theorie",
      "intro": "Atlas bezit 80% van Delta. Delta wordt integraal geconsolideerd.",
      "facts": [
        [
          "Waardering bij Atlas",
          "Nettovermogenswaarde"
        ],
        [
          "Overige correcties",
          "Geen onderlinge transacties of waarderingsverschillen."
        ]
      ],
      "task": "Welke posten van Delta neemt Atlas bij integrale consolidatie voor 100% op en hoe wordt het resterende belang van derden gepresenteerd?",
      "options": [
        {
          "text": "Alleen de activa worden voor 100% opgenomen; schulden, baten en lasten voor 80%.",
          "why": "Integrale consolidatie gebruikt niet verschillende percentages voor deze posten."
        },
        {
          "text": "Alle posten worden voor 100% opgenomen; het aandeel van derden wordt alleen in de balans vermeld.",
          "why": "Ook in de winst-en-verliesrekening wordt een aandeel derden gepresenteerd."
        },
        {
          "text": "De activa, schulden, baten en lasten van Delta worden voor 100% opgenomen. De resterende 20% komt afzonderlijk tot uitdrukking als belang derden en aandeel derden.",
          "why": ""
        },
        {
          "text": "Alle posten van Delta worden voor 80% opgenomen. Er ontstaat daarnaast een belang derden van 20%.",
          "why": "Je verwart integrale met proportionele consolidatie."
        }
      ],
      "correct": 2,
      "explanation": [
        "De consolidatiemethode is integraal: de posten worden voor 100% samengevoegd.",
        "“Belang derden” is een balanspost; “aandeel derden” hoort bij de winst-en-verliesrekening."
      ],
      "pattern": "Herken de vraag: Dit is een berekenings- of verwerkingsvraag over het gevraagde onderwerp. Onderscheid de gevraagde eindstand van een mutatie of resultaat over het jaar. Let op de beslissende gegevens: Zoek het gevraagde tijdstip en de waarderingsgrondslag. Houd aanschafprijs, aandeel in eigen vermogen, resultaat en uitkering uit elkaar. Neem uitsluitend mutaties mee die bij de gevraagde periode en onderneming horen. Vorm van het antwoord: Geef de conclusie, het beslissende casusfeit en het toepasselijke criterium. Voeg een berekening of bronregel toe wanneer de vraag dat vraagt.",
      "refs": [
        "basis"
      ],
      "related": [
        4,
        28,
        30
      ],
      "variant": true,
      "guidance": {
        "lesson": "proces",
        "title": "Integrale opname is iets anders dan winsttoerekening",
        "task": "Welke posten van Delta neemt Atlas bij integrale consolidatie voor 100% op en hoe wordt het resterende belang van derden gepresenteerd?",
        "rules": "Bij integrale consolidatie worden activa, verplichtingen, baten en lasten volledig samengevoegd, na de vereiste eliminaties. Een kapitaalbelang van 80% betekent dus niet dat iedere post voor 80% wordt opgenomen. Het overige aandeel verschijnt afzonderlijk als belang derden op de balans en aandeel derden in het resultaat.",
        "pattern": [
          "Herken de vraag: Dit is een berekenings- of verwerkingsvraag over het gevraagde onderwerp. Onderscheid de gevraagde eindstand van een mutatie of resultaat over het jaar.",
          "Let op de beslissende gegevens: Zoek het gevraagde tijdstip en de waarderingsgrondslag. Houd aanschafprijs, aandeel in eigen vermogen, resultaat en uitkering uit elkaar. Neem uitsluitend mutaties mee die bij de gevraagde periode en onderneming horen.",
          "Vorm van het antwoord: Geef de conclusie, het beslissende casusfeit en het toepasselijke criterium. Voeg een berekening of bronregel toe wanneer de vraag dat vraagt."
        ]
      },
      "caseTables": []
    },
    {
      "id": 2,
      "stage": 0,
      "title": "Wie levert aan wie?",
      "type": "Theorie",
      "intro": "Atlas houdt alle deelnemingen tegen NVW. Delta en Sigma behoren tot de groep.",
      "facts": [
        [
          "Levering 1",
          "Atlas verkoopt aan Delta."
        ],
        [
          "Levering 2",
          "Delta verkoopt aan Atlas."
        ],
        [
          "Levering 3",
          "Delta verkoopt aan Sigma."
        ]
      ],
      "task": "Welke leveringsrichting hoort achtereenvolgens bij Atlas naar Delta, Delta naar Atlas en Delta naar Sigma?",
      "options": [
        {
          "text": "1 sidestream; 2 upstream; 3 downstream.",
          "why": "Een levering vanuit de moeder is downstream, niet sidestream."
        },
        {
          "text": "1 downstream; 2 sidestream; 3 upstream.",
          "why": "Tussen twee deelnemingen is de levering sidestream."
        },
        {
          "text": "1 downstream; 2 upstream; 3 sidestream.",
          "why": ""
        },
        {
          "text": "1 upstream; 2 downstream; 3 sidestream.",
          "why": "De eerste twee richtingen zijn verwisseld."
        }
      ],
      "correct": 2,
      "explanation": [
        "Downstream loopt van moeder naar deelneming. Upstream loopt van deelneming naar moeder. Sidestream loopt tussen deelnemingen."
      ],
      "pattern": "Herken de vraag: Dit is een berekenings- of verwerkingsvraag over het gevraagde onderwerp. Onderscheid de gevraagde eindstand van een mutatie of resultaat over het jaar. Let op de beslissende gegevens: Zoek het gevraagde tijdstip en de waarderingsgrondslag. Houd aanschafprijs, aandeel in eigen vermogen, resultaat en uitkering uit elkaar. Neem uitsluitend mutaties mee die bij de gevraagde periode en onderneming horen. Vorm van het antwoord: Geef de conclusie, het beslissende casusfeit en het toepasselijke criterium. Voeg een berekening of bronregel toe wanneer de vraag dat vraagt.",
      "refs": [
        "down",
        "up",
        "nab"
      ],
      "related": [
        6,
        11,
        16
      ],
      "variant": true,
      "guidance": {
        "lesson": "streams",
        "title": "De goederenpijl bepaalt de richting",
        "task": "Welke leveringsrichting hoort achtereenvolgens bij Atlas naar Delta, Delta naar Atlas en Delta naar Sigma?",
        "rules": "Downstream loopt van moeder naar deelneming, upstream van deelneming naar moeder en sidestream tussen deelnemingen. Bepaal de richting vanuit de verkoper en koper van de goederen, niet vanuit de aandelenpijl. Het deelnemingspercentage bepaalt daarna de verdeling van winstcorrecties, maar verandert de richting van de levering niet.",
        "pattern": [
          "Herken de vraag: Dit is een berekenings- of verwerkingsvraag over het gevraagde onderwerp. Onderscheid de gevraagde eindstand van een mutatie of resultaat over het jaar.",
          "Let op de beslissende gegevens: Zoek het gevraagde tijdstip en de waarderingsgrondslag. Houd aanschafprijs, aandeel in eigen vermogen, resultaat en uitkering uit elkaar. Neem uitsluitend mutaties mee die bij de gevraagde periode en onderneming horen.",
          "Vorm van het antwoord: Geef de conclusie, het beslissende casusfeit en het toepasselijke criterium. Voeg een berekening of bronregel toe wanneer de vraag dat vraagt."
        ]
      },
      "caseTables": []
    },
    {
      "id": 3,
      "stage": 0,
      "title": "Winst in de eindvoorraad",
      "type": "Rekenvraag",
      "intro": "Atlas verkoopt goederen aan Delta. De verkoopprijzen zijn het gehele jaar gelijk.",
      "facts": [
        [
          "Inkoopprijs Atlas",
          "€ 80 per stuk"
        ],
        [
          "Verkoopprijs Atlas aan Delta",
          "€ 100 per stuk"
        ],
        [
          "Eindvoorraad bij Delta",
          "2.350 stuks, uitsluitend afkomstig van Atlas."
        ]
      ],
      "task": "Hoeveel niet-gerealiseerde intercompanywinst vóór belasting bevat Delta's eindvoorraad van 2.350 stuks, uitgaande van de gegeven inkoop- en onderlinge verkoopprijs per stuk?",
      "options": [
        {
          "lines": [
            "2.350 × € 80 × 20%"
          ],
          "expression": "2350*80*.2",
          "value": "37600.0",
          "result": "€ 37.600",
          "why": "Je past het winstpercentage op de verkeerde grondslag toe."
        },
        {
          "lines": [
            "2.350 × (€ 100 − € 80) × 80%"
          ],
          "expression": "2350*(100-80)*.8",
          "value": "37600.0",
          "result": "€ 37.600",
          "why": "Gevraagd is de totale winst in de voorraad, nog niet het aandeel van Atlas."
        },
        {
          "lines": [
            "2.350 × € 100 × 25%"
          ],
          "expression": "2350*100*.25",
          "value": "58750.0",
          "result": "€ 58.750",
          "why": "25% is de opslag op inkoopprijs; niet het winstpercentage in de verkoopprijs."
        },
        {
          "lines": [
            "2.350 × (€ 100 − € 80)"
          ],
          "expression": "2350*(100-80)",
          "value": "47000",
          "result": "€ 47.000",
          "why": ""
        }
      ],
      "correct": 3,
      "explanation": [
        "De winst is € 20 per stuk. In de eindvoorraad zit daarom 2.350 × € 20 = € 47.000.",
        "De € 47.000 is vóór toepassing van een deelnemingspercentage of winstbelasting."
      ],
      "pattern": "Herken de vraag: Dit is een berekenings- of verwerkingsvraag over de interne transactie. Onderscheid de gevraagde eindstand van een mutatie of resultaat over het jaar. Let op de beslissende gegevens: Zoek het gevraagde tijdstip en de waarderingsgrondslag. Houd aanschafprijs, aandeel in eigen vermogen, resultaat en uitkering uit elkaar. Neem uitsluitend mutaties mee die bij de gevraagde periode en onderneming horen. Vorm van het antwoord: Toon de relevante beginstand of formule, de ingevulde gegevens en de berekening tot de gevraagde uitkomst. Vermeld valuta of eenheid en geef bij een verschil ook het teken en de verwerking aan.",
      "refs": [
        "down",
        "old"
      ],
      "related": [
        6,
        11,
        17
      ],
      "variant": true,
      "guidance": {
        "lesson": "voorraadtabel",
        "title": "Eerst de volledige winst in de voorraad",
        "task": "Hoeveel niet-gerealiseerde intercompanywinst vóór belasting bevat Delta's eindvoorraad van 2.350 stuks, uitgaande van de gegeven inkoop- en onderlinge verkoopprijs per stuk?",
        "rules": "De voorraad bij de koper bevat de winstopslag van de groepsverkoper. Bereken eerst de winst per stuk als onderlinge verkoopprijs minus inkoopprijs van de verkoper en vermenigvuldig met de resterende hoeveelheid. Dit is de volledige winst vóór verdeling naar interne correctie, derden en aanvullende consolidatiecorrectie. Belasting wordt pas bij de boekingen verwerkt.",
        "pattern": [
          "Herken de vraag: Dit is een berekenings- of verwerkingsvraag over de interne transactie. Onderscheid de gevraagde eindstand van een mutatie of resultaat over het jaar.",
          "Let op de beslissende gegevens: Zoek het gevraagde tijdstip en de waarderingsgrondslag. Houd aanschafprijs, aandeel in eigen vermogen, resultaat en uitkering uit elkaar. Neem uitsluitend mutaties mee die bij de gevraagde periode en onderneming horen.",
          "Vorm van het antwoord: Toon de relevante beginstand of formule, de ingevulde gegevens en de berekening tot de gevraagde uitkomst. Vermeld valuta of eenheid en geef bij een verschil ook het teken en de verwerking aan."
        ]
      },
      "caseTables": [
        {
          "caption": "Eindvoorraad bij Delta",
          "headers": [
            "Gegeven",
            "Waarde"
          ],
          "rows": [
            [
              "Resterend aantal",
              "2.350 stuks"
            ],
            [
              "Inkoopprijs Atlas",
              "€ 80 per stuk"
            ],
            [
              "Verkoopprijs aan Delta",
              "€ 100 per stuk"
            ],
            [
              "Gezochte totale ongerealiseerde winst",
              "Nog te berekenen, vóór belasting"
            ]
          ]
        }
      ]
    },
    {
      "id": 4,
      "stage": 0,
      "title": "Deelneming en eigen vermogen",
      "type": "Journaalpost",
      "intro": "Atlas bezit 80% van Delta en waardeert deze deelneming tegen NVW.",
      "facts": [
        [
          "Eigen vermogen Delta ultimo",
          "Kapitaal € 100.000; overige reserves € 300.000; resultaat boekjaar € 100.000."
        ],
        [
          "Boekwaarde deelneming",
          "€ 400.000"
        ],
        [
          "Overig",
          "Geen intercompanywinst, goodwill of waarderingsverschillen."
        ]
      ],
      "task": "Welke balanseliminatie verwijdert het volledige eigen vermogen van Delta tegenover Atlas' deelneming van € 400.000 en het 20%-belang van derden, zonder IC- of waarderingsverschillen?",
      "options": [
        {
          "journal": [
            [
              "Aandelenkapitaal Delta",
              "100.000",
              ""
            ],
            [
              "Overige reserves Delta",
              "300.000",
              ""
            ],
            [
              "Resultaat boekjaar Delta",
              "100.000",
              ""
            ],
            [
              "Deelneming Delta",
              "",
              "500.000"
            ]
          ],
          "journalNumeric": [
            [
              "Aandelenkapitaal Delta",
              100000,
              0
            ],
            [
              "Overige reserves Delta",
              300000,
              0
            ],
            [
              "Resultaat boekjaar Delta",
              100000,
              0
            ],
            [
              "Deelneming Delta",
              0,
              500000
            ]
          ],
          "why": "De deelneming is maar € 400.000; het resterende bedrag hoort bij belang derden."
        },
        {
          "journal": [
            [
              "Aandelenkapitaal Delta",
              "100.000",
              ""
            ],
            [
              "Overige reserves Delta",
              "300.000",
              ""
            ],
            [
              "Resultaat boekjaar Delta",
              "100.000",
              ""
            ],
            [
              "Deelneming Delta",
              "",
              "400.000"
            ],
            [
              "Belang derden",
              "",
              "100.000"
            ]
          ],
          "journalNumeric": [
            [
              "Aandelenkapitaal Delta",
              100000,
              0
            ],
            [
              "Overige reserves Delta",
              300000,
              0
            ],
            [
              "Resultaat boekjaar Delta",
              100000,
              0
            ],
            [
              "Deelneming Delta",
              0,
              400000
            ],
            [
              "Belang derden",
              0,
              100000
            ]
          ],
          "why": ""
        },
        {
          "journal": [
            [
              "Aandelenkapitaal Delta",
              "80.000",
              ""
            ],
            [
              "Overige reserves Delta",
              "240.000",
              ""
            ],
            [
              "Resultaat boekjaar Delta",
              "80.000",
              ""
            ],
            [
              "Deelneming Delta",
              "",
              "400.000"
            ]
          ],
          "journalNumeric": [
            [
              "Aandelenkapitaal Delta",
              80000,
              0
            ],
            [
              "Overige reserves Delta",
              240000,
              0
            ],
            [
              "Resultaat boekjaar Delta",
              80000,
              0
            ],
            [
              "Deelneming Delta",
              0,
              400000
            ]
          ],
          "why": "Hier blijft 20% van het eigen vermogen van Delta ongeëlimineerd zonder afzonderlijke presentatie."
        },
        {
          "journal": [
            [
              "Aandelenkapitaal Delta",
              "",
              "100.000"
            ],
            [
              "Overige reserves Delta",
              "",
              "300.000"
            ],
            [
              "Resultaat boekjaar Delta",
              "",
              "100.000"
            ],
            [
              "Deelneming Delta",
              "400.000",
              ""
            ],
            [
              "Belang derden",
              "100.000",
              ""
            ]
          ],
          "journalNumeric": [
            [
              "Aandelenkapitaal Delta",
              0,
              100000
            ],
            [
              "Overige reserves Delta",
              0,
              300000
            ],
            [
              "Resultaat boekjaar Delta",
              0,
              100000
            ],
            [
              "Deelneming Delta",
              400000,
              0
            ],
            [
              "Belang derden",
              100000,
              0
            ]
          ],
          "why": "De eliminatie staat volledig omgekeerd."
        }
      ],
      "correct": 1,
      "explanation": [
        "Elimineer het volledige eigen vermogen van Delta: € 500.000.",
        "Daartegenover staan de deelneming van € 400.000 en belang derden van € 100.000."
      ],
      "pattern": "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt de waardering of boekwaarde bij de consolidatie. Herken eerst welke gebeurtenis of correctie moet worden geboekt. Let op de beslissende gegevens: Bepaal welke rekening toeneemt of afneemt en vanuit welke onderneming wordt geboekt. Zoek de waarderingsgrondslag, het belang en het tijdstip in de casus. Een eliminatie verwijdert een interne post; een enkelvoudige boeking verwerkt de gebeurtenis bij de onderneming zelf. Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten.",
      "refs": [
        "old",
        "basis"
      ],
      "related": [
        14,
        20
      ],
      "variant": true,
      "guidance": {
        "lesson": "consolidatie-nvw",
        "title": "Deelneming tegenover eigen vermogen elimineren",
        "task": "Welke balanseliminatie verwijdert het volledige eigen vermogen van Delta tegenover Atlas' deelneming van € 400.000 en het 20%-belang van derden, zonder IC- of waarderingsverschillen?",
        "rules": "De post deelneming bij Atlas en het overeenkomstige eigen vermogen van Delta vertegenwoordigen dezelfde onderliggende netto-activa. Bij integrale consolidatie wordt het gehele eigen vermogen van Delta geëlimineerd. Het gedeelte dat niet door Atlas wordt gehouden, wordt als belang derden gepresenteerd. Deze vraag betreft uitsluitend balansposten.",
        "pattern": [
          "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt de waardering of boekwaarde bij de consolidatie. Herken eerst welke gebeurtenis of correctie moet worden geboekt.",
          "Let op de beslissende gegevens: Bepaal welke rekening toeneemt of afneemt en vanuit welke onderneming wordt geboekt. Zoek de waarderingsgrondslag, het belang en het tijdstip in de casus. Een eliminatie verwijdert een interne post; een enkelvoudige boeking verwerkt de gebeurtenis bij de onderneming zelf.",
          "Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten."
        ]
      },
      "caseTables": []
    },
    {
      "id": 5,
      "stage": 0,
      "title": "Onderlinge fee en schuld",
      "type": "Journaalpost",
      "intro": "Atlas en Delta worden integraal geconsolideerd.",
      "facts": [
        [
          "Belang Atlas",
          "80%"
        ],
        [
          "Managementfee",
          "Atlas boekt € 50.000 baten; Delta boekt € 50.000 kosten."
        ],
        [
          "Rekening-courant ultimo",
          "Vordering Atlas op Delta € 75.000; gelijke schuld bij Delta."
        ],
        [
          "Winstbelasting",
          "Buiten beschouwing."
        ]
      ],
      "task": "Welke twee afzonderlijke eliminatieboekingen verwijderen de managementfee uit de geconsolideerde winst-en-verliesrekening en de rekening-courantverhouding uit de geconsolideerde balans?",
      "options": [
        {
          "journals": [
            {
              "label": "Winst-en-verliesrekening",
              "journal": [
                [
                  "Managementfeebaten Atlas",
                  "50.000",
                  ""
                ],
                [
                  "Managementfeekosten Delta",
                  "",
                  "50.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Managementfeebaten Atlas",
                  50000,
                  0
                ],
                [
                  "Managementfeekosten Delta",
                  0,
                  50000
                ]
              ],
              "why": ""
            },
            {
              "label": "Balans",
              "journal": [
                [
                  "Schuld aan Atlas",
                  "75.000",
                  ""
                ],
                [
                  "Vordering op Delta",
                  "",
                  "75.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Schuld aan Atlas",
                  75000,
                  0
                ],
                [
                  "Vordering op Delta",
                  0,
                  75000
                ]
              ],
              "why": ""
            }
          ],
          "why": ""
        },
        {
          "journals": [
            {
              "label": "Winst-en-verliesrekening",
              "journal": [
                [
                  "Managementfeebaten Atlas",
                  "50.000",
                  ""
                ],
                [
                  "Managementfeekosten Delta",
                  "",
                  "50.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Managementfeebaten Atlas",
                  50000,
                  0
                ],
                [
                  "Managementfeekosten Delta",
                  0,
                  50000
                ]
              ],
              "why": ""
            },
            {
              "label": "Balans",
              "journal": [
                [
                  "Vordering op Delta",
                  "75.000",
                  ""
                ],
                [
                  "Schuld aan Atlas",
                  "",
                  "75.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Vordering op Delta",
                  75000,
                  0
                ],
                [
                  "Schuld aan Atlas",
                  0,
                  75000
                ]
              ],
              "why": ""
            }
          ],
          "why": "De balanseliminatie is omgekeerd."
        },
        {
          "journals": [
            {
              "label": "Winst-en-verliesrekening",
              "journal": [
                [
                  "Managementfeekosten Delta",
                  "50.000",
                  ""
                ],
                [
                  "Managementfeebaten Atlas",
                  "",
                  "50.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Managementfeekosten Delta",
                  50000,
                  0
                ],
                [
                  "Managementfeebaten Atlas",
                  0,
                  50000
                ]
              ],
              "why": ""
            },
            {
              "label": "Balans",
              "journal": [
                [
                  "Schuld aan Atlas",
                  "75.000",
                  ""
                ],
                [
                  "Vordering op Delta",
                  "",
                  "75.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Schuld aan Atlas",
                  75000,
                  0
                ],
                [
                  "Vordering op Delta",
                  0,
                  75000
                ]
              ],
              "why": ""
            }
          ],
          "why": "De fee-eliminatie is omgekeerd."
        },
        {
          "journals": [
            {
              "label": "Winst-en-verliesrekening",
              "journal": [
                [
                  "Managementfeebaten Atlas",
                  "40.000",
                  ""
                ],
                [
                  "Managementfeekosten Delta",
                  "",
                  "40.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Managementfeebaten Atlas",
                  40000,
                  0
                ],
                [
                  "Managementfeekosten Delta",
                  0,
                  40000
                ]
              ],
              "why": ""
            },
            {
              "label": "Balans",
              "journal": [
                [
                  "Schuld aan Atlas",
                  "60.000",
                  ""
                ],
                [
                  "Vordering op Delta",
                  "",
                  "60.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Schuld aan Atlas",
                  60000,
                  0
                ],
                [
                  "Vordering op Delta",
                  0,
                  60000
                ]
              ],
              "why": ""
            }
          ],
          "why": "De onderlinge bedragen worden voor 100%, niet voor 80%, geëlimineerd."
        }
      ],
      "correct": 0,
      "explanation": [
        "Onderlinge baten en lasten vallen volledig weg. Onderlinge vorderingen en schulden eveneens.",
        "Balansposten en resultaatposten staan in afzonderlijke eliminatieboekingen."
      ],
      "pattern": "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het gevraagde onderwerp in de geconsolideerde winst-en-verliesrekening. Herken eerst welke gebeurtenis of correctie moet worden geboekt. Let op de beslissende gegevens: Begin met het resultaat van de moeder en herken welke dochterresultaten daarin al via de deelnemingswaardering zitten. Controleer het aandeel van derden, goodwillafschrijving en eventuele intercompany- en belastingcorrecties. Voorkom dat een al verwerkte mutatie nogmaals meetelt. Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten.",
      "refs": [
        "lok",
        "basis"
      ],
      "related": [
        4,
        10
      ],
      "variant": true,
      "guidance": {
        "lesson": "onderlinge-posten",
        "title": "Balansrelaties en onderlinge diensten apart elimineren",
        "task": "Welke twee afzonderlijke eliminatieboekingen verwijderen de managementfee uit de geconsolideerde winst-en-verliesrekening en de rekening-courantverhouding uit de geconsolideerde balans?",
        "rules": "Onderlinge opbrengsten en kosten worden bij integrale consolidatie volledig tegen elkaar geëlimineerd. Hetzelfde geldt voor onderlinge vorderingen en schulden. Gebruik daarvoor aparte boekingen: de eerste bevat uitsluitend resultaatposten, de tweede uitsluitend balansposten. Het kapitaalbelang beperkt deze eliminaties niet tot een evenredig deel.",
        "pattern": [
          "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het gevraagde onderwerp in de geconsolideerde winst-en-verliesrekening. Herken eerst welke gebeurtenis of correctie moet worden geboekt.",
          "Let op de beslissende gegevens: Begin met het resultaat van de moeder en herken welke dochterresultaten daarin al via de deelnemingswaardering zitten. Controleer het aandeel van derden, goodwillafschrijving en eventuele intercompany- en belastingcorrecties. Voorkom dat een al verwerkte mutatie nogmaals meetelt.",
          "Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten."
        ]
      },
      "caseTables": []
    },
    {
      "id": 6,
      "stage": 1,
      "title": "De voorraadtabel opbouwen",
      "type": "Voorraadtabel",
      "intro": "Onderstaande gegevens hebben uitsluitend betrekking op goederen die Atlas aan Delta levert.",
      "facts": [
        [
          "Belang Atlas in Delta",
          "80%; waardering NVW; integrale consolidatie."
        ],
        [
          "Goederenstroom",
          "Atlas → Delta"
        ],
        [
          "Voorraad bij Delta: begin / eind",
          "€ 150.000 / € 240.000, uitsluitend afkomstig van Atlas."
        ],
        [
          "Winst in verkoopprijs",
          "20%, in beide voorraden."
        ],
        [
          "Winstbelasting",
          "25%"
        ]
      ],
      "task": "Welke volledig ingevulde voorraadtabel hoort bij Atlas' downstreamlevering aan Delta bij NVW en een belang van 80%? Bereken beginstand, eindstand en mutatie vóór belasting.",
      "options": [
        {
          "table": {
            "headers": [
              "Datum",
              "Voorraad bij koper",
              "Niet-gerealiseerde intercompanywinst (100%)",
              "Interne correctie bij moeder (80%)",
              "Eliminatie t.l.v. aandeel derden (0%)",
              "Eliminatie t.l.v. geconsolideerd resultaat (20%)"
            ],
            "rows": [
              [
                "Begin boekjaar",
                "150.000",
                "30.000",
                "24.000",
                "0",
                "6.000"
              ],
              [
                "Eind boekjaar",
                "240.000",
                "48.000",
                "38.400",
                "0",
                "9.600"
              ],
              [
                "Mutatie",
                "90.000",
                "18.000",
                "14.400",
                "0",
                "3.600"
              ]
            ]
          },
          "why": "",
          "values": [
            [
              150000,
              30000,
              24000,
              0,
              6000
            ],
            [
              240000,
              48000,
              38400,
              0,
              9600
            ]
          ]
        },
        {
          "table": {
            "headers": [
              "Datum",
              "Voorraad bij koper",
              "Niet-gerealiseerde intercompanywinst (100%)",
              "Interne correctie bij moeder (80%)",
              "Eliminatie t.l.v. aandeel derden (20%)",
              "Eliminatie t.l.v. geconsolideerd resultaat (0%)"
            ],
            "rows": [
              [
                "Begin boekjaar",
                "150.000",
                "30.000",
                "24.000",
                "6.000",
                "0"
              ],
              [
                "Eind boekjaar",
                "240.000",
                "48.000",
                "38.400",
                "9.600",
                "0"
              ],
              [
                "Mutatie",
                "90.000",
                "18.000",
                "14.400",
                "3.600",
                "0"
              ]
            ]
          },
          "why": "Bij downstream komt het aanvullende deel niet ten laste van derden.",
          "values": [
            [
              150000,
              30000,
              24000,
              6000,
              0
            ],
            [
              240000,
              48000,
              38400,
              9600,
              0
            ]
          ]
        },
        {
          "table": {
            "headers": [
              "Datum",
              "Voorraad bij koper",
              "Niet-gerealiseerde intercompanywinst (100%)",
              "Interne correctie bij moeder (100%)",
              "Eliminatie t.l.v. aandeel derden (0%)",
              "Eliminatie t.l.v. geconsolideerd resultaat (0%)"
            ],
            "rows": [
              [
                "Begin boekjaar",
                "150.000",
                "30.000",
                "30.000",
                "0",
                "0"
              ],
              [
                "Eind boekjaar",
                "240.000",
                "48.000",
                "48.000",
                "0",
                "0"
              ],
              [
                "Mutatie",
                "90.000",
                "18.000",
                "18.000",
                "0",
                "0"
              ]
            ]
          },
          "why": "De enkelvoudige correctie bedraagt bij deze NVW-deelneming 80%, niet 100%.",
          "values": [
            [
              150000,
              30000,
              30000,
              0,
              0
            ],
            [
              240000,
              48000,
              48000,
              0,
              0
            ]
          ]
        },
        {
          "table": {
            "headers": [
              "Datum",
              "Voorraad bij koper",
              "Niet-gerealiseerde intercompanywinst (100%)",
              "Interne correctie bij moeder (80%)",
              "Eliminatie t.l.v. aandeel derden (0%)",
              "Eliminatie t.l.v. geconsolideerd resultaat (20%)"
            ],
            "rows": [
              [
                "Begin boekjaar",
                "150.000",
                "37.500",
                "30.000",
                "0",
                "7.500"
              ],
              [
                "Eind boekjaar",
                "240.000",
                "60.000",
                "48.000",
                "0",
                "12.000"
              ],
              [
                "Mutatie",
                "90.000",
                "22.500",
                "18.000",
                "0",
                "4.500"
              ]
            ]
          },
          "why": "De marge in de verkoopprijs is 20%, niet 25%.",
          "values": [
            [
              150000,
              37500,
              30000,
              0,
              7500
            ],
            [
              240000,
              60000,
              48000,
              0,
              12000
            ]
          ]
        }
      ],
      "correct": 0,
      "explanation": [
        "Winst begin: € 150.000 × 20% = € 30.000. Winst eind: € 240.000 × 20% = € 48.000.",
        "Interne correctie: 80% hiervan. Het restant van 20% gaat ten laste van het geconsolideerd resultaat; derden blijven buiten deze winstcorrectie.",
        "De mutatie in de winst is € 18.000: intern € 14.400 en aanvullend € 3.600."
      ],
      "pattern": "Herken de vraag: Een voorraadtabel vraagt om het verband tussen beginvoorraad, eindvoorraad, niet-gerealiseerde winst en de verdeling van de correctie. Let op de beslissende gegevens: Bepaal wie levert aan wie, waar de voorraad ligt en welk belang moeder in leverancier en afnemer heeft. Gebruik de winstopslag of marge met de juiste noemer. Houd beginstand, eindstand en toe- of afname apart; pas de gegeven waarderingsgrondslag en winstbelasting toe. Vorm van het antwoord: Vul de gevraagde rijen en kolommen in. Laat zien hoe de niet-gerealiseerde winst aansluit op interne correctie, aandeel derden en geconsolideerd resultaat.",
      "refs": [
        "down",
        "thdown",
        "kis"
      ],
      "related": [
        7,
        8,
        9,
        10
      ],
      "variant": true,
      "guidance": {
        "lesson": "downstream-nvw",
        "title": "Downstream NVW: interne en aanvullende correctie",
        "task": "Welke volledig ingevulde voorraadtabel hoort bij Atlas' downstreamlevering aan Delta bij NVW en een belang van 80%? Bereken beginstand, eindstand en mutatie vóór belasting.",
        "rules": "Bepaal de ongerealiseerde winst door beide voorraden tegen onderlinge prijs met de marge in die verkoopprijs te vermenigvuldigen. Bij downstream NVW is in deze syllabus de interne correctie gelijk aan het moederbelang. Het resterende deel wordt aanvullend ten laste van het geconsolideerde resultaat van de meerderheid geëlimineerd. De winst van de moeder wordt niet op derden afgewenteld.",
        "pattern": [
          "Herken de vraag: Een voorraadtabel vraagt om het verband tussen beginvoorraad, eindvoorraad, niet-gerealiseerde winst en de verdeling van de correctie.",
          "Let op de beslissende gegevens: Bepaal wie levert aan wie, waar de voorraad ligt en welk belang moeder in leverancier en afnemer heeft. Gebruik de winstopslag of marge met de juiste noemer. Houd beginstand, eindstand en toe- of afname apart; pas de gegeven waarderingsgrondslag en winstbelasting toe.",
          "Vorm van het antwoord: Vul de gevraagde rijen en kolommen in. Laat zien hoe de niet-gerealiseerde winst aansluit op interne correctie, aandeel derden en geconsolideerd resultaat."
        ]
      },
      "caseTables": [
        {
          "caption": "Voorraadgegevens en uitwerksjabloon bij deze vraag",
          "note": "De voorraadbedragen zijn gegeven tegen de onderlinge verkoopprijs. De lege winst- en correctiekolommen zijn uit te werken; zij bevatten niet het antwoord.",
          "headers": [
            "Datum",
            "Voorraad",
            "Niet-gerealiseerde intercompanywinst in voorraad",
            "Interne correctie",
            "Eliminatie t.l.v. aandeel derden",
            "Eliminatie t.l.v. geconsolideerd resultaat"
          ],
          "rows": [
            [
              "Percentage",
              "",
              "100%",
              "…%",
              "…%",
              "…%"
            ],
            [
              "Begin boekjaar",
              150000,
              "",
              "",
              "",
              ""
            ],
            [
              "Einde boekjaar",
              240000,
              "",
              "",
              "",
              ""
            ],
            [
              "Toe-/afname",
              "",
              "",
              "",
              "",
              ""
            ]
          ]
        }
      ]
    },
    {
      "id": 7,
      "stage": 1,
      "title": "De enkelvoudige correctie",
      "type": "Journaalpost",
      "intro": "Atlas verwerkt de mutatie van de intercompanywinst in haar enkelvoudige jaarrekening.",
      "facts": [
        [
          "Belang Atlas in Delta",
          "80%; waardering NVW; integrale consolidatie."
        ],
        [
          "Goederenstroom",
          "Atlas → Delta"
        ],
        [
          "Voorraad bij Delta: begin / eind",
          "€ 150.000 / € 240.000, uitsluitend afkomstig van Atlas."
        ],
        [
          "Winst in verkoopprijs",
          "20%, in beide voorraden."
        ],
        [
          "Winstbelasting",
          "25%"
        ]
      ],
      "task": "Welke twee interne journaalposten maakt Atlas voor de toename van de downstreamwinst in het boekjaar en het bijbehorende belastingeffect in haar enkelvoudige administratie?",
      "options": [
        {
          "journals": [
            {
              "label": "0. Interne winstcorrectie",
              "journal": [
                [
                  "Niet-gerealiseerde winst op transacties met deelnemingen",
                  "38.400",
                  ""
                ],
                [
                  "Overlopende passiva",
                  "",
                  "38.400"
                ]
              ],
              "journalNumeric": [
                [
                  "Niet-gerealiseerde winst op transacties met deelnemingen",
                  38400,
                  0
                ],
                [
                  "Overlopende passiva",
                  0,
                  38400
                ]
              ],
              "why": ""
            },
            {
              "label": "1. Belastingcorrectie",
              "journal": [
                [
                  "Voorziening belastingen",
                  "9.600",
                  ""
                ],
                [
                  "Belastinglast",
                  "",
                  "9.600"
                ]
              ],
              "journalNumeric": [
                [
                  "Voorziening belastingen",
                  9600,
                  0
                ],
                [
                  "Belastinglast",
                  0,
                  9600
                ]
              ],
              "why": ""
            }
          ],
          "why": "Dit gebruikt de eindstand in plaats van de mutatie."
        },
        {
          "journals": [
            {
              "label": "0. Interne winstcorrectie",
              "journal": [
                [
                  "Niet-gerealiseerde winst op transacties met deelnemingen",
                  "14.400",
                  ""
                ],
                [
                  "Overlopende passiva",
                  "",
                  "14.400"
                ]
              ],
              "journalNumeric": [
                [
                  "Niet-gerealiseerde winst op transacties met deelnemingen",
                  14400,
                  0
                ],
                [
                  "Overlopende passiva",
                  0,
                  14400
                ]
              ],
              "why": ""
            },
            {
              "label": "1. Belastingcorrectie",
              "journal": [
                [
                  "Voorziening belastingen",
                  "2.880",
                  ""
                ],
                [
                  "Belastinglast",
                  "",
                  "2.880"
                ]
              ],
              "journalNumeric": [
                [
                  "Voorziening belastingen",
                  2880,
                  0
                ],
                [
                  "Belastinglast",
                  0,
                  2880
                ]
              ],
              "why": ""
            }
          ],
          "why": "Het gegeven tarief is 25%."
        },
        {
          "journals": [
            {
              "label": "0. Interne winstcorrectie",
              "journal": [
                [
                  "Niet-gerealiseerde winst op transacties met deelnemingen",
                  "14.400",
                  ""
                ],
                [
                  "Overlopende passiva",
                  "",
                  "14.400"
                ]
              ],
              "journalNumeric": [
                [
                  "Niet-gerealiseerde winst op transacties met deelnemingen",
                  14400,
                  0
                ],
                [
                  "Overlopende passiva",
                  0,
                  14400
                ]
              ],
              "why": ""
            },
            {
              "label": "1. Belastingcorrectie",
              "journal": [
                [
                  "Voorziening belastingen",
                  "3.600",
                  ""
                ],
                [
                  "Belastinglast",
                  "",
                  "3.600"
                ]
              ],
              "journalNumeric": [
                [
                  "Voorziening belastingen",
                  3600,
                  0
                ],
                [
                  "Belastinglast",
                  0,
                  3600
                ]
              ],
              "why": ""
            }
          ],
          "why": ""
        },
        {
          "journals": [
            {
              "label": "0. Interne winstcorrectie",
              "journal": [
                [
                  "Niet-gerealiseerde winst op transacties met deelnemingen",
                  "18.000",
                  ""
                ],
                [
                  "Overlopende passiva",
                  "",
                  "18.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Niet-gerealiseerde winst op transacties met deelnemingen",
                  18000,
                  0
                ],
                [
                  "Overlopende passiva",
                  0,
                  18000
                ]
              ],
              "why": ""
            },
            {
              "label": "1. Belastingcorrectie",
              "journal": [
                [
                  "Voorziening belastingen",
                  "4.500",
                  ""
                ],
                [
                  "Belastinglast",
                  "",
                  "4.500"
                ]
              ],
              "journalNumeric": [
                [
                  "Voorziening belastingen",
                  4500,
                  0
                ],
                [
                  "Belastinglast",
                  0,
                  4500
                ]
              ],
              "why": ""
            }
          ],
          "why": "In de enkelvoudige correctie hoort 80% van de mutatie."
        }
      ],
      "correct": 2,
      "explanation": [
        "De toename van de intercompanywinst is € 18.000.",
        "De interne correctie is 80% × € 18.000 = € 14.400. De belastingcorrectie is 25% × € 14.400 = € 3.600."
      ],
      "pattern": "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het gevraagde onderwerp in de enkelvoudige jaarrekening. Herken eerst welke gebeurtenis of correctie moet worden geboekt. Let op de beslissende gegevens: Bepaal welke rekening toeneemt of afneemt en vanuit welke onderneming wordt geboekt. Zoek de waarderingsgrondslag, het belang en het tijdstip in de casus. Een eliminatie verwijdert een interne post; een enkelvoudige boeking verwerkt de gebeurtenis bij de onderneming zelf. Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten.",
      "refs": [
        "kis",
        "down"
      ],
      "related": [
        6,
        8
      ],
      "variant": true,
      "guidance": {
        "lesson": "downstream-nvw",
        "title": "De interne jaarmutatie bij de moeder boeken",
        "task": "Welke twee interne journaalposten maakt Atlas voor de toename van de downstreamwinst in het boekjaar en het bijbehorende belastingeffect in haar enkelvoudige administratie?",
        "rules": "Voor een resultaatcorrectie gebruik je de verandering in ongerealiseerde winst, niet alleen de eindstand. Bij downstream NVW wordt het moederdeel vóór belasting geboekt op niet-gerealiseerde winst tegenover overlopende passiva. De bijbehorende belastingcorrectie wordt afzonderlijk verwerkt. De extra consolidatiecorrectie behoort niet tot deze enkelvoudige boeking.",
        "pattern": [
          "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het gevraagde onderwerp in de enkelvoudige jaarrekening. Herken eerst welke gebeurtenis of correctie moet worden geboekt.",
          "Let op de beslissende gegevens: Bepaal welke rekening toeneemt of afneemt en vanuit welke onderneming wordt geboekt. Zoek de waarderingsgrondslag, het belang en het tijdstip in de casus. Een eliminatie verwijdert een interne post; een enkelvoudige boeking verwerkt de gebeurtenis bij de onderneming zelf.",
          "Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten."
        ]
      },
      "caseTables": [
        {
          "caption": "Ingevulde voorraadtabel bij deze zelfstandige casus",
          "note": "Gebruik deze hulptabel voor de gevraagde boeking of aansluiting. Alle winst- en correctiebedragen zijn vóór belasting; de mutatie is eindstand minus beginstand.",
          "headers": [
            "Datum",
            "Voorraad",
            "Niet-gerealiseerde intercompanywinst in voorraad",
            "Interne correctie",
            "Eliminatie t.l.v. aandeel derden",
            "Eliminatie t.l.v. geconsolideerd resultaat"
          ],
          "rows": [
            [
              "Percentage",
              "",
              "100%",
              "80%",
              "0%",
              "20%"
            ],
            [
              "Begin boekjaar",
              150000,
              30000,
              24000,
              "n.v.t.",
              6000
            ],
            [
              "Einde boekjaar",
              240000,
              48000,
              38400,
              "n.v.t.",
              9600
            ],
            [
              "Toename",
              90000,
              18000,
              14400,
              "n.v.t.",
              3600
            ]
          ],
          "completed": true
        }
      ]
    },
    {
      "id": 8,
      "stage": 1,
      "title": "Dezelfde goederen, afnemende voorraad",
      "type": "Journaalpost",
      "intro": "Dit is een afzonderlijke variant: de intercompanyvoorraad neemt nu af.",
      "facts": [
        [
          "Belang Atlas in Delta",
          "80%; waardering NVW; integrale consolidatie."
        ],
        [
          "Goederenstroom",
          "Atlas → Delta"
        ],
        [
          "Voorraad bij Delta: begin / eind",
          "€ 240.000 / € 150.000, uitsluitend afkomstig van Atlas."
        ],
        [
          "Winst in verkoopprijs",
          "20%, in beide voorraden."
        ],
        [
          "Winstbelasting",
          "25%"
        ]
      ],
      "task": "Welke interne journaalposten boekt Atlas voor de afname van de downstreamwinst? Gebruik in deze oefenvariant de rekening Gerealiseerde winst op transacties met deelnemingen en verwerk de belasting afzonderlijk.",
      "options": [
        {
          "journals": [
            {
              "label": "0. Interne winstcorrectie",
              "journal": [
                [
                  "Overlopende passiva",
                  "14.400",
                  ""
                ],
                [
                  "Gerealiseerde winst op transacties met deelnemingen",
                  "",
                  "14.400"
                ]
              ],
              "journalNumeric": [
                [
                  "Overlopende passiva",
                  14400,
                  0
                ],
                [
                  "Gerealiseerde winst op transacties met deelnemingen",
                  0,
                  14400
                ]
              ],
              "why": ""
            },
            {
              "label": "1. Belastingcorrectie",
              "journal": [
                [
                  "Belastinglast",
                  "3.600",
                  ""
                ],
                [
                  "Voorziening belastingen",
                  "",
                  "3.600"
                ]
              ],
              "journalNumeric": [
                [
                  "Belastinglast",
                  3600,
                  0
                ],
                [
                  "Voorziening belastingen",
                  0,
                  3600
                ]
              ],
              "why": ""
            }
          ],
          "why": ""
        },
        {
          "journals": [
            {
              "label": "0. Interne winstcorrectie",
              "journal": [
                [
                  "Overlopende passiva",
                  "18.000",
                  ""
                ],
                [
                  "Gerealiseerde winst op transacties met deelnemingen",
                  "",
                  "18.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Overlopende passiva",
                  18000,
                  0
                ],
                [
                  "Gerealiseerde winst op transacties met deelnemingen",
                  0,
                  18000
                ]
              ],
              "why": ""
            },
            {
              "label": "1. Belastingcorrectie",
              "journal": [
                [
                  "Belastinglast",
                  "4.500",
                  ""
                ],
                [
                  "Voorziening belastingen",
                  "",
                  "4.500"
                ]
              ],
              "journalNumeric": [
                [
                  "Belastinglast",
                  4500,
                  0
                ],
                [
                  "Voorziening belastingen",
                  0,
                  4500
                ]
              ],
              "why": ""
            }
          ],
          "why": "Je gebruikt 100% in plaats van het 80%-belang."
        },
        {
          "journals": [
            {
              "label": "0. Interne winstcorrectie",
              "journal": [
                [
                  "Overlopende passiva",
                  "14.400",
                  ""
                ],
                [
                  "Gerealiseerde winst op transacties met deelnemingen",
                  "",
                  "14.400"
                ]
              ],
              "journalNumeric": [
                [
                  "Overlopende passiva",
                  14400,
                  0
                ],
                [
                  "Gerealiseerde winst op transacties met deelnemingen",
                  0,
                  14400
                ]
              ],
              "why": ""
            },
            {
              "label": "1. Belastingcorrectie",
              "journal": [
                [
                  "Belastinglast",
                  "2.880",
                  ""
                ],
                [
                  "Voorziening belastingen",
                  "",
                  "2.880"
                ]
              ],
              "journalNumeric": [
                [
                  "Belastinglast",
                  2880,
                  0
                ],
                [
                  "Voorziening belastingen",
                  0,
                  2880
                ]
              ],
              "why": ""
            }
          ],
          "why": "De belasting is 25%, niet 20%."
        },
        {
          "journals": [
            {
              "label": "0. Interne winstcorrectie",
              "journal": [
                [
                  "Niet-gerealiseerde winst op transacties met deelnemingen",
                  "14.400",
                  ""
                ],
                [
                  "Overlopende passiva",
                  "",
                  "14.400"
                ]
              ],
              "journalNumeric": [
                [
                  "Niet-gerealiseerde winst op transacties met deelnemingen",
                  14400,
                  0
                ],
                [
                  "Overlopende passiva",
                  0,
                  14400
                ]
              ],
              "why": ""
            },
            {
              "label": "1. Belastingcorrectie",
              "journal": [
                [
                  "Voorziening belastingen",
                  "3.600",
                  ""
                ],
                [
                  "Belastinglast",
                  "",
                  "3.600"
                ]
              ],
              "journalNumeric": [
                [
                  "Voorziening belastingen",
                  3600,
                  0
                ],
                [
                  "Belastinglast",
                  0,
                  3600
                ]
              ],
              "why": ""
            }
          ],
          "why": "Een afname maakt eerder uitgestelde winst vrij; de richting is dus omgekeerd."
        }
      ],
      "correct": 0,
      "explanation": [
        "De winst in de voorraad daalt van € 48.000 naar € 30.000.",
        "80% × € 18.000 = € 14.400 komt vrij. De bijbehorende belastingcorrectie is € 3.600.",
        "Deze variant gebruikt “Gerealiseerde winst”, zoals de genoemde Nyenrode-uitwerkingen. Het college-Excel gebruikt bij afname de creditzijde van “Niet gerealiseerde ICW”; de rekeningbenaming is in deze vraag dus bronafhankelijk."
      ],
      "pattern": "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het gevraagde onderwerp. Herken eerst welke gebeurtenis of correctie moet worden geboekt. Let op de beslissende gegevens: Bepaal welke rekening toeneemt of afneemt en vanuit welke onderneming wordt geboekt. Zoek de waarderingsgrondslag, het belang en het tijdstip in de casus. Een eliminatie verwijdert een interne post; een enkelvoudige boeking verwerkt de gebeurtenis bij de onderneming zelf. Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten.",
      "refs": [
        "brug",
        "down",
        "thdec"
      ],
      "related": [
        7,
        13,
        24
      ],
      "variant": true,
      "guidance": {
        "lesson": "downstream-nvw",
        "title": "Vrijval van eerder uitgestelde downstreamwinst",
        "task": "Welke interne journaalposten boekt Atlas voor de afname van de downstreamwinst? Gebruik in deze oefenvariant de rekening Gerealiseerde winst op transacties met deelnemingen en verwerk de belasting afzonderlijk.",
        "rules": "Een afname van ongerealiseerde winst geeft een eerder uitgesteld deel vrij. De overlopende passiefpost neemt af en de winst neemt toe. Deze oefenvariant gebruikt daarvoor de rekening Gerealiseerde winst; in het college-Excel komt ook creditering van Niet-gerealiseerde ICW voor. De vraag schrijft de rekeningnaam daarom expliciet voor. De belastingboeking draait eveneens om.",
        "pattern": [
          "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het gevraagde onderwerp. Herken eerst welke gebeurtenis of correctie moet worden geboekt.",
          "Let op de beslissende gegevens: Bepaal welke rekening toeneemt of afneemt en vanuit welke onderneming wordt geboekt. Zoek de waarderingsgrondslag, het belang en het tijdstip in de casus. Een eliminatie verwijdert een interne post; een enkelvoudige boeking verwerkt de gebeurtenis bij de onderneming zelf.",
          "Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten."
        ]
      },
      "caseTables": [
        {
          "caption": "Ingevulde voorraadtabel bij deze zelfstandige casus",
          "note": "Gebruik deze hulptabel voor de gevraagde boeking of aansluiting. Alle winst- en correctiebedragen zijn vóór belasting; de mutatie is eindstand minus beginstand.",
          "headers": [
            "Datum",
            "Voorraad",
            "Niet-gerealiseerde intercompanywinst in voorraad",
            "Interne correctie",
            "Eliminatie t.l.v. aandeel derden",
            "Eliminatie t.l.v. geconsolideerd resultaat"
          ],
          "rows": [
            [
              "Percentage",
              "",
              "100%",
              "80%",
              "0%",
              "20%"
            ],
            [
              "Begin boekjaar",
              240000,
              48000,
              38400,
              "n.v.t.",
              9600
            ],
            [
              "Einde boekjaar",
              150000,
              30000,
              24000,
              "n.v.t.",
              6000
            ],
            [
              "Afname",
              -90000,
              -18000,
              -14400,
              "n.v.t.",
              -3600
            ]
          ],
          "completed": true
        }
      ]
    },
    {
      "id": 9,
      "stage": 1,
      "title": "Eindvoorraad én beginstand",
      "type": "Journaalpost",
      "intro": "Atlas heeft alle enkelvoudige correcties al geboekt. Maak uitsluitend de balanseliminaties voor de goederenstroom.",
      "facts": [
        [
          "Belang Atlas in Delta",
          "80%; waardering NVW; integrale consolidatie."
        ],
        [
          "Goederenstroom",
          "Atlas → Delta"
        ],
        [
          "Voorraad bij Delta: begin / eind",
          "€ 150.000 / € 240.000, uitsluitend afkomstig van Atlas."
        ],
        [
          "Winst in verkoopprijs",
          "20%, in beide voorraden."
        ],
        [
          "Winstbelasting",
          "25%"
        ]
      ],
      "task": "Welke twee aanvullende balanseliminaties maakt Atlas voor deze downstreamstroom: het uitvoegen van de winst uit de eindvoorraad en het invoegen van het aanvullende moederdeel uit de beginvoorraad, nadat de interne correcties zijn geboekt?",
      "options": [
        {
          "journals": [
            {
              "label": "Uitvoegen winst eindvoorraad",
              "journal": [
                [
                  "Overlopende passiva",
                  "38.400",
                  ""
                ],
                [
                  "Resultaat boekjaar",
                  "7.200,00",
                  ""
                ],
                [
                  "Voorziening belastingen",
                  "2.400,00",
                  ""
                ],
                [
                  "Voorraad",
                  "",
                  "48.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Overlopende passiva",
                  38400,
                  0
                ],
                [
                  "Resultaat boekjaar",
                  7199.999999999998,
                  0
                ],
                [
                  "Voorziening belastingen",
                  2399.9999999999995,
                  0
                ],
                [
                  "Voorraad",
                  0,
                  48000
                ]
              ],
              "why": ""
            },
            {
              "label": "Invoegen beginstand",
              "journal": [
                [
                  "Overige reserves",
                  "4.500,00",
                  ""
                ],
                [
                  "Resultaat boekjaar",
                  "",
                  "4.500,00"
                ]
              ],
              "journalNumeric": [
                [
                  "Overige reserves",
                  4499.999999999999,
                  0
                ],
                [
                  "Resultaat boekjaar",
                  0,
                  4499.999999999999
                ]
              ],
              "why": ""
            }
          ],
          "why": ""
        },
        {
          "journals": [
            {
              "label": "Uitvoegen winst eindvoorraad",
              "journal": [
                [
                  "Overlopende passiva",
                  "38.400",
                  ""
                ],
                [
                  "Resultaat boekjaar",
                  "7.200,00",
                  ""
                ],
                [
                  "Voorziening belastingen",
                  "2.400,00",
                  ""
                ],
                [
                  "Voorraad",
                  "",
                  "48.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Overlopende passiva",
                  38400,
                  0
                ],
                [
                  "Resultaat boekjaar",
                  7199.999999999998,
                  0
                ],
                [
                  "Voorziening belastingen",
                  2399.9999999999995,
                  0
                ],
                [
                  "Voorraad",
                  0,
                  48000
                ]
              ],
              "why": ""
            },
            {
              "label": "Invoegen beginstand",
              "journal": [
                [
                  "Overige reserves",
                  "7.200,00",
                  ""
                ],
                [
                  "Resultaat boekjaar",
                  "",
                  "7.200,00"
                ]
              ],
              "journalNumeric": [
                [
                  "Overige reserves",
                  7199.999999999998,
                  0
                ],
                [
                  "Resultaat boekjaar",
                  0,
                  7199.999999999998
                ]
              ],
              "why": ""
            }
          ],
          "why": "De invoegboeking gebruikt de winst in de beginvoorraad, niet in de eindvoorraad."
        },
        {
          "journals": [
            {
              "label": "Uitvoegen winst eindvoorraad",
              "journal": [
                [
                  "Overlopende passiva",
                  "14.400",
                  ""
                ],
                [
                  "Resultaat boekjaar",
                  "2.700,00",
                  ""
                ],
                [
                  "Voorziening belastingen",
                  "900,00",
                  ""
                ],
                [
                  "Voorraad",
                  "",
                  "18.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Overlopende passiva",
                  14400,
                  0
                ],
                [
                  "Resultaat boekjaar",
                  2699.999999999999,
                  0
                ],
                [
                  "Voorziening belastingen",
                  899.9999999999998,
                  0
                ],
                [
                  "Voorraad",
                  0,
                  18000
                ]
              ],
              "why": ""
            },
            {
              "label": "Invoegen beginstand",
              "journal": [
                [
                  "Overige reserves",
                  "",
                  ""
                ],
                [
                  "Resultaat boekjaar",
                  "",
                  ""
                ]
              ],
              "journalNumeric": [
                [
                  "Overige reserves",
                  0,
                  0
                ],
                [
                  "Resultaat boekjaar",
                  0,
                  0
                ]
              ],
              "why": ""
            }
          ],
          "why": "De balanscorrectie gebruikt de eindstand; de beginstand wordt afzonderlijk verwerkt."
        },
        {
          "journals": [
            {
              "label": "Uitvoegen winst eindvoorraad",
              "journal": [
                [
                  "Overlopende passiva",
                  "38.400",
                  ""
                ],
                [
                  "Resultaat boekjaar",
                  "7.680,00",
                  ""
                ],
                [
                  "Voorziening belastingen",
                  "1.920,00",
                  ""
                ],
                [
                  "Voorraad",
                  "",
                  "48.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Overlopende passiva",
                  38400,
                  0
                ],
                [
                  "Resultaat boekjaar",
                  7679.999999999999,
                  0
                ],
                [
                  "Voorziening belastingen",
                  1919.9999999999998,
                  0
                ],
                [
                  "Voorraad",
                  0,
                  48000
                ]
              ],
              "why": ""
            },
            {
              "label": "Invoegen beginstand",
              "journal": [
                [
                  "Overige reserves",
                  "4.800,00",
                  ""
                ],
                [
                  "Resultaat boekjaar",
                  "",
                  "4.800,00"
                ]
              ],
              "journalNumeric": [
                [
                  "Overige reserves",
                  4799.999999999999,
                  0
                ],
                [
                  "Resultaat boekjaar",
                  0,
                  4799.999999999999
                ]
              ],
              "why": ""
            }
          ],
          "why": "Het tarief is 25%."
        }
      ],
      "correct": 0,
      "explanation": [
        "Eindvoorraad: overlopende passiva € 38.400; aanvullend resultaat € 48.000 × 20% × 75% = € 7.200; extra belastinglatentie € 2.400. Voorraad credit € 48.000.",
        "Beginstand: € 30.000 × 20% × 75% = € 4.500 van overige reserves naar resultaat boekjaar.",
        "Netto daalt het geconsolideerd resultaat ten opzichte van het al gecorrigeerde enkelvoudige resultaat met € 2.700."
      ],
      "pattern": "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het gevraagde onderwerp bij de consolidatie. Herken eerst welke gebeurtenis of correctie moet worden geboekt. Let op de beslissende gegevens: Bepaal wie levert aan wie, waar de voorraad ligt en welk belang moeder in leverancier en afnemer heeft. Gebruik de winstopslag of marge met de juiste noemer. Houd beginstand, eindstand en toe- of afname apart; pas de gegeven waarderingsgrondslag en winstbelasting toe. Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten.",
      "refs": [
        "old",
        "down",
        "thdown"
      ],
      "related": [
        6,
        10,
        23
      ],
      "variant": true,
      "guidance": {
        "lesson": "downstream-nvw",
        "title": "Balans: eindvoorraad uitvoeren en beginwinst invoegen",
        "task": "Welke twee aanvullende balanseliminaties maakt Atlas voor deze downstreamstroom: het uitvoegen van de winst uit de eindvoorraad en het invoegen van het aanvullende moederdeel uit de beginvoorraad, nadat de interne correcties zijn geboekt?",
        "rules": "De balanscorrectie verwijdert de volledige winst uit de eindvoorraad en neemt de reeds geboekte overlopende passiefpost terug. Alleen het nog niet intern gecorrigeerde deel raakt aanvullend resultaat boekjaar en belastinglatentie. De netto aanvullende winst uit de beginvoorraad wordt afzonderlijk van overige reserves naar resultaat boekjaar gebracht. Beide boekingen bevatten uitsluitend balansposten.",
        "pattern": [
          "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het gevraagde onderwerp bij de consolidatie. Herken eerst welke gebeurtenis of correctie moet worden geboekt.",
          "Let op de beslissende gegevens: Bepaal wie levert aan wie, waar de voorraad ligt en welk belang moeder in leverancier en afnemer heeft. Gebruik de winstopslag of marge met de juiste noemer. Houd beginstand, eindstand en toe- of afname apart; pas de gegeven waarderingsgrondslag en winstbelasting toe.",
          "Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten."
        ]
      },
      "caseTables": [
        {
          "caption": "Ingevulde voorraadtabel bij deze zelfstandige casus",
          "note": "Gebruik deze hulptabel voor de gevraagde boeking of aansluiting. Alle winst- en correctiebedragen zijn vóór belasting; de mutatie is eindstand minus beginstand.",
          "headers": [
            "Datum",
            "Voorraad",
            "Niet-gerealiseerde intercompanywinst in voorraad",
            "Interne correctie",
            "Eliminatie t.l.v. aandeel derden",
            "Eliminatie t.l.v. geconsolideerd resultaat"
          ],
          "rows": [
            [
              "Percentage",
              "",
              "100%",
              "80%",
              "0%",
              "20%"
            ],
            [
              "Begin boekjaar",
              150000,
              30000,
              24000,
              "n.v.t.",
              6000
            ],
            [
              "Einde boekjaar",
              240000,
              48000,
              38400,
              "n.v.t.",
              9600
            ],
            [
              "Toename",
              90000,
              18000,
              14400,
              "n.v.t.",
              3600
            ]
          ],
          "completed": true
        }
      ]
    },
    {
      "id": 10,
      "stage": 1,
      "title": "De winst-en-verliesrekening aanpassen",
      "type": "Journaalpost",
      "intro": "Gebruik de W&V-aanpak uit de kolom THIEU: de volledige onderlinge omzet wordt eerst geëlimineerd, daarna de voorraadmutatie.",
      "facts": [
        [
          "Belang Atlas in Delta",
          "80%; waardering NVW; integrale consolidatie."
        ],
        [
          "Goederenstroom",
          "Atlas → Delta"
        ],
        [
          "Voorraad bij Delta: begin / eind",
          "€ 150.000 / € 240.000, uitsluitend afkomstig van Atlas."
        ],
        [
          "Winst in verkoopprijs",
          "20%, in beide voorraden."
        ],
        [
          "Winstbelasting",
          "25%"
        ],
        [
          "Onderlinge leveringen in het boekjaar",
          "€ 1.200.000"
        ],
        [
          "Enkelvoudige correcties",
          "Zijn al verwerkt."
        ]
      ],
      "task": "Welke twee W&V-eliminaties volgen de hier gevraagde college-aanpak: eerst de volledige onderlinge omzet van € 1.200.000 elimineren en daarna uitsluitend de mutatie in de ongerealiseerde voorraadwinst, na de al geboekte interne correctie?",
      "options": [
        {
          "journals": [
            {
              "label": "Onderlinge omzet",
              "journal": [
                [
                  "Omzet Atlas",
                  "1.110.000",
                  ""
                ],
                [
                  "Kostprijs omzet Delta",
                  "",
                  "1.110.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Omzet Atlas",
                  1110000,
                  0
                ],
                [
                  "Kostprijs omzet Delta",
                  0,
                  1110000
                ]
              ],
              "why": ""
            },
            {
              "label": "Voorraadmutatie",
              "journal": [
                [
                  "Kostprijs omzet Delta",
                  "18.000",
                  ""
                ],
                [
                  "Niet gerealiseerde ICW",
                  "",
                  "14.400"
                ],
                [
                  "Resultaat na belasting",
                  "",
                  "2.700"
                ],
                [
                  "Belastinglast",
                  "",
                  "900"
                ]
              ],
              "journalNumeric": [
                [
                  "Kostprijs omzet Delta",
                  18000,
                  0
                ],
                [
                  "Niet gerealiseerde ICW",
                  0,
                  14400
                ],
                [
                  "Resultaat na belasting",
                  0,
                  2700
                ],
                [
                  "Belastinglast",
                  0,
                  900
                ]
              ],
              "why": ""
            }
          ],
          "why": "Bij deze aanpak wordt eerst de volledige omzet geëlimineerd. De syllabus-splitsing vereist een andere tweede post."
        },
        {
          "journals": [
            {
              "label": "Onderlinge omzet",
              "journal": [
                [
                  "Omzet Atlas",
                  "1.200.000",
                  ""
                ],
                [
                  "Kostprijs omzet Delta",
                  "",
                  "1.200.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Omzet Atlas",
                  1200000,
                  0
                ],
                [
                  "Kostprijs omzet Delta",
                  0,
                  1200000
                ]
              ],
              "why": ""
            },
            {
              "label": "Voorraadmutatie",
              "journal": [
                [
                  "Kostprijs omzet Delta",
                  "18.000",
                  ""
                ],
                [
                  "Niet gerealiseerde ICW",
                  "",
                  "14.400"
                ],
                [
                  "Resultaat na belasting",
                  "",
                  "3.600"
                ]
              ],
              "journalNumeric": [
                [
                  "Kostprijs omzet Delta",
                  18000,
                  0
                ],
                [
                  "Niet gerealiseerde ICW",
                  0,
                  14400
                ],
                [
                  "Resultaat na belasting",
                  0,
                  3600
                ]
              ],
              "why": ""
            }
          ],
          "why": "Het aanvullende bedrag moet worden gesplitst in resultaat na belasting en belastinglast."
        },
        {
          "journals": [
            {
              "label": "Onderlinge omzet",
              "journal": [
                [
                  "Omzet Atlas",
                  "1.200.000",
                  ""
                ],
                [
                  "Kostprijs omzet Delta",
                  "",
                  "1.200.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Omzet Atlas",
                  1200000,
                  0
                ],
                [
                  "Kostprijs omzet Delta",
                  0,
                  1200000
                ]
              ],
              "why": ""
            },
            {
              "label": "Voorraadmutatie",
              "journal": [
                [
                  "Kostprijs omzet Delta",
                  "18.000",
                  ""
                ],
                [
                  "Niet gerealiseerde ICW",
                  "",
                  "14.400"
                ],
                [
                  "Aandeel derden",
                  "",
                  "2.700"
                ],
                [
                  "Belastinglast",
                  "",
                  "900"
                ]
              ],
              "journalNumeric": [
                [
                  "Kostprijs omzet Delta",
                  18000,
                  0
                ],
                [
                  "Niet gerealiseerde ICW",
                  0,
                  14400
                ],
                [
                  "Aandeel derden",
                  0,
                  2700
                ],
                [
                  "Belastinglast",
                  0,
                  900
                ]
              ],
              "why": ""
            }
          ],
          "why": "Downstream: het aanvullende resultaat gaat niet naar aandeel derden."
        },
        {
          "journals": [
            {
              "label": "Onderlinge omzet",
              "journal": [
                [
                  "Omzet Atlas",
                  "1.200.000",
                  ""
                ],
                [
                  "Kostprijs omzet Delta",
                  "",
                  "1.200.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Omzet Atlas",
                  1200000,
                  0
                ],
                [
                  "Kostprijs omzet Delta",
                  0,
                  1200000
                ]
              ],
              "why": ""
            },
            {
              "label": "Voorraadmutatie",
              "journal": [
                [
                  "Kostprijs omzet Delta",
                  "18.000",
                  ""
                ],
                [
                  "Niet gerealiseerde ICW",
                  "",
                  "14.400"
                ],
                [
                  "Resultaat na belasting",
                  "",
                  "2.700"
                ],
                [
                  "Belastinglast",
                  "",
                  "900"
                ]
              ],
              "journalNumeric": [
                [
                  "Kostprijs omzet Delta",
                  18000,
                  0
                ],
                [
                  "Niet gerealiseerde ICW",
                  0,
                  14400
                ],
                [
                  "Resultaat na belasting",
                  0,
                  2700
                ],
                [
                  "Belastinglast",
                  0,
                  900
                ]
              ],
              "why": ""
            }
          ],
          "why": ""
        }
      ],
      "correct": 3,
      "explanation": [
        "Boek eerst Omzet aan Kostprijs omzet voor € 1.200.000.",
        "De voorraadmutatie van € 18.000 verhoogt de geconsolideerde kostprijs. Credit staan de enkelvoudige correctie van € 14.400 en het aanvullende deel: € 2.700 resultaat en € 900 belasting.",
        "Dit is de Thieu-aanpak. De syllabus splitst bij voorraadtoename de omzet in doorlevering en voorraadtoename; beide boekingssets mogen niet worden gemengd."
      ],
      "pattern": "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het gevraagde onderwerp in de geconsolideerde winst-en-verliesrekening. Herken eerst welke gebeurtenis of correctie moet worden geboekt. Let op de beslissende gegevens: Bepaal welke rekening toeneemt of afneemt en vanuit welke onderneming wordt geboekt. Zoek de waarderingsgrondslag, het belang en het tijdstip in de casus. Een eliminatie verwijdert een interne post; een enkelvoudige boeking verwerkt de gebeurtenis bij de onderneming zelf. Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten.",
      "refs": [
        "thdown",
        "down"
      ],
      "related": [
        9,
        25,
        29
      ],
      "variant": true,
      "guidance": {
        "lesson": "ic-boekingsmethoden",
        "title": "College-aanpak: volledige omzet en winstmutatie",
        "task": "Welke twee W&V-eliminaties volgen de hier gevraagde college-aanpak: eerst de volledige onderlinge omzet van € 1.200.000 elimineren en daarna uitsluitend de mutatie in de ongerealiseerde voorraadwinst, na de al geboekte interne correctie?",
        "rules": "Deze vraag gebruikt de collegepresentatie waarin eerst de volledige onderlinge omzet tegenover kostprijs wordt geëlimineerd. Daarna wordt de kostprijs gecorrigeerd voor de mutatie in ongerealiseerde winst. Bij downstream NVW bestaat de tegenzijde uit de reeds geboekte interne winstcorrectie en het aanvullende resultaat- en belastingdeel. De syllabus kent daarnaast een splitsing in doorlevering en voorraadgroei; meng beide presentaties niet.",
        "pattern": [
          "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het gevraagde onderwerp in de geconsolideerde winst-en-verliesrekening. Herken eerst welke gebeurtenis of correctie moet worden geboekt.",
          "Let op de beslissende gegevens: Bepaal welke rekening toeneemt of afneemt en vanuit welke onderneming wordt geboekt. Zoek de waarderingsgrondslag, het belang en het tijdstip in de casus. Een eliminatie verwijdert een interne post; een enkelvoudige boeking verwerkt de gebeurtenis bij de onderneming zelf.",
          "Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten."
        ]
      },
      "caseTables": [
        {
          "caption": "Ingevulde voorraadtabel bij deze zelfstandige casus",
          "note": "Gebruik deze hulptabel voor de gevraagde boeking of aansluiting. Alle winst- en correctiebedragen zijn vóór belasting; de mutatie is eindstand minus beginstand.",
          "headers": [
            "Datum",
            "Voorraad",
            "Niet-gerealiseerde intercompanywinst in voorraad",
            "Interne correctie",
            "Eliminatie t.l.v. aandeel derden",
            "Eliminatie t.l.v. geconsolideerd resultaat"
          ],
          "rows": [
            [
              "Percentage",
              "",
              "100%",
              "80%",
              "0%",
              "20%"
            ],
            [
              "Begin boekjaar",
              150000,
              30000,
              24000,
              "n.v.t.",
              6000
            ],
            [
              "Einde boekjaar",
              240000,
              48000,
              38400,
              "n.v.t.",
              9600
            ],
            [
              "Toename",
              90000,
              18000,
              14400,
              "n.v.t.",
              3600
            ]
          ],
          "completed": true
        }
      ]
    },
    {
      "id": 11,
      "stage": 2,
      "title": "Een andere verkoper",
      "type": "Voorraadtabel",
      "intro": "De goederen worden nu verkocht door Delta aan Atlas.",
      "facts": [
        [
          "Belang Atlas in Delta",
          "75%; waardering NVW; integrale consolidatie."
        ],
        [
          "Goederenstroom",
          "Delta → Atlas"
        ],
        [
          "Voorraad bij Atlas: begin / eind",
          "€ 160.000 / € 240.000, uitsluitend afkomstig van Delta."
        ],
        [
          "Winst in verkoopprijs",
          "25%, in beide voorraden."
        ],
        [
          "Winstbelasting",
          "25%"
        ]
      ],
      "task": "Welke voorraadtabel is juist voor Delta's upstreamlevering aan Atlas bij NVW, een 75%-belang en de gegeven 25%-marge in de verkoopprijs? Toon alle winstbedragen vóór belasting.",
      "options": [
        {
          "table": {
            "headers": [
              "Datum",
              "Voorraad bij koper",
              "Niet-gerealiseerde intercompanywinst (100%)",
              "Interne correctie bij moeder (75%)",
              "Eliminatie t.l.v. aandeel derden (0%)",
              "Eliminatie t.l.v. geconsolideerd resultaat (25%)"
            ],
            "rows": [
              [
                "Begin boekjaar",
                "160.000",
                "40.000",
                "30.000",
                "0",
                "10.000"
              ],
              [
                "Eind boekjaar",
                "240.000",
                "60.000",
                "45.000",
                "0",
                "15.000"
              ],
              [
                "Mutatie",
                "80.000",
                "20.000",
                "15.000",
                "0",
                "5.000"
              ]
            ]
          },
          "why": "Dat is de verdeling voor downstream, niet upstream.",
          "values": [
            [
              160000,
              40000,
              30000,
              0,
              10000
            ],
            [
              240000,
              60000,
              45000,
              0,
              15000
            ]
          ]
        },
        {
          "table": {
            "headers": [
              "Datum",
              "Voorraad bij koper",
              "Niet-gerealiseerde intercompanywinst (100%)",
              "Interne correctie bij moeder (75%)",
              "Eliminatie t.l.v. aandeel derden (25%)",
              "Eliminatie t.l.v. geconsolideerd resultaat (0%)"
            ],
            "rows": [
              [
                "Begin boekjaar",
                "160.000",
                "40.000",
                "30.000",
                "10.000",
                "0"
              ],
              [
                "Eind boekjaar",
                "240.000",
                "60.000",
                "45.000",
                "15.000",
                "0"
              ],
              [
                "Mutatie",
                "80.000",
                "20.000",
                "15.000",
                "5.000",
                "0"
              ]
            ]
          },
          "why": "",
          "values": [
            [
              160000,
              40000,
              30000,
              10000,
              0
            ],
            [
              240000,
              60000,
              45000,
              15000,
              0
            ]
          ]
        },
        {
          "table": {
            "headers": [
              "Datum",
              "Voorraad bij koper",
              "Niet-gerealiseerde intercompanywinst (100%)",
              "Interne correctie bij moeder (75%)",
              "Eliminatie t.l.v. aandeel derden (25%)",
              "Eliminatie t.l.v. geconsolideerd resultaat (0%)"
            ],
            "rows": [
              [
                "Begin boekjaar",
                "160.000",
                "32.000",
                "24.000",
                "8.000",
                "0"
              ],
              [
                "Eind boekjaar",
                "240.000",
                "48.000",
                "36.000",
                "12.000",
                "0"
              ],
              [
                "Mutatie",
                "80.000",
                "16.000",
                "12.000",
                "4.000",
                "0"
              ]
            ]
          },
          "why": "Het gegeven winstpercentage in de verkoopprijs is 25%.",
          "values": [
            [
              160000,
              32000,
              24000,
              8000,
              0
            ],
            [
              240000,
              48000,
              36000,
              12000,
              0
            ]
          ]
        },
        {
          "table": {
            "headers": [
              "Datum",
              "Voorraad bij koper",
              "Niet-gerealiseerde intercompanywinst (100%)",
              "Interne correctie bij moeder (100%)",
              "Eliminatie t.l.v. aandeel derden (0%)",
              "Eliminatie t.l.v. geconsolideerd resultaat (0%)"
            ],
            "rows": [
              [
                "Begin boekjaar",
                "160.000",
                "40.000",
                "40.000",
                "0",
                "0"
              ],
              [
                "Eind boekjaar",
                "240.000",
                "60.000",
                "60.000",
                "0",
                "0"
              ],
              [
                "Mutatie",
                "80.000",
                "20.000",
                "20.000",
                "0",
                "0"
              ]
            ]
          },
          "why": "Atlas houdt geen 100% van Delta.",
          "values": [
            [
              160000,
              40000,
              40000,
              0,
              0
            ],
            [
              240000,
              60000,
              60000,
              0,
              0
            ]
          ]
        }
      ],
      "correct": 1,
      "explanation": [
        "Winst begin € 40.000, winst eind € 60.000, toename € 20.000.",
        "Intern wordt 75% gecorrigeerd; de resterende 25% komt ten laste van derden. Er is geen aanvullende correctie ten laste van het resultaat van de meerderheid."
      ],
      "pattern": "Herken de vraag: Een voorraadtabel vraagt om het verband tussen beginvoorraad, eindvoorraad, niet-gerealiseerde winst en de verdeling van de correctie. Let op de beslissende gegevens: Bepaal wie levert aan wie, waar de voorraad ligt en welk belang moeder in leverancier en afnemer heeft. Gebruik de winstopslag of marge met de juiste noemer. Houd beginstand, eindstand en toe- of afname apart; pas de gegeven waarderingsgrondslag en winstbelasting toe. Vorm van het antwoord: Vul de gevraagde rijen en kolommen in. Laat zien hoe de niet-gerealiseerde winst aansluit op interne correctie, aandeel derden en geconsolideerd resultaat.",
      "refs": [
        "up",
        "thup"
      ],
      "related": [
        12,
        13,
        14,
        15
      ],
      "variant": true,
      "guidance": {
        "lesson": "upstream-nvw",
        "title": "Upstream NVW: de verkoper bepaalt het derdenaandeel",
        "task": "Welke voorraadtabel is juist voor Delta's upstreamlevering aan Atlas bij NVW, een 75%-belang en de gegeven 25%-marge in de verkoopprijs? Toon alle winstbedragen vóór belasting.",
        "rules": "De verkopende dochter heeft de nog niet gerealiseerde winst verantwoord. Bij upstream NVW corrigeert de moeder intern haar aandeel in die winst. Het resterende deel betreft het minderheidsbelang in de verkoper en wordt bij consolidatie aan derden toegerekend. Na de interne correctie is in deze systematiek geen aanvullend meerderheidsdeel nodig.",
        "pattern": [
          "Herken de vraag: Een voorraadtabel vraagt om het verband tussen beginvoorraad, eindvoorraad, niet-gerealiseerde winst en de verdeling van de correctie.",
          "Let op de beslissende gegevens: Bepaal wie levert aan wie, waar de voorraad ligt en welk belang moeder in leverancier en afnemer heeft. Gebruik de winstopslag of marge met de juiste noemer. Houd beginstand, eindstand en toe- of afname apart; pas de gegeven waarderingsgrondslag en winstbelasting toe.",
          "Vorm van het antwoord: Vul de gevraagde rijen en kolommen in. Laat zien hoe de niet-gerealiseerde winst aansluit op interne correctie, aandeel derden en geconsolideerd resultaat."
        ]
      },
      "caseTables": [
        {
          "caption": "Voorraadgegevens en uitwerksjabloon bij deze vraag",
          "note": "De voorraadbedragen zijn gegeven tegen de onderlinge verkoopprijs. De lege winst- en correctiekolommen zijn uit te werken; zij bevatten niet het antwoord.",
          "headers": [
            "Datum",
            "Voorraad",
            "Niet-gerealiseerde intercompanywinst in voorraad",
            "Interne correctie",
            "Eliminatie t.l.v. aandeel derden",
            "Eliminatie t.l.v. geconsolideerd resultaat"
          ],
          "rows": [
            [
              "Percentage",
              "",
              "100%",
              "…%",
              "…%",
              "…%"
            ],
            [
              "Begin boekjaar",
              160000,
              "",
              "",
              "",
              ""
            ],
            [
              "Einde boekjaar",
              240000,
              "",
              "",
              "",
              ""
            ],
            [
              "Toe-/afname",
              "",
              "",
              "",
              "",
              ""
            ]
          ]
        }
      ]
    },
    {
      "id": 12,
      "stage": 2,
      "title": "Upstream in de enkelvoudige jaarrekening",
      "type": "Journaalpost",
      "intro": "Atlas heeft het reguliere resultaat deelneming al verwerkt. Alleen de intercompanycorrectie ontbreekt nog.",
      "facts": [
        [
          "Belang Atlas in Delta",
          "75%; waardering NVW; integrale consolidatie."
        ],
        [
          "Goederenstroom",
          "Delta → Atlas"
        ],
        [
          "Voorraad bij Atlas: begin / eind",
          "€ 160.000 / € 240.000, uitsluitend afkomstig van Delta."
        ],
        [
          "Winst in verkoopprijs",
          "25%, in beide voorraden."
        ],
        [
          "Winstbelasting",
          "25%"
        ]
      ],
      "task": "Welke aanvullende interne journaalpost maakt Atlas voor de upstreamwinstmutatie in haar enkelvoudige administratie, nadat het reguliere resultaat deelneming Delta al is geboekt?",
      "options": [
        {
          "journal": [
            [
              "Resultaat deelneming Delta",
              "11.250",
              ""
            ],
            [
              "Deelneming Delta",
              "",
              "11.250"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat deelneming Delta",
              11250,
              0
            ],
            [
              "Deelneming Delta",
              0,
              11250
            ]
          ],
          "why": ""
        },
        {
          "journal": [
            [
              "Deelneming Delta",
              "11.250",
              ""
            ],
            [
              "Resultaat deelneming Delta",
              "",
              "11.250"
            ]
          ],
          "journalNumeric": [
            [
              "Deelneming Delta",
              11250,
              0
            ],
            [
              "Resultaat deelneming Delta",
              0,
              11250
            ]
          ],
          "why": "Een toename vraagt om verlaging, niet verhoging van resultaat deelneming."
        },
        {
          "journal": [
            [
              "Niet-gerealiseerde winst",
              "15.000",
              ""
            ],
            [
              "Overlopende passiva",
              "",
              "15.000"
            ]
          ],
          "journalNumeric": [
            [
              "Niet-gerealiseerde winst",
              15000,
              0
            ],
            [
              "Overlopende passiva",
              0,
              15000
            ]
          ],
          "why": "Dat is niet de upstream-NVW-systematiek."
        },
        {
          "journal": [
            [
              "Resultaat deelneming Delta",
              "15.000",
              ""
            ],
            [
              "Deelneming Delta",
              "",
              "15.000"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat deelneming Delta",
              15000,
              0
            ],
            [
              "Deelneming Delta",
              0,
              15000
            ]
          ],
          "why": "De correctie in de deelneming wordt na belasting berekend."
        }
      ],
      "correct": 0,
      "explanation": [
        "Toename winst in voorraad € 20.000 × 75% belang × 75% na belasting = € 11.250.",
        "Resultaat deelneming en de boekwaarde van de deelneming worden beide verlaagd."
      ],
      "pattern": "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het resultaat uit deelneming in de enkelvoudige jaarrekening. Herken eerst welke gebeurtenis of correctie moet worden geboekt. Let op de beslissende gegevens: Bepaal welke rekening toeneemt of afneemt en vanuit welke onderneming wordt geboekt. Zoek de waarderingsgrondslag, het belang en het tijdstip in de casus. Een eliminatie verwijdert een interne post; een enkelvoudige boeking verwerkt de gebeurtenis bij de onderneming zelf. Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten.",
      "refs": [
        "up",
        "thup",
        "old"
      ],
      "related": [
        7,
        13,
        18
      ],
      "variant": true,
      "guidance": {
        "lesson": "upstream-nvw",
        "title": "Upstream: resultaat deelneming en deelneming corrigeren",
        "task": "Welke aanvullende interne journaalpost maakt Atlas voor de upstreamwinstmutatie in haar enkelvoudige administratie, nadat het reguliere resultaat deelneming Delta al is geboekt?",
        "rules": "Bij upstream NVW wordt het winstaandeel van de moeder gecorrigeerd op resultaat deelneming tegenover de deelneming in de verkoper. Gebruik de jaarmutatie in ongerealiseerde winst, het aandeel in de verkoper en het bedrag na winstbelasting. Dit is niet de downstreamboeking met overlopende passiva. De eindstand blijft nodig voor de latere balanswaardering.",
        "pattern": [
          "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het resultaat uit deelneming in de enkelvoudige jaarrekening. Herken eerst welke gebeurtenis of correctie moet worden geboekt.",
          "Let op de beslissende gegevens: Bepaal welke rekening toeneemt of afneemt en vanuit welke onderneming wordt geboekt. Zoek de waarderingsgrondslag, het belang en het tijdstip in de casus. Een eliminatie verwijdert een interne post; een enkelvoudige boeking verwerkt de gebeurtenis bij de onderneming zelf.",
          "Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten."
        ]
      },
      "caseTables": [
        {
          "caption": "Ingevulde voorraadtabel bij deze zelfstandige casus",
          "note": "Gebruik deze hulptabel voor de gevraagde boeking of aansluiting. Alle winst- en correctiebedragen zijn vóór belasting; de mutatie is eindstand minus beginstand.",
          "headers": [
            "Datum",
            "Voorraad",
            "Niet-gerealiseerde intercompanywinst in voorraad",
            "Interne correctie",
            "Eliminatie t.l.v. aandeel derden",
            "Eliminatie t.l.v. geconsolideerd resultaat"
          ],
          "rows": [
            [
              "Percentage",
              "",
              "100%",
              "75%",
              "25%",
              "0%"
            ],
            [
              "Begin boekjaar",
              160000,
              40000,
              30000,
              10000,
              "n.v.t."
            ],
            [
              "Einde boekjaar",
              240000,
              60000,
              45000,
              15000,
              "n.v.t."
            ],
            [
              "Toename",
              80000,
              20000,
              15000,
              5000,
              "n.v.t."
            ]
          ],
          "completed": true
        }
      ]
    },
    {
      "id": 13,
      "stage": 2,
      "title": "Upstream: de winst komt vrij",
      "type": "Journaalpost",
      "intro": "In deze zelfstandige variant neemt de voorraad af.",
      "facts": [
        [
          "Belang Atlas in Delta",
          "75%; waardering NVW; integrale consolidatie."
        ],
        [
          "Goederenstroom",
          "Delta → Atlas"
        ],
        [
          "Voorraad bij Atlas: begin / eind",
          "€ 240.000 / € 160.000, uitsluitend afkomstig van Delta."
        ],
        [
          "Winst in verkoopprijs",
          "25%, in beide voorraden."
        ],
        [
          "Winstbelasting",
          "25%"
        ]
      ],
      "task": "Welke interne correctie boekt Atlas voor de afname van de upstreamwinst in de voorraad, bij 75% NVW-waardering en 25% winstbelasting?",
      "options": [
        {
          "journal": [
            [
              "Deelneming Delta",
              "11.250",
              ""
            ],
            [
              "Resultaat deelneming Delta",
              "",
              "11.250"
            ]
          ],
          "journalNumeric": [
            [
              "Deelneming Delta",
              11250,
              0
            ],
            [
              "Resultaat deelneming Delta",
              0,
              11250
            ]
          ],
          "why": ""
        },
        {
          "journal": [
            [
              "Resultaat deelneming Delta",
              "11.250",
              ""
            ],
            [
              "Deelneming Delta",
              "",
              "11.250"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat deelneming Delta",
              11250,
              0
            ],
            [
              "Deelneming Delta",
              0,
              11250
            ]
          ],
          "why": "Dit hoort bij toename, niet bij vrijval."
        },
        {
          "journal": [
            [
              "Deelneming Delta",
              "12.000",
              ""
            ],
            [
              "Resultaat deelneming Delta",
              "",
              "12.000"
            ]
          ],
          "journalNumeric": [
            [
              "Deelneming Delta",
              12000,
              0
            ],
            [
              "Resultaat deelneming Delta",
              0,
              12000
            ]
          ],
          "why": "Dit gebruikt 20% belasting; gegeven is 25%."
        },
        {
          "journal": [
            [
              "Deelneming Delta",
              "15.000",
              ""
            ],
            [
              "Resultaat deelneming Delta",
              "",
              "15.000"
            ]
          ],
          "journalNumeric": [
            [
              "Deelneming Delta",
              15000,
              0
            ],
            [
              "Resultaat deelneming Delta",
              0,
              15000
            ]
          ],
          "why": "Het belastingeffect ontbreekt."
        }
      ],
      "correct": 0,
      "explanation": [
        "Afname van € 60.000 naar € 40.000 geeft € 20.000 vrijval vóór belasting.",
        "75% × € 20.000 × 75% = € 11.250: deelneming debet en resultaat deelneming credit."
      ],
      "pattern": "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt de waardering of boekwaarde. Herken eerst welke gebeurtenis of correctie moet worden geboekt. Let op de beslissende gegevens: Bepaal wie levert aan wie, waar de voorraad ligt en welk belang moeder in leverancier en afnemer heeft. Gebruik de winstopslag of marge met de juiste noemer. Houd beginstand, eindstand en toe- of afname apart; pas de gegeven waarderingsgrondslag en winstbelasting toe. Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten.",
      "refs": [
        "up",
        "thup"
      ],
      "related": [
        12,
        24
      ],
      "variant": true,
      "guidance": {
        "lesson": "upstream-nvw",
        "title": "Upstreamvrijval verhoogt het resultaat uit deelneming",
        "task": "Welke interne correctie boekt Atlas voor de afname van de upstreamwinst in de voorraad, bij 75% NVW-waardering en 25% winstbelasting?",
        "rules": "Bij afname van ongerealiseerde upstreamwinst komt een deel van het eerder gecorrigeerde resultaat van de verkopende deelneming vrij. Het moederdeel wordt na belasting berekend. Deelneming wordt gedebiteerd en resultaat deelneming gecrediteerd. De rechtsvorm, waarderingsgrondslag en het aandeel veranderen in deze variant niet.",
        "pattern": [
          "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt de waardering of boekwaarde. Herken eerst welke gebeurtenis of correctie moet worden geboekt.",
          "Let op de beslissende gegevens: Bepaal wie levert aan wie, waar de voorraad ligt en welk belang moeder in leverancier en afnemer heeft. Gebruik de winstopslag of marge met de juiste noemer. Houd beginstand, eindstand en toe- of afname apart; pas de gegeven waarderingsgrondslag en winstbelasting toe.",
          "Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten."
        ]
      },
      "caseTables": [
        {
          "caption": "Ingevulde voorraadtabel bij deze zelfstandige casus",
          "note": "Gebruik deze hulptabel voor de gevraagde boeking of aansluiting. Alle winst- en correctiebedragen zijn vóór belasting; de mutatie is eindstand minus beginstand.",
          "headers": [
            "Datum",
            "Voorraad",
            "Niet-gerealiseerde intercompanywinst in voorraad",
            "Interne correctie",
            "Eliminatie t.l.v. aandeel derden",
            "Eliminatie t.l.v. geconsolideerd resultaat"
          ],
          "rows": [
            [
              "Percentage",
              "",
              "100%",
              "75%",
              "25%",
              "0%"
            ],
            [
              "Begin boekjaar",
              240000,
              60000,
              45000,
              15000,
              "n.v.t."
            ],
            [
              "Einde boekjaar",
              160000,
              40000,
              30000,
              10000,
              "n.v.t."
            ],
            [
              "Afname",
              -80000,
              -20000,
              -15000,
              -5000,
              "n.v.t."
            ]
          ],
          "completed": true
        }
      ]
    },
    {
      "id": 14,
      "stage": 2,
      "title": "Upstream in de balansconsolidatie",
      "type": "Journaalpost",
      "intro": "Alle enkelvoudige correcties zijn verwerkt. De normale eliminatie van deelneming tegen eigen vermogen wordt apart gemaakt.",
      "facts": [
        [
          "Belang Atlas in Delta",
          "75%; waardering NVW; integrale consolidatie."
        ],
        [
          "Goederenstroom",
          "Delta → Atlas"
        ],
        [
          "Voorraad bij Atlas: begin / eind",
          "€ 160.000 / € 240.000, uitsluitend afkomstig van Delta."
        ],
        [
          "Winst in verkoopprijs",
          "25%, in beide voorraden."
        ],
        [
          "Winstbelasting",
          "25%"
        ]
      ],
      "task": "Welke aanvullende balanseliminatie verwijdert de volledige upstreamwinst uit Atlas' eindvoorraad, volgens de syllabuscombinatie met een afzonderlijke eliminatie van Delta's eigen vermogen en de interne correctie in Atlas?",
      "options": [
        {
          "journal": [
            [
              "Deelneming Delta",
              "33.750",
              ""
            ],
            [
              "Voorziening belastingen",
              "11.250",
              ""
            ],
            [
              "Belang derden",
              "11.250",
              ""
            ],
            [
              "Voorziening belastingen",
              "3.750",
              ""
            ],
            [
              "Voorraad",
              "",
              "60.000"
            ]
          ],
          "journalNumeric": [
            [
              "Deelneming Delta",
              33750,
              0
            ],
            [
              "Voorziening belastingen",
              11250,
              0
            ],
            [
              "Belang derden",
              11250,
              0
            ],
            [
              "Voorziening belastingen",
              3750,
              0
            ],
            [
              "Voorraad",
              0,
              60000
            ]
          ],
          "why": ""
        },
        {
          "journal": [
            [
              "Deelneming Delta",
              "33.750",
              ""
            ],
            [
              "Voorziening belastingen",
              "11.250",
              ""
            ],
            [
              "Resultaat boekjaar",
              "11.250",
              ""
            ],
            [
              "Voorziening belastingen",
              "3.750",
              ""
            ],
            [
              "Voorraad",
              "",
              "60.000"
            ]
          ],
          "journalNumeric": [
            [
              "Deelneming Delta",
              33750,
              0
            ],
            [
              "Voorziening belastingen",
              11250,
              0
            ],
            [
              "Resultaat boekjaar",
              11250,
              0
            ],
            [
              "Voorziening belastingen",
              3750,
              0
            ],
            [
              "Voorraad",
              0,
              60000
            ]
          ],
          "why": "De resterende winstcorrectie hoort bij belang derden, niet bij resultaat boekjaar."
        },
        {
          "journal": [
            [
              "Deelneming Delta",
              "11.250",
              ""
            ],
            [
              "Voorziening belastingen",
              "3.750",
              ""
            ],
            [
              "Belang derden",
              "3.750",
              ""
            ],
            [
              "Voorziening belastingen",
              "1.250",
              ""
            ],
            [
              "Voorraad",
              "",
              "20.000"
            ]
          ],
          "journalNumeric": [
            [
              "Deelneming Delta",
              11250,
              0
            ],
            [
              "Voorziening belastingen",
              3750,
              0
            ],
            [
              "Belang derden",
              3750,
              0
            ],
            [
              "Voorziening belastingen",
              1250,
              0
            ],
            [
              "Voorraad",
              0,
              20000
            ]
          ],
          "why": "De balans vereist de winst in de eindvoorraad, niet de mutatie."
        },
        {
          "journal": [
            [
              "Deelneming Delta",
              "36.000",
              ""
            ],
            [
              "Voorziening belastingen",
              "9.000",
              ""
            ],
            [
              "Belang derden",
              "12.000",
              ""
            ],
            [
              "Voorziening belastingen",
              "3.000",
              ""
            ],
            [
              "Voorraad",
              "",
              "60.000"
            ]
          ],
          "journalNumeric": [
            [
              "Deelneming Delta",
              36000,
              0
            ],
            [
              "Voorziening belastingen",
              9000,
              0
            ],
            [
              "Belang derden",
              12000,
              0
            ],
            [
              "Voorziening belastingen",
              3000,
              0
            ],
            [
              "Voorraad",
              0,
              60000
            ]
          ],
          "why": "Het tarief is 25%, niet 20%."
        }
      ],
      "correct": 0,
      "explanation": [
        "Van de eindwinst € 60.000 hoort 75% bij Atlas. Na belasting wordt € 33.750 op de deelneming teruggeboekt; de bijbehorende latentie is € 11.250.",
        "Het derdenaandeel na belasting is € 11.250 en de bijbehorende latentie € 3.750. Samen € 60.000 credit op voorraad.",
        "Voor upstream-NVW is hier geen extra invoegboeking ten laste van overige reserves nodig."
      ],
      "pattern": "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het gevraagde onderwerp bij de consolidatie. Herken eerst welke gebeurtenis of correctie moet worden geboekt. Let op de beslissende gegevens: Bepaal wie levert aan wie, waar de voorraad ligt en welk belang moeder in leverancier en afnemer heeft. Gebruik de winstopslag of marge met de juiste noemer. Houd beginstand, eindstand en toe- of afname apart; pas de gegeven waarderingsgrondslag en winstbelasting toe. Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten.",
      "refs": [
        "up",
        "thup"
      ],
      "related": [
        4,
        9,
        19
      ],
      "variant": true,
      "guidance": {
        "lesson": "upstream-nvw",
        "title": "De upstreamwinst uit de eindvoorraad verwijderen",
        "task": "Welke aanvullende balanseliminatie verwijdert de volledige upstreamwinst uit Atlas' eindvoorraad, volgens de syllabuscombinatie met een afzonderlijke eliminatie van Delta's eigen vermogen en de interne correctie in Atlas?",
        "rules": "De gehele ongerealiseerde eindwinst moet uit de geconsolideerde voorraad verdwijnen. De reeds intern verwerkte verlaging van de deelneming wordt in de IC-balanseliminatie teruggenomen; daarnaast worden belastinglatenties en het netto derdenaandeel verwerkt. Deze IC-post moet worden gecombineerd met de bijbehorende basiseliminatie van het eigen vermogen, zodat de daadwerkelijk geboekte deelneming per saldo verdwijnt.",
        "pattern": [
          "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het gevraagde onderwerp bij de consolidatie. Herken eerst welke gebeurtenis of correctie moet worden geboekt.",
          "Let op de beslissende gegevens: Bepaal wie levert aan wie, waar de voorraad ligt en welk belang moeder in leverancier en afnemer heeft. Gebruik de winstopslag of marge met de juiste noemer. Houd beginstand, eindstand en toe- of afname apart; pas de gegeven waarderingsgrondslag en winstbelasting toe.",
          "Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten."
        ]
      },
      "caseTables": [
        {
          "caption": "Ingevulde voorraadtabel bij deze zelfstandige casus",
          "note": "Gebruik deze hulptabel voor de gevraagde boeking of aansluiting. Alle winst- en correctiebedragen zijn vóór belasting; de mutatie is eindstand minus beginstand.",
          "headers": [
            "Datum",
            "Voorraad",
            "Niet-gerealiseerde intercompanywinst in voorraad",
            "Interne correctie",
            "Eliminatie t.l.v. aandeel derden",
            "Eliminatie t.l.v. geconsolideerd resultaat"
          ],
          "rows": [
            [
              "Percentage",
              "",
              "100%",
              "75%",
              "25%",
              "0%"
            ],
            [
              "Begin boekjaar",
              160000,
              40000,
              30000,
              10000,
              "n.v.t."
            ],
            [
              "Einde boekjaar",
              240000,
              60000,
              45000,
              15000,
              "n.v.t."
            ],
            [
              "Toename",
              80000,
              20000,
              15000,
              5000,
              "n.v.t."
            ]
          ],
          "completed": true
        }
      ]
    },
    {
      "id": 15,
      "stage": 2,
      "title": "De waarde van de deelneming",
      "type": "Rekenvraag",
      "intro": "Atlas stelt haar enkelvoudige balans op.",
      "facts": [
        [
          "Belang Atlas in Delta",
          "75%; waardering NVW; integrale consolidatie."
        ],
        [
          "Goederenstroom",
          "Delta → Atlas"
        ],
        [
          "Voorraad bij Atlas: begin / eind",
          "€ 160.000 / € 240.000, uitsluitend afkomstig van Delta."
        ],
        [
          "Winst in verkoopprijs",
          "25%, in beide voorraden."
        ],
        [
          "Winstbelasting",
          "25%"
        ],
        [
          "Eigen vermogen Delta ultimo",
          "€ 1.200.000 na winstbelasting; vóór intercompanycorrectie bij Atlas."
        ],
        [
          "Waarderingsverschillen / goodwill",
          "Geen."
        ]
      ],
      "task": "Voor welk bedrag neemt Atlas de 75%-deelneming Delta op haar enkelvoudige eindbalans op na correctie voor de nog ongerealiseerde upstreamwinst in de eindvoorraad?",
      "options": [
        {
          "lines": [
            "75% × € 1.200.000",
            "− 75% × € 60.000 × 75%"
          ],
          "expression": ".75*1200000-.75*60000*.75",
          "value": "866250.0",
          "result": "€ 866.250",
          "why": ""
        },
        {
          "lines": [
            "75% × € 1.200.000",
            "− 75% × € 60.000"
          ],
          "expression": ".75*1200000-.75*60000",
          "value": "855000.0",
          "result": "€ 855.000",
          "why": "Het belastingeffect is weggelaten."
        },
        {
          "lines": [
            "75% × € 1.200.000",
            "− 75% × € 60.000 × 80%"
          ],
          "expression": ".75*1200000-.75*60000*.8",
          "value": "864000.0",
          "result": "€ 864.000",
          "why": "Het na-belastingpercentage is 75%, niet 80%."
        },
        {
          "lines": [
            "75% × € 1.200.000",
            "− 75% × € 60.000 × 70%"
          ],
          "expression": ".75*1200000-.75*60000*.7",
          "value": "868500.0",
          "result": "€ 868.500",
          "why": "Het gegeven belastingtarief is 25%."
        }
      ],
      "correct": 0,
      "explanation": [
        "Het aandeel in het eigen vermogen is € 900.000.",
        "De correctie op basis van de eindvoorraad is € 60.000 × 75% × 75% = € 33.750.",
        "De deelneming bedraagt € 866.250."
      ],
      "pattern": "Herken de vraag: Dit is een berekenings- of verwerkingsvraag over het gevraagde onderwerp. Onderscheid de gevraagde eindstand van een mutatie of resultaat over het jaar. Let op de beslissende gegevens: Bepaal wie levert aan wie, waar de voorraad ligt en welk belang moeder in leverancier en afnemer heeft. Gebruik de winstopslag of marge met de juiste noemer. Houd beginstand, eindstand en toe- of afname apart; pas de gegeven waarderingsgrondslag en winstbelasting toe. Vorm van het antwoord: Toon de relevante beginstand of formule, de ingevulde gegevens en de berekening tot de gevraagde uitkomst. Vermeld valuta of eenheid en geef bij een verschil ook het teken en de verwerking aan.",
      "refs": [
        "up",
        "brug"
      ],
      "related": [
        12,
        14
      ],
      "variant": true,
      "guidance": {
        "lesson": "upstream-nvw",
        "title": "Eindwaarde deelneming na de cumulatieve correctie",
        "task": "Voor welk bedrag neemt Atlas de 75%-deelneming Delta op haar enkelvoudige eindbalans op na correctie voor de nog ongerealiseerde upstreamwinst in de eindvoorraad?",
        "rules": "De eindwaarde van de deelneming begint bij het aandeel in het eigen vermogen volgens moedergrondslagen. Verminder dat met het moederdeel van de ongerealiseerde winst die op einddatum nog aanwezig is, na belasting. Een eindbalanswaarde gebruikt de totale resterende eindwinst; alleen voor de resultaatboeking van het jaar gebruik je de mutatie.",
        "pattern": [
          "Herken de vraag: Dit is een berekenings- of verwerkingsvraag over het gevraagde onderwerp. Onderscheid de gevraagde eindstand van een mutatie of resultaat over het jaar.",
          "Let op de beslissende gegevens: Bepaal wie levert aan wie, waar de voorraad ligt en welk belang moeder in leverancier en afnemer heeft. Gebruik de winstopslag of marge met de juiste noemer. Houd beginstand, eindstand en toe- of afname apart; pas de gegeven waarderingsgrondslag en winstbelasting toe.",
          "Vorm van het antwoord: Toon de relevante beginstand of formule, de ingevulde gegevens en de berekening tot de gevraagde uitkomst. Vermeld valuta of eenheid en geef bij een verschil ook het teken en de verwerking aan."
        ]
      },
      "caseTables": [
        {
          "caption": "Ingevulde voorraadtabel bij deze zelfstandige casus",
          "note": "Gebruik deze hulptabel voor de gevraagde boeking of aansluiting. Alle winst- en correctiebedragen zijn vóór belasting; de mutatie is eindstand minus beginstand.",
          "headers": [
            "Datum",
            "Voorraad",
            "Niet-gerealiseerde intercompanywinst in voorraad",
            "Interne correctie",
            "Eliminatie t.l.v. aandeel derden",
            "Eliminatie t.l.v. geconsolideerd resultaat"
          ],
          "rows": [
            [
              "Percentage",
              "",
              "100%",
              "75%",
              "25%",
              "0%"
            ],
            [
              "Begin boekjaar",
              160000,
              40000,
              30000,
              10000,
              "n.v.t."
            ],
            [
              "Einde boekjaar",
              240000,
              60000,
              45000,
              15000,
              "n.v.t."
            ],
            [
              "Toename",
              80000,
              20000,
              15000,
              5000,
              "n.v.t."
            ]
          ],
          "completed": true
        }
      ]
    },
    {
      "id": 16,
      "stage": 3,
      "title": "Twee deelnemingen",
      "type": "Theorie",
      "intro": "Atlas bezit 70% van Sigma en 90% van Delta. Beide belangen zijn gedurende het hele boekjaar gelijk gebleven.",
      "facts": [
        [
          "Stroom 1",
          "Sigma → Delta"
        ],
        [
          "Stroom 2",
          "Delta → Sigma"
        ],
        [
          "Waardering",
          "Beide deelnemingen tegen NVW."
        ]
      ],
      "task": "Welke van de twee leveringen is sidestream niet-afnemend belang en welke sidestream afnemend belang, op basis van Atlas' 70%- en 90%-belangen in de verkoper en koper?",
      "options": [
        {
          "text": "Stroom 1: upstream. Stroom 2: downstream.",
          "why": "Beide stromen vinden tussen deelnemingen plaats en zijn dus sidestream."
        },
        {
          "text": "Stroom 1: sidestream afnemend belang. Stroom 2: sidestream niet-afnemend belang.",
          "why": "De percentages langs de goederenstroom zijn omgekeerd geïnterpreteerd."
        },
        {
          "text": "Stroom 1: sidestream niet-afnemend belang. Stroom 2: sidestream afnemend belang.",
          "why": ""
        },
        {
          "text": "Beide stromen zijn niet-afnemend, want de deelnemingspercentages veranderen niet tijdens het jaar.",
          "why": "Afnemend belang ziet hier op de route van het product, niet op aankoop of verkoop van aandelen."
        }
      ],
      "correct": 2,
      "explanation": [
        "Stroom 1 gaat van 70% naar 90%: het belang van de moeder in de goederen neemt niet af.",
        "Stroom 2 gaat van 90% naar 70%: het belang in de goederen neemt wel af."
      ],
      "pattern": "Herken de vraag: Dit is een berekenings- of verwerkingsvraag over het gevraagde onderwerp. Onderscheid de gevraagde eindstand van een mutatie of resultaat over het jaar. Let op de beslissende gegevens: Zoek het gevraagde tijdstip en de waarderingsgrondslag. Houd aanschafprijs, aandeel in eigen vermogen, resultaat en uitkering uit elkaar. Neem uitsluitend mutaties mee die bij de gevraagde periode en onderneming horen. Vorm van het antwoord: Geef de conclusie, het beslissende casusfeit en het toepasselijke criterium. Voeg een berekening of bronregel toe wanneer de vraag dat vraagt.",
      "refs": [
        "nab",
        "ab"
      ],
      "related": [
        17,
        21,
        24
      ],
      "variant": true,
      "guidance": {
        "lesson": "sidestream",
        "title": "Belang langs de goederenstroom vergelijken",
        "task": "Welke van de twee leveringen is sidestream niet-afnemend belang en welke sidestream afnemend belang, op basis van Atlas' 70%- en 90%-belangen in de verkoper en koper?",
        "rules": "Beide leveringen vinden tussen deelnemingen plaats en zijn daarom sidestream. Vergelijk vervolgens het moederbelang in de verkoper met het moederbelang in de koper langs de goederenpijl. Een lager belang bij de koper heet in deze systematiek afnemend belang. Dat zegt niets over een wijziging van aandelen gedurende het jaar of over groei of daling van voorraad.",
        "pattern": [
          "Herken de vraag: Dit is een berekenings- of verwerkingsvraag over het gevraagde onderwerp. Onderscheid de gevraagde eindstand van een mutatie of resultaat over het jaar.",
          "Let op de beslissende gegevens: Zoek het gevraagde tijdstip en de waarderingsgrondslag. Houd aanschafprijs, aandeel in eigen vermogen, resultaat en uitkering uit elkaar. Neem uitsluitend mutaties mee die bij de gevraagde periode en onderneming horen.",
          "Vorm van het antwoord: Geef de conclusie, het beslissende casusfeit en het toepasselijke criterium. Voeg een berekening of bronregel toe wanneer de vraag dat vraagt."
        ]
      },
      "caseTables": []
    },
    {
      "id": 17,
      "stage": 3,
      "title": "Sidestream zonder afnemend belang",
      "type": "Voorraadtabel",
      "intro": "Atlas analyseert de levering van Sigma aan Delta.",
      "facts": [
        [
          "Belangen Atlas",
          "Sigma 70%; Delta 90%; beide tegen NVW en integraal geconsolideerd."
        ],
        [
          "Goederenstroom",
          "Sigma → Delta"
        ],
        [
          "Voorraad bij Delta: begin / eind",
          "€ 200.000 / € 260.000, afkomstig van Sigma."
        ],
        [
          "Winst in verkoopprijs",
          "20%, in beide voorraden."
        ],
        [
          "Winstbelasting",
          "25%"
        ]
      ],
      "task": "Welke verdeling in de voorraadtabel hoort bij Sigma naar Delta wanneer Atlas 70% van Sigma en 90% van Delta houdt, beide tegen NVW? Bereken de winst vóór belasting.",
      "options": [
        {
          "table": {
            "headers": [
              "Datum",
              "Voorraad bij koper",
              "Niet-gerealiseerde intercompanywinst (100%)",
              "Interne correctie bij moeder (70%)",
              "Eliminatie t.l.v. aandeel derden (30%)",
              "Eliminatie t.l.v. geconsolideerd resultaat (0%)"
            ],
            "rows": [
              [
                "Begin boekjaar",
                "200.000",
                "40.000",
                "28.000",
                "12.000",
                "0"
              ],
              [
                "Eind boekjaar",
                "260.000",
                "52.000",
                "36.400",
                "15.600",
                "0"
              ],
              [
                "Mutatie",
                "60.000",
                "12.000",
                "8.400",
                "3.600",
                "0"
              ]
            ]
          },
          "why": "",
          "values": [
            [
              200000,
              40000,
              28000,
              12000,
              0
            ],
            [
              260000,
              52000,
              36400,
              15600,
              0
            ]
          ]
        },
        {
          "table": {
            "headers": [
              "Datum",
              "Voorraad bij koper",
              "Niet-gerealiseerde intercompanywinst (100%)",
              "Interne correctie bij moeder (70%)",
              "Eliminatie t.l.v. aandeel derden (10%)",
              "Eliminatie t.l.v. geconsolideerd resultaat (20%)"
            ],
            "rows": [
              [
                "Begin boekjaar",
                "200.000",
                "40.000",
                "28.000",
                "4.000",
                "8.000"
              ],
              [
                "Eind boekjaar",
                "260.000",
                "52.000",
                "36.400",
                "5.200",
                "10.400"
              ],
              [
                "Mutatie",
                "60.000",
                "12.000",
                "8.400",
                "1.200",
                "2.400"
              ]
            ]
          },
          "why": "Bij niet-afnemend belang is er geen aanvullend meerderheidsdeel.",
          "values": [
            [
              200000,
              40000,
              28000,
              4000,
              8000
            ],
            [
              260000,
              52000,
              36400,
              5200,
              10400
            ]
          ]
        },
        {
          "table": {
            "headers": [
              "Datum",
              "Voorraad bij koper",
              "Niet-gerealiseerde intercompanywinst (100%)",
              "Interne correctie bij moeder (70%)",
              "Eliminatie t.l.v. aandeel derden (0%)",
              "Eliminatie t.l.v. geconsolideerd resultaat (30%)"
            ],
            "rows": [
              [
                "Begin boekjaar",
                "200.000",
                "40.000",
                "28.000",
                "0",
                "12.000"
              ],
              [
                "Eind boekjaar",
                "260.000",
                "52.000",
                "36.400",
                "0",
                "15.600"
              ],
              [
                "Mutatie",
                "60.000",
                "12.000",
                "8.400",
                "0",
                "3.600"
              ]
            ]
          },
          "why": "Het restant gaat hier naar derden.",
          "values": [
            [
              200000,
              40000,
              28000,
              0,
              12000
            ],
            [
              260000,
              52000,
              36400,
              0,
              15600
            ]
          ]
        },
        {
          "table": {
            "headers": [
              "Datum",
              "Voorraad bij koper",
              "Niet-gerealiseerde intercompanywinst (100%)",
              "Interne correctie bij moeder (90%)",
              "Eliminatie t.l.v. aandeel derden (10%)",
              "Eliminatie t.l.v. geconsolideerd resultaat (0%)"
            ],
            "rows": [
              [
                "Begin boekjaar",
                "200.000",
                "40.000",
                "36.000",
                "4.000",
                "0"
              ],
              [
                "Eind boekjaar",
                "260.000",
                "52.000",
                "46.800",
                "5.200",
                "0"
              ],
              [
                "Mutatie",
                "60.000",
                "12.000",
                "10.800",
                "1.200",
                "0"
              ]
            ]
          },
          "why": "Dit gebruikt het belang in de koper in plaats van de verkoper.",
          "values": [
            [
              200000,
              40000,
              36000,
              4000,
              0
            ],
            [
              260000,
              52000,
              46800,
              5200,
              0
            ]
          ]
        }
      ],
      "correct": 0,
      "explanation": [
        "Winst begin € 40.000; winst eind € 52.000; mutatie € 12.000.",
        "Intern geldt 70%, het belang in Sigma. De overige 30% komt bij derden."
      ],
      "pattern": "Herken de vraag: Een voorraadtabel vraagt om het verband tussen beginvoorraad, eindvoorraad, niet-gerealiseerde winst en de verdeling van de correctie. Let op de beslissende gegevens: Bepaal wie levert aan wie, waar de voorraad ligt en welk belang moeder in leverancier en afnemer heeft. Gebruik de winstopslag of marge met de juiste noemer. Houd beginstand, eindstand en toe- of afname apart; pas de gegeven waarderingsgrondslag en winstbelasting toe. Vorm van het antwoord: Vul de gevraagde rijen en kolommen in. Laat zien hoe de niet-gerealiseerde winst aansluit op interne correctie, aandeel derden en geconsolideerd resultaat.",
      "refs": [
        "nab",
        "brug",
        "thnab"
      ],
      "related": [
        11,
        18,
        19
      ],
      "variant": true,
      "guidance": {
        "lesson": "sidestream-nab",
        "title": "Niet-afnemend sidestream: verdeling volgens verkoper",
        "task": "Welke verdeling in de voorraadtabel hoort bij Sigma naar Delta wanneer Atlas 70% van Sigma en 90% van Delta houdt, beide tegen NVW? Bereken de winst vóór belasting.",
        "rules": "Bij sidestream niet-afnemend belang volgt de interne correctie in het gebruikte materiaal het aandeel in de verkopende deelneming. De overige winst behoort bij het minderheidsbelang in die verkoper. Het hogere belang in de voorraadkoper leidt niet tot een hoger intern correctiepercentage. Er is in deze verdeling geen aanvullend meerderheidsdeel.",
        "pattern": [
          "Herken de vraag: Een voorraadtabel vraagt om het verband tussen beginvoorraad, eindvoorraad, niet-gerealiseerde winst en de verdeling van de correctie.",
          "Let op de beslissende gegevens: Bepaal wie levert aan wie, waar de voorraad ligt en welk belang moeder in leverancier en afnemer heeft. Gebruik de winstopslag of marge met de juiste noemer. Houd beginstand, eindstand en toe- of afname apart; pas de gegeven waarderingsgrondslag en winstbelasting toe.",
          "Vorm van het antwoord: Vul de gevraagde rijen en kolommen in. Laat zien hoe de niet-gerealiseerde winst aansluit op interne correctie, aandeel derden en geconsolideerd resultaat."
        ]
      },
      "caseTables": [
        {
          "caption": "Voorraadgegevens en uitwerksjabloon bij deze vraag",
          "note": "De voorraadbedragen zijn gegeven tegen de onderlinge verkoopprijs. De lege winst- en correctiekolommen zijn uit te werken; zij bevatten niet het antwoord.",
          "headers": [
            "Datum",
            "Voorraad",
            "Niet-gerealiseerde intercompanywinst in voorraad",
            "Interne correctie",
            "Eliminatie t.l.v. aandeel derden",
            "Eliminatie t.l.v. geconsolideerd resultaat"
          ],
          "rows": [
            [
              "Percentage",
              "",
              "100%",
              "…%",
              "…%",
              "…%"
            ],
            [
              "Begin boekjaar",
              200000,
              "",
              "",
              "",
              ""
            ],
            [
              "Einde boekjaar",
              260000,
              "",
              "",
              "",
              ""
            ],
            [
              "Toe-/afname",
              "",
              "",
              "",
              "",
              ""
            ]
          ]
        }
      ]
    },
    {
      "id": 18,
      "stage": 3,
      "title": "Sidestream: interne correctie",
      "type": "Journaalpost",
      "intro": "Atlas heeft het reguliere resultaat deelneming Sigma geboekt.",
      "facts": [
        [
          "Belangen Atlas",
          "Sigma 70%; Delta 90%; beide tegen NVW en integraal geconsolideerd."
        ],
        [
          "Goederenstroom",
          "Sigma → Delta"
        ],
        [
          "Voorraad bij Delta: begin / eind",
          "€ 200.000 / € 260.000, afkomstig van Sigma."
        ],
        [
          "Winst in verkoopprijs",
          "20%, in beide voorraden."
        ],
        [
          "Winstbelasting",
          "25%"
        ]
      ],
      "task": "Welke aanvullende interne journaalpost boekt Atlas voor de winsttoename op Sigma's levering aan Delta, nadat het gewone resultaat uit Sigma al is verwerkt?",
      "options": [
        {
          "journal": [
            [
              "Resultaat deelneming Delta",
              "6.300",
              ""
            ],
            [
              "Deelneming Delta",
              "",
              "6.300"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat deelneming Delta",
              6300,
              0
            ],
            [
              "Deelneming Delta",
              0,
              6300
            ]
          ],
          "why": "De winst is gemaakt door Sigma, niet door Delta."
        },
        {
          "journal": [
            [
              "Resultaat deelneming Sigma",
              "6.720",
              ""
            ],
            [
              "Deelneming Sigma",
              "",
              "6.720"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat deelneming Sigma",
              6720,
              0
            ],
            [
              "Deelneming Sigma",
              0,
              6720
            ]
          ],
          "why": "Dit gebruikt 20% belasting in plaats van 25%."
        },
        {
          "journal": [
            [
              "Resultaat deelneming Sigma",
              "8.100",
              ""
            ],
            [
              "Deelneming Sigma",
              "",
              "8.100"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat deelneming Sigma",
              8100,
              0
            ],
            [
              "Deelneming Sigma",
              0,
              8100
            ]
          ],
          "why": "Dit gebruikt het 90%-belang in de koper."
        },
        {
          "journal": [
            [
              "Resultaat deelneming Sigma",
              "6.300",
              ""
            ],
            [
              "Deelneming Sigma",
              "",
              "6.300"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat deelneming Sigma",
              6300,
              0
            ],
            [
              "Deelneming Sigma",
              0,
              6300
            ]
          ],
          "why": ""
        }
      ],
      "correct": 3,
      "explanation": [
        "70% × (€ 52.000 − € 40.000) × 75% = € 6.300.",
        "De correctie wordt bij Atlas geboekt op het resultaat en de boekwaarde van de verkopende deelneming Sigma."
      ],
      "pattern": "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het gevraagde onderwerp. Herken eerst welke gebeurtenis of correctie moet worden geboekt. Let op de beslissende gegevens: Bepaal welke rekening toeneemt of afneemt en vanuit welke onderneming wordt geboekt. Zoek de waarderingsgrondslag, het belang en het tijdstip in de casus. Een eliminatie verwijdert een interne post; een enkelvoudige boeking verwerkt de gebeurtenis bij de onderneming zelf. Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten.",
      "refs": [
        "nab",
        "brug",
        "thnab"
      ],
      "related": [
        12,
        22
      ],
      "variant": true,
      "guidance": {
        "lesson": "sidestream-nab",
        "title": "Correctie bij de moeder op de verkopende deelneming",
        "task": "Welke aanvullende interne journaalpost boekt Atlas voor de winsttoename op Sigma's levering aan Delta, nadat het gewone resultaat uit Sigma al is verwerkt?",
        "rules": "Sigma is de deelneming die de interne winst heeft gemaakt. De correctie wordt daarom in Atlas' administratie geboekt op resultaat deelneming Sigma en deelneming Sigma. Bij niet-afnemend belang wordt het verkoperspercentage gebruikt en wordt de winstmutatie na belasting genomen. Er wordt niet rechtstreeks in de administratie van Delta gecorrigeerd.",
        "pattern": [
          "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het gevraagde onderwerp. Herken eerst welke gebeurtenis of correctie moet worden geboekt.",
          "Let op de beslissende gegevens: Bepaal welke rekening toeneemt of afneemt en vanuit welke onderneming wordt geboekt. Zoek de waarderingsgrondslag, het belang en het tijdstip in de casus. Een eliminatie verwijdert een interne post; een enkelvoudige boeking verwerkt de gebeurtenis bij de onderneming zelf.",
          "Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten."
        ]
      },
      "caseTables": [
        {
          "caption": "Ingevulde voorraadtabel bij deze zelfstandige casus",
          "note": "Gebruik deze hulptabel voor de gevraagde boeking of aansluiting. Alle winst- en correctiebedragen zijn vóór belasting; de mutatie is eindstand minus beginstand.",
          "headers": [
            "Datum",
            "Voorraad",
            "Niet-gerealiseerde intercompanywinst in voorraad",
            "Interne correctie",
            "Eliminatie t.l.v. aandeel derden",
            "Eliminatie t.l.v. geconsolideerd resultaat"
          ],
          "rows": [
            [
              "Percentage",
              "",
              "100%",
              "70%",
              "30%",
              "0%"
            ],
            [
              "Begin boekjaar",
              200000,
              40000,
              28000,
              12000,
              "n.v.t."
            ],
            [
              "Einde boekjaar",
              260000,
              52000,
              36400,
              15600,
              "n.v.t."
            ],
            [
              "Toename",
              60000,
              12000,
              8400,
              3600,
              "n.v.t."
            ]
          ],
          "completed": true
        }
      ]
    },
    {
      "id": 19,
      "stage": 3,
      "title": "Sidestream: de eindvoorraad elimineren",
      "type": "Journaalpost",
      "intro": "De deelnemingen worden tegen NVW gehouden en alle enkelvoudige correcties zijn geboekt.",
      "facts": [
        [
          "Belangen Atlas",
          "Sigma 70%; Delta 90%; beide tegen NVW en integraal geconsolideerd."
        ],
        [
          "Goederenstroom",
          "Sigma → Delta"
        ],
        [
          "Voorraad bij Delta: begin / eind",
          "€ 200.000 / € 260.000, afkomstig van Sigma."
        ],
        [
          "Winst in verkoopprijs",
          "20%, in beide voorraden."
        ],
        [
          "Winstbelasting",
          "25%"
        ]
      ],
      "task": "Welke aanvullende IC-balanseliminatie verwijdert de eindwinst uit Delta's voorraad en neemt de interne correctie op Sigma terug, volgens de afzonderlijke syllabus-basiseliminatie?",
      "options": [
        {
          "journal": [
            [
              "Deelneming Sigma",
              "27.300",
              ""
            ],
            [
              "Voorziening belastingen",
              "9.100",
              ""
            ],
            [
              "Belang derden",
              "11.700,00",
              ""
            ],
            [
              "Voorziening belastingen",
              "3.900,00",
              ""
            ],
            [
              "Voorraad",
              "",
              "52.000"
            ]
          ],
          "journalNumeric": [
            [
              "Deelneming Sigma",
              27300,
              0
            ],
            [
              "Voorziening belastingen",
              9100,
              0
            ],
            [
              "Belang derden",
              11700.000000000002,
              0
            ],
            [
              "Voorziening belastingen",
              3900.0000000000005,
              0
            ],
            [
              "Voorraad",
              0,
              52000
            ]
          ],
          "why": ""
        },
        {
          "journal": [
            [
              "Deelneming Sigma",
              "35.100",
              ""
            ],
            [
              "Voorziening belastingen",
              "11.700",
              ""
            ],
            [
              "Belang derden",
              "3.900,00",
              ""
            ],
            [
              "Voorziening belastingen",
              "1.300,00",
              ""
            ],
            [
              "Voorraad",
              "",
              "52.000"
            ]
          ],
          "journalNumeric": [
            [
              "Deelneming Sigma",
              35100,
              0
            ],
            [
              "Voorziening belastingen",
              11700,
              0
            ],
            [
              "Belang derden",
              3899.999999999999,
              0
            ],
            [
              "Voorziening belastingen",
              1299.9999999999998,
              0
            ],
            [
              "Voorraad",
              0,
              52000
            ]
          ],
          "why": "De verdeling volgt het 70%-belang in de verkoper."
        },
        {
          "journal": [
            [
              "Deelneming Sigma",
              "29.120",
              ""
            ],
            [
              "Voorziening belastingen",
              "7.280",
              ""
            ],
            [
              "Belang derden",
              "12.480,00",
              ""
            ],
            [
              "Voorziening belastingen",
              "3.120,00",
              ""
            ],
            [
              "Voorraad",
              "",
              "52.000"
            ]
          ],
          "journalNumeric": [
            [
              "Deelneming Sigma",
              29120,
              0
            ],
            [
              "Voorziening belastingen",
              7280,
              0
            ],
            [
              "Belang derden",
              12480.000000000002,
              0
            ],
            [
              "Voorziening belastingen",
              3120.0000000000005,
              0
            ],
            [
              "Voorraad",
              0,
              52000
            ]
          ],
          "why": "Het belastingtarief is 25%."
        },
        {
          "journal": [
            [
              "Deelneming Sigma",
              "6.300",
              ""
            ],
            [
              "Voorziening belastingen",
              "2.100",
              ""
            ],
            [
              "Belang derden",
              "2.700,00",
              ""
            ],
            [
              "Voorziening belastingen",
              "900,00",
              ""
            ],
            [
              "Voorraad",
              "",
              "12.000"
            ]
          ],
          "journalNumeric": [
            [
              "Deelneming Sigma",
              6300,
              0
            ],
            [
              "Voorziening belastingen",
              2100,
              0
            ],
            [
              "Belang derden",
              2700.0000000000005,
              0
            ],
            [
              "Voorziening belastingen",
              900.0000000000001,
              0
            ],
            [
              "Voorraad",
              0,
              12000
            ]
          ],
          "why": "De balans gebruikt € 52.000 eindwinst, niet € 12.000 mutatie."
        }
      ],
      "correct": 0,
      "explanation": [
        "Interne eindcorrectie vóór belasting: 70% × € 52.000 = € 36.400. Dit splitst in € 27.300 deelneming en € 9.100 belastinglatentie.",
        "Het resterende deel van € 15.600 splitst in € 11.700 belang derden en € 3.900 belastinglatentie."
      ],
      "pattern": "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het gevraagde onderwerp bij de consolidatie. Herken eerst welke gebeurtenis of correctie moet worden geboekt. Let op de beslissende gegevens: Bepaal wie levert aan wie, waar de voorraad ligt en welk belang moeder in leverancier en afnemer heeft. Gebruik de winstopslag of marge met de juiste noemer. Houd beginstand, eindstand en toe- of afname apart; pas de gegeven waarderingsgrondslag en winstbelasting toe. Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten.",
      "refs": [
        "nab",
        "thnab"
      ],
      "related": [
        14,
        23
      ],
      "variant": true,
      "guidance": {
        "lesson": "sidestream-nab",
        "title": "Niet-afnemend sidestream op de geconsolideerde balans",
        "task": "Welke aanvullende IC-balanseliminatie verwijdert de eindwinst uit Delta's voorraad en neemt de interne correctie op Sigma terug, volgens de afzonderlijke syllabus-basiseliminatie?",
        "rules": "De voorraad wordt voor de volledige ongerealiseerde eindwinst verlaagd. Het interne netto deel wordt teruggenomen op deelneming Sigma; het niet door Atlas gehouden deel wordt op belang derden verwerkt. De belastinglatentie wordt op de volledige gecorrigeerde winst zichtbaar, eventueel uitgesplitst per deel. Een jaarmutatie alleen is voor deze eindbalanscorrectie onvoldoende.",
        "pattern": [
          "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het gevraagde onderwerp bij de consolidatie. Herken eerst welke gebeurtenis of correctie moet worden geboekt.",
          "Let op de beslissende gegevens: Bepaal wie levert aan wie, waar de voorraad ligt en welk belang moeder in leverancier en afnemer heeft. Gebruik de winstopslag of marge met de juiste noemer. Houd beginstand, eindstand en toe- of afname apart; pas de gegeven waarderingsgrondslag en winstbelasting toe.",
          "Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten."
        ]
      },
      "caseTables": [
        {
          "caption": "Ingevulde voorraadtabel bij deze zelfstandige casus",
          "note": "Gebruik deze hulptabel voor de gevraagde boeking of aansluiting. Alle winst- en correctiebedragen zijn vóór belasting; de mutatie is eindstand minus beginstand.",
          "headers": [
            "Datum",
            "Voorraad",
            "Niet-gerealiseerde intercompanywinst in voorraad",
            "Interne correctie",
            "Eliminatie t.l.v. aandeel derden",
            "Eliminatie t.l.v. geconsolideerd resultaat"
          ],
          "rows": [
            [
              "Percentage",
              "",
              "100%",
              "70%",
              "30%",
              "0%"
            ],
            [
              "Begin boekjaar",
              200000,
              40000,
              28000,
              12000,
              "n.v.t."
            ],
            [
              "Einde boekjaar",
              260000,
              52000,
              36400,
              15600,
              "n.v.t."
            ],
            [
              "Toename",
              60000,
              12000,
              8400,
              3600,
              "n.v.t."
            ]
          ],
          "completed": true
        }
      ]
    },
    {
      "id": 20,
      "stage": 3,
      "title": "Resultaat deelnemingen elimineren",
      "type": "Journaalpost",
      "intro": "Maak eerst de eliminatie van het resultaat deelnemingen. Het aandeel derden in deze eerste post wordt bepaald op basis van de nog ongecorrigeerde resultaten van de deelnemingen.",
      "facts": [
        [
          "Belang Atlas",
          "70% Sigma; 90% Delta; waardering NVW."
        ],
        [
          "Resultaat Sigma / Delta",
          "€ 240.000 / € 160.000, beide na winstbelasting."
        ],
        [
          "Interne correctie Atlas",
          "€ 6.300 verlaging resultaat deelneming Sigma wegens sidestream niet-afnemend belang."
        ],
        [
          "Overige correcties",
          "Geen. De afzonderlijke eliminatie van de goederenstroom volgt later."
        ]
      ],
      "task": "Welke eerste W&V-eliminatie verwijdert Atlas' werkelijk geboekte resultaat deelnemingen, met het derdenaandeel berekend op de nog ongecorrigeerde dochterresultaten, terwijl de afzonderlijke goedereneliminatie later volgt?",
      "options": [
        {
          "journal": [
            [
              "Resultaat deelnemingen Atlas",
              "312.000",
              ""
            ],
            [
              "Aandeel derden",
              "88.000",
              ""
            ],
            [
              "Resultaat na belastingen Sigma",
              "",
              "240.000"
            ],
            [
              "Resultaat na belastingen Delta",
              "",
              "160.000"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat deelnemingen Atlas",
              312000,
              0
            ],
            [
              "Aandeel derden",
              88000,
              0
            ],
            [
              "Resultaat na belastingen Sigma",
              0,
              240000
            ],
            [
              "Resultaat na belastingen Delta",
              0,
              160000
            ]
          ],
          "why": "Het al gecorrigeerde resultaat deelnemingen wordt niet volledig geëlimineerd."
        },
        {
          "journal": [
            [
              "Resultaat deelnemingen Atlas",
              "305.700",
              ""
            ],
            [
              "Aandeel derden",
              "88.000",
              ""
            ],
            [
              "Resultaat na belastingen Sigma",
              "",
              "233.700"
            ],
            [
              "Resultaat na belastingen Delta",
              "",
              "160.000"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat deelnemingen Atlas",
              305700,
              0
            ],
            [
              "Aandeel derden",
              88000,
              0
            ],
            [
              "Resultaat na belastingen Sigma",
              0,
              233700
            ],
            [
              "Resultaat na belastingen Delta",
              0,
              160000
            ]
          ],
          "why": ""
        },
        {
          "journal": [
            [
              "Resultaat deelnemingen Atlas",
              "318.300",
              ""
            ],
            [
              "Aandeel derden",
              "88.000",
              ""
            ],
            [
              "Resultaat na belastingen Sigma",
              "",
              "246.300"
            ],
            [
              "Resultaat na belastingen Delta",
              "",
              "160.000"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat deelnemingen Atlas",
              318300,
              0
            ],
            [
              "Aandeel derden",
              88000,
              0
            ],
            [
              "Resultaat na belastingen Sigma",
              0,
              246300
            ],
            [
              "Resultaat na belastingen Delta",
              0,
              160000
            ]
          ],
          "why": "De interne correctie verlaagde het resultaat; deze optie verhoogt het juist."
        },
        {
          "journal": [
            [
              "Resultaat deelnemingen Atlas",
              "305.700",
              ""
            ],
            [
              "Aandeel derden",
              "94.300",
              ""
            ],
            [
              "Resultaat na belastingen Sigma",
              "",
              "240.000"
            ],
            [
              "Resultaat na belastingen Delta",
              "",
              "160.000"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat deelnemingen Atlas",
              305700,
              0
            ],
            [
              "Aandeel derden",
              94300,
              0
            ],
            [
              "Resultaat na belastingen Sigma",
              0,
              240000
            ],
            [
              "Resultaat na belastingen Delta",
              0,
              160000
            ]
          ],
          "why": "Je vangt de interne correctie ten onrechte op in het eerste aandeel derden."
        }
      ],
      "correct": 1,
      "explanation": [
        "Resultaat deelnemingen Atlas: 70% × € 240.000 + 90% × € 160.000 − € 6.300 = € 305.700.",
        "Aandeel derden in deze eerste post: 30% × € 240.000 + 10% × € 160.000 = € 88.000.",
        "Van Sigma wordt eerst € 233.700 resultaat geëlimineerd. De afzonderlijke goedereneliminatie verwerkt de resterende aansluiting."
      ],
      "pattern": "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het resultaat uit deelneming in de geconsolideerde winst-en-verliesrekening. Herken eerst welke gebeurtenis of correctie moet worden geboekt. Let op de beslissende gegevens: Tel stemrechten apart van winstrechten. Let op aandelen zonder stemrecht, eigen aandelen, stemrechtovereenkomsten en benoemingsmacht. Controleer ook de rechtsvorm: een natuurlijke persoon is geen moederrechtspersoon; bij een v.o.f. kan volledige aansprakelijkheid beslissend zijn. Pas alleen een criterium toe waarvoor de casus gegevens geeft. Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten.",
      "refs": [
        "nab",
        "mod",
        "kis"
      ],
      "related": [
        19,
        25,
        30
      ],
      "variant": true,
      "guidance": {
        "lesson": "consolidatie-nvw",
        "title": "Eerst het werkelijk geboekte resultaat deelnemingen elimineren",
        "task": "Welke eerste W&V-eliminatie verwijdert Atlas' werkelijk geboekte resultaat deelnemingen, met het derdenaandeel berekend op de nog ongecorrigeerde dochterresultaten, terwijl de afzonderlijke goedereneliminatie later volgt?",
        "rules": "De syllabus elimineert hier het bedrag dat daadwerkelijk als resultaat deelnemingen bij de moeder is geboekt. Door een interne IC-correctie kan dat afwijken van het gewone aandeel in de dochterresultaten. De eerste eliminatie en de latere goedereneliminatie vormen samen één sluitende set. Het resterende deel van het dochterresultaat wordt daarom niet willekeurig in het aandeel derden ondergebracht.",
        "pattern": [
          "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het resultaat uit deelneming in de geconsolideerde winst-en-verliesrekening. Herken eerst welke gebeurtenis of correctie moet worden geboekt.",
          "Let op de beslissende gegevens: Tel stemrechten apart van winstrechten. Let op aandelen zonder stemrecht, eigen aandelen, stemrechtovereenkomsten en benoemingsmacht. Controleer ook de rechtsvorm: een natuurlijke persoon is geen moederrechtspersoon; bij een v.o.f. kan volledige aansprakelijkheid beslissend zijn. Pas alleen een criterium toe waarvoor de casus gegevens geeft.",
          "Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten."
        ]
      },
      "caseTables": []
    },
    {
      "id": 21,
      "stage": 4,
      "title": "Drie correctiekolommen",
      "type": "Voorraadtabel",
      "intro": "Atlas onderzoekt een levering tussen twee deelnemingen.",
      "facts": [
        [
          "Belangen Atlas",
          "Sigma 90%; Delta 70%; beide tegen NVW en integraal geconsolideerd."
        ],
        [
          "Goederenstroom",
          "Sigma → Delta"
        ],
        [
          "Voorraad bij Delta: begin / eind",
          "€ 300.000 / € 400.000, afkomstig van Sigma."
        ],
        [
          "Winst in verkoopprijs",
          "30%, in beide voorraden."
        ],
        [
          "Winstbelasting",
          "20%"
        ]
      ],
      "task": "Welke voorraadtabel hoort bij Sigma naar Delta wanneer Atlas 90% van de verkoper en 70% van de koper houdt, beide tegen NVW? Vul intern, derden en aanvullend meerderheidsdeel vóór belasting in.",
      "options": [
        {
          "table": {
            "headers": [
              "Datum",
              "Voorraad bij koper",
              "Niet-gerealiseerde intercompanywinst (100%)",
              "Interne correctie bij moeder (70%)",
              "Eliminatie t.l.v. aandeel derden (20%)",
              "Eliminatie t.l.v. geconsolideerd resultaat (10%)"
            ],
            "rows": [
              [
                "Begin boekjaar",
                "300.000",
                "90.000",
                "63.000,00",
                "18.000",
                "9.000"
              ],
              [
                "Eind boekjaar",
                "400.000",
                "120.000",
                "84.000",
                "24.000",
                "12.000"
              ],
              [
                "Mutatie",
                "100.000",
                "30.000",
                "21.000",
                "6.000",
                "3.000"
              ]
            ]
          },
          "why": "Het derdenpercentage en het verschil tussen de belangen zijn verwisseld.",
          "values": [
            [
              300000,
              90000,
              62999.99999999999,
              18000,
              9000
            ],
            [
              400000,
              120000,
              84000,
              24000,
              12000
            ]
          ]
        },
        {
          "table": {
            "headers": [
              "Datum",
              "Voorraad bij koper",
              "Niet-gerealiseerde intercompanywinst (100%)",
              "Interne correctie bij moeder (70%)",
              "Eliminatie t.l.v. aandeel derden (10%)",
              "Eliminatie t.l.v. geconsolideerd resultaat (20%)"
            ],
            "rows": [
              [
                "Begin boekjaar",
                "300.000",
                "90.000",
                "63.000,00",
                "9.000",
                "18.000"
              ],
              [
                "Eind boekjaar",
                "400.000",
                "120.000",
                "84.000",
                "12.000",
                "24.000"
              ],
              [
                "Mutatie",
                "100.000",
                "30.000",
                "21.000",
                "3.000",
                "6.000"
              ]
            ]
          },
          "why": "",
          "values": [
            [
              300000,
              90000,
              62999.99999999999,
              9000,
              18000
            ],
            [
              400000,
              120000,
              84000,
              12000,
              24000
            ]
          ]
        },
        {
          "table": {
            "headers": [
              "Datum",
              "Voorraad bij koper",
              "Niet-gerealiseerde intercompanywinst (100%)",
              "Interne correctie bij moeder (90%)",
              "Eliminatie t.l.v. aandeel derden (10%)",
              "Eliminatie t.l.v. geconsolideerd resultaat (0%)"
            ],
            "rows": [
              [
                "Begin boekjaar",
                "300.000",
                "90.000",
                "81.000",
                "9.000",
                "0"
              ],
              [
                "Eind boekjaar",
                "400.000",
                "120.000",
                "108.000",
                "12.000",
                "0"
              ],
              [
                "Mutatie",
                "100.000",
                "30.000",
                "27.000",
                "3.000",
                "0"
              ]
            ]
          },
          "why": "Dit corrigeert intern het verkopersbelang terwijl bij deze afnemende route het kopersbelang bepalend is.",
          "values": [
            [
              300000,
              90000,
              81000,
              9000,
              0
            ],
            [
              400000,
              120000,
              108000,
              12000,
              0
            ]
          ]
        },
        {
          "table": {
            "headers": [
              "Datum",
              "Voorraad bij koper",
              "Niet-gerealiseerde intercompanywinst (100%)",
              "Interne correctie bij moeder (70%)",
              "Eliminatie t.l.v. aandeel derden (30%)",
              "Eliminatie t.l.v. geconsolideerd resultaat (0%)"
            ],
            "rows": [
              [
                "Begin boekjaar",
                "300.000",
                "90.000",
                "63.000,00",
                "27.000",
                "0"
              ],
              [
                "Eind boekjaar",
                "400.000",
                "120.000",
                "84.000",
                "36.000",
                "0"
              ],
              [
                "Mutatie",
                "100.000",
                "30.000",
                "21.000",
                "9.000",
                "0"
              ]
            ]
          },
          "why": "De 30% bestaat uit 10% derden en 20% aanvullende correctie voor de meerderheid.",
          "values": [
            [
              300000,
              90000,
              62999.99999999999,
              27000,
              0
            ],
            [
              400000,
              120000,
              84000,
              36000,
              0
            ]
          ]
        }
      ],
      "correct": 1,
      "explanation": [
        "Interne correctie: 70%, het belang in de koper. Derden: 10%, het minderheidsbelang in de verkoper. Aanvullend geconsolideerd: 90% − 70% = 20%.",
        "De winst stijgt van € 90.000 naar € 120.000; de € 30.000 mutatie wordt verdeeld in € 21.000, € 3.000 en € 6.000."
      ],
      "pattern": "Herken de vraag: Een voorraadtabel vraagt om het verband tussen beginvoorraad, eindvoorraad, niet-gerealiseerde winst en de verdeling van de correctie. Let op de beslissende gegevens: Bepaal wie levert aan wie, waar de voorraad ligt en welk belang moeder in leverancier en afnemer heeft. Gebruik de winstopslag of marge met de juiste noemer. Houd beginstand, eindstand en toe- of afname apart; pas de gegeven waarderingsgrondslag en winstbelasting toe. Vorm van het antwoord: Vul de gevraagde rijen en kolommen in. Laat zien hoe de niet-gerealiseerde winst aansluit op interne correctie, aandeel derden en geconsolideerd resultaat.",
      "refs": [
        "ab",
        "kis",
        "thab"
      ],
      "related": [
        16,
        22,
        23,
        24
      ],
      "variant": true,
      "guidance": {
        "lesson": "sidestream-ab",
        "title": "Afnemend sidestream heeft drie verschillende delen",
        "task": "Welke voorraadtabel hoort bij Sigma naar Delta wanneer Atlas 90% van de verkoper en 70% van de koper houdt, beide tegen NVW? Vul intern, derden en aanvullend meerderheidsdeel vóór belasting in.",
        "rules": "Bij sidestream afnemend belang gebruikt de interne correctie het lagere belang in de koper. Het derdenpercentage volgt juist het minderheidsbelang in de verkoper. Het verschil tussen verkopers- en kopersbelang vormt de aanvullende correctie voor de meerderheid. Deze drie percentages verklaren samen de volledige winst in de voorraad.",
        "pattern": [
          "Herken de vraag: Een voorraadtabel vraagt om het verband tussen beginvoorraad, eindvoorraad, niet-gerealiseerde winst en de verdeling van de correctie.",
          "Let op de beslissende gegevens: Bepaal wie levert aan wie, waar de voorraad ligt en welk belang moeder in leverancier en afnemer heeft. Gebruik de winstopslag of marge met de juiste noemer. Houd beginstand, eindstand en toe- of afname apart; pas de gegeven waarderingsgrondslag en winstbelasting toe.",
          "Vorm van het antwoord: Vul de gevraagde rijen en kolommen in. Laat zien hoe de niet-gerealiseerde winst aansluit op interne correctie, aandeel derden en geconsolideerd resultaat."
        ]
      },
      "caseTables": [
        {
          "caption": "Voorraadgegevens en uitwerksjabloon bij deze vraag",
          "note": "De voorraadbedragen zijn gegeven tegen de onderlinge verkoopprijs. De lege winst- en correctiekolommen zijn uit te werken; zij bevatten niet het antwoord.",
          "headers": [
            "Datum",
            "Voorraad",
            "Niet-gerealiseerde intercompanywinst in voorraad",
            "Interne correctie",
            "Eliminatie t.l.v. aandeel derden",
            "Eliminatie t.l.v. geconsolideerd resultaat"
          ],
          "rows": [
            [
              "Percentage",
              "",
              "100%",
              "…%",
              "…%",
              "…%"
            ],
            [
              "Begin boekjaar",
              300000,
              "",
              "",
              "",
              ""
            ],
            [
              "Einde boekjaar",
              400000,
              "",
              "",
              "",
              ""
            ],
            [
              "Toe-/afname",
              "",
              "",
              "",
              "",
              ""
            ]
          ]
        }
      ]
    },
    {
      "id": 22,
      "stage": 4,
      "title": "Afnemend belang, toenemende voorraad",
      "type": "Journaalpost",
      "intro": "Atlas heeft het reguliere resultaat van Sigma al verwerkt.",
      "facts": [
        [
          "Belangen Atlas",
          "Sigma 90%; Delta 70%; beide tegen NVW en integraal geconsolideerd."
        ],
        [
          "Goederenstroom",
          "Sigma → Delta"
        ],
        [
          "Voorraad bij Delta: begin / eind",
          "€ 300.000 / € 400.000, afkomstig van Sigma."
        ],
        [
          "Winst in verkoopprijs",
          "30%, in beide voorraden."
        ],
        [
          "Winstbelasting",
          "20%"
        ]
      ],
      "task": "Welke interne journaalpost boekt Atlas voor de toename van de winst op Sigma's levering aan Delta bij afnemend belang en 20% winstbelasting?",
      "options": [
        {
          "journal": [
            [
              "Resultaat deelneming Sigma",
              "21.600",
              ""
            ],
            [
              "Deelneming Sigma",
              "",
              "21.600"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat deelneming Sigma",
              21600,
              0
            ],
            [
              "Deelneming Sigma",
              0,
              21600
            ]
          ],
          "why": "Dit gebruikt 90%, het verkopersbelang, in plaats van 70%."
        },
        {
          "journal": [
            [
              "Resultaat deelneming Sigma",
              "15.750",
              ""
            ],
            [
              "Deelneming Sigma",
              "",
              "15.750"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat deelneming Sigma",
              15750,
              0
            ],
            [
              "Deelneming Sigma",
              0,
              15750
            ]
          ],
          "why": "Dit gebruikt 25% belasting in plaats van 20%."
        },
        {
          "journal": [
            [
              "Resultaat deelneming Sigma",
              "16.800",
              ""
            ],
            [
              "Deelneming Sigma",
              "",
              "16.800"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat deelneming Sigma",
              16800,
              0
            ],
            [
              "Deelneming Sigma",
              0,
              16800
            ]
          ],
          "why": ""
        },
        {
          "journal": [
            [
              "Resultaat deelneming Delta",
              "16.800",
              ""
            ],
            [
              "Deelneming Delta",
              "",
              "16.800"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat deelneming Delta",
              16800,
              0
            ],
            [
              "Deelneming Delta",
              0,
              16800
            ]
          ],
          "why": "De correctie raakt de verkoper Sigma, ook al wordt gerekend met het belang in de koper."
        }
      ],
      "correct": 2,
      "explanation": [
        "70% × € 30.000 × 80% = € 16.800.",
        "De rekening is deelneming Sigma: Sigma heeft de winst gemaakt. Het percentage is 70%: het belang in de koper."
      ],
      "pattern": "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het gevraagde onderwerp. Herken eerst welke gebeurtenis of correctie moet worden geboekt. Let op de beslissende gegevens: Bepaal welke rekening toeneemt of afneemt en vanuit welke onderneming wordt geboekt. Zoek de waarderingsgrondslag, het belang en het tijdstip in de casus. Een eliminatie verwijdert een interne post; een enkelvoudige boeking verwerkt de gebeurtenis bij de onderneming zelf. Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten.",
      "refs": [
        "ab",
        "kis",
        "thab"
      ],
      "related": [
        18,
        21,
        24
      ],
      "variant": true,
      "guidance": {
        "lesson": "sidestream-ab",
        "title": "Rekening verkoper, percentage koper",
        "task": "Welke interne journaalpost boekt Atlas voor de toename van de winst op Sigma's levering aan Delta bij afnemend belang en 20% winstbelasting?",
        "rules": "De winst is door Sigma behaald, zodat resultaat deelneming Sigma en deelneming Sigma de betrokken rekeningen blijven. Het interne correctiepercentage is bij deze afnemende route echter het 70%-belang in de koper. Bereken de jaarmutatie en neem dit interne deel na belasting. Rekeningkeuze en percentagekeuze zijn dus afzonderlijke stappen.",
        "pattern": [
          "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het gevraagde onderwerp. Herken eerst welke gebeurtenis of correctie moet worden geboekt.",
          "Let op de beslissende gegevens: Bepaal welke rekening toeneemt of afneemt en vanuit welke onderneming wordt geboekt. Zoek de waarderingsgrondslag, het belang en het tijdstip in de casus. Een eliminatie verwijdert een interne post; een enkelvoudige boeking verwerkt de gebeurtenis bij de onderneming zelf.",
          "Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten."
        ]
      },
      "caseTables": [
        {
          "caption": "Ingevulde voorraadtabel bij deze zelfstandige casus",
          "note": "Gebruik deze hulptabel voor de gevraagde boeking of aansluiting. Alle winst- en correctiebedragen zijn vóór belasting; de mutatie is eindstand minus beginstand.",
          "headers": [
            "Datum",
            "Voorraad",
            "Niet-gerealiseerde intercompanywinst in voorraad",
            "Interne correctie",
            "Eliminatie t.l.v. aandeel derden",
            "Eliminatie t.l.v. geconsolideerd resultaat"
          ],
          "rows": [
            [
              "Percentage",
              "",
              "100%",
              "70%",
              "10%",
              "20%"
            ],
            [
              "Begin boekjaar",
              300000,
              90000,
              63000,
              9000,
              18000
            ],
            [
              "Einde boekjaar",
              400000,
              120000,
              84000,
              12000,
              24000
            ],
            [
              "Toename",
              100000,
              30000,
              21000,
              3000,
              6000
            ]
          ],
          "completed": true
        }
      ]
    },
    {
      "id": 23,
      "stage": 4,
      "title": "Afnemend belang in de balans",
      "type": "Journaalpost",
      "intro": "Atlas heeft alle enkelvoudige correcties geboekt. Geef alleen de balanseliminaties voor deze goederenstroom.",
      "facts": [
        [
          "Belangen Atlas",
          "Sigma 90%; Delta 70%; beide tegen NVW en integraal geconsolideerd."
        ],
        [
          "Goederenstroom",
          "Sigma → Delta"
        ],
        [
          "Voorraad bij Delta: begin / eind",
          "€ 300.000 / € 400.000, afkomstig van Sigma."
        ],
        [
          "Winst in verkoopprijs",
          "30%, in beide voorraden."
        ],
        [
          "Winstbelasting",
          "20%"
        ]
      ],
      "task": "Welke twee balanseliminaties horen bij deze afnemende sidestream: uitvoegen van de eindwinst en invoegen van het aanvullende meerderheidsdeel uit de beginvoorraad, na de interne NVW-correcties?",
      "options": [
        {
          "journals": [
            {
              "label": "Uitvoegen winst eindvoorraad",
              "journal": [
                [
                  "Deelneming Sigma",
                  "67.200",
                  ""
                ],
                [
                  "Voorziening belastingen",
                  "16.800",
                  ""
                ],
                [
                  "Belang derden",
                  "9.600,00",
                  ""
                ],
                [
                  "Voorziening belastingen",
                  "2.400,00",
                  ""
                ],
                [
                  "Resultaat boekjaar",
                  "19.200,00",
                  ""
                ],
                [
                  "Voorziening belastingen",
                  "4.800,00",
                  ""
                ],
                [
                  "Voorraad",
                  "",
                  "120.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Deelneming Sigma",
                  67200,
                  0
                ],
                [
                  "Voorziening belastingen",
                  16800,
                  0
                ],
                [
                  "Belang derden",
                  9599.999999999998,
                  0
                ],
                [
                  "Voorziening belastingen",
                  2399.9999999999995,
                  0
                ],
                [
                  "Resultaat boekjaar",
                  19200.000000000007,
                  0
                ],
                [
                  "Voorziening belastingen",
                  4800.000000000002,
                  0
                ],
                [
                  "Voorraad",
                  0,
                  120000
                ]
              ],
              "why": ""
            },
            {
              "label": "Invoegen beginstand",
              "journal": [
                [
                  "Overige reserves",
                  "19.200,00",
                  ""
                ],
                [
                  "Resultaat boekjaar",
                  "",
                  "19.200,00"
                ]
              ],
              "journalNumeric": [
                [
                  "Overige reserves",
                  19200.000000000007,
                  0
                ],
                [
                  "Resultaat boekjaar",
                  0,
                  19200.000000000007
                ]
              ],
              "why": ""
            }
          ],
          "why": "De invoeging gebruikt de beginvoorraad, niet de eindvoorraad."
        },
        {
          "journals": [
            {
              "label": "Uitvoegen winst eindvoorraad",
              "journal": [
                [
                  "Deelneming Sigma",
                  "67.200",
                  ""
                ],
                [
                  "Voorziening belastingen",
                  "16.800",
                  ""
                ],
                [
                  "Belang derden",
                  "9.600,00",
                  ""
                ],
                [
                  "Voorziening belastingen",
                  "2.400,00",
                  ""
                ],
                [
                  "Resultaat boekjaar",
                  "19.200,00",
                  ""
                ],
                [
                  "Voorziening belastingen",
                  "4.800,00",
                  ""
                ],
                [
                  "Voorraad",
                  "",
                  "120.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Deelneming Sigma",
                  67200,
                  0
                ],
                [
                  "Voorziening belastingen",
                  16800,
                  0
                ],
                [
                  "Belang derden",
                  9599.999999999998,
                  0
                ],
                [
                  "Voorziening belastingen",
                  2399.9999999999995,
                  0
                ],
                [
                  "Resultaat boekjaar",
                  19200.000000000007,
                  0
                ],
                [
                  "Voorziening belastingen",
                  4800.000000000002,
                  0
                ],
                [
                  "Voorraad",
                  0,
                  120000
                ]
              ],
              "why": ""
            },
            {
              "label": "Invoegen beginstand",
              "journal": [
                [
                  "Overige reserves",
                  "14.400,00",
                  ""
                ],
                [
                  "Resultaat boekjaar",
                  "",
                  "14.400,00"
                ]
              ],
              "journalNumeric": [
                [
                  "Overige reserves",
                  14400.000000000007,
                  0
                ],
                [
                  "Resultaat boekjaar",
                  0,
                  14400.000000000007
                ]
              ],
              "why": ""
            }
          ],
          "why": ""
        },
        {
          "journals": [
            {
              "label": "Uitvoegen winst eindvoorraad",
              "journal": [
                [
                  "Deelneming Sigma",
                  "67.200",
                  ""
                ],
                [
                  "Voorziening belastingen",
                  "16.800",
                  ""
                ],
                [
                  "Belang derden",
                  "19.200,00",
                  ""
                ],
                [
                  "Voorziening belastingen",
                  "4.800,00",
                  ""
                ],
                [
                  "Resultaat boekjaar",
                  "9.600,00",
                  ""
                ],
                [
                  "Voorziening belastingen",
                  "2.400,00",
                  ""
                ],
                [
                  "Voorraad",
                  "",
                  "120.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Deelneming Sigma",
                  67200,
                  0
                ],
                [
                  "Voorziening belastingen",
                  16800,
                  0
                ],
                [
                  "Belang derden",
                  19199.999999999996,
                  0
                ],
                [
                  "Voorziening belastingen",
                  4799.999999999999,
                  0
                ],
                [
                  "Resultaat boekjaar",
                  9600.00000000001,
                  0
                ],
                [
                  "Voorziening belastingen",
                  2400.0000000000023,
                  0
                ],
                [
                  "Voorraad",
                  0,
                  120000
                ]
              ],
              "why": ""
            },
            {
              "label": "Invoegen beginstand",
              "journal": [
                [
                  "Overige reserves",
                  "7.200,00",
                  ""
                ],
                [
                  "Resultaat boekjaar",
                  "",
                  "7.200,00"
                ]
              ],
              "journalNumeric": [
                [
                  "Overige reserves",
                  7200.000000000006,
                  0
                ],
                [
                  "Resultaat boekjaar",
                  0,
                  7200.000000000006
                ]
              ],
              "why": ""
            }
          ],
          "why": "Het belang in de verkoper is 90%, niet 80%."
        },
        {
          "journals": [
            {
              "label": "Uitvoegen winst eindvoorraad",
              "journal": [
                [
                  "Deelneming Sigma",
                  "16.800",
                  ""
                ],
                [
                  "Voorziening belastingen",
                  "4.200",
                  ""
                ],
                [
                  "Belang derden",
                  "2.400,00",
                  ""
                ],
                [
                  "Voorziening belastingen",
                  "600,00",
                  ""
                ],
                [
                  "Resultaat boekjaar",
                  "4.800,00",
                  ""
                ],
                [
                  "Voorziening belastingen",
                  "1.200,00",
                  ""
                ],
                [
                  "Voorraad",
                  "",
                  "30.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Deelneming Sigma",
                  16800,
                  0
                ],
                [
                  "Voorziening belastingen",
                  4200,
                  0
                ],
                [
                  "Belang derden",
                  2399.9999999999995,
                  0
                ],
                [
                  "Voorziening belastingen",
                  599.9999999999999,
                  0
                ],
                [
                  "Resultaat boekjaar",
                  4800.000000000002,
                  0
                ],
                [
                  "Voorziening belastingen",
                  1200.0000000000005,
                  0
                ],
                [
                  "Voorraad",
                  0,
                  30000
                ]
              ],
              "why": ""
            },
            {
              "label": "Invoegen beginstand",
              "journal": [
                [
                  "Overige reserves",
                  "",
                  ""
                ],
                [
                  "Resultaat boekjaar",
                  "",
                  ""
                ]
              ],
              "journalNumeric": [
                [
                  "Overige reserves",
                  0,
                  0
                ],
                [
                  "Resultaat boekjaar",
                  0,
                  0
                ]
              ],
              "why": ""
            }
          ],
          "why": "Dit gebruikt alleen de jaarmutatie in plaats van eindvoorraad en beginstand."
        }
      ],
      "correct": 1,
      "explanation": [
        "Eindwinst € 120.000 wordt gesplitst in 70% intern, 10% derden en 20% aanvullend resultaat. Elk deel wordt gesplitst naar 80% na belasting en 20% latentie.",
        "Invoeging: € 90.000 × 20% × 80% = € 14.400.",
        "Het aanvullende saldo op resultaat boekjaar is € 19.200 debet − € 14.400 credit = € 4.800 debet."
      ],
      "pattern": "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het gevraagde onderwerp bij de consolidatie. Herken eerst welke gebeurtenis of correctie moet worden geboekt. Let op de beslissende gegevens: Bepaal wie levert aan wie, waar de voorraad ligt en welk belang moeder in leverancier en afnemer heeft. Gebruik de winstopslag of marge met de juiste noemer. Houd beginstand, eindstand en toe- of afname apart; pas de gegeven waarderingsgrondslag en winstbelasting toe. Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten.",
      "refs": [
        "ab",
        "kis",
        "thab"
      ],
      "related": [
        9,
        21,
        29
      ],
      "variant": true,
      "guidance": {
        "lesson": "sidestream-ab",
        "title": "Eindwinst en aanvullende beginwinst afzonderlijk verwerken",
        "task": "Welke twee balanseliminaties horen bij deze afnemende sidestream: uitvoegen van de eindwinst en invoegen van het aanvullende meerderheidsdeel uit de beginvoorraad, na de interne NVW-correcties?",
        "rules": "Splits de volledige eindwinst volgens de tabel in intern deel, derden en aanvullend meerderheidsdeel. Bij de balanseliminatie staan tegenover voorraad de terugname van de interne deelnemingscorrectie, belang derden, resultaat boekjaar en belastinglatenties. Alleen voor het aanvullende meerderheidsdeel wordt de netto beginwinst vanuit overige reserves in resultaat boekjaar ingevoegd.",
        "pattern": [
          "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het gevraagde onderwerp bij de consolidatie. Herken eerst welke gebeurtenis of correctie moet worden geboekt.",
          "Let op de beslissende gegevens: Bepaal wie levert aan wie, waar de voorraad ligt en welk belang moeder in leverancier en afnemer heeft. Gebruik de winstopslag of marge met de juiste noemer. Houd beginstand, eindstand en toe- of afname apart; pas de gegeven waarderingsgrondslag en winstbelasting toe.",
          "Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten."
        ]
      },
      "caseTables": [
        {
          "caption": "Ingevulde voorraadtabel bij deze zelfstandige casus",
          "note": "Gebruik deze hulptabel voor de gevraagde boeking of aansluiting. Alle winst- en correctiebedragen zijn vóór belasting; de mutatie is eindstand minus beginstand.",
          "headers": [
            "Datum",
            "Voorraad",
            "Niet-gerealiseerde intercompanywinst in voorraad",
            "Interne correctie",
            "Eliminatie t.l.v. aandeel derden",
            "Eliminatie t.l.v. geconsolideerd resultaat"
          ],
          "rows": [
            [
              "Percentage",
              "",
              "100%",
              "70%",
              "10%",
              "20%"
            ],
            [
              "Begin boekjaar",
              300000,
              90000,
              63000,
              9000,
              18000
            ],
            [
              "Einde boekjaar",
              400000,
              120000,
              84000,
              12000,
              24000
            ],
            [
              "Toename",
              100000,
              30000,
              21000,
              3000,
              6000
            ]
          ],
          "completed": true
        }
      ]
    },
    {
      "id": 24,
      "stage": 4,
      "title": "Afnemend belang én afnemende voorraad",
      "type": "Journaalpost",
      "intro": "Dit is een afzonderlijke variant: de voorraad neemt af, de deelnemingspercentages blijven gelijk.",
      "facts": [
        [
          "Belangen Atlas",
          "Sigma 90%; Delta 70%; beide tegen NVW en integraal geconsolideerd."
        ],
        [
          "Goederenstroom",
          "Sigma → Delta"
        ],
        [
          "Voorraad bij Delta: begin / eind",
          "€ 400.000 / € 300.000, afkomstig van Sigma."
        ],
        [
          "Winst in verkoopprijs",
          "30%, in beide voorraden."
        ],
        [
          "Winstbelasting",
          "20%"
        ]
      ],
      "task": "Welke interne journaalpost boekt Atlas voor de vrijval van ongerealiseerde winst bij Sigma naar Delta, wanneer de voorraad afneemt maar de belangen 90% en 70% blijven?",
      "options": [
        {
          "journal": [
            [
              "Resultaat deelneming Sigma",
              "16.800",
              ""
            ],
            [
              "Deelneming Sigma",
              "",
              "16.800"
            ]
          ],
          "journalNumeric": [
            [
              "Resultaat deelneming Sigma",
              16800,
              0
            ],
            [
              "Deelneming Sigma",
              0,
              16800
            ]
          ],
          "why": "Dit verwerkt een toename in plaats van een vrijval."
        },
        {
          "journal": [
            [
              "Deelneming Sigma",
              "21.600",
              ""
            ],
            [
              "Resultaat deelneming Sigma",
              "",
              "21.600"
            ]
          ],
          "journalNumeric": [
            [
              "Deelneming Sigma",
              21600,
              0
            ],
            [
              "Resultaat deelneming Sigma",
              0,
              21600
            ]
          ],
          "why": "Dit gebruikt 90% in plaats van 70%."
        },
        {
          "journal": [
            [
              "Deelneming Sigma",
              "16.800",
              ""
            ],
            [
              "Resultaat deelneming Sigma",
              "",
              "16.800"
            ]
          ],
          "journalNumeric": [
            [
              "Deelneming Sigma",
              16800,
              0
            ],
            [
              "Resultaat deelneming Sigma",
              0,
              16800
            ]
          ],
          "why": ""
        },
        {
          "journal": [
            [
              "Deelneming Delta",
              "16.800",
              ""
            ],
            [
              "Resultaat deelneming Delta",
              "",
              "16.800"
            ]
          ],
          "journalNumeric": [
            [
              "Deelneming Delta",
              16800,
              0
            ],
            [
              "Resultaat deelneming Delta",
              0,
              16800
            ]
          ],
          "why": "De correctie hoort bij de verkopende deelneming Sigma."
        }
      ],
      "correct": 2,
      "explanation": [
        "De winst in voorraad daalt met € 30.000.",
        "70% × € 30.000 × 80% = € 16.800 komt vrij op deelneming Sigma en resultaat deelneming Sigma."
      ],
      "pattern": "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het gevraagde onderwerp. Herken eerst welke gebeurtenis of correctie moet worden geboekt. Let op de beslissende gegevens: Bepaal wie levert aan wie, waar de voorraad ligt en welk belang moeder in leverancier en afnemer heeft. Gebruik de winstopslag of marge met de juiste noemer. Houd beginstand, eindstand en toe- of afname apart; pas de gegeven waarderingsgrondslag en winstbelasting toe. Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten.",
      "refs": [
        "ab",
        "kis",
        "thab"
      ],
      "related": [
        13,
        22,
        25
      ],
      "variant": true,
      "guidance": {
        "lesson": "sidestream-ab",
        "title": "Dalende voorraad binnen een afnemende belangenroute",
        "task": "Welke interne journaalpost boekt Atlas voor de vrijval van ongerealiseerde winst bij Sigma naar Delta, wanneer de voorraad afneemt maar de belangen 90% en 70% blijven?",
        "rules": "Het afnemende belang bepaalt het interne percentage: het lagere belang in de koper. De afname van de voorraadwinst bepaalt dat eerder uitgesteld resultaat vrijvalt. De correctie verhoogt daarom deelneming Sigma en resultaat deelneming Sigma, voor het interne deel na belasting. De belangenverhouding hoeft tijdens het boekjaar niet te veranderen.",
        "pattern": [
          "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het gevraagde onderwerp. Herken eerst welke gebeurtenis of correctie moet worden geboekt.",
          "Let op de beslissende gegevens: Bepaal wie levert aan wie, waar de voorraad ligt en welk belang moeder in leverancier en afnemer heeft. Gebruik de winstopslag of marge met de juiste noemer. Houd beginstand, eindstand en toe- of afname apart; pas de gegeven waarderingsgrondslag en winstbelasting toe.",
          "Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten."
        ]
      },
      "caseTables": [
        {
          "caption": "Ingevulde voorraadtabel bij deze zelfstandige casus",
          "note": "Gebruik deze hulptabel voor de gevraagde boeking of aansluiting. Alle winst- en correctiebedragen zijn vóór belasting; de mutatie is eindstand minus beginstand.",
          "headers": [
            "Datum",
            "Voorraad",
            "Niet-gerealiseerde intercompanywinst in voorraad",
            "Interne correctie",
            "Eliminatie t.l.v. aandeel derden",
            "Eliminatie t.l.v. geconsolideerd resultaat"
          ],
          "rows": [
            [
              "Percentage",
              "",
              "100%",
              "70%",
              "10%",
              "20%"
            ],
            [
              "Begin boekjaar",
              400000,
              120000,
              84000,
              12000,
              24000
            ],
            [
              "Einde boekjaar",
              300000,
              90000,
              63000,
              9000,
              18000
            ],
            [
              "Afname",
              -100000,
              -30000,
              -21000,
              -3000,
              -6000
            ]
          ],
          "completed": true
        }
      ]
    },
    {
      "id": 25,
      "stage": 4,
      "title": "Sidestream: de W&V afronden",
      "type": "Journaalpost",
      "intro": "De interne correctie en de eerste eliminatie van resultaat deelnemingen zijn al verwerkt volgens de Nyenrode-systematiek.",
      "facts": [
        [
          "Belangen Atlas",
          "Sigma 90%; Delta 70%; beide tegen NVW en integraal geconsolideerd."
        ],
        [
          "Goederenstroom",
          "Sigma → Delta"
        ],
        [
          "Voorraad bij Delta: begin / eind",
          "€ 400.000 / € 300.000, afkomstig van Sigma."
        ],
        [
          "Winst in verkoopprijs",
          "30%, in beide voorraden."
        ],
        [
          "Winstbelasting",
          "20%"
        ],
        [
          "Onderlinge omzet in het boekjaar",
          "€ 900.000"
        ]
      ],
      "task": "Welke twee eliminaties ronden de goederenstroom in de W&V af na de al geboekte interne correctie en eerste resultaateliminatie: € 900.000 onderlinge omzet en de vrijval van voorraadwinst? Volg de beschreven Nyenrode-volgorde.",
      "options": [
        {
          "journals": [
            {
              "label": "Onderlinge omzet",
              "journal": [
                [
                  "Omzet Sigma",
                  "900.000",
                  ""
                ],
                [
                  "Kostprijs omzet Delta",
                  "",
                  "900.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Omzet Sigma",
                  900000,
                  0
                ],
                [
                  "Kostprijs omzet Delta",
                  0,
                  900000
                ]
              ],
              "why": ""
            },
            {
              "label": "Afname voorraadwinst",
              "journal": [
                [
                  "Resultaat na belastingen Sigma",
                  "16.800",
                  ""
                ],
                [
                  "Belastinglast",
                  "4.200",
                  ""
                ],
                [
                  "Aandeel derden",
                  "4.800",
                  ""
                ],
                [
                  "Belastinglast",
                  "1.200",
                  ""
                ],
                [
                  "Resultaat na belastingen (aanvullend)",
                  "2.400",
                  ""
                ],
                [
                  "Belastinglast",
                  "600",
                  ""
                ],
                [
                  "Kostprijs omzet Delta",
                  "",
                  "30.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Resultaat na belastingen Sigma",
                  16800,
                  0
                ],
                [
                  "Belastinglast",
                  4200,
                  0
                ],
                [
                  "Aandeel derden",
                  4800,
                  0
                ],
                [
                  "Belastinglast",
                  1200,
                  0
                ],
                [
                  "Resultaat na belastingen (aanvullend)",
                  2400,
                  0
                ],
                [
                  "Belastinglast",
                  600,
                  0
                ],
                [
                  "Kostprijs omzet Delta",
                  0,
                  30000
                ]
              ],
              "why": ""
            }
          ],
          "why": "Derden en het aanvullende meerderheidsdeel zijn verwisseld."
        },
        {
          "journals": [
            {
              "label": "Onderlinge omzet",
              "journal": [
                [
                  "Omzet Sigma",
                  "900.000",
                  ""
                ],
                [
                  "Kostprijs omzet Delta",
                  "",
                  "900.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Omzet Sigma",
                  900000,
                  0
                ],
                [
                  "Kostprijs omzet Delta",
                  0,
                  900000
                ]
              ],
              "why": ""
            },
            {
              "label": "Afname voorraadwinst",
              "journal": [
                [
                  "Resultaat na belastingen Sigma",
                  "16.800",
                  ""
                ],
                [
                  "Belastinglast",
                  "4.200",
                  ""
                ],
                [
                  "Aandeel derden",
                  "2.400",
                  ""
                ],
                [
                  "Belastinglast",
                  "600",
                  ""
                ],
                [
                  "Resultaat na belastingen (aanvullend)",
                  "4.800",
                  ""
                ],
                [
                  "Belastinglast",
                  "1.200",
                  ""
                ],
                [
                  "Kostprijs omzet Delta",
                  "",
                  "30.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Resultaat na belastingen Sigma",
                  16800,
                  0
                ],
                [
                  "Belastinglast",
                  4200,
                  0
                ],
                [
                  "Aandeel derden",
                  2400,
                  0
                ],
                [
                  "Belastinglast",
                  600,
                  0
                ],
                [
                  "Resultaat na belastingen (aanvullend)",
                  4800,
                  0
                ],
                [
                  "Belastinglast",
                  1200,
                  0
                ],
                [
                  "Kostprijs omzet Delta",
                  0,
                  30000
                ]
              ],
              "why": ""
            }
          ],
          "why": ""
        },
        {
          "journals": [
            {
              "label": "Onderlinge omzet",
              "journal": [
                [
                  "Omzet Sigma",
                  "900.000",
                  ""
                ],
                [
                  "Kostprijs omzet Delta",
                  "",
                  "900.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Omzet Sigma",
                  900000,
                  0
                ],
                [
                  "Kostprijs omzet Delta",
                  0,
                  900000
                ]
              ],
              "why": ""
            },
            {
              "label": "Afname voorraadwinst",
              "journal": [
                [
                  "Resultaat na belastingen Sigma",
                  "",
                  "16.800"
                ],
                [
                  "Belastinglast",
                  "",
                  "4.200"
                ],
                [
                  "Aandeel derden",
                  "",
                  "2.400"
                ],
                [
                  "Belastinglast",
                  "",
                  "600"
                ],
                [
                  "Resultaat na belastingen (aanvullend)",
                  "",
                  "4.800"
                ],
                [
                  "Belastinglast",
                  "",
                  "1.200"
                ],
                [
                  "Kostprijs omzet Delta",
                  "30.000",
                  ""
                ]
              ],
              "journalNumeric": [
                [
                  "Resultaat na belastingen Sigma",
                  0,
                  16800
                ],
                [
                  "Belastinglast",
                  0,
                  4200
                ],
                [
                  "Aandeel derden",
                  0,
                  2400
                ],
                [
                  "Belastinglast",
                  0,
                  600
                ],
                [
                  "Resultaat na belastingen (aanvullend)",
                  0,
                  4800
                ],
                [
                  "Belastinglast",
                  0,
                  1200
                ],
                [
                  "Kostprijs omzet Delta",
                  30000,
                  0
                ]
              ],
              "why": ""
            }
          ],
          "why": "Een afname verlaagt de kostprijs; deze optie verhoogt die."
        },
        {
          "journals": [
            {
              "label": "Onderlinge omzet",
              "journal": [
                [
                  "Omzet Sigma",
                  "900.000",
                  ""
                ],
                [
                  "Kostprijs omzet Delta",
                  "",
                  "900.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Omzet Sigma",
                  900000,
                  0
                ],
                [
                  "Kostprijs omzet Delta",
                  0,
                  900000
                ]
              ],
              "why": ""
            },
            {
              "label": "Afname voorraadwinst",
              "journal": [
                [
                  "Resultaat na belastingen Sigma",
                  "21.600",
                  ""
                ],
                [
                  "Belastinglast",
                  "5.400",
                  ""
                ],
                [
                  "Aandeel derden",
                  "2.400",
                  ""
                ],
                [
                  "Belastinglast",
                  "600",
                  ""
                ],
                [
                  "Kostprijs omzet Delta",
                  "",
                  "30.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Resultaat na belastingen Sigma",
                  21600,
                  0
                ],
                [
                  "Belastinglast",
                  5400,
                  0
                ],
                [
                  "Aandeel derden",
                  2400,
                  0
                ],
                [
                  "Belastinglast",
                  600,
                  0
                ],
                [
                  "Kostprijs omzet Delta",
                  0,
                  30000
                ]
              ],
              "why": ""
            }
          ],
          "why": "Het interne deel en het aanvullende meerderheidsdeel zijn samengenomen op Sigma, waardoor de aansluiting met de eerdere resultaateliminatie niet klopt."
        }
      ],
      "correct": 1,
      "explanation": [
        "De omzet wordt voor € 900.000 geëlimineerd. De kostprijs wordt daarnaast € 30.000 verlaagd door vrijval van eerder uitgestelde winst.",
        "De interne correctie na belasting is € 16.800, derden € 2.400 en de aanvullende meerderheidswinst € 4.800. De bijbehorende belastingen zijn € 4.200, € 600 en € 1.200.",
        "De twee resultaatregels hebben verschillende functies: aansluiting met het resultaat van Sigma en de aanvullende consolidatiecorrectie."
      ],
      "pattern": "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het gevraagde onderwerp in de geconsolideerde winst-en-verliesrekening. Herken eerst welke gebeurtenis of correctie moet worden geboekt. Let op de beslissende gegevens: Bepaal welke rekening toeneemt of afneemt en vanuit welke onderneming wordt geboekt. Zoek de waarderingsgrondslag, het belang en het tijdstip in de casus. Een eliminatie verwijdert een interne post; een enkelvoudige boeking verwerkt de gebeurtenis bij de onderneming zelf. Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten.",
      "refs": [
        "mod",
        "ab"
      ],
      "related": [
        20,
        24,
        29
      ],
      "variant": true,
      "guidance": {
        "lesson": "ic-boekingsmethoden",
        "title": "De W&V-aansluiting na de eerste resultaateliminatie",
        "task": "Welke twee eliminaties ronden de goederenstroom in de W&V af na de al geboekte interne correctie en eerste resultaateliminatie: € 900.000 onderlinge omzet en de vrijval van voorraadwinst? Volg de beschreven Nyenrode-volgorde.",
        "rules": "Na eliminatie van het werkelijk geboekte resultaat deelnemingen kan een deel van het dochterresultaat nog via de goederenpost moeten aansluiten. Daarom bevat deze boeking resultaat na belastingen Sigma, naast aandeel derden en het aanvullende meerderheidsresultaat. Bij vrijval wordt de kostprijs gecrediteerd. De bijbehorende belastingdelen worden afzonderlijk verwerkt.",
        "pattern": [
          "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het gevraagde onderwerp in de geconsolideerde winst-en-verliesrekening. Herken eerst welke gebeurtenis of correctie moet worden geboekt.",
          "Let op de beslissende gegevens: Bepaal welke rekening toeneemt of afneemt en vanuit welke onderneming wordt geboekt. Zoek de waarderingsgrondslag, het belang en het tijdstip in de casus. Een eliminatie verwijdert een interne post; een enkelvoudige boeking verwerkt de gebeurtenis bij de onderneming zelf.",
          "Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten."
        ]
      },
      "caseTables": [
        {
          "caption": "Ingevulde voorraadtabel bij deze zelfstandige casus",
          "note": "Gebruik deze hulptabel voor de gevraagde boeking of aansluiting. Alle winst- en correctiebedragen zijn vóór belasting; de mutatie is eindstand minus beginstand.",
          "headers": [
            "Datum",
            "Voorraad",
            "Niet-gerealiseerde intercompanywinst in voorraad",
            "Interne correctie",
            "Eliminatie t.l.v. aandeel derden",
            "Eliminatie t.l.v. geconsolideerd resultaat"
          ],
          "rows": [
            [
              "Percentage",
              "",
              "100%",
              "70%",
              "10%",
              "20%"
            ],
            [
              "Begin boekjaar",
              400000,
              120000,
              84000,
              12000,
              24000
            ],
            [
              "Einde boekjaar",
              300000,
              90000,
              63000,
              9000,
              18000
            ],
            [
              "Afname",
              -100000,
              -30000,
              -21000,
              -3000,
              -6000
            ]
          ],
          "completed": true
        }
      ]
    },
    {
      "id": 26,
      "stage": 5,
      "title": "Niet-gerealiseerde boekwinst op een machine",
      "type": "Journaalpost",
      "intro": "Atlas heeft de verkoop van de machine al in haar eigen resultaat geboekt.",
      "facts": [
        [
          "Belang Atlas in Delta",
          "80%; NVW; integrale consolidatie."
        ],
        [
          "Oorspronkelijke machine",
          "Aanschafprijs € 120.000; lineair in 8 jaar tot nihil."
        ],
        [
          "Verkoop aan Delta",
          "Op 31 december 2024, na 4 volledige afschrijvingsjaren, voor € 90.000."
        ],
        [
          "Resterende gebruiksduur",
          "4 jaar; Delta schrijft lineair af tot nihil vanaf 1 januari 2025."
        ],
        [
          "Winstbelasting",
          "25%"
        ]
      ],
      "task": "Welke interne correctiejournaalposten maakt Atlas op 31 december 2024 voor de verkoopwinst op de machine aan Delta en de bijbehorende belasting bij NVW-waardering?",
      "options": [
        {
          "journals": [
            {
              "label": "0. Interne winstcorrectie",
              "journal": [
                [
                  "Niet-gerealiseerde boekwinst verkochte machine",
                  "24.000",
                  ""
                ],
                [
                  "Overlopende passiva",
                  "",
                  "24.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Niet-gerealiseerde boekwinst verkochte machine",
                  24000,
                  0
                ],
                [
                  "Overlopende passiva",
                  0,
                  24000
                ]
              ],
              "why": ""
            },
            {
              "label": "1. Belastingcorrectie",
              "journal": [
                [
                  "Voorziening belastingen",
                  "6.000",
                  ""
                ],
                [
                  "Belastinglast",
                  "",
                  "6.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Voorziening belastingen",
                  6000,
                  0
                ],
                [
                  "Belastinglast",
                  0,
                  6000
                ]
              ],
              "why": ""
            }
          ],
          "why": ""
        },
        {
          "journals": [
            {
              "label": "0. Interne winstcorrectie",
              "journal": [
                [
                  "Niet-gerealiseerde boekwinst verkochte machine",
                  "30.000",
                  ""
                ],
                [
                  "Overlopende passiva",
                  "",
                  "30.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Niet-gerealiseerde boekwinst verkochte machine",
                  30000,
                  0
                ],
                [
                  "Overlopende passiva",
                  0,
                  30000
                ]
              ],
              "why": ""
            },
            {
              "label": "1. Belastingcorrectie",
              "journal": [
                [
                  "Voorziening belastingen",
                  "7.500",
                  ""
                ],
                [
                  "Belastinglast",
                  "",
                  "7.500"
                ]
              ],
              "journalNumeric": [
                [
                  "Voorziening belastingen",
                  7500,
                  0
                ],
                [
                  "Belastinglast",
                  0,
                  7500
                ]
              ],
              "why": ""
            }
          ],
          "why": "De interne correctie gebruikt 80%, niet 100%."
        },
        {
          "journals": [
            {
              "label": "0. Interne winstcorrectie",
              "journal": [
                [
                  "Niet-gerealiseerde boekwinst verkochte machine",
                  "48.000",
                  ""
                ],
                [
                  "Overlopende passiva",
                  "",
                  "48.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Niet-gerealiseerde boekwinst verkochte machine",
                  48000,
                  0
                ],
                [
                  "Overlopende passiva",
                  0,
                  48000
                ]
              ],
              "why": ""
            },
            {
              "label": "1. Belastingcorrectie",
              "journal": [
                [
                  "Voorziening belastingen",
                  "12.000",
                  ""
                ],
                [
                  "Belastinglast",
                  "",
                  "12.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Voorziening belastingen",
                  12000,
                  0
                ],
                [
                  "Belastinglast",
                  0,
                  12000
                ]
              ],
              "why": ""
            }
          ],
          "why": "De boekwaarde vóór verkoop is € 60.000; de winst is € 30.000, niet € 60.000."
        },
        {
          "journals": [
            {
              "label": "0. Interne winstcorrectie",
              "journal": [
                [
                  "Niet-gerealiseerde boekwinst verkochte machine",
                  "24.000",
                  ""
                ],
                [
                  "Overlopende passiva",
                  "",
                  "24.000"
                ]
              ],
              "journalNumeric": [
                [
                  "Niet-gerealiseerde boekwinst verkochte machine",
                  24000,
                  0
                ],
                [
                  "Overlopende passiva",
                  0,
                  24000
                ]
              ],
              "why": ""
            },
            {
              "label": "1. Belastingcorrectie",
              "journal": [
                [
                  "Voorziening belastingen",
                  "4.800",
                  ""
                ],
                [
                  "Belastinglast",
                  "",
                  "4.800"
                ]
              ],
              "journalNumeric": [
                [
                  "Voorziening belastingen",
                  4800,
                  0
                ],
                [
                  "Belastinglast",
                  0,
                  4800
                ]
              ],
              "why": ""
            }
          ],
          "why": "Het belastingtarief is 25%."
        }
      ],
      "correct": 0,
      "explanation": [
        "Boekwaarde bij verkoop: € 120.000 − 4 × € 15.000 = € 60.000.",
        "De interne boekwinst is € 90.000 − € 60.000 = € 30.000. Atlas corrigeert 80% hiervan: € 24.000, met € 6.000 belasting."
      ],
      "pattern": "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt de waardering of boekwaarde. Herken eerst welke gebeurtenis of correctie moet worden geboekt. Let op de beslissende gegevens: Herken een overdracht van een vast actief binnen de groep. Bepaal de interne boekwinst, verkoopdatum, oorspronkelijke boekwaarde en resterende afschrijvingstermijn. Onderscheid eliminatie van de boekwinst van de latere afschrijvingscorrectie en bepaal welke periode wordt gevraagd. Gevraagd tijdstip: 31 december 2024. Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten.",
      "refs": [
        "mol",
        "mva"
      ],
      "related": [
        7,
        27
      ],
      "variant": true,
      "guidance": {
        "lesson": "mva",
        "title": "Downstream boekwinst op een machine uitstellen",
        "task": "Welke interne correctiejournaalposten maakt Atlas op 31 december 2024 voor de verkoopwinst op de machine aan Delta en de bijbehorende belasting bij NVW-waardering?",
        "rules": "Bepaal de boekwaarde van de machine direct vóór de interne verkoop op basis van oorspronkelijke aanschafprijs en afschrijving. De interne boekwinst is de verkoopprijs minus die boekwaarde. Bij downstream NVW wordt het moederdeel van die boekwinst vóór belasting uitgesteld via overlopende passiva, met een afzonderlijke belastingcorrectie. Consolidatie corrigeert vervolgens ook het resterende deel.",
        "pattern": [
          "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt de waardering of boekwaarde. Herken eerst welke gebeurtenis of correctie moet worden geboekt.",
          "Let op de beslissende gegevens: Herken een overdracht van een vast actief binnen de groep. Bepaal de interne boekwinst, verkoopdatum, oorspronkelijke boekwaarde en resterende afschrijvingstermijn. Onderscheid eliminatie van de boekwinst van de latere afschrijvingscorrectie en bepaal welke periode wordt gevraagd. Gevraagd tijdstip: 31 december 2024.",
          "Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten."
        ]
      },
      "caseTables": [
        {
          "caption": "Afzonderlijke machinecasus: geen afhankelijkheid van een vorige vraag",
          "headers": [
            "Gegeven",
            "Waarde"
          ],
          "rows": [
            [
              "Oorspronkelijke aanschafprijs",
              120000
            ],
            [
              "Oorspronkelijke gebruiksduur",
              "8 jaar, restwaarde nihil"
            ],
            [
              "Verkoopmoment",
              "31 december 2024, na 4 volledige jaren"
            ],
            [
              "Interne verkoopprijs",
              90000
            ],
            [
              "Resterende afschrijving koper",
              "4 jaar vanaf 1 januari 2025"
            ],
            [
              "Moederbelang / winstbelasting",
              "80% / 25%"
            ]
          ]
        }
      ]
    },
    {
      "id": 27,
      "stage": 5,
      "title": "De machine: een jaar later",
      "type": "Journaalpost",
      "intro": "De machine uit de casus is in 2025 het hele jaar in gebruik. Atlas heeft haar enkelvoudige vrijval en belasting al geboekt.",
      "facts": [
        [
          "Belang Atlas in Delta",
          "80%; NVW; integrale consolidatie."
        ],
        [
          "Oorspronkelijke machine",
          "Aanschafprijs € 120.000; lineair in 8 jaar tot nihil."
        ],
        [
          "Verkoop aan Delta",
          "Op 31 december 2024, na 4 volledige afschrijvingsjaren, voor € 90.000."
        ],
        [
          "Resterende gebruiksduur",
          "4 jaar; Delta schrijft lineair af tot nihil vanaf 1 januari 2025."
        ],
        [
          "Winstbelasting",
          "25%"
        ]
      ],
      "task": "Welke W&V-eliminatie corrigeert in 2025 de extra afschrijving op de intern verkochte machine, nadat Atlas haar enkelvoudige vrijval en belasting al heeft geboekt?",
      "options": [
        {
          "journal": [
            [
              "Gerealiseerde boekwinst verkochte machine",
              "6.000",
              ""
            ],
            [
              "Resultaat na belastingen",
              "1.500",
              ""
            ],
            [
              "Afschrijvingskosten machines",
              "",
              "7.500"
            ]
          ],
          "journalNumeric": [
            [
              "Gerealiseerde boekwinst verkochte machine",
              6000,
              0
            ],
            [
              "Resultaat na belastingen",
              1500,
              0
            ],
            [
              "Afschrijvingskosten machines",
              0,
              7500
            ]
          ],
          "why": "Het aanvullende deel moet worden gesplitst naar resultaat na belasting en belastinglast."
        },
        {
          "journal": [
            [
              "Gerealiseerde boekwinst verkochte machine",
              "6.000",
              ""
            ],
            [
              "Resultaat na belastingen",
              "1.200",
              ""
            ],
            [
              "Belastinglast",
              "300",
              ""
            ],
            [
              "Afschrijvingskosten machines",
              "",
              "7.500"
            ]
          ],
          "journalNumeric": [
            [
              "Gerealiseerde boekwinst verkochte machine",
              6000,
              0
            ],
            [
              "Resultaat na belastingen",
              1200,
              0
            ],
            [
              "Belastinglast",
              300,
              0
            ],
            [
              "Afschrijvingskosten machines",
              0,
              7500
            ]
          ],
          "why": "Dit gebruikt 20% belasting in plaats van 25%."
        },
        {
          "journal": [
            [
              "Gerealiseerde boekwinst verkochte machine",
              "6.000",
              ""
            ],
            [
              "Aandeel derden",
              "1.125",
              ""
            ],
            [
              "Belastinglast",
              "375",
              ""
            ],
            [
              "Afschrijvingskosten machines",
              "",
              "7.500"
            ]
          ],
          "journalNumeric": [
            [
              "Gerealiseerde boekwinst verkochte machine",
              6000,
              0
            ],
            [
              "Aandeel derden",
              1125,
              0
            ],
            [
              "Belastinglast",
              375,
              0
            ],
            [
              "Afschrijvingskosten machines",
              0,
              7500
            ]
          ],
          "why": "De verkoop is downstream; het aanvullende deel gaat niet naar derden."
        },
        {
          "journal": [
            [
              "Gerealiseerde boekwinst verkochte machine",
              "6.000",
              ""
            ],
            [
              "Resultaat na belastingen",
              "1.125",
              ""
            ],
            [
              "Belastinglast",
              "375",
              ""
            ],
            [
              "Afschrijvingskosten machines",
              "",
              "7.500"
            ]
          ],
          "journalNumeric": [
            [
              "Gerealiseerde boekwinst verkochte machine",
              6000,
              0
            ],
            [
              "Resultaat na belastingen",
              1125,
              0
            ],
            [
              "Belastinglast",
              375,
              0
            ],
            [
              "Afschrijvingskosten machines",
              0,
              7500
            ]
          ],
          "why": ""
        }
      ],
      "correct": 3,
      "explanation": [
        "Delta schrijft € 90.000 / 4 = € 22.500 af. Voor de groep is de afschrijving € 60.000 / 4 = € 15.000.",
        "Het verschil is € 7.500. Intern is 80% × € 7.500 = € 6.000 al gerealiseerd. Aanvullend resteert 20% × € 7.500, gesplitst in € 1.125 resultaat en € 375 belasting."
      ],
      "pattern": "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het gevraagde onderwerp in de enkelvoudige jaarrekening. Herken eerst welke gebeurtenis of correctie moet worden geboekt. Let op de beslissende gegevens: Herken een overdracht van een vast actief binnen de groep. Bepaal de interne boekwinst, verkoopdatum, oorspronkelijke boekwaarde en resterende afschrijvingstermijn. Onderscheid eliminatie van de boekwinst van de latere afschrijvingscorrectie en bepaal welke periode wordt gevraagd. Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten.",
      "refs": [
        "mol",
        "mva"
      ],
      "related": [
        8,
        26
      ],
      "variant": true,
      "guidance": {
        "lesson": "mva",
        "title": "Extra afschrijving realiseert een deel van de boekwinst",
        "task": "Welke W&V-eliminatie corrigeert in 2025 de extra afschrijving op de intern verkochte machine, nadat Atlas haar enkelvoudige vrijval en belasting al heeft geboekt?",
        "rules": "Vergelijk de afschrijving bij de koper met de afschrijving die de groep zonder interne verkoop zou hebben gehad. Het verschil realiseert gedurende de gebruiksduur een deel van de interne boekwinst. Na de al geboekte interne vrijval blijven de tegenboeking daarvan en het aanvullende meerderheids- en belastingdeel over. Bij downstream wordt deze winst niet aan derden toegerekend.",
        "pattern": [
          "Herken de vraag: De gevraagde journaalpost of eliminatieboeking verwerkt het gevraagde onderwerp in de enkelvoudige jaarrekening. Herken eerst welke gebeurtenis of correctie moet worden geboekt.",
          "Let op de beslissende gegevens: Herken een overdracht van een vast actief binnen de groep. Bepaal de interne boekwinst, verkoopdatum, oorspronkelijke boekwaarde en resterende afschrijvingstermijn. Onderscheid eliminatie van de boekwinst van de latere afschrijvingscorrectie en bepaal welke periode wordt gevraagd.",
          "Vorm van het antwoord: Geef per boeking de rekeningnamen, debet- en creditbedragen en zo nodig een toelichting. Gebruik afzonderlijke boekingen voor afzonderlijke gebeurtenissen; debet en credit moeten per boeking aansluiten."
        ]
      },
      "caseTables": [
        {
          "caption": "Afzonderlijke machinecasus: geen afhankelijkheid van een vorige vraag",
          "headers": [
            "Gegeven",
            "Waarde"
          ],
          "rows": [
            [
              "Oorspronkelijke aanschafprijs",
              120000
            ],
            [
              "Oorspronkelijke gebruiksduur",
              "8 jaar, restwaarde nihil"
            ],
            [
              "Verkoopmoment",
              "31 december 2024, na 4 volledige jaren"
            ],
            [
              "Interne verkoopprijs",
              90000
            ],
            [
              "Resterende afschrijving koper",
              "4 jaar vanaf 1 januari 2025"
            ],
            [
              "Moederbelang / winstbelasting",
              "80% / 25%"
            ]
          ]
        }
      ]
    },
    {
      "id": 28,
      "stage": 5,
      "title": "Vier goederenstromen samen",
      "type": "Rekenvraag",
      "intro": "Alle winstbedragen in het schema zijn vóór belasting. De voorraden in de enkelvoudige balansen bevatten deze winsten nog.",
      "facts": [
        [
          "Belangen en stelsel",
          "Atlas bezit 80% Delta en 60% Sigma; beide NVW, integraal geconsolideerd."
        ],
        [
          "Voorraad ultimo, vóór consolidatie",
          "Atlas € 310.000; Delta € 420.000; Sigma € 270.000."
        ],
        [
          "Winstbelasting",
          "25%"
        ],
        [
          "Goederenstromen",
          "Vier afzonderlijke partijen. Elke partij wordt slechts eenmaal binnen de groep doorgeleverd. Geen andere intercompanywinsten."
        ]
      ],
      "task": "Hoe hoog is de totale geconsolideerde voorraad op einddatum nadat de vier afzonderlijke eindwinsten uit de casustabel volledig zijn geëlimineerd?",
      "options": [
        {
          "lines": [
            "€ 310.000 + € 420.000 + € 270.000",
            "− € 30.000 − € 10.000 − € 20.000 − € 8.000"
          ],
          "expression": "310000+420000+270000-30000-10000-20000-8000",
          "value": "932000",
          "result": "€ 932.000",
          "why": ""
        },
        {
          "lines": [
            "€ 1.000.000 − € 20.000 − € 15.000 − € 12.000 − € 5.000"
          ],
          "expression": "1000000-20000-15000-12000-5000",
          "value": "948000",
          "result": "€ 948.000",
          "why": "Dit zijn de beginstanden."
        },
        {
          "lines": [
            "€ 1.000.000 − € 30.000 − € 15.000 − € 20.000 − € 8.000"
          ],
          "expression": "1000000-30000-15000-20000-8000",
          "value": "927000",
          "result": "€ 927.000",
          "why": "Voor Delta → Atlas is de eindstand € 10.000, niet € 15.000."
        },
        {
          "lines": [
            "€ 1.000.000 − (€ 30.000 + € 10.000 + € 20.000 + € 8.000) × 75%"
          ],
          "expression": "1000000-(30000+10000+20000+8000)*.75",
          "value": "949000.0",
          "result": "€ 949.000",
          "why": "De winst verdwijnt vóór belasting uit voorraad; de belasting staat elders."
        }
      ],
      "correct": 0,
      "explanation": [
        "Voorraden vóór eliminatie: € 1.000.000.",
        "Elimineer de volledige eindwinst van alle stromen: € 68.000. De geconsolideerde voorraad is € 932.000."
      ],
      "pattern": "Herken de vraag: Dit is een berekenings- of verwerkingsvraag over het gevraagde onderwerp. Onderscheid de gevraagde eindstand van een mutatie of resultaat over het jaar. Let op de beslissende gegevens: Zoek het gevraagde tijdstip en de waarderingsgrondslag. Houd aanschafprijs, aandeel in eigen vermogen, resultaat en uitkering uit elkaar. Neem uitsluitend mutaties mee die bij de gevraagde periode en onderneming horen. Vorm van het antwoord: Toon de relevante beginstand of formule, de ingevulde gegevens en de berekening tot de gevraagde uitkomst. Vermeld valuta of eenheid en geef bij een verschil ook het teken en de verwerking aan.",
      "refs": [
        "old",
        "down",
        "up",
        "ab",
        "nab"
      ],
      "related": [
        3,
        29,
        30
      ],
      "variant": true,
      "caseTable": {
        "headers": [
          "Verkoper → koper",
          "Winst begin",
          "Winst eind"
        ],
        "rows": [
          [
            "Atlas → Delta",
            "€ 20.000",
            "€ 30.000"
          ],
          [
            "Delta → Atlas",
            "€ 15.000",
            "€ 10.000"
          ],
          [
            "Delta → Sigma",
            "€ 12.000",
            "€ 20.000"
          ],
          [
            "Sigma → Delta",
            "€ 5.000",
            "€ 8.000"
          ]
        ]
      },
      "guidance": {
        "lesson": "resultaataansluiting",
        "title": "Geconsolideerde voorraad: alle eindwinsten vóór belasting",
        "task": "Hoe hoog is de totale geconsolideerde voorraad op einddatum nadat de vier afzonderlijke eindwinsten uit de casustabel volledig zijn geëlimineerd?",
        "rules": "Tel de voorraden van alle integraal geconsolideerde ondernemingen op. Trek vervolgens de volledige ongerealiseerde winst af die in de eindvoorraad van iedere afzonderlijke goederenstroom zit. Het moeder- of derdenpercentage verandert deze totale voorraadcorrectie niet. Belasting wordt elders op de balans verwerkt en verlaagt het uit voorraad te elimineren winstbedrag niet.",
        "pattern": [
          "Herken de vraag: Dit is een berekenings- of verwerkingsvraag over het gevraagde onderwerp. Onderscheid de gevraagde eindstand van een mutatie of resultaat over het jaar.",
          "Let op de beslissende gegevens: Zoek het gevraagde tijdstip en de waarderingsgrondslag. Houd aanschafprijs, aandeel in eigen vermogen, resultaat en uitkering uit elkaar. Neem uitsluitend mutaties mee die bij de gevraagde periode en onderneming horen.",
          "Vorm van het antwoord: Toon de relevante beginstand of formule, de ingevulde gegevens en de berekening tot de gevraagde uitkomst. Vermeld valuta of eenheid en geef bij een verschil ook het teken en de verwerking aan."
        ]
      },
      "caseTables": [
        {
          "headers": [
            "Verkoper → koper",
            "Winst begin",
            "Winst eind"
          ],
          "rows": [
            [
              "Atlas → Delta",
              "€ 20.000",
              "€ 30.000"
            ],
            [
              "Delta → Atlas",
              "€ 15.000",
              "€ 10.000"
            ],
            [
              "Delta → Sigma",
              "€ 12.000",
              "€ 20.000"
            ],
            [
              "Sigma → Delta",
              "€ 5.000",
              "€ 8.000"
            ]
          ],
          "caption": "Gegeven casustabel bij deze vraag"
        }
      ]
    },
    {
      "id": 29,
      "stage": 5,
      "title": "Enkelvoudig naar geconsolideerd resultaat",
      "type": "Rekenvraag",
      "intro": "Alle enkelvoudige NVW-correcties voor de vier goederenstromen zijn al verwerkt in het onderstaande resultaat van Atlas.",
      "facts": [
        [
          "Belangen en stelsel",
          "Atlas bezit 80% Delta en 60% Sigma; beide NVW, integraal geconsolideerd."
        ],
        [
          "Voorraad ultimo, vóór consolidatie",
          "Atlas € 310.000; Delta € 420.000; Sigma € 270.000."
        ],
        [
          "Winstbelasting",
          "25%"
        ],
        [
          "Goederenstromen",
          "Vier afzonderlijke partijen. Elke partij wordt slechts eenmaal binnen de groep doorgeleverd. Geen andere intercompanywinsten."
        ],
        [
          "Enkelvoudig resultaat Atlas",
          "€ 480.000 na belasting, inclusief resultaat deelnemingen en alle interne winstcorrecties."
        ]
      ],
      "task": "Hoe hoog is het geconsolideerde resultaat toekomend aan de meerderheid, uitgaande van Atlas' resultaat van € 480.000 waarin alle interne NVW-correcties al zijn verwerkt?",
      "options": [
        {
          "lines": [
            "€ 480.000",
            "− (€ 30.000 − € 20.000) × 20% × 75%"
          ],
          "expression": "480000-(30000-20000)*.2*.75",
          "value": "478500.0",
          "result": "€ 478.500",
          "why": "De extra correctie bij sidestream afnemend belang ontbreekt."
        },
        {
          "lines": [
            "€ 480.000",
            "− (€ 30.000 − € 20.000) × 20% × 75%",
            "− (€ 20.000 − € 12.000) × 40% × 75%"
          ],
          "expression": "480000-(30000-20000)*.2*.75-(20000-12000)*.4*.75",
          "value": "476100.0",
          "result": "€ 476.100",
          "why": "Het aanvullende sidestreamdeel is het verschil 80% − 60%, niet 40%."
        },
        {
          "lines": [
            "€ 480.000",
            "− (€ 30.000 − € 20.000) × 20% × 75%",
            "− (€ 20.000 − € 12.000) × (80% − 60%) × 75%"
          ],
          "expression": "480000-(30000-20000)*.2*.75-(20000-12000)*(.8-.6)*.75",
          "value": "477300.0",
          "result": "€ 477.300",
          "why": ""
        },
        {
          "lines": [
            "€ 480.000",
            "− (€ 30.000 − € 20.000) × 20% × 80%",
            "− (€ 20.000 − € 12.000) × 20% × 80%"
          ],
          "expression": "480000-(30000-20000)*.2*.8-(20000-12000)*.2*.8",
          "value": "477120.0",
          "result": "€ 477.120",
          "why": "Het na-belastingpercentage is 75%, niet 80%."
        }
      ],
      "correct": 2,
      "explanation": [
        "Aanvullend downstream: € 10.000 × 20% × 75% = € 1.500 verlaging.",
        "Aanvullend sidestream afnemend: € 8.000 × 20% × 75% = € 1.200 verlaging.",
        "Upstream en sidestream niet-afnemend vereisen na de interne correctie geen verdere correctie op de winst van de meerderheid. Uitkomst € 477.300."
      ],
      "pattern": "Herken de vraag: Dit is een berekenings- of verwerkingsvraag over het geconsolideerde resultaat. Onderscheid de gevraagde eindstand van een mutatie of resultaat over het jaar. Let op de beslissende gegevens: Begin met het resultaat van de moeder en herken welke dochterresultaten daarin al via de deelnemingswaardering zitten. Controleer het aandeel van derden, goodwillafschrijving en eventuele intercompany- en belastingcorrecties. Voorkom dat een al verwerkte mutatie nogmaals meetelt. Vorm van het antwoord: Toon de relevante beginstand of formule, de ingevulde gegevens en de berekening tot de gevraagde uitkomst. Vermeld valuta of eenheid en geef bij een verschil ook het teken en de verwerking aan.",
      "refs": [
        "down",
        "up",
        "ab",
        "nab"
      ],
      "related": [
        9,
        23,
        28,
        30
      ],
      "variant": true,
      "caseTable": {
        "headers": [
          "Verkoper → koper",
          "Winst begin",
          "Winst eind"
        ],
        "rows": [
          [
            "Atlas → Delta",
            "€ 20.000",
            "€ 30.000"
          ],
          [
            "Delta → Atlas",
            "€ 15.000",
            "€ 10.000"
          ],
          [
            "Delta → Sigma",
            "€ 12.000",
            "€ 20.000"
          ],
          [
            "Sigma → Delta",
            "€ 5.000",
            "€ 8.000"
          ]
        ]
      },
      "guidance": {
        "lesson": "resultaataansluiting",
        "title": "Vanaf een al gecorrigeerd moederresultaat verder rekenen",
        "task": "Hoe hoog is het geconsolideerde resultaat toekomend aan de meerderheid, uitgaande van Atlas' resultaat van € 480.000 waarin alle interne NVW-correcties al zijn verwerkt?",
        "rules": "Wanneer het resultaat deelnemingen en alle interne NVW-correcties al in het moederresultaat zitten, mogen die niet opnieuw worden afgetrokken. Bereken uitsluitend de aanvullende meerderheidsdelen uit de goederenstromen. In deze casus zijn dat downstream en sidestream afnemend belang. Gebruik de winstmutaties na belasting, niet de eindwinsten.",
        "pattern": [
          "Herken de vraag: Dit is een berekenings- of verwerkingsvraag over het geconsolideerde resultaat. Onderscheid de gevraagde eindstand van een mutatie of resultaat over het jaar.",
          "Let op de beslissende gegevens: Begin met het resultaat van de moeder en herken welke dochterresultaten daarin al via de deelnemingswaardering zitten. Controleer het aandeel van derden, goodwillafschrijving en eventuele intercompany- en belastingcorrecties. Voorkom dat een al verwerkte mutatie nogmaals meetelt.",
          "Vorm van het antwoord: Toon de relevante beginstand of formule, de ingevulde gegevens en de berekening tot de gevraagde uitkomst. Vermeld valuta of eenheid en geef bij een verschil ook het teken en de verwerking aan."
        ]
      },
      "caseTables": [
        {
          "headers": [
            "Verkoper → koper",
            "Winst begin",
            "Winst eind"
          ],
          "rows": [
            [
              "Atlas → Delta",
              "€ 20.000",
              "€ 30.000"
            ],
            [
              "Delta → Atlas",
              "€ 15.000",
              "€ 10.000"
            ],
            [
              "Delta → Sigma",
              "€ 12.000",
              "€ 20.000"
            ],
            [
              "Sigma → Delta",
              "€ 5.000",
              "€ 8.000"
            ]
          ],
          "caption": "Gegeven casustabel bij deze vraag"
        }
      ]
    },
    {
      "id": 30,
      "stage": 5,
      "title": "De laatste aansluiting: aandeel derden",
      "type": "Rekenvraag",
      "intro": "Gebruik de vier afzonderlijke goederenstromen in de casustabel bij deze vraag. Bereken het definitieve aandeel derden na alle goedereneliminaties.",
      "facts": [
        [
          "Belangen en stelsel",
          "Atlas bezit 80% Delta en 60% Sigma; beide NVW, integraal geconsolideerd."
        ],
        [
          "Voorraad ultimo, vóór consolidatie",
          "Atlas € 310.000; Delta € 420.000; Sigma € 270.000."
        ],
        [
          "Winstbelasting",
          "25%"
        ],
        [
          "Goederenstromen",
          "Vier afzonderlijke partijen. Elke partij wordt slechts eenmaal binnen de groep doorgeleverd. Geen andere intercompanywinsten."
        ],
        [
          "Resultaat Delta vóór groepscorrecties",
          "€ 200.000 na belasting."
        ],
        [
          "Resultaat Sigma vóór groepscorrecties",
          "€ 160.000 na belasting."
        ]
      ],
      "task": "Hoeveel bedraagt het totale aandeel derden in de geconsolideerde W&V na verwerking van de vier goederenstromen, de gegeven dochterresultaten en 25% winstbelasting?",
      "options": [
        {
          "lines": [
            "20% × € 200.000 + 40% × € 160.000",
            "− (€ 10.000 − € 15.000) × 20% × 75%",
            "− (€ 20.000 − € 12.000) × 20% × 75%",
            "− (€ 8.000 − € 5.000) × 40% × 75%",
            "− (€ 30.000 − € 20.000) × 20% × 75%"
          ],
          "expression": ".2*200000+.4*160000-(10000-15000)*.2*.75-(20000-12000)*.2*.75-(8000-5000)*.4*.75-(30000-20000)*.2*.75",
          "value": "101150.0",
          "result": "€ 101.150",
          "why": "Downstreamwinst wordt niet afgewenteld op derden."
        },
        {
          "lines": [
            "20% × € 200.000 + 40% × € 160.000",
            "− € 5.000 × 20% × 75%",
            "− € 8.000 × 20% × 75%",
            "− € 3.000 × 40% × 75%"
          ],
          "expression": ".2*200000+.4*160000-5000*.2*.75-8000*.2*.75-3000*.4*.75",
          "value": "101150.0",
          "result": "€ 101.150",
          "why": "De upstreamwinst neemt af; het aandeel derden stijgt daardoor met € 750."
        },
        {
          "lines": [
            "20% × € 200.000 + 40% × € 160.000",
            "− (€ 10.000 − € 15.000) × 20% × 75%",
            "− (€ 20.000 − € 12.000) × 20% × 75%"
          ],
          "expression": ".2*200000+.4*160000-(10000-15000)*.2*.75-(20000-12000)*.2*.75",
          "value": "103550.0",
          "result": "€ 103.550",
          "why": "De derden-correctie op Sigma → Delta ontbreekt."
        },
        {
          "lines": [
            "20% × € 200.000 + 40% × € 160.000",
            "− (€ 10.000 − € 15.000) × 20% × 75%",
            "− (€ 20.000 − € 12.000) × 20% × 75%",
            "− (€ 8.000 − € 5.000) × 40% × 75%"
          ],
          "expression": ".2*200000+.4*160000-(10000-15000)*.2*.75-(20000-12000)*.2*.75-(8000-5000)*.4*.75",
          "value": "102650.0",
          "result": "€ 102.650",
          "why": ""
        }
      ],
      "correct": 3,
      "explanation": [
        "Start: 20% × € 200.000 + 40% × € 160.000 = € 104.000.",
        "Upstreamvrijval: + € 750. Sidestream afnemend: − € 1.200. Sidestream niet-afnemend: − € 900.",
        "Het definitieve aandeel derden is € 102.650. Downstream geeft geen correctie op derden."
      ],
      "pattern": "Herken de vraag: Dit is een berekenings- of verwerkingsvraag over het aandeel van derden. Onderscheid de gevraagde eindstand van een mutatie of resultaat over het jaar. Let op de beslissende gegevens: Tel stemrechten apart van winstrechten. Let op aandelen zonder stemrecht, eigen aandelen, stemrechtovereenkomsten en benoemingsmacht. Controleer ook de rechtsvorm: een natuurlijke persoon is geen moederrechtspersoon; bij een v.o.f. kan volledige aansprakelijkheid beslissend zijn. Pas alleen een criterium toe waarvoor de casus gegevens geeft. Vorm van het antwoord: Toon de relevante beginstand of formule, de ingevulde gegevens en de berekening tot de gevraagde uitkomst. Vermeld valuta of eenheid en geef bij een verschil ook het teken en de verwerking aan.",
      "refs": [
        "up",
        "ab",
        "nab",
        "mod"
      ],
      "related": [
        20,
        25,
        29
      ],
      "variant": true,
      "caseTable": {
        "headers": [
          "Verkoper → koper",
          "Winst begin",
          "Winst eind"
        ],
        "rows": [
          [
            "Atlas → Delta",
            "€ 20.000",
            "€ 30.000"
          ],
          [
            "Delta → Atlas",
            "€ 15.000",
            "€ 10.000"
          ],
          [
            "Delta → Sigma",
            "€ 12.000",
            "€ 20.000"
          ],
          [
            "Sigma → Delta",
            "€ 5.000",
            "€ 8.000"
          ]
        ]
      },
      "guidance": {
        "lesson": "resultaataansluiting",
        "title": "Het definitieve aandeel derden na alle goederenstromen",
        "task": "Hoeveel bedraagt het totale aandeel derden in de geconsolideerde W&V na verwerking van de vier goederenstromen, de gegeven dochterresultaten en 25% winstbelasting?",
        "rules": "Begin bij het minderheidsaandeel in de resultaten van Delta en Sigma. Corrigeer daarna voor de winstmutaties die door een verkopende dochter zijn veroorzaakt. Een toename van ongerealiseerde winst verlaagt haar derdenaandeel; een vrijval verhoogt dat aandeel. Gebruik voor iedere stroom het derdenpercentage in de verkoper en de mutatie na belasting. Downstreamwinst van Atlas raakt derden niet.",
        "pattern": [
          "Herken de vraag: Dit is een berekenings- of verwerkingsvraag over het aandeel van derden. Onderscheid de gevraagde eindstand van een mutatie of resultaat over het jaar.",
          "Let op de beslissende gegevens: Tel stemrechten apart van winstrechten. Let op aandelen zonder stemrecht, eigen aandelen, stemrechtovereenkomsten en benoemingsmacht. Controleer ook de rechtsvorm: een natuurlijke persoon is geen moederrechtspersoon; bij een v.o.f. kan volledige aansprakelijkheid beslissend zijn. Pas alleen een criterium toe waarvoor de casus gegevens geeft.",
          "Vorm van het antwoord: Toon de relevante beginstand of formule, de ingevulde gegevens en de berekening tot de gevraagde uitkomst. Vermeld valuta of eenheid en geef bij een verschil ook het teken en de verwerking aan."
        ]
      },
      "caseTables": [
        {
          "headers": [
            "Verkoper → koper",
            "Winst begin",
            "Winst eind"
          ],
          "rows": [
            [
              "Atlas → Delta",
              "€ 20.000",
              "€ 30.000"
            ],
            [
              "Delta → Atlas",
              "€ 15.000",
              "€ 10.000"
            ],
            [
              "Delta → Sigma",
              "€ 12.000",
              "€ 20.000"
            ],
            [
              "Sigma → Delta",
              "€ 5.000",
              "€ 8.000"
            ]
          ],
          "caption": "Gegeven casustabel bij deze vraag"
        }
      ]
    }
  ],
  "notes": [
    "Dit zijn eigen vraagvarianten met gewijzigde namen en bedragen, geen officiële 2026-tentamenvragen.",
    "De toetsmatrijs noemt dit onderdeel: het opstellen van de geconsolideerde jaarrekening bij NVW (Onderwijsprogramma CAFA2 voorjaar 2026, p. 4).",
    "De screenshots van het tentamen 29-04-2026 tonen vraagtitels en scores, maar niet alle casusgegevens en officiële uitwerkingen. Daarom zijn de inhoudelijke bronnen de hieronder genoemde syllabus, oudere tentamens en het college-Excel.",
    "Elke oefenvraag telt als één goed/fout-vraag. Dit is niet de officiële tentamenpuntentoekenning.",
    "Thieu en Nyenrode blijven onderscheiden. Bij de W&V-vraag 10 wordt de expliciet gelabelde THIEU-kolom gebruikt. Bij andere vragen staat de concrete gebruikte bron vermeld."
  ],
  "code": "nvw",
  "opgave": 3
};
}());
