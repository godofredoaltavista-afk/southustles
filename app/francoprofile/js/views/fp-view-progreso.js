// FP · VISTA PROGRESO — peso (media móvil 7 días + banda de la meta + proyección realista), medidas,
// series por músculo por semana, relojes de sensaciones, fotos de progreso con comparador antes/después
// y «vs tu sesión anterior» de Motion Lab. La app muestra la meta, no la promete (01 §7.6).
console.log('[fp/view-progreso] init');

const num = (v) => (v === '' || v == null ? null : (Number.isNaN(+String(v).replace(',', '.')) ? null : +String(v).replace(',', '.')));
const MEASURES = [['armRelaxedCm', 'Brazo relajado'], ['armFlexedCm', 'Brazo tenso'], ['chestCm', 'Pecho'], ['waistCm', 'Cintura'], ['thighCm', 'Muslo'], ['calfCm', 'Gemelo'], ['neckCm', 'Cuello']];
const VIEWS = [['front', 'Frente'], ['side', 'Perfil'], ['back', 'Espalda']];

function paintLeds(root, ctx) {
  const dark = ctx.theme.isDark();
  root.querySelectorAll('canvas[data-led]').forEach((c) => ctx.led.drawLED(c, c.dataset.led, dark ? { on: ctx.led.accentColor(), glow: 10 } : { ink: true }));
}
function ledLater(root, ctx) {
  requestAnimationFrame(() => paintLeds(root, ctx));
  if (!root._fpLedRO) {
    let t = null;
    root._fpLedRO = new ResizeObserver(() => { clearTimeout(t); t = setTimeout(() => paintLeds(root, ctx), 80); });
    root._fpLedRO.observe(root);
    document.addEventListener('fp-theme-changed', () => paintLeds(root, ctx));
  }
}

async function shrink(file, max = 1800) {
  try {
    const bmp = await createImageBitmap(file);
    const s = Math.min(1, max / Math.max(bmp.width, bmp.height));
    if (s >= 1 && file.size < 2e6) return file;
    const c = document.createElement('canvas');
    c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    return await new Promise((res) => c.toBlob((b) => res(b || file), 'image/jpeg', 0.88));
  } catch { return file; }
}

