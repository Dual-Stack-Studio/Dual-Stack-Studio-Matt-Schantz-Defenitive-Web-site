/* The line under the name, letter by letter: a letter that sits on the photo stays light, a letter that sits outside it (on the pale page of the
   light look) turns dark, with a soft colour transition. It is re-checked when the window changes size and while the page scrolls (the photo drifts).
   The dark look needs nothing: its page is dark everywhere, so the letters simply stay light (the colours live in light.css). */
(() => {
  const p = document.querySelector('.hero-foot p'), ph = document.querySelector('.hero-photo');
  if (!p || !ph || p.dataset.ink) return;
  p.dataset.ink = '1';

  // words stay whole for line breaking; each letter gets its own span
  (function split(node) {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(part); return; }
          const w = document.createElement('span'); w.className = 'w';
          [...part].forEach(ch => { const c = document.createElement('span'); c.className = 'c'; c.textContent = ch; w.append(c); });
          frag.append(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') split(n);
    });
  })(p);

  const chars = [...p.querySelectorAll('.c')];
  let raf = 0;
  function paint() {
    raf = 0;
    const r = ph.getBoundingClientRect();
    chars.forEach(c => {
      const b = c.getBoundingClientRect(), x = b.left + b.width / 2, y = b.top + b.height / 2;
      c.classList.toggle('on', x > r.left && x < r.right && y > r.top && y < r.bottom);
    });
  }
  const queue = () => { if (!raf) raf = requestAnimationFrame(paint); };

  paint();
  p.classList.add('ink');                                                      // the first colours are set before any transition exists
  requestAnimationFrame(() => requestAnimationFrame(() => p.classList.add('live')));

  addEventListener('resize', queue);
  addEventListener('scroll', () => { if ((window.scrollY || 0) < innerHeight * 1.6) queue(); }, { passive: true });
  if (window.ResizeObserver) { const ro = new ResizeObserver(queue); ro.observe(ph); ro.observe(p); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(queue);
  let n = 0; const warm = () => { queue(); if (++n < 14) setTimeout(warm, 250); }; warm();      // the photo settles for a moment while the page opens
})();
