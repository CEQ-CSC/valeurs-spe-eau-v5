'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { RotateCcw, AlertTriangle } from 'lucide-react'

export default function Error({ error, reset }) {
  useEffect(() => { console.error('Erreur V5:', error) }, [error])
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-ceq-ice">
      <div className="card p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="text-amber-500" size={32} />
        </div>
        <h2 className="font-display text-xl font-bold text-ceq-dark mb-2">Une erreur est survenue</h2>
        <p className="text-ceq-slate text-sm mb-6 leading-relaxed">
          {error?.message || "Une erreur inattendue s'est produite. Veuillez réessayer."}
        </p>
        <button onClick={reset} className="btn-primary w-full flex items-center justify-center gap-2">
          <RotateCcw size={16} /> Réessayer
        </button>
        <Link href="/" className="block mt-3 text-sm text-ceq-cyan hover:underline">Retour à l&apos;accueil</Link>
      </div>
    </div>
  )
}
