
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MiningLeaderboardProps {
  totalMined: number;
}

const MiningLeaderboard = ({ totalMined }: MiningLeaderboardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-yellow-500 text-white h-6 w-6 flex items-center justify-center rounded-full mr-2">1</div>
              <span>MasterMiner</span>
            </div>
            <span className="font-medium">128.45 PTM</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 h-6 w-6 flex items-center justify-center rounded-full mr-2">2</div>
              <span>PiPower</span>
            </div>
            <span className="font-medium">94.32 PTM</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-orange-600 text-white h-6 w-6 flex items-center justify-center rounded-full mr-2">3</div>
              <span>CryptoKing</span>
            </div>
            <span className="font-medium">87.61 PTM</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-muted text-muted-foreground h-6 w-6 flex items-center justify-center rounded-full mr-2">4</div>
              <span>TokenHunter</span>
            </div>
            <span className="font-medium">43.08 PTM</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-muted text-muted-foreground h-6 w-6 flex items-center justify-center rounded-full mr-2">5</div>
              <span>BlockExplorer</span>
            </div>
            <span className="font-medium">32.54 PTM</span>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-pi/20 text-pi h-6 w-6 flex items-center justify-center rounded-full mr-2">?</div>
              <span>You</span>
            </div>
            <span className="font-medium">{totalMined.toFixed(4)} PTM</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MiningLeaderboard;
