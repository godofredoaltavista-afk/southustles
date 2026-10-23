// FP · CHROME — loader, nav píldora (detach + scroll-spy), menú full-screen con trampa de foco,
// barra de progreso y tira lateral de capítulos.
// Puertos: South Hustles (intro.js loader, sh-main initNavDetach/initMenuOverlay, sh2-lines initThemeStrip,
// reveal.js scroll-spy y .scroll-progress) + Apacheta MenuOverlay (círculo desde el botón, links numerados con
// retardo 0.08 + i·0.05 s). Todo cuelga del bus único de scroll.
import { onScrollFrame, getSectionProgress } from '../core/fp-scroll-bus.js';
import { lockBodyScroll, unlockBodyScroll } from '../core/fp-scroll-lock.js';
import { prefersReducedMotion, esc } from '../core/fp-env.js';
import { icon, dirfill, magnetic } from './fp-ui.js';

console.log('[fp/chrome] init');

/* ── LOADER: progreso REAL con piso de 900 ms; se quita con .remove() ── */
export function initLoader() {
  const el = document.getElementById('fp-loader');
  if (!el) return null;
  const count = el.querySelector('[data-fp-loader-count]');
  const fill = el.querySelector('[data-fp-loader-fill]');
  const t0 = performance.now();
  let shown = 0, target = 0.08, raf = null;
  const paint = () => {
    shown += (target - shown) * 0.18;
    if (Math.abs(target - shown) < 0.002) shown = target;
    if (count) count.textContent = `${Math.round(shown * 100)}%`;
    if (fill) fill.style.width = `${(shown * 100).toFixed(1)}%`;
    raf = shown !== target ? requestAnimationFrame(paint) : null;
  };
  const step = (p) => { target = Math.max(target, Math.min(1, p)); if (!raf) raf = requestAnimationFrame(paint); };
  step(0.12);
  return {
    step,
    async done() {
      step(1);
      const wait = Math.max(0, 900 - (performance.now() - t0));
      await new Promise((r) => setTimeout(r, wait + 250));
      if (prefersReducedMotion()) { el.remove(); return; }
      el.classList.add('is-leaving');
      await new Promise((r) => setTimeout(r, 650));
      el.classList.add('is-out');
      setTimeout(() => el.remove(), 520);
    },
  };
}

export function initChromeEarly() { /* reservado: nada que hacer antes de montar capítulos */ }

const VIEWS = [
  ['hoy', 'Hoy'], ['sesion', 'Sesión'], ['plan', 'Plan'], ['comida', 'Comida'], ['checkin', 'Check-in'],
  ['progreso', 'Progreso'], ['lab', 'Lab'], ['biblioteca', 'Biblioteca'], ['vault', 'Vault'], ['ajustes', 'Ajustes'],
];

export function initChrome(ctx, chapters) {
  const main = chapters.filter((c) => !c.pause);
  initNav(main);
  initProgressAndStrip(chapters);
  initMenu(ctx, main);
  // con la app abierta escondemos el chrome del scroll
  document.addEventListener('fp-app', (e) => document.body.classList.toggle('fp-app-open', !!e.detail?.open));
  // puente de preferencias: Ajustes (APP-2) emite fp-pref; el cursor (THREE) escucha fp-cursor
  document.addEventListener('fp-pref', (e) => {
    const { key, value } = e.detail || {};
    if (key === 'cursor') document.dispatchEvent(new CustomEvent('fp-cursor', { detail: { on: value !== false } }));
    if (key === 'calm') document.documentElement.dataset.fpCalm = value ? '1' : '';
  });
  // los links de capítulo hacen scroll suave sin ensuciar el hash
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#ch-"]');
    if (!a) return;
    const t = document.getElementById(a.getAttribute('href').slice(1));
    if (!t) return;
    e.preventDefault();
    if (location.hash.startsWith('#/')) ctx.closeApp();
    t.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  });
}

/* ── NAV: .is-detached a >40 px, se esconde bajando rápido, scroll-spy por grupos ── */
function initNav(chapters) {
  const nav = document.querySelector('.fp-nav');
  if (!nav) return;
  const groups = [
    { label: 'Perfil', re: /hero|quien|meta/ },
    { label: 'Método', re: /fases|tempo|tension|sobrecarga/ },
    { label: 'Plan', re: /volumen|semana|sesion|bolsa/ },
    { label: 'Vida', re: /comida|agua|sueno|cardio/ },
    { label: 'Datos', re: /progreso|motion|premisas|vault/ },
  ];
  const links = nav.querySelector('[data-fp-nav-links]');
  const items = [];
  groups.forEach((g) => {
    const first = chapters.find((c) => g.re.test(c.id));
    if (!first) return;
    const a = document.createElement('a');
    a.href = `#ch-${first.id}`;
    a.textContent = g.label;
    links?.append(a);
    items.push({ a, members: chapters.filter((c) => g.re.test(c.id)).map((c) => c.el) });
  });
  nav.querySelectorAll('.fp-pill, .fp-theme-toggle').forEach(magnetic);

  let lastY = window.scrollY;
  onScrollFrame((y) => {
    nav.classList.toggle('is-detached', y > 40);
    const down = y > lastY + 6, up = y < lastY - 6;
    if (down && y > 600) nav.classList.add('is-hidden');
    if (up || y < 200) nav.classList.remove('is-hidden');
    lastY = y;
  });

  // scroll-spy: el grupo cuyo capítulo cruza el centro de la pantalla
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      items.forEach((it) => it.a.classList.toggle('is-active', it.members.includes(en.target)));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  items.forEach((it) => it.members.forEach((m) => io.observe(m)));
}

