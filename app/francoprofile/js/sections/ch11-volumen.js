// FP · CH11 VOLUMEN SEMANAL — un medidor conic por músculo (ScoreGauge de Apacheta) con la banda
// objetivo de 01 §5.4 dibujada en verde, alimentado por el vault (series de los últimos 7 días).
// Por debajo = ámbar, dentro = verde, por encima = ámbar con «¿te estás recuperando?».
console.log('[fp/ch11-volumen] init');

export default {
  id: 'volumen', n: '11', title: 'Volumen', pol: 'theme', bg: 'grid', app: 'plan',
  bridge: 'Doce a veinte series. Contadas, no supuestas.',
  render(ctx) {
    const { tag, support } = ctx.ui;
    return `
    <div class="fp-wrap fp-wrap--wide fpa-vol">
      <div class="fp-head">
        <span class="fp-eyebrow"><b>11</b> Volumen semanal</span>
        <h2>Series por músculo, <em>esta semana</em>.</h2>
        <p class="fp-lede">Rango de referencia: 12–20 series efectivas por músculo por semana ${tag('C')} ${support('Solida')}, ajustado por grupo según prioridad (01 §5.4). Músculo primario = 1 serie, secundario = 0,5.</p>
      </div>
      <div class="fpa-vol__body" data-fpa-vol></div>
    </div>`;
  },

  init(el, ctx) {
    const host = el.querySelector('[data-fpa-vol]');
    const paint = () => {
      const days = ctx.state.days || [];
      const vol = ctx.M.volumeByMuscle(days, ctx.data, ctx.M.todayISO(), 7);
      const total = vol.reduce((a, v) => a + v.sets, 0);
      const from = ctx.M.addDays(ctx.M.todayISO(), -6);
      const isDemo = days.some((d) => d.demo && d.date >= from);
      if (!total) {
        host.innerHTML = `
        <div class="fpa-vol__grid fpa-vol__grid--ghost" aria-hidden="true">${vol.map((v) => cell(ctx, v, true)).join('')}</div>
        <div class="fp-empty fpa-vol__empty">
          <b>Todavía no hay series esta semana.</b>
          <span>Cada serie que registres en la sesión suma acá, al músculo que trabaja. Los aros muestran el rango objetivo.</span>
          <a class="fp-btn fp-btn--sm fp-btn--accent" href="#/sesion">Registrá tu primera serie ${ctx.icon('arrow', 14)}</a>
        </div>`;
        return;
      }
      const ok = vol.filter((v) => v.status === 'ok').length;
      const low = vol.filter((v) => v.status === 'low' && v.priority === 1);
      host.innerHTML = `
      <div class="fpa-vol__sum" data-fp-fade>
        <div><b class="fp-display" data-fp-count="${Math.round(total)}">${Math.round(total)}</b><span>series efectivas · 7 días ${isDemo ? ctx.ui.demoChip() : ''}</span></div>
        <div><b class="fp-display">${ok}/${vol.length}</b><span>grupos en rango</span></div>
        <div class="fpa-vol__alert">${low.length ? `${ctx.icon('alert', 16)} Prioridad 1 corta: ${low.map((v) => v.name).join(', ')}` : `${ctx.icon('check', 16)} Prioridades 1 cubiertas`}</div>
      </div>
      <div class="fpa-vol__grid">${vol.map((v) => cell(ctx, v, false)).join('')}</div>`;
      ctx.ui.reveal(host); ctx.ui.counters(host);
    };
    paint();
    ctx.onData(paint);
  },
};

function cell(ctx, v, ghost) {
  const status = ghost ? '' : v.status === 'ok' ? 'ok' : 'warn';
  const note = v.status === 'high' ? '¿te estás recuperando?' : v.status === 'low' ? `faltan ${Math.max(0, Math.ceil(v.target[0] - v.sets))}` : 'en rango';
  return `
  <div class="fpa-vol__cell fpa-vol__cell--p${v.priority}" ${ghost ? '' : 'data-fp-fade="scale"'}>
    ${ctx.ui.gauge({ value: ghost ? 0 : v.sets, max: v.target[1] * 1.25, band: v.target, size: 'sm', status, display: ghost ? '0' : String(v.sets).replace('.', ','), unit: `/${v.target[0]}–${v.target[1]}`, label: v.name })}
    <span class="fp-gauge-cell__name">${ctx.ui.esc(v.name)}${v.priority === 1 ? ' <span class="fpa-prio">P1</span>' : v.priority === 2 ? ' <span class="fpa-prio fpa-prio--2">P2</span>' : ''}</span>
    ${ghost ? '' : `<span class="fp-gauge-cell__t">${note}</span>`}
  </div>`;
}
