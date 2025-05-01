
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type PiPriceData = {
  price: number;
  currency: string;
  change24h: number;
  lastUpdated: Date;
};

type PiPriceContextType = {
  priceData: PiPriceData | null;
  isLoading: boolean;
  error: string | null;
  refreshPrice: () => Promise<void>;
};

const PiPriceContext = createContext<PiPriceContextType>({
  priceData: null,
  isLoading: false,
  error: null,
  refreshPrice: async () => {},
});

export const usePiPrice = () => useContext(PiPriceContext);

export const PiPriceProvider = ({ children }: { children: ReactNode }) => {
  const [priceData, setPriceData] = useState<PiPriceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPiPrice = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real-world scenario, we would fetch from an API
      // For now we'll use mock data 
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data based on recent Pi Network price estimates
      const mockPrice = (Math.random() * (15 - 5) + 5) / 100; // Random price between $0.05 and $0.15
      const mockChange = (Math.random() * 10) - 5; // Random change between -5% and +5%
      
      setPriceData({
        price: mockPrice,
        currency: 'USD',
        change24h: mockChange,
        lastUpdated: new Date(),
      });
    } catch (err) {
      console.error('Failed to fetch Pi price', err);
      setError('Failed to load Pi price data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPiPrice();
    
    // Set up interval to refresh price data every 60 seconds
    const intervalId = setInterval(fetchPiPrice, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <PiPriceContext.Provider
      value={{
        priceData,
        isLoading,
        error,
        refreshPrice: fetchPiPrice,
      }}
    >
      {children}
    </PiPriceContext.Provider>
  );
};
