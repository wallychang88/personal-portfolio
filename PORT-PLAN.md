# PORT-PLAN.md — round-3 design → Next.js port

Single source of truth for porting `.design-handoff/personal-portfolio/project/pages/*.jsx`
to TSX + Tailwind in this Next.js 14 / `output: 'export'` repo.

Created during `/plan-design-review` on 2026-05-22. The design itself is locked
through round 4; this document is about HOW to translate it faithfully into
production code.

Read alongside:
- `AUDIT-2026-05-21.md` — known issues + invented anecdotes to scrub at port time
- `CLAUDE.md` — architectural invariants (output: export, mobile-first, etc.)
- `WALLY.md` — canonical bio + voice
- `.design-handoff/personal-portfolio/project/pages/_unified.jsx` — design system source

---

## Decisions locked in /plan-design-review (2026-05-22)

| Decision | Choice |
|----------|--------|
| Review depth | Full 7-pass design review + eng review chained after |
| Motion fidelity | Port ALL 8 keyframes + stroke-dashoffset draw-ins; `prefers-reduced-motion` respected |
| Mobile parity | ~~Separate Desktop / Mobile components~~ **Revised in Pass 6:** Single component per page, CSS container queries via `@tailwindcss/container-queries` plugin |
| Honey accent foreground | Darkened from `#D4923C` to `#B07A2A` for WCAG AA contrast on small text |
| Tile click semantics | `<a>` wrappers with `aria-label`, not `<div>` |
| Filter chip semantics | `<button>` with `aria-pressed`, not `<span>` |

---

## Phase ordering (from task list #9–#16)

1. Foundation — tokens, fonts, nav, tag.tsx **(in progress)**
2. Ornament library + tile primitive
3. Homepage (time-banded Bento)
4. /endurance/ (Atlas treatment)
5. /projects/doorpi/ (deep-dive)
6. /writing/ (essays index)
7. /kitchen/ (image-led)
8. /about/ (mixed-register)

Phase 2 must complete before any page port; Phases 3–8 are independent and could
run in any order. Default order is the one above.

---

## Pass 1 — Information Architecture (7 → 9/10)

### Page-level focal hierarchy

| Page | First focal | Second | Third |
|------|-------------|--------|-------|
| `/` (Home) | Hero h1 (`Wally Chang documents projects, miles, and dough.`) | Band 1 anchor tile (doorpi 2×2 left, Tioga 3×1 right) | Subhead, then bands 2 + 3 below the fold |
| `/projects/doorpi/` | Hero schematic strip (full-width, FIG. 01) | h1 + dek | Body prose left, marginalia rail right |
| `/endurance/` | Hero h1 (`The routes that named the years.`) + compass rose in masthead | Three trophy cards stacked, Whitney first | Photo strips beneath each trophy |
| `/kitchen/` | Featured-batch hero (current batch name + bake curve) | Recent batches grid (image-led) | Short prose section "writing about cooking" |
| `/writing/` | Hero h1 (`Slow notes — on the work, the miles, and the dough.`) + filter chips | First essay row (newest) | Subsequent rows |
| `/about/` | Page title (`Wally Chang.` + italic subtitle) | Bio section (photo + 2-3 paras) | Endurance identity → colophon |

### Bento tile links (decision: each tile links to its deep-dive)

| Tile | Links to |
|------|----------|
| doorpi 2×2 | `/projects/doorpi/` |
| Tioga 3×1 | `/endurance/#tioga` |
| Whitney 1×2 tall | `/endurance/#whitney` |
| Extend 1×1 | external: linkedin.com/in/walter-chang or omit |
| RodSmith 2×1 | `/projects/rodsmith/` (placeholder until Phase 5 ports it) |
| IRONMAN 1×1 | `/endurance/#ironman` |
| Bagels 1×1 | `/kitchen/#batch-41` (anchor on featured batch) |
| Essay 2×1 | `/writing/[slug]/` (real slug at port time) |
| Cornell SF 1×1 | `/about/#endurance` |
| AmEx 1×1 | `/writing/[slug]/` if essay shipped, else omit href |
| NOW filler | unlinked (display-only) |

Hover state (tile lift + arrow reveal) is specced in `_unified.jsx` and applies
only to linked tiles.

### Empty-state policy

`/writing/` and `/kitchen/` ship with **1–2 real entries each**. No empty-state
component is designed. Until real content exists, the page is not deployed to
production (build flag or `notFound()` from the layout).

Within-band reading order in the Bento follows tile size: largest tile anchors
top-left, eye flows clockwise/down by visual weight. `grid-auto-flow: dense`
inside each band keeps packing efficient. We do NOT enforce strict chronology
within a band.

---

## Pass 2 — Interaction State Coverage (5 → 9/10)

### Resolved interactions

| Surface | Mechanism |
|---------|-----------|
| Hover (tile lift, arrow reveal, REV stamp flip, compass idle/hover, drop-cap settle, etc.) | Port verbatim from `_unified.jsx` |
| `/writing/` filter chips | Client-side filter with `?cat=endurance` URL query param. Small `'use client'` component. Deep-linkable. |
| Bento "See all" footer | Links to new `/timeline/` page that lists every entry as a row (date · title · hook · tags). lib/timeline.ts already structured for this. |
| Photo strip click on `/endurance/` + `/kitchen/` | Lightbox modal. Use `yet-another-react-lightbox` (~5KB, MIT, static-export-compatible) or equivalent. Add as Phase 2 dependency. |
| 404 page | `app/not-found.tsx` ported as part of Phase 8 (`/about/`). Same Nav + Footer chrome. Serif h1 "This page hasn't been written yet." + helpful link list. |
| `prefers-reduced-motion` | Port the `@media (prefers-reduced-motion: reduce)` block from `_unified.jsx` to `globals.css`. All keyframes pause, all transitions become instant. |
| First-paint motion (drop-cap settle, compass idle, LED heartbeat, steam wisp) | CSS auto-run on mount. No IntersectionObserver needed for above-the-fold ornaments. |
| Scroll-triggered draw-in (`stroke-dashoffset` route SVGs) | Use IntersectionObserver in a small client hook (`useDrawOnScroll`). Trigger once per element when 30% visible. |
| Focus rings | Already in `globals.css` from round 1, keep. |

