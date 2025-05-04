
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface MiningStatisticsProps {
  MINING_REWARD: number;
}

const MiningStatistics = ({ MINING_REWARD }: MiningStatisticsProps) => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{t('mining.stats')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('mining.dailyReward')}</span>
            <span className="font-medium">~{MINING_REWARD} PTM/{t('mining.points')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('mining.monthlyPotential')}</span>
            <span className="font-medium">~{(MINING_REWARD * 30).toFixed(2)} PTM/{t('mining.points')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('mining.miningLevel')}</span>
            <span className="font-medium">{t('mining.level')} 1</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('mining.nextLevelBoost')}</span>
            <span className="font-medium">+10% {t('mining.boost')} 5.0 PTM</span>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium mb-2">{t('mining.miningBonuses')}</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t('mining.consecutiveDaily')}</span>
              <span className="text-green-500">+15%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{t('mining.weekendBonus')}</span>
              <span className="text-green-500">+10%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MiningStatistics;
