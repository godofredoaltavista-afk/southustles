/* ═══════════════════════════════════════════
   SOUTH HUSTLES — self-contained ES module entry.
   Imports only the generic reusable design-system
   modules; implements every SH-specific behaviour
   fresh, modelled on Franco's patterns
   (IntersectionObserver, rAF-throttled scroll, spring lerp).
   ═══════════════════════════════════════════ */

import { initTheme } from './theme.js';
import { initReveal } from './reveal.js';
import { initLoader, initHeroTypewriter } from './intro.js';
import { initMarquees } from './marquee.js';
import { applyHoloTilt } from './holo-tilt.js';
import { initParallaxLayers, getSectionProgress } from './scroll-parallax.js';
import { fxEnabled, prefersReducedMotion, isCoarsePointer } from './env.js';

/* ── (a) navDetach — .is-detached on .site-nav after scrollY > 40 ── */
function initNavDetach() {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;
  let ticking = false;
  const update = () => {
    nav.classList.toggle('is-detached', window.scrollY > 40);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/* ── (b) hamburger full-screen overlay — modal with focus trap ── */
function initMenuOverlay() {
  const overlay = document.getElementById('menu-overlay');
  if (!overlay) return;
  const openers = document.querySelectorAll('[data-menu-open]');
  const closers = overlay.querySelectorAll('[data-menu-close]');
  const closeBtn = overlay.querySelector('.menu-overlay__close');
  let lastFocused = null;

  const focusables = () =>
    [...overlay.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter((el) => el.offsetParent !== null);

  const open = () => {
    lastFocused = document.activeElement;
    overlay.classList.add('is-open');
    document.body.classList.add('menu-open');
    overlay.setAttribute('aria-hidden', 'false');
    openers.forEach((b) => b.setAttribute('aria-expanded', 'true'));
    (closeBtn || focusables()[0])?.focus();
  };
  const close = () => {
    overlay.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    overlay.setAttribute('aria-hidden', 'true');
    openers.forEach((b) => b.setAttribute('aria-expanded', 'false'));
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  };
  const toggle = () => (overlay.classList.contains('is-open') ? close() : open());

  openers.forEach((b) => b.addEventListener('click', toggle));
  closers.forEach((b) => b.addEventListener('click', close));
  // clicking a giant link navigates then closes
  overlay.querySelectorAll('.menu-overlay__link').forEach((l) =>
    l.addEventListener('click', close)
  );
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('is-open')) return;
    if (e.key === 'Escape') { close(); return; }
    // focus trap: cycle Tab within the overlay
    if (e.key === 'Tab') {
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  });
}

/* ── (c) custom theme toggle ──
   Clean path: reuse theme.js's initTheme() — it already wires any
   element with class .theme-toggle (click flips + persists under its
   own key). Our toggle IS .theme-toggle with a custom design, so we
   just let initTheme() bind it. We additionally mirror the choice to
   the 'sh-theme' key (spec contract) so the <head> no-flash snippet
   can read it, without touching theme.js. */
function initThemeMirror() {
  const mirror = () => {
    try { localStorage.setItem('sh-theme', document.documentElement.dataset.theme || 'light'); } catch {}
  };
  mirror(); // sync whatever the no-flash snippet chose
  document.addEventListener('leo-theme-changed', mirror);
}

/* ── (d) ecosystem cards colour-invert-from-cursor ──
   JS only feeds --cx/--cy (%) and --r (grow radius); CSS paints the
   radial invert + reveals the PNG placeholder art. */
function initEcoCards() {
  const cards = document.querySelectorAll('.eco-card');
  cards.forEach((card) => {
    let raf = null;
    const setVars = (x, y, r) => {
      card.style.setProperty('--cx', x + '%');
      card.style.setProperty('--cy', y + '%');
      card.style.setProperty('--r', r + '%');
    };
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      if (raf) return;
      raf = requestAnimationFrame(() => { setVars(x, y, 150); raf = null; });
    });
    card.addEventListener('pointerenter', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setVars(x, y, 150);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--r', '0%');
    });
  });
}

