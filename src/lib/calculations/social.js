/**
 * Calcul — Dimension Sociale — SPE-Eau V5
 *
 * Amélioration vs V4 :
 *   • 5 sous-dimensions : participation, apprentissage, inclusion, rayonnement, transfert
 *   • Valeur bénévolat ventilée par type de temps
 *   • Anomalie mathématique corrigée (max(0, ...))
 */

import { likertToScore, nombreToScore, pctToScore, moyennePonderee, borne } from './normalize';
import { INDICATEURS_SOCIALE } from '@/lib/methodology/indicators';
import { BENEVOLE, FORMATION } from '@/data/referenceCosts';

export function calculerSociale(data) {
  const {
    nbParticipants,     // nombre
    nbBenevoles,        // nombre
    heuresTotal,        // heures/an toutes activités confondues
    heuresFormation,    // sous-total formation
    heuresTerrain,      // sous-total terrain
    heuresCoordination, // sous-total coordination
    retentionPct,       // % rétention bénévoles
    apprentissage,      // likert 1–5
    inclusion,          // likert 1–5
    rayonnement,        // likert 1–5
    transfert,          // likert 1–5
    nbEvenementsPublics,// nombre
  } = data;

  // ─── Score participation ──────────────────────────────────────────
  const sParticipants = nombreToScore(nbParticipants, 300); // saturation 300 pers.
  const sRetention    = pctToScore(retentionPct);
  const sParticipation = moyennePonderee([
    { score: sParticipants, poids: 0.6 },
    { score: sRetention,    poids: 0.4 },
  ]);

  const scores = [
    { id: 'participation', score: sParticipation, poids: INDICATEURS_SOCIALE.find(i => i.id === 'participation').poids },
    { id: 'apprentissage', score: likertToScore(apprentissage), poids: INDICATEURS_SOCIALE.find(i => i.id === 'apprentissage').poids },
    { id: 'inclusion',     score: likertToScore(inclusion),     poids: INDICATEURS_SOCIALE.find(i => i.id === 'inclusion').poids },
    { id: 'rayonnement',   score: likertToScore(rayonnement),   poids: INDICATEURS_SOCIALE.find(i => i.id === 'rayonnement').poids },
    { id: 'transfert',     score: likertToScore(transfert),     poids: INDICATEURS_SOCIALE.find(i => i.id === 'transfert').poids },
  ];

  const scoreFinal = borne(moyennePonderee(scores));

  // ─── Valeur économique bénévolat ventilée ─────────────────────────
  const taux = BENEVOLE.tauxHoraire.valeur;

  // Ventilation par type si disponible, sinon total global
  const hForm  = Number(heuresFormation)    || 0;
  const hTerr  = Number(heuresTerrain)      || 0;
  const hCoord = Number(heuresCoordination) || 0;
  const hAutre = Math.max(0, (Number(heuresTotal) || 0) - hForm - hTerr - hCoord);

  const valeurBenevoleDetail = {
    formation:    Math.round(hForm  * taux * BENEVOLE.types.formation.poids),
    terrain:      Math.round(hTerr  * taux * BENEVOLE.types.terrain.poids),
    coordination: Math.round(hCoord * taux * BENEVOLE.types.coordination.poids),
    autre:        Math.round(hAutre * taux),
  };
  const valeurBenevoleTotal = Object.values(valeurBenevoleDetail).reduce((a, b) => a + b, 0);

  // Valeur sensibilisation
  const nb = Math.max(0, Number(nbParticipants) || 0);
  const valeurSensibilisation = Math.round(nb * FORMATION.par_participant_sensibilise.valeur);

  return {
    score: scoreFinal,
    scores_detail: scores.map(s => ({ ...s, score: s.score ?? 0 })),
    valeur_eco: {
      valeurBenevoleDetail,
      valeurBenevoleTotal,
      valeurSensibilisation,
      total: valeurBenevoleTotal + valeurSensibilisation,
      tauxHoraire: taux,
    },
  };
}
