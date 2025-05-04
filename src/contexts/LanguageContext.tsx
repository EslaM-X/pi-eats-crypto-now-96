
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Arabic translations
const arTranslations = {
  // Common/Shared
  loading: 'جاري التحميل...',
  
  // App name/branding
  app: {
    name: 'بي إيت-مي',
    tagline: 'اطلب الطعام واحصل على التوصيل باستخدام عملة باي - سهلة، آمنة، وسريعة!'
  },
  
  // Navigation
  nav: {
    home: 'الرئيسية',
    restaurants: 'المطاعم',
    homefood: 'طبخ منزلي',
    addFood: 'أضف طعامك',
    orders: 'الطلبات',
    wallet: 'المحفظة',
    rewards: 'المكافآت',
    mining: 'التعدين'
  },
  
  // Authentication
  auth: {
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    register: 'التسجيل',
    connectWithPi: 'الاتصال بـ π'
  },
  
  // Home page
  home: {
    welcome: 'اطلب الطعام وادفع باستخدام π',
    subtitle: 'أول منصة طعام في مصر تقبل مدفوعات باي كريبتو',
    featured: 'المطاعم المميزة',
    categories: 'فئات الطعام',
    nearYou: 'بالقرب منك',
    homefood: 'طبخ منزلي',
    viewAll: 'عرض الكل'
  },
  
  // Restaurants/Food
  restaurants: {
    search: 'البحث عن مطاعم...',
    filter: 'تصفية',
    sort: 'ترتيب حسب',
    cuisineType: 'نوع المطبخ'
  },
  
  // Food items
  food: {
    addToCart: 'إضافة للسلة',
    viewDetails: 'عرض التفاصيل',
    ingredients: 'المكونات',
    nutritionalInfo: 'معلومات غذائية',
    allergens: 'مسببات الحساسية',
    reviews: 'المراجعات'
  },
  
  // Cart
  cart: {
    title: 'سلة التسوق',
    empty: 'سلة التسوق فارغة',
    checkout: 'الدفع',
    subtotal: 'المجموع الفرعي',
    deliveryFee: 'رسوم التوصيل',
    total: 'المجموع',
    itemCount: 'عدد العناصر',
    clearCart: 'إفراغ السلة'
  },
  
  // Orders
  order: {
    status: {
      pending: 'قيد الانتظار',
      confirmed: 'مؤكد',
      preparing: 'قيد التحضير',
      ready: 'جاهز',
      delivering: 'قيد التوصيل',
      delivered: 'تم التوصيل',
      cancelled: 'ملغي'
    },
    trackOrder: 'تتبع الطلب',
    reorder: 'إعادة الطلب',
    orderDetails: 'تفاصيل الطلب',
    orderHistory: 'سجل الطلبات'
  },
  
  // Wallet
  wallet: {
    balance: 'الرصيد',
    send: 'إرسال',
    receive: 'استلام',
    transaction: 'معاملة',
    transactions: 'المعاملات',
    history: 'السجل',
    lastUpdated: 'آخر تحديث',
    topUp: 'شحن',
    withdraw: 'سحب',
    convert: 'تحويل',
    piNetworkWallet: 'محفظة شبكة باي',
    piTokenWallet: 'محفظة رمز باي',
    connect: 'ربط'
  },
  
  // Pi related
  pi: {
    viewOnOKX: 'عرض على OKX',
    currentValue: 'القيمة الحالية',
    rate: 'معدل',
    change24h: 'تغيير 24 ساعة'
  },
  
  // Rewards
  rewards: {
    available: 'المكافآت المتاحة',
    history: 'سجل المكافآت',
    redeem: 'استبدال',
    earn: 'اكسب',
    points: 'نقاط'
  },
  
  // Mining
  mining: {
    startMining: 'ابدأ التعدين',
    stopMining: 'إيقاف التعدين',
    miningRate: 'معدل التعدين',
    earnedToday: 'المكتسب اليوم',
    totalEarned: 'إجمالي المكتسب',
    watchAd: 'مشاهدة إعلان للاستمرار',
    inviteFriends: 'دعوة الأصدقاء',
    boostRate: 'تعزيز معدل التعدين'
  },

  // Theme
  theme: {
    light: 'وضع النهار',
    dark: 'الوضع المظلم'
  },
  
  // Home cooking
  homeCooking: {
    becomeChef: 'كن طباخاً',
    yourListings: 'قوائمك',
    addListing: 'إضافة قائمة',
    cuisine: 'المطبخ',
    location: 'الموقع'
  },
  
  // Reviews
  review: {
    writeReview: 'كتابة مراجعة',
    rating: 'التقييم',
    comment: 'التعليق'
  },
  
  // Messages
  messages: {
    send: 'إرسال',
    reply: 'رد',
    writeMessage: 'اكتب رسالة...'
  },

  // Taglines
  tagline: {
    subtitle: 'طلب الطعام في القاهرة لم يكن أسهل من قبل!'
  }
};

