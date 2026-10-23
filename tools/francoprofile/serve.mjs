// francoprofile serve — servidor estático local para ver /francoprofile (y el resto de app/) sin instalar nada.
// Uso: node tools/francoprofile/serve.mjs [puerto]   → http://localhost:8080/francoprofile/
// Equivalente a app/serve.sh (python http.server) pero en Node y sin caché, para desarrollo.
// Vive en tools/ (fuera de app/): no se despliega.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('../../app/', import.meta.url)));
const PORT = Number(process.argv[2] || process.env.PORT || 8080);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.md': 'text/markdown; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.ico': 'image/x-icon', '.glb': 'model/gltf-binary', '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.ts': 'text/plain; charset=utf-8', '.tsx': 'text/plain; charset=utf-8',
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    let p = decodeURIComponent(url.pathname);
    const file = normalize(join(ROOT, p));
    if (!file.startsWith(ROOT)) { res.writeHead(403).end('forbidden'); return; }
    let target = file;
    let st = await stat(target).catch(() => null);
    if (st?.isDirectory()) {
      if (!p.endsWith('/')) { res.writeHead(301, { Location: `${p}/${url.search}` }).end(); return; }
      target = join(target, 'index.html');
      st = await stat(target).catch(() => null);
    }
    if (!st) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end(`404 · ${p}`); return; }
    const body = await readFile(target);
    res.writeHead(200, { 'Content-Type': TYPES[extname(target).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(body);
    console.log(`200 ${p}`);
  } catch (e) {
    res.writeHead(500).end(String(e));
  }
}).listen(PORT, () => console.log(`→ South Hustles app/ en http://localhost:${PORT}/  ·  /francoprofile/ en http://localhost:${PORT}/francoprofile/  (raíz: ${ROOT}${sep})`));
