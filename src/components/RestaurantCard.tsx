
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, CircleDollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

type RestaurantCardProps = {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  priceRange: string;
  featured?: boolean;
};

const RestaurantCard = ({
  id,
  name,
  image,
  cuisine,
  rating,
  deliveryTime,
  priceRange,
  featured = false,
}: RestaurantCardProps) => {
  const { t } = useLanguage();
  
  return (
    <Link to={`/restaurants/${id}`}>
      <Card className={`overflow-hidden hover:shadow-md transition-all duration-300 h-full ${
        featured ? 'border-pi/30 shadow-lg' : ''
      }`}>
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {featured && (
            <Badge className="absolute top-2 right-2 bg-pi hover:bg-pi">
              {t('home.featured')}
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-1">{name}</h3>
          <p className="text-muted-foreground text-sm mb-3">{cuisine}</p>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-orange fill-orange mr-1" />
              <span>{rating.toFixed(1)}</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{deliveryTime}</span>
            </div>
            
            <div className="flex items-center">
              <CircleDollarSign className="h-4 w-4 mr-1" />
              <span>{priceRange}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default RestaurantCard;
