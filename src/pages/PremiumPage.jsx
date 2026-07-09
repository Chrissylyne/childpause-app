import React from 'react';

function PremiumPage() {
  return (
    <div style={{ minHeight: '100vh', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>Accès complet</h1>
      <p style={{ fontSize: '1.2rem', textAlign: 'center', color: '#666', marginBottom: '2rem' }}>Tout ce dont tu as besoin, exactement quand tu en as besoin.</p>
      
      <div style={{ fontSize: '1rem', lineHeight: '1.8', color: '#333', marginBottom: '2rem' }}>
        <p>Avec ChildPause Premium, tu débloques l'intégralité des 77 scripts dans les trois catégories, pour toutes les tranches d'âge de 2 à 12 ans.</p>
        
        <h2 style={{ fontSize: '1.3rem', marginTop: '1.5rem', marginBottom: '1rem' }}>Ce qui est débloqué :</h2>
        <ul style={{ marginLeft: '1.5rem' }}>
          <li>Tous les scripts "Quand l'enfant dit non" (2-5 ans, 6-9 ans, 10-12 ans)</li>
          <li>Tous les scripts "Crises et débordements" (2-5 ans, 6-9 ans, 10-12 ans)</li>
          <li>Tous les scripts "Limites et règles" (2-5 ans, 6-9 ans, 10-12 ans)</li>
          <li>Accès immédiat au bouton urgence</li>
          <li>Nouveaux scripts ajoutés régulièrement, sans surcoût</li>
        </ul>
        
        <p style={{ marginTop: '1.5rem' }}>La version gratuite donne accès à 5 scripts par catégorie. Les situations les plus difficiles sont en accès Premium.</p>
        
        <p>Pas de frais cachés. Annulable à tout moment. L'abonnement annuel revient à 2 mois gratuits.</p>
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: '2rem'
      }}>
        <button style={{
          padding: '1rem 2rem',
          fontSize: '1rem',
          backgroundColor: '#9333ea',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          Mensuel — 3,99€/mois
        </button>
        <button style={{
          padding: '1rem 2rem',
          fontSize: '1rem',
          backgroundColor: '#0070BA',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          Annuel — 39€/an
        </button>
      </div>
    </div>
  );
}

export default PremiumPage;
