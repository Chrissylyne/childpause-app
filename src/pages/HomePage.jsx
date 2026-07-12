import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

export default function HomePage() {
  const { language } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [scripts, setScripts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  
  // ← AJOUT REF POUR SCROLL
  const categoriesRef = useRef(null);

  // ← AJOUT FONCTION SCROLL
  const handleCrisisClick = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    fetchCategories();
    checkUserPremium();
  }, [language]);

  useEffect(() => {
    if (selectedCategory) {
      fetchScripts(selectedCategory);
    }
  }, [selectedCategory, language]);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('langue', language)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Erreur chargement catégories:', error);
    } else {
      setCategories(data || []);
      if (data && data.length > 0) {
        setSelectedCategory(data[0].id);
      }
    }
    setLoading(false);
  };

  const fetchScripts = async (categoryId) => {
    const { data, error } = await supabase
      .from('scripts')
      .select('*')
      .eq('categorie', categoryId)
      .eq('langue', language)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Erreur chargement scripts:', error);
    } else {
      setScripts(data || []);
    }
  };

  const checkUserPremium = async () => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
      const { data } = await supabase
        .from('users')
        .select('is_premium')
        .eq('email', email)
        .single();
      if (data) {
        setIsPremium(data.is_premium);
      }
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const canAccessScript = (script) => {
    if (!script.premium) return true;
    return isPremium;
  };

  const handleSubscribe = () => {
    window.location.href = '/premium';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'hsl(var(--background))' }}>
      
      {/* ===== SECTION HÉROS - URGENCE ===== */}
      <section style={{
        padding: '2rem 1rem',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto',
        paddingTop: '3rem',
        paddingBottom: '2rem'
      }}>
        
        {/* Titre principal */}
        <h1 style={{
          fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: 'hsl(var(--foreground))',
          lineHeight: '1.2'
        }}>
          {language === 'fr'
            ? 'Mon enfant est en crise maintenant'
            : 'Mein Kind ist gerade in einer Krise'
          }
        </h1>

        {/* Sous-titre émotionnel */}
        <p style={{
          fontSize: '1.1rem',
          marginBottom: '2rem',
          color: 'hsl(var(--foreground) / 0.8)',
          lineHeight: '1.6'
        }}>
          {language === 'fr'
            ? 'Tu cherches les bons mots. Les voici.'
            : 'Du suchst nach den richtigen Worten. Hier sind sie.'
          }
        </p>

        {/* BOUTON CTA PRINCIPAL - AVEC onClick */}
        <button
          onClick={handleCrisisClick}
          style={{
            padding: '1rem 2rem',
            backgroundColor: 'hsl(var(--primary))',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            width: '100%',
            maxWidth: '400px',
            marginBottom: '1rem'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'hsl(var(--primary) / 0.9)';
            e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
            e.target.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'hsl(var(--primary))';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          {language === 'fr'
            ? 'Trouver une solution maintenant →'
            : 'Jetzt eine Lösung finden →'
          }
        </button>

        {/* Phrase de confiance */}
        <p style={{
          fontSize: '0.9rem',
          color: 'hsl(var(--foreground) / 0.6)',
          marginTop: '1rem'
        }}>
          {language === 'fr'
            ? '5 scripts gratuits par catégorie. Inspiré par la parentalité positive et la communication émotionnelle.'
            : '5 Skripte kostenlos pro Kategorie. Inspiriert von positiver Erziehung und emotionaler Kommunikation.'
          }
        </p>
      </section>

      {/* ===== SECTION CATÉGORIES - AVEC REF ===== */}
      <section
        ref={categoriesRef}
        style={{
          padding: '2rem 1rem',
          backgroundColor: 'hsl(var(--card))',
          borderTop: '1px solid hsl(var(--border))',
          marginTop: '2rem'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Titre catégories */}
          <h2 style={{
            fontSize: '1.8rem',
            marginBottom: '1.5rem',
            color: 'hsl(var(--foreground))',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            {language === 'fr' ? 'Choisir une situation' : 'Wähle eine Situation'}
          </h2>

          {/* Grille des catégories */}
          {loading ? (
            <div style={{ textAlign: 'center', color: 'hsl(var(--foreground) / 0.6))' }}>
              {language === 'fr' ? 'Chargement...' : 'Wird geladen...'}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  style={{
                    padding: '1.5rem',
                    border: `2px solid ${selectedCategory === cat.id ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backgroundColor: selectedCategory === cat.id ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--background))',
                    boxShadow: selectedCategory === cat.id ? '0 4px 12px hsl(var(--primary) / 0.2)' : 'none'
                  }}
                  onClick={() => handleCategoryClick(cat.id)}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== cat.id) {
                      e.currentTarget.style.borderColor = 'hsl(var(--primary) / 0.5)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== cat.id) {
                      e.currentTarget.style.borderColor = 'hsl(var(--border))';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <h3 style={{
                    margin: '0 0 0.5rem 0',
                    color: 'hsl(var(--foreground))',
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}>
                    {cat.nom}
                  </h3>
                  <p style={{
                    margin: '0',
                    fontSize: '0.9rem',
                    color: 'hsl(var(--foreground) / 0.6))'
                  }}>
                    {cat.script_count || scripts.filter(s => s.categorie === cat.id).length} scripts
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== SECTION SCRIPTS ===== */}
      {selectedCategory && (
        <section style={{
          padding: '2rem 1rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          
          {/* Titre scripts */}
          <h2 style={{
            fontSize: '1.5rem',
            marginBottom: '1.5rem',
            color: 'hsl(var(--foreground))',
            fontWeight: 'bold'
          }}>
            {language === 'fr' ? 'Solutions disponibles' : 'Verfügbare Lösungen'}
          </h2>

          {/* Liste des scripts */}
          {scripts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: 'hsl(var(--foreground) / 0.6))'
            }}>
              {language === 'fr' ? 'Aucun script trouvé' : 'Keine Skripte gefunden'}
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {scripts.map((script, index) => {
                const isFree = index < 5;
                const isAccessible = canAccessScript(script);

                return (
                  <div
                    key={script.id}
                    style={{
                      padding: '1.5rem',
                      border: `1px solid hsl(var(--border))`,
                      borderRadius: '0.5rem',
                      backgroundColor: 'hsl(var(--card))',
                      position: 'relative',
                      opacity: isAccessible ? 1 : 0.6
                    }}
                  >
                    {/* Badge Premium ou Gratuit */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.5rem'
                    }}>
                      <h3 style={{
                        margin: 0,
                        color: 'hsl(var(--foreground))',
                        fontSize: '1.1rem',
                        fontWeight: 'bold'
                      }}>
                        {script.titre}
                      </h3>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        backgroundColor: isFree ? 'hsl(120, 100%, 85%)' : 'hsl(var(--primary) / 0.2)',
                        color: isFree ? 'hsl(120, 100%, 25%)' : 'hsl(var(--primary))',
                        whiteSpace: 'nowrap'
                      }}>
                        {isFree ? (language === 'fr' ? '✓ Gratuit' : '✓ Kostenlos') : '🔒 Premium'}
                      </span>
                    </div>

                    {/* Contenu du script */}
                    {isAccessible ? (
                      <p style={{
                        margin: '0.5rem 0',
                        color: 'hsl(var(--foreground))',
                        lineHeight: '1.6',
                        fontSize: '0.95rem'
                      }}>
                        {script.contenu}
                      </p>
                    ) : (
                      <div style={{
                        padding: '1rem',
                        backgroundColor: 'hsl(var(--primary) / 0.1)',
                        borderRadius: '0.4rem',
                        textAlign: 'center'
                      }}>
                        <p style={{
                          margin: '0.5rem 0',
                          color: 'hsl(var(--primary))',
                          fontWeight: 'bold'
                        }}>
                          {language === 'fr'
                            ? 'Ce script est réservé aux membres premium'
                            : 'Dieses Skript ist nur für Premium-Mitglieder verfügbar'
                          }
                        </p>
                        <button
                          onClick={handleSubscribe}
                          style={{
                            marginTop: '0.5rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: 'hsl(var(--primary))',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.4rem',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            transition: 'background-color 0.3s'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'hsl(var(--primary) / 0.9)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'hsl(var(--primary))'}
                        >
                          {language === 'fr' ? "S'abonner" : 'Abonnieren'}
                        </button>
                      </div>
                    )}

                    {/* Infos supplémentaires */}
                    {script.age_min && script.age_max && (
                      <p style={{
                        marginTop: '0.75rem',
                        fontSize: '0.85rem',
                        color: 'hsl(var(--foreground) / 0.6))',
                        margin: '0.75rem 0 0 0'
                      }}>
                        {language === 'fr' ? 'Âge:' : 'Alter:'} {script.age_min}-{script.age_max} ans
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ===== FOOTER CONFIANCE ===== */}
      <section style={{
        padding: '2rem 1rem',
        textAlign: 'center',
        borderTop: '1px solid hsl(var(--border))',
        marginTop: '3rem',
        color: 'hsl(var(--foreground) / 0.6))',
        fontSize: '0.9rem'
      }}>
        <p>
          {language === 'fr'
            ? '✨ Créée par une mère. Pour tous ceux qui font de leur mieux.'
            : '✨ Erstellt von einer Mutter. Für alle, die ihr Bestes geben.'
          }
        </p>
      </section>
    </div>
  );
}
