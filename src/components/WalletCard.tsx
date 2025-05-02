
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PiPriceIndicator } from '@/components/PiPriceIndicator';
import CurrencyValue from '@/components/CurrencyValue';
import { ExternalLink, WalletIcon, SendHorizontal, ArrowRightLeft, PlusCircle, History, DollarSign } from 'lucide-react';

interface WalletCardProps {
  title: string;
  icon: React.ReactNode;
  balance: number;
  symbol?: string;
  conversionRate?: number;
  isUser: boolean;
  isPi?: boolean;
  usdValue?: number;
  egpValue?: number;
  onConnect?: () => void;
  onTopUp?: () => void;
  onExternal?: () => void;
  estimatedValue?: string;
  customActions?: React.ReactNode;
}

const WalletCard: React.FC<WalletCardProps> = ({
  title,
  icon,
  balance,
  symbol = 'π',
  conversionRate,
  isUser,
  isPi = false,
  usdValue,
  egpValue,
  onConnect,
  onTopUp,
  onExternal,
  estimatedValue,
  customActions
}) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          {icon}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Balance</div>
            <div className="text-4xl font-bold flex items-center">
              {isPi ? <span className="mr-1">π</span> : icon}
              <span className={isPi ? '' : 'ml-2'}>{isUser ? balance.toFixed(2) : '--.--'}</span>
            </div>
            
            {estimatedValue && (
              <div className="mt-2 text-sm text-muted-foreground">
                ≈ {estimatedValue}
              </div>
            )}
            
            {/* Currency conversions */}
            {isUser && balance > 0 && usdValue !== undefined && (
              <div className="flex flex-col mt-1">
                <CurrencyValue 
                  amount={usdValue}
                  symbol="$"
                  label="US Dollar value"
                  prefix={<DollarSign className="h-3 w-3 mr-1" />}
                />
                {egpValue !== undefined && (
                  <CurrencyValue 
                    amount={egpValue}
                    symbol="£E"
                    label="Egyptian Pound value"
                    prefix={<span className="text-xs mr-1">£E</span>}
                  />
                )}
              </div>
            )}
            
            {isPi && (
              <div className="mt-2">
                <PiPriceIndicator showDetails={true} />
              </div>
            )}
          </div>
          
          {!isUser && onConnect && (
            <Button 
              onClick={onConnect}
              className="mt-4 lg:mt-0 button-gradient"
            >
              Connect with Pi
            </Button>
          )}
        </div>
        
        {isUser && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {customActions ? customActions : (
              <>
                <Button variant="outline" className="flex items-center">
                  <WalletIcon className="mr-2 h-4 w-4" />
                  Connect
                </Button>
                <Button variant="outline" className="flex items-center">
                  <SendHorizontal className="mr-2 h-4 w-4" />
                  Send
                </Button>
                <Button variant="outline" className="flex items-center">
                  <ArrowRightLeft className="mr-2 h-4 w-4" />
                  Transactions
                </Button>
                {onTopUp && (
                  <Button variant="default" className="button-gradient" onClick={onTopUp}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Top Up
                  </Button>
                )}
              </>
            )}
          </div>
        )}
        
        {onExternal && (
          <div className="mt-6">
            <Button variant="ghost" size="sm" className="text-xs flex items-center" onClick={onExternal}>
              <ExternalLink className="mr-1 h-3 w-3" />
              Visit PiNet.com
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletCard;
