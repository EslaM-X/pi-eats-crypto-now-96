
import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { LanguageProvider } from './LanguageContext';
import { PiAuthProvider } from './PiAuthContext';
import { PiPriceProvider } from './PiPriceContext';
import { HomeFoodProvider } from './homefood/HomeFoodContext';
import { WalletProvider } from './WalletContext';
import { RewardsProvider } from './RewardsContext';

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <PiAuthProvider>
          <PiPriceProvider>
            <WalletProvider>
              <RewardsProvider>
                <HomeFoodProvider>
                  {children}
                </HomeFoodProvider>
              </RewardsProvider>
            </WalletProvider>
          </PiPriceProvider>
        </PiAuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