/* ── (e) projects rows: DISCOVER NOW btn + shared preview layer follows row ── */
function initProjects() {
  const list = document.querySelector('.projects-list');
  if (!list) return;
  const preview = list.querySelector('.projects-preview');
  const rows = list.querySelectorAll('.project-row');
  let raf = null, tx = 0, ty = 0, cx = 0, cy = 0, active = false;

  const spring = () => {
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    if (preview) preview.style.left = cx + 'px';
    if (preview) preview.style.top = cy + 'px';
    if (Math.abs(tx - cx) > 0.3 || Math.abs(ty - cy) > 0.3) {
      raf = requestAnimationFrame(spring);
    } else { raf = null; }
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(spring); };

  rows.forEach((row) => {
    row.addEventListener('pointerenter', () => {
      if (preview) {
        const label = row.dataset.preview || 'PREVIEW';
        const span = preview.querySelector('span');
        if (span) span.textContent = label;
        preview.classList.add('is-visible');
      }
      active = true;
    });
    row.addEventListener('pointermove', (e) => {
      const lr = list.getBoundingClientRect();
      tx = e.clientX - lr.left;
      ty = e.clientY - lr.top;
      if (!active) return;
      kick();
    });
    row.addEventListener('pointerleave', () => {
      active = false;
      if (preview) preview.classList.remove('is-visible');
    });
  });
}

