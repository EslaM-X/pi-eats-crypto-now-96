
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePiPrice } from '@/contexts/PiPriceContext';

type FoodCardProps = {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  popular?: boolean;
  onAddToCart: () => void;
};

const FoodCard = ({
  id,
  name,
  image,
  description,
  price,
  popular = false,
  onAddToCart,
}: FoodCardProps) => {
  const { t } = useLanguage();
  const { priceData } = usePiPrice();
  
  // Calculate Pi price equivalent
  const piPrice = priceData ? price / priceData.price : 0;
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 h-full">
      <div className="relative h-40 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {popular && (
          <Badge className="absolute top-2 right-2 bg-orange hover:bg-orange-dark">
            Popular
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1">{name}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold">{price.toFixed(2)} USD</div>
            <div className="text-xs text-muted-foreground">≈ {piPrice.toFixed(2)} π</div>
          </div>
          
          <Button 
            onClick={(e) => {
              e.preventDefault();
              onAddToCart();
            }} 
            size="sm" 
            className="button-gradient"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            {t('food.addToCart')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodCard;
