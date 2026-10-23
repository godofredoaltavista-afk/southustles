// FP · COLOR HUD — puerto de initColorHud + initColorHudDemo (southustles/app/js/sh-main.js)
// y de la leyenda de sh3-hud.js. 3 puntos arrastrables (y con flechas) sobre un track en gradiente,
// vertical a la izquierda con «RESET»; en mobile (< 900 px) píldora horizontal abajo.
// Reescriben --fp-accent / --fp-accent-2 / --fp-accent-soft en <html> con hsl(t*320, 78%, 62%).
// Persisten en fp.hud.colors (array de 3; lo lee el snippet no-flash). Despacha 'fp-accent-changed'.
// Demo automática cada 5 s mientras el hero está a la vista y nadie tocó el HUD (como South Hustles).
console.log('[fp/color-hud] init');

const VARS = ['--fp-accent', '--fp-accent-2', '--fp-accent-soft'];
const DEF_POS = [0.2, 0.5, 0.8];
const DEMO_STOPS = [0.02, 0.22, 0.5, 0.62, 0.92];
const KEY = 'fp.hud.colors';
const POS_KEY = 'fp.hud.pos';
const posToColor = (t) => `hsl(${Math.round(t * 320)}, 78%, 62%)`;

function readLS(k, def) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } }
function writeLS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* */ } }

