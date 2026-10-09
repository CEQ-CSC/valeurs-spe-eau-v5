/**
 * Validation du formulaire — SPE-Eau V5
 * Valeurs non renseignées ≠ zéro : elles sont exclues du calcul.
 */

export function validerFormulaire(formData, lang='fr') {
  const erreurs = [];
  const t = lang==='fr';
  const info = formData.info||{};
  if (!info.nomProjet?.trim()) {
    erreurs.push({ champ:'info.nomProjet', message:t?'Le nom du projet est requis.':'Project name is required.' });
  }
  // Valeurs numériques — interdire négatif
  [
    ['investissement','total','Investissement total','Total investment'],
    ['scientifique','nombreEchantillons','Nombre d\'échantillons','Number of samples'],
    ['scientifique','nbSites','Nombre de sites','Number of sites'],
    ['sociale','nbParticipants','Nombre de participants','Number of participants'],
    ['sociale','nbParticipantsAvantApres','Participants évalués avant/après','Participants assessed before/after'],
    ['sociale','heuresTotal','Heures bénévoles','Volunteer hours'],
  ].forEach(([sec,champ,lFr,lEn]) => {
    const v = formData[sec]?.[champ];
    if (v!==undefined&&v!==null&&v!=='') {
      if (isNaN(Number(v))) erreurs.push({ champ:`${sec}.${champ}`, message:t?`${lFr} : valeur numérique requise.`:`${lEn}: numeric value required.` });
      else if (Number(v)<0) erreurs.push({ champ:`${sec}.${champ}`, message:t?`${lFr} ne peut pas être négatif.`:`${lEn} cannot be negative.` });
    }
  });
  // Pourcentages
  const ret = formData.sociale?.retentionPct;
  if (ret!==undefined&&ret!==null&&ret!=='') {
    const n=Number(ret);
    if(n<0||n>100) erreurs.push({ champ:'sociale.retentionPct', message:t?'Taux de rétention : entre 0 et 100 %.':'Retention rate must be 0-100%.' });
  }
  const nbEvalues = Number(formData.sociale?.nbParticipantsAvantApres) || 0;
  const nbParticipants = Number(formData.sociale?.nbParticipants) || 0;
  if (nbEvalues > 0 && nbParticipants > 0 && nbEvalues > nbParticipants) {
    erreurs.push({
      champ:'sociale.nbParticipantsAvantApres',
      message:t
        ? 'Le nombre de participants évalués avant/après ne peut pas dépasser le nombre total de participants.'
        : 'The number of participants assessed before/after cannot exceed total participants.',
    });
  }
  // Cohérence heures
  const soc=formData.sociale||{};
  const hT=Number(soc.heuresTotal)||0;
  const hS=(Number(soc.heuresFormation)||0)+(Number(soc.heuresTerrain)||0)+(Number(soc.heuresCoordination)||0);
  if(hS>hT&&hT>0) erreurs.push({ champ:'sociale.heures', message:t?`Sous-totaux (${hS}h) > total (${hT}h).`:`Sub-totals (${hS}h) exceed total (${hT}h).` });
  return erreurs;
}

export function completionParSection(formData) {
  const req = {
    info:            ['nomProjet','organisation'],
    investissement:  ['total'],
    scientifique:    ['protocoleRigueur','nbSites','anneesSurveillance','controleQualite'],
    sociale:         ['nbParticipants','nbBenevoles','heuresTotal','apprentissage'],
    environnementale:['couvertureTerritoriale','diversiteMilieux','detectionRisques'],
    politique:       ['niveauInfluence','instancesGouvernance'],
    preuves:         ['preuveEcosystemique'],
  };
  return Object.fromEntries(Object.entries(req).map(([sec,champs])=>{
    const d=formData[sec]||{};
    const n=champs.filter(c=>{ const v=d[c]; return v!==undefined&&v!==null&&v!==''&&v!==0; }).length;
    return [sec, Math.round((n/champs.length)*100)];
  }));
}
