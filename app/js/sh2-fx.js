/* ═══════════════════════════════════════════
   SH2 — INTERACTION FX UPGRADES (additive layer).
   Directional button fills, magnetic pull, faster
   typewriter v2, word rotator + font-swap v2 driver,
   nav University bookshelf, quick side-panel.
   Never edits existing modules — imports env guards
   only. Every init self-guards with null checks.
   ═══════════════════════════════════════════ */

import { fxEnabled, prefersReducedMotion } from './env.js';

/* ────────────────────────────────────────────
   1. DIRECTIONAL BUTTON FILL
   Entry-edge aware ::before ink layer (CSS does the
   painting — JS only stamps data-dir on enter/leave).
   ──────────────────────────────────────────── */

function edgeOf(e, el) {
  const r = el.getBoundingClientRect();
  if (!r.width || !r.height) return 'bottom';
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  return Math.abs(x) > Math.abs(y)
    ? (x > 0 ? 'right' : 'left')
    : (y > 0 ? 'bottom' : 'top');
}

export function initDirectionalButtons() {
  if (!fxEnabled()) return;
  const els = document.querySelectorAll('.pill-btn, .discover-btn, [data-dirfill]');
  if (!els.length) return;

  els.forEach((el) => {
    if (el.classList.contains('dirfill')) return; // idempotent
    el.classList.add('dirfill');

    el.addEventListener('pointerenter', (e) => {
      // reposition the fill layer at the entry edge WITHOUT animating the jump
      el.style.setProperty('--dirfill-t', '0s');
      el.dataset.dir = edgeOf(e, el);
      void el.offsetWidth; // reflow so ::before snaps to the new start edge
      el.style.removeProperty('--dirfill-t');
    });

    el.addEventListener('pointerleave', (e) => {
      // exit edge → the fill slides OUT toward where the cursor left
      el.dataset.dir = edgeOf(e, el);
    });
  });
}

