/* ═══════════════════════════════════════════
   SH4 MAIN — pass-4 boot. Notas creativas only.
   Kept in its own entry (not folded into sh2-main)
   so the 10MB Excalidraw engine stays lazy: nothing
   here imports the bundle, it is fetched on the
   first "Nueva nota" click.
   ═══════════════════════════════════════════ */

import { initNotas } from './sh4-notas.js';

function boot4() {
  initNotas();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot4);
} else {
  boot4();
}
