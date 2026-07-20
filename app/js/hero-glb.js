/* ═══════════════════════════════════════════
   HERO GLB — hands.on.mountain.glb riding the hero,
   behind "Creative Systems for a Conscious Era".
   The #hero-glb canvas existed since pass-1 as dead
   markup ("reserved"); this finally powers it, in the
   ant-on-mars HeroSection idiom: camera-based motion
   (never CSS transforms), ResizeObserver-driven sizing,
   mouse parallax + scroll-driven dolly zoom, lookAt(0,0,0)
   every frame. Shares the CF R2 asset (and therefore the
   browser cache) with the case-study traveler.
   ═══════════════════════════════════════════ */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { prefersReducedMotion } from './env.js';
import { getSectionProgress } from './scroll-parallax.js';
import { loadHandsMountain } from './glb-cache.js';

const LOCAL_FALLBACK = 'assets/hero.glb';

export function initHeroGlb() {
  const hero = document.getElementById('hero');
  const canvas = document.getElementById('hero-glb');
  if (!hero || !canvas) return;

  const reduced = prefersReducedMotion();

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  // full-viewport canvas: DPR capped at 1.5 (not 2) — at hero size that's
  // ~45% fewer pixels per frame, and at opacity .9 behind text the
  // difference is invisible while the scroll gets noticeably smoother
  renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0.6, 6.2);
  camera.lookAt(0, 0, 0);

  // same warm-key / cool-fill rig as the case traveler, slightly dimmer
  // so the model reads as a hero *background*, not a product shot
  scene.add(new THREE.AmbientLight(0xf5f0e8, 0.9));
  const key = new THREE.DirectionalLight(0xffe8c0, 1.6); key.position.set(5, 10, 8); scene.add(key);
  const fill = new THREE.DirectionalLight(0xc0e0ff, 0.6); fill.position.set(-5, 3, -4); scene.add(fill);
  const violet = new THREE.PointLight(0x6d5efc, 1.0, 30); violet.position.set(0, -3, 4); scene.add(violet);

  let model = null, raf = null, running = false;
  let mouseX = 0, mouseY = 0, smX = 0, smY = 0;

  const mount = (gltf) => {
    model = gltf.scene;
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3()).length() || 1;
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    model.scale.setScalar(4.6 / size);
    // composition: sit right-of-center, slightly low — the H1 owns the left
    model.position.x += 1.15;
    model.position.y -= 0.25;
    scene.add(model);
    if (reduced) { resize(); renderer.render(scene, camera); } // one static frame
  };

  loadHandsMountain()
    .then((gltf) => mount({ scene: gltf.scene.clone(true) }))
    .catch(() => new GLTFLoader().load(LOCAL_FALLBACK, mount, undefined, () => { /* hero stays text-only */ }));

  const resize = () => {
    const w = hero.clientWidth || window.innerWidth;
    const h = hero.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(hero);
  resize();

  if (reduced) return; // static frame only — no listeners, no loop

  window.addEventListener('pointermove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });

  const tick = () => {
    if (model) {
      const p = getSectionProgress(hero);
      smX += (mouseX - smX) * 0.06;
      smY += (mouseY - smY) * 0.06;
      // mouse-zoom idiom (ant-on-mars), turned up per Franco: "que gire
      // mas y se zoomee mas dependiendo donde moves el mouse". The cursor
      // now drives a real dolly — top of the screen pushes IN, bottom
      // pulls OUT — stacked on the scroll dolly; rotation range ~3x wider.
      camera.position.x = smX * 1.6;
      camera.position.y = 0.6 + smY * 0.8;
      camera.position.z = 6.2 - p * 2.4 - smY * 1.4; // scroll dolly + mouse dolly
      camera.lookAt(model.position.x * 0.4, 0, 0);
      model.rotation.y = smX * 1.1 + p * Math.PI * 0.5; // wide mouse turn
      model.rotation.x = smY * 0.25;                    // slight pitch too
      renderer.render(scene, camera);
    }
    if (running) raf = requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(([en]) => {
    running = en.isIntersecting;
    if (running) { if (!raf) raf = requestAnimationFrame(tick); }
    else if (raf) { cancelAnimationFrame(raf); raf = null; }
  }, { threshold: 0 });
  io.observe(hero);
}
