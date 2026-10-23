// FP · STORE — vault local en IndexedDB (local-first, 03 §12.5 / §13).
// Stores: profile (key 'me'), days (key = fecha ISO), sessions (Motion Lab), media (blobs: fotos), labs (estudios, sensible).
// Nada sale del dispositivo salvo export manual. Cada escritura dispara 'fp-data-changed'.
console.log('[fp/store] init');

const DB_NAME = 'francoprofile';
const DB_VER = 1;
const STORES = ['profile', 'days', 'sessions', 'media', 'labs'];

let dbp = null;

function req(r) {
  return new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
}

export function open() {
  if (dbp) return dbp;
  dbp = new Promise((res, rej) => {
    if (!('indexedDB' in window)) { rej(new Error('IndexedDB no disponible')); return; }
    const r = indexedDB.open(DB_NAME, DB_VER);
    r.onupgradeneeded = () => {
      const db = r.result;
      if (!db.objectStoreNames.contains('profile')) db.createObjectStore('profile');
      if (!db.objectStoreNames.contains('days')) db.createObjectStore('days', { keyPath: 'date' });
      if (!db.objectStoreNames.contains('sessions')) db.createObjectStore('sessions', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('media')) db.createObjectStore('media', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('labs')) db.createObjectStore('labs', { keyPath: 'id' });
    };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  return dbp;
}

async function tx(store, mode, fn) {
  const db = await open();
  return new Promise((res, rej) => {
    const t = db.transaction(store, mode);
    const s = t.objectStore(store);
    let out;
    Promise.resolve(fn(s)).then((v) => { out = v; }).catch(rej);
    t.oncomplete = () => res(out);
    t.onerror = () => rej(t.error);
    t.onabort = () => rej(t.error);
  });
}

const getAll = (store) => tx(store, 'readonly', (s) => req(s.getAll()));
const get = (store, key) => tx(store, 'readonly', (s) => req(s.get(key)));
const put = (store, val, key) => tx(store, 'readwrite', (s) => req(key === undefined ? s.put(val) : s.put(val, key)));
const del = (store, key) => tx(store, 'readwrite', (s) => req(s.delete(key)));
const clear = (store) => tx(store, 'readwrite', (s) => req(s.clear()));

export function emit(kind, extra = {}) {
  document.dispatchEvent(new CustomEvent('fp-data-changed', { detail: { kind, ...extra } }));
}

/* ── perfil ─────────────────────────────── */

export const DEFAULT_PROFILE = {
  v: 1,
  updatedAt: null,
  base: { heightCm: null, weightKg: null, dominantHand: null, usualLoadKg: null },
  goal: { targetKg: 65.25, targetRange: [65, 65.5], targetDate: '2026-12-22' },
  plan: { trainDays: ['mon', 'tue', 'wed', 'fri', 'sat'], restDays: ['thu', 'sun'], variant6d: false, slot: null },
  intake: { proteinG: [110, 130], waterL: 3, creatineG: 5, preWorkoutMin: 25, waterCreatineBefore: null },
  cardio: { mode: 'A', runKmPerSession: 10, runsPerWeek: 3 },
  care: { thumb: 'Molestia en un pulgar: evitar agarres que lo carguen.' },
  prefs: { sound: false },
};

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
function merge(a, b) {
  const out = { ...a };
  for (const k of Object.keys(b || {})) out[k] = isObj(a?.[k]) && isObj(b[k]) ? merge(a[k], b[k]) : b[k];
  return out;
}

export async function getProfile() {
  const p = await get('profile', 'me');
  return merge(DEFAULT_PROFILE, p || {});
}
export async function hasProfile() { return !!(await get('profile', 'me')); }
export async function saveProfile(patch) {
  const cur = (await get('profile', 'me')) || {};
  const next = merge(merge(DEFAULT_PROFILE, cur), patch);
  next.updatedAt = new Date().toISOString();
  await put('profile', next, 'me');
  emit('profile');
  return next;
}

/* ── días ───────────────────────────────── */

export function blankDay(date) {
  return {
    v: 1, date, demo: false,
    blocks: { subidon: false, fuerza: false, bolsa: false },
    sets: [],
    intake: { waterL: 0, creatine: false },
    meals: [],
    checkin: null,
    run: null,
    measures: null,
    bodyPhotos: [],
    updatedAt: null,
  };
}

export const getDay = (date) => get('days', date);
export async function getDayOrNew(date) { return (await getDay(date)) || blankDay(date); }

/**
 * Lee-modifica-escribe un día. fn(day) muta o devuelve uno nuevo.
 * Si el día era de EJEMPLO, arranca de un día en blanco: lo que escribís vos nunca se mezcla con el ejemplo.
 */
export async function updateDay(date, fn) {
  let day = await getDay(date);
  if (!day || day.demo) day = blankDay(date);
  const r = await fn(day);
  const next = r || day;
  next.demo = false;
  next.updatedAt = new Date().toISOString();
  await put('days', next);
  emit('day', { date });
  return next;
}
export async function putDay(day, { silent = false } = {}) {
  await put('days', day);
  if (!silent) emit('day', { date: day.date });
  return day;
}
export async function allDays() {
  const all = await getAll('days');
  return all.sort((a, b) => a.date.localeCompare(b.date));
}
export async function listDays({ from = '0000', to = '9999' } = {}) {
  return (await allDays()).filter((d) => d.date >= from && d.date <= to);
}
export async function deleteDay(date) { await del('days', date); emit('day', { date }); }

/* ── Motion Lab ─────────────────────────── */

export async function listSessions() {
  const all = await getAll('sessions');
  return all.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}
export const getSession = (id) => get('sessions', id);
export async function putSession(s, { silent = false } = {}) { await put('sessions', s); if (!silent) emit('session', { id: s.id }); return s; }
export async function deleteSession(id) { await del('sessions', id); emit('session', { id }); }

/* ── media (fotos: SENSIBLE, nunca sale del dispositivo) ── */

export async function putMedia(blob, meta = {}) {
  const id = meta.id || `media-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  await put('media', { id, blob, type: blob.type, size: blob.size, createdAt: new Date().toISOString(), ...meta });
  emit('media', { id });
  return id;
}
export const getMedia = (id) => get('media', id);
export async function deleteMedia(id) { await del('media', id); emit('media', { id }); }
export const listMedia = () => getAll('media');
const urlCache = new Map();
/** objectURL cacheado para un id de media (o null). */
export async function mediaURL(id) {
  if (!id) return null;
  if (urlCache.has(id)) return urlCache.get(id);
  const m = await getMedia(id);
  if (!m?.blob) return null;
  const u = URL.createObjectURL(m.blob);
  urlCache.set(id, u);
  return u;
}

/* ── estudios (SENSIBLE: se muestran con su rango, no se interpretan) ── */

export async function listLabs() { return (await getAll('labs')).sort((a, b) => String(b.date).localeCompare(String(a.date))); }
export async function putLab(row) { await put('labs', row); emit('lab'); return row; }
export async function deleteLab(id) { await del('labs', id); emit('lab'); }

/* ── vault: export / import / borrar ───── */

const blobToDataURL = (blob) => new Promise((res) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.readAsDataURL(blob); });
async function dataURLToBlob(u) { return (await fetch(u)).blob(); }

export async function exportVault({ includeMedia = false, includeLabs = false } = {}) {
  const out = {
    v: 1,
    app: 'francoprofile',
    exportedAt: new Date().toISOString(),
    warning: 'Este archivo contiene datos personales. No lo subas a ningún repo ni bucket público.',
    profile: await get('profile', 'me') || null,
    days: await allDays(),
    sessions: await getAll('sessions'),
    prefs: (() => { const o = {}; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith('fp.')) o[k] = localStorage.getItem(k); } } catch { /* */ } return o; })(),
  };
  if (includeLabs) out.labs = await getAll('labs');
  if (includeMedia) {
    const media = await getAll('media');
    out.media = await Promise.all(media.map(async (m) => ({ ...m, blob: undefined, dataURL: await blobToDataURL(m.blob) })));
  }
  return out;
}

/** Vista previa de un import: qué días son nuevos y cuáles se actualizan. No escribe nada. */
export async function previewImport(obj) {
  if (!obj || obj.app !== 'francoprofile' || !Array.isArray(obj.days)) return { ok: false, error: 'Este archivo no parece un vault de Franco · Perfil vivo (falta "days").' };
  const cur = new Map((await allDays()).map((d) => [d.date, d]));
  let newDays = 0, updatedDays = 0, same = 0;
  for (const d of obj.days) {
    const c = cur.get(d.date);
    if (!c) newDays++;
    else if (JSON.stringify(c) !== JSON.stringify(d)) updatedDays++;
    else same++;
  }
  const curS = new Set((await getAll('sessions')).map((s) => s.id));
  const newSessions = (obj.sessions || []).filter((s) => !curS.has(s.id)).length;
  return { ok: true, newDays, updatedDays, same, newSessions, media: (obj.media || []).length, labs: (obj.labs || []).length, hasProfile: !!obj.profile };
}

/** Merge por fecha: lo que no viene en el archivo NO se borra. */
export async function importVault(obj) {
  const p = await previewImport(obj);
  if (!p.ok) return p;
  if (obj.profile) await put('profile', obj.profile, 'me');
  for (const d of obj.days) await put('days', d);
  for (const s of obj.sessions || []) await put('sessions', s);
  for (const l of obj.labs || []) await put('labs', l);
  for (const m of obj.media || []) {
    if (!m.dataURL) continue;
    const blob = await dataURLToBlob(m.dataURL);
    const { dataURL, ...rest } = m;
    await put('media', { ...rest, blob });
  }
  emit('all');
  return p;
}

export async function clearAll() {
  for (const s of STORES) await clear(s);
  urlCache.forEach((u) => URL.revokeObjectURL(u));
  urlCache.clear();
  emit('all');
}

export async function hasDemo() {
  const days = await getAll('days');
  if (days.some((d) => d.demo)) return true;
  return (await getAll('sessions')).some((s) => s.demo);
}

export async function clearDemo() {
  const days = await getAll('days');
  for (const d of days) if (d.demo) await del('days', d.date);
  const ss = await getAll('sessions');
  for (const s of ss) if (s.demo) await del('sessions', s.id);
  emit('all');
}

/** Estimación de espacio usado (si el navegador lo expone). */
export async function usage() {
  try { const e = await navigator.storage?.estimate?.(); return e ? { used: e.usage, quota: e.quota } : null; } catch { return null; }
}
