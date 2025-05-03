
import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Pickaxe } from 'lucide-react';
import { PiPriceIndicator } from '../PiPriceIndicator';

interface MobileMenuProps {
  navItems: Array<{
    path: string;
    label: string;
    icon?: React.ReactNode;
    highlight?: boolean;
  }>;
  isOpen: boolean;
  currentPath: string;
  onItemClick: () => void;
}

const MobileMenu = ({ navItems, isOpen, currentPath, onItemClick }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-background/95 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex flex-col space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors ${
                currentPath === item.path ? 'text-pi' : 'text-foreground'
              } ${
                item.highlight 
                ? 'bg-gradient-to-r from-pi to-orange text-white px-3 py-2 rounded-full hover:opacity-90' 
                : ''
              }`}
              onClick={onItemClick}
            >
              {item.icon}
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
  );
};

export default MobileMenu;
