
// أنواع البيانات المتعلقة بالطعام والمطاعم

export interface FoodProvider {
  id: string;
  name: string;
  type: 'restaurant' | 'homemade';
  description: string;
  image: string;
  coverImage?: string;
  location: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
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

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  isFromProvider: boolean;
}
