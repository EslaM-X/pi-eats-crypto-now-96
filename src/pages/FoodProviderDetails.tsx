
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Menu, Star, MessageSquare } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useHomeFood } from '@/contexts/HomeFoodContext';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import MessageItem from '@/components/MessageItem';
import MessageForm from '@/components/MessageForm'; // Added this import to fix the build error
import { toast } from 'sonner';

// Import our refactored components
import ProviderHeader from '@/components/food-provider/ProviderHeader';
import ProviderInfo from '@/components/food-provider/ProviderInfo';
import MenuSection from '@/components/food-provider/MenuSection';
import ReviewsSection from '@/components/food-provider/ReviewsSection';
import ContactSection from '@/components/food-provider/ContactSection';

const FoodProviderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { 
    getProvider, getReviews, addReview, 
    favorites, toggleFavorite,
    sendMessage, getMessages 
  } = useHomeFood();
  const { user } = usePiAuth();
  const { addItem } = useCart();
  
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'contact'>('menu');
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  
  const provider = getProvider(id || '');
  const reviews = getReviews(id || '');
  const messages = user ? getMessages(id || '', user.uid) : [];
  
  if (!provider) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Listing not found</h1>
          <Link to="/homefood">
            <Button>Back to Home Food</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const isUsersFavorite = user && favorites.includes(provider.id);
  
  const handleAddToCart = (item: any) => {
    addItem({
      id: `homefood-${item.id}`,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId: provider.id,
      restaurantName: provider.name
    });
    toast.success('Added to cart');
  };
  
  const handleSubmitReview = (rating: number, comment: string) => {
    if (!user) return;
    
    addReview({
      providerId: provider.id,
      userId: user.uid,
      userName: user.username || 'User',
      userImage: undefined,
      rating,
      comment
    });
  };
  
  const handleSendMessage = (content: string) => {
    if (!user) return;
    
    sendMessage({
      providerId: provider.id,
      userId: user.uid,
      userName: user.username || 'User',
      providerName: provider.name,
      content,
      isFromProvider: false
    });
  };
  
  const openMessageDialog = () => {
    setMessageDialogOpen(true);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Provider Header */}
      <ProviderHeader 
        provider={provider}
        isUsersFavorite={isUsersFavorite}
        toggleFavorite={toggleFavorite}
        openMessageDialog={openMessageDialog}
        isLoggedIn={!!user}
      />
      
      <div className="container mx-auto px-4 py-6">
        {/* Provider Info */}
        <ProviderInfo provider={provider} theme={theme} />
        
        {/* Tabs: Menu, Reviews, Contact */}
        <Tabs 
          defaultValue="menu" 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'menu' | 'reviews' | 'contact')}
          className="mb-6"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="menu" className="flex items-center">
              <Menu className="h-4 w-4 mr-2" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center">
              <Star className="h-4 w-4 mr-2" />
              Reviews ({provider.reviewCount})
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu">
            <MenuSection 
              provider={provider} 
              theme={theme} 
              handleAddToCart={handleAddToCart} 
            />
          </TabsContent>
          
          <TabsContent value="reviews">
            <ReviewsSection 
              providerId={provider.id}
              reviews={reviews}
              onSubmitReview={handleSubmitReview}
            />
          </TabsContent>
          
          <TabsContent value="contact">
            <ContactSection 
              provider={provider}
              onSendMessage={handleSendMessage}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Messages with {provider.name}</DialogTitle>
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto p-4 space-y-4 border rounded-md">
            {messages.length > 0 ? (
              messages.map(message => (
                <MessageItem 
                  key={message.id}
                  message={message}
                  isCurrentUser={!message.isFromProvider}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No messages yet. Start a conversation!
              </div>
            )}
          </div>
          <MessageForm 
            providerId={provider.id}
            providerName={provider.name}
            onSendMessage={(content) => {
              handleSendMessage(content);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FoodProviderDetails;
