# Design brief — Wally Chang personal portfolio

A self-contained prompt for **claude.ai/design** (or any designer). Paste
the whole document; it includes the audience, voice, content structure,
explicit page asks, and three already-explored visual directions to react
to.

---

## What this is

A modern, hostable personal portfolio for **Walter S. ("Wally") Chang** —
data scientist at Extend, founder of RodSmith (a custom fishing-rod
marketplace), engineer of small hardware projects (doorpi), former Cornell
sprint football player, IRONMAN 70.3 finisher, and a serious home baker
specializing in bagels.

The site is a "working notebook" — it documents projects, writing, and
milestones over time. It is NOT a startup landing page, NOT a corporate
about-us, and NOT a Bootstrap-style resume site.

---

## Primary audience

**Future employers and recruiters.** Wally is not actively job-hunting,
but the site should credentialize him fast and read as the work of a
person with **range** (PE → ML research → DS → founder → builder).
Secondary audience: RodSmith customers and other founders/engineers.

---

## Voice and one-line takeaway

- **Voice**: warm, narrative, essayistic — Paul Graham / Maggie Appleton
  register. Sentences breathe. Personal even when discussing work. NOT
  dry, NOT jokey, NOT founder-confident-bro.
- **One-line takeaway** for any visitor: *"this person is interesting."*
  Range first, depth second. The portfolio is a profile, not a resume.

---

## Information architecture

Five pages, all served from the same site:

1. **`/` (homepage)** — a timeline. Hero (eyebrow + serif headline + one
   short intro paragraph) above a reverse-chronological list of entries.
   Each entry has: a date column (e.g. "May 2026"), a kind label
   (Project · shipped, Endurance · trophy day, Role · founder), 2–4 tag
   pills, a serif title, and a 2–3-sentence hook. Some entries link out
   to deep-dive pages; some are headline-only (degrees, race results,
   role changes).
2. **`/projects/{slug}/`** — long-form editorial deep-dive pages for
   individual projects. Currently planned: **doorpi** (hardware) and
   **RodSmith** (marketplace). Editorial pacing: drop-cap intro, H2
   section breaks, code blocks rendered as a dark band, pull-quotes
   with serif italic + 2px left rule, ornamental section break
   ("· · ·"), footnote-style links at the bottom.
3. **`/endurance/`** — three "trophy" activities in a single page.
   Each gets: a kicker ("Trophy · July 2025"), a serif title, an
   italic subtitle (date + location), 2–3 paragraphs of editorial copy,
   a four-column stat panel (e.g. distance · elevation · highest point
   · day-2 start), and a photo strip below (3–5 images). Three
   trophies in order: Mt. Whitney (the story), Tioga Road (the day),
   IRONMAN 70.3 (the result).
4. **`/writing/`** — index of essays, mixed topics (project
   postmortems, baking notes, cycling adventures, occasional opinion).
   Each entry: date, title, hook. Tagged but not siloed.
5. **`/about/`** — bio, contact, colophon. Should include endurance
   identity (Cornell sprint football → IRONMAN), baking identity
   (bagels), and the through-line of the career arc. Last page in nav;
   the rest of the site is the real "about."

A `/kitchen/` page (bagels + pizza + bread, image-led) is a likely
follow-on. Keep room for it.

---

## What's already built (current state)

A Next.js 14 implementation with `output: 'export'` lives in the repo
already. Pages built: homepage, /projects/doorpi, /endurance. Components:
`Nav`, `Footer`, `TimelineEntryRow`, `Tag`, `PhotoStrip`, `StatPanel`,
`ArticleShell`. A `pnpm new-photo` CLI helper lets Wally drop images into
the right folders and update a manifest.

**Current visual direction (call it "Concept A"):**

- **Palette**: warm paper background `#FBF8F1`, ink `#1C1B17`, muted
  `#44423C`, soft `#5C5A52`, faint `#8A8678`. Paper-deep section
  surface `#F4EFE2`, hairline border `#E8E1CE`. Tag pills use earthy
  ramps — clay `#EBE5D4/#6E5A1F`, sage `#E5EAE0/#4B5A35`, cocoa
  `#EAE2DC/#6B4A3B`, slate `#E2E6EC/#314156`, rust `#F0E2D9/#7A3E1F`.
- **Type**: Fraunces (variable, opsz axis) for display + section
  labels + numerals in stat panels. Inter for UI + body copy. Headlines
  44–56px on the homepage, 36–42px on deep dives. Body 17px at
  line-height 1.72 in long-form. Eyebrows 11px uppercase letter-spacing
  0.14em.
- **Components**: timeline rows are a `100px/1fr` grid (date column +
  content column), separated by 0.5px borders. Tag pills are
  pill-shaped, 11px, deterministic palette per tag. Stat panels are
  four-column grids with serif numerals at 26–28px above small-caps
  labels.

