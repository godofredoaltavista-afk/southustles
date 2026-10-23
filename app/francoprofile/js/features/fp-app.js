// FP · APP — cara B: el modo app (dashboard de ventanas de vidrio) sobre el mismo documento.
// Patrón sh3-pages.js de South Hustles (overlay a pantalla completa, role=dialog, lockBodyScroll, foco devuelto, Esc,
// deep link por hash) + router por hash de Apacheta (app/nav.ts: #/hoy … F5 y «atrás» funcionan) + look Moyon Lab v3
// (cabecera píldora con marca + «visualizando», pestañas, chips de estado, 3 puntos de color, Configurar) +
// barra izquierda con la ficha de Franco + dock inferior en píldora estilo Apacheta PaperNav en mobile.
// Cada vista vive en js/views/fp-view-<id>.js (contrato en docs/CONTRACTS.md §4) y se monta UNA vez (los nodos se mueven).
import { Workspace } from '../ui/fp-windows.js';

console.log('[fp/app] init');

export const VIEWS = [
  { id: 'hoy', title: 'Hoy', icon: 'hoy', theme: 'light', tab: true, dock: true, hint: 'Qué toca, checklist y racha' },
  { id: 'sesion', title: 'Sesión', icon: 'sesion', theme: 'dark', tab: true, dock: true, hint: 'Tempo 3-1-1 guiado' },
  { id: 'plan', title: 'Plan', icon: 'plan', theme: 'light', tab: true, dock: true, hint: 'Semana, volumen y cardio' },
  { id: 'comida', title: 'Comida', icon: 'comida', theme: 'light', tab: true, dock: true, hint: 'Foto, guía y proteína' },
  { id: 'checkin', title: 'Check-in', icon: 'checkin', theme: 'light', hint: '30 s: sueño, energía, dolor' },
  { id: 'progreso', title: 'Progreso', icon: 'progreso', theme: 'dark', tab: true, dock: true, hint: 'Peso, medidas, vs anterior' },
  { id: 'lab', title: 'Lab', icon: 'lab', theme: 'dark', tab: true, hint: 'Motion Lab: esqueleto y métricas' },
  { id: 'biblioteca', title: 'Biblioteca', icon: 'biblioteca', theme: 'light', hint: 'Ejercicios, glosario, fuentes' },
  { id: 'vault', title: 'Vault', icon: 'vault', theme: 'dark', hint: 'Exportar, importar, contexto' },
  { id: 'ajustes', title: 'Ajustes', icon: 'ajustes', theme: null, hint: 'Tema, densidad, sonido' },
];
const META = Object.fromEntries(VIEWS.map((v) => [v.id, v]));

const HUD_PRESETS = [
  ['#e06040', '#ff5a7a', '#f0a58f'], // terracota Motion Lab (default)
  ['#6d5efc', '#ff5a7a', '#a99bff'], // violeta South Hustles
  ['#ff3d1a', '#ff2bd6', '#ff9a7a'], // Lauren Mia
  ['#1f2bff', '#ff3b30', '#8a93ff'], // ultramar Day Dance
  ['#c6ff1a', '#ff2bd6', '#e4ff8a'], // neón lima
];

