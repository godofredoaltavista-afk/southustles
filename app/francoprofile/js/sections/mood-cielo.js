// FP · MOOD M11 — «Cielo»: puerto de Apacheta (screens/Cielo + Lobby, ui/Aura, styles/editorial «Reveal Paper»).
// Nocturno navy FIJO (no depende del tema, como .cielo-hero), onda de horizonte luminosa con puntos,
// ticks verticales con «FRANCO», contador 09 / 12, luna que cambia de fase con el scroll, cita en Instrument
// Serif que entra DESDE EL BLUR letra por letra (cine), «SCROLL» con óvalo, texto difuminado que se enfoca
// y el dock en píldora «Secciones · Perfil · Cielo». Sección alta con escenario sticky.
console.log('[fp/mood-cielo] init');

const QUOTES = [
  { q: 'El músculo se construye recuperando, no rompiendo.', cap: 'Recuperación · 01 §7.5', tag: 'C' },
  { q: 'Entrenando duro, durmiendo duro.', cap: 'El lema · Franco', tag: 'U' },
  { q: 'Ocho horas o más. La cama también es entrenamiento.', cap: 'Sueño 8+ h · lo que ya hago', tag: 'U' },
  { q: 'Masaje, ducha y sol suman; no se cuentan como recuperación medida.', cap: 'Bienestar ≠ dato · 01 §7.5', tag: 'C' },
];

const letters = (s) => {
  let i = 0;
  return s.split(' ').map((w) => `<span class="fp-mb-cielo__w">${[...w].map((ch) => `<span class="fp-mb-cielo__l" style="--i:${i++}">${ch.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))}</span>`).join('')}</span>`).join(' ');
};

function moonPath(f, r = 34) {
  // f: fracción iluminada 0 (nueva) → 1 (llena); creciente desde la derecha
  const rx = Math.abs(1 - 2 * f) * r;
  const sweep = f < 0.5 ? 1 : 0;
  return `M50 ${50 - r} A${r} ${r} 0 0 1 50 ${50 + r} A${rx.toFixed(2)} ${r} 0 0 ${sweep} 50 ${50 - r} Z`;
}

