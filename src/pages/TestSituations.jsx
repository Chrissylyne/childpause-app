import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TEST_SITUATIONS } from '../data/testSituations.js';
import { trackEvent } from '../utils/trackingService.js';

export default function TestSituations() {
  const navigate = useNavigate();

  useEffect(() => {
    trackEvent('situations_page_viewed', { total_situations: TEST_SITUATIONS.length });
  }, []);

  const handleSituationClick = (situationId, situationName) => {
    trackEvent('situation_selected', { situation_id: situationId, situation_name: situationName });
    navigate(`/test/situation/${situationId}`);
  };

  const pageStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '3rem',
  };

  const headerTitleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'hsl(var(--foreground))',
    marginBottom: '0.5rem',
  };

  const headerSubStyle = {
    fontSize: '1rem',
    color: 'hsl(var(--foreground) / 0.7)',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  };

  const cardStyle = {
    padding: '2rem',
    backgroundColor: 'hsl(var(--background))',
    border: '2px solid hsl(var(--border))',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
    position: 'relative',
    textDecoration: 'none',
  };

  const emojiStyle = {
    fontSize: '3rem',
    marginBottom: '1rem',
  };

  const cardTitleStyle = {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'hsl(var(--foreground))',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const cardSubStyle = {
    fontSize: '0.95rem',
    color: 'hsl(var(--foreground) / 0.7)',
  };

  const badgeStyle = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    fontSize: '1.2rem',
  };

  const footerStyle = {
    textAlign: 'center',
  };

  const backLinkStyle = {
    color: 'hsl(var(--primary))',
    textDecoration: 'none',
    fontSize: '0.95rem',
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h2 style={headerTitleStyle}>Qu'est-ce qui se passe maintenant ?</h2>
        <p style={headerSubStyle}>Choisis la situation et reçois une réponse immédiate.</p>
      </div>

      <div style={gridStyle}>
        {TEST_SITUATIONS.map((situation) => (
          <button
            key={situation.id}
            style={cardStyle}
            onClick={() => handleSituationClick(situation.id, situation.title)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'hsl(var(--primary))';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'hsl(var(--border))';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {!situation.free && <span style={badgeStyle}>🔒</span>}
            <div style={emojiStyle}>{situation.emoji}</div>
            <h3 style={cardTitleStyle}>{situation.title}</h3>
            <p style={cardSubStyle}>{situation.subtitle}</p>
          </button>
        ))}
      </div>

      <div style={footerStyle}>
        <a href="/test" style={backLinkStyle}>← Retour</a>
      </div>
    </div>
  );
}