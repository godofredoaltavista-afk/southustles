/* ═══════════════════════════════════════════
   SH3 LOADER — shader intro. A violet blob with
   vertex-noise displacement + fresnel glow rotates
   and bobs inside #loader while the count runs.
   Self-disposes the moment intro.js removes #loader.
   ═══════════════════════════════════════════ */

import * as THREE from 'three';
import { prefersReducedMotion } from './env.js';

const VERT = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vDisp;

  // cheap layered noise from sines — enough for a 2.3s cameo
  float wob(vec3 p, float t) {
    return sin(p.x * 3.1 + t * 1.6) * 0.5
         + sin(p.y * 4.3 + t * 1.1) * 0.35
         + sin(p.z * 2.7 + t * 2.0) * 0.4
         + sin((p.x + p.y + p.z) * 5.0 - t * 2.6) * 0.18;
  }

  void main() {
    float d = wob(normalize(position), uTime) * 0.16;
    vDisp = d;
    vec3 p = position + normal * d;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vDisp;

  void main() {
    // fresnel rim — hotter at grazing angles
    float fr = pow(1.0 - abs(dot(vNormal, vView)), 2.2);
    // violet core → pink rim → cyan sparks on the biggest bumps
    vec3 core = vec3(0.20, 0.13, 0.55);
    vec3 rim  = vec3(1.00, 0.35, 0.62);
    vec3 spark = vec3(0.34, 0.90, 1.00);
    vec3 col = mix(core, rim, fr);
    col = mix(col, spark, smoothstep(0.12, 0.2, vDisp) * 0.6);
    // slow breathing brightness
    col *= 0.85 + 0.15 * sin(uTime * 2.2);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export function initShaderLoader() {
  const loader = document.getElementById('loader');
  if (!loader || prefersReducedMotion()) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'loader-shader';
  canvas.setAttribute('aria-hidden', 'true');
  loader.prepend(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
  camera.position.z = 4.2;

  const uniforms = { uTime: { value: 0 } };
  const blob = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.15, 48),
    new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG })
  );
  scene.add(blob);

  // orbiting spark points around the blob
  const N = 220;
  const pts = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const t = Math.random() * Math.PI * 2, u = Math.acos(2 * Math.random() - 1);
    const r = 1.7 + Math.random() * 1.1;
    pts[i * 3] = r * Math.sin(u) * Math.cos(t);
    pts[i * 3 + 1] = r * Math.sin(u) * Math.sin(t);
    pts[i * 3 + 2] = r * Math.cos(u);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
  const halo = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0xa99bff, size: 0.028, transparent: true, opacity: 0.75,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  scene.add(halo);

  const resize = () => {
    const w = loader.clientWidth || window.innerWidth;
    const h = loader.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);

  const t0 = performance.now();
  const tick = (now) => {
    // #loader gone → dispose everything and stop
    if (!document.getElementById('loader')) {
      renderer.dispose();
      blob.geometry.dispose(); blob.material.dispose();
      pGeo.dispose(); halo.material.dispose();
      window.removeEventListener('resize', resize);
      return;
    }
    const t = (now - t0) / 1000;
    uniforms.uTime.value = t;
    blob.rotation.y = t * 0.9;
    blob.rotation.x = Math.sin(t * 0.6) * 0.35;
    blob.position.y = Math.sin(t * 1.4) * 0.22;   // sube y baja
    halo.rotation.y = -t * 0.25;
    halo.rotation.z = t * 0.12;
    camera.position.x = Math.sin(t * 0.5) * 0.25;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
