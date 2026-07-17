/* ═══════════════════════════════════════════
   SH2 — THREE.JS BACKGROUND SECTIONS
   #magnetic  → initMagneticField()  (particle repulsion cloud + S/H letterforms)
   #gravity   → initGravityFrames()  (zero-gravity wireframe frames + particles)

   Standalone adaptation of js/ref/{MagneticSection,GravitySection,ThreeSceneManager}.js
   — no core/ imports. Theme-reactive via 'leo-theme-changed'. rAF loops are
   paused by IntersectionObserver when offscreen; prefers-reduced-motion
   renders a single static frame instead of animating. DPR capped at 2.
   ═══════════════════════════════════════════ */

import * as THREE from 'three';
import { fxEnabled, prefersReducedMotion, isCoarsePointer } from './env.js';

/* ── shared helpers ────────────────────────── */

const isDark = () => document.documentElement.dataset.theme === 'dark';

/** run fn(isDark) now + on every theme flip. */
function watchTheme(fn) {
  document.addEventListener('leo-theme-changed', () => fn(isDark()));
  fn(isDark());
}

/** start/stop a SceneManager loop as its section enters/leaves the viewport. */
function observeVisibility(sectionEl, mgr) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) mgr.start();
        else mgr.stop();
      });
    },
    { rootMargin: '12% 0px 12% 0px', threshold: 0 }
  );
  io.observe(sectionEl);
  return io;
}

/* ── minimal SceneManager (inlined from ref/ThreeSceneManager.js) ──
   Renderer (alpha + antialias opts, DPR<=2), perspective camera,
   ResizeObserver on the canvas parent, guarded rAF start/stop with a
   continuous elapsed accumulator, renderOnce for static frames, dispose. */
class SceneManager {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.opts = { alpha: true, antialias: true, fov: 60, ...opts };
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this._rafId = null;
    this._last = 0;
    this._elapsed = 0;
    this._animCbs = [];
    this._ro = null;
  }

  init() {
    const host = this.canvas.parentElement || document.body;
    const w = host.clientWidth || 800;
    const h = host.clientHeight || 600;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(this.opts.fov, w / h, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: this.opts.alpha,
      antialias: this.opts.antialias,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(w, h, false);

    this._ro = new ResizeObserver(() => this._onResize());
    this._ro.observe(host);
    return this;
  }

  onAnimate(fn) { this._animCbs.push(fn); }

  get running() { return this._rafId !== null; }

  start() {
    if (this._rafId !== null) return this;
    this._last = performance.now() / 1000;
    this._loop();
    return this;
  }

  stop() {
    if (this._rafId !== null) cancelAnimationFrame(this._rafId);
    this._rafId = null;
  }

  renderOnce() {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  _loop() {
    this._rafId = requestAnimationFrame(() => this._loop());
    const now = performance.now() / 1000;
    const delta = Math.min(now - this._last, 0.1); // clamp tab-switch jumps
    this._last = now;
    this._elapsed += delta;
    for (let i = 0; i < this._animCbs.length; i++) {
      this._animCbs[i](delta, this._elapsed);
    }
    this.renderer.render(this.scene, this.camera);
  }

  _onResize() {
    const host = this.canvas.parentElement;
    if (!host || !this.camera) return;
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (w < 1 || h < 1) return;
    if (this.camera.aspect === w / h && this.renderer.domElement.width === Math.round(w * this.renderer.getPixelRatio())) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    if (!this.running) this.renderOnce(); // keep static frames crisp
  }

  dispose() {
    this.stop();
    if (this._ro) this._ro.disconnect();
    if (this.scene) {
      this.scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            Object.values(m).forEach((v) => { if (v && v.isTexture) v.dispose(); });
            m.dispose();
          });
        }
      });
    }
    if (this.renderer) this.renderer.dispose();
    this._animCbs = [];
  }
}

/* ═══════════════════════════════════════════
   1. MAGNETIC FIELD — #magneticCanvas in #magnetic
   6000pt (1800 mobile) repulsion cloud, return-to-origin, damping 0.93.
   Recolored to SH tokens: --accent violet (light) / brighter violet +
   additive (dark). The ref's [ ] brackets are replaced by two large
   S / H letterform line-geometries tinted --accent-2 pink.
   ═══════════════════════════════════════════ */

const MAG_N_DESKTOP = 6000;
const MAG_N_MOBILE = 1800;

