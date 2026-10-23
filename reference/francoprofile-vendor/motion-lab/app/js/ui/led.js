// PORTED FROM motion-lab/app/js/ui/led.js @ copia local 2026-10-23 — DO NOT EDIT. Adapted copy lives in js/**/fp-*.js
// LED de puntos 5×7 (el contador del reel). Se dibuja en un canvas que se adapta al tamaño de su caja.
const G = {
  0: ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'], 1: ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  2: ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'], 3: ['#####', '...#.', '..#..', '...#.', '....#', '#...#', '.###.'],
  4: ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'], 5: ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
  6: ['..##.', '.#...', '#....', '####.', '#...#', '#...#', '.###.'], 7: ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
  8: ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'], 9: ['.###.', '#...#', '#...#', '.####', '....#', '...#.', '.##..'],
  '.': ['.....', '.....', '.....', '.....', '.....', '.##..', '.##..'], ':': ['.....', '..#..', '..#..', '.....', '..#..', '..#..', '.....'],
  '%': ['##..#', '##..#', '...#.', '..#..', '.#...', '#..##', '#..##'], '-': ['.....', '.....', '.....', '#####', '.....', '.....', '.....'],
  '+': ['.....', '..#..', '..#..', '#####', '..#..', '..#..', '.....'], '°': ['.##..', '#..#.', '#..#.', '.##..', '.....', '.....', '.....'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'], '—': ['.....', '.....', '.....', '#####', '.....', '.....', '.....'],
};

/**
 * @param {HTMLCanvasElement} canvas
 * @param {string} text
 * @param {{ on?: string, off?: string, glow?: number, align?: 'left'|'center'|'right', ink?: boolean }} opts
 */
export function drawLED(canvas, text, { on = '#e06040', off = 'rgba(224,96,64,0.1)', glow = 12, align = 'left', ink = false } = {}) {
  const r = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const W = Math.max(1, Math.round(r.width * dpr)), H = Math.max(1, Math.round(r.height * dpr));
  if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);
  const s = String(text);
  const cols = s.length * 6 - 1;
  const dot = Math.max(1, Math.min(H / 7, W / Math.max(cols, 1)));
  const w = cols * dot;
  const x0 = align === 'center' ? (W - w) / 2 : align === 'right' ? W - w : 0;
  const y0 = (H - 7 * dot) / 2;
  const rad = dot * 0.42;
  if (ink) { on = '#0a0a0a'; off = 'rgba(10,10,10,0.07)'; glow = 0; }
  for (const pass of [0, 1]) {
    ctx.fillStyle = pass ? on : off;
    if (pass && glow) { ctx.shadowColor = on; ctx.shadowBlur = glow * dpr; } else ctx.shadowBlur = 0;
    for (let ci = 0; ci < s.length; ci++) {
      const g = G[s[ci]] ?? G[' '];
      for (let row = 0; row < 7; row++) for (let col = 0; col < 5; col++) {
        const lit = g[row][col] === '#';
        if (pass ? !lit : false) continue;
        ctx.beginPath(); ctx.arc(x0 + (ci * 6 + col) * dot + dot / 2, y0 + row * dot + dot / 2, rad, 0, Math.PI * 2); ctx.fill();
      }
    }
  }
}
