'use client'

import React, { useState, useEffect } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'
import { 
  Globe, Landmark, HeartHandshake, Send, CheckCircle, ArrowUpRight, AlertTriangle
} from 'lucide-react'

const DONNEES_VIDES = {
  projetsEnregistres: 0,
  valeurEconomiqueCumulee: 0,
  scoreGlobalMoyen: 0,
  repartitionParDimension: [
    { name: 'Scientifique', 'Impact Cumulé (/)': 0 },
    { name: 'Sociale', 'Impact Cumulé (/)': 0 },
    { name: 'Environnementale', 'Impact Cumulé (/)': 0 },
    { name: 'Politique', 'Impact Cumulé (/)': 0 },
  ]
}

export default function ReseauProvincial({ resultatsCalculateur, lang }) {
  // Récupère automatiquement l'année en cours
  const currentYear = new Date().getFullYear()
  
  // État pour stocker les statistiques en temps réel depuis Supabase/API
  const [statsDynamiques, setStatsDynamiques] = useState(DONNEES_VIDES)
  const [erreurStats, setErreurStats] = useState(null)
  
  // Gestion de l'état du formulaire de contribution
  const [formSoumis, setFormSoumis] = useState(false)
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState(null)
  const [formData, setFormData] = useState({
    nomCompletRef: '',
    courrielRef: '',
    autorisationPartage: false
  })

  // Fonction pour récupérer les données consolidées depuis l'API /api/stats
  // Charger les statistiques dès le premier rendu de la page
  useEffect(() => {
    let cancelled = false
    fetch('/api/stats')
      .then(async response => {
        const json = await response.json()
        if (!response.ok || !json.success || !json.stats) {
          throw new Error(json.error || 'Les statistiques du réseau ne sont pas disponibles.')
        }
        if (!cancelled) setStatsDynamiques(json.stats)
      })
      .catch(err => {
        console.error("Erreur lors de la récupération des statistiques :", err)
        if (!cancelled) setErreurStats(err.message || 'Les statistiques du réseau ne sont pas disponibles.')
      })
    return () => { cancelled = true }
  }, [])

  const handleSoumission = async (e) => {
    e.preventDefault()
    setChargement(true)
    setErreur(null)

    try {
      // Préparation du corps de la requête avec toutes les dimensions du calculateur
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nomProjet: resultatsCalculateur?.meta?.nomProjet || 'Projet anonyme',
          organisation: resultatsCalculateur?.meta?.organisation || 'Sans organisation',
          nomPersonneRessource: formData.nomCompletRef,
          courrielContact: formData.courrielRef,
          autorisationPartage: formData.autorisationPartage,
          scoreGlobal: resultatsCalculateur?.scoreGlobal ?? 'N/A',
          valeurEconomique: resultatsCalculateur?.valeurEconomique || 0,
          valeurScientifique: resultatsCalculateur?.scoresParDimension?.Scientifique || 0,
          valeurSociale: resultatsCalculateur?.scoresParDimension?.Sociale || 0,
          valeurEnvironnementale: resultatsCalculateur?.scoresParDimension?.Environnementale || 0,
          valeurPolitique: resultatsCalculateur?.scoresParDimension?.Politique || 0,
          valeurDonnees: resultatsCalculateur?.valeurDonnees || 0,
          dateSoumission: new Date().toLocaleDateString('fr-CA')
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setFormSoumis(true)
      } else {
        throw new Error(result.error || "Une erreur est survenue lors de l'envoi.")
      }
    } catch (err) {
      console.error("Erreur lors de la soumission :", err)
      setErreur(err.message || "Impossible de transmettre les données pour le moment.")
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="network-page space-y-8 text-left max-w-5xl mx-auto">
      
      {/* --- SECTION 1: LE TABLEAU DE BORD DU RÉSEAU --- */}
      <div className="space-y-4">
        <div className="border-b border-ceq-iceDark pb-4">
          <div className="flex items-center gap-2 text-ceq-slate font-semibold text-xs uppercase tracking-wider mb-2">
            <Globe className="w-4 h-4" />
            <span>Impact Collectif Provincial</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-display text-ceq-dark">
            Valeur globale de la science participative de l&apos;eau au Québec — {currentYear}
          </h2>
          <p className="text-sm text-ceq-slate mt-2 max-w-2xl leading-relaxed">
            Ces indicateurs consolidés illustrent la force et la valeur multidimensionnelle générées par l&apos;ensemble des acteurs du réseau à l&apos;échelle de la province.
          </p>
        </div>

        {erreurStats && (
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900" role="status">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>Les statistiques provinciales sont temporairement indisponibles : {erreurStats}</p>
          </div>
        )}

        {/* Blocs KPI Provinciaux mis à jour en temps réel */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-gradient-to-br from-ceq-dark to-ceq-slate text-white p-5 rounded-xl shadow-ceq-sm">
            <div className="text-[11px] font-semibold text-ceq-cyan uppercase tracking-wider">Projets approuvés</div>
            <div className="text-3xl font-black mt-1 flex items-baseline gap-1">
              {statsDynamiques.projetsEnregistres}
              <span className="text-xs font-normal text-gray-300">projets</span>
            </div>
            <div className="text-[10px] text-white/65 mt-2">Contributions approuvées uniquement</div>
          </div>

          <div className="card p-5">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Landmark className="w-3.5 h-3.5 text-ceq-slate" /> Valeur Éco. Réseau
            </div>
            <div className="text-2xl font-bold text-ceq-dark mt-1">
              {Number(statsDynamiques.valeurEconomiqueCumulee).toLocaleString('fr-CA')} $
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> Équivalent salarial & données captées
            </div>
          </div>

          <div className="card p-5">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-ceq-slate" /> Indice global moyen
            </div>
            <div className="text-2xl font-bold text-ceq-dark mt-1">
              {statsDynamiques.scoreGlobalMoyen}/100
            </div>
            <div className="text-[10px] text-gray-400 mt-1">Moyenne des projets approuvés</div>
          </div>
        </div>

        {/* Graphique d'Impact Global par dimensions */}
        <div className="card p-5">
          <span className="text-xs font-semibold text-ceq-dark uppercase tracking-wider block mb-4">
            Santé du réseau par dimension de la SPE-Eau
          </span>
          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsDynamiques.repartitionParDimension} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4EBF0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#394F66', fontWeight: 600 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#718092' }} />
                <Tooltip />
                <Bar dataKey="Impact Cumulé (/)" fill="#394F66" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: ENREGISTREMENT ET CONTRIBUTION AU RÉSEAU --- */}
      <div className="card p-6 md:p-8">
        <div className="flex items-start gap-3 mb-6">
          <div className="p-2.5 bg-ceq-iceDark text-ceq-slate rounded-lg shrink-0">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-ceq-dark">
              Enregistrez votre projet et contribuez à l&apos;impact collectif
            </h3>
            <p className="text-sm text-ceq-slate mt-1 leading-relaxed">
              En soumettant les indices de valeur calculés aujourd&apos;hui, vous permettez au Collectif Eau Québec de légitimer la science participative auprès des instances gouvernementales et des bailleurs de fonds.
            </p>
          </div>
        </div>

        {!resultatsCalculateur ? (
          /* Garde-fou si l'utilisateur n'a pas encore fait de simulation */
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 text-xs font-medium flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <p><strong>Données introuvables :</strong> Vous devez d&apos;abord remplir les sections précédentes du calculateur (Valeur économique, scientifique, etc.) pour pouvoir soumettre l&apos;indice de valeur de votre projet au réseau provincial.</p>
          </div>
        ) : formSoumis ? (
          /* Message de succès après enregistrement */
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3 max-w-md mx-auto">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-emerald-900 font-display text-base">Projet enregistré avec succès !</h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Merci, <strong>{formData.nomCompletRef}</strong>. La demande pour le projet <strong>{resultatsCalculateur.meta?.nomProjet || 'votre projet'}</strong> a bien été reçue. Elle sera ajoutée aux statistiques provinciales après validation par l&apos;équipe du Collectif Eau Québec.
            </p>
          </div>
        ) : (
          /* Le formulaire de contribution */
          <form onSubmit={handleSoumission} className="space-y-5 max-w-2xl">
            {/* Message d'erreur le cas échéant */}
            {erreur && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <p>{erreur}</p>
              </div>
            )}

            {/* Rappel des données qui vont être transmises */}
            <div className="bg-ceq-ice p-3 rounded-lg border border-ceq-iceDark flex items-center justify-between text-xs">
              <div>
                <span className="text-gray-400">Données prêtes à l&apos;envoi :</span>
                <span className="font-bold text-ceq-dark ml-1.5">
                  {resultatsCalculateur.meta?.nomProjet || 'Projet anonyme'} ({resultatsCalculateur.meta?.organisation || 'Sans organisation'})
                </span>
              </div>
              <div className="bg-white px-2.5 py-1 rounded-md font-bold text-ceq-dark border border-ceq-iceDark">
                Score : {resultatsCalculateur.scoreGlobal ?? 0}/100
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="label-ceq">Nom de la personne ressource</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Rodrigue Lemay" 
                  className="input-ceq"
                  value={formData.nomCompletRef}
                  onChange={(e) => setFormData({...formData, nomCompletRef: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="label-ceq">Courriel professionnel de contact</label>
                <input 
                  type="email" 
                  required
                  placeholder="Ex: r.lemay@g3e-ewag.ca" 
                  className="input-ceq"
                  value={formData.courrielRef}
                  onChange={(e) => setFormData({...formData, courrielRef: e.target.value})}
                />
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input 
                type="checkbox" 
                required
                className="mt-0.5 rounded text-ceq-slate focus:ring-ceq-slate"
                checked={formData.autorisationPartage}
                onChange={(e) => setFormData({...formData, autorisationPartage: e.target.checked})}
              />
              <span className="text-[11px] text-gray-500 leading-tight">
                J&apos;autorise le Collectif Eau Québec à agréger de manière anonyme les scores d&apos;impact de mon projet à la valeur globale provinciale, conformément aux politiques de gestion des données du réseau.
              </span>
            </label>

            <button
              type="submit"
              disabled={chargement}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {chargement ? (
                <>Enregistrement en cours...</>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Transmettre mes résultats au Réseau Provincial
                </>
              )}
            </button>
          </form>
        )}
      </div>

    </div>
  )
}