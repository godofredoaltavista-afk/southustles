// FP · MOOD M2 — HUD cinematográfico («S200 PST / 08.10» del moodboard) → «22.12 · −N DÍAS».
// Foto granulada B&N generada en canvas: el boxeo de sombra real de Motion Lab (boxer.json) como silueta
// bajo un spot, en cámara lenta, con grano que se mueve. Letterbox que se abre con el scroll, micro-texto mono
// en las esquinas, timecode, coordenadas del puntero y una timeline del cambio de hábitos a la meta.
console.log('[fp/mood-cine] init');

const pad = (n, l = 2) => String(Math.floor(n)).padStart(l, '0');

function noiseTiles(n = 3, size = 192) {
  const out = [];
  for (let k = 0; k < n; k++) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d');
    const img = g.createImageData(size, size);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    out.push(c);
  }
  return out;
}

export default {
  id: 'mood-cine',
  n: 'M2',
  title: 'Cuenta regresiva',
  pol: 'mood',
  render(ctx) {
    const today = ctx.M.todayISO();
    const days = ctx.M.daysBetween(today, '2026-12-22');
    const t = ctx.M.parseISO(today);
    const startISO = '2026-05-23'; // ≈ 5 meses antes de hoy: cambio de hábitos [U]
    const total = ctx.M.daysBetween(startISO, '2026-12-22');
    const done = Math.max(0, Math.min(1, ctx.M.daysBetween(startISO, today) / total));
    const left = days > 0 ? `−${days} DÍAS` : days === 0 ? 'HOY' : `+${-days} DÍAS`;
    return `
<div class="fp-mc" data-mc>
  <div class="fp-mc__bar fp-mc__bar--top" aria-hidden="true"></div>
  <div class="fp-mc__bar fp-mc__bar--bot" aria-hidden="true"></div>
  <div class="fp-mc__frame">
    <canvas class="fp-mc__photo" role="img" aria-label="Retrato granulado en blanco y negro: el boxeo de sombra de Franco registrado en Motion Lab, en cámara lenta"></canvas>
    <div class="fp-mc__vignette" aria-hidden="true"></div>
    <div class="fp-mc__brackets" aria-hidden="true"><i></i><i></i><i></i><i></i></div>

    <div class="fp-mc__c fp-mc__c--tl fp-data">
      <b>FRANCO · PRIMARY SET DEFINITION</b>
      <span>META · 65–65,5 KG ${ctx.ui.tag('U')}</span>
      <span>BANDA +0,5–1 KG/MES ${ctx.ui.tag('C')}</span>
      <span>NO SE PROMETE · SE REGISTRA</span>
    </div>
    <div class="fp-mc__c fp-mc__c--tr fp-data">
      <b><i class="fp-mc__rec"></i>REC <span data-mc-tc>00:00:00:00</span></b>
      <span>TEMPO 3-1-1 · RIR 1–2</span>
      <span>SUBIDÓN → FUERZA → BOLSA</span>
      <span>SHOT ${pad(t.getDate())}.${pad(t.getMonth() + 1)} · TAKE 04</span>
    </div>
    <div class="fp-mc__c fp-mc__c--bl">
      <p class="fp-mc__kicker fp-data">COUNTDOWN · FECHA DE LA META</p>
      <b class="fp-mc__date" data-fp-fade="scale">22.12</b>
      <span class="fp-mc__left" data-fp-fade data-fp-delay="120">${left}</span>
    </div>
    <div class="fp-mc__c fp-mc__c--br fp-data">
      <span>X:<b data-mc-x>0.50</b> Y:<b data-mc-y>0.50</b></span>
      <span>MOTION LAB · BOXER.JSON · 30 FPS · ×0,5</span>
      <span>SUBJECT · 27 · CÓRDOBA</span>
    </div>
    <div class="fp-mc__rounds">
      <button type="button" class="fp-mc__round" data-mc-grain aria-pressed="true" aria-label="Grano de película">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 8l8 8M16 8l-8 8"/></svg>
      </button>
      <button type="button" class="fp-mc__round" data-mc-play aria-pressed="true" aria-label="Pausar o reproducir">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M10 8v8M14 8v8"/></svg>
      </button>
      <span class="fp-mc__round fp-mc__round--ghost" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 6v12M6 12h12"/></svg></span>
    </div>
    <div class="fp-mc__timeline" style="--p:${(done * 100).toFixed(1)}%">
      <div class="fp-mc__tl-track"><i></i><b class="fp-mc__tl-now"></b></div>
      <div class="fp-mc__tl-labels fp-data"><span>≈ MAY 2026 · CAMBIO DE HÁBITOS ${ctx.ui.tag('U')}</span><span>HOY</span><span>22.12 · META ${ctx.ui.tag('U')}</span></div>
    </div>
  </div>
  <p class="fp-mc__caption" data-fp-fade><em>Dos meses.</em> Una meta declarada y una banda realista, lado a lado. La app muestra la fecha; no la promete.</p>
</div>`;
  },
  async init(el, ctx) {
    const cv = el.querySelector('.fp-mc__photo');
    const frame = el.querySelector('.fp-mc__frame');
    const tc = el.querySelector('[data-mc-tc]');
    const bx = el.querySelector('[data-mc-x]'), by = el.querySelector('[data-mc-y]');
    const grainBtn = el.querySelector('[data-mc-grain]'), playBtn = el.querySelector('[data-mc-play]');
    const reduced = ctx.env.prefersReducedMotion();
    let grainOn = true, playing = !reduced, visible = false, raf = null;

    // letterbox que se abre con el scroll
    ctx.scroll.onScrollFrame(() => {
      if (!visible) return;
      const p = ctx.scroll.getSectionProgress(el);
      const open = Math.min(1, Math.max(0, (p - 0.12) / 0.38));
      el.style.setProperty('--fp-mc-open', (1 - open * (2 - open)).toFixed(3));
    });

    // coordenadas del puntero
    frame.addEventListener('pointermove', (e) => {
      const r = frame.getBoundingClientRect();
      bx.textContent = ((e.clientX - r.left) / r.width).toFixed(2);
      by.textContent = ((e.clientY - r.top) / r.height).toFixed(2);
    });

    let frames = null;
    try { frames = (await ctx.data.boxer()).frames; } catch { frames = null; }
    const J = ctx.ml.J, BONES = ctx.ml.BONES;
    const tiles = noiseTiles();
    const low = document.createElement('canvas');
    const lg = low.getContext('2d');
    const g = cv.getContext('2d');

    // caja de la pose para encuadrar
    let box = null;
    if (frames) {
      let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
      for (const f of frames) for (const p of f) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
      box = { x0, x1, y0, y1 };
    }

    let fi = 0, acc = 0, last = performance.now(), t0 = performance.now(), tick = 0;
    const draw = (now) => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      const W = Math.max(1, Math.round(r.width * dpr)), H = Math.max(1, Math.round(r.height * dpr));
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
      const lw = 320, lh = Math.max(1, Math.round(lw * (H / W)));
      if (low.width !== lw || low.height !== lh) { low.width = lw; low.height = lh; }
      // spot de estudio
      const grd = lg.createRadialGradient(lw * 0.58, lh * 0.32, 4, lw * 0.58, lh * 0.45, lw * 0.75);
      grd.addColorStop(0, '#8d8d8d'); grd.addColorStop(0.45, '#3a3a3a'); grd.addColorStop(1, '#070707');
      lg.globalCompositeOperation = 'source-over'; lg.filter = 'none';
      lg.fillStyle = grd; lg.fillRect(0, 0, lw, lh);
      // piso
      lg.fillStyle = 'rgba(255,255,255,0.05)'; lg.fillRect(0, lh * 0.83, lw, lh * 0.17);
      if (frames && box) {
        const f = frames[fi];
        const bw = box.x1 - box.x0, bh = box.y1 - box.y0;
        const sc = (lh * 0.78) / bh;
        const ox = lw * 0.6 - ((box.x0 + box.x1) / 2) * sc, oy = lh * 0.08 - box.y0 * sc;
        const X = (p) => p[0] * sc + ox, Y = (p) => p[1] * sc + oy;
        // sombra proyectada
        lg.filter = 'blur(4px)'; lg.fillStyle = 'rgba(0,0,0,0.55)';
        lg.beginPath(); lg.ellipse(X(f[J.l_hip]) + 6, lh * 0.86, bw * sc * 0.55, lh * 0.03, 0, 0, Math.PI * 2); lg.fill();
        // silueta clara (el cuerpo bajo el spot)
        lg.filter = 'blur(1.4px)'; lg.strokeStyle = '#e9e9e9'; lg.lineCap = 'round'; lg.lineJoin = 'round';
        for (const [a, b] of BONES) {
          const pa = f[J[a]], pb = f[J[b]];
          const limb = /knee|hip|shoulder/.test(a) && /knee|ankle|elbow|hip/.test(b);
          lg.lineWidth = (limb ? 0.085 : 0.06) * sc; lg.beginPath(); lg.moveTo(X(pa), Y(pa)); lg.lineTo(X(pb), Y(pb)); lg.stroke();
        }
        // torso relleno
        lg.fillStyle = '#d8d8d8';
        lg.beginPath();
        [J.l_shoulder, J.r_shoulder, J.r_hip, J.l_hip].forEach((k, i) => { const p = f[k]; i ? lg.lineTo(X(p), Y(p)) : lg.moveTo(X(p), Y(p)); });
        lg.closePath(); lg.fill();
        const nose = f[J.nose];
        lg.beginPath(); lg.arc(X(nose), Y(nose) + 0.01 * sc, 0.11 * sc, 0, Math.PI * 2); lg.fill();
        lg.filter = 'none';
      }
      g.imageSmoothingEnabled = true;
      g.drawImage(low, 0, 0, W, H);
      if (grainOn) {
        const pat = g.createPattern(tiles[tick % tiles.length], 'repeat');
        g.save();
        g.globalCompositeOperation = 'overlay'; g.globalAlpha = 0.42;
        g.translate((Math.random() * 64) | 0, (Math.random() * 64) | 0);
        g.fillStyle = pat; g.fillRect(-64, -64, W + 128, H + 128);
        g.restore();
      }
      // scanlines finas
      g.fillStyle = 'rgba(0,0,0,0.18)';
      for (let y = 0; y < H; y += 3 * dpr) g.fillRect(0, y, W, dpr);
      // avance (cámara lenta ×0,5)
      if (playing && frames) {
        const dt = now - last; acc += dt * 0.5;
        while (acc > 1000 / 30) { acc -= 1000 / 30; fi = (fi + 1) % frames.length; }
      }
      last = now; tick++;
      const s = (now - t0) / 1000;
      tc.textContent = `${pad(s / 3600)}:${pad((s / 60) % 60)}:${pad(s % 60)}:${pad((s * 24) % 24)}`;
    };

    const loop = (now) => { raf = null; if (!visible) return; draw(now); raf = requestAnimationFrame(loop); };
    ctx.env.onVisible(el, (v) => {
      visible = v;
      el.classList.toggle('fp-is-live', v && !reduced);
      if (v && !reduced && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
    });
    draw(performance.now());
    new ResizeObserver(() => { if (!raf) draw(performance.now()); }).observe(cv);

    grainBtn.addEventListener('click', () => { grainOn = !grainOn; grainBtn.setAttribute('aria-pressed', String(grainOn)); if (!raf) draw(performance.now()); });
    playBtn.addEventListener('click', () => {
      playing = !playing; playBtn.setAttribute('aria-pressed', String(playing));
      playBtn.querySelector('path').setAttribute('d', playing ? 'M10 8v8M14 8v8' : 'M10 8l6 4-6 4z');
    });
  },
};
