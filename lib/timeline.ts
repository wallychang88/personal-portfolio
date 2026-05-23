/**
 * The timeline. Edit this file to add, edit, or remove entries on the
 * homepage. Entries are sorted newest-first automatically.
 *
 * Each entry can be one of:
 *   - "project"   — something I built; usually links to a deep-dive page
 *   - "writing"   — an essay or opinion piece (lives under /writing)
 *   - "role"      — a job or major engagement
 *   - "coursework"— academic projects and final papers
 *   - "milestone" — degrees, talks, anything notable but not a project
 */

export type TimelineKind =
  | 'project'
  | 'writing'
  | 'role'
  | 'coursework'
  | 'milestone';

export interface TimelineEntry {
  /** ISO date used for sorting; display date is whatever you put in `date`. */
  sortDate: string;
  /** What the reader sees in the date column, e.g. "Apr 2026" or "Spring 2024". */
  date: string;
  kind: TimelineKind;
  /** Small label under the date, e.g. "Project · ongoing". Optional. */
  kindLabel?: string;
  title: string;
  /** One- to three-sentence hook. Keep it punchy. */
  hook: string;
  tags: string[];
  /** Internal route or external URL. Omit for headline-only entries. */
  href?: string;
  /** If true, link opens in a new tab. */
  external?: boolean;
}

