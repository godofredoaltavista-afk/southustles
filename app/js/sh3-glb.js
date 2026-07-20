/* ═══════════════════════════════════════════
   SH3 GLB — hands.on.mountain.glb (Franco's real
   Cloudflare R2 asset, same bucket ant-on-mars uses)
   mounted INSIDE the case traveler: it spins with
   scroll and rides the sh2-case waypoint path —
   including the full-screen takeover moment.
   Falls back to the SVG preview if the GLB fails.
   ═══════════════════════════════════════════ */

import * as THREE from 'three';
import { prefersReducedMotion } from './env.js';
import { getSectionProgress } from './scroll-parallax.js';
import { loadHandsMountain } from './glb-cache.js';

// wrapper CSS scale is clamped to 1.55 in sh2-case.js when the GLB is live;
// buffer sized for that (+ a hair of margin) instead of the old 5.4x peak —
// the previous max-scale buffer meant compositing ~1800px of canvas every
// frame at rest, which is exactly why the chapter stuttered.
const GLB_SCALE_HEADROOM = 1.6;

export function initGlbTraveler() {
  const sec = document.getElementById('case-study');
  const traveler = sec?.querySelector('[data-case-traveler]');
  const img = traveler?.querySelector('img');
  if (!sec || !traveler || prefersReducedMotion()) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'case__glb';
  canvas.setAttribute('aria-hidden', 'true');

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1)); // fluidity > the last 0.5 DPR
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 1.2, 5);
  // the model is centered on the origin (see box/center normalization
  // below) — without this, a fresh PerspectiveCamera just looks down -Z
  // at y=1.2 forever and never tilts down toward it, pushing the model's
  // lower half toward/past the bottom of the frame on every render.
  camera.lookAt(0, 0, 0);

  // Franco's warm-key / cool-fill light rig (GLBViewerSection idiom)
  scene.add(new THREE.AmbientLight(0xf5f0e8, 1.1));
  const key = new THREE.DirectionalLight(0xffe8c0, 2.0); key.position.set(5, 10, 8); scene.add(key);
  const fill = new THREE.DirectionalLight(0xc0e0ff, 0.7); fill.position.set(-5, 3, -4); scene.add(fill);
  const violet = new THREE.PointLight(0x6d5efc, 1.2, 30); violet.position.set(0, -3, 4); scene.add(violet);

  let model = null, raf = null, running = false;
  let mouseX = 0, smX = 0;

  loadHandsMountain().then(
    (gltf) => {
      model = gltf.scene.clone(true); // shared parse (glb-cache), own transform
      // normalize scale to fit the frame
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3()).length() || 1;
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);
      model.scale.setScalar(3.4 / size);
      scene.add(model);
      // swap: hide the SVG fallback, show the real asset
      traveler.classList.add('has-glb');
      if (img) img.style.visibility = 'hidden';
      traveler.insertBefore(canvas, traveler.firstChild);
      resize();
      // the filename caption under the model "no va" (Franco) — drop it
      traveler.querySelector('.case__traveler-cap')?.remove();
    }
  ).catch(() => { /* GLB unreachable → keep the SVG preview, no canvas */ });

  // sh2-case.js rides the traveler with a CSS transform: scale() up to
  // CASE_MAX_SCALE (5.4x) for the full-screen takeover moment. transform
  // never changes clientWidth, so if the buffer were sized off the resting
  // ~460px footprint, the "hero moment" would just be a blurry CSS upscale.
  // Fix: size the drawing buffer ONCE for the biggest on-screen appearance
  // (clamped so the GPU never has to push more than ~1800px). Because the
  // canvas has no CSS height of its own, its height is auto-derived from
  // this buffer's aspect ratio, so a uniform CSS scale() never distorts it —
  // this stays sharp at every waypoint without ever re-sizing mid-scroll
  // (an earlier per-frame-resize attempt caused stutter, since resizing a
  // WebGL framebuffer reallocates it).
  const resize = () => {
    const baseW = traveler.clientWidth || 300;
    const w = Math.min(Math.round(baseW * GLB_SCALE_HEADROOM), 900);
    const h = Math.round(w * 0.85);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', resize);

  window.addEventListener('pointermove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  }, { passive: true });

  const tick = () => {
    if (model) {
      const p = getSectionProgress(sec);
      smX += (mouseX - smX) * 0.05; // mouse-delay lerp
      // CAMERA journey (Franco: "que se va acercando al asset, lo gira,
      // lo ve de arriba"): scroll drives a real spherical orbit — the
      // camera closes in toward the middle of the chapter (the takeover),
      // sweeps ~270° around the model, and climbs so the mid-chapter view
      // looks down on it. Far cheaper AND more cinematic than scaling the
      // canvas ever was.
      const env = Math.sin(p * Math.PI);              // 0 → 1 → 0 across the chapter
      const az = p * Math.PI * 1.5 + smX * 0.5;       // ~270° sweep + mouse nudge
      const el = 0.30 + env * 0.75;                    // climbs to a top-down-ish view
      const r = 5.2 - env * 3.0;                       // dollies in to ~2.2 at the peak
      camera.position.set(
        r * Math.cos(el) * Math.sin(az),
        r * Math.sin(el),
        r * Math.cos(el) * Math.cos(az)
      );
      camera.lookAt(0, 0, 0);
      model.rotation.y = p * Math.PI * 1.2 + smX * 0.4; // the model turns too
      model.position.y = Math.sin(p * Math.PI * 2) * 0.12;
      renderer.render(scene, camera);
    }
    if (running) raf = requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(([en]) => {
    running = en.isIntersecting;
    if (running) { if (!raf) raf = requestAnimationFrame(tick); }
    else if (raf) { cancelAnimationFrame(raf); raf = null; }
  }, { threshold: 0 });
  io.observe(sec);
}
