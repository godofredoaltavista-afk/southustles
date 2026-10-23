// FP · CH21 · EQUIPO — grilla de tarjetas con tilt holográfico (holo-tilt.js de South Hustles vía ctx.ui.tilt)
// desde data/profile-public.json → gear, con íconos SVG propios. Límite de 20 kg → se progresa con palancas.
// Las configuraciones de mancuernas son [?] (01 §2.3 #4): se muestran como «a confirmar».
console.log('[fp/ch21-equipo] init');

const CONFIGS = [
  { t: '2 × 10 kg', d: 'press, remo, curl' },
  { t: '1 × 15 kg', d: 'press a una mano, goblet' },
  { t: 'barra 20 kg', d: 'extensor ~40–45 cm: sentadilla, tríceps' },
];

export default {
  id: 'equipo',
  n: '21',
  title: 'Equipo',
  pol: 'theme',
  bg: 'grid',
  app: 'biblioteca',
  bridge: 'Con esto alcanza. Lo que falta de peso lo pone el tempo.',

  render(ctx) {
    const { tag, esc, icon } = ctx.ui;
    const gear = ctx.data.profile.gear;
    return `
<span class="fp-bg-word fp-bg-word--l" aria-hidden="true">garage</span>
<div class="fp-wrap fp-wrap--wide">
  <header class="fp-head" data-fp-fade>
    <span class="fp-eyebrow"><b>21</b> Equipo</span>
    <h2>Un gimnasio <em>en</em> casa.</h2>
    <p class="fp-lede">Todo lo que tenés para entrenar ${tag('U')}. Calistenia, bandas, 20 kg de discos, una garrafa y una bolsa colgada: un atleta híbrido no necesita más.</p>
  </header>

  <div class="fp-gear">
    ${gear.map((g, i) => `
    <article class="fp-gear__card ${i === 0 || i === 6 ? 'fp-gear__card--wide' : ''}" data-fp-tilt data-fp-fade="scale" style="--i:${i}">
      <span class="fp-gear__n fp-data">${String(i + 1).padStart(2, '0')}</span>
      <span class="fp-gear__ico">${icon(g.icon, 30)}</span>
      <h3>${esc(g.name)}</h3>
      <p>${esc(g.detail).replace('[?]', tag('?'))}</p>
      <span class="fp-gear__use">${icon('target', 13)} ${esc(g.use)}</span>
    </article>`).join('')}
  </div>

  <div class="fp-gear__limit" data-fp-fade>
    <div class="fp-gear__limit-l">
      <span class="fp-card__k">tope de carga ${tag('U')}</span>
      <b class="fp-card__big"><span data-fp-count="20">20</span><small>kg</small></b>
    </div>
    <div class="fp-gear__configs">
      <span class="fp-card__k">configuraciones ${tag('?')}</span>
      <div class="fp-gear__cfg">${CONFIGS.map((c) => `<div><b class="fp-data">${esc(c.t)}</b><span>${esc(c.d)}</span></div>`).join('')}</div>
    </div>
    <p class="fp-gear__limit-r">${esc(ctx.data.profile.limits)} <a href="#ch-progresion">Ver las 9 palancas →</a></p>
  </div>
</div>`;
  },

  init(el, ctx) {
    // el registro llama enhance() → tilt en [data-fp-tilt]; acá solo la entrada escalonada de la grilla
    const grid = el.querySelector('.fp-gear');
    ctx.env.onVisible(grid, (v) => { if (v) grid.classList.add('is-on'); }, { threshold: 0.1 });
    if (ctx.env.prefersReducedMotion()) grid.classList.add('is-on');
  },
};
