/** Window geometry only. Does not read questions, chats, answers or credentials. */
const DEFAULT_SIZE={w:444,h:680},COMPACT_SIZE={w:340,h:500};
const finite=(n,fallback)=>Number.isFinite(n)?n:fallback;
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

export function windowBounds(viewport,{size=DEFAULT_SIZE,position=null,collapsed=false,headerHeight=56}={}) {
  const x=finite(viewport.x,0),y=finite(viewport.y,0);
  const availableW=Math.max(1,finite(viewport.w,1)-16),availableH=Math.max(1,finite(viewport.h,1)-16);
  const w=clamp(finite(size?.w,DEFAULT_SIZE.w),Math.min(300,availableW),availableW);
  const h=collapsed?Math.min(headerHeight,availableH):clamp(finite(size?.h,DEFAULT_SIZE.h),Math.min(360,availableH),availableH);
  const left=x+8,top=y+8,maxX=left+availableW-w,maxY=top+availableH-h;
  return {w,h,x:clamp(finite(position?.x,maxX),left,maxX),y:clamp(finite(position?.y,y+76),top,maxY)};
}

export function windowPreferences(value) {
  const validSize=s=>s&&Number.isFinite(s.w)&&Number.isFinite(s.h)&&s.w>=1&&s.h>=1&&s.w<=4000&&s.h<=4000;
  const validPosition=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&Math.abs(p.x)<=20000&&Math.abs(p.y)<=20000;
  return {size:validSize(value?.size)?{w:value.size.w,h:value.size.h}:null,
    position:validPosition(value?.position)?{x:value.position.x,y:value.position.y}:null,
    expandedSize:validSize(value?.expandedSize)?{w:value.expandedSize.w,h:value.expandedSize.h}:null};
}

