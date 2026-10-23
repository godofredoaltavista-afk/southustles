// FP · CH22 · CHECK-INS — demo viva del check-in de 30 s (02 §6.3). Datos de EJEMPLO, NO se guardan.
// Al entrar en pantalla el formulario «se llena solo» (como el onboarding de Motion Lab con su checklist animado);
// el visitante puede tocar todo y el resumen se actualiza en vivo. El check-in real vive en #/checkin.
console.log('[fp/ch22-checkins] init');

const SCALES = [
  { k: 'sleepQ', t: 'Calidad de sueño' },
  { k: 'energy', t: 'Energía' },
  { k: 'mood', t: 'Ánimo' },
  { k: 'pump', t: 'Bombeo' },
  { k: 'fatigue', t: 'Fatiga' },
];
const ZONES = ['dorsal', 'tríceps', 'hombro derecho', 'pulgar', 'glúteo', 'gemelo', 'rodilla', 'muñeca', 'cuello'];
const EXAMPLE = { sleepH: 8, sleepQ: 4, energy: 4, mood: 5, pump: 4, fatigue: 2, pain: 'doms', zone: 'dorsal', fed: true, trained: true, notes: 'Dorsal bombeado después de las dominadas.' };

const seg = (k, v) => `<div class="fp-seg" data-k="${k}" role="group">${[1, 2, 3, 4, 5].map((n) => `<button type="button" data-v="${n}" aria-pressed="${n === v}">${n}</button>`).join('')}</div>`;

