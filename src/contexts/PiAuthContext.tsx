
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Pi User interface
interface PiUser {
  uid: string;
  username: string;
  accessToken?: string;
}

// Context interface
interface PiAuthContextType {
  user: PiUser | null;
  login: () => Promise<void>;
  logout: () => void;
  isAuthenticating: boolean;
}

// Create the context
const PiAuthContext = createContext<PiAuthContextType | undefined>(undefined);

// Pi Auth Provider component
export const PiAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  // Initialize Pi SDK
  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem('piUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('piUser');
      }
    }
    
    // Initialize Pi SDK when available
    const initPiSdk = () => {
      if (typeof window !== 'undefined' && 'Pi' in window) {
        try {
          // @ts-ignore - Pi is injected by the Pi Browser
          window.Pi.init({ 
            version: "2.0",
            sandbox: process.env.NODE_ENV !== "production"
          });
          console.log("Pi SDK initialized");
        } catch (error) {
          console.error("Error initializing Pi SDK:", error);
        }
      }
    };
    
    initPiSdk();
  }, []);
  
  // Login function
  const login = async () => {
    if (typeof window === 'undefined' || !('Pi' in window)) {
      toast.error('Please use the Pi Browser for authentication');
      return;
    }
    
    setIsAuthenticating(true);
    
    try {
      // @ts-ignore - Pi is injected by the Pi Browser
      const scopes = ['username', 'payments', 'wallet_address'];
      
      // @ts-ignore - Pi is injected by the Pi Browser
      const authResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
      
      if (authResult) {
        const piUser: PiUser = {
          uid: authResult.user.uid,
          username: authResult.user.username,
          accessToken: authResult.accessToken,
        };
        
        // Store in state and localStorage
        setUser(piUser);
        localStorage.setItem('piUser', JSON.stringify(piUser));
        toast.success(`Welcome ${piUser.username}!`);
      }
    } catch (error) {
      console.error('Pi authentication error:', error);
      toast.error('Authentication failed. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };
  
  // Handle incomplete payments
  const onIncompletePaymentFound = (payment: any) => {
    console.log('Incomplete payment found:', payment);
    // Here we would implement payment completion logic
    toast.info('You have an incomplete payment. Please complete it in the Pi app.');
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('piUser');
    toast.info('Logged out successfully');
  };
  
  // Mock login for development
  const mockLogin = () => {
    if (process.env.NODE_ENV === 'development') {
      const mockUser: PiUser = {
        uid: 'mock-uid-123456',
        username: 'pi_tester',
        accessToken: 'mock-token-123456',
      };
      setUser(mockUser);
      localStorage.setItem('piUser', JSON.stringify(mockUser));
      toast.success(`Development mode: Logged in as ${mockUser.username}`);
    }
  };
  
  return (
    <PiAuthContext.Provider value={{ user, login, logout, isAuthenticating }}>
      {children}
    </PiAuthContext.Provider>
  );
};

// Custom hook to use the Pi Auth context
export const usePiAuth = () => {
  const context = useContext(PiAuthContext);
  if (context === undefined) {
    throw new Error('usePiAuth must be used within a PiAuthProvider');
  }
  return context;
};
