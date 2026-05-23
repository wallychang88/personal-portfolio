# CLAUDE.md

Behavioral guidelines + project-specific context for any AI agent
working in this repo. Read top-to-bottom on first session; revisit when
context changes.

---

# Part I — Behavioral guidelines

Adapted from Andrej Karpathy's observations on LLM coding pitfalls
([source](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md)).
These bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think before coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

Specific to this project: **never invent biographical facts.** `WALLY.md`
is the source of truth. If a copy decision needs a fact that isn't there,
stop and ask before writing.

## 2. Simplicity first

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Senior-engineer check: would they call this overcomplicated? If yes,
simplify.

## 3. Surgical changes

**Touch only what you must. Clean up only your own mess.**

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.
- Remove imports/variables/functions YOUR changes orphaned. Leave
  pre-existing dead code alone unless asked.

The test: every changed line traces directly to the user's request.

## 4. Goal-driven execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add a writing post" → "Page renders at `/writing/{slug}/`, listed on
  `/writing/`, `pnpm build` clean."
- "Wire up rodsmith deep-dive" → "Page renders, matches existing
  ArticleShell pattern, every `href` resolves, mobile reads at 375px."
- "Restyle to Concept B" → "Tailwind tokens updated, homepage matches
  design output at desktop + 375px, no regressions on `/projects/doorpi`
  or `/endurance`."

For multi-step tasks state a brief plan:

```
1. [step] → verify: [check]
2. [step] → verify: [check]
```

Strong success criteria mean you can loop independently. Weak criteria
("make it look good") will require constant re-clarification — push for
sharper criteria up front.

---

# Part II — Project context

## What this is

A modern, hostable personal portfolio for **Walter S. ("Wally") Chang** —
data scientist at Extend, founder of RodSmith, builder of small hardware
projects (doorpi), former Cornell sprint football player, IRONMAN 70.3
finisher, home baker (bagels are the trophy).

Editorial / magazine register. NOT a startup landing page, NOT a
corporate about-us, NOT a Bootstrap-style resume.

## Source-of-truth files — read these first

| File | What's in it |
| --- | --- |
| `WALLY.md` | Canonical bio + voice brief. Identity, audience, voice register, through-line, personal threads, career arc, trophy activities, open questions. **Read before writing any copy.** |
| `design-brief.md` | The brief for claude.ai/design. Mirrors `WALLY.md` and adds visual concepts already explored (A: paper, B: cover, C: inky), explicit page asks, hard constraints. **Read before any visual change.** |
| `TODO.md` | Running scoreboard of pending work, blocked items, open questions. Update at the start and end of every session. |
| `lib/timeline.ts` | Homepage timeline data. Edit to add/edit/remove entries. Sorted newest-first by `sortDate`. |
| `lib/galleries.ts` | Photo manifest. Each gallery is an array of `{ src, alt, caption? }`. Empty arrays render an elegant placeholder. |

## Tech stack

- Next.js 14 App Router, `output: 'export'` → static HTML.
- TypeScript strict.
- Tailwind CSS v3, custom palette in `tailwind.config.ts`.
- `next/font/google` loads Fraunces (serif) + Inter (sans) as
  `--font-serif` / `--font-sans` CSS variables.

## Architecture invariants (do not break)

- `output: 'export'` must stay on. The whole site builds to plain HTML.
- `images: { unoptimized: true }`. Use `<img>`, not `next/image`.
- `trailingSlash: true`.
- No `localStorage` / `sessionStorage` on initial render — must work
  for cold opens (crawlers, recruiters).
- Mobile-first. Every layout reads at 375px.
- No animation libraries (Framer Motion / GSAP) unless explicitly
  approved by Wally.
- No client-side data fetching in production — bake at build time.

## Information architecture

```
/                      Timeline-driven homepage              (built)
/projects/doorpi/      Long-form deep-dive                   (built — drafted)
/projects/rodsmith/    Long-form deep-dive                   (pending — see TODO.md)
/endurance/            Three trophy activities, photo strips (built — galleries empty)
/kitchen/              Cooking + baking, image-led           (pending — split from /writing/ on 2026-05-21)
/writing/              Index of essays                       (pending)
/writing/[slug]/       Individual posts                      (pending)
/about/                Bio + endurance + colophon            (pending)
```

Nav order is intentional: **Index → Projects → Endurance → Kitchen →
Writing → About.** Both body registers (endurance, kitchen) sit before
the reflective ones (writing, about). Cooking and baking are deliberately
separated from /writing/ — `/kitchen/` is its own image-led page; the
Kitchen filter chip in /writing/ should be removed.

