// FP · ENV — guards del FX (port de southustles/app/js/env.js) + utilidades chicas compartidas.
console.log('[fp/env] init');

const mq = (q) => !!window.matchMedia && window.matchMedia(q).matches;

export const isCoarsePointer = () => mq('(pointer: coarse)');
export const prefersReducedMotion = () => mq('(prefers-reduced-motion: reduce)') || document.documentElement.dataset.fpCalm === '1';
/** true cuando corren los FX de puntero (hay mouse y no hay reduced-motion). */
export const fxEnabled = () => !isCoarsePointer() && !prefersReducedMotion();
export const isMobile = () => window.innerWidth < 768;

export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
export const lerp = (a, b, t) => a + (b - a) * t;

/** localStorage solo para preferencias de UI (claves fp.*). Nunca datos personales. */
export const LS = {
  get(key, def = null) {
    try { const v = localStorage.getItem(`fp.${key}`); return v == null ? def : JSON.parse(v); } catch { return def; }
  },
  set(key, val) {
    try { localStorage.setItem(`fp.${key}`, JSON.stringify(val)); } catch { /* modo privado */ }
  },
  del(key) {
    try { localStorage.removeItem(`fp.${key}`); } catch { /* */ }
  },
};

/** Escapa texto para meterlo en HTML. */
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Números en es-AR: 62,5 · 1.500 */
export const fmt = (n, d = 1) => {
  if (n == null || Number.isNaN(+n)) return '—';
  return (+n).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: d });
};

export const uid = (p = 'id') => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

/** IntersectionObserver de una línea: fn(true/false) al entrar/salir. Devuelve el observer. */
export function onVisible(el, fn, opts = { rootMargin: '12% 0px 12% 0px', threshold: 0 }) {
  if (!el) return null;
  const io = new IntersectionObserver((entries) => entries.forEach((e) => fn(e.isIntersecting, e)), opts);
  io.observe(el);
  return io;
}

/** Lee una variable CSS calculada del documento (o de un elemento). */
export const cssVar = (name, el = document.documentElement) => getComputedStyle(el).getPropertyValue(name).trim();
