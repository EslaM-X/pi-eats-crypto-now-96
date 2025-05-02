
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FoodProvider } from '@/types/food';

interface MenuSectionProps {
  provider: FoodProvider;
  theme: string;
  handleAddToCart: (item: any) => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({ provider, theme, handleAddToCart }) => {
  return (
    <>
      {/* Group menu items by category */}
      {Array.from(new Set(provider.menu.map(item => item.category))).map(category => (
        <div key={category} className="mb-6">
          <h3 className="text-xl font-bold mb-3">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {provider.menu
              .filter(item => item.category === category)
              .map(item => (
                <Card key={item.id} className={`overflow-hidden ${theme === 'dark' ? 'bg-muted/20' : ''}`}>
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-1/3 h-24 sm:h-auto">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">
                            {item.name}
                            {item.popular && (
                              <Badge variant="secondary" className="ml-2 bg-orange/20 text-orange">
                                Popular
                              </Badge>
                            )}
                          </h3>
                          <div className="font-semibold">π {item.price.toFixed(2)}</div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      
                      <Button 
                        onClick={() => handleAddToCart(item)}
                        size="sm"
                        className="w-full button-gradient mt-3"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default MenuSection;
