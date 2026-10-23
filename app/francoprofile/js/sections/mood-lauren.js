// FP · MOOD M7 — Lauren Mia naranja→magenta sobre negro → «Franco™ · Temporada verano 2026».
// Mockups de teléfono (pantalla Hoy en --fp-hot con los días del plan y la sesión de hoy) y relojes con
// anillos en gradiente (proteína, agua, racha: del vault real o de EJEMPLO), un anillo gigante que respira
// y un cuerpo de partículas en gradiente naranja→magenta (pose real del boxer.json de Motion Lab).
console.log('[fp/mood-lauren] init');

const CLOVER = '<svg class="fp-ml__clover" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="10" r="8"/><circle cx="30" cy="20" r="8"/><circle cx="20" cy="30" r="8"/><circle cx="10" cy="20" r="8"/><circle cx="20" cy="20" r="5" class="h"/></svg>';
const GLOBE = '<svg class="fp-ml__globe" viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="30"/><ellipse cx="40" cy="40" rx="12" ry="30"/><ellipse cx="40" cy="40" rx="24" ry="30"/><path d="M10 40h60M14 25h52M14 55h52"/></svg>';

function ring(pct, value, unit, label) {
  const p = Math.max(0, Math.min(100, pct));
  return `<div class="fp-ml__ring-g" style="--p:${p.toFixed(1)}"><i></i><span><b class="fp-data">${value}</b><small>${unit}</small></span><em>${label}</em></div>`;
}

