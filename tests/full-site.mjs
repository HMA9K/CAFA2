import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const {JSDOM,VirtualConsole}=await import(process.env.JSDOM_PATH?pathToFileURL(process.env.JSDOM_PATH).href:'jsdom');
const server=http.createServer((req,res)=>{const name=path.resolve(root,'.'+(req.url==='/'?'/index.html':decodeURIComponent(req.url.split('?')[0])));if(!name.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}try{res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(name));}catch(e){res.writeHead(404);res.end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
let dom;
try{
  dom=await JSDOM.fromURL('http://127.0.0.1:'+server.address().port+'/',{resources:'usable',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.fetch=(u,o)=>fetch(new URL(u,w.location.href),o);w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});w.scrollTo=()=>{};w.confirm=()=>true;w.alert=()=>{};w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};}});
  const w=dom.window,pause=()=>new Promise(r=>setTimeout(r,50));
  for(let i=0;i<400&&!w.CafaExams;i++)await pause();
  assert.ok(w.CafaExams,'Full bootstrap ready');assert.equal(w.document.querySelectorAll('.question[data-code]').length,120);assert.equal(w.CafaExams.catalog.length,5);assert.equal(w.location.hash,'#dashboard');
  assert.ok(w.document.querySelector('#exam-app').textContent.includes('29-04-2026'));
  w.location.hash='#welkom/cafa2-20260429';await pause();
  assert.ok(!w.document.querySelector('#exam-app').textContent.includes('Oostermoer'),'Welcome has no case answers');
  w.document.querySelector('[data-exam-extra]').click();assert.equal(w.document.querySelector('[data-exam-detail-duration]').textContent,'210 minuten');
  w.document.querySelector('[data-exam-action="start"]').click();await pause();assert.equal(w.document.querySelector('.exam-position').textContent,'VRAAG 1 VAN 23');
  w.document.querySelector('[data-exam-action="section"]').click();assert.ok(w.document.querySelector('#exam-info-dialog').textContent.includes('Dingspel'));assert.ok(!w.document.querySelector('#exam-info-dialog').textContent.includes('Moderna'));
  w.document.querySelector('[data-close-info]').click();
  w.location.hash='#kap-1';await pause();assert.equal(w.document.querySelectorAll('.practice-action').length,480);assert.equal(w.document.querySelector('.exam-clock').hidden,true);
  assert.equal(errors.length,0,errors.join('\n'));
  console.log('Full site passed: bootstrap, 120 MC, 5 exams, dashboard, +30, sections, MC footer, timer isolation.');
}finally{if(dom)dom.window.close();await new Promise(resolve=>server.close(resolve));}
