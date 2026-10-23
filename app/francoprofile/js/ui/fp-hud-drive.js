// FP · DRIVE HUD — puerto de NavHUD (ant-on-mars/src/scripts/components/NavHUD.js).
// Píldora abajo al centro con los «drive modes» G · Z · H · F (atajos de teclado, ignorados con foco
// en input/textarea/select/contenteditable), cada modo tiñe borde y glow con su color (sin cian:
// lima, naranja, violeta, ultramar), y panel de TELEMETRÍA que se abre hacia arriba y se arrastra.
// Telemetría de Franco: CAP · SCR · SEM · SES · RACHA · TEMA · MODO · VER. Llama ctx.gl.setDrive.
// Oculto con la app abierta. Escucha fp-app, fp-drive-changed, fp-theme-changed, fp-data-changed.
console.log('[fp/hud-drive] init');

const MODES = {
  G: { name: 'gravedad', short: 'GRAV', color: '#c6ff1a', hint: 'Las partículas caen y rebotan en el piso.' },
  Z: { name: 'imán', short: 'MAG', color: '#ff6a2b', hint: 'El cursor repele el campo (South Hustles).' },
  H: { name: 'hook', short: 'HOOK', color: '#9b6bff', hint: 'El cursor atrae y hace girar el campo.' },
  F: { name: 'flotar', short: 'FLOAT', color: '#5b67ff', hint: 'Deriva sin gravedad.' },
};
const ORDER = ['G', 'Z', 'H', 'F'];
const VER = 'fp v1 · 2026-10-23';

function readLS(k, def) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } }
function writeLS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* */ } }
const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; };

