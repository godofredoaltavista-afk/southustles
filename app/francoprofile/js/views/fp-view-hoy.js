// FP · VISTA HOY — el Inicio de Moyon Lab (motion-lab/app/js/ui/home.js + hero.js) con los datos de Franco.
// Ancla: titular que se tipea + subtítulo serif con saludo por franja horaria y reloj, 4 tarjetas de acción en Bebas
// con caja de detección que pasa sola (ENTRENÁ · REGISTRÁ · ANALIZÁ · COMPARÁ), motivo ① ② ③, y la LENTE central:
// el boxer.json real de Motion Lab hecho partículas en canvas 2D, empañado que se limpia con el mouse, esquinas de visor.
// Ventanas: Racha (LED + calor de 12 semanas) · Hoy (LED) · Qué toca hoy · Checklist (escribe en el vault) ·
// Planificador (sugerencias con su «por qué») · Manifiesto.
console.log('[fp/view-hoy] init');

const DEF = {
  racha: { x: 0.635, y: 0.025, w: 0.175, h: 0.3 },
  hoy: { x: 0.815, y: 0.025, w: 0.177, h: 0.3 },
  toca: { x: 0.635, y: 0.345, w: 0.357, h: 0.25 },
  checklist: { x: 0.635, y: 0.615, w: 0.357, h: 0.37 },
  planner: { x: 0.012, y: 0.66, w: 0.325, h: 0.325 },
  manifiesto: { x: 0.35, y: 0.745, w: 0.27, h: 0.24 },
};

const BONES_SAMPLES = 22;

