
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

// Define food categories with images
const categories = [
  {
    name: 'Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'
  },
  {
    name: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
  },
  {
    name: 'Sushi',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400'
  },
  {
    name: 'Middle Eastern',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'
  },
  {
    name: 'Dessert',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400'
  },
  {
    name: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400'
  }
];

const FoodCategories = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">{t('home.categories')}</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Card 
              key={category.name}
              className="overflow-hidden hover:shadow-md transition-all cursor-pointer"
            >
              <div className="h-24 overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-3 text-center">
                <h3 className="font-medium">{category.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoodCategories;
