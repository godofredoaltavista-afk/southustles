// FP · MOOD M15 — editorial (moodboard: «Contemporaneidade, Tecnologia… & Convergência» + «TRANSCENDENCE»).
// Manifiesto tipográfico que mezcla serif itálica, outline, condensada, rayos y anillos SVG y recuadros de grano;
// al lado, la columna «ENSAYOS SOBRE EL CUERPO · No. 1» con texto vertical en los bordes y un busto de
// partículas (canvas 2D, luz cenital, respira y sigue al mouse). Pie: «DE 57 KG a 65 KG».
console.log('[fp/mood-editorial] init');

const burst = (n = 36) => `<svg class="fp-mb-ed__burst" viewBox="0 0 100 100" aria-hidden="true">${Array.from({ length: n }, (_, i) => {
  const a = (i / n) * Math.PI * 2; const r0 = i % 2 ? 14 : 8;
  return `<line x1="${(50 + Math.cos(a) * r0).toFixed(2)}" y1="${(50 + Math.sin(a) * r0).toFixed(2)}" x2="${(50 + Math.cos(a) * 48).toFixed(2)}" y2="${(50 + Math.sin(a) * 48).toFixed(2)}"/>`;
}).join('')}</svg>`;

const rings = () => `<svg class="fp-mb-ed__rings" viewBox="0 0 160 60" aria-hidden="true">${Array.from({ length: 9 }, (_, i) => `<ellipse cx="${40 + i * 2.5}" cy="30" rx="${26 - i * 1.6}" ry="26"/><ellipse cx="${120 - i * 2.5}" cy="30" rx="${26 - i * 1.6}" ry="26"/>`).join('')}</svg>`;

const sparkle = () => '<svg class="fp-mb-ed__spark" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 0 L22 18 L40 20 L22 22 L20 40 L18 22 L0 20 L18 18 Z"/></svg>';

