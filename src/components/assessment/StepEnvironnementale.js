'use client'
import LikertScale from '@/components/ui/LikertScale'
import { useState } from 'react'

const TYPES_RISQUES = {
  fr: [
    { v:'contamination_eau_potable', l:'Contamination eau potable' },
    { v:'proliferation_algues',       l:'Prolifération de cyanobactéries' },
    { v:'deversement_accidentel',     l:'Déversement accidentel' },
    { v:'fermeture_plage',            l:'Fermeture de plage' },
    { v:'effondrement_espece',           l:'Effondrement d\'une espèce' },
    { v:'invasion_espece',            l:'Invasion par une espèce' },
    { v:'erosion_berges',             l:'Érosion des berges' },
  ],
  en: [
    { v:'contamination_eau_potable', l:'Drinking water contamination' },
    { v:'proliferation_algues',       l:'Cyanobacteria bloom' },
    { v:'deversement_accidentel',     l:'Accidental spill' },
    { v:'fermeture_plage',            l:'Beach closure' },
    { v:'effondrement_espece',           l:'Species collapse' },
    { v:'invasion_espece',            l:'Species invasion' },
    { v:'erosion_berges',             l:'Riverbank erosion' },
  ]
};

export default function StepEnvironnementale({ data, onChange, lang }) {
  const t = lang==='fr';
  const opts = lang==='fr'
    ? [{v:1,l:'Très faible'},{v:2,l:'Faible'},{v:3,l:'Modéré'},{v:4,l:'Élevé'},{v:5,l:'Très élevé'}]
    : [{v:1,l:'Very low'},{v:2,l:'Low'},{v:3,l:'Moderate'},{v:4,l:'High'},{v:5,l:'Very high'}];
  const inp = "input-ceq";
  const risques = data.risquesActifs||[];

  const addRisque = () => onChange('risquesActifs', [...risques, { type:'contamination_eau_potable', population:1000, contribution:0.5 }]);
  const removeRisque = (i) => onChange('risquesActifs', risques.filter((_,j)=>j!==i));
  const updateRisque = (i,k,v) => { const r=[...risques]; r[i]={...r[i],[k]:v}; onChange('risquesActifs',r); };

  return (
    <div className="space-y-1">
      <LikertScale name="couvertureTerritoriale" value={data.couvertureTerritoriale} onChange={onChange} options={opts}
        label={t?'Couverture et représentativité du territoire surveillé':'Coverage and representativeness of monitored territory'} lang={lang} />
      <LikertScale name="diversiteMilieux" value={data.diversiteMilieux} onChange={onChange} options={opts}
        label={t?'Diversité des milieux surveillés (lac, rivière, milieu humide, etc.)':'Diversity of monitored environments (lake, river, wetland, etc.)'} lang={lang} />
      <LikertScale name="detectionRisques" value={data.detectionRisques} onChange={onChange} options={opts}
        label={t?'Capacité de détection précoce de risques environnementaux':'Early environmental risk detection capacity'}
        aide={t?'Protocoles de signalement, liens avec les autorités, historique de détections':'Reporting protocols, links with authorities, detection history'} lang={lang} />
      <LikertScale name="servicesEco" value={data.servicesEco} onChange={onChange} options={opts}
        label={t?'Documentation des services écosystémiques (épuration, régulation, biodiversité)':'Ecosystem services documentation (purification, regulation, biodiversity)'} lang={lang} />
      <LikertScale name="contributionPDE" value={data.contributionPDE} onChange={onChange} options={opts}
        label={t?'Contribution aux Plans directeurs de l\'eau (PDE)':'Contribution to watershed master plans (OBV)'} lang={lang} />

      <div className="border-t border-ceq-iceDark pt-4 mt-2">
        <p className="text-xs font-bold text-ceq-slate uppercase tracking-wide mb-3">{t?'Données quantitatives':'Quantitative Data'}</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="label-ceq">{t?'Milieux humides surveillés (ha)':'Monitored wetlands (ha)'}</label>
            <input type="number" min="0" value={data.nbMilieuxHumides??''} placeholder="0" onChange={e=>onChange('nbMilieuxHumides',e.target.value)} className={inp} />
          </div>
          <div>
            <label className="label-ceq">{t?'Cours d\'eau surveillés (km linéaires)':'Monitored waterways (linear km)'}</label>
            <input type="number" min="0" value={data.nbKmCoursDeau??''} placeholder="0" onChange={e=>onChange('nbKmCoursDeau',e.target.value)} className={inp} />
          </div>
        </div>
        <div className="mb-4">
          <label className="label-ceq">{t?'Valeur écosystémique':'Ecosystem value'}</label>
          <p className="text-xs text-ceq-slate mb-2 italic">{t?'Ajuste la valeur estimée (mesurée = 100%, inconnue = 20%)':'Adjusts estimated value (measured = 100%, unknown = 20%)'}</p>
          <select value={data.preuveEcosystemique||'declare'} onChange={e=>onChange('preuveEcosystemique',e.target.value)} className={inp+" cursor-pointer"}>
            {(t?[['mesure','Mesurée (instruments calibrés)'],['documente','Documentée (rapport ou archive)'],['verifie','Estimée ou vérifiée par un tiers'],['declare','Déclarative (sans documentation)'],['inconnu','Non renseignée ou inconnue']]:
            [['mesure','Measured (calibrated instruments)'],['documente','Documented (report or archive)'],['verifie','Estimated or third-party verified'],['declare','Self-reported (no documentation)'],['inconnu','Not specified or unknown']])
            .map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        {/* Risques probabilistes */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-amber-800">{t?'Coûts évités':'Avoided costs'}</p>
            <button type="button" onClick={addRisque} className="text-xs bg-ceq-dark text-white px-3 py-1.5 rounded-lg hover:bg-ceq-slate transition-all">
              + {t?'Ajouter un risque':'Add risk'}
            </button>
          </div>
          <p className="text-xs text-amber-700 mb-3 italic">{t?'N\'indiquez que les risques pour lesquels votre projet a joué un rôle de détection documenté.':'Only include risks for which your project has played a documented detection role.'}</p>
          {risques.map((r,i)=>(
            <div key={i} className="bg-white rounded-xl border border-amber-200 p-3 mb-2">
              <div className="flex justify-between items-start mb-2">
                <select value={r.type} onChange={e=>updateRisque(i,'type',e.target.value)} className="text-xs border rounded-lg px-2 py-1.5 text-ceq-dark flex-1 mr-2">
                  {TYPES_RISQUES[lang].map(opt=><option key={opt.v} value={opt.v}>{opt.l}</option>)}
                </select>
                <button type="button" onClick={()=>removeRisque(i)} className="text-ceq-confLow text-xs px-2 py-1 hover:bg-red-50 rounded">✕</button>
              </div>
              {r.type==='contamination_eau_potable'&&(
                <div className="mb-2">
                  <label className="text-xs text-ceq-slate">{t?'Population concernée (hab.)':'Population concerned (inhabitants)'}</label>
                  <input type="number" min="0" value={r.population??1000} onChange={e=>updateRisque(i,'population',e.target.value)} className="w-full text-xs border rounded-lg px-2 py-1.5 mt-1" />
                </div>
              )}
              <div>
                <label className="text-xs text-ceq-slate">{t?'Contribution estimée de votre SPE (0 à 1)':'Estimated SPE contribution (0 to 1)'}</label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="range" min="0" max="1" step="0.05" value={r.contribution??0.5} onChange={e=>updateRisque(i,'contribution',parseFloat(e.target.value))} className="flex-1" />
                  <span className="text-xs font-bold text-ceq-dark w-8">{Math.round((r.contribution??0.5)*100)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}