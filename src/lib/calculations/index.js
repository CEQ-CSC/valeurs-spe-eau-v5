/**
 * ═══════════════════════════════════════════════════════════
 *  MOTEUR DE CALCUL UNIFIÉ — SPE-Eau V5
 *  Collectif Eau Québec / G3E-EWAG
 *
 *  ✅ SOURCE UNIQUE DE VÉRITÉ — aucun calcul dans page.js
 *  ✅ Pondérations 25/25/25/25 (équipondérées — défendables)
 *  ✅ Valeur économique SÉPARÉE du score multidimensionnel
 *  ✅ Niveau de confiance par dimension
 *  ✅ Toutes entrées validées et bornées [0,100]
 * ═══════════════════════════════════════════════════════════
 */

export const METHODOLOGIE_VERSION = '1.0';
export const ANNEE_REFERENCE = 2024;

// ── Pondérations MCDA (équipondérées) ──────────────────────────────
export const POIDS = { scientifique:0.25, sociale:0.25, environnementale:0.25, politique:0.25 };

// ── Valeurs monétaires de référence (avec sources) ──────────────────
export const REF = {
  tauxHoraireBenevole:     22.60,  // Stats Canada, ESG 2022, QC
  coutObs_simple:          35,     // MELCCFP 2022, physico-chimie base
  coutObs_intermediaire:   75,     // MELCCFP 2023, multiparamétrique
  coutObs_avancee:         185,    // Env. Canada 2023, labo complet
  valeurFormation:         420,    // Commission formation QC 2023
  valeurSensibilisation:   38,     // INSPQ 2020, par personne
  valeurHaMilieuxHumides:  9200,   // TEEB Canada 2021
  valeurKmCoursDeau:       1800,   // Univ. Sherbrooke 2020
  valeurConsultation:      3500,   // Secrétariat CE QC 2022
  // Coûts évités — modèle probabiliste
  coutContaminationBase:   85000,  // INSPQ 2019, par 1000 hab.
  probDetectionSPE_conta:  0.35,
  coutAlguesBase:          45000,  // MDDELCC 2020
  probDetectionSPE_algues: 0.55,
  coutDeversement:         120000, // MDDELCC 2022
  probDetectionSPE_dever:  0.25,
  coutFermeturePlage:      28000,  // MESI 2021
  probDetectionSPE_plage:  0.50,
};

// ── Normalisation ───────────────────────────────────────────────────
function borne(v) { return isNaN(v)||v===null?0:Math.max(0,Math.min(100,Math.round(v))); }

function likert(v) {
  const n = Number(v);
  if (!v || isNaN(n) || n===0) return null;
  return borne(((Math.max(1,Math.min(5,n)) - 1) / 4) * 100);
}

function logScore(v, saturation) {
  const n = Number(v);
  if (!v||isNaN(n)||n<=0) return null;
  return borne((Math.log10(n+1)/Math.log10(saturation+1))*100);
}

function dureeScore(annees) {
  const n = Number(annees);
  if (!annees||isNaN(n)||n<=0) return null;
  const table = [[15,100],[10,88],[7,75],[5,62],[3,48],[2,35],[1,20]];
  return (table.find(([t]) => n>=t)||[0,10])[1];
}

function influenceScore(v) {
  const map = {1:10,2:30,3:55,4:78,5:100};
  const n = Number(v);
  return (!v||isNaN(n)) ? null : (map[Math.max(1,Math.min(5,Math.round(n)))]??null);
}

function moyPonderee(items) {
  const valides = items.filter(i=>i.score!==null&&i.score!==undefined);
  if (!valides.length) return 0;
  const tp = valides.reduce((s,i)=>s+i.poids,0);
  return valides.reduce((s,i)=>s+i.score*i.poids,0)/tp;
}

