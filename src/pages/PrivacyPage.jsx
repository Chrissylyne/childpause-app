import React from 'react';

function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Confidentialité</h1>
      
      <div style={{ fontSize: '1rem', lineHeight: '1.8', color: '#333' }}>
        <p>ChildPause collecte uniquement les données nécessaires à la gestion des abonnements: email et informations de paiement.</p>
        
        <p>Ces données ne sont jamais vendues ni partagées avec des tiers. Vous pouvez demander la suppression de vos données à tout moment en écrivant à contact@childpause.online.</p>
        
        <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles.</p>
        
        <p>Les paiements sont traités de manière sécurisée via Stripe.</p>
        
        <p style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #ddd' }}>
          Pour toute question : <a href="mailto:contact@childpause.online" style={{ color: '#007bff', textDecoration: 'none' }}>contact@childpause.online</a>
        </p>
      </div>
    </div>
  );
}

export default PrivacyPage;
