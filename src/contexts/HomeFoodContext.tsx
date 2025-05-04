import React, { createContext, useState, useContext, useEffect } from 'react';
import { FoodProvider, Review, Message } from '@/types/food';
import { usePiAuth } from './PiAuthContext';
import { v4 as uuidv4 } from 'uuid';

// Define context type
interface HomeFoodContextType {
  providers: FoodProvider[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
  addFoodProvider: (provider: Omit<FoodProvider, 'id'>) => string;
  addReview: (providerId: string, rating: number, comment: string) => void;
  sendMessage: (providerId: string, content: string) => void;
  getProviderMessages: (providerId: string) => Message[];
  addProvider: (provider: Omit<FoodProvider, 'id'>) => string;
  getProvider: (id: string) => FoodProvider | undefined;
  getReviews: (providerId: string) => Review[];
  getMessages: (providerId: string, userId: string) => Message[];
}

// Create the context
const HomeFoodContext = createContext<HomeFoodContextType | null>(null);

// Sample data for providers
const sampleProviders: FoodProvider[] = [
  {
    id: '1',
    name: 'Cairo Kitchen',
    description: 'Authentic home-cooked Egyptian dishes made with love',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200',
    rating: 4.7,
    reviewCount: 24,
    type: 'homemade',
    cuisine: ['Egyptian', 'Middle Eastern'],
    location: 'Downtown Cairo',
    contactInfo: {
      phone: '+20123456789',
      email: 'cairokitchen@example.com',
      address: '123 Tahrir St, Cairo',
      socialMedia: {
        facebook: 'cairokitchen',
        instagram: 'cairo_kitchen'
      }
    },
    menu: [
      {
        id: '101',
        name: 'Koshari',
        description: 'Traditional Egyptian dish with rice, pasta, lentils and spicy tomato sauce',
        price: 25,
        image: 'https://images.unsplash.com/photo-1642282908149-61fec1f9c9c9?w=600',
        category: 'Main Dishes',
        popular: true
      },
      {
        id: '102',
        name: 'Stuffed Vine Leaves',
        description: 'Vine leaves filled with rice and herbs',
        price: 30,
        image: 'https://images.unsplash.com/photo-1577779107935-c3315fa1b8fc?w=600',
        category: 'Appetizers'
      },
      {
        id: '103',
        name: 'Egyptian Molokhia',
        description: 'A green soup made from the mallow plant served with rice',
        price: 28,
        image: 'https://images.unsplash.com/photo-1505253631864-c9ea14ff6191?w=600',
        category: 'Soups'
      }
    ]
  },
  {
    id: '2',
    name: 'Alexandria Seafood',
    description: 'Fresh seafood dishes inspired by Mediterranean coastal cuisine',
    image: 'https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=800',
    coverImage: 'https://images.unsplash.com/photo-1579271723124-a758b3cf2119?w=1200',
    rating: 4.5,
    reviewCount: 16,
    type: 'homemade',
    cuisine: ['Seafood', 'Mediterranean'],
    location: 'Gleem, Alexandria',
    contactInfo: {
      phone: '+20123123123',
      email: 'alexseafood@example.com',
      address: '45 Corniche Rd, Alexandria',
      socialMedia: {
        instagram: 'alex_seafood',
        whatsapp: '20123123123'
      }
    },
    menu: [
      {
        id: '201',
        name: 'Grilled Fish',
        description: 'Fresh catch of the day grilled to perfection with herbs',
        price: 65,
        image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=600',
        category: 'Main Dishes',
        popular: true
      },
      {
        id: '202',
        name: 'Seafood Soup',
        description: 'Mixed seafood soup with tomato base and aromatic herbs',
        price: 40,
        image: 'https://images.unsplash.com/photo-1603073163308-9627e5a9143e?w=600',
        category: 'Soups'
      }
    ]
  },
  {
    id: '3',
    name: 'Aswan Nubian Delights',
    description: 'Traditional Nubian cuisine and southern Egyptian specialties',
    image: 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?w=800',
    coverImage: 'https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=1200',
    rating: 4.9,
    reviewCount: 12,
    type: 'homemade',
    cuisine: ['Nubian', 'Southern Egyptian'],
    location: 'Zamalek, Cairo',
    contactInfo: {
      phone: '+20123789456',
      email: 'nubiandelights@example.com',
      address: '78 El Nil St, Zamalek',
      socialMedia: {
        facebook: 'nubiandelights',
        instagram: 'nubian_delights'
      }
    },
    menu: [
      {
        id: '301',
        name: 'Nubian Lamb Stew',
        description: 'Slow-cooked lamb with exotic Nubian spices',
        price: 75,
        image: 'https://images.unsplash.com/photo-1612118244255-5c7a5abea0db?w=600',
        category: 'Main Dishes',
        popular: true
      },
      {
        id: '302',
        name: 'Egyptian Okra',
        description: 'Okra cooked with tomatoes and traditional spices',
        price: 35,
        image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a34?w=600',
        category: 'Sides'
      }
    ]
  }
];

// Sample reviews data
const sampleReviews: { [key: string]: Review[] } = {
  '1': [
    {
      id: 'r1',
      providerId: '1',
      userId: 'user1',
      userName: 'Mohamed',
      rating: 5,
      comment: 'Amazing food! The Koshari was perfect.',
      createdAt: '2023-04-12T14:23:00.000Z'
    },
    {
      id: 'r2',
      providerId: '1',
      userId: 'user2',
      userName: 'Sarah',
      rating: 4,
      comment: 'Great flavor, but delivery was a bit late.',
      createdAt: '2023-04-10T09:15:00.000Z'
    }
  ],
  '2': [
    {
      id: 'r3',
      providerId: '2',
      userId: 'user3',
      userName: 'Ahmed',
      rating: 5,
      comment: 'Fresh and delicious seafood, highly recommend!',
      createdAt: '2023-04-08T18:45:00.000Z'
    }
  ],
  '3': [
    {
      id: 'r4',
      providerId: '3',
      userId: 'user1',
      userName: 'Mohamed',
      rating: 5,
      comment: 'Authentic Nubian flavors, made me nostalgic!',
      createdAt: '2023-04-05T12:30:00.000Z'
    }
  ]
};

// Create the provider component
export const HomeFoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = usePiAuth();
  const [providers, setProviders] = useState<FoodProvider[]>(sampleProviders);
  const [reviews, setReviews] = useState<{ [key: string]: Review[] }>(sampleReviews);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});

  // Load favorites from localStorage when user changes
  useEffect(() => {
    if (user) {
      try {
        const savedFavorites = localStorage.getItem(`favorites_${user.uid}`);
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    } else {
      setFavorites([]);
    }
  }, [user]);

  // Save favorites to localStorage when changed
  useEffect(() => {
    if (user && favorites.length > 0) {
      localStorage.setItem(`favorites_${user.uid}`, JSON.stringify(favorites));
    }
  }, [favorites, user]);

  // Toggle a provider as favorite
  const toggleFavorite = (id: string) => {
    if (!user) return;
    
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(fav => fav !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Get a specific provider by ID
  const getProvider = (id: string): FoodProvider | undefined => {
    return providers.find(provider => provider.id === id);
  };

  // Get reviews for a specific provider
  const getReviews = (providerId: string): Review[] => {
    return reviews[providerId] || [];
  };

  // Add a new food provider (alias for addFoodProvider for compatibility)
  const addProvider = (provider: Omit<FoodProvider, 'id'>): string => {
    return addFoodProvider(provider);
  };

  // Add a new food provider
  const addFoodProvider = (provider: Omit<FoodProvider, 'id'>) => {
    const id = uuidv4();
    const newProvider: FoodProvider = {
      ...provider,
      id,
      rating: 0,
      reviewCount: 0,
      menu: provider.menu || []
    };
    
    setProviders(prev => [newProvider, ...prev]);
    return id;
  };

  // Add a review to a provider
  const addReview = (providerId: string, rating: number, comment: string) => {
    if (!user) return;
    
    const newReview: Review = {
      id: uuidv4(),
      providerId,
      userId: user.uid,
      userName: user.username,
      userImage: null,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };
    
    // Update reviews
    setReviews(prev => {
      const providerReviews = prev[providerId] || [];
      return {
        ...prev,
        [providerId]: [newReview, ...providerReviews]
      };
    });
    
    // Update provider rating
    setProviders(prev => {
      return prev.map(provider => {
        if (provider.id === providerId) {
          const providerReviews = [...(reviews[providerId] || []), newReview];
          const totalRating = providerReviews.reduce((sum, review) => sum + review.rating, 0);
          const newRating = totalRating / providerReviews.length;
          
          return {
            ...provider,
            rating: Number(newRating.toFixed(1)),
            reviewCount: providerReviews.length
          };
        }
        return provider;
      });
    });
  };

  // Send a message to a provider
  const sendMessage = (providerId: string, content: string) => {
    if (!user) return;
    
    const newMessage: Message = {
      id: uuidv4(),
      providerId,
      userId: user.uid,
      userName: user.username,
      content,
      createdAt: new Date().toISOString(),
      isFromProvider: false
    };
    
    setMessages(prev => {
      const providerMessages = prev[providerId] || [];
      return {
        ...prev,
        [providerId]: [...providerMessages, newMessage]
      };
    });
  };

  // Get messages for a specific provider
  const getProviderMessages = (providerId: string) => {
    return messages[providerId] || [];
  };

  // Get messages between a provider and a specific user
  const getMessages = (providerId: string, userId: string) => {
    return messages[providerId] || [];
  };

  return (
    <HomeFoodContext.Provider value={{
      providers,
      favorites,
      toggleFavorite,
      addFoodProvider,
      addReview,
      sendMessage,
      getProviderMessages,
      addProvider,
      getProvider,
      getReviews,
      getMessages
    }}>
      {children}
    </HomeFoodContext.Provider>
  );
};

// Create a custom hook for using the home food context
export const useHomeFood = () => {
  const context = useContext(HomeFoodContext);
  if (!context) {
    throw new Error('useHomeFood must be used within a HomeFoodProvider');
  }
  return context;
};

export default HomeFoodContext;
