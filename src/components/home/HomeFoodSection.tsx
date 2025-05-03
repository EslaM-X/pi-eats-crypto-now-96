
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FoodProviderCard from '../FoodProviderCard';
import { useHomeFood } from '@/contexts/HomeFoodContext';

const HomeFoodSection = () => {
  const { providers, favorites } = useHomeFood();
  
  // Get the latest 3 providers
  const latestProviders = providers.slice(0, 3);
  
  return (
    <section className="py-10 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Home Cooking Near You</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/homefood" className="flex items-center">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {latestProviders.map((provider) => (
            <FoodProviderCard 
              key={provider.id} 
              provider={provider} 
              isFavorite={favorites.includes(provider.id)}
            />
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Button asChild className="button-gradient">
            <Link to="/homefood/add" className="flex items-center">
              Add Your Own Food Listing
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HomeFoodSection;
