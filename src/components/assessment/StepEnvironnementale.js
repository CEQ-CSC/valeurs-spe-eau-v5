'use client'
import LikertScale from '@/components/ui/LikertScale'
import InfoTooltip from '@/components/ui/InfoTooltip'
import { COUTS_EVITES } from '@/data/referenceCosts'
import {
  ECOSYSTEM_DIMENSIONS,
  ECOSYSTEM_SERVICES,
  ECOSYSTEM_TYPES,
} from '@/data/ecosystemServices'

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
  const evaluationsServicesEco = Array.isArray(data.servicesEcoEvaluations)
    ? data.servicesEcoEvaluations
    : [];

  const addRisque = () => onChange('risquesActifs', [...risques, { type:'contamination_eau_potable', population:1000, contribution:0.5 }]);
  const removeRisque = (i) => onChange('risquesActifs', risques.filter((_,j)=>j!==i));
  const updateRisque = (i,k,v) => { const r=[...risques]; r[i]={...r[i],[k]:v}; onChange('risquesActifs',r); };
  const updateTypeRisque = (i, type) => {
    const r=[...risques];
    r[i]={...r[i], type};
    delete r[i].coutReferencePersonnalise;
    delete r[i].probabiliteDetectionPersonnalisee;
    onChange('risquesActifs',r);
  };
  const formatMontant = (montant) => new Intl.NumberFormat(t?'fr-CA':'en-CA', {
    style:'currency', currency:'CAD', maximumFractionDigits:0
  }).format(montant);
  const ajouterEvaluationServiceEco = () => onChange('servicesEcoEvaluations', [
    ...evaluationsServicesEco,
    {
      ecosystemType: 'lotic',
      dimension: 'km',
      quantity: '',
      serviceId: 'water',
      serviceName: '',
      replacementCost: '',
    },
  ]);
  const supprimerEvaluationServiceEco = index => onChange(
    'servicesEcoEvaluations',
    evaluationsServicesEco.filter((_, currentIndex) => currentIndex !== index)
  );
  const modifierEvaluationServiceEco = (index, field, value) => onChange(
    'servicesEcoEvaluations',
    evaluationsServicesEco.map((evaluation, currentIndex) =>
      currentIndex === index ? { ...evaluation, [field]: value } : evaluation
    )
  );
  return (
    <div className="space-y-1">
      <LikertScale name="couvertureTerritoriale" value={data.couvertureTerritoriale} onChange={onChange} options={opts}
        label={t?'Couverture et représentativité du territoire surveillé':'Coverage and representativeness of monitored territory'}
        info={t?'Évaluez si les sites suivis représentent les principaux secteurs et conditions du territoire, plutôt que leur seule superficie.':'Rate whether monitored sites represent the main areas and conditions in the territory, not just its total area.'} lang={lang} />
      <LikertScale name="diversiteMilieux" value={data.diversiteMilieux} onChange={onChange} options={opts}
        label={t?'Diversité des milieux surveillés (lac, rivière, milieu humide, etc.)':'Diversity of monitored environments (lake, river, wetland, etc.)'}
        info={t?'Tenez compte des différents types d’écosystèmes réellement suivis par le projet.':'Consider the different ecosystem types actually monitored by the project.'} lang={lang} />
      <LikertScale name="detectionRisques" value={data.detectionRisques} onChange={onChange} options={opts}
        label={t?'Capacité de détection précoce de risques environnementaux':'Early environmental risk detection capacity'}
        info={t?'Évaluez si le projet peut repérer rapidement une anomalie et la transmettre selon une procédure claire; cela ne signifie pas qu’un dommage a été évité.':'Rate whether the project can promptly identify an anomaly and report it through a clear process; this does not mean damage was prevented.'}
        lang={lang} />
      <LikertScale name="servicesEco" value={data.servicesEco} onChange={onChange} options={opts}
        label={t?'Documentation des services écosystémiques (épuration, régulation, biodiversité)':'Ecosystem services documentation (purification, regulation, biodiversity)'}
        info={t?'Un service écosystémique est un bénéfice fourni par un écosystème, comme la filtration de l’eau ou la régulation des crues. Évaluez la documentation disponible.':'An ecosystem service is a benefit provided by an ecosystem, such as water filtration or flood regulation. Rate the documentation available.'} lang={lang} />
      <LikertScale name="contributionPDE" value={data.contributionPDE} onChange={onChange} options={opts}
        label={t?'Contribution aux Plans directeurs de l\'eau (PDE)':'Contribution to watershed master plans (OBV)'}
        info={t?'Indiquez si les données ou résultats du projet sont repris dans un plan directeur de l’eau ou utilisés par l’organisme de bassin versant.':'Indicate whether project data or findings are included in a watershed master plan or used by the watershed organization.'} lang={lang} />

      <div className="border-t border-ceq-iceDark pt-4 mt-2">
        <p className="text-xs font-bold text-ceq-slate uppercase tracking-wide mb-3">{t?'Données quantitatives':'Quantitative Data'}</p>
        <div className="mb-4 rounded-xl border border-ceq-iceDark bg-ceq-ice p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-ceq-dark">
                {t ? 'Évaluation des services écosystémiques' : 'Ecosystem services assessment'}
              </p>
              <p className="mt-1 text-[11px] text-ceq-slate">
                {t
                  ? 'Ajoutez un milieu et un service par ligne.'
                  : 'Add one ecosystem and service per row.'}
              </p>
            </div>
            <button
              type="button"
              onClick={ajouterEvaluationServiceEco}
              className="shrink-0 rounded-lg bg-ceq-dark px-3 py-2 text-xs text-white hover:bg-ceq-slate"
            >
              + {t ? 'Ajouter un service' : 'Add a service'}
            </button>
          </div>
          {evaluationsServicesEco.length === 0 && (
            <p className="rounded-lg bg-white p-3 text-xs text-ceq-slate">
              {t
                ? 'Aucun service ajouté. La valeur économique des services écosystémiques sera de 0 $ tant qu’aucun coût de remplacement n’est saisi.'
                : 'No services added. Ecosystem-service economic value will be $0 until a replacement cost is entered.'}
            </p>
          )}
          <div className="space-y-3">
            {evaluationsServicesEco.map((evaluation, index) => (
              <div key={`ecosystem-service-${index}`} className="rounded-xl border border-ceq-iceDark bg-white p-3">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold text-ceq-dark">
                    {t ? `Service ${index + 1}` : `Service ${index + 1}`}
                  </p>
                  <button
                    type="button"
                    onClick={() => supprimerEvaluationServiceEco(index)}
                    className="rounded px-2 py-1 text-xs text-ceq-confLow hover:bg-red-50"
                    aria-label={t ? `Supprimer le service ${index + 1}` : `Remove service ${index + 1}`}
                  >
                    ✕
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <div className="mb-1 flex items-center text-xs text-ceq-slate">
                      <label htmlFor={`ecosystem-type-${index}`}>{t ? 'Type de milieu ou d’écosystème' : 'Ecosystem type'}</label>
                      <InfoTooltip label={t ? 'Information sur le type d’écosystème' : 'Information about ecosystem type'} text={t ? 'Choisissez le type de milieu où le service est fourni. Par exemple, un cours d’eau désigne un milieu lotique, tandis qu’un lac est lentique.' : 'Choose the environment type providing the service. For example, a river or stream is lotic, while a lake is lentic.'} />
                    </div>
                    <select
                      id={`ecosystem-type-${index}`}
                      value={evaluation.ecosystemType || 'lotic'}
                      onChange={event => modifierEvaluationServiceEco(index, 'ecosystemType', event.target.value)}
                      className={`${inp} mt-1`}
                    >
                      {ECOSYSTEM_TYPES.map(type => (
                        <option key={type.id} value={type.id}>{t ? type.fr : type.en}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center text-xs text-ceq-slate">
                      <label htmlFor={`ecosystem-dimension-${index}`}>{t ? 'Dimension à évaluer' : 'Measurement unit'}</label>
                      <InfoTooltip label={t ? 'Information sur la dimension' : 'Information about the measurement unit'} text={t ? 'Choisissez l’unité correspondant au coût de remplacement que vous utiliserez : hectares pour une superficie ou kilomètres pour une longueur de cours d’eau.' : 'Choose the unit matching the replacement cost you will enter: hectares for area or kilometres for watercourse length.'} />
                    </div>
                    <select
                      id={`ecosystem-dimension-${index}`}
                      value={evaluation.dimension || 'km'}
                      onChange={event => modifierEvaluationServiceEco(index, 'dimension', event.target.value)}
                      className={`${inp} mt-1`}
                    >
                      {ECOSYSTEM_DIMENSIONS.map(dimension => (
                        <option key={dimension.id} value={dimension.id}>{t ? dimension.fr : dimension.en}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center text-xs text-ceq-slate">
                      <label htmlFor={`ecosystem-quantity-${index}`}>{t ? `Quantité (${evaluation.dimension || 'km'})` : `Quantity (${evaluation.dimension || 'km'})`}</label>
                      <InfoTooltip label={t ? 'Information sur la quantité' : 'Information about the quantity'} text={t ? 'Entrez la superficie ou la longueur réellement évaluée dans l’unité sélectionnée. Utilisez une valeur mesurable et évitez de compter deux fois une même zone.' : 'Enter the area or length being assessed in the selected unit. Use a measurable value and avoid counting the same area twice.'} />
                    </div>
                    <input
                      id={`ecosystem-quantity-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={evaluation.quantity ?? ''}
                      onChange={event => modifierEvaluationServiceEco(index, 'quantity', event.target.value)}
                      className={`${inp} mt-1`}
                    />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center text-xs text-ceq-slate">
                      <label htmlFor={`ecosystem-service-${index}`}>{t ? 'Service écosystémique fourni' : 'Ecosystem service provided'}</label>
                      <InfoTooltip label={t ? 'Information sur le service écosystémique' : 'Information about the ecosystem service'} text={t ? 'Choisissez le bénéfice fourni par le milieu et lié au projet. Sélectionnez « Autre » si le service n’apparaît pas dans la liste.' : 'Choose the benefit provided by the ecosystem and relevant to the project. Select “Other” if it is not listed.'} />
                    </div>
                    <select
                      id={`ecosystem-service-${index}`}
                      value={evaluation.serviceId || 'water'}
                      onChange={event => modifierEvaluationServiceEco(index, 'serviceId', event.target.value)}
                      className={`${inp} mt-1`}
                    >
                      {ECOSYSTEM_SERVICES.map(service => (
                        <option key={service.id} value={service.id}>{t ? service.fr : service.en}</option>
                      ))}
                    </select>
                  </div>
                  {evaluation.serviceId === 'other' && (
                    <div className="sm:col-span-2">
                      <div className="mb-1 flex items-center text-xs text-ceq-slate">
                        <label htmlFor={`ecosystem-other-${index}`}>{t ? 'Nom de l’autre service écosystémique' : 'Name of the other ecosystem service'}</label>
                        <InfoTooltip label={t ? 'Information sur le service personnalisé' : 'Information about the custom service'} text={t ? 'Nommez précisément le bénéfice écosystémique évalué et utilisez une source cohérente pour son coût de remplacement.' : 'Name the ecosystem benefit clearly and use a consistent source for its replacement cost.'} />
                      </div>
                      <input
                        id={`ecosystem-other-${index}`}
                        type="text"
                        maxLength="120"
                        value={evaluation.serviceName ?? ''}
                        onChange={event => modifierEvaluationServiceEco(index, 'serviceName', event.target.value)}
                        className={`${inp} mt-1`}
                      />
                    </div>
                  )}
                  <div className="sm:col-span-2">
                    <div className="mb-1 flex items-center text-xs text-ceq-slate">
                      <label htmlFor={`ecosystem-cost-${index}`}>
                        {t
                          ? `Coût de remplacement (CAD/${evaluation.dimension || 'km'})`
                          : `Replacement cost (CAD/${evaluation.dimension || 'km'})`}
                      </label>
                      <InfoTooltip label={t ? 'Information sur le coût de remplacement' : 'Information about replacement cost'} text={t ? 'Entrez le coût par unité pour remplacer ou restaurer ce service. La valeur estimée est quantité × coût unitaire × facteur de preuve. Appuyez le montant par une source et un périmètre comparables.' : 'Enter the per-unit cost to replace or restore this service. Estimated value is quantity × unit cost × evidence factor. Support the amount with a comparable source and scope.'} />
                    </div>
                    <input
                      id={`ecosystem-cost-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={evaluation.replacementCost ?? ''}
                      onChange={event => modifierEvaluationServiceEco(index, 'replacementCost', event.target.value)}
                      className={`${inp} mt-1`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="label-ceq">
            {t?'Valeur écosystémique':'Ecosystem value'}
            <InfoTooltip label={t?'Information sur le niveau de preuve écologique':'Information about ecosystem evidence level'} text={t?'Choisissez selon la qualité de la preuve associée aux services et aux coûts déclarés. Le facteur appliqué est de 100 % pour une mesure, 80 % pour une donnée documentée, 60 % si estimée ou vérifiée par un tiers, 40 % si déclarative et 20 % si inconnue.' : 'Choose based on the evidence supporting the reported services and costs. The factor is 100% for measured data, 80% for documented data, 60% if estimated or third-party verified, 40% if self-reported, and 20% if unknown.'} />
          </label>
          <select value={data.preuveEcosystemique||'declare'} onChange={e=>onChange('preuveEcosystemique',e.target.value)} className={inp+" cursor-pointer"}>
            {(t?[['mesure','Mesurée (instruments calibrés)'],['documente','Documentée (rapport ou archive)'],['verifie','Estimée ou vérifiée par un tiers'],['declare','Déclarative (sans documentation)'],['inconnu','Non renseignée ou inconnue']]:
            [['mesure','Measured (calibrated instruments)'],['documente','Documented (report or archive)'],['verifie','Estimated or third-party verified'],['declare','Self-reported (no documentation)'],['inconnu','Not specified or unknown']])
            .map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        {/* Risques probabilistes */}
        <div className="rounded-xl border border-ceq-iceDark bg-ceq-ice p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-ceq-dark">
              {t?'Coûts évités':'Avoided costs'}
              <InfoTooltip label={t?'Information sur les coûts évités':'Information about avoided costs'} text={t?'Estimation probabiliste d’un coût qui aurait pu survenir et que la détection du projet a contribué à réduire. Ne déclarez que les risques appuyés par des éléments vérifiables; cela ne prouve pas à lui seul qu’un incident a été évité. Ne comptez pas une même économie dans plusieurs composantes.' : 'Probabilistic estimate of a cost that might have occurred and that project detection helped reduce. Include only risks supported by evidence; this does not prove an incident was prevented. Do not count the same saving in multiple components.'} />
            </p>
            <button type="button" onClick={addRisque} className="text-xs bg-ceq-dark text-white px-3 py-1.5 rounded-lg hover:bg-ceq-slate transition-all">
              + {t?'Ajouter un risque':'Add risk'}
            </button>
          </div>
          {risques.map((r,i)=>(
            <div key={i} className="bg-white rounded-xl border border-ceq-iceDark p-3 mb-2">
              <div className="flex justify-between items-start mb-2">
                <select
                  aria-label={t ? `Type de risque ${i + 1}` : `Risk type ${i + 1}`}
                  value={r.type}
                  onChange={e=>updateTypeRisque(i,e.target.value)}
                  className="text-xs border rounded-lg px-2 py-1.5 text-ceq-dark flex-1 mr-2"
                >
                  {TYPES_RISQUES[lang].map(opt=><option key={opt.v} value={opt.v}>{opt.l}</option>)}
                </select>
                <button type="button" onClick={()=>removeRisque(i)} className="text-ceq-confLow text-xs px-2 py-1 hover:bg-red-50 rounded">✕</button>
              </div>
              {r.type==='contamination_eau_potable'&&(
                <div className="mb-2">
                  <label className="text-xs text-ceq-slate">
                    {t?'Population concernée (hab.)':'Population concerned (inhabitants)'}
                    <InfoTooltip label={t?'Information sur la population concernée':'Information about the population concerned'} text={t?'Nombre approximatif de personnes visées par l’incident potentiel; le coût de référence associé est exprimé par tranche de 1 000 habitants.' : 'Approximate number of people affected by the potential incident; the associated reference cost is per 1,000 inhabitants.'} />
                  </label>
                  <input type="number" min="0" value={r.population??1000} onChange={e=>updateRisque(i,'population',e.target.value)} className="w-full text-xs border rounded-lg px-2 py-1.5 mt-1" />
                </div>
              )}
              <div className="mb-2">
                <label className="text-xs text-ceq-slate">
                  {t?'Coût de référence de l’incident (facultatif)':'Incident reference cost (optional)'}
                  <InfoTooltip
                    label={t?'Information sur le coût de référence':'Information about the reference cost'}
                    text={COUTS_EVITES[r.type]
                      ? (t
                        ? `Coût documenté de l’incident, ou valeur par défaut de ${formatMontant(COUTS_EVITES[r.type].cout_evenement_base.par_1000_habitants ?? COUTS_EVITES[r.type].cout_evenement_base.forfait)} si le champ reste vide. Saisissez un montant pour remplacer cette valeur.`
                        : `Documented incident cost, or the default value of ${formatMontant(COUTS_EVITES[r.type].cout_evenement_base.par_1000_habitants ?? COUTS_EVITES[r.type].cout_evenement_base.forfait)} if left blank. Enter an amount to override it.`)
                      : (t
                        ? 'Aucun coût par défaut pour cet incident : saisissez un coût de référence et une probabilité de détection pour l’inclure au calcul.'
                        : 'No default cost is available for this incident; enter a reference cost and detection probability to include it in the calculation.')}
                  />
                  {r.type==='contamination_eau_potable'
                    ? (t?' — par 1 000 habitants':' — per 1,000 inhabitants')
                    : (t?' — par incident':' — per incident')}
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={r.coutReferencePersonnalise??''}
                  placeholder={COUTS_EVITES[r.type]
                    ? formatMontant(COUTS_EVITES[r.type].cout_evenement_base.par_1000_habitants ?? COUTS_EVITES[r.type].cout_evenement_base.forfait)
                    : (t?'Aucune valeur par défaut':'No default value')}
                  onChange={e=>updateRisque(i,'coutReferencePersonnalise',e.target.value)}
                  className="w-full text-xs border rounded-lg px-2 py-1.5 mt-1"
                />
                {!COUTS_EVITES[r.type] && (
                  <>
                    <label className="text-xs text-ceq-slate mt-2 block">
                      {t?'Probabilité de détection par le projet (0 à 1)':'Project detection probability (0 to 1)'}
                      <InfoTooltip label={t?'Information sur la probabilité de détection':'Information about detection probability'} text={t?'Estimez la probabilité que le projet détecte ce type d’incident à temps, entre 0 (aucune chance) et 1 (certitude). Justifiez cette estimation si possible.' : 'Estimate the chance that the project detects this type of incident in time, from 0 (no chance) to 1 (certainty). Provide a rationale when possible.'} />
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={r.probabiliteDetectionPersonnalisee??''}
                      placeholder="0.35"
                      onChange={e=>updateRisque(i,'probabiliteDetectionPersonnalisee',e.target.value)}
                      className="w-full text-xs border rounded-lg px-2 py-1.5 mt-1"
                    />
                  </>
                )}
              </div>
              <div>
                <label className="text-xs text-ceq-slate">
                  {t?'Contribution estimée de votre SPE (0 à 1)':'Estimated SPE contribution (0 to 1)'}
                  <InfoTooltip label={t?'Information sur la contribution estimée':'Information about estimated contribution'} text={t?'Part du résultat que vous attribuez prudemment au projet, entre 0 % et 100 %. Ce n’est pas une preuve de causalité.' : 'The share of the outcome cautiously attributed to the project, from 0% to 100%. This is not proof of causation.'} />
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="range" min="0" max="1" step="0.05" value={r.contribution??0.5} onChange={e=>updateRisque(i,'contribution',parseFloat(e.target.value))} className="flex-1" />
                  <span className="text-xs font-bold text-ceq-dark w-8">{Math.round((r.contribution??0.5)*100)}%</span>
                </div>
              </div>
              <div className="mt-3">
                <label className="text-xs text-ceq-slate" htmlFor={`preuve-risque-${i}`}>
                  {t ? 'Preuve ou référence appuyant le rôle de détection (facultatif)' : 'Evidence or reference supporting the detection role (optional)'}
                </label>
                <input
                  id={`preuve-risque-${i}`}
                  type="text"
                  maxLength={300}
                  value={r.preuve||''}
                  onChange={e=>updateRisque(i,'preuve',e.target.value)}
                  placeholder={t?'Ex. avis aux autorités, rapport ou lien':'E.g. authority notice, report or link'}
                  className="input-ceq mt-1 py-2 text-xs"
                />
              </div>
            </div>
          ))}
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label-ceq text-xs" htmlFor="scenario-sans-projet">
                {t ? 'Scénario sans le projet (facultatif)' : 'Counterfactual without the project (optional)'}
                <InfoTooltip label={t ? 'Information sur le scénario sans projet' : 'Information about the counterfactual'} text={t ? 'Décrivez brièvement ce qui aurait probablement eu lieu sans le projet. Il s’agit d’un scénario plausible, pas d’un fait observé ni d’une preuve de causalité.' : 'Briefly describe what would likely have happened without the project. This is a plausible scenario, not an observed fact or proof of causation.'} />
              </label>
              <textarea
                id="scenario-sans-projet"
                rows={2}
                maxLength={500}
                value={data.scenarioSansProjet||''}
                onChange={e=>onChange('scenarioSansProjet',e.target.value)}
                placeholder={t?'Quel coût ou dommage aurait plausiblement été engagé?':'What cost or damage might plausibly have occurred?'}
                className="input-ceq resize-y py-2 text-xs"
              />
            </div>
            <div>
              <label className="label-ceq text-xs" htmlFor="source-couts-evites">
                {t ? 'Source utilisée ou à vérifier (facultatif)' : 'Source used or to verify (optional)'}
                <InfoTooltip label={t ? 'Information sur la source du coût' : 'Information about the cost source'} text={t ? 'Citez la référence, l’organisme ou le lien qui appuie le coût de référence ou la probabilité déclarée.' : 'Cite the reference, organization, or link supporting the reported reference cost or probability.'} />
              </label>
              <textarea
                id="source-couts-evites"
                rows={2}
                maxLength={500}
                value={data.sourceCoutsEvites||''}
                onChange={e=>onChange('sourceCoutsEvites',e.target.value)}
                placeholder={t?'Tarif, étude, rapport public ou référence':'Rate, study, public report or reference'}
                className="input-ceq resize-y py-2 text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}