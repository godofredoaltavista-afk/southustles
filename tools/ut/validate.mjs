#!/usr/bin/env node
// Dependency-free checks for UT's static hosting and content contracts.
import { readFile, stat, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const repository = fileURLToPath(new URL('../../', import.meta.url));
const site = path.join(repository, 'app', 'UT');
const htmlPath = path.join(site, 'index.html');
const html = await readFile(htmlPath, 'utf8');
const failures = [];
const checkedFiles = new Set();
const fail = message => failures.push(message);
const assert = (condition, message) => { if (!condition) fail(message); };
const label = filename => path.relative(repository, filename).replaceAll(path.sep, '/');

function attributes(source) {
  return Object.fromEntries([...source.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)]
    .map(match => [match[1].toLowerCase(), match[2] ?? match[3] ?? match[4] ?? '']));
}

const tags = [...html.replace(/<!--[\s\S]*?-->/g, '').matchAll(/<([a-z][\w:-]*)\b([^>]*?)>/gi)]
  .map(match => ({ name: match[1].toLowerCase(), attrs: attributes(match[2]) }));
const ids = new Set();
for (const { attrs } of tags) {
  if (!attrs.id) continue;
  assert(!ids.has(attrs.id), `Duplicate HTML id: ${attrs.id}`);
  ids.add(attrs.id);
}

async function checkLocalReference(reference, fromFile) {
  if (!reference || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference)) return;
  let parsed;
  try { parsed = new URL(reference, pathToFileURL(fromFile)); }
  catch { fail(`Invalid local URL ${reference} in ${label(fromFile)}`); return; }
  // A leading slash is a site-root path, not a filesystem-root path.
  let filename = reference.startsWith('/')
    ? path.join(repository, 'app', decodeURIComponent(new URL(reference, 'https://static.invalid/').pathname))
    : fileURLToPath(parsed);
  if (parsed.hash && path.resolve(filename) === path.resolve(htmlPath)) {
    assert(ids.has(decodeURIComponent(parsed.hash.slice(1))), `Missing hash target ${reference}`);
  }
  if (checkedFiles.has(filename)) return;
  checkedFiles.add(filename);
  try {
    let info = await stat(filename);
    if (info.isDirectory()) { filename = path.join(filename, 'index.html'); info = await stat(filename); }
    assert(info.isFile() && info.size > 0, `Empty or invalid local file: ${label(filename)}`);
  } catch { fail(`Missing local file: ${reference} in ${label(fromFile)}`); }
}

for (const { name, attrs } of tags) {
  for (const attribute of ['src', 'href', 'poster']) {
    if (attrs[attribute] !== undefined) await checkLocalReference(attrs[attribute], htmlPath);
  }
  if (attrs.srcset) {
    for (const candidate of attrs.srcset.split(',')) await checkLocalReference(candidate.trim().split(/\s+/)[0], htmlPath);
  }
  for (const attribute of ['aria-controls', 'aria-labelledby', 'aria-describedby']) {
    for (const id of (attrs[attribute] ?? '').split(/\s+/).filter(Boolean)) assert(ids.has(id), `Missing ${attribute} target: ${id}`);
  }
  if (name === 'a' && attrs.target === '_blank') {
    assert(/\bnoopener\b/.test(attrs.rel ?? ''), `External link is missing noopener: ${attrs.href}`);
  }
}

const contentSource = await readFile(path.join(site, 'js', 'content.js'), 'utf8');
const { content, universeRows } = await import(`data:text/javascript;base64,${Buffer.from(contentSource).toString('base64')}`);
const localeNames = ['es', 'pt', 'en'];
assert(JSON.stringify(Object.keys(content).sort()) === JSON.stringify([...localeNames].sort()), 'Expected ES, PT-BR and EN dictionaries.');
const spanishKeys = Object.keys(content.es).sort();
for (const locale of localeNames) {
  assert(JSON.stringify(Object.keys(content[locale]).sort()) === JSON.stringify(spanishKeys), `Translation keys differ in ${locale}.`);
  for (const [key, value] of Object.entries(content[locale])) assert(typeof value === 'string' && value.trim(), `Empty translation: ${locale}.${key}`);
}
const translatedKeys = new Set();
for (const { attrs } of tags) {
  for (const [attribute, key] of Object.entries(attrs)) {
    if (!/^data-i18n(?:$|-)/.test(attribute) || attribute === 'data-i18n-text') continue;
    translatedKeys.add(key);
  }
}
for (const key of translatedKeys) {
  for (const locale of localeNames) assert(typeof content[locale][key] === 'string', `Missing translation ${locale}.${key}`);
}

