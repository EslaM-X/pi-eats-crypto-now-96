
import React, { ReactNode } from 'react';
import { LanguageProvider } from './LanguageContext';
import { PiAuthProvider } from './PiAuthContext';
import { PiPriceProvider } from './PiPriceContext';
import { WalletProvider } from './WalletContext';
import { RewardsProvider } from './RewardsContext';
import { ThemeProvider } from './ThemeContext';

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
};

export default AppProvider;
