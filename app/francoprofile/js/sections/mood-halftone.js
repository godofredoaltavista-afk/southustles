// FP · MOOD M5 — sellos «HALF TONE MUSEUM» → «HALF TONE MÚSCULO».
// Una estampilla perforada por grupo muscular con su rango semanal REAL (data/exercises.json → muscles),
// un patrón halftone de puntos (canvas, semilla fija) en una tinta distinta del moodboard y la prioridad.
// Al hover/foco aparece la serie de esta semana del vault (ctx.M.volumeByMuscle).
console.log('[fp/mood-halftone] init');

const INKS = ['--fp-ultra', '--fp-lime', '--fp-magenta', '--fp-hot', '#ffd60a', '--fp-ultra', '--fp-magenta', '--fp-lime', '--fp-hot', '#ffd60a', '--fp-cream'];
const rng = (s) => () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);

function syllab(name) {
  // «HALF TONE MUS EUM» → nombre del músculo partido en renglones cortos
  const up = name.toUpperCase().replace(/\s*\/\s*/g, ' ');
  const words = up.split(/\s+/);
  const out = [];
  for (const w of words) { if (w.length > 6) { out.push(w.slice(0, Math.ceil(w.length / 2))); out.push(w.slice(Math.ceil(w.length / 2))); } else out.push(w); }
  return out.slice(0, 4);
}

function drawHalftone(cv, color, seed, dark) {
  const r = cv.getBoundingClientRect();
  if (!r.width) return;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const W = Math.round(r.width * dpr), H = Math.round(r.height * dpr);
  cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  g.fillStyle = dark ? '#0d0d0f' : '#f1efe9';
  g.fillRect(0, 0, W, H);
  const R = rng(seed * 7919 + 13);
  const blobs = Array.from({ length: 3 + Math.floor(R() * 3) }, () => ({ x: R() * W, y: R() * H, s: (0.18 + R() * 0.32) * Math.min(W, H) }));
  const step = 6.5 * dpr;
  g.fillStyle = color;
  for (let y = step / 2; y < H; y += step) {
    for (let x = step / 2 + ((y / step) % 2 ? step / 2 : 0); x < W; x += step) {
      let v = 0;
      for (const b of blobs) { const dx = x - b.x, dy = y - b.y; v += Math.exp(-(dx * dx + dy * dy) / (b.s * b.s)); }
      v = Math.min(1, v * 1.1);
      const rad = step * 0.56 * v;
      if (rad < 0.35 * dpr) continue;
      g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.fill();
    }
  }
}

export default {
  id: 'mood-halftone',
  n: 'M5',
  title: 'Half tone músculo',
  pol: 'mood',
  render(ctx) {
    const stamps = ctx.data.muscles.map((m, i) => {
      const lines = syllab(m.name);
      return `
      <article class="fp-mh__stamp${i % 3 === 2 ? ' is-dark' : ''}" tabindex="0" data-mh="${m.id}" data-ink="${INKS[i % INKS.length]}" style="--i:${i}" data-fp-fade="scale">
        <div class="fp-mh__paper">
          <header class="fp-mh__top">
            <p class="fp-mh__name">${lines.map((l) => `<span>${ctx.ui.esc(l)}</span>`).join('')}</p>
            <div class="fp-mh__meta"><i class="fp-mh__sq" aria-hidden="true"></i><b class="fp-data">${m.target[0]}–${m.target[1]}</b><span class="fp-data">series/sem</span></div>
          </header>
          <div class="fp-mh__art"><canvas aria-hidden="true"></canvas>
            <div class="fp-mh__week" data-mh-week><b class="fp-data">—</b><span>esta semana</span></div>
          </div>
          <footer class="fp-mh__foot fp-data"><span>P${m.priority}</span><span>${ctx.ui.esc(m.note || 'Rango [C]')}</span></footer>
        </div>
      </article>`;
    }).join('');
    return `
<div class="fp-mh">
  <header class="fp-mh__head">
    <h2 class="fp-mh__title" data-fp-fade><span>HALF</span><span>TONE</span><span>MÚS</span><span>CULO</span></h2>
    <div class="fp-mh__intro" data-fp-fade data-fp-delay="100">
      <p class="fp-data">M5 · COLECCIÓN 11 ESTAMPILLAS</p>
      <p>Un sello por grupo. El número grande es el rango semanal de series efectivas ${ctx.ui.tag('C')} ${ctx.ui.support('Solida')}. Pasá por encima: aparece lo que hiciste estos 7 días.</p>
      <p class="fp-mh__legend fp-data"><span>P1 = prioridad</span><span>12–20 series/músculo/semana</span><span data-mh-demo></span></p>
    </div>
  </header>
  <div class="fp-mh__grid">${stamps}</div>
</div>`;
  },
  init(el, ctx) {
    const resolve = (ink) => (ink.startsWith('--') ? (getComputedStyle(document.documentElement).getPropertyValue(ink).trim() || '#1f2bff') : ink);
    const stamps = [...el.querySelectorAll('[data-mh]')];
    const paintArt = () => stamps.forEach((s, i) => {
      const dark = s.classList.contains('is-dark');
      const ink = resolve(s.dataset.ink);
      s.style.setProperty('--fp-mh-ink', ink);
      drawHalftone(s.querySelector('canvas'), ink, i + 1, dark);
    });
    const paintWeek = () => {
      const days = ctx.state.days || [];
      const vol = ctx.M.volumeByMuscle(days, ctx.data);
      const from = ctx.M.addDays(ctx.M.todayISO(), -6);
      const demo = days.some((d) => d.demo && d.date >= from);
      const any = vol.some((v) => v.sets > 0);
      el.querySelector('[data-mh-demo]').innerHTML = demo ? ctx.ui.demoChip() : any ? 'datos del vault' : 'sin series esta semana';
      for (const v of vol) {
        const s = el.querySelector(`[data-mh="${v.id}"]`);
        if (!s) continue;
        const box = s.querySelector('[data-mh-week]');
        box.querySelector('b').textContent = any ? ctx.ui.fmt(v.sets) : '—';
        box.querySelector('span').textContent = !any ? 'cargá tu primera sesión' : v.status === 'low' ? 'esta semana · por debajo' : v.status === 'high' ? 'esta semana · ¿te recuperás?' : 'esta semana · en rango';
        s.dataset.status = any ? v.status : 'empty';
      }
    };
    requestAnimationFrame(paintArt);
    paintWeek();
    ctx.onData(paintWeek);
    let t = null;
    new ResizeObserver(() => { clearTimeout(t); t = setTimeout(paintArt, 160); }).observe(el.querySelector('.fp-mh__grid'));
    ctx.env.onVisible(el, (v) => el.classList.toggle('fp-is-live', v && !ctx.env.prefersReducedMotion()));
  },
};