const MAG_COLORS = {
  light: { particle: 0x6d5efc, pSize: 0.035, pOpacity: 0.6, additive: false, letter: 0xff5a7a, lOpacity: 0.5 },
  dark:  { particle: 0xa99bff, pSize: 0.022, pOpacity: 0.45, additive: true, letter: 0xff7d97, lOpacity: 0.7 },
};

export function initMagneticField() {
  const canvas = document.getElementById('magneticCanvas');
  if (!canvas || !window.WebGLRenderingContext) return;
  const section = canvas.closest('section') || canvas.parentElement;
  if (!section) return;

  const coarse = isCoarsePointer();
  const N = window.innerWidth < 768 ? MAG_N_MOBILE : MAG_N_DESKTOP;

  const mgr = new SceneManager(canvas, { alpha: true, antialias: false, fov: 60 }).init();
  mgr.camera.position.set(0, 0, 8);

  /* particles — wide horizontal cloud (ref distribution) */
  const pPos = new Float32Array(N * 3);
  const pVel = new Float32Array(N * 3);
  const pOri = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 2 + Math.random() * 7;
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta) * 0.5;
    const z = r * Math.cos(phi) * 0.4 - 3;
    pPos[i * 3] = pOri[i * 3] = x;
    pPos[i * 3 + 1] = pOri[i * 3 + 1] = y;
    pPos[i * 3 + 2] = pOri[i * 3 + 2] = z;
  }
  const partGeo = new THREE.BufferGeometry();
  partGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const partMat = new THREE.PointsMaterial({
    color: MAG_COLORS.light.particle,
    size: MAG_COLORS.light.pSize,
    transparent: true,
    opacity: MAG_COLORS.light.pOpacity,
    sizeAttenuation: true,
    depthWrite: false,
  });
  mgr.scene.add(new THREE.Points(partGeo, partMat));

  /* S / H letterforms — angular grotesk strokes framing the cloud,
     tinted --accent-2 (replaces the ref's [ ] brackets). */
  const letterMat = new THREE.LineBasicMaterial({
    color: MAG_COLORS.light.letter,
    transparent: true,
    opacity: MAG_COLORS.light.lOpacity,
  });

  // S — one continuous blocky stroke (like a hairpin S), 3.2 units tall
  const sGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3( 0.9,  1.6, 0),
    new THREE.Vector3(-0.9,  1.6, 0),
    new THREE.Vector3(-0.9,  0.0, 0),
    new THREE.Vector3( 0.9,  0.0, 0),
    new THREE.Vector3( 0.9, -1.6, 0),
    new THREE.Vector3(-0.9, -1.6, 0),
  ]);
  const sLine = new THREE.Line(sGeo, letterMat);

  // H — two uprights + crossbar as line segments
  const hGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-0.9, -1.6, 0), new THREE.Vector3(-0.9, 1.6, 0),
    new THREE.Vector3( 0.9, -1.6, 0), new THREE.Vector3( 0.9, 1.6, 0),
    new THREE.Vector3(-0.9,  0.0, 0), new THREE.Vector3( 0.9, 0.0, 0),
  ]);
  const hLine = new THREE.LineSegments(hGeo, letterMat);

  const S_X = -3.1, H_X = 3.1;
  sLine.position.x = S_X;
  hLine.position.x = H_X;
  mgr.scene.add(sLine, hLine);

  /* theme */
  watchTheme((dark) => {
    const c = dark ? MAG_COLORS.dark : MAG_COLORS.light;
    partMat.color.setHex(c.particle);
    partMat.size = c.pSize;
    partMat.opacity = c.pOpacity;
    partMat.blending = c.additive ? THREE.AdditiveBlending : THREE.NormalBlending;
    partMat.needsUpdate = true;
    letterMat.color.setHex(c.letter);
    letterMat.opacity = c.lOpacity;
    if (!mgr.running) requestAnimationFrame(() => mgr.renderOnce());
  });

  /* reduced motion → one static frame, no loop, no pointer FX */
  if (prefersReducedMotion()) {
    requestAnimationFrame(() => mgr.renderOnce());
    return;
  }

  /* pointer → world-space repulsion point (raycast onto z=0 plane) */
  const mouse = new THREE.Vector2(0, 0);
  const mouseWorld = new THREE.Vector3(0, 0, 0);
  const mouseTarget = new THREE.Vector3(0, 0, 0);
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

  if (fxEnabled()) {
    window.addEventListener('mousemove', (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, mgr.camera);
      raycaster.ray.intersectPlane(plane, mouseTarget);
    }, { passive: true });
  }

  mgr.onAnimate((delta, elapsed) => {
    // touch: gentle autopan sweeps the field instead of mouse parallax
    if (coarse) {
      mouseTarget.set(Math.sin(elapsed * 0.3) * 3.2, Math.cos(elapsed * 0.22) * 1.4, 0);
    }
    // smoothed pointer (0.05 lerp like refs)
    mouseWorld.x += (mouseTarget.x - mouseWorld.x) * 0.05;
    mouseWorld.y += (mouseTarget.y - mouseWorld.y) * 0.05;

    const mx = mouseWorld.x, my = mouseWorld.y;
    const repelR = 1.8, repelF = 0.035;

    for (let i = 0; i < N; i++) {
      const ix = i * 3, iy = ix + 1, iz = ix + 2;
      const dx = pPos[ix] - mx;
      const dy = pPos[iy] - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < repelR && dist > 0) {
        const f = ((repelR - dist) / repelR) * repelF;
        pVel[ix] += (dx / dist) * f;
        pVel[iy] += (dy / dist) * f;
      }
      // return to origin
      pVel[ix] += (pOri[ix] - pPos[ix]) * 0.01;
      pVel[iy] += (pOri[iy] - pPos[iy]) * 0.01;
      pVel[iz] += (pOri[iz] - pPos[iz]) * 0.01;
      // damping
      pVel[ix] *= 0.93; pVel[iy] *= 0.93; pVel[iz] *= 0.93;
      pPos[ix] += pVel[ix];
      pPos[iy] += pVel[iy];
      pPos[iz] += pVel[iz];
      // subtle wave
      pPos[iy] += Math.sin(elapsed + i * 0.01) * 0.0002;
    }
    partGeo.attributes.position.needsUpdate = true;

    // camera gentle drift
    mgr.camera.position.x = Math.sin(elapsed * 0.1) * 0.4;
    mgr.camera.position.y = Math.cos(elapsed * 0.08) * 0.25;
    mgr.camera.lookAt(0, 0, -3);

    // letterforms breathe apart / together
    const breathe = 1 + Math.sin(elapsed * 0.4) * 0.04;
    sLine.scale.y = breathe;
    hLine.scale.y = breathe;
    sLine.position.x = S_X - Math.sin(elapsed * 0.3) * 0.08;
    hLine.position.x = H_X + Math.sin(elapsed * 0.3) * 0.08;
    sLine.rotation.z = Math.sin(elapsed * 0.25) * 0.03;
    hLine.rotation.z = -Math.sin(elapsed * 0.25) * 0.03;
  });

  observeVisibility(section, mgr);
}

