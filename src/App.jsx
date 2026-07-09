import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import PremiumPage from './pages/PremiumPage.jsx';

function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd', marginBottom: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '2rem' }}>
          <Link to="/" style={{ fontSize: '1.2rem', fontWeight: 'bold', textDecoration: 'none', color: '#000' }}>ChildPause</Link>
          <Link to="/about" style={{ textDecoration: 'none', color: '#007bff' }}>À propos</Link>
          <Link to="/premium" style={{ textDecoration: 'none', color: '#007bff' }}>Premium</Link>
          <Link to="/terms" style={{ textDecoration: 'none', color: '#007bff' }}>Conditions</Link>
          <Link to="/privacy" style={{ textDecoration: 'none', color: '#007bff' }}>Confidentialité</Link>
        </div>
      </nav>
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/premium" element={<PremiumPage />} />
      </Routes>
    </Router>
  );
}

export default App;