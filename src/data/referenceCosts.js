/**
 * ═══════════════════════════════════════════════════════════════════
 *  COÛTS DE RÉFÉRENCE — Science participative de l'eau
 *  Collectif Eau Québec — SPE-Eau V5
 *
 *  Chaque valeur est documentée avec :
 *    source    : référence bibliographique ou institutionnelle
 *    annee     : année de la donnée
 *    methode   : méthode d'estimation
 *    intervalle: [min, max] plausible
 *    confiance : 'élevée' | 'moyenne' | 'faible'
 *    note      : contexte ou mise en garde
 * ═══════════════════════════════════════════════════════════════════
 */

export const METHODOLOGIE_VERSION = '5.0';
export const METHODOLOGIE_DATE    = '2025-01';
export const MONNAIE              = 'CAD';
export const ANNEE_REFERENCE      = 2024;

// ─── Travail bénévole ─────────────────────────────────────────────────
export const BENEVOLE = {
  tauxHoraire: {
    valeur:    22.60,
    source:    'Statistique Canada, Enquête sociale générale – bénévolat 2022',
    annee:     2022,
    methode:   'Remplacement — taux horaire moyen au Québec',
    intervalle:[18.00, 30.00],
    confiance: 'élevée',
    note:      'Taux basé sur le salaire horaire moyen provinciale pondéré par secteur',
  },
  // Types de temps bénévole distincts
  types: {
    formation:    { label_fr: 'Formation',      label_en: 'Training',       poids: 1.20 },
    terrain:      { label_fr: 'Terrain',        label_en: 'Fieldwork',      poids: 1.00 },
    saisie:       { label_fr: 'Saisie',         label_en: 'Data entry',     poids: 0.85 },
    coordination: { label_fr: 'Coordination',   label_en: 'Coordination',   poids: 1.30 },
    deplacement:  { label_fr: 'Déplacement',    label_en: 'Travel',         poids: 0.70 },
    mobilisation: { label_fr: 'Mobilisation',   label_en: 'Mobilization',   poids: 1.10 },
    validation:   { label_fr: 'Validation',     label_en: 'Validation',     poids: 1.15 },
    analyse:      { label_fr: 'Analyse',        label_en: 'Analysis',       poids: 1.25 },
  },
};

// ─── Coût de remplacement d'une observation ───────────────────────────
export const OBSERVATION = {
  simple: {
    valeur:    35,
    source:    'Comparison with provincial government monitoring contracts, MELCCFP 2022',
    annee:     2022,
    methode:   'Coût de remplacement par contrat gouvernemental',
    intervalle:[25, 50],
    confiance: 'moyenne',
    note:      'Observation physico-chimique de base (pH, température, turbidité)',
  },
  intermediaire: {
    valeur:    75,
    source:    'MELCCFP, protocoles réseaux surveillance qualitative eau 2023',
    annee:     2023,
    methode:   'Coût de remplacement par contrat gouvernemental',
    intervalle:[55, 110],
    confiance: 'moyenne',
    note:      'Observation multiparamétrique avec analyse partielle',
  },
  avancee: {
    valeur:    185,
    source:    'Protocoles surveillance aquatique Environnement Canada 2023',
    annee:     2023,
    methode:   'Coût de remplacement laboratoire accrédité + terrain',
    intervalle:[130, 280],
    confiance: 'faible',
    note:      'Analyse complète incluant macroinvertébrés ou substances traces',
  },
};

// ─── Services écosystémiques (TEEB Canada) ────────────────────────────
export const ECOSYSTEME = {
  milieu_humide_ha: {
    valeur:    9200,
    source:    'TEEB for Business – Canada Wetland Valuation 2021',
    annee:     2021,
    methode:   'Bénéfices annuels épuration, stockage carbone, régulation crues',
    intervalle:[4500, 18000],
    confiance: 'faible',
    note:      'Haute variabilité selon le type et la localisation du milieu humide',
  },
  cours_eau_km: {
    valeur:    1800,
    source:    'Estimations services régulation hydrologique, Univ. Sherbrooke 2020',
    annee:     2020,
    methode:   'Valeur de régulation et récréotourisme par km linéaire surveillé',
    intervalle:[800, 4500],
    confiance: 'faible',
    note:      'Varie considérablement selon la localisation et usage du territoire',
  },
};

