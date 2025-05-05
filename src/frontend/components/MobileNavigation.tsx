
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, UtensilsCrossed, ChefHat, ShoppingBag, Wallet } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
  const navItems = [
    { path: '/', label: t('nav.home'), icon: <Home className="h-5 w-5" /> },
    { path: '/restaurants', label: t('nav.restaurants'), icon: <UtensilsCrossed className="h-5 w-5" /> },
    { path: '/homefood', label: t('nav.homefood'), icon: <ChefHat className="h-5 w-5" /> },
    { path: '/orders', label: t('nav.orders'), icon: <ShoppingBag className="h-5 w-5" /> },
    { path: '/wallet', label: t('nav.wallet'), icon: <Wallet className="h-5 w-5" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`flex flex-col items-center justify-center space-y-1 ${
              location.pathname === item.path 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span className="text-[10px]">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