---

## Three concepts already explored

For context — claude.ai/design should feel free to depart from these,
but knowing the landscape helps.

- **Concept A — refined paper editorial.** What's built. Warm, readable,
  intimate. The safe, thoughtful choice. Cozy notebook energy.
- **Concept B — magazine cover.** Bigger entry: a "Vol. 1 / Issue N°007"
  masthead, oversized 64px headline that wraps three lines, declarative
  voice. The timeline becomes "In this issue" with numbered entries.
  Distinctive and confident; slight risk of performativity.
- **Concept C — inky / literary press.** Same editorial bones but on a
  near-black canvas `#161412` with cream type `#F5ECD8` and muted bronze
  accent `#B8916A`. Sophisticated, taste-forward. Slight readability
  tradeoff on long-form.

Wally has not picked a final direction. **Open question** for the
designer: refine Concept A, push to B, push to C, or propose Concept D
that none of us thought of.

---

## Content we have, ready to render

### Homepage timeline entries (newest first)

- **May 2026 · Endurance · trophy day** — *Tioga Road, before the cars.*
  88 miles through Yosemite on the opening weekend before the road
  reopens to traffic. A stranger at sunrise, a friend by the descent.
  → `/endurance/`
- **Apr 2026 · Project · shipped** — *doorpi — a door that knows my face
  and waits for a peace sign.* Pi Zero + ESP32 + MediaPipe + face
  recognition. The hard parts were V4L2 quirks and an auto-exposure
  controller that didn't punish backlight. → `/projects/doorpi/`
- **Fall 2025 → · Role · founder** — *RodSmith — knowledge-first
  marketplace for custom fishing rods.* Started in fall 2025 with
  customer discovery; code repo initialised early 2026. Contract-first
  architecture, Stripe Connect, an AI pipeline that turns PDF spec
  sheets into structured parts. → `/projects/rodsmith/`
- **Jul 2025 · Endurance · trophy day** — *Mount Whitney, alpine start.*
  6.5 mi to camp at 12,000 ft, trout from the alpine lake, 2:27 AM
  summit push, sunrise on the 14,505-ft summit. → `/endurance/`
- **May 2025 → · Role · current** — *Data Scientist at Extend.* Pricing
  and risk models for Peloton, Oura, Sonos, Michaels, Advance Auto
  Parts. $600K+ incremental revenue.
- **Dec 2024 · Endurance · race result** — *IRONMAN 70.3 Indian Wells —
  5:41:08.* Bike was the strongest leg, div rank 39. → `/endurance/`
- **Aug 2024 — May 2025 · Role** — *Private Equity Analyst at Carrick
  Capital Partners.* Cyber + GRC; built an internal market-map ranking
  tool that cut analysis time ~80%.
- **May 2024 · Milestone** — *MPS Data Science, Cornell Bowers CIS, 3.99
  GPA.*
- **Apr 2024 · Coursework · STSCI 5610** — *Re-pricing two bank stocks
  through the 2008 crisis.* Rolling-window CAPM in R.
- **Feb–May 2024 · Research · led 8 engineers** — *AmEx — label-noise
  mitigation for transformer support-ticket routing.* HDBSCAN + Louvain
  + LSTM.
