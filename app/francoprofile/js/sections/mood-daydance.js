// FP · MOOD M6 — «Day Dance» → «DAY TRAIN».
// Foto desenfocada hecha de gradientes blureados (ultramar, mimosa, blanco, agua) que se mueven lento,
// una silueta plana ultramar flotando de espaldas (dibujada desde una pose REAL del boxer.json de Motion Lab,
// rotada para que flote) con su reflejo en el agua, y tipografía de póster de evento en azul.
console.log('[fp/mood-daydance] init');

const pad = (n) => String(n).padStart(2, '0');

export default {
  id: 'mood-daydance',
  n: 'M6',
  title: 'Day train',
  pol: 'mood',
  render(ctx) {
    const t = ctx.M.parseISO(ctx.M.todayISO());
    const date = `${pad(t.getDate())}.${pad(t.getMonth() + 1)}.${t.getFullYear()}`;
    const pd = ctx.M.planFor(ctx.M.todayISO(), ctx.data, ctx.state.profile);
    const today = pd?.train ? pd.title.toUpperCase() : 'DESCANSO · SOL · CAMINATA';
    return `
<div class="fp-md">
  <div class="fp-md__ambient" aria-hidden="true"></div>
  <div class="fp-md__poster" data-fp-fade="scale">
    <div class="fp-md__photo" aria-hidden="true">
      <i class="fp-md__b fp-md__b--sky"></i><i class="fp-md__b fp-md__b--white"></i><i class="fp-md__b fp-md__b--mimosa"></i>
      <i class="fp-md__b fp-md__b--mimosa2"></i><i class="fp-md__b fp-md__b--ultra"></i><i class="fp-md__b fp-md__b--water"></i>
    </div>
    <canvas class="fp-md__fig" role="img" aria-label="Silueta azul ultramar flotando de espaldas: una pose del boxeo de sombra de Franco"></canvas>
    <div class="fp-md__type">
      <h2 class="fp-md__title">DAY TRAIN</h2>
      <div class="fp-md__row"><span>${date}</span><span class="fp-md__time">18:00 <i></i> 20:00 ${ctx.ui.tag('?')}</span></div>
      <p class="fp-md__sub">AGUA ALL DAY LONG</p>
    </div>
    <div class="fp-md__foot">
      <p><b>SUBIDÓN</b> 8–10′ · <b>FUERZA</b> 35–45′ · <b>BOLSA</b> 10–15′</p>
      <p>HOY · ${ctx.ui.esc(today)}</p>
      <p>AGUA 3 L · CREATINA 5 G · PROTEÍNA 110–130 G ${ctx.ui.tag('U')}</p>
      <div class="fp-md__logo"><i aria-hidden="true"></i><span>franco<br>perfil vivo</span></div>
    </div>
  </div>
  <p class="fp-md__note" data-fp-fade>Un póster por día de entreno. <em>El horario es orientativo</em> ${ctx.ui.tag('?')}: lo cambiás en la app.</p>
</div>`;
  },
  async init(el, ctx) {
    const cv = el.querySelector('.fp-md__fig');
    const reduced = ctx.env.prefersReducedMotion();
    let frames = null;
    try { frames = (await ctx.data.boxer()).frames; } catch { /* sin pose: solo póster */ }
    const J = ctx.ml.J;
    const ultra = () => getComputedStyle(document.documentElement).getPropertyValue('--fp-ultra').trim() || '#1f2bff';
    let visible = false, raf = null, fi = 30, acc = 0, last = performance.now();

    const body = (g, f, X, Y, sc) => {
      g.lineCap = 'round'; g.lineJoin = 'round';
      const limb = (a, b, w) => { g.lineWidth = w * sc; g.beginPath(); g.moveTo(X(f[J[a]]), Y(f[J[a]])); g.lineTo(X(f[J[b]]), Y(f[J[b]])); g.stroke(); };
      [['l_shoulder', 'l_elbow', 0.085], ['l_elbow', 'l_wrist', 0.07], ['r_shoulder', 'r_elbow', 0.085], ['r_elbow', 'r_wrist', 0.07],
        ['l_hip', 'l_knee', 0.12], ['l_knee', 'l_ankle', 0.09], ['r_hip', 'r_knee', 0.12], ['r_knee', 'r_ankle', 0.09],
        ['l_ankle', 'l_toe', 0.06], ['r_ankle', 'r_toe', 0.06]].forEach(([a, b, w]) => limb(a, b, w));
      g.beginPath();
      [J.l_shoulder, J.r_shoulder, J.r_hip, J.l_hip].forEach((k, i) => { const p = f[k]; i ? g.lineTo(X(p), Y(p)) : g.moveTo(X(p), Y(p)); });
      g.closePath(); g.lineWidth = 0.08 * sc; g.stroke(); g.fill();
      limb('l_shoulder', 'r_shoulder', 0.1); limb('l_hip', 'r_hip', 0.12);
      const n = f[J.nose], sh = [(f[J.l_shoulder][0] + f[J.r_shoulder][0]) / 2, (f[J.l_shoulder][1] + f[J.r_shoulder][1]) / 2];
      g.lineWidth = 0.075 * sc; g.beginPath(); g.moveTo(X(sh), Y(sh)); g.lineTo(X(n), Y(n)); g.stroke();
      g.beginPath(); g.arc(X(n), Y(n), 0.085 * sc, 0, Math.PI * 2); g.fill();
    };

    const draw = (now) => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const W = Math.max(1, Math.round(r.width * dpr)), H = Math.max(1, Math.round(r.height * dpr));
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
      const g = cv.getContext('2d');
      g.clearRect(0, 0, W, H);
      if (!frames) return;
      const f = frames[fi];
      const s = now / 1000;
      const sc = Math.min(W, H) * 0.42;
      const cx = (f[J.l_hip][0] + f[J.r_hip][0]) / 2, cy = (f[J.l_hip][1] + f[J.r_hip][1]) / 2;
      const bob = reduced ? 0 : Math.sin(s * 0.9) * 0.012 * H;
      const rot = -1.25 + (reduced ? 0 : Math.sin(s * 0.55) * 0.05);
      const X = (p) => (p[0] - cx) * sc, Y = (p) => (p[1] - cy) * sc;
      g.fillStyle = g.strokeStyle = ultra();
      // reflejo en el agua
      g.save(); g.translate(W * 0.5, H * 0.66 + bob * 0.4); g.scale(1, -0.38); g.rotate(rot); g.globalAlpha = 0.22; g.filter = 'blur(5px)';
      body(g, f, X, Y, sc); g.restore();
      // la figura
      g.save(); g.translate(W * 0.5, H * 0.5 + bob); g.rotate(rot); g.filter = 'none'; g.globalAlpha = 1;
      body(g, f, X, Y, sc); g.restore();
      if (!reduced) {
        const dt = now - last; acc += dt * 0.22;
        while (acc > 1000 / 30) { acc -= 1000 / 30; fi = (fi + 1) % frames.length; }
      }
      last = now;
    };
    const loop = (now) => { raf = null; if (!visible) return; draw(now); raf = requestAnimationFrame(loop); };
    ctx.env.onVisible(el, (v) => {
      visible = v;
      el.classList.toggle('fp-is-live', v && !reduced);
      if (v && !reduced && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
    });
    draw(performance.now());
    new ResizeObserver(() => { if (!raf) draw(performance.now()); }).observe(cv);
    document.addEventListener('fp-accent-changed', () => { if (!raf) draw(performance.now()); });

    // parallax suave del póster
    if (reduced) return;
    const poster = el.querySelector('.fp-md__poster');
    ctx.scroll.onScrollFrame(() => {
      if (!visible) return;
      const p = ctx.scroll.getSectionProgress(el) - 0.5;
      poster.style.translate = `0 ${(p * -60).toFixed(1)}px`;
      poster.style.rotate = `${(p * -3).toFixed(2)}deg`;
    });
  },
};