/** Gráfico de peso: puntos diarios, media móvil, banda de la meta y cono de proyección realista hasta la fecha meta. */
function weightChart(M, series, avg, prof, proj) {
  const W = 560, H = 200, P = { l: 34, r: 14, t: 12, b: 22 };
  const tDate = prof.goal?.targetDate || '2026-12-22';
  const tr = prof.goal?.targetRange || [65, 65.5];
  const first = series[0].date;
  const last = series[series.length - 1];
  const endDate = tDate > last.date ? tDate : last.date;
  const span = Math.max(1, M.daysBetween(first, endDate));
  const ys = [...series.map((p) => p.kg), tr[0], tr[1], ...(proj.lo != null ? [proj.lo, proj.hi] : [])];
  let lo = Math.min(...ys) - 0.4, hi = Math.max(...ys) + 0.4;
  const X = (d) => P.l + (M.daysBetween(first, d) / span) * (W - P.l - P.r);
  const Y = (v) => P.t + (1 - (v - lo) / (hi - lo)) * (H - P.t - P.b);
  const path = (arr) => arr.map((p, i) => `${i ? 'L' : 'M'}${X(p.date).toFixed(1)},${Y(p.kg).toFixed(1)}`).join('');
  const ticks = [];
  for (let v = Math.ceil(lo); v <= hi; v += (hi - lo > 6 ? 2 : 1)) ticks.push(v);
  const cone = proj.lo != null && tDate > last.date
    ? `<polygon class="fp-vb-wc__cone" points="${X(last.date)},${Y(last.kg)} ${X(tDate)},${Y(proj.hi)} ${X(tDate)},${Y(proj.lo)}"/>
       <text class="fp-vb-wc__lab" x="${X(tDate) - 4}" y="${Y(proj.hi) - 6}" text-anchor="end">banda ${proj.lo}–${proj.hi} kg [C]</text>`
    : '';
  return `<svg class="fp-vb-wc" viewBox="0 0 ${W} ${H}" role="img" aria-label="Peso: ${series.length} registros, último ${last.kg} kg">
    ${ticks.map((v) => `<line class="fp-vb-wc__grid" x1="${P.l}" x2="${W - P.r}" y1="${Y(v)}" y2="${Y(v)}"/><text class="fp-vb-wc__ax" x="${P.l - 6}" y="${Y(v) + 3}" text-anchor="end">${v}</text>`).join('')}
    <rect class="fp-vb-wc__goal" x="${P.l}" width="${W - P.l - P.r}" y="${Y(tr[1])}" height="${Math.max(2, Y(tr[0]) - Y(tr[1]))}"/>
    <text class="fp-vb-wc__lab fp-vb-wc__lab--goal" x="${P.l + 4}" y="${Y(tr[1]) - 4}">meta ${tr[0]}–${tr[1]} kg [U]</text>
    <line class="fp-vb-wc__date" x1="${X(tDate)}" x2="${X(tDate)}" y1="${P.t}" y2="${H - P.b}"/>
    ${cone}
    <path class="fp-vb-wc__avg" d="${path(avg)}"/>
    <path class="fp-vb-wc__line" d="${path(series)}"/>
    ${series.map((p) => `<circle class="fp-vb-wc__pt ${p.demo ? 'is-demo' : ''} ${p.declared ? 'is-decl' : ''}" cx="${X(p.date)}" cy="${Y(p.kg)}" r="3"><title>${p.date}: ${p.kg} kg${p.demo ? ' (ejemplo)' : p.declared ? ' (declarado)' : ''}</title></circle>`).join('')}
    <text class="fp-vb-wc__ax" x="${P.l}" y="${H - 6}">${M.fmtDate(first)}</text>
    <text class="fp-vb-wc__ax" x="${X(tDate)}" y="${H - 6}" text-anchor="middle">${M.fmtDate(tDate)}</text>
  </svg>`;
}