/* ────────────────────────────────────────────
   2. MAGNETIC PULL
   [data-magnetic] elements translate toward the cursor
   within a 60px proximity ring, spring lerp (stiffness
   .12 like holo-tilt), returns to rest on leave.
   Uses the `translate` property so it never fights the
   existing CSS `transform` transitions on .pill-btn.
   ──────────────────────────────────────────── */

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export function initMagneticButtons() {
  if (!fxEnabled()) return;

  // decorate the agreed targets via JS (spec: apply data-magnetic here)
  ['.pill-btn', '.color-hud__reset', '.menu-overlay__close', '.footer__social']
    .forEach((sel) =>
      document.querySelectorAll(sel).forEach((el) => el.setAttribute('data-magnetic', ''))
    );

  const items = [...document.querySelectorAll('[data-magnetic]')].map((el) => ({
    el,
    gate: el.closest('#menu-overlay, #quick-panel'), // only magnetic while its overlay is open
    tx: 0, ty: 0, cx: 0, cy: 0, on: false,
  }));
  if (!items.length) return;

  const RADIUS = 60;      // proximity ring beyond the element's edge
  const STIFF = 0.12;     // spring lerp stiffness (holo-tilt feel)
  const PULL = 0.32;      // fraction of the center offset applied
  const MAXPULL = 12;     // px translation cap

  let raf = null;

  const tick = () => {
    let live = false;
    for (const it of items) {
      it.cx += (it.tx - it.cx) * STIFF;
      it.cy += (it.ty - it.cy) * STIFF;
      const settled =
        !it.tx && !it.ty && Math.abs(it.cx) < 0.05 && Math.abs(it.cy) < 0.05;
      if (settled) {
        if (it.on) { it.el.style.translate = ''; it.on = false; }
        it.cx = 0; it.cy = 0;
        continue;
      }
      it.on = true;
      it.el.style.translate = `${it.cx.toFixed(2)}px ${it.cy.toFixed(2)}px`;
      if (Math.abs(it.tx - it.cx) > 0.04 || Math.abs(it.ty - it.cy) > 0.04) live = true;
    }
    raf = live ? requestAnimationFrame(tick) : null;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

  window.addEventListener('pointermove', (e) => {
    const px = e.clientX, py = e.clientY;
    let any = false;
    for (const it of items) {
      if (it.gate && !it.gate.classList.contains('is-open')) { it.tx = 0; it.ty = 0; continue; }
      const r = it.el.getBoundingClientRect();
      if (!r.width) { it.tx = 0; it.ty = 0; continue; }
      // distance from pointer to the rect (0 when inside)
      const nx = clamp(px, r.left, r.right);
      const ny = clamp(py, r.top, r.bottom);
      const dist = Math.hypot(px - nx, py - ny);
      if (dist < RADIUS) {
        const mx = r.left + r.width / 2;
        const my = r.top + r.height / 2;
        const s = 1 - dist / RADIUS;
        it.tx = clamp((px - mx) * PULL * s, -MAXPULL, MAXPULL);
        it.ty = clamp((py - my) * PULL * s, -MAXPULL, MAXPULL);
        any = true;
      } else {
        it.tx = 0; it.ty = 0;
      }
    }
    if (any || raf || items.some((it) => it.on)) kick();
  }, { passive: true });
}

/* ────────────────────────────────────────────
   3. TYPEWRITER v2 — replaces the old hero rhythm
   (the orchestrator disables intro.js's version).
   Faster: type ~34ms, erase ~18ms, hold 900ms, loops
   forever. Caret is pure CSS (::after ▍, accent blink).
   IntersectionObserver pauses the loop offscreen.
   ──────────────────────────────────────────── */

const PHRASES2 = [
  'Creative Direction.',
  'Branding Systems.',
  'Generative Visuals.',
  'Touch Designer.',
  'South Hustles.',
];

export function initTypewriter2() {
  const el = document.querySelector('.hero-typewriter');
  if (!el) return;
  el.classList.add('hero-typewriter--v2');

  if (prefersReducedMotion()) {
    el.textContent = PHRASES2[PHRASES2.length - 1];
    return;
  }

  let pi = 0, ci = 0, deleting = false, timer = null, visible = true;

  const schedule = (d) => { timer = window.setTimeout(tick, d); };

  const tick = () => {
    timer = null;
    if (!visible) return;
    const phrase = PHRASES2[pi];
    ci += deleting ? -1 : 1;
    el.textContent = phrase.slice(0, ci);
    let delay = deleting ? 18 : 34;
    if (!deleting && ci === phrase.length) {
      delay = 900;             // hold the finished phrase
      deleting = true;
    } else if (deleting && ci === 0) {
      deleting = false;
      pi = (pi + 1) % PHRASES2.length; // loop forever
      delay = 240;
    }
    schedule(delay);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      visible = en.isIntersecting;
      if (visible && !timer) schedule(160);
      else if (!visible && timer) { window.clearTimeout(timer); timer = null; }
    });
  }, { threshold: 0 });
  io.observe(el.closest('#hero') || el);

  schedule(700);
}

/* ────────────────────────────────────────────
   4a. WORD ROTATOR — [data-rotate] with
   data-rotate-words="A|B|C": crossfade + slide-up swap
   every 1.6s. Size-stable via inline-grid stacking
   (every word occupies the same cell, so the container
   always measures the widest word).
   ──────────────────────────────────────────── */

export function initWordRotator() {
  const els = document.querySelectorAll('[data-rotate]');
  if (!els.length) return;

  els.forEach((el) => {
    if (el.classList.contains('word-rotator')) return; // idempotent
    const words = (el.dataset.rotateWords || el.textContent || '')
      .split('|').map((w) => w.trim()).filter(Boolean);
    if (words.length < 2) return;

    el.classList.add('word-rotator');
    el.textContent = '';
    const spans = words.map((w) => {
      const s = document.createElement('span');
      s.textContent = w;
      el.appendChild(s);
      return s;
    });

    let i = 0;
    spans[0].classList.add('is-in');
    if (prefersReducedMotion()) return;

    let timer = null;
    const step = () => {
      const prev = spans[i];
      i = (i + 1) % spans.length;
      const next = spans[i];
      prev.classList.remove('is-in');
      prev.classList.add('is-out');           // exits upward
      next.classList.remove('is-out');        // resets below
      void next.offsetWidth;                  // reflow → clean slide-up entry
      next.classList.add('is-in');
      window.setTimeout(() => prev.classList.remove('is-out'), 520);
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          if (!timer) timer = window.setInterval(step, 1600);
        } else if (timer) {
          window.clearInterval(timer); timer = null;
        }
      });
    }, { threshold: 0.25 });
    io.observe(el);
  });
}