// ── Dimension Scientifique ──────────────────────────────────────────
function calcScientifique(d) {
  const s = [
    {id:'protocole',          score:likert(d.protocoleRigueur),      poids:0.25},
    {id:'couverture_spatiale',score:moyPonderee([
      {score:logScore(d.nbSites,50),     poids:0.5},
      {score:likert(d.couvertureSpatiale),poids:0.5},
    ]),                                                               poids:0.20},
    {id:'couverture_temps',   score:dureeScore(d.anneesSurveillance), poids:0.15},
    {id:'diversite',          score:likert(d.diversiteParametres),    poids:0.15},
    {id:'qualite',            score:likert(d.controleQualite),        poids:0.15},
    {id:'integration',        score:moyPonderee([
      {score:likert(d.integrationBases),   poids:0.6},
      {score:logScore(d.nbPublications,10),poids:0.4},
    ]),                                                               poids:0.10},
  ];
  const score = borne(moyPonderee(s));
  const nb = Math.max(0, Number(d.nombreEchantillons)||0);
  const tarif = REF[`coutObs_${d.complexiteEchantillons||'simple'}`]??REF.coutObs_simple;
  const valeurDonnees  = Math.round(nb * tarif);
  const niveauForm     = (likert(d.protocoleRigueur)||0)/100;
  const valeurFormation= Math.round((Number(d.nbBenevoles)||0)*REF.valeurFormation*niveauForm);
  return { score, scores_detail:s, valeur_eco:{ valeurDonnees, valeurFormation, total:valeurDonnees+valeurFormation, tarif }};
}

// ── Dimension Sociale ───────────────────────────────────────────────
function calcSociale(d) {
  const sParticipation = moyPonderee([
    {score:logScore(d.nbParticipants,300),              poids:0.6},
    {score:d.retentionPct!==''&&d.retentionPct!==null?borne(Number(d.retentionPct)):null, poids:0.4},
  ]);
  const s = [
    {id:'participation', score:sParticipation,           poids:0.30},
    {id:'apprentissage', score:likert(d.apprentissage),  poids:0.25},
    {id:'inclusion',     score:likert(d.inclusion),      poids:0.20},
    {id:'rayonnement',   score:likert(d.rayonnement),    poids:0.15},
    {id:'transfert',     score:likert(d.transfert),      poids:0.10},
  ];
  const score = borne(moyPonderee(s));
  const hTotal = Math.max(0, Number(d.heuresTotal)||0);
  const hForm  = Math.max(0, Number(d.heuresFormation)||0);
  const hTerr  = Math.max(0, Number(d.heuresTerrain)||0);
  const hCoord = Math.max(0, Number(d.heuresCoordination)||0);
  const hAutre = Math.max(0, hTotal - hForm - hTerr - hCoord);
  const taux = REF.tauxHoraireBenevole;
  const valeurBenevole = Math.round(hForm*taux*1.2 + hTerr*taux + hCoord*taux*1.3 + hAutre*taux);
  const valeurSensib   = Math.round((Number(d.nbParticipants)||0)*REF.valeurSensibilisation);
  return { score, scores_detail:s, valeur_eco:{ valeurBenevole, valeurSensib, total:valeurBenevole+valeurSensib, taux }};
}

// ── Dimension Environnementale ──────────────────────────────────────
function calcEnvironnementale(d) {
  const s = [
    {id:'couverture',     score:likert(d.couvertureTerritoriale), poids:0.25},
    {id:'milieux',        score:likert(d.diversiteMilieux),       poids:0.25},
    {id:'detection',      score:likert(d.detectionRisques),       poids:0.25},
    {id:'services_eco',   score:likert(d.servicesEco),            poids:0.15},
    {id:'pde',            score:likert(d.contributionPDE),        poids:0.10},
  ];
  const score = borne(moyPonderee(s));
  // Facteur de preuve
  const fp = {mesure:1.0,documente:0.8,verifie:0.6,declare:0.4,inconnu:0.2}[d.preuveEcosystemique]??0.4;
  const valeurMH = Math.round((Number(d.nbMilieuxHumides)||0)*REF.valeurHaMilieuxHumides*fp);
  const valeurKm = Math.round((Number(d.nbKmCoursDeau)||0)*REF.valeurKmCoursDeau*fp);
  // Coûts évités probabilistes
  let coutEvite = 0;
  const risques = d.risquesActifs||[];
  const detailRisques = risques.map(r => {
    let base=0, prob=0;
    if (r.type==='contamination_eau_potable') { base=REF.coutContaminationBase*(Number(r.population||1000)/1000); prob=REF.probDetectionSPE_conta; }
    else if (r.type==='proliferation_algues') { base=REF.coutAlguesBase; prob=REF.probDetectionSPE_algues; }
    else if (r.type==='deversement_accidentel'){ base=REF.coutDeversement; prob=REF.probDetectionSPE_dever; }
    else if (r.type==='fermeture_plage')       { base=REF.coutFermeturePlage; prob=REF.probDetectionSPE_plage; }
    const contrib = Math.max(0,Math.min(1,Number(r.contribution||0.5)));
    const valeur  = Math.round(base*prob*contrib);
    coutEvite += valeur;
    return { ...r, base:Math.round(base), prob, contrib, valeur };
  });
  return { score, scores_detail:s, valeur_eco:{ valeurMH, valeurKm, coutEvite, detailRisques, total:valeurMH+valeurKm+coutEvite, facteurPreuve:fp }};
}

