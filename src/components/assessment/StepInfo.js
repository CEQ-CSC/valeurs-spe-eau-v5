'use client'
import InfoTooltip from '@/components/ui/InfoTooltip'

const TYPES = {
  fr:[
    {v:'qualite_eau',   l:'Qualité de l\'eau'},
    {v:'biodiversite',  l:'Biodiversité aquatique'},
    {v:'quantite',      l:'Hydrologique (quantié, débit, etc.)'},
    {v:'sediments',     l:'Sédiments et turbidité'},
    {v:'ecologique',     l:'Écosystèmes aquatiques'},
    {v:'mixte',         l:'Mixte / multiparamétrique'},
  ],
  en:[
    {v:'qualite_eau',   l:'Water Quality'},
    {v:'biodiversite',  l:'Aquatic Biodiversity'},
    {v:'quantite',      l:'Hydrological Flow'},
    {v:'sediments',     l:'Sediments and Turbidity'},
    {v:'ecology',     l:'Aquatic Ecosystems'},
    {v:'mixte',         l:'Mixed / Multi-parameter'},
  ]
}

const MATURITE = {
  fr:[{v:'demarrage',l:'Démarrage (< 1 an)'},{v:'emergent',l:'Émergent (1–3 ans)'},{v:'actif',l:'Actif (3–7 ans)'},{v:'etabli',l:'Établi (7+ ans)'}, {v:'cloture',l:'Terminé (projet clôturé)'}],
  en:[{v:'demarrage',l:'Starting (< 1 yr)'},{v:'emergent',l:'Emerging (1–3 yrs)'},{v:'actif',l:'Active (3–7 yrs)'},{v:'etabli',l:'Established (7+ yrs)'}, {v:'close',l:'Closed (project closed)'}],
}

export default function StepInfo({ data, onChange, lang }) {
  const t = lang==='fr'
  const inp = "input-ceq"
  const sel = "input-ceq cursor-pointer"
  const lbl = "label-ceq"
  return (
    <div className="space-y-4">
      <div>
        <label className={lbl}>
          {t?'Nom du projet *':'Project Name *'}
          <InfoTooltip
            label={t ? 'Information sur le nom du projet' : 'Information about the project name'}
            text={t ? 'Indiquez le nom sous lequel le projet est connu; il pourra être affiché dans le rapport ou lors d’un partage au Réseau provincial.' : 'Enter the name by which the project is known; it may appear in the report or in a Provincial Network contribution.'}
          />
        </label>
        <input type="text" value={data.nomProjet||''} onChange={e=>onChange('nomProjet',e.target.value)}
          placeholder={t?"Ex: Surveillance de la rivière Rimouski":"Ex: Rimouski River Monitoring"}
          className={inp}/>
      </div>
      <div>
        <label className={lbl}>
          {t?'Organisation hôte ':'Host Organization'}
          <InfoTooltip
            label={t ? 'Information sur l’organisation hôte' : 'Information about the host organization'}
            text={t ? 'Organisation qui coordonne, porte ou soutient le projet. Si le projet est indépendant, indiquez-le.' : 'The organization coordinating, hosting, or supporting the project. If it is independent, indicate that.'}
          />
        </label>
        <input type="text" value={data.organisation||''} onChange={e=>onChange('organisation',e.target.value)}
          placeholder={t?"Ex: Groupe Environnement Beauport":"Ex: Beauport Environment Group"}
          className={inp}/>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={lbl}>
            {t?'Type de surveillance':'Monitoring Type'}
            <InfoTooltip
              label={t ? 'Information sur le type de surveillance' : 'Information about monitoring type'}
              text={t ? 'Choisissez le domaine principal observé. Sélectionnez « Mixte / multiparamétrique » si plusieurs domaines sont suivis.' : 'Choose the main subject monitored. Select “Mixed / multi-parameter” when several subjects are tracked.'}
            />
          </label>
          <select value={data.typeProjet||''} onChange={e=>onChange('typeProjet',e.target.value)} className={sel}>
            <option value="">—</option>
            {TYPES[lang].map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        </div>
        <div>
          <label className={lbl}>
            {t?'Maturité du projet':'Project Maturity'}
            <InfoTooltip
              label={t ? 'Information sur la maturité du projet' : 'Information about project maturity'}
              text={t ? 'Situez le projet selon son ancienneté et son état actuel; choisissez « Terminé » si les activités sont clôturées.' : 'Describe the project based on its duration and current status; choose “Closed” if activities have ended.'}
            />
          </label>
          <select value={data.maturite||''} onChange={e=>onChange('maturite',e.target.value)} className={sel}>
            <option value="">—</option>
            {MATURITE[lang].map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={lbl}>
            {t?'Année de début':'Start Year'}
            <InfoTooltip
              label={t ? 'Information sur l’année de début' : 'Information about the start year'}
              text={t ? 'Première année où le projet a réalisé des activités, même si elles étaient alors ponctuelles.' : 'The first year the project carried out activities, even if they were occasional at that time.'}
            />
          </label>
          <input type="number" min="1990" max={new Date().getFullYear()} value={data.anneeDebut||''}
            placeholder="2018" onChange={e=>onChange('anneeDebut',e.target.value)} className={inp}/>
        </div>
        <div>
          <label className={lbl}>
            {t?'Année d\'évaluation':'Evaluation Year'}
            <InfoTooltip
              label={t ? 'Information sur l’année d’évaluation' : 'Information about the evaluation year'}
              text={t ? 'Année à laquelle se rapportent les renseignements saisis, généralement l’année en cours.' : 'The year to which the information entered applies, usually the current year.'}
            />
          </label>
          <input type="number" min="2000" max={new Date().getFullYear()+1}
            value={data.anneeEvaluation||new Date().getFullYear()}
            onChange={e=>onChange('anneeEvaluation',e.target.value)} className={inp}/>
        </div>
      </div>
      <div>
        <label className={lbl}>
          {t?'Description courte (optionnel)':'Short Description (optional)'}
          <InfoTooltip
            label={t ? 'Information sur la description' : 'Information about the description'}
            text={t ? 'Résumez les objectifs, le territoire concerné et les principales activités du projet.' : 'Summarize the project objectives, area, and main activities.'}
          />
        </label>
        <textarea rows={3} value={data.description||''}
          placeholder={t?'Décrivez brièvement votre projet, son territoire et sa mission...':'Briefly describe your project, territory and mission...'}
          onChange={e=>onChange('description',e.target.value)} className={inp+" resize-none"}/>
      </div>
    </div>
  )
}
