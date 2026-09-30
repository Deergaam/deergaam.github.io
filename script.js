/* ==========================================================================
   Deergaam — site script
   Renders everything from data/content.js. No backend, no build step.
   ========================================================================== */
(() => {
  'use strict';

  const DATA = window.DEERGAAM_CONTENT || {};
  const PROJECTS = (DATA.projects || []).filter((p) => p && p.id && p.title);
  const CATEGORIES = (DATA.categories && DATA.categories.length)
    ? DATA.categories
    : [...new Set(PROJECTS.map((p) => p.category).filter(Boolean))];
  const PAGE = document.body.dataset.page;
  const HOME = PAGE === 'home';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // ---------------------------------------------------------------- helpers
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const projectUrl = (p) => `project.html?id=${encodeURIComponent(p.id)}`;
  const homeLink = (hash) => (HOME ? hash : `./${hash}`);
  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

  function hash(str) { let h = 2166136261; for (const ch of str) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let s = seed || 1; return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296); }

  function promptOf(p) {
    if (!p || !p.prompt) return null;
    if (typeof p.prompt === 'string') return { title: p.title, description: '', text: p.prompt };
    if (!p.prompt.text) return null;
    return { title: p.prompt.title || p.title, description: p.prompt.description || '', text: p.prompt.text };
  }
  const PROMPTS = PROJECTS.map((p) => ({ project: p, ...promptOf(p) })).filter((x) => x.text);

  const ICON = {
    copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
    chevron: '<svg class="toggle-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"/></svg>',
    prompt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 17l6-5-6-5"/><path d="M12 19h8"/></svg>',
    tool: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3.5-3.5 8-8"/><path d="M14.7 6.3 13 4.6a2 2 0 0 0-2.8 0L3.5 11.3a2 2 0 0 0 0 2.8l1.7 1.7"/></svg>',
    file: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M12 11v6"/><path d="m9 14 3 3 3-3"/></svg>',
    image: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/></svg>',
    link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a5 5 0 0 0 7.1 0l3-3a5 5 0 0 0-7.1-7.1l-1 1"/><path d="M14 10a5 5 0 0 0-7.1 0l-3 3a5 5 0 0 0 7.1 7.1l1-1"/></svg>',
    download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/></svg>',
    external: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>',
  };

  // ---------------------------------------------------------------- resources (tools, files, images, links)
  const RES_TYPES = {
    tool: { label: 'Tool', plural: 'Tools' },
    file: { label: 'File', plural: 'Files' },
    image: { label: 'Image', plural: 'Images' },
    link: { label: 'Link', plural: 'Links' },
  };
  const safeUrl = (u) => (/^\s*(javascript|data|vbscript):/i.test(String(u || '')) ? '#' : String(u || '').trim());
  const isExternal = (u) => /^https?:\/\//i.test(u) && !u.startsWith(location.origin);
  function resourcesOf(p) {
    return (Array.isArray(p.resources) ? p.resources : [])
      .filter((r) => r && r.url && r.title)
      .map((r) => ({ ...r, type: RES_TYPES[r.type] ? r.type : 'link', url: safeUrl(r.url), project: p }));
  }
  const RESOURCES = PROJECTS.flatMap(resourcesOf);
  function resourceHTML(r, opts = {}) {
    const ext = isExternal(r.url);
    const dl = (r.type === 'file' || r.type === 'image') && !ext;
    const attrs = ext ? 'target="_blank" rel="noopener noreferrer"' : (dl ? 'download' : '');
    const icon = r.type === 'image' ? `<img src="${esc(r.url)}" alt="" loading="lazy" decoding="async">` : ICON[r.type];
    return `<li class="resource">
      <span class="resource-icon">${icon}</span>
      <div class="resource-main">
        <span class="resource-type">${RES_TYPES[r.type].label}</span>
        <a class="resource-title" href="${esc(r.url)}" ${attrs}>${esc(r.title)}${ext ? '<span class="sr-only"> (opens in a new tab)</span>' : ''}</a>
        ${r.description ? `<p class="resource-desc">${esc(r.description)}</p>` : ''}
        ${opts.showProject ? `<p class="resource-rel">From: <a href="${projectUrl(r.project)}">${esc(r.project.title)}</a></p>` : ''}
      </div>
      ${(dl ? ICON.download : ICON.external).replace('<svg ', '<svg class="resource-go" ')}
    </li>`;
  }
  function galleryHTML(images) {
    return `<ul class="gallery">${images.map((r) => `<li class="gallery-item">
      <a href="${esc(r.url)}" target="_blank" rel="noopener"><img src="${esc(r.url)}" alt="${esc(r.title)}" loading="lazy" decoding="async"></a>
      <div class="gallery-cap"><span>${esc(r.title)}</span><a href="${esc(r.url)}" download>${ICON.download}Download</a></div>
    </li>`).join('')}</ul>`;
  }
  function includesHTML(p) {
    const rs = resourcesOf(p), items = [];
    if (promptOf(p)) items.push([ICON.prompt, 'Prompt']);
    Object.keys(RES_TYPES).forEach((t) => {
      const n = rs.filter((r) => r.type === t).length;
      if (n) items.push([ICON[t], n === 1 ? RES_TYPES[t].label : `${n} ${RES_TYPES[t].plural.toLowerCase()}`]);
    });
    return items.length ? `<ul class="card-includes" aria-label="Includes">${items.map(([i, l]) => `<li>${i}${esc(l)}</li>`).join('')}</ul>` : '';
  }

  // ---------------------------------------------------------------- generated thumbnails (used when `thumbnail` is empty)
  function genThumb(p) {
    const r = rng(hash(p.id));
    const id = `g${hash(p.id).toString(36)}`;
    const gx = 120 + r() * 400, gy = 60 + r() * 200;
    const O = '#D97757', OS = 'rgba(217,119,87,0.28)', INK = '#141413', LINE = 'rgba(20,20,19,0.14)';
    let art = '';
    if (p.category === 'Motion Graphics') {
      const n = 7, hi = Math.floor(r() * n);
      for (let i = 0; i < n; i++) {
        const h = 50 + r() * 170, x = 110 + i * 62;
        art += `<rect x="${x}" y="${300 - h}" width="40" height="${h}" rx="6" fill="${i === hi ? O : OS}"/>`;
      }
      art += `<path d="M90 250 C 220 120, 380 280, 560 90" fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="4 10" stroke-linecap="round"/>`;
      art += `<circle cx="560" cy="90" r="9" fill="${INK}"/>`;
    } else if (p.category === 'Images') {
      [[-9, 'rgba(217,119,87,0.14)'], [6, 'rgba(217,119,87,0.24)']].forEach(([rot, f]) => {
        art += `<rect x="200" y="85" width="240" height="170" rx="14" fill="${f}" stroke="${LINE}" transform="rotate(${rot} 320 170)"/>`;
      });
      art += `<rect x="200" y="85" width="240" height="170" rx="14" fill="#fff" stroke="${LINE}" stroke-width="2"/>`;
      art += `<circle cx="385" cy="130" r="16" fill="${O}"/>`;
      art += `<path d="M212 243 L285 160 L335 212 L365 185 L428 243 Z" fill="rgba(217,119,87,0.5)"/>`;
    } else if (p.category === 'Creative Experiments') {
      for (let i = 0; i < 3; i++) {
        art += `<ellipse cx="320" cy="180" rx="${150 - i * 28}" ry="${60 + i * 12}" fill="none" stroke="rgba(217,119,87,${0.6 - i * 0.14})" stroke-width="2" transform="rotate(${-25 + i * 38} 320 180)"/>`;
      }
      for (let i = 0; i < 6; i++) {
        const a = r() * Math.PI * 2, rad = 90 + r() * 70;
        art += `<rect x="${320 + Math.cos(a) * rad - 5}" y="${180 + Math.sin(a) * rad * 0.55 - 5}" width="10" height="10" fill="${INK}"/>`;
      }
      art += `<circle cx="320" cy="180" r="34" fill="${O}"/><circle cx="320" cy="180" r="56" fill="none" stroke="rgba(217,119,87,0.25)" stroke-width="10"/>`;
    } else { // Tutorials and anything else
      art += `<rect x="150" y="70" width="340" height="200" rx="16" fill="#fff" stroke="${LINE}" stroke-width="2"/>`;
      art += `<circle cx="320" cy="160" r="40" fill="${O}"/><path d="M308 140 L338 160 L308 180 Z" fill="#fff"/>`;
      art += `<rect x="178" y="236" width="284" height="6" rx="3" fill="rgba(20,20,19,0.08)"/><rect x="178" y="236" width="${80 + r() * 160}" height="6" rx="3" fill="${O}"/>`;
      for (let i = 0; i < 3; i++) art += `<circle cx="${270 + i * 50}" cy="306" r="7" fill="${i === 0 ? O : OS}"/>`;
    }
    return `<svg viewBox="0 0 640 360" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F7F4EC"/><stop offset="1" stop-color="#EFE9DC"/></linearGradient>
        <radialGradient id="${id}g" cx="${gx}" cy="${gy}" r="300" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="rgba(217,119,87,0.18)"/><stop offset="1" stop-color="rgba(217,119,87,0)"/></radialGradient>
        <pattern id="${id}d" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="rgba(20,20,19,0.09)"/></pattern>
      </defs>
      <rect width="640" height="360" fill="url(#${id}b)"/><rect width="640" height="360" fill="url(#${id}d)"/><rect width="640" height="360" fill="url(#${id}g)"/>
      ${art}
    </svg>`;
  }
  const thumbHTML = (p, eager) => (p.thumbnail
    ? `<img src="${esc(p.thumbnail)}" alt="" ${eager ? '' : 'loading="lazy"'} decoding="async">`
    : genThumb(p));

  // ---------------------------------------------------------------- video
  function youtubeId(url) {
    try {
      const u = new URL(url, location.href);
      if (/(^|\.)youtu\.be$/.test(u.hostname)) return u.pathname.slice(1).split('/')[0] || null;
      if (/(^|\.)youtube(-nocookie)?\.com$/.test(u.hostname)) {
        if (u.searchParams.get('v')) return u.searchParams.get('v');
        const m = u.pathname.match(/\/(shorts|embed|live)\/([\w-]{6,})/);
        if (m) return m[2];
      }
    } catch (e) { /* not a URL */ }
    return null;
  }
  function videoHTML(p) {
    const url = (p.videoUrl || '').trim();
    const yt = url && youtubeId(url);
    if (yt) {
      const poster = p.thumbnail ? thumbHTML(p, true) : `<img src="https://i.ytimg.com/vi/${esc(yt)}/hqdefault.jpg" alt="" decoding="async">`;
      return `<div class="video">${poster}
        <button class="video-facade" type="button" data-yt="${esc(yt)}" data-title="${esc(p.title)}" aria-label="Play video: ${esc(p.title)}">
          <span class="play-btn">${ICON.play}</span>
        </button></div>`;
    }
    if (url && /\.(mp4|webm)(\?|#|$)/i.test(url)) {
      return `<div class="video"><video controls preload="metadata" ${p.thumbnail ? `poster="${esc(p.thumbnail)}"` : ''} src="${esc(url)}"></video></div>`;
    }
    if (url) {
      return `<div class="video">${thumbHTML(p, true)}
        <a class="video-facade" href="${esc(url)}" target="_blank" rel="noopener noreferrer" aria-label="Watch video: ${esc(p.title)} (opens in a new tab)">
          <span class="play-btn">${ICON.play}</span></a></div>`;
    }
    return `<div class="video video-placeholder">${thumbHTML(p, true)}
      <p class="placeholder-note"><span><strong>Video placeholder</strong>The video is coming soon. It will play here once its YouTube link is added.</span></p></div>`;
  }
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-yt]');
    if (!btn) return;
    const wrap = btn.closest('.video');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(btn.dataset.yt)}?autoplay=1&rel=0`;
    iframe.title = btn.dataset.title || 'YouTube video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    wrap.innerHTML = ''; wrap.appendChild(iframe); iframe.focus();
  });

  // ---------------------------------------------------------------- toast + copy
  let toastTimer;
  function toast(msg) {
    const t = $('[data-toast]'); if (!t) return;
    t.innerHTML = `${ICON.check}<span>${esc(msg)}</span>`;
    t.classList.add('is-visible');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('is-visible'), 2600);
  }
  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        // never let a stalled clipboard request leave the button hanging
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500));
        await Promise.race([navigator.clipboard.writeText(text), timeout]);
        return true;
      } catch (e) { /* fall through to the legacy method */ }
    }
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
    document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove(); return ok;
  }
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    const item = PROMPTS.find((x) => x.project.id === btn.dataset.copy);
    if (!item) return;
    const ok = await copyText(item.text);
    const label = $('span', btn);
    if (ok) {
      btn.classList.add('is-copied');
      btn.querySelector('svg').outerHTML = ICON.check;
      label.textContent = 'Copied!';
      toast('Prompt copied. Paste it into your AI tool.');
      clearTimeout(btn._t);
      btn._t = setTimeout(() => { btn.classList.remove('is-copied'); btn.querySelector('svg').outerHTML = ICON.copy; label.textContent = 'Copy Prompt'; }, 2200);
    } else {
      // select the text so the visitor can copy it manually
      setExpanded(btn.dataset.copy, true);
      const pre = $(`#prompt-text-${CSS.escape(btn.dataset.copy)} pre`);
      if (pre) { const range = document.createRange(); range.selectNodeContents(pre); const s = getSelection(); s.removeAllRanges(); s.addRange(range); }
      toast('Copy blocked by the browser. The prompt is selected: press Ctrl+C (⌘C on Mac).');
    }
  });

  // ---------------------------------------------------------------- prompt cards (shared by home + project page)
  const expanded = new Set();
  function promptCardHTML(item, opts = {}) {
    const p = item.project, id = esc(p.id), open = opts.open || expanded.has(p.id);
    return `<article class="prompt-card" id="prompt-${id}" tabindex="-1">
      <div class="prompt-top"><div>
        ${opts.compact ? '' : `<div class="prompt-meta"><span class="chip">${esc(p.category)}</span>${p.example ? '<span class="badge-example">Example</span>' : ''}</div>
        <h3 class="prompt-title">${esc(item.title)}</h3>
        ${item.description ? `<p class="prompt-desc">${esc(item.description)}</p>` : ''}
        <p class="prompt-rel">Related: <a href="${projectUrl(p)}">${esc(p.title)}</a></p>`}
      </div></div>
      <div class="prompt-body ${open ? '' : 'is-collapsed'}" id="prompt-text-${id}"><pre>${esc(item.text)}</pre></div>
      <div class="prompt-actions">
        <button class="btn btn-primary btn-sm" type="button" data-copy="${id}">${ICON.copy}<span>Copy Prompt</span></button>
        <button class="btn btn-ghost btn-sm" type="button" data-toggle="${id}" aria-expanded="${open}" aria-controls="prompt-text-${id}"><span>${open ? 'Hide full prompt' : 'Show full prompt'}</span>${ICON.chevron}</button>
      </div>
    </article>`;
  }
  function setExpanded(id, open) {
    const body = document.getElementById(`prompt-text-${id}`);
    const btn = $(`[data-toggle="${CSS.escape(id)}"]`);
    if (!body || !btn) return;
    open ? expanded.add(id) : expanded.delete(id);
    body.classList.toggle('is-collapsed', !open);
    btn.setAttribute('aria-expanded', String(open));
    $('span', btn).textContent = open ? 'Hide full prompt' : 'Show full prompt';
  }
  // hide the toggle when a prompt is short enough to show in full
  function fitPromptToggles(root = document) {
    requestAnimationFrame(() => $$('.prompt-card', root).forEach((card) => {
      const body = $('.prompt-body', card), pre = $('pre', card), btn = $('[data-toggle]', card);
      if (!body || !pre || !btn) return;
      const wasCollapsed = body.classList.contains('is-collapsed');
      body.classList.add('is-collapsed');
      const short = pre.scrollHeight <= body.clientHeight + 4;
      body.classList.toggle('is-collapsed', wasCollapsed && !short);
      btn.hidden = short;
    }));
  }
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-toggle]');
    if (!btn) return;
    const id = btn.dataset.toggle;
    setExpanded(id, btn.getAttribute('aria-expanded') !== 'true');
  });

  // ---------------------------------------------------------------- project cards
  function cardHTML(p) {
    return `<article class="card">
      <div class="card-thumb">${thumbHTML(p)}${p.example ? '<span class="badge-example">Example</span>' : ''}</div>
      <div class="card-body">
        <div><span class="chip">${esc(p.category)}</span></div>
        <h3 class="card-title"><a href="${projectUrl(p)}">${esc(p.title)}</a></h3>
        <p class="card-desc">${esc(p.description)}</p>
        ${includesHTML(p)}
        <div class="card-foot" aria-hidden="true"><span>Open</span><span class="arrow">→</span></div>
      </div>
    </article>`;
  }
  function filterButtons(container, list, active, onPick) {
    const counts = (cat) => (cat === 'All' ? list.length : list.filter((x) => x.category === cat).length);
    container.innerHTML = ['All', ...CATEGORIES].map((cat) =>
      `<button class="filter-btn" type="button" data-cat="${esc(cat)}" aria-pressed="${cat === active}">${esc(cat)} <span class="filter-count">${counts(cat)}</span></button>`).join('');
    container.onclick = (e) => { const b = e.target.closest('[data-cat]'); if (b) onPick(b.dataset.cat); };
  }
  function pressFilter(container, cat) { $$('[data-cat]', container).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === cat))); }

  // ---------------------------------------------------------------- shell: header, nav, footer
  function initShell() {
    const header = $('[data-header]');
    const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

    const toggle = $('[data-nav-toggle]'), nav = $('[data-nav]');
    const setOpen = (open) => { toggle.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); };
    if (toggle && nav) {
      toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
      nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); } });
      window.addEventListener('resize', () => { if (window.innerWidth > 860) setOpen(false); });
    }

    const footer = $('[data-footer]');
    if (footer) {
      const socials = (DATA.social || []).filter((s) => s && s.url && String(s.url).trim());
      footer.innerHTML = `<div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a class="brand" href="./" aria-label="Deergaam — home"><img src="assets/brand/logo-mark-orange.png" alt="" width="26" height="28"><span class="brand-word">Deergaam</span></a>
            <p>${esc((DATA.site && DATA.site.tagline) || '')}</p>
          </div>
          <nav class="footer-col" aria-label="Footer">
            <h2>Explore</h2>
            <ul>
              <li><a href="${homeLink('#projects')}" data-filter="All">Videos</a></li>
              <li><a href="${homeLink('#prompts')}">Prompts</a></li>
              <li><a href="${homeLink('#resources')}">Tools &amp; Files</a></li>
              <li><a href="${homeLink('#about')}">About</a></li>
            </ul>
          </nav>
          ${socials.length ? `<div class="footer-col"><h2>Follow</h2><ul>${socials.map((s) =>
            `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}<span class="sr-only"> (opens in a new tab)</span></a></li>`).join('')}</ul></div>` : ''}
        </div>
        <div class="footer-bottom"><span>© ${new Date().getFullYear()} Deergaam</span><span>Prompts, tools and files from the videos.</span></div>
      </div>`;
    }
  }

  // ---------------------------------------------------------------- home page
  function initHome() {
    const links = $$('[data-nav] a[data-section]');
    let current = 'home';
    // featured
    const featuredRoot = $('[data-featured]');
    const featured = PROJECTS.find((p) => p.featured) || PROJECTS[0];
    if (!featured) featuredRoot.closest('section').hidden = true;
    else {
      const hasPrompt = PROMPTS.some((x) => x.project.id === featured.id);
      featuredRoot.innerHTML = `<div class="featured reveal">
        <div class="featured-media">${videoHTML(featured)}</div>
        <div class="featured-copy">
          <p class="eyebrow">Latest video</p>
          <div class="featured-meta"><span class="chip">${esc(featured.category)}</span>${featured.example ? '<span class="badge-example">Example</span>' : ''}</div>
          <h2 id="featured-title" class="featured-title">${esc(featured.title)}</h2>
          <p class="lead">${esc(featured.description)}</p>
          ${includesHTML(featured)}
          <div class="featured-actions">
            ${hasPrompt ? `<a class="btn btn-primary" href="#prompt-${esc(featured.id)}" data-open-prompt="${esc(featured.id)}">Get the Full Prompt</a>` : ''}
            <a class="btn btn-ghost" href="${projectUrl(featured)}${resourcesOf(featured).length ? '#resources' : ''}">${resourcesOf(featured).length ? 'Tools &amp; Files' : 'Video Page'}</a>
          </div>
        </div>
      </div>`;
    }

    // projects grid
    const state = { cat: 'All', pcat: 'All', q: '' };
    const pFilters = $('[data-project-filters]'), grid = $('[data-project-grid]'), pStatus = $('[data-project-status]');
    function renderProjects() {
      const list = state.cat === 'All' ? PROJECTS : PROJECTS.filter((p) => p.category === state.cat);
      grid.innerHTML = list.length ? list.map(cardHTML).join('') : `<p class="empty">No videos in “${esc(state.cat)}” yet.</p>`;
      pStatus.textContent = `Showing ${plural(list.length, 'video')}${state.cat === 'All' ? '' : ` in ${state.cat}`}.`;
      updateNavCurrent();
    }
    function setProjectCat(cat) { state.cat = CATEGORIES.includes(cat) ? cat : 'All'; pressFilter(pFilters, state.cat); renderProjects(); }
    filterButtons(pFilters, PROJECTS, state.cat, setProjectCat);
    renderProjects();

    // prompt library
    const qFilters = $('[data-prompt-filters]'), list = $('[data-prompt-list]'), qStatus = $('[data-prompt-status]'), search = $('[data-prompt-search]');
    function matches(item) {
      if (state.pcat !== 'All' && item.project.category !== state.pcat) return false;
      if (!state.q) return true;
      const hay = `${item.title} ${item.description} ${item.text} ${item.project.title} ${item.project.category}`.toLowerCase();
      return state.q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => hay.includes(w));
    }
    function renderPrompts() {
      const shown = PROMPTS.filter(matches);
      list.innerHTML = shown.length ? shown.map((x) => promptCardHTML(x)).join('')
        : `<div class="empty"><p>No prompts match${state.q ? ` “${esc(state.q)}”` : ''}${state.pcat !== 'All' ? ` in ${esc(state.pcat)}` : ''}.</p>
           <p style="margin-top:14px"><button class="btn btn-ghost btn-sm" type="button" data-reset-prompts>Clear search and filters</button></p></div>`;
      qStatus.textContent = shown.length === PROMPTS.length ? `${plural(PROMPTS.length, 'prompt')}` : `Showing ${shown.length} of ${plural(PROMPTS.length, 'prompt')}`;
      fitPromptToggles(list);
    }
    function setPromptCat(cat) { state.pcat = CATEGORIES.includes(cat) ? cat : 'All'; pressFilter(qFilters, state.pcat); renderPrompts(); }
    function resetPrompts() { state.q = ''; search.value = ''; setPromptCat('All'); }
    filterButtons(qFilters, PROMPTS.map((x) => x.project), state.pcat, setPromptCat);
    let t; search.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { state.q = search.value.trim(); renderPrompts(); }, 120); });
    search.addEventListener('keydown', (e) => { if (e.key === 'Escape' && search.value) { e.stopPropagation(); resetPrompts(); } });
    list.addEventListener('click', (e) => { if (e.target.closest('[data-reset-prompts]')) { resetPrompts(); search.focus(); } });
    renderPrompts();

    // open a specific prompt (deep link #prompt-<id>)
    function openPrompt(id, focus = true) {
      if (!PROMPTS.some((x) => x.project.id === id)) return;
      if (!$(`#prompt-${CSS.escape(id)}`)) resetPrompts();
      expanded.add(id); setExpanded(id, true);
      const card = $(`#prompt-${CSS.escape(id)}`);
      card.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
      card.classList.add('is-highlight'); setTimeout(() => card.classList.remove('is-highlight'), 2400);
      if (focus) card.focus({ preventScroll: true });
    }
    document.addEventListener('click', (e) => {
      const a = e.target.closest('[data-open-prompt]');
      if (a) { e.preventDefault(); history.replaceState(null, '', `#prompt-${a.dataset.openPrompt}`); openPrompt(a.dataset.openPrompt); return; }
      const f = e.target.closest('a[data-filter]');
      if (f) setProjectCat(f.dataset.filter);
    });
    function onHash() {
      const h = decodeURIComponent(location.hash.slice(1));
      if (h.startsWith('prompt-')) openPrompt(h.slice(7), false);
      else if (h === 'tutorials') setProjectCat('Tutorials');
      else if (h === 'projects') setProjectCat('All');
    }
    window.addEventListener('hashchange', onHash);
    if (location.hash) setTimeout(onHash, 60);

    // tools & files library
    const rFilters = $('[data-resource-filters]'), rList = $('[data-resource-list]'), rStatus = $('[data-resource-status]');
    const rTypes = Object.keys(RES_TYPES).filter((t) => RESOURCES.some((r) => r.type === t));
    if (!RESOURCES.length) $('#resources').hidden = true;
    else {
      let rType = 'All';
      const renderResources = () => {
        const shown = rType === 'All' ? RESOURCES : RESOURCES.filter((r) => r.type === rType);
        rList.innerHTML = shown.map((r) => resourceHTML(r, { showProject: true })).join('');
        rStatus.textContent = `Showing ${shown.length} of ${RESOURCES.length}.`;
        $$('[data-rtype]', rFilters).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.rtype === rType)));
      };
      rFilters.innerHTML = ['All', ...rTypes].map((t) => `<button class="filter-btn" type="button" data-rtype="${t}" aria-pressed="false">${t === 'All' ? 'All' : RES_TYPES[t].plural} <span class="filter-count">${t === 'All' ? RESOURCES.length : RESOURCES.filter((r) => r.type === t).length}</span></button>`).join('');
      rFilters.onclick = (e) => { const b = e.target.closest('[data-rtype]'); if (b) { rType = b.dataset.rtype; renderResources(); } };
      renderResources();
    }

    // hero stats
    const stats = $('[data-hero-stats]');
    if (stats) stats.innerHTML = [[PROJECTS.length, 'video'], [PROMPTS.length, 'prompt'], [RESOURCES.length, 'tool & file', 'tools & files']]
      .filter(([n]) => n).map(([n, w, pl]) => `<li><strong>${n}</strong> ${n === 1 ? w : (pl || `${w}s`)}</li>`).join('');

    // about: category chips
    const about = $('[data-about-categories]');
    if (about) about.innerHTML = CATEGORIES.map((c) => `<li><span class="chip">${esc(c)}</span></li>`).join('');

    // nav highlight for the section in view
    function updateNavCurrent() {
      links.forEach((a) => {
        a.dataset.section === current ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current');
      });
    }
    if ('IntersectionObserver' in window) {
      const map = { home: 'home', featured: 'home', projects: 'projects', prompts: 'prompts', resources: 'resources', about: 'about' };
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { current = map[en.target.id] || current; updateNavCurrent(); } });
      }, { rootMargin: '-45% 0px -50% 0px' });
      ['home', 'featured', 'projects', 'prompts', 'resources', 'about'].forEach((id) => { const s = document.getElementById(id); if (s) io.observe(s); });
    }
    updateNavCurrent();

    // gentle reveal for section headings and blocks
    const reveals = [...$$('.section-head'), ...$$('.about-grid'), ...$$('.featured')];
    if (!reduceMotion.matches && 'IntersectionObserver' in window) {
      reveals.forEach((el) => el.classList.add('reveal'));
      const ro = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); ro.unobserve(en.target); } }), { rootMargin: '0px 0px -10% 0px' });
      reveals.forEach((el) => ro.observe(el));
    } else reveals.forEach((el) => el.classList.add('is-visible'));

    heroArt();
  }

  // ---------------------------------------------------------------- project page
  function initProject() {
    const root = $('[data-project-root]');
    const id = new URLSearchParams(location.search).get('id');
    const p = PROJECTS.find((x) => x.id === id);
    if (!p) {
      document.title = 'Project not found — Deergaam';
      root.innerHTML = `<div class="notfound" style="min-height:50vh">
        <p class="eyebrow">Not found</p><h1 class="section-title">We couldn’t find that video.</h1>
        <p class="section-intro">It may have been renamed or removed.</p>
        <a class="btn btn-primary" href="./#projects">Browse all videos</a></div>`;
      return;
    }
    document.title = `${p.title} — Deergaam`;
    const md = $('meta[name="description"]'); if (md) md.setAttribute('content', p.description || '');
    const item = PROMPTS.find((x) => x.project.id === p.id);
    const related = PROJECTS.filter((x) => x.id !== p.id)
      .sort((a, b) => (b.category === p.category) - (a.category === p.category)).slice(0, 3);
    const res = resourcesOf(p), images = res.filter((r) => r.type === 'image'), others = res.filter((r) => r.type !== 'image');
    const resHTML = res.length ? `<section class="project-block" id="resources" aria-labelledby="res-heading">
        <p class="eyebrow">Download · open · try</p>
        <h2 id="res-heading">Tools &amp; Files</h2>
        ${images.length ? galleryHTML(images) : ''}
        ${others.length ? `<ul class="resource-list">${others.map((r) => resourceHTML(r)).join('')}</ul>` : ''}
      </section>` : '';
    root.innerHTML = `
      <nav aria-label="Breadcrumb"><ol class="breadcrumb">
        <li><a href="./">Home</a></li><li><a href="./#projects">Videos</a></li><li aria-current="page">${esc(p.title)}</li>
      </ol></nav>
      <header class="project-head">
        <div class="featured-meta"><span class="chip">${esc(p.category)}</span>${p.example ? '<span class="badge-example">Example</span>' : ''}</div>
        <h1>${esc(p.title)}</h1>
        <p>${esc(p.description)}</p>
      </header>
      <div class="project-video">${videoHTML(p)}</div>
      ${item ? `<section class="project-block" id="prompt" aria-labelledby="prompt-heading">
        <p class="eyebrow">The prompt</p>
        <h2 id="prompt-heading">${esc(item.title)}</h2>
        ${item.description ? `<p class="prompt-desc">${esc(item.description)}</p>` : ''}
        ${promptCardHTML(item, { open: true, compact: true })}
      </section>` : ''}
      ${resHTML}
      ${related.length ? `<section class="related" aria-labelledby="related-heading">
        <h2 id="related-heading">More videos</h2>
        <div class="card-grid">${related.map(cardHTML).join('')}</div>
      </section>` : ''}`;
    if (item) expanded.add(p.id);
    fitPromptToggles(root);
  }

  // ---------------------------------------------------------------- hero animation
  function heroArt() {
    const cv = $('[data-hero-canvas]');
    if (!cv) return;
    const g = cv.getContext('2d');
    const logo = new Image(); logo.src = 'assets/brand/logo-mark-orange-large.png';
    let W = 0, H = 0, dpr = 1, running = false, visible = true, raf = 0;
    const r = rng(7);
    const nodes = Array.from({ length: 46 }, () => {
      const u = r() * 2 - 1, th = r() * Math.PI * 2, k = Math.sqrt(1 - u * u);
      return { x: k * Math.cos(th), y: u, z: k * Math.sin(th) };
    });
    const edges = [];
    nodes.forEach((a, i) => nodes.forEach((b, j) => { if (j > i && Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z) < 0.62) edges.push([i, j]); }));
    const pulses = Array.from({ length: 7 }, (_, i) => ({ e: Math.floor(r() * edges.length), p: i / 7, v: 0.25 + r() * 0.35 }));
    const cards = [{ kind: 'bars', ph: 0 }, { kind: 'image', ph: 2.1 }, { kind: 'wave', ph: 4.2 }];

    function size() {
      const rect = cv.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1); W = rect.width; H = rect.height;
      cv.width = Math.max(1, Math.round(W * dpr)); cv.height = Math.max(1, Math.round(H * dpr));
    }
    function rrect(x, y, w, h, rad) { g.beginPath(); g.roundRect ? g.roundRect(x, y, w, h, rad) : g.rect(x, y, w, h); }
    function drawCard(c, x, y, s, alpha, t) {
      const w = 116 * s, h = 80 * s;
      g.save(); g.globalAlpha = alpha; g.translate(x, y);
      rrect(-w / 2, -h / 2, w, h, 12 * s); g.save(); g.shadowColor = 'rgba(20,20,19,0.12)'; g.shadowBlur = 18 * s; g.shadowOffsetY = 6 * s; g.fillStyle = '#FFFFFF'; g.fill(); g.restore();
      g.strokeStyle = 'rgba(20,20,19,0.10)'; g.lineWidth = 1; g.stroke();
      g.fillStyle = '#D97757'; g.strokeStyle = '#D97757';
      if (c.kind === 'bars') for (let i = 0; i < 5; i++) { const bh = (0.3 + 0.6 * Math.abs(Math.sin(t * 0.8 + i * 1.3))) * h * 0.55; g.globalAlpha = alpha * (i === 3 ? 1 : 0.45); g.fillRect(-w / 2 + 14 * s + i * 19 * s, h / 2 - 12 * s - bh, 11 * s, bh); }
      if (c.kind === 'image') { g.globalAlpha = alpha * 0.9; g.beginPath(); g.arc(w / 2 - 26 * s, -h / 2 + 22 * s, 8 * s, 0, 7); g.fill(); g.globalAlpha = alpha * 0.55; g.beginPath(); g.moveTo(-w / 2 + 10 * s, h / 2 - 10 * s); g.lineTo(-10 * s, -8 * s); g.lineTo(12 * s, 14 * s); g.lineTo(26 * s, 2 * s); g.lineTo(w / 2 - 10 * s, h / 2 - 10 * s); g.closePath(); g.fill(); }
      if (c.kind === 'wave') { g.lineWidth = 2.4 * s; g.globalAlpha = alpha; g.beginPath(); for (let i = 0; i <= 40; i++) { const px = -w / 2 + 12 * s + i * (w - 24 * s) / 40, py = Math.sin(i * 0.45 + t * 2) * Math.sin(i * 0.12) * h * 0.28; i ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke(); }
      g.restore();
    }
    function frame(ms) {
      const t = ms / 1000;
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.32;
      // orbit arcs with square nodes (echo of the channel banner)
      for (let i = 0; i < 3; i++) {
        const rad = R * (1.12 + i * 0.16), rot = t * (0.06 + i * 0.035) * (i % 2 ? -1 : 1) + i;
        g.strokeStyle = `rgba(217,119,87,${0.45 - i * 0.12})`; g.lineWidth = 1.4;
        g.beginPath(); g.arc(cx, cy, rad, rot, rot + Math.PI * 1.25); g.stroke();
        g.fillStyle = '#141413';
        [rot, rot + Math.PI * 1.25].forEach((a) => g.fillRect(cx + Math.cos(a) * rad - 4, cy + Math.sin(a) * rad - 4, 8, 8));
      }
      // rotating network (the "AI")
      const ay = t * 0.16, ax = 0.42, ca = Math.cos(ay), sa = Math.sin(ay), cb = Math.cos(ax), sb = Math.sin(ax);
      const P = nodes.map((n) => {
        const x = n.x * ca + n.z * sa, z1 = -n.x * sa + n.z * ca, y = n.y * cb - z1 * sb, z = n.y * sb + z1 * cb;
        const k = 2.6 / (2.6 + z); return { x: cx + x * R * k, y: cy + y * R * k, z };
      });
      edges.forEach(([i, j]) => {
        const a = P[i], b = P[j], d = (a.z + b.z) / 2;
        g.strokeStyle = `rgba(20,20,19,${0.04 + 0.12 * (1 - (d + 1) / 2)})`; g.lineWidth = 1;
        g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
      });
      P.forEach((p) => { const k = 1 - (p.z + 1) / 2; g.fillStyle = `rgba(217,119,87,${0.3 + 0.6 * k})`; g.beginPath(); g.arc(p.x, p.y, 1.4 + 2 * k, 0, 7); g.fill(); });
      pulses.forEach((pu) => {
        pu.p += pu.v / 60; if (pu.p > 1) { pu.p = 0; pu.e = Math.floor(r() * edges.length); }
        const [i, j] = edges[pu.e], a = P[i], b = P[j];
        const x = a.x + (b.x - a.x) * pu.p, y = a.y + (b.y - a.y) * pu.p;
        g.save(); g.shadowColor = 'rgba(217,119,87,0.8)'; g.shadowBlur = 10; g.fillStyle = '#C15F3C'; g.beginPath(); g.arc(x, y, 2.4, 0, 7); g.fill(); g.restore();
      });
      // creations orbiting around the mark; back ones first
      const orb = cards.map((c) => { const a = t * 0.32 + c.ph; return { c, x: cx + Math.cos(a) * R * 1.12, y: cy + Math.sin(a) * R * 0.5 + R * 0.08, z: Math.sin(a) }; });
      const scale = Math.min(W, H) / 460;
      orb.filter((o) => o.z < 0).forEach((o) => drawCard(o.c, o.x, o.y, scale * (0.8 + 0.12 * o.z), 0.55, t));
      // centre mark
      if (logo.complete && logo.naturalWidth) {
        const s = R * 0.72 * (1 + 0.015 * Math.sin(t * 1.4)), w = s * logo.naturalWidth / logo.naturalHeight;
        g.save(); g.shadowColor = 'rgba(217,119,87,0.35)'; g.shadowBlur = 30; g.drawImage(logo, cx - w / 2, cy - s / 2, w, s); g.restore();
      }
      orb.filter((o) => o.z >= 0).forEach((o) => drawCard(o.c, o.x, o.y, scale * (0.92 + 0.12 * o.z), 1, t));
    }
    function loop(ms) { frame(ms); raf = requestAnimationFrame(loop); }
    function update() {
      const should = visible && !document.hidden && !reduceMotion.matches;
      if (should && !running) { running = true; raf = requestAnimationFrame(loop); }
      if (!should && running) { running = false; cancelAnimationFrame(raf); }
      if (!should) frame(2400); // static frame for reduced motion / hidden
    }
    size();
    new ResizeObserver(() => { size(); if (!running) frame(2400); }).observe(cv);
    if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => { visible = en.isIntersecting; update(); }).observe(cv);
    document.addEventListener('visibilitychange', update);
    reduceMotion.addEventListener?.('change', update);
    logo.onload = () => { if (!running) frame(2400); };
    update();
  }

  // ---------------------------------------------------------------- boot
  initShell();
  if (PAGE === 'home') initHome();
  else if (PAGE === 'project') initProject();
})();
