// PORTED FROM motion-lab/app/js/ui/onboarding.js @ copia local 2026-10-23 — DO NOT EDIT. Adapted copy lives in js/**/fp-*.js
// Onboarding v2 (mismos ids): motores como cards 3D con icono, paso de cámara con chrome de visor,
// chequeo con caja de detección + arcos + LED de puntos visibles + checklist que se tilda con animación,
// y al entrar al estudio las partículas forman "ENTRENÁ". Además: "vs tu sesión anterior" en el reproductor.
import { icon } from './icons.js';
import { applyTilt } from './tilt.js';
import { drawLED } from './led.js';
import { theme } from './theme.js';
import { particleWord } from './intro.js';
import { EASE_OUT, reduced } from './motion.js';
import * as store from '../session/store.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

export function initOnboarding() {
  const R = window.__mlR, bus = window.__mlBus;
  const ob = $('#view-onboarding .ob');
  ob.classList.add('v2');
  // cards de motor con icono + tilt
  const ICON = { mediapipe: 'esqueleto', rtmlib: 'tresd', sim: 'fantasmas' };
  $$('.card.pick', ob).forEach((c) => {
    const v = $('input', c).value;
    c.insertAdjacentHTML('afterbegin', `<span class="eng-ico">${icon(ICON[v] ?? 'free', 30)}</span>`);
    c.insertAdjacentHTML('beforeend', '<i class="glare"></i>');
    applyTilt(c, { max: 7, scale: 1.02 });
  });
  // pasos: número grande + línea de progreso
  $$('.ob-steps li', ob).forEach((li) => { li.innerHTML = `<b>0${li.dataset.step}</b><span>${li.textContent}</span>`; });
  // cámara con chrome de visor
  const prev = $('#ob-preview');
  const wrap = document.createElement('div'); wrap.className = 'ob-viewfinder';
  prev.replaceWith(wrap); wrap.append(prev);
  wrap.insertAdjacentHTML('beforeend', '<i></i><i></i><i></i><i></i><span class="vf-rec">● EN VIVO</span>');
  // chequeo: visor con caja + arcos + chrome, y LED de puntos visibles
  R.ob.set({ bbox: true, chrome: true, angleArcs: true });
  const side = $('.ob-side', ob);
  const pts = document.createElement('div');
  pts.className = 'ob-pts';
  pts.innerHTML = '<canvas class="led"></canvas><div><b>PUNTOS VISIBLES</b><small>de 21 del esquema · 33 de MediaPipe</small></div>';
  $('h1', side).after(pts);
  const led = $('canvas', pts);
  let lastN = -1;
  bus.addEventListener('step', (e) => {
    if (window.__ml.view !== 'onboarding') return;
    const f = e.detail.frame; if (!f) return;
    const n = f.pts.filter((p) => p[3] >= 0.5).length;
    if (n !== lastN) { lastN = n; drawLED(led, String(n).padStart(2, '0'), { ink: theme.ink }); }
  });
  // checklist: animación al tildar
  new MutationObserver((ms) => {
    for (const m of ms) {
      const li = m.target;
      if (li.classList.contains('ok') && !m.oldValue?.includes('ok') && !reduced()) li.animate([{ transform: 'scale(1.04)', boxShadow: '0 0 0 2px rgba(34,211,107,0.6)' }, { transform: 'none', boxShadow: '0 0 0 0 rgba(34,211,107,0)' }], { duration: 520, easing: EASE_OUT });
    }
  }).observe($('#ob-checks'), { attributes: true, subtree: true, attributeFilter: ['class'], attributeOldValue: true });
  // al terminar: "ENTRENÁ" en partículas
  $('#ob-finish').addEventListener('click', () => setTimeout(() => particleWord('ENTRENÁ'), 60));
  initOnboardingV3(ob);

  // reproductor: tu sesión vs la anterior del mismo ejercicio (barra tipo "progreso")
  const box = document.createElement('div');
  box.className = 'vs-prev';
  bus.addEventListener('player', async (e) => {
    const PL = e.detail, m = PL.session.meta;
    const all = await store.listSessions();
    const prev = all.find((x) => x.exercise === m.exercise && x.id !== m.id && x.createdAt < m.createdAt);
    const pick = (k = {}) => (k.punches != null ? ['golpes', k.punches] : k.reps != null ? ['reps', k.reps] : k.jumps != null ? ['saltos', k.jumps] : k.holdMs != null ? ['s', +(k.holdMs / 1000).toFixed(1)] : [null, null]);
    const [u, now] = pick(m.kpis), [, before] = pick(prev?.kpis);
    const host = $('#pl-big')?.closest('.big');
    if (host && !box.isConnected) host.after(box);
    if (now == null || before == null) { box.innerHTML = `<small>${prev ? 'sin métrica comparable con la anterior' : 'primera sesión de este ejercicio'}</small>`; return; }
    const delta = before ? Math.round(((now - before) / before) * 100) : 0;
    const p = Math.max(0.04, Math.min(1, now / Math.max(now, before, 1e-6)));
    box.innerHTML = `<div class="vp-top"><small>vs tu sesión anterior (${before} ${u})</small><b class="${delta > 0 ? 'up' : delta < 0 ? 'down' : ''}">${delta > 0 ? '+' : ''}${delta}%</b></div><div class="vp-bar"><i style="width:${p * 100}%"></i><u style="left:${Math.min(100, (before / Math.max(now, before, 1e-6)) * 100)}%"></u></div>`;
    if (!reduced()) $('i', box).animate([{ width: '0%' }, { width: `${p * 100}%` }], { duration: 900, easing: EASE_OUT });
  });
}

