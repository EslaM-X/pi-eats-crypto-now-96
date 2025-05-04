
import { MiningState, COOLDOWN_PERIOD } from './MiningTypes';

export const checkCanMine = (state: Pick<MiningState, 'isOnCooldown' | 'lastMiningTime'>) => {
  return !state.isOnCooldown && 
    (!state.lastMiningTime || 
     (new Date().getTime() - state.lastMiningTime.getTime()) > COOLDOWN_PERIOD);
};

export const loadMiningDataFromLocalStorage = (userId: string) => {
  // Load PTM balance
  const savedBalance = localStorage.getItem(`ptm_balance_${userId}`);
  const ptmBalance = savedBalance ? Number(savedBalance) : 0;
  
  // Load total mined
  const savedTotalMined = localStorage.getItem(`ptm_total_mined_${userId}`);
  const totalMined = savedTotalMined ? Number(savedTotalMined) : 0;
  
  // Load mining power
  const savedMiningPower = localStorage.getItem(`ptm_mining_power_${userId}`);
  const miningPower = savedMiningPower ? Number(savedMiningPower) : 1;
  
  // Load last mining time
  const savedLastMiningTime = localStorage.getItem(`ptm_last_mining_${userId}`);
  const lastMiningTime = savedLastMiningTime ? new Date(savedLastMiningTime) : null;
  
  return {
    ptmBalance,
    totalMined,
    miningPower,
    lastMiningTime
  };
};

export const updateCooldownStatus = (lastMiningTime: Date | null) => {
  if (!lastMiningTime) {
    return {
      timeUntilNextMining: 0,
      isOnCooldown: false
    };
  }
  
  const now = new Date().getTime();
  const lastTime = lastMiningTime.getTime();
  const difference = now - lastTime;
  
  if (difference < COOLDOWN_PERIOD) {
    return {
      timeUntilNextMining: COOLDOWN_PERIOD - difference,
      isOnCooldown: true
    };
  } else {
    return {
      timeUntilNextMining: 0,
      isOnCooldown: false
    };
  }
};

export const saveMiningData = (userId: string, data: { 
  ptmBalance?: number, 
  totalMined?: number, 
  miningPower?: number, 
  lastMiningTime?: Date 
}) => {
  if (data.ptmBalance !== undefined) {
    localStorage.setItem(`ptm_balance_${userId}`, data.ptmBalance.toString());
  }
  
  if (data.totalMined !== undefined) {
    localStorage.setItem(`ptm_total_mined_${userId}`, data.totalMined.toString());
  }
  
  if (data.miningPower !== undefined) {
    localStorage.setItem(`ptm_mining_power_${userId}`, data.miningPower.toString());
  }
  
  if (data.lastMiningTime !== undefined) {
    localStorage.setItem(`ptm_last_mining_${userId}`, data.lastMiningTime.toISOString());
  }
};