export default {
  id: 'mood-lauren',
  n: 'M7',
  title: 'Temporada verano',
  pol: 'mood',
  render(ctx) {
    const days = ctx.data.plan.days.filter((d) => d.train);
    const list = days.map((d) => `<li><b>${d.short}</b><span>${ctx.ui.esc(d.title)}</span></li>`).join('');
    return `
<div class="fp-ml">
  <div class="fp-ml__aura" aria-hidden="true"></div>
  <canvas class="fp-ml__body" aria-hidden="true"></canvas>
  <div class="fp-ml__giant" aria-hidden="true"><i></i></div>
  <div class="fp-ml__wrap">
    <header class="fp-ml__nav fp-data">${CLOVER}<b>FRANCO™</b><span>HOY</span><span>PLAN</span><span>BOLSA</span><span>RACHA</span></header>
    <div class="fp-ml__hero">
      <p class="fp-ml__k fp-data">M7 · TOUR DEL CUERPO</p>
      <h2 class="fp-ml__title" data-fp-fade>Franco™<br><span>Temporada</span><br><span>verano 2026</span></h2>
      <p class="fp-ml__sub" data-fp-fade data-fp-delay="80">Un viaje <i>→</i> a través del cuerpo. Cinco días de entreno, dos de descanso, 3 L de agua y 5 g de creatina ${ctx.ui.tag('U')}.</p>
      <a class="fp-ml__cta" href="#/plan" data-fp-magnetic>VER PLAN →</a>
      <p class="fp-ml__demo" data-ml-demo></p>
    </div>
    <div class="fp-ml__devices">
      <div class="fp-ml__dev fp-ml__dev--a" data-fp-fade="right"><div class="fp-ml__phone fp-ml__phone--hot" data-fp-tilt>
        <div class="fp-ml__status fp-data"><span data-ml-clock>9:41</span><span>●●● 5G</span></div>
        ${CLOVER}
        <p class="fp-ml__p-title">FRANCO™<br><span>Un viaje → a través del cuerpo.</span></p>
        <p class="fp-ml__p-k">Días disponibles (Lun–Sáb)</p>
        <ul class="fp-ml__days">${list}</ul>
        ${GLOBE}
        <p class="fp-ml__p-k">Temporada verano 2026®</p>
        <a class="fp-ml__p-btn" href="#/plan">VER PLAN →</a>
      </div></div>
      <div class="fp-ml__dev fp-ml__dev--b" data-fp-fade="right" data-fp-delay="120"><div class="fp-ml__phone fp-ml__phone--dark" data-fp-tilt>
        <div class="fp-ml__status fp-data"><span>Hoy</span><span>●●● 5G</span></div>
        <p class="fp-ml__p-head">${CLOVER}<b>FRANCO™</b></p>
        <p class="fp-ml__p-name">Temporada<br>verano 2026</p>
        <div class="fp-ml__orb" aria-hidden="true"><i></i></div>
        <div class="fp-ml__track">
          <span class="fp-ml__play" aria-hidden="true"></span>
          <div><b data-ml-today>Hoy</b><small data-ml-blocks>Subidón · Fuerza · Bolsa</small></div>
        </div>
        <div class="fp-ml__prog"><i data-ml-prog></i></div>
        <p class="fp-ml__p-btn fp-ml__p-btn--ghost">OTRAS SESIONES ↓</p>
      </div></div>
      <div class="fp-ml__watches" data-ml-watches></div>
    </div>
  </div>
</div>`;
  },
  async init(el, ctx) {
    const reduced = ctx.env.prefersReducedMotion();
    const $ = (s) => el.querySelector(s);

    // ── datos: hoy (o el último día con datos), racha
    const paint = () => {
      const days = ctx.state.days || [];
      const profile = ctx.state.profile;
      const today = ctx.M.todayISO();
      let d = days.find((x) => x.date === today);
      if (!d || (!d.meals?.length && !d.intake?.waterL)) d = [...days].reverse().find((x) => x.meals?.length || x.intake?.waterL) || d;
      const prot = d ? ctx.M.dayProtein(d) : 0;
      const water = d ? ctx.M.dayWater(d) : 0;
      const st = ctx.M.streak(days, profile);
      const pTarget = profile?.intake?.proteinG?.[1] || 130;
      const wTarget = profile?.intake?.waterL || 3;
      const when = d && d.date !== today ? ctx.M.fmtDate(d.date) : 'hoy';
      $('[data-ml-watches]').innerHTML = [
        `<div class="fp-ml__watch" data-fp-fade="scale">${ring((prot / pTarget) * 100, ctx.ui.fmt(prot, 0), 'g', `proteína · ${when}`)}</div>`,
        `<div class="fp-ml__watch" data-fp-fade="scale" data-fp-delay="90">${ring((water / wTarget) * 100, ctx.ui.fmt(water, 1), 'L', `agua · ${when}`)}</div>`,
        `<div class="fp-ml__watch" data-fp-fade="scale" data-fp-delay="180">${ring((Math.min(st.count, 14) / 14) * 100, st.count, 'días', 'racha')}</div>`,
      ].join('');
      ctx.ui.reveal(el);
      $('[data-ml-demo]').innerHTML = d?.demo ? `${ctx.ui.demoChip()} <span>datos de ejemplo — borralos en Vault</span>` : (!d ? '<span>Sin datos todavía: cargá tu primer día en la app.</span>' : '');
      const pd = ctx.M.planFor(today, ctx.data, profile);
      $('[data-ml-today]').textContent = pd?.train ? `Hoy toca: ${pd.title}` : `Hoy: ${pd?.title || 'descanso'}`;
      const td = days.find((x) => x.date === today);
      const b = td?.blocks || {};
      const n = ['subidon', 'fuerza', 'bolsa'].filter((k) => b[k]).length;
      $('[data-ml-blocks]').textContent = `Subidón ${b.subidon ? '✓' : '·'}  Fuerza ${b.fuerza ? '✓' : '·'}  Bolsa ${b.bolsa ? '✓' : '·'}`;
      $('[data-ml-prog]').style.width = `${Math.max(4, (n / 3) * 100)}%`;
      const now = new Date();
      $('[data-ml-clock]').textContent = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    };
    paint();
    ctx.onData(paint);

    // ── cuerpo de partículas naranja→magenta
    const cv = $('.fp-ml__body');
    const g = cv.getContext('2d');
    let frames = null;
    try { frames = (await ctx.data.boxer()).frames; } catch { /* sin pose */ }
    const J = ctx.ml.J, BONES = ctx.ml.BONES;
    const N = ctx.env.isMobile() ? 360 : 820;
    const seeds = Array.from({ length: N }, (_, i) => ({ b: i % BONES.length, t: Math.random(), j: [(Math.random() - 0.5) * 0.04, (Math.random() - 0.5) * 0.04], ph: Math.random() * 6.28, s: 0.6 + Math.random() * 1.4 }));
    let box = null;
    if (frames) {
      let y0 = 1e9, y1 = -1e9;
      for (const f of frames) for (const p of f) { y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
      box = { y0, y1 };
    }
    let visible = false, raf = null, fi = 0, acc = 0, last = performance.now();
    const draw = (now) => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      const W = Math.max(1, Math.round(r.width * dpr)), H = Math.max(1, Math.round(r.height * dpr));
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
      g.clearRect(0, 0, W, H);
      if (!frames || !box) return;
      const f = frames[fi];
      const sc = (H * 0.78) / (box.y1 - box.y0);
      const hx = (f[J.l_hip][0] + f[J.r_hip][0]) / 2;
      const ox = W * (ctx.env.isMobile() ? 0.5 : 0.36) - hx * sc, oy = H * 0.1 - box.y0 * sc;
      const s = now / 1000;
      g.globalCompositeOperation = 'lighter';
      for (const p of seeds) {
        const [a, b] = BONES[p.b];
        const pa = f[J[a]], pb = f[J[b]];
        const x = (pa[0] + (pb[0] - pa[0]) * p.t + p.j[0] + Math.sin(s * 1.3 + p.ph) * 0.006) * sc + ox;
        const y = (pa[1] + (pb[1] - pa[1]) * p.t + p.j[1] + Math.cos(s * 1.1 + p.ph) * 0.006) * sc + oy;
        const k = Math.max(0, Math.min(1, (y / H - 0.1) / 0.8));
        const rr = Math.round(255), gg = Math.round(61 - 18 * k), bb = Math.round(26 + 188 * k);
        g.fillStyle = `rgba(${rr},${gg},${bb},0.10)`;
        const hs = 7 * p.s * dpr; g.fillRect(x - hs / 2, y - hs / 2, hs, hs);
        g.fillStyle = `rgba(${rr},${gg + 60},${bb},0.75)`;
        const cs = 1.6 * p.s * dpr; g.fillRect(x - cs / 2, y - cs / 2, cs, cs);
      }
      g.globalCompositeOperation = 'source-over';
      if (!reduced) {
        acc += (now - last) * 0.6;
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

    if (reduced) return;
    const giant = $('.fp-ml__giant');
    ctx.scroll.onScrollFrame(() => {
      if (!visible) return;
      const p = ctx.scroll.getSectionProgress(el) - 0.5;
      giant.style.translate = `0 ${(p * -140).toFixed(1)}px`;
      cv.style.translate = `0 ${(p * -60).toFixed(1)}px`;
    });
  },
};
