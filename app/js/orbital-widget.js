/* ═══════════════════════════════════════════
   ORBITAL WIDGET — the ant-on-mars agentic-orbital
   idiom (reference/ant-on-mars/FooterSection.js
   _buildAgenticOrbital): a wireframe core + tilted
   torus rings spinning at different speeds, recolored
   to SH accents, docked in the Live System dark card.
   Fixed 150px buffer (no ResizeObserver needed), pauses
   offscreen via IntersectionObserver.
   ═══════════════════════════════════════════ */

import * as THREE from 'three';
import { prefersReducedMotion } from './env.js';

export function initOrbitalWidget() {
  const canvas = document.querySelector('.live-sys__orbital');
  if (!canvas || prefersReducedMotion()) return;

  const SIZE = 150;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setSize(SIZE, SIZE, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 50);
  camera.position.z = 4;
  camera.lookAt(0, 0, 0);

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 14, 12),
    new THREE.MeshBasicMaterial({ color: 0xa99bff, wireframe: true, transparent: true, opacity: 0.45 })
  );
  scene.add(core);

  // ring params straight from the reference, colors swapped to SH accents
  const ringDefs = [
    { r: 1.4,  tube: 0.022, color: 0x6d5efc, tiltX: 0.3,  tiltZ: 0,    speed: 1.1  },
    { r: 1.75, tube: 0.018, color: 0xff5a7a, tiltX: 1.2,  tiltZ: 0.5,  speed: -0.7 },
    { r: 1.15, tube: 0.016, color: 0xa99bff, tiltX: -0.8, tiltZ: 1.0,  speed: 1.5  },
    { r: 2.0,  tube: 0.012, color: 0x4a6cf0, tiltX: 0.1,  tiltZ: -0.7, speed: -0.45 },
  ];
  const rings = ringDefs.map((def) => {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(def.r, def.tube, 10, 64),
      new THREE.MeshBasicMaterial({ color: def.color, transparent: true, opacity: 0.72 })
    );
    mesh.rotation.x = def.tiltX;
    mesh.rotation.z = def.tiltZ;
    mesh.userData.speed = def.speed;
    scene.add(mesh);
    return mesh;
  });

  let raf = null, running = false;
  const t0 = performance.now();
  const tick = (now) => {
    const t = (now - t0) / 1000;
    rings.forEach((r) => { r.rotation.y = t * r.userData.speed; });
    core.rotation.y = t * 0.55;
    core.rotation.x = t * 0.28;
    renderer.render(scene, camera);
    if (running) raf = requestAnimationFrame(tick);
  };

  const host = document.getElementById('live-system') || canvas;
  const io = new IntersectionObserver(([en]) => {
    running = en.isIntersecting;
    if (running) { if (!raf) raf = requestAnimationFrame(tick); }
    else if (raf) { cancelAnimationFrame(raf); raf = null; }
  }, { threshold: 0 });
  io.observe(host);
}
