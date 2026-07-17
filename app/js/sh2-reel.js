/* ═══════════════════════════════════════════
   SH2 REEL — short horizontal scroll-jacked strip.
   A 250vh section with a sticky viewport: the inner
   track translates X with scroll progress, lerp-smoothed.
   Mobile / coarse / reduced-motion → native swipe track
   (.reel--native, styled in sh2-toys.css).
   ═══════════════════════════════════════════ */

import { prefersReducedMotion, isCoarsePointer } from './env.js';

export function initReel() {
  const sec = document.getElementById('reel');
  if (!sec) return;
  const reel = sec.querySelector('.reel');
  const track = sec.querySelector('.reel__track');
  if (!reel || !track) return;

  // native swipe fallback: touch or reduced motion (CSS handles <860px)
  if (prefersReducedMotion() || isCoarsePointer()) {
    sec.classList.add('reel--native');
    return;
  }

  let target = 0, current = 0, raf = null, running = false;

  const measure = () => {
    const sticky = sec.querySelector('.reel__sticky');
    return Math.max(0, track.scrollWidth - (sticky ? sticky.clientWidth : window.innerWidth));
  };

  const update = () => {
    const r = reel.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    target = p * measure();
  };

  const tick = () => {
    current += (target - current) * 0.09; // lerp smoothing — Franco's mouse-delay language
    track.style.transform = `translate3d(${-current.toFixed(1)}px, 0, 0)`;
    if (running) raf = requestAnimationFrame(tick);
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });

  const io = new IntersectionObserver(([en]) => {
    running = en.isIntersecting;
    if (running) { update(); if (!raf) raf = requestAnimationFrame(tick); }
    else if (raf) { cancelAnimationFrame(raf); raf = null; }
  }, { threshold: 0 });
  io.observe(sec);
}
