/* Reads the content from Sanity (the dashboard) and puts it in the shape the site already uses, then starts the site
   (loader.js and app.js). Everything the dashboard can change is applied here, before the site starts, so the
   loading curtain hides the swap. If Sanity cannot be reached, the site still opens (with empty parts hidden). */
(() => {
  const VER = '20261101b';
  const CFG = window.SANITY || {};
  const load = src => new Promise(res => {
    const s = document.createElement('script'); s.src = src + '?v=' + VER; s.async = false; s.onload = s.onerror = res; document.body.append(s);
  });
  const start = () => load('loader.js').then(() => load('app.js'));
  if (!CFG.projectId) { start(); return; }

  const dims = '{"url":url,"w":metadata.dimensions.width,"h":metadata.dimensions.height}';
  const QUERY = `{
    "settings": *[_id=="siteSettings"][0]{
      siteName,pageTitle,pageDescription,loadingText,defaultTheme,hideThemeSwitch,accentDark,accentLight,
      heroLine1,heroLine2,heroTagline,heroImageAlt,subjects,places,aboutHeading,aboutText,
      hiddenSections,navAbout,navPhotography,navVideos,navWriting,navContact,helloLabel,labelSubjects,labelPortfolio,
      email,formEndpoint,instagramUrl,youtubeUrl,otherLinks[]{label,url},
      contactTitle,contactIntro,contactTopics,thanksTitle,thanksText,ctaLine,ctaBold,
      footerLegal,footerCredit,hideFooterCredit,footerExtra,privacyLabel,contactNote,
      musicEnabled,musicVolume,"musicUrl":musicFile.asset->url,
      "hero":heroImage.asset->${dims},"ctaDark":ctaImageDark.asset->url,"ctaLight":ctaImageLight.asset->url
    },
    "projects": *[_type=="project" && !(hidden==true) && defined(cover.asset)] | order(date desc, _createdAt desc){_id,title,subtitle,date,blurb,"cover":cover.asset->${dims},"photos":photos[defined(image.asset)]{caption,"a":image.asset->${dims}}},
    "videos": *[_type=="video" && !(hidden==true) && defined(youtubeUrl)] | order(coalesce(date,"0000") desc, _createdAt desc){_id,title,youtubeUrl},
    "writings": *[_type=="writing" && !(hidden==true)] | order(date desc){_id,title,date,tag,excerpt,"cover":cover{"url":asset->url,caption},body[]{..., _type=="image" => {"url":asset->url}}}
  }`;
  const host = CFG.apiHost || `https://${CFG.projectId}.apicdn.sanity.io`;      // apiHost is only for local tests
  const url = `${host}/v2025-01-01/data/query/${CFG.dataset || 'production'}?query=${encodeURIComponent(QUERY)}`;

  const pad = n => String(n).padStart(2, '0');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const lines = s => esc(s).replace(/\r?\n/g, '<br>');                 // new lines typed in the dashboard become line breaks
  const one = s => String(s || '').replace(/\s+/g, ' ').trim();
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const man = window.MAN = window.MAN || {};
  const has = v => v != null && String(v).trim() !== '';

  function projects(list) {
    return list.filter(p => p.cover && p.cover.url && p.photos && p.photos.length).map((p, i) => {
      man[p.cover.url] = [p.cover.w, p.cover.h];
      const items = p.photos.filter(x => x.a && x.a.url).map(x => { man[x.a.url] = [x.a.w, x.a.h]; return { t: 'img', src: x.a.url, cap: x.caption || '' }; });
      const ar = p.cover.w / p.cover.h, dow = ['cascade', 'river', 'zigzag'][i % 3];
      return {
        id: p._id, n: pad(i + 1), title: p.title || 'Untitled', sub: p.subtitle || '', year: p.date ? p.date.slice(0, 4) : '', layout: dow,
        flow: { ar: ar.toFixed(2).replace(/\.?0+$/, ''), sh: '62%', step: .72, rot: 20, depth: 170 },
        cover: p.cover.url, card: [],
        blurb: p.blurb || `${p.title}${p.subtitle ? ', ' + p.subtitle : ''}. ${items.length} photograph${items.length === 1 ? '' : 's'}.`,
        items,
      };
    });
  }

  const ytId = u => { const m = String(u || '').match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([\w-]{11})/); return m ? m[1] : null; };
  function videos(list) {
    return list.map(v => ({ id: ytId(v.youtubeUrl), title: v.title || 'Video' })).filter(v => v.id).map(v => ({ ...v, frames: [`https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`] }));
  }

  // Sanity's text editor (Portable Text) becomes the small markdown the Writing section already reads.
  function marked(span) {
    const t = span.text || '', m = span.marks || [];
    if (!t.trim()) return t;
    return t.replace(/^(\s*)([\s\S]*?)(\s*)$/, (_, a, b, c) => a + (m.includes('em') ? '*' : '') + (m.includes('strong') ? '**' : '') + b + (m.includes('strong') ? '**' : '') + (m.includes('em') ? '*' : '') + c);
  }
  function writings(list) {
    return list.map(w => {
      const body = (w.body || []).map(b => {
        if (b._type === 'image') return b.url ? `![${one(b.caption)}](${b.url})` : '';
        if (b._type !== 'block') return '';
        const text = (b.children || []).map(marked).join('').trim();
        if (!text) return '';
        if (b.style === 'blockquote') return text.split(/\n+/).map(l => '> ' + l).join('\n');
        if (/^h\d$/.test(b.style || '')) return '## ' + one(text);
        return text.replace(/\s*\n+\s*/g, ' ');
      }).filter(Boolean).join('\n\n');
      const head = ['---', 'title: ' + one(w.title), 'date: ' + (w.date || ''), 'tag: ' + one(w.tag), w.excerpt ? 'excerpt: ' + one(w.excerpt) : null, w.cover && w.cover.url ? 'cover: ' + w.cover.url : null, w.cover && w.cover.url && w.cover.caption ? 'coverCaption: ' + one(w.cover.caption) : null, '---', ''].filter(x => x !== null).join('\n');
      return { slug: w._id, text: head + body };
    });
  }

  /* ---------------------------------------------------------------- texts, links, sections, look */
  const setText = (sel, v) => { const el = $(sel); if (el && has(v)) el.textContent = one(v); };
  const setLines = (sel, v) => { const el = $(sel); if (el && has(v)) el.innerHTML = lines(v); };
  const img = (u, w, q) => u + `?w=${w}&q=${q}&fit=max&auto=format`;

  function mix(hex, to, t) {                                                   // mixes a #rrggbb colour with white or black
    const n = h => { h = h.replace('#', ''); if (h.length === 3) h = h.replace(/./g, c => c + c); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
    const a = n(hex), b = n(to);
    return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0')).join('');
  }
  function accent(s) {
    let css = '';
    if (s.accentDark) css += `html[data-theme="dark"]{--teal:${s.accentDark};--teal-d:${mix(s.accentDark, '#000000', .25)}}`;
    if (s.accentLight) css += `html[data-theme="light"]{--teal:${s.accentLight};--teal-d:${mix(s.accentLight, '#000000', .22)};--teal-m:${mix(s.accentLight, '#ffffff', .2)};--teal-l:${mix(s.accentLight, '#ffffff', .55)}}`;
    if (css) document.head.append(Object.assign(document.createElement('style'), { id: 'accent', textContent: css }));
  }
  function theme(s) {
    if (s.hideThemeSwitch) document.head.append(Object.assign(document.createElement('style'), { textContent: '.thm{display:none!important}' }));
    let stored = null; try { stored = localStorage.getItem('mattTheme'); } catch (e) {}
    if (s.defaultTheme === 'light' && !stored && !/[?&]theme=/.test(location.search)) {      // a visitor's own choice always wins
      document.documentElement.dataset.theme = 'light';
      const link = $('#theme'); if (link) link.href = 'light.css?v=' + VER;
      const tc = $('meta[name="theme-color"]'); if (tc) tc.content = '#e8ecea';
    }
  }

  const NAV = { about: '#about', photography: '#portfolio', videos: '#film', writing: '#writing' };
  const NAVBOX = '.top nav, #menu nav, .fcols nav';
  function navLabel(href, text) {
    if (!has(text)) return;
    $$(NAVBOX).forEach(box => $$(`a[href="${href}"]:not([data-contact])`, box).forEach(a => {
      const sm = a.querySelector('small'); if (sm) a.lastChild.textContent = one(text); else a.textContent = one(text);
    }));
  }
  function hideSection(key) {
    $$(`[data-sec="${key}"]`).forEach(e => { e.style.display = 'none'; });
    if (NAV[key]) $$(NAVBOX).forEach(box => $$(`a[href="${NAV[key]}"]`, box).forEach(a => a.remove()));
    if (key === 'about') { const d = $('.sdown'); if (d) d.setAttribute('href', '#portfolio'); }
  }

  function links(s) {                                                          // Instagram, YouTube and any extra link, in the menu and the footer
    const list = [];
    if (s.instagramUrl) list.push(['Instagram', s.instagramUrl]);
    if (s.youtubeUrl) list.push(['YouTube', s.youtubeUrl]);
    (s.otherLinks || []).forEach(l => { if (l && l.label && l.url) list.push([l.label, l.url]); });
    if (!list.length) return;
    const a = list.map(([t, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a>`).join('');
    const mf = $('.mfoot'); if (mf) mf.innerHTML = a;
    const r = $('.fcols .r'); if (r) r.innerHTML = `<span class="k">Socials</span>${a}<a href="#contact" data-contact>Email</a>`;
  }

  function contact(s) {
    setLines('#ctitle', s.contactTitle);
    setText('#cintro', s.contactIntro);
    if (Array.isArray(s.contactTopics) && s.contactTopics.length) {
      const box = $('#cchips');
      if (box) box.innerHTML = s.contactTopics.map(one).filter(Boolean).map(t => `<button type="button" class="chip" data-v="${esc(t)}">${esc(t)}</button>`).join('');
    } else if (Array.isArray(s.contactTopics)) { const f = $('.chipsf'); if (f) f.style.display = 'none'; }
    setText('#cthx', s.thanksTitle);
    setText('#cthxt', s.thanksText);
    window.CONTACT = { endpoint: s.formEndpoint || '', email: s.email || '' };
  }

  function texts(s, P) {
    if (!s) return;
    // name and page
    if (has(s.siteName)) { setText('#lname', s.siteName); $$('.logo, .flogo').forEach(a => a.setAttribute('aria-label', one(s.siteName))); }
    const title = one(s.pageTitle) || one(s.siteName); if (title) document.title = title;
    if (has(s.pageDescription)) { const m = $('meta[name="description"]'); if (m) m.content = one(s.pageDescription); }
    setText('#lnote', s.loadingText);
    // home
    if (has(s.heroLine1)) setText('#name .ln:first-child span', s.heroLine1);
    if (has(s.heroLine2)) setText('#nameFit', s.heroLine2);
    setLines('.hero-foot p', s.heroTagline);
    const hi = $('#heroImg');
    if (hi) {
      hi.alt = one(s.heroImageAlt) || one(s.siteName) || 'Photograph';
      const src = s.hero && s.hero.url ? img(s.hero.url, 3200, 88) : (P[0] ? img(P[0].cover, 2400, 86) : '');
      if (src) hi.src = src;
    }
    // about
    setLines('.big', s.aboutHeading);
    if (has(s.aboutText) && $('#para')) $('#para').textContent = s.aboutText.replace(/\s+/g, ' ').trim();
    // places and the moving words
    if (s.places && s.places.length && $('.pg')) $('.pg').innerHTML = s.places.map(x => `<span>${esc(x)}</span>`).join('');
    if (s.subjects && s.subjects.length) subjects(s.subjects.map(one).filter(Boolean));
    // menu and section names
    navLabel('#about', s.navAbout); navLabel('#portfolio', s.navPhotography); navLabel('#film', s.navVideos); navLabel('#writing', s.navWriting); navLabel('#contact', s.navContact);
    setText('#hello', s.helloLabel);
    setText('#labAbout', s.navAbout); setText('#labVideos', s.navVideos); setText('#labWriting', s.navWriting);
    setText('#labSubjects', s.labelSubjects); setText('#labPortfolio', s.labelPortfolio);
    links(s); contact(s);
    // the big photo at the bottom
    if (has(s.ctaLine) || has(s.ctaBold)) { const c = $('#ctaCap'); if (c) c.innerHTML = `${esc(one(s.ctaLine) || 'A road, a place, a story.')}<b>${esc(one(s.ctaBold) || 'Pull over, say hello.')}</b>`; }
    const dark = s.ctaDark ? img(s.ctaDark, 1600, 84) : (P[0] ? img(P[0].items[Math.min(2, P[0].items.length - 1)].src, 1600, 84) : '');
    const light = s.ctaLight ? img(s.ctaLight, 1600, 84) : (s.ctaDark ? dark : (P[1] ? img(P[1].items[0].src, 1600, 84) : dark));
    if (dark && $('.ph-dark')) $('.ph-dark').src = dark;
    if (light && $('.ph-light')) $('.ph-light').src = light;
    // footer
    setText('#lgLegal', s.footerLegal); setText('#lgExtra', s.footerExtra);
    setText('#lgPrivacy', s.privacyLabel); setText('#cnoteLink', s.privacyLabel); setText('#cnoteText', s.contactNote);
    if (s.hideFooterCredit) { const c = $('#lgCredit'); if (c) c.remove(); } else setText('#lgCredit', s.footerCredit);
    // look and music
    accent(s); theme(s);
    const vol = Math.min(100, Math.max(1, Number(s.musicVolume) || 17)) / 100;
    window.SITE_MUSIC = s.musicEnabled !== false && s.musicUrl ? { src: s.musicUrl, vol } : null;
  }

  function subjects(list) {                                                  // the moving words: up to four rows, each one a loop of two identical halves
    const rows = $$('.mq .row'); if (!rows.length) return;
    const n = Math.min(rows.length, list.length), sep = ' &nbsp;&ndash;&nbsp; ', speed = [140, 130, 160, 124];
    rows.forEach((row, r) => {
      if (r >= n) { row.remove(); return; }
      let part = list.slice(Math.floor(r * list.length / n), Math.floor((r + 1) * list.length / n));
      let half = part.slice(); while (half.join('').length < 70) half = half.concat(part);
      const html = half.map(esc).join(sep) + sep;
      row.querySelector('.trk').innerHTML = html + html;
      row.querySelector('.trk').style.setProperty('--s', speed[r % 4] + 's');
      row.className = 'row ' + (r === (n > 1 ? 1 : 0) ? 'on' : 'dim');
    });
  }

  function sections(s, P, V, W) {
    const off = new Set((s && s.hiddenSections) || []);
    if (!P.length) off.add('photography');
    if (!V.length) off.add('videos');
    if (!W.length) off.add('writing');
    if (!(s && s.places && s.places.length)) off.add('places');
    if (!(s && s.subjects && s.subjects.length)) off.add('subjects');
    off.forEach(hideSection);
    $$('#menu nav a small').forEach((sm, i) => { sm.textContent = pad(i + 1); });         // the numbers in the phone menu follow what is left
  }

  const EMPTY = [{ id: 'none', n: '01', title: '', sub: '', year: '', layout: 'cascade', flow: {}, cover: '', card: [], blurb: '', items: [] }];   // the carousel code needs one card, even when there is none (its section is hidden)
  const notice = msg => {
    const d = document.createElement('div');
    d.style.cssText = 'position:fixed;left:0;right:0;top:0;z-index:900;padding:10px 16px;background:#c4907c;color:#111;font:500 13px/1.3 sans-serif;text-align:center';
    d.textContent = msg; document.body.append(d);
  };

  const ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), 8000);
  fetch(url, { signal: ctrl.signal })
    .then(r => r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status)))
    .then(({ result: R }) => {
      const P = projects(R.projects || []);
      const W = writings(R.writings || []);
      const V = videos(R.videos || []);
      window.PROJECTS = P.length ? P : EMPTY;
      window.VIDEOS = V;
      window.CMS_WRITINGS = W;
      window.CMS_ON = true;
      texts(R.settings, P);
      sections(R.settings, P, V, W);
    })
    .catch(e => { console.warn('Sanity could not be reached.', e); window.PROJECTS = EMPTY; notice('The content could not be loaded. Please refresh the page.'); })
    .then(() => { clearTimeout(timer); return start(); });
})();
