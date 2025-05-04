
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pickaxe } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useMining } from '@/contexts/MiningContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface DailyMiningStatusProps {
  handleStartMining: () => void;
  showAnimation: boolean;
  user: any;
}

const DailyMiningStatus = ({ handleStartMining, showAnimation, user }: DailyMiningStatusProps) => {
  const { canMine, isOnCooldown, timeUntilNextMining, lastMiningTime } = useMining();
  const { t } = useLanguage();

  // Format time until next mining
  const formatTimeUntilNextMining = () => {
    if (!isOnCooldown) return t('mining.availableNow');
    
    const hours = Math.floor(timeUntilNextMining / (60 * 60 * 1000));
    const minutes = Math.floor((timeUntilNextMining % (60 * 60 * 1000)) / (60 * 1000));
    
    return `${hours}${t('mining.hours')} ${minutes}${t('mining.minutes')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{t('mining.dailyMiningStatus')}</CardTitle>
      </CardHeader>
      <CardContent>
        {canMine ? (
          <>
            <p className="mb-4 text-muted-foreground">
              {t('mining.subtitle')}
            </p>
            <Button 
              onClick={handleStartMining} 
              className="w-full button-gradient"
              disabled={!user || showAnimation}
            >
              <Pickaxe className="mr-2 h-4 w-4" />
              {!user ? t('mining.loginToMine') : showAnimation ? t('mining.miningInProgress') : t('mining.claimDailyTokens')}
            </Button>
          </>
        ) : (
          <div>
            <div className="flex justify-between mb-2">
              <span>{t('mining.nextMiningAvailable')}</span>
              <span className="font-bold">{formatTimeUntilNextMining()}</span>
            </div>
            <Progress 
              value={100 - (timeUntilNextMining / (24 * 60 * 60 * 1000) * 100)} 
              className="h-3 mb-4" 
            />
            <p className="text-sm text-muted-foreground mb-4">
              {t('mining.alreadyClaimed')}
            </p>
            <div className="text-center">
              <div className="text-sm mb-1">{t('mining.lastMiningSession')}:</div>
              <div className="text-lg font-bold">
                {lastMiningTime ? new Date(lastMiningTime).toLocaleString() : t('mining.never')}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyMiningStatus;
