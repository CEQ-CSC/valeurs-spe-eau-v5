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
import StepImpact         from '@/components/assessment/StepImpact'
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
  { id:'info',           icon: Droplets,        fr:'Projet',                    en:'Project' },
  { id:'investissement', icon: DollarSign,      fr:'Valeur',                    en:'Value' },
  { id:'scientifique',   icon: Microscope,      fr:'Valeur',                    en:'Value' },
  { id:'sociale',        icon: Users,           fr:'Valeur',                    en:'Value' },
  { id:'environnementale', icon: Leaf,         fr:'Valeur',                    en:'Value' },
  { id:'politique',      icon: Building2,       fr:'Valeur',                    en:'Value' },
  { id:'impact',         icon: Sparkles,        fr:'Impact',                    en:'Impact' },
  { id:'preuves',        icon: ClipboardList,   fr:'Preuves',                   en:'Evidence' },
  { id:'resultats',      icon: BarChart3,       fr:'Synthèse',                  en:'Summary' },
  { id:'rapport',        icon: FileText,        fr:'Rapport',                   en:'Report' },
  { id:'reseau',         icon: Network,         fr:'Réseau',                    en:'Network' },
]

const ETAT_INITIAL = {
  info:{}, investissement:{}, scientifique:{}, sociale:{},
  environnementale:{ risquesActifs:[] }, politique:{}, impact:{}, preuves:{}
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
    collectif:'Québec water Collective',
    science:'Participatory water science',
    confirm:'Do you really want to erase all entered data?',
  }
}

// ── Composant Header ───────────────────────────────────────────────
function Header({ lang, onToggle }) {
  const tr = TR[lang]
  return (
    <header className="app-header no-print">
      <div className="brandbar">
        <a href="https://www.g3e-ewag.ca/collectif-eau-quebec/" target="_blank" rel="noopener noreferrer"
          className="brand-lockup hover:opacity-85 transition-opacity">
          <Image
            src="/logo-ceq.png"
            alt="Logo Collectif Eau Québec"
            width={160}
            height={96}
            priority
            className="h-24 w-auto object-contain sm:h-28"
          />
        </a>
        <button onClick={onToggle} className="language-switch cursor-pointer" aria-label={lang === 'fr' ? 'Switch language to English' : 'Changer la langue pour le français'}>
          <Globe size={15} aria-hidden="true" />
          {lang==='fr'?'EN':'FR'}
        </button>
      </div>
      <div className="hero-band">
        <div className="hero-inner">
          <h1 className="hero-title">{tr.titre}</h1>
          <p className="hero-subtitle">{tr.sousTitre}</p>
        </div>
      </div>
    </header>
  )
}

