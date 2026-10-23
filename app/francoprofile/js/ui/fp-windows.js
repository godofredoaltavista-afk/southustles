// FP · WINDOWS — Workspace de ventanas de vidrio. Puerto fiel de motion-lab/app/js/ui/windows.js (+ scrollbar.js).
// Cada vista es un Workspace: las ventanas se ubican en FRACCIONES del área (se adaptan al tamaño), se arrastran por la
// cabecera con grilla de 8 px (Shift = libre), se redimensionan desde la esquina, se minimizan (doble click en la
// cabecera), se cierran (se reabren desde «Ventanas»), tienen 3 niveles de vidrio (0 opaco · 1 translúcido ·
// 2 transparente) y el layout queda guardado por vista en localStorage `fp.layout.<vista>.v1`.
// En áreas < 760 px se apilan como cards. Los nodos se MUEVEN, nunca se recrean (no se pierden listeners ni ids).
import { icon } from './fp-icons.js';
import { LS, prefersReducedMotion } from '../core/fp-env.js';

console.log('[fp/windows] init');

const GRID = 8;
const STACK_W = 760;
const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';

/* ── scroll propio (motion-lab scrollbar.js): riel de puntitos + círculo con glow que pasa de rojo a azul ── */
function mixHex(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t);
  const g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t);
  const bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
  return `rgb(${r},${g},${bl})`;
}
export function attachScroll(win, content) {
  const TH = 10;
  const sb = document.createElement('div');
  sb.className = 'fp-win-sb';
  sb.innerHTML = '<b></b><i></i>';
  win.append(sb);
  const lit = sb.querySelector('b'), thumb = sb.querySelector('i');
  let raf = 0, hideT = 0;
  const update = () => {
    raf = 0;
    const max = content.scrollHeight - content.clientHeight;
    const has = max > 4;
    win.classList.toggle('has-scroll', has);
    if (!has) return;
    const p = Math.min(1, Math.max(0, content.scrollTop / max));
    const y = p * Math.max(0, sb.clientHeight - TH);
    thumb.style.transform = `translateY(${y.toFixed(1)}px)`;
    lit.style.height = `${(y + TH / 2).toFixed(1)}px`;
    sb.style.setProperty('--sb-col', mixHex('#ff3b30', '#2f7bff', p));
  };
  const queue = () => { if (!raf) raf = requestAnimationFrame(update); };
  content.addEventListener('scroll', () => {
    queue();
    win.classList.add('scrolling');
    clearTimeout(hideT);
    hideT = setTimeout(() => win.classList.remove('scrolling'), 900);
  }, { passive: true });
  new ResizeObserver(queue).observe(content);
  new MutationObserver(queue).observe(content, { childList: true, subtree: true });
  const seek = (clientY) => {
    const r = sb.getBoundingClientRect(), max = content.scrollHeight - content.clientHeight;
    content.scrollTop = Math.min(1, Math.max(0, (clientY - r.top - TH / 2) / Math.max(1, r.height - TH))) * max;
  };
  sb.addEventListener('pointerdown', (e) => {
    e.preventDefault(); e.stopPropagation();
    sb.setPointerCapture(e.pointerId); sb.classList.add('drag'); seek(e.clientY);
    const move = (ev) => seek(ev.clientY);
    const up = () => { sb.classList.remove('drag'); sb.removeEventListener('pointermove', move); sb.removeEventListener('pointerup', up); };
    sb.addEventListener('pointermove', move); sb.addEventListener('pointerup', up);
  });
  queue();
  return { update: queue };
}

export class Workspace {
  /** @param {HTMLElement} root  @param {{ id: string }} opts */
  constructor(root, { id }) {
    this.root = root;
    this.id = id;
    this.key = `layout.${id}.v1`;
    this.saved = LS.get(this.key, {}) || {};
    this.wins = new Map();
    this.z = 20;
    root.classList.add('fp-ws');
    this._ro = new ResizeObserver(() => this.relayout());
    this._ro.observe(root);
  }

