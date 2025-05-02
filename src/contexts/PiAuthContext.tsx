
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
};

const PiAuthContext = createContext<PiAuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isAuthenticating: false,
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

  const login = async (): Promise<void> => {
    setIsAuthenticating(true);
    
    try {
      // Simulate Pi Network authentication
      // In a real implementation, we would use the Pi SDK here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful login with improved user data
      const mockUser: PiUser = {
        username: 'pi_user_' + Math.floor(Math.random() * 10000),
        accessToken: 'mock_token_' + Math.random().toString(36).substring(2),
        uid: 'user_' + Math.random().toString(36).substring(2),
        isLoggedIn: true,
        displayName: 'Pi User', // Added a displayName 
        photoURL: undefined // Added photoURL property
      };
      
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

  return (
    <PiAuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticating,
      }}
    >
      {children}
    </PiAuthContext.Provider>
  );
};
