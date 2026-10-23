// PORTED FROM motion-lab/app/js/ui/theme.js @ copia local 2026-10-23 — DO NOT EDIT. Adapted copy lives in js/**/fp-*.js
// Tema (oscuro / claro "papel") de la app y avisos con el evento `ml-theme`.
// v3: cada pantalla entra con su tema (VIEW_THEME); el toggle cambia la pantalla actual mientras estás en ella.
// El cambio se revela en círculo desde el botón (View Transitions API) y después el wordmark se rearma en píxeles.
const LS = {
  get(k, d) { try { const v = localStorage.getItem(`ml.${k}`); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(`ml.${k}`, JSON.stringify(v)); } catch { /* sin storage */ } },
};
// el fondo quedó en un solo modo (partículas); se conserva la lista por compatibilidad
export const BACKGROUNDS = [['particles', 'Partículas'], ['grid', 'Grilla'], ['paper', 'Papel'], ['plain', 'Liso']];

/** Tema con el que entra cada pantalla. */
export const VIEW_THEME = { home: 'light', onboarding: 'light', player: 'light', studio: 'dark', sessions: 'dark', compare: 'dark' };

export const theme = {
  mode: VIEW_THEME.home,
  bg: 'particles',
  get ink() { return this.mode === 'light'; },
  apply() {
    document.documentElement.dataset.theme = this.mode;
    document.documentElement.dataset.bg = this.bg;
    document.dispatchEvent(new CustomEvent('ml-theme', { detail: { mode: this.mode, bg: this.bg } }));
  },
  setMode(m) { if (m === this.mode) return; this.mode = m; LS.set('theme', m); this.apply(); },
  toggle() { this.setMode(this.mode === 'dark' ? 'light' : 'dark'); },
  setBg(b) { this.bg = b; LS.set('bg', b); this.apply(); },
  /** Tema por pantalla, sin animación (lo tapa la transición de vista). */
  forView(view) { const m = VIEW_THEME[view]; if (m) this.setMode(m); },
  /** Cambio animado: círculo que crece desde (x, y). */
  animateTo(m, x = innerWidth - 60, y = 30) {
    if (m === this.mode) return;
    const root = document.documentElement;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.style.setProperty('--vt-x', `${x}px`);
    root.style.setProperty('--vt-y', `${y}px`);
    root.style.setProperty('--vt-r', `${r}px`);
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reducedMotion) { this.setMode(m); return; }
    root.classList.add('vt-theme');
    const tr = document.startViewTransition(() => this.setMode(m));
    tr.finished.finally(() => root.classList.remove('vt-theme'));
  },
};
export { LS };
