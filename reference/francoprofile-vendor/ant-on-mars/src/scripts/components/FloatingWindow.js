// PORTED FROM ant-on-mars/src/scripts/components/FloatingWindow.js @ copia local 2026-10-23 — DO NOT EDIT. Adapted copy lives in js/**/fp-*.js
/**
 * FloatingWindow.js
 * Creates draggable windows with title bar.
 * Extracted from perro-andaluz-hero.html drag logic.
 */
export class FloatingWindow {
  /**
   * @param {object} opts
   * @param {string} opts.title
   * @param {string|HTMLElement} opts.content  HTML string or element
   * @param {[number, number]} [opts.position]  [left, top] in px
   * @param {string} [opts.width]
   * @param {HTMLElement} [opts.container]
   */
  constructor(opts = {}) {
    this.title     = opts.title     || 'WINDOW';
    this.content   = opts.content   || '';
    this.position  = opts.position  || [80, 120];
    this.width     = opts.width     || '320px';
    this.container = opts.container || document.body;

    this.el        = null;
    this._dragging = false;
    this._ox = 0;
    this._oy = 0;
    this._onMouseMove = null;
    this._onMouseUp   = null;
  }

  mount() {
    this.el = document.createElement('div');
    this.el.className = 'floating-window';
    const pos = this.container === document.body ? 'fixed' : 'absolute';
    this.el.style.cssText = `
      position: ${pos};
      left: ${this.position[0]}px;
      top:  ${this.position[1]}px;
      width: ${this.width};
    `;

    const contentHTML = typeof this.content === 'string'
      ? this.content
      : this.content.outerHTML || '';

    this.el.innerHTML = `
      <div class="floating-window__bar">
        <div class="floating-window__dots">
          <span class="floating-window__dot floating-window__dot--close" title="close">
            <svg class="fw-close-x" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
              <line x1="2.5" y1="2.5" x2="7.5" y2="7.5"/>
              <line x1="7.5" y1="2.5" x2="2.5" y2="7.5"/>
            </svg>
          </span>
          <span class="floating-window__dot floating-window__dot--min"></span>
          <span class="floating-window__dot floating-window__dot--max"></span>
        </div>
        <span class="fw__title">${this.title}</span>
        <span></span>
      </div>
      <div class="floating-window__body">${contentHTML}</div>
    `;

    this._bindDrag();
    this.container.appendChild(this.el);

    // Close dot closes this window
    const closeBtn = this.el.querySelector('.floating-window__dot--close');
    if (closeBtn) closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.unmount();
    });

    return this;
  }

  _bindDrag() {
    const bar = this.el.querySelector('.floating-window__bar');

    const onDown = (e) => {
      this._dragging = true;
      const rect = this.el.getBoundingClientRect();
      this._ox = e.clientX - rect.left;
      this._oy = e.clientY - rect.top;
      this.el.classList.add('is-dragging');
      // Bring to front
      this.el.style.zIndex = FloatingWindow._zCounter++;
    };

    this._onMouseMove = (e) => {
      if (!this._dragging) return;
      if (this.container === document.body) {
        // fixed positioning — use client coords directly
        const x = e.clientX - this._ox;
        const y = e.clientY - this._oy;
        const maxX = window.innerWidth  - this.el.offsetWidth;
        const maxY = window.innerHeight - this.el.offsetHeight;
        this.el.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
        this.el.style.top  = Math.max(0, Math.min(y, maxY)) + 'px';
      } else {
        // absolute positioning — use coords relative to container
        const cRect = this.container.getBoundingClientRect();
        const x = e.clientX - cRect.left - this._ox;
        const y = e.clientY - cRect.top  + this.container.scrollTop - this._oy;
        const maxX = this.container.offsetWidth  - this.el.offsetWidth;
        const maxY = this.container.offsetHeight - this.el.offsetHeight;
        this.el.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
        this.el.style.top  = Math.max(0, Math.min(y, maxY)) + 'px';
      }
    };

    this._onMouseUp = () => {
      this._dragging = false;
      this.el.classList.remove('is-dragging');
    };

    bar.addEventListener('mousedown', onDown);
    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('mouseup',   this._onMouseUp);
  }

  /** Update the body content after mount */
  setContent(html) {
    const body = this.el.querySelector('.floating-window__body');
    if (body) body.innerHTML = html;
  }

  unmount() {
    if (this._onMouseMove) document.removeEventListener('mousemove', this._onMouseMove);
    if (this._onMouseUp)   document.removeEventListener('mouseup',   this._onMouseUp);
    if (this.el && this.el.parentNode) this.el.parentNode.removeChild(this.el);
    this.el = null;
  }
}

FloatingWindow._zCounter = 30;
