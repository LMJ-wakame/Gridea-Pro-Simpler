'use strict';
const {createHmac, randomBytes} = require('node:crypto');

// A single conditional write commits the count and voter together.
async function vote(store, {post, ip, timezone, method, now = new Date()}) {
  const day = new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
  const key = `post/${post}`;
  for(let attempt=0;attempt<20;attempt++) {
    const previous = await store.getWithMetadata(key,{type:'json',consistency:'strong'});
    const state = previous?.data || {count:0,day,secret:randomBytes(32).toString('hex'),voters:{}};
    if(state.day !== day) { state.day=day; state.voters={}; }
    const voter = createHmac('sha256',state.secret).update(`${day}\0${ip}`).digest('hex');
    if(method==='GET' || state.voters[voter]) return {count:state.count,liked:Boolean(state.voters[voter])};
    state.voters[voter]=true; state.count++;
    const result=await store.setJSON(key,state,previous?{onlyIfMatch:previous.etag}:{onlyIfNew:true});
    // Some SDK versions report modified=true with an empty ETag on failed HTTP writes.
    if(result.modified && !result.etag) throw Error('Storage did not confirm the write');
    if(result.modified) return {count:state.count,liked:true};
  }
  throw Error('Too many concurrent updates');
}
module.exports={vote};
