// FP · VISTA AJUSTES — tema (claro/oscuro/sistema), densidad --fp-k, modo calmo, cursor propio,
// metrónomo (WebAudio, apagado por defecto · D10), restablecer layouts, guía, perfil base editable y privacidad.
// Preferencias de UI → localStorage fp.*; perfil → vault (IndexedDB).
console.log('[fp/view-ajustes] init');

const num = (v) => (v === '' || v == null ? null : (Number.isNaN(+String(v).replace(',', '.')) ? null : +String(v).replace(',', '.')));
const DAYS = [['mon', 'L'], ['tue', 'M'], ['wed', 'X'], ['thu', 'J'], ['fri', 'V'], ['sat', 'S'], ['sun', 'D']];

/** Una repetición 3-1-1 en clicks: 3 tics graves (excéntrica), 1 medio (pausa), 1 agudo (concéntrica). */
function playTempo() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return false;
  const ac = new AC();
  const beep = (t, f, d = 0.06) => {
    const o = ac.createOscillator(), g = ac.createGain();
    o.frequency.value = f; o.type = 'sine';
    g.gain.setValueAtTime(0.0001, ac.currentTime + t);
    g.gain.exponentialRampToValueAtTime(0.25, ac.currentTime + t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + t + d);
    o.connect(g).connect(ac.destination); o.start(ac.currentTime + t); o.stop(ac.currentTime + t + d + 0.02);
  };
  [0, 1, 2].forEach((s) => beep(s, 440)); beep(3, 660); beep(4, 880, 0.12);
  setTimeout(() => ac.close(), 5600);
  try { navigator.vibrate?.([60, 940, 60, 940, 60, 940, 120, 880, 200]); } catch { /* */ }
  return true;
}

