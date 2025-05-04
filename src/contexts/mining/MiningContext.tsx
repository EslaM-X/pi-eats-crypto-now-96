
import React, { createContext, useContext, ReactNode } from 'react';
import { MiningContextType, initialMiningState } from './MiningTypes';
import { useMiningState } from './useMiningState';
import { checkCanMine, saveMiningData } from './MiningUtils';
import { usePiAuth } from '../PiAuthContext';

// Create the context with default values
const MiningContext = createContext<MiningContextType>({
  ...initialMiningState,
  startMining: () => {},
  claimReward: () => {},
  updateMiningPower: () => {},
  canMine: true
});

export const useMining = () => useContext(MiningContext);

export const MiningProvider = ({ children }: { children: ReactNode }) => {
  const { user } = usePiAuth();
  const { state, setState } = useMiningState();
  
  // Calculate if mining is available (24 hour cooldown)
  const canMine = checkCanMine(state);
  
  const startMining = (reward = 0.05) => {
    if (!user) return;
    
    // Increase reward for daily mining (since it's once per 24 hours)
    const dailyReward = reward * 5; // Increased reward for daily mining
    
    // Update balance and stats
    const newBalance = state.ptmBalance + dailyReward;
    const newTotal = state.totalMined + dailyReward;
    
    setState(prev => ({
      ...prev,
      ptmBalance: newBalance,
      totalMined: newTotal,
      lastMiningTime: new Date()
    }));
    
    // Save to localStorage
    saveMiningData(user.uid, {
      ptmBalance: newBalance,
      totalMined: newTotal,
      lastMiningTime: new Date()
    });
    
    // Update network stats
    setState(prev => ({
      ...prev,
      miningStats: {
        ...prev.miningStats,
        circulatingSupply: prev.miningStats.circulatingSupply + dailyReward,
        difficulty: prev.miningStats.difficulty + 0.005 // Slight increase in difficulty
      }
    }));
  };
  
  const claimReward = (amount: number) => {
    if (!user) return;
    
    // Update balance
    const newBalance = state.ptmBalance + amount;
    setState(prev => ({
      ...prev,
      ptmBalance: newBalance
    }));
    
    // Save to localStorage
    saveMiningData(user.uid, { ptmBalance: newBalance });
    
    // Update network stats
    setState(prev => ({
      ...prev,
      miningStats: {
        ...prev.miningStats,
        circulatingSupply: prev.miningStats.circulatingSupply + amount
      }
    }));
  };
  
  const updateMiningPower = (newPower: number) => {
    if (!user) return;
    
    setState(prev => ({
      ...prev,
      miningPower: newPower
    }));
    
    saveMiningData(user.uid, { miningPower: newPower });
  };
  
  return (
    <MiningContext.Provider
      value={{
        ...state,
        startMining,
        claimReward,
        updateMiningPower,
        canMine
      }}
    >
      {children}
    </MiningContext.Provider>
  );
};
