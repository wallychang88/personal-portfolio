# DESIGN.md — design system reference

The visual language used across every page on this site. Each section
cites a **component file path** as the source of truth — not
`_unified.jsx`, which was a one-time visual reference frozen at round 3
and not maintained from here on.

If you change a value here, update the linked component. If you change
a component, update this file.

---

## Honey divergence — read this first

The source `_unified.jsx` uses `#D4923C` for the honey accent. Our
`tailwind.config.ts` uses `#B07A2A` — darkened for WCAG AA contrast on
small text. **This is deliberate.** Do not "correct" the implementation
back to the brighter source value. The kitchen pages will still feel
warm; the contrast just stops failing axe checks.

---

## Foundation palette

`tailwind.config.ts` → `theme.extend.colors`

```
paper.DEFAULT   #FBF8F1   page canvas
paper.deep      #F4EFE2   section surface
paper.edge      #E8E1CE   hairline borders
ink.DEFAULT     #1C1B17   primary text
ink.muted       #44423C   body text
ink.soft        #5C5A52   small caps, meta
ink.faint       #8A8678   eyebrows, captions
tile            #FFFCF4   Bento tile surface — warmer than paper
```

## Category accents (5)

Single foreground hex per category; tag pills derive their background
via alpha-syntax (e.g. `bg-sage/[0.06]`). No `*-surface` variant.

```
sage    #6B8059   endurance
rust    #A14D2A   hardware / projects
slate   #44546B   software / roles
honey   #B07A2A   kitchen   (intentionally darkened — see above)
clay    #8A6F3C   writing
```

`components/ornaments/catClass.ts` exports `CAT_HEX` (hex literals for
inline SVG) and `catClasses(cat)` (Tailwind class strings: stripe / text
/ bg).

## Type stack

```
fontFamily.serif   →  Fraunces (variable, opsz)
fontFamily.sans    →  Inter
fontFamily.mono    →  JetBrains Mono
```

Wired in `app/layout.tsx` via `next/font/google` → CSS variables
`--font-serif`, `--font-sans`, `--font-mono`.

## Letter-spacing scale

`tailwind.config.ts` → `theme.extend.letterSpacing`

```
tracking-eyebrow   0.2em    .eyebrow utility — uppercase mono kicker
tracking-meta      0.04em   .meta utility — mono inline annotations
tracking-stat      0.16em   stat panel labels
```

## Type ramps

| Use | Family / variation | Size / line-height | Letter-spacing |
|---|---|---|---|
| Eyebrow | Inter 600 uppercase | 11px | `tracking-eyebrow` |
| Meta | JetBrains Mono | 11px | `tracking-meta` |
| Nav link | Inter 500 | 13px | — |
| Hero h1 | Fraunces opsz 96 wght 400 | 56–72px / 1.05 | `-0.02em` |
| Section h2 | Fraunces opsz 36 wght 500 | 26–32px / 1.2 | `-0.012em` |
| Body prose | Fraunces opsz 18 wght 400 | 17–18px / 1.65 | — |
| Stat value | Fraunces opsz 36 wght 500 | 26px / 1.05 | `-0.008em` |

Inline `fontVariationSettings` is the only way to dial Fraunces' opsz
axis — Tailwind has no utility for variable-font axes.

## Tag pill — `components/tag.tsx`

- 999px radius (`rounded-full`)
- Border + text use the accent at full hex
- Background is the accent at alpha 0.06 (or 0.07 for honey + clay)
- 3px×9px padding, 11px Inter 500, 0.01em tracking
- The `<TagRow tags cat>` variant lets a parent lock the palette;
  without `cat`, the palette rotates deterministically per-string so
  the same label always renders the same color.

## Tile primitive — `components/tile.tsx`