## Repo layout

```
app/
├── layout.tsx              Root layout, fonts, Nav, Footer
├── globals.css             Tailwind + .prose-editorial + drop-cap
├── page.tsx                Homepage (timeline)
├── projects/doorpi/page.tsx
└── endurance/page.tsx

components/
├── nav.tsx
├── footer.tsx
├── article-shell.tsx       Shared chrome for long-form pages
├── timeline-entry.tsx
├── tag.tsx                 Deterministic palette per tag
├── photo-strip.tsx         Gallery + empty-state placeholder
└── stat-panel.tsx          4-column stat block

lib/
├── timeline.ts
└── galleries.ts

scripts/
└── new-photo.mjs           `pnpm new-photo` interactive helper

public/images/{gallery}/    Photos referenced by lib/galleries.ts
```

## Design tokens (current — Concept A "paper editorial")

```
paper.DEFAULT  #FBF8F1   canvas
paper.deep     #F4EFE2   section surface
paper.edge     #E8E1CE   hairline
ink.DEFAULT    #1C1B17   primary text
ink.muted      #44423C   body text
ink.soft       #5C5A52   small caps, meta
ink.faint      #8A8678   eyebrows, captions

clay   #EBE5D4 / #6E5A1F   ┐
sage   #E5EAE0 / #4B5A35   │
cocoa  #EAE2DC / #6B4A3B   │  tag-pill palettes
slate  #E2E6EC / #314156   │  (deterministic per tag string)
rust   #F0E2D9 / #7A3E1F   ┘
```

Subject to change when Wally returns from `claude.ai/design`. Update
`tailwind.config.ts` first, then propagate.

## Conventions

### Adding a timeline entry — edit `lib/timeline.ts`

```ts
{
  sortDate: '2026-05-14',           // ISO; sort only
  date: 'May 2026',                 // displayed
  kind: 'milestone',                // project | writing | role | coursework | milestone
  kindLabel: 'Endurance · trophy day', // optional caption under date
  title: 'Tioga Road, before the cars.',
  hook: '…',                        // 2–3 sentences, punchy
  tags: ['Cycling', 'Sierras'],
  href: '/endurance/',              // optional
  external: false,
}
```

### Adding a photo

`pnpm new-photo` is the reliable path. Prompts for path, gallery,
slug, caption, alt. Copies into `public/images/` and appends to
`lib/galleries.ts`. Hand-editing both is fine if you prefer.

### Writing copy

- Voice: warm, narrative, essayistic. Paul Graham / Maggie Appleton
  register. Sentences breathe.
- NOT: dry (Dan Luu), jokey, founder-confident-bro, embellished.
- See `WALLY.md` "Voice & tone" for the full brief.

### Long-form prose

- Wrap with `<ArticleShell>` (kicker / title / dek / meta / tags / back).
- Children render inside `.prose-editorial` — H2/H3 typography, code
  block treatment, drop-cap utility, ornamental `· · ·` hr.
- First paragraph: `<p className="drop-cap">…</p>`.
- Pull-quotes: `<blockquote>` — serif italic, 2px left rule.

## Build / dev / deploy

```bash
pnpm install
pnpm dev        # localhost:3000
pnpm build      # → ./out/ (static HTML)
pnpm new-photo  # add a photo to a gallery
pnpm lint
```

Deploys to Vercel, Netlify, GitHub Pages, S3+CloudFront — anywhere
that serves static files.

## Cross-file propagation

When you change one of these, search the codebase for the others:

- New timeline `kind` → `TimelineKind` type (`lib/timeline.ts`) +
  `components/timeline-entry.tsx` rendering.
- New gallery id → `GalleryId` type (`lib/galleries.ts`) + the
  hardcoded allow-list in `scripts/new-photo.mjs`.
- Tailwind token change → `globals.css` `.prose-editorial` styles may
  reference colors directly via `theme()`.

## Safety

- NEVER read or print `.env*` files, secrets, credentials.
- NEVER commit `.env*`. Gitignored.
- NEVER push to `main` directly. Branch, PR.
- NEVER invent biographical facts. `WALLY.md` is the source of truth;
  if a fact isn't there, ask.
- If a fact in `WALLY.md` looks stale (job changes, race results),
  flag it — don't silently update.

## When in doubt

Default to: edit `WALLY.md` or `design-brief.md` to capture context
first, then make the code change. The doc files are the lasting
artifact; the code expresses them.
