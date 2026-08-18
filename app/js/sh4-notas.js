/* ═══════════════════════════════════════════
   SH4 — NOTAS CREATIVAS.
   Excalidraw's engine (app/vendor/notas/notas.js) wearing
   South Hustles chrome. The engine stays stock — we dress
   it and drive it from outside.

   PANEL POLICY (pass 3, after Franco's review):
   · the stock properties panel STAYS, restyled — "no perder
     la version de excalidraw que teniamos antes"
   · our dock is DRAGGABLE and its option panels fly out
     anchored to wherever the dock currently sits, flipping
     side near a screen edge — the Windows-folder feel
   · background = the raw video plus a colour wash with an
     opacity slider. No hue/saturation grading: Franco,
     "NADA DE SATURACION Y ESO, base el video de fondo,
     y que te deje arriba poner COLORES con opacidad".
   ═══════════════════════════════════════════ */

import { initMagneticButtons, initDirectionalButtons } from './sh2-fx.js';
import { applyHoloTilt } from './holo-tilt.js';

const LS_KEY = 'sh-notas-v1';
const LS_DOCK = 'sh-notas-dock-v1';
const LS_PANEL = 'sh-notas-panel-v1';
const BUNDLE = 'vendor/notas/notas.js';
const BUNDLE_CSS = 'vendor/notas/notas.css';
const SCHEMA = 'southustles-clase';
const SCHEMA_VERSION = 2;

/* A CSS pixel is 1/96 inch by definition, so 1cm = 96/2.54 px.
   That is what turns a stroke's point list into "centímetros de
   pincel" on the closing card. */
const PX_PER_CM = 96 / 2.54;

/** total path length drawn, in px — freedraw/line/arrow carry `points` */
const pathLengthPx = (elements) => {
  let total = 0;
  for (const el of elements || []) {
    if (el.isDeleted) continue;
    const pts = el.points;
    if (!Array.isArray(pts) || pts.length < 2) continue;
    for (let i = 1; i < pts.length; i++) {
      total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    }
  }
  return total;
};

/* Photoshop-style stroke correction. Excalidraw has NO smoothing field
   (verified against its type defs), so we post-process the committed
   freedraw points ourselves.

   Two stages, because a repeated 1-2-1 average alone PLATEAUS: with fixed
   endpoints it is the discrete heat equation, which needs ~N² passes to
   flatten and visibly stops improving after a few dozen. Measured on a
   49-point wobble it only fell 64px → 20px even at 70 passes.
   So: up to 100% we average (keeps the hand, kills the jitter); past
   100% we additionally pull every point toward the straight chord, so
   500% really does land on a line. Point COUNT is preserved throughout —
   a freedraw element's `pressures` array must stay the same length. */
const smoothPoints = (pts, strength) => {
  if (strength <= 0 || !Array.isArray(pts) || pts.length < 4) return pts;
  const s = Math.min(strength, 5);
  const passes = Math.max(1, Math.round(Math.min(s, 1) * 12));
  let out = pts.map((p) => [p[0], p[1]]);
  for (let k = 0; k < passes; k++) {
    const next = [out[0]];
    for (let i = 1; i < out.length - 1; i++) {
      next.push([
        (out[i - 1][0] + out[i][0] * 2 + out[i + 1][0]) / 4,
        (out[i - 1][1] + out[i][1] * 2 + out[i + 1][1]) / 4,
      ]);
    }
    next.push(out[out.length - 1]);
    out = next;
  }
  if (s > 1) {
    const t = (s - 1) / 4;                 // 0 at 100%, 1 at 500%
    const a = out[0], b = out[out.length - 1];
    const n = out.length - 1;
    out = out.map((p, i) => {
      const u = i / n;
      const lx = a[0] + (b[0] - a[0]) * u;
      const ly = a[1] + (b[1] - a[1]) * u;
      return [p[0] + (lx - p[0]) * t, p[1] + (ly - p[1]) * t];
    });
  }
  return out;
};

const fmtClock = (ms) => {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return h
    ? `${h}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
    : `${m}:${String(ss).padStart(2, '0')}`;
};

/* hue stops the .color-hud demo drifts through (sh-main.js) */
const DEMO_STOPS = [0.02, 0.22, 0.5, 0.62, 0.92];

const TOOLS = [
  { type: 'selection', label: 'Seleccionar (V)', key: 'v', svg: '<path d="M4 3l7 16 2.2-6.4L20 10.5z"/>' },
  { type: 'freedraw', label: 'Lápiz (P)', key: 'p', svg: '<path d="M3 20c3-1 4.5-2 7-5l6.5-6.5a2 2 0 10-2.8-2.8L7 12c-2.6 2.6-3.6 4.4-4 8z"/><path d="M13.5 5.5l3 3"/>' },
  { type: 'text', label: 'Texto (T)', key: 't', svg: '<path d="M5 5h14"/><path d="M12 5v14"/><path d="M9 19h6"/>' },
  {
    type: 'text', label: 'Caja de texto (B) — arrastrá para un párrafo que ajusta', key: 'b',
    svg: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M7 9h10M7 12.5h10M7 16h6"/>',
    hint: 'Arrastrá en el lienzo: crea una caja de ancho fijo, el texto ajusta solo. Un clic simple sigue siendo texto libre.',
  },
  { type: 'rectangle', label: 'Rectángulo (R)', key: 'r', svg: '<rect x="4" y="5.5" width="16" height="13" rx="2.5"/>' },
  { type: 'ellipse', label: 'Elipse (O)', key: 'o', svg: '<ellipse cx="12" cy="12" rx="8.2" ry="6.6"/>' },
  { type: 'diamond', label: 'Rombo (D)', key: 'd', svg: '<path d="M12 4l7.5 8L12 20 4.5 12z"/>' },
  { type: 'arrow', label: 'Flecha (A)', key: 'a', svg: '<path d="M4 18L20 6"/><path d="M13 6h7v7"/>' },
  { type: 'line', label: 'Línea (L)', key: 'l', svg: '<path d="M4 18L20 6"/>' },
  { type: 'image', label: 'Imagen (I)', key: 'i', svg: '<rect x="3.5" y="5" width="17" height="14" rx="2.4"/><circle cx="9" cy="10.2" r="1.7"/><path d="M4.5 17.5l4.8-4.6 3.2 3 2.6-2.2 4.4 4"/>' },
  { type: 'eraser', label: 'Goma (E)', key: 'e', svg: '<path d="M7.5 19.5L4 16a2 2 0 010-2.8l7.6-7.6a2 2 0 012.8 0l3.6 3.6a2 2 0 010 2.8L12 18.5"/><path d="M8 19.5h11"/>' },
  { type: 'lasso', label: 'Lazo (S)', key: 's', svg: '<path d="M12 5c4.4 0 8 2.2 8 5s-3.6 5-8 5-8-2.2-8-5 3.6-5 8-5z"/><path d="M8 14.6c0 2.4.6 3.9 1.4 4.4"/>' },
  { type: 'hand', label: 'Mano — mover el lienzo (H)', key: 'h', svg: '<path d="M8 12.5V6.2a1.3 1.3 0 012.6 0v5.1"/><path d="M10.6 11.3V5.3a1.3 1.3 0 012.6 0v6"/><path d="M13.2 11.6V6.8a1.3 1.3 0 012.6 0v5.4"/><path d="M15.8 12.2V9a1.3 1.3 0 012.6 0v5.6c0 3.2-2.2 5.4-5.2 5.4-3.4 0-4.6-1.4-6.4-4.6l-1.4-2.5a1.3 1.3 0 012.1-1.5l1.5 1.8"/>' },
  { type: 'laser', label: 'Puntero láser (K)', key: 'k', svg: '<circle cx="12" cy="12" r="2.4"/><path d="M12 3v2.6M12 18.4V21M3 12h2.6M18.4 12H21"/>' },
];

/* Excalidraw ships exactly 9 canvas fonts (ids 1,2,3,5,6,7,8,9,10 —
   there is no id 4). The CSS family string is literally the key name,
   registered as a FontFace at runtime once the component mounts, which
   is why the previews below only render after the engine is up. */
const FONTS = [
  { id: 5, label: 'Excalifont', css: 'Excalifont', hint: 'mano alzada' },
  { id: 6, label: 'Nunito', css: 'Nunito', hint: 'redondeada' },
  { id: 7, label: 'Lilita One', css: '"Lilita One"', hint: 'display pesada' },
  { id: 8, label: 'Comic Shanns', css: '"Comic Shanns"', hint: 'cómic' },
  { id: 10, label: 'Assistant', css: 'Assistant', hint: 'humanista' },
  { id: 9, label: 'Liberation Sans', css: '"Liberation Sans"', hint: 'grotesk libre' },
  { id: 2, label: 'Helvetica', css: 'Helvetica', hint: 'grotesk del sistema' },
  { id: 3, label: 'Cascadia', css: 'Cascadia', hint: 'monoespaciada' },
  { id: 1, label: 'Virgil', css: 'Virgil', hint: 'boceto clásico' },
];

const ALIGNS = [
  { v: 'left', label: 'Izq.', svg: '<path d="M4 6h16M4 10h10M4 14h16M4 18h10"/>' },
  { v: 'center', label: 'Centro', svg: '<path d="M4 6h16M7 10h10M4 14h16M7 18h10"/>' },
  { v: 'right', label: 'Der.', svg: '<path d="M4 6h16M10 10h10M4 14h16M10 18h10"/>' },
];

/* "sloppiness" — the only stroke-character knob the engine has.
   There is no freedraw smoothing/simplification field (confirmed
   against the type defs), so 'architect' is as clean as it gets. */
const ROUGHNESS = [
  { v: 0, label: 'Limpio' },
  { v: 1, label: 'Artista' },
  { v: 2, label: 'Suelto' },
];

/* ── texture brushes ──
   Confirmed by direct search of the engine's whole bundle: no spray,
   airbrush or pattern-stamp tool exists (zero matches for spray/
   airbrush/highlighter across every type def and the prod chunk). These
   are real, built by us: an overlay canvas draws raw pixels while the
   pointer is down; on release the result is committed as a normal
   Excalidraw `image` element via convertToExcalidrawElements (the safe,
   public way to build a valid element — hand-rolling the full element
   shape ourselves is exactly the kind of blind construction that broke
   the panel earlier this session). "Grosor"/"Opacidad" in Trazo y color
   double as this brush's size/opacity — nothing duplicated. */
const BRUSHES = [
  { id: 'vector', label: 'Vectorial', hint: 'El lápiz de siempre — vuelve a dibujar como elementos nativos.', svg: '<path d="M3 20c3-1 4.5-2 7-5l6.5-6.5a2 2 0 10-2.8-2.8L7 12c-2.6 2.6-3.6 4.4-4 8z"/>' },
  { id: 'aerosol', label: 'Aerosol', hint: 'Spray disparejo — la densidad baja/opacidad de arriba controla la dispersión, la segunda barra la inclinación.', svg: '<circle cx="8" cy="8" r="1"/><circle cx="12" cy="6" r="1"/><circle cx="16" cy="9" r="1"/><circle cx="7" cy="13" r="1"/><circle cx="14" cy="13" r="1"/><circle cx="10" cy="17" r="1"/><circle cx="17" cy="16" r="1"/>' },
  { id: 'dither', label: 'Dither', hint: 'Halftone ordenado (matriz Bayer) — trama retro de puntos.', svg: '<circle cx="6" cy="6" r="0.9"/><circle cx="12" cy="6" r="0.9"/><circle cx="18" cy="6" r="0.9"/><circle cx="9" cy="12" r="0.9"/><circle cx="15" cy="12" r="0.9"/><circle cx="6" cy="18" r="0.9"/><circle cx="12" cy="18" r="0.9"/><circle cx="18" cy="18" r="0.9"/>' },
  { id: 'ink', label: 'Tinta', hint: 'Rotulador con sangrado — varias pasadas superpuestas simulan la tinta abriéndose en el papel.', svg: '<path d="M5 19c3-6 5-11 8-15l4 3c-5 4-9 8-12 12z"/>' },
  { id: 'noise', label: 'Grano', hint: 'Grano/noise mezclado sobre el trazo — textura tipo film.', svg: '<rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><circle cx="8" cy="8" r="0.6"/><circle cx="15" cy="7" r="0.6"/><circle cx="11" cy="12" r="0.6"/><circle cx="16" cy="15" r="0.6"/><circle cx="7" cy="16" r="0.6"/>' },
  { id: 'vhs', label: 'VHS', hint: 'Separación de canal RGB — el trazo se triplica en rojo/cian/verde con un leve corrimiento.', svg: '<rect x="3.5" y="6" width="17" height="12" rx="2"/><path d="M8 9v6M12 9v6M16 9v6"/>' },
  { id: 'ascii', label: 'ASCII', hint: 'Escribí una frase abajo y se va estampando letra por letra a lo largo del trazo — sin texto propio, usa caracteres random.', svg: '<path d="M4 8h4M4 12h4M4 16h4"/><path d="M13 8h7M13 12h7M13 16h7"/>' },
  { id: 'stamp', label: 'Estampa', hint: 'Tu propio SVG o PNG, repetido como sello a lo largo del trazo.', svg: '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9.5" cy="9.5" r="2"/><path d="M4 16l5-4.5 4 3.5 3-2.5 4 3.5"/>' },
  { id: 'liquid', label: 'Líquido', hint: 'Gota acuosa — blobs translúcidos superpuestos con un brillo húmedo, la densidad controla cuántas capas por toque.', svg: '<path d="M12 3.5c4 5.2 7 9.3 7 12.8a7 7 0 11-14 0c0-3.5 3-7.6 7-12.8z"/>' },
  { id: 'sumi', label: 'Sumi-e', hint: 'Tinta japonesa — el ancho responde a la velocidad del trazo (rápido = fino, lento = grueso), con cerdas secas en los bordes.', svg: '<path d="M6 19c1.5-7.5 3.5-12.5 6-15.5 2.5 2 2 8-1 13.5-1.5 2.7-3 3-5 2z"/>' },
  { id: 'nodo', label: 'Nodo', hint: 'Red de partículas — cada punto se conecta con los últimos cercanos, como un circuito o un grafo.', svg: '<circle cx="6" cy="7" r="1.6"/><circle cx="15" cy="5" r="1.6"/><circle cx="18" cy="14" r="1.6"/><circle cx="8" cy="17" r="1.6"/><path d="M6 7l9-2M15 5l3 9M18 14l-10 3M6 7l2 10"/>' },
  { id: 'pixel', label: 'Píxel', hint: 'Bloques en grilla, cuadrados o redondeados — la densidad controla qué tan lleno queda el trazo.', svg: '<rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/>' },
  { id: 'iris', label: 'Iris', hint: 'Degradado radial denso al centro, con partículas cada vez más dispersas hacia el borde — como un halo.', svg: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7" stroke-dasharray="1 2.4"/><circle cx="6" cy="6" r="0.6"/><circle cx="19" cy="7" r="0.6"/><circle cx="18" cy="18" r="0.6"/><circle cx="5" cy="18" r="0.6"/>' },
];

/* dock buttons that open a flyout instead of arming a tool */
/* dock buttons that reveal a section of the ONE unified panel */
const OPTS = [
  { id: 'trazo', label: 'Trazo y color', svg: '<circle cx="12" cy="12" r="7.5"/><path d="M12 4.5a7.5 7.5 0 010 15z" fill="currentColor" stroke="none"/>' },
  { id: 'texto', label: 'Texto — fuente, tamaño, alineación', svg: '<path d="M5 7V5h14v2"/><path d="M12 5v14"/><path d="M9 19h6"/>' },
  { id: 'radius', label: 'Radius', svg: '<path d="M5 19V11A6 6 0 0111 5h8"/>' },
  { id: 'capas', label: 'Capas y grupos', svg: '<rect x="3.5" y="3.5" width="11" height="11" rx="2"/><rect x="9.5" y="9.5" width="11" height="11" rx="2"/>' },
  { id: 'mask', label: 'Máscara — recortar una imagen con una forma', svg: '<rect x="3" y="4.5" width="18" height="15" rx="2.5" stroke-dasharray="3 2.4"/><path d="M12 8.6c3 0 5.2 2.1 6 3.4-.8 1.3-3 3.4-6 3.4s-5.2-2.1-6-3.4c.8-1.3 3-3.4 6-3.4z"/><circle cx="12" cy="12" r="1.7"/>' },
];

/* Which of OUR sections belong to which tool. Franco: "cuando estás en
   pincel, se te abren todos los paneles de pincel nomás. Cuando estás en
   font, se te abren solo los de font." */
const SECTION_TOOLS = {
  trazo: ['freedraw', 'line', 'arrow', 'rectangle', 'ellipse', 'diamond', 'laser'],
  texto: ['text'],
  radius: ['rectangle', 'diamond', 'image', 'line', 'arrow'],
  mask: ['image', 'freedraw', 'ellipse', 'rectangle', 'diamond'],
};
/* the dock's option buttons arm the tool that owns their section.
   `mask` is deliberately absent: arming a tool clears the selection, and
   the mask action needs whatever the user already has selected. */
const OPT_TOOL = { trazo: 'freedraw', texto: 'text', radius: 'rectangle' };

/* ── background surfaces ──
   One button cycles them. Curated mixes only, each with a polarity
   so the chrome and the default ink flip with it. */
/* reference-format worktables. `px` is the REAL output size the export
   renders at (these are the sizes the platforms actually want, not the
   on-canvas size) — `ratio` is derived from it so the frame on screen and
   the exported file can never drift apart. Swap these numbers when Franco
   sends his own preset sheet; nothing else needs to change. */
const FORMATS = [
  { id: 'square', label: 'Cuadrado', px: [1080, 1080] },
  { id: 'feed', label: 'Feed 4:5', px: [1080, 1350] },
  { id: 'story', label: 'Story 9:16', px: [1080, 1920] },
  { id: 'video', label: 'Video 16:9', px: [1920, 1080] },
  { id: 'photo', label: 'Foto 3:2', px: [1620, 1080] },
  { id: 'photo-v', label: 'Foto vert. 2:3', px: [1080, 1620] },
  { id: 'classic', label: 'Clásico 4:3', px: [1440, 1080] },
  { id: 'classic-v', label: 'Clásico vert. 3:4', px: [1080, 1440] },
  { id: 'cinema', label: 'Cine 21:9', px: [2520, 1080] },
  { id: 'banner', label: 'Banner 3:1', px: [1500, 500] },
  { id: 'banner-web', label: 'Banner web 8:1', px: [1600, 200] },
  { id: 'poster-v', label: 'Poster vert. 1:2', px: [1080, 2160] },
  { id: 'cards', label: 'Dos cards 2:1', px: [1600, 800] },
  { id: 'a4', label: 'A4 horizontal', px: [3508, 2480] },
  { id: 'letter-v', label: 'Carta vertical', px: [2550, 3300] },
].map((f) => ({ ...f, ratio: f.px[0] / f.px[1] }));

const SURFACES = [
  { id: 'video', label: 'tu video', dark: true },
  { id: 'ink', label: 'negro figma', dark: true },
  { id: 'black', label: 'negro puro', dark: true },
  { id: 'noise-dark', label: 'gris oscuro con noise', dark: true },
  { id: 'grad-violet', label: 'degradado violeta', dark: true },
  { id: 'grad-warm', label: 'degradado cálido', dark: true },
  { id: 'cream', label: 'crema con noise', dark: false },
  { id: 'cream-color', label: 'crema con color', dark: false },
  { id: 'white', label: 'blanco', dark: false },
  { id: 'grey', label: 'gris papel', dark: false },
];

/* ═══════════ image storage: IndexedDB, not localStorage ═══════════
   localStorage has a hard ~5-10MB quota shared by the whole origin. A
   single pasted photo as base64 can eat that alone — that was the "se
   llena la memoria" bug. IndexedDB is built for blobs (hundreds of MB in
   practice), so pasted images live there; the JSON in localStorage only
   remembers WHICH file ids a class references. */
const IDB_NAME = 'sh-notas-files';
const IDB_STORE = 'files';
let idbPromise = null;
const idb = () => {
  if (idbPromise) return idbPromise;
  idbPromise = new Promise((resolve, reject) => {
    if (!window.indexedDB) { reject(new Error('sin IndexedDB')); return; }
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return idbPromise;
};
const idbPutFiles = async (files) => {
  const entries = Object.entries(files || {});
  if (!entries.length) return;
  const db = await idb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    entries.forEach(([id, data]) => tx.objectStore(IDB_STORE).put(data, id));
    tx.oncomplete = resolve; tx.onerror = () => reject(tx.error);
  });
};
const idbGetFiles = async (ids) => {
  if (!ids?.length) return {};
  const db = await idb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readonly');
    const store = tx.objectStore(IDB_STORE);
    const out = {};
    let pending = ids.length;
    ids.forEach((id) => {
      const r = store.get(id);
      r.onsuccess = () => { if (r.result) out[id] = r.result; if (--pending === 0) resolve(out); };
      r.onerror = () => { if (--pending === 0) resolve(out); };
    });
    tx.onerror = () => reject(tx.error);
  });
};
const idbDeleteFiles = async (ids) => {
  if (!ids?.length) return;
  const db = await idb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    ids.forEach((id) => tx.objectStore(IDB_STORE).delete(id));
    tx.oncomplete = resolve; tx.onerror = () => reject(tx.error);
  });
};

/* ── persistence ────────────────────────────── */
const loadAll = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; }
};
const saveAll = (list) => {
  try { localStorage.setItem(LS_KEY, JSON.stringify(list)); return true; }
  catch (err) { console.warn('[notas] no se pudo guardar (cuota llena?)', err); return false; }
};
const uid = () => `nota_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const clamp01 = (v) => clamp(v, 0, 1);

const hsl2hex = (h, s, l) => {
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const v = l / 100 - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
    return Math.round(255 * v).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

/* inverse of hsl2hex — needed to reflect a colour that came FROM the
   engine (native swatch click, eyedropper) back into our hue/sat/lit bars */
const hex2hsl = (hex) => {
  const n = hex.replace('#', '');
  const r = parseInt(n.slice(0, 2), 16) / 255;
  const g = parseInt(n.slice(2, 4), 16) / 255;
  const b = parseInt(n.slice(4, 6), 16) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const l = (mx + mn) / 2;
  let h = 0, s = 0;
  if (mx !== mn) {
    const d = mx - mn;
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
};

/* a paragraph text box needs to wrap on its own — Excalidraw's internal
   wrapText is not part of the public API, so this is our own greedy
   word-wrap using the same font the engine will actually render with */
const WRAP_WIDTH = 480;
const measureCtx = document.createElement('canvas').getContext('2d');
const fontCss = (id) => FONTS.find((f) => f.id === id)?.css || 'Excalifont';
const wrapParagraph = (text, fontSize, fontFamily) => {
  measureCtx.font = `${fontSize}px ${fontCss(fontFamily)}`;
  const out = [];
  for (const paragraph of String(text).split('\n')) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (!words.length) { out.push(''); continue; }
    let line = '';
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (line && measureCtx.measureText(test).width > WRAP_WIDTH - 20) {
        out.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    out.push(line);
  }
  return out.join('\n');
};

/* background = a surface (video / cream paper / figma-black) plus a
   colour wash with its own opacity, plus a darkening scrim */
const defaultBg = () => ({
  surface: 'cream', clip: 'both', wash: '#6d5efc', washAmount: 0, scrim: 0.4,
});


/* "Layers" = Excalidraw's own groups (native Ctrl+G) plus standalone
   images, front-first. There is no native per-layer visibility toggle
   in this engine — only element opacity/lock — so this stays honest:
   enumerate + thumbnail + select, nothing pretending to be Photoshop. */
const groupsOf = (elements) => {
  const live = (elements || []).slice().reverse().filter((e) => !e.isDeleted);
  const seen = new Set();
  const groups = [];
  live.forEach((el) => {
    const gid = el.groupIds?.[el.groupIds.length - 1];
    if (gid) {
      if (seen.has(gid)) return;
      seen.add(gid);
      const members = live.filter((e) => e.groupIds?.includes(gid));
      groups.push({ key: gid, kind: 'group', elements: members });
    } else if (el.type === 'image') {
      groups.push({ key: el.id, kind: 'image', elements: [el] });
    }
  });
  const loose = live.filter((e) => !e.groupIds?.length && e.type !== 'image');
  if (loose.length) groups.push({ key: 'loose', kind: 'loose', elements: loose });
  return groups;
};

/** first words of any text on the canvas — the micro-copy on the card */
const textExcerpt = (elements) => {
  const txt = (elements || [])
    .filter((e) => !e.isDeleted && e.type === 'text')
    .map((e) => (e.originalText || e.text || '').trim())
    .filter(Boolean)
    .join(' · ');
  return txt.length > 120 ? `${txt.slice(0, 120)}…` : txt;
};

/** downscale a PNG blob to a card-sized JPEG dataURL (localStorage is ~5MB).
    `bg` is the class's own surface colour — the thumbnail used to be baked
    on a hardcoded near-black, so a class drawn on cream came back as dark
    ink on a black card, nothing like what the user actually made. */
const blobToThumb = (blob, max = 520, bg = '#101012') =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const r = Math.min(max / img.width, max / img.height, 1);
      const c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(img.width * r));
      c.height = Math.max(1, Math.round(img.height * r));
      const x = c.getContext('2d');
      x.fillStyle = bg || '#101012';
      x.fillRect(0, 0, c.width, c.height);
      x.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.72));
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });

/* ordered dither — a 4×4 Bayer threshold matrix, the standard
   ordered-dithering technique (not a fake "noise" stand-in) */
const BAYER4 = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
const ASCII_CHARS = '01¤×+•/\\|_~=';

const sprayDab = (ctx, x, y, size, density, tilt, color, opacity) => {
  const n = Math.max(2, Math.round(density));
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * size;
    const px = x + Math.cos(a) * r * tilt;
    const py = y + Math.sin(a) * r;
    ctx.globalAlpha = opacity * (0.3 + Math.random() * 0.55);
    ctx.beginPath();
    ctx.arc(px, py, 0.6 + Math.random() * 1.6, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
  ctx.globalAlpha = 1;
};

const ditherDab = (ctx, x, y, size, color, opacity, density = 100) => {
  const cell = 4;
  const coverage = opacity * clamp(density / 100, 0.15, 1) * 1.4; // density thins/fills the halftone
  for (let dy = -size; dy <= size; dy += cell) {
    for (let dx = -size; dx <= size; dx += cell) {
      if (dx * dx + dy * dy > size * size) continue;
      const gx = Math.floor((x + dx) / cell) & 3;
      const gy = Math.floor((y + dy) / cell) & 3;
      if (BAYER4[gy][gx] / 16 < coverage) {
        ctx.fillStyle = color;
        ctx.fillRect(Math.floor((x + dx) / cell) * cell, Math.floor((y + dy) / cell) * cell, cell - 0.5, cell - 0.5);
      }
    }
  }
};

const inkSegment = (ctx, x0, y0, x1, y1, size, color, opacity) => {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let i = 0; i < 4; i++) {
    const j = (i - 1.5) * 0.7;
    ctx.globalAlpha = opacity * (0.2 + Math.random() * 0.12);
    ctx.strokeStyle = color;
    ctx.lineWidth = size * (1 + i * 0.22) + Math.random();
    ctx.beginPath();
    ctx.moveTo(x0 + j, y0 - j);
    ctx.lineTo(x1 + j, y1 - j);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
};

const plainSegment = (ctx, x0, y0, x1, y1, size, color, opacity) => {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.globalAlpha = opacity; ctx.strokeStyle = color; ctx.lineWidth = size;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
  ctx.globalAlpha = 1;
};

/* watery blob — a handful of overlapping translucent circles (never
   perfectly round) plus a soft "wet" highlight, density controls how many
   layer per dab */
const liquidDab = (ctx, x, y, size, color, opacity, density = 50) => {
  const n = Math.max(2, Math.round(2 + (density / 100) * 4));
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const drift = size * 0.35 * Math.random();
    const px = x + Math.cos(a) * drift, py = y + Math.sin(a) * drift;
    const r = size * (0.45 + Math.random() * 0.55);
    ctx.globalAlpha = opacity * (0.28 + Math.random() * 0.22);
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = opacity * 0.4;
  ctx.beginPath();
  ctx.arc(x - size * 0.18, y - size * 0.18, size * 0.3, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
};

/* Japanese ink brush — width answers to how fast the pointer is moving
   (slow = loaded/thick, fast = starved/thin, like real sumi-e), with a
   few ragged dry-brush hairs along the edges so it never reads as a
   plain uniform stroke */
const sumiSegment = (ctx, x0, y0, x1, y1, size, color, opacity, taper) => {
  const w = Math.max(1, size * taper);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
  const ang = Math.atan2(y1 - y0, x1 - x0);
  const nx = Math.cos(ang + Math.PI / 2), ny = Math.sin(ang + Math.PI / 2);
  for (let i = 0; i < 3; i++) {
    const off = (Math.random() - 0.5) * w * 0.95;
    ctx.globalAlpha = opacity * (0.12 + Math.random() * 0.18);
    ctx.lineWidth = Math.max(0.5, w * 0.12);
    ctx.beginPath();
    ctx.moveTo(x0 + nx * off, y0 + ny * off);
    ctx.lineTo(x1 + nx * off * 1.3, y1 + ny * off * 1.3);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
};

/* circuit/particle-link node — a small dot plus a "joint" ring, wired to
   its few most recent neighbors with fading lines when they're close
   enough, like a node-graph or particle network rather than a stroke */
const nodeDab = (ctx, x, y, size, color, opacity, trail) => {
  const reach = size * 7;
  for (const [px, py] of trail) {
    const d = Math.hypot(x - px, y - py);
    if (d < 1 || d > reach) continue;
    ctx.globalAlpha = opacity * (1 - d / reach) * 0.55;
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(0.5, size * 0.13);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(px, py); ctx.stroke();
  }
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(x, y, size * 0.32, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = opacity * 0.65;
  ctx.lineWidth = Math.max(0.5, size * 0.1);
  ctx.strokeStyle = color;
  ctx.beginPath(); ctx.arc(x, y, size * 0.7, 0, Math.PI * 2); ctx.stroke();
  ctx.globalAlpha = 1;
};

/* pixel-art block — snaps each dab to a grid cell, filled solid, square
   or rounded. Density is a per-dab coin-flip (matches how it already
   thins ink/dither elsewhere) rather than a fill-probability inside one
   cell, so higher density reads as a denser scatter of whole pixels */
const pixelDab = (ctx, x, y, cell, color, opacity, rounded) => {
  const gx = Math.floor(x / cell) * cell;
  const gy = Math.floor(y / cell) * cell;
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  if (rounded) {
    const r = cell * 0.28;
    ctx.beginPath();
    ctx.moveTo(gx + r, gy);
    ctx.arcTo(gx + cell, gy, gx + cell, gy + cell, r);
    ctx.arcTo(gx + cell, gy + cell, gx, gy + cell, r);
    ctx.arcTo(gx, gy + cell, gx, gy, r);
    ctx.arcTo(gx, gy, gx + cell, gy, r);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillRect(gx, gy, cell, cell);
  }
  ctx.globalAlpha = 1;
};

/* iris — a soft radial gradient core (dense, like a gaussian blur radiating
   from the center) with sparse scattered particles fading out toward the
   edge, like a flashlight halo rather than a hard-edged dab */
const irisDab = (ctx, x, y, size, color, opacity) => {
  const coreR = size * 0.9;
  const grad = ctx.createRadialGradient(x, y, 0, x, y, coreR);
  grad.addColorStop(0, color);
  grad.addColorStop(1, 'transparent');
  ctx.globalAlpha = opacity;
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(x, y, coreR, 0, Math.PI * 2); ctx.fill();
  const spread = size * 1.8;
  for (let i = 0; i < 10; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = coreR + Math.random() * spread;
    const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r;
    const fade = 1 - (r - coreR) / spread;
    ctx.globalAlpha = opacity * fade * (0.15 + Math.random() * 0.25);
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(px, py, 0.6 + Math.random() * 1.3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
};

/** a small pre-rendered grey-noise tile, tiled with source-atop so grain
    only lands where the stroke already has ink */
const noiseTile = (() => {
  const c = document.createElement('canvas'); c.width = 64; c.height = 64;
  const cx = c.getContext('2d');
  const id = cx.createImageData(64, 64);
  for (let i = 0; i < id.data.length; i += 4) {
    const v = Math.floor(Math.random() * 255);
    id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255;
  }
  cx.putImageData(id, 0, 0);
  return c;
})();

const applyGrain = (ctx, w, h, opacity) => {
  ctx.save();
  ctx.globalCompositeOperation = 'source-atop';
  ctx.globalAlpha = opacity;
  for (let ty = 0; ty < h; ty += 64) for (let tx = 0; tx < w; tx += 64) ctx.drawImage(noiseTile, tx, ty);
  ctx.restore();
  ctx.globalAlpha = 1;
};

/** real RGB channel-split: isolate the stroke's own alpha mask into three
    tinted copies (source-in), then additive-blend them offset (lighter) */
const vhsSplit = (sourceCanvas, w, h, strength) => {
  const out = document.createElement('canvas'); out.width = w; out.height = h;
  const octx = out.getContext('2d');
  const layer = (dx, dy, tint) => {
    const t = document.createElement('canvas'); t.width = w; t.height = h;
    const tc = t.getContext('2d');
    tc.drawImage(sourceCanvas, 0, 0);
    tc.globalCompositeOperation = 'source-in';
    tc.fillStyle = tint; tc.fillRect(0, 0, w, h);
    octx.globalCompositeOperation = 'lighter';
    octx.drawImage(t, dx, dy);
  };
  layer(-strength, 0, '#ff2b55');
  layer(strength, 0, '#26e0ff');
  layer(0, strength * 0.6, '#3dff8a');
  return out;
};

export function initNotas() {
  const host = document.querySelector('[data-notas]');
  if (!host) return;

  const listEl = host.querySelector('[data-notas-list]');
  const emptyEl = host.querySelector('[data-notas-empty]');
  const newBtn = host.querySelector('[data-notas-new]');
  const importBtn = host.querySelector('[data-notas-import]');

  let notes = loadAll();
  let studio = null;
  let engine = null;
  let current = null;
  let saveTimer = null;
  let openFlyout = null;
  let observer = null;
  let armToolRef = null;   // set by wireStudio so showFlyout can arm a tool
  let resetBrushRef = null; // set by wireStudio: arming a native tool turns off any texture brush
  let stampImgRef = null;  // mirrors wireStudio's stampImg so the preview strip can draw real dabs
  let maskFromSelection = null;  // set by wireStudio so the dock's MASK button can fire it directly
  let pixelRoundedRef = false; // mirrors wireStudio's pixelRounded, same reason
  let panelNode = null;    // hard ref: React removes it from the DOM on re-render
  // showFlyout() re-arms the section's own tool (armTool('text') for
  // "texto", armTool('rectangle') for "radius"), and arming any tool
  // clears the engine's live selection as a side effect — so opening the
  // very panel that hosts "aplicar a texto seleccionado" or "usar como
  // máscara" wiped out the selection those actions need. Snapshot it
  // right before the tool gets re-armed so those actions have something
  // real to fall back on.
  let preFlyoutSelection = [];

  const state = {
    hue: 240, sat: 6, lit: 10, color: '#14140f',
    size: 20, font: 5, align: 'left', stroke: 2, opacity: 100, smooth: 0, drift: false, bg: defaultBg(),
    brush: 'vector', density: 50, tilt: 1, asciiText: '',
    startedAt: 0, baseMs: 0, clockTimer: null,
    surfaceIdx: SURFACES.findIndex((x) => x.id === 'cream'), autoInk: true,
  };

  /* ids already accounted for, so a fresh onChange pass only reacts to
     elements that are genuinely new (used to auto-wrap pasted paragraphs) */
  let knownIds = new Set();
  /* same idea, for smoothing: seeded with whatever a note already had on
     open, so the smoothness slider only ever reshapes the stroke you just
     finished — never every pre-existing/imported freedraw element */
  let smoothed = new Set();

  /* elapsed = time already banked from earlier sittings + this one */
  const elapsedMs = () =>
    state.baseMs + (state.startedAt ? Date.now() - state.startedAt : 0);

  const brushCm = () => {
    const a = api();
    return a ? pathLengthPx(a.getSceneElements()) / PX_PER_CM : 0;
  };

  const tickClock = () => {
    if (!studio) return;
    studio.querySelector('[data-clock]').textContent = fmtClock(elapsedMs());
  };

  const refreshBrush = () => {
    if (!studio) return;
    studio.querySelector('[data-brush]').textContent = `${brushCm().toFixed(1)} cm`;
  };

  /* ═══════ note rail ═══════ */
  const renderList = () => {
    listEl.innerHTML = '';
    notes
      .slice()
      .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
      .forEach((n) => {
        const chip = document.createElement('article');
        chip.className = 'clase-card';
        chip.setAttribute('role', 'button');
        chip.tabIndex = 0;
        const when = new Date(n.updatedAt || Date.now());
        const excerpt = n.excerpt || '';
        chip.innerHTML =
          `<div class="hc-tilt">` +
            `<div class="clase-card__banner">` +
              (n.preview
                ? `<img class="clase-card__img" alt="" loading="lazy" />`
                : `<span class="clase-card__blank"><svg viewBox="0 0 24 24"><path d="M4 16l5-4.5 4 3.5 3-2.5 4 3.5"/><circle cx="9" cy="8" r="1.6"/><rect x="3.5" y="4" width="17" height="16" rx="2.5"/></svg>sin dibujo</span>`) +
              (excerpt ? `<span class="clase-card__caption"></span>` : '') +
              `<span class="clase-card__glare" aria-hidden="true"></span>` +
              `<span class="clase-card__open">Abrir clase<svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg></span>` +
            `</div>` +
            `<div class="clase-card__body">` +
              `<span class="clase-card__swatch" style="background:${n.accent || '#6d5efc'}"></span>` +
              `<h4 class="clase-card__name"></h4>` +
              `<div class="clase-card__meta">` +
                `<span><b>${fmtClock(n.durationMs || 0)}</b>duración</span>` +
                `<span><b>${(n.brushCm || 0).toFixed(0)}</b>cm</span>` +
                `<span><b>${when.toLocaleDateString()}</b></span>` +
              `</div>` +
            `</div>` +
          `</div>` +
          `<button type="button" class="clase-card__del" aria-label="Borrar clase"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>`;
        chip.querySelector('.clase-card__name').textContent = n.name || 'sin título';
        if (excerpt) chip.querySelector('.clase-card__caption').textContent = excerpt;
        if (n.preview) chip.querySelector('.clase-card__img').src = n.preview;
        // the site's own spring tilt — same feel as the trading cards.
        // scale is big enough (plus the banner's aspect-ratio flipping to
        // 2:1 in CSS) to genuinely dominate the row on hover, not just
        // nudge past its neighbors — reads as a cinema-preview pop
        try { applyHoloTilt(chip, { maxTilt: 7, scale: 1.9 }); } catch {}
        chip.addEventListener('click', (e) => {
          if (e.target.closest('.clase-card__del')) return;
          openStudio(n);
        });
        chip.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openStudio(n); }
        });
        chip.querySelector('.clase-card__del').addEventListener('click', () => {
          if (!window.confirm(`¿Borrar "${n.name || 'sin título'}"?`)) return;
          idbDeleteFiles(n.scene?.fileIds || []).catch(() => {});
          notes = notes.filter((x) => x.id !== n.id);
          saveAll(notes); renderList();
        });
        listEl.appendChild(chip);
      });
    if (emptyEl) emptyEl.hidden = notes.length > 0;
  };

  /* ═══════ layers panel ═══════ */
  let layersToken = 0;
  const renderLayers = async () => {
    const wrap = studio?.querySelector('[data-layers]');
    const a = api();
    if (!wrap || !a) return;
    const token = ++layersToken;
    const groups = groupsOf(a.getSceneElements());
    current.layerNames = current.layerNames || {};
    wrap.innerHTML = '';
    if (!groups.length) {
      wrap.innerHTML = '<p class="n-hint">Todavía no hay grupos ni imágenes en esta clase.</p>';
      return;
    }
    const mod = await loadBundle().catch(() => null);
    if (token !== layersToken) return; // a newer render started meanwhile

    groups.forEach((g) => {
      const row = document.createElement('div');
      row.className = 'n-layer';
      const kindLabel = g.kind === 'loose' ? 'trazos sueltos' : g.kind === 'image' ? 'imagen' : 'grupo';
      row.innerHTML =
        `<span class="n-layer__thumb"><svg viewBox="0 0 24 24" class="n-layer__ph"><rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><path d="M3.5 15.5l5-4.6 4 3.6 3-2.4 5 4.4"/></svg></span>` +
        `<span class="n-layer__col">` +
          `<input class="n-layer__name" type="text" placeholder="${kindLabel}" />` +
          `<span class="n-layer__meta">${g.elements.length} el · ${kindLabel}</span>` +
        `</span>` +
        `<button type="button" class="n-layer__del" aria-label="Borrar capa"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>`;
      const nameInput = row.querySelector('.n-layer__name');
      nameInput.value = current.layerNames[g.key] || '';
      nameInput.addEventListener('input', (e) => { current.layerNames[g.key] = e.target.value; });
      nameInput.addEventListener('click', (e) => e.stopPropagation());
      row.addEventListener('click', () => {
        const ids = {};
        g.elements.forEach((el) => { ids[el.id] = true; });
        a.updateScene({ appState: { selectedElementIds: ids } });
        a.scrollToContent(g.elements, { fitToViewport: true, animate: true });
      });
      row.querySelector('.n-layer__del').addEventListener('click', (e) => {
        e.stopPropagation();
        const ids = new Set(g.elements.map((el) => el.id));
        const next = a.getSceneElements().map((el) => (ids.has(el.id) ? { ...el, isDeleted: true } : el));
        a.updateScene({ elements: next });
        renderLayers();
      });
      wrap.appendChild(row);

      if (mod?.exportToBlob) {
        mod.exportToBlob({
          elements: g.elements,
          files: a.getFiles(),
          appState: { exportBackground: false, exportPadding: 6 },
          mimeType: 'image/png',
        }).then((blob) => {
          if (token !== layersToken || !blob) return;
          const url = URL.createObjectURL(blob);
          const img = new Image();
          img.onload = () => URL.revokeObjectURL(url);
          img.src = url;
          const thumb = row.querySelector('.n-layer__thumb');
          thumb.style.backgroundImage = `url(${url})`;
          thumb.classList.add('has-img');
        }).catch(() => {});
      }
    });
  };

  /* ═══════ engine bootstrap (lazy) ═══════ */
  let bundlePromise = null;
  const loadBundle = () => {
    if (bundlePromise) return bundlePromise;
    window.EXCALIDRAW_ASSET_PATH = new URL('vendor/notas/', document.baseURI).href;
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = BUNDLE_CSS;
    document.head.appendChild(css);
    bundlePromise = import(`./../${BUNDLE}`).catch((err) => {
      console.error('[notas] no cargó el motor', err);
      bundlePromise = null;
      throw err;
    });
    return bundlePromise;
  };

  /* ═══════ studio shell ═══════ */
  const buildStudio = () => {
    const el = document.createElement('div');
    el.className = 'notas-studio';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Notas creativas — estudio');
    el.innerHTML = `
      <div class="notas-studio__bg" aria-hidden="true">
        <video data-vid="a" src="media/notas-bg-a.mp4" muted loop playsinline preload="auto"></video>
        <video data-vid="b" src="media/notas-bg-b.mp4" muted loop playsinline preload="auto"></video>
        <div class="notas-studio__wash"></div>
        <div class="notas-studio__scrim"></div>
      </div>

      <div class="notas-studio__canvas" data-notas-canvas></div>
      <!-- SIBLING of the React mount, never a child of it — a child would
           be exactly the "foreign node inside React's tree" mistake that
           broke drawing earlier this session. Only takes pointer events
           while a texture brush is armed. -->
      <canvas class="notas-texture-overlay" data-texture-overlay aria-hidden="true"></canvas>

      <div class="notas-studio__top">
        <div class="notas-studio__lockup">
          <b>South Hustles</b><span>estudio creativo</span><em>notas creativas</em>
        </div>
        <input class="notas-title" data-notas-title type="text" placeholder="título de la nota" aria-label="Título" />
        <div class="notas-studio__acts">
          <button type="button" class="n-pill n-pill--surface" data-act="surface" title="Cambiar el fondo">
            <i class="n-pill__swatch" data-surface-swatch></i><span data-val="surface">tu video</span>
          </button>
          <div class="n-formats" data-formats-wrap>
            <button type="button" class="n-pill" data-act="formats" title="Formatos de referencia" aria-haspopup="true">
              <svg viewBox="0 0 24 24" class="n-chip__icon"><rect x="3.5" y="5" width="17" height="14" rx="1.5"/><path d="M3.5 12h17M9 5v14"/></svg>
              Formatos
            </button>
            <div class="n-formats__pop" data-formats-pop hidden></div>
          </div>
          <button type="button" class="n-pill" data-act="png">PNG</button>
          <button type="button" class="n-pill" data-act="png-frame" title="Exportar solo lo que hay dentro de la mesa de trabajo seleccionada">PNG mesa</button>
          <button type="button" class="n-pill" data-act="export">JSON</button>
          <button type="button" class="n-pill n-pill--solid" data-act="save">Guardar</button>
          <button type="button" class="n-pill" data-act="close" aria-label="Cerrar"><svg viewBox="0 0 24 24" class="n-chip__icon"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
        </div>
      </div>

      <!-- draggable dock -->
      <div class="notas-dock" data-dock role="toolbar" aria-label="Herramientas">
        <button type="button" class="n-grip" data-grip aria-label="Mover el panel" title="Arrastrame">
          <svg viewBox="0 0 24 24"><circle cx="9" cy="6" r="1.4"/><circle cx="15" cy="6" r="1.4"/><circle cx="9" cy="12" r="1.4"/><circle cx="15" cy="12" r="1.4"/><circle cx="9" cy="18" r="1.4"/><circle cx="15" cy="18" r="1.4"/></svg>
        </button>
        <button type="button" class="n-tool" data-history="undo" title="Deshacer (Ctrl+Z)" aria-label="Deshacer">
          <svg viewBox="0 0 24 24"><path d="M8 8H5V5"/><path d="M5.3 15.5A8 8 0 106 8L5 8.7"/></svg>
        </button>
        <button type="button" class="n-tool" data-history="redo" title="Rehacer (Ctrl+Shift+Z)" aria-label="Rehacer">
          <svg viewBox="0 0 24 24"><path d="M16 8h3V5"/><path d="M18.7 15.5A8 8 0 1018 8l1 .7"/></svg>
        </button>

        <!-- always-on HUD: the armed brush and its colour, readable at a
             glance without opening any panel. Sits under the dock's tools
             (i.e. under MASK) as its own block. -->
        <div class="n-hud" data-hud>
          <div class="n-hud__brush">
            <span class="n-hud__icon" data-hud-icon></span>
            <b class="n-hud__name" data-hud-name>Vectorial</b>
          </div>
          <canvas class="n-hud__preview" data-hud-preview aria-hidden="true"></canvas>
          <button type="button" class="n-hud__swatch" data-hud-swatch title="Color del trazo — clic abre Trazo y color"></button>
        </div>
      </div>

      <!-- ONE panel. Draggable. Excalidraw's own properties island gets
           moved inside it at runtime, so the stock controls and ours read
           as a single window instead of two floating slabs. -->
      <div class="n-panel" data-panel>
        <div class="n-panel__scroll">

      <div class="n-sect" data-sect="trazo">
        <div class="n-flyout__title">Trazo y color <span data-val="color">#F4F4F5</span></div>
        <div class="n-sub">Pincel <span class="n-group__val" data-val="brush">Vectorial</span></div>
        <div class="n-brushes" data-brushes></div>
        <p class="n-hint" data-brush-hint>El lápiz de siempre — vuelve a dibujar como elementos nativos.</p>
        <div class="n-brush-extra" data-brush-extra hidden>
          <div class="n-sub" data-density-label>Densidad <span class="n-group__val" data-val="density">50%</span></div>
          <input class="n-range" data-range="density" data-density-input type="range" min="5" max="100" step="1" value="50" aria-label="Densidad del pincel" />
          <div class="n-sub" data-tilt-label hidden>Inclinación <span class="n-group__val" data-val="tilt">100%</span></div>
          <input class="n-range" data-range="tilt" type="range" min="40" max="240" step="5" value="100" hidden aria-label="Inclinación del spray" />
          <div class="n-row n-row--tight" data-pixel-row hidden>
            <button type="button" class="n-chip" data-pixel-round>redondeado</button>
          </div>
          <div class="n-stamp-row" data-stamp-row hidden>
            <button type="button" class="n-pill" data-stamp-upload>Subir SVG / PNG</button>
            <span class="n-stamp-name" data-stamp-name>estampa por defecto</span>
            <input type="file" accept="image/png,image/svg+xml" data-stamp-input hidden />
          </div>
          <div class="n-ascii-row" data-ascii-row hidden>
            <input class="n-ascii-input" data-ascii-input type="text" maxlength="200" placeholder="Escribí una frase para estampar letra por letra…" aria-label="Texto del pincel ASCII" />
            <span class="n-ascii-count" data-ascii-count>usando caracteres random</span>
          </div>
        </div>
        <div class="n-hue" data-bar="hue" role="slider" tabindex="0" aria-label="Tono" aria-valuemin="0" aria-valuemax="360" aria-valuenow="0">
          <span class="n-knob" data-knob="hue"></span>
        </div>
        <div class="n-bar n-bar--sat" data-bar="sat" role="slider" tabindex="0" aria-label="Saturación" aria-valuemin="0" aria-valuemax="100" aria-valuenow="80">
          <span class="n-knob" data-knob="sat"></span>
        </div>
        <div class="n-bar n-bar--lit" data-bar="lit" role="slider" tabindex="0" aria-label="Luminosidad" aria-valuemin="0" aria-valuemax="100" aria-valuenow="62">
          <span class="n-knob" data-knob="lit"></span>
        </div>
        <div class="n-preview">
          <span class="n-preview__chip" data-preview-chip title="Clic: teñir el fondo con este color"></span>
          <button type="button" class="n-eyedrop" data-eyedrop title="Cuentagotas — tomar un color de cualquier parte de la pantalla" aria-label="Cuentagotas">
            <svg viewBox="0 0 24 24"><path d="M16.5 2.5l5 5-3 3-1.6-1.6L7.4 18.4a2 2 0 01-1.1.56l-3.4.6.6-3.4a2 2 0 01.56-1.1L13.6 4.6 12 3l1.5-1.5z"/><circle cx="5.4" cy="18.6" r="1.15"/></svg>
          </button>
          <span>
            <span class="n-preview__hex" data-preview-hex>#F4F4F5</span>
            <span class="n-preview__sub" data-preview-sub>clic en el cuadro para teñir el fondo</span>
          </span>
        </div>
        <div class="n-sub">Grosor del trazo <span class="n-group__val" data-val="stroke">2px</span></div>
        <canvas class="n-brush-preview" data-brush-preview width="272" height="78" aria-hidden="true"></canvas>
        <div class="n-scale"><span>fino</span><span>grueso</span></div>
        <input class="n-range" data-range="stroke" type="range" min="1" max="60" step="1" value="2" aria-label="Grosor del trazo" />
        <div class="n-sub">Opacidad <span class="n-group__val" data-val="opacity">100%</span></div>
        <input class="n-range" data-range="opacity" type="range" min="0" max="100" step="1" value="100" aria-label="Opacidad" />
        <div class="n-sub">Suavidad <span class="n-group__val" data-val="smooth">0%</span></div>
        <div class="n-scale"><span>crudo — más DPI</span><span>recta</span></div>
        <input class="n-range" data-range="smooth" type="range" min="0" max="500" step="5" value="0" aria-label="Suavidad del trazo" />
        <p class="n-hint">Corrige el trazo al soltar, como el suavizado de Photoshop. En 0 queda tal cual lo dibujaste; pasando 300% te endereza casi a línea recta.</p>
        <div class="n-sub">Carácter del trazo</div>
        <div class="n-row n-row--tight" data-rough></div>
      </div>

      <div class="n-sect" data-sect="texto">
        <div class="n-flyout__title">Texto <span data-val="size">20px</span></div>
        <div class="n-sub">Fuente</div>
        <div class="n-fonts" data-fonts></div>
        <div class="n-sub">Tamaño <span class="n-group__val" data-val="size2">20px</span></div>
        <div class="n-row n-row--tight" data-size-presets>
          <button type="button" class="n-chip" data-size="16">S</button>
          <button type="button" class="n-chip is-active" data-size="20">M</button>
          <button type="button" class="n-chip" data-size="28">L</button>
        </div>
        <input class="n-range" data-range="size" type="range" min="6" max="320" step="1" value="20" aria-label="Tamaño exacto" />
        <p class="n-hint">Presets 16 / 20 / 28. El slider baja a 6px y llega a 320px (16×).</p>
        <div class="n-sub">Alineación</div>
        <div class="n-row n-row--tight" data-align></div>
        <div class="n-sub">Estilo de letra</div>
        <div class="n-row n-row--tight" data-tstyle-row>
          <button type="button" class="n-chip is-active" data-tstyle="fill">relleno</button>
          <button type="button" class="n-chip" data-tstyle="outline">outline</button>
          <button type="button" class="n-chip" data-tstyle="thick">grueso</button>
        </div>
        <div class="n-sub" data-tstroke-label hidden>Grosor del trazo <span class="n-group__val" data-val="tstroke">3px</span></div>
        <input class="n-range" data-range="tstroke" type="range" min="1" max="20" step="1" value="3" hidden aria-label="Grosor del trazo del texto" />
        <div class="n-row n-row--tight" data-tformat-row>
          <button type="button" class="n-chip" data-tformat="bold" title="Negrita"><b>N</b></button>
          <button type="button" class="n-chip" data-tformat="italic" title="Cursiva"><i>K</i></button>
          <button type="button" class="n-chip" data-tformat="underline" title="Subrayado"><u>S</u></button>
        </div>
        <button type="button" class="n-pill" data-text-apply>Convertir a imagen con ese estilo</button>
        <p class="n-hint">El motor no dibuja contorno, negrita, cursiva ni subrayado de letras nativamente, así que <b>estos cuatro rasterizan</b>: el texto pasa a ser una imagen y deja de ser editable/justificable (Ctrl+Z lo deshace). Usalos al final, cuando el texto ya esté como querés.</p>

        <div class="n-sub">Caja de fondo (se mantiene editable)</div>
        <div class="n-sub" data-tradius-label>Radius de la caja <span class="n-group__val" data-val="tradius">12px</span></div>
        <input class="n-range" data-range="tradius" type="range" min="0" max="40" step="1" value="12" aria-label="Radius de la caja de fondo" />
        <div class="n-sub">Padding <span class="n-group__val" data-val="tpad">14px</span></div>
        <input class="n-range" data-range="tpad" type="range" min="0" max="60" step="1" value="14" aria-label="Padding de la caja de fondo" />
        <button type="button" class="n-pill n-pill--solid" data-tbox-apply>Poner caja detrás del texto</button>
        <p class="n-hint">Esto NO rasteriza: crea un rectángulo real detrás del texto, con tu color de trazo de fondo, y los agrupa. El texto sigue siendo texto — lo seguís justificando y editando, y la caja la retocás (color, borde, radius) con el panel de arriba como cualquier otra forma.</p>
      </div>

      <div class="n-sect" data-sect="radius">
        <div class="n-flyout__title">Radius <span data-val="radius">32px</span></div>
        <div class="n-row n-row--tight">
          <button type="button" class="n-chip" data-radius="sharp">recto</button>
          <button type="button" class="n-chip is-active" data-radius="round">redondo</button>
          <button type="button" class="n-chip" data-radius-max>máximo</button>
        </div>
        <div class="n-scale"><span>recto</span><span>máximo</span></div>
        <input class="n-range" data-range="radius" type="range" min="0" max="600" step="2" value="32" aria-label="Cantidad de radius" />
        <p class="n-hint">El motor topea el radio en el <b>25% del lado corto</b> — pasado ese punto, subir px ya no cambia nada. <b>Máximo</b> le da a cada elemento su tope exacto. Para un círculo de verdad, usá la elipse.</p>
      </div>

      <div class="n-sect" data-sect="mask">
        <div class="n-flyout__title">Máscara</div>
        <button type="button" class="n-pill n-pill--solid" data-mask-apply>Usar forma seleccionada como máscara…</button>
        <p class="n-hint">Dibujá y cerrá una forma (pincel, elipse, rectángulo…), pintale un <b>Background</b> para que quede rellena, seleccionala y tocá este botón para elegir una imagen nueva — o, si ya tenés una foto pegada en el lienzo, seleccioná forma + foto juntas con <b>Shift</b> y se recorta esa misma, sin picker. La forma original queda intacta para volver a usarla.</p>
        <input type="file" accept="image/*" data-mask-input hidden />

        <div class="n-sub">Recorte con trazo — collage</div>
        <div class="n-row n-row--tight" data-cut-row>
          <button type="button" class="n-chip" data-cut="inside" title="Deja solo lo que quedó adentro del trazo">
            <svg viewBox="0 0 24 24" class="n-chip__icon"><circle cx="6" cy="6" r="2.4"/><circle cx="6" cy="18" r="2.4"/><path d="M8 7.5L20 18M8 16.5L20 6"/></svg>
            recortar
          </button>
          <button type="button" class="n-chip" data-cut="outside" title="Borra lo de adentro del trazo y deja el resto">
            <svg viewBox="0 0 24 24" class="n-chip__icon"><rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><circle cx="12" cy="12" r="4.5" stroke-dasharray="2.4 2"/></svg>
            borrar adentro
          </button>
        </div>
        <p class="n-hint">Como el lazo de Photoshop. Dibujá el contorno con el lápiz alrededor de lo que querés (no hace falta cerrarlo perfecto, se cierra solo), seleccioná <b>el trazo + la foto</b> con Shift, y elegí: <b>recortar</b> deja solo lo de adentro, <b>borrar adentro</b> lo perfora. Usa los puntos reales del trazo, así que el borde sale exacto, no depende del grosor.</p>
      </div>

      <div class="n-sect" data-sect="capas">
        <div class="n-flyout__title">Capas y grupos</div>
        <p class="n-hint">Seleccioná varios elementos y agrupalos con <b>Ctrl+G</b> (nativo del motor) para que aparezcan acá con su miniatura. Clic en una fila selecciona y centra ese grupo; el nombre es tuyo, se guarda con la clase.</p>
        <div class="n-layers" data-layers></div>
      </div>
        </div>
      </div>

      <div class="notas-studio__status">
        <span class="n-live" title="Duración de la clase">
          <i class="n-live__dot"></i><b data-clock>0:00</b>
        </span>
        <span class="n-live" title="Centímetros de pincel">
          <b data-brush>0 cm</b>
        </span>
        <b data-status>listo</b>
      </div>

      <!-- closing card: the class report -->
      <div class="n-report" data-report hidden>
        <div class="n-report__card">
          <div class="n-report__lockup">
            <b>South Hustles</b><span>estudio creativo</span>
          </div>
          <h3 class="n-report__title">Clase terminada</h3>
          <div class="n-report__stats">
            <div class="n-stat">
              <span class="n-stat__val" data-r-time>0:00</span>
              <span class="n-stat__key">duración</span>
            </div>
            <div class="n-stat">
              <span class="n-stat__val" data-r-brush>0</span>
              <span class="n-stat__key">cm de pincel</span>
            </div>
            <div class="n-stat">
              <span class="n-stat__val" data-r-els>0</span>
              <span class="n-stat__key">elementos</span>
            </div>
          </div>
          <input class="notas-title n-report__name" data-r-name type="text" placeholder="nombre de la clase" aria-label="Nombre de la clase" />
          <div class="n-report__acts">
            <button type="button" class="n-pill" data-r-back>Seguir en clase</button>
            <button type="button" class="n-pill n-pill--ghost" data-r-discard>Cerrar sin guardar</button>
            <button type="button" class="n-pill n-pill--solid" data-r-save>Guardar y cerrar</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(el);
    /* Hard reference, captured once. React evicts this node from the DOM
       every time it rebuilds the Island, so it can never be recovered
       with querySelector — the node keeps its listeners while detached. */
    panelNode = el.querySelector('[data-panel]');

    el.querySelectorAll('.n-pill').forEach((b) => {
      b.setAttribute('data-magnetic', '');
      b.setAttribute('data-dirfill', '');
    });
    initDirectionalButtons();
    initMagneticButtons();

    return el;
  };

  /* ═══════ engine helpers ═══════ */
  const api = () => engine?.api || null;

  const patchAppState = (patch) => {
    const a = api(); if (!a) return;
    a.updateScene({ appState: patch });
  };

  const selectedIds = () => {
    const a = api(); if (!a) return [];
    const sel = a.getAppState().selectedElementIds || {};
    return Object.keys(sel).filter((k) => sel[k]);
  };

  const patchSelected = (fn) => {
    const a = api(); if (!a) return 0;
    const ids = new Set(selectedIds());
    if (!ids.size) return 0;
    const next = a.getSceneElements().map((el) => {
      if (!ids.has(el.id)) return el;
      const changes = fn(el);
      if (!changes) return el;
      return {
        ...el, ...changes,
        version: (el.version || 1) + 1,
        versionNonce: Math.floor(Math.random() * 2 ** 31),
        updated: Date.now(),
      };
    });
    a.updateScene({ elements: next });
    return ids.size;
  };

  const setStatus = (msg) => {
    const s = studio?.querySelector('[data-status]');
    if (s) s.textContent = msg;
  };

  /* mountNotas hands this the live (elements, appState, files) on every
     change. Sync is immediate — colour/width/opacity must move the
     instant you touch a native control. Saving stays debounced. */
  const scheduleSave = (elements, appState) => {
    /* THE most important try/catch in this file. This function IS the
       engine's onChange, so it executes inside React's componentDidUpdate.
       Anything that throws here propagates into React's update cycle and
       kills the canvas — the editor goes blank/frozen and only F5 brings
       it back, with the drawing still safe in memory but unreachable.
       Our panel-syncing code queries DOM that React legitimately evicts
       and re-creates underneath us, so a null slipping through is a
       question of when, not if. Swallow it loudly (console) but never let
       it cross back into the engine. The debounced save is deliberately
       OUTSIDE the catch — persistence must run even if a UI sync failed. */
    try {
      syncFromEngine(appState, elements);
      autoWrapPastes(elements);
      syncSections();
      scheduleFrameBars(elements, appState);
    } catch (err) {
      console.error('[notas] sync de panel falló (el lienzo sigue vivo)', err);
    }
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try { persist(false); refreshBrush(); renderLayers(); } catch (err) {
        console.error('[notas] guardado/refresh falló', err);
      }
    }, 900);
  };

  /* ═══════ floating per-frame toolbar ═══════
     Each "mesa de trabajo" carries its own Export / Resize buttons pinned
     to its top-left, right where the engine draws the frame's name label,
     so the actions travel with the window instead of living in a far-away
     top bar. These are plain DOM nodes positioned over the canvas (never
     inside React's tree — same sibling rule as the texture overlay), so
     they have to be re-placed on every scene change, pan and zoom.

     Excalidraw exposes viewportCoordsToSceneCoords but not the inverse,
     so invert its own transform by hand: scene → viewport is
     (scene + scroll) * zoom, with our canvas at inset:0 so there is no
     extra container offset to add. */
  const frameBarHost = () => {
    let host = studio?.querySelector('[data-frame-bars]');
    if (!host && studio) {
      host = document.createElement('div');
      host.className = 'n-framebars';
      host.setAttribute('data-frame-bars', '');
      studio.appendChild(host);
    }
    return host;
  };

  /* onChange fires for every pointer sample while a stroke is being drawn
     — especially inside a frame, where the engine also re-evaluates frame
     membership. Running the full bar re-layout on each of those was piling
     DOM work onto the drawing hot path. Collapse it to at most one run per
     animation frame, always using the latest data. */
  let frameBarsRaf = 0;
  let frameBarsPending = null;
  const scheduleFrameBars = (elements, appState) => {
    frameBarsPending = { elements, appState };
    if (frameBarsRaf) return;
    frameBarsRaf = requestAnimationFrame(() => {
      frameBarsRaf = 0;
      const p = frameBarsPending;
      frameBarsPending = null;
      if (p) renderFrameBars(p.elements, p.appState);
    });
  };

  const renderFrameBars = (elements, appState) => {
    const host = frameBarHost();
    if (!host || !appState) return;
    const frames = (elements || []).filter((el) => el.type === 'frame' && !el.isDeleted);
    if (!frames.length) { host.innerHTML = ''; return; }
    const zoom = appState.zoom?.value || 1;
    const sx = appState.scrollX || 0;
    const sy = appState.scrollY || 0;

    // reuse existing nodes where possible so buttons stay clickable
    // mid-interaction instead of being torn down under the pointer
    const seen = new Set();
    frames.forEach((f) => {
      seen.add(f.id);
      let bar = host.querySelector(`[data-frame-bar="${f.id}"]`);
      if (!bar) {
        bar = document.createElement('div');
        bar.className = 'n-framebar';
        bar.dataset.frameBar = f.id;
        bar.innerHTML =
          `<button type="button" class="n-framebar__move" data-frame-move="${f.id}" title="Arrastrame para mover la mesa con todo lo que tiene adentro" aria-label="Mover la mesa">` +
            `<svg viewBox="0 0 24 24"><path d="M12 3v18M3 12h18"/><path d="M12 3l-2.6 2.8M12 3l2.6 2.8M12 21l-2.6-2.8M12 21l2.6-2.8"/><path d="M3 12l2.8-2.6M3 12l2.8 2.6M21 12l-2.8-2.6M21 12l2.8 2.6"/></svg>` +
          `</button>` +
          `<span class="n-framebar__name" data-frame-name="${f.id}" role="button" tabindex="0" title="Clic para renombrar la mesa"></span>` +
          `<button type="button" class="n-framebar__btn" data-frame-export="${f.id}">Export</button>` +
          `<button type="button" class="n-framebar__btn n-framebar__btn--alt" data-frame-resize="${f.id}">Resize</button>` +
          `<button type="button" class="n-framebar__btn n-framebar__btn--rule" data-frame-rule="${f.id}" title="Arrastrá desde un borde hacia adentro para tirar una regla">Regla</button>` +
          `<button type="button" class="n-framebar__close" data-frame-close="${f.id}" title="Cerrar la mesa de trabajo" aria-label="Cerrar la mesa">` +
            `<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>` +
          `</button>`;
        host.appendChild(bar);
      }
      const nameEl = bar.querySelector('.n-framebar__name');
      const label = f.name || 'mesa';
      if (nameEl.textContent !== label) {
        nameEl.textContent = label;
        bar._shSize = null;   // label width changed, re-measure once below
      }
      const vx = (f.x + sx) * zoom;
      const vy = (f.y + sy) * zoom;
      const fw = f.width * zoom;
      const fh = f.height * zoom;
      // hide entirely when its frame is scrolled out of sight, otherwise
      // the bars pile up in a corner pointing at nothing
      const offscreen = vx + fw < 0 || vx > window.innerWidth || vy + fh < 0 || vy > window.innerHeight;
      const display = offscreen ? 'none' : 'flex';
      if (bar.style.display !== display) bar.style.display = display;
      if (offscreen) return;
      /* Measure ONCE and cache. offsetWidth/offsetHeight force a
         synchronous reflow, and this function runs on every single
         onChange — which fires continuously while drawing. Reading them
         inside the loop (right after writing styles) was thrashing layout
         dozens of times per second and is what made the studio freeze up
         and need an F5. The size only changes when the label does. */
      if (!bar._shSize) {
        bar._shSize = { w: bar.offsetWidth || 200, h: bar.offsetHeight || 26 };
      }
      const { w: barW, h: barH } = bar._shSize;
      // clamp into the visible area: a frame taller than the viewport (or
      // scrolled so its top edge is above it) would otherwise park its
      // toolbar off-screen where it can never be clicked. 68px keeps it
      // clear of the studio's own top bar.
      const left = clamp(vx, 8, Math.max(8, window.innerWidth - barW - 8));
      const top = clamp(vy - (barH + 4), 68, Math.max(68, window.innerHeight - barH - 8));
      const l = `${left}px`, t = `${top}px`;
      if (bar.style.left !== l) bar.style.left = l;
      if (bar.style.top !== t) bar.style.top = t;
    });
    host.querySelectorAll('[data-frame-bar]').forEach((b) => {
      if (!seen.has(b.dataset.frameBar)) b.remove();
    });
  };

  const persist = (loud = true) => {
    const a = api();
    if (!a || !current) return;
    const files = a.getFiles();
    const fileIds = Object.keys(files);
    // fire-and-forget: the blobs go to IndexedDB, only their ids ride in
    // the JSON that lands in localStorage
    if (fileIds.length) {
      idbPutFiles(files).catch((err) => console.warn('[notas] no se pudieron guardar las imágenes', err));
    }
    current.scene = { elements: a.getSceneElements(), fileIds };
    current.name = studio.querySelector('[data-notas-title]').value.trim() || 'sin título';
    current.updatedAt = new Date().toISOString();
    current.accent = state.color;
    current.background = { ...state.bg };
    // remember where the camera was left, so reopening a class drops you
    // back exactly where you were working instead of at scene origin
    const camState = a.getAppState();
    current.camera = {
      scrollX: camState.scrollX || 0,
      scrollY: camState.scrollY || 0,
      zoom: camState.zoom?.value || 1,
    };
    current.durationMs = elapsedMs();
    current.brushCm = Number(brushCm().toFixed(2));
    current.excerpt = textExcerpt(current.scene.elements);
    const i = notes.findIndex((n) => n.id === current.id);
    if (i > -1) notes[i] = current; else notes.push(current);
    const ok = saveAll(notes);
    renderList();
    setStatus(ok ? `guardado ${new Date().toLocaleTimeString()}` : 'error al guardar');
    if (loud && !ok) window.alert('No se pudo guardar: el almacenamiento del navegador está lleno.\nExportá a JSON para no perder la nota.');
  };

  /* Closing is a two-step: the report card first (duración, cm de
     pincel, elementos), then the actual close. "Seguir en clase"
     resumes the same session — the clock keeps its banked time. */
  const askClose = () => {
    const a = api(); if (!a) { hardClose(); return; }
    hideFlyout();
    // bank the running time so the card and a resume both stay honest
    state.baseMs = elapsedMs();
    state.startedAt = 0;
    clearInterval(state.clockTimer);

    const els = a.getSceneElements().filter((e) => !e.isDeleted);
    studio.querySelector('[data-r-time]').textContent = fmtClock(state.baseMs);
    studio.querySelector('[data-r-brush]').textContent = brushCm().toFixed(1);
    studio.querySelector('[data-r-els]').textContent = String(els.length);
    studio.querySelector('[data-r-name]').value =
      studio.querySelector('[data-notas-title]').value;
    studio.querySelector('[data-report]').hidden = false;
    // render the banner into current.preview so it's ready the moment
    // "Guardar y cerrar" is pressed — deliberately NOT persisted here,
    // so "Cerrar sin guardar" actually means nothing gets written
    snapshot();
  };

  const resumeClass = () => {
    studio.querySelector('[data-report]').hidden = true;
    state.startedAt = Date.now();
    clearInterval(state.clockTimer);
    state.clockTimer = setInterval(tickClock, 1000);
  };

  const hardClose = () => {
    clearInterval(state.clockTimer);
    state.startedAt = 0;
    hideFlyout();
    if (studio.querySelector('[data-report]')) studio.querySelector('[data-report]').hidden = true;
    studio.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    document.documentElement.style.overflow = '';
    studio.querySelectorAll('video').forEach((v) => v.pause());
  };

  /** render the class to a card-sized thumbnail and store it on the nota */
  const snapshot = async () => {
    const a = api();
    if (!a || !current) return;
    const els = a.getSceneElements().filter((e) => !e.isDeleted);
    if (!els.length) { current.preview = null; return; }
    try {
      const mod = await loadBundle();
      const blob = await mod.exportToBlob?.({
        elements: els,
        files: a.getFiles(),
        appState: { ...a.getAppState(), exportBackground: false, exportPadding: 24 },
        mimeType: 'image/png',
      });
      // bake the thumbnail on the class's OWN surface colour, read live
      // from the studio's resolved token, so a cream class looks cream
      const surfaceBg = (getComputedStyle(studio).getPropertyValue('--n-bg') || '').trim();
      if (blob) current.preview = await blobToThumb(blob, 520, surfaceBg || '#101012');
    } catch (err) {
      console.warn('[notas] preview', err);
    }
  };

  const closeStudio = () => {
    persist(false);
    hardClose();
  };

  /* ═══════ background ═══════ */
  let cfTimer = null;
  const startCrossfade = () => {
    clearInterval(cfTimer);
    const vids = [...studio.querySelectorAll('.notas-studio__bg video')];
    let i = 0;
    vids.forEach((v, k) => v.classList.toggle('is-live', k === 0));
    cfTimer = setInterval(() => {
      if (state.bg.clip !== 'both' || !studio.classList.contains('is-open')) return;
      i = (i + 1) % vids.length;
      vids.forEach((v, k) => v.classList.toggle('is-live', k === i));
    }, 8000);
  };

  const applyBg = (bg) => {
    state.bg = { ...defaultBg(), ...bg };
    const b = state.bg, s = studio.style;
    s.setProperty('--n-wash', b.wash);
    s.setProperty('--n-wash-amt', String(b.washAmount));
    s.setProperty('--n-scrim', String(b.scrim));
    studio.dataset.surface = b.surface;

    /* video only runs on the video surface — a paused clip behind an
       opaque paper is wasted decode work */
    const vids = [...studio.querySelectorAll('.notas-studio__bg video')];
    const [va, vb] = vids;
    const on = (v, yes) => {
      v.classList.toggle('is-live', yes);
      if (yes) v.play?.().catch(() => {}); else v.pause?.();
    };
    if (b.surface !== 'video') {
      vids.forEach((v) => on(v, false));
      clearInterval(cfTimer);
    } else if (b.clip === 'a') { on(va, true); on(vb, false); clearInterval(cfTimer); }
    else if (b.clip === 'b') { on(va, false); on(vb, true); clearInterval(cfTimer); }
    else if (b.clip === 'none') { vids.forEach((v) => on(v, false)); clearInterval(cfTimer); }
    else { startCrossfade(); }

  };


  /* A live sample of the brush: colour, width, opacity and smoothing all
     rendered through the SAME smoothPoints() the canvas uses, so what you
     see in the panel is what the stroke will do. */
  const drawBrushSample = (cv) => {
    if (!cv) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = cv.clientWidth || 272;
    const h = cv.clientHeight || 78;
    cv.width = w * dpr; cv.height = h * dpr;
    const g = cv.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);

    // a jittery hand-drawn sample path
    const raw = [];
    for (let i = 0; i <= 48; i++) {
      const t = i / 48;
      const x = 10 + t * (w - 20);
      const jitter = Math.sin(t * 22) * 3.2 + Math.sin(t * 7.3) * 2.1;
      raw.push([x, h / 2 + Math.sin(t * Math.PI * 1.6) * (h / 3.4) + jitter]);
    }
    const pts = smoothPoints(raw, state.smooth / 100);
    const color = state.color, op = state.opacity / 100, size = Math.max(1, state.stroke);

    // route through the SAME per-brush renderers the real overlay uses,
    // so the strip actually shows what each texture brush draws — it
    // used to always paint one plain stroke no matter which brush was
    // armed, which read as "nothing I pick ever changes anything"
    const glyphStep = Math.max(2, Math.round(6 / clamp(state.density / 50, 0.3, 2.5)));
    switch (state.brush) {
      case 'aerosol':
        for (let i = 1; i < pts.length; i++) sprayDab(g, pts[i][0], pts[i][1], size * 2.2, state.density * 0.4, state.tilt, color, op);
        break;
      case 'dither':
        for (let i = 1; i < pts.length; i += 2) ditherDab(g, pts[i][0], pts[i][1], size * 2.2, color, op, state.density);
        break;
      case 'ink':
        for (let i = 1; i < pts.length; i++) inkSegment(g, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], size, color, op);
        break;
      case 'noise':
        for (let i = 1; i < pts.length; i++) plainSegment(g, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], size * 1.5, color, op);
        applyGrain(g, w, h, 0.45);
        break;
      case 'vhs':
        // same tint/offset scheme as vhsSplit() at commit time, drawn
        // directly instead of compositing three canvases — cheap and
        // visually equivalent for a small sample strip
        for (let i = 1; i < pts.length; i++) {
          plainSegment(g, pts[i - 1][0] - 2, pts[i - 1][1], pts[i][0] - 2, pts[i][1], size * 1.5, '#ff2b55', op * 0.7);
          plainSegment(g, pts[i - 1][0] + 2, pts[i - 1][1], pts[i][0] + 2, pts[i][1], size * 1.5, '#26e0ff', op * 0.7);
          plainSegment(g, pts[i - 1][0], pts[i - 1][1] + 1.2, pts[i][0], pts[i][1] + 1.2, size * 1.5, '#3dff8a', op * 0.7);
        }
        break;
      case 'ascii': {
        const src = state.asciiText.trim() || ASCII_CHARS;
        g.font = `${Math.max(10, size * 3)}px Cascadia, monospace`;
        g.fillStyle = color; g.globalAlpha = op; g.textAlign = 'center'; g.textBaseline = 'middle';
        for (let i = 0; i < pts.length; i += glyphStep) g.fillText(src[Math.round(i / glyphStep) % src.length], pts[i][0], pts[i][1]);
        g.globalAlpha = 1;
        break;
      }
      case 'stamp':
        if (stampImgRef) {
          for (let i = 0; i < pts.length; i += glyphStep) {
            const sw = size * 2.4, sh = sw * (stampImgRef.height / stampImgRef.width || 1);
            g.globalAlpha = op;
            g.drawImage(stampImgRef, pts[i][0] - sw / 2, pts[i][1] - sh / 2, sw, sh);
          }
          g.globalAlpha = 1;
        }
        break;
      case 'liquid':
        for (let i = 1; i < pts.length; i += 2) liquidDab(g, pts[i][0], pts[i][1], size * 2.4, color, op, state.density);
        break;
      case 'sumi':
        for (let i = 1; i < pts.length; i++) {
          const dd = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
          const taper = clamp(1.5 - dd / 4, 0.3, 1.5);
          sumiSegment(g, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], size, color, op, taper);
        }
        break;
      case 'nodo': {
        const trail = [];
        for (let i = 0; i < pts.length; i += 3) {
          nodeDab(g, pts[i][0], pts[i][1], size * 1.3, color, op, trail);
          trail.push(pts[i]);
          if (trail.length > 10) trail.shift();
        }
        break;
      }
      case 'pixel':
        for (let i = 0; i < pts.length; i += 2) pixelDab(g, pts[i][0], pts[i][1], size * 2, color, op, pixelRoundedRef);
        break;
      case 'iris':
        for (let i = 1; i < pts.length; i += 2) irisDab(g, pts[i][0], pts[i][1], size * 1.6, color, op);
        break;
      default:
        g.globalAlpha = op;
        g.strokeStyle = color;
        g.lineWidth = size;
        g.lineCap = 'round';
        g.lineJoin = 'round';
        g.beginPath();
        g.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
        g.stroke();
        g.globalAlpha = 1;
    }
  };

  /* Repaints every live sample of the armed brush: the one inside the
     panel AND the always-on HUD under the dock, plus the HUD's name,
     icon and colour chip. Called from every place that changes colour,
     width, opacity, smoothing, density or brush, so the HUD can never
     drift out of sync with what the next stroke will actually do. */
  const paintBrushPreview = () => {
    // the dock's "Trazo y color" button icon is a currentColor circle —
    // tinting it live makes the armed colour readable even with the HUD
    // scrolled out of view
    const optTrazo = studio?.querySelector('[data-opt="trazo"]');
    if (optTrazo) optTrazo.style.color = state.color;

    const brush = BRUSHES.find((x) => x.id === state.brush) || BRUSHES[0];
    const nameEl = studio?.querySelector('[data-hud-name]');
    if (nameEl) nameEl.textContent = (brush.label || 'Vectorial').toUpperCase();
    const iconEl = studio?.querySelector('[data-hud-icon]');
    if (iconEl && iconEl.dataset.for !== brush.id) {
      iconEl.dataset.for = brush.id;
      iconEl.innerHTML = `<svg viewBox="0 0 24 24">${brush.svg}</svg>`;
    }
    const swatchEl = studio?.querySelector('[data-hud-swatch]');
    if (swatchEl) swatchEl.style.background = state.color;

    drawBrushSample(studio?.querySelector('[data-brush-preview]'));
    drawBrushSample(studio?.querySelector('[data-hud-preview]'));
  };

  /* ═══════ colour ═══════ */

  /* DOM-only: paints state.color/hue/sat/lit onto the bars, the hex label
     and the brush preview. Never touches the engine — this is what
     syncFromEngine calls so reading a colour back can never re-trigger
     the very onChange that asked us to read it. */
  /* Look in the panel's HARD reference first, then the studio. React
     evicts the grafted panel node from the document on its own re-renders
     (see graftIntoIsland) — while it is detached, `studio.querySelector`
     finds nothing, but querying the detached node itself still works.
     Every lookup here is null-guarded regardless: renderColorUI runs
     inside syncFromEngine, which runs inside the engine's onChange, i.e.
     inside React's componentDidUpdate. An unguarded `null.textContent`
     there throws *through* React's update cycle and takes the whole
     canvas down — that is the "se rompe el visor, tengo que tirar F5"
     crash, caught red-handed in a real stack trace. */
  const findUI = (sel) => panelEl()?.querySelector(sel) || studio?.querySelector(sel) || null;

  const renderColorUI = () => {
    if (!studio) return;
    const s = studio.style;
    s.setProperty('--n-current', state.color);
    s.setProperty('--n-h', String(state.hue));
    s.setProperty('--n-s', `${state.sat}%`);
    const hex = state.color.toUpperCase();
    const previewHex = findUI('[data-preview-hex]');
    if (previewHex) previewHex.textContent = hex;
    const trazoVal = findUI('[data-sect="trazo"] [data-val="color"]');
    if (trazoVal) trazoVal.textContent = hex;
    const kHue = findUI('[data-knob="hue"]');
    if (kHue) kHue.style.left = `${(state.hue / 360) * 100}%`;
    const kSat = findUI('[data-knob="sat"]');
    if (kSat) kSat.style.left = `${state.sat}%`;
    const kLit = findUI('[data-knob="lit"]');
    if (kLit) kLit.style.left = `${state.lit}%`;
    paintBrushPreview();
  };

  /* interactive path: our sliders/eyedropper change the colour AND push
     it into the engine (current tool default + whatever is selected) */
  const pushColor = () => {
    state.color = hsl2hex(state.hue, state.sat, state.lit);
    renderColorUI();
    patchAppState({ currentItemStrokeColor: state.color });
    patchSelected(() => ({ strokeColor: state.color }));
  };

  /* ═══════ engine → panel (the sync that was missing) ═══════
     Every onChange — including clicks on Excalidraw's OWN native Stroke
     swatches, its Stroke width buttons, its Opacity slider, font picker
     and text-align buttons — lands here. We read what actually changed
     and mirror it into our sliders/knobs/preview. Nothing here calls
     patchAppState/patchSelected, so it can never loop back into itself. */
  const syncFromEngine = (appState, elements) => {
    if (!studio || !appState) return;
    const selIds = Object.keys(appState.selectedElementIds || {}).filter(
      (k) => appState.selectedElementIds[k],
    );
    const first = selIds.length
      ? (elements || []).find((e) => e.id === selIds[0] && !e.isDeleted)
      : null;

    const color = first?.strokeColor ?? appState.currentItemStrokeColor;
    if (typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color) && color.toLowerCase() !== state.color.toLowerCase()) {
      const { h, s, l } = hex2hsl(color);
      state.hue = h; state.sat = s; state.lit = l; state.color = color;
      renderColorUI();
    }

    const width = first?.strokeWidth ?? appState.currentItemStrokeWidth;
    if (typeof width === 'number' && width !== state.stroke) {
      state.stroke = width;
      const r = studio.querySelector('[data-range="stroke"]');
      if (r) r.value = String(width);
      const lbl = studio.querySelector('[data-val="stroke"]');
      if (lbl) lbl.textContent = `${width}px`;
      paintBrushPreview();
    }

    const op = first?.opacity ?? appState.currentItemOpacity;
    if (typeof op === 'number' && op !== state.opacity) {
      state.opacity = op;
      const r = studio.querySelector('[data-range="opacity"]');
      if (r) r.value = String(op);
      const lbl = studio.querySelector('[data-val="opacity"]');
      if (lbl) lbl.textContent = `${op}%`;
      paintBrushPreview();
    }

    const font = first?.fontFamily ?? appState.currentItemFontFamily;
    if (typeof font === 'number' && font !== state.font) {
      state.font = font;
      studio.querySelectorAll('[data-font]').forEach((b) =>
        b.classList.toggle('is-active', Number(b.dataset.font) === font));
    }

    const size = first?.fontSize ?? appState.currentItemFontSize;
    if (typeof size === 'number' && size !== state.size) {
      state.size = size;
      const r = studio.querySelector('[data-range="size"]');
      if (r) r.value = String(size);
      const l1 = studio.querySelector('[data-sect="texto"] [data-val="size"]');
      const l2 = studio.querySelector('[data-val="size2"]');
      if (l1) l1.textContent = `${size}px`;
      if (l2) l2.textContent = `${size}px`;
      studio.querySelectorAll('[data-size-presets] .n-chip').forEach((c) =>
        c.classList.toggle('is-active', Number(c.dataset.size) === size));
    }

    const align = first?.textAlign ?? appState.currentItemTextAlign;
    if (typeof align === 'string' && align !== state.align) {
      state.align = align;
      studio.querySelectorAll('[data-align] .n-chip').forEach((b) =>
        b.classList.toggle('is-active', b.dataset.align === align));
    }
  };

  /* pasted paragraphs land as a single ever-growing horizontal line
     (Excalidraw's point-text default). Anything NEW, untethered to a
     container, still auto-resizing and wider than our wrap column gets
     re-wrapped into a real paragraph box — width fixed, text re-flowed
     with our own word-wrap (see wrapParagraph — the engine's internal
     wrapText is private, not reachable from outside). */
  const autoWrapPastes = (elements) => {
    const a = api(); if (!a) return;
    let touched = false;
    const next = (elements || []).map((el) => {
      const isNew = !knownIds.has(el.id);
      if (
        isNew && el.type === 'text' && !el.containerId &&
        el.autoResize !== false && el.width > WRAP_WIDTH
      ) {
        touched = true;
        return {
          ...el,
          text: wrapParagraph(el.originalText || el.text, el.fontSize, el.fontFamily),
          width: WRAP_WIDTH,
          autoResize: false,
          version: (el.version || 1) + 1,
          versionNonce: Math.floor(Math.random() * 2 ** 31),
          updated: Date.now(),
        };
      }
      return el;
    });
    knownIds = new Set((elements || []).map((e) => e.id));
    if (touched) a.updateScene({ elements: next });
  };

  /* ═══════ the one panel ═══════ */

  /* ── OUR CONTROLS, INSIDE EXCALIDRAW'S PANEL ──
     Franco: "era meter nuestras configuraciones en los de excalidrew
     draggeables".

     The safe way to do that is to APPEND our sections as the last child
     of the stock Island — never to re-parent the Island itself. Moving a
     React-owned node makes React insert later siblings into the old
     parent and throw (NotFoundError on insertBefore), which tears down
     the canvas; that is what broke drawing. Appending an extra trailing
     child leaves React's own children untouched. React may still drop it
     on a re-render, so an observer puts it back. */
  const graftIntoIsland = () => {
    const mount = studio.querySelector('[data-notas-canvas]');
    const island = mount.querySelector('.App-menu__left');
    const body = panelNode;
    if (!body) return;
    if (!island) { body.dataset.grafted = ''; return; }
    if (island.contains(body)) return;
    observer?.disconnect();
    island.appendChild(body);          // same node, listeners intact
    body.dataset.grafted = '1';
    makeIslandDraggable(island);
    observer?.observe(mount, { childList: true, subtree: true });
  };

  /* Dragging mutates inline style only — no DOM structure, so React
     never notices. The grip is injected once, also as a trailing child. */
  const makeIslandDraggable = (island) => {
    const host = island.closest('.App-menu__left') || island;
    if (host.dataset.shDrag === '1') return;
    host.dataset.shDrag = '1';
    host.classList.add('sh-draggable');

    const grip = document.createElement('div');
    grip.className = 'sh-island-grip';
    grip.title = 'Arrastrame';
    grip.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="9" cy="6" r="1.4"/><circle cx="15" cy="6" r="1.4"/><circle cx="9" cy="12" r="1.4"/><circle cx="15" cy="12" r="1.4"/><circle cx="9" cy="18" r="1.4"/><circle cx="15" cy="18" r="1.4"/></svg><span>propiedades</span>';
    island.insertBefore(grip, island.firstChild);

    let drag = false, ox = 0, oy = 0;
    const place = (x, y) => {
      const r = host.getBoundingClientRect();
      host.style.position = 'fixed';
      host.style.left = `${clamp(x, 6, window.innerWidth - r.width - 6)}px`;
      host.style.top = `${clamp(y, 68, Math.max(68, window.innerHeight - 80))}px`;
      host.style.margin = '0';
    };
    try {
      const saved = JSON.parse(localStorage.getItem(LS_PANEL) || 'null');
      // no saved position yet (first time this Island gets grafted) means
      // it's still sitting wherever Excalidraw's own native layout put it
      // — which starts at roughly x:29, squarely inside our dock's own
      // x:20-78 footprint. Every button in the first ~50px of panel width
      // (which is most of the "Estilo de letra" row, since it starts flush
      // left) was unclickable — the dock, with higher effective z-index,
      // always won that overlap. Same safe default the CSS fallback for
      // the un-grafted floating state already uses (96, 92).
      requestAnimationFrame(() => place(saved ? saved.x : 96, saved ? saved.y : 92));
    } catch { /* first run */ }

    grip.addEventListener('pointerdown', (e) => {
      const r = host.getBoundingClientRect();
      drag = true; ox = e.clientX - r.left; oy = e.clientY - r.top;
      host.classList.add('is-dragging');
      grip.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    grip.addEventListener('pointermove', (e) => { if (drag) place(e.clientX - ox, e.clientY - oy); });
    const end = () => {
      if (!drag) return;
      drag = false;
      host.classList.remove('is-dragging');
      const r = host.getBoundingClientRect();
      try { localStorage.setItem(LS_PANEL, JSON.stringify({ x: r.left, y: r.top })); } catch {}
    };
    grip.addEventListener('pointerup', end);
    grip.addEventListener('pointercancel', end);
  };

  const startAdopting = () => {
    const mount = studio.querySelector('[data-notas-canvas]');
    observer = new MutationObserver(() => requestAnimationFrame(graftIntoIsland));
    observer.observe(mount, { childList: true, subtree: true });
    graftIntoIsland();
  };

  /* NEVER re-query this from the document: once React drops it, it is
     detached and querySelector returns null. The node keeps its listeners
     and state while detached, so we just re-append the same object. */
  const panelEl = () => panelNode;

  /* Show only the sections that belong to what is currently active, and
     hide our whole block when none apply — so opening a class shows just
     the dock, never a wall of unrelated controls. */
  const syncSections = () => {
    graftIntoIsland();                 // React may have just evicted us
    const p = panelEl();
    const a = api();
    if (!p || !a) return;
    const st = a.getAppState();
    const tool = st.activeTool?.type;
    const sel = new Set(
      Object.keys(st.selectedElementIds || {}).filter((k) => st.selectedElementIds[k]),
    );
    const kinds = new Set();
    if (tool && tool !== 'selection') kinds.add(tool);
    if (sel.size) {
      a.getSceneElements().forEach((el) => { if (sel.has(el.id)) kinds.add(el.type); });
    }
    // every section stays available; `kinds` only drives which dock
    // button reads as active, never what is shown.
    p.querySelectorAll('[data-sect]').forEach((sect) => { sect.hidden = false; });
    // Gating this purely on `openFlyout` (previous fix) stopped the panel
    // from popping open on every draw, but had a worse side effect: our
    // GRAFTED sections (Estilo de letra, Máscara, etc.) stayed invisible
    // even when the user selected something through completely normal
    // means (clicking an element, pasting text) — because Excalidraw's
    // OWN native panel shows itself automatically on selection regardless
    // of our `is-open` class, creating the illusion the panel was already
    // open while our custom controls underneath were still display:none.
    // Tying visibility to real selection state instead fixes both: it
    // opens the moment something is actually selected (not on every
    // freedraw stroke, which doesn't auto-select) and closes again the
    // moment nothing is — the standard properties-panel pattern.
    if (openFlyout || sel.size > 0) p.classList.add('is-open');
    else p.classList.remove('is-open');
    studio.querySelectorAll('[data-opt]').forEach((b) => {
      const tools = SECTION_TOOLS[b.dataset.opt] || [];
      b.classList.toggle('is-active', [...kinds].some((k) => tools.includes(k)));
    });
  };

  const hideFlyout = () => {
    if (!openFlyout) return;
    panelEl().classList.remove('is-open');
    studio.querySelectorAll('[data-opt]').forEach((b) => b.classList.remove('is-active'));
    openFlyout = null;
  };

  /* opening always parks the panel just right of the dock (or left of it
     when the dock is hugging the right edge), then scrolls to the section */
  const showFlyout = (id) => {
    graftIntoIsland();
    // arming the owning tool is what reveals the matching sections — but
    // it also clears selection, so grab it first (see preFlyoutSelection)
    const tool = OPT_TOOL[id];
    if (tool) {
      preFlyoutSelection = selectedIds();
      armToolRef?.(tool);
    }
    requestAnimationFrame(() => {
      syncSections();
      const sect = panelEl().querySelector(`[data-sect="${id}"]`);
      if (sect && !sect.hidden) {
        sect.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        sect.classList.remove('is-flash');
        void sect.offsetWidth;
        sect.classList.add('is-flash');
      }
    });
    openFlyout = id;
  };

  /* ═══════ background surface cycler ═══════ */
  const applySurface = (idx) => {
    const s = SURFACES[((idx % SURFACES.length) + SURFACES.length) % SURFACES.length];
    state.surfaceIdx = SURFACES.indexOf(s);
    const lbl = studio.querySelector('[data-act="surface"] [data-val="surface"]');
    if (lbl) lbl.textContent = s.label;
    // flip the default ink with the surface polarity, but never fight a
    // colour the user picked by hand
    if (state.drift || state.autoInk) {
      state.autoInk = true;
      if (s.dark && state.lit < 40) { state.hue = 260; state.sat = 8; state.lit = 96; pushColor(); }
      if (!s.dark && state.lit > 60) { state.hue = 240; state.sat = 6; state.lit = 10; pushColor(); }
    }
    patchAppState({ theme: s.dark ? 'dark' : 'light' });
    applyBg({ ...state.bg, surface: s.id });
  };

  /* ═══════ open ═══════
     `preloadedFiles` lets a fresh JSON import skip the IndexedDB round
     trip — we already have the actual blobs in hand from the file the
     user just picked. */
  async function openStudio(nota, preloadedFiles) {
    if (!studio) { studio = buildStudio(); wireStudio(); }
    current = nota;

    studio.classList.add('is-open');
    document.body.classList.add('menu-open');
    document.documentElement.style.overflow = 'hidden';
    studio.querySelector('[data-notas-title]').value = nota.name || '';
    studio.querySelector('[data-report]').hidden = true;
    applyBg(nota.background || defaultBg());
    setStatus('cargando motor…');

    /* reopening an old class resumes its banked time rather than
       restarting the clock from zero */
    state.baseMs = nota.durationMs || 0;
    state.startedAt = Date.now();
    clearInterval(state.clockTimer);
    state.clockTimer = setInterval(tickClock, 1000);
    tickClock();

    const mount = studio.querySelector('[data-notas-canvas]');
    observer?.disconnect();
    if (engine) { engine.unmount(); engine = null; mount.innerHTML = ''; }
    // seed with what's already on the page so autoWrapPastes only ever
    // reacts to elements that are genuinely new this session
    knownIds = new Set((nota.scene?.elements || []).map((e) => e.id));
    // same seeding for the smoothing guard — a freshly opened note (or one
    // just imported into) must never have its existing strokes reshaped
    smoothed = new Set((nota.scene?.elements || []).map((e) => e.id));

    let ready = false;
    const t0 = performance.now();
    /* the engine is a 10MB module; if it never signals ready, say so
       out loud instead of sitting on "cargando motor…" forever */
    const watchdog = setTimeout(() => {
      if (!ready) setStatus('el motor tarda demasiado — abrí la consola (F12)');
    }, 15000);

    try {
      // legacy inline shape (notes saved before this fix) still just works;
      // the lean shape fetches its blobs from IndexedDB
      const files = preloadedFiles
        || nota.scene?.files
        || (nota.scene?.fileIds?.length ? await idbGetFiles(nota.scene.fileIds) : {});
      const mod = await loadBundle();
      setStatus(`motor cargado en ${((performance.now() - t0) / 1000).toFixed(1)}s — montando…`);
      engine = mod.mountNotas(mount, {
        elements: nota.scene?.elements || [],
        files,
        onChange: scheduleSave,
        onReady: () => {
          ready = true;
          clearTimeout(watchdog);
          setStatus('en clase');
          patchAppState({ currentItemStrokeColor: state.color });
          refreshBrush();
          startAdopting();              // pull the stock island into our panel
          applySurface(state.surfaceIdx);
          paintBrushPreview();
          syncSections();               // starts closed; tools reveal it
          renderLayers();
          /* put the camera back where this class was left. Deliberately
             after the panel/surface work and on a later frame — the engine
             settles its own default scroll during mount, so restoring too
             early gets overwritten. */
          const cam = nota.camera;
          if (cam && Number.isFinite(cam.zoom) && cam.zoom > 0) {
            requestAnimationFrame(() => {
              try {
                api()?.updateScene({
                  appState: {
                    scrollX: cam.scrollX || 0,
                    scrollY: cam.scrollY || 0,
                    zoom: { value: cam.zoom },
                  },
                });
              } catch (err) { console.warn('[notas] no se pudo restaurar la cámara', err); }
            });
          }
        },
      });
    } catch (err) {
      clearTimeout(watchdog);
      console.error('[notas] el motor no cargó', err);
      setStatus(`no cargó: ${err?.message || err}`);
    }
  }

  /* ═══════ wiring ═══════ */
  function wireStudio() {
    const dock = studio.querySelector('[data-dock]');

    /* Panels are for configuring, not for capturing. After any control
       is released, hand focus straight back to the board so the next
       stroke and every keyboard shortcut land on the canvas. */
    const releaseFocus = (e) => {
      if (e.target.matches('input[type="text"], textarea')) return;
      requestAnimationFrame(() => {
        if (e.target.blur) e.target.blur();
      });
    };
    panelEl().addEventListener('pointerup', releaseFocus);
    dock.addEventListener('pointerup', releaseFocus);

    /* — tools — */
    const armTool = (type) => {
      api()?.setActiveTool({ type });
      dock.querySelectorAll('[data-tool]').forEach((b) =>
        b.classList.toggle('is-active', b.dataset.tool === type));
      // freedraw is the engine tool every texture brush draws through —
      // only arming something actually incompatible (selection, text,
      // shapes...) should drop the active brush back to vector. Without
      // this guard, opening the very panel that hosts the brush picker
      // (armTool('freedraw')) silently reset whatever brush you'd just
      // picked, so every stroke landed as plain vector no matter what
      // was selected.
      if (type !== 'freedraw') resetBrushRef?.();
      requestAnimationFrame(syncSections);
    };
    armToolRef = armTool;
    const activateTool = (t) => { armTool(t.type); if (t.hint) setStatus(t.hint); };
    // separators keyed by shortcut, not array index — an inserted tool
    // (like "Caja de texto") can never silently shift these anymore
    const SEP_BEFORE_KEYS = new Set(['p', 'e']);
    TOOLS.forEach((t) => {
      if (SEP_BEFORE_KEYS.has(t.key)) {
        const sep = document.createElement('span');
        sep.className = 'n-tool__sep';
        dock.appendChild(sep);
      }
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'n-tool' + (t.type === 'selection' ? ' is-active' : '');
      b.dataset.tool = t.type;
      b.dataset.key = t.key;
      b.title = t.label;
      b.setAttribute('aria-label', t.label);
      b.innerHTML = `<svg viewBox="0 0 24 24">${t.svg}</svg>`;
      b.addEventListener('click', () => activateTool(t));
      dock.appendChild(b);
    });

    /* — option buttons that open flyouts — */
    const sep = document.createElement('span');
    sep.className = 'n-tool__sep';
    dock.appendChild(sep);
    OPTS.forEach((o) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'n-tool n-tool--opt';
      b.dataset.opt = o.id;
      b.title = o.label;
      b.setAttribute('aria-label', o.label);
      b.innerHTML = `<svg viewBox="0 0 24 24">${o.svg}</svg>`;
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        // MASK is an action, not a settings panel: go straight to picking
        // the photo for whatever shape is selected instead of making the
        // user hunt for a second button inside the properties panel
        if (o.id === 'mask') { maskFromSelection?.(); return; }
        showFlyout(o.id);
      });
      dock.appendChild(b);
    });

    /* The HUD lives in the dock's static markup, so it starts ABOVE the
       tools/options that get appended here at runtime. Move it to the end
       once, so it sits under MASK — the bottom of the stack — which is
       where it belongs as a readout rather than a control. */
    const hudEl = studio.querySelector('[data-hud]');
    if (hudEl) dock.appendChild(hudEl);

    /* — dragging the dock (Windows-window feel) — */
    /* undo/redo: the imperative API only exposes history.clear(), no real
       undo()/redo() call — the only way in is dispatching the native
       keyboard shortcut Excalidraw's own listener already handles */
    const dispatchHistoryKey = (redo) => {
      const isMac = navigator.platform?.toLowerCase().includes('mac');
      document.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'z', code: 'KeyZ', keyCode: 90, which: 90,
        ctrlKey: !isMac, metaKey: isMac, shiftKey: redo,
        bubbles: true, cancelable: true,
      }));
    };
    // the HUD's colour chip is a shortcut into the colour section
    studio.querySelector('[data-hud-swatch]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      showFlyout('trazo');
    });

    studio.querySelector('[data-history="undo"]').addEventListener('click', () => dispatchHistoryKey(false));
    studio.querySelector('[data-history="redo"]').addEventListener('click', () => dispatchHistoryKey(true));

    const grip = studio.querySelector('[data-grip]');
    const placeDock = (x, y) => {
      const r = dock.getBoundingClientRect();
      dock.style.left = `${clamp(x, 6, window.innerWidth - r.width - 6)}px`;
      dock.style.top = `${clamp(y, 70, window.innerHeight - r.height - 10)}px`;
      dock.style.right = 'auto';
      dock.style.translate = 'none';
    };
    try {
      const saved = JSON.parse(localStorage.getItem(LS_DOCK) || 'null');
      if (saved) requestAnimationFrame(() => placeDock(saved.x, saved.y));
    } catch { /* first run */ }

    let dragging = false, offX = 0, offY = 0;
    grip.addEventListener('pointerdown', (e) => {
      const r = dock.getBoundingClientRect();
      dragging = true;
      offX = e.clientX - r.left;
      offY = e.clientY - r.top;
      dock.classList.add('is-dragging');
      grip.setPointerCapture(e.pointerId);
      hideFlyout();
      e.preventDefault();
    });
    grip.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      placeDock(e.clientX - offX, e.clientY - offY);
    });
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      dock.classList.remove('is-dragging');
      const r = dock.getBoundingClientRect();
      try { localStorage.setItem(LS_DOCK, JSON.stringify({ x: r.left, y: r.top })); } catch {}
    };
    grip.addEventListener('pointerup', endDrag);
    grip.addEventListener('pointercancel', endDrag);
    window.addEventListener('resize', () => {
      hideFlyout();
      const r = dock.getBoundingClientRect();
      placeDock(r.left, r.top);
    });

    document.addEventListener('keydown', (e) => {
      if (!studio.classList.contains('is-open')) return;
      // isContentEditable also catches Excalidraw's own native text-edit
      // surface (not a real <textarea>) — without it, pressing Escape to
      // exit typing a text element bubbled up here and triggered
      // askClose() instead, popping the "clase terminada" report mid-type
      if (e.target.matches('input, textarea, select') || e.target.isContentEditable) return;
      if (e.key === 'Escape') { openFlyout ? hideFlyout() : askClose(); return; }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault(); persist(); return;
      }
      const t = TOOLS.find((x) => x.key === e.key.toLowerCase());
      if (t && !e.ctrlKey && !e.metaKey) activateTool(t);
    });

    /* — colour bars — */
    const stopDrift = () => {};   // the colour no longer drifts on its own
    const valueOf = (n) => (n === 'hue' ? state.hue : n === 'sat' ? state.sat : state.lit);
    const bindBar = (name, max, apply) => {
      const bar = studio.querySelector(`[data-bar="${name}"]`);
      let drag = false;
      const set = (clientX) => {
        const r = bar.getBoundingClientRect();
        apply(clamp01((clientX - r.left) / r.width) * max);
        bar.setAttribute('aria-valuenow', String(Math.round(valueOf(name))));
        pushColor();
      };
      bar.addEventListener('pointerdown', (e) => {
        stopDrift();
        drag = true; bar.classList.add('is-dragging');
        bar.setPointerCapture(e.pointerId); set(e.clientX); e.preventDefault();
      });
      bar.addEventListener('pointermove', (e) => { if (drag) set(e.clientX); });
      const stop = () => { drag = false; bar.classList.remove('is-dragging'); };
      bar.addEventListener('pointerup', stop);
      bar.addEventListener('pointercancel', stop);
      bar.addEventListener('keydown', (e) => {
        const step = max / 40;
        if (e.key === 'ArrowLeft') { stopDrift(); apply(Math.max(0, valueOf(name) - step)); pushColor(); e.preventDefault(); }
        if (e.key === 'ArrowRight') { stopDrift(); apply(Math.min(max, valueOf(name) + step)); pushColor(); e.preventDefault(); }
      });
    };
    bindBar('hue', 360, (v) => { state.hue = v; });
    bindBar('sat', 100, (v) => { state.sat = v; });
    bindBar('lit', 100, (v) => { state.lit = v; });


    /* — stroke width + opacity — */
    const strokeR = studio.querySelector('[data-range="stroke"]');
    /* smooth the stroke that was just finished (never mid-draw) —
       `smoothed` itself lives at the outer initNotas() scope and gets
       reseeded by openStudio() every time a note is opened */
    const smoothLast = () => {
      if (!state.smooth) return;
      const a = api(); if (!a) return;
      const strength = state.smooth / 100;
      let touched = false;
      const next = a.getSceneElements().map((el) => {
        if (el.isDeleted || el.type !== 'freedraw' || smoothed.has(el.id)) return el;
        smoothed.add(el.id);
        const pts = smoothPoints(el.points, strength);
        if (pts === el.points) return el;
        touched = true;
        return {
          ...el, points: pts,
          version: (el.version || 1) + 1,
          versionNonce: Math.floor(Math.random() * 2 ** 31),
          updated: Date.now(),
        };
      });
      if (touched) a.updateScene({ elements: next });
    };
    const mountEl = studio.querySelector('[data-notas-canvas]');
    mountEl.addEventListener('pointerup', () => setTimeout(smoothLast, 30));
    mountEl.addEventListener('pointercancel', () => setTimeout(smoothLast, 30));

    const smoothR = studio.querySelector('[data-range="smooth"]');
    smoothR.addEventListener('input', () => {
      state.smooth = Number(smoothR.value);
      studio.querySelector('[data-val="smooth"]').textContent = `${state.smooth}%`;
      paintBrushPreview();
    });

    strokeR.addEventListener('input', () => {
      const v = Number(strokeR.value);
      state.stroke = v;
      studio.querySelector('[data-val="stroke"]').textContent = `${v}px`;
      paintBrushPreview();
      patchAppState({ currentItemStrokeWidth: v });
      patchSelected(() => ({ strokeWidth: v }));
    });
    paintBrushPreview();
    const opR = studio.querySelector('[data-range="opacity"]');
    opR.addEventListener('input', () => {
      const v = Number(opR.value);
      state.opacity = v;
      studio.querySelector('[data-val="opacity"]').textContent = `${v}%`;
      paintBrushPreview();
      patchAppState({ currentItemOpacity: v });
      patchSelected(() => ({ opacity: v }));
    });

    /* — texture brushes — */
    const overlay = studio.querySelector('[data-texture-overlay]');
    const octx = overlay.getContext('2d');
    const brushWrap = studio.querySelector('[data-brushes]');
    const brushHint = studio.querySelector('[data-brush-hint]');
    const brushExtra = studio.querySelector('[data-brush-extra]');
    const tiltInput = studio.querySelector('[data-range="tilt"]');
    const tiltLabel = studio.querySelector('[data-tilt-label]');
    const densityInput = studio.querySelector('[data-density-input]');
    const densityLabel = studio.querySelector('[data-density-label]');
    const stampRow = studio.querySelector('[data-stamp-row]');
    const asciiRow = studio.querySelector('[data-ascii-row]');
    const asciiInput = studio.querySelector('[data-ascii-input]');
    const asciiCount = studio.querySelector('[data-ascii-count]');
    const pixelRow = studio.querySelector('[data-pixel-row]');
    const pixelRoundBtn = studio.querySelector('[data-pixel-round]');
    let pixelRounded = false;
    pixelRoundBtn.addEventListener('click', () => {
      pixelRounded = !pixelRounded;
      pixelRoundedRef = pixelRounded;
      pixelRoundBtn.classList.toggle('is-active', pixelRounded);
      paintBrushPreview();
    });
    // brushes where "densidad" actually changes anything real — hidden for
    // the others instead of sitting there looking broken (same pattern as
    // "inclinación", which only ever showed for aerosol)
    const DENSITY_BRUSHES = new Set(['aerosol', 'dither', 'ascii', 'stamp', 'liquid', 'pixel']);
    // a small default mark so Estampa draws something the instant it's
    // picked instead of silently doing nothing until a file is uploaded —
    // uploading a real SVG/PNG below just replaces this
    const defaultStamp = (() => {
      const c = document.createElement('canvas');
      c.width = 64; c.height = 64;
      const x = c.getContext('2d');
      x.strokeStyle = '#26e0ff';
      x.lineWidth = 5;
      x.beginPath(); x.arc(32, 32, 22, 0, Math.PI * 2); x.stroke();
      x.fillStyle = '#3dff8a';
      x.beginPath(); x.arc(32, 32, 7, 0, Math.PI * 2); x.fill();
      return c;
    })();
    let stampImg = defaultStamp;
    stampImgRef = stampImg;

    const applyBrushVisibility = () => {
      const isVector = state.brush === 'vector';
      brushExtra.hidden = isVector;
      const isSpray = state.brush === 'aerosol';
      tiltInput.hidden = !isSpray; tiltLabel.hidden = !isSpray;
      const usesDensity = DENSITY_BRUSHES.has(state.brush);
      densityInput.hidden = !usesDensity; densityLabel.hidden = !usesDensity;
      stampRow.hidden = state.brush !== 'stamp';
      asciiRow.hidden = state.brush !== 'ascii';
      pixelRow.hidden = state.brush !== 'pixel';
      // overlay's pointer-events stays 'none' permanently now — texture
      // brush input is handled via document-level capture listeners below,
      // not by the overlay element receiving events directly
    };
    resetBrushRef = () => {
      if (state.brush === 'vector') return;
      state.brush = 'vector';
      brushWrap.querySelectorAll('.n-brush').forEach((x) => x.classList.toggle('is-active', x.dataset.brush === 'vector'));
      studio.querySelector('[data-val="brush"]').textContent = 'Vectorial';
      brushHint.textContent = BRUSHES[0].hint;
      applyBrushVisibility();
    };

    BRUSHES.forEach((b) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'n-brush' + (b.id === 'vector' ? ' is-active' : '');
      btn.dataset.brush = b.id;
      btn.title = b.label;
      btn.setAttribute('aria-label', b.label);
      btn.innerHTML = `<svg viewBox="0 0 24 24">${b.svg}</svg>`;
      btn.addEventListener('click', () => {
        state.brush = b.id;
        brushWrap.querySelectorAll('.n-brush').forEach((x) => x.classList.toggle('is-active', x === btn));
        studio.querySelector('[data-val="brush"]').textContent = b.label;
        brushHint.textContent = b.hint;
        applyBrushVisibility();
        paintBrushPreview();   // the sample used to only refresh once you also nudged stroke/opacity
        if (b.id === 'vector') armTool('freedraw');
      });
      brushWrap.appendChild(btn);
    });

    const densityR = densityInput;
    densityR.addEventListener('input', () => {
      state.density = Number(densityR.value);
      studio.querySelector('[data-val="density"]').textContent = `${state.density}%`;
      paintBrushPreview();
    });
    tiltInput.addEventListener('input', () => {
      state.tilt = Number(tiltInput.value) / 100;
      studio.querySelector('[data-val="tilt"]').textContent = `${tiltInput.value}%`;
    });

    /* custom stamp brush: any SVG/PNG the user drops in becomes the dab */
    const stampInput = studio.querySelector('[data-stamp-input]');
    studio.querySelector('[data-stamp-upload]').addEventListener('click', () => stampInput.click());
    stampInput.addEventListener('change', () => {
      const f = stampInput.files?.[0]; if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          stampImg = img;
          stampImgRef = img;
          studio.querySelector('[data-stamp-name]').textContent = f.name;
          paintBrushPreview();
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(f);
    });

    /* custom-text ASCII brush: type a phrase and it gets stamped letter by
       letter along the stroke, like Excalidraw's stamp brush but with text
       instead of an image — empty input falls back to random glyphs */
    asciiInput.addEventListener('input', () => {
      state.asciiText = asciiInput.value;
      asciiCount.textContent = state.asciiText.trim()
        ? `${state.asciiText.trim().length} caracteres en la frase`
        : 'usando caracteres random';
      paintBrushPreview();
    });

    /* the raw pointer→pixel drawing loop. Runs entirely on the overlay
       canvas in screen-pixel space — simple and crisp at any zoom. The
       stroke is only translated into Excalidraw scene coordinates ONCE,
       at the very end, to place the finished raster as an image element. */
    let sCanvas = null, sctx = null, last = null, bbox = null, travelled = 0, asciiIdx = 0;
    let strokeZoom = 1;   // engine zoom captured at pointerdown, see below
    let nodeTrail = []; // last few dab points, for the "nodo" circuit brush's link lines
    let overlayRect = null, dpr = 1;

    const growBBox = (x, y, pad) => {
      if (!bbox) { bbox = { minX: x - pad, minY: y - pad, maxX: x + pad, maxY: y + pad }; return; }
      bbox.minX = Math.min(bbox.minX, x - pad); bbox.minY = Math.min(bbox.minY, y - pad);
      bbox.maxX = Math.max(bbox.maxX, x + pad); bbox.maxY = Math.max(bbox.maxY, y + pad);
    };

    const dab = (x, y) => {
      // brush size is expressed in SCENE units: multiply by the zoom to get
      // the screen size to paint at, so the committed mark is the same
      // thickness whether you drew it zoomed way in or way out
      const size = Math.max(2, state.stroke) * strokeZoom;
      const color = state.color;
      const op = state.opacity / 100;
      growBBox(x, y, size * 2.6);
      switch (state.brush) {
        case 'aerosol':
          sprayDab(sctx, x, y, size * 2.2, state.density * 0.4, state.tilt, color, op);
          break;
        case 'dither':
          ditherDab(sctx, x, y, size * 2.2, color, op, state.density);
          break;
        case 'ink':
          if (last) inkSegment(sctx, last.x, last.y, x, y, size, color, op);
          break;
        case 'noise':
        case 'vhs':
          if (last) plainSegment(sctx, last.x, last.y, x, y, size * 1.5, color, op);
          break;
        case 'liquid':
          liquidDab(sctx, x, y, size * 2.4, color, op, state.density);
          break;
        case 'sumi': {
          if (last) {
            const dd = Math.hypot(x - last.x, y - last.y);
            // fast strokes run the brush dry (thin), slow ones stay loaded (thick)
            const taper = clamp(1.5 - dd / 16, 0.3, 1.5);
            sumiSegment(sctx, last.x, last.y, x, y, size, color, op, taper);
          }
          break;
        }
        case 'nodo':
          nodeDab(sctx, x, y, size * 1.3, color, op, nodeTrail);
          nodeTrail.push([x, y]);
          if (nodeTrail.length > 10) nodeTrail.shift();
          break;
        case 'pixel':
          if (Math.random() * 100 < state.density) pixelDab(sctx, x, y, size * 2, color, op, pixelRounded);
          break;
        case 'iris':
          irisDab(sctx, x, y, size * 1.6, color, op);
          break;
        case 'ascii': {
          const dd = last ? Math.hypot(x - last.x, y - last.y) : 0;
          travelled += dd;
          // higher density = glyphs stamped closer together
          const step = (size * 1.7) / clamp(state.density / 50, 0.3, 2.5);
          if (travelled >= step || !last) {
            travelled = 0;
            const ang = last ? Math.atan2(y - last.y, x - last.x) : 0;
            const src = state.asciiText.trim() || ASCII_CHARS;
            sctx.save();
            sctx.translate(x, y); sctx.rotate(ang);
            sctx.font = `${Math.max(10, size * 3)}px Cascadia, monospace`;
            sctx.fillStyle = color; sctx.globalAlpha = op;
            sctx.textAlign = 'center'; sctx.textBaseline = 'middle';
            sctx.fillText(src[asciiIdx % src.length], 0, 0);
            sctx.restore(); sctx.globalAlpha = 1;
            asciiIdx++;
          }
          break;
        }
        case 'stamp': {
          if (!stampImg) break;
          const dd = last ? Math.hypot(x - last.x, y - last.y) : 0;
          travelled += dd;
          const step = Math.max(8, (size * 1.5) / clamp(state.density / 50, 0.3, 2.5));
          if (travelled >= step || !last) {
            travelled = 0;
            const ang = last ? Math.atan2(y - last.y, x - last.x) : 0;
            const w = size * 3, h = w * (stampImg.height / stampImg.width || 1);
            sctx.save();
            sctx.translate(x, y); sctx.rotate(ang);
            sctx.globalAlpha = op;
            sctx.drawImage(stampImg, -w / 2, -h / 2, w, h);
            sctx.restore(); sctx.globalAlpha = 1;
          }
          break;
        }
        default: break;
      }
      last = { x, y };
    };

    const pt = (e) => ({ x: (e.clientX - overlayRect.left), y: (e.clientY - overlayRect.top) });

    /* The overlay canvas is a paint SURFACE only — it never receives
       pointer events itself (CSS pointer-events:none, permanently).
       Reason: it's a sibling of `.notas-studio__canvas`, which is its own
       stacking context (z-index:3). The native properties panel is grafted
       DEEP inside that same context (Island z-index:12, but capped by its
       z:3 ancestor), so no z-index the overlay could carry would ever let
       it sit strictly between "above the native canvas" and "below the
       panel" — they share that one ancestor. Toggling the overlay to
       pointer-events:auto (the previous approach) made it correctly-sized
       but blocked the ENTIRE panel/dock whenever a texture brush was
       armed, since a full-viewport auto layer with z-index:4 sits above
       that whole z:3 subtree, panel included.
       Fix: listen on `document` in the CAPTURE phase instead, so we see
       every pointer event before Excalidraw's own (bubble-phase) handlers
       do. If the event target is UI chrome (dock/panel/report/top bar),
       do nothing — it falls through to the real button under it exactly
       as it always did. Otherwise, for a genuine canvas hit with a
       texture brush armed, stopPropagation so the native freedraw handler
       never sees it, then run the same raster pipeline as before. */
    const isChrome = (t) => !!t.closest?.(
      '[data-dock], .Island, [data-panel], .n-report, .notas-studio__top, [data-stamp-input]',
    );

    document.addEventListener('pointerdown', (e) => {
      if (pendingFormat) return; // a frame is mid-placement, let that handler own this click
      if (state.brush === 'vector' || !studio.classList.contains('is-open')) return;
      if (isChrome(e.target)) return;
      // state.brush only gets reset to 'vector' when arming a tool goes
      // through OUR armTool() — but the engine reverts itself to the
      // selection tool after finishing any native shape (rectangle,
      // ellipse...) without ever calling armTool(). Without this check,
      // state.brush could be left stuck on e.g. "aerosol" from an earlier
      // stroke, so a later Shift-click meant to multi-select got
      // swallowed as a texture-brush draw attempt instead — this is what
      // made Shift-select (and therefore Ctrl+G grouping) feel broken.
      if (api()?.getAppState()?.activeTool?.type !== 'freedraw') return;
      e.preventDefault();
      e.stopPropagation();
      overlayRect = overlay.getBoundingClientRect();
      /* Texture brushes paint in SCREEN pixels on this overlay, but the
         finished raster is committed in SCENE units. So at zoom 0.5 a
         20px-wide screen stroke became 40 scene units — the brush visibly
         fattened the further out you were, and the raster (captured at
         screen resolution, then blown up into a bigger scene rect) came
         back soft. Capture the zoom for this stroke: `dab()` divides the
         brush size by it so the mark is always the same SCENE size, and
         the backing canvas gets extra resolution when zoomed out so the
         committed image still has real pixels behind it. */
      strokeZoom = api()?.getAppState()?.zoom?.value || 1;
      if (!Number.isFinite(strokeZoom) || strokeZoom <= 0) strokeZoom = 1;
      const baseDpr = Math.min(2, window.devicePixelRatio || 1);
      dpr = clamp(baseDpr / strokeZoom, baseDpr, 4);
      overlay.width = overlayRect.width * dpr; overlay.height = overlayRect.height * dpr;
      octx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sCanvas = document.createElement('canvas');
      sCanvas.width = overlay.width; sCanvas.height = overlay.height;
      sctx = sCanvas.getContext('2d');
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      last = null; bbox = null; travelled = 0; asciiIdx = 0; nodeTrail = [];
      const p = pt(e);
      dab(p.x, p.y);
      octx.clearRect(0, 0, overlay.width / dpr, overlay.height / dpr);
      octx.drawImage(sCanvas, 0, 0, overlay.width / dpr, overlay.height / dpr);
    }, true);
    document.addEventListener('pointermove', (e) => {
      if (!sctx) return;
      e.preventDefault();
      e.stopPropagation();
      const p = pt(e);
      dab(p.x, p.y);
      octx.clearRect(0, 0, overlay.width / dpr, overlay.height / dpr);
      octx.drawImage(sCanvas, 0, 0, overlay.width / dpr, overlay.height / dpr);
    }, true);

    const endStroke = async () => {
      if (!sctx || !bbox) { sctx = null; last = null; return; }
      const a = api(); if (!a) { sctx = null; return; }
      const cw = overlay.width / dpr, ch = overlay.height / dpr;
      const x0 = Math.max(0, Math.floor(bbox.minX)), y0 = Math.max(0, Math.floor(bbox.minY));
      const x1 = Math.min(cw, Math.ceil(bbox.maxX)), y1 = Math.min(ch, Math.ceil(bbox.maxY));
      const w = Math.max(1, x1 - x0), h = Math.max(1, y1 - y0);
      const brushId = state.brush;

      if (brushId === 'noise') applyGrain(sctx, cw, ch, 0.55);
      let source = sCanvas;
      if (brushId === 'vhs') source = vhsSplit(sCanvas, sCanvas.width, sCanvas.height, 3 * dpr);

      const crop = document.createElement('canvas');
      crop.width = Math.max(1, Math.round(w * dpr)); crop.height = Math.max(1, Math.round(h * dpr));
      const cctx = crop.getContext('2d');
      cctx.drawImage(source, x0 * dpr, y0 * dpr, w * dpr, h * dpr, 0, 0, crop.width, crop.height);

      octx.clearRect(0, 0, cw, ch);
      sctx = null; sCanvas = null; last = null; bbox = null; nodeTrail = [];

      try {
        const mod = await loadBundle();
        const appState = a.getAppState();
        const p0 = mod.viewportCoordsToSceneCoords(
          { clientX: overlayRect.left + x0, clientY: overlayRect.top + y0 }, appState,
        );
        const p1 = mod.viewportCoordsToSceneCoords(
          { clientX: overlayRect.left + x1, clientY: overlayRect.top + y1 }, appState,
        );
        const blob = await new Promise((res) => crop.toBlob(res, 'image/png'));
        if (!blob) return;
        const dataURL = await new Promise((res) => {
          const reader = new FileReader();
          reader.onload = () => res(reader.result);
          reader.readAsDataURL(blob);
        });
        const fileId = `tex_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
        a.addFiles([{ id: fileId, mimeType: 'image/png', dataURL, created: Date.now() }]);
        const [el] = mod.convertToExcalidrawElements([{
          type: 'image', fileId,
          x: Math.min(p0.x, p1.x), y: Math.min(p0.y, p1.y),
          width: Math.max(4, Math.abs(p1.x - p0.x)), height: Math.max(4, Math.abs(p1.y - p0.y)),
        }]);
        a.updateScene({ elements: [...a.getSceneElements(), el] });
        setStatus(`${BRUSHES.find((b) => b.id === brushId)?.label || 'pincel'} agregado como imagen`);
      } catch (err) {
        console.error('[notas] pincel de textura', err);
        setStatus('no se pudo terminar el trazo de textura');
      }
    };
    document.addEventListener('pointerup', (e) => {
      if (!sctx) return;
      e.preventDefault();
      e.stopPropagation();
      endStroke();
    }, true);
    document.addEventListener('pointercancel', (e) => {
      if (!sctx) return;
      e.preventDefault();
      e.stopPropagation();
      endStroke();
    }, true);

    /* — roughness (the only stroke-character knob that exists) — */
    const roughWrap = studio.querySelector('[data-rough]');
    ROUGHNESS.forEach((r) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'n-chip' + (r.v === 1 ? ' is-active' : '');
      b.textContent = r.label;
      b.addEventListener('click', () => {
        roughWrap.querySelectorAll('.n-chip').forEach((x) => x.classList.toggle('is-active', x === b));
        patchAppState({ currentItemRoughness: r.v });
        patchSelected(() => ({ roughness: r.v }));
      });
      roughWrap.appendChild(b);
    });

    /* — fonts, each previewed in its own typeface — */
    const fontWrap = studio.querySelector('[data-fonts]');
    FONTS.forEach((f) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'n-font' + (f.id === 5 ? ' is-active' : '');
      b.dataset.font = String(f.id);
      b.innerHTML = `<span class="n-font__name" style="font-family:${f.css}, sans-serif">${f.label}</span>` +
        `<span class="n-font__hint">${f.hint}</span>`;
      b.addEventListener('click', () => {
        fontWrap.querySelectorAll('.n-font').forEach((x) => x.classList.toggle('is-active', x === b));
        patchAppState({ currentItemFontFamily: f.id });
        patchSelected((el) => (el.type === 'text' ? { fontFamily: f.id } : null));
      });
      fontWrap.appendChild(b);
    });

    /* — text alignment — */
    const alignWrap = studio.querySelector('[data-align]');
    ALIGNS.forEach((a) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'n-chip' + (a.v === 'left' ? ' is-active' : '');
      b.dataset.align = a.v;
      b.title = a.label;
      b.innerHTML = `<svg viewBox="0 0 24 24" class="n-chip__icon">${a.svg}</svg>`;
      b.addEventListener('click', () => {
        alignWrap.querySelectorAll('.n-chip').forEach((x) => x.classList.toggle('is-active', x === b));
        patchAppState({ currentItemTextAlign: a.v });
        patchSelected((el) => (el.type === 'text' ? { textAlign: a.v } : null));
      });
      alignWrap.appendChild(b);
    });

    /* — text stroke/outline/format/chip style: the engine can't natively
       outline glyphs, do real bold/italic/underline, or give text a
       background box — this rasterizes the SELECTED text element to a
       canvas with real canvas font-style/strokeText/underline-line/
       rounded-rect, and swaps it in as an image — same "commit as PNG"
       trick the texture brushes use */
    let textStyleMode = 'fill';
    const textFormat = { bold: false, italic: false, underline: false };
    const tstyleWrap = studio.querySelector('[data-tstyle-row]');
    const tstrokeInput = studio.querySelector('[data-range="tstroke"]');
    const tstrokeLabel = studio.querySelector('[data-tstroke-label]');
    const tformatWrap = studio.querySelector('[data-tformat-row]');
    const tradiusInput = studio.querySelector('[data-range="tradius"]');
    const tpadInput = studio.querySelector('[data-range="tpad"]');

    tstyleWrap.querySelectorAll('[data-tstyle]').forEach((b) => {
      b.addEventListener('click', () => {
        textStyleMode = b.dataset.tstyle;
        tstyleWrap.querySelectorAll('[data-tstyle]').forEach((x) => x.classList.toggle('is-active', x === b));
        const needsStroke = textStyleMode !== 'fill';
        tstrokeInput.hidden = !needsStroke; tstrokeLabel.hidden = !needsStroke;
      });
    });
    tstrokeInput.addEventListener('input', () => {
      studio.querySelector('[data-val="tstroke"]').textContent = `${tstrokeInput.value}px`;
    });
    tformatWrap.querySelectorAll('[data-tformat]').forEach((b) => {
      b.addEventListener('click', () => {
        const key = b.dataset.tformat;
        textFormat[key] = !textFormat[key];
        b.classList.toggle('is-active', textFormat[key]);
      });
    });
    tradiusInput.addEventListener('input', () => {
      studio.querySelector('[data-val="tradius"]').textContent = `${tradiusInput.value}px`;
    });
    tpadInput.addEventListener('input', () => {
      studio.querySelector('[data-val="tpad"]').textContent = `${tpadInput.value}px`;
    });

    /* Live text box: a REAL rectangle element placed behind the selected
       text and grouped with it. Nothing gets rasterized, so the text stays
       text — still editable, still justifiable, and the box itself keeps
       every native property (fill, border, radius) adjustable from the
       stock panel afterwards. This is what "propiedad de la caja" needs
       to mean; the rasterizing path above is only for the glyph effects
       the engine genuinely cannot render. */
    studio.querySelector('[data-tbox-apply]').addEventListener('click', async () => {
      const a = api(); if (!a) return;
      const live = selectedIds();
      const ids = new Set(live.length ? live : preFlyoutSelection);
      const target = a.getSceneElements().find((el) => ids.has(el.id) && el.type === 'text');
      if (!target) { setStatus('seleccioná un texto para ponerle caja'); return; }

      const pad = Number(tpadInput.value);
      const rad = Number(tradiusInput.value);
      const mod = await loadBundle();
      const [box] = mod.convertToExcalidrawElements([{
        type: 'rectangle',
        x: target.x - pad, y: target.y - pad,
        width: target.width + pad * 2, height: target.height + pad * 2,
        backgroundColor: target.strokeColor,
        strokeColor: target.strokeColor,
        fillStyle: 'solid', strokeWidth: 1, roughness: 0,
        roundness: rad > 0 ? { type: 3, value: rad } : null,
      }]);
      // one shared group id so box + text move, scale and select together
      const gid = `tbox_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
      const boxed = { ...box, groupIds: [...(box.groupIds || []), gid] };
      const els = a.getSceneElements();
      const idx = els.findIndex((el) => el.id === target.id);
      // the box is filled with the text's own colour, so leaving the glyphs
      // that same colour renders them invisible (dark on dark) — flip the
      // ink to whichever of black/white actually reads on it. It stays a
      // normal editable text colour the user can change back any time.
      const hex = (target.strokeColor || '#000000').replace('#', '');
      const full = hex.length === 3 ? hex.split('').map((ch) => ch + ch).join('') : hex;
      const num = parseInt(full, 16) || 0;
      const luma = (0.299 * ((num >> 16) & 255) + 0.587 * ((num >> 8) & 255) + 0.114 * (num & 255)) / 255;
      const nextText = {
        ...target,
        strokeColor: luma > 0.55 ? '#111111' : '#ffffff',
        groupIds: [...(target.groupIds || []), gid],
        version: (target.version || 1) + 1,
        versionNonce: Math.floor(Math.random() * 2 ** 31),
        updated: Date.now(),
      };
      // insert the box immediately BEFORE the text so it paints underneath
      const out = [...els.slice(0, idx), boxed, nextText, ...els.slice(idx + 1)];
      a.updateScene({ elements: out });
      setStatus('caja puesta detrás del texto — el texto sigue editable');
    });

    studio.querySelector('[data-text-apply]').addEventListener('click', async () => {
      const a = api(); if (!a) return;
      // live selection first, falling back to what was selected right
      // before this "Texto" panel opened (opening it re-arms the text
      // tool, which clears live selection as a side effect)
      const live = selectedIds();
      const ids = new Set(live.length ? live : preFlyoutSelection);
      const target = a.getSceneElements().find((el) => ids.has(el.id) && el.type === 'text');
      if (!target) { setStatus('seleccioná un texto para estilizarlo'); return; }
      const hasFormat = textFormat.bold || textFormat.italic || textFormat.underline;
      if (textStyleMode === 'fill' && !hasFormat) {
        setStatus('activá outline/grueso o negrita/cursiva/subrayado — para fondo usá "Poner caja detrás del texto"');
        return;
      }

      const lines = (target.text || '').split('\n');
      const fontPx = target.fontSize;
      const lineH = fontPx * (target.lineHeight || 1.25);
      const strokeW = Number(tstrokeInput.value);
      const pad = Math.ceil(strokeW) + 8;
      const w = Math.max(4, Math.round(target.width)) + pad * 2;
      const h = Math.max(4, Math.round(target.height)) + pad * 2;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const c = document.createElement('canvas');
      c.width = w * dpr; c.height = h * dpr;
      const cx = c.getContext('2d');
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const fontParts = [];
      if (textFormat.italic) fontParts.push('italic');
      if (textFormat.bold) fontParts.push('bold');
      cx.font = `${fontParts.join(' ')} ${fontPx}px ${fontCss(target.fontFamily)}, sans-serif`.trim();
      cx.textBaseline = 'alphabetic';
      const align = target.textAlign === 'center' ? 'center' : target.textAlign === 'right' ? 'right' : 'left';
      cx.textAlign = align;
      cx.lineJoin = 'round';
      const lineX = align === 'center' ? w / 2 : align === 'right' ? w - pad : pad;

      // the background box is no longer baked in here — it's a real
      // grouped rectangle element now (see [data-tbox-apply]), so this
      // path only ever draws glyphs
      const inkColor = target.strokeColor;
      const doStroke = textStyleMode === 'outline' || textStyleMode === 'thick';
      const doFill = textStyleMode !== 'outline';
      lines.forEach((line, i) => {
        const ly = pad + fontPx * 0.8 + i * lineH;
        if (doStroke) {
          cx.lineWidth = strokeW;
          cx.strokeStyle = inkColor;
          cx.strokeText(line, lineX, ly);
        }
        if (doFill) {
          cx.fillStyle = inkColor;
          cx.fillText(line, lineX, ly);
        }
        if (textFormat.underline) {
          const lw = cx.measureText(line).width;
          const ux = align === 'center' ? lineX - lw / 2 : align === 'right' ? lineX - lw : lineX;
          const uy = ly + fontPx * 0.12;
          cx.strokeStyle = inkColor;
          cx.lineWidth = Math.max(1, fontPx * 0.06);
          cx.beginPath(); cx.moveTo(ux, uy); cx.lineTo(ux + lw, uy); cx.stroke();
        }
      });

      const dataURL = c.toDataURL('image/png');
      const fileId = `txt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
      a.addFiles([{ id: fileId, mimeType: 'image/png', dataURL, created: Date.now() }]);
      const mod = await loadBundle();
      const [imgEl] = mod.convertToExcalidrawElements([{
        type: 'image', fileId,
        x: target.x - pad, y: target.y - pad, width: w, height: h,
      }]);
      a.updateScene({ elements: [...a.getSceneElements().filter((el) => el.id !== target.id), imgEl] });
      setStatus('texto convertido');
    });

    /* — size — */
    const sizeR = studio.querySelector('[data-range="size"]');
    const setSize = (v) => {
      state.size = v;
      sizeR.value = String(v);
      studio.querySelector('[data-sect="texto"] [data-val="size"]').textContent = `${v}px`;
      studio.querySelector('[data-val="size2"]').textContent = `${v}px`;
      studio.querySelectorAll('[data-size-presets] .n-chip').forEach((c) =>
        c.classList.toggle('is-active', Number(c.dataset.size) === v));
      patchAppState({ currentItemFontSize: v });
      patchSelected((el) => (el.type === 'text' ? { fontSize: v } : null));
    };
    studio.querySelectorAll('[data-size-presets] .n-chip').forEach((c) =>
      c.addEventListener('click', () => setSize(Number(c.dataset.size))));
    sizeR.addEventListener('input', () => setSize(Number(sizeR.value)));

    /* — radius — */
    const radR = studio.querySelector('[data-range="radius"]');
    studio.querySelectorAll('[data-radius]').forEach((b) => {
      b.addEventListener('click', () => {
        const mode = b.dataset.radius;
        studio.querySelectorAll('[data-radius]').forEach((x) =>
          x.classList.toggle('is-active', x === b));
        patchAppState({ currentItemRoundness: mode });
        patchSelected(() => ({
          roundness: mode === 'round' ? { type: 3, value: Number(radR.value) } : null,
        }));
      });
    });
    /* radius = min(value, min(w,h) * 0.25) inside the engine, so the real
       ceiling differs per element — compute it for each one. */
    studio.querySelector('[data-radius-max]').addEventListener('click', () => {
      const n = patchSelected((el) => {
        const short = Math.min(Math.abs(el.width || 0), Math.abs(el.height || 0));
        if (!short) return null;
        return { roundness: { type: 3, value: Math.round(short * 0.25) } };
      });
      setStatus(n ? `radio al máximo en ${n} elemento${n > 1 ? 's' : ''}` : 'seleccioná algo primero');
    });

    /* — image masking: rasterize the selected (ideally filled, closed)
       shape as an alpha silhouette, then clip a chosen image through it —
       the same idea as a mask PNG in Photoshop/Resolume, made with the
       pencil instead of imported. The source shape is left untouched so
       it can be reused for another image later. */
    const maskInput = studio.querySelector('[data-mask-input]');
    let maskTargetEl = null;

    /* shared by both entry points below: rasterize `target`'s silhouette
       as the mask, cover-fit `contentImg` over it, keep only where the
       mask had opacity, insert as a new image at target's bounds. The
       source shape is never touched, so it's ready to mask another image. */
    /* `shapes` is an ARRAY: the mask is the combined silhouette of every
       element passed in, so you can group a bunch of marks/shapes/text and
       cut a photo with the whole composition, not just one stroke. */
    const applyMaskToImage = async (shapes, contentImg) => {
      const a = api(); if (!a) return;
      const list = Array.isArray(shapes) ? shapes : [shapes];
      if (!list.length) return;
      setStatus('aplicando máscara…');
      try {
        const mod = await loadBundle();
        // union bounding box of the whole group — its centre is what the
        // export is centred on, same reasoning as the single-shape case
        const minX = Math.min(...list.map((el) => el.x));
        const minY = Math.min(...list.map((el) => el.y));
        const maxX = Math.max(...list.map((el) => el.x + (el.width || 0)));
        const maxY = Math.max(...list.map((el) => el.y + (el.height || 0)));
        const target = {
          x: minX, y: minY, width: maxX - minX, height: maxY - minY,
          strokeWidth: Math.max(...list.map((el) => el.strokeWidth || 1)),
        };
        /* Getting these bounds right is what kept cropping fat strokes.
           A stroke is drawn CENTRED on its path, so half its width spills
           past the element's geometric x/y/w/h — and guessing that spill
           (previous attempt) still misaligned, because the engine's own
           export bounds already include some of it by an amount we can't
           know from outside.
           Robust fix: don't guess at all. Force the export to scale 1 so
           one image pixel == one scene unit, then place the result CENTRED
           on the shape's centre. The stroke is symmetric about the path,
           so the visual centre always equals the geometric centre — which
           makes the placement exact for any stroke width, at any zoom,
           without knowing where the engine chose to put its bounds. */
        const pad = Math.ceil((target.strokeWidth || 1) * 2) + 8;
        /* The mask is the group's REAL rendered alpha — exactly the pixels
           Excalidraw's own "Copy to clipboard as PNG" would give for that
           selection. Textured brush strokes, rounded rectangles, images,
           mixed fills: whatever is actually painted is what cuts the photo.
           (An earlier version forced every shape to a solid black fill to
           make unfilled outlines usable — that flattened real compositions
           into blobs and was the wrong trade. If a shape reads as a thin
           outline, give it a Background so it has area to cut with.) */
        const maskBlob = await mod.exportToBlob?.({
          elements: list,
          files: a.getFiles(),
          appState: { ...a.getAppState(), exportBackground: false },
          exportPadding: pad,
          mimeType: 'image/png',
          getDimensions: (w, h) => ({ width: w, height: h, scale: 1 }),
        });
        if (!maskBlob) { setStatus('no se pudo rasterizar la forma'); return; }
        const maskUrl = URL.createObjectURL(maskBlob);
        const maskImg = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => { URL.revokeObjectURL(maskUrl); resolve(img); };
          img.onerror = reject;
          img.src = maskUrl;
        });

        const c = document.createElement('canvas');
        c.width = maskImg.width; c.height = maskImg.height;
        const cx = c.getContext('2d');
        const scale = Math.max(c.width / contentImg.width, c.height / contentImg.height);
        const cw = contentImg.width * scale, ch = contentImg.height * scale;
        cx.drawImage(contentImg, (c.width - cw) / 2, (c.height - ch) / 2, cw, ch);
        cx.globalCompositeOperation = 'destination-in';
        cx.drawImage(maskImg, 0, 0, c.width, c.height);

        const dataURL = c.toDataURL('image/png');
        const fileId = `mask_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
        a.addFiles([{ id: fileId, mimeType: 'image/png', dataURL, created: Date.now() }]);
        // exported at scale 1, so these pixels ARE scene units — centre the
        // result on the shape's own centre and the alignment is exact
        const cxCentre = target.x + target.width / 2;
        const cyCentre = target.y + target.height / 2;
        const [imgEl] = mod.convertToExcalidrawElements([{
          type: 'image', fileId,
          x: cxCentre - maskImg.width / 2,
          y: cyCentre - maskImg.height / 2,
          width: maskImg.width,
          height: maskImg.height,
        }]);
        a.updateScene({ elements: [...a.getSceneElements(), imgEl] });
        setStatus('imagen recortada con la máscara');
      } catch (err) {
        console.error('[notas] máscara', err);
        setStatus('no se pudo aplicar la máscara');
      }
    };

    /* one entry point, used by BOTH the dock's MASK button and the panel
       button, so "seleccioné la forma, quiero enmascarar" is always the
       same single action */
    maskFromSelection = async () => {
      const a = api(); if (!a) return;
      // live selection first, with the pre-flyout snapshot as fallback
      // (opening a panel section re-arms a tool, which clears selection)
      const live = selectedIds();
      const ids = new Set(live.length ? live : preFlyoutSelection);
      const selected = a.getSceneElements().filter((el) => ids.has(el.id) && !el.isDeleted);
      if (!selected.length) { setStatus('seleccioná una forma cerrada para usar como máscara'); return; }

      const images = selected.filter((el) => el.type === 'image');
      const shapes = selected.filter((el) => el.type !== 'image');

      /* Shapes + exactly one image → the shapes are the silhouette and
         that image is the content, cut in place with no file picker. */
      if (shapes.length && images.length === 1) {
        const fileEntry = a.getFiles()[images[0].fileId];
        if (!fileEntry) { setStatus('no encontré los datos de esa imagen'); return; }
        const img = await new Promise((resolve, reject) => {
          const el = new Image();
          el.onload = () => resolve(el);
          el.onerror = reject;
          el.src = fileEntry.dataURL;
        });
        await applyMaskToImage(shapes, img);
        return;
      }

      /* Anything else → the WHOLE selection is the silhouette and you pick
         the content from disk. This is what makes the key workflow work:
         flatten a composition with Excalidraw's own "Copy to clipboard as
         PNG", paste it back as a single raster, select that PNG alone and
         mask with it. Its alpha is the stencil. Refusing a lone image here
         (the old behaviour) was exactly what blocked that. */
      maskTargetEl = selected;
      const what = images.length && !shapes.length
        ? (images.length > 1 ? 'esas imágenes' : 'ese PNG')
        : 'esa selección';
      setStatus(`elegí la foto que va adentro de ${what}`);
      maskInput.click();
    };
    studio.querySelector('[data-mask-apply]').addEventListener('click', () => maskFromSelection());

    /* ── lasso cut: a traced outline becomes a real cut on the photo ──
       This does NOT rasterise the stroke like the mask above does. It
       reads the freedraw element's own `points` and fills them as a
       CLOSED path, so the edge follows exactly where you traced,
       independent of how thick the pencil was. That is the difference
       between "the mask is my brush mark" and "the mask is the region I
       outlined" — the latter is what a lasso is. */
    const cutImageWithPath = async (pathEl, imgEl, keep) => {
      const a = api(); if (!a) return;
      const pts = pathEl.points || [];
      if (pts.length < 3) { setStatus('el trazo es muy corto para cerrar una forma'); return; }
      const entry = a.getFiles()[imgEl.fileId];
      if (!entry) { setStatus('no encontré los datos de esa foto'); return; }
      setStatus('recortando…');
      try {
        const img = await new Promise((res, rej) => {
          const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = entry.dataURL;
        });
        const c = document.createElement('canvas');
        c.width = img.width; c.height = img.height;
        const cx = c.getContext('2d');
        cx.drawImage(img, 0, 0);
        // scene units -> this image's own pixel space
        const kx = img.width / (imgEl.width || 1);
        const ky = img.height / (imgEl.height || 1);
        cx.beginPath();
        pts.forEach(([px, py], i) => {
          const x = (pathEl.x + px - imgEl.x) * kx;
          const y = (pathEl.y + py - imgEl.y) * ky;
          if (i === 0) cx.moveTo(x, y); else cx.lineTo(x, y);
        });
        cx.closePath();   // an open trace still yields a usable region
        // keep inside  -> erase everything outside the path
        // keep outside -> punch the path out of the photo
        cx.globalCompositeOperation = keep === 'inside' ? 'destination-in' : 'destination-out';
        cx.fill();

        const dataURL = c.toDataURL('image/png');
        const fileId = `cut_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
        a.addFiles([{ id: fileId, mimeType: 'image/png', dataURL, created: Date.now() }]);
        const mod = await loadBundle();
        const [outEl] = mod.convertToExcalidrawElements([{
          type: 'image', fileId,
          x: imgEl.x, y: imgEl.y, width: imgEl.width, height: imgEl.height,
        }]);
        // the cut REPLACES the photo, and the guide stroke goes with it —
        // that is the whole point of a lasso, and Ctrl+Z restores both
        a.updateScene({
          elements: [
            ...a.getSceneElements().filter((el) => el.id !== imgEl.id && el.id !== pathEl.id),
            outEl,
          ],
        });
        setStatus(keep === 'inside' ? 'recortado con el trazo' : 'interior del trazo borrado');
      } catch (err) {
        console.error('[notas] recorte', err);
        setStatus('no se pudo recortar');
      }
    };

    /* Hovering a cut button paints, on the overlay, a translucent tint over
       exactly the pixels that would disappear — so you can see the cut
       before committing it. Uses the same scene→viewport transform the
       frame bars use: (scene + scroll) * zoom. */
    const clearCutPreview = () => {
      if (!overlay.width || !overlay.height) return;
      octx.setTransform(1, 0, 0, 1, 0, 0);
      octx.clearRect(0, 0, overlay.width, overlay.height);
    };
    const paintCutPreview = (keep) => {
      const a = api(); if (!a) return;
      const live = selectedIds();
      const ids = new Set(live.length ? live : preFlyoutSelection);
      const sel = a.getSceneElements().filter((el) => ids.has(el.id) && !el.isDeleted);
      const imgEl = sel.find((el) => el.type === 'image');
      const pathEl = sel.find((el) => el.type !== 'image' && el.points?.length);
      if (!imgEl || !pathEl) return;
      const st = a.getAppState();
      const zoom = st.zoom?.value || 1;
      const sx = st.scrollX || 0, sy = st.scrollY || 0;
      const toView = (x, y) => [(x + sx) * zoom, (y + sy) * zoom];

      const r = overlay.getBoundingClientRect();
      const d = Math.min(2, window.devicePixelRatio || 1);
      overlay.width = r.width * d; overlay.height = r.height * d;
      octx.setTransform(d, 0, 0, d, 0, 0);
      octx.clearRect(0, 0, r.width, r.height);

      octx.beginPath();
      pathEl.points.forEach(([px, py], i) => {
        const [vx, vy] = toView(pathEl.x + px, pathEl.y + py);
        if (i === 0) octx.moveTo(vx, vy); else octx.lineTo(vx, vy);
      });
      octx.closePath();
      if (keep === 'inside') {
        // everything OUTSIDE the trace but inside the photo goes away
        const [ix, iy] = toView(imgEl.x, imgEl.y);
        octx.save();
        octx.rect(ix, iy, imgEl.width * zoom, imgEl.height * zoom);
        octx.fillStyle = 'rgba(255, 92, 92, 0.42)';
        octx.fill('evenodd');
        octx.restore();
      } else {
        octx.fillStyle = 'rgba(255, 92, 92, 0.42)';
        octx.fill();
      }
      // outline the trace so the boundary reads clearly either way
      octx.strokeStyle = '#26e0ff';
      octx.lineWidth = 1.5;
      octx.stroke();
    };
    studio.querySelectorAll('[data-cut]').forEach((btn) => {
      btn.addEventListener('mouseenter', () => paintCutPreview(btn.dataset.cut));
      btn.addEventListener('mouseleave', clearCutPreview);
      btn.addEventListener('focus', () => paintCutPreview(btn.dataset.cut));
      btn.addEventListener('blur', clearCutPreview);
    });

    studio.querySelector('[data-cut-row]')?.addEventListener('click', async (e) => {
      clearCutPreview();
      const btn = e.target.closest('[data-cut]');
      if (!btn) return;
      const a = api(); if (!a) return;
      const live = selectedIds();
      const ids = new Set(live.length ? live : preFlyoutSelection);
      const sel = a.getSceneElements().filter((el) => ids.has(el.id) && !el.isDeleted);
      const imgEl = sel.find((el) => el.type === 'image');
      // prefer a freedraw trace; fall back to any non-image with points
      const pathEl = sel.find((el) => el.type === 'freedraw' && el.points?.length)
        || sel.find((el) => el.type !== 'image' && el.points?.length);
      if (!imgEl || !pathEl) {
        setStatus('seleccioná el trazo + la foto juntos (Shift) para recortar');
        return;
      }
      await cutImageWithPath(pathEl, imgEl, btn.dataset.cut);
    });
    maskInput.addEventListener('change', async () => {
      const f = maskInput.files?.[0];
      const target = maskTargetEl; maskTargetEl = null;
      if (!f || !target) return;
      try {
        const contentImg = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = reader.result;
          };
          reader.onerror = reject;
          reader.readAsDataURL(f);
        });
        await applyMaskToImage(target, contentImg);
      } catch (err) {
        console.error('[notas] máscara', err);
        setStatus('no se pudo aplicar la máscara');
      } finally {
        maskInput.value = '';
      }
    });

    radR.addEventListener('input', () => {
      const v = Number(radR.value);
      studio.querySelector('[data-sect="radius"] [data-val="radius"]').textContent = `${v}px`;
      const n = patchSelected(() => ({ roundness: v === 0 ? null : { type: 3, value: v } }));
      if (!n) setStatus('seleccioná algo para cambiarle el radius');
    });

    /* — background: one button steps through the curated surfaces — */
    studio.querySelector('[data-act="surface"]').addEventListener('click', () => {
      applySurface(state.surfaceIdx + 1);
      setStatus(`fondo: ${SURFACES[state.surfaceIdx].label}`);
    });

    /* — format guides: a Canva-style grid of reference rectangles you drop
       onto the (still infinite) canvas as a work-table, never a real crop */
    const formatsBtn = studio.querySelector('[data-act="formats"]');
    const formatsPop = studio.querySelector('[data-formats-pop]');
    formatsPop.innerHTML =
      `<div class="n-format-px" data-format-px>
        <span class="n-format-px__now" data-format-px-now>—</span>
        <div class="n-format-px__row">
          <input type="number" min="16" max="8000" step="1" data-px-w aria-label="Ancho en píxeles" />
          <span>×</span>
          <input type="number" min="16" max="8000" step="1" data-px-h aria-label="Alto en píxeles" />
          <button type="button" data-px-apply>Aplicar</button>
        </div>
      </div>` +
      FORMATS.map((f) => {
        const w = f.ratio >= 1 ? 34 : 34 * f.ratio;
        const h = f.ratio >= 1 ? 34 / f.ratio : 34;
        return `<button type="button" class="n-format" data-format="${f.id}" title="${f.label} — ${f.px[0]}×${f.px[1]}px">
          <span class="n-format__box" style="width:${w.toFixed(1)}px;height:${h.toFixed(1)}px"></span>
          <em>${f.label}</em>
        </button>`;
      }).join('');
    let ruleArmedFrameId = null;   // frame whose edges are armed for pulling new guides
    let ruleMode = 'off';          // 'off' | 'crear' | 'mover'
    let ruleModeFrameId = null;    // which frame the mode belongs to
    const closeFormats = () => {
      formatsPop.hidden = true;
      // undo the fixed positioning a frame-anchored resize may have set,
      // so the top-bar button gets its normal dropdown back next time
      formatsPop.style.position = '';
      formatsPop.style.left = '';
      formatsPop.style.top = '';
      delete formatsPop.dataset.mode;
      resizeTargetFrame = null;
    };
    formatsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      formatsPop.hidden = !formatsPop.hidden;
    });
    // pointerdown + capture, not 'click': while a texture brush is armed,
    // the brush's own pointerdown handler calls preventDefault(), which
    // suppresses the browser's synthesized 'click' event entirely — so a
    // 'click'-based dismiss listener silently stopped firing the instant
    // you started drawing, and the popover looked permanently stuck open.
    // Both listeners live on `document` in the SAME phase (capture), so
    // this one still fires even when the brush handler also intercepts
    // and stopPropagation()s the same event — sibling listeners on one
    // node always run regardless of a sibling's stopPropagation.
    document.addEventListener('pointerdown', (e) => {
      if (!formatsPop.hidden && !e.target.closest('[data-formats-wrap]')) closeFormats();
    }, true);
    /* format guides are real Excalidraw FRAMES, not plain rectangles —
       frames are a native engine concept: they already come with an
       editable name label (double-click to rename, natively) and a
       genuine content boundary Excalidraw itself clips/tracks (elements
       dropped inside get frameId set automatically), which is exactly
       what "mesa de trabajo" needs and rectangles can't give us for free.
       Placement follows the mouse (a small DOM ghost, not a real canvas
       element yet) until you click to drop it — never centered blindly. */
    let pendingFormat = null;
    let formatGhost = null;
    let resizeTargetFrame = null;   // set when the grid is opened from a frame's "Resize"
    const cancelFormatPlacement = () => {
      pendingFormat = null;
      formatGhost?.remove();
      formatGhost = null;
      studio.style.cursor = '';
    };
    const startFormatPlacement = (fmt) => {
      pendingFormat = fmt;
      closeFormats();
      const gw = fmt.ratio >= 1 ? 170 : 170 * fmt.ratio;
      const gh = fmt.ratio >= 1 ? 170 / fmt.ratio : 170;
      formatGhost = document.createElement('div');
      formatGhost.className = 'n-format-ghost';
      formatGhost.style.width = `${gw}px`;
      formatGhost.style.height = `${gh}px`;
      formatGhost.textContent = fmt.label;
      studio.appendChild(formatGhost);
      studio.style.cursor = 'crosshair';
      setStatus(`clic para poner "${fmt.label}" como mesa de trabajo — Escape cancela`);
    };
    formatsPop.addEventListener('click', async (e) => {
      // custom pixel size: same code path as a preset, just with an
      // ad-hoc format object built from the two inputs
      if (e.target.closest('[data-px-apply]')) {
        const cw = Math.round(Number(formatsPop.querySelector('[data-px-w]').value));
        const ch = Math.round(Number(formatsPop.querySelector('[data-px-h]').value));
        if (!(cw >= 16 && ch >= 16)) { setStatus('poné un ancho y alto válidos (mínimo 16px)'); return; }
        const custom = { id: 'custom', label: `${cw}×${ch}`, px: [cw, ch], ratio: cw / ch };
        if (resizeTargetFrame) {
          const target = resizeTargetFrame;
          closeFormats();
          await resizeFrameTo(target, custom);
        } else {
          startFormatPlacement(custom);
        }
        return;
      }
      const btn = e.target.closest('[data-format]');
      if (!btn) return;
      const fmt = FORMATS.find((f) => f.id === btn.dataset.format);
      if (!fmt) return;
      // same grid serves two jobs: placing a NEW worktable (ghost follows
      // the mouse) and picking the target ratio for a resize of an
      // existing one — `resizeTargetFrame` is what tells them apart
      if (resizeTargetFrame) {
        const target = resizeTargetFrame;
        resizeTargetFrame = null;
        delete formatsPop.dataset.mode;
        closeFormats();
        await resizeFrameTo(target, fmt);
        return;
      }
      startFormatPlacement(fmt);
    });
    document.addEventListener('pointermove', (e) => {
      if (!formatGhost) return;
      formatGhost.style.left = `${e.clientX - formatGhost.offsetWidth / 2}px`;
      formatGhost.style.top = `${e.clientY - formatGhost.offsetHeight / 2}px`;
    });
    document.addEventListener('pointerdown', async (e) => {
      if (!pendingFormat) return;
      if (isChrome(e.target)) return; // clicking dock/panel/etc. shouldn't drop a frame under it
      e.preventDefault();
      e.stopPropagation();
      const fmt = pendingFormat;
      cancelFormatPlacement();
      const a = api(); if (!a) return;
      // the frame measures its REAL pixel size in canvas units, so export
      // is a 1:1 render with no upscaling — that resampling is exactly why
      // exported posts looked soft/out of focus before. Frames are big now;
      // zoom out to compose, which is the intended way to work anyway.
      const w = fmt.px[0];
      const h = fmt.px[1];
      const mod = await loadBundle();
      const dropAt = mod.viewportCoordsToSceneCoords({ clientX: e.clientX, clientY: e.clientY }, a.getAppState());
      // convertToExcalidrawElements throws internally when asked to build
      // type:'frame' directly (some internal frame-children pass expects
      // context this single-element call doesn't have) — converting as a
      // plain rectangle instead gets a fully valid id/version/index/seed
      // from the known-working path, then relabeling it client-side as a
      // frame sidesteps the crash entirely; the extra shape-only fields
      // (strokeColor etc.) are simply ignored by the engine's frame render
      const [base] = mod.convertToExcalidrawElements([{
        type: 'rectangle',
        x: dropAt.x - w / 2, y: dropAt.y - h / 2, width: w, height: h,
      }]);
      // NOT locked: locking a frame makes it unselectable, which silently
      // broke BOTH moving it by its border AND the "PNG mesa" export (the
      // export needs the frame selected to know what to render). The
      // pixel-exact size is protected by the floating toolbar's own
      // resize flow instead, not by freezing the element.
      // remember which preset this is so Export can render at its real
      // platform pixel size instead of whatever it happens to measure on canvas
      const frame = { ...base, type: 'frame', name: fmt.label, customData: { shFormat: fmt.id } };
      a.updateScene({ elements: [...a.getSceneElements(), frame] });
      setStatus(`mesa "${fmt.label}" creada — arrastrala del borde para moverla con todo lo que tenga adentro`);
    }, true);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && pendingFormat) { cancelFormatPlacement(); setStatus('cancelado'); }
      if (e.key === 'Escape' && (ruleArmedFrameId || ruleDrag)) {
        // an in-flight ruler drag has a DOM preview node parented to the
        // studio — bailing out without removing it leaves a cyan line
        // stuck on screen with nothing driving it, which is one of the
        // "se rompe visualmente, tengo que tirar F5" cases
        ruleArmedFrameId = null;
        ruleDrag = null;
        killRulePreview();
        frameBarHost()?.querySelectorAll('[data-frame-rule]').forEach((b) => b.classList.remove('is-active'));
        setStatus('reglas desarmadas');
      }
    }, true);

    /* — move the whole worktable from its bar handle —
       drags the frame AND everything with a matching frameId, so the
       composition travels as one piece. Excalidraw would move children
       along with a frame it owns, but going through the imperative API
       keeps it predictable and works the same whether or not the engine
       considers the frame "selected". */
    let moveState = null;
    frameBarHost()?.addEventListener('pointerdown', (e) => {
      const handle = e.target.closest('[data-frame-move]');
      if (!handle) return;
      const a = api(); if (!a) return;
      const id = handle.dataset.frameMove;
      const appState = a.getAppState();
      const zoom = appState.zoom?.value;
      moveState = {
        id,
        zoom: Number.isFinite(zoom) && zoom > 0 ? zoom : 1,
        startX: e.clientX,
        startY: e.clientY,
        // snapshot the starting positions so every move is computed from
        // the original, never accumulated (which would drift)
        origins: new Map(
          a.getSceneElements()
            .filter((el) => el.id === id || el.frameId === id)
            .map((el) => [el.id, { x: el.x, y: el.y }]),
        ),
      };
      e.preventDefault();
      e.stopPropagation();
    });
    /* Listeners live on `document`, NOT on the handle, and deliberately do
       NOT use setPointerCapture. renderFrameBars() sets display:none on a
       bar whose frame scrolls out of view — and hiding an element that
       holds pointer capture silently drops the capture, so the pointerup
       never arrived, `moveState` stayed alive, and every later mouse move
       kept dragging the frame into the distance. That is the bug where
       "everything I had loaded disappears": the artwork was still there,
       just hurled thousands of units off-screen. Document listeners end
       the drag no matter what happens to the bar. */
    document.addEventListener('pointermove', (e) => {
      if (!moveState) return;
      const a = api(); if (!a) return;
      const dx = (e.clientX - moveState.startX) / moveState.zoom;
      const dy = (e.clientY - moveState.startY) / moveState.zoom;
      if (!Number.isFinite(dx) || !Number.isFinite(dy)) return;
      const next = a.getSceneElements().map((el) => {
        const o = moveState.origins.get(el.id);
        if (!o) return el;
        const nx = o.x + dx, ny = o.y + dy;
        if (!Number.isFinite(nx) || !Number.isFinite(ny)) return el;
        return { ...el, x: nx, y: ny, version: (el.version || 1) + 1, versionNonce: Math.floor(Math.random() * 2 ** 31), updated: Date.now() };
      });
      a.updateScene({ elements: next });
    });
    const endFrameMove = () => { moveState = null; };
    document.addEventListener('pointerup', endFrameMove);
    document.addEventListener('pointercancel', endFrameMove);
    window.addEventListener('blur', endFrameMove);

    /* — rulers: drag inward from a worktable's edge to lay a guide —
       Photoshop's model: pulling from a side edge gives a vertical guide,
       pulling from top/bottom gives a horizontal one. Guides are real
       line elements tagged customData.shGuide so exportFrame can strip
       them out — they are composition aids, never part of the artwork. */
    let ruleDrag = null;
    let rulePreview = null;

    /* scene↔viewport without awaiting anything: these handlers MUST stay
       synchronous. The first version was `async` and called preventDefault
       AFTER `await loadBundle()` — by then the event had long since
       propagated, so the guard did nothing and `ruleDrag` could be set
       after the pointer was already released, leaving a stale drag that
       fired on some later, unrelated pointerup. */
    const sceneOf = (clientX, clientY, appState) => {
      const zoom = appState.zoom?.value || 1;
      return { x: clientX / zoom - (appState.scrollX || 0), y: clientY / zoom - (appState.scrollY || 0) };
    };
    const viewOf = (sx, sy, appState) => {
      const zoom = appState.zoom?.value || 1;
      return { x: (sx + (appState.scrollX || 0)) * zoom, y: (sy + (appState.scrollY || 0)) * zoom };
    };

    /* magnetic stops: the frame split into eighths (so halves, quarters
       and eighths all land) plus both edges. Free everywhere else. */
    const snapGuide = (frame, vertical, val) => {
      const start = vertical ? frame.x : frame.y;
      const size = vertical ? frame.width : frame.height;
      const tol = size * 0.025;
      let best = val, bestD = Infinity;
      for (let i = 0; i <= 8; i++) {
        const stop = start + (size * i) / 8;
        const d = Math.abs(val - stop);
        if (d < bestD) { bestD = d; best = stop; }
      }
      return bestD <= tol ? { val: best, snapped: true } : { val, snapped: false };
    };

    const killRulePreview = () => { rulePreview?.remove(); rulePreview = null; };
    /* any way a drag can end abnormally must also clean up, or the
       preview node outlives the interaction and sits on screen forever */
    const abortRuleDrag = () => { ruleDrag = null; killRulePreview(); };
    document.addEventListener('pointercancel', abortRuleDrag);
    window.addEventListener('blur', abortRuleDrag);

    document.addEventListener('pointerdown', (e) => {
      if (!ruleArmedFrameId || isChrome(e.target)) return;
      const a = api(); if (!a) return;
      const frame = a.getSceneElements().find((el) => el.id === ruleArmedFrameId && !el.isDeleted);
      if (!frame) return;
      const appState = a.getAppState();
      const p = sceneOf(e.clientX, e.clientY, appState);
      const edge = Math.min(frame.width, frame.height) * 0.06;
      const nearL = Math.abs(p.x - frame.x) < edge;
      const nearR = Math.abs(p.x - (frame.x + frame.width)) < edge;
      const nearT = Math.abs(p.y - frame.y) < edge;
      const nearB = Math.abs(p.y - (frame.y + frame.height)) < edge;
      const inside = p.x >= frame.x - edge && p.x <= frame.x + frame.width + edge
        && p.y >= frame.y - edge && p.y <= frame.y + frame.height + edge;
      if (!inside || !(nearL || nearR || nearT || nearB)) return;
      ruleDrag = { frameId: frame.id, vertical: nearL || nearR };
      rulePreview = document.createElement('div');
      rulePreview.className = 'n-rule-preview';
      studio.appendChild(rulePreview);
      e.preventDefault();
      e.stopPropagation();
    }, true);

    document.addEventListener('pointermove', (e) => {
      if (!ruleDrag || !rulePreview) return;
      const a = api(); if (!a) return;
      const frame = a.getSceneElements().find((el) => el.id === ruleDrag.frameId && !el.isDeleted);
      if (!frame) return;
      const appState = a.getAppState();
      const p = sceneOf(e.clientX, e.clientY, appState);
      const raw = ruleDrag.vertical ? p.x : p.y;
      const { val, snapped } = snapGuide(frame, ruleDrag.vertical, raw);
      const a0 = viewOf(frame.x, frame.y, appState);
      const a1 = viewOf(frame.x + frame.width, frame.y + frame.height, appState);
      const pos = ruleDrag.vertical
        ? viewOf(clamp(val, frame.x, frame.x + frame.width), frame.y, appState)
        : viewOf(frame.x, clamp(val, frame.y, frame.y + frame.height), appState);
      rulePreview.classList.toggle('is-snapped', snapped);
      if (ruleDrag.vertical) {
        rulePreview.style.left = `${pos.x}px`;
        rulePreview.style.top = `${a0.y}px`;
        rulePreview.style.width = '0px';
        rulePreview.style.height = `${Math.max(0, a1.y - a0.y)}px`;
      } else {
        rulePreview.style.left = `${a0.x}px`;
        rulePreview.style.top = `${pos.y}px`;
        rulePreview.style.width = `${Math.max(0, a1.x - a0.x)}px`;
        rulePreview.style.height = '0px';
      }
    });

    document.addEventListener('pointerup', (e) => {
      if (!ruleDrag) return;
      const { frameId, vertical } = ruleDrag;
      ruleDrag = null;
      killRulePreview();
      const a = api(); if (!a) return;
      const frame = a.getSceneElements().find((el) => el.id === frameId && !el.isDeleted);
      if (!frame) return;
      const appState = a.getAppState();
      const p = sceneOf(e.clientX, e.clientY, appState);
      const { val, snapped } = snapGuide(frame, vertical, vertical ? p.x : p.y);
      loadBundle().then((mod) => {
        const [guide] = mod.convertToExcalidrawElements([{
          type: 'line',
          x: vertical ? clamp(val, frame.x, frame.x + frame.width) : frame.x,
          y: vertical ? frame.y : clamp(val, frame.y, frame.y + frame.height),
          width: vertical ? 0 : frame.width,
          height: vertical ? frame.height : 0,
          points: vertical ? [[0, 0], [0, frame.height]] : [[0, 0], [frame.width, 0]],
          strokeColor: '#26e0ff', strokeWidth: 1, strokeStyle: 'solid', roughness: 0,
        }]);
        const locked = { ...guide, frameId: frame.id, locked: true, customData: { shGuide: true } };
        a.updateScene({ elements: [...a.getSceneElements(), locked] });
        setStatus(`regla ${vertical ? 'vertical' : 'horizontal'}${snapped ? ' (imantada)' : ''} puesta`);
      }).catch((err) => {
        console.error('[notas] regla', err);
        setStatus('no se pudo poner la regla');
      });
    });

    /* — eyedropper —
       Excalidraw HAS one internally (openEyeDropper), but it is `private`
       on the App component — not part of the imperative API, unreachable
       from outside. We use the real standards-track browser EyeDropper
       API instead: it actually does more (samples any pixel on screen,
       including our video background and colour wash, not just the
       canvas). Chromium-family only as of now; feature-detected. */
    const eyedropBtn = studio.querySelector('[data-eyedrop]');
    if (!window.EyeDropper) {
      eyedropBtn.disabled = true;
      eyedropBtn.title = 'Cuentagotas no soportado en este navegador (funciona en Chrome/Edge)';
    } else {
      eyedropBtn.addEventListener('click', async () => {
        try {
          const res = await new window.EyeDropper().open();
          if (res?.sRGBHex) {
            const { h, s, l } = hex2hsl(res.sRGBHex);
            state.hue = h; state.sat = s; state.lit = l;
            pushColor();
          }
        } catch { /* user cancelled (Escape) — not an error */ }
      });
    }

    /* the preview chip washes the surface with the current stroke colour */
    studio.querySelector('[data-preview-chip]').addEventListener('click', () => {
      const amt = state.bg.washAmount > 0 ? 0 : 0.3;
      applyBg({ ...state.bg, wash: state.color, washAmount: amt });
      setStatus(amt ? 'el fondo toma el color del trazo' : 'sin color encima');
    });

    /* the properties window drags by the grip injected into the stock
       Island (see makeIslandDraggable) — nothing to wire here. */

    /* — closing report — */
    studio.querySelector('[data-r-back]').addEventListener('click', resumeClass);
    studio.querySelector('[data-r-discard]').addEventListener('click', () => {
      // nothing was persisted by askClose() anymore, so this really is a
      // no-op on storage — whatever was saved before this session (if
      // anything) is untouched, and a brand-new class just vanishes
      hardClose();
    });
    studio.querySelector('[data-r-save]').addEventListener('click', () => {
      const name = studio.querySelector('[data-r-name]').value.trim();
      if (name) studio.querySelector('[data-notas-title]').value = name;
      persist(false);
      hardClose();
    });

    /* — top bar — */
    studio.querySelector('[data-act="save"]').addEventListener('click', () => persist());
    studio.querySelector('[data-act="close"]').addEventListener('click', askClose);
    studio.querySelector('[data-act="export"]').addEventListener('click', () => {
      persist(false);
      const a = api();
      // the exported JSON is a portable one-off snapshot — unlike the
      // lean localStorage shape, it embeds the actual images so it
      // opens correctly on a machine with no IndexedDB entry for them
      downloadJson({
        ...current,
        scene: { elements: current.scene.elements, files: a ? a.getFiles() : {} },
      });
    });
    studio.querySelector('[data-act="png"]').addEventListener('click', async () => {
      const a = api(); if (!a) return;
      try {
        const mod = await loadBundle();
        const blob = await mod.exportToBlob?.({
          elements: a.getSceneElements(),
          files: a.getFiles(),
          appState: { ...a.getAppState(), exportBackground: false },
          mimeType: 'image/png',
        });
        if (!blob) { setStatus('exportar PNG no disponible'); return; }
        saveBlob(blob, `${(current.name || 'nota').replace(/\s+/g, '-')}.png`);
      } catch (err) {
        console.error('[notas] PNG', err);
        setStatus('no se pudo exportar PNG');
      }
    });

    /* export just what's inside a frame ("mesa de trabajo") — Excalidraw
       auto-assigns frameId to elements visually dropped inside a frame,
       so passing the frame + those children to exportToBlob together
       clips the render to the frame's own bounds, same as the engine's
       own native frame-export behavior */
    const exportFrame = async (frame) => {
      const a = api(); if (!a || !frame) return;
      try {
        const mod = await loadBundle();
        // guides are composition aids, never artwork — they must not
        // appear in a post that ships
        const children = a.getSceneElements().filter(
          (el) => el.frameId === frame.id && !el.isDeleted && !el.customData?.shGuide,
        );
        // render at the preset's REAL platform size (1080×1350 for a 4:5
        // feed post, etc.), not at whatever the frame measures on canvas —
        // `scale` is what actually drives exportToBlob's output resolution
        const fmt = FORMATS.find((f) => f.id === frame.customData?.shFormat);
        const scale = fmt ? fmt.px[0] / frame.width : 1;
        const blob = await mod.exportToBlob?.({
          elements: [frame, ...children],
          files: a.getFiles(),
          appState: {
            ...a.getAppState(),
            exportBackground: false,
            exportPadding: 0,
            // without this the frame's NAME LABEL and outline are counted
            // in the export bounds, which made a 4:5 post come out
            // 1080×1380 instead of 1080×1350 — the label is ~20 canvas px
            // tall and sits above the frame's own top edge
            frameRendering: { enabled: true, name: false, outline: false, clip: true },
          },
          mimeType: 'image/png',
          exportPadding: 0,
          getDimensions: (w, h) => ({ width: w * scale, height: h * scale, scale }),
        });
        if (!blob) { setStatus('no se pudo exportar la mesa'); return; }
        saveBlob(blob, `${(frame.name || 'mesa').replace(/\s+/g, '-')}.png`);
        const px = fmt ? ` (${fmt.px[0]}×${fmt.px[1]}px)` : '';
        setStatus(children.length ? `mesa exportada${px}` : `mesa exportada${px} — estaba vacía`);
      } catch (err) {
        console.error('[notas] PNG mesa', err);
        setStatus('no se pudo exportar la mesa');
      }
    };

    /* the resizer: clone a frame's contents into a DIFFERENT format,
       scaled to fit and re-centered — the whole point of the worktables,
       so one composition can become a square post, a story and a banner
       without rebuilding it three times */
    const resizeFrameTo = async (frame, fmt) => {
      const a = api(); if (!a || !frame || !fmt) return;
      const mod = await loadBundle();
      // same rule as placement: canvas units == real pixels, so the clone
      // exports 1:1 too. Works for the built-in presets and for a custom
      // px pair typed into the resize box.
      const nw = fmt.px[0];
      const nh = fmt.px[1];
      // drop the clone to the right of the original, with a comfortable gap
      const nx = frame.x + frame.width + 80;
      const ny = frame.y;
      const [base] = mod.convertToExcalidrawElements([{
        type: 'rectangle', x: nx, y: ny, width: nw, height: nh,
      }]);
      const newFrame = { ...base, type: 'frame', name: `${fmt.label}`, customData: { shFormat: fmt.id } };

      const children = a.getSceneElements().filter((el) => el.frameId === frame.id && !el.isDeleted);
      // uniform scale keeps the composition's proportions; anything that
      // overflows the narrower axis is the user's call to nudge, which is
      // exactly how Canva's own resize behaves
      const k = Math.min(nw / frame.width, nh / frame.height);
      const clones = children.map((el) => {
        const relX = (el.x - frame.x) * k;
        const relY = (el.y - frame.y) * k;
        const cloned = {
          ...el,
          id: `${el.id}_rz_${Math.random().toString(36).slice(2, 7)}`,
          x: nx + relX + (nw - frame.width * k) / 2,
          y: ny + relY + (nh - frame.height * k) / 2,
          width: (el.width || 0) * k,
          height: (el.height || 0) * k,
          frameId: newFrame.id,
          version: (el.version || 1) + 1,
          versionNonce: Math.floor(Math.random() * 2 ** 31),
          updated: Date.now(),
        };
        if (el.type === 'text') cloned.fontSize = Math.max(6, (el.fontSize || 20) * k);
        if (Array.isArray(el.points)) cloned.points = el.points.map(([px, py]) => [px * k, py * k]);
        return cloned;
      });
      a.updateScene({ elements: [...a.getSceneElements(), newFrame, ...clones] });
      setStatus(`"${frame.name || 'mesa'}" duplicada a ${fmt.label}`);
    };

    studio.querySelector('[data-act="png-frame"]').addEventListener('click', async () => {
      const a = api(); if (!a) return;
      const live = selectedIds();
      const ids = new Set(live.length ? live : preFlyoutSelection);
      const frame = a.getSceneElements().find((el) => ids.has(el.id) && el.type === 'frame');
      if (!frame) { setStatus('seleccioná una mesa de trabajo (frame) para exportarla'); return; }
      await exportFrame(frame);
    });

    /* the per-frame floating bars are re-rendered constantly, so their
       buttons are wired by delegation on the (stable) host instead */
    frameBarHost()?.addEventListener('click', async (e) => {
      const a = api(); if (!a) return;
      const expId = e.target.closest('[data-frame-export]')?.dataset.frameExport;
      const rszId = e.target.closest('[data-frame-resize]')?.dataset.frameResize;
      const rulId = e.target.closest('[data-frame-rule]')?.dataset.frameRule;
      const clsId = e.target.closest('[data-frame-close]')?.dataset.frameClose;
      const nmeId = e.target.closest('[data-frame-name]')?.dataset.frameName;
      const id = expId || rszId || rulId || clsId || nmeId;
      if (!id) return;
      e.stopPropagation();
      const frame = a.getSceneElements().find((el) => el.id === id && !el.isDeleted);
      if (!frame) return;

      if (expId) { await exportFrame(frame); return; }

      if (nmeId) {
        // rename in place: swap the label for an input, commit on Enter or
        // blur, bail on Escape. The frame's `name` is what the engine draws
        // and what the exported PNG is named after.
        const span = e.target.closest('[data-frame-name]');
        if (span.querySelector('input')) return;   // already editing
        const prev = frame.name || 'mesa';
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'n-framebar__rename';
        input.value = prev;
        span.textContent = '';
        span.appendChild(input);
        input.focus();
        input.select();
        let done = false;
        const finish = (commit) => {
          if (done) return;
          done = true;
          const val = input.value.trim();
          span.textContent = commit && val ? val : prev;
          if (commit && val && val !== prev) {
            const cur = api();
            if (cur) {
              cur.updateScene({
                elements: cur.getSceneElements().map((el) => (
                  el.id === id
                    ? { ...el, name: val, version: (el.version || 1) + 1, versionNonce: Math.floor(Math.random() * 2 ** 31), updated: Date.now() }
                    : el
                )),
              });
              setStatus(`mesa renombrada a "${val}"`);
            }
          }
        };
        input.addEventListener('keydown', (ev) => {
          ev.stopPropagation();   // keep dock shortcuts from firing while typing
          if (ev.key === 'Enter') { ev.preventDefault(); finish(true); }
          if (ev.key === 'Escape') { ev.preventDefault(); finish(false); }
        });
        input.addEventListener('blur', () => finish(true));
        return;
      }

      if (clsId) {
        /* A worktable is a unit: it owns its contents. Franco works free
           on the open canvas and MOVES finished sequences into frames to
           organise them, so deleting the frame deleting its contents is
           the expected behaviour (and matches the engine's own native
           frame delete). Ctrl+Z brings it all back. */
        const kids = a.getSceneElements().filter((el) => el.frameId === id && !el.isDeleted);
        const art = kids.filter((el) => !el.customData?.shGuide);
        if (art.length && !window.confirm(
          `Borrar "${frame.name || 'mesa'}" y sus ${art.length} elemento${art.length > 1 ? 's' : ''} adentro.\n\n` +
          'Se borra la mesa con todo su contenido. Ctrl+Z lo deshace.',
        )) return;
        const next = a.getSceneElements().filter((el) => el.id !== id && el.frameId !== id);
        a.updateScene({ elements: next });
        if (ruleArmedFrameId === id) ruleArmedFrameId = null;
        if (ruleModeFrameId === id) { ruleModeFrameId = null; ruleMode = 'off'; }
        setStatus(art.length
          ? `mesa borrada con ${art.length} elemento${art.length > 1 ? 's' : ''} adentro`
          : 'mesa borrada');
        return;
      }

      if (rulId) {
        /* three states, cycled by clicking: crear → fijas → escondidas.
           The old middle state unlocked the guides so they could be
           dragged with the cursor — that fought the engine's own
           selection and broke things, so it is gone. Hiding them is what
           was actually wanted: compose against them, then make them
           disappear without deleting them. */
        ruleMode = ruleModeFrameId === id
          ? (ruleMode === 'crear' ? 'fijas' : ruleMode === 'fijas' ? 'oculto' : 'crear')
          : 'crear';
        ruleModeFrameId = id;
        ruleArmedFrameId = ruleMode === 'crear' ? id : null;

        // guides stay locked ALWAYS; only their visibility changes
        const hide = ruleMode === 'oculto';
        const next = a.getSceneElements().map((el) => (
          el.frameId === id && el.customData?.shGuide
            ? {
              ...el, locked: true, opacity: hide ? 0 : 100,
              version: (el.version || 1) + 1,
              versionNonce: Math.floor(Math.random() * 2 ** 31),
              updated: Date.now(),
            }
            : el
        ));
        a.updateScene({ elements: next });

        frameBarHost().querySelectorAll('[data-frame-rule]').forEach((b) => {
          const mine = b.dataset.frameRule === id;
          b.classList.toggle('is-active', mine && ruleMode === 'crear');
          b.classList.toggle('is-hidden', mine && ruleMode === 'oculto');
        });
        if (ruleMode !== 'crear') { ruleDrag = null; killRulePreview(); }
        setStatus(
          ruleMode === 'crear' ? 'reglas: CREAR — arrastrá desde un borde hacia adentro'
            : ruleMode === 'fijas' ? 'reglas: fijas — visibles, no se tocan'
              : 'reglas: escondidas — siguen ahí, invisibles',
        );
        return;
      }

      // resize: reuse the same format grid, but anchored under THIS bar's
      // Resize button instead of way up in the top bar
      resizeTargetFrame = frame;
      const btn = e.target.closest('[data-frame-resize]');
      const r = btn.getBoundingClientRect();
      formatsPop.hidden = false;
      formatsPop.dataset.mode = 'resize';
      // show what this frame currently measures, and prefill the custom
      // inputs with it so "make it a bit wider" is a two-keystroke edit
      const curW = Math.round(frame.width);
      const curH = Math.round(frame.height);
      formatsPop.querySelector('[data-format-px-now]').textContent = `ahora: ${curW} × ${curH} px`;
      formatsPop.querySelector('[data-px-w]').value = String(curW);
      formatsPop.querySelector('[data-px-h]').value = String(curH);
      // move it out of the top-bar wrapper's flow into fixed coords for
      // this one use, then restore on close (see closeFormats)
      formatsPop.style.position = 'fixed';
      formatsPop.style.left = `${clamp(r.left, 8, window.innerWidth - 336)}px`;
      formatsPop.style.top = `${Math.min(r.bottom + 8, window.innerHeight - 240)}px`;
      setStatus(`elegí formato o escribí los píxeles para duplicar "${frame.name || 'mesa'}"`);
    });

    pushColor();
  }

  /* ═══════ helpers ═══════ */
  const saveBlob = (blob, name) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const downloadJson = (nota) => {
    saveBlob(
      new Blob([JSON.stringify({ type: SCHEMA, version: SCHEMA_VERSION, ...nota }, null, 2)],
        { type: 'application/json' }),
      `${(nota.name || 'nota').replace(/\s+/g, '-')}.json`,
    );
  };

  /* ═══════ section buttons ═══════ */
  newBtn?.addEventListener('click', () => {
    const nota = {
      id: uid(), type: SCHEMA, version: SCHEMA_VERSION,
      name: '', createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      accent: '#14140f', background: defaultBg(),
      durationMs: 0, brushCm: 0,
      scene: { elements: [], fileIds: [] },
    };
    notes.push(nota); saveAll(notes); renderList();
    openStudio(nota);
  });

  importBtn?.addEventListener('click', () => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'application/json';
    inp.addEventListener('change', async () => {
      const f = inp.files?.[0]; if (!f) return;
      try {
        const parsed = JSON.parse(await f.text());
        const files = parsed.scene?.files || parsed.files || {};
        const fileIds = Object.keys(files);
        if (fileIds.length) idbPutFiles(files).catch(() => {});
        const nota = {
          id: uid(), type: SCHEMA, version: SCHEMA_VERSION,
          name: parsed.name || f.name.replace(/\.json$/i, ''),
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
          accent: parsed.accent || '#6d5efc',
          background: parsed.background || defaultBg(),
          durationMs: parsed.durationMs || 0, brushCm: parsed.brushCm || 0,
          preview: parsed.preview || null, excerpt: parsed.excerpt || '',
          scene: { elements: parsed.scene?.elements || parsed.elements || [], fileIds },
        };
        notes.push(nota); saveAll(notes); renderList();
        openStudio(nota, files);   // skip the idb round-trip, we already have them
      } catch (err) {
        console.error('[notas] JSON inválido', err);
        window.alert('Ese archivo no es un JSON de nota válido.');
      }
    });
    inp.click();
  });

  renderList();
}
