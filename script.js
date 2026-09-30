/* ==========================================================================
   Deergaam — site script
   Renders everything from data/content.js. No backend, no build step.
   Home: the list of videos. project.html?id=…: one video with its
   YouTube link, step-by-step notes, prompt, and tools & files.
   ========================================================================== */
(() => {
  'use strict';

  const DATA = window.DEERGAAM_CONTENT || {};
  const VIDEOS = (DATA.videos || DATA.projects || []).filter((v) => v && v.id && v.title);
  const PAGE = document.body.dataset.page;

  // ---------------------------------------------------------------- helpers
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const safeUrl = (u) => (/^\s*(javascript|data|vbscript):/i.test(String(u || '')) ? '#' : String(u || '').trim());
  const isExternal = (u) => /^https?:\/\//i.test(u) && !u.startsWith(location.origin);
  const videoUrl = (v) => `project.html?id=${encodeURIComponent(v.id)}`;

  const ICON = {
    copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" aria-hidden="true" class="yt"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8z"/><path d="M9.8 15.1V8.9l5.4 3.1z" fill="#fff"/></svg>',
    prompt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 17l6-5-6-5"/><path d="M12 19h8"/></svg>',
    tool: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3.5-3.5 8-8"/><path d="M14.7 6.3 13 4.6a2 2 0 0 0-2.8 0L3.5 11.3a2 2 0 0 0 0 2.8l1.7 1.7"/></svg>',
    file: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M12 11v6"/><path d="m9 14 3 3 3-3"/></svg>',
    image: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/></svg>',
    link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a5 5 0 0 0 7.1 0l3-3a5 5 0 0 0-7.1-7.1l-1 1"/><path d="M14 10a5 5 0 0 0-7.1 0l-3 3a5 5 0 0 0 7.1 7.1l1-1"/></svg>',
    download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/></svg>',
    external: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>',
  };

  function promptsOf(v) {
    const list = Array.isArray(v.prompts) ? v.prompts : (v.prompt ? [v.prompt] : []);
    return list.map((p) => (typeof p === 'string' ? { text: p } : p)).filter((p) => p && p.text);
  }

  // ---------------------------------------------------------------- resources (tools, files, images, links)
  const RES_TYPES = { tool: 'Tool', file: 'File', image: 'Image', link: 'Link' };
  function resourcesOf(v) {
    return (Array.isArray(v.resources) ? v.resources : [])
      .filter((r) => r && r.url && r.title)
      .map((r) => ({ ...r, type: RES_TYPES[r.type] ? r.type : 'link', url: safeUrl(r.url) }));
  }
  function resourceHTML(r) {
    const ext = isExternal(r.url);
    const dl = (r.type === 'file' || r.type === 'image') && !ext;
    const attrs = ext ? 'target="_blank" rel="noopener noreferrer"' : (dl ? 'download' : '');
    const icon = r.type === 'image' ? `<img src="${esc(r.url)}" alt="" loading="lazy" decoding="async">` : ICON[r.type];
    return `<li class="resource">
      <span class="resource-icon">${icon}</span>
      <div class="resource-main">
        <span class="resource-type">${RES_TYPES[r.type]}</span>
        <a class="resource-title" href="${esc(r.url)}" ${attrs}>${esc(r.title)}${ext ? '<span class="sr-only"> (opens in a new tab)</span>' : ''}</a>
        ${r.description ? `<p class="resource-desc">${esc(r.description)}</p>` : ''}
      </div>
      ${(dl ? ICON.download : ICON.external).replace('<svg ', '<svg class="resource-go" ')}
    </li>`;
  }

  // ---------------------------------------------------------------- thumbnail + video
  const thumbHTML = (v, eager) => (v.thumbnail
    ? `<img src="${esc(v.thumbnail)}" alt="" ${eager ? '' : 'loading="lazy"'} decoding="async">`
    : '<div class="thumb-fallback"><img src="assets/brand/logo-mark-orange-large.png" alt=""></div>');

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
  const ytLink = (v) => safeUrl(v.youtubeUrl || v.videoUrl || '');
  function playerHTML(v) {
    const yt = youtubeId(ytLink(v));
    if (!yt) return `<div class="video">${thumbHTML(v, true)}</div>`;
    return `<div class="video">${v.thumbnail ? thumbHTML(v, true) : `<img src="https://i.ytimg.com/vi/${esc(yt)}/hqdefault.jpg" alt="" decoding="async">`}
      <button class="video-facade" type="button" data-yt="${esc(yt)}" data-title="${esc(v.title)}" aria-label="Play video: ${esc(v.title)}">
        <span class="play-btn">${ICON.play}</span>
      </button></div>`;
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
  function youtubeButton(v) {
    const url = ytLink(v);
    return url
      ? `<a class="btn btn-youtube" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${ICON.youtube}<span>Watch on YouTube</span></a>`
      : `<span class="btn btn-youtube is-soon">${ICON.youtube}<span>YouTube link coming soon</span></span>`;
  }

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

  // ---------------------------------------------------------------- shell: header + footer
  function initShell() {
    const header = $('[data-header]');
    const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

    const socials = (DATA.social || []).filter((s) => s && s.url && String(s.url).trim());
    const channel = socials.find((s) => /youtube/i.test(s.label));
    const action = $('[data-header-action]');
    if (action && channel) action.innerHTML = `<a class="btn btn-ghost btn-sm" href="${esc(safeUrl(channel.url))}" target="_blank" rel="noopener noreferrer">${ICON.youtube}<span>YouTube channel</span></a>`;

    const footer = $('[data-footer]');
    if (footer) {
      footer.innerHTML = `<div class="container footer-inner">
        <a class="brand" href="./" aria-label="Deergaam — home"><img src="assets/brand/logo-mark-orange.png" alt="" width="22" height="24"><span class="brand-word">Deergaam</span></a>
        ${socials.length ? `<ul class="footer-social">${socials.map((s) =>
          `<li><a href="${esc(safeUrl(s.url))}" target="_blank" rel="noopener noreferrer">${esc(s.label)}<span class="sr-only"> (opens in a new tab)</span></a></li>`).join('')}</ul>` : ''}
        <span class="footer-copy">© ${new Date().getFullYear()} Deergaam</span>
      </div>`;
    }
  }

  // ---------------------------------------------------------------- home: list of videos
  function initHome() {
    const list = $('[data-video-list]');
    list.innerHTML = VIDEOS.length ? VIDEOS.map((v) => {
      const inside = [];
      if ((v.steps || []).length) inside.push([ICON.check, 'Step-by-step notes']);
      if (promptsOf(v).length) inside.push([ICON.prompt, promptsOf(v).length > 1 ? 'Prompts' : 'The prompt']);
      if (resourcesOf(v).length) inside.push([ICON.tool, 'Tools & files']);
      return `<article class="video-card">
        <div class="video-card-thumb">${thumbHTML(v, true)}<span class="play-btn" aria-hidden="true">${ICON.play}</span></div>
        <div class="video-card-body">
          <h2 class="video-card-title"><a href="${videoUrl(v)}">${esc(v.title)}</a></h2>
          <p class="video-card-desc">${esc(v.description)}</p>
          ${inside.length ? `<ul class="card-includes" aria-label="Inside">${inside.map(([i, l]) => `<li>${i}${esc(l)}</li>`).join('')}</ul>` : ''}
          <span class="btn btn-primary video-card-cta" aria-hidden="true">Open the video page <span class="arrow">→</span></span>
        </div>
      </article>`;
    }).join('') : '<p class="empty">The first video is on its way.</p>';
  }

  // ---------------------------------------------------------------- video page
  function initProject() {
    const root = $('[data-project-root]');
    const id = new URLSearchParams(location.search).get('id');
    const v = VIDEOS.find((x) => x.id === id) || (!id && VIDEOS[0]);
    if (!v) {
      document.title = 'Video not found — Deergaam';
      root.innerHTML = `<div class="notfound" style="min-height:50vh">
        <p class="eyebrow">Not found</p><h1 class="section-title">We couldn’t find that video.</h1>
        <p class="section-intro">It may have been renamed or removed.</p>
        <a class="btn btn-primary" href="./">Back to Deergaam</a></div>`;
      return;
    }
    document.title = `${v.title} — Deergaam`;
    const md = $('meta[name="description"]'); if (md) md.setAttribute('content', v.description || '');

    const steps = (v.steps || []).filter(Boolean).map((s) => (typeof s === 'string' ? { title: s } : s));
    const prompts = promptsOf(v);
    const res = resourcesOf(v);
    const toc = [steps.length && ['steps', 'Step by step'], prompts.length && ['prompt', prompts.length > 1 ? 'Prompts' : 'The prompt'], res.length && ['tools', 'Tools & files']].filter(Boolean);

    root.innerHTML = `
      ${VIDEOS.length > 1 ? '<a class="back-link" href="./">← All videos</a>' : ''}
      <header class="project-head">
        <h1>${esc(v.title)}</h1>
        <p>${esc(v.description)}</p>
        <div class="project-actions">${youtubeButton(v)}</div>
      </header>
      <div class="project-video">${playerHTML(v)}</div>
      ${toc.length > 1 ? `<nav class="toc" aria-label="On this page">${toc.map(([h, l]) => `<a href="#${h}">${l}</a>`).join('')}</nav>` : ''}

      ${steps.length ? `<section class="project-block" id="steps" aria-labelledby="steps-heading">
        <h2 id="steps-heading">Step by step</h2>
        <ol class="steps">${steps.map((s) => `<li class="step"><div>
          <h3>${esc(s.title)}</h3>${s.text ? `<p>${esc(s.text)}</p>` : ''}
        </div></li>`).join('')}</ol>
      </section>` : ''}

      ${prompts.length ? `<section class="project-block" id="prompt" aria-labelledby="prompt-heading">
        <h2 id="prompt-heading">${prompts.length > 1 ? 'The prompts' : 'The prompt'}</h2>
        ${prompts.map((p, i) => `<article class="prompt-card">
          ${p.title ? `<h3 class="prompt-title">${esc(p.title)}</h3>` : ''}
          ${p.description ? `<p class="prompt-desc">${esc(p.description)}</p>` : ''}
          <div class="prompt-body"><pre>${esc(p.text)}</pre></div>
          <div class="prompt-actions">
            <button class="btn btn-primary btn-sm" type="button" data-copy="${i}">${ICON.copy}<span>Copy prompt</span></button>
          </div>
        </article>`).join('')}
      </section>` : ''}

      ${res.length ? `<section class="project-block" id="tools" aria-labelledby="tools-heading">
        <h2 id="tools-heading">Tools &amp; files</h2>
        <ul class="resource-list">${res.map(resourceHTML).join('')}</ul>
      </section>` : ''}`;

    root.addEventListener('click', async (e) => {
      const btn = e.target.closest('[data-copy]');
      if (!btn) return;
      const label = $('span', btn);
      if (await copyText(prompts[Number(btn.dataset.copy)].text)) {
        btn.classList.add('is-copied'); btn.querySelector('svg').outerHTML = ICON.check; label.textContent = 'Copied!';
        toast('Prompt copied. Paste it into your AI tool.');
        clearTimeout(btn._t);
        btn._t = setTimeout(() => { btn.classList.remove('is-copied'); btn.querySelector('svg').outerHTML = ICON.copy; label.textContent = 'Copy prompt'; }, 2200);
      } else {
        // select the text so the visitor can copy it manually
        const pre = $('pre', btn.closest('.prompt-card'));
        const range = document.createRange(); range.selectNodeContents(pre); const s = getSelection(); s.removeAllRanges(); s.addRange(range);
        toast('Copy blocked by the browser. The prompt is selected: press Ctrl+C (⌘C on Mac).');
      }
    });
  }

  // ---------------------------------------------------------------- boot
  initShell();
  if (PAGE === 'home') initHome();
  else if (PAGE === 'project') initProject();
})();
