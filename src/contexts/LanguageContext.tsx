
import React, { createContext, useState, useContext, useEffect } from 'react';
import enTranslations from '../locales/en.json';
import arTranslations from '../locales/ar.json';

type LanguageContextType = {
  language: string;
  dir: 'ltr' | 'rtl';
  setLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const translations: Record<string, any> = {
  en: enTranslations,
  ar: arTranslations,
};

// Create language context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  dir: 'ltr',
  setLanguage: () => {},
  t: () => '',
});

// Get nested object value using a path like 'home.welcome'
const getNestedValue = (obj: any, path: string): string => {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === undefined || current === null) {
      return path; // Return the path if we hit undefined
    }
    current = current[key];
  }
  
  return current !== undefined && current !== null ? current.toString() : path;
};

// Replace parameters in the translation string like {name} with actual values
const replaceParams = (text: string, params?: Record<string, string | number>): string => {
  if (!params) return text;
  
  let result = text;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{${key}}`, 'g'), String(value));
  });
  
  return result;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get initial language from localStorage or use browser language or default to 'en'
  const getInitialLanguage = (): string => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) return savedLanguage;
    
    const browserLanguage = navigator.language.split('-')[0];
    return browserLanguage === 'ar' ? 'ar' : 'en';
  };
  
  const [language, setLanguage] = useState<string>(getInitialLanguage());
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  
  // Update document direction and language when language changes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    localStorage.setItem('language', language);
  }, [language, dir]);
  
  // Translation function
  const t = (key: string, params?: Record<string, string | number>): string => {
    const translation = getNestedValue(translations[language], key);
    
    // If translation not found, try English or return key
    if (translation === key && language !== 'en') {
      const enTranslation = getNestedValue(translations.en, key);
      return enTranslation !== key 
        ? replaceParams(enTranslation, params) 
        : key;
    }
    
    return replaceParams(translation, params);
  };
  
  const changeLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };
  
  return (
    <LanguageContext.Provider
      value={{
        language,
        dir,
        setLanguage: changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageProvider;
