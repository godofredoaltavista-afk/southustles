// FP · MOOD M8 — «Trabajo»: puerto de la lista de proyectos de South Hustles
// (southustles/app/index.html .projects-list + js/sh-main.js initProjects + js/preview-3d.js).
// Filas grandes = sus ejercicios clave con el rango real del plan v1. Al hover, preview flotante que sigue
// la fila con spring 0.18, gradiente de póster + scanlines CRT + un asset wireframe que gira.
// El asset se dibuja en canvas 2D con proyección propia (regla: un solo WebGLRenderer en toda la página).
console.log('[fp/mood-works] init');

const ROWS = [
  { ex: 'pullup', name: 'Domi<em>nadas</em>', days: 'mar · vie', cat: 'tracción · dorsal', dose: '4 × 4–8', tempo: '3-1-1', asset: 'pull', tint: 'hot' },
  { ex: 'pushup_diamond', name: 'Flexión <em>diamante</em>', days: 'lunes', cat: 'empuje · tríceps', dose: '3 × 8–12', tempo: '3-1-1', asset: 'ico', tint: 'ultra' },
  { ex: 'bulgarian_split', name: 'Sentadilla <em>búlgara</em>', days: 'miércoles', cat: 'glúteo · cuádriceps', dose: '3 × 8–10 / pierna', tempo: '3-1-1', asset: 'squat', tint: 'chrome' },
  { ex: 'tri_overhead', name: 'Tríceps <em>overhead</em>', days: 'lun · vie', cat: 'tríceps · rango largo', dose: '3 × 10–12', tempo: '3-0-1', asset: 'dumbbell', tint: 'hot' },
  { ex: 'band_pullover', name: 'Pullover con <em>banda</em>', days: 'martes', cat: 'dorsal · banda', dose: '3 × 12–15', tempo: '3-1-1', asset: 'band', tint: 'ultra' },
  { ex: 'side_plank_abd', name: 'Plancha <em>lateral</em>', days: 'vie · sáb', cat: 'core lateral', dose: '3 × 20–30 s → 45 s', tempo: 'iso', asset: 'knot', tint: 'lime' },
  { ex: 'bag_rounds', name: 'Rounds de <em>bolsa</em>', days: 'sábado', cat: 'acondicionamiento', dose: '6–8 × 2 min', tempo: '—', asset: 'bag', tint: 'hot' },
  { ex: 'run_z2', name: 'Trote en <em>zona 2</em>', days: 'la costa', cat: 'running · base', dose: '6–10 km', tempo: 'hablar', asset: 'rings', tint: 'chrome' },
];

