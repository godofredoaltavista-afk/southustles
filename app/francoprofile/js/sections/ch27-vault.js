// FP · CH27 · VAULT Y «EXPORTAR CONTEXTO PARA CLAUDE» — panel de vidrio sin terminal (03 §13.4).
// Exportar/importar el vault (merge por fecha con vista previa, sin borrar lo que no viene), armar el .md de
// contexto (3 niveles, interruptor de sensibles con cartel), y cargar/borrar los datos de EJEMPLO.
// Nada se sube a ningún lado: todo se descarga o se copia en este dispositivo.
console.log('[fp/ch27-vault] init');

export default {
  id: 'vault',
  n: '27',
  title: 'Vault',
  pol: 'invert',
  bg: 'dots',
  app: 'vault',
  bridge: 'Tu cuerpo, tus datos, tu dispositivo.',

  render(ctx) {
    const { icon, tag } = ctx.ui;
    return `
<div class="fp-wrap fp-wrap--wide">
  <header class="fp-head" data-fp-fade>
    <span class="fp-eyebrow"><b>27</b> Vault y contexto</span>
    <h2>La memoria <em>del</em> cuerpo.</h2>
    <p class="fp-lede">Todo queda en este dispositivo (IndexedDB). Exportá el vault para no perderlo y armá un contexto listo para pegarle a Claude, así sabe a quién le está hablando ${tag('C')}.</p>
  </header>

  <div class="fp-vault">
    <section class="fp-vault__panel fp-vault__panel--ctx" data-fp-fade="left">
      <div class="fp-vault__h"><span class="fp-vault__dots" aria-hidden="true"><i></i><i></i><i></i></span><h3>${icon('sparkle', 16)} Exportar contexto para Claude</h3></div>
      <div class="fp-field"><span>Nivel de detalle</span>
        <div class="fp-seg" data-v-level role="group" aria-label="Nivel de detalle">
          <button type="button" data-v="corto">Corto · 7 días</button><button type="button" data-v="normal" aria-pressed="true">Normal · 14</button><button type="button" data-v="completo">Completo · 28</button>
        </div></div>
      <div class="fp-row">
        <label class="fp-switch"><input type="checkbox" disabled><i></i>Incluir fotos <small class="fp-muted">(nunca: solo texto)</small></label>
        <label class="fp-switch"><input type="checkbox" data-v-sens><i></i>Incluir datos sensibles</label>
      </div>
      <p class="fp-vault__warn" data-v-warn hidden>${icon('alert', 15)} Vas a pegar datos personales en un chat — revisá antes de enviar.</p>
      <label class="fp-field"><span>Qué necesito ahora</span><textarea class="fp-textarea" data-v-need rows="2" placeholder="Ej.: ajustá el plan de esta semana: me duele el pulgar y quiero sumar dorsal."></textarea></label>
      <div class="fp-row">
        <button type="button" class="fp-btn fp-btn--accent" data-v-gen data-fp-magnetic>${icon('sparkle', 16)} Armar contexto</button>
        <button type="button" class="fp-btn" data-v-copy disabled>${icon('copy', 16)} Copiar</button>
        <button type="button" class="fp-btn" data-v-dl disabled>${icon('download', 16)} .md</button>
      </div>
      <pre class="fp-vault__pre" data-v-pre aria-live="polite">El contexto aparece acá. No sale de este dispositivo hasta que vos lo pegues.</pre>
    </section>

    <div class="fp-vault__side">
      <section class="fp-vault__panel" data-fp-fade="right">
        <div class="fp-vault__h"><span class="fp-vault__dots" aria-hidden="true"><i></i><i></i><i></i></span><h3>${icon('vault', 16)} Vault</h3></div>
        <div class="fp-vault__stats" data-v-stats></div>
        <div class="fp-row">
          <label class="fp-switch"><input type="checkbox" data-v-media><i></i>Incluir fotos</label>
          <label class="fp-switch"><input type="checkbox" data-v-labs><i></i>Incluir estudios</label>
        </div>
        <div class="fp-row">
          <button type="button" class="fp-btn fp-btn--primary" data-v-export data-fp-magnetic>${icon('download', 16)} Exportar vault</button>
          <label class="fp-btn" tabindex="0">${icon('upload', 16)} Importar<input type="file" accept="application/json,.json" data-v-import hidden></label>
        </div>
        <div class="fp-vault__preview" data-v-preview hidden></div>
        <p class="fp-small">${icon('info', 13)} El archivo contiene datos personales: no lo subas a ningún repo ni bucket.</p>
      </section>

      <section class="fp-vault__panel" data-fp-fade="right">
        <div class="fp-vault__h"><span class="fp-vault__dots" aria-hidden="true"><i></i><i></i><i></i></span><h3>${icon('layers', 16)} Datos de ejemplo</h3></div>
        <p class="fp-small" data-v-demo-state>—</p>
        <div class="fp-row">
          <button type="button" class="fp-btn fp-btn--sm" data-v-demo-load>${icon('plus', 15)} Llenar con 14 días de ejemplo</button>
          <button type="button" class="fp-btn fp-btn--sm fp-btn--danger" data-v-demo-clear>${icon('trash', 15)} Borrar ejemplo</button>
        </div>
      </section>
    </div>
  </div>
</div>`;
  },

  init(el, ctx) {
    const $ = (s) => el.querySelector(s);
    const { ui, store } = ctx;
    let level = 'normal', md = '', pendingImport = null;

    // ── contexto
    ui.segmented($('[data-v-level]'), level, (v) => { level = v; });
    const sens = $('[data-v-sens]'), warn = $('[data-v-warn]');
    sens.addEventListener('change', () => { warn.hidden = !sens.checked; });
    const pre = $('[data-v-pre]'), copyB = $('[data-v-copy]'), dlB = $('[data-v-dl]');
    $('[data-v-gen]').addEventListener('click', async () => {
      pre.textContent = 'Armando…';
      try {
        const { buildContext } = await import('../features/fp-context.js');
        md = await buildContext({ level, includeSensitive: sens.checked, need: $('[data-v-need]').value.trim() }, ctx.data);
        pre.textContent = md;
        copyB.disabled = false; dlB.disabled = false;
        const words = md.split(/\s+/).filter(Boolean).length;
        ui.toast(`Contexto listo: ~${words} palabras.`, 'ok');
      } catch (e) {
        pre.textContent = `No pude armar el contexto: ${e.message}`;
      }
    });
    copyB.addEventListener('click', async () => { if (md) ui.toast((await ui.copyText(md)) ? 'Copiado. Pegalo en el chat.' : 'No pude copiar: usá descargar.', 'ok'); });
    dlB.addEventListener('click', () => { if (md) ui.downloadFile(`contexto-franco-${ctx.M.todayISO()}.md`, md, 'text/markdown'); });

    // ── vault: estado
    const stats = $('[data-v-stats]');
    const paintStats = async () => {
      const days = ctx.state.days || [];
      const sessions = ctx.state.sessions || [];
      let media = 0, labs = 0, usage = null;
      try { media = (await store.listMedia()).length; labs = (await store.listLabs()).length; usage = await store.usage(); } catch { /* */ }
      const demoDays = days.filter((d) => d.demo).length;
      stats.innerHTML = [
        ['días', days.length, demoDays ? `${demoDays} de ejemplo` : ''],
        ['sesiones ML', sessions.length, ''],
        ['fotos', media, 'solo local'],
        ['estudios', labs, 'sensible'],
      ].map(([k, v, s]) => `<div><b class="fp-display">${v}</b><span>${k}</span>${s ? `<small>${s}</small>` : ''}</div>`).join('')
        + (usage ? `<p class="fp-small fp-data">${(usage.used / 1048576).toFixed(1)} MB usados en este navegador</p>` : '');
      $('[data-v-demo-state]').innerHTML = demoDays || sessions.some((s) => s.demo)
        ? `${ui.demoChip()} Hay ${demoDays} días de ejemplo cargados. Se marcan en toda la app y no se mezclan con lo tuyo.`
        : 'No hay datos de ejemplo. Cargalos para ver la app llena; se borran con un click.';
    };
    paintStats();
    ctx.onData(async () => { await ctx.load(); paintStats(); });

    // ── exportar
    $('[data-v-export]').addEventListener('click', async () => {
      try {
        const obj = await store.exportVault({ includeMedia: $('[data-v-media]').checked, includeLabs: $('[data-v-labs]').checked });
        ui.downloadFile(`fp-vault-${ctx.M.todayISO()}.json`, JSON.stringify(obj, null, 2));
        ui.toast('Vault exportado. Guardalo en un lugar privado.', 'ok');
      } catch (e) { ui.toast(`No pude exportar: ${e.message}`, 'bad'); }
    });

    // ── importar con vista previa
    const prev = $('[data-v-preview]');
    $('[data-v-import]').addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file) return;
      let obj;
      try { obj = JSON.parse(await file.text()); } catch { ui.toast('Ese archivo no es un JSON válido.', 'bad'); return; }
      const p = await store.previewImport(obj);
      prev.hidden = false;
      if (!p.ok) { prev.innerHTML = `<p class="fp-vault__warn">${ui.icon('alert', 15)} ${ui.esc(p.error)}</p>`; pendingImport = null; return; }
      pendingImport = obj;
      prev.innerHTML = `<p><b>${ui.esc(file.name)}</b></p>
        <ul class="fp-list"><li>${p.newDays} días nuevos</li><li>${p.updatedDays} días actualizados</li><li>${p.same} iguales</li><li>${p.newSessions} sesiones nuevas · ${p.media} fotos · ${p.labs} estudios</li></ul>
        <p class="fp-small">No se borra nada que no venga en el archivo.</p>
        <div class="fp-row"><button type="button" class="fp-btn fp-btn--primary fp-btn--sm" data-v-confirm>Importar</button><button type="button" class="fp-btn fp-btn--sm" data-v-cancel>Cancelar</button></div>`;
      prev.querySelector('[data-v-cancel]').addEventListener('click', () => { prev.hidden = true; pendingImport = null; });
      prev.querySelector('[data-v-confirm]').addEventListener('click', async () => {
        if (!pendingImport) return;
        const r = await store.importVault(pendingImport);
        pendingImport = null; prev.hidden = true;
        ui.toast(r.ok ? `Importado: ${r.newDays} nuevos, ${r.updatedDays} actualizados.` : r.error, r.ok ? 'ok' : 'bad');
      });
    });

    // ── ejemplo
    const demoBtn = $('[data-v-demo-load]');
    demoBtn.addEventListener('click', async () => {
      demoBtn.disabled = true;
      try {
        const { loadDemo } = await import('../core/fp-demo.js');
        const r = await loadDemo(ctx.data);
        ui.toast(r.written ? `Cargué ${r.written} días de EJEMPLO.` : 'Ya había datos en esos días: no pisé nada.', 'ok');
      } catch (err) { ui.toast(`No pude cargar el ejemplo: ${err.message}`, 'bad'); }
      demoBtn.disabled = false;
    });
    $('[data-v-demo-clear]').addEventListener('click', async () => {
      if (!confirm('¿Borrar todos los datos de EJEMPLO? Lo tuyo no se toca.')) return;
      await store.clearDemo();
      ui.toast('Datos de ejemplo borrados.', 'ok');
    });
  },
};
