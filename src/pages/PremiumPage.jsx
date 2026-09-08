import React from 'react';
import { useTranslations } from '../i18n/useTranslations.js';

function PremiumPage() {
  const { t } = useTranslations();
  return (
    <div style={{ minHeight: '100vh', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>{t('premium.title')}</h1>
      <p style={{ fontSize: '1.2rem', textAlign: 'center', color: '#666', marginBottom: '2rem' }}>{t('premium.subtitle')}</p>
      
      <div style={{ fontSize: '1rem', lineHeight: '1.8', color: '#333', marginBottom: '2rem' }}>
        <p>{t('premium.p1')}</p>
        
        <h2 style={{ fontSize: '1.3rem', marginTop: '1.5rem', marginBottom: '1rem' }}>{t('premium.whatYouGet')}</h2>
        <ul style={{ marginLeft: '1.5rem' }}>
          <li>{t('premium.li1')}</li>
          <li>{t('premium.li2')}</li>
          <li>{t('premium.li3')}</li>
        </ul>
        
        <p style={{ marginTop: '1.5rem' }}>{t('premium.p2')}</p>
        <p>{t('premium.p3')}</p>
      </div>

      {/* SOCIAL PROOF - TÉMOIGNAGE */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'hsl(16, 80%, 90%)',
        borderRadius: '0.5rem',
        borderLeft: '4px solid hsl(var(--primary))',
        marginBottom: '2rem',
        textAlign: 'center',
        fontStyle: 'italic'
      }}>
        <p style={{
          margin: '0 0 0.75rem 0',
          color: 'hsl(var(--foreground))',
          fontSize: '1rem',
          lineHeight: '1.6'
        }}>
          "{t('premium.socialProof')}"
        </p>
        <p style={{
          margin: '0',
          color: 'hsl(var(--foreground) / 0.8)',
          fontWeight: 'bold',
          fontSize: '0.9rem',
          fontStyle: 'normal'
        }}>
          — {t('premium.socialProofAuthor')}
        </p>
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: '2rem'
      }}>
        {/* BOUTON MENSUEL */}
        <a 
          href="https://buy.stripe.com/fZufZagqi8i1ebz0u47AI02"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '1rem 2rem',
            fontSize: '1rem',
            backgroundColor: '#9333ea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          {t('premium.btnMonthly')}
        </a>

        {/* BOUTON ANNUEL AVEC BADGE */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            backgroundColor: 'hsl(var(--primary))',
            color: 'white',
            borderRadius: '0.25rem',
            fontSize: '0.85rem',
            fontWeight: 'bold'
          }}>
            ⭐ {t('premium.badgePopular')}
          </div>
          <a 
            href="https://buy.stripe.com/5kQ7sEb5Y8i1c3r7Ww7AI03"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '1rem 2rem',
              fontSize: '1rem',
              backgroundColor: '#0070BA',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            {t('premium.btnAnnual')}
          </a>
        </div>
      </div>

      {/* TEXTE RASSURANT */}
      <div style={{
        marginTop: '2rem',
        textAlign: 'center',
        color: 'hsl(var(--foreground) / 0.6)',
        fontSize: '0.9rem'
      }}>
        <p style={{ margin: '0' }}>
          {t('premium.p3')}
        </p>
      </div>
    </div>
  );
}

export default PremiumPage;