// ───────────────────────── v3: ventana transparente centrada sobre la app ─────────────────────────
// - sin paso de motor (app.js carga MediaPipe solo y pone .auto); "Configurar" lo muestra completo
// - la app de fondo alterna Inicio / Estudio cada ~5 s (desenfocada, sin clicks)
// - perfil con "carga habitual (kg)" que precarga el "carga kg" del Estudio
function initOnboardingV3(ob) {
  ob.classList.add('v3');
  ob.insertAdjacentHTML('afterbegin', `<div class="ob-win-h"><img src="brand/figura.png" alt="" /><span>Empezá · Moyon Lab</span><em class="ob-win-sub">tres pasos y a entrenar</em></div>`);
  const p1 = $('.ob-panel[data-step="1"]', ob);
  p1.insertAdjacentHTML('afterbegin', `<div class="ob-auto"><span class="ob-spin"></span><div><b>Preparando el tracking</b><small>MediaPipe se carga solo, en tu máquina. El motor se cambia en Configurar.</small></div></div>`);
  // pasos renumerados cuando el de motor no se muestra
  const renum = () => {
    const auto = ob.classList.contains('auto');
    $$('.ob-steps li', ob).forEach((li) => { const n = Number(li.dataset.step) - (auto ? 1 : 0); const b = $('b', li); if (b) b.textContent = `0${Math.max(1, n)}`; });
  };
  new MutationObserver(renum).observe(ob, { attributes: true, attributeFilter: ['class'] });
  renum();
  // perfil: carga habitual
  const w = $('#pf-weight')?.closest('label');
  if (w && !$('#pf-load')) w.insertAdjacentHTML('afterend', '<label>Carga habitual (kg)<input id="pf-load" type="number" min="0" max="200" step="0.5" placeholder="p. ej. 8" /></label>');
  const S = window.__ml;
  if ($('#pf-load') && S?.profile?.loadKg) $('#pf-load').value = S.profile.loadKg;
  $('#ob-finish').textContent = 'Entrar a Moyon Lab';
  // fondo: la app detrás, alternando Inicio / Estudio
  const obView = $('#view-onboarding');
  const BACK = ['home', 'studio'];
  let bi = 0, timer = 0, cur = null;
  const place = (el) => {
    const r = obView.getBoundingClientRect();
    Object.assign(el.style, { position: 'fixed', left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
  };
  const clear = (el) => { el.classList.remove('ob-back'); for (const k of ['position', 'left', 'top', 'width', 'height', 'zIndex']) el.style[k] = ''; };
  const swap = () => {
    if (window.__ml?.view !== 'onboarding' || reduced()) return;
    const next = document.getElementById(`view-${BACK[bi++ % BACK.length]}`);
    if (!next) return;
    const prev = cur; cur = next;
    if (prev) prev.style.zIndex = '0';
    place(next); next.style.zIndex = '1'; next.classList.add('ob-back'); next.hidden = false;
    if (prev && prev !== next) setTimeout(() => { if (cur !== prev && window.__ml?.view === 'onboarding') { prev.hidden = true; clear(prev); } }, 900);
  };
  const stop = () => { clearInterval(timer); timer = 0; for (const v of BACK) { const el = document.getElementById(`view-${v}`); if (el) clear(el); } cur = null; };
  window.__mlBus?.addEventListener('view', (e) => {
    if (e.detail === 'onboarding') { stop(); document.body.classList.add('ob-over'); swap(); timer = setInterval(swap, 5200); }
    else { stop(); document.body.classList.remove('ob-over'); }
  });
  new ResizeObserver(() => { if (cur) place(cur); }).observe(obView);
  if (window.__ml?.view === 'onboarding') { document.body.classList.add('ob-over'); swap(); timer = setInterval(swap, 5200); }
}
