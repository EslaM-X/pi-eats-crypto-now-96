
import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, ShoppingCart, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { PiPriceIndicator } from '../PiPriceIndicator';
import UserMenu from './UserMenu';

const HeaderActions = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`flex items-center ${language === 'ar' ? 'space-x-reverse' : ''} space-x-4`}>
      {/* Price Indicator */}
      <div className="hidden md:flex">
        <PiPriceIndicator />
      </div>

      {/* Theme Toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? t('theme.light') : t('theme.dark')}
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
        <DropdownMenuContent align={language === 'ar' ? "start" : "end"}>
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
        <Button variant="ghost" size="icon" aria-label={t('cart.title')}>
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </Link>

      {/* User Menu */}
      <UserMenu />
    </div>
  );
};

export default HeaderActions;
