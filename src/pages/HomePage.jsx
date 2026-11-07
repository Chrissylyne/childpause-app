import React, { useEffect, useRef, useState } from 'react';
import Paywall from '../components/Paywall';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useSituations } from '../hooks/useSituations';
import { TRACKING_EVENTS, trackEvent } from '../utils/trackingService';

// Chaque langue est ecrite pour elle-meme, pas traduite de l'autre.
const TEXTS = {
  fr: {
    landingTitle: "Qu'est-ce que je lui dis, là, maintenant ?",
    landingSubtitle:
      'Pour les moments où on ne trouve plus ses mots. Choisis ta situation et trouve une première phrase simple à lui dire.',
    landingButton: 'Choisir ma situation',
    landingNote: 'Gratuit pour commencer. Sans inscription.',
    cards: [
      { label: 'Ce que tu peux dire', desc: 'Une phrase simple, naturelle, que tu peux dire tout de suite.' },
      { label: 'Ce que tu peux faire', desc: 'Le geste qui accompagne la parole.' },
      { label: 'À éviter', desc: 'Les réactions qui compliquent souvent les choses.' },
    ],
    landingFooter: 'Pas besoin de lire 50 articles. Choisis la situation et la réponse vient.',
    listTitle: 'Quelle situation ?',
    listSubtitle: 'Trouve ta situation et la réponse arrive.',
    loading: 'Chargement…',
    loadError: 'Les situations ne se sont pas chargées. Vérifie ta connexion et réessaie.',
    retry: 'Réessayer',
    contentMissing: "Cette situation n'a pas pu s'afficher. Réessaie dans un instant.",
    premium: 'Premium',
    back: 'Retour',
    next: 'Autre situation',
    sections: [
      { label: '🗣️ Ce que tu peux dire', key: 'dis' },
      { label: '👉 Ce que tu peux faire', key: 'fais' },
      { label: '🚫 À éviter', key: 'evite' },
      { label: '🔥 Si ça continue', key: 'siContinue' },
      { label: "💡 L'idée", key: 'objectif' },
      { label: '💭 Pourquoi ça marche', key: 'pourquoi' },
    ],
  },
  de: {
    landingTitle: 'Was soll ich jetzt sagen?',
    landingSubtitle:
      'Dein Kind schreit, macht nicht mit oder weint, und dir fehlen die Worte? Such dir deine Situation aus und finde einen Satz, mit dem du anfangen kannst.',
    landingButton: 'Situation auswählen',
    landingNote: 'Zum Start kostenlos. Ohne Anmeldung.',
    cards: [
      { label: 'Das kannst du sagen', desc: 'Ein einfacher Satz, den du sofort sagen kannst.' },
      { label: 'So gehst du vor', desc: 'Was du dazu tun kannst.' },
      { label: 'Lieber nicht', desc: 'Reaktionen, die es oft schwerer machen.' },
    ],
    landingFooter: 'Keine langen Artikel nötig. Situation wählen, Antwort bekommen. Fertig.',
    listTitle: 'Um welche Situation geht es?',
    listSubtitle: 'Wähle deine Situation. Die Antwort folgt sofort.',
    loading: 'Wird geladen …',
    loadError: 'Die Situationen konnten nicht geladen werden. Prüfe deine Verbindung und versuche es noch einmal.',
    retry: 'Noch einmal versuchen',
    contentMissing: 'Diese Situation konnte nicht angezeigt werden. Bitte versuche es gleich noch einmal.',
    premium: 'Premium',
    back: 'Zurück',
    next: 'Nächste Situation',
    sections: [
      { label: '🗣️ Das kannst du sagen', key: 'dis' },
      { label: '👉 So gehst du vor', key: 'fais' },
      { label: '🚫 Lieber nicht', key: 'evite' },
      { label: '🔥 Wenn es weitergeht', key: 'siContinue' },
      { label: '💡 Worum es geht', key: 'objectif' },
      { label: '💭 Warum das hilft', key: 'pourquoi' },
    ],
  },
};

const pageFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const purple = 'hsl(280, 70%, 55%)';
const purpleDark = 'hsl(280, 70%, 48%)';

