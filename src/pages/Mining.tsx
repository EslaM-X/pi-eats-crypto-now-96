
import React, { useState } from 'react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import { Container } from '@/components/ui/container';
import { useMining } from '@/contexts/MiningContext';
import { usePiAuth } from '@/contexts/PiAuthContext';

// Import refactored components
import MiningHeader from '@/components/mining/MiningHeader';
import MiningStats from '@/components/mining/MiningStats';
import MiningRewards from '@/components/mining/MiningRewards';
import MiningActivity from '@/components/mining/MiningActivity';

const Mining = () => {
  const { user } = usePiAuth();
  const { startMining } = useMining();
  const [isMining, setIsMining] = useState(false);
  
  const handleStartMining = async () => {
    if (!user) {
      toast.error('Please connect with Pi Network to start mining');
      return;
    }
    
    setIsMining(true);
    try {
      const success = await startMining();
      if (success) {
        toast.success('Mining complete! PTM tokens added to your balance.');
      } else {
        toast.error('Mining failed. Please try again.');
      }
    } catch (error) {
      console.error('Mining error:', error);
      toast.error('An unexpected error occurred while mining.');
    } finally {
      setIsMining(false);
    }
  };
  
  return (
    <div>
      <Header />
      <Container className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">PTM Mining</h1>
        </div>
        
        {!user ? (
          <div className="text-center p-10">
            <h2 className="text-xl font-semibold mb-4">Connect with Pi Network to Start Mining</h2>
            <p className="text-muted-foreground mb-4">
              You need to connect your Pi Network account to start mining PTM tokens.
            </p>
          </div>
        ) : (
          <div>
            {/* Mining Header with Balance and Mining Button */}
            <MiningHeader onStartMining={handleStartMining} isMining={isMining} />
            
            {/* Mining Stats Section */}
            <MiningStats />
            
            {/* Daily Rewards Section */}
            <MiningRewards />
            
            {/* Recent Activity Section */}
            <MiningActivity />
          </div>
        )}
      </Container>
    </div>
  );
};

export default Mining;
