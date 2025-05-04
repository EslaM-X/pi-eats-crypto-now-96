
import React from 'react';
import { LanguageProvider } from './LanguageContext';
import { ThemeProvider } from './ThemeContext';
import { PiAuthProvider } from './PiAuthContext';
import { CartProvider } from './CartContext';
import PiPriceProvider from './PiPriceContext';
import { HomeFoodProvider } from './homefood/HomeFoodContext';
import { WalletProvider } from './WalletContext';

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <PiPriceProvider>
          <PiAuthProvider>
            <CartProvider>
              <HomeFoodProvider>
                <WalletProvider>
                  {children}
                </WalletProvider>
              </HomeFoodProvider>
            </CartProvider>
          </PiAuthProvider>
        </PiPriceProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
