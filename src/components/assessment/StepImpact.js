'use client'

const DIMENSIONS = {
  fr: [
    { key: 'environnemental', title: 'Impact environnemental', help: 'Effet observable sur la qualité de l’eau, la biodiversité, les habitats, la surveillance ou la gestion du milieu.' },
    { key: 'social', title: 'Impact social', help: 'Effet observable sur l’engagement citoyen, la sensibilisation, l’apprentissage et la confiance locale.' },
    { key: 'politique', title: 'Impact politique / décisionnel', help: 'Utilisation des résultats dans les décisions, recommandations, politiques, plans ou interventions.' },
    { key: 'scientifique', title: 'Impact scientifique', help: 'Contribution à la compréhension, aux protocoles, aux collaborations ou aux connaissances produites.' },
  ],
  en: [
    { key: 'environnemental', title: 'Environmental impact', help: 'Observable effect on water quality, biodiversity, habitat, monitoring, or environmental management.' },
    { key: 'social', title: 'Social impact', help: 'Observable effect on citizen engagement, awareness, learning, and local trust.' },
    { key: 'politique', title: 'Policy / decision impact', help: 'Use of results in decisions, recommendations, policies, plans, or interventions.' },
    { key: 'scientifique', title: 'Scientific impact', help: 'Contribution to understanding, methods, collaborations, or produced knowledge.' },
  ],
};

const OPTIONS = {
  fr: [
    { value: 'non_observe', label: 'Non observé / inconnu' },
    { value: 'faible', label: 'Faible' },
    { value: 'modere', label: 'Modéré' },
    { value: 'eleve', label: 'Élevé' },
    { value: 'fort', label: 'Très élevé' },
  ],
  en: [
    { value: 'non_observe', label: 'Not observed / unknown' },
    { value: 'faible', label: 'Low' },
    { value: 'modere', label: 'Moderate' },
    { value: 'eleve', label: 'High' },
    { value: 'fort', label: 'Very high' },
  ],
};

export default function StepImpact({ data = {}, onChange, lang = 'fr' }) {
  const t = lang === 'fr';
  const dims = DIMENSIONS[lang];
  const opts = OPTIONS[lang];

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-ceq-iceDark bg-ceq-ice p-4">
        <h3 className="text-base font-bold text-ceq-dark">
          {t ? 'Évaluation de l’impact du projet' : 'Project impact assessment'}
        </h3>
        <p className="mt-2 text-sm text-ceq-slate/80">
          {t
            ? 'Cette section cible les changements observés, les effets concrets et la valeur réelle créée par le projet dans chaque dimension.'
            : 'This section focuses on observed changes, concrete effects, and the real value created by the project in each dimension.'}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {dims.map((dim) => (
          <div key={dim.key} className="rounded-2xl border border-ceq-iceDark bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-start justify-between gap-3">
              <h4 className="text-sm font-bold text-ceq-dark">{dim.title}</h4>
              <span className="rounded-full border border-ceq-iceDark bg-ceq-ice px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ceq-slate">
                {t ? 'Impact' : 'Impact'}
              </span>
            </div>

            <p className="mb-3 text-xs text-ceq-slate/75">{dim.help}</p>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-ceq-dark">
                {t ? 'Niveau d’impact observé' : 'Observed impact level'}
              </label>
              <select
                value={data[`${dim.key}Niveau`] ?? 'non_observe'}
                onChange={(e) => onChange(`${dim.key}Niveau`, e.target.value)}
                className="input-ceq py-2 text-sm"
              >
                {opts.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <label className="block text-xs font-semibold text-ceq-dark">
                {t ? 'Exemple d’effet ou de preuve' : 'Example of effect or evidence'}
              </label>
              <textarea
                value={data[`${dim.key}Preuve`] ?? ''}
                onChange={(e) => onChange(`${dim.key}Preuve`, e.target.value)}
                rows={3}
                placeholder={t ? 'Ex. : amélioration du suivi, augmentation de la participation, décision ou publication…' : 'E.g.: improved monitoring, increased participation, decision, publication, etc.'}
                className="input-ceq resize-none text-sm"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
