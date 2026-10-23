// FP · MOOD M9 — globo cromado en wireframe (moodboard: el globo de tubos de cromo).
// Canvas 2D con proyección propia: meridianos y paralelos como tubos metálicos (gradiente cromo, brillo
// especular por profundidad), rotando, con inclinación que sigue al mouse (spring). Alrededor orbitan
// etiquetas HTML: la costa de Franco y su ecosistema. Pausado fuera de pantalla; reduced-motion = 1 frame.
console.log('[fp/mood-globe] init');

const ORBIT = [
  { t: 'La costa · 10 km × 3', tag: 'U', k: 'run', hot: true },
  { t: 'South Hustles', k: 'sh' },
  { t: 'Motion Lab', k: 'ml' },
  { t: 'Ant on Mars', k: 'aom' },
  { t: 'Apacheta', k: 'ap' },
  { t: 'Entrenando duro, durmiendo duro.', k: 'motto', serif: true },
];

export default {
  id: 'mood-globe',
  n: 'M9',
  title: 'Globo',
  pol: 'mood',
  bridge: 'El cuerpo es el centro; el resto orbita.',

  render(ctx) {
    const labels = ORBIT.map((o, i) => `<span class="fp-mb-globe__tag${o.hot ? ' is-hot' : ''}${o.serif ? ' is-serif' : ''}" data-i="${i}">${ctx.ui.esc(o.t)}${o.tag ? ` ${ctx.ui.tag(o.tag)}` : ''}</span>`).join('');
    return `
      <div class="fp-mb-globe">
        <div class="fp-mb-globe__copy fp-wrap">
          <span class="fp-eyebrow"><b>M9</b> Ecosistema · cromo</span>
          <h2 data-fp-fade>Todo lo que <em>construyo</em> gira alrededor del cuerpo.</h2>
          <p class="fp-lede" data-fp-fade>Corro en la costa unos 10 km, tres veces por semana ${ctx.ui.tag('U')}. Codeo Motion Lab para medirme, South Hustles para mostrarlo y esta página para no olvidarme de nada.</p>
          <dl class="fp-mb-globe__stats" data-fp-fade>
            <div><dt>km por salida</dt><dd class="fp-data" data-fp-count="10">10</dd></div>
            <div><dt>salidas / semana</dt><dd class="fp-data" data-fp-count="3">3</dd></div>
            <div><dt>kcal / semana extra</dt><dd class="fp-data">1.500–2.000</dd></div>
          </dl>
          <p class="fp-small">Ritmo «7–8» ${ctx.ui.tag('?')}: se pide en min/km al registrar una salida. Cardio vs masa: opción A o B en el plan.</p>
        </div>
        <div class="fp-mb-globe__stage" aria-hidden="true">
          <canvas class="fp-mb-globe__cv"></canvas>
          <div class="fp-mb-globe__tags">${labels}</div>
        </div>
      </div>`;
  },

  init(el, ctx) {
    const stage = el.querySelector('.fp-mb-globe__stage');
    const cv = el.querySelector('.fp-mb-globe__cv');
    const c = cv.getContext('2d');
    const tags = [...el.querySelectorAll('.fp-mb-globe__tag')];
    const reduced = ctx.env.prefersReducedMotion();
    let visible = false, raf = null, t = 0, last = performance.now();
    let mx = 0, my = 0, tiltX = 0.38, tiltY = 0;

    // geometría: 10 meridianos + 7 paralelos, polilíneas de 64 puntos
    const lines = [];
    const N = 64;
    for (let m = 0; m < 10; m++) {
      const lon = (m / 10) * Math.PI;
      const pts = [];
      for (let i = 0; i <= N; i++) { const lat = (i / N) * Math.PI * 2; pts.push([Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)]); }
      lines.push({ pts, w: 1 });
    }
    for (let p = 1; p < 8; p++) {
      const lat = -Math.PI / 2 + (p / 8) * Math.PI;
      const pts = [];
      for (let i = 0; i <= N; i++) { const lon = (i / N) * Math.PI * 2; pts.push([Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)]); }
      lines.push({ pts, w: p === 4 ? 1.35 : 1 });
    }
    // «ruta de la costa»: arco caliente sobre el ecuador inclinado
    const route = [];
    for (let i = 0; i <= 40; i++) { const lon = -0.6 + (i / 40) * 1.4; const lat = 0.28 + Math.sin(i / 6) * 0.05; route.push([Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)]); }

    const rot = (p, ry, rx) => {
      let [x, y, z] = p;
      const cy = Math.cos(ry), sy = Math.sin(ry);
      [x, z] = [x * cy - z * sy, x * sy + z * cy];
      const cx = Math.cos(rx), sx = Math.sin(rx);
      [y, z] = [y * cx - z * sx, y * sx + z * cx];
      return [x, y, z];
    };

    const draw = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      const W = Math.max(1, Math.round(r.width * dpr)), H = Math.max(1, Math.round(r.height * dpr));
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
      c.clearRect(0, 0, W, H);
      const R = Math.min(W, H) * 0.36;
      const ox = W / 2, oy = H / 2;
      const ry = t * 0.22 + tiltY, rx = tiltX;
      const P = (p) => { const q = rot(p, ry, rx); const f = 3 / (3 + q[2]); return [ox + q[0] * R * f, oy - q[1] * R * f, q[2]]; };

      // halo detrás
      const halo = c.createRadialGradient(ox, oy, R * 0.2, ox, oy, R * 1.5);
      halo.addColorStop(0, 'rgba(255,255,255,0.10)'); halo.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = halo; c.fillRect(0, 0, W, H);

      // segmentos ordenados por profundidad (atrás → adelante)
      const segs = [];
      for (const L of lines) {
        const Q = L.pts.map(P);
        for (let i = 0; i < Q.length - 1; i++) segs.push([Q[i], Q[i + 1], (Q[i][2] + Q[i + 1][2]) / 2, L.w]);
      }
      segs.sort((a, b) => b[2] - a[2]);
      const chrome = c.createLinearGradient(0, oy - R, 0, oy + R);
      chrome.addColorStop(0, '#ffffff'); chrome.addColorStop(0.22, '#c9c9c9'); chrome.addColorStop(0.46, '#4a4a4a');
      chrome.addColorStop(0.54, '#f2f2f2'); chrome.addColorStop(0.72, '#8e8e8e'); chrome.addColorStop(1, '#ffffff');
      c.lineCap = 'round';
      for (const [a, b, z, w] of segs) {
        const front = 1 - (z + 1) / 2; // 0 atrás → 1 adelante
        const base = (2 + front * 9) * w * dpr;
        // tubo: sombra oscura → cuerpo cromado → brillo especular fino
        c.globalAlpha = 0.25 + front * 0.75;
        c.strokeStyle = 'rgba(10,10,10,0.9)'; c.lineWidth = base * 1.25;
        c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
        c.strokeStyle = chrome; c.lineWidth = base;
        c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
        c.strokeStyle = `rgba(255,255,255,${(0.25 + front * 0.6).toFixed(3)})`; c.lineWidth = Math.max(0.6, base * 0.22);
        c.beginPath(); c.moveTo(a[0] - base * 0.18, a[1] - base * 0.22); c.lineTo(b[0] - base * 0.18, b[1] - base * 0.22); c.stroke();
      }
      c.globalAlpha = 1;
      // ruta caliente (solo la cara visible)
      const RQ = route.map(P);
      c.strokeStyle = '#ff3d1a'; c.shadowColor = '#ff3d1a'; c.shadowBlur = 14 * dpr; c.lineWidth = 3.2 * dpr;
      c.beginPath(); let started = false;
      for (const q of RQ) { if (q[2] > 0.15) { started = false; continue; } if (!started) { c.moveTo(q[0], q[1]); started = true; } else c.lineTo(q[0], q[1]); }
      c.stroke(); c.shadowBlur = 0;

      // etiquetas en órbita (HTML): posición, escala y opacidad por profundidad
      const sw = stage.clientWidth, sh = stage.clientHeight, Rs = Math.min(sw, sh) * 0.36;
      tags.forEach((tag, i) => {
        const a = t * 0.35 + (i / tags.length) * Math.PI * 2;
        const incl = 0.45 + (i % 3) * 0.18;
        const p = rot([Math.cos(a) * 1.42, Math.sin(a) * Math.sin(incl) * 0.6, Math.sin(a) * 1.42], 0, rx * 0.5);
        const f = 3 / (3 + p[2]);
        const x = sw / 2 + p[0] * Rs * f, y = sh / 2 - p[1] * Rs * f;
        const front = 1 - (p[2] + 1.5) / 3;
        tag.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%) scale(${(0.72 + front * 0.4).toFixed(3)})`;
        tag.style.opacity = (0.25 + front * 0.75).toFixed(3);
        tag.style.zIndex = p[2] < 0 ? '3' : '1';
      });
    };

    const loop = (now) => {
      raf = null;
      if (!visible) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      t += dt;
      tiltX += ((0.38 + my * 0.35) - tiltX) * 0.06;
      tiltY += ((mx * 0.6) - tiltY) * 0.06;
      draw();
      raf = requestAnimationFrame(loop);
    };

    if (ctx.env.fxEnabled()) {
      stage.addEventListener('pointermove', (e) => {
        const r = stage.getBoundingClientRect();
        mx = ((e.clientX - r.left) / r.width - 0.5) * 2; my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      });
      stage.addEventListener('pointerleave', () => { mx = 0; my = 0; });
    }
    new ResizeObserver(() => { if (!raf) draw(); }).observe(stage);
    if (reduced) { t = 1.2; requestAnimationFrame(draw); return; }
    ctx.env.onVisible(el, (v) => { visible = v; if (v && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); } });
  },
};
