
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
  startMining: (reward?: number) => void;
  claimReward: (amount: number) => void;
  updateMiningPower: (newPower: number) => void;
  canMine: boolean;
  timeUntilNextMining: number;
  isOnCooldown: boolean;
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
  updateMiningPower: () => {},
  canMine: true,
  timeUntilNextMining: 0,
  isOnCooldown: false
});

export const useMining = () => useContext(MiningContext);

export const MiningProvider = ({ children }: { children: ReactNode }) => {
  const { user } = usePiAuth();
  const [ptmBalance, setPtmBalance] = useState(0);
  const [totalMined, setTotalMined] = useState(0);
  const [miningPower, setMiningPower] = useState(1);
  const [lastMiningTime, setLastMiningTime] = useState<Date | null>(null);
  const [timeUntilNextMining, setTimeUntilNextMining] = useState(0);
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [miningStats, setMiningStats] = useState<MiningStats>({
    difficulty: 1.25,
    circulatingSupply: 285467,
    totalSupply: 1000000,
    blockReward: 0.01,
    networkHashrate: 12453
  });
  
  // Calculate if mining is available (60 second cooldown)
  const canMine = !isOnCooldown && (!lastMiningTime || (new Date().getTime() - lastMiningTime.getTime()) > 60000);
  
  // Update cooldown timer
  useEffect(() => {
    if (!lastMiningTime) return;
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const lastTime = lastMiningTime.getTime();
      const difference = now - lastTime;
      
      if (difference < 60000) {
        setTimeUntilNextMining(60000 - difference);
        setIsOnCooldown(true);
      } else {
        setTimeUntilNextMining(0);
        setIsOnCooldown(false);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [lastMiningTime]);
  
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
  
  const startMining = (reward = 0.05) => {
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
        updateMiningPower,
        canMine,
        timeUntilNextMining,
        isOnCooldown
      }}
    >
      {children}
    </MiningContext.Provider>
  );
};
