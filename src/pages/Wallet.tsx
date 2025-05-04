
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { WalletIcon, Pickaxe, Tally5, RefreshCw, BadgeInfo, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WalletCard from '@/components/WalletCard';
import { PiPriceIndicator } from '@/components/PiPriceIndicator';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { usePiPrice } from '@/contexts/PiPriceContext';
import { useWallet } from '@/contexts/WalletContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import TransactionHistory from '@/components/TransactionHistory';
import CurrencyValue from '@/components/CurrencyValue';
import { Container } from '@/components/ui/container';
import Header from '@/components/Header';

const Wallet = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { user } = usePiAuth();
  const { convertPiToUsd, convertPiToEgp } = usePiPrice();
  const { balance, transactions, fetchBalance } = useWallet();

  return (
    <>
      <Helmet>
        <title>Portfolio Management | PiEat-Me</title>
      </Helmet>

      <Header />
      
      <Container className="pt-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-pi to-orange bg-clip-text text-transparent">
              Portfolio Management
            </span>
          </h1>
          <PiPriceIndicator showDetails={true} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main wallet column */}
          <div className="lg:col-span-2 space-y-6">
            <WalletCard
              title="piNetwork Balance (π)"
              icon={<WalletIcon className="h-6 w-6 text-pi" />}
              balance={balance.pi}
              symbol="π"
              isUser={!!user}
              isPi={true}
              usdValue={convertPiToUsd(balance.pi)}
              egpValue={convertPiToEgp(balance.pi)}
              onConnect={() => console.log('Connect Pi')}
              onTopUp={() => console.log('Top up Pi')}
              onExternal={() => console.log('External Pi')}
            />

            <WalletCard
              title="piEat Balance (PTM)"
              abbreviation="PTM"
              icon={<Tally5 className="h-6 w-6 text-orange" />}
              balance={balance.ptm}
              symbol="PTM"
              isUser={!!user}
              isPtm={true}
              onConnect={() => console.log('Connect PTM')}
              estimatedValue={`≈ $${convertPiToUsd(balance.ptm * 0.01).toFixed(2)} (${t('wallet.estimatedValue')})`}
              customActions={
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="flex items-center justify-center text-xs md:text-sm py-1 h-auto interactive-button">
                    <RefreshCw className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                    {t('wallet.swap')}
                  </Button>
                  <Button variant="default" className="button-gradient flex items-center justify-center text-xs md:text-sm py-1 h-auto interactive-button">
                    <BadgeInfo className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                    <span className="wallet-manage-text">
                      {t('wallet.manage')}
                    </span>
                  </Button>
                </div>
              }
            />

            <Card className={theme === 'dark' ? 'bg-muted/20' : ''}>
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{t('wallet.transactions')}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={fetchBalance} className="text-xs interactive-button">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    {t('wallet.refresh')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <TransactionHistory transactions={transactions} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className={theme === 'dark' ? 'bg-muted/20' : ''}>
              <CardHeader>
                <CardTitle className="text-lg">{t('wallet.totalBalance')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span>π Pi</span>
                    <span className="font-semibold">{balance.pi.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>PTM Token</span>
                    <span className="font-semibold">{balance.ptm.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border my-3"></div>
                  <div className="flex justify-between items-center mb-2">
                    <span>{t('wallet.totalUsd')}</span>
                    <span className="font-semibold">
                      ${(convertPiToUsd(balance.pi) + convertPiToUsd(balance.ptm * 0.01)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{t('wallet.totalEgp')}</span>
                    <span className="font-semibold">
                      {(convertPiToEgp(balance.pi) + convertPiToEgp(balance.ptm * 0.01)).toFixed(2)} £E
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={theme === 'dark' ? 'bg-muted/20' : ''}>
              <CardHeader>
                <CardTitle className="text-lg">{t('wallet.quickOptions')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start interactive-button" variant="outline">
                  <WalletIcon className="mr-2 h-4 w-4" />
                  {t('wallet.topUp')}
                </Button>
                <Button className="w-full justify-start interactive-button" variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {t('wallet.swap')}
                </Button>
                <Button className="w-full justify-start button-gradient interactive-button">
                  <Pickaxe className="mr-2 h-4 w-4" />
                  {t('wallet.mine')}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange/10 to-pi/10 dark:from-orange/20 dark:to-pi/20">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Info className="h-5 w-5 mr-2" />
                  {t('wallet.aboutPTM')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('wallet.ptmDescription')}
                </p>
                <Button variant="link" className="text-pi p-0 h-auto mt-2 interactive-button">
                  {t('wallet.learnMore')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Wallet;
