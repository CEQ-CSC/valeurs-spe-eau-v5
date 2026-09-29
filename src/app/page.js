'use client'
import { useState, useCallback } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { 
  ChevronRight, 
  ChevronLeft, 
  Printer, 
  RotateCcw, 
  Globe, 
  Droplets, 
  DollarSign, 
  Microscope, 
  Users, 
  Leaf, 
  Building2, 
  ClipboardList, 
  BarChart3, 
  FileText, 
  Network, 
  Sparkles 
} from 'lucide-react'

// ── Importations des étapes (architecture V5 unifiée) ──────────────
import StepInfo           from '@/components/assessment/StepInfo'
import StepInvestissement from '@/components/assessment/StepInvestissement'
import StepScientifique   from '@/components/assessment/StepScientifique'
import StepSociale        from '@/components/assessment/StepSociale'
import StepEnvironnementale from '@/components/assessment/StepEnvironnementale'
import StepPolitique      from '@/components/assessment/StepPolitique'
import StepPreuves        from '@/components/assessment/StepPreuves'

// Recharts n'est pas SSR-compatible → import dynamique
const Dashboard       = dynamic(() => import('@/components/dashboard/Dashboard'),  { ssr:false })
const RapportPrint    = dynamic(() => import('@/components/report/RapportPrint'),   { ssr:false })
const ReseauProvincial= dynamic(() => import('@/components/ReseauProvincial'),      { ssr:false })

// ── SOURCE UNIQUE DE VÉRITÉ — aucun calcul ici ──────────────────
import { calculerAssessment } from '@/lib/calculations/index'
import { completionParSection } from '@/lib/validation/assessmentSchema'

// ── Constantes ─────────────────────────────────────────────────────
const ETAPES = [
  { id:'info',           icon: Droplets,        fr:'Identification',       en:'Project Info' },
  { id:'investissement',   icon: DollarSign,      fr:'Investissements',      en:'Investment' },
  { id:'scientifique',     icon: Microscope,      fr:'Scientifique',         en:'Scientific' },
  { id:'sociale',          icon: Users,           fr:'Sociale',              en:'Social' },
  { id:'environnementale', icon: Leaf,            fr:'Environnementale',     en:'Environmental' },
  { id:'politique',        icon: Building2,       fr:'Politique',            en:'Political' },
  { id:'preuves',          icon: ClipboardList,   fr:'Preuves',              en:'Evidence' },
  { id:'resultats',        icon: BarChart3,       fr:'Résultats',            en:'Results' },
  { id:'rapport',          icon: FileText,        fr:'Rapport',              en:'Report' },
  { id:'reseau',           icon: Network,         fr:'Réseau provincial',    en:'Provincial Network' },
]

const ETAT_INITIAL = {
  info:{}, investissement:{}, scientifique:{}, sociale:{},
  environnementale:{ risquesActifs:[] }, politique:{}, preuves:{}
}

// ── Labels traduits ────────────────────────────────────────────────
const TR = {
  fr:{
    titre:"CALCULATEUR DE VALEUR",
    sousTitre:"Évaluez les valeurs dimensionnelles de vos projets de sciences participatives de l'eau",
    precedent:'Précédent', suivant:'Suivant',
    calculer:'Calculer la valeur', reset:'Recommencer',
    imprimer:'Imprimer / PDF', etape:'Étape',
    collectif:'Collectif Eau Québec',
    science:"Science participative de l'eau",
    confirm:'Voulez-vous vraiment effacer toutes les données saisies ?',
  },
  en:{
    titre:"VALUE CALCULATOR",
    sousTitre:"Evaluate the dimensional values of your participatory water science projects.",
    precedent:'Previous', suivant:'Next',
    calculer:'Calculate Value', reset:'Reset',
    imprimer:'Print / PDF', etape:'Step',
    collectif:'Collectif Eau Québec',
    science:'Participatory water science',
    confirm:'Do you really want to erase all entered data?',
  }
}

