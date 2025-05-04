
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authenticateWithPi } from '@/config/piNetwork';
import { toast } from 'sonner';

// Define the Pi user type
type PiUser = {
  uid: string;
  username: string;
  accessToken?: string;
  walletAddress?: string;
  [key: string]: any;
};

// Define the auth context type
interface PiAuthContextType {
  user: PiUser | null;
  isAuthenticating: boolean;
  login: () => Promise<PiUser | null>;
  logout: () => void;
  isPiNetworkAvailable: boolean;
}

// Create the context
const PiAuthContext = createContext<PiAuthContextType | null>(null);

// Create the provider component
export const PiAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isPiNetworkAvailable, setIsPiNetworkAvailable] = useState(false);

  // Check if Pi Network is available
  useEffect(() => {
    const checkPiAvailability = () => {
      const isPiAvailable = typeof window !== 'undefined' && typeof (window as any).Pi !== 'undefined';
      setIsPiNetworkAvailable(isPiAvailable);
      return isPiAvailable;
    };

    // Check on initial load
    checkPiAvailability();

    // Set up event listener to check when Pi becomes available
    const handlePiAvailability = () => {
      if (checkPiAvailability() && !user) {
        // Try to restore session
        tryRestoreSession();
      }
    };

    window.addEventListener('pi-sdk-loaded', handlePiAvailability);
    
    return () => {
      window.removeEventListener('pi-sdk-loaded', handlePiAvailability);
    };
  }, []);

  // Try to restore an existing session
  const tryRestoreSession = async () => {
    try {
      const storedUser = localStorage.getItem('pi_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log('Session restored for user:', parsedUser.username);
      }
    } catch (error) {
      console.error('Error restoring session:', error);
    }
  };

  // Login function
  const login = async (): Promise<PiUser | null> => {
    if (!isPiNetworkAvailable) {
      toast.error('Pi Network is not available. Please use the Pi Browser.');
      return null;
    }

    setIsAuthenticating(true);

    try {
      const authResult = await authenticateWithPi();
      
      if (authResult && authResult.user) {
        const piUser: PiUser = {
          uid: authResult.user.uid,
          username: authResult.user.username,
          accessToken: authResult.accessToken,
          walletAddress: authResult.user.walletAddress
        };

        // Save to localStorage for session restoration
        localStorage.setItem('pi_user', JSON.stringify(piUser));
        
        setUser(piUser);
        toast.success(`Welcome, ${piUser.username}!`);
        return piUser;
      } else {
        toast.error('Authentication failed');
        return null;
      }
    } catch (error: any) {
      toast.error(`Authentication error: ${error.message}`);
      return null;
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('pi_user');
    toast.success('Logged out successfully');
  };

  // Provide the context value
  const contextValue: PiAuthContextType = {
    user,
    isAuthenticating,
    login,
    logout,
    isPiNetworkAvailable
  };

  return (
    <PiAuthContext.Provider value={contextValue}>
      {children}
    </PiAuthContext.Provider>
  );
};

// Create a custom hook for using the auth context
export const usePiAuth = (): PiAuthContextType => {
  const context = useContext(PiAuthContext);
  if (!context) {
    throw new Error('usePiAuth must be used within a PiAuthProvider');
  }
  return context;
};

export default PiAuthContext;
