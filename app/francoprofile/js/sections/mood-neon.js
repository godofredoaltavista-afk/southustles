// FP · MOOD M12 — neón lima sobre negro granulado (moodboard: el scan «Pluhma» / rayos X verdes).
// El esqueleto REAL del boxer.json de Motion Lab en lima con estela, ruido B&N animado de fondo,
// ficha técnica en mono y un barrido de escáner que recorre el cuerpo con el scroll: lo que toca, se etiqueta.
console.log('[fp/mood-neon] init');

const LIME = '#c6ff1a';

export default {
  id: 'mood-neon',
  n: 'M12',
  title: 'Scan',
  pol: 'mood',
  app: 'lab',
  bridge: 'Importá tu JSON de Motion Lab y el escáner corre sobre tu sesión.',

  render(ctx) {
    return `
      <div class="fp-mb-neon">
        <div class="fp-mb-neon__sticky">
          <i class="fp-mb-neon__noise" aria-hidden="true"></i>
          <canvas class="fp-mb-neon__cv" aria-hidden="true"></canvas>
          <i class="fp-mb-neon__scan" aria-hidden="true"><b class="fp-data" data-scan>SCAN 000</b></i>
          <div class="fp-mb-neon__grid fp-wrap fp-wrap--wide">
            <div class="fp-mb-neon__copy">
              <span class="fp-eyebrow"><b>M12</b> Motion Lab · scan</span>
              <h2 data-fp-fade>Lo que el ojo no ve, el <em>esqueleto</em> lo cuenta.</h2>
              <p class="fp-lede" data-fp-fade>21 puntos, 30 cuadros por segundo. Este es el combo de sombra real que trae Motion Lab de demo: el escáner baja con tu scroll y etiqueta cada articulación que cruza.</p>
              <a class="fp-btn fp-mb-neon__cta" href="#/lab" data-fp-magnetic>Abrir el Lab →</a>
            </div>
            <dl class="fp-mb-neon__sheet fp-data" data-fp-fade="right">
              <div><dt>FICHA</dt><dd>SCAN · 01</dd></div>
              <div><dt>JOINTS</dt><dd>21</dd></div>
              <div><dt>FPS</dt><dd data-k="fps">30</dd></div>
              <div><dt>FRAMES</dt><dd data-k="frames">—</dd></div>
              <div><dt>DURACIÓN</dt><dd data-k="dur">—</dd></div>
              <div><dt>MOTOR</dt><dd>MediaPipe · world (m)</dd></div>
              <div><dt>FUENTE</dt><dd>boxer.json · demo</dd></div>
              <div><dt>GOLPES*</dt><dd data-k="punch">—</dd></div>
              <div><dt>SIMETRÍA*</dt><dd data-k="sym">—</dd></div>
              <div class="is-wide"><dt>COMBO</dt><dd data-k="note">—</dd></div>
              <div class="is-wide"><dt>*</dt><dd>estimado a partir de los puntos</dd></div>
            </dl>
          </div>
        </div>
      </div>`;
  },

  async init(el, ctx) {
    const root = el.querySelector('.fp-mb-neon');
    const sticky = el.querySelector('.fp-mb-neon__sticky');
    const cv = el.querySelector('.fp-mb-neon__cv');
    const scanEl = el.querySelector('.fp-mb-neon__scan');
    const scanLbl = el.querySelector('[data-scan]');
    const c = cv.getContext('2d');
    const reduced = ctx.env.prefersReducedMotion();
    let s = null;
    try {
      const raw = await ctx.data.boxer();
      const n = ctx.ml.normalize(raw, 'boxer.json');
      if (!n.ok) return;
      s = n.session;
      const m = ctx.ml.metrics(s);
      const set = (k, v) => { const d = el.querySelector(`[data-k="${k}"]`); if (d) d.textContent = v; };
      set('fps', String(s.fps)); set('frames', String(s.frames.length)); set('dur', `${m.durationS} s`);
      set('punch', `${m.punches.total} (izq ${m.punches.l} · der ${m.punches.r})`);
      set('sym', m.symmetryPct != null ? `${m.symmetryPct} %` : '—');
      set('note', (s.note || '').split(',')[0] || 'sombra de boxeo');
    } catch { return; }

    // caja de encuadre (world, y hacia abajo)
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const f of s.frames) for (const p of f.pts) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
    const J = ctx.ml.JOINTS;
    const LABEL = { l_wrist: 'muñeca izq', r_wrist: 'muñeca der', l_elbow: 'codo izq', r_elbow: 'codo der', l_knee: 'rodilla izq', r_knee: 'rodilla der', l_shoulder: 'hombro izq', r_shoulder: 'hombro der', l_hip: 'cadera izq', r_hip: 'cadera der', nose: 'cabeza', l_ankle: 'tobillo izq', r_ankle: 'tobillo der' };
    let visible = false, raf = null, tMs = 0, last = 0, scanY = 0.35;

    const frameAt = (ms) => s.frames[Math.floor((ms / 1000) * s.fps) % s.frames.length];

    const draw = (fade = true) => {
      const r = sticky.getBoundingClientRect();
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      const W = Math.max(1, Math.round(r.width * dpr)), H = Math.max(1, Math.round(r.height * dpr));
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; fade = false; }
      // estela: borrar parcialmente (mantiene la transparencia sobre el ruido)
      c.globalCompositeOperation = 'destination-out';
      c.fillStyle = fade ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,1)';
      c.fillRect(0, 0, W, H);
      c.globalCompositeOperation = 'source-over';
      const mobile = W / dpr < 760;
      const sc = Math.min((W * (mobile ? 0.9 : 0.5)) / (x1 - x0), (H * 0.78) / (y1 - y0));
      const ox = (mobile ? W * 0.5 : W * 0.66) - ((x0 + x1) / 2) * sc, oy = H * 0.52 - ((y0 + y1) / 2) * sc;
      const f = frameAt(tMs);
      const X = (p) => p[0] * sc + ox, Y = (p) => p[1] * sc + oy;
      c.lineCap = 'round';
      // hueso: halo grueso + núcleo fino (rayos X)
      for (const pass of [0, 1]) {
        c.strokeStyle = pass ? '#f4ffd6' : LIME;
        c.shadowColor = LIME; c.shadowBlur = pass ? 6 * dpr : 22 * dpr;
        c.globalAlpha = pass ? 0.9 : 0.55;
        c.lineWidth = (pass ? 1.6 : 7) * dpr;
        for (const [a, b] of ctx.ml.BONES) {
          const pa = f.pts[J.indexOf(a)], pb = f.pts[J.indexOf(b)];
          c.beginPath(); c.moveTo(X(pa), Y(pa)); c.lineTo(X(pb), Y(pb)); c.stroke();
        }
      }
      c.globalAlpha = 1; c.shadowBlur = 0;
      // escáner: articulaciones cerca de la línea → cuadradito + etiqueta + ángulo
      const sy = scanY * H, band = 46 * dpr;
      const ang = ctx.ml.anglesOf(f);
      const angOf = { l_elbow: ang.codo_izq, r_elbow: ang.codo_der, l_knee: ang.rodilla_izq, r_knee: ang.rodilla_der, l_shoulder: ang.hombro_izq, r_shoulder: ang.hombro_der, l_hip: ang.cadera_izq, r_hip: ang.cadera_der };
      c.font = `500 ${10.5 * dpr}px "JetBrains Mono", monospace`;
      f.pts.forEach((p, k) => {
        const name = J[k];
        const x = X(p), y = Y(p), d = Math.abs(y - sy);
        if (d > band || !LABEL[name]) { c.fillStyle = 'rgba(198,255,26,0.55)'; c.fillRect(x - 2 * dpr, y - 2 * dpr, 4 * dpr, 4 * dpr); return; }
        const k1 = 1 - d / band;
        c.strokeStyle = LIME; c.lineWidth = 1 * dpr; c.globalAlpha = 0.4 + k1 * 0.6;
        c.strokeRect(x - 6 * dpr, y - 6 * dpr, 12 * dpr, 12 * dpr);
        const lx = name.startsWith('l_') ? x - 150 * dpr : x + 16 * dpr;
        c.beginPath(); c.moveTo(x + (name.startsWith('l_') ? -6 : 6) * dpr, y); c.lineTo(lx + (name.startsWith('l_') ? 130 : 0) * dpr, y); c.stroke();
        c.fillStyle = LIME;
        const a = angOf[name];
        c.fillText(`${LABEL[name].toUpperCase()}${a != null ? ` · ${Math.round(a)}°` : ''}`, lx, y - 5 * dpr);
        c.globalAlpha = 1;
      });
      scanLbl.textContent = `SCAN ${String(Math.round(scanY * 999)).padStart(3, '0')} · F${String(s.frames.indexOf(f)).padStart(3, '0')}`;
    };

    const scrollUpdate = () => {
      const p = ctx.scroll.getInnerProgress(root);
      scanY = 0.12 + p * 0.78;
      scanEl.style.transform = `translateY(${(scanY * 100).toFixed(2)}vh)`;
    };

    if (reduced) {
      tMs = 600; scrollUpdate(); draw(false);
      ctx.scroll.onScrollFrame(() => { if (visible) { scrollUpdate(); draw(false); } });
      ctx.env.onVisible(el, (v) => { visible = v; });
      new ResizeObserver(() => draw(false)).observe(sticky);
      return;
    }
    const loop = (now) => {
      raf = null;
      if (!visible) return;
      tMs += Math.min(100, now - last); last = now;
      draw(true);
      raf = requestAnimationFrame(loop);
    };
    ctx.scroll.onScrollFrame(() => { if (visible) scrollUpdate(); });
    ctx.env.onVisible(el, (v) => {
      visible = v;
      el.classList.toggle('is-live', v);
      if (v && !raf) { last = performance.now(); scrollUpdate(); raf = requestAnimationFrame(loop); }
    });
  },
};