export const TIMELINE: TimelineEntry[] = [
  {
    sortDate: '2026-05-14',
    date: 'May 2026',
    kind: 'milestone',
    kindLabel: 'Endurance · trophy day',
    title: 'Tioga Road, before the cars.',
    hook:
      'Yosemite, opening day of the road over Tioga Pass — the few-day window every spring after Caltrans plows it clear and before it reopens to traffic. 88 miles, 7,680 feet of climbing, a stranger at sunrise who became a friend by the descent.',
    tags: ['Cycling', 'Sierras'],
    href: '/endurance/',
  },
  {
    sortDate: '2026-04-26',
    date: 'Apr 2026',
    kind: 'project',
    kindLabel: 'Project · shipped',
    title:
      'doorpi — a door that knows my face and waits for a peace sign',
    hook:
      'A Raspberry Pi, an ESP32, and a face-recognition stack walked into my building’s vestibule. The hard parts weren’t the computer vision — they were V4L2 quirks, bandwidth budgets on a Pi Zero’s 2.4 GHz radio, and an auto-exposure controller that didn’t punish backlit visitors.',
    tags: ['Hardware', 'Computer vision', 'Python', 'FastAPI'],
    href: '/projects/doorpi/',
  },
  {
    sortDate: '2025-10-01',
    date: 'Fall 2025 →',
    kind: 'role',
    kindLabel: 'Role · founder',
    title: 'RodSmith — knowledge-first marketplace for custom fishing rods',
    hook:
      'Started in the fall of 2025 with customer discovery — charter captains, anglers, and builders — and grew into a platform. Custom rod builders are artisans without a homepage; RodSmith turns specifications into shared language, reputation into transparency, and commerce into something that happens after trust. Contract-first architecture, Stripe Connect, an AI catalog-extraction pipeline that turns PDF spec sheets into structured parts.',
    tags: ['Marketplace', 'Next.js', 'Stripe Connect', 'Postgres', 'AI'],
    href: '/projects/rodsmith/',
  },
  {
    sortDate: '2025-07-12',
    date: 'Jul 2025',
    kind: 'milestone',
    kindLabel: 'Endurance · trophy day',
    title: 'Mount Whitney, alpine start.',
    hook:
      'Two days in the Whitney Zone: 6.5 miles up to a camp at 12,000 feet, trout from the lake next to the tent, a 2:27 AM summit push, sunrise on the 14,505-foot summit, and twelve hours back to the trailhead. 21 miles round trip; 6,500 feet of climbing; one night of sleep at altitude.',
    tags: ['Hiking', 'Sierras'],
    href: '/endurance/',
  },
  {
    sortDate: '2025-05-01',
    date: 'May 2025 →',
    kind: 'role',
    kindLabel: 'Role · current',
    title: 'Data Scientist at Extend',
    hook:
      'Pricing and risk models for extended warranties, deployed across Peloton, Oura Ring, Sonos, Michaels, and Advance Auto Parts. $600K+ in incremental net revenue from pricing and term optimizations. Behavioral-economics-shaped test design; Bayesian, frequentist, and quasi-experimental evaluation.',
    tags: ['Pricing', 'Causal inference', 'Bayesian', 'SQL'],
  },
  {
    sortDate: '2024-08-01',
    date: 'Aug 2024 — May 2025',
    kind: 'role',
    kindLabel: 'Role',
    title: 'Private Equity Analyst at Carrick Capital Partners',
    hook:
      'Covered cybersecurity and GRC. Built an internal tool that ranks investment prospects from market maps; analysts used it to prioritize sourcing and it set up three meetings at the RSA Conference. Cut analysis time by roughly 80%.',
    tags: ['PE', 'Cybersecurity', 'Internal tools'],
  },
  {
    sortDate: '2024-12-08',
    date: 'Dec 2024',
    kind: 'milestone',
    kindLabel: 'Endurance · race result',
    title: 'IRONMAN 70.3 Indian Wells — 5:41:08.',
    hook:
      '1.2-mile swim, 56-mile bike, 13.1-mile run, in that order, with two transitions in between. The bike was the strongest leg by margin — 2:44:15, division rank 39. A peak, not an experiment.',
    tags: ['Triathlon', 'IRONMAN 70.3'],
    href: '/endurance/',
  },
  {
    sortDate: '2024-05-01',
    date: 'May 2024',
    kind: 'milestone',
    title:
      'MPS Data Science, Cornell Bowers CIS — graduated, 3.99 GPA',
    hook:
      'One-year Master’s after the BS. The interesting work was AmEx ML research and the financial-crisis risk project; the rest was the rigor that lets you read a paper without bluffing.',
    tags: ['Cornell', 'MPS'],
  },
  {
    sortDate: '2024-04-01',
    date: 'Apr 2024',
    kind: 'coursework',
    kindLabel: 'Coursework · STSCI 5610',
    title: 'Re-pricing two bank stocks through the 2008 crisis',
    hook:
      'Rolling-window CAPM in R: alpha, beta, and statistical tests of market-relative performance for Goldman Sachs and JPMorgan through the worst of 2008. The fun was watching beta of an investment bank go from "diversifiable" to "the entire market is the bank" in three months.',
    tags: ['R', 'Risk modeling', 'CAPM'],
  },
  {
    sortDate: '2024-02-01',
    date: 'Feb — May 2024',
    kind: 'project',
    kindLabel: 'Research · led 8 engineers',
    title:
      'AmEx — label-noise mitigation for transformer support-ticket routing',
    hook:
      'A research-literature-driven pipeline that combined HDBSCAN, Louvain community detection, and an LSTM to find and correct mislabeled training data in a multiclass transformer. Reduced high-confidence misclassifications in production routing; I led the eight-person team.',
    tags: ['ML research', 'HDBSCAN', 'LSTM', 'NLP'],
  },
  {
    sortDate: '2023-12-01',
    date: 'Dec 2023',
    kind: 'milestone',
    title:
      'BS Information Science, Cornell CALS — magna cum laude, 3.88 GPA',
    hook:
      'Information Science with a Business minor. Independent research in text mining; a lot of late nights in Gates Hall.',
    tags: ['Cornell', 'BS'],
  },
  {
    sortDate: '2023-11-30',
    date: '2021 — 2024',
    kind: 'milestone',
    kindLabel: 'Endurance · varsity',
    title: 'Three seasons on Cornell Sprint Football (#87).',
    hook:
      'The 178-lb-weight-cap collegiate league, played by exactly nine schools. Defensive back as a sophomore, wide receiver junior and senior years; six games and All-CSFL Academic honors as a senior. The receipt for everything I do now.',
    tags: ['Cornell', 'Sprint football'],
    href: 'https://cornellbigred.com/sports/sprint-football/roster/wally-chang/73826',
    external: true,
  },
  {
    sortDate: '2023-11-01',
    date: 'Fall 2023',
    kind: 'coursework',
    kindLabel: 'Coursework · INFO 6350',
    title:
      'Text-mining the American film canon — 359 movie subtitle files',
    hook:
      'For Text Mining History and Literature, I scraped and processed 359 movie .srt files and ran clustering + sentiment analysis on the corpus. Most of the project was cleaning subtitle files into something the analysis could actually trust.',
    tags: ['NLP', 'Clustering', 'Data wrangling'],
  },
  {
    sortDate: '2023-10-01',
    date: 'Fall 2023',
    kind: 'coursework',
    kindLabel: 'Independent research · INFO 4900',
    title:
      'BERT-based date prediction on a corpus of Morning Brew newsletters',
    hook:
      'Scraped two years of Morning Brew, hand-rolled the dataset, and fine-tuned BERT to predict newsletter date from sentiment and topical features. Mostly an excuse to learn what fine-tuning actually feels like at small scale.',
    tags: ['BERT', 'Newsletter scraping', 'Sentiment analysis'],
  },
  {
    sortDate: '2023-06-01',
    date: 'Summer 2023',
    kind: 'role',
    kindLabel: 'Role · intern',
    title: 'Private Equity Intern at Carrick Capital Partners',
    hook:
      'First exposure to software investing. Financial modeling, market research, expert calls. Got asked back full-time the following year.',
    tags: ['PE', 'Modeling'],
  },
  {
    sortDate: '2022-06-01',
    date: 'Summer 2022',
    kind: 'role',
    kindLabel: 'Role · consulting intern',
    title: 'PwC — operational strategy for CareerVillage',
    hook:
      'Helped CareerVillage improve student-question to professional-response matching efficiency. Side quest: led a team to 2nd place out of 70+ in PwC’s firmwide consulting case competition, presenting to a Partner panel.',
    tags: ['Consulting', 'Operations'],
  },
];

/** Sorted newest-first. The homepage and any other consumer should use this. */
export const TIMELINE_SORTED = [...TIMELINE].sort((a, b) =>
  b.sortDate.localeCompare(a.sortDate),
);
