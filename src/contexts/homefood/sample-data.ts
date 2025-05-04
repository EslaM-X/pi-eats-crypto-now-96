
import { FoodProvider, Review } from '@/types/food';

// Sample providers data
export const sampleProviders: FoodProvider[] = [
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
export const sampleReviews: { [key: string]: Review[] } = {
  '1': [
    {
      id: 'r1',
      providerId: '1',
      userId: 'user1',
      userName: 'Mohamed',
      userImage: null,
      rating: 5,
      comment: 'Amazing food! The Koshari was perfect.',
      createdAt: '2023-04-12T14:23:00.000Z'
    },
    {
      id: 'r2',
      providerId: '1',
      userId: 'user2',
      userName: 'Sarah',
      userImage: null,
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
      userImage: null,
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
      userImage: null,
      rating: 5,
      comment: 'Authentic Nubian flavors, made me nostalgic!',
      createdAt: '2023-04-05T12:30:00.000Z'
    }
  ]
};