export default {
  id: 'mood-editorial',
  n: 'M15',
  title: 'Ensayo',
  pol: 'mood',
  app: 'biblioteca',

  render(ctx) {
    const story = (ctx.data.profile.story || []).join(' ');
    const vert = 'Entrenando duro, durmiendo duro · Córdoba · Atleta híbrido · Calistenia, boxeo, running · ';
    return `
      <div class="fp-mb-ed">
        <i class="fp-mb-ed__grain" aria-hidden="true"></i>
        <div class="fp-wrap fp-wrap--wide fp-mb-ed__grid">
          <div class="fp-mb-ed__manifesto" role="group" aria-label="Manifiesto: Fuerza, Tensión, Agua, Sueño, Sol, Recuperación y Movimiento.">
            <span class="fp-eyebrow fp-mb-ed__eyebrow"><b>M15</b> Manifiesto · siete palabras</span>
            <p class="fp-mb-ed__l fp-mb-ed__l--1" data-fp-fade><span class="fp-mb-ed__serif">Fuerza,</span> ${sparkle()}</p>
            <p class="fp-mb-ed__l fp-mb-ed__l--2" data-fp-fade><em class="fp-mb-ed__it">Tensión,</em> <span class="fp-mb-ed__photo" aria-hidden="true"><i></i></span></p>
            <p class="fp-mb-ed__l fp-mb-ed__l--3" data-fp-fade>${burst()} <span class="fp-mb-ed__outline fp-mb-ed__under">Agua,</span></p>
            <p class="fp-mb-ed__l fp-mb-ed__l--4" data-fp-fade><span class="fp-mb-ed__serif">Sueño,</span> ${rings()} <span class="fp-mb-ed__serif">Sol,</span></p>
            <p class="fp-mb-ed__l fp-mb-ed__l--5" data-fp-fade><span class="fp-mb-ed__photo fp-mb-ed__photo--b" aria-hidden="true"><i></i></span> <em class="fp-mb-ed__it fp-mb-ed__outline">Recuperación</em></p>
            <p class="fp-mb-ed__l fp-mb-ed__l--6" data-fp-fade><span class="fp-mb-ed__amp">&amp;</span> <span class="fp-mb-ed__serif">Movimiento.</span></p>
            <p class="fp-mb-ed__l fp-mb-ed__l--7" data-fp-fade><span class="fp-mb-ed__outline fp-mb-ed__under">Convergencia.</span>
              <svg class="fp-mb-ed__circ" viewBox="0 0 120 120" aria-hidden="true"><defs><path id="fp-mb-ed-circ" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0"/></defs><text><textPath href="#fp-mb-ed-circ">entrenando duro · durmiendo duro · </textPath></text></svg>
            </p>
          </div>

          <aside class="fp-mb-ed__essay" aria-label="Ensayos sobre el cuerpo, número 1">
            <div class="fp-mb-ed__meta fp-data"><span>Percepciones<br/>Método · Cuerpo</span><span>South Hustles Studio<br/>MMXXVI</span><span>Pp. 1<br/>del ectomorfo al híbrido</span></div>
            <h3 class="fp-mb-ed__title" data-fp-fade><span>TRANSFORMA</span><span class="fp-mb-ed__glitch" data-t="CIÓN">CIÓN</span></h3>
            <p class="fp-mb-ed__sub">Ensayos sobre el cuerpo</p>
            <span class="fp-mb-ed__no fp-data">No. 1</span>
            <div class="fp-mb-ed__frame">
              <p class="fp-mb-ed__vert fp-mb-ed__vert--l" aria-hidden="true">${ctx.ui.esc(vert.repeat(3))}</p>
              <canvas class="fp-mb-ed__bust" aria-hidden="true"></canvas>
              <p class="fp-mb-ed__vert fp-mb-ed__vert--r" aria-hidden="true">${ctx.ui.esc(vert.repeat(3))}</p>
            </div>
            <p class="fp-mb-ed__foot">DE 57 KG <em>a</em> 65 KG ${ctx.ui.tag('U')}</p>
            <p class="fp-mb-ed__fine fp-data">${ctx.ui.esc(story)}</p>
          </aside>
        </div>
      </div>`;
  },

  init(el, ctx) {
    const cv = el.querySelector('.fp-mb-ed__bust');
    const c = cv.getContext('2d');
    const reduced = ctx.env.prefersReducedMotion();
    // busto procedural: cabeza (elipsoide) + cuello (cilindro) + hombros/pecho (medio elipsoide ancho)
    let s = 7;
    const R = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
    const pts = [];
    const add = (x, y, z, nx, ny, nz) => { const l = Math.hypot(nx, ny, nz) || 1; pts.push([x, y, z, nx / l, ny / l, nz / l, R()]); };
    for (let i = 0; i < 1500; i++) { // cabeza
      const u = R() * Math.PI * 2, v = Math.acos(2 * R() - 1);
      const x = Math.sin(v) * Math.cos(u), y = Math.cos(v), z = Math.sin(v) * Math.sin(u);
      add(x * 0.46, -0.78 + y * 0.6, z * 0.52, x / 0.46, y / 0.6, z / 0.52);
    }
    for (let i = 0; i < 360; i++) { // cuello
      const u = R() * Math.PI * 2, h = R();
      add(Math.cos(u) * 0.22, -0.18 + h * 0.3, Math.sin(u) * 0.22, Math.cos(u), 0, Math.sin(u));
    }
    for (let i = 0; i < 1900; i++) { // hombros + pecho
      const u = R() * Math.PI * 2, v = Math.acos(R());
      const x = Math.sin(v) * Math.cos(u), y = Math.cos(v), z = Math.sin(v) * Math.sin(u);
      add(x * 1.05, 0.12 + (1 - y) * 0.75, z * 0.42, x / 1.05, -y / 0.75 + 0.2, z / 0.42);
    }
    const L = [-0.45, -0.8, -0.4]; const ll = Math.hypot(...L); L[0] /= ll; L[1] /= ll; L[2] /= ll;
    let visible = false, raf = null, t = 0, last = 0, yaw = 0.25, tYaw = 0.25, pitch = 0.05, tPitch = 0.05;

    const draw = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const W = Math.max(1, Math.round(r.width * dpr)), H = Math.max(1, Math.round(r.height * dpr));
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
      c.clearRect(0, 0, W, H);
      const sc = Math.min(W * 0.4, H * 0.42), ox = W / 2, oy = H * 0.5;
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const breathe = 1 + Math.sin(t * 1.1) * 0.012;
      const out = [];
      for (const p of pts) {
        let x = p[0] * cy - p[2] * sy, z = p[0] * sy + p[2] * cy, y = p[1] * breathe;
        let nx = p[3] * cy - p[5] * sy, nz = p[3] * sy + p[5] * cy, ny = p[4];
        [y, z] = [y * cp - z * sp, y * sp + z * cp];
        [ny, nz] = [ny * cp - nz * sp, ny * sp + nz * cp];
        if (nz > 0.35) continue; // cara de atrás: no se ve
        const lum = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]); // L apunta hacia la luz (arriba-izq-frente)
        const f = 3 / (3 + z);
        out.push([ox + x * sc * f, oy + y * sc * f, z, lum, p[6]]);
      }
      out.sort((a, b) => b[2] - a[2]);
      for (const [x, y, , lum, k] of out) {
        // tramado tipo grabado: el brillo decide si el punto se prende (umbral por punto, estable)
        const g = Math.round(40 + lum * 215);
        if (lum + 0.15 < k * 0.9) continue;
        c.fillStyle = `rgb(${g},${g},${g})`;
        const sz = (0.9 + lum * 1.6) * dpr;
        c.fillRect(x, y, sz, sz);
      }
      // pedestal
      c.strokeStyle = 'rgba(239,231,212,0.35)'; c.lineWidth = 1 * dpr;
      c.beginPath(); c.moveTo(ox - sc * 1.1, oy + sc * 0.92); c.lineTo(ox + sc * 1.1, oy + sc * 0.92); c.stroke();
    };

    const loop = (now) => {
      raf = null;
      if (!visible) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
      tYaw += Math.sin(t * 0.25) * 0.0008;
      yaw += (tYaw - yaw) * 0.05; pitch += (tPitch - pitch) * 0.05;
      draw();
      raf = requestAnimationFrame(loop);
    };
    new ResizeObserver(() => { if (!raf) draw(); }).observe(cv);
    if (reduced) { requestAnimationFrame(draw); return; }
    if (ctx.env.fxEnabled()) {
      el.addEventListener('pointermove', (e) => {
        const r = cv.getBoundingClientRect();
        tYaw = 0.25 + ((e.clientX - (r.left + r.width / 2)) / window.innerWidth) * 1.2;
        tPitch = 0.05 + ((e.clientY - (r.top + r.height / 2)) / window.innerHeight) * 0.5;
      });
    }
    ctx.env.onVisible(el, (v) => { visible = v; el.classList.toggle('is-live', v); if (v && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); } });
  },
};
