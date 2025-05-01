
import React from 'react';
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="text-8xl font-bold text-pi mb-4">404</div>
        <h1 className="text-2xl font-bold mb-6">{t('error.pageNotFound')}</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          {t('error.pageDoesNotExist')}
        </p>
        
        <Link to="/">
          <Button className="button-gradient">
            {t('error.backToHome')}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
