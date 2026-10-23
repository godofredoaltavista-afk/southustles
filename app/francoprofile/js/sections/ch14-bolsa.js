// FP · CH14 LA BOLSA — qué da el boxeo y cómo dosificarlo sin robarle a la masa (01 §5.5, §6, premisas 3 y 11).
// Fondo transparente (gl:'bolsa'): el boxeador de partículas del campo Three.js global golpea detrás.
// Ventana flotante tipo macOS (FloatingWindow de Ant on Mars: 3 puntos, arrastre por la barra) con las
// métricas estimadas del boxer.json real de Motion Lab (golpes izq/der, simetría, duración).
console.log('[fp/ch14-bolsa] init');

export default {
  id: 'bolsa', n: '14', title: 'Bolsa', pol: 'theme', gl: 'bolsa', app: 'lab',
  bridge: 'La bolsa suma coordinación y core; el músculo lo hace la fuerza.',
  render(ctx) {
    const { esc, tag, support } = ctx.ui;
    const pick = (id) => ctx.data.premises.find((p) => p.id === id);
    const p3 = pick('p03-bolsa-rompe'), p11 = pick('p11-guardia');
    const sat = ctx.data.dayByKey.sat;
    return `
    <div class="fp-wrap fp-wrap--wide fpa-bolsa">
      <div class="fpa-bolsa__txt">
        <div class="fp-head">
          <span class="fp-eyebrow"><b>14</b> La bolsa</span>
          <h2>1,20 m colgada, <em>dosificada</em>.</h2>
          <p class="fp-lede">Patadas bajas, guardia, rodillas, rotación. Mucho trabajo de cadera, core, agarre y coordinación ${tag('U')}.</p>
        </div>
        <ul class="fpa-dose" data-fp-fade>
          <li><span class="fp-data">Lun · Mié</span><b>Técnico y suave</b><span>4–5 rounds × 2 min, sin patadas fuertes antes de piernas</span></li>
          <li><span class="fp-data">Mar · Vie</span><b>Técnica suave</b><span>Cierre de la sesión de fuerza</span></li>
          <li class="is-hot"><span class="fp-data">Sáb</span><b>Día fuerte</b><span>${esc(sat.bag)}</span></li>
        </ul>
        <div class="fpa-prem fpa-prem--row">
          ${[p3, p11].filter(Boolean).map((p) => `
          <article class="fpa-prem__item" data-fp-fade>
            <div class="fpa-prem__meta">${tag(p.tag)} ${support(p.support)}</div>
            <p class="fpa-prem__claim">${esc(p.claim)}</p>
            <p class="fpa-prem__note">${esc(p.note)}</p>
          </article>`).join('')}
        </div>
        <p class="fp-small fpa-bolsa__wrap">${ctx.icon('wrap', 14)} Vendas de tobillo, rodillera y muñequera: en la bolsa y las patadas, no en todo el entreno. No reemplazan técnica ${tag('U')}.</p>
      </div>

      <div class="fpa-fwin" data-fpa-fwin role="group" aria-label="Ventana: métricas del clip de Motion Lab">
        <div class="fpa-fwin__bar" data-fpa-fwin-bar>
          <span class="fpa-fwin__dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="fpa-fwin__t">Motion Lab · sombra de boxeo</span>
          <span class="fpa-fwin__grip" aria-hidden="true">${ctx.icon('grip', 14)}</span>
        </div>
        <div class="fpa-fwin__body">
          <canvas class="fpa-fwin__cv" data-fpa-mini aria-hidden="true"></canvas>
          <div class="fpa-fwin__kpis" data-fpa-kpis><p class="fp-small">Analizando el clip…</p></div>
          <p class="fpa-fwin__note fp-small">Estimado desde los 21 puntos del clip de ejemplo de Motion Lab (jab izq · upper der · guardia · gancho izq). No es tu sesión.</p>
        </div>
      </div>
    </div>`;
  },

  async init(el, ctx) {
    const win = el.querySelector('[data-fpa-fwin]');
    const bar = el.querySelector('[data-fpa-fwin-bar]');
    // arrastre de la ventana dentro del capítulo (translate, no left/top)
    if (ctx.env.fxEnabled()) {
      let sx = 0, sy = 0, ox = 0, oy = 0, drag = false;
      bar.addEventListener('pointerdown', (e) => { drag = true; sx = e.clientX; sy = e.clientY; bar.setPointerCapture(e.pointerId); win.classList.add('is-drag'); });
      bar.addEventListener('pointermove', (e) => { if (!drag) return; win.style.translate = `${ox + e.clientX - sx}px ${oy + e.clientY - sy}px`; });
      bar.addEventListener('pointerup', (e) => { if (!drag) return; drag = false; ox += e.clientX - sx; oy += e.clientY - sy; win.classList.remove('is-drag'); });
    }
    const kpis = el.querySelector('[data-fpa-kpis]');
    try {
      const raw = await ctx.data.boxer();
      const n = ctx.ml.normalize(raw, 'boxer.json');
      if (!n.ok) throw new Error(n.error);
      const m = ctx.ml.metrics(n.session);
      kpis.innerHTML = `
        <div class="fpa-k"><canvas data-fpa-led width="120" height="44"></canvas><span>golpes est.</span></div>
        <div class="fpa-k"><b class="fp-data">${m.punches.l}</b><span>izq</span></div>
        <div class="fpa-k"><b class="fp-data">${m.punches.r}</b><span>der</span></div>
        <div class="fpa-k"><b class="fp-data">${m.symmetryPct ?? '—'}%</b><span>simetría</span></div>
        <div class="fpa-k"><b class="fp-data">${m.durationS} s</b><span>${m.frames} frames · ${m.fps} fps</span></div>
        <div class="fpa-k fpa-k--bal"><div class="fpa-bal"><i style="--l:${m.balance.leftPct}%"></i></div><span>peso izq ${m.balance.leftPct}% · der ${m.balance.rightPct}%</span></div>`;
      const led = kpis.querySelector('[data-fpa-led]');
      const paintLed = () => ctx.led.drawLED(led, String(m.punches.total).padStart(2, '0'), { on: ctx.led.accentColor(), glow: 10 });
      requestAnimationFrame(paintLed);
      document.addEventListener('fp-accent-changed', paintLed);
      const player = new ctx.ml.SkeletonPlayer(el.querySelector('[data-fpa-mini]'), n.session, { angles: false, trail: true, com: false, speed: 1 });
      if (!ctx.env.prefersReducedMotion()) player.play();
    } catch (e) {
      kpis.innerHTML = '<p class="fp-small">No pude leer el clip de Motion Lab.</p>';
    }
  },
};
