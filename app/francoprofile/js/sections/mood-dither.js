// FP · MOOD M14 — «Trama»: puerto del dither ORDENADO de Apacheta (frontend/src/ui/fx/dither.ts + DitherField + Grain).
// Bayer 8×8 sobre Perlin lento (sin Math.random: el patrón FLUYE, no vibra) + la silueta del cuerpo
// (boxer.json real, re-dibujada cada ~120 ms) como segunda capa. Alrededor del mouse el campo se abre
// y el cuerpo aparece en la tinta de acento: el puntero REVELA. Dos tintas del tema (--fp-ink-0 / --fp-accent).
console.log('[fp/mood-dither] init');

/** Bayer 8×8 normalizada a 0..1 — umbral fijo por celda. */
const BAYER8 = [
  [0, 32, 8, 40, 2, 34, 10, 42], [48, 16, 56, 24, 50, 18, 58, 26], [12, 44, 4, 36, 14, 46, 6, 38], [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41], [51, 19, 59, 27, 49, 17, 57, 25], [15, 47, 7, 39, 13, 45, 5, 37], [63, 31, 55, 23, 61, 29, 53, 21],
].map((row) => row.map((v) => (v + 0.5) / 64));

const PERM = (() => {
  const p = Array.from({ length: 256 }, (_, i) => i);
  let s = 1337;
  const rand = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let i = 255; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
  return [...p, ...p];
})();
const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (t, a, b) => a + t * (b - a);
const smooth = (t) => t * t * (3 - 2 * t);
function grad(h, x, y, z) { h &= 15; const u = h < 8 ? x : y; const v = h < 8 ? y : z; return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v); }
function perlin(x, y, z) {
  const p = PERM;
  const xi = Math.floor(x) & 255, yi = Math.floor(y) & 255, zi = Math.floor(z) & 255;
  const xf = x - Math.floor(x), yf = y - Math.floor(y), zf = z - Math.floor(z);
  const u = fade(xf), v = fade(yf), w = fade(zf);
  const a = p[xi] + yi, aa = p[a] + zi, ab = p[a + 1] + zi, b = p[xi + 1] + yi, ba = p[b] + zi, bb = p[b + 1] + zi;
  return lerp(w,
    lerp(v, lerp(u, grad(p[aa], xf, yf, zf), grad(p[ba], xf - 1, yf, zf)), lerp(u, grad(p[ab], xf, yf - 1, zf), grad(p[bb], xf - 1, yf - 1, zf))),
    lerp(v, lerp(u, grad(p[aa + 1], xf, yf, zf - 1), grad(p[ba + 1], xf - 1, yf, zf - 1)), lerp(u, grad(p[ab + 1], xf, yf - 1, zf - 1), grad(p[bb + 1], xf - 1, yf - 1, zf - 1))));
}

