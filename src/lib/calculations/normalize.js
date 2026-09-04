/**
 * Normalisation et validation des entrées — SPE-Eau V5
 *
 * Principes :
 *   • Valeur inconnue ≠ valeur zéro
 *   • Aucune valeur par défaut favorable
 *   • Toutes les sorties sont bornées [0, 100]
 *   • Les valeurs impossibles produisent une erreur visible
 */

/** Convertit une valeur Likert 1–5 en score 0–100 */
export function likertToScore(val) {
  const v = Number(val);
  if (!val || isNaN(v)) return null;         // non renseigné
  const clamped = Math.max(1, Math.min(5, v));
  return Math.round(((clamped - 1) / 4) * 100);
}

/** Convertit un pourcentage (0–100) en score normalisé */
export function pctToScore(val) {
  const v = Number(val);
  if (val === null || val === undefined || val === '' || isNaN(v)) return null;
  return Math.max(0, Math.min(100, Math.round(v)));
}

/** Normalise un nombre en score selon un seuil de saturation logarithmique */
export function nombreToScore(val, saturation) {
  const v = Number(val);
  if (!val || isNaN(v) || v <= 0) return null;
  // Logarithmique : atteint ~100 à `saturation`, ~50 à saturation/10
  return Math.min(100, Math.round((Math.log10(v + 1) / Math.log10(saturation + 1)) * 100));
}

/** Normalise des années de surveillance */
export function dureeToScore(annees) {
  const v = Number(annees);
  if (!annees || isNaN(v) || v <= 0) return null;
  // Saturation à 15 ans
  if (v >= 15) return 100;
  if (v >= 10) return 88;
  if (v >= 7)  return 75;
  if (v >= 5)  return 62;
  if (v >= 3)  return 48;
  if (v >= 2)  return 35;
  return 20;
}

/** Normalise l'échelle d'influence politique (1–5 ordinal qualitatif) */
export function influenceToScore(val) {
  const niveaux = { 1: 10, 2: 30, 3: 55, 4: 78, 5: 100 };
  const v = Number(val);
  if (!val || isNaN(v)) return null;
  return niveaux[Math.max(1, Math.min(5, Math.round(v)))] ?? null;
}

/**
 * Calcule la moyenne pondérée de scores, en ignorant les nulls.
 * Retourne null si aucun score n'est disponible.
 */
export function moyennePonderee(items) {
  // items : [{ score, poids }]
  const valides = items.filter(i => i.score !== null && i.score !== undefined);
  if (valides.length === 0) return null;

  const totalPoids = valides.reduce((s, i) => s + i.poids, 0);
  const sommePonderee = valides.reduce((s, i) => s + i.score * i.poids, 0);
  return Math.round(sommePonderee / totalPoids);
}

/**
 * Borne finale sécurisée : garantit [0, 100] et jamais NaN
 */
export function borne(val) {
  if (val === null || val === undefined || isNaN(val)) return 0;
  return Math.max(0, Math.min(100, Math.round(val)));
}

/** Validation des entrées numériques brutes */
export function validerEntrees(data) {
  const erreurs = [];
  const champs_positifs = [
    'nbParticipants', 'nbBenevoles', 'heuresTotal', 'nbSites',
    'anneesSurveillance', 'nombreEchantillons', 'nbPublications',
    'nbMilieuxHumides', 'superficieBV',
  ];

  champs_positifs.forEach(champ => {
    const v = data[champ];
    if (v !== undefined && v !== null && v !== '') {
      if (Number(v) < 0) {
        erreurs.push({ champ, message: `${champ} ne peut pas être négatif` });
      }
    }
  });

  const pcts = ['retentionPct', 'protocoleConformitePct'];
  pcts.forEach(champ => {
    const v = data[champ];
    if (v !== undefined && v !== null && v !== '') {
      const n = Number(v);
      if (n < 0 || n > 100) {
        erreurs.push({ champ, message: `${champ} doit être entre 0 et 100` });
      }
    }
  });

  return erreurs;
}
