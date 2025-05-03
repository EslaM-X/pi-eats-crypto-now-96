
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useMining } from '@/contexts/MiningContext';
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

const Mining = () => {
  const { theme } = useTheme();
  const { startMining, canMine, timeUntilNextMining, isOnCooldown } = useMining();
  const [isMining, setIsMining] = useState(false);
  const [showMiningAnimation, setShowMiningAnimation] = useState(false);
  const [showAdOverlay, setShowAdOverlay] = useState(false);
  
  const handleStartMining = () => {
    if (!canMine) {
      toast.error(`Mining on cooldown. Available in ${Math.ceil(timeUntilNextMining / 1000)} seconds.`);
      return;
    }
    
    setIsMining(true);
    
    // Simulate ad display (in a real app, we would show a real ad)
    setShowAdOverlay(true);
    
    // After 3 seconds, hide ad and show mining animation
    setTimeout(() => {
      setShowAdOverlay(false);
      setShowMiningAnimation(true);
      
      // After animation finishes, mining is complete
      setTimeout(() => {
        startMining(0.05); // Actually update mining state and rewards with default value
        setIsMining(false);
        setShowMiningAnimation(false);
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
      
      <Container className="py-8">
        <h1 className="text-3xl font-bold mb-6">Mine PTM Tokens</h1>
        
        <MiningHeader 
          onStartMining={handleStartMining} 
          isMining={isMining || isOnCooldown} 
        />
        
        <MiningStats />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <MiningRewards />
            <MiningActivity />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Sponsored</h2>
            <AdPlaceholder width="100%" height="600px" variant="vertical" />
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
          <div className="relative w-full max-w-lg">
            <AdPlaceholder width="100%" height="400px" text="Advertisement - Mining will start after this ad" variant="modal" />
          </div>
        </div>
      )}
    </>
  );
};

export default Mining;
