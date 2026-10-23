// FP · CH05 LA ODISEA — texto en perspectiva «crawl» (initPerspective de South Hustles:
// rotateX 18–30° + translateZ −40…−110 px según getSectionProgress), colgado del bus único.
// Contenido: data.profile.story (resumen sin dramatizar, extracto curado 03 §12.4).
console.log('[fp/ch05-odisea] init');

export default {
  id: 'odisea', n: '05', title: 'Odisea', pol: 'theme', grad: 'up',
  bridge: 'Cinco meses de base. Ahora, método.',
  render(ctx) {
    const { esc, tag } = ctx.ui;
    const s = ctx.data.profile.story;
    return `
    <span class="fp-bg-word fp-bg-word--l" aria-hidden="true">odisea</span>
    <div class="fp-wrap fpa-odisea">
      <div class="fp-head fp-head--center">
        <span class="fp-eyebrow"><b>05</b> La odisea</span>
        <h2>Ectomorfo <em>toda la vida</em>.</h2>
      </div>
      <div class="fpa-odisea__steps" data-fp-fade>
        <div class="fpa-step"><b class="fp-data">57</b><span>kg ${tag('U')}</span></div>
        <i class="fpa-step__arrow" aria-hidden="true"></i>
        <div class="fpa-step"><b class="fp-data">59</b><span>kg ${tag('U')}</span></div>
        <i class="fpa-step__arrow" aria-hidden="true"></i>
        <div class="fpa-step fpa-step--now"><b class="fp-data" data-fpa-now>—</b><span>kg hoy</span></div>
        <i class="fpa-step__arrow" aria-hidden="true"></i>
        <div class="fpa-step fpa-step--goal"><b class="fp-data">65</b><span>kg meta ${tag('U')}</span></div>
      </div>
      <div class="fpa-crawl" aria-label="Historia">
        <div class="fpa-crawl__fade" aria-hidden="true"></div>
        <div class="fpa-crawl__text" data-fpa-crawl>
          ${s.map((l, i) => `<p class="${i === s.length - 1 ? 'is-last' : ''}">${esc(l)}</p>`).join('')}
        </div>
      </div>
    </div>`;
  },

  init(el, ctx) {
    const now = el.querySelector('[data-fpa-now]');
    const paint = () => {
      const w = ctx.M.currentWeight(ctx.state.days || [], ctx.state.profile);
      if (now) now.textContent = w != null ? w.toLocaleString('es-AR', { maximumFractionDigits: 1 }) : '—';
    };
    paint();
    ctx.onData(paint);

    const text = el.querySelector('[data-fpa-crawl]');
    if (!text || ctx.env.prefersReducedMotion()) return;
    const stage = el.querySelector('.fpa-crawl');
    ctx.scroll.onScrollFrame(() => {
      const p = ctx.scroll.getSectionProgress(stage);
      if (p <= 0 || p >= 1) return;
      const tilt = 18 + (1 - p) * 12;
      const z = -40 - (1 - p) * 70;
      const y = (0.5 - p) * 160;
      text.style.transform = `rotateX(${tilt.toFixed(2)}deg) translateZ(${z.toFixed(0)}px) translateY(${y.toFixed(1)}px)`;
    });
  },
};
