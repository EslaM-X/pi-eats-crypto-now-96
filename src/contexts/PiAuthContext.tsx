
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

type PiUser = {
  username: string;
  accessToken: string;
  uid: string;
  isLoggedIn: boolean;
  displayName?: string;
  photoURL?: string;
};

type PaymentDTO = {
  amount: number;
  memo: string;
  metadata?: Record<string, any>;
  uid?: string;
};

type PiAuthContextType = {
  user: PiUser | null;
  login: () => Promise<void>;
  logout: () => void;
  isAuthenticating: boolean;
  openPiPayment: (amount: number, memo: string, metadata?: Record<string, any>) => Promise<boolean>;
  isPiSDKAvailable: boolean;
  isPiBrowser: boolean;
};

const PiAuthContext = createContext<PiAuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isAuthenticating: false,
  openPiPayment: async () => false,
  isPiSDKAvailable: false,
  isPiBrowser: false,
});

export const usePiAuth = () => useContext(PiAuthContext);

export const PiAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isPiSDKAvailable, setIsPiSDKAvailable] = useState(false);
  const [isPiBrowser, setIsPiBrowser] = useState(false);

  // Check for Pi SDK availability and saved user session on mount
  useEffect(() => {
    // Check if running in Pi Browser
    const checkPiBrowser = () => {
      const isPiApp = 
        /Pi Network/i.test(navigator.userAgent) ||
        /PiNetwork/i.test(navigator.userAgent);
      
      setIsPiBrowser(isPiApp);
      return isPiApp;
    };
    
    // Check if the Pi SDK is available
    const checkPiSDKAvailability = () => {
      const isSDKAvailable = typeof window !== 'undefined' && 'Pi' in window;
      setIsPiSDKAvailable(isSDKAvailable);
      return isSDKAvailable;
    };
    
    // Check for saved user data
    const loadSavedUser = () => {
      const savedUser = localStorage.getItem('pi_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          console.log('User session restored from local storage');
        } catch (error) {
          console.error('Failed to parse saved user', error);
          localStorage.removeItem('pi_user');
        }
      }
    };
    
    // Run all checks
    const inPiBrowser = checkPiBrowser();
    const sdkAvailable = checkPiSDKAvailability();
    loadSavedUser();
    
    if (inPiBrowser && !sdkAvailable) {
      console.warn('Running in Pi Browser but SDK not detected!');
    }
  }, []);

  // Mock Pi Network SDK functions for development/testing
  const mockPiSDK = {
    authenticate: async (): Promise<PiUser> => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        username: 'pi_user_' + Math.floor(Math.random() * 10000),
        accessToken: 'mock_token_' + Math.random().toString(36).substring(2),
        uid: 'user_' + Math.random().toString(36).substring(2),
        isLoggedIn: true,
        displayName: 'Pi User',
      };
    },
    createPayment: async (paymentData: PaymentDTO): Promise<boolean> => {
      console.log('Mock payment request:', paymentData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      // 90% success rate for mock payments
      return Math.random() > 0.1;
    }
  };

  // Handle incomplete payments
  const onIncompletePaymentFound = (payment: any) => {
    console.log('Incomplete payment found:', payment);
    toast.warning('Incomplete payment detected. Please complete your transaction.');
    // In a real app, you'd handle the incomplete payment here
  };

  // Authenticate with Pi Network
  const login = async (): Promise<void> => {
    setIsAuthenticating(true);
    
    try {
      let authResult: PiUser;
      
      // If Pi SDK is available, use it, otherwise use mock
      if (isPiSDKAvailable && 'Pi' in window) {
        console.log('Authenticating with Pi Network SDK');
        
        try {
          // @ts-ignore - Pi is injected by the Pi Browser
          const piAuth = await window.Pi.authenticate(['username', 'payments'], onIncompletePaymentFound);
          
          authResult = {
            username: piAuth.user.username,
            accessToken: piAuth.accessToken,
            uid: piAuth.user.uid || piAuth.user.username,
            isLoggedIn: true,
            displayName: piAuth.user.displayName,
            photoURL: piAuth.user.photoURL
          };
          
          console.log('Pi authentication successful');
        } catch (piError) {
          console.error('Pi SDK authentication error:', piError);
          throw new Error('Pi authentication failed');
        }
      } else {
        console.log('Using mock authentication');
        authResult = await mockPiSDK.authenticate();
      }
      
      // Save authenticated user
      setUser(authResult);
      localStorage.setItem('pi_user', JSON.stringify(authResult));
      toast.success('Successfully connected with Pi Network');
    } catch (error) {
      console.error('Authentication failed:', error);
      toast.error('Failed to connect with Pi Network. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Log out from Pi Network
  const logout = () => {
    setUser(null);
    localStorage.removeItem('pi_user');
    toast.info('Disconnected from Pi Network');
  };
  
  // Process a Pi payment
  const openPiPayment = async (
    amount: number, 
    memo: string, 
    metadata?: Record<string, any>
  ): Promise<boolean> => {
    if (!user) {
      toast.error('Please log in to make a payment');
      return false;
    }
    
    toast.info('Initiating Pi payment...');
    
    try {
      let success: boolean;
      const paymentData: PaymentDTO = {
        amount,
        memo,
        metadata: {
          ...metadata,
          orderId: Date.now().toString()
        }
      };
      
      // If Pi SDK is available, use it, otherwise use mock
      if (isPiSDKAvailable && 'Pi' in window) {
        console.log('Creating payment with Pi Network SDK');
        
        try {
          // @ts-ignore - Pi is injected by the Pi Browser
          const payment = await window.Pi.createPayment(paymentData);
          
          console.log('Pi payment result:', payment);
          success = payment.status === 'COMPLETED';
        } catch (piError) {
          console.error('Pi SDK payment error:', piError);
          throw new Error('Payment process failed');
        }
      } else {
        console.log('Using mock payment');
        success = await mockPiSDK.createPayment(paymentData);
      }
      
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
        isPiSDKAvailable,
        isPiBrowser,
      }}
    >
      {children}
    </PiAuthContext.Provider>
  );
};
