/* ═══════════════════════════════════════════
   SH2 FORM — contact niceties: live vector summary,
   email validation, fake submit → success + mailto
   composed from the selection, draft persisted.
   ═══════════════════════════════════════════ */

const DRAFT_KEY = 'sh-contact-draft';

export function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const email = form.querySelector('#cf-email');
  const err = form.querySelector('[data-cf-error]');
  const summary = form.querySelector('[data-cf-summary]');
  const success = form.querySelector('[data-cf-success]');
  const mailto = form.querySelector('[data-cf-mailto]');

  const state = () => ({
    name: form.querySelector('#cf-name')?.value || '',
    email: email?.value || '',
    budget: form.querySelector('input[name="budget"]:checked')?.value || '',
    vectors: [...form.querySelectorAll('input[name="vector"]:checked')].map((c) => c.value),
    message: form.querySelector('#cf-msg')?.value || '',
  });

  const renderSummary = () => {
    const s = state();
    const v = s.vectors.length ? s.vectors.join(' + ').replace(/-/g, ' ') : 'pick your vectors…';
    if (summary) summary.textContent = `> ${v}${s.budget ? ' · ' + s.budget : ''}`;
  };

  const saveDraft = () => {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(state())); } catch {}
  };
  const loadDraft = () => {
    try {
      const d = JSON.parse(localStorage.getItem(DRAFT_KEY));
      if (!d) return;
      if (d.name) form.querySelector('#cf-name').value = d.name;
      if (d.email) email.value = d.email;
      if (d.message) form.querySelector('#cf-msg').value = d.message;
      if (d.budget) {
        const r = form.querySelector(`input[name="budget"][value="${d.budget}"]`);
        if (r) r.checked = true;
      }
      (d.vectors || []).forEach((v) => {
        const c = form.querySelector(`input[name="vector"][value="${v}"]`);
        if (c) c.checked = true;
      });
    } catch {}
  };

  loadDraft();
  renderSummary();
  form.addEventListener('input', () => { renderSummary(); saveDraft(); });
  form.addEventListener('change', () => { renderSummary(); saveDraft(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const s = state();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email);
    if (err) err.hidden = ok;
    if (!ok) { email?.focus(); return; }

    // compose the mailto fallback from the selection
    const subject = encodeURIComponent(`Project inquiry — ${s.vectors.join(', ') || 'general'} [${s.budget}]`);
    const body = encodeURIComponent(
      `Name: ${s.name}\nBudget: ${s.budget} CHF\nVectors: ${s.vectors.join(', ')}\n\n${s.message}`);
    if (mailto) mailto.href = `mailto:hello@southhustles.com?subject=${subject}&body=${body}`;

    // fake-submit success state (backend lands later)
    [...form.children].forEach((el) => {
      if (!el.hasAttribute('data-cf-success')) el.style.display = 'none';
    });
    if (success) { success.hidden = false; success.querySelector('a')?.focus(); }
    try { localStorage.removeItem(DRAFT_KEY); } catch {}
  });
}
