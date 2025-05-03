
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/home/Hero';
import FeaturedRestaurants from '@/components/home/FeaturedRestaurants';
import HomeFoodSection from '@/components/home/HomeFoodSection';
import FoodCategories from '@/components/home/FoodCategories';
import HowItWorks from '@/components/home/HowItWorks';
import { Container } from '@/components/ui/container';
import { usePiAuth } from '@/contexts/PiAuthContext';

const Index = () => {
  const { user } = usePiAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Container>
          <FeaturedRestaurants />
        </Container>
        <HomeFoodSection />
        <Container>
          <HowItWorks />
        </Container>
        <Container>
          <FoodCategories />
        </Container>
      </main>
      <footer className="bg-muted/20 py-10 mt-10">
        <Container>
          <div className="text-center">
            <p className="text-muted-foreground font-medium">
              &copy; {new Date().getFullYear()} Pieat-Me. All rights reserved. Powered by the Pi Network.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Pi is not affiliated with this application. This is a demo application.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Index;
