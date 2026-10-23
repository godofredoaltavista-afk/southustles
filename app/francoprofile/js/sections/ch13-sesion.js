// FP · CH13 UNA SESIÓN POR DENTRO — timeline vertical que se dibuja con el scroll (getInnerProgress del
// bus único) con los 3 bloques reales de Franco: Subidón → Fuerza → Bolsa (01 §5.5, 03 §12.4).
// Antes: orden previo [C] y la duda del ayuno [?].
console.log('[fp/ch13-sesion] init');

export default {
  id: 'sesion-3-bloques', n: '13', title: 'Sesión', pol: 'theme', bg: 'beam', app: 'sesion',
  bridge: 'Subidón, fuerza, bolsa. Siempre en ese orden.',
  render(ctx) {
    const { esc, tag } = ctx.ui;
    const plan = ctx.data.plan;
    const total = plan.blocks.reduce((a, b) => [a[0] + b.min[0], a[1] + b.min[1]], [0, 0]);
    const icons = { subidon: 'bolt', fuerza: 'dumbbell', bolsa: 'bag' };
    return `
    <div class="fp-wrap fpa-ses">
      <div class="fp-head">
        <span class="fp-eyebrow"><b>13</b> Una sesión por dentro</span>
        <h2>${total[0]}–${total[1]} minutos, <em>tres bloques</em>.</h2>
        <p class="fp-lede">Así entrena Franco de verdad ${tag('U')}: primero activa, después fuerza con tempo, al final bolsa.</p>
      </div>
      <div class="fpa-ses__grid">
        <div class="fpa-ses__pre">
          <article class="fpa-note" data-fp-fade="left">
            <p class="fpa-note__k">${ctx.icon('drop', 16)} Antes ${tag(plan.preOrder.tag)}</p>
            <p>${esc(plan.preOrder.text)}</p>
          </article>
          <article class="fpa-note fpa-note--q" data-fp-fade="left">
            <p class="fpa-note__k">${ctx.icon('info', 16)} ¿En ayunas? ${tag('?')}</p>
            <p>Dijo las dos cosas: que entrena en ayunas y que corta el ayuno, toma creatina y hace pesas. La app no asume: en cada sesión registra «¿comiste antes?». Para hipertrofia suele rendir mejor entrenar con 30–40 g de proteína + carbos encima ${tag('C')}.</p>
          </article>
        </div>
        <div class="fpa-tline" data-fpa-tline>
          <svg class="fpa-tline__svg" viewBox="0 0 20 1000" preserveAspectRatio="none" aria-hidden="true">
            <line x1="10" y1="0" x2="10" y2="1000" class="fpa-tline__base"/>
            <line x1="10" y1="0" x2="10" y2="1000" class="fpa-tline__draw" data-fpa-draw pathLength="1"/>
          </svg>
          ${plan.blocks.map((b, i) => `
          <div class="fpa-tline__node" data-fpa-node="${i}">
            <span class="fpa-tline__dot">${ctx.icon(icons[b.id] || 'sparkle', 18)}</span>
            <div class="fpa-tline__card">
              <p class="fpa-tline__k fp-data">${String(i + 1).padStart(2, '0')} · ${b.min[0]}–${b.min[1]} min</p>
              <h3>${esc(b.name)}</h3>
              <p>${esc(b.goal)}</p>
              <div class="fpa-tline__bar"><i style="--w:${(b.min[1] / total[1]) * 100}%"></i></div>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </div>`;
  },

  init(el, ctx) {
    const line = el.querySelector('[data-fpa-draw]');
    const nodes = [...el.querySelectorAll('[data-fpa-node]')];
    const wrap = el.querySelector('[data-fpa-tline]');
    if (ctx.env.prefersReducedMotion()) { line.style.strokeDashoffset = '0'; nodes.forEach((n) => n.classList.add('is-on')); return; }
    ctx.scroll.onScrollFrame(() => {
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.7 - r.top) / r.height));
      line.style.strokeDashoffset = String(1 - p);
      nodes.forEach((n, i) => n.classList.toggle('is-on', p >= (i + 0.15) / nodes.length - 0.05));
    });
  },
};
