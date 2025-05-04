
import React from "react";
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

const App = () => {
  const isMobile = useIsMobile();

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
