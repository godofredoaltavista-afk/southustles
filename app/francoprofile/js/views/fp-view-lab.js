// FP · VISTA LAB — el Estudio/Reproductor de Moyon Lab (motion-lab/app/js/ui/studio.js) sobre el JSON que exporta Motion Lab.
// Importa los dos formatos reales (session.json y boxer.json) con ctx.ml.readFile/normalize — nada sale del dispositivo.
// Ancla: escenario negro con el esqueleto grande (colores FreeMoCap, ángulos en caja negra, estela, centro de masa).
// Ventanas: Importar · Sesiones · Grabación (timeline naranja, play/pausa/velocidad, toggles) · Señales (extensión del
// brazo y rodillas izq azul / der roja, con cursor) · Equilibrio (peso izq ↔ der) · Conteo (LED + jab/cruzado) ·
// Métricas (ROM, simetría, tempo — todo «estimado») + «vs tu sesión anterior» · Cuerpo (ángulos del frame) · Bitácora.
console.log('[fp/view-lab] init');

const DEF = {
  importar: { x: 0.01, y: 0.02, w: 0.2, h: 0.27 },
  sesiones: { x: 0.01, y: 0.31, w: 0.2, h: 0.4 },
  bitacora: { x: 0.01, y: 0.73, w: 0.2, h: 0.25 },
  senales: { x: 0.225, y: 0.02, w: 0.27, h: 0.3 },
  conteo: { x: 0.785, y: 0.02, w: 0.205, h: 0.3 },
  metricas: { x: 0.785, y: 0.34, w: 0.205, h: 0.33 },
  cuerpo: { x: 0.785, y: 0.69, w: 0.205, h: 0.29 },
  equilibrio: { x: 0.225, y: 0.64, w: 0.545, h: 0.14 },
  grabacion: { x: 0.225, y: 0.8, w: 0.545, h: 0.18 },
};

const L = { sel: null, s: null, m: null, player: null, frameI: 0, listeners: new Set(), frameListeners: new Set(), events: [] };
const emit = () => L.listeners.forEach((f) => { try { f(); } catch (e) { console.warn(e); } });
const emitFrame = () => L.frameListeners.forEach((f) => { try { f(); } catch (e) { console.warn(e); } });

const fmtT = (ms) => { const s = Math.max(0, ms) / 1000; return `${String(Math.floor(s / 60)).padStart(2, '0')}:${(s % 60).toFixed(1).padStart(4, '0')}`; };

function balanceOf(f, J) {
  const lh = f.pts[J.l_hip], rh = f.pts[J.r_hip], la = f.pts[J.l_ankle], ra = f.pts[J.r_ankle];
  const hx = (lh[0] + rh[0]) / 2; const d = ra[0] - la[0];
  if (Math.abs(d) < 1e-4) return 0.5;
  return Math.max(0, Math.min(1, (hx - la[0]) / d)); // 0 = sobre el tobillo izq · 1 = sobre el der
}

/** Eventos de la bitácora: cambios de lado del peso + golpes (picos de extensión). */
function buildEvents(s, ctx) {
  const J = ctx.ml.J; const F = s.frames; const fps = s.fps || 30; const ev = [];
  let side = null;
  for (let i = 0; i < F.length; i += Math.max(1, Math.round(fps / 4))) {
    const b = balanceOf(F[i], J);
    const now = b < 0.4 ? 'izquierda' : b > 0.6 ? 'derecha' : 'centrado';
    if (now !== side) { side = now; ev.push({ t: F[i].tMs - F[0].tMs, msg: now === 'centrado' ? 'peso centrado' : `peso a la ${now}` }); }
  }
  const ext = (sd) => F.map((f) => { const sh = f.pts[J[`${sd}_shoulder`]], wr = f.pts[J[`${sd}_wrist`]], w = Math.hypot(f.pts[J.l_shoulder][0] - f.pts[J.r_shoulder][0], f.pts[J.l_shoulder][1] - f.pts[J.r_shoulder][1]) || 1; return Math.hypot(sh[0] - wr[0], sh[1] - wr[1]) / w; });
  for (const sd of ['l', 'r']) {
    const e = ext(sd); const mx = Math.max(...e), mn = Math.min(...e), thr = mn + (mx - mn) * 0.72; let last = -1e9;
    for (let i = 1; i < e.length - 1; i++) if (e[i] > thr && e[i] >= e[i - 1] && e[i] >= e[i + 1] && i - last >= fps * 0.25) { last = i; ev.push({ t: F[i].tMs - F[0].tMs, msg: sd === 'l' ? 'golpe izq (jab)' : 'golpe der (cruzado)', side: sd }); }
  }
  return ev.sort((a, b) => a.t - b.t);
}

