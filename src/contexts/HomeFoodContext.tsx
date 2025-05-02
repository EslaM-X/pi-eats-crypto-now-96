
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { usePiAuth } from './PiAuthContext';
import { FoodProvider, FoodItem, Review, Message } from '@/types/food';

// Sample data for homemade food and small restaurants
const initialProviders: FoodProvider[] = [
  {
    id: '1',
    name: "Aisha's Home Kitchen",
    type: 'homemade',
    description: 'Authentic Egyptian home cooking with recipes passed down through generations.',
    cuisine: ['Egyptian', 'Middle Eastern'],
    location: 'Cairo',
    rating: 4.7,
    reviewCount: 24,
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800',
    coverImage: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800',
    contactInfo: {
      phone: '+20 123 456 789',
      email: 'aisha@example.com',
      address: 'Nasr City, Cairo',
      socialMedia: {
        whatsapp: '+201234567890'
      }
    },
    menu: [
      {
        id: '101',
        name: 'Koshari',
        description: 'Traditional Egyptian dish with rice, macaroni, lentils, chickpeas and spicy tomato sauce',
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1626056087728-05c3d180911a?w=800',
        category: 'Main Dishes',
        popular: true
      },
      {
        id: '102',
        name: 'Stuffed Vine Leaves',
        description: 'Grape leaves stuffed with rice, herbs and minced meat',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1579697096985-41fe1430e5df?w=800',
        category: 'Appetizers'
      },
      {
        id: '103',
        name: 'Mahshi',
        description: 'Stuffed vegetables with spiced rice and herbs',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800',
        category: 'Main Dishes',
        popular: true
      }
    ],
    isActive: true,
    createdAt: new Date('2023-11-15')
  },
  {
    id: '2',
    name: "Cairo Corner Café",
    type: 'small_restaurant',
    description: 'A cozy small restaurant serving authentic Egyptian breakfast and street food.',
    cuisine: ['Egyptian', 'Café', 'Breakfast'],
    location: 'Giza',
    rating: 4.5,
    reviewCount: 42,
    image: 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=800',
    coverImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
    contactInfo: {
      phone: '+20 109 876 5432',
      email: 'contact@cairocorner.eg',
      address: 'Downtown, Giza',
      socialMedia: {
        facebook: 'cairocornercafe',
        instagram: 'cairocorner'
      }
    },
    menu: [
      {
        id: '201',
        name: 'Ful Medames',
        description: 'Traditional Egyptian breakfast of cooked fava beans with olive oil, cumin and herbs',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1588123190131-1c3fac394f4b?w=800',
        category: 'Breakfast',
        popular: true
      },
      {
        id: '202',
        name: 'Falafel Sandwich',
        description: 'Freshly made falafel with tahini sauce and vegetables in baladi bread',
        price: 2.99,
        image: 'https://images.unsplash.com/photo-1593001872095-7d5b3868fb1d?w=800',
        category: 'Sandwiches'
      },
      {
        id: '203',
        name: 'Egyptian Tea',
        description: 'Strong black tea with fresh mint leaves',
        price: 1.50,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800',
        category: 'Drinks'
      }
    ],
    isActive: true,
    createdAt: new Date('2024-01-05')
  },
  {
    id: '3',
    name: "Mama Noura's Kitchen",
    type: 'homemade',
    description: 'Homemade Egyptian comfort food made with love and fresh ingredients.',
    cuisine: ['Egyptian', 'Family Style'],
    location: 'Alexandria',
    rating: 4.8,
    reviewCount: 18,
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800',
    contactInfo: {
      phone: '+20 111 222 3333',
      email: 'mama.noura@example.com',
      address: 'Montazah, Alexandria',
      socialMedia: {
        whatsapp: '+201112223333'
      }
    },
    menu: [
      {
        id: '301',
        name: 'Molokhia with Chicken',
        description: 'Egyptian jute leaf stew served with chicken and rice',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800',
        category: 'Main Dishes',
        popular: true
      },
      {
        id: '302',
        name: 'Seafood Tagine',
        description: 'Fresh Alexandria seafood with vegetables and spices in a clay pot',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1611489142329-5da8e7f9d067?w=800',
        category: 'Main Dishes',
        popular: true
      }
    ],
    isActive: true,
    createdAt: new Date('2024-02-20')
  }
];

const initialReviews: Review[] = [
  {
    id: '1',
    providerId: '1',
    userId: 'user1',
    userName: 'Mohamed A.',
    rating: 5,
    comment: 'The best koshari I\'ve ever had! Tastes just like my grandmother used to make.',
    createdAt: new Date('2024-03-15')
  },
  {
    id: '2',
    providerId: '1',
    userId: 'user2',
    userName: 'Sara H.',
    rating: 4,
    comment: 'Very authentic home cooking. The stuffed vine leaves were amazing!',
    createdAt: new Date('2024-03-10')
  },
  {
    id: '3',
    providerId: '2',
    userId: 'user3',
    userName: 'Ahmed M.',
    rating: 4,
    comment: 'The ful medames was delicious and very affordable. Great little spot!',
    createdAt: new Date('2024-02-28')
  }
];

