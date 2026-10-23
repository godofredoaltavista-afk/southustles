// FP · VISTA CHECK-IN — formulario de 30 s (02 §6.3), carrera del día, resumen con LED e historial.
// Dolor: si se marca varios días seguidos, la app sugiere bajar carga y consultar. No da tratamiento (01 §12.6).
console.log('[fp/view-checkin] init');

const num = (v) => (v === '' || v == null ? null : (Number.isNaN(+String(v).replace(',', '.')) ? null : +String(v).replace(',', '.')));
const ZONES = ['pulgar', 'muñeca', 'codo', 'hombro derecho', 'hombro izquierdo', 'cuello', 'escápula', 'dorsal', 'lumbar', 'glúteo', 'rodilla', 'gemelo', 'tobillo', 'otra'];
const TENSIONS = [['excentrica-lenta', 'Excéntrica lenta'], ['pausa-iso', 'Pausa isométrica'], ['banda', 'Banda'], ['bolsa', 'Bolsa']];

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
const scale = (name, label, hint = '') => `
  <div class="fp-field fp-vb-scale"><span>${label}${hint ? ` <em class="fp-small">${hint}</em>` : ''}</span>
    <div class="fp-seg" data-scale="${name}">${[1, 2, 3, 4, 5].map((n) => `<button type="button" data-v="${n}">${n}</button>`).join('')}</div></div>`;
const paceOf = (km, min) => {
  if (!km || !min) return null;
  const p = min / km; const m = Math.floor(p); const s = Math.round((p - m) * 60);
  return `${m}:${String(s === 60 ? 0 : s).padStart(2, '0')}`;
};

