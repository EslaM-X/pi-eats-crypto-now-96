
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, ChevronLeft, PlusCircle, MinusCircle, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { useWallet } from '@/contexts/WalletContext';
import { useOrders } from '@/contexts/OrdersContext';

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { balance, sendPi } = useWallet();
  const { addOrder } = useOrders();

  // Calculate total
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = items.length > 0 ? 0.5 : 0;
  const serviceFee = items.length > 0 ? subtotal * 0.05 : 0;
  const total = subtotal + deliveryFee + serviceFee;

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error(t('cart.emptyCartError'));
      return;
    }

    if (balance < total) {
      toast.error(t('cart.insufficientFunds'));
      return;
    }

    // Process payment
    sendPi(total, 'PiEat Restaurant').then((success) => {
      if (success) {
        // Create order
        const newOrder = {
          id: `order-${Date.now()}`,
          items: [...items],
          total,
          status: 'processing',
          createdAt: new Date(),
          restaurantId: items[0]?.restaurantId || 'unknown',
          restaurantName: items[0]?.restaurantName || 'Unknown Restaurant',
        };
        
        addOrder(newOrder);
        clearCart();
        toast.success(t('cart.orderSuccess'));
        navigate('/orders');
      }
    });
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
    toast.info(t('cart.itemRemoved'));
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">{t('cart.title')}</h1>
          <div className="flex flex-col items-center justify-center py-16">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-medium mb-2">{t('cart.empty')}</h2>
            <p className="text-muted-foreground mb-6">{t('cart.emptyMsg')}</p>
            <Button onClick={() => navigate('/restaurants')} className="button-gradient">
              {t('cart.browseRestaurants')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">{t('cart.title')}</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{t('cart.items')}</h2>
                <Button variant="ghost" size="sm" onClick={() => clearCart()} className="text-sm text-destructive">
                  <Trash2 className="h-4 w-4 mr-1" />
                  {t('cart.clearCart')}
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="h-16 w-16 overflow-hidden rounded-md">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.restaurantName}
                      </p>
                      <div className="mt-1 flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        <span className="mx-2 min-w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">π {item.price.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">
                        π {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">{t('cart.summary')}</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                  <span>π {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('cart.deliveryFee')}</span>
                  <span>π {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('cart.serviceFee')}</span>
                  <span>π {serviceFee.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>{t('cart.total')}</span>
                  <span>π {total.toFixed(2)}</span>
                </div>
              </div>
              <Button
                onClick={handleCheckout}
                className="w-full mt-4 button-gradient"
              >
                {t('cart.checkout')}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
