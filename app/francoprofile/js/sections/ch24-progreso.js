// FP · CH24 · PROGRESO — sparklines SVG del vault (peso + media móvil 7 días + banda de la meta, proteína, sueño),
// medidores de adherencia (ScoreGauge de Apacheta), racha en LED de puntos (led.js de Motion Lab) y
// «vs tu sesión anterior» (reproductor de Motion Lab: barra con delta % que se anima 900 ms).
// Sin datos → estado vacío con CTA. Si son de ejemplo → chip EJEMPLO.
console.log('[fp/ch24-progreso] init');

export default {
  id: 'progreso',
  n: '24',
  title: 'Progreso',
  pol: 'invert',
  bg: 'grid',
  app: 'progreso',
  bridge: 'El progreso no se siente: se registra.',

  render(ctx) {
    const { tag } = ctx.ui;
    return `
<div class="fp-wrap fp-wrap--wide">
  <header class="fp-head" data-fp-fade>
    <span class="fp-eyebrow"><b>24</b> Progreso</span>
    <h2>Lo que <em>dicen</em> los números.</h2>
    <p class="fp-lede">Peso con promedio de 7 días (la tendencia manda, no el día), proteína, sueño, adherencia y Motion Lab. Todo sale de tu vault, en este dispositivo ${tag('C')}.</p>
  </header>
  <div class="fp-prog" data-fp-prog></div>
</div>`;
  },

  init(el, ctx) {
    const root = el.querySelector('[data-fp-prog]');
    const { ui, M } = ctx;

    const card = (cls, inner) => `<article class="fp-card fp-prog__card ${cls}" data-fp-fade>${inner}</article>`;

    const paint = () => {
      const days = ctx.state.days || [];
      const profile = ctx.state.profile || {};
      const sessions = ctx.state.sessions || [];
      const today = M.todayISO();
      const from = M.addDays(today, -27);
      const recent = days.filter((d) => d.date >= from && d.date <= today);
      const anyDemo = recent.some((d) => d.demo) || sessions.some((s) => s.demo);
      const chip = anyDemo ? ui.demoChip() : '';

      if (!recent.length && !sessions.length) {
        root.innerHTML = `<div class="fp-empty fp-prog__empty"><b>Todavía no hay datos para graficar.</b>
          Registrá un check-in con tu peso en ayunas, una comida y una sesión. O mirá cómo se ve con datos de ejemplo.
          <div class="fp-row"><a class="fp-btn fp-btn--primary fp-btn--sm" href="#/checkin">Cargá tu primer dato</a>
          <button type="button" class="fp-btn fp-btn--sm" data-prog-demo>Ver con ejemplo</button></div></div>`;
        root.querySelector('[data-prog-demo]')?.addEventListener('click', async () => {
          const { loadDemo } = await import('../core/fp-demo.js');
          await loadDemo(ctx.data);
          ui.toast('Cargué 14 días de EJEMPLO. Se borran desde el Vault.', 'ok');
        });
        return;
      }

      // peso
      const ws = M.weightSeries(recent, profile);
      const ma = M.movingAvg(ws, 7);
      const target = profile.goal?.targetRange || [65, 65.5];
      const wNow = ws.length ? ws[ws.length - 1].kg : null;
      const wFirst = ws.length ? ws[0].kg : null;
      const dW = wNow != null && wFirst != null ? Math.round((wNow - wFirst) * 10) / 10 : null;
      const weight = ws.length
        ? `<div class="fp-row fp-row--between"><span class="fp-card__k">peso · 28 días</span>${chip}</div>
           <div class="fp-prog__big"><b class="fp-display">${ui.fmt(wNow, 1)}</b><span>kg</span><em class="${dW > 0 ? 'is-up' : dW < 0 ? 'is-down' : ''}">${dW == null ? '' : `${dW > 0 ? '+' : ''}${ui.fmt(dW, 1)} kg`}</em></div>
           ${ui.spark(ws.map((p) => p.kg), { avg: ma.map((p) => p.kg), band: target, h: 90, w: 320 })}
           <p class="fp-small">Línea punteada: promedio 7 días. Banda verde: meta ${target.join('–')} kg ${ui.tag('U')}.</p>`
        : '<span class="fp-card__k">peso</span><div class="fp-empty"><b>Sin pesajes.</b>Pesate en ayunas y cargalo en el check-in. <a href="#/checkin">Check-in →</a></div>';

      // proteína / sueño
      const prot = recent.filter((d) => (d.meals || []).length).map((d) => M.dayProtein(d));
      const sleep = recent.filter((d) => d.checkin?.sleepH != null).map((d) => d.checkin.sleepH);
      const pAvg = prot.length ? Math.round(prot.reduce((a, b) => a + b, 0) / prot.length) : null;
      const sAvg = sleep.length ? Math.round((sleep.reduce((a, b) => a + b, 0) / sleep.length) * 10) / 10 : null;
      const protein = prot.length
        ? `<span class="fp-card__k">proteína diaria</span><div class="fp-prog__big"><b class="fp-display">${pAvg}</b><span>g prom.</span></div>${ui.spark(prot, { band: [110, 130], h: 60 })}<p class="fp-small">${prot.filter((p) => p >= 100).length}/${prot.length} días ≥ 100 g (objetivo: 6 de cada 7).</p>`
        : '<span class="fp-card__k">proteína</span><div class="fp-empty"><b>Sin comidas.</b><a href="#/comida">Cargar comida →</a></div>';
      const sleepC = sleep.length
        ? `<span class="fp-card__k">sueño</span><div class="fp-prog__big"><b class="fp-display">${ui.fmt(sAvg, 1)}</b><span>h prom.</span></div>${ui.spark(sleep, { band: [8, 9], h: 60 })}`
        : '<span class="fp-card__k">sueño</span><div class="fp-empty"><b>Sin noches.</b><a href="#/checkin">Check-in →</a></div>';

      // adherencia + tempo + racha
      const adh = M.adherence(days, profile, today, 14);
      const tAdh = M.tempoAdherence(days, M.addDays(today, -13), today);
      const st = M.streak(days, profile, today);
      const gauges = `<span class="fp-card__k">últimos 14 días</span>
        <div class="fp-prog__gauges">
          <div class="fp-gauge-cell">${ui.gauge({ value: adh.pct, max: 100, label: 'Adherencia al plan', unit: `${adh.done}/${adh.planned} entrenos`, display: `${adh.pct}%`, status: adh.pct >= 80 ? 'ok' : adh.pct >= 50 ? 'warn' : 'bad' })}<span class="fp-gauge-cell__name">Plan</span></div>
          <div class="fp-gauge-cell">${ui.gauge({ value: tAdh ?? 0, max: 100, label: 'Tempo 3-1-1', unit: 'de las series', display: tAdh == null ? '—' : `${tAdh}%`, status: tAdh >= 80 ? 'ok' : tAdh != null ? 'warn' : '' })}<span class="fp-gauge-cell__name">Tempo</span></div>
          <div class="fp-gauge-cell fp-prog__streak"><canvas class="fp-prog__led" width="160" height="56" aria-label="Racha: ${st.count} días"></canvas><span class="fp-gauge-cell__name">Racha</span><span class="fp-gauge-cell__t" title="${ui.esc(st.rule)}">días seguidos</span></div>
        </div>`;

      // vs tu sesión anterior
      let vs = '<span class="fp-card__k">vs tu sesión anterior</span><div class="fp-empty"><b>Hace falta dos sesiones del mismo ejercicio.</b>Importá tus JSON de Motion Lab. <a href="#/lab">Ir a Lab →</a></div>';
      const withPrev = sessions.map((s) => ({ s, cmp: ctx.ml.vsPrevious(sessions, s) })).find((x) => x.cmp && x.cmp.a != null);
      if (withPrev) {
        const { s, cmp } = withPrev;
        const pct = cmp.b ? Math.min(150, Math.round((cmp.a / cmp.b) * 100)) : 100;
        vs = `<div class="fp-row fp-row--between"><span class="fp-card__k">vs tu sesión anterior</span>${s.demo || cmp.prev.demo ? ui.demoChip() : ''}</div>
          <h3>${ui.esc(s.exerciseName)}</h3>
          <div class="fp-prog__vs"><div class="fp-prog__vsbar" style="--v:${Math.min(100, (pct / 150) * 100)};--p:${(100 / 150) * 100}"><i></i><b></b></div>
          <span class="fp-data">${cmp.a} ${ui.esc(cmp.unit)} · antes ${cmp.b} · <strong class="${cmp.delta >= 0 ? 'is-up' : 'is-down'}">${cmp.delta >= 0 ? '+' : ''}${cmp.delta}%</strong></span></div>`;
      } else if (sessions.length) {
        const s = sessions[0];
        vs = `<div class="fp-row fp-row--between"><span class="fp-card__k">última sesión Motion Lab</span>${s.demo ? ui.demoChip() : ''}</div>
          <h3>${ui.esc(s.exerciseName)}</h3><p class="fp-data">${ui.fmt(s.durationMs / 1000, 1)} s · ${s.frames?.length || 0} frames${s.kpi ? ` · ${s.kpi.value} ${ui.esc(s.kpi.unit)}` : ''}</p>
          <p class="fp-small">Con una segunda sesión del mismo ejercicio aparece la comparación.</p>`;
      }

      // medidas
      const meas = recent.filter((d) => d.measures);
      let measC = '';
      if (meas.length) {
        const a = meas[0].measures, b = meas[meas.length - 1].measures;
        const rows = [['armFlexedCm', 'Brazo tenso'], ['armRelaxedCm', 'Brazo relajado'], ['chestCm', 'Pecho'], ['waistCm', 'Cintura'], ['calfCm', 'Gemelo']]
          .filter(([k]) => b[k] != null)
          .map(([k, n]) => { const d = a[k] != null ? Math.round((b[k] - a[k]) * 10) / 10 : null; return `<tr><td>${n}</td><td class="fp-num fp-data">${ui.fmt(b[k], 1)} cm</td><td class="fp-num fp-data ${d > 0 ? 'is-up' : ''}">${d == null ? '—' : `${d > 0 ? '+' : ''}${ui.fmt(d, 1)}`}</td></tr>`; }).join('');
        measC = card('fp-prog__card--meas', `<span class="fp-card__k">medidas · cada 2 semanas</span><table class="fp-table"><thead><tr><th>Zona</th><th>Ahora</th><th>Δ</th></tr></thead><tbody>${rows}</tbody></table>`);
      }

      root.innerHTML = [
        card('fp-prog__card--weight', weight),
        card('fp-prog__card--gauges', gauges),
        card('', protein),
        card('', sleepC),
        card('fp-prog__card--vs', vs),
        measC,
      ].join('');

      const led = root.querySelector('.fp-prog__led');
      if (led) requestAnimationFrame(() => ctx.led.drawLED(led, String(st.count), { on: ctx.led.accentColor(), align: 'center', glow: ctx.theme.isDark() ? 12 : 4 }));
      ui.reveal(root);
      const bar = root.querySelector('.fp-prog__vsbar');
      if (bar) ctx.env.onVisible(bar, (v) => { if (v) bar.classList.add('is-on'); }, { threshold: 0.5 });
    };

    paint();
    ctx.onData(async () => { await ctx.load(); paint(); });
    ctx.theme.onThemeChange(() => {
      const led = root.querySelector('.fp-prog__led');
      if (led) ctx.led.drawLED(led, String(ctx.M.streak(ctx.state.days || [], ctx.state.profile, ctx.M.todayISO()).count), { on: ctx.led.accentColor(), align: 'center', glow: ctx.theme.isDark() ? 12 : 4 });
    }, false);
  },
};
