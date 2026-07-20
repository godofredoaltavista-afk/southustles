/* ═══════════════════════════════════════════
   GLASS CARDS — accordion-style expand/collapse for
   the Methods & Tools grid. The CSS (.glass-card.open,
   __data max-height, __x fade-in) already existed in
   sections.css; this just wires the class toggle
   (ported from reference/hustles-original/glass-cards.js's
   single-card-open-at-a-time pattern).
   ═══════════════════════════════════════════ */

export function initGlassCards() {
  const grid = document.querySelector('.glass-grid');
  if (!grid) return;

  grid.querySelectorAll('.glass-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.glass-card__x')) {
        card.classList.remove('open');
        return;
      }
      const wasOpen = card.classList.contains('open');
      grid.querySelectorAll('.glass-card.open').forEach((c) => c.classList.remove('open'));
      if (!wasOpen) card.classList.add('open');
    });
  });
}
