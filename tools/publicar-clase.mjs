/* publicar-clase.mjs — turn an exported class JSON into published site content.

   Usage (run from pad/viewer, where playwright is installed):
     node ../../southustles/tools/publicar-clase.mjs <export.json> ../../southustles/app/media/clases

   Then commit app/media/clases and let the deploy pipeline ship it.
   Re-running for an existing class replaces it in the manifest.

   Why this exists: the export embeds photos as base64 PNG — real classes
   carry 10-20MB, with single PNGs past 2MB. Serving that to a phone is the
   difference between a gallery that opens and one that stalls. Chromium
   (via Playwright) re-encodes each raster to WebP with a sane max
   dimension; SVGs pass through untouched since they are already vector. */
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { pathToFileURL } from 'url';

/* Playwright lives in pad/viewer's node_modules, not next to this file.
   An ESM `import 'playwright'` resolves relative to THIS module's path and
   fails, so resolve it from the working directory instead — that is what
   lets the script live in the repo while borrowing the viewer's install. */
const req = createRequire(path.join(process.cwd(), 'noop.js'));
let chromium;
try {
  // playwright is CommonJS, so the namespace may hang off `default`
  const pw = await import(pathToFileURL(req.resolve('playwright')).href);
  chromium = pw.chromium || pw.default?.chromium;
  if (!chromium) throw new Error('sin chromium');
} catch {
  console.error('No encuentro playwright. Corré este script desde pad/viewer:');
  console.error('  cd pad/viewer && node ../../southustles/tools/publicar-clase.mjs <export.json> ../../southustles/app/media/clases');
  process.exit(1);
}

const [SRC, OUT] = process.argv.slice(2);
const MAX_DIM = 1800;      // plenty for a canvas asset, brutal on weight
const QUALITY = 0.82;

const slug = (s) => (s || 'clase').toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '').slice(0, 48) || 'clase';

const raw = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const id = slug(raw.name);
const dir = path.join(OUT, id);
fs.mkdirSync(dir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

const reencode = (dataURL) => page.evaluate(async ({ url, maxDim, q }) => {
  const img = await new Promise((ok, no) => {
    const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = url;
  });
  const r = Math.min(maxDim / img.width, maxDim / img.height, 1);
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(img.width * r));
  c.height = Math.max(1, Math.round(img.height * r));
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL('image/webp', q);
}, { url: dataURL, maxDim: MAX_DIM, q: QUALITY });

const write = (dataURL, name) => {
  const m = /^data:([^;]+);base64,(.*)$/s.exec(dataURL || '');
  if (!m) return null;
  const ext = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/svg+xml': 'svg' }[m[1]] || 'bin';
  const buf = Buffer.from(m[2], 'base64');
  fs.writeFileSync(path.join(dir, `${name}.${ext}`), buf);
  return { file: `${name}.${ext}`, mimeType: m[1], bytes: buf.length };
};

let before = 0, after = 0;
const files = {};
for (const [fileId, entry] of Object.entries(raw.scene?.files || {})) {
  const src = entry.dataURL || '';
  before += Math.round(src.length * 0.75);
  let out;
  if (entry.mimeType === 'image/svg+xml') {
    out = write(src, fileId);                       // vector: leave alone
  } else {
    let webp = null;
    try { webp = await reencode(src); } catch { /* fall back to original */ }
    out = write(webp && webp.length < src.length ? webp : src, fileId);
  }
  if (!out) continue;
  files[fileId] = { file: out.file, mimeType: out.mimeType };
  after += out.bytes;
}

let preview = null;
if (raw.preview) {
  let p = null;
  try { p = await reencode(raw.preview); } catch {}
  const w = write(p && p.length < raw.preview.length ? p : raw.preview, 'preview');
  if (w) { preview = w.file; after += w.bytes; }
}
await browser.close();

fs.writeFileSync(path.join(dir, 'clase.json'), JSON.stringify({
  type: raw.type, version: raw.version, id: raw.id, name: raw.name,
  createdAt: raw.createdAt, updatedAt: raw.updatedAt,
  accent: raw.accent, background: raw.background,
  durationMs: raw.durationMs, brushCm: raw.brushCm, excerpt: raw.excerpt,
  layerNames: raw.layerNames, elements: raw.scene?.elements || [],
  files, preview,
}));

const manifestPath = path.join(OUT, 'index.json');
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : { clases: [] };
manifest.clases = manifest.clases.filter((c) => c.id !== id);
manifest.clases.push({
  id, name: raw.name, updatedAt: raw.updatedAt, accent: raw.accent,
  excerpt: raw.excerpt, durationMs: raw.durationMs, brushCm: raw.brushCm,
  preview: preview ? `${id}/${preview}` : null, path: `${id}/clase.json`,
});
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

const mb = (n) => (n / 1048576).toFixed(1) + 'MB';
console.log(`${id}: ${Object.keys(files).length} files  ${mb(before)} -> ${mb(after)}  (${Math.round((1 - after / before) * 100)}% menos)`);
