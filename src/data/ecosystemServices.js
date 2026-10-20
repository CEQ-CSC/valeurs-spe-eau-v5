export const ECOSYSTEM_SERVICES_SOURCE = {
  citation: 'de Groot et al. (2012), Ecosystem Services 1, 50–61, Table 2',
  url: 'https://www.sciencedirect.com/science/article/pii/S2212041612000101',
  originalCurrency: 'Int$ 2007',
  originalUnit: 'Int$/ha/an',
  currency: 'CAD 2026',
  unit: 'CAD/ha/an',
  purchasingPowerParityCadPerIntDollar2007: 1.212177,
  cpiCanada2007AnnualAverage: 111.45,
  cpiCanadaLatest: 170,
  cpiLatestDate: '2026-09',
  inflationFactor: 170 / 111.45,
  cad2026PerIntDollar2007: 1.212177 * (170 / 111.45),
  conversionSources: [
    {
      name: 'World Bank, PPP conversion factor, GDP (LCU per international $), Canada, 2007',
      url: 'https://api.worldbank.org/v2/country/CAN/indicator/PA.NUS.PPP?date=2007&format=json',
    },
    {
      name: 'Bank of Canada, total CPI, monthly observations (January 2007 to September 2026)',
      url: 'https://www.bankofcanada.ca/valet/observations/STATIC_INFLATIONCALC/json?start_date=2007-01-01&end_date=2026-09-01',
    },
  ],
};

export const ECOSYSTEM_SERVICES = [
  { id: 'food', category: 'provisioning', fr: 'Nourriture', en: 'Food', inlandWetlands: 614, freshwater: 106 },
  { id: 'water', category: 'provisioning', fr: 'Eau douce', en: 'Fresh water', inlandWetlands: 408, freshwater: 1808 },
  { id: 'raw_materials', category: 'provisioning', fr: 'Matières premières', en: 'Raw materials', inlandWetlands: 425, freshwater: null },
  { id: 'genetic_resources', category: 'provisioning', fr: 'Ressources génétiques', en: 'Genetic resources', inlandWetlands: null, freshwater: null },
  { id: 'medicinal_resources', category: 'provisioning', fr: 'Ressources médicinales', en: 'Medicinal resources', inlandWetlands: 99, freshwater: null },
  { id: 'ornamental_resources', category: 'provisioning', fr: 'Ressources ornementales', en: 'Ornamental resources', inlandWetlands: 114, freshwater: null },
  { id: 'air_quality', category: 'regulating', fr: 'Régulation de la qualité de l’air', en: 'Air quality regulation', inlandWetlands: null, freshwater: null },
  { id: 'climate_regulation', category: 'regulating', fr: 'Régulation du climat', en: 'Climate regulation', inlandWetlands: 488, freshwater: null },
  { id: 'disturbance_moderation', category: 'regulating', fr: 'Modération des perturbations', en: 'Disturbance moderation', inlandWetlands: 2986, freshwater: null },
  { id: 'water_flow_regulation', category: 'regulating', fr: 'Régulation des flux d’eau', en: 'Water flow regulation', inlandWetlands: 5606, freshwater: null },
  { id: 'waste_treatment', category: 'regulating', fr: 'Traitement des déchets et épuration', en: 'Waste treatment', inlandWetlands: 3015, freshwater: 187 },
  { id: 'erosion_prevention', category: 'regulating', fr: 'Prévention de l’érosion', en: 'Erosion prevention', inlandWetlands: 2607, freshwater: null },
  { id: 'nutrient_cycling', category: 'regulating', fr: 'Cycle des nutriments', en: 'Nutrient cycling', inlandWetlands: 1713, freshwater: null },
  { id: 'pollination', category: 'regulating', fr: 'Pollinisation', en: 'Pollination', inlandWetlands: null, freshwater: null },
  { id: 'biological_control', category: 'regulating', fr: 'Contrôle biologique', en: 'Biological control', inlandWetlands: 948, freshwater: null },
  { id: 'nursery', category: 'habitat', fr: 'Habitat et nurserie', en: 'Habitat and nursery service', inlandWetlands: 1287, freshwater: null },
  { id: 'genetic_diversity', category: 'habitat', fr: 'Diversité génétique', en: 'Genetic diversity', inlandWetlands: 1168, freshwater: null },
  { id: 'aesthetic_information', category: 'cultural', fr: 'Information esthétique', en: 'Aesthetic information', inlandWetlands: 1292, freshwater: null },
  { id: 'recreation', category: 'cultural', fr: 'Loisirs et récréation', en: 'Recreation', inlandWetlands: 2211, freshwater: 2166 },
  { id: 'cultural_inspiration', category: 'cultural', fr: 'Inspiration artistique et culturelle', en: 'Inspiration for culture and art', inlandWetlands: 700, freshwater: null },
  { id: 'spiritual_experience', category: 'cultural', fr: 'Expérience spirituelle', en: 'Spiritual experience', inlandWetlands: null, freshwater: null },
  { id: 'cognitive_development', category: 'cultural', fr: 'Développement cognitif', en: 'Cognitive development', inlandWetlands: null, freshwater: null },
];

export function convertirInt2007EnCAD2026(valeurInt2007) {
  return Math.round(valeurInt2007 * ECOSYSTEM_SERVICES_SOURCE.cad2026PerIntDollar2007);
}
