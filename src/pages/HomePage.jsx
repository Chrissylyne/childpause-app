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

  // Script exemple supermarché (générique pour tous les âges)
  const exampleScript = language === 'fr' ? {
    title: 'Crise au supermarché',
    situation: 'Ton enfant fait une crise parce qu\'il veut quelque chose',
    content: 'Je vois que tu veux vraiment cette chose. Je comprends que c\'est difficile quand on n\'a pas ce qu\'on veut. Mais là c\'est non. Je sais que ça te rend triste. On va trouver ensemble une autre chose qui te plaît.',
    note: 'Valide son émotion, reste ferme, redonne du pouvoir'
  } : {
    title: 'Krise im Supermarkt',
    situation: 'Dein Kind hat einen Zusammenbruch, weil es etwas haben will',
    content: 'Ich sehe, dass du das wirklich willst. Ich verstehe, dass es schwierig ist, wenn man das nicht bekommt, was man möchte. Aber das geht nicht. Ich weiß, dass es dich traurig macht. Wir finden zusammen etwas anderes, das dir Freude macht.',
    note: 'Validiere die Emotion, bleib konsequent, gib Macht zurück'
  };

  // Testimonials
  const testimonials = language === 'fr' ? [
    {
      text: 'Ça m\'apaise de savoir que j\'ai ça sous la main. Quand mon fils crie, je n\'ai plus besoin de me demander quoi dire.',
      name: 'Luisa',
      context: 'Maman de 3 enfants'
    },
    {
      text: 'Je pensais que je faisais tout mal. Voir que d\'autres parents disent les mêmes choses m\'a rassurée.',
      name: 'Sophie',
      context: 'Maman de 2 enfants'
    }
  ] : [
    {
      text: 'Es beruhigt mich zu wissen, dass ich das zur Hand habe. Wenn mein Sohn schreit, brauche ich nicht mehr zu überlegen, was ich sagen soll.',
      name: 'Luisa',
      context: 'Mutter von 3 Kindern'
    },
    {
      text: 'Ich dachte, ich mache alles falsch. Zu sehen, dass andere Eltern dasselbe sagen, hat mich beruhigt.',
      name: 'Maria',
      context: 'Mutter von 2 Kindern'
    }
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
      setSelectedCategory(null);
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

      {/* SCRIPT D'EXEMPLE */}
      <div style={{ padding: '1.5rem', backgroundColor: 'hsl(var(--accent))', borderRadius: '0.5rem', marginBottom: '2rem', border: '1px solid hsl(var(--border))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
          <h3 style={{ margin: 0, color: 'hsl(var(--foreground))' }}>{exampleScript.title}</h3>
          <span style={{ padding: '0.25rem 0.5rem', backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 'bold' }}>
            {language === 'fr' ? 'EXEMPLE GRATUIT' : 'KOSTENLOSES BEISPIEL'}
          </span>
        </div>
        <div style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.75rem' }}>
          {exampleScript.situation}
        </div>
        <div style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '0.75rem', color: 'hsl(var(--foreground))' }}>
          {exampleScript.content}
        </div>
        <div style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'hsl(var(--muted-foreground))' }}>
          💡 {exampleScript.note}
        </div>
      </div>

      {/* FREEMIUM BADGE */}
      <div style={{ padding: '1rem', backgroundColor: 'hsl(var(--secondary))', borderRadius: '0.5rem', marginBottom: '2rem', border: '1px solid hsl(var(--border))', textAlign: 'center' }}>
        <p style={{ margin: '0 0 0.5rem 0', color: 'hsl(var(--secondary-foreground))', fontWeight: 'bold', fontSize: '0.95rem' }}>
          🔓 {language === 'fr' ? 'Accès gratuit : 5 scripts par catégorie' : 'Kostenloser Zugang: 5 Skripte pro Kategorie'}
        </p>
        <p style={{ margin: 0, color: 'hsl(var(--secondary-foreground))', fontSize: '0.85rem' }}>
          {language === 'fr' ? 'Accès complet à 3,99€/mois • Annulable à tout moment' : 'Vollzugriff ab 3,99€/Monat • Jederzeit kündbar'}
        </p>
      </div>

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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
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

      {/* TESTIMONIALS */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'hsl(var(--foreground))' }}>
          {language === 'fr' ? 'Ce que les parents disent' : 'Was Eltern sagen'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              style={{
                padding: '1.5rem',
                backgroundColor: 'hsl(var(--card))',
                borderRadius: '0.5rem',
                border: '1px solid hsl(var(--border))',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <p style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem', color: 'hsl(var(--foreground))', fontStyle: 'italic' }}>
                « {testimonial.text} »
              </p>
              <div style={{ marginTop: 'auto' }}>
                <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold', color: 'hsl(var(--foreground))' }}>
                  {testimonial.name}
                </p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))' }}>
                  {testimonial.context}
                </p>
              </div>
            </div>
          ))}
        </div>
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
                     <button onClick={() => window.location.href = '/premium'} style={{ padding: '0.5rem 1rem', backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: 'bold' }}>
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
