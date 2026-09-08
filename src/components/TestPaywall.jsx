import React from 'react';

export default function Paywall({ onCTA, onDismiss, situationId }) {
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'flex-end',
    zIndex: 50,
  };

  const drawerStyle = {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: '100%',
    borderRadius: '1.5rem 1.5rem 0 0',
    padding: '2rem',
    animation: 'slideUp 0.3s ease-out',
    maxHeight: '90vh',
    overflowY: 'auto',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
  };

  const titleStyle = {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: 'hsl(var(--foreground))',
    marginBottom: '0.5rem',
  };

  const closeStyle = {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: 'hsl(var(--foreground))',
  };

  const subtitleStyle = {
    fontSize: '0.95rem',
    color: 'hsl(var(--foreground) / 0.7)',
    marginBottom: '1.5rem',
    lineHeight: '1.6',
  };

  const featuresStyle = {
    display: 'grid',
    gap: '1rem',
    marginBottom: '2rem',
  };

  const featureStyle = {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'flex-start',
  };

  const featureIconStyle = {
    fontSize: '1.2rem',
    flexShrink: 0,
  };

  const featureTextStyle = {
    fontSize: '0.95rem',
    color: 'hsl(var(--foreground))',
  };

  const pricingStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1.5rem',
  };

  const priceBoxStyle = {
    padding: '1.5rem',
    border: '2px solid hsl(var(--border))',
    borderRadius: '0.75rem',
    textAlign: 'center',
  };

  const priceStyle = {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: 'hsl(var(--primary))',
    marginBottom: '0.25rem',
  };

  const priceSubStyle = {
    fontSize: '0.85rem',
    color: 'hsl(var(--foreground) / 0.6)',
  };

  const ctaStyle = {
    width: '100%',
    backgroundColor: 'hsl(var(--primary))',
    color: 'white',
    padding: '1rem',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    marginBottom: '1rem',
    transition: 'opacity 0.2s',
  };

  const disclaimerStyle = {
    fontSize: '0.8rem',
    color: 'hsl(var(--foreground) / 0.6)',
    textAlign: 'center',
    marginBottom: '1rem',
  };

  return (
    <div style={overlayStyle}>
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
      <div style={drawerStyle}>
        <div style={headerStyle}>
          <h3 style={titleStyle}>Débloquer ChildPause</h3>
          <button style={closeStyle} onClick={onDismiss}>✕</button>
        </div>

        <p style={subtitleStyle}>Tu viens d'utiliser ChildPause pour 2 situations. Ça t'a aidé ?</p>

        <p style={subtitleStyle}>Débloquer l'accès complet pour avoir une réponse prête quand tu en as besoin.</p>

        <div style={featuresStyle}>
          <div style={featureStyle}>
            <span style={featureIconStyle}>📱</span>
            <span style={featureTextStyle}>97 situations prêtes à utiliser</span>
          </div>
          <div style={featureStyle}>
            <span style={featureIconStyle}>🇫🇷</span>
            <span style={featureTextStyle}>Français + Allemand</span>
          </div>
          <div style={featureStyle}>
            <span style={featureIconStyle}>⚡</span>
            <span style={featureTextStyle}>Réponses immédiatement utilisables</span>
          </div>
        </div>

        <div style={pricingStyle}>
          <div style={priceBoxStyle}>
            <div style={priceStyle}>6,99 €</div>
            <div style={priceSubStyle}>/mois</div>
          </div>
          <div style={priceBoxStyle}>
            <div style={priceStyle}>49 €</div>
            <div style={priceSubStyle}>/an</div>
          </div>
        </div>

        <button style={ctaStyle} onClick={onCTA} onMouseEnter={(e) => e.target.style.opacity = '0.9'} onMouseLeave={(e) => e.target.style.opacity = '1'}>
          Débloquer ChildPause
        </button>

        <p style={disclaimerStyle}>Annulable à tout moment. Pas de frais cachés.</p>
      </div>
    </div>
  );
}