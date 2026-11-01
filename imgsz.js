/* One place that decides which size of a photo to ask Sanity for, so the loader, the carousel, the mosaic and the lightbox all ask for
   exactly the same address (the browser then downloads each photo once). The size follows the screen: the photo is never smaller than
   what the screen can show (viewport width x pixel density), and never larger than the original (fit=max). Same quality, fewer wasted bytes. */
(() => {
  const DPR = Math.min(window.devicePixelRatio || 1, 2.5);
  const STEPS = [640, 960, 1280, 1600, 1920, 2560, 3200, 3840];       // few distinct sizes, so the CDN has each one ready for the next visitor
  const snap = px => STEPS.find(s => s >= px) || STEPS[STEPS.length - 1];
  const VW = () => document.documentElement.clientWidth || window.innerWidth;
  const VH = () => document.documentElement.clientHeight || window.innerHeight;
  const q = (w, quality) => `?w=${w}&q=${quality}&fit=max&auto=format`;
  window.IMGSZ = {
    snap,
    hero: u => u + q(snap(Math.max(1280, Math.min(3200, VW() * DPR))), 88),                          // the big portrait under the name
    mid: u => u + q(snap(Math.max(960, Math.min(1920, VW() * DPR * (VW() < 700 ? 1 : .62)))), 84),    // carousel cards and mosaic tiles
    full: u => u + q(snap(Math.min(3840, Math.max(VW(), VH()) * DPR)), 90),                          // lightbox and project header: as sharp as the screen can show
    thumb: u => u + q(640, 74),
  };
})();
