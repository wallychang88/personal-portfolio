# Session handoff — 2026-05-22

You are picking up a personal portfolio port mid-stream. The design is
locked through 4 rounds of iteration on Claude Design. Both reviews ran
in this session (`/plan-design-review` 9/10, `/plan-eng-review` clean).
A codex outside-voice pass caught real Tailwind container-query issues
that are already folded into the plan. The implementation has started
but is not yet committed. Your job is to finish Phase 1 cleanup, run
`git init`, then begin Phase 2.

---

## Part I — Read these first (in order)

1. **`PORT-PLAN.md`** — the locked execution plan. ~25KB. Single source
   of truth for the entire port. Read end-to-end. Contains: design
   decisions, container-query strategy, ornament library structure, data
   layer typing, motion library, accessibility checklist, codex
   corrections, cross-model resolutions.
2. **`AUDIT-2026-05-21.md`** — known issues + invented anecdotes to
   scrub at port time (the design canvas has voice-demo copy that must
   not ship to production).
3. **`WALLY.md`** — canonical bio. Never invent biographical facts.
4. **`CLAUDE.md`** — architectural invariants. `output: 'export'`,
   `images.unoptimized: true`, mobile-first, no animation libraries
   beyond CSS.
5. **This file (`HANDOFF.md`)** — current state + how to pick up.

---

## Part II — What's done this session (2026-05-22)

### Reviews completed

- **`/plan-design-review`** → 5/10 → 9/10. 14 decisions captured. Outcome
  in `PORT-PLAN.md` Passes 1–7.
- **`/plan-eng-review`** → clean. 4 ambiguities resolved (doorpi
  marginalia rail, MDX strategy, image pipeline, test scope).
- **Codex outside voice** (via codex 0.133.0) → 8 findings, all
  technical fixes folded directly into `PORT-PLAN.md`. 3 cross-model
  tensions resolved by Wally: RodSmith → external link (codex won),
  worktrees → keep (Wally won), MDX → `@next/mdx` (codex won after
  reframing).

### Files written / updated

| File | What changed |
|------|-------------|
| `PORT-PLAN.md` | NEW — 25KB locked execution plan |
| `AUDIT-2026-05-21.md` | Added "Decision: invented anecdotes get scrubbed at port time" section + d-writing kitchen-chip removal note |
| `TODO.md` | Added "IA change" (kitchen split) + "Port-time copy scrub (CRITICAL)" sections at top |
| `CLAUDE.md` | IA list updated with `/kitchen/`; nav order revised to Index → Projects → Endurance → Kitchen → Writing → About |
| `tailwind.config.ts` | **Rewritten.** Dropped `*-surface` color variants. Added `tile`, `borderRadius.tile`, custom shadows (`shadow-hairline`, `shadow-tile-hover`), letter-spacing scale (`eyebrow`/`meta`/`stat`), 8 keyframes + animation utilities, max-width tokens. Honey darkened to `#B07A2A` for WCAG AA. |
| `app/layout.tsx` | Added JetBrains Mono via `next/font`, updated metadata for new hero copy, kept `Walter S.` → `Wally Chang` byline rule |
| `components/nav.tsx` | Added Kitchen to nav order |
| `components/tag.tsx` | Rewritten to use alpha-syntax background (`bg-sage/[0.06]`) + colored border. No more dropped surface colors. Added `inline-flex items-center` for alignment. |
| `package.json` | Added `engines.node >= 18` + `pnpm.onlyBuiltDependencies: ["sharp"]` |
| `.gitignore` | NEW — Next.js defaults + `.design-handoff/` |
| `.eslintignore` | NEW — excludes `.design-handoff/` |

### Bundles + artifacts

- `.design-handoff/personal-portfolio/` — extracted from Claude Design
  via Share menu → "Handoff to Claude Code" → gzip tarball at
  `api.anthropic.com/v1/design/h/<hash>`. Contains README, chat
  transcript, 6 page JSX files, `_unified.jsx` design system, concepts/
  earlier drafts. **Frozen visual reference. Never `import` from this
  directory** — `_unified.jsx` is an IIFE that mutates `document` at
  module scope (lines 5 + 674) and will break RSC.

### Task list (current)

