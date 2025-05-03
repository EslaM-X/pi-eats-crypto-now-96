import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Utensils, MapPin, Star, TrendingUp, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { usePiPrice } from '@/contexts/PiPriceContext';
import RestaurantCard from '@/components/RestaurantCard';
import Header from '@/components/Header';

const mockRestaurants = [
  {
    id: '1',
    name: 'Pi Burger Fusion',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=1000',
    cuisine: 'Burgers, American',
    rating: 4.7,
    deliveryTime: '25-35 min',
    priceRange: '$$',
    featured: true,
  },
  {
    id: '2',
    name: 'Digital Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000',
    cuisine: 'Pizza, Italian',
    rating: 4.5,
    deliveryTime: '20-30 min',
    priceRange: '$$',
    featured: true,
  },
  {
    id: '3',
    name: 'Crypto Curry House',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1000',
    cuisine: 'Indian, Curry',
    rating: 4.3,
    deliveryTime: '30-40 min',
    priceRange: '$$$',
  },
  {
    id: '4',
    name: 'Blockchain Bistro',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000',
    cuisine: 'French, Continental',
    rating: 4.8,
    deliveryTime: '35-45 min',
    priceRange: '$$$',
    featured: true,
  },
];

const mockCategories = [
  { id: '1', name: 'Fast Food', icon: '🍔' },
  { id: '2', name: 'Pizza', icon: '🍕' },
  { id: '3', name: 'Asian', icon: '🍜' },
  { id: '4', name: 'Healthy', icon: '🥗' },
  { id: '5', name: 'Desserts', icon: '🍰' },
  { id: '6', name: 'Drinks', icon: '🍹' },
];

const Index = () => {
  const { t } = useLanguage();
  const { user, login } = usePiAuth();
  const { priceData } = usePiPrice();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-10">
        {/* Hero Section */}
        <section className="relative rounded-3xl overflow-hidden shadow-xl">
          <div className="bg-gradient-to-r from-[#9b87f5] to-[#ffb347] p-8 md:p-12 lg:p-16">
            <div className="max-w-2xl space-y-4">
              <div className="mb-4">
                <img 
                  src="/lovable-uploads/0934d5ff-e502-465e-8d11-84ba98dcb488.png"
                  alt="Pi Network" 
                  className="w-20 h-20 mb-2"
                />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Welcome to Pieat-Me
              </h1>
              <p className="text-lg text-white/90">
                {t('home.subtitle')}
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={t('restaurant.search')}
                    className="pl-10 bg-white/90 border-none h-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Link to="/restaurants">
                  <Button className="button-gradient h-12 px-6">
                    {t('restaurant.search')}
                  </Button>
                </Link>
              </div>
              
              <div className="pt-6">
                <Link to="/homefood/add">
                  <Button className="bg-white text-[#9b87f5] hover:bg-white/90 h-12 flex items-center gap-2">
                    <ChefHat className="h-5 w-5" />
                    Add Your Home Food
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Categories Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{t('home.categories')}</h2>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {mockCategories.map((category) => (
              <Link
                key={category.id}
                to={`/restaurants?category=${category.id}`}
                className="bg-card hover:bg-accent/50 transition-colors rounded-xl p-4 text-center shadow-md hover:shadow-lg"
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <span className="text-sm font-medium">{category.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Restaurants */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#ffb347] bg-clip-text text-transparent">
              {t('home.featured')}
            </h2>
            <Link to="/restaurants" className="text-[#9b87f5] flex items-center">
              {t('home.viewAll')} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockRestaurants
              .filter(r => r.featured)
              .map((restaurant) => (
                <RestaurantCard key={restaurant.id} {...restaurant} />
              ))}
          </div>
        </section>
        
        {/* Home Food Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#ffb347] to-[#9b87f5] bg-clip-text text-transparent">
              Homemade Food
            </h2>
            <Link to="/homefood" className="text-[#9b87f5] flex items-center">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="relative p-6 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-[#9b87f5]/10 to-[#ffb347]/10 border border-[#9b87f5]/20">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-1/3">
                <img 
                  src="https://images.unsplash.com/photo-1554998171-706e730d721d?w=800"
                  alt="Home Food"
                  className="rounded-xl shadow-md"
                />
              </div>
              <div className="md:w-2/3 space-y-4">
                <h3 className="text-2xl font-bold">Share Your Culinary Talents</h3>
                <p className="text-muted-foreground">
                  Are you a great home cook? Share your delicious meals with the community and earn Pi.
                  Join our network of home chefs and small restaurants providing authentic experiences.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild className="button-gradient">
                    <Link to="/homefood/add">
                      <ChefHat className="mr-2 h-4 w-4" />
                      Add Your Food
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/homefood">
                      Explore Home Food
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 flex flex-col items-center text-center shadow-md hover:shadow-lg transition-all">
              <div className="bg-[#9b87f5]/10 p-4 rounded-full mb-4">
                <Utensils className="h-8 w-8 text-[#9b87f5]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Top Restaurants</h3>
              <p className="text-muted-foreground">Order from the best local restaurants with Eat-Me-Pi</p>
            </div>
            
            <div className="glass-card p-6 flex flex-col items-center text-center shadow-md hover:shadow-lg transition-all">
              <div className="bg-[#ffb347]/10 p-4 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-[#ffb347]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">Quick delivery to your doorstep, track in real-time</p>
            </div>
            
            <div className="glass-card p-6 flex flex-col items-center text-center shadow-md hover:shadow-lg transition-all">
              <div className="bg-[#9b87f5]/10 p-4 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-[#9b87f5]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Pi Payments</h3>
              <p className="text-muted-foreground">Pay with Pi cryptocurrency for a safe and secure experience</p>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        {!user && (
          <section className="bg-gradient-to-r from-[#9b87f5] to-[#ffb347] text-white rounded-2xl p-8 text-center shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Join Eat-Me-Pi Today</h2>
            <p className="mb-6 max-w-2xl mx-auto">Connect with Pi Network to unlock rewards, track your orders, and enjoy a seamless food ordering experience.</p>
            <Button 
              onClick={login}
              size="lg" 
              className="bg-white text-[#9b87f5] hover:bg-white/90"
            >
              {t('auth.connectWithPi')}
            </Button>
          </section>
        )}
        
        {/* Pi Price Banner */}
        {priceData && (
          <section className="glass-card p-6 shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold mb-1">{t('pi.currentPrice')}</h3>
                <p className="text-muted-foreground text-sm">
                  {t('pi.lastUpdated')}: {priceData.lastUpdated.toLocaleTimeString()}
                </p>
              </div>
              
              <div className="flex items-center">
                <div className="text-3xl font-bold mr-4">
                  ${priceData.price.toFixed(4)}
                </div>
                <div className={`flex items-center ${
                  priceData.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {priceData.change24h >= 0 ? (
                    <TrendingUp className="h-5 w-5 mr-1" />
                  ) : (
                    <TrendingUp className="h-5 w-5 mr-1 transform rotate-180" />
                  )}
                  <span className="font-semibold">
                    {Math.abs(priceData.change24h).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Index;
