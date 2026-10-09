import { createHash, randomBytes } from 'node:crypto';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const DIMENSIONS = [
  ['Scientifique', 'score_scientifique'],
  ['Sociale', 'score_social'],
  ['Environnementale', 'score_environnemental'],
  ['Politique', 'score_politique'],
];

class InputError extends Error {}

function requiredText(value, label, maxLength = 200) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maxLength) {
    throw new InputError(`Le champ « ${label} » est invalide.`);
  }
  return value.trim();
}

function score(value, label) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue < 0 || numericValue > 100) {
    throw new InputError(`Le score « ${label} » doit être compris entre 0 et 100.`);
  }
  return numericValue;
}

function amount(value, label) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue < 0) {
    throw new InputError(`La valeur « ${label} » doit être un nombre positif ou nul.`);
  }
  return numericValue;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function tokenHash(token) {
  return createHash('sha256').update(token).digest('hex');
}

export async function POST(req) {
  let supabase;
  let submissionId;

  try {
    const data = await req.json();
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new InputError('Le contenu de la demande est invalide.');
    }
    if (data.autorisationPartage !== true) {
      throw new InputError('Votre autorisation est requise pour transmettre ce projet.');
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('La configuration Supabase (URL et clé service) est manquante.');
    }
    if (!resendApiKey) {
      throw new Error("La configuration RESEND_API_KEY est manquante; la demande n'a pas été enregistrée.");
    }
    if (!siteUrl) {
      throw new Error("La configuration NEXT_PUBLIC_SITE_URL est manquante; la demande n'a pas été enregistrée.");
    }

    const nomProjet = requiredText(data.nomProjet, 'nom du projet');
    const organisation = requiredText(data.organisation, 'organisation');
    const personneRef = requiredText(data.nomPersonneRessource, 'personne ressource');
    const courrielContact = requiredText(data.courrielContact, 'courriel', 254);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(courrielContact)) {
      throw new InputError('Le courriel de contact est invalide.');
    }

    const scores = Object.fromEntries(DIMENSIONS.map(([label, column]) => [
      column,
      score(data.scoresParDimension?.[label] ?? data[`valeur${label}`], label),
    ]));
    const scoresEnglish = {
      scientific_score: scores.score_scientifique,
      social_score: scores.score_social,
      environmental_score: scores.score_environnemental,
      political_score: scores.score_politique,
    };
    const scoreGlobal = score(data.scoreGlobal, 'global');
    const valeurEconomique = amount(data.valeurEconomique ?? 0, 'économique');
    const valeurDonnees = amount(data.valeurDonnees ?? 0, 'des données');
    const token = randomBytes(32).toString('hex');

    supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: inserted, error: insertError } = await supabase
      .from('soumissions_reseau')
      .insert({
        project_name: nomProjet,
        organization: organisation,
        contact_name: personneRef,
        contact_email: courrielContact,
        global_score: scoreGlobal,
        economic_value: valeurEconomique,
        data_value: valeurDonnees,
        ...scores,
        ...scoresEnglish,
        consent: true,
        approval_token_hash: tokenHash(token),
      })
      .select('id')
      .single();

    if (insertError) throw new Error(`Erreur base de données : ${insertError.message}`);
    submissionId = inserted.id;

    const escaped = {
      nomProjet: escapeHtml(nomProjet),
      organisation: escapeHtml(organisation),
      personneRef: escapeHtml(personneRef),
      courrielContact: escapeHtml(courrielContact),
    };
    const scoreRows = DIMENSIONS.map(([label, column]) =>
      `<li>${escapeHtml(label)} : ${scores[column]}/100</li>`,
    ).join('');
    const approvalUrl = `${siteUrl.replace(/\/$/, '')}/validation?token=${token}`;

    try {
      const resend = new Resend(resendApiKey);
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Calculateur SPE-Eau <onboarding@resend.dev>',
        to: [process.env.NOTIFICATION_EMAIL || 'notifications@g3e-ewag.ca'],
        subject: `[CEQ] Demande à valider — ${nomProjet}`,
        html: `
          <div style="font-family:Arial,sans-serif;color:#222f3d;max-width:600px;margin:0 auto;padding:28px;">
            <h2 style="color:#222f3d;border-bottom:2px solid #c7d8e5;padding-bottom:10px;">
              Demande de contribution au Réseau provincial
            </h2>
            <p>Une demande attend votre validation avant son ajout aux statistiques publiques.</p>
            <p><strong>Projet :</strong> ${escaped.nomProjet}</p>
            <p><strong>Organisation :</strong> ${escaped.organisation}</p>
            <p><strong>Contact :</strong> ${escaped.personneRef} (${escaped.courrielContact})</p>
            <p><strong>Indice global :</strong> ${scoreGlobal}/100</p>
            <p><strong>Valeur économique :</strong> ${valeurEconomique.toLocaleString('fr-CA')} $</p>
            <ul>${scoreRows}</ul>
            <p>Les données ne seront agrégées au Réseau provincial qu'après approbation.</p>
            <p><a href="${approvalUrl}" style="display:inline-block;background:#394f66;color:#fff;padding:12px 18px;text-decoration:none;border-radius:6px;">Examiner et valider la demande</a></p>
            <p style="font-size:12px;color:#64748b;">Ce lien est à usage unique et permet d'approuver ou de refuser cette demande.</p>
          </div>`,
      });
      if (emailError) throw new Error(emailError.message);
      if (!emailData?.id) throw new Error('Le fournisseur n’a pas confirmé l’envoi du courriel.');
    } catch (emailError) {
      let cleanupError;
      try {
        const { error } = await supabase
          .from('soumissions_reseau')
          .delete()
          .eq('id', submissionId);
        cleanupError = error;
      } catch (error) {
        cleanupError = error;
      }

      if (cleanupError) {
        console.error('Échec du nettoyage après erreur de notification:', cleanupError);
        throw new Error(`La demande ${submissionId} a été enregistrée, mais le courriel de validation n'a pas pu être envoyé. Contactez l'équipe du réseau.`);
      }
      throw new Error(`Erreur courriel : ${emailError.message}. La demande n'a pas été enregistrée.`);
    }

    return Response.json({ success: true, status: 'pending' });
  } catch (error) {
    console.error('Erreur API send:', error);
    const message = error instanceof Error ? error.message : "Une erreur inattendue est survenue.";
    return Response.json({ success: false, error: message }, { status: error instanceof InputError ? 400 : 500 });
  }
}
