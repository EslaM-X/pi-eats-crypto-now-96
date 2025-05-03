
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, ChevronRight, Award } from 'lucide-react';
import { toast } from 'sonner';
import { useMining } from '@/contexts/MiningContext';

interface Reward {
  id: string;
  title: string;
  description: string;
  amount: number;
  image: string;
}

const MiningRewards = () => {
  const { claimReward } = useMining();
  
  // Daily rewards that can be claimed
  const [dailyRewards] = useState<Reward[]>([
    {
      id: 'daily-1',
      title: 'Daily Login',
      description: 'Claim your daily PTM reward',
      amount: 0.01,
      image: '/lovable-uploads/a8326833-2525-4059-956f-569750fb1bc4.png',
    },
    {
      id: 'daily-2',
      title: 'First Order Bonus',
      description: 'Place your first order today',
      amount: 0.05,
      image: '/lovable-uploads/a8326833-2525-4059-956f-569750fb1bc4.png',
    }
  ]);

  // Track claimed rewards
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);

  const handleClaimReward = (reward: Reward) => {
    if (claimedRewards.includes(reward.id)) {
      toast.error('You have already claimed this reward');
      return;
    }
    
    claimReward(reward.amount);
    setClaimedRewards(prev => [...prev, reward.id]);
    toast.success(`Claimed ${reward.amount} PTM!`);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Gift className="mr-2 h-5 w-5" />
        Daily Rewards
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {dailyRewards.map((reward) => (
          <Card key={reward.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Award className="h-4 w-4 mr-2 text-orange" />
                {reward.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-2">
                <img src={reward.image} alt={reward.title} className="h-12 w-12 rounded-full mr-4" />
                <div>
                  <p className="text-sm text-muted-foreground">{reward.description}</p>
                  <p className="text-xl font-bold mt-1">
                    <span className="text-xl">ꟼ</span> {reward.amount.toFixed(3)}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={claimedRewards.includes(reward.id) ? "outline" : "default"}
                onClick={() => handleClaimReward(reward)}
                disabled={claimedRewards.includes(reward.id)}
              >
                {claimedRewards.includes(reward.id) ? 'Claimed' : 'Claim Reward'}
                {!claimedRewards.includes(reward.id) && <ChevronRight className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MiningRewards;
