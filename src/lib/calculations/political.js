/**
 * Calcul — Dimension Politique — SPE-Eau V5
 *
 * Amélioration majeure vs V4 :
 *   • Échelle d'influence qualitative (pas de simple comptage)
 *   • Information → Consultation → Recommandation → Décision → Changement politique
 *   • CEQ = facteur de diffusion, PAS bonus intrinsèque
 *   • Valeur politique basée sur le niveau réel d'influence
 */

import { likertToScore, influenceToScore, moyennePonderee, borne } from './normalize';
import { INDICATEURS_POLITIQUE } from '@/lib/methodology/indicators';
import { POLITIQUE } from '@/data/referenceCosts';

// Libellés de l'échelle d'influence (pour UI et rapport)
export const ECHELLE_INFLUENCE = {
  1: { fr: 'Information',          en: 'Information',       valeurMultiplicateur: 0.10 },
  2: { fr: 'Consultation',         en: 'Consultation',      valeurMultiplicateur: 0.25 },
  3: { fr: 'Recommandation',       en: 'Recommendation',    valeurMultiplicateur: 0.50 },
  4: { fr: 'Décision influencée',  en: 'Decision influenced',valeurMultiplicateur: 0.80 },
  5: { fr: 'Changement de politique', en: 'Policy change',  valeurMultiplicateur: 1.00 },
};

export function calculerPolitique(data) {
  const {
    niveauInfluence,        // 1–5 (échelle influence)
    instancesGouvernance,   // likert 1–5
    partenariatsFormels,    // likert 1–5
    visibilitePublique,     // likert 1–5
    mobilisationReseau,     // likert 1–5
    // Quantitatif
    nbDecisionsInfluencees, // nombre
    nbPartenariatsFormels,  // nombre
    membreCEQ,              // boolean
    nbAnneesMembre,         // nombre
  } = data;

  // ─── Score multidimensionnel ──────────────────────────────────────
  const scores = [
    { id: 'niveau_influence',     score: influenceToScore(niveauInfluence),       poids: 0.35 },
    { id: 'instances_gouvernance',score: likertToScore(instancesGouvernance),     poids: 0.25 },
    { id: 'partenariats_formels', score: likertToScore(partenariatsFormels),      poids: 0.20 },
    { id: 'visibilite_publique',  score: likertToScore(visibilitePublique),       poids: 0.10 },
    { id: 'mobilisation_reseau',  score: likertToScore(mobilisationReseau),       poids: 0.10 },
  ];

  const scoreFinal = borne(moyennePonderee(scores));

  // ─── Valeur politique ─────────────────────────────────────────────
  const niveauInf = Number(niveauInfluence) || 1;
  const multiplicateur = ECHELLE_INFLUENCE[niveauInf]?.valeurMultiplicateur ?? 0.10;

  const nbDec = Math.max(0, Number(nbDecisionsInfluencees) || 0);
  const valeurInfluence = Math.round(
    nbDec * POLITIQUE.consultation_formelle.valeur * multiplicateur * 5
  );

  // CEQ comme facteur de diffusion (pas d'ajout direct au score)
  const facteurDiffusionCEQ = membreCEQ ? {
    actif: true,
    annees: Number(nbAnneesMembre) || 0,
    note_fr: 'Membre du Collectif Eau Québec — potentiel de diffusion provinciale renforcé',
    note_en: 'Member of Collectif Eau Québec — enhanced provincial dissemination potential',
  } : { actif: false };

  return {
    score: scoreFinal,
    scores_detail: scores.map(s => ({ ...s, score: s.score ?? 0 })),
    niveauInfluence: {
      valeur: niveauInf,
      label_fr: ECHELLE_INFLUENCE[niveauInf]?.fr ?? '—',
      label_en: ECHELLE_INFLUENCE[niveauInf]?.en ?? '—',
    },
    valeur_eco: {
      valeurInfluence,
      total: valeurInfluence,
    },
    facteurDiffusionCEQ,
  };
}
