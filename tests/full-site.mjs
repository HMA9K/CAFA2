import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const {JSDOM,VirtualConsole}=await import(process.env.JSDOM_PATH?pathToFileURL(process.env.JSDOM_PATH).href:'jsdom');
const server=http.createServer((req,res)=>{const name=path.resolve(root,'.'+(req.url==='/'?'/index.html':decodeURIComponent(req.url.split('?')[0])));if(!name.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}try{res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(name));}catch(e){res.writeHead(404);res.end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const startupChecks=[],errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
let dom,readyTimeout;
let signalReady;
const ready=new Promise(resolve=>{signalReady=resolve;});
try{
  dom=await JSDOM.fromURL('http://127.0.0.1:'+server.address().port+'/',{resources:'usable',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.addEventListener('cafa:ready',signalReady,{once:true});w.fetch=(u,o)=>{startupChecks.push(w.getComputedStyle(w.document.getElementById('app-content')).display);return fetch(new URL(u,w.location.href),o);};w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});w.scrollTo=()=>{};w.confirm=()=>true;w.alert=()=>{};w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};}});
  const w=dom.window,pause=()=>new Promise(r=>setTimeout(r,50));
  // CafaExams is created before the remaining bootstrap assets have loaded.
  // Wait for the same completion event used by the site, including slower JSDOM rendering.
  await Promise.race([ready,new Promise((_,reject)=>{readyTimeout=setTimeout(()=>reject(new Error('Full bootstrap did not finish: '+errors.join('\n'))),120000);})]);
  clearTimeout(readyTimeout);
  assert.ok(startupChecks.length>0);assert.ok(startupChecks.every(display=>display==='none'),'The intermediate topic screen must stay hidden during fragment loading.');
  assert.equal(w.document.documentElement.classList.contains('cafa-starting'),false);
  assert.equal(w.document.documentElement.classList.contains('cafa-start-failed'),false);
  assert.ok(w.CafaExams,'Full bootstrap ready');assert.equal(w.document.querySelectorAll('.question[data-code]').length,247);assert.equal(w.CafaExams.catalog.length,11);assert.equal(w.location.hash,'#start');
  w.location.hash='#dashboard';await pause();
  assert.ok(w.document.querySelector('#exam-app').textContent.includes('29-04-2026'));
  const reset=w.document.querySelector('[data-font="0"]');
  assert.equal(reset.hidden,true);assert.equal(w.document.querySelector('.cafa-profile').textContent,'Anoniem');
  w.document.querySelector('[data-font="1"]').click();assert.equal(reset.hidden,false);
  reset.click();assert.equal(reset.hidden,true);
  w.document.querySelector('[data-font="-1"]').click();assert.equal(reset.hidden,false);
  reset.click();assert.equal(reset.hidden,true);

  w.location.hash='#welkom/cafa2-20260429';await pause();
  assert.ok(!w.document.querySelector('#exam-app').textContent.includes('Oostermoer'),'Welcome has no case answers');
  w.document.querySelector('[data-exam-extra]').click();assert.equal(w.document.querySelector('[data-exam-detail-duration]').textContent,'210 minuten');
  w.document.querySelector('[data-exam-action="start"]').click();await pause();assert.equal(w.document.querySelector('.exam-position').textContent,'VRAAG 1 VAN 23');
  assert.equal(w.document.querySelector('[role="timer"]').textContent,'210 minuten');
  assert.equal(w.document.querySelector('.exam-time-badge span').textContent,'Totaal resterende tijd:');
  const casePanel=w.document.querySelector('#exam-case-panel');assert.equal(casePanel.hidden,false);
  assert.ok(casePanel.textContent.includes('Dingspel'));assert.ok(!casePanel.textContent.includes('Moderna'));
  assert.equal(casePanel.querySelector('img,.exam-source-brand'),null);
  const caseEditor=w.document.querySelector('[contenteditable="true"]');
  const caseButtons=w.document.querySelectorAll('[data-exam-action="section"]');assert.equal(caseButtons.length,2);
  caseButtons[0].click();assert.equal(casePanel.hidden,true);
  assert.ok(Array.from(caseButtons).every(button=>button.getAttribute('aria-expanded')==='false'));
  caseButtons[1].click();assert.equal(casePanel.hidden,false);
  assert.ok(Array.from(caseButtons).every(button=>button.getAttribute('aria-expanded')==='true'));
  assert.equal(w.document.querySelector('[contenteditable="true"]'),caseEditor);
  assert.equal(w.document.querySelector('#exam-info-dialog'),null);
  w.location.hash='#kap-1';await pause();assert.equal(w.document.querySelectorAll('.practice-action').length,988);assert.equal(w.document.querySelector('.exam-clock').hidden,true);
  assert.equal(errors.length,0,errors.join('\n'));
  console.log('Full site passed: bootstrap, 247 MC, 11 exams, dashboard, +30, sections, MC footer, timer isolation.');
}finally{clearTimeout(readyTimeout);if(dom)dom.window.close();await new Promise(resolve=>server.close(resolve));}
