
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PiEatLogo from '@/components/PiEatLogo';

export const MobileNavbar = () => {
  const { pathname } = useLocation();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  // Don't show navbar on certain pages
  if (pathname === '/cart') {
    return null;
  }

  return (
    <div className="sticky top-0 left-0 right-0 z-50 md:hidden bg-background shadow-sm border-b border-muted/10">
      <div className="flex items-center justify-between p-3">
        <Link to="/" className="flex items-center space-x-2">
          <PiEatLogo size="sm" />
          <span className="text-lg font-bold bg-gradient-to-r from-pi to-orange bg-clip-text text-transparent">
            Pieat-Me
          </span>
        </Link>
        
        <Link to="/cart">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className={cn(
              "h-5 w-5",
              itemCount > 0 ? "text-pi" : ""
            )} />
            
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-pi">
                {itemCount > 99 ? '99+' : itemCount}
              </Badge>
            )}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavbar;
