
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useHomeFood } from '@/contexts/HomeFoodContext';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { FoodProvider } from '@/types/food';

interface FoodProviderCardProps {
  provider: FoodProvider;
  isFavorite?: boolean;
}

const FoodProviderCard: React.FC<FoodProviderCardProps> = ({ provider, isFavorite = false }) => {
  const navigate = useNavigate();
  const { toggleFavorite } = useHomeFood();
  const { user } = usePiAuth();
  
  const handleCardClick = () => {
    navigate(`/homefood/${provider.id}`);
  };
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      toggleFavorite(provider.id);
    }
  };
  
  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
      onClick={handleCardClick}
    >
      <div className="relative h-40">
        <img 
          src={provider.image} 
          alt={provider.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-2 right-2">
          {user && (
            <button
              onClick={handleFavoriteClick}
              className="h-8 w-8 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center transition-colors hover:bg-white dark:hover:bg-gray-700"
            >
              <Heart 
                className={`h-4 w-4 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600 dark:text-gray-300'}`} 
              />
            </button>
          )}
        </div>
        <div className="absolute bottom-2 left-2">
          <Badge className={provider.type === 'homemade' ? 'bg-orange' : 'bg-blue-600'}>
            {provider.type === 'homemade' ? 'Home Cooking' : 'Restaurant'}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg line-clamp-1">{provider.name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
            <span className="text-sm">{provider.rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex items-center mt-1 text-muted-foreground text-sm">
          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
          <span>{provider.location}</span>
        </div>
        <p className="mt-2 text-sm line-clamp-2 text-muted-foreground">{provider.description}</p>
        <div className="mt-3 flex flex-wrap gap-1">
          {provider.cuisine.slice(0, 3).map((cuisine, index) => (
            <span 
              key={index} 
              className="text-xs px-2 py-0.5 bg-muted rounded-md"
            >
              {cuisine}
            </span>
          ))}
          {provider.cuisine.length > 3 && (
            <span className="text-xs px-2 py-0.5 bg-muted rounded-md">
              +{provider.cuisine.length - 3}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodProviderCard;
