import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';

export default function HomePage() {
  const { language } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [allScripts, setAllScripts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  const [isPremium, setIsPremium] = useState(false);

  // Fonction scroll vers les catégories
  const handleCrisisClick = () => {
    const element = document.getElementById('categories-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    fetchCategoriesAndScripts();
    checkUserPremium();
  }, [language]);

  // Charger catégories ET TOUS les scripts en une seule requête
  const fetchCategoriesAndScripts = async () => {
    setLoading(true);
    console.log('🔄 Fetching categories pour langue:', language);
    
    // Charger les catégories
    const { data: categoriesData, error: catError } = await supabase
      .from('categories')
      .select('*')
      .eq('language', language)
      .order('created_at', { ascending: true });

    if (catError) {
      console.error('❌ Erreur chargement catégories:', catError);
    } else {
      console.log('✓ Catégories chargées:', categoriesData);
      setCategories(categoriesData || []);
      if (categoriesData && categoriesData.length > 0) {
        setSelectedCategory(categoriesData[0].id);
      }
    }

    // Charger TOUS les scripts (pour les comptages + affichage)
    console.log('🔄 Fetching ALL scripts pour langue:', language);
    const { data: scriptsData, error: scriptsError } = await supabase
      .from('scripts')
      .select('*')
      .eq('langue', language)
      .order('created_at', { ascending: true });

    if (scriptsError) {
      console.error('❌ Erreur chargement scripts:', scriptsError);
    } else {
      console.log('✓ TOUS les scripts chargés:', scriptsData?.length, 'scripts');
      setAllScripts(scriptsData || []);
    }

    setLoading(false);
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

  const getScriptsForCategory = (categoryId) => {
    return allScripts
      .filter(s => s.category_id === categoryId)
      .sort((a, b) => {
        // Scripts gratuits (premium=FALSE) EN PREMIER
        if (a.premium === false && b.premium === true) return -1;
        if (a.premium === true && b.premium === false) return 1;
        // Sinon, ordre de création
        return new Date(a.created_at) - new Date(b.created_at);
      });
  };

  const canAccessScript = (script) => {
    if (!script.premium) return true;
    return isPremium;
  };

  const handleSubscribe = () => {
    window.location.href = '/premium';
  };

  // Scripts affichés actuellement
  const displayedScripts = selectedCategory ? getScriptsForCategory(selectedCategory) : [];

  // Témoignages des mamans
  const testimonials = {
    fr: [
      {
        text: "Quand mon fils pique une crise au supermarché, j'avais des palpitations. Maintenant avec ChildPause, j'ai les mots tout prêts. Ça change vraiment.",
        author: "Luisa, maman de 2 enfants"
      },
      {
        text: "Je pensais que j'étais la seule à me sentir bloquée dans ces moments difficiles. Ces scripts m'ont sauvé — j'y vois plus clair et mon enfant aussi.",
        author: "Sophie, maman de 3 enfants"
      }
    ],
    de: [
      {
        text: "Mika raubte mir echt den Nerv – aber mit ChildPause finde ich in der Hitze des Moments ruhiger die richtigen Worte. Es hilft enorm.",
        author: "Luisa, Mutter von 2 Kindern"
      },
      {
        text: "Ich dachte, ich bin alleine mit diesen Herausforderungen. Diese App hat mir gezeigt, dass ich gar nicht so hilflos bin. Eine echte Erleichterung.",
        author: "Anna, Mutter von 3 Kindern"
      }
    ]
  };

  const currentTestimonials = testimonials[language] || testimonials.fr;

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

        {/* BOUTON CTA PRINCIPAL - AVEC onClick FONCTIONNEL */}
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

      {/* ===== SECTION CATÉGORIES - AVEC ID POUR SCROLL ===== */}
      <section
        id="categories-section"
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

          {/* État de chargement ou debug */}
          {loading ? (
            <div style={{ textAlign: 'center', color: 'hsl(var(--foreground) / 0.6))' }}>
              {language === 'fr' ? 'Chargement...' : 'Wird geladen...'}
            </div>
          ) : categories.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              color: 'hsl(var(--foreground) / 0.6))',
              backgroundColor: 'hsl(var(--background))',
              borderRadius: '0.5rem'
            }}>
              <p>{language === 'fr' ? 'Aucune catégorie trouvée' : 'Keine Kategorien gefunden'}</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              {categories.map((cat) => {
                const scriptCount = getScriptsForCategory(cat.id).length;
                return (
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
                      {scriptCount} {language === 'fr' ? 'solutions' : 'Lösungen'}
                    </p>
                  </div>
                );
              })}
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
          {displayedScripts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: 'hsl(var(--foreground) / 0.6))'
            }}>
              {language === 'fr' ? 'Aucun script trouvé' : 'Keine Skripte gefunden'}
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {displayedScripts.map((script, index) => {
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
                        {script.title}
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
                        {script.content}
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

      {/* ===== SECTION TÉMOIGNAGES ===== */}
      <section style={{
        padding: '3rem 1rem',
        backgroundColor: 'hsl(168, 100%, 97%)',
        marginTop: '3rem',
        borderTop: '1px solid hsl(var(--border))',
        borderBottom: '1px solid hsl(var(--border))'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '1.8rem',
            marginBottom: '2rem',
            color: 'hsl(var(--foreground))',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            {language === 'fr' ? 'Ce que disent les mamans' : 'Das sagen die Mütter'}
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {currentTestimonials.map((testimonial, index) => (
              <div
                key={index}
                style={{
                  padding: '2rem',
                  backgroundColor: 'hsl(16, 80%, 90%)',
                  borderRadius: '0.5rem',
                  borderLeft: '4px solid hsl(var(--primary))',
                  textAlign: 'center'
                }}
              >
                <p style={{
                  fontSize: '1rem',
                  color: 'hsl(var(--foreground))',
                  fontStyle: 'italic',
                  lineHeight: '1.8',
                  margin: '0 0 1rem 0'
                }}>
                  "{testimonial.text}"
                </p>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'hsl(var(--foreground) / 0.7)',
                  fontWeight: 'bold',
                  margin: '0'
                }}>
                  — {testimonial.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
            ? ' Créée par une mère. Pour tous ceux qui font de leur mieux.'
            : ' Erstellt von einer Mutter. Für alle, die ihr Bestes geben.'
          }
        </p>
      </section>
    </div>
  );
}
