// FP · VISTA BIBLIOTECA — banco de ejercicios filtrable, glosario en flashcards que giran,
// premisas con respaldo (Sólida/Parcial/Revisar) y «de dónde sale», y el índice de fuentes S0–S6.
// Todo sale de data/*.json (público). Resúmenes propios, nunca párrafos de los mentores.
console.log('[fp/view-biblioteca] init');

const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const GEAR_NAMES = { barra: 'Barra', handles: 'Handles', bandas: 'Bandas', mancuernas: 'Mancuernas', garrafa: 'Garrafa', soga: 'Soga', bolsa: 'Bolsa', vendas: 'Vendas', guantes: 'Guantes', colchoneta: 'Colchoneta', piso: 'Piso', banco: 'Banco', mochila: 'Mochila', escalón: 'Escalón', pared: 'Pared', costa: 'La costa' };
const FAMILY = { reps: 'Reps', hold: 'Sostener', time: 'Tiempo', mobility: 'Movilidad', cardio: 'Cardio' };

export default {
  id: 'biblioteca',
  title: 'Biblioteca',
  icon: 'biblioteca',
  theme: 'light',
  hint: 'Ejercicios, glosario, premisas, fuentes',

  windows(ctx) {
    const { esc, icon } = ctx.ui;
    const D = ctx.data;

    return [
      /* ── BANCO DE EJERCICIOS ──────────────── */
      {
        id: 'ejercicios', title: 'Banco de ejercicios', icon: 'dumbbell', glass: 1,
        def: { x: 0.02, y: 0.03, w: 0.56, h: 0.94 },
        mount(body) {
          body.classList.add('fp-vb');
          const gears = [...new Set(D.exercises.flatMap((e) => e.gear || []))].sort();
          body.innerHTML = `
            <div class="fp-vb-filters">
              <label class="fp-field fp-vb-grow"><span class="fp-sr">Buscar</span><input class="fp-input" type="search" placeholder="Buscar: dominada, banda, glúteo…" data-q /></label>
              <label class="fp-field"><span class="fp-sr">Músculo</span><select class="fp-select" data-m><option value="">Todos los músculos</option>${D.muscles.map((m) => `<option value="${m.id}">${esc(m.name)}</option>`).join('')}</select></label>
              <label class="fp-field"><span class="fp-sr">Equipo</span><select class="fp-select" data-g><option value="">Todo el equipo</option>${gears.map((g) => `<option value="${esc(g)}">${esc(GEAR_NAMES[g] || g)}</option>`).join('')}</select></label>
            </div>
            <p class="fp-small" data-count></p>
            <div class="fp-vb-exlist" data-list></div>`;
          const q = body.querySelector('[data-q]'), sm = body.querySelector('[data-m]'), sg = body.querySelector('[data-g]');
          const list = body.querySelector('[data-list]'), count = body.querySelector('[data-count]');
          const paint = () => {
            const t = norm(q.value), m = sm.value, g = sg.value;
            const res = D.exercises.filter((e) => (!m || (e.muscles || []).includes(m) || (e.secondary || []).includes(m)) && (!g || (e.gear || []).includes(g))
              && (!t || norm(`${e.name} ${(e.cues || []).join(' ')} ${(e.muscles || []).map((x) => D.muscleById[x]?.name).join(' ')} ${(e.gear || []).join(' ')}`).includes(t)));
            count.textContent = `${res.length} de ${D.exercises.length} ejercicios`;
            list.innerHTML = res.length ? res.map((e) => {
              const unit = e.unit ? ` ${e.unit}` : ' reps';
              return `<details class="fp-vb-ex">
                <summary>
                  <span class="fp-vb-ex__n"><b>${esc(e.name)}</b><span class="fp-small">${(e.muscles || []).map((x) => esc(D.muscleById[x]?.name || x)).join(' · ') || esc(FAMILY[e.family] || e.family)}${(e.secondary || []).length ? ` <span class="fp-muted">+ ${(e.secondary || []).map((x) => esc(D.muscleById[x]?.name || x)).join(', ')}</span>` : ''}</span></span>
                  <span class="fp-vb-ex__k fp-data">${e.repRange ? `${e.repRange[0]}${e.repRange[1] !== e.repRange[0] ? `–${e.repRange[1]}` : ''}${unit}` : ''}</span>
                  <span class="fp-chip">${esc(e.tempo || '-')}</span>
                </summary>
                <div class="fp-vb-ex__body">
                  <div class="fp-vb-kv"><span>Equipo</span><b>${(e.gear || []).map((x) => esc(GEAR_NAMES[x] || x)).join(', ') || '—'}</b></div>
                  <div class="fp-vb-kv"><span>RIR</span><b class="fp-data">${e.rir ? `${e.rir[0]}–${e.rir[1]}` : '—'}</b></div>
                  <div class="fp-vb-kv"><span>Tipo</span><b>${esc(FAMILY[e.family] || e.family)}</b></div>
                  ${e.motionLabId ? `<div class="fp-vb-kv"><span>Motion Lab</span><b class="fp-data">${esc(e.motionLabId)}</b></div>` : ''}
                  ${(e.cues || []).length ? `<p class="fp-label">Cues</p><ul class="fp-list">${e.cues.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>` : ''}
                  ${(e.progressions || []).length ? `<p class="fp-label">Progresiones (sin sumar peso)</p><div class="fp-vb-chips">${e.progressions.map((p) => `<span class="fp-chip">${esc(p)}</span>`).join('')}</div>` : ''}
                </div>
              </details>`;
            }).join('') : '<div class="fp-empty"><b>Nada con ese filtro.</b>Probá con otro músculo o equipo.</div>';
          };
          q.addEventListener('input', paint); sm.addEventListener('change', paint); sg.addEventListener('change', paint);
          paint();
        },
      },

      /* ── GLOSARIO (flashcards) ────────────── */
      {
        id: 'glosario', title: 'Glosario', icon: 'sparkle', glass: 1,
        def: { x: 0.6, y: 0.03, w: 0.38, h: 0.32 },
        mount(body) {
          body.classList.add('fp-vb');
          body.innerHTML = `
            <label class="fp-field"><span class="fp-sr">Filtrar glosario</span><input class="fp-input" type="search" placeholder="Filtrar: RIR, tempo, zona 2…" data-q /></label>
            <div class="fp-vb-cards" data-cards></div>`;
          const q = body.querySelector('[data-q]'), wrap = body.querySelector('[data-cards]');
          const paint = () => {
            const t = norm(q.value);
            const res = D.glossary.filter((g) => !t || norm(`${g.term} ${g.def}`).includes(t));
            wrap.innerHTML = res.map((g, i) => `
              <button type="button" class="fp-vb-flip" aria-pressed="false" data-i="${i}" aria-label="${esc(g.term)}: tocá para ver la definición">
                <span class="fp-vb-flip__in">
                  <span class="fp-vb-flip__f"><b>${esc(g.term)}</b>${ctx.ui.tag(g.tag)}</span>
                  <span class="fp-vb-flip__b">${esc(g.def)}</span>
                </span>
              </button>`).join('') || '<p class="fp-small">Nada con ese filtro.</p>';
            wrap.querySelectorAll('.fp-vb-flip').forEach((b) => b.addEventListener('click', () => {
              const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on)); b.classList.toggle('is-flipped', on);
            }));
          };
          q.addEventListener('input', paint);
          paint();
        },
      },

      /* ── PREMISAS ─────────────────────────── */
      {
        id: 'premisas', title: 'Premisas y respaldo', icon: 'target', glass: 1,
        def: { x: 0.6, y: 0.38, w: 0.38, h: 0.36 },
        mount(body) {
          body.classList.add('fp-vb');
          let sup = '', grp = '';
          body.innerHTML = `
            <div class="fp-row fp-vb-wrap">
              <div class="fp-seg" data-sup><button type="button" data-v="">Todas</button><button type="button" data-v="Solida">Sólida</button><button type="button" data-v="Parcial">Parcial</button><button type="button" data-v="Revisar">Revisar</button></div>
              <div class="fp-seg" data-grp><button type="button" data-v="">Todos</button><button type="button" data-v="Franco">Franco</button><button type="button" data-v="Mentores">Mentores</button></div>
            </div>
            <div class="fp-vb-prem" data-list></div>`;
          const list = body.querySelector('[data-list]');
          const paint = () => {
            const res = D.premises.filter((p) => (!sup || p.support === sup) && (!grp || p.group === grp));
            list.innerHTML = res.map((p) => `
              <details class="fp-vb-premise fp-vb-premise--${p.support}">
                <summary><span class="fp-vb-premise__c">${esc(p.claim)}</span><span class="fp-row">${ctx.ui.tag(p.tag)}${ctx.ui.support(p.support)}</span></summary>
                <div class="fp-vb-premise__b">
                  <p>${esc(p.note)}</p>
                  <p class="fp-label">De dónde sale</p>
                  <ul class="fp-list fp-small">${(p.sources || []).map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
                  ${p.support === 'Revisar' ? '<p class="fp-small fp-vb-ask">¿Lo confirmamos? Queda marcado para revisar.</p>' : ''}
                </div>
              </details>`).join('') || '<p class="fp-small">Nada con ese filtro.</p>';
          };
          ctx.ui.segmented(body.querySelector('[data-sup]'), sup, (v) => { sup = v; paint(); });
          ctx.ui.segmented(body.querySelector('[data-grp]'), grp, (v) => { grp = v; paint(); });
          paint();
        },
      },

      /* ── FUENTES ──────────────────────────── */
      {
        id: 'fuentes', title: 'Fuentes', icon: 'file', glass: 1,
        def: { x: 0.6, y: 0.77, w: 0.38, h: 0.2 },
        mount(body) {
          body.classList.add('fp-vb');
          body.innerHTML = `
            <p class="fp-small">Jerarquía: estudio (solo seguridad) → lo que dice Franco → mentores → sugerencias. Etiquetas ${ctx.ui.tag('U')} dicho por Franco · ${ctx.ui.tag('C')} sugerido · ${ctx.ui.tag('?')} a confirmar.</p>
            <div class="fp-stack">${D.sources.map((s) => `
              <details class="fp-vb-src">
                <summary><b class="fp-data">${esc(s.id)}</b><span>${esc(s.title)}</span><span class="fp-chip">${esc(s.privacy)}</span></summary>
                <p class="fp-small">${esc(s.topic)}</p>
                ${(s.files || []).length ? `<ul class="fp-list fp-small">${s.files.map((f) => `<li class="fp-data">${esc(f)}</li>`).join('')}</ul>` : '<p class="fp-small">No se muestra en la app.</p>'}
              </details>`).join('')}</div>`;
        },
      },
    ];
  },
};