```
#9  [in_progress] Phase 1 — Foundation (cleanup almost done, pnpm build not verified)
#10 [pending]     Phase 2 — Ornament library + tile primitive
#11 [pending]     Phase 3 — Homepage (time-banded Bento)
#12 [pending]     Phase 4 — /endurance/ Atlas treatment
#13 [pending]     Phase 5 — /projects/doorpi/ deep-dive
#14 [pending]     Phase 6 — /writing/ index
#15 [pending]     Phase 7 — /kitchen/ image-led
#16 [pending]     Phase 8 — /about/ mixed-register
#17 [pending]     Phase 9 — /timeline/ flat-list page
#18 [in_progress] Phase 0 — git init + initial commit + .eslintignore
```

Phase 1 first round shipped earlier in the session (palette, fonts, nav,
tag) and built clean (`pnpm build` produced 4 routes, 94.2KB First Load
JS). The SECOND round of Phase 1 cleanup (Pass 5 corrections + codex P0
fixes) was written but **not yet verified with `pnpm build`** and **not
yet committed.**

---

## Part III — Pick up exactly here

### Step 1: Verify Phase 1 cleanup builds clean

```bash
cd "/Users/wally/Documents/Claude/Projects/Personal Portfolio"
pnpm install   # picks up the new pnpm.onlyBuiltDependencies config
pnpm build
```

Expected: 4 routes prerendered (`/`, `/_not-found`, `/endurance`,
`/projects/doorpi`), no warnings beyond the `unrs-resolver` postinstall
note we already saw.

**If build fails:** the most likely cause is the rewritten
`tailwind.config.ts`. Suspect areas:
- `keyframes.draw-in.to.strokeDashoffset` — Tailwind 3.4 may not accept
  camelCase here. If so, change to `'stroke-dashoffset': '0'`.
- `keyframes['pulse-trace'].to.offsetDistance` — same risk. Change to
  `'offset-distance': '100%'` if needed.
- `tag.tsx` may need explicit safelist entries for the alpha-syntax
  classes since they're constructed at runtime in `paletteFor()`. If
  Tailwind purges them, add `safelist: [{ pattern: /bg-(sage|rust|slate|honey|clay)\/\[0\.0[67]\]/ }]` to the config.

### Step 2: git init + first commit

```bash
cd "/Users/wally/Documents/Claude/Projects/Personal Portfolio"
git init -b main
git add -A
git status   # sanity-check what's staged (should NOT include .design-handoff/, node_modules/)
git commit -m "Initial commit: Phase 1 foundation + locked PORT-PLAN

- Tokens (paper/ink + 5-category accents at #B07A2A honey for WCAG AA)
- Fonts via next/font: Fraunces + Inter + JetBrains Mono
- 8 keyframes + animation utilities in tailwind.config.ts
- Tag pill with alpha-syntax background
- Nav with Kitchen route added
- Build clean: 4 routes prerendered, 94.2KB First Load JS
- PORT-PLAN.md locked through /plan-design-review (9/10) + /plan-eng-review (clean) + codex outside voice"
```

### Step 3: Add the ESLint guard against `.design-handoff/` imports

The repo currently has no `.eslintrc*` file; `next lint` uses
`eslint-config-next` defaults. Create `.eslintrc.json`:

```json
{
  "extends": "next/core-web-vitals",
  "rules": {
    "no-restricted-imports": ["error", {
      "patterns": [{
        "group": [".design-handoff/*", "../.design-handoff/*", "**/.design-handoff/*"],
        "message": "Never import from .design-handoff/ — _unified.jsx is an IIFE that mutates document at module scope and will break RSC. Use it as visual reference only; re-implement components in TSX from scratch."
      }]
    }]
  }
}
```

Verify: `pnpm lint` runs clean.

### Step 4: Start Phase 2

The big phase. ~13 ornament components + tile primitive + filter chip +
stat panel + DESIGN.md + lightbox client wrapper + Vitest setup. See
"Part IV" below for the breakdown.

---

## Part IV — Phase 2 deep dive

Phase 2 is the largest unit of work. Read `PORT-PLAN.md` "Architecture"
section first, then break it down into atomic substeps:

### Phase 2a — Install dependencies

```bash
pnpm add @next/mdx gray-matter zod yet-another-react-lightbox \
         @tailwindcss/container-queries
pnpm add -D sharp vitest @vitejs/plugin-react @testing-library/react \
            @testing-library/jest-dom jsdom jest-axe
```

After install, update `tailwind.config.ts` plugins:
```ts
plugins: [require('@tailwindcss/container-queries')],
```

