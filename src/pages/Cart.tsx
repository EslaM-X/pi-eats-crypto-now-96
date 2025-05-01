
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrdersContext';
import { useWallet } from '@/contexts/WalletContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingCart, 
  ArrowRight, 
  Wallet,
  HomeIcon
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';

const Cart = () => {
  const { t } = useLanguage();
  const { user, login } = usePiAuth();
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const { createOrder } = useOrders();
  const { balance } = useWallet();
  const navigate = useNavigate();
  
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pi' | 'pieat'>('pi');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.restaurantId]) {
      acc[item.restaurantId] = {
        restaurantName: item.restaurantName,
        items: []
      };
    }
    acc[item.restaurantId].items.push(item);
    return acc;
  }, {} as Record<string, { restaurantName: string, items: typeof items }>);
  
  const handleCheckout = async () => {
    if (!user) {
      login();
      return;
    }
    
    if (items.length === 0) {
      toast.error(t('cart.emptyCartError'));
      return;
    }
    
    if (!address.trim()) {
      toast.error(t('cart.addressRequired'));
      return;
    }
    
    if (paymentMethod === 'pi' && balance < totalPrice) {
      toast.error(t('cart.insufficientBalance'));
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Create order - fixed by passing only one argument as expected
      const orderId = await createOrder(items);
      
      if (orderId) {
        // Clear cart after successful order
        clearCart();
        
        // If using Pi, simulate transaction
        if (paymentMethod === 'pi') {
          // This would be replaced with actual Pi payment
          toast.success(t('cart.paymentSuccessful'));
        }
        
        // Navigate to order confirmation
        navigate(`/orders`);
      }
    } catch (error) {
      toast.error(t('cart.checkoutError'));
      console.error('Checkout error:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('nav.cart')}</h1>
          <p className="text-muted-foreground">
            {totalItems > 0 
              ? t('cart.itemsInCart', { count: totalItems }) 
              : t('cart.emptyCart')}
          </p>
        </div>
        
        {items.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="flex flex-col items-center justify-center p-10">
              <div className="mb-6 text-center">
                <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-xl font-medium">{t('cart.yourCartEmpty')}</h3>
                <p className="text-muted-foreground mt-2">
                  {t('cart.addItems')}
                </p>
              </div>
              <Button 
                onClick={() => navigate('/restaurants')}
                className="button-gradient"
              >
                {t('cart.browseRestaurants')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {Object.entries(groupedItems).map(([restaurantId, { restaurantName, items }]) => (
                <Card key={restaurantId} className="glass-card mb-6">
                  <CardHeader>
                    <CardTitle>{restaurantName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="divide-y">
                      {items.map((item) => (
                        <li key={item.id} className="py-4 flex items-center">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-muted">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          
                          <div className="ml-4 flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {paymentMethod === 'pi' ? 'π' : 'PiEat'} {item.price.toFixed(2)}
                            </p>
                          </div>
                          
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            
                            <span className="mx-2 w-8 text-center">
                              {item.quantity}
                            </span>
                            
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-2 text-red-500 h-8 w-8"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
              
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="mb-6"
                  onClick={clearCart}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('cart.clearCart')}
                </Button>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="glass-card sticky top-20">
                <CardHeader>
                  <CardTitle>{t('cart.orderSummary')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>{t('cart.subtotal')}</span>
                    <span>{paymentMethod === 'pi' ? 'π' : 'PiEat'} {totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>{t('cart.deliveryFee')}</span>
                    <span>{t('cart.free')}</span>
                  </div>
                  
                  <div className="border-t pt-4 flex justify-between font-bold">
                    <span>{t('cart.total')}</span>
                    <span>{paymentMethod === 'pi' ? 'π' : 'PiEat'} {totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-4">
                    <label className="block text-sm font-medium mb-2">
                      {t('cart.deliveryAddress')}
                    </label>
                    <div className="flex">
                      <HomeIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder={t('cart.enterAddress')}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <label className="block text-sm font-medium mb-2">
                      {t('cart.paymentMethod')}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={paymentMethod === 'pi' ? 'default' : 'outline'}
                        className={paymentMethod === 'pi' ? 'border-2 border-primary' : ''}
                        onClick={() => setPaymentMethod('pi')}
                      >
                        <span className="mr-2">π</span> Pi
                      </Button>
                      <Button
                        type="button"
                        variant={paymentMethod === 'pieat' ? 'default' : 'outline'}
                        className={paymentMethod === 'pieat' ? 'border-2 border-primary' : ''}
                        onClick={() => setPaymentMethod('pieat')}
                      >
                        PiEat
                      </Button>
                    </div>
                    
                    {paymentMethod === 'pi' && (
                      <div className="mt-2 text-sm flex items-center">
                        <Wallet className="mr-2 h-4 w-4" />
                        <span>
                          {t('cart.balance')}: π {balance.toFixed(2)}
                          {balance < totalPrice && (
                            <span className="text-red-500 ml-1">
                              ({t('cart.insufficient')})
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full button-gradient"
                    disabled={isProcessing || (paymentMethod === 'pi' && balance < totalPrice)}
                    onClick={handleCheckout}
                  >
                    {isProcessing ? t('cart.processing') : (
                      <>
                        {user ? t('cart.placeOrder') : t('auth.connectWithPi')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