/* ── barra de progreso + tira lateral (un segmento por capítulo) ── */
function initProgressAndStrip(chapters) {
  const bar = document.querySelector('.fp-progress');
  const strip = document.getElementById('fp-strip');
  const segs = [];
  if (strip) {
    chapters.forEach((c) => {
      const a = document.createElement('a');
      a.href = `#ch-${c.id}`;
      a.setAttribute('aria-label', `${c.n ? c.n + ' · ' : ''}${c.title}`);
      a.innerHTML = `<span>${esc(c.n && c.n !== '··' ? c.n + ' · ' : '')}${esc(c.title)}</span>`;
      if (c.mood) a.classList.add('is-mood');
      strip.append(a);
      segs.push({ a, c });
    });
  }
  const paintPolarity = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    segs.forEach(({ a, c }) => {
      // relleno = panel oscuro en pantalla
      const isDarkPanel = c.mood || (c.pol === 'invert' ? !dark : dark);
      a.classList.toggle('is-dark', !c.mood && isDarkPanel);
    });
  };
  paintPolarity();
  document.addEventListener('fp-theme-changed', paintPolarity);

  let active = null;
  onScrollFrame((y) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : '0');
    // capítulo activo: el que contiene el centro del viewport
    const mid = window.innerHeight / 2;
    let cur = null;
    for (const s of segs) { const r = s.c.el.getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) { cur = s; break; } }
    if (cur !== active) {
      active?.a.classList.remove('is-active');
      cur?.a.classList.add('is-active');
      active = cur;
      document.dispatchEvent(new CustomEvent('fp-chapter', { detail: cur ? { id: cur.c.id, n: cur.c.n, title: cur.c.title, progress: getSectionProgress(cur.c.el) } : null }));
    }
  });
}

/* ── MENÚ full-screen ── */
function initMenu(ctx, chapters) {
  const menu = document.getElementById('fp-menu');
  if (!menu) return;
  const list = menu.querySelector('[data-fp-menu-chapters]');
  const appList = menu.querySelector('[data-fp-menu-app]');
  list.classList.add('fp-menu__list--chapters');
  list.innerHTML = chapters.map((c, i) => `<li style="--i:${i}"><a class="fp-menu__link${c.mood ? ' is-mood' : ''}" href="#ch-${c.id}" data-fp-menu-link><small>${esc(c.n || '')}</small>${esc(c.title)}</a></li>`).join('');
  appList.innerHTML = VIEWS.map(([id, t], i) => `<li style="--i:${i + 4}"><a class="fp-menu__link" href="#/${id}" data-fp-menu-link>${icon(id, 24)}${esc(t)}</a></li>`).join('');
  menu.querySelectorAll('.fp-menu__link, .fp-menu__foot .fp-btn').forEach(dirfill);
  const closeBtn = menu.querySelector('.fp-menu__close');
  closeBtn.innerHTML = `${icon('close', 20)}<span class="fp-sr">Cerrar</span>`;
  const openers = { forEach: (fn) => document.querySelectorAll('[data-fp-menu-open]').forEach(fn) };
  let last = null, isOpen = false;

  const focusables = () => [...menu.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter((el) => el.offsetParent !== null);
  const open = (from) => {
    if (isOpen) return;
    isOpen = true;
    last = document.activeElement;
    if (from?.getBoundingClientRect) { const r = from.getBoundingClientRect(); menu.style.setProperty('--fp-mx', `${r.left + r.width / 2}px`); menu.style.setProperty('--fp-my', `${r.top + r.height / 2}px`); }
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    openers.forEach((b) => b.setAttribute('aria-expanded', 'true'));
    document.body.classList.add('fp-menu-open');
    lockBodyScroll();
    setTimeout(() => (closeBtn || focusables()[0])?.focus(), 60);
  };
  const close = ({ restore = true } = {}) => {
    if (!isOpen) return;
    isOpen = false;
    menu.classList.remove('is-open');
    menu.classList.add('is-closing');
    setTimeout(() => menu.classList.remove('is-closing'), 700);
    menu.setAttribute('aria-hidden', 'true');
    openers.forEach((b) => b.setAttribute('aria-expanded', 'false'));
    document.body.classList.remove('fp-menu-open');
    unlockBodyScroll();
    if (restore && last?.focus) last.focus();
  };
  // delegación: cualquier [data-fp-menu-open] (nav, capítulos, app) abre/cierra el menú
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-fp-menu-open]');
    if (!b || menu.contains(b)) return;
    e.preventDefault();
    isOpen ? close() : open(b);
  });
  menu.querySelectorAll('[data-fp-menu-close]').forEach((b) => b.addEventListener('click', () => close()));
  menu.addEventListener('click', (e) => {
    const a = e.target.closest('[data-fp-menu-link], [data-fp-menu-close-link], [data-fp-export-context], [data-fp-onboarding-open]');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    close({ restore: false });
    if (href.startsWith('#ch-')) {
      e.preventDefault();
      // esperar a que el body se desbloquee y recién ahí scrollear
      requestAnimationFrame(() => document.getElementById(href.slice(1))?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' }));
    }
  });
  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'Tab') {
      const items = focusables(); if (!items.length) return;
      const first = items[0], lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener('hashchange', () => { if (location.hash.startsWith('#/')) close({ restore: false }); });
}
