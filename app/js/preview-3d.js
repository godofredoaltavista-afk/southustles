/* ═══════════════════════════════════════════
   PREVIEW 3D — the floating project preview used to
   show a placeholder label ("AGENCY.GIF"); now each
   project row hover loads its OWN procedural three.js
   asset into the preview card. One shared renderer,
   one lazily-built scene per project (keyed by the
   row's existing data-preview value, so sh-main.js's
   follow/spring logic is untouched — this module only
   owns the pixels inside the card).
   Palette = SH theme-invariant accents (tokens.css).
   ═══════════════════════════════════════════ */

import * as THREE from 'three';
import { prefersReducedMotion } from './env.js';

const ACCENT = 0x6d5efc, SOFT = 0xa99bff, WARM = 0xff5a7a;
const GREEN = 0x2fb872, AMBER = 0xf4c542, BLUE = 0x4a6cf0, RED = 0xe8402c;

/* each builder returns { group, update(t) } */
const BUILDERS = {
  'AGENCY.GIF': () => {
    const g = new THREE.Group();
    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1, 0.3, 110, 14),
      new THREE.MeshBasicMaterial({ color: ACCENT, wireframe: true, transparent: true, opacity: 0.85 })
    );
    g.add(knot);
    return { group: g, update: (t) => { knot.rotation.y = t * 0.6; knot.rotation.x = t * 0.25; } };
  },
  'DATA-SYMPHONY.GIF': () => {
    const g = new THREE.Group();
    const N = 42, pts = [];
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) pts.push((i - N / 2) * 0.12, 0, (j - N / 2) * 0.12);
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(pts);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const cloud = new THREE.Points(geo, new THREE.PointsMaterial({ color: SOFT, size: 0.045, transparent: true, opacity: 0.9 }));
    cloud.rotation.x = -0.9;
    g.add(cloud);
    return {
      group: g,
      update: (t) => {
        for (let k = 0; k < pos.length; k += 3) {
          pos[k + 1] = Math.sin(pos[k] * 2.2 + t * 2) * 0.22 + Math.cos(pos[k + 2] * 2.6 + t * 1.4) * 0.18;
        }
        geo.attributes.position.needsUpdate = true;
        g.rotation.y = t * 0.15;
      },
    };
  },
  'CODECRAFT.GIF': () => {
    const g = new THREE.Group();
    const outer = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.35, 1),
      new THREE.MeshBasicMaterial({ color: GREEN, wireframe: true, transparent: true, opacity: 0.8 })
    );
    const inner = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.62, 0),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.16 })
    );
    g.add(outer, inner);
    return { group: g, update: (t) => { outer.rotation.y = t * 0.5; inner.rotation.y = -t * 0.9; inner.rotation.z = t * 0.4; } };
  },
  'PIXEL-PERFECT.GIF': () => {
    const g = new THREE.Group();
    const boxGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const mat = new THREE.MeshBasicMaterial({ color: WARM, transparent: true, opacity: 0.85 });
    const cubes = [];
    for (let x = -2; x <= 2; x++) for (let y = -1; y <= 1; y++) {
      const m = new THREE.Mesh(boxGeo, mat);
      m.position.set(x * 0.42, y * 0.42, 0);
      cubes.push(m); g.add(m);
    }
    return {
      group: g,
      update: (t) => {
        cubes.forEach((m, i) => { m.position.z = Math.sin(t * 2 + i * 0.7) * 0.24; m.rotation.z = t * 0.3; });
        g.rotation.y = Math.sin(t * 0.5) * 0.35;
      },
    };
  },
  'NEURAL-CANVAS.GIF': () => {
    const g = new THREE.Group();
    const geo = new THREE.SphereGeometry(1.15, 24, 18);
    const base = geo.attributes.position.array.slice();
    const blob = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: BLUE, wireframe: true, transparent: true, opacity: 0.7 }));
    g.add(blob);
    return {
      group: g,
      update: (t) => {
        const pos = geo.attributes.position.array;
        for (let k = 0; k < pos.length; k += 3) {
          const n = 1 + Math.sin(base[k] * 3 + t * 2.2) * 0.07 + Math.cos(base[k + 1] * 4 - t * 1.8) * 0.06;
          pos[k] = base[k] * n; pos[k + 1] = base[k + 1] * n; pos[k + 2] = base[k + 2] * n;
        }
        geo.attributes.position.needsUpdate = true;
        blob.rotation.y = t * 0.4;
      },
    };
  },
  'MOTION-ATLAS.GIF': () => {
    const g = new THREE.Group();
    const defs = [
      { r: 1.3, c: AMBER, tx: 0.4, speed: 1.0 },
      { r: 1.0, c: ACCENT, tx: 1.3, speed: -1.4 },
      { r: 0.7, c: WARM, tx: -0.7, speed: 1.9 },
    ];
    const rings = defs.map((d) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(d.r, 0.025, 10, 60),
        new THREE.MeshBasicMaterial({ color: d.c, transparent: true, opacity: 0.85 })
      );
      m.rotation.x = d.tx; m.userData.speed = d.speed;
      g.add(m); return m;
    });
    return { group: g, update: (t) => rings.forEach((m) => { m.rotation.y = t * m.userData.speed; }) };
  },
  'CHROMATIC.GIF': () => {
    const g = new THREE.Group();
    const mk = (c, z, r) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(1.9, 1.35),
        new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.4, side: THREE.DoubleSide })
      );
      m.position.z = z; m.rotation.z = r; g.add(m); return m;
    };
    const a = mk(RED, -0.3, -0.12), b = mk(GREEN, 0, 0.05), c = mk(BLUE, 0.3, 0.18);
    return {
      group: g,
      update: (t) => {
        a.position.x = Math.sin(t * 1.1) * 0.25;
        b.position.x = Math.sin(t * 1.1 + 2.1) * 0.25;
        c.position.x = Math.sin(t * 1.1 + 4.2) * 0.25;
        g.rotation.y = Math.sin(t * 0.6) * 0.4;
      },
    };
  },
};

export function initPreview3d() {
  const list = document.querySelector('.projects-list');
  const preview = list?.querySelector('.projects-preview');
  if (!list || !preview || prefersReducedMotion()) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'preview-3d';
  canvas.setAttribute('aria-hidden', 'true');
  preview.prepend(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setSize(320, 240, false);

  const camera = new THREE.PerspectiveCamera(45, 320 / 240, 0.1, 50);
  camera.position.z = 4;
  camera.lookAt(0, 0, 0);

  const scenes = {}; // data-preview -> { scene, update }
  let active = null, raf = null;
  const t0 = performance.now();

  const sceneFor = (key) => {
    if (!scenes[key]) {
      const build = BUILDERS[key] || BUILDERS['AGENCY.GIF'];
      const { group, update } = build();
      const scene = new THREE.Scene();
      scene.add(group);
      scenes[key] = { scene, update };
    }
    return scenes[key];
  };

  const tick = (now) => {
    if (active) {
      active.update((now - t0) / 1000);
      renderer.render(active.scene, camera);
      raf = requestAnimationFrame(tick);
    } else raf = null;
  };

  list.querySelectorAll('.project-row').forEach((row) => {
    row.addEventListener('pointerenter', () => {
      active = sceneFor(row.dataset.preview || 'AGENCY.GIF');
      if (!raf) raf = requestAnimationFrame(tick);
    });
    row.addEventListener('pointerleave', () => { active = null; });
  });
}
