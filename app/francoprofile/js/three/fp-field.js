// FP · FIELD — EL único renderer Three.js de /francoprofile (03 §11.2: «Renderers vivos: 1»).
// Port de southustles/app/js/sh2-three.js (SceneManager + initMagneticField: 6000/1800 partículas,
// repulsión por raycast al plano z=0, retorno 0.01, amortiguación 0.93, deriva de cámara, autopan en touch)
// + cuerpo de partículas animado con el boxer.json real de Motion Lab (21 puntos × 91 frames a 30 fps),
// con aura (puntos aditivos grandes) y manos que dejan estela. Modos de manejo de Ant on Mars (NavHUD):
// G gravedad · Z imán (default) · H hook · F flotar.
// Modos por capítulo: [data-fp-gl="hero|bolsa|calm"] visibles → el canvas aparece; nada visible y app cerrada → stop() (GPU 0 %).
// Escucha: fp-app {open}, fp-theme-changed, fp-accent-changed. Despacha: fp-drive-changed {mode}, fp-drive {mode}, fp-gl-mode {mode}.
import * as THREE from 'three';

console.log('[fp/field] init');

/* ── shader de puntos redondos y suaves (un solo tipo de material para campo, cuerpo, estela y aura) ── */
const VERT = /* glsl */`
  attribute vec3 aColor;
  attribute float aAlpha;
  attribute float aSize;
  uniform float uPR;
  uniform float uSize;
  varying vec3 vC;
  varying float vA;
  void main() {
    vC = aColor;
    vA = aAlpha;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uSize * uPR * (8.0 / max(0.1, -mv.z));
  }`;
const FRAG = /* glsl */`
  uniform float uOpacity;
  uniform float uSoft;
  varying vec3 vC;
  varying float vA;
  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float d = length(p);
    if (d > 0.5) discard;
    float a = mix(1.0 - smoothstep(0.32, 0.5, d), pow(1.0 - d * 2.0, 2.0), uSoft);
    gl_FragColor = vec4(vC, a * vA * uOpacity);
  }`;

function pointsMaterial({ size = 2, opacity = 1, soft = 0 } = {}) {
  return new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: { uPR: { value: 1 }, uSize: { value: size }, uOpacity: { value: opacity }, uSoft: { value: soft } },
    transparent: true,
    depthWrite: false,
    depthTest: false,
  });
}

/* ── SceneManager (contrato de South Hustles / Ant on Mars + dispose; DPR ≤ 1.5 a pantalla completa) ── */
class SceneManager {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.opts = { fov: 60, dpr: 1.5, ...opts };
    this._raf = null; this._last = 0; this._elapsed = 0; this._cbs = [];
  }
  init() {
    const w = window.innerWidth, h = window.innerHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(this.opts.fov, w / h, 0.1, 100);
    this.camera.position.set(0, 0, 8);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
    this.renderer.setClearColor(0x000000, 0);
    this.pr = Math.min(window.devicePixelRatio || 1, this.opts.dpr);
    this.renderer.setPixelRatio(this.pr);
    this.renderer.setSize(w, h, false);
    this._onResize = () => this.resize();
    window.addEventListener('resize', this._onResize, { passive: true });
    return this;
  }
  onAnimate(fn) { this._cbs.push(fn); }
  get running() { return this._raf !== null; }
  start() {
    if (this._raf !== null) return this;
    this._last = performance.now() / 1000;
    const loop = () => {
      this._raf = requestAnimationFrame(loop);
      const now = performance.now() / 1000;
      const delta = Math.min(now - this._last, 0.1); // clamp de saltos de pestaña
      this._last = now;
      this._elapsed += delta;
      for (const fn of this._cbs) fn(delta, this._elapsed);
      this.renderer.render(this.scene, this.camera);
    };
    loop();
    return this;
  }
  stop() { if (this._raf !== null) cancelAnimationFrame(this._raf); this._raf = null; }
  step(delta = 1 / 60) { for (const fn of this._cbs) fn(delta, this._elapsed); this.renderOnce(); }
  renderOnce() { if (this.renderer) this.renderer.render(this.scene, this.camera); }
  resize() {
    const w = window.innerWidth, h = window.innerHeight;
    if (w < 1 || h < 1) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    if (!this.running) this.renderOnce();
  }
  dispose() {
    this.stop();
    window.removeEventListener('resize', this._onResize);
    this.scene?.traverse((o) => {
      o.geometry?.dispose?.();
      const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      mats.forEach((m) => { Object.values(m.uniforms || {}).forEach((u) => u?.value?.isTexture && u.value.dispose()); m.dispose(); });
    });
    this.renderer?.dispose();
    this._cbs = [];
  }
}

