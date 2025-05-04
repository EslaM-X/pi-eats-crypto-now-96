
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Restaurant, ShoppingBag, Wallet, CircleDollarSign } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';

export const MobileNavigation: React.FC = () => {
  const location = useLocation();
  const { items } = useCart();
  const { t } = useLanguage();
  
  const routes = [
    {
      path: '/',
      label: t('nav.home'),
      icon: Home
    },
    {
      path: '/restaurants',
      label: t('nav.restaurants'),
      icon: Restaurant,
      matchPaths: ['/restaurants', '/homefood']
    },
    {
      path: '/cart',
      label: t('nav.cart'),
      icon: ShoppingBag,
      badge: items.length > 0 ? items.reduce((sum, item) => sum + item.quantity, 0) : undefined
    },
    {
      path: '/wallet',
      label: t('nav.wallet'),
      icon: Wallet
    },
    {
      path: '/mining',
      label: t('nav.mining'),
      icon: CircleDollarSign
    }
  ];

  const isActive = (route: any) => {
    if (route.path === location.pathname) return true;
    if (route.matchPaths && route.matchPaths.some((path: string) => location.pathname.startsWith(path))) return true;
    return false;
  };

  // Don't show navigation on certain pages
  const hideNavOn = ['/auth/login', '/auth/signup', '/onboarding'];
  if (hideNavOn.includes(location.pathname)) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="flex justify-around items-center h-16">
        {routes.map((route) => {
          const Icon = route.icon;
          const active = isActive(route);
          
          return (
            <Link 
              key={route.path} 
              to={route.path}
              className={`flex flex-col items-center justify-center w-full h-full ${active ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {route.badge && (
                  <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                    {route.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1">{route.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
