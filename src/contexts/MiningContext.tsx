
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { usePiAuth } from './PiAuthContext';

interface MiningStats {
  difficulty: number;
  circulatingSupply: number;
  totalSupply: number;
  blockReward: number;
  networkHashrate: number;
}

interface MiningContextType {
  ptmBalance: number;
  totalMined: number;
  miningPower: number;
  lastMiningTime: Date | null;
  miningStats: MiningStats;
  startMining: (reward: number) => void;
  claimReward: (amount: number) => void;
  updateMiningPower: (newPower: number) => void;
}

const MiningContext = createContext<MiningContextType>({
  ptmBalance: 0,
  totalMined: 0,
  miningPower: 1,
  lastMiningTime: null,
  miningStats: {
    difficulty: 1,
    circulatingSupply: 0,
    totalSupply: 1000000,
    blockReward: 0.01,
    networkHashrate: 1000
  },
  startMining: () => {},
  claimReward: () => {},
  updateMiningPower: () => {}
});

export const useMining = () => useContext(MiningContext);

export const MiningProvider = ({ children }: { children: ReactNode }) => {
  const { user } = usePiAuth();
  const [ptmBalance, setPtmBalance] = useState(0);
  const [totalMined, setTotalMined] = useState(0);
  const [miningPower, setMiningPower] = useState(1);
  const [lastMiningTime, setLastMiningTime] = useState<Date | null>(null);
  const [miningStats, setMiningStats] = useState<MiningStats>({
    difficulty: 1.25,
    circulatingSupply: 285467,
    totalSupply: 1000000,
    blockReward: 0.01,
    networkHashrate: 12453
  });
  
  // Load mining data from localStorage when user changes
  useEffect(() => {
    if (user) {
      // Load PTM balance
      const savedBalance = localStorage.getItem(`ptm_balance_${user.uid}`);
      if (savedBalance) {
        setPtmBalance(Number(savedBalance));
      }
      
      // Load total mined
      const savedTotalMined = localStorage.getItem(`ptm_total_mined_${user.uid}`);
      if (savedTotalMined) {
        setTotalMined(Number(savedTotalMined));
      }
      
      // Load mining power
      const savedMiningPower = localStorage.getItem(`ptm_mining_power_${user.uid}`);
      if (savedMiningPower) {
        setMiningPower(Number(savedMiningPower));
      }
      
      // Load last mining time
      const savedLastMiningTime = localStorage.getItem(`ptm_last_mining_${user.uid}`);
      if (savedLastMiningTime) {
        setLastMiningTime(new Date(savedLastMiningTime));
      }
    } else {
      // Reset when user logs out
      setPtmBalance(0);
      setTotalMined(0);
      setMiningPower(1);
      setLastMiningTime(null);
    }
  }, [user]);
  
  // Update mining stats periodically for realism
  useEffect(() => {
    const interval = setInterval(() => {
      setMiningStats(prev => {
        // Small random change in difficulty
        const diffChange = (Math.random() * 0.02) - 0.01;
        // Small increase in circulating supply
        const supplyChange = Math.floor(Math.random() * 10);
        
        return {
          ...prev,
          difficulty: Math.max(0.5, prev.difficulty + diffChange),
          circulatingSupply: prev.circulatingSupply + supplyChange,
          networkHashrate: prev.networkHashrate + (Math.random() * 50) - 25
        };
      });
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  const startMining = (reward: number) => {
    if (!user) return;
    
    // Update balance and stats
    const newBalance = ptmBalance + reward;
    const newTotal = totalMined + reward;
    
    setPtmBalance(newBalance);
    setTotalMined(newTotal);
    setLastMiningTime(new Date());
    
    // Save to localStorage
    localStorage.setItem(`ptm_balance_${user.uid}`, newBalance.toString());
    localStorage.setItem(`ptm_total_mined_${user.uid}`, newTotal.toString());
    localStorage.setItem(`ptm_last_mining_${user.uid}`, new Date().toISOString());
    
    // Update network stats
    setMiningStats(prev => ({
      ...prev,
      circulatingSupply: prev.circulatingSupply + reward,
      difficulty: prev.difficulty + 0.005 // Slight increase in difficulty
    }));
  };
  
  const claimReward = (amount: number) => {
    if (!user) return;
    
    // Update balance
    const newBalance = ptmBalance + amount;
    setPtmBalance(newBalance);
    
    // Save to localStorage
    localStorage.setItem(`ptm_balance_${user.uid}`, newBalance.toString());
    
    // Update network stats
    setMiningStats(prev => ({
      ...prev,
      circulatingSupply: prev.circulatingSupply + amount
    }));
  };
  
  const updateMiningPower = (newPower: number) => {
    if (!user) return;
    
    setMiningPower(newPower);
    localStorage.setItem(`ptm_mining_power_${user.uid}`, newPower.toString());
  };
  
  return (
    <MiningContext.Provider
      value={{
        ptmBalance,
        totalMined,
        miningPower,
        lastMiningTime,
        miningStats,
        startMining,
        claimReward,
        updateMiningPower
      }}
    >
      {children}
    </MiningContext.Provider>
  );
};
