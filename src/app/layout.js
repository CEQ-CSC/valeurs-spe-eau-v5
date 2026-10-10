import './globals.css'
import { Analytics } from '@vercel/analytics/next'

export const metadata = {
  metadataBase: new URL('https://valeur-spe-eau.vercel.app'),
  title: 'Calculateur de valeur SPE-Eau V1.0 | Collectif Eau Québec',
  description: "Outil bilingue d'évaluation multidimensionnelle de la valeur des projets de science participative de l'eau — économique, scientifique, sociale, environnementale, politique. V1.0 — Collectif Eau Québec / G3E-EWAG.",
  keywords: 'science participative, eau, Québec, SROI, MCDA, OBV, Collectif Eau Québec, G3E-EWAG',
  authors: [{ name: 'Collectif Eau Québec / G3E-EWAG' }],
  openGraph: {
    title: 'Calculateur de valeur SPE-Eau V1.0 | Collectif Eau Québec',
    description: "Évaluez la valeur multidimensionnelle de votre projet de science participative de l'eau.",
    url: 'https://valeur-spe-eau.vercel.app',
    siteName: 'Collectif Eau Québec',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Calculateur SPE-Eau CEQ V1.0' }],
    locale: 'fr_CA',
    type: 'website',
  },
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-ceq-ice font-body antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
