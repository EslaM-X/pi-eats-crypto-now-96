
// Food provider types
export interface FoodProvider {
  id: string;
  name: string;
  type: 'homemade' | 'restaurant';
  image: string;
  coverImage?: string;
  description: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  location: string;
  contactInfo: {
    address: string;
    phone?: string;
    email?: string;
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      whatsapp?: string;
    }
  };
  menu: MenuItem[];
  isAvailable: boolean;
  userId?: string;
  createdAt?: Date;
  isActive?: boolean;
}

// Menu item
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
}

// Review
export interface Review {
  id: string;
  providerId: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

// Message
export interface Message {
  id: string;
  providerId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
  isFromProvider: boolean;
}
