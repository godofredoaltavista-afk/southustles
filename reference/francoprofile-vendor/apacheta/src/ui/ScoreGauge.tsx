// PORTED FROM apacheta/src/ui/ScoreGauge.tsx @ copia local 2026-10-23 — DO NOT EDIT. Adapted copy lives in js/**/fp-*.js
import type { CSSProperties } from 'react';
import './ScoreGauge.css';

/**
 * Aro de progreso para `score_general` (0-100) de `POST /oracle/compatibility`.
 * Conic-gradient con máscara de anillo: cero canvas, cero SVG, se tiñe solo
 * con `--signo` como el resto del arnés.
 */
export function ScoreGauge({
  value,
  size = 148,
  label = 'compatibilidad',
  className = '',
}: {
  value: number;
  size?: number;
  label?: string;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const style = {
    '--score': clamped,
    width: size,
    height: size,
  } as CSSProperties;

  return (
    <div className={`score-gauge ${className}`} style={style}>
      <div className="score-gauge__ring" aria-hidden="true" />
      <div className="score-gauge__inner">
        <span className="score-gauge__value t-display">{Math.round(clamped)}</span>
        <span className="score-gauge__label t-mono">{label}</span>
      </div>
    </div>
  );
}
