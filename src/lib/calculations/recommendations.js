/**
 * Recommandations automatiques — SPE-Eau V5
 *
 * Basées sur les scores et les lacunes identifiées.
 * Chaque recommandation inclut : dimension, priorité, titre, texte, potentiel d'amélioration.
 */

export function genererRecommandations(scores, resultats, lang = 'fr') {
  const recs = [];
  const t = lang === 'fr';

  // ─── Scientifique ────────────────────────────────────────────────
  if (scores.scientifique < 65) {
    const detail = resultats.scientifique?.scores_detail || [];
    const faibleProtocole   = detail.find(d => d.id === 'protocole')?.score < 50;
    const faibleCouverture  = detail.find(d => d.id === 'couverture_spatiale')?.score < 40;
    const faibleValidation  = detail.find(d => d.id === 'qualite_controle')?.score < 50;

    if (faibleProtocole) {
      recs.push({
        dimension: 'scientifique', priorite: 'haute',
        titre_fr: 'Formaliser le protocole de collecte',
        titre_en: 'Formalize the collection protocol',
        texte_fr: 'Rédigez un protocole standardisé documentant les procédures de collecte, les équipements utilisés et les critères de validation. Un protocole formalisé augmente significativement la crédibilité des données.',
        texte_en: 'Write a standardized protocol documenting collection procedures, equipment used, and validation criteria. A formalized protocol significantly increases data credibility.',
        potentiel: '+15 points',
      });
    }
    if (faibleCouverture) {
      recs.push({
        dimension: 'scientifique', priorite: 'moyenne',
        titre_fr: 'Élargir la couverture spatiale',
        titre_en: 'Expand spatial coverage',
        texte_fr: 'Identifiez des zones peu surveillées de votre bassin versant et établissez des partenariats avec des groupes locaux pour y déployer de nouveaux sites de surveillance.',
        texte_en: 'Identify under-monitored areas of your watershed and establish partnerships with local groups to deploy new monitoring sites there.',
        potentiel: '+12 points',
      });
    }
    if (faibleValidation) {
      recs.push({
        dimension: 'scientifique', priorite: 'haute',
        titre_fr: 'Mettre en place un contrôle qualité',
        titre_en: 'Implement quality control',
        texte_fr: 'Adoptez un processus de validation des données : double-saisie, vérification par un expert, ou comparaison avec des données de référence gouvernementales.',
        texte_en: 'Adopt a data validation process: double entry, expert verification, or comparison with government reference data.',
        potentiel: '+10 points',
      });
    }
  }

  // ─── Sociale ─────────────────────────────────────────────────────
  if (scores.sociale < 65) {
    const detail = resultats.sociale?.scores_detail || [];
    const faibleParticipation = detail.find(d => d.id === 'participation')?.score < 40;
    const faibleInclusion     = detail.find(d => d.id === 'inclusion')?.score < 40;

    if (faibleParticipation) {
      recs.push({
        dimension: 'sociale', priorite: 'haute',
        titre_fr: 'Développer une stratégie de rétention des bénévoles',
        titre_en: 'Develop a volunteer retention strategy',
        texte_fr: 'Mettez en place des mécanismes de reconnaissance (certificats, événements annuels) et de formation continue. La fidélisation coûte moins cher que le recrutement.',
        texte_en: 'Implement recognition mechanisms (certificates, annual events) and ongoing training. Retention is less costly than recruitment.',
        potentiel: '+15 points',
      });
    }
    if (faibleInclusion) {
      recs.push({
        dimension: 'sociale', priorite: 'moyenne',
        titre_fr: 'Favoriser la diversité des participants',
        titre_en: 'Foster participant diversity',
        texte_fr: 'Développez des partenariats avec des écoles, des groupes de femmes, des communautés autochtones ou des organisations de jeunesse pour élargir la base de participants.',
        texte_en: 'Develop partnerships with schools, women\'s groups, Indigenous communities, or youth organizations to broaden the participant base.',
        potentiel: '+10 points',
      });
    }
  }

  // ─── Environnementale ────────────────────────────────────────────
  if (scores.environnementale < 65) {
    const detail = resultats.environnementale?.scores_detail || [];
    const faibleDetection = detail.find(d => d.id === 'detection_risques')?.score < 40;
    const faiblePDE       = detail.find(d => d.id === 'contribution_pde')?.score < 30;

    if (faibleDetection) {
      recs.push({
        dimension: 'environnementale', priorite: 'haute',
        titre_fr: 'Développer un protocole de signalement rapide',
        titre_en: 'Develop a rapid reporting protocol',
        texte_fr: 'Mettez en place une procédure claire pour signaler rapidement les anomalies détectées aux autorités concernées (MELCCFP, municipalités). Documentez chaque signalement.',
        texte_en: 'Establish a clear procedure for rapidly reporting detected anomalies to relevant authorities (MELCCFP, municipalities). Document each report.',
        potentiel: '+14 points',
      });
    }
    if (faiblePDE) {
      recs.push({
        dimension: 'environnementale', priorite: 'moyenne',
        titre_fr: 'Connecter les données au Plan directeur de l\'eau',
        titre_en: 'Connect data to the watershed master plan',
        texte_fr: 'Prenez contact avec l\'organisme de bassin versant (OBV) de votre territoire pour aligner votre surveillance avec les priorités du PDE et contribuer aux rapports de suivi.',
        texte_en: 'Contact the watershed organization (OBV) in your area to align your monitoring with PDE priorities and contribute to follow-up reports.',
        potentiel: '+8 points',
      });
    }
  }

  // ─── Politique ───────────────────────────────────────────────────
  if (scores.politique < 65) {
    const detail = resultats.politique?.scores_detail || [];
    const faibleInfluence = detail.find(d => d.id === 'niveau_influence')?.score < 40;
    const faibleInstances = detail.find(d => d.id === 'instances_gouvernance')?.score < 40;

    if (faibleInfluence) {
      recs.push({
        dimension: 'politique', priorite: 'haute',
        titre_fr: 'Documenter les utilisations institutionnelles des données',
        titre_en: 'Document institutional use of your data',
        texte_fr: 'Identifiez deux instances décisionnelles (conseil municipal, comité de l\'eau, MRC) et proposez une présentation formelle de vos données. Gardez une trace écrite de chaque utilisation.',
        texte_en: 'Identify two decision-making bodies (municipal council, water committee, RCM) and propose a formal presentation of your data. Keep written records of each use.',
        potentiel: '+18 points',
      });
    }
    if (faibleInstances) {
      recs.push({
        dimension: 'politique', priorite: 'moyenne',
        titre_fr: 'Participer aux instances de gouvernance de l\'eau',
        titre_en: 'Participate in water governance bodies',
        texte_fr: 'Demandez à être représentés dans les comités de l\'eau locaux, les tables de concertation ou les CRE de votre région.',
        texte_en: 'Request representation on local water committees, concertation tables or regional environment councils.',
        potentiel: '+12 points',
      });
    }
  }

  // ─── Recommandation globale données FAIR ─────────────────────────
  const avertissement = resultats.environnementale?.valeur_eco?.avertissement;
  if (avertissement) {
    recs.push({
      dimension: 'transversale', priorite: 'moyenne',
      titre_fr: 'Documenter les preuves pour augmenter la crédibilité',
      titre_en: 'Document evidence to increase credibility',
      texte_fr: 'Plusieurs valeurs calculées ont été ajustées à la baisse en raison d\'un niveau de preuve faible. Conservez les documents qui corroborent vos données : rapports, échanges officiels, données mesurées.',
      texte_en: 'Several calculated values were adjusted downward due to low evidence levels. Keep documents that corroborate your data: reports, official communications, measured data.',
      potentiel: 'Augmente le niveau de confiance global',
    });
  }

  // Trier par priorité
  const ordre = { haute: 0, moyenne: 1, basse: 2 };
  return recs.sort((a, b) => (ordre[a.priorite] ?? 9) - (ordre[b.priorite] ?? 9));
}
