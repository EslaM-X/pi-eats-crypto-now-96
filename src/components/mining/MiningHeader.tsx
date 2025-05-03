
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
            className="w-full relative overflow-hidden group bg-transparent border-0"
          >
            <div 
              className="absolute inset-0 bg-gradient-to-r from-pi via-orange to-pi-dark rounded-xl animate-gradient"
            ></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0.5 bg-gradient-to-r from-black/5 to-black/20 dark:from-white/5 dark:to-white/10 rounded-lg backdrop-blur-sm z-10 group-hover:from-black/10 group-hover:to-black/30 dark:group-hover:from-white/10 dark:group-hover:to-white/20 transition-all duration-300"></div>
            
            {isMining ? (
              <div className="relative z-20 flex items-center justify-center py-3 px-4 space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-white font-semibold">Mining...</span>
              </div>
            ) : (
              <div className="relative z-20 flex items-center justify-center py-3 px-6 space-x-3 group-hover:scale-105 transform transition-transform">
                <span className="bg-white/20 p-1.5 rounded-full">
                  <Pickaxe className="h-5 w-5 text-white" />
                </span>
                <span className="text-white font-semibold tracking-wider">Start Mining Now</span>
              </div>
            )}
            
            {/* Animated particles */}
            <div className="absolute inset-0 z-0 overflow-hidden rounded-xl opacity-60">
              <div className="particle-glow absolute w-12 h-12 bg-pi rounded-full blur-xl top-1/2 -translate-y-1/2 right-0 animate-pulse-gentle"></div>
              <div className="particle-glow absolute w-12 h-12 bg-orange rounded-full blur-xl bottom-0 left-1/3 animate-pulse-gentle" style={{ animationDelay: "0.5s" }}></div>
            </div>
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
