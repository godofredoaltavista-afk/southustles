// FP · CH20 · POSTURA Y CUIDADO — silueta SVG con hotspots (data/profile-public.json → posture, x/y en %).
// Cada punto abre su nota. Reglas de dolor con semáforo + ícono + texto (no solo color).
// No diagnostica: lo declarado es [U]; la evaluación es de un kinesiólogo/fisiatra una vez [C]. 01 §3, §12.5.
console.log('[fp/ch20-postura] init');

const DETAIL = {
  hombro: 'Lo estás acomodando frente al espejo: tracción, dorsal y tríceps. Que lo mire un kinesiólogo una vez para saber qué compensación corregir.',
  escapula: 'Bajá la escápula antes de tirar o empujar (depresión escapular). Face pulls y pull-aparts suman.',
  cuello: 'Guardia arriba con escápulas trabadas, no con el cuello. Tríceps y caja torácica en su lugar para relajar la nuca.',
  pulgar: 'Evitá agarres que lo carguen: pulgar adentro en la barra o handles que lo fuercen. Marcá la zona en el check-in si molesta.',
  tobillo: 'Vendas de tobillo para la bolsa y las patadas. No sustituyen la técnica.',
  rodilla: 'Rodillera solo en bolsa y patadas, no en todo el entreno.',
  muneca: 'Muñequera y vendas de mano para golpear. Puño libre al final para endurecer, sin dolor articular.',
};

const RULES = [
  { lvl: 'bad', ico: 'alert', t: 'Agudo, punzante, articular, con hormigueo o adormecimiento', d: 'Pará el ejercicio y marcá la zona. No se «pasa».' },
  { lvl: 'warn', ico: 'info', t: 'Molestia que se repite varios días', d: 'Bajá la carga y consultá. La app avisa, no da tratamiento.' },
  { lvl: 'ok', ico: 'check', t: 'Agujetas (DOMS) 24–72 h', d: 'Permitidas. No son objetivo y no miden el progreso.' },
];

function silhouette() {
  return `<svg viewBox="0 0 200 400" class="fp-post__svg" aria-hidden="true">
    <g class="fp-post__body">
      <circle cx="100" cy="42" r="24"/>
      <path d="M92 64 h16 l2 14 h-20z"/>
      <path d="M58 86 Q100 70 142 86 L150 100 Q156 150 146 196 L140 214 Q100 226 60 214 L54 196 Q44 150 50 100 Z"/>
      <path d="M58 88 Q40 96 36 130 L30 196 Q28 206 36 208 L42 206 L50 136 Z"/>
      <path d="M142 86 Q160 94 164 128 L170 196 Q172 206 164 208 L158 206 L150 136 Z"/>
      <path d="M62 214 Q100 226 138 214 L136 300 L124 392 L106 392 L102 270 L98 270 L94 392 L76 392 L64 300 Z"/>
      <circle cx="35" cy="214" r="8"/><circle cx="165" cy="214" r="8"/>
    </g>
    <g class="fp-post__lines">
      <line x1="100" y1="10" x2="100" y2="395"/>
      <line x1="40" y1="86" x2="160" y2="80" class="is-tilt"/>
    </g>
  </svg>`;
}

export default {
  id: 'postura',
  n: '20',
  title: 'Postura y cuidado',
  pol: 'invert',
  bg: 'dots',
  app: 'checkin',
  bridge: 'Cuidar no es frenar: es poder entrenar mañana también.',

  render(ctx) {
    const { tag, esc, icon } = ctx.ui;
    const pts = ctx.data.profile.posture;
    return `
<div class="fp-wrap">
  <header class="fp-head" data-fp-fade>
    <span class="fp-eyebrow"><b>20</b> Postura y cuidado</span>
    <h2>Recalibrar <em>la</em> espalda.</h2>
    <p class="fp-lede">Lo que contás de tu cuerpo ${tag('U')}, puesto en un mapa. Nada de esto es un diagnóstico: un kinesiólogo o fisiatra lo evalúa una vez ${tag('C')} y la app solo te ayuda a registrarlo.</p>
  </header>

  <div class="fp-post">
    <figure class="fp-post__fig" data-fp-fade="left">
      ${silhouette()}
      ${pts.map((p, i) => `<button type="button" class="fp-post__hot" style="left:${p.x}%;top:${p.y}%;--i:${i}" data-hot="${esc(p.id)}" aria-label="${esc(p.label)}" aria-pressed="${i === 0}"><span>${i + 1}</span></button>`).join('')}
    </figure>

    <div class="fp-post__side">
      <div class="fp-card fp-card--glass fp-post__detail" aria-live="polite" data-fp-fade>
        <span class="fp-card__k" data-post-k>01 · ${tag('U')}</span>
        <h3 data-post-t>${esc(pts[0].label)}</h3>
        <p data-post-d>${esc(DETAIL[pts[0].id] || '')}</p>
      </div>
      <ol class="fp-post__list">
        ${pts.map((p, i) => `<li><button type="button" data-hot="${esc(p.id)}"><b class="fp-data">${String(i + 1).padStart(2, '0')}</b> ${esc(p.label)}</button></li>`).join('')}
      </ol>
    </div>
  </div>

  <div class="fp-post__rules">
    ${RULES.map((r) => `<article class="fp-post__rule fp-post__rule--${r.lvl}" data-fp-fade>
      <span class="fp-post__rule-ico">${icon(r.ico, 18)}</span><div><h4>${esc(r.t)}</h4><p>${esc(r.d)}</p></div></article>`).join('')}
  </div>
</div>`;
  },

  init(el, ctx) {
    const pts = ctx.data.profile.posture;
    const k = el.querySelector('[data-post-k]');
    const t = el.querySelector('[data-post-t]');
    const d = el.querySelector('[data-post-d]');
    const hots = [...el.querySelectorAll('.fp-post__hot')];
    const listBtns = [...el.querySelectorAll('.fp-post__list button')];
    const pick = (id) => {
      const i = pts.findIndex((p) => p.id === id);
      if (i < 0) return;
      const p = pts[i];
      k.innerHTML = `${String(i + 1).padStart(2, '0')} · ${ctx.ui.tag(p.tag || 'U')}`;
      t.textContent = p.label;
      d.textContent = DETAIL[p.id] || '';
      hots.forEach((h) => h.setAttribute('aria-pressed', String(h.dataset.hot === id)));
      listBtns.forEach((b) => b.classList.toggle('is-on', b.dataset.hot === id));
    };
    [...hots, ...listBtns].forEach((b) => {
      b.addEventListener('click', () => pick(b.dataset.hot));
      b.addEventListener('pointerenter', () => { if (ctx.env.fxEnabled()) pick(b.dataset.hot); });
    });
    pick(pts[0].id);
  },
};
