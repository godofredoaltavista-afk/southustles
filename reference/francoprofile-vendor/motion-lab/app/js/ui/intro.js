// PORTED FROM motion-lab/app/js/ui/intro.js @ copia local 2026-10-23 — DO NOT EDIT. Adapted copy lives in js/**/fp-*.js
// Splash de arranque (v3, claro): la figura y el wordmark de Moyon, una persona de partículas muy de cerca detrás y
// líneas de terminal con el estado real (disco); después sale con un iris. No bloquea clicks y dura ~1.7 s.
// También: partículas que forman "ENTRENÁ" al terminar el onboarding.
import { reduced, EASE_OUT, curl, rng } from './motion.js';
import { theme } from './theme.js';

export function splash() {
  if (reduced()) return;
  const el = document.createElement('div');
  el.className = 'splash v3';
  el.innerHTML = `<canvas class="sp-fx"></canvas><div class="sp-in"><img class="sp-fig" src="brand/figura.png" alt="" />
    <img class="sp-wm3" src="brand/moyon-negro.png" alt="Moyon Lab" /><div class="sp-bar"><i></i></div>
    <pre class="sp-term"></pre></div>`;
  document.body.append(el);
  zoomPerson(el.querySelector('.sp-fx'));
  const term = el.querySelector('.sp-term');
  const lines = [
    'PS D:\\motion-lab> .\\start.ps1',
    () => `▸ análisis   11 módulos · 33 puntos · 3D en metros`,
    () => `▸ disco      ${document.querySelector('#st-disk')?.textContent || '—'}`,
    () => `▸ listo  →   ${location.host || 'localhost:8000'}`,
  ];
  let li = 0, ci = 0, out = '';
  const tick = () => {
    if (li >= lines.length) return;
    const L = typeof lines[li] === 'function' ? lines[li]() : lines[li];
    ci += 3; term.textContent = out + L.slice(0, ci) + '▍';
    if (ci >= L.length) { out += `${L}\n`; li++; ci = 0; }
    setTimeout(tick, li === 0 ? 14 : 10);
  };
  setTimeout(tick, 350);
  setTimeout(() => {
    const a = el.animate([{ clipPath: 'circle(150% at 50% 45%)', opacity: 1 }, { clipPath: 'circle(0% at 50% 45%)', opacity: 1 }], { duration: 620, easing: 'cubic-bezier(0.7, 0, 0.84, 0)', fill: 'forwards' });
    a.onfinish = () => el.remove();
  }, 1700);
}

/** Persona de partículas muy de cerca (abstracta): muestrea brand/figura.png y la agranda ~2.6× el alto de la pantalla. */
function zoomPerson(cv) {
  const img = new Image();
  img.onload = () => {
    if (!cv.isConnected) return;
    const dpr = Math.min(2, devicePixelRatio || 1), W = innerWidth, H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr);
    const o = document.createElement('canvas'), step = 3;
    o.width = Math.round(img.width / step); o.height = Math.round(img.height / step);
    const oc = o.getContext('2d'); oc.drawImage(img, 0, 0, o.width, o.height);
    const d = oc.getImageData(0, 0, o.width, o.height).data, R = rng(4), P = [];
    const HUD = ['#d05838', '#2f7bff', '#ff3b30', '#ffd60a'], ar = img.width / img.height;
    for (let y = 0; y < o.height; y++) for (let x = 0; x < o.width; x++) {
      const i = (y * o.width + x) * 4; if (d[i + 3] < 100) continue;
      P.push({ x: x / o.width - 0.5, y: y / o.height - 0.5, c: R() < 0.2 ? HUD[Math.floor(R() * 4)] : `rgb(${d[i]},${d[i + 1]},${d[i + 2]})`, s: 1 + R() * 2.4, ph: R() * 6.283 });
    }
    const t0 = performance.now();
    const frame = (now) => {
      if (!cv.isConnected) return;
      const t = (now - t0) / 1000, k = H * (2.7 - 0.4 * Math.min(1, t / 1.9)), cx = W * 0.6, cy = H * 0.44;
      ctx.clearRect(0, 0, W, H);
      for (const p of P) {
        const x = cx + p.x * k * ar + Math.sin(t * 0.8 + p.ph) * 3, y = cy + p.y * k + Math.cos(t * 0.7 + p.ph) * 3;
        if (x < -8 || y < -8 || x > W + 8 || y > H + 8) continue;
        ctx.globalAlpha = 0.14 + 0.12 * Math.sin(t * 2.2 + p.ph);
        ctx.fillStyle = p.c;
        ctx.fillRect(x, y, p.s * 2, p.s * 2);
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };
  img.src = 'brand/figura.png';
}

/** Partículas desde el centro que se ordenan formando una palabra y se disuelven (≈1.3 s). */
export function particleWord(word = 'ENTRENÁ') {
  if (reduced()) return;
  const cv = document.createElement('canvas');
  cv.className = 'pword';
  document.body.append(cv);
  const dpr = Math.min(2, devicePixelRatio || 1), W = innerWidth, H = innerHeight;
  cv.width = W * dpr; cv.height = H * dpr;
  const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr);
  // puntos objetivo: muestrear el texto
  const off = document.createElement('canvas'); off.width = W; off.height = H;
  const o = off.getContext('2d'); const size = Math.min(W / (word.length * 0.52), H * 0.34);
  o.font = `${size}px "Bebas Neue", "Arial Narrow", sans-serif`; o.textAlign = 'center'; o.textBaseline = 'middle'; o.fillText(word, W / 2, H / 2);
  const d = o.getImageData(0, 0, W, H).data, pts = [];
  for (let y = 0; y < H; y += 5) for (let x = 0; x < W; x += 5) if (d[(y * W + x) * 4 + 3] > 120) pts.push([x, y]);
  const R = rng(9), N = Math.min(1500, pts.length);
  const P = Array.from({ length: N }, (_, i) => { const t = pts[Math.floor(R() * pts.length)]; const a = R() * 6.283, r = 40 + R() * 260; const [cx, cy] = curl(t[0] * 0.004, t[1] * 0.004, 0.3); return { sx: W / 2 + Math.cos(a) * r, sy: H / 2 + Math.sin(a) * r * 0.6, tx: t[0], ty: t[1], d: R() * 0.25, c: i % 5, cx, cy }; });
  const COLS = theme.ink ? ['#0a0a0a', '#0a0a0a', '#b44528', '#2f7bff', '#ff3b30'] : ['#e06040', '#e06040', '#2f7bff', '#ff3b30', '#ffd60a'];
  const t0 = performance.now(), DUR = 1300;
  const frame = (now) => {
    const t = (now - t0) / DUR; if (t > 1) { cv.remove(); return; }
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = theme.ink ? 'source-over' : 'lighter';
    const fade = t > 0.78 ? 1 - (t - 0.78) / 0.22 : 1;
    for (const p of P) {
      const q = Math.min(1, Math.max(0, (t * 1.35 - p.d) / 0.7)), e = q < 0.5 ? 4 * q ** 3 : 1 - (-2 * q + 2) ** 3 / 2;
      const cx = p.cx, cy = p.cy, sw = Math.sin(q * Math.PI) * 120;
      ctx.globalAlpha = fade * (0.35 + 0.65 * e); ctx.fillStyle = COLS[p.c];
      ctx.fillRect(p.sx + (p.tx - p.sx) * e + cx * sw, p.sy + (p.ty - p.sy) * e + cy * sw, 2.4, 2.4);
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  cv.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: EASE_OUT });
}
