
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Heart, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  isUsersFavorite = false,
  toggleFavorite,
  openMessageDialog,
  isLoggedIn
}) => {
  return (
    <div 
      className="relative h-64 bg-cover bg-center"
      style={{ backgroundImage: `url(${provider.coverImage || provider.image})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/20">
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-4 relative">
          <Link to="/homefood">
            <Button variant="ghost" className="absolute top-4 left-4 text-white bg-black/30 hover:bg-black/40">
              <ChevronLeft className="h-5 w-5" />
              Back
            </Button>
          </Link>
          
          <div className="flex items-end justify-between">
            <div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-1 inline-block mb-2">
                <span className={`px-2 py-1 text-xs rounded-md ${provider.type === 'homemade' ? 'bg-orange text-white' : 'bg-blue-500 text-white'}`}>
                  {provider.type === 'homemade' ? 'Home Cooking' : 'Small Restaurant'}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white">{provider.name}</h1>
              <div className="flex items-center mt-1 text-white">
                <span>{provider.cuisine.join(', ')}</span>
                <span className="mx-2">•</span>
                <span>{provider.location}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {isLoggedIn && (
                <>
                  <Button
                    variant={isUsersFavorite ? "default" : "outline"}
                    size="icon"
                    className={isUsersFavorite ? "bg-primary text-primary-foreground" : "bg-black/30 text-white border-white/20 hover:bg-black/50"}
                    onClick={() => toggleFavorite(provider.id)}
                  >
                    <Heart className={`h-5 w-5 ${isUsersFavorite ? "fill-current" : ""}`} />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-black/30 text-white border-white/20 hover:bg-black/50"
                    onClick={openMessageDialog}
                  >
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderHeader;
