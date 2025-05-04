
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface PiPriceData {
  price: number;
  change24h: number;
  lastUpdated: Date;
  egpRate: number;
  source: 'OKX' | 'Fallback';
}

interface PiPriceContextType {
  priceData: PiPriceData | null;
  isLoading: boolean;
  refreshPrice: () => Promise<void>;
  convertPiToUsd: (amount: number) => number;
  convertPiToEgp: (amount: number) => number;
}

const PiPriceContext = createContext<PiPriceContextType | undefined>(undefined);

// OKX API endpoint to fetch Pi price
const OKX_API_URL = 'https://www.okx.com/api/v5/market/ticker?instId=PI-USDT';

// EGP to USD exchange rate (as of May 2025)
const EGP_USD_RATE = 30.85; // 1 USD = 30.85 EGP

export const PiPriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [priceData, setPriceData] = useState<PiPriceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch price from OKX
  const fetchPiPrice = async (): Promise<PiPriceData | null> => {
    try {
      const response = await fetch(OKX_API_URL);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      if (data.code === '0' && data.data && data.data[0]) {
        const { last, open24h, ts } = data.data[0];
        const price = parseFloat(last);
        const prevPrice = parseFloat(open24h);
        const change24h = ((price - prevPrice) / prevPrice) * 100;
        
        return {
          price,
          change24h,
          lastUpdated: new Date(),
          egpRate: price * EGP_USD_RATE,
          source: 'OKX'
        };
      } else {
        throw new Error('Invalid data format from OKX');
      }
    } catch (error) {
      console.error('Error fetching Pi price:', error);
      return null;
    }
  };
  
  // Fallback to static price if API fails
  const getFallbackPrice = (): PiPriceData => {
    return {
      price: 0.59,
      change24h: 1.5,
      lastUpdated: new Date(),
      egpRate: 0.59 * EGP_USD_RATE,
      source: 'Fallback'
    };
  };
  
  // Function to refresh price data
  const refreshPrice = async () => {
    setIsLoading(true);
    try {
      const freshPriceData = await fetchPiPrice();
      if (freshPriceData) {
        setPriceData(freshPriceData);
        localStorage.setItem('piPriceData', JSON.stringify(freshPriceData));
      } else {
        const fallbackData = getFallbackPrice();
        setPriceData(fallbackData);
        toast.error('Could not fetch latest Pi price. Using fallback data.');
      }
    } catch (error) {
      console.error('Error refreshing price:', error);
      toast.error('Failed to refresh Pi price');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initialize price data
  useEffect(() => {
    const loadPriceData = async () => {
      setIsLoading(true);
      
      // Try to get cached price data first
      const cachedPriceData = localStorage.getItem('piPriceData');
      
      if (cachedPriceData) {
        try {
          const parsed = JSON.parse(cachedPriceData);
          parsed.lastUpdated = new Date(parsed.lastUpdated);
          setPriceData(parsed);
          
          // If cached data is older than 5 minutes, refresh it
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
          if (parsed.lastUpdated < fiveMinutesAgo) {
            refreshPrice();
          } else {
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error parsing cached price data:', error);
          refreshPrice();
        }
      } else {
        refreshPrice();
      }
    };
    
    loadPriceData();
    
    // Set up auto-refresh every 5 minutes
    const intervalId = setInterval(refreshPrice, 5 * 60 * 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  // Conversion functions
  const convertPiToUsd = (amount: number): number => {
    return priceData ? amount * priceData.price : 0;
  };
  
  const convertPiToEgp = (amount: number): number => {
    return priceData ? amount * priceData.egpRate : 0;
  };
  
  return (
    <PiPriceContext.Provider value={{
      priceData,
      isLoading,
      refreshPrice,
      convertPiToUsd,
      convertPiToEgp
    }}>
      {children}
    </PiPriceContext.Provider>
  );
};

export const usePiPrice = () => {
  const context = useContext(PiPriceContext);
  if (context === undefined) {
    throw new Error('usePiPrice must be used within a PiPriceProvider');
  }
  return context;
};
