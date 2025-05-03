
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import PiEatLogo from '../PiEatLogo';

const Hero = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  return (
    <div className="relative py-12 md:py-20 overflow-hidden">
      {/* Background circles for decoration */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-pi/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="mb-6 inline-flex justify-center">
          <PiEatLogo size="xl" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-pi to-orange bg-clip-text text-transparent">
          {t('home.welcome')}
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 md:mb-10 max-w-3xl mx-auto text-muted-foreground">
          {t('home.subtitle')}
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
          <Button asChild className="button-gradient text-lg h-12 px-8">
            <Link to="/restaurants">{t('nav.restaurants')}</Link>
          </Button>
          <Button asChild variant="outline" className="text-lg h-12 px-8 border-pi hover:bg-pi/10">
            <Link to="/homefood">Browse Home Food</Link>
          </Button>
        </div>
        
        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-muted/30' : 'bg-muted/60'} max-w-2xl mx-auto text-sm text-muted-foreground`}>
          Order food from restaurants or homemade cooks and pay with Pi cryptocurrency.
          <span className="block mt-1 font-medium text-foreground">
            No payment processors. No fees. Just food and Pi.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
