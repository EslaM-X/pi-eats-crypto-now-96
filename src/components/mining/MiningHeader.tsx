
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pickaxe, TrendingUp } from 'lucide-react';
import { useMining } from '@/contexts/MiningContext';
import { Progress } from '@/components/ui/progress';
import PiNetworkLogo from '../PiNetworkLogo';

const MiningHeader = ({ onStartMining, isMining }: { onStartMining: () => void, isMining: boolean }) => {
  const { ptmBalance, totalMined, miningStats } = useMining();
  
  // Calculate percentage of supply
  const supplyPercentage = (miningStats.circulatingSupply / miningStats.totalSupply) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Your PTM Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold flex items-center">
            <span className="text-3xl mr-2">ꟼ</span> {ptmBalance.toFixed(4)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Total mined: {totalMined.toFixed(4)} PTM
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center justify-between">
            <span>Start Mining</span>
            <Pickaxe className="h-5 w-5" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={onStartMining}
            disabled={isMining}
            className="w-full button-gradient flex items-center justify-center"
          >
            {isMining ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mining...
              </>
            ) : (
              <>
                <Pickaxe className="mr-2 h-4 w-4" />
                Start Mining Now
              </>
            )}
          </Button>
          <div className="text-xs text-center mt-2 text-muted-foreground">
            Mine PTM tokens to use in the Pieat-Me ecosystem
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center justify-between">
            <span>Supply Info</span>
            <TrendingUp className="h-5 w-5" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Circulating Supply:</span>
              <span>{miningStats.circulatingSupply.toLocaleString()} PTM</span>
            </div>
            <Progress value={supplyPercentage} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Current</span>
              <span>Max: {miningStats.totalSupply.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MiningHeader;
