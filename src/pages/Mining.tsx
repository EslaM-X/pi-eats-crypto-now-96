
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Pickaxe, Trophy, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import AdPlaceholder from '@/components/mining/AdPlaceholder';
import CountdownTimer from '@/components/mining/CountdownTimer';
import MiningActivity from '@/components/mining/MiningActivity';
import PiEatLogo from '@/components/PiEatLogo';
import { useMining } from '@/contexts/MiningContext';
import { toast } from 'sonner';
import MiningHeader from '@/components/mining/MiningHeader';
import MiningStats from '@/components/mining/MiningStats';
import MiningAnimation from '@/components/mining/MiningAnimation';

const Mining = () => {
  const { user } = usePiAuth();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>('mining');
  const [isMining, setIsMining] = useState<boolean>(false);
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  const [showAd, setShowAd] = useState<boolean>(false);
  
  const { 
    ptmBalance, 
    totalMined, 
    canMine, 
    isOnCooldown, 
    timeUntilNextMining, 
    lastMiningTime, 
    startMining 
  } = useMining();
  
  // Daily mining reward
  const MINING_REWARD = 0.25; // Increased reward for daily mining
  
  // Format number with appropriate precision
  const formatNumberPrecision = (num: number) => {
    if (num < 0.001) return num.toFixed(6);
    return num.toFixed(4);
  };
  
  // Handle mining button click
  const handleStartMining = () => {
    if (!user) {
      toast.error('You need to login to mine PTM tokens');
      return;
    }
    
    if (!canMine) {
      toast.error('Mining is in cooldown. Please wait 24 hours between mining sessions.');
      return;
    }
    
    setShowAnimation(true);
    
    // After animation completes, process the mining
    setTimeout(() => {
      // 25% chance to show an ad
      if (Math.random() < 0.25) {
        setShowAd(true);
      } else {
        completeMining();
      }
    }, 5000); // Animation runs for 5 seconds
  };
  
  // Handle ad completion
  const handleAdComplete = () => {
    setShowAd(false);
    completeMining();
  };
  
  // Complete mining process
  const completeMining = () => {
    startMining(MINING_REWARD);
    setShowAnimation(false);
    toast.success(`Successfully mined ${MINING_REWARD} PTM tokens!`);
  };
  
  // Handle animation complete
  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };
  
  // Format time until next mining
  const formatTimeUntilNextMining = () => {
    if (!isOnCooldown) return 'Available Now';
    
    const hours = Math.floor(timeUntilNextMining / (60 * 60 * 1000));
    const minutes = Math.floor((timeUntilNextMining % (60 * 60 * 1000)) / (60 * 1000));
    
    return `${hours}h ${minutes}m`;
  };
  
  return (
    <>
      <Header />
      <Container className="py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Pickaxe className="h-8 w-8 text-pi" />
              Mining
              <PiEatLogo size="md" className="ml-2" style="mining" />
            </h1>
            <div className="text-center">
              <div className="text-lg font-bold">{formatNumberPrecision(totalMined)} PTM</div>
              <div className="text-xs text-muted-foreground">Total Mined</div>
            </div>
          </div>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Mining Information</AlertTitle>
            <AlertDescription>
              Mine PiEat tokens (PTM) once every 24 hours. Click the mining button to earn your daily tokens.
            </AlertDescription>
          </Alert>
        </div>
        
        <MiningHeader onStartMining={handleStartMining} isMining={showAnimation} />
        
        <Tabs defaultValue="mining" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="mining">Mining</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mining" className="focus-visible:outline-none focus-visible:ring-0">
            <div className="grid md:grid-cols-2 gap-6">
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
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Mining Animation */}
        {showAnimation && <MiningAnimation onClose={handleAnimationComplete} />}
        
        {/* Ad Modal */}
        {showAd && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle>Watch Ad to Claim Reward</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <AdPlaceholder width="300px" height="250px" variant="modal" />
                <Button onClick={handleAdComplete} className="mt-4">
                  Continue
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </Container>
    </>
  );
};

export default Mining;
