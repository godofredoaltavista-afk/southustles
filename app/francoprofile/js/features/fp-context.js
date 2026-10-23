// FP · CONTEXTO PARA CLAUDE — arma un .md listo para pegar en un chat (03 §13.4, 02 §6.8).
// Plantilla: data/context-template.md. Tres niveles (corto/normal/completo) y dos interruptores
// (fotos: no se incluyen nunca como imagen; sensibles: off por defecto). Nunca se sube a ningún lado.
import * as store from '../core/fp-store.js';
import * as M from '../core/fp-model.js';
import { loadText } from '../core/fp-data.js';

console.log('[fp/context] init');

const fill = (tpl, vars) => tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => (vars[k] ?? '').toString().trim());

/**
 * @param {{level?:'corto'|'normal'|'completo', includeSensitive?:boolean, need?:string}} opts
 * @param {object} data  datos públicos (loadPublicData)
 */
export async function buildContext({ level = 'normal', includeSensitive = false, need = '' } = {}, data) {
  const today = M.todayISO();
  const nDays = level === 'corto' ? 7 : level === 'normal' ? 14 : 28;
  const profile = await store.getProfile();
  const days = await store.allDays();
  const real = days.filter((d) => !d.demo);
  const pool = real.length ? real : days;
  const usedDemo = !real.length && days.length > 0;
  const recent = pool.filter((d) => d.date > M.addDays(today, -nDays) && d.date <= today);
  const sessions = await store.listSessions();
  const pub = data.profile;

  const who = [
    `- ${pub.who.name}, ${pub.who.age} años, ${pub.who.place}. ${pub.who.role}. [U]`,
    `- ${pub.who.athlete}. [U]`,
    `- Fuertes: ${pub.strengths.join(', ')}. A trabajar: ${pub.weak.join(', ')}. [U]`,
    `- Equipo: ${pub.gear.map((g) => g.name).join(', ')}. Tope de carga: 20 kg → progresa con palancas. [U]`,
    `- Cuidado: ${profile.care?.thumb || 'molestia en un pulgar'} Postura declarada: hombro derecho elevado, escápulas altas, cuello adelantado (no diagnosticado). [U]`,
  ].join('\n');

  const wNow = M.currentWeight(pool, profile);
  const proj = M.projection(profile, wNow, today);
  const goal = [
    `- Meta declarada: ${proj.target.join('–')} kg al ${proj.date} [U] (faltan ${proj.days} días).`,
    `- Peso actual${usedDemo ? ' (EJEMPLO)' : ''}: ${wNow ?? 'sin dato'} kg.`,
    proj.lo != null ? `- Banda realista a esa fecha: ${proj.lo}–${proj.hi} kg (0,5–1 kg/mes) [C]. ${proj.reachable ? 'La meta entra en la banda alta.' : 'La meta queda por encima de la banda: no prometerla.'}` : '- Banda realista: falta peso de partida.',
    `- Proteína ${profile.intake.proteinG.join('–')} g · agua ${profile.intake.waterL} L · creatina ${profile.intake.creatineG} g/día. Cardio: opción ${profile.cardio.mode}.`,
  ].join('\n');

  const plan = data.plan.days.map((d) => `- ${d.name}: ${d.train ? d.title : d.title + ' — ' + (d.rest || '')}`).join('\n') + `\n- Tempo base 3-1-1 · RIR 1–2 · 3–4 series · sesión: Subidón → Fuerza → Bolsa.${profile.plan?.variant6d ? '\n- Variante 6 días activada [?].' : ''}`;

  const lines = recent.map((d) => {
    const p = M.dayProtein(d), w = M.dayWater(d);
    return `| ${d.date} | ${M.dayTrained(d) ? 'sí' : '—'} | ${(d.sets || []).length} | ${p || '—'} | ${w || '—'} | ${d.intake?.creatine ? '✓' : '—'} | ${d.checkin?.sleepH ?? '—'} | ${d.checkin?.energy ?? '—'} |`;
  });
  const adh = M.adherence(pool, profile, today, nDays);
  const tAdh = M.tempoAdherence(pool, M.addDays(today, -nDays + 1), today);
  const recentTxt = recent.length
    ? `${usedDemo ? '> ⚠️ Son datos de EJEMPLO (no reales).\n\n' : ''}| fecha | entrenó | series | prot (g) | agua (L) | creatina | sueño (h) | energía |\n|---|---|---|---|---|---|---|---|\n${lines.join('\n')}\n\nAdherencia al plan: ${adh.done}/${adh.planned} (${adh.pct} %). Tempo 3-1-1 en ${tAdh ?? '—'} % de las series.`
    : 'Sin registros en el período.';

  const vol = M.volumeByMuscle(pool, data, today, 7);
  const volume = vol.map((v) => `- ${v.name}: ${v.sets} series (rango ${v.target[0]}–${v.target[1]}) → ${v.status === 'low' ? 'por debajo' : v.status === 'high' ? 'por encima' : 'en rango'}`).join('\n');

  const ck = recent.filter((d) => d.checkin).slice(-(level === 'corto' ? 3 : 7));
  const checkins = ck.length ? ck.map((d) => {
    const c = d.checkin; const pain = c.pain && c.pain.type !== 'none' ? `${c.pain.type}${c.pain.zone ? ` (${c.pain.zone})` : ''}` : 'sin dolor';
    return `- ${d.date}: sueño ${c.sleepH ?? '—'} h (calidad ${c.sleepQ ?? '—'}/5), energía ${c.energy ?? '—'}/5, ánimo ${c.mood ?? '—'}/5, bombeo ${c.pump ?? '—'}, fatiga ${c.fatigue ?? '—'}, ${pain}${level === 'completo' && c.notes ? ` · «${c.notes}»` : ''}`;
  }).join('\n') : 'Sin check-ins.';

  const ml = sessions.slice(0, level === 'corto' ? 1 : 3);
  const motionlab = ml.length ? ml.map((s) => `- ${String(s.createdAt).slice(0, 10)} · ${s.exerciseName}${s.demo ? ' (EJEMPLO)' : ''} · ${Math.round(s.durationMs / 100) / 10} s${s.kpi ? ` · ${s.kpi.value} ${s.kpi.unit}` : ''}`).join('\n') : 'Sin sesiones importadas.';

  const review = data.premises.filter((p) => p.support === 'Revisar').map((p) => `- ${p.claim} → ${p.note}`).join('\n');

  let sensitive = '';
  if (includeSensitive) {
    const labs = await store.listLabs();
    const meas = pool.filter((d) => d.measures).slice(-2).map((d) => `- ${d.date}: ${Object.entries(d.measures).map(([k, v]) => `${k} ${v}`).join(', ')}`).join('\n');
    sensitive = `## Datos sensibles (incluidos a mano)\n> Vas a pegar datos personales en un chat — revisá antes de enviar.\n\n${meas ? `Medidas:\n${meas}\n\n` : ''}${labs.length ? `Estudios (solo valores y rango; que los lea un médico, no la app ni el asistente):\n${labs.map((l) => `- ${l.date} · ${l.name}: ${l.value} ${l.unit || ''} (rango ${l.range || '—'})`).join('\n')}\n` : ''}\n`;
  }

  let tpl;
  try { tpl = await loadText('context-template.md'); } catch { tpl = '# Contexto de Franco\n{{who}}\n{{goal}}\n{{plan}}\n{{recent}}\n{{volume}}\n{{checkins}}\n{{motionlab}}\n{{review}}\n{{sensitive}}\n{{need}}'; }
  const md = fill(tpl, {
    date: today, level, days: nDays, who, goal,
    plan: level === 'corto' ? plan.split('\n').slice(-1)[0] : plan,
    recent: recentTxt, volume, checkins, motionlab,
    review: level === 'corto' ? review.split('\n').slice(0, 3).join('\n') : review,
    sensitive, need: need || '(escribí acá qué querés resolver)',
  });
  return md.replace(/\n{3,}/g, '\n\n');
}
