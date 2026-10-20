'use client'
import LikertScale from '@/components/ui/LikertScale'
import { COUTS_EVITES } from '@/data/referenceCosts'
import {
  convertirInt2007EnCAD2026,
  ECOSYSTEM_SERVICES,
  ECOSYSTEM_SERVICES_SOURCE,
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
  const servicesEcoActifs = data.servicesEcoActifs || [];
  const habitatChoisi = data.servicesEcoHabitatChoisi || 'inlandWetlands';

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
  const serviceActif = (habitat, serviceId) =>
    servicesEcoActifs.find(service => service.habitat === habitat && service.serviceId === serviceId);
  const toggleServiceEco = (habitat, serviceId, checked) => {
    const updated = servicesEcoActifs.filter(service =>
      service.habitat !== habitat || service.serviceId !== serviceId
    );
    if (checked) updated.push({ habitat, serviceId, tauxCadParHaPersonnalise: '' });
    onChange('servicesEcoActifs', updated);
  };
  const updateTauxServiceEco = (habitat, serviceId, value) => {
    onChange('servicesEcoActifs', servicesEcoActifs.map(service =>
      service.habitat === habitat && service.serviceId === serviceId
        ? { ...service, tauxCadParHaPersonnalise: value }
        : service
    ));
  };
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
          <label className="label-ceq" htmlFor="superficie-eau-douce">
            {t ? 'Superficie surveillée des cours d’eau et lacs (ha)' : 'Monitored area of rivers and lakes (ha)'}
          </label>
          <input
            id="superficie-eau-douce"
            type="number"
            min="0"
            step="0.01"
            value={data.superficieEauDouceHa ?? ''}
            placeholder="0"
            onChange={event => onChange('superficieEauDouceHa', event.target.value)}
            className={inp}
          />
          <p className="mt-1 text-[11px] text-ceq-slate">
            {t
              ? 'L’article exprime ses valeurs par hectare : la longueur en km ne suffit pas. Utilisez la surface réellement pertinente pour le service évalué.'
              : 'The article reports values per hectare: length in km is not enough. Use the area relevant to the service being assessed.'}
          </p>
        </div>
        <div className="mb-4 rounded-xl border border-ceq-iceDark bg-ceq-ice p-3">
          <p className="text-xs font-semibold text-ceq-dark">
            {t ? 'Évaluation détaillée des services écosystémiques' : 'Detailed ecosystem-service valuation'}
          </p>
          <p className="my-2 text-[11px] leading-relaxed text-ceq-slate">
            {t
              ? `Les moyennes mondiales de l’article sont converties en CAD 2026/ha/an selon la parité de pouvoir d’achat canadienne de 2007 et l’IPC jusqu’en ${ECOSYSTEM_SERVICES_SOURCE.cpiLatestDate}. Il s’agit de repères, pas de tarifs locaux; vous pouvez saisir un taux local à la place.`
              : `The article’s global averages are converted to CAD 2026/ha/year using Canada’s 2007 purchasing power parity and CPI through ${ECOSYSTEM_SERVICES_SOURCE.cpiLatestDate}. These are benchmarks, not local rates; you can enter a local rate instead.`}
          </p>
          <label className="label-ceq text-xs" htmlFor="type-milieu-ecosystemique">
            {t ? 'Type de milieu' : 'Ecosystem type'}
          </label>
          <select
            id="type-milieu-ecosystemique"
            value={habitatChoisi}
            onChange={event => onChange('servicesEcoHabitatChoisi', event.target.value)}
            className={`${inp} mb-3 cursor-pointer`}
          >
            <option value="inlandWetlands">{t ? 'Milieu humide intérieur' : 'Inland wetland'}</option>
            <option value="freshwater">{t ? 'Cours d’eau et lacs (eaux douces)' : 'Rivers and lakes (freshwater)'}</option>
          </select>
          <div className="space-y-2">
            {ECOSYSTEM_SERVICES.map(service => {
              const actif = serviceActif(habitatChoisi, service.id);
              const valeurReference = service[habitatChoisi];
              const valeurCad2026 = valeurReference === null
                ? null
                : convertirInt2007EnCAD2026(valeurReference);
              const serviceNom = t ? service.fr : service.en;
              return (
                <div key={`${habitatChoisi}-${service.id}`} className="rounded-lg bg-white p-2">
                  <label className="flex items-start gap-2 text-xs text-ceq-dark">
                    <input
                      type="checkbox"
                      checked={Boolean(actif)}
                      onChange={event => toggleServiceEco(habitatChoisi, service.id, event.target.checked)}
                      className="mt-0.5 accent-ceq-dark"
                    />
                    <span className="flex-1">{serviceNom}</span>
                    <span className="text-right text-ceq-slate">
                      {valeurCad2026 === null
                        ? (t ? 'Non estimé dans l’article' : 'Not estimated in the article')
                        : `${formatMontant(valeurCad2026)} ${t ? '/ha/an' : '/ha/year'}`}
                    </span>
                  </label>
                  {actif && (
                    <label className="mt-2 block pl-6 text-[11px] text-ceq-slate">
                      {valeurCad2026 === null
                        ? (t ? 'Taux local (CAD/ha/an)' : 'Local rate (CAD/ha/year)')
                        : (t ? 'Taux local facultatif (CAD/ha/an)' : 'Optional local rate (CAD/ha/year)')}
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={actif.tauxCadParHaPersonnalise ?? ''}
                        onChange={event => updateTauxServiceEco(habitatChoisi, service.id, event.target.value)}
                        placeholder={valeurCad2026 === null
                          ? (t ? 'Aucune valeur article; saisir une valeur locale' : 'No article value; enter a local rate')
                          : `${formatMontant(valeurCad2026)} (${t ? 'référence' : 'reference'})`}
                        className="mt-1 w-full rounded-lg border border-ceq-iceDark px-2 py-1.5 text-xs text-ceq-dark"
                      />
                    </label>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-[10px] leading-relaxed text-ceq-slate">
            {t
              ? `Référence : ${ECOSYSTEM_SERVICES_SOURCE.citation}. Facteur utilisé : 1 Int$ 2007 = ${ECOSYSTEM_SERVICES_SOURCE.cad2026PerIntDollar2007.toFixed(3)} CAD 2026 (parité 2007 × inflation canadienne de ${((ECOSYSTEM_SERVICES_SOURCE.inflationFactor - 1) * 100).toFixed(1)} %). Les valeurs varient selon les études et ne sont pas automatiquement transférables au Québec. Dès qu’un service détaillé est sélectionné, il remplace l’estimation simplifiée pour l’ensemble des services écosystémiques. Évitez le double comptage.`
              : `Source: ${ECOSYSTEM_SERVICES_SOURCE.citation}. Conversion used: 1 Int$ 2007 = ${ECOSYSTEM_SERVICES_SOURCE.cad2026PerIntDollar2007.toFixed(3)} CAD 2026 (2007 PPP × Canadian inflation of ${((ECOSYSTEM_SERVICES_SOURCE.inflationFactor - 1) * 100).toFixed(1)}%). Values vary across studies and are not automatically transferable to Quebec. Selecting any detailed service replaces the simplified estimate for all ecosystem services. Avoid double-counting.`}
          </p>
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
        <div className="rounded-xl border border-ceq-iceDark bg-ceq-ice p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-ceq-dark">{t?'Coûts évités':'Avoided costs'}</p>
            <button type="button" onClick={addRisque} className="text-xs bg-ceq-dark text-white px-3 py-1.5 rounded-lg hover:bg-ceq-slate transition-all">
              + {t?'Ajouter un risque':'Add risk'}
            </button>
          </div>
          <p className="text-xs text-ceq-slate mb-3 italic">{t?'N\'indiquez que les risques pour lesquels votre projet a joué un rôle de détection documenté.':'Only include risks for which your project has played a documented detection role.'}</p>
          {risques.map((r,i)=>(
            <div key={i} className="bg-white rounded-xl border border-ceq-iceDark p-3 mb-2">
              <div className="flex justify-between items-start mb-2">
                <select value={r.type} onChange={e=>updateTypeRisque(i,e.target.value)} className="text-xs border rounded-lg px-2 py-1.5 text-ceq-dark flex-1 mr-2">
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
              <div className="mb-2">
                <label className="text-xs text-ceq-slate">
                  {t?'Coût de référence de l’incident (facultatif)':'Incident reference cost (optional)'}
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
                {COUTS_EVITES[r.type] ? (
                  <p className="text-[11px] text-ceq-slate/70 mt-1">
                    {t
                      ? `Valeur par défaut : ${formatMontant(COUTS_EVITES[r.type].cout_evenement_base.par_1000_habitants ?? COUTS_EVITES[r.type].cout_evenement_base.forfait)}. Saisissez un montant pour la remplacer.`
                      : `Default value: ${formatMontant(COUTS_EVITES[r.type].cout_evenement_base.par_1000_habitants ?? COUTS_EVITES[r.type].cout_evenement_base.forfait)}. Enter an amount to override it.`}
                  </p>
                ) : (
                  <>
                    <p className="text-[11px] text-amber-700 mt-1">
                      {t
                        ? 'Aucun coût de référence intégré pour cet incident. Saisissez un coût et une probabilité de détection pour le calculer.'
                        : 'No built-in reference cost for this incident. Enter a cost and detection probability to include it in the calculation.'}
                    </p>
                    <label className="text-xs text-ceq-slate mt-2 block">
                      {t?'Probabilité de détection par le projet (0 à 1)':'Project detection probability (0 to 1)'}
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
                <label className="text-xs text-ceq-slate">{t?'Contribution estimée de votre SPE (0 à 1)':'Estimated SPE contribution (0 to 1)'}</label>
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
          <p className="mt-3 text-[11px] leading-relaxed text-ceq-slate">
            {t
              ? 'Les coûts évités sont des estimations probabilistes fondées sur des valeurs de référence et votre contribution estimée. Évitez de compter une même économie dans plusieurs composantes.'
              : 'Avoided costs are probabilistic estimates based on reference values and your estimated contribution. Do not count the same saving in multiple components.'}
          </p>
        </div>
      </div>
    </div>
  );
}