// ── Composant Header ───────────────────────────────────────────────
function Header({ lang, onToggle }) {
  const tr = TR[lang]
  return (
    <header className="ceq-header-bg text-white no-print">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <a href="https://www.g3e-ewag.ca/collectif-eau-quebec/" target="_blank" rel="noopener noreferrer"
             className="hover:opacity-85 transition-opacity shrink-0">
            <Image src="/logo-ceq.png" alt="Logo Collectif Eau Québec"
              width={160} height={44} priority
              className="h-11 w-auto object-contain bg-white/95 p-1.5 rounded-xl"/>
          </a>
          <div>
            <div className="font-display font-bold text-base leading-tight">{tr.collectif}</div>
            <div className="text-white/60 text-xs">{tr.science}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onToggle}
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer">
            <Globe size={14}/>
            {lang==='fr'?'EN':'FR'}
          </button>
        </div>
      </div>
      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 pb-5 pt-1">
        <h1 className="font-display text-xl md:text-2xl font-bold">{tr.titre}</h1>
        <p className="text-white/65 text-sm mt-1 max-w-2xl leading-relaxed">{tr.sousTitre}</p>
      </div>
    </header>
  )
}

// ── Stepper ────────────────────────────────────────────────────────
function Stepper({ etapeId, onGo, completion, lang }) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 no-print">
      {ETAPES.map((e)=>{
        const pct = completion[e.id]??0
        const isActive = e.id===etapeId
        const isDone   = pct>=80
        const IconComponent = e.icon
        return (
          <button key={e.id} onClick={()=>onGo(e.id)}
            className={`flex flex-col items-center flex-1 min-w-[52px] p-1.5 rounded-xl transition-all duration-200 cursor-pointer
              ${isActive?'bg-ceq-dark text-white shadow-ceq-md':isDone?'bg-green-100 text-green-800 hover:bg-green-200':'bg-white text-ceq-slate hover:bg-ceq-iceDark'}`}>
            <IconComponent size={18} className="mb-0.5" />
            <span className="text-[9px] font-semibold text-center leading-tight hidden sm:block">
              {lang==='fr'?e.fr:e.en}
            </span>
            <div className="w-full mt-1 h-0.5 rounded-full bg-current opacity-20">
              <div className="h-full rounded-full opacity-100 transition-all duration-500"
                style={{width:`${pct}%`,background:isActive?'#63E3E5':isDone?'#2E8B57':'currentColor'}}/>
            </div>
          </button>
        )
      })}
    </div>
  )
}

