
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWallet } from '@/contexts/WalletContext';
import { usePiPrice } from '@/contexts/PiPriceContext';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { SendHorizontal, History, PlusCircle } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import WalletCard from '@/components/WalletCard';
import TransactionHistory from '@/components/TransactionHistory';
import PiEatLogo from '@/components/PiEatLogo';

const Wallet = () => {
  const { t } = useLanguage();
  const { balance, transactions, addTransaction } = useWallet();
  const { user, login } = usePiAuth();
  const { convertPiToUsd, convertPiToEgp } = usePiPrice();
  
  // Mock PiEat balance
  const piEatBalance = 25.0;
  
  // Function to open Pi Browser
  const openPiBrowser = () => {
    window.open('https://browser.minepi.com', '_blank');
    toast.info('Opening Pi Browser...');
  };
  
  // Function to visit PiNet
  const visitPiNet = () => {
    window.open('https://www.pinet.com', '_blank');
    toast.info('Visiting PiNet...');
  };
  
  // Function to simulate top up
  const handleTopUp = () => {
    if (user) {
      addTransaction({
        type: 'receive',
        amount: 5.0,
        description: 'Top up from test wallet',
        status: 'completed',
      });
      toast.success('Successfully topped up 5 Pi');
    } else {
      login();
    }
  };

  // Custom actions for PiEat wallet
  const piEatActions = (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      <Button variant="outline" className="flex items-center">
        <SendHorizontal className="mr-2 h-4 w-4" />
        {t('wallet.send')}
      </Button>
      <Button variant="outline" className="flex items-center">
        <History className="mr-2 h-4 w-4" />
        {t('wallet.history')}
      </Button>
      <Button variant="default" className="button-gradient">
        <PlusCircle className="mr-2 h-4 w-4" />
        {t('wallet.earn')}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-center md:text-left bg-gradient-to-r from-pi to-orange bg-clip-text text-transparent">
            {t('nav.wallet')}
          </h1>
          <p className="text-muted-foreground text-center md:text-left">
            {t('wallet.manage')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pi Network Wallet */}
          <WalletCard
            title={t('wallet.piNetwork')}
            icon={
              <div className="h-20 w-20 mb-4">
                <img 
                  src="/lovable-uploads/0934d5ff-e502-465e-8d11-84ba98dcb488.png" 
                  alt="Pi Network" 
                  className="w-full h-full object-contain"
                />
              </div>
            }
            balance={balance}
            isUser={!!user}
            isPi={true}
            usdValue={user ? convertPiToUsd(balance) : undefined}
            egpValue={user ? convertPiToEgp(balance) : undefined}
            onConnect={login}
            onTopUp={handleTopUp}
            onExternal={visitPiNet}
          />
          
          {/* PiEat Wallet */}
          <WalletCard
            title={t('wallet.piEat')}
            icon={<div className="mb-4"><PiEatLogo /></div>}
            balance={piEatBalance}
            isUser={!!user}
            estimatedValue={`π ${(piEatBalance * 0.5).toFixed(2)} (${t('wallet.estimatedValue')})`}
            usdValue={user ? convertPiToUsd(piEatBalance * 0.5) : undefined}
            egpValue={user ? convertPiToEgp(piEatBalance * 0.5) : undefined}
            onConnect={login}
            customActions={user ? piEatActions : undefined}
          />
        </div>
        
        {/* Transaction History */}
        {user && (
          <div className="mt-12 bg-card rounded-xl p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-pi to-orange bg-clip-text text-transparent">
              {t('wallet.transactions')}
            </h2>
            <TransactionHistory transactions={transactions} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Wallet;
