
import React, { createContext, useState, useContext, useEffect } from 'react';
import translations from '../locales';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, string>) => string;
  rtl: boolean;
}

const DEFAULT_LANGUAGE = 'en';
const LANGUAGE_STORAGE_KEY = 'preferred_language';

// Create the context
const LanguageContext = createContext<LanguageContextType | null>(null);

// Create the provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);
  const rtl = language === 'ar';

  useEffect(() => {
    // Try to get user's saved language preference
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguageState(savedLanguage);
    } else {
      // If no saved preference, try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'ar') {
        setLanguageState('ar');
      }
    }
  }, []);

  // Update HTML dir attribute when language changes
  useEffect(() => {
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, rtl]);

  const setLanguage = (lang: string) => {
    if (lang === 'en' || lang === 'ar') {
      setLanguageState(lang);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
  };

  // Translation function
  const t = (key: string, params?: Record<string, string>): string => {
    // Split the key by dots to access nested properties
    const keys = key.split('.');
    
    // Get the current language translations
    const currentTranslations = (translations as any)[language] || (translations as any).en;
    
    // Navigate through the keys
    let translation = currentTranslations;
    for (const k of keys) {
      translation = translation?.[k];
      
      // If translation is not found, fall back to English
      if (translation === undefined) {
        translation = (translations as any).en;
        for (const fallbackKey of keys) {
          translation = translation?.[fallbackKey];
          if (translation === undefined) {
            return key; // Return the key if translation is not found
          }
        }
      }
    }
    
    // If the translation is not a string, return the key
    if (typeof translation !== 'string') {
      return key;
    }
    
    // Replace parameters in the translation if provided
    if (params) {
      return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
        return acc.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue);
      }, translation);
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, rtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Create a custom hook for using the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
