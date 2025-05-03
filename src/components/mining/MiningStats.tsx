
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMining } from '@/contexts/MiningContext';
import { CircleDollarSign, History, Network, Timer, TrendingUp, Zap } from 'lucide-react';

const MiningStats = () => {
  const { miningPower, lastMiningTime, miningStats } = useMining();
  
  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Zap className="h-4 w-4 mr-1 text-pi" />
            Mining Power
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{miningPower.toFixed(2)}x</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <History className="h-4 w-4 mr-1 text-pi" />
            Last Mining Session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm">{formatDate(lastMiningTime)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <TrendingUp className="h-4 w-4 mr-1 text-pi" />
            Mining Difficulty
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{miningStats.difficulty.toFixed(3)}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <CircleDollarSign className="h-4 w-4 mr-1 text-pi" />
            Average Reward
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <span className="text-xl">ꟼ</span> {(0.05 / miningStats.difficulty).toFixed(4)}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Timer className="h-4 w-4 mr-1 text-pi" />
            Cooldown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">60s</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Network className="h-4 w-4 mr-1 text-pi" />
            Network Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm">Online</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MiningStats;
