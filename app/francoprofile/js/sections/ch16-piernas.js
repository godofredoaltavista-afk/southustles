// FP · CH16 · PIERNAS Y RESISTENCIA — lo que dicen los mentores de running, resumido con palabras propias.
// Gráfico SVG de barras animado (km semanales A vs B) + escalera de cadencia (+3–4 pasos/min por bloque)
// con pulso visual de metrónomo (sin sonido: D10 reserva el audio a la sesión).
// Fuentes S2: zonas-de-entrenamiento, mejora-tu-cadencia, respira-mejor, c-mo-debes-correr-en-las-bajadas,
// haz-pasos-largos, los-5-errores, el-secreto-para-empezar-a-correr. 01 §7.4 / §12.4.
console.log('[fp/ch16-piernas] init');

const PRINCIPLES = [
  { k: 'Zona 2', t: 'La base es lenta', d: 'Ritmo en el que podés hablar entero. Construye el motor sin fundirte para la fuerza.', s: 'Solida', icon: 'heart' },
  { k: 'Cadencia', t: 'Pasos, no zancadas', d: 'Medí tu cadencia natural y subila de a 3–4 pasos/min por bloque con metrónomo. El rango típico va de ~160 a ~180.', s: 'Solida', icon: 'timer' },
  { k: 'Respiración', t: 'Primero el aire', d: 'Si no podés hablar, bajá. Respirar mejor te cansa menos que correr más rápido.', s: 'Solida', icon: 'drop' },
  { k: 'Bajadas', t: 'Corto y frecuente', d: 'En bajada, pasos cortos y rápidos; no frenes clavando el talón.', s: 'Parcial', icon: 'arrow' },
  { k: 'Zancada', t: 'Larga es cara', d: 'Alargar el paso cuesta más energía de lo que parece; la velocidad sale de la frecuencia y la técnica.', s: 'Parcial', icon: 'run' },
  { k: 'Interferencia', t: 'No antes de piernas', d: 'El cardio fuerte cerca de la sesión de piernas le roba a la hipertrofia. Separalo y dosificalo.', s: 'Parcial', icon: 'alert' },
];

const WEEKS = [
  { label: 'Hoy', a: 30, b: 30 },
  { label: 'Sem 1', a: 16, b: 30 },
  { label: 'Sem 2', a: 16, b: 30 },
  { label: 'Sem 3', a: 18, b: 30 },
  { label: 'Sem 4', a: 12, b: 24 },
];

