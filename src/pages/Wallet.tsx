
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWallet } from '@/contexts/WalletContext';
import { usePiPrice } from '@/contexts/PiPriceContext';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { SendHorizontal, History, PlusCircle, ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import WalletCard from '@/components/WalletCard';
import TransactionHistory from '@/components/TransactionHistory';
import PiEatLogo from '@/components/PiEatLogo';

const Wallet = () => {
  const { t } = useLanguage();
  const { balance, transactions, addTransaction } = useWallet();
  const { user, login, openPiPayment } = usePiAuth();
  const { convertPiToUsd, convertPiToEgp } = usePiPrice();
  
  // Mock PiEat balance
  const piEatBalance = 25.0;
  
  // Function to open Pi Browser
  const openPiBrowser = () => {
    window.open('https://browser.minepi.com', '_blank');
    toast.info('Opening Pi Browser...');
  };
  
  // Function to visit PiEat website
  const visitPiEatSite = () => {
    window.open('https://pieat.me', '_blank');
    toast.info('Visiting Pieat-Me...');
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

  // Function to simulate sending Pi
  const handleSendPi = () => {
    if (user) {
      toast.info('Send Pi feature coming soon!');
    } else {
      login();
    }
  };

  // Function to view transaction history
  const viewTransactionHistory = () => {
    const element = document.getElementById('transaction-history');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Function to handle Pi payment
  const handlePiPayment = async () => {
    if (user) {
      const success = await openPiPayment(1.0, 'Testing Pi payment');
      if (success) {
        toast.success('Payment successful!');
      }
    } else {
      login();
    }
  };

  // Custom actions for PiEat wallet
  const piEatActions = (
    <div className="grid grid-cols-3 gap-2">
      <Button 
        variant="outline" 
        className="flex items-center justify-center text-xs md:text-sm"
        onClick={handleSendPi}
      >
        <SendHorizontal className="mr-1 h-3 w-3 md:h-4 md:w-4" />
        {t('wallet.send')}
      </Button>
      <Button 
        variant="outline" 
        className="flex items-center justify-center text-xs md:text-sm"
        onClick={viewTransactionHistory}
      >
        <History className="mr-1 h-3 w-3 md:h-4 md:w-4" />
        {t('wallet.history')}
      </Button>
      <Button 
        variant="default" 
        className="button-gradient text-xs md:text-sm"
        onClick={handlePiPayment}
      >
        <PlusCircle className="mr-1 h-3 w-3 md:h-4 md:w-4" />
        {t('wallet.earn')}
      </Button>
    </div>
  );

  // Custom actions for Pi Network wallet
  const piNetworkActions = (
    <div className="grid grid-cols-3 gap-2">
      <Button 
        variant="outline" 
        className="flex items-center justify-center text-xs md:text-sm"
        onClick={handleSendPi}
      >
        <SendHorizontal className="mr-1 h-3 w-3 md:h-4 md:w-4" />
        {t('wallet.send')}
      </Button>
      <Button 
        variant="outline" 
        className="flex items-center justify-center text-xs md:text-sm"
        onClick={viewTransactionHistory}
      >
        <History className="mr-1 h-3 w-3 md:h-4 md:w-4" />
        {t('wallet.history')}
      </Button>
      <Button 
        variant="default" 
        className="button-gradient text-xs md:text-sm"
        onClick={handleTopUp}
      >
        <PlusCircle className="mr-1 h-3 w-3 md:h-4 md:w-4" />
        {t('wallet.topUp')}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4 text-center md:text-left bg-gradient-to-r from-pi to-orange bg-clip-text text-transparent">
            {t('nav.wallet')}
          </h1>
          <p className="text-muted-foreground text-center md:text-left text-sm md:text-base">
            {t('wallet.manage')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Pi Network Wallet */}
          <WalletCard
            title={t('wallet.piNetwork')}
            icon={<div className="text-6xl font-bold">π</div>}
            balance={balance}
            isUser={!!user}
            isPi={true}
            usdValue={user ? convertPiToUsd(balance) : undefined}
            egpValue={user ? convertPiToEgp(balance) : undefined}
            onConnect={login}
            onTopUp={handleTopUp}
            onExternal={openPiBrowser}
            customActions={user ? piNetworkActions : undefined}
          />
          
          {/* PiEat Wallet - Updated with the new design */}
          <WalletCard
            title="Pieat-Me Balance"
            icon={<PiEatLogo size="lg" />}
            balance={piEatBalance}
            isUser={!!user}
            estimatedValue={`π ${(piEatBalance * 0.5).toFixed(2)} (${t('wallet.estimatedValue')})`}
            usdValue={user ? convertPiToUsd(piEatBalance * 0.5) : undefined}
            egpValue={user ? convertPiToEgp(piEatBalance * 0.5) : undefined}
            onConnect={login}
            onExternal={visitPiEatSite}
            customActions={user ? piEatActions : undefined}
          />
        </div>
        
        {/* Transaction History */}
        {user && (
          <div id="transaction-history" className="mt-8 md:mt-12 bg-card rounded-xl p-4 md:p-6 shadow-md">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-pi to-orange bg-clip-text text-transparent">
              {t('wallet.transactions')}
            </h2>
            <div className="overflow-x-auto">
              <TransactionHistory transactions={transactions} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Wallet;
