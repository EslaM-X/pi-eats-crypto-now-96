
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const translations = {
  en: {
    // Header
    'app.title': 'Eat-Me-Pi',
    'app.tagline': 'Order Food with Pi Cryptocurrency',
    'nav.home': 'Home',
    'nav.restaurants': 'Restaurants',
    'nav.orders': 'My Orders',
    'nav.wallet': 'Wallet',
    'nav.rewards': 'Rewards',
    
    // Authentication
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.connectWithPi': 'Connect with Pi Network',
    
    // Home
    'home.welcome': 'Welcome to Eat-Me-Pi',
    'home.subtitle': 'Order your favorite food using Pi cryptocurrency',
    'home.featured': 'Featured Restaurants',
    'home.nearYou': 'Near You',
    'home.viewAll': 'View All',
    
    // Restaurants
    'restaurant.search': 'Search restaurants...',
    'restaurant.filters': 'Filters',
    'restaurant.rating': 'Rating',
    'restaurant.price': 'Price',
    'restaurant.distance': 'Distance',
    
    // Food items
    'food.addToCart': 'Add to Cart',
    'food.customize': 'Customize',
    
    // Cart
    'cart.title': 'Your Cart',
    'cart.empty': 'Your cart is empty',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.items': 'items',
    
    // Wallet
    'wallet.balance': 'Balance',
    'wallet.send': 'Send',
    'wallet.receive': 'Receive',
    'wallet.transactions': 'Transactions',
    'wallet.topUp': 'Top Up',
    
    // Rewards
    'rewards.available': 'Available Rewards',
    'rewards.points': 'Points',
    'rewards.redeem': 'Redeem',
    
    // Pi Price
    'pi.currentPrice': 'Current Pi Price',
    'pi.lastUpdated': 'Last updated',
    
    // Misc
    'loading': 'Loading...',
    'error': 'Something went wrong',
    'retry': 'Retry',
    'cancel': 'Cancel',
    'confirm': 'Confirm',
  },
  ar: {
    // Header
    'app.title': 'إيت-مي-باي',
    'app.tagline': 'اطلب الطعام بعملة باي المشفرة',
    'nav.home': 'الرئيسية',
    'nav.restaurants': 'المطاعم',
    'nav.orders': 'طلباتي',
    'nav.wallet': 'المحفظة',
    'nav.rewards': 'المكافآت',
    
    // Authentication
    'auth.login': 'تسجيل الدخول',
    'auth.logout': 'تسجيل الخروج',
    'auth.connectWithPi': 'الاتصال بشبكة باي',
    
    // Home
    'home.welcome': 'مرحبًا بك في إيت-مي-باي',
    'home.subtitle': 'اطلب طعامك المفضل باستخدام عملة باي المشفرة',
    'home.featured': 'مطاعم مميزة',
    'home.nearYou': 'بالقرب منك',
    'home.viewAll': 'عرض الكل',
    
    // Restaurants
    'restaurant.search': 'بحث عن مطاعم...',
    'restaurant.filters': 'التصفية',
    'restaurant.rating': 'التقييم',
    'restaurant.price': 'السعر',
    'restaurant.distance': 'المسافة',
    
    // Food items
    'food.addToCart': 'أضف إلى السلة',
    'food.customize': 'تخصيص',
    
    // Cart
    'cart.title': 'سلة التسوق',
    'cart.empty': 'سلة التسوق فارغة',
    'cart.total': 'المجموع',
    'cart.checkout': 'الدفع',
    'cart.items': 'عناصر',
    
    // Wallet
    'wallet.balance': 'الرصيد',
    'wallet.send': 'إرسال',
    'wallet.receive': 'استلام',
    'wallet.transactions': 'المعاملات',
    'wallet.topUp': 'شحن الرصيد',
    
    // Rewards
    'rewards.available': 'المكافآت المتاحة',
    'rewards.points': 'النقاط',
    'rewards.redeem': 'استبدال',
    
    // Pi Price
    'pi.currentPrice': 'سعر باي الحالي',
    'pi.lastUpdated': 'آخر تحديث',
    
    // Misc
    'loading': 'جاري التحميل...',
    'error': 'حدث خطأ ما',
    'retry': 'إعادة المحاولة',
    'cancel': 'إلغاء',
    'confirm': 'تأكيد',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Load language preference from local storage if it exists
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguage(savedLanguage);
    }

    // Set the direction attribute for RTL support
    document.body.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
  }, [language]);

  const handleSetLanguage = (newLanguage: Language) => {
    localStorage.setItem('language', newLanguage);
    setLanguage(newLanguage);
    document.body.setAttribute('dir', newLanguage === 'ar' ? 'rtl' : 'ltr');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
