/**
 * GravitySection.js
 * Antigravity floating frames gallery — ported from workshop-daydream-latam.html.
 * Cyan wireframe planes distributed in 3D space, driven by mouse parallax.
 * No post-processing (plain Three.js), theme-reactive particles.
 */
import * as THREE from 'three';
import { ThreeSceneManager } from '../core/ThreeSceneManager.js';
import themeManager from '../core/ThemeManager.js';

const FRAME_COUNT = 14;

export class GravitySection {
  constructor(scrollController) {
    this.scrollController = scrollController;
    this._scene      = null;
    this._canvas     = null;
    this._frames     = [];
    this._particles  = null;
    this._partMat    = null;
    this._raycaster  = new THREE.Raycaster();
    this._mouseVec   = new THREE.Vector2();
    this._mouseSmX   = 0;
    this._mouseSmY   = 0;
    this._onMouse    = null;
  }

  init() {
    this._canvas = document.getElementById('gravityCanvas');
    if (!this._canvas) return;

    this._scene = new ThreeSceneManager(this._canvas, {
      alpha:     true,
      antialias: true,
      fov:       60,
    });
    this._scene.init();
    this._scene.camera.position.z = 15;

    this._buildFrames();
    this._buildParticles();
    this._bindMouse();

    this._scene.onAnimate((delta, elapsed) => this._animate(elapsed));
    this._scene.start();

    themeManager.onChange(({ isDark }) => this._updateColors(isDark));
  }

  _buildFrames() {
    const isDark = themeManager.isDark;
    const frameColor = isDark ? 0x00FFE0 : 0x00b89c;

    for (let i = 0; i < FRAME_COUNT; i++) {
      // Plane geometry for the frame
      const geo = new THREE.PlaneGeometry(4, 2.25);

      // Filled semi-transparent plane (glass effect)
      const fillMat = new THREE.MeshBasicMaterial({
        color:       isDark ? 0x001a14 : 0xe8f8f5,
        transparent: true,
        opacity:     isDark ? 0.18 : 0.12,
        side:        THREE.DoubleSide,
      });
      const plane = new THREE.Mesh(geo, fillMat);

      // Glowing cyan border
      const edgesGeo = new THREE.EdgesGeometry(geo);
      const edgeMat  = new THREE.LineBasicMaterial({
        color:       frameColor,
        transparent: true,
        opacity:     0.7,
      });
      const frame = new THREE.LineSegments(edgesGeo, edgeMat);
      plane.add(frame);

      // Fibonacci-sphere distribution for even spread
      const phi   = Math.acos(-1 + (2 * i) / FRAME_COUNT);
      const theta = Math.sqrt(FRAME_COUNT * Math.PI) * phi;
      const r     = 9 + Math.random() * 4;

      plane.position.set(
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi) * 0.65,
        r * Math.cos(phi) - 6,
      );
      plane.lookAt(0, 0, 0);

      plane.userData = {
        originalPos: plane.position.clone(),
        floatOffset: Math.random() * Math.PI * 2,
        rotSpeed:    (Math.random() - 0.5) * 0.001,
        fillMat,
        edgeMat,
      };

      this._frames.push(plane);
      this._scene.scene.add(plane);
    }
  }

  _buildParticles() {
    const isDark = themeManager.isDark;
    const count  = 200;
    const pos    = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    this._partMat = new THREE.PointsMaterial({
      color:     isDark ? 0x00FFE0 : 0x007755,
      size:      isDark ? 0.05 : 0.08,
      transparent: true,
      opacity:   isDark ? 0.5 : 0.70,
      blending:  isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
    });

    this._particles = new THREE.Points(geo, this._partMat);
    this._scene.scene.add(this._particles);
  }

  _bindMouse() {
    this._onMouse = (e) => {
      this._mouseVec.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      this._mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', this._onMouse, { passive: true });
  }

  _animate(elapsed) {
    // Smooth mouse
    this._mouseSmX += (this._mouseVec.x - this._mouseSmX) * 0.05;
    this._mouseSmY += (this._mouseVec.y - this._mouseSmY) * 0.05;

    // Animate frames
    this._frames.forEach((mesh) => {
      const d = mesh.userData;
      mesh.position.x = d.originalPos.x + Math.sin(elapsed * 0.5 + d.floatOffset) * 0.5 + this._mouseSmX * 2;
      mesh.position.y = d.originalPos.y + Math.cos(elapsed * 0.3 + d.floatOffset) * 0.3 + this._mouseSmY * 1.5;
      mesh.position.z = d.originalPos.z + Math.sin(elapsed * 0.4 + d.floatOffset) * 0.2;
      mesh.rotation.z  = Math.sin(elapsed * 0.2 + d.floatOffset) * 0.05;
    });

    // Rotate particles slowly
    if (this._particles) {
      this._particles.rotation.y += 0.0005;
      this._particles.rotation.x += 0.0002;
    }

    // Camera orbit + strong mouse parallax
    if (this._scene.camera) {
      this._scene.camera.position.x = Math.sin(elapsed * 0.1) * 2 + this._mouseSmX * 3;
      this._scene.camera.position.y = Math.cos(elapsed * 0.1) * 1 + this._mouseSmY * 2;
      this._scene.camera.lookAt(0, 0, 0);
    }

    // Hover detection — scale up hovered frame
    this._raycaster.setFromCamera(this._mouseVec, this._scene.camera);
    const hits = this._raycaster.intersectObjects(this._frames);

    this._frames.forEach(mesh => {
      mesh.userData.fillMat.opacity = themeManager.isDark ? 0.18 : 0.12;
      mesh.scale.setScalar(1);
    });
    if (hits.length > 0) {
      const h = hits[0].object;
      if (h.userData.fillMat) h.userData.fillMat.opacity = themeManager.isDark ? 0.35 : 0.25;
      h.scale.setScalar(1.08);
    }
  }

  _updateColors(isDark) {
    const col = isDark ? 0x00FFE0 : 0x00b89c;
    this._frames.forEach(mesh => {
      mesh.userData.edgeMat.color.setHex(col);
      mesh.userData.fillMat.color.setHex(isDark ? 0x001a14 : 0xe8f8f5);
    });
    if (this._partMat) {
      this._partMat.color.setHex(isDark ? 0x00FFE0 : 0x007755);
      this._partMat.size    = isDark ? 0.05 : 0.08;
      this._partMat.opacity = isDark ? 0.5 : 0.70;
      this._partMat.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
      this._partMat.needsUpdate = true;
    }
  }

  dispose() {
    if (this._onMouse) window.removeEventListener('mousemove', this._onMouse);
    if (this._scene)   this._scene.dispose();
    this._frames = [];
  }
}
