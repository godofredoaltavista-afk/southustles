// FP · MOOD M1 — póster glitch «Other Intelligences» → «Otras inteligencias: el cuerpo».
// Moodboard de Franco: blobs en gradiente (rosa/naranja/ultramar), garabatos rojos con feTurbulence +
// feDisplacementMap animados, scanlines, tipografía roja de póster. Parallax por capas con el bus de scroll.
// Sin WebGL: SVG + CSS. Fuera de pantalla todo queda en pausa (SMIL incluido).
console.log('[fp/mood-poster] init');

const rng = (s) => () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
const pad = (n) => String(n).padStart(2, '0');

/** Garabatos rojos tipo «hilos» del póster (semilla fija → siempre iguales). */
function scribbles() {
  const R = rng(1023);
  let out = '';
  for (let i = 0; i < 34; i++) {
    let x = 80 + R() * 1040, y = 60 + R() * 240;
    let d = `M${x.toFixed(0)} ${y.toFixed(0)}`;
    const segs = 6 + Math.floor(R() * 9);
    for (let s = 0; s < segs; s++) {
      const dx = (R() - 0.5) * 120, dy = 40 + R() * 70;
      const cx = x + (R() - 0.5) * 160, cy = y + dy * 0.5;
      x += dx; y += dy;
      d += ` Q${cx.toFixed(0)} ${cy.toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)}`;
    }
    const w = (0.8 + R() * 2.4).toFixed(1);
    out += `<path d="${d}" pathLength="1" stroke-width="${w}" style="--d:${(R() * 1.6).toFixed(2)}s"/>`;
  }
  return out;
}

export default {
  id: 'mood-poster',
  n: 'M1',
  title: 'Otras inteligencias',
  pol: 'mood',
  render(ctx) {
    const t = ctx.M.parseISO(ctx.M.todayISO());
    const start = `${pad(t.getDate())}.${pad(t.getMonth() + 1)}`;
    return `
<div class="fp-mp" data-mp>
  <div class="fp-mp__bg" data-mp-depth="0.18" aria-hidden="true">
    <i class="fp-mp__blob fp-mp__blob--1"></i><i class="fp-mp__blob fp-mp__blob--2"></i><i class="fp-mp__blob fp-mp__blob--3"></i>
    <i class="fp-mp__blob fp-mp__blob--4"></i><i class="fp-mp__blob fp-mp__blob--5"></i><i class="fp-mp__blob fp-mp__blob--6"></i>
  </div>
  <div class="fp-mp__orb" data-mp-depth="0.42" aria-hidden="true"></div>
  <svg class="fp-mp__scribble" data-mp-depth="0.62" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <filter id="fp-mp-wobble" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="2" seed="4" result="n">
          <animate attributeName="baseFrequency" dur="11s" values="0.009;0.017;0.009" repeatCount="indefinite"/>
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G">
          <animate attributeName="scale" dur="7s" values="18;34;18" repeatCount="indefinite"/>
        </feDisplacementMap>
      </filter>
    </defs>
    <g class="fp-mp__threads" filter="url(#fp-mp-wobble)">${scribbles()}</g>
  </svg>
  <div class="fp-mp__slices" aria-hidden="true"><i></i><i></i><i></i></div>

  <div class="fp-mp__frame" data-mp-depth="0.06">
    <div class="fp-mp__top fp-data">
      <span>FRANCO · PERFIL VIVO</span><span>M1 / OTRAS INTELIGENCIAS</span><span>CÓRDOBA · AR</span>
    </div>
    <div class="fp-mp__type">
      <p class="fp-mp__dates" data-fp-fade>${start} — 22.12.2026</p>
      <h2 class="fp-mp__title" data-fp-fade data-fp-delay="80">
        <span class="fp-mp__g" data-text="OTRAS INTELIGENCIAS:">OTRAS INTELIGENCIAS:</span>
        <span class="fp-mp__g fp-mp__g--b" data-text="EL CUERPO">EL CUERPO</span>
      </h2>
      <p class="fp-mp__open" data-fp-fade data-fp-delay="160">ABIERTO TODOS LOS DÍAS<br>DE 8 A 22 h</p>
    </div>
    <div class="fp-mp__bottom">
      <p class="fp-mp__motto" data-fp-fade>ENTRENANDO DURO,<br>DURMIENDO DURO</p>
      <ul class="fp-mp__credits fp-data" data-fp-fade data-fp-delay="120">
        <li>CALISTENIA · BOXEO · RUNNING ${ctx.ui.tag('U')}</li>
        <li>TEMPO 3-1-1 · RIR 1–2</li>
        <li>META 65–65,5 KG AL 22/12 ${ctx.ui.tag('U')}</li>
        <li>SIN PROMESAS · CON REGISTRO</li>
      </ul>
      <div class="fp-mp__dots" aria-hidden="true"><i class="is-on"></i><i></i><i></i><i></i><i></i></div>
    </div>
  </div>
  <div class="fp-mp__scan" aria-hidden="true"></div>
  <p class="fp-mp__vert fp-data" aria-hidden="true">OTHER INTELLIGENCES → EL CUERPO TAMBIÉN PIENSA</p>
</div>`;
  },
  init(el, ctx) {
    const stage = el.querySelector('[data-mp]');
    const svg = el.querySelector('.fp-mp__scribble');
    const layers = [...el.querySelectorAll('[data-mp-depth]')];
    const reduced = ctx.env.prefersReducedMotion();
    let visible = false;

    // dibujado de hilos al entrar
    requestAnimationFrame(() => stage.classList.add('is-drawn'));

    ctx.env.onVisible(el, (v) => {
      visible = v;
      el.classList.toggle('fp-is-live', v && !reduced);
      try { if (v && !reduced) svg.unpauseAnimations(); else svg.pauseAnimations(); } catch { /* sin SMIL */ }
    });
    if (reduced) { try { svg.pauseAnimations(); } catch { /* */ } return; }

    // parallax por capas (un solo bus de scroll)
    ctx.scroll.onScrollFrame(() => {
      if (!visible) return;
      const p = ctx.scroll.getSectionProgress(el) - 0.5;
      for (const l of layers) l.style.translate = `0 ${(p * +l.dataset.mpDepth * -420).toFixed(1)}px`;
      stage.style.setProperty('--fp-mp-p', (p + 0.5).toFixed(3));
    });

    // los blobs siguen al mouse con lerp (solo con puntero fino)
    if (!ctx.env.fxEnabled()) return;
    const bg = el.querySelector('.fp-mp__bg');
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    const tick = () => {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      bg.style.setProperty('--fp-mp-mx', `${cx.toFixed(1)}px`);
      bg.style.setProperty('--fp-mp-my', `${cy.toFixed(1)}px`);
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.3 && visible ? requestAnimationFrame(tick) : null;
    };
    stage.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 70;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 50;
      if (!raf) raf = requestAnimationFrame(tick);
    });
    stage.addEventListener('pointerleave', () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(tick); });
  },
};
