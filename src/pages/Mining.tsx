import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMining } from '@/contexts/MiningContext';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { Pickaxe, TrendingUp, Clock, Award, ChevronDown, ChevronUp, Info } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { PiPriceIndicator } from '@/components/PiPriceIndicator';
import PiEatLogo from '@/components/PiEatLogo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Mining = () => {
  const { t } = useLanguage();
  const { user, login } = usePiAuth();
  const { 
    ptmBalance, 
    miningPower, 
    isCurrentlyMining, 
    lastMiningTime, 
    totalMined,
    startMining,
    miningStats
  } = useMining();
  
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [adViewed, setAdViewed] = useState(false);
  const [miningProgress, setMiningProgress] = useState(0);

  // Calculate cooldown time
  useEffect(() => {
    if (!lastMiningTime) return;
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const lastMining = new Date(lastMiningTime);
      const diffMs = now.getTime() - lastMining.getTime();
      const cooldownMs = 60 * 1000; // 1 minute cooldown
      
      if (diffMs < cooldownMs) {
        return Math.ceil((cooldownMs - diffMs) / 1000);
      }
      return 0;
    };
    
    const timer = setInterval(() => {
      const left = calculateTimeLeft();
      setTimeLeft(left);
      
      if (left === 0) {
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [lastMiningTime]);
  
  // Mining progress effect
  useEffect(() => {
    if (!isCurrentlyMining) {
      setMiningProgress(0);
      return;
    }
    
    setMiningProgress(10); // Start at 10%
    
    const interval = setInterval(() => {
      setMiningProgress(prev => {
        const increment = Math.random() * 15;
        const newValue = prev + increment;
        
        if (newValue >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        return newValue;
      });
    }, 500); // Update progress every 500ms
    
    return () => clearInterval(interval);
  }, [isCurrentlyMining]);
  
  // Function to handle mining button click
  const handleMine = async () => {
    if (!user) {
      login();
      return;
    }
    
    if (timeLeft && timeLeft > 0) {
      toast.error(`Mining cooldown active. Please wait ${timeLeft} seconds`);
      return;
    }
    
    if (!adViewed) {
      // Simulate ad view
      toast.info('Preparing advertisement...');
      setAdViewed(true);
      
      // After ad is "viewed", allow mining
      setTimeout(() => {
        toast.success('Advertisement viewed! You can now mine PTM.');
      }, 2000);
      
      return;
    }
    
    // Start mining process
    await startMining();
    setAdViewed(false); // Reset for next mining session
  };
  
  // Format time as mm:ss
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate mining readiness percentage
  const getMiningReadiness = () => {
    if (timeLeft === null || timeLeft === 0) return 100;
    return 100 - (timeLeft / 60) * 100;
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-3 sm:px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4 text-center md:text-left bg-gradient-to-r from-pi to-orange bg-clip-text text-transparent">
              PTM Mining
            </h1>
            <p className="text-muted-foreground text-center md:text-left text-sm md:text-base">
              Mine PiEat-Me (PTM) tokens and earn rewards
            </p>
          </div>
          
          {/* Main mining card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="glass-card overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Pickaxe className="mr-2 h-6 w-6 text-orange" />
                      PTM Mining Portal
                    </div>
                    <PiEatLogo size="lg" />
                  </CardTitle>
                  <CardDescription>
                    Watch an ad and mine PTM tokens
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Mining animation/visualization */}
                  <div className="bg-black/10 rounded-lg p-6 mb-6 relative overflow-hidden dark:bg-white/5 min-h-[200px] flex flex-col justify-center items-center">
                    {!user ? (
                      <div className="text-center">
                        <p className="mb-4">Connect with Pi Network to start mining</p>
                        <Button 
                          onClick={login}
                          className="button-gradient"
                        >
                          Connect with Pi
                        </Button>
                      </div>
                    ) : isCurrentlyMining ? (
                      <div className="text-center">
                        <div className="flex justify-center mb-4">
                          <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-l-2 border-pi"></div>
                        </div>
                        <Progress value={miningProgress} className="mb-2 h-3" />
                        <p className="text-sm text-muted-foreground">Mining in progress... {miningProgress.toFixed(0)}%</p>
                      </div>
                    ) : adViewed ? (
                      <div className="text-center">
                        <PiEatLogo size="xl" />
                        <p className="mt-4">Ready to mine! Click the button below.</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                          <span className="text-muted-foreground">Advertisement Space</span>
                        </div>
                        <p className="mt-4 text-sm">Watch an ad to start mining</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Mining stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Balance</p>
                      <p className="font-bold text-lg flex items-center justify-center">
                        <span className="mr-1">ꟼ</span>{ptmBalance.toFixed(4)}
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Mining Power</p>
                      <p className="font-bold text-lg">x{miningPower.toFixed(2)}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Cooldown</p>
                      <p className="font-bold text-lg">{formatTime(timeLeft || 0)}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Total Mined</p>
                      <p className="font-bold text-lg flex items-center justify-center">
                        <span className="mr-1">ꟼ</span>{totalMined.toFixed(4)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Mining readiness */}
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Mining Readiness</span>
                      <span className="text-sm font-bold">{getMiningReadiness().toFixed(0)}%</span>
                    </div>
                    <Progress value={getMiningReadiness()} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full button-gradient text-lg py-6"
                    onClick={handleMine}
                    disabled={isCurrentlyMining || (timeLeft !== null && timeLeft > 0 && adViewed)}
                  >
                    {!user ? 'Connect to Mine' : 
                      isCurrentlyMining ? 'Mining in Progress...' : 
                      adViewed ? 'Start Mining' : 
                      timeLeft !== null && timeLeft > 0 ? `Cooldown (${formatTime(timeLeft)})` : 
                      'Watch Ad to Mine'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              {/* PTM token info */}
              <Card className="glass-card mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>PTM Token</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => setShowStats(!showStats)}
                    >
                      {showStats ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <PiEatLogo size="md" />
                      <div className="ml-3">
                        <p className="font-bold">PiEat-Me</p>
                        <p className="text-xs text-muted-foreground">PTM</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">ꟼ{ptmBalance.toFixed(4)}</p>
                      <p className="text-xs text-muted-foreground">Your Balance</p>
                    </div>
                  </div>
                  
                  {showStats && (
                    <div className="space-y-4 mt-4 border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Supply</span>
                        <span className="font-medium">{miningStats.totalSupply.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Max Supply</span>
                        <span className="font-medium">{miningStats.maxSupply.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Circulating</span>
                        <span className="font-medium">{miningStats.circulatingSupply.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Mining Difficulty</span>
                        <span className="font-medium">{miningStats.difficulty.toFixed(4)}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Mining info card */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5" />
                    How Mining Works
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-orange/20 p-2 rounded-full mr-3">
                      <Clock className="h-4 w-4 text-orange" />
                    </div>
                    <div>
                      <p className="font-medium">Watch Ad</p>
                      <p className="text-sm text-muted-foreground">Watch a short advertisement to enable mining</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-pi/20 p-2 rounded-full mr-3">
                      <Pickaxe className="h-4 w-4 text-pi" />
                    </div>
                    <div>
                      <p className="font-medium">Mine PTM</p>
                      <p className="text-sm text-muted-foreground">Click the mine button to start the mining process</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-green-500/20 p-2 rounded-full mr-3">
                      <Award className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">Earn Rewards</p>
                      <p className="text-sm text-muted-foreground">Receive PTM tokens as your mining reward</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-500/20 p-2 rounded-full mr-3">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium">Increase Mining Power</p>
                      <p className="text-sm text-muted-foreground">Complete tasks to boost your mining efficiency</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Ad space for app monetization */}
          <div className="mt-8">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-center h-24">
              <span className="text-muted-foreground">Advertisement Space</span>
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
};

export default Mining;