export function createAssistantWindow(panel,{storageKey='cafa2-assistant-window-v1'}={}) {
  const doc=panel.ownerDocument,win=doc.defaultView;
  const handle=panel.querySelector('[data-window-move]'),resizer=panel.querySelector('[data-window-resize]');
  const minimize=panel.querySelector('[data-window-minimize]'),compact=panel.querySelector('[data-window-compact]');
  let size=null,position=null,expandedSize=null,collapsed=false,drag=null,sizing=null,queued=false;
  try{({size,position,expandedSize}=windowPreferences(JSON.parse(win.localStorage.getItem(storageKey)||'null')));}catch{}
  const viewport=()=>{const v=win.visualViewport;return {x:v?.offsetLeft||0,y:v?.offsetTop||0,
    w:v?.width||doc.documentElement.clientWidth,h:v?.height||win.innerHeight};};
  function save(){try{win.localStorage.setItem(storageKey,JSON.stringify({size,position,expandedSize}));}catch{}}
  function labels(){
    minimize.textContent=collapsed?'+':'−';minimize.setAttribute('aria-expanded',String(!collapsed));
    minimize.setAttribute('aria-label',collapsed?'Assistent uitklappen':'Assistent inklappen');
    compact.textContent=expandedSize?'↗':'↙';compact.setAttribute('aria-label',expandedSize?'Assistent normale grootte':'Assistent verkleinen');
    compact.title=expandedSize?'Normale grootte':'Verkleinen';
  }
  // An answer dialog already makes the background inert. Keep the floating assistant
  // inside that dialog so its answer controls remain usable, without a second modal.
  function syncHost(){
    const modal=Array.from(doc.querySelectorAll('dialog[open]')).filter(el=>el!==panel&&!panel.contains(el)&&el.matches(':modal')).at(-1);
    const host=modal||doc.body;if(panel.parentElement!==host)host.append(panel);
  }
  function place(){
    if(!panel.open)return;
    syncHost();const v=viewport();
    panel.classList.toggle('is-short',!collapsed&&windowBounds(v,{size:size||DEFAULT_SIZE,position}).h<500);
    const bounds=windowBounds(v,{size:size||DEFAULT_SIZE,position,collapsed,
      headerHeight:panel.querySelector('.study-head').getBoundingClientRect().height+2});
    panel.style.width=bounds.w+'px';panel.style.height=collapsed?'auto':bounds.h+'px';
    panel.style.maxWidth=Math.max(1,v.w-16)+'px';panel.style.maxHeight=Math.max(1,v.h-16)+'px';
    panel.style.left=bounds.x+'px';panel.style.top=bounds.y+'px';panel.style.right='auto';panel.style.bottom='auto';
  }
  function queue(){if(queued)return;queued=true;win.requestAnimationFrame(()=>{queued=false;place();});}
  function expand(){collapsed=false;panel.classList.remove('is-collapsed');labels();place();}
  function show(){syncHost();if(!panel.open)panel.show();panel.setAttribute('aria-modal','false');expand();panel.style.zIndex='10020';}
  function finish(event){
    for(const [state,control] of [[drag,handle],[sizing,resizer]])if(state&&(!event||state.id===event.pointerId)){
      if(control.hasPointerCapture(state.id))control.releasePointerCapture(state.id);
    }
    if(!event||drag?.id===event.pointerId)drag=null;
    if(!event||sizing?.id===event.pointerId)sizing=null;
    save();
  }
  handle.addEventListener('pointerdown',event=>{
    if(event.button!==0)return;const r=panel.getBoundingClientRect();
    drag={id:event.pointerId,x:event.clientX-r.left,y:event.clientY-r.top};handle.setPointerCapture(event.pointerId);event.preventDefault();
  });
  handle.addEventListener('pointermove',event=>{if(drag?.id!==event.pointerId)return;
    const b=windowBounds(viewport(),{size:size||DEFAULT_SIZE,position:{x:event.clientX-drag.x,y:event.clientY-drag.y},collapsed});
    position={x:b.x,y:b.y};place();});
  function resize(w,h){size={w,h};expandedSize=null;labels();place();const r=panel.getBoundingClientRect();size={w:r.width,h:r.height};}
  resizer.addEventListener('pointerdown',event=>{
    if(event.button!==0)return;const r=panel.getBoundingClientRect();
    sizing={id:event.pointerId,x:event.clientX,y:event.clientY,w:r.width,h:r.height};resizer.setPointerCapture(event.pointerId);event.preventDefault();
  });
  resizer.addEventListener('pointermove',event=>{if(sizing?.id===event.pointerId)resize(sizing.w+event.clientX-sizing.x,sizing.h+event.clientY-sizing.y);});
  for(const control of [handle,resizer])for(const event of ['pointerup','pointercancel','lostpointercapture'])control.addEventListener(event,finish);
  function arrows(event){const delta={ArrowLeft:[-10,0],ArrowRight:[10,0],ArrowUp:[0,-10],ArrowDown:[0,10]}[event.key];
    return delta?.map(n=>n*(event.shiftKey?4:1));}
  handle.addEventListener('keydown',event=>{
    const delta=arrows(event);if(event.key==='Home'){event.preventDefault();position=null;place();save();}
    else if(delta){event.preventDefault();const r=panel.getBoundingClientRect();const b=windowBounds(viewport(),{
      size:size||DEFAULT_SIZE,position:{x:r.left+delta[0],y:r.top+delta[1]},collapsed});position={x:b.x,y:b.y};place();save();}
  });
  resizer.addEventListener('keydown',event=>{
    const delta=arrows(event);if(event.key==='Home'){event.preventDefault();size=null;expandedSize=null;labels();place();save();}
    else if(delta){event.preventDefault();const r=panel.getBoundingClientRect();resize(r.width+delta[0],r.height+delta[1]);save();}
  });
  minimize.addEventListener('click',()=>{collapsed=!collapsed;panel.classList.toggle('is-collapsed',collapsed);labels();place();});
  compact.addEventListener('click',()=>{
    if(expandedSize){size=expandedSize;expandedSize=null;}
    else{expandedSize={...(size||DEFAULT_SIZE)};size={...COMPACT_SIZE};}
    expand();save();
  });
  panel.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();panel.close();}});
  panel.addEventListener('close',()=>finish());
  for(const event of ['pointerdown','focusin'])doc.addEventListener(event,event=>{
    if(panel.contains(event.target))panel.style.zIndex='10020';
    else if(event.target.closest?.('#calculator-dialog'))panel.style.zIndex='10000';
  });
  const modalObserver=new win.MutationObserver(records=>{
    if(records.some(r=>!panel.contains(r.target)&&((r.type==='attributes'&&r.target.tagName==='DIALOG')||
      (r.type==='childList'&&Array.from(r.addedNodes).concat(Array.from(r.removedNodes)).some(n=>n===panel||n.contains?.(panel)||n.matches?.('dialog')||n.querySelector?.('dialog'))))))queue();
  });
  modalObserver.observe(doc.body,{subtree:true,childList:true,attributes:true,attributeFilter:['open']});
  win.addEventListener('resize',queue);win.visualViewport?.addEventListener('resize',queue);win.visualViewport?.addEventListener('scroll',queue);
  win.addEventListener('pagehide',save);labels();
  return {show,place,save};
}
