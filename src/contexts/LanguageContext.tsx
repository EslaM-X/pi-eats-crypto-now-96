
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// تعريف نوع البيانات للغة
type Language = 'en' | 'ar';

// تعريف نوع البيانات للسياق
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

// إنشاء السياق
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
  dir: 'ltr'
});

// ترجمات الكلمات والجمل
const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.restaurants': 'Restaurants',
    'nav.homefood': 'Home Food',
    'nav.addFood': 'Add Food',
    'nav.orders': 'Orders',
    'nav.wallet': 'Wallet',
    'nav.rewards': 'Rewards',
    'nav.mining': 'Mining',
    'home.featured': 'Featured Restaurants',
    'home.viewAll': 'View All',
    'home.categories': 'Food Categories',
    'food.addToCart': 'Add to Cart',
    'cart.title': 'Cart',
    'loading': 'Loading...',
    'theme.light': 'Light Mode',
    'theme.dark': 'Dark Mode',
    'pi.viewOnOKX': 'View on OKX Exchange',
    'wallet.refresh': 'Refresh',
    'wallet.lastUpdated': 'Last updated',
    'auth.connectWithPi': 'Connect with π',
    'auth.logout': 'Logout',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.restaurants': 'المطاعم',
    'nav.homefood': 'طعام منزلي',
    'nav.addFood': 'إضافة طعام',
    'nav.orders': 'الطلبات',
    'nav.wallet': 'المحفظة',
    'nav.rewards': 'المكافآت',
    'nav.mining': 'التعدين',
    'home.featured': 'مطاعم مميزة',
    'home.viewAll': 'عرض الكل',
    'home.categories': 'فئات الطعام',
    'food.addToCart': 'أضف إلى السلة',
    'cart.title': 'السلة',
    'loading': 'جاري التحميل...',
    'theme.light': 'الوضع المضيء',
    'theme.dark': 'الوضع الداكن',
    'pi.viewOnOKX': 'عرض في منصة OKX',
    'wallet.refresh': 'تحديث',
    'wallet.lastUpdated': 'آخر تحديث',
    'auth.connectWithPi': 'الاتصال بـ π',
    'auth.logout': 'تسجيل الخروج',
  }
};

// مزود السياق
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // محاولة استرداد اللغة من التخزين المحلي
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage === 'ar' || savedLanguage === 'en') ? savedLanguage : 'en';
  });

  // تغيير اللغة
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    // تعيين اتجاه الصفحة بناء على اللغة
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  // تطبيق اتجاه الصفحة عند التحميل
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // دالة الترجمة
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir: language === 'ar' ? 'rtl' : 'ltr' }}>
      {children}
    </LanguageContext.Provider>
  );
};

// hook للاستخدام في المكونات
export const useLanguage = () => useContext(LanguageContext);
