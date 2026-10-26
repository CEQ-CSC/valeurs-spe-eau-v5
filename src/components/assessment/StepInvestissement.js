'use client'
import InfoTooltip from '@/components/ui/InfoTooltip'

export default function StepInvestissement({ data, onChange, lang }) {
  const t = lang==='fr';
  const f = (n,v) => onChange(n,v);
  const inp = "input-ceq";
  return (
    <div className="space-y-4">
      <div className="bg-ceq-ice border border-ceq-iceDark rounded-xl p-4 text-sm text-ceq-slate mb-2">
        {t?"Veuillez inclure l'ensemble des ressources mobilisées, incluant les subventions, les contributions en nature, le temps alloué par le personnel ainsi que les dons car ils seront pris en compte dans le calcul du retour social sur investissement (SROI) de votre projet.":'Please include all resources mobilized, including grants, in-kind contributions, staff time, and donations, as they will be taken into account when calculating your project’s social return on investment (SROI).'}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[
          ['budgetAnnuel',t?'Budget annuel moyen':'Average annual budget', t?'Dépenses totales moyennes par année pour faire fonctionner le projet.':'Average total yearly expenditure to operate the project.'],
          ['subventions',t?'Subventions reçues (ann.)':'Grants received (ann.)', t?'Montant annuel des subventions obtenues; ne comptez pas une même somme deux fois.':'Annual amount of grants received; do not count the same amount twice.'],
          ['contributionOrganisme',t?'Contribution de l\'organisme':'Organization contribution', t?'Ressources financières fournies par l’organisme, hors subventions déjà déclarées.':'Financial resources provided by the organization, excluding grants already reported.'],
          ['ressourcesNature',t?'Ressources en nature estimées':'Estimated in-kind resources', t?'Valeur approximative des biens ou services fournis sans paiement (locaux, équipement, transport, etc.).':'Estimated value of goods or services provided without payment (space, equipment, transportation, etc.).'],
        ].map(([n,l,aide])=>(
          <div key={n}>
            <label className="label-ceq">
              {l}
              <InfoTooltip label={`${t ? 'Information' : 'Information'} : ${l}`} text={aide} />
            </label>
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
          <InfoTooltip
            label={t ? 'Information sur l’investissement total cumulatif' : 'Information about cumulative total investment'}
            text={t ? 'Additionnez les ressources financières et en nature mobilisées depuis le début du projet, sans les compter deux fois. Ce montant sert au calcul du ratio SROI.' : 'Add all financial and in-kind resources mobilized since the project began, without double-counting. This amount is used to calculate the SROI ratio.'}
          />
        </label>
        <p className="text-xs text-ceq-slate mb-2 italic">{t?'Somme de toutes les ressources investies depuis le début':'Sum of all resources invested since start'}</p>
        <div className="relative">
          <input type="number" min="0" value={data.total??''} placeholder="0"
            onChange={e=>f('total',e.target.value)} className={inp+" pr-12 border-ceq-cyan"} />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ceq-slate font-medium">$ CAD</span>
        </div>
      </div>
      <div className="bg-ceq-ice border border-ceq-iceDark rounded-xl p-4 text-xs text-ceq-slate">
        <strong>SROI :</strong> {t?'Un SROI de 3:1 signifie que chaque $ investi génère 3 $ de valeur sociale estimée. La moyenne pour la SPE se situe entre 2,5 et 8.':'A SROI of 3:1 means every $1 invested generates $3 of estimated social value. The average for citizen science is 2.5–8.'}
      </div>
    </div>
  );
}
