// FP · CHAPTERS — registro del scroll infinito. Orden canónico de capítulos (03 §7) + verticales del moodboard.
// Cada archivo js/sections/<id>.js exporta default { id, n, title, pol, bg, app, bridge, gl, render(ctx), init(el, ctx) }.
// Se importan con import() dinámico: si un módulo falta o falla, ese capítulo se saltea y el resto sigue (additive).
// El HTML de todos se pinta al arrancar (largo de página estable); init() corre cuando el capítulo se acerca al viewport.
import { esc } from '../core/fp-env.js';

console.log('[fp/chapters] init');

export const ORDER = [
  'ch01-hero', 'mood-poster', 'ch02-quien', 'ch03-meta', 'mood-cine', 'ch04-partida', 'ch05-odisea', 'pause:0',
  'mood-glifos', 'ch06-tres-fases', 'ch07-tempo', 'mood-venn', 'ch08-tension', 'ch09-sobrecarga', 'ch10-progresion',
  'mood-halftone', 'ch11-volumen', 'ch12-semana', 'pause:1', 'mood-works', 'ch13-sesion', 'ch14-bolsa', 'mood-daydance',
  'mood-lauren', 'ch15-cardio', 'mood-globe', 'ch16-piernas', 'ch17-comida', 'mood-spectral', 'ch18-agua', 'ch19-sueno',
  'mood-cielo', 'pause:2', 'mood-neon', 'ch20-postura', 'ch21-equipo', 'mood-cases', 'ch22-checkins', 'ch23-foto',
  'mood-dither', 'ch24-progreso', 'ch25-motionlab', 'mood-editorial', 'ch26-premisas', 'ch27-vault', 'pause:3', 'ch28-footer',
];

const PAUSES = [
  'Una serie bien hecha vale más que tres apuradas.',
  'El músculo se construye recuperando, no rompiendo.',
  'Tres fases, un solo tempo.',
  'No sé, y está bien: lo marqué para revisar.',
];

function pauseModule(i) {
  return {
    id: `pausa-${i + 1}`, n: '··', title: 'Pausa', pol: i % 2 ? 'invert' : 'theme', bg: 'dots', pause: true,
    render: () => `<div class="fp-pause"><blockquote data-fp-fade="scale">${esc(PAUSES[i])}</blockquote></div>`,
  };
}

/** Importa todos los módulos en paralelo; devuelve los que cargaron, en orden. */
export async function loadChapters() {
  const mods = await Promise.all(ORDER.map(async (key) => {
    if (key.startsWith('pause:')) return pauseModule(+key.split(':')[1]);
    try {
      const m = await import(`./${key}.js`);
      const def = m.default;
      if (!def || typeof def.render !== 'function') throw new Error('sin default.render');
      return { ...def, _file: key };
    } catch (e) {
      console.warn(`[fp/chapters] ${key} no cargó (se saltea):`, e.message);
      return null;
    }
  }));
  return mods.filter(Boolean);
}

/** Pinta los capítulos en #fp-scroll y agenda sus init() por cercanía. */
export async function mountChapters(root, ctx) {
  const mods = await loadChapters();
  const frag = document.createDocumentFragment();
  const entries = [];
  for (const m of mods) {
    const el = document.createElement('section');
    const isMood = m.pol === 'mood';
    el.className = [
      'fp-section', 'fp-ch', `fp-ch--${m.id}`,
      isMood ? 'fp-mood' : '', m.pol === 'invert' ? 'fp-pol-invert' : '',
      m.bg ? `fp-bg-${m.bg}` : '', m.pause ? 'fp-section--short' : '',
    ].filter(Boolean).join(' ');
    el.id = `ch-${m.id}`;
    el.dataset.fpSection = m.id;
    el.dataset.fpCh = m.n || '';
    el.dataset.fpTitle = m.title || m.id;
    el.dataset.fpPol = m.pol || 'theme';
    if (m.gl) el.dataset.fpGl = m.gl;
    if (m.grad) el.dataset.grad = m.grad;
    el.setAttribute('aria-label', m.title || m.id);
    let html = '';
    try { html = m.render(ctx) || ''; } catch (e) { console.warn(`[fp/chapters] render ${m.id}`, e); html = `<div class="fp-wrap"><p class="fp-muted">Este capítulo no se pudo pintar.</p></div>`; }
    if (m.bridge || m.app) {
      html += `<div class="fp-bridge">${m.bridge ? `<p>${esc(m.bridge)}</p>` : '<span></span>'}${m.app ? `<a class="fp-btn fp-btn--sm" data-fp-dirfill href="#/${m.app}">Ver en la app →</a>` : ''}</div>`;
    }
    el.innerHTML = html;
    frag.append(el);
    entries.push({ m, el });
  }
  root.append(frag);

  // init() por cercanía (50% de viewport de margen), una sola vez
  const io = new IntersectionObserver((list) => {
    list.forEach((en) => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      const it = entries.find((x) => x.el === en.target);
      if (!it || it.done) return;
      it.done = true;
      try { Promise.resolve(it.m.init?.(it.el, ctx)).catch((e) => console.warn(`[fp/chapters] init ${it.m.id}`, e)); } catch (e) { console.warn(`[fp/chapters] init ${it.m.id}`, e); }
      ctx.ui.reveal(it.el); ctx.ui.counters(it.el); ctx.ui.enhance(it.el);
    });
  }, { rootMargin: '60% 0px 60% 0px' });
  entries.forEach((x) => io.observe(x.el));
  return entries.map((x) => ({ id: x.m.id, n: x.m.n, title: x.m.title, pol: x.m.pol, el: x.el, mood: x.m.pol === 'mood', pause: !!x.m.pause }));
}
