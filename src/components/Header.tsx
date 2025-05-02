
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, ShoppingCart, ChevronDown, Moon, Sun, ChefHat } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PiPriceIndicator } from './PiPriceIndicator';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeContext';

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, login, logout, isAuthenticating } = usePiAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/restaurants', label: t('nav.restaurants') },
    { path: '/homefood', label: 'Home Food' },
    { path: '/homefood/add', label: 'Add Your Food', highlight: true },
    { path: '/orders', label: t('nav.orders') },
    { path: '/wallet', label: t('nav.wallet') },
    { path: '/rewards', label: t('nav.rewards') },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      {/* Pi Network Watermark */}
      <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center overflow-hidden">
        <img 
          src="/lovable-uploads/0934d5ff-e502-465e-8d11-84ba98dcb488.png" 
          alt="Pi Network" 
          className="w-48 h-auto"
        />
      </div>
      
      <div className="container mx-auto px-4 py-3 flex items-center justify-between relative z-10">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-pi to-orange bg-clip-text text-transparent">
              Eat-Me-Pi
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors hover:text-pi ${
                location.pathname === item.path 
                ? 'text-pi' 
                : 'text-muted-foreground'
              } ${
                item.highlight 
                ? 'bg-gradient-to-r from-pi to-orange text-white px-3 py-1 rounded-full hover:opacity-90 hover:text-white' 
                : ''
              }`}
            >
              {item.path === '/homefood/add' && (
                <ChefHat className="h-4 w-4 inline-block mr-1" />
              )}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side items */}
        <div className="flex items-center space-x-4">
          {/* Price Indicator */}
          <div className="hidden md:flex">
            <PiPriceIndicator />
          </div>

          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Language Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Change Language">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                English {language === 'en' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('ar')}>
                العربية {language === 'ar' && '✓'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Cart Button */}
          <Link to="/cart">
            <Button variant="ghost" size="icon" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>

          {/* Auth Button */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-pi text-white">
                      {user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/wallet">{t('nav.wallet')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/rewards">{t('nav.rewards')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders">{t('nav.orders')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  {t('auth.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={login}
              disabled={isAuthenticating}
              className="button-gradient"
            >
              {isAuthenticating ? t('loading') : t('auth.connectWithPi')}
            </Button>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === item.path ? 'text-pi' : 'text-foreground'
                  } ${
                    item.highlight 
                    ? 'bg-gradient-to-r from-pi to-orange text-white px-3 py-2 rounded-full hover:opacity-90' 
                    : ''
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.path === '/homefood/add' && (
                    <ChefHat className="h-4 w-4 inline-block mr-1" />
                  )}
                  {item.label}
                </Link>
              ))}
              <div className="pt-2">
                <PiPriceIndicator />
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
