
import React, { createContext, useContext, useState, useEffect } from 'react';

// Language options
type Language = 'en' | 'ar';

// Translations
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.restaurants': 'Restaurants',
    'nav.homefood': 'Home Food',
    'nav.addFood': 'Add Food',
    'nav.orders': 'Orders',
    'nav.wallet': 'Wallet',
    'nav.rewards': 'Rewards',
    'nav.mining': 'Mining',
    
    // Home Page
    'home.welcome': 'Order Food with Pi Cryptocurrency',
    'home.subtitle': 'Delicious meals from restaurants and home cooks, paid with Pi Network cryptocurrency',
    'home.featured': 'Featured Restaurants',
    'home.categories': 'Food Categories',
    'home.viewAll': 'View All',
    'home.homefood': 'Home Food',
    
    // Common
    'loading': 'Loading...',
    'error': 'Something went wrong',
    'app.tagline': 'Connecting good food with cryptocurrency payments',
    'tagline.subtitle': 'Order food from restaurants or home cooks and pay with Pi Network cryptocurrency',
    'food.addToCart': 'Add',
    
    // Authentication
    'auth.connectWithPi': 'Connect with Pi',
    'auth.logout': 'Logout',
    
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    
    // Theme
    'theme.light': 'Light Mode',
    'theme.dark': 'Dark Mode',
    
    // Pi
    'pi.viewOnOKX': 'View Pi on OKX Exchange',
    
    // Wallet
    'wallet.lastUpdated': 'Last Updated',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.restaurants': 'المطاعم',
    'nav.homefood': 'طعام منزلي',
    'nav.addFood': 'أضف طعام',
    'nav.orders': 'الطلبات',
    'nav.wallet': 'المحفظة',
    'nav.rewards': 'المكافآت',
    'nav.mining': 'التعدين',
    
    // Home Page
    'home.welcome': 'اطلب الطعام بعملة Pi المشفرة',
    'home.subtitle': 'وجبات لذيذة من المطاعم والطهاة المنزليين، مدفوعة بعملة Pi Network المشفرة',
    'home.featured': 'مطاعم مميزة',
    'home.categories': 'فئات الطعام',
    'home.viewAll': 'عرض الكل',
    'home.homefood': 'طعام منزلي',
    
    // Common
    'loading': 'جاري التحميل...',
    'error': 'حدث خطأ ما',
    'app.tagline': 'ربط الطعام الجيد بمدفوعات العملات المشفرة',
    'tagline.subtitle': 'اطلب الطعام من المطاعم أو الطهاة المنزليين وادفع بعملة Pi Network المشفرة',
    'food.addToCart': 'أضف',
    
    // Authentication
    'auth.connectWithPi': 'الاتصال مع Pi',
    'auth.logout': 'تسجيل الخروج',
    
    // Cart
    'cart.title': 'عربة التسوق',
    'cart.empty': 'عربة التسوق فارغة',
    
    // Theme
    'theme.light': 'الوضع الفاتح',
    'theme.dark': 'الوضع الداكن',
    
    // Pi
    'pi.viewOnOKX': 'عرض Pi على منصة OKX',
    
    // Wallet
    'wallet.lastUpdated': 'آخر تحديث',
  }
};

// Context interface
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  
  useEffect(() => {
    // Get stored language preference
    const storedLanguage = localStorage.getItem('language') as Language;
    if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'ar')) {
      setLanguageState(storedLanguage);
    } else {
      // Detect browser language
      const browserLanguage = navigator.language.split('-')[0];
      if (browserLanguage === 'ar') {
        setLanguageState('ar');
      }
    }
  }, []);
  
  // Update document direction based on language
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Store language preference
    localStorage.setItem('language', language);
  }, [language]);
  
  // Set language
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };
  
  // Translate function
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
