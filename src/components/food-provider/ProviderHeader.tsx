
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Heart, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { FoodProvider } from '@/types/food';

interface ProviderHeaderProps {
  provider: FoodProvider;
  isUsersFavorite?: boolean;
  toggleFavorite: (id: string) => void;
  openMessageDialog: () => void;
  isLoggedIn: boolean;
}

const ProviderHeader: React.FC<ProviderHeaderProps> = ({
  provider,
  isUsersFavorite,
  toggleFavorite,
  openMessageDialog,
  isLoggedIn
}) => {
  return (
    <div 
      className="relative h-64 bg-cover bg-center"
      style={{ backgroundImage: `url(${provider.coverImage || provider.image})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/10">
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-4">
          <Link to="/homefood">
            <Button variant="ghost" className="absolute top-4 left-4 text-white bg-black/30 hover:bg-black/40">
              <ChevronLeft className="h-5 w-5" />
              Back
            </Button>
          </Link>
          
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-white">{provider.name}</h1>
              <div className="flex items-center mt-2 space-x-4">
                <Badge 
                  variant="secondary" 
                  className={`bg-white/20 text-white ${
                    provider.type === 'homemade' ? 'border-orange' : 'border-pi'
                  }`}
                >
                  {provider.type === 'homemade' ? 'Home Cooking' : 'Small Restaurant'}
                </Badge>
                <div className="flex items-center text-white">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                  <span>{provider.rating.toFixed(1)} ({provider.reviewCount})</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => isLoggedIn 
                  ? toggleFavorite(provider.id) 
                  : toast.error('Please login to save favorites')
                }
                className="bg-black/30 hover:bg-black/40 text-white h-10 w-10"
              >
                <Heart 
                  className={`h-5 w-5 ${isUsersFavorite ? 'fill-red-500 text-red-500' : ''}`}
                />
              </Button>
              
              <Button 
                variant="ghost"
                size="icon"
                onClick={openMessageDialog}
                className="bg-black/30 hover:bg-black/40 text-white h-10 w-10"
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderHeader;
