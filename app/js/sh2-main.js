/* ═══════════════════════════════════════════
   SH2 MAIN — pass-2 boot. Everything additive:
   theme-strict skins, FX, three.js backgrounds,
   toys, reader/DNA, case traveler, contact form.
   Runs alongside sh-main.js (which owns pass-1).
   ═══════════════════════════════════════════ */

import { initParallaxLines, initThemeStrip, initHudMobile } from './sh2-lines.js';
import {
  initDirectionalButtons, initMagneticButtons, initTypewriter2,
  initWordRotator, initFontSwap2, initNavBooks, initQuickPanel,
} from './sh2-fx.js';
import { initMagneticField, initGravityFrames } from './sh2-three.js';
import { initStickers } from './sh2-stickers.js';
import { initReel } from './sh2-reel.js';
import { initFooterBalls } from './sh2-balls.js';
import { initReader } from './sh2-reader.js';
import { initHoloFlip } from './sh2-flip.js';
import { initCaseTraveler } from './sh2-case.js';
import { initContactForm } from './sh2-form.js';
import { initGlassCards } from './glass-cards.js';
import { initPersonalization } from './personalization.js';
import { initPreview3d } from './preview-3d.js';
import { fxEnabled } from './env.js';

function boot2() {
  // skins + chrome (theme strip reads sections AFTER fragments are in the DOM)
  initParallaxLines();
  initThemeStrip();
  initHudMobile();

  // interactions
  initTypewriter2();   // replaces intro.js's typewriter (old call disabled in sh-main.js)
  initFontSwap2();     // replaces sh-main.js initFontSwap (old call disabled)
  initWordRotator();
  initNavBooks();
  initQuickPanel();
  initPersonalization();
  initReader();
  initHoloFlip();
  initContactForm();
  initReel();
  initCaseTraveler();
  initGlassCards();

  // pointer-FX layer
  if (fxEnabled()) {
    initDirectionalButtons();
    initMagneticButtons();
    initPreview3d(); // hover previews render procedural 3D per project
  }

  // heavy visual layers — each self-guards + pauses offscreen
  initMagneticField();
  initGravityFrames();
  initStickers();
  initFooterBalls();

  // the ES/EN toggle rewrites innerHTML on several elements it shares with
  // other modules — anything that DECORATES inside one of i18n.js's DICT
  // targets gets wiped on every language switch and needs a re-run:
  //  - #statement-2's [data-swap] span (font-swap driver loses its node)
  //  - the University nav link's .nav-books mini-bookshelf (initNavBooks
  //    appends INSIDE the same <a> that '.site-nav .nav a[href="#university"]'
  //    overwrites — first load is fine since initI18n runs before
  //    initNavBooks, but every toggle click after that deleted the shelf)
  document.addEventListener('sh-lang-changed', () => {
    initFontSwap2();
    initNavBooks();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot2);
} else {
  boot2();
}
