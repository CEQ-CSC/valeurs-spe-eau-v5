'use client'
import LikertScale from '@/components/ui/LikertScale'

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
      <div className="bg-ceq-ice border border-ceq-iceDark rounded-xl p-4 text-xs text-ceq-slate mb-4">
        <strong>{t?'Échelle d\'influence :':'Influence scale:'}</strong>{' '}
        {t?'Information → Consultation → Recommandation → Décision → Changement de politique.':'Information → Consultation → Recommendation → Decision → Policy change.'}
      </div>
      <div className="mb-6">
        <label className="label-ceq">
          {t?'Niveau maximal d\'influence atteint sur les décisions':'Maximum influence level reached on decisions'}
        </label>
        <p className="text-xs text-ceq-slate mb-2 italic">{t?'Choisissez le niveau le plus élevé que vous pouvez documenter':'Choose the highest level you can document'}</p>
        <select value={data.niveauInfluence||''} onChange={e=>onChange('niveauInfluence',e.target.value)} className={inp+" cursor-pointer"}>
          <option value="">{t?'— Non renseigné —':'— Not specified —'}</option>
          {influenceOpts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
      </div>
      <LikertScale name="instancesGouvernance" value={data.instancesGouvernance} onChange={onChange} options={opts}
        label={t?'Participation aux instances de gouvernance de l\'eau (comités, tables de concertation, OBV)':'Participation in water governance bodies (committees, concertation tables, OBV)'} lang={lang} />
      <LikertScale name="partenariatsFormels" value={data.partenariatsFormels} onChange={onChange} options={opts}
        label={t?'Partenariats formels avec des institutions (ententes, protocoles signés)':'Formal partnerships with institutions (signed agreements, protocols)'} lang={lang} />
      <LikertScale name="visibilitePublique" value={data.visibilitePublique} onChange={onChange} options={opts}
        label={t?'Visibilité publique et médiatique':'Public and media visibility'} lang={lang} />
      <LikertScale name="mobilisationReseau" value={data.mobilisationReseau} onChange={onChange} options={opts}
        label={t?'Connexion et contribution au réseau de science participative':'Connection and contribution to the participatory science network'}
        aide={t?'Facteur de diffusion et de mutualisation (n\'augmente pas le score intrinsèque)':'Diffusion and pooling factor (does not increase intrinsic score)'} lang={lang} />
      <div className="border-t border-ceq-iceDark pt-4 mt-2">
        <p className="text-xs font-bold text-ceq-slate uppercase tracking-wide mb-3">{t?'Données quantitatives':'Quantitative Data'}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-ceq">{t?'Décisions institutionnelles influencées':'Institutional decisions influenced'}</label>
            <input type="number" min="0" value={data.nbDecisionsInfluencees??''} placeholder="0" onChange={e=>onChange('nbDecisionsInfluencees',e.target.value)} className={inp} />
          </div>
          <div className="flex items-start gap-3 pt-5">
            <input type="checkbox" id="membreCEQ" checked={!!data.membreCEQ} onChange={e=>onChange('membreCEQ',e.target.checked)} className="mt-1 w-5 h-5 accent-ceq-cyan rounded cursor-pointer" />
            <label htmlFor="membreCEQ" className="text-sm font-semibold text-ceq-dark cursor-pointer leading-tight">
              {t?'Membre du Collectif Eau Québec':'Member of Collectif Eau Québec'}
              <span className="block text-xs text-ceq-slate font-normal mt-0.5">{t?'(facteur de diffusion (pas pris en compte dans le score)':'(diffusion factor (not included in score)'}</span>
            </label>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-ceq-iceDark bg-ceq-ice p-4">
          <label className="label-ceq" htmlFor="preuve-influence">
            {t ? 'Référence d’une consultation, décision ou politique (facultatif)' : 'Reference for a consultation, decision or policy (optional)'}
          </label>
          <p className="mb-2 text-xs text-ceq-slate">
            {t
              ? 'Indiquez le titre, l’organisme, la date ou le lien permettant de vérifier le niveau d’influence déclaré.'
              : 'Add the title, organization, date or link to help verify the stated level of influence.'}
          </p>
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
