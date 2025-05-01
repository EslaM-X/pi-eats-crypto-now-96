
import React, { ReactNode } from 'react';
import { LanguageProvider } from './LanguageContext';
import { PiAuthProvider } from './PiAuthContext';
import { PiPriceProvider } from './PiPriceContext';
import { WalletProvider } from './WalletContext';
import { RewardsProvider } from './RewardsContext';

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <LanguageProvider>
      <PiAuthProvider>
        <PiPriceProvider>
          <WalletProvider>
            <RewardsProvider>
              {children}
            </RewardsProvider>
          </WalletProvider>
        </PiPriceProvider>
      </PiAuthProvider>
    </LanguageProvider>
  );
};

export default AppProvider;