And `app/layout.tsx`: add `@container` to the main canvas div so all
descendants can use `@[768px]:` etc.

### Phase 2b — Ornament components

13+ files under `components/ornaments/`. Each is a small TSX with an
inline SVG. **Re-implement from scratch using `_unified.jsx` as a visual
reference** — never `import` from `.design-handoff/`.

File order (build the simpler ones first, route SVGs last):

1. `components/ornaments/catClass.ts` — helper: `catClass('rust') →
   { stripe: 'border-l-rust', text: 'text-rust', bg: 'bg-rust/[0.06]' }`
2. `components/ornaments/OrnRevStamp.tsx` — hardware stamp, hover flip
3. `components/ornaments/OrnLED.tsx` — heartbeat dot + label
4. `components/ornaments/OrnDropcap.tsx` — settle keyframe
5. `components/ornaments/OrnPullQuote.tsx` — italic + 2px clay left rule
6. `components/ornaments/OrnReadingMeter.tsx` — small inline meter
7. `components/ornaments/OrnThumbStamp.tsx` — dashed honey border
8. `components/ornaments/OrnCursor.tsx` — blinking cursor
9. `components/ornaments/OrnSparkline.tsx` — data prop, bars grow
10. `components/ornaments/OrnCommitGrid.tsx` — 7x52 grid
11. `components/ornaments/OrnTenure.tsx` — segmented bar with labels
12. `components/ornaments/OrnBakeCurve.tsx` — temp/time line chart
13. `components/ornaments/OrnCrossSection.tsx` — bagel/loaf cross-section
14. `components/ornaments/OrnCompassRose.tsx` — masthead compass, idle
15. `components/ornaments/OrnEndurance.tsx` — multi-kind dispatcher
    (route/whitney/tioga/race/timeline). May delegate to:
    - `components/ornaments/routes/RouteWhitney.tsx`
    - `components/ornaments/routes/RouteTioga.tsx`
    - `components/ornaments/routes/RouteIronman.tsx`
16. `components/ornaments/PAHomeSchematic.tsx` — bespoke compact
    schematic for the doorpi homepage tile (3 boxes + arrow to 12V
    latch, labels below boxes, no overlap)
17. `components/ornaments/index.ts` — barrel export

**Critical SVG hygiene per codex finding #P2-10:** every ornament that
uses `<defs>` with `id="..."` MUST prefix those IDs with `useId()` —
otherwise two `OrnCrossSection` instances on the same page collide.

### Phase 2c — Tile + Filter Chip + Stat Panel

Three primitive components used by every page:

