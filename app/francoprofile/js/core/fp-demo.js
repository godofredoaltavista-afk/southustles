// FP · DEMO — 14 días de EJEMPLO para ver la app llena. Cada registro lleva demo:true,
// la UI los marca «EJEMPLO» y se borran con un click (store.clearDemo). Nunca se presentan como datos de Franco.
// Pseudo-aleatorio con semilla: siempre los mismos números.
import * as store from './fp-store.js';
import * as M from './fp-model.js';

console.log('[fp/demo] init');

function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

const MEALS = [
  { slot: 'desayuno', name: 'Huevos revueltos + pan + café', p: 28, k: 520 },
  { slot: 'desayuno', name: 'Yogur + avena + banana', p: 22, k: 450 },
  { slot: 'almuerzo', name: 'Asado + ensalada + papa', p: 48, k: 900 },
  { slot: 'almuerzo', name: 'Pollo + arroz + verduras', p: 42, k: 760 },
  { slot: 'merienda', name: 'Licuado de proteína + mate', p: 30, k: 320 },
  { slot: 'merienda', name: 'Tostadas + queso + galletitas', p: 14, k: 380 },
  { slot: 'cena', name: 'Milanesa al horno + puré', p: 40, k: 820 },
  { slot: 'cena', name: 'Tortilla de papa + huevo', p: 30, k: 700 },
];

export async function loadDemo(data, { days = 14 } = {}) {
  const today = M.todayISO();
  const R = rng(20261023);
  const existing = new Set((await store.allDays()).map((d) => d.date));
  const profile = await store.getProfile();
  let kg = (profile.base?.weightKg || 62.5) - 0.45;
  let written = 0;
  for (let i = days; i >= 1; i--) {
    const date = M.addDays(today, -i);
    kg += 0.035 + (R() - 0.5) * 0.25;
    if (existing.has(date)) continue;
    const day = store.blankDay(date);
    day.demo = true;
    const pd = M.planFor(date, data, profile);
    const train = !!pd?.train;
    if (train) {
      day.blocks = { subidon: R() > 0.08, fuerza: R() > 0.05, bolsa: R() > 0.3 };
      for (const it of pd.items) {
        const ex = data.exById[it.ex];
        if (!ex || ex.family === 'mobility') continue;
        const [lo, hi] = ex.repRange || [8, 12];
        for (let s = 0; s < it.sets; s++) {
          const reps = Math.max(lo, Math.round(lo + (hi - lo) * (0.35 + R() * 0.6) - s));
          day.sets.push({ id: `demo-${date}-${it.ex}-${s}`, ex: it.ex, reps, loadKg: ex.gear.includes('mancuernas') ? (R() > 0.5 ? 10 : 15) : 0, rir: 1 + Math.round(R() * 2), tempo: R() > 0.15 ? '3-1-1' : '2-0-1', lever: null, restS: 60 + Math.round(R() * 3) * 15, ts: `${date}T18:${String(10 + s * 3).padStart(2, '0')}:00` });
        }
      }
    }
    day.intake = { waterL: Math.round((2.3 + R() * 1.0) * 4) / 4, creatine: R() > 0.08 };
    const nMeals = 3 + (R() > 0.4 ? 1 : 0);
    const picks = ['desayuno', 'almuerzo', 'merienda', 'cena'].slice(0, nMeals);
    day.meals = picks.map((slot, j) => {
      const opts = MEALS.filter((m) => m.slot === slot);
      const m = opts[Math.floor(R() * opts.length)];
      return { id: `demo-meal-${date}-${j}`, slot, time: ['09:00', '13:30', '17:30', '21:30'][j], name: m.name, photoId: null, guideText: 'EJEMPLO · texto de guía externa: estimación orientativa de proteína y kcal.', proteinG: m.p + Math.round((R() - 0.5) * 8), kcal: m.k + Math.round((R() - 0.5) * 120), notes: '' };
    });
    const groups = train ? (pd.groups || []).slice(0, 4) : [];
    day.checkin = {
      weightKg: Math.round(kg * 10) / 10,
      sleepH: Math.round((7.2 + R() * 1.6) * 2) / 2,
      sleepQ: 3 + Math.round(R() * 2),
      energy: 3 + Math.round(R() * 2),
      mood: 3 + Math.round(R() * 2),
      pump: train ? 3 + Math.round(R() * 2) : null,
      fatigue: train ? 2 + Math.round(R() * 2) : null,
      pain: R() > 0.8 ? { type: 'doms', zone: groups[0] || 'dorsal', level: 1 + Math.round(R()) } : { type: 'none' },
      fedBefore: R() > 0.4,
      trained: train,
      groups,
      bestTension: train ? ['excentrica-lenta', 'pausa-iso', 'banda', 'bolsa'][Math.floor(R() * 4)] : null,
      notes: '',
    };
    if (['tue', 'thu', 'sat'].includes(M.weekdayKey(date)) && R() > 0.2) day.run = { km: Math.round((6 + R() * 4) * 10) / 10, min: 0, pace: null, zone: 2 };
    if (day.run) day.run.min = Math.round(day.run.km * (6.3 + R() * 0.9));
    if (i === 14 || i === 1) day.measures = { armRelaxedCm: 29 + (i === 1 ? 0.4 : 0), armFlexedCm: 31.5 + (i === 1 ? 0.5 : 0), chestCm: 89 + (i === 1 ? 0.6 : 0), waistCm: 72, thighCm: 51, calfCm: 34, neckCm: 35 };
    await store.putDay(day, { silent: true });
    written++;
  }
  // sesión de Motion Lab de ejemplo (el boxer.json real del demo de Motion Lab)
  try {
    const { normalize } = await import('../features/fp-motionlab.js');
    const raw = await data.boxer();
    const n = normalize(raw, 'boxer.json');
    if (n.ok) {
      n.session.id = 'demo-boxer';
      n.session.demo = true;
      n.session.createdAt = `${M.addDays(today, -2)}T19:00:00`;
      await store.putSession(n.session, { silent: true });
    }
  } catch (e) { console.warn('[fp/demo] sin sesión de ejemplo', e); }
  store.emit('all');
  return { written };
}
