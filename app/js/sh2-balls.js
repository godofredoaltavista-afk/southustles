/* ═══════════════════════════════════════════
   SH2 BALLS — buoyant token-coloured balls floating
   up through the footer; the cursor makes nearby ones
   rise faster. Sits behind the footer text (z-index 0).
   ═══════════════════════════════════════════ */

import { prefersReducedMotion } from './env.js';

const N_BALLS = 26;

export function initFooterBalls() {
  const footer = document.querySelector('.site-footer');
  if (!footer || prefersReducedMotion()) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'footer-balls';
  canvas.setAttribute('aria-hidden', 'true');
  footer.prepend(canvas);
  const ctx = canvas.getContext('2d');

  const cs = getComputedStyle(document.documentElement);
  const readVar = (v, fb) => (cs.getPropertyValue(v) || '').trim() || fb;
  let palette = [];
  const loadPalette = () => {
    const c = getComputedStyle(document.documentElement);
    const g = (v, fb) => (c.getPropertyValue(v) || '').trim() || fb;
    palette = [
      g('--accent', '#6d5efc'),
      g('--accent-2', '#ff5a7a'),
      g('--accent-soft', '#a99bff'),
      g('--uni-red', '#e8402c'),
      g('--uni-amber', '#f4c542'),
      g('--uni-green', '#2fb872'),
      g('--uni-blue', '#4a6cf0'),
    ];
  };
  loadPalette();
  // HUD repaints + theme flips re-read the palette
  document.addEventListener('leo-theme-changed', loadPalette);
  document.addEventListener('pointerup', loadPalette, { passive: true });

  const DPR = Math.min(2, window.devicePixelRatio || 1);
  let W = 0, H = 0;
  const resize = () => {
    const r = footer.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const balls = Array.from({ length: N_BALLS }, (_, i) => ({
    x: Math.random(), // stored 0..1, scaled at draw (survives resize)
    y: Math.random(),
    r: 6 + Math.random() * 16,
    vy: 0.12 + Math.random() * 0.3,   // buoyancy — always drifting up
    wob: Math.random() * Math.PI * 2, // horizontal wander phase
    wobSp: 0.004 + Math.random() * 0.008,
    col: i % 7,
    boost: 0,
  }));

  const mouse = { x: -9999, y: -9999 };
  footer.addEventListener('pointermove', (e) => {
    const r = footer.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  }, { passive: true });
  footer.addEventListener('pointerleave', () => { mouse.x = -9999; });

  let raf = null;
  const step = () => {
    ctx.clearRect(0, 0, W, H);
    const dark = document.documentElement.dataset.theme === 'dark';
    ctx.globalAlpha = dark ? 0.72 : 0.85;
    balls.forEach((b) => {
      const px = b.x * W, py = b.y * H;
      // cursor proximity → extra lift ("que con el mouse se vayan para arriba")
      const d = Math.hypot(px - mouse.x, py - mouse.y);
      if (d < 140) b.boost = Math.min(2.4, b.boost + ((140 - d) / 140) * 0.35);
      b.boost *= 0.94; // smooth falloff
      b.wob += b.wobSp;
      b.y -= (b.vy + b.boost) / H;      // rise
      b.x += Math.sin(b.wob) * 0.0006;  // wander
      // wrap: gone over the top → re-enter from the bottom
      if (b.y * H < -b.r * 2) { b.y = 1 + (b.r * 2) / H; b.x = Math.random(); b.boost = 0; }
      if (b.x < -0.05) b.x = 1.05;
      if (b.x > 1.05) b.x = -0.05;
      ctx.beginPath();
      ctx.arc(b.x * W, b.y * H, b.r, 0, Math.PI * 2);
      ctx.fillStyle = palette[b.col] || '#6d5efc';
      ctx.fill();
    });
    raf = requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(([en]) => {
    if (en.isIntersecting) { if (!raf) raf = requestAnimationFrame(step); }
    else if (raf) { cancelAnimationFrame(raf); raf = null; }
  }, { threshold: 0.02 });
  io.observe(footer);
}
