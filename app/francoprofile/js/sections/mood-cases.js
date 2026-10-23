// FP · MOOD M13 — «Hitos»: case cards de South Hustles (index.html .holo-card + css/cards.css + js/holo-tilt.js).
// Tarjetas inclinadas con gradiente, foil holográfico, brillo, anillo de rareza, sello «CASE» y estrellas.
// Cada tarjeta = un hito medible del método, con su valor vivo del vault (o «—» si no hay dato).
// El tilt es un puerto fiel de applyHoloTilt (spring .14, maxTilt 10°, scale 1.03, perspective 900).
console.log('[fp/mood-cases] init');

const CASES = [
  { id: 'pullups', title: 'Dominadas +2–3', sub: 'estrictas, con escápula baja', tag: 'C', tint: 'violet', rarity: 'legendary', stars: '★★★', glyph: 'bar' },
  { id: 'weight', title: '65 kg al 22/12', sub: 'meta declarada · banda 0,5–1 kg/mes', tag: 'U', tint: 'hot', rarity: 'legendary', stars: '★★★', glyph: 'scale' },
  { id: 'diamond', title: 'Diamante +5', sub: 'manteniendo el 3-1-1', tag: 'C', tint: 'crimson', rarity: 'epic', stars: '★★', glyph: 'bolt' },
  { id: 'symmetry', title: 'Simetría L/R', sub: 'hombro y codo, medida en Motion Lab', tag: 'C', tint: 'ultra', rarity: 'epic', stars: '★★', glyph: 'lab' },
  { id: 'plank', title: 'Plancha lateral 45 s', sub: 'por lado · hoy cuesta', tag: 'C', tint: 'graphite', rarity: 'rare', stars: '★', glyph: 'target' },
  { id: 'protein', title: 'Proteína ≥ 100 g', sub: '6 de cada 7 días', tag: 'C', tint: 'lime', rarity: 'rare', stars: '★', glyph: 'comida' },
];

