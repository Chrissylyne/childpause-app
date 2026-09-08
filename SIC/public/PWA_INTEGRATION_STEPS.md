# PWA Integration Steps pour ChildPause

## ✅ Fichiers à créer/modifier

### 1. Créer `/public/manifest.json`
Copier le fichier `manifest.json` fourni dans le dossier `/public` de votre projet.

### 2. Créer `/public/sw.js`
Copier le fichier `sw.js` fourni dans le dossier `/public`.

### 3. Créer `src/components/PWAInstallPrompt.jsx`
Copier le fichier `PWAInstallPrompt.jsx` fourni dans `src/components/`.

### 4. Modifier `index.html`
Ajouter cette ligne dans la balise `<head>` :

```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#A8634F">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

Exemple complet :
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ChildPause</title>
    
    <!-- PWA Configuration -->
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#A8634F">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    
    <!-- GA4 -->
    <script async src="..."></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 5. Modifier `src/main.jsx`
Ajouter l'enregistrement du Service Worker :

```jsx
// Après ReactDOM.createRoot(...).render(...)

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then((reg) => console.log('✅ Service Worker registered:', reg))
    .catch((err) => console.log('❌ Service Worker registration failed:', err));
}
```

### 6. Modifier `src/App.jsx`
Ajouter le composant PWAInstallPrompt :

**En haut du fichier :**
```jsx
import PWAInstallPrompt from './components/PWAInstallPrompt';
```

**Dans le rendu (après `<LanguageProvider>` ou au top-level) :**
```jsx
export default function App() {
  return (
    <LanguageProvider>
      <PWAInstallPrompt />  {/* ← Ajouter ici */}
      
      {/* Reste de votre app */}
      <Router>
        {/* ... */}
      </Router>
    </LanguageProvider>
  );
}
```

---

## 🧪 Test en production

1. **Push sur GitHub :**
   ```bash
   git add public/manifest.json public/sw.js src/components/PWAInstallPrompt.jsx
   git commit -m "Add PWA support: manifest, service worker, install prompt"
   git push
   ```

2. **Vercel auto-déploie** (30-60 sec)

3. **Test sur mobile :**
   - Ouvrez https://childpause.online sur un iPhone/Android
   - Vous devriez voir un banner "📱 Installer ChildPause" en bas après ~5 sec
   - Cliquez "Installer"
   - L'app s'ajoute à l'écran d'accueil

---

## 📋 Checklist

- [ ] `/public/manifest.json` créé
- [ ] `/public/sw.js` créé
- [ ] `src/components/PWAInstallPrompt.jsx` créé
- [ ] `index.html` modifié (manifest link + meta tags)
- [ ] `src/main.jsx` modifié (Service Worker registration)
- [ ] `src/App.jsx` modifié (PWAInstallPrompt import + composant)
- [ ] Git push
- [ ] Test sur mobile (iOS/Android)

---

## 🔍 Debugging

**Si le prompt ne s'affiche pas :**
- Ouvrez DevTools → Console
- Cherchez `✅ Service Worker registered`
- Sur Android : menu → "Installer ChildPause"
- Sur iOS : Safari → share → "Add to Home Screen"

**Si le Service Worker ne s'enregistre pas :**
- Vérifiez que `/sw.js` existe et est accessible
- Vérifiez la Console pour les erreurs CORS
