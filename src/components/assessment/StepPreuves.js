'use client'
export default function StepPreuves({ data, onChange, lang }) {
  const t = lang==='fr';
  return (
    <div className="space-y-5">
      <div className="bg-ceq-dark text-white rounded-2xl p-5">
        <h3 className="font-display font-bold text-lg mb-2">{t?'Pourquoi le niveau de preuve est-il important ?':'Why does evidence level matter?'}</h3>
        <p className="text-white/80 text-sm leading-relaxed">{t?'Bien qu\'un score de 78 % paraisse rigoureux, sa pertinence est à nuancer si 60 % des données reposent sur des estimations subjectives. Contrairement à un projet s\'appuyant sur des mesures documentées, ce chiffre nécessite d\'être mis en perspective. L\'intégration d\'un niveau de confiance permet ainsi de contextualiser vos résultats auprès de vos partenaires et bailleurs de fonds.':'Although a score of 78 % may seem rigorous, its relevance must be viewed with caution if 60% of the data is based on subjective estimates. Unlike a project based on documented measurements, this figure needs to be put into perspective. Including a confidence level thus allows you to contextualize your results for your partners and funders.'}</p>
      </div>
      <div className="card p-5">
        <p className="font-semibold text-ceq-dark mb-4">{t?'Pour chaque affirmation, indiquez votre niveau de preuve :':'For each statement, indicate your evidence level:'}</p>
        {[
          ['preuveProtocole', t?'Vos protocoles de collecte sont documentés':'Your collection protocols are documented'],
          ['preuveFormation',  t?'La formation des bénévoles est tracée':'Volunteer training is tracked'],
          ['preuveParticipants',t?'Les données de participation sont archivées':'Participation data is archived'],
          ['preuveEcosystemique',t?'Les données sur les milieux surveillés sont vérifiables':'Data on monitored environments is verifiable'],
          ['preuveInfluence',  t?'L\'utilisation de vos données par des décideurs est documentée':'Data use by decision-makers is documented'],
        ].map(([name, label])=>(
          <div key={name} className="mb-5">
            <label className="label-ceq">{label}</label>
            <select value={data[name]||''} onChange={e=>onChange(name,e.target.value)} className="input-ceq cursor-pointer">
              <option value="">{t?'— Non évalué —':'— Not assessed —'}</option>
              <option value="mesure">{t?'Mesuré — données instrumentées et calibrées':'Measured — instrumented and calibrated data'}</option>
              <option value="documente">{t?'Documenté — rapport ou archive disponible':'Documented — report or archive available'}</option>
              <option value="verifie">{t?'Estimé / vérifié par un tiers':'Estimated / third-party verified'}</option>
              <option value="declare">{t?'Déclaratif — estimé sans documentation':'Self-reported — estimated without documentation'}</option>
              <option value="inconnu">{t?'Non renseigné / inconnu':'Not specified / unknown'}</option>
            </select>
          </div>
        ))}
      </div>
      <div className="bg-ceq-ice border border-ceq-iceDark rounded-xl p-4 text-xs text-ceq-slate">
        <strong>{t?'Note :':'Note:'}</strong>{' '}
        {t?'Le niveau de confiance ici est à titre informatif et non sanctionnel. Un projet débutant avec des données déclaratives est tout aussi légitime qu\'un projet établi avec des données mesurées. La transparence renforce la crédibilité.':'The confidence level is just for information not for penalty. A starting project with self-reported data is just as legitimate as an established project with measured data. Transparency strengthens credibility.'}
      </div>
    </div>
  );
}