assert(universeRows.length === 12, 'Expected 12 Universe content rows.');
assert(new Set(universeRows.map(row => row.id)).size === 12, 'Universe row identifiers must be unique.');
const htmlRows = tags.filter(({ attrs }) => /(?:^|\s)universe-item(?:\s|$)/.test(attrs.class ?? ''));
assert(htmlRows.length === 12, `Expected 12 accessible Universe rows in HTML, got ${htmlRows.length}.`);
for (const row of universeRows) {
  for (const locale of localeNames) {
    assert(content[locale][row.titleKey] && content[locale][row.bodyKey], `Missing Universe copy for ${row.id} in ${locale}.`);
  }
  assert(ids.has(row.target.slice(1)), `Universe destination does not exist: ${row.target}`);
  assert(translatedKeys.has(row.titleKey) && translatedKeys.has(row.bodyKey), `Universe row is missing from HTML: ${row.id}`);
  await checkLocalReference(`./assets/${row.image}`, htmlPath);
}
const services = tags.filter(({ name, attrs }) => name === 'article' && /(?:^|\s)service(?:\s|$)/.test(attrs.class ?? ''));
assert(services.length === 4, `Expected 4 service panels, got ${services.length}.`);
for (const id of ['diseno', 'politica', 'arte', 'redes']) assert(services.some(({ attrs }) => attrs.id === id), `Missing service panel #${id}`);
assert(!tags.some(({ name }) => name === 'form'), 'UT uses direct contact links; it must not contain a form.');
assert(!tags.some(({ name, attrs }) => name === 'input' && attrs.type !== 'color'), 'Only accent color inputs belong in UT.');
const contacts = ['mailto:utdigit@gmail.com', 'https://www.instagram.com/utdigitall/', 'https://www.linkedin.com/in/gustavoaltavista?originalSubdomain=ar'];
for (const contact of contacts) assert(tags.some(({ name, attrs }) => name === 'a' && attrs.href === contact), `Missing supplied contact: ${contact}`);
for (const { name, attrs } of tags) {
  if (name === 'a' && /^mailto:/.test(attrs.href ?? '')) assert(attrs.href === contacts[0], `Unexpected email destination: ${attrs.href}`);
}
assert(tags.some(({ name, attrs }) => name === 'link' && attrs.rel === 'canonical' && attrs.href === 'https://www.southustles.com/UT/'), 'Canonical URL must preserve uppercase /UT/.');
const shareImage = tags.find(({ name, attrs }) => name === 'meta' && attrs.property === 'og:image')?.attrs.content;
assert(shareImage?.startsWith('https://www.southustles.com/UT/'), 'Share image must use the canonical UT asset path.');
if (shareImage?.startsWith('https://www.southustles.com/UT/')) await checkLocalReference(new URL(shareImage).pathname, htmlPath);
assert(!/south\s*hustles|motion\s*lab/i.test(html.replace(/<head>[\s\S]*?<\/head>/i, '')), 'UT visible page contains another product’s branding.');

for (const filename of await readdir(path.join(site, 'css'))) {
  if (!filename.endsWith('.css')) continue;
  const cssPath = path.join(site, 'css', filename);
  const css = await readFile(cssPath, 'utf8');
  for (const match of css.matchAll(/url\(\s*['"]?([^'"\s)]+)['"]?\s*\)/g)) await checkLocalReference(match[1], cssPath);
}
for (const filename of await readdir(path.join(site, 'js'))) {
  if (!filename.endsWith('.js')) continue;
  const scriptPath = path.join(site, 'js', filename);
  const source = await readFile(scriptPath, 'utf8');
  const syntax = spawnSync(process.execPath, ['--input-type=module', '--check'], { input: source, encoding: 'utf8' });
  assert(syntax.status === 0, `Invalid ES module syntax in ${label(scriptPath)}: ${syntax.stderr.trim()}`);
  for (const match of source.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*)['"](\.[^'"]+)['"]/g)) await checkLocalReference(match[1], scriptPath);
}

if (failures.length) {
  console.error(`UT validation failed (${failures.length}):\n${failures.map(message => ` - ${message}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`UT validated: ${ids.size} unique IDs, 12 Universe rows, 4 services, ${translatedKeys.size} used translation keys in 3 locales, ${checkedFiles.size} local references and ES module syntax.`);
}
