
import React from 'react';
import { LanguageProvider } from './LanguageContext';
import { ThemeProvider } from './ThemeContext';
import { PiAuthProvider } from './PiAuthContext';
import { PiPriceProvider } from './PiPriceContext';

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <PiPriceProvider>
          <PiAuthProvider>
            {children}
          </PiAuthProvider>
        </PiPriceProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