export default {
  id: 'checkins',
  n: '22',
  title: 'Check-ins',
  pol: 'invert',
  bg: 'grid',
  app: 'checkin',
  bridge: 'Treinta segundos por día. Es lo que le da memoria al cuerpo.',

  render(ctx) {
    const { tag, esc, icon, demoChip } = ctx.ui;
    return `
<div class="fp-wrap">
  <header class="fp-head" data-fp-fade>
    <span class="fp-eyebrow"><b>22</b> Check-ins</span>
    <h2>Treinta <em>segundos.</em></h2>
    <p class="fp-lede">Sueño, energía, ánimo, bombeo, fatiga y dolor con zona. Con eso el planificador sabe cuándo sumar una serie y cuándo frenar ${tag('C')}.</p>
  </header>

  <div class="fp-ck">
    <form class="fp-card fp-card--glass fp-ck__form" data-fp-fade="left" aria-label="Demo de check-in (no guarda nada)">
      <div class="fp-row fp-row--between"><span class="fp-card__k">${icon('checkin', 14)} check-in · demo</span>${demoChip()}</div>
      <label class="fp-field"><span>Horas de sueño <b class="fp-data" data-out="sleepH">${EXAMPLE.sleepH} h</b></span>
        <input type="range" min="4" max="11" step="0.5" value="${EXAMPLE.sleepH}" data-k="sleepH" class="fp-ck__range"></label>
      <div class="fp-ck__scales">
        ${SCALES.map((s) => `<div class="fp-field"><span>${s.t}</span>${seg(s.k, EXAMPLE[s.k])}</div>`).join('')}
      </div>
      <div class="fp-form-grid">
        <div class="fp-field"><span>Dolor</span>
          <div class="fp-seg" data-k="pain" role="group">
            <button type="button" data-v="none" aria-pressed="false">Nada</button>
            <button type="button" data-v="doms" aria-pressed="true">Agujetas</button>
            <button type="button" data-v="joint" aria-pressed="false">Articular</button>
          </div></div>
        <label class="fp-field"><span>Zona</span><select class="fp-select" data-k="zone">${ZONES.map((z) => `<option ${z === EXAMPLE.zone ? 'selected' : ''}>${esc(z)}</option>`).join('')}</select></label>
      </div>
      <div class="fp-row">
        <label class="fp-switch"><input type="checkbox" data-k="fed" checked><i></i>¿Comiste antes?</label>
        <label class="fp-switch"><input type="checkbox" data-k="trained" checked><i></i>¿Entrenaste?</label>
      </div>
      <label class="fp-field"><span>Nota</span><input class="fp-input" data-k="notes" value="${esc(EXAMPLE.notes)}"></label>
      <p class="fp-small">${icon('info', 13)} Esta demo no guarda nada. Tu check-in real queda en tu vault.</p>
    </form>

    <aside class="fp-ck__out" data-fp-fade="right">
      <div class="fp-card fp-ck__summary">
        <span class="fp-card__k">así lo lee el planificador</span>
        <div class="fp-ck__rings" data-ck-rings></div>
        <ul class="fp-ck__flags" data-ck-flags></ul>
      </div>
      <div class="fp-ck__timer"><span class="fp-display" data-ck-timer>00:30</span><span class="fp-small">tiempo de carga estimado</span></div>
      <a class="fp-btn fp-btn--primary fp-btn--action" href="#/checkin" data-fp-magnetic>Hacer mi check-in</a>
    </aside>
  </div>
</div>`;
  },

  init(el, ctx) {
    const form = el.querySelector('.fp-ck__form');
    const state = { ...EXAMPLE };
    const rings = el.querySelector('[data-ck-rings]');
    const flags = el.querySelector('[data-ck-flags]');
    const timer = el.querySelector('[data-ck-timer]');
    form.addEventListener('submit', (e) => e.preventDefault());

    const segs = {};
    form.querySelectorAll('.fp-seg[data-k]').forEach((s) => {
      const k = s.dataset.k;
      segs[k] = ctx.ui.segmented(s, state[k], (v) => { state[k] = k === 'pain' ? v : +v; paint(); });
    });
    const range = form.querySelector('[data-k="sleepH"]');
    const rangeOut = form.querySelector('[data-out="sleepH"]');
    range.addEventListener('input', () => { state.sleepH = +range.value; rangeOut.textContent = `${ctx.ui.fmt(state.sleepH, 1)} h`; paint(); });
    form.querySelector('[data-k="zone"]').addEventListener('change', (e) => { state.zone = e.target.value; paint(); });
    form.querySelectorAll('input[type="checkbox"][data-k]').forEach((c) => c.addEventListener('change', () => { state[c.dataset.k] = c.checked; paint(); }));
    form.querySelector('[data-k="notes"]').addEventListener('input', (e) => { state.notes = e.target.value; });

    function paint() {
      rings.innerHTML = [
        ['Sueño', state.sleepH, 10, `${ctx.ui.fmt(state.sleepH, 1)} h`, state.sleepH >= 8 ? 'ok' : state.sleepH >= 7 ? 'warn' : 'bad'],
        ['Energía', state.energy, 5, `${state.energy}/5`, state.energy >= 4 ? 'ok' : state.energy >= 3 ? 'warn' : 'bad'],
        ['Bombeo', state.pump, 5, `${state.pump}/5`, state.pump >= 3 ? 'ok' : 'warn'],
        ['Fatiga', state.fatigue, 5, `${state.fatigue}/5`, state.fatigue <= 3 ? 'ok' : 'bad'],
      ].map(([n, v, max, disp, st]) => `<div class="fp-gauge-cell">${ctx.ui.gauge({ value: v, max, label: n, display: disp, size: 'sm', status: st })}<span class="fp-gauge-cell__name">${n}</span></div>`).join('');
      const f = [];
      if (state.pain === 'joint') f.push(['bad', 'alert', `Dolor articular en ${state.zone}: sacá el ejercicio que lo provoca y consultá.`]);
      else if (state.pain === 'doms') f.push(['ok', 'check', `Agujetas en ${state.zone}: permitidas, no miden el progreso.`]);
      if (state.fatigue >= 4) f.push(['warn', 'info', 'Fatiga alta: si se repite en la próxima sesión del grupo, −1 a −2 series.']);
      if (state.pump >= 3 && state.fatigue <= 3 && state.pain !== 'joint') f.push(['ok', 'sparkle', 'Buen bombeo y poca fatiga: si el volumen está bajo, +1 serie la semana próxima.']);
      if (state.sleepH < 7) f.push(['warn', 'moon', 'Menos de 7 h: hoy priorizá técnica antes que fallo.']);
      if (!state.fed && state.trained) f.push(['info', 'info', 'Entrenaste sin comer: se registra, no se asume nada.']);
      flags.innerHTML = f.map(([lvl, ico, t]) => `<li class="fp-ck__flag fp-ck__flag--${lvl}">${ctx.icon(ico, 15)}<span>${ctx.ui.esc(t)}</span></li>`).join('');
    }
    paint();

    // «se llena solo» al entrar: barre las escalas una vez + cuenta regresiva de 30 s
    if (ctx.env.prefersReducedMotion()) return;
    let played = false;
    ctx.env.onVisible(form, (v) => {
      if (!v || played) return;
      played = true;
      const seq = [['sleepQ', 3], ['sleepQ', 4], ['energy', 3], ['energy', 4], ['mood', 5], ['pump', 3], ['pump', 4], ['fatigue', 3], ['fatigue', 2]];
      seq.forEach(([k, v2], i) => setTimeout(() => { state[k] = v2; segs[k].set(v2); paint(); }, 450 + i * 260));
      const t0 = performance.now();
      const tick = (now) => {
        const left = Math.max(0, 30 - Math.floor((now - t0) / 1000) * 3);
        timer.textContent = `00:${String(left).padStart(2, '0')}`;
        if (left > 0) setTimeout(() => requestAnimationFrame(tick), 300);
        else timer.parentElement.classList.add('is-done');
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.35 });
  },
};