export function initApp(ctx) {
  const root = document.getElementById('fp-app');
  if (!root) return null;
  const { icon, esc, fmt } = ctx.ui;
  const M = ctx.M;

  root.innerHTML = `
    <div class="fp-app__bg" aria-hidden="true"><canvas class="fp-app__floor"></canvas></div>
    <header class="fp-topbar" aria-label="Barra de la app">
      <button type="button" class="fp-topbar__back" data-fp-app-close aria-label="Volver al perfil (scroll)">${icon('back', 16)}<span>Perfil</span></button>
      <a class="fp-brand" href="#/hoy" aria-label="Franco · perfil vivo — Hoy">
        <span class="fp-brand__fig" aria-hidden="true">${figureSVG()}</span>
        <span class="fp-brand__txt"><b class="fp-brand__wm">FRANCO<sup>®</sup></b><span class="fp-brand__now"><i></i>visualizando <b data-fp-now>Hoy</b></span></span>
      </a>
      <nav class="fp-tabs" role="tablist" aria-label="Vistas principales">
        ${VIEWS.filter((v) => v.tab).map((v) => `<a class="fp-tab" role="tab" href="#/${v.id}" data-view="${v.id}" aria-selected="false"><i class="fp-tab__bg" aria-hidden="true"></i><span class="fp-tab__ico">${icon(v.icon, 17)}</span><span class="fp-tab__lbl">${v.title}</span></a>`).join('')}
      </nav>
      <span class="fp-topbar__sp"></span>
      <div class="fp-topbar__status" data-fp-chips></div>
      <div class="fp-topbar__tools">
        <div class="fp-hud3" role="group" aria-label="Color de acento (click para cambiar)">
          <span class="fp-hud3__track"></span>
          <button type="button" class="fp-hud3__dot" data-i="0" aria-label="Acento principal"></button>
          <button type="button" class="fp-hud3__dot" data-i="1" aria-label="Acento secundario"></button>
          <button type="button" class="fp-hud3__dot" data-i="2" aria-label="Acento suave"></button>
        </div>
        <button type="button" class="fp-icon-btn" data-fp-winmenu aria-haspopup="true" aria-expanded="false" title="Ventanas">${icon('windows', 17)}</button>
        <button type="button" class="fp-theme-toggle" aria-label="Cambiar tema" aria-pressed="false"><span class="fp-theme-toggle__grid" aria-hidden="true"></span><span class="fp-theme-toggle__knob" aria-hidden="true"></span></button>
        <a class="fp-btn fp-btn--sm fp-topbar__cfg" href="#/ajustes">Configurar</a>
      </div>
    </header>
    <div class="fp-app__body">
      <aside class="fp-side" aria-label="Tu ficha">
        <div class="fp-side__card" data-fp-ficha></div>
        <nav class="fp-side__nav" aria-label="Todas las vistas">
          ${VIEWS.map((v, i) => `<a class="fp-side__link" href="#/${v.id}" data-view="${v.id}"><span class="fp-side__n fp-data">${String(i + 1).padStart(2, '0')}</span><span class="fp-side__ico">${icon(v.icon, 17)}</span><span class="fp-side__t"><b>${v.title}</b><small>${v.hint}</small></span><em class="fp-side__badge" data-badge="${v.id}" hidden></em></a>`).join('')}
        </nav>
        <p class="fp-side__foot fp-small">Todo queda en este dispositivo.<br /><i>Entrenando duro, durmiendo duro.</i></p>
      </aside>
      <main class="fp-app__main">
        <div class="fp-demo-banner" data-fp-demo hidden role="status">
          <span class="fp-chip fp-chip--demo">EJEMPLO</span>
          <span>Estás viendo datos de ejemplo para ver la app llena. No son tus datos.</span>
          <button type="button" class="fp-btn fp-btn--sm" data-fp-clear-demo>${icon('trash', 15)}Borrar ejemplo</button>
        </div>
        <div class="fp-app__views" data-fp-views></div>
      </main>
    </div>
    <nav class="fp-dock" aria-label="Navegación rápida">
      ${VIEWS.filter((v) => v.dock).map((v) => `<a class="fp-dock__item" href="#/${v.id}" data-view="${v.id}">${icon(v.icon, 19)}<span>${v.title}</span></a>`).join('')}
      <button type="button" class="fp-dock__item" data-fp-dock-more aria-expanded="false">${icon('menu', 19)}<span>Más</span></button>
      <div class="fp-dock__drawer" data-fp-dock-drawer hidden>
        ${VIEWS.filter((v) => !v.dock).map((v) => `<a class="fp-dock__more" href="#/${v.id}" data-view="${v.id}">${icon(v.icon, 18)}<span><b>${v.title}</b><small>${v.hint}</small></span></a>`).join('')}
        <button type="button" class="fp-dock__more" data-fp-app-close>${icon('back', 18)}<span><b>Volver al perfil</b><small>El scroll largo</small></span></button>
      </div>
    </nav>
    <div class="fp-winmenu" data-fp-winmenu-pop hidden role="menu" aria-label="Ventanas de la vista"></div>`;

  const viewsEl = root.querySelector('[data-fp-views]');
  const nowEl = root.querySelector('[data-fp-now]');
  const fichaEl = root.querySelector('[data-fp-ficha]');
  const chipsEl = root.querySelector('[data-fp-chips]');
  const demoEl = root.querySelector('[data-fp-demo]');
  const pop = root.querySelector('[data-fp-winmenu-pop]');
  const popBtn = root.querySelector('[data-fp-winmenu]');
  const drawer = root.querySelector('[data-fp-dock-drawer]');
  const moreBtn = root.querySelector('[data-fp-dock-more]');

  const mounted = new Map();
  let current = null;
  let isOpen = false;
  let previewing = false;
  let lastFocus = null;
  let lastPointer = { x: window.innerWidth - 120, y: 30 };
  let closeT = null;

  window.addEventListener('pointerdown', (e) => { lastPointer = { x: e.clientX, y: e.clientY }; }, { passive: true, capture: true });

  /* ── montar vistas ── */
  async function mountView(id) {
    if (mounted.has(id)) return mounted.get(id);
    const meta = META[id];
    const host = document.createElement('section');
    host.className = `fp-view fp-view--${id}`;
    host.dataset.view = id;
    host.hidden = true;
    host.setAttribute('aria-label', meta?.title || id);
    viewsEl.append(host);
    const entry = { id, host, def: null, ws: null, intro: false };
    mounted.set(id, entry);
    let def = null;
    try { def = (await import(`../views/fp-view-${id}.js`)).default; } catch (e) { console.warn(`[fp/app] vista ${id} no disponible:`, e.message); }
    if (!def || typeof def.windows !== 'function') {
      host.classList.add('fp-view--soon');
      host.innerHTML = `<div class="fp-soon"><span class="fp-soon__ico">${icon(meta?.icon || 'sparkle', 34)}</span><p class="fp-eyebrow">${esc(meta?.title || id)}</p><h2>En <em>construcción</em>.</h2><p class="fp-lede">Esta vista todavía no está. Mientras, el resto de la app funciona y todo lo que cargues queda en tu vault local.</p><a class="fp-btn" href="#/hoy">${icon('hoy', 16)}Ir a Hoy</a></div>`;
      return entry;
    }
    entry.def = def;
    if (typeof def.anchor === 'function') {
      const a = document.createElement('div');
      a.className = 'fp-ws-anchor';
      host.append(a);
      try { await def.anchor(a, ctx); } catch (e) { console.warn(`[fp/app] anchor ${id}`, e); }
    }
    const ws = new Workspace(host, { id });
    entry.ws = ws;
    let specs = [];
    try { specs = def.windows(ctx) || []; } catch (e) { console.warn(`[fp/app] windows ${id}`, e); }
    for (const s of specs) {
      const body = document.createElement('div');
      body.className = `fp-win-body fp-win-body--${s.id}`;
      const w = ws.add({ id: s.id, title: s.title, icon: s.icon, content: body, def: s.def, minW: s.minW, minH: s.minH, hidden: s.hidden, cls: s.cls, glass: s.glass });
      const api = { ws, win: w, refresh: () => s.refresh?.(body, ctx, api), toast: ctx.ui.toast };
      try { await s.mount?.(body, ctx, api); } catch (e) {
        console.warn(`[fp/app] mount ${id}/${s.id}`, e);
        body.innerHTML = `<div class="fp-empty"><b>No se pudo armar esta ventana.</b><span>${esc(e.message)}</span></div>`;
      }
    }
    return entry;
  }

  /* ── mostrar una vista ── */
  async function show(id) {
    const meta = META[id] || META.hoy;
    id = meta.id;
    const entry = await mountView(id);
    if (current && current !== id) {
      const prev = mounted.get(current);
      if (prev) { prev.host.hidden = true; try { prev.def?.onHide?.(ctx); } catch { /* */ } }
    }
    current = id;
    entry.host.hidden = false;
    requestAnimationFrame(() => {
      entry.ws?.relayout();
      if (!entry.intro) { entry.intro = true; entry.ws?.intro(); }
    });
    try { entry.def?.onShow?.(ctx); } catch (e) { console.warn(`[fp/app] onShow ${id}`, e); }
    // UI activa
    nowEl.textContent = meta.title;
    root.querySelectorAll('[data-view]').forEach((a) => {
      const on = a.dataset.view === id;
      a.classList.toggle('on', on);
      if (a.getAttribute('role') === 'tab') a.setAttribute('aria-selected', String(on));
      if (a.tagName === 'A') { if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); }
    });
    root.dataset.view = id;
    document.title = `${meta.title} · Franco · Perfil vivo`;
    // tema por vista (Motion Lab VIEW_THEME); null = usa el tema actual (Ajustes). El toggle manual manda.
    const theme = entry.def && entry.def.theme !== undefined ? entry.def.theme : meta.theme;
    if (!previewing && theme) ctx.theme.applyViewTheme(theme, lastPointer);
    closePop();
    closeDrawer();
    drawFloor();
    document.dispatchEvent(new CustomEvent('fp-app', { detail: { open: isOpen, view: id, preview: previewing } }));
  }

  /* ── abrir / cerrar ── */
  async function open(id) {
    clearTimeout(closeT);
    if (!isOpen) {
      isOpen = true;
      if (previewing) stopPreview(true);
      lastFocus = document.activeElement;
      root.hidden = false;
      root.style.setProperty('--fp-ax', `${lastPointer.x}px`);
      root.style.setProperty('--fp-ay', `${lastPointer.y}px`);
      ctx.scroll.lockBodyScroll();
      document.body.classList.add('fp-app-open');
      requestAnimationFrame(() => root.classList.add('is-open'));
      refreshChrome();
      startFloor();
    }
    await show(id);
    if (document.activeElement === document.body || !root.contains(document.activeElement)) {
      const target = root.querySelector(`.fp-tab[data-view="${current}"]`);
      (target && target.offsetParent ? target : root.querySelector('.fp-topbar__back'))?.focus({ preventScroll: true });
    }
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    const prev = mounted.get(current);
    try { prev?.def?.onHide?.(ctx); } catch { /* */ }
    root.classList.remove('is-open');
    document.body.classList.remove('fp-app-open');
    closePop();
    closeDrawer();
    const done = () => {
      if (isOpen) return;
      root.hidden = true;
      stopFloor();
    };
    if (ctx.env.prefersReducedMotion()) done(); else closeT = setTimeout(done, 520);
    ctx.scroll.unlockBodyScroll();
    ctx.theme.applyViewTheme(null);
    document.title = 'Franco · Perfil vivo';
    if (lastFocus && typeof lastFocus.focus === 'function' && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
    // si el hash apunta a un capítulo, ir ahí después de soltar el scroll
    const h = location.hash;
    if (h && !h.startsWith('#/')) { const el = document.getElementById(decodeURIComponent(h.slice(1))); if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'auto' })); }
    document.dispatchEvent(new CustomEvent('fp-app', { detail: { open: false, view: current } }));
  }

  /* ── vista previa detrás del onboarding (desenfocada, sin clicks, sin hash) ── */
  async function preview(on) {
    if (on) {
      if (isOpen) return;
      previewing = true;
      root.hidden = false;
      root.classList.add('fp-app--preview', 'is-open');
      root.setAttribute('aria-hidden', 'true');
      refreshChrome();
      startFloor();
      await show(current || 'hoy');
    } else stopPreview();
  }
  function stopPreview(keep = false) {
    if (!previewing) return;
    previewing = false;
    root.classList.remove('fp-app--preview');
    root.removeAttribute('aria-hidden');
    if (!keep && !isOpen) { root.classList.remove('is-open'); root.hidden = true; stopFloor(); }
    document.dispatchEvent(new CustomEvent('fp-app', { detail: { open: isOpen, view: current, preview: false } }));
  }

  /* ── router por hash ── */
  const parse = () => { const m = /^#\/([\w-]+)/.exec(location.hash); return m ? m[1] : null; };
  function route() {
    const v = parse();
    if (v) open(META[v] ? v : 'hoy');
    else if (isOpen) close();
  }
  window.addEventListener('hashchange', route);

  /* ── teclado: Esc vuelve al scroll · trampa de foco ── */
  document.addEventListener('keydown', (e) => {
    if (!isOpen || previewing) return;
    if (document.getElementById('fp-ob') && !document.getElementById('fp-ob').hidden) return;
    if (e.key === 'Escape') {
      if (!pop.hidden) { closePop(); popBtn.focus(); return; }
      if (!drawer.hidden) { closeDrawer(); return; }
      if (e.target.closest?.('input, textarea, select')) { e.target.blur(); return; }
      ctx.closeApp();
      return;
    }
    if (e.key === 'Tab') {
      const items = [...root.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')].filter((el) => el.offsetParent !== null && !el.closest('[hidden]'));
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-fp-app-close]')) { e.preventDefault(); ctx.closeApp(); return; }
    if (e.target.closest('[data-fp-clear-demo]')) { clearDemo(); return; }
    if (e.target.closest('[data-fp-winmenu]')) { togglePop(); return; }
    if (e.target.closest('[data-fp-dock-more]')) { toggleDrawer(); return; }
    const dot = e.target.closest('.fp-hud3__dot');
    if (dot) { cycleHud(+dot.dataset.i); return; }
    if (!pop.hidden && !e.target.closest('[data-fp-winmenu-pop]')) closePop();
  });

  /* ── tabs: el banner se revela con un círculo desde el mouse (Moyon v3 .tab-bg) ── */
  root.querySelectorAll('.fp-tab').forEach((t) => {
    t.addEventListener('pointermove', (e) => {
      const r = t.getBoundingClientRect();
      t.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      t.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
      t.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 24}deg`);
      t.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - 0.5) * 24}deg`);
    });
    t.addEventListener('pointerleave', () => { t.style.setProperty('--rx', '0deg'); t.style.setProperty('--ry', '0deg'); });
  });

  /* ── menú «Ventanas» ── */
  function togglePop() { if (pop.hidden) openPop(); else closePop(); }
  function openPop() {
    const entry = mounted.get(current);
    const list = entry?.ws?.list() || [];
    pop.innerHTML = `<p class="fp-winmenu__h">Ventanas · ${esc(META[current]?.title || '')}</p>
      ${list.length ? list.map((w) => `<label class="fp-winmenu__row"><input type="checkbox" data-win="${esc(w.id)}" ${w.open ? 'checked' : ''} />${icon(w.icon || 'windows', 15)}<span>${esc(w.title)}</span></label>`).join('') : '<p class="fp-small">Esta vista no tiene ventanas.</p>'}
      <div class="fp-winmenu__foot">
        <button type="button" class="fp-btn fp-btn--sm" data-glass-all="0">Opacas</button>
        <button type="button" class="fp-btn fp-btn--sm" data-glass-all="1">Vidrio</button>
        <button type="button" class="fp-btn fp-btn--sm" data-glass-all="2">Transparentes</button>
        <button type="button" class="fp-btn fp-btn--sm" data-ws-reset>${icon('reset', 14)}Restablecer</button>
      </div>`;
    pop.hidden = false;
    popBtn.setAttribute('aria-expanded', 'true');
    const r = popBtn.getBoundingClientRect();
    pop.style.top = `${r.bottom + 8}px`;
    pop.style.right = `${Math.max(8, window.innerWidth - r.right)}px`;
    pop.querySelectorAll('input[data-win]').forEach((cb) => cb.addEventListener('change', () => entry.ws.set(cb.dataset.win, { hidden: !cb.checked })));
    pop.querySelectorAll('[data-glass-all]').forEach((b) => b.addEventListener('click', () => { for (const w of entry.ws.list()) entry.ws.set(w.id, { glass: +b.dataset.glassAll }); }));
    pop.querySelector('[data-ws-reset]')?.addEventListener('click', () => { entry.ws.reset(); closePop(); ctx.ui.toast('Layout restablecido.', 'ok'); });
    pop.querySelector('input')?.focus();
  }
  function closePop() { if (pop.hidden) return; pop.hidden = true; popBtn.setAttribute('aria-expanded', 'false'); }
  function toggleDrawer() { if (drawer.hidden) { drawer.hidden = false; moreBtn.setAttribute('aria-expanded', 'true'); } else closeDrawer(); }
  function closeDrawer() { drawer.hidden = true; moreBtn.setAttribute('aria-expanded', 'false'); }

  /* ── 3 puntos de color (HUD de Moyon/SH): click = siguiente preset; persiste fp.hud.colors ── */
  function readAccents() {
    const cs = getComputedStyle(document.documentElement);
    return ['--fp-accent', '--fp-accent-2', '--fp-accent-soft'].map((v) => cs.getPropertyValue(v).trim());
  }
  function paintHud() {
    const cols = readAccents();
    root.querySelectorAll('.fp-hud3__dot').forEach((d, i) => { d.style.background = cols[i] || ''; });
  }
  let hudIdx = 0;
  function cycleHud(i) {
    hudIdx = (hudIdx + 1) % HUD_PRESETS.length;
    const cols = readAccents();
    const next = HUD_PRESETS[hudIdx];
    if (i === 0) cols.splice(0, 3, ...next); else cols[i] = next[i];
    const vars = ['--fp-accent', '--fp-accent-2', '--fp-accent-soft'];
    cols.forEach((c, k) => document.documentElement.style.setProperty(vars[k], c));
    ctx.env.LS.set('hud.colors', cols);
    paintHud();
    document.dispatchEvent(new CustomEvent('fp-accent-changed', { detail: { colors: cols } }));
  }
  document.addEventListener('fp-accent-changed', paintHud);
  // Ajustes (APP-2): «Restablecer layout» → todas las vistas montadas vuelven a su distribución por defecto
  document.addEventListener('fp-layout-reset', () => { for (const e of mounted.values()) e.ws?.reset(); });
  ctx.theme.onThemeChange(() => { paintHud(); drawFloor(); }, false);

  /* ── ficha, chips, badges, banner ── */
  async function clearDemo() {
    await ctx.store.clearDemo();
    ctx.ui.toast('Listo: borré los datos de ejemplo.', 'ok');
  }

  async function refreshChrome() {
    const st = ctx.state;
    const profile = st.profile || {};
    const days = st.days || [];
    const today = M.todayISO();
    const hasDemo = days.some((d) => d.demo) || (st.sessions || []).some((s) => s.demo);
    demoEl.hidden = !hasDemo;
    const real = days.filter((d) => !d.demo).length;
    chipsEl.innerHTML = [
      '<span class="fp-mchip ok">vault local</span>',
      `<span class="fp-mchip">${days.length} día${days.length === 1 ? '' : 's'}${hasDemo ? ` · ${real} reales` : ''}</span>`,
      `<span class="fp-mchip">${ctx.theme.isDark() ? 'oscuro' : 'claro'}</span>`,
      hasDemo ? '<span class="fp-mchip fp-mchip--demo">EJEMPLO</span>' : '',
      '<span class="fp-mchip">solo navegador</span>',
    ].join('');
    // ficha
    const w = M.currentWeight(days, profile);
    const wDemo = days.filter((d) => d.checkin?.weightKg).slice(-1)[0]?.demo;
    const proj = M.projection(profile, w, today);
    const sk = M.streak(days, profile, today);
    const pd = M.planFor(today, ctx.data, profile);
    const tDay = days.find((d) => d.date === today);
    const trained = M.dayTrained(tDay);
    let photo = null;
    const withPhoto = [...days].reverse().find((d) => (d.bodyPhotos || []).length);
    if (withPhoto) { try { photo = await ctx.store.mediaURL((withPhoto.bodyPhotos.find((p) => p.view === 'front') || withPhoto.bodyPhotos[0]).mediaId); } catch { /* */ } }
    fichaEl.innerHTML = `
      <div class="fp-ficha__top">
        <div class="fp-ficha__fig">${photo ? `<img src="${photo}" alt="Tu foto frontal (local)" />` : figureSVG(true)}<i class="fp-ficha__ring" aria-hidden="true"></i></div>
        <div class="fp-ficha__id"><b>${esc(ctx.data.profile.who.name)}</b><small>${ctx.data.profile.who.age} · ${esc(ctx.data.profile.who.place.split(',')[0])}</small><small class="fp-it">atleta híbrido</small></div>
      </div>
      <dl class="fp-kv fp-kv--tight">
        <div><dt>Peso</dt><dd class="fp-data">${w != null ? `${fmt(w)} kg` : '—'} ${w != null ? (wDemo ? ctx.ui.demoChip() : ctx.ui.tag('U')) : ''}</dd></div>
        <div><dt>Meta</dt><dd class="fp-data">${proj.target.join('–')} kg ${ctx.ui.tag('U')}</dd></div>
        <div><dt>Faltan</dt><dd class="fp-data">${proj.days} días · 22/12</dd></div>
        <div><dt>Banda</dt><dd class="fp-data">${proj.lo != null ? `${fmt(proj.lo)}–${fmt(proj.hi)} kg` : '—'} ${ctx.ui.tag('C')}</dd></div>
      </dl>
      <div class="fp-ficha__streak"><canvas class="fp-led" data-fp-streak-led aria-hidden="true"></canvas><span><b>Racha</b><small>${esc(sk.rule)}</small></span></div>
      <a class="fp-ficha__toca ${pd?.train && !trained ? 'is-due' : ''}" href="#/${pd?.train ? 'sesion' : 'plan'}">
        <small>Hoy toca</small><b>${esc(pd?.title || 'Descanso')}</b><em>${pd?.train ? (trained ? 'hecho ✓' : 'Empezar →') : 'Sol, caminata, elongación'}</em>
      </a>`;
    requestAnimationFrame(() => {
      const led = fichaEl.querySelector('[data-fp-streak-led]');
      if (led && led.offsetParent) ctx.led.drawLED(led, String(sk.count).padStart(2, '0'), { on: ctx.led.accentColor(), glow: ctx.theme.isDark() ? 12 : 4 });
    });
    // badges
    const setBadge = (id, txt) => { const b = root.querySelector(`[data-badge="${id}"]`); if (!b) return; b.hidden = !txt; b.textContent = txt || ''; };
    setBadge('sesion', pd?.train && !trained ? 'hoy toca' : '');
    setBadge('checkin', tDay?.checkin ? '' : 'pendiente');
    setBadge('vault', hasDemo ? 'ejemplo' : '');
    paintHud();
  }
  ctx.onData(() => { if (isOpen || previewing) refreshChrome(); });

  /* ── fondo: piso en perspectiva de grilla (Moyon Lab background.js) + parallax del mouse ── */
  const floor = root.querySelector('.fp-app__floor');
  const fctx = floor.getContext('2d');
  let floorRaf = 0, floorOn = false, mx = 0, my = 0, tmx = 0, tmy = 0;
  const dots = Array.from({ length: 140 }, (_, i) => ({ x: ((i * 9301 + 49297) % 233280) / 233280, y: ((i * 4096 + 150889) % 714025) / 714025, s: 0.6 + ((i * 37) % 10) / 7, k: (i * 13) % 7 }));
  function drawFloor() {
    if (!floorOn) return;
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    const W = root.clientWidth || window.innerWidth, H = root.clientHeight || window.innerHeight;
    if (floor.width !== Math.round(W * dpr) || floor.height !== Math.round(H * dpr)) { floor.width = Math.round(W * dpr); floor.height = Math.round(H * dpr); }
    const c = fctx; c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, W, H);
    const dark = ctx.theme.isDark();
    const ink = dark ? '255,255,255' : '10,10,10';
    // grilla finita del plano de fondo
    const st = 64, ox = (-mx * 14) % st, oy = (-my * 14) % st;
    c.strokeStyle = `rgba(${ink},${dark ? 0.035 : 0.045})`; c.lineWidth = 1; c.beginPath();
    for (let x = ox; x < W; x += st) { c.moveTo(x, 0); c.lineTo(x, H * 0.56); }
    for (let y = oy; y < H * 0.56; y += st) { c.moveTo(0, y); c.lineTo(W, y); }
    c.stroke();
    // piso en perspectiva: horizonte + líneas al punto de fuga
    const hz = H * 0.56, vx = W * (0.5 + mx * 0.08);
    const g = c.createLinearGradient(0, hz, 0, H);
    g.addColorStop(0, `rgba(${ink},0)`); g.addColorStop(1, `rgba(${ink},${dark ? 0.05 : 0.06})`);
    c.fillStyle = g; c.fillRect(0, hz, W, H - hz);
    c.strokeStyle = `rgba(${ink},${dark ? 0.09 : 0.11})`; c.beginPath();
    for (let k = -24; k <= 24; k++) { c.moveTo(vx + k * 6, hz); c.lineTo(vx + k * W * 0.09, H); }
    for (let j = 1; j < 18; j++) { const t = (j / 18) ** 2.2; const y = hz + t * (H - hz); c.moveTo(0, y); c.lineTo(W, y); }
    c.stroke();
    c.strokeStyle = `rgba(${ink},${dark ? 0.16 : 0.18})`; c.beginPath(); c.moveTo(0, hz); c.lineTo(W, hz); c.stroke();
    // halo cálido que sigue al mouse
    const halo = c.createRadialGradient(W * (0.5 + mx * 0.3), H * (0.42 + my * 0.2), 30, W / 2, H / 2, Math.max(W, H) * 0.7);
    halo.addColorStop(0, dark ? 'rgba(224,96,64,0.07)' : 'rgba(255,255,255,0.45)'); halo.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = halo; c.fillRect(0, 0, W, H);
    // puntos HUD (amarillo, rojo, azul, acento) con parallax por capas
    const cols = ['#ffd60a', '#ff3b30', '#2f7bff', readAccents()[0] || '#e06040'];
    for (const p of dots) {
      const x = p.x * W - mx * 30 * p.s, y = p.y * H - my * 30 * p.s;
      c.globalAlpha = p.k < 5 ? (dark ? 0.22 : 0.18) : 0.6;
      c.fillStyle = p.k < 5 ? `rgb(${dark ? '160,160,160' : '120,120,120'})` : cols[p.k % 4];
      c.fillRect(x, y, p.s * 1.4, p.s * 1.4);
    }
    c.globalAlpha = 1;
  }
  const onMove = (e) => { tmx = e.clientX / window.innerWidth - 0.5; tmy = e.clientY / window.innerHeight - 0.5; kickFloor(); };
  function kickFloor() {
    if (floorRaf || ctx.env.prefersReducedMotion()) return;
    floorRaf = requestAnimationFrame(function step() {
      mx += (tmx - mx) * 0.08; my += (tmy - my) * 0.08;
      drawFloor();
      floorRaf = Math.abs(tmx - mx) + Math.abs(tmy - my) > 0.001 ? requestAnimationFrame(step) : 0;
    });
  }
  function startFloor() { if (floorOn) return; floorOn = true; window.addEventListener('pointermove', onMove, { passive: true }); window.addEventListener('resize', drawFloor, { passive: true }); drawFloor(); }
  function stopFloor() { floorOn = false; window.removeEventListener('pointermove', onMove); window.removeEventListener('resize', drawFloor); cancelAnimationFrame(floorRaf); floorRaf = 0; }

  const api = {
    open: (v) => ctx.openApp(v), close: () => ctx.closeApp(), preview,
    isOpen: () => isOpen, current: () => current, mountView, show, refreshChrome, VIEWS,
  };
  ctx.app = api;
  route();
  return api;
}

/** Figurita de marca (el esqueleto de Moyon Lab, en acento). */
function figureSVG(big = false) {
  const s = big ? 64 : 34;
  return `<svg class="fp-fig" width="${s}" height="${s}" viewBox="0 0 32 32" fill="none" stroke-linecap="round" aria-hidden="true">
    <circle cx="16" cy="6.5" r="3" fill="var(--fp-accent)"/>
    <path d="M16 10v9" stroke="var(--fp-skel-core)" stroke-width="2.2"/>
    <path d="M16 12.5l-6 4.5M10 17l-2 4" stroke="var(--fp-skel-l)" stroke-width="2.2"/>
    <path d="M16 12.5l6 4.5M22 17l2-5" stroke="var(--fp-skel-r)" stroke-width="2.2"/>
    <path d="M16 19l-4 9" stroke="var(--fp-skel-l)" stroke-width="2.2"/>
    <path d="M16 19l4 9" stroke="var(--fp-skel-r)" stroke-width="2.2"/>
  </svg>`;
}