// English translations
const enTranslations = {
  // Common/Shared
  loading: 'Loading...',
  
  // App name/branding
  app: {
    name: 'PiEat-Me',
    tagline: 'Order food and get delivery using Pi currency - easy, secure, and fast!'
  },
  
  // Navigation
  nav: {
    home: 'Home',
    restaurants: 'Restaurants',
    homefood: 'Home Food',
    addFood: 'Add Your Food',
    orders: 'Orders',
    wallet: 'Wallet',
    rewards: 'Rewards',
    mining: 'Mining'
  },
  
  // Authentication
  auth: {
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    connectWithPi: 'Connect with π'
  },
  
  // Home page
  home: {
    welcome: 'Order Food & Pay with π',
    subtitle: 'First food platform in Egypt accepting Pi cryptocurrency payments',
    featured: 'Featured Restaurants',
    categories: 'Food Categories',
    nearYou: 'Near You',
    homefood: 'Home Cooking',
    viewAll: 'View All'
  },
  
  // Restaurants/Food
  restaurants: {
    search: 'Search restaurants...',
    filter: 'Filter',
    sort: 'Sort by',
    cuisineType: 'Cuisine Type'
  },
  
  // Food items
  food: {
    addToCart: 'Add to Cart',
    viewDetails: 'View Details',
    ingredients: 'Ingredients',
    nutritionalInfo: 'Nutritional Info',
    allergens: 'Allergens',
    reviews: 'Reviews'
  },
  
  // Cart
  cart: {
    title: 'Shopping Cart',
    empty: 'Your cart is empty',
    checkout: 'Checkout',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery Fee',
    total: 'Total',
    itemCount: 'Item Count',
    clearCart: 'Clear Cart'
  },
  
  // Orders
  order: {
    status: {
      pending: 'Pending',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      ready: 'Ready',
      delivering: 'Delivering',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    },
    trackOrder: 'Track Order',
    reorder: 'Reorder',
    orderDetails: 'Order Details',
    orderHistory: 'Order History'
  },
  
  // Wallet
  wallet: {
    balance: 'Balance',
    send: 'Send',
    receive: 'Receive',
    transaction: 'Transaction',
    transactions: 'Transactions',
    history: 'History',
    lastUpdated: 'Last Updated',
    topUp: 'Top Up',
    withdraw: 'Withdraw',
    convert: 'Convert',
    piNetworkWallet: 'Pi Network Wallet',
    piTokenWallet: 'Pi Token Wallet',
    connect: 'Connect'
  },
  
  // Pi related
  pi: {
    viewOnOKX: 'View on OKX',
    currentValue: 'Current Value',
    rate: 'Rate',
    change24h: '24h Change'
  },
  
  // Rewards
  rewards: {
    available: 'Available Rewards',
    history: 'Reward History',
    redeem: 'Redeem',
    earn: 'Earn',
    points: 'Points'
  },
  
  // Mining
  mining: {
    startMining: 'Start Mining',
    stopMining: 'Stop Mining',
    miningRate: 'Mining Rate',
    earnedToday: 'Earned Today',
    totalEarned: 'Total Earned',
    watchAd: 'Watch Ad to Continue',
    inviteFriends: 'Invite Friends',
    boostRate: 'Boost Mining Rate'
  },

  // Theme
  theme: {
    light: 'Light Mode',
    dark: 'Dark Mode'
  },
  
  // Home cooking
  homeCooking: {
    becomeChef: 'Become a Chef',
    yourListings: 'Your Listings',
    addListing: 'Add Listing',
    cuisine: 'Cuisine',
    location: 'Location'
  },
  
  // Reviews
  review: {
    writeReview: 'Write a Review',
    rating: 'Rating',
    comment: 'Comment'
  },
  
  // Messages
  messages: {
    send: 'Send',
    reply: 'Reply',
    writeMessage: 'Write a message...'
  },

  // Taglines
  tagline: {
    subtitle: 'Food ordering in Cairo has never been easier!'
  }
};

// Types for context values
type LanguageContextType = {
  language: string;
  setLanguage: (language: 'en' | 'ar') => void;
  t: (key: string) => string;
  translations: typeof enTranslations;
};

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
  translations: enTranslations,
});

// Provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<'en' | 'ar'>(
    localStorage.getItem('language') as 'en' | 'ar' || 'en'
  );
  const [translations, setTranslations] = useState(
    language === 'ar' ? arTranslations : enTranslations
  );

  // Update translations when language changes
  useEffect(() => {
    setTranslations(language === 'ar' ? arTranslations : enTranslations);
    localStorage.setItem('language', language);
    
    // Update the document direction
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    
    // Add or remove RTL specific class
    if (language === 'ar') {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = translations;

    // Navigate through the nested object
    for (const k of keys) {
      if (result[k] === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
      result = result[k];
    }

    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
