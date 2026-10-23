// FP · MOTION LAB — adaptador + métricas + reproductor de esqueleto (03 §13.3).
// Acepta los DOS formatos reales de Motion Lab y devuelve siempre el mismo objeto normalizado:
//   (a) session.json  → { id, aspect, meta:{exercise, kpis, ...}, frames:[{t, k:[21×(x,y,z,v)], w:[21×(x,y,z)]}] }
//   (b) boxer.json    → { fps, joints:21, frames:[ [[x,y,z]×21] ×N ] }  (metros, sin t)
// El orden de los 21 puntos es JOINTS de motion-lab/app/js/pose/skeleton-map.js (copiado en data/joints.json).
// Nunca manda nada a un servidor. Colores FreeMoCap: izq azul, der rojo, core verde, cabeza amarilla.
console.log('[fp/motionlab] init');

export const JOINTS = ['nose', 'l_eye', 'r_eye', 'l_ear', 'r_ear', 'l_shoulder', 'r_shoulder', 'l_elbow', 'r_elbow', 'l_wrist', 'r_wrist', 'l_hip', 'r_hip', 'l_knee', 'r_knee', 'l_ankle', 'r_ankle', 'l_heel', 'r_heel', 'l_toe', 'r_toe'];
export const J = Object.fromEntries(JOINTS.map((n, i) => [n, i]));
export const BONES = [
  ['l_ear', 'l_eye', 'L'], ['l_eye', 'nose', 'L'], ['nose', 'r_eye', 'R'], ['r_eye', 'r_ear', 'R'],
  ['l_shoulder', 'r_shoulder', 'C'],
  ['l_shoulder', 'l_elbow', 'L'], ['l_elbow', 'l_wrist', 'L'],
  ['r_shoulder', 'r_elbow', 'R'], ['r_elbow', 'r_wrist', 'R'],
  ['l_shoulder', 'l_hip', 'L'], ['r_shoulder', 'r_hip', 'R'], ['l_hip', 'r_hip', 'C'],
  ['l_hip', 'l_knee', 'L'], ['l_knee', 'l_ankle', 'L'],
  ['r_hip', 'r_knee', 'R'], ['r_knee', 'r_ankle', 'R'],
  ['l_ankle', 'l_heel', 'L'], ['l_heel', 'l_toe', 'L'], ['l_ankle', 'l_toe', 'L'],
  ['r_ankle', 'r_heel', 'R'], ['r_heel', 'r_toe', 'R'], ['r_ankle', 'r_toe', 'R'],
];
export const SKEL = { L: '#2f7bff', R: '#ff3b30', C: '#22d36b', H: '#ffd60a' };
const NAMES = {
  free: 'Libre (auto-detectar)', biceps_curl: 'Bíceps (curl)', pushup_triceps: 'Flexión de tríceps (codos pegados)', pushup_diamond: 'Flexión diamante',
  pushup_standard: 'Flexión clásica / abierta', dips_bench: 'Fondos de banco', pullup_close: 'Dominada cerrada (bíceps)', pullup_wide: 'Dominada abierta',
  dead_hang: 'Colgarse de la barra', jump_rope: 'Saltar la soga', boxing_shadow: 'Sombra de boxeo', crane_balance: 'Equilibrio a una pierna',
};

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

/**
 * @returns {{ok:true, session:object, warnings:string[]} | {ok:false, error:string}}
 */
