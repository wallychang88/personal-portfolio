#!/usr/bin/env node
/**
 * Interactive helper to add a photo to a gallery.
 *
 * Usage:
 *   pnpm new-photo
 *
 * Prompts for:
 *   - source path of the image on your computer
 *   - which gallery it belongs to (endurance_whitney, baking_bagels, ...)
 *   - caption (optional, shown to readers)
 *   - alt text (required for accessibility)
 *
 * The script:
 *   1. Copies the image into `public/images/{gallery}/{slug}.{ext}`,
 *      slugifying the filename so spaces and special characters don't
 *      break URLs.
 *   2. Appends an entry to the appropriate array in `lib/galleries.ts`.
 *
 * If anything goes wrong, no changes are written — the script bails before
 * touching `lib/galleries.ts`.
 *
 * Requires Node 18+. No external dependencies.
 */

import { readFile, writeFile, mkdir, copyFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, basename, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const ROOT = resolve(fileURLToPath(import.meta.url), '..', '..');
const GALLERIES_FILE = join(ROOT, 'lib', 'galleries.ts');
const PUBLIC_IMAGES = join(ROOT, 'public', 'images');

// Allow-list of gallery keys. Keep in sync with lib/galleries.ts.
const GALLERY_IDS = [
  'endurance_whitney',
  'endurance_tioga',
  'endurance_ironman',
  'baking_bagels',
  'baking_pizza',
  'baking_bread',
];

const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\.[^/.]+$/, '') // strip extension
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

async function prompt(rl, question) {
  const answer = await rl.question(question);
  return answer.trim();
}

async function main() {
  const rl = createInterface({ input, output });

  console.log('\n📸  Add a photo to a gallery\n');

  // 1. Source path
  const src = await prompt(rl, 'Path to image file: ');
  if (!src) bail(rl, 'No path provided. Aborting.');

  const absoluteSrc = resolve(src.replace(/^~/, process.env.HOME ?? ''));
  if (!existsSync(absoluteSrc)) bail(rl, `File not found: ${absoluteSrc}`);

  const ext = extname(absoluteSrc).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    bail(rl, `Unsupported extension ${ext}. Use one of: ${[...ALLOWED_EXT].join(', ')}`);
  }

  const stats = await stat(absoluteSrc);
  if (!stats.isFile()) bail(rl, 'Path is not a file.');
  console.log(`  ✓ ${(stats.size / 1024).toFixed(0)} KB · ${ext}`);

  // 2. Gallery
  console.log('\nAvailable galleries:');
  GALLERY_IDS.forEach((id, i) => console.log(`  ${i + 1}. ${id}`));
  const galleryChoice = await prompt(rl, '\nPick a gallery (number or name): ');
  let gallery;
  if (/^\d+$/.test(galleryChoice)) {
    gallery = GALLERY_IDS[parseInt(galleryChoice, 10) - 1];
  } else {
    gallery = GALLERY_IDS.find((id) => id === galleryChoice);
  }
  if (!gallery) bail(rl, `Unknown gallery: ${galleryChoice}`);

  // 3. Slug
  const suggestedSlug = slugify(basename(absoluteSrc));
  const slugInput = await prompt(
    rl,
    `\nFilename slug (default: ${suggestedSlug}): `,
  );
  const slug = slugify(slugInput || suggestedSlug);
  if (!slug) bail(rl, 'Slug came back empty.');

  // 4. Caption (optional)
  const caption = await prompt(rl, 'Caption (optional): ');

  // 5. Alt text (required)
  const alt = await prompt(rl, 'Alt text (required, for screen readers): ');
  if (!alt) bail(rl, 'Alt text is required.');

  // ────────────────────────────────────────────────────────────────
  //  Confirm
  // ────────────────────────────────────────────────────────────────
  const destDir = join(PUBLIC_IMAGES, gallery);
  const destFile = join(destDir, `${slug}${ext}`);
  const webPath = `/images/${gallery}/${slug}${ext}`;

  console.log('\n──  About to do  ──────────────────────');
  console.log(`  Copy ${absoluteSrc}`);
  console.log(`    →  ${destFile}`);
  console.log(`  Append entry to ${gallery} in lib/galleries.ts:`);
  console.log(`    { src: "${webPath}", caption: ${caption ? JSON.stringify(caption) : 'undefined'}, alt: ${JSON.stringify(alt)} }`);
  const confirm = await prompt(rl, '\nProceed? [Y/n]: ');
  if (confirm && !/^y/i.test(confirm)) bail(rl, 'Cancelled.');

  // ────────────────────────────────────────────────────────────────
  //  Apply
  // ────────────────────────────────────────────────────────────────
  await mkdir(destDir, { recursive: true });
  await copyFile(absoluteSrc, destFile);

  const src_ts = await readFile(GALLERIES_FILE, 'utf8');

  // Find the empty array `[]` that follows the gallery key on the SAME
  // line. We support both:
  //     gallery_id: [] satisfies Photo[],
  //     gallery_id: [
  //       { ... },
  //     ] satisfies Photo[],
  // by inserting BEFORE the closing `]`.
  const newEntry = caption
    ? `    {\n      src: "${webPath}",\n      caption: ${JSON.stringify(caption)},\n      alt: ${JSON.stringify(alt)},\n    },`
    : `    {\n      src: "${webPath}",\n      alt: ${JSON.stringify(alt)},\n    },`;

  // Match the gallery's array span. The simplest reliable approach is to
  // find the gallery key, then the next `]` after it, and insert before.
  const keyIdx = src_ts.indexOf(`${gallery}:`);
  if (keyIdx === -1) {
    bail(rl, `Could not find "${gallery}:" in lib/galleries.ts. Did you rename it?`);
  }
  const closingIdx = src_ts.indexOf(']', keyIdx);
  if (closingIdx === -1) {
    bail(rl, 'Malformed lib/galleries.ts? Could not find closing `]`.');
  }

  // Decide if we need a leading newline (only if the array isn't empty).
  const before = src_ts.slice(keyIdx, closingIdx);
  const isEmpty = !/\{/.test(before);
  const insertion = isEmpty ? `\n${newEntry}\n  ` : `${newEntry}\n  `;
  const updated =
    src_ts.slice(0, closingIdx) + insertion + src_ts.slice(closingIdx);

  await writeFile(GALLERIES_FILE, updated, 'utf8');

  console.log('\n✅  Done.');
  console.log(`  ${webPath}`);
  console.log(`  Edited lib/galleries.ts → ${gallery}\n`);
  console.log('  Preview with `pnpm dev`. Ship with `pnpm build`.\n');
  rl.close();
}

function bail(rl, msg) {
  console.error(`\n✗  ${msg}\n`);
  rl.close();
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
