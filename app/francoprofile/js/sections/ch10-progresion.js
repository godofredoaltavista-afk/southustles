// FP · CH10 SIN PESAS, IGUAL PROGRESA — film-strip horizontal con scroll-snap (glosario de South Hustles)
// con las 9 palancas de progresión de 01 §5.6 en orden de preferencia, arrastrable con el mouse,
// flechas y puntitos de posición. Tope de carga 20 kg [U].
console.log('[fp/ch10-progresion] init');

const LEVERS = [
  { t: 'Más repeticiones', d: 'Dentro del rango, con la misma técnica.', ej: 'Flexiones diamante 8 → 12.' },
  { t: 'Bajada más lenta', d: '3 s → 4 s → 5 s de excéntrica.', ej: 'Tríceps overhead con 5 s de bajada.' },
  { t: 'Pausa isométrica', d: 'De 1 s a 2–3 s en el punto de más tensión.', ej: 'Sentadilla con 3 s abajo.' },
  { t: 'Unilateral', d: 'Una pierna, un brazo.', ej: 'Búlgara, RDL a una pierna, remo a una mano.' },
  { t: 'Más palanca', d: 'Pies elevados, manos más separadas o juntas, handles más profundos.', ej: 'Flexiones con pies en la cama.' },
  { t: 'Banda sumada', d: 'Resistencia o asistencia elástica.', ej: 'Banda en la espalda para flexiones.' },
  { t: 'Mochila / garrafa', d: 'Carga casera para sentadilla y dominada.', ej: 'Garrafa encima en flexiones (agarre seguro).' },
  { t: 'Menos descanso', d: 'Recortá 10–15 s entre series.', ej: 'De 90 s a 75 s en compuestos.' },
  { t: 'Más series', d: '+1 serie si te recuperás bien.', ej: 'Dorsal de 12 a 13 series en la semana.' },
];

export default {
  id: 'progresion', n: '10', title: 'Progresión', pol: 'theme', bg: 'dots', app: 'biblioteca',
  bridge: 'Cuando 20 kg ya no alcanzan, se cambia la palanca, no el peso.',
  render(ctx) {
    const { esc, tag } = ctx.ui;
    return `
    <div class="fp-wrap fpa-prog">
      <div class="fp-head">
        <span class="fp-eyebrow"><b>10</b> Sin pesas, igual progresa</span>
        <h2>Nueve palancas <em>en orden</em>.</h2>
        <p class="fp-lede">Carga total en casa: 20 kg ${tag('U')}. Cuando un ejercicio se vuelve liviano, se progresa con estas palancas, en este orden ${tag('C')}.</p>
      </div>
    </div>
    <div class="fpa-strip" data-fpa-strip>
      <div class="fpa-strip__track" tabindex="0" aria-label="Palancas de progresión, desplazable" data-fpa-track>
        ${LEVERS.map((l, i) => `
        <article class="fpa-frame">
          <span class="fpa-frame__perf" aria-hidden="true"></span>
          <span class="fpa-frame__n fp-display">${String(i + 1).padStart(2, '0')}</span>
          <h3>${esc(l.t)}</h3>
          <p>${esc(l.d)}</p>
          <p class="fpa-frame__ej"><span>Ej.</span> ${esc(l.ej)}</p>
          <span class="fpa-frame__perf fpa-frame__perf--b" aria-hidden="true"></span>
        </article>`).join('')}
        <article class="fpa-frame fpa-frame--rule">
          <span class="fpa-frame__n fp-display">↺</span>
          <h3>Progresión doble</h3>
          <p>Cuando llegás al tope del rango de reps en <b>todas</b> las series con buena técnica → aplicás la siguiente palanca.</p>
        </article>
      </div>
      <div class="fp-wrap fpa-strip__nav">
        <button type="button" class="fp-btn fp-btn--sm fp-btn--icon" data-fpa-prev aria-label="Anterior">${ctx.icon('back', 16)}</button>
        <div class="fpa-strip__dots" data-fpa-dots aria-hidden="true">${LEVERS.map(() => '<i></i>').join('')}<i></i></div>
        <button type="button" class="fp-btn fp-btn--sm fp-btn--icon" data-fpa-next aria-label="Siguiente">${ctx.icon('arrow', 16)}</button>
      </div>
    </div>`;
  },

  init(el, ctx) {
    const track = el.querySelector('[data-fpa-track]');
    const dots = [...el.querySelectorAll('[data-fpa-dots] i')];
    const frames = [...track.children];
    const step = () => (frames[0]?.getBoundingClientRect().width || 300) + 20;
    el.querySelector('[data-fpa-prev]').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    el.querySelector('[data-fpa-next]').addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    let tick = false;
    track.addEventListener('scroll', () => {
      if (tick) return; tick = true;
      requestAnimationFrame(() => {
        tick = false;
        const i = Math.round(track.scrollLeft / step());
        dots.forEach((d, j) => d.classList.toggle('is-on', j === i));
        frames.forEach((f) => {
          const r = f.getBoundingClientRect(), c = r.left + r.width / 2, mid = window.innerWidth / 2;
          f.style.setProperty('--fpa-d', Math.min(1, Math.abs(c - mid) / window.innerWidth).toFixed(3));
        });
      });
    }, { passive: true });
    track.dispatchEvent(new Event('scroll'));
    // arrastre con el mouse (en touch ya es nativo)
    if (ctx.env.fxEnabled()) {
      let down = false, sx = 0, sl = 0, moved = false;
      track.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; track.classList.add('is-drag'); });
      window.addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 3) moved = true; track.scrollLeft = sl - dx; });
      window.addEventListener('pointerup', () => { if (!down) return; down = false; track.classList.remove('is-drag'); if (moved) { const i = Math.round(track.scrollLeft / step()); track.scrollTo({ left: i * step(), behavior: 'smooth' }); } });
    }
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: step(), behavior: 'smooth' }); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: -step(), behavior: 'smooth' }); }
    });
  },
};