export function normalize(raw, filename = 'motionlab.json') {
  if (!raw || typeof raw !== 'object') return { ok: false, error: 'El archivo no es un JSON con objeto.' };
  if (!Array.isArray(raw.frames)) return { ok: false, error: 'Este JSON no parece de Motion Lab: falta `frames`.' };
  if (!raw.frames.length) return { ok: false, error: 'El JSON tiene `frames` vacío.' };
  const warnings = [];

  // (a) sesión exportada
  if (raw.meta) {
    const m = raw.meta;
    const frames = [];
    for (const f of raw.frames) {
      let pts = null;
      if (Array.isArray(f.k) && isNum(f.k[0])) { // plano 21×4
        pts = []; for (let i = 0; i < 21; i++) pts.push([f.k[i * 4], f.k[i * 4 + 1], f.k[i * 4 + 2] ?? 0, f.k[i * 4 + 3] ?? 1]);
      } else if (Array.isArray(f.k) && Array.isArray(f.k[0])) {
        pts = f.k.map((p) => [p[0], p[1], p[2] ?? 0, p[3] ?? 1]);
      } else if (Array.isArray(f.pts)) {
        pts = f.pts.map((p) => [p[0], p[1], p[2] ?? 0, p[3] ?? 1]);
      }
      let world = null;
      if (Array.isArray(f.w) && isNum(f.w[0])) { world = []; for (let i = 0; i < 21; i++) world.push([f.w[i * 3], f.w[i * 3 + 1], f.w[i * 3 + 2]]); }
      if (!pts && !world) continue;
      frames.push({ tMs: isNum(f.t) ? f.t : frames.length * 33.3, pts: pts || world.map((p) => [...p, 1]), world });
    }
    if (!frames.length) return { ok: false, error: 'No encontré puntos en los frames (`k` o `w`).' };
    if (frames[0].pts.length !== 21) warnings.push(`Los frames traen ${frames[0].pts.length} puntos (esperaba 21).`);
    const durationMs = m.durationMs || (frames[frames.length - 1].tMs - frames[0].tMs);
    const fps = frames.length > 1 ? Math.round((frames.length - 1) / (durationMs / 1000)) : 30;
    const kpi = kpiMain(m.kpis || {});
    return {
      ok: true, warnings,
      session: {
        v: 1, id: raw.id || m.id || `ml-${Date.now().toString(36)}`, source: 'session', filename,
        exerciseId: m.exercise || 'free', exerciseName: m.exerciseName || NAMES[m.exercise] || m.exercise || 'Libre',
        engine: m.engine || null, createdAt: m.createdAt || new Date().toISOString(), durationMs, fps,
        aspect: raw.aspect || 16 / 9, coords: frames[0].world && !frames[0].pts ? 'world' : 'image',
        kpi, kpisRaw: m.kpis || {}, world: !!frames[0].world, frames,
      },
    };
  }

  // (b) clip simple (boxer.json)
  if (isNum(raw.fps) || raw.joints) {
    const fps = raw.fps || 30;
    const frames = raw.frames.map((fr, i) => ({ tMs: (i * 1000) / fps, pts: fr.map((p) => [p[0], p[1], p[2] ?? 0, 1]), world: fr }));
    if (frames[0].pts.length !== 21) warnings.push(`Los frames traen ${frames[0].pts.length} puntos (esperaba 21).`);
    const isBox = /boxeo|box|sombra|jab/i.test(raw.note || filename);
    return {
      ok: true, warnings,
      session: {
        v: 1, id: `clip-${filename.replace(/\W+/g, '-')}-${frames.length}`, source: 'clip', filename,
        exerciseId: isBox ? 'boxing_shadow' : 'free', exerciseName: isBox ? 'Sombra de boxeo' : 'Clip', note: raw.note || '',
        engine: 'clip', createdAt: new Date().toISOString(), durationMs: Math.round(((frames.length - 1) * 1000) / fps), fps,
        aspect: 1, coords: 'world', kpi: null, kpisRaw: {}, world: true, frames,
      },
    };
  }
  return { ok: false, error: 'No reconozco el formato: no tiene `meta` (sesión) ni `fps` + `joints` (clip).' };
}

/** KPI principal con la misma prioridad que kpiMain de motion-lab/ui/home.js: golpes → reps → saltos → holdMs. */
export function kpiMain(k) {
  if (isNum(k.punches)) return { unit: 'golpes', value: k.punches };
  if (isNum(k.reps)) return { unit: 'reps', value: k.reps };
  if (isNum(k.jumps)) return { unit: 'saltos', value: k.jumps };
  if (isNum(k.holdMs)) return { unit: 's', value: Math.round(k.holdMs / 100) / 10 };
  return null;
}

/** Lee un File con aviso de tamaño (> ~20 MB) y lo normaliza. */
export async function readFile(file) {
  if (file.size > 20 * 1024 * 1024) return { ok: false, error: `El archivo pesa ${(file.size / 1048576).toFixed(1)} MB (> 20 MB). Exportá un tramo más corto.` };
  let raw;
  try { raw = JSON.parse(await file.text()); } catch { return { ok: false, error: 'No es un JSON válido.' }; }
  // ndjson de Motion Lab (frames.ndjson): meta + frames por línea
  return normalize(raw, file.name);
}

