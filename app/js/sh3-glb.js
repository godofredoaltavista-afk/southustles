/* ═══════════════════════════════════════════
   SH3 GLB — hands.on.mountain.glb (Franco's real
   Cloudflare R2 asset, same bucket ant-on-mars uses)
   mounted INSIDE the case traveler: it spins with
   scroll and rides the sh2-case waypoint path —
   including the full-screen takeover moment.
   Falls back to the SVG preview if the GLB fails.
   ═══════════════════════════════════════════ */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { prefersReducedMotion } from './env.js';
import { getSectionProgress } from './scroll-parallax.js';

const CF_GLB = 'https://pub-6aa6b6baa3b043bf9598c7429620b422.r2.dev/hands.on.mountain.glb';

export function initGlbTraveler() {
  const sec = document.getElementById('case-study');
  const traveler = sec?.querySelector('[data-case-traveler]');
  const img = traveler?.querySelector('img');
  if (!sec || !traveler || prefersReducedMotion()) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'case__glb';
  canvas.setAttribute('aria-hidden', 'true');

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 1.2, 5);

  // Franco's warm-key / cool-fill light rig (GLBViewerSection idiom)
  scene.add(new THREE.AmbientLight(0xf5f0e8, 1.1));
  const key = new THREE.DirectionalLight(0xffe8c0, 2.0); key.position.set(5, 10, 8); scene.add(key);
  const fill = new THREE.DirectionalLight(0xc0e0ff, 0.7); fill.position.set(-5, 3, -4); scene.add(fill);
  const violet = new THREE.PointLight(0x6d5efc, 1.2, 30); violet.position.set(0, -3, 4); scene.add(violet);

  let model = null, raf = null, running = false;
  let mouseX = 0, smX = 0;

  new GLTFLoader().load(
    CF_GLB,
    (gltf) => {
      model = gltf.scene;
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
      const cap = traveler.querySelector('.case__traveler-cap');
      if (cap) cap.textContent = 'HANDS.ON.MOUNTAIN.GLB — LIVE FROM CLOUDFLARE R2';
    },
    undefined,
    () => { /* GLB unreachable → keep the SVG preview, no canvas */ }
  );

  const resize = () => {
    const w = traveler.clientWidth || 300;
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
      smX += (mouseX - smX) * 0.05;                    // mouse-delay lerp
      model.rotation.y = p * Math.PI * 3 + smX * 0.6;  // el scroll lo hace girar
      model.rotation.x = Math.sin(p * Math.PI) * 0.18;
      model.position.y = Math.sin(p * Math.PI * 2) * 0.15;
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
