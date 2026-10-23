// PORTED FROM apacheta/src/app/MenuOverlay.tsx @ copia local 2026-10-23 — DO NOT EDIT. Adapted copy lives in js/**/fp-*.js
import { useEffect, useRef, type ReactNode } from 'react';
import { TABS } from './tabs';
import { useDirfill } from '@/ui/primitives';
import { StoneBalance } from '@/ui/StoneBalance';
import { playClick } from '@/lib/sound';
import type { HudMode } from '@/hud/types';

/**
 * El Menú a pantalla completa — puerto del `#menu-overlay` de South Hustles:
 * se abre en un círculo que crece desde el botón, los links grandes entran
 * escalonados y cada uno se rellena desde el borde por donde entra el mouse.
 * Arriba lo que más se usa (el Navigation HUD y las pantallas clave), al
 * costado todas las secciones, abajo tus piedritas y las redes.
 */

/** Instagram (u otra red) de Apacheta: se muestra sólo si está configurado. */
const SOCIAL_URL = (import.meta.env.VITE_APACHETA_INSTAGRAM as string | undefined) ?? '';

const MAIN: { label: ReactNode; hud?: HudMode; tab?: string }[] = [
  { label: 'Inicio', hud: 'sections' },
  { label: 'Perfiles', hud: 'profiles' },
  { label: <em>Cielo</em>, hud: 'sky' },
  { label: 'Oráculo', tab: 'oraculo' },
  { label: 'Hoy', tab: 'hoy' },
];

function MenuLink({ index, children, onClick, big = false }: { index: number; children: ReactNode; onClick: () => void; big?: boolean }) {
  const dir = useDirfill<HTMLButtonElement>();
  return (
    <button
      type="button"
      className={`menu-overlay__link dirfill ${big ? 'is-big' : ''}`}
      style={{ transitionDelay: `${0.08 + index * 0.05}s` }}
      onClick={onClick}
      {...dir}
    >
      {children} <span>{String(index + 1).padStart(2, '0')}</span>
    </button>
  );
}

export function MenuOverlay({
  open,
  onClose,
  onTab,
  onHud,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  onTab: (id: string) => void;
  onHud: (mode: HudMode) => void;
  onLogout: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.documentElement.classList.add('is-menu-open');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('is-menu-open');
    };
  }, [open, onClose]);

  const go = (fn: () => void) => () => {
    playClick();
    onClose();
    fn();
  };

  return (
    <div className={`menu-overlay ${open ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Menú de Apacheta" aria-hidden={!open} inert={!open}>
      <button ref={closeRef} type="button" className="menu-overlay__close" onClick={onClose}>
        Cerrar <span aria-hidden="true">✕</span>
      </button>

      <div className="menu-overlay__grid">
        <nav className="menu-overlay__nav" aria-label="Principal">
          {MAIN.map((item, i) => (
            <MenuLink key={i} index={i} big onClick={go(() => (item.hud ? onHud(item.hud) : onTab(item.tab as string)))}>
              {item.label}
            </MenuLink>
          ))}
        </nav>

        <nav className="menu-overlay__all" aria-label="Todas las secciones">
          <span className="menu-overlay__kicker">Todas las secciones</span>
          {TABS.map((tab, i) => (
            <MenuLink key={tab.id} index={i} onClick={go(() => onTab(tab.id))}>
              <i aria-hidden="true">{tab.glyph}</i> {tab.label}
            </MenuLink>
          ))}
        </nav>
      </div>

      <div className="menu-overlay__foot">
        <StoneBalance onClick={go(() => onTab('billetera'))} />
        {SOCIAL_URL ? (
          <a className="menu-overlay__social" href={SOCIAL_URL} target="_blank" rel="noopener noreferrer">
            Instagram de Apacheta ↗
          </a>
        ) : null}
        <button
          type="button"
          className="menu-overlay__social"
          onClick={go(() => {
            onHud('sections');
            // El panel vive en el HUD: se abre apenas está montado.
            window.setTimeout(() => window.dispatchEvent(new Event('apacheta:personalizar')), 60);
          })}
        >
          Personalizar ↗
        </button>
        <span className="menu-overlay__tag">Apacheta · una piedra también se lee</span>
        <button type="button" className="menu-overlay__logout" onClick={go(onLogout)}>
          Salir
        </button>
      </div>
    </div>
  );
}
