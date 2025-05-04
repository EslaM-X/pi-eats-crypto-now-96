
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Utensils, ShoppingBag, Wallet, Award, Pickaxe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export const MobileNavigation = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const navItems = [
    { path: '/', label: t('nav.home'), icon: <Home className="h-5 w-5" /> },
    { path: '/restaurants', label: t('nav.restaurants'), icon: <Utensils className="h-5 w-5" /> },
    { path: '/homefood', label: t('nav.homefood'), icon: <ShoppingBag className="h-5 w-5" /> },
    { path: '/wallet', label: t('nav.wallet'), icon: <Wallet className="h-5 w-5" /> },
    { path: '/mining', label: t('nav.mining'), icon: <Pickaxe className="h-5 w-5" /> }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden z-50">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link 
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-2",
                isActive ? "text-pi" : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "p-1 rounded-full",
                isActive ? "bg-pi/10" : ""
              )}>
                {item.icon}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
