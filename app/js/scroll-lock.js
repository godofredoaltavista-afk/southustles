/* ═══════════════════════════════════════════
   SCROLL LOCK — shared body-scroll lock for every overlay
   (menu, quick panel, reader, in-site pages, holo flip).
   `body.menu-open/.quick-panel-open { overflow: hidden }`
   alone doesn't stop background scroll on iOS Safari touch —
   this adds the position:fixed + saved-scrollY technique the
   CSS comment already promised. Reference-counted so nested
   opens (e.g. reader opened from inside the menu) share one
   lock and only release on the last close.
   ═══════════════════════════════════════════ */

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
  // Restore INSTANTLY. While locked, body was position:fixed so the window
  // scroll sat at 0; `html { scroll-behavior: smooth }` (base.css) would make
  // a plain scrollTo(savedY) *animate* from the top down to where you were —
  // that's the "scrolls from the top on every overlay close" glitch. Force
  // auto for the one restore call, then hand smooth scrolling back.
  const root = document.documentElement;
  const prevBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  window.scrollTo(0, savedY);
  root.style.scrollBehavior = prevBehavior;
}
