
import React from 'react';
import { AlertCircle, Pickaxe } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import PiEatLogo from '@/components/PiEatLogo';

interface MiningPageHeaderProps {
  totalMined: number;
  formatNumberPrecision: (num: number) => string;
}

const MiningPageHeader = ({ totalMined, formatNumberPrecision }: MiningPageHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Pickaxe className="h-8 w-8 text-pi" />
          Mining
          <PiEatLogo size="md" className="ml-2" style="mining" />
        </h1>
        <div className="text-center">
          <div className="text-lg font-bold">{formatNumberPrecision(totalMined)} PTM</div>
          <div className="text-xs text-muted-foreground">Total Mined</div>
        </div>
      </div>
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Mining Information</AlertTitle>
        <AlertDescription>
          Mine PiEat tokens (PTM) once every 24 hours. Click the mining button to earn your daily tokens.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default MiningPageHeader;
