#!/usr/bin/env node
// check-images.mjs — every photo entry in lib/galleries.ts must point to a
// real file under public/. Exits 1 on the first missing image.
//
// Implementation: regex-grep the literal galleries module for `src:` /
// `src: "..."` strings. No bundler — keeps this script standalone.

import { readFileSync, existsSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GALLERIES_PATH = join(ROOT, 'lib', 'galleries.ts');
const PUBLIC_DIR = join(ROOT, 'public');

if (!existsSync(GALLERIES_PATH)) {
  console.error(`check-images: cannot find ${GALLERIES_PATH}`);
  process.exit(1);
}

const src = readFileSync(GALLERIES_PATH, 'utf8');

// Match `src: '...'` or `src: "..."` inside the gallery entries.
const SRC_RE = /src\s*:\s*['"]([^'"]+)['"]/g;

const missing = [];
let total = 0;
let m;
while ((m = SRC_RE.exec(src))) {
  const value = m[1];
  total++;
  if (!value.startsWith('/')) {
    missing.push({ src: value, why: 'must start with /' });
    continue;
  }
  // Path is relative to /public. resolve() normalizes ../, so a
  // malicious entry like "/foo/../../package.json" gets caught by the
  // starts-with guard instead of escaping the public directory.
  const disk = resolve(PUBLIC_DIR, '.' + value);
  if (!disk.startsWith(PUBLIC_DIR + '/')) {
    missing.push({ src: value, why: 'escapes public/ (likely a traversal)' });
    continue;
  }
  if (!existsSync(disk)) {
    missing.push({ src: value, why: 'file not in public/' });
  }
}

if (total === 0) {
  console.log('check-images: no photo entries yet — nothing to verify.');
  process.exit(0);
}

if (missing.length === 0) {
  console.log(`check-images: ${total} photo entries — all files present on disk.`);
  process.exit(0);
}

console.error(`check-images: ${missing.length}/${total} broken image reference(s):`);
for (const { src: s, why } of missing) {
  console.error(`  ${s}  (${why})`);
}
process.exit(1);
