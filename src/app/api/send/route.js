import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const data = await req.json();
    const resend = new Resend(process.env.RESEND_API_KEY);
    const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey  = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) throw new Error("Configuration Supabase manquante.");

    const supabase = createClient(supabaseUrl, supabaseKey);

    const nomProjet      = data.nomProjet      || 'Projet non nommé';
    const organisation   = data.organisation   || 'Organisation non spécifiée';
    const personneRef    = data.nomPersonneRessource || 'Non renseigné';
    const courrielContact= data.courrielContact      || 'Non renseigné';

    // Insertion Supabase — compatible V4 + V5
    const { error: dbError } = await supabase.from('projets_reseau').insert([{
      nom_projet:       nomProjet,
      organisation:     organisation,
      valeur_economi:   Number(data.valeurEconomique || 0),
      valeur_scientific:Number(data.scoresParDimension?.Scientifique || data.valeurScientifique || 0),
      valeur_sociale:   Number(data.scoresParDimension?.Sociale || data.valeurSociale || 0),
      valeur_environn:  Number(data.scoresParDimension?.Environnementale || data.valeurEnvironnementale || 0),
      valeur_politique: Number(data.scoresParDimension?.Politique || data.valeurPolitique || 0),
      valeur_donnees:   Number(data.valeurDonnees || 0),
      score_global:     Number(data.scoreGlobal || 0),
      version_methodo:  data.version || '1.0',
      year:             new Date().getFullYear(),
    }]);
    if (dbError) throw new Error("Erreur base de données : " + dbError.message);

    const recipientEmail = process.env.NOTIFICATION_EMAIL || 'notifications@g3e-ewag.ca';
    const { error: emailError } = await resend.emails.send({
      from: 'Calculateur SPE-Eau <onboarding@resend.dev>',
      to:   [recipientEmail],
      subject: `[CEQ] Nouvelle soumission V1.0 : ${nomProjet}`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#222f3d;max-width:600px;margin:0 auto;border:1px solid #e1e8ed;padding:28px;border-radius:12px;">
          <h2 style="color:#222f3d;border-bottom:2px solid #c7d8e5;padding-bottom:10px;">
            Nouvelle soumission — Réseau Provincial SPE-Eau V1.0
          </h2>
          <p><strong>Projet :</strong> ${nomProjet}</p>
          <p><strong>Organisation :</strong> ${organisation}</p>
          <p><strong>Contact :</strong> ${personneRef} (${courrielContact})</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0;"/>
          <p><strong>Score global V1.0 :</strong> <strong>${data.scoreGlobal || 0}/100</strong></p>
          <p><strong>Valeur économique :</strong> <span style="font-size:16px;font-weight:bold;color:#394f66;">${Number(data.valeurEconomique||0).toLocaleString('fr-CA')} $</span></p>
          <ul style="background:#f8fafc;padding:12px 24px;border-radius:8px;font-size:14px;">
            <li>Scientifique : ${data.scoresParDimension?.Scientifique||0}/100</li>
            <li>Sociale : ${data.scoresParDimension?.Sociale||0}/100</li>
            <li>Environnementale : ${data.scoresParDimension?.Environnementale||0}/100</li>
            <li>Politique : ${data.scoresParDimension?.Politique||0}/100</li>
          </ul>
          <p style="font-size:11px;color:#64748b;margin-top:24px;">
            Généré par SPE-Eau V1.0 · Collectif Eau Québec / G3E-EWAG
          </p>
        </div>`,
    });
    if (emailError) throw new Error("Erreur courriel : " + emailError.message);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Erreur API send:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
