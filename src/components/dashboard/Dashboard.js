'use client'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp, Coins, Award, Info, ShieldCheck, Users, Building2, Leaf } from 'lucide-react'
import { formatMontant } from '@/lib/calculations/index'

const DIM_COLORS = { scientifique:'#1A5F7A', sociale:'#2E8B57', environnementale:'#0D7377', politique:'#5B4B8A' };

function Jauge({ score, couleur, size=88 }) {
  const r=size/2-6, c=2*Math.PI*r, offset=c-(score/100)*c;
  return (
    <div className="relative" style={{width:size,height:size}}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E2F2FA" strokeWidth={7}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={couleur} strokeWidth={7}
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{transition:'stroke-dashoffset 1s ease-out'}}/>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-black text-ceq-dark">{score}</span>
        <span className="text-[9px] text-ceq-slate">/100</span>
      </div>
    </div>
  );
}

function KpiCard({ label, value, icon: Icon }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-1.5 text-ceq-slate text-[10px] font-semibold uppercase tracking-wide mb-2">
        {Icon&&<Icon className="w-3.5 h-3.5" style={{color:'#3ABFC1'}}/>}<span>{label}</span>
      </div>
      <div className="text-lg font-bold text-ceq-dark">{value}</div>
    </div>
  );
}

export default function Dashboard({ resultats, lang='fr' }) {
  if (!resultats) return null;
  const { scores, scoreGlobal, interpretation, composantes, valeurTotale, sroi, confianceGlobal, confiances, recommandations, chartRadar, chartRadarEN } = resultats;
  const t = lang==='fr';
  const radarData = t?chartRadar:chartRadarEN;
  const labFr={scientifique:'Scientifique',sociale:'Sociale',environnementale:'Environnementale',politique:'Politique'};
  const labEn={scientifique:'Scientific',sociale:'Social',environnementale:'Environmental',politique:'Political'};
  const barData = Object.entries(scores).map(([k,v])=>({ name:t?labFr[k]:labEn[k], score:v, fill:DIM_COLORS[k] }));
  const confStyle={élevé:'text-green-700 bg-green-50 border-green-200',moyen:'text-amber-700 bg-amber-50 border-amber-200',faible:'text-red-700 bg-red-50 border-red-200',inconnu:'text-gray-500 bg-gray-50 border-gray-200'};
  const confLabel={fr:{élevé:'Élevée',moyen:'Moyenne',faible:'Faible',inconnu:'Inconnue'},en:{élevé:'High',moyen:'Moderate',faible:'Low',inconnu:'Unknown'}};
  const niveauBg={excellent:'bg-green-600',bon:'bg-ceq-sci',moyen:'bg-amber-600',faible:'bg-red-600'};
  const interp=interpretation||{};
  return (
    <div className="space-y-6 animate-fade-up">
      {/* En-tête */}
      <div className="ceq-header-bg text-white rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            {resultats.info?.nomProjet&&<h2 className="font-display text-2xl font-bold">{resultats.info.nomProjet}</h2>}
            {resultats.info?.organisation&&<p className="text-white/70 text-sm">{resultats.info.organisation}</p>}
            <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold text-white ${niveauBg[interp.niveau]||'bg-ceq-slate'}`}>
              {t?interp.fr:interp.en}
            </span>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center border border-white/20">
            <div className="font-display text-4xl font-black text-ceq-cyan">{scoreGlobal}</div>
            <div className="text-xs text-white/70 mt-1">{t?'Score global /100':'Global score /100'}</div>
            <div className={`mt-1.5 text-[10px] px-2 py-0.5 rounded-full border inline-block ${confStyle[confianceGlobal?.niveau]||confStyle.inconnu}`}>
              {t?'Confiance:':'Confidence:'} {confLabel[lang][confianceGlobal?.niveau]||'—'}
            </div>
          </div>
        </div>
      </div>

      {/* Valeur économique */}
      <div>
        <h3 className="section-title flex items-center gap-2 mb-3"><Coins className="w-5 h-5 text-ceq-cyan"/>{t?'Valeur économique estimée':'Estimated Economic Value'}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          <KpiCard label={t?'Travail bénévole':'Volunteer labour'} value={formatMontant(composantes?.travail_benevole,lang)} icon={Users}/>
          <KpiCard label={t?'Données':'Data value'} value={formatMontant(composantes?.donnees_scientifiques,lang)} icon={ShieldCheck}/>
          <KpiCard label={t?'Services éco.':'Eco. services'} value={formatMontant(composantes?.ecosystemique,lang)} icon={Leaf}/>
          <KpiCard label={t?'Politique':'Political'} value={formatMontant(composantes?.influence_politique,lang)} icon={Building2}/>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="card p-4 flex-1 bg-gradient-to-br from-ceq-dark to-ceq-slate text-white">
            <div className="text-xs font-semibold text-ceq-cyan uppercase tracking-wide mb-1">{t?'Valeur totale estimée':'Total estimated value'}</div>
            <div className="text-3xl font-black">{formatMontant(valeurTotale,lang)}</div>
            {sroi&&<div className="mt-1 text-sm text-white/80">SROI : <strong className="text-ceq-cyan">{sroi}:1</strong></div>}
          </div>
          <div className="card p-4 flex-1 bg-amber-50 border-amber-200 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5"/>
            <p className="text-xs text-amber-800">{t?'Estimations à des fins de plaidoyer — non vérifiées comptablement.':'Estimates for advocacy purposes — not accounting-verified.'}</p>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-5">
          <p className="text-xs font-bold text-ceq-slate uppercase tracking-wide mb-3">{t?'Profil multidimensionnel':'Multidimensional profile'}</p>
          <ResponsiveContainer width="100%" height={230}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E2F2FA"/>
              <PolarAngleAxis dataKey="dimension" tick={{fontSize:11,fill:'#222F30',fontWeight:600}}/>
              <Radar dataKey="score" stroke="#63E3E5" fill="#63E3E5" fillOpacity={0.18} strokeWidth={2}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <p className="text-xs font-bold text-ceq-slate uppercase tracking-wide mb-3">{t?'Score par dimension':'Score by dimension'}</p>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={barData} layout="vertical" margin={{left:8,right:20,top:4,bottom:4}}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2F2FA"/>
              <XAxis type="number" domain={[0,100]} tick={{fontSize:10}}/>
              <YAxis type="category" dataKey="name" tick={{fontSize:10,fill:'#222F30',fontWeight:500}} width={80}/>
              <Tooltip formatter={v=>[`${v}/100`]} contentStyle={{borderRadius:'10px',border:'1px solid #E2F2FA'}}/>
              <Bar dataKey="score" radius={[0,6,6,0]} barSize={18}>
                {barData.map((d,i)=><Cell key={i} fill={d.fill}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Jauges par dimension */}
      <div>
        <h3 className="section-title flex items-center gap-2 mb-3"><TrendingUp className="w-5 h-5 text-ceq-cyan"/>{t?'Détail par dimension':'Score by dimension'}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(scores).map(([k,v])=>{
            const cn=confiances?.[k]?.niveau||'inconnu';
            return (
              <div key={k} className="card p-4 flex flex-col items-center gap-2">
                <span className="text-2xl">{{scientifique:'🔬',sociale:'🤝',environnementale:'🌿',politique:'🏛️'}[k]}</span>
                <Jauge score={v} couleur={DIM_COLORS[k]}/>
                <span className="text-xs font-bold text-ceq-dark">{t?labFr[k]:labEn[k]}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${confStyle[cn]||confStyle.inconnu}`}>{confLabel[lang][cn]||'—'}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommandations */}
      {recommandations?.length>0&&(
        <div>
          <h3 className="section-title flex items-center gap-2 mb-3"><Award className="w-5 h-5 text-ceq-cyan"/>{t?'Recommandations':'Recommendations'}</h3>
          <div className="space-y-2">
            {recommandations.map((r,i)=>(
              <div key={i} className={`rounded-xl p-4 border-l-4 ${r.priorite==='haute'?'border-red-400 bg-red-50':r.priorite==='moyenne'?'border-amber-400 bg-amber-50':'border-green-400 bg-green-50'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-ceq-dark text-sm">{r.titre}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${r.priorite==='haute'?'bg-red-100 text-red-700':r.priorite==='moyenne'?'bg-amber-100 text-amber-700':'bg-green-100 text-green-700'}`}>
                    {r.priorite==='haute'?(t?'Haute':'High'):r.priorite==='moyenne'?(t?'Moyenne':'Medium'):(t?'Basse':'Low')}
                  </span>
                </div>
                <p className="text-xs text-ceq-slate">{r.texte}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="bg-ceq-ice border border-ceq-iceDark rounded-xl p-3 flex gap-2 text-xs text-ceq-slate">
        <Info className="w-4 h-4 shrink-0 mt-0.5"/>
        <span><strong>V5 :</strong> </span>
      </div>
    </div>
  );
}
