/* ═══════════════════════════════════════════
   SH3 PAGES — in-site pages that OPEN (Franco:
   "no es modificar, es COMBINAR lo que tenemos en
   páginas nuevas"). Full-screen page overlays built
   from existing components: WORKS (project grid →
   product pages), ABOUT (manifesto + timeline),
   PROJECT (case-study template per project).
   Opened via [data-page-open]; deep-linked #/works.
   ═══════════════════════════════════════════ */

const PROJECTS = [
  { slug: 'data-symphony', name: 'Data Symphony', em: 'Symphony', year: 2022, who: 'MARCEL · JULY', disc: 'DEVELOPMENT · GENERATIVE', art: 'assets/projects/data-symphony.svg', blurb: 'Forty years of concert programmes turned into a living identity — a TouchDesigner network that composes visuals the way the orchestra composes sound.' },
  { slug: 'codecraft', name: 'CodeCraft', em: 'Craft', year: 2023, who: 'MICHAEL · JANUARY', disc: 'DESIGN · EDUCATION', art: 'assets/projects/codecraft.svg', blurb: 'A design system that behaves like a curriculum: modular lessons, composable blocks, a type scale that levels up.' },
  { slug: 'pixel-perfect', name: 'Pixel Perfect', em: 'Perfect', year: 2022, who: 'SARAH · SEPTEMBER', disc: 'DESIGN · BRANDING', art: 'assets/projects/pixel-perfect.svg', blurb: 'A pixel-native language for an art-print marketplace — dithered imagery, bitmap type, an interface that celebrates the grid.' },
  { slug: 'neural-canvas', name: 'Neural Canvas', em: 'Canvas', year: 2023, who: 'EMILY · JUNE', disc: 'BRANDING · AI', art: 'assets/projects/neural-canvas.svg', blurb: 'Every model checkpoint renders its own generative portrait — research progress you can see and collect.' },
  { slug: 'motion-atlas', name: 'Motion Atlas', em: 'Atlas', year: 2024, who: 'STUDIO · MARCH', disc: 'EXPERIENCE · WEB', art: 'assets/projects/motion-atlas.svg', blurb: 'A choreography archive that moves the way its dancers do — scroll velocity drives playback.' },
  { slug: 'chromatic', name: 'Chromatic', em: 'matic', year: 2021, who: 'STUDIO · OCTOBER', disc: 'BRANDING · MUSIC', art: 'assets/projects/chromatic.svg', blurb: 'A chromatic engine: every release generates its own palette from the audio’s spectral fingerprint.' },
];

const pageShell = (id, label, inner) => `
  <div class="sh-page__chrome">
    <span class="sh-page__crumb">SH — <b>${label}</b></span>
    <button type="button" class="sh-page__close" data-page-close aria-label="Close page">✕ CLOSE</button>
  </div>
  <div class="sh-page__scroll">${inner}</div>`;

const worksInner = () => `
  <header class="sh-page__hero">
    <p class="sh-page__kicker">WORKS — ALL SYSTEMS <b>[W]</b></p>
    <h2 class="sh-page__title">EVERY SYSTEM<br/>WE <em>shipped</em></h2>
  </header>
  <div class="pw-grid">
    ${PROJECTS.map((p, i) => `
      <button type="button" class="pw-card" data-page-open="project" data-project="${p.slug}">
        <img src="${p.art}" alt="" aria-hidden="true"/>
        <span class="pw-card__num">W.${String(i + 1).padStart(2, '0')}</span>
        <span class="pw-card__name">${p.name}</span>
        <span class="pw-card__meta">${p.disc} · ${p.year}</span>
        <span class="pw-card__go">OPEN PRODUCT PAGE →</span>
      </button>`).join('')}
  </div>`;

const aboutInner = () => `
  <header class="sh-page__hero">
    <p class="sh-page__kicker">ABOUT — THE STUDIO <b>[A]</b></p>
    <h2 class="sh-page__title">SOUTH<br/><em>Hustles</em></h2>
    <p class="sh-page__lede">A creative studio for a conscious era. Direction, technology and
    emotion merged into systems that keep producing culture after we ship them.
    Based in Geneva — working worldwide.</p>
  </header>
  <div class="pa-cols">
    <div><span>[01]</span><h3>What we believe</h3><p>Brands are living systems, not artifacts. Every identity carries its own rules for breaking its rules.</p></div>
    <div><span>[02]</span><h3>How we work</h3><p>Direction first, pixels last. Async by default, present when it matters. Additive only.</p></div>
    <div><span>[03]</span><h3>Who we teach</h3><p>The University shares the methods behind the agency — the best students never really leave.</p></div>
  </div>
  <div class="pa-beats">
    <div><b>2012</b><p>First hustle — a borrowed laptop, a music video, a name that stuck.</p></div>
    <div><b>2013</b><p>The studio forms: direction + code under one roof.</p></div>
    <div><b>2015</b><p>Global reach — first system that outlived its campaign.</p></div>
    <div><b>2020</b><p>CUSA System: TouchDesigner practice becomes shippable instruments.</p></div>
    <div><b>NOW</b><p>Agency, system and university as one ecosystem.</p></div>
  </div>
  <p class="sh-page__foot">hello@southhustles.com · 8099 Switzerland · +1 22 123 4567</p>`;

