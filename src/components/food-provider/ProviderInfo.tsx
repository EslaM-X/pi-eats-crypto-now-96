
import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
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
        <p className="text-muted-foreground mb-4">{provider.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{provider.contactInfo.address}</span>
          </div>
          {provider.contactInfo.phone && (
            <div className="flex items-start">
              <Phone className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{provider.contactInfo.phone}</span>
            </div>
          )}
          {provider.contactInfo.email && (
            <div className="flex items-start">
              <Mail className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{provider.contactInfo.email}</span>
            </div>
          )}
        </div>
        
        {/* Cuisine Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {provider.cuisine.map((cuisine, index) => (
            <Badge key={index} variant="outline">
              {cuisine}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProviderInfo;
