
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, MapPin, Star, Phone, Mail, ExternalLink, 
  Heart, MessageSquare, Users, Clock, Menu
} from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useHomeFood } from '@/contexts/HomeFoodContext';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import ReviewCard from '@/components/ReviewCard';
import ReviewForm from '@/components/ReviewForm';
import MessageForm from '@/components/MessageForm';
import MessageItem from '@/components/MessageItem';
import { toast } from 'sonner';

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
      userName: user.username || 'User', // Fixed: using username from PiUser
      userImage: undefined, // Fixed: removed photoURL reference
      rating,
      comment
    });
  };
  
  const handleSendMessage = (content: string) => {
    if (!user) return;
    
    sendMessage({
      providerId: provider.id,
      userId: user.uid,
      userName: user.username || 'User', // Fixed: using username from PiUser
      providerName: provider.name,
      content,
      isFromProvider: false
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Provider Header */}
      <div 
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${provider.coverImage || provider.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/10">
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-4">
            <Link to="/homefood">
              <Button variant="ghost" className="absolute top-4 left-4 text-white bg-black/30 hover:bg-black/40">
                <ChevronLeft className="h-5 w-5" />
                Back
              </Button>
            </Link>
            
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-white">{provider.name}</h1>
                <div className="flex items-center mt-2 space-x-4">
                  <Badge 
                    variant="secondary" 
                    className={`bg-white/20 text-white ${
                      provider.type === 'homemade' ? 'border-orange' : 'border-pi'
                    }`}
                  >
                    {provider.type === 'homemade' ? 'Home Cooking' : 'Small Restaurant'}
                  </Badge>
                  <div className="flex items-center text-white">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                    <span>{provider.rating.toFixed(1)} ({provider.reviewCount})</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={() => user ? toggleFavorite(provider.id) : toast.error('Please login to save favorites')}
                  className="bg-black/30 hover:bg-black/40 text-white h-10 w-10"
                >
                  <Heart 
                    className={`h-5 w-5 ${isUsersFavorite ? 'fill-red-500 text-red-500' : ''}`}
                  />
                </Button>
                
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={() => setMessageDialogOpen(true)}
                  className="bg-black/30 hover:bg-black/40 text-white h-10 w-10"
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        {/* Provider Info */}
        <Card className={`mb-6 ${theme === 'dark' ? 'bg-muted/20' : ''}`}>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-4">{provider.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>{provider.contactInfo.address}</span>
              </div>
              {provider.contactInfo.phone && (
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{provider.contactInfo.phone}</span>
                </div>
              )}
              {provider.contactInfo.email && (
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{provider.contactInfo.email}</span>
                </div>
              )}
            </div>
            
            {/* Cuisine Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {provider.cuisine.map((cuisine, index) => (
                <Badge key={index} variant="outline">
                  {cuisine}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        
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
            {/* Group menu items by category */}
            {Array.from(new Set(provider.menu.map(item => item.category))).map(category => (
              <div key={category} className="mb-6">
                <h3 className="text-xl font-bold mb-3">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {provider.menu
                    .filter(item => item.category === category)
                    .map(item => (
                      <Card key={item.id} className={`overflow-hidden ${theme === 'dark' ? 'bg-muted/20' : ''}`}>
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-1/3 h-24 sm:h-auto">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <h3 className="font-medium">
                                  {item.name}
                                  {item.popular && (
                                    <Badge variant="secondary" className="ml-2 bg-orange/20 text-orange">
                                      Popular
                                    </Badge>
                                  )}
                                </h3>
                                <div className="font-semibold">π {item.price.toFixed(2)}</div>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {item.description}
                              </p>
                            </div>
                            
                            <Button 
                              onClick={() => handleAddToCart(item)}
                              size="sm"
                              className="w-full button-gradient mt-3"
                            >
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="reviews">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
                
                {reviews.length > 0 ? (
                  <div>
                    {reviews.map(review => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-muted/10 rounded-lg">
                    <Users className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p>No reviews yet. Be the first to review!</p>
                  </div>
                )}
              </div>
              
              <div className="md:col-span-1">
                <ReviewForm 
                  providerId={provider.id} 
                  onSubmit={handleSubmitReview}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="contact">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Address</div>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      {provider.contactInfo.address}
                    </div>
                  </div>
                  
                  {provider.contactInfo.phone && (
                    <div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <div className="flex items-center mt-1">
                        <Phone className="h-4 w-4 mr-2" />
                        {provider.contactInfo.phone}
                      </div>
                    </div>
                  )}
                  
                  {provider.contactInfo.email && (
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div className="flex items-center mt-1">
                        <Mail className="h-4 w-4 mr-2" />
                        {provider.contactInfo.email}
                      </div>
                    </div>
                  )}
                  
                  {/* Social Media */}
                  {provider.contactInfo.socialMedia && (
                    <>
                      <Separator />
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Social Media</div>
                        <div className="flex flex-wrap gap-2">
                          {provider.contactInfo.socialMedia.facebook && (
                            <Button size="sm" variant="outline" className="h-8" asChild>
                              <a href={`https://facebook.com/${provider.contactInfo.socialMedia.facebook}`} target="_blank" rel="noreferrer">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Facebook
                              </a>
                            </Button>
                          )}
                          
                          {provider.contactInfo.socialMedia.instagram && (
                            <Button size="sm" variant="outline" className="h-8" asChild>
                              <a href={`https://instagram.com/${provider.contactInfo.socialMedia.instagram}`} target="_blank" rel="noreferrer">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Instagram
                              </a>
                            </Button>
                          )}
                          
                          {provider.contactInfo.socialMedia.whatsapp && (
                            <Button size="sm" variant="outline" className="h-8" asChild>
                              <a href={`https://wa.me/${provider.contactInfo.socialMedia.whatsapp}`} target="_blank" rel="noreferrer">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                WhatsApp
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Send Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <MessageForm 
                    providerId={provider.id}
                    providerName={provider.name}
                    onSendMessage={handleSendMessage}
                  />
                </CardContent>
              </Card>
            </div>
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
