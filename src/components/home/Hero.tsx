
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import PiEatLogo from '../PiEatLogo';
import { Container } from '@/components/ui/container';
import { useIsMobile } from '@/hooks/use-mobile';

const Hero = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  
  return (
    <div className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-pi/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange/10 rounded-full blur-3xl" />
      
      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
            <PiEatLogo size={isMobile ? "lg" : "xl"} showEmoji={true} />
          </div>
          
          {language === 'ar' ? (
            <div className="flex flex-col gap-3 mb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange animate-pulse-slow">
                {t('home.welcomeHighlight')}
              </h2>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-pi to-orange bg-clip-text text-transparent">
                {t('home.welcome')}
              </h1>
            </div>
          ) : (
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-pi to-orange bg-clip-text text-transparent">
              {t('home.welcome')}
            </h1>
          )}
          
          <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-muted-foreground leading-relaxed">
            {t('home.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 w-full max-w-md mx-auto">
            <Button asChild className="button-gradient text-lg h-12 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              <Link to="/restaurants">{t('nav.restaurants')}</Link>
            </Button>
            <Button asChild variant="outline" className="text-lg h-12 px-8 border-pi hover:bg-pi/10 rounded-full">
              <Link to="/homefood">{t('home.homefood')}</Link>
            </Button>
          </div>
          
          <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-muted/40 backdrop-blur-lg' : 'glass-card'} max-w-2xl mx-auto`}>
            <p className="text-muted-foreground">
              {t('app.tagline')}
            </p>
            <p className="mt-2 font-medium text-foreground">
              {t('tagline.subtitle')}
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Hero;
