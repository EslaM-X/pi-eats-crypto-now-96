
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DollarSign } from 'lucide-react';

interface CurrencyValueProps {
  amount: number;
  symbol: string;
  label: string;
  prefix?: React.ReactNode;
}

const CurrencyValue: React.FC<CurrencyValueProps> = ({ 
  amount, 
  symbol, 
  label,
  prefix
}) => (
  <div className="flex items-center mt-0.5">
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="flex items-center">
          {prefix || null}
          <span className="text-sm text-muted-foreground">
            {symbol} {amount.toFixed(2)}
          </span>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  </div>
);

export default CurrencyValue;
