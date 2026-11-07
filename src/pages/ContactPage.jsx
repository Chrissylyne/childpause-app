import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

// Chaque langue est ecrite pour elle-meme, pas traduite de l'autre.
const TEXTS = {
  fr: {
    title: 'Contact',
    intro: 'Une question, une suggestion, un souci avec l’app ? Écris-nous, nous répondons dès que possible.',
    name: 'Ton prénom ou ton nom',
    email: 'Ton adresse e-mail',
    message: 'Ton message',
    send: 'Envoyer',
    sending: 'Envoi…',
    sent: 'Merci, ton message est bien parti. Nous te répondons par e-mail.',
    error: 'Le message n’a pas pu partir. Réessaie dans un instant ou écris à contact@childpause.online.',
    invalid: 'Vérifie ton adresse e-mail et écris au moins une phrase.',
    privacy: 'Tes données servent uniquement à répondre à ton message. Détails dans la',
    privacyLink: 'politique de confidentialité',
  },
  de: {
    title: 'Kontakt',
    intro: 'Eine Frage, ein Vorschlag, ein Problem mit der App? Schreib uns, wir antworten so schnell wie möglich.',
    name: 'Dein Vorname oder Name',
    email: 'Deine E-Mail-Adresse',
    message: 'Deine Nachricht',
    send: 'Absenden',
    sending: 'Wird gesendet …',
    sent: 'Danke, deine Nachricht ist angekommen. Wir antworten dir per E-Mail.',
    error: 'Die Nachricht konnte nicht gesendet werden. Versuch es gleich noch einmal oder schreib an contact@childpause.online.',
    invalid: 'Bitte prüfe deine E-Mail-Adresse und schreib mindestens einen Satz.',
    privacy: 'Deine Daten werden nur verwendet, um deine Nachricht zu beantworten. Mehr dazu in der',
    privacyLink: 'Datenschutzerklärung',
  },
};

const fieldStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '12px',
  fontSize: '1rem',
  fontFamily: 'inherit',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  background: 'white',
  marginBottom: '1rem',
};

function ContactPage() {
  const { language } = useLanguage();
  const t = TEXTS[language === 'de' ? 'de' : 'fr'];
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error | invalid

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (response.status === 400) {
        setStatus('invalid');
        return;
      }
      if (!response.ok) {
        setStatus('error');
        return;
      }
      setStatus('sent');
      setForm({ name: '', email: '', message: '', website: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div style={{ minHeight: '60vh', padding: '2rem', maxWidth: '640px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{t.title}</h1>
      <p style={{ color: '#555', lineHeight: 1.6, marginBottom: '1.5rem' }}>{t.intro}</p>

      {status === 'sent' ? (
        <p role="status" style={{ background: '#e8f5ec', color: '#1d5b33', padding: '14px 16px', borderRadius: '8px' }}>
          {t.sent}
        </p>
      ) : (
        <form onSubmit={submit}>
          <label htmlFor="contact-name" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>{t.name}</label>
          <input id="contact-name" type="text" required maxLength={100} autoComplete="name" value={form.name} onChange={update('name')} style={fieldStyle} />

          <label htmlFor="contact-email" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>{t.email}</label>
          <input id="contact-email" type="email" required maxLength={200} autoComplete="email" value={form.email} onChange={update('email')} style={fieldStyle} />

          <label htmlFor="contact-message" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>{t.message}</label>
          <textarea id="contact-message" required minLength={10} maxLength={5000} rows={7} value={form.message} onChange={update('message')} style={{ ...fieldStyle, resize: 'vertical' }} />

          {/* Champ piege contre les robots : invisible pour une personne. */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', height: 0, overflow: 'hidden' }}>
            <label htmlFor="contact-website">Website</label>
            <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={update('website')} />
          </div>

          {status === 'invalid' && <p role="alert" style={{ color: 'hsl(0, 65%, 40%)' }}>{t.invalid}</p>}
          {status === 'error' && <p role="alert" style={{ color: 'hsl(0, 65%, 40%)' }}>{t.error}</p>}

          <button
            type="submit"
            disabled={status === 'sending'}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'white',
              background: 'hsl(var(--primary))',
              border: 'none',
              borderRadius: '8px',
              cursor: status === 'sending' ? 'wait' : 'pointer',
            }}
          >
            {status === 'sending' ? t.sending : t.send}
          </button>

          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem', lineHeight: 1.5 }}>
            {t.privacy} <Link to="/privacy">{t.privacyLink}</Link>.
          </p>
        </form>
      )}
    </div>
  );
}

export default ContactPage;