export function initColorHud(ctx) {
  const hud = document.getElementById('fp-color-hud');
  if (!hud || hud.dataset.ready) return null;
  hud.dataset.ready = '1';
  const reduced = ctx?.env?.prefersReducedMotion?.() ?? false;

  hud.innerHTML = `
    <div class="fp-color-hud__track" role="group" aria-label="Colores de acento: arrastrá un punto o usá las flechas">
      <button type="button" class="fp-color-hud__dot" data-dot="0" role="slider" aria-orientation="vertical" aria-valuemin="0" aria-valuemax="100" aria-valuenow="20" aria-label="Acento" data-label="ACENTO"></button>
      <button type="button" class="fp-color-hud__dot" data-dot="1" role="slider" aria-orientation="vertical" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-label="Segundo tono" data-label="CÁLIDO"></button>
      <button type="button" class="fp-color-hud__dot" data-dot="2" role="slider" aria-orientation="vertical" aria-valuemin="0" aria-valuemax="100" aria-valuenow="80" aria-label="Tono suave" data-label="SUAVE"></button>
    </div>
    <button type="button" class="fp-color-hud__reset" aria-label="Volver a los colores de marca">Reset</button>
    <div class="fp-hud-legend" aria-hidden="true">
      <div class="fp-hud-legend__row" data-for="0"><i class="fp-hl-swatch" style="background:var(--fp-accent)"></i><div><b>ACENTO</b><span>botones · rellenos · partículas del campo</span></div><em class="fp-hl-demo fp-hl-demo--pill">btn</em></div>
      <div class="fp-hud-legend__row" data-for="1"><i class="fp-hl-swatch" style="background:var(--fp-accent-2)"></i><div><b>CÁLIDO</b><span>alertas · segundo tono · degradés</span></div><em class="fp-hl-demo fp-hl-demo--mark">mark</em></div>
      <div class="fp-hud-legend__row" data-for="2"><i class="fp-hl-swatch" style="background:var(--fp-accent-soft)"></i><div><b>SUAVE</b><span>brillos · auras · halos</span></div><em class="fp-hl-demo fp-hl-demo--glow">✦</em></div>
      <div class="fp-hud-legend__tip">arrastrá un punto ↑↓ — repinta toda la página</div>
    </div>`;

  const track = hud.querySelector('.fp-color-hud__track');
  const dots = [...hud.querySelectorAll('.fp-color-hud__dot')];
  const reset = hud.querySelector('.fp-color-hud__reset');
  const root = document.documentElement;
  const horizontal = () => window.matchMedia('(max-width: 900px)').matches;

  let saved = readLS(KEY, null);
  let pos = readLS(POS_KEY, null) || [...DEF_POS];
  let raf = null;
  const announce = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = null; document.dispatchEvent(new CustomEvent('fp-accent-changed', { detail: { colors: VARS.map((v) => root.style.getPropertyValue(v) || null) } })); });
  };

  const place = (dot, t) => {
    if (horizontal()) { dot.style.left = `${t * 100}%`; dot.style.top = ''; }
    else { dot.style.top = `${t * 100}%`; dot.style.left = ''; }
  };

  /** pinta un punto en t (0..1) y reescribe su variable. persist=false para la demo. */
  const apply = (dot, t, persist = true) => {
    t = Math.min(1, Math.max(0, t));
    const i = +dot.dataset.dot;
    const col = posToColor(t);
    pos[i] = t;
    place(dot, t);
    root.style.setProperty(VARS[i], col);
    dot.style.background = col;
    dot.setAttribute('aria-valuenow', String(Math.round(t * 100)));
    dot.setAttribute('aria-valuetext', `${dot.dataset.label.toLowerCase()} ${col}`);
    if (persist) {
      saved = saved || [null, null, null];
      saved[i] = col;
      writeLS(KEY, saved);
      writeLS(POS_KEY, pos);
    }
    announce();
  };

  // estado inicial: colores guardados (el snippet ya los aplicó) o marca por defecto
  dots.forEach((d, i) => {
    place(d, pos[i] ?? DEF_POS[i]);
    if (saved && saved[i]) d.style.background = saved[i];
  });

  /* ── demo automática (South Hustles): cada 5 s, solo con el hero a la vista, se corta al primer toque ── */
  let demoTimer = null, tick = 0, touched = !!saved, demoPainted = false;
  const stopDemo = (restore) => {
    if (demoTimer) { clearInterval(demoTimer); demoTimer = null; }
    if (restore && demoPainted && !touched) {
      VARS.forEach((v) => root.style.removeProperty(v));
      dots.forEach((d, i) => { d.style.removeProperty('background'); place(d, DEF_POS[i]); });
      demoPainted = false;
      announce();
    }
  };
  const startDemo = () => {
    if (touched || reduced || demoTimer) return;
    demoTimer = setInterval(() => {
      tick = (tick + 1) % DEMO_STOPS.length;
      dots.forEach((dot, i) => apply(dot, DEMO_STOPS[(tick + i) % DEMO_STOPS.length], false));
      demoPainted = true;
    }, 5000);
  };
  const lock = () => { touched = true; stopDemo(false); };
  hud.addEventListener('pointerdown', lock, { once: true });
  hud.addEventListener('keydown', lock, { once: true });
  if (!touched && !reduced) {
    const hero = document.querySelector('[data-fp-gl="hero"]') || document.querySelector('.fp-section');
    if (hero && 'IntersectionObserver' in window) {
      new IntersectionObserver((en) => {
        if (touched) return;
        if (en[0].isIntersecting && en[0].intersectionRatio > 0.35) startDemo(); else stopDemo(true);
      }, { threshold: [0, 0.35, 0.6] }).observe(hero);
    } else startDemo();
  }

  /* ── arrastre + teclado ── */
  dots.forEach((dot) => {
    let dragging = false;
    const move = (e) => {
      const r = track.getBoundingClientRect();
      const t = horizontal() ? (e.clientX - r.left) / r.width : (e.clientY - r.top) / r.height;
      apply(dot, t);
    };
    dot.addEventListener('pointerdown', (e) => {
      dragging = true; lock();
      dot.classList.add('is-dragging');
      dot.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    dot.addEventListener('pointermove', (e) => { if (dragging) move(e); });
    const up = () => { dragging = false; dot.classList.remove('is-dragging'); };
    dot.addEventListener('pointerup', up);
    dot.addEventListener('pointercancel', up);
    dot.addEventListener('keydown', (e) => {
      const i = +dot.dataset.dot;
      const cur = pos[i] ?? DEF_POS[i];
      const step = e.shiftKey ? 0.1 : 0.03;
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { apply(dot, cur - step); e.preventDefault(); }
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { apply(dot, cur + step); e.preventDefault(); }
      if (e.key === 'Home') { apply(dot, 0); e.preventDefault(); }
      if (e.key === 'End') { apply(dot, 1); e.preventDefault(); }
    });
  });

  const doReset = () => {
    lock();
    VARS.forEach((v) => root.style.removeProperty(v));
    dots.forEach((d, i) => { d.style.removeProperty('background'); place(d, DEF_POS[i]); d.setAttribute('aria-valuenow', String(DEF_POS[i] * 100)); d.removeAttribute('aria-valuetext'); });
    pos = [...DEF_POS]; saved = null;
    try { localStorage.removeItem(KEY); localStorage.removeItem(POS_KEY); } catch { /* */ }
    announce();
    ctx?.toast?.('Colores de marca restaurados', 'ok', 1800);
  };
  reset.addEventListener('click', doReset);
  document.addEventListener('fp-hud-reset', doReset);

  /* ── leyenda (sh3-hud): se abre con hover/foco/arrastre; la fila ilumina su punto ── */
  let hold = null;
  const show = () => { clearTimeout(hold); hud.classList.add('is-legend'); };
  const hide = () => { hold = setTimeout(() => hud.classList.remove('is-legend'), 600); };
  hud.addEventListener('pointerenter', show);
  hud.addEventListener('pointerleave', hide);
  hud.addEventListener('focusin', show);
  hud.addEventListener('focusout', hide);
  hud.querySelectorAll('.fp-hud-legend__row').forEach((row) => {
    const dot = dots[+row.dataset.for];
    row.addEventListener('pointerenter', () => dot.classList.add('is-hinted'));
    row.addEventListener('pointerleave', () => dot.classList.remove('is-hinted'));
  });

  /* ── orientación (desktop vertical / mobile horizontal) y ocultar con la app abierta ── */
  window.addEventListener('resize', () => dots.forEach((d, i) => place(d, pos[i] ?? DEF_POS[i])), { passive: true });
  const syncApp = (open) => hud.classList.toggle('is-hidden', !!open);
  syncApp(location.hash.startsWith('#/'));
  document.addEventListener('fp-app', (e) => syncApp(e.detail?.open));
  window.addEventListener('hashchange', () => syncApp(location.hash.startsWith('#/')));

  hud.classList.add('is-ready');
  return { reset: doReset, stopDemo: () => lock() };
}
