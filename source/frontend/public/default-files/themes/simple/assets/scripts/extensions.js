(() => {
  'use strict';
  const collapse = document.currentScript?.dataset.collapse !== 'false';
  if (collapse) document.querySelectorAll('.post-content pre').forEach((pre, index) => {
    const code = pre.querySelector('code') || pre;
    if (code.textContent.replace(/\n$/, '').split('\n').length <= 5) return;
    const shell = document.createElement('div');
    shell.className = 'code-preview';
    pre.parentNode.insertBefore(shell, pre);
    shell.append(pre);
    pre.id ||= `code-preview-${index}`;
    pre.classList.add('code-collapsed');
    const style = getComputedStyle(code);
    const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.5;
    const padding = parseFloat(getComputedStyle(pre).paddingTop) + parseFloat(style.paddingTop);
    pre.style.setProperty('--preview-height', `${lineHeight * 5 + padding}px`);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-toggle';
    button.textContent = '▾';
    button.setAttribute('aria-controls', pre.id);
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Expand code');
    button.addEventListener('click', () => {
      const collapsed = pre.classList.toggle('code-collapsed');
      button.textContent = collapsed ? '▾' : '▴';
      button.setAttribute('aria-expanded', String(!collapsed));
      button.setAttribute('aria-label', collapsed ? 'Expand code' : 'Collapse code');
    });
    shell.append(button);
  });

  const input = document.getElementById('site-search');
  if (input) {
    const list = document.getElementById('search-results');
    const status = document.getElementById('search-status');
    let indexPromise;
    let serial = 0;
    let timer;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      const current = ++serial;
      const terms = input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
      list.replaceChildren(); status.textContent = '';
      if (!terms.length) return;
      timer = setTimeout(async () => {
        status.textContent = 'Searching...';
        try {
          indexPromise ||= fetch('/api/search.json').then(r => { if(!r.ok) throw Error(); return r.json(); }).catch(e => { indexPromise = null; throw e; });
          const entries = await indexPromise;
          if (serial !== current) return;
          const results = (entries || []).map(p => {
            const title = p.title.toLocaleLowerCase();
            const text = `${title} ${(p.tags || []).join(' ')} ${p.content}`.toLocaleLowerCase();
            return { p, score: terms.every(t => text.includes(t)) ? 1 + terms.filter(t => title.includes(t)).length : 0 };
          }).filter(r => r.score).sort((a,b) => b.score-a.score);
          status.textContent = results.length ? `${results.length} results` : 'No results';
          results.forEach(({p}) => {
            const url = new URL(p.link, location.origin);
            if(url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
            const li = document.createElement('li'); const a = document.createElement('a');
            a.href = url.href; a.textContent = p.title; li.append(a); list.append(li);
          });
        } catch { if(serial === current) status.textContent = 'Search unavailable. Try again.'; }
      }, 180);
    });
  }

  const like = document.getElementById('post-like');
  if(like) {
    const count = like.querySelector('.like-count');
    const status = document.getElementById('like-status');
    const endpoint = new URL(like.dataset.endpoint, location.href);
    endpoint.searchParams.set('post', like.dataset.post);
    let busy = false;
    async function request(method) {
      if(busy) return; busy = true; like.disabled = true;
      try {
        const response = await fetch(endpoint, {method, credentials:'omit', headers:{Accept:'application/json'}});
        const data = await response.json().catch(()=>({}));
        if(!response.ok) {
          const message = response.status===404 || response.status===400
            ? 'Likes are available after publishing this site with Netlify.'
            : response.status===503 ? 'Likes are temporarily unavailable. Please try again later.'
            : 'Likes could not be loaded. Please try again later.';
          throw Error(message);
        }
        count.textContent = String(data.count);
        like.setAttribute('aria-pressed',String(data.liked));
        like.disabled = Boolean(data.liked);
        status.textContent = data.liked ? 'Liked today' : '';
      } catch (error) { status.textContent = method==='POST' ? 'Could not save. Try again.' : (error.message || 'Likes could not be loaded. Please try again later.'); like.disabled = false; }
      finally { busy = false; }
    }
    like.addEventListener('click',()=>request('POST'));
    request('GET');
  }

  const comments = document.getElementById('cusdis_thread');
  if (comments) {
    const attach = () => {
      const frame = comments.querySelector('iframe');
      if(!frame || frame.dataset.autoHeight) return;
      frame.dataset.autoHeight='true'; frame.title='Comments';
      const observe = () => {
        try {
          const doc = frame.contentDocument;
          if(!doc?.body) return;
          const size = () => {
            const root = doc.getElementById('root') || doc.body;
            const height = Math.ceil(root.getBoundingClientRect().height + 32);
            frame.style.height = `${Math.max(400,height)}px`;
          };
          new ResizeObserver(size).observe(doc.body);
          new MutationObserver(size).observe(doc.body,{childList:true,subtree:true,characterData:true});
          size();
        } catch { /* Cross-origin hosts use the verified resize message below. */ }
      };
      frame.addEventListener('load',observe); observe();
    };
    new MutationObserver(attach).observe(comments,{childList:true}); attach();
    window.addEventListener('message', event => {
      const frame=comments.querySelector('iframe');
      if(!frame || event.source !== frame.contentWindow) return;
      const hostOrigin=new URL(comments.dataset.host,location.href).origin;
      if(event.origin!==location.origin && event.origin!==hostOrigin) return;
      try {
        const message=typeof event.data==='string'?JSON.parse(event.data):event.data;
        if(message?.from==='cusdis' && message.event==='resize' && Number.isFinite(Number(message.data)) && Number(message.data)>0) frame.style.height=`${Math.max(400,Number(message.data))}px`;
      } catch {}
    });
  }
})();
