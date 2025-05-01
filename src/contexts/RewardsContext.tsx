
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { usePiAuth } from './PiAuthContext';
import { useWallet } from './WalletContext';

type Reward = {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  piValue: number;
};

type RewardsContextType = {
  points: number;
  availableRewards: Reward[];
  redeemReward: (rewardId: string) => Promise<boolean>;
  addPoints: (amount: number) => void;
};

const RewardsContext = createContext<RewardsContextType>({
  points: 0,
  availableRewards: [],
  redeemReward: async () => false,
  addPoints: () => {},
});

export const useRewards = () => useContext(RewardsContext);

export const RewardsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = usePiAuth();
  const { addTransaction } = useWallet();
  const [points, setPoints] = useState(0);
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([]);

  useEffect(() => {
    if (user) {
      // Load saved points from localStorage
      const savedPoints = localStorage.getItem(`rewards_points_${user.uid}`);
      if (savedPoints) {
        setPoints(parseInt(savedPoints));
      } else {
        // Start with some points for demo
        setPoints(100);
        localStorage.setItem(`rewards_points_${user.uid}`, '100');
      }

      // Set up available rewards
      const rewards: Reward[] = [
        {
          id: '1',
          title: 'Free Delivery',
          description: 'Get free delivery on your next order',
          pointsCost: 50,
          piValue: 0.25,
        },
        {
          id: '2',
          title: 'Pi Cashback',
          description: 'Get 0.5 Pi directly to your wallet',
          pointsCost: 100,
          piValue: 0.5,
        },
        {
          id: '3',
          title: 'Premium Membership',
          description: '1 month of premium membership with exclusive offers',
          pointsCost: 300,
          piValue: 1.5,
        },
        {
          id: '4',
          title: 'Restaurant Discount',
          description: '20% off on your next order',
          pointsCost: 200,
          piValue: 1.0,
        },
      ];
      setAvailableRewards(rewards);
    }
  }, [user]);

  const savePoints = (newPoints: number) => {
    if (!user) return;
    localStorage.setItem(`rewards_points_${user.uid}`, newPoints.toString());
  };

  const redeemReward = async (rewardId: string): Promise<boolean> => {
    if (!user) return false;
    
    const reward = availableRewards.find(r => r.id === rewardId);
    if (!reward) {
      toast.error('Reward not found');
      return false;
    }
    
    if (points < reward.pointsCost) {
      toast.error('Not enough points');
      return false;
    }
    
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Deduct points
      const newPoints = points - reward.pointsCost;
      setPoints(newPoints);
      savePoints(newPoints);
      
      // Add Pi to wallet if applicable
      if (reward.piValue > 0) {
        addTransaction({
          type: 'reward',
          amount: reward.piValue,
          description: `Reward: ${reward.title}`,
          status: 'completed',
        });
      }
      
      toast.success(`Successfully redeemed: ${reward.title}`);
      return true;
    } catch (error) {
      console.error('Failed to redeem reward', error);
      toast.error('Failed to redeem reward. Please try again.');
      return false;
    }
  };

  const addPoints = (amount: number) => {
    if (!user || amount <= 0) return;
    
    const newPoints = points + amount;
    setPoints(newPoints);
    savePoints(newPoints);
    
    toast.success(`Earned ${amount} reward points!`);
  };

  return (
    <RewardsContext.Provider
      value={{
        points,
        availableRewards,
        redeemReward,
        addPoints,
      }}
    >
      {children}
    </RewardsContext.Provider>
  );
};
