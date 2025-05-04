
export interface MiningStats {
  difficulty: number;
  circulatingSupply: number;
  totalSupply: number;
  blockReward: number;
  networkHashrate: number;
}

export interface MiningState {
  ptmBalance: number;
  totalMined: number;
  miningPower: number;
  lastMiningTime: Date | null;
  timeUntilNextMining: number;
  isOnCooldown: boolean;
  miningStats: MiningStats;
}

export interface MiningContextType extends MiningState {
  startMining: (reward?: number) => void;
  claimReward: (amount: number) => void;
  updateMiningPower: (newPower: number) => void;
  canMine: boolean;
}

export const COOLDOWN_PERIOD = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const DEFAULT_MINING_STATS: MiningStats = {
  difficulty: 1.25,
  circulatingSupply: 285467,
  totalSupply: 1000000,
  blockReward: 0.01,
  networkHashrate: 12453
};

export const initialMiningState: MiningState = {
  ptmBalance: 0,
  totalMined: 0,
  miningPower: 1,
  lastMiningTime: null,
  timeUntilNextMining: 0,
  isOnCooldown: false,
  miningStats: DEFAULT_MINING_STATS,
};
