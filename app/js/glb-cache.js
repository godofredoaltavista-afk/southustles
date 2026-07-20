/* ═══════════════════════════════════════════
   GLB CACHE — hands.on.mountain.glb is used by TWO
   consumers (hero + case traveler). Without this, each
   ran its own GLTFLoader: two fetches racing (HTTP cache
   helps, but not guaranteed pre-completion) and two full
   parses of the same bytes. One shared promise = one
   fetch + one parse; consumers clone() the scene so each
   can scale/position independently (materials stay shared
   — fine in three.js, and cheaper on the GPU).
   The <head> preload (index.html) starts this download
   before any module even executes.
   ═══════════════════════════════════════════ */

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export const CF_GLB = 'https://pub-6aa6b6baa3b043bf9598c7429620b422.r2.dev/hands.on.mountain.glb';

let promise = null;

export function loadHandsMountain() {
  if (!promise) {
    promise = new Promise((resolve, reject) => {
      new GLTFLoader().load(CF_GLB, resolve, undefined, reject);
    });
  }
  return promise;
}
