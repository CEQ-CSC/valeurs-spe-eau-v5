/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Palette officielle Collectif Eau Québec (charte graphique) ──
        ceq: {
          dark:     '#222F30',  // Bleu sombre / texte principal / en-têtes
          slate:    '#434F66',  // Bleu-gris / sous-titres
          cyan:     '#63E3E5',  // Cyan-turquoise / éléments d'accent signature
          cyanDark: '#3ABFC1',  // Cyan foncé (survol)
          ice:      '#F3FAFF',  // Fond clair / cartes
          iceDark:  '#E2F2FA',  // Fond cartes légèrement plus sombre
          white:    '#FFFFFF',
          // Dimensions
          sci:      '#1A5F7A',  // Bleu scientifique
          soc:      '#2E8B57',  // Vert social
          env:      '#0D7377',  // Vert-bleu environnemental
          pol:      '#5B4B8A',  // Violet politique
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
        // On configure Montserrat pour tous les rôles typographiques
        display: ['"Montserrat"', 'sans-serif'],
        body:    ['"Montserrat"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'ceq-sm': '0 2px 8px rgba(34,47,48,0.08)',
        'ceq-md': '0 4px 20px rgba(34,47,48,0.12)',
        'ceq-lg': '0 8px 40px rgba(34,47,48,0.16)',
        'ceq-glow':'0 0 24px rgba(99,227,229,0.35)',
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