/* ── geometría ── */
const P = (f, name) => f.pts[J[name]];
function angle(a, b, c) { // ángulo en b (grados), 2D
  if (!a || !b || !c) return null;
  const v1x = a[0] - b[0], v1y = a[1] - b[1], v2x = c[0] - b[0], v2y = c[1] - b[1];
  const d = Math.hypot(v1x, v1y) * Math.hypot(v2x, v2y);
  if (!d) return null;
  return (Math.acos(Math.max(-1, Math.min(1, (v1x * v2x + v1y * v2y) / d))) * 180) / Math.PI;
}
export function anglesOf(f) {
  return {
    codo_izq: angle(P(f, 'l_shoulder'), P(f, 'l_elbow'), P(f, 'l_wrist')),
    codo_der: angle(P(f, 'r_shoulder'), P(f, 'r_elbow'), P(f, 'r_wrist')),
    rodilla_izq: angle(P(f, 'l_hip'), P(f, 'l_knee'), P(f, 'l_ankle')),
    rodilla_der: angle(P(f, 'r_hip'), P(f, 'r_knee'), P(f, 'r_ankle')),
    hombro_izq: angle(P(f, 'l_hip'), P(f, 'l_shoulder'), P(f, 'l_elbow')),
    hombro_der: angle(P(f, 'r_hip'), P(f, 'r_shoulder'), P(f, 'r_elbow')),
    cadera_izq: angle(P(f, 'l_shoulder'), P(f, 'l_hip'), P(f, 'l_knee')),
    cadera_der: angle(P(f, 'r_shoulder'), P(f, 'r_hip'), P(f, 'r_knee')),
  };
}
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, ((a[2] || 0) + (b[2] || 0)) / 2];
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
function smooth(arr, k = 3) { return arr.map((_, i) => { let s = 0, n = 0; for (let j = i - k; j <= i + k; j++) if (arr[j] != null) { s += arr[j]; n++; } return n ? s / n : arr[i]; }); }

/** Picos (máximos locales) con umbral y separación mínima en frames. */
function peaks(sig, thr, minGap) {
  const out = []; let last = -1e9;
  for (let i = 1; i < sig.length - 1; i++) if (sig[i] > thr && sig[i] >= sig[i - 1] && sig[i] >= sig[i + 1] && i - last >= minGap) { out.push(i); last = i; }
  return out;
}

/**
 * Métricas estimadas (02 §6.5): ROM, simetría L/R, golpes, reps y tempo excéntrica/pausa/concéntrica, equilibrio.
 * Son ESTIMACIONES a partir de los puntos; la UI las marca como tales.
 */
