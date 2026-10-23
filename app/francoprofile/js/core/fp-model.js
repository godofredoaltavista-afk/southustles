// FP · MODEL — funciones puras sobre los datos (sin DOM, sin store).
// Volumen semanal por músculo, racha, adherencia, peso, proyección realista, proteína, agua.
console.log('[fp/model] init');

/* ── fechas (siempre locales) ── */
const pad = (n) => String(n).padStart(2, '0');
export const isoOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayISO = () => isoOf(new Date());
export const parseISO = (iso) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d, 12); };
export const addDays = (iso, n) => { const d = parseISO(iso); d.setDate(d.getDate() + n); return isoOf(d); };
export const daysBetween = (a, b) => Math.round((parseISO(b) - parseISO(a)) / 86400000);
const KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
export const weekdayKey = (iso) => KEYS[parseISO(iso).getDay()];
export const weekStart = (iso) => { const d = parseISO(iso); const k = (d.getDay() + 6) % 7; d.setDate(d.getDate() - k); return isoOf(d); };
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const DOWS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
export const fmtDate = (iso, { long = false } = {}) => {
  const d = parseISO(iso);
  return long ? `${DOWS[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]}` : `${d.getDate()} ${MONTHS[d.getMonth()]}`;
};
export const rangeISO = (from, to) => { const out = []; for (let d = from; d <= to; d = addDays(d, 1)) out.push(d); return out; };

