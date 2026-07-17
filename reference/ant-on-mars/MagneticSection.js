/**
 * MagneticSection.js
 * Full HeroSection particle tech (6000pts, mouse repulsion, return-to-origin)
 * in lime color. Two large bracket [ ] line geometries replace the cyan oval.
 */
import * as THREE from 'three';
import { ThreeSceneManager } from '../core/ThreeSceneManager.js';
import themeManager from '../core/ThemeManager.js';

const N_DESKTOP = 6000;
const N_MOBILE  = 1800;

export class MagneticSection {
  constructor(scrollController) {
    this.scrollController = scrollController;
    this._scene      = null;
    this._canvas     = null;
    this._partGeo    = null;
    this._partMat    = null;
    this._pPos       = null;
    this._pVel       = null;
    this._pOri       = null;
    this._bracketMat = null;
    this._mouse      = new THREE.Vector2();
    this._mouseWorld = new THREE.Vector3();
    this._raycaster  = new THREE.Raycaster();
    this._plane      = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  }

  init() {
    this._canvas = document.getElementById('magneticCanvas');
    if (!this._canvas) return;

    const isMobile = window.innerWidth < 768;
    const N = isMobile ? N_MOBILE : N_DESKTOP;

    this._scene = new ThreeSceneManager(this._canvas, {
      alpha: true, antialias: false, fov: 60,
    });
    this._scene.init();
    this._scene.camera.position.set(0, 0, 8);

    this._buildParticles(N);
    this._buildBrackets();
    this._bindMouse();

    this._scene.onAnimate((delta, elapsed) => this._animate(elapsed));
    this._scene.start();

    themeManager.onChange(({ isDark }) => this._updateColors(isDark));
  }

  _buildParticles(N) {
    this._pPos = new Float32Array(N * 3);
    this._pVel = new Float32Array(N * 3);
    this._pOri = new Float32Array(N * 3);

    // Distribute particles in a wide horizontal cloud — same sphere as Hero
    for (let i = 0; i < N; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 2 + Math.random() * 7;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.5;
      const z = r * Math.cos(phi) * 0.4 - 3;
      this._pPos[i*3]   = this._pOri[i*3]   = x;
      this._pPos[i*3+1] = this._pOri[i*3+1] = y;
      this._pPos[i*3+2] = this._pOri[i*3+2] = z;
    }

    this._partGeo = new THREE.BufferGeometry();
    this._partGeo.setAttribute('position', new THREE.BufferAttribute(this._pPos, 3));

    const isDark = themeManager.isDark;
    this._partMat = new THREE.PointsMaterial({
      color:           isDark ? 0xB8FF4A : 0x3a7a00,
      size:            isDark ? 0.022 : 0.035,
      transparent:     true,
      opacity:         isDark ? 0.42 : 0.65,
      sizeAttenuation: true,
      blending:        isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite:      false,
    });

    this._scene.scene.add(new THREE.Points(this._partGeo, this._partMat));
  }

  _buildBrackets() {
    const isDark = themeManager.isDark;
    const color  = isDark ? 0xB8FF4A : 0x6ab300;

    this._bracketMat = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity:     isDark ? 0.65 : 0.5,
    });

    // [ bracket — left side (3.5 units tall)
    const lGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3( 0.5,  1.75, 0),
      new THREE.Vector3(-0.5,  1.75, 0),
      new THREE.Vector3(-0.5,  0,    0),
      new THREE.Vector3(-0.5, -1.75, 0),
      new THREE.Vector3( 0.5, -1.75, 0),
    ]);

    // ] bracket — right side (mirrored)
    const rGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.5,  1.75, 0),
      new THREE.Vector3( 0.5,  1.75, 0),
      new THREE.Vector3( 0.5,  0,    0),
      new THREE.Vector3( 0.5, -1.75, 0),
      new THREE.Vector3(-0.5, -1.75, 0),
    ]);

    const lLine = new THREE.Line(lGeo, this._bracketMat);
    const rLine = new THREE.Line(rGeo, this._bracketMat);

    // Spread brackets apart to frame the particle cloud
    lLine.position.x = -2.8;
    rLine.position.x =  2.8;

    this._scene.scene.add(lLine);
    this._scene.scene.add(rLine);

    this._lLine = lLine;
    this._rLine = rLine;
  }

  _animate(elapsed) {
    const pos = this._pPos;
    const vel = this._pVel;
    const ori = this._pOri;
    const N   = pos.length / 3;
    const mx  = this._mouseWorld.x;
    const my  = this._mouseWorld.y;
    const repelR = 1.8;
    const repelF = 0.035;

    for (let i = 0; i < N; i++) {
      const ix = i*3, iy = i*3+1, iz = i*3+2;
      const dx   = pos[ix] - mx;
      const dy   = pos[iy] - my;
      const dist = Math.sqrt(dx*dx + dy*dy);

      if (dist < repelR && dist > 0) {
        const f = (repelR - dist) / repelR * repelF;
        vel[ix] += (dx / dist) * f;
        vel[iy] += (dy / dist) * f;
      }
      // Return to origin
      vel[ix] += (ori[ix] - pos[ix]) * 0.01;
      vel[iy] += (ori[iy] - pos[iy]) * 0.01;
      vel[iz] += (ori[iz] - pos[iz]) * 0.01;
      // Damping
      vel[ix] *= 0.93; vel[iy] *= 0.93; vel[iz] *= 0.93;
      pos[ix] += vel[ix];
      pos[iy] += vel[iy];
      pos[iz] += vel[iz];
      // Subtle wave
      pos[iy] += Math.sin(elapsed + i * 0.01) * 0.0002;
    }
    this._partGeo.attributes.position.needsUpdate = true;

    // Camera gentle drift
    if (this._scene.camera) {
      this._scene.camera.position.x = Math.sin(elapsed * 0.1) * 0.4;
      this._scene.camera.position.y = Math.cos(elapsed * 0.08) * 0.25;
      this._scene.camera.lookAt(0, 0, -3);
    }

    // Brackets subtle breathe
    if (this._lLine && this._rLine) {
      const breathe = 1 + Math.sin(elapsed * 0.4) * 0.04;
      this._lLine.scale.y = breathe;
      this._rLine.scale.y = breathe;
      this._lLine.position.x = -2.8 - Math.sin(elapsed * 0.3) * 0.08;
      this._rLine.position.x =  2.8 + Math.sin(elapsed * 0.3) * 0.08;
    }
  }

  _bindMouse() {
    window.addEventListener('mousemove', (e) => {
      this._mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      this._mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      if (this._scene?.camera) {
        this._raycaster.setFromCamera(this._mouse, this._scene.camera);
        this._raycaster.ray.intersectPlane(this._plane, this._mouseWorld);
      }
    }, { passive: true });
  }

  _updateColors(isDark) {
    const color = isDark ? 0xB8FF4A : 0x3a7a00;
    if (this._partMat) {
      this._partMat.color.setHex(color);
      this._partMat.size    = isDark ? 0.022 : 0.035;
      this._partMat.opacity = isDark ? 0.42 : 0.65;
      this._partMat.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
      this._partMat.needsUpdate = true;
    }
    if (this._bracketMat) {
      this._bracketMat.color.setHex(color);
      this._bracketMat.opacity = isDark ? 0.65 : 0.5;
    }
  }

  dispose() {
    if (this._scene) this._scene.dispose();
  }
}