export default {
  id: 'progreso',
  title: 'Progreso',
  icon: 'progreso',
  theme: 'dark',
  hint: 'Peso, medidas, fotos, sensaciones',

  windows(ctx) {
    const { esc, fmt, icon, toast } = ctx.ui;
    const M = ctx.M;
    const getDays = async () => (ctx.state.days?.length ? ctx.state.days : ctx.store.allDays());
    const getProf = async () => ctx.state.profile || ctx.store.getProfile();

    return [
      /* ── PESO ─────────────────────────────── */
      {
        id: 'peso', title: 'Peso y meta', icon: 'scale', glass: 1,
        def: { x: 0.02, y: 0.03, w: 0.4, h: 0.47 },
        mount(body) {
          body.classList.add('fp-vb');
          const paint = async () => {
            const days = await getDays(); const prof = await getProf();
            const series = M.weightSeries(days, prof);
            if (!series.length) {
              body.innerHTML = `<div class="fp-empty"><b>Sin peso cargado.</b>Cargá el peso en ayunas en el check-in (2–3 veces por semana alcanza: se mira la tendencia, no un día).<a class="fp-btn fp-btn--sm" href="#/checkin">Ir al check-in</a></div>`;
              return;
            }
            const avg = M.movingAvg(series.filter((p) => !p.declared).length ? series.filter((p) => !p.declared) : series, 7);
            const cur = avg[avg.length - 1].kg;
            const proj = M.projection(prof, cur, M.todayISO());
            const wk = M.weeklyAvg(series.filter((p) => !p.declared));
            const trend = wk.length >= 2 ? Math.round((wk[wk.length - 1].kg - wk[wk.length - 2].kg) * 100) / 100 : null;
            body.innerHTML = `
              <div class="fp-row fp-row--between">
                <div class="fp-vb-stat fp-vb-stat--row"><canvas class="fp-vb-led fp-vb-led--l" data-led="${String(cur).replace(',', '.')}"></canvas><span>kg · media 7 días</span></div>
                <div class="fp-stack fp-vb-right">
                  ${series.some((p) => p.demo) ? ctx.ui.demoChip() : ''}
                  <span class="fp-small">Semana vs anterior: <b class="fp-data">${trend == null ? '—' : `${trend > 0 ? '+' : ''}${fmt(trend, 2)} kg`}</b></span>
                  <span class="fp-small">Faltan <b class="fp-data">${proj.days}</b> días al ${esc(M.fmtDate(proj.date))}</span>
                </div>
              </div>
              ${weightChart(M, series, avg, prof, proj)}
              <p class="fp-small">${proj.lo != null ? `Con +0,5–1 kg/mes ${ctx.ui.tag('C')} llegarías a <b class="fp-data">${proj.lo}–${proj.hi} kg</b>. Para la meta ${ctx.ui.tag('U')} harían falta <b class="fp-data">${fmt(proj.needPerMonth, 2)} kg/mes</b>. ${proj.reachable ? 'Entra en la banda alta.' : 'Está por encima de la banda: es una meta, no una promesa.'}` : ''} Si la media no sube en 3 semanas: +200–300 kcal/día.</p>`;
            ledLater(body, ctx);
          };
          paint(); ctx.onData(paint);
        },
      },

      /* ── MEDIDAS ──────────────────────────── */
      {
        id: 'medidas', title: 'Medidas', icon: 'ruler', glass: 1,
        def: { x: 0.44, y: 0.03, w: 0.28, h: 0.47 },
        mount(body) {
          body.classList.add('fp-vb');
          body.innerHTML = `
            <form class="fp-stack" data-mf autocomplete="off">
              <div class="fp-form-grid fp-vb-compact">
                <label class="fp-field"><span>Fecha</span><input class="fp-input" type="date" name="date" value="${M.todayISO()}" max="${M.todayISO()}" /></label>
                ${MEASURES.map(([k, l]) => `<label class="fp-field"><span>${l} (cm)</span><input class="fp-input" type="number" step="0.1" min="10" max="200" inputmode="decimal" name="${k}" /></label>`).join('')}
              </div>
              <button type="submit" class="fp-btn fp-btn--sm fp-btn--primary">Guardar medidas</button>
            </form>
            <div data-mt></div>`;
          const form = body.querySelector('[data-mf]');
          const table = body.querySelector('[data-mt]');
          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const m = {};
            for (const [k] of MEASURES) { const v = num(form.elements[k].value); if (v != null) m[k] = v; }
            if (!Object.keys(m).length) { toast('Cargá al menos una medida.', 'info'); return; }
            await ctx.store.updateDay(form.elements.date.value || M.todayISO(), (d) => { d.measures = { ...(d.measures || {}), ...m }; });
            MEASURES.forEach(([k]) => { form.elements[k].value = ''; });
            toast('Medidas guardadas (datos sensibles: solo en este dispositivo).', 'ok');
          });
          const paint = async () => {
            const days = (await getDays()).filter((d) => d.measures);
            if (!days.length) { table.innerHTML = '<p class="fp-small">Medí brazo, espalda y cintura cada 2 semanas, misma hora, mismo lugar.</p>'; return; }
            const first = days[0].measures; const lastD = days[days.length - 1];
            const next = M.addDays(lastD.date, 14);
            table.innerHTML = `
              <p class="fp-small">Próxima medición: <b class="fp-data">${esc(M.fmtDate(next))}</b>${days.some((d) => d.demo) ? ` ${ctx.ui.demoChip()}` : ''}</p>
              <table class="fp-table fp-vb-tight"><thead><tr><th>Medida</th>${days.slice(-3).map((d) => `<th>${esc(M.fmtDate(d.date))}</th>`).join('')}<th>Δ</th></tr></thead><tbody>
                ${MEASURES.map(([k, l]) => {
                  const vals = days.slice(-3).map((d) => d.measures[k]);
                  const lastV = [...days].reverse().find((d) => d.measures[k] != null)?.measures[k];
                  const delta = lastV != null && first[k] != null ? Math.round((lastV - first[k]) * 10) / 10 : null;
                  return `<tr><td>${l}</td>${vals.map((v) => `<td class="fp-num">${v ?? '—'}</td>`).join('')}<td class="fp-num ${delta > 0 ? 'fp-vb-up' : ''}">${delta == null ? '—' : `${delta > 0 ? '+' : ''}${fmt(delta)}`}</td></tr>`;
                }).join('')}
              </tbody></table>`;
          };
          paint(); ctx.onData(paint);
        },
      },

      /* ── VS SESIÓN ANTERIOR ───────────────── */
      {
        id: 'vsprev', title: 'vs tu sesión anterior', icon: 'lab', glass: 1,
        def: { x: 0.74, y: 0.03, w: 0.24, h: 0.47 },
        mount(body) {
          body.classList.add('fp-vb');
          const paint = async () => {
            const sessions = ctx.state.sessions?.length ? ctx.state.sessions : await ctx.store.listSessions();
            if (!sessions.length) { body.innerHTML = '<div class="fp-empty"><b>Sin sesiones de Motion Lab.</b>Importá el JSON de tu sesión y acá ves si mejoraste vs la anterior.<a class="fp-btn fp-btn--sm" href="#/lab">Ir al Lab</a></div>'; return; }
            const latestByEx = new Map();
            for (const s of sessions) if (!latestByEx.has(s.exerciseId)) latestByEx.set(s.exerciseId, s);
            const rows = [...latestByEx.values()].map((s) => ({ s, vp: ctx.ml.vsPrevious(sessions, s) }));
            body.innerHTML = `<div class="fp-stack">${rows.map(({ s, vp }) => {
              const kv = s.kpi ? `${fmt(s.kpi.value)} ${esc(s.kpi.unit)}` : `${fmt(s.durationMs / 1000)} s`;
              if (!vp || vp.delta == null) return `<div class="fp-vb-vs"><div class="fp-row fp-row--between"><b>${esc(s.exerciseName)}</b>${s.demo ? ctx.ui.demoChip() : ''}</div><span class="fp-small">${kv} · ${esc(String(s.createdAt).slice(0, 10))} · todavía no hay una anterior del mismo ejercicio.</span></div>`;
              const up = vp.delta >= 0;
              return `<div class="fp-vb-vs"><div class="fp-row fp-row--between"><b>${esc(s.exerciseName)}</b><b class="fp-data ${up ? 'fp-vb-up' : 'fp-vb-down'}">${up ? '+' : ''}${vp.delta} %</b></div>
                <div class="fp-vb-vsbar"><i style="--a:${Math.min(100, (vp.a / Math.max(vp.a, vp.b)) * 100)}"></i><i class="is-prev" style="--a:${Math.min(100, (vp.b / Math.max(vp.a, vp.b)) * 100)}"></i></div>
                <span class="fp-small">${fmt(vp.a)} vs ${fmt(vp.b)} ${esc(vp.unit)} (${esc(String(vp.prev.createdAt).slice(0, 10))})</span></div>`;
            }).join('')}</div>`;
            requestAnimationFrame(() => body.querySelectorAll('.fp-vb-vsbar').forEach((b) => b.classList.add('is-in')));
          };
          paint(); ctx.onData(paint);
        },
      },

      /* ── VOLUMEN POR SEMANA ───────────────── */
      {
        id: 'volumen', title: 'Series por músculo · 4 semanas', icon: 'dumbbell', glass: 1,
        def: { x: 0.02, y: 0.53, w: 0.32, h: 0.44 },
        mount(body) {
          body.classList.add('fp-vb');
          const paint = async () => {
            const days = await getDays();
            const today = M.todayISO();
            const weeks = [3, 2, 1, 0].map((w) => M.volumeByMuscle(days, ctx.data, M.addDays(today, -7 * w), 7));
            const any = weeks.some((wk) => wk.some((v) => v.sets > 0));
            if (!any) { body.innerHTML = '<div class="fp-empty"><b>Sin series registradas.</b>Registrá series en la Sesión y acá se arma tu volumen semanal vs 12–20.<a class="fp-btn fp-btn--sm" href="#/sesion">Empezar sesión</a></div>'; return; }
            const demo = days.some((d) => d.demo && d.date > M.addDays(today, -28));
            body.innerHTML = `
              <div class="fp-row fp-row--between"><span class="fp-small">Semanas → (la última es la actual). Franja = rango objetivo ${ctx.ui.tag('C')}</span>${demo ? ctx.ui.demoChip() : ''}</div>
              <div class="fp-vb-weeks">${ctx.data.muscles.map((m, mi) => {
                const top = m.target[1] * 1.3;
                return `<div class="fp-vb-weeks__row"><span class="fp-vb-weeks__n">${esc(m.name)}${m.priority === 1 ? ' <b class="fp-vb-p1">P1</b>' : ''}</span>
                  <div class="fp-vb-weeks__bars" style="--lo:${(m.target[0] / top) * 100}%;--hi:${(m.target[1] / top) * 100}%">${weeks.map((wk, wi) => {
                    const v = wk[mi];
                    return `<i class="is-${v.status} ${wi === 3 ? 'is-now' : ''}" style="--v:${Math.min(100, (v.sets / top) * 100)}%" title="${esc(m.name)}: ${v.sets} series"></i>`;
                  }).join('')}</div><span class="fp-data fp-vb-weeks__v">${weeks[3][mi].sets}</span></div>`;
              }).join('')}</div>`;
          };
          paint(); ctx.onData(paint);
        },
      },

      /* ── SENSACIONES ──────────────────────── */
      {
        id: 'sensaciones', title: 'Relojes de sensación', icon: 'heart', glass: 1,
        def: { x: 0.36, y: 0.53, w: 0.26, h: 0.44 },
        mount(body) {
          body.classList.add('fp-vb');
          const paint = async () => {
            const today = M.todayISO();
            const days = (await getDays()).filter((d) => d.date > M.addDays(today, -7) && d.checkin);
            if (!days.length) { body.innerHTML = '<div class="fp-empty"><b>Sin check-ins esta semana.</b>Los relojes salen del promedio de 7 días.<a class="fp-btn fp-btn--sm" href="#/checkin">Hacer check-in</a></div>'; return; }
            const a = (k) => M.avgOf(days, (d) => d.checkin[k]);
            const pump = a('pump'), fat = a('fatigue'), en = a('energy'), sl = a('sleepH');
            const g = (v, max, label, unit, good) => `<div class="fp-gauge-cell">${ctx.ui.gauge({ value: v ?? 0, max, label, unit, size: 'sm', display: v == null ? '—' : fmt(v, 1), status: v == null ? '' : good(v) ? 'ok' : 'warn' })}<span class="fp-gauge-cell__name">${label}</span></div>`;
            body.innerHTML = `
              ${days.some((d) => d.demo) ? `<div class="fp-row">${ctx.ui.demoChip()}</div>` : ''}
              <div class="fp-vb-gauges">
                ${g(pump, 5, 'Bombeo', '/5', (v) => v >= 3)}
                ${g(fat, 5, 'Fatiga', '/5', (v) => v <= 3)}
                ${g(en, 5, 'Energía', '/5', (v) => v >= 3)}
                ${g(sl, 10, 'Sueño', 'h', (v) => v >= 8)}
              </div>
              <p class="fp-small">Promedio de ${days.length} día(s). Fatiga ≥ 4 dos sesiones seguidas → el planificador sugiere bajar series.</p>`;
          };
          paint(); ctx.onData(paint);
        },
      },

      /* ── FOTOS DE PROGRESO ────────────────── */
      {
        id: 'fotos', title: 'Fotos de progreso', icon: 'image', glass: 1,
        def: { x: 0.64, y: 0.53, w: 0.34, h: 0.44 },
        mount(body) {
          body.classList.add('fp-vb');
          let view = 'front';
          body.innerHTML = `
            <div class="fp-row fp-row--between">
              <div class="fp-seg" data-view>${VIEWS.map(([v, l]) => `<button type="button" data-v="${v}">${l}</button>`).join('')}</div>
              <label class="fp-btn fp-btn--sm">${icon('camera', 14)} Sumar foto<input type="file" accept="image/*" capture="user" class="fp-sr" data-up /></label>
            </div>
            <div data-cmp></div>
            <p class="fp-small fp-vb-note">${icon('vault', 14)} Solo en este dispositivo. Misma luz, misma distancia, misma pose: la guía ayuda a alinear.</p>`;
          const cmp = body.querySelector('[data-cmp]');
          ctx.ui.segmented(body.querySelector('[data-view]'), view, (v) => { view = v; paint(); });
          body.querySelector('[data-up]').addEventListener('change', async (e) => {
            const f = e.target.files[0]; if (!f) return;
            const blob = await shrink(f);
            const date = M.todayISO();
            const id = await ctx.store.putMedia(blob, { kind: 'body', view, date });
            await ctx.store.updateDay(date, (d) => { d.bodyPhotos = [...(d.bodyPhotos || []).filter((p) => p.view !== view), { view, mediaId: id }]; });
            e.target.value = '';
            toast('Foto de progreso guardada en el dispositivo.', 'ok');
          });
          async function paint() {
            const days = await getDays();
            const shots = [];
            for (const d of days) for (const p of d.bodyPhotos || []) if (p.view === view) shots.push({ date: d.date, id: p.mediaId });
            if (!shots.length) {
              cmp.innerHTML = `<div class="fp-vb-cmp fp-vb-cmp--empty"><div class="fp-vb-guide" aria-hidden="true"><i></i><i></i><i></i></div><span>Sin fotos de ${esc(VIEWS.find((v) => v[0] === view)[1].toLowerCase())} todavía.</span></div>`;
              return;
            }
            const opts = shots.map((s, i) => `<option value="${i}">${esc(M.fmtDate(s.date))}</option>`).join('');
            cmp.innerHTML = `
              <div class="fp-row fp-vb-cmprow">
                <label class="fp-field fp-vb-inline"><span>Antes</span><select class="fp-select" data-a>${opts}</select></label>
                <label class="fp-field fp-vb-inline"><span>Después</span><select class="fp-select" data-b>${opts}</select></label>
              </div>
              <div class="fp-vb-cmp" data-box style="--x:50%">
                <img data-ia alt="Antes" /><img data-ib class="fp-vb-cmp__top" alt="Después" />
                <div class="fp-vb-guide" aria-hidden="true"><i></i><i></i><i></i></div>
                <span class="fp-vb-cmp__handle" aria-hidden="true"></span>
                <input type="range" min="0" max="100" value="50" class="fp-vb-cmp__range" aria-label="Comparar antes y después" data-r />
              </div>`;
            const sa = cmp.querySelector('[data-a]'), sb = cmp.querySelector('[data-b]');
            sa.value = '0'; sb.value = String(shots.length - 1);
            const ia = cmp.querySelector('[data-ia]'), ib = cmp.querySelector('[data-ib]');
            const load = async () => { ia.src = (await ctx.store.mediaURL(shots[+sa.value].id)) || ''; ib.src = (await ctx.store.mediaURL(shots[+sb.value].id)) || ''; };
            sa.addEventListener('change', load); sb.addEventListener('change', load);
            const box = cmp.querySelector('[data-box]'), r = cmp.querySelector('[data-r]');
            r.addEventListener('input', () => box.style.setProperty('--x', `${r.value}%`));
            load();
          }
          paint(); ctx.onData(paint);
        },
      },
    ];
  },
};
