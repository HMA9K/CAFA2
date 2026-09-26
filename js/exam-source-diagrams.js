/* Hertekende casusschema's uit de lokaal aangeleverde oorspronkelijke papers.
   Coördinaten beschrijven de bronindeling; percentages zijn geen berekende antwoorden. */
(() => {
 'use strict';
 const schemas=[
 {key:'monopoli',match:['Monopoli bv','Casalini bv','Gelante bv','80%','30%'],title:'Gedeeltelijk concernschema per 1 januari 2023',source:'20240422 Tentamen CAFA2.pdf, pagina 4',w:250,h:310,compact:true,
  nodes:[['Monopoli bv',53,8,144,58],['Casalini bv',53,122,144,58],['Gelante bv',53,240,144,58]],
  edges:[['M125 66V122','80%',102,101],['M125 180V240','30%',108,217]]},
 {key:'bv-x',match:['BV X','BV A','BV C','BV D','BV E'],title:'Organogram BV X per 31 december 2020',source:'2021-04 CAFA2 - Tentamen.docx, opgave 1 deel 2',w:500,h:310,blueArrows:true,
  nodes:[['BV X',215,0,90,65],['BV A',0,130,85,65],['BV C',125,130,85,65],['BV D',315,130,85,65],['BV E',415,130,85,65],['BV B',0,240,85,65]],
  edges:[['M260 65V95H42V130','80%',25,117],['M260 95H167V130','45%',145,117],['M260 95H357V130','25%',340,117],['M260 95H457V130','50%',440,117],['M42 195V240','60%',64,220],['M167 195V225H240V163H210','20%',258,224]]},
 {key:'rosen',match:['Rosen bv','Stein bv','Storm bv','Pols bv'],title:'Organisatieschema Rosen per 31 december 2020',source:'2022-04 CAFA2 - Tentamen.pdf, pagina 4',w:650,h:330,blue:true,
  nodes:[['Rosen bv',190,65,105,55],['Dhr de Groot',360,60,120,65,'white'],['Storm bv',530,65,105,55],['Stein bv',0,185,105,55],['Wald bv',180,185,110,55],['Ram bv',360,185,110,55],['Pols bv',190,280,105,45]],
  edges:[['M190 98H53V185','18%',29,160],['M242 120V185','80%',215,160],['M295 98H320V213H360','45%',308,160],['M420 125V185','5%',438,160],['M582 120V213H470','50%',595,160],['M235 240V280','60%',215,266],['M420 60V38H242V65','Stemrechtovereenkomst',320,20,true]]},
 {key:'rast',match:['Rast Holding bv','Filzen bv','Wieder bv','Schaf bv'],title:'Kapitaalbelangen Rast Holding per 31 december 2021',source:'2022-10 CAFA2 - Tentamen.pdf, pagina 4',w:650,h:180,blueArrows:true,
  nodes:[['Rast Holding bv',240,0,170,60],['Filzen bv',0,120,150,55],['Wieder bv',250,120,150,55],['Schaf bv',500,120,150,55]],
  edges:[['M325 60V85H75V120','80%',60,108],['M325 85V120','50%',308,108],['M325 85H575V120','15%',555,108]]},
 {key:'moneglia',match:['Moneglia bv','Cavola bv','Toane bv','Farneta bv'],title:'Organisatieschema Moneglia per 31 december 2022',source:'20230411 Tentamen CAFA2.pdf, pagina 4',w:650,h:340,
  nodes:[['Moneglia bv',240,0,150,60],['Cavola bv',0,125,155,60],['Toane bv',250,125,155,60],['v.o.f. Levante',495,125,155,60],['Rapallo bv',120,275,160,60],['Farneta bv',490,275,160,60]],
  edges:[['M315 60V88H78V125','80%',55,110],['M315 88V125','40%',296,110],['M315 88H572V125','55%',550,110],['M78 185V235H200V275','40%',53,215],['M327 185V235H200V275','60%',307,215],['M572 185V275','70%',552,230]]},
 {key:'voorn',match:['Dhr. Voorn sr.','Alcamo bv','Carini bv','Noto bv'],title:'Gedeeltelijk concernplaatje familie Voorn per 1 januari 2022',source:'20231009 Tentamen CAFA2.pdf, pagina 4',w:650,h:360,
  nodes:[['Dhr. Voorn sr.',105,0,135,48,'round'],['Dhr. Voorn jr.',495,0,135,48,'round'],['Alcamo bv',0,130,155,62],['Carini bv',205,130,155,62],['v.o.f. Lentini',495,130,155,62],['Gela bv',95,290,160,62],['Noto bv',390,290,160,62]],
  edges:[['M172 48L77 130','80%',104,87],['M172 48L282 130','100%',202,87],['M172 48L572 130','50%',403,87],['M562 48V130','50%',593,87],['M77 192L175 290','70%',127,250],['M282 192L175 290','30%',240,250],['M282 192L470 290','55%',360,250],['M572 192L470 290','45%',535,250],['M360 153H495','10% stemrecht',427,176,true]],
  extra:'Carini bv heeft 10% van haar stemrecht in Noto bv overgedragen aan v.o.f. Lentini.'},
 {key:'patti',match:['Aandelen Patti','Gela bv','Noto bv','Winstrechtaandelen'],title:'Aandelenkapitaal Patti',source:'20231009 Tentamen CAFA2.pdf, pagina 6',w:650,h:270,
  nodes:[['Gela bv',60,0,150,55],['Noto bv',420,0,150,55],['Patti bv',250,210,150,55]],
  edges:[['M135 55V72H200V174H325V210','',0,0],['M495 55V72H370V174H325V210','',0,0]],
  labels:[['30 gewone aandelen',85,102],['5 aandelen stemrecht',85,126],['20 aandelen winstrecht',85,150],['10 gewone aandelen',487,102],['20 aandelen stemrecht',487,126],['15 aandelen winstrecht',487,150]]},
 {key:'mulini',match:['Mulini bv','Pienza bv','Sasso bv'],title:'Kapitaalbelangen Mulini per 31 december 2023',source:'20240930 Tentamen CAFA2.pdf, pagina 4',w:470,h:195,
  nodes:[['Mulini bv',160,0,150,60],['Pienza bv',0,130,150,60],['Sasso bv',320,130,150,60]],
  edges:[['M235 60L75 130','60%',145,96],['M235 60L395 130','50%',330,96]]},
 {key:'rieti',match:['Dhr. Rieti','Spoleto bv','Gubbio bv','Corvia bv'],title:'Organisatieschema zakelijke belangen Rieti',source:'20250417 Tentamen CAFA2.pdf, pagina 6',w:680,h:510,
  nodes:[['Dhr. Rieti',290,0,160,50,'ellipse'],['Spoleto bv',100,145,150,75],['Gubbio bv',310,145,150,75],['Assisi bv',515,145,150,75],['Foligno bv',0,300,150,75],['Spello SA',215,300,150,75],['Corvia bv',520,300,150,75],['v.o.f. Cesi',0,430,150,75]],
  edges:[['M370 50V82H175V145','100%',236,70],['M370 82H590V145','100%',487,70],['M235 145V112H385V145','bestuurders benoemen/ontslaan',310,103,true],['M175 220V259H75V300','100%',101,246],['M175 259H290V300','20% + stemrechtovereenkomst',353,246],['M75 375V430','50%',97,405],['M590 220V300','40%',613,268],['M590 375V410H677V337H670','25%',614,400]]},
 ];
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let serial=0;
 function figure(schema){
  const id='source-'+schema.key+'-'+(++serial),blue=schema.blue||schema.blueArrows,stroke=blue?'#4977cc':'#111';
  const desc=schema.edges.filter(e=>e[1]).map(e=>e[1]).join(', ')+(schema.extra?' '+schema.extra:'');
  const boxes=schema.nodes.map(([label,x,y,w,h,style])=>{
   const color=schema.blue&&style!=='white'?'#4977cc':'white';
   return (style==='ellipse'?'<ellipse cx="'+(x+w/2)+'" cy="'+(y+h/2)+'" rx="'+w/2+'" ry="'+h/2+'"': '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'"'+(style==='round'?' rx="8"':''))+' fill="'+color+'" stroke="'+(color==='white'?'#111':'#365c99')+'" stroke-width="1.5"/><text x="'+(x+w/2)+'" y="'+(y+h/2+5)+'" fill="'+(color==='white'?'#111':'white')+'">'+escape(label)+'</text>';
  }).join('');
  const edges=schema.edges.map(([d,label,x,y,dashed])=>'<path d="'+d+'" fill="none" stroke="'+(dashed?'#111':stroke)+'" stroke-width="1.2"'+(dashed?' stroke-dasharray="3 2"':'')+' marker-end="url(#'+id+'-arrow)"/>'+(label?'<text x="'+x+'" y="'+y+'" fill="#111">'+escape(label)+'</text>':'')).join('');
  const figure=document.createElement('figure');figure.className='cirrus-source-diagram'+(schema.compact?'':' cirrus-source-diagram-wide');figure.dataset.schema=schema.key;figure.dataset.source=schema.source;
  figure.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 '+(schema.w+12)+' '+(schema.h+12)+'" role="img" aria-labelledby="'+id+'-title '+id+'-desc"><title id="'+id+'-title">'+escape(schema.title)+'</title><desc id="'+id+'-desc">'+escape(desc)+'</desc><defs><marker id="'+id+'-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="'+stroke+'"/></marker></defs><g font-family="Arial, sans-serif" font-size="'+(schema.compact?14:16)+'" text-anchor="middle">'+boxes+edges+(schema.labels||[]).map(([s,x,y])=>'<text x="'+x+'" y="'+y+'">'+escape(s)+'</text>').join('')+'</g></svg>';
  // Retain the full accessible relationship table, with its precise row labels.
  return figure;
 }
 function restore(panel){
  if(!panel)return;
  for(const schema of schemas){
   if(panel.querySelector('[data-schema="'+schema.key+'"]'))continue;
   const table=Array.from(panel.querySelectorAll('table')).find(t=>schema.match.every(s=>t.textContent.includes(s)));
   if(!table)continue;
   if(schema.key==='monopoli'){const previous=table.previousElementSibling||table.parentElement.previousElementSibling;if(previous?.tagName==='H3'&&previous.textContent.trim()===schema.title)previous.remove();}
   const drawing=figure(schema),container=document.createElement('div');container.className='cirrus-diagram-with-data';
   table.before(container);container.append(drawing,table);table.classList.add('cirrus-diagram-accessible-table');
  }
 }
 window.ExamSourceDiagrams={restore,schemas};
})();
