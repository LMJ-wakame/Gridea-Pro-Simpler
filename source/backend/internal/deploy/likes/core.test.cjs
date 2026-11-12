const {test}=require('node:test');
const assert=require('node:assert/strict');
const {vote}=require('./core.cjs');
class Store {
  data=new Map();version=0;
  async getWithMetadata(key){const v=this.data.get(key);return v?structuredClone(v):null;}
  async setJSON(key,data,condition){const old=this.data.get(key);if(condition.onlyIfNew&&old || condition.onlyIfMatch&&old?.etag!==condition.onlyIfMatch)return {modified:false};const etag=String(++this.version);this.data.set(key,{data:structuredClone(data),etag});return {modified:true,etag};}
}
const params={post:'article',ip:'192.0.2.1',timezone:'Asia/Shanghai',method:'POST',now:new Date('2026-09-09T12:00:00Z')};
test('concurrent duplicate requests produce exactly one like',async()=>{const store=new Store();const results=await Promise.all(Array.from({length:12},()=>vote(store,params)));assert(results.every(r=>r.count===1));assert.equal((await vote(store,{...params,method:'GET'})).count,1)});
test('different IPs count once each; calendar midnight resets eligibility but retains total',async()=>{const store=new Store();await Promise.all(Array.from({length:8},(_,i)=>vote(store,{...params,ip:`192.0.2.${i}`})));assert.equal((await vote(store,{...params,method:'GET'})).count,8);assert.equal((await vote(store,{...params,now:new Date('2026-09-09T16:00:01Z')})).count,9);assert.equal((await vote(store,{...params,now:new Date('2026-09-09T16:00:02Z')})).count,9)});
test('posts are independent and failed writes never report success',async()=>{const store=new Store();await vote(store,params);assert.equal((await vote(store,{...params,post:'other'})).count,1);await assert.rejects(()=>vote({getWithMetadata:async()=>null,setJSON:async()=>({modified:true,etag:''})},params));});
