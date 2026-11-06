import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getContactEmail, getStripeLinks } from '../lib/stripeLinks';

// Chaque langue est ecrite pour elle-meme, pas traduite de l'autre.
const TEXTS = {
  fr: {
    merciTitle: 'Merci pour ton abonnement.',
    merciSubtitle:
      "Entre l'adresse e-mail que tu as utilisée pour payer. Tu reçois un lien qui ouvre ton accès.",
    loginTitle: 'Se connecter',
    loginSubtitle: 'Entre ton adresse e-mail. Tu reçois un lien de connexion, sans mot de passe.',
    emailLabel: 'Ton adresse e-mail',
    send: 'Recevoir mon lien',
    sending: 'Envoi en cours…',
    sent: 'Regarde ta boîte mail : le lien arrive dans quelques instants. Pense à vérifier tes courriers indésirables.',
    otherAddress: 'Utiliser une autre adresse',
    invalid: 'Cette adresse e-mail ne semble pas valide.',
    rateLimit: "Trop d'essais pour le moment. Réessaie dans quelques minutes.",
    failed: "Le lien n'a pas pu être envoyé. Réessaie dans un instant.",
    connectedAs: 'Connecté avec',
    premiumOn: 'Ton accès Premium est ouvert.',
    checking: 'Nous vérifions ton paiement… Cela peut prendre quelques secondes.',
    noPlan:
      "Aucun abonnement actif n'est associé à cette adresse. Si tu as payé avec une autre adresse, reconnecte-toi avec celle-ci.",
    checkAgain: 'Vérifier à nouveau',
    help: 'Besoin d\'aide ? Écris-nous :',
    toSituations: 'Voir les situations',
    manage: 'Gérer mon abonnement',
    signOut: 'Se déconnecter',
  },
  de: {
    merciTitle: 'Danke für dein Abo.',
    merciSubtitle:
      'Gib die E-Mail-Adresse ein, mit der du bezahlt hast. Du bekommst einen Link, der deinen Zugang öffnet.',
    loginTitle: 'Anmelden',
    loginSubtitle: 'Gib deine E-Mail-Adresse ein. Du bekommst einen Anmeldelink, ganz ohne Passwort.',
    emailLabel: 'Deine E-Mail-Adresse',
    send: 'Link senden',
    sending: 'Wird gesendet …',
    sent: 'Schau in dein Postfach: Der Link kommt gleich an. Prüfe bitte auch den Spam-Ordner.',
    otherAddress: 'Andere Adresse verwenden',
    invalid: 'Diese E-Mail-Adresse scheint nicht zu stimmen.',
    rateLimit: 'Zu viele Versuche. Bitte versuche es in ein paar Minuten noch einmal.',
    failed: 'Der Link konnte nicht gesendet werden. Bitte versuche es gleich noch einmal.',
    connectedAs: 'Angemeldet als',
    premiumOn: 'Dein Premium-Zugang ist freigeschaltet.',
    checking: 'Wir prüfen deine Zahlung … Das kann ein paar Sekunden dauern.',
    noPlan:
      'Zu dieser Adresse gehört kein aktives Abonnement. Falls du mit einer anderen Adresse bezahlt hast, melde dich bitte mit dieser an.',
    checkAgain: 'Erneut prüfen',
    help: 'Brauchst du Hilfe? Schreib uns:',
    toSituations: 'Zu den Situationen',
    manage: 'Abo verwalten',
    signOut: 'Abmelden',
  },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const pageStyle = {
  minHeight: '100vh',
  background: 'hsl(240, 20%, 97%)',
  padding: '20px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};
const cardStyle = {
  maxWidth: '460px',
  margin: '0 auto',
  background: 'white',
  borderRadius: '12px',
  padding: '28px 24px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
};
const titleStyle = { fontSize: '22px', fontWeight: 700, color: 'hsl(240, 30%, 20%)', margin: '0 0 8px' };
const subStyle = { fontSize: '15px', color: 'hsl(240, 20%, 40%)', lineHeight: 1.5, margin: '0 0 20px' };
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, color: 'hsl(240, 30%, 20%)', marginBottom: '6px' };
const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '12px',
  fontSize: '16px',
  border: '1px solid hsl(240, 15%, 80%)',
  borderRadius: '8px',
  marginBottom: '14px',
};
const primaryButton = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  padding: '14px',
  fontSize: '16px',
  fontWeight: 600,
  background: 'hsl(280, 70%, 55%)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  textAlign: 'center',
  textDecoration: 'none',
  marginBottom: '12px',
};
const secondaryButton = {
  ...primaryButton,
  background: 'transparent',
  color: 'hsl(280, 70%, 45%)',
  border: '2px solid hsl(280, 70%, 55%)',
};
const textButton = {
  display: 'block',
  width: '100%',
  background: 'none',
  border: 'none',
  color: 'hsl(240, 20%, 40%)',
  fontSize: '14px',
  cursor: 'pointer',
  padding: '8px',
  textAlign: 'center',
};
const messageStyle = { fontSize: '14px', lineHeight: 1.5, color: 'hsl(240, 20%, 30%)', margin: '0 0 16px' };
const errorStyle = { ...messageStyle, color: 'hsl(0, 65%, 40%)' };

