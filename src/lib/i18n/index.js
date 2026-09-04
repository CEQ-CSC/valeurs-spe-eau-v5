import fr from './fr';
import en from './en';

const locales = { fr, en };

/** Retourne les traductions pour la langue donnée */
export function useT(lang = 'fr') {
  return locales[lang] ?? locales.fr;
}

/** Formate un montant en CAD selon la locale */
export function formaterMonnaie(montant, lang = 'fr') {
  return new Intl.NumberFormat(lang === 'fr' ? 'fr-CA' : 'en-CA', {
    style: 'currency', currency: 'CAD', maximumFractionDigits: 0,
  }).format(Math.max(0, montant || 0));
}

/** Formate une date */
export function formaterDate(isoDate, lang = 'fr') {
  return new Date(isoDate).toLocaleDateString(
    lang === 'fr' ? 'fr-CA' : 'en-CA',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
}
