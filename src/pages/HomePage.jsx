import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient.js';
import { useTranslations } from '../i18n/useTranslations.js';

function HomePage() {
  const { t, language } = useTranslations();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [scripts, setScripts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAgeRange, setSelectedAgeRange] = useState(null);
  const [loading, setLoading] = useState(false);

  // Age ranges: [min, max]
  const ageRanges = [
    { label: '2-5 ans/Jahre', min: 2, max: 5 },
    { label: '6-9 ans/Jahre', min: 6, max: 9 },
    { label: '10-12+ ans/Jahre', min: 10, max: 99 }
  ];

  useEffect(() => {
    fetchCategories();
  }, [language]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('language', language);
      if (error) throw error;
      setCategories(data || []);
      setSelectedCategory(null); // Reset category when language changes
      setScripts([]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
    setLoading(false);
  };

  const fetchScripts = async (categoryId, ageRange = null) => {
    setLoading(true);
    try {
      let query = supabase
        .from('scripts')
        .select('*')
        .eq('category_id', categoryId);

      // Filter by age range if selected
      if (ageRange) {
        query = query
          .gte('age_max', ageRange.min)
          .lte('age_min', ageRange.max);
      }

      const { data, error } = await query;
      if (error) throw error;
      setScripts(data || []);
      setSelectedCategory(categoryId);
    } catch (error) {
      console.error('Error fetching scripts:', error);
    }
    setLoading(false);
  };

  const handleCategoryClick = (categoryId) => {
    if (selectedAgeRange) {
      fetchScripts(categoryId, selectedAgeRange);
    } else {
      fetchScripts(categoryId);
    }
  };

  const handleAgeRangeClick = (ageRange) => {
    setSelectedAgeRange(ageRange);
    if (selectedCategory) {
      fetchScripts(selectedCategory, ageRange);
    }
  };

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      {/* BOUTON D'ALERTE ROUGE */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <button
          onClick={() => navigate('/emergency')}
          style={{
            padding: '1.5rem 2rem',
            fontSize: '1.1rem',
            backgroundColor: 'hsl(var(--emergency))',
            color: 'hsl(var(--emergency-foreground))',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: 'bold',
            width: '100%',
            maxWidth: '400px',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.02)';
            e.target.style.boxShadow = '0 6px 16px rgba(220, 50, 50, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }}
        >
          {language === 'fr' ? 'MON ENFANT EST EN CRISE MAINTENANT' : 'MEIN KIND IST GERADE IN EINER KRISE'}
        </button>
        <p style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))', marginTop: '0.5rem' }}>
          {language === 'fr' ? 'Les bons mots pour les moments les plus difficiles.' : 'Die richtigen Worte für die schwierigsten Momente.'}
        </p>
      </div>

      {/* TITRE ET TAGLINE */}
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'hsl(var(--foreground))' }}>ChildPause</h1>
      <p style={{ fontSize: '1.1rem', color: 'hsl(var(--reassurance-text))', marginBottom: '2rem' }}>
        {language === 'fr' ? 'Scripts de parentalité pour chaque moment' : 'Eltern-Skripte für jeden Moment'}
      </p>

      {/* FILTRE PAR ÂGE */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'hsl(var(--foreground))' }}>
          {language === 'fr' ? 'Quel âge?' : 'Welches Alter?'}
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setSelectedAgeRange(null);
              if (selectedCategory) fetchScripts(selectedCategory);
            }}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: !selectedAgeRange ? 'hsl(var(--primary))' : 'hsl(var(--accent))',
              color: !selectedAgeRange ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              transition: 'all 0.3s'
            }}
          >
            {language === 'fr' ? 'Tous les âges' : 'Alle Altersgruppen'}
          </button>
          {ageRanges.map((range) => (
            <button
              key={`${range.min}-${range.max}`}
              onClick={() => handleAgeRangeClick(range)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: selectedAgeRange?.min === range.min ? 'hsl(var(--primary))' : 'hsl(var(--accent))',
                color: selectedAgeRange?.min === range.min ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                transition: 'all 0.3s'
              }}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* CATÉGORIES */}
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'hsl(var(--foreground))' }}>
        {language === 'fr' ? 'Catégories' : 'Kategorien'}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        {categories.map((cat) => (
          <div
            key={cat.id}
            style={{
              padding: '1.5rem',
              border: `2px solid hsl(var(--border))`,
              borderRadius: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
              backgroundColor: selectedCategory === cat.id ? 'hsl(var(--accent))' : 'hsl(var(--card))',
              borderColor: selectedCategory === cat.id ? 'hsl(var(--primary))' : 'hsl(var(--border))'
            }}
            onClick={() => handleCategoryClick(cat.id)}
            onMouseEnter={(e) => e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'}
            onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
          >
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'hsl(var(--foreground))' }}>{cat.name}</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))' }}>{cat.language.toUpperCase()}</p>
          </div>
        ))}
      </div>

      {/* SCRIPTS */}
      {selectedCategory && (
        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'hsl(var(--foreground))' }}>
            {language === 'fr' ? 'Scripts' : 'Skripte'}
          </h2>
          {loading ? (
            <p style={{ color: 'hsl(var(--muted-foreground))' }}>
              {language === 'fr' ? 'Chargement...' : 'Wird geladen...'}
            </p>
          ) : scripts.length > 0 ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {scripts.map((script) => (
                <div
                  key={script.id}
                  style={{
                    padding: '1.5rem',
                    border: `1px solid hsl(var(--border))`,
                    borderRadius: '0.5rem',
                    backgroundColor: script.premium ? 'hsl(var(--accent))' : 'hsl(var(--card))'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, color: 'hsl(var(--foreground))' }}>{script.title}</h3>
                    {script.premium && (
                      <span style={{ padding: '0.25rem 0.5rem', backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', borderRadius: '0.25rem', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        🔒 Premium
                      </span>
                    )}
                  </div>
                  
                  <div style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}>
                    {script.age_min}-{script.age_max} {language === 'fr' ? 'ans' : 'Jahre'}
                  </div>

                  {script.situation && (
                    <div style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}>
                      {script.situation}
                    </div>
                  )}

                  {!script.premium ? (
                    <>
                      <div style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '0.5rem', color: 'hsl(var(--foreground))' }}>
                        {script.content}
                      </div>
                      {script.note && (
                        <div style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'hsl(var(--muted-foreground))' }}>
                          💡 {script.note}
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ padding: '1rem', textAlign: 'center', backgroundColor: 'hsl(var(--secondary))', borderRadius: '0.25rem', marginTop: '1rem' }}>
                      <p style={{ margin: '0 0 0.5rem 0', color: 'hsl(var(--secondary-foreground))' }}>
                        {language === 'fr' ? 'Ce script est disponible pour les membres premium' : 'Dieses Skript ist für Premium-Mitglieder verfügbar'}
                      </p>
                      <button style={{ padding: '0.5rem 1rem', backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: 'bold' }}>
                        {language === 'fr' ? "S'abonner" : 'Abonnieren'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'hsl(var(--muted-foreground))' }}>
              {language === 'fr' ? 'Aucun script trouvé pour cet âge' : 'Keine Skripte für dieses Alter gefunden'}
            </p>
          )}
        </div>
      )}
    </main>
  );
}

export default HomePage;
