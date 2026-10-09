'use client'
import Image from 'next/image'
import { AlertTriangle, Briefcase, Coins, Printer, TrendingUp } from 'lucide-react'
import { formatMontant } from '@/lib/calculations/index'

export default function RapportPrint({ resultats, lang = 'fr' }) {
  if (!resultats) return null
  const t = lang === 'fr'
  const {
    info, scores, scoreGlobal, interpretation, composantes,
    valeurTotale, sroi, investissement, confianceGlobal,
    recommandations, version
  } = resultats

  const dimLabels = t
    ? { scientifique:'Scientifique', sociale:'Sociale', environnementale:'Environnementale', politique:'Politique' }
    : { scientifique:'Scientific', sociale:'Social', environnementale:'Environmental', politique:'Political' }

  const compLabels = t
    ? { travail_benevole:'Travail bénévole', sensibilisation:'Sensibilisation', donnees_scientifiques:'Valeur des données',
        formation:'Formation scientifique', ecosystemique:'Services écosystémiques', couts_evites:'Coûts évités (probabiliste)',
        influence_politique:'Influence politique' }
    : { travail_benevole:'Volunteer labour', sensibilisation:'Outreach', donnees_scientifiques:'Data value',
        formation:'Scientific training', ecosystemique:'Ecosystem services', couts_evites:'Avoided costs (probabilistic)',
        influence_politique:'Political influence' }

  const dateStr = new Date().toLocaleDateString(t ? 'fr-CA' : 'en-CA', { year:'numeric', month:'long', day:'numeric' })
  const interp = interpretation || {}
  const confLabel = { fr:{élevé:'Élevée',moyen:'Moyenne',faible:'Faible',inconnu:'Inconnue'}, en:{élevé:'High',moyen:'Moderate',faible:'Low',inconnu:'Unknown'} }

  return (
    <div className="print-container">
      {/* Bouton impression — masqué à l'impression grâce à la classe no-print */}
      <div className="no-print flex justify-end mb-4">
        <button onClick={() => window.print()}
          className="btn-primary flex items-center gap-2 cursor-pointer">
          <Printer size={16} aria-hidden="true" />
          {t ? 'Imprimer / Exporter PDF' : 'Print / Export PDF'}
        </button>
      </div>

      {/* Corps du rapport */}
      <div id="rapport-print" className="bg-white rounded-2xl shadow-ceq-md overflow-hidden print:shadow-none print:rounded-none">
        {/* En-tête */}
        <div className="ceq-header-bg report-header p-8 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <Image
                src="/logo-ceq.png"
                alt="Collectif Eau Québec / Québec Water Collective"
                width={200}
                height={120}
                className="report-logo w-36 h-auto rounded-lg bg-white p-1"
              />
              <div>
                <p className="report-eyebrow text-ceq-cyan text-xs font-semibold uppercase tracking-widest mb-2">
                  {t ? "Rapport d'évaluation de la valeur · Science participative de l'eau" : "Value Assessment Report · Participatory Water Science"}
                </p>
                <h1 className="font-display text-2xl font-bold">
                  {info?.nomProjet || (t ? 'Projet SPE-Eau' : 'SPE-Water Project')}
                </h1>
                {info?.organisation && <p className="text-white/70 text-sm mt-1">{info.organisation}</p>}
              </div>
            </div>
            <div className="report-meta flex flex-col items-end text-right text-xs text-white/60 shrink-0">
              <div>{dateStr}</div>
              <div className="mt-1">V1.0</div>
            </div>
          </div>

          {/* Score + confiance */}
          <div className="report-score-summary flex flex-wrap items-center gap-4 bg-white/10 rounded-xl p-4 mt-5 border border-white/20">
            <div className="text-center">
              <div className="report-score font-display text-4xl font-black text-ceq-cyan">{scoreGlobal}</div>
              <div className="report-meta text-xs text-white/60">/100</div>
            </div>
            <div>
              <p className="font-semibold text-sm">{t ? 'Indice global SPE' : 'SPE Global Index'}</p>
              <p className="report-summary-text text-sm text-white/80 mt-0.5">{t ? interp.fr : interp.en}</p>
            </div>
            {sroi && (
              <div className="ml-auto text-center">
                <div className="report-score font-display text-3xl font-black text-ceq-cyan">{sroi}:1</div>
                <div className="report-meta text-xs text-white/60">SROI</div>
              </div>
            )}
            <div className="report-confidence text-xs bg-white/20 px-3 py-1.5 rounded-full">
              {t ? 'Confiance :' : 'Confidence:'} {confLabel[lang][confianceGlobal?.niveau] || '—'}
            </div>
          </div>
        </div>

        {/* Corps */}
        <div className="p-8 space-y-8">

          {/* 1. Résumé */}
          <section className="print-section">
            <h2 className="font-display text-lg font-bold text-ceq-dark border-b-2 border-ceq-slate pb-2 mb-4">
              {t ? '1. Résumé exécutif' : '1. Executive Summary'}
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { l:t?'Valeur totale':'Total Value', v:formatMontant(valeurTotale,lang), Icon:Coins },
                { l:'SROI', v:sroi?`${sroi}:1`:'—', Icon:TrendingUp },
                { l:t?'Investissement':'Investment', v:formatMontant(investissement,lang), Icon:Briefcase },
              ].map(x=>(
                <div key={x.l} className="bg-ceq-ice rounded-xl p-4 text-center print:bg-gray-100 print:border print:border-gray-200">
                  <x.Icon className="w-6 h-6 mx-auto mb-1 text-ceq-slate" aria-hidden="true" />
                  <div className="font-display text-xl font-bold text-ceq-dark">{x.v}</div>
                  <div className="text-xs text-ceq-slate mt-1">{x.l}</div>
                </div>
              ))}
            </div>
            {info?.description && (
              <p className="mt-4 text-sm text-ceq-slate leading-relaxed italic">{info.description}</p>
            )}
          </section>

          {/* 2. Scores par dimension */}
          <section className="print-section">
            <h2 className="font-display text-lg font-bold text-ceq-dark border-b-2 border-ceq-slate pb-2 mb-4">
              {t ? '2. Évaluation par dimension (MCDA 25/25/25/25)' : '2. Evaluation by Dimension (MCDA 25/25/25/25)'}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr className="bg-ceq-ice print:bg-gray-200">
                    <th className="text-left py-3 px-4 rounded-l-xl font-semibold text-ceq-dark">{t?'Dimension':'Dimension'}</th>
                    <th className="text-center py-3 px-4 font-semibold text-ceq-dark">{t?'Pondération':'Weight'}</th>
                    <th className="text-center py-3 px-4 font-semibold text-ceq-dark">{t?'Score':'Score'}</th>
                    <th className="text-center py-3 px-4 rounded-r-xl font-semibold text-ceq-dark">{t?'Profil':'Profile'}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(scores).map(([k,v],i)=>(
                    <tr key={k} className={i%2===0?'bg-white':'bg-ceq-ice/50 print:bg-gray-50'}>
                      <td className="py-3 px-4 font-medium text-ceq-dark">{dimLabels[k]}</td>
                      <td className="py-3 px-4 text-center text-ceq-slate">25 %</td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-bold text-ceq-dark">{v}</span>
                        <span className="text-ceq-slate">/100</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-2 bg-ceq-ice rounded-full overflow-hidden w-full print:bg-gray-200">
                          <div className="h-full rounded-full bg-ceq-slate" style={{width:`${v}%`}}/>
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-ceq-dark text-white font-bold print:bg-black">
                    <td className="py-3 px-4 rounded-bl-xl">{t?'Score global':'Global Score'}</td>
                    <td className="py-3 px-4 text-center">100 %</td>
                    <td className="py-3 px-4 text-center">{scoreGlobal}/100</td>
                    <td className="py-3 px-4 rounded-br-xl"/>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. Valeur économique */}
          {valeurTotale > 0 && (
            <section className="print-section">
              <h2 className="font-display text-lg font-bold text-ceq-dark border-b-2 border-ceq-slate pb-2 mb-4">
                {t ? '3. Valeur économique estimée' : '3. Estimated Economic Value'}
              </h2>
              <table className="w-full text-sm mb-3">
                <thead>
                  <tr className="bg-ceq-ice print:bg-gray-200">
                    <th className="text-left py-3 px-4 rounded-l-xl font-semibold text-ceq-dark">{t?'Composante':'Component'}</th>
                    <th className="text-right py-3 px-4 rounded-r-xl font-semibold text-ceq-dark">{t?'Montant estimé':'Estimated Amount'}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(composantes||{}).filter(([,v])=>v>0).map(([k,v],i)=>(
                    <tr key={k} className={i%2===0?'bg-white':'bg-ceq-ice/50 print:bg-gray-50'}>
                      <td className="py-3 px-4 text-ceq-dark">{compLabels[k]||k}</td>
                      <td className="py-3 px-4 text-right font-semibold text-ceq-sci">{formatMontant(v,lang)}</td>
                    </tr>
                  ))}
                  <tr className="bg-ceq-dark text-white font-bold print:bg-black">
                    <td className="py-3 px-4 rounded-bl-xl">Total</td>
                    <td className="py-3 px-4 text-right rounded-br-xl">{formatMontant(valeurTotale,lang)}</td>
                  </tr>
                </tbody>
              </table>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{t
                  ? 'Ces valeurs sont des estimations à des fins de plaidoyer et de communication. Elles ne constituent pas une valeur comptable ou financière vérifiée.'
                  : 'These values are estimates for advocacy and communication purposes. They do not constitute verified accounting or financial values.'}</span>
              </div>
            </section>
          )}

          {/* 4. Recommandations */}
          {recommandations?.length > 0 && (
            <section className="print-section">
              <h2 className="font-display text-lg font-bold text-ceq-dark border-b-2 border-ceq-slate pb-2 mb-4">
                {t ? '4. Recommandations prioritaires' : '4. Priority Recommendations'}
              </h2>
              <div className="space-y-3">
                {recommandations.map((r,i)=>(
                  <div key={i} className="flex gap-3 bg-ceq-ice/60 rounded-xl p-4 print:bg-gray-50 print:border print:border-gray-200">
                    <div className="w-6 h-6 rounded-full bg-ceq-dark text-white text-xs flex items-center justify-center font-bold shrink-0">{i+1}</div>
                    <div>
                      <p className="font-semibold text-ceq-dark text-sm">{r.titre}</p>
                      <p className="text-xs text-ceq-slate mt-0.5">{r.texte}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Pied de page */}
          <footer className="border-t border-ceq-iceDark pt-4 text-xs text-ceq-slate text-center">
            <p>{t
              ? `Rapport généré le ${dateStr} — Méthode CEQ V1.0`
              : `Report generated on ${dateStr} — CEQ Method V1.0`}
            </p>
            <p className="mt-1 opacity-60 text-[10px]">
              {t
                ? 'Méthodologie : MCDA équipondéré (25/25/25/25) · SROI (norme NPC UK 2012) · TEEB Canada 2021 · Sources : MELCCFP, Stats Canada, INSPQ. Estimation uniquement.'
                : 'Methodology: Equal-weight MCDA (25/25/25/25) · SROI (NPC UK standard 2012) · TEEB Canada 2021 · Sources: MELCCFP, Stats Canada, INSPQ. Estimates only.'}
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}