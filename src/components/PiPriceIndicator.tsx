
import React from 'react';
import { TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';
import { usePiPrice } from '@/contexts/PiPriceContext';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export const PiPriceIndicator = () => {
  const { priceData, isLoading, refreshPrice } = usePiPrice();
  const { t } = useLanguage();
  
  if (!priceData) {
    return (
      <div className="flex items-center space-x-2 rounded-full py-1 px-3 text-sm bg-muted/40">
        <span>{t('loading')}</span>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: priceData.currency,
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(value);
  };

  const isPositiveChange = priceData.change24h >= 0;

  return (
    <div className="flex items-center space-x-2 rounded-full py-1 px-3 text-sm bg-muted/40 border border-border/50">
      <span className="font-medium">π</span>
      <span className="font-medium">{formatCurrency(priceData.price)}</span>
      
      <span
        className={`flex items-center ${
          isPositiveChange ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {isPositiveChange ? (
          <TrendingUp className="h-3 w-3 mr-0.5" />
        ) : (
          <TrendingDown className="h-3 w-3 mr-0.5" />
        )}
        {Math.abs(priceData.change24h).toFixed(2)}%
      </span>

      <Button 
        size="icon" 
        variant="ghost" 
        className="h-5 w-5" 
        onClick={() => refreshPrice()}
        disabled={isLoading}
      >
        <RefreshCcw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
};
