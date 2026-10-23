// FP · SCROLL LOCK — copia casi literal de southustles/app/js/scroll-lock.js.
// Contador de referencias (overlays anidados comparten un lock) + position:fixed con scrollY guardado.
// Incluye el truco de scroll-behavior:auto al soltar (bug real: animaba desde arriba al cerrar).
console.log('[fp/scroll-lock] init');

let savedY = 0;
let lockCount = 0;

export function lockBodyScroll() {
  if (lockCount++ > 0) return;
  savedY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${savedY}px`;
  document.body.style.width = '100%';
}

export function unlockBodyScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) return;
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  const root = document.documentElement;
  const prev = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  window.scrollTo(0, savedY);
  root.style.scrollBehavior = prev;
}

export const isScrollLocked = () => lockCount > 0;
