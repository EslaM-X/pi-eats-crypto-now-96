
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin } from 'lucide-react';
import { FoodProvider } from '@/types/food';
import { cn } from '@/lib/utils';

interface FoodProviderCardProps {
  provider: FoodProvider;
  isFavorite?: boolean;
}

const FoodProviderCard: React.FC<FoodProviderCardProps> = ({ 
  provider, 
  isFavorite = false 
}) => {
  const { id, name, type, image, cuisine, rating, location } = provider;
  
  return (
    <Link to={`/homefood/${id}`} className="block h-full">
      <Card className={cn(
        "overflow-hidden hover:shadow-md transition-all duration-300 h-full",
        isFavorite ? "border-pi/30 shadow-lg" : ""
      )}>
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <Badge 
            className={cn(
              "absolute top-2 right-2",
              type === 'homemade' ? "bg-orange hover:bg-orange" : "bg-pi hover:bg-pi"
            )}
          >
            {type === 'homemade' ? 'Home Cooked' : 'Small Restaurant'}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-1">{name}</h3>
          <div className="flex flex-wrap gap-1 mb-3">
            {cuisine.map((item, index) => (
              <span 
                key={index} 
                className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-orange fill-orange mr-1" />
              <span>{rating.toFixed(1)}</span>
            </div>
            
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{location}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default FoodProviderCard;
