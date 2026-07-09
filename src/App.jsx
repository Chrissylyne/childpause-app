import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext.jsx';
import { useTranslations } from './i18n/useTranslations.js';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import PremiumPage from './pages/PremiumPage.jsx';
import EmergencyPage from './pages/EmergencyPage.jsx';

function Navigation() {
  const { t } = useTranslations();
  const { language, setLanguage } = useLanguage();

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid hsl(var(--border))', marginBottom: '2rem', backgroundColor: 'hsl(var(--background))' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: '1.2rem', fontWeight: 'bold', textDecoration: 'none', color: 'hsl(var(--foreground))' }}>
            ChildPause
          </Link>
          <Link to="/about" style={{ textDecoration: 'none', color: 'hsl(var(--primary))' }}>{t('nav.about')}</Link>
          <Link to="/premium" style={{ textDecoration: 'none', color: 'hsl(var(--primary))' }}>{t('nav.premium')}</Link>
          <Link to="/terms" style={{ textDecoration: 'none', color: 'hsl(var(--primary))' }}>{t('nav.terms')}</Link>
          <Link to="/privacy" style={{ textDecoration: 'none', color: 'hsl(var(--primary))' }}>{t('nav.privacy')}</Link>
        </div>
        
      {/* Boutons FR/DE coulissants */}
<div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'hsl(var(--accent))', padding: '0.25rem', borderRadius: '2rem', position: 'relative' }}>
  <button
    onClick={() => setLanguage('fr')}
    style={{
      padding: '0.5rem 1rem',
      backgroundColor: language === 'fr' ? 'hsl(var(--primary))' : 'transparent',
      color: language === 'fr' ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
      border: 'none',
      borderRadius: '1.5rem',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '0.9rem',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: language === 'fr' ? 2 : 1
    }}
  >
    FR
  </button>
  <button
    onClick={() => setLanguage('de')}
    style={{
      padding: '0.5rem 1rem',
      backgroundColor: language === 'de' ? 'hsl(var(--primary))' : 'transparent',
      color: language === 'de' ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
      border: 'none',
      borderRadius: '1.5rem',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '0.9rem',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: language === 'de' ? 2 : 1
    }}
  >
    DE
  </button>
</div>
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
        <Route path="/emergency" element={<EmergencyPage />} />
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