/* ────────────────────────────────────────────
   4b. FONT-SWAP v2 — faster driver for the existing
   [data-swap] statement words (1.1s toggles). The
   orchestrator uses this INSTEAD of sh-main's
   initFontSwap (2.2s).
   ──────────────────────────────────────────── */

export function initFontSwap2() {
  const els = document.querySelectorAll('[data-swap]');
  if (!els.length || prefersReducedMotion()) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const el = e.target;
      if (e.isIntersecting) {
        if (el._swapTimer2) return;
        el._swapTimer2 = window.setInterval(() => el.classList.toggle('is-mono'), 1100);
      } else if (el._swapTimer2) {
        window.clearInterval(el._swapTimer2);
        el._swapTimer2 = null;
        el.classList.remove('is-mono');
      }
    });
  }, { threshold: 0.4 });
  els.forEach((el) => io.observe(el));
}

/* ────────────────────────────────────────────
   6. NAV UNIVERSITY BOOKS — decorate the nav link to
   #university with a tiny CSS bookshelf (4 mini spines
   in the --uni-* palette) that pop up staggered on
   hover and while scroll-active (.is-active, set by
   reveal.js's existing scroll-spy).
   ──────────────────────────────────────────── */

export function initNavBooks() {
  const link = document.querySelector(".site-nav .nav a[href='#university']");
  if (!link || link.querySelector('.nav-books')) return;
  const shelf = document.createElement('span');
  shelf.className = 'nav-books';
  shelf.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 4; i++) shelf.appendChild(document.createElement('i'));
  link.classList.add('has-books');
  link.appendChild(shelf);
}

/* ────────────────────────────────────────────
   7. QUICK PANEL — the + button's own right-side
   drawer (#quick-panel fragment). Opens via
   [data-panel-open] (event-delegated, so the
   orchestrator can re-point the + button later),
   closes via [data-panel-close] / Esc / backdrop.
   Focus-managed like sh-main's initMenuOverlay.
   ──────────────────────────────────────────── */

export function initQuickPanel() {
  const panel = document.getElementById('quick-panel');
  if (!panel) return;
  const backdrop = document.querySelector('.quick-panel__backdrop');
  let lastFocused = null;

  const focusables = () =>
    [...panel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter((el) => el.offsetParent !== null);

  const isOpen = () => panel.classList.contains('is-open');

  const open = () => {
    if (isOpen()) return;
    lastFocused = document.activeElement;
    panel.classList.add('is-open');
    backdrop?.classList.add('is-open');
    document.body.classList.add('quick-panel-open');
    panel.setAttribute('aria-hidden', 'false');
    document.querySelectorAll('[data-panel-open]')
      .forEach((b) => b.setAttribute('aria-expanded', 'true'));
    (panel.querySelector('.quick-panel__close') || focusables()[0])?.focus();
  };

  const close = () => {
    if (!isOpen()) return;
    panel.classList.remove('is-open');
    backdrop?.classList.remove('is-open');
    document.body.classList.remove('quick-panel-open');
    panel.setAttribute('aria-hidden', 'true');
    document.querySelectorAll('[data-panel-open]')
      .forEach((b) => b.setAttribute('aria-expanded', 'false'));
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  };

  // delegated so openers wired later (re-pointed + button) still work
  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-panel-open]');
    if (opener) { e.preventDefault(); (isOpen() ? close() : open()); return; }
    if (isOpen() && e.target.closest('[data-panel-close]')) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!isOpen()) return;
    if (e.key === 'Escape') { close(); return; }
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
