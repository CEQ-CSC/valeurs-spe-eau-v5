# Calculateur de valeur des projets de science participative de l’eau

**Document technique destiné au comité scientifique**

**Collectif Eau Québec (CEQ) / G3E-EWAG**

Application : **V5.0.0** · Moteur de calcul actif : **méthodologie 1.0** · Année de référence inscrite : **2024**
Dernière mise à jour : 9 octobre 2026

## 1. Objet et portée

L’application aide les équipes de projets de science participative de l’eau (SPE-Eau) à décrire et à examiner plusieurs dimensions de leur contribution. Elle produit quatre scores synthétiques, une estimation économique distincte, des recommandations et un rapport imprimable. L’interface est disponible en français et en anglais.

Le calculateur est un **outil d’autoévaluation et de structuration de la réflexion**. Il ne constitue ni une certification scientifique, ni un audit financier, ni une évaluation d’impact causal. Un score ne remplace pas l’examen des protocoles, des données, du contexte territorial ou des preuves par des spécialistes.

## 2. Parcours et résultats

Le formulaire recueille des renseignements sur le projet, l’investissement, les dimensions scientifique, sociale, environnementale et politique, ainsi que les preuves déclarées. Le moteur calcule les résultats dans l’application; l’interface présente un tableau de bord et un rapport que l’on peut imprimer ou exporter en PDF depuis le navigateur.

Les renseignements supplémentaires sur les rôles et les étapes de participation, le parcours d’impact, les références de preuve, l’influence politique et les scénarios de coûts évités alimentent la transparence du rapport. **Ces renseignements ne modifient pas les scores** sauf lorsqu’un champ est également utilisé explicitement par le moteur de calcul.

Une fonction distincte permet de proposer une contribution au Réseau provincial. Selon la configuration du service, la contribution est soumise à approbation avant d’être incluse dans les statistiques publiques. Ce partage n’est pas nécessaire pour réaliser une évaluation.

## 3. Méthode de calcul des scores

### 3.1 Échelle et agrégation

Les réponses Likert de 1 à 5 sont converties en scores de 0 à 100 :

| Réponse | Score |
|---:|---:|
| 1 | 0 |
| 2 | 25 |
| 3 | 50 |
| 4 | 75 |
| 5 | 100 |

Les nombres utilisés comme indicateurs de volume sont transformés par une fonction logarithmique, afin que l’augmentation du nombre de sites, de participants ou de publications ait un rendement décroissant :

`score = 100 × log10(n + 1) / log10(saturation + 1)`, plafonné à 100.

Dans le moteur actif, les seuils de saturation sont de 50 sites, 10 publications et 300 participants. La durée de surveillance est convertie par paliers : 1 an = 20, 2 = 35, 3 = 48, 5 = 62, 7 = 75, 10 = 88 et 15 ans ou plus = 100.

Les sous-indicateurs sont combinés par moyennes pondérées. Les valeurs absentes sont généralement omises et les poids des valeurs disponibles sont renormalisés. Le traitement n’est toutefois pas uniforme : certains indicateurs composites internes sans sous-réponse produisent actuellement un score de zéro; la rétention non renseignée peut aussi être convertie en zéro. **Ces traitements doivent être pris en compte lors de l’interprétation et constituent des points à valider par le comité**; une absence de données ne devrait pas être interprétée automatiquement comme une faible performance.

### 3.2 Dimensions et pondérations internes

Le score global est une moyenne équipondérée des quatre dimensions, calculée par le moteur actif :

`Score global = 0,25 × scientifique + 0,25 × sociale + 0,25 × environnementale + 0,25 × politique`.

| Dimension | Indicateurs et poids internes |
|---|---|
| **Scientifique** | Rigueur du protocole (25 %); couverture spatiale (20 %), combinant le nombre de sites et une appréciation Likert à parts égales; durée de surveillance (15 %); diversité des paramètres (15 %); contrôle qualité (15 %); intégration aux bases et publications (10 %), combinant appréciation et nombre de publications. |
| **Sociale** | Participation (30 %), combinant nombre de personnes (60 %) et rétention (40 %); apprentissage (25 %); inclusion (20 %); rayonnement (15 %); transfert des connaissances (10 %). |
| **Environnementale** | Couverture territoriale (25 %); diversité des milieux (25 %); détection des risques (25 %); services écosystémiques (15 %); contribution aux plans directeurs de l’eau (10 %). |
| **Politique** | Niveau d’influence (35 %); gouvernance (25 %); partenariats (20 %); visibilité publique (10 %); mobilisation du réseau (10 %). |

