
import React, { ReactNode } from 'react';
import { ThemeProvider } from './ThemeContext';
import { LanguageProvider } from './LanguageContext';
import { PiPriceProvider } from './PiPriceContext';
import { CartProvider } from './CartContext';
import { HomeFoodProvider } from './HomeFoodContext';
import { WalletProvider } from './WalletContext';
import { PiAuthProvider } from './PiAuthContext';
import { MiningProvider } from './MiningContext';

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <PiAuthProvider>
          <PiPriceProvider>
            <WalletProvider>
              <CartProvider>
                <HomeFoodProvider>
                  <MiningProvider>
                    {children}
                  </MiningProvider>
                </HomeFoodProvider>
              </CartProvider>
            </WalletProvider>
          </PiPriceProvider>
        </PiAuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
