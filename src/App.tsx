
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';

import AppProvider from "./contexts/AppProvider";
import Index from "./pages/Index";
import Restaurants from "./pages/Restaurants";
import RestaurantDetails from "./pages/RestaurantDetails";
import Wallet from "./pages/Wallet";
import Rewards from "./pages/Rewards";
import Mining from "./pages/Mining";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import HomeFood from "./pages/HomeFood";
import FoodProviderDetails from "./pages/FoodProviderDetails";
import AddFoodListing from "./pages/AddFoodListing";
import { MobileNavigation, MobileNavbar } from "./frontend"; 
import { useIsMobile } from "./frontend/hooks/use-mobile";
import { toast } from "sonner";
import { Capacitor } from '@capacitor/core';

// Configure the QueryClient with Pi Network styling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// This function initializes the Pi SDK when available
const initPiSDK = () => {
  console.log("Initializing Pi SDK integration");
  
  // Check if we're in Pi Browser
  const isPiMobileApp = 
    /Pi Network/i.test(navigator.userAgent) ||
    /PiNetwork/i.test(navigator.userAgent);
  
  if (isPiMobileApp) {
    console.log("Running in Pi Browser environment");
    toast.success("Pi Browser detected! SDK integration enabled.");
  }
  
  // Check if Pi SDK is available globally
  if (typeof window !== 'undefined' && 'Pi' in window) {
    console.log("Pi SDK detected, initializing...");
    try {
      // Set up the Pi SDK
      // @ts-ignore - Pi is injected by the Pi Browser
      window.Pi.init({ 
        version: "2.0",
        sandbox: process.env.NODE_ENV !== "production"
      });
      
      // Log successful initialization
      console.log("Pi SDK initialized successfully");
      toast.success("Pi Network integration initialized successfully");
      
      // We don't auto-authenticate here, users will click the "Connect with Pi" button
    } catch (error) {
      console.error("Error initializing Pi SDK:", error);
      toast.error("Could not initialize Pi Network integration");
    }
  } else {
    console.log("Pi SDK not available - running in standard browser");
  }
};

const App = () => {
  const isMobile = useIsMobile();
  
  // Call the Pi SDK initialization function on mount
  useEffect(() => {
    initPiSDK();
    
    // Add event listener for network changes
    window.addEventListener('online', () => {
      toast.success("Internet connection restored");
      queryClient.refetchQueries();
    });
    
    window.addEventListener('offline', () => {
      toast.error("Internet connection lost");
    });
    
    // Check if we're running as a native app
    if (Capacitor.isNativePlatform()) {
      toast.success(`Running as a native ${Capacitor.getPlatform()} app!`);
      console.log('Native platform detected:', Capacitor.getPlatform());
    }
    
    return () => {
      window.removeEventListener('online', () => {});
      window.removeEventListener('offline', () => {});
    };
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" theme="system" />
          <AppProvider>
            <div className="min-h-screen bg-gradient-to-br from-background to-background/95 text-foreground pb-16 md:pb-0">
              <BrowserRouter>
                <MobileNavbar />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/restaurants" element={<Restaurants />} />
                  <Route path="/restaurants/:id" element={<RestaurantDetails />} />
                  <Route path="/wallet" element={<Wallet />} />
                  <Route path="/rewards" element={<Rewards />} />
                  <Route path="/mining" element={<Mining />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/homefood" element={<HomeFood />} />
                  <Route path="/homefood/:id" element={<FoodProviderDetails />} />
                  <Route path="/homefood/add" element={<AddFoodListing />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                
                {/* Show mobile navigation on mobile devices */}
                {isMobile && <MobileNavigation />}
              </BrowserRouter>
            </div>
          </AppProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
