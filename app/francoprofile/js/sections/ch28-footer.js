// FP · CH28 · FOOTER GIGANTE — «Entrenando duro, durmiendo duro.» (base.css .footer-giant de South Hustles)
// + marquee acoplado a la velocidad del scroll (initMqMenuSpeed de South Hustles, vía el bus único)
// + contadores + «Volver al inicio» (cierra el loop del scroll infinito) + ecosistema + colofón de privacidad.
// gl:'calm' → el campo de partículas global queda en reposo detrás (fondo transparente).
console.log('[fp/ch28-footer] init');

const ECO = [
  { t: 'South Hustles', d: 'el estudio · huésped de esta página', href: '../' },
  { t: 'Motion Lab', d: 'el laboratorio de movimiento', href: '../motionlab/' },
  { t: 'Ant on Mars', d: 'el colectivo · HUD y cursor', href: 'https://ant-on-mars-super-frontend.vercel.app' },
  { t: 'Apacheta', d: 'con Joaco · navegación y cielo', href: null },
];

export default {
  id: 'footer',
  n: '28',
  title: 'Cierre',
  pol: 'theme',
  gl: 'calm',

  render(ctx) {
    const { icon, esc } = ctx.ui;
    const chunk = '<span class="fp-mq__chunk">Entrenando <i>duro,</i> durmiendo <i>duro.</i><span class="fp-mq__sep" aria-hidden="true">✦</span></span>';
    return `
<div class="fp-mq" aria-hidden="true"><div class="fp-mq__track">${chunk.repeat(4)}${chunk.repeat(4)}</div></div>

<div class="fp-foot">
  <p class="fp-foot__k fp-eyebrow"><b>28</b> Franco · Perfil vivo</p>
  <h2 class="fp-foot__type" data-fp-fade>Entrenando <em>duro,</em><br><b>durmiendo duro.</b></h2>
  <p class="fp-foot__sub" data-fp-fade>Ganar músculo sin perder lo que ya sé hacer. Un capítulo por vez, una serie bien hecha por vez.</p>

  <div class="fp-foot__trust">
    <div><b><span data-fp-count="28">28</span></b><span>capítulos</span></div>
    <div><b><span data-fp-count="21">21</span></b><span>transcripciones de mentores</span></div>
    <div><b><span data-fp-count="${ctx.data.premises.length}">${ctx.data.premises.length}</span></b><span>premisas calibradas</span></div>
    <div><b>0</b><span>datos en la nube</span></div>
  </div>

  <div class="fp-foot__actions">
    <button type="button" class="fp-btn fp-btn--primary fp-btn--action" data-foot-top data-fp-magnetic>${icon('up', 20)} Volver al inicio</button>
    <a class="fp-btn" href="#/hoy" data-fp-dirfill>Abrir la app ${icon('arrow', 16)}</a>
  </div>

  <nav class="fp-foot__eco" aria-label="Ecosistema">
    ${ECO.map((e, i) => (e.href
      ? `<a class="fp-foot__eco-a" href="${esc(e.href)}"${/^https?:/.test(e.href) ? ' target="_blank" rel="noopener"' : ''} data-fp-dirfill><span class="fp-data">0${i + 1}</span><b>${esc(e.t)}</b><small>${esc(e.d)}</small>${icon('arrow', 16)}</a>`
      : `<div class="fp-foot__eco-a is-static"><span class="fp-data">0${i + 1}</span><b>${esc(e.t)}</b><small>${esc(e.d)}</small>${icon('sparkle', 16)}</div>`)).join('')}
  </nav>

  <footer class="fp-foot__colo">
    <p>${icon('vault', 14)} Local-first: peso, comidas, check-ins y fotos viven en este dispositivo. Sin analytics, sin trackers. No es una app médica: no diagnostica ni promete resultados.</p>
    <p>Hecha additive-only sobre South Hustles, Motion Lab, Ant on Mars y Apacheta · ${new Date().getFullYear()} · Córdoba, AR.</p>
  </footer>
</div>`;
  },

  init(el, ctx) {
    el.querySelector('[data-foot-top]').addEventListener('click', () => {
      const behavior = ctx.env.prefersReducedMotion() ? 'auto' : 'smooth';
      window.scrollTo({ top: 0, behavior });
      document.getElementById('fp-scroll')?.focus({ preventScroll: true });
    });

    // marquee: velocidad acoplada al scroll (BASE 17 s, MIN 9 s como initMqMenuSpeed)
    const mq = el.querySelector('.fp-mq');
    if (ctx.env.prefersReducedMotion()) { mq.classList.add('is-static'); return; }
    const BASE = 17, MIN = 9;
    let vel = 0, raf = null, visible = false;
    const tick = () => {
      raf = null;
      if (!visible) return;
      vel += (Math.abs(ctx.scroll.scrollVelocity()) - vel) * 0.15;
      mq.style.setProperty('--fp-mq-speed', `${Math.max(MIN, BASE - vel * 0.35).toFixed(2)}s`);
      raf = requestAnimationFrame(tick);
    };
    ctx.env.onVisible(mq, (v) => {
      visible = v;
      mq.classList.toggle('is-paused', !v);
      if (v && !raf) raf = requestAnimationFrame(tick);
    });
  },
};
