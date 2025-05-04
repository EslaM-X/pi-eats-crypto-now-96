
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// User type for Pi Network authentication
export interface PiUser {
  uid: string;
  username: string;
  accessToken?: string;
  roles?: string[];
  walletAddress?: string;
}

interface PiAuthContextType {
  user: PiUser | null;
  login: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  openPiPayment: (amount: number, memo: string) => Promise<boolean>;
}

const PiAuthContext = createContext<PiAuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
  openPiPayment: async () => false,
});

export const usePiAuth = () => useContext(PiAuthContext);

export const PiAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize Pi SDK and check for stored user
  useEffect(() => {
    const initializePiSDK = async () => {
      // Check for stored user data
      const storedUser = localStorage.getItem('pi_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
          localStorage.removeItem('pi_user');
        }
      }
      
      setIsInitialized(true);
    };

    initializePiSDK();
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('pi_user', JSON.stringify(user));
    } else if (isInitialized) {
      localStorage.removeItem('pi_user');
    }
  }, [user, isInitialized]);

  // Mock login function for demo
  const login = async () => {
    try {
      // In a real app, we would authenticate with Pi Network
      // For demo purposes, we'll create a mock user
      const mockUser: PiUser = {
        uid: 'pi_' + Date.now(),
        username: 'PiUser_' + Math.floor(Math.random() * 1000),
        accessToken: 'demo_token_' + Date.now(),
        walletAddress: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')
      };
      
      setUser(mockUser);
      toast.success('Logged in successfully!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    toast.info('Logged out successfully');
  };

  // Mock Pi Payment function
  const openPiPayment = async (amount: number, memo: string): Promise<boolean> => {
    if (!user) {
      toast.error('Please log in to make payments');
      return false;
    }

    try {
      // Simulate a payment request
      toast.info(`Requesting payment of ${amount} Pi...`);
      
      // Simulate payment processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 80% chance of success for demo purposes
      const success = Math.random() > 0.2;
      
      if (success) {
        toast.success(`Payment of ${amount} Pi completed successfully!`);
        return true;
      } else {
        toast.error('Payment cancelled or failed');
        return false;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment process failed. Please try again.');
      return false;
    }
  };

  return (
    <PiAuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        openPiPayment
      }}
    >
      {children}
    </PiAuthContext.Provider>
  );
};
