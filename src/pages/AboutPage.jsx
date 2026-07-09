import React from 'react';
import { useTranslations } from '../i18n/useTranslations.js';

function AboutPage() {
  const { t } = useTranslations();

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{t('about.title')}</h1>
      
      <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#333' }}>
        <p>{t('about.p1')}</p>
        <p>{t('about.p2')}</p>
        <p>{t('about.p3')}</p>
        <p>{t('about.p4')}</p>
        <p>{t('about.p5')}</p>
        <p>{t('about.p6')}</p>
        <p><strong>{t('about.p7')}</strong></p>
        
        <p style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #ddd' }}>
          {t('about.contact')} <a href="mailto:contact@childpause.online" style={{ color: '#007bff', textDecoration: 'none' }}>contact@childpause.online</a>
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
