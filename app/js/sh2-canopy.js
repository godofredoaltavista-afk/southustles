/* ═══════════════════════════════════════════
   SH2 — JUNGLE CANOPY LEAF FIELDS
   #canopy → initCanopyField()
   #case-study banner → initCaseBannerLeaves()

   Adapted from the MIT-licensed "Jungle Cursor Canopy" by kaolti
   (github.com/kaolti/jungle-cursor-canopy) — procedural leaf
   textures painted on canvas, wind-sway via onBeforeCompile vertex
   shader keyed off each mesh's own modelMatrix (so a handful of
   shared materials still animate every leaf independently), PLUS
   the source's actual cursor-wake mechanic ported: each leaf's
   screen-projected position vs. the smoothed pointer drives a
   spring/damper displacement + lean, and the camera itself tilts
   toward the pointer. Modest real shadow-mapping — leaves cast
   onto each other, no backdrop plane needed since the canvas stays
   alpha-blended over the section's own background.

   createLeafField() is the shared engine; the two exports just
   supply placement/tuning per section so both "journey" spots on
   the site reuse one implementation instead of two.
   ═══════════════════════════════════════════ */

import * as THREE from 'three';
import { fxEnabled, prefersReducedMotion, isCoarsePointer } from './env.js';

/* ── minimal SceneManager (see sh2-three.js for the annotated original) ── */
class SceneManager {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.opts = { alpha: true, antialias: true, fov: 45, ...opts };
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this._rafId = null;
    this._last = 0;
    this._animCbs = [];
    this._ro = null;
  }

  init() {
    const host = this.canvas.parentElement || document.body;
    const w = host.clientWidth || 800;
    const h = host.clientHeight || 600;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(this.opts.fov, w / h, 0.1, 60);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: this.opts.alpha,
      antialias: this.opts.antialias,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    if (this.opts.shadows) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
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
    const delta = Math.min(now - this._last, 0.1);
    this._last = now;
    this._elapsed = (this._elapsed || 0) + delta;
    for (let i = 0; i < this._animCbs.length; i++) this._animCbs[i](delta, this._elapsed);
    this.renderer.render(this.scene, this.camera);
  }

  _onResize() {
    const host = this.canvas.parentElement;
    if (!host || !this.camera) return;
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (w < 1 || h < 1) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    if (!this.running) this.renderOnce();
  }
}

function observeVisibility(sectionEl, mgr) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((entry) => (entry.isIntersecting ? mgr.start() : mgr.stop())),
    { rootMargin: '12% 0px 12% 0px', threshold: 0 }
  );
  io.observe(sectionEl);
  return io;
}

/* ── procedural leaf textures (subset of the source repo's palette set) ── */

