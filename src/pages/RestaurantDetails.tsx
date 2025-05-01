
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, MapPin, Star, Plus, Info, Utensils } from 'lucide-react';
import { toast } from 'sonner';

// Mock restaurant data (would be fetched from an API in a real app)
const mockRestaurantDetails = {
  '1': {
    id: '1',
    name: 'El Dahan',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000',
    description: 'Authentic Egyptian grills and traditional cuisine in a relaxed atmosphere.',
    cuisine: 'Egyptian, Grills',
    rating: 4.8,
    deliveryTime: '25-35 min',
    priceRange: '$$',
    featured: true,
    locations: ['Cairo', 'Alexandria', 'Giza'],
    address: '123 Tahrir Square, Cairo',
    openingHours: '10:00 AM - 11:00 PM',
    phoneNumber: '+20 123 456 7890',
    menu: {
      categories: [
        {
          name: 'Appetizers',
          items: [
            { id: '101', name: 'Tahini', description: 'Creamy sesame paste dip with olive oil', price: 5.00, image: 'https://images.unsplash.com/photo-1541518763069-e7f6216e8ba5?q=80&w=400' },
            { id: '102', name: 'Baba Ghanoush', description: 'Smoky eggplant dip with garlic and lemon', price: 6.50, image: 'https://images.unsplash.com/photo-1543340713-1bf56d3d1b68?q=80&w=400' },
            { id: '103', name: 'Hummus', description: 'Classic chickpea dip with tahini and olive oil', price: 5.50, image: 'https://images.unsplash.com/photo-1583592543890-d9457c83f212?q=80&w=400' },
          ]
        },
        {
          name: 'Main Courses',
          items: [
            { id: '201', name: 'Mixed Grill Platter', description: 'Assortment of grilled meats including kofta, chicken and lamb', price: 18.00, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400' },
            { id: '202', name: 'Koshari', description: 'Egyptian signature dish with rice, pasta and lentils', price: 12.50, image: 'https://images.unsplash.com/photo-1626056087728-05c3d180911a?q=80&w=400' },
            { id: '203', name: 'Stuffed Pigeon', description: 'Traditional Egyptian delicacy with rice and herbs', price: 22.00, image: 'https://images.unsplash.com/photo-1432139509613-5c4255815697?q=80&w=400' },
          ]
        },
        {
          name: 'Desserts',
          items: [
            { id: '301', name: 'Kunafa', description: 'Sweet pastry with cheese and syrup', price: 7.50, image: 'https://images.unsplash.com/photo-1579697096985-41fe1430e5df?q=80&w=400' },
            { id: '302', name: 'Baklava', description: 'Layered pastry with nuts and honey', price: 6.00, image: 'https://images.unsplash.com/photo-1534706438758-469f53327711?q=80&w=400' },
            { id: '303', name: 'Om Ali', description: 'Egyptian bread pudding with milk and nuts', price: 8.00, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=400' },
          ]
        },
        {
          name: 'Beverages',
          items: [
            { id: '401', name: 'Hibiscus Tea (Karkadeh)', description: 'Traditional Egyptian cold drink', price: 3.50, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=400' },
            { id: '402', name: 'Fresh Mango Juice', description: 'Made with sweet Egyptian mangoes', price: 4.50, image: 'https://images.unsplash.com/photo-1546173159-315724a31696?q=80&w=400' },
            { id: '403', name: 'Turkish Coffee', description: 'Strong and aromatic with cardamom', price: 3.00, image: 'https://images.unsplash.com/photo-1578090021619-2a97e3b2d0e7?q=80&w=400' },
          ]
        }
      ]
    }
  },
  '2': {
    id: '2',
    name: 'Abou El Sid',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000',
    description: 'Classic Egyptian cuisine in an authentic atmosphere with traditional decor.',
    cuisine: 'Egyptian, Traditional',
    rating: 4.6,
    deliveryTime: '30-40 min',
    priceRange: '$$$',
    featured: true,
    locations: ['Cairo', 'Hurghada'],
    address: '456 El Moez Street, Cairo',
    openingHours: '12:00 PM - 12:00 AM',
    phoneNumber: '+20 234 567 8901',
    menu: {
      categories: [
        {
          name: 'Appetizers',
          items: [
            { id: '104', name: 'Stuffed Vine Leaves', description: 'Grape leaves filled with rice and herbs', price: 7.50, image: 'https://images.unsplash.com/photo-1651293195833-47680023b344?q=80&w=400' },
            { id: '105', name: 'Molokhia Soup', description: 'Traditional Egyptian green soup', price: 6.00, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400' },
          ]
        },
        {
          name: 'Main Courses',
          items: [
            { id: '204', name: 'Fattah', description: 'Layers of rice, crispy bread, and meat in garlicky vinegar sauce', price: 15.00, image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?q=80&w=400' },
            { id: '205', name: 'Hamam Mahshi', description: 'Stuffed pigeon with freekeh', price: 25.00, image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?q=80&w=400' },
          ]
        },
        {
          name: 'Desserts',
          items: [
            { id: '304', name: 'Basbousa', description: 'Semolina cake with syrup', price: 5.50, image: 'https://images.unsplash.com/photo-1504473089979-1d0f9afb7b7c?q=80&w=400' },
            { id: '305', name: 'Zalabya', description: 'Egyptian donuts with sugar syrup', price: 4.50, image: 'https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?q=80&w=400' },
          ]
        }
      ]
    }
  },
  // Add more restaurants as needed...
};

// Add mock data for other restaurants from the Restaurants.tsx page
const mockEgyptianRestaurants = {
  '3': {
    id: '3',
    name: 'Zooba',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1000',
    description: 'Modern take on classic Egyptian street food in a vibrant atmosphere.',
    cuisine: 'Egyptian Street Food',
    rating: 4.5,
    deliveryTime: '20-30 min',
    priceRange: '$$',
    locations: ['Cairo', 'New Cairo'],
    address: '789 Zamalek Street, Cairo',
    openingHours: '8:00 AM - 10:00 PM',
    phoneNumber: '+20 345 678 9012',
    menu: {
      categories: [
        {
          name: 'Street Favorites',
          items: [
            { id: '106', name: 'Taameya', description: 'Egyptian falafel made with fava beans', price: 4.00, image: 'https://images.unsplash.com/photo-1593001872095-7d5b3868dd28?q=80&w=400' },
            { id: '107', name: 'Feteer', description: 'Flaky Egyptian pastry with various fillings', price: 7.00, image: 'https://images.unsplash.com/photo-1559411583-063a8d3b6b43?q=80&w=400' },
          ]
        },
        {
          name: 'Sandwiches',
          items: [
            { id: '206', name: 'Hawawshi', description: 'Spiced minced meat in bread', price: 6.50, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=400' },
            { id: '207', name: 'Foul Sandwich', description: 'Mashed fava beans with toppings', price: 4.50, image: 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?q=80&w=400' },
          ]
        }
      ]
    }
  },
  '4': {
    id: '4',
    name: 'Kazouza',
    image: 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?q=80&w=1000',
    description: 'Fresh seafood with Mediterranean influences in a relaxed coastal setting.',
    cuisine: 'Egyptian, Seafood',
    rating: 4.7,
    deliveryTime: '35-45 min',
    priceRange: '$$$',
    featured: true,
    locations: ['Alexandria'],
    address: '101 Corniche Road, Alexandria',
    openingHours: '11:00 AM - 11:00 PM',
    phoneNumber: '+20 456 789 0123',
    menu: {
      categories: [
        {
          name: 'Seafood',
          items: [
            { id: '108', name: 'Grilled Sea Bass', description: 'Fresh sea bass with herbs and lemon', price: 22.00, image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?q=80&w=400' },
            { id: '109', name: 'Calamari', description: 'Fried squid rings with tartar sauce', price: 12.00, image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?q=80&w=400' },
          ]
        }
      ]
    }
  }
};

// Combine restaurant data
const allRestaurants = { ...mockRestaurantDetails, ...mockEgyptianRestaurants };

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

const RestaurantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { addItem } = useCart();
  const navigate = useLink().navigate;
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('menu');

  useEffect(() => {
    // Simulate fetching restaurant data
    const fetchRestaurant = () => {
      setLoading(true);
      setTimeout(() => {
        if (id && allRestaurants[id]) {
          setRestaurant(allRestaurants[id]);
        }
        setLoading(false);
      }, 500);
    };

    fetchRestaurant();
  }, [id]);

  const addToCart = (item: MenuItem) => {
    if (!restaurant) return;
    
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-pulse space-y-8 w-full">
              <div className="h-40 bg-muted rounded-xl w-full"></div>
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-32 bg-muted rounded-md"></div>
                <div className="h-32 bg-muted rounded-md"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold">{t('restaurant.notFound')}</h2>
            <p className="mt-4 text-muted-foreground">{t('restaurant.notFoundDesc')}</p>
            <Button 
              onClick={() => navigate('/restaurants')} 
              className="button-gradient mt-8"
            >
              {t('restaurant.backToList')}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div 
        className="h-[200px] md:h-[300px] w-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${restaurant.image})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <Button
            variant="ghost"
            className="bg-black/30 hover:bg-black/50 text-white mb-4"
            onClick={() => navigate('/restaurants')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('restaurant.backToList')}
          </Button>
          <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
          <div className="flex flex-wrap gap-2 items-center text-sm">
            <Badge variant="secondary" className="bg-white/20">{restaurant.cuisine}</Badge>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-orange fill-orange mr-1" />
              <span>{restaurant.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{restaurant.locations.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="menu">
              <Utensils className="mr-2 h-4 w-4" />
              {t('restaurant.menu')}
            </TabsTrigger>
            <TabsTrigger value="info">
              <Info className="mr-2 h-4 w-4" />
              {t('restaurant.info')}
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <Star className="mr-2 h-4 w-4" />
              {t('restaurant.reviews')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu" className="mt-6">
            {restaurant.menu?.categories.map((category: any, index: number) => (
              <div key={index} className="mb-10">
                <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.items.map((item: MenuItem) => (
                    <Card key={item.id} className="glass-card overflow-hidden">
                      <div className="flex flex-col md:flex-row h-full">
                        <div className="md:w-1/3 h-32 md:h-auto">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="flex-1 p-4">
                          <div className="flex justify-between">
                            <h3 className="font-bold">{item.name}</h3>
                            <span className="font-medium">π {item.price.toFixed(2)}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                          <Button
                            size="sm"
                            className="mt-3"
                            onClick={() => addToCart(item)}
                          >
                            <Plus className="mr-1 h-4 w-4" />
                            {t('restaurant.addToCart')}
                          </Button>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="info" className="mt-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>{t('restaurant.information')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">{t('restaurant.description')}</h3>
                  <p className="text-muted-foreground mt-1">{restaurant.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">{t('restaurant.address')}</h3>
                    <p className="text-muted-foreground mt-1 flex items-start">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                      {restaurant.address}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">{t('restaurant.openingHours')}</h3>
                    <p className="text-muted-foreground mt-1 flex items-start">
                      <Clock className="h-4 w-4 mr-2 mt-0.5" />
                      {restaurant.openingHours}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium">{t('restaurant.contact')}</h3>
                  <p className="text-muted-foreground mt-1">
                    {restaurant.phoneNumber}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>{t('restaurant.reviews')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('restaurant.noReviewsYet')}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

// Simple Link hook to use navigate
function useLink() {
  const navigate = useNavigate();
  return { navigate };
}

export default RestaurantDetails;
