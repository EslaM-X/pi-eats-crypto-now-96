
import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { LanguageProvider } from './LanguageContext';
import { PiAuthProvider } from './PiAuthContext';
import { PiPriceProvider } from './PiPriceContext';
import { HomeFoodProvider } from './HomeFoodContext';
import { WalletProvider } from './WalletContext';

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <PiAuthProvider>
          <PiPriceProvider>
            <WalletProvider>
              <HomeFoodProvider>
                {children}
              </HomeFoodProvider>
            </WalletProvider>
          </PiPriceProvider>
        </PiAuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