/* ── geometría wireframe (3D propio) ── */
function icosa(r = 1.1) {
  const t = (1 + Math.sqrt(5)) / 2;
  const raw = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]];
  const s = r / Math.hypot(1, t);
  const v = raw.map((p) => p.map((c) => c * s));
  const e = [];
  for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) if (Math.abs(Math.hypot(v[i][0] - v[j][0], v[i][1] - v[j][1], v[i][2] - v[j][2]) - 2 * s) < 0.01) e.push([i, j]);
  // geodesia: subdividir una vez (puntos medios proyectados a la esfera)
  const mids = new Map(); const V = v.slice(); const E = [];
  const mid = (a, b) => { const k = a < b ? `${a}-${b}` : `${b}-${a}`; if (mids.has(k)) return mids.get(k); const m = [(V[a][0] + V[b][0]) / 2, (V[a][1] + V[b][1]) / 2, (V[a][2] + V[b][2]) / 2]; const l = Math.hypot(...m); V.push(m.map((c) => (c / l) * r)); mids.set(k, V.length - 1); return V.length - 1; };
  for (const [a, b] of e) { const m = mid(a, b); E.push([a, m], [m, b]); }
  for (let i = 12; i < V.length; i++) for (let j = i + 1; j < V.length; j++) if (Math.hypot(V[i][0] - V[j][0], V[i][1] - V[j][1], V[i][2] - V[j][2]) < s * 1.15) E.push([i, j]);
  return { v: V, e: E };
}
function ring(n, r, plane = 'xz', off = [0, 0, 0]) {
  const v = []; const e = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2; const c = Math.cos(a) * r, s = Math.sin(a) * r;
    v.push(plane === 'xz' ? [c + off[0], off[1], s + off[2]] : plane === 'xy' ? [c + off[0], s + off[1], off[2]] : [off[0], c + off[1], s + off[2]]);
    e.push([i, (i + 1) % n]);
  }
  return { v, e };
}
function merge(...gs) { const v = []; const e = []; for (const g of gs) { const o = v.length; v.push(...g.v); e.push(...g.e.map(([a, b]) => [a + o, b + o])); } return { v, e }; }
function dumbbell() {
  const parts = [];
  for (const x of [-1.1, -0.85, 0.85, 1.1]) parts.push(ring(10, x === -1.1 || x === 1.1 ? 0.42 : 0.55, 'yz', [x, 0, 0]));
  const g = merge(...parts);
  // unir los discos de cada lado + la barra
  for (let k = 0; k < 10; k++) { g.e.push([k, 10 + k]); g.e.push([20 + k, 30 + k]); }
  const o = g.v.length; g.v.push([-1.3, 0, 0], [1.3, 0, 0]); g.e.push([o, o + 1]);
  return g;
}
function bag() {
  const parts = [];
  for (let i = 0; i <= 6; i++) parts.push(ring(16, 0.48 - Math.abs(i - 3) * 0.02, 'xz', [0, -1 + i * 0.36, 0]));
  const g = merge(...parts);
  for (let k = 0; k < 16; k += 2) for (let i = 0; i < 6; i++) g.e.push([i * 16 + k, (i + 1) * 16 + k]);
  const o = g.v.length; g.v.push([0, 1.6, 0]); for (let k = 0; k < 16; k += 4) g.e.push([o, 6 * 16 + k]);
  return g;
}
function knot() {
  const v = []; const e = []; const N = 180;
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2; const p = 2, q = 3; const r = 0.72 + 0.32 * Math.cos(q * t);
    v.push([r * Math.cos(p * t), 0.32 * Math.sin(q * t), r * Math.sin(p * t)]); e.push([i, (i + 1) % N]);
  }
  return { v, e };
}
function bandWave() {
  const v = []; const e = []; const cols = 22, rows = 5;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    v.push([-1.3 + (c / (cols - 1)) * 2.6, (r - 2) * 0.12, 0]);
    if (c) e.push([r * cols + c - 1, r * cols + c]);
    if (r) e.push([(r - 1) * cols + c, r * cols + c]);
  }
  return { v, e, wave: true, cols, rows };
}
function rings() { return merge(ring(48, 1.15, 'xz'), ring(48, 0.85, 'xy'), ring(48, 0.6, 'yz')); }

const BUILDERS = { ico: () => icosa(), dumbbell, bag, knot, band: bandWave, rings };

