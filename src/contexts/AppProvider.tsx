
import React, { ReactNode } from 'react';
import { ThemeProvider } from './ThemeContext';
import { LanguageProvider } from './LanguageContext';
import { PiPriceProvider } from './PiPriceContext';
import { CartProvider } from './CartContext';
import { RestaurantsProvider } from './RestaurantsContext';
import { HomeFoodProvider } from './HomeFoodContext';
import { WalletProvider } from './WalletContext';
import { PiAuthProvider } from './PiAuthContext';
import { MiningProvider } from './MiningContext';

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="light">
      <LanguageProvider>
        <PiAuthProvider>
          <PiPriceProvider>
            <WalletProvider>
              <CartProvider>
                <RestaurantsProvider>
                  <HomeFoodProvider>
                    <MiningProvider>
                      {children}
                    </MiningProvider>
                  </HomeFoodProvider>
                </RestaurantsProvider>
              </CartProvider>
            </WalletProvider>
          </PiPriceProvider>
        </PiAuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