### New phase

**Phase 9 — `/timeline/` flat-list page.** Added to the task list. Renders every
entry from `lib/timeline.ts` as a magazine TOC-style row (date · title · hook ·
tags). Reuses the row pattern from `d-writing.jsx`. Small page, ~1 hour.

---

## Pass 3 — User Journey & Emotional Arc (6 → 8/10)

### The 5-second test per page

What a visitor sees in the first 5 seconds — must communicate "range + craft + voice."

| Page | 5-sec read | What it says |
|------|-----------|--------------|
| `/` | Hero h1 + Band 1 anchor tiles | "this person ships hardware, races bikes, and writes" |
| `/projects/doorpi/` | FIG. 01 schematic + h1 | "real engineering writeup, not a marketing page" |
| `/endurance/` | Compass rose + 'The routes that named the years.' | "athletic identity, treated as text not as Strava embed" |
| `/kitchen/` | Featured-batch hero + bake curve | "image-led, patience register, no founder-bro" |
| `/writing/` | h1 + filter chips with category dots | "essays, multiple registers, mixed tags" |
| `/about/` | Page title + 'still chasing summits and chew' | "warm, specific, not a résumé" |

### End-of-page CTAs

Every page closes with the same `Footer` component (Nav + Email + GitHub + Strava
+ Colophon). No per-page CTAs. The footer carries the contact + follow surface.
For /writing/[slug]/ posts, ArticleShell provides the back-link to /writing/.

### Page-to-page transitions

- Nav is persistent across all pages.
- Deep links from Bento tiles (Pass 1) connect homepage → deep-dive.
- ArticleShell back-link on /projects/[name]/ and /writing/[slug]/ returns to parent index.
- `/timeline/` and `/writing/` are sibling indices; both link to individual entries.

### Time-horizon design

- **5-sec (visceral):** hero typography + signature ornament per page.
- **5-min (behavioral):** read a single deep-dive or scroll the Bento end-to-end.
- **5-year (reflective):** "that's the guy who did the Whitney alpine start + the doorpi face unlock + the bagel notebook."

---

## Pass 4 — AI Slop Risk (8 → 10/10)

The design has low intrinsic slop risk — 4 rounds of iteration drove it out.
What stays disciplined during the port:

### Tailwind discipline rules

| Rule | Why |
|------|-----|
| Tile border-radius is exactly `rounded-[10px]` (custom value), never `rounded-lg` | Tailwind's `rounded-lg` is 8px; source spec is 10px. Don't drift. |
| Pill border-radius is `rounded-full` (999px) | Matches source `border-radius: 999px`. |
| Custom shadow tokens in `tailwind.config.ts`: `shadow-hairline` (1px, 0.04) and `shadow-tile-hover` (12px/28px, 0.11) | Default `shadow-md`/`shadow-lg` are too heavy. Add these. |
| Tile category stripe uses `border-l-[4px] border-<cat>` not a separate `::before` pseudo | Cleaner React, identical visual. |
| No blanket `text-center` on anything — editorial is left-aligned | Source uses left-align everywhere except center-stat-panel-values. |

### Copy scrub discipline

When removing invented anecdotes per `AUDIT-2026-05-21.md`:
- If a passage cannot be replaced with truth, **delete it entirely** rather than backfill with generic content.
- Section h2s stay; the prose body may be a single `<p>` placeholder linking to `WALLY.md` open questions until Wally writes the real version.
- Never use phrases like "Welcome to my portfolio," "Unlock the power of…," "Your all-in-one…" — these are slop tells.

### Classifier

The portfolio is HYBRID:
- `/` and `/about/` and `/kitchen/` lean MARKETING/EDITORIAL (brand-forward hero).
- `/projects/doorpi/`, `/projects/rodsmith/` lean APP-UI/DOCUMENT (dense, technical).
- `/endurance/` and `/writing/` are EDITORIAL (magazine register).

Apply MARKETING rules to hero areas, APP-UI rules to dense functional areas. Universal rules apply everywhere.

---

## Pass 5 — Design System Alignment (7 → 9/10)

### Phase 1 corrections (fold into Phase 2)

| Token | Current | Should be | Where |
|-------|---------|-----------|-------|
| Tag pill bg | solid `sage-surface` | alpha syntax `bg-sage/[0.06]` | `components/tag.tsx` |
| Tile bg color | missing | `tile: '#FFFCF4'` in tailwind config | `tailwind.config.ts` |
| Custom shadows | missing | `shadow-hairline`, `shadow-tile-hover` in tailwind config | `tailwind.config.ts` |
| Tile radius | missing | `rounded-tile: '10px'` in tailwind config (or `rounded-[10px]` arbitrary) | `tailwind.config.ts` |
| Eyebrow tracking | 0.16em | 0.2em (source `.eyebrow`) | `tailwind.config.ts` |
| Meta tracking | missing | `tracking-meta: 0.04em` (source `.meta`) | `tailwind.config.ts` |
| Stat-label tracking | conflated with eyebrow | `tracking-stat: 0.16em` | `tailwind.config.ts` |
| `*-surface` colors | added but unused | drop (or repurpose for band backgrounds if needed) | `tailwind.config.ts` |

