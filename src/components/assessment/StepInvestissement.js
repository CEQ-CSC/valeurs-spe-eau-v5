'use client'
export default function StepInvestissement({ data, onChange, lang }) {
  const t = lang==='fr';
  const f = (n,v) => onChange(n,v);
  const inp = "input-ceq";
  return (
    <div className="space-y-4">
      <div className="bg-ceq-ice border border-ceq-iceDark rounded-xl p-4 text-sm text-ceq-slate mb-2">
        {t?'Veuillez inclure l'ensemble des ressources mobilisées, incluant les subventions, les contributions en nature, le temps alloué par le personnel ainsi que les dons car ils seront pris en compte dans le calcul du retour social sur investissement (SROI) de votre projet.':'Please include all resources mobilized, including grants, in-kind contributions, staff time, and donations, as they will be taken into account when calculating your project’s social return on investment (SROI).'}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[
          ['budgetAnnuel',t?'Budget annuel moyen':'Average annual budget'],
          ['subventions',t?'Subventions reçues (ann.)':'Grants received (ann.)'],
          ['contributionOrganisme',t?'Contribution de l\'organisme':'Organization contribution'],
          ['ressourcesNature',t?'Ressources en nature estimées':'Estimated in-kind resources'],
        ].map(([n,l])=>(
          <div key={n}>
            <label className="label-ceq">{l}</label>
            <div className="relative">
              <input type="number" min="0" value={data[n]??''} placeholder="0"
                onChange={e=>f(n,e.target.value)} className={inp+" pr-12"} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ceq-slate font-medium">$</span>
            </div>
          </div>
        ))}
      </div>
      <div>
        <label className="label-ceq font-bold text-ceq-dark">
          {t?'Investissement total cumulatif (toute la durée du projet)':'Total cumulative investment (project lifetime)'}
        </label>
        <p className="text-xs text-ceq-slate mb-2 italic">{t?'Somme de toutes les ressources investies depuis le début':'Sum of all resources invested since start'}</p>
        <div className="relative">
          <input type="number" min="0" value={data.total??''} placeholder="0"
            onChange={e=>f('total',e.target.value)} className={inp+" pr-12 border-ceq-cyan"} />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ceq-slate font-medium">$ CAD</span>
        </div>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
        <strong>SROI :</strong> {t?'Un SROI de 3:1 signifie que chaque $ investi génère 3 $ de valeur sociale estimée. La moyenne pour la SPE se situe entre 2,5 et 8.':'A SROI of 3:1 means every $1 invested generates $3 of estimated social value. The average for citizen science is 2.5–8.'}
      </div>
    </div>
  );
}
