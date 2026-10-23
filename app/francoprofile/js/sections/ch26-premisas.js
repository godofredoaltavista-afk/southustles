// FP · CH26 · PREMISAS Y FUENTES — flashcards 3D (glosario de South Hustles: .glosario-card rotateY 180° al
// hover/click, widgets.css) sobre data/premises.json, con filtro de texto en vivo y chips por respaldo/grupo.
// Cada tarjeta: afirmación · etiqueta [U]/[C]/[?] · respaldo · «de dónde sale» al dar vuelta. 03 §12.3.
console.log('[fp/ch26-premisas] init');

const FILTERS = [
  { k: 'all', t: 'Todas' },
  { k: 'Solida', t: 'Sólidas' },
  { k: 'Parcial', t: 'Parciales' },
  { k: 'Revisar', t: 'A revisar' },
  { k: 'Franco', t: 'De Franco' },
  { k: 'Mentores', t: 'De mentores' },
];

const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export default {
  id: 'premisas',
  n: '26',
  title: 'Premisas y fuentes',
  pol: 'theme',
  bg: 'beam',
  app: 'biblioteca',
  bridge: 'No sé, y está bien: lo marqué para revisar.',

  render(ctx) {
    const { tag, support, esc, icon } = ctx.ui;
    const ps = ctx.data.premises;
    const count = (s) => ps.filter((p) => p.support === s).length;
    return `
<span class="fp-bg-word fp-bg-word--l" aria-hidden="true">premisas</span>
<div class="fp-wrap fp-wrap--wide">
  <header class="fp-head" data-fp-fade>
    <span class="fp-eyebrow"><b>26</b> Premisas y fuentes</span>
    <h2>Lo que <em>creo,</em> calibrado.</h2>
    <p class="fp-lede">Todo lo que aprendiste, con su respaldo: <b class="fp-data">${count('Solida')}</b> sólidas, <b class="fp-data">${count('Parcial')}</b> parciales, <b class="fp-data">${count('Revisar')}</b> para revisar. Dalas vuelta para ver de dónde sale cada una.</p>
  </header>

  <div class="fp-prem__tools" data-fp-fade>
    <label class="fp-prem__search">${icon('eye', 16)}<input class="fp-input" type="search" placeholder="Filtrar: tempo, creatina, dolor, zona 2…" aria-label="Filtrar premisas" data-prem-q></label>
    <div class="fp-prem__chips" role="group" aria-label="Filtrar por respaldo">
      ${FILTERS.map((f, i) => `<button type="button" class="fp-chip fp-prem__chip" data-prem-f="${f.k}" aria-pressed="${i === 0}">${esc(f.t)}</button>`).join('')}
    </div>
    <span class="fp-small fp-data" data-prem-n>${ps.length} / ${ps.length}</span>
  </div>

  <div class="fp-prem__grid" data-prem-grid>
    ${ps.map((p, i) => `
    <div class="fp-prem__card" data-id="${esc(p.id)}" data-s="${esc(p.support)}" data-g="${esc(p.group)}" data-q="${esc(norm(`${p.claim} ${p.note} ${p.sources.join(' ')}`))}" style="--i:${i}">
      <button type="button" class="fp-prem__inner" aria-pressed="false" aria-label="${esc(p.claim)} — dar vuelta">
        <span class="fp-prem__face fp-prem__face--front">
          <span class="fp-prem__meta"><span class="fp-data">${String(i + 1).padStart(2, '0')}</span>${tag(p.tag)}${support(p.support)}</span>
          <span class="fp-prem__claim">${esc(p.claim)}</span>
          <span class="fp-prem__hint">${esc(p.group)} · tocá para ver de dónde sale ↻</span>
        </span>
        <span class="fp-prem__face fp-prem__face--back">
          <span class="fp-prem__note">${esc(p.note)}</span>
          <span class="fp-prem__src">${icon('file', 12)} ${p.sources.map((s) => esc(s)).join(' · ')}</span>
          ${p.support === 'Revisar' ? '<span class="fp-prem__ask">¿Lo confirmamos?</span>' : ''}
        </span>
      </button>
    </div>`).join('')}
  </div>
  <p class="fp-empty fp-prem__none" hidden data-prem-none><b>Nada coincide.</b>Probá con otra palabra.</p>

  <details class="fp-prem__sources" data-fp-fade>
    <summary>${icon('biblioteca', 16)} Índice de fuentes (S0–S6)</summary>
    <ul>${ctx.data.sources.map((s) => `<li><b class="fp-data">${esc(s.id)}</b> <span>${esc(s.title)}</span> <em>${esc(s.topic)}</em> <span class="fp-chip">${esc(s.privacy)}</span>${s.files.length ? `<small>${s.files.length} archivo${s.files.length === 1 ? '' : 's'}</small>` : ''}</li>`).join('')}</ul>
    <p class="fp-small">Los mentores se resumen con palabras propias; nunca se copian párrafos. El estudio de salud no se muestra ni se interpreta.</p>
  </details>
</div>`;
  },

  init(el, ctx) {
    const cards = [...el.querySelectorAll('.fp-prem__card')];
    const q = el.querySelector('[data-prem-q]');
    const chips = [...el.querySelectorAll('[data-prem-f]')];
    const n = el.querySelector('[data-prem-n]');
    const none = el.querySelector('[data-prem-none]');
    let f = 'all';

    const apply = () => {
      const s = norm(q.value.trim());
      let shown = 0;
      cards.forEach((c) => {
        const okF = f === 'all' || c.dataset.s === f || c.dataset.g === f;
        const okQ = !s || c.dataset.q.includes(s);
        const on = okF && okQ;
        c.classList.toggle('is-hidden', !on);
        if (on) shown++;
      });
      n.textContent = `${shown} / ${cards.length}`;
      none.hidden = shown > 0;
    };
    q.addEventListener('input', apply);
    chips.forEach((b) => b.addEventListener('click', () => {
      f = b.dataset.premF;
      chips.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      apply();
    }));
    cards.forEach((c) => {
      const btn = c.querySelector('.fp-prem__inner');
      btn.addEventListener('click', () => {
        const on = !c.classList.contains('is-flipped');
        c.classList.toggle('is-flipped', on);
        btn.setAttribute('aria-pressed', String(on));
      });
    });

    // entrada escalonada de la grilla
    const grid = el.querySelector('[data-prem-grid]');
    ctx.env.onVisible(grid, (v) => { if (v) grid.classList.add('is-on'); }, { threshold: 0.05 });
    if (ctx.env.prefersReducedMotion()) grid.classList.add('is-on');
  },
};
