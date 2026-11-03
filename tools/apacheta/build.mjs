#!/usr/bin/env node
// Builds the Apacheta HUD frontend as a static, backend-less site under app/apacheta/.
//
// Usage: node tools/apacheta/build.mjs <path-to-apacheta-frontend>
//
// The source is never modified: it is copied to a temp dir, patched there, built with
// vite (base /apacheta/) and the result is copied into app/apacheta/.
//
// Patches applied to the temp copy:
//   1. demo-only: isDemo() is always true (S3 has no FastAPI), "salir del demo" goes back to /.
//   2. root-absolute asset URLs ('/assets/..', '/zen/..', '/design/..') become relative
//      ('./assets/..'): they resolve against the page URL (/apacheta/), so they keep working
//      under a sub-path. CSS url(/..) is rewritten by vite itself through `base`.
//   3. zen sandboard bundle: '/zen/' -> '/apacheta/zen/', '/scene_assets/' -> '/apacheta/zen/scene_assets/'.
// '/vendor/notas/' is NOT touched nor copied: the site already ships it at the domain root.
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const outDir = join(repoRoot, 'app', 'apacheta');
const source = process.argv[2] && resolve(process.argv[2]);
if (!source || !existsSync(join(source, 'package.json'))) {
  console.error('Usage: node tools/apacheta/build.mjs <path-to-apacheta-frontend>');
  process.exit(1);
}

const work = mkdtempSync(join(tmpdir(), 'apacheta-build-'));
const run = (cmd, args, opts = {}) => {
  const r = spawnSync(cmd, args, { cwd: work, stdio: 'inherit', shell: process.platform === 'win32', ...opts });
  if (r.status !== 0) { console.error(`FAILED: ${cmd} ${args.join(' ')}`); process.exit(r.status || 1); }
};

console.log(`copy ${source} -> ${work}`);
cpSync(source, work, { recursive: true, filter: (p) => !/[\\/](node_modules|dist|\.git)([\\/]|$)/.test(p) });

const walk = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? walk(p) : [p];
});

// 1. demo-only
const modePath = join(work, 'src', 'lib', 'demo', 'mode.ts');
let mode = readFileSync(modePath, 'utf8').replace(/\r\n/g, '\n');
mode = mode.replace('export function isDemo(): boolean {\n', "export function isDemo(): boolean {\n  if (import.meta.env.VITE_DEMO_ONLY === '1') return true;\n");
mode = mode.replace('export function exitDemo(): void {\n', "export function exitDemo(): void {\n  if (import.meta.env.VITE_DEMO_ONLY === '1') { window.location.href = '/'; return; }\n");
if ((mode.match(/VITE_DEMO_ONLY/g) || []).length !== 2) { console.error('demo patch did not apply'); process.exit(1); }
writeFileSync(modePath, mode);

// 2. root-absolute asset URLs in source
let rewritten = 0;
for (const f of walk(join(work, 'src')).filter((p) => /\.(ts|tsx)$/.test(p))) {
  const before = readFileSync(f, 'utf8');
  const after = before.replace(/(['"`])\/(assets|zen|design)\//g, (_m, q, d) => { rewritten++; return `${q}./${d}/`; });
  if (after !== before) writeFileSync(f, after);
}
console.log(`rewrote ${rewritten} root-absolute URLs`);

run('npm', ['ci']);
run('npx', ['vite', 'build', '--base=/apacheta/'], { env: { ...process.env, VITE_DEMO_ONLY: '1' } });

const dist = join(work, 'dist');
// the site already serves /vendor/notas/ at its root
rmSync(join(dist, 'vendor', 'notas'), { recursive: true, force: true });
if (existsSync(join(dist, 'vendor')) && readdirSync(join(dist, 'vendor')).length === 0) rmSync(join(dist, 'vendor'), { recursive: true });

// 3. zen bundle
for (const f of walk(join(dist, 'zen')).filter((p) => /\.(js|css|html)$/.test(p))) {
  const before = readFileSync(f, 'utf8');
  const after = before
    .replace(/(?<![\w.])\/zen\//g, '/apacheta/zen/')
    .replace(/(?<![\w./])\/scene_assets\//g, '/apacheta/zen/scene_assets/');
  if (after !== before) writeFileSync(f, after);
}

// leftover check: nothing may still point at the site root by absolute path
const leftovers = [];
for (const f of walk(dist).filter((p) => /\.(js|css|html)$/.test(p) && !/[\\/]zen[\\/]/.test(p))) {
  const txt = readFileSync(f, 'utf8');
  for (const m of txt.matchAll(/(["'`(])\/(assets|zen|design)\/[^"'`)\s]*/g)) leftovers.push(`${f}: ${m[0]}`);
}
if (leftovers.length) { console.error('root-absolute URLs left:\n' + leftovers.slice(0, 20).join('\n')); process.exit(1); }

rmSync(outDir, { recursive: true, force: true });
cpSync(dist, outDir, { recursive: true });
rmSync(work, { recursive: true, force: true });
console.log(`done -> ${outDir}`);
