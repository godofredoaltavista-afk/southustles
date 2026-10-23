// PORTED FROM motion-lab/app/js/ui/windows.js @ copia local 2026-10-23 — DO NOT EDIT. Adapted copy lives in js/**/fp-*.js
// Ventanas de vidrio arrastrables (base: makeDraggable de ant-on-mars-game + FloatingWindow de ant-on-mars).
// Cada vista es un Workspace: las ventanas se ubican en fracciones del área (se adaptan al tamaño), se arrastran
// por la cabecera, se redimensionan desde la esquina, se minimizan, se vuelven transparentes "sobre el video"
// y el layout queda guardado por vista. En pantallas angostas se apilan como cards.
import { icon } from './icons.js';
import { LS } from './theme.js';
import { EASE_OUT, reduced } from './motion.js';
import { attachScroll } from './scrollbar.js';

const GRID = 8;
const STACK_W = 760;

export class Workspace {
  /** @param {HTMLElement} root  @param {{ id: string }} opts */
  constructor(root, { id }) {
    this.root = root;
    this.id = id;
    this.key = `layout.${id}.v3`; // v3: todas transparentes y repartidas hacia los bordes
    this.saved = LS.get(this.key, {});
    this.wins = new Map();
    this.z = 20;
    root.classList.add('ws');
    new ResizeObserver(() => this.relayout()).observe(root);
  }

  get stacked() { return this.root.clientWidth < STACK_W; }

  /**
   * @param {{ id: string, title: string, icon?: string, content: Node|Node[], def: {x:number,y:number,w:number,h:number},
   *           minW?: number, minH?: number, hidden?: boolean, cls?: string, glass?: number, bare?: boolean }} o
   */
  add(o) {
    const el = document.createElement('section');
    el.className = `win ${o.cls ?? ''}`;
    el.dataset.win = o.id;
    el.innerHTML = `
      <header class="win-h">
        <span class="win-grip">${icon('grip', 14)}</span>
        ${o.icon ? `<span class="win-ico">${icon(o.icon, 15)}</span>` : ''}
        <span class="win-t">${o.title}</span>
        <span class="win-sp"></span>
        <button class="win-b" data-a="glass" title="Transparente sobre el video">${icon('glass', 14)}</button>
        <button class="win-b" data-a="min" title="Minimizar">${icon('min', 14)}</button>
        <button class="win-b" data-a="close" title="Cerrar (se vuelve a abrir desde Ventanas)">${icon('close', 14)}</button>
      </header>
      <div class="win-c"></div>
      <i class="win-r" title="Redimensionar"></i>`;
    const c = el.querySelector('.win-c');
    for (const n of [o.content].flat()) if (n) c.append(n);
    this.root.append(el);
    // por defecto transparentes (glass 2): en reposo solo ícono + título + línea; al pasar el mouse, vidrio y controles
    const st = { ...o.def, hidden: !!o.hidden, min: false, glass: o.glass ?? 2, ...(this.saved[o.id] ?? {}) };
    const w = { ...o, el, st, minW: o.minW ?? 160, minH: o.minH ?? 70 };
    this.wins.set(o.id, w);
    this.bind(w);
    this.apply(w);
    attachScroll(el, c);
    return w;
  }

  bind(w) {
    const { el } = w;
    el.addEventListener('pointerdown', () => this.front(w));
    el.querySelector('.win-h').addEventListener('dblclick', (e) => { if (!e.target.closest('.win-b')) this.set(w.id, { min: !w.st.min }); });
    el.querySelectorAll('.win-b').forEach((b) => b.addEventListener('click', (e) => {
      e.stopPropagation();
      const a = b.dataset.a;
      if (a === 'min') this.set(w.id, { min: !w.st.min });
      if (a === 'close') this.set(w.id, { hidden: true });
      if (a === 'glass') this.set(w.id, { glass: (w.st.glass + 1) % 3 });
    }));
    // arrastre por la cabecera
    const head = el.querySelector('.win-h');
    head.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.target.closest('.win-b') || this.stacked) return;
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
    const grip = el.querySelector('.win-r');
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
    this.root.classList.toggle('ws-stack', this.stacked);
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
    this.root.dispatchEvent(new CustomEvent('ws-change', { detail: { id, st: w.st } }));
  }

  pop(el) {
    if (reduced()) return;
    el.animate([{ opacity: 0, transform: 'translateY(10px) scale(0.97)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: EASE_OUT });
  }

  isOpen(id) { const w = this.wins.get(id); return !!w && !w.st.hidden; }

  save() {
    const out = {};
    for (const [id, w] of this.wins) out[id] = { x: w.st.x, y: w.st.y, w: w.st.w, h: w.st.h, hidden: w.st.hidden, min: w.st.min, glass: w.st.glass };
    LS.set(this.key, out);
  }

  reset() {
    for (const w of this.wins.values()) { w.st = { ...w.def, hidden: !!w.hidden, min: false, glass: w.glass ?? 2 }; this.apply(w); this.pop(w.el); }
    this.save();
  }

  /** Entrada de inicio: las ventanas aparecen escalonadas. */
  intro() {
    if (reduced()) return;
    [...this.wins.values()].filter((w) => !w.st.hidden).forEach((w, i) => {
      w.el.animate([{ opacity: 0, transform: 'translateY(14px) scale(0.98)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: 40 * i, easing: EASE_OUT, fill: 'backwards' });
    });
  }
}
