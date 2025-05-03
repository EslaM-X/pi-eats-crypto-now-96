
import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';

interface NavItemsProps {
  items: Array<{
    path: string;
    label: string;
    icon?: React.ReactNode;
    highlight?: boolean;
  }>;
  currentPath: string;
}

const NavItems = ({ items, currentPath }: NavItemsProps) => {
  return (
    <nav className="hidden md:flex items-center space-x-6 overflow-visible">
      {items.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`text-sm font-medium transition-colors hover:text-pi ${
            currentPath === item.path 
            ? 'text-pi' 
            : 'text-muted-foreground'
          } ${
            item.highlight 
            ? 'bg-gradient-to-r from-pi to-orange text-white px-3 py-1 rounded-full hover:opacity-90 hover:text-white' 
            : ''
          }`}
        >
          {item.icon}
          {item.path === '/homefood/add' && (
            <ChefHat className="h-4 w-4 inline-block mr-1" />
          )}
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default NavItems;