/** applyHoloTilt (South Hustles) — transform al hijo, variables del puntero con el mismo resorte. */
function holoTilt(el, { maxTilt = 10, scale = 1.03, perspective = 900, stiffness = 0.14 } = {}) {
  const target = el.querySelector('.fp-mb-case__tilt') || el;
  target.style.transformStyle = 'preserve-3d';
  let raf = null, rect = null;
  let tRX = 0, tRY = 0, tS = 1, tHX = 0, tHY = 0, cRX = 0, cRY = 0, cS = 1, cHX = 0, cHY = 0;
  const tick = () => {
    cRX += (tRX - cRX) * stiffness; cRY += (tRY - cRY) * stiffness; cS += (tS - cS) * stiffness;
    cHX += (tHX - cHX) * stiffness; cHY += (tHY - cHY) * stiffness;
    target.style.transform = `perspective(${perspective}px) rotateX(${cRX}deg) rotateY(${cRY}deg) scale(${cS})`;
    el.style.setProperty('--hx', cHX.toFixed(4));
    el.style.setProperty('--hy', cHY.toFixed(4));
    el.style.setProperty('--mx', `${((cHX / 2 + 0.5) * 100).toFixed(2)}%`);
    el.style.setProperty('--my', `${((cHY / 2 + 0.5) * 100).toFixed(2)}%`);
    el.style.setProperty('--hyp', (Math.hypot(cHX, cHY) / Math.SQRT2).toFixed(4));
    const settled = Math.abs(tRX - cRX) < 0.02 && Math.abs(tRY - cRY) < 0.02 && Math.abs(tS - cS) < 0.002 && Math.abs(tHX - cHX) < 0.005 && Math.abs(tHY - cHY) < 0.005;
    if (!settled) raf = requestAnimationFrame(tick);
    else { raf = null; if (!el.classList.contains('is-live')) target.style.willChange = ''; }
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
  el.addEventListener('pointerenter', () => { rect = el.getBoundingClientRect(); el.classList.add('is-live'); target.style.willChange = 'transform'; });
  el.addEventListener('pointermove', (e) => {
    rect = rect || el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width, py = (e.clientY - rect.top) / rect.height;
    tHX = (px - 0.5) * 2; tHY = (py - 0.5) * 2;
    tRY = tHX * maxTilt; tRX = -tHY * maxTilt; tS = scale; kick();
  });
  el.addEventListener('pointerleave', () => { el.classList.remove('is-live'); tRX = tRY = tHX = tHY = 0; tS = 1; rect = null; kick(); });
}

export default {
  id: 'mood-cases',
  n: 'M13',
  title: 'Hitos',
  pol: 'mood',
  app: 'progreso',
  bridge: 'Seis casos abiertos. Se cierran con datos, no con ganas.',

  render(ctx) {
    const cards = CASES.map((k) => `
      <article class="fp-mb-case" data-rarity="${k.rarity}" data-case="${k.id}" tabindex="0" aria-label="${ctx.ui.esc(k.title)}: ${ctx.ui.esc(k.sub)}">
        <div class="fp-mb-case__tilt">
          <div class="fp-mb-case__art" data-tint="${k.tint}"><div class="fp-mb-case__glyph">${ctx.icon(k.glyph, 96)}</div></div>
          <div class="fp-mb-case__foil"></div><div class="fp-mb-case__glare"></div><div class="fp-mb-case__frame"></div>
          <div class="fp-mb-case__seal">Case</div><div class="fp-mb-case__stars">${k.stars}</div>
          <div class="fp-mb-case__live fp-data" data-live>—</div>
          <div class="fp-mb-case__plate"><h3>${ctx.ui.esc(k.title)} ${ctx.ui.tag(k.tag)}</h3><p>${ctx.ui.esc(k.sub)}</p><div class="fp-mb-case__bar"><i data-bar></i></div></div>
        </div>
      </article>`).join('');
    return `
      <div class="fp-mb-cases">
        <span class="fp-mb-cases__ghost" aria-hidden="true">Casos</span>
        <div class="fp-wrap fp-wrap--wide">
          <header class="fp-head">
            <span class="fp-eyebrow"><b>M13</b> Hitos · casos abiertos</span>
            <h2 data-fp-fade>Los <em>casos</em> que quiero cerrar.</h2>
            <p class="fp-lede" data-fp-fade>Como las case cards de South Hustles, pero cada una es un objetivo medible del método. El número de arriba a la derecha es el último dato real del vault.</p>
          </header>
          <div class="fp-mb-cases__shelf">${cards}</div>
          <p class="fp-small fp-mb-cases__note" data-demo-note hidden>${ctx.ui.demoChip()} Algunos valores salen de los datos de ejemplo.</p>
        </div>
      </div>`;
  },

  init(el, ctx) {
    if (ctx.env.fxEnabled()) el.querySelectorAll('.fp-mb-case').forEach((c) => holoTilt(c));
    el.querySelectorAll('.fp-mb-case').forEach((c) => {
      c.addEventListener('click', () => ctx.openApp('progreso'));
      c.addEventListener('keydown', (e) => { if (e.key === 'Enter') ctx.openApp('progreso'); });
    });

    let symCache = { id: null, v: null };
    const paint = () => {
      const { days = [], profile, sessions = [] } = ctx.state;
      const today = ctx.M.todayISO();
      const set = (id, txt, pct) => {
        const card = el.querySelector(`[data-case="${id}"]`); if (!card) return;
        card.querySelector('[data-live]').textContent = txt;
        card.querySelector('[data-bar]').style.width = `${Math.max(0, Math.min(100, pct || 0))}%`;
      };
      let demo = false;
      // dominadas: mejor serie de las últimas 2 semanas
      const pu = ctx.M.setsOf(days, ctx.M.addDays(today, -13), today).filter((x) => x.ex === 'pullup' || x.ex === 'pullup_close');
      if (pu.length) { const best = Math.max(...pu.map((x) => +x.reps || 0)); set('pullups', `${best} reps`, (best / 11) * 100); demo ||= days.some((d) => d.demo && (d.sets || []).some((x) => x.ex === 'pullup')); } else set('pullups', '—', 0);
      // peso actual vs meta
      const w = ctx.M.currentWeight(days, profile);
      if (w != null) { const target = profile?.goal?.targetRange?.[0] || 65; const start = 57; set('weight', `${ctx.ui.fmt(w, 1)} kg`, ((w - start) / (target - start)) * 100); demo ||= days.some((d) => d.demo && d.checkin?.weightKg); } else set('weight', '— kg', 0);
      // diamante
      const di = ctx.M.setsOf(days, ctx.M.addDays(today, -13), today).filter((x) => x.ex === 'pushup_diamond');
      if (di.length) { const best = Math.max(...di.map((x) => +x.reps || 0)); set('diamond', `${best} reps`, (best / 17) * 100); } else set('diamond', '—', 0);
      // plancha lateral: mejor tiempo registrado (reps = segundos en ejercicios «hold»)
      const pl = ctx.M.setsOf(days, ctx.M.addDays(today, -13), today).filter((x) => x.ex === 'side_plank_abd');
      if (pl.length) { const best = Math.max(...pl.map((x) => +x.reps || 0)); set('plank', `${best} s`, (best / 45) * 100); } else set('plank', '— s', 0);
      // proteína: días ≥ 100 g en los últimos 7 con comidas
      const last7 = days.filter((d) => d.date > ctx.M.addDays(today, -7) && d.date <= today && (d.meals || []).length);
      if (last7.length) { const ok = last7.filter((d) => ctx.M.dayProtein(d) >= 100).length; set('protein', `${ok}/7`, (ok / 6) * 100); } else set('protein', '—/7', 0);
      // simetría: última sesión de Motion Lab (estimada)
      const s = sessions[0];
      if (s) {
        if (symCache.id !== s.id) { try { symCache = { id: s.id, v: ctx.ml.metrics(s).symmetryPct }; } catch { symCache = { id: s.id, v: null }; } }
        set('symmetry', symCache.v != null ? `${symCache.v} %` : '—', symCache.v || 0);
        demo ||= !!s.demo;
      } else set('symmetry', '— %', 0);
      el.querySelector('[data-demo-note]').hidden = !demo;
    };
    paint();
    ctx.onData(paint);
  },
};
