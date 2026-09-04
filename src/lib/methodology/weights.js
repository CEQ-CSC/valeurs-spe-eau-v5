/**
 * Pondérations MCDA — SPE-Eau V5
 *
 * Décision d'architecture :
 * • 4 dimensions équipondérées à 25 % (symétrie défendable)
 * • La valeur économique est SÉPARÉE du score multidimensionnel
 * • Aucun bonus pour l'appartenance au réseau CEQ (biais méthodologique)
 * • Mode "CEQ avancé" disponible (personnalisable)
 */

export const POIDS_DEFAUT = {
  scientifique:  0.25,
  sociale:       0.25,
  environnementale: 0.25,
  politique:     0.25,
};

export const POIDS_CEQ_AVANCE = {
  scientifique:  0.30,
  sociale:       0.25,
  environnementale: 0.30,
  politique:     0.15,
};

// Validation : la somme doit être 1.00
export function validerPoids(poids) {
  const somme = Object.values(poids).reduce((a, b) => a + b, 0);
  return Math.abs(somme - 1.0) < 0.001;
}

export function getPoids(mode = 'defaut') {
  return mode === 'avance' ? POIDS_CEQ_AVANCE : POIDS_DEFAUT;
}