Les scores sont bornés entre 0 et 100. Le statut de membre du CEQ est un facteur de diffusion présenté à part; il n’ajoute pas de points. La valeur économique est également calculée séparément et ne contribue pas au score global.

## 4. Valeur économique : estimations distinctes

Le moteur actif additionne des estimations de remplacement ou de coûts potentiellement évités. Les valeurs sont exprimées en dollars canadiens et sont des paramètres de référence, non des prix observés universels.

| Composante | Formule ou valeur de référence active |
|---|---|
| Travail bénévole | Heures par type × 22,60 $/h; multiplicateurs de 1,2 pour la formation et 1,3 pour la coordination. |
| Sensibilisation | Nombre de participants × 38 $ par personne. |
| Données scientifiques | Nombre d’échantillons × 35 $, 75 $ ou 185 $, selon la complexité déclarée. |
| Formation | Nombre de bénévoles × 420 $ × score de rigueur du protocole exprimé entre 0 et 1. |
| Services écosystémiques | Hectares de milieux humides × 9 200 $/ha et kilomètres de cours d’eau × 1 800 $/km, ajustés par un facteur de preuve (1,0; 0,8; 0,6; 0,4 ou 0,2 selon le niveau déclaré). |
| Coûts évités | Pour chaque risque pris en charge : coût de référence × probabilité fixe de détection × contribution estimée du projet. |
| Influence politique | Nombre de décisions × 3 500 $ × multiplicateur du niveau d’influence × 5. |

Pour les coûts évités, les probabilités inscrites dans le moteur actif sont de 0,35 pour la contamination de l’eau potable, 0,55 pour les proliférations d’algues, 0,25 pour les déversements accidentels et 0,50 pour les fermetures de plage. Les coûts de référence correspondants sont de 85 000 $ par 1 000 habitants, 45 000 $, 120 000 $ et 28 000 $. Ces paramètres modélisent une valeur attendue; ils **ne démontrent pas** qu’un incident a été évité ni que la SPE-Eau en est la cause.

Le ratio affiché est `valeur économique estimée / investissement déclaré`; il n’est pas calculé si l’investissement est nul ou absent. Il s’agit d’un ratio descriptif de type SROI, sans analyse complète des coûts, des effets attribuables, de leur durée, de leur actualisation ou des scénarios contrefactuels. Les valeurs sont exprimées en dollars canadiens sans indexation automatique à l’inflation. Les composantes peuvent se chevaucher : une même retombée ne doit pas être comptée à la fois comme sensibilisation, service écosystémique, coût évité ou influence politique sans justification.

## 5. Participation, impact et niveau de preuve

Le formulaire décrit les rôles des personnes participantes (contributeur, collaborateur ou responsable) et leur implication dans les étapes du cycle scientifique. Il permet aussi de consigner un parcours d’effets — sensibilisation, apprentissage, mobilisation, décision ou action, changement à long terme — avec un statut et une justification facultative.

Ce parcours distingue les observations et les contributions jugées plausibles; il ne constitue pas une mesure d’impact causal. Le nombre de personnes évaluées avant/après et la méthode d’évaluation des apprentissages peuvent être rapportés, mais l’interface ne réalise pas elle-même cette évaluation.

Des niveaux et références de preuve peuvent être déclarés pour le protocole, la formation, la participation, les écosystèmes et l’influence. La présence d’un document ou d’un lien dans le rapport ne signifie pas que son contenu ou sa qualité a été vérifié par un tiers.

L’indicateur intitulé « renseignements » dans le rapport représente la proportion de champs prioritaires renseignés dans chaque dimension, puis la moyenne des quatre proportions : niveau élevé à partir de 75 %, moyen de 45 % à moins de 75 %, faible sous 45 %. Il mesure la **complétude du formulaire**, pas la validité, la qualité ou la force causale des preuves.

## 6. Fondements et références

### Principes d’évaluation mobilisés

