// FP · CH17 · COMIDA — anillos (medidor conic de Apacheta) con la proteína/agua/kcal de HOY desde el vault,
// carrusel con scroll-snap de lo que Franco come [U] (film-strip de South Hustles) y la cuenta de calorías [C].
// Fuente: 01 §7.1–7.2, data/profile-public.json → nutrition. La app no calcula calorías desde fotos.
console.log('[fp/ch17-comida] init');

const FOOD_NOTES = {
  Huevo: 'Proteína completa y barata. Revueltos, duros, en tortilla.',
  Asado: 'Proteína grande de golpe: el almuerzo fuerte.',
  'Proteína en polvo': 'Recién comprada: tapa el hueco de la merienda.',
  Café: 'Activación antes de entrenar. No cuenta como comida.',
  Mate: 'Todo el día. Sumá agua aparte.',
  Galletitas: 'Carbos rápidos: suman al superávit.',
  'Carbos alrededor del entreno': 'Donde mejor rinden las calorías extra.',
};
const SLOTS = [
  { k: 'desayuno', t: '09:00', g: [25, 35] },
  { k: 'almuerzo', t: '13:30', g: [35, 45] },
  { k: 'merienda', t: '17:30', g: [25, 30] },
  { k: 'cena', t: '21:30', g: [30, 40] },
];

