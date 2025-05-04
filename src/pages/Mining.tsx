
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Container } from '@/components/ui/container';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { useMining } from '@/contexts/MiningContext';
import { toast } from 'sonner';
import MiningAnimation from '@/components/mining/MiningAnimation';
import MiningHeader from '@/components/mining/MiningHeader';
import MiningPageHeader from '@/components/mining/MiningPageHeader';
import MiningTabs from '@/components/mining/MiningTabs';
import MiningAdDisplay from '@/components/mining/MiningAdDisplay';
import { useLanguage } from '@/contexts/LanguageContext';

const Mining = () => {
  const { user } = usePiAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('mining');
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  const [showAd, setShowAd] = useState<boolean>(false);
  
  const { 
    ptmBalance, 
    totalMined, 
    canMine, 
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
      toast.error(t('mining.connectWallet'));
      return;
    }
    
    if (!canMine) {
      toast.error(t('mining.cooldown'));
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
    toast.success(`${t('mining.miningSuccess')} ${MINING_REWARD} PTM!`);
  };
  
  // Handle animation complete
  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };
  
  return (
    <>
      <Header />
      <Container className="py-6">
        <MiningPageHeader 
          totalMined={totalMined} 
          formatNumberPrecision={formatNumberPrecision} 
        />
        
        <MiningHeader onStartMining={handleStartMining} isMining={showAnimation} />
        
        <MiningTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleStartMining={handleStartMining}
          showAnimation={showAnimation}
          user={user}
          MINING_REWARD={MINING_REWARD}
          totalMined={totalMined}
        />
        
        {/* Mining Animation */}
        {showAnimation && <MiningAnimation onClose={handleAnimationComplete} />}
        
        {/* Ad Modal */}
        <MiningAdDisplay showAd={showAd} handleAdComplete={handleAdComplete} />
      </Container>
    </>
  );
};

export default Mining;
