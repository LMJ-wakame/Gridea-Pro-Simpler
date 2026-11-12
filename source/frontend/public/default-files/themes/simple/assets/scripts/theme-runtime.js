(() => {
  'use strict';
  const highlight = document.currentScript?.dataset.highlight === 'true';
  const sidebar = document.querySelector('.sidebar');
  sidebar?.querySelector('.menu-btn')?.addEventListener('click', () => {
    sidebar.classList.toggle('full-height');
  });
  const desktopToggle = document.querySelector('.desktop-sidebar-toggle');
  const desktopScreen = window.matchMedia('(min-width: 801px)');
  const updateSidebarAccess = () => {
    if (sidebar) sidebar.inert = desktopScreen.matches && document.body.classList.contains('desktop-sidebar-collapsed');
  };
  desktopScreen.addEventListener('change', updateSidebarAccess);
  desktopToggle?.addEventListener('click', () => {
    const collapsed = document.body.classList.toggle('desktop-sidebar-collapsed');
    updateSidebarAccess();
    desktopToggle.setAttribute('aria-expanded', String(!collapsed));
    desktopToggle.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
    desktopToggle.title = collapsed ? 'Expand sidebar' : 'Collapse sidebar';
  });

  // Keep the existing animations, without waiting for images or remote scripts.
  if (window.AOS) {
    window.AOS.init();
  } else {
    document.querySelectorAll('[data-aos]').forEach(el => el.removeAttribute('data-aos'));
  }

  const loadScript = (src, onload) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    if (onload) script.addEventListener('load', onload, {once: true});
    document.head.append(script);
  };
  if (highlight && document.querySelector('pre code')) {
    loadScript('/vendor/highlight.min.js', () => window.hljs?.highlightAll());
  }

  // Load the external comment widget only on pages that actually contain it.
  window.ensureSimpleComments = (refresh = false) => {
    const previous = document.querySelector('[data-zoomment-loader]');
    if (!document.getElementById('zoomment')) { previous?.remove(); return; }
    if (refresh) previous?.remove();
    if (document.querySelector('[data-zoomment-loader]')) return;
    const script = document.createElement('script');
    script.src = 'https://cdn.zoomment.com/zoomment.min.js';
    script.async = true;
    script.dataset.zoommentLoader = 'true';
    // Place the loader beside its widget so the embed can resolve the right
    // container after an internal page swap, just as in Zoomment's snippet.
    const comments = document.getElementById('zoomment');
    if (comments?.parentNode) comments.insertAdjacentElement('afterend', script);
    else document.head.append(script);
  };

  // Swap page content while keeping the sidebar and music player alive.
  if (!window.__simpleNavigationReady) {
    window.__simpleNavigationReady = true;
    const pageRoot = () => document.querySelector('.main-container');
    let navigationController;
    const isPageURL = url => url.origin === location.origin
      && !/\.(?:css|js|mjs|json|xml|txt|png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|eot|pdf|zip|mp[34]|webm|rss)$/i.test(url.pathname);

    async function navigate(url, {push = true, scroll = 0, saveCurrent = true} = {}) {
      const current = pageRoot();
      if (!current) return;
      navigationController?.abort();
      const controller = new AbortController();
      navigationController = controller;
      if (saveCurrent) history.replaceState({...history.state, scrollY: window.scrollY}, '');
      try {
        const response = await fetch(url.href, {signal: controller.signal});
        if (!response.ok || !/text\/html/i.test(response.headers.get('content-type') || '')) throw Error('Page unavailable');
        const parsed = new DOMParser().parseFromString(await response.text(), 'text/html');
        if (controller.signal.aborted) return;
        const next = parsed.querySelector('.main-container');
        if (!next) throw Error('Page content unavailable');
        current.innerHTML = next.innerHTML;
        document.querySelectorAll('style[data-page-style]').forEach(style => style.remove());
        parsed.head.querySelectorAll('style').forEach(source => {
          const style = document.createElement('style');
          style.dataset.pageStyle = 'true';
          style.textContent = source.textContent;
          document.head.append(style);
        });
        parsed.body.querySelectorAll('script:not([src])').forEach(source => {
          if (!source.textContent.trim()) return;
          const script = document.createElement('script');
          script.textContent = source.textContent;
          document.body.append(script);
          script.remove();
        });
        document.title = parsed.title;
        document.documentElement.lang = parsed.documentElement.lang || 'en';
        const description = parsed.querySelector('meta[name="description"]');
        const liveDescription = document.querySelector('meta[name="description"]');
        if (description && liveDescription) liveDescription.content = description.content;
        const canonical = parsed.querySelector('link[rel="canonical"]');
        const liveCanonical = document.querySelector('link[rel="canonical"]');
        if (canonical && liveCanonical) liveCanonical.href = canonical.href;
        document.querySelectorAll('link[data-page-math]').forEach(link => link.remove());
        parsed.querySelectorAll('link[href*="/vendor/katex-"]').forEach(link => {
          const style = document.createElement('link');
          style.rel = 'stylesheet'; style.href = link.href; style.dataset.pageMath = 'true';
          document.head.append(style);
        });
        if (push) history.pushState({scrollY: 0}, '', url.pathname + url.search + url.hash);
        window.scrollTo(0, scroll);
        if (window.goatcounter?.count) window.goatcounter.count({path: url.pathname + url.search});
        window.AOS?.refreshHard();
        window.initializeSimpleExtensions?.(current);
        if (window.hljs && current.querySelector('pre code')) window.hljs.highlightAll();
        else if (highlight && current.querySelector('pre code')) loadScript('/vendor/highlight.min.js', () => window.hljs?.highlightAll());
        window.ensureSimpleComments?.(true);
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error('Simple navigation failed; keeping the current page and sidebar.', error);
      }
    }

    document.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest?.('a[href]');
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download') || anchor.relList.contains('external')) return;
      const url = new URL(anchor.href, location.href);
      if (!isPageURL(url) || (url.pathname === location.pathname && url.search === location.search)) return;
      event.preventDefault();
      navigate(url);
    });
    window.addEventListener('popstate', () => navigate(new URL(location.href), {push: false, scroll: history.state?.scrollY || 0, saveCurrent: false}));
  }
  window.ensureSimpleComments();
})();