// ── Dimension Politique ─────────────────────────────────────────────
export const ECHELLE_INFLUENCE = {
  1:{fr:'Information',          en:'Information',          mult:0.10},
  2:{fr:'Consultation',         en:'Consultation',         mult:0.25},
  3:{fr:'Recommandation',       en:'Recommendation',       mult:0.50},
  4:{fr:'Décision influencée',  en:'Decision influenced',  mult:0.80},
  5:{fr:'Changement de politique',en:'Policy change',       mult:1.00},
};

function calcPolitique(d) {
  const s = [
    {id:'influence',    score:influenceScore(d.niveauInfluence),     poids:0.35},
    {id:'gouvernance',  score:likert(d.instancesGouvernance),        poids:0.25},
    {id:'partenariats', score:likert(d.partenariatsFormels),         poids:0.20},
    {id:'visibilite',   score:likert(d.visibilitePublique),          poids:0.10},
    {id:'reseau',       score:likert(d.mobilisationReseau),          poids:0.10},
  ];
  const score = borne(moyPonderee(s));
  const mult  = ECHELLE_INFLUENCE[Number(d.niveauInfluence)]?.mult??0.10;
  const nbDec = Math.max(0,Number(d.nbDecisionsInfluencees)||0);
  const valeurInfluence = Math.round(nbDec*REF.valeurConsultation*mult*5);
  // CEQ = facteur de diffusion, PAS bonus de score
  const ceqFacteur = d.membreCEQ ? { actif:true, note_fr:'Membre CEQ — potentiel de diffusion provinciale renforcé', note_en:'CEQ member — enhanced provincial dissemination' } : { actif:false };
  return { score, scores_detail:s, niveauInfluence:{ valeur:Number(d.niveauInfluence)||1, ...ECHELLE_INFLUENCE[Number(d.niveauInfluence)||1] }, valeur_eco:{ valeurInfluence, total:valeurInfluence }, ceqFacteur };
}

// ── Confiance ───────────────────────────────────────────────────────
function calcConfiance(dim, champs_renseignes) {
  if (champs_renseignes===undefined) return { score:50, niveau:'moyen' };
  const s = borne(champs_renseignes*100);
  return { score:s, niveau: s>=75?'élevé':s>=45?'moyen':'faible' };
}

function pctRenseignes(obj, requis) {
  const vals = requis.filter(k => { const v=obj[k]; return v!==null&&v!==undefined&&v!==''&&v!==0; });
  return vals.length/requis.length;
}

