// PORTED FROM motion-lab/app/js/pose/skeleton-map.js @ copia local 2026-10-23 — DO NOT EDIT. Adapted copy lives in js/**/fp-*.js
// Esquema canónico de esqueleto: COCO-17 + talón y punta de pie.
// "l_" / "r_" son SIEMPRE el lado izquierdo/derecho de la persona (no de la imagen).
// Frame: { t (ms), aspect (ancho/alto), pts: [[x,y,z,v] x N], world: [[x,y,z] x N] | null }
//   x,y normalizados 0..1 sobre la imagen SIN espejar; v = visibilidad/confianza 0..1.

export const JOINTS = [
  'nose', 'l_eye', 'r_eye', 'l_ear', 'r_ear',
  'l_shoulder', 'r_shoulder', 'l_elbow', 'r_elbow', 'l_wrist', 'r_wrist',
  'l_hip', 'r_hip', 'l_knee', 'r_knee', 'l_ankle', 'r_ankle',
  'l_heel', 'r_heel', 'l_toe', 'r_toe',
];
export const N = JOINTS.length;
export const J = Object.fromEntries(JOINTS.map((n, i) => [n, i]));

// [a, b, lado] -- lado: 'L' | 'R' | 'C' (para colorear)
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

// MediaPipe Pose Landmarker (33 puntos) -> canónico
export const MEDIAPIPE_MAP = {
  nose: 0, l_eye: 2, r_eye: 5, l_ear: 7, r_ear: 8,
  l_shoulder: 11, r_shoulder: 12, l_elbow: 13, r_elbow: 14, l_wrist: 15, r_wrist: 16,
  l_hip: 23, r_hip: 24, l_knee: 25, r_knee: 26, l_ankle: 27, r_ankle: 28,
  l_heel: 29, r_heel: 30, l_toe: 31, r_toe: 32,
};

// RTMPose Halpe-26 (rtmlib BodyWithFeet) -> canónico. Mantener sincronizado con engine/server.py
export const HALPE26_MAP = {
  nose: 0, l_eye: 1, r_eye: 2, l_ear: 3, r_ear: 4,
  l_shoulder: 5, r_shoulder: 6, l_elbow: 7, r_elbow: 8, l_wrist: 9, r_wrist: 10,
  l_hip: 11, r_hip: 12, l_knee: 13, r_knee: 14, l_ankle: 15, r_ankle: 16,
  l_toe: 20, r_toe: 21, l_heel: 24, r_heel: 25,
};

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Resultado de MediaPipe -> frame canónico. */
export function fromMediaPipe(result, t, aspect) {
  const lm = result?.landmarks?.[0];
  if (!lm) return null;
  const wl = result.worldLandmarks?.[0] ?? null;
  const pts = JOINTS.map((name) => {
    const p = lm[MEDIAPIPE_MAP[name]];
    return [p.x, p.y, p.z ?? 0, clamp01(p.visibility ?? 1)];
  });
  const world = wl ? JOINTS.map((name) => {
    const p = wl[MEDIAPIPE_MAP[name]];
    return [p.x, p.y, p.z];
  }) : null;
  return { t, aspect, pts, world };
}

/** Respuesta del sidecar (ya en orden canónico) -> frame. k: [[x,y,v] x N] */
export function fromSidecar(msg, t, aspect) {
  if (!msg?.k?.length) return null;
  return { t, aspect, pts: msg.k.map(([x, y, v]) => [x, y, 0, clamp01(v)]), world: null };
}

// --- (de)serialización compacta para sesiones ---------------------------------------
const round = (v, d = 4) => Math.round(v * 10 ** d) / 10 ** d;

export function packFrame(f) {
  const k = [];
  for (const p of f.pts) k.push(round(p[0]), round(p[1]), round(p[2]), round(p[3], 2));
  const out = { t: Math.round(f.t), k };
  if (f.world) {
    const w = [];
    for (const p of f.world) w.push(round(p[0], 3), round(p[1], 3), round(p[2], 3));
    out.w = w;
  }
  return out;
}

export function unpackFrame(o, aspect) {
  const pts = [];
  for (let i = 0; i < N; i++) pts.push([o.k[i * 4], o.k[i * 4 + 1], o.k[i * 4 + 2], o.k[i * 4 + 3]]);
  let world = null;
  if (o.w) {
    world = [];
    for (let i = 0; i < N; i++) world.push([o.w[i * 3], o.w[i * 3 + 1], o.w[i * 3 + 2]]);
  }
  return { t: o.t, aspect, pts, world };
}