export default {
  id: 'mood-works',
  n: 'M8',
  title: 'Trabajo',
  pol: 'mood',
  app: 'biblioteca',
  bridge: 'Ocho ejercicios cargan la semana. Pasá el mouse y mirá cómo se mueve cada uno.',

  render(ctx) {
    const ex = ctx.data.exById;
    const rows = ROWS.map((r, i) => {
      const e = ex[r.ex];
      const range = e?.repRange ? `${e.repRange[0]}–${e.repRange[1]}${e.unit ? ` ${e.unit}` : ''}` : '';
      return `<div class="fp-mb-works__row" role="listitem" tabindex="0" data-row="${i}" data-asset="${r.asset}" data-tint="${r.tint}" data-label="${ctx.ui.esc((e?.name || r.ex).toUpperCase())} · ${ctx.ui.esc(r.tempo)}">
        <div class="fp-mb-works__name">${r.name}</div>
        <div class="fp-mb-works__col">${ctx.ui.esc(r.days)}</div>
        <div class="fp-mb-works__col">${ctx.ui.esc(r.cat)}</div>
        <div class="fp-mb-works__col fp-mb-works__dose"><span class="fp-data">${ctx.ui.esc(r.dose)}</span>${range ? `<small>rango ${ctx.ui.esc(range)}</small>` : ''}</div>
        <div class="fp-mb-works__col fp-mb-works__tempo"><span class="fp-data">${ctx.ui.esc(r.tempo)}</span></div>
        <div class="fp-mb-works__disc"><a class="fp-mb-works__go" href="#/biblioteca" tabindex="-1">Descubrí ahora →</a></div>
      </div>`;
    }).join('');
    return `
      <span class="fp-mb-works__ghost" aria-hidden="true">Trabajo</span>
      <div class="fp-wrap fp-wrap--wide fp-mb-works">
        <header class="fp-head">
          <span class="fp-eyebrow"><b>M8</b> La lista · plan v1 ${ctx.ui.tag('C')}</span>
          <h2 data-fp-fade>El <em>trabajo</em> de la semana.</h2>
          <p class="fp-lede" data-fp-fade>Como la lista de proyectos de South Hustles, pero con lo que levanto: ejercicio, días, foco, dosis y tempo. Todo sale del plan v1; el rango es el del banco de ejercicios.</p>
        </header>
        <div class="fp-mb-works__head" aria-hidden="true"><span>ejercicio</span><span>cuándo</span><span>foco</span><span>dosis</span><span>tempo</span><span></span></div>
        <div class="fp-mb-works__list" role="list" aria-label="Ejercicios clave de la semana">
          <div class="fp-mb-works__preview" aria-hidden="true" data-tint="hot">
            <canvas></canvas><i class="fp-mb-works__crt"></i><span class="fp-mb-works__label">PREVIEW</span>
          </div>
          ${rows}
        </div>
      </div>`;
  },

  init(el, ctx) {
    const list = el.querySelector('.fp-mb-works__list');
    const prev = el.querySelector('.fp-mb-works__preview');
    const cv = prev.querySelector('canvas');
    const label = prev.querySelector('.fp-mb-works__label');
    const ghost = el.querySelector('.fp-mb-works__ghost');
    const c2 = cv.getContext('2d');
    const reduced = ctx.env.prefersReducedMotion();
    const cache = {};
    let boxer = null;
    ctx.data.boxer().then((raw) => { const n = ctx.ml.normalize(raw, 'boxer.json'); if (n.ok) boxer = n.session; }).catch(() => {});

    let asset = 'ico', tint = 'hot', on = false, visible = false;
    let raf = null, tx = 0, ty = 0, cx = 0, cy = 0, t0 = performance.now();
    let rotX = 0.35, rotY = 0;

    const project = (p, rx, ry, W, H, sc) => {
      let [x, y, z] = p;
      const cyR = Math.cos(ry), syR = Math.sin(ry);
      [x, z] = [x * cyR - z * syR, x * syR + z * cyR];
      const cxR = Math.cos(rx), sxR = Math.sin(rx);
      [y, z] = [y * cxR - z * sxR, y * sxR + z * cxR];
      const f = 3.2 / (3.2 + z);
      return [W / 2 + x * sc * f, H / 2 - y * sc * f, z];
    };

    const drawAsset = (t) => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const W = Math.max(1, Math.round(r.width * dpr)), H = Math.max(1, Math.round(r.height * dpr));
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
      c2.clearRect(0, 0, W, H);
      const sc = Math.min(W, H) * 0.34;
      const ry = rotY + t * 0.7, rx = rotX + Math.sin(t * 0.5) * 0.15;
      c2.lineCap = 'round';
      c2.shadowColor = 'rgba(255,255,255,0.65)';
      c2.shadowBlur = 8 * dpr;
      if (asset === 'pull' || asset === 'squat') {
        // figura de palitos: el boxer.json real de Motion Lab, girando
        if (!boxer) return;
        const f = boxer.frames[Math.floor(t * (asset === 'pull' ? 18 : 24)) % boxer.frames.length];
        const P = f.world.map((p) => [p[0] * 1.5, -(p[1] - 0.05) * 1.5, (p[2] || 0) * 1.5]);
        for (const [a, b, side] of ctx.ml.BONES) {
          const A = project(P[ctx.ml.JOINTS.indexOf(a)], rx * 0.4, ry, W, H, sc), B = project(P[ctx.ml.JOINTS.indexOf(b)], rx * 0.4, ry, W, H, sc);
          c2.strokeStyle = side === 'L' ? 'rgba(255,255,255,0.95)' : side === 'R' ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.85)';
          c2.lineWidth = 2.2 * dpr;
          c2.beginPath(); c2.moveTo(A[0], A[1]); c2.lineTo(B[0], B[1]); c2.stroke();
        }
        for (const p of P) { const q = project(p, rx * 0.4, ry, W, H, sc); c2.fillStyle = '#fff'; c2.beginPath(); c2.arc(q[0], q[1], 2.2 * dpr, 0, Math.PI * 2); c2.fill(); }
        // barra / piso de referencia
        const y0 = asset === 'pull' ? -1.15 : 1.25;
        const L = project([-1.2, y0 * -1, 0], rx * 0.4, ry, W, H, sc), R = project([1.2, y0 * -1, 0], rx * 0.4, ry, W, H, sc);
        c2.strokeStyle = 'rgba(255,255,255,0.4)'; c2.lineWidth = 1.2 * dpr; c2.beginPath(); c2.moveTo(L[0], L[1]); c2.lineTo(R[0], R[1]); c2.stroke();
        return;
      }
      const g = cache[asset] || (cache[asset] = BUILDERS[asset]());
      let V = g.v;
      if (g.wave) V = g.v.map((p, i) => [p[0], p[1] + Math.sin(p[0] * 2.4 + t * 3) * 0.28 * Math.sin(t * 1.3 + (i % g.cols) * 0.1), Math.cos(p[0] * 1.6 + t * 2) * 0.25]);
      const Q = V.map((p) => project(p, rx, ry, W, H, sc));
      for (const [a, b] of g.e) {
        const za = (Q[a][2] + Q[b][2]) / 2;
        const alpha = 0.35 + 0.65 * (1 - (za + 1.3) / 2.6);
        c2.strokeStyle = `rgba(255,255,255,${Math.max(0.15, Math.min(1, alpha)).toFixed(3)})`;
        c2.lineWidth = (0.8 + Math.max(0, alpha) * 1.2) * dpr;
        c2.beginPath(); c2.moveTo(Q[a][0], Q[a][1]); c2.lineTo(Q[b][0], Q[b][1]); c2.stroke();
      }
    };

    // spring 0.18 de initProjects: la preview persigue al puntero
    const tick = (now) => {
      raf = null;
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      prev.style.left = `${cx}px`; prev.style.top = `${cy}px`;
      if (on) drawAsset(reduced ? 0.6 : (now - t0) / 1000);
      if (on || Math.abs(tx - cx) > 0.3 || Math.abs(ty - cy) > 0.3) raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf && visible) raf = requestAnimationFrame(tick); };

    const setRow = (row) => {
      asset = row.dataset.asset; tint = row.dataset.tint;
      prev.dataset.tint = tint;
      label.textContent = row.dataset.label;
      rotY = Math.random() * Math.PI;
    };
    const rows = [...list.querySelectorAll('.fp-mb-works__row')];
    rows.forEach((row) => {
      row.addEventListener('pointerenter', (e) => {
        setRow(row); on = true; prev.classList.add('is-visible');
        const lr = list.getBoundingClientRect();
        if (!prev.dataset.placed) { cx = tx = e.clientX - lr.left; cy = ty = e.clientY - lr.top; prev.dataset.placed = '1'; }
        kick();
      });
      row.addEventListener('pointermove', (e) => { const lr = list.getBoundingClientRect(); tx = e.clientX - lr.left; ty = e.clientY - lr.top; kick(); });
      row.addEventListener('pointerleave', () => { on = false; prev.classList.remove('is-visible'); });
      row.addEventListener('click', () => ctx.openApp('biblioteca'));
      row.addEventListener('keydown', (e) => { if (e.key === 'Enter') ctx.openApp('biblioteca'); });
      row.addEventListener('focus', () => {
        setRow(row); on = true; prev.classList.add('is-visible');
        const lr = list.getBoundingClientRect(), rr = row.getBoundingClientRect();
        tx = rr.left - lr.left + rr.width * 0.62; ty = rr.top - lr.top + rr.height / 2; kick();
      });
      row.addEventListener('blur', () => { on = false; prev.classList.remove('is-visible'); });
    });

    ctx.env.onVisible(el, (v) => { visible = v; if (!v) { on = false; prev.classList.remove('is-visible'); } });

    // palabra fantasma con parallax (bus único de scroll)
    if (!reduced) {
      ctx.scroll.onScrollFrame(() => {
        if (!visible) return;
        const p = ctx.scroll.getSectionProgress(el);
        ghost.style.translate = `${(-p * 18).toFixed(2)}vw -50%`;
      });
    }
  },
};
