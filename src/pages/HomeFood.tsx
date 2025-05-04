
import React, { useState } from 'react';
import { Search, Filter, MapPin, Star, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHomeFood } from '@/contexts/HomeFoodContext';
import { usePiAuth } from '@/contexts/PiAuthContext';
import Header from '@/components/Header';
import FoodProviderCard from '@/components/FoodProviderCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const HomeFood = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = usePiAuth();
  const { providers, favorites } = useHomeFood();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [ratingFilter, setRatingFilter] = useState([0]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'homemade' | 'restaurants'>('all');
  
  // Extract unique cuisines and locations for filters
  const allCuisines = Array.from(new Set(providers.flatMap(r => r.cuisine)));
  const allLocations = Array.from(new Set(providers.map(r => r.location)));
  
  // Toggle cuisine selection
  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines(current => 
      current.includes(cuisine)
        ? current.filter(c => c !== cuisine)
        : [...current, cuisine]
    );
  };
  
  // Toggle location selection
  const toggleLocation = (location: string) => {
    setSelectedLocations(current => 
      current.includes(location)
        ? current.filter(l => l !== location)
        : [...current, location]
    );
  };
  
  // Filter providers based on search query and filters
  const filteredProviders = providers.filter(provider => {
    // Filter by tab
    if (activeTab === 'homemade' && provider.type !== 'homemade') return false;
    if (activeTab === 'restaurants' && provider.type !== 'restaurant') return false;
    
    // Filter by search query
    const matchesSearch = 
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      provider.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      provider.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by rating
    const matchesRating = provider.rating >= ratingFilter[0];
    
    // Filter by cuisine
    const matchesCuisine = selectedCuisines.length === 0 || 
      selectedCuisines.some(c => provider.cuisine.includes(c));
    
    // Filter by location
    const matchesLocation = selectedLocations.length === 0 || 
      selectedLocations.includes(provider.location);
    
    return matchesSearch && matchesRating && matchesCuisine && matchesLocation;
  });
  
  const handleAddListing = () => {
    if (!user) {
      toast.error('Please login to add your food listing');
      return;
    }
    navigate('/homefood/add');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Home Cooking & Small Restaurants</h1>
            <p className="text-muted-foreground">
              Discover authentic home-cooked food and small local restaurants in your area
            </p>
          </div>
          
          <Button 
            onClick={handleAddListing} 
            className="button-gradient"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Your Listing
          </Button>
        </div>
        
        {/* Tabs */}
        <Tabs 
          defaultValue="all" 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'all' | 'homemade' | 'restaurants')}
          className="mb-6"
        >
          <TabsList>
            <TabsTrigger value="all">All Listings</TabsTrigger>
            <TabsTrigger value="homemade">Home Cooking</TabsTrigger>
            <TabsTrigger value="restaurants">Small Restaurants</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, cuisine, or description..."
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
              Filters
            </Button>
          </div>
          
          {/* Filter Panel */}
          {filterOpen && (
            <div className="glass-card p-6 mb-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Rating Filter */}
                <div>
                  <h3 className="font-medium mb-3">Minimum Rating</h3>
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
                  <h3 className="font-medium mb-3">Cuisine</h3>
                  <div className="flex flex-wrap gap-2">
                    {allCuisines.map((cuisine) => (
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
                  <h3 className="font-medium mb-3">Location</h3>
                  <div className="flex flex-wrap gap-2">
                    {allLocations.map((location) => (
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
        
        {/* Provider List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProviders.map((provider) => (
            <FoodProviderCard 
              key={provider.id} 
              provider={provider}
              isFavorite={favorites.includes(provider.id)} 
            />
          ))}
        </div>
        
        {filteredProviders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No listings found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomeFood;
