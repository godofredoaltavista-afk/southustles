/* ═══════════════════════════════════════════
   PERSONALIZATION — text-size stepper in the quick
   panel's "Display" section. Concept ported from
   apacheta-app's tweaks-panel.js (applySize/markActive
   idiom) but simplified to one CSS custom property
   (--user-scale) instead of an inline font-size + a
   whole tweaks blob, since south-hustles is entirely
   rem-based and one root var is enough to cascade.
   ═══════════════════════════════════════════ */

const KEY = 'sh-text-scale';

function markActive(group, scale) {
  group.querySelectorAll('button').forEach((b) => {
    b.classList.toggle('is-active', parseFloat(b.dataset.scale) === scale);
  });
}

function apply(scale, group) {
  document.documentElement.style.setProperty('--user-scale', String(scale));
  if (group) markActive(group, scale);
}

export function initPersonalization() {
  const group = document.querySelector('[data-text-scale]');
  if (!group) return;

  let saved = 1;
  try {
    const stored = parseFloat(localStorage.getItem(KEY));
    if (!Number.isNaN(stored) && stored > 0) saved = stored;
  } catch { /* privacy mode */ }

  apply(saved, group);

  group.querySelectorAll('button').forEach((b) => {
    b.addEventListener('click', () => {
      const scale = parseFloat(b.dataset.scale) || 1;
      apply(scale, group);
      try { localStorage.setItem(KEY, String(scale)); } catch { /* privacy mode */ }
    });
  });
}
