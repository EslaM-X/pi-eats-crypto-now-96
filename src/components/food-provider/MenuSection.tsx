
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FoodProvider } from '@/types/food';

interface MenuSectionProps {
  provider: FoodProvider;
  theme: string;
  handleAddToCart: (item: any) => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({ provider, theme, handleAddToCart }) => {
  // Group menu items by category
  const menuByCategory = provider.menu.reduce((acc: Record<string, any[]>, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(menuByCategory).map(([category, items]) => (
        <div key={category}>
          <h3 className="font-semibold mb-3">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map(item => (
              <Card key={item.id} className={`overflow-hidden ${theme === 'dark' ? 'bg-muted/20' : ''}`}>
                <div className="flex">
                  <div className="w-24 h-24 overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 flex-grow">
                    <div className="flex justify-between">
                      <h4 className="font-medium">
                        {item.name}
                        {item.popular && (
                          <Badge variant="secondary" className="ml-2 bg-orange/20 text-orange">
                            Popular
                          </Badge>
                        )}
                      </h4>
                      <span className="font-semibold">π {item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 h-8 text-primary hover:text-primary hover:bg-primary/10"
                      onClick={() => handleAddToCart(item)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
      
      {provider.menu.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No menu items available.</p>
        </div>
      )}
    </div>
  );
};

export default MenuSection;
