
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

const Mining = () => {
  const { user } = usePiAuth();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>('mining');
  const [isMining, setIsMining] = useState<boolean>(false);
  const [currentMinedAmount, setCurrentMinedAmount] = useState<number>(0);
  const [miningProgress, setMiningProgress] = useState<number>(0);
  const [totalMined, setTotalMined] = useState<number>(0.1823);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [showAd, setShowAd] = useState<boolean>(false);
  const [miningTimer, setMiningTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Mining session constants
  const MAX_MINING_TIME = 15 * 60; // 15 minutes in seconds
  const MIN_MINING_REWARD = 0.0001;
  const MAX_MINING_REWARD = 0.005;
  
  // Load previous mining data
  useEffect(() => {
    const savedTotalMined = localStorage.getItem('pti-mining-total');
    if (savedTotalMined) {
      setTotalMined(parseFloat(savedTotalMined));
    }
    
    // Check if there's an active mining session
    const lastMiningTimestamp = localStorage.getItem('pti-mining-timestamp');
    if (lastMiningTimestamp) {
      const elapsed = Math.floor((Date.now() - parseInt(lastMiningTimestamp)) / 1000);
      if (elapsed < MAX_MINING_TIME) {
        // Resume mining session
        setIsMining(true);
        setRemainingTime(MAX_MINING_TIME - elapsed);
        setMiningProgress((elapsed / MAX_MINING_TIME) * 100);
        startMiningTimer(MAX_MINING_TIME - elapsed);
      } else {
        // Mining session expired
        localStorage.removeItem('pti-mining-timestamp');
      }
    }
  }, []);
  
  const startMiningTimer = (duration: number) => {
    if (miningTimer) clearInterval(miningTimer);
    
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleMiningComplete();
          return 0;
        }
        
        const newValue = prev - 1;
        setMiningProgress(((MAX_MINING_TIME - newValue) / MAX_MINING_TIME) * 100);
        return newValue;
      });
    }, 1000);
    
    setMiningTimer(timer);
    return timer;
  };
  
  const startMining = () => {
    if (!user) return;
    
    setIsMining(true);
    setRemainingTime(MAX_MINING_TIME);
    setMiningProgress(0);
    localStorage.setItem('pti-mining-timestamp', Date.now().toString());
    
    // Generate a random amount to be mined at the end
    const miningReward = MIN_MINING_REWARD + Math.random() * (MAX_MINING_REWARD - MIN_MINING_REWARD);
    setCurrentMinedAmount(miningReward);
    
    startMiningTimer(MAX_MINING_TIME);
  };
  
  const handleMiningComplete = () => {
    setIsMining(false);
    localStorage.removeItem('pti-mining-timestamp');
    
    // 25% chance to show an ad
    if (Math.random() < 0.25) {
      setShowAd(true);
      return;
    }
    
    claimReward();
  };
  
  const handleAdComplete = () => {
    setShowAd(false);
    claimReward();
  };
  
  const claimReward = () => {
    // Add the mined amount to the total
    const newTotal = totalMined + currentMinedAmount;
    setTotalMined(newTotal);
    localStorage.setItem('pti-mining-total', newTotal.toString());
    
    // Reset mining state
    setCurrentMinedAmount(0);
  };
  
  const formatNumberPrecision = (num: number) => {
    if (num < 0.001) return num.toFixed(6);
    return num.toFixed(4);
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
              Mine PiEat tokens (PTM) by keeping this page open. You'll earn PTM while the timer is running.
            </AlertDescription>
          </Alert>
        </div>
        
        <Tabs defaultValue="mining" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="mining">Mining</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mining" className="focus-visible:outline-none focus-visible:ring-0">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Mine PTM Tokens</CardTitle>
                </CardHeader>
                <CardContent>
                  {!isMining ? (
                    <>
                      <p className="mb-4 text-muted-foreground">
                        Start mining to earn PTM tokens. Keep this tab open while mining is active.
                      </p>
                      <Button 
                        onClick={startMining} 
                        className="w-full button-gradient"
                        disabled={!user}
                      >
                        <Pickaxe className="mr-2 h-4 w-4" />
                        {user ? 'Start Mining' : 'Login to Mine'}
                      </Button>
                    </>
                  ) : (
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Mining in progress...</span>
                        <CountdownTimer seconds={remainingTime} />
                      </div>
                      <Progress value={miningProgress} className="h-3 mb-4" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Keep this tab open to continue mining. Mining will stop if you close this page.
                      </p>
                      <div className="text-center">
                        <div className="text-sm mb-1">You will mine approximately:</div>
                        <div className="text-2xl font-bold text-pi">{formatNumberPrecision(currentMinedAmount)} PTM</div>
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
                      <span className="text-muted-foreground">Mining Rate</span>
                      <span className="font-medium">~0.0234 PTM/hour</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Daily Potential</span>
                      <span className="font-medium">~0.56 PTM/day</span>
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
                        <span>First Daily Mining</span>
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
