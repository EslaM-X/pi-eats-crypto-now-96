
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pickaxe, TrendingUp } from 'lucide-react';
import { useMining } from '@/contexts/MiningContext';
import { Progress } from '@/components/ui/progress';
import PiEatLogo from '../PiEatLogo';

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
            className="w-full relative overflow-hidden group"
            style={{
              background: "linear-gradient(90deg, hsl(var(--pi)) 0%, hsl(var(--orange)) 100%)",
              border: "none",
              padding: "0.75rem",
              borderRadius: "1rem",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)"
            }}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/20 to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></span>
            {isMining ? (
              <div className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-white font-medium">Mining...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2 transform group-hover:scale-105 transition-transform">
                <Pickaxe className="h-5 w-5 text-white" />
                <span className="text-white font-medium tracking-wider">Start Mining Now</span>
                <div className="absolute -right-3 -top-3 bg-white/20 h-12 w-12 rounded-full blur-xl"></div>
                <div className="absolute -left-3 -bottom-3 bg-white/20 h-12 w-12 rounded-full blur-xl"></div>
              </div>
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
