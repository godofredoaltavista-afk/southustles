// FP · VISTA SESIÓN — el Estudio de Moyon Lab (motion-lab/app/js/ui/studio.js) convertido en sesión guiada.
// Ancla: escenario oscuro con el esqueleto (SkeletonPlayer) del último JSON de Motion Lab de ese ejercicio, o el clip de
// ejemplo, con ángulos en caja negra y etiqueta de fase en naranja. Ventanas: Ejercicios del día · Progreso del
// movimiento (metrónomo 3-1-1 con anillo de fases + LED; WebAudio apagado por defecto + vibración) · Registro de serie
// (guarda en day.sets, «la vez anterior», palanca sugerida) · Descanso (LED) · Bloques (Subidón/Fuerza/Bolsa + Terminar →
// partículas «LISTO») · Cuerpo (ángulos del frame) · Bitácora (mono).
console.log('[fp/view-sesion] init');

const DEF = {
  ejercicios: { x: 0.01, y: 0.02, w: 0.2, h: 0.46 },
  tempo: { x: 0.225, y: 0.02, w: 0.32, h: 0.31 },
  registro: { x: 0.785, y: 0.02, w: 0.205, h: 0.52 },
  descanso: { x: 0.785, y: 0.56, w: 0.205, h: 0.2 },
  cuerpo: { x: 0.785, y: 0.78, w: 0.205, h: 0.2 },
  bloques: { x: 0.01, y: 0.5, w: 0.2, h: 0.24 },
  bitacora: { x: 0.01, y: 0.76, w: 0.2, h: 0.22 },
};
const TEMPOS = ['3-1-1', '4-1-1', '5-2-1', '3-2-1', '2-1-1'];
const PHASES = [
  { k: 'ecc', name: 'excéntrica', hint: 'bajá controlado', col: '#2f7bff' },
  { k: 'iso', name: 'isométrica', hint: 'trabá, sostené', col: '#ffd60a' },
  { k: 'con', name: 'concéntrica', hint: 'subí sin inercia', col: '#ff3b30' },
];

/* estado compartido entre ventanas de la vista */
const S = {
  ex: null, tempo: '3-1-1', running: false, phase: 0, phaseT0: 0, reps: 0, raf: 0,
  sound: false, vibrate: true, audio: null, player: null, restEnd: 0, restRaf: 0, log: [],
  listeners: new Set(),
};
const emit = () => S.listeners.forEach((fn) => { try { fn(); } catch (e) { console.warn(e); } });
// Ajustes (APP-2) emite fp-pref {key:'sound'}: el metrónomo lo respeta en vivo
document.addEventListener('fp-pref', (e) => { if (e.detail?.key === 'sound') { S.sound = !!e.detail.value; emit(); } });

function parseTempo(t) {
  const [e, i, c] = String(t || '3-1-1').split('-').map((x) => Math.max(0, +x || 0));
  return [e || 3, i, c || 1];
}

function beep(freq = 880, ms = 70) {
  if (!S.sound) return;
  try {
    S.audio ||= new (window.AudioContext || window.webkitAudioContext)();
    const a = S.audio, o = a.createOscillator(), g = a.createGain();
    o.frequency.value = freq; o.type = 'sine';
    g.gain.setValueAtTime(0.0001, a.currentTime); g.gain.exponentialRampToValueAtTime(0.18, a.currentTime + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + ms / 1000);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + ms / 1000 + 0.02);
  } catch { /* sin audio */ }
}
const buzz = (ms = 30) => { if (S.vibrate && navigator.vibrate) try { navigator.vibrate(ms); } catch { /* */ } };

