import React from 'react';
import { useTranslations } from '../i18n/useTranslations.js';
import { useLanguage } from '../contexts/LanguageContext';
import { openConsentSettings } from '../utils/consent';

function PrivacyPage() {
  const { t } = useTranslations();
  const { language } = useLanguage();

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>{t('privacy.title')}</h1>

      <div style={{ fontSize: '1rem', lineHeight: '1.8', color: '#333' }}>
        <p>{t('privacy.p1')}</p>
        <p>{t('privacy.p2')}</p>
        <p>{t('privacy.p3')}</p>
        <p>{t('privacy.p4')}</p>

        <h2 style={{ fontSize: '1.3rem', margin: '2rem 0 0.5rem' }}>{t('privacy.analyticsTitle')}</h2>
        <p>{t('privacy.p5')}</p>
        <button
          type="button"
          onClick={openConsentSettings}
          style={{
            padding: '10px 16px',
            fontSize: '0.95rem',
            fontWeight: 600,
            borderRadius: '8px',
            border: '2px solid hsl(var(--primary))',
            background: 'transparent',
            color: 'hsl(var(--primary))',
            cursor: 'pointer',
          }}
        >
          {t('privacy.consentButton')}
        </button>

        <h2 style={{ fontSize: '1.3rem', margin: '2rem 0 0.5rem' }}>{t('privacy.contactTitle')}</h2>
        <p>{t('privacy.p7')}</p>

        <h2 style={{ fontSize: '1.3rem', margin: '2rem 0 0.5rem' }}>{t('privacy.storageTitle')}</h2>
        <p>{t('privacy.p6')}</p>

        <p style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #ddd' }}>
          {language === 'fr' ? 'Pour toute question' : 'Bei Fragen'} : <a href="mailto:contact@childpause.online" style={{ color: '#007bff', textDecoration: 'none' }}>contact@childpause.online</a>
        </p>
      </div>
    </div>
  );
}

export default PrivacyPage;
