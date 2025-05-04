
import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { LanguageProvider } from './LanguageContext';
import { PiAuthProvider } from './PiAuthContext';
import { PiPriceProvider } from './PiPriceContext';
import { CartProvider } from './CartContext';
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
              <WalletProvider>
                {children}
              </WalletProvider>
            </CartProvider>
          </PiAuthProvider>
        </PiPriceProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
