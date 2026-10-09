/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Palette officielle Collectif Eau Québec (charte graphique) ──
        ceq: {
          dark:     '#222F3D',
          slate:    '#394F66',
          cyan:     '#C7D8E5',
          cyanDark: '#71899D',
          ice:      '#F4F7F9',
          iceDark:  '#E4EBF0',
          white:    '#FFFFFF',
          // Dimensions
          sci:      '#244C66',
          soc:      '#536D81',
          env:      '#607C91',
          pol:      '#899DAD',
          // Niveaux de confiance
          confHigh:   '#2E8B57',
          confMed:    '#D97706',
          confLow:    '#DC2626',
          confNone:   '#94A3B8',
          // Alertes
          success:  '#D1FAE5',
          warning:  '#FEF3C7',
          error:    '#FEE2E2',
        },
      },
      fontFamily: {
        display: ['"Owners Narrow"', '"Arial Narrow"', 'sans-serif'],
        body:    ['Owners', 'Arial', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'ceq-sm': '0 2px 8px rgba(34,47,61,0.05)',
        'ceq-md': '0 8px 24px rgba(34,47,61,0.08)',
        'ceq-lg': '0 12px 34px rgba(34,47,61,0.12)',
        'ceq-glow':'0 0 24px rgba(113,137,157,0.2)',
      },
      animation: {
        'fade-up':  'fadeUp 0.5s ease-out both',
        'fade-in':  'fadeIn 0.3s ease-out both',
        'bar-grow': 'barGrow 0.8s ease-out both',
        'pulse-slow':'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeUp:  { from:{opacity:0,transform:'translateY(16px)'}, to:{opacity:1,transform:'none'} },
        fadeIn:  { from:{opacity:0}, to:{opacity:1} },
        barGrow: { from:{width:'0%'}, to:{} },
      },
    },
  },
  plugins: [],
};