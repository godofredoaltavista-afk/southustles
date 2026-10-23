// FP · UI — helpers compartidos por capítulos, verticales y vistas.
// Toasts (Apacheta), medidor conic (ScoreGauge), sparklines SVG, chips [U]/[C]/[?] + respaldo,
// y los FX de South Hustles: tilt holográfico con spring (holo-tilt.js), imán y relleno direccional (sh2-fx.js),
// reveal con stagger que no se des-revela (ScrollTrigger de Ant on Mars) y contadores (reveal.js).
import { esc, fmt, fxEnabled, prefersReducedMotion, clamp } from '../core/fp-env.js';
import { icon } from './fp-icons.js';

console.log('[fp/ui] init');

export { icon, esc, fmt };

/* ── toasts ── */
export function toast(msg, kind = 'info', ms = 3200) {
  let host = document.getElementById('fp-toasts');
  if (!host) { host = document.createElement('div'); host.id = 'fp-toasts'; host.className = 'fp-toasts'; host.setAttribute('role', 'status'); host.setAttribute('aria-live', 'polite'); document.body.append(host); }
  const el = document.createElement('div');
  el.className = `fp-toast fp-toast--${kind}`;
  el.innerHTML = `${icon(kind === 'bad' ? 'alert' : kind === 'ok' ? 'check' : 'info', 16)}<span>${esc(msg)}</span>`;
  host.append(el);
  requestAnimationFrame(() => el.classList.add('is-in'));
  setTimeout(() => { el.classList.remove('is-in'); setTimeout(() => el.remove(), 400); }, ms);
}

/* ── chips ── */
export const tag = (t) => (t ? `<span class="fp-tag fp-tag--${t === '?' ? 'Q' : t}" title="${t === 'U' ? 'Lo dijo Franco' : t === 'C' ? 'Sugerido (mentores/Claude)' : 'Falta confirmar'}">${t === '?' ? '?' : t}</span>` : '');
export const support = (s) => `<span class="fp-support fp-support--${s}">${s === 'Solida' ? 'Sólida' : s}</span>`;
export const demoChip = () => '<span class="fp-chip fp-chip--demo">EJEMPLO</span>';

/**
 * Medidor circular (conic-gradient + máscara). value/max → %, band=[lo,hi] dibuja el rango objetivo.
 * @returns {string}
 */
export function gauge({ value = 0, max = 100, label = '', unit = '', band = null, size = '', status = '', display = null }) {
  const pct = max ? clamp((value / max) * 100, 0, 100) : 0;
  const bandStyle = band ? `--lo:${clamp((band[0] / max) * 100, 0, 100)};--hi:${clamp((band[1] / max) * 100, 0, 100)};` : '';
  const cls = ['fp-gauge', size && `fp-gauge--${size}`, status && `fp-gauge--${status}`].filter(Boolean).join(' ');
  return `<div class="${cls}" style="--score:${pct.toFixed(1)};${bandStyle}" role="img" aria-label="${esc(label)}: ${esc(display ?? fmt(value))} ${esc(unit)}">
    ${band ? '<i class="fp-gauge__band"></i>' : ''}<i class="fp-gauge__ring"></i>
    <span class="fp-gauge__in"><b class="fp-gauge__v">${esc(display ?? fmt(value))}</b>${unit ? `<span class="fp-gauge__u">${esc(unit)}</span>` : ''}</span>
  </div>`;
}

/**
 * Sparkline SVG. values: number[] (o {v}). opts: {band:[lo,hi], avg:number[], h, dots, labels}
 */
export function spark(values, { band = null, avg = null, h = 60, w = 240, dots = true, min = null, max = null } = {}) {
  const v = values.map((x) => (typeof x === 'object' ? x.v : x)).filter((x) => x != null);
  if (!v.length) return '<svg class="fp-spark" viewBox="0 0 240 60"></svg>';
  const all = [...v, ...(avg || []), ...(band || [])];
  let lo = min ?? Math.min(...all), hi = max ?? Math.max(...all);
  if (hi - lo < 1e-6) { hi += 1; lo -= 1; }
  const pad = (hi - lo) * 0.12; lo -= pad; hi += pad;
  const X = (i, n) => (n <= 1 ? w / 2 : (i / (n - 1)) * w);
  const Y = (y) => h - ((y - lo) / (hi - lo)) * h;
  const line = (arr) => arr.map((y, i) => `${i ? 'L' : 'M'}${X(i, arr.length).toFixed(1)},${Y(y).toFixed(1)}`).join('');
  const area = `${line(v)}L${X(v.length - 1, v.length)},${h}L0,${h}Z`;
  const bandR = band ? `<rect class="band" x="0" y="${Y(band[1]).toFixed(1)}" width="${w}" height="${Math.max(1, Y(band[0]) - Y(band[1])).toFixed(1)}"/>` : '';
  const last = dots ? `<circle cx="${X(v.length - 1, v.length)}" cy="${Y(v[v.length - 1])}" r="3"/>` : '';
  return `<svg class="fp-spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="Serie de ${v.length} valores">${bandR}<path class="a" d="${area}"/><path class="l" d="${line(v)}"/>${avg ? `<path class="m" d="${line(avg)}"/>` : ''}${last}</svg>`;
}