// ── Recommandations ─────────────────────────────────────────────────
function genRecs(scores, resultats, lang) {
  const recs = []; const t=lang==='fr';
  const dim = (key) => resultats[key]?.scores_detail||[];
  const s = (res,id) => res.find(d=>d.id===id)?.score??0;

  if(scores.scientifique<65) {
    if(s(dim('scientifique'),'protocole')<50) recs.push({ dimension:'scientifique', priorite:'haute', titre:t?'Formaliser le protocole':'Formalize protocol', texte:t?'Rédigez un protocole standardisé documentant les procédures, équipements et critères de validation. Un protocole formalisé augmente la crédibilité des données.':'Write a standardized protocol documenting procedures, equipment and validation criteria.' });
    if(s(dim('scientifique'),'qualite')<50) recs.push({ dimension:'scientifique', priorite:'haute', titre:t?'Mettre en place un contrôle qualité':'Implement quality control', texte:t?'Adoptez un processus de validation : double-saisie, vérification par expert, ou comparaison avec données gouvernementales de référence.':'Adopt a validation process: double entry, expert verification, or comparison with reference data.' });
    if(s(dim('scientifique'),'couverture_spatiale')<40) recs.push({ dimension:'scientifique', priorite:'moyenne', titre:t?'Élargir la couverture spatiale':'Expand spatial coverage', texte:t?'Identifiez des zones peu surveillées et établissez des partenariats locaux pour déployer de nouveaux sites.':'Identify under-monitored areas and establish local partnerships for new sites.' });
  }
  if(scores.sociale<65) {
    if(s(dim('sociale'),'participation')<40) recs.push({ dimension:'sociale', priorite:'haute', titre:t?'Développer la rétention bénévole':'Develop volunteer retention', texte:t?'Mettez en place des mécanismes de reconnaissance (certificats, événements) et de formation continue.':'Implement recognition mechanisms (certificates, events) and ongoing training.' });
    if(s(dim('sociale'),'inclusion')<40) recs.push({ dimension:'sociale', priorite:'moyenne', titre:t?'Favoriser la diversité':'Foster diversity', texte:t?'Développez des partenariats avec écoles, groupes communautaires et organisations de jeunesse.':'Develop partnerships with schools, community groups and youth organizations.' });
  }
  if(scores.environnementale<65) {
    if(s(dim('environnementale'),'detection')<40) recs.push({ dimension:'environnementale', priorite:'haute', titre:t?'Développer un protocole de signalement':'Develop a reporting protocol', texte:t?'Mettez en place une procédure claire pour signaler rapidement les anomalies aux autorités (MELCCFP, municipalités).':'Establish a clear procedure to quickly report anomalies to authorities.' });
    if(s(dim('environnementale'),'pde')<30) recs.push({ dimension:'environnementale', priorite:'moyenne', titre:t?'Connecter les données au PDE':'Link data to watershed plan', texte:t?'Prenez contact avec l\'OBV de votre territoire pour aligner votre surveillance avec les priorités du Plan directeur de l\'eau.':'Contact your watershed organization to align monitoring with the watershed master plan.' });
  }
  if(scores.politique<65) {
    if(s(dim('politique'),'influence')<40) recs.push({ dimension:'politique', priorite:'haute', titre:t?'Documenter les utilisations institutionnelles':'Document institutional use', texte:t?'Identifiez 2 instances décisionnelles et proposez une présentation formelle de vos données. Gardez une trace écrite de chaque utilisation.':'Identify 2 decision-making bodies and propose a formal data presentation. Keep written records of each use.' });
    if(s(dim('politique'),'gouvernance')<40) recs.push({ dimension:'politique', priorite:'moyenne', titre:t?'Participer aux instances de gouvernance':'Participate in governance bodies', texte:t?'Demandez à être représentés dans les comités de l\'eau locaux, tables de concertation ou CRE.':'Request representation on local water committees or regional environment councils.' });
  }
  return recs.sort((a,b)=>({haute:0,moyenne:1,basse:2}[a.priorite]??9)-({haute:0,moyenne:1,basse:2}[b.priorite]??9));
}

// ── Interprétation ──────────────────────────────────────────────────
function interpreter(score) {
  if(score>=80) return { niveau:'excellent', couleur:'#2E8B57', icon:'Award',    fr:'Projet exemplaire — valeur multidimensionnelle remarquable', en:'Exemplary project — remarkable multidimensional value' };
  if(score>=65) return { niveau:'bon',       couleur:'#1A5F7A', icon:'TrendingUp',fr:'Projet solide — bonnes pratiques bien établies',            en:'Solid project — well-established good practices' };
  if(score>=45) return { niveau:'moyen',     couleur:'#D97706', icon:'BarChart2', fr:'Projet en développement — plusieurs axes à renforcer',      en:'Developing project — several areas to strengthen' };
  return              { niveau:'faible',     couleur:'#DC2626', icon:'AlertTriangle',fr:'Projet débutant — structuration recommandée',           en:'Early-stage project — structuring recommended' };
}