export default function LoginPage({ variant = 'connexion' }) {
  const { language } = useLanguage();
  const t = TEXTS[language === 'de' ? 'de' : 'fr'];
  const { session, user, isPremium, loading, signInWithEmail, signOut, refreshPremium } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const attempts = useRef(0);
  const links = getStripeLinks();
  const contact = getContactEmail();

  // Juste apres un paiement, l'abonnement peut mettre quelques secondes a arriver.
  useEffect(() => {
    if (variant !== 'merci' || !session || isPremium) {
      setChecking(false);
      return undefined;
    }
    attempts.current = 0;
    setChecking(true);
    const timer = setInterval(async () => {
      attempts.current += 1;
      const ok = await refreshPremium();
      if (ok || attempts.current >= 10) {
        clearInterval(timer);
        setChecking(false);
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [variant, session, isPremium, refreshPremium]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(clean)) {
      setError(t.invalid);
      return;
    }
    setError('');
    setStatus('sending');
    const { error: signInError } = await signInWithEmail(clean);
    if (signInError) {
      const limited =
        signInError.status === 429 || /rate limit|too many/i.test(signInError.message || '');
      setError(limited ? t.rateLimit : t.failed);
      setStatus('idle');
      return;
    }
    setStatus('sent');
  };

  const title = variant === 'merci' ? t.merciTitle : t.loginTitle;
  const subtitle = variant === 'merci' ? t.merciSubtitle : t.loginSubtitle;

  if (loading) {
    return <div style={pageStyle} />;
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>{title}</h1>

        {!session && (
          <div>
            <p style={subStyle}>{subtitle}</p>
            {status === 'sent' ? (
              <div>
                <p style={messageStyle} role="status">{t.sent}</p>
                <button type="button" style={textButton} onClick={() => setStatus('idle')}>
                  {t.otherAddress}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <label htmlFor="login-email" style={labelStyle}>{t.emailLabel}</label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  style={inputStyle}
                />
                {error && <p style={errorStyle} role="alert">{error}</p>}
                <button type="submit" style={primaryButton} disabled={status === 'sending'}>
                  {status === 'sending' ? t.sending : t.send}
                </button>
              </form>
            )}
          </div>
        )}

        {session && (
          <div>
            <p style={subStyle}>
              {t.connectedAs} {user ? user.email : ''}
            </p>

            {isPremium && (
              <div>
                <p style={messageStyle} role="status">{t.premiumOn}</p>
                <Link to="/" style={primaryButton}>{t.toSituations}</Link>
                {links.portal && (
                  <a href={links.portal} target="_blank" rel="noopener noreferrer" style={secondaryButton}>
                    {t.manage}
                  </a>
                )}
              </div>
            )}

            {!isPremium && checking && <p style={messageStyle} role="status">{t.checking}</p>}

            {!isPremium && !checking && (
              <div>
                <p style={messageStyle}>{t.noPlan}</p>
                <button
                  type="button"
                  style={secondaryButton}
                  onClick={async () => {
                    setChecking(true);
                    await refreshPremium();
                    setChecking(false);
                  }}
                >
                  {t.checkAgain}
                </button>
                <Link to="/" style={primaryButton}>{t.toSituations}</Link>
                {contact && (
                  <p style={messageStyle}>
                    {t.help} <a href={`mailto:${contact}`}>{contact}</a>
                  </p>
                )}
              </div>
            )}

            <button type="button" style={textButton} onClick={signOut}>{t.signOut}</button>
          </div>
        )}
      </div>
    </div>
  );
}
