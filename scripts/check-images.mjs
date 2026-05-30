#!/usr/bin/env node
// check-images.mjs — every `src:` in content/galleries/*.yml must point to a
// real file under public/. Exits 1 on the first missing image.
//
// Implementation: regex-grep across all gallery YAML files. No bundler —
// keeps this script standalone (no js-yaml dep required).

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GALLERIES_DIR = join(ROOT, 'content', 'galleries');
const PUBLIC_DIR = join(ROOT, 'public');

if (!existsSync(GALLERIES_DIR)) {
  console.log('check-images: no content/galleries/ — nothing to verify.');
  process.exit(0);
}

const files = readdirSync(GALLERIES_DIR).filter(
  (f) => f.endsWith('.yml') || f.endsWith('.yaml'),
);

// Match `src: '...'` or `src: "..."` (Decap writes either; YAML accepts
// both). Also matches an unquoted `src: /path/to/file.jpg`.
const SRC_RE = /(?:^|\s)src\s*:\s*['"]?([^'"\n]+)['"]?/gm;

const missing = [];
let total = 0;

for (const file of files) {
  const raw = readFileSync(join(GALLERIES_DIR, file), 'utf8');
  let m;
  while ((m = SRC_RE.exec(raw))) {
    const value = m[1].trim();
    total++;
    if (!value.startsWith('/')) {
      missing.push({ file, src: value, why: 'must start with /' });
      continue;
    }
    const disk = resolve(PUBLIC_DIR, '.' + value);
    if (!disk.startsWith(PUBLIC_DIR + '/')) {
      missing.push({ file, src: value, why: 'escapes public/ (likely traversal)' });
      continue;
    }
    if (!existsSync(disk)) {
      missing.push({ file, src: value, why: 'file not in public/' });
    }
  }
}

if (total === 0) {
  console.log('check-images: no photo entries yet — nothing to verify.');
  process.exit(0);
}

if (missing.length === 0) {
  console.log(`check-images: ${total} photo entries across ${files.length} galleries — all files present on disk.`);
  process.exit(0);
}

console.error(`check-images: ${missing.length}/${total} broken image reference(s):`);
for (const { file, src: s, why } of missing) {
  console.error(`  ${file}: ${s}  (${why})`);
}
process.exit(1);
