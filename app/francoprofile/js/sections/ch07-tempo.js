// FP · CH07 TEMPO 3-1-1 — demo viva de una repetición: LED de puntos 5×7 (led.js de Motion Lab) para
// el segundo de la fase y el número de rep, barra de fase en tres segmentos, una «carga» que baja / se
// traba / sube y una figurita de sentadilla que la sigue. Selector de tempo (palanca: 3→4→5 s de bajada).
console.log('[fp/ch07-tempo] init');

const TEMPOS = { '3-1-1': [3, 1, 1], '4-1-1': [4, 1, 1], '5-2-1': [5, 2, 1] };
const NAMES = ['Excéntrica', 'Isométrica', 'Concéntrica'];

export default {
  id: 'tempo', n: '07', title: 'Tempo', pol: 'invert', bg: 'grid', app: 'sesion',
  bridge: 'Con 10–12 reps, la serie dura lo que tiene que durar.',
  render(ctx) {
    const { tag } = ctx.ui;
    return `
    <div class="fp-wrap fpa-tempo">
      <div class="fp-head">
        <span class="fp-eyebrow"><b>07</b> Tempo</span>
        <h2><span class="fp-data fpa-tempo__big">3-1-1</span> <em>sin inercia</em>.</h2>
        <p class="fp-lede">3 s bajando, 1 s trabado en el punto de más tensión, 1 s subiendo ${tag('U')}. Controlar la excéntrica y pausar suma estímulo sin sumar carga ${ctx.ui.support('Solida')}.</p>
      </div>

      <div class="fpa-tempo__stage" data-fpa-tempo>
        <div class="fpa-tempo__screen">
          <div class="fpa-tempo__led">
            <span class="fpa-tempo__lab">fase</span>
            <canvas class="fpa-tempo__ledc" data-fpa-led-phase width="150" height="80"></canvas>
          </div>
          <div class="fpa-tempo__led fpa-tempo__led--rep">
            <span class="fpa-tempo__lab">rep</span>
            <canvas class="fpa-tempo__ledc" data-fpa-led-rep width="150" height="80"></canvas>
          </div>
          <div class="fpa-tempo__fig" aria-hidden="true">
            <div class="fpa-tempo__rail"><i class="fpa-tempo__load" data-fpa-load></i></div>
            <svg class="fpa-tempo__squat" viewBox="0 0 100 140" data-fpa-squat>
              <circle cx="50" cy="16" r="9"/>
              <path data-fpa-body d=""/>
            </svg>
          </div>
        </div>
        <div class="fpa-tempo__bar" data-fpa-bar aria-hidden="true">
          <i class="fpa-tempo__seg fpa-tempo__seg--ecc"><b></b><span>Excéntrica</span></i>
          <i class="fpa-tempo__seg fpa-tempo__seg--iso"><b></b><span>Iso</span></i>
          <i class="fpa-tempo__seg fpa-tempo__seg--con"><b></b><span>Conc.</span></i>
        </div>
        <div class="fpa-tempo__ctrl">
          <button type="button" class="fp-btn fp-btn--sm fp-btn--icon" data-fpa-play aria-label="Pausar demo">${ctx.icon('pause', 16)}</button>
          <div class="fp-seg" data-fpa-tempos role="group" aria-label="Tempo">
            ${Object.keys(TEMPOS).map((k) => `<button type="button" data-v="${k}">${k}</button>`).join('')}
          </div>
          <span class="fpa-tempo__now" data-fpa-name aria-live="polite">Excéntrica</span>
        </div>
      </div>

      <div class="fpa-tempo__facts">
        <div class="fpa-fact" data-fp-fade><b class="fp-data" data-fpa-set>50–60 s</b><span>por serie de 10–12 reps ${tag('U')}</span></div>
        <div class="fpa-fact" data-fp-fade><b class="fp-data">3 s</b><span>tríceps overhead: bajá lento, subí rápido y trabá al fondo ${tag('C')}</span></div>
        <div class="fpa-fact" data-fp-fade><b class="fp-data">4–5 s</b><span>cuando el ejercicio se vuelve liviano: palanca «bajada más lenta» ${tag('C')}</span></div>
      </div>
    </div>`;
  },

  init(el, ctx) {
    const reduced = ctx.env.prefersReducedMotion();
    const ledP = el.querySelector('[data-fpa-led-phase]');
    const ledR = el.querySelector('[data-fpa-led-rep]');
    const load = el.querySelector('[data-fpa-load]');
    const body = el.querySelector('[data-fpa-body]');
    const bar = el.querySelector('[data-fpa-bar]');
    const segs = [...bar.querySelectorAll('.fpa-tempo__seg')];
    const nameEl = el.querySelector('[data-fpa-name]');
    const setEl = el.querySelector('[data-fpa-set]');
    const playBtn = el.querySelector('[data-fpa-play]');
    let tempo = TEMPOS['3-1-1'];
    let playing = !reduced, raf = null, t0 = 0, paused = 0, rep = 1, lastPhase = -1, lastSec = -1;

    const color = () => ctx.led.accentColor();
    const ink = () => false; // el escenario del tempo es siempre oscuro (pantalla LED)

    const layout = () => {
      const tot = tempo[0] + tempo[1] + tempo[2];
      segs.forEach((s, i) => { s.style.flexGrow = String(tempo[i] / tot); });
      const sum = tot;
      setEl.textContent = `${sum * 10}–${sum * 12} s`;
    };

    // pose de sentadilla: d = 0 (arriba) … 1 (abajo)
    const pose = (d) => {
      const hipY = 64 + d * 26, kneeX = 50 + 4 + d * 16, kneeY = 96 + d * 4;
      const sh = `M50 26 L${50 - d * 6} ${hipY - 30}`;
      body.setAttribute('d', `${sh} L${50 - d * 10} ${hipY} L${kneeX} ${kneeY} L52 132 M${50 - d * 10} ${hipY} L${kneeX - 6} ${kneeY + 2} L46 132 M${50 - d * 6} ${hipY - 26} l${18 + d * 6} ${6 - d * 4}`);
      load.style.transform = `translateY(${(d * 100).toFixed(1)}%)`;
    };

    const draw = (phase, secLeft) => {
      ctx.led.drawLED(ledP, String(Math.max(1, Math.ceil(secLeft))), { on: color(), align: 'center', glow: 14, ink: ink() });
      ctx.led.drawLED(ledR, String(rep).padStart(2, '0'), { on: color(), align: 'center', glow: 14, ink: ink() });
    };

    const frame = (now) => {
      raf = null;
      if (!playing) return;
      if (!t0) t0 = now;
      const tot = (tempo[0] + tempo[1] + tempo[2]) * 1000;
      const el0 = now - t0;
      const cyc = Math.floor(el0 / tot);
      rep = (cyc % 12) + 1;
      let t = el0 % tot, i = 0;
      while (t >= tempo[i] * 1000) { t -= tempo[i] * 1000; i++; }
      const k = t / (tempo[i] * 1000);
      const d = i === 0 ? easeInOut(k) : i === 1 ? 1 : 1 - easeInOut(k);
      pose(d);
      segs.forEach((s, j) => { s.classList.toggle('is-on', j === i); s.querySelector('b').style.transform = `scaleX(${j < i ? 1 : j === i ? k : 0})`; });
      const secLeft = tempo[i] - t / 1000;
      if (i !== lastPhase) { nameEl.textContent = NAMES[i]; lastPhase = i; el.querySelector('[data-fpa-tempo]').dataset.phase = ['ecc', 'iso', 'con'][i]; }
      const s = Math.ceil(secLeft);
      if (s !== lastSec || i !== lastPhase) { draw(i, secLeft); lastSec = s; }
      raf = requestAnimationFrame(frame);
    };

    const start = () => { if (!raf && playing) { t0 = paused ? performance.now() - paused : 0; paused = 0; raf = requestAnimationFrame(frame); } };
    const stop = () => { if (raf) cancelAnimationFrame(raf); raf = null; };

    ctx.ui.segmented(el.querySelector('[data-fpa-tempos]'), '3-1-1', (v) => { tempo = TEMPOS[v]; layout(); t0 = 0; paused = 0; lastSec = -1; lastPhase = -1; if (!playing) staticFrame(); });
    playBtn.addEventListener('click', () => {
      playing = !playing;
      playBtn.innerHTML = ctx.icon(playing ? 'pause' : 'play', 16);
      playBtn.setAttribute('aria-label', playing ? 'Pausar demo' : 'Reproducir demo');
      if (playing) start(); else { paused = t0 ? performance.now() - t0 : 0; stop(); }
    });

    const staticFrame = () => { pose(1); draw(0, tempo[0]); segs.forEach((s, j) => { s.classList.toggle('is-on', j === 0); s.querySelector('b').style.transform = `scaleX(${j === 0 ? 1 : 0})`; }); };
    layout();
    staticFrame();
    document.addEventListener('fp-theme-changed', () => { lastSec = -1; if (!playing) staticFrame(); });
    document.addEventListener('fp-accent-changed', () => { lastSec = -1; if (!playing) staticFrame(); });
    if (reduced) { playBtn.innerHTML = ctx.icon('play', 16); return; }
    ctx.env.onVisible(el.querySelector('[data-fpa-tempo]'), (v) => { if (v) start(); else { if (raf) { paused = t0 ? performance.now() - t0 : 0; } stop(); } });
  },
};

const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
