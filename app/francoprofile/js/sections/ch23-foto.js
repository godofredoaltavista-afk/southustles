// FP · CH23 · FOTO DIARIA + GUÍA — el flujo que pidió Franco: foto del plato → texto de la guía externa → subir → queda el día.
// Línea que se dibuja con el scroll (bus único) y slider antes/después arrastrable (puntero + teclado)
// con placeholders SVG. NUNCA fotos reales acá: las fotos viven solo en el vault del dispositivo. 02 §6.6–6.7.
console.log('[fp/ch23-foto] init');

const STEPS = [
  { ico: 'camera', t: 'Sacás la foto', d: 'El plato del día, desde el celular.' },
  { ico: 'file', t: 'Pegás la guía', d: 'La explicación que te dio una guía externa: proteína y kcal estimadas.' },
  { ico: 'upload', t: 'La subís acá', d: 'Foto + texto + gramos editables. Se guardan en tu dispositivo.' },
  { ico: 'plan', t: 'Queda el día', d: 'Comida, sesión, check-in y JSON de Motion Lab juntos en la misma fecha.' },
];

const plate = (variant) => {
  const a = variant === 'a';
  return `<svg viewBox="0 0 400 300" class="fp-photo__art fp-photo__art--${variant}" aria-hidden="true">
    <rect width="400" height="300" class="bg"/>
    <circle cx="200" cy="150" r="${a ? 96 : 106}" class="plate"/>
    <circle cx="200" cy="150" r="${a ? 70 : 80}" class="plate-in"/>
    ${a
      ? '<ellipse cx="175" cy="140" rx="34" ry="22" class="food f1"/><ellipse cx="225" cy="165" rx="26" ry="16" class="food f2"/><circle cx="215" cy="125" r="10" class="food f3"/>'
      : '<ellipse cx="170" cy="130" rx="40" ry="26" class="food f1"/><ellipse cx="232" cy="150" rx="34" ry="22" class="food f2"/><circle cx="196" cy="182" r="18" class="food f3"/><circle cx="240" cy="118" r="12" class="food f4"/>'}
    <text x="20" y="34" class="lbl">${a ? 'SEMANA 1' : 'SEMANA 6'}</text>
    <text x="20" y="280" class="lbl s">${a ? '≈ 28 g proteína · ejemplo' : '≈ 45 g proteína · ejemplo'}</text>
  </svg>`;
};

export default {
  id: 'foto',
  n: '23',
  title: 'Foto diaria',
  pol: 'theme',
  bg: 'beam',
  app: 'comida',
  bridge: 'La memoria del cuerpo también es lo que comiste.',

  render(ctx) {
    const { tag, esc, icon, demoChip } = ctx.ui;
    return `
<div class="fp-wrap">
  <header class="fp-head" data-fp-fade>
    <span class="fp-eyebrow"><b>23</b> Foto diaria + guía</span>
    <h2>Una foto <em>por</em> plato.</h2>
    <p class="fp-lede">Todos los días: foto del plato, la explicación de tu guía externa pegada al lado, y queda la comida de ese día ${tag('U')}. La app suma lo que cargás; no estima macros desde la imagen ${tag('C')}.</p>
  </header>

  <div class="fp-photo__flow" data-fp-flow>
    <svg class="fp-photo__path" viewBox="0 0 1000 20" preserveAspectRatio="none" aria-hidden="true"><path d="M0 10 H1000"/></svg>
    <ol class="fp-photo__steps">
    ${STEPS.map((s, i) => `<li class="fp-photo__step" style="--i:${i}" data-fp-fade>
      <span class="fp-photo__ico">${icon(s.ico, 22)}</span><b class="fp-data">0${i + 1}</b><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></li>`).join('')}
    </ol>
  </div>

  <div class="fp-grid-2 fp-photo__compare">
    <figure class="fp-photo__slider" data-fp-fade="left" style="--x:50%">
      <div class="fp-photo__layer fp-photo__layer--a">${plate('a')}</div>
      <div class="fp-photo__layer fp-photo__layer--b">${plate('b')}</div>
      <div class="fp-photo__handle" role="slider" tabindex="0" aria-label="Comparar semana 1 y semana 6" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"><i></i></div>
      <figcaption class="fp-row fp-row--between"><span class="fp-small">Antes / después · placeholders</span>${demoChip()}</figcaption>
    </figure>
    <div class="fp-photo__copy" data-fp-fade="right">
      <article class="fp-card fp-card--flat">
        <span class="fp-card__k">${icon('vault', 14)} privacidad</span>
        <h3>Las fotos no salen de tu dispositivo.</h3>
        <p>Viven en IndexedDB. No van al repo, ni a un bucket, ni a un log. Para moverlas, exportás el vault a mano.</p>
      </article>
      <article class="fp-card fp-card--flat">
        <span class="fp-card__k">${icon('eye', 14)} comparar</span>
        <h3>Semana contra semana.</h3>
        <p>Mismo encuadre, misma luz: arrastrá el corte para ver qué cambió en el plato y en el cuerpo.</p>
      </article>
      <a class="fp-btn fp-btn--primary" href="#/comida" data-fp-magnetic>${icon('camera', 18)} Cargar el plato de hoy</a>
    </div>
  </div>
</div>`;
  },

  init(el, ctx) {
    // línea del flujo que se dibuja con el scroll
    const flow = el.querySelector('[data-fp-flow]');
    if (ctx.env.prefersReducedMotion()) flow.style.setProperty('--draw', '1');
    else {
      let visible = false;
      ctx.env.onVisible(flow, (v) => { visible = v; });
      ctx.scroll.onScrollFrame(() => {
        if (!visible) return;
        const p = ctx.scroll.getSectionProgress(flow);
        flow.style.setProperty('--draw', Math.min(1, Math.max(0, (p - 0.2) / 0.4)).toFixed(3));
      });
    }

    // slider antes/después
    const fig = el.querySelector('.fp-photo__slider');
    const handle = fig.querySelector('.fp-photo__handle');
    let x = 50, drag = false;
    const set = (v) => { x = Math.max(0, Math.min(100, v)); fig.style.setProperty('--x', `${x}%`); handle.setAttribute('aria-valuenow', String(Math.round(x))); };
    const fromEvent = (e) => { const r = fig.getBoundingClientRect(); set(((e.clientX - r.left) / r.width) * 100); };
    fig.addEventListener('pointerdown', (e) => { drag = true; fig.setPointerCapture(e.pointerId); fromEvent(e); fig.classList.add('is-drag'); });
    fig.addEventListener('pointermove', (e) => { if (drag) fromEvent(e); });
    fig.addEventListener('pointerup', () => { drag = false; fig.classList.remove('is-drag'); });
    handle.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { set(x - 5); e.preventDefault(); }
      if (e.key === 'ArrowRight') { set(x + 5); e.preventDefault(); }
      if (e.key === 'Home') { set(0); e.preventDefault(); }
      if (e.key === 'End') { set(100); e.preventDefault(); }
    });
    // pequeño barrido de demostración al aparecer
    if (!ctx.env.prefersReducedMotion()) {
      let shown = false;
      ctx.env.onVisible(fig, (v) => {
        if (!v || shown) return; shown = true;
        const t0 = performance.now();
        const step = (now) => { if (drag) return; const t = Math.min(1, (now - t0) / 1600); set(50 + Math.sin(t * Math.PI * 2) * 28 * (1 - t)); if (t < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      }, { threshold: 0.5 });
    }
  },
};
