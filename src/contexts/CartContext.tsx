
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Cart item interface
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  restaurantId?: string;
  restaurantName?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart data:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  
  // Add item to cart
  const addItem = (item: CartItem) => {
    setItems(currentItems => {
      // Check if item already exists
      const existingItemIndex = currentItems.findIndex(i => i.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += item.quantity || 1;
        toast.success(`Updated ${item.name} quantity in cart`);
        return updatedItems;
      } else {
        // Add new item
        toast.success(`Added ${item.name} to cart`);
        return [...currentItems, { ...item, quantity: item.quantity || 1 }];
      }
    });
  };
  
  // Remove item from cart
  const removeItem = (id: string) => {
    setItems(currentItems => {
      const item = currentItems.find(i => i.id === id);
      if (item) {
        toast.info(`Removed ${item.name} from cart`);
      }
      return currentItems.filter(item => item.id !== id);
    });
  };
  
  // Update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(currentItems => {
      return currentItems.map(item => {
        if (item.id === id) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };
  
  // Clear cart
  const clearCart = () => {
    setItems([]);
    toast.info('Cart cleared');
  };
  
  // Get total price
  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  // Get total item count
  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };
  
  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getCartTotal,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
