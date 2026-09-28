/* Alleen invoer normaliseren; de bestaande begrensde parser blijft actief. */
(() => {
  const numbers=source=>String(source).replace(/\d+(?:[.,]\d+)+/g,token=>{
    if(token.includes(',')){
      if(!/^(?:\d+|\d{1,3}(?:\.\d{3})+),\d+$/.test(token))throw Error('Controleer de punten en komma in het getal.');
      return token.replaceAll('.','').replace(',','.');
    }
    if(/^[1-9]\d{0,2}(?:\.\d{3})+$/.test(token))return token.replaceAll('.','');
    if((token.match(/\./g)||[]).length>1)throw Error('Gebruik punten voor duizendtallen en een komma voor decimalen.');
    return token;
  });
  // A leading minus is a unary sign for a new calculation, even after a result.
  // Subtraction from the previous result remains available as explicit Ans-….
  const continuation=(s,continueFromResult=false)=>/^[*×x÷/:^%]/.test(s.trim())||(continueFromResult&&/^\+/.test(s.trim()))?'Ans'+s.trim():s;
  window.CirrusCalcInput={numbers,normalize:(s,last,continueFromResult)=>numbers(continuation(String(s),continueFromResult)).replace(/\bAns\b/gi,'('+String(last)+')'),history:(s,last,continueFromResult)=>continuation(String(s),continueFromResult).replace(/\bAns\b/gi,'('+String(last).replace('.',',')+')'),label:continuation};
})();
