/* ═══════════════════════════════════════════
   SH3 MAIN — pass-3 boot: shader loader (first!),
   CF GLB traveler, in-site pages, HUD legend.
   ═══════════════════════════════════════════ */

import { initShaderLoader } from './sh3-loader.js';
import { initGlbTraveler } from './sh3-glb.js';
import { initPages } from './sh3-pages.js';
import { initHudLegend } from './sh3-hud.js';

function boot3() {
  initShaderLoader(); // must run while #loader is still alive
  initPages();
  initHudLegend();
  initGlbTraveler();  // async: swaps SVG → GLB when the CF asset arrives
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot3);
} else {
  boot3();
}
