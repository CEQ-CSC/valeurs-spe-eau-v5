'use client'
import LikertScale from '@/components/ui/LikertScale'
import InfoTooltip from '@/components/ui/InfoTooltip'
import { BENEVOLE } from '@/data/referenceCosts'

const PARCOURS_IMPACT = {
  fr: [
    ['sensibilisation', 'Sensibilisation ou accès à l’information'],
    ['apprentissage', 'Apprentissage, connaissances ou attitudes'],
    ['mobilisation', 'Mobilisation ou changement de pratiques'],
    ['decision', 'Utilisation dans une décision ou une action'],
    ['changement', 'Changement social ou environnemental à long terme'],
  ],
  en: [
    ['sensibilisation', 'Awareness or access to information'],
    ['apprentissage', 'Learning, knowledge or attitudes'],
    ['mobilisation', 'Mobilization or change in practices'],
    ['decision', 'Use in a decision or action'],
    ['changement', 'Long-term social or environmental change'],
  ],
};

export default function StepSociale({ data, onChange, lang }) {
  const t = lang==='fr';
  const inp = "input-ceq";
  const opts = lang==='fr'
    ? [{v:1,l:'Très faible'},{v:2,l:'Faible'},{v:3,l:'Modéré'},{v:4,l:'Élevé'},{v:5,l:'Très élevé'}]
    : [{v:1,l:'Very low'},{v:2,l:'Low'},{v:3,l:'Moderate'},{v:4,l:'High'},{v:5,l:'Very high'}];
  
  return (
    <div className="space-y-1">
      <LikertScale name="apprentissage" value={data.apprentissage} onChange={onChange} options={opts}
        label={t?'Apprentissage et développement des compétences des participants':'Learning and skill development of participants'}
        info={t?'Appréciez les apprentissages ou compétences acquis grâce au projet (formations reçues, nouvelles compétences ou changements de connaissances); privilégiez les résultats observés ou évalués plutôt que le nombre de formations offertes.':'Rate learning or skills gained through the project (training received, new skills, or changes in knowledge); focus on observed or assessed outcomes rather than the number of training sessions.'} lang={lang} />
      <LikertScale name="inclusion" value={data.inclusion} onChange={onChange} options={opts}
        label={t?'Inclusion et diversité des participants (âge, origine, expertise)':'Inclusion and participant diversity (age, background, expertise)'}
        info={t?'Tenez compte de la diversité des personnes rejointes et de l’accessibilité de la participation, selon les groupes pertinents pour votre territoire.':'Consider the diversity of people reached and the accessibility of participation for groups relevant to your area.'} lang={lang} />
      <LikertScale name="rayonnement" value={data.rayonnement} onChange={onChange} options={opts}
        label={t?'Rayonnement et notoriété dans la communauté locale':'Community outreach and local recognition'}
        info={t?'Évaluez la portée et la reconnaissance du projet dans la communauté, avec des exemples comme des activités publiques, des demandes d’information ou des mentions médiatiques.':'Rate the project’s reach and recognition in the community, using examples such as public events, information requests, or media mentions.'} lang={lang} />
      <LikertScale name="transfert" value={data.transfert} onChange={onChange} options={opts}
        label={t?'Transfert des connaissances vers d\'autres organisations':'Knowledge transfer to other organizations'}
        info={t?'Considérez les connaissances, outils ou méthodes effectivement transmis et repris par d’autres organisations.':'Consider knowledge, tools, or methods actually shared with and adopted by other organizations.'} lang={lang} />
      
      <div className="border-t border-ceq-iceDark pt-4 mt-2">
        <section className="mb-5 rounded-xl border border-ceq-iceDark bg-ceq-ice p-4">
          <h3 className="text-sm font-bold text-ceq-dark">
            {t ? 'Parcours des effets observés' : 'Pathway of observed effects'}
            <InfoTooltip
              label={t ? 'Information sur le parcours des effets' : 'Information about the pathway of effects'}
              text={t
                ? 'Décrivez les étapes observées, de la sensibilisation aux changements à long terme. Une contribution plausible ne prouve pas à elle seule un lien de causalité; ces champs sont facultatifs et n’influencent pas le score.'
                : 'Describe observed stages from awareness to long-term change. A plausible contribution alone does not prove causation; these fields are optional and do not affect the score.'}
            />
          </h3>
          <div className="space-y-3">
            {PARCOURS_IMPACT[lang].map(([key, label]) => (
              <div key={key} className="grid gap-2 rounded-lg border border-ceq-iceDark bg-white p-3 md:grid-cols-[minmax(0,1fr)_13rem]">
                <label className="text-xs font-semibold text-ceq-dark" htmlFor={`impact-${key}`}>{label}</label>
                <select
                  id={`impact-${key}`}
                  value={data[`parcours_${key}`] || 'non_observe'}
                  onChange={event => onChange(`parcours_${key}`, event.target.value)}
                  className="input-ceq py-2 text-xs"
                >
                  <option value="non_observe">{t ? 'Non observé / inconnu' : 'Not observed / unknown'}</option>
                  <option value="plausible">{t ? 'Plausible, à vérifier' : 'Plausible, to verify'}</option>
                  <option value="observe">{t ? 'Observé' : 'Observed'}</option>
                  <option value="documente">{t ? 'Documenté par une preuve' : 'Documented with evidence'}</option>
                </select>
                <input
                  type="text"
                  maxLength={300}
                  value={data[`preuve_${key}`] || ''}
                  onChange={event => onChange(`preuve_${key}`, event.target.value)}
                  placeholder={t ? 'Ex. observation, témoignage ou référence (facultatif)' : 'E.g. observation, testimony or reference (optional)'}
                  className="input-ceq py-2 text-xs md:col-span-2"
                />
              </div>
            ))}
          </div>
        </section>
        <p className="text-xs font-bold text-ceq-slate uppercase tracking-wide mb-3">{t?'Chiffres clés':'Key Figures'}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-ceq">
              {t?'Participants total (toutes années)':'Total participants (all years)'}
              <InfoTooltip label={t?'Information sur le nombre de participants':'Information about participant count'} text={t?'Nombre total de personnes ayant participé au projet depuis son début. Une même personne ne devrait être comptée qu’une fois si vous pouvez l’identifier.':'Total number of people who have participated since the project began. Count each person once when you can identify them.'} />
            </label>
            <input type="number" min="0" value={data.nbParticipants??''} placeholder="0" onChange={e=>onChange('nbParticipants',e.target.value)} className={inp} />
          </div>
          <div>
            <label className="label-ceq">
              {t?'Bénévoles actifs (année courante)':'Active volunteers (current year)'}
              <InfoTooltip label={t?'Information sur les bénévoles actifs':'Information about active volunteers'} text={t?'Nombre de bénévoles ayant contribué au moins une fois pendant l’année évaluée. Ce chiffre peut différer du total des participants cumulés.':'Number of volunteers who contributed at least once during the evaluation year. This may differ from the cumulative participant count.'} />
            </label>
            <input type="number" min="0" value={data.nbBenevoles??''} placeholder="0" onChange={e=>onChange('nbBenevoles',e.target.value)} className={inp} />
          </div>
          <div>
            <label className="label-ceq">
              {t?'Participants évalués avant/après':'Participants assessed before/after'}
              <InfoTooltip label={t?'Information sur les évaluations avant-après':'Information about pre/post assessments'} text={t?'Nombre de personnes ayant répondu à une mesure avant et après une activité ou une période afin d’observer un changement.':'Number of people assessed both before and after an activity or period to identify change.'} />
            </label>
            <input type="number" min="0" value={data.nbParticipantsAvantApres??''} placeholder="0" onChange={e=>onChange('nbParticipantsAvantApres',e.target.value)} className={inp} />
          </div>
        </div>
        <div className="mt-3">
          <label className="label-ceq">
            {t?'Outil ou méthode d’évaluation des apprentissages (facultatif)':'Learning assessment tool or method (optional)'}
            <InfoTooltip label={t?'Information sur la méthode d’évaluation':'Information about the assessment method'} text={t?'Nommez brièvement l’outil utilisé pour vérifier les apprentissages : questionnaire, entrevue, observation de pratique ou autre méthode.':'Briefly name the tool used to assess learning: questionnaire, interview, observation of practice, or another method.'} />
          </label>
          <input type="text" maxLength="300" value={data.outilEvaluationApprentissage||''} onChange={e=>onChange('outilEvaluationApprentissage',e.target.value)} placeholder={t?'Ex. questionnaire avant/après, entrevue, démonstration de compétence':'E.g. pre/post questionnaire, interview, skills demonstration'} className={inp} />
        </div>
        <div>
          <label className="label-ceq">
            {t?'Heures de bénévolat par année (total)':'Annual volunteer hours (total)'}
            <InfoTooltip label={t?'Information sur les heures de bénévolat':'Information about volunteer hours'} text={t?'Total des heures bénévoles réalisées pendant l’année évaluée, toutes activités confondues. Les sous-totaux ci-dessous servent à répartir ces heures et ne doivent pas être ajoutés une seconde fois.':'Total volunteer hours during the evaluation year across all activities. The subtotals below break down these hours and must not be added again.'} />
          </label>
          <input type="number" min="0" value={data.heuresTotal??''} placeholder="0" onChange={e=>onChange('heuresTotal',e.target.value)} className={inp} />
        </div>

        <div>
          <label className="label-ceq">
            {t?'Taux horaire des bénévoles':'Volunteer hourly rate'}
            <InfoTooltip label={t?'Information sur le taux horaire':'Information about the hourly rate'} text={t?'Choisissez un taux de référence ou saisissez une estimation locale du coût de remplacement d’une heure de bénévolat.':'Choose a reference rate or enter a local estimate of the replacement cost for one volunteer hour.'} />
          </label>
          <select
            value={data.tauxHoraireBenevole??String(BENEVOLE.tauxHoraire.valeur)}
            onChange={e=>onChange('tauxHoraireBenevole',e.target.value)}
            className={inp+" cursor-pointer"}
          >
            <option value={BENEVOLE.tauxHoraire.intervalle[0]}>
              {t?'Taux minimal de référence':'Lower reference rate'} ({BENEVOLE.tauxHoraire.intervalle[0].toFixed(2)} $/h)
            </option>
            <option value={BENEVOLE.tauxHoraire.valeur}>
              {t?'Taux moyen de référence':'Average reference rate'} ({BENEVOLE.tauxHoraire.valeur.toFixed(2)} $/h)
            </option>
            <option value={BENEVOLE.tauxHoraire.intervalle[1]}>
              {t?'Taux maximal de référence':'Upper reference rate'} ({BENEVOLE.tauxHoraire.intervalle[1].toFixed(2)} $/h)
            </option>
            <option value="custom">{t?'Autre taux — saisir un montant':'Other rate — enter an amount'}</option>
          </select>
          {data.tauxHoraireBenevole==='custom' && (
            <div className="mt-2">
              <label className="label-ceq text-xs">
                {t?'Taux personnalisé ($/h)':'Custom rate ($/h)'}
                <InfoTooltip label={t?'Information sur le taux personnalisé':'Information about the custom rate'} text={t?'Saisissez le coût estimé pour remplacer une heure de bénévolat. Si le champ reste vide, le moteur utilise 0 $/h.':'Enter the estimated replacement cost for one volunteer hour. If left blank, the calculator uses $0/hour.'} />
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={data.tauxHoraireBenevolePersonnalise??''}
                placeholder="0.00"
                onChange={e=>onChange('tauxHoraireBenevolePersonnalise',e.target.value)}
                className={inp}
              />
            </div>
          )}
        </div>
        
        <div className="mb-2 mt-4 flex items-center text-xs text-ceq-slate">
          {t?'Sous-totaux optionnels (si connus)':'Optional subtotals (if known)'}
          <InfoTooltip
            label={t ? 'Information sur les sous-totaux' : 'Information about subtotals'}
            text={t ? 'Répartissez le total d’heures entre les catégories ci-dessous si vous les connaissez. Chaque sous-total est déjà compris dans les heures totales; ne les additionnez pas une seconde fois.' : 'Break down total hours into the categories below if known. Each subtotal is already included in total hours; do not add them again.'}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="label-ceq text-xs">
              {t?'Formation':'Training'}
              <InfoTooltip label={t?'Information sur les heures de formation':'Information about training hours'} text={t?'Heures bénévoles consacrées à préparer ou suivre des activités de formation et d’apprentissage des protocoles. Elles sont déjà incluses dans le total.':'Volunteer hours spent preparing or attending training and learning project protocols. These hours are already included in the total.'} />
            </label>
            <input type="number" min="0" value={data.heuresFormation??''} placeholder="0" onChange={e=>onChange('heuresFormation',e.target.value)} className={inp+" text-sm"} />
          </div>
          <div>
            <label className="label-ceq text-xs">
              {t?'Terrain':'Fieldwork'}
              <InfoTooltip label={t?'Information sur les heures de terrain':'Information about fieldwork hours'} text={t?'Heures bénévoles passées sur le terrain, par exemple pour les prélèvements et l’échantillonnage. Elles sont déjà incluses dans le total.':'Volunteer hours spent in the field, for example collecting samples and observations. These hours are already included in the total.'} />
            </label>
            <input type="number" min="0" value={data.heuresTerrain??''} placeholder="0" onChange={e=>onChange('heuresTerrain',e.target.value)} className={inp+" text-sm"} />
          </div>
          <div>
            <label className="label-ceq text-xs">
              {t?'Coordination':'Coordination'}
              <InfoTooltip label={t?'Information sur les heures de coordination':'Information about coordination hours'} text={t?'Heures bénévoles consacrées à la gestion, à la logistique et à l’animation du réseau. Elles sont déjà incluses dans le total.':'Volunteer hours spent on management, logistics, and network coordination. These hours are already included in the total.'} />
            </label>
            <input type="number" min="0" value={data.heuresCoordination??''} placeholder="0" onChange={e=>onChange('heuresCoordination',e.target.value)} className={inp+" text-sm"} />
          </div>
        </div>

        <div className="mt-4">
          <label className="label-ceq">
            {t?'Taux de rétention des bénévoles (%)':'Volunteer retention rate (%)'}
            <InfoTooltip label={t?'Information sur le taux de rétention':'Information about the retention rate'} text={t?'Pourcentage des bénévoles d’une période de référence qui sont revenus contribuer à la période suivante. Si vous ne pouvez pas l’estimer, laissez le champ vide.':'Percentage of volunteers from a reference period who returned in the following period. Leave blank if you cannot estimate it.'} />
          </label>
          <div className="relative">
            <input type="number" min="0" max="100" value={data.retentionPct??''} placeholder={t?'Non renseigné':'Not specified'} onChange={e=>onChange('retentionPct',e.target.value)} className={inp+" pr-8"} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-ceq-slate">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}