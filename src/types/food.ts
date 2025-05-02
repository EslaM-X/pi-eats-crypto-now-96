
export interface FoodProvider {
  id: string;
  name: string;
  type: 'homemade' | 'small_restaurant';
  description: string;
  cuisine: string[];
  location: string;
  rating: number;
  reviewCount: number;
  image: string;
  coverImage?: string;
  contactInfo: {
    phone?: string;
    email?: string;
    address: string;
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      whatsapp?: string;
    }
  };
  menu: FoodItem[];
  isActive: boolean;
  createdAt: Date;
  userId?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
  ingredients?: string[];
  allergyInfo?: string[];
  preparationTime?: string;
}

export interface Review {
  id: string;
  providerId: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  createdAt: Date;
  images?: string[];
}

export interface Message {
  id: string;
  providerId: string;
  userId: string;
  userName: string;
  providerName: string;
  content: string;
  createdAt: Date;
  isFromProvider: boolean;
}