const HomePage = () => {
  const { language } = useLanguage();
  const t = TEXTS[language === 'de' ? 'de' : 'fr'];
  const lang = language === 'de' ? 'de' : 'fr';
  const { isPremium, loading: authLoading } = useAuth();
  const { items: situations, loading, error, reload } = useSituations(isPremium, !authLoading);

  const [currentScreen, setCurrentScreen] = useState('landing');
  const [selectedSituation, setSelectedSituation] = useState(null);
  const [paywallSource, setPaywallSource] = useState('soft');
  const [notice, setNotice] = useState('');
  const [viewedSituationIds, setViewedSituationIds] = useState(new Set());
  const paywallTimer = useRef(null);

  const clearPaywallTimer = () => {
    if (paywallTimer.current) {
      clearTimeout(paywallTimer.current);
      paywallTimer.current = null;
    }
  };

  useEffect(() => clearPaywallTimer, []);

  const handleSituationClick = (situation) => {
    setNotice('');
    trackEvent(TRACKING_EVENTS.SITUATION_SELECTED, { situation: situation.id, language: lang });

    // Situation Premium sans abonnement : le contenu n'est meme pas envoye, on montre l'offre.
    if (!situation.free && !isPremium) {
      setPaywallSource('locked');
      setCurrentScreen('paywall');
      return;
    }

    if (!situation[lang].content) {
      setNotice(t.contentMissing);
      return;
    }

    setSelectedSituation(situation);
    setCurrentScreen('intervention');
    trackEvent(TRACKING_EVENTS.INTERVENTION_VIEWED, { situation: situation.id, language: lang });

    if (!viewedSituationIds.has(situation.id)) {
      const updated = new Set(viewedSituationIds);
      updated.add(situation.id);
      setViewedSituationIds(updated);

      if (updated.size >= 2 && !isPremium) {
        clearPaywallTimer();
        paywallTimer.current = setTimeout(() => {
          setPaywallSource('soft');
          setCurrentScreen((previous) => (previous === 'intervention' ? 'paywall' : previous));
        }, 3000);
      }
    }
  };

  const goToList = () => {
    clearPaywallTimer();
    setSelectedSituation(null);
    setCurrentScreen('situations');
  };

  const handlePaywallClosed = () => {
    setCurrentScreen('situations');
  };

  if (currentScreen === 'landing') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, hsl(240, 20%, 95%) 0%, hsl(260, 15%, 90%) 100%)',
        padding: '20px',
        fontFamily: pageFont,
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'hsl(240, 30%, 20%)', margin: '0 0 12px 0', lineHeight: '1.2' }}>
              {t.landingTitle}
            </h1>
            <p style={{ fontSize: '15px', color: 'hsl(240, 20%, 40%)', margin: '0', lineHeight: '1.5' }}>
              {t.landingSubtitle}
            </p>
          </div>

          <button
            onClick={() => {
              trackEvent(TRACKING_EVENTS.LANDING_CTA_CLICKED, { language: lang });
              setCurrentScreen('situations');
            }}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              background: purple,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '12px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = purpleDark; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = purple; }}
          >
            {t.landingButton}
          </button>
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'hsl(240, 20%, 40%)', margin: '0 0 32px 0' }}>
            {t.landingNote}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {t.cards.map((item) => (
              <div key={item.label} style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: purple, marginBottom: '4px' }}>{item.label}</div>
                <div style={{ fontSize: '13px', color: 'hsl(240, 20%, 40%)', lineHeight: '1.4' }}>{item.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '13px', color: 'hsl(240, 20%, 50%)', lineHeight: '1.5' }}>
            {t.landingFooter}
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'situations') {
    return (
      <div style={{ minHeight: '100vh', background: 'hsl(240, 20%, 97%)', padding: '20px', fontFamily: pageFont }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'hsl(240, 30%, 20%)', margin: '0 0 8px 0' }}>
              {t.listTitle}
            </h2>
            <p style={{ fontSize: '14px', color: 'hsl(240, 20%, 40%)', margin: '0' }}>{t.listSubtitle}</p>
          </div>

          {notice && <p role="alert" style={{ color: 'hsl(0, 65%, 40%)', fontSize: '14px' }}>{notice}</p>}

          {loading && <p style={{ color: 'hsl(240, 20%, 40%)' }}>{t.loading}</p>}

          {!loading && error && (
            <div>
              <p role="alert" style={{ color: 'hsl(0, 65%, 40%)', fontSize: '14px' }}>{t.loadError}</p>
              <button
                onClick={reload}
                style={{ padding: '12px 16px', borderRadius: '8px', border: 'none', background: purple, color: 'white', fontWeight: 600, cursor: 'pointer' }}
              >
                {t.retry}
              </button>
            </div>
          )}

          {!loading && !error && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {situations.map((situation) => (
                <button
                  key={situation.id}
                  onClick={() => handleSituationClick(situation)}
                  style={{
                    background: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.2s',
                    textAlign: 'left',
                    transform: 'translateY(0)',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  }}
                >
                  <div style={{ fontSize: '32px', lineHeight: '40px', height: '40px', marginBottom: '12px' }}>{situation.emoji}</div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'hsl(240, 30%, 20%)', margin: '0 0 8px 0', lineHeight: '1.2' }}>
                    {situation[lang].title}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'hsl(240, 20%, 50%)', margin: '0', lineHeight: '1.3' }}>
                    {situation[lang].subtitle}
                  </p>
                  {!situation.free && !isPremium && (
                    <div style={{ marginTop: '12px', fontSize: '12px', color: purple, fontWeight: '600' }}>
                      🔒 {t.premium}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentScreen === 'intervention' && selectedSituation) {
    const content = selectedSituation[lang].content;
    return (
      <div style={{ minHeight: '100vh', background: 'hsl(240, 20%, 97%)', padding: '20px', fontFamily: pageFont }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <button
            onClick={goToList}
            style={{
              background: 'white',
              border: 'none',
              padding: '12px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              color: 'hsl(240, 30%, 20%)',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            ← {t.back}
          </button>

          <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'hsl(240, 30%, 20%)', margin: '0 0 8px 0', lineHeight: '1.2' }}>
            {selectedSituation[lang].title}
          </h2>
          <p style={{ fontSize: '14px', color: 'hsl(240, 20%, 50%)', margin: '0 0 24px 0' }}>
            {selectedSituation[lang].subtitle}
          </p>

          {t.sections.map((section) => (
            <div key={section.key} style={{ background: 'white', padding: '16px', borderRadius: '8px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: purple, marginBottom: '8px' }}>{section.label}</div>
              <div style={{ fontSize: '14px', color: 'hsl(240, 20%, 30%)', lineHeight: '1.5' }}>{content[section.key]}</div>
            </div>
          ))}

          <button
            onClick={goToList}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              background: purple,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '24px',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = purpleDark; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = purple; }}
          >
            {t.next}
          </button>
        </div>
      </div>
    );
  }

  if (currentScreen === 'paywall') {
    return <Paywall language={lang} source={paywallSource} onClose={handlePaywallClosed} />;
  }

  return null;
};

export default HomePage;
