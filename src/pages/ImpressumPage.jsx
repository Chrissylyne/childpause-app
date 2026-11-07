import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { LEGAL, legalIsComplete } from '../data/legal';

// Chaque langue est ecrite pour elle-meme, pas traduite de l'autre.
const TEXTS = {
  de: {
    title: 'Impressum',
    legalBasis: 'Angaben gemäß § 5 DDG',
    provider: 'Anbieterin',
    contact: 'Kontakt',
    emailLabel: 'E-Mail',
    phoneLabel: 'Telefon',
    formLabel: 'Kontaktformular',
    formLink: 'Nachricht schreiben',
    vatTitle: 'Steuerliche Angaben',
    kleinunternehmer: 'Kleinunternehmerin im Sinne von § 19 UStG. Es wird keine Umsatzsteuer ausgewiesen.',
    vatId: (id) => `Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: ${id}`,
    wIdNr: (id) => `Wirtschafts-Identifikationsnummer gemäß § 139c AO: ${id}`,
    noticeTitle: 'Hinweis zu den Inhalten',
    notice:
      'Die Inhalte von ChildPause sind Vorschläge für wohlwollende Kommunikation. Sie ersetzen keine medizinische oder psychologische Beratung.',
    missing: 'Angaben unvollständig: Straße, PLZ und Ort fehlen noch in src/data/legal.js.',
  },
  fr: {
    title: 'Mentions légales',
    legalBasis: 'Informations légales (Impressum, § 5 DDG)',
    provider: 'Éditrice du site',
    contact: 'Contact',
    emailLabel: 'E-mail',
    phoneLabel: 'Téléphone',
    formLabel: 'Formulaire de contact',
    formLink: 'Écrire un message',
    vatTitle: 'Informations fiscales',
    kleinunternehmer: 'Petite entreprise au sens du § 19 UStG (Allemagne) : la TVA n’est pas facturée.',
    vatId: (id) => `Numéro d’identification TVA (§ 27a UStG) : ${id}`,
    wIdNr: (id) => `Numéro d’identification économique, Wirtschafts-Identifikationsnummer (§ 139c AO) : ${id}`,
    hostTitle: 'Hébergement',
    host: 'Le site est hébergé par Vercel Inc., États-Unis (vercel.com).',
    directorTitle: 'Directrice de la publication',
    noticeTitle: 'À propos des contenus',
    notice:
      'Les contenus de ChildPause sont des suggestions de communication bienveillante. Ils ne remplacent pas un avis médical ou psychologique.',
    missing: 'Informations incomplètes : rue, code postal et ville manquent encore dans src/data/legal.js.',
  },
};

const h2 = { fontSize: '1.3rem', margin: '2rem 0 0.5rem' };

function ImpressumPage() {
  const { language } = useLanguage();
  const lang = language === 'de' ? 'de' : 'fr';
  const t = TEXTS[lang];

  return (
    <div style={{ minHeight: '60vh', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{t.title}</h1>
      <p style={{ color: '#666', marginTop: 0 }}>{t.legalBasis}</p>

      {!legalIsComplete() && (
        <p role="alert" style={{ background: '#fdecea', color: '#8a1c1c', padding: '12px 16px', borderRadius: '8px' }}>
          {t.missing}
        </p>
      )}

      <div style={{ fontSize: '1rem', lineHeight: '1.8', color: '#333' }}>
        <h2 style={h2}>{t.provider}</h2>
        <p style={{ margin: 0 }}>
          {LEGAL.name}
          <br />
          {LEGAL.street}
          <br />
          {LEGAL.zip} {LEGAL.city}
          <br />
          {LEGAL.country}
        </p>

        <h2 style={h2}>{t.contact}</h2>
        <p style={{ margin: 0 }}>
          {t.emailLabel} : <a href={`mailto:${LEGAL.email}`} style={{ color: '#007bff', textDecoration: 'none' }}>{LEGAL.email}</a>
          <br />
          {t.formLabel} : <Link to="/contact" style={{ color: '#007bff', textDecoration: 'none' }}>{t.formLink}</Link>
          {LEGAL.phone && (
            <>
              <br />
              {t.phoneLabel} : {LEGAL.phone}
            </>
          )}
        </p>

        {lang === 'fr' && (
          <>
            <h2 style={h2}>{t.directorTitle}</h2>
            <p style={{ margin: 0 }}>{LEGAL.name}</p>
            <h2 style={h2}>{t.hostTitle}</h2>
            <p style={{ margin: 0 }}>{t.host}</p>
          </>
        )}

        {(LEGAL.vatMode === 'kleinunternehmer' || (LEGAL.vatMode === 'ustid' && LEGAL.vatId) || LEGAL.wIdNr) && (
          <>
            <h2 style={h2}>{t.vatTitle}</h2>
            <p style={{ margin: 0 }}>
              {LEGAL.vatMode === 'kleinunternehmer' && <>{t.kleinunternehmer}<br /></>}
              {LEGAL.vatMode === 'ustid' && LEGAL.vatId && <>{t.vatId(LEGAL.vatId)}<br /></>}
              {LEGAL.wIdNr && <>{t.wIdNr(LEGAL.wIdNr)}</>}
            </p>
          </>
        )}

        <h2 style={h2}>{t.noticeTitle}</h2>
        <p style={{ margin: 0 }}>{t.notice}</p>
      </div>
    </div>
  );
}

export default ImpressumPage;
