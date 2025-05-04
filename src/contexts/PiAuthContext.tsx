
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { initPiSDK, authenticateUser } from '../config/piNetwork';

interface PiUser {
  username: string;
  uid: string;
  accessToken?: string;
}

interface PiAuthContextType {
  user: PiUser | null;
  isAuthenticating: boolean;
  login: () => Promise<PiUser | null>;
  logout: () => void;
  checkAuthentication: () => Promise<boolean>;
}

const PiAuthContext = createContext<PiAuthContextType | undefined>(undefined);

export const PiAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    // Initialize Pi SDK when the component mounts
    initPiSDK();
    
    // Try to restore session from localStorage
    const storedUser = localStorage.getItem('pi_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
      }
    }
  }, []);

  const login = async (): Promise<PiUser | null> => {
    setIsAuthenticating(true);
    
    try {
      const authResult = await authenticateUser();
      
      if (authResult) {
        const piUser = {
          username: authResult.user.username,
          uid: authResult.user.uid,
          accessToken: authResult.accessToken
        };
        
        setUser(piUser);
        localStorage.setItem('pi_user', JSON.stringify(piUser));
        toast.success(`مرحباً ${piUser.username}!`);
        return piUser;
      } else {
        toast.error('فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.');
        return null;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('حدث خطأ أثناء تسجيل الدخول');
      return null;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pi_user');
    toast.info('تم تسجيل الخروج بنجاح');
  };

  const checkAuthentication = async (): Promise<boolean> => {
    if (user) {
      try {
        // Validate the session with Pi Network
        const authResult = await authenticateUser();
        return !!authResult;
      } catch {
        return false;
      }
    }
    return false;
  };

  const value = {
    user,
    isAuthenticating,
    login,
    logout,
    checkAuthentication
  };

  return (
    <PiAuthContext.Provider value={value}>
      {children}
    </PiAuthContext.Provider>
  );
};

export const usePiAuth = (): PiAuthContextType => {
  const context = useContext(PiAuthContext);
  if (context === undefined) {
    throw new Error('usePiAuth must be used within a PiAuthProvider');
  }
  return context;
};

export default PiAuthContext;
