// FP · CH25 · MOTION LAB — el Estudio de Moyon Lab dentro del scroll (siempre oscuro, como app/js/ui/studio.js):
// esqueleto con ángulos en caja negra (ctx.ml.SkeletonPlayer), señal de los codos izq azul / der roja con cursor,
// bitácora en mono, equilibrio «100 % ←→ 0 %», conteo en LED de puntos, acciones izq/der con barras,
// tarjetas «Cuerpo» con ángulos en vivo y línea de tiempo naranja. Fuente: boxer.json real o tu última sesión del vault.
// Formatos y orden de los 21 puntos: 03 §13.3 / data/joints.json. Nada sale del dispositivo.
console.log('[fp/ch25-motionlab] init');

const fmtT = (ms) => { const s = Math.max(0, ms) / 1000; const m = Math.floor(s / 60); return `${String(m).padStart(2, '0')}:${(s % 60).toFixed(1).padStart(4, '0')}`; };

/** Golpes (picos de extensión muñeca–hombro) y cambios de peso → bitácora. Estimado. */
function extractEvents(s, J) {
  const F = s.frames, fps = s.fps || 30, ev = [];
  const d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const ext = (side) => F.map((f) => d(f.pts[J[`${side}_shoulder`]], f.pts[J[`${side}_wrist`]]) / (d(f.pts[J.l_shoulder], f.pts[J.r_shoulder]) || 1));
  const peaksOf = (sig, side) => {
    const mx = Math.max(...sig), mn = Math.min(...sig), thr = mn + (mx - mn) * 0.72, gap = Math.round(fps * 0.25);
    let last = -1e9;
    for (let i = 1; i < sig.length - 1; i++) if (sig[i] > thr && sig[i] >= sig[i - 1] && sig[i] >= sig[i + 1] && i - last >= gap) { last = i; ev.push({ i, side, kind: 'golpe', t: F[i].tMs - F[0].tMs }); }
  };
  peaksOf(ext('l'), 'izq'); peaksOf(ext('r'), 'der');
  let prev = null;
  F.forEach((f, i) => {
    const hx = (f.pts[J.l_hip][0] + f.pts[J.r_hip][0]) / 2, la = f.pts[J.l_ankle][0], ra = f.pts[J.r_ankle][0];
    const r = Math.abs(ra - la) > 1e-4 ? (hx - la) / (ra - la) : 0.5;
    const st = r < 0.38 ? 'izq' : r > 0.62 ? 'der' : 'centro';
    if (st !== prev && i - (ev.filter((e) => e.kind === 'peso').slice(-1)[0]?.i ?? -99) > fps * 0.4) {
      if (prev !== null) ev.push({ i, kind: 'peso', side: st, t: f.tMs - F[0].tMs });
      prev = st;
    }
  });
  return ev.sort((a, b) => a.i - b.i);
}

