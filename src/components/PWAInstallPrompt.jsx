import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function PWAInstallPrompt() {
  const { language } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response: ${outcome}`);
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1rem',
      left: '1rem',
      right: '1rem',
      maxWidth: '500px',
      margin: '0 auto',
      backgroundColor: 'hsl(var(--primary))',
      color: 'white',
      padding: '1.5rem',
      borderRadius: '0.5rem',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
      zIndex: 1000,
      display: 'flex',
      gap: '1rem',
      alignItems: 'center'
    }}>
      <div style={{ flex: 1 }}>
        <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', fontSize: '1rem' }}>
          {language === 'fr' ? '📱 Installer ChildPause' : '📱 ChildPause installieren'}
        </p>
        <p style={{ margin: '0', fontSize: '0.9rem', opacity: 0.9 }}>
          {language === 'fr' ? 'Ajoute l\'app à ton écran d\'accueil pour y accéder en un clic.' : 'Füge die App zu deinem Startbildschirm hinzu für schnellen Zugriff.'}
        </p>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={handleInstall} style={{ padding: '0.75rem 1.5rem', backgroundColor: 'white', color: 'hsl(var(--primary))', border: 'none', borderRadius: '0.4rem', fontWeight: 'bold', cursor: 'pointer' }}>
          {language === 'fr' ? 'Installer' : 'Installieren'}
        </button>
        <button onClick={handleDismiss} style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '0.4rem', cursor: 'pointer' }}>✕</button>
      </div>
    </div>
  );
}