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
  initReader();
  initHoloFlip();
  initContactForm();
  initReel();
  initCaseTraveler();

  // pointer-FX layer
  if (fxEnabled()) {
    initDirectionalButtons();
    initMagneticButtons();
  }

  // heavy visual layers — each self-guards + pauses offscreen
  initMagneticField();
  initGravityFrames();
  initStickers();
  initFooterBalls();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot2);
} else {
  boot2();
}