export default {
  id: 'comida',
  n: '17',
  title: 'Comida',
  pol: 'theme',
  bg: 'dots',
  app: 'comida',
  bridge: 'El cuello de botella no es la proteína: son las calorías.',

  render(ctx) {
    const { tag, support, esc, icon } = ctx.ui;
    const n = ctx.data.profile.nutrition;
    const lo = n.maintenanceKcal[0] + n.runningKcal + n.surplusKcal[0];
    const hi = n.maintenanceKcal[1] + n.runningKcal + n.surplusKcal[1];
    return `
<div class="fp-wrap">
  <header class="fp-head" data-fp-fade>
    <span class="fp-eyebrow"><b>17</b> Comida</span>
    <h2>Comer <em>para</em> crecer.</h2>
    <p class="fp-lede">Proteína ${n.proteinG.join('–')} g por día ${tag('U')} (≈ ${n.proteinPerKg.join('–')} g/kg ${tag('C')}) repartida en ${n.meals.join('–')} comidas de ${n.perMealG.join('–')} g. Ya estás en rango ${support('Solida')}. Lo que define si subís es el superávit.</p>
  </header>

  <div class="fp-food__top">
    <div class="fp-card fp-food__rings" data-fp-fade="left">
      <div class="fp-row fp-row--between"><span class="fp-card__k">hoy · desde tu vault</span><span data-fp-food-demo></span></div>
      <div class="fp-food__ringrow" data-fp-food-rings></div>
      <p class="fp-small" data-fp-food-note></p>
    </div>

    <div class="fp-card fp-food__kcal" data-fp-fade="right">
      <span class="fp-card__k">la cuenta ${tag('C')}</span>
      <h3>Superávit chico, constante.</h3>
      <ol class="fp-food__sum">
        <li><span>Mantenimiento</span><b class="fp-data">${ctx.ui.fmt(n.maintenanceKcal[0], 0)}–${ctx.ui.fmt(n.maintenanceKcal[1], 0)}</b></li>
        <li><span>+ running actual</span><b class="fp-data">~${n.runningKcal}</b></li>
        <li><span>+ superávit</span><b class="fp-data">${n.surplusKcal.join('–')}</b></li>
        <li class="is-total"><span>≈ por día</span><b class="fp-data">${ctx.ui.fmt(lo, 0)}–${ctx.ui.fmt(hi, 0)} kcal</b></li>
      </ol>
      <p class="fp-small">Objetivo: subir ${n.gainKgWeek.join('–')} kg por semana. Si el promedio semanal en ayunas no sube en 3 semanas: +200–300 kcal, con carbos alrededor del entreno. Sin altura ${tag('?')} no se afina más.</p>
    </div>
  </div>

  <div class="fp-food__day" data-fp-fade>
    <span class="fp-card__k">la repartición ${tag('C')}</span>
    <div class="fp-food__slots">
      ${SLOTS.map((s, i) => `<div class="fp-food__slot" style="--i:${i};--g:${(s.g[1] / 45) * 100}">
        <span class="fp-data">${s.t}</span><b>${s.k}</b><i aria-hidden="true"></i><small class="fp-data">${s.g.join('–')} g</small></div>`).join('')}
    </div>
  </div>

  <div class="fp-food__strip-h" data-fp-fade><h3>Lo que hay en la mesa ${tag('U')}</h3><span class="fp-small">Arrastrá →</span></div>
  <div class="fp-food__strip" tabindex="0" aria-label="Comidas habituales">
    ${n.foods.map((f, i) => `
    <article class="fp-food__plate" data-fp-tilt style="--i:${i}">
      <div class="fp-food__plate-art" aria-hidden="true"><span>${esc(f.slice(0, 1))}</span></div>
      <h4>${esc(f)}</h4>
      <p>${esc(FOOD_NOTES[f] || '')}</p>
    </article>`).join('')}
  </div>
  <p class="fp-small fp-food__foot">${icon('camera', 14)} ${esc(n.note)}</p>
</div>`;
  },

  init(el, ctx) {
    const rings = el.querySelector('[data-fp-food-rings]');
    const note = el.querySelector('[data-fp-food-note]');
    const demoSlot = el.querySelector('[data-fp-food-demo]');
    const prof = () => ctx.state.profile || {};

    const paint = () => {
      const today = ctx.M.todayISO();
      const days = ctx.state.days || [];
      let day = days.find((d) => d.date === today);
      let label = 'hoy';
      if (!day || !(day.meals || []).length) {
        // si hoy está vacío, mostrar el último día con comidas (marcado)
        const last = [...days].reverse().find((d) => (d.meals || []).length);
        if (last) { day = last; label = ctx.M.fmtDate(last.date); }
      }
      const p = day ? ctx.M.dayProtein(day) : 0;
      const k = day ? ctx.M.dayKcal(day) : 0;
      const w = day ? ctx.M.dayWater(day) : 0;
      const pg = prof().intake?.proteinG || [110, 130];
      const wl = prof().intake?.waterL || 3;
      const pStatus = p >= pg[0] ? 'ok' : p >= 100 ? 'warn' : '';
      rings.innerHTML = [
        `<div class="fp-gauge-cell">${ctx.ui.gauge({ value: p, max: 150, band: pg, label: 'Proteína', unit: 'g proteína', status: pStatus, size: 'lg', display: p ? ctx.ui.fmt(p, 0) : '0' })}<span class="fp-gauge-cell__name">Proteína</span><span class="fp-gauge-cell__t">meta ${pg.join('–')} g</span></div>`,
        `<div class="fp-gauge-cell">${ctx.ui.gauge({ value: w, max: wl, label: 'Agua', unit: 'litros', status: w >= wl ? 'ok' : '', display: ctx.ui.fmt(w, 2) })}<span class="fp-gauge-cell__name">Agua</span><span class="fp-gauge-cell__t">meta ${wl} L</span></div>`,
        `<div class="fp-gauge-cell">${ctx.ui.gauge({ value: k, max: 3100, band: [2700, 3100], label: 'Calorías', unit: 'kcal est.', display: k ? ctx.ui.fmt(k, 0) : '—' })}<span class="fp-gauge-cell__name">Kcal</span><span class="fp-gauge-cell__t">estimadas, editables</span></div>`,
      ].join('');
      demoSlot.innerHTML = day?.demo ? ctx.ui.demoChip() : '';
      if (!day) {
        note.innerHTML = 'Todavía no cargaste comidas. <a href="#/comida">Cargá tu primer plato →</a>';
      } else {
        const n = (day.meals || []).length;
        note.innerHTML = `${label === 'hoy' ? 'Hoy' : `Último día con comidas: ${ctx.ui.esc(label)}`} · ${n} comida${n === 1 ? '' : 's'} · creatina ${day.intake?.creatine ? '✓' : '—'}. <a href="#/comida">Sumar comida →</a>`;
      }
    };
    paint();
    ctx.onData(async () => { await ctx.load(); paint(); });

    // barras de repartición: entran cuando se ven
    const slots = el.querySelector('.fp-food__slots');
    ctx.env.onVisible(slots, (v) => { if (v) slots.classList.add('is-on'); }, { threshold: 0.3 });
    if (ctx.env.prefersReducedMotion()) slots.classList.add('is-on');

    // carrusel arrastrable con el mouse (el scroll-snap hace el resto)
    const strip = el.querySelector('.fp-food__strip');
    let down = false, sx = 0, sl = 0, moved = false;
    strip.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = strip.scrollLeft; strip.classList.add('is-drag'); });
    window.addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 3) moved = true; strip.scrollLeft = sl - dx; });
    window.addEventListener('pointerup', () => { if (!down) return; down = false; strip.classList.remove('is-drag'); });
    strip.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  },
};
