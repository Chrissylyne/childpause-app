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
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { language, setLanguage } = useLanguage();

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid hsl(var(--border))', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" style={{ fontSize: '1.2rem', fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}>
        ChildPause
      </Link>

      {/* Desktop menu */}
      <div className="desktop-menu" style={{ display: 'flex', gap: '2rem' }}>
        <Link to="/about" style={{ textDecoration: 'none', color: 'hsl(var(--primary))' }}>À propos</Link>
        <Link to="/premium" style={{ textDecoration: 'none', color: 'hsl(var(--primary))' }}>Premium</Link>
        <Link to="/terms" style={{ textDecoration: 'none', color: 'hsl(var(--primary))' }}>Conditions</Link>
        <Link to="/privacy" style={{ textDecoration: 'none', color: 'hsl(var(--primary))' }}>Confidentialité</Link>
      </div>

      {/* Mobile hamburger */}
      <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="mobile-menu-btn" style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
        ☰
      </button>

      {/* Mobile dropdown */}
      {isMenuOpen && (
        <div style={{ position: 'absolute', top: '3.5rem', right: '1rem', background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem', padding: '1rem', minWidth: '150px', zIndex: 1000 }}>
          <Link to="/about" onClick={() => setIsMenuOpen(false)} style={{ display: 'block', marginBottom: '0.75rem', textDecoration: 'none', color: 'hsl(var(--foreground))' }}>À propos</Link>
          <Link to="/premium" onClick={() => setIsMenuOpen(false)} style={{ display: 'block', marginBottom: '0.75rem', textDecoration: 'none', color: 'hsl(var(--foreground))' }}>Premium</Link>
          <Link to="/terms" onClick={() => setIsMenuOpen(false)} style={{ display: 'block', marginBottom: '0.75rem', textDecoration: 'none', color: 'hsl(var(--foreground))' }}>Conditions</Link>
          <Link to="/privacy" onClick={() => setIsMenuOpen(false)} style={{ display: 'block', textDecoration: 'none', color: 'hsl(var(--foreground))' }}>Confidentialité</Link>
        </div>
      )}

      {/* Language buttons */}
      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
        <button onClick={() => setLanguage('fr')} style={{ padding: '0.5rem 1rem', background: language === 'fr' ? 'hsl(var(--primary))' : 'transparent', color: language === 'fr' ? 'white' : 'hsl(var(--foreground))', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
          FR
        </button>
        <button onClick={() => setLanguage('de')} style={{ padding: '0.5rem 1rem', background: language === 'de' ? 'hsl(var(--primary))' : 'transparent', color: language === 'de' ? 'white' : 'hsl(var(--foreground))', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
          DE
        </button>
      </div>
    </nav>
  );
}
      {/* Language buttons */}
      <div style={{ display: 'inline-flex', gap: '0rem', backgroundColor: 'hsl(var(--accent))', padding: '0.25rem', borderRadius: '2rem', position: 'relative', overflow: 'hidden' }}>
        <button onClick={() => setLanguage('fr')} style={{ backgroundColor: language === 'fr' ? 'hsl(var(--primary))' : 'transparent', color: language === 'fr' ? 'white' : 'hsl(var(--foreground))', padding: '0.25rem 0.75rem', border: 'none', borderRadius: '2rem', cursor: 'pointer', transition: 'all 0.25s', boxShadow: language === 'fr' ? '0 2px 8px rgba(0,0,0,0.2)' }}>
          FR
        </button>
        <button onClick={() => setLanguage('de')} style={{ backgroundColor: language === 'de' ? 'hsl(var(--primary))' : 'transparent', color: language === 'de' ? 'white' : 'hsl(var(--foreground))', padding: '0.25rem 0.75rem', border: 'none', borderRadius: '2rem', cursor: 'pointer', transition: 'all 0.25s', boxShadow: language === 'de' ? '0 2px 8px rgba(0,0,0,0.2)' }}>
          DE
        </button>
      </div>
    </nav>
  );
}
  {/* Fond qui coulisse */}
  <div
    style={{
      position: 'absolute',
      top: '0.25rem',
      left: '0.25rem',
      width: 'calc(50% - 0.125rem)',
      height: 'calc(100% - 0.5rem)',
      backgroundColor: 'hsl(var(--primary))',
      borderRadius: '1.5rem',
      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: language === 'de' ? 'translateX(calc(100% + 0.5rem))' : 'translateX(0)',
      zIndex: 0
    }}
  />
  
  <button
    onClick={() => setLanguage('fr')}
    style={{
      padding: '0.5rem 1rem',
      backgroundColor: 'transparent',
      color: language === 'fr' ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
      border: 'none',
      borderRadius: '1.5rem',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '0.9rem',
      transition: 'color 0.4s',
      position: 'relative',
      zIndex: 1
    }}
  >
    FR
  </button>
  
  <button
    onClick={() => setLanguage('de')}
    style={{
      padding: '0.5rem 1rem',
      backgroundColor: 'transparent',
      color: language === 'de' ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
      border: 'none',
      borderRadius: '1.5rem',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '0.9rem',
      transition: 'color 0.4s',
      position: 'relative',
      zIndex: 1
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
