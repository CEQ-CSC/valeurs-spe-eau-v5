import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const DIMENSIONS = [
  ['Scientifique', 'valeur_scientific', 'scientific_score'],
  ['Sociale', 'valeur_sociale', 'social_score'],
  ['Environnementale', 'valeur_environn', 'environmental_score'],
  ['Politique', 'valeur_politique', 'political_score'],
];

function sum(rows, key) {
  return rows.reduce((total, row) => total + Number(row[key] || 0), 0);
}

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    return Response.json(
      { success: false, error: 'Les statistiques du réseau ne sont pas configurées.' },
      { status: 503 },
    );
  }

  try {
    const supabase = createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const [legacyResult, approvedResult] = await Promise.all([
      supabase.from('projets_reseau').select(
        'valeur_economi,valeur_scientific,valeur_sociale,valeur_environn,valeur_politique,score_global',
      ),
      supabase.from('soumissions_reseau')
        .select('economic_value,scientific_score,social_score,environmental_score,political_score,global_score')
        .eq('status', 'approved'),
    ]);

    if (legacyResult.error) throw new Error(`Erreur de lecture des projets historiques : ${legacyResult.error.message}`);
    if (approvedResult.error) throw new Error(`Erreur de lecture des contributions approuvées : ${approvedResult.error.message}`);

    const rows = [
      ...(legacyResult.data || []).map(row => ({
        economic_value: row.valeur_economi,
        global_score: row.score_global,
        scientific_score: row.valeur_scientific,
        social_score: row.valeur_sociale,
        environmental_score: row.valeur_environn,
        political_score: row.valeur_politique,
      })),
      ...(approvedResult.data || []),
    ];
    const projectCount = rows.length;
    const stats = {
      projetsEnregistres: projectCount,
      valeurEconomiqueCumulee: rows.reduce((total, row) => total + Number(row.economic_value || 0), 0),
      scoreGlobalMoyen: projectCount
        ? Math.round(sum(rows, 'global_score') / projectCount)
        : 0,
      repartitionParDimension: DIMENSIONS.map(([name, , key]) => ({
        name,
        'Impact Cumulé (/)': projectCount
          ? Math.round(sum(rows, key) / projectCount)
          : 0,
      })),
    };

    return Response.json({ success: true, stats });
  } catch (error) {
    console.error('Erreur API stats:', error);
    const message = error instanceof Error ? error.message : 'Une erreur inattendue est survenue.';
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
