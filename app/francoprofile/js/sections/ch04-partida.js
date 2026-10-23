// FP · CH04 PUNTO DE PARTIDA — qué ya hace y qué hábitos tiene (01 §1–2) + cinta de equipo en
// marquee acoplado a la velocidad de scroll (initMqMenuSpeed de South Hustles: BASE 17 s, MIN 9 s,
// suavizado .15) pero colgado del bus único de scroll (scrollVelocity), dos filas en sentido opuesto.
console.log('[fp/ch04-partida] init');

export default {
  id: 'partida', n: '04', title: 'Partida', pol: 'invert', bg: 'dots',
  bridge: 'Nada de esto arranca de cero.',
  render(ctx) {
    const { esc, tag } = ctx.ui;
    const p = ctx.data.profile;
    const gear = p.gear.map((g) => `<span class="fpa-mq__item">${ctx.icon(g.icon, 22)}<b>${esc(g.name)}</b></span>`).join('<span class="fpa-mq__sep" aria-hidden="true">✦</span>');
    return `
    <div class="fp-wrap fpa-partida">
      <div class="fp-head">
        <span class="fp-eyebrow"><b>04</b> Punto de partida</span>
        <h2>Lo que <em>ya hago</em>, lo que ya tengo.</h2>
      </div>
      <div class="fpa-partida__grid">
        ${p.already.map((a, i) => `
        <article class="fpa-tile" data-fp-fade style="--i:${i}">
          <span class="fpa-tile__n fp-data">0${i + 1}</span>
          <h3>${esc(a.label)} ${tag(a.tag)}</h3>
          <p>${esc(a.detail)}</p>
        </article>`).join('')}
      </div>
      <div class="fpa-habits" data-fp-fade>
        <p class="fpa-habits__h">Hábitos de los últimos ~5 meses ${tag('U')}</p>
        <ul class="fpa-habits__list">
          ${p.habits.map((h) => `<li><span class="fpa-habits__dot"></span><b>${esc(h.label)}</b><span>${esc(h.since)}</span></li>`).join('')}
        </ul>
      </div>
    </div>
    <div class="fpa-mq" aria-label="Equipo en casa">
      <div class="fpa-mq__row"><div class="fpa-mq__track" data-fpa-mq>${gear}<span class="fpa-mq__sep" aria-hidden="true">✦</span>${gear}<span class="fpa-mq__sep" aria-hidden="true">✦</span></div></div>
      <div class="fpa-mq__row fpa-mq__row--rev"><div class="fpa-mq__track fpa-mq__track--words" data-fpa-mq>${words(p)}${words(p)}</div></div>
    </div>
    <p class="fp-wrap fpa-partida__limit fp-small" data-fp-fade>${ctx.icon('info', 14)} ${esc(p.limits)} ${tag('U')}</p>`;
  },

  init(el, ctx) {
    if (ctx.env.prefersReducedMotion()) { el.classList.add('fpa-mq--static'); return; }
    const tracks = [...el.querySelectorAll('[data-fpa-mq]')];
    const BASE = 34, MIN = 12;
    let raf = null, vel = 0;
    const tick = () => {
      vel += (Math.abs(ctx.scroll.scrollVelocity()) - vel) * 0.15;
      const dur = Math.max(MIN, BASE - vel * 0.9);
      tracks.forEach((t) => t.style.setProperty('--fpa-mq-dur', `${dur.toFixed(2)}s`));
      raf = requestAnimationFrame(tick);
    };
    ctx.env.onVisible(el.querySelector('.fpa-mq'), (v) => {
      if (v && !raf) raf = requestAnimationFrame(tick);
      else if (!v && raf) { cancelAnimationFrame(raf); raf = null; }
    });
  },
};

function words(p) {
  const w = ['Dominadas', 'Flexiones con handles', 'Bandas', 'Garrafa', 'Bolsa', 'Soga', 'Sol', 'Agua', 'Creatina', 'Espejo'];
  return w.map((x, i) => `<span class="fpa-mq__word${i % 2 ? ' fpa-mq__word--it' : ''}">${x}</span>`).join('<span class="fpa-mq__sep" aria-hidden="true">/</span>') + '<span class="fpa-mq__sep" aria-hidden="true">/</span>';
}
