// FP · DATA — carga la semilla pública (data/*.json) y arma índices.
// Si existe data/private/seed.local.json (gitignored, solo en la máquina de Franco), siembra el vault la primera vez.
import * as store from './fp-store.js';

console.log('[fp/data] init');

const BASE = new URL('../../data/', import.meta.url);
const cache = new Map();

export async function loadJSON(name) {
  if (cache.has(name)) return cache.get(name);
  const p = fetch(new URL(name, BASE)).then((r) => { if (!r.ok) throw new Error(`${name}: ${r.status}`); return r.json(); });
  cache.set(name, p);
  return p;
}

export async function loadText(name) {
  const r = await fetch(new URL(name, BASE));
  if (!r.ok) throw new Error(`${name}: ${r.status}`);
  return r.text();
}

/** Todo lo público en un objeto. boxer.json se carga aparte (es más pesado): data.boxer() → Promise. */
export async function loadPublicData() {
  const [profile, plan, ex, premises, library, rules, joints] = await Promise.all([
    loadJSON('profile-public.json'), loadJSON('plan-v1.json'), loadJSON('exercises.json'),
    loadJSON('premises.json'), loadJSON('library.json'), loadJSON('rules.json'), loadJSON('joints.json'),
  ]);
  const exById = Object.fromEntries(ex.exercises.map((e) => [e.id, e]));
  const muscleById = Object.fromEntries(ex.muscles.map((m) => [m.id, m]));
  const dayByKey = Object.fromEntries(plan.days.map((d) => [d.key, d]));
  return {
    profile, plan, exercises: ex.exercises, muscles: ex.muscles, exById, muscleById, dayByKey,
    premises: premises.premises, premiseLegend: premises.legend,
    glossary: library.glossary, sources: library.sources, phrases: library.phrases,
    rules: rules.rules, joints,
    boxer: () => loadJSON('boxer.json'),
  };
}

/** Siembra el perfil con los datos declarados [U] si hay seed local y el vault está vacío. */
export async function seedLocalIfFirstRun() {
  try {
    if (await store.hasProfile()) return { seeded: false };
    const r = await fetch(new URL('private/seed.local.json', BASE), { cache: 'no-store' });
    if (!r.ok) return { seeded: false };
    const seed = await r.json();
    if (seed?.profile) {
      await store.saveProfile({ ...seed.profile, seededFrom: 'seed.local.json' });
      console.log('[fp/data] vault sembrado con seed.local.json (datos declarados [U])');
      return { seeded: true };
    }
  } catch { /* sin seed local: está bien */ }
  return { seeded: false };
}
