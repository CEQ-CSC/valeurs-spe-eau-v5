import './globals.css'

export const metadata = {
  title: 'Calculateur de valeur SPE-Eau V5 | Collectif Eau Québec',
  description: "Outil bilingue d'évaluation multidimensionnelle de la valeur des projets de science participative de l'eau — économique, scientifique, sociale, environnementale, politique. V5 — Collectif Eau Québec / G3E-EWAG.",
  keywords: 'science participative, eau, Québec, SROI, MCDA, OBV, Collectif Eau Québec, G3E-EWAG',
  authors: [{ name: 'Collectif Eau Québec / G3E-EWAG' }],
  openGraph: {
    title: 'Calculateur de valeur SPE-Eau V5 | Collectif Eau Québec',
    description: "Évaluez la valeur multidimensionnelle de votre projet de science participative de l'eau.",
    url: 'https://valeur-spe-eau.vercel.app',
    siteName: 'Collectif Eau Québec',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Calculateur SPE-Eau CEQ V5' }],
    locale: 'fr_CA',
    type: 'website',
  },
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-ceq-ice font-body antialiased">
        {children}
      </body>
    </html>
  )
}
