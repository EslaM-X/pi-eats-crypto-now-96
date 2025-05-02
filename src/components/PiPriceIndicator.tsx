
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, RefreshCcw, ExternalLink, Wallet, DollarSign, CircleDollarSign } from 'lucide-react';
import { usePiPrice } from '@/contexts/PiPriceContext';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from '@/contexts/ThemeContext';

export const PiPriceIndicator = ({ showDetails = false }: { showDetails?: boolean }) => {
  const { priceData, isLoading, refreshPrice } = usePiPrice();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  
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
      currency: 'USD',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(value);
  };
  
  const formatEgpCurrency = (value: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const isPositiveChange = priceData.change24h >= 0;
  const isPriceFromOKX = priceData.source === 'OKX';
  
  // Basic indicator for normal display
  const basicIndicator = (
    <div className={`flex items-center space-x-2 rounded-full py-1 px-3 text-sm ${theme === 'dark' ? 'bg-muted/20' : 'bg-muted/40'} border border-border/50`}>
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

      <Tooltip>
        <TooltipTrigger asChild>
          <a 
            href="https://www.okx.com/trade-spot/pi-usdt?channelid=43776722" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-pi hover:text-pi-dark transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('pi.viewOnOKX')}</p>
        </TooltipContent>
      </Tooltip>

      <Button 
        size="icon" 
        variant="ghost" 
        className="h-5 w-5" 
        onClick={(e) => {
          e.stopPropagation();
          refreshPrice();
        }}
        disabled={isLoading}
      >
        <RefreshCcw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
      </Button>
      
      {!isPriceFromOKX && (
        <span className="text-xs text-muted-foreground">(Fallback)</span>
      )}
      
      {showDetails && (
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-5 ml-1 text-xs" 
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Less' : 'More'}
        </Button>
      )}
    </div>
  );
  
  // Detailed indicator with conversions
  const detailedIndicator = (
    <div className={`mt-2 grid grid-cols-2 gap-2 rounded-md p-3 ${theme === 'dark' ? 'bg-muted/20' : 'bg-muted/40'} border border-border/50`}>
      <div className="flex items-center space-x-2">
        <DollarSign className="h-4 w-4" />
        <span className="text-sm">1π = {formatCurrency(priceData.price)}</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <CircleDollarSign className="h-4 w-4" />
        <span className="text-sm">1π = {formatEgpCurrency(priceData.egpRate)}</span>
      </div>
      
      <div className="col-span-2 text-xs text-muted-foreground mt-1">
        {t('wallet.lastUpdated')}: {priceData.lastUpdated.toLocaleTimeString()}
      </div>
    </div>
  );

  return (
    <div>
      {basicIndicator}
      {showDetails && expanded && detailedIndicator}
    </div>
  );
};
