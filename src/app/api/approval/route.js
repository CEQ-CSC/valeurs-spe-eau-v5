import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

function getToken(value) {
  if (typeof value !== 'string' || !/^[a-f0-9]{64}$/.test(value)) {
    return null;
  }
  return value;
}

function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error('La configuration Supabase (URL et clé service) est manquante.');
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function GET(req) {
  const token = getToken(new URL(req.url).searchParams.get('token'));
  if (!token) {
    return Response.json({ success: false, error: 'Lien de validation invalide.' }, { status: 400 });
  }

  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('soumissions_reseau')
      .select('project_name,organization,global_score,economic_value,submitted_at')
      .eq('approval_token_hash', hashToken(token))
      .eq('status', 'pending')
      .maybeSingle();

    if (error) throw new Error(`Erreur de lecture de la demande : ${error.message}`);
    if (!data) {
      return Response.json(
        { success: false, error: 'Ce lien est invalide ou cette demande a déjà été traitée.' },
        { status: 404 },
      );
    }

    return Response.json({ success: true, submission: data });
  } catch (error) {
    console.error('Erreur API approval GET:', error);
    const message = error instanceof Error ? error.message : 'Une erreur inattendue est survenue.';
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const token = getToken(body.token);
    if (!token || !['approved', 'rejected'].includes(body.decision)) {
      return Response.json({ success: false, error: 'Décision ou lien de validation invalide.' }, { status: 400 });
    }

    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('soumissions_reseau')
      .update({
        status: body.decision,
        approval_token_hash: null,
        reviewed_at: new Date().toISOString(),
      })
      .eq('approval_token_hash', hashToken(token))
      .eq('status', 'pending')
      .select('id')
      .maybeSingle();

    if (error) throw new Error(`Erreur lors de la mise à jour du statut : ${error.message}`);
    if (!data) {
      return Response.json(
        { success: false, error: 'Ce lien est invalide ou cette demande a déjà été traitée.' },
        { status: 404 },
      );
    }

    return Response.json({ success: true, status: body.decision });
  } catch (error) {
    console.error('Erreur API approval POST:', error);
    const message = error instanceof Error ? error.message : 'Une erreur inattendue est survenue.';
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
