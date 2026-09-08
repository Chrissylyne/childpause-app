import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSituationById } from '../data/testSituations.js';
import { trackEvent } from '../utils/trackingService.js';
import Paywall from '../components/TestPaywall.jsx';
import PaywallSurvey from '../components/TestPaywallSurvey.jsx';
import AbandonSurvey from '../components/TestAbandonSurvey.jsx';

export default function TestSituation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const situation = getSituationById(id);
  const [viewedSituations, setViewedSituations] = useState(() => {
    const stored = sessionStorage.getItem('viewed_situations');
    return stored ? JSON.parse(stored) : [];
  });
  const [showPaywall, setShowPaywall] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [showAbandonSurvey, setShowAbandonSurvey] = useState(false);

  useEffect(() => {
    if (!situation) {
      navigate('/test/situations');
      return;
    }

    const isNewSituation = !viewedSituations.includes(id);
    const updatedViewed = [...viewedSituations, id];
    const uniqueCount = new Set(updatedViewed).size;

    trackEvent('intervention_viewed', {
      situation_id: id,
      situation_name: situation.title,
      is_new: isNewSituation,
      unique_situations_viewed: uniqueCount,
    });

    sessionStorage.setItem('viewed_situations', JSON.stringify(updatedViewed));
    setViewedSituations(updatedViewed);

    if (uniqueCount >= 2 && !showPaywall) {
      setTimeout(() => {
        setShowPaywall(true);
        trackEvent('paywall_viewed', {
          trigger: 'second_unique_situation',
          situation_id: id,
          unique_count: uniqueCount,
        });
      }, 2000);
    }
  }, [id, situation, navigate]);

  if (!situation) {
    return <div>Situation non trouvée.</div>;
  }

  const handleNextSituation = () => {
    trackEvent('next_situation_clicked', { from_situation: id });
    navigate('/test/situations');
  };

  const handlePaywallCTA = () => {
    trackEvent('paywall_cta_clicked', { situation_id: id });
    setShowPaywall(false);
    setShowThankYou(true);
    setTimeout(() => {
      setShowThankYou(false);
      setShowSurvey(true);
    }, 2000);
  };

  const handlePaywallDismiss = () => {
    trackEvent('paywall_dismissed', { situation_id: id });
    setShowPaywall(false);
    setShowAbandonSurvey(true);  // ← NOUVEAU
  };

  const handleSurveySubmit = (answer) => {
    trackEvent('survey_response', {
      answer,
      paywall_action: 'clicked',
      situation_id: id,
    });
    setShowSurvey(false);
  };
const [showAbandonSurvey, setShowAbandonSurvey] = useState(false);
  const containerStyle = {
    maxWidth: '768px',
    margin: '0 auto',
    padding: '2rem',
  };

const handleAbandonSurveySubmit = (reason) => {
  trackEvent('abandon_reason', {
    situation_id: id,
    reason: reason,
  });
  setShowAbandonSurvey(false);
};
  const headerStyle = {
    marginBottom: '3rem',
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'hsl(var(--foreground))',
    marginBottom: '0.5rem',
  };

  const subtitleStyle = {
    fontSize: '1rem',
    color: 'hsl(var(--foreground) / 0.7)',
  };

  const sectionStyle = {
    marginBottom: '2.5rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid hsl(var(--border))',
  };

  const sectionTitleStyle = {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: 'hsl(var(--foreground))',
  };

  const phraseStyle = {
    fontSize: '1rem',
    fontStyle: 'italic',
    backgroundColor: 'hsl(var(--accent) / 0.2)',
    padding: '1rem',
    borderRadius: '0.5rem',
    color: 'hsl(var(--foreground))',
    lineHeight: '1.6',
  };

  const textStyle = {
    fontSize: '0.95rem',
    color: 'hsl(var(--foreground) / 0.8)',
    lineHeight: '1.6',
  };

  const objectiveStyle = {
    backgroundColor: 'hsl(var(--primary) / 0.1)',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    marginBottom: '2rem',
    borderLeft: '4px solid hsl(var(--primary))',
  };

  const objectiveTitleStyle = {
    fontSize: '0.95rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: 'hsl(var(--primary))',
  };

  const objectiveTextStyle = {
    fontSize: '0.95rem',
    color: 'hsl(var(--foreground))',
    lineHeight: '1.6',
  };

  const whyStyle = {
    backgroundColor: 'hsl(var(--background))',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    marginTop: '2rem',
    border: '1px solid hsl(var(--border))',
  };

  const whyTitleStyle = {
    fontSize: '0.95rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
    color: 'hsl(var(--foreground))',
  };

  const whyTextStyle = {
    fontSize: '0.9rem',
    color: 'hsl(var(--foreground) / 0.8)',
    lineHeight: '1.6',
  };

  const footerStyle = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '3rem',
  };

  const buttonStyle = {
    backgroundColor: 'hsl(var(--primary))',
    color: 'white',
    padding: '0.75rem 1.5rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  };

  const backLinkStyle = {
    color: 'hsl(var(--primary))',
    textDecoration: 'none',
    fontSize: '0.95rem',
    alignSelf: 'center',
  };

  const thankYouStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    textAlign: 'center',
    zIndex: 100,
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>{situation.title}</h2>
        <p style={subtitleStyle}>{situation.subtitle}</p>
      </div>

      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>🗣️ DIS</h3>
        <p style={phraseStyle}>{situation.content.dis}</p>
      </div>

      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>👉 FAIS MAINTENANT</h3>
        <p style={textStyle}>{situation.content.fais}</p>
      </div>

      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>🚫 ÉVITE</h3>
        <p style={textStyle}>{situation.content.evite}</p>
      </div>

      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>🔥 S'IL CONTINUE</h3>
        <p style={textStyle}>{situation.content.siContinue}</p>
      </div>

      <div style={objectiveStyle}>
        <h4 style={objectiveTitleStyle}>⏱️ TON OBJECTIF MAINTENANT</h4>
        <p style={objectiveTextStyle}>{situation.content.objectif}</p>
      </div>

      <div style={whyStyle}>
        <h4 style={whyTitleStyle}>💭 POURQUOI ÇA PEUT AIDER</h4>
        <p style={whyTextStyle}>{situation.content.pourquoi}</p>
      </div>

      {showThankYou && (
        <div style={thankYouStyle}>
          <p>En phase de test. Merci de ton intérêt !</p>
        </div>
      )}

      {showPaywall && <Paywall onCTA={handlePaywallCTA} onDismiss={handlePaywallDismiss} situationId={id} />}

      {showSurvey && <PaywallSurvey onSubmit={handleSurveySubmit} />}
      {showAbandonSurvey && <AbandonSurvey onSubmit={handleAbandonSurveySubmit} />}

      {!showPaywall && !showThankYou && !showSurvey && (
        <div style={footerStyle}>
          <button style={buttonStyle} onClick={handleNextSituation} onMouseEnter={(e) => e.target.style.opacity = '0.9'} onMouseLeave={(e) => e.target.style.opacity = '1'}>
            Voir une autre situation
          </button>
          <a href="/test" style={backLinkStyle}>← Retour</a>
        </div>
      )}
    </div>
  );
}