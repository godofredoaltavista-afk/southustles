// FP · VISTA COMIDA — foto del plato (local), texto de la guía externa, registrar comida con proteína/kcal
// estimadas y editables, el día (proteína vs 110–130 g, agua, creatina) e historial de 7 días.
// La app NO estima macros desde la foto (01 §7.2). Las fotos son SENSIBLES: viven solo en IndexedDB.
console.log('[fp/view-comida] init');

const SLOTS = [['desayuno', 'Desayuno'], ['almuerzo', 'Almuerzo'], ['merienda', 'Merienda'], ['cena', 'Cena'], ['otro', 'Otro']];
const num = (v) => (v === '' || v == null ? null : (Number.isNaN(+String(v).replace(',', '.')) ? null : +String(v).replace(',', '.')));

function paintLeds(root, ctx) {
  const dark = ctx.theme.isDark();
  root.querySelectorAll('canvas[data-led]').forEach((c) => ctx.led.drawLED(c, c.dataset.led, dark ? { on: ctx.led.accentColor(), glow: 10 } : { ink: true }));
}
function ledLater(root, ctx) {
  requestAnimationFrame(() => paintLeds(root, ctx));
  if (!root._fpLedRO) {
    let t = null;
    root._fpLedRO = new ResizeObserver(() => { clearTimeout(t); t = setTimeout(() => paintLeds(root, ctx), 80); });
    root._fpLedRO.observe(root);
    document.addEventListener('fp-theme-changed', () => paintLeds(root, ctx));
  }
}

/** Achica la foto (máx. 1600 px, JPEG .86) para no llenar el disco. Si falla, guarda el original. */
async function shrink(file, max = 1600) {
  try {
    const bmp = await createImageBitmap(file);
    const s = Math.min(1, max / Math.max(bmp.width, bmp.height));
    if (s >= 1 && file.size < 1.5e6) return file;
    const c = document.createElement('canvas');
    c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    return await new Promise((res) => c.toBlob((b) => res(b || file), 'image/jpeg', 0.86));
  } catch { return file; }
}

/** Busca «proteína … 35 g» y «620 kcal» en el texto de la guía para precargar (editable). */
function parseGuide(t) {
  const p = /prote[ií]nas?[^\d\n]{0,28}(\d{1,3}(?:[.,]\d)?)\s*g/i.exec(t) || /(\d{1,3}(?:[.,]\d)?)\s*g(?:ramos)?\s*(?:de\s*)?prote/i.exec(t);
  const k = /(\d{2,4}(?:[.,]\d)?)\s*(?:kcal|calor[ií]as)/i.exec(t) || /calor[ií]as[^\d\n]{0,20}(\d{2,4})/i.exec(t);
  return { p: p ? +p[1].replace(',', '.') : null, k: k ? +k[1].replace(',', '.') : null };
}

