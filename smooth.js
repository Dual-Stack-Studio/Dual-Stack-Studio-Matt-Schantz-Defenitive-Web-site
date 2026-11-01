/* Photos arrive softly: while a photo downloads, its frame shows the photo's average colour (and, for the big ones, a tiny blurred
   preview that Sanity makes for it), then the sharp photo fades in. Photos that are already in the browser cache show at once. */
(() => {
  const SEL = '.hero-photo img, .slide img, .m img, .rimg img';
  const LQ = window.LQ = window.LQ || {};                           // photo address (without ?...) -> { c: colour, l: tiny blurred preview }
  const key = u => String(u || '').split('?')[0];
  function prep(img) {
    img.classList.remove('fx', 'in');
    const src = img.getAttribute('src');
    if (!src) return;
    const d = LQ[key(src)], p = img.parentElement;
    if (d && p) {
      if (d.c) p.style.backgroundColor = d.c;
      if (d.l) { p.style.backgroundImage = `url(${d.l})`; p.style.backgroundSize = 'cover'; p.style.backgroundPosition = 'center'; }
    }
    if (img.complete && img.naturalWidth) return;                    // already here: no fade
    img.classList.add('fx');
    const done = () => requestAnimationFrame(() => img.classList.add('in'));
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
    setTimeout(done, 15000);                                        // never leave a photo invisible
  }
  const scan = n => {
    if (n.nodeType !== 1) return;
    if (n.matches(SEL)) prep(n);
    n.querySelectorAll(SEL).forEach(prep);
  };
  new MutationObserver(ms => ms.forEach(m => {
    if (m.type === 'attributes') { if (m.target.matches(SEL)) prep(m.target); }
    else m.addedNodes.forEach(scan);
  })).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
  scan(document.documentElement);
})();
