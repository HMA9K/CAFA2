(function(){
 'use strict';
 var form=document.getElementById('capital-check-form'),out=document.getElementById('capital-check-result');if(!form||!out)return;
 function result(){
  var f=new FormData(form),get=function(k){return f.get(k);},rows=[],refs=[];
  function row(label,text){rows.push('<div><strong>'+label+'</strong><p>'+text+'</p></div>');}
  if(get('holder')==='person'){
    row('Eerst het toepassingsgebied','De wettelijke dochter- en deelnemingsdefinities in deze studieroute nemen een natuurlijke persoon niet als houder. Trek daarom uit diens privébezit geen NVW-plicht op grond van Titel 9. De rechtspersoon waarin hij participeert kan zelf wel onder Titel 9 vallen.');refs=[{article:'24a',part:'lid 1'},{article:'24c',part:'lid 1 en 2'},{article:'360',part:''}];
  }else{
    if(get('holder')==='unknown')row('Houder','Stel eerst vast wie het belang houdt. Zonder die informatie is de wettelijke kwalificatie nog niet af.');
    if(get('holder')==='partnership')row('Vennootschap als houder','Een vennootschap kan volgens artikel 2:24c lid 1 een deelneming in een rechtspersoon hebben. De dochterdefinitie spreekt echter over een rechtspersoon als moeder. Pas Titel 9 niet zonder toets op iedere vof toe; artikel 2:360 lid 2 noemt een specifieke situatie.');
    row('Deelneming',get('participation')==='yes'?'Volgens jouw beoordeling is voldaan aan artikel 2:24c. Beoordeel nu afzonderlijk de invloed van betekenis.':get('participation')==='no'?'Volgens jouw beoordeling is geen sprake van een deelneming. Beoordeel het gehouden kapitaalbelang als belegging en stel de bestemming vast.':'De deelnemingstoets staat nog open. Toets de kwalitatieve kenmerken; minder dan 20% sluit een deelneming niet uit.');
    row('Dochter en groep',(get('subsidiary')==='yes'?'De dochtertoets is volgens jouw beoordeling positief. ':get('subsidiary')==='no'?'Op de beoordeelde gronden is geen dochterrelatie vastgesteld. ':'De dochtertoets is nog niet afgerond. ')+(get('group')==='yes'?'Daarnaast heb je een groepsverband vastgesteld.':get('group')==='no'?'Een groepsverband is niet vastgesteld.':'Het groepsverband vraagt nog een afzonderlijke beoordeling.'));
    refs=[{article:'24c',part:'lid 1 en 2'},{article:'24a',part:'lid 1 en 2'},{article:'24b',part:''}];
    if(get('scope')!=='yes')row('Waardering nog niet beslissen',get('scope')==='no'?'Titel 9 is volgens jouw invoer niet van toepassing. De route geeft dan geen waarderingsplicht op basis van deze titel.':'Controleer eerst of Titel 9 op de houder van toepassing is. De rest van het schema is pas daarna een wettelijke waarderingsroute.');
    else if(get('participation')==='no'||get('participation')==='yes'&&get('influence')==='no'){
      row('Verkrijgingsprijs of actuele waarde','De NVW-hoofdregel voor deelnemingen met invloed van betekenis is op basis van jouw invoer niet van toepassing. Onderzoek de grondslag volgens artikel 2:384, inclusief voorwaarden, resultaatverwerking en eventuele herwaarderingsreserve.');refs.push({article:'384',part:'lid 1'});
    }else if(get('participation')==='yes'&&get('influence')==='yes'){
      if(get('exception')==='yes')row('Afzonderlijk gemotiveerde afwijking','Onderbouw de gegronde reden voor afwijking van artikel 2:389 lid 1 en vermeld die in de toelichting. Dit is de uitzonderingsroute van lid 9, niet de route van onvoldoende gegevens in lid 3.');
      else if(get('information')==='yes')row('Hoofdregel: nettovermogenswaarde','Waardeer activa, voorzieningen, schulden en resultaat op dezelfde grondslagen als de houder en verwerk diens aandeel. Toets een eventuele gegronde afwijking nog afzonderlijk als die beoordeling openstaat.');
      else if(get('information')==='no')row('Onvoldoende gegevens voor NVW','Artikel 2:389 lid 3 biedt een andere overeenkomstig Titel 9 bepaalde vermogensmutatiewaarde, in de syllabus uitgewerkt als zichtbaar eigen vermogen. Dit is geen automatische terugval op een blijvend vaste verkrijgingsprijs.');
      else row('Vermogensmutatiemethode','Invloed van betekenis is volgens jouw invoer aanwezig. Beoordeel nu de beschikbare gegevens voor NVW en een eventuele onderbouwde afwijking.');
      refs.push({article:'389',part:'lid 1, 2, 3 en 9'});
    }else row('Waarderingsroute nog open','Rond eerst de kwalificatie als deelneming en de invloed van betekenis af. Kies niet alleen op basis van het aandelenpercentage.');
    row('Consolidatie volgt niet automatisch','Ga hierna naar stap 3 van het schema. Stel plicht en kring vast, toets de vrijstellingen en beoordeel bij gezamenlijke zeggenschap artikel 2:409. Een enkelvoudige NVW-waardering is geen consolidatiemethode.');refs.push({article:'406',part:'lid 1 en 2'},{article:'409',part:''});
  }
  out.innerHTML='<h3>Jouw beoordeling, geordend</h3>'+rows.join('')+(window.CafaStudy?window.CafaStudy.lawRail(refs,'samenvatting.html'):'');out.hidden=false;
 }
 form.addEventListener('submit',function(e){e.preventDefault();result();out.scrollIntoView({block:'nearest'});});
 form.addEventListener('reset',function(){out.hidden=true;out.replaceChildren();});
}());
