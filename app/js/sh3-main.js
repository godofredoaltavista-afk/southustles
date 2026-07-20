/* ═══════════════════════════════════════════
   SH3 MAIN — pass-3 boot: CF GLB traveler, in-site
   pages, HUD legend. (initShaderLoader moved to
   sh-main.js's boot() — it needs to run FIRST, before
   this 3rd module script even starts executing.)
   ═══════════════════════════════════════════ */

import { initGlbTraveler } from './sh3-glb.js';
import { initPages } from './sh3-pages.js';
import { initHudLegend } from './sh3-hud.js';
import { initHeroGlb } from './hero-glb.js';
import { initOrbitalWidget } from './orbital-widget.js';

function boot3() {
  initPages();
  initHudLegend();
  initGlbTraveler();  // async: swaps SVG → GLB when the CF asset arrives
  initHeroGlb();      // hands.on.mountain riding the hero (mouse + scroll dolly)
  initOrbitalWidget(); // ant-on-mars orbital rings in the Live System card
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot3);
} else {
  boot3();
}