export default {
  id: 'hoy', title: 'Hoy', icon: 'hoy', theme: 'light', hint: 'Qué toca, checklist y racha',

  /* ── ancla: hero + lente ── */
  async anchor(el, ctx) {
    const { icon, esc } = ctx.ui;
    el.classList.add('fp-home');
    el.innerHTML = `
      <div class="fp-home__hero">
        <p class="fp-kicker">${icon('lab', 14)} Franco · perfil vivo · South Hustles Biometric</p>
        <h1 class="fp-home__title" aria-live="polite"><span data-fp-type>Entrenando duro.</span><i class="fp-caret" aria-hidden="true"></i></h1>
        <p class="fp-home__sub" data-fp-sub></p>
        <nav class="fp-acts" aria-label="Acciones">
          ${[
            ['entrena', 'ENTRENÁ', 'La sesión de hoy con tempo 3-1-1', '#/sesion'],
            ['registra', 'REGISTRÁ', 'Check-in de 30 s · comida · agua', '#/checkin'],
            ['analiza', 'ANALIZÁ', 'Tu JSON de Motion Lab, cuadro a cuadro', '#/lab'],
            ['compara', 'COMPARÁ', 'Peso, medidas y vs tu sesión anterior', '#/progreso'],
          ].map(([k, b, s, h]) => `<a class="fp-action-card" href="${h}" data-act="${k}"><span class="fp-action-card__in"><b>${b}</b><small>${esc(s)}</small><i class="fp-action-card__glare"></i><span class="fp-bx" aria-hidden="true"><i></i><i></i><i></i><i></i><em>${k} 0.99</em></span></span></a>`).join('')}
        </nav>
        <p class="fp-motif" aria-hidden="true"><span>①</span><span>②</span><span>③</span><em>Entrená</em><i class="fp-motif__line"></i><b>✳</b><em>Recuperá</em></p>
        <p class="fp-home__status fp-data" data-fp-status></p>
      </div>
      <div class="fp-lens" data-fp-lens>
        <canvas></canvas>
        <div class="fp-lens__glass"></div>
        <span class="fp-lens__c" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        <span class="fp-lens__tag fp-data">persona 0.96</span>
        <span class="fp-lens__hint">lente · pasá el mouse para limpiarlo</span>
        <span class="fp-lens__read fp-data">X:0.50 Y:0.50</span>
      </div>`;

    // tarjetas: tilt + caja de detección que pasa sola cada 1 s (del reel de Moyon)
    const cards = [...el.querySelectorAll('.fp-action-card')];
    cards.forEach((c) => ctx.ui.tilt(c.querySelector('.fp-action-card__in'), { max: 12, scale: 1.035 }));
    let scanI = 0, hover = false;
    const actsNav = el.querySelector('.fp-acts');
    actsNav.addEventListener('pointerenter', () => { hover = true; cards.forEach((c) => c.classList.remove('scan')); });
    actsNav.addEventListener('pointerleave', () => { hover = false; });
    setInterval(() => {
      if (hover || el.offsetParent === null || ctx.env.prefersReducedMotion()) return;
      cards.forEach((c, i) => c.classList.toggle('scan', i === scanI));
      const tag = cards[scanI].querySelector('.fp-bx em');
      tag.textContent = `${cards[scanI].dataset.act} 0.${90 + Math.floor(Math.random() * 10)}`;
      scanI = (scanI + 1) % cards.length;
    }, 1000);

    // titular que se tipea (frases de Franco) + subtítulo con saludo y reloj
    const typeEl = el.querySelector('[data-fp-type]');
    const subEl = el.querySelector('[data-fp-sub]');
    const statusEl = el.querySelector('[data-fp-status]');
    const phrases = () => {
      const st = ctx.state; const pd = ctx.M.planFor(ctx.M.todayISO(), ctx.data, st.profile);
      return [
        `${ctx.M.greeting()}, Franco.`,
        pd?.train ? `Hoy toca ${pd.title.toLowerCase()}.` : 'Hoy toca descansar.',
        'Tres fases, un solo tempo.',
        'Entrenando duro, durmiendo duro.',
      ];
    };
    const paintSub = () => {
      const d = new Date();
      const hh = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      subEl.textContent = `${ctx.M.fmtDate(ctx.M.todayISO(), { long: true })} · ${hh} · tecnología interconectada con tu cuerpo`;
    };
    paintSub();
    setInterval(paintSub, 30000);
    if (ctx.env.prefersReducedMotion()) typeEl.textContent = phrases()[0];
    else {
      let pi = 0, ci = 0, del = false;
      const tick = () => {
        const list = phrases();
        const p = list[pi % list.length];
        if (el.offsetParent === null) { setTimeout(tick, 800); return; }
        ci += del ? -1 : 1;
        typeEl.textContent = p.slice(0, Math.max(0, ci));
        el.querySelector('.fp-home__title').classList.toggle('typing', !del && ci < p.length);
        let d = del ? 22 : 46;
        if (!del && ci >= p.length) { d = 2400; del = true; }
        else if (del && ci <= 0) { del = false; pi++; d = 300; }
        setTimeout(tick, d);
      };
      setTimeout(tick, 600);
    }
    const paintStatus = () => {
      const st = ctx.state;
      const n = (st.days || []).length, s = (st.sessions || []).length;
      statusEl.textContent = `vault listo · ${n} día${n === 1 ? '' : 's'} · ${s} sesión${s === 1 ? '' : 'es'} de Motion Lab · solo en este navegador`;
    };
    paintStatus();
    ctx.onData(paintStatus);

    // lente
    try { await initLens(el.querySelector('[data-fp-lens]'), ctx); } catch (e) { console.warn('[fp/view-hoy] lente', e); }
  },

  windows(ctx) {
    const { icon, esc, fmt } = ctx.ui;
    const M = ctx.M;
    const today = () => M.todayISO();
    const dayOf = (st, iso) => (st.days || []).find((d) => d.date === iso);

    return [
      /* ── Racha ── */
      {
        id: 'racha', title: 'Racha', icon: 'flame', def: DEF.racha, glass: 1, minW: 210, minH: 170,
        async mount(body) {
          const paint = async () => {
            const st = await ctx.load();
            const sk = M.streak(st.days, st.profile, today());
            const by = new Map(st.days.map((d) => [d.date, d]));
            const start = M.addDays(today(), -83);
            const cells = [];
            for (let i = 0; i < 84; i++) {
              const iso = M.addDays(start, i); const d = by.get(iso);
              const lvl = !d ? 0 : M.dayTrained(d) ? (d.sets?.length > 12 ? 4 : d.sets?.length > 6 ? 3 : 2) : (d.intake?.creatine ? 1 : 0);
              cells.push(`<i class="l${lvl}${iso === today() ? ' today' : ''}${d?.demo ? ' demo' : ''}" title="${M.fmtDate(iso)}${d ? (M.dayTrained(d) ? ' · entrenó' : ' · hábitos') : ''}"></i>`);
            }
            const trainedDays = st.days.filter((d) => M.dayTrained(d)).length;
            body.innerHTML = `<div class="fp-rk"><canvas class="fp-led fp-led--xl" data-led aria-label="Racha: ${sk.count} días"></canvas><small>día${sk.count === 1 ? '' : 's'} seguidos</small></div>
              <div class="fp-heat" role="img" aria-label="Últimas 12 semanas">${cells.join('')}</div>
              <p class="fp-small">${trainedDays} días entrenados · ${esc(sk.rule)}</p>`;
            requestAnimationFrame(() => ctx.led.drawLED(body.querySelector('[data-led]'), String(sk.count).padStart(2, '0'), ledOpts(ctx)));
          };
          await paint();
          ctx.onData(paint);
          ctx.theme.onThemeChange(paint, false);
        },
      },
      /* ── Hoy (LED) ── */
      {
        id: 'hoy', title: 'Hoy', icon: 'check', def: DEF.hoy, glass: 1, minW: 200, minH: 170,
        async mount(body) {
          const paint = async () => {
            const st = await ctx.load();
            const d = dayOf(st, today());
            const sets = d?.sets?.length || 0;
            const prot = M.dayProtein(d);
            const water = M.dayWater(d);
            const exs = [...new Set((d?.sets || []).map((s) => ctx.data.exById[s.ex]?.name).filter(Boolean))];
            body.innerHTML = `<div class="fp-big3">
                <div><canvas class="fp-led" data-v="${sets}"></canvas><small>series</small></div>
                <div><canvas class="fp-led" data-v="${Math.round(prot)}"></canvas><small>proteína g</small></div>
              </div>
              <div class="fp-big3">
                <div><canvas class="fp-led" data-v="${fmt(water, 2).replace(',', '.')}"></canvas><small>agua L</small></div>
                <div><canvas class="fp-led" data-v="${d?.intake?.creatine ? 'OK' : '--'}"></canvas><small>creatina</small></div>
              </div>
              <p class="fp-small">${exs.length ? esc(exs.join(' · ')) : 'Hoy todavía no registraste series.'}</p>`;
            requestAnimationFrame(() => body.querySelectorAll('canvas[data-v]').forEach((c) => ctx.led.drawLED(c, c.dataset.v, ledOpts(ctx))));
          };
          await paint();
          ctx.onData(paint);
          ctx.theme.onThemeChange(paint, false);
        },
      },
      /* ── Qué toca hoy ── */
      {
        id: 'toca', title: 'Qué toca hoy', icon: 'plan', def: DEF.toca, glass: 1, minW: 300, minH: 170,
        async mount(body) {
          const paint = async () => {
            const st = await ctx.load();
            const iso = today();
            const pd = M.planFor(iso, ctx.data, st.profile);
            const d = dayOf(st, iso);
            const blocks = d?.blocks || {};
            if (!pd?.train) {
              body.innerHTML = `<div class="fp-win-section"><p class="fp-eyebrow">${esc(pd?.name || '')}</p><h3 class="fp-win-title">${esc(pd?.title || 'Descanso')}</h3><p class="fp-lede-s">${esc(pd?.rest || 'Descanso.')}</p><p class="fp-small">El músculo se construye recuperando, no rompiendo.</p></div>`;
              return;
            }
            body.innerHTML = `<div class="fp-toca">
                <div class="fp-toca__head"><div><p class="fp-eyebrow">${esc(pd.name)}${pd.variant ? ' · variante [?]' : ''}</p><h3 class="fp-win-title">${esc(pd.title)}</h3></div>
                <a class="fp-btn fp-btn--action fp-btn--accent" href="#/sesion" data-fp-magnetic>ENTRENÁ</a></div>
                <div class="fp-toca__blocks">${ctx.data.plan.blocks.map((b) => `<label class="fp-check"><input type="checkbox" data-block="${b.id}" ${blocks[b.id] ? 'checked' : ''} /><span class="fp-check__box"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></svg></span><span class="fp-check__t">${esc(b.name)}</span><span class="fp-check__s">${b.min[0]}–${b.min[1]}′</span></label>`).join('')}</div>
                <ol class="fp-mini-list">${pd.items.slice(0, 6).map((it) => { const ex = ctx.data.exById[it.ex]; const done = (d?.sets || []).filter((s) => s.ex === it.ex).length; return `<li><span>${it.pair ? `<b class="fp-data">${it.pair}</b> ` : ''}${esc(ex?.name || it.ex)}</span><span class="fp-data">${done ? `<i class="fp-ok-dot"></i>${done}/` : ''}${it.sets} × ${esc(it.reps)}</span></li>`; }).join('')}</ol>
                <p class="fp-small">Bolsa: ${esc(pd.bag || '—')}</p>
              </div>`;
            body.querySelectorAll('input[data-block]').forEach((cb) => cb.addEventListener('change', async () => {
              await ctx.store.updateDay(iso, (day) => { day.blocks = { ...day.blocks, [cb.dataset.block]: cb.checked }; });
              if (cb.checked && !ctx.env.prefersReducedMotion()) cb.closest('.fp-check').animate([{ transform: 'scale(1.04)', boxShadow: '0 0 0 2px rgba(34,211,107,0.6)' }, { transform: 'none', boxShadow: '0 0 0 0 rgba(34,211,107,0)' }], { duration: 520, easing: 'cubic-bezier(0.16,1,0.3,1)' });
            }));
            ctx.ui.enhance(body);
          };
          await paint();
          ctx.onData(paint);
        },
      },
      /* ── Checklist del día ── */
      {
        id: 'checklist', title: 'Checklist del día', icon: 'check', def: DEF.checklist, glass: 1, minW: 300, minH: 220,
        async mount(body) {
          const paint = async () => {
            const st = await ctx.load();
            const iso = today();
            const d = dayOf(st, iso);
            const tgtW = st.profile?.intake?.waterL || 3;
            const [pLo, pHi] = st.profile?.intake?.proteinG || [110, 130];
            const water = M.dayWater(d);
            const prot = M.dayProtein(d);
            const adh = M.adherence(st.days, st.profile, iso, 14);
            body.innerHTML = `<div class="fp-cl">
                <div class="fp-cl__row">
                  <span class="fp-cl__ico">${icon('drop', 20)}</span>
                  <div class="fp-cl__main"><b>Agua</b><div class="fp-bar ${water >= tgtW ? 'fp-bar--ok' : ''}" style="--v:${Math.min(100, (water / tgtW) * 100)}"><i></i></div></div>
                  <span class="fp-data fp-cl__v">${fmt(water, 2)} / ${fmt(tgtW)} L</span>
                  <span class="fp-cl__btns"><button type="button" class="fp-btn fp-btn--sm fp-btn--icon" data-water="-0.25" aria-label="Restar 250 ml">${icon('minus', 15)}</button><button type="button" class="fp-btn fp-btn--sm" data-water="0.25" aria-label="Sumar 250 ml">+0,25</button></span>
                </div>
                <label class="fp-check"><input type="checkbox" data-creatine ${d?.intake?.creatine ? 'checked' : ''} /><span class="fp-check__box"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></svg></span><span class="fp-check__t">Creatina ${fmt(st.profile?.intake?.creatineG || 5)} g</span><span class="fp-check__s">sin timing · constancia</span></label>
                <div class="fp-cl__row">
                  <span class="fp-cl__ico">${icon('comida', 20)}</span>
                  <div class="fp-cl__main"><b>Proteína</b><div class="fp-bar ${prot >= pLo ? 'fp-bar--ok' : ''}" style="--v:${Math.min(100, (prot / pHi) * 100)}"><i></i></div></div>
                  <span class="fp-data fp-cl__v">${Math.round(prot)} / ${pLo}–${pHi} g</span>
                  <span class="fp-cl__btns"><button type="button" class="fp-btn fp-btn--sm" data-prot="25">+25 g</button><a class="fp-btn fp-btn--sm fp-btn--icon" href="#/comida" aria-label="Cargar comida con foto">${icon('camera', 15)}</a></span>
                </div>
                <div class="fp-gauges fp-gauges--row">
                  <div class="fp-gauge-cell">${ctx.ui.gauge({ value: prot, max: 150, band: [pLo, pHi], label: 'Proteína', unit: 'g', size: 'sm', status: prot >= pLo ? 'ok' : '' , display: String(Math.round(prot)) })}<span class="fp-gauge-cell__name">Proteína</span></div>
                  <div class="fp-gauge-cell">${ctx.ui.gauge({ value: water, max: tgtW, label: 'Agua', unit: 'L', size: 'sm', status: water >= tgtW ? 'ok' : '', display: fmt(water, 1) })}<span class="fp-gauge-cell__name">Agua</span></div>
                  <div class="fp-gauge-cell">${ctx.ui.gauge({ value: adh.pct, max: 100, label: 'Adherencia 14 días', unit: '%', size: 'sm', status: adh.pct >= 80 ? 'ok' : adh.pct >= 50 ? 'warn' : '' })}<span class="fp-gauge-cell__name">Adherencia</span><span class="fp-gauge-cell__t">${adh.done}/${adh.planned} entrenos</span></div>
                </div>
              </div>`;
            body.querySelectorAll('[data-water]').forEach((b) => b.addEventListener('click', () => ctx.store.updateDay(iso, (day) => { day.intake = { ...day.intake, waterL: Math.max(0, Math.round(((+day.intake?.waterL || 0) + +b.dataset.water) * 100) / 100) }; })));
            body.querySelector('[data-creatine]').addEventListener('change', (e) => ctx.store.updateDay(iso, (day) => { day.intake = { ...day.intake, creatine: e.target.checked }; }));
            body.querySelector('[data-prot]').addEventListener('click', () => ctx.store.updateDay(iso, (day) => {
              day.meals = [...(day.meals || []), { id: ctx.env.uid('meal'), slot: 'otro', time: new Date().toTimeString().slice(0, 5), name: 'Carga rápida', photoId: null, guideText: '', proteinG: 25, kcal: null, notes: 'desde Hoy' }];
            }).then(() => ctx.ui.toast('+25 g de proteína anotados.', 'ok')));
          };
          await paint();
          ctx.onData(paint);
        },
      },
      /* ── Planificador ── */
      {
        id: 'planner', title: 'Planificador', icon: 'sparkle', def: DEF.planner, glass: 1, minW: 280, minH: 160,
        async mount(body) {
          const paint = async () => {
            const st = await ctx.load();
            const sug = ctx.planner.suggest({ days: st.days, data: ctx.data, profile: st.profile });
            const demo = st.days.some((d) => d.demo);
            body.innerHTML = `${demo ? `<p class="fp-small">${ctx.ui.demoChip()} incluye datos de ejemplo</p>` : ''}<ul class="fp-sug">${sug.map((s) => `<li class="fp-sug__i fp-sug__i--${s.level}"><details><summary><i></i><b>${esc(s.title)}</b></summary><p><span>Por qué:</span> ${esc(s.why)}</p><p><span>Qué hacer:</span> ${esc(s.then)}</p></details></li>`).join('')}</ul><p class="fp-small">Reglas explicables (02 §6.4). Sin IA, sin diagnósticos.</p>`;
            const first = body.querySelector('details'); if (first) first.open = true;
          };
          await paint();
          ctx.onData(paint);
        },
      },
      /* ── Manifiesto ── */
      {
        id: 'manifiesto', title: 'Manifiesto', icon: 'info', def: DEF.manifiesto, glass: 2, minW: 220, minH: 120,
        mount(body) {
          body.innerHTML = `<div class="fp-manifiesto">
              <p class="fp-manifiesto__q">¿Por qué un perfil vivo?</p>
              <p class="fp-manifiesto__eq">Un registro = una memoria = un coach que sabe a quién le habla.</p>
              <p class="fp-manifiesto__b">El espejo te muestra cómo te ves. Esto guarda cómo entrenás, comés y dormís — para ajustar con datos, no con suposiciones.</p>
              <p class="fp-manifiesto__m">Entrenando duro, durmiendo duro.</p>
            </div>`;
        },
      },
    ];
  },
};

