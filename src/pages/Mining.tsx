
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Pickaxe, Clock, Timer, Video, Gift, TrendingUp, AlertCircle, BarChart, Award } from 'lucide-react';
import Header from '@/components/Header';
import AdPlaceholder from '@/components/mining/AdPlaceholder';
import MiningStats from '@/components/mining/MiningStats';
import MiningRewards from '@/components/mining/MiningRewards';
import MiningActivity from '@/components/mining/MiningActivity';
import CountdownTimer from '@/components/mining/CountdownTimer';
import MiningAnimation from '@/components/mining/MiningAnimation';
import { useMining } from '@/contexts/MiningContext';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { useTheme } from '@/contexts/ThemeContext';

const Mining = () => {
  const { theme } = useTheme();
  const { user } = usePiAuth();
  const navigate = useNavigate();
  const { 
    startMining, 
    ptmBalance, 
    totalMined, 
    miningPower, 
    lastMiningTime, 
    miningStats,
    updateMiningPower
  } = useMining();
  
  const [isMining, setIsMining] = useState(false);
  const [showMiningAnimation, setShowMiningAnimation] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [adViewCount, setAdViewCount] = useState(0);
  const [showAdModal, setShowAdModal] = useState(false);
  
  // Check if mining is available or on cooldown
  useEffect(() => {
    if (lastMiningTime) {
      const now = new Date().getTime();
      const lastMined = new Date(lastMiningTime).getTime();
      const timeElapsed = now - lastMined;
      const cooldownPeriod = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      if (timeElapsed < cooldownPeriod) {
        // Still on cooldown, calculate remaining time
        const remainingTime = cooldownPeriod - timeElapsed;
        setCountdown(Math.floor(remainingTime / 1000)); // Convert to seconds
      } else {
        // Mining is available
        setCountdown(null);
      }
    }
  }, [lastMiningTime]);
  
  // Update countdown every second
  useEffect(() => {
    if (countdown === null) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [countdown]);
  
  // Handle mining button click
  const handleStartMining = () => {
    if (!user) {
      toast.error('Please connect with Pi Network first');
      return;
    }
    
    if (countdown !== null) {
      toast.error('Mining is on cooldown. Please wait until the countdown finishes');
      return;
    }
    
    // Show first ad
    setShowAdModal(true);
    setAdViewCount(0);
  };
  
  // Handle ad view completion
  const handleAdViewed = () => {
    const newCount = adViewCount + 1;
    setAdViewCount(newCount);
    
    if (newCount >= 2) {
      // Both ads viewed, start mining
      setShowAdModal(false);
      startMiningProcess();
    } else {
      toast.success(`Ad ${newCount}/2 viewed!`);
    }
  };
  
  // Start the actual mining process
  const startMiningProcess = () => {
    setIsMining(true);
    setShowMiningAnimation(true);
    
    // Simulate mining process
    setTimeout(() => {
      const reward = (0.01 + (Math.random() * 0.02)).toFixed(4);
      
      startMining(Number(reward));
      updateMiningPower(miningPower + 0.01);
      
      setIsMining(false);
      setShowMiningAnimation(false);
      
      toast.success(`Mining successful! You earned ${reward} PTM!`, {
        description: "Your mining power has increased!",
      });
      
      // Set countdown for next mining (24 hours)
      setCountdown(24 * 60 * 60);
    }, 5000);
  };
  
  // Formatting functions
  const formatTimeLeft = (seconds: number) => {
    if (!seconds) return '--:--:--';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Header />
      <main className="pb-20 min-h-screen bg-gradient-to-b from-background to-background/95">
        <Container>
          {/* Hero Section */}
          <div className={`relative rounded-3xl p-8 mb-8 overflow-hidden ${theme === 'dark' ? 'bg-muted/20' : 'bg-muted/30'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-pi/5 to-orange/5 z-0"></div>
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
              <div className="w-full h-full bg-[url('/lovable-uploads/735545db-86b4-4947-9b31-a9a39041b87f.png')] bg-contain bg-no-repeat bg-right"></div>
            </div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="md:max-w-lg">
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-pi to-orange bg-clip-text text-transparent">
                    PTM Mining Center
                  </h1>
                  <p className="text-muted-foreground mb-6">
                    Mine Pieat-Me tokens (PTM) to unlock rewards, discounts, and exclusive benefits in the Pieat-Me ecosystem. 
                    Connect with Pi Network to start earning today!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {countdown === null ? (
                      <Button
                        onClick={handleStartMining}
                        disabled={isMining || !user}
                        className="button-gradient flex items-center justify-center gap-2 py-6 text-lg"
                        size="lg"
                      >
                        {isMining ? (
                          <>
                            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Mining in progress...
                          </>
                        ) : (
                          <>
                            <Pickaxe className="h-6 w-6" /> Start Mining Now
                          </>
                        )}
                      </Button>
                    ) : (
                      <div className="w-full sm:w-auto">
                        <Button disabled className="w-full py-6 text-lg bg-muted" size="lg">
                          <Clock className="mr-2 h-5 w-5" />
                          <CountdownTimer seconds={countdown} />
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">
                          Mining will be available after the cooldown period
                        </p>
                      </div>
                    )}
                    {!user && (
                      <Button 
                        onClick={() => navigate("/")} 
                        variant="outline" 
                        size="lg"
                        className="border-pi hover:border-pi/80 text-pi hover:bg-pi/10"
                      >
                        Connect Wallet First
                      </Button>
                    )}
                  </div>
                </div>
                
                <Card className="w-full md:w-72 bg-card/60 backdrop-blur-md border border-border/50 shadow-xl">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center justify-center p-2 bg-pi/10 rounded-full mb-3">
                        <span className="text-4xl font-bold text-pi">ꟼ</span>
                      </div>
                      <h3 className="text-xl font-bold mb-1">Your PTM Balance</h3>
                      <div className="text-3xl font-bold">
                        {ptmBalance.toFixed(4)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Total mined: {totalMined.toFixed(4)} PTM
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Mining Power</span>
                          <span className="font-medium">{miningPower.toFixed(2)}x</span>
                        </div>
                        <Progress value={miningPower * 10} className="h-2 mt-1" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Network Difficulty</span>
                          <span className="font-medium">{miningStats.difficulty.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          
          {/* Rewards and Stats Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <MiningRewards />
              
              {/* Advertisement Area */}
              <div className="rounded-lg overflow-hidden">
                <AdPlaceholder 
                  width="100%" 
                  height="120px" 
                  text="Advertisement Space" 
                  variant="horizontal" 
                />
              </div>
              
              <MiningStats />
            </div>
            
            <div className="space-y-6">
              {/* Advertisement Area - Vertical */}
              <div className="rounded-lg overflow-hidden">
                <AdPlaceholder 
                  width="100%" 
                  height="300px" 
                  text="Advertisement Space" 
                  variant="vertical" 
                />
              </div>
              
              <MiningActivity />
            </div>
          </div>
          
          {/* How Mining Works Section */}
          <div className={`mt-12 rounded-xl p-6 ${theme === 'dark' ? 'bg-muted/20' : 'bg-muted/30'}`}>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-pi" />
              How PTM Mining Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div className="flex flex-col items-center text-center p-4 bg-card/60 backdrop-blur-sm rounded-lg">
                <div className="h-12 w-12 rounded-full bg-pi/10 flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-pi" />
                </div>
                <h3 className="font-bold mb-2">View 2 Ads</h3>
                <p className="text-muted-foreground text-sm">Watch two short advertisements to start the mining process</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 bg-card/60 backdrop-blur-sm rounded-lg">
                <div className="h-12 w-12 rounded-full bg-orange/10 flex items-center justify-center mb-4">
                  <Pickaxe className="h-6 w-6 text-orange" />
                </div>
                <h3 className="font-bold mb-2">Mine PTM Tokens</h3>
                <p className="text-muted-foreground text-sm">Start mining and earn PTM tokens based on your mining power</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 bg-card/60 backdrop-blur-sm rounded-lg">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="font-bold mb-2">Get Rewards</h3>
                <p className="text-muted-foreground text-sm">Use PTM tokens for discounts and exclusive features in Pieat-Me</p>
              </div>
            </div>
          </div>
        </Container>
      </main>
      
      {/* Mining Animation Modal */}
      {showMiningAnimation && (
        <MiningAnimation onClose={() => setShowMiningAnimation(false)} />
      )}
      
      {/* Ad Modal */}
      {showAdModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 text-center">
                {adViewCount === 0 ? 'Advertisement 1/2' : 'Advertisement 2/2'}
              </h2>
              <div className="mb-6">
                <AdPlaceholder 
                  width="100%" 
                  height="300px" 
                  text={`Advertisement ${adViewCount + 1}/2`} 
                  variant="modal" 
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={handleAdViewed} 
                  className="button-gradient"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default Mining;
