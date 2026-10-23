// FP · THEME — port de southustles/app/js/theme.js + tema por vista de motion-lab/app/js/ui/theme.js.
// El snippet inline del <head> ya fijó data-theme antes del primer paint (no-flash).
// setTheme hace el wipe circular con View Transitions desde el botón (o desde un punto),
// actualiza <meta theme-color>, aria-label y dispara 'fp-theme-changed' (los canvas recolorean en vivo).
import { prefersReducedMotion } from './fp-env.js';

console.log('[fp/theme] init');

const KEY = 'fp.theme';

/** Tema elegido a mano por el usuario (o null si sigue al sistema). */
export function storedTheme() {
  try {
    const t = localStorage.getItem(KEY);
    return t === 'dark' || t === 'light' ? t : null;
  } catch { return null; }
}

const systemTheme = () => (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
export const currentTheme = () => document.documentElement.dataset.theme || 'light';
export const isDark = () => currentTheme() === 'dark';

/**
 * @param {'light'|'dark'} next
 * @param {{ persist?: boolean, from?: Element|{x:number,y:number} }} opts
 */
export function setTheme(next, { persist = true, from = null } = {}) {
  const root = document.documentElement;
  const changed = root.dataset.theme !== next;
  const apply = () => {
    root.dataset.theme = next;
    if (persist) { try { localStorage.setItem(KEY, next); } catch { /* */ } }
  };

  if (changed && document.startViewTransition && !prefersReducedMotion()) {
    let x = window.innerWidth - 60, y = 36;
    const src = from || document.querySelector('.fp-theme-toggle');
    if (src && src.getBoundingClientRect) {
      const r = src.getBoundingClientRect();
      if (r.width) { x = r.left + r.width / 2; y = r.top + r.height / 2; }
    } else if (src && typeof src.x === 'number') { x = src.x; y = src.y; }
    root.style.setProperty('--fp-wipe-x', `${x}px`);
    root.style.setProperty('--fp-wipe-y', `${y}px`);
    document.startViewTransition(apply);
  } else {
    if (changed) root.classList.add('fp-theme-anim');
    apply();
    setTimeout(() => root.classList.remove('fp-theme-anim'), 420);
  }

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = next === 'dark' ? '#0a0a0a' : '#e6e6e6';
  document.querySelectorAll('.fp-theme-toggle').forEach((b) => {
    b.setAttribute('aria-label', next === 'dark' ? 'Pasar a modo claro' : 'Pasar a modo oscuro');
    b.setAttribute('aria-pressed', String(next === 'dark'));
  });
  if (changed) document.dispatchEvent(new CustomEvent('fp-theme-changed', { detail: { theme: next, isDark: next === 'dark' } }));
}

/** Vuelve a seguir al sistema (borra la elección manual). */
export function followSystem() {
  try { localStorage.removeItem(KEY); } catch { /* */ }
  setTheme(systemTheme(), { persist: false });
}

/**
 * Tema por vista (Motion Lab VIEW_THEME): solo se aplica si el usuario nunca eligió a mano.
 * El toggle manual SIEMPRE manda sobre el default de la vista.
 */
export function applyViewTheme(theme, from) {
  if (storedTheme()) return;
  setTheme(theme || systemTheme(), { persist: false, from });
}

/** fn({theme,isDark}) ahora y en cada cambio. */
export function onThemeChange(fn, now = true) {
  document.addEventListener('fp-theme-changed', (e) => fn(e.detail));
  if (now) fn({ theme: currentTheme(), isDark: isDark() });
}

export function initTheme() {
  setTheme(currentTheme(), { persist: false });
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.fp-theme-toggle');
    if (!btn) return;
    setTheme(isDark() ? 'light' : 'dark', { from: btn });
  });
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!storedTheme()) setTheme(e.matches ? 'dark' : 'light', { persist: false });
    });
  }
}
