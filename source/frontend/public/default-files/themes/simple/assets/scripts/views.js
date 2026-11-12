(() => {
  const code = document.currentScript.dataset.code;
  if(!/^[a-z0-9-]+$/i.test(code)) return;
  let tries=0;
  const timer=setInterval(()=>{
    if(++tries>100){clearInterval(timer);return;}
    if(!window.goatcounter?.get_data) return;
    clearInterval(timer);
    const count=document.getElementById('post-view-count');
    if(!count) return;
    const path=window.goatcounter.get_data().p;
    fetch(`https://${code}.goatcounter.com/counter/${encodeURIComponent(path)}.json`).then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{count.textContent=data.count;}).catch(()=>{});
  },100);
})();
