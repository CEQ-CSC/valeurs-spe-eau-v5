'use client'
import LikertScale from '@/components/ui/LikertScale'

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
        aide={t?'Formations reçues, nouvelles compétences acquises, changements de connaissances':'Training received, new skills acquired, knowledge changes'} lang={lang} />
      <LikertScale name="inclusion" value={data.inclusion} onChange={onChange} options={opts}
        label={t?'Inclusion et diversité des participants (âge, origine, expertise)':'Inclusion and participant diversity (age, background, expertise)'} lang={lang} />
      <LikertScale name="rayonnement" value={data.rayonnement} onChange={onChange} options={opts}
        label={t?'Rayonnement et notoriété dans la communauté locale':'Community outreach and local recognition'} lang={lang} />
      <LikertScale name="transfert" value={data.transfert} onChange={onChange} options={opts}
        label={t?'Transfert des connaissances vers d\'autres organisations':'Knowledge transfer to other organizations'} lang={lang} />
      
      <div className="border-t border-ceq-iceDark pt-4 mt-2">
        <section className="mb-5 rounded-xl border border-ceq-iceDark bg-ceq-ice p-4">
          <h3 className="text-sm font-bold text-ceq-dark">
            {t ? 'Parcours des effets observés' : 'Pathway of observed effects'}
          </h3>
          <p className="mb-3 mt-1 text-xs leading-relaxed text-ceq-slate">
            {t
              ? 'Décrivez les étapes observées, de la sensibilisation aux changements à long terme. Une contribution du projet ne signifie pas à elle seule une causalité démontrée. Les champs sont facultatifs et ne modifient pas le score.'
              : 'Describe observed stages, from awareness to long-term change. Project contribution alone does not establish causality. These optional fields do not change the score.'}
          </p>
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
            <label className="label-ceq">{t?'Participants total (toutes années)':'Total participants (all years)'}</label>
            <input type="number" min="0" value={data.nbParticipants??''} placeholder="0" onChange={e=>onChange('nbParticipants',e.target.value)} className={inp} />
          </div>
          <div>
            <label className="label-ceq">{t?'Bénévoles actifs (année courante)':'Active volunteers (current year)'}</label>
            <input type="number" min="0" value={data.nbBenevoles??''} placeholder="0" onChange={e=>onChange('nbBenevoles',e.target.value)} className={inp} />
          </div>
          <div>
            <label className="label-ceq">{t?'Participants évalués avant/après':'Participants assessed before/after'}</label>
            <input type="number" min="0" value={data.nbParticipantsAvantApres??''} placeholder="0" onChange={e=>onChange('nbParticipantsAvantApres',e.target.value)} className={inp} />
          </div>
        </div>
        <div className="mt-3">
          <label className="label-ceq">{t?'Outil ou méthode d’évaluation des apprentissages (facultatif)':'Learning assessment tool or method (optional)'}</label>
          <input type="text" maxLength="300" value={data.outilEvaluationApprentissage||''} onChange={e=>onChange('outilEvaluationApprentissage',e.target.value)} placeholder={t?'Ex. questionnaire avant/après, entrevue, démonstration de compétence':'E.g. pre/post questionnaire, interview, skills demonstration'} className={inp} />
        </div>
        <div>
          <label className="label-ceq">{t?'Heures de bénévolat par année (total)':'Annual volunteer hours (total)'}</label>
          <input type="number" min="0" value={data.heuresTotal??''} placeholder="0" onChange={e=>onChange('heuresTotal',e.target.value)} className={inp} />
        </div>
        
        <p className="text-xs text-ceq-slate mb-2 italic mt-4">{t?'Sous-totaux optionnels (si connus) :':'Optional sub-totals (if known):'}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="label-ceq text-xs">{t?'Formation':'Training'}</label>
            <input type="number" min="0" value={data.heuresFormation??''} placeholder="0" onChange={e=>onChange('heuresFormation',e.target.value)} className={inp+" text-sm"} />
            <p className="text-[11px] text-ceq-slate/70 mt-1 leading-tight">
              {t?'Heures consacrées à développer, former et apprendre les protocoles.':'Hours spent, to design and implement learning protocols and training.'}
            </p>
          </div>
          <div>
            <label className="label-ceq text-xs">{t?'Terrain':'Fieldwork'}</label>
            <input type="number" min="0" value={data.heuresTerrain??''} placeholder="0" onChange={e=>onChange('heuresTerrain',e.target.value)} className={inp+" text-sm"} />
            <p className="text-[11px] text-ceq-slate/70 mt-1 leading-tight">
              {t?'Heures de prélèvement et d\'échantillonnage au bord de l\'eau.':'Hours spent sampling and collecting water data.'}
            </p>
          </div>
          <div>
            <label className="label-ceq text-xs">{t?'Coordination':'Coordination'}</label>
            <input type="number" min="0" value={data.heuresCoordination??''} placeholder="0" onChange={e=>onChange('heuresCoordination',e.target.value)} className={inp+" text-sm"} />
            <p className="text-[11px] text-ceq-slate/70 mt-1 leading-tight">
              {t?'Heures de gestion, logistique et animation du réseau.':'Hours spent on management, logistics, and network facilitation.'}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <label className="label-ceq">{t?'Taux de rétention des bénévoles (%)':'Volunteer retention rate (%)'}</label>
          <div className="relative">
            <input type="number" min="0" max="100" value={data.retentionPct??''} placeholder={t?'Non renseigné':'Not specified'} onChange={e=>onChange('retentionPct',e.target.value)} className={inp+" pr-8"} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-ceq-slate">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}