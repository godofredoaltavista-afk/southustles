// FP · CH02 QUIÉN — carta de perfil con tilt holográfico (holo-tilt.js de South Hustles, spring .14,
// maxTilt 10°, escala 1.03) con la piel de las case cards de southhustles.com (gradiente, badge CASE,
// estrellas, borde iridiscente) + contadores (reveal.js) + fuertes / a trabajar.
console.log('[fp/ch02-quien] init');

export default {
  id: 'quien', n: '02', title: 'Quién', pol: 'invert', bg: 'beam',
  bridge: 'La base está. Lo que falta es método.',
  render(ctx) {
    const { esc, tag } = ctx.ui;
    const p = ctx.data.profile;
    const w = p.who;
    return `
    <span class="fp-bg-word fp-bg-word--r" data-fpa-plx="-0.4" aria-hidden="true">Franco</span>
    <div class="fp-wrap fpa-quien">
      <div class="fpa-quien__card-wrap" data-fp-fade="left">
        <article class="fpa-idcard" data-fpa-tilt aria-label="Carta de perfil de Franco">
          <div class="fpa-idcard__glow" aria-hidden="true"></div>
          <header class="fpa-idcard__top">
            <span class="fpa-badge">PERFIL</span>
            <span class="fpa-idcard__stars" aria-hidden="true">★★★</span>
          </header>
          <div class="fpa-idcard__figure" aria-hidden="true">${figureSVG()}</div>
          <div class="fpa-idcard__name">${esc(w.name)}</div>
          <p class="fpa-idcard__role">${esc(w.role)}</p>
          <dl class="fpa-idcard__meta">
            <div><dt>Edad</dt><dd class="fp-data">${w.age} ${tag('U')}</dd></div>
            <div><dt>Base</dt><dd>${esc(w.place)}</dd></div>
            <div><dt>Perfil</dt><dd>Atleta híbrido</dd></div>
          </dl>
          <footer class="fpa-idcard__foot">
            <span class="fp-data">ID · 27 · CBA · HYB</span>
            <span class="fpa-idcard__chip" aria-hidden="true"></span>
          </footer>
        </article>
      </div>

      <div class="fpa-quien__txt">
        <div class="fp-head">
          <span class="fp-eyebrow"><b>02</b> Quién entrena</span>
          <h2>Un cuerpo <em>que ya sabe</em> moverse.</h2>
          <p class="fp-lede">${esc(w.athlete)}. Construye ${w.builds.map((b) => esc(b)).join(', ')}. ${tag('U')}</p>
        </div>

        <div class="fpa-counters">
          <div class="fpa-counter" data-fp-fade><b class="fp-data" data-fp-count="27">27</b><span>años</span></div>
          <div class="fpa-counter" data-fp-fade><b class="fp-data" data-fp-count="5">5</b><span>meses de hábitos nuevos</span></div>
          <div class="fpa-counter" data-fp-fade><b class="fp-data" data-fp-count="3">3</b><span>disciplinas</span></div>
          <div class="fpa-counter" data-fp-fade><b class="fp-data" data-fp-count="${w.builds.length}">${w.builds.length}</b><span>proyectos que construye</span></div>
        </div>

        <div class="fpa-quien__cols">
          <div class="fpa-col" data-fp-fade>
            <p class="fpa-col__h"><span class="fpa-dot fpa-dot--ok"></span>Fuertes ${tag('U')}</p>
            <ul class="fpa-pills">${p.strengths.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
          </div>
          <div class="fpa-col" data-fp-fade>
            <p class="fpa-col__h"><span class="fpa-dot fpa-dot--hot"></span>A trabajar ${tag('U')}</p>
            <ul class="fpa-pills fpa-pills--hot">${p.weak.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
          </div>
        </div>

        <blockquote class="fpa-quote" data-fp-fade>«${esc(p.weakQuote)}» <cite>— Franco ${tag('U')}</cite></blockquote>
      </div>
    </div>`;
  },

  init(el, ctx) {
    const card = el.querySelector('[data-fpa-tilt]');
    if (card) ctx.ui.tilt(card, { max: 10, scale: 1.03 });
    // palabra fantasma con parallax (bg-word de SH) colgada del bus único
    const word = el.querySelector('[data-fpa-plx]');
    if (word && !ctx.env.prefersReducedMotion()) {
      const k = parseFloat(word.dataset.fpaPlx);
      ctx.scroll.onScrollFrame(() => {
        const p = ctx.scroll.getSectionProgress(el);
        if (p > 0 && p < 1) word.style.transform = `translateX(${((p - 0.5) * 240 * k).toFixed(1)}px)`;
      });
    }
  },
};

/* silueta frontal simple (no es una foto): el cuerpo como glifo */
function figureSVG() {
  return `<svg viewBox="0 0 120 160" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="60" cy="22" r="11"/>
    <path d="M44 44c6-6 26-6 32 0l10 38M44 44L34 82M76 44c-3 18-3 34 0 46M44 44c3 18 3 34 0 46"/>
    <path d="M44 90h32M48 90l-6 58M72 90l6 58"/>
    <path d="M34 82l-6 4M86 82l6 4" opacity=".6"/>
    <circle cx="60" cy="62" r="3" fill="currentColor" stroke="none"/>
  </svg>`;
}
