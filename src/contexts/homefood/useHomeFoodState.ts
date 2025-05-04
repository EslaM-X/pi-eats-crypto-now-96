
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FoodProvider, Review, Message } from '@/types/food';
import { sampleProviders, sampleReviews } from './sample-data';

// Custom hook to manage home food state
export const useHomeFoodState = (userId?: string | null) => {
  const [providers, setProviders] = useState<FoodProvider[]>(sampleProviders);
  const [reviews, setReviews] = useState<{ [key: string]: Review[] }>(sampleReviews);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});

  // Load favorites from localStorage when user changes
  useEffect(() => {
    if (userId) {
      try {
        const savedFavorites = localStorage.getItem(`favorites_${userId}`);
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    } else {
      setFavorites([]);
    }
  }, [userId]);

  // Save favorites to localStorage when changed
  useEffect(() => {
    if (userId && favorites.length > 0) {
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
    }
  }, [favorites, userId]);

  // Toggle a provider as favorite
  const toggleFavorite = (id: string) => {
    if (!userId) return;
    
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

  // Alias for addFoodProvider for compatibility
  const addProvider = addFoodProvider;

  // Add a review to a provider
  const addReview = (providerId: string, rating: number, comment: string) => {
    if (!userId) return;
    
    const userName = "User"; // Default value if username is not available
    
    const newReview: Review = {
      id: uuidv4(),
      providerId,
      userId,
      userName,
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
    if (!userId) return;
    
    const userName = "User"; // Default value if username is not available
    
    const newMessage: Message = {
      id: uuidv4(),
      providerId,
      userId,
      userName,
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

  return {
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
  };
};