// ── POINT D'ENTRÉE UNIQUE ───────────────────────────────────────────
export function calculerAssessment(formData) {
  const { info={}, scientifique:sciD={}, sociale:socD={}, environnementale:envD={}, politique:polD={}, investissement:invD={} } = formData;
  const lang = info.langue||'fr';

  // Calculs dimensionnels
  const sci = calcScientifique(sciD);
  const soc = calcSociale(socD);
  const env = calcEnvironnementale(envD);
  const pol = calcPolitique(polD);

  const resultats = { scientifique:sci, sociale:soc, environnementale:env, politique:pol };

  // Score global MCDA pondéré
  const scores = { scientifique:sci.score, sociale:soc.score, environnementale:env.score, politique:pol.score };
  const scoreGlobal = borne(
    scores.scientifique*POIDS.scientifique + scores.sociale*POIDS.sociale +
    scores.environnementale*POIDS.environnementale + scores.politique*POIDS.politique
  );

  // Valeur économique (SÉPARÉE du score)
  const composantes = {
    travail_benevole:    soc.valeur_eco.valeurBenevole||0,
    sensibilisation:     soc.valeur_eco.valeurSensib||0,
    donnees_scientifiques: sci.valeur_eco.valeurDonnees||0,
    formation:           sci.valeur_eco.valeurFormation||0,
    ecosystemique:       (env.valeur_eco.valeurMH||0)+(env.valeur_eco.valeurKm||0),
    couts_evites:        env.valeur_eco.coutEvite||0,
    influence_politique: pol.valeur_eco.valeurInfluence||0,
  };
  const valeurTotale = Object.values(composantes).reduce((a,b)=>a+b,0);
  const invTotal = Math.max(0, Number(invD.total)||0);
  const sroi = invTotal>0 ? Math.round((valeurTotale/invTotal)*100)/100 : null;

  // Niveaux de confiance
  const confianceSci = calcConfiance('sci', pctRenseignes(sciD, ['protocoleRigueur','nbSites','anneesSurveillance','controleQualite','diversiteParametres']));
  const confianceSoc = calcConfiance('soc', pctRenseignes(socD, ['nbParticipants','nbBenevoles','heuresTotal','apprentissage','inclusion']));
  const confianceEnv = calcConfiance('env', pctRenseignes(envD, ['couvertureTerritoriale','diversiteMilieux','detectionRisques','servicesEco']));
  const confiancePol = calcConfiance('pol', pctRenseignes(polD, ['niveauInfluence','instancesGouvernance','partenariatsFormels']));
  const confScores = [confianceSci.score,confianceSoc.score,confianceEnv.score,confiancePol.score];
  const confianceGlobal = { score:Math.round(confScores.reduce((a,b)=>a+b,0)/confScores.length), niveau:'' };
  confianceGlobal.niveau = confianceGlobal.score>=75?'élevé':confianceGlobal.score>=45?'moyen':'faible';

  // Radar data
  const labsFr = { scientifique:'Scientifique', sociale:'Sociale', environnementale:'Environnementale', politique:'Politique' };
  const labsEn = { scientifique:'Scientific', sociale:'Social', environnementale:'Environmental', politique:'Political' };
  const chartRadar = Object.entries(scores).map(([k,v])=>({ dimension:labsFr[k], score:v }));
  const chartRadarEN = Object.entries(scores).map(([k,v])=>({ dimension:labsEn[k], score:v }));

  return {
    version: METHODOLOGIE_VERSION,
    dateCalcul: new Date().toISOString(),
    lang, info,
    scores, scoreGlobal,
    interpretation: interpreter(scoreGlobal),
    resultats,
    composantes, valeurTotale,
    sroi, investissement: invTotal,
    confianceGlobal, confiances:{ scientifique:confianceSci, sociale:confianceSoc, environnementale:confianceEnv, politique:confiancePol },
    recommandations: genRecs(scores, resultats, lang),
    chartRadar, chartRadarEN,
    // Format compatible V4 pour ReseauProvincial
    meta: { nomProjet:info.nomProjet||'', organisation:info.organisation||'', annee:info.anneeEvaluation||new Date().getFullYear() },
    scoresParDimension: { Scientifique:sci.score, Sociale:soc.score, Environnementale:env.score, Politique:pol.score },
    valeurEconomique: valeurTotale,
    AVERTISSEMENT: 'Estimation à des fins de plaidoyer — ne constitue pas une valeur comptable vérifiée.',
  };
}

// Formateur monnaie
export function formatMontant(n, lang='fr') {
  return new Intl.NumberFormat(lang==='fr'?'fr-CA':'en-CA',{style:'currency',currency:'CAD',maximumFractionDigits:0}).format(n||0);
}