function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash2(x, y, seed) {
  let n = Math.imul(x + seed * 1013, 374761393) + Math.imul(y - seed * 79, 668265263);
  n = n ^ (n >>> 13);
  n = Math.imul(n, 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}
const clamp = THREE.MathUtils.clamp;
const smoothstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

const palettes = {
  monstera: [[22, 77, 46], [79, 128, 70], [170, 184, 104]],
  lance: [[15, 74, 42], [53, 126, 65], [145, 172, 84]],
  fern: [[20, 73, 39], [64, 126, 65], [158, 176, 88]],
};

function leafWidth(kind, y) {
  const s = Math.max(0, Math.sin(Math.PI * y));
  if (kind === 'lance' || kind === 'fern') return Math.pow(s, 1.28) * (0.66 + y * 0.12);
  return Math.pow(s, 0.55) * (0.82 + 0.15 * y);
}

function makeLeafTexture(kind, seed) {
  const w = 192, h = 384;
  const colorCanvas = document.createElement('canvas');
  const bumpCanvas = document.createElement('canvas');
  colorCanvas.width = bumpCanvas.width = w;
  colorCanvas.height = bumpCanvas.height = h;
  const colorCtx = colorCanvas.getContext('2d');
  const bumpCtx = bumpCanvas.getContext('2d');
  const colorImage = colorCtx.createImageData(w, h);
  const bumpImage = bumpCtx.createImageData(w, h);
  const p = palettes[kind];

  for (let py = 0; py < h; py++) {
    const y = py / (h - 1);
    const width = leafWidth(kind, y);
    for (let px = 0; px < w; px++) {
      const x = (px / (w - 1) - 0.5) * 2;
      const nx = Math.abs(x) / Math.max(0.001, width);
      const signed = 1 - nx;
      let inside = signed > -0.015 && y > 0.008 && y < 0.996;

      if (inside && kind === 'monstera') {
        const ax = Math.abs(x);
        for (let k = 0; k < 4; k++) {
          const inner = 0.23 + k * 0.022 + (hash2(k, seed, 51) - 0.5) * 0.026;
          const cx = (x < 0 ? -1 : 1) * (0.225 + k * 0.052 + (hash2(k, seed, 61) - 0.5) * 0.025);
          const cy = 0.31 + k * 0.105 + (hash2(k, seed, 71) - 0.5) * 0.025;
          const rx = 0.026 + k * 0.003;
          const ry = 0.038 + k * 0.005;
          const skewY = y - cy - (x - cx) * (x < 0 ? -1 : 1) * 0.26;
          if (ax > inner && ((x - cx) ** 2 / (rx * rx) + skewY ** 2 / (ry * ry)) < 1) inside = false;
        }
      }

      const i = (py * w + px) * 4;
      if (!inside) {
        colorImage.data[i + 3] = 0;
        bumpImage.data[i] = bumpImage.data[i + 1] = bumpImage.data[i + 2] = 112;
        bumpImage.data[i + 3] = 255;
        continue;
      }

      const n0 = hash2(px >> 2, py >> 2, seed);
      const n1 = hash2(px >> 4, py >> 4, seed + 17);
      const middle = Math.exp(-Math.abs(x) * (kind === 'lance' ? 28 : 35));
      const ribWave = Math.abs(((y * 8.5 + Math.abs(x) * 1.85) % 1) - 0.5);
      const sideVein = Math.exp(-ribWave * 46) * smoothstep(0.04, 0.82, Math.abs(x));
      const edge = smoothstep(0, 0.16, signed);
      const mottling = (n0 - 0.5) * 0.16 + (n1 - 0.5) * 0.12;
      const light = clamp(0.42 + y * 0.12 + mottling + middle * 0.34 + sideVein * 0.16 - (1 - edge) * 0.27, 0, 1);

      const c0 = p[0], c1 = p[1], c2 = p[2];
      const t = smoothstep(0.08, 0.9, light);
      const hi = smoothstep(0.56, 1, t);
      for (let ch = 0; ch < 3; ch++) {
        const low = c0[ch] + (c1[ch] - c0[ch]) * t;
        colorImage.data[i + ch] = clamp(low + (c2[ch] - low) * hi * 0.58, 0, 255);
      }
      colorImage.data[i + 3] = clamp(edge * 390, 0, 255);

      const bump = clamp(112 + (n0 - 0.5) * 22 + middle * 100 + sideVein * 52 - (1 - edge) * 18, 0, 255);
      bumpImage.data[i] = bumpImage.data[i + 1] = bumpImage.data[i + 2] = bump;
      bumpImage.data[i + 3] = 255;
    }
  }

  colorCtx.putImageData(colorImage, 0, 0);
  bumpCtx.putImageData(bumpImage, 0, 0);
  const map = new THREE.CanvasTexture(colorCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  const bump = new THREE.CanvasTexture(bumpCanvas);
  return { map, bump };
}

const geometryCache = new Map();
function leafGeometry(width, length) {
  const key = `${width.toFixed(2)}-${length.toFixed(2)}`;
  if (geometryCache.has(key)) return geometryCache.get(key);
  const geo = new THREE.PlaneGeometry(width, length, 8, 14);
  geo.translate(0, length * 0.5, 0);
  const position = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < position.count; i++) {
    const across = position.getX(i) / (width * 0.5);
    const along = uv.getY(i);
    const arch = (1 - Math.pow(Math.abs(across), 1.62)) * Math.sin(Math.PI * along);
    const twist = across * (along - 0.22);
    position.setZ(i, arch * length * 0.052 + twist * length * 0.038);
  }
  position.needsUpdate = true;
  geo.computeVertexNormals();
  geometryCache.set(key, geo);
  return geo;
}

/* wind-sway vertex shader — worldPhase comes from each mesh's own
   modelMatrix, so every leaf drawn with a shared material still
   sways on its own phase. */
function buildMaterial(kind, index, textureSets) {
  const tex = textureSets[kind];
  const material = new THREE.MeshPhysicalMaterial({
    map: tex.map,
    bumpMap: tex.bump,
    bumpScale: kind === 'monstera' ? 0.065 : 0.045,
    alphaTest: 0.42,
    side: THREE.DoubleSide,
    shadowSide: THREE.DoubleSide,
    roughness: 0.74,
    metalness: 0,
    clearcoat: 0.13,
    clearcoatRoughness: 0.62,
    sheen: 0.24,
    sheenColor: new THREE.Color(0x7da06a),
    sheenRoughness: 0.8,
    emissive: new THREE.Color(0x06140a),
    emissiveIntensity: 0.18,
  });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = { value: 0 };
    shader.uniforms.uWindStrength = { value: 0.85 };
    shader.uniforms.uTurbulence = { value: 0.55 };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>
        uniform float uTime;
        uniform float uWindStrength;
        uniform float uTurbulence;
      `)
      .replace('#include <begin_vertex>', `
        vec3 transformed = vec3(position);
        float root = pow(uv.y, 1.28);
        float worldPhase = dot(modelMatrix[3].xyz, vec3(0.71, 1.13, 0.43)) + ${index.toFixed(1)};
        vec2 worldXY = modelMatrix[3].xy;
        float gustCell = sin(uTime * 0.23 + worldXY.x * 0.42 + sin(worldXY.y * 0.37 + uTime * 0.11));
        float localGust = pow(max(0.0, gustCell), 3.6);
        float breath = sin(uTime * 0.46 + worldPhase) * 0.20 + sin(uTime * 1.17 + worldPhase * 1.7) * 0.07 + localGust * 0.62;
        float flutter = (sin(uTime * 2.7 + uv.y * 8.0 + worldPhase * 2.2) * 0.012 + localGust * sin(uv.y * 11.0 + worldPhase) * 0.038) * uTurbulence;
        transformed.x += (breath * 0.075 * uWindStrength + flutter) * root;
        transformed.z += breath * 0.12 * root * uWindStrength + flutter * root * 0.8;
      `);
    material.userData.shader = shader;
  };
  material.customProgramCacheKey = () => `canopy-wind-${index}`;
  return material;
}

/* ── shared leaf-field engine ──────────────────────────────────── */

function createLeafField(canvas, section, opts) {
  const {
    leafCount, centerClearRadius, edgeBiasProbability, spread,
    wakeRadius, wakeForce, leanForce, spring, damping,
    tiltStrength, tiltEase, cameraDistance, cameraFov, shadows,
    pointerScope,
  } = opts;

  const coarse = isCoarsePointer();
  const mgr = new SceneManager(canvas, { alpha: true, antialias: true, fov: cameraFov, shadows }).init();
  const cameraTarget = new THREE.Vector3(0, 0, -1.5);
  const cameraOrbit = new THREE.Euler(0, 0, 0, 'YXZ');
  const cameraOffset = new THREE.Vector3();

  mgr.scene.add(new THREE.HemisphereLight(0x9fc09b, 0x061009, 1.5));
  const sun = new THREE.DirectionalLight(0xece5ff, 2.4);
  sun.position.set(-6, 5, 6);
  if (shadows) {
    sun.castShadow = true;
    sun.shadow.mapSize.set(512, 512);
    sun.shadow.camera.left = -spread.x * 1.15;
    sun.shadow.camera.right = spread.x * 1.15;
    sun.shadow.camera.top = spread.y * 1.15;
    sun.shadow.camera.bottom = -spread.y * 1.15;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 20;
    sun.shadow.bias = -0.0015;
    sun.shadow.radius = 3;
  }
  mgr.scene.add(sun);
  const fill = new THREE.DirectionalLight(0x2f8a2f, 1.6);
  fill.position.set(6, -2, 4);
  mgr.scene.add(fill);

  const kinds = ['monstera', 'lance', 'fern'];
  const textureSets = Object.fromEntries(kinds.map((kind, i) => [kind, makeLeafTexture(kind, i * 31 + 7)]));
  const materials = Object.fromEntries(kinds.map((kind, i) => [kind, buildMaterial(kind, i, textureSets)]));
  const dims = { monstera: [2.05, 2.7], lance: [0.68, 3.45], fern: [0.46, 1.5] };

  const rand = mulberry32(0x5eaf17);
  const leaves = [];

  // Three depth layers with the source repo's own trick: back leaves are
  // scaled *up*, not down, to compensate for perspective shrinkage — every
  // layer reads as roughly the same visual weight instead of the far layer
  // thinning out into slivers cut off at the frame edge. Weights (42/36/22)
  // and edge-bias (~31%) mirror the source's fillLayer ratios; centered
  // leaves are only lightly nudged, not force-cleared, so the field looks
  // grown-in rather than punched with a hole for the text.
  const depthLayers = [
    { weight: 0.42, zMin: -8.6, zMax: -5.4, scaleMin: 0.85, scaleMax: 1.5 },
    { weight: 0.36, zMin: -5.6, zMax: -3.2, scaleMin: 0.55, scaleMax: 1.05 },
    { weight: 0.22, zMin: -3.4, zMax: -1.2, scaleMin: 0.5, scaleMax: 1.0 },
  ];
  function pickDepthLayer() {
    const r = rand();
    let acc = 0;
    for (const layer of depthLayers) {
      acc += layer.weight;
      if (r <= acc) return layer;
    }
    return depthLayers[depthLayers.length - 1];
  }

  for (let i = 0; i < leafCount; i++) {
    const layer = pickDepthLayer();
    const kind = kinds[Math.floor(rand() * kinds.length)];
    const [w, l] = dims[kind];
    const scale = layer.scaleMin + rand() * (layer.scaleMax - layer.scaleMin);
    const mesh = new THREE.Mesh(leafGeometry(w, l), materials[kind]);
    if (shadows) { mesh.castShadow = true; mesh.receiveShadow = true; }
    const group = new THREE.Group();
    group.add(mesh);

    let x = (rand() * 2 - 1) * spread.x;
    let y = (rand() * 2 - 1) * spread.y;
    if (rand() < edgeBiasProbability) {
      if (rand() < 0.5) x = (rand() < 0.5 ? -1 : 1) * (spread.x * 0.55 + rand() * spread.x * 0.5);
      else y = (rand() < 0.5 ? -1 : 1) * (spread.y * 0.55 + rand() * spread.y * 0.5);
    }
    const centerDist = Math.hypot(x, y);
    if (centerClearRadius > 0 && centerDist < centerClearRadius) {
      const angle = centerDist > 0.001 ? Math.atan2(y, x) : rand() * Math.PI * 2;
      const push = (centerClearRadius - centerDist) * 0.6;
      x += Math.cos(angle) * push;
      y += Math.sin(angle) * push;
    }
    const z = layer.zMin + rand() * (layer.zMax - layer.zMin);

    group.position.set(x, y, z);
    group.scale.setScalar(scale);
    const baseRotation = new THREE.Euler((rand() - 0.5) * 0.6, (rand() - 0.5) * 1.4, (rand() - 0.5) * 0.9);
    group.rotation.copy(baseRotation);
    mgr.scene.add(group);

    leaves.push({
      group, mesh,
      basePosition: group.position.clone(),
      baseRotation,
      phase: rand() * Math.PI * 2,
      flex: 0.72 + rand() * 0.7,
      radius: 0.31 + Math.min(0.18, Math.max(0, (z + 5) * 0.012)),
      depthResponse: clamp((z + 7) / 14, 0.25, 1),
      displacement: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      lean: new THREE.Vector2(),
      angularVelocity: new THREE.Vector2(),
    });
  }

  if (prefersReducedMotion()) {
    mgr.camera.position.set(0, 0.15, cameraDistance);
    mgr.camera.lookAt(cameraTarget);
    mgr.renderOnce();
    return { triggerZoomPulse() {} };
  }

  const pointer = { x: 0, y: 0, sx: 0, sy: 0, active: false };
  const easedCameraPointer = new THREE.Vector2();
  const tempProjection = new THREE.Vector3();

  // click-triggered dolly: quick push-in then settle back, used to punctuate
  // a CTA click before the page scrolls to whatever it reveals.
  const ZOOM_DURATION = 0.9;
  const zoomState = { active: false, startedAt: 0 };
  let currentElapsed = 0;
  function triggerZoomPulse() {
    zoomState.active = true;
    zoomState.startedAt = currentElapsed;
  }

  function setPointerFromClient(clientX, clientY) {
    const rect = (pointerScope || canvas).getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -(((clientY - rect.top) / rect.height) * 2 - 1);
    pointer.active = true;
  }

  if (fxEnabled() && !coarse) {
    window.addEventListener('pointermove', (e) => setPointerFromClient(e.clientX, e.clientY), { passive: true });
    window.addEventListener('pointerleave', () => { pointer.active = false; }, { passive: true });
  }

  mgr.onAnimate((delta, elapsed) => {
    const dt = Math.min(0.033, delta || 0.016);
    currentElapsed = elapsed;

    if (coarse) {
      pointer.x = Math.sin(elapsed * 0.22) * 0.6;
      pointer.y = Math.cos(elapsed * 0.17) * 0.4;
      pointer.active = true;
    }
    pointer.sx += (pointer.x - pointer.sx) * (1 - Math.exp(-dt * 13));
    pointer.sy += (pointer.y - pointer.sy) * (1 - Math.exp(-dt * 13));

    const aspect = mgr.camera.aspect;
    const windTime = elapsed * 1.06;

    for (const leaf of leaves) {
      tempProjection.copy(leaf.group.position).project(mgr.camera);
      const dx = tempProjection.x - pointer.sx;
      const dy = tempProjection.y - pointer.sy;
      const dist = Math.hypot(dx * aspect, dy);

      const wakeR = leaf.radius * wakeRadius;
      const influence = pointer.active ? (1 - smoothstep(wakeR * 0.16, wakeR, dist)) * (0.78 + leaf.depthResponse * 0.22) : 0;
      const inv = 1 / Math.max(0.018, dist);
      const centered = dist < 0.026;
      const awayX = centered ? Math.cos(leaf.phase) : dx * aspect * inv;
      const awayY = centered ? Math.sin(leaf.phase) : dy * inv;

      const pulse = 0.8 * wakeForce;
      const targetX = awayX * influence * 2.65 * pulse;
      const targetY = awayY * influence * 2.15 * pulse;
      const targetZ = -influence * 1.05 * leaf.depthResponse * wakeForce;

      const leafSpring = spring * leaf.flex;
      leaf.velocity.x += ((targetX - leaf.displacement.x) * leafSpring - leaf.velocity.x * damping) * dt;
      leaf.velocity.y += ((targetY - leaf.displacement.y) * leafSpring - leaf.velocity.y * damping) * dt;
      leaf.velocity.z += ((targetZ - leaf.displacement.z) * leafSpring - leaf.velocity.z * damping) * dt;
      leaf.displacement.addScaledVector(leaf.velocity, dt);

      const targetLeanX = -awayY * influence * 1.2 * leanForce;
      const targetLeanY = awayX * influence * 1.3 * leanForce;
      leaf.angularVelocity.x += ((targetLeanX - leaf.lean.x) * 36 - leaf.angularVelocity.x * 9) * dt;
      leaf.angularVelocity.y += ((targetLeanY - leaf.lean.y) * 36 - leaf.angularVelocity.y * 9) * dt;
      leaf.lean.x += leaf.angularVelocity.x * dt;
      leaf.lean.y += leaf.angularVelocity.y * dt;

      const gustCell = Math.sin(windTime * 0.23 + leaf.basePosition.x * 0.42 + Math.sin(leaf.basePosition.y * 0.37 + windTime * 0.11));
      const localGust = Math.max(0, gustCell) ** 3.6;
      const eddy = Math.sin(windTime * 0.58 + leaf.basePosition.y * 0.74 - leaf.basePosition.x * 0.19);
      const slowWind = Math.sin(windTime * 0.46 + leaf.phase) * 0.011 + eddy * 0.007 + localGust * (0.032 + 0.022 * Math.sin(windTime * 1.6 + leaf.phase));
      const gust = localGust * Math.sin(windTime * 2.05 + leaf.phase) * 0.042;

      leaf.group.position.set(
        leaf.basePosition.x + leaf.displacement.x,
        leaf.basePosition.y + leaf.displacement.y + slowWind * 0.12,
        leaf.basePosition.z + leaf.displacement.z
      );
      leaf.group.rotation.set(
        leaf.baseRotation.x + leaf.lean.x + slowWind + gust,
        leaf.baseRotation.y + leaf.lean.y + slowWind * 0.65,
        leaf.baseRotation.z + Math.sin(elapsed * 0.31 + leaf.phase) * 0.014
      );
    }

    for (const kind of kinds) {
      const shader = materials[kind].userData.shader;
      if (shader) shader.uniforms.uTime.value = windTime;
    }

    const tiltBlend = 1 - Math.exp(-dt * tiltEase);
    easedCameraPointer.x += (pointer.sx - easedCameraPointer.x) * tiltBlend;
    easedCameraPointer.y += (pointer.sy - easedCameraPointer.y) * tiltBlend;
    const easedTiltX = Math.sign(easedCameraPointer.x) * smoothstep(0, 1, Math.abs(easedCameraPointer.x));
    const easedTiltY = Math.sign(easedCameraPointer.y) * smoothstep(0, 1, Math.abs(easedCameraPointer.y));
    cameraOrbit.set(
      THREE.MathUtils.degToRad(-easedTiltY * tiltStrength),
      THREE.MathUtils.degToRad(easedTiltX * tiltStrength),
      0,
      'YXZ'
    );
    let zoomFactor = 1;
    if (zoomState.active) {
      const t = (currentElapsed - zoomState.startedAt) / ZOOM_DURATION;
      if (t >= 1) {
        zoomState.active = false;
      } else {
        const inOut = Math.sin(clamp(t, 0, 1) * Math.PI); // 0 -> 1 -> 0
        zoomFactor = 1 - inOut * 0.68;
      }
    }
    cameraOffset.set(0, 0.15, cameraDistance * zoomFactor).applyEuler(cameraOrbit);
    mgr.camera.position.copy(cameraTarget).add(cameraOffset);
    mgr.camera.lookAt(cameraTarget);
  });

  observeVisibility(section, mgr);
  return { triggerZoomPulse };
}

/* ── #canopy — the main placeholder section ──────────────────────
   Stronger wake than the source's own default: this is a small,
   isolated accent (not a fullscreen field), so the push needs to
   read clearly at a glance — "buen movimiento... poder
   desorganizarlas" (Franco). Subtle real shadows: leaves cast onto
   each other, no backdrop plane needed since alpha shows the
   section's own dark background through. */
export function initCanopyField() {
  const canvas = document.getElementById('canopyCanvas');
  if (!canvas || !window.WebGLRenderingContext) return;
  const section = canvas.closest('section') || canvas.parentElement;
  if (!section) return;

  const field = createLeafField(canvas, section, {
    leafCount: isCoarsePointer() ? 30 : 48,
    centerClearRadius: 1.8,
    edgeBiasProbability: 0.32,
    spread: { x: 8.6, y: 5.6 },
    wakeRadius: 2.7,
    wakeForce: 2.6,
    leanForce: 3.0,
    spring: 22,
    damping: 16,
    tiltStrength: 9,
    tiltEase: 3,
    cameraDistance: 9,
    cameraFov: 42,
    shadows: true,
  });

  // "Ver proyecto" → dolly the leaves in as a punctuation beat, then
  // smooth-scroll into the reveal section (same leaf/outline-text/gradient
  // treatment as the case-study banner, per Franco's note that this look
  // should be what the CTA leads into rather than living only downpage).
  const cta = section.querySelector('.sh2-canopy-cta');
  const revealTarget = document.getElementById('canopy-reveal');
  if (cta && revealTarget) {
    cta.addEventListener('click', (e) => {
      e.preventDefault();
      field?.triggerZoomPulse();
      revealTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

/* ── #case-study banner — second "journey" touchpoint ─────────────
   Same engine, tuned for the short full-bleed banner strip instead
   of a tall section: fewer leaves, shorter camera throw, wake
   scoped to the banner's own rect so it doesn't react to pointer
   movement happening elsewhere on the case-study page. */
export function initCaseBannerLeaves() {
  const canvas = document.getElementById('caseBannerCanvas');
  if (!canvas || !window.WebGLRenderingContext) return;
  const host = canvas.closest('.case__banner-inner') || canvas.parentElement;
  if (!host) return;

  createLeafField(canvas, host, {
    leafCount: isCoarsePointer() ? 10 : 16,
    centerClearRadius: 1.1,
    edgeBiasProbability: 0.32,
    spread: { x: 7.5, y: 2.6 },
    wakeRadius: 2.9,
    wakeForce: 2.4,
    leanForce: 2.8,
    spring: 22,
    damping: 16,
    tiltStrength: 6,
    tiltEase: 3,
    cameraDistance: 7.5,
    cameraFov: 38,
    shadows: true,
    pointerScope: host,
  });
}

/* ── #canopy-reveal — the "Ver proyecto" destination ───────────────
   Same gradient / outline-text / leaves look as the case-study
   banner, but tall and scrollable instead of a short strip: leaves
   spread vertically the whole way down so there's room to drop in
   real project copy later. */
export function initCanopyRevealLeaves() {
  const canvas = document.getElementById('canopyRevealCanvas');
  if (!canvas || !window.WebGLRenderingContext) return;
  const section = canvas.closest('section') || canvas.parentElement;
  if (!section) return;

  createLeafField(canvas, section, {
    leafCount: isCoarsePointer() ? 24 : 40,
    centerClearRadius: 1.3,
    edgeBiasProbability: 0.32,
    spread: { x: 7.8, y: 11 },
    wakeRadius: 2.4,
    wakeForce: 1.8,
    leanForce: 2.2,
    spring: 20,
    damping: 17,
    tiltStrength: 5,
    tiltEase: 3,
    cameraDistance: 12,
    cameraFov: 46,
    shadows: true,
  });
}
