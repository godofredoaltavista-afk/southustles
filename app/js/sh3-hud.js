/* ═══════════════════════════════════════════
   SH3 HUD LEGEND — the colour HUD grows a legend
   showing WHAT each dot repaints, with live swatches
   (they consume the vars, so they update as you drag).
   Expands on hover/focus/drag; compact otherwise.
   ═══════════════════════════════════════════ */

export function initHudLegend() {
  const hud = document.querySelector('.color-hud');
  if (!hud || hud.querySelector('.hud-legend')) return;

  const legend = document.createElement('div');
  legend.className = 'hud-legend';
  legend.setAttribute('aria-hidden', 'true');
  legend.innerHTML = `
    <div class="hud-legend__row" data-for="0">
      <i class="hl-swatch hl-swatch--accent"></i>
      <div><b>ACCENT</b><span>links · fills · buttons · field particles</span></div>
      <em class="hl-demo hl-demo--pill">btn</em>
    </div>
    <div class="hud-legend__row" data-for="1">
      <i class="hl-swatch hl-swatch--warm"></i>
      <div><b>WARM</b><span>fineliner · alerts · holographic pink</span></div>
      <em class="hl-demo hl-demo--mark">mark</em>
    </div>
    <div class="hud-legend__row" data-for="2">
      <i class="hl-swatch hl-swatch--soft"></i>
      <div><b>SOFT</b><span>glows · sparks · loader halo</span></div>
      <em class="hl-demo hl-demo--glow">✦</em>
    </div>
    <div class="hud-legend__tip">drag a dot ↑↓ — the whole site repaints</div>`;
  hud.appendChild(legend);

  // expanded while hovering/focusing/dragging the HUD
  let hold = null;
  const show = () => { clearTimeout(hold); hud.classList.add('is-legend'); };
  const hide = () => { hold = setTimeout(() => hud.classList.remove('is-legend'), 600); };
  hud.addEventListener('pointerenter', show);
  hud.addEventListener('pointerleave', hide);
  hud.addEventListener('focusin', show);
  hud.addEventListener('focusout', hide);
  hud.addEventListener('pointerdown', show);

  // hovering a legend row lights up its dot
  legend.querySelectorAll('.hud-legend__row').forEach((row) => {
    const dot = hud.querySelector(`.color-hud__dot[data-dot="${row.dataset.for}"]`);
    if (!dot) return;
    row.addEventListener('pointerenter', () => dot.classList.add('is-hinted'));
    row.addEventListener('pointerleave', () => dot.classList.remove('is-hinted'));
  });
}
