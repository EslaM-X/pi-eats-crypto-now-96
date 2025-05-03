
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
  isPiSDKAvailable: boolean;
};

const PiAuthContext = createContext<PiAuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isAuthenticating: false,
  openPiPayment: async () => false,
  isPiSDKAvailable: false,
});

export const usePiAuth = () => useContext(PiAuthContext);

// Mock implementation as we can't directly integrate with Pi Network without their SDK
export const PiAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isPiSDKAvailable, setIsPiSDKAvailable] = useState(false);

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

    // Check if Pi SDK is available (in real implementation)
    // This is a placeholder for actual SDK detection
    checkPiSDKAvailability();
  }, []);

  // Function to check if Pi SDK is available
  const checkPiSDKAvailability = () => {
    // In a real implementation, we would check if window.Pi exists
    // For now, just mock it as unavailable
    setIsPiSDKAvailable(false);

    // Example of real implementation:
    // setIsPiSDKAvailable(typeof window.Pi !== 'undefined');
  };

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
      // if (isPiSDKAvailable && window.Pi) {
      //   const authResult = await window.Pi.authenticate(['username', 'payments'], onIncompletePaymentFound);
      //   setUser(authResult);
      //   localStorage.setItem('pi_user', JSON.stringify(authResult));
      // } else {
      //   // Fallback to mock for development
      //   const mockUser = await mockPiSDK.authenticate();
      //   setUser(mockUser);
      //   localStorage.setItem('pi_user', JSON.stringify(mockUser));
      // }
      
      // For now, use mock authentication
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
      // In a real implementation, this would use the Pi SDK
      // if (isPiSDKAvailable && window.Pi) {
      //   const payment = await window.Pi.createPayment({
      //     amount: amount.toString(),
      //     memo,
      //     metadata: { orderId: Date.now().toString() }
      //   });
      //   return payment.status === 'COMPLETED';
      // } else {
      //   // Fallback to mock for development
      //   return await mockPiSDK.createPayment(amount, memo);
      // }
      
      // For now, use mock payment
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

  // Function that would be called when an incomplete payment is found
  const onIncompletePaymentFound = (payment: any) => {
    console.log('Incomplete payment found:', payment);
    toast.warning('Incomplete payment detected. Please complete your payment.');
    // In a real app, you'd handle the incomplete payment here
    // e.g., redirect to a payment completion page
  };

  return (
    <PiAuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticating,
        openPiPayment,
        isPiSDKAvailable,
      }}
    >
      {children}
    </PiAuthContext.Provider>
  );
};
