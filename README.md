# Calculateur de valeur SPE-Eau — V5
## Collectif Eau Québec / G3E-EWAG

Outil bilingue (FR/EN) d'évaluation multidimensionnelle de la valeur des projets de science participative de l'eau (SPE-Eau) au Québec.

---

## ✅ Améliorations V5 vs V4

| Problème V4 | Correction V5 |
|---|---|
| ❌ Deux moteurs de calcul (`page.js` + `calculs.js`) | ✅ **Source unique** : `src/lib/calculations/index.js` |
| ❌ Pondérations incohérentes (40/20/20/20 vs 30/30/20/20) | ✅ MCDA **25/25/25/25** équipondéré et défendable |
| ❌ Valeurs par défaut favorables (protocole 75%, couverture 50%) | ✅ **Aucune valeur par défaut** — champs vides exclus du calcul |
| ❌ Null et zéro traités identiquement | ✅ `null` ≠ `0` — donnée inconnue ≠ donnée faible |
| ❌ Forfait rigide 1 500 000$ pour crise d'eau | ✅ **Modèle probabiliste** : coût × prob. détection × contribution |
| ❌ 1 200$/risque sans justification | ✅ Coûts sourcés (MELCCFP, INSPQ, MESI) avec intervalles |
| ❌ CEQ +5 points bonus intrinsèque | ✅ CEQ = **facteur de diffusion** uniquement, pas de score |
| ❌ Score volume brut (saturation 5000 obs.) | ✅ Volume × couverture × diversité × temporalité |
| ❌ Anomalie mathématique `(val-1)/4×20` non bornée | ✅ Toutes sorties bornées `[0,100]` avec `Math.max(0,...)` |
| ❌ Aucun niveau de confiance | ✅ **Confiance par dimension** (élevée/moyenne/faible) |
| ❌ Aucun test automatisé | ✅ **28 tests** dans `src/tests/run-tests.js` |

---

## Dimensions évaluées

| Dimension | Pondération | Méthode |
|---|---|---|
| 🔬 Scientifique | **25 %** | Protocole × couverture × diversité × qualité × intégration |
| 🤝 Sociale | **25 %** | Participation × apprentissage × inclusion × rayonnement |
| 🌿 Environnementale | **25 %** | Couverture × détection × TEEB Canada 2021 |
| 🏛️ Politique | **25 %** | Échelle influence × gouvernance × partenariats |
| 💰 Économique | **Séparée** | Bénévolat + données + éco. + coûts évités + influence |

---

## Architecture

```
src/
├── app/
│   ├── page.js                    # ✅ SPA principale — AUCUN calcul ici
│   ├── layout.js                  # Métadonnées + fonts
│   ├── globals.css                # Palette CEQ officielle
│   ├── error.js                   # Page d'erreur
│   └── api/
│       ├── send/route.js          # Soumission Supabase + Resend
│       └── stats/route.js         # Stats réseau provincial
│
├── components/
│   ├── assessment/                # 7 étapes du formulaire
│   │   ├── StepInfo.js
│   │   ├── StepInvestissement.js
│   │   ├── StepScientifique.js
│   │   ├── StepSociale.js
│   │   ├── StepEnvironnementale.js
│   │   ├── StepPolitique.js
│   │   └── StepPreuves.js
│   ├── dashboard/Dashboard.js     # Résultats visuels (Recharts)
│   ├── report/RapportPrint.js     # Rapport PDF imprimable
│   ├── ReseauProvincial.js        # Réseau et soumission
│   └── ui/
│       └── LikertScale.js
│
├── lib/
│   ├── calculations/
│   │   └── index.js               # ✅ MOTEUR UNIQUE — point d'entrée
│   ├── methodology/
│   │   └── weights.js             # Pondérations MCDA versionnées
│   └── validation/
│       └── assessmentSchema.js    # Validation + complétion
│
├── data/
│   └── referenceCosts.js          # Valeurs monétaires sourcées
│
└── tests/
    └── run-tests.js               # 28 tests automatisés
```

---

## Installation et déploiement

### 1. Local

```bash
git clone https://github.com/CEQ-CSC/Valeurs_SPE_WR-CEQ_V5.git
cd Valeurs_SPE_WR-CEQ_V5
npm install
npm run dev
# → http://localhost:3000
```

### 2. Tester le moteur de calcul

```bash
npm test
# → 28 tests automatisés
```

### 3. Build de production

```bash
npm run build
# Vérifie qu'il n'y a aucune erreur avant de pousser
```

### 4. Pousser sur GitHub

```bash
git add .
git commit -m "feat: V5 — moteur unifié, confiance, modèle probabiliste"
git push origin main
```

### 5. Déployer sur Vercel

**Option A — Interface Vercel (recommandé)**
1. Aller sur [vercel.com](https://vercel.com) → **New Project**
2. Importer le dépôt GitHub `Valeurs_SPE_WR-CEQ_V5`
3. Framework : **Next.js** (détecté automatiquement)
4. Configurer les variables d'environnement (voir ci-dessous)
5. Cliquer **Deploy**

**Option B — CLI Vercel**
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## Variables d'environnement Vercel

| Variable | Obligatoire | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Si réseau actif | URL de votre projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Si réseau actif | Clé publique Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Recommandé | Clé service Supabase (écriture) |
| `RESEND_API_KEY` | Si notifications | Clé API Resend |
| `NOTIFICATION_EMAIL` | Si notifications | Courriel de réception des soumissions |

**Sans ces variables**, l'outil fonctionne en mode local complet (calcul + rapport) — seule la soumission au réseau provincial est désactivée.

---

## Méthodologie V5

### Scores (0–100)
- Questions **Likert 1–5** converties en score continu
- Entrées **non renseignées** = `null` → exclues du calcul (≠ zéro)
- Toutes les sorties bornées `[0, 100]` — aucun score négatif possible

### Pondérations MCDA
- **25/25/25/25** — équipondérées, défendables, transparentes
- Versionnées dans `src/lib/methodology/weights.js`

### Valeur économique (séparée du score)
- Bénévolat : 22,60 $/h (Stats Canada, ESG 2022)
- Observations : 35/75/185 $/obs. selon complexité (MELCCFP 2022-2023)
- Services éco. : 9 200 $/ha milieux humides (TEEB Canada 2021)
- Coûts évités : **modèle probabiliste** `coût × probabilité_détection × contribution`
- SROI = valeur totale / investissement déclaré

### Niveau de confiance
- **Élevé** (≥75%) : données principalement mesurées/documentées
- **Moyen** (45–74%) : mix documenté/estimé
- **Faible** (<45%) : principalement déclaratif

---

## Contact

Collectif Eau Québec / G3E-EWAG  
[g3e-ewag.ca/collectif-eau-quebec](https://www.g3e-ewag.ca/collectif-eau-quebec/)
