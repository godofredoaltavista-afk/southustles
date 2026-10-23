// FP · CH15 · CARDIO VS MASA — Opción A (prioridad masa, recomendada) / B (mantener 3×10 km comiendo más).
// Toggle A/B con relleno direccional (sh2-fx.js de South Hustles) + indicador que se desliza; guarda profile.cardio.mode.
// Fuente: 01 §7.4, data/profile-public.json → cardio. D6: A recomendada, B válida, decide Franco.
console.log('[fp/ch15-cardio] init');

const KM_SESSION = 10;
const RUNS = 3;

export default {
  id: 'cardio',
  n: '15',
  title: 'Cardio vs masa',
  pol: 'invert',
  bg: 'beam',
  app: 'plan',
  bridge: 'Correr suma. Pero cada kilómetro también se come.',

  render(ctx) {
    const { tag, support, esc, icon } = ctx.ui;
    const c = ctx.data.profile.cardio;
    return `
<div class="fp-wrap">
  <header class="fp-head" data-fp-fade>
    <span class="fp-eyebrow"><b>15</b> Cardio vs masa</span>
    <h2>Correr <em>sin</em> robarle a la masa.</h2>
    <p class="fp-lede">Hoy corrés ~${KM_SESSION} km × ${RUNS} por semana en ${esc(c.current.place)} ${tag('U')}. Son unos ${KM_SESSION * RUNS} km: del orden de <b class="fp-data">+1.500–2.000 kcal</b> por semana ${tag('C')} que también hay que comer. Elegís vos.</p>
  </header>

  <div class="fp-cardio" data-fp-fade>
    <div class="fp-cardio__toggle" role="group" aria-label="Elegí la opción de cardio">
      <i class="fp-cardio__ind" aria-hidden="true"></i>
      <button type="button" class="fp-cardio__opt" data-opt="A" data-fp-dirfill aria-pressed="true">
        <span class="fp-display">A</span><span>Prioridad masa</span><small>recomendada</small>
      </button>
      <button type="button" class="fp-cardio__opt" data-opt="B" data-fp-dirfill aria-pressed="false">
        <span class="fp-display">B</span><span>Mantener 3 × 10 km</span><small>válida</small>
      </button>
    </div>

    <div class="fp-cardio__panes">
      <article class="fp-cardio__pane is-on" data-pane="A">
        <h3>${esc(c.A.title)} ${tag('C')}</h3>
        <p>${esc(c.A.detail)}</p>
        <ul class="fp-list">
          <li>Salidas suaves en <b>zona 2</b>: tenés que poder hablar.</li>
          <li>Nunca la salida el <b>día antes de piernas</b> (martes → miércoles).</li>
          <li>El superávit chico (+250–350 kcal/día) alcanza para subir.</li>
        </ul>
      </article>
      <article class="fp-cardio__pane" data-pane="B">
        <h3>${esc(c.B.title)} ${tag('C')}</h3>
        <p>${esc(c.B.detail)}</p>
        <ul class="fp-list">
          <li>Sumá <b>+250–300 kcal/día</b> además del superávit.</li>
          <li>Recortá la bolsa del sábado.</li>
          <li>Ojo con gemelos y glúteos: si se cargan, bajá un día.</li>
        </ul>
      </article>
    </div>

    <div class="fp-cardio__stats">
      <div class="fp-cardio__stat"><span class="fp-card__k">semana actual ${tag('U')}</span><b class="fp-card__big"><span data-fp-count="${KM_SESSION * RUNS}">${KM_SESSION * RUNS}</span><small>km</small></b></div>
      <div class="fp-cardio__stat"><span class="fp-card__k">gasto extra ${tag('C')}</span><b class="fp-card__big">1,5–2<small>mil kcal</small></b></div>
      <div class="fp-cardio__stat"><span class="fp-card__k">opción A ${tag('C')}</span><b class="fp-card__big">6–20<small>km/sem</small></b></div>
      <div class="fp-cardio__stat" data-fp-cardio-week><span class="fp-card__k">tus últimos 7 días</span><b class="fp-card__big">—<small>km</small></b></div>
    </div>

    <p class="fp-cardio__foot fp-small">${icon('info', 14)} Interferencia: el cardio frena la hipertrofia según volumen, intensidad y cercanía a la fuerza ${support('Parcial')}. Ritmo declarado «7–8» ${tag('?')}: al registrar una salida se pide en min/km.</p>
  </div>
</div>`;
  },

  async init(el, ctx) {
    const opts = [...el.querySelectorAll('.fp-cardio__opt')];
    const panes = [...el.querySelectorAll('.fp-cardio__pane')];
    const toggle = el.querySelector('.fp-cardio__toggle');
    const weekCell = el.querySelector('[data-fp-cardio-week] b');

    const paint = (mode) => {
      opts.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.opt === mode)));
      panes.forEach((p) => p.classList.toggle('is-on', p.dataset.pane === mode));
      toggle.dataset.mode = mode;
    };

    const paintWeek = () => {
      const { days } = ctx.state;
      const today = ctx.M.todayISO();
      const km = ctx.M.runKm(days || [], ctx.M.addDays(today, -6), today);
      const demo = (days || []).some((d) => d.demo && d.run && d.date > ctx.M.addDays(today, -7));
      weekCell.innerHTML = `${km ? ctx.ui.fmt(km, 1) : '—'}<small>km${demo ? ' · ejemplo' : ''}</small>`;
    };

    paint(ctx.state.profile?.cardio?.mode || 'A');
    paintWeek();

    opts.forEach((b) => b.addEventListener('click', async () => {
      const mode = b.dataset.opt;
      paint(mode);
      try {
        await ctx.store.saveProfile({ cardio: { mode } });
        ctx.ui.toast(mode === 'A' ? 'Opción A guardada: prioridad masa.' : 'Opción B guardada: 3 × 10 km comiendo más.', 'ok');
      } catch {
        ctx.ui.toast('No pude guardar (sin vault en este navegador).', 'bad');
      }
    }));

    ctx.onData(async () => { await ctx.load(); paint(ctx.state.profile?.cardio?.mode || 'A'); paintWeek(); });
  },
};