export default {
  id: 'mood-cielo',
  n: 'M11',
  title: 'Cielo',
  pol: 'mood',

  render(ctx) {
    const ticks = Array.from({ length: 12 }, (_, i) => `<li${i === 8 ? ' class="is-on"' : ''}></li>`).join('');
    return `
      <div class="fp-mb-cielo">
        <div class="fp-mb-cielo__sticky">
          <canvas class="fp-mb-cielo__sky" aria-hidden="true"></canvas>
          <div class="fp-mb-cielo__aura" aria-hidden="true"></div>
          <i class="fp-mb-cielo__grain" aria-hidden="true"></i>

          <header class="fp-mb-cielo__top">
            <nav class="fp-mb-cielo__links" aria-label="Accesos del cielo">
              <a href="#/hoy"><i class="fp-mb-cielo__dot"></i>Hoy</a>
              <a href="#/checkin"><span aria-hidden="true">✦</span>Check-in</a>
              <a href="#/progreso"><span aria-hidden="true">✎</span>Progreso</a>
            </nav>
            <div class="fp-mb-cielo__logo" aria-hidden="true"><span>Franco</span><i class="fp-mb-cielo__cord"><b></b></i></div>
            <div class="fp-mb-cielo__right">
              <span class="fp-mb-cielo__chip"><i class="fp-mb-cielo__chipmoon"></i><b class="fp-data" data-sleep>8+</b><small data-sleep-k>h de sueño</small></span>
              <button type="button" class="fp-mb-cielo__pill" data-fp-menu-open>Menú</button>
            </div>
          </header>

          <button type="button" class="fp-mb-cielo__back">← Volver</button>
          <div class="fp-mb-cielo__ticks" aria-hidden="true"><b>Franco</b><ol>${ticks}</ol></div>
          <div class="fp-mb-cielo__count" aria-hidden="true">Dormir ↗ <span class="fp-data"><b data-count>09</b> / 12</span></div>

          <svg class="fp-mb-cielo__moon" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="34" class="fp-mb-cielo__moon-dark"/>
            <path class="fp-mb-cielo__moon-lit" d="${moonPath(0.72)}"/>
            <circle cx="50" cy="50" r="40" class="fp-mb-cielo__moon-halo"/>
          </svg>

          <figure class="fp-mb-cielo__quote">
            <blockquote class="fp-mb-cielo__q" aria-live="polite">${letters(QUOTES[0].q)}</blockquote>
            <figcaption class="fp-mb-cielo__cap"><span data-cap>${QUOTES[0].cap}</span> <span data-tag>${ctx.ui.tag(QUOTES[0].tag)}</span></figcaption>
          </figure>

          <div class="fp-mb-cielo__scroll" aria-hidden="true"><i></i><span>Scroll</span></div>
          <p class="fp-mb-cielo__blur">Lo que se rompe en el entreno se arma durmiendo. Registrá horas y calidad en el check-in: la app no lo cuenta como magia, lo cuenta como dato.</p>

          <nav class="fp-mb-cielo__dock" aria-label="Dock del cielo">
            <button type="button" data-fp-menu-open><span aria-hidden="true">⌂</span>Secciones</button>
            <a href="#/progreso"><span aria-hidden="true">✦</span>Perfil</a>
            <span class="is-on" aria-current="true"><span aria-hidden="true">◐</span>Cielo</span>
          </nav>
        </div>
      </div>`;
  },

  init(el, ctx) {
    const root = el.querySelector('.fp-mb-cielo');
    const sticky = el.querySelector('.fp-mb-cielo__sticky');
    const cv = el.querySelector('.fp-mb-cielo__sky');
    const c = cv.getContext('2d');
    const qEl = el.querySelector('.fp-mb-cielo__q');
    const capEl = el.querySelector('[data-cap]');
    const tagEl = el.querySelector('[data-tag]');
    const lit = el.querySelector('.fp-mb-cielo__moon-lit');
    const ticks = [...el.querySelectorAll('.fp-mb-cielo__ticks li')];
    const countEl = el.querySelector('[data-count]');
    const blurP = el.querySelector('.fp-mb-cielo__blur');
    const reduced = ctx.env.prefersReducedMotion();
    let visible = false, raf = null, t = 0, last = 0, p = 0.72, mx = 0;

    // «← Volver»: al capítulo anterior
    el.querySelector('.fp-mb-cielo__back').addEventListener('click', () => {
      const prev = el.previousElementSibling; if (prev) prev.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    });

    // chip de sueño desde el vault (promedio 7 días) o el declarado 8+ h [U]
    const paintSleep = () => {
      const today = ctx.M.todayISO();
      const last7 = (ctx.state.days || []).filter((d) => d.date > ctx.M.addDays(today, -7) && d.date <= today);
      const avg = ctx.M.avgOf(last7, (d) => d.checkin?.sleepH);
      const demo = last7.some((d) => d.demo);
      el.querySelector('[data-sleep]').textContent = avg != null ? ctx.ui.fmt(avg, 1) : '8+';
      el.querySelector('[data-sleep-k]').textContent = avg != null ? `h · prom. 7 días${demo ? ' · ejemplo' : ''}` : 'h de sueño';
    };
    paintSleep();
    ctx.onData(paintSleep);

    // cielo: puntos + onda de horizonte luminosa + curvas de nivel
    const draw = () => {
      const r = sticky.getBoundingClientRect();
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      const W = Math.max(1, Math.round(r.width * dpr)), H = Math.max(1, Math.round(r.height * dpr));
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
      c.clearRect(0, 0, W, H);
      const base = H * (0.3 - p * 0.04);
      const wave = (x, k = 0) => base + k + Math.sin(x * 0.0032 + t * 0.25 + mx * 0.3) * H * 0.04 + Math.sin(x * 0.009 - t * 0.17) * H * 0.012;
      // puntos sobre el horizonte (como la grilla del cielo de Apacheta)
      for (let row = 0; row < 3; row++) {
        const y = base - H * 0.04 - row * H * 0.018;
        for (let x = W * 0.22; x < W * 0.6; x += 14 * dpr + row * 3 * dpr) {
          const a = 0.18 + 0.5 * Math.max(0, Math.sin(x * 0.01 + t * 0.6 + row));
          c.fillStyle = `rgba(239,231,212,${(a * 0.55).toFixed(3)})`;
          c.fillRect(x, y + Math.sin(x * 0.02 + t) * 2 * dpr, 1.6 * dpr, 1.6 * dpr);
        }
      }
      // banda luminosa
      c.save();
      c.beginPath(); c.moveTo(0, wave(0));
      for (let x = 0; x <= W; x += 8 * dpr) c.lineTo(x, wave(x));
      c.lineTo(W, wave(W) + H * 0.1); c.lineTo(0, wave(0) + H * 0.1); c.closePath();
      const g = c.createLinearGradient(0, base - H * 0.05, 0, base + H * 0.1);
      g.addColorStop(0, 'rgba(214,236,206,0)'); g.addColorStop(0.35, 'rgba(214,236,206,0.75)'); g.addColorStop(1, 'rgba(214,236,206,0)');
      const gx = c.createLinearGradient(0, 0, W * 0.55, 0);
      gx.addColorStop(0, 'rgba(0,0,0,1)'); gx.addColorStop(0.55, 'rgba(0,0,0,0.45)'); gx.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = g; c.shadowColor = 'rgba(214,236,206,0.9)'; c.shadowBlur = 40 * dpr; c.fill();
      c.globalCompositeOperation = 'destination-out'; c.fillStyle = gx; c.shadowBlur = 0; c.fillRect(0, base - H * 0.1, W * 0.55, H * 0.3);
      c.restore();
      // cresta fina
      c.strokeStyle = 'rgba(239,231,212,0.55)'; c.lineWidth = 1.2 * dpr; c.beginPath();
      for (let x = W * 0.25; x <= W; x += 8 * dpr) { const y = wave(x); x === W * 0.25 ? c.moveTo(x, y) : c.lineTo(x, y); }
      c.stroke();
      // curvas de nivel abajo (líneas muy tenues)
      for (let k = 1; k < 7; k++) {
        c.strokeStyle = `rgba(239,231,212,${(0.05 - k * 0.005).toFixed(3)})`; c.lineWidth = 1 * dpr; c.beginPath();
        for (let x = 0; x <= W; x += 12 * dpr) { const y = wave(x, H * 0.09 * k) + Math.sin(x * 0.005 + k) * H * 0.02; x === 0 ? c.moveTo(x, y) : c.lineTo(x, y); }
        c.stroke();
      }
    };

    const scrollUpdate = () => {
      p = ctx.scroll.getInnerProgress(root);
      lit.setAttribute('d', moonPath(Math.min(1, 0.06 + p * 0.94)));
      const idx = Math.min(11, Math.round(p * 11));
      ticks.forEach((li, i) => li.classList.toggle('is-on', i === idx));
      countEl.textContent = String(idx + 1).padStart(2, '0');
      const b = Math.max(0, 10 - p * 22);
      blurP.style.filter = `blur(${b.toFixed(2)}px)`;
      blurP.style.opacity = (0.35 + Math.min(1, p * 2.2) * 0.65).toFixed(3);
      if (!raf) draw();
    };

    // cine: la cita entra desde el blur letra por letra, se sostiene y sale; rota entre 4 citas
    let qi = 0, qTimer = null;
    const showQuote = () => {
      qEl.classList.remove('is-out');
      requestAnimationFrame(() => requestAnimationFrame(() => qEl.classList.add('is-on')));
      qTimer = setTimeout(() => {
        qEl.classList.add('is-out'); qEl.classList.remove('is-on');
        qTimer = setTimeout(() => {
          qi = (qi + 1) % QUOTES.length;
          qEl.innerHTML = letters(QUOTES[qi].q);
          capEl.textContent = QUOTES[qi].cap;
          tagEl.innerHTML = ctx.ui.tag(QUOTES[qi].tag);
          if (visible) showQuote(); else qTimer = null;
        }, 1100);
      }, 5600);
    };

    if (reduced) {
      qEl.classList.add('is-on', 'is-static');
      draw();
      ctx.scroll.onScrollFrame(() => { if (visible) scrollUpdate(); });
      ctx.env.onVisible(el, (v) => { visible = v; });
      return;
    }

    const loop = (now) => {
      raf = null;
      if (!visible) return;
      if (now - last > 33) { t += Math.min(0.05, (now - last) / 1000); last = now; draw(); }
      raf = requestAnimationFrame(loop);
    };
    if (ctx.env.fxEnabled()) sticky.addEventListener('pointermove', (e) => { const r = sticky.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width - 0.5; });
    ctx.scroll.onScrollFrame(() => { if (visible) scrollUpdate(); });
    ctx.env.onVisible(el, (v) => {
      visible = v;
      if (v) {
        if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
        if (!qTimer) showQuote();
      }
    });
    new ResizeObserver(() => draw()).observe(sticky);
  },
};