/** Barras horizontales simples. items: [{label, v, max, cls}] */
export function bars(items) {
  return `<div class="fp-bars">${items.map((it) => `<div class="fp-bars__row"><span class="fp-bars__l">${esc(it.label)}</span><div class="fp-bar ${it.cls || ''}" style="--v:${clamp(((it.v || 0) / (it.max || 1)) * 100, 0, 100)}"><i></i></div><span class="fp-bars__v fp-data">${esc(it.display ?? fmt(it.v))}</span></div>`).join('')}</div>`;
}

/* ── FX: tilt holográfico con spring (holo-tilt.js: stiffness .14, maxTilt 10°, scale 1.03) ── */
export function tilt(el, { max = 10, scale = 1.03, stiff = 0.14 } = {}) {
  if (!el || el.dataset.fpTilt || !fxEnabled()) return;
  el.dataset.fpTilt = '1';
  el.classList.add('fp-tilt');
  let tx = 0, ty = 0, cx = 0, cy = 0, ts = 1, cs = 1, raf = null, mx = 50, my = 50, hyp = 0, thyp = 0;
  const tick = () => {
    cx += (tx - cx) * stiff; cy += (ty - cy) * stiff; cs += (ts - cs) * stiff; hyp += (thyp - hyp) * stiff;
    el.style.setProperty('--fp-hx', `${cx.toFixed(2)}deg`);
    el.style.setProperty('--fp-hy', `${cy.toFixed(2)}deg`);
    el.style.setProperty('--fp-hs', cs.toFixed(3));
    el.style.setProperty('--fp-mx', `${mx}%`);
    el.style.setProperty('--fp-my', `${my}%`);
    el.style.setProperty('--fp-hyp', hyp.toFixed(3));
    if (Math.abs(tx - cx) + Math.abs(ty - cy) + Math.abs(ts - cs) + Math.abs(thyp - hyp) > 0.002) raf = requestAnimationFrame(tick);
    else { raf = null; if (!tx && !ty) el.style.willChange = ''; }
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    tx = (px - 0.5) * 2 * max; ty = -(py - 0.5) * 2 * max; ts = scale; mx = Math.round(px * 100); my = Math.round(py * 100);
    thyp = Math.min(1, Math.hypot(px - 0.5, py - 0.5) * 1.6);
    el.style.willChange = 'transform'; kick();
  });
  el.addEventListener('pointerleave', () => { tx = 0; ty = 0; ts = 1; thyp = 0; kick(); });
}

/* ── FX: imán (radio 60, rigidez .12, tirón .32, tope 12px; escribe `translate`) ── */
const magnets = [];
let magRaf = null, magBound = false;
export function magnetic(el) {
  if (!el || el.dataset.fpMag || !fxEnabled()) return;
  el.dataset.fpMag = '1';
  magnets.push({ el, tx: 0, ty: 0, cx: 0, cy: 0, on: false });
  if (magBound) return;
  magBound = true;
  const tick = () => {
    let live = false;
    for (const it of magnets) {
      it.cx += (it.tx - it.cx) * 0.12; it.cy += (it.ty - it.cy) * 0.12;
      if (!it.tx && !it.ty && Math.abs(it.cx) < 0.05 && Math.abs(it.cy) < 0.05) { if (it.on) { it.el.style.translate = ''; it.on = false; } it.cx = it.cy = 0; continue; }
      it.on = true; it.el.style.translate = `${it.cx.toFixed(2)}px ${it.cy.toFixed(2)}px`;
      if (Math.abs(it.tx - it.cx) > 0.04 || Math.abs(it.ty - it.cy) > 0.04) live = true;
    }
    magRaf = live ? requestAnimationFrame(tick) : null;
  };
  window.addEventListener('pointermove', (e) => {
    let any = false;
    for (const it of magnets) {
      if (!it.el.isConnected) continue;
      const r = it.el.getBoundingClientRect();
      if (!r.width) { it.tx = it.ty = 0; continue; }
      const nx = clamp(e.clientX, r.left, r.right), ny = clamp(e.clientY, r.top, r.bottom);
      const d = Math.hypot(e.clientX - nx, e.clientY - ny);
      if (d < 60) {
        const s = 1 - d / 60;
        it.tx = clamp((e.clientX - (r.left + r.width / 2)) * 0.32 * s, -12, 12);
        it.ty = clamp((e.clientY - (r.top + r.height / 2)) * 0.32 * s, -12, 12);
        any = true;
      } else { it.tx = it.ty = 0; }
    }
    if ((any || magnets.some((m) => m.on)) && !magRaf) magRaf = requestAnimationFrame(tick);
  }, { passive: true });
}

