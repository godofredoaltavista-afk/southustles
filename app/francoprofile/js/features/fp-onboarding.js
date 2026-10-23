// FP · ONBOARDING — patrón Moyon Lab v3 (motion-lab/app/js/ui/onboarding.js): ventana de vidrio centrada sobre la app,
// que queda DETRÁS desenfocada alternando scroll / app cada ~5,2 s; pasos numerados con renumeración dinámica
// (si elegís «Solo leer», Base y Plan se saltean y se renumera); checklist que se tilda con animación; teclado;
// Esc no cierra el paso de privacidad; al terminar → partículas «ENTRENÁ» y entrada al modo elegido.
// No pide ni guarda nada sensible: la base es opcional y vive en el vault local. Clave: fp.onboarding.v1 (03 §8).
console.log('[fp/onboarding] init');

const KEY = 'onboarding.v1';
const STEPS = [
  { id: 'hola', label: 'Bienvenida' },
  { id: 'tema', label: 'Tema y color' },
  { id: 'modo', label: 'Cómo usarla' },
  { id: 'base', label: 'Tu base', app: true },
  { id: 'plan', label: 'Plan', app: true },
  { id: 'privacidad', label: 'Privacidad' },
];
const SWATCHES = [
  { name: 'Terracota Moyon', cols: ['#e06040', '#ff5a7a', '#f0a58f'] },
  { name: 'Violeta South Hustles', cols: ['#6d5efc', '#ff5a7a', '#a99bff'] },
  { name: 'Lauren Mia', cols: ['#ff3d1a', '#ff2bd6', '#ff9a7a'] },
  { name: 'Ultramar', cols: ['#1f2bff', '#ff3b30', '#8a93ff'] },
  { name: 'Neón lima', cols: ['#c6ff1a', '#ff2bd6', '#e4ff8a'] },
];
const DAYS = [['mon', 'Lun'], ['tue', 'Mar'], ['wed', 'Mié'], ['thu', 'Jue'], ['fri', 'Vie'], ['sat', 'Sáb'], ['sun', 'Dom']];

let api = null;

export function openOnboarding() { api?.open(); }

