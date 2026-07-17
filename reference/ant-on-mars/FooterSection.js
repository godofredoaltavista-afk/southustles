/**
 * FooterSection.js
 * 14 floating HSL-colored balls (wireframe mix) + mini orbital canvas for agentic card.
 */
import * as THREE from 'three';
import { ThreeSceneManager } from '../core/ThreeSceneManager.js';

export class FooterSection {
  constructor() {
    this._scene       = null;
    this._balls       = [];
    this._orbScene    = null;
    this._orbRings    = [];
    this._orbSphere   = null;
    this._mouseX      = 0;
    this._mouseY      = 0;
  }

  init() {
    const canvas = document.getElementById('footerCanvas');
    if (canvas) {
      this._scene = new ThreeSceneManager(canvas, {
        alpha:      true,
        antialias:  true,
        fov:        50,
        clearColor: 0x000000,
        clearAlpha: 0,
      });
      this._scene.init();
      this._scene.camera.position.z = 8;
      this._buildBalls();
      this._scene.onAnimate((delta, elapsed) => this._animate(elapsed));
      this._scene.start();
    }

    this._buildAgenticOrbital();

    window.addEventListener('mousemove', (e) => {
      this._mouseX =  (e.clientX / window.innerWidth)  * 2 - 1;
      this._mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });
  }

  _buildAgenticOrbital() {
    const canvas = document.getElementById('agenticOrbitalCanvas');
    if (!canvas) return;

    const SIZE = 180;
    canvas.width  = SIZE;
    canvas.height = SIZE;
    canvas.style.width  = SIZE + 'px';
    canvas.style.height = SIZE + 'px';

    this._orbScene = new ThreeSceneManager(canvas, {
      alpha:     true,
      antialias: true,
      fov:       55,
    });
    this._orbScene.init();
    this._orbScene.renderer.setSize(SIZE, SIZE, false);
    if (this._orbScene._resizeObserver) {
      this._orbScene._resizeObserver.disconnect();
      this._orbScene._resizeObserver = null;
    }
    this._orbScene.camera.position.z = 4;

    const sphereGeo = new THREE.SphereGeometry(0.55, 14, 12);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x00FFE0, wireframe: true, transparent: true, opacity: 0.45,
    });
    this._orbSphere = new THREE.Mesh(sphereGeo, sphereMat);
    this._orbScene.scene.add(this._orbSphere);

    const ringDefs = [
      { r: 1.4,  tube: 0.022, color: 0x00FFE0, tiltX: 0.3,  tiltZ: 0,    speed: 1.1  },
      { r: 1.75, tube: 0.018, color: 0xB8FF4A, tiltX: 1.2,  tiltZ: 0.5,  speed: -0.7 },
      { r: 1.15, tube: 0.016, color: 0xFF6B35, tiltX: -0.8, tiltZ: 1.0,  speed: 1.5  },
      { r: 2.0,  tube: 0.012, color: 0x00AAFF, tiltX: 0.1,  tiltZ: -0.7, speed: -0.45 },
    ];
    ringDefs.forEach(def => {
      const geo  = new THREE.TorusGeometry(def.r, def.tube, 10, 64);
      const mat  = new THREE.MeshBasicMaterial({ color: def.color, transparent: true, opacity: 0.72 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = def.tiltX;
      mesh.rotation.z = def.tiltZ;
      mesh.userData.speed = def.speed;
      this._orbRings.push(mesh);
      this._orbScene.scene.add(mesh);
    });

    this._orbScene.onAnimate((delta, elapsed) => {
      this._orbRings.forEach(r => { r.rotation.y += delta * r.userData.speed; });
      this._orbSphere.rotation.y = elapsed * 0.55;
      this._orbSphere.rotation.x = elapsed * 0.28;
      const cam = this._orbScene.camera;
      cam.position.x += (this._mouseX * 1.2 - cam.position.x) * 0.05;
      cam.position.y += (this._mouseY * 0.9 - cam.position.y) * 0.05;
      cam.lookAt(0, 0, 0);
    });
    this._orbScene.start();
  }

  _buildBalls() {
    const BALLS = 14;
    // Mode colors: gravity cyan, magnetic blue, hook red — no green
    const palette = [
      new THREE.Color(0x00FFE0), // gravity cyan
      new THREE.Color(0x00AAFF), // magnetic blue
      new THREE.Color(0xFF4444), // hook red
    ];
    for (let i = 0; i < BALLS; i++) {
      const r   = 0.18 + Math.random() * 0.35;
      const geo = new THREE.SphereGeometry(r, 16, 12);
      const col = palette[Math.floor(Math.random() * palette.length)];
      const mat = new THREE.MeshBasicMaterial({
        color:     col,
        wireframe: Math.random() < 0.5,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2,
      );
      const speed = 0.3 + Math.random() * 0.6;
      const phase = Math.random() * Math.PI * 2;
      const vy    = (Math.random() - 0.5) * 0.02;
      mesh.userData = { speed, phase, vy };
      this._balls.push(mesh);
      this._scene.scene.add(mesh);
    }
  }

  _animate(elapsed) {
    this._balls.forEach(b => {
      b.position.x += Math.sin(elapsed * b.userData.speed + b.userData.phase) * 0.005;
      b.position.y += b.userData.vy;
      if (b.position.y >  3) b.userData.vy = -Math.abs(b.userData.vy);
      if (b.position.y < -3) b.userData.vy =  Math.abs(b.userData.vy);
      b.rotation.x += 0.005;
      b.rotation.y += 0.008;
    });
  }

  dispose() {
    if (this._scene)    this._scene.dispose();
    if (this._orbScene) this._orbScene.dispose();
    this._balls    = [];
    this._orbRings = [];
  }
}