type HomeFoodContextType = {
  providers: FoodProvider[];
  reviews: Review[];
  messages: Message[];
  myProviders: FoodProvider[];
  addProvider: (provider: Omit<FoodProvider, 'id' | 'createdAt' | 'userId'>) => Promise<string>;
  getProvider: (id: string) => FoodProvider | undefined;
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  getReviews: (providerId: string) => Review[];
  sendMessage: (message: Omit<Message, 'id' | 'createdAt'>) => void;
  getMessages: (providerId: string, userId: string) => Message[];
  toggleFavorite: (providerId: string) => void;
  favorites: string[];
};

const HomeFoodContext = createContext<HomeFoodContextType>({
  providers: [],
  reviews: [],
  messages: [],
  myProviders: [],
  addProvider: async () => '',
  getProvider: () => undefined,
  addReview: () => {},
  getReviews: () => [],
  sendMessage: () => {},
  getMessages: () => [],
  toggleFavorite: () => {},
  favorites: []
});

export const useHomeFood = () => useContext(HomeFoodContext);

export const HomeFoodProvider = ({ children }: { children: ReactNode }) => {
  const { user } = usePiAuth();
  const [providers, setProviders] = useState<FoodProvider[]>(initialProviders);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [messages, setMessages] = useState<Message[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Load data from localStorage when user changes
  useEffect(() => {
    if (user) {
      const savedFavorites = localStorage.getItem(`homefood_favorites_${user.uid}`);
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites));
        } catch (error) {
          console.error('Failed to parse saved favorites', error);
        }
      }
      
      const savedMessages = localStorage.getItem(`homefood_messages_${user.uid}`);
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages);
          setMessages(parsedMessages.map((msg: any) => ({
            ...msg,
            createdAt: new Date(msg.createdAt)
          })));
        } catch (error) {
          console.error('Failed to parse saved messages', error);
        }
      }
    } else {
      // Clear user-specific data when logged out
      setFavorites([]);
      setMessages([]);
    }
  }, [user]);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`homefood_favorites_${user.uid}`, JSON.stringify(favorites));
      if (messages.length > 0) {
        localStorage.setItem(`homefood_messages_${user.uid}`, JSON.stringify(messages));
      }
    }
  }, [favorites, messages, user]);
  
  // Filter providers created by the current user
  const myProviders = providers.filter(provider => provider.userId === user?.uid);
  
  const addProvider = async (providerData: Omit<FoodProvider, 'id' | 'createdAt' | 'userId'>): Promise<string> => {
    if (!user) {
      toast.error('Please login to add your food listing');
      return '';
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newProvider: FoodProvider = {
      ...providerData,
      id: Date.now().toString(),
      createdAt: new Date(),
      userId: user.uid,
    };
    
    setProviders(current => [...current, newProvider]);
    
    toast.success('Your food listing has been added successfully!');
    return newProvider.id;
  };
  
  const getProvider = (id: string) => {
    return providers.find(provider => provider.id === id);
  };
  
  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    if (!user) {
      toast.error('Please login to leave a review');
      return;
    }
    
    const newReview: Review = {
      ...reviewData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    setReviews(current => [...current, newReview]);
    
    // Update provider rating
    const providerReviews = [...reviews, newReview].filter(r => r.providerId === reviewData.providerId);
    const avgRating = providerReviews.reduce((sum, r) => sum + r.rating, 0) / providerReviews.length;
    
    setProviders(current => 
      current.map(provider => 
        provider.id === reviewData.providerId 
          ? { 
              ...provider, 
              rating: parseFloat(avgRating.toFixed(1)), 
              reviewCount: providerReviews.length 
            } 
          : provider
      )
    );
    
    toast.success('Thank you for your review!');
  };
  
  const getReviews = (providerId: string) => {
    return reviews.filter(review => review.providerId === providerId);
  };
  
  const sendMessage = (messageData: Omit<Message, 'id' | 'createdAt'>) => {
    if (!user) {
      toast.error('Please login to send messages');
      return;
    }
    
    const newMessage: Message = {
      ...messageData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    setMessages(current => [...current, newMessage]);
    
    toast.success('Message sent!');
  };
  
  const getMessages = (providerId: string, userId: string) => {
    return messages.filter(
      msg => msg.providerId === providerId && 
      (msg.userId === userId || (msg.isFromProvider && msg.providerId === providerId))
    ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  };
  
  const toggleFavorite = (providerId: string) => {
    if (!user) {
      toast.error('Please login to save favorites');
      return;
    }
    
    setFavorites(current => {
      const isFavorite = current.includes(providerId);
      if (isFavorite) {
        toast.info('Removed from favorites');
        return current.filter(id => id !== providerId);
      } else {
        toast.success('Added to favorites');
        return [...current, providerId];
      }
    });
  };
  
  return (
    <HomeFoodContext.Provider
      value={{
        providers,
        reviews,
        messages,
        myProviders,
        addProvider,
        getProvider,
        addReview,
        getReviews,
        sendMessage,
        getMessages,
        toggleFavorite,
        favorites
      }}
    >
      {children}
    </HomeFoodContext.Provider>
  );
};
