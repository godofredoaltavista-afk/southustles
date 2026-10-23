// FP · MOOD M10 — franjas espectrales (moodboard «09TH ANNUAL LOVIE AWARDS») → «01ª TEMPORADA · PERFIL VIVO · 2026».
// Bandas diagonales con gradientes espectrales que se deslizan con el scroll (bus único), tipografía condensada
// gigante repetida, un orbe radial con destello en el centro y, abajo, los 7 objetivos medibles como «categorías».
console.log('[fp/mood-spectral] init');

const BANDS = [
  { txt: '01ª TEMPORADA', g: 'a' },
  { txt: 'PERFIL VIVO', g: 'b' },
  { txt: '2026 · 2026', g: 'c' },
  { txt: 'ENTRENANDO DURO', g: 'd' },
  { txt: 'DURMIENDO DURO', g: 'e' },
];

export default {
  id: 'mood-spectral',
  n: 'M10',
  title: 'Temporada',
  pol: 'mood',
  app: 'progreso',
  bridge: 'Siete categorías. Ninguna se gana en un mes: se gana registrando.',

  render(ctx) {
    const objs = ctx.data.profile.objectives || [];
    const bands = BANDS.map((b, i) => `<div class="fp-mb-spec__band fp-mb-spec__band--${b.g}" data-dir="${i % 2 ? 1 : -1}"><span>${b.txt}</span><span>${b.txt}</span><span>${b.txt}</span></div>`).join('');
    const cats = objs.map((o, i) => `
      <li class="fp-mb-spec__cat" data-fp-fade>
        <span class="fp-mb-spec__num fp-data">${String(i + 1).padStart(2, '0')}</span>
        <span class="fp-mb-spec__k">Categoría</span>
        <p>${ctx.ui.esc(o.text)} ${ctx.ui.tag(o.tag)}</p>
      </li>`).join('');
    return `
      <div class="fp-mb-spec">
        <div class="fp-mb-spec__stage" aria-hidden="true">
          <div class="fp-mb-spec__bands">${bands}</div>
          <div class="fp-mb-spec__orb"><svg viewBox="0 0 100 100"><path d="M50 8 L54 46 L92 50 L54 54 L50 92 L46 54 L8 50 L46 46 Z" fill="#fff"/></svg></div>
        </div>
        <div class="fp-mb-spec__meta fp-wrap fp-wrap--wide">
          <span class="fp-data">FRANCO · PRESENTA</span>
          <span class="fp-data">ANUAL / 01</span>
          <span class="fp-data">CÓRDOBA · AR</span>
        </div>
        <div class="fp-wrap fp-wrap--wide fp-mb-spec__body">
          <header class="fp-head">
            <span class="fp-eyebrow"><b>M10</b> Temporada de hitos</span>
            <h2 data-fp-fade>Primera <em>temporada</em>, siete categorías.</h2>
            <p class="fp-lede" data-fp-fade>Los objetivos medibles del método, presentados como una entrega de premios: cada uno se mide en Motion Lab, en el check-in o con la cinta métrica. Son sugerencias ${ctx.ui.tag('C')} para 12 semanas, no promesas.</p>
          </header>
          <ol class="fp-mb-spec__cats">${cats}</ol>
        </div>
      </div>`;
  },

  init(el, ctx) {
    const bands = [...el.querySelectorAll('.fp-mb-spec__band')];
    const orb = el.querySelector('.fp-mb-spec__orb');
    const stage = el.querySelector('.fp-mb-spec__stage');
    if (ctx.env.prefersReducedMotion()) return;
    let visible = false;
    ctx.env.onVisible(el, (v) => { visible = v; el.classList.toggle('is-live', v); });
    ctx.scroll.onScrollFrame(() => {
      if (!visible) return;
      const p = ctx.scroll.getSectionProgress(stage);
      bands.forEach((b, i) => {
        const dir = +b.dataset.dir;
        b.style.translate = `${(dir * (p - 0.5) * (38 + i * 6)).toFixed(2)}% 0`;
      });
      orb.style.transform = `translate(-50%, -50%) rotate(${(p * 180).toFixed(1)}deg) scale(${(0.86 + Math.sin(p * Math.PI) * 0.3).toFixed(3)})`;
    });
  },
};
