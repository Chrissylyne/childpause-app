import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { trackEvent } from '../utils/trackingService';

// Chaque langue est ecrite pour elle-meme, pas traduite de l'autre.
const TEXTS = {
  fr: {
    title: 'Bibliothèque',
    subtitle: 'Toutes les situations du quotidien, classées par thème.',
    toSituations: 'Retour aux situations',
    back: 'Retour aux thèmes',
    count: (n) => (n === 1 ? '1 script' : `${n} scripts`),
    locked: (n) => `🔒 ${n} de plus avec Premium`,
    teaserTitle: 'Il y a encore des scripts dans ce thème.',
    teaserText: 'Ils sont réservés à ChildPause Premium.',
    discover: 'Découvrir Premium',
    loading: 'Chargement…',
    error: "La bibliothèque ne s'est pas chargée. Vérifie ta connexion et réessaie.",
    retry: 'Réessayer',
    empty: "Aucun script dans ce thème pour l'instant.",
    age: (min, max) => `${min} à ${max} ans`,
    hint: 'Repère pour les parents',
  },
  de: {
    title: 'Bibliothek',
    subtitle: 'Alle Alltagssituationen, nach Themen sortiert.',
    toSituations: 'Zurück zu den Situationen',
    back: 'Zurück zu den Themen',
    count: (n) => (n === 1 ? '1 Skript' : `${n} Skripte`),
    locked: (n) => `🔒 ${n} weitere mit Premium`,
    teaserTitle: 'In diesem Thema gibt es noch mehr Skripte.',
    teaserText: 'Sie gehören zu ChildPause Premium.',
    discover: 'Premium entdecken',
    loading: 'Wird geladen …',
    error: 'Die Bibliothek konnte nicht geladen werden. Prüfe deine Verbindung und versuche es noch einmal.',
    retry: 'Noch einmal versuchen',
    empty: 'In diesem Thema gibt es noch keine Skripte.',
    age: (min, max) => `${min} bis ${max} Jahre`,
    hint: 'Hinweis für Eltern',
  },
};

