/* ═══════════════════════════════════════════
   SH2 LINES — three additive drivers (styles live
   in css/sh2-theme.css):
   (1) initParallaxLines — thin accent hairlines
       injected into [data-lines] sections, each
       drifting at its own speed on scroll.
   (2) initThemeStrip — slim fixed right-edge
       indicator of the page's light/dark polarity
       rhythm (decorative, hidden on mobile).
   (3) initHudMobile — keeps the .color-hud usable
       as a horizontal bottom-left strip under
       900px (horizontal drag remap + arrow keys)
       and stamps data-label mono tooltips on dots.
   All inits self-guard and take no args.
   ═══════════════════════════════════════════ */

import { getSectionProgress } from './scroll-parallax.js';
import { prefersReducedMotion } from './env.js';

/* small deterministic pseudo-random so line layouts
   are stable across loads (no Math.random flicker) */
const seeded = (a, b) => ((a * 2654435761 + b * 40503) >>> 8) % 1000 / 1000;

/* ── (1) parallax hairlines ── */
export function initParallaxLines() {
  let hosts = [...document.querySelectorAll('[data-lines]')];
  if (!hosts.length) {
    // no section opted in yet — dress a few existing chapters
    hosts = ['#statement-1', '#about', '#university', '#systems']
      .map((s) => document.querySelector(s))
      .filter(Boolean);
    hosts.forEach((h) => h.setAttribute('data-lines', ''));
  }
  if (!hosts.length) return;

  const items = [];
  hosts.forEach((sec, si) => {
    if (sec.querySelector(':scope > .sh2-lines')) return; // idempotent
    const wrap = document.createElement('div');
    wrap.className = 'sh2-lines';
    wrap.setAttribute('aria-hidden', 'true');
    const n = 2 + Math.floor(seeded(si + 1, 7) * 3); // 2..4 lines
    for (let i = 0; i < n; i++) {
      const line = document.createElement('div');
      line.className = 'sh2-line' + (i % 2 ? ' sh2-line--warm' : '');
      line.style.top = (10 + seeded(si + 3, i + 1) * 76).toFixed(1) + '%';
      line.style.setProperty(
        '--sh2-rot',
        ((seeded(si + 5, i + 2) - 0.5) * 4).toFixed(2) + 'deg'
      );
      line.style.opacity = (0.35 + seeded(si + 9, i + 4) * 0.4).toFixed(2);
      wrap.appendChild(line);
      items.push({
        el: line,
        sec,
        speed: (i % 2 ? -1 : 1) * (40 + seeded(si + 11, i + 6) * 70),
      });
    }
    if (getComputedStyle(sec).position === 'static') {
      sec.style.position = 'relative';
    }
    sec.appendChild(wrap);
  });
  if (!items.length) return;
  if (prefersReducedMotion()) return; // lines stay as static decoration

  // only drive lines whose section is (near) on screen
  const visible = new Set();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) =>
        e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)
      );
    },
    { rootMargin: '15% 0px' }
  );
  hosts.forEach((h) => io.observe(h));

  let ticking = false;
  const update = () => {
    ticking = false;
    for (const it of items) {
      if (!visible.has(it.sec)) continue;
      const p = getSectionProgress(it.sec);
      const y = ((p - 0.5) * it.speed).toFixed(1);
      it.el.style.transform = `translateY(${y}px) rotate(var(--sh2-rot, 0deg))`;
    }
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
  update();
}

/* ── (2) theme strip — polarity rhythm indicator ── */
export function initThemeStrip() {
  if (document.querySelector('.theme-strip')) return;
  const sections = [
    ...document.querySelectorAll('section.section, section[data-section]'),
  ];
  if (!sections.length) return;

  const strip = document.createElement('div');
  strip.className = 'theme-strip';
  strip.setAttribute('aria-hidden', 'true');
  const segs = sections.map(() => {
    const s = document.createElement('span');
    s.className = 'theme-strip__seg';
    strip.appendChild(s);
    return s;
  });
  document.body.appendChild(strip);

  const ALWAYS_DARK =
    /section--inverted|section--violet-bloom|section--gradient-bn/;

  const paintPolarity = () => {
    const darkTheme = document.documentElement.dataset.theme === 'dark';
    sections.forEach((sec, i) => {
      const cls = sec.className;
      let dark;
      if (cls.includes('sec-dark')) dark = !darkTheme; // strict skins invert
      else if (cls.includes('sec-light')) dark = darkTheme;
      else if (ALWAYS_DARK.test(cls)) dark = true;
      else dark = darkTheme; // grey weave follows the theme
      segs[i].classList.toggle('theme-strip__seg--dark', dark);
    });
  };
  paintPolarity();
  document.addEventListener('leo-theme-changed', paintPolarity);

  // highlight the chapter crossing the viewport midline
  let ticking = false;
  const markActive = () => {
    ticking = false;
    const mid = window.innerHeight / 2;
    let idx = 0;
    for (let i = 0; i < sections.length; i++) {
      const r = sections[i].getBoundingClientRect();
      if (r.top <= mid) idx = i;
      else break;
    }
    segs.forEach((s, i) =>
      s.classList.toggle('theme-strip__seg--active', i === idx)
    );
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(markActive);
        ticking = true;
      }
    },
    { passive: true }
  );
  markActive();
}

