// FP · CH08 TENSIÓN MECÁNICA — esqueleto de 21 puntos con colores FreeMoCap (SkeletonPlayer sobre el
// boxer.json real de Motion Lab) y toggles que resaltan el grupo que trabaja. Estética del Estudio de
// Moyon Lab: oscuro, ángulos en caja negra, centro de masa amarillo, esquinas en corchete.
console.log('[fp/ch08-tension] init');

const GROUPS = [
  { id: 'todo', name: 'Todo', hl: null, cue: 'Tensión en rango largo, con técnica. El cansancio no es la meta.' },
  { id: 'dorsal', name: 'Dorsal', hl: ['shoulder'], cue: 'Bajá la escápula antes de tirar. Codo al bolsillo.' },
  { id: 'triceps', name: 'Tríceps', hl: ['elbow', 'wrist'], cue: 'Codos pegados, extensión completa, trabá al fondo.' },
  { id: 'core', name: 'Core', hl: ['hip', 'shoulder'], cue: 'Costillas abajo y respirá: el core sostiene la guardia.' },
  { id: 'gluteo', name: 'Glúteo', hl: ['hip', 'knee'], cue: 'Pelvis neutra y pausa arriba. Llevá la fuerza atrás de la pierna.' },
];

export default {
  id: 'tension', n: '08', title: 'Tensión', pol: 'theme', bg: 'grid', app: 'lab',
  bridge: 'La tensión construye; el cansancio solo cansa.',
  render(ctx) {
    const { esc, tag, support } = ctx.ui;
    const pick = (id) => ctx.data.premises.find((p) => p.id === id);
    const prem = ['m03-tension', 'm04-excentrica', 'p13-mente-musculo'].map(pick).filter(Boolean);
    return `
    <div class="fp-wrap fp-wrap--wide fpa-tension">
      <div class="fp-head">
        <span class="fp-eyebrow"><b>08</b> Tensión mecánica</span>
        <h2>Tensión, <em>no dolor</em>.</h2>
      </div>
      <div class="fpa-tension__grid">
        <figure class="fpa-studio" data-fp-fade="scale">
          <span class="fpa-studio__corner fpa-studio__corner--tl" aria-hidden="true"></span>
          <span class="fpa-studio__corner fpa-studio__corner--tr" aria-hidden="true"></span>
          <span class="fpa-studio__corner fpa-studio__corner--bl" aria-hidden="true"></span>
          <span class="fpa-studio__corner fpa-studio__corner--br" aria-hidden="true"></span>
          <div class="fpa-studio__hud fp-data"><span class="fpa-studio__rec">persona 0.96</span><span data-fpa-frame>frame 0</span></div>
          <canvas class="fpa-studio__cv" data-fpa-skel aria-label="Esqueleto de 21 puntos: combo de sombra de boxeo de Motion Lab"></canvas>
          <figcaption class="fpa-studio__cap fp-data"><span><i style="background:var(--fp-skel-l)"></i>izq</span><span><i style="background:var(--fp-skel-r)"></i>der</span><span><i style="background:var(--fp-skel-core)"></i>core</span><span><i style="background:var(--fp-skel-head)"></i>cabeza · centro de masa</span></figcaption>
        </figure>
        <div class="fpa-tension__side">
          <div class="fp-seg fpa-tension__seg" data-fpa-groups role="group" aria-label="Resaltar grupo">
            ${GROUPS.map((g) => `<button type="button" data-v="${g.id}">${g.name}</button>`).join('')}
          </div>
          <p class="fpa-tension__cue" data-fpa-cue aria-live="polite">${esc(GROUPS[0].cue)}</p>
          <div class="fpa-prem">
            ${prem.map((p) => `
            <article class="fpa-prem__item" data-fp-fade>
              <div class="fpa-prem__meta">${tag(p.tag)} ${support(p.support)}</div>
              <p class="fpa-prem__claim">${esc(p.claim)}</p>
              <p class="fpa-prem__note">${esc(p.note)}</p>
            </article>`).join('')}
          </div>
        </div>
      </div>
    </div>`;
  },

  async init(el, ctx) {
    const cv = el.querySelector('[data-fpa-skel]');
    const frameEl = el.querySelector('[data-fpa-frame]');
    const cue = el.querySelector('[data-fpa-cue]');
    let player = null;
    try {
      const raw = await ctx.data.boxer();
      const n = ctx.ml.normalize(raw, 'boxer.json');
      if (!n.ok) throw new Error(n.error);
      player = new ctx.ml.SkeletonPlayer(cv, n.session, {
        angles: true, trail: true, com: true, loop: true, speed: 0.8,
        onFrame: (i) => { if (frameEl) frameEl.textContent = `frame ${String(i).padStart(3, '0')}`; },
      });
      if (!ctx.env.prefersReducedMotion()) player.play();
    } catch (e) {
      cv.replaceWith(Object.assign(document.createElement('p'), { className: 'fp-empty', textContent: 'No pude cargar el clip de Motion Lab (boxer.json).' }));
    }
    ctx.ui.segmented(el.querySelector('[data-fpa-groups]'), 'todo', (v) => {
      const g = GROUPS.find((x) => x.id === v);
      if (cue) cue.textContent = g.cue;
      if (player) { player.o.highlight = g.hl; player.draw(); }
    });
  },
};
