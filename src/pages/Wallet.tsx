
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWallet } from '@/contexts/WalletContext';
import { usePiPrice } from '@/contexts/PiPriceContext';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { ArrowRightLeft, SendHorizontal, Wallet as WalletIcon, PlusCircle, ExternalLink, History, DollarSign } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PiPriceIndicator } from '@/components/PiPriceIndicator';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// Custom PiEat logo component
const PiEatLogo = () => (
  <div className="relative inline-flex items-center justify-center">
    <div className="text-2xl font-bold">π</div>
    <div className="absolute -top-2 -right-2 text-xs bg-orange text-white rounded-full h-4 w-4 flex items-center justify-center">
      🍕
    </div>
  </div>
);

// Component to display balance in multiple currencies
const CurrencyValue = ({ amount, symbol }: { amount: number; symbol: string }) => (
  <div className="ml-2 text-sm text-muted-foreground">
    {symbol} {amount.toFixed(2)}
  </div>
);

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('nav.wallet')}</h1>
          <p className="text-muted-foreground">
            {t('wallet.manage')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pi Network Wallet */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('wallet.piNetwork')}</span>
                <div className="h-8 w-8">
                  <img 
                    src="/lovable-uploads/a8326833-2525-4059-956f-569750fb1bc4.png" 
                    alt="Pi Network" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">{t('wallet.balance')}</div>
                  <div className="text-4xl font-bold flex items-center">
                    <span className="mr-1">π</span>
                    {user ? balance.toFixed(2) : '--.--'}
                  </div>
                  
                  {/* Currency conversions */}
                  {user && balance > 0 && (
                    <div className="flex flex-col mt-1">
                      <div className="flex items-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-1" />
                              <span className="text-sm text-muted-foreground">
                                ${convertPiToUsd(balance).toFixed(2)} USD
                              </span>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>US Dollar value</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="flex items-center mt-0.5">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex items-center">
                              <span className="text-xs mr-1">£E</span>
                              <span className="text-sm text-muted-foreground">
                                {convertPiToEgp(balance).toFixed(2)} EGP
                              </span>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Egyptian Pound value</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-2">
                    <PiPriceIndicator showDetails={true} />
                  </div>
                </div>
                
                {!user && (
                  <Button 
                    onClick={login}
                    className="mt-4 lg:mt-0 button-gradient"
                  >
                    {t('auth.connectWithPi')}
                  </Button>
                )}
              </div>
              
              {user && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="outline" className="flex items-center" onClick={openPiBrowser}>
                    <WalletIcon className="mr-2 h-4 w-4" />
                    {t('wallet.connect')}
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <SendHorizontal className="mr-2 h-4 w-4" />
                    {t('wallet.send')}
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <ArrowRightLeft className="mr-2 h-4 w-4" />
                    {t('wallet.transactions')}
                  </Button>
                  <Button variant="default" className="button-gradient" onClick={handleTopUp}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t('wallet.topUp')}
                  </Button>
                </div>
              )}
              
              <div className="mt-6">
                <Button variant="ghost" size="sm" className="text-xs flex items-center" onClick={visitPiNet}>
                  <ExternalLink className="mr-1 h-3 w-3" />
                  Visit PiNet.com
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* PiEat Wallet */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('wallet.piEat')}</span>
                <PiEatLogo />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="text-sm text-muted-foreground mb-1">{t('wallet.balance')}</div>
                <div className="text-4xl font-bold flex items-center">
                  <PiEatLogo />
                  <span className="ml-2">{user ? piEatBalance.toFixed(2) : '--.--'}</span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  ≈ π {(piEatBalance * 0.5).toFixed(2)} ({t('wallet.estimatedValue')})
                </div>
                
                {/* PiEat currency conversions */}
                {user && (
                  <div className="flex flex-col mt-2">
                    <div className="flex items-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1" />
                            <span className="text-sm text-muted-foreground">
                              ${convertPiToUsd(piEatBalance * 0.5).toFixed(2)} USD
                            </span>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>US Dollar value</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="flex items-center mt-0.5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="flex items-center">
                            <span className="text-xs mr-1">£E</span>
                            <span className="text-sm text-muted-foreground">
                              {convertPiToEgp(piEatBalance * 0.5).toFixed(2)} EGP
                            </span>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Egyptian Pound value</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                )}
              </div>
              
              {user ? (
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
              ) : (
                <Button 
                  onClick={login}
                  className="w-full button-gradient"
                >
                  {t('auth.connectWithPi')}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Transaction History */}
        {user && transactions.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">{t('wallet.recentTransactions')}</h2>
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-6 py-3 text-left text-sm font-medium">{t('wallet.type')}</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">{t('wallet.amount')}</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">{t('wallet.description')}</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">{t('wallet.status')}</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">USD/EGP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`capitalize ${
                            tx.type === 'receive' ? 'text-green-500' : 
                            tx.type === 'send' ? 'text-orange' : ''
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium">
                            {tx.type === 'receive' || tx.type === 'reward' ? '+' : '-'} π {tx.amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4">{tx.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                            tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                          <div>${convertPiToUsd(tx.amount).toFixed(2)}</div>
                          <div>£E{convertPiToEgp(tx.amount).toFixed(2)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Wallet;
