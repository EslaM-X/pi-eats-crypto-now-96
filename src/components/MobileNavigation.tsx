
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Utensils, 
  ShoppingCart, 
  Clock, 
  Wallet, 
  Gift, 
  Pickaxe 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { useCart } from '@/contexts/CartContext';

const MobileNavigation = () => {
  const location = useLocation();
  const { user } = usePiAuth();
  const { items } = useCart();
  const cartItemCount = items.length;
  
  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Home' },
    { path: '/restaurants', icon: <Utensils size={20} />, label: 'Food' },
    { path: '/cart', icon: <ShoppingCart size={20} />, label: 'Cart', badge: cartItemCount },
    { path: '/orders', icon: <Clock size={20} />, label: 'Orders' },
    { path: '/wallet', icon: <Wallet size={20} />, label: 'Wallet' },
    { path: '/rewards', icon: <Gift size={20} />, label: 'Rewards' },
    { path: '/mining', icon: <Pickaxe size={20} />, label: 'Mining' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full px-1 text-xs",
              location.pathname === item.path 
                ? "text-pi font-medium" 
                : "text-muted-foreground"
            )}
          >
            <div className="relative">
              {item.icon}
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-pi text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </div>
            <span className="mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;
