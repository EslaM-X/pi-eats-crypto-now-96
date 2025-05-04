
import { useState, useEffect } from 'react';
import { MiningState, initialMiningState } from './MiningTypes';
import { loadMiningDataFromLocalStorage, updateCooldownStatus } from './MiningUtils';
import { usePiAuth } from '../PiAuthContext';

export const useMiningState = () => {
  const { user } = usePiAuth();
  const [state, setState] = useState<MiningState>(initialMiningState);
  
  // Load mining data from localStorage when user changes
  useEffect(() => {
    if (user) {
      const userData = loadMiningDataFromLocalStorage(user.uid);
      setState(prev => ({
        ...prev,
        ...userData
      }));
    } else {
      // Reset when user logs out
      setState(initialMiningState);
    }
  }, [user]);
  
  // Update cooldown timer
  useEffect(() => {
    if (!state.lastMiningTime) return;
    
    const interval = setInterval(() => {
      const { timeUntilNextMining, isOnCooldown } = updateCooldownStatus(state.lastMiningTime);
      
      setState(prev => ({
        ...prev,
        timeUntilNextMining,
        isOnCooldown
      }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [state.lastMiningTime]);
  
  // Update mining stats periodically for realism
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        // Small random change in difficulty
        const diffChange = (Math.random() * 0.02) - 0.01;
        // Small increase in circulating supply
        const supplyChange = Math.floor(Math.random() * 10);
        
        return {
          ...prev,
          miningStats: {
            ...prev.miningStats,
            difficulty: Math.max(0.5, prev.miningStats.difficulty + diffChange),
            circulatingSupply: prev.miningStats.circulatingSupply + supplyChange,
            networkHashrate: prev.miningStats.networkHashrate + (Math.random() * 50) - 25
          }
        };
      });
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  return {
    state,
    setState
  };
};
