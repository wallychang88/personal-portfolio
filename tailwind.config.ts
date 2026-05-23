import type { Config } from 'tailwindcss';
import containerQueries from '@tailwindcss/container-queries';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx,mdx}',
    './lib/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Editorial paper-and-ink base.
        paper: {
          DEFAULT: '#FBF8F1', // page canvas
          deep:    '#F4EFE2', // section surface
          edge:    '#E8E1CE', // hairline borders
        },
        ink: {
          DEFAULT: '#1C1B17',
          muted:   '#44423C',
          soft:    '#5C5A52',
          faint:   '#8A8678',
        },
        // Tile surface — warmer than paper. Used as solid bg on .tile cards.
        tile: '#FFFCF4',
        // 5-category accent system. Each is a single color value used as
        // foreground; tag pills derive background via alpha-syntax
        // (e.g. bg-sage/[0.06]). No surface variant.
        //   sage  → endurance
        //   rust  → hardware / projects
        //   slate → software / roles
        //   honey → kitchen (darkened from #D4923C for WCAG AA on small text)
        //   clay  → writing
        sage:  '#6B8059',
        rust:  '#A14D2A',
        slate: '#44546B',
        honey: '#B07A2A',
        clay:  '#8A6F3C',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Iowan Old Style', 'Charter', 'Georgia', 'serif'],
        sans:  ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono:  ['var(--font-mono)', 'ui-monospace', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      letterSpacing: {
        eyebrow: '0.2em',   // .uni .eyebrow in source
        meta:    '0.04em',  // .uni .meta in source
        stat:    '0.16em',  // .uni .stat-panel .l in source
      },
      borderRadius: {
        tile: '10px', // .uni .tile in source
      },
      boxShadow: {
        // .uni .tile (rest + hover)
        hairline:     '0 1px 0 rgba(28,27,23,0.04)',
        'tile-hover': '0 12px 28px rgba(28,27,23,0.11)',
      },
      maxWidth: {
        reading: '38rem',
        page:    '76rem',
        canvas:  '80rem',
      },
      // Motion lives in app/globals.css under .orn-* classes (sourced from
      // _unified.jsx). Tailwind animation utilities aren't used anywhere —
      // the CSS classes carry the keyframes + timing + reduced-motion
      // coverage. Keeping the config minimal so there's one place to look
      // when a future contributor edits motion.
    },
  },
  plugins: [containerQueries],
};

export default config;
