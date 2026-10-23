// FP · MOOD M4 — editorial «Where Creativity and Technology Collide» → «Donde la fuerza y el movimiento chocan».
// Instrument Serif gigante, venn de dos elipses punteadas que se juntan con el scroll (Fuerza ∩ Movimiento),
// glifo de las 3 fases en la intersección, tarjeta rayada y una cita «grabada» estilo Capslock Publishing con su lema.
console.log('[fp/mood-venn] init');

export default {
  id: 'mood-venn',
  n: 'M4',
  title: 'Fuerza ∩ Movimiento',
  pol: 'mood',
  render(ctx) {
    const tag = ctx.ui.tag;
    return `
<div class="fp-mv">
  <div class="fp-mv__main">
    <p class="fp-mv__k fp-data">M4 · FUERZA ∩ MOVIMIENTO · ATLETA HÍBRIDO ${tag('U')}</p>
    <h2 class="fp-mv__title" data-fp-fade>Donde <em>la fuerza</em><br>y <em>el movimiento</em><br>chocan</h2>

    <div class="fp-mv__venn" data-mv-venn>
      <div class="fp-mv__c fp-mv__c--l" data-mv-l>
        <b class="fp-mv__lbl">Fuerza</b>
        <ul class="fp-mv__items"><li>Tensión mecánica</li><li>Tempo 3-1-1</li><li>RIR 1–2</li><li>12–20 series/sem ${tag('C')}</li></ul>
      </div>
      <div class="fp-mv__c fp-mv__c--r" data-mv-r>
        <b class="fp-mv__lbl">Movimiento</b>
        <ul class="fp-mv__items"><li>Boxeo · bolsa</li><li>Running zona 2</li><li>Soga · coordinación</li><li>Equilibrio a una pierna</li></ul>
      </div>
      <div class="fp-mv__core" data-mv-core>
        <svg class="fp-mv__glyph" viewBox="0 0 120 120" role="img" aria-label="Glifo de las tres fases: excéntrica, isométrica, concéntrica">
          <g class="fp-mv__spin">
            <path d="M60 14c22 0 34 22 22 40s-34 18-44 0S38 14 60 14z"/>
            <path d="M60 14c22 0 34 22 22 40s-34 18-44 0S38 14 60 14z" transform="rotate(120 60 60)"/>
            <path d="M60 14c22 0 34 22 22 40s-34 18-44 0S38 14 60 14z" transform="rotate(240 60 60)"/>
            <circle cx="60" cy="60" r="7"/>
          </g>
        </svg>
        <span class="fp-mv__core-t">Atleta<br><em>híbrido</em></span>
        <span class="fp-mv__phases fp-data">EXC · ISO · CON</span>
      </div>
    </div>

    <p class="fp-mv__lede" data-fp-fade><em>La tensión me construye; el movimiento me mantiene libre.</em> Recuperar y repetir es lo que de verdad cambia el cuerpo.</p>
  </div>

  <aside class="fp-mv__side">
    <div data-fp-fade="right"><article class="fp-mv__striped" data-fp-tilt>
      <p><span>Donde</span><br><span>La Fuerza</span><br><span>Y El</span><br><span>Movimiento</span><br><span>Chocan</span></p>
    </article></div>
    <article class="fp-mv__engraved" data-fp-fade="right" data-fp-delay="120">
      <header>ENTRENANDO DURO PUBLISHING</header>
      <svg class="fp-mv__mono" viewBox="0 0 220 150" role="img" aria-label="Monograma F grabado">
        <defs>
          <pattern id="fp-mv-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><path d="M0 0V5" stroke="#0d0d0f" stroke-width="1.6"/></pattern>
          <pattern id="fp-mv-hatch2" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)"><path d="M0 0V4" stroke="#0d0d0f" stroke-width="0.9"/></pattern>
        </defs>
        <circle cx="160" cy="76" r="52" fill="url(#fp-mv-hatch2)" stroke="#0d0d0f" stroke-width="1.2"/>
        <text x="16" y="126" class="fp-mv__F" fill="url(#fp-mv-hatch)" stroke="#0d0d0f" stroke-width="1.4">F</text>
        <text x="96" y="126" class="fp-mv__F fp-mv__F--sm" fill="url(#fp-mv-hatch)" stroke="#0d0d0f" stroke-width="1.2">p</text>
      </svg>
      <blockquote>“Entrenando duro, durmiendo duro.”</blockquote>
      <p class="fp-data">FRANCO · LEMA ${tag('U')} · SIN NÚMEROS INVENTADOS</p>
    </article>
  </aside>
</div>`;
  },
  init(el, ctx) {
    const venn = el.querySelector('[data-mv-venn]');
    const l = el.querySelector('[data-mv-l]'), r = el.querySelector('[data-mv-r]'), core = el.querySelector('[data-mv-core]');
    const reduced = ctx.env.prefersReducedMotion();
    let visible = false;
    ctx.env.onVisible(el, (v) => { visible = v; el.classList.toggle('fp-is-live', v && !reduced); });
    const set = (t) => {
      const w = venn.clientWidth;
      const off = (1 - t) * Math.min(220, w * 0.22);
      l.style.translate = `${(-off).toFixed(1)}px 0`;
      r.style.translate = `${off.toFixed(1)}px 0`;
      core.style.opacity = String(Math.max(0, (t - 0.35) / 0.65).toFixed(3));
      core.style.scale = String((0.8 + 0.2 * t).toFixed(3));
      venn.classList.toggle('is-joined', t > 0.92);
    };
    if (reduced) { set(1); return; }
    ctx.scroll.onScrollFrame(() => {
      if (!visible) return;
      const p = ctx.scroll.getSectionProgress(venn);
      const t = Math.min(1, Math.max(0, (p - 0.18) / 0.4));
      set(t * t * (3 - 2 * t));
    });
  },
};
