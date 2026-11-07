import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getStripeLinks, withEmail } from '../lib/stripeLinks';

// Chaque langue est ecrite pour elle-meme, pas traduite de l'autre.
const TEXTS = {
  fr: {
    title: 'ChildPause Premium',
    subtitle: 'Les situations les plus difficiles, avec les mots pour les traverser.',
    opensTitle: 'Ce que Premium ouvre',
    opens: [
      'Quand ton enfant ne veut pas quitter le parc',
      'Quand ton enfant frappe, mord ou donne des coups de pied',
      'Quand les devoirs tournent au conflit, chaque soir',
      'Toute la bibliothèque : des dizaines de scripts supplémentaires, classés par thème',
    ],
    free: 'Les trois situations gratuites (écrans, grosses crises, coucher) et une partie de la bibliothèque restent ouvertes à tous, sans inscription.',
    annual: 'Annuel : 49 € par an (économisez plus de 40 %)',
    monthly: 'Mensuel : 6,99 € par mois',
    reassurance: 'Pas de frais cachés. Résiliable à tout moment, en ligne.',
    soon: "L'abonnement ouvre très bientôt.",
    alreadyMember: 'Déjà abonné ? Se connecter',
    faqTitle: 'Questions fréquentes',
    faq: [
      ['Puis-je tester avant ?', 'Oui. Trois situations et une partie de la bibliothèque sont gratuites, sans inscription.'],
      [
        'Comment résilier ?',
        "En ligne : « Se connecter », puis « Gérer mon abonnement ». Ton accès reste ouvert jusqu'à la fin de la période déjà payée.",
      ],
    ],
  },
  de: {
    title: 'ChildPause Premium',
    subtitle: 'Die schwierigsten Situationen, mit den passenden Worten dazu.',
    opensTitle: 'Das schaltet Premium frei',
    opens: [
      'Wenn dein Kind den Spielplatz nicht verlassen will',
      'Wenn dein Kind haut, beißt oder tritt',
      'Wenn die Hausaufgaben jeden Abend im Streit enden',
      'Die ganze Bibliothek: Dutzende weitere Skripte, nach Themen sortiert',
    ],
    free: 'Die drei kostenlosen Situationen (Bildschirm, Wutanfall, Zubettgehen) und ein Teil der Bibliothek sind für alle offen, ohne Anmeldung.',
    annual: 'Jährlich: 49 € im Jahr (du sparst über 40 %)',
    monthly: 'Monatlich: 6,99 € im Monat',
    reassurance: 'Keine versteckten Kosten. Jederzeit online kündbar.',
    soon: 'Das Abonnement startet in Kürze.',
    alreadyMember: 'Schon Abonnent? Anmelden',
    faqTitle: 'Häufige Fragen',
    faq: [
      ['Kann ich vorher testen?', 'Ja. Drei Situationen und ein Teil der Bibliothek sind kostenlos und ohne Anmeldung nutzbar.'],
      [
        'Wie kündige ich?',
        'Online: Unter „Anmelden“ und dann „Abo verwalten“. Dein Zugang bleibt bis zum Ende des bereits bezahlten Zeitraums offen.',
      ],
    ],
  },
};

const buttonBase = {
  display: 'block',
  textAlign: 'center',
  padding: '1rem 2rem',
  fontSize: '1rem',
  borderRadius: '8px',
  fontWeight: 'bold',
  textDecoration: 'none',
  marginBottom: '0.75rem',
};

function PremiumPage() {
  const { language } = useLanguage();
  const t = TEXTS[language === 'de' ? 'de' : 'fr'];
  const { user } = useAuth();
  const links = getStripeLinks();
  const email = user ? user.email : '';
  const ready = Boolean(links.monthly && links.annual);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', maxWidth: '640px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', textAlign: 'center' }}>{t.title}</h1>
      <p style={{ fontSize: '1.15rem', textAlign: 'center', color: '#666', marginBottom: '2rem' }}>{t.subtitle}</p>

      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{t.opensTitle}</h2>
      <ul style={{ marginLeft: '1.25rem', lineHeight: 1.7, marginBottom: '1rem' }}>
        {t.opens.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p style={{ color: '#555', lineHeight: 1.6, marginBottom: '2rem' }}>{t.free}</p>

      {ready ? (
        <div>
          <a
            href={withEmail(links.annual, email)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...buttonBase, backgroundColor: 'hsl(var(--primary))', color: 'white' }}
          >
            {t.annual}
          </a>
          <a
            href={withEmail(links.monthly, email)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...buttonBase, border: '2px solid hsl(var(--primary))', color: 'hsl(var(--primary))' }}
          >
            {t.monthly}
          </a>
          <p style={{ textAlign: 'center', color: '#555', fontSize: '0.95rem' }}>{t.reassurance}</p>
        </div>
      ) : (
        <p style={{ textAlign: 'center', fontWeight: 600 }}>{t.soon}</p>
      )}

      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Link to="/connexion">{t.alreadyMember}</Link>
      </p>

      <h2 style={{ fontSize: '1.25rem', margin: '2.5rem 0 0.75rem' }}>{t.faqTitle}</h2>
      {t.faq.map(([question, answer]) => (
        <div key={question} style={{ marginBottom: '1rem' }}>
          <p style={{ fontWeight: 600, margin: '0 0 0.25rem' }}>{question}</p>
          <p style={{ margin: 0, color: '#555', lineHeight: 1.6 }}>{answer}</p>
        </div>
      ))}
    </div>
  );
}

export default PremiumPage;