function ledOpts(ctx) {
  const dark = ctx.theme.isDark();
  return dark ? { on: ctx.led.accentColor(), glow: 12 } : { ink: true };
}

/* ── LENTE: el boxer.json de Motion Lab hecho partículas (canvas 2D, un solo rAF, se pausa fuera de pantalla) ── */
async function initLens(host, ctx) {
  const cv = host.querySelector('canvas');
  const c = cv.getContext('2d');
  const read = host.querySelector('.fp-lens__read');
  const tag = host.querySelector('.fp-lens__tag');
  const raw = await ctx.data.boxer();
  const n = ctx.ml.normalize(raw, 'boxer.json');
  if (!n.ok) return;
  const S = n.session;
  const F = S.frames;
  const J = ctx.ml.J;
  // partículas sobre cada hueso + aura alrededor del torso
  let seed = 11;
  const R = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const parts = [];
  for (const [a, b, side] of ctx.ml.BONES) {
    for (let k = 0; k < BONES_SAMPLES; k++) parts.push({ a: J[a], b: J[b], t: R(), jx: (R() - 0.5) * 0.05, jy: (R() - 0.5) * 0.05, side, s: 0.8 + R() * 1.8, ph: R() * 6.28 });
  }
  for (let k = 0; k < 420; k++) parts.push({ aura: true, u: R(), v: R(), jx: (R() - 0.5) * 0.5, jy: (R() - 0.5) * 0.9, s: 0.6 + R() * 1.4, ph: R() * 6.28, side: R() < 0.2 ? 'A' : 'G' });
  // caja de encuadre
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const f of F) for (const p of f.pts) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
  const COL = { L: '#2f7bff', R: '#ff3b30', C: '#22d36b', G: '#c9b8a6', A: null };
  let mouse = { x: 0.5, y: 0.5, on: false }, sm = { x: 0.5, y: 0.5 };
  host.addEventListener('pointermove', (e) => {
    const r = host.getBoundingClientRect();
    mouse = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height, on: true };
    host.style.setProperty('--dx', `${(mouse.x * 100).toFixed(1)}%`);
    host.style.setProperty('--dy', `${(mouse.y * 100).toFixed(1)}%`);
    read.textContent = `X:${mouse.x.toFixed(2)} Y:${mouse.y.toFixed(2)}`;
  });
  host.addEventListener('pointerleave', () => { mouse.on = false; });
  let raf = 0, visible = true, t0 = performance.now();
  const draw = (now) => {
    raf = 0;
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    const W = Math.max(1, Math.round(host.clientWidth * dpr)), H = Math.max(1, Math.round(host.clientHeight * dpr));
    if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
    const t = (now - t0) / 1000;
    const fi = Math.floor((t * S.fps) % F.length);
    const f = F[fi];
    const accent = ctx.led.accentColor();
    // fondo de lente: pozo oscuro rojizo (como en Moyon)
    const g = c.createRadialGradient(W * 0.5, H * 0.48, 10, W * 0.5, H * 0.5, Math.max(W, H) * 0.7);
    g.addColorStop(0, '#2a1612'); g.addColorStop(0.55, '#140d0b'); g.addColorStop(1, '#070707');
    c.globalCompositeOperation = 'source-over';
    c.globalAlpha = 1;
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    // horizonte y piso
    c.strokeStyle = 'rgba(224,96,64,0.18)'; c.lineWidth = 1 * dpr; c.beginPath();
    const hz = H * 0.8;
    for (let k = -10; k <= 10; k++) { c.moveTo(W / 2 + k * 6 * dpr, hz); c.lineTo(W / 2 + k * W * 0.12, H); }
    c.moveTo(0, hz); c.lineTo(W, hz); c.stroke();
    // encuadre
    const bw = x1 - x0, bh = y1 - y0, sc = Math.min(W / (bw * 1.9), H / (bh * 1.35));
    const ox = W / 2 - (x0 + bw / 2) * sc + (sm.x - 0.5) * 18 * dpr, oy = H * 0.48 - (y0 + bh / 2) * sc + (sm.y - 0.5) * 12 * dpr;
    sm.x += (mouse.x - sm.x) * 0.06; sm.y += (mouse.y - sm.y) * 0.06;
    const mxp = mouse.x * W, myp = mouse.y * H;
    c.globalCompositeOperation = 'lighter';
    const hipC = [(f.pts[J.l_hip][0] + f.pts[J.r_hip][0]) / 2, (f.pts[J.l_hip][1] + f.pts[J.r_hip][1]) / 2];
    const shC = [(f.pts[J.l_shoulder][0] + f.pts[J.r_shoulder][0]) / 2, (f.pts[J.l_shoulder][1] + f.pts[J.r_shoulder][1]) / 2];
    for (const p of parts) {
      let x, y;
      if (p.aura) {
        x = hipC[0] + (shC[0] - hipC[0]) * p.u + p.jx * 0.6;
        y = hipC[1] + (shC[1] - hipC[1]) * p.u + p.jy * 0.55 + Math.sin(t * 0.8 + p.ph) * 0.02;
      } else {
        const A = f.pts[p.a], B = f.pts[p.b];
        x = A[0] + (B[0] - A[0]) * p.t + p.jx * 0.4; y = A[1] + (B[1] - A[1]) * p.t + p.jy * 0.4;
      }
      let X = x * sc + ox, Y = y * sc + oy;
      // el mouse descompone las partículas cerca
      if (mouse.on) { const dx = X - mxp, dy = Y - myp, d = Math.hypot(dx, dy); const rr = 70 * dpr; if (d < rr && d > 0) { const k = (1 - d / rr) * 18 * dpr; X += (dx / d) * k; Y += (dy / d) * k; } }
      const col = p.side === 'A' ? accent : COL[p.side];
      c.globalAlpha = p.aura ? 0.18 + 0.12 * Math.sin(t * 2 + p.ph) : 0.75;
      c.fillStyle = col;
      const s = p.s * dpr;
      c.fillRect(X, Y, s, s);
    }
    // ángulo del codo en caja negra (Estudio)
    const ang = ctx.ml.anglesOf(f);
    const el = f.pts[J.r_elbow];
    c.globalCompositeOperation = 'source-over';
    if (ang.codo_der != null) {
      const ex = el[0] * sc + ox + 14 * dpr, ey = el[1] * sc + oy - 10 * dpr;
      c.font = `600 ${11 * dpr}px "JetBrains Mono", monospace`;
      const txt = `${Math.round(ang.codo_der)}`; const tw = c.measureText(txt).width + 10 * dpr;
      c.globalAlpha = 0.85; c.fillStyle = '#000'; c.fillRect(ex, ey, tw, 17 * dpr);
      c.strokeStyle = 'rgba(255,255,255,0.4)'; c.strokeRect(ex, ey, tw, 17 * dpr);
      c.globalAlpha = 1; c.fillStyle = '#fff'; c.fillText(txt, ex + 5 * dpr, ey + 12.5 * dpr);
    }
    // retícula del mouse
    if (mouse.on) { c.strokeStyle = accent; c.globalAlpha = 0.8; c.lineWidth = 1.2 * dpr; c.beginPath(); c.arc(mxp, myp, 26 * dpr, 0, Math.PI * 2); c.stroke(); c.globalAlpha = 1; }
    if (fi % 15 === 0) tag.textContent = `persona 0.${92 + (fi % 7)}`;
    if (visible && !ctx.env.prefersReducedMotion()) raf = requestAnimationFrame(draw);
  };
  const io = new IntersectionObserver((e) => { visible = e[0].isIntersecting && host.offsetParent !== null; if (visible && !raf) raf = requestAnimationFrame(draw); }, { threshold: 0 });
  io.observe(host);
  raf = requestAnimationFrame(draw);
}