export default {
  id: 'motion-lab',
  n: '25',
  title: 'Motion Lab',
  pol: 'theme',
  app: 'lab',
  bridge: 'Una cámara, sin traje, sin nube: el espejo que se acuerda.',

  render(ctx) {
    const { tag, icon } = ctx.ui;
    const cards = [['codo_izq', 'codo izq', 'L'], ['codo_der', 'codo der', 'R'], ['rodilla_izq', 'rodilla izq', 'L'], ['rodilla_der', 'rodilla der', 'R'], ['hombro_izq', 'hombro izq', 'L'], ['hombro_der', 'hombro der', 'R']];
    return `
<div class="fp-wrap fp-wrap--wide">
  <header class="fp-head" data-fp-fade>
    <span class="fp-eyebrow"><b>25</b> Motion Lab</span>
    <h2>El laboratorio <em>de</em> movimiento.</h2>
    <p class="fp-lede">Tu propia app: webcam → esqueleto de 21 puntos → reps, tempo, golpes, equilibrio ${tag('U')}. Acá se reproduce el JSON que exporta, con los colores FreeMoCap: izquierda azul, derecha roja, core verde, cabeza amarilla.</p>
  </header>

  <div class="fp-studio" data-fp-fade="scale">
    <div class="fp-studio__bar">
      <span class="fp-studio__brand"><b>MOYON LAB</b><sup>®</sup><small>visualizando <em>Estudio</em></small></span>
      <div class="fp-studio__chips">
        <span class="fp-studio__chip" data-ml-src>● clip · boxer.json</span>
        <span class="fp-studio__chip" data-ml-fps>30 fps</span>
        <span class="fp-studio__chip">solo navegador</span>
        <select class="fp-studio__select" data-ml-pick aria-label="Elegir sesión"></select>
      </div>
      <a class="fp-studio__cta" href="#/lab">${icon('upload', 15)} Importá tu JSON</a>
    </div>

    <div class="fp-studio__grid">
      <aside class="fp-studio__col">
        <section class="fp-studio__win">
          <h4>${icon('checkin', 13)} Señal · ángulo del codo</h4>
          <canvas class="fp-studio__sig" data-ml-sig></canvas>
          <p class="fp-studio__leg"><i class="l"></i>codo izq <b class="fp-data" data-ml-sig-l>—</b> <i class="r"></i>codo der <b class="fp-data" data-ml-sig-r>—</b></p>
        </section>
        <section class="fp-studio__win fp-studio__win--log">
          <h4>${icon('file', 13)} Bitácora</h4>
          <ol class="fp-studio__log" data-ml-log></ol>
        </section>
      </aside>

      <div class="fp-studio__stage">
        <span class="fp-studio__tagbox fp-data" data-ml-label>clip 0.96</span>
        <span class="fp-studio__corner tl"></span><span class="fp-studio__corner tr"></span><span class="fp-studio__corner bl"></span><span class="fp-studio__corner br"></span>
        <canvas class="fp-studio__cv" data-ml-cv aria-label="Esqueleto reproduciendo la sesión"></canvas>
        <div class="fp-studio__bal">
          <span class="fp-studio__balv l fp-display" data-ml-bal-l>50%</span>
          <div class="fp-studio__baltrack"><i data-ml-bal></i><b></b></div>
          <span class="fp-studio__balv r fp-display" data-ml-bal-r>50%</span>
          <small>peso izq ↔ der · estimado</small>
        </div>
        <div class="fp-studio__time">
          <button type="button" class="fp-studio__play" data-ml-play aria-label="Pausar">${icon('pause', 15)}</button>
          <input type="range" min="0" max="1000" value="0" class="fp-studio__scrub" data-ml-scrub aria-label="Línea de tiempo">
          <span class="fp-data" data-ml-time>00:00.0 / 00:00.0</span>
        </div>
      </div>

      <aside class="fp-studio__col">
        <section class="fp-studio__win">
          <h4>${icon('target', 13)} Conteo</h4>
          <div class="fp-studio__count"><canvas class="fp-studio__led" data-ml-led></canvas><span data-ml-count-u>golpes</span></div>
          <p class="fp-small fp-studio__muted" data-ml-detect></p>
        </section>
        <section class="fp-studio__win">
          <h4>${icon('bolt', 13)} Acciones</h4>
          <div class="fp-studio__acts" data-ml-acts></div>
        </section>
        <section class="fp-studio__win">
          <h4>${icon('lab', 13)} Cuerpo</h4>
          <div class="fp-studio__body">${cards.map(([k, n, s]) => `<div class="fp-studio__bc fp-studio__bc--${s}"><span>${n}</span><b class="fp-data" data-ml-a="${k}">—</b></div>`).join('')}</div>
        </section>
      </aside>
    </div>
    <p class="fp-studio__foot fp-data" data-ml-foot>X:0.00 Y:0.00 · FPS —</p>
  </div>
</div>`;
  },

  async init(el, ctx) {
    const ml = ctx.ml;
    const J = Object.fromEntries(ml.JOINTS.map((n, i) => [n, i]));
    const $ = (s) => el.querySelector(s);
    const cv = $('[data-ml-cv]'), sig = $('[data-ml-sig]'), led = $('[data-ml-led]');
    const pick = $('[data-ml-pick]'), play = $('[data-ml-play]'), scrub = $('[data-ml-scrub]'), time = $('[data-ml-time]');
    const balBar = $('[data-ml-bal]'), balL = $('[data-ml-bal-l]'), balR = $('[data-ml-bal-r]');
    const log = $('[data-ml-log]'), acts = $('[data-ml-acts]'), foot = $('[data-ml-foot]');
    let player = null, session = null, m = null, events = [], lastCount = -1, lastI = -1;
    const angleCells = Object.fromEntries([...el.querySelectorAll('[data-ml-a]')].map((n) => [n.dataset.mlA, n]));

    // fuentes: sesiones reales del vault + el boxer.json real de Motion Lab
    let demoBoxer = null;
    try {
      const raw = await ctx.data.boxer();
      const n = ml.normalize(raw, 'boxer.json');
      if (n.ok) demoBoxer = { ...n.session, id: '__boxer', _label: 'Sombra de boxeo · boxer.json' };
    } catch (e) { console.warn('[fp/ch25] sin boxer.json', e); }

    const options = () => {
      const ss = (ctx.state.sessions || []).filter((s) => s.id !== 'demo-boxer');
      const list = [...ss.map((s) => ({ ...s, _label: `${s.exerciseName}${s.demo ? ' · ejemplo' : ''} · ${String(s.createdAt).slice(0, 10)}` }))];
      if (demoBoxer) list.push(demoBoxer);
      return list;
    };

    const drawSignal = () => {
      if (!m) return;
      const r = sig.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
      const W = Math.max(1, Math.round(r.width * dpr)), H = Math.max(1, Math.round(r.height * dpr));
      if (sig.width !== W || sig.height !== H) { sig.width = W; sig.height = H; }
      const c = sig.getContext('2d'); c.clearRect(0, 0, W, H);
      const N = m.angles.length, step = Math.max(1, Math.floor(N / 300));
      const y = (v) => H - 6 * dpr - ((v ?? 90) / 180) * (H - 12 * dpr);
      c.strokeStyle = 'rgba(255,255,255,.08)'; c.lineWidth = 1;
      for (const g of [45, 90, 135]) { c.beginPath(); c.moveTo(0, y(g)); c.lineTo(W, y(g)); c.stroke(); }
      for (const [key, col] of [['codo_izq', ml.SKEL.L], ['codo_der', ml.SKEL.R]]) {
        c.strokeStyle = col; c.lineWidth = 1.6 * dpr; c.beginPath();
        for (let i = 0; i < N; i += step) { const X = (i / (N - 1)) * W; const v = m.angles[i][key]; i ? c.lineTo(X, y(v)) : c.moveTo(X, y(v)); }
        c.stroke();
      }
      const px = (Math.max(0, lastI) / Math.max(1, N - 1)) * W;
      c.strokeStyle = '#ffffff'; c.globalAlpha = 0.7; c.beginPath(); c.moveTo(px, 0); c.lineTo(px, H); c.stroke(); c.globalAlpha = 1;
    };

    const paintLog = () => {
      log.innerHTML = events.slice(0, 40).map((e) => `<li data-i="${e.i}"><span class="fp-data">${fmtT(e.t)}</span> ${e.kind === 'golpe' ? `golpe ${e.side === 'izq' ? '<b class="l">izq</b>' : '<b class="r">der</b>'}` : `peso ${e.side === 'centro' ? 'centrado' : `a la ${e.side === 'izq' ? 'izquierda' : 'derecha'}`}`}</li>`).join('') || '<li class="fp-studio__muted">Sin eventos detectados.</li>';
    };

    const onFrame = (i, f) => {
      lastI = i;
      const a = ml.anglesOf(f);
      for (const k in angleCells) angleCells[k].textContent = a[k] == null ? '—' : `${Math.round(a[k])}°`;
      $('[data-ml-sig-l]').textContent = a.codo_izq == null ? '—' : `${Math.round(a.codo_izq)}°`;
      $('[data-ml-sig-r]').textContent = a.codo_der == null ? '—' : `${Math.round(a.codo_der)}°`;
      // equilibrio
      const hx = (f.pts[J.l_hip][0] + f.pts[J.r_hip][0]) / 2, la = f.pts[J.l_ankle][0], ra = f.pts[J.r_ankle][0];
      const r = Math.abs(ra - la) > 1e-4 ? Math.max(0, Math.min(1, (hx - la) / (ra - la))) : 0.5;
      const L = Math.round((1 - r) * 100);
      balL.textContent = `${L}%`; balR.textContent = `${100 - L}%`; balBar.style.setProperty('--v', String(L));
      // conteo progresivo
      const n = events.filter((e) => e.kind === 'golpe' && e.i <= i).length;
      if (n !== lastCount) { lastCount = n; ml && ctx.led.drawLED(led, String(session.kpi?.unit && session.kpi.unit !== 'golpes' ? session.kpi.value : n), { on: '#e06040', align: 'left', glow: 14 }); }
      log.querySelectorAll('li[data-i]').forEach((li) => li.classList.toggle('is-past', +li.dataset.i <= i));
      // tiempo
      const F = session.frames, t = f.tMs - F[0].tMs, dur = F[F.length - 1].tMs - F[0].tMs;
      time.textContent = `${fmtT(t)} / ${fmtT(dur)}`;
      if (document.activeElement !== scrub) scrub.value = String(Math.round((i / Math.max(1, F.length - 1)) * 1000));
      scrub.style.setProperty('--p', `${(i / Math.max(1, F.length - 1)) * 100}%`);
      const nose = f.pts[J.nose];
      foot.textContent = `X:${(+nose[0]).toFixed(2)} Y:${(+nose[1]).toFixed(2)} · FPS ${session.fps}`;
      drawSignal();
    };

    const load = (s) => {
      session = s;
      m = ml.metrics(s);
      events = extractEvents(s, J);
      lastCount = -1;
      $('[data-ml-src]').textContent = `● ${s.source === 'clip' ? 'clip' : 'sesión'} · ${s.filename || s.exerciseName}`;
      $('[data-ml-fps]').textContent = `${s.fps} fps · ${s.frames.length} frames`;
      $('[data-ml-label]').textContent = `${s.exerciseName.toLowerCase()} ${s.source === 'clip' ? '0.96' : ''}`.trim();
      $('[data-ml-count-u]').textContent = s.kpi?.unit && s.kpi.unit !== 'golpes' ? s.kpi.unit : 'golpes · estimado';
      const sy = m.symmetryPct;
      $('[data-ml-detect]').innerHTML = `ROM codo ${m.romL.codo ?? '—'}° / ${m.romR.codo ?? '—'}° · simetría ${sy ?? '—'}%${m.reps ? ` · ${m.reps} reps · tempo ${m.tempo.eccS ?? '—'}-${m.tempo.pauseS ?? '—'}-${m.tempo.conS ?? '—'} s` : ''}`;
      const tot = Math.max(1, m.punches.total);
      acts.innerHTML = [['izquierda', m.punches.l, 'l'], ['derecha', m.punches.r, 'r']].map(([n, v, c]) => `<div class="fp-studio__act"><span>${n}</span><div class="fp-studio__actbar ${c}"><i style="--v:${(v / tot) * 100}"></i></div><b class="fp-data">${v}</b></div>`).join('')
        + `<div class="fp-studio__act"><span>sway</span><div class="fp-studio__actbar c"><i style="--v:${Math.min(100, m.balance.swayX * 400)}"></i></div><b class="fp-data">${ctx.ui.fmt(m.balance.swayX, 3)}</b></div>`;
      paintLog();
      if (player) player.setSession(s);
      else {
        player = new ml.SkeletonPlayer(cv, s, { angles: true, trail: true, com: true, glow: true, ink: '#f4f4f4', onFrame });
      }
      if (!ctx.env.prefersReducedMotion()) { player.play(); play.innerHTML = ctx.icon('pause', 15); play.setAttribute('aria-label', 'Pausar'); }
      else { play.innerHTML = ctx.icon('play', 15); play.setAttribute('aria-label', 'Reproducir'); }
    };

    const fillPick = () => {
      const opts = options();
      const cur = session?.id;
      pick.innerHTML = opts.map((o) => `<option value="${ctx.ui.esc(o.id)}">${ctx.ui.esc(o._label)}</option>`).join('');
      if (cur && opts.some((o) => o.id === cur)) pick.value = cur;
      return opts;
    };

    const opts = fillPick();
    if (!opts.length) {
      el.querySelector('.fp-studio__grid').innerHTML = '<div class="fp-empty"><b>No pude cargar el demo de Motion Lab.</b><a class="fp-btn fp-btn--sm" href="#/lab">Importá tu JSON →</a></div>';
      return;
    }
    load(opts[0]);
    pick.addEventListener('change', () => { const s = options().find((o) => o.id === pick.value); if (s) load(s); });
    play.addEventListener('click', () => {
      const on = player.toggle();
      play.innerHTML = ctx.icon(on ? 'pause' : 'play', 15);
      play.setAttribute('aria-label', on ? 'Pausar' : 'Reproducir');
    });
    scrub.addEventListener('input', () => { player.pause(); play.innerHTML = ctx.icon('play', 15); player.seek(+scrub.value / 1000); });
    log.addEventListener('click', (e) => { const li = e.target.closest('li[data-i]'); if (!li || !session) return; player.seek(+li.dataset.i / Math.max(1, session.frames.length - 1)); });
    new ResizeObserver(() => drawSignal()).observe(sig);
    ctx.onData(async (d) => { if (d?.kind !== 'session' && d?.kind !== 'all') return; await ctx.load(); fillPick(); });
  },
};
