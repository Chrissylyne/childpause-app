import React from 'react';

function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>À propos</h1>
      
      <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#333' }}>
        <p>C'est pour toi.</p>
        
        <p>Pour le matin où tu répètes "mets tes chaussures" pour la cinquième fois, et où tu entends ta propre voix monter d'un cran malgré toi. Pour la crise dans le bus, les regards autour de toi, et cette sensation d'avoir les mains vides au moment où tu en as le plus besoin.</p>
        
        <p>Tu connais ces instants. Pas ceux des livres de parentalité. Les vrais. Ceux qui arrivent trop vite, sans prévenir.</p>
        
        <p>Je suis mère. Et j'ai regardé des femmes extraordinaires autour de moi traverser les mêmes tempêtes, chercher leurs mots dans des moments impossibles.</p>
        
        <p>J'aurais eu besoin, moi aussi, d'une app comme celle-ci. Pas de théories. Pas de jugement. Juste les bons mots, au bon moment.</p>
        
        <p>ChildPause est là pour ces instants précis. Tu ouvres l'app. Tu choisis ta situation. Tu reçois immédiatement des phrases concrètes à dire à ton enfant.</p>
        
        <p><strong>Créée par une mère, pour toutes celles qui font de leur mieux dans les moments les plus difficiles. Les pères aussi, évidemment.</strong></p>
        
        <p style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #ddd' }}>
          Contact: <a href="mailto:contact@childpause.online" style={{ color: '#007bff', textDecoration: 'none' }}>contact@childpause.online</a>
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
