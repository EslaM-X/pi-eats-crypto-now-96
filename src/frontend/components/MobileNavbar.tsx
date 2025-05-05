import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PiEatLogo from '@/components/PiEatLogo';

export const MobileNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // No need to show navbar on home page
  if (location.pathname === '/') {
    return null;
  }
  
  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path.includes('/restaurants/')) {
      return 'Restaurant Details';
    }
    else if (path.includes('/homefood/add')) {
      return 'Add Food Listing';
    }
    else if (path.includes('/homefood/')) {
      return 'Food Provider';
    }
    else if (path === '/restaurants') {
      return 'Restaurants';
    }
    else if (path === '/homefood') {
      return 'Home Food';
    }
    else if (path === '/wallet') {
      return 'Wallet';
    }
    else if (path === '/rewards') {
      return 'Rewards';
    }
    else if (path === '/mining') {
      return 'Mining';
    }
    else if (path === '/orders') {
      return 'Orders';
    }
    else if (path === '/cart') {
      return 'Cart';
    }
    else if (path === '/pi-payment') {
      return 'Pi Payment';
    }
    
    return '';
  };
  
  const title = getPageTitle();
  
  // If no title is found, don't render the navbar
  if (!title) {
    return null;
  }
  
  const shouldShowBackButton = location.pathname !== '/restaurants' && 
                             location.pathname !== '/homefood' && 
                             location.pathname !== '/wallet' && 
                             location.pathname !== '/rewards' && 
                             location.pathname !== '/mining' && 
                             location.pathname !== '/orders' && 
                             location.pathname !== '/cart';
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-md shadow-sm z-50 h-14 md:hidden">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center">
          {shouldShowBackButton ? (
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={() => window.history.back()}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          ) : (
            <Link to="/" className="mr-2">
              <PiEatLogo size="sm" />
            </Link>
          )}
          <h1 className="font-semibold">{title}</h1>
        </div>
      </div>
    </div>
  );
};