/* ═══════════════════════════════════════════
   2. GRAVITY FRAMES — #gravityCanvas in #gravity
   Floating wireframe frames (fibonacci-sphere spread) + drifting
   particles, mouse parallax + raycast hover. Recolored: edges
   0x6d5efc (light) / 0x8ad0ff (dark), theme-reactive.
   ═══════════════════════════════════════════ */

const GRAV_COLORS = {
  light: { edge: 0x6d5efc, fill: 0xdcd6ff, fillOp: 0.12, hoverOp: 0.26, particle: 0x6d5efc, pSize: 0.08, pOpacity: 0.6, additive: false },
  dark:  { edge: 0x8ad0ff, fill: 0x0a1420, fillOp: 0.18, hoverOp: 0.35, particle: 0x8ad0ff, pSize: 0.05, pOpacity: 0.5, additive: true },
};

export function initGravityFrames() {
  const canvas = document.getElementById('gravityCanvas');
  if (!canvas || !window.WebGLRenderingContext) return;
  const section = canvas.closest('section') || canvas.parentElement;
  if (!section) return;

  const coarse = isCoarsePointer();
  const mobile = window.innerWidth < 768;
  const FRAME_COUNT = mobile ? 9 : 14;
  const PART_COUNT = mobile ? 90 : 200;

  const mgr = new SceneManager(canvas, { alpha: true, antialias: true, fov: 60 }).init();
  mgr.camera.position.z = 15;

  /* frames */
  const frames = [];
  for (let i = 0; i < FRAME_COUNT; i++) {
    const geo = new THREE.PlaneGeometry(4, 2.25);
    const fillMat = new THREE.MeshBasicMaterial({
      color: GRAV_COLORS.light.fill,
      transparent: true,
      opacity: GRAV_COLORS.light.fillOp,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(geo, fillMat);

    const edgeMat = new THREE.LineBasicMaterial({
      color: GRAV_COLORS.light.edge,
      transparent: true,
      opacity: 0.7,
    });
    plane.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat));

    // fibonacci-sphere distribution
    const phi = Math.acos(-1 + (2 * i) / FRAME_COUNT);
    const theta = Math.sqrt(FRAME_COUNT * Math.PI) * phi;
    const r = 9 + Math.random() * 4;
    plane.position.set(
      r * Math.cos(theta) * Math.sin(phi),
      r * Math.sin(theta) * Math.sin(phi) * 0.65,
      r * Math.cos(phi) - 6
    );
    plane.lookAt(0, 0, 0);
    plane.userData = {
      originalPos: plane.position.clone(),
      floatOffset: Math.random() * Math.PI * 2,
      fillMat,
      edgeMat,
    };
    frames.push(plane);
    mgr.scene.add(plane);
  }

  /* dust particles */
  const pPos = new Float32Array(PART_COUNT * 3);
  for (let i = 0; i < PART_COUNT; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 40;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 30;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }
  const partGeo = new THREE.BufferGeometry();
  partGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const partMat = new THREE.PointsMaterial({
    color: GRAV_COLORS.light.particle,
    size: GRAV_COLORS.light.pSize,
    transparent: true,
    opacity: GRAV_COLORS.light.pOpacity,
    depthWrite: false,
  });
  const particles = new THREE.Points(partGeo, partMat);
  mgr.scene.add(particles);

  /* theme */
  let baseFillOp = GRAV_COLORS.light.fillOp;
  let hoverFillOp = GRAV_COLORS.light.hoverOp;
  watchTheme((dark) => {
    const c = dark ? GRAV_COLORS.dark : GRAV_COLORS.light;
    baseFillOp = c.fillOp;
    hoverFillOp = c.hoverOp;
    frames.forEach((mesh) => {
      mesh.userData.edgeMat.color.setHex(c.edge);
      mesh.userData.fillMat.color.setHex(c.fill);
      mesh.userData.fillMat.opacity = c.fillOp;
    });
    partMat.color.setHex(c.particle);
    partMat.size = c.pSize;
    partMat.opacity = c.pOpacity;
    partMat.blending = c.additive ? THREE.AdditiveBlending : THREE.NormalBlending;
    partMat.needsUpdate = true;
    if (!mgr.running) requestAnimationFrame(() => mgr.renderOnce());
  });

  /* reduced motion → single static frame */
  if (prefersReducedMotion()) {
    requestAnimationFrame(() => mgr.renderOnce());
    return;
  }

  /* pointer parallax (smoothed 0.05 lerp); touch → gentle autopan */
  const mouseVec = new THREE.Vector2(0, 0);
  const raycaster = new THREE.Raycaster();
  let smX = 0, smY = 0;

  if (fxEnabled()) {
    window.addEventListener('mousemove', (e) => {
      mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });
  }

  mgr.onAnimate((delta, elapsed) => {
    if (coarse) {
      mouseVec.x = Math.sin(elapsed * 0.24) * 0.55;
      mouseVec.y = Math.cos(elapsed * 0.18) * 0.35;
    }
    smX += (mouseVec.x - smX) * 0.05;
    smY += (mouseVec.y - smY) * 0.05;

    frames.forEach((mesh) => {
      const d = mesh.userData;
      mesh.position.x = d.originalPos.x + Math.sin(elapsed * 0.5 + d.floatOffset) * 0.5 + smX * 2;
      mesh.position.y = d.originalPos.y + Math.cos(elapsed * 0.3 + d.floatOffset) * 0.3 + smY * 1.5;
      mesh.position.z = d.originalPos.z + Math.sin(elapsed * 0.4 + d.floatOffset) * 0.2;
      mesh.rotation.z = Math.sin(elapsed * 0.2 + d.floatOffset) * 0.05;
    });

    particles.rotation.y += 0.0005;
    particles.rotation.x += 0.0002;

    mgr.camera.position.x = Math.sin(elapsed * 0.1) * 2 + smX * 3;
    mgr.camera.position.y = Math.cos(elapsed * 0.1) * 1 + smY * 2;
    mgr.camera.lookAt(0, 0, 0);

    // hover — fine pointers only
    if (!coarse) {
      raycaster.setFromCamera(mouseVec, mgr.camera);
      const hits = raycaster.intersectObjects(frames);
      frames.forEach((mesh) => {
        mesh.userData.fillMat.opacity = baseFillOp;
        mesh.scale.setScalar(1);
      });
      if (hits.length > 0) {
        const h = hits[0].object;
        h.userData.fillMat.opacity = hoverFillOp;
        h.scale.setScalar(1.08);
      }
    }
  });

  observeVisibility(section, mgr);
}
