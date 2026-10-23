// FP · PARTICLE WORD — puerto de particleWord() de motion-lab/app/js/ui/intro.js.
// Partículas que salen del centro, se ordenan formando una palabra (Bebas) y se disuelven (≈1,3 s).
// Canvas 2D fijo en --fp-z-modal, no bloquea clicks, se quita solo. Cierre del onboarding ('ENTRENÁ')
// y fin de cada sesión ('LISTO'). Con prefers-reduced-motion no hace nada.
// rng / noise3 / curl copiados de motion-lab/app/js/ui/motion.js (sin tocar el original).
console.log('[fp/particle-word] init');

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const lerp = (a, b, t) => a + (b - a) * t;
const PERM = new Uint8Array(512);
{ const r = rng(1337); const p = [...Array(256).keys()]; for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; } for (let i = 0; i < 512; i++) PERM[i] = p[i & 255]; }
const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const grad = (h, x, y, z) => { const u = h < 8 ? x : y, v = h < 4 ? y : h === 12 || h === 14 ? x : z; return ((h & 1) ? -u : u) + ((h & 2) ? -v : v); };
function noise3(x, y, z) {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
  x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
  const u = fade(x), v = fade(y), w = fade(z);
  const A = PERM[X] + Y, AA = PERM[A] + Z, AB = PERM[A + 1] + Z, B = PERM[X + 1] + Y, BA = PERM[B] + Z, BB = PERM[B + 1] + Z;
  return lerp(lerp(lerp(grad(PERM[AA] & 15, x, y, z), grad(PERM[BA] & 15, x - 1, y, z), u), lerp(grad(PERM[AB] & 15, x, y - 1, z), grad(PERM[BB] & 15, x - 1, y - 1, z), u), v),
    lerp(lerp(grad(PERM[AA + 1] & 15, x, y, z - 1), grad(PERM[BA + 1] & 15, x - 1, y, z - 1), u), lerp(grad(PERM[AB + 1] & 15, x, y - 1, z - 1), grad(PERM[BB + 1] & 15, x - 1, y - 1, z - 1), u), v), w);
}
function curl(x, y, z) {
  const e = 0.01;
  return [(noise3(x, y + e, z) - noise3(x, y - e, z)) / (2 * e), -(noise3(x + e, y, z) - noise3(x - e, y, z)) / (2 * e)];
}

const reduced = () => !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isDark = () => document.documentElement.dataset.theme !== 'light';
const cssVar = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

let live = null;

/** Partículas desde el centro que se ordenan formando una palabra y se disuelven (≈1,3 s). */
export function particleWord(word = 'ENTRENÁ', { dur = 1300 } = {}) {
  if (reduced()) return Promise.resolve();
  if (live) { live.remove(); live = null; }
  const cv = document.createElement('canvas');
  cv.className = 'fp-pword';
  cv.setAttribute('aria-hidden', 'true');
  document.body.append(cv);
  live = cv;
  const dpr = Math.min(2, window.devicePixelRatio || 1), W = window.innerWidth, H = window.innerHeight;
  cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  const ctx = cv.getContext('2d');
  ctx.scale(dpr, dpr);

  // puntos objetivo: muestrear el texto en un canvas aparte
  const off = document.createElement('canvas'); off.width = W; off.height = H;
  const o = off.getContext('2d');
  const size = Math.min(W / (Math.max(word.length, 3) * 0.52), H * 0.34);
  o.font = `${size}px "Bebas Neue", "Arial Narrow", sans-serif`;
  o.textAlign = 'center'; o.textBaseline = 'middle';
  o.fillText(word, W / 2, H / 2);
  const d = o.getImageData(0, 0, W, H).data, pts = [];
  const stepPx = W < 700 ? 4 : 5;
  for (let y = 0; y < H; y += stepPx) for (let x = 0; x < W; x += stepPx) if (d[(y * W + x) * 4 + 3] > 120) pts.push([x, y]);
  if (!pts.length) { cv.remove(); live = null; return Promise.resolve(); }

  const R = rng(9), N = Math.min(1500, pts.length);
  const P = Array.from({ length: N }, (_, i) => {
    const t = pts[Math.floor(R() * pts.length)];
    const a = R() * 6.283, r = 40 + R() * 260;
    const [cx, cy] = curl(t[0] * 0.004, t[1] * 0.004, 0.3);
    return { sx: W / 2 + Math.cos(a) * r, sy: H / 2 + Math.sin(a) * r * 0.6, tx: t[0], ty: t[1], d: R() * 0.25, c: i % 5, cx, cy };
  });
  const dark = isDark();
  const accent = cssVar('--fp-accent') || '#e06040';
  const COLS = dark
    ? [accent, accent, '#2f7bff', '#ff3b30', '#ffd60a']
    : ['#0a0a0a', '#0a0a0a', accent, '#2f7bff', '#ff3b30'];

  return new Promise((resolve) => {
    const t0 = performance.now();
    const frame = (now) => {
      const t = (now - t0) / dur;
      if (t > 1 || !cv.isConnected) { cv.remove(); if (live === cv) live = null; resolve(); return; }
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over';
      const fadeOut = t > 0.78 ? 1 - (t - 0.78) / 0.22 : 1;
      for (const p of P) {
        const q = Math.min(1, Math.max(0, (t * 1.35 - p.d) / 0.7));
        const e = q < 0.5 ? 4 * q ** 3 : 1 - (-2 * q + 2) ** 3 / 2;
        const sw = Math.sin(q * Math.PI) * 120;
        ctx.globalAlpha = fadeOut * (0.35 + 0.65 * e);
        ctx.fillStyle = COLS[p.c];
        ctx.fillRect(p.sx + (p.tx - p.sx) * e + p.cx * sw, p.sy + (p.ty - p.sy) * e + p.cy * sw, 2.4, 2.4);
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    cv.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
  });
}
