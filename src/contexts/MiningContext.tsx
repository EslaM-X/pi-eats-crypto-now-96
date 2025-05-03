
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { usePiAuth } from './PiAuthContext';

type MiningContextType = {
  ptmBalance: number;
  miningPower: number;
  isCurrentlyMining: boolean;
  lastMiningTime: Date | null;
  totalMined: number;
  startMining: () => Promise<boolean>;
  claimReward: (amount: number) => void;
  miningStats: {
    totalSupply: number;
    maxSupply: number;
    circulatingSupply: number;
    difficulty: number;
  };
};

const MiningContext = createContext<MiningContextType>({
  ptmBalance: 0,
  miningPower: 1,
  isCurrentlyMining: false,
  lastMiningTime: null,
  totalMined: 0,
  startMining: async () => false,
  claimReward: () => {},
  miningStats: {
    totalSupply: 20000000, // 20 million total supply
    maxSupply: 20000000,
    circulatingSupply: 5000000,
    difficulty: 1.0,
  },
});

export const useMining = () => useContext(MiningContext);

export const MiningProvider = ({ children }: { children: ReactNode }) => {
  const { user } = usePiAuth();
  const [ptmBalance, setPtmBalance] = useState(0);
  const [miningPower, setMiningPower] = useState(1);
  const [isCurrentlyMining, setIsCurrentlyMining] = useState(false);
  const [lastMiningTime, setLastMiningTime] = useState<Date | null>(null);
  const [totalMined, setTotalMined] = useState(0);
  const [miningStats, setMiningStats] = useState({
    totalSupply: 20000000, // 20 million total supply
    maxSupply: 20000000,
    circulatingSupply: 5000000,
    difficulty: 1.0,
  });

  // Load saved mining data from localStorage
  useEffect(() => {
    if (user) {
      const savedPtmBalance = localStorage.getItem(`ptm_balance_${user.uid}`);
      const savedMiningPower = localStorage.getItem(`mining_power_${user.uid}`);
      const savedTotalMined = localStorage.getItem(`total_mined_${user.uid}`);
      const savedLastMiningTime = localStorage.getItem(`last_mining_${user.uid}`);
      
      if (savedPtmBalance) {
        setPtmBalance(parseFloat(savedPtmBalance));
      } else {
        // Initialize with a small amount of PTM for testing
        const initialPtm = Math.random() * 10;
        setPtmBalance(initialPtm);
        localStorage.setItem(`ptm_balance_${user.uid}`, initialPtm.toString());
      }
      
      if (savedMiningPower) {
        setMiningPower(parseFloat(savedMiningPower));
      }
      
      if (savedTotalMined) {
        setTotalMined(parseFloat(savedTotalMined));
      }
      
      if (savedLastMiningTime) {
        setLastMiningTime(new Date(savedLastMiningTime));
      }
    }
  }, [user]);

  // Save mining data to localStorage
  const saveMiningData = () => {
    if (!user) return;
    
    localStorage.setItem(`ptm_balance_${user.uid}`, ptmBalance.toString());
    localStorage.setItem(`mining_power_${user.uid}`, miningPower.toString());
    localStorage.setItem(`total_mined_${user.uid}`, totalMined.toString());
    if (lastMiningTime) {
      localStorage.setItem(`last_mining_${user.uid}`, lastMiningTime.toISOString());
    }
  };

  // Effect to save data whenever it changes
  useEffect(() => {
    saveMiningData();
  }, [ptmBalance, miningPower, totalMined, lastMiningTime, user]);

  // Start mining function - simulates mining process
  const startMining = async (): Promise<boolean> => {
    if (!user) {
      toast.error('Please connect with Pi Network to start mining');
      return false;
    }
    
    if (isCurrentlyMining) {
      toast.error('Mining already in progress');
      return false;
    }
    
    // Check if enough time has passed since last mining (e.g., 1 minute cooldown)
    if (lastMiningTime) {
      const now = new Date();
      const diffMinutes = (now.getTime() - lastMiningTime.getTime()) / (1000 * 60);
      
      if (diffMinutes < 1) {
        toast.error(`Mining cooldown active. Please wait ${Math.ceil(60 - diffMinutes * 60)} seconds`);
        return false;
      }
    }
    
    setIsCurrentlyMining(true);
    toast.info('Mining started...');
    
    try {
      // Simulate mining process
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Calculate mining reward based on mining power and difficulty
      const baseReward = 0.05; // Base PTM reward per mining session
      const reward = baseReward * miningPower / miningStats.difficulty;
      
      // Update balances
      const newPtmBalance = ptmBalance + reward;
      const newTotalMined = totalMined + reward;
      
      setPtmBalance(newPtmBalance);
      setTotalMined(newTotalMined);
      setLastMiningTime(new Date());
      
      // Update mining stats
      setMiningStats(prev => ({
        ...prev,
        circulatingSupply: Math.min(prev.circulatingSupply + reward, prev.totalSupply),
        // Increase difficulty slightly as more is mined
        difficulty: prev.difficulty * (1 + (reward / 10000000)),
      }));
      
      toast.success(`Successfully mined ${reward.toFixed(4)} PTM!`);
      return true;
    } catch (error) {
      console.error('Mining error', error);
      toast.error('Mining failed. Please try again.');
      return false;
    } finally {
      setIsCurrentlyMining(false);
    }
  };

  // Function to claim mining rewards
  const claimReward = (amount: number) => {
    if (!user) {
      toast.error('Please connect with Pi Network to claim rewards');
      return;
    }
    
    if (amount <= 0) {
      toast.error('Invalid reward amount');
      return;
    }
    
    // Update balance
    const newBalance = ptmBalance + amount;
    setPtmBalance(newBalance);
    
    // Update total mined
    const newTotalMined = totalMined + amount;
    setTotalMined(newTotalMined);
    
    // Update last mining time
    setLastMiningTime(new Date());
    
    toast.success(`Claimed ${amount.toFixed(4)} PTM`);
  };

  return (
    <MiningContext.Provider
      value={{
        ptmBalance,
        miningPower,
        isCurrentlyMining,
        lastMiningTime,
        totalMined,
        startMining,
        claimReward,
        miningStats,
      }}
    >
      {children}
    </MiningContext.Provider>
  );
};
