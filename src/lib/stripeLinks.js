// Les liens de paiement viennent de variables d'environnement Vercel :
// liens de test sur les versions de test, vrais liens sur la production.
function clean(value) {
  return typeof value === 'string' && value.startsWith('https://') ? value : null;
}

export function getStripeLinks() {
  const env = import.meta.env || {};
  return {
    monthly: clean(env.VITE_STRIPE_LINK_MONTHLY),
    annual: clean(env.VITE_STRIPE_LINK_ANNUAL),
    portal: clean(env.VITE_STRIPE_PORTAL_URL),
  };
}

export function paymentsEnabled() {
  const { monthly, annual } = getStripeLinks();
  return Boolean(monthly && annual);
}

export function getContactEmail() {
  const value = (import.meta.env || {}).VITE_CONTACT_EMAIL;
  return typeof value === 'string' && value.includes('@') ? value : '';
}

// Pre-remplit l'adresse e-mail sur la page de paiement Stripe
export function withEmail(url, email) {
  if (!url) return null;
  if (!email) return url;
  try {
    const parsed = new URL(url);
    parsed.searchParams.set('prefilled_email', email);
    return parsed.toString();
  } catch {
    return url;
  }
}
