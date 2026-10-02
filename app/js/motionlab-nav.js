/* ═══════════════════════════════════════════
   MOTION LAB — nav button (/motionlab/)
   The Motion Lab wordmark drawn on a canvas. On a theme
   toggle the old colour breaks into pixels and the new one
   reassembles a beat after the rest of the page (port of
   wordmark() from the Motion Lab repo, brandkit.js).
   Light theme → black logo, dark theme → white logo.
   ═══════════════════════════════════════════ */

const SRC = { light: 'assets/brand/moyon-negro.png', dark: 'assets/brand/moyon-blanco.png' };
const COLOR = { light: '#0a0a0a', dark: '#f4f2ec' };

const loadImg = (src) => new Promise((res) => {
  const im = new Image();
  im.onload = () => res(im);
  im.onerror = () => res(null);
  im.src = src;
});
const reduced = () => !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mode = () => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

// tiny seeded PRNG so the particle layout is stable between resizes
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function wordmark(canvas) {
  const imgs = { light: null, dark: null };
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  let cells = null, cellW = 0, cur = mode(), anim = null;

  const size = () => {
    const r = canvas.getBoundingClientRect();
    const W = Math.max(1, Math.round(r.width * dpr)), H = Math.max(1, Math.round(r.height * dpr));
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; cells = null; }
    return [W, H];
  };

  // sample the logo's alpha on a grid: one brand "pixel" = 1 CSS px at this tiny size
  const buildCells = () => {
    const [W, H] = size();
    const im = imgs.light; if (!im) return;
    const off = document.createElement('canvas'); off.width = W; off.height = H;
    const o = off.getContext('2d'); o.drawImage(im, 0, 0, W, H);
    const d = o.getImageData(0, 0, W, H).data;
    cellW = Math.max(1, Math.round(dpr));
    const R = rng(21);
    cells = [];
    for (let y = 0; y < H; y += cellW) for (let x = 0; x < W; x += cellW) {
      const a = d[((y + (cellW >> 1)) * W + Math.min(W - 1, x + (cellW >> 1))) * 4 + 3];
      if (a > 110) cells.push({ x, y, a: R() * Math.PI * 2, s: 0.4 + R() * 0.9, d: R() * 0.3 });
    }
  };

  const drawCrisp = (m) => {
    const [W, H] = size(); ctx.clearRect(0, 0, W, H);
    const im = imgs[m]; if (im) ctx.drawImage(im, 0, 0, W, H);
  };

  const run = (from, to) => {
    if (reduced() || !cells) { cur = to; drawCrisp(to); return; }
    const [W, H] = size();
    const t0 = performance.now() + 220, DUR = 1100;
    cancelAnimationFrame(anim);
    const step = (now) => {
      const t = (now - t0) / DUR;
      if (t < 0) { anim = requestAnimationFrame(step); return; }
      if (t >= 1) { cur = to; anim = null; drawCrisp(to); return; }
      ctx.clearRect(0, 0, W, H);
      for (const c of cells) {
        // phase 1: the old colour disperses outward and shrinks
        const qa = Math.min(1, Math.max(0, (t - c.d * 0.4) / 0.5));
        if (qa < 1) {
          const e = qa * qa;
          ctx.globalAlpha = 1 - qa;
          ctx.fillStyle = COLOR[from];
          const dx = Math.cos(c.a) * e * 14 * dpr * c.s, dy = Math.sin(c.a) * e * 9 * dpr * c.s - e * 4 * dpr;
          const sz = cellW * (1 - e * 0.5);
          ctx.fillRect(c.x + dx, c.y + dy, sz, sz);
        }
        // phase 2: the new colour comes in from disorder and settles
        const qb = Math.min(1, Math.max(0, (t - 0.32 - c.d * 0.5) / 0.55));
        if (qb > 0) {
          const e = 1 - (1 - qb) ** 3;
          ctx.globalAlpha = Math.min(1, qb * 1.6);
          ctx.fillStyle = COLOR[to];
          const dx = Math.cos(c.a + 2) * (1 - e) * 18 * dpr * c.s, dy = Math.sin(c.a + 2) * (1 - e) * 10 * dpr * c.s;
          ctx.fillRect(c.x + dx, c.y + dy, cellW, cellW);
        }
      }
      ctx.globalAlpha = 1;
      anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  };

  // short glitch on hover: shifted rows
  const glitch = () => {
    if (reduced() || !cells || anim) return;
    const [W, H] = size(); const t0 = performance.now(); const R = rng(Math.floor(t0));
    const shifts = Array.from({ length: Math.ceil(H / cellW) }, () => (R() - 0.5) * 8 * dpr);
    const step = (now) => {
      const t = (now - t0) / 380;
      if (t >= 1) { anim = null; drawCrisp(cur); return; }
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = COLOR[cur];
      for (const c of cells) ctx.fillRect(c.x + shifts[(c.y / cellW) | 0] * (1 - t) * (R() > 0.7 ? 1 : 0.3), c.y, cellW, cellW);
      anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  };

  Promise.all([loadImg(SRC.light), loadImg(SRC.dark)]).then(([l, d]) => {
    imgs.light = l; imgs.dark = d; buildCells(); drawCrisp(cur);
  });
  new ResizeObserver(() => { size(); buildCells(); if (!anim) drawCrisp(cur); }).observe(canvas);

  // theme.js flips <html data-theme>; follow it
  new MutationObserver(() => {
    const to = mode();
    if (to !== cur) { anim = null; run(cur, to); }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  canvas.closest('a')?.addEventListener('pointerenter', glitch);
}

function init() {
  const canvas = document.querySelector('.nav-ml canvas');
  if (canvas) wordmark(canvas);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
