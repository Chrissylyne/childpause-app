// Consentement a la mesure d'audience (Google Analytics 4).
// Tant que le visiteur n'a pas dit oui, aucun script Google n'est charge
// et aucun cookie n'est depose.

const STORAGE_KEY = 'childpause_consent';
const GA_ID = 'G-1TY82G8E0G';

export const CONSENT_REOPEN_EVENT = 'childpause:open-consent';

export function getConsent() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

export function setConsent(value) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Stockage indisponible : le choix vaut pour la visite en cours seulement.
  }
  if (value === 'granted') enableAnalytics();
  else disableAnalytics();
}

function defineGtag() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
}

export function enableAnalytics() {
  if (typeof window === 'undefined') return;
  window[`ga-disable-${GA_ID}`] = false;
  defineGtag();

  if (document.getElementById('ga4-script')) return;

  window.gtag('js', new Date());
  window.gtag('config', GA_ID);

  const script = document.createElement('script');
  script.id = 'ga4-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}

export function disableAnalytics() {
  if (typeof window === 'undefined') return;
  window[`ga-disable-${GA_ID}`] = true;
  window.gtag = undefined;

  // Supprime les cookies Google Analytics deja deposes.
  const hostParts = window.location.hostname.split('.');
  const domains = [window.location.hostname];
  if (hostParts.length > 1) domains.push(`.${hostParts.slice(-2).join('.')}`);

  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0].trim();
    if (name === '_ga' || name.startsWith('_ga_')) {
      domains.forEach((domain) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
      });
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  });
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(CONSENT_REOPEN_EVENT));
}
