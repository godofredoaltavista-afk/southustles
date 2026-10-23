// FP · CH19 · SUEÑO Y RECUPERACIÓN — «Durmiendo duro» como mitad del método.
// Sol que se pone y luna que sale siguiendo el progreso de la sección (bus único de scroll), cielo con estrellas,
// gráfico de horas de sueño de los últimos 14 días del vault contra la línea de 8 h.
// Fuente: 01 §7.5 (8+ h [U]; masaje/ducha/sol aportan bienestar pero no son «recuperación medida» [C]).
console.log('[fp/ch19-sueno] init');

export default {
  id: 'sueno',
  n: '19',
  title: 'Sueño',
  pol: 'theme',
  app: 'checkin',
  bridge: 'El músculo se construye recuperando, no rompiendo.',

  render(ctx) {
    const { tag, support } = ctx.ui;
    const stars = Array.from({ length: 46 }, (_, i) => {
      const x = (i * 73) % 100, y = (i * 37) % 62, s = 1 + (i % 3) * 0.6;
      return `<i style="left:${x}%;top:${y}%;--s:${s}px;--d:${(i % 7) * 0.4}s"></i>`;
    }).join('');
    return `
<div class="fp-sleep__sky" aria-hidden="true">
  <div class="fp-sleep__stars">${stars}</div>
  <div class="fp-sleep__orbit"><span class="fp-sleep__sun"></span><span class="fp-sleep__moon"></span></div>
  <div class="fp-sleep__horizon"></div>
</div>
<div class="fp-wrap fp-sleep__wrap">
  <header class="fp-head" data-fp-fade>
    <span class="fp-eyebrow"><b>19</b> Sueño y recuperación</span>
    <h2>Durmiendo <em>duro.</em></h2>
    <p class="fp-lede">Ya dormís 8 h o más ${tag('U')}. Es la mitad del método: el estímulo lo da el entreno, el crecimiento pasa mientras dormís ${support('Solida')}.</p>
  </header>

  <div class="fp-grid-2">
    <figure class="fp-card fp-card--glass fp-sleep__chart" data-fp-fade="left">
      <figcaption class="fp-row fp-row--between"><span class="fp-card__k">horas de sueño · 14 días</span><span data-fp-sleep-demo></span></figcaption>
      <div class="fp-sleep__bars" data-fp-sleep-bars></div>
      <p class="fp-small" data-fp-sleep-sum></p>
    </figure>
    <div class="fp-sleep__notes">
      <article class="fp-card fp-card--flat" data-fp-fade="right">
        <span class="fp-card__k">qué se registra ${tag('C')}</span>
        <h3>Horas y calidad percibida.</h3>
        <p>Dos números en el check-in, todos los días. Con eso alcanza para ver tendencias.</p>
      </article>
      <article class="fp-card fp-card--flat" data-fp-fade="right">
        <span class="fp-card__k">lo que suma, sin medirse ${tag('U')}</span>
        <h3>Masaje, ducha, sol, cama.</h3>
        <p>Aportan bienestar. No los contamos como «recuperación medida» ${tag('C')}.</p>
      </article>
    </div>
  </div>
</div>`;
  },

  init(el, ctx) {
    const bars = el.querySelector('[data-fp-sleep-bars]');
    const sum = el.querySelector('[data-fp-sleep-sum]');
    const demo = el.querySelector('[data-fp-sleep-demo]');

    const paint = () => {
      const today = ctx.M.todayISO();
      const from = ctx.M.addDays(today, -13);
      const by = new Map((ctx.state.days || []).map((d) => [d.date, d]));
      const range = ctx.M.rangeISO(from, today);
      const vals = range.map((iso) => ({ iso, h: by.get(iso)?.checkin?.sleepH ?? null, q: by.get(iso)?.checkin?.sleepQ ?? null, demo: !!by.get(iso)?.demo }));
      const have = vals.filter((v) => v.h != null);
      if (!have.length) {
        bars.innerHTML = '<div class="fp-empty"><b>Sin noches registradas.</b>Cargá horas y calidad en el check-in diario. <a class="fp-btn fp-btn--sm" href="#/checkin">Hacer check-in →</a></div>';
        sum.textContent = '';
        demo.innerHTML = '';
        return;
      }
      const max = 10;
      bars.innerHTML = `<div class="fp-sleep__line" style="--y:${(8 / max) * 100}%"><span class="fp-data">8 h</span></div>` + vals.map((v, i) => `
        <div class="fp-sleep__bar ${v.h != null && v.h < 7 ? 'is-low' : ''}" style="--h:${v.h != null ? (v.h / max) * 100 : 0}%;--i:${i}" title="${ctx.M.fmtDate(v.iso)}: ${v.h ?? '—'} h">
          <i></i><span>${ctx.M.fmtDate(v.iso).split(' ')[0]}</span></div>`).join('');
      const avg = ctx.M.avgOf(have, (v) => v.h);
      const avgQ = ctx.M.avgOf(have, (v) => v.q);
      const under = have.filter((v) => v.h < 8).length;
      sum.innerHTML = `Promedio <b class="fp-data">${ctx.ui.fmt(avg, 1)} h</b> · calidad <b class="fp-data">${avgQ ?? '—'}/5</b> · ${under} noche${under === 1 ? '' : 's'} bajo 8 h.`;
      demo.innerHTML = have.some((v) => v.demo) ? ctx.ui.demoChip() : '';
      bars.classList.remove('is-on');
      requestAnimationFrame(() => requestAnimationFrame(() => bars.classList.add('is-on')));
    };
    paint();
    ctx.onData(async () => { await ctx.load(); paint(); });

    // sol que se pone, luna que sale (progreso de la sección)
    if (ctx.env.prefersReducedMotion()) { el.style.setProperty('--fp-night', '0.6'); return; }
    let visible = false;
    ctx.env.onVisible(el, (v) => { visible = v; });
    ctx.scroll.onScrollFrame(() => {
      if (!visible) return;
      const p = ctx.scroll.getSectionProgress(el);
      el.style.setProperty('--fp-night', Math.min(1, Math.max(0, (p - 0.15) / 0.6)).toFixed(3));
    });
  },
};
