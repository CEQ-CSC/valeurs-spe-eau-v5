/**
 * Calcul — Dimension Scientifique — SPE-Eau V5
 *
 * Amélioration vs V4 :
 *   • Volume × couverture × diversité × qualité × utilisation
 *   • Pas de saturation arbitraire à 5000 observations
 *   • Aucune valeur par défaut favorable
 */

import { likertToScore, nombreToScore, dureeToScore, moyennePonderee, borne } from './normalize';
import { INDICATEURS_SCIENTIFIQUE } from '@/lib/methodology/indicators';
import { OBSERVATION } from '@/data/referenceCosts';

export function calculerScientifique(data) {
  const {
    protocoleRigueur,       // likert 1–5
    nbSites,                // nombre
    couvertureSpatiale,     // likert 1–5 (zones peu surveillées, etc.)
    anneesSurveillance,     // nombre d'années
    diversiteParametres,    // likert 1–5
    controleQualite,        // likert 1–5
    integrationBases,       // likert 1–5
    // données quantitatives
    nombreEchantillons,     // nombre
    complexiteEchantillons, // 'simple' | 'intermediaire' | 'avancee'
    nbPublications,         // nombre
    nbBenevoles,
  } = data;

  // ─── Scores indicateurs ───────────────────────────────────────────
  const scores = [
    {
      id: 'protocole',
      score: likertToScore(protocoleRigueur),
      poids: INDICATEURS_SCIENTIFIQUE.find(i => i.id === 'protocole').poids,
    },
    {
      id: 'couverture_spatiale',
      score: combineCouvertureSpatiale(nbSites, couvertureSpatiale),
      poids: INDICATEURS_SCIENTIFIQUE.find(i => i.id === 'couverture_spatiale').poids,
    },
    {
      id: 'couverture_temporelle',
      score: dureeToScore(anneesSurveillance),
      poids: INDICATEURS_SCIENTIFIQUE.find(i => i.id === 'couverture_temporelle').poids,
    },
    {
      id: 'diversite_parametres',
      score: likertToScore(diversiteParametres),
      poids: INDICATEURS_SCIENTIFIQUE.find(i => i.id === 'diversite_parametres').poids,
    },
    {
      id: 'qualite_controle',
      score: likertToScore(controleQualite),
      poids: INDICATEURS_SCIENTIFIQUE.find(i => i.id === 'qualite_controle').poids,
    },
    {
      id: 'integration_utilisation',
      score: combineIntegration(integrationBases, nbPublications),
      poids: INDICATEURS_SCIENTIFIQUE.find(i => i.id === 'integration_utilisation').poids,
    },
  ];

  const scoreFinal = borne(moyennePonderee(scores));

  // ─── Valeur économique (remplacement données) ─────────────────────
  const nb = Number(nombreEchantillons) || 0;
  const tarifRef = OBSERVATION[complexiteEchantillons || 'simple']?.valeur ?? OBSERVATION.simple.valeur;
  const valeurDonnees = Math.round(nb * tarifRef);

  // ─── Valeur formation bénévoles ───────────────────────────────────
  const nbBen = Number(nbBenevoles) || 0;
  const niveauFormation = likertToScore(protocoleRigueur) || 0;
  const valeurFormation = Math.round(nbBen * 420 * (niveauFormation / 100));

  return {
    score:        scoreFinal,
    scores_detail: scores.map(s => ({ ...s, score: s.score ?? 0 })),
    valeur_eco: {
      valeurDonnees,
      valeurFormation,
      total: valeurDonnees + valeurFormation,
      complexiteEchantillons: complexiteEchantillons || 'simple',
      tarifRef,
    },
  };
}

function combineCouvertureSpatiale(nbSites, couvertureSpatiale) {
  const sNb = nombreToScore(nbSites, 50);  // saturation à 50 sites
  const sQual = likertToScore(couvertureSpatiale);
  return moyennePonderee([
    { score: sNb,   poids: 0.5 },
    { score: sQual, poids: 0.5 },
  ]);
}

function combineIntegration(integrationBases, nbPublications) {
  const sInt = likertToScore(integrationBases);
  const sPub = nombreToScore(nbPublications, 10); // saturation 10 publications
  return moyennePonderee([
    { score: sInt, poids: 0.6 },
    { score: sPub, poids: 0.4 },
  ]);
}
