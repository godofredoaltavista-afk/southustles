// FP · MAIN — orquestador chico (patrón boot() de South Hustles: un archivo = un initX que se auto-protege).
// Orden: tema → bus de scroll → loader → datos + vault → chrome (nav/menú/progreso/tira) → capítulos →
// Three.js (campo + boxeador) → HUDs/cursor → modo app (router) → onboarding.
// Cada módulo opcional se importa con import() y try/catch: si falta, la página sigue (additive-only).
import * as env from './core/fp-env.js';
import { initTheme, onThemeChange, isDark, setTheme, applyViewTheme, storedTheme, followSystem } from './core/fp-theme.js';
import { onScrollFrame, getSectionProgress, getInnerProgress, scrollVelocity, kickScroll } from './core/fp-scroll-bus.js';
import { lockBodyScroll, unlockBodyScroll } from './core/fp-scroll-lock.js';
import * as store from './core/fp-store.js';
import * as M from './core/fp-model.js';
import * as planner from './core/fp-planner.js';
import { loadPublicData, seedLocalIfFirstRun } from './core/fp-data.js';
import * as ui from './ui/fp-ui.js';
import { drawLED, accentColor } from './ui/fp-led.js';
import * as ml from './features/fp-motionlab.js';
import { mountChapters } from './sections/fp-chapters.js';

console.log('[fp/main] init');

const dataSubs = new Set();

async function optional(path, fn) {
  try {
    const m = await import(path);
    return await fn(m);
  } catch (e) {
    console.warn(`[fp/main] módulo opcional ${path} no disponible:`, e.message);
    return null;
  }
}

async function boot() {
  document.documentElement.classList.remove('fp-no-js');
  initTheme();
  const loader = await optional('./ui/fp-chrome.js', (m) => m.initLoader());

  let data;
  try {
    data = await loadPublicData();
  } catch (e) {
    console.error('[fp/main] no cargó data/*.json', e);
    document.getElementById('fp-scroll').innerHTML = '<div class="fp-wrap" style="padding:120px 24px"><h2>No pude cargar los datos.</h2><p class="fp-lede">Abrí la página con un servidor (no file://). Ver docs/README.md.</p></div>';
    loader?.done?.();
    return;
  }
  loader?.step?.(0.35);
  try { await store.open(); await seedLocalIfFirstRun(); } catch (e) { console.warn('[fp/main] vault no disponible', e); }
  loader?.step?.(0.55);

  // contexto compartido para capítulos, verticales, vistas y HUDs (docs/CONTRACTS.md)
  const ctx = {
    data, store, M, planner, ui, ml,
    icon: ui.icon,
    led: { drawLED, accentColor },
    env: { ...env },
    scroll: { onScrollFrame, getSectionProgress, getInnerProgress, scrollVelocity, lockBodyScroll, unlockBodyScroll },
    theme: { onThemeChange, isDark, setTheme, applyViewTheme, storedTheme, followSystem },
    state: { profile: null, days: [], sessions: [] },
    /** Recarga perfil + días + sesiones del vault (y los deja en ctx.state). */
    async load() {
      try {
        const [profile, days, sessions] = await Promise.all([store.getProfile(), store.allDays(), store.listSessions()]);
        Object.assign(ctx.state, { profile, days, sessions });
      } catch { /* sin vault */ }
      return ctx.state;
    },
    /** fn(detail) en cada cambio de datos del vault: se llama DESPUÉS de recargar ctx.state (debounced 120 ms). */
    onData(fn) { dataSubs.add(fn); return () => dataSubs.delete(fn); },
    openApp(view = 'hoy') { location.hash = `#/${view}`; },
    closeApp() { if (location.hash.startsWith('#/')) history.pushState('', document.title, location.pathname + location.search); window.dispatchEvent(new HashChangeEvent('hashchange')); },
    /** Proxy al campo Three.js global (lo completa js/three/fp-field.js). */
    gl: { setMode() {}, setDrive() {}, ready: false },
    particleWord: async (word) => optional('./three/fp-particle-word.js', (m) => m.particleWord(word)),
    toast: ui.toast,
  };
  window.fpCtx = ctx; // para depurar en consola
  await ctx.load();
  // un solo listener: recarga el estado y recién ahí avisa a los suscriptores
  let dataTimer = null, lastDetail = null;
  document.addEventListener('fp-data-changed', (e) => {
    lastDetail = e.detail;
    clearTimeout(dataTimer);
    dataTimer = setTimeout(async () => {
      await ctx.load();
      for (const fn of dataSubs) { try { fn(lastDetail); } catch (err) { console.warn('[fp/main] onData', err); } }
    }, 120);
  });

  await optional('./ui/fp-chrome.js', (m) => m.initChromeEarly?.(ctx));
  const root = document.getElementById('fp-scroll');
  const chapters = await mountChapters(root, ctx);
  ctx.chapters = chapters;
  loader?.step?.(0.8);
  await optional('./ui/fp-chrome.js', (m) => m.initChrome(ctx, chapters));
  kickScroll();

  // capas pesadas y HUDs (no bloquean el loader más de lo necesario)
  optional('./three/fp-field.js', async (m) => { const api = await m.initField(ctx); if (api) Object.assign(ctx.gl, api, { ready: true }); });
  optional('./ui/fp-color-hud.js', (m) => m.initColorHud(ctx));
  optional('./ui/fp-hud-drive.js', (m) => m.initDriveHud(ctx));
  optional('./ui/fp-cursor.js', (m) => m.initCursor(ctx));

  await optional('./features/fp-app.js', (m) => m.initApp(ctx));
  loader?.step?.(1);
  await loader?.done?.();
  optional('./features/fp-onboarding.js', (m) => m.initOnboarding(ctx));
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
