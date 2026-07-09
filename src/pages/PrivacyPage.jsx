import React from 'react';
import { useTranslations } from '../i18n/useTranslations.js';

function PrivacyPage() {
  const { t } = useTranslations();

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>{t('privacy.title')}</h1>
      
      <div style={{ fontSize: '1rem', lineHeight: '1.8', color: '#333' }}>
        <p>{t('privacy.p1')}</p>
        <p>{t('privacy.p2')}</p>
        <p>{t('privacy.p3')}</p>
        <p>{t('privacy.p4')}</p>
        
        <p style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #ddd' }}>
          Pour toute question : <a href="mailto:contact@childpause.online" style={{ color: '#007bff', textDecoration: 'none' }}>contact@childpause.online</a>
        </p>
      </div>
    </div>
  );
}

export default PrivacyPage;
