import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { trackEvent } from '../utils/trackingService';
import { useAuth } from '../contexts/AuthContext';
import { getStripeLinks, withEmail } from '../lib/stripeLinks';

// Chaque langue est ecrite pour elle-meme, pas traduite de l'autre.
const TEXTS = {
  fr: {
    soft: {
      title: 'Tu as déjà découvert deux situations.',
      subtitle: 'Les autres moments difficiles du quotidien sont dans ChildPause Premium.',
    },
    locked: {
      title: 'Cette situation fait partie de ChildPause Premium.',
      subtitle: 'Premium débloque les situations les plus difficiles du quotidien.',
    },
    annual: '49 € par an. Économisez plus de 40 %.',
    monthly: '6,99 € par mois',
    reassurance: 'Pas de frais cachés. Résiliable à tout moment.',
    later: 'Pas maintenant',
    alreadyMember: 'Déjà abonné ? Se connecter',
    soon: "L'abonnement ouvre très bientôt.",
    surveyTitle: "Qu'est-ce qui te retient ?",
    skip: 'Passer',
    reasons: [
      ['chatgpt', 'Je peux demander ça à ChatGPT'],
      ['price', "C'est trop cher pour le moment"],
      ['not_convinced', 'Je ne suis pas encore convaincu(e)'],
      ['later', 'Je reviendrai plus tard'],
      ['other', 'Autre'],
    ],
  },
  de: {
    soft: {
      title: 'Zwei Situationen hast du dir schon angesehen.',
      subtitle: 'Für alle weiteren schwierigen Momente gibt es ChildPause Premium.',
    },
    locked: {
      title: 'Diese Situation gehört zu ChildPause Premium.',
      subtitle: 'Premium schaltet die schwierigsten Momente im Alltag frei.',
    },
    annual: '49 € im Jahr. Du sparst über 40 %.',
    monthly: '6,99 € im Monat',
    reassurance: 'Keine versteckten Kosten. Jederzeit kündbar.',
    later: 'Jetzt nicht',
    alreadyMember: 'Schon Abonnent? Anmelden',
    soon: 'Das Abonnement startet in Kürze.',
    surveyTitle: 'Was hält dich gerade noch zurück?',
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
  textAlign: 'center',
  textDecoration: 'none',
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

export default function Paywall({ language = 'fr', source = 'soft', onClose }) {
  const lang = language === 'de' ? 'de' : 'fr';
  const t = TEXTS[lang];
  const head = source === 'locked' ? t.locked : t.soft;
  const { user } = useAuth();
  const links = getStripeLinks();
  const paymentsReady = Boolean(links.monthly && links.annual);
  const email = user ? user.email : '';
  const [step, setStep] = useState('offer');

  useEffect(() => {
    trackEvent('paywall_viewed', { language: lang, source });
  }, []);

  const handleCta = (plan) => {
    trackEvent('paywall_cta_clicked', { plan, language: lang, source });
  };

  const handleDismiss = () => {
    trackEvent('paywall_dismissed', { language: lang, source });
    setStep('survey');
  };

  const handleReason = (code) => {
    trackEvent('abandon_reason', { reason: code, language: lang, source });
    onClose();
  };

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true">
      <div style={drawerStyle}>
        {step === 'offer' ? (
          <div>
            <h2 style={titleStyle}>{head.title}</h2>
            <p style={subStyle}>{head.subtitle}</p>

            {paymentsReady ? (
              <div>
                <a
                  href={withEmail(links.annual, email)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={planStyle(true)}
                  onClick={() => handleCta('annual')}
                >
                  {t.annual}
                </a>
                <a
                  href={withEmail(links.monthly, email)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={planStyle(false)}
                  onClick={() => handleCta('monthly')}
                >
                  {t.monthly}
                </a>
                <p style={noteStyle}>{t.reassurance}</p>
              </div>
            ) : (
              <p style={{ ...noteStyle, fontWeight: 600 }}>{t.soon}</p>
            )}

            <button type="button" style={ghostStyle} onClick={handleDismiss}>
              {t.later}
            </button>
            <Link to="/connexion" style={{ ...ghostStyle, fontSize: '0.9rem' }}>
              {t.alreadyMember}
            </Link>
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
