
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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

// Configure the QueryClient with Pi Network styling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// This function would be used to initialize Pi SDK when available
const initPiSDK = () => {
  // In a real implementation, this would initialize the Pi SDK
  console.log("Preparing for Pi SDK integration");
  
  // Example of SDK initialization (commented out as it's not yet implemented)
  /*
  if (window.Pi) {
    window.Pi.init({ 
      version: "2.0",
      sandbox: process.env.NODE_ENV !== "production"
    });
    
    // Authenticate with Pi Network
    window.Pi.authenticate(['username', 'payments'], onIncompletePaymentFound)
      .then(auth => {
        console.log("User authenticated with Pi Network:", auth);
      })
      .catch(error => {
        console.error("Pi Network authentication error:", error);
      });
  }
  */
};

// Handler for incomplete payments
const onIncompletePaymentFound = (payment) => {
  console.log("Incomplete payment found:", payment);
  // Implement handling for incomplete payment
};

const App = () => {
  // Call the Pi SDK initialization function
  useEffect(() => {
    initPiSDK();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" theme="system" />
        <AppProvider>
          <div className="min-h-screen bg-gradient-to-br from-background to-background/95 text-foreground">
            <BrowserRouter>
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
            </BrowserRouter>
          </div>
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
