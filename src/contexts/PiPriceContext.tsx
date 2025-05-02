
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useLanguage } from './LanguageContext';

type PiPriceData = {
  price: number;
  currency: string;
  change24h: number;
  lastUpdated: Date;
  source: string;
  usdRate: number;
  egpRate: number;
};

type PiPriceContextType = {
  priceData: PiPriceData | null;
  isLoading: boolean;
  error: string | null;
  refreshPrice: () => Promise<void>;
  convertPiToUsd: (piAmount: number) => number;
  convertPiToEgp: (piAmount: number) => number;
};

const PiPriceContext = createContext<PiPriceContextType>({
  priceData: null,
  isLoading: false,
  error: null,
  refreshPrice: async () => {},
  convertPiToUsd: () => 0,
  convertPiToEgp: () => 0,
});

export const usePiPrice = () => useContext(PiPriceContext);

export const PiPriceProvider = ({ children }: { children: ReactNode }) => {
  const [priceData, setPriceData] = useState<PiPriceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  
  // EGP to USD exchange rate (will be updated periodically)
  const [usdToEgpRate, setUsdToEgpRate] = useState(31.2); // Default rate, will be updated

  const fetchEgpRate = async () => {
    try {
      // We could use an actual currency API here, but for simplicity using a fixed rate
      // that updates occasionally (this could be replaced with an actual API call)
      const newRate = 31.2 + (Math.random() * 0.5); // Random fluctuation for demo
      setUsdToEgpRate(newRate);
    } catch (err) {
      console.error('Failed to fetch EGP rate', err);
    }
  };

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
      
      // Update EGP rate periodically
      await fetchEgpRate();
      
      setPriceData({
        price: currentPrice,
        currency: 'USDT',
        change24h: change24h,
        lastUpdated: new Date(),
        source: 'OKX',
        usdRate: currentPrice, // 1 Pi = currentPrice USD
        egpRate: currentPrice * usdToEgpRate, // Convert to EGP
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
        source: 'Fallback',
        usdRate: mockPrice, // 1 Pi = mockPrice USD
        egpRate: mockPrice * usdToEgpRate, // Convert to EGP
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Conversion helpers
  const convertPiToUsd = (piAmount: number): number => {
    if (!priceData) return 0;
    return piAmount * priceData.usdRate;
  };
  
  const convertPiToEgp = (piAmount: number): number => {
    if (!priceData) return 0;
    return piAmount * priceData.egpRate;
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
        convertPiToUsd,
        convertPiToEgp,
      }}
    >
      {children}
    </PiPriceContext.Provider>
  );
};