// ── Page principale ─────────────────────────────────────────────────
export default function Home() {
  const [lang,    setLang]    = useState('fr')
  const [etapeId, setEtapeId] = useState('info')
  const [formData,setFormData]= useState(ETAT_INITIAL)
  const [resultats,setResultats]= useState(null)

  const tr = TR[lang]
  const idxActif = ETAPES.findIndex(e=>e.id===etapeId)
  const completion = completionParSection({ ...formData, info:{ ...formData.info, langue:lang } })

  // ── Mise à jour du formData par section ──────────────────────────
  const updateSection = useCallback((section, name, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [name]: value }
    }))
  }, [])

  const makeUpdater = useCallback((section) =>
    (name, value) => updateSection(section, name, value),
  [updateSection])

  // ── Calcul — appel UNIQUE au moteur unifié ───────────────────────
  const calculer = useCallback(() => {
    const res = calculerAssessment({ ...formData, info:{ ...formData.info, langue:lang } })
    setResultats(res)
    setEtapeId('resultats')
    window.scrollTo({ top:0, behavior:'smooth' })
  }, [formData, lang])

  const reset = useCallback(() => {
    if (window.confirm(tr.confirm)) {
      setFormData(ETAT_INITIAL)
      setResultats(null)
      setEtapeId('info')
    }
  }, [tr.confirm])

  const goNext = () => {
    const next = ETAPES[Math.min(idxActif+1, ETAPES.length-1)]
    if (next) { setEtapeId(next.id); window.scrollTo({top:0,behavior:'smooth'}) }
  }
  const goPrev = () => {
    const prev = ETAPES[Math.max(idxActif-1,0)]
    if (prev) { setEtapeId(prev.id); window.scrollTo({top:0,behavior:'smooth'}) }
  }

  const isLastFormStep = etapeId==='preuves'
  const showPrint = etapeId==='rapport'

  // ── Rendu de l'étape ────────────────────────────────────────────
  const renderStep = () => {
    const d = formData
    const fn = (sec) => makeUpdater(sec)
    switch(etapeId) {
      case 'info':            return <StepInfo data={d.info||{}} onChange={fn('info')} lang={lang}/>
      case 'investissement':  return <StepInvestissement data={d.investissement||{}} onChange={fn('investissement')} lang={lang}/>
      case 'scientifique':    return <StepScientifique data={d.scientifique||{}} onChange={fn('scientifique')} lang={lang}/>
      case 'sociale':         return <StepSociale data={d.sociale||{}} onChange={fn('sociale')} lang={lang}/>
      case 'environnementale':return <StepEnvironnementale data={d.environnementale||{}} onChange={fn('environnementale')} lang={lang}/>
      case 'politique':       return <StepPolitique data={d.politique||{}} onChange={fn('politique')} lang={lang}/>
      case 'preuves':         return <StepPreuves data={d.preuves||{}} onChange={fn('preuves')} lang={lang}/>
      case 'resultats':       return <Dashboard resultats={resultats} lang={lang}/>
      case 'rapport':         return <RapportPrint resultats={resultats} lang={lang}/>
      case 'reseau':          return <ReseauProvincial resultatsCalculateur={resultats} lang={lang}/>
      default: return null
    }
  }

  const titreEtape = ETAPES[idxActif]
  const CurrentIcon = titreEtape?.icon

  return (
    <div className="min-h-screen bg-ceq-ice">
      <Header lang={lang} onToggle={()=>setLang(l=>l==='fr'?'en':'fr')}/>

      <main className="max-w-5xl mx-auto px-4 py-6 no-print">
        {/* Stepper */}
        <div className="mb-5">
          <Stepper etapeId={etapeId} onGo={setEtapeId} completion={completion} lang={lang}/>
        </div>

        {/* Barre de progression */}
        <div className="flex items-center justify-between text-xs font-semibold text-ceq-slate bg-white px-4 py-2 rounded-xl border border-ceq-iceDark mb-5 shadow-ceq-sm">
          <span className="flex items-center gap-2">
            {CurrentIcon && <CurrentIcon size={18} className="text-ceq-cyanDark" />}
            {lang==='fr'?titreEtape?.fr:titreEtape?.en}
            <span className="text-ceq-slate/50">({tr.etape} {idxActif+1}/{ETAPES.length})</span>
          </span>
          <span>{Math.round(((idxActif+1)/ETAPES.length)*100)}%</span>
        </div>

        {/* Carte de l'étape */}
        <div className="card p-6 md:p-8 mb-5 animate-fade-in">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-3">
            {idxActif > 0 && (
              <button onClick={goPrev}
                className="px-4 py-2.5 border-2 border-ceq-iceDark text-ceq-slate font-semibold rounded-xl hover:bg-ceq-iceDark flex items-center gap-2 text-sm transition-all cursor-pointer">
                <ChevronLeft size={17}/> {tr.precedent}
              </button>
            )}
            {idxActif > 0 && (
              <button onClick={reset}
                className="text-ceq-slate/50 hover:text-ceq-slate flex items-center gap-1.5 text-sm transition-all px-2 cursor-pointer">
                <RotateCcw size={13}/> {tr.reset}
              </button>
            )}
          </div>

          <div className="flex gap-3">
            {showPrint && (
              <button onClick={()=>window.print()}
                className="btn-ghost flex items-center gap-2 text-sm">
                <Printer size={16}/> {tr.imprimer}
              </button>
            )}
            {isLastFormStep ? (
              <button onClick={calculer}
                className="btn-cyan flex items-center gap-2 text-sm px-5 py-2.5 cursor-pointer">
                <Sparkles size={16} /> {tr.calculer} <ChevronRight size={17}/>
              </button>
            ) : idxActif < ETAPES.length-1 && !['resultats','rapport','reseau'].includes(etapeId) ? (
              <button onClick={goNext}
                className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5 cursor-pointer">
                {tr.suivant} <ChevronRight size={17}/>
              </button>
            ) : ['resultats','rapport'].includes(etapeId) ? (
              <button onClick={goNext}
                className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5 cursor-pointer">
                {etapeId==='resultats'?(lang==='fr'?'Rapport':'Report'):(lang==='fr'?'Réseau provincial':'Provincial Network')} <ChevronRight size={17}/>
              </button>
            ) : null}
          </div>
        </div>
      </main>

      <footer className="no-print mt-8 border-t border-ceq-iceDark py-5 text-center text-xs text-ceq-slate">
  <div>
    © {new Date().getFullYear()} Collectif Eau Québec / Québec Water Collective
    {lang === 'fr' ? ' Tous droits réservés' : ' All rights reserved'}
  </div>
  <div className="mt-1">
    <a href="https://www.g3e-ewag.ca/collectif-eau-quebec/" target="_blank" rel="noopener noreferrer"
      className="text-ceq-cyan hover:underline">
      {lang === 'fr' ? 'Visiter g3e-ewag.ca/collectif-eau-quebec' : 'Visit g3e-ewag.ca/collectif-eau-quebec'}
    </a>
  </div>
</footer>
    </div>
  )
}
