import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRewards } from '@/contexts/RewardsContext';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { GiftIcon, Trophy, Star, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import PiEatLogo from '@/components/PiEatLogo';

// We'll use our improved PiEatLogo component instead of this custom component
// const PiEatLogo = () => (...); // Remove this custom component

const Rewards = () => {
  const { t } = useLanguage();
  const { points, availableRewards, redeemReward } = useRewards();
  const { user, login } = usePiAuth();

  const handleRedeem = async (rewardId: string, pointsCost: number) => {
    if (!user) {
      login();
      return;
    }
    
    if (points < pointsCost) {
      toast.error(t('rewards.notEnoughPoints'));
      return;
    }
    
    const success = await redeemReward(rewardId);
    if (success) {
      toast.success(t('rewards.redeemSuccess'));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('nav.rewards')}</h1>
          <p className="text-muted-foreground">
            {t('rewards.description')}
          </p>
        </div>
        
        {/* Points Overview */}
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center">
              <div className="bg-pi/10 p-4 rounded-full mr-4">
                <PiEatLogo size="md" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{t('rewards.piEat')}</h2>
                <p className="text-muted-foreground">{t('rewards.earnWithPiEat')}</p>
              </div>
            </div>
            
            <div className="text-center lg:text-right">
              <div className="text-sm text-muted-foreground mb-1">{t('rewards.yourPoints')}</div>
              <div className="text-4xl font-bold flex items-center">
                <Star className="h-6 w-6 text-orange fill-orange mr-2" />
                {user ? points : '-'}
              </div>
              
              {!user && (
                <Button 
                  onClick={login}
                  className="mt-3 button-gradient"
                  size="sm"
                >
                  {t('auth.connectWithPi')}
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Rewards Tiers */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Trophy className="mr-2 h-5 w-5" />
            {t('rewards.tiers')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-transparent bg-gradient-to-br from-[#CD7F32]/10 to-[#CD7F32]/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  🥉 {t('rewards.bronze')}
                </CardTitle>
                <CardDescription>{t('rewards.pointsNeeded')}: 100</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={user ? Math.min(points / 100 * 100, 100) : 0} className="mb-2" />
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-[#CD7F32]" />
                    {t('rewards.tier.discount')} 5%
                  </li>
                  <li className="flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-[#CD7F32]" />
                    {t('rewards.tier.points')} 1x
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-transparent bg-gradient-to-br from-[#C0C0C0]/10 to-[#C0C0C0]/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  🥈 {t('rewards.silver')}
                </CardTitle>
                <CardDescription>{t('rewards.pointsNeeded')}: 500</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={user ? Math.min(points / 500 * 100, 100) : 0} className="mb-2" />
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-[#C0C0C0]" />
                    {t('rewards.tier.discount')} 10%
                  </li>
                  <li className="flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-[#C0C0C0]" />
                    {t('rewards.tier.points')} 1.5x
                  </li>
                  <li className="flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-[#C0C0C0]" />
                    {t('rewards.tier.freeDelivery')} 1/week
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-transparent bg-gradient-to-br from-[#FFD700]/10 to-[#FFD700]/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  🥇 {t('rewards.gold')}
                </CardTitle>
                <CardDescription>{t('rewards.pointsNeeded')}: 1000</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={user ? Math.min(points / 1000 * 100, 100) : 0} className="mb-2" />
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-[#FFD700]" />
                    {t('rewards.tier.discount')} 15%
                  </li>
                  <li className="flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-[#FFD700]" />
                    {t('rewards.tier.points')} 2x
                  </li>
                  <li className="flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-[#FFD700]" />
                    {t('rewards.tier.freeDelivery')} 3/week
                  </li>
                  <li className="flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-[#FFD700]" />
                    {t('rewards.tier.exclusiveOffers')}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Available Rewards */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <GiftIcon className="mr-2 h-5 w-5" />
            {t('rewards.available')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {availableRewards.map((reward) => (
              <Card key={reward.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{reward.title}</CardTitle>
                  <CardDescription>{reward.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-orange fill-orange mr-1" />
                      <span className="font-medium">{reward.pointsCost} {t('rewards.points')}</span>
                    </div>
                    <div className="flex items-center">
                      <PiEatLogo />
                      <span className="ml-1">{reward.piValue}</span>
                    </div>
                  </div>
                  
                  <Progress value={user ? Math.min(points / reward.pointsCost * 100, 100) : 0} />
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleRedeem(reward.id, reward.pointsCost)} 
                    className="w-full"
                    variant={points >= reward.pointsCost ? "default" : "outline"}
                    disabled={!user || points < reward.pointsCost}
                  >
                    {t('rewards.redeem')}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Rewards;
