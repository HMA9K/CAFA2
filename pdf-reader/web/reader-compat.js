// PDF.js 6 uses these Map helpers; keep older supported browsers working too.
for(const [name,make] of [['getOrInsert',(key,value)=>value],['getOrInsertComputed',(key,callback)=>callback(key)]]){
 if(!Map.prototype[name])Object.defineProperty(Map.prototype,name,{configurable:true,writable:true,value:function(key,value){if(this.has(key))return this.get(key);const result=make(key,value);this.set(key,result);return result;}});
}
