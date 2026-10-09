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
    recommandations, transparence
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
  const etapesParticipationLabels = t
    ? { conception:'Définition des questions et objectifs', developpement:'Développement des méthodes', collecte:'Collecte des données', traitement:'Traitement et validation', analyse:'Analyse', interpretation:'Interprétation', diffusion:'Diffusion', partage:'Partage des ressources', reconnaissance:'Reconnaissance des contributions' }
    : { conception:'Defining questions and objectives', developpement:'Developing methods', collecte:'Data collection', traitement:'Processing and validation', analyse:'Analysis', interpretation:'Interpretation', diffusion:'Communication', partage:'Sharing resources', reconnaissance:'Contributor recognition' }
  const typesImplicationLabels = t
    ? { contributeur:'Contributeur — réalise des tâches définies', collaborateur:'Collaborateur — participe aux choix ou à l’interprétation', responsable:'Responsable — initie ou dirige une partie du projet' }
    : { contributeur:'Contributor — carries out defined tasks', collaborateur:'Collaborator — contributes to decisions or interpretation', responsable:'Project leader — initiates or leads part of the project' }
  const parcoursLabels = t
    ? { sensibilisation:'Sensibilisation / accès à l’information', apprentissage:'Apprentissage / attitudes', mobilisation:'Mobilisation / pratiques', decision:'Utilisation dans une décision ou action', changement:'Changement à long terme' }
    : { sensibilisation:'Awareness / access to information', apprentissage:'Learning / attitudes', mobilisation:'Mobilization / practices', decision:'Use in a decision or action', changement:'Long-term change' }
  const statusLabels = t
    ? { non_observe:'Non observé / inconnu', plausible:'Plausible, à vérifier', observe:'Observé', documente:'Documenté' }
    : { non_observe:'Not observed / unknown', plausible:'Plausible, to verify', observe:'Observed', documente:'Documented' }
  const evidenceLabels = t
    ? { mesure:'Mesuré', documente:'Documenté', verifie:'Vérifié par un tiers', declare:'Déclaratif', inconnu:'Inconnu' }
    : { mesure:'Measured', documente:'Documented', verifie:'Third-party verified', declare:'Self-reported', inconnu:'Unknown' }
  const riskLabels = t
    ? { contamination_eau_potable:'Contamination de l’eau potable', proliferation_algues:'Prolifération de cyanobactéries', deversement_accidentel:'Déversement accidentel', fermeture_plage:'Fermeture de plage', effondrement_espece:'Effondrement d’une espèce', invasion_espece:'Invasion par une espèce', erosion_berges:'Érosion des berges' }
    : { contamination_eau_potable:'Drinking water contamination', proliferation_algues:'Cyanobacteria bloom', deversement_accidentel:'Accidental spill', fermeture_plage:'Beach closure', effondrement_espece:'Species collapse', invasion_espece:'Species invasion', erosion_berges:'Riverbank erosion' }
  const evidenceAreaLabels = t
    ? { Protocole:'Protocole', Formation:'Formation', Participation:'Participation', Écosystèmes:'Écosystèmes', Influence:'Influence' }
    : { Protocole:'Protocol', Formation:'Training', Participation:'Participation', Écosystèmes:'Ecosystems', Influence:'Policy influence' }

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
              {t ? 'Renseignements :' : 'Information coverage:'} {confLabel[lang][confianceGlobal?.niveau] || '—'}
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

          {/* 2. Participation et parcours d'impact */}
          <section className="print-section">
            <h2 className="font-display text-lg font-bold text-ceq-dark border-b-2 border-ceq-slate pb-2 mb-4">
              {t ? '2. Participation citoyenne et parcours des effets' : '2. Citizen Participation and Impact Pathway'}
            </h2>
            <h3 className="mb-2 text-sm font-semibold text-ceq-dark">
              {t ? 'Type d’implication' : 'Type of involvement'}
            </h3>
            {transparence?.typesImplication?.length ? (
              <ul className="mb-4 grid gap-2 sm:grid-cols-2">
                {transparence.typesImplication.map(role => (
                  <li key={role} className="rounded-lg border border-ceq-iceDark bg-ceq-ice px-3 py-2 text-xs text-ceq-dark">
                    {typesImplicationLabels[role] || role}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mb-4 text-xs text-ceq-slate">{t ? 'Aucun rôle n’a été précisé.' : 'No roles were specified.'}</p>
            )}
            <h3 className="mb-2 text-sm font-semibold text-ceq-dark">
              {t ? 'Étapes du cycle scientifique auxquelles les citoyennes et citoyens contribuent' : 'Research-cycle stages involving citizens'}
            </h3>
            {transparence?.etapesParticipation?.length ? (
              <ul className="mb-5 grid gap-2 sm:grid-cols-2">
                {transparence.etapesParticipation.map(stage => (
                  <li key={stage} className="rounded-lg border border-ceq-iceDark bg-ceq-ice px-3 py-2 text-xs text-ceq-dark">
                    {etapesParticipationLabels[stage] || stage}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mb-5 text-xs text-ceq-slate">{t ? 'Aucune étape n’a été précisée.' : 'No stages were specified.'}</p>
            )}
            <h3 className="mb-2 text-sm font-semibold text-ceq-dark">
              {t ? 'Effets suivis dans le temps' : 'Effects tracked over time'}
            </h3>
            <div className="space-y-2">
              {(transparence?.parcoursImpact || []).map(item => (
                <div key={item.etape} className="rounded-lg border border-ceq-iceDark p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-ceq-dark">{parcoursLabels[item.etape] || item.etape}</span>
                    <span className="rounded-full bg-ceq-ice px-2.5 py-1 text-[11px] text-ceq-slate">{statusLabels[item.niveau] || item.niveau}</span>
                  </div>
                  {item.preuve && <p className="mt-2 whitespace-pre-wrap text-xs text-ceq-slate">{item.preuve}</p>}
                </div>
              ))}
            </div>
            <p className="mt-3 rounded-lg bg-ceq-ice p-3 text-xs leading-relaxed text-ceq-slate">
              {t
                ? 'Le parcours décrit des observations et une contribution plausible du projet. Il ne démontre pas, à lui seul, une relation de causalité; d’autres facteurs peuvent expliquer les changements.'
                : 'This pathway records observations and plausible project contribution. It does not by itself establish causality; other factors may explain observed changes.'}
            </p>
            {(transparence?.nbParticipantsAvantApres || transparence?.outilEvaluationApprentissage) && (
              <div className="mt-3 rounded-lg border border-ceq-iceDark p-3 text-xs text-ceq-slate">
                <strong>{t ? 'Évaluation des apprentissages :' : 'Learning assessment:'}</strong>{' '}
                {transparence.nbParticipantsAvantApres
                  ? `${transparence.nbParticipantsAvantApres} ${t ? 'participant(s) évalué(s) avant/après' : 'participant(s) assessed before/after'}`
                  : (t ? 'Nombre de participants non précisé' : 'Number of participants not specified')}
                {transparence.outilEvaluationApprentissage && (
                  <p className="mt-1">{transparence.outilEvaluationApprentissage}</p>
                )}
              </div>
            )}
          </section>

          {/* 3. Niveau et références des preuves */}
          <section className="print-section">
            <h2 className="font-display text-lg font-bold text-ceq-dark border-b-2 border-ceq-slate pb-2 mb-4">
              {t ? '3. Niveau de preuve et références' : '3. Evidence Levels and References'}
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ceq-ice print:bg-gray-200">
                  <th className="px-3 py-2 text-left font-semibold">{t ? 'Élément' : 'Evidence area'}</th>
                  <th className="px-3 py-2 text-left font-semibold">{t ? 'Niveau déclaré' : 'Stated level'}</th>
                  <th className="px-3 py-2 text-left font-semibold">{t ? 'Référence' : 'Reference'}</th>
                </tr>
              </thead>
              <tbody>
                {(transparence?.preuves || []).map(([area, level, reference]) => (
                  <tr key={area} className="border-b border-ceq-iceDark">
                    <td className="px-3 py-2">{evidenceAreaLabels[area] || area}</td>
                    <td className="px-3 py-2">{evidenceLabels[level] || (t ? 'Non évalué' : 'Not assessed')}</td>
                    <td className="px-3 py-2 break-words">{reference || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {transparence?.referenceInfluence && (
              <p className="mt-3 rounded-lg bg-ceq-ice p-3 text-xs text-ceq-slate">
                <strong>{t ? 'Référence d’influence politique :' : 'Policy influence reference:'}</strong>{' '}
                {transparence.referenceInfluence}
              </p>
            )}
            <p className="mt-3 text-xs leading-relaxed text-ceq-slate">
              {t
                ? 'Le niveau « renseignements » du résumé reflète la complétude des champs saisis, et non une vérification indépendante de la qualité ou de l’exactitude des preuves.'
                : 'The summary’s information-coverage level reflects completion of entered fields, not independent verification of evidence quality or accuracy.'}
            </p>
          </section>

          {/* 4. Scores par dimension */}
          <section className="print-section">
            <h2 className="font-display text-lg font-bold text-ceq-dark border-b-2 border-ceq-slate pb-2 mb-4">
              {t ? '4. Évaluation par dimension (MCDA 25/25/25/25)' : '4. Evaluation by Dimension (MCDA 25/25/25/25)'}
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

          {/* 5. Valeur économique */}
          {valeurTotale > 0 && (
            <section className="print-section">
              <h2 className="font-display text-lg font-bold text-ceq-dark border-b-2 border-ceq-slate pb-2 mb-4">
                {t ? '5. Valeur économique estimée' : '5. Estimated Economic Value'}
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
              {transparence?.risquesEvites?.length > 0 && (
                <div className="mb-4">
                  <h3 className="mb-2 text-sm font-semibold text-ceq-dark">
                    {t ? 'Détail des coûts évités estimés' : 'Estimated avoided-cost breakdown'}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px] text-xs">
                      <thead>
                        <tr className="bg-ceq-ice print:bg-gray-200">
                          <th className="px-3 py-2 text-left">{t ? 'Risque' : 'Risk'}</th>
                          <th className="px-3 py-2 text-right">{t ? 'Coût de référence' : 'Reference cost'}</th>
                          <th className="px-3 py-2 text-right">{t ? 'Probabilité' : 'Probability'}</th>
                          <th className="px-3 py-2 text-right">{t ? 'Contribution' : 'Contribution'}</th>
                          <th className="px-3 py-2 text-right">{t ? 'Estimation' : 'Estimate'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transparence.risquesEvites.map((risk, index) => (
                          <tr key={`${risk.type}-${index}`} className="border-b border-ceq-iceDark">
                            <td className="px-3 py-2">{riskLabels[risk.type] || risk.type}</td>
                            <td className="px-3 py-2 text-right">{formatMontant(risk.base, lang)}</td>
                            <td className="px-3 py-2 text-right">{Math.round(risk.prob * 100)} %</td>
                            <td className="px-3 py-2 text-right">{Math.round(risk.contrib * 100)} %</td>
                            <td className="px-3 py-2 text-right font-semibold">{formatMontant(risk.valeur, lang)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {transparence.scenarioSansProjet && (
                    <p className="mt-3 rounded-lg bg-ceq-ice p-3 text-xs text-ceq-slate">
                      <strong>{t ? 'Scénario sans le projet :' : 'Counterfactual without the project:'}</strong>{' '}
                      {transparence.scenarioSansProjet}
                    </p>
                  )}
                  {transparence.sourceCoutsEvites && (
                    <p className="mt-2 text-xs text-ceq-slate">
                      <strong>{t ? 'Source des coûts :' : 'Cost source:'}</strong>{' '}
                      {transparence.sourceCoutsEvites}
                    </p>
                  )}
                  {transparence.risquesEvites.some(risk => risk.preuve) && (
                    <ul className="mt-2 space-y-1 text-xs text-ceq-slate">
                      {transparence.risquesEvites.filter(risk => risk.preuve).map((risk, index) => (
                        <li key={`${risk.type}-evidence-${index}`}>
                          <strong>{riskLabels[risk.type] || risk.type} — </strong>{risk.preuve}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              <div className="flex items-start gap-2 rounded-xl border border-ceq-iceDark bg-ceq-ice p-3 text-xs text-ceq-slate">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-ceq-slate" aria-hidden="true" />
                <span>{t
                  ? 'Ces valeurs sont des estimations à des fins de plaidoyer et de communication. Elles ne constituent pas une valeur comptable ou financière vérifiée.'
                  : 'These values are estimates for advocacy and communication purposes. They do not constitute verified accounting or financial values.'}</span>
              </div>
            </section>
          )}

          {/* 6. Recommandations */}
          {recommandations?.length > 0 && (
            <section className="print-section">
              <h2 className="font-display text-lg font-bold text-ceq-dark border-b-2 border-ceq-slate pb-2 mb-4">
                {t ? '6. Recommandations prioritaires' : '6. Priority Recommendations'}
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