export default {
  id: 'mood-dither',
  n: 'M14',
  title: 'Trama',
  pol: 'mood',
  app: 'biblioteca',

  render(ctx) {
    const p = (ctx.data.premises || []).find((x) => x.id === 'm03-tension');
    return `
      <div class="fp-mb-dither">
        <canvas class="fp-mb-dither__cv" aria-hidden="true"></canvas>
        <i class="fp-mb-dither__grain" aria-hidden="true"></i>
        <div class="fp-mb-dither__copy fp-wrap fp-wrap--wide">
          <span class="fp-eyebrow"><b>M14</b> Trama · medio tono Bayer 8×8</span>
          <h2 data-fp-fade>Tensión, no <em>cansancio</em>.</h2>
          ${p ? `<p class="fp-lede" data-fp-fade>${ctx.ui.esc(p.claim)} ${ctx.ui.tag(p.tag)} ${ctx.ui.support(p.support)}</p><p class="fp-small" data-fp-fade>${ctx.ui.esc(p.note)}</p>` : ''}
          <p class="fp-mb-dither__hint fp-data" aria-hidden="true">↳ mové el mouse: el cuerpo aparece donde abrís la trama</p>
        </div>
        <div class="fp-mb-dither__foot fp-wrap fp-wrap--wide" aria-hidden="true">
          <span class="fp-data">PRENSADO EN MEDIO TONO</span><span class="fp-data">MATRIZ BAYER 8×8</span><span class="fp-data">PERLIN · 30 FPS</span>
        </div>
      </div>`;
  },

  async init(el, ctx) {
    const host = el.querySelector('.fp-mb-dither');
    const cv = el.querySelector('.fp-mb-dither__cv');
    const c = cv.getContext('2d');
    const reduced = ctx.env.prefersReducedMotion();
    const fx = ctx.env.fxEnabled();
    let session = null;
    try { const n = ctx.ml.normalize(await ctx.data.boxer(), 'boxer.json'); if (n.ok) session = n.session; } catch { /* sin silueta: solo trama */ }

    const CELL = 3, MAX_CELLS = 60000, INTENSITY = 0.5, GATE = 0.58, SPEED = 0.12, RADIUS = 0.3;
    let cols = 1, rows = 1, cell = CELL;
    let mask = new Float32Array(1);
    const off = document.createElement('canvas');
    const oc = off.getContext('2d', { willReadFrequently: true });
    let tx = 0.68, ty = 0.5, mx = 0.68, my = 0.5, inside = false;
    let time = 0, last = 0, frame = 0, raf = null, visible = false, maskAt = -1e9, fi = 0;
    let inkA = '#0d0d0f', inkB = '#e06040';

    const resolveInks = () => {
      const cs = getComputedStyle(host);
      inkA = cs.getPropertyValue('--fp-ink-0').trim() || inkA;
      inkB = cs.getPropertyValue('--fp-accent').trim() || inkB;
    };

    const resize = () => {
      const r = host.getBoundingClientRect();
      const w = Math.max(1, r.width), h = Math.max(1, r.height);
      cell = CELL; while ((w / cell) * (h / cell) > MAX_CELLS) cell += 1;
      cols = Math.ceil(w / cell); rows = Math.ceil(h / cell);
      cv.width = cols * 2; cv.height = rows * 2;   // supersample 2: punto de 1px en celda de 2 → calles vacías
      off.width = cols; off.height = rows;
      mask = new Float32Array(cols * rows);
      maskAt = -1e9;
    };

    // silueta: el esqueleto del boxer con trazo grueso, del lado derecho del banner
    const buildMask = () => {
      if (!session) return;
      const f = session.frames[fi % session.frames.length];
      fi += reduced ? 0 : 2;
      oc.clearRect(0, 0, cols, rows);
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (const p of f.pts) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
      const mobile = cols * cell < 760;
      const sc = (rows * 0.82) / (y1 - y0 || 1);
      const ox = cols * (mobile ? 0.5 : 0.7) - ((x0 + x1) / 2) * sc, oy = rows * 0.52 - ((y0 + y1) / 2) * sc;
      const X = (p) => p[0] * sc + ox, Y = (p) => p[1] * sc + oy;
      oc.strokeStyle = '#000'; oc.fillStyle = '#000'; oc.lineCap = 'round'; oc.lineJoin = 'round';
      const J = ctx.ml.JOINTS;
      for (const [a, b] of ctx.ml.BONES) {
        const pa = f.pts[J.indexOf(a)], pb = f.pts[J.indexOf(b)];
        oc.lineWidth = Math.max(3, rows * (a.includes('hip') || b.includes('hip') || a.includes('shoulder') && b.includes('shoulder') ? 0.07 : 0.045));
        oc.beginPath(); oc.moveTo(X(pa), Y(pa)); oc.lineTo(X(pb), Y(pb)); oc.stroke();
      }
      // torso relleno + cabeza + manos (puños)
      const P = (n) => f.pts[J.indexOf(n)];
      oc.beginPath(); oc.moveTo(X(P('l_shoulder')), Y(P('l_shoulder'))); oc.lineTo(X(P('r_shoulder')), Y(P('r_shoulder'))); oc.lineTo(X(P('r_hip')), Y(P('r_hip'))); oc.lineTo(X(P('l_hip')), Y(P('l_hip'))); oc.closePath(); oc.fill();
      oc.beginPath(); oc.arc(X(P('nose')), Y(P('nose')), rows * 0.055, 0, Math.PI * 2); oc.fill();
      for (const h of ['l_wrist', 'r_wrist']) { oc.beginPath(); oc.arc(X(P(h)), Y(P(h)), rows * 0.032, 0, Math.PI * 2); oc.fill(); }
      const d = oc.getImageData(0, 0, cols, rows).data;
      for (let i = 0; i < mask.length; i++) mask[i] = d[i * 4 + 3] / 255;
    };

    const draw = () => {
      c.clearRect(0, 0, cv.width, cv.height);
      const cx = mx * cols, cy = my * rows, radius = Math.min(cols, rows) * RADIUS * (inside || !fx ? 1 : 0.55);
      const z = time;
      const lit = []; // celdas del cuerpo reveladas (tinta B)
      c.fillStyle = inkA;
      for (let y = 0; y < rows; y++) {
        const row = BAYER8[y & 7];
        const yMacro = y * 0.008 * (cell / 2), yMicro = y * 0.03 * (cell / 2);
        const base = y * cols;
        for (let x = 0; x < cols; x++) {
          const thr = row[x & 7];
          const d = Math.hypot(x - cx, y - cy);
          const near = d < radius ? 1 - smooth(d / radius) : 0;
          const m = mask[base + x];
          // cuerpo revelado alrededor del puntero → tinta de acento
          if (m > 0.2 && near > 0) { if (m * (0.35 + near * 0.9) > thr) lit.push(x, y); continue; }
          // marea macro (regiones enteras sin trama) + grano micro
          const macro = (perlin(x * 0.008 * (cell / 2), yMacro, z * 0.4) + 1) / 2;
          const open = macro * 1.55 - GATE;
          let v = 0;
          if (open > 0) v = INTENSITY * Math.min(1, open) * (0.5 + ((perlin(x * 0.03 * (cell / 2), yMicro, z) + 1) / 2) * 0.9);
          v += m * 0.34;                    // la silueta siempre se intuye, apenas
          v *= 1 - near * 0.92;             // claro del cursor (como DitherField)
          if (v > thr) c.fillRect(x * 2, y * 2, 1, 1);
        }
      }
      if (lit.length) {
        c.fillStyle = inkB;
        for (let i = 0; i < lit.length; i += 2) c.fillRect(lit[i] * 2, lit[i + 1] * 2, 2, 2);
      }
    };

    const loop = (now) => {
      raf = null;
      if (!visible) return;
      raf = requestAnimationFrame(loop);
      if (now - last < 33) return;  // ~30 fps: la trama no gana nada a 60
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      time += SPEED * dt;
      mx += (tx - mx) * 0.12; my += (ty - my) * 0.12;
      if (!inside) { tx = 0.68 + Math.sin(now / 2600) * 0.08; ty = 0.48 + Math.cos(now / 3100) * 0.12; }
      if (now - maskAt > 120) { buildMask(); maskAt = now; }
      if (++frame % 30 === 0) resolveInks();
      draw();
    };

    resolveInks();
    resize(); buildMask(); draw();
    new ResizeObserver(() => { resize(); buildMask(); draw(); }).observe(host);
    document.addEventListener('fp-theme-changed', () => { resolveInks(); draw(); });
    if (reduced) { ctx.env.onVisible(el, (v) => { if (v) { resolveInks(); draw(); } }); return; }
    if (fx) {
      window.addEventListener('pointermove', (e) => {
        if (!visible) return;
        const r = host.getBoundingClientRect();
        tx = (e.clientX - r.left) / Math.max(1, r.width); ty = (e.clientY - r.top) / Math.max(1, r.height);
        inside = tx >= 0 && tx <= 1 && ty >= 0 && ty <= 1;
      }, { passive: true });
    }
    ctx.env.onVisible(el, (v) => { visible = v; if (v && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); } });
  },
};
