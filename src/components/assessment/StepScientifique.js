'use client'
import LikertScale from '@/components/ui/LikertScale'

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
        <section className="mb-5 rounded-xl border border-ceq-iceDark bg-ceq-ice p-4">
          <h3 className="text-sm font-bold text-ceq-dark">
            {t ? 'Participation citoyenne au cycle scientifique' : 'Citizen participation in the research cycle'}
          </h3>
          <p className="mb-3 mt-1 text-xs leading-relaxed text-ceq-slate">
            {t
              ? 'Cochez toutes les étapes auxquelles les citoyennes et citoyens contribuent. Cette description complète le score, sans le modifier.'
              : 'Select every stage where citizens contribute. This describes the project without changing its score.'}
          </p>
          <fieldset className="mb-4">
            <legend className="mb-2 text-xs font-semibold text-ceq-dark">
              {t ? 'Rôles joués par les citoyennes et citoyens' : 'Roles played by citizens'}
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
        </section>
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
          <div>
            <label className="label-ceq">
              {t?'Téléchargements / réutilisations des données':'Data downloads / reuses'}
            </label>
            <input type="number" min="0" value={data.nbTelechargements??''} placeholder="0"
              onChange={e=>onChange('nbTelechargements',e.target.value)} className={inp} />
          </div>
          <div>
            <label className="label-ceq">
              {t?'Protocoles partagés et réutilisés par d’autres organisations':'Protocols shared and reused by other organizations'}
            </label>
            <input type="number" min="0" value={data.nbProtocolesPartages??''} placeholder="0"
              onChange={e=>onChange('nbProtocolesPartages',e.target.value)} className={inp} />
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
