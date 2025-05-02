import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Clock, Star, Info, Phone, ShoppingCart, Plus, Minus } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

type MenuCategory = {
  id: string;
  name: string;
  items: MenuItem[];
};

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  popular?: boolean;
};

// Sample restaurant data - in a real app, this would come from an API
const RESTAURANTS = [
  {
    id: '1',
    name: 'Pizza Palace',
    description: 'The best pizza in town with authentic Italian recipes and fresh ingredients.',
    cuisine: 'Italian',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGl6emElMjByZXN0YXVyYW50fGVufDB8fDB8fHww',
    rating: 4.7,
    deliveryTime: '20-30 min',
    deliveryFee: 0.5,
    minOrder: 5,
    priceRange: '$$',
    address: '123 Main St, Cairo',
    phone: '+20 123 456 789',
    openingHours: '10:00 AM - 11:00 PM',
    categories: [
      {
        id: 'pizza',
        name: 'Pizzas',
        items: [
          {
            id: 'pizza-1',
            name: 'Margherita',
            description: 'Classic pizza with tomato sauce, mozzarella, and basil',
            price: 7.99,
            image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGl6emElMjBtYXJnaGVyaXRhfGVufDB8fDB8fHww',
            popular: true,
          },
          {
            id: 'pizza-2',
            name: 'Pepperoni',
            description: 'Pizza with tomato sauce, mozzarella, and pepperoni',
            price: 8.99,
            image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVwcGVyb25pJTIwcGl6emF8ZW58MHx8MHx8fDA%3D',
            popular: true,
          },
          {
            id: 'pizza-3',
            name: 'Vegetarian',
            description: 'Pizza with tomato sauce, mozzarella, bell peppers, onions, and mushrooms',
            price: 9.99,
            image: 'https://images.unsplash.com/photo-1615719413546-198b25453f85?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dmVnZXRhcmlhbiUyMHBpenphfGVufDB8fDB8fHww',
          },
        ],
      },
      {
        id: 'pasta',
        name: 'Pasta',
        items: [
          {
            id: 'pasta-1',
            name: 'Spaghetti Bolognese',
            description: 'Classic spaghetti with rich meat sauce',
            price: 8.99,
            image: 'https://plus.unsplash.com/premium_photo-1673809798970-de3312423f83?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3BhZ2hldHRpJTIwYm9sb2duZXNlfGVufDB8fDB8fHww',
          },
          {
            id: 'pasta-2',
            name: 'Fettuccine Alfredo',
            description: 'Fettuccine pasta with creamy alfredo sauce',
            price: 9.99,
            image: 'https://images.unsplash.com/photo-1648748252639-65c7333185c5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmV0dHVjY2luZXxlbnwwfHwwfHx8MA%3D%3D',
            popular: true,
          },
        ],
      },
      {
        id: 'drinks',
        name: 'Drinks',
        items: [
          {
            id: 'drink-1',
            name: 'Soft Drink',
            description: 'Coca-Cola, Pepsi, Sprite, or Fanta',
            price: 1.99,
            image: 'https://images.unsplash.com/photo-1543253687-c931c8e01820?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29mdCUyMGRyaW5rfGVufDB8fDB8fHww',
          },
          {
            id: 'drink-2',
            name: 'Fruit Juice',
            description: 'Orange, apple, or mango juice',
            price: 2.49,
            image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJ1aXQlMjBqdWljZXxlbnwwfHwwfHx8MA%3D%3D',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Burger King',
    description: 'Fast food restaurant specializing in burgers and other American favorites.',
    cuisine: 'American',
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnVyZ2VyJTIwa2luZ3xlbnwwfHwwfHx8MA%3D%3D',
    rating: 4.2,
    deliveryTime: '15-25 min',
    deliveryFee: 0.3,
    minOrder: 3,
    priceRange: '$',
    address: '456 Burger St, Cairo',
    phone: '+20 987 654 321',
    openingHours: '9:00 AM - 12:00 AM',
    categories: [
      {
        id: 'burgers',
        name: 'Burgers',
        items: [
          {
            id: 'burger-1',
            name: 'Classic Burger',
            description: 'Beef patty with lettuce, tomato, and special sauce',
            price: 5.99,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww',
            popular: true,
          },
          {
            id: 'burger-2',
            name: 'Cheeseburger',
            description: 'Beef patty with cheese, lettuce, and tomato',
            price: 6.99,
            image: 'https://images.unsplash.com/photo-1603064752734-4c48eff53d05?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2hlZXNlYnVyZ2VyfGVufDB8fDB8fHww',
            popular: true,
          },
        ],
      },
      {
        id: 'sides',
        name: 'Sides',
        items: [
          {
            id: 'side-1',
            name: 'French Fries',
            description: 'Crispy golden french fries',
            price: 2.99,
            image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZnJlbmNoJTIwZnJpZXN8ZW58MHx8MHx8fDA%3D',
          },
          {
            id: 'side-2',
            name: 'Onion Rings',
            description: 'Crispy battered onion rings',
            price: 3.49,
            image: 'https://images.unsplash.com/photo-1639024471283-02d9dd5f476f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b25pb24lMjByaW5nc3xlbnwwfHwwfHx8MA%3D%3D',
          },
        ],
      },
    ],
  },
];

const RestaurantDetails = () => {
  const { id } = useParams();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { addItem, items } = useCart();
  const navigate = useNavigate();
  
  // Find the restaurant by ID
  const restaurant = RESTAURANTS.find(r => r.id === id);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    restaurant?.categories[0]?.id || ''
  );
  
  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">{t('restaurants.notFound')}</h1>
          <Link to="/restaurants">
            <Button>{t('restaurants.backToList')}</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const addToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    });
    toast.success(t('cart.itemAdded'));
  };
  
  const isInCart = (itemId: string) => {
    return items.some(item => item.id === itemId);
  };
  
  const getItemQuantity = (itemId: string) => {
    const item = items.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };
  
  const updateItemQuantity = (itemId: string, quantity: number) => {
    const existingItem = items.find(item => item.id === itemId);
    
    if (existingItem) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        const cartItem = items.find(item => item.id === itemId);
        if (cartItem) {
          toast.info(`${cartItem.name} ${t('cart.removed')}`);
        }
        return;
      }
      
      // Update quantity
      addItem({
        id: existingItem.id,
        name: existingItem.name,
        price: existingItem.price,
        image: existingItem.image,
        restaurantId: existingItem.restaurantId,
        restaurantName: existingItem.restaurantName
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Restaurant Header */}
      <div 
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${restaurant.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/10">
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-4">
            <Link to="/restaurants">
              <Button variant="ghost" className="absolute top-4 left-4 text-white bg-black/30 hover:bg-black/40">
                <ChevronLeft className="h-5 w-5" />
                {t('restaurants.back')}
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">{restaurant.name}</h1>
              <div className="flex items-center mt-2 space-x-4">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {restaurant.cuisine}
                </Badge>
                <div className="flex items-center text-white">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                  <span>{restaurant.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center text-white">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{restaurant.deliveryTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        {/* Restaurant Info */}
        <Card className={`mb-6 ${theme === 'dark' ? 'bg-muted/20' : ''}`}>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-4">{restaurant.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>{restaurant.address}</span>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>{restaurant.openingHours}</span>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>{restaurant.phone}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <Info className="h-4 w-4 mr-1" />
              <span>
                {t('restaurants.minOrder')}: π{restaurant.minOrder.toFixed(2)} • 
                {t('restaurants.deliveryFee')}: π{restaurant.deliveryFee.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
        
        {/* Menu */}
        <h2 className="text-2xl font-bold mb-4">{t('restaurants.menu')}</h2>
        
        <Tabs 
          defaultValue={restaurant.categories[0]?.id} 
          className="mb-6"
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <TabsList className="mb-4 overflow-auto w-full justify-start gap-2 h-auto pb-1">
            {restaurant.categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="px-4 py-2 whitespace-nowrap"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {restaurant.categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.items.map((item) => (
                  <Card key={item.id} className={`overflow-hidden ${theme === 'dark' ? 'bg-muted/20' : ''}`}>
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-1/3 h-32 sm:h-auto">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium">
                              {item.name}
                              {item.popular && (
                                <Badge variant="secondary" className="ml-2 bg-orange/20 text-orange">
                                  {t('restaurants.popular')}
                                </Badge>
                              )}
                            </h3>
                            <div className="font-semibold">π {item.price.toFixed(2)}</div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        
                        <div className="mt-4">
                          {!isInCart(item.id) ? (
                            <Button 
                              onClick={() => addToCart(item)}
                              size="sm"
                              className="w-full button-gradient"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              {t('restaurants.addToCart')}
                            </Button>
                          ) : (
                            <div className="flex items-center justify-between">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateItemQuantity(item.id, getItemQuantity(item.id) - 1)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="font-medium px-2">
                                {getItemQuantity(item.id)}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateItemQuantity(item.id, getItemQuantity(item.id) + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      {/* Cart floating button */}
      {items.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button 
            onClick={() => navigate('/cart')}
            className="button-gradient rounded-full h-14 w-14 shadow-lg p-0"
            aria-label="View cart"
          >
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 h-5 w-5 bg-orange text-white rounded-full flex items-center justify-center text-xs">
                {items.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetails;