export default {
  id: 'checkin',
  title: 'Check-in',
  icon: 'checkin',
  theme: 'light',
  hint: '30 segundos por día',

  windows(ctx) {
    const { esc, fmt, icon, toast } = ctx.ui;
    const M = ctx.M;
    const bus = new EventTarget();
    const S = { date: M.todayISO() };

    return [
      /* ── FORMULARIO ───────────────────────── */
      {
        id: 'form', title: 'Check-in de hoy', icon: 'checkin', glass: 1,
        def: { x: 0.02, y: 0.03, w: 0.46, h: 0.94 },
        mount(body) {
          body.classList.add('fp-vb');
          const groups = ctx.data.muscles.map((m) => `<button type="button" class="fp-chip" data-g="${m.id}" aria-pressed="false">${esc(m.name)}</button>`).join('');
          body.innerHTML = `
            <form class="fp-stack" data-form autocomplete="off">
              <div class="fp-row fp-row--between">
                <label class="fp-field fp-vb-inline"><span>Fecha</span><input class="fp-input" type="date" name="date" value="${S.date}" max="${M.todayISO()}" /></label>
                <div class="fp-vb-progress" aria-live="polite"><span class="fp-data" data-done>0/12</span><div class="fp-bar fp-bar--ok"><i data-donebar style="--v:0"></i></div></div>
              </div>
              <div class="fp-vb-grid3">
                <label class="fp-field"><span>Peso en ayunas (kg) · opc.</span><input class="fp-input" type="number" step="0.1" min="30" max="150" inputmode="decimal" name="weightKg" placeholder="62,5" /></label>
                <label class="fp-field"><span>Sueño (h)</span><input class="fp-input" type="number" step="0.5" min="0" max="16" inputmode="decimal" name="sleepH" placeholder="8" /></label>
                <div></div>
              </div>
              <div class="fp-vb-grid2">
                ${scale('sleepQ', 'Calidad del sueño')}
                ${scale('energy', 'Energía')}
                ${scale('mood', 'Ánimo')}
                ${scale('pump', 'Bombeo', 'si entrenaste')}
                ${scale('fatigue', 'Fatiga', '5 = destruido')}
              </div>
              <div class="fp-field"><span>Dolor o molestia</span>
                <div class="fp-seg" data-pain><button type="button" data-v="none">Ninguno</button><button type="button" data-v="doms">Agujetas</button><button type="button" data-v="joint">Articular / hormigueo</button></div></div>
              <div class="fp-vb-grid2" data-painmore hidden>
                <label class="fp-field"><span>Zona</span><select class="fp-select" name="zone">${ZONES.map((z) => `<option value="${z}">${z}</option>`).join('')}</select></label>
                ${scale('painLevel', 'Nivel')}
              </div>
              <p class="fp-vb-banner fp-vb-banner--bad" data-jointwarn hidden>${icon('alert', 16)} Dolor punzante, articular o con hormigueo: pará ese ejercicio y marcá la zona. No es para «pasarlo».</p>
              <div class="fp-vb-grid2">
                <div class="fp-field"><span>¿Comiste antes de entrenar?</span><div class="fp-seg" data-fed><button type="button" data-v="yes">Sí</button><button type="button" data-v="no">No</button><button type="button" data-v="na">—</button></div></div>
                <div class="fp-field"><span>¿Entrenaste?</span><div class="fp-seg" data-trained><button type="button" data-v="yes">Sí</button><button type="button" data-v="no">No</button></div></div>
              </div>
              <div class="fp-field"><span>Grupos que trabajaste</span><div class="fp-vb-chips" data-groups>${groups}</div></div>
              <div class="fp-field"><span>¿Qué tensión se sintió mejor hoy?</span>
                <div class="fp-seg" data-best>${TENSIONS.map(([v, l]) => `<button type="button" data-v="${v}">${l}</button>`).join('')}</div></div>
              <label class="fp-field"><span>Notas</span><textarea class="fp-textarea" rows="2" name="notes" placeholder="Cómo te sentiste, qué cambió."></textarea></label>
              <button type="submit" class="fp-btn fp-btn--primary fp-btn--action">Guardar check-in</button>
            </form>`;
          const form = body.querySelector('[data-form]');
          const V = { sleepQ: null, energy: null, mood: null, pump: null, fatigue: null, painLevel: 1, pain: 'none', fed: 'na', trained: null, best: null, groups: new Set() };
          const segs = {};
          body.querySelectorAll('[data-scale]').forEach((el) => { const k = el.dataset.scale; segs[k] = ctx.ui.segmented(el, V[k], (v) => { V[k] = +v; progress(); }); });
          const painMore = body.querySelector('[data-painmore]');
          const jointWarn = body.querySelector('[data-jointwarn]');
          const setPain = (v) => { V.pain = v; painMore.hidden = v === 'none'; jointWarn.hidden = v !== 'joint'; progress(); };
          segs.pain = ctx.ui.segmented(body.querySelector('[data-pain]'), V.pain, setPain);
          segs.fed = ctx.ui.segmented(body.querySelector('[data-fed]'), V.fed, (v) => { V.fed = v; progress(); });
          segs.trained = ctx.ui.segmented(body.querySelector('[data-trained]'), V.trained, (v) => { V.trained = v; progress(); });
          segs.best = ctx.ui.segmented(body.querySelector('[data-best]'), V.best, (v) => { V.best = v; progress(); });
          const gBtns = [...body.querySelectorAll('[data-g]')];
          gBtns.forEach((b) => b.addEventListener('click', () => {
            const on = b.getAttribute('aria-pressed') !== 'true';
            b.setAttribute('aria-pressed', String(on)); b.classList.toggle('fp-chip--accent', on);
            on ? V.groups.add(b.dataset.g) : V.groups.delete(b.dataset.g); progress();
          }));
          const doneEl = body.querySelector('[data-done]');
          const doneBar = body.querySelector('[data-donebar]');
          function progress() {
            const f = form.elements;
            const checks = [f.sleepH.value !== '', V.sleepQ, V.energy, V.mood, V.pump, V.fatigue, V.pain !== null, V.fed !== 'na', V.trained, V.groups.size, V.best, f.weightKg.value !== ''];
            const n = checks.filter(Boolean).length;
            doneEl.textContent = `${n}/12`; doneBar.style.setProperty('--v', String(Math.round((n / 12) * 100)));
          }
          form.addEventListener('input', progress);
          const load = async () => {
            const day = await ctx.store.getDay(S.date);
            const c = day && !day.demo ? day.checkin : null;
            const f = form.elements;
            f.weightKg.value = c?.weightKg ?? ''; f.sleepH.value = c?.sleepH ?? ''; f.notes.value = c?.notes ?? '';
            for (const k of ['sleepQ', 'energy', 'mood', 'pump', 'fatigue']) { V[k] = c?.[k] ?? null; segs[k].set(V[k]); }
            V.painLevel = c?.pain?.level ?? 1; segs.painLevel.set(V.painLevel);
            setPain(c?.pain?.type || 'none'); segs.pain.set(V.pain);
            if (c?.pain?.zone) f.zone.value = c.pain.zone;
            V.fed = c?.fedBefore === true ? 'yes' : c?.fedBefore === false ? 'no' : 'na'; segs.fed.set(V.fed);
            V.trained = c?.trained === true ? 'yes' : c?.trained === false ? 'no' : (day && M.dayTrained(day) && !day.demo ? 'yes' : null); segs.trained.set(V.trained);
            V.best = c?.bestTension ?? null; segs.best.set(V.best);
            V.groups = new Set(c?.groups || []);
            gBtns.forEach((b) => { const on = V.groups.has(b.dataset.g); b.setAttribute('aria-pressed', String(on)); b.classList.toggle('fp-chip--accent', on); });
            progress();
          };
          form.elements.date.addEventListener('change', () => { S.date = form.elements.date.value || M.todayISO(); load(); bus.dispatchEvent(new Event('date')); });
          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const f = form.elements;
            const checkin = {
              weightKg: num(f.weightKg.value), sleepH: num(f.sleepH.value), sleepQ: V.sleepQ, energy: V.energy, mood: V.mood,
              pump: V.pump, fatigue: V.fatigue,
              pain: V.pain === 'none' ? { type: 'none' } : { type: V.pain, zone: f.zone.value, level: V.painLevel },
              fedBefore: V.fed === 'yes' ? true : V.fed === 'no' ? false : null,
              trained: V.trained === 'yes' ? true : V.trained === 'no' ? false : null,
              groups: [...V.groups], bestTension: V.best, notes: f.notes.value.trim(), at: new Date().toISOString(),
            };
            await ctx.store.updateDay(S.date, (d) => { d.checkin = checkin; });
            toast(V.pain === 'joint' ? 'Check-in guardado. Marcaste dolor articular: bajá la carga de esa zona.' : 'Check-in guardado.', V.pain === 'joint' ? 'bad' : 'ok');
          });
          load();
        },
      },

      /* ── CARRERA ──────────────────────────── */
      {
        id: 'carrera', title: 'Carrera del día', icon: 'run', glass: 1,
        def: { x: 0.5, y: 0.03, w: 0.24, h: 0.46 },
        mount(body) {
          body.classList.add('fp-vb');
          body.innerHTML = `
            <form class="fp-stack" data-run autocomplete="off">
              <div class="fp-vb-grid2">
                <label class="fp-field"><span>Km</span><input class="fp-input" type="number" step="0.1" min="0" max="60" inputmode="decimal" name="km" placeholder="8" /></label>
                <label class="fp-field"><span>Minutos</span><input class="fp-input" type="number" step="1" min="0" max="400" inputmode="numeric" name="min" placeholder="50" /></label>
              </div>
              <div class="fp-vb-pace"><span class="fp-small">Ritmo</span><b class="fp-data" data-pace>—</b><span class="fp-small">min/km</span></div>
              <div class="fp-field"><span>Zona ${ctx.ui.tag('C')} <em class="fp-small">2 = podés hablar</em></span>
                <div class="fp-seg" data-zone>${[1, 2, 3, 4, 5].map((n) => `<button type="button" data-v="${n}">Z${n}</button>`).join('')}</div></div>
              <button type="submit" class="fp-btn fp-btn--sm fp-btn--primary">Guardar carrera</button>
              <p class="fp-small">Opción ${esc((ctx.state.profile?.cardio?.mode) || 'A')}: ${(ctx.state.profile?.cardio?.mode || 'A') === 'A' ? '1–2 salidas suaves en zona 2, nunca el día antes de piernas.' : '3 × 10 km comiendo +250–300 kcal/día.'}</p>
            </form>`;
          const f = body.querySelector('[data-run]');
          let zone = 2;
          const zSeg = ctx.ui.segmented(body.querySelector('[data-zone]'), zone, (v) => { zone = +v; });
          const paceEl = body.querySelector('[data-pace]');
          const upd = () => { paceEl.textContent = paceOf(num(f.km.value), num(f.min.value)) || '—'; };
          f.addEventListener('input', upd);
          const load = async () => {
            const d = await ctx.store.getDay(S.date);
            const r = d && !d.demo ? d.run : null;
            f.km.value = r?.km ?? ''; f.min.value = r?.min ?? ''; zone = r?.zone ?? 2; zSeg.set(zone); upd();
          };
          f.addEventListener('submit', async (e) => {
            e.preventDefault();
            const km = num(f.km.value), min = num(f.min.value);
            await ctx.store.updateDay(S.date, (d) => { d.run = km ? { km, min, pace: paceOf(km, min), zone } : null; });
            toast(km ? `Carrera guardada · ${fmt(km)} km.` : 'Carrera borrada del día.', 'ok');
          });
          bus.addEventListener('date', load);
          load();
        },
      },

      /* ── RESUMEN ──────────────────────────── */
      {
        id: 'resumen', title: 'Resumen', icon: 'heart', glass: 1,
        def: { x: 0.76, y: 0.03, w: 0.22, h: 0.46 },
        mount(body) {
          body.classList.add('fp-vb');
          const paint = async () => {
            const days = ctx.state.days?.length ? ctx.state.days : await ctx.store.allDays();
            const d = days.find((x) => x.date === S.date);
            const c = d?.checkin;
            const ps = M.painStreak(days, M.todayISO());
            body.innerHTML = `
              <div class="fp-row fp-row--between"><b>${esc(M.fmtDate(S.date, { long: true }))}</b>${d?.demo ? ctx.ui.demoChip() : ''}</div>
              <div class="fp-vb-ledgrid">
                <div class="fp-vb-stat"><canvas class="fp-vb-led" data-led="${c?.sleepH != null ? fmt(c.sleepH, 1).replace(',', '.') : '-'}"></canvas><span>h de sueño</span></div>
                <div class="fp-vb-stat"><canvas class="fp-vb-led" data-led="${c?.energy ?? '-'}"></canvas><span>energía /5</span></div>
                <div class="fp-vb-stat"><canvas class="fp-vb-led" data-led="${c?.fatigue ?? '-'}"></canvas><span>fatiga /5</span></div>
                <div class="fp-vb-stat"><canvas class="fp-vb-led" data-led="${d?.run?.km != null ? fmt(d.run.km, 1).replace(',', '.') : '-'}"></canvas><span>km</span></div>
              </div>
              ${ps >= 3 ? `<p class="fp-vb-banner fp-vb-banner--bad">${icon('alert', 16)} Dolor ${ps} días seguidos: bajá carga y consultá. La app no da tratamiento.</p>`
                : c?.pain?.type === 'doms' ? `<p class="fp-vb-banner">${icon('info', 16)} Agujetas: permitidas, pero no son objetivo ni miden el progreso.</p>`
                : `<p class="fp-small">${c ? 'Sin dolor marcado.' : 'Todavía sin check-in para este día.'}</p>`}`;
            ledLater(body, ctx);
          };
          paint();
          ctx.onData(paint);
          bus.addEventListener('date', paint);
        },
      },

      /* ── HISTORIAL ────────────────────────── */
      {
        id: 'historial', title: 'Historial 14 días', icon: 'progreso', glass: 1,
        def: { x: 0.5, y: 0.52, w: 0.48, h: 0.45 },
        mount(body) {
          body.classList.add('fp-vb');
          const paint = async () => {
            const today = M.todayISO();
            const all = ctx.state.days?.length ? ctx.state.days : await ctx.store.allDays();
            const days = all.filter((d) => d.date > M.addDays(today, -14) && d.date <= today && d.checkin);
            if (!days.length) { body.innerHTML = '<div class="fp-empty"><b>Sin check-ins todavía.</b>Completá el de hoy: son 30 segundos.</div>'; return; }
            const ser = (k) => days.map((d) => d.checkin[k]).filter((v) => v != null);
            const sp = (k, label, unit = '', band = null) => {
              const v = ser(k);
              return `<div class="fp-vb-sparkcell"><div class="fp-row fp-row--between"><span class="fp-small">${label}</span><b class="fp-data">${v.length ? fmt(v[v.length - 1], 1) : '—'}${unit}</b></div>${v.length > 1 ? ctx.ui.spark(v, { h: 34, band }) : '<span class="fp-small">—</span>'}</div>`;
            };
            const ps = M.painStreak(all, today);
            body.innerHTML = `
              ${days.some((d) => d.demo) ? `<div class="fp-row">${ctx.ui.demoChip()}<span class="fp-small">Incluye datos de ejemplo.</span></div>` : ''}
              ${ps >= 3 ? `<p class="fp-vb-banner fp-vb-banner--bad">${icon('alert', 16)} Dolor marcado ${ps} días seguidos: bajá carga y consultá.</p>` : ''}
              <div class="fp-vb-sparkgrid">
                ${sp('sleepH', 'Sueño', ' h', [8, 10])}${sp('energy', 'Energía')}${sp('mood', 'Ánimo')}
                ${sp('pump', 'Bombeo')}${sp('fatigue', 'Fatiga')}${sp('weightKg', 'Peso', ' kg')}
              </div>
              <table class="fp-table fp-vb-tight"><thead><tr><th>Día</th><th>Sueño</th><th>Energía</th><th>Dolor</th><th>Grupos</th></tr></thead><tbody>
                ${days.slice(-7).reverse().map((d) => {
                  const c = d.checkin; const p = c.pain?.type && c.pain.type !== 'none' ? `${c.pain.type === 'doms' ? 'agujetas' : 'articular'}${c.pain.zone ? ` · ${esc(c.pain.zone)}` : ''}` : '—';
                  return `<tr><td>${esc(M.fmtDate(d.date))}${d.demo ? ' <span class="fp-vb-dot" title="ejemplo"></span>' : ''}</td><td class="fp-num">${c.sleepH ?? '—'} h</td><td class="fp-num">${c.energy ?? '—'}/5</td><td>${p}</td><td class="fp-small">${(c.groups || []).map((g) => esc(ctx.data.muscleById[g]?.name || g)).join(', ') || '—'}</td></tr>`;
                }).join('')}
              </tbody></table>`;
          };
          paint();
          ctx.onData(paint);
        },
      },
    ];
  },
};
