'use client'
import LikertScale from '@/components/ui/LikertScale'
import InfoTooltip from '@/components/ui/InfoTooltip'

const ETAPES_PARTICIPATION = {
  fr: [
    ['conception', 'Définition des questions et objectifs'],
    ['developpement', 'Développement des méthodes et protocoles'],
    ['collecte', 'Collecte des observations et données'],
    ['traitement', 'Traitement et validation des données'],
    ['analyse', 'Analyse des données'],
    ['interpretation', 'Interprétation des résultats'],
    ['diffusion', 'Diffusion des résultats'],
    ['partage', 'Conservation et partage des données ou ressources'],
    ['reconnaissance', 'Reconnaissance des contributions (crédit, coautorat)'],
  ],
  en: [
    ['conception', 'Defining research questions and objectives'],
    ['developpement', 'Developing methods and protocols'],
    ['collecte', 'Collecting observations and data'],
    ['traitement', 'Processing and validating data'],
    ['analyse', 'Analyzing data'],
    ['interpretation', 'Interpreting results'],
    ['diffusion', 'Communicating results'],
    ['partage', 'Preserving and sharing data or resources'],
    ['reconnaissance', 'Recognizing contributions (credit, co-authorship)'],
  ],
};

const TYPES_IMPLICATION = {
  fr: [
    ['contributeur', 'Contributeur — réalise des tâches définies'],
    ['collaborateur', 'Collaborateur — participe aux choix ou à l’interprétation'],
    ['responsable', 'Responsable — initie ou dirige une partie du projet'],
  ],
  en: [
    ['contributeur', 'Contributor — carries out defined tasks'],
    ['collaborateur', 'Collaborator — contributes to decisions or interpretation'],
    ['responsable', 'Project leader — initiates or leads part of the project'],
  ],
};

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
        info={t?'Évaluez la clarté des consignes, la répétabilité des méthodes et l’existence de critères pour réaliser et valider les observations. Exemples : protocole écrit et procédures documentées.':'Consider how clear and repeatable the methods are, and whether criteria exist for collecting and validating observations. Examples include a written protocol and documented procedures.'} lang={lang} />
      <LikertScale name="couvertureSpatiale" value={data.couvertureSpatiale} onChange={onChange} options={opts}
        label={t?'Couverture de zones peu ou pas surveillées':'Coverage of under-monitored areas'}
        info={t?'Indiquez dans quelle mesure le projet collecte des données dans des secteurs peu suivis par les réseaux existants.':'Rate how much the project collects data in areas that are poorly covered by existing monitoring networks.'} lang={lang} />
      <LikertScale name="diversiteParametres" value={data.diversiteParametres} onChange={onChange} options={opts}
        label={t?'Diversité des paramètres et indicateurs mesurés':'Diversity of parameters and indicators measured'}
        info={t?'Comptez la variété des éléments mesurés ou observés (par exemple température, pH, espèces ou habitats), pas le nombre de répétitions d’une même mesure.':'Consider the variety of measured or observed factors (e.g. temperature, pH, species, or habitats), not repeated measurements of the same factor.'} lang={lang} />
      <LikertScale name="controleQualite" value={data.controleQualite} onChange={onChange} options={opts}
        label={t?'Processus de contrôle qualité et validation des données':'Quality control and data validation process'}
        info={t?'Évaluez les vérifications qui repèrent les erreurs ou incohérences, comme la double saisie, une vérification experte ou une comparaison aux données de référence.':'Consider checks used to identify errors or inconsistencies, such as double entry, expert verification, or comparison with reference data.'} lang={lang} />
      <LikertScale name="integrationBases" value={data.integrationBases} onChange={onChange} options={opts}
        label={t?'Intégration dans des bases de données publiques (Données Québec, DataStream, Water Rangers, etc.)':'Integration in public databases (Données Québec, DataStream, Water Rangers, etc.)'}
        info={t?'Sélectionnez un niveau selon l’intégration réelle des données dans une base accessible; une simple intention de les partager ne compte pas comme intégration.':'Rate the actual inclusion of data in an accessible database; an intention to share does not count as integration.'} lang={lang} />
      <div className="border-t border-ceq-iceDark pt-4 mt-2">
        <div className="mb-5 space-y-4">
          <section className="rounded-xl border border-ceq-iceDark bg-ceq-ice p-4">
            <h3 className="text-sm font-bold text-ceq-dark">
              {t ? '1. Type / niveau d’implication' : '1. Type / level of involvement'}
              <InfoTooltip
                label={t ? 'Information sur le niveau d’implication' : 'Information about involvement level'}
                text={t ? 'Cochez les niveaux qui s’appliquent. Les rôles peuvent varier entre les personnes ou les étapes du projet.' : 'Select all applicable levels. Roles may vary between people or project stages.'}
              />
            </h3>
            <fieldset>
              <legend className="sr-only">
                {t ? 'Type ou niveau d’implication' : 'Type or level of involvement'}
              </legend>
              <div className="grid gap-2">
                {TYPES_IMPLICATION[lang].map(([value, label]) => {
                  const selected = Array.isArray(data.typesImplication) && data.typesImplication.includes(value);
                  return (
                    <label key={value} className="flex items-start gap-2 rounded-lg border border-ceq-iceDark bg-white p-2.5 text-xs text-ceq-dark">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={event => {
                          const current = Array.isArray(data.typesImplication) ? data.typesImplication : [];
                          onChange('typesImplication', event.target.checked
                            ? [...current, value]
                            : current.filter(role => role !== value));
                        }}
                        className="mt-0.5 accent-ceq-slate"
                      />
                      <span>{label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </section>
          <section className="rounded-xl border border-ceq-iceDark bg-ceq-ice p-4">
            <h3 className="text-sm font-bold text-ceq-dark">
              {t ? '2. Rôles dans le cycle scientifique' : '2. Roles in the research cycle'}
              <InfoTooltip
                label={t ? 'Information sur les rôles dans le cycle scientifique' : 'Information about research-cycle roles'}
                text={t ? 'Cochez les activités auxquelles les citoyens participent réellement, de la conception à la diffusion. Ces réponses décrivent le projet et ne changent pas le score.' : 'Select activities citizens actually participate in, from design to communication. These answers describe the project and do not change its score.'}
              />
            </h3>
            <fieldset>
              <legend className="sr-only">
                {t ? 'Rôles et activités du cycle scientifique' : 'Research-cycle roles and activities'}
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
              {ETAPES_PARTICIPATION[lang].map(([value, label]) => {
                const selected = Array.isArray(data.etapesParticipation) && data.etapesParticipation.includes(value);
                return (
                  <label key={value} className="flex items-start gap-2 rounded-lg border border-ceq-iceDark bg-white p-2.5 text-xs text-ceq-dark">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={event => {
                        const current = Array.isArray(data.etapesParticipation) ? data.etapesParticipation : [];
                        onChange('etapesParticipation', event.target.checked
                          ? [...current, value]
                          : current.filter(stage => stage !== value));
                      }}
                      className="mt-0.5 accent-ceq-slate"
                    />
                    <span>{label}</span>
                  </label>
                );
              })}
            </div>
            </fieldset>
          </section>
        </div>
        <p className="text-xs font-bold text-ceq-slate uppercase tracking-wide mb-3">{t?'Données quantitatives':'Quantitative Data'}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-ceq">
              {t?'Sites de surveillance actifs':'Active monitoring sites'}
              <InfoTooltip label={t?'Information sur les sites de surveillance':'Information about monitoring sites'} text={t?'Nombre de sites distincts suivis actuellement par le projet; ne comptez pas plusieurs visites au même site comme plusieurs sites.':'Number of distinct sites currently monitored by the project; do not count repeated visits to one site as separate sites.'} />
            </label>
            <input type="number" min="0" value={data.nbSites??''} placeholder="0" onChange={e=>onChange('nbSites',e.target.value)} className={inp} />
          </div>
          <div>
            <label className="label-ceq">
              {t?'Années de surveillance continues':'Continuous monitoring years'}
              <InfoTooltip label={t?'Information sur les années de surveillance':'Information about monitoring years'} text={t?'Nombre d’années pendant lesquelles la surveillance a été menée. Une année sans activité ne devrait pas être comptée comme une année continue.':'Number of years in which monitoring took place. Do not count years with no activity as continuous monitoring years.'} />
            </label>
            <input type="number" min="0" value={data.anneesSurveillance??''} placeholder="0" onChange={e=>onChange('anneesSurveillance',e.target.value)} className={inp} />
          </div>
          <div>
            <label className="label-ceq">
              {t?'Échantillons / observations (total)':'Samples / observations (total)'}
              <InfoTooltip label={t?'Information sur le nombre total d’observations':'Information about total observations'} text={t?'Nombre total d’observations recueillies par le projet, y compris celles qui recoupent des données déjà disponibles.' : 'Total number of observations collected by the project, including those overlapping with data already available.'} />
            </label>
            <input type="number" min="0" value={data.nombreEchantillons??''} placeholder="0" onChange={e=>onChange('nombreEchantillons',e.target.value)} className={inp} />
          </div>
          <div>
            <label className="label-ceq">
              {t?'Observations complémentaires (lacunes spatiales ou temporelles comblées)':'Complementary observations (spatial or temporal gaps filled)'}
              <InfoTooltip label={t?'Information sur les observations complémentaires':'Information about complementary observations'} text={t?'Nombre d’observations qui apportent une information absente des données existantes en lieu ou en période. Ne comptez pas les observations redondantes.':'Number of observations adding information missing from existing data by location or time period. Do not count redundant observations.'} />
            </label>
            <input
              type="number"
              min="0"
              max={data.nombreEchantillons || undefined}
              value={data.nbObservationsComplementaires??''}
              placeholder="0"
              onChange={e=>onChange('nbObservationsComplementaires',e.target.value)}
              className={inp}
            />
          </div>
          <div>
            <label className="label-ceq">
              {t?'Publications / rapports scientifiques':'Scientific publications / reports'}
              <InfoTooltip label={t?'Information sur les publications':'Information about publications'} text={t?'Nombre de publications, rapports ou documents scientifiques diffusés qui présentent les données ou résultats du projet.':'Number of published scientific papers, reports, or documents presenting project data or findings.'} />
            </label>
            <input type="number" min="0" value={data.nbPublications??''} placeholder="0" onChange={e=>onChange('nbPublications',e.target.value)} className={inp} />
          </div>
          <div>
            <label className="label-ceq">
              {t?'Téléchargements / réutilisations des données':'Data downloads / reuses'}
              <InfoTooltip label={t?'Information sur les téléchargements et réutilisations':'Information about data downloads and reuse'} text={t?'Déclarez les téléchargements ou réutilisations dont vous avez une trace; évitez d’estimer les consultations non mesurées.':'Report downloads or reuse that you can document; do not estimate unmeasured views.'} />
            </label>
            <input type="number" min="0" value={data.nbTelechargements??''} placeholder="0"
              onChange={e=>onChange('nbTelechargements',e.target.value)} className={inp} />
          </div>
          <div>
            <label className="label-ceq">
              {t?'Protocoles partagés et réutilisés par d’autres organisations':'Protocols shared and reused by other organizations'}
              <InfoTooltip label={t?'Information sur les protocoles partagés':'Information about shared protocols'} text={t?'Comptez les protocoles effectivement repris par une autre organisation, et non simplement rendus disponibles.':'Count protocols actually adopted by another organization, not merely made available.'} />
            </label>
            <input type="number" min="0" value={data.nbProtocolesPartages??''} placeholder="0"
              onChange={e=>onChange('nbProtocolesPartages',e.target.value)} className={inp} />
          </div>
          <div>
            <label className="label-ceq">
              {t?'Bénévoles formés (total)':'Trained volunteers (total)'}
              <InfoTooltip label={t?'Information sur les bénévoles formés':'Information about trained volunteers'} text={t?'Nombre de personnes ayant reçu une formation liée aux méthodes ou protocoles du projet.':'Number of people who received training related to the project methods or protocols.'} />
            </label>
            <input type="number" min="0" value={data.nbBenevoles??''} placeholder="0" onChange={e=>onChange('nbBenevoles',e.target.value)} className={inp} />
          </div>
        </div>
        <div className="mt-4">
          <label className="label-ceq">
            {t?'Complexité des observations':'Observation complexity'}
            <InfoTooltip label={t?'Information sur la complexité des observations':'Information about observation complexity'} text={t?'Choisissez le niveau d’analyse qui correspond le mieux au coût de remplacement d’une observation. Ce tarif sert à estimer la valeur des observations complémentaires.':'Choose the analysis level that best matches the replacement cost of one observation. This rate estimates the value of complementary observations.'} />
          </label>
          <select value={data.complexiteEchantillons||'simple'} onChange={e=>onChange('complexiteEchantillons',e.target.value)} className={inp+" cursor-pointer"}>
            <option value="simple">{t?'Simple (physico-chimie de base ≈ 35 $/obs.)':'Simple (basic physico-chemistry ≈$35/obs.)'}</option>
            <option value="intermediaire">{t?'Intermédiaire (multiparamétrique ≈75 $/obs.)':'Intermediate (multi-parameter ≈$75/obs.)'}</option>
            <option value="avancee">{t?'Avancée (analyses laboratoire complètes ≈185 $/obs.)':'Advanced (complete lab analysis ≈$185/obs.)'}</option>
          </select>
          <label className="label-ceq mt-3">
            {t?'Coût de remplacement personnalisé par observation (facultatif)':'Custom replacement cost per observation (optional)'}
            <InfoTooltip label={t?'Information sur le coût de remplacement des observations':'Information about observation replacement cost'} text={t?'Coût estimé pour produire une observation comparable par une autre méthode. Ce montant remplace le tarif associé à la complexité choisie; il ne s’ajoute pas à celui-ci.' : 'Estimated cost of producing a comparable observation by another method. This amount replaces the rate for the selected complexity; it is not added to it.'} />
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.01"
              value={data.coutObsPersonnalise??''}
              placeholder={t?'Utiliser le coût de référence':'Use reference cost'}
              onChange={e=>onChange('coutObsPersonnalise',e.target.value)}
              className={inp+" pr-12"}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ceq-slate font-medium">$ / obs.</span>
          </div>
          <label className="label-ceq mt-3">
            {t?'Coûts cumulés de production des données (facultatif)':'Cumulative data-generation costs (optional)'}
            <InfoTooltip label={t?'Information sur les coûts cumulés de production':'Information about cumulative data-generation costs'} text={t?'Additionnez les coûts de conception, préparation, collecte et traitement pour le même ensemble d’observations. Ce montant sert à calculer un coût par enregistrement, pas un bénéfice.' : 'Add design, preparation, collection, and processing costs for the same set of observations. This is used to calculate cost per record, not a benefit.'} />
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.01"
              value={data.coutProductionDonnees??''}
              placeholder={t?'Coûts liés à cette collecte':'Costs linked to this data collection'}
              onChange={e=>onChange('coutProductionDonnees',e.target.value)}
              className={inp+" pr-12"}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ceq-slate font-medium">CAD</span>
          </div>
        </div>
      </div>
    </div>
  );
}
