// FP · CH06 LAS 3 FASES — widget orbital (orbital-widget.js de South Hustles, idioma «agentic orbital»
// de Ant on Mars: núcleo wireframe + toros inclinados girando a distinta velocidad) rehecho en CSS 3D
// para no sumar renderers: 3 anillos = excéntrica / isométrica / concéntrica, que se encienden en el
// ritmo real del tempo 3-1-1. Contenido: 01 §5.1.
console.log('[fp/ch06-tres-fases] init');

const PHASES = [
  { id: 'ecc', name: 'Excéntrica', ms: 3000, what: 'El músculo se alarga bajo carga.', ex: 'Bajar en la dominada · agacharte en la sentadilla · volver con el brazo en el tríceps.', cue: 'Controlá la bajada: 3 s.' },
  { id: 'iso', name: 'Isométrica', ms: 1000, what: 'El músculo sostiene sin cambiar de largo.', ex: 'Pausa abajo · plancha · trabar la escápula.', cue: 'Trabá 1 s en el punto de más tensión.' },
  { id: 'con', name: 'Concéntrica', ms: 1000, what: 'El músculo se acorta y vence la carga.', ex: 'Subir en la dominada · levantarte en la sentadilla.', cue: 'Subí en 1 s, sin inercia.' },
];

export default {
  id: 'tres-fases', n: '06', title: '3 fases', pol: 'theme', bg: 'dots', app: 'sesion',
  bridge: 'Tres fases, un solo tempo.',
  render(ctx) {
    const { esc, tag } = ctx.ui;
    return `
    <div class="fp-wrap fpa-fases">
      <div class="fp-head">
        <span class="fp-eyebrow"><b>06</b> Las 3 fases</span>
        <h2>Toda contracción tiene <em>tres tiempos</em>.</h2>
        <p class="fp-lede">Premisa de Franco ${tag('U')} con respaldo ${ctx.ui.support('Solida')}: organizar la serie en tres fases da control y tensión. No es mágico; lo que más pesa es volumen, cercanía al fallo y progresión.</p>
      </div>
      <div class="fpa-fases__grid">
        <div class="fpa-orb" data-fpa-orb data-phase="ecc" data-fp-fade="scale" aria-hidden="true">
          <div class="fpa-orb__scene">
            <div class="fpa-orb__core">${'<i></i>'.repeat(6)}</div>
            <div class="fpa-orb__ring fpa-orb__ring--ecc"><b></b></div>
            <div class="fpa-orb__ring fpa-orb__ring--iso"><b></b></div>
            <div class="fpa-orb__ring fpa-orb__ring--con"><b></b></div>
          </div>
          <div class="fpa-orb__label"><span class="fp-data" data-fpa-orb-t>3.0</span><b data-fpa-orb-n>Excéntrica</b></div>
        </div>
        <div class="fpa-fases__cards">
          ${PHASES.map((p, i) => `
          <article class="fpa-phase fpa-phase--${p.id}" data-fpa-phase="${p.id}" data-fp-fade="right">
            <header><span class="fpa-phase__n fp-data">0${i + 1}</span><h3>${p.name}</h3><span class="fpa-phase__s fp-data">${p.ms / 1000} s</span></header>
            <p class="fpa-phase__what">${esc(p.what)}</p>
            <p class="fpa-phase__ex">${esc(p.ex)}</p>
            <p class="fpa-phase__cue">${esc(p.cue)}</p>
          </article>`).join('')}
        </div>
      </div>
      <aside class="fpa-fix" data-fp-fade>
        <span class="fpa-fix__k">Corrección</span>
        <p><b>En la sentadilla, la concéntrica es subir.</b> Agacharse es la excéntrica. ${tag('C')}</p>
      </aside>
    </div>`;
  },

  init(el, ctx) {
    const orb = el.querySelector('[data-fpa-orb]');
    const tEl = el.querySelector('[data-fpa-orb-t]');
    const nEl = el.querySelector('[data-fpa-orb-n]');
    const cards = [...el.querySelectorAll('[data-fpa-phase]')];
    const set = (id) => { orb.dataset.phase = id; cards.forEach((c) => c.classList.toggle('is-on', c.dataset.fpaPhase === id)); };
    set('ecc');
    if (ctx.env.prefersReducedMotion()) return;
    let raf = null, t0 = 0;
    const CYCLE = PHASES.reduce((a, p) => a + p.ms, 0);
    const tick = (now) => {
      if (!t0) t0 = now;
      let t = (now - t0) % CYCLE, i = 0;
      while (t >= PHASES[i].ms) { t -= PHASES[i].ms; i++; }
      const ph = PHASES[i];
      if (orb.dataset.phase !== ph.id) { set(ph.id); nEl.textContent = ph.name; }
      tEl.textContent = ((ph.ms - t) / 1000).toFixed(1);
      raf = requestAnimationFrame(tick);
    };
    ctx.env.onVisible(orb, (v) => {
      if (v && !raf) { t0 = 0; raf = requestAnimationFrame(tick); orb.classList.add('is-live'); }
      else if (!v && raf) { cancelAnimationFrame(raf); raf = null; orb.classList.remove('is-live'); }
    });
  },
};
