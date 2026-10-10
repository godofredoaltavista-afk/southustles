import { content } from './content.js';
import { initMotion } from './motion.js';

const root = document.documentElement;
const LANGUAGES = ['es', 'pt', 'en'];
const LANGUAGE_TAGS = { es: 'es-AR', pt: 'pt-BR', en: 'en' };
const ACCENTS = { blue: '#3d66a4', yellow: '#fed060', cream: '#f6e3c5' };
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

const storage = {
  get(key) { try { return localStorage.getItem(`ut-${key}`); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(`ut-${key}`, value); } catch { /* Private browsing still works. */ } },
  remove(key) { try { localStorage.removeItem(`ut-${key}`); } catch { /* Storage is optional. */ } },
};

const savedLanguage = storage.get('language');
let language = LANGUAGES.includes(savedLanguage) ? savedLanguage : 'es';
let motion;
let activeOverlay = null;
let themeTransition;

function translated(key) {
  return content[language]?.[key] ?? content.es?.[key];
}

function writeText(element, text) {
  // A translation on a button or link must leave its decorative icon intact.
  if (element.matches('button, a') && element.children.length) {
    const label = element.querySelector('[data-i18n-text]');
    if (label) { label.textContent = text; return; }
    const textNodes = [...element.childNodes].filter(node => node.nodeType === Node.TEXT_NODE);
    if (textNodes.length) {
      textNodes[0].nodeValue = text;
      textNodes.slice(1).forEach(node => { node.nodeValue = ''; });
    } else {
      element.prepend(document.createTextNode(text));
    }
    return;
  }
  element.textContent = text;
}

function updateThemeControl() {
  const isLight = root.dataset.theme === 'light';
  const label = translated(isLight ? 'ui.themeDark' : 'ui.themeLight');
  document.querySelectorAll('[data-theme-toggle]').forEach(button => {
    button.setAttribute('aria-pressed', String(isLight));
    if (label) button.setAttribute('aria-label', label);
    button.dataset.theme = root.dataset.theme;
  });
}

export function setLanguage(next, persist = true) {
  if (!LANGUAGES.includes(next)) return;
  language = next;
  root.lang = LANGUAGE_TAGS[next];
  root.dataset.language = next;
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const value = translated(element.dataset.i18n);
    if (typeof value === 'string') writeText(element, value);
  });
  ['aria-label', 'placeholder', 'title', 'alt'].forEach(attribute => {
    document.querySelectorAll(`[data-i18n-${attribute}]`).forEach(element => {
      const value = translated(element.getAttribute(`data-i18n-${attribute}`));
      if (typeof value === 'string') element.setAttribute(attribute, value);
    });
  });
  document.querySelectorAll('[data-current-lang]').forEach(element => { element.textContent = next.toUpperCase(); });
  document.querySelectorAll('[data-accent]').forEach(input => {
    const label = translated(`controls.${input.dataset.accent}`);
    if (label) input.setAttribute('aria-label', label);
  });
  document.querySelectorAll('[data-lang]').forEach(button => {
    const selected = button.dataset.lang === next;
    button.setAttribute('aria-pressed', String(selected));
    button.classList.toggle('is-active', selected);
  });
  document.querySelectorAll('select[data-lang-select]').forEach(select => { select.value = next; });
  const description = translated('meta.description');
  const title = translated('meta.title');
  if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  if (title) document.title = title;
  updateThemeControl();
  if (persist) storage.set('language', next);
  motion?.refreshText();
  document.dispatchEvent(new CustomEvent('ut-language-change', { detail: { language: next } }));
}

