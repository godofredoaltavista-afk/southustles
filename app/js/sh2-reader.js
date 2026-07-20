/* ═══════════════════════════════════════════
   SH2 READER — Franco's tweets-notebook system, adapted.
   Journal cards open into a reader modal with:
   · STUDIO tools (marker / liner / spray / eraser) painting
     on a canvas that covers the whole sheet
   · text highlighting via mouse selection → <mark>
   · a DNA strip collecting every mark, persisted to
     localStorage 'sh-dna-v1' (backend-ready shape)
   Mechanics modelled on ~/Downloads/tweets/index.html
   (cm-canvas / studio__tools / paintHighlights).
   ═══════════════════════════════════════════ */

import { prefersReducedMotion } from './env.js';
import { lockBodyScroll, unlockBodyScroll } from './scroll-lock.js';

const LS_KEY = 'sh-dna-v1';

const loadDna = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; }
};
const saveDna = (d) => { try { localStorage.setItem(LS_KEY, JSON.stringify(d)); } catch {} };

export function initReader() {
  const cards = document.querySelectorAll('.journal-card[data-card-id], [data-read]');
  if (!cards.length) return;

  /* ── modal shell (injected once) ── */
  const modal = document.createElement('div');
  modal.className = 'reader-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="reader-modal__backdrop" data-reader-close></div>
    <div class="reader-modal__sheet">
      <canvas class="reader-canvas" aria-hidden="true"></canvas>
      <button type="button" class="reader-modal__close" data-reader-close aria-label="Close note">✕</button>
      <div class="reader-modal__paper">
        <span class="reader-tag" data-r-tag></span>
        <h3 class="reader-title" data-r-title></h3>
        <div class="reader-body" data-r-body></div>
        <p class="reader-hint">select text to <mark>mark it</mark> · arm a tool to paint · your marks feed the DNA strip</p>
      </div>
      <div class="studio-bar" role="toolbar" aria-label="Paint tools">
        <button type="button" class="studio-tool" data-tool="marker" title="Marker (1)" aria-label="Marker"><i class="st-dot st-dot--marker"></i></button>
        <button type="button" class="studio-tool" data-tool="liner" title="Fineliner (2)" aria-label="Fineliner"><i class="st-dot st-dot--liner"></i></button>
        <button type="button" class="studio-tool" data-tool="spray" title="Spray (3)" aria-label="Spray"><i class="st-dot st-dot--spray"></i></button>
        <button type="button" class="studio-tool" data-tool="eraser" title="Eraser (4)" aria-label="Eraser"><i class="st-dot st-dot--eraser"></i></button>
        <span class="studio-sep"></span>
        <button type="button" class="studio-tool studio-tool--clear" data-tool-clear title="Clear paint" aria-label="Clear paint">clear</button>
      </div>
    </div>`;
  document.body.appendChild(modal);

  const sheet = modal.querySelector('.reader-modal__sheet');
  const canvas = modal.querySelector('.reader-canvas');
  const ctx = canvas.getContext('2d');
  const rTag = modal.querySelector('[data-r-tag]');
  const rTitle = modal.querySelector('[data-r-title]');
  const rBody = modal.querySelector('[data-r-body]');
  const tools = modal.querySelectorAll('.studio-tool[data-tool]');

  let dna = loadDna();
  let currentId = null;
  let activeTool = null;
  let lastFocus = null;
  let painting = false;
  let px = 0, py = 0;

  const accent = () =>
    getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#6d5efc';
  const accent2 = () =>
    getComputedStyle(document.documentElement).getPropertyValue('--accent-2').trim() || '#ff5a7a';

  /* ── canvas sizing (DPR ≤ 2, covers whole sheet) ── */
  const sizeCanvas = () => {
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    const r = sheet.getBoundingClientRect();
    // keep old paint through resize
    const keep = document.createElement('canvas');
    keep.width = canvas.width; keep.height = canvas.height;
    if (canvas.width) keep.getContext('2d').drawImage(canvas, 0, 0);
    canvas.width = r.width * DPR;
    canvas.height = r.height * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (keep.width) ctx.drawImage(keep, 0, 0, keep.width / DPR, keep.height / DPR);
  };
  window.addEventListener('resize', () => { if (modal.classList.contains('is-open')) sizeCanvas(); });

  /* ── the four brushes (tweets-studio idiom) ── */
  const strokeTo = (x, y) => {
    const col = activeTool === 'marker' ? accent() : activeTool === 'liner' ? accent2() : accent();
    if (activeTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 26; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke();
    } else if (activeTool === 'spray') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = col;
      for (let i = 0; i < 16; i++) {
        const a = Math.random() * Math.PI * 2, d = Math.random() * 16;
        ctx.globalAlpha = 0.25 + Math.random() * 0.4;
        ctx.fillRect(x + Math.cos(a) * d, y + Math.sin(a) * d, 1.6, 1.6);
      }
      ctx.globalAlpha = 1;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = col;
      ctx.globalAlpha = activeTool === 'marker' ? 0.35 : 0.9;
      ctx.lineWidth = activeTool === 'marker' ? 18 : 2.2;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke();
      ctx.globalAlpha = 1;
    }
    px = x; py = y;
  };

  canvas.addEventListener('pointerdown', (e) => {
    if (!activeTool) return;
    painting = true;
    canvas.setPointerCapture(e.pointerId);
    const r = canvas.getBoundingClientRect();
    px = e.clientX - r.left; py = e.clientY - r.top;
    strokeTo(px + 0.01, py + 0.01);
    markPainted();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!painting) return;
    const r = canvas.getBoundingClientRect();
    strokeTo(e.clientX - r.left, e.clientY - r.top);
  });
  const stopPaint = () => { painting = false; };
  canvas.addEventListener('pointerup', stopPaint);
  canvas.addEventListener('pointercancel', stopPaint);

  /* ── tool arming ── */
  const armTool = (name) => {
    activeTool = activeTool === name ? null : name;
    tools.forEach((b) => b.classList.toggle('is-active', b.dataset.tool === activeTool));
    modal.classList.toggle('is-armed', !!activeTool);
  };
  tools.forEach((b) => b.addEventListener('click', () => armTool(b.dataset.tool)));
  modal.querySelector('[data-tool-clear]').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (currentId && dna[currentId]) { dna[currentId].painted = false; saveDna(dna); renderDna(); }
  });
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;
    const map = { 1: 'marker', 2: 'liner', 3: 'spray', 4: 'eraser' };
    if (map[e.key]) armTool(map[e.key]);
  });

  const markPainted = () => {
    if (!currentId) return;
    dna[currentId] = dna[currentId] || { marks: [], painted: false, tag: rTag.textContent, title: rTitle.textContent };
    if (!dna[currentId].painted) { dna[currentId].painted = true; saveDna(dna); renderDna(); }
  };

  /* ── text highlight: selection (no tool armed) → <mark> ── */
  rBody.addEventListener('mouseup', () => {
    if (activeTool) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const text = sel.toString().trim();
    if (text.length < 3 || text.length > 400) return;
    const range = sel.getRangeAt(0);
    if (!rBody.contains(range.commonAncestorContainer)) return;
    const mark = document.createElement('mark');
    mark.className = 'reader-mark';
    try { range.surroundContents(mark); } catch { return; } // cross-node selections skipped
    sel.removeAllRanges();
    dna[currentId] = dna[currentId] || { marks: [], painted: false, tag: rTag.textContent, title: rTitle.textContent };
    dna[currentId].marks.push({ text });
    saveDna(dna); renderDna();
  });
  // click a mark to remove it
  rBody.addEventListener('click', (e) => {
    const m = e.target.closest('mark.reader-mark');
    if (!m || !currentId) return;
    const text = m.textContent;
    m.replaceWith(...m.childNodes);
    const entry = dna[currentId];
    if (entry) {
      const i = entry.marks.findIndex((k) => k.text === text);
      if (i > -1) entry.marks.splice(i, 1);
      saveDna(dna); renderDna();
    }
  });

  /* ── open / close ── */
  const cardById = (id) => document.querySelector(`[data-card-id="${id}"]`);

  const open = (card) => {
    lastFocus = document.activeElement;
    currentId = card.dataset.cardId || card.dataset.read || 'note';
    rTag.textContent = card.querySelector('.jc-tag')?.textContent || card.dataset.readTag || 'NOTE';
    rTitle.textContent = card.querySelector('.jc-title')?.textContent || card.dataset.readTitle || 'Untitled';
    const tpl = card.querySelector('template.jc-body');
    rBody.innerHTML = tpl ? tpl.innerHTML : `<p>${card.dataset.readBody || card.textContent.trim()}</p>`;
    // re-apply stored highlights for this card
    const stored = dna[currentId];
    if (stored?.marks?.length) {
      stored.marks.forEach(({ text }) => {
        const walker = document.createTreeWalker(rBody, NodeFilter.SHOW_TEXT);
        let n; while ((n = walker.nextNode())) {
          const i = n.nodeValue.indexOf(text);
          if (i > -1) {
            const range = document.createRange();
            range.setStart(n, i); range.setEnd(n, i + text.length);
            const mark = document.createElement('mark');
            mark.className = 'reader-mark';
            try { range.surroundContents(mark); } catch {}
            break;
          }
        }
      });
    }
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open'); // reuse scroll-lock
    lockBodyScroll();
    sizeCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    modal.querySelector('.reader-modal__close').focus();
  };

  const close = () => {
    modal.classList.remove('is-open', 'is-armed');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    unlockBodyScroll();
    activeTool = null;
    tools.forEach((b) => b.classList.remove('is-active'));
    if (lastFocus?.focus) lastFocus.focus();
  };

  modal.querySelectorAll('[data-reader-close]').forEach((b) => b.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });

  cards.forEach((card) => {
    card.addEventListener('click', () => open(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card); }
    });
  });

  /* ── DNA strip ── */
  const strip = document.querySelector('[data-dna-strip]');
  const empty = document.querySelector('[data-dna-empty]');
  const clearBtn = document.querySelector('[data-dna-clear]');

  const renderDna = () => {
    if (!strip) return;
    strip.innerHTML = '';
    let count = 0;
    Object.entries(dna).forEach(([id, entry]) => {
      (entry.marks || []).forEach(({ text }) => {
        count++;
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'dna-chip';
        chip.innerHTML = `<span class="dna-chip__tag">${entry.tag || id}</span>“${text.length > 90 ? text.slice(0, 90) + '…' : text}”`;
        chip.addEventListener('click', () => { const c = cardById(id); if (c) open(c); });
        strip.appendChild(chip);
      });
      if (entry.painted) {
        count++;
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'dna-chip dna-chip--paint';
        chip.innerHTML = `<span class="dna-chip__tag">${entry.tag || id}</span>🖌 painted page`;
        chip.addEventListener('click', () => { const c = cardById(id); if (c) open(c); });
        strip.appendChild(chip);
      }
    });
    if (empty) empty.hidden = count > 0;
    if (clearBtn) clearBtn.hidden = count === 0;
  };
  if (clearBtn) clearBtn.addEventListener('click', () => { dna = {}; saveDna(dna); renderDna(); });
  renderDna();
}
