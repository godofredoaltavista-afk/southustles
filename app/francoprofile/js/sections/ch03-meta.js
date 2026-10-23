// FP · CH03 LA META — dos medidores conic (ScoreGauge de Apacheta: conic-gradient + máscara de anillo)
// sobre una escala de kg, y una línea de tiempo SVG hoy → 22/12 con la meta declarada [U] y el cono de la
// banda realista 0,5–1 kg/mes [C] (01 §7.6, D7). La app muestra la meta, no la promete.
console.log('[fp/ch03-meta] init');

const KG0 = 60, KG1 = 66; // escala de los medidores

export default {
  id: 'meta', n: '03', title: 'La meta', pol: 'theme', bg: 'grid', app: 'progreso',
  bridge: 'Una meta con fecha y una banda honesta al lado.',
  render(ctx) {
    const g = ctx.data.profile.goal;
    return `
    <div class="fp-wrap fpa-meta">
      <div class="fp-head">
        <span class="fp-eyebrow"><b>03</b> La meta</span>
        <h2>De acá al <em>22 de diciembre</em>.</h2>
        <p class="fp-lede">Meta de Franco: ${g.targetKg[0].toLocaleString('es-AR')}–${g.targetKg[1].toLocaleString('es-AR')} kg al 22/12/2026 ${ctx.ui.tag('U')}. Al lado, lo que la evidencia deja esperar: +${g.realistic.kgPerMonth[0].toLocaleString('es-AR')}–${g.realistic.kgPerMonth[1]} kg por mes de masa magra ${ctx.ui.tag('C')}. Las dos cosas se muestran juntas.</p>
      </div>
      <div class="fpa-meta__body" data-fpa-meta></div>
      <p class="fpa-meta__fine fp-small" data-fp-fade>${ctx.icon('info', 14)} La app no promete la meta. Cambios visibles: ${g.realistic.visibleWeeks.join('–')} semanas ${ctx.ui.tag('C')}. El «inflado» de la creatina es agua, no músculo nuevo.</p>
    </div>`;
  },

  async init(el, ctx) {
    const host = el.querySelector('[data-fpa-meta]');
    const paint = () => {
      const { profile, days } = ctx.state;
      const today = ctx.M.todayISO();
      const series = ctx.M.weightSeries(days || [], profile);
      const w = series.length ? series[series.length - 1] : null;
      const isDemo = !!w?.demo;
      const proj = ctx.M.projection(profile, w?.kg ?? null, today);
      host.innerHTML = w ? filled(ctx, w, proj, isDemo, series) : empty(ctx, proj);
      ctx.ui.reveal(host); ctx.ui.counters(host); ctx.ui.enhance(host);
      const svg = host.querySelector('.fpa-tl');
      if (svg && !ctx.env.prefersReducedMotion()) {
        ctx.env.onVisible(svg, (v) => { if (v) svg.classList.add('is-drawn'); }, { threshold: 0.35 });
      } else if (svg) svg.classList.add('is-drawn');
    };
    paint();
    ctx.onData(paint);
  },
};

function empty(ctx, proj) {
  return `
  <div class="fpa-meta__grid">
    <div class="fpa-meta__gauges" data-fp-fade>
      <div class="fp-gauge-cell">${ctx.ui.gauge({ value: proj.target[0] - KG0, max: KG1 - KG0, band: [proj.target[0] - KG0, proj.target[1] - KG0], size: 'lg', display: `${fmt(proj.target[0])}–${fmt(proj.target[1])}`, unit: 'kg · meta', label: 'Meta declarada' })}
        <span class="fp-gauge-cell__name">Meta declarada ${ctx.ui.tag('U')}</span></div>
    </div>
    <div class="fp-empty" data-fp-fade>
      <b>Falta el peso de partida.</b>
      <span>Sin un peso en el vault no se puede dibujar la banda realista. Cargalo en el check-in (en ayunas, a la mañana).</span>
      <a class="fp-btn fp-btn--sm fp-btn--accent" href="#/checkin">Cargá tu primer peso ${ctx.icon('arrow', 14)}</a>
    </div>
  </div>
  <div class="fpa-meta__count" data-fp-fade><b class="fp-display" data-fp-count="${proj.days}">${proj.days}</b><span>días hasta el 22/12</span></div>`;
}

const fmt = (n) => (n == null ? '—' : (+n).toLocaleString('es-AR', { maximumFractionDigits: 1 }));

