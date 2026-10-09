'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, CircleAlert, LoaderCircle, XCircle } from 'lucide-react';

export default function ApprovalReview({ token }) {
  const [submission, setSubmission] = useState(null);
  const [error, setError] = useState('');
  const [decision, setDecision] = useState('');
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    let cancelled = false;

    async function loadSubmission() {
      try {
        const response = await fetch(`/api/approval?token=${encodeURIComponent(token)}`);
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Impossible de charger cette demande.');
        if (!cancelled) setSubmission(result.submission);
      } catch (requestError) {
        if (!cancelled) setError(requestError.message || 'Impossible de charger cette demande.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (token) loadSubmission();

    return () => { cancelled = true; };
  }, [token]);

  async function handleDecision(value) {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, decision: value }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'La décision n’a pas pu être enregistrée.');
      setDecision(value);
      setSubmission(null);
    } catch (requestError) {
      setError(requestError.message || 'La décision n’a pas pu être enregistrée.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-ceq-ice px-4 py-12">
      <section className="mx-auto max-w-xl rounded-2xl border border-ceq-iceDark bg-white p-6 shadow-ceq-sm sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-wider text-ceq-slate">
          Réseau provincial · Validation
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold text-ceq-dark">
          Vérifier une demande de contribution
        </h1>

        {loading && (
          <div className="mt-6 flex items-center gap-2 text-sm text-ceq-slate" role="status">
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
            Chargement…
          </div>
        )}

        {(error || (!token && 'Le lien de validation est invalide.')) && (
          <div className="mt-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>{error || 'Le lien de validation est invalide.'}</p>
          </div>
        )}

        {decision && (
          <div className="mt-6 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900" role="status">
            {decision === 'approved'
              ? <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              : <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />}
            <p>
              {decision === 'approved'
                ? 'La demande est approuvée et sera incluse dans les statistiques du Réseau provincial.'
                : 'La demande a été refusée et ne sera pas ajoutée aux statistiques.'}
            </p>
          </div>
        )}

        {submission && !loading && (
          <>
            <dl className="mt-6 grid grid-cols-1 gap-4 rounded-xl bg-ceq-ice p-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-ceq-slate">Projet</dt>
                <dd className="mt-1 font-semibold text-ceq-dark">{submission.project_name}</dd>
              </div>
              <div>
                <dt className="text-ceq-slate">Organisation</dt>
                <dd className="mt-1 font-semibold text-ceq-dark">{submission.organization}</dd>
              </div>
              <div>
                <dt className="text-ceq-slate">Indice global</dt>
                <dd className="mt-1 font-semibold text-ceq-dark">{submission.global_score}/100</dd>
              </div>
              <div>
                <dt className="text-ceq-slate">Valeur économique</dt>
                <dd className="mt-1 font-semibold text-ceq-dark">
                  {Number(submission.economic_value).toLocaleString('fr-CA')} $
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-sm leading-relaxed text-ceq-slate">
              L’approbation ajoutera les indicateurs de cette demande à l’agrégation provinciale. Les coordonnées du contact ne sont pas affichées dans le réseau.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDecision('approved')}
                className="btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-50"
              >
                Approuver et agréger
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDecision('rejected')}
                className="justify-center rounded-lg border border-ceq-iceDark px-4 py-2 text-sm font-semibold text-ceq-slate hover:bg-ceq-ice disabled:cursor-not-allowed disabled:opacity-50"
              >
                Refuser la demande
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