  get stacked() { return this.root.clientWidth > 0 && this.root.clientWidth < STACK_W; }

  /**
   * @param {{ id: string, title: string, icon?: string, content: Node|Node[], def: {x:number,y:number,w:number,h:number},
   *           minW?: number, minH?: number, hidden?: boolean, cls?: string, glass?: number }} o
   */
  add(o) {
    const el = document.createElement('section');
    el.className = `fp-win ${o.cls ?? ''}`;
    el.dataset.win = o.id;
    el.setAttribute('aria-label', o.title);
    el.innerHTML = `
      <header class="fp-win-h">
        <span class="fp-win-grip">${icon('grip', 14)}</span>
        ${o.icon ? `<span class="fp-win-ico">${icon(o.icon, 15)}</span>` : ''}
        <span class="fp-win-t">${o.title}</span>
        <span class="fp-win-sp"></span>
        <button type="button" class="fp-win-b" data-a="glass" title="Vidrio: opaco · translúcido · transparente" aria-label="Cambiar vidrio">${icon('glass', 14)}</button>
        <button type="button" class="fp-win-b" data-a="min" title="Minimizar (doble click en la cabecera)" aria-label="Minimizar">${icon('min', 14)}</button>
        <button type="button" class="fp-win-b" data-a="close" title="Cerrar (se vuelve a abrir desde Ventanas)" aria-label="Cerrar ventana">${icon('close', 14)}</button>
      </header>
      <div class="fp-win-c"></div>
      <i class="fp-win-r" title="Redimensionar" aria-hidden="true"></i>`;
    const c = el.querySelector('.fp-win-c');
    for (const n of [o.content].flat()) if (n) c.append(n);
    this.root.append(el);
    const st = { ...o.def, hidden: !!o.hidden, min: false, glass: o.glass ?? 1, ...(this.saved[o.id] ?? {}) };
    const w = { ...o, el, body: c, st, minW: o.minW ?? 180, minH: o.minH ?? 90 };
    this.wins.set(o.id, w);
    this.bind(w);
    this.apply(w);
    attachScroll(el, c);
    return w;
  }

