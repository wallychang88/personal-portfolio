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
      keyframes: {
        // Source keyframes from _unified.jsx — names match the source CSS classes.
        'draw-in':         { to: { strokeDashoffset: '0' } },
        'bar-grow':        { to: { transform: 'scaleY(1)' } },
        heartbeat: {
          '0%, 60%, 100%': { opacity: '1',    transform: 'scale(1)' },
          '30%':           { opacity: '0.45', transform: 'scale(0.85)' },
        },
        'pulse-trace':     { to: { offsetDistance: '100%' } },
        blink:             { to: { visibility: 'hidden' } },
        wisp: {
          '0%':   { opacity: '0',    transform: 'translateY(6px) scale(0.7)' },
          '30%':  { opacity: '0.45', transform: 'translateY(-4px) scale(1)' },
          '70%':  { opacity: '0.25', transform: 'translateY(-14px) scale(1.15)' },
          '100%': { opacity: '0',    transform: 'translateY(-24px) scale(1.3)' },
        },
        'dropcap-settle': {
          from: { transform: 'translateY(-6px)', opacity: '0' },
          to:   { transform: 'translateY(0)',    opacity: '1' },
        },
        'pq-rule': { to: { transform: 'scaleX(1)' } },
        'compass-idle': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%':      { transform: 'rotate(1deg)' },
        },
      },
      animation: {
        'draw-in':        'draw-in 1.6s cubic-bezier(.5,0,.2,1) forwards',
        'bar-grow':       'bar-grow 700ms cubic-bezier(.2,.7,.3,1) forwards',
        heartbeat:        'heartbeat 1.4s ease-in-out infinite',
        'pulse-trace':    'pulse-trace 6s linear infinite',
        blink:            'blink 1s steps(2, start) infinite',
        wisp:             'wisp 4s ease-in-out infinite',
        'dropcap-settle': 'dropcap-settle 700ms cubic-bezier(.2,.7,.3,1) both',
        'pq-rule':        'pq-rule 600ms cubic-bezier(.2,.7,.3,1) 0.25s forwards',
        'compass-idle':   'compass-idle 6s ease-in-out infinite',
      },
    },
  },
  plugins: [containerQueries],
};

export default config;
