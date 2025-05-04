
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const MobileNavbar = () => {
  const { t } = useLanguage();
  const { user } = usePiAuth();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  // Don't show navbar on certain pages
  const hideNavbarOn = ['/auth/login', '/auth/signup', '/onboarding'];
  if (hideNavbarOn.includes(location.pathname)) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">PiEat</span>
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="px-2 lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="lg:hidden">
            <div className="flex flex-col gap-4 py-4">
              {user ? (
                <div className="flex items-center gap-2 mb-6">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.username}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {user.walletAddress}
                    </p>
                  </div>
                </div>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button className="w-full button-gradient">{t('auth.login')}</Button>
                </Link>
              )}

              <nav className="flex flex-col space-y-1">
                <Link 
                  to="/" 
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-md hover:bg-muted"
                >
                  {t('nav.home')}
                </Link>
                <Link 
                  to="/restaurants" 
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-md hover:bg-muted"
                >
                  {t('nav.restaurants')}
                </Link>
                <Link 
                  to="/homefood" 
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-md hover:bg-muted"
                >
                  {t('nav.homeFood')}
                </Link>
                <Link 
                  to="/orders" 
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-md hover:bg-muted"
                >
                  {t('nav.orders')}
                </Link>
                <Link 
                  to="/cart" 
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-md hover:bg-muted"
                >
                  {t('nav.cart')}
                </Link>
                <Link 
                  to="/wallet" 
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-md hover:bg-muted"
                >
                  {t('nav.wallet')}
                </Link>
                <Link 
                  to="/mining" 
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-md hover:bg-muted"
                >
                  {t('nav.mining')}
                </Link>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
