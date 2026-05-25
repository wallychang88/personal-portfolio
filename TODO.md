# TODO

Snapshot of pending work at handoff from Cowork to Claude Code. Update
this file as you go — it's the running scoreboard. When something is
done, delete the line; when blocked, prefix `**BLOCKED:**` with the reason.

Sources of truth: `WALLY.md` (bio + voice), `design-brief.md` (visual
direction), `CLAUDE.md` (architecture + conventions).

---

## Next up — sequencing

The build can't keep moving until two upstream things settle:

1. **Design returns from claude.ai/design** — paste `design-brief.md` into
   claude.ai/design, generate the homepage, bring back the result. This
   gates the project deep-dive page, /writing, and /about; they all need
   the same design tokens.
2. **Wally's open answers** — five questions at the bottom of `WALLY.md`
   (cycling specifics — partially answered; bagel setup; Cornell roster
   photo consent; RodSmith origin story; first writing-post anchor).

When both are in hand, build the rodsmith deep-dive first (highest-value
unbuilt page) → /writing index → /about → README.

---

## Blocked on design

- **`/projects/rodsmith/` deep-dive page.** Drafted plan in
  `design-brief.md` ("Content we have, ready to render" → RodSmith
  deep-dive section). Needs Wally's rod-building origin story (open
  question #4 in `WALLY.md`) before copy can be written.
