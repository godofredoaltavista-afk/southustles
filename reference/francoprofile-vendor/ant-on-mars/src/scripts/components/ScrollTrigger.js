// PORTED FROM ant-on-mars/src/scripts/components/ScrollTrigger.js @ copia local 2026-10-23 — DO NOT EDIT. Adapted copy lives in js/**/fp-*.js
/**
 * ScrollTrigger.js
 * IntersectionObserver wrapper for reveal-on-scroll + stagger support.
 * Matches patterns from ant-on-mars-site.html.
 */
export class ScrollTrigger {
  /**
   * @param {object} opts
   * @param {number} [opts.threshold=0.1]
   * @param {string} [opts.rootMargin='0px 0px -60px 0px']
   * @param {string} [opts.visibleClass='is-visible']
   * @param {number} [opts.staggerDelay=60]  ms between staggered items
   */
  constructor(opts = {}) {
    this.threshold    = opts.threshold    ?? 0.1;
    this.rootMargin   = opts.rootMargin   ?? '0px 0px -60px 0px';
    this.visibleClass = opts.visibleClass ?? 'is-visible';
    this.staggerDelay = opts.staggerDelay ?? 60;
    this._observer    = null;
  }

  init() {
    this._observer = new IntersectionObserver(
      (entries) => this._onIntersect(entries),
      { threshold: this.threshold, rootMargin: this.rootMargin }
    );
    return this;
  }

  /**
   * Observe a single element.
   * @param {HTMLElement} el
   * @param {() => void} [onEnter]
   * @param {() => void} [onLeave]
   */
  observe(el, onEnter, onLeave) {
    el._scrollTriggerOnEnter = onEnter;
    el._scrollTriggerOnLeave = onLeave;
    this._observer.observe(el);
  }

  /**
   * Observe all .reveal-item elements inside a container,
   * applying staggered transition delays.
   * @param {HTMLElement} [container=document]
   */
  observeRevealItems(container = document) {
    const items = container.querySelectorAll('.reveal-item');
    items.forEach((el, i) => {
      // Ensure stagger class is present if not already set
      if (!el.style.transitionDelay) {
        el.style.transitionDelay = `${i * this.staggerDelay}ms`;
      }
      this._observer.observe(el);
    });
  }

  /**
   * Observe section containers for class toggling.
   * @param {HTMLElement} [container=document]
   */
  observeSections(container = document) {
    const sections = container.querySelectorAll('.reveal-section');
    sections.forEach(el => this._observer.observe(el));
  }

  _onIntersect(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(this.visibleClass);
        if (entry.target._scrollTriggerOnEnter) {
          entry.target._scrollTriggerOnEnter(entry.target);
        }
        // Reveal items inside the section — one-shot, never removed
        const items = entry.target.querySelectorAll('.reveal-item');
        if (items.length) {
          items.forEach((item, i) => {
            setTimeout(() => item.classList.add(this.visibleClass), i * this.staggerDelay);
          });
        }
      } else {
        // Section exits: fire leave callback but do NOT remove is-visible from
        // reveal-items — they should stay revealed once shown (prevents flicker
        // when scrolling back up from the bottom of the page).
        entry.target.classList.remove(this.visibleClass);
        if (entry.target._scrollTriggerOnLeave) {
          entry.target._scrollTriggerOnLeave(entry.target);
        }
      }
    });
  }

  dispose() {
    if (this._observer) this._observer.disconnect();
    this._observer = null;
  }
}
