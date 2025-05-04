
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import translations from '../locales';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
  dir: 'ltr',
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Get saved language or default to 'en'
  const savedLanguage = localStorage.getItem('language') as Language;
  const [language, setLanguageState] = useState<Language>(savedLanguage || 'en');
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  // Function to translate text
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    // Navigate through nested objects
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return value;
  };

  // Set language and update localStorage
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // Update document attributes when language changes
  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
    
    // Add language-specific class to body for styling
    if (language === 'ar') {
      document.body.classList.add('ar');
    } else {
      document.body.classList.remove('ar');
    }
  }, [language, dir]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => useContext(LanguageContext);

export default LanguageProvider;
