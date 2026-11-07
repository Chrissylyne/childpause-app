import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { CONSENT_REOPEN_EVENT, enableAnalytics, getConsent, setConsent } from '../utils/consent';

// Chaque langue est ecrite pour elle-meme, pas traduite de l'autre.
const TEXTS = {
  fr: {
    text: "Nous aimerions mesurer l'audience du site avec Google Analytics pour l'améliorer. Rien n'est envoyé à Google tant que tu n'as pas choisi.",
    more: 'En savoir plus',
    accept: 'Accepter',
    decline: 'Refuser',
    label: 'Mesure d’audience',
  },
  de: {
    text: 'Wir würden gern mit Google Analytics messen, wie die Seite genutzt wird, um sie zu verbessern. Solange du nichts ausgewählt hast, wird nichts an Google gesendet.',
    more: 'Mehr erfahren',
    accept: 'Akzeptieren',
    decline: 'Ablehnen',
    label: 'Reichweitenmessung',
  },
};

const buttonStyle = {
  flex: '1 1 140px',
  padding: '12px 16px',
  fontSize: '15px',
  fontWeight: 600,
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  color: 'white',
};

export default function CookieConsent() {
  const { language } = useLanguage();
  const t = TEXTS[language === 'de' ? 'de' : 'fr'];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = getConsent();
    if (stored === 'granted') enableAnalytics();
    if (stored === null) setVisible(true);

    const reopen = () => setVisible(true);
    window.addEventListener(CONSENT_REOPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_REOPEN_EVENT, reopen);
  }, []);

  if (!visible) return null;

  const choose = (value) => {
    setConsent(value);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label={t.label}
      style={{
        position: 'fixed',
        left: '16px',
        right: '16px',
        bottom: '16px',
        zIndex: 1000,
        maxWidth: '560px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <p style={{ margin: '0 0 12px', fontSize: '14px', lineHeight: 1.5, color: 'hsl(240, 20%, 25%)' }}>
        {t.text}{' '}
        <Link to="/privacy" style={{ color: 'hsl(280, 70%, 45%)' }}>{t.more}</Link>
      </p>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button type="button" onClick={() => choose('granted')} style={{ ...buttonStyle, background: 'hsl(280, 70%, 55%)' }}>
          {t.accept}
        </button>
        <button type="button" onClick={() => choose('denied')} style={{ ...buttonStyle, background: 'hsl(240, 15%, 35%)' }}>
          {t.decline}
        </button>
      </div>
    </div>
  );
}
