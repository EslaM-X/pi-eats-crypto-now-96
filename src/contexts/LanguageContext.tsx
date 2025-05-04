
import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { enTranslations } from '../translations/en';
import { arTranslations } from '../translations/ar';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  rtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Get from localStorage or default to 'en'
  const storedLang = localStorage.getItem('language') as Language || 'en';
  const [language, setLanguageState] = useState<Language>(storedLang);
  const rtl = language === 'ar';

  // Update document direction when language changes
  useEffect(() => {
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Add a class to the body for specific RTL styling if needed
    if (rtl) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [rtl, language]);

  // Translation function
  const t = useCallback((key: string) => {
    const translations = language === 'en' ? enTranslations : arTranslations;
    const keys = key.split('.');
    
    // Navigate through nested objects
    let result = translations as any;
    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return result as string;
  }, [language]);

  // Set language and store in localStorage
  const setLanguage = useCallback((lang: Language) => {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
  }, []);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
    rtl
  }), [language, setLanguage, t, rtl]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