/* ── utilidades ── */
function rng(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const cssVar = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const isDarkTheme = () => document.documentElement.dataset.theme !== 'light';
function colorOf(str, fallback) {
  const c = new THREE.Color();
  try { if (str) { c.setStyle(str); return c; } } catch { /* */ }
  return c.set(fallback);
}
const approach = (cur, target, k) => cur + (target - cur) * k;

/* joints (orden JOINTS de motion-lab/app/js/pose/skeleton-map.js) */
const JN = ['nose', 'l_eye', 'r_eye', 'l_ear', 'r_ear', 'l_shoulder', 'r_shoulder', 'l_elbow', 'r_elbow', 'l_wrist', 'r_wrist', 'l_hip', 'r_hip', 'l_knee', 'r_knee', 'l_ankle', 'r_ankle', 'l_heel', 'r_heel', 'l_toe', 'r_toe'];
const JI = Object.fromEntries(JN.map((n, i) => [n, i]));
const BONES = [
  ['l_shoulder', 'r_shoulder', 'C', 22, 0.03], ['l_shoulder', 'l_elbow', 'L', 30, 0.038], ['l_elbow', 'l_wrist', 'L', 28, 0.032],
  ['r_shoulder', 'r_elbow', 'R', 30, 0.038], ['r_elbow', 'r_wrist', 'R', 28, 0.032],
  ['l_shoulder', 'l_hip', 'L', 26, 0.04], ['r_shoulder', 'r_hip', 'R', 26, 0.04], ['l_hip', 'r_hip', 'C', 18, 0.04],
  ['l_hip', 'l_knee', 'L', 34, 0.055], ['l_knee', 'l_ankle', 'L', 32, 0.042], ['r_hip', 'r_knee', 'R', 34, 0.055], ['r_knee', 'r_ankle', 'R', 32, 0.042],
  ['l_ankle', 'l_heel', 'L', 6, 0.02], ['l_heel', 'l_toe', 'L', 8, 0.02], ['l_ankle', 'l_toe', 'L', 8, 0.02],
  ['r_ankle', 'r_heel', 'R', 6, 0.02], ['r_heel', 'r_toe', 'R', 8, 0.02], ['r_ankle', 'r_toe', 'R', 8, 0.02],
];
const SKEL = { L: '#2f7bff', R: '#ff3b30', C: '#22d36b', H: '#ffd60a' };
const DRIVES = ['G', 'Z', 'H', 'F'];

/* parámetros por modo de capítulo */
function modeParams(mode, aspect, mobile) {
  const halfH = 8 * Math.tan((60 * Math.PI) / 360);
  const halfW = halfH * aspect;
  switch (mode) {
    case 'hero': return { on: 1, field: 1, body: mobile ? 0.55 : 1, S: mobile ? 1.7 : 2.25, bx: mobile ? 0 : halfW * 0.44, by: mobile ? -0.9 : -0.35, speed: 0.85, aura: 1 };
    case 'bolsa': return { on: 1, field: 0.55, body: 1, S: mobile ? 2.0 : 2.75, bx: mobile ? 0 : halfW * 0.34, by: -0.25, speed: 1.1, aura: 1.25 };
    case 'calm': return { on: 1, field: 0.8, body: 0, S: 2, bx: halfW * 0.4, by: -0.4, speed: 0.4, aura: 0 };
    case 'app': return { on: 1, field: 0.5, body: 0, S: 2, bx: halfW * 0.4, by: -0.4, speed: 0.35, aura: 0 };
    default: return { on: 0, field: 0, body: 0, S: 2, bx: halfW * 0.4, by: -0.4, speed: 0.5, aura: 0 };
  }
}

export async function initField(ctx) {
  const canvas = document.getElementById('fp-gl');
  if (!canvas || !window.WebGLRenderingContext) return null;
  const env = ctx?.env || {};
  // modo calmo (Ajustes → fp-pref {key:'calm'} · localStorage fp.calm): igual que reduced-motion, frame estático
  let calm = false;
  try { calm = JSON.parse(localStorage.getItem('fp.calm') || 'false') === true; } catch { /* */ }
  const reduced = () => calm || (env.prefersReducedMotion ? env.prefersReducedMotion() : false);
  const coarse = env.isCoarsePointer ? env.isCoarsePointer() : false;
  const mobile = () => window.innerWidth < 768;

  // estado de la app ANTES de cualquier await (fp-app puede llegar mientras carga el boxer)
  let appOpen = location.hash.startsWith('#/');
  let forced = null;
  let autoMode = null;

  let mgr;
  try { mgr = new SceneManager(canvas).init(); } catch (e) { console.warn('[fp/field] sin WebGL', e); return null; }
  const { scene, camera } = mgr;

  /* ═════════ 1. CAMPO MAGNÉTICO (South Hustles) ═════════ */
  const N = mobile() ? 1800 : 6000;
  const R = rng(6000);
  const pPos = new Float32Array(N * 3), pVel = new Float32Array(N * 3), pOri = new Float32Array(N * 3);
  const pCol = new Float32Array(N * 3), pAlpha = new Float32Array(N), pSize = new Float32Array(N), pTone = new Uint8Array(N);
  for (let i = 0; i < N; i++) {
    const theta = R() * Math.PI * 2, phi = Math.acos(2 * R() - 1), r = 2 + R() * 7;
    const x = r * Math.sin(phi) * Math.cos(theta), y = r * Math.sin(phi) * Math.sin(theta) * 0.5, z = r * Math.cos(phi) * 0.4 - 3;
    pPos[i * 3] = pOri[i * 3] = x; pPos[i * 3 + 1] = pOri[i * 3 + 1] = y; pPos[i * 3 + 2] = pOri[i * 3 + 2] = z;
    pAlpha[i] = 0.45 + R() * 0.55;
    pSize[i] = 0.7 + R() * 0.9;
    const t = R(); pTone[i] = t < 0.74 ? 0 : t < 0.87 ? 1 : 2; // acento · acento-2 · soft
  }
  const fieldGeo = new THREE.BufferGeometry();
  fieldGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  fieldGeo.setAttribute('aColor', new THREE.BufferAttribute(pCol, 3));
  fieldGeo.setAttribute('aAlpha', new THREE.BufferAttribute(pAlpha, 1));
  fieldGeo.setAttribute('aSize', new THREE.BufferAttribute(pSize, 1));
  const fieldMat = pointsMaterial({ size: 2.6, opacity: 0.6, soft: 0.2 });
  const fieldPts = new THREE.Points(fieldGeo, fieldMat);
  fieldPts.frustumCulled = false;
  scene.add(fieldPts);

  /* ═════════ 2. CUERPO DE PARTÍCULAS (boxer.json de Motion Lab) ═════════ */
  const RB = rng(2126);
  const parts = []; // {k:0 hueso|1 torso|2 cabeza|3 cuello, a, b, t, u, v, ox, oy, oz, side}
  for (const [a, b, side, count, rad] of BONES) {
    for (let i = 0; i < count; i++) {
      const th = RB() * Math.PI * 2, ph = Math.acos(2 * RB() - 1), rr = rad * (0.35 + RB() * 0.65);
      parts.push({ k: 0, a: JI[a], b: JI[b], t: RB(), ox: rr * Math.sin(ph) * Math.cos(th), oy: rr * Math.sin(ph) * Math.sin(th), oz: rr * Math.cos(ph), side });
    }
  }
  for (let i = 0; i < 300; i++) parts.push({ k: 1, u: RB(), v: RB(), ox: 0, oy: 0, oz: (RB() - 0.5) * 0.12, side: 'C' });
  for (let i = 0; i < 170; i++) {
    const th = RB() * Math.PI * 2, ph = Math.acos(2 * RB() - 1), rr = 0.105 * (0.75 + RB() * 0.25);
    parts.push({ k: 2, ox: rr * Math.sin(ph) * Math.cos(th), oy: rr * Math.sin(ph) * Math.sin(th) * 1.15, oz: rr * Math.cos(ph), side: 'H' });
  }
  for (let i = 0; i < 14; i++) parts.push({ k: 3, t: RB(), ox: (RB() - 0.5) * 0.04, oy: 0, oz: (RB() - 0.5) * 0.04, side: 'C' });
  const NB = parts.length;
  const bPos = new Float32Array(NB * 3), bCol = new Float32Array(NB * 3), bAlpha = new Float32Array(NB), bSize = new Float32Array(NB);
  const bOff = new Float32Array(NB * 3), bOVel = new Float32Array(NB * 3);
  for (let i = 0; i < NB; i++) { bAlpha[i] = 0.55 + RB() * 0.45; bSize[i] = 0.8 + RB() * 1.1; }
  const bodyGeo = new THREE.BufferGeometry();
  bodyGeo.setAttribute('position', new THREE.BufferAttribute(bPos, 3));
  bodyGeo.setAttribute('aColor', new THREE.BufferAttribute(bCol, 3));
  bodyGeo.setAttribute('aAlpha', new THREE.BufferAttribute(bAlpha, 1));
  bodyGeo.setAttribute('aSize', new THREE.BufferAttribute(bSize, 1));
  const bodyMat = pointsMaterial({ size: 3.2, opacity: 0, soft: 0.35 });
  const bodyPts = new THREE.Points(bodyGeo, bodyMat);
  bodyPts.frustumCulled = false;
  scene.add(bodyPts);

  /* estela de las manos (muñecas): buffer circular */
  const TRAIL = 30;
  const tPos = new Float32Array(TRAIL * 2 * 3), tCol = new Float32Array(TRAIL * 2 * 3), tAlpha = new Float32Array(TRAIL * 2), tSize = new Float32Array(TRAIL * 2);
  const trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3));
  trailGeo.setAttribute('aColor', new THREE.BufferAttribute(tCol, 3));
  trailGeo.setAttribute('aAlpha', new THREE.BufferAttribute(tAlpha, 1));
  trailGeo.setAttribute('aSize', new THREE.BufferAttribute(tSize, 1));
  const trailMat = pointsMaterial({ size: 5, opacity: 0, soft: 1 });
  const trailPts = new THREE.Points(trailGeo, trailMat);
  trailPts.frustumCulled = false;
  scene.add(trailPts);
  const trailHist = [[], []];

  /* aura: puntos grandes y muy suaves (pecho, cabeza, manos, cadera, halo) */
  const NA = 6;
  const aPos = new Float32Array(NA * 3), aCol = new Float32Array(NA * 3), aAlpha = new Float32Array(NA), aSize = new Float32Array(NA);
  const AURA_BASE = [{ s: 70, a: 0.16 }, { s: 46, a: 0.14 }, { s: 34, a: 0.2 }, { s: 34, a: 0.2 }, { s: 54, a: 0.12 }, { s: 150, a: 0.07 }];
  AURA_BASE.forEach((b, i) => { aSize[i] = b.s; aAlpha[i] = b.a; });
  const auraGeo = new THREE.BufferGeometry();
  auraGeo.setAttribute('position', new THREE.BufferAttribute(aPos, 3));
  auraGeo.setAttribute('aColor', new THREE.BufferAttribute(aCol, 3));
  auraGeo.setAttribute('aAlpha', new THREE.BufferAttribute(aAlpha, 1));
  auraGeo.setAttribute('aSize', new THREE.BufferAttribute(aSize, 1));
  const auraMat = pointsMaterial({ size: 4, opacity: 0, soft: 1 });
  const auraPts = new THREE.Points(auraGeo, auraMat);
  auraPts.frustumCulled = false;
  scene.add(auraPts);
  auraPts.renderOrder = 0; fieldPts.renderOrder = 1; trailPts.renderOrder = 2; bodyPts.renderOrder = 3;

  const mats = [fieldMat, bodyMat, trailMat, auraMat];
  mats.forEach((m) => { m.uniforms.uPR.value = mgr.pr; });

  /* ═════════ color / tema ═════════ */
  let dark = isDarkTheme();
  function recolor() {
    dark = isDarkTheme();
    const acc = colorOf(cssVar('--fp-accent'), dark ? '#e06040' : '#c24e2f');
    const acc2 = colorOf(cssVar('--fp-accent-2'), '#ff5a7a');
    const soft = colorOf(cssVar('--fp-accent-soft'), '#f0a58f');
    const ink = new THREE.Color(dark ? '#f4f4f4' : '#0d0d0f');
    const tones = [acc.clone(), acc2.clone(), soft.clone()];
    if (dark) tones.forEach((c) => c.lerp(new THREE.Color('#ffffff'), 0.12));
    else tones.forEach((c) => c.multiplyScalar(0.88));
    for (let i = 0; i < N; i++) { const c = tones[pTone[i]]; pCol[i * 3] = c.r; pCol[i * 3 + 1] = c.g; pCol[i * 3 + 2] = c.b; }
    fieldGeo.attributes.aColor.needsUpdate = true;
    const sideCol = {};
    for (const k of ['L', 'R', 'C', 'H']) {
      const c = acc.clone().lerp(new THREE.Color(SKEL[k]), k === 'H' ? 0.35 : 0.45);
      if (!dark) c.lerp(ink, 0.18);
      sideCol[k] = c;
    }
    for (let i = 0; i < NB; i++) { const c = sideCol[parts[i].side]; bCol[i * 3] = c.r; bCol[i * 3 + 1] = c.g; bCol[i * 3 + 2] = c.b; }
    bodyGeo.attributes.aColor.needsUpdate = true;
    const wl = acc.clone().lerp(new THREE.Color(SKEL.L), 0.5), wr = acc.clone().lerp(new THREE.Color(SKEL.R), 0.5);
    for (let s = 0; s < 2; s++) for (let i = 0; i < TRAIL; i++) { const c = s ? wr : wl; const j = (s * TRAIL + i) * 3; tCol[j] = c.r; tCol[j + 1] = c.g; tCol[j + 2] = c.b; }
    trailGeo.attributes.aColor.needsUpdate = true;
    const auraC = [acc, acc2, colorOf(SKEL.L), colorOf(SKEL.R), soft, acc];
    auraC.forEach((c, i) => { aCol[i * 3] = c.r; aCol[i * 3 + 1] = c.g; aCol[i * 3 + 2] = c.b; });
    auraGeo.attributes.aColor.needsUpdate = true;
    const blend = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    mats.forEach((m) => { m.blending = blend; m.needsUpdate = true; });
    fieldMat.uniforms.uSize.value = dark ? 2.2 : 2.7;
    if (!mgr.running) requestAnimationFrame(() => mgr.renderOnce());
  }
  recolor();
  document.addEventListener('fp-theme-changed', recolor);
  document.addEventListener('fp-accent-changed', recolor);

  /* ═════════ puntero → punto en el plano z=0 ═════════ */
  const mouse = new THREE.Vector2(0, 0);
  const mouseTarget = new THREE.Vector3(9, 9, 0);
  const mouseWorld = new THREE.Vector3(9, 9, 0);
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  let pointerIn = false;
  if (!coarse) {
    window.addEventListener('pointermove', (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, mouseTarget);
      pointerIn = true;
    }, { passive: true });
    document.addEventListener('pointerleave', () => { pointerIn = false; });
  }

  /* ═════════ modo de manejo (G/Z/H/F) ═════════ */
  let drive = 'Z';
  try { const d = JSON.parse(localStorage.getItem('fp.drive') || '"Z"'); if (DRIVES.includes(d)) drive = d; } catch { /* */ }
  function setDrive(m) {
    const next = String(m || 'Z').toUpperCase();
    if (!DRIVES.includes(next)) return drive;
    drive = next;
    try { localStorage.setItem('fp.drive', JSON.stringify(drive)); } catch { /* */ }
    document.dispatchEvent(new CustomEvent('fp-drive-changed', { detail: { mode: drive } }));
    document.dispatchEvent(new CustomEvent('fp-drive', { detail: { mode: drive } }));
    if (!mgr.running) wake(true);
    return drive;
  }

  /* ═════════ estado animado (lerp hacia los parámetros del modo) ═════════ */
  const P = { field: 0, body: 0, S: 2.2, bx: 3, by: -0.35, speed: 0.8, aura: 0 };
  let target = modeParams(null, camera.aspect, mobile());
  let frames = null, fps = 30, frameF = 0, hip0 = [0, 0, 0];
  const joints = Array.from({ length: 21 }, () => [0, 0, 0]);
  let ry = 0;

  function sampleJoints() {
    if (!frames) return;
    const n = frames.length;
    const f0 = Math.floor(frameF) % n, f1 = (f0 + 1) % n, k = frameF - Math.floor(frameF);
    const A = frames[f0], B = frames[f1];
    for (let j = 0; j < 21; j++) {
      const a = A[j], b = B[j];
      // y hacia abajo en Motion Lab → invertimos; z hacia la cámara
      joints[j][0] = ((a[0] + (b[0] - a[0]) * k) - hip0[0]);
      joints[j][1] = -((a[1] + (b[1] - a[1]) * k) - hip0[1]);
      joints[j][2] = -((a[2] + (b[2] - a[2]) * k) - hip0[2]);
    }
  }

  // transforma un punto local del cuerpo (metros) a mundo: escala S, giro ry, traslado (bx, by)
  const cr = { c: 1, s: 0 };
  const toWorld = (x, y, z, out, o) => {
    const X = x * P.S, Y = y * P.S, Z = z * P.S;
    out[o] = X * cr.c + Z * cr.s + P.bx;
    out[o + 1] = Y + P.by;
    out[o + 2] = -X * cr.s + Z * cr.c;
  };
  const tmp = new Float32Array(3);

  function updateBody(dt, t) {
    if (!frames) return;
    frameF += dt * fps * P.speed;
    sampleJoints();
    ry = Math.sin(t * 0.3) * 0.35 + (pointerIn ? mouse.x * 0.25 : 0);
    cr.c = Math.cos(ry); cr.s = Math.sin(ry);
    const ls = joints[JI.l_shoulder], rs = joints[JI.r_shoulder], lh = joints[JI.l_hip], rh = joints[JI.r_hip];
    const headC = [(joints[JI.l_ear][0] + joints[JI.r_ear][0]) / 2, (joints[JI.l_ear][1] + joints[JI.r_ear][1]) / 2 + 0.02, (joints[JI.l_ear][2] + joints[JI.r_ear][2]) / 2];
    const neckB = [(ls[0] + rs[0]) / 2, (ls[1] + rs[1]) / 2, (ls[2] + rs[2]) / 2];
    const mx = mouseWorld.x, my = mouseWorld.y;
    const interact = pointerIn || coarse;
    for (let i = 0; i < NB; i++) {
      const p = parts[i];
      let x, y, z;
      if (p.k === 0) { const a = joints[p.a], b = joints[p.b]; x = a[0] + (b[0] - a[0]) * p.t; y = a[1] + (b[1] - a[1]) * p.t; z = a[2] + (b[2] - a[2]) * p.t; }
      else if (p.k === 1) { // torso: bilineal hombros–caderas
        const tx0 = ls[0] + (rs[0] - ls[0]) * p.u, ty0 = ls[1] + (rs[1] - ls[1]) * p.u, tz0 = ls[2] + (rs[2] - ls[2]) * p.u;
        const tx1 = lh[0] + (rh[0] - lh[0]) * p.u, ty1 = lh[1] + (rh[1] - lh[1]) * p.u, tz1 = lh[2] + (rh[2] - lh[2]) * p.u;
        x = tx0 + (tx1 - tx0) * p.v; y = ty0 + (ty1 - ty0) * p.v; z = tz0 + (tz1 - tz0) * p.v;
      } else if (p.k === 2) { x = headC[0]; y = headC[1]; z = headC[2]; }
      else { const n = joints[JI.nose]; x = neckB[0] + (n[0] - neckB[0]) * p.t * 0.7; y = neckB[1] + (n[1] - neckB[1]) * p.t * 0.7; z = neckB[2] + (n[2] - neckB[2]) * p.t * 0.7; }
      toWorld(x + p.ox, y + p.oy, z + p.oz, tmp, 0);
      // física del offset (resorte + puntero según el modo de manejo)
      const j = i * 3;
      let fx = -bOff[j] * 0.06, fy = -bOff[j + 1] * 0.06, fz = -bOff[j + 2] * 0.06;
      if (interact) {
        const dx = tmp[0] + bOff[j] - mx, dy = tmp[1] + bOff[j + 1] - my, d = Math.sqrt(dx * dx + dy * dy) || 1e-4;
        if (drive === 'Z' && d < 1.3) { const f = ((1.3 - d) / 1.3) * 0.07; fx += (dx / d) * f; fy += (dy / d) * f; }
        else if (drive === 'H' && d < 2.4) { const f = ((2.4 - d) / 2.4) * 0.035; fx -= (dx / d) * f; fy -= (dy / d) * f; }
      }
      if (drive === 'G') fy -= 0.008;
      if (drive === 'F') { fx += Math.sin(t * 1.3 + i * 0.7) * 0.004; fy += Math.cos(t * 1.1 + i * 0.37) * 0.004; fz += Math.sin(t * 0.9 + i) * 0.003; }
      bOVel[j] = (bOVel[j] + fx) * 0.86; bOVel[j + 1] = (bOVel[j + 1] + fy) * 0.86; bOVel[j + 2] = (bOVel[j + 2] + fz) * 0.86;
      bOff[j] += bOVel[j]; bOff[j + 1] += bOVel[j + 1]; bOff[j + 2] += bOVel[j + 2];
      bPos[j] = tmp[0] + bOff[j]; bPos[j + 1] = tmp[1] + bOff[j + 1]; bPos[j + 2] = tmp[2] + bOff[j + 2];
    }
    bodyGeo.attributes.position.needsUpdate = true;

    // estela de las manos
    for (let s = 0; s < 2; s++) {
      const w = joints[s ? JI.r_wrist : JI.l_wrist];
      toWorld(w[0], w[1], w[2], tmp, 0);
      const h = trailHist[s];
      h.unshift([tmp[0], tmp[1], tmp[2]]);
      if (h.length > TRAIL) h.length = TRAIL;
      for (let i = 0; i < TRAIL; i++) {
        const q = h[Math.min(i, h.length - 1)] || [tmp[0], tmp[1], tmp[2]];
        const k = (s * TRAIL + i);
        tPos[k * 3] = q[0]; tPos[k * 3 + 1] = q[1]; tPos[k * 3 + 2] = q[2];
        const life = 1 - i / TRAIL;
        tAlpha[k] = life * life * 0.9;
        tSize[k] = 0.4 + life * 1.3;
      }
    }
    trailGeo.attributes.position.needsUpdate = true;
    trailGeo.attributes.aAlpha.needsUpdate = true;
    trailGeo.attributes.aSize.needsUpdate = true;

    // aura: pecho, cabeza, manos, cadera, halo
    const chest = [(ls[0] + rs[0] + lh[0] + rh[0]) / 4, (ls[1] + rs[1]) / 2 * 0.65 + (lh[1] + rh[1]) / 2 * 0.35, (ls[2] + rs[2]) / 2];
    const hips = [(lh[0] + rh[0]) / 2, (lh[1] + rh[1]) / 2, (lh[2] + rh[2]) / 2];
    const lw = joints[JI.l_wrist], rw = joints[JI.r_wrist];
    const pts = [chest, headC, lw, rw, hips, [chest[0], chest[1] - 0.15, chest[2]]];
    pts.forEach((q, i) => {
      toWorld(q[0], q[1], q[2], aPos, i * 3);
      const pulse = 1 + Math.sin(t * (1.2 + i * 0.3) + i) * 0.12;
      aSize[i] = AURA_BASE[i].s * pulse * (P.S / 2.2);
      aAlpha[i] = AURA_BASE[i].a * P.aura;
    });
    auraGeo.attributes.position.needsUpdate = true;
    auraGeo.attributes.aSize.needsUpdate = true;
    auraGeo.attributes.aAlpha.needsUpdate = true;
  }

  function updateField(dt, t) {
    if (coarse) mouseTarget.set(Math.sin(t * 0.3) * 3.2, Math.cos(t * 0.22) * 1.4, 0);
    mouseWorld.x += (mouseTarget.x - mouseWorld.x) * 0.05;
    mouseWorld.y += (mouseTarget.y - mouseWorld.y) * 0.05;
    const mx = mouseWorld.x, my = mouseWorld.y;
    const active = pointerIn || coarse;
    if (drive === 'Z') {
      const repelR = 1.8, repelF = 0.035;
      for (let i = 0; i < N; i++) {
        const ix = i * 3, iy = ix + 1, iz = ix + 2;
        if (active) {
          const dx = pPos[ix] - mx, dy = pPos[iy] - my, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < repelR && dist > 0) { const f = ((repelR - dist) / repelR) * repelF; pVel[ix] += (dx / dist) * f; pVel[iy] += (dy / dist) * f; }
        }
        pVel[ix] += (pOri[ix] - pPos[ix]) * 0.01; pVel[iy] += (pOri[iy] - pPos[iy]) * 0.01; pVel[iz] += (pOri[iz] - pPos[iz]) * 0.01;
        pVel[ix] *= 0.93; pVel[iy] *= 0.93; pVel[iz] *= 0.93;
        pPos[ix] += pVel[ix]; pPos[iy] += pVel[iy]; pPos[iz] += pVel[iz];
        pPos[iy] += Math.sin(t + i * 0.01) * 0.0002;
      }
    } else if (drive === 'H') {
      const R2 = 3.4, F = 0.022;
      for (let i = 0; i < N; i++) {
        const ix = i * 3, iy = ix + 1, iz = ix + 2;
        if (active) {
          const dx = mx - pPos[ix], dy = my - pPos[iy], dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < R2 && dist > 0.15) { const f = ((R2 - dist) / R2) * F; pVel[ix] += (dx / dist) * f; pVel[iy] += (dy / dist) * f; pVel[ix] += (-dy / dist) * f * 0.35; pVel[iy] += (dx / dist) * f * 0.35; }
        }
        pVel[ix] += (pOri[ix] - pPos[ix]) * 0.004; pVel[iy] += (pOri[iy] - pPos[iy]) * 0.004; pVel[iz] += (pOri[iz] - pPos[iz]) * 0.006;
        pVel[ix] *= 0.94; pVel[iy] *= 0.94; pVel[iz] *= 0.94;
        pPos[ix] += pVel[ix]; pPos[iy] += pVel[iy]; pPos[iz] += pVel[iz];
      }
    } else if (drive === 'G') {
      const floor = -3.4;
      for (let i = 0; i < N; i++) {
        const ix = i * 3, iy = ix + 1, iz = ix + 2;
        pVel[iy] -= 0.0045;
        if (active) {
          const dx = pPos[ix] - mx, dy = pPos[iy] - my, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 1.6 && dist > 0) { const f = ((1.6 - dist) / 1.6) * 0.09; pVel[ix] += (dx / dist) * f; pVel[iy] += Math.abs(dy / dist) * f + 0.02 * f; }
        }
        pVel[ix] += (pOri[ix] - pPos[ix]) * 0.0015; pVel[iz] += (pOri[iz] - pPos[iz]) * 0.004;
        pVel[ix] *= 0.985; pVel[iy] *= 0.995; pVel[iz] *= 0.97;
        pPos[ix] += pVel[ix]; pPos[iy] += pVel[iy]; pPos[iz] += pVel[iz];
        if (pPos[iy] < floor) { pPos[iy] = floor; pVel[iy] *= -0.55; pVel[ix] *= 0.9; }
      }
    } else { // F: flotar sin gravedad, deriva lenta
      for (let i = 0; i < N; i++) {
        const ix = i * 3, iy = ix + 1, iz = ix + 2;
        pVel[ix] += Math.sin(t * 0.3 + i * 0.37) * 0.0004;
        pVel[iy] += Math.cos(t * 0.27 + i * 0.53) * 0.0004;
        pVel[iz] += Math.sin(t * 0.2 + i) * 0.0002;
        if (active) {
          const dx = pPos[ix] - mx, dy = pPos[iy] - my, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 1.4 && dist > 0) { const f = ((1.4 - dist) / 1.4) * 0.012; pVel[ix] += (dx / dist) * f; pVel[iy] += (dy / dist) * f; }
        }
        if (Math.abs(pPos[ix]) > 11) pVel[ix] -= Math.sign(pPos[ix]) * 0.002;
        if (Math.abs(pPos[iy]) > 5.5) pVel[iy] -= Math.sign(pPos[iy]) * 0.002;
        if (Math.abs(pPos[iz] + 3) > 4) pVel[iz] -= Math.sign(pPos[iz] + 3) * 0.002;
        pVel[ix] *= 0.99; pVel[iy] *= 0.99; pVel[iz] *= 0.99;
        pPos[ix] += pVel[ix]; pPos[iy] += pVel[iy]; pPos[iz] += pVel[iz];
      }
    }
    fieldGeo.attributes.position.needsUpdate = true;
  }

  let lastT = 0;
  mgr.onAnimate((dt, t) => {
    lastT = t;
    const k = reduced() ? 1 : Math.min(1, dt * 3.2);
    P.field = approach(P.field, target.field, k);
    P.body = approach(P.body, frames ? target.body : 0, k);
    P.S = approach(P.S, target.S, k);
    P.bx = approach(P.bx, target.bx, k);
    P.by = approach(P.by, target.by, k);
    P.speed = approach(P.speed, target.speed, k);
    P.aura = approach(P.aura, target.aura, k);
    const sp = currentMode === 'app' || currentMode === 'calm' ? 0.6 : 1;
    updateField(dt * sp, t);
    if (P.body > 0.01) updateBody(dt, t);
    fieldMat.uniforms.uOpacity.value = (dark ? 0.5 : 0.6) * P.field;
    bodyMat.uniforms.uOpacity.value = (dark ? 0.95 : 0.85) * P.body;
    trailMat.uniforms.uOpacity.value = (dark ? 0.9 : 0.6) * P.body;
    auraMat.uniforms.uOpacity.value = (dark ? 1 : 0.7) * P.body;
    bodyPts.visible = trailPts.visible = auraPts.visible = P.body > 0.01;
    // deriva suave de cámara (South Hustles)
    camera.position.x = Math.sin(t * 0.1) * 0.4;
    camera.position.y = Math.cos(t * 0.08) * 0.25;
    camera.lookAt(0, 0, -1);
  });

  /* ═════════ visibilidad por capítulo + app ═════════ */
  let stopTimer = null;
  let currentMode = null;
  function wake(once = false) {
    if (reduced() || once) {
      // un frame estático, sin loop
      requestAnimationFrame(() => mgr.step(1 / 60));
      return;
    }
    mgr.start();
  }
  function apply(mode) {
    if (mode === currentMode) return;
    currentMode = mode;
    target = modeParams(mode, camera.aspect, mobile());
    clearTimeout(stopTimer);
    document.dispatchEvent(new CustomEvent('fp-gl-mode', { detail: { mode } }));
    if (target.on) {
      canvas.classList.add('is-on');
      canvas.dataset.mode = mode;
      if (reduced()) {
        mgr.stop();
        Object.assign(P, { field: target.field, body: frames ? target.body : 0, S: target.S, bx: target.bx, by: target.by, speed: target.speed, aura: target.aura });
        frameF = 18;
        wake(true);
      } else wake();
    } else {
      canvas.classList.remove('is-on');
      delete canvas.dataset.mode;
      stopTimer = setTimeout(() => { if (!target.on) mgr.stop(); }, 760);
    }
  }
  function resolveMode() {
    if (forced) return apply(forced);
    if (appOpen) return apply('app');
    apply(autoMode);
  }

  const ratios = new Map();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) ratios.set(e.target, e.intersectionRatio); else ratios.delete(e.target); });
    let best = null, br = 0;
    ratios.forEach((r, el) => { if (r > br) { br = r; best = el; } });
    autoMode = best ? best.dataset.fpGl : null;
    resolveMode();
  }, { threshold: [0, 0.05, 0.15, 0.3, 0.5, 0.75, 1] });
  const observeAll = () => document.querySelectorAll('[data-fp-gl]').forEach((el) => io.observe(el));
  observeAll();
  // capítulos que se monten más tarde
  const scrollRoot = document.getElementById('fp-scroll');
  if (scrollRoot) new MutationObserver(observeAll).observe(scrollRoot, { childList: true });

  document.addEventListener('fp-app', (e) => { appOpen = !!e.detail?.open; resolveMode(); });
  document.addEventListener('fp-pref', (e) => {
    if (e.detail?.key !== 'calm') return;
    calm = e.detail.value === true;
    if (calm) mgr.stop();
    currentMode = undefined; // fuerza re-aplicar el modo (estático o con loop)
    resolveMode();
  });
  window.addEventListener('hashchange', () => {
    // por si el shell no despacha fp-app: el hash #/vista también cuenta
    const open = location.hash.startsWith('#/');
    if (open !== appOpen) { appOpen = open; resolveMode(); }
  });
  window.addEventListener('resize', () => { target = modeParams(currentMode, camera.aspect, mobile()); if (!mgr.running) mgr.renderOnce(); }, { passive: true });

  /* ═════════ cuerpo: boxer.json real de Motion Lab ═════════ */
  try {
    const raw = await ctx.data.boxer();
    if (raw && Array.isArray(raw.frames) && raw.frames.length && raw.frames[0].length >= 21) {
      frames = raw.frames;
      fps = raw.fps || 30;
      const f0 = frames[0];
      const lh = f0[JI.l_hip], rh = f0[JI.r_hip];
      hip0 = [(lh[0] + rh[0]) / 2, (lh[1] + rh[1]) / 2, (lh[2] + rh[2]) / 2];
      sampleJoints();
      // arranca con los offsets en cero y la estela llena en la mano
      if (currentMode && reduced()) { P.body = target.body; frameF = 18; wake(true); }
    }
  } catch (e) { console.warn('[fp/field] sin boxer.json: solo campo', e); }

  resolveMode();

  const api = {
    setMode(name) { forced = name || null; resolveMode(); return currentMode; },
    setDrive,
    getDrive: () => drive,
    getMode: () => currentMode,
    dispose() { io.disconnect(); mgr.dispose(); },
  };
  return api;
}
