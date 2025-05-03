
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/home/Hero';
import FeaturedRestaurants from '@/components/home/FeaturedRestaurants';
import HomeFoodSection from '@/components/home/HomeFoodSection';
import FoodCategories from '@/components/home/FoodCategories';
import HowItWorks from '@/components/home/HowItWorks';
import { usePiAuth } from '@/contexts/PiAuthContext';

const Index = () => {
  const { user } = usePiAuth();
  
  return (
    <div>
      <Header />
      <main>
        <Hero />
        <FeaturedRestaurants />
        <HomeFoodSection />
        <HowItWorks />
        <FoodCategories />
      </main>
      <footer className="py-8 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>
            &copy; {new Date().getFullYear()} Pieat-Me. All rights reserved. Powered by the Pi Network.
          </p>
          <p className="mt-2">
            Pi is not affiliated with this application. This is a demo application.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
