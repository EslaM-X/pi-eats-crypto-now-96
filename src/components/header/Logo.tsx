
import React from 'react';
import { Link } from 'react-router-dom';
import PiEatLogo from '../PiEatLogo';
import { useLanguage } from '@/contexts/LanguageContext';

const Logo = () => {
  const { language } = useLanguage();
  
  return (
    <Link to="/" className="flex items-center space-x-2">
      <PiEatLogo />
      <span className={`text-2xl font-bold bg-gradient-to-r from-pi to-orange bg-clip-text text-transparent ${language === 'ar' ? 'app-name mr-2' : ''}`}>
        PiEat-Me
      </span>
    </Link>
  );
};

export default Logo;
