// PORTED FROM ant-on-mars/src/scripts/layout/shared-layout.js @ copia local 2026-10-23 — DO NOT EDIT. Adapted copy lives in js/**/fp-*.js
/**
 * shared-layout.js — Shared nav + footer for all MPA pages
 * Injects nav topbar and footer, highlights current page, inits theme + cursor.
 */
import themeManager from '../core/ThemeManager.js';
import { NavOSection } from '../sections/NavOSection.js';

const NAV_HTML = `
<div class="nav-topbar" id="navTopbar">
  <div class="nav-topbar__brand">
    <a href="/" style="display:flex;align-items:center;gap:8px;text-decoration:none;">
      <canvas id="navOCanvas" class="nav-o-canvas" width="22" height="22"></canvas>
      <span class="nav-topbar__logo">ANT ON MARS</span>
    </a>
  </div>
  <nav class="nav-topbar__links">
    <a href="/" data-page="mission">MISSION</a>
    <a href="/setup.html" data-page="setup">SETUP</a>
    <a href="/engine.html" data-page="engine">ENGINE</a>
    <a href="/dashboard.html" data-page="dashboard">DASHBOARD</a>
    <a href="/game.html" data-page="game">GAME</a>
  </nav>
  <div class="nav-topbar__sep"></div>
  <button class="btn btn--ghost theme-toggle theme-toggle--nav" id="themeToggle" aria-label="Toggle theme">
    <span class="theme-toggle__icon" id="themeIcon"><svg class="icon-svg icon-svg--theme" viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/><g stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="12" y1="1" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/></g></svg></span>
  </button>
</div>
`;

const FOOTER_HTML = `
<footer id="footer" class="section section--footer">
  <canvas id="footerCanvas" class="canvas-bg"></canvas>
  <div class="section__content footer__content">
    <p class="footer__logo text-display">ANT ON MARS</p>
    <p class="text-mono" style="opacity:0.4;font-size:0.75rem;">SOUTHUSTLES — NOMADIC DIGITAL SYSTEMS © 2026</p>
    <div class="footer__links">
      <a href="/" class="text-mono text-cyan">MISSION</a>
      <a href="/setup.html" class="text-mono text-cyan">SETUP</a>
      <a href="/engine.html" class="text-mono text-cyan">ENGINE</a>
      <a href="/dashboard.html" class="text-mono text-cyan">DASHBOARD</a>
      <a href="/game.html" class="text-mono text-cyan">GAME</a>
    </div>
  </div>
</footer>
`;

/**
 * Initialize shared layout: nav, footer, theme, cursor, NavO canvas.
 * @param {string} currentPage — key matching data-page attr (e.g. 'setup', 'engine')
 */
export function initLayout(currentPage) {
  // 1. Inject nav at top of body
  const navContainer = document.createElement('div');
  navContainer.innerHTML = NAV_HTML.trim();
  const navEl = navContainer.firstElementChild;
  document.body.insertBefore(navEl, document.body.firstChild);

  // 2. Inject footer
  const footerMount = document.getElementById('footer-mount');
  const footerContainer = document.createElement('div');
  footerContainer.innerHTML = FOOTER_HTML.trim();
  const footerEl = footerContainer.firstElementChild;
  if (footerMount) {
    footerMount.replaceWith(footerEl);
  } else {
    document.body.appendChild(footerEl);
  }

  // 3. Mark active nav link
  const navLinks = document.querySelectorAll('.nav-topbar__links a[data-page]');
  navLinks.forEach(link => {
    if (link.dataset.page === currentPage) {
      link.classList.add('active');
    }
  });

  // 4. Init theme toggle
  themeManager.init();

  // 5. Init custom cursor
  initCursor();

  // 6. Init NavO canvas (Three.js spinning O in nav)
  try {
    const navO = new NavOSection();
    navO.init();
  } catch (e) {
    // NavO canvas may not be critical
    console.warn('[shared-layout] NavOSection init failed:', e);
  }
}

// ─── Custom Cursor (same as app.js) ─────────────────────────────

function initCursor() {
  const outer = document.getElementById('cursorOuter');
  const inner = document.getElementById('cursorInner');
  if (!outer || !inner) return;

  let cx = 0, cy = 0;
  let tx = 0, ty = 0;

  document.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    inner.style.left = tx + 'px';
    inner.style.top  = ty + 'px';
  }, { passive: true });

  function tickCursor() {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    outer.style.left = cx + 'px';
    outer.style.top  = cy + 'px';
    requestAnimationFrame(tickCursor);
  }
  tickCursor();

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, [role="button"], .card, .floating-window__bar')) {
      outer.classList.add('is-hovering');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, [role="button"], .card, .floating-window__bar')) {
      outer.classList.remove('is-hovering');
    }
  });
  document.addEventListener('mousedown', () => outer.classList.add('is-clicking'));
  document.addEventListener('mouseup',   () => outer.classList.remove('is-clicking'));
}
