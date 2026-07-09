import React from 'react';

function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Conditions d'utilisation</h1>
      
      <div style={{ fontSize: '1rem', lineHeight: '1.8', color: '#333' }}>
        <p>En utilisant ChildPause vous acceptez les conditions suivantes.</p>
        
        <p>L'abonnement mensuel est de 3,99€/mois et l'abonnement annuel de 39€/an.</p>
        
        <p>Vous pouvez annuler à tout moment depuis vos paramètres. Aucun remboursement pour la période en cours.</p>
        
        <p>Les scripts proposés sont des suggestions de communication bienveillante. Ils ne constituent pas un avis médical ou psychologique.</p>
        
        <p style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #ddd' }}>
          <strong>© 2026 ChildPause — Tous droits réservés</strong>
        </p>
        
        <p>L'ensemble du contenu de ce site (scripts, formulations, textes, structure et design) est protégé par le droit d'auteur. Toute reproduction, même partielle, tout usage commercial, toute adaptation ou diffusion sans autorisation écrite préalable est strictement interdite.</p>
        
        <p style={{ marginTop: '2rem' }}>
          Pour toute question : <a href="mailto:contact@childpause.online" style={{ color: '#007bff', textDecoration: 'none' }}>contact@childpause.online</a>
        </p>
      </div>
    </div>
  );
}

export default TermsPage;
