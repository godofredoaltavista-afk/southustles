// FP · PLANNER — motor de reglas explicable (02 §6.4, data/rules.json). Sin LLM.
// Cada sugerencia dice qué hacer y POR QUÉ, con el dato que la disparó.
import * as M from './fp-model.js';

console.log('[fp/planner] init');

/**
 * @returns {Array<{id:string, level:'ok'|'info'|'warn'|'bad', title:string, why:string, then:string}>}
 */
export function suggest({ days, data, profile, today = M.todayISO() }) {
  const out = [];
  const last7 = days.filter((d) => d.date > M.addDays(today, -7) && d.date <= today);
  const last14 = days.filter((d) => d.date > M.addDays(today, -14) && d.date <= today);
  const vol = M.volumeByMuscle(days, data, today, 7);
  const anySets = vol.some((v) => v.sets > 0);

  // dolor articular / hormigueo
  const joint = last7.filter((d) => d.checkin?.pain?.type === 'joint');
  if (joint.length) {
    const z = [...new Set(joint.map((d) => d.checkin.pain.zone).filter(Boolean))].join(', ') || 'sin zona marcada';
    out.push({ id: 'joint-pain', level: 'bad', title: 'Dolor articular registrado', why: `${joint.length} día(s) en la última semana · zona: ${z}.`, then: 'Sacá el ejercicio que lo provoca, marcá la zona y consultá a un profesional. La app no da tratamiento.' });
  }
  const ps = M.painStreak(days, today);
  if (ps >= 3) out.push({ id: 'pain-streak', level: 'bad', title: `Dolor ${ps} días seguidos`, why: 'El check-in marca molestias varios días en fila.', then: 'Bajá la carga y consultá. No es para «pasarlo».' });

  // volumen bajo con buen bombeo y poca fatiga
  if (anySets) {
    const pump = M.avgOf(last7, (d) => d.checkin?.pump);
    const fat = M.avgOf(last7, (d) => d.checkin?.fatigue);
    const low = vol.filter((v) => v.status === 'low' && v.priority <= 2);
    if (low.length && (pump == null || pump >= 3) && (fat == null || fat <= 3)) {
      out.push({ id: 'vol-low', level: 'info', title: `+1 serie: ${low.slice(0, 3).map((v) => v.name).join(', ')}`, why: `Por debajo del rango semanal (${low.slice(0, 3).map((v) => `${v.name} ${v.sets}/${v.target[0]}–${v.target[1]}`).join(' · ')}). Bombeo ${pump ?? '—'}, fatiga ${fat ?? '—'}.`, then: 'Sumá una serie a ese grupo la semana próxima.' });
    }
    const high = vol.filter((v) => v.status === 'high');
    if (high.length) out.push({ id: 'vol-high', level: 'warn', title: `Por encima del rango: ${high.map((v) => v.name).join(', ')}`, why: high.map((v) => `${v.name} ${v.sets} series (máx. ${v.target[1]})`).join(' · '), then: '¿Te estás recuperando? Si la fuerza no sube, sacá 1–2 series.' });
  }

  // fatiga alta 2 sesiones seguidas
  const trained = last14.filter((d) => M.dayTrained(d) && d.checkin?.fatigue != null);
  if (trained.length >= 2) {
    const [a, b] = trained.slice(-2);
    if (a.checkin.fatigue >= 4 && b.checkin.fatigue >= 4) out.push({ id: 'fatigue-high', level: 'warn', title: 'Fatiga alta dos sesiones seguidas', why: `${M.fmtDate(a.date)}: ${a.checkin.fatigue}/5 · ${M.fmtDate(b.date)}: ${b.checkin.fatigue}/5.`, then: 'Bajá 1–2 series del grupo de esas sesiones.' });
  }

  // techo de reps → palanca
  const lastDay = [...days].reverse().find((d) => d.date <= today && (d.sets || []).length);
  if (lastDay) {
    const byEx = {};
    for (const s of lastDay.sets) (byEx[s.ex] ||= []).push(s);
    for (const [exId, ss] of Object.entries(byEx)) {
      const ex = data.exById[exId];
      if (ex && ss.length >= 2 && M.atRepCeiling(ss, ex)) {
        out.push({ id: 'rep-ceiling', level: 'ok', title: `${ex.name}: tope del rango`, why: `Todas las series en ${ex.repRange[1]}+ reps el ${M.fmtDate(lastDay.date)}.`, then: `Siguiente palanca: ${ex.progressions?.[0] || 'bajada más lenta (4–5 s)'}.` });
        break;
      }
    }
  }

  // peso estancado 3 semanas
  const wk = M.weeklyAvg(M.weightSeries(days, null).filter((p) => !p.declared));
  if (wk.length >= 4) {
    const w = wk.slice(-4);
    if (w[3].kg <= w[0].kg + 0.05) {
      out.push({ id: 'weight-flat', level: 'warn', title: 'Peso promedio sin subir', why: `Semanas: ${w.map((x) => x.kg).join(' → ')} kg.`, then: 'Probablemente falten calorías: +200–300 kcal/día (carbos alrededor del entreno).' });
      const km = M.runKm(days, M.addDays(today, -6), today);
      if (km >= 20) out.push({ id: 'cardio-mass', level: 'warn', title: 'Cardio alto + peso quieto', why: `${km} km en la última semana.`, then: 'Revisá cardio vs masa: opción A (1–2 salidas suaves) o B (comer +250–300 kcal/día).' });
    }
  }

  // proteína baja
  const withMeals = last7.filter((d) => (d.meals || []).length);
  const lowP = withMeals.filter((d) => M.dayProtein(d) < 100);
  if (withMeals.length >= 3 && lowP.length >= 2) out.push({ id: 'protein-low', level: 'info', title: 'Proteína corta algunos días', why: `${lowP.length} de ${withMeals.length} días con comidas cargadas quedaron < 100 g.`, then: 'Sumá una comida de 25–40 g (huevo, proteína, carne).' });

  // agua baja
  const wAvg = M.avgOf(last7.filter((d) => d.intake), (d) => d.intake.waterL);
  if (wAvg != null && last7.length >= 3 && wAvg < 2.5) out.push({ id: 'water-low', level: 'info', title: 'Agua por debajo de 3 L', why: `Promedio de la semana: ${wAvg} L.`, then: 'Botella a la vista y vuelta a los 3 L.' });

  // descarga
  const weeksTrained = new Set(days.filter((d) => M.dayTrained(d) && d.date > M.addDays(today, -42)).map((d) => M.weekStart(d.date))).size;
  if (weeksTrained >= 5) out.push({ id: 'deload', level: 'info', title: 'Pensá en una semana de descarga', why: `${weeksTrained} semanas seguidas entrenando.`, then: 'Una semana con ≈ −40 % de volumen y volvés más fuerte.' });

  if (!out.length) out.push({ id: 'all-good', level: 'ok', title: 'Sin alertas', why: anySets ? 'El volumen, el dolor y la comida están dentro de lo esperado.' : 'Todavía no hay series registradas esta semana.', then: anySets ? 'Seguí el plan. Una serie bien hecha vale más que tres apuradas.' : 'Empezá la sesión de hoy y registrá cada serie.' });
  const order = { bad: 0, warn: 1, info: 2, ok: 3 };
  return out.sort((a, b) => order[a.level] - order[b.level]);
}