/* ── (f) marquee menu icon-follow with lerp smoothing ── */
function initMarqueeMenuFollow() {
  const menus = document.querySelectorAll('.mq-menu');
  if (!menus.length) return;
  const follow = document.querySelector('.mq-follow');
  if (!follow) return;

  let tx = 0, ty = 0, cx = 0, cy = 0, raf = null, on = false;
  const tick = () => {
    cx += (tx - cx) * 0.16;
    cy += (ty - cy) * 0.16;
    follow.style.left = cx + 'px';
    follow.style.top = cy + 'px';
    if (on || Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4) {
      raf = requestAnimationFrame(tick);
    } else { raf = null; }
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

  menus.forEach((menu) => {
    menu.querySelectorAll('.mq-menu__word').forEach((word) => {
      word.addEventListener('pointerenter', () => {
        on = true;
        const span = follow.querySelector('span');
        if (span) span.textContent = word.dataset.icon || word.textContent.slice(0, 3);
        follow.classList.add('is-on');
        kick();
      });
      word.addEventListener('pointermove', (e) => {
        tx = e.clientX;
        ty = e.clientY - 60; // ABOVE the letters
        kick();
      });
      word.addEventListener('pointerleave', () => {
        on = false;
        follow.classList.remove('is-on');
      });
    });
  });
}

/* ── (g) perspective (Star-Wars) text: slight scroll tilt via getSectionProgress ── */
function initPerspective() {
  if (prefersReducedMotion() || isCoarsePointer()) return;
  const stage = document.querySelector('.perspective-sec');
  const text = document.querySelector('.perspective-text');
  if (!stage || !text) return;
  let ticking = false;
  const update = () => {
    const p = getSectionProgress(stage);      // 0..1
    const tilt = 26 + (1 - p) * 22;            // steeper on entry, flatter as it passes
    // add a receding translateZ so the crawl actually pulls back (fidelity fix)
    const z = -60 - (1 - p) * 120;
    text.style.transform = `rotateX(${tilt.toFixed(2)}deg) translateZ(${z.toFixed(0)}px)`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/* ── (h) colour HUD: 3 draggable dots rewrite --accent/--accent-2/--accent-soft ── */
function initColorHud() {
  const hud = document.querySelector('.color-hud');
  if (!hud) return;
  const track = hud.querySelector('.color-hud__track');
  const dots = hud.querySelectorAll('.color-hud__dot');
  const reset = hud.querySelector('.color-hud__reset');
  if (!track || !dots.length) return;
  const VARS = ['--accent', '--accent-2', '--accent-soft'];

  // map 0..1 vertical position → hue on a full wheel
  const posToColor = (t) => `hsl(${Math.round(t * 320)}, 78%, 62%)`;

  const apply = (dot, t) => {
    t = Math.min(1, Math.max(0, t));
    dot.style.top = (t * 100) + '%';
    const i = parseInt(dot.dataset.dot, 10);
    const col = posToColor(t);
    document.documentElement.style.setProperty(VARS[i], col);
    dot.style.background = col;
    // a11y: announce the slider value + resulting colour
    dot.setAttribute('aria-valuenow', String(Math.round(t * 100)));
    dot.setAttribute('aria-valuetext', `accent ${col}`);
  };

  dots.forEach((dot) => {
    let dragging = false;
    const rectOf = () => track.getBoundingClientRect();
    const move = (clientY) => {
      const r = rectOf();
      apply(dot, (clientY - r.top) / r.height);
    };
    dot.addEventListener('pointerdown', (e) => {
      dragging = true;
      dot.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    dot.addEventListener('pointermove', (e) => { if (dragging) move(e.clientY); });
    dot.addEventListener('pointerup', () => { dragging = false; });
    dot.addEventListener('keydown', (e) => {
      const cur = parseFloat(dot.style.top) / 100 || 0.5;
      if (e.key === 'ArrowUp') { apply(dot, cur - 0.05); e.preventDefault(); }
      if (e.key === 'ArrowDown') { apply(dot, cur + 0.05); e.preventDefault(); }
    });
  });

  if (reset) {
    reset.addEventListener('click', () => {
      dots.forEach((dot) => {
        const i = parseInt(dot.dataset.dot, 10);
        document.documentElement.style.removeProperty(VARS[i]);
        dot.style.removeProperty('background');
        dot.style.top = [20, 50, 80][i] + '%';
        dot.setAttribute('aria-valuenow', String([20, 50, 80][i]));
        dot.removeAttribute('aria-valuetext');
      });
    });
  }
}

/* ── font-swap driver: [data-swap] words toggle .is-mono in a loop
   once revealed (statement-2 "GENERATIVE VISUALS" swaps grotesk↔mono) ── */
function initFontSwap() {
  const els = document.querySelectorAll('[data-swap]');
  if (!els.length || prefersReducedMotion()) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const el = e.target;
      if (e.isIntersecting) {
        if (el._swapTimer) return;
        el._swapTimer = setInterval(() => el.classList.toggle('is-mono'), 2200);
      } else if (el._swapTimer) {
        clearInterval(el._swapTimer); el._swapTimer = null;
        el.classList.remove('is-mono');
      }
    });
  }, { threshold: 0.4 });
  els.forEach((el) => io.observe(el));
}

/* ── holo teaser cards: apply spring tilt (reused holo-tilt.js) ── */
function initHoloTeasers() {
  if (!fxEnabled()) return;
  document.querySelectorAll('.holo-card').forEach((c) => applyHoloTilt(c));
}

/* ── boot ── */
function boot() {
  // theme + reveal + loader first
  initTheme();
  initThemeMirror();
  initReveal();
  initLoader();
  // initHeroTypewriter(); — replaced by sh2-fx initTypewriter2 (SH phrases, faster)

  // rhythm / reused FX
  initMarquees();
  initParallaxLayers();

  // SH interactions
  initNavDetach();
  initMenuOverlay();
  initColorHud();
  initPerspective();
  // initFontSwap(); — replaced by sh2-fx initFontSwap2 (1.1s rhythm)

  // pointer-FX guarded
  if (fxEnabled()) {
    initEcoCards();
    initProjects();
    initMarqueeMenuFollow();
    initHoloTeasers();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
