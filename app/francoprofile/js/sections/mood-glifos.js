// FP · MOOD M3 — glifos crema sobre negro tipo petroglifo (moodboard: figuritas bailando + píldora «DANCE?»).
// Cada tile es un movimiento REAL de Franco (01 §6, §9) dibujado a mano en SVG con trazo grueso
// y un filtro de rugosidad para que parezca tallado. Al pasar el mouse (o con foco/tap) bailan.
console.log('[fp/mood-glifos] init');

// viewBox 0 0 100 100 · trazo grueso redondeado · cabezas rellenas
const G = {
  dominada: '<path class="t" d="M8 12H92"/><path d="M38 13L46 44M62 13L54 44M50 42V64M50 64L42 76L48 90M50 64L58 76L52 90"/><circle class="f" cx="50" cy="32" r="7.5"/>',
  flexion: '<path d="M24 50L66 58L88 72M32 53L32 75"/><path class="t" d="M25 78H40M78 80H94"/><circle class="f" cx="16" cy="46" r="7"/>',
  pistol: '<path d="M38 30L46 54M41 36L78 37M46 54L34 70L44 87M46 54L90 61"/><circle class="f" cx="36" cy="21" r="7"/>',
  guardia: '<path d="M50 31V62M50 39L36 47L40 33M50 39L64 47L60 33M50 62L37 89M50 62L64 89"/><circle class="f" cx="50" cy="21" r="8"/><circle class="f" cx="40" cy="29" r="5"/><circle class="f" cx="60" cy="29" r="5"/>',
  patada: '<path d="M36 30L44 56M38 36L28 41L31 28M38 36L53 38M44 56L40 89M44 56L70 63L93 69"/><circle class="f" cx="34" cy="21" r="7"/><path class="t" d="M95 58l4-4M96 70h5M95 80l4 4"/>',
  grulla: '<path d="M50 26V56M50 34L22 23M50 34L78 23M50 56V91M50 56L68 58L63 75"/><circle class="f" cx="50" cy="17" r="7"/>',
  soga: '<path d="M50 34V58M50 40L36 52M50 40L64 52M50 58L43 71L48 80M50 58L57 71L52 80"/><path class="t" d="M36 52C14 -6 86 -6 64 52"/><path class="t" d="M28 93H44M56 93H72"/><circle class="f" cx="50" cy="26" r="7"/>',
  plancha: '<path d="M28 58L88 84M30 60V85M32 58L37 22"/><path class="t" d="M12 89H94"/><circle class="f" cx="20" cy="51" r="7"/>',
  pareja: '<circle class="r" cx="28" cy="17" r="9"/><circle class="r" cx="72" cy="17" r="9"/><ellipse class="r" cx="28" cy="50" rx="12" ry="16"/><ellipse class="r" cx="72" cy="50" rx="12" ry="16"/><path class="t" d="M22 47c4-6 8 4 12-2M66 52c4 3 8-3 12 0"/><path d="M17 42L7 30L13 20M40 42L50 33L60 42M83 42L92 57M23 66L21 90M34 66L36 90M66 66L64 90M77 66L79 90"/>',
  press: '<path class="t" d="M30 13H70M30 7V19M70 7V19"/><path d="M50 49L39 15M50 49L61 15M50 47V71M50 71L42 92M50 71L58 92"/><circle class="f" cx="50" cy="39" r="7"/>',
  bolsa: '<rect class="r" x="70" y="22" width="18" height="58" rx="9"/><path class="t" d="M79 6V22M60 33l-5-5M60 55l-5 5"/><path d="M32 38L38 64M34 44L64 44M34 44L25 50L28 37M38 64L27 89M38 64L51 89"/><circle class="f" cx="30" cy="29" r="7"/><circle class="f" cx="66" cy="44" r="5"/>',
  puente: '<path d="M20 79L52 56L72 60L77 84M20 79L42 86"/><path class="t" d="M6 89H96"/><circle class="f" cx="13" cy="74" r="6.5"/>',
};

const TILES = [
  { k: 'dominada', cap: 'Dominada', meta: '4–8 · escápula abajo', span: 'w2 h2', tag: 'U' },
  { k: 'flexion', cap: 'Flexión con handles', meta: '4 × 10–15', span: 'w2', tag: 'U' },
  { k: 'guardia', cap: 'Guardia', meta: 'escápulas trabadas', span: '', tag: 'U' },
  { k: 'pistol', cap: 'Sentadilla a una pierna', meta: 'core al tobillo', span: 'h2', tag: 'U' },
  { k: 'pareja', cap: 'Tensión / recuperación', meta: 'las dos mitades', span: 'w2 h2', tag: 'C' },
  { k: 'patada', cap: 'Patada baja', meta: 'bolsa · sábado', span: '', tag: 'U' },
  { k: 'grulla', cap: 'Equilibrio a una pierna', meta: 'fuerte declarado', span: '', tag: 'U' },
  { k: 'soga', cap: 'Soga', meta: 'subidón 8–10′', span: '', tag: 'U' },
  { k: 'plancha', cap: 'Plancha lateral', meta: 'meta 45 s / lado', span: 'w2', tag: 'C' },
  { k: 'press', cap: 'Press de hombro', meta: '2 × 10 kg', span: '', tag: 'C' },
  { k: 'bolsa', cap: 'Bolsa 1,20 m', meta: '6–8 rounds × 2′', span: 'w2', tag: 'U' },
  { k: 'puente', cap: 'Puente de glúteo', meta: 'a una pierna', span: '', tag: 'C' },
];

export default {
  id: 'mood-glifos',
  n: 'M3',
  title: 'Glifos',
  pol: 'mood',
  render(ctx) {
    const tiles = TILES.map((t, i) => `
      <figure class="fp-mg__tile ${t.span.split(' ').filter(Boolean).map((s) => `fp-mg__tile--${s}`).join(' ')}" tabindex="0" style="--i:${i}" data-fp-fade="scale">
        <svg class="fp-mg__svg" viewBox="0 0 100 100" role="img" aria-label="${ctx.ui.esc(t.cap)}"><g filter="url(#fp-mg-rough)">${G[t.k]}</g></svg>
        <figcaption><b>${ctx.ui.esc(t.cap)}</b><span class="fp-data">${ctx.ui.esc(t.meta)} ${ctx.ui.tag(t.tag)}</span></figcaption>
      </figure>`).join('');
    return `
<div class="fp-mg">
  <svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <filter id="fp-mg-rough"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter>
  </svg>
  <header class="fp-mg__head">
    <p class="fp-data fp-mg__k">M3 · PETROGLIFOS DEL MOVIMIENTO</p>
    <h2 class="fp-mg__title" data-fp-fade>Glifos del <em>movimiento</em></h2>
    <p class="fp-mg__lede" data-fp-fade data-fp-delay="80">Lo que hago todos los días, tallado como en una piedra. Pasá el mouse o tocá una figura: baila.</p>
  </header>
  <div class="fp-mg__grid">${tiles}</div>
  <a class="fp-mg__pill" href="#/sesion" data-fp-magnetic>¿ENTRENÁS?</a>
</div>`;
  },
  init(el, ctx) {
    ctx.env.onVisible(el, (v) => el.classList.toggle('fp-is-live', v && !ctx.env.prefersReducedMotion()));
    // tap en touch = alterna el baile
    el.querySelectorAll('.fp-mg__tile').forEach((t) => {
      t.addEventListener('click', () => t.classList.toggle('is-dancing'));
      t.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t.classList.toggle('is-dancing'); } });
    });
  },
};
