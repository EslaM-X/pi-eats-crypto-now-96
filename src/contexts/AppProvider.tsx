
import React, { ReactNode } from 'react';
import { LanguageProvider } from './LanguageContext';
import { PiAuthProvider } from './PiAuthContext';
import { PiPriceProvider } from './PiPriceContext';
import { WalletProvider } from './WalletContext';
import { RewardsProvider } from './RewardsContext';
import { ThemeProvider } from './ThemeContext';
import { CartProvider } from './CartContext';
import { OrdersProvider } from './OrdersContext';

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
                <CartProvider>
                  <OrdersProvider>
                    {children}
                  </OrdersProvider>
                </CartProvider>
              </RewardsProvider>
            </WalletProvider>
          </PiPriceProvider>
        </PiAuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
