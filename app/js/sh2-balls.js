/* ═══════════════════════════════════════════
   SH2 BALLS — buoyant token-coloured balls floating
   up; the cursor makes nearby ones rise faster (they
   dart away — "cuando pone arriba se van tuc"). Sits
   behind its container's content (z-index 0).
   Parameterized so the same physics can drive both the
   full footer AND the small persistent footer-HUD strip
   (Franco: "3 o 4 bien chiquitas girando por el hud").
   ═══════════════════════════════════════════ */

import { prefersReducedMotion } from './env.js';

export function initFooterBalls(targetSelector = '.site-footer', canvasClass = 'footer-balls', nBalls = 26, opts = {}) {
  const { bubble = false, respawnDelayFrames = 0 } = opts;
  const footer = document.querySelector(targetSelector);
  if (!footer || prefersReducedMotion()) return;

  const canvas = document.createElement('canvas');
  canvas.className = canvasClass;
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

  const balls = Array.from({ length: nBalls }, (_, i) => ({
    x: Math.random(), // stored 0..1, scaled at draw (survives resize)
    y: Math.random(),
    r: 6 + Math.random() * 16,
    vy: 0.12 + Math.random() * 0.3,   // buoyancy — always drifting up
    wob: Math.random() * Math.PI * 2, // horizontal wander phase
    wobSp: 0.004 + Math.random() * 0.008,
    col: i % 7,
    boost: 0,
    blobSeed: Math.random() * 10,      // per-ball wobble phase (bubble mode)
    dormant: respawnDelayFrames ? Math.random() * respawnDelayFrames : 0, // stagger the first wave
  }));
  let tClock = 0;

  // window-level (not footer-scoped): the HUD-strip variant renders its
  // canvas with pointer-events:none so it never blocks clicks on the page
  // beneath it, which means it can never receive its own pointer events —
  // tracking on window and converting to local coords works for both.
  const mouse = { x: -9999, y: -9999 };
  window.addEventListener('pointermove', (e) => {
    const r = footer.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  }, { passive: true });

  let raf = null;
  const step = () => {
    ctx.clearRect(0, 0, W, H);
    const dark = document.documentElement.dataset.theme === 'dark';
    ctx.globalAlpha = dark ? 0.72 : 0.85;
    tClock += 0.02;
    balls.forEach((b) => {
      // dormant balls (respawnDelayFrames mode) sit out a stretch before
      // re-entering — "que se spawneen con menos frecuencia" instead of
      // an instant, constant wrap-around.
      if (b.dormant > 0) { b.dormant--; return; }
      const px = b.x * W, py = b.y * H;
      // cursor proximity → extra lift ("que con el mouse se vayan para arriba")
      const d = Math.hypot(px - mouse.x, py - mouse.y);
      if (d < 140) b.boost = Math.min(2.4, b.boost + ((140 - d) / 140) * 0.35);
      b.boost *= 0.94; // smooth falloff
      b.wob += b.wobSp;
      b.y -= (b.vy + b.boost) / H;      // rise
      b.x += Math.sin(b.wob) * 0.0006;  // wander
      // wrap: gone over the top → re-enter from the bottom (or go dormant first)
      if (b.y * H < -b.r * 2) {
        b.y = 1 + (b.r * 2) / H; b.x = Math.random(); b.boost = 0;
        if (respawnDelayFrames) b.dormant = respawnDelayFrames * (0.6 + Math.random() * 0.8);
      }
      if (b.x < -0.05) b.x = 1.05;
      if (b.x > 1.05) b.x = -0.05;
      ctx.fillStyle = palette[b.col] || '#6d5efc';
      if (bubble) {
        // irregular blob outline instead of a perfect circle — a gentle,
        // ever-so-slightly breathing wobble, not a perfect disc
        const N = 7;
        ctx.beginPath();
        for (let i = 0; i <= N; i++) {
          const a = (i / N) * Math.PI * 2;
          const wob = 1 + 0.22 * Math.sin(a * 3 + b.blobSeed + tClock);
          const bx = px + Math.cos(a) * b.r * wob;
          const by = py + Math.sin(a) * b.r * wob;
          if (i === 0) ctx.moveTo(bx, by); else ctx.lineTo(bx, by);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(px, py, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    raf = requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(([en]) => {
    if (en.isIntersecting) { if (!raf) raf = requestAnimationFrame(step); }
    else if (raf) { cancelAnimationFrame(raf); raf = null; }
  }, { threshold: 0.02 });
  io.observe(footer);
}