export function setTheme(next, { persist = true, origin = null, animate = true } = {}) {
  if (next !== 'dark' && next !== 'light') return;
  const changed = root.dataset.theme !== next;
  const apply = () => {
    root.dataset.theme = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#191817' : '#f6e3c5');
    if (persist) storage.set('theme', next);
    updateThemeControl();
    document.dispatchEvent(new CustomEvent('ut-theme-change', { detail: { theme: next } }));
  };
  if (themeTransition) themeTransition.skipTransition();
  if (!changed || !animate || motionPreference.matches || !document.startViewTransition) {
    apply();
    return;
  }
  const source = origin?.getBoundingClientRect();
  const x = source ? source.left + source.width / 2 : window.innerWidth / 2;
  const y = source ? source.top + source.height / 2 : 0;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  root.style.setProperty('--wipe-x', `${x}px`);
  root.style.setProperty('--wipe-y', `${y}px`);
  const transition = document.startViewTransition(apply);
  themeTransition = transition;
  transition.ready.then(() => {
    if (motionPreference.matches) { transition.skipTransition(); return; }
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 620, easing: 'cubic-bezier(.2,.65,.25,1)', pseudoElement: '::view-transition-new(root)' },
    );
  }).catch(() => { /* An interrupted transition has already applied the theme. */ });
  transition.finished.catch(() => {}).finally(() => { if (themeTransition === transition) themeTransition = null; });
}

function initPreferences() {
  setLanguage(language, false);
  const savedTheme = storage.get('theme');
  setTheme(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : root.dataset.theme || 'dark', { persist: false, animate: false });
  document.querySelectorAll('[data-lang-toggle]').forEach(button => {
    button.addEventListener('click', () => setLanguage(LANGUAGES[(LANGUAGES.indexOf(language) + 1) % LANGUAGES.length]));
  });
  document.querySelectorAll('[data-lang]').forEach(button => {
    button.addEventListener('click', () => setLanguage(button.dataset.lang));
  });
  document.querySelectorAll('select[data-lang-select]').forEach(select => {
    select.addEventListener('change', () => setLanguage(select.value));
  });
  document.querySelectorAll('[data-theme-toggle]').forEach(button => {
    button.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', { origin: button }));
  });
  let accents = {};
  try {
    const saved = JSON.parse(storage.get('accents') || '{}');
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) accents = saved;
  } catch { /* Invalid old settings reset cleanly. */ }
  const applyAccents = () => {
    Object.entries(ACCENTS).forEach(([key, fallback]) => {
      const color = /^#[\da-f]{6}$/i.test(accents[key] || '') ? accents[key] : fallback;
      root.style.setProperty(`--ut-${key}`, color);
      document.querySelectorAll(`[data-accent="${key}"]`).forEach(input => { input.value = color; });
    });
    document.dispatchEvent(new CustomEvent('ut-accents-change'));
  };
  applyAccents();
  document.querySelectorAll('[data-accent]').forEach(input => {
    if (!(input.dataset.accent in ACCENTS)) return;
    input.addEventListener('input', () => {
      if (!/^#[\da-f]{6}$/i.test(input.value)) return;
      accents[input.dataset.accent] = input.value;
      applyAccents();
      storage.set('accents', JSON.stringify(accents));
    });
  });
  document.querySelectorAll('[data-accent-reset]').forEach(button => {
    button.addEventListener('click', () => { accents = {}; storage.remove('accents'); applyAccents(); });
  });
}

function focusableElements(container) {
  return [...container.querySelectorAll('a[href], button, input, select, textarea, [tabindex]')]
    .filter(element => !element.disabled && element.tabIndex >= 0 && !element.closest('[hidden], [inert]') && element.getClientRects().length);
}

function setBackgroundInert(overlay) {
  const previous = [];
  let branch = overlay;
  while (branch && branch !== document.body) {
    [...branch.parentElement.children].forEach(sibling => {
      if (sibling === branch || sibling.matches('script, style, link')) return;
      previous.push([sibling, sibling.inert]);
      sibling.inert = true;
    });
    branch = branch.parentElement;
  }
  return () => previous.forEach(([element, inert]) => { element.inert = inert; });
}

function lockScroll() {
  const y = window.scrollY;
  const body = document.body;
  const previous = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: body.style.overflow, paddingRight: body.style.paddingRight };
  const scrollbar = Math.max(0, window.innerWidth - root.clientWidth);
  const padding = parseFloat(getComputedStyle(body).paddingRight) || 0;
  Object.assign(body.style, { position: 'fixed', top: `-${y}px`, width: '100%', overflow: 'hidden', paddingRight: `${padding + scrollbar}px` });
  return () => {
    Object.assign(body.style, previous);
    // Ignore CSS smooth scrolling while restoring the document behind the dialog.
    const behavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo({ top: y, behavior: 'auto' });
    root.style.scrollBehavior = behavior;
  };
}

