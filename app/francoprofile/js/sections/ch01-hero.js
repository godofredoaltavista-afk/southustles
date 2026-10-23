// FP · CH01 HERO — titular gigante de South Hustles (Archivo 800 + serif itálica + gradiente),
// typewriter v2 + font-swap (sh2-fx.js initTypewriter2 / initFontSwap2), texto vertical de borde
// (hero de southhustles.com), hint de modos de campo G/Z/H/F (NavHUD de Ant on Mars).
// Fondo transparente: detrás corre el campo Three.js global (gl:'hero').
console.log('[fp/ch01-hero] init');

const PHRASES = ['Calistenia.', 'Boxeo.', 'Running en la costa.', 'Tempo 3-1-1.', 'Entrenando duro, durmiendo duro.'];
const VOICES = ['', 'fpa-v-serif', 'fpa-v-display', 'fpa-v-outline', 'fpa-v-grad'];
const MODES = [
  { k: 'G', name: 'gravedad' },
  { k: 'Z', name: 'imán' },
  { k: 'H', name: 'hook' },
  { k: 'F', name: 'flotar' },
];

export default {
  id: 'hero', n: '01', title: 'Inicio', pol: 'theme', gl: 'hero',
  render(ctx) {
    const { esc } = ctx.ui;
    const p = ctx.data.profile;
    return `
    <div class="fpa-hero">
      <div class="fpa-hero__top">
        <span class="fp-eyebrow"><b>01</b> ${esc(p.product)}</span>
        <span class="fpa-hero__coords fp-data">31°25′S · 64°11′O — ${esc(p.who.place)}</span>
      </div>

      <h1 class="fpa-hero__title" aria-label="Ganar músculo sin perder lo que ya sé hacer.">
        <span class="fpa-hero__line" data-fp-fade>Ganar músculo</span>
        <span class="fpa-hero__line" data-fp-fade><em class="fpa-grad">sin perder</em> lo que</span>
        <span class="fpa-hero__line" data-fp-fade>ya sé <span class="fpa-swap" data-fpa-swap>hacer.</span></span>
      </h1>

      <p class="fpa-hero__type" data-fp-fade><span class="fpa-hero__caret" aria-hidden="true">›</span> <span data-fpa-type>${esc(PHRASES[PHRASES.length - 1])}</span></p>

      <div class="fpa-hero__stats" data-fp-fade>
        <div class="fpa-stat"><b class="fp-data" data-fp-count="27">27</b><span>años ${ctx.ui.tag('U')}</span></div>
        <div class="fpa-stat"><b class="fp-data" data-fp-count="5">5</b><span>días por semana ${ctx.ui.tag('C')}</span></div>
        <div class="fpa-stat"><b class="fp-data"><i data-fp-count="3">3</i> L</b><span>de agua ${ctx.ui.tag('U')}</span></div>
        <div class="fpa-stat"><b class="fp-data">110–130 g</b><span>de proteína ${ctx.ui.tag('U')}</span></div>
      </div>

      <div class="fpa-hero__cta" data-fp-fade>
        <a class="fp-btn fp-btn--primary" href="#ch-quien" data-fp-magnetic data-fpa-scrollto="ch-quien">Recorrer el perfil ${ctx.icon('arrow', 16)}</a>
        <a class="fp-btn" href="#/hoy" data-fp-magnetic data-fp-dirfill>Abrir la app</a>
      </div>

      <div class="fpa-hero__keys" data-fp-fade aria-label="Modos del campo de partículas">
        <span class="fpa-hero__keys-l">Campo</span>
        ${MODES.map((m) => `<button type="button" class="fpa-key" data-fpa-drive="${m.k}" title="Modo ${m.name} (tecla ${m.k})"><kbd>${m.k}</kbd><span>${m.name}</span></button>`).join('')}
      </div>

      <div class="fpa-hero__vert" aria-hidden="true">Entrenando duro, durmiendo duro — atleta híbrido — calistenia · boxeo · running</div>

      <a class="fpa-hero__cue" href="#ch-quien" data-fpa-scrollto="ch-quien" aria-label="Bajar al capítulo siguiente">
        <span class="fpa-hero__cue-line" aria-hidden="true"></span><span>scroll</span>
      </a>
    </div>`;
  },

  init(el, ctx) {
    const reduced = ctx.env.prefersReducedMotion();

    // scroll suave a un capítulo
    el.querySelectorAll('[data-fpa-scrollto]').forEach((a) => a.addEventListener('click', (e) => {
      const t = document.getElementById(a.dataset.fpaScrollto);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    }));

    // modos de campo (también se pueden activar con el teclado desde el HUD)
    const keys = [...el.querySelectorAll('[data-fpa-drive]')];
    const mark = (k) => keys.forEach((b) => b.classList.toggle('is-on', b.dataset.fpaDrive === k));
    keys.forEach((b) => b.addEventListener('click', () => { ctx.gl.setDrive?.(b.dataset.fpaDrive); mark(b.dataset.fpaDrive); }));
    document.addEventListener('fp-drive', (e) => mark(e.detail?.mode));
    mark('Z');

    // typewriter v2: tipea ~34 ms, borra ~18 ms, sostiene 900 ms, loop. Pausa fuera de pantalla.
    const tw = el.querySelector('[data-fpa-type]');
    if (tw && !reduced) {
      let pi = 0, ci = 0, del = false, timer = null, visible = true;
      const tick = () => {
        timer = null;
        if (!visible) return;
        const ph = PHRASES[pi];
        ci += del ? -1 : 1;
        tw.textContent = ph.slice(0, ci);
        let d = del ? 18 : 34;
        if (!del && ci === ph.length) { d = 900; del = true; }
        else if (del && ci === 0) { del = false; pi = (pi + 1) % PHRASES.length; d = 240; }
        timer = setTimeout(tick, d);
      };
      ctx.env.onVisible(el, (v) => { visible = v; if (v && !timer) timer = setTimeout(tick, 200); });
      tw.textContent = '';
      timer = setTimeout(tick, 600);
    }

    // font-swap v2: la palabra cambia de voz cada 1,1 s (Archivo → serif → display → contorno → gradiente)
    const sw = el.querySelector('[data-fpa-swap]');
    if (sw && !reduced) {
      let i = 0, t = null;
      ctx.env.onVisible(sw, (v) => {
        if (v && !t) t = setInterval(() => { VOICES.forEach((c) => c && sw.classList.remove(c)); i = (i + 1) % VOICES.length; if (VOICES[i]) sw.classList.add(VOICES[i]); }, 1100);
        else if (!v && t) { clearInterval(t); t = null; }
      }, { threshold: 0.3 });
    }

    // parallax suave del titular con el bus único de scroll
    if (!reduced) {
      const title = el.querySelector('.fpa-hero__title');
      const vert = el.querySelector('.fpa-hero__vert');
      ctx.scroll.onScrollFrame(() => {
        const p = ctx.scroll.getSectionProgress(el);
        if (p <= 0 || p >= 1) return;
        const k = Math.max(0, p - 0.5) * 2; // solo al salir
        title.style.translate = `0 ${(-k * 80).toFixed(1)}px`;
        title.style.opacity = String(1 - k * 0.9);
        if (vert) vert.style.translate = `0 ${(k * 120).toFixed(1)}px`;
      });
    }
  },
};
