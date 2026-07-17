/**
 * ThreeSceneManager.js
 * Reusable Three.js scene wrapper.
 * Handles: Scene, Camera, Renderer, ResizeObserver, RAF loop, GLTF loading.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class ThreeSceneManager {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} opts
   * @param {boolean} [opts.alpha=true]
   * @param {boolean} [opts.antialias=true]
   * @param {boolean} [opts.shadows=false]
   * @param {number}  [opts.fov=50]
   * @param {boolean} [opts.orbitControls=false]
   * @param {boolean} [opts.autoRotate=false]
   */
  constructor(canvas, opts = {}) {
    this.canvas   = canvas;
    this.opts     = {
      alpha:         opts.alpha         !== undefined ? opts.alpha : true,
      antialias:     opts.antialias     !== undefined ? opts.antialias : true,
      shadows:       opts.shadows       || false,
      fov:           opts.fov           || 50,
      orbitControls: opts.orbitControls || false,
      autoRotate:    opts.autoRotate    || false,
    };

    this.scene    = null;
    this.camera   = null;
    this.renderer = null;
    this.controls = null;
    this._loader  = new GLTFLoader();
    this._models  = new Map();   // id → THREE.Group
    this._rafId   = null;
    this._clock   = new THREE.Clock();
    this._animCbs = [];          // external animate callbacks
    this._resizeObserver = null;
  }

  init() {
    const w = this.canvas.clientWidth  || this.canvas.offsetWidth  || 800;
    const h = this.canvas.clientHeight || this.canvas.offsetHeight || 600;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(this.opts.fov, w / h, 0.1, 1000);
    this.camera.position.set(0, 2, 8);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas:    this.canvas,
      alpha:     this.opts.alpha,
      antialias: this.opts.antialias,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h);

    if (this.opts.shadows) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
    }

    // Orbit controls
    if (this.opts.orbitControls) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping  = true;
      this.controls.dampingFactor  = 0.05;
      this.controls.autoRotate     = this.opts.autoRotate;
      this.controls.autoRotateSpeed = 0.4;
      this.controls.enablePan      = false;
    }

    // Resize
    this._resizeObserver = new ResizeObserver(() => this._onResize());
    this._resizeObserver.observe(this.canvas.parentElement || document.body);

    return this;
  }

  // ─── Lighting helpers ───────────────────────────────────────────

  addAmbient(color = 0x1a1a2e, intensity = 0.4) {
    this.scene.add(new THREE.AmbientLight(color, intensity));
    return this;
  }

  addDirectional(color = 0xffffff, intensity = 1, position = [5, 8, 5], shadows = false) {
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(...position);
    if (shadows) {
      light.castShadow = true;
      light.shadow.mapSize.set(2048, 2048);
      light.shadow.camera.near = 0.5;
      light.shadow.camera.far  = 200;
    }
    this.scene.add(light);
    return light;
  }

  addPoint(color = 0x00ffe0, intensity = 1, position = [0, 2, 0], distance = 20) {
    const light = new THREE.PointLight(color, intensity, distance);
    light.position.set(...position);
    this.scene.add(light);
    return light;
  }

  // ─── GLTF Loading ───────────────────────────────────────────────

  /**
   * Load a GLTF/GLB model and store it by id.
   * @param {string} path  URL or public path
   * @param {string} id    Key to retrieve later
   * @param {function} [onProgress]
   * @returns {Promise<THREE.Group>}
   */
  loadModel(path, id, onProgress) {
    return new Promise((resolve, reject) => {
      this._loader.load(
        path,
        (gltf) => {
          const model = gltf.scene;
          model.traverse(child => {
            if (child.isMesh) {
              child.castShadow    = this.opts.shadows;
              child.receiveShadow = this.opts.shadows;
            }
          });
          this._models.set(id, model);
          resolve(model);
        },
        onProgress,
        reject
      );
    });
  }

  /**
   * Add a previously loaded model to the scene.
   * @param {string} id
   * @param {[number,number,number]} position
   * @param {number|[number,number,number]} scale
   */
  addModel(id, position = [0, 0, 0], scale = 1) {
    const model = this._models.get(id);
    if (!model) { console.warn(`ThreeSceneManager: model "${id}" not loaded`); return; }
    model.position.set(...position);
    if (Array.isArray(scale)) model.scale.set(...scale);
    else                       model.scale.setScalar(scale);
    this.scene.add(model);
    return model;
  }

  getModel(id) {
    return this._models.get(id);
  }

  // ─── Animation loop ──────────────────────────────────────────────

  /**
   * Register a callback to run every frame.
   * @param {(delta: number, elapsed: number) => void} fn
   */
  onAnimate(fn) {
    this._animCbs.push(fn);
  }

  start() {
    this._clock.start();
    this._loop();
    return this;
  }

  stop() {
    if (this._rafId) cancelAnimationFrame(this._rafId);
    this._rafId = null;
  }

  _loop() {
    this._rafId = requestAnimationFrame(() => this._loop());
    const delta   = this._clock.getDelta();
    const elapsed = this._clock.getElapsedTime();

    if (this.controls) this.controls.update();

    this._animCbs.forEach(fn => fn(delta, elapsed));
    this.renderer.render(this.scene, this.camera);
  }

  // ─── Resize ─────────────────────────────────────────────────────

  _onResize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    // Skip degenerate sizes (canvas off-screen or collapsed section)
    if (w < 1 || h < 1) return;
    if (this.camera.aspect === w / h && this.renderer.domElement.width === w) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  // ─── Cleanup ─────────────────────────────────────────────────────

  dispose() {
    this.stop();
    if (this._resizeObserver) this._resizeObserver.disconnect();

    this.scene.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach(m => {
          Object.values(m).forEach(v => { if (v && v.isTexture) v.dispose(); });
          m.dispose();
        });
      }
    });

    this.renderer.dispose();
    this._models.clear();
    this._animCbs = [];
  }
}
