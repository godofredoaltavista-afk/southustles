// FP · CH18 · HIDRATACIÓN Y CREATINA — un vaso que se llena con el scroll hasta 3 L (getInnerProgress del bus único,
// patrón scroll-parallax de South Hustles / lib/scroll.ts de Apacheta). Capítulo alto con escena sticky.
// Fuente: 01 §7.3, premisa p05 (Parcial). Creatina: solo lo que Franco ya toma (5 g), sin marcas, sin timing.
console.log('[fp/ch18-agua] init');

export default {
  id: 'agua',
  n: '18',
  title: 'Agua y creatina',
  pol: 'invert',
  app: 'hoy',
  bridge: 'Agua todo el día, creatina todos los días. Lo aburrido es lo que funciona.',

  render(ctx) {
    const { tag, support, icon } = ctx.ui;
    const marks = [1, 2, 3].map((l) => `<g><line x1="150" x2="168" y1="${400 - (l / 3) * 330}" y2="${400 - (l / 3) * 330}"/><text x="176" y="${404 - (l / 3) * 330}">${l} L</text></g>`).join('');
    return `
<div class="fp-water__scene">
  <div class="fp-wrap fp-water__grid">
    <div class="fp-water__copy">
      <header class="fp-head" data-fp-fade>
        <span class="fp-eyebrow"><b>18</b> Hidratación y creatina</span>
        <h2>Tres <em>litros,</em> cinco gramos.</h2>
        <p class="fp-lede">Agua ~3 L por día ${tag('U')}, más si transpirás o hace calor. Orina clara-amarilla alcanza como indicador ${tag('C')}.</p>
      </header>
      <div class="fp-water__cards">
        <article class="fp-card fp-card--glass" data-fp-fade>
          <span class="fp-card__k">${icon('pill', 14)} creatina ${tag('U')}</span>
          <h3>5 g, todos los días.</h3>
          <p>Monohidrato, 3–5 g/día ${tag('C')}. <b>No necesita timing:</b> cuenta la constancia diaria. Es el suplemento con mejor respaldo ${support('Solida')}.</p>
        </article>
        <article class="fp-card fp-card--glass" data-fp-fade>
          <span class="fp-card__k">${icon('alert', 14)} lo que no es</span>
          <h3>El inflado no es músculo nuevo.</h3>
          <p>La creatina mete agua dentro del músculo y mejora el rendimiento. Pero ese volumen no se usa como métrica de progreso ${support('Parcial')}.</p>
        </article>
      </div>
      <p class="fp-small fp-water__today" data-fp-water-today></p>
    </div>

    <figure class="fp-water__glass" aria-label="Vaso que se llena con el scroll hasta 3 litros">
      <svg viewBox="0 0 220 440" class="fp-water__svg" aria-hidden="true">
        <defs>
          <clipPath id="fp-water-clip"><path d="M22 40 L148 40 L134 410 Q133 420 122 420 L48 420 Q37 420 36 410 Z"/></clipPath>
          <linearGradient id="fp-water-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stop-color="var(--fp-accent-soft)" stop-opacity=".95"/><stop offset="1" stop-color="var(--fp-accent)" stop-opacity=".95"/>
          </linearGradient>
        </defs>
        <g clip-path="url(#fp-water-clip)">
          <g class="fp-water__liquid">
            <path class="fp-water__wave fp-water__wave--back" d="M-200 0 Q-150 -12 -100 0 T0 0 T100 0 T200 0 T300 0 T400 0 V600 H-200 Z"/>
            <path class="fp-water__wave" d="M-200 0 Q-150 12 -100 0 T0 0 T100 0 T200 0 T300 0 T400 0 V600 H-200 Z"/>
          </g>
          <g class="fp-water__bubbles">${Array.from({ length: 9 }, (_, i) => `<circle cx="${40 + ((i * 37) % 100)}" cy="${420 - ((i * 53) % 300)}" r="${2 + (i % 3)}" style="--i:${i}"/>`).join('')}</g>
        </g>
        <path class="fp-water__outline" d="M22 40 L148 40 L134 410 Q133 420 122 420 L48 420 Q37 420 36 410 Z"/>
        <g class="fp-water__marks">${marks}</g>
      </svg>
      <figcaption><b class="fp-display fp-water__l" data-fp-water-l>0,0</b><span>litros</span></figcaption>
    </figure>
  </div>
</div>`;
  },

  init(el, ctx) {
    const liquid = el.querySelector('.fp-water__liquid');
    const label = el.querySelector('[data-fp-water-l]');
    const today = el.querySelector('[data-fp-water-today]');
    const reduced = ctx.env.prefersReducedMotion();
    let lastL = -1;

    const set = (p) => {
      const l = Math.round(p * 3 * 10) / 10;
      const y = 420 - p * 360; // 0 L abajo, 3 L ≈ borde
      liquid.setAttribute('transform', `translate(0 ${y.toFixed(1)})`);
      if (l !== lastL) { lastL = l; label.textContent = ctx.ui.fmt(l, 1); }
      el.style.setProperty('--fp-water-p', p.toFixed(3));
    };

    if (reduced) set(1);
    else {
      let visible = false;
      ctx.env.onVisible(el, (v) => { visible = v; });
      ctx.scroll.onScrollFrame(() => {
        if (!visible) return;
        const p = ctx.scroll.getInnerProgress(el);
        set(Math.min(1, Math.max(0, (p - 0.05) / 0.8)));
      });
    }

    const paintToday = () => {
      const d = (ctx.state.days || []).find((x) => x.date === ctx.M.todayISO());
      const w = d ? ctx.M.dayWater(d) : 0;
      today.innerHTML = d
        ? `Hoy llevás <b class="fp-data">${ctx.ui.fmt(w, 2)} L</b> · creatina ${d.intake?.creatine ? '<b>tomada ✓</b>' : 'pendiente'}. <a href="#/hoy">Sumar en Hoy →</a>`
        : 'Hoy todavía no registraste agua ni creatina. <a href="#/hoy">Marcalo en Hoy →</a>';
    };
    paintToday();
    ctx.onData(async () => { await ctx.load(); paintToday(); });
  },
};
