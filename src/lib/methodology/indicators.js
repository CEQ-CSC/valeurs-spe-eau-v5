/**
 * Indicateurs de score par dimension — SPE-Eau V5
 *
 * Structure d'un indicateur :
 *   id        : identifiant unique
 *   poids     : poids dans la dimension (somme = 1.0 par dimension)
 *   echelle   : 'likert5' | 'pct' | 'nombre' | 'bool' | 'niveau'
 *   champs    : clés de formData qui l'alimentent
 *   calc      : fonction de calcul (reçoit les champs, retourne 0–100)
 */

// ─── Dimension Scientifique ───────────────────────────────────────────
export const INDICATEURS_SCIENTIFIQUE = [
  {
    id: 'protocole',
    poids: 0.25,
    label_fr: 'Rigueur du protocole',
    label_en: 'Protocol rigor',
    echelle: 'likert5',
    champ: 'protocoleRigueur',
  },
  {
    id: 'couverture_spatiale',
    poids: 0.20,
    label_fr: 'Couverture spatiale (sites)',
    label_en: 'Spatial coverage (sites)',
    echelle: 'couverture_sites',
    champs: ['nbSites', 'couvertureSpatiale'],
  },
  {
    id: 'couverture_temporelle',
    poids: 0.15,
    label_fr: 'Couverture temporelle (années)',
    label_en: 'Temporal coverage (years)',
    echelle: 'duree',
    champ: 'anneesSurveillance',
  },
  {
    id: 'diversite_parametres',
    poids: 0.15,
    label_fr: 'Diversité des paramètres mesurés',
    label_en: 'Parameter diversity',
    echelle: 'likert5',
    champ: 'diversiteParametres',
  },
  {
    id: 'qualite_controle',
    poids: 0.15,
    label_fr: 'Contrôle qualité et validation',
    label_en: 'Quality control and validation',
    echelle: 'likert5',
    champ: 'controleQualite',
  },
  {
    id: 'integration_utilisation',
    poids: 0.10,
    label_fr: 'Intégration bases publiques et utilisation',
    label_en: 'Integration and data use',
    echelle: 'likert5',
    champ: 'integrationBases',
  },
];

// ─── Dimension Sociale ────────────────────────────────────────────────
export const INDICATEURS_SOCIALE = [
  {
    id: 'participation',
    poids: 0.30,
    label_fr: 'Volume et fidélisation des participants',
    label_en: 'Participation volume and retention',
    echelle: 'participation',
    champs: ['nbParticipants', 'heuresTotal', 'retentionPct'],
  },
  {
    id: 'apprentissage',
    poids: 0.25,
    label_fr: 'Apprentissage et développement des compétences',
    label_en: 'Learning and skill development',
    echelle: 'likert5',
    champ: 'apprentissage',
  },
  {
    id: 'inclusion',
    poids: 0.20,
    label_fr: 'Inclusion et diversité des participants',
    label_en: 'Inclusion and participant diversity',
    echelle: 'likert5',
    champ: 'inclusion',
  },
  {
    id: 'rayonnement',
    poids: 0.15,
    label_fr: 'Rayonnement communautaire',
    label_en: 'Community outreach',
    echelle: 'likert5',
    champ: 'rayonnement',
  },
  {
    id: 'transfert',
    poids: 0.10,
    label_fr: 'Transfert des connaissances',
    label_en: 'Knowledge transfer',
    echelle: 'likert5',
    champ: 'transfert',
  },
];

// ─── Dimension Environnementale ───────────────────────────────────────
export const INDICATEURS_ENVIRONNEMENTALE = [
  {
    id: 'couverture_territoire',
    poids: 0.25,
    label_fr: 'Couverture et représentativité du territoire',
    label_en: 'Territorial coverage and representativeness',
    echelle: 'likert5',
    champ: 'couvertureTerritoriale',
  },
  {
    id: 'surveillance_milieux',
    poids: 0.25,
    label_fr: 'Diversité des milieux surveillés',
    label_en: 'Diversity of monitored environments',
    echelle: 'likert5',
    champ: 'diversiteMilieux',
  },
  {
    id: 'detection_risques',
    poids: 0.25,
    label_fr: 'Capacité de détection précoce de risques',
    label_en: 'Early risk detection capacity',
    echelle: 'likert5',
    champ: 'detectionRisques',
  },
  {
    id: 'services_ecosystemiques',
    poids: 0.15,
    label_fr: 'Documentation des services écosystémiques',
    label_en: 'Ecosystem services documentation',
    echelle: 'likert5',
    champ: 'servicesEco',
  },
  {
    id: 'contribution_pde',
    poids: 0.10,
    label_fr: 'Contribution aux plans directeurs de l\'eau',
    label_en: 'Contribution to watershed master plans',
    echelle: 'likert5',
    champ: 'contributionPDE',
  },
];

// ─── Dimension Politique ──────────────────────────────────────────────
export const INDICATEURS_POLITIQUE = [
  {
    id: 'niveau_influence',
    poids: 0.35,
    label_fr: 'Niveau d\'influence sur les décisions',
    label_en: 'Decision influence level',
    echelle: 'echelle_influence',
    champ: 'niveauInfluence',
    // 1=info / 2=consultation / 3=recommandation / 4=décision / 5=changement politique
  },
  {
    id: 'instances_gouvernance',
    poids: 0.25,
    label_fr: 'Participation aux instances de gouvernance de l\'eau',
    label_en: 'Water governance participation',
    echelle: 'likert5',
    champ: 'instancesGouvernance',
  },
  {
    id: 'partenariats_formels',
    poids: 0.20,
    label_fr: 'Partenariats formels avec institutions',
    label_en: 'Formal institutional partnerships',
    echelle: 'likert5',
    champ: 'partenariatsFormels',
  },
  {
    id: 'visibilite_publique',
    poids: 0.10,
    label_fr: 'Visibilité publique et médiatique',
    label_en: 'Public and media visibility',
    echelle: 'likert5',
    champ: 'visibilitePublique',
  },
  {
    id: 'mobilisation_reseau',
    poids: 0.10,
    label_fr: 'Mobilisation et connexion au réseau SPE',
    label_en: 'SPE network connection and mobilization',
    echelle: 'likert5',
    champ: 'mobilisationReseau',
    note: 'CEQ = facteur de diffusion, non de valeur intrinsèque',
  },
];
