#!/usr/bin/env node
/**
 * Interactive helper to add a photo to a gallery.
 *
 * Usage:
 *   pnpm new-photo
 *
 * Prompts for source path, gallery, filename slug, caption (optional),
 * and alt text (required). Copies the image into `public/images/{gallery}/`
 * and appends an entry to `content/galleries/{gallery}.yml`.
 *
 * Decap CMS at /admin/ does the same thing through a browser — this
 * script is the keep-your-hands-on-keys path for batch additions.
 *
 * Requires Node 18+. No external dependencies (raw YAML appending).
 */

import { readFile, writeFile, mkdir, copyFile, stat, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, basename, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const ROOT = resolve(fileURLToPath(import.meta.url), '..', '..');
const GALLERIES_DIR = join(ROOT, 'content', 'galleries');
const PUBLIC_IMAGES = join(ROOT, 'public', 'images');

const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

async function discoverGalleries() {
  const files = await readdir(GALLERIES_DIR);
  return files
    .filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'))
    .map((f) => f.replace(/\.ya?ml$/, ''))
    .sort();
}

async function prompt(rl, question) {
  return (await rl.question(question)).trim();
}

function bail(rl, msg) {
  console.error(`\n✗  ${msg}\n`);
  rl.close();
  process.exit(1);
}

/**
 * Append a photo entry to a gallery's YAML file. We treat YAML as text
 * rather than parse-and-serialize so the editor's hand-written
 * formatting (comments, blank lines, `hint: >- …`) survives. The
 * `photos:` list is matched and a new entry is inserted at the bottom.
 */
async function appendPhotoEntry(galleryFile, entry) {
  const raw = await readFile(galleryFile, 'utf8');

  // Find the `photos:` key.
  const photosIdx = raw.search(/^photos\s*:/m);
  if (photosIdx === -1) {
    throw new Error(`No \`photos:\` key in ${galleryFile}.`);
  }

  // Two shapes to handle:
  //   photos: []            → replace [] with a populated list
  //   photos:               → append below the last `- src:` item
  //     - src: ...
  const afterKey = raw.slice(photosIdx);
  const emptyMatch = afterKey.match(/^photos\s*:\s*\[\s*\]/);
  if (emptyMatch) {
    const head = raw.slice(0, photosIdx);
    const tail = raw.slice(photosIdx + emptyMatch[0].length);
    return `${head}photos:\n${entry}${tail}`;
  }

  // Non-empty list: find the end of the YAML list (next top-level key
  // or EOF). Top-level keys at column 0 that aren't part of the photos
  // list mark the end.
  const lines = raw.split('\n');
  let startLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^photos\s*:/.test(lines[i])) {
      startLine = i;
      break;
    }
  }
  let endLine = lines.length;
  for (let i = startLine + 1; i < lines.length; i++) {
    // A new top-level key (no leading whitespace, contains `:`) ends the list.
    if (/^\S.*:/.test(lines[i])) {
      endLine = i;
      break;
    }
  }
  const before = lines.slice(0, endLine).join('\n');
  const after = lines.slice(endLine).join('\n');
  const sep = before.endsWith('\n') ? '' : '\n';
  return `${before}${sep}${entry}${after ? '\n' + after : ''}`;
}

async function main() {
  if (!existsSync(GALLERIES_DIR)) {
    console.error(`No ${GALLERIES_DIR} — has the galleries migration run?`);
    process.exit(1);
  }
  const galleryIds = await discoverGalleries();
  if (galleryIds.length === 0) {
    console.error('No gallery YAML files found in content/galleries/.');
    process.exit(1);
  }

  const rl = createInterface({ input, output });

  console.log('\n📸  Add a photo to a gallery\n');

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

  console.log('\nAvailable galleries:');
  galleryIds.forEach((id, i) => console.log(`  ${i + 1}. ${id}`));
  const galleryChoice = await prompt(rl, '\nPick a gallery (number or name): ');
  let gallery;
  if (/^\d+$/.test(galleryChoice)) {
    gallery = galleryIds[parseInt(galleryChoice, 10) - 1];
  } else {
    gallery = galleryIds.find((id) => id === galleryChoice);
  }
  if (!gallery) bail(rl, `Unknown gallery: ${galleryChoice}`);

  const suggestedSlug = slugify(basename(absoluteSrc));
  const slugInput = await prompt(
    rl,
    `\nFilename slug (default: ${suggestedSlug}): `,
  );
  const slug = slugify(slugInput || suggestedSlug);
  if (!slug) bail(rl, 'Slug came back empty.');

  const caption = await prompt(rl, 'Caption (optional): ');
  const alt = await prompt(rl, 'Alt text (required, for screen readers): ');
  if (!alt) bail(rl, 'Alt text is required.');

  const destDir = join(PUBLIC_IMAGES, gallery);
  const destFile = join(destDir, `${slug}${ext}`);
  const webPath = `/images/${gallery}/${slug}${ext}`;
  const galleryFile = join(GALLERIES_DIR, `${gallery}.yml`);

  // Build the YAML entry. Two-space indent under `photos:`.
  const escapedAlt = JSON.stringify(alt);
  const escapedCaption = caption ? JSON.stringify(caption) : null;
  const entry = caption
    ? `  - src: ${webPath}\n    alt: ${escapedAlt}\n    caption: ${escapedCaption}`
    : `  - src: ${webPath}\n    alt: ${escapedAlt}`;

  console.log('\n──  About to do  ──────────────────────');
  console.log(`  Copy ${absoluteSrc}`);
  console.log(`    →  ${destFile}`);
  console.log(`  Append entry to ${galleryFile}:`);
  console.log(entry.replace(/^/gm, '    '));
  const confirm = await prompt(rl, '\nProceed? [Y/n]: ');
  if (confirm && !/^y/i.test(confirm)) bail(rl, 'Cancelled.');

  await mkdir(destDir, { recursive: true });
  await copyFile(absoluteSrc, destFile);

  const updated = await appendPhotoEntry(galleryFile, entry);
  await writeFile(galleryFile, updated, 'utf8');

  console.log('\n✅  Done.');
  console.log(`  ${webPath}`);
  console.log(`  Edited content/galleries/${gallery}.yml\n`);
  console.log('  Preview with `pnpm dev`. Ship with `git add … && git push`.\n');
  rl.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