function closeOverlay({ restoreFocus = true } = {}) {
  if (!activeOverlay) return;
  const state = activeOverlay;
  activeOverlay = null;
  state.overlay.hidden = true;
  state.overlay.classList.remove('is-open');
  state.overlay.setAttribute('aria-hidden', 'true');
  state.trigger?.setAttribute('aria-expanded', 'false');
  state.restoreBackground();
  state.unlockScroll();
  root.classList.remove('ut-overlay-open');
  if (restoreFocus && state.returnFocus?.isConnected) state.returnFocus.focus({ preventScroll: true });
}

function openOverlay(overlay, trigger) {
  if (activeOverlay?.overlay === overlay) { closeOverlay(); return; }
  if (activeOverlay) closeOverlay({ restoreFocus: false });
  const returnFocus = document.activeElement;
  overlay.hidden = false;
  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden', 'false');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('tabindex', '-1');
  trigger.setAttribute('aria-expanded', 'true');
  activeOverlay = { overlay, trigger, returnFocus, restoreBackground: setBackgroundInert(overlay), unlockScroll: lockScroll() };
  root.classList.add('ut-overlay-open');
  (focusableElements(overlay)[0] || overlay).focus({ preventScroll: true });
}

function initOverlays() {
  document.querySelectorAll('[data-menu-toggle], [data-panel-toggle]').forEach(trigger => {
    const id = trigger.getAttribute('aria-controls') || (trigger.hasAttribute('data-menu-toggle') ? 'ut-menu' : 'ut-panel');
    const overlay = document.getElementById(id);
    if (!overlay) return;
    trigger.setAttribute('aria-controls', id);
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', () => openOverlay(overlay, trigger));
  });
  document.querySelectorAll('[data-overlay]').forEach(overlay => {
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    overlay.addEventListener('click', event => {
      if (event.target.closest('[data-overlay-close]') || event.target === overlay) closeOverlay();
      else {
        const link = event.target.closest('a[href]');
        if (link) closeOverlay({ restoreFocus: !link.getAttribute('href').startsWith('#') });
      }
    });
  });
  // Inert background clicks retarget to the body. Handle them in capture so a
  // quick-panel closes without activating a link behind it on the same click.
  document.addEventListener('click', event => {
    if (!activeOverlay || activeOverlay.overlay.contains(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
    closeOverlay();
  }, true);
  document.addEventListener('keydown', event => {
    if (!activeOverlay) return;
    if (event.key === 'Escape') { event.preventDefault(); closeOverlay(); return; }
    if (event.key !== 'Tab') return;
    const { overlay } = activeOverlay;
    const items = focusableElements(overlay);
    if (!items.length) { event.preventDefault(); overlay.focus(); return; }
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === overlay)) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && (document.activeElement === last || document.activeElement === overlay)) { event.preventDefault(); first.focus(); }
  });
  document.addEventListener('focusin', event => {
    if (!activeOverlay || activeOverlay.overlay.contains(event.target)) return;
    (focusableElements(activeOverlay.overlay)[0] || activeOverlay.overlay).focus();
  });
}

