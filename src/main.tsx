
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Import language context
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PiPriceProvider } from "./contexts/PiPriceContext";
import { PiAuthProvider } from "./contexts/PiAuthContext";

// Load Cairo font for Arabic
const loadFonts = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap';
  document.head.appendChild(link);
};

// Load fonts
loadFonts();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <PiPriceProvider>
          <PiAuthProvider>
            <App />
          </PiAuthProvider>
        </PiPriceProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);
