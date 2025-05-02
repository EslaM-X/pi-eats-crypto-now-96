
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

type PiUser = {
  username: string;
  accessToken: string;
  uid: string;
  isLoggedIn: boolean;
  // Added these properties to fix type errors
  displayName?: string;
  photoURL?: string;
};

type PiAuthContextType = {
  user: PiUser | null;
  login: () => Promise<void>;
  logout: () => void;
  isAuthenticating: boolean;
  openPiPayment: (amount: number, memo: string) => Promise<boolean>;
};

const PiAuthContext = createContext<PiAuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isAuthenticating: false,
  openPiPayment: async () => false,
});

export const usePiAuth = () => useContext(PiAuthContext);

// Mock implementation as we can't directly integrate with Pi Network without their SDK
export const PiAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    // Check for saved user in localStorage on component mount
    const savedUser = localStorage.getItem('pi_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user', error);
        localStorage.removeItem('pi_user');
      }
    }
  }, []);

  // Mock Pi Network SDK functions
  const mockPiSDK = {
    authenticate: async (): Promise<PiUser> => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        username: 'pi_user_' + Math.floor(Math.random() * 10000),
        accessToken: 'mock_token_' + Math.random().toString(36).substring(2),
        uid: 'user_' + Math.random().toString(36).substring(2),
        isLoggedIn: true,
        displayName: 'Pi User',
        photoURL: undefined
      };
    },
    createPayment: async (amount: number, memo: string): Promise<boolean> => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // 90% success rate for mock payments
      return Math.random() > 0.1;
    }
  };

  const login = async (): Promise<void> => {
    setIsAuthenticating(true);
    
    try {
      // In a real implementation, we would use the Pi SDK here
      const mockUser = await mockPiSDK.authenticate();
      
      setUser(mockUser);
      localStorage.setItem('pi_user', JSON.stringify(mockUser));
      toast.success('Successfully connected with Pi Network');
    } catch (error) {
      console.error('Pi authentication failed', error);
      toast.error('Failed to connect with Pi Network. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pi_user');
    toast.info('Disconnected from Pi Network');
  };
  
  const openPiPayment = async (amount: number, memo: string): Promise<boolean> => {
    if (!user) {
      toast.error('Please log in to make a payment');
      return false;
    }
    
    toast.info('Initiating Pi payment...');
    
    try {
      // In a real implementation, this would open the Pi Browser
      const success = await mockPiSDK.createPayment(amount, memo);
      
      if (success) {
        toast.success(`Payment of π${amount} successful!`);
        return true;
      } else {
        toast.error('Payment failed or was cancelled');
        return false;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment process encountered an error');
      return false;
    }
  };

  return (
    <PiAuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticating,
        openPiPayment,
      }}
    >
      {children}
    </PiAuthContext.Provider>
  );
};
