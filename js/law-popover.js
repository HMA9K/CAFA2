/* Non-modal, anchored source window; the study page stays usable. */
(function(){
 'use strict';
 var popup,opener,article,part,selection,expanded=false,frame;
 function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
 function contextFor(a){var own=a.closest('.route-question,.route-exception,.route-consolidation,.route-result,p,td,li');if(own)return own.textContent;var nearby=a.closest('.reader-topic,.study-answer-note,.theory-panel,.exam-card,.reader-section');return nearby?nearby.textContent:'';}
 function marked(r){var cursor=0,s='';r.ranges.forEach(function(range){s+=esc(r.text.slice(cursor,range[0]))+'<mark class="law-essence">'+esc(r.text.slice(range[0],range[1]))+'</mark>';cursor=range[1];});return s+esc(r.text.slice(cursor));}
 function ensure(){if(popup)return;popup=document.createElement('div');popup.id='study-law-popover';popup.className='law-popover';popup.hidden=true;popup.setAttribute('role','dialog');popup.setAttribute('aria-modal','false');popup.setAttribute('aria-labelledby','law-popover-title');popup.setAttribute('tabindex','-1');popup.setAttribute('popover','manual');document.body.append(popup);}
 function anchorRect(){var rs=opener.getClientRects();return rs.length?rs[rs.length-1]:opener.getBoundingClientRect();}
 function position(){if(!popup||popup.hidden||!opener)return;if(!opener.isConnected||!opener.getClientRects().length){close(false);return;}
  var r=anchorRect(),vv=window.visualViewport,w=vv?vv.width:innerWidth,h=vv?vv.height:innerHeight,x=vv?vv.offsetLeft:0,y=vv?vv.offsetTop:0;
  if(r.bottom<y||r.top>y+h){close(false);return;}
  popup.style.maxWidth=Math.max(220,w-24)+'px';var width=Math.min(430,w-24);popup.style.width=width+'px';
  var left=Math.min(Math.max(x+12,r.left),x+w-width-12),top=r.bottom+9,room=y+h-top-12;
  popup.dataset.placement='below';
  // Prefer below. Only a fixed bottom control with no room uses the space above it.
  if(room<140){popup.dataset.placement='above';popup.style.maxHeight=Math.max(140,r.top-y-24)+'px';top=Math.max(y+10,r.top-popup.offsetHeight-9);}else popup.style.maxHeight=Math.min(expanded?500:340,room)+'px';
  popup.style.left=Math.round(left)+'px';popup.style.top=Math.round(top)+'px';popup.style.setProperty('--law-arrow-left',Math.min(width-25,Math.max(20,r.left-left+Math.min(20,r.width/2)))+'px');
 }
 function render(){var law=window.CAFA2_STUDY.laws[article],rows=selection.rows.filter(function(r){return expanded||selection.selected.includes(r.index);});
  popup.innerHTML='<header class="law-popover-head"><div><h2 id="law-popover-title">Art. 2:'+esc(article)+' BW'+(part?' · '+esc(part):'')+'</h2><p>Letterlijke wettekst</p></div><button type="button" data-law-popover-close aria-label="Wetsartikel sluiten">×</button></header><div class="law-popover-content"><p class="law-mark-legend"><mark>Gearceerd</mark> = '+(selection.contextual?'kern voor deze verwijzing':'algemene kern van het artikel')+'. Geen vertaling.</p><div class="law-quote">'+rows.map(function(r){return '<p data-law-paragraph="'+r.index+'">'+marked(r)+'</p>';}).join('')+'</div></div><footer><span>Studiekopie Boek 2 BW, p. '+esc(law.pages||law.page)+' · 01-01-2025</span><button type="button" data-law-full aria-expanded="'+expanded+'">'+(expanded?'Alleen relevante passage':'Volledig artikel')+'</button></footer>';
  position();
 }
 function open(a,p,from){if(!window.CAFA2_STUDY||!window.CAFA2_STUDY.laws[a]||!window.CafaLawFocus)return;ensure();if(opener===from&&!popup.hidden){close(true);return;}if(opener){opener.setAttribute('aria-expanded','false');}
  opener=from;var r=from.getBoundingClientRect();if(r.bottom>innerHeight-220)from.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'});article=a;part=p||'';expanded=false;selection=window.CafaLawFocus.resolve(a,window.CAFA2_STUDY.laws[a],part,contextFor(from));opener.setAttribute('aria-haspopup','dialog');opener.setAttribute('aria-expanded','true');opener.setAttribute('aria-controls',popup.id);popup.hidden=false;render();
  if(popup.showPopover){try{if(!popup.matches(':popover-open'))popup.showPopover();}catch(_){popup.removeAttribute('popover');}}
  position();requestAnimationFrame(position);
  if(from.matches(':focus-visible'))popup.focus({preventScroll:true});
 }
 function close(restore){if(!popup||popup.hidden)return;var old=opener;opener=null;if(old)old.setAttribute('aria-expanded','false');if(popup.hidePopover){try{popup.hidePopover();}catch(_){}}popup.hidden=true;if(restore&&old&&old.isConnected)old.focus({preventScroll:true});}
 function schedule(){if(frame)return;frame=requestAnimationFrame(function(){frame=null;position();});}
 document.addEventListener('click',function(e){var a=e.target.closest('[data-law]');if(a){e.preventDefault();e.stopImmediatePropagation();open(a.dataset.law,a.dataset.lawPart,a);return;}if(e.target.closest('[data-law-popover-close]')){close(true);return;}if(e.target.closest('[data-law-full]')){expanded=!expanded;render();popup.querySelector('[data-law-full]').focus({preventScroll:true});return;}if(popup&&!popup.hidden&&!popup.contains(e.target))close(false);},true);
 document.addEventListener('keydown',function(e){if(e.key==='Escape'&&popup&&!popup.hidden){e.preventDefault();e.stopPropagation();close(true);}},true);
 window.addEventListener('scroll',schedule,true);window.addEventListener('resize',schedule);window.addEventListener('hashchange',function(){close(false);});window.addEventListener('cafa:exam-route',function(){close(false);});
 if(window.visualViewport){visualViewport.addEventListener('resize',schedule);visualViewport.addEventListener('scroll',schedule);}
 window.CafaLaw={open:open,close:close,contextFor:contextFor};
}());
