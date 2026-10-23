// PORTED FROM apacheta/src/lib/scroll.ts @ copia local 2026-10-23 — DO NOT EDIT. Adapted copy lives in js/**/fp-*.js
import { useEffect, useRef, useState } from 'react';

/**
 * Progreso de scroll, portado de `scroll-parallax.js` de South Hustles.
 *
 * Un solo listener con throttle por rAF para toda la app: cada capa lee el
 * progreso ya calculado en vez de montar su propio listener de scroll (con 6
 * capas en pantalla eso son 6 handlers corriendo por cada píxel de scroll).
 */

/** 0..1 del recorrido de `el` por el viewport (0 = recién entró, 1 = está por salir). */
export function getSectionProgress(el: Element): number {
  const rect = el.getBoundingClientRect();
  const total = rect.height + window.innerHeight;
  const seen = window.innerHeight - rect.top;
  return Math.min(1, Math.max(0, seen / total));
}

type Listener = () => void;
const listeners = new Set<Listener>();
let ticking = false;
let bound = false;

function flush() {
  ticking = false;
  for (const fn of listeners) fn();
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(flush);
}

/** Suscribe una función al scroll global; devuelve la baja. */
export function onScrollFrame(fn: Listener): () => void {
  listeners.add(fn);
  if (!bound) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    bound = true;
  }
  fn();
  return () => {
    listeners.delete(fn);
    if (listeners.size === 0 && bound) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      bound = false;
    }
  };
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/**
 * Progreso de una sección como estado de React, redondeado a centésimas.
 *
 * El redondeo no es cosmético: sin él, cada píxel de scroll produce un float
 * distinto y React re-renderiza el árbol entero ~60 veces por segundo. Para
 * animar transform/opacity conviene `useSectionProgressRef`, que no re-renderiza
 * nunca; este hook es para lo que sí tiene que cambiar en el DOM (un contador,
 * un track activo).
 */
export function useSectionProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return onScrollFrame(() => {
      setProgress(Math.round(getSectionProgress(el) * 100) / 100);
    });
  }, []);

  return [ref, progress] as const;
}

/**
 * Igual que el anterior pero escribe el progreso como `--p` en el propio
 * elemento: el CSS anima con `calc(var(--p) * …)` sin que React se entere.
 */
export function useProgressVar<T extends HTMLElement>(varName = '--p') {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.setProperty(varName, '0.5');
      return;
    }
    return onScrollFrame(() => {
      el.style.setProperty(varName, getSectionProgress(el).toFixed(3));
    });
  }, [varName]);

  return ref;
}
