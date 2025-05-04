
import React from 'react';
import { AlertCircle, Pickaxe } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import PiEatLogo from '@/components/PiEatLogo';
import { useLanguage } from '@/contexts/LanguageContext';

interface MiningPageHeaderProps {
  totalMined: number;
  formatNumberPrecision: (num: number) => string;
}

const MiningPageHeader = ({ totalMined, formatNumberPrecision }: MiningPageHeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Pickaxe className="h-8 w-8 text-pi" />
          {t('mining.title')}
          <PiEatLogo size="md" className="ml-2" style="mining" />
        </h1>
        <div className="text-center">
          <div className="text-lg font-bold">{formatNumberPrecision(totalMined)} PTM</div>
          <div className="text-xs text-muted-foreground">{t('mining.totalMined')}</div>
        </div>
      </div>
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t('mining.title')}</AlertTitle>
        <AlertDescription>
          {t('mining.subtitle')}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default MiningPageHeader;
