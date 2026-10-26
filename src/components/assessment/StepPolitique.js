'use client'
import LikertScale from '@/components/ui/LikertScale'
import InfoTooltip from '@/components/ui/InfoTooltip'

export default function StepPolitique({ data, onChange, lang }) {
  const t = lang==='fr';
  const opts = lang==='fr'
    ? [{v:1,l:'Très faible'},{v:2,l:'Faible'},{v:3,l:'Modéré'},{v:4,l:'Élevé'},{v:5,l:'Très élevé'}]
    : [{v:1,l:'Very low'},{v:2,l:'Low'},{v:3,l:'Moderate'},{v:4,l:'High'},{v:5,l:'Very high'}];
  const inp = "input-ceq";
  const influenceOpts = lang==='fr' ? [
    {v:1,l:'1 — Information (données diffusées)'},
    {v:2,l:'2 — Consultation (données utilisées en consultation)'},
    {v:3,l:'3 — Recommandation (citées dans recommandation officielle)'},
    {v:4,l:'4 — Décision (ont influencé une décision)'},
    {v:5,l:'5 — Changement de politique (ont généré un changement durable)'},
  ] : [
    {v:1,l:'1 — Information (data disseminated)'},
    {v:2,l:'2 — Consultation (data used in consultation)'},
    {v:3,l:'3 — Recommendation (cited in official recommendation)'},
    {v:4,l:'4 — Decision (influenced a decision)'},
    {v:5,l:'5 — Policy change (generated lasting change)'},
  ];
  return (
    <div className="space-y-1">
      <div className="mb-6">
        <label className="label-ceq">
          {t?'Niveau maximal d\'influence atteint sur les décisions':'Maximum influence level reached on decisions'}
          <InfoTooltip
            label={t ? 'Information sur le niveau d’influence' : 'Information about the influence level'}
            text={t ? 'Choisissez le niveau le plus élevé appuyé par une preuve : information, consultation, recommandation, décision ou changement de politique. La diffusion seule correspond à l’information; une influence sur une décision exige un lien documenté.' : 'Choose the highest level supported by evidence: information, consultation, recommendation, decision, or policy change. Dissemination alone is information; influence on a decision requires a documented link.'}
          />
        </label>
        <select value={data.niveauInfluence||''} onChange={e=>onChange('niveauInfluence',e.target.value)} className={inp+" cursor-pointer"}>
          <option value="">{t?'— Non renseigné —':'— Not specified —'}</option>
          {influenceOpts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
      </div>
      <LikertScale name="instancesGouvernance" value={data.instancesGouvernance} onChange={onChange} options={opts}
        label={t?'Participation aux instances de gouvernance de l\'eau (comités, tables de concertation, OBV)':'Participation in water governance bodies (committees, concertation tables, OBV)'}
        info={t?'Évaluez la participation réelle du projet aux espaces où se discutent la gestion et les décisions liées à l’eau.':'Rate the project’s actual participation in forums where water management and related decisions are discussed.'} lang={lang} />
      <LikertScale name="partenariatsFormels" value={data.partenariatsFormels} onChange={onChange} options={opts}
        label={t?'Partenariats formels avec des institutions (ententes, protocoles signés)':'Formal partnerships with institutions (signed agreements, protocols)'}
        info={t?'Comptez les collaborations appuyées par une entente, un protocole ou un engagement formel, et non les contacts ponctuels.':'Count collaborations supported by an agreement, protocol, or formal commitment, not occasional contacts.'} lang={lang} />
      <LikertScale name="visibilitePublique" value={data.visibilitePublique} onChange={onChange} options={opts}
        label={t?'Visibilité publique et médiatique':'Public and media visibility'}
        info={t?'Tenez compte des communications publiques et médiatiques effectivement réalisées, pas seulement de la présence sur les réseaux sociaux.':'Consider public and media coverage that actually occurred, not merely a social media presence.'} lang={lang} />
      <LikertScale name="mobilisationReseau" value={data.mobilisationReseau} onChange={onChange} options={opts}
        label={t?'Connexion et contribution au réseau de science participative':'Connection and contribution to the participatory science network'}
        info={t?'Évaluez les échanges, collaborations et ressources partagées avec d’autres projets. Ce facteur favorise la diffusion et n’augmente pas directement le score intrinsèque.':'Rate exchanges, collaborations, and resources shared with other projects. This supports dissemination and does not directly increase the intrinsic score.'}
        lang={lang} />
      <div className="border-t border-ceq-iceDark pt-4 mt-2">
        <p className="text-xs font-bold text-ceq-slate uppercase tracking-wide mb-3">{t?'Données quantitatives':'Quantitative Data'}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-ceq">
              {t?'Décisions institutionnelles influencées':'Institutional decisions influenced'}
              <InfoTooltip label={t?'Information sur les décisions influencées':'Information about influenced decisions'} text={t?'Nombre de décisions distinctes pour lesquelles les données ou recommandations du projet ont joué un rôle documenté.':'Number of distinct decisions in which project data or recommendations played a documented role.'} />
            </label>
            <input type="number" min="0" value={data.nbDecisionsInfluencees??''} placeholder="0" onChange={e=>onChange('nbDecisionsInfluencees',e.target.value)} className={inp} />
          </div>
          <div className="flex items-start gap-3 pt-5">
            <input type="checkbox" id="membreCEQ" checked={!!data.membreCEQ} onChange={e=>onChange('membreCEQ',e.target.checked)} className="mt-1 w-5 h-5 accent-ceq-cyan rounded cursor-pointer" />
            <label htmlFor="membreCEQ" className="text-sm font-semibold text-ceq-dark cursor-pointer leading-tight">
              {t?'Membre du Collectif Eau Québec':'Member of Collectif Eau Québec'}
            </label>
            <InfoTooltip
              label={t ? 'Information sur l’adhésion au Collectif' : 'Information about membership'}
              text={t ? 'Cette information sert de facteur de diffusion et n’est pas incluse dans le score.' : 'This information is used as a dissemination factor and is not included in the score.'}
            />
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-ceq-iceDark bg-ceq-ice p-4">
          <label className="label-ceq" htmlFor="preuve-influence">
            {t ? 'Référence d’une consultation, décision ou politique (facultatif)' : 'Reference for a consultation, decision or policy (optional)'}
            <InfoTooltip label={t ? 'Information sur la référence d’influence' : 'Information about the influence reference'} text={t ? 'Indiquez le titre, l’organisme, la date ou le lien qui permet de vérifier le niveau d’influence déclaré.' : 'Provide the title, organization, date, or link that can verify the stated influence level.'} />
          </label>
          <textarea
            id="preuve-influence"
            rows={2}
            maxLength={500}
            value={data.referenceInfluence||''}
            onChange={e=>onChange('referenceInfluence',e.target.value)}
            placeholder={t ? 'Ex. procès-verbal, rapport, résolution ou URL' : 'E.g. minutes, report, resolution or URL'}
            className={inp+" resize-y"}
          />
        </div>
      </div>
    </div>
  );
}
