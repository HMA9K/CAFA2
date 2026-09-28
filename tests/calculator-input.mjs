import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const context={window:{}};vm.createContext(context);
vm.runInContext(fs.readFileSync(new URL('../js/calculator-input.js',import.meta.url),'utf8'),context);
const input=context.window.CirrusCalcInput;
for(const previous of [0,100,-21600])for(const continued of [false,true]){
 assert.equal(input.label('-5000',continued),'-5000');
 assert.equal(input.normalize('-5.000',previous,continued),'-5000');
 assert.equal(input.label('−5.000',continued),'−5.000');
 assert.equal(input.normalize('Ans-5.000',previous,continued),'('+previous+')-5000');
 assert.equal(input.history('Ans-5',previous,continued),'('+previous+')-5');
}
for(const op of ['*','/','^','%'])assert.equal(input.label(op+'2',true),'Ans'+op+'2');
assert.equal(input.label('+5',true),'Ans+5');
assert.equal(input.label('+5',false),'+5');
assert.equal(input.normalize('-1.600.000+1.350.000+2.850.000-2.000.000',-350000,true),'-1600000+1350000+2850000-2000000');
console.log('Rekenmachine: negatief startbedrag onafhankelijk van vorige uitkomst; expliciet Ans en overige vervolgoperatoren behouden.');
