
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const UserMenu = () => {
  const { user, login, logout, isAuthenticating } = usePiAuth();
  const { t } = useLanguage();

  if (!user) {
    return (
      <Button
        onClick={login}
        disabled={isAuthenticating}
        className="button-gradient"
      >
        {isAuthenticating ? t('loading') : t('auth.connectWithPi')}
      </Button>
    );
  }

  return (
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
          <Link to="/mining">Mining</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/orders">{t('nav.orders')}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout}>
          {t('auth.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
