'use client'
import LikertScale from '@/components/ui/LikertScale'

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
        <p className="text-xs font-bold text-ceq-slate uppercase tracking-wide mb-3">📊 {t?'Chiffres clés':'Key Figures'}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-ceq">{t?'Participants total (toutes années)':'Total participants (all years)'}</label>
            <input type="number" min="0" value={data.nbParticipants??''} placeholder="0" onChange={e=>onChange('nbParticipants',e.target.value)} className={inp} />
          </div>
          <div>
            <label className="label-ceq">{t?'Bénévoles actifs (année courante)':'Active volunteers (current year)'}</label>
            <input type="number" min="0" value={data.nbBenevoles??''} placeholder="0" onChange={e=>onChange('nbBenevoles',e.target.value)} className={inp} />
          </div>
        </div>
        <div>
          <label className="label-ceq">{t?'Heures de bénévolat par année (total)':'Annual volunteer hours (total)'}</label>
          <input type="number" min="0" value={data.heuresTotal??''} placeholder="0" onChange={e=>onChange('heuresTotal',e.target.value)} className={inp} />
        </div>
        <p className="text-xs text-ceq-slate mb-2 italic">{t?'Sous-totaux optionnels (si connus) :':'Optional sub-totals (if known):'}</p>
        <div className="grid grid-cols-3 gap-3">
          {[['heuresFormation',t?'Formation':'Training'],['heuresTerrain',t?'Terrain':'Fieldwork'],['heuresCoordination',t?'Coordination':'Coordination']].map(([n,l])=>(
            <div key={n}>
              <label className="label-ceq text-xs">{l}</label>
              <input type="number" min="0" value={data[n]??''} placeholder="0" onChange={e=>onChange(n,e.target.value)} className={inp+" text-sm"} />
            </div>
          ))}
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