const purple = 'hsl(280, 70%, 55%)';
const pageStyle = {
  minHeight: '100vh',
  background: 'hsl(240, 20%, 97%)',
  padding: '20px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};
const wrapStyle = { maxWidth: '900px', margin: '0 auto' };
const h1Style = { fontSize: '22px', fontWeight: 700, color: 'hsl(240, 30%, 20%)', margin: '0 0 8px' };
const mutedStyle = { fontSize: '14px', color: 'hsl(240, 20%, 40%)', margin: '0 0 24px' };
const backButton = {
  background: 'white',
  border: 'none',
  padding: '10px 14px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  color: 'hsl(240, 30%, 20%)',
  marginBottom: '20px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
};
const errorStyle = { color: 'hsl(0, 65%, 40%)', fontSize: '14px' };

export default function LibraryPage() {
  const { language } = useLanguage();
  const lang = language === 'de' ? 'de' : 'fr';
  const t = TEXTS[lang];
  const { isPremium, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [overviewState, setOverviewState] = useState('loading'); // loading | ready | error
  const [selected, setSelected] = useState(null);
  const [scripts, setScripts] = useState([]);
  const [scriptsState, setScriptsState] = useState('idle'); // idle | loading | ready | error

  const loadOverview = useCallback(async () => {
    setOverviewState('loading');
    const { data, error } = await supabase.rpc('library_overview', { p_lang: lang });
    if (error || !Array.isArray(data)) {
      setOverviewState('error');
      return;
    }
    setCategories(data);
    setOverviewState('ready');
  }, [lang]);

  const loadScripts = useCallback(async (category) => {
    setScriptsState('loading');
    const { data, error } = await supabase.rpc('library_scripts', { p_category: category.category_id });
    if (error || !Array.isArray(data)) {
      setScriptsState('error');
      return;
    }
    setScripts(data);
    setScriptsState('ready');
  }, []);

  // Les themes sont recharges quand la langue change.
  useEffect(() => {
    setSelected(null);
    setScripts([]);
    loadOverview();
  }, [loadOverview]);

  // Les scripts sont recharges quand l'abonnement change (connexion, resiliation).
  useEffect(() => {
    if (selected && !authLoading) loadScripts(selected);
  }, [isPremium, authLoading]);

  const openCategory = (category) => {
    trackEvent('library_category_opened', { category: category.category_name, language: lang });
    setSelected(category);
    setScripts([]);
    loadScripts(category);
  };

  // Regroupe les scripts d'une meme situation, avec leurs tranches d'age.
  const groups = [];
  scripts.forEach((script) => {
    const last = groups[groups.length - 1];
    if (last && last.title === script.title) last.items.push(script);
    else groups.push({ title: script.title, items: [script] });
  });

  const hiddenInCategory = selected && !isPremium ? selected.premium_count : 0;

  return (
    <div style={pageStyle}>
      <div style={wrapStyle}>
        {!selected && (
          <div>
            <button type="button" style={backButton} onClick={() => navigate('/')}>
              ← {t.toSituations}
            </button>
            <h1 style={h1Style}>{t.title}</h1>
            <p style={mutedStyle}>{t.subtitle}</p>

            {overviewState === 'loading' && <p style={mutedStyle}>{t.loading}</p>}

            {overviewState === 'error' && (
              <div>
                <p role="alert" style={errorStyle}>{t.error}</p>
                <button type="button" style={{ ...backButton, background: purple, color: 'white' }} onClick={loadOverview}>
                  {t.retry}
                </button>
              </div>
            )}

            {overviewState === 'ready' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                {categories.map((category) => {
                  const accessible = category.free_count + (isPremium ? category.premium_count : 0);
                  const hidden = isPremium ? 0 : category.premium_count;
                  return (
                    <button
                      key={category.category_id}
                      type="button"
                      onClick={() => openCategory(category)}
                      style={{
                        background: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '20px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        textAlign: 'left',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                      }}
                    >
                      <span style={{ fontSize: '16px', fontWeight: 700, color: 'hsl(240, 30%, 20%)', marginBottom: '6px' }}>
                        {category.category_name}
                      </span>
                      <span style={{ fontSize: '14px', color: 'hsl(240, 20%, 40%)' }}>{t.count(accessible)}</span>
                      {hidden > 0 && (
                        <span style={{ marginTop: '10px', fontSize: '12px', fontWeight: 600, color: purple }}>
                          {t.locked(hidden)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {selected && (
          <div>
            <button type="button" style={backButton} onClick={() => setSelected(null)}>
              ← {t.back}
            </button>
            <h1 style={h1Style}>{selected.category_name}</h1>

            {scriptsState === 'loading' && <p style={mutedStyle}>{t.loading}</p>}

            {scriptsState === 'error' && (
              <div>
                <p role="alert" style={errorStyle}>{t.error}</p>
                <button type="button" style={{ ...backButton, background: purple, color: 'white' }} onClick={() => loadScripts(selected)}>
                  {t.retry}
                </button>
              </div>
            )}

            {scriptsState === 'ready' && groups.length === 0 && <p style={mutedStyle}>{t.empty}</p>}

            {scriptsState === 'ready' &&
              groups.map((group) => (
                <section key={group.title} style={{ marginBottom: '28px' }}>
                  <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'hsl(240, 30%, 20%)', margin: '0 0 12px' }}>
                    {group.title}
                  </h2>
                  {group.items.map((script) => (
                    <div
                      key={script.id}
                      style={{ background: 'white', padding: '16px', borderRadius: '8px', marginBottom: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
                    >
                      <div style={{ fontSize: '12px', fontWeight: 700, color: purple, marginBottom: '6px' }}>
                        {t.age(script.age_min, script.age_max)}
                      </div>
                      <div style={{ fontSize: '14px', color: 'hsl(240, 20%, 30%)', lineHeight: 1.5 }}>{script.content}</div>
                      {script.parent_hint && (
                        <div style={{ marginTop: '12px', fontSize: '13px', color: 'hsl(240, 20%, 40%)', lineHeight: 1.5 }}>
                          <strong>{t.hint} : </strong>
                          {script.parent_hint}
                        </div>
                      )}
                    </div>
                  ))}
                </section>
              ))}

            {scriptsState === 'ready' && hiddenInCategory > 0 && (
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>{t.locked(hiddenInCategory)}</div>
                <div style={{ fontSize: '14px', color: 'hsl(240, 20%, 40%)', marginBottom: '12px' }}>
                  {t.teaserTitle} {t.teaserText}
                </div>
                <Link to="/premium" style={{ color: purple, fontWeight: 600 }}>{t.discover}</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
