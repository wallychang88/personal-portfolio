/**
 * Trophy activities — the three endurance entries Wally has picked
 * himself for the dedicated page. Single source of truth; the page
 * reads from here.
 *
 * Per AUDIT-2026-05-21.md, this file ships only WALLY.md-backed facts
 * and prose written from Wally's own voice. Invented details from the
 * round-3 design canvas (elk-hair caddis fly, "Sharpie smudged from
 * condensation", "smug bargain triathletes make", invented splits at
 * Trail Crest) are deliberately scrubbed. When Wally writes more, the
 * paragraphs grow.
 */

export type TrophySlug = 'whitney' | 'tioga' | 'ironman';

export interface TrophyStat {
  label: string;
  value: string;
  sub?: string;
}

export interface Trophy {
  slug: TrophySlug;
  /** Mono kicker over the title, e.g. "TROPHY · JULY 12–13, 2025". */
  kicker: string;
  /** Display title — leans editorial, not athletic. */
  title: string;
  /** One italic line under the title; the deck. */
  dek: string;
  /** Mono lat/long stamp in the corner. */
  coords: string;
  /** Body paragraphs. Voice: warm, specific, no embellishment past WALLY.md. */
  paragraphs: string[];
  /** 4-up stat panel beneath the prose. */
  stats: TrophyStat[];
}

export const TROPHIES: Trophy[] = [
  {
    slug: 'whitney',
    kicker: 'TROPHY · JULY 12–13, 2025',
    title: 'Mount Whitney, alpine start.',
    dek: 'Whitney Zone · Inyo National Forest · 14,505 ft',
    coords: '36.5786°N · 118.2920°W · alt 14,505 ft',
    paragraphs: [
      // Verbatim shape from WALLY.md: Day 1 walked in from Portal, camped at 12k ft, "caught some fish" at the lake; Day 2 a 2:27 AM alpine start, sunrise from the summit.
      'The 2:27 AM alarm in a tent at 12,000 ft is not philosophical — it is logistical. The crampons are already on, the headlamp is angled to land on the laces, the oatmeal is in the pot from the night before.',
      'Twelve hours earlier we had walked in from the Portal, six and a half miles to Trail Camp, and caught some fish. The fish bought us the dinner story. The route bought us the morning.',
      'Summit at sunrise, fourteen thousand five hundred feet above the Owens Valley still in shadow. I had thought I would feel triumphant. What I felt was an enormous, slow gratitude that I get to do these things at all.',
    ],
    stats: [
      { label: 'Trip distance',  value: '21.5 mi', sub: 'Portal → summit → Portal' },
      { label: 'Elevation gain', value: '6,509 ft', sub: 'over two days' },
      { label: 'High point',     value: '14,505 ft', sub: 'highest in the lower 48' },
      { label: 'Alpine start',   value: '02:27',    sub: 'tent → summit by sunrise' },
    ],
  },
  {
    slug: 'tioga',
    kicker: 'TROPHY · MAY 14, 2026',
    title: 'Tioga Road, before the cars.',
    dek: 'Yosemite National Park · Tioga Pass · 9,945 ft',
    coords: '37.9105°N · 119.2581°W · alt 9,945 ft',
    paragraphs: [
      'Once a year, for about a week, the inside of Yosemite belongs to people on bikes. The plows come through and the road is open as far as the gate, but the gate is locked: black ribbon climbing through Tuolumne Meadows that the cars have not seen since November. You ride it. There is no other way.',
      // 7:11 AM start, 51°F, clear — per WALLY.md.
      'Rolled out from Crane Flat at 7:11 in fifty-one degrees and a clear sky, and a stranger named Olivia pulled up next to me at the first switchback. A stranger at sunrise, a friend by the descent. We rode the climb together and stayed together past Tuolumne to the long drop toward Mono Lake.',
      'Tioga Pass topped out at 9,945 ft. Eighty-eight miles, seven thousand six hundred feet of climbing, and the cleanest air I have ridden through all year.',
    ],
    stats: [
      { label: 'Distance',       value: '88.4 mi',  sub: 'Crane Flat → Mono Lake' },
      { label: 'Elevation gain', value: '7,680 ft', sub: 'rolling + Tioga' },
      { label: 'High point',     value: '9,945 ft', sub: 'Tioga Pass' },
      { label: 'Moving time',    value: '6:19',     sub: '14.0 mph avg · 7:11 AM start' },
    ],
  },
  {
    slug: 'ironman',
    kicker: 'TROPHY · DECEMBER 8, 2024',
    title: 'IRONMAN 70.3 — Indian Wells.',
    dek: '5:41:08 finish · bib 212 · M18–24',
    coords: '33.7176°N · 116.2989°W · sea-level desert',
    paragraphs: [
      'The bike split is what I remember. Two hours, forty-four minutes, fifteen seconds across the desert with the Santa Rosa range pinking up to the southwest and the wind in my face for what felt, eventually, like the entire 56 miles.',
      // WALLY.md: Bike was the strongest leg by division rank (39).
      'Twenty and a half miles an hour average, thirty-ninth in my division by bike split. The kind of number that does not mean much until you find out it means something to you.',
      'Before the bike I had swum 1.2 miles in salt-tasting lake water and after it I would run a half-marathon in a temperature climbing past eighty degrees. Neither of those splits is the one I look at in the results PDF. The bike is.',
    ],
    stats: [
      { label: 'Swim',  value: '0:43:42', sub: '1.2 mi · 2:11 / 100m' },
      { label: 'Bike',  value: '2:44:15', sub: '56 mi · div rank 39 · 20.5 mph' },
      { label: 'Run',   value: '2:00:13', sub: '13.1 mi · 9:11 / mi' },
      { label: 'Total', value: '5:41:08', sub: 'div 46 · overall 714' },
    ],
  },
];

export function getTrophy(slug: TrophySlug): Trophy | undefined {
  return TROPHIES.find((t) => t.slug === slug);
}
