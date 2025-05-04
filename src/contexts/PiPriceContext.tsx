
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the price data interface
interface PiPriceData {
  price: number;
  change24h: number;
  volume24h?: number;
  lastUpdated: Date;
  source: string;
  egpRate: number;
}

// Define the context interface
interface PiPriceContextType {
  priceData: PiPriceData | null;
  isLoading: boolean;
  error: string | null;
  refreshPrice: () => Promise<void>;
  convertPiToUsd: (amount: number) => number;
  convertPiToEgp: (amount: number) => number;
}

// Create the context
const PiPriceContext = createContext<PiPriceContextType | null>(null);

// Exchange rate for EGP (Egyptian Pound) to USD
const EGP_TO_USD_RATE = 30.9; // Example rate, should be updated regularly

// Create the provider component
export const PiPriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [priceData, setPriceData] = useState<PiPriceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch price data from OKX or fallback source
  const fetchPiPrice = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call to get Pi price
      // In a real app, you would fetch from an actual API
      const mockApiResponse = {
        price: 31.25,  // Example price in USD
        change24h: 3.5, // Example 24h change in percentage
        lastUpdated: new Date(),
        source: "OKX",
      };

      setPriceData({
        ...mockApiResponse,
        egpRate: mockApiResponse.price * EGP_TO_USD_RATE
      });

    } catch (err: any) {
      console.error("Failed to fetch Pi price:", err);
      setError(err.message || "Failed to fetch price data");
      
      // Use fallback data if API fails
      setPriceData({
        price: 30.0,
        change24h: 0,
        lastUpdated: new Date(),
        source: "Fallback",
        egpRate: 30.0 * EGP_TO_USD_RATE
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Convert Pi to USD
  const convertPiToUsd = (amount: number): number => {
    if (!priceData) return 0;
    return amount * priceData.price;
  };

  // Convert Pi to EGP
  const convertPiToEgp = (amount: number): number => {
    if (!priceData) return 0;
    return amount * priceData.egpRate;
  };

  // Fetch price on component mount
  useEffect(() => {
    fetchPiPrice();

    // Set up interval to refresh price data every 5 minutes
    const intervalId = setInterval(fetchPiPrice, 5 * 60 * 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Provide the context value
  const contextValue: PiPriceContextType = {
    priceData,
    isLoading,
    error,
    refreshPrice: fetchPiPrice,
    convertPiToUsd,
    convertPiToEgp
  };

  return (
    <PiPriceContext.Provider value={contextValue}>
      {children}
    </PiPriceContext.Provider>
  );
};

// Create a custom hook for using the price context
export const usePiPrice = (): PiPriceContextType => {
  const context = useContext(PiPriceContext);
  if (!context) {
    throw new Error('usePiPrice must be used within a PiPriceProvider');
  }
  return context;
};

export default PiPriceContext;
