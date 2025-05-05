
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authenticate, initPiNetwork, PiUser } from '@/config/piNetwork';
import { toast } from 'sonner';

interface PiAuthContextType {
  user: PiUser | null;
  isAuthenticating: boolean;
  login: () => Promise<PiUser | null>;
  logout: () => void;
}

const PiAuthContext = createContext<PiAuthContextType>({
  user: null,
  isAuthenticating: false,
  login: async () => null,
  logout: () => {}
});

export const usePiAuth = () => useContext(PiAuthContext);

interface PiAuthProviderProps {
  children: ReactNode;
}

export const PiAuthProvider = ({ children }: PiAuthProviderProps) => {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    // تهيئة SDK عند تحميل التطبيق
    initPiNetwork({ sandbox: true }); // استخدم sandbox: false للإنتاج
    
    // محاولة استعادة جلسة المستخدم إذا كانت موجودة
    const storedUser = localStorage.getItem('pi_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('pi_user');
      }
    }
  }, []);

  const login = async (): Promise<PiUser | null> => {
    setIsAuthenticating(true);
    try {
      const authResult = await authenticate();
      if (authResult) {
        setUser(authResult);
        // حفظ بيانات المستخدم في التخزين المحلي
        localStorage.setItem('pi_user', JSON.stringify(authResult));
        toast.success('تم تسجيل الدخول بنجاح!');
        return authResult;
      } else {
        toast.error('فشل تسجيل الدخول');
        return null;
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error('حدث خطأ أثناء تسجيل الدخول');
      return null;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pi_user');
    toast.success('تم تسجيل الخروج');
  };

  return (
    <PiAuthContext.Provider value={{ user, isAuthenticating, login, logout }}>
      {children}
    </PiAuthContext.Provider>
  );
};

export default PiAuthProvider;
