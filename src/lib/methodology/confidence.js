/**
 * Moteur de niveau de confiance — SPE-Eau V5
 *
 * Principe :
 *   Chaque champ du formulaire a un niveau de preuve associé.
 *   Le score de confiance global est la moyenne pondérée
 *   des preuves fournies par dimension.
 *
 * Niveaux :
 *   élevé  : ≥ 75 % des champs importants sont documentés/mesurés
 *   moyen  : 45–74 %
 *   faible : < 45 %
 */

import { NIVEAUX_PREUVE } from '@/data/referenceCosts';

/**
 * Calcule le score de confiance brut (0–1) d'une dimension
 * à partir de ses réponses et preuves déclarées.
 *
 * @param {Object} champs  — { nomChamp: { valeur, preuve } }
 * @param {Array}  prioritaires — noms des champs les plus importants (poids x2)
 */
export function scoreConfianceDimension(champs, prioritaires = []) {
  const entrees = Object.entries(champs);
  if (entrees.length === 0) return { score: 0, niveau: 'inconnu', pct_renseigne: 0 };

  let totalPoids = 0;
  let totalScore = 0;
  let nbRenseignes = 0;

  entrees.forEach(([nom, { valeur, preuve }]) => {
    const estRenseigne = valeur !== null && valeur !== undefined && valeur !== '' && valeur !== 'inconnu';
    const poids = prioritaires.includes(nom) ? 2 : 1;

    if (estRenseigne) {
      nbRenseignes++;
      const scorePreuve = NIVEAUX_PREUVE[preuve]?.score ?? NIVEAUX_PREUVE.declare.score;
      totalScore += scorePreuve * poids;
    }
    totalPoids += poids;
  });

  const pct_renseigne = Math.round((nbRenseignes / entrees.length) * 100);
  const scoreNormalise = totalPoids > 0 ? totalScore / totalPoids : 0;

  return {
    score:       Math.round(scoreNormalise * 100),
    niveau:      niveauDepuisScore(scoreNormalise),
    pct_renseigne,
  };
}

/**
 * Calcule le niveau de confiance global à partir des 4 dimensions
 */
export function scoreConfianceGlobal(confiances) {
  const vals = Object.values(confiances).map(c => c.score);
  if (vals.length === 0) return { score: 0, niveau: 'inconnu' };
  const score = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  return { score, niveau: niveauDepuisScore(score / 100) };
}

function niveauDepuisScore(s) {
  if (s >= 0.75) return 'élevé';
  if (s >= 0.45) return 'moyen';
  if (s > 0)     return 'faible';
  return 'inconnu';
}

/**
 * Libellés bilingues du niveau de confiance
 */
export function labelNiveau(niveau, lang = 'fr') {
  const map = {
    fr: { élevé: 'Élevée', moyen: 'Moyenne', faible: 'Faible', inconnu: 'Inconnue' },
    en: { élevé: 'High',   moyen: 'Moderate', faible: 'Low',   inconnu: 'Unknown'  },
  };
  return (map[lang] || map.fr)[niveau] ?? '—';
}

/**
 * Couleur CSS associée au niveau de confiance
 */
export function couleurNiveau(niveau) {
  return { élevé: 'conf-high', moyen: 'conf-medium', faible: 'conf-low', inconnu: 'conf-none' }[niveau] ?? 'conf-none';
}
