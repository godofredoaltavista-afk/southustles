// FP · CH09 SOBRECARGA PROGRESIVA — las 4 palancas que mueven la aguja como flashcards 3D
// (glosario de South Hustles: widgets.css .glosario-card con rotateY(180deg) al hover/click).
// Fuente: S2 ganar-m-sculo-se-reduce-a-estas-4-cosas.md (resumen propio) + 01 §12.4.
console.log('[fp/ch09-sobrecarga] init');

const LEVERS = [
  { n: '01', t: 'Sobrecarga con registro', k: 'Anotá cada serie', back: 'Hacé un poco más que la vez anterior —una rep, un segundo más de bajada, una palanca— y dejalo registrado. Sin registro no hay sobrecarga progresiva.', icon: 'file' },
  { n: '02', t: 'Volumen repartido', k: '12–20 series / músculo / semana', back: 'Contá las series efectivas de cada grupo en 7 días y repartilas en al menos 2 días. Menos de 12 es poco; más de 20 rara vez suma.', icon: 'layers' },
  { n: '03', t: 'Cerca del fallo', k: 'RIR 1–2', back: 'Terminá a una o dos reps del fallo. El fallo, solo en la última serie de un ejercicio seguro. Todos los músculos al fallo todos los días: no.', icon: 'target' },
  { n: '04', t: 'Tiempo y adherencia', k: '8–12 semanas', back: 'Los cambios visibles llegan en 8–12 semanas. La constancia le gana a cualquier rutina perfecta que se abandona.', icon: 'timer' },
];

export default {
  id: 'sobrecarga', n: '09', title: 'Sobrecarga', pol: 'invert', bg: 'beam', app: 'plan',
  bridge: 'Cuatro palancas. Lo demás es detalle.',
  render(ctx) {
    const { esc, tag, support } = ctx.ui;
    return `
    <div class="fp-wrap fpa-sobre">
      <div class="fp-head">
        <span class="fp-eyebrow"><b>09</b> Sobrecarga progresiva</span>
        <h2>Ganar músculo se reduce a <em>cuatro cosas</em>.</h2>
        <p class="fp-lede">Lo que coinciden los mentores ${tag('C')} ${support('Solida')}. Tocá una carta para darla vuelta.</p>
      </div>
      <div class="fpa-flips">
        ${LEVERS.map((l, i) => `
        <button type="button" class="fpa-flip" data-fp-fade data-fp-delay="${i * 90}" aria-pressed="false" aria-label="${esc(l.t)}: ${esc(l.k)}. Dar vuelta.">
          <span class="fpa-flip__in">
            <span class="fpa-flip__face fpa-flip__front">
              <span class="fpa-flip__n fp-display">${l.n}</span>
              <span class="fpa-flip__ico">${ctx.icon(l.icon, 28)}</span>
              <span class="fpa-flip__t">${esc(l.t)}</span>
              <span class="fpa-flip__k fp-data">${esc(l.k)}</span>
            </span>
            <span class="fpa-flip__face fpa-flip__back">
              <span class="fpa-flip__t">${esc(l.t)}</span>
              <span class="fpa-flip__p">${esc(l.back)}</span>
              <span class="fpa-flip__src fp-small">S2 · ganar-m-sculo-se-reduce-a-estas-4-cosas.md</span>
            </span>
          </span>
        </button>`).join('')}
      </div>
    </div>`;
  },

  init(el) {
    el.querySelectorAll('.fpa-flip').forEach((b) => b.addEventListener('click', () => {
      const on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', String(on));
    }));
  },
};
