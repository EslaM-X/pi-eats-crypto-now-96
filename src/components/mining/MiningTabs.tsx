
import React, { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdPlaceholder from './AdPlaceholder';
import MiningActivity from './MiningActivity';
import DailyMiningStatus from './DailyMiningStatus';
import MiningStatistics from './MiningStatistics';
import MiningLeaderboard from './MiningLeaderboard';

interface MiningTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleStartMining: () => void;
  showAnimation: boolean;
  user: any;
  MINING_REWARD: number;
  totalMined: number;
}

const MiningTabs = ({ 
  activeTab, 
  setActiveTab,
  handleStartMining,
  showAnimation,
  user,
  MINING_REWARD,
  totalMined
}: MiningTabsProps) => {
  return (
    <Tabs defaultValue="mining" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-2 mb-6">
        <TabsTrigger value="mining">Mining</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      
      <TabsContent value="mining" className="focus-visible:outline-none focus-visible:ring-0">
        <div className="grid md:grid-cols-2 gap-6">
          <DailyMiningStatus 
            handleStartMining={handleStartMining} 
            showAnimation={showAnimation}
            user={user}
          />
          
          <MiningStatistics MINING_REWARD={MINING_REWARD} />
          
          <div className="md:col-span-2">
            <AdPlaceholder width="100%" height="120px" variant="horizontal" />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="activity" className="focus-visible:outline-none focus-visible:ring-0">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <MiningActivity />
          </div>
          
          <MiningLeaderboard totalMined={totalMined} />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default MiningTabs;
