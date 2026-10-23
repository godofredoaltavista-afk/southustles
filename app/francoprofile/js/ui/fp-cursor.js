// FP · CURSOR — cursor de 3 capas de Ant on Mars (shared-layout.js initCursor + SYSTEMS.md):
// punto 6 px directo · anillo 36 px con lerp 0.12 · fantasma (orbe con siluetita) con lerp 0.028 (≈4,3× más lento).
// Estados: is-hovering (anillo 52 px) sobre a, button, [role=button], .fp-card, .win-h · is-clicking (24 px).
// Solo con puntero fino y sin reduced-motion (ctx.env.fxEnabled()) y si fp.cursor ≠ false. Nunca tapa texto:
// el anillo es hueco, el fantasma va detrás con baja opacidad y sobre campos de texto vuelve el cursor nativo.
// Un solo rAF que se duerme cuando todo se asentó.
// Preferencias: escucha 'fp-pref' {key:'cursor', value} (Ajustes) y 'fp-cursor' {on}. Persisten en fp.cursor.
console.log('[fp/cursor] init');

const HOVER_SEL = 'a, button, [role="button"], .fp-card, .win-h, label.fp-check, .fp-switch, summary, [data-fp-magnetic]';
const TEXT_SEL = 'input, textarea, select, [contenteditable=""], [contenteditable="true"]';

let bound = false;
let active = false;
let host = null, dot = null, ring = null, ghost = null;
let tx = 0, ty = 0, rx = 0, ry = 0, gx = 0, gy = 0, raf = null, visible = false;
let ctxRef = null;

const setT = (el, x, y) => { if (el) el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`; };
function tick() {
  if (!active) { raf = null; return; }
  rx += (tx - rx) * 0.12; ry += (ty - ry) * 0.12;
  gx += (tx - gx) * 0.028; gy += (ty - gy) * 0.028;
  setT(ring, rx, ry);
  setT(ghost, gx, gy);
  const moving = Math.abs(tx - rx) + Math.abs(ty - ry) > 0.1 || Math.abs(tx - gx) + Math.abs(ty - gy) > 0.15;
  raf = moving ? requestAnimationFrame(tick) : null;
}
const kick = () => { if (active && !raf) raf = requestAnimationFrame(tick); };

function canRun() {
  const env = ctxRef?.env;
  const fx = env?.fxEnabled ? env.fxEnabled() : !window.matchMedia('(pointer: coarse)').matches;
  let pref = true;
  try { const v = localStorage.getItem('fp.cursor'); if (v != null) pref = JSON.parse(v) !== false; } catch { /* */ }
  return fx && pref;
}

function on() {
  if (active || !host || !canRun()) return;
  active = true;
  host.hidden = false;
  host.innerHTML = `
    <div class="fp-cursor__ghost"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="4.5" r="2"/><path d="M12 6.5v7M12 9l-4 3M12 9l4 3M12 13.5l-3 6M12 13.5l3 6"/></svg></div>
    <div class="fp-cursor__ring"></div>
    <div class="fp-cursor__dot"></div>`;
  dot = host.querySelector('.fp-cursor__dot');
  ring = host.querySelector('.fp-cursor__ring');
  ghost = host.querySelector('.fp-cursor__ghost');
  visible = false;
  host.classList.remove('is-visible');
  document.documentElement.classList.add('fp-cursor-on');
}

function off() {
  active = false;
  if (raf) cancelAnimationFrame(raf);
  raf = null;
  if (host) { host.hidden = true; host.innerHTML = ''; host.classList.remove('is-visible', 'is-hovering', 'is-clicking', 'is-text'); }
  dot = ring = ghost = null;
  document.documentElement.classList.remove('fp-cursor-on');
}

function bind() {
  if (bound) return;
  bound = true;
  window.addEventListener('pointermove', (e) => {
    if (!active || (e.pointerType && e.pointerType !== 'mouse')) return;
    tx = e.clientX; ty = e.clientY;
    setT(dot, tx, ty);
    if (!visible) { visible = true; rx = gx = tx; ry = gy = ty; host.classList.add('is-visible'); }
    kick();
  }, { passive: true });
  const hide = () => { visible = false; host?.classList.remove('is-visible'); };
  document.addEventListener('pointerleave', hide);
  document.documentElement.addEventListener('mouseleave', hide);

  document.addEventListener('pointerover', (e) => {
    if (!active) return;
    const t = e.target;
    if (!(t instanceof Element)) return;
    host.classList.toggle('is-text', !!t.closest(TEXT_SEL));
    host.classList.toggle('is-hovering', !!t.closest(HOVER_SEL) && !t.closest(TEXT_SEL));
  }, { passive: true });
  document.addEventListener('pointerdown', () => { if (active) host.classList.add('is-clicking'); }, { passive: true });
  document.addEventListener('pointerup', () => { if (active) host.classList.remove('is-clicking'); }, { passive: true });

  // sobre la app abierta el cursor sigue (las ventanas lo usan), pero el fantasma se apaga
  const syncApp = (o) => host?.classList.toggle('is-app', !!o);
  syncApp(location.hash.startsWith('#/'));
  document.addEventListener('fp-app', (e) => syncApp(e.detail?.open));
  window.addEventListener('hashchange', () => syncApp(location.hash.startsWith('#/')));

  // Ajustes: fp-pref {key:'cursor', value:boolean} · compat: fp-cursor {on}
  const setPref = (v) => {
    try { localStorage.setItem('fp.cursor', JSON.stringify(!!v)); } catch { /* */ }
    if (v) on(); else off();
  };
  document.addEventListener('fp-pref', (e) => { if (e.detail?.key === 'cursor') setPref(e.detail.value !== false); });
  document.addEventListener('fp-cursor', (e) => { if (typeof e.detail?.on === 'boolean') setPref(e.detail.on); });
}

export function initCursor(ctx) {
  host = document.getElementById('fp-cursor');
  if (!host) return null;
  ctxRef = ctx;
  tx = rx = gx = window.innerWidth / 2;
  ty = ry = gy = window.innerHeight / 2;
  bind();
  if (canRun()) on(); else { host.hidden = true; }
  return { on, off };
}