export default {
  id: 'ajustes',
  title: 'Ajustes',
  icon: 'ajustes',
  theme: null,
  hint: 'Tema, densidad, sonido, perfil',

  windows(ctx) {
    const { esc, icon, toast } = ctx.ui;
    const LS = ctx.env.LS;
    const root = document.documentElement;
    const pref = (key, value) => document.dispatchEvent(new CustomEvent('fp-pref', { detail: { key, value } }));

    return [
      /* ── APARIENCIA ───────────────────────── */
      {
        id: 'apariencia', title: 'Apariencia', icon: 'sun', glass: 1,
        def: { x: 0.02, y: 0.03, w: 0.32, h: 0.6 },
        mount(body) {
          body.classList.add('fp-vb');
          body.innerHTML = `
            <div class="fp-field"><span>Tema</span><div class="fp-seg" data-theme><button type="button" data-v="light">${icon('sun', 14)} Claro</button><button type="button" data-v="dark">${icon('moon', 14)} Oscuro</button><button type="button" data-v="system">Sistema</button></div>
              <span class="fp-small">Tu elección manda sobre el tema de cada vista.</span></div>
            <div class="fp-field"><span>Densidad</span><div class="fp-seg" data-k><button type="button" data-v="0.9">Compacta</button><button type="button" data-v="1">Normal</button><button type="button" data-v="1.1">Aireada</button></div></div>
            <label class="fp-switch"><input type="checkbox" data-calm /><i></i>Modo calmo (sin partículas, parallax ni wipe)</label>
            <label class="fp-switch"><input type="checkbox" data-cursor /><i></i>Cursor propio de 3 capas</label>
            <div class="fp-row fp-vb-wrap">
              <button type="button" class="fp-btn fp-btn--sm" data-layouts>${icon('windows', 14)} Restablecer ventanas</button>
              <label class="fp-field fp-vb-inline"><span>Idioma</span><select class="fp-select" disabled><option>Español (AR)</option></select></label>
            </div>`;
          const themeSeg = ctx.ui.segmented(body.querySelector('[data-theme]'), ctx.theme.storedTheme() || 'system', (v) => {
            if (v === 'system') ctx.theme.followSystem(); else ctx.theme.setTheme(v, { persist: true, from: body.querySelector(`[data-theme] [data-v="${v}"]`) });
          });
          document.addEventListener('fp-theme-changed', () => themeSeg.set(ctx.theme.storedTheme() || 'system'));
          const curK = String(LS.get('density', 1));
          ctx.ui.segmented(body.querySelector('[data-k]'), curK, (v) => { root.style.setProperty('--fp-k', v); LS.set('density', +v); pref('density', +v); });
          const calm = body.querySelector('[data-calm]');
          calm.checked = !!LS.get('calm', false);
          calm.addEventListener('change', () => {
            LS.set('calm', calm.checked);
            if (calm.checked) root.dataset.fpCalm = '1'; else delete root.dataset.fpCalm;
            pref('calm', calm.checked);
            toast(calm.checked ? 'Modo calmo activado. Algunos efectos se apagan del todo al recargar.' : 'Modo calmo desactivado.', 'info');
          });
          const cur = body.querySelector('[data-cursor]');
          cur.checked = LS.get('cursor', true) !== false;
          if (ctx.env.isCoarsePointer()) { cur.disabled = true; cur.closest('label').title = 'En pantallas táctiles no hay cursor propio.'; }
          cur.addEventListener('change', () => { LS.set('cursor', cur.checked); pref('cursor', cur.checked); });
          body.querySelector('[data-layouts]').addEventListener('click', () => {
            try { Object.keys(localStorage).filter((k) => k.startsWith('fp.layout.')).forEach((k) => localStorage.removeItem(k)); } catch { /* */ }
            document.dispatchEvent(new CustomEvent('fp-layout-reset'));
            toast('Ventanas restablecidas en todas las vistas.', 'ok');
          });
        },
      },

      /* ── SONIDO ───────────────────────────── */
      {
        id: 'sonido', title: 'Metrónomo', icon: 'sound', glass: 1,
        def: { x: 0.02, y: 0.66, w: 0.32, h: 0.31 },
        mount(body) {
          body.classList.add('fp-vb');
          body.innerHTML = `
            <label class="fp-switch"><input type="checkbox" data-snd /><i></i>Sonido del metrónomo en la sesión</label>
            <p class="fp-small">Tics graves en la bajada (3 s), uno medio en la pausa (1 s), uno agudo al subir (1 s). Vibra donde se pueda. Apagado por defecto.</p>
            <button type="button" class="fp-btn fp-btn--sm" data-test>${icon('play', 14)} Probar una repetición 3-1-1</button>`;
          const snd = body.querySelector('[data-snd]');
          (async () => { const p = await ctx.store.getProfile(); snd.checked = !!p.prefs?.sound; })();
          snd.addEventListener('change', async () => { await ctx.store.saveProfile({ prefs: { sound: snd.checked } }); pref('sound', snd.checked); });
          body.querySelector('[data-test]').addEventListener('click', () => { if (!playTempo()) toast('Este navegador no tiene WebAudio.', 'bad'); });
        },
      },

      /* ── PERFIL BASE ──────────────────────── */
      {
        id: 'perfil', title: 'Perfil base', icon: 'scale', glass: 1,
        def: { x: 0.36, y: 0.03, w: 0.36, h: 0.94 },
        mount(body) {
          body.classList.add('fp-vb');
          const paint = async () => {
            const p = await ctx.store.getProfile();
            const train = new Set(p.plan?.trainDays || []);
            body.innerHTML = `
              <form class="fp-stack" data-pf autocomplete="off">
                <p class="fp-small">Lo que declarás ${ctx.ui.tag('U')} queda en este dispositivo. ${p.seededFrom ? 'Precargado con tus datos declarados.' : ''}</p>
                <div class="fp-vb-grid2">
                  <label class="fp-field"><span>Altura (cm) ${ctx.ui.tag('?')}</span><input class="fp-input" type="number" min="120" max="230" step="1" name="heightCm" value="${p.base?.heightCm ?? ''}" placeholder="falta" /></label>
                  <label class="fp-field"><span>Peso aprox. (kg)</span><input class="fp-input" type="number" min="30" max="150" step="0.1" inputmode="decimal" name="weightKg" value="${p.base?.weightKg ?? ''}" /></label>
                  <label class="fp-field"><span>Carga habitual (kg)</span><input class="fp-input" type="number" min="0" max="200" step="0.5" name="usualLoadKg" value="${p.base?.usualLoadKg ?? ''}" /></label>
                  <div class="fp-field"><span>Mano dominante</span><div class="fp-seg" data-hand><button type="button" data-v="left">Izq.</button><button type="button" data-v="right">Der.</button><button type="button" data-v="">—</button></div></div>
                </div>
                <div class="fp-field"><span>Días de entreno</span><div class="fp-vb-days" data-days>${DAYS.map(([k, l]) => `<button type="button" data-d="${k}" aria-pressed="${train.has(k)}" aria-label="${k}">${l}</button>`).join('')}</div>
                  <label class="fp-switch"><input type="checkbox" name="variant6d" ${p.plan?.variant6d ? 'checked' : ''} /><i></i>Variante 6 días (Lun–Sáb) ${ctx.ui.tag('?')}</label></div>
                <div class="fp-field"><span>Horario preferido</span><div class="fp-seg" data-slot><button type="button" data-v="mañana">Mañana</button><button type="button" data-v="tarde">Tarde</button><button type="button" data-v="noche">Noche</button></div></div>
                <div class="fp-vb-grid3">
                  <label class="fp-field"><span>Proteína mín. (g)</span><input class="fp-input" type="number" min="40" max="300" name="pLo" value="${p.intake?.proteinG?.[0] ?? 110}" /></label>
                  <label class="fp-field"><span>Proteína máx. (g)</span><input class="fp-input" type="number" min="40" max="300" name="pHi" value="${p.intake?.proteinG?.[1] ?? 130}" /></label>
                  <label class="fp-field"><span>Agua (L)</span><input class="fp-input" type="number" min="1" max="6" step="0.25" name="waterL" value="${p.intake?.waterL ?? 3}" /></label>
                </div>
                <div class="fp-field"><span>Cardio</span><div class="fp-seg" data-cardio><button type="button" data-v="A">A · prioridad masa</button><button type="button" data-v="B">B · 3 × 10 km</button></div></div>
                <div class="fp-vb-grid3">
                  <label class="fp-field"><span>Meta mín. (kg) ${ctx.ui.tag('U')}</span><input class="fp-input" type="number" step="0.1" name="tLo" value="${p.goal?.targetRange?.[0] ?? 65}" /></label>
                  <label class="fp-field"><span>Meta máx. (kg)</span><input class="fp-input" type="number" step="0.1" name="tHi" value="${p.goal?.targetRange?.[1] ?? 65.5}" /></label>
                  <label class="fp-field"><span>Fecha meta</span><input class="fp-input" type="date" name="tDate" value="${esc(p.goal?.targetDate || '2026-12-22')}" /></label>
                </div>
                <button type="submit" class="fp-btn fp-btn--primary">Guardar perfil</button>
              </form>`;
            const form = body.querySelector('[data-pf]');
            let hand = p.base?.dominantHand || '', slot = p.plan?.slot || '', cardio = p.cardio?.mode || 'A';
            ctx.ui.segmented(body.querySelector('[data-hand]'), hand, (v) => { hand = v; });
            ctx.ui.segmented(body.querySelector('[data-slot]'), slot, (v) => { slot = v; });
            ctx.ui.segmented(body.querySelector('[data-cardio]'), cardio, (v) => { cardio = v; });
            body.querySelectorAll('[data-d]').forEach((b) => b.addEventListener('click', () => {
              const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on));
              on ? train.add(b.dataset.d) : train.delete(b.dataset.d);
            }));
            form.addEventListener('submit', async (e) => {
              e.preventDefault();
              const f = form.elements;
              const trainDays = DAYS.map(([k]) => k).filter((k) => train.has(k));
              const pLo = num(f.pLo.value) ?? 110, pHi = Math.max(pLo, num(f.pHi.value) ?? 130);
              const tLo = num(f.tLo.value) ?? 65, tHi = Math.max(tLo, num(f.tHi.value) ?? 65.5);
              await ctx.store.saveProfile({
                base: { heightCm: num(f.heightCm.value), weightKg: num(f.weightKg.value), usualLoadKg: num(f.usualLoadKg.value), dominantHand: hand || null },
                plan: { trainDays, restDays: DAYS.map(([k]) => k).filter((k) => !train.has(k)), variant6d: f.variant6d.checked, slot: slot || null },
                intake: { proteinG: [pLo, pHi], waterL: num(f.waterL.value) ?? 3 },
                cardio: { mode: cardio },
                goal: { targetRange: [tLo, tHi], targetKg: Math.round(((tLo + tHi) / 2) * 100) / 100, targetDate: f.tDate.value || '2026-12-22' },
              });
              toast('Perfil guardado.', 'ok');
            });
          };
          paint();
          ctx.onData((d) => { if (d?.kind === 'all') paint(); });
        },
      },

      /* ── GUÍA Y ATAJOS ────────────────────── */
      {
        id: 'guia', title: 'Guía y atajos', icon: 'info', glass: 1,
        def: { x: 0.74, y: 0.03, w: 0.24, h: 0.42 },
        mount(body) {
          body.classList.add('fp-vb');
          body.innerHTML = `
            <button type="button" class="fp-btn fp-btn--primary fp-btn--sm" data-ob>${icon('sparkle', 14)} Ver guía de nuevo</button>
            <div class="fp-vb-keys">
              <div><kbd>G</kbd><kbd>Z</kbd><kbd>H</kbd><kbd>F</kbd><span>Modos del campo de partículas</span></div>
              <div><kbd>Esc</kbd><span>Volver al recorrido / cerrar</span></div>
              <div><kbd>Shift</kbd><span>+ arrastrar: mover ventana sin grilla</span></div>
              <div><kbd>2×clic</kbd><span>en la cabecera: minimizar</span></div>
            </div>
            <p class="fp-small">Franco · Perfil vivo · v1 · ${esc(ctx.data.profile?.motto || '')}</p>`;
          body.querySelector('[data-ob]').addEventListener('click', () => import('../features/fp-onboarding.js').then((m) => m.openOnboarding?.()).catch(() => toast('La guía no está disponible.', 'bad')));
        },
      },

      /* ── PRIVACIDAD ───────────────────────── */
      {
        id: 'privacidad', title: 'Dónde vive cada dato', icon: 'vault', glass: 1,
        def: { x: 0.74, y: 0.48, w: 0.24, h: 0.49 },
        mount(body) {
          body.classList.add('fp-vb');
          body.innerHTML = `
            <div class="fp-vb-privacy">
              <div><b>Público</b><span>Método, plan, premisas, ejercicios, glosario. Vive en <span class="fp-data">data/*.json</span>.</span></div>
              <div><b>Preferencias</b><span>Tema, color, ventanas, densidad. <span class="fp-data">localStorage fp.*</span></span></div>
              <div><b>Personal</b><span>Peso, series, check-ins, comidas, sesiones. Solo IndexedDB de este dispositivo.</span></div>
              <div><b>Sensible</b><span>Fotos, medidas, dolor, estudios. Nunca salen del dispositivo salvo que exportes a mano.</span></div>
            </div>
            <p class="fp-small">Cero analytics. Ningún dato viaja a un servidor. No es una app médica: no diagnostica ni promete resultados.</p>`;
        },
      },
    ];
  },
};