const projectInner = (p) => `
  <header class="sh-page__hero sh-page__hero--project">
    <p class="sh-page__kicker">PRODUCT PAGE — ${p.disc} <b>· ${p.year}</b></p>
    <h2 class="sh-page__title">${p.name.replace(p.em, '')}<em>${p.em}</em></h2>
    <div class="pp-meta"><span>${p.who}</span><span>${p.disc}</span><span>CF-ASSET · PROJECT-GIF-${p.slug.toUpperCase()}</span></div>
  </header>
  <div class="pp-banner" data-cf-asset="project-gif-${p.slug}">
    <img src="${p.art}" alt="" aria-hidden="true"/>
    <figcaption>FIG.01 — preview placeholder · the real reel lands from Cloudflare.</figcaption>
  </div>
  <p class="pp-epigraph">« ${p.blurb} »</p>
  <div class="pp-blocks">
    <div><span>01 — BRIEF</span><p>Full case copy pending from the studio archive. This product page is live and ready — drop the real copy in and it ships.</p></div>
    <div><span>02 — SYSTEM</span><p>Structure mirrors the Data Symphony template: epigraphs, parallax banners, journey blocks, stats.</p></div>
    <div><span>03 — OUTPUT</span><p>Reserved. <i data-cf-asset="case-banner-${p.slug}">CF-ASSET · CASE-BANNER-${p.slug.toUpperCase()}</i></p></div>
  </div>
  <button type="button" class="pp-next" data-page-open="works">← ALL WORKS</button>`;

export function initPages() {
  const host = document.createElement('div');
  host.className = 'sh-page';
  host.setAttribute('role', 'dialog');
  host.setAttribute('aria-modal', 'true');
  host.setAttribute('aria-hidden', 'true');
  document.body.appendChild(host);

  let lastFocus = null;
  let openId = null;

  const render = (kind, arg) => {
    if (kind === 'works') host.innerHTML = pageShell('works', 'WORKS', worksInner());
    else if (kind === 'about') host.innerHTML = pageShell('about', 'ABOUT', aboutInner());
    else if (kind === 'project') {
      const p = PROJECTS.find((x) => x.slug === arg) || PROJECTS[0];
      host.innerHTML = pageShell('project', p.name.toUpperCase(), projectInner(p));
    } else return false;
    return true;
  };

  const open = (kind, arg) => {
    if (!render(kind, arg)) return;
    if (!openId) lastFocus = document.activeElement;
    openId = kind;
    host.classList.add('is-open');
    host.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
    host.querySelector('.sh-page__scroll').scrollTop = 0;
    host.querySelector('.sh-page__close')?.focus();
    try { history.replaceState(null, '', `#/${kind}${arg ? ':' + arg : ''}`); } catch {}
  };

  const close = () => {
    openId = null;
    host.classList.remove('is-open');
    host.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    try { history.replaceState(null, '', location.pathname); } catch {}
    if (lastFocus?.focus) lastFocus.focus();
  };

  // delegated: any [data-page-open] anywhere (including inside pages)
  document.addEventListener('click', (e) => {
    const closer = e.target.closest('[data-page-close]');
    if (closer && host.contains(closer)) { close(); return; }
    const opener = e.target.closest('[data-page-open]');
    if (!opener) return;
    e.preventDefault();
    open(opener.dataset.pageOpen, opener.dataset.project);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && openId) close();
  });

  // existing project rows in #work also open their product page
  document.querySelectorAll('.project-row').forEach((row) => {
    const name = (row.querySelector('b, .pr-name')?.textContent || row.textContent).trim().toLowerCase();
    const p = PROJECTS.find((x) => name.includes(x.name.toLowerCase()));
    if (!p) return;
    row.style.cursor = 'pointer';
    row.addEventListener('click', () => open('project', p.slug));
  });

  // deep link: #/works, #/about, #/project:slug
  const m = location.hash.match(/^#\/(works|about|project)(?::([a-z-]+))?/);
  if (m) open(m[1], m[2]);
}