- **2021–2024 · Endurance · varsity** — *Three seasons on Cornell Sprint
  Football (#87).* The 178-lb-cap collegiate league, played by nine
  schools. Wide receiver all three years; All-CSFL Academic honors as
  senior.
- **Dec 2023 · Milestone** — *BS Information Science, Cornell CALS,
  magna cum laude, 3.88 GPA.*
- **Fall 2023 · Coursework · INFO 6350** — *Text-mining the American
  film canon — 359 movie subtitle files.*
- **Fall 2023 · Independent research · INFO 4900** — *BERT-based date
  prediction on a corpus of Morning Brew newsletters.*
- **Summer 2023 · Intern** — *PE intern at Carrick Capital Partners.*
- **Summer 2022 · Intern** — *PwC — operational strategy for
  CareerVillage. 2nd of 70+ in firm case comp.*

### Trophy activities (the /endurance page)

1. **Mt. Whitney summit · July 12–13, 2025.** 21.5 mi · 6,509 ft gain ·
   summit 14,505 ft · alpine start 2:27 AM · trout at the 12,000-ft camp.
   Lead with the story.
2. **Tioga Road · May 14, 2026.** 88.4 mi · 7,680 ft · 6:19:55 moving
   time · 42.9 mph max · Strava "Historic Relative Effort" 273. Lead
   with the photography and the new friend (Olivia Duff).
3. **IRONMAN 70.3 Indian Wells · Dec 8, 2024.** 5:41:08 finish (swim
   0:43:42 / T1 0:06:20 / **bike 2:44:15, div rank 39** / T2 0:06:38 /
   run 2:00:13). Lead with the performance.

### doorpi deep-dive (already drafted in `app/projects/doorpi/page.tsx`)

Sections: opening (vestibule problem), architecture (three-machine
split), Pi's job (V4L2, MJPEG, bandwidth), auto-exposure rewrite
(percentiles not means, native auto first, CLAHE on recognition input),
loiter detector (two thresholds), what I'd tell someone starting
(synthetic probe).

### RodSmith deep-dive (not yet drafted, designer can stub)

Key beats to plan around: Wally fishes and builds rods himself —
the founder is the customer. Three transaction paths (commission,
made-to-order, in-stock). Contract-first architecture as a working
discipline. AI catalog-extraction pipeline. Knowledge-first, commerce
second.

---

## Asset notes

- **No photos uploaded yet.** Photo galleries currently render an
  elegant placeholder ("Photos coming soon · drop into public/images/
  · run pnpm new-photo"). Wally will provide images for endurance
  (Whitney, Tioga, IRONMAN) and baking (bagels, pizza, bread).
- **A Cornell sprint football roster photo** exists at
  https://cornellbigred.com/images/2023/9/14/Wally_Chang_23_crop.jpg
  — Wally as #87 in the Cornell jersey. Pending consent to host
  locally.
- **Strava integration** — not built yet. Wally is undecided between
  static embeds, a build-time API integration that bakes recent
  activity into the static export, or skipping it entirely. The
  Strava profile is https://www.strava.com/athletes/58368801.

---

## Hard constraints

- **Hostable as static HTML.** The Next.js app uses `output: 'export'`.
  No server runtime in production. Any design must work without
  client-side data fetching (or fetch only public CDN-allowed
  resources).
- **Mobile-first matters.** Recruiters open links on phones. The
  homepage two-column timeline collapses to a single column under
  640px; whatever the final design does, it should not require a
  desktop to be readable.
- **No dependency bloat.** Stay on Next.js + Tailwind + system fonts
  (or one Google Font pair). No Framer Motion / GSAP / Three.js unless
  the design requires it and the user explicitly agrees.

---

## Explicit asks for claude.ai/design

In order of usefulness for unblocking the build:

1. **Homepage hero + timeline layout.** Pick or hybridize among Concept
   A / B / C. Show the hero, the timeline section header, and 3–4
   timeline entries at desktop and mobile widths.
2. **Project deep-dive page layout.** Specifically the doorpi page:
   header (kicker / serif title / italic dek / meta + tags), prose
   block, pull-quote, code block, ornamental divider, footnotes.
3. **`/endurance/` page layout.** A trophy-activity block: kicker,
   serif title, italic subtitle, prose, four-stat panel, photo strip.
4. **`/about/` page layout.** Bio + endurance + bagel sections + a
   colophon. Image-led where helpful.
5. **`/writing/` index.** Lighter than the homepage timeline — just
   date, title, hook.

For each, ship: typography (font, size, weight, line-height), color
(background, ink, accents), spacing rhythm, and ideally a tokens table
(`--color-ink-primary`, etc.) so the implementation can be a
mechanical port.

---

## What I'd love claude.ai/design to push back on

- Whether Fraunces is the right display face. (Considered: Source
  Serif, Tiempos, Iowan Old Style native stack.)
- Whether the two-column date / content timeline is the right primitive
  or if a single-column with inline date works better at narrow
  widths.
- Whether the three trophy activities on `/endurance/` should be a
  single scrolling page or three separate sub-pages.
- Whether `/about/` should lean photo-led (portrait + scenic) or
  type-led (essay).

---

## Tokens currently in use (Tailwind config + globals.css)

```
colors:
  paper.DEFAULT:  #FBF8F1
  paper.deep:     #F4EFE2
  paper.edge:     #E8E1CE
  ink.DEFAULT:    #1C1B17
  ink.muted:      #44423C
  ink.soft:       #5C5A52
  ink.faint:      #8A8678
  clay.50/700:    #EBE5D4 / #6E5A1F
  sage.50/700:    #E5EAE0 / #4B5A35
  cocoa.50/700:   #EAE2DC / #6B4A3B
  slate.50/700:   #E2E6EC / #314156
  rust.50/700:    #F0E2D9 / #7A3E1F
type:
  serif:          Fraunces (var, opsz)
  sans:           Inter (var)
spacing:
  reading max:    38rem
  page max:       76rem
  eyebrow track:  0.14em
```

If claude.ai/design proposes a new palette or type system, that's
welcome — I can refit the tokens.

---

## Use this brief like this

1. Paste this entire document into claude.ai/design.
2. Ask it to design the **homepage** first (most important page;
   sets the tone for everything else).
3. Share the result back; we'll port it into the Next.js code.
4. Iterate page by page (project deep-dive next, then endurance,
   then about, then writing index).

Faster than designing in code; one source of truth across screens.