export default {
  id: 'comida',
  title: 'Comida',
  icon: 'comida',
  theme: 'light',
  hint: 'Foto + guía + proteína',

  windows(ctx) {
    const { esc, fmt, icon, toast } = ctx.ui;
    const M = ctx.M;
    const bus = new EventTarget();
    const S = { date: M.todayISO(), photoId: null, photoURL: null, guide: '' };
    const say = (msg, kind) => toast(msg, kind);

    return [
      /* ── FOTO ─────────────────────────────── */
      {
        id: 'foto', title: 'Foto del plato', icon: 'camera', glass: 1,
        def: { x: 0.02, y: 0.03, w: 0.3, h: 0.5 },
        mount(body) {
          body.classList.add('fp-vb');
          body.innerHTML = `
            <div class="fp-vb-photo" data-ph>
              <label class="fp-drop fp-vb-photo__drop" data-drop>
                <input type="file" accept="image/*" capture="environment" class="fp-sr" data-file />
                ${icon('camera', 28)}
                <b>Sacá o elegí la foto del plato</b>
                <span class="fp-small">Queda solo en este dispositivo.</span>
              </label>
              <figure class="fp-vb-photo__fig" data-fig hidden>
                <img alt="Foto del plato (local)" data-img />
                <figcaption class="fp-row">
                  <span class="fp-chip fp-chip--accent">${icon('check', 12)} Adjunta a la próxima comida</span>
                  <button type="button" class="fp-btn fp-btn--sm" data-clear>${icon('trash', 14)} Quitar</button>
                </figcaption>
              </figure>
            </div>
            <p class="fp-small fp-vb-note">${icon('vault', 14)} Las fotos son datos sensibles: no se suben a ningún lado, ni al repo ni a un bucket.</p>`;
          const file = body.querySelector('[data-file]');
          const drop = body.querySelector('[data-drop]');
          const fig = body.querySelector('[data-fig]');
          const img = body.querySelector('[data-img]');
          const show = () => {
            fig.hidden = !S.photoURL; drop.hidden = !!S.photoURL;
            if (S.photoURL) img.src = S.photoURL;
          };
          const take = async (f) => {
            if (!f || !f.type.startsWith('image/')) { say('Eso no parece una imagen.', 'bad'); return; }
            const blob = await shrink(f);
            S.photoId = await ctx.store.putMedia(blob, { kind: 'meal', date: S.date, name: f.name });
            S.photoURL = await ctx.store.mediaURL(S.photoId);
            show(); bus.dispatchEvent(new Event('change'));
            say('Foto guardada en el dispositivo.', 'ok');
          };
          file.addEventListener('change', () => take(file.files[0]));
          drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('is-over'); });
          drop.addEventListener('dragleave', () => drop.classList.remove('is-over'));
          drop.addEventListener('drop', (e) => { e.preventDefault(); drop.classList.remove('is-over'); take(e.dataTransfer.files[0]); });
          body.querySelector('[data-clear]').addEventListener('click', async () => {
            if (S.photoId) await ctx.store.deleteMedia(S.photoId);
            S.photoId = null; S.photoURL = null; file.value = '';
            show(); bus.dispatchEvent(new Event('change'));
          });
          bus.addEventListener('reset', () => { S.photoId = null; S.photoURL = null; file.value = ''; show(); });
          show();
        },
      },

      /* ── GUÍA EXTERNA ─────────────────────── */
      {
        id: 'guia', title: 'Guía externa', icon: 'file', glass: 1,
        def: { x: 0.02, y: 0.56, w: 0.3, h: 0.41 },
        mount(body) {
          body.classList.add('fp-vb');
          body.innerHTML = `
            <label class="fp-field"><span>Pegá la explicación de tu guía (la de afuera)</span>
              <textarea class="fp-textarea" rows="5" data-guide placeholder="Ej.: «Plato de pollo con arroz: ~40 g de proteína, ~650 kcal…»"></textarea></label>
            <div class="fp-row fp-row--between">
              <label class="fp-btn fp-btn--sm">${icon('upload', 14)} Importar .txt / .md<input type="file" accept=".txt,.md,text/plain,text/markdown" class="fp-sr" data-imp /></label>
              <span class="fp-small fp-data" data-count>0 caracteres</span>
            </div>
            <p class="fp-small fp-vb-note">La app no calcula macros desde la foto: tomá la estimación de tu guía y ajustala a mano ${ctx.ui.tag('C')}.</p>`;
          const ta = body.querySelector('[data-guide]');
          const cnt = body.querySelector('[data-count]');
          const sync = () => { S.guide = ta.value; cnt.textContent = `${ta.value.length} caracteres`; bus.dispatchEvent(new Event('guide')); };
          ta.addEventListener('input', sync);
          body.querySelector('[data-imp]').addEventListener('change', async (e) => {
            const f = e.target.files[0]; if (!f) return;
            if (f.size > 200 * 1024) { say('El archivo es muy grande para una guía (> 200 KB).', 'bad'); return; }
            ta.value = await f.text(); sync(); say('Guía importada.', 'ok');
          });
          bus.addEventListener('reset', () => { ta.value = ''; sync(); });
        },
      },

      /* ── REGISTRAR COMIDA ─────────────────── */
      {
        id: 'registrar', title: 'Registrar comida', icon: 'plus', glass: 1,
        def: { x: 0.34, y: 0.03, w: 0.32, h: 0.94 },
        mount(body) {
          body.classList.add('fp-vb');
          const habit = (ctx.data.profile.nutrition?.foods || []).map((f) => `<button type="button" class="fp-chip" data-food="${esc(f)}">${esc(f)}</button>`).join('');
          const now = new Date();
          body.innerHTML = `
            <form class="fp-stack" data-form autocomplete="off">
              <div class="fp-vb-grid2">
                <label class="fp-field"><span>Fecha</span><input class="fp-input" type="date" name="date" value="${S.date}" max="${M.todayISO()}" /></label>
                <label class="fp-field"><span>Hora</span><input class="fp-input" type="time" name="time" value="${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}" /></label>
              </div>
              <div class="fp-field"><span>Momento</span>
                <div class="fp-seg" data-slot>${SLOTS.map(([v, l]) => `<button type="button" data-v="${v}">${l}</button>`).join('')}</div></div>
              <label class="fp-field"><span>Qué comiste</span><input class="fp-input" name="name" placeholder="Ej.: Asado + ensalada" required /></label>
              <div class="fp-vb-chips" aria-label="Habituales">${habit}</div>
              <div class="fp-vb-grid2">
                <label class="fp-field"><span>Proteína (g) · estimada</span><input class="fp-input" type="number" inputmode="decimal" min="0" max="300" step="1" name="proteinG" placeholder="30" /></label>
                <label class="fp-field"><span>Kcal · estimadas</span><input class="fp-input" type="number" inputmode="decimal" min="0" max="5000" step="10" name="kcal" placeholder="600" /></label>
              </div>
              <button type="button" class="fp-btn fp-btn--sm fp-vb-ghostline" data-parse hidden>${icon('sparkle', 14)} Tomar números de la guía</button>
              <label class="fp-field"><span>Notas</span><textarea class="fp-textarea" rows="2" name="notes" placeholder="¿Antes o después de entrenar? ¿Cómo te cayó?"></textarea></label>
              <div class="fp-vb-attach" data-attach></div>
              <button type="submit" class="fp-btn fp-btn--primary fp-btn--action">Guardar comida</button>
            </form>`;
          const form = body.querySelector('[data-form]');
          let slot = (() => { const h = now.getHours(); return h < 11 ? 'desayuno' : h < 16 ? 'almuerzo' : h < 20 ? 'merienda' : 'cena'; })();
          const seg = ctx.ui.segmented(body.querySelector('[data-slot]'), slot, (v) => { slot = v; });
          const attach = body.querySelector('[data-attach]');
          const parseBtn = body.querySelector('[data-parse]');
          const paintAttach = () => {
            const bits = [];
            if (S.photoURL) bits.push(`<span class="fp-chip fp-chip--accent"><img class="fp-vb-attach__img" src="${S.photoURL}" alt="" />Foto adjunta</span>`);
            if (S.guide.trim()) bits.push(`<span class="fp-chip">${icon('file', 12)} Guía (${S.guide.trim().length} car.)</span>`);
            attach.innerHTML = bits.length ? bits.join('') : '<span class="fp-small">Sin foto ni guía adjunta (son opcionales).</span>';
            parseBtn.hidden = !S.guide.trim();
          };
          bus.addEventListener('change', paintAttach);
          bus.addEventListener('guide', paintAttach);
          paintAttach();
          body.querySelectorAll('[data-food]').forEach((b) => b.addEventListener('click', () => {
            const inp = form.elements.name; inp.value = inp.value ? `${inp.value} + ${b.dataset.food}` : b.dataset.food; inp.focus();
          }));
          parseBtn.addEventListener('click', () => {
            const g = parseGuide(S.guide);
            if (g.p != null) form.elements.proteinG.value = g.p;
            if (g.k != null) form.elements.kcal.value = g.k;
            say(g.p == null && g.k == null ? 'No encontré números claros en la guía: cargalos a mano.' : 'Precargué lo que encontré. Revisalo: es una estimación.', g.p == null && g.k == null ? 'info' : 'ok');
          });
          form.elements.date.addEventListener('change', () => { S.date = form.elements.date.value || M.todayISO(); bus.dispatchEvent(new Event('date')); });
          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const f = form.elements;
            const name = f.name.value.trim();
            if (!name) { f.name.focus(); return; }
            const meal = {
              id: ctx.env.uid('meal'), slot, time: f.time.value || null, name,
              photoId: S.photoId, guideText: S.guide.trim() || null,
              proteinG: num(f.proteinG.value), kcal: num(f.kcal.value), notes: f.notes.value.trim(),
              estimated: true,
            };
            const date = f.date.value || M.todayISO();
            await ctx.store.updateDay(date, (d) => { d.meals = [...(d.meals || []), meal]; });
            say(`Comida guardada · ${meal.proteinG ?? '—'} g de proteína.`, 'ok');
            f.name.value = ''; f.proteinG.value = ''; f.kcal.value = ''; f.notes.value = '';
            bus.dispatchEvent(new Event('reset'));
            seg.set(slot);
            paintAttach();
          });
        },
      },

      /* ── EL DÍA ───────────────────────────── */
      {
        id: 'hoy', title: 'El día', icon: 'drop', glass: 1,
        def: { x: 0.68, y: 0.03, w: 0.3, h: 0.56 },
        mount(body) {
          body.classList.add('fp-vb');
          const paint = async () => {
            const date = S.date;
            const day = (await ctx.store.getDay(date)) || ctx.store.blankDay(date);
            const prof = ctx.state.profile || (await ctx.store.getProfile());
            const [pLo, pHi] = prof.intake?.proteinG || [110, 130];
            const water = M.dayWater(day), prot = M.dayProtein(day), kcal = M.dayKcal(day);
            const waterGoal = prof.intake?.waterL || 3;
            const pStatus = prot >= pLo ? 'ok' : prot >= pLo * 0.7 ? 'warn' : '';
            const meals = [...(day.meals || [])].sort((a, b) => String(a.time).localeCompare(String(b.time)));
            const urls = await Promise.all(meals.map((m) => (m.photoId ? ctx.store.mediaURL(m.photoId) : null)));
            body.innerHTML = `
              <div class="fp-row fp-row--between fp-vb-dayhead">
                <b>${esc(M.fmtDate(date, { long: true }))}</b>${day.demo ? ctx.ui.demoChip() : ''}
              </div>
              <div class="fp-vb-statrow">
                <div class="fp-vb-stat"><canvas class="fp-vb-led fp-vb-led--l" data-led="${Math.round(prot)}"></canvas><span>g proteína ${ctx.ui.tag('U')}</span></div>
                ${ctx.ui.gauge({ value: prot, max: pHi * 1.15, band: [pLo, pHi], label: 'Proteína', unit: `de ${pLo}–${pHi} g`, display: `${Math.round(prot)}`, size: 'sm', status: pStatus })}
                <div class="fp-vb-stat"><b class="fp-data">${kcal ? fmt(kcal, 0) : '—'}</b><span>kcal estimadas</span></div>
              </div>
              <div class="fp-vb-water">
                <div class="fp-vb-water__glass" style="--v:${Math.min(100, (water / waterGoal) * 100).toFixed(0)}" aria-hidden="true"><i></i></div>
                <div class="fp-stack">
                  <div class="fp-row"><b class="fp-data fp-vb-big">${fmt(water, 2)} L</b><span class="fp-small">de ${waterGoal} L</span></div>
                  <div class="fp-row">
                    <button type="button" class="fp-btn fp-btn--sm fp-btn--icon" data-w="-0.25" aria-label="Restar 250 ml">${icon('minus', 14)}</button>
                    <button type="button" class="fp-btn fp-btn--sm" data-w="0.25">+250 ml</button>
                    <button type="button" class="fp-btn fp-btn--sm" data-w="0.5">+500 ml</button>
                  </div>
                </div>
              </div>
              <label class="fp-check"><input type="checkbox" data-crea ${day.intake?.creatine ? 'checked' : ''} /><span class="fp-check__box"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></svg></span><span class="fp-check__t">Creatina ${prof.intake?.creatineG || 5} g</span><span class="fp-check__s">diaria, sin timing</span></label>
              <div class="fp-vb-meals">
                ${meals.length ? meals.map((m, i) => `
                  <article class="fp-vb-meal">
                    ${urls[i] ? `<img class="fp-vb-meal__img" src="${urls[i]}" alt="Foto de ${esc(m.name)}" loading="lazy" />` : `<span class="fp-vb-meal__img fp-vb-meal__img--none">${icon('comida', 18)}</span>`}
                    <div class="fp-vb-meal__t"><b>${esc(m.name || 'Comida')}</b><span class="fp-small">${esc(SLOTS.find((s) => s[0] === m.slot)?.[1] || m.slot || '')}${m.time ? ` · ${esc(m.time)}` : ''}${m.guideText ? ` · ${icon('file', 11)} guía` : ''}</span></div>
                    <span class="fp-data fp-vb-meal__n">${m.proteinG ?? '—'} g<small>${m.kcal ?? '—'} kcal</small></span>
                    ${day.demo ? '' : `<button type="button" class="fp-btn fp-btn--sm fp-btn--icon fp-btn--ghost" data-del="${esc(m.id)}" aria-label="Borrar ${esc(m.name)}">${icon('trash', 14)}</button>`}
                  </article>`).join('') : `<div class="fp-empty"><b>Todavía no cargaste comidas este día.</b>Sacale una foto al plato, pegá la guía y guardala.</div>`}
              </div>`;
            ledLater(body, ctx);
            body.querySelectorAll('[data-w]').forEach((b) => b.addEventListener('click', () => ctx.store.updateDay(date, (d) => {
              d.intake = { ...(d.intake || {}), waterL: Math.max(0, Math.round(((+d.intake?.waterL || 0) + +b.dataset.w) * 100) / 100) };
            })));
            body.querySelector('[data-crea]').addEventListener('change', (e) => ctx.store.updateDay(date, (d) => { d.intake = { ...(d.intake || {}), creatine: e.target.checked }; }));
            body.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', async () => {
              const m = (day.meals || []).find((x) => x.id === b.dataset.del);
              await ctx.store.updateDay(date, (d) => { d.meals = (d.meals || []).filter((x) => x.id !== b.dataset.del); });
              if (m?.photoId) await ctx.store.deleteMedia(m.photoId);
              say('Comida borrada.', 'info');
            }));
          };
          paint();
          ctx.onData(paint);
          bus.addEventListener('date', paint);
        },
      },

      /* ── HISTORIAL 7 DÍAS ─────────────────── */
      {
        id: 'historial', title: 'Últimos 7 días', icon: 'progreso', glass: 1,
        def: { x: 0.68, y: 0.62, w: 0.3, h: 0.35 },
        mount(body) {
          body.classList.add('fp-vb');
          const paint = async () => {
            const today = M.todayISO();
            const days = await ctx.store.listDays({ from: M.addDays(today, -6), to: today });
            const by = new Map(days.map((d) => [d.date, d]));
            const prof = ctx.state.profile || (await ctx.store.getProfile());
            const pLo = prof.intake?.proteinG?.[0] || 110;
            const rows = M.rangeISO(M.addDays(today, -6), today).map((iso) => ({ iso, d: by.get(iso) }));
            const prots = rows.map((r) => (r.d ? M.dayProtein(r.d) : 0));
            const okDays = prots.filter((p) => p >= 100).length;
            const anyDemo = rows.some((r) => r.d?.demo);
            body.innerHTML = `
              <div class="fp-row fp-row--between"><span class="fp-small">Proteína ≥ 100 g: <b class="fp-data">${okDays}/7</b> días (meta 6 de 7 ${ctx.ui.tag('C')})</span>${anyDemo ? ctx.ui.demoChip() : ''}</div>
              ${ctx.ui.spark(prots, { band: [pLo, prof.intake?.proteinG?.[1] || 130], h: 46, min: 0 })}
              <table class="fp-table fp-vb-tight"><thead><tr><th>Día</th><th>Prot.</th><th>Kcal</th><th>Agua</th><th>Crea.</th></tr></thead><tbody>
                ${rows.slice().reverse().map(({ iso, d }) => {
                  const p = d ? M.dayProtein(d) : null;
                  return `<tr><td>${esc(M.fmtDate(iso))}${d?.demo ? ' <span class="fp-vb-dot" title="ejemplo"></span>' : ''}</td>
                    <td class="fp-num"><span class="fp-vb-minibar ${p >= pLo ? 'is-ok' : ''}" style="--v:${Math.min(100, ((p || 0) / 130) * 100)}"></span>${p ? Math.round(p) : '—'}</td>
                    <td class="fp-num">${d && M.dayKcal(d) ? fmt(M.dayKcal(d), 0) : '—'}</td>
                    <td class="fp-num">${d && M.dayWater(d) ? fmt(M.dayWater(d), 2) : '—'}</td>
                    <td>${d?.intake?.creatine ? icon('check', 14) : '—'}</td></tr>`;
                }).join('')}
              </tbody></table>`;
          };
          paint();
          ctx.onData(paint);
        },
      },
    ];
  },
};