function initAccordion() {
  const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('[data-accordion]').forEach(accordion => {
    const items = [...accordion.querySelectorAll('[data-accordion-item]')].map(element => ({
      element,
      trigger: element.querySelector('[data-accordion-trigger]'),
      panel: element.querySelector('[data-accordion-panel]'),
      pinned: false,
      hovered: false,
    })).filter(item => item.trigger && item.panel);
    let open = null;
    const show = next => {
      items.forEach(item => {
        const expanded = item === next;
        item.element.classList.toggle('is-open', expanded);
        item.trigger.setAttribute('aria-expanded', String(expanded));
        item.panel.hidden = !expanded;
        if (!expanded) item.pinned = false;
      });
      open = next;
    };
    items.forEach((item, index) => {
      if (!item.panel.id) item.panel.id = `ut-universe-panel-${index + 1}`;
      item.trigger.setAttribute('aria-controls', item.panel.id);
      item.trigger.setAttribute('aria-expanded', 'false');
      item.panel.hidden = true;
      item.element.addEventListener('pointerenter', event => {
        if (!hover.matches || event.pointerType === 'touch') return;
        item.hovered = true;
        // Keep the panel containing keyboard focus available to that visitor.
        if (!open?.element.contains(document.activeElement)) show(item);
      });
      item.element.addEventListener('pointerleave', () => {
        item.hovered = false;
        if (open === item && !item.pinned && !item.element.contains(document.activeElement)) show(null);
      });
      item.element.addEventListener('focusin', () => show(item));
      item.element.addEventListener('focusout', event => {
        if (!item.element.contains(event.relatedTarget) && !item.hovered && !item.pinned && open === item) show(null);
      });
      item.trigger.addEventListener('click', () => {
        if (item.pinned) { item.pinned = false; show(null); }
        else { show(item); item.pinned = true; }
      });
      item.trigger.addEventListener('keydown', event => {
        let target;
        if (event.key === 'ArrowDown') target = (index + 1) % items.length;
        if (event.key === 'ArrowUp') target = (index + items.length - 1) % items.length;
        if (event.key === 'Home') target = 0;
        if (event.key === 'End') target = items.length - 1;
        if (target !== undefined) { event.preventDefault(); items[target].trigger.focus(); }
        if (event.key === 'Escape' && open === item) { item.pinned = false; show(null); item.trigger.focus(); }
      });
    });
    document.addEventListener('pointerdown', event => {
      if (open && !accordion.contains(event.target)) show(null);
    }, { passive: true });
  });
}

function initNavigation() {
  const nav = document.querySelector('[data-site-nav]');
  const links = [...document.querySelectorAll('[data-chapter-link]')];
  const chapters = [...document.querySelectorAll('[data-chapter][id]')];
  let scheduled = false;
  const update = () => {
    scheduled = false;
    nav?.classList.toggle('is-detached', window.scrollY > 40);
    nav?.classList.toggle('is-scrolled', window.scrollY > 40);
    const total = root.scrollHeight - window.innerHeight;
    root.style.setProperty('--ut-scroll-progress', total > 0 ? String(Math.min(1, Math.max(0, window.scrollY / total))) : '0');
    let current = chapters[0];
    chapters.forEach(chapter => { if (chapter.getBoundingClientRect().top <= window.innerHeight * .42) current = chapter; });
    links.forEach(link => {
      const selected = link.hash === `#${current?.id}`;
      link.classList.toggle('is-active', selected);
      if (selected) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const schedule = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor || anchor.hash.length < 2 || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    let target;
    try { target = document.getElementById(decodeURIComponent(anchor.hash.slice(1))); } catch { return; }
    if (!target) return;
    event.preventDefault();
    if (activeOverlay) closeOverlay({ restoreFocus: false });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: motionPreference.matches ? 'auto' : 'smooth', block: 'start' });
    if (location.hash !== anchor.hash) history.pushState(null, '', anchor.hash);
  });
  update();
}

function initCanopy() {
  const sections = [...document.querySelectorAll('[data-canopy]')];
  if (!sections.length) return;
  let started = false;
  let observer;
  const load = async () => {
    if (started) return;
    started = true;
    observer?.disconnect();
    try {
      const canopy = await import('./canopy.js');
      // Kept local and deferred: the editorial page is usable before WebGL loads.
      canopy.initCaseBannerLeaves?.();
      canopy.initCanopyRevealLeaves?.();
    } catch {
      sections.forEach(section => { section.dataset.canopyStatus = 'fallback'; });
    }
  };
  if (!('IntersectionObserver' in window)) { load(); return; }
  observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) load();
  }, { rootMargin: '400px 0px' });
  sections.forEach(section => observer.observe(section));
}

function boot() {
  root.classList.add('ut-js');
  initPreferences();
  initOverlays();
  initAccordion();
  initNavigation();
  document.querySelectorAll('[data-year]').forEach(element => { element.textContent = new Date().getFullYear(); });
  motion = initMotion();
  initCanopy();
  motionPreference.addEventListener('change', event => { if (event.matches) themeTransition?.skipTransition(); });
  window.addEventListener('pagehide', () => { closeOverlay({ restoreFocus: false }); motion.destroy(); });
  window.addEventListener('pageshow', event => { if (event.persisted) motion = initMotion(); });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();
