import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { usePiAuth } from './PiAuthContext';
import { CartItem } from './CartContext';

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  deliveryAddress?: string;
  estimatedDelivery?: Date;
  paymentMethod: 'pi' | 'pieat';
};

type OrdersContextType = {
  orders: Order[];
  createOrder: (items: CartItem[], paymentMethod: 'pi' | 'pieat', address: string) => Promise<string>;
  getOrder: (id: string) => Order | undefined;
  cancelOrder: (id: string) => void;
};

const OrdersContext = createContext<OrdersContextType>({
  orders: [],
  createOrder: async () => '',
  getOrder: () => undefined,
  cancelOrder: () => {},
});

export const useOrders = () => useContext(OrdersContext);

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const { user } = usePiAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Load orders from localStorage when user changes
  useEffect(() => {
    if (user) {
      const savedOrders = localStorage.getItem(`orders_${user.uid}`);
      if (savedOrders) {
        try {
          const parsedOrders = JSON.parse(savedOrders);
          // Convert date strings back to Date objects
          const formattedOrders = parsedOrders.map((order: any) => ({
            ...order,
            createdAt: new Date(order.createdAt),
            updatedAt: new Date(order.updatedAt),
            estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery) : undefined,
          }));
          setOrders(formattedOrders);
        } catch (error) {
          console.error('Failed to parse saved orders', error);
        }
      }
    } else {
      // Clear orders when user logs out
      setOrders([]);
    }
  }, [user]);
  
  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (user && orders.length > 0) {
      localStorage.setItem(`orders_${user.uid}`, JSON.stringify(orders));
    }
  }, [orders, user]);
  
  const createOrder = async (items: CartItem[], paymentMethod: 'pi' | 'pieat', address: string): Promise<string> => {
    if (!user) {
      toast.error('Please login to create an order');
      return '';
    }
    
    if (items.length === 0) {
      toast.error('Cannot create an empty order');
      return '';
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const newOrder: Order = {
      id: Date.now().toString(),
      items: [...items],
      status: 'pending',
      total,
      createdAt: new Date(),
      updatedAt: new Date(),
      deliveryAddress: address,
      estimatedDelivery: new Date(Date.now() + 45 * 60000), // 45 minutes from now
      paymentMethod,
    };
    
    setOrders(currentOrders => [newOrder, ...currentOrders]);
    
    toast.success('Order placed successfully!');
    return newOrder.id;
  };
  
  const getOrder = (id: string) => {
    return orders.find(order => order.id === id);
  };
  
  const cancelOrder = (id: string) => {
    setOrders(currentOrders => 
      currentOrders.map(order => 
        order.id === id && order.status === 'pending'
          ? { ...order, status: 'cancelled', updatedAt: new Date() }
          : order
      )
    );
    
    toast.info('Order cancelled');
  };
  
  return (
    <OrdersContext.Provider
      value={{
        orders,
        createOrder,
        getOrder,
        cancelOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};