/* ── (3) mobile HUD adapter ──
   Under 900px the CSS turns .color-hud into a
   horizontal bottom strip; the shipped drag code in
   sh-main.js maps clientY over a vertical track, so
   here we intercept in the CAPTURE phase (stopping
   propagation keeps the vertical handler inert) and
   remap the drag to clientX → left%. Desktop
   behaviour is untouched. Also stamps data-label on
   each dot for the mono ::after tooltips. */
export function initHudMobile() {
  const hud = document.querySelector('.color-hud');
  if (!hud) return;
  const track = hud.querySelector('.color-hud__track');
  const dots = [...hud.querySelectorAll('.color-hud__dot')];
  const reset = hud.querySelector('.color-hud__reset');
  if (!track || !dots.length) return;

  // tooltip labels from the existing aria-labels
  const FALLBACK = ['primary accent', 'secondary accent', 'soft accent'];
  dots.forEach((d, i) => {
    if (!d.dataset.label) {
      d.dataset.label = (d.getAttribute('aria-label') || FALLBACK[i] || 'accent')
        .toLowerCase();
    }
  });

  const mq = window.matchMedia('(max-width: 900px)');
  const VARS = ['--accent', '--accent-2', '--accent-soft'];
  const DEFAULT_T = [0.2, 0.5, 0.8];
  const posToColor = (t) => `hsl(${Math.round(t * 320)}, 78%, 62%)`; // parity with sh-main.js

  const apply = (dot, t) => {
    t = Math.min(1, Math.max(0, t));
    const i = parseInt(dot.dataset.dot, 10) || 0;
    const col = posToColor(t);
    dot.dataset.t = String(t);
    dot.style.left = (t * 100).toFixed(1) + '%';
    dot.style.background = col;
    document.documentElement.style.setProperty(VARS[i], col);
    dot.setAttribute('aria-valuenow', String(Math.round(t * 100)));
    dot.setAttribute('aria-valuetext', `accent ${col}`);
  };
  const tFromX = (clientX) => {
    const r = track.getBoundingClientRect();
    return r.width ? (clientX - r.left) / r.width : 0.5;
  };

  let active = null;
  hud.addEventListener(
    'pointerdown',
    (e) => {
      if (!mq.matches) return;
      const dot = e.target.closest('.color-hud__dot');
      if (!dot) return;
      e.stopPropagation(); // keep sh-main's vertical drag inert
      e.preventDefault();
      active = dot;
      try {
        dot.setPointerCapture(e.pointerId);
      } catch {
        /* capture unsupported — moves still track while over the hud */
      }
      apply(dot, tFromX(e.clientX));
    },
    true
  );
  hud.addEventListener(
    'pointermove',
    (e) => {
      if (!active || !mq.matches) return;
      e.stopPropagation();
      apply(active, tFromX(e.clientX));
    },
    true
  );
  const end = () => {
    active = null;
  };
  hud.addEventListener('pointerup', end, true);
  hud.addEventListener('pointercancel', end, true);

  // horizontal keyboard support on the strip
  hud.addEventListener(
    'keydown',
    (e) => {
      if (!mq.matches) return;
      const dot = e.target.closest('.color-hud__dot');
      if (!dot || !e.key.startsWith('Arrow')) return;
      e.stopPropagation();
      e.preventDefault();
      const i = parseInt(dot.dataset.dot, 10) || 0;
      const cur = dot.dataset.t != null ? parseFloat(dot.dataset.t) : DEFAULT_T[i];
      const dir = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 0.05 : -0.05;
      apply(dot, cur + dir);
    },
    true
  );

  // let the shipped reset clear the vars; we clear our left/state
  if (reset) {
    reset.addEventListener('click', () => {
      dots.forEach((d) => {
        d.style.removeProperty('left');
        delete d.dataset.t;
      });
    });
  }

  // returning to desktop: drop inline left so the vertical track is clean
  const onChange = (ev) => {
    if (!ev.matches) dots.forEach((d) => d.style.removeProperty('left'));
  };
  if (mq.addEventListener) mq.addEventListener('change', onChange);
  else if (mq.addListener) mq.addListener(onChange);
}