/* ── FX: relleno direccional (JS solo escribe data-dir) ── */
function edgeOf(e, el) {
  const r = el.getBoundingClientRect();
  if (!r.width || !r.height) return 'bottom';
  const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
  return Math.abs(x) > Math.abs(y) ? (x > 0 ? 'right' : 'left') : (y > 0 ? 'bottom' : 'top');
}
export function dirfill(el) {
  if (!el || el.classList.contains('fp-dirfill') || !fxEnabled()) return;
  el.classList.add('fp-dirfill');
  el.addEventListener('pointerenter', (e) => { el.style.setProperty('--fp-dirfill-t', '0s'); el.dataset.dir = edgeOf(e, el); void el.offsetWidth; el.style.removeProperty('--fp-dirfill-t'); });
  el.addEventListener('pointerleave', (e) => { el.dataset.dir = edgeOf(e, el); });
}

/** Aplica imán + direccional a todo lo marcado dentro de root. */
export function enhance(root = document) {
  root.querySelectorAll('[data-fp-magnetic], .fp-btn--magnetic').forEach(magnetic);
  root.querySelectorAll('[data-fp-dirfill]').forEach(dirfill);
  root.querySelectorAll('[data-fp-tilt]').forEach((el) => { if (el.dataset.fpTilt === '' || el.dataset.fpTilt === 'on') { el.dataset.fpTilt = ''; delete el.dataset.fpTilt; tilt(el); } });
}

/* ── reveal: [data-fp-fade] → .is-in (stagger por data-fp-delay o automático por hermanos) ── */
let revealIO = null;
export function reveal(root = document) {
  const els = root.querySelectorAll('[data-fp-fade]:not(.is-in)');
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
  if (!revealIO) {
    revealIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const d = +el.dataset.fpDelay || 0;
        setTimeout(() => el.classList.add('is-in'), d);
        revealIO.unobserve(el); // una vez revelado, no se des-revela
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  }
  // stagger automático entre hermanos que no traen delay
  const groups = new Map();
  els.forEach((el) => {
    if (el.dataset.fpDelay == null) {
      const p = el.parentElement; const i = groups.get(p) || 0; groups.set(p, i + 1);
      el.dataset.fpDelay = String(Math.min(i, 8) * 70);
    }
    revealIO.observe(el);
  });
}

/* ── contadores: [data-fp-count="12.5"] data-fp-suffix data-fp-dur data-fp-dec ── */
export function counters(root = document) {
  root.querySelectorAll('[data-fp-count]:not([data-fp-counted])').forEach((el) => {
    el.dataset.fpCounted = '1';
    const target = parseFloat(el.dataset.fpCount);
    const dec = +(el.dataset.fpDec ?? (String(el.dataset.fpCount).includes('.') ? 1 : 0));
    const suf = el.dataset.fpSuffix || '';
    const dur = +(el.dataset.fpDur || 1400);
    const paint = (v) => { el.textContent = `${fmt(v, dec)}${suf}`; };
    if (prefersReducedMotion() || Number.isNaN(target)) { paint(target || 0); return; }
    paint(0);
    const io = new IntersectionObserver((en) => {
      if (!en[0].isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (now) => { const t = Math.min(1, (now - t0) / dur); paint(target * (1 - (1 - t) ** 3)); if (t < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(el);
  });
}

/** Descarga un archivo generado en el navegador (nunca sube nada). */
export function downloadFile(name, content, type = 'application/json') {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.append(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

/** Copia al portapapeles con fallback. */
export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch {
    const ta = document.createElement('textarea'); ta.value = text; document.body.append(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch { /* */ } ta.remove(); return ok;
  }
}

/** Segmentado accesible: <div class="fp-seg" data-fp-seg> con botones [data-v]. onChange(v). */
export function segmented(el, value, onChange) {
  const btns = [...el.querySelectorAll('button[data-v]')];
  const set = (v) => btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === String(v))));
  set(value);
  btns.forEach((b) => b.addEventListener('click', () => { set(b.dataset.v); onChange?.(b.dataset.v); }));
  return { set };
}
