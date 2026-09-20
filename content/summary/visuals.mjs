import cons from './cons.mjs';
import {esc} from './helpers.mjs';
import {icScenario} from '../../js/ic-learning-engine.mjs';
const pct=n=>new Intl.NumberFormat('nl-NL',{maximumFractionDigits:2}).format(n*100)+'%';
function diagram(input){
 const s=icScenario(input),x=s.input;
 const seller=x.direction==='down'?'Moeder M':'Verkopende deelneming';
 const buyer=x.direction==='up'?'Moeder M':'Kopende deelneming';
 const owner=x.direction==='side'?'M houdt '+pct(x.sellerShare)+' in de verkoper en '+pct(x.buyerShare)+' in de koper.':x.direction==='down'?'M houdt '+pct(x.buyerShare)+' in de koper.':'M houdt '+pct(x.sellerShare)+' in de verkoper.';
 const parts=[['internal','Al intern gecorrigeerd',s.allocation.internal],['third','Voor derden',s.allocation.third],['additional','Nog aanvullend voor meerderheid',s.allocation.additional]];
 return '<figure class="ic-route-visual"><figcaption>'+esc(s.variant+' · '+x.basis)+'</figcaption><p class="ic-ownership">'+esc(owner)+'</p><div class="ic-goods-route"><div class="ic-entity"><strong>'+esc(seller)+'</strong><small>Hier is de winst geboekt</small></div><div class="ic-goods-arrow"><span>Goederen</span><b aria-hidden="true">→</b></div><div class="ic-entity"><strong>'+esc(buyer)+'</strong><small>Hier ligt de voorraad</small></div></div><p class="ic-bar-caption">Verdeling van 100% van de ongerealiseerde winst vóór belasting</p><div class="ic-allocation-bar" aria-hidden="true">'+parts.filter(p=>p[2]>1e-8).map(([id,label,n])=>'<span class="ic-part-'+id+'" style="flex:'+n+'">'+pct(n)+'</span>').join('')+'</div><div class="ic-allocation-labels">'+parts.map(([id,label,n])=>'<div class="ic-label-'+id+'"><span>'+esc(label)+'</span><strong>'+pct(n)+'</strong></div>').join('')+'</div></figure>';
}
const variants=[
 ['downstream-nvw',{direction:'down',basis:'NVW',buyerShare:.6}],
 ['upstream-nvw',{direction:'up',basis:'NVW',sellerShare:.75}],
 ['sidestream-nab',{direction:'side',basis:'NVW',sellerShare:.7,buyerShare:.9}],
 ['sidestream-ab',{direction:'side',basis:'NVW',sellerShare:.9,buyerShare:.7}],
 ['downstream-hk',{direction:'down',basis:'HK',buyerShare:.75}],
 ['upstream-hk',{direction:'up',basis:'HK',sellerShare:.75}]
];
for(const [id,input] of variants){const l=cons.find(l=>l.id===id);l.html=diagram(input)+l.html;}
const streams=cons.find(l=>l.id==='streams');
streams.html='<p>De pijlen hieronder geven de goederenstroom weer. De eigendomspercentages staan apart: zij bepalen wie de winstcorrectie draagt, niet in welke richting de goederen zijn geleverd.</p><div class="ic-compare-visual">'+diagram({direction:'down',basis:'NVW',buyerShare:.75})+diagram({direction:'down',basis:'HK',buyerShare:.75})+'</div>'+streams.html;
export const visualStyles=`
.summary-page>label[for=study-search]{display:block;margin-bottom:8px;font-size:14px;color:#596171}
.ic-route-visual{margin:0 0 24px;padding:20px;border:1px solid #d5dfe0;border-radius:7px;background:#fbfcfd;min-width:0}
.ic-route-visual figcaption{font-size:16px;font-weight:700;color:#403b54}.ic-ownership{font-size:13px!important;color:#606978;margin:5px 0 16px!important}
.ic-goods-route{display:grid;grid-template-columns:minmax(0,1fr) 80px minmax(0,1fr);align-items:center;gap:8px}
.ic-entity{border:1px solid #c4ced3;border-radius:6px;padding:13px 10px;background:white;text-align:center;min-width:0}.ic-entity strong{font-size:14px;display:block}.ic-entity small{font-size:12px;color:#66727b;display:block;margin-top:3px}
.ic-goods-arrow{text-align:center;color:#4a4560}.ic-goods-arrow span{font-size:11px;display:block}.ic-goods-arrow b{font-size:35px;display:block;line-height:1.1}
.ic-bar-caption{font-size:12px!important;margin:18px 0 8px!important;color:#5b6470}.ic-allocation-bar{display:flex;min-height:30px;border-radius:4px;overflow:hidden}.ic-allocation-bar span{display:flex;align-items:center;justify-content:center;min-width:0;color:white;font-weight:700;font-size:12px}
.ic-part-internal{background:#476b91}.ic-part-third{background:#765587}.ic-part-additional{background:#127d62}
.ic-allocation-labels{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:12px;font-size:12px;line-height:1.5}.ic-allocation-labels>div{border-top:3px solid;padding-top:6px;min-width:0}.ic-allocation-labels strong{display:block;font-size:16px}.ic-label-internal{border-color:#476b91!important}.ic-label-third{border-color:#765587!important}.ic-label-additional{border-color:#127d62!important}
.ic-compare-visual{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px}.ic-compare-visual .ic-goods-route{grid-template-columns:minmax(0,1fr) 38px minmax(0,1fr)}
@media(max-width:1100px){.ic-compare-visual{grid-template-columns:1fr}}
@media(max-width:760px){.ic-route-visual{padding:13px}.ic-goods-route{grid-template-columns:minmax(0,1fr) 38px minmax(0,1fr)}.ic-entity{padding:10px 7px}.ic-entity strong{font-size:12px}.ic-entity small{font-size:11px}.ic-allocation-labels{font-size:11px;gap:7px}}
@media print{.ic-route-visual{break-inside:avoid}.ic-allocation-bar{print-color-adjust:exact;-webkit-print-color-adjust:exact}.ic-compare-visual{display:block}}
`;