// ── Stepper ────────────────────────────────────────────────────────
function Stepper({ etapeId, onGo, completion, lang }) {
  const blocks = [
    {
      id: 'projet',
      title: 'PROJET',
      steps: [{ id: 'info', label: lang === 'fr' ? 'Informations' : 'Information' }],
    },
    {
      id: 'valeur',
      title: 'VALEUR',
      steps: [
        { id: 'investissement', label: lang === 'fr' ? 'Économie' : 'Economy' },
        { id: 'scientifique', label: lang === 'fr' ? 'Science' : 'Science' },
        { id: 'sociale', label: lang === 'fr' ? 'Social' : 'Social' },
        { id: 'environnementale', label: lang === 'fr' ? 'Environnement' : 'Environment' },
        { id: 'politique', label: lang === 'fr' ? 'Politique' : 'Policy' },
      ],
    },
    {
      id: 'impact',
      title: lang === 'fr' ? 'IMPACT' : 'IMPACT',
      steps: [{ id: 'impact', label: lang === 'fr' ? 'Impact par dimension' : 'Impact by dimension' }],
    },
    {
      id: 'preuve',
      title: lang === 'fr' ? 'QUALITÉ DE L’ÉVIDENCE' : 'QUALITY OF EVIDENCE',
      steps: [{ id: 'preuves', label: lang === 'fr' ? 'Preuves' : 'Evidence' }],
    },
    {
      id: 'synthese',
      title: lang === 'fr' ? 'SYNTHÈSE GLOBALE' : 'GLOBAL SYNTHESIS',
      steps: [
        { id: 'resultats', label: lang === 'fr' ? 'Synthèse' : 'Summary' },
        { id: 'rapport', label: lang === 'fr' ? 'Rapport' : 'Report' },
        { id: 'reseau', label: lang === 'fr' ? 'Réseau provincial' : 'Provincial network' },
      ],
    },
  ]

  return (
    <nav className="stepper-shell no-print" aria-label={lang === 'fr' ? 'Étapes de l’évaluation' : 'Assessment steps'}>
      <div className="stepper-grid">
        {blocks.map((block) => {
          const activeStep = block.steps.some((s) => s.id === etapeId)
          return (
            <div key={block.id} className={`stepper-block ${activeStep ? 'active' : ''}`}>
              <div className="stepper-block-header">{block.title}</div>
              <div className="stepper-block-actions">
                {block.steps.map((step) => {
                  const current = ETAPES.find((item) => item.id === step.id)
                  const pct = completion[step.id] ?? 0
                  const isActive = step.id === etapeId
                  const isDone = pct >= 80
                  const IconComponent = current?.icon || Droplets
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => onGo(step.id)}
                      aria-current={isActive ? 'step' : undefined}
                      className={`stepper-chip ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                      title={lang === 'fr' ? current?.fr : current?.en}
                    >
                      <IconComponent className="stepper-icon" aria-hidden="true" />
                      <span className="stepper-label">{step.label}</span>
                      <span className="stepper-progress" aria-hidden="true">
                        <span style={{ width: `${pct}%` }} />
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </nav>
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
  }, [setFormData])

  const makeUpdater = useCallback((section) =>
    (name, value) => updateSection(section, name, value),
  [updateSection])

  // ── Calcul — appel UNIQUE au moteur unifié ───────────────────────
  const calculer = useCallback(() => {
    const res = calculerAssessment({ ...formData, info:{ ...formData.info, langue:lang } })
    setResultats(res)
    setEtapeId('resultats')
    window.scrollTo({ top:0, behavior:'smooth' })
  }, [formData, lang, setEtapeId])

  const reset = useCallback(() => {
    if (window.confirm(tr.confirm)) {
      setFormData(ETAT_INITIAL)
      setResultats(null)
      setEtapeId('info')
    }
  }, [tr.confirm, setFormData, setResultats, setEtapeId])

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
  const isValuePhase = ['investissement','scientifique','sociale','environnementale','politique'].includes(etapeId)
  const isImpactPhase = etapeId==='impact'
  const isEvidencePhase = etapeId==='preuves'

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
      case 'impact':          return <StepImpact data={d.impact||{}} onChange={fn('impact')} lang={lang}/>
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

      <main id="contenu" className="mx-auto max-w-6xl px-4 py-7 sm:px-6 md:py-9">
        <Stepper etapeId={etapeId} onGo={setEtapeId} completion={completion} lang={lang}/>

        <div className="step-context">
          <div className="step-context-title">
            <span className="step-context-icon">
              {CurrentIcon && <CurrentIcon size={19} aria-hidden="true" />}
            </span>
            <span>
              <span className="step-context-meta block">
                {lang === 'fr' ? 'ÉTAPE' : 'STEP'} {String(idxActif + 1).padStart(2, '0')} / {String(ETAPES.length).padStart(2, '0')}
              </span>
              <span className="step-context-name block">{lang==='fr'?titreEtape?.fr:titreEtape?.en}</span>
            </span>
          </div>
          <div className="w-20 text-right sm:w-28">
            <span className="step-context-meta block">{Math.round(((idxActif + 1) / ETAPES.length) * 100)}%</span>
            <div className="progress-bar mt-1.5" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(((idxActif + 1) / ETAPES.length) * 100)}>
              <div className="progress-fill" style={{ width: `${((idxActif + 1) / ETAPES.length) * 100}%` }} />
            </div>
          </div>
        </div>

        <section className="card step-card mb-5 animate-fade-in" aria-label={lang === 'fr' ? titreEtape?.fr : titreEtape?.en}>
          {isValuePhase && (
            <div className="mb-5 border-b border-ceq-line pb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ceq-slate/80">
                {lang === 'fr' ? 'Valeur' : 'Value'}
              </p>
            </div>
          )}
          {isEvidencePhase && (
            <div className="mb-5 border-b border-ceq-line pb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ceq-slate/80">
                {lang === 'fr' ? 'Preuves' : 'Evidence'}
              </p>
            </div>
          )}
          {isImpactPhase && (
            <div className="mb-5 border-b border-ceq-line pb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ceq-slate/80">
                {lang === 'fr' ? 'Impact' : 'Impact'}
              </p>
            </div>
          )}
          {renderStep()}
        </section>

        {/* Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4">
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

      <footer className="app-footer no-print">
        <p>© {new Date().getFullYear()} Collectif Eau Québec / Québec Water Collective</p>
        <a
          href="https://www.g3e-ewag.ca/collectif-eau-quebec/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-ceq-slate underline-offset-4 hover:underline"
        >
          {lang === 'fr' ? 'Visiter le site du Collectif Eau Québec' : 'Visit the Québec Water Collective website'}
        </a>
      </footer>
    </div>
  )
}
