
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, CreditCard, Truck, Star } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const HowItWorks = () => {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  
  const steps = [
    {
      title: language === 'ar' ? t('howItWorks.steps.step1.title') : 'Browse & Order',
      description: language === 'ar' ? t('howItWorks.steps.step1.description') : 'Find restaurants or home cooks near you and order your favorite meals',
      icon: <ShoppingCart className="h-8 w-8" />
    },
    {
      title: language === 'ar' ? t('howItWorks.steps.step2.title') : 'Pay with Pi',
      description: language === 'ar' ? t('howItWorks.steps.step2.description') : 'Securely pay with Pi cryptocurrency, no transaction fees',
      icon: <CreditCard className="h-8 w-8" />
    },
    {
      title: language === 'ar' ? t('howItWorks.steps.step3.title') : 'Get Delivery',
      description: language === 'ar' ? t('howItWorks.steps.step3.description') : 'Enjoy fast delivery right to your doorstep',
      icon: <Truck className="h-8 w-8" />
    },
    {
      title: language === 'ar' ? t('howItWorks.steps.step4.title') : 'Earn Rewards',
      description: language === 'ar' ? t('howItWorks.steps.step4.description') : 'Get PTM tokens and discounts for your orders and reviews',
      icon: <Star className="h-8 w-8" />
    }
  ];
  
  return (
    <section className={`py-16 ${theme === 'dark' ? 'bg-muted/20' : 'bg-muted/30'} rounded-3xl my-10`}>
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-center">
        <span className="bg-gradient-to-r from-pi to-orange bg-clip-text text-transparent">
          {language === 'ar' ? t('home.howItWorks') : 'How It Works'}
        </span>
      </h2>
      <p className="text-muted-foreground mb-12 text-center max-w-2xl mx-auto text-lg">
        {language === 'ar' ? t('howItWorks.subtitle') : 'Order food and pay with Pi cryptocurrency in just a few easy steps'}
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {steps.map((step, index) => (
          <Card key={index} className="relative border border-muted hover:border-pi/30 transition-colors duration-300 hover:shadow-md overflow-hidden group">
            <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-pi to-orange rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300" />
            <span className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-r from-pi to-orange text-white flex items-center justify-center font-bold shadow-lg">
              {index + 1}
            </span>
            <CardHeader>
              <div className="flex justify-center text-pi group-hover:scale-110 transition-transform duration-300">{step.icon}</div>
              <CardTitle className="text-center mt-2 text-xl">{step.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-center text-muted-foreground ${language === 'ar' ? 'arabic-text' : ''}`}>{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
