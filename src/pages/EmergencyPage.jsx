import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslations } from '../i18n/useTranslations.js';

function EmergencyPage() {
  const { t, language } = useTranslations();

  const emergencyScripts = language === 'fr' 
    ? [
        "Je suis là. On respire ensemble d'abord.",
        "Tu peux ressentir ça. Je reste avec toi.",
        "On ne règle rien maintenant. On attend que ça passe ensemble.",
      ]
    : [
        "Ich bin da. Lass uns zuerst zusammen atmen.",
        "Du kannst das fühlen. Ich bleibe bei dir.",
        "Wir lösen jetzt nichts. Wir warten zusammen, bis es vorbei ist.",
      ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'hsl(var(--emergency))', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '600px', backgroundColor: 'hsl(var(--card))', padding: '2rem', borderRadius: '1rem', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <h1 style={{ fontSize: '2rem', color: 'hsl(var(--emergency))', marginBottom: '1rem' }}>
          {language === 'fr' ? 'Prends une seconde.' : 'Nimm dir eine Sekunde.'}
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'hsl(var(--foreground))', marginBottom: '2rem', fontStyle: 'italic' }}>
          {language === 'fr' ? 'Voici quoi dire maintenant.' : 'Hier ist, was du jetzt sagen kannst.'}
        </p>

        <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
          {emergencyScripts.map((script, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'hsl(var(--accent))',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                borderLeft: '4px solid hsl(var(--primary))',
                textAlign: 'left'
              }}
            >
              <p style={{ fontSize: '1.1rem', color: 'hsl(var(--foreground))', lineHeight: '1.6', margin: 0 }}>
                « {script} »
              </p>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: 'hsl(var(--secondary))', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.95rem', color: 'hsl(var(--secondary-foreground))', lineHeight: '1.6', margin: 0 }}>
            {language === 'fr' 
              ? "Tu n'as pas à être parfaite. Tu cherches juste les bons mots, c'est déjà beaucoup."
              : "Du musst nicht perfekt sein. Du suchst nur nach den richtigen Worten, das ist schon viel."}
          </p>
        </div>

        <Link to="/" style={{ display: 'inline-block', padding: '1rem 2rem', backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', textDecoration: 'none', borderRadius: '0.5rem', fontWeight: 'bold', transition: 'opacity 0.3s' }}>
          {language === 'fr' ? "Retour à l'accueil" : 'Zurück zur Startseite'}
        </Link>
      </div>
    </div>
  );
}

export default EmergencyPage;