function filled(ctx, w, proj, isDemo, series) {
  const reach = proj.reachable;
  const need = proj.needPerMonth;
  const gaugeNow = ctx.ui.gauge({ value: Math.max(0, w.kg - KG0), max: KG1 - KG0, band: [proj.target[0] - KG0, proj.target[1] - KG0], size: 'lg', display: fmt(w.kg), unit: `kg ${w.declared ? 'declarado' : 'hoy'}`, label: 'Peso actual vs meta' });
  const gaugeReal = ctx.ui.gauge({ value: Math.max(0, proj.hi - KG0), max: KG1 - KG0, band: [proj.lo - KG0, proj.hi - KG0], size: 'lg', status: reach ? 'ok' : 'warn', display: `${fmt(proj.lo)}–${fmt(proj.hi)}`, unit: 'kg al 22/12', label: 'Banda realista' });
  return `
  <div class="fpa-meta__grid">
    <div class="fpa-meta__gauges">
      <div class="fp-gauge-cell" data-fp-fade="scale">${gaugeNow}
        <span class="fp-gauge-cell__name">Hoy → meta ${ctx.ui.tag(w.declared ? 'U' : 'U')} ${isDemo ? ctx.ui.demoChip() : ''}</span>
        <span class="fp-gauge-cell__t">aro verde = ${fmt(proj.target[0])}–${fmt(proj.target[1])} kg</span></div>
      <div class="fp-gauge-cell" data-fp-fade="scale">${gaugeReal}
        <span class="fp-gauge-cell__name">Banda realista ${ctx.ui.tag('C')}</span>
        <span class="fp-gauge-cell__t">+0,5–1 kg/mes · ${fmt(proj.months)} meses</span></div>
    </div>
    <div class="fpa-meta__side">
      <div class="fpa-meta__count" data-fp-fade><b class="fp-display" data-fp-count="${proj.days}">${proj.days}</b><span>días hasta el 22/12</span></div>
      <div class="fpa-meta__verdict ${reach ? 'is-ok' : 'is-warn'}" data-fp-fade>
        <span class="fp-support fp-support--${reach ? 'Parcial' : 'Revisar'}">${reach ? 'Entra en la banda alta' : 'Por encima de la banda'}</span>
        <p>${need != null ? `Para llegar harían falta <b class="fp-data">${fmt(need)} kg/mes</b>. ` : ''}${reach ? 'Posible si se sostiene el superávit, el volumen y el sueño.' : 'No la prometemos: la meta queda arriba de lo que la masa magra suele permitir. El número que importa es la tendencia.'}</p>
      </div>
    </div>
  </div>
  ${timeline(proj, w, series)}`;
}

function timeline(proj, w, series) {
  const W = 1000, H = 240, padL = 46, padR = 20, padT = 18, padB = 34;
  const today = series.length ? series[series.length - 1].date : null;
  const t0 = series.length > 1 ? series[0].date : today;
  const end = proj.date;
  const total = Math.max(1, daysBetween(t0, end));
  const X = (iso) => padL + (daysBetween(t0, iso) / total) * (W - padL - padR);
  const kMin = Math.min(KG0 + 1, ...series.map((s) => s.kg)) - 0.3, kMax = Math.max(proj.target[1], proj.hi) + 0.4;
  const Y = (kg) => padT + (1 - (kg - kMin) / (kMax - kMin)) * (H - padT - padB);
  const xT = X(today), xE = X(end);
  const cone = `M${xT},${Y(w.kg)} L${xE},${Y(proj.hi)} L${xE},${Y(proj.lo)} Z`;
  const pts = series.map((s) => `${X(s.date).toFixed(1)},${Y(s.kg).toFixed(1)}`).join(' ');
  const ticks = [];
  for (let k = Math.ceil(kMin); k <= Math.floor(kMax); k++) ticks.push(`<g><line x1="${padL}" x2="${W - padR}" y1="${Y(k)}" y2="${Y(k)}" class="g"/><text x="${padL - 8}" y="${Y(k) + 4}" text-anchor="end">${k}</text></g>`);
  const months = [];
  const d0 = new Date(`${t0}T12:00:00`);
  for (let m = 0; m < 6; m++) {
    const d = new Date(d0.getFullYear(), d0.getMonth() + m + 1, 1, 12);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
    if (iso >= end) break;
    months.push(`<g><line x1="${X(iso)}" x2="${X(iso)}" y1="${padT}" y2="${H - padB}" class="g g--v"/><text x="${X(iso) + 4}" y="${H - padB + 18}">${['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'][d.getMonth()]}</text></g>`);
  }
  return `
  <figure class="fpa-tlwrap" data-fp-fade>
    <svg class="fpa-tl" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Línea de tiempo del peso hasta el 22 de diciembre con la meta y la banda realista">
      ${ticks.join('')}${months.join('')}
      <rect class="fpa-tl__target" x="${xE - 70}" y="${Y(proj.target[1])}" width="70" height="${Math.max(2, Y(proj.target[0]) - Y(proj.target[1]))}"/>
      <path class="fpa-tl__cone" d="${cone}"/>
      <line class="fpa-tl__need" x1="${xT}" y1="${Y(w.kg)}" x2="${xE}" y2="${Y(proj.target[0])}"/>
      ${series.length > 1 ? `<polyline class="fpa-tl__line" points="${pts}"/>` : ''}
      <circle class="fpa-tl__now" cx="${xT}" cy="${Y(w.kg)}" r="6"/>
      <text class="fpa-tl__lab" x="${xT + 10}" y="${Y(w.kg) - 10}">hoy ${fmt(w.kg)} kg</text>
      <text class="fpa-tl__lab fpa-tl__lab--end" x="${xE - 4}" y="${Y(proj.target[1]) - 8}" text-anchor="end">meta ${fmt(proj.target[0])}–${fmt(proj.target[1])}</text>
      <line x1="${xE}" x2="${xE}" y1="${padT}" y2="${H - padB}" class="fpa-tl__end"/>
      <text x="${xE - 4}" y="${H - padB + 18}" text-anchor="end" class="fpa-tl__lab">22/12</text>
    </svg>
    <figcaption class="fpa-legend fp-small">
      <span><i class="fpa-sw fpa-sw--cone"></i>banda realista ${'[C]'}</span>
      <span><i class="fpa-sw fpa-sw--need"></i>lo que pide la meta</span>
      <span><i class="fpa-sw fpa-sw--target"></i>meta ${'[U]'}</span>
    </figcaption>
  </figure>`;
}

function daysBetween(a, b) {
  return Math.round((new Date(`${b}T12:00:00`) - new Date(`${a}T12:00:00`)) / 86400000);
}
