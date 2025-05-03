
import React, { ReactNode } from 'react';
import { LanguageProvider } from './language';
import { PiAuthProvider } from './PiAuthContext';
import { PiPriceProvider } from './PiPriceContext';
import { WalletProvider } from './WalletContext';
import { RewardsProvider } from './RewardsContext';
import { ThemeProvider } from './ThemeContext';
import { CartProvider } from './CartContext';
import { OrdersProvider } from './OrdersContext';
import { HomeFoodProvider } from './HomeFoodContext';
import { MiningProvider } from './MiningContext';

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
                <MiningProvider>
                  <CartProvider>
                    <OrdersProvider>
                      <HomeFoodProvider>
                        {children}
                      </HomeFoodProvider>
                    </OrdersProvider>
                  </CartProvider>
                </MiningProvider>
              </RewardsProvider>
            </WalletProvider>
          </PiPriceProvider>
        </PiAuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
