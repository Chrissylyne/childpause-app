import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '../utils/trackingService.js';

export default function TestLanding() {
  const navigate = useNavigate();

  useEffect(() => {
    trackEvent('landing_view', { language: 'fr' });
  }, []);

  const handleCTA = () => {
    trackEvent('landing_cta_clicked', { cta_position: 'hero' });
    navigate('/test/situations');
  };

  const heroStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '4rem 2rem',
    textAlign: 'center',
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    lineHeight: '1.2',
    marginBottom: '1.5rem',
    color: 'hsl(var(--foreground))',
  };

  const subtitleStyle = {
    fontSize: '1.1rem',
    color: 'hsl(var(--foreground) / 0.8)',
    marginBottom: '2rem',
    lineHeight: '1.6',
  };

  const ctaStyle = {
    backgroundColor: 'hsl(var(--primary))',
    color: 'white',
    padding: '1rem 2rem',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    marginBottom: '2rem',
    transition: 'opacity 0.2s',
  };

  const helperStyle = {
    fontSize: '0.95rem',
    color: 'hsl(var(--foreground) / 0.6)',
    marginTop: '1.5rem',
  };

  const infoSectionStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '4rem auto 0',
    padding: '0 2rem',
  };

  const infoCardStyle = {
    padding: '2rem',
    backgroundColor: 'hsl(var(--background))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '0.5rem',
    textAlign: 'center',
  };

  const cardIconStyle = {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  };

  const cardTitleStyle = {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: 'hsl(var(--foreground))',
  };

  const cardDescStyle = {
    fontSize: '0.95rem',
    color: 'hsl(var(--foreground) / 0.7)',
  };

  return (
    <div>
      <div style={heroStyle}>
        <h1 style={titleStyle}>Quand tu ne sais plus quoi dire à ton enfant.</h1>
        <p style={subtitleStyle}>Une réponse concrète pour maintenant : quoi dire, quoi faire et quoi éviter.</p>
        <button style={ctaStyle} onClick={handleCTA} onMouseEnter={(e) => e.target.style.opacity = '0.9'} onMouseLeave={(e) => e.target.style.opacity = '1'}>
          Mon enfant fait ça maintenant
        </button>
        <p style={helperStyle}>Pas besoin de chercher dans des articles. Choisis la situation qui ressemble à la tienne.</p>
      </div>

      <div style={infoSectionStyle}>
        <div style={infoCardStyle}>
          <div style={cardIconStyle}>🗣️</div>
          <h3 style={cardTitleStyle}>Quoi dire</h3>
          <p style={cardDescStyle}>Une phrase simple, utilisable immédiatement.</p>
        </div>

        <div style={infoCardStyle}>
          <div style={cardIconStyle}>👉</div>
          <h3 style={cardTitleStyle}>Quoi faire</h3>
          <p style={cardDescStyle}>L'action concrète après avoir parlé.</p>
        </div>

        <div style={infoCardStyle}>
          <div style={cardIconStyle}>🚫</div>
          <h3 style={cardTitleStyle}>Quoi éviter</h3>
          <p style={cardDescStyle}>L'erreur fréquente qui aggrave les choses.</p>
        </div>
      </div>
    </div>
  );
}