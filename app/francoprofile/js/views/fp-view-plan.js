// FP · VISTA PLAN — la semana de Franco (01 §6) como dashboard: 7 tarjetas con inversión radial desde el cursor
// (eco-cards de South Hustles) que se tachan al entrenar, tabla del día, medidores de volumen por músculo
// (ScoreGauge de Apacheta: conic-gradient + banda 12–20), Opción A/B de cardio + registro de salida, reglas del plan
// con la variante de 6 días [?], y el banco de ejercicios filtrable (01 §9).
console.log('[fp/view-plan] init');

const DEF = {
  semana: { x: 0.01, y: 0.02, w: 0.6, h: 0.28 },
  dia: { x: 0.01, y: 0.32, w: 0.37, h: 0.66 },
  banco: { x: 0.39, y: 0.32, w: 0.22, h: 0.66 },
  volumen: { x: 0.625, y: 0.02, w: 0.365, h: 0.46 },
  cardio: { x: 0.625, y: 0.5, w: 0.365, h: 0.28 },
  reglas: { x: 0.625, y: 0.8, w: 0.365, h: 0.18 },
};
const ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const FOCUS_ICON = { empuje: 'handles', traccion: 'bar', piernas: 'run', descanso: 'zen', torso: 'dumbbell', boxeo: 'bag' };

const P = { sel: null, listeners: new Set() };
const emit = () => P.listeners.forEach((f) => f());