export function initOnboarding(ctx) {
  const host = document.getElementById('fp-ob');
  if (!host) return null;
  const { icon, esc } = ctx.ui;
  const LS = ctx.env.LS;

  const st = { i: 0, mode: LS.get('mode', 'app'), theme: ctx.theme.storedTheme() || 'system', base: {}, plan: {}, demo: true, done: new Set() };
  let backTimer = 0, backApp = false, lastFocus = null, isOpen = false;

  const active = () => STEPS.filter((s) => !(s.app && st.mode === 'read'));

  function render() {
    const steps = active();
    const cur = steps[Math.min(st.i, steps.length - 1)];
    const p = ctx.state.profile || {};
    const b = { ...(p.base || {}), ...st.base };
    const trainDays = st.plan.trainDays || p.plan?.trainDays || ['mon', 'tue', 'wed', 'fri', 'sat'];
    const slot = st.plan.slot ?? p.plan?.slot ?? null;
    const wcb = st.plan.waterCreatineBefore ?? p.intake?.waterCreatineBefore ?? null;
    const n = (k) => String(k + 1).padStart(2, '0');
    let panel = '';
    if (cur.id === 'hola') panel = `
      <h1>Franco · <em>Perfil vivo</em></h1>
      <p class="fp-ob__lead">Tu perfil de entrenamiento: método, plan, comida, progreso y Motion Lab, en un scroll largo y en una app de ventanas.</p>
      <div class="fp-ob__two">
        <div class="fp-ob__box"><b>Qué es</b><ul class="fp-list"><li>La memoria de tu cuerpo: entrenos, comidas, sueño, sensaciones.</li><li>Un tablero con la semana, el tempo 3-1-1 y el volumen por músculo.</li><li>Un contexto listo para pegarle a Claude.</li></ul></div>
        <div class="fp-ob__box fp-ob__box--warn"><b>Qué no es</b><ul class="fp-list"><li>No es una app médica: no diagnostica ni interpreta estudios.</li><li>No promete resultados: muestra tu meta al lado de una banda realista.</li></ul></div>
      </div>`;
    if (cur.id === 'tema') panel = `
      <h1>Tema y <em>color</em></h1>
      <p class="fp-ob__lead">Elegí cómo se ve. El toggle de luna/sol y los 3 puntos del HUD lo cambian cuando quieras.</p>
      <div class="fp-seg fp-ob__seg" data-theme-seg><button type="button" data-v="light">${icon('sun', 15)} Claro</button><button type="button" data-v="dark">${icon('moon', 15)} Oscuro</button><button type="button" data-v="system">Sistema</button></div>
      <p class="fp-label">Acento (los 3 puntos del HUD)</p>
      <div class="fp-ob__sw">${SWATCHES.map((s, k) => `<button type="button" class="fp-ob__swatch" data-sw="${k}" aria-label="${esc(s.name)}"><span>${s.cols.map((c) => `<i style="background:${c}"></i>`).join('')}</span><small>${esc(s.name)}</small></button>`).join('')}</div>
      <p class="fp-small">Default: terracota de tu Motion Lab. Si no te cierra, el violeta de South Hustles es un click.</p>`;
    if (cur.id === 'modo') panel = `
      <h1>¿Cómo la <em>querés usar</em>?</h1>
      <div class="fp-ob__cards">
        <button type="button" class="fp-ob__card ${st.mode === 'read' ? 'on' : ''}" data-mode="read"><span class="fp-ob__card-ico">${icon('eye', 30)}</span><b>Solo leer</b><small>El scroll largo con tu método, tu plan y tus premisas. Sin cargar nada.</small></button>
        <button type="button" class="fp-ob__card ${st.mode === 'app' ? 'on' : ''}" data-mode="app"><span class="fp-ob__card-ico">${icon('hoy', 30)}</span><b>Usarla todos los días</b><small>La app: Hoy, Sesión con tempo, Comida, Check-in, Progreso y Lab.</small></button>
      </div>
      <p class="fp-small">Si elegís «Solo leer», salteamos los pasos de base y plan.</p>`;
    if (cur.id === 'base') panel = `
      <h1>Tu <em>base</em> <small class="fp-ob__opt">opcional</small></h1>
      <p class="fp-ob__lead">Para que los medidores tengan punto de partida. Queda en el vault de este dispositivo.</p>
      <form class="fp-form-grid fp-ob__form" data-base>
        <label class="fp-field"><span>Altura (cm)</span><input class="fp-input" type="number" name="heightCm" min="120" max="230" value="${b.heightCm ?? ''}" placeholder="falta" /></label>
        <label class="fp-field"><span>Peso aprox. (kg)</span><input class="fp-input" type="number" name="weightKg" min="35" max="160" step="0.1" value="${b.weightKg ?? ''}" placeholder="62,5" /></label>
        <label class="fp-field"><span>Carga habitual (kg)</span><input class="fp-input" type="number" name="usualLoadKg" min="0" max="80" step="0.5" value="${b.usualLoadKg ?? ''}" placeholder="20" /></label>
        <div class="fp-field"><span>Mano dominante</span><div class="fp-seg" data-hand><button type="button" data-v="right">Derecha</button><button type="button" data-v="left">Izquierda</button></div></div>
      </form>
      ${p.seededFrom ? `<p class="fp-small">${ctx.ui.tag('U')} Prellené con lo que declaraste (seed local, no se commitea).</p>` : ''}`;
    if (cur.id === 'plan') panel = `
      <h1>Tu <em>plan</em></h1>
      <p class="fp-ob__lead">Default: Lun · Mar · Mié · Vie · Sáb entrenás; Jue y Dom descansás.</p>
      <p class="fp-label">Días de entreno</p>
      <div class="fp-ob__days" data-days>${DAYS.map(([k, l]) => `<button type="button" class="fp-ob__day ${trainDays.includes(k) ? 'on' : ''}" data-day="${k}" aria-pressed="${trainDays.includes(k)}">${l}</button>`).join('')}</div>
      <p class="fp-label">Horario preferido</p>
      <div class="fp-seg" data-slot><button type="button" data-v="mañana">Mañana</button><button type="button" data-v="tarde">Tarde</button><button type="button" data-v="noche">Noche</button></div>
      <p class="fp-label">¿Ya tomás agua y creatina antes de entrenar?</p>
      <div class="fp-seg" data-wcb><button type="button" data-v="si">Sí</button><button type="button" data-v="no">Todavía no</button></div>`;
    if (cur.id === 'privacidad') panel = `
      <h1>Todo queda <em>en este dispositivo</em></h1>
      <p class="fp-ob__lead">Peso, comidas, fotos, check-ins y estudios viven en el vault local (IndexedDB). Nada se sube a ningún lado. Exportá tu vault para no perderlo.</p>
      <ul class="fp-list"><li>Cero analytics, cero servidores.</li><li>Fotos y estudios: nunca al repo ni a un bucket.</li><li>«Borrar todo» borra de verdad.</li></ul>
      <label class="fp-check fp-ob__demo"><input type="checkbox" data-demo ${st.demo ? 'checked' : ''} /><span class="fp-check__box"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></svg></span><span class="fp-check__t">Llenar con 14 días de EJEMPLO</span><span class="fp-check__s">marcados «EJEMPLO», se borran con un click</span></label>`;

    host.innerHTML = `
      <div class="fp-ob__scrim" aria-hidden="true"></div>
      <div class="fp-ob__win" role="dialog" aria-modal="true" aria-labelledby="fp-ob-title">
        <div class="fp-ob__h"><span class="fp-ob__fig">${figure()}</span><span id="fp-ob-title">Empezá · Franco perfil vivo</span><em class="fp-ob__sub">${steps.length} pasos y a entrenar</em>
          ${cur.id !== 'privacidad' ? `<button type="button" class="fp-ob__x" data-close aria-label="Cerrar guía">${icon('close', 16)}</button>` : ''}</div>
        <div class="fp-ob__grid">
          <ol class="fp-ob__steps">${steps.map((s, k) => `<li class="${k === st.i ? 'on' : ''} ${st.done.has(s.id) ? 'done' : ''}"><b>${n(k)}</b><span>${esc(s.label)}</span></li>`).join('')}</ol>
          <div class="fp-ob__panel" data-panel>${panel}</div>
          <aside class="fp-ob__check" aria-label="Checklist">
            <p class="fp-label">Checklist</p>
            <ul>${steps.map((s) => `<li class="${st.done.has(s.id) ? 'ok' : ''}" data-ck="${s.id}"><i>${icon('check', 13)}</i>${esc(s.label)}</li>`).join('')}</ul>
          </aside>
        </div>
        <div class="fp-ob__foot">
          <button type="button" class="fp-btn fp-btn--sm" data-prev ${st.i === 0 ? 'disabled' : ''}>${icon('back', 15)}Atrás</button>
          <div class="fp-ob__prog"><i style="transform:scaleX(${(st.i + 1) / steps.length})"></i></div>
          ${cur.id === 'base' ? '<button type="button" class="fp-btn fp-btn--sm fp-btn--ghost" data-skip>Saltear</button>' : ''}
          <button type="button" class="fp-btn ${cur.id === 'privacidad' ? 'fp-btn--action fp-btn--accent' : 'fp-btn--primary'}" data-next>${cur.id === 'privacidad' ? 'ENTENDIDO · ENTRAR' : `Siguiente ${icon('arrow', 15)}`}</button>
        </div>
      </div>`;
    wire(cur);
    requestAnimationFrame(() => host.querySelector('[data-panel] input, [data-panel] button, [data-next]')?.focus({ preventScroll: true }));
  }

  function wire(cur) {
    host.querySelector('[data-close]')?.addEventListener('click', () => close(false));
    host.querySelector('[data-prev]')?.addEventListener('click', () => go(-1));
    host.querySelector('[data-skip]')?.addEventListener('click', () => { st.base = {}; go(1); });
    host.querySelector('[data-next]').addEventListener('click', () => next(cur));
    if (cur.id === 'tema') {
      ctx.ui.segmented(host.querySelector('[data-theme-seg]'), st.theme, (v) => {
        st.theme = v;
        if (v === 'system') ctx.theme.followSystem(); else ctx.theme.setTheme(v, { from: host.querySelector(`[data-theme-seg] [data-v="${v}"]`) });
        markDone('tema');
      });
      host.querySelectorAll('[data-sw]').forEach((b) => b.addEventListener('click', () => {
        const cols = SWATCHES[+b.dataset.sw].cols;
        ['--fp-accent', '--fp-accent-2', '--fp-accent-soft'].forEach((v, k) => document.documentElement.style.setProperty(v, cols[k]));
        LS.set('hud.colors', cols);
        document.dispatchEvent(new CustomEvent('fp-accent-changed', { detail: { colors: cols } }));
        host.querySelectorAll('[data-sw]').forEach((x) => x.classList.toggle('on', x === b));
        markDone('tema');
      }));
    }
    if (cur.id === 'modo') host.querySelectorAll('[data-mode]').forEach((b) => b.addEventListener('click', () => { st.mode = b.dataset.mode; LS.set('mode', st.mode); markDone('modo', false); render(); }));
    if (cur.id === 'base') {
      const form = host.querySelector('[data-base]');
      form.addEventListener('input', () => { const fd = new FormData(form); for (const k of ['heightCm', 'weightKg', 'usualLoadKg']) st.base[k] = fd.get(k) === '' ? null : +fd.get(k); });
      const hand = (ctx.state.profile?.base?.dominantHand) || st.base.dominantHand || 'right';
      ctx.ui.segmented(host.querySelector('[data-hand]'), st.base.dominantHand || hand, (v) => { st.base.dominantHand = v; });
    }
    if (cur.id === 'plan') {
      const p = ctx.state.profile || {};
      st.plan.trainDays ||= [...(p.plan?.trainDays || ['mon', 'tue', 'wed', 'fri', 'sat'])];
      host.querySelectorAll('[data-day]').forEach((b) => b.addEventListener('click', () => {
        const k = b.dataset.day; const on = !st.plan.trainDays.includes(k);
        st.plan.trainDays = on ? [...st.plan.trainDays, k] : st.plan.trainDays.filter((x) => x !== k);
        b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on));
      }));
      ctx.ui.segmented(host.querySelector('[data-slot]'), st.plan.slot ?? p.plan?.slot ?? 'tarde', (v) => { st.plan.slot = v; });
      const w = st.plan.waterCreatineBefore ?? p.intake?.waterCreatineBefore;
      ctx.ui.segmented(host.querySelector('[data-wcb]'), w == null ? '' : w ? 'si' : 'no', (v) => { st.plan.waterCreatineBefore = v === 'si'; });
    }
    if (cur.id === 'privacidad') host.querySelector('[data-demo]').addEventListener('change', (e) => { st.demo = e.target.checked; });
  }

  function markDone(id, rerender = false) {
    if (st.done.has(id)) return;
    st.done.add(id);
    const li = host.querySelector(`[data-ck="${id}"]`);
    if (li) {
      li.classList.add('ok');
      if (!ctx.env.prefersReducedMotion()) li.animate([{ transform: 'scale(1.04)', boxShadow: '0 0 0 2px rgba(34,211,107,0.6)' }, { transform: 'none', boxShadow: '0 0 0 0 rgba(34,211,107,0)' }], { duration: 520, easing: 'cubic-bezier(0.16,1,0.3,1)' });
    }
    if (rerender) render();
  }

  function go(d) {
    const steps = active();
    st.i = Math.max(0, Math.min(steps.length - 1, st.i + d));
    render();
  }

  async function next(cur) {
    markDone(cur.id);
    if (cur.id === 'base') {
      const clean = Object.fromEntries(Object.entries(st.base).filter(([, v]) => v != null && v !== ''));
      if (Object.keys(clean).length) await ctx.store.saveProfile({ base: clean });
    }
    if (cur.id === 'plan' && st.plan.trainDays) {
      const all = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
      await ctx.store.saveProfile({
        plan: { trainDays: all.filter((k) => st.plan.trainDays.includes(k)), restDays: all.filter((k) => !st.plan.trainDays.includes(k)), slot: st.plan.slot ?? null },
        intake: st.plan.waterCreatineBefore == null ? {} : { waterCreatineBefore: st.plan.waterCreatineBefore },
      });
    }
    if (cur.id === 'privacidad') { await finish(); return; }
    setTimeout(() => go(1), 180);
  }

  async function finish() {
    LS.set(KEY, 'done');
    LS.set('mode', st.mode);
    if (st.demo) {
      try {
        const has = await ctx.store.hasDemo();
        if (!has) { const { loadDemo } = await import('../core/fp-demo.js'); const r = await loadDemo(ctx.data); ctx.ui.toast(`Cargué ${r.written} días de EJEMPLO. Se borran desde el banner.`, 'info', 4500); }
      } catch (e) { console.warn('[fp/onboarding] demo', e); }
    }
    close(true);
    setTimeout(() => ctx.particleWord('ENTRENÁ'), 80);
    setTimeout(() => {
      if (st.mode === 'app') ctx.openApp('hoy');
      else { ctx.closeApp?.(); window.scrollTo({ top: 0, behavior: ctx.env.prefersReducedMotion() ? 'auto' : 'smooth' }); }
    }, ctx.env.prefersReducedMotion() ? 0 : 900);
  }

  /* ── fondo: la app de verdad detrás, alternando scroll / app cada ~5,2 s ── */
  function startBack() {
    if (ctx.env.prefersReducedMotion() || !ctx.app || ctx.app.isOpen()) return;
    const swap = () => { backApp = !backApp; ctx.app.preview(backApp); host.dataset.back = backApp ? 'app' : 'scroll'; };
    swap();
    backTimer = setInterval(swap, 5200);
  }
  function stopBack() { clearInterval(backTimer); backTimer = 0; if (backApp) ctx.app?.preview(false); backApp = false; }

  function open() {
    if (isOpen) { render(); return; }
    const menu = document.getElementById('fp-menu');
    if (menu && menu.getAttribute('aria-hidden') === 'false') menu.querySelector('[data-fp-menu-close]')?.click();
    isOpen = true;
    lastFocus = document.activeElement;
    st.i = 0;
    host.hidden = false;
    host.classList.add('fp-ob');
    document.body.classList.add('fp-ob-open');
    requestAnimationFrame(() => host.classList.add('is-open'));
    if (!ctx.app?.isOpen()) ctx.scroll.lockBodyScroll();
    host._locked = !ctx.app?.isOpen();
    render();
    startBack();
  }

  function close(completed) {
    if (!isOpen) return;
    isOpen = false;
    stopBack();
    host.classList.remove('is-open');
    document.body.classList.remove('fp-ob-open');
    if (host._locked) ctx.scroll.unlockBodyScroll();
    if (!completed) { try { sessionStorage.setItem('fp.onboarding.later', '1'); } catch { /* */ } }
    setTimeout(() => { if (!isOpen) { host.hidden = true; host.innerHTML = ''; } }, ctx.env.prefersReducedMotion() ? 0 : 360);
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus?.({ preventScroll: true });
  }

  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    const steps = active(); const cur = steps[st.i];
    if (e.key === 'Escape') { if (cur.id !== 'privacidad') { e.preventDefault(); close(false); } return; }
    if (e.key === 'Enter' && !e.target.closest('textarea, button, a, select')) { e.preventDefault(); next(cur); return; }
    if (e.key === 'Tab') {
      const items = [...host.querySelectorAll('button:not([disabled]), input, a[href], select, [tabindex]:not([tabindex="-1"])')].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-fp-onboarding-open]')) { e.preventDefault(); open(); }
  });

  api = { open, close };
  ctx.onboarding = api;
  let later = false; try { later = sessionStorage.getItem('fp.onboarding.later') === '1'; } catch { /* */ }
  if (LS.get(KEY, null) !== 'done' && !later) setTimeout(open, 700);
  return api;
}

function figure() {
  return `<svg width="26" height="26" viewBox="0 0 32 32" fill="none" stroke-linecap="round" aria-hidden="true"><circle cx="16" cy="6.5" r="3" fill="var(--fp-accent)"/><path d="M16 10v9" stroke="var(--fp-skel-core)" stroke-width="2.2"/><path d="M16 12.5l-6 4.5M10 17l-2 4M16 19l-4 9" stroke="var(--fp-skel-l)" stroke-width="2.2"/><path d="M16 12.5l6 4.5M22 17l2-5M16 19l4 9" stroke="var(--fp-skel-r)" stroke-width="2.2"/></svg>`;
}
