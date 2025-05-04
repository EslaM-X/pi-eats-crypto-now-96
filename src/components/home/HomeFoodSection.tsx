
import React from 'react';
import { ArrowRight, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FoodProviderCard from '../FoodProviderCard';
import { useHomeFood } from '@/contexts/homefood/HomeFoodContext';
import { Container } from '@/components/ui/container';
import { useLanguage } from '@/contexts/LanguageContext';

const HomeFoodSection = () => {
  const { providers, favorites } = useHomeFood();
  const { t } = useLanguage();
  
  // Get the latest 3 providers
  const latestProviders = providers.slice(0, 3);
  
  return (
    <section className="py-16 bg-gradient-to-b from-muted/10 to-muted/30">
      <Container>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">
            <span className="bg-gradient-to-r from-pi to-orange bg-clip-text text-transparent">
              {t('home.homefood')}
            </span>
          </h2>
          <Button variant="ghost" size="sm" asChild className="self-start md:self-auto">
            <Link to="/homefood" className="flex items-center group">
              {t('home.viewAll')}
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {latestProviders.map((provider) => (
            <FoodProviderCard 
              key={provider.id} 
              provider={provider} 
              isFavorite={favorites.includes(provider.id)}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild className="button-gradient rounded-full shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-6 h-auto text-lg group">
            <Link to="/homefood/add" className="flex items-center">
              <ChefHat className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              {t('homefood.addListing')}
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default HomeFoodSection;
