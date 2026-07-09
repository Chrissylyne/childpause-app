import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('fr');
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  console.log('useLanguage context:', context); // ← Ajoute ça
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
