
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Utensils, ChefHat, ShoppingBag, Wallet, Pickaxe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

export const MobileNavigation = () => {
  const { pathname } = useLocation();
  const { language, t } = useLanguage();
  const { theme } = useTheme();
  
  const isCurrentPath = (path: string) => {
    if (path === '/') return pathname === path;
    return pathname.startsWith(path);
  };
  
  const navItems = [
    { path: '/', icon: <Home className="h-5 w-5" />, label: t('nav.home') },
    { path: '/restaurants', icon: <Utensils className="h-5 w-5" />, label: t('nav.restaurants') },
    { path: '/homefood', icon: <ChefHat className="h-5 w-5" />, label: t('nav.homefood') },
    { path: '/orders', icon: <ShoppingBag className="h-5 w-5" />, label: t('nav.orders') },
    { path: '/wallet', icon: <Wallet className="h-5 w-5" />, label: t('nav.wallet') },
    { path: '/mining', icon: <Pickaxe className="h-5 w-5" />, label: t('nav.mining') },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className={cn(
        "flex items-center justify-between p-3 border-t shadow-lg",
        theme === 'dark' ? 'bg-background/95 border-muted/20' : 'bg-background/95 backdrop-blur-md border-muted/10'
      )}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 p-2 rounded-md transition-colors",
              isCurrentPath(item.path) 
                ? "text-pi" 
                : "text-muted-foreground",
              language === 'ar' && "flex-row-reverse"
            )}
          >
            {item.icon}
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;
