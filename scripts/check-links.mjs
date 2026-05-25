#!/usr/bin/env node
// check-links.mjs — scan source for every internal href and confirm it
// resolves to a real route in app/. Externals (http(s)://, mailto:, tel:,
// anchor #foo) are skipped. Exits 1 on any broken link.
//
// Intentionally simple: regex grep over .tsx/.ts/.mdx files in app/, lib/,
// content/. We don't parse — we just look for things shaped like
// `href="/something"` or `href={'/something/'}`. False positives are OK
// (we'll just verify them anyway); false negatives would be silent bugs.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const APP_DIR = join(ROOT, 'app');

const SOURCE_DIRS = ['app', 'lib', 'content', 'components'];
const SOURCE_EXTS = new Set(['.ts', '.tsx', '.mdx', '.md']);

/** Walk a directory recursively and yield file paths. */
function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === 'node_modules' || entry === '.next' || entry.startsWith('__tests__')) continue;
      yield* walk(full);
    } else {
      const dot = entry.lastIndexOf('.');
      if (dot >= 0 && SOURCE_EXTS.has(entry.slice(dot))) {
        yield full;
      }
    }
  }
}

/** Routes that the App Router resolves. Walk app/ and collect every
 *  directory that contains page.tsx / page.mdx — those are valid paths. */
function discoverRoutes() {
  const routes = new Set(['/']);
  function visit(dir, segments) {
    if (!existsSync(dir)) return;
    const entries = readdirSync(dir);
    const isLeaf = entries.some((e) => e === 'page.tsx' || e === 'page.mdx' || e === 'page.ts');
    if (isLeaf && segments.length > 0) {
      routes.add('/' + segments.join('/') + '/');
    }
    for (const e of entries) {
      if (e.startsWith('_') || e.startsWith('.')) continue;
      const full = join(dir, e);
      const st = statSync(full);
      if (st.isDirectory()) {
        // App Router segment groups in (parens) don't add to the URL
        const seg = e.startsWith('(') && e.endsWith(')') ? null : e;
        visit(full, seg ? [...segments, seg] : segments);
      }
    }
  }
  visit(APP_DIR, []);
  return routes;
}

const ROUTES = discoverRoutes();

// Routes that PORT-PLAN says will exist by v1 but haven't shipped yet. We
// tolerate references to them so /nav/footer can ship before every page.
// Remove an entry once its phase lands.
const PLANNED = new Set([]);

const HREF_RE = /href\s*=\s*(?:"([^"]+)"|'([^']+)'|\{['"`]([^'"`]+)['"`]\})/g;

const issues = [];
let scanned = 0;
let checked = 0;

for (const dir of SOURCE_DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    scanned++;
    const src = readFileSync(file, 'utf8');
    let m;
    HREF_RE.lastIndex = 0;
    while ((m = HREF_RE.exec(src))) {
      const href = m[1] ?? m[2] ?? m[3];
      if (!href) continue;
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        href.startsWith('//')
      ) {
        continue;
      }
      checked++;
      // Strip query + anchor
      const path = href.split('#')[0].split('?')[0];
      if (!path) continue;
      const normalized = path.endsWith('/') ? path : path + '/';
      if (path === '/') continue;

      // Allow direct asset paths (under /public/ or at the repo root).
      if (
        path.startsWith('/images/') ||
        path.endsWith('.pdf') ||
        path.endsWith('.png') ||
        path.endsWith('.jpg') ||
        path.endsWith('.jpeg') ||
        path.endsWith('.webp') ||
        path.endsWith('.avif') ||
        path.endsWith('.svg') ||
        path.endsWith('.gif')
      ) {
        const publicDir = resolve(ROOT, 'public');
        const onDisk = resolve(publicDir, '.' + path);
        const repoRoot = resolve(ROOT, '.' + path); // tolerate /Walter-Chang-Resume.pdf
        // resolve() normalizes ../, so a malicious href like /a/../../etc/passwd
        // wouldn't escape — we check the resolved path is still under the
        // expected roots.
        const underPublic = onDisk.startsWith(publicDir + '/') && existsSync(onDisk);
        const underRoot = repoRoot.startsWith(ROOT + '/') && existsSync(repoRoot);
        if (!underPublic && !underRoot) {
          issues.push({ file: relative(ROOT, file), href, why: 'asset not found' });
        }
        continue;
      }

      if (!ROUTES.has(normalized) && !ROUTES.has(path)) {
        if (PLANNED.has(normalized) || PLANNED.has(path)) continue;
        issues.push({ file: relative(ROOT, file), href, why: 'no route matches' });
      }
    }
  }
}

if (issues.length === 0) {
  console.log(`check-links: ${checked} internal hrefs in ${scanned} files — all resolve.`);
  process.exit(0);
}

console.error(`check-links: ${issues.length} broken link(s) found across ${scanned} files:`);
for (const issue of issues) {
  console.error(`  ${issue.file}  →  href="${issue.href}"  (${issue.why})`);
}
console.error('\nKnown routes:');
for (const r of [...ROUTES].sort()) console.error(`  ${r}`);
process.exit(1);
