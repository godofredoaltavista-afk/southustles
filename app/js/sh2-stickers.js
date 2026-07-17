/* ═══════════════════════════════════════════
   SH2 STICKERS — the sticker room. Real la-caravana
   PNGs bounce DVD-style inside .sticker-stage walls,
   the cursor repels them, and you can grab & throw
   them (release momentum). Franco's toys language.
   ═══════════════════════════════════════════ */

import { prefersReducedMotion } from './env.js';

export function initStickers() {
  const stage = document.querySelector('[data-sticker-stage]');
  if (!stage) return;
  const imgs = [...stage.querySelectorAll('.sticker')];
  if (!imgs.length) return;

  const bodies = imgs.map((el, i) => {
    const size = parseFloat(el.dataset.size) || 110;
    el.style.setProperty('--s', size + 'px');
    return {
      el, size,
      x: 0, y: 0,
      vx: (Math.random() - 0.5) * 2.2,
      vy: (Math.random() - 0.5) * 2.2,
      rot: parseFloat(el.dataset.rot) || (Math.random() - 0.5) * 24,
      vr: (Math.random() - 0.5) * 0.4,
      grabbed: false,
      // last pointer samples while grabbed → throw velocity
      px: 0, py: 0, pvx: 0, pvy: 0,
    };
  });

  // scatter initial positions once the stage has a size
  const scatter = () => {
    const r = stage.getBoundingClientRect();
    bodies.forEach((b) => {
      b.x = Math.random() * Math.max(1, r.width - b.size);
      b.y = Math.random() * Math.max(1, r.height - b.size);
      paint(b);
    });
  };
  const paint = (b) => {
    b.el.style.transform = `translate(${b.x}px, ${b.y}px) rotate(${b.rot}deg)`;
  };

  scatter();

  // static scatter only under reduced motion
  if (prefersReducedMotion()) return;

  const mouse = { x: -9999, y: -9999, inside: false };
  stage.addEventListener('pointermove', (e) => {
    const r = stage.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
    mouse.inside = true;
  }, { passive: true });
  stage.addEventListener('pointerleave', () => { mouse.inside = false; });

  // grab & throw
  bodies.forEach((b) => {
    b.el.addEventListener('pointerdown', (e) => {
      b.grabbed = true;
      b.el.classList.add('is-grabbed');
      b.el.setPointerCapture(e.pointerId);
      const r = stage.getBoundingClientRect();
      b.px = e.clientX - r.left;
      b.py = e.clientY - r.top;
      b.pvx = 0; b.pvy = 0;
      e.preventDefault();
    });
    b.el.addEventListener('pointermove', (e) => {
      if (!b.grabbed) return;
      const r = stage.getBoundingClientRect();
      const nx = e.clientX - r.left;
      const ny = e.clientY - r.top;
      b.pvx = nx - b.px;
      b.pvy = ny - b.py;
      b.x += b.pvx;
      b.y += b.pvy;
      b.px = nx; b.py = ny;
    });
    const release = () => {
      if (!b.grabbed) return;
      b.grabbed = false;
      b.el.classList.remove('is-grabbed');
      // throw with the last drag velocity (clamped)
      b.vx = Math.max(-14, Math.min(14, b.pvx));
      b.vy = Math.max(-14, Math.min(14, b.pvy));
      b.vr = b.vx * 0.15;
    };
    b.el.addEventListener('pointerup', release);
    b.el.addEventListener('pointercancel', release);
  });

  const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const REPEL_R = 120, REPEL_F = 0.9;

  let raf = null;
  const step = () => {
    const r = stage.getBoundingClientRect();
    bodies.forEach((b) => {
      if (b.grabbed) {
        // clamp inside walls while dragging
        b.x = Math.max(0, Math.min(r.width - b.size, b.x));
        b.y = Math.max(0, Math.min(r.height - b.size, b.y));
        paint(b);
        return;
      }
      // cursor repulsion (mouse only)
      if (!coarse && mouse.inside) {
        const cx = b.x + b.size / 2, cy = b.y + b.size / 2;
        const dx = cx - mouse.x, dy = cy - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < REPEL_R && d > 1) {
          const f = ((REPEL_R - d) / REPEL_R) * REPEL_F;
          b.vx += (dx / d) * f;
          b.vy += (dy / d) * f;
        }
      }
      b.x += b.vx;
      b.y += b.vy;
      b.rot += b.vr;
      // DVD bounce on the walls, tiny energy loss
      const maxX = r.width - b.size, maxY = r.height - b.size;
      if (b.x <= 0) { b.x = 0; b.vx = Math.abs(b.vx) * 0.92; b.vr = -b.vr; }
      if (b.x >= maxX) { b.x = maxX; b.vx = -Math.abs(b.vx) * 0.92; b.vr = -b.vr; }
      if (b.y <= 0) { b.y = 0; b.vy = Math.abs(b.vy) * 0.92; }
      if (b.y >= maxY) { b.y = maxY; b.vy = -Math.abs(b.vy) * 0.92; }
      // drift damping toward a cruising speed
      b.vx *= 0.995; b.vy *= 0.995; b.vr *= 0.985;
      // never fully stall — keep the room alive
      if (Math.abs(b.vx) + Math.abs(b.vy) < 0.35) {
        b.vx += (Math.random() - 0.5) * 0.3;
        b.vy += (Math.random() - 0.5) * 0.3;
      }
      paint(b);
    });
    raf = requestAnimationFrame(step);
  };

  // run only while the room is on screen
  const io = new IntersectionObserver(([en]) => {
    if (en.isIntersecting) { if (!raf) raf = requestAnimationFrame(step); }
    else if (raf) { cancelAnimationFrame(raf); raf = null; }
  }, { threshold: 0.05 });
  io.observe(stage);

  window.addEventListener('resize', () => {
    const r = stage.getBoundingClientRect();
    bodies.forEach((b) => {
      b.x = Math.min(b.x, Math.max(0, r.width - b.size));
      b.y = Math.min(b.y, Math.max(0, r.height - b.size));
    });
  }, { passive: true });
}
