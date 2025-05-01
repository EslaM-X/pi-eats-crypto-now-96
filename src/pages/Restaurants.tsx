
import React, { useState } from 'react';
import { Search, Filter, MapPin, Star, Circle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import RestaurantCard from '@/components/RestaurantCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

// Mock data for restaurants in Egypt
const mockEgyptianRestaurants = [
  {
    id: '1',
    name: 'El Dahan',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000',
    cuisine: 'Egyptian, Grills',
    rating: 4.8,
    deliveryTime: '25-35 min',
    priceRange: '$$',
    featured: true,
    locations: ['Cairo', 'Alexandria', 'Giza'],
  },
  {
    id: '2',
    name: 'Abou El Sid',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000',
    cuisine: 'Egyptian, Traditional',
    rating: 4.6,
    deliveryTime: '30-40 min',
    priceRange: '$$$',
    featured: true,
    locations: ['Cairo', 'Hurghada'],
  },
  {
    id: '3',
    name: 'Zooba',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1000',
    cuisine: 'Egyptian Street Food',
    rating: 4.5,
    deliveryTime: '20-30 min',
    priceRange: '$$',
    locations: ['Cairo', 'New Cairo'],
  },
  {
    id: '4',
    name: 'Kazouza',
    image: 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?q=80&w=1000',
    cuisine: 'Egyptian, Seafood',
    rating: 4.7,
    deliveryTime: '35-45 min',
    priceRange: '$$$',
    featured: true,
    locations: ['Alexandria'],
  },
  {
    id: '5',
    name: 'Koshary El Tahrir',
    image: 'https://images.unsplash.com/photo-1626056087728-05c3d180911a?q=80&w=1000',
    cuisine: 'Egyptian, Koshary',
    rating: 4.4,
    deliveryTime: '15-25 min',
    priceRange: '$',
    locations: ['Cairo', 'Giza', 'Alexandria'],
  },
  {
    id: '6',
    name: 'Felfela',
    image: 'https://images.unsplash.com/photo-1588123190131-1c3fac394f4b?q=80&w=1000',
    cuisine: 'Egyptian, Traditional',
    rating: 4.3,
    deliveryTime: '25-35 min',
    priceRange: '$$',
    locations: ['Cairo'],
  },
  {
    id: '7',
    name: 'El Abd Bakery',
    image: 'https://images.unsplash.com/photo-1579697096985-41fe1430e5df?q=80&w=1000',
    cuisine: 'Bakery, Desserts',
    rating: 4.9,
    deliveryTime: '20-30 min',
    priceRange: '$$',
    featured: true,
    locations: ['Cairo', 'Alexandria'],
  },
  {
    id: '8',
    name: 'El Fishawi',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1000',
    cuisine: 'Traditional, Coffee',
    rating: 4.2,
    deliveryTime: '30-40 min',
    priceRange: '$',
    locations: ['Cairo'],
  },
];

const Restaurants = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [ratingFilter, setRatingFilter] = useState([0]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  // Extract unique cuisines and locations for filters
  const cuisines = Array.from(new Set(mockEgyptianRestaurants.flatMap(r => r.cuisine.split(', '))));
  const locations = Array.from(new Set(mockEgyptianRestaurants.flatMap(r => r.locations)));

  // Toggle cuisine selection
  const toggleCuisine = (cuisine: string) => {
    if (selectedCuisines.includes(cuisine)) {
      setSelectedCuisines(selectedCuisines.filter(c => c !== cuisine));
    } else {
      setSelectedCuisines([...selectedCuisines, cuisine]);
    }
  };

  // Toggle location selection
  const toggleLocation = (location: string) => {
    if (selectedLocations.includes(location)) {
      setSelectedLocations(selectedLocations.filter(l => l !== location));
    } else {
      setSelectedLocations([...selectedLocations, location]);
    }
  };

  // Filter restaurants based on search query and filters
  const filteredRestaurants = mockEgyptianRestaurants.filter(restaurant => {
    // Filter by search query
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by rating
    const matchesRating = restaurant.rating >= ratingFilter[0];
    
    // Filter by cuisine
    const matchesCuisine = selectedCuisines.length === 0 || 
                          selectedCuisines.some(c => restaurant.cuisine.includes(c));
    
    // Filter by location
    const matchesLocation = selectedLocations.length === 0 || 
                           restaurant.locations.some(l => selectedLocations.includes(l));
    
    return matchesSearch && matchesRating && matchesCuisine && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('nav.restaurants')}</h1>
          <p className="text-muted-foreground">
            {t('restaurant.explore')}
          </p>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('restaurant.search')}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2"
            >
              <Filter size={18} />
              {t('restaurant.filters')}
            </Button>
          </div>
          
          {/* Filter Panel */}
          {filterOpen && (
            <div className="glass-card p-6 mb-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Rating Filter */}
                <div>
                  <h3 className="font-medium mb-3">{t('restaurant.rating')}</h3>
                  <div className="flex items-center gap-4 mb-2">
                    <Slider
                      defaultValue={[0]}
                      max={5}
                      step={0.5}
                      value={ratingFilter}
                      onValueChange={setRatingFilter}
                    />
                    <span className="font-medium text-lg flex items-center">
                      {ratingFilter[0]} <Star className="h-4 w-4 ml-1 fill-orange text-orange" />
                    </span>
                  </div>
                </div>
                
                {/* Cuisine Filter */}
                <div>
                  <h3 className="font-medium mb-3">{t('restaurant.cuisine')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {cuisines.map((cuisine) => (
                      <Badge
                        key={cuisine}
                        variant={selectedCuisines.includes(cuisine) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleCuisine(cuisine)}
                      >
                        {cuisine}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Location Filter */}
                <div>
                  <h3 className="font-medium mb-3">{t('restaurant.location')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {locations.map((location) => (
                      <Badge
                        key={location}
                        variant={selectedLocations.includes(location) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleLocation(location)}
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        {location}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Restaurant List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} {...restaurant} />
          ))}
        </div>
        
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No restaurants found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Restaurants;
