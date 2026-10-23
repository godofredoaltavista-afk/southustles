// PORTED FROM ant-on-mars/src/scripts/components/NavHUD.js @ copia local 2026-10-23 — DO NOT EDIT. Adapted copy lives in js/**/fp-*.js
/**
 * NavHUD.js — Floating HUD Navigation Controller
 * Handles: drive mode tabs, telemetry panel toggle, scroll state,
 * keyboard shortcuts (G/Z/H/F), and draggable panel utility.
 */
import themeManager from '../core/ThemeManager.js';

export class NavHUD {
  constructor() {
    this._nav        = null;
    this._telWrap    = null;
    this._telPanel   = null;
    this._telArrow   = null;
    this._telOpen    = false;
    this._activeMode = 'magnetic'; // default: MAG active on load
  }

  init() {
    this._nav      = document.getElementById('nav');
    this._telWrap  = document.getElementById('navTelWrap');
    this._telPanel = document.getElementById('navTelPanel');
    this._telArrow = document.getElementById('navTelArrow');

    if (!this._nav) return;

    this._initScrollState();
    this._initDriveTabs();
    this._initTelemetry();
    this._initKeyboard();
    this._initThemeReactivity();

    // Paint initial mode color immediately (no scroll required)
    this._setMode(this._activeMode);

    // Open telemetry panel by default on load
    requestAnimationFrame(() => this._openTelemetry());
  }

  // ── Scroll state ─────────────────────────────────────────────────
  _initScrollState() {
    window.addEventListener('scroll', () => {
      this._nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ── Drive tabs ───────────────────────────────────────────────────
  _initDriveTabs() {
    const container = document.getElementById('navDriveTabs');
    if (!container) return;

    container.querySelectorAll('.drive-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this._setMode(tab.dataset.mode);
      });
    });
  }

  _setMode(mode) {
    this._activeMode = mode;
    const container = document.getElementById('navDriveTabs');
    if (!container) return;

    container.querySelectorAll('.drive-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.mode === mode);
    });

    // Update telemetry panel mode label
    const telMode = document.getElementById('tel-mode');
    if (telMode) telMode.textContent = mode.toUpperCase();

    // Propagate mode color to the drive controls box — always, no scroll guard
    const modeBorderColors = {
      gravity:  'rgba(0,255,224,0.45)',
      magnetic: 'rgba(0,170,255,0.45)',
      hook:     'rgba(255,68,68,0.45)',
      float:    'rgba(180,255,80,0.45)',
    };
    const modeGlows = {
      gravity:  '0 0 14px rgba(0,255,224,0.22)',
      magnetic: '0 0 14px rgba(0,170,255,0.22)',
      hook:     '0 0 14px rgba(255,68,68,0.22)',
      float:    '0 0 14px rgba(180,255,80,0.22)',
    };
    const modeValueColors = {
      gravity:  '#00FFE0',
      magnetic: '#00AAFF',
      hook:     '#FF4444',
      float:    '#B4FF50',
    };
    const borderColor = modeBorderColors[mode] || '';
    const glow        = modeGlows[mode]        || '';
    const valueColor  = modeValueColors[mode]  || '';

    // Apply to the drive HUD pill border
    if (this._nav) {
      this._nav.style.borderColor = borderColor;
      this._nav.style.boxShadow   = glow;
    }

    // DRIVE MARS button — fill color matches active mode
    const driveMarsBtn = document.getElementById('navDriveMars');
    if (driveMarsBtn) {
      driveMarsBtn.style.background  = valueColor;
      driveMarsBtn.style.color       = '#000';
      driveMarsBtn.style.borderColor = valueColor;
    }

    // Apply to telemetry panel border + glow + value text color
    if (this._telPanel) {
      this._telPanel.style.borderColor = borderColor;
      this._telPanel.style.boxShadow   = glow;
      this._telPanel.querySelectorAll('.tel-value').forEach(el => {
        el.style.color = valueColor;
      });
    }

    // Apply to HUD top-left terminal border accent
    const hud = document.getElementById('hud');
    if (hud) {
      hud.style.borderColor = borderColor;
    }
  }

  // ── Telemetry panel ──────────────────────────────────────────────
  _initTelemetry() {
    const toggle = document.getElementById('navTelToggle');
    if (!toggle || !this._telPanel) return;

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      this._toggleTelemetry();
    });
  }

  _toggleTelemetry() {
    this._telOpen ? this._closeTelemetry() : this._openTelemetry();
  }

  _openTelemetry() {
    this._telOpen = true;
    this._telPanel?.classList.add('is-open');
    if (this._telArrow) this._telArrow.textContent = '▼';
    this._makeDraggable(this._telPanel);
  }

  _closeTelemetry() {
    this._telOpen = false;
    this._telPanel?.classList.remove('is-open');
    if (this._telArrow) this._telArrow.textContent = '▲';
  }

  // ── Keyboard shortcuts ───────────────────────────────────────────
  _initKeyboard() {
    document.addEventListener('keydown', (e) => {
      // Don't fire when typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const map = { g: 'gravity', z: 'magnetic', h: 'hook', f: 'float' };
      const mode = map[e.key.toLowerCase()];
      if (mode) this._setMode(mode);
    });
  }

  // ── Theme reactivity ─────────────────────────────────────────────
  _initThemeReactivity() {
    themeManager.onChange(() => {
      // Re-apply mode colors after theme switch
      this._setMode(this._activeMode);
    });
  }

  // ── Draggable utility ─────────────────────────────────────────────
  _makeDraggable(el) {
    if (!el || el._draggableInited) return;
    el._draggableInited = true;

    // Make fixed-positioned so it can be dragged freely
    let startX, startY, origLeft, origTop;
    let isDragging = false;

    const onDown = (e) => {
      if (e.button !== 0) return;
      isDragging = true;

      const rect = el.getBoundingClientRect();
      if (!el.style.position || el.style.position !== 'fixed') {
        el.style.position = 'fixed';
        el.style.left  = rect.left + 'px';
        el.style.top   = rect.top  + 'px';
        el.style.right = 'auto';
        el.style.bottom = 'auto';
      }

      startX   = e.clientX;
      startY   = e.clientY;
      origLeft = parseFloat(el.style.left) || rect.left;
      origTop  = parseFloat(el.style.top)  || rect.top;

      el.style.cursor = 'grabbing';
      e.preventDefault();
    };

    const onMove = (e) => {
      if (!isDragging) return;
      el.style.left = (origLeft + e.clientX - startX) + 'px';
      el.style.top  = (origTop  + e.clientY - startY) + 'px';
    };

    const onUp = () => {
      isDragging = false;
      el.style.cursor = 'grab';
    };

    el.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);

    el.style.cursor = 'grab';
  }
}
