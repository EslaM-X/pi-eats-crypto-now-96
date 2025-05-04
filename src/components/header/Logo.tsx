
import React from 'react';
import { Link } from 'react-router-dom';
import PiEatLogo from '../PiEatLogo';
import { useLanguage } from '@/contexts/LanguageContext';

const Logo = () => {
  const { language } = useLanguage();
  
  return (
    <Link to="/" className="flex items-center logo-container no-reverse">
      <div className={`${language === 'ar' ? 'flex flex-row-reverse' : 'flex'}`}>
        <PiEatLogo />
        <span className={`text-2xl font-bold bg-gradient-to-r from-pi to-orange bg-clip-text text-transparent ${language === 'ar' ? 'mr-2 app-name' : ''}`}>
          PiEat-Me
        </span>
      </div>
    </Link>
  );
};

export default Logo;
