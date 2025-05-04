
import { FoodProvider, Review, Message } from '@/types/food';

// Additional types needed for HomeFoodContext
export interface HomeFoodContextType {
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
