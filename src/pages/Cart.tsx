
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, CreditCard, Check } from 'lucide-react';
import Header from '@/components/Header';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrdersContext';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { toast } from 'sonner';

const Cart = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { user } = usePiAuth();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pi' | 'pieat'>('pi');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login to complete your order');
      return;
    }
    
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    if (!deliveryAddress) {
      toast.error('Please provide a delivery address');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const orderId = await createOrder(items, paymentMethod, deliveryAddress);
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders?new=${orderId}`);
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
      console.error('Checkout error:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex flex-col items-center">
          <div className="text-center mb-6">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground">
              Start adding items from our restaurants to place an order
            </p>
          </div>
          <Button onClick={() => navigate('/restaurants')} className="button-gradient">
            Browse Restaurants
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="divide-y">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start py-4 first:pt-0 last:pb-0">
                    <div 
                      className="w-16 h-16 rounded overflow-hidden flex-shrink-0 mr-4"
                      style={{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover' }}
                    />
                    <div className="flex-grow">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">From {item.restaurantName}</p>
                      <div className="flex items-center mt-1">
                        <span>Quantity: {item.quantity}</span>
                        <span className="mx-2">•</span>
                        <span>π {item.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="text-right font-semibold">
                      π {(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          
          {/* Checkout Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>π {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>π 0.50</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>π {(totalPrice + 0.5).toFixed(2)}</span>
                </div>
                
                {/* Delivery Address */}
                <div className="mt-4">
                  <Label htmlFor="address">Delivery Address</Label>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                    <Input 
                      id="address"
                      placeholder="Enter your delivery address" 
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Payment Method */}
                <div className="mt-4">
                  <Label>Payment Method</Label>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={(value) => setPaymentMethod(value as 'pi' | 'pieat')}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pi" id="pi" />
                      <Label htmlFor="pi" className="flex items-center">
                        <div className="text-lg mr-2">π</div>
                        <span>Pi Wallet</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <RadioGroupItem value="pieat" id="pieat" />
                      <Label htmlFor="pieat" className="flex items-center">
                        <div className="relative mr-2">
                          <div className="text-lg">π</div>
                          <div className="absolute -top-1 -right-2 text-xs bg-orange text-white rounded-full h-3 w-3 flex items-center justify-center">
                            🍕
                          </div>
                        </div>
                        <span>PiEat Balance</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full button-gradient" 
                  onClick={handleCheckout}
                  disabled={isProcessing || !deliveryAddress}
                >
                  {isProcessing ? (
                    <span className="flex items-center">
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Place Order
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
