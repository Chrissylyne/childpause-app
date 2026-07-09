import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext.jsx';
import { useTranslations } from './i18n/useTranslations.js';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import PremiumPage from './pages/PremiumPage.jsx';

function Navigation() {
  const { t } = useTranslations();
  const { language, toggleLanguage } = useLanguage();

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd', marginBottom: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <Link to="/" style={{ fontSize: '1.2rem', fontWeight: 'bold', textDecoration: 'none', color: '#000' }}>ChildPause</Link>
          <Link to="/about" style={{ textDecoration: 'none', color: '#007bff' }}>{t('nav.about')}</Link>
          <Link to="/premium" style={{ textDecoration: 'none', color: '#007bff' }}>{t('nav.premium')}</Link>
          <Link to="/terms" style={{ textDecoration: 'none', color: '#007bff' }}>{t('nav.terms')}</Link>
          <Link to="/privacy" style={{ textDecoration: 'none', color: '#007bff' }}>{t('nav.privacy')}</Link>
        </div>
        
        <button
          onClick={toggleLanguage}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {language === 'fr' ? 'DE' : 'FR'}
        </button>
      </div>
    </nav>
  );
}

function AppContent() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/premium" element={<PremiumPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppContent />
      </Router>
    </LanguageProvider>
  );
}

export default App;