- `components/tile.tsx` — `<Tile cat="rust" span={{cols:2, rows:2}} href="...">`. Wraps content in `<a>` with `aria-label`, applies hover lift via Tailwind. Category stripe via `border-l-[4px] border-<cat>`. Background `bg-tile` (#FFFCF4), border `border-[rgba(28,27,23,0.10)]`, radius `rounded-tile`, shadow `shadow-hairline` rest / `shadow-tile-hover` hover.
- `components/filter-chips.tsx` — `'use client'`. URL query param state (`?cat=endurance`). Buttons with `aria-pressed`. Color dots per category.
- `components/stat-panel.tsx` — 4-col grid, top + bottom hairlines, value in Fraunces opsz 36 / wght 500 / 26px.

### Phase 2d — Lightbox wrapper

```ts
// components/photo-strip.tsx
'use client';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
// ... existing photo strip + lightbox state
```

`yet-another-react-lightbox` is ~14KB gzipped, MIT, works with
`output: 'export'`. Open state in `useState`, dismiss on Escape, arrow
keys navigate.

### Phase 2e — DESIGN.md

Write `DESIGN.md` at project root. Sections per `PORT-PLAN.md` Pass 5.
Cite **component file paths** as truth (per codex correction P2-11), not
`_unified.jsx` line numbers. Note at top: "Honey accent darkened to
`#B07A2A` for WCAG AA — source `_unified.jsx` keeps `#D4923C`. This
divergence is deliberate."

### Phase 2f — Tests scaffold

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', setupFiles: ['./vitest.setup.ts'] },
});
```

```ts
// vitest.setup.ts
import '@testing-library/jest-dom/vitest';
import { expect } from 'vitest';
import { toHaveNoViolations } from 'jest-axe';
expect.extend({ toHaveNoViolations });
```

Tests scope (per eng review + codex resolution): **client components
only**. Async RSC pages cannot mount in jsdom. So tests live for:
- ornament components (visual props, snapshot)
- `<FilterChips>` (URL param logic)
- `<PhotoStrip>` (lightbox open/close)
- `<Nav>` (current page indicator)

Full-page tests via `pnpm build` clean + manual review.

`scripts/check-links.mjs` — node script greps every `href=` in
`app/**` + `lib/**`, verifies each resolves. Also scans
`out/**/*.html` (post-build) for broken `src=` references.

`scripts/check-images.mjs` — verify every `PhotoEntry` in `lib/galleries.ts`
has matching files at `public/images/<gallery>/<slug>.{avif,webp,jpg}`.

---

## Part V — Cross-model corrections + gotchas (must-knows)

These are the landmines the design + eng reviews missed and codex
caught. **Each will bite if forgotten.**

### Container queries

**WRONG (from my initial PORT-PLAN draft):**
```tsx
<div className="@md:grid-cols-6 @xl:grid-cols-6">
```
`@tailwindcss/container-queries` v3 default `@md` is **28rem (~448px
container width)**, NOT 768px. Desktop layout fires WAY too early.

**RIGHT:**
```tsx
<div className="@[768px]:grid-cols-2 @[1100px]:grid-cols-6">
```
Use arbitrary container-width syntax. Or define custom container tokens
in `tailwind.config.ts` theme.containers.

### `@max-*` syntax for desktop/mobile component toggle (doorpi)

Don't use `@max-lg:block`. Use the two-sibling pattern:
```tsx
<DesktopDoorpi className="hidden @[1024px]:block" />
<MobileDoorpi  className="block @[1024px]:hidden" />
```

### `.design-handoff/` is a IIFE module

`_unified.jsx` line 5 starts:
```js
(function injectUnifiedStyles() {
  if (document.getElementById('uni-styles')) return;
  // ... mutates document
```
This runs at module import. RSC sees `document` undefined → build dies.
**Never `import` from `.design-handoff/`. Use it visually only.** ESLint
rule from Step 3 above enforces this.

### Sharp + pnpm

Without `pnpm.onlyBuiltDependencies: ["sharp"]` in `package.json`,
`pnpm install` will silently skip the sharp postinstall on teammates'
machines, and `sharp` will fail to load at runtime. Already configured
in this session.

### `dynamicParams = false` on static export

When you create `app/projects/[name]/page.tsx` or
`app/writing/[slug]/page.tsx`, both MUST export:
```ts
export const dynamicParams = false;
export async function generateStaticParams() {
  return [...]; // enumerated slugs from lib/projects.ts or lib/essays.ts
}
```
Without `dynamicParams = false`, Next 14 warns. Without
`generateStaticParams()`, static export fails.

### Honey divergence

Source `_unified.jsx` uses `#D4923C` for honey. Our Tailwind config uses
`#B07A2A` (AA-compliant on small text). This divergence is intentional.
Document in DESIGN.md. Don't "fix" the implementation to match the
source.

### Lightbox client boundary

`yet-another-react-lightbox` uses React state + CSS imports. Put the
`'use client';` directive at the TOP of `components/photo-strip.tsx`,
not on the page component. The page stays RSC; the photo strip is the
boundary.

### MDX → @next/mdx (not next-mdx-remote)

Final lock after cross-model resolution. Each essay lives at
`app/writing/[slug]/page.mdx`. No runtime serializer. Frontmatter
parsed with `gray-matter` + validated by `zod`.

### RodSmith is external in v1

Bento RodSmith tile points to `https://rodsmith.app` (external,
`target="_blank" rel="noopener noreferrer"`). **No internal
`/projects/rodsmith/` page in v1.** Add internal route when prose lands.

### SVG `<defs>` ID collisions

Every ornament that uses `<defs>` with `id="<something>"` needs to
wrap that ID with `React.useId()`. Otherwise two `OrnCrossSection` on
the same page (e.g., kitchen featured batch + recent batches grid)
will collide and break rendering.

---

## Part VI — File state inventory

### Modified during this session (must be in initial git commit)

```
PORT-PLAN.md                                    NEW
AUDIT-2026-05-21.md                             MODIFIED
TODO.md                                         MODIFIED
CLAUDE.md                                       MODIFIED
tailwind.config.ts                              REWRITTEN
app/layout.tsx                                  MODIFIED (JetBrains Mono)
components/nav.tsx                              MODIFIED (Kitchen)
components/tag.tsx                              REWRITTEN (alpha-syntax)
package.json                                    MODIFIED (engines, pnpm config)
.gitignore                                      NEW
.eslintignore                                   NEW
HANDOFF.md                                      NEW (this file)
```

### Existing, untouched

```
app/globals.css                                 KEEP (will extend in Phase 2)
app/page.tsx                                    KEEP (replace in Phase 3)
app/endurance/page.tsx                          KEEP (replace in Phase 4)
app/projects/doorpi/page.tsx                    KEEP (replace in Phase 5)
components/footer.tsx                           KEEP
components/article-shell.tsx                    KEEP (reuse)
components/photo-strip.tsx                      KEEP (wrap lightbox in Phase 2)
components/stat-panel.tsx                       KEEP (restyle in Phase 2)
components/timeline-entry.tsx                   KEEP (repurpose in Phase 9)
lib/timeline.ts                                 KEEP
lib/galleries.ts                                KEEP (PhotoEntry type evolves in Phase 2)
scripts/new-photo.mjs                           KEEP (extend with sharp in Phase 2)
next.config.mjs                                 KEEP
postcss.config.mjs                              KEEP
tsconfig.json                                   KEEP
Walter-Chang-Resume.pdf                         KEEP (link from /about/ in Phase 8)
WALLY.md                                        KEEP (source of truth)
design-brief.md                                 KEEP (historical reference)
```

### Local reference (gitignored)

```
.design-handoff/personal-portfolio/             FROZEN visual reference
  ├── README.md
  ├── chats/chat1.md                            (full design conversation)
  └── project/
      ├── pages/_unified.jsx                    (35KB design system — VISUAL REFERENCE ONLY)
      ├── pages/a-home.jsx
      ├── pages/b-endurance.jsx
      ├── pages/c-doorpi.jsx
      ├── pages/d-writing.jsx
      ├── pages/e-about.jsx
      ├── pages/f-kitchen.jsx
      └── concepts/                             (earlier round drafts D1-D5, F1-F6)
```

---

## Part VII — Open questions blocking specific phases

These don't block Phase 1 cleanup or Phase 2. They DO block specific
later phases. Track in `WALLY.md` open questions section.

| Block | Phase | Question |
|-------|-------|----------|
| Phase 5 doorpi prose | 5 | Wally needs to write the doorpi narrative replacing the invented "glass vestibule + guitar" origin |
| Phase 6 first essay | 6 | Wally picks "one opinion you'd put in writing now" (WALLY.md open Q #5) |
| Phase 7 first batch | 7 | Wally writes one real batch note (hydration, ferment, oven, photos) |
| Phase 4 photos | 4 | Whitney + Tioga + IRONMAN photos pending upload (TODO.md) |
| Phase 5 RodSmith timing | 5 | When does rodsmith.app launch? Until then, Bento tile externals to it |
| Phase 8 Strava integration | 8 | TODO.md open question — link-only OK per PORT-PLAN |

---

## Part VIII — Skill / agent context

This session leaned heavily on gstack skills:
- `/plan-design-review` produced `PORT-PLAN.md` Passes 1-7
- `/plan-eng-review` produced architecture + tests + perf sections
- Codex outside voice (via `~/.claude/skills/gstack/bin/...`) caught
  the container-query breakpoint bug + IIFE import landmine

If picking up in a fresh session:
- The reviews are LOGGED at `~/.gstack/projects/<slug>/<branch>-reviews.jsonl`
  (run `~/.claude/skills/gstack/bin/gstack-review-read` to see them).
- Learnings captured: "container-queries plugin defaults are container-size
  not viewport," "design-handoff/ is IIFE, never import," "codex 0.133
  needs --skip-git-repo-check for non-git repos."

If continuing the implementation: you don't need to re-run any review.
Just read `PORT-PLAN.md` + this file, then begin at Part III Step 1.

---

*Handed off 2026-05-22 evening, mid-Phase 1 cleanup, pre-Phase 0
(git init), pre-Phase 2 (ornament library). Next agent: verify Phase 1
cleanup with `pnpm build`, `git init` + initial commit, then begin
Phase 2a (install deps). Plan is locked. Don't reopen the design
decisions — they cost 4 rounds + 2 reviews + an outside voice to
finalize.*