async function select(ctx, id) {
  const st = ctx.state;
  const s = (st.sessions || []).find((x) => x.id === id) || (await ctx.store.getSession(id));
  if (!s) return;
  L.sel = id; L.s = s;
  try { L.m = ctx.ml.metrics(s); } catch (e) { console.warn('[fp/view-lab] métricas', e); L.m = null; }
  L.events = buildEvents(s, ctx);
  L.frameI = 0;
  if (L.player) { L.player.setSession(s); if (!ctx.env.prefersReducedMotion()) L.player.play(); }
  ctx.env.LS.set('lab.sel', id);
  emit();
}

async function ensureDemo(ctx) {
  const st = await ctx.load();
  const existing = (st.sessions || []).find((s) => s.id === 'demo-boxer' || s.id === 'clip-boxer-demo');
  if (existing) return existing.id;
  const n = ctx.ml.normalize(await ctx.data.boxer(), 'boxer.json');
  if (!n.ok) return null;
  n.session.id = 'clip-boxer-demo'; n.session.demo = true;
  await ctx.store.putSession(n.session);
  return n.session.id;
}

export default {
  id: 'lab', title: 'Lab', icon: 'lab', theme: 'dark', hint: 'Motion Lab: esqueleto y métricas',

  async anchor(el, ctx) {
    el.classList.add('fp-stage', 'fp-stage--lab');
    el.innerHTML = `<canvas class="fp-stage__cv" aria-label="Reproductor de esqueleto"></canvas>
      <span class="fp-stage__tag fp-data" data-tag>sin sesión</span>
      <span class="fp-stage__src fp-small" data-src>Importá un JSON de Motion Lab o cargá el demo.</span>
      <div class="fp-stage__prog"><small>Progreso del movimiento</small><b class="fp-data" data-pct>0%</b><span class="fp-stage__bar"><i data-bar></i></span></div>
      <span class="fp-stage__c" aria-hidden="true"><i></i><i></i><i></i><i></i></span>`;
    const cv = el.querySelector('canvas');
    const tag = el.querySelector('[data-tag]'), src = el.querySelector('[data-src]'), pct = el.querySelector('[data-pct]'), bar = el.querySelector('[data-bar]');
    let lastPaint = 0;
    const onFrame = (i) => {
      L.frameI = i;
      const now = performance.now();
      if (now - lastPaint < 90) return;
      lastPaint = now;
      const n = L.s?.frames.length || 1;
      const p = i / Math.max(1, n - 1);
      pct.textContent = `${Math.round(p * 100)}%`;
      bar.style.transform = `scaleX(${p})`;
      emitFrame();
    };
    const paintHead = () => {
      if (!L.s) { tag.textContent = 'sin sesión'; src.textContent = 'Importá un JSON de Motion Lab o cargá el demo.'; return; }
      tag.textContent = `${L.s.exerciseName} · ${L.s.fps} fps`;
      src.textContent = `${L.s.source === 'clip' ? 'clip' : 'sesión'} · ${L.s.filename || ''} · ${L.s.frames.length} frames · ${(L.s.durationMs / 1000).toFixed(1)} s${L.s.demo ? ' · EJEMPLO' : ''}`;
    };
    L.listeners.add(paintHead);
    // primera sesión
    const st = await ctx.load();
    const saved = ctx.env.LS.get('lab.sel', null);
    const first = (st.sessions || []).find((s) => s.id === saved) || (st.sessions || [])[0];
    if (first) {
      L.s = first; L.sel = first.id;
      try { L.m = ctx.ml.metrics(first); } catch { L.m = null; }
      L.events = buildEvents(first, ctx);
    }
    if (L.s) {
      L.player = new ctx.ml.SkeletonPlayer(cv, L.s, { angles: true, trail: true, com: true, ink: '#f4f4f4', onFrame });
      if (!ctx.env.prefersReducedMotion()) L.player.play();
    } else {
      L.listeners.add(() => {
        if (!L.player && L.s) { L.player = new ctx.ml.SkeletonPlayer(cv, L.s, { angles: true, trail: true, com: true, ink: '#f4f4f4', onFrame }); if (!ctx.env.prefersReducedMotion()) L.player.play(); }
      });
    }
    paintHead();
  },

  onHide() { L.player?.pause(); },
  onShow(ctx) { if (L.player && !ctx.env.prefersReducedMotion() && L._wasPlaying !== false) L.player.play(); },

  windows(ctx) {
    const { icon, esc, fmt } = ctx.ui;

    return [
      /* ── Importar ── */
      {
        id: 'importar', title: 'Importar JSON', icon: 'upload', def: DEF.importar, glass: 1, minW: 220, minH: 170,
        mount(body) {
          body.innerHTML = `<label class="fp-drop" data-drop tabindex="0">${icon('upload', 26)}<b>Soltá el JSON de Motion Lab</b><span>session.json o boxer.json · nada sale de tu compu</span><input type="file" accept=".json,application/json" hidden data-file /></label>
            <div class="fp-row"><button type="button" class="fp-btn fp-btn--sm" data-demo>${icon('play', 14)}Cargar demo boxer.json</button></div>
            <p class="fp-small" data-msg></p>`;
          const drop = body.querySelector('[data-drop]'), file = body.querySelector('[data-file]'), msg = body.querySelector('[data-msg]');
          const handle = async (f) => {
            if (!f) return;
            msg.textContent = `Leyendo ${f.name}…`;
            const r = await ctx.ml.readFile(f);
            if (!r.ok) { msg.textContent = r.error; ctx.ui.toast(r.error, 'bad', 5000); return; }
            await ctx.store.putSession(r.session);
            await ctx.load();
            await select(ctx, r.session.id);
            msg.textContent = `Listo: ${r.session.exerciseName} · ${r.session.frames.length} frames.${r.warnings.length ? ` Ojo: ${r.warnings.join(' ')}` : ''}`;
            ctx.ui.toast('Sesión importada al vault local.', 'ok');
          };
          drop.addEventListener('click', (e) => { if (e.target !== file) file.click(); });
          drop.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); file.click(); } });
          file.addEventListener('change', () => handle(file.files[0]));
          ['dragenter', 'dragover'].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add('is-over'); }));
          ['dragleave', 'drop'].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.remove('is-over'); }));
          drop.addEventListener('drop', (e) => handle(e.dataTransfer.files[0]));
          body.querySelector('[data-demo]').addEventListener('click', async () => { const id = await ensureDemo(ctx); if (id) { await ctx.load(); await select(ctx, id); ctx.ui.toast('Demo de Motion Lab cargado (EJEMPLO).', 'ok'); } });
        },
      },
      /* ── Sesiones ── */
      {
        id: 'sesiones', title: 'Sesiones', icon: 'layers', def: DEF.sesiones, glass: 1, minW: 220, minH: 180,
        mount(body) {
          const paint = () => {
            const ss = ctx.state.sessions || [];
            body.innerHTML = ss.length ? `<ul class="fp-sess">${ss.map((s) => `<li class="${s.id === L.sel ? 'on' : ''}"><button type="button" class="fp-sess__i" data-id="${esc(s.id)}"><b>${esc(s.exerciseName)}</b><small class="fp-data">${esc(String(s.createdAt).slice(0, 16).replace('T', ' '))} · ${(s.durationMs / 1000).toFixed(1)} s${s.kpi ? ` · ${s.kpi.value} ${esc(s.kpi.unit)}` : ''}</small>${s.demo ? ctx.ui.demoChip() : ''}</button><button type="button" class="fp-sess__del" data-del="${esc(s.id)}" aria-label="Borrar sesión">${icon('trash', 14)}</button></li>`).join('')}</ul>`
              : `<div class="fp-empty"><b>Sin sesiones todavía.</b><span>Grabá en Motion Lab, exportá el JSON y soltalo arriba.</span></div>`;
            body.querySelectorAll('[data-id]').forEach((b) => b.addEventListener('click', () => select(ctx, b.dataset.id)));
            body.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', async () => {
              if (!confirm('¿Borrar esta sesión del vault local?')) return;
              await ctx.store.deleteSession(b.dataset.del);
              if (L.sel === b.dataset.del) { L.sel = null; L.s = null; L.m = null; }
              ctx.ui.toast('Sesión borrada.', 'ok');
            }));
          };
          paint();
          L.listeners.add(paint);
          ctx.onData(async () => { await ctx.load(); paint(); });
        },
      },
      /* ── Grabación / transporte ── */
      {
        id: 'grabacion', title: 'Grabación', icon: 'sesion', def: DEF.grabacion, glass: 1, minW: 360, minH: 120,
        mount(body) {
          body.innerHTML = `<div class="fp-transport">
              <button type="button" class="fp-icon-btn" data-first aria-label="Al principio">${icon('reset', 16)}</button>
              <button type="button" class="fp-icon-btn fp-transport__play" data-play aria-label="Play / pausa">${icon('pause', 16)}</button>
              <div class="fp-transport__line"><input type="range" min="0" max="1000" value="0" data-seek aria-label="Posición" /><span class="fp-transport__marks" data-marks></span></div>
              <span class="fp-transport__time fp-data" data-time>00:00.0 / 00:00.0</span>
            </div>
            <div class="fp-row fp-transport__opts">
              <div class="fp-seg" data-speed><button type="button" data-v="0.25">0,25×</button><button type="button" data-v="0.5">0,5×</button><button type="button" data-v="1">1×</button><button type="button" data-v="1.5">1,5×</button></div>
              <label class="fp-switch"><input type="checkbox" data-o="trail" checked /><i></i>estela</label>
              <label class="fp-switch"><input type="checkbox" data-o="angles" checked /><i></i>ángulos</label>
              <label class="fp-switch"><input type="checkbox" data-o="com" checked /><i></i>centro de masa</label>
            </div>`;
          const seek = body.querySelector('[data-seek]'), time = body.querySelector('[data-time]'), play = body.querySelector('[data-play]'), marks = body.querySelector('[data-marks]');
          let dragging = false;
          seek.addEventListener('input', () => { dragging = true; L.player?.seek(+seek.value / 1000); });
          seek.addEventListener('change', () => { dragging = false; });
          play.addEventListener('click', () => { if (!L.player) return; const on = L.player.toggle(); L._wasPlaying = on; play.innerHTML = icon(on ? 'pause' : 'play', 16); });
          body.querySelector('[data-first]').addEventListener('click', () => L.player?.seek(0));
          ctx.ui.segmented(body.querySelector('[data-speed]'), '1', (v) => { if (L.player) L.player.o.speed = +v; });
          body.querySelectorAll('[data-o]').forEach((cb) => cb.addEventListener('change', () => { if (L.player) { L.player.o[cb.dataset.o] = cb.checked; L.player.draw(); } }));
          const paintMarks = () => {
            if (!L.s) { marks.innerHTML = ''; return; }
            const dur = L.s.durationMs || 1;
            marks.innerHTML = L.events.filter((e) => e.side).map((e) => `<i class="m-${e.side}" style="left:${((e.t / dur) * 100).toFixed(2)}%"></i>`).join('');
          };
          L.listeners.add(paintMarks);
          paintMarks();
          L.frameListeners.add(() => {
            if (!L.s) return;
            const F = L.s.frames; const i = L.frameI;
            if (!dragging) seek.value = String(Math.round((i / Math.max(1, F.length - 1)) * 1000));
            time.textContent = `${fmtT(F[i].tMs - F[0].tMs)} / ${fmtT(L.s.durationMs)}`;
          });
        },
      },
      /* ── Señales ── */
      {
        id: 'senales', title: 'Señales · codos y rodillas', icon: 'checkin', def: DEF.senales, glass: 2, minW: 260, minH: 170,
        mount(body) {
          const paint = () => {
            if (!L.m) { body.innerHTML = '<p class="fp-small">Elegí una sesión para ver las señales.</p>'; return; }
            const A = L.m.angles; const n = A.length;
            const line = (k, w = 240, h = 60) => {
              const v = A.map((a) => a[k]);
              const pts = v.map((y, i) => (y == null ? null : `${((i / Math.max(1, n - 1)) * w).toFixed(1)},${(h - (y / 180) * h).toFixed(1)}`)).filter(Boolean);
              return pts.join(' ');
            };
            const cur = (a) => (a == null ? '—' : `${Math.round(a)}°`);
            body.innerHTML = `<div class="fp-sig">
                <div class="fp-sig__h"><small>extensión del brazo</small><span class="fp-sig__lg"><i style="--c:var(--fp-skel-l)"></i>codo izq <b data-v="codo_izq">—</b> <i style="--c:var(--fp-skel-r)"></i>codo der <b data-v="codo_der">—</b></span></div>
                <svg viewBox="0 0 240 60" preserveAspectRatio="none" class="fp-sig__svg"><polyline points="${line('codo_izq')}" style="stroke:var(--fp-skel-l)"/><polyline points="${line('codo_der')}" style="stroke:var(--fp-skel-r)"/><line data-cur x1="0" x2="0" y1="0" y2="60"/></svg>
                <div class="fp-sig__h"><small>piernas · rodillas</small><span class="fp-sig__lg"><i style="--c:var(--fp-skel-l)"></i>izq <b data-v="rodilla_izq">—</b> <i style="--c:var(--fp-skel-r)"></i>der <b data-v="rodilla_der">—</b></span></div>
                <svg viewBox="0 0 240 60" preserveAspectRatio="none" class="fp-sig__svg"><polyline points="${line('rodilla_izq')}" style="stroke:var(--fp-skel-l)"/><polyline points="${line('rodilla_der')}" style="stroke:var(--fp-skel-r)"/><line data-cur x1="0" x2="0" y1="0" y2="60"/></svg>
              </div>`;
            body._cur = [...body.querySelectorAll('[data-cur]')];
            body._vals = [...body.querySelectorAll('[data-v]')];
            body._fmt = cur;
          };
          paint();
          L.listeners.add(paint);
          L.frameListeners.add(() => {
            if (!L.m || !body._cur) return;
            const n = L.m.angles.length; const x = ((L.frameI / Math.max(1, n - 1)) * 240).toFixed(1);
            body._cur.forEach((l) => { l.setAttribute('x1', x); l.setAttribute('x2', x); });
            const a = L.m.angles[L.frameI] || {};
            body._vals.forEach((b) => { b.textContent = body._fmt(a[b.dataset.v]); });
          });
        },
      },
      /* ── Equilibrio ── */
      {
        id: 'equilibrio', title: 'Equilibrio · peso izq ↔ der', icon: 'scale', def: DEF.equilibrio, glass: 2, minW: 320, minH: 100,
        mount(body) {
          body.innerHTML = `<div class="fp-bal"><div class="fp-bal__side fp-bal__side--l"><b class="fp-data" data-l>—</b><small>peso izq</small></div>
              <div class="fp-bal__bar"><i data-fill></i><u data-knob></u></div>
              <div class="fp-bal__side fp-bal__side--r"><b class="fp-data" data-r>—</b><small>peso der</small></div></div>
            <p class="fp-small fp-bal__note" data-note>estimado: centro de cadera vs tobillos</p>`;
          const l = body.querySelector('[data-l]'), r = body.querySelector('[data-r]'), fill = body.querySelector('[data-fill]'), knob = body.querySelector('[data-knob]'), note = body.querySelector('[data-note]');
          const paint = () => {
            if (!L.s) return;
            const b = balanceOf(L.s.frames[L.frameI] || L.s.frames[0], ctx.ml.J);
            const left = Math.round((1 - b) * 100);
            l.textContent = `${left}%`; r.textContent = `${100 - left}%`;
            fill.style.transform = `scaleX(${(1 - b).toFixed(3)})`;
            knob.style.left = `${((1 - b) * 100).toFixed(1)}%`;
            if (L.m) note.textContent = `promedio de la sesión: ${L.m.balance.leftPct}% izq · ${L.m.balance.rightPct}% der · balanceo ${L.m.balance.swayX} (estimado)`;
          };
          L.frameListeners.add(paint);
          L.listeners.add(paint);
          paint();
        },
      },
      /* ── Conteo ── */
      {
        id: 'conteo', title: 'Conteo', icon: 'target', def: DEF.conteo, glass: 1, minW: 220, minH: 180,
        mount(body) {
          const paint = () => {
            if (!L.s || !L.m) { body.innerHTML = '<p class="fp-small">Sin sesión.</p>'; return; }
            const box = /boxing|shadow|free/.test(L.s.exerciseId) || L.s.source === 'clip';
            const main = L.s.kpi ? L.s.kpi : box ? { unit: 'golpes', value: L.m.punches.total } : { unit: 'reps', value: L.m.reps };
            const mx = Math.max(1, L.m.punches.l, L.m.punches.r);
            body.innerHTML = `<div class="fp-count"><p class="fp-count__name">${esc(L.s.exerciseName)}</p>
                <div class="fp-row"><canvas class="fp-led fp-led--xl" data-led aria-label="${main.value} ${esc(main.unit)}"></canvas><small>${esc(main.unit)}${L.s.kpi ? '' : ' · estimado'}</small></div>
                ${box ? `<div class="fp-count__acts"><div><small>jab (izq)</small><div class="fp-bar" style="--v:${(L.m.punches.l / mx) * 100}"><i style="background:var(--fp-skel-l)"></i></div><b class="fp-data">${L.m.punches.l}</b></div><div><small>cruzado (der)</small><div class="fp-bar" style="--v:${(L.m.punches.r / mx) * 100}"><i style="background:var(--fp-skel-r)"></i></div><b class="fp-data">${L.m.punches.r}</b></div></div>` : ''}
                ${L.m.reps ? `<p class="fp-small">Tempo estimado: <b class="fp-data">${L.m.tempo.eccS ?? '—'}-${L.m.tempo.pauseS ?? '—'}-${L.m.tempo.conS ?? '—'} s</b> (excéntrica-pausa-concéntrica)</p>` : ''}
              </div>`;
            requestAnimationFrame(() => ctx.led.drawLED(body.querySelector('[data-led]'), String(main.value ?? 0).padStart(2, '0'), ctx.theme.isDark() ? { on: ctx.led.accentColor(), glow: 12 } : { ink: true }));
          };
          paint();
          L.listeners.add(paint);
          ctx.theme.onThemeChange(paint, false);
        },
      },
      /* ── Métricas + vs anterior ── */
      {
        id: 'metricas', title: 'Métricas · estimado', icon: 'progreso', def: DEF.metricas, glass: 1, minW: 220, minH: 200,
        mount(body) {
          const paint = () => {
            if (!L.s || !L.m) { body.innerHTML = '<p class="fp-small">Sin sesión.</p>'; return; }
            const m = L.m;
            const vs = ctx.ml.vsPrevious(ctx.state.sessions || [], L.s);
            const sym = (v) => (v == null ? '—' : `${v}%`);
            body.innerHTML = `<dl class="fp-kv fp-kv--tight">
                <div><dt>Duración</dt><dd class="fp-data">${m.durationS} s · ${m.frames} frames · ${m.fps} fps</dd></div>
                <div><dt>ROM codo</dt><dd class="fp-data">izq ${m.romL.codo ?? '—'}° · der ${m.romR.codo ?? '—'}°</dd></div>
                <div><dt>ROM rodilla</dt><dd class="fp-data">izq ${m.romL.rodilla ?? '—'}° · der ${m.romR.rodilla ?? '—'}°</dd></div>
                <div><dt>ROM hombro</dt><dd class="fp-data">izq ${m.romL.hombro ?? '—'}° · der ${m.romR.hombro ?? '—'}°</dd></div>
                <div><dt>Simetría L/R</dt><dd class="fp-data">${sym(m.symmetryPct)} <small>(codo ${sym(m.symmetry.codo)} · rodilla ${sym(m.symmetry.rodilla)})</small></dd></div>
                ${m.reps ? `<div><dt>Reps</dt><dd class="fp-data">${m.reps}</dd></div>` : ''}
              </dl>
              <div class="fp-vsprev">${vs && vs.delta != null ? `<div class="fp-vsprev__top"><small>vs tu sesión anterior (${vs.b} ${esc(vs.unit)})</small><b class="${vs.delta > 0 ? 'up' : vs.delta < 0 ? 'down' : ''}">${vs.delta > 0 ? '+' : ''}${vs.delta}%</b></div><div class="fp-vsprev__bar"><i style="--w:${Math.max(4, Math.min(100, (vs.a / Math.max(vs.a, vs.b, 1e-6)) * 100))}%"></i><u style="left:${Math.min(100, (vs.b / Math.max(vs.a, vs.b, 1e-6)) * 100)}%"></u></div>` : `<small>${vs ? 'sin métrica comparable con la anterior' : 'primera sesión de este ejercicio'}</small>`}</div>
              <p class="fp-small">Estimaciones a partir de los 21 puntos. Úsalas para comparar sesiones, no como medida clínica.</p>`;
          };
          paint();
          L.listeners.add(paint);
        },
      },
      /* ── Cuerpo ── */
      {
        id: 'cuerpo', title: 'Cuerpo', icon: 'lab', def: DEF.cuerpo, glass: 1, minW: 220, minH: 160,
        mount(body) {
          body.innerHTML = '<div class="fp-body-cards fp-body-cards--8" data-cards></div>';
          const box = body.querySelector('[data-cards]');
          const paint = () => {
            if (!L.s) { box.innerHTML = ''; return; }
            const a = ctx.ml.anglesOf(L.s.frames[L.frameI] || L.s.frames[0]);
            const row = (k, label, side) => `<div class="fp-bc fp-bc--${side}"><small>${label}</small><b class="fp-data">${a[k] != null ? `${Math.round(a[k])}°` : '—'}</b></div>`;
            box.innerHTML = row('codo_izq', 'codo izq', 'l') + row('codo_der', 'codo der', 'r') + row('rodilla_izq', 'rodilla izq', 'l') + row('rodilla_der', 'rodilla der', 'r')
              + row('hombro_izq', 'hombro izq', 'l') + row('hombro_der', 'hombro der', 'r') + row('cadera_izq', 'cadera izq', 'l') + row('cadera_der', 'cadera der', 'r');
          };
          L.frameListeners.add(paint);
          L.listeners.add(paint);
          paint();
        },
      },
      /* ── Bitácora ── */
      {
        id: 'bitacora', title: 'Bitácora', icon: 'file', def: DEF.bitacora, glass: 2, minW: 200, minH: 120,
        mount(body) {
          let lastHi = -1;
          const paint = () => {
            body.innerHTML = L.events.length ? `<ol class="fp-log">${L.events.map((e, i) => `<li data-i="${i}"><span class="fp-data">${fmtT(e.t)}</span> ${esc(e.msg)}</li>`).join('')}</ol>` : '<ol class="fp-log"><li>— sin eventos —</li></ol>';
            lastHi = -1;
          };
          paint();
          L.listeners.add(paint);
          L.frameListeners.add(() => {
            if (!L.s) return;
            const t = L.s.frames[L.frameI].tMs - L.s.frames[0].tMs;
            let k = -1; for (let i = 0; i < L.events.length; i++) if (L.events[i].t <= t) k = i;
            if (k === lastHi) return;
            body.querySelector('.is-now')?.classList.remove('is-now');
            const li = body.querySelector(`[data-i="${k}"]`); if (li) li.classList.add('is-now');
            lastHi = k;
          });
        },
      },
    ];
  },
};
