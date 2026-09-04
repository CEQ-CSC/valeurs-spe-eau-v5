/**
 * Calcul — Dimension Environnementale — SPE-Eau V5
 *
 * Amélioration majeure vs V4 :
 *   • Modèle probabiliste : coût_ref × probabilité × contribution × confiance
 *   • Plus de forfait unique 1 200 $/risque ou 1,5 M$ crise
 *   • Le coût évité dépend de la population, du type, de la contribution réelle
 *   • Valeur écosystémique conditionnelle à la qualité des données
 */

import { likertToScore, nombreToScore, moyennePonderee, borne } from './normalize';
import { INDICATEURS_ENVIRONNEMENTALE } from '@/lib/methodology/indicators';
import { ECOSYSTEME, COUTS_EVITES } from '@/data/referenceCosts';

export function calculerEnvironnementale(data) {
  const {
    couvertureTerritoriale,  // likert 1–5
    diversiteMilieux,        // likert 1–5
    detectionRisques,        // likert 1–5
    servicesEco,             // likert 1–5
    contributionPDE,         // likert 1–5
    // Quantitatif
    nbMilieuxHumides,        // ha
    nbKmCoursDEau,           // km linéaires surveillés
    // Risques déclarés (probabilistes)
    risquesActifs,           // [ { type, populationConcernee, contributionSPE } ]
    // Niveau de preuve
    preuveEcosystemique,     // 'mesure'|'documente'|'declare'|'inconnu'
  } = data;

  // ─── Score multidimensionnel ──────────────────────────────────────
  const scores = [
    { id: 'couverture_territoire', score: likertToScore(couvertureTerritoriale), poids: 0.25 },
    { id: 'surveillance_milieux',  score: likertToScore(diversiteMilieux),       poids: 0.25 },
    { id: 'detection_risques',     score: likertToScore(detectionRisques),       poids: 0.25 },
    { id: 'services_ecosystemiques', score: likertToScore(servicesEco),          poids: 0.15 },
    { id: 'contribution_pde',      score: likertToScore(contributionPDE),        poids: 0.10 },
  ];

  const scoreFinal = borne(moyennePonderee(scores));

  // ─── Valeur écosystémique (TEEB) ─────────────────────────────────
  // Facteur de confiance selon le niveau de preuve
  const facteurPreuve = { mesure: 1.0, documente: 0.8, verifie: 0.6, declare: 0.4, inconnu: 0.2 };
  const fPreuve = facteurPreuve[preuveEcosystemique] ?? 0.4;

  const nbHa  = Math.max(0, Number(nbMilieuxHumides) || 0);
  const nbKm  = Math.max(0, Number(nbKmCoursDEau)    || 0);

  const valeurMilieuxHumides = Math.round(nbHa * ECOSYSTEME.milieu_humide_ha.valeur * fPreuve);
  const valeurCoursDEau      = Math.round(nbKm * ECOSYSTEME.cours_eau_km.valeur * fPreuve);

  // ─── Coûts évités probabilistes ──────────────────────────────────
  const coûtsEvitesDetail = calcCoûtsEvitesProbabilistes(risquesActifs || []);
  const coûtsEvitesTotal  = coûtsEvitesDetail.reduce((s, r) => s + r.valeurEvitee, 0);

  return {
    score: scoreFinal,
    scores_detail: scores.map(s => ({ ...s, score: s.score ?? 0 })),
    valeur_eco: {
      valeurMilieuxHumides,
      valeurCoursDEau,
      valeurEcosystemique: valeurMilieuxHumides + valeurCoursDEau,
      coûtsEvitesDetail,
      coûtsEvitesTotal,
      total: valeurMilieuxHumides + valeurCoursDEau + coûtsEvitesTotal,
      facteurPreuve: fPreuve,
      avertissement: fPreuve < 0.6
        ? 'Valeur écosystémique ajustée à la baisse — niveau de preuve faible ou inconnu'
        : null,
    },
  };
}

/**
 * Modèle probabiliste pour les coûts évités
 *
 * coût_évité = coût_ref(population) × prob_détection_SPE × contribution_SPE × facteur_conf
 */
function calcCoûtsEvitesProbabilistes(risques) {
  return risques.map(r => {
    const ref = COUTS_EVITES[r.type];
    if (!ref) return { type: r.type, valeurEvitee: 0, note: 'Type inconnu' };

    const populationFactor = r.type === 'contamination_eau_potable'
      ? (Number(r.populationConcernee) || 1000) / 1000  // proportionnel / 1000 hab.
      : 1;

    const coutBase = ref.cout_evenement_base.par_1000_habitants
      ? ref.cout_evenement_base.par_1000_habitants * populationFactor
      : ref.cout_evenement_base.forfait;

    const probDetection = ref.probabilite_detection_spe;
    const contribution  = Math.max(0, Math.min(1, Number(r.contributionSPE) || 0.5));
    // Contribution déclarée : SPE estime sa part de l'information ayant permis l'action

    const valeurEvitee = Math.round(coutBase * probDetection * contribution);

    return {
      type: r.type,
      coutBase: Math.round(coutBase),
      probDetection,
      contribution,
      valeurEvitee,
      note: ref.note_detection,
      source: ref.cout_evenement_base.source,
    };
  });
}