### DESIGN.md — derived from `_unified.jsx`

Create `DESIGN.md` at the project root as the human-readable lookup. Sections:
- Foundation palette (paper / ink ramp + 5 category accents)
- Type stack + type ramps (eyebrow / meta / navlink / hero h1 / section h2 / body)
- Tag pill recipe + 5 category variants
- Tile component recipe (bg / border / shadow / radius / category stripe)
- Stat panel recipe (4-col grid + borders)
- Motion library (LED heartbeat, signal pulse, steam wisp, drop-cap settle, compass idle, REV stamp flip, draw-in stroke-dashoffset, sparkline bar grow)
- `prefers-reduced-motion` block

DESIGN.md cites `_unified.jsx` line numbers as the canonical source.

Write DESIGN.md during Phase 2 (ornament library), then never edit it without
also updating `_unified.jsx` in `.design-handoff/` to keep them in sync.

### Component-to-source-line index

For each ported component, the PR should reference the source line in `_unified.jsx`:

| Component | Source |
|-----------|--------|
| `<Tile>` | `_unified.jsx:62-99` (.uni .tile + ::before + .arr) |
| `<TagPill>` | `_unified.jsx:54-67` (.uni .tag + 5 variants) |
| `<StatPanel>` | `_unified.jsx:206-226` (.uni .stat-panel) |
| `<PullQuote>` | `_unified.jsx:194-204` (.uni .pull-quote) |
| `<DropCap>` | `_unified.jsx:148-159` (.uni .dropcap + settle keyframe) |
| `<Eyebrow>` / `<Meta>` | `_unified.jsx:43-50` |
| `<OrnSchematic>` | _unified.jsx ornament section (line numbers TBD when read in full during Phase 2) |
| ... | (each Orn* component lists its source line range in its TSX file's top comment) |

This makes "is this still in sync?" debuggable.

---

## Pass 6 — Responsive & Accessibility (5 → 9/10)

### Responsive: container queries

**Revised approach (from "mirror source" decision):**

- Single component per page, one render tree.
- Layout adapts via CSS container queries.
- Add `@tailwindcss/container-queries` plugin to `tailwind.config.ts`.
- Root layout adds `@container` to the main canvas div.
- Components use `@md:grid-cols-6` / `@lg:grid-cols-12` style classes.
- Breakpoints to mirror source: `@md` ~= 768px (mobile→tablet), `@xl` ~= 1100px (tablet→desktop). Tile grid: 1-col under `@md`, 2-col `@md`, 6-col `@xl`.

**Pages with the most container-query complexity (extra care during port):**
- `/endurance/` Atlas — desktop route SVGs are 880×220, mobile shrinks to ~340 wide
- `/projects/doorpi/` — desktop has 1fr-260px marginalia rail, mobile inlines marginalia cards between paragraphs

### Accessibility checklist

| Surface | Requirement |
|---------|-------------|
| Tile click-throughs | `<a href>` with `aria-label="Read more about [title]"`, NOT `<div>` |
| Filter chips on `/writing/` | `<button aria-pressed={active}>` with keyboard handlers |
| Nav | `<nav aria-label="Primary">`, current page indicated with `aria-current="page"` |
| Each page section | `<section aria-labelledby="...">` referencing its h2 |
| Touch targets | min 44×44px at 375px viewport — verify nav links + tile arrow corners |
| Honey color contrast | Darken to `#B07A2A` for ~5:1 ratio on small text |
| `prefers-reduced-motion` | Port the `@media` block from `_unified.jsx`. All keyframes pause; transitions become instant; route SVG draws to end-state immediately. |
| Focus rings | Keep `:focus-visible` from existing `globals.css` |
| Image alt text | Required for every photo; placeholder slugs become `alt="<caption>"` |
| Skip-to-content link | Add hidden-until-focus link at top of layout |

---

## Pass 7 — Unresolved Design Decisions (resolved)

| # | Decision | Choice |
|---|----------|--------|
| 1 | doorpi origin paragraph after scrub | Ship with H1 + dek + schematic only. Body prose placeholder: "Long-form writeup in progress." Real prose added when Wally writes. |
| 2 | RodSmith deep-dive in v1 | Stub page. `/projects/rodsmith/` renders the chrome + a placeholder hero. Bento tile link resolves. Real content added later. |
| 3 | `lib/` data layer | Normalized: `lib/timeline.ts` (exists) + new `lib/essays.ts` + `lib/batches.ts` + `lib/trophies.ts`. Typed entry shapes. Each page imports from its lib file. |
| 4 | Strava integration | Link-only. Each trophy section has a small `View on Strava →` link to https://strava.com/athletes/58368801. No API, no embed. |
| 5 | Resume PDF | Link from `/about/` colophon: "Resume: Walter-Chang-Resume.pdf". Existing file at repo root. |

---

## NOT in scope (deferred)

- Real essay content for `/writing/` — Wally writes 1-2 essays before launch (port unblocked).
- Real batch notes for `/kitchen/` — same.
- doorpi narrative prose — separate writing task, port-team unblocked.
- RodSmith deep-dive prose — Wally writes the origin story (per WALLY.md open Q #4).
- Strava build-time API integration (deferred to nice-to-haves).
- OG image generator (deferred).
- `sitemap.xml` + `robots.txt` (deferred — small static site).
- Photo lightbox keyboard nav refinements beyond library defaults.
- `prefers-color-scheme: dark` mode (deferred — paper editorial is the brand).
- Analytics — colophon says "none, on purpose" per source.

---

## What already exists (reuse, don't rebuild)

- `app/layout.tsx` — updated in Phase 1 (fonts: Fraunces + Inter + JetBrains Mono).
- `app/globals.css` — keep `.prose-editorial` + `.drop-cap` (will extend in Phase 2 with new ornament + tile + container-query base styles).
- `components/nav.tsx` — updated in Phase 1 (added Kitchen route).
- `components/tag.tsx` — Phase 1 done; will need bg-alpha-syntax fix per Pass 5.
- `components/footer.tsx` — keep, minor restyle later.
- `components/article-shell.tsx` — reuse for `/projects/doorpi/` + `/projects/rodsmith/` + `/writing/[slug]/`.
- `components/photo-strip.tsx` — reuse for `/endurance/` + `/kitchen/`; will wrap with lightbox in Phase 2.
- `components/stat-panel.tsx` — keep, will need atlas-style 4-col styling in Phase 2.
- `components/timeline-entry.tsx` — repurpose as row template for `/timeline/` page (Phase 9).
- `lib/timeline.ts` — keep, port may add to it.
- `lib/galleries.ts` — keep, manifest pattern preserved.
- `scripts/new-photo.mjs` — keep, `pnpm new-photo` still works.
- `tailwind.config.ts` — Phase 1 done; needs Pass 5 corrections + container-queries plugin in Phase 2.
- `next.config.mjs` — keep as-is (`output: 'export'`, `images.unoptimized: true`, `trailingSlash: true`).
- `Walter-Chang-Resume.pdf` — keep, link from `/about/` colophon.

---

## Approved mockups

The "mockups" for this design are the round-3 generated JSX files in
`.design-handoff/personal-portfolio/project/pages/`. They were iteratively
approved across rounds 1-4. No new mockups generated during this review.

| Page | Source file |
|------|-------------|
| Home | `.design-handoff/personal-portfolio/project/pages/a-home.jsx` |
| /endurance/ | `.design-handoff/personal-portfolio/project/pages/b-endurance.jsx` |
| /projects/doorpi/ | `.design-handoff/personal-portfolio/project/pages/c-doorpi.jsx` |
| /writing/ | `.design-handoff/personal-portfolio/project/pages/d-writing.jsx` |
| /about/ | `.design-handoff/personal-portfolio/project/pages/e-about.jsx` |
| /kitchen/ | `.design-handoff/personal-portfolio/project/pages/f-kitchen.jsx` |
| Design system source | `.design-handoff/personal-portfolio/project/pages/_unified.jsx` |

---

## Completion Summary

```
+====================================================================+
|         DESIGN PLAN REVIEW — COMPLETION SUMMARY                    |
+====================================================================+
| System Audit         | no DESIGN.md, _unified.jsx is canonical    |
| Step 0               | 5/10 initial, 7 focus areas confirmed       |
| Pass 1  (Info Arch)  | 7/10 → 9/10 after focal hierarchy + links  |
| Pass 2  (States)     | 5/10 → 9/10 after 4 interactions resolved  |
| Pass 3  (Journey)    | 6/10 → 8/10 after 5-sec test per page      |
| Pass 4  (AI Slop)    | 8/10 → 10/10 after discipline rules        |
| Pass 5  (Design Sys) | 7/10 → 9/10 after Phase 1 corrections      |
| Pass 6  (Responsive) | 5/10 → 9/10 after CQ + a11y + honey fix    |
| Pass 7  (Decisions)  | 5 resolved, 0 deferred-blocking            |
+--------------------------------------------------------------------+
| NOT in scope         | written (11 items)                          |
| What already exists  | written (15 items)                          |
| TODOS.md updates     | port-time scrub already captured in AUDIT   |
| Approved Mockups     | 6 JSX source files, all rounds-locked        |
| Decisions made       | 14 added to PORT-PLAN.md                    |
| Decisions deferred   | 0 design-blocking                           |
| Overall design score | 5/10 → 9/10                                 |
+====================================================================+
```

Plan is design-complete and ready for `/plan-eng-review`. The eng review will
lock the execution plan (architecture, data flow, edge cases, performance).

---

# ENG REVIEW — locked execution plan (2026-05-22)

## Architecture

### Ornament library

```
components/ornaments/
├── index.ts                  # barrel: re-export all Orn*
├── catClass.ts               # cat="rust" → "border-l-rust text-rust" helper
├── OrnSchematic.tsx          # hardware — props: width, height, compact, delay
├── OrnRevStamp.tsx           # hardware — props: rev, accent (default rust)
├── OrnLED.tsx                # hardware — props: label, color (default green)
├── OrnSparkline.tsx          # software — props: width, height, data, label, endLabel
├── OrnCommitGrid.tsx         # software — props: weeks, cat
├── OrnTenure.tsx             # software — props: items[]
├── OrnCursor.tsx             # software — props: char, blink
├── OrnBakeCurve.tsx          # kitchen — props: width, height
├── OrnCrossSection.tsx       # kitchen — props: width, height
├── OrnThumbStamp.tsx         # kitchen — props: children
├── OrnDropcap.tsx            # writing — props: letter
├── OrnPullQuote.tsx          # writing — props: children, attribution
├── OrnReadingMeter.tsx       # writing — props: progress
├── OrnEndurance.tsx          # endurance — props: kind ("route"|"whitney"|"tioga"|"race"|"timeline"), width, height, ...
├── OrnCompassRose.tsx        # endurance — props: size, accent (default rust)
├── routes/
│   ├── RouteWhitney.tsx      # large route SVG for /endurance/#whitney
│   ├── RouteTioga.tsx        # ditto Tioga
│   └── RouteIronman.tsx      # 3-leg bar diagram for Ironman split
└── PAHomeSchematic.tsx       # bespoke compact schematic for the doorpi home tile
```

Each Orn* accepts a `cat?: TagCategory` prop where applicable (some are
category-locked like `OrnSchematic` always rust, `OrnDropcap` always clay).
Category color resolution via `catClass.ts` helper that maps `'rust' →
'border-l-rust text-rust'` etc.

### Motion in `tailwind.config.ts`

All 8 keyframes go into `theme.extend.keyframes`:
- `heartbeat` (1.4s LED pulse)
- `pulse-trace` (6s signal-pulse along stroke)
- `wisp` (4s kitchen steam)
- `dropcap-settle` (700ms one-shot)
- `compass-idle` (6s loop)
- `revstamp-flip` (320ms transition, not keyframe — handled inline)
- `bar-grow` (700ms sparkline)
- `draw-in` (1.6s stroke-dashoffset draw)

Used as Tailwind utilities: `animate-heartbeat`, `animate-wisp`, etc.

Single `@media (prefers-reduced-motion: reduce)` block in `globals.css`
nullifies all `animation` + `transition` properties.

### Container queries

Add plugin:
```bash
pnpm add -D @tailwindcss/container-queries
```

Add to `tailwind.config.ts` plugins array.

Layout breakpoints:
- `@md` ~= 768px container width (mobile → tablet)
- `@xl` ~= 1100px container width (tablet → desktop)

Main canvas div in `app/layout.tsx` gets `@container` class so all descendants
can use `@md:grid-cols-6` style.

### Desktop / Mobile component split — exception for doorpi

Decision Pass 6 + Eng Review: single component per page using container
queries — EXCEPT `app/projects/doorpi/page.tsx`. The marginalia rail has DOM
structure differences (side-rail desktop ↔ intercalated cards mobile) that
container queries can't restructure.

doorpi page exports both `<DesktopDoorpi>` and `<MobileDoorpi>` and renders
both with `<div className="hidden @lg:block">` / `@max-lg:block` toggle. ~30%
larger HTML payload for this one page; acceptable.

### Dynamic routes + static export

```
app/
├── writing/
│   ├── page.tsx              # essay index
│   └── [slug]/
│       └── page.tsx          # generateStaticParams() reads lib/essays.ts
└── projects/
    └── [name]/               # CHANGED from current doorpi/-specific route
        └── page.tsx          # generateStaticParams() reads lib/projects.ts
```

Migration: existing `app/projects/doorpi/page.tsx` becomes
`app/projects/[name]/page.tsx` with switch on `name`.

Anchors (`#whitney`, `#tioga`, `#batch-41`) are just IDs on the page — no
dynamic routing needed.

### Data layer

```
lib/
├── timeline.ts               # keep, used by /timeline/ + homepage Bento input
├── galleries.ts              # keep, with width/height made required
├── trophies.ts               # NEW: Whitney + Tioga + Ironman entries
├── essays.ts                 # NEW: essay metadata (body lives in MDX)
├── batches.ts                # NEW: bake batch entries for /kitchen/
└── projects.ts               # NEW: doorpi + rodsmith stubs
```

Essay bodies live in `content/essays/*.mdx` parsed by `next-mdx-remote`. MDX
allows inline `<DropCap />`, `<PullQuote>`, `<FigSchematic />` components for
editorial features. Frontmatter holds date/title/cat/excerpt.

Type interfaces:

```ts
export type TagCategory = 'sage' | 'rust' | 'slate' | 'honey' | 'clay';

export interface Trophy {
  slug: 'whitney' | 'tioga' | 'ironman';
  kicker: string;         // "TROPHY · JULY 12–13, 2025"
  title: string;
  dek: string;
  coords: string;         // "36.5786°N · 118.2920°W · alt 14,505 ft"
  paragraphs: string[];   // 3 paragraphs of prose
  stats: TrophyStat[];
  photos: PhotoEntry[];
}
export interface TrophyStat { label: string; value: string; sub?: string; }

export interface EssayMeta {
  slug: string;
  date: string;           // ISO 'YYYY-MM-DD'
  title: string;
  hook: string;
  excerpt: string;
  cat: TagCategory;
  catLabel: string;
  wordCount: number;
  readingTime: string;    // "9 MIN"
}

export interface BatchNote {
  slug: string;
  date: string;
  number: number;         // batch #41
  kind: 'bagel' | 'pizza' | 'bread';
  hydration?: string;     // "67%"
  ferment?: string;       // "30 h cold"
  oven?: string;          // "500°F · 14 min"
  notes: string[];        // free-form
  photos: PhotoEntry[];
}

export interface ProjectMeta {
  slug: string;
  status: 'shipped' | 'ongoing' | 'stub';
  date: string;           // "APR 2026"
  title: string;
  dek: string;
  tags: string[];
  body?: string;          // MDX path; undefined for stub
}

export interface PhotoEntry {
  src: string;            // /images/<gallery>/<slug>.jpg
  alt: string;
  width: number;          // REQUIRED for CLS prevention
  height: number;
  caption?: string;
}
```

### Image pipeline

`scripts/new-photo.mjs` gets a `sharp` dependency:

```bash
pnpm add -D sharp
```

Workflow:
1. `pnpm new-photo path/to/raw.jpg` prompts for gallery/slug/alt/caption as today
2. Pipeline now: resize to max 1600px width, output `<slug>.avif`, `<slug>.webp`, `<slug>.jpg` (fallback)
3. Append entry to `lib/galleries.ts` with width/height + multi-source paths

Galleries render via `<picture>` with `<source srcset>` per format. Browser
picks AVIF if supported.

### Tests

```bash
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom axe-core jest-axe
```

Setup:
- `vitest.config.ts` with `jsdom` environment
- `vitest.setup.ts` registering `@testing-library/jest-dom` + `jest-axe`
- Per-page test: `app/__tests__/<page>.test.tsx` renders the page, asserts h1 present + key tiles render + `expect(axe(container)).toHaveNoViolations()`
- Per-component test: ornaments get snapshot tests (one per category)
- Link-integrity script: `scripts/check-links.mjs` greps all `href=` in `app/` + `lib/`, verifies each resolves to a route or external URL

Coverage target: 100% of pages render without a11y violations. Ornaments
snapshot-stable. All internal links resolve.

### Other infra

- `git init` + initial commit BEFORE any phase work. Required for Vercel deploy + branch hygiene.
- No GitHub Actions in v1. Vercel deploys auto on `git push` to main once linked.
- `app/sitemap.ts` (Next.js convention) + `app/robots.ts` — small, ship in Phase 8.

## Code Quality discipline

- Convert inline `style={{}}` from source JSX to Tailwind classes where possible.
- Keep inline style for: `fontVariationSettings`, arbitrary SVG `viewBox` numbers, `gridTemplateColumns: '1.05fr 1fr'` (Tailwind has no util).
- Strip `sage-surface`/`rust-surface`/etc. from `tailwind.config.ts` — unused after tag pills move to alpha syntax.
- Tile rendering uses `border-l-[4px] border-rust` (no `::before` pseudo).
- Never ship `console.log` or `// TODO:` in shipped code; route TODOs to `TODO.md`.

## Test plan artifact

A test plan artifact will be written to `~/.gstack/projects/<slug>/<branch>-eng-review-test-plan-<datetime>.md` after this review completes.

## Performance budget

| Metric | Target | Verification |
|--------|--------|--------------|
| Lighthouse Performance | 95+ on homepage at 4G throttle | manual `pnpm build && npx lighthouse` |
| Lighthouse a11y | 100 | jest-axe + manual |
| Lighthouse best practices | 95+ | manual |
| Lighthouse SEO | 90+ | manual (meta tags) |
| First Contentful Paint | < 1.2s | Lighthouse |
| Total Blocking Time | < 100ms | Lighthouse |
| Bundle size (per page) | < 80KB JS | `next build` output |
| Largest image | < 400KB after sharp pipeline | check `public/images/` |

## Worktree parallelization

| Lane | Phases | Notes |
|------|--------|-------|
| A | 1 → 2 | Foundation must finish first. Ornament library blocks page ports. |
| B | 3 + 9 | Homepage Bento + /timeline/ both use lib/timeline.ts. Single lane. |
| C | 4 | /endurance/ — independent once Phase 2 done. |
| D | 5 | /projects/doorpi/ + /projects/rodsmith/ stub — uses ArticleShell. |
| E | 6 | /writing/ — depends on MDX + lib/essays.ts. |
| F | 7 | /kitchen/ — depends on lib/batches.ts. |
| G | 8 | /about/ — final touch + 404 + sitemap. |

After Phase 2 lands on main: lanes C, D, E, F, G can run in parallel worktrees.
Lane B is serial. Conflict risk: `tailwind.config.ts` may be touched by
multiple lanes — keep token additions atomic per-lane.

## Failure modes

| Codepath | Realistic failure | Test? | Error handling? | User experience? |
|----------|-------------------|-------|-----------------|------------------|
| MDX parse on essay body | Malformed frontmatter / broken JSX inside MDX | jest-axe smoke + build fails | build halts on parse error | dev sees error; ship blocked. Good. |
| Image missing in `lib/galleries.ts` entry | File path typo, image not uploaded | link-integrity script | build still succeeds, browser shows broken img icon | **silent broken image** — flag as gap |
| Dynamic route slug typo (e.g., `/writing/bagel-night/` but lib has `bagels-night`) | Stale tile href | link-integrity script catches | next-build fails generateStaticParams | dev sees error |
| Container query browser too old | Safari 15 user | none | none | layout falls back to mobile flex defaults | acceptable |
| Lightbox JS fails to load | Network issue | none | Suspense boundary | photo strip becomes plain images, no lightbox open. Graceful. |
| Reduced-motion not respected | bug in animation utility | manual + axe | none | user gets unwanted motion | medium gap |

**One critical gap:** broken-image silent failure. Add a build-time check in
`scripts/check-links.mjs` that also verifies every `PhotoEntry.src` exists in
`public/`.

---

## Completion Summary — Eng Review

```
+====================================================================+
|         ENG PLAN REVIEW — COMPLETION SUMMARY                       |
+====================================================================+
| Step 0  (Scope)         | ACCEPTED AS-IS, ~30 files justified      |
| Section 1 (Architecture)| 1 genuine issue (doorpi rail) + 8 obvious|
| Section 2 (Code Quality)| 0 genuine issues, discipline rules added |
| Section 3 (Tests)       | resolved by section 1 decision (Vitest)  |
| Section 4 (Performance) | 1 gap (broken-img silent) + budget set   |
+--------------------------------------------------------------------+
| NOT in scope            | written                                  |
| What already exists     | written                                  |
| Test plan artifact      | written to ~/.gstack/projects/...        |
| Failure modes           | 1 critical gap flagged                   |
| Outside voice           | OFFERED at end (user's choice)           |
| Parallelization         | 7 lanes, A→(B,C,D,E,F,G) after Phase 2   |
| Lake Score              | 4/4 — complete options chosen everywhere |
+====================================================================+
```

---

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | skipped — scope set by 4 rounds of design iteration |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | not run — single-author personal site, low-stakes |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | CLEAR (PLAN) | 2 issues, 1 critical gap (broken-image silent failure), 4 ambiguities resolved |
| Design Review | `/plan-design-review` | UI/UX gaps | 1 | CLEAR (FULL) | score: 5/10 → 9/10, 14 decisions |
| DX Review | `/plan-devex-review` | Developer experience gaps | 0 | — | N/A — personal portfolio, no external developers |

**UNRESOLVED:** 0 across both reviews.

**VERDICT:** DESIGN + ENG CLEARED — ready to implement. Begin with Phase 1 finishing (`pnpm build` verify) → Phase 2 ornament library.

---

## Outside voice resolutions (2026-05-22)

Claude subagent ran as outside voice (codex install was broken at first attempt; fixed afterward and re-run). User reviewed cross-model tensions and decided:

| # | Outside voice push | User decision |
|---|--------------------|---------------|
| Strategic | "Trim the port" | **Stay the course.** Full PORT-PLAN as written. Beautiful code alongside beautiful design. |
| P0-1 | "Drop next-mdx-remote" | **Keep next-mdx-remote, scope to `/rsc` subpath only.** Discipline rule: never import outside RSC. |
| P0-2 | "Per-page jest-axe won't work with async RSC" | **Confirmed.** Drop per-page Vitest. Vitest for **client components + ornaments only**. Pages tested via build + manual review. |
| P0-3 | "doorpi route migration mid-port" | **Keep `app/projects/doorpi/page.tsx` as a static route in v1.** RodSmith ships as its own static route. `[name]` migration deferred until there are 3+ projects. |

**Build verified clean at end of Phase 1:** `pnpm build` produces 4 routes, 94.2KB First Load JS, all prerendered. Foundation green.

---

## Codex outside-voice corrections (2026-05-22)

After fixing the codex install (binary was missing in 0.116; upgraded to 0.133.0), a real cross-model review ran. Codex was sharper than the Claude subagent. Technical fixes applied directly to this plan:

### P0 — corrections folded in

1. **Container-query breakpoints were wrong.** `@tailwindcss/container-queries` v3 plugin defaults: `@sm`=24rem, `@md`=28rem, `@lg`=32rem, `@xl`=36rem (container-size, not viewport). My earlier `@md ~= 768px` mapping would trigger desktop layouts WAY too early.
   - **Fix:** use arbitrary container-query syntax `@[768px]:grid-cols-6` / `@[1100px]:` for the actual viewport-sized breakpoints, OR extend the plugin's `containers` token in `tailwind.config.ts` to add custom names. Use arbitrary syntax in v1 — fewer moving parts.

2. **`@max-lg:` syntax for the doorpi desktop/mobile toggle was unverified.** Plugin docs show min-container variants as primary. Max-variants exist but are less proven.
   - **Fix:** swap to two siblings with `hidden @[1024px]:block` (desktop component) + `block @[1024px]:hidden` (mobile component). Avoid `@max-*` entirely.

3. **`_unified.jsx` is an IIFE that mutates `document` at module scope** (lines 5 and 674 of source). Importing it anywhere — even in `.design-handoff/` — would break RSC.
   - **Fix:** **never `import` from `.design-handoff/`.** That directory is a frozen reference. We re-implement ornaments as TSX from scratch using the JSX as a visual spec.
   - Eslint rule: add `.design-handoff/**` to `eslintignore` and a `no-restricted-imports` rule banning the path.

### P1 — corrections folded in

4. **Lightbox needs a `'use client'` wrapper.** `<PhotoStrip>` becomes a client component; the page is still RSC. Boundary lives in `components/photo-strip.tsx`'s first line: `'use client';`.

5. **Sharp + pnpm policy.** Add to `package.json`:
   ```json
   "pnpm": {
     "onlyBuiltDependencies": ["sharp"]
   }
   ```
   Also pin `engines.node` to `>=18`. Prevents silent install failure on teammates' machines.

6. **Honey contrast fix propagation.** Source `_unified.jsx` keeps `#D4923C` — that file is frozen reference. Our Tailwind config + DESIGN.md use the AA-compliant `#B07A2A`. Document this divergence at the top of DESIGN.md so future-Wally doesn't "correct" the implementation to match the source.

7. **`PhotoEntry` model fix.** The earlier interface had `src: string` but the sharp pipeline produces three formats. Updated:

   ```ts
   export interface PhotoEntry {
     slug: string;          // 'tioga-pass-summit'
     gallery: string;       // 'endurance_tioga' — paths derived: /images/endurance_tioga/tioga-pass-summit.{avif,webp,jpg}
     alt: string;
     width: number;
     height: number;
     caption?: string;
   }
   ```
   `<picture>` constructs the three `<source srcset>` paths from `{gallery, slug}` by convention.

8. **`dynamicParams = false` is required** for `output: 'export'` with dynamic routes. Add to `app/projects/[name]/page.tsx` AND `app/writing/[slug]/page.tsx`:
   ```ts
   export const dynamicParams = false;
   export async function generateStaticParams() { ... }
   ```

### P2 — cleanups folded in

9. **Test budget inconsistency.** Eng review Pass said "jest-axe + manual" in the perf table; outside-voice resolution dropped per-page jest-axe. Updated:
   - Vitest + Testing Library + jest-axe for **client components only**: `<Nav>`, `<PhotoStrip>` (lightbox wrapper), `<FilterChips>`, ornament components that are client (`OrnCompassRose` hover state).
   - Server components tested via `pnpm build` clean + manual review.
   - `scripts/check-links.mjs` + `scripts/check-images.mjs` for content integrity.

10. **Failure modes additions:**
    - **`offset-path` degradation.** Hardware signal-pulse uses `offset-path` (~94% browser support 2026). Older browsers: pulse stays still. Acceptable. Note in DESIGN.md.
    - **Duplicate SVG `id` attributes** across ornaments would collide (e.g., `crumb-grad` in two `OrnCrossSection` instances). Prefix all SVG `<defs>` ids with the React `useId()` value per instance.
    - **Link checker blind to MDX/computed `href={...}`.** Augment with a build-time scan of generated `out/**/*.html`.

11. **Sync-theater concern on DESIGN.md** (codex pushback). PORT-PLAN says DESIGN.md cites `_unified.jsx` line numbers. After the port, the source is no longer the source — the components are. **Resolution:** DESIGN.md cites the COMPONENT file paths in `components/` as the truth, not `_unified.jsx`. The handoff source is a one-time reference, not a living spec.

---

## Cross-model tensions still open (Wally's call)

After applying technical fixes, three Codex pushbacks remain that touch user-locked decisions:

| Topic | Wally locked | Codex pushed back | Final |
|-------|--------------|-------------------|-------|
| RodSmith page | "ship stub page" | "omitted link is better than placeholder" | **Codex wins** — Bento tile becomes external link to rodsmith.app; no `/projects/rodsmith/` stub page in v1. Switches back to internal when prose lands. |
| Worktree parallelization | "stay the course" | "theater for tiny repo with shared config conflicts" | **Wally wins** — keep 7-lane parallel plan as documented. CC+gstack spawning 5-6 worktrees is fast enough that the merge cost is worth the wall-clock win. |
| MDX runtime | "keep next-mdx-remote/rsc" | "@next/mdx is the right comprehensive answer for local MDX" | **Codex wins on framing** — switch to `@next/mdx`. Essays live at `app/writing/[slug]/page.mdx`. Frontmatter via `gray-matter` + `zod`. No runtime serializer needed (no remote MDX source). Same drop-cap / pull-quote fidelity, less surface area. |

---

## Final plan state — 2026-05-22 ✅

All review passes resolved. PORT-PLAN locked. Ready to implement.

### Phase 1 finishing-touches (must land before Phase 2)

The Phase 1 work shipped earlier today set up the foundation tokens but predates the Pass 5 + codex corrections. Before Phase 2 starts, complete these in Phase 1:

1. Drop unused `*-surface` color variants from `tailwind.config.ts` (sage-surface, rust-surface, slate-surface, honey-surface, clay-surface).
2. Add `tile: '#FFFCF4'`, custom shadows (`shadow-hairline`, `shadow-tile-hover`), `borderRadius.tile: '10px'`, `tracking.eyebrow: '0.2em'` (not 0.16em), `tracking.meta: '0.04em'`, `tracking.stat: '0.16em'`.
3. Update `components/tag.tsx` to use alpha-syntax background (`bg-sage/[0.06]` etc.) instead of the dropped surface colors.
4. Honey accent foreground darkens to `#B07A2A` (WCAG AA fix).
5. Add `pnpm.onlyBuiltDependencies: ["sharp"]` to `package.json`.
6. `pnpm build` must still pass clean after each change.

### Phase order (final)

| # | Phase | Status |
|---|-------|--------|
| 0 | git init + first commit | pending — DO before Phase 1 cleanup |
| 1 | Foundation (cleanup pass) | in progress |
| 2 | Ornament library + tile primitive + lightbox client wrapper + DESIGN.md | pending |
| 3 | Homepage (time-banded Bento) | pending |
| 4 | `/endurance/` Atlas | pending |
| 5 | `/projects/doorpi/` deep-dive + rewire Bento RodSmith tile to rodsmith.app external | pending |
| 6 | `/writing/` index + first 1-2 essays in `app/writing/[slug]/page.mdx` | pending |
| 7 | `/kitchen/` image-led + first 1-2 batches | pending |
| 8 | `/about/` mixed-register + 404 + sitemap | pending |
| 9 | `/timeline/` flat-list page | pending |

### Final tech stack delta from current state

```
Added: @next/mdx, gray-matter, zod, @tailwindcss/container-queries,
       yet-another-react-lightbox, sharp (dev), vitest, @vitejs/plugin-react,
       @testing-library/react, @testing-library/jest-dom, jsdom, jest-axe
Config: package.json pnpm.onlyBuiltDependencies=["sharp"], engines.node>=18
        tailwind.config.ts plugins=[require("@tailwindcss/container-queries")]
        next.config.mjs mdxRs=true + transpilePackages for MDX
.eslintignore: .design-handoff/**
```







