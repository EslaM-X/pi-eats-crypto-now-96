
import React, { createContext, useContext, useState } from 'react';

// Add the new translations for Pi price
const translations = {
  en: {
    loading: 'Loading...',
    nav: {
      home: 'Home',
      restaurants: 'Restaurants',
      homefood: 'Home Food',
      wallet: 'Wallet',
      rewards: 'Rewards',
      orders: 'Orders',
      mining: 'Mining',
      addFood: 'Add Food Listing'
    },
    auth: {
      login: 'Login',
      logout: 'Logout',
      connectWithPi: 'Connect with π',
    },
    home: {
      welcome: 'Order Food with Pi Cryptocurrency',
      subtitle: 'Discover local restaurants and home cooking, pay with Pi. No transaction fees.',
      featured: 'Featured Restaurants',
      viewAll: 'View All',
      categories: 'Food Categories',
      homefood: 'Home Cooking',
    },
    app: {
      tagline: 'The first food delivery app accepting Pi cryptocurrency payments in Egypt',
    },
    tagline: {
      subtitle: 'Support local businesses and home chefs directly',
    },
    food: {
      addToCart: 'Add',
    },
    cart: {
      title: 'Cart',
    },
    theme: {
      light: 'Light Mode',
      dark: 'Dark Mode',
    },
    pi: {
      viewOnOKX: 'View on OKX Exchange',
    },
    wallet: {
      lastUpdated: 'Last Updated',
    },
  },
  ar: {
    loading: 'جاري التحميل...',
    nav: {
      home: 'الرئيسية',
      restaurants: 'المطاعم',
      homefood: 'طعام منزلي',
      wallet: 'المحفظة',
      rewards: 'المكافآت',
      orders: 'الطلبات',
      mining: 'التعدين',
      addFood: 'إضافة طعام'
    },
    auth: {
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      connectWithPi: 'ربط بـ π',
    },
    home: {
      welcome: 'اطلب الطعام بعملة Pi المشفرة',
      subtitle: 'اكتشف المطاعم المحلية والطبخ المنزلي، وادفع باستخدام Pi. بدون رسوم معاملات.',
      featured: 'مطاعم مميزة',
      viewAll: 'عرض الكل',
      categories: 'فئات الطعام',
      homefood: 'طبخ منزلي',
    },
    app: {
      tagline: 'أول تطبيق توصيل طعام يقبل مدفوعات عملة Pi المشفرة في مصر',
    },
    tagline: {
      subtitle: 'ادعم الشركات المحلية وطهاة المنزل مباشرة',
    },
    food: {
      addToCart: 'إضافة',
    },
    cart: {
      title: 'السلة',
    },
    theme: {
      light: 'الوضع الفاتح',
      dark: 'الوضع الداكن',
    },
    pi: {
      viewOnOKX: 'عرض في منصة OKX',
    },
    wallet: {
      lastUpdated: 'آخر تحديث',
    },
  },
};

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('en');

  const t = (key: string) => {
    const keys = key.split('.');
    let translation: any = translations[language as keyof typeof translations];
    
    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        return key; // Fallback to key if translation not found
      }
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
