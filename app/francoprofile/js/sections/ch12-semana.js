// FP · CH12 LA SEMANA — siete eco-cards (initEcoCards de South Hustles: relleno radial de tinta que crece
// desde el cursor, texto en mix-blend difference) con el plan v1 de 01 §6: Lun/Mar/Mié/Vie/Sáb entrena,
// Jue/Dom descansa. Hoy resaltado. Variante de 6 días como [?].
console.log('[fp/ch12-semana] init');

export default {
  id: 'semana', n: '12', title: 'Semana', pol: 'invert', bg: 'dots', app: 'plan',
  bridge: 'Cinco días de trabajo, dos de construir.',
  render(ctx) {
    const { esc, tag } = ctx.ui;
    const plan = ctx.data.plan;
    const today = ctx.M.weekdayKey(ctx.M.todayISO());
    return `
    <div class="fp-wrap fp-wrap--wide fpa-semana">
      <div class="fp-head">
        <span class="fp-eyebrow"><b>12</b> La semana</span>
        <h2>Lun · Mar · Mié · <em>Jue</em> · Vie · Sáb · <em>Dom</em></h2>
        <p class="fp-lede">Plan v1 ${tag('C')}: entrena lunes, martes, miércoles, viernes y sábado; descansa jueves y domingo. Pasá el mouse: cada día se invierte desde donde entrás.</p>
      </div>
      <div class="fpa-eco-row">
        ${plan.days.map((d, i) => `
        <article class="fpa-eco ${d.train ? '' : 'fpa-eco--rest'} ${d.key === today ? 'is-today' : ''}" data-fp-fade data-fp-delay="${i * 60}" tabindex="0" aria-label="${esc(d.name)}: ${esc(d.title)}">
          <span class="fpa-eco__invert" aria-hidden="true"></span>
          <div class="fpa-eco__c">
            <header><span class="fpa-eco__d fp-display">${esc(d.short)}</span>${d.key === today ? '<span class="fpa-eco__today">hoy</span>' : ''}</header>
            <h3>${esc(d.title)}</h3>
            ${d.train ? `<p class="fpa-eco__m fp-data">${d.items.length} ejercicios</p>
            <ul class="fpa-eco__g">${(d.groups || []).slice(0, 4).map((g) => `<li>${esc(ctx.data.muscleById[g]?.name || g)}</li>`).join('')}</ul>
            <p class="fpa-eco__bag">${ctx.icon('bag', 14)} ${esc(d.bag || '')}</p>` : `<p class="fpa-eco__rest">${esc(d.rest || '')}</p>`}
          </div>
        </article>`).join('')}
      </div>
      <p class="fpa-semana__var fp-small" data-fp-fade>${tag('?')} ${esc(plan.variant6d.note)}</p>
    </div>`;
  },

  init(el, ctx) {
    if (!ctx.env.fxEnabled()) return;
    el.querySelectorAll('.fpa-eco').forEach((card) => {
      let raf = null;
      const set = (e, r) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--cx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        card.style.setProperty('--cy', `${((e.clientY - rect.top) / rect.height) * 100}%`);
        card.style.setProperty('--r', `${r}%`);
      };
      card.addEventListener('pointerenter', (e) => set(e, 150));
      card.addEventListener('pointermove', (e) => { if (raf) return; raf = requestAnimationFrame(() => { set(e, 150); raf = null; }); });
      card.addEventListener('pointerleave', () => card.style.setProperty('--r', '0%'));
    });
  },
};
