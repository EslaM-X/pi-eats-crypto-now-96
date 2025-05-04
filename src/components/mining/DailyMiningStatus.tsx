
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pickaxe } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useMining } from '@/contexts/MiningContext';

interface DailyMiningStatusProps {
  handleStartMining: () => void;
  showAnimation: boolean;
  user: any;
}

const DailyMiningStatus = ({ handleStartMining, showAnimation, user }: DailyMiningStatusProps) => {
  const { canMine, isOnCooldown, timeUntilNextMining, lastMiningTime } = useMining();

  // Format time until next mining
  const formatTimeUntilNextMining = () => {
    if (!isOnCooldown) return 'Available Now';
    
    const hours = Math.floor(timeUntilNextMining / (60 * 60 * 1000));
    const minutes = Math.floor((timeUntilNextMining % (60 * 60 * 1000)) / (60 * 1000));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Daily Mining Status</CardTitle>
      </CardHeader>
      <CardContent>
        {canMine ? (
          <>
            <p className="mb-4 text-muted-foreground">
              Your daily mining is available! Start mining to earn PTM tokens.
            </p>
            <Button 
              onClick={handleStartMining} 
              className="w-full button-gradient"
              disabled={!user || showAnimation}
            >
              <Pickaxe className="mr-2 h-4 w-4" />
              {!user ? 'Login to Mine' : showAnimation ? 'Mining...' : 'Claim Daily Tokens'}
            </Button>
          </>
        ) : (
          <div>
            <div className="flex justify-between mb-2">
              <span>Next mining available:</span>
              <span className="font-bold">{formatTimeUntilNextMining()}</span>
            </div>
            <Progress 
              value={100 - (timeUntilNextMining / (24 * 60 * 60 * 1000) * 100)} 
              className="h-3 mb-4" 
            />
            <p className="text-sm text-muted-foreground mb-4">
              You've already claimed your daily mining rewards. Return tomorrow to mine again.
            </p>
            <div className="text-center">
              <div className="text-sm mb-1">Last mining session:</div>
              <div className="text-lg font-bold">
                {lastMiningTime ? new Date(lastMiningTime).toLocaleString() : 'Never'}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyMiningStatus;
