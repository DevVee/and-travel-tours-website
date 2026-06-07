import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black:  '#111111',
          orange: '#F97316',
          gold:   '#D4A017',
          bg:     '#FFFFFF',
          text:   '#222222',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-orange': 'linear-gradient(135deg, #F97316 0%, #D4A017 100%)',
        'gradient-dark':   'linear-gradient(180deg, rgba(17,17,17,0) 0%, rgba(17,17,17,0.92) 100%)',
        'gradient-hero':   'linear-gradient(135deg, rgba(17,17,17,0.72) 0%, rgba(17,17,17,0.28) 100%)',
      },
      boxShadow: {
        'card':        '0 4px 24px rgba(0,0,0,0.08)',
        'card-lg':     '0 8px 40px rgba(0,0,0,0.14)',
        'orange':      '0 8px 32px rgba(249,115,22,0.38)',
        'gold':        '0 8px 32px rgba(212,160,23,0.32)',
        'inset-orange':'inset 0 0 0 2px #F97316',
        // Admin-specific shadows
        'admin-card':  '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
        'admin-modal': '0 20px 60px rgba(0,0,0,0.18)',
        'admin-popover':'0 8px 32px rgba(0,0,0,0.12)',
        'sidebar':     '2px 0 16px rgba(0,0,0,0.08)',
      },
      animation: {
        'ken-burns': 'kenBurns 10s ease-in-out infinite',
        'float':     'float 3.5s ease-in-out infinite',
        'pulse-glow':'pulseGlow 2.2s ease-in-out infinite',
        'fade-in':   'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        kenBurns: {
          '0%':   { transform: 'scale(1.0) translate(0%, 0%)' },
          '33%':  { transform: 'scale(1.08) translate(-1.5%, -1%)' },
          '66%':  { transform: 'scale(1.06) translate(1%, -0.5%)' },
          '100%': { transform: 'scale(1.0) translate(0%, 0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(249,115,22,0.4)' },
          '50%':      { boxShadow: '0 0 0 14px rgba(249,115,22,0)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionTimingFunction: {
        'premium':     'cubic-bezier(0.22, 1, 0.36, 1)',
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      aspectRatio: {
        'dest':  '3 / 4',
        'card':  '4 / 3',
        'hero':  '16 / 9',
      },
    },
  },
  plugins: [],
}

export default config