export function metrics(s) {
  const F = s.frames;
  const n = F.length;
  const fps = s.fps || 30;
  const ang = F.map(anglesOf);
  const series = (k) => ang.map((a) => a[k]).filter((v) => v != null);
  const rom = (k) => { const v = series(k); return v.length ? Math.round(Math.max(...v) - Math.min(...v)) : null; };
  const romL = { codo: rom('codo_izq'), rodilla: rom('rodilla_izq'), hombro: rom('hombro_izq') };
  const romR = { codo: rom('codo_der'), rodilla: rom('rodilla_der'), hombro: rom('hombro_der') };
  const symm = (a, b) => (a == null || b == null || Math.max(a, b) < 5 ? null : Math.round(100 - (Math.abs(a - b) / Math.max(a, b)) * 100));
  const symmetry = { codo: symm(romL.codo, romR.codo), rodilla: symm(romL.rodilla, romR.rodilla), hombro: symm(romL.hombro, romR.hombro) };
  const symVals = Object.values(symmetry).filter((v) => v != null);
  const symmetryPct = symVals.length ? Math.round(symVals.reduce((a, b) => a + b, 0) / symVals.length) : null;

  // golpes: extensión muñeca–hombro relativa al ancho de hombros
  const ext = (side) => F.map((f) => { const sh = P(f, `${side}_shoulder`), wr = P(f, `${side}_wrist`), w = dist(P(f, 'l_shoulder'), P(f, 'r_shoulder')) || 1; return dist(sh, wr) / w; });
  const exL = smooth(ext('l'), 1), exR = smooth(ext('r'), 1);
  const thr = (arr) => { const mx = Math.max(...arr), mn = Math.min(...arr); return mn + (mx - mn) * 0.72; };
  const punchesL = peaks(exL, thr(exL), Math.round(fps * 0.25)).length;
  const punchesR = peaks(exR, thr(exR), Math.round(fps * 0.25)).length;

  // reps + tempo: señal vertical (y crece hacia abajo). Bajar = excéntrica en dominada/flexión/sentadilla.
  const ex = s.exerciseId || 'free';
  const sigRaw = F.map((f) => {
    if (/pullup|dead_hang|pushup|dips/.test(ex)) return mid(P(f, 'l_shoulder'), P(f, 'r_shoulder'))[1];
    if (ex === 'biceps_curl') return -(dist(P(f, 'l_shoulder'), P(f, 'l_wrist')) + dist(P(f, 'r_shoulder'), P(f, 'r_wrist')));
    return mid(P(f, 'l_hip'), P(f, 'r_hip'))[1];
  });
  const sig = smooth(sigRaw, Math.max(2, Math.round(fps / 10)));
  const mn = Math.min(...sig), mx = Math.max(...sig), span = mx - mn;
  let reps = 0; const tempo = { eccS: null, pauseS: null, conS: null };
  if (span > 1e-4 && !/boxing|jump|crane|free/.test(ex)) {
    const hiT = mn + span * 0.7, loT = mn + span * 0.3;
    let state = sig[0] > hiT ? 'down' : 'up'; let tTop = 0, tBottomIn = null, tBottomOut = null;
    const ecc = [], con = [], pau = [];
    for (let i = 1; i < n; i++) {
      if (state === 'up' && sig[i] > hiT) { state = 'down'; ecc.push((i - tTop) / fps); tBottomIn = i; }
      else if (state === 'down' && sig[i] < hiT && tBottomIn != null && tBottomOut == null) { tBottomOut = i; pau.push((i - tBottomIn) / fps); }
      if (state === 'down' && sig[i] < loT) { state = 'up'; reps++; con.push((i - (tBottomOut ?? i)) / fps); tTop = i; tBottomIn = null; tBottomOut = null; }
    }
    const avg = (a) => (a.length ? Math.round((a.reduce((x, y) => x + y, 0) / a.length) * 10) / 10 : null);
    tempo.eccS = avg(ecc); tempo.pauseS = avg(pau); tempo.conS = avg(con);
  }

  // equilibrio: centro de cadera vs centro de tobillos → % peso izq/der (estimado)
  const bal = F.map((f) => {
    const h = mid(P(f, 'l_hip'), P(f, 'r_hip')); const la = P(f, 'l_ankle'), ra = P(f, 'r_ankle');
    const d = ra[0] - la[0]; if (Math.abs(d) < 1e-4) return 0.5;
    return Math.max(0, Math.min(1, (h[0] - la[0]) / d));
  });
  const balAvg = bal.reduce((a, b) => a + b, 0) / bal.length;
  const swayX = (() => { const xs = F.map((f) => mid(P(f, 'l_hip'), P(f, 'r_hip'))[0]); return Math.round((Math.max(...xs) - Math.min(...xs)) * 1000) / 1000; })();

  return {
    frames: n, fps, durationS: Math.round((s.durationMs || (n / fps) * 1000) / 100) / 10,
    romL, romR, symmetry, symmetryPct,
    punches: { l: punchesL, r: punchesR, total: punchesL + punchesR },
    reps, tempo,
    balance: { leftPct: Math.round((1 - balAvg) * 100), rightPct: Math.round(balAvg * 100), swayX },
    angles: ang,
    signal: sig,
  };
}

/** Comparación con la sesión anterior del mismo ejercicio («vs tu sesión anterior»). */
export function vsPrevious(sessions, s) {
  const prev = sessions.filter((x) => x.id !== s.id && x.exerciseId === s.exerciseId && String(x.createdAt) < String(s.createdAt)).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0];
  if (!prev) return null;
  const a = s.kpi?.value ?? null, b = prev.kpi?.value ?? null;
  const delta = a != null && b ? Math.round(((a - b) / b) * 100) : null;
  return { prev, a, b, unit: s.kpi?.unit || prev.kpi?.unit || '', delta };
}

