// FP · VISTA VAULT — exportar/importar el vault (merge por fecha, con vista previa), «Exportar contexto para Claude»,
// estudios privados (tabla manual: valor + rango, SIN interpretar), espacio usado, ejemplo y «Borrar todo».
// Nada se sube a ningún lado: todo es descarga/lectura local (03 §12.5, §13.4).
import { buildContext } from '../features/fp-context.js';

console.log('[fp/view-vault] init');

const mb = (b) => (b == null ? '—' : b < 1048576 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1048576).toFixed(1)} MB`);

export default {
  id: 'vault',
  title: 'Vault',
  icon: 'vault',
  theme: 'dark',
  hint: 'Exportar, importar, contexto para Claude',

  windows(ctx) {
    const { esc, icon, toast, fmt } = ctx.ui;
    const M = ctx.M;

    return [
      /* ── EXPORTAR ─────────────────────────── */
      {
        id: 'exportar', title: 'Exportar vault', icon: 'download', glass: 1,
        def: { x: 0.02, y: 0.03, w: 0.3, h: 0.45 },
        mount(body) {
          body.classList.add('fp-vb');
          body.innerHTML = `
            <p class="fp-small">Un archivo <span class="fp-data">fp-vault-AAAA-MM-DD.json</span> con perfil, días, sesiones y preferencias. Sirve de backup y para pasar a otro dispositivo.</p>
            <div class="fp-stack">
              <label class="fp-switch"><input type="checkbox" data-media /><i></i>Incluir fotos (en base64, pesa más)</label>
              <label class="fp-switch"><input type="checkbox" data-labs /><i></i>Incluir estudios (sensible)</label>
            </div>
            <p class="fp-vb-banner">${icon('alert', 16)} Este archivo contiene datos personales. No lo subas a ningún repo ni bucket público.</p>
            <div class="fp-row fp-row--between"><span class="fp-small fp-data" data-stats>…</span>
              <button type="button" class="fp-btn fp-btn--primary" data-go>${icon('download', 16)} Descargar vault</button></div>`;
          const stats = body.querySelector('[data-stats]');
          const paint = async () => {
            const days = await ctx.store.allDays(); const ss = await ctx.store.listSessions(); const media = await ctx.store.listMedia();
            stats.textContent = `${days.length} días · ${ss.length} sesiones · ${media.length} fotos`;
          };
          body.querySelector('[data-go]').addEventListener('click', async () => {
            const obj = await ctx.store.exportVault({ includeMedia: body.querySelector('[data-media]').checked, includeLabs: body.querySelector('[data-labs]').checked });
            ctx.ui.downloadFile(`fp-vault-${M.todayISO()}.json`, JSON.stringify(obj, null, 1));
            toast('Vault descargado. Guardalo en un lugar privado.', 'ok');
          });
          paint(); ctx.onData(paint);
        },
      },

      /* ── IMPORTAR ─────────────────────────── */
      {
        id: 'importar', title: 'Importar vault', icon: 'upload', glass: 1,
        def: { x: 0.02, y: 0.51, w: 0.3, h: 0.46 },
        mount(body) {
          body.classList.add('fp-vb');
          let pending = null;
          body.innerHTML = `
            <label class="fp-drop" data-drop>
              <input type="file" accept=".json,application/json" class="fp-sr" data-file />
              ${icon('upload', 26)}<b>Soltá o elegí un fp-vault-*.json</b>
              <span class="fp-small">Se fusiona por fecha: lo que no viene en el archivo no se borra.</span>
            </label>
            <div data-preview></div>`;
          const prev = body.querySelector('[data-preview]');
          const drop = body.querySelector('[data-drop]');
          const read = async (f) => {
            if (!f) return;
            let obj;
            try { obj = JSON.parse(await f.text()); } catch { prev.innerHTML = `<p class="fp-vb-banner fp-vb-banner--bad">${icon('alert', 16)} No es un JSON válido.</p>`; return; }
            const p = await ctx.store.previewImport(obj);
            if (!p.ok) { prev.innerHTML = `<p class="fp-vb-banner fp-vb-banner--bad">${icon('alert', 16)} ${esc(p.error)}</p>`; pending = null; return; }
            pending = obj;
            prev.innerHTML = `
              <div class="fp-vb-diff">
                <div><b class="fp-data">${p.newDays}</b><span>días nuevos</span></div>
                <div><b class="fp-data">${p.updatedDays}</b><span>actualizados</span></div>
                <div><b class="fp-data">${p.same}</b><span>iguales</span></div>
                <div><b class="fp-data">${p.newSessions}</b><span>sesiones nuevas</span></div>
                <div><b class="fp-data">${p.media}</b><span>fotos</span></div>
                <div><b class="fp-data">${p.labs}</b><span>estudios</span></div>
              </div>
              <p class="fp-small">${esc(f.name)}${obj.exportedAt ? ` · exportado ${esc(String(obj.exportedAt).slice(0, 10))}` : ''}${p.hasProfile ? ' · trae perfil (reemplaza el actual)' : ''}</p>
              <div class="fp-row"><button type="button" class="fp-btn fp-btn--primary fp-btn--sm" data-ok>Importar (fusionar)</button><button type="button" class="fp-btn fp-btn--sm" data-no>Cancelar</button></div>`;
            prev.querySelector('[data-ok]').addEventListener('click', async () => {
              const r = await ctx.store.importVault(pending);
              pending = null; prev.innerHTML = '';
              toast(r.ok ? `Importado: ${r.newDays} días nuevos, ${r.updatedDays} actualizados.` : r.error, r.ok ? 'ok' : 'bad');
            });
            prev.querySelector('[data-no]').addEventListener('click', () => { pending = null; prev.innerHTML = ''; });
          };
          body.querySelector('[data-file]').addEventListener('change', (e) => read(e.target.files[0]));
          drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('is-over'); });
          drop.addEventListener('dragleave', () => drop.classList.remove('is-over'));
          drop.addEventListener('drop', (e) => { e.preventDefault(); drop.classList.remove('is-over'); read(e.dataTransfer.files[0]); });
        },
      },

      /* ── CONTEXTO PARA CLAUDE ─────────────── */
      {
        id: 'contexto', title: 'Exportar contexto para Claude', icon: 'copy', glass: 1,
        def: { x: 0.34, y: 0.03, w: 0.38, h: 0.94 },
        mount(body) {
          body.classList.add('fp-vb');
          let level = 'normal', md = '';
          body.innerHTML = `
            <p class="fp-small">Arma un <span class="fp-data">.md</span> para pegarle a Claude: quién sos, meta y banda realista, plan, últimos días, volumen, check-ins, Motion Lab y premisas a revisar. Memoria del cuerpo al que le habla.</p>
            <div class="fp-row fp-row--between fp-vb-wrap">
              <div class="fp-seg" data-level><button type="button" data-v="corto">Corto</button><button type="button" data-v="normal">Normal</button><button type="button" data-v="completo">Completo</button></div>
              <label class="fp-switch"><input type="checkbox" data-sens /><i></i>Incluir datos sensibles</label>
            </div>
            <p class="fp-vb-banner fp-vb-banner--bad" data-warn hidden>${icon('alert', 16)} Vas a pegar datos personales en un chat — revisá antes de enviar.</p>
            <p class="fp-small">Las fotos nunca se incluyen como imagen.</p>
            <label class="fp-field"><span>Qué necesito ahora</span><textarea class="fp-textarea" rows="2" data-need placeholder="Ej.: armame la semana que viene subiendo dorsal sin tocar piernas."></textarea></label>
            <div class="fp-row fp-row--between"><span class="fp-small fp-data" data-wc>…</span>
              <div class="fp-row"><button type="button" class="fp-btn fp-btn--sm" data-copy>${icon('copy', 14)} Copiar</button><button type="button" class="fp-btn fp-btn--sm fp-btn--primary" data-dl>${icon('download', 14)} Descargar .md</button></div></div>
            <pre class="fp-vb-pre" data-pre tabindex="0" aria-label="Vista previa del contexto"></pre>`;
          const pre = body.querySelector('[data-pre]'), wc = body.querySelector('[data-wc]');
          const sens = body.querySelector('[data-sens]'), warn = body.querySelector('[data-warn]'), need = body.querySelector('[data-need]');
          let t = null;
          const gen = async () => {
            pre.textContent = 'Armando…';
            try {
              md = await buildContext({ level, includeSensitive: sens.checked, need: need.value.trim() }, ctx.data);
              pre.textContent = md;
              const words = md.split(/\s+/).filter(Boolean).length;
              wc.textContent = `${fmt(words, 0)} palabras ${words > 2500 ? '· pasa de 2.500: usá «Normal» o «Corto»' : '· ≤ 2.500'}`;
            } catch (e) { pre.textContent = `No se pudo armar: ${e.message}`; }
          };
          const later = () => { clearTimeout(t); t = setTimeout(gen, 250); };
          ctx.ui.segmented(body.querySelector('[data-level]'), level, (v) => { level = v; gen(); });
          sens.addEventListener('change', () => { warn.hidden = !sens.checked; gen(); });
          need.addEventListener('input', later);
          body.querySelector('[data-copy]').addEventListener('click', async () => { if (!md) await gen(); toast((await ctx.ui.copyText(md)) ? 'Contexto copiado. Pegalo en el chat.' : 'No pude copiar: usá «Descargar».', 'ok'); });
          body.querySelector('[data-dl]').addEventListener('click', async () => { if (!md) await gen(); ctx.ui.downloadFile(`contexto-franco-${M.todayISO()}.md`, md, 'text/markdown'); });
          gen(); ctx.onData(later);
        },
      },

      /* ── ESTUDIOS (privado) ───────────────── */
      {
        id: 'estudios', title: 'Estudios · privado', icon: 'file', glass: 1,
        def: { x: 0.74, y: 0.03, w: 0.24, h: 0.55 },
        mount(body) {
          body.classList.add('fp-vb');
          body.innerHTML = `
            <p class="fp-vb-fixed">Esto lo lee tu médico, no la app.</p>
            <p class="fp-small">Copiá los valores tal cual con su rango de referencia. La app no calcula, no clasifica y no alerta.</p>
            <form class="fp-stack" data-lf autocomplete="off">
              <div class="fp-vb-grid2 fp-vb-compact">
                <label class="fp-field"><span>Nombre</span><input class="fp-input" name="name" required /></label>
                <label class="fp-field"><span>Fecha</span><input class="fp-input" type="date" name="date" value="${M.todayISO()}" /></label>
                <label class="fp-field"><span>Valor</span><input class="fp-input" name="value" required /></label>
                <label class="fp-field"><span>Unidad</span><input class="fp-input" name="unit" /></label>
              </div>
              <label class="fp-field"><span>Rango de referencia (del informe)</span><input class="fp-input" name="range" placeholder="tal cual figura" /></label>
              <button type="submit" class="fp-btn fp-btn--sm">${icon('plus', 14)} Agregar</button>
            </form>
            <div data-lt></div>`;
          const form = body.querySelector('[data-lf]'), lt = body.querySelector('[data-lt]');
          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const f = form.elements;
            await ctx.store.putLab({ id: ctx.env.uid('lab'), name: f.name.value.trim(), value: f.value.value.trim(), unit: f.unit.value.trim(), range: f.range.value.trim(), date: f.date.value, createdAt: new Date().toISOString() });
            f.name.value = ''; f.value.value = ''; f.unit.value = ''; f.range.value = '';
          });
          const paint = async () => {
            const rows = await ctx.store.listLabs();
            lt.innerHTML = rows.length ? `<table class="fp-table fp-vb-tight"><thead><tr><th>Fecha</th><th>Nombre</th><th>Valor</th><th>Rango</th><th></th></tr></thead><tbody>
              ${rows.map((r) => `<tr><td class="fp-num">${esc(r.date || '')}</td><td>${esc(r.name)}</td><td class="fp-num">${esc(r.value)} ${esc(r.unit || '')}</td><td class="fp-small">${esc(r.range || '—')}</td>
                <td><button type="button" class="fp-btn fp-btn--sm fp-btn--icon fp-btn--ghost" data-del="${esc(r.id)}" aria-label="Borrar ${esc(r.name)}">${icon('trash', 14)}</button></td></tr>`).join('')}
            </tbody></table>` : '<p class="fp-small">Sin valores cargados.</p>';
            lt.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => ctx.store.deleteLab(b.dataset.del)));
          };
          paint(); ctx.onData((d) => { if (!d || d.kind === 'lab' || d.kind === 'all') paint(); });
        },
      },

      /* ── DATOS DEL DISPOSITIVO ────────────── */
      {
        id: 'datos', title: 'Datos del dispositivo', icon: 'layers', glass: 1,
        def: { x: 0.74, y: 0.61, w: 0.24, h: 0.36 },
        mount(body) {
          body.classList.add('fp-vb');
          const paint = async () => {
            const u = await ctx.store.usage();
            const demo = await ctx.store.hasDemo();
            body.innerHTML = `
              <div class="fp-vb-kv"><span>Espacio usado</span><b class="fp-data">${u ? `${mb(u.used)} de ${mb(u.quota)}` : 'no disponible'}</b></div>
              ${u ? `<div class="fp-bar"><i style="--v:${Math.max(1, Math.min(100, (u.used / u.quota) * 100)).toFixed(1)}"></i></div>` : ''}
              <div class="fp-row fp-vb-wrap">
                ${demo ? `<button type="button" class="fp-btn fp-btn--sm" data-cleardemo>${icon('trash', 14)} Borrar datos de ejemplo</button>`
                  : `<button type="button" class="fp-btn fp-btn--sm" data-loaddemo>${icon('sparkle', 14)} Cargar 14 días de ejemplo</button>`}
              </div>
              <div class="fp-vb-danger">
                <p class="fp-label">Borrar todo</p>
                <p class="fp-small">Borra perfil, días, sesiones, fotos y estudios de este dispositivo. No se puede deshacer: exportá antes.</p>
                <div class="fp-row"><input class="fp-input fp-vb-confirm" placeholder="Escribí BORRAR" data-conf aria-label="Escribí BORRAR para confirmar" />
                <button type="button" class="fp-btn fp-btn--sm fp-btn--danger" data-wipe disabled>${icon('trash', 14)} Borrar todo</button></div>
              </div>`;
            const conf = body.querySelector('[data-conf]'), wipe = body.querySelector('[data-wipe]');
            conf.addEventListener('input', () => { wipe.disabled = conf.value.trim().toUpperCase() !== 'BORRAR'; });
            wipe.addEventListener('click', async () => {
              if (!window.confirm('Última confirmación: ¿borrar TODO el vault de este dispositivo?')) return;
              await ctx.store.clearAll();
              toast('Vault borrado.', 'info');
            });
            body.querySelector('[data-cleardemo]')?.addEventListener('click', async () => { await ctx.store.clearDemo(); toast('Datos de ejemplo borrados.', 'ok'); });
            body.querySelector('[data-loaddemo]')?.addEventListener('click', async (e) => {
              e.currentTarget.disabled = true;
              const { loadDemo } = await import('../core/fp-demo.js');
              const r = await loadDemo(ctx.data);
              toast(`Listo: ${r.written} días de EJEMPLO (se borran con un click).`, 'ok');
            });
          };
          paint(); ctx.onData(paint);
        },
      },
    ];
  },
};