  bind(w) {
    const { el } = w;
    el.addEventListener('pointerdown', () => this.front(w));
    el.querySelector('.fp-win-h').addEventListener('dblclick', (e) => { if (!e.target.closest('.fp-win-b')) this.set(w.id, { min: !w.st.min }); });
    el.querySelectorAll('.fp-win-b').forEach((b) => b.addEventListener('click', (e) => {
      e.stopPropagation();
      const a = b.dataset.a;
      if (a === 'min') this.set(w.id, { min: !w.st.min });
      if (a === 'close') this.set(w.id, { hidden: true });
      if (a === 'glass') this.set(w.id, { glass: (w.st.glass + 1) % 3 });
    }));
    // arrastre por la cabecera (grilla 8 px, Shift = libre)
    const head = el.querySelector('.fp-win-h');
    head.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.target.closest('.fp-win-b') || this.stacked) return;
      e.preventDefault();
      head.setPointerCapture(e.pointerId);
      const r0 = this.rect(), sx = e.clientX, sy = e.clientY, x0 = w.st.x * r0.w, y0 = w.st.y * r0.h;
      el.classList.add('dragging');
      const move = (ev) => {
        let x = x0 + ev.clientX - sx, y = y0 + ev.clientY - sy;
        if (!ev.shiftKey) { x = Math.round(x / GRID) * GRID; y = Math.round(y / GRID) * GRID; }
        const ww = el.offsetWidth;
        x = Math.min(Math.max(x, -ww + 80), r0.w - 80); y = Math.min(Math.max(y, 0), r0.h - 36);
        w.st.x = x / r0.w; w.st.y = y / r0.h;
        el.style.left = `${x}px`; el.style.top = `${y}px`;
      };
      const up = () => { el.classList.remove('dragging'); head.removeEventListener('pointermove', move); head.removeEventListener('pointerup', up); this.save(); };
      head.addEventListener('pointermove', move);
      head.addEventListener('pointerup', up);
    });
    // redimensionar desde la esquina
    const grip = el.querySelector('.fp-win-r');
    grip.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || this.stacked) return;
      e.preventDefault(); e.stopPropagation();
      grip.setPointerCapture(e.pointerId);
      const r0 = this.rect(), sx = e.clientX, sy = e.clientY, w0 = el.offsetWidth, h0 = el.offsetHeight;
      el.classList.add('dragging');
      const move = (ev) => {
        let ww = Math.max(w.minW, w0 + ev.clientX - sx), hh = Math.max(w.minH, h0 + ev.clientY - sy);
        if (!ev.shiftKey) { ww = Math.round(ww / GRID) * GRID; hh = Math.round(hh / GRID) * GRID; }
        w.st.w = ww / r0.w; w.st.h = hh / r0.h;
        el.style.width = `${ww}px`; el.style.height = `${hh}px`;
      };
      const up = () => { el.classList.remove('dragging'); grip.removeEventListener('pointermove', move); grip.removeEventListener('pointerup', up); this.save(); };
      grip.addEventListener('pointermove', move);
      grip.addEventListener('pointerup', up);
    });
  }

  rect() { return { w: this.root.clientWidth || 1, h: this.root.clientHeight || 1 }; }

  apply(w) {
    const { el, st } = w;
    el.hidden = st.hidden;
    el.classList.toggle('min', st.min);
    el.dataset.glass = st.glass;
    if (this.stacked) { el.style.left = el.style.top = el.style.width = el.style.height = ''; return; }
    const r = this.rect();
    el.style.left = `${st.x * r.w}px`;
    el.style.top = `${st.y * r.h}px`;
    el.style.width = `${Math.max(w.minW, st.w * r.w)}px`;
    el.style.height = st.min ? '' : `${Math.max(w.minH, st.h * r.h)}px`;
  }

  relayout() {
    if (!this.root.clientWidth) return;
    this.root.classList.toggle('fp-ws-stack', this.stacked);
    for (const w of this.wins.values()) this.apply(w);
  }

  front(w) { w.el.style.zIndex = ++this.z; }

  set(id, patch) {
    const w = this.wins.get(id); if (!w) return;
    const wasHidden = w.st.hidden;
    Object.assign(w.st, patch);
    this.apply(w);
    if (wasHidden && !w.st.hidden) { this.front(w); this.pop(w.el); }
    this.save();
    this.root.dispatchEvent(new CustomEvent('fp-ws-change', { detail: { id, st: w.st } }));
  }

  pop(el) {
    if (prefersReducedMotion()) return;
    el.animate([{ opacity: 0, transform: 'translateY(10px) scale(0.97)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: EASE_OUT });
  }

  isOpen(id) { const w = this.wins.get(id); return !!w && !w.st.hidden; }

  /** Lista para el menú «Ventanas». */
  list() { return [...this.wins.values()].map((w) => ({ id: w.id, title: w.title, icon: w.icon, open: !w.st.hidden })); }

  save() {
    const out = {};
    for (const [id, w] of this.wins) out[id] = { x: w.st.x, y: w.st.y, w: w.st.w, h: w.st.h, hidden: w.st.hidden, min: w.st.min, glass: w.st.glass };
    LS.set(this.key, out);
  }

  reset() {
    for (const w of this.wins.values()) { w.st = { ...w.def, hidden: !!w.hidden, min: false, glass: w.glass ?? 1 }; this.apply(w); this.pop(w.el); }
    this.save();
    this.root.dispatchEvent(new CustomEvent('fp-ws-change', { detail: { id: '*', reset: true } }));
  }

  /** Entrada de inicio: las ventanas aparecen escalonadas (40 ms · i). */
  intro() {
    if (prefersReducedMotion()) return;
    [...this.wins.values()].filter((w) => !w.st.hidden).forEach((w, i) => {
      w.el.animate([{ opacity: 0, transform: 'translateY(14px) scale(0.98)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: 40 * i, easing: EASE_OUT, fill: 'backwards' });
    });
  }
}
