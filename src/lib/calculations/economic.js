/**
 * Calcul — Valeur économique globale + SROI — SPE-Eau V5
 *
 * Principe :
 *   • La valeur économique est SÉPARÉE du score multidimensionnel
 *   • Avertissement explicite : "estimation, pas un audit financier"
 *   • SROI = valeur totale / investissement déclaré
 *   • Intervalles de confiance présentés
 */

export function calculerEconomique(resultats, investissement) {
  const { scientifique, sociale, environnementale, politique } = resultats;

  const composantes = {
    travail_benevole: sociale?.valeur_eco?.valeurBenevoleTotal || 0,
    sensibilisation:  sociale?.valeur_eco?.valeurSensibilisation || 0,
    donnees_scientifiques: scientifique?.valeur_eco?.valeurDonnees || 0,
    formation_scientifique: scientifique?.valeur_eco?.valeurFormation || 0,
    ecosystemique:    environnementale?.valeur_eco?.valeurEcosystemique || 0,
    couts_evites:     environnementale?.valeur_eco?.coûtsEvitesTotal || 0,
    influence_politique: politique?.valeur_eco?.valeurInfluence || 0,
  };

  const total = Object.values(composantes).reduce((a, b) => a + b, 0);
  const invTotal = Math.max(0, Number(investissement?.total) || 0);

  // SROI
  const sroi = invTotal > 0
    ? Math.round((total / invTotal) * 100) / 100
    : null;

  // Intervalle conservateur/optimiste (±30 % des composantes à faible confiance)
  const totalConservateur = Math.round(total * 0.70);
  const totalOptimiste    = Math.round(total * 1.30);

  return {
    composantes,
    total,
    totalConservateur,
    totalOptimiste,
    sroi,
    investissement: invTotal,
    avertissement_fr: 'Ces valeurs sont des estimations à des fins de plaidoyer et de communication. Elles ne constituent pas une valeur comptable ou financière vérifiée.',
    avertissement_en: 'These values are estimates for advocacy and communication purposes. They do not constitute verified accounting or financial values.',
  };
}
