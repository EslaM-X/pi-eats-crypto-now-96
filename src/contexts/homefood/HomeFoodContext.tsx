
import React, { createContext, useContext } from 'react';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { HomeFoodContextType } from './types';
import { useHomeFoodState } from './useHomeFoodState';

// Create the context
const HomeFoodContext = createContext<HomeFoodContextType | null>(null);

// Create the provider component
export const HomeFoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = usePiAuth();
  const userId = user ? user.uid : null;
  
  // Use our custom hook to get all the state and methods
  const homeFoodState = useHomeFoodState(userId);

  return (
    <HomeFoodContext.Provider value={homeFoodState}>
      {children}
    </HomeFoodContext.Provider>
  );
};

// Create a custom hook for using the home food context
export const useHomeFood = () => {
  const context = useContext(HomeFoodContext);
  if (!context) {
    throw new Error('useHomeFood must be used within a HomeFoodProvider');
  }
  return context;
};

export default HomeFoodContext;
