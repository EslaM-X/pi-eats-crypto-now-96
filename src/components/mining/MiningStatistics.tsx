
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MiningStatisticsProps {
  MINING_REWARD: number;
}

const MiningStatistics = ({ MINING_REWARD }: MiningStatisticsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Mining Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Daily Reward</span>
            <span className="font-medium">~{MINING_REWARD} PTM/day</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Monthly Potential</span>
            <span className="font-medium">~{(MINING_REWARD * 30).toFixed(2)} PTM/month</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mining Level</span>
            <span className="font-medium">Level 1</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Next Level Boost</span>
            <span className="font-medium">+10% at 5.0 PTM</span>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium mb-2">Mining Bonuses</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Consecutive Daily Mining</span>
              <span className="text-green-500">+15%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Weekend Bonus</span>
              <span className="text-green-500">+10%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MiningStatistics;