function addLog(msg) {
  const d = new Date();
  S.log.unshift(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}  ${msg}`);
  S.log = S.log.slice(0, 60);
  emit();
}

export default {
  id: 'sesion', title: 'Sesión', icon: 'sesion', theme: 'dark', hint: 'Tempo 3-1-1 guiado',

  async anchor(el, ctx) {
    el.classList.add('fp-stage');
    el.innerHTML = `<canvas class="fp-stage__cv" aria-label="Esqueleto de Motion Lab"></canvas>
      <span class="fp-stage__tag fp-data" data-fp-phase-tag>listo · 3-1-1</span>
      <span class="fp-stage__src fp-small" data-fp-stage-src></span>
      <span class="fp-stage__c" aria-hidden="true"><i></i><i></i><i></i><i></i></span>`;
    S.sound = !!ctx.env.LS.get('sound', false);
    S.vibrate = ctx.env.LS.get('vibrate', true) !== false;
    const cv = el.querySelector('canvas');
    const src = el.querySelector('[data-fp-stage-src]');
    let demo = null;
    const pick = async () => {
      const st = ctx.state;
      const mlId = S.ex?.motionLabId;
      let s = mlId ? (st.sessions || []).find((x) => x.exerciseId === mlId) : null;
      let label = s ? `Motion Lab · ${s.exerciseName} · ${String(s.createdAt).slice(0, 10)}${s.demo ? ' · EJEMPLO' : ''}` : '';
      if (!s) {
        if (!demo) { const n = ctx.ml.normalize(await ctx.data.boxer(), 'boxer.json'); demo = n.ok ? n.session : null; }
        s = demo; label = 'clip de ejemplo · boxer.json de Motion Lab — importá tu JSON en Lab';
      }
      if (!s) return;
      src.textContent = label;
      if (!S.player) {
        S.player = new ctx.ml.SkeletonPlayer(cv, s, { angles: true, trail: true, com: true, ink: '#f4f4f4', onFrame: (i, f) => { S.frame = f; } });
        if (!ctx.env.prefersReducedMotion()) S.player.play();
      } else S.player.setSession(s);
    };
    S.listeners.add(() => { if (S._exShown !== S.ex?.id) { S._exShown = S.ex?.id; pick(); } });
    ctx.onData(() => pick());
    await pick();
    // etiqueta de fase
    const tag = el.querySelector('[data-fp-phase-tag]');
    S.listeners.add(() => {
      tag.textContent = S.running ? `${PHASES[S.phase].name} · rep ${S.reps + 1}` : `listo · ${S.tempo}`;
      tag.style.setProperty('--c', S.running ? PHASES[S.phase].col : '');
    });
  },

  onHide() { stopMetronome(); },

  windows(ctx) {
    const { icon, esc, fmt } = ctx.ui;
    const M = ctx.M;
    const today = () => M.todayISO();

    const planItems = () => {
      const pd = M.planFor(today(), ctx.data, ctx.state.profile);
      const pick = ctx.env.LS.get('sesion.day', null);
      const day = pick && ctx.data.dayByKey[pick] ? ctx.data.dayByKey[pick] : pd;
      return { day, items: (day?.items || []).filter((it) => ctx.data.exById[it.ex]) };
    };
    const ensureEx = () => {
      if (S.ex) return;
      const { items } = planItems();
      S.ex = ctx.data.exById[items[0]?.ex] || ctx.data.exById.pullup;
      S.tempo = TEMPOS.includes(S.ex?.tempo) ? S.ex.tempo : '3-1-1';
    };
    ensureEx();
    const setEx = (id) => { S.ex = ctx.data.exById[id]; S.tempo = TEMPOS.includes(S.ex?.tempo) ? S.ex.tempo : '3-1-1'; stopMetronome(); S.reps = 0; addLog(`ejercicio · ${S.ex?.name}`); emit(); };

    return [
      /* ── Ejercicios ── */
      {
        id: 'ejercicios', title: 'Ejercicios', icon: 'dumbbell', def: DEF.ejercicios, glass: 1, minW: 220, minH: 200,
        async mount(body) {
          const paint = () => {
            const st = ctx.state;
            const { day, items } = planItems();
            const d = (st.days || []).find((x) => x.date === today());
            body.innerHTML = `<p class="fp-small">${esc(day?.name || '')} · ${esc(day?.title || 'Libre')}${day?.train === false ? ' (descanso: elegí uno libre)' : ''}</p>
              <div class="fp-exlist">${items.map((it) => { const ex = ctx.data.exById[it.ex]; const done = (d?.sets || []).filter((s) => s.ex === it.ex).length; return `<button type="button" class="fp-exlist__i ${S.ex?.id === ex.id ? 'on' : ''}" data-ex="${ex.id}"><b>${it.pair ? `<em class="fp-data">${it.pair}</em> ` : ''}${esc(ex.name)}</b><small>${it.sets} × ${esc(it.reps)} · tempo ${esc(ex.tempo)}</small><i class="fp-data ${done >= it.sets ? 'ok' : ''}">${done}/${it.sets}</i></button>`; }).join('') || '<p class="fp-small">Hoy no hay ejercicios en el plan.</p>'}</div>
              <label class="fp-field"><span>Otro ejercicio</span><select class="fp-select" data-other><option value="">— elegir —</option>${ctx.data.exercises.filter((e) => e.family !== 'cardio').map((e) => `<option value="${e.id}" ${S.ex?.id === e.id ? 'selected' : ''}>${esc(e.name)}</option>`).join('')}</select></label>
              <label class="fp-field"><span>Día del plan</span><select class="fp-select" data-day>${ctx.data.plan.days.filter((x) => x.train).map((x) => `<option value="${x.key}" ${day?.key === x.key ? 'selected' : ''}>${x.name} · ${esc(x.title)}</option>`).join('')}</select></label>`;
            body.querySelectorAll('[data-ex]').forEach((b) => b.addEventListener('click', () => setEx(b.dataset.ex)));
            body.querySelector('[data-other]').addEventListener('change', (e) => { if (e.target.value) setEx(e.target.value); });
            body.querySelector('[data-day]').addEventListener('change', (e) => { ctx.env.LS.set('sesion.day', e.target.value); S.ex = null; ensureEx(); emit(); });
          };
          paint();
          S.listeners.add(paint);
          ctx.onData(paint);
        },
      },
      /* ── Progreso del movimiento: metrónomo 3-1-1 ── */
      {
        id: 'tempo', title: 'Progreso del movimiento', icon: 'timer', def: DEF.tempo, glass: 2, minW: 300, minH: 200,
        mount(body) {
          body.innerHTML = `<div class="fp-tempo">
              <div class="fp-tempo__ring" data-ring style="--e:60;--i:20;--c:20;--p:0"><i class="fp-tempo__arc"></i><span class="fp-tempo__in"><canvas class="fp-led fp-led--l" data-led-s aria-hidden="true"></canvas><small data-ph>listo</small></span></div>
              <div class="fp-tempo__side">
                <div class="fp-tempo__top"><span class="fp-small">fase</span><b class="fp-tempo__pct fp-data" data-pct>0%</b></div>
                <div class="fp-tempo__bar"><i data-bar></i><u></u><u></u></div>
                <p class="fp-tempo__hint" data-hint>Elegí el tempo y dale play. 3 s bajando · 1 s trabado · 1 s subiendo.</p>
                <div class="fp-row"><span class="fp-small">reps</span><canvas class="fp-led" data-led-r aria-hidden="true"></canvas></div>
                <div class="fp-seg" data-tempos>${TEMPOS.map((t) => `<button type="button" data-v="${t}">${t}</button>`).join('')}</div>
                <div class="fp-row">
                  <button type="button" class="fp-btn fp-btn--accent fp-btn--sm" data-play>${icon('play', 15)}<span>Play</span></button>
                  <button type="button" class="fp-btn fp-btn--sm" data-reset>${icon('reset', 15)}Reps a 0</button>
                  <label class="fp-switch"><input type="checkbox" data-sound ${S.sound ? 'checked' : ''} /><i></i>${icon('sound', 15)}</label>
                  <label class="fp-switch"><input type="checkbox" data-vib ${S.vibrate ? 'checked' : ''} /><i></i>vibrar</label>
                </div>
              </div>
            </div>`;
          const ring = body.querySelector('[data-ring]'), ledS = body.querySelector('[data-led-s]'), ledR = body.querySelector('[data-led-r]');
          const ph = body.querySelector('[data-ph]'), pct = body.querySelector('[data-pct]'), bar = body.querySelector('[data-bar]'), hint = body.querySelector('[data-hint]');
          const seg = ctx.ui.segmented(body.querySelector('[data-tempos]'), S.tempo, (v) => { S.tempo = v; stopMetronome(); addLog(`tempo · ${v}`); emit(); });
          const playBtn = body.querySelector('[data-play]');
          playBtn.addEventListener('click', () => { if (S.running) { stopMetronome(); addLog(`pausa · ${S.reps} reps`); } else { startMetronome(ctx); addLog(`play · ${S.tempo}`); } emit(); });
          body.querySelector('[data-reset]').addEventListener('click', () => { S.reps = 0; emit(); });
          body.querySelector('[data-sound]').addEventListener('change', (e) => { S.sound = e.target.checked; ctx.env.LS.set('sound', S.sound); if (S.sound) beep(660, 60); });
          body.querySelector('[data-vib]').addEventListener('change', (e) => { S.vibrate = e.target.checked; ctx.env.LS.set('vibrate', S.vibrate); });
          const ledO = () => (ctx.theme.isDark() ? { on: ctx.led.accentColor(), glow: 12 } : { ink: true });
          S.paintTempo = (now = performance.now()) => {
            const [e, i, c] = parseTempo(S.tempo); const tot = e + i + c;
            ring.style.setProperty('--e', ((e / tot) * 100).toFixed(2));
            ring.style.setProperty('--i', ((i / tot) * 100).toFixed(2));
            ring.style.setProperty('--c', ((c / tot) * 100).toFixed(2));
            let prog = 0, left = e, p = PHASES[0];
            if (S.running) {
              const dur = [e, i, c][S.phase]; const el = (now - S.phaseT0) / 1000;
              const before = [0, e, e + i][S.phase];
              prog = Math.min(1, (before + Math.min(el, dur)) / tot);
              left = Math.max(0, Math.ceil(dur - el)); p = PHASES[S.phase];
              hint.textContent = `${p.name}: ${p.hint}`;
            }
            ring.style.setProperty('--p', (prog * 100).toFixed(2));
            ring.style.setProperty('--pc', p.col);
            ph.textContent = S.running ? p.name : 'listo';
            pct.textContent = `${Math.round(prog * 100)}%`;
            bar.style.transform = `scaleX(${prog})`;
            bar.style.background = p.col;
            if (left !== S._lastLeft) { S._lastLeft = left; ctx.led.drawLED(ledS, String(left), { ...ledO(), align: 'center' }); }
            if (S.reps !== S._lastReps) { S._lastReps = S.reps; ctx.led.drawLED(ledR, String(S.reps).padStart(2, '0'), ledO()); }
            if (S._lastRunning !== S.running) {
              S._lastRunning = S.running;
              playBtn.innerHTML = `${icon(S.running ? 'pause' : 'play', 15)}<span>${S.running ? 'Pausa' : 'Play'}</span>`;
            }
          };
          const repaint = () => { S._lastLeft = null; S._lastReps = null; S._lastRunning = null; seg.set(S.tempo); S.paintTempo(); };
          requestAnimationFrame(repaint);
          S.listeners.add(() => { seg.set(S.tempo); S.paintTempo(); });
          ctx.theme.onThemeChange(repaint, false);
          new ResizeObserver(repaint).observe(body);
        },
      },
      /* ── Registro de serie ── */
      {
        id: 'registro', title: 'Registro de serie', icon: 'plus', def: DEF.registro, glass: 1, minW: 240, minH: 260,
        mount(body) {
          const paint = () => {
            const ex = S.ex; if (!ex) return;
            const st = ctx.state;
            const d = (st.days || []).find((x) => x.date === today());
            const mine = (d?.sets || []).filter((s) => s.ex === ex.id);
            const prev = M.lastSetsFor(st.days || [], ex.id, today());
            const ceiling = mine.length >= 2 && M.atRepCeiling(mine, ex);
            const prevCeil = prev && M.atRepCeiling(prev.sets, ex);
            const unit = ex.unit === 's' ? 's' : 'reps';
            body.innerHTML = `<div class="fp-reg">
                <p class="fp-reg__ex"><b>${esc(ex.name)}</b><small>${ex.repRange ? `${ex.repRange[0]}–${ex.repRange[1]} ${unit}` : ''} · RIR ${ex.rir?.join('–') || '1–2'} · tempo ${esc(ex.tempo)}</small></p>
                <ul class="fp-reg__cues">${(ex.cues || []).slice(0, 3).map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
                <form class="fp-form-grid fp-reg__form" data-form>
                  <label class="fp-field"><span>${unit === 's' ? 'Segundos' : 'Reps'}</span><input class="fp-input" type="number" name="reps" min="0" max="300" value="${S.reps || ex.repRange?.[0] || 8}" required /></label>
                  <label class="fp-field"><span>Carga (kg)</span><input class="fp-input" type="number" name="loadKg" min="0" max="60" step="0.5" value="${mine.at(-1)?.loadKg ?? prev?.sets?.at(-1)?.loadKg ?? 0}" /></label>
                  <label class="fp-field"><span>Tempo</span><input class="fp-input fp-data" name="tempo" value="${esc(S.tempo)}" pattern="[0-9]-[0-9]-[0-9]" /></label>
                  <label class="fp-field"><span>Palanca</span><select class="fp-select" name="lever"><option value="">ninguna</option>${(ex.progressions || []).map((p) => `<option>${esc(p)}</option>`).join('')}</select></label>
                  <div class="fp-field fp-reg__rir"><span>RIR (reps en reserva)</span><div class="fp-seg" data-rir>${[0, 1, 2, 3, 4].map((r) => `<button type="button" data-v="${r}">${r}</button>`).join('')}</div></div>
                  <button class="fp-btn fp-btn--accent fp-reg__save" type="submit">${icon('check', 16)}Guardar serie ${mine.length + 1}</button>
                </form>
                <div class="fp-reg__sets">${mine.length ? mine.map((s, k) => `<span class="fp-chip"><b class="fp-data">${k + 1}</b> ${s.reps}${unit === 's' ? ' s' : ''}${s.loadKg ? ` · ${fmt(s.loadKg)} kg` : ''} · RIR ${s.rir ?? '—'}</span>`).join('') : '<span class="fp-small">Todavía no guardaste series de este ejercicio hoy.</span>'}</div>
                <div class="fp-reg__prev">${prev ? `<small>La vez anterior (${M.fmtDate(prev.date)}${(st.days || []).find((x) => x.date === prev.date)?.demo ? ' · EJEMPLO' : ''}):</small> <span class="fp-data">${prev.sets.map((s) => s.reps).join(' · ')} ${unit}${prev.sets[0].loadKg ? ` @ ${fmt(prev.sets[0].loadKg)} kg` : ''}</span>` : '<small>Primera vez que registrás este ejercicio.</small>'}</div>
                ${ceiling || prevCeil ? `<p class="fp-reg__lever">${icon('up', 15)} Llegaste al techo (${ex.repRange?.[1]}) en todas las series. Siguiente palanca: <b>${esc(ex.progressions?.[0] || 'bajada más lenta (4–5 s)')}</b>.</p>` : ''}
              </div>`;
            let rir = mine.at(-1)?.rir ?? 2;
            ctx.ui.segmented(body.querySelector('[data-rir]'), rir, (v) => { rir = +v; });
            body.querySelector('[data-form]').addEventListener('submit', async (e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const set = { id: ctx.env.uid('set'), ex: ex.id, reps: +fd.get('reps'), loadKg: +fd.get('loadKg') || 0, rir, tempo: String(fd.get('tempo') || S.tempo), lever: fd.get('lever') || null, restS: S.restPreset || 90, ts: new Date().toISOString() };
              await ctx.store.updateDay(today(), (day) => { day.sets = [...(day.sets || []), set]; day.blocks = { ...day.blocks, fuerza: true }; });
              addLog(`serie · ${ex.name} · ${set.reps}${unit === 's' ? ' s' : ''}${set.loadKg ? ` @ ${set.loadKg} kg` : ''} · RIR ${rir}`);
              ctx.ui.toast(`Serie ${mine.length + 1} guardada.`, 'ok');
              S.reps = 0; stopMetronome();
              startRest(ctx, S.restPreset || 90);
              emit();
            });
          };
          paint();
          S.listeners.add(() => { if (S._regEx !== S.ex?.id || !S.running) { S._regEx = S.ex?.id; if (!body.contains(document.activeElement)) paint(); } });
          ctx.onData(() => { if (!body.contains(document.activeElement)) paint(); });
        },
      },
      /* ── Descanso ── */
      {
        id: 'descanso', title: 'Descanso', icon: 'timer', def: DEF.descanso, glass: 1, minW: 220, minH: 150,
        mount(body) {
          body.innerHTML = `<div class="fp-rest"><canvas class="fp-led fp-led--l" data-led aria-label="Descanso"></canvas>
              <div class="fp-seg" data-presets>${[60, 90, 120, 180].map((s) => `<button type="button" data-v="${s}">${s}s</button>`).join('')}</div>
              <div class="fp-row"><button type="button" class="fp-btn fp-btn--sm" data-go>${icon('play', 14)}Empezar</button><button type="button" class="fp-btn fp-btn--sm" data-stop>${icon('pause', 14)}Parar</button></div>
              <p class="fp-small">60–90 s en compuestos · 45–60 s en aislados.</p></div>`;
          S.restPreset = S.restPreset || 90;
          ctx.ui.segmented(body.querySelector('[data-presets]'), S.restPreset, (v) => { S.restPreset = +v; });
          body.querySelector('[data-go]').addEventListener('click', () => startRest(ctx, S.restPreset));
          body.querySelector('[data-stop]').addEventListener('click', () => { S.restEnd = 0; S.paintRest?.(); });
          const led = body.querySelector('[data-led]');
          S.paintRest = () => {
            const left = S.restEnd ? Math.max(0, Math.ceil((S.restEnd - performance.now()) / 1000)) : 0;
            const txt = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
            ctx.led.drawLED(led, txt, ctx.theme.isDark() ? { on: left && left <= 5 ? '#ff3b30' : ctx.led.accentColor(), glow: 12, align: 'center' } : { ink: true, align: 'center' });
          };
          requestAnimationFrame(() => S.paintRest());
          ctx.theme.onThemeChange(() => S.paintRest(), false);
        },
      },
      /* ── Bloques de la sesión ── */
      {
        id: 'bloques', title: 'Bloques', icon: 'layers', def: DEF.bloques, glass: 1, minW: 220, minH: 170,
        mount(body) {
          const paint = () => {
            const d = (ctx.state.days || []).find((x) => x.date === today());
            const b = d?.blocks || {};
            body.innerHTML = `<div class="fp-stack">${ctx.data.plan.blocks.map((x) => `<label class="fp-check"><input type="checkbox" data-b="${x.id}" ${b[x.id] ? 'checked' : ''} /><span class="fp-check__box"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></svg></span><span class="fp-check__t">${esc(x.name)}</span><span class="fp-check__s">${x.min[0]}–${x.min[1]}′</span></label>`).join('')}
              <button type="button" class="fp-btn fp-btn--action fp-btn--primary" data-end>TERMINAR</button></div>`;
            body.querySelectorAll('[data-b]').forEach((cb) => cb.addEventListener('change', () => ctx.store.updateDay(today(), (day) => { day.blocks = { ...day.blocks, [cb.dataset.b]: cb.checked }; }).then(() => addLog(`${cb.dataset.b} · ${cb.checked ? 'hecho' : 'pendiente'}`))));
            body.querySelector('[data-end]').addEventListener('click', async () => {
              stopMetronome();
              await ctx.store.updateDay(today(), (day) => { day.blocks = { ...day.blocks, fuerza: true }; day.checkin = { ...(day.checkin || {}), trained: true }; });
              addLog('sesión terminada');
              ctx.particleWord('LISTO');
              ctx.ui.toast('Sesión cerrada. Ahora a comer y dormir duro.', 'ok');
            });
          };
          paint();
          ctx.onData(paint);
        },
      },
      /* ── Cuerpo: ángulos del frame actual (tarjetas del Estudio) ── */
      {
        id: 'cuerpo', title: 'Cuerpo', icon: 'lab', def: DEF.cuerpo, glass: 2, minW: 200, minH: 130,
        mount(body) {
          body.innerHTML = '<div class="fp-body-cards" data-cards></div>';
          const box = body.querySelector('[data-cards]');
          let last = 0, raf = 0, vis = false;
          const tick = (now) => {
            raf = 0;
            if (!vis) return;
            if (now - last > 160 && S.frame) {
              last = now;
              const a = ctx.ml.anglesOf(S.frame);
              const row = (k, label, side) => `<div class="fp-bc fp-bc--${side}"><small>${label}</small><b class="fp-data">${a[k] != null ? `${Math.round(a[k])}°` : '—'}</b></div>`;
              box.innerHTML = row('codo_izq', 'codo izq', 'l') + row('codo_der', 'codo der', 'r') + row('rodilla_izq', 'rodilla izq', 'l') + row('rodilla_der', 'rodilla der', 'r');
            }
            raf = requestAnimationFrame(tick);
          };
          ctx.env.onVisible(body, (v) => { vis = v; if (v && !raf) raf = requestAnimationFrame(tick); }, { threshold: 0 });
        },
      },
      /* ── Bitácora ── */
      {
        id: 'bitacora', title: 'Bitácora', icon: 'file', def: DEF.bitacora, glass: 2, minW: 200, minH: 120,
        mount(body) {
          const paint = () => { body.innerHTML = `<ol class="fp-log">${S.log.length ? S.log.map((l) => `<li>${esc(l)}</li>`).join('') : '<li>— la bitácora arranca cuando das play o guardás una serie —</li>'}</ol>`; };
          paint();
          S.listeners.add(paint);
        },
      },
    ];
  },
};

/* ── metrónomo ── */
function startMetronome(ctx) {
  if (S.running) return;
  S.running = true; S.phase = 0; S.phaseT0 = performance.now();
  beep(990, 80); buzz(40);
  const loop = (now) => {
    if (!S.running) return;
    const durs = parseTempo(S.tempo);
    const el = (now - S.phaseT0) / 1000;
    if (el >= durs[S.phase]) {
      S.phase++;
      if (S.phase > 2) { S.phase = 0; S.reps++; beep(1320, 90); buzz(60); }
      else beep([990, 660, 880][S.phase], 70), buzz(25);
      if (durs[S.phase] === 0) S.phase = (S.phase + 1) % 3;
      S.phaseT0 = now;
      emit();
    }
    S.paintTempo?.(now);
    S.raf = requestAnimationFrame(loop);
  };
  S.raf = requestAnimationFrame(loop);
  emit();
}
function stopMetronome() {
  if (!S.running) return;
  S.running = false;
  cancelAnimationFrame(S.raf);
  S.paintTempo?.();
}
function startRest(ctx, secs) {
  S.restEnd = performance.now() + secs * 1000;
  cancelAnimationFrame(S.restRaf);
  let lastS = -1;
  const loop = (now) => {
    const left = Math.max(0, Math.ceil((S.restEnd - now) / 1000));
    if (left !== lastS) { lastS = left; S.paintRest?.(); if (left > 0 && left <= 3) beep(740, 50); }
    if (!S.restEnd) return;
    if (left <= 0) { S.restEnd = 0; S.paintRest?.(); beep(1320, 160); buzz(120); ctx.ui.toast('Descanso terminado: siguiente serie.', 'info'); return; }
    S.restRaf = requestAnimationFrame(loop);
  };
  S.restRaf = requestAnimationFrame(loop);
}
