import PWAInstallPrompt from './components/PWAInstallPrompt';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { useTranslations } from './i18n/useTranslations.js';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import PremiumPage from './pages/PremiumPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import LibraryPage from './pages/LibraryPage.jsx';
import EmergencyPage from './pages/EmergencyPage.jsx';
import TestLanding from './pages/TestLanding.jsx';
import TestSituations from './pages/TestSituations.jsx';
import TestSituation from './pages/TestSituation.jsx';

function Navigation() {
  const { t } = useTranslations();
  const { language, setLanguage } = useLanguage();
  const { session } = useAuth();
  const accountLabel = session
    ? (language === 'fr' ? 'Mon compte' : 'Mein Konto')
    : (language === 'fr' ? 'Connexion' : 'Anmelden');
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid hsl(var(--border))', marginBottom: '2rem', backgroundColor: 'hsl(var(--background))' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Link to="/" style={{ fontSize: '1.2rem', fontWeight: 'bold', textDecoration: 'none', color: 'hsl(var(--foreground))' }}>
          ChildPause
        </Link>
        <div className="nav-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/about" style={{ textDecoration: 'none', color: 'hsl(var(--primary))' }}>{t('nav.about')}</Link>
          <Link to="/premium" style={{ textDecoration: 'none', color: 'hsl(var(--primary))' }}>{t('nav.premium')}</Link>
          <Link to="/terms" style={{ textDecoration: 'none', color: 'hsl(var(--primary))' }}>{t('nav.terms')}</Link>
          <Link to="/privacy" style={{ textDecoration: 'none', color: 'hsl(var(--primary))' }}>{t('nav.privacy')}</Link>
          <Link to="/connexion" style={{ textDecoration: 'none', color: 'hsl(var(--primary))' }}>{accountLabel}</Link>
        </div>
        <div style={{ display: 'inline-flex', gap: '0rem', backgroundColor: 'hsl(var(--accent))', padding: '0.25rem', borderRadius: '2rem', position: 'relative', overflow: 'hidden' }}>
          <button onClick={() => setLanguage('fr')} style={{ backgroundColor: language === 'fr' ? 'hsl(var(--primary))' : 'transparent', color: language === 'fr' ? 'white' : 'hsl(var(--foreground))', padding: '0.25rem 0.75rem', border: 'none', borderRadius: '2rem', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>FR</button>
          <button onClick={() => setLanguage('de')} style={{ backgroundColor: language === 'de' ? 'hsl(var(--primary))' : 'transparent', color: language === 'de' ? 'white' : 'hsl(var(--foreground))', padding: '0.25rem 0.75rem', border: 'none', borderRadius: '2rem', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>DE</button>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
        <PWAInstallPrompt />
        <Navigation />
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="/terms" element={<TermsPage />} />
  <Route path="/privacy" element={<PrivacyPage />} />
  <Route path="/premium" element={<PremiumPage />} />
  <Route path="/emergency" element={<EmergencyPage />} />
  <Route path="/bibliotheque" element={<LibraryPage />} />
  <Route path="/merci" element={<LoginPage variant="merci" />} />
  <Route path="/connexion" element={<LoginPage variant="connexion" />} />
  
  {/* V1 TEST ROUTES */}
  <Route path="/test" element={<TestLanding />} />
  <Route path="/test/situations" element={<TestSituations />} />
  <Route path="/test/situation/:id" element={<TestSituation />} />
</Routes>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}
