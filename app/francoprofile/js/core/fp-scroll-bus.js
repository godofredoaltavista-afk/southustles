// FP · SCROLL BUS — un solo listener de scroll para toda la página.
// Port en vanilla de apacheta/frontend/src/lib/scroll.ts (que a su vez porta scroll-parallax.js de South Hustles).
console.log('[fp/scroll-bus] init');

const listeners = new Set();
let ticking = false;
let bound = false;
let lastY = 0;
let velocity = 0;

/** 0..1 del recorrido de `el` por el viewport (0 = recién entró, 1 = está por salir). */
export function getSectionProgress(el) {
  const r = el.getBoundingClientRect();
  const total = r.height + window.innerHeight;
  const seen = window.innerHeight - r.top;
  return Math.min(1, Math.max(0, seen / total));
}

/** 0..1 de cuánto se avanzó DENTRO de un elemento alto (0 = su top toca el top del viewport). */
export function getInnerProgress(el) {
  const r = el.getBoundingClientRect();
  const span = r.height - window.innerHeight;
  if (span <= 0) return r.top <= 0 ? 1 : 0;
  return Math.min(1, Math.max(0, -r.top / span));
}

/** Velocidad de scroll suavizada (px/frame), para marquees acoplados. */
export const scrollVelocity = () => velocity;

function flush() {
  ticking = false;
  const y = window.scrollY;
  velocity = velocity * 0.8 + (y - lastY) * 0.2;
  lastY = y;
  for (const fn of listeners) {
    try { fn(y); } catch (e) { console.warn('[fp/scroll-bus]', e); }
  }
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(flush);
}

/** Suscribe una función al scroll global (rAF-throttled); devuelve la baja. */
export function onScrollFrame(fn) {
  listeners.add(fn);
  if (!bound) {
    bound = true;
    lastY = window.scrollY;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }
  requestAnimationFrame(() => fn(window.scrollY));
  return () => listeners.delete(fn);
}

/** Fuerza una pasada (p. ej. después de inyectar capítulos). */
export const kickScroll = () => onScroll();
