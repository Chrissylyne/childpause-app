import React, { useEffect, useState } from 'react';
import { trackEvent } from '../utils/trackingService';

const LINKS = {
  monthly: 'https://buy.stripe.com/fZufZagqi8i1ebz0u47AI02',
  annual: 'https://buy.stripe.com/5kQ7sEb5Y8i1c3r7Ww7AI03',
};

const TEXTS = {
  fr: {
    title: 'Tu viens d’utiliser 2 réponses ChildPause.',
    subtitle: 'Il y en a davantage pour les moments difficiles du quotidien.',
    badge: 'Le choix des parents',
    annual: 'Annuel : 49 €/an',
    annualNote: 'Économisez 40 %',
    monthly: 'Mensuel : 6,99 €/mois',
    reassurance: 'Pas de frais cachés. Annulable à tout moment.',
    later: 'Pas maintenant',
    surveyTitle: 'Qu’est-ce qui t’a fait hésiter ?',
    skip: 'Passer',
    reasons: [
      ['chatgpt', 'Je peux demander ça à ChatGPT'],
      ['price', 'Trop cher pour maintenant'],
      ['not_convinced', 'Je ne suis pas encore convaincu(e)'],
      ['later', 'Je reviendrai plus tard'],
      ['other', 'Autre'],
    ],
  },
  de: {
    title: 'Du hast gerade 2 ChildPause-Antworten genutzt.',
    subtitle: 'Für die schwierigen Momente im Alltag gibt es noch mehr.',
    badge: 'Die Wahl der Eltern',
    annual: 'Jährlich: 49 €/Jahr',
    annualNote: '40 % sparen',
    monthly: 'Monatlich: 6,99 €/Monat',
    reassurance: 'Keine versteckten Kosten. Jederzeit kündbar.',
    later: 'Jetzt nicht',
    surveyTitle: 'Was hat dich zögern lassen?',
    skip: 'Überspringen',
    reasons: [
      ['chatgpt', 'Das kann ich auch ChatGPT fragen'],
      ['price', 'Gerade zu teuer'],
      ['not_convinced', 'Ich bin noch nicht überzeugt'],
      ['later', 'Ich komme später wieder'],
      ['other', 'Etwas anderes'],
    ],
  },
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  zIndex: 50,
};

const drawerStyle = {
  background: '#fffaf2',
  width: '100%',
  maxWidth: '480px',
  borderRadius: '1.5rem 1.5rem 0 0',
  padding: '1.75rem 1.5rem 2rem',
  maxHeight: '90vh',
  overflowY: 'auto',
  color: '#3b1d12',
  boxSizing: 'border-box',
};

const titleStyle = { fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem' };
const subStyle = { margin: '0 0 1.25rem', color: '#6b4a3a', lineHeight: 1.45 };
const badgeStyle = {
  display: 'inline-block',
  background: '#f3d9c9',
  color: '#8a3a1a',
  fontSize: '0.8rem',
  fontWeight: 700,
  padding: '0.2rem 0.6rem',
  borderRadius: '999px',
  marginBottom: '0.5rem',
};
const noteStyle = { textAlign: 'center', color: '#6b4a3a', fontSize: '0.9rem', margin: '0.25rem 0 1rem' };
const ghostStyle = {
  display: 'block',
  width: '100%',
  background: 'none',
  border: 'none',
  color: '#6b4a3a',
  fontSize: '0.95rem',
  cursor: 'pointer',
  padding: '0.5rem',
};

const planStyle = (primary) => ({
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  textAlign: 'center',
  padding: '0.9rem 1rem',
  marginBottom: '0.75rem',
  borderRadius: '0.75rem',
  fontWeight: 700,
  fontSize: '1rem',
  textDecoration: 'none',
  cursor: 'pointer',
  border: primary ? 'none' : '2px solid #c4552d',
  background: primary ? '#c4552d' : 'transparent',
  color: primary ? '#ffffff' : '#c4552d',
});

const reasonStyle = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  textAlign: 'left',
  padding: '0.85rem 1rem',
  marginBottom: '0.6rem',
  borderRadius: '0.75rem',
  border: '1px solid #e3cdbf',
  background: '#ffffff',
  color: '#3b1d12',
  fontSize: '1rem',
  cursor: 'pointer',
};

export default function Paywall({ language = 'fr', onClose }) {
  const lang = language === 'de' ? 'de' : 'fr';
  const t = TEXTS[lang];
  const [step, setStep] = useState('offer');

  useEffect(() => {
    trackEvent('paywall_viewed', { language: lang });
  }, []);

  const handleCta = (plan) => {
    trackEvent('paywall_cta_clicked', { plan, language: lang });
  };

  const handleDismiss = () => {
    trackEvent('paywall_dismissed', { language: lang });
    setStep('survey');
  };

  const handleReason = (code) => {
    trackEvent('abandon_reason', { reason: code, language: lang });
    onClose();
  };

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true">
      <div style={drawerStyle}>
        {step === 'offer' ? (
          <div>
            <h2 style={titleStyle}>{t.title}</h2>
            <p style={subStyle}>{t.subtitle}</p>
            <div style={badgeStyle}>{t.badge}</div>
            <a
              href={LINKS.annual}
              target="_blank"
              rel="noopener noreferrer"
              style={planStyle(true)}
              onClick={() => handleCta('annual')}
            >
              {t.annual} ({t.annualNote})
            </a>
            <a
              href={LINKS.monthly}
              target="_blank"
              rel="noopener noreferrer"
              style={planStyle(false)}
              onClick={() => handleCta('monthly')}
            >
              {t.monthly}
            </a>
            <p style={noteStyle}>{t.reassurance}</p>
            <button type="button" style={ghostStyle} onClick={handleDismiss}>
              {t.later}
            </button>
          </div>
        ) : (
          <div>
            <h2 style={titleStyle}>{t.surveyTitle}</h2>
            {t.reasons.map(([code, label]) => (
              <button key={code} type="button" style={reasonStyle} onClick={() => handleReason(code)}>
                {label}
              </button>
            ))}
            <button type="button" style={ghostStyle} onClick={() => handleReason('skipped')}>
              {t.skip}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}