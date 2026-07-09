import { useLanguage } from '../contexts/LanguageContext.jsx';
import { translations } from './translations.js';

export function useTranslations() {
  const { language } = useLanguage();

  const t = (key, defaultValue = '') => {
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return defaultValue || key;
      }
    }

    return value || defaultValue || key;
  };

  return { t, language };
}
