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
      
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: '2rem'
      }}>
        <button style={{
          padding: '1rem 2rem',
          fontSize: '1rem',
          backgroundColor: '#9333ea',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          {t('premium.btnMonthly')}
        </button>
        <button style={{
          padding: '1rem 2rem',
          fontSize: '1rem',
          backgroundColor: '#0070BA',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          {t('premium.btnAnnual')}
        </button>
      </div>
    </div>
  );
}

export default PremiumPage;