export default {
  id: 'piernas',
  n: '16',
  title: 'Piernas y resistencia',
  pol: 'theme',
  bg: 'grid',
  app: 'plan',
  bridge: 'Las piernas ya las tenés. Ahora que no se coman la masa.',

  render(ctx) {
    const { tag, support, esc, icon } = ctx.ui;
    const H = 180, W = 520, bw = 34, gap = (W - WEEKS.length * bw * 2) / WEEKS.length;
    const bars = WEEKS.map((w, i) => {
      const x = i * (bw * 2 + gap) + gap / 2;
      const ha = (w.a / 32) * H, hb = (w.b / 32) * H;
      return `<g class="fp-legs__g" style="--i:${i}">
        <rect class="fp-legs__bar fp-legs__bar--a" x="${x}" y="${H - ha}" width="${bw - 4}" height="${ha}" rx="4"/>
        <rect class="fp-legs__bar fp-legs__bar--b" x="${x + bw}" y="${H - hb}" width="${bw - 4}" height="${hb}" rx="4"/>
        <text x="${x + bw - 2}" y="${H + 18}" text-anchor="middle">${w.label}</text>
        <text class="fp-legs__v" x="${x + (bw - 4) / 2}" y="${H - ha - 6}" text-anchor="middle">${w.a}</text>
        <text class="fp-legs__v fp-legs__v--b" x="${x + bw + (bw - 4) / 2}" y="${H - hb - 6}" text-anchor="middle">${w.b}</text>
      </g>`;
    }).join('');

    return `
<span class="fp-bg-word fp-bg-word--r" aria-hidden="true">zona dos</span>
<div class="fp-wrap">
  <header class="fp-head" data-fp-fade>
    <span class="fp-eyebrow"><b>16</b> Piernas y resistencia</span>
    <h2>Motor <em>lento,</em> piernas rápidas.</h2>
    <p class="fp-lede">Saltás la soga, jugás un partido, te parás en una pierna ${tag('U')}. Lo que sigue es cómo correr para que la resistencia sume y la hipertrofia no pague la cuenta.</p>
  </header>

  <div class="fp-legs__grid">
    ${PRINCIPLES.map((p) => `
    <article class="fp-legs__card" data-fp-fade>
      <span class="fp-legs__ico">${icon(p.icon, 20)}</span>
      <span class="fp-card__k">${esc(p.k)} ${tag('C')}</span>
      <h3>${esc(p.t)}</h3>
      <p>${esc(p.d)}</p>
      ${support(p.s)}
    </article>`).join('')}
  </div>

  <div class="fp-grid-2 fp-legs__charts">
    <figure class="fp-card fp-legs__chart" data-fp-fade="left">
      <figcaption><span class="fp-card__k">km por semana</span><h3>Opción A vs B</h3>
        <span class="fp-legs__legend"><i class="a"></i>A · prioridad masa <i class="b"></i>B · 3 × 10 km</span></figcaption>
      <svg viewBox="0 -14 ${W} ${H + 34}" class="fp-legs__svg" role="img" aria-label="Kilómetros semanales: opción A entre 12 y 18, opción B entre 24 y 30">${bars}
        <line x1="0" y1="${H}" x2="${W}" y2="${H}" class="fp-legs__axis"/></svg>
      <p class="fp-small">Proyección orientativa ${tag('C')}: la semana 4 baja como descarga. Hoy: ~30 km ${tag('U')}.</p>
    </figure>

    <figure class="fp-card fp-legs__cad" data-fp-fade="right">
      <figcaption><span class="fp-card__k">cadencia · pasos por minuto</span><h3>La escalera</h3></figcaption>
      <ol class="fp-legs__steps">
        <li><b class="fp-data">base</b><span>Medí tu cadencia natural en zona 2.</span></li>
        <li><b class="fp-data">+3–4</b><span>Un bloque con metrónomo a esa cadencia.</span></li>
        <li><b class="fp-data">+3–4</b><span>Otro bloque. Sin metrónomo, medís de nuevo.</span></li>
      </ol>
      <div class="fp-legs__metro">
        <div class="fp-legs__pulse" aria-hidden="true"><i></i><i></i></div>
        <div>
          <label class="fp-field"><span>Probá el pulso visual</span>
            <input class="fp-legs__range" type="range" min="150" max="185" step="1" value="165" aria-label="Cadencia en pasos por minuto">
          </label>
          <p class="fp-small"><b class="fp-data" data-fp-cad>165</b> pasos/min · un destello por paso.</p>
        </div>
      </div>
      <p class="fp-small">Ritmo declarado «7–8» ${tag('?')}: ¿min/km o km/h? Se pide en min/km al registrar.</p>
    </figure>
  </div>
</div>`;
  },

  init(el, ctx) {
    const reduced = ctx.env.prefersReducedMotion();
    const chart = el.querySelector('.fp-legs__svg');
    ctx.env.onVisible(chart, (v) => { if (v) chart.classList.add('is-on'); }, { threshold: 0.3 });
    if (reduced) chart.classList.add('is-on');

    // pulso visual a la cadencia elegida (un rAF, pausado fuera de pantalla)
    const range = el.querySelector('.fp-legs__range');
    const out = el.querySelector('[data-fp-cad]');
    const pulse = el.querySelector('.fp-legs__pulse');
    let spm = +range.value, raf = null, visible = false, t0 = performance.now(), lastStep = -1;
    range.addEventListener('input', () => { spm = +range.value; out.textContent = spm; });
    const tick = (now) => {
      raf = null;
      if (!visible) return;
      const step = Math.floor(((now - t0) / 60000) * spm);
      if (step !== lastStep) {
        lastStep = step;
        pulse.dataset.foot = step % 2 ? 'r' : 'l';
        pulse.classList.remove('is-beat'); void pulse.offsetWidth; pulse.classList.add('is-beat');
      }
      raf = requestAnimationFrame(tick);
    };
    if (!reduced) ctx.env.onVisible(pulse, (v) => { visible = v; if (v && !raf) raf = requestAnimationFrame(tick); });
  },
};
