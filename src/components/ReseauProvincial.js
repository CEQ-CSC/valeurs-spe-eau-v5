'use client'

import React, { useState, useEffect } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'
import { 
  Globe, ShieldCheck, Database, Landmark, HeartHandshake, 
  Send, CheckCircle, ArrowUpRight 
} from 'lucide-react'

// Valeurs de secours (fallback) le temps du chargement des données de l'API
const DONNEES_PAR_DEFAUT = {
  projetsEnregistres: 42,
  valeurEconomiqueCumulee: 1345800,
  coutsEvitesEstimes: 420000,
  stationsSuivies: 185,
  benevolesActifs: 1250,
  repartitionParDimension: [
    { name: 'Scientifique', 'Impact Cumulé (/)': 78 },
    { name: 'Sociale', 'Impact Cumulé (/)': 84 },
    { name: 'Environnementale', 'Impact Cumulé (/)': 72 },
    { name: 'Politique', 'Impact Cumulé (/)': 61 },
  ]
}

export default function ReseauProvincial({ resultatsCalculateur, lang }) {
  // Récupère automatiquement l'année en cours
  const currentYear = new Date().getFullYear()
  
  // État pour stocker les statistiques en temps réel depuis Supabase/API
  const [statsDynamiques, setStatsDynamiques] = useState(DONNEES_PAR_DEFAUT)
  
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
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      const json = await response.json()
      if (json.success && json.stats) {
        setStatsDynamiques(json.stats)
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des statistiques :", err)
    }
  }

  // Charger les statistiques dès le premier rendu de la page
  useEffect(() => {
    fetchStats()
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
        // Mettre à jour immédiatement les statistiques du tableau de bord
        fetchStats()
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
    <div className="space-y-10 text-left p-2 max-w-5xl mx-auto">
      
      {/* --- SECTION 1: LE TABLEAU DE BORD DU RÉSEAU --- */}
      <div className="space-y-4">
        <div className="border-b pb-3">
          <div className="flex items-center gap-2 text-[#1DB7AE] font-bold text-xs uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4" />
            <span>Impact Collectif Provincial</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-montserrat text-[#0E3A5D]">
            Valeur globale de la science participative de l'eau au Québec — {currentYear}
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
            Ces indicateurs consolidés illustrent la force et la valeur multidimensionnelle générées par l'ensemble des acteurs du réseau à l'échelle de la province.
          </p>
        </div>

        {/* Blocs KPI Provinciaux mis à jour en temps réel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-[#0E3A5D] to-[#124975] text-white p-4 rounded-xl shadow-sm">
            <div className="text-[11px] font-semibold text-teal-300 uppercase tracking-wider">Projets Actifs</div>
            <div className="text-3xl font-black mt-1 flex items-baseline gap-1">
              {statsDynamiques.projetsEnregistres}
              <span className="text-xs font-normal text-gray-300">organisations</span>
            </div>
            <div className="text-[10px] text-teal-200 mt-2 italic">Mise à jour en temps réel</div>
          </div>

          <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Landmark className="w-3.5 h-3.5 text-[#1DB7AE]" /> Valeur Éco. Réseau
            </div>
            <div className="text-2xl font-bold text-[#0E3A5D] mt-1">
              {Number(statsDynamiques.valeurEconomiqueCumulee).toLocaleString('fr-CA')} $
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> Équivalent salarial & données captées
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1DB7AE]" /> Coûts Crises Évités
            </div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">
              {Number(statsDynamiques.coutsEvitesEstimes).toLocaleString('fr-CA')} $
            </div>
            <div className="text-[10px] text-gray-400 mt-1 italic">Grâce à la détection précoce des anomalies</div>
          </div>

          <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-[#1DB7AE]" /> Force Citoyenne
            </div>
            <div className="text-2xl font-bold text-[#0E3A5D] mt-1">
              {statsDynamiques.benevolesActifs}
            </div>
            <div className="text-[10px] text-gray-400 mt-1 font-medium">
              Gardiens de l'eau sur {statsDynamiques.stationsSuivies} stations du Québec
            </div>
          </div>
        </div>

        {/* Graphique d'Impact Global par dimensions */}
        <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm">
          <span className="text-[11px] font-bold text-[#0E3A5D] uppercase tracking-wider block mb-4">
            Santé du réseau par dimension de la SPE-Eau
          </span>
          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsDynamiques.repartitionParDimension} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#4B5563', fontWeight: 600 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="Impact Cumulé (/)" fill="#1DB7AE" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: ENREGISTREMENT ET CONTRIBUTION AU RÉSEAU --- */}
      <div className="bg-gradient-to-b from-slate-50 to-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-3 mb-6">
          <div className="p-2.5 bg-[#0E3A5D]/5 text-[#0E3A5D] rounded-xl shrink-0">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-montserrat text-[#0E3A5D]">
              Enregistrez votre projet et contribuez à l'impact collectif
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              En soumettant les indices de valeur calculés aujourd'hui, vous permettez au Collectif Eau Québec de légitimer la science participative auprès des instances gouvernementales et des bailleurs de fonds.
            </p>
          </div>
        </div>

        {!resultatsCalculateur ? (
          /* Garde-fou si l'utilisateur n'a pas encore fait de simulation */
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 text-xs font-medium">
            ⚠️ <strong>Données introuvables :</strong> Vous devez d'abord remplir les sections précédentes du calculateur (Valeur économique, scientifique, etc.) pour pouvoir soumettre l'indice de valeur de votre projet au réseau provincial.
          </div>
        ) : formSoumis ? (
          /* Message de succès après enregistrement */
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3 max-w-md mx-auto">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-emerald-900 font-montserrat text-base">Projet enregistré avec succès !</h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Merci, <strong>{formData.nomCompletRef}</strong>. Les indicateurs du projet <strong>{resultatsCalculateur.meta?.nomProjet || 'votre projet'}</strong> ont été enregistrés et les statistiques du réseau ont été mises à jour.
            </p>
          </div>
        ) : (
          /* Le formulaire de contribution */
          <form onSubmit={handleSoumission} className="space-y-5 max-w-2xl">
            {/* Message d'erreur le cas échéant */}
            {erreur && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl">
                ⚠️ {erreur}
              </div>
            )}

            {/* Rappel des données qui vont être transmises */}
            <div className="bg-[#0E3A5D]/5 p-3 rounded-xl border border-[#0E3A5D]/10 flex items-center justify-between text-xs">
              <div>
                <span className="text-gray-400">Données prêtes à l'envoi :</span>
                <span className="font-bold text-[#0E3A5D] ml-1.5">
                  {resultatsCalculateur.meta?.nomProjet || 'Projet anonyme'} ({resultatsCalculateur.meta?.organisation || 'Sans organisation'})
                </span>
              </div>
              <div className="bg-white px-2.5 py-1 rounded-md font-bold text-[#0E3A5D] border shadow-xs">
                Score : {resultatsCalculateur.scoreGlobal ?? 0}/100
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Nom de la personne ressource</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Rodrigue Lemay" 
                  className="w-full text-xs p-3 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1DB7AE]"
                  value={formData.nomCompletRef}
                  onChange={(e) => setFormData({...formData, nomCompletRef: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Courriel professionnel de contact</label>
                <input 
                  type="email" 
                  required
                  placeholder="Ex: r.lemay@g3e-ewag.ca" 
                  className="w-full text-xs p-3 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1DB7AE]"
                  value={formData.courrielRef}
                  onChange={(e) => setFormData({...formData, courrielRef: e.target.value})}
                />
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input 
                type="checkbox" 
                required
                className="mt-0.5 rounded text-[#1DB7AE] focus:ring-[#1DB7AE]"
                checked={formData.autorisationPartage}
                onChange={(e) => setFormData({...formData, autorisationPartage: e.target.checked})}
              />
              <span className="text-[11px] text-gray-500 leading-tight">
                J'autorise le Collectif Eau Québec à agréger de manière anonyme les scores d'impact de mon projet à la valeur globale provinciale, conformément aux politiques de gestion des données du réseau.
              </span>
            </label>

            <button
              type="submit"
              disabled={chargement}
              className="inline-flex items-center gap-2 bg-[#1DB7AE] hover:bg-[#19a199] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-colors disabled:opacity-50"
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