export function initDriveHud(ctx) {
  const host = document.getElementById('fp-drive');
  if (!host || host.dataset.ready) return null;
  host.dataset.ready = '1';
  const M = ctx.M;

  host.innerHTML = `
    <section class="fp-tel" id="fp-tel" aria-label="Telemetría" hidden>
      <header class="fp-tel__head" title="Arrastrá para mover">
        <span class="fp-tel__grip" aria-hidden="true"></span><b>Telemetría</b><span class="fp-tel__mode fp-data" data-tel="mode-short">MAG</span>
        <button type="button" class="fp-tel__x" aria-label="Cerrar telemetría">×</button>
      </header>
      <dl class="fp-tel__grid">
        <div><dt>CAP</dt><dd class="fp-tel__v" data-tel="cap">—</dd></div>
        <div><dt>SCR</dt><dd class="fp-tel__v fp-data" data-tel="scr">0%</dd></div>
        <div><dt>SEM</dt><dd class="fp-tel__v fp-data" data-tel="sem">—</dd></div>
        <div><dt>SES</dt><dd class="fp-tel__v" data-tel="ses">—</dd></div>
        <div><dt>RACHA</dt><dd class="fp-tel__v fp-data" data-tel="racha">—</dd></div>
        <div><dt>TEMA</dt><dd class="fp-tel__v fp-data" data-tel="tema">—</dd></div>
        <div><dt>MODO</dt><dd class="fp-tel__v" data-tel="modo">—</dd></div>
        <div><dt>SPD</dt><dd class="fp-tel__v fp-data" data-tel="spd">0</dd></div>
        <div class="fp-tel__wide"><dt>VER</dt><dd class="fp-tel__v fp-data">${VER}</dd></div>
      </dl>
      <p class="fp-tel__hint" data-tel="hint"></p>
    </section>
    <div class="fp-drive__pill" role="toolbar" aria-label="Modo del campo de partículas (teclas G Z H F)">
      <span class="fp-drive__lbl" aria-hidden="true">campo</span>
      ${ORDER.map((m) => `<button type="button" class="fp-drive__tab" data-m="${m}" aria-pressed="false" title="${MODES[m].name} — tecla ${m}"><b>${m}</b><span>${MODES[m].short}</span></button>`).join('')}
      <button type="button" class="fp-drive__tel" aria-expanded="false" aria-controls="fp-tel" title="Telemetría"><span class="fp-drive__dot" aria-hidden="true"></span>TEL<i aria-hidden="true">▲</i></button>
    </div>`;

  const pill = host.querySelector('.fp-drive__pill');
  const tabs = [...host.querySelectorAll('.fp-drive__tab')];
  const tel = host.querySelector('.fp-tel');
  const telBtn = host.querySelector('.fp-drive__tel');
  const telArrow = telBtn.querySelector('i');
  const $ = (k) => host.querySelector(`[data-tel="${k}"]`);

  /* ── modo ── */
  let mode = readLS('fp.drive', 'Z');
  if (!MODES[mode]) mode = 'Z';
  const paint = (m) => {
    mode = m;
    const c = MODES[m].color;
    tabs.forEach((t) => { const on = t.dataset.m === m; t.classList.toggle('is-active', on); t.setAttribute('aria-pressed', String(on)); });
    host.style.setProperty('--fp-drive-c', c);
    host.style.setProperty('--fp-drive-border', rgba(c, 0.5));
    host.style.setProperty('--fp-drive-glow', `0 0 16px ${rgba(c, 0.28)}`);
    $('mode-short').textContent = MODES[m].short;
    $('modo').textContent = `${m} · ${MODES[m].name}`;
    $('hint').textContent = MODES[m].hint;
  };
  const setMode = (m) => {
    if (!MODES[m]) return;
    paint(m);
    writeLS('fp.drive', m);
    if (ctx.gl?.ready && typeof ctx.gl.setDrive === 'function') ctx.gl.setDrive(m); // el campo despacha fp-drive + fp-drive-changed
    else document.dispatchEvent(new CustomEvent('fp-drive', { detail: { mode: m } })); // sin WebGL: igual avisamos al hero
  };
  paint(mode);
  tabs.forEach((t) => t.addEventListener('click', () => setMode(t.dataset.m)));
  document.addEventListener('fp-drive-changed', (e) => { const m = e.detail?.mode; if (m && m !== mode) paint(m); });
  // si el campo cargó después, sincronizamos
  setTimeout(() => { if (ctx.gl?.ready) ctx.gl.setDrive?.(mode); }, 1200);

  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
    if (host.classList.contains('is-hidden') || document.body.classList.contains('fp-menu-open')) return;
    const m = e.key.toUpperCase();
    if (MODES[m]) setMode(m);
  });

  /* ── telemetría: abrir/cerrar + arrastre (makeDraggable de AoM) ── */
  let open = readLS('fp.hud.tel', window.innerWidth >= 1280);
  const setOpen = (v) => {
    open = !!v;
    tel.hidden = !open;
    tel.classList.toggle('is-open', open);
    telBtn.setAttribute('aria-expanded', String(open));
    telArrow.textContent = open ? '▼' : '▲';
    writeLS('fp.hud.tel', open);
    if (open) refreshData();
  };
  telBtn.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!open); });
  tel.querySelector('.fp-tel__x').addEventListener('click', () => setOpen(false));

  const head = tel.querySelector('.fp-tel__head');
  const savedPos = readLS('fp.hud.telPos', null);
  const placeAt = (x, y) => {
    const r = tel.getBoundingClientRect();
    const nx = Math.min(Math.max(8, x), window.innerWidth - (r.width || 220) - 8);
    const ny = Math.min(Math.max(8, y), window.innerHeight - (r.height || 160) - 8);
    tel.classList.add('is-free');
    tel.style.left = `${nx}px`; tel.style.top = `${ny}px`;
    return [nx, ny];
  };
  if (savedPos) requestAnimationFrame(() => placeAt(savedPos[0], savedPos[1]));
  head.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || e.target.closest('button')) return;
    e.preventDefault();
    head.setPointerCapture(e.pointerId);
    const r = tel.getBoundingClientRect();
    const ox = e.clientX - r.left, oy = e.clientY - r.top;
    tel.classList.add('is-dragging');
    let last = [r.left, r.top];
    const move = (ev) => { last = placeAt(ev.clientX - ox, ev.clientY - oy); };
    const up = () => {
      tel.classList.remove('is-dragging');
      head.removeEventListener('pointermove', move);
      head.removeEventListener('pointerup', up);
      writeLS('fp.hud.telPos', last);
    };
    head.addEventListener('pointermove', move);
    head.addEventListener('pointerup', up);
  });
  head.addEventListener('dblclick', () => { tel.classList.remove('is-free'); tel.style.left = tel.style.top = ''; try { localStorage.removeItem('fp.hud.telPos'); } catch { /* */ } });

  /* ── datos: CAP (IO en la línea media), SCR + SPD (bus de scroll), SEM/SES/RACHA (vault) ── */
  const chapters = () => ctx.chapters || [...document.querySelectorAll('[data-fp-section]')].map((el) => ({ el, n: el.dataset.fpCh, title: el.dataset.fpTitle }));
  const capIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      $('cap').textContent = `${el.dataset.fpCh || '··'} ${el.dataset.fpTitle || ''}`.trim();
    });
  }, { rootMargin: '-49% 0px -49% 0px', threshold: 0 });
  const observeCaps = () => chapters().forEach((c) => c.el && capIO.observe(c.el));
  observeCaps();

  ctx.scroll.onScrollFrame((y) => {
    if (!open) return;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    $('scr').textContent = `${Math.round((y / max) * 100)}%`;
    $('spd').textContent = String(Math.round(Math.abs(ctx.scroll.scrollVelocity()) * 10) / 10);
  });

  function refreshData() {
    const st = ctx.state || {};
    const days = st.days || [];
    const profile = st.profile;
    const today = M.todayISO();
    try { $('sem').textContent = `${M.totalSets(days, M.addDays(today, -6), today)} series`; } catch { $('sem').textContent = '—'; }
    try {
      const pd = M.planFor(today, ctx.data, profile);
      $('ses').textContent = pd ? (pd.train ? pd.title : `Descanso · ${pd.short}`) : '—';
    } catch { $('ses').textContent = '—'; }
    try { $('racha').textContent = `${M.streak(days, profile, today).count} d`; } catch { $('racha').textContent = '—'; }
    $('tema').textContent = (document.documentElement.dataset.theme || 'light').toUpperCase();
  }
  refreshData();
  ctx.onData?.(() => setTimeout(refreshData, 150));
  document.addEventListener('fp-theme-changed', refreshData);

  /* ── ocultar con la app abierta ── */
  const syncApp = (o) => host.classList.toggle('is-hidden', !!o);
  syncApp(location.hash.startsWith('#/'));
  document.addEventListener('fp-app', (e) => syncApp(e.detail?.open));
  window.addEventListener('hashchange', () => syncApp(location.hash.startsWith('#/')));

  setOpen(open);
  host.classList.add('is-ready');
  return { setMode, setOpen, refresh: refreshData };
}