- **PathOS, Open Science Impact Indicator Handbook.** L’application reprend comme inspirations générales la distinction entre impact observé et contribution causale, l’attention aux mécanismes et l’usage prudent d’indicateurs. Le manuel porte sur les impacts de la science ouverte; l’application n’en implémente pas les indicateurs comme méthode validée pour la SPE-Eau. [Handbook PathOS](https://handbook.pathos-project.eu/).
- **European Citizen Science Association (ECSA), 10 Principles of Citizen Science (2015).** Référence de cadrage pour la qualité, la participation et les responsabilités de la science citoyenne. Ces principes ne sont pas un barème de notation repris tel quel dans le moteur. [ECSA — 10 Principles](https://www.ecsa.ngo/2016/05/17/10-principles-of-citizen-science/).
- **MCDA (analyse multicritère)** : le score global agrège quatre dimensions à poids égaux. L’égalité des poids est un choix normatif de conception; elle ne constitue pas une pondération estimée empiriquement ni une validation externe.

### Sources attribuées aux paramètres monétaires dans le code

Les libellés ci-dessous sont ceux consignés dans le moteur et dans les données de référence du dépôt. Ils doivent être considérés comme des **attributions à vérifier**, pas comme une bibliographie complète : les notices, liens, pages, devis, année de prix, ajustements d’inflation et méthodes détaillées ne sont pas tous documentés dans le moteur actif.

- Travail bénévole : Statistique Canada, *Enquête sociale générale — bénévolat 2022*, Québec (22,60 $/h).
- Remplacement des observations : MELCCFP (2022–2023) et Environnement Canada (2023), selon la complexité (35 $, 75 $, 185 $ par observation).
- Formation : Commission de formation du Québec (2023; 420 $).
- Sensibilisation : INSPQ (2020; 38 $ par participant).
- Milieux humides : TEEB Canada (2021; 9 200 $/ha).
- Cours d’eau : Université de Sherbrooke (2020; 1 800 $/km).
- Consultation et influence : Secrétariat du Conseil exécutif du Québec (2022; 3 500 $ par unité de référence).
- Coûts de risques : références attribuées dans le code à l’INSPQ (2019), au MSP Québec (2021), au MDDELCC (2020 et 2022) et au MESI (2021).

**Réserve scientifique :** les paramètres monétaires et probabilités ont besoin d’une revue bibliographique formelle, d’une validation de leur transférabilité au Québec et d’une mise à jour périodique. Les intervalles et niveaux de confiance présents dans `src/data/referenceCosts.js` appartiennent à des modules de calcul complémentaires; ils ne sont pas appliqués par le moteur actif de la page principale.

## 7. Limites à considérer par le comité

1. Les pondérations, seuils logarithmiques, paliers temporels, multiplicateurs et paramètres économiques sont des choix de conception. Ils devraient être soumis à une validation par les parties prenantes, à une analyse de sensibilité et à une mise à jour documentée.
2. Un score global peut masquer des profils très différents. Il doit être lu avec les quatre scores dimensionnels, les champs manquants et les justificatifs.
3. Les valeurs déclarées et les références jointes ne font pas l’objet d’une vérification indépendante automatique.
4. Les modèles de valeur économique utilisent des coûts moyens et des probabilités fixes; ils ne calculent pas des intervalles d’incertitude et peuvent inclure des doubles comptes.
5. Les résultats n’établissent pas d’attribution causale. Pour soutenir une telle conclusion, une évaluation propre au projet doit définir un scénario de comparaison, les autres facteurs explicatifs, les temporalités et les données nécessaires.
6. Des implémentations méthodologiques complémentaires existent dans `src/lib/calculations/`, `src/lib/methodology/` et `src/data/referenceCosts.js`. **Le calcul déclenché par l’interface utilise `src/lib/calculations/index.js`**; toute modification de méthode doit être vérifiée par rapport à ce moteur afin d’éviter une divergence documentaire ou fonctionnelle.

## 8. Architecture technique et vérification

Application web bilingue construite avec Next.js, React et JavaScript. Le flux principal est : formulaire de `src/app/page.js` → calcul par `calculerAssessment` dans `src/lib/calculations/index.js` → tableau de bord (`src/components/dashboard/Dashboard.js`) et rapport imprimable (`src/components/report/RapportPrint.js`). Les API de contribution et de statistiques du Réseau provincial sont dans `src/app/api/`; elles sont distinctes du calcul de score.

Commandes de développement et de vérification depuis la racine du dépôt :

```bash
npm install
npm run dev
npm run lint
npm test
npm run build
```

Les tests existants sont exécutés par `src/tests/run-tests.js`. Il s’agit de vérifications autonomes sur des exemples simulés de normalisation, de valeur économique, de score MCDA, de coûts évités et de validation; ils ne testent pas directement toutes les fonctions de production et ne constituent pas une validation scientifique des indicateurs ou des paramètres.