- **`/writing/` index page.** Lighter than the homepage timeline — date,
  title, hook. One starter post should ship with the page so it isn't
  empty. Wally to pick the opinion (open question #5).
- **`/writing/[slug]/` post template.** Reuses `<ArticleShell>` from
  `components/article-shell.tsx`. The first post stub will inform the
  layout; build the slug page when the first post is written.
- **`/about/` page.** Bio + endurance + bagels + colophon. Visual
  direction (photo-led vs type-led, see `design-brief.md` "What I'd love
  claude.ai/design to push back on") still open.

---

## Blocked on Wally — photo uploads

Run `pnpm new-photo` for each. The CLI prompts for gallery, caption, alt.

- `endurance_whitney` — Whitney climb / camp / summit photos (3–5).
- `endurance_tioga` — Tioga Road photos (3–5; with Olivia consent if she
  appears).
- `endurance_ironman` — race-day photos (2–3).
- `baking_bagels` — the trophy bake. 3–6 shots: dough rings, boil,
  toppings, crumb cross-section, finished stack.
- `baking_pizza` — practice rounds.
- `baking_bread` — sourdough loaves, crumb shots.
- **Cornell sprint football roster photo** — Wally as #87 at
  https://cornellbigred.com/images/2023/9/14/Wally_Chang_23_crop.jpg —
  decide whether to host locally (preferred) or hot-link. If local,
  download once and add to `public/images/about/` or a dedicated
  `public/images/cornell/`.

---

## Blocked on Wally — decisions

- **Strava integration approach** (see `WALLY.md` notes + the in-chat
  discussion captured in `design-brief.md`). Four options:
  - Option 2 (build-time API) — most flexible, ~20 min OAuth setup.
  - Strava official embeds — fastest, but visually off-brand.
  - Link-only to https://www.strava.com/athletes/58368801.
  - Skip entirely.
  - Recommendation: Option 2 + recent-activities feed + race-results
    highlighted (Ironman 70.3 as a card).
- **Design direction** — A (paper / current build), B (magazine cover),
  C (inky), or hybrid. claude.ai/design output may resolve this; if it
  doesn't, the question stays open and `WALLY.md` voice + brief should
  guide the choice.
- **/endurance page structure** — one scrolling page (current) or three
  sub-pages (one per trophy). Designer may have a view; default to
  current scrolling page.

---

## IA change: /kitchen/ is its own page (2026-05-21)

Cooking + baking are being split out of `/writing/` into their own
section. Nav order is now **Index → Projects → Endurance → Kitchen →
Writing → About**. Implications:

- `/kitchen/` is image-led — small grid, big photos, short captions,
  per the WALLY.md "kitchen as patience register" framing. Bagels are
  the trophy; bread and pizza are practice.
- `/writing/` filter chips drop `Kitchen` — essays about baking still
  live in /writing/ but they're tagged, not siloed. /kitchen/ is for
  the photos + bake notes, not for essays.
- `/about/` still mentions the kitchen as part of the bio register
  (the "patience register" paragraph in WALLY.md), but the dedicated
  kitchen content moves to `/kitchen/`.
- Round 4 in Claude Design is generating the new IA — pending.

---

## Port-time copy scrub (CRITICAL)

When porting from Claude Design to the Next.js repo, **remove every
invented anecdote** that crept into the round-3 design pages. The design
canvas is allowed to read as a voice demo; the live site must only carry
ground-truth from `WALLY.md` or Wally's confirmed additions. See
`AUDIT-2026-05-21.md` for the full list. Quick reference:

- doorpi page — strip guitar / UPS man / glass-vestibule origin
  paragraph; replace marginalia stats (1,847 unlocks, 47-day uptime,
  hardware BOM, "misfired twice") with real numbers or omit.
- /endurance/ — strip "#16 elk hair caddis / brook trout" (Whitney),
  "Sharpie smudged from condensation / frostbitten thumbs" (Tioga),
  "Olmsted Point we had name…" excerpt, "smug bargain triathletes make"
  (Ironman para 3) unless Wally confirms each.
- /about/ — replace "I grew up in two states and figured out, around
  fourteen…" origin with real version or strike. **Fix Extend
  description: warranties, not payments.**
- /writing/ — 8 essay rows are placeholders. Ship with 1–2 real essays;
  remove the rest.
- a-home tiles 7 / 8 / 11 (Bagels batch #41 / "On building things you'll
  throw away" / "Tahoe-Mammoth project") — replace with real content.

---

## Design review carryovers (2026-05-25)

Audit ran on Phase 9-complete branch. Design score A−, AI slop score A.
Full report at
`~/.gstack/projects/PersonalPortfolio/designs/design-audit-20260525/design-audit.md`.

Shipped 2026-05-25:
- ~~FINDING-001 mobile nav overflow~~ (commit `21c8b95`)
- ~~FINDING-002 landmark structure~~ (commit `a0a83d0`)
- ~~FINDING-003 OrnLED desaturate~~ (commit `c1331a8`)
- ~~FINDING-004 touch targets (footer + filter-chips + see-all)~~ (commit `e2c0e66`)
- ~~FINDING-006 color-scheme: light~~ (commit `11bfd4e`)

Deferred:
- **FINDING-007 polish:** add a single ornament to `/writing/` and `/kitchen/`
  empty states so they read as anticipatory rather than under-construction.
  Holding until real content lands — the right ornament depends on what the
  first essay / first batch turns out to be.

---

## Follow-on architecture asks (2026-05-25, surfaced during design review)

- **In-app content editing interface.** Three honest paths: Tina CMS
  (polished, Vercel-native, git-based — recommended), Decap CMS (zero spend,
  git-based, scrappier), or drop `output: 'export'` for a dynamic DB-backed
  admin (breaks CLAUDE.md architectural invariant — flag before pursuing).
  Both Tina and Decap add an `/admin/` route and preserve static export.
- **Vercel hosting upgrade.** Site already deploys to Vercel as-is. The
  upgrades worth considering: `vercel.ts` typed config (replaces
  vercel.json), preview deployments per branch (free with GitHub connect),
  and Vercel Analytics (drop-in, no third-party script). All compatible
  with the static-HTML invariant. Adopting Tina/Decap above is when that
  invariant would actually bend.

---

## Phase 2 review carry-overs (2026-05-23)

Cross-model review (codex + Claude subagent) on the foundation diff
flagged these — all deferred to the right phase rather than fixed in
the Phase 2 cleanup pass.

- **Phase 3 (homepage).** Load JetBrains Mono via `next/font/google`
  in `app/layout.tsx` and either rely on the `--font-mono` CSS variable
  in ornament SVGs (currently they pass the literal "JetBrains Mono"
  family, which only renders if the font is system-installed).
- **Phase 3 (homepage).** Add `@container` to the main canvas div in
  `app/layout.tsx` so descendants can use `@[768px]:` / `@[1100px]:`
  arbitrary container-query utilities. DESIGN.md already documents
  this; the layout change is the missing piece.
- **Phase 3 (homepage).** When Bento tiles wrap ornaments, audit the
  aria-label coordination: `PAHomeSchematic` is `aria-hidden` (correct)
  but the parent Tile needs an `aria-label="doorpi — hardware project"`
  or similar so screen readers get the meaning the visual schematic
  carries.
- **Phase 4 (sharp pipeline).** Replace the current
  `Photo.src: string` shape in `lib/galleries.ts` with the
  `PhotoEntry { slug, gallery, alt, width, height, caption? }` model
  from PORT-PLAN Codex Correction #7. `<picture>` then derives the
  three `<source srcset>` paths from `{gallery, slug}` by convention.
  `scripts/check-images.mjs` will need a rewrite to match.
- **Phase 6 (writing/MDX).** Augment `scripts/check-links.mjs` with a
  post-build pass over `out/**/*.html` so computed hrefs (template
  literals, MDX expressions) get caught. Today the script only sees
  static `href="..."` string literals.

---

## Engineering hygiene before declaring done

- `pnpm build` clean (no errors, no warnings worth ignoring).
- Every `href` in `lib/timeline.ts` resolves (no broken `/projects/...`
  links once the rodsmith page lands).
- Mobile renders right at 375px. The homepage two-column timeline
  collapses; deep-dive pages stay readable.
- `<title>` and `<meta description>` set on every page (currently set on
  `/`, `/projects/doorpi`, `/endurance`; pending on rodsmith, writing,
  about).
- Empty gallery placeholders disappear once photos are uploaded — verify
  this works for at least one gallery before declaring photos done.
- A user-facing `README.md` exists for setup / dev / deploy (currently
  only `CLAUDE.md` exists — that's for AI; humans need a `README.md`
  too). Tracked as task #8.

---

## Nice-to-haves (no rush)

- Open Graph image — a single static OG card so links shared on Twitter /
  LinkedIn / Slack render with a thumbnail. Could be a generated SVG with
  serif headline; could be a single hero photo.
- `sitemap.xml` + `robots.txt` for crawlers. Next.js can generate both
  with files in `app/`.
- `/kitchen/` as a dedicated image-led page once bagel photos arrive —
  currently photos go straight onto `/about/` per `WALLY.md` framing
  ("kitchen is the patience register," separate section, not its own
  page yet).
- Light dark-mode toggle if Concept A stays as default — purely cosmetic.
- 404 page that matches the editorial register.

---

## How to keep this file useful

- Edit it at the start of every session so it reflects current state.
- When you finish something, delete the line (don't leave struck-through
  text; the doc gets unreadable).
- When you discover new work, add it under the right section.
- If the design direction is locked, remove the "Blocked on design"
  section entirely and the items underneath become normal pending work.
