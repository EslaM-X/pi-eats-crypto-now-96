
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, CreditCard, Truck, Star } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const steps = [
  {
    title: 'Browse & Order',
    description: 'Find restaurants or home cooks near you and order your favorite meals',
    icon: <ShoppingCart className="h-8 w-8" />
  },
  {
    title: 'Pay with Pi',
    description: 'Securely pay with Pi cryptocurrency, no transaction fees',
    icon: <CreditCard className="h-8 w-8" />
  },
  {
    title: 'Get Delivery',
    description: 'Enjoy fast delivery right to your doorstep',
    icon: <Truck className="h-8 w-8" />
  },
  {
    title: 'Earn Rewards',
    description: 'Get PTM tokens and discounts for your orders and reviews',
    icon: <Star className="h-8 w-8" />
  }
];

const HowItWorks = () => {
  const { theme } = useTheme();
  
  return (
    <section className={`py-12 ${theme === 'dark' ? 'bg-muted/20' : 'bg-muted/30'}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">How It Works</h2>
        <p className="text-muted-foreground mb-10 text-center max-w-2xl mx-auto">
          Order food and pay with Pi cryptocurrency in just a few easy steps
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="relative">
              <span className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-pi text-white flex items-center justify-center font-bold">
                {index + 1}
              </span>
              <CardHeader>
                <div className="flex justify-center text-pi">{step.icon}</div>
                <CardTitle className="text-center mt-2">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
