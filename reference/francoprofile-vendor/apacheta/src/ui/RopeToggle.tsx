// PORTED FROM apacheta/src/ui/RopeToggle.tsx @ copia local 2026-10-23 — DO NOT EDIT. Adapted copy lives in js/**/fp-*.js
import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { playClick } from '@/lib/sound';
import './RopeToggle.css';

/**
 * El toggle de tema como el cordón de una lámpara: cuelga del centro de la
 * topbar con física de péndulo a mano. Un solo loop de rAF corre siempre
 * (arrastrando o no) y sólo cambia el "objetivo" al que persigue — mientras
 * se arrastra, el objetivo es el mouse (con respuesta rápida, se siente
 * conectado al dedo); al soltar, el objetivo vuelve a reposo (0) con resorte
 * flojo (`REST_STIFFNESS`/`REST_DAMPING` bajos a propósito: varias
 * oscilaciones visibles, no un frenazo). La velocidad angular es siempre la
 * derivada real cuadro a cuadro, así que soltar en pleno movimiento imprime
 * inercia de verdad — nunca "suelta desde cero".
 *
 * El ancla es el contenedor `.rope-toggle` (width/height:0, no rota nunca):
 * se lee su rect UNA sola vez al bajar el dedo. Leer el rect del propio
 * cordón en cada `pointermove` (bug anterior) devuelve el bounding box del
 * elemento YA ROTADO, no el pivote real — la referencia se corrompía apenas
 * arrancaba a girar y el arrastre se sentía invertido.
 */

const REST_LENGTH = 42;
const PULL_THRESHOLD = 34;
const MAX_LENGTH = REST_LENGTH + 64;
const MAX_ANGLE = 0.95; // rad ≈ 54° — bien suelta, no un tironcito tímido
const DRAG_RESPONSE = 0.42;
const REST_STIFFNESS = 0.075;
const REST_DAMPING = 0.9;
const LENGTH_RESPONSE = 0.18;
const SETTLE_EPS = 0.0015;

interface RopeState {
  angle: number;
  angleVel: number;
  length: number;
  targetAngle: number;
  targetLength: number;
  dragging: boolean;
  pointerId: number;
  anchorX: number;
  anchorY: number;
  raf: number;
}

export function RopeToggle({
  theme,
  onToggle,
}: {
  theme: 'light' | 'dark';
  onToggle: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cordRef = useRef<HTMLDivElement>(null);
  const state = useRef<RopeState>({
    angle: 0,
    angleVel: 0,
    length: REST_LENGTH,
    targetAngle: 0,
    targetLength: REST_LENGTH,
    dragging: false,
    pointerId: -1,
    anchorX: 0,
    anchorY: 0,
    raf: 0,
  });

  const paint = useCallback(() => {
    const el = cordRef.current;
    if (!el) return;
    const s = state.current;
    el.style.setProperty('--angle', `${((s.angle * 180) / Math.PI).toFixed(2)}deg`);
    el.style.setProperty('--length', `${s.length.toFixed(1)}px`);
  }, []);

  const tick = useCallback(() => {
    const s = state.current;

    if (s.dragging) {
      const prevAngle = s.angle;
      s.angle += (s.targetAngle - s.angle) * DRAG_RESPONSE;
      s.angleVel = s.angle - prevAngle; // velocidad real de este cuadro: si soltás en movimiento, sigue de largo.
      s.length += (s.targetLength - s.length) * LENGTH_RESPONSE;
    } else {
      s.angleVel += (0 - s.angle) * REST_STIFFNESS;
      s.angleVel *= REST_DAMPING;
      s.angle += s.angleVel;
      s.length += (REST_LENGTH - s.length) * LENGTH_RESPONSE;
    }
    paint();

    const settled =
      !s.dragging &&
      Math.abs(s.angle) < SETTLE_EPS &&
      Math.abs(s.angleVel) < SETTLE_EPS &&
      Math.abs(s.length - REST_LENGTH) < 0.05;
    if (settled) {
      s.angle = 0;
      s.angleVel = 0;
      s.length = REST_LENGTH;
      paint();
      s.raf = 0;
      return;
    }
    s.raf = requestAnimationFrame(tick);
  }, [paint]);

  const wake = useCallback(() => {
    const s = state.current;
    if (!s.raf) s.raf = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    paint();
    const s = state.current;
    return () => {
      if (s.raf) cancelAnimationFrame(s.raf);
    };
  }, [paint]);

  const onPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const s = state.current;
    // Ancla real: el contenedor de tamaño cero, nunca el cordón (que rota).
    const anchor = rootRef.current?.getBoundingClientRect();
    if (!anchor) return;
    s.anchorX = anchor.left;
    s.anchorY = anchor.top;
    s.dragging = true;
    s.pointerId = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    wake();
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const s = state.current;
    if (!s.dragging || e.pointerId !== s.pointerId) return;
    const dx = e.clientX - s.anchorX;
    const dy = Math.max(6, e.clientY - s.anchorY);
    s.targetLength = Math.min(MAX_LENGTH, Math.hypot(dx, dy));
    // atan2(-dx, dy): con transform-origin "top center", una rotación CSS
    // positiva (horaria) mueve la punta hacia la IZQUIERDA, no la derecha —
    // sin el signo invertido acá, arrastrar a la derecha giraba el cordón a
    // la izquierda (el bug original de "está invertido en los dos ejes").
    s.targetAngle = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, Math.atan2(-dx, dy)));
  };

  const onPointerUp = () => {
    const s = state.current;
    if (!s.dragging) return;
    s.dragging = false;
    const pulled = s.length - REST_LENGTH;
    if (pulled > PULL_THRESHOLD) {
      playClick();
      onToggle();
    }
    wake();
  };

  return (
    <div ref={rootRef} className="rope-toggle" aria-hidden="false">
      <div ref={cordRef} className="rope-toggle__cord">
        <button
          type="button"
          className="rope-toggle__handle"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          aria-label={
            theme === 'dark'
              ? 'Tirá del cordón para pasar a modo claro'
              : 'Tirá del cordón para pasar a modo oscuro'
          }
        >
          <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
        </button>
      </div>
    </div>
  );
}
