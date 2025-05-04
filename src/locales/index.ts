
import en from './en';
import ar from './ar';

// Export all translations
const translations = {
  en,
  ar
};

export default translations;

// Helper function to get a translation by key and language
export const getTranslation = (key: string, language: 'en' | 'ar') => {
  const keys = key.split('.');
  let result: any = translations[language];
  
  for (const k of keys) {
    if (result && result[k] !== undefined) {
      result = result[k];
    } else {
      return key; // Fallback to key if translation not found
    }
  }
  
  return typeof result === 'string' ? result : key;
};

// Add missing translations from one language to another (for development)
export const findMissingTranslations = () => {
  const missingKeys: Record<string, string[]> = {
    ar: [],
    en: []
  };
  
  // Check AR for missing EN keys
  checkMissingKeys(en, ar, 'ar', '', missingKeys.ar);
  
  // Check EN for missing AR keys
  checkMissingKeys(ar, en, 'en', '', missingKeys.en);
  
  return missingKeys;
};

// Helper for findMissingTranslations
const checkMissingKeys = (
  source: Record<string, any>,
  target: Record<string, any>,
  targetLang: string,
  prefix: string,
  missingKeys: string[]
) => {
  Object.keys(source).forEach(key => {
    const currentKey = prefix ? `${prefix}.${key}` : key;
    
    if (!(key in target)) {
      missingKeys.push(currentKey);
    } else if (
      typeof source[key] === 'object' && 
      source[key] !== null &&
      typeof target[key] === 'object' &&
      target[key] !== null
    ) {
      checkMissingKeys(source[key], target[key], targetLang, currentKey, missingKeys);
    }
  });
};
