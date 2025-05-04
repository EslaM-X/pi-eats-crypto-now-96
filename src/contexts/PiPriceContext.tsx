
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchPiPrice } from '../services/piPriceService';
import { toast } from 'sonner';

// Define the shape of our price data
interface PiPriceData {
  price: number;
  change24h: number;
  egpRate: number;
  source: string;
  lastUpdated: Date;
}

// Define what our context provides
interface PiPriceContextType {
  priceData: PiPriceData | null;
  isLoading: boolean;
  error: string | null;
  refreshPrice: () => Promise<void>;
  convertPiToUsd: (piAmount: number) => number;
  convertPiToEgp: (piAmount: number) => number;
}

// Create the context with default values
const PiPriceContext = createContext<PiPriceContextType>({
  priceData: null,
  isLoading: false,
  error: null,
  refreshPrice: async () => {},
  convertPiToUsd: () => 0,
  convertPiToEgp: () => 0,
});

// Custom hook to use the Pi price context
export const usePiPrice = () => useContext(PiPriceContext);

// Auto refresh interval in milliseconds (5 minutes)
const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000;

export const PiPriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [priceData, setPriceData] = useState<PiPriceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch fresh price data
  const refreshPrice = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const freshPriceData = await fetchPiPrice();
      setPriceData(freshPriceData);
      return freshPriceData;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch Pi price';
      setError(errorMessage);
      toast.error(`خطأ في تحديث سعر Pi: ${errorMessage}`);
      console.error('Pi price fetch error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Currency conversion utilities
  const convertPiToUsd = useCallback(
    (piAmount: number) => {
      if (!priceData) return 0;
      return piAmount * priceData.price;
    },
    [priceData]
  );

  const convertPiToEgp = useCallback(
    (piAmount: number) => {
      if (!priceData) return 0;
      return piAmount * priceData.egpRate;
    },
    [priceData]
  );

  // Initial fetch and setup auto refresh
  useEffect(() => {
    // Fetch on mount
    refreshPrice();
    
    // Set up auto refresh timer
    const intervalId = setInterval(() => {
      refreshPrice();
    }, AUTO_REFRESH_INTERVAL);
    
    // Clean up timer on unmount
    return () => clearInterval(intervalId);
  }, [refreshPrice]);

  return (
    <PiPriceContext.Provider 
      value={{ 
        priceData, 
        isLoading, 
        error, 
        refreshPrice,
        convertPiToUsd,
        convertPiToEgp
      }}
    >
      {children}
    </PiPriceContext.Provider>
  );
};

export default PiPriceProvider;
