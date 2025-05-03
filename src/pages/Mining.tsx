
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useMining } from '@/contexts/MiningContext';
import { usePiAuth } from '@/contexts/PiAuthContext';
import AdPlaceholder from '@/components/mining/AdPlaceholder';
import MiningHeader from '@/components/mining/MiningHeader';
import MiningStats from '@/components/mining/MiningStats';
import MiningRewards from '@/components/mining/MiningRewards';
import MiningActivity from '@/components/mining/MiningActivity';
import MiningAnimation from '@/components/mining/MiningAnimation';
import { Container } from '@/components/ui/container';
import Header from '@/components/Header';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';
import PiEatLogo from '@/components/PiEatLogo';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

const Mining = () => {
  const { theme } = useTheme();
  const { startMining, canMine, timeUntilNextMining, isOnCooldown } = useMining();
  const { user, login } = usePiAuth();
  const isMobile = useIsMobile();
  
  const [isMining, setIsMining] = useState(false);
  const [showMiningAnimation, setShowMiningAnimation] = useState(false);
  const [showAdOverlay, setShowAdOverlay] = useState(false);
  const [rewards, setRewards] = useState(0.05);
  
  // Calculate rewards based on device and time
  useEffect(() => {
    // Base reward
    let baseReward = 0.05;
    
    // Bonus for mobile devices
    if (isMobile) {
      baseReward *= 1.1; // 10% bonus on mobile
    }
    
    // Time-based bonus (reward more during off-peak hours)
    const hour = new Date().getHours();
    if (hour >= 22 || hour <= 6) {
      baseReward *= 1.15; // 15% night bonus
    }
    
    // Set calculated reward
    setRewards(parseFloat(baseReward.toFixed(4)));
  }, [isMobile]);
  
  const handleStartMining = () => {
    if (!user) {
      toast.warning("Please connect with Pi Network to start mining");
      login();
      return;
    }
    
    if (!canMine) {
      toast.error(`Mining on cooldown. Available in ${Math.ceil(timeUntilNextMining / 1000)} seconds.`);
      return;
    }
    
    setIsMining(true);
    
    // Simulate ad display (in a real app, we would show a real ad)
    toast.info("Loading mining resources...");
    setShowAdOverlay(true);
    
    // After 3 seconds, hide ad and show mining animation
    setTimeout(() => {
      setShowAdOverlay(false);
      setShowMiningAnimation(true);
      toast.info("Mining in progress...");
      
      // After animation finishes, mining is complete
      setTimeout(() => {
        startMining(rewards); // Actually update mining state and rewards
        setIsMining(false);
        setShowMiningAnimation(false);
        toast.success(`Successfully mined ${rewards} PTM!`);
      }, 5000); // Animation lasts ~5 seconds
    }, 3000);
  };
  
  const handleCloseAnimation = () => {
    setShowMiningAnimation(false);
  };
  
  return (
    <>
      <Helmet>
        <title>PTM Mining | Pieat-Me</title>
      </Helmet>
      
      <Header />
      
      <Container className="py-6 sm:py-8">
        {/* Logo Header Section */}
        <div className="flex flex-col items-center justify-center mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-pi to-orange p-4 sm:p-6 rounded-full shadow-lg mb-4">
            <PiEatLogo size={isMobile ? "md" : "xl"} showEmoji={true} className="animate-pulse" />
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pi to-orange bg-clip-text text-transparent">
              Mine PTM Tokens
            </h1>
            <p className="text-muted-foreground mt-2">Earn rewards by mining Pieat-Me tokens</p>
          </div>
        </div>
        
        {!user && (
          <div className="mb-6 text-center">
            <Button 
              onClick={login} 
              className="button-gradient text-white font-medium py-2 px-6 rounded-full"
            >
              Connect with Pi Network to Mine
            </Button>
          </div>
        )}
        
        <MiningHeader 
          onStartMining={handleStartMining} 
          isMining={isMining || isOnCooldown} 
        />
        
        <MiningStats />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="md:col-span-2">
            <MiningRewards />
            <MiningActivity />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Sponsored</h2>
            <AdPlaceholder width="100%" height={isMobile ? "300px" : "600px"} variant="vertical" />
          </div>
        </div>
      </Container>
      
      {/* Mining animation overlay */}
      {showMiningAnimation && (
        <MiningAnimation onClose={handleCloseAnimation} />
      )}
      
      {/* Ad overlay */}
      {showAdOverlay && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative w-full max-w-lg p-4">
            <AdPlaceholder 
              width="100%" 
              height={isMobile ? "300px" : "400px"} 
              text="Advertisement - Mining will start after this ad" 
              variant="modal" 
            />
            <div className="mt-4 text-center">
              <p className="text-white text-sm mb-2">Mining starting soon...</p>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-pi h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Mining;