/* ── reproductor 2D ───────────────────────────────────────────────── */

/**
 * Esqueleto 2D en canvas con colores FreeMoCap, ángulos en codos/rodillas (estilo Estudio de Moyon Lab),
 * estela opcional y centro de masa. Solo anima mientras está visible.
 * opts: { angles:true, trail:true, com:true, highlight:[bone names o grupos], loop:true, speed:1, onFrame(i, frame), ink:auto, glow:true }
 */
export class SkeletonPlayer {
  constructor(canvas, session, opts = {}) {
    this.cv = canvas; this.s = session; this.o = { angles: true, trail: true, com: true, loop: true, speed: 1, glow: true, highlight: null, ...opts };
    this.ctx = canvas.getContext('2d');
    this.i = 0; this.t = 0; this.playing = false; this.raf = null; this.visible = true; this.last = 0;
    this._fit();
    this._ro = new ResizeObserver(() => this.draw());
    this._ro.observe(canvas);
    this._io = new IntersectionObserver((e) => { this.visible = e[0].isIntersecting; if (this.visible && this.playing) this._loop(); }, { threshold: 0 });
    this._io.observe(canvas);
    this.draw();
  }
  _fit() {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const step = Math.max(1, Math.floor(this.s.frames.length / 60));
    for (let k = 0; k < this.s.frames.length; k += step) for (const p of this.s.frames[k].pts) { if (!isNum(p[0])) continue; x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
    const ax = this.s.coords === 'image' ? (this.s.aspect || 16 / 9) : 1;
    this.box = { x0: x0 * ax, y0, x1: x1 * ax, y1, ax };
  }
  setSession(s) { this.s = s; this.i = 0; this.t = 0; this._fit(); this.draw(); }
  play() { this.playing = true; this._loop(); }
  pause() { this.playing = false; if (this.raf) cancelAnimationFrame(this.raf); this.raf = null; }
  toggle() { this.playing ? this.pause() : this.play(); return this.playing; }
  seek(t01) { this.i = Math.max(0, Math.min(this.s.frames.length - 1, Math.round(t01 * (this.s.frames.length - 1)))); this.t = this.s.frames[this.i].tMs - this.s.frames[0].tMs; this.draw(); }
  destroy() { this.pause(); this._ro.disconnect(); this._io.disconnect(); }
  _loop() {
    if (this.raf || !this.visible) return;
    this.last = performance.now();
    const step = (now) => {
      this.raf = null;
      if (!this.playing || !this.visible) return;
      const dt = Math.min(100, now - this.last); this.last = now;
      this.t += dt * this.o.speed;
      const F = this.s.frames, t0 = F[0].tMs, dur = F[F.length - 1].tMs - t0 || 1;
      if (this.t > dur) { if (this.o.loop) this.t %= dur; else { this.t = dur; this.playing = false; } }
      while (this.i < F.length - 1 && F[this.i + 1].tMs - t0 <= this.t) this.i++;
      while (this.i > 0 && F[this.i].tMs - t0 > this.t) this.i--;
      this.draw();
      this.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  }
  draw() {
    const cv = this.cv, r = cv.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = Math.max(1, Math.round(r.width * dpr)), H = Math.max(1, Math.round(r.height * dpr));
    if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
    const c = this.ctx; c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H);
    const b = this.box, bw = (b.x1 - b.x0) || 1, bh = (b.y1 - b.y0) || 1;
    const sc = Math.min(W / (bw * 1.25), H / (bh * 1.2));
    const ox = (W - bw * sc) / 2 - b.x0 * sc, oy = (H - bh * sc) / 2 - b.y0 * sc;
    const X = (p) => p[0] * b.ax * sc + ox, Y = (p) => p[1] * sc + oy;
    const ink = this.o.ink ?? getComputedStyle(cv).color ?? '#fff';
    const f = this.s.frames[this.i];
    // piso
    const floorY = Math.max(...f.pts.slice(15).map((p) => Y(p))) + 4 * dpr;
    c.strokeStyle = ink; c.globalAlpha = 0.12; c.lineWidth = 1 * dpr;
    for (let k = -6; k <= 6; k++) { c.beginPath(); c.moveTo(W / 2 + k * 40 * dpr, floorY); c.lineTo(W / 2 + k * 90 * dpr, H); c.stroke(); }
    c.beginPath(); c.moveTo(0, floorY); c.lineTo(W, floorY); c.stroke(); c.globalAlpha = 1;
    // estela (fantasmas)
    if (this.o.trail) {
      for (let g = 6; g >= 1; g--) {
        const fi = this.s.frames[Math.max(0, this.i - g * 3)]; c.globalAlpha = 0.05 + (6 - g) * 0.015;
        this._bones(c, fi, X, Y, dpr, 1.2);
      }
      c.globalAlpha = 1;
    }
    if (this.o.glow) { c.shadowBlur = 14 * dpr; }
    this._bones(c, f, X, Y, dpr, 3.2);
    c.shadowBlur = 0;
    // articulaciones
    f.pts.forEach((p, k) => {
      const name = JOINTS[k]; const col = k < 5 ? SKEL.H : name.startsWith('l_') ? SKEL.L : SKEL.R;
      c.fillStyle = col; c.beginPath(); c.arc(X(p), Y(p), (k === 0 ? 4 : 3) * dpr, 0, Math.PI * 2); c.fill();
    });
    // centro de masa
    if (this.o.com) {
      const h = mid(P(f, 'l_hip'), P(f, 'r_hip')), sh = mid(P(f, 'l_shoulder'), P(f, 'r_shoulder'));
      const com = [h[0] * 0.65 + sh[0] * 0.35, h[1] * 0.65 + sh[1] * 0.35];
      c.fillStyle = SKEL.H; c.shadowColor = SKEL.H; c.shadowBlur = 16 * dpr;
      c.beginPath(); c.arc(X(com), Y(com), 7 * dpr, 0, Math.PI * 2); c.fill(); c.shadowBlur = 0;
      c.setLineDash([3 * dpr, 4 * dpr]); c.strokeStyle = SKEL.H; c.globalAlpha = 0.6; c.beginPath(); c.moveTo(X(com), Y(com)); c.lineTo(X(com), floorY); c.stroke(); c.setLineDash([]); c.globalAlpha = 1;
    }
    // ángulos (estilo Estudio)
    if (this.o.angles) {
      const a = anglesOf(f);
      const lab = (jn, v, col) => {
        if (v == null) return; const p = P(f, jn); const x = X(p), y = Y(p);
        c.strokeStyle = col; c.globalAlpha = 0.5; c.lineWidth = 1.5 * dpr; c.beginPath(); c.arc(x, y, 16 * dpr, 0, (v / 180) * Math.PI); c.stroke(); c.globalAlpha = 1;
        const txt = `${Math.round(v)}°`; c.font = `${600} ${12 * dpr}px "JetBrains Mono", monospace`;
        const tw = c.measureText(txt).width + 10 * dpr; const lx = x + (jn.startsWith('l_') ? -tw - 14 * dpr : 14 * dpr), ly = y - 22 * dpr;
        c.fillStyle = 'rgba(0,0,0,0.78)'; c.fillRect(lx, ly, tw, 18 * dpr); c.fillStyle = '#fff'; c.fillText(txt, lx + 5 * dpr, ly + 13 * dpr);
      };
      lab('l_elbow', a.codo_izq, SKEL.L); lab('r_elbow', a.codo_der, SKEL.R); lab('l_knee', a.rodilla_izq, SKEL.L); lab('r_knee', a.rodilla_der, SKEL.R);
    }
    this.o.onFrame?.(this.i, f);
  }
  _bones(c, f, X, Y, dpr, w) {
    const hl = this.o.highlight;
    for (const [a, b, side] of BONES) {
      const pa = f.pts[J[a]], pb = f.pts[J[b]];
      if (!pa || !pb) continue;
      const col = side === 'L' ? SKEL.L : side === 'R' ? SKEL.R : SKEL.C;
      const on = !hl || hl.some((h) => a.includes(h) || b.includes(h));
      c.strokeStyle = col; c.shadowColor = col; c.lineWidth = (on ? w : w * 0.5) * dpr; c.lineCap = 'round';
      const ga = c.globalAlpha; if (!on) c.globalAlpha = ga * 0.35;
      c.beginPath(); c.moveTo(X(pa), Y(pa)); c.lineTo(X(pb), Y(pb)); c.stroke(); c.globalAlpha = ga;
    }
  }
}
