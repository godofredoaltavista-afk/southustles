// PORTED FROM apacheta/src/app/nav.ts @ copia local 2026-10-23 — DO NOT EDIT. Adapted copy lives in js/**/fp-*.js
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { TABS } from './tabs';
import type { HudMode, HudRoute } from '@/hud/types';

interface NavValue {
  go: (id: string) => void;
  active: string;
  /** Abre el Navigation HUD en una colección (y opcionalmente en un ítem). */
  openHud: (mode?: HudMode, id?: string) => void;
  hudOpen: boolean;
}

export const NavContext = createContext<NavValue>({ go: () => {}, active: 'hoy', openHud: () => {}, hudOpen: false });

export const useNav = () => useContext(NavContext);

const validTab = (id: string): boolean => TABS.some((t) => t.id === id);

function readHash(): string {
  const raw = window.location.hash.replace(/^#\/?/, '');
  return validTab(raw) ? raw : 'hoy';
}

/**
 * Pestaña activa sincronizada con el hash de la URL.
 * Así el F5 y el botón atrás del browser hacen lo que uno espera.
 */
export function useHashTab(): [string, (id: string) => void] {
  const [active, setActive] = useState(readHash);

  useEffect(() => {
    const onHashChange = () => setActive(readHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const go = useCallback((id: string) => {
    if (!validTab(id)) return;
    window.location.hash = `/${id}`;
    setActive(id);
  }, []);

  return [active, go];
}

/* ── Rutas del Navigation HUD ───────────────────────────────────────────────
   `#/hud`                       → Secciones (las 12 pantallas como piedras)
   `#/hud/secciones/<tab>`       → Secciones, centrada en una pantalla
   `#/hud/perfiles[/<id>]`       → la biblioteca de perfiles (y la ficha)
   `#/hud/cielo[/<planeta>]`     → los planetas en CDs (y la ficha)
   `#/<tab>`                     → la pantalla de siempre
   Sin hash: la portada es el HUD. */

const MODE_SLUG: Record<HudMode, string> = { sections: 'secciones', profiles: 'perfiles', sky: 'cielo' };
const SLUG_MODE: Record<string, HudMode> = { secciones: 'sections', perfiles: 'profiles', cielo: 'sky' };

export interface AppRoute {
  hud: HudRoute | null;
  /** La última pantalla (se conserva mientras el HUD está abierto). */
  tab: string;
}

function parseHash(lastTab: string): AppRoute {
  const raw = window.location.hash.replace(/^#\/?/, '');
  if (!raw) return { hud: { mode: 'sections', id: '' }, tab: lastTab };
  const parts = raw.split('/').map((p) => decodeURIComponent(p));
  if (parts[0] === 'hud') {
    const mode = SLUG_MODE[parts[1] ?? ''] ?? 'sections';
    return { hud: { mode, id: parts[2] ?? '' }, tab: lastTab };
  }
  if (validTab(parts[0])) return { hud: null, tab: parts[0] };
  return { hud: { mode: 'sections', id: '' }, tab: lastTab };
}

export const hudHash = (route: HudRoute): string =>
  `#/hud/${MODE_SLUG[route.mode]}${route.id ? `/${encodeURIComponent(route.id)}` : ''}`;

export function useHashRoute(): [AppRoute, { go: (id: string) => void; setHud: (route: HudRoute, push?: boolean) => void }] {
  const [route, setRoute] = useState<AppRoute>(() => parseHash('hoy'));

  useEffect(() => {
    const onHashChange = () => setRoute((prev) => parseHash(prev.tab));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const go = useCallback((id: string) => {
    if (!validTab(id)) return;
    window.location.hash = `/${id}`;
    setRoute({ hud: null, tab: id });
  }, []);

  const setHud = useCallback((next: HudRoute, push = false) => {
    const hash = hudHash(next);
    if (window.location.hash === hash) return;
    if (push) window.location.hash = hash.slice(1);
    else window.history.replaceState(null, '', hash);
    setRoute((prev) => ({ hud: next, tab: prev.tab }));
  }, []);

  return [route, { go, setHud }];
}

/** Perfil elegido, compartido entre Perfiles, Bodygraph, Carta y el HUD. */
const PROFILE_KEY = 'apacheta-active-profile';
const PROFILE_EVENT = 'apacheta:active-profile';

function readProfile(): string | null {
  try {
    return localStorage.getItem(PROFILE_KEY);
  } catch {
    return null;
  }
}

export function useActiveProfile(): [string | null, (id: string | null) => void] {
  const [id, setId] = useState<string | null>(readProfile);

  // Varias instancias del hook (HUD + pantalla) quedan sincronizadas.
  useEffect(() => {
    const sync = () => setId(readProfile());
    window.addEventListener(PROFILE_EVENT, sync);
    return () => window.removeEventListener(PROFILE_EVENT, sync);
  }, []);

  const select = useCallback((next: string | null) => {
    setId(next);
    try {
      if (next) localStorage.setItem(PROFILE_KEY, next);
      else localStorage.removeItem(PROFILE_KEY);
    } catch {
      /* modo privado: la selección dura lo que dure la sesión */
    }
    window.dispatchEvent(new Event(PROFILE_EVENT));
  }, []);

  return [id, select];
}
