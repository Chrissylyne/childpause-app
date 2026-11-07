import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const LABELS = {
  fr: { contact: 'Contact', legal: 'Mentions légales', privacy: 'Confidentialité', terms: 'Conditions' },
  de: { contact: 'Kontakt', legal: 'Impressum', privacy: 'Datenschutz', terms: 'Bedingungen' },
};

export default function Footer() {
  const { language } = useLanguage();
  const t = LABELS[language === 'de' ? 'de' : 'fr'];
  const linkStyle = { color: 'hsl(var(--muted-foreground))', textDecoration: 'none', fontSize: '0.9rem' };

  return (
    <footer
      style={{
        display: 'flex',
        gap: '1.5rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: '1.5rem 1rem 6rem',
        borderTop: '1px solid hsl(var(--border))',
      }}
    >
      <Link to="/contact" style={linkStyle}>{t.contact}</Link>
      <Link to="/impressum" style={linkStyle}>{t.legal}</Link>
      <Link to="/privacy" style={linkStyle}>{t.privacy}</Link>
      <Link to="/terms" style={linkStyle}>{t.terms}</Link>
    </footer>
  );
}