export default {
  id: 'plan', title: 'Plan', icon: 'plan', theme: 'light', hint: 'Semana, volumen y cardio',

  windows(ctx) {
    const { icon, esc, fmt } = ctx.ui;
    const M = ctx.M;
    const today = M.todayISO();
    const ws0 = M.weekStart(today);
    const dateOfKey = (k) => M.addDays(ws0, ORDER.indexOf(k));
    P.sel = P.sel || M.weekdayKey(today);

    return [
      /* ── Semana ── */
      {
        id: 'semana', title: 'Semana', icon: 'plan', def: DEF.semana, glass: 1, minW: 420, minH: 170,
        mount(body) {
          const paint = () => {
            const st = ctx.state;
            const by = new Map((st.days || []).map((d) => [d.date, d]));
            body.innerHTML = `<div class="fp-week">${ORDER.map((k) => {
              const iso = dateOfKey(k);
              const pd = M.planFor(iso, ctx.data, st.profile);
              const train = M.isTrainDay(iso, st.profile);
              const d = by.get(iso);
              const done = M.dayTrained(d);
              const isToday = iso === today;
              return `<button type="button" class="fp-eco ${P.sel === k ? 'on' : ''} ${isToday ? 'is-today' : ''} ${train ? '' : 'is-rest'} ${done ? 'is-done' : ''}" data-k="${k}" aria-pressed="${P.sel === k}">
                <span class="fp-eco__top"><b>${esc(pd.short)}</b><small class="fp-data">${M.fmtDate(iso)}</small></span>
                <span class="fp-eco__ico">${icon(FOCUS_ICON[pd.focus] || 'sparkle', 22)}</span>
                <span class="fp-eco__t">${esc(train ? pd.title : 'Descanso')}</span>
                <span class="fp-eco__s">${done ? '<i class="fp-ok-dot"></i>hecho' : train ? (iso < today ? 'pendiente' : isToday ? 'hoy toca' : '') : 'recuperar'}${d?.demo ? ' · ej.' : ''}${pd.variant ? ' · [?]' : ''}</span>
              </button>`;
            }).join('')}</div>`;
            body.querySelectorAll('.fp-eco').forEach((b) => {
              b.addEventListener('click', () => { P.sel = b.dataset.k; emit(); });
              // inversión radial desde el cursor (initEcoCards de South Hustles: --cx --cy --r)
              if (ctx.env.fxEnabled()) {
                b.addEventListener('pointerenter', (e) => { const r = b.getBoundingClientRect(); b.style.setProperty('--cx', `${e.clientX - r.left}px`); b.style.setProperty('--cy', `${e.clientY - r.top}px`); b.classList.add('is-hot'); });
                b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); b.style.setProperty('--cx', `${e.clientX - r.left}px`); b.style.setProperty('--cy', `${e.clientY - r.top}px`); });
                b.addEventListener('pointerleave', () => b.classList.remove('is-hot'));
              }
            });
          };
          paint();
          P.listeners.add(paint);
          ctx.onData(paint);
        },
      },
      /* ── Día seleccionado ── */
      {
        id: 'dia', title: 'Día', icon: 'dumbbell', def: DEF.dia, glass: 1, minW: 300, minH: 240,
        mount(body) {
          const paint = () => {
            const st = ctx.state;
            const iso = dateOfKey(P.sel);
            const pd = M.planFor(iso, ctx.data, st.profile);
            const train = M.isTrainDay(iso, st.profile);
            const d = (st.days || []).find((x) => x.date === iso);
            if (!train) {
              body.innerHTML = `<div class="fp-win-section"><p class="fp-eyebrow">${esc(pd.name)} · ${M.fmtDate(iso)}</p><h3 class="fp-win-title">Descanso</h3><p class="fp-lede-s">${esc(pd.rest || 'Comer fuerte, dormir, sol.')}</p><p class="fp-small">El músculo se construye recuperando, no rompiendo.</p></div>`;
              return;
            }
            body.innerHTML = `<div class="fp-win-section">
                <div class="fp-row fp-row--between"><div><p class="fp-eyebrow">${esc(pd.name)} · ${M.fmtDate(iso)}${pd.variant ? ' · variante [?]' : ''}</p><h3 class="fp-win-title">${esc(pd.title)}</h3></div>
                <div class="fp-row"><button type="button" class="fp-btn fp-btn--sm" data-done>${icon('check', 15)}${M.dayTrained(d) ? 'Desmarcar' : 'Marcar hecho'}</button><button type="button" class="fp-btn fp-btn--sm fp-btn--accent" data-go>${icon('play', 15)}Entrenar este día</button></div></div>
                <table class="fp-table"><thead><tr><th></th><th>Ejercicio</th><th>Series × reps</th><th>Hecho</th></tr></thead><tbody>
                ${pd.items.map((it) => { const ex = ctx.data.exById[it.ex]; const n = (d?.sets || []).filter((s) => s.ex === it.ex).length; return `<tr><td class="fp-data">${it.pair || ''}</td><td><b>${esc(ex?.name || it.ex)}</b>${it.note ? `<br /><small class="fp-muted">${esc(it.note)}</small>` : ''}</td><td class="fp-num fp-data">${it.sets} × ${esc(it.reps)}</td><td class="fp-num fp-data">${n ? `${n}/${it.sets}` : '—'}</td></tr>`; }).join('')}
                </tbody></table>
                ${pd.note ? `<p class="fp-small">${esc(pd.note)}</p>` : ''}
                <p class="fp-small"><b>Bolsa:</b> ${esc(pd.bag || '—')}</p>
                <div class="fp-blocks-strip">${ctx.data.plan.blocks.map((b) => `<span class="fp-chip ${d?.blocks?.[b.id] ? 'fp-chip--accent' : ''}">${esc(b.name)} · ${b.min[0]}–${b.min[1]}′</span>`).join('')}</div>
              </div>`;
            body.querySelector('[data-done]').addEventListener('click', () => ctx.store.updateDay(iso, (day) => {
              const on = !M.dayTrained(d);
              day.blocks = { ...day.blocks, fuerza: on };
              if (day.checkin) day.checkin = { ...day.checkin, trained: on };
            }).then(() => ctx.ui.toast(M.dayTrained(d) ? 'Desmarcado.' : 'Tachado: entreno hecho.', 'ok')));
            body.querySelector('[data-go]').addEventListener('click', () => { ctx.env.LS.set('sesion.day', P.sel); ctx.openApp('sesion'); });
          };
          paint();
          P.listeners.add(paint);
          ctx.onData(paint);
        },
      },
      /* ── Banco de ejercicios ── */
      {
        id: 'banco', title: 'Banco de ejercicios', icon: 'biblioteca', def: DEF.banco, glass: 1, minW: 240, minH: 240,
        mount(body) {
          let mus = '', q = '';
          body.innerHTML = `<div class="fp-bank">
              <input class="fp-input" type="search" placeholder="Buscar…" aria-label="Buscar ejercicio" data-q />
              <div class="fp-bank__chips" data-mus><button type="button" class="fp-chip fp-chip--accent" data-m="">Todos</button>${ctx.data.muscles.map((m) => `<button type="button" class="fp-chip" data-m="${m.id}">${esc(m.name)}</button>`).join('')}</div>
              <div class="fp-bank__list" data-list></div></div>`;
          const list = body.querySelector('[data-list]');
          const render = () => {
            const items = ctx.data.exercises.filter((e) => (!mus || e.muscles.includes(mus) || (e.secondary || []).includes(mus)) && (!q || `${e.name} ${e.cues.join(' ')} ${e.gear.join(' ')}`.toLowerCase().includes(q)));
            list.innerHTML = items.length ? items.map((e) => `<details class="fp-bank__i"><summary><b>${esc(e.name)}</b><small>${e.repRange ? `${e.repRange[0]}–${e.repRange[1]} ${e.unit || 'reps'}` : ''} · ${esc(e.tempo)}${e.motionLabId ? ' · <i class="fp-ml-badge">ML</i>' : ''}</small></summary>
                <p class="fp-small"><b>Músculos:</b> ${e.muscles.map((m) => esc(ctx.data.muscleById[m]?.name || m)).join(', ') || '—'}${e.secondary?.length ? ` · <i>${e.secondary.map((m) => esc(ctx.data.muscleById[m]?.name || m)).join(', ')}</i>` : ''}</p>
                <p class="fp-small"><b>Equipo:</b> ${esc(e.gear.join(', '))}</p>
                <ul class="fp-list">${e.cues.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
                ${e.progressions?.length ? `<p class="fp-small"><b>Palancas:</b> ${esc(e.progressions.join(' → '))}</p>` : ''}</details>`).join('') : '<p class="fp-small">Nada con ese filtro.</p>';
          };
          body.querySelector('[data-q]').addEventListener('input', (e) => { q = e.target.value.trim().toLowerCase(); render(); });
          body.querySelectorAll('[data-m]').forEach((b) => b.addEventListener('click', () => { mus = b.dataset.m; body.querySelectorAll('[data-m]').forEach((x) => x.classList.toggle('fp-chip--accent', x === b)); render(); }));
          render();
        },
      },
      /* ── Volumen por músculo ── */
      {
        id: 'volumen', title: 'Volumen semanal por músculo', icon: 'progreso', def: DEF.volumen, glass: 1, minW: 320, minH: 240,
        mount(body) {
          const paint = () => {
            const st = ctx.state;
            const vol = M.volumeByMuscle(st.days || [], ctx.data, today, 7);
            const any = vol.some((v) => v.sets > 0);
            const demo = (st.days || []).some((d) => d.demo && d.date > M.addDays(today, -7));
            body.innerHTML = `<p class="fp-small">Series efectivas de los últimos 7 días (primario = 1, secundario = 0,5) contra el rango de 01 §5.4. ${ctx.ui.tag('C')} ${demo ? ctx.ui.demoChip() : ''}</p>
              ${any ? '' : '<div class="fp-empty"><b>Todavía no hay series esta semana.</b><span>Registrá en Sesión y los medidores se llenan solos.</span><a class="fp-btn fp-btn--sm" href="#/sesion">Ir a Sesión</a></div>'}
              <div class="fp-vol-grid">${vol.map((v) => `<div class="fp-gauge-cell">${ctx.ui.gauge({ value: v.sets, max: v.target[1] * 1.25, band: v.target, label: v.name, unit: `de ${v.target[0]}–${v.target[1]}`, size: 'sm', status: v.status === 'ok' ? 'ok' : v.sets > 0 ? 'warn' : '', display: fmt(v.sets) })}<span class="fp-gauge-cell__name">${esc(v.name)}${v.priority === 1 ? ' <i class="fp-prio">P1</i>' : ''}</span><span class="fp-gauge-cell__t">${v.status === 'low' ? 'por debajo' : v.status === 'high' ? '¿te recuperás?' : 'en rango'}</span></div>`).join('')}</div>`;
          };
          paint();
          ctx.onData(paint);
        },
      },
      /* ── Cardio A/B ── */
      {
        id: 'cardio', title: 'Cardio vs masa', icon: 'run', def: DEF.cardio, glass: 1, minW: 300, minH: 200,
        mount(body) {
          const paint = () => {
            const st = ctx.state;
            const mode = st.profile?.cardio?.mode || 'A';
            const c = ctx.data.profile.cardio;
            const km = M.runKm(st.days || [], M.addDays(today, -6), today);
            const tRun = (st.days || []).find((d) => d.date === today)?.run;
            body.innerHTML = `<div class="fp-cardio">
                <div class="fp-seg" data-mode><button type="button" data-v="A">A · ${esc(c.A.title)}</button><button type="button" data-v="B">B · ${esc(c.B.title)}</button></div>
                <p class="fp-small">${esc(mode === 'A' ? c.A.detail : c.B.detail)} ${mode === 'A' ? '<span class="fp-chip fp-chip--accent">recomendada</span>' : ''}</p>
                <dl class="fp-kv fp-kv--tight">
                  <div><dt>Hoy corrés</dt><dd class="fp-data">~${c.current.km} km × ${c.current.perWeek}/sem ${ctx.ui.tag('U')}</dd></div>
                  <div><dt>Gasto extra</dt><dd class="fp-data">${fmt(c.weeklyKcal[0])}–${fmt(c.weeklyKcal[1])} kcal/sem ${ctx.ui.tag('C')}</dd></div>
                  <div><dt>Últimos 7 días</dt><dd class="fp-data">${fmt(km)} km</dd></div>
                </dl>
                <form class="fp-row fp-cardio__log" data-run>
                  <label class="fp-field"><span>Km hoy</span><input class="fp-input" type="number" name="km" min="0" max="60" step="0.1" value="${tRun?.km ?? ''}" /></label>
                  <label class="fp-field"><span>Minutos</span><input class="fp-input" type="number" name="min" min="0" max="400" value="${tRun?.min ?? ''}" /></label>
                  <button class="fp-btn fp-btn--sm" type="submit">${icon('check', 14)}Anotar salida</button>
                </form>
                <p class="fp-small">Ritmo «7–8» ${ctx.ui.tag('?')}: anotá minutos y la app calcula min/km.${tRun?.km && tRun?.min ? ` Hoy: <b class="fp-data">${fmt(tRun.min / tRun.km, 2)} min/km</b>.` : ''}</p>
              </div>`;
            ctx.ui.segmented(body.querySelector('[data-mode]'), mode, async (v) => { await ctx.store.saveProfile({ cardio: { mode: v } }); ctx.ui.toast(`Cardio: opción ${v}.`, 'ok'); });
            body.querySelector('[data-run]').addEventListener('submit', async (e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const kmv = +fd.get('km'), min = +fd.get('min');
              await ctx.store.updateDay(today, (day) => { day.run = kmv ? { km: kmv, min: min || null, pace: kmv && min ? Math.round((min / kmv) * 100) / 100 : null, zone: 2 } : null; });
              ctx.ui.toast(kmv ? `Salida anotada: ${fmt(kmv)} km.` : 'Salida borrada.', 'ok');
            });
          };
          paint();
          ctx.onData(() => { if (!body.contains(document.activeElement)) paint(); });
        },
      },
      /* ── Reglas del plan ── */
      {
        id: 'reglas', title: 'Reglas del plan', icon: 'info', def: DEF.reglas, glass: 2, minW: 280, minH: 120,
        mount(body) {
          const paint = () => {
            const r = ctx.data.plan.rules;
            const v6 = !!ctx.state.profile?.plan?.variant6d;
            body.innerHTML = `<label class="fp-switch"><input type="checkbox" data-v6 ${v6 ? 'checked' : ''} /><i></i>Variante 6 días (Lun–Sáb) ${ctx.ui.tag('?')}</label>
              <ul class="fp-list fp-list--s">
                <li><b>Reps:</b> ${esc(r.reps)}</li><li><b>Series:</b> ${esc(r.sets)}</li><li><b>RIR:</b> ${esc(r.rir)}</li><li><b>Descanso:</b> ${esc(r.rest)}</li>
                <li><b>Antes:</b> ${esc(ctx.data.plan.preOrder.text)} ${ctx.ui.tag('C')}</li>
                <li><b>Dominadas livianas:</b> ${esc(ctx.data.plan.dailyPullups.text)}</li>
              </ul>`;
            body.querySelector('[data-v6]').addEventListener('change', async (e) => { await ctx.store.saveProfile({ plan: { variant6d: e.target.checked } }); ctx.ui.toast(e.target.checked ? 'Variante 6 días activada (a confirmar).' : 'Plan de 5 días.', 'info'); });
          };
          paint();
          ctx.onData(paint);
        },
      },
    ];
  },
};