- `bg-tile` (#FFFCF4) ground
- 1px ink/10 border + 4px left stripe in the category accent
- `rounded-tile` (10px corner radius)
- `shadow-hairline` at rest → `shadow-tile-hover` on hover
- Hover: `-translate-y-1` + `rotate-[0.3deg]` (motion-safe only)
- Whole tile is one `<a>` (or `<Link>`); decorative arrow fades in
  on hover and never participates in the focus chain
- Bento span via `cols` (1–4) and `rows` (1–3) props

## Stat panel — `components/stat-panel.tsx`

- 4-col grid, collapses to 2 on viewports under `sm` (640px)
- Top + bottom hairlines at `ink/[0.18]`; right hairlines between
  cells at `ink/[0.12]` (skipped on the last column)
- Mono uppercase label (`tracking-stat`)
- Fraunces value (inline opsz 36 / wght 500)
- Optional mono sub line

## Filter chips — `components/filter-chips.tsx`

- `'use client'` — URL query state (`?cat=…`) wired via
  `useSearchParams` + `router.replace({ scroll: false })`
- Active chip: ink fill / paper text / ink border
- Inactive: transparent / ink-soft text / ink/[0.18] border
- Optional category dot on the left (8px) — color from `CAT_HEX`
- `<button aria-pressed>` so screen readers announce the active state

## Photo strip + lightbox — `components/photo-strip.tsx`

- `'use client'` — lightbox needs open/index state
- `yet-another-react-lightbox` for the modal; CSS co-imported
- Each thumbnail is a `<button>` opening the lightbox at its index
- `aspect-[4/3]` framed crop, motion-safe hover scale + shadow lift
- Empty galleries render an inline placeholder of the same footprint

## Motion library

CSS keyframes in `app/globals.css` (the `.orn-*` block), with shorter
Tailwind animation utilities also available via
`tailwind.config.ts → theme.extend.animation`.

| Class | What it does | Source |
|---|---|---|
| `.orn-draw` (+ `d2..d5`) | stroke-dashoffset 1400 → 0 over 1.6s | sparklines, route paths |
| `.orn-bar-grow` | scaleY(0 → 1) over 700ms, bottom-anchored | sparkline / commit / tenure bars |
| `.orn-signal-pulse` | dot rides offset-path 0% → 100% over 6s | `OrnSchematic` |
| `.orn-led` | opacity + scale heartbeat, 1.4s loop | `OrnLED` |
| `.orn-cursor` | visibility blink, 1s | `OrnCursor` |
| `.orn-steam` | translateY + scale wisp, 4s loop | `OrnBakeCurve` |
| `.orn-compass` | rotate 0–1° idle, lock to 2° on hover | `OrnCompassRose` |
| `.orn-rev-stamp` | rotate(-2deg) + flip Y on hover | `OrnRevStamp` |
| `.orn-dropcap-stamp` | translateY(-6px) + opacity settle, 700ms | `OrnDropcap` |
| `.orn-pq-rule` | scaleX(0 → 1) underline draw, 600ms | `OrnPullQuote` |

A single `@media (prefers-reduced-motion: reduce)` block in `globals.css`
disables all animations and transitions. Hover transforms snap back to
the rest state.

## Browser caveats

- `offset-path` (signal pulse) ~ 94% browser support. Older browsers
  render a static dot in place — acceptable degradation.
- Container queries are used for layout switches inside tiles +
  multi-column sections. Use **arbitrary container-width syntax**:

  ```jsx
  <div className="@container">
    <div className="grid @[768px]:grid-cols-2 @[1100px]:grid-cols-6">
  ```

  Do **not** use `@md:` / `@lg:` etc — those are container-size tokens
  (28rem / 32rem), not viewport-sized, and will trigger desktop layout
  far too early.

## Ornament library — `components/ornaments/`

| Component | Category | Used on |
|---|---|---|
| `OrnSchematic` | rust | `/projects/doorpi/` FIG. 01 hero |
| `PAHomeSchematic` | rust | homepage doorpi tile |
| `OrnRevStamp` | rust | hardware marginalia |
| `OrnLED` | rust | hardware status line |
| `OrnSparkline` | slate (or any) | software / role tiles |
| `OrnCommitGrid` | slate (or any) | software role tiles |
| `OrnTenure` | slate (or any) | role-span tiles |
| `OrnCursor` | slate | inline software accent |
| `OrnBakeCurve` | honey | `/kitchen/` featured batch |
| `OrnCrossSection` | honey | bagel / loaf renders |
| `OrnThumbStamp` | honey | batch kickers |
| `OrnDropcap` | clay | writing row kickers |
| `OrnPullQuote` | clay | inline editorial quotes |
| `OrnReadingMeter` | clay | reading-progress hints |
| `OrnEndurance` | sage | `tioga` / `whitney` / `race` / `timeline` kinds |
| `OrnCompassRose` | sage | `/endurance/` masthead |

`components/ornaments/routes/` (large route SVGs for /endurance/) will
ship during Phase 4.

`OrnCrossSection` uses `React.useId()` to namespace its `<radialGradient>`
id — multiple instances on the same page would otherwise collide on a
hard-coded id (codex P2-10 finding).

## Layout container

`app/layout.tsx`'s main canvas div carries `@container` so descendants
can use `@[…px]:` container-query utilities. Page widths cap at
`max-w-canvas` (80rem); reading columns at `max-w-reading` (38rem).

## Focus + selection

- `:focus-visible` outline at 2px solid ink, 3px offset (`globals.css`)
- `::selection` ink fill / paper text (`globals.css`)
- Tile hover lift + shadow are wrapped in `motion-safe:` so they
  disappear under reduced motion automatically
