/* ═══════════════════════════════════════════
   SH2 FLIP — click a holo teaser card: it zooms to
   center and 3D-flips to a BACK FACE carrying a tiny
   "microfrontend" (mono terminal panel + sparkline).
   Esc / second click returns it. Keyboard accessible.
   ═══════════════════════════════════════════ */

import { lockBodyScroll, unlockBodyScroll } from './scroll-lock.js';

export function initHoloFlip() {
  const cards = document.querySelectorAll('.holo-card');
  if (!cards.length) return;

  let overlay = null;

  const sparkline = () => {
    const pts = Array.from({ length: 14 }, (_, i) =>
      `${i * 10},${30 - Math.round(6 + Math.random() * 18)}`).join(' ');
    return `<svg viewBox="0 0 130 32" class="hf-spark" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;
  };

  const close = () => {
    if (!overlay) return;
    const o = overlay; overlay = null;
    if (o._clock) clearInterval(o._clock);
    o.classList.remove('is-flipped');
    setTimeout(() => o.remove(), 450);
    document.body.classList.remove('menu-open');
    unlockBodyScroll();
    cards.forEach((c) => c.setAttribute('aria-expanded', 'false'));
  };

  const open = (card) => {
    if (overlay) { close(); return; }
    const title = card.querySelector('h3')?.textContent || 'PROJECT';
    const sub = card.querySelector('p')?.textContent || '';
    const art = card.querySelector('img')?.src || '';

    const slug = title.toLowerCase().replace(/\s+/g, '-');
    overlay = document.createElement('div');
    overlay.className = 'holo-flip-overlay';
    overlay.innerHTML = `
      <div class="hf-backdrop"></div>
      <div class="hf-card">
        <div class="hf-face hf-face--front">
          ${art ? `<img src="${art}" alt="" aria-hidden="true"/>` : ''}
          <h3>${title}</h3><p>${sub}</p>
        </div>
        <div class="hf-face hf-face--back hf-os" role="document">
          <!-- SH-OS chrome: menubar -->
          <header class="hf-os__bar">
            <span class="hf-os__lights"><i></i><i></i><i></i></span>
            <span class="hf-os__title">SH-OS · ${slug}.app</span>
            <span class="hf-os__clock" data-hf-clock>--:--</span>
          </header>
          <!-- scrollable desktop -->
          <div class="hf-os__desk">
            <div class="hf-os__hero">
              ${art ? `<img src="${art}" alt="" aria-hidden="true"/>` : ''}
              <div class="hf-os__hero-txt"><b>${title.toUpperCase()}</b><em>system running</em></div>
            </div>
            <div class="hf-os__win hf-os__win--glass">
              <header>◈ telemetry — <b>live</b></header>
              ${sparkline()}
              <p>signal stable · frames rendering · taste applied by hand</p>
            </div>
            <div class="hf-os__win hf-os__win--term">
              <header>▸ terminal</header>
              <pre>$ system.status
&gt; ${title.toUpperCase()} — RUNNING
$ stack
&gt; touchdesigner · js · glsl · vercel
$ open case-study --full
&gt; landing on its own page soon…</pre>
            </div>
            <div class="hf-os__win">
              <header>✳ readme.md</header>
              <p>${sub || 'A South Hustles system.'} Scroll this desktop — the glass window
              lets the site show through. The full product page opens from WORKS.</p>
            </div>
            <button type="button" class="hf-close">⏻ SHUT DOWN</button>
          </div>
          <!-- dock -->
          <footer class="hf-os__dock" aria-hidden="true">
            <span>◉</span><span>✦</span><span>▦</span><span>♪</span><span>⚙</span>
          </footer>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    document.body.classList.add('menu-open');
    lockBodyScroll();
    card.setAttribute('aria-expanded', 'true');

    overlay.querySelector('.hf-backdrop').addEventListener('click', close);
    overlay.querySelector('.hf-close').addEventListener('click', close);
    overlay.querySelector('.hf-card').addEventListener('click', (e) => {
      if (!e.target.closest('.hf-face--back')) close();
    });
    // SH-OS clock ticks while the card is open
    const clock = overlay.querySelector('[data-hf-clock]');
    if (clock) {
      const t = () => { clock.textContent = new Date().toTimeString().slice(0, 5); };
      t(); overlay._clock = setInterval(t, 30000);
    }

    // zoom in, then flip
    requestAnimationFrame(() => requestAnimationFrame(() => overlay?.classList.add('is-flipped')));
    overlay.querySelector('.hf-close').focus();
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay) close();
  });

  cards.forEach((card) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-expanded', 'false');
    card.addEventListener('click', () => open(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); open(card); }
    });
  });
}
