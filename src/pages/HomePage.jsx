import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

export default function HomePage() {
  const { language } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const categoriesRef = useRef(null); // ← AJOUTER LA REF

  // ← AJOUTER LA FONCTION
  const handleCrisisClick = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ... rest du code (fetch categories, etc.)

  return (
    <div>
      {/* SECTION HÉROS */}
      <section style={{ padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          {language === 'fr' 
            ? "Mon enfant est en crise maintenant"
            : "Mein Kind ist gerade in einer Krise"
          }
        </h1>
        
        {/* BOUTON AVEC LE onClick */}
        <button
          onClick={handleCrisisClick}
          style={{
            padding: '1rem 2rem',
            backgroundColor: 'hsl(var(--primary))',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1.1rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {language === 'fr'
            ? "Trouver une solution maintenant →"
            : "Jetzt eine Lösung finden →"
          }
        </button>
      </section>

      {/* SECTION CATÉGORIES AVEC LA REF */}
      <div ref={categoriesRef}> {/* ← AJOUTER ref={categoriesRef} ICI */}
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
      </div>
    </div>
  );
}
