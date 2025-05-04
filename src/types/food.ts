
// Food and restaurant related types

export interface FoodProvider {
  id: string;
  name: string;
  description: string;
  image: string;
  coverImage?: string;
  rating: number;
  reviewCount: number;
  type: 'homemade' | 'restaurant';
  cuisine: string[];
  location: string;
  contactInfo: {
    phone?: string;
    email?: string;
    address: string;
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      whatsapp?: string;
    };
  };
  menu: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  popular?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  coverImage?: string;
  cuisine: string[];
  rating: number;
  deliveryTime: string;
  priceRange: string;
  address: string;
  menu: MenuItem[];
  featured?: boolean;
}

export interface Review {
  id: string;
  providerId: string;
  userId: string;
  userName: string;
  userImage: string | null;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Message {
  id: string;
  providerId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  isFromProvider: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  providerId: string;
  providerName: string;
  image: string;
}