// ─── Coûts évités — modèle probabiliste ──────────────────────────────
// IMPORTANT : ces valeurs sont des COÛTS DE RÉFÉRENCE, pas des économies garanties.
// Le coût évité réel = coût_reference × probabilité_détection × contribution_projet
export const COUTS_EVITES = {
  contamination_eau_potable: {
    cout_evenement_base: {
      par_1000_habitants: 85000,
      source: 'Analyse coûts crises eau potable, INSPQ 2019 + MSP QC 2021',
      annee:  2021,
      methode:"Coût médian d'une interruption de service eau potable — 7 jours",
      intervalle:[30000, 500000],
      confiance: 'moyenne',
      note:   'Dépend fortement de la durée, population, alternatives disponibles',
    },
    probabilite_detection_spe: 0.35,
    note_detection: 'Estimation : SPE détecte environ 35 % des événements en amont vs surveillance passive',
  },
  proliferation_algues: {
    cout_evenement_base: {
      forfait: 45000,
      source: 'MDDELCC, coûts économiques proliférations algues 2020',
      annee:  2020,
      methode:'Coûts récréotourisme + gestion avis + communication',
      intervalle:[8000, 250000],
      confiance: 'faible',
      note:   'Très variable selon taille plan d\'eau et dépendance touristique',
    },
    probabilite_detection_spe: 0.55,
    note_detection: 'SPE est particulièrement efficace pour détection précoce algues',
  },
  deversement_accidentel: {
    cout_evenement_base: {
      forfait: 120000,
      source: 'MDDELCC rapports incidents environnementaux 2022',
      annee:  2022,
      methode:'Coûts nettoyage + pénalités + communication médiatique médians',
      intervalle:[15000, 2000000],
      confiance: 'faible',
      note:   'Très haute variabilité — valeur médiane pour incidents mineurs',
    },
    probabilite_detection_spe: 0.25,
    note_detection: 'Efficacité variable; meilleure pour petits cours d\'eau surveillés régulièrement',
  },
  fermeture_plage: {
    cout_evenement_base: {
      forfait: 28000,
      source: 'Études récréotourisme plages Québec, MESI 2021',
      annee:  2021,
      methode:'Perte récréotourisme + coûts gestion avis interdiction',
      intervalle:[5000, 120000],
      confiance: 'moyenne',
      note:   'Par événement de fermeture de plage (2 semaines en saison)',
    },
    probabilite_detection_spe: 0.50,
    note_detection: 'SPE efficace si surveillance bactériologique régulière',
  },
};

// ─── Valeur formation et sensibilisation ─────────────────────────────
export const FORMATION = {
  par_benevole_forme: {
    valeur:    420,
    source:    'Estimation coût formation scientifique équivalent — Commission formation Québec 2023',
    annee:     2023,
    methode:   'Valeur cours formation scientifique de base (16h)',
    intervalle:[200, 800],
    confiance: 'faible',
    note:      'Coût substitution formation professionnelle équivalente',
  },
  par_participant_sensibilise: {
    valeur:    38,
    source:    'Étude valeur programmes sensibilisation environnementale, INSPQ 2020',
    annee:     2020,
    methode:   'Valeur sociale estimée par personne sensibilisée',
    intervalle:[20, 75],
    confiance: 'faible',
    note:      'Basé sur la disposition à payer pour programmes d\'éducation environnementale',
  },
};

// ─── Influence politique ──────────────────────────────────────────────
export const POLITIQUE = {
  consultation_formelle: {
    valeur:    3500,
    source:    'Coût moyen consultation publique gouvernementale — Secrétariat conseil exécutif QC 2022',
    annee:     2022,
    methode:   'Coût de remplacement d\'une consultation formelle',
    intervalle:[1500, 12000],
    confiance: 'faible',
    note:      'Valeur d\'une participation citoyenne équivalente à une consultation formelle',
  },
};

// ─── Niveaux de preuves disponibles ──────────────────────────────────
// Utilisés pour calibrer le niveau de confiance des déclarations
export const NIVEAUX_PREUVE = {
  mesure:      { score: 1.00, label_fr: 'Donnée mesurée',           label_en: 'Measured data' },
  documente:   { score: 0.80, label_fr: 'Document disponible',      label_en: 'Documented' },
  verifie:     { score: 0.65, label_fr: 'Estimé / vérifié',         label_en: 'Estimated / verified' },
  declare:     { score: 0.45, label_fr: 'Déclaratif',               label_en: 'Self-reported' },
  inconnu:     { score: 0.20, label_fr: 'Non renseigné / inconnu',  label_en: 'Not specified' },
};
// src/data/referenceCosts.js

export const EPISTEMOLOGIE = {
  version: '5.0',
  cadreTheorique: 'MCDA + SROI + éléments PathOS (DOI: 10.5281/zenodo.14651106)',
  distinction: {
    ceQueNousMesurons: 'uptake — mobilisation des ressources de SPE-Eau par les acteurs',
    ceQueNousMesuronsNePAS: 'effet causal démontré de la SPE-Eau sur les enjeux environnementaux',
    reference: 'PathOS Indicator Handbook, section Societal Impact, Venturini 2024',
  },
  niveauxDePreuve: {
    mesure:       { label: 'Mesurée',        score: 1.0, couleur: '#2E8B57' },
    documentee:   { label: 'Documentée',     score: 0.8, couleur: '#1B4F8A' },
    estimee:      { label: 'Estimée',        score: 0.5, couleur: '#F5A623' },
    declarative:  { label: 'Déclarative',    score: 0.3, couleur: '#8A9BB0' },
    inconnue:     { label: 'Non renseignée', score: 0.0, couleur: '#D6E4F7' },
  },
}