
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PiPriceData {
  price: number;        // سعر Pi بالدولار الأمريكي
  change24h: number;    // التغير في السعر خلال 24 ساعة
  egpRate: number;      // سعر Pi بالجنيه المصري
  source: string;       // مصدر البيانات
  lastUpdated: Date;    // تاريخ آخر تحديث
}

interface PiPriceContextType {
  priceData: PiPriceData | null;
  isLoading: boolean;
  error: Error | null;
  refreshPrice: () => void;
  convertPiToUsd: (piAmount: number) => number;
  convertPiToEgp: (piAmount: number) => number;
}

const PiPriceContext = createContext<PiPriceContextType>({
  priceData: null,
  isLoading: false,
  error: null,
  refreshPrice: () => {},
  convertPiToUsd: () => 0,
  convertPiToEgp: () => 0,
});

export const usePiPrice = () => useContext(PiPriceContext);

interface PiPriceProviderProps {
  children: ReactNode;
}

export const PiPriceProvider = ({ children }: PiPriceProviderProps) => {
  const [priceData, setPriceData] = useState<PiPriceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // معدل تحويل الدولار إلى الجنيه المصري (قابل للتحديث لاحقًا)
  const usdToEgpRate = 31.25;

  const fetchPriceFromOKX = async (): Promise<PiPriceData> => {
    const response = await fetch('https://www.okx.com/api/v5/market/ticker?instId=PI-USDT');
    if (!response.ok) {
      throw new Error(`OKX API error: ${response.status}`);
    }
    const data = await response.json();
    
    if (data.code !== '0' || !data.data || !data.data[0]) {
      throw new Error('Invalid OKX API response');
    }
    
    const ticker = data.data[0];
    const price = parseFloat(ticker.last);
    const open24h = parseFloat(ticker.open24h);
    const change24h = ((price - open24h) / open24h) * 100;
    
    return {
      price,
      change24h,
      egpRate: price * usdToEgpRate,
      source: 'OKX',
      lastUpdated: new Date(),
    };
  };

  const fetchFallbackPrice = (): PiPriceData => {
    // أسعار احتياطية في حال فشل الحصول على الأسعار من المصدر الرئيسي
    const fallbackPrice = 0.59;
    
    return {
      price: fallbackPrice,
      change24h: 0.0,
      egpRate: fallbackPrice * usdToEgpRate,
      source: 'Fallback',
      lastUpdated: new Date(),
    };
  };

  const fetchPrice = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // محاولة الحصول على الأسعار من OKX
      const data = await fetchPriceFromOKX();
      setPriceData(data);
    } catch (err) {
      console.error('Failed to fetch Pi price:', err);
      
      // استخدام الأسعار الاحتياطية في حال الفشل
      const fallbackData = fetchFallbackPrice();
      setPriceData(fallbackData);
      
      setError(err instanceof Error ? err : new Error('Unknown error fetching Pi price'));
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPrice = () => {
    fetchPrice();
  };

  const convertPiToUsd = (piAmount: number): number => {
    if (!priceData) return 0;
    return piAmount * priceData.price;
  };

  const convertPiToEgp = (piAmount: number): number => {
    if (!priceData) return 0;
    return piAmount * priceData.egpRate;
  };

  useEffect(() => {
    fetchPrice();
    
    // تحديث السعر كل 5 دقائق
    const interval = setInterval(fetchPrice, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <PiPriceContext.Provider value={{ 
      priceData, 
      isLoading, 
      error, 
      refreshPrice,
      convertPiToUsd,
      convertPiToEgp
    }}>
      {children}
    </PiPriceContext.Provider>
  );
};

export default PiPriceProvider;
