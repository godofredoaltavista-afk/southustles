/* ═══════════════════════════════════════════
   SH2 CASE — the case-study scroll traveler.
   A sticky visual rides the whole chapter: as you
   scroll it drifts across the page (left↔right),
   scales, and tilts — the "gif que se mueve a medida
   que scrolleás" until the real CF asset lands.
   ═══════════════════════════════════════════ */

import { prefersReducedMotion, isCoarsePointer } from './env.js';
import { getSectionProgress } from './scroll-parallax.js';

export function initCaseTraveler() {
  const sec = document.getElementById('case-study');
  const traveler = sec?.querySelector('[data-case-traveler]');
  if (!sec || !traveler) return;
  if (prefersReducedMotion()) { traveler.classList.add('is-static'); return; }

  const coarse = isCoarsePointer();
  let current = 0, target = 0, raf = null, running = false;

  // waypoints across the chapter: [progress, x vw, y vh, scale, rotate]
  // — at ~0.55 the asset takes over the FULL SCREEN and the takeover
  //   text appears on top (Franco: "que ocupe todo el fondo y justo
  //   en ese momento aparece un texto").
  const WAY = [
    [0.00,  30,  6, 0.9,  -4],
    [0.16, -32, 10, 0.75,  5],
    [0.34,  30, 12, 0.9,  -6],
    [0.48,   0, 10, 2.2,   0],
    [0.56,   0,  6, 5.4,   0],   // ← full-screen takeover
    [0.64,   0, 10, 2.0,   0],
    [0.80, -30, 10, 0.8,   7],
    [1.00,  32,  4, 0.65, -3],
  ];
  const FULL_IN = 0.50, FULL_OUT = 0.63;

  // takeover text injected over the full-screen moment
  const moment = document.createElement('div');
  moment.className = 'case__fullmoment';
  moment.setAttribute('aria-hidden', 'true');
  moment.innerHTML = `
    <p class="case__fullmoment-kicker">FIG.0X — FULL BLEED</p>
    <p class="case__fullmoment-big">THE SYSTEM<br/>TAKES THE <em>stage</em></p>`;
  sec.appendChild(moment);

  const lerp = (a, b, t) => a + (b - a) * t;
  const sample = (p) => {
    let i = 0;
    while (i < WAY.length - 2 && WAY[i + 1][0] < p) i++;
    const [p0, x0, y0, s0, r0] = WAY[i];
    const [p1, x1, y1, s1, r1] = WAY[i + 1];
    const t = Math.min(1, Math.max(0, (p - p0) / (p1 - p0 || 1)));
    // ease the segment for a floatier ride
    const e = t * t * (3 - 2 * t);
    return [lerp(x0, x1, e), lerp(y0, y1, e), lerp(s0, s1, e), lerp(r0, r1, e)];
  };

  const tick = () => {
    current += (target - current) * 0.07; // heavy smoothing — it floats, never snaps
    const [x, y, s, r] = sample(current);
    traveler.style.transform =
      `translate(calc(-50% + ${x}vw), ${y}vh) scale(${s.toFixed(3)}) rotate(${r.toFixed(1)}deg)`;
    // full-screen takeover window
    const full = current >= FULL_IN && current <= FULL_OUT;
    traveler.classList.toggle('is-full', full);
    moment.classList.toggle('is-on', full);
    sec.classList.toggle('is-taken', full);
    if (running) raf = requestAnimationFrame(tick);
  };

  const update = () => { target = getSectionProgress(sec); };
  window.addEventListener('scroll', update, { passive: true });

  const io = new IntersectionObserver(([en]) => {
    running = en.isIntersecting;
    traveler.classList.toggle('is-on', running);
    if (running) { update(); if (!raf) raf = requestAnimationFrame(tick); }
    else if (raf) { cancelAnimationFrame(raf); raf = null; }
  }, { threshold: 0 });
  io.observe(sec);

  // touch devices: smaller, gentler ride (CSS handles size; damp motion)
  if (coarse) WAY.forEach((w) => { w[1] *= 0.4; w[3] = Math.min(w[3], 0.8); });
}
