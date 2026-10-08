'use client'
import LikertScale from '@/components/ui/LikertScale'

export default function StepScientifique({ data, onChange, lang }) {
  const t = lang==='fr';
  const inp = "input-ceq";
  const opts = lang==='fr'
    ? [{v:1,l:'Très faible / absent'},{v:2,l:'Faible / limité'},{v:3,l:'Modéré'},{v:4,l:'Élevé / bien établi'},{v:5,l:'Très élevé / exemplaire'}]
    : [{v:1,l:'Very low / absent'},{v:2,l:'Low / limited'},{v:3,l:'Moderate'},{v:4,l:'High / established'},{v:5,l:'Very high / exemplary'}];
  return (
    <div className="space-y-1">
      <LikertScale name="protocoleRigueur" value={data.protocoleRigueur} onChange={onChange} options={opts}
        label={t?'Rigueur et formalisation du protocole de collecte':'Rigor and formalization of collection protocol'}
        aide={t?'Protocole écrit, procédures documentées, critères de validation définis':'Written protocol, documented procedures, defined validation criteria'} lang={lang} />
      <LikertScale name="couvertureSpatiale" value={data.couvertureSpatiale} onChange={onChange} options={opts}
        label={t?'Couverture de zones peu ou pas surveillées':'Coverage of under-monitored areas'} lang={lang} />
      <LikertScale name="diversiteParametres" value={data.diversiteParametres} onChange={onChange} options={opts}
        label={t?'Diversité des paramètres et indicateurs mesurés':'Diversity of parameters and indicators measured'} lang={lang} />
      <LikertScale name="controleQualite" value={data.controleQualite} onChange={onChange} options={opts}
        label={t?'Processus de contrôle qualité et validation des données':'Quality control and data validation process'}
        aide={t?'Double-saisie, vérification experte, comparaison données de référence':'Double entry, expert verification, reference data comparison'} lang={lang} />
      <LikertScale name="integrationBases" value={data.integrationBases} onChange={onChange} options={opts}
        label={t?'Intégration dans des bases de données publiques (Données Québec, DataStream, Water Rangers, etc.)':'Integration in public databases (Données Québec, DataStream, Water Rangers, etc.)'} lang={lang} />
      <div className="border-t border-ceq-iceDark pt-4 mt-2">
        <p className="text-xs font-bold text-ceq-slate uppercase tracking-wide mb-3">{t?'Données quantitatives':'Quantitative Data'}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-ceq">{t?'Sites de surveillance actifs':'Active monitoring sites'}</label>
            <input type="number" min="0" value={data.nbSites??''} placeholder="0" onChange={e=>onChange('nbSites',e.target.value)} className={inp} />
          </div>
          <div>
            <label className="label-ceq">{t?'Années de surveillance continues':'Continuous monitoring years'}</label>
            <input type="number" min="0" value={data.anneesSurveillance??''} placeholder="0" onChange={e=>onChange('anneesSurveillance',e.target.value)} className={inp} />
          </div>
          <div>
            <label className="label-ceq">{t?'Échantillons / observations (total)':'Samples / observations (total)'}</label>
            <input type="number" min="0" value={data.nombreEchantillons??''} placeholder="0" onChange={e=>onChange('nombreEchantillons',e.target.value)} className={inp} />
          </div>
          <div>
            <label className="label-ceq">{t?'Publications / rapports scientifiques':'Scientific publications / reports'}</label>
            <input type="number" min="0" value={data.nbPublications??''} placeholder="0" onChange={e=>onChange('nbPublications',e.target.value)} className={inp} />
          </div>
          // Après le champ nbPublications existant, ajouter :

<div>
  <label className="ceq-label flex items-center">
    {lang === 'fr' ? 'Téléchargements / réutilisations des données' : 'Data downloads / reuses'}
    <Tooltip text={lang === 'fr'
      ? 'Nombre de fois où vos données ont été téléchargées ou réutilisées (DataStream, MELCCFP, etc.)'
      : 'Number of times your data was downloaded or reused (DataStream, MELCCFP, etc.)'} />
  </label>
  <input type="number" className="ceq-input" min="0" placeholder={tr.nonRenseigne}
    value={formData.nbTelechargements ?? ''} onChange={fi('nbTelechargements')} />
</div>

<div>
  <label className="ceq-label flex items-center">
    {lang === 'fr' ? 'Protocoles partagés et réutilisés par d\'autres organisations' : 'Protocols shared and reused by other organizations'}
    <Tooltip text={lang === 'fr'
      ? 'Nombre de protocoles que vous avez développés et que d\'autres groupes ont adoptés'
      : 'Number of protocols you developed that other groups have adopted'} />
  </label>
  <input type="number" className="ceq-input" min="0" placeholder="0"
    value={formData.nbProtocolesPartages ?? 0} onChange={fi('nbProtocolesPartages')} />
</div>
          <div>
            <label className="label-ceq">{t?'Bénévoles formés (total)':'Trained volunteers (total)'}</label>
            <input type="number" min="0" value={data.nbBenevoles??''} placeholder="0" onChange={e=>onChange('nbBenevoles',e.target.value)} className={inp} />
          </div>
        </div>
        <div className="mt-4">
          <label className="label-ceq">{t?'Complexité des observations (pour calcul de valeur)':'Observation complexity (for value calculation)'}</label>
          <select value={data.complexiteEchantillons||'simple'} onChange={e=>onChange('complexiteEchantillons',e.target.value)} className={inp+" cursor-pointer"}>
            <option value="simple">{t?'Simple (physico-chimie de base ≈ 35 $/obs.)':'Simple (basic physico-chemistry ≈$35/obs.)'}</option>
            <option value="intermediaire">{t?'Intermédiaire (multiparamétrique ≈75 $/obs.)':'Intermediate (multi-parameter ≈$75/obs.)'}</option>
            <option value="avancee">{t?'Avancée (analyses laboratoire complètes ≈185 $/obs.)':'Advanced (complete lab analysis ≈$185/obs.)'}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
