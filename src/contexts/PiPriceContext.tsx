
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useLanguage } from './LanguageContext';

type PiPriceData = {
  price: number;
  currency: string;
  change24h: number;
  lastUpdated: Date;
  source: string;
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
  const { t } = useLanguage();

  const fetchPiPrice = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch Pi price data from OKX API
      const response = await fetch('https://www.okx.com/api/v5/market/ticker?instId=PI-USDT');
      const data = await response.json();
      
      if (!data.data || data.data.length === 0) {
        throw new Error('Failed to fetch data from OKX');
      }
      
      const ticker = data.data[0];
      const currentPrice = parseFloat(ticker.last);
      
      // Calculate 24h change
      const open24h = parseFloat(ticker.open24h);
      const change24h = ((currentPrice - open24h) / open24h) * 100;
      
      setPriceData({
        price: currentPrice,
        currency: 'USDT',
        change24h: change24h,
        lastUpdated: new Date(),
        source: 'OKX'
      });
    } catch (err) {
      console.error('Failed to fetch Pi price', err);
      const errorMessage = 'Failed to load Pi price data. Using fallback data.';
      setError(errorMessage);
      toast({
        title: t('error.priceUpdateFailed'),
        description: errorMessage,
        variant: "destructive",
      });
      
      // Use fallback data if API fails
      const mockPrice = (Math.random() * (15 - 5) + 5) / 100;
      const mockChange = (Math.random() * 10) - 5;
      
      setPriceData({
        price: mockPrice,
        currency: 'USDT',
        change24h: mockChange,
        lastUpdated: new Date(),
        source: 'Fallback'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPiPrice();
    
    // Set up interval to refresh price data every 30 seconds
    const intervalId = setInterval(fetchPiPrice, 30000);
    
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