export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h >= 5 && h < 13) return 'Buen día';
  if (h >= 13 && h < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

/* ── plan ── */
export function isTrainDay(iso, profile) {
  const k = weekdayKey(iso);
  const days = profile?.plan?.variant6d ? ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'] : (profile?.plan?.trainDays || ['mon', 'tue', 'wed', 'fri', 'sat']);
  return days.includes(k);
}
/** Día del plan para una fecha (objeto de plan-v1.json). */
export function planFor(iso, data, profile) {
  const k = weekdayKey(iso);
  const d = data.dayByKey[k];
  if (profile?.plan?.variant6d && k === 'thu') return { ...data.dayByKey.mon, key: 'thu', short: 'Jue', name: 'Jueves', variant: true, title: 'Empuje (variante 6 días [?])' };
  return d;
}

/* ── sets y volumen ── */
export function setsOf(days, from, to) {
  const out = [];
  for (const d of days) if (d.date >= from && d.date <= to) for (const s of d.sets || []) out.push({ ...s, date: d.date });
  return out;
}

/**
 * Series efectivas por músculo en los últimos nDays (músculo primario = 1, secundario = 0,5).
 * status: low (< mínimo) · ok (dentro) · high (> máximo: «¿te estás recuperando?»).
 */
export function volumeByMuscle(days, data, end = todayISO(), nDays = 7) {
  const from = addDays(end, -(nDays - 1));
  const tally = Object.fromEntries(data.muscles.map((m) => [m.id, 0]));
  for (const s of setsOf(days, from, end)) {
    const ex = data.exById[s.ex];
    if (!ex) continue;
    for (const m of ex.muscles || []) if (m in tally) tally[m] += 1;
    for (const m of ex.secondary || []) if (m in tally) tally[m] += 0.5;
  }
  return data.muscles.map((m) => {
    const sets = Math.round(tally[m.id] * 10) / 10;
    const [lo, hi] = m.target;
    const status = sets < lo ? 'low' : sets > hi ? 'high' : 'ok';
    const pct = Math.min(100, Math.round((sets / hi) * 100));
    return { id: m.id, name: m.name, target: m.target, priority: m.priority, sets, status, pct, loPct: Math.round((lo / hi) * 100) };
  });
}

export const totalSets = (days, from, to) => setsOf(days, from, to).length;

/* ── comida, agua ── */
export const dayProtein = (day) => (day?.meals || []).reduce((a, m) => a + (+m.proteinG || 0), 0);
export const dayKcal = (day) => (day?.meals || []).reduce((a, m) => a + (+m.kcal || 0), 0);
export const dayWater = (day) => +(day?.intake?.waterL || 0);

/* ── sesión hecha ── */
export const dayTrained = (day) => !!day && ((day.sets || []).length > 0 || Object.values(day.blocks || {}).some(Boolean) || !!day.checkin?.trained);

/**
 * Racha: días seguidos (hacia atrás desde hoy, o desde ayer si hoy todavía no cerró)
 * con creatina ✓ y agua ≥ 2,5 L y, si tocaba entrenar, al menos un bloque o una serie.
 */
export function streak(days, profile, today = todayISO()) {
  const by = new Map(days.map((d) => [d.date, d]));
  const ok = (iso) => {
    const d = by.get(iso);
    if (!d) return false;
    const habits = d.intake?.creatine && dayWater(d) >= 2.5;
    const trainOk = !isTrainDay(iso, profile) || dayTrained(d);
    return !!(habits && trainOk);
  };
  let n = 0;
  let cur = ok(today) ? today : addDays(today, -1);
  while (ok(cur) && n < 400) { n++; cur = addDays(cur, -1); }
  return { count: n, rule: 'Creatina ✓ + agua ≥ 2,5 L + (si tocaba) entreno hecho' };
}

/** Adherencia al plan en los últimos n días: entrenos hechos / entrenos planeados. */
export function adherence(days, profile, end = todayISO(), n = 14) {
  const by = new Map(days.map((d) => [d.date, d]));
  let planned = 0, done = 0;
  for (let i = 0; i < n; i++) {
    const iso = addDays(end, -i);
    if (!isTrainDay(iso, profile)) continue;
    planned++;
    if (dayTrained(by.get(iso))) done++;
  }
  return { planned, done, pct: planned ? Math.round((done / planned) * 100) : 0 };
}

/** Adherencia al tempo: % de series registradas con tempo 3-1-1 (o más lento). */
export function tempoAdherence(days, from, to) {
  const s = setsOf(days, from, to);
  if (!s.length) return null;
  const good = s.filter((x) => /^[3-9]-[1-9]-1$/.test(x.tempo || '') || x.tempo === '3-1-1').length;
  return Math.round((good / s.length) * 100);
}

/* ── peso ── */
export function weightSeries(days, profile) {
  const out = days.filter((d) => d.checkin?.weightKg).map((d) => ({ date: d.date, kg: +d.checkin.weightKg, demo: !!d.demo }));
  if (!out.length && profile?.base?.weightKg) out.push({ date: todayISO(), kg: +profile.base.weightKg, declared: true });
  return out;
}
export function movingAvg(series, n = 7) {
  return series.map((p, i) => {
    const win = series.filter((q) => q.date <= p.date && q.date > addDays(p.date, -n));
    return { date: p.date, kg: Math.round((win.reduce((a, q) => a + q.kg, 0) / win.length) * 100) / 100 };
  });
}
export function weeklyAvg(series) {
  const by = new Map();
  for (const p of series) { const w = weekStart(p.date); if (!by.has(w)) by.set(w, []); by.get(w).push(p.kg); }
  return [...by.entries()].sort().map(([w, a]) => ({ week: w, kg: Math.round((a.reduce((x, y) => x + y, 0) / a.length) * 100) / 100 }));
}
export const currentWeight = (days, profile) => { const s = weightSeries(days, profile); return s.length ? s[s.length - 1].kg : null; };

/**
 * Meta declarada [U] vs banda realista [C] (0,5–1 kg/mes). Nunca promete la meta.
 */
export function projection(profile, startKg, today = todayISO()) {
  const target = profile?.goal?.targetRange || [65, 65.5];
  const date = profile?.goal?.targetDate || '2026-12-22';
  const days = Math.max(0, daysBetween(today, date));
  const months = days / 30.4;
  if (startKg == null) return { target, date, days, months, lo: null, hi: null, needPerMonth: null };
  const lo = Math.round((startKg + 0.5 * months) * 10) / 10;
  const hi = Math.round((startKg + 1.0 * months) * 10) / 10;
  const needPerMonth = months > 0 ? Math.round(((target[0] - startKg) / months) * 100) / 100 : null;
  return { target, date, days, months, lo, hi, needPerMonth, reachable: hi >= target[0] };
}

/* ── cardio ── */
export function runKm(days, from, to) {
  return days.filter((d) => d.date >= from && d.date <= to && d.run?.km).reduce((a, d) => a + +d.run.km, 0);
}

/* ── check-ins ── */
export function painStreak(days, end = todayISO()) {
  let n = 0;
  const by = new Map(days.map((d) => [d.date, d]));
  for (let i = 0; i < 30; i++) {
    const p = by.get(addDays(end, -i))?.checkin?.pain;
    if (p && p.type && p.type !== 'none' && p.type !== 'doms') n++; else if (i > 0) break;
  }
  return n;
}
export function avgOf(days, pick) {
  const v = days.map(pick).filter((x) => x != null && !Number.isNaN(+x)).map(Number);
  return v.length ? Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10 : null;
}

/** Último registro de un ejercicio (para «la vez anterior»). */
export function lastSetsFor(days, exId, before = todayISO()) {
  for (let i = days.length - 1; i >= 0; i--) {
    const d = days[i];
    if (d.date >= before) continue;
    const s = (d.sets || []).filter((x) => x.ex === exId);
    if (s.length) return { date: d.date, sets: s };
  }
  return null;
}

/** ¿Llegó al techo del rango en todas las series? → siguiente palanca. */
export function atRepCeiling(sets, ex) {
  if (!sets?.length || !ex?.repRange) return false;
  return sets.every((s) => +s.reps >= ex.repRange[1]);
}
