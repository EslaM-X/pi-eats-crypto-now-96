
import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FoodProvider } from '@/types/food';

interface ProviderInfoProps {
  provider: FoodProvider;
  theme: string;
}

const ProviderInfo: React.FC<ProviderInfoProps> = ({ provider, theme }) => {
  return (
    <Card className={`mb-6 ${theme === 'dark' ? 'bg-muted/20' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <Star className="h-5 w-5 text-primary fill-primary" />
            </div>
            <div>
              <div className="flex items-center">
                <span className="font-semibold">{provider.rating.toFixed(1)}</span>
                <span className="text-muted-foreground text-sm ml-1">({provider.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 items-center justify-end">
            {provider.cuisine.map(cuisine => (
              <Badge key={cuisine} variant="secondary">{cuisine}</Badge>
            ))}
          </div>
        </div>
        
        <p className="text-muted-foreground">{provider.description}</p>
      </CardContent>
    </Card>
  );
};

export default ProviderInfo;
