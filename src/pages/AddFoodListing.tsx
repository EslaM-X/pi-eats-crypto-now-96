
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Trash } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useHomeFood } from '@/contexts/HomeFoodContext';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { FoodItem } from '@/types/food';

// Sample cuisine options
const cuisineOptions = [
  'Egyptian', 'Middle Eastern', 'Italian', 'American', 
  'Indian', 'Asian', 'Mediterranean', 'Seafood', 'Vegetarian',
  'Desserts', 'Breakfast', 'Street Food', 'Family Style', 'Café'
];

// Sample location options
const locationOptions = [
  'Cairo', 'Alexandria', 'Giza', 'Luxor', 'Aswan', 
  'Hurghada', 'Sharm El Sheikh', 'Mansoura', 'Port Said'
];

// Sample food categories
const categoryOptions = [
  'Main Dishes', 'Appetizers', 'Soups', 'Salads', 
  'Desserts', 'Beverages', 'Breakfast', 'Sandwiches'
];

// Sample image URLs (to be replaced with actual image upload in a real app)
const sampleImageUrls = [
  'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800',
  'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800',
  'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800',
  'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800',
  'https://images.unsplash.com/photo-1611489142329-5da8e7f9d067?w=800',
  'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800',
  'https://images.unsplash.com/photo-1579697096985-41fe1430e5df?w=800',
];

const AddFoodListing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addProvider } = useHomeFood();
  const { user } = usePiAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'homemade' as 'homemade' | 'small_restaurant',
    description: '',
    cuisine: [] as string[],
    location: '',
    contactInfo: {
      phone: '',
      email: '',
      address: '',
      socialMedia: {
        facebook: '',
        instagram: '',
        whatsapp: ''
      }
    },
    image: sampleImageUrls[0],
    coverImage: sampleImageUrls[1],
  });
  
  const [menuItems, setMenuItems] = useState<Partial<FoodItem>[]>([
    { 
      name: '', 
      description: '', 
      price: 0, 
      image: sampleImageUrls[2],
      category: 'Main Dishes',
      popular: false
    }
  ]);
  
  const handleCuisineToggle = (cuisine: string) => {
    setFormData(prev => {
      const currentCuisines = [...prev.cuisine];
      if (currentCuisines.includes(cuisine)) {
        return {
          ...prev,
          cuisine: currentCuisines.filter(c => c !== cuisine)
        };
      } else {
        return {
          ...prev,
          cuisine: [...currentCuisines, cuisine]
        };
      }
    });
  };
  
  const handleAddMenuItem = () => {
    setMenuItems(prev => [
      ...prev, 
      { 
        name: '', 
        description: '', 
        price: 0, 
        image: sampleImageUrls[Math.floor(Math.random() * sampleImageUrls.length)],
        category: 'Main Dishes',
        popular: false
      }
    ]);
  };
  
  const handleRemoveMenuItem = (index: number) => {
    setMenuItems(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleMenuItemChange = (index: number, field: string, value: any) => {
    setMenuItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to create your food listing",
        variant: "destructive"
      });
      return;
    }
    
    // Validate form
    if (!formData.name) {
      toast({
        title: "Form Incomplete",
        description: "Please provide a name for your listing",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.cuisine.length === 0) {
      toast({
        title: "Form Incomplete",
        description: "Please select at least one cuisine type",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.location) {
      toast({
        title: "Form Incomplete",
        description: "Please select your location",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.contactInfo.address) {
      toast({
        title: "Form Incomplete",
        description: "Please provide your address",
        variant: "destructive"
      });
      return;
    }
    
    // Validate menu items
    const validMenuItems = menuItems.filter(item => item.name && item.price);
    if (validMenuItems.length === 0) {
      toast({
        title: "Menu Incomplete",
        description: "Please add at least one menu item with name and price",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format menu items properly with IDs
      const formattedMenuItems = validMenuItems.map((item, index) => ({
        id: `item-${Date.now()}-${index}`,
        name: item.name || '',
        description: item.description || '',
        price: Number(item.price) || 0,
        image: item.image || sampleImageUrls[0],
        category: item.category || 'Main Dishes',
        popular: item.popular || false
      }));
      
      // Add the listing
      const providerId = await addProvider({
        ...formData,
        menu: formattedMenuItems,
        rating: 0,
        reviewCount: 0,
        isActive: true
      });
      
      toast({
        title: "Listing Created",
        description: "Your food listing has been created successfully!",
      });
      
      navigate(`/homefood/${providerId}`);
    } catch (error) {
      console.error('Error creating listing:', error);
      toast({
        title: "Error",
        description: "Failed to create your listing. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/homefood')}
            className="mr-4"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Add New Food Listing</h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Basic Information */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Listing Name</Label>
                  <Input 
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Your food business name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Type</Label>
                  <RadioGroup 
                    value={formData.type}
                    onValueChange={(value) => setFormData({...formData, type: value as 'homemade' | 'small_restaurant'})}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="homemade" id="homemade" />
                      <Label htmlFor="homemade">Home Cooking</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="small_restaurant" id="restaurant" />
                      <Label htmlFor="restaurant">Small Restaurant</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Tell customers about your food..."
                    rows={4}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cuisine Types</Label>
                    <div className="flex flex-wrap gap-2 border rounded-md p-3 h-40 overflow-y-auto">
                      {cuisineOptions.map((cuisine) => (
                        <div 
                          key={cuisine} 
                          className={`
                            px-3 py-1 rounded-full text-sm cursor-pointer transition-colors
                            ${formData.cuisine.includes(cuisine) 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'}
                          `}
                          onClick={() => handleCuisineToggle(cuisine)}
                        >
                          {cuisine}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Select 
                      value={formData.location}
                      onValueChange={(value) => setFormData({...formData, location: value})}
                      required
                    >
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Select your city" />
                      </SelectTrigger>
                      <SelectContent>
                        {locationOptions.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea 
                    id="address"
                    value={formData.contactInfo.address}
                    onChange={(e) => setFormData({
                      ...formData, 
                      contactInfo: {...formData.contactInfo, address: e.target.value}
                    })}
                    placeholder="Your full address"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone"
                    type="tel"
                    value={formData.contactInfo.phone}
                    onChange={(e) => setFormData({
                      ...formData, 
                      contactInfo: {...formData.contactInfo, phone: e.target.value}
                    })}
                    placeholder="+20 123 456 7890"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) => setFormData({
                      ...formData, 
                      contactInfo: {...formData.contactInfo, email: e.target.value}
                    })}
                    placeholder="your@email.com"
                  />
                </div>
                
                <Separator />
                <p className="text-sm text-muted-foreground">Social Media (Optional)</p>
                
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook Username</Label>
                  <Input 
                    id="facebook"
                    value={formData.contactInfo.socialMedia.facebook}
                    onChange={(e) => setFormData({
                      ...formData, 
                      contactInfo: {
                        ...formData.contactInfo, 
                        socialMedia: {
                          ...formData.contactInfo.socialMedia,
                          facebook: e.target.value
                        }
                      }
                    })}
                    placeholder="yourpage"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram Username</Label>
                  <Input 
                    id="instagram"
                    value={formData.contactInfo.socialMedia.instagram}
                    onChange={(e) => setFormData({
                      ...formData, 
                      contactInfo: {
                        ...formData.contactInfo, 
                        socialMedia: {
                          ...formData.contactInfo.socialMedia,
                          instagram: e.target.value
                        }
                      }
                    })}
                    placeholder="yourhandle"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input 
                    id="whatsapp"
                    value={formData.contactInfo.socialMedia.whatsapp}
                    onChange={(e) => setFormData({
                      ...formData, 
                      contactInfo: {
                        ...formData.contactInfo, 
                        socialMedia: {
                          ...formData.contactInfo.socialMedia,
                          whatsapp: e.target.value
                        }
                      }
                    })}
                    placeholder="+201234567890"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Menu Items */}
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Menu Items</CardTitle>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddMenuItem}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              {menuItems.map((item, index) => (
                <div key={index} className="mb-6 pb-6 border-b last:border-b-0">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium">Item #{index + 1}</h3>
                    {menuItems.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveMenuItem(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`item-name-${index}`}>Item Name</Label>
                      <Input 
                        id={`item-name-${index}`}
                        value={item.name}
                        onChange={(e) => handleMenuItemChange(index, 'name', e.target.value)}
                        placeholder="Food item name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`item-price-${index}`}>Price (π)</Label>
                      <Input 
                        id={`item-price-${index}`}
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.price}
                        onChange={(e) => handleMenuItemChange(index, 'price', Number(e.target.value))}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`item-category-${index}`}>Category</Label>
                      <Select 
                        value={item.category}
                        onValueChange={(value) => handleMenuItemChange(index, 'category', value)}
                      >
                        <SelectTrigger id={`item-category-${index}`}>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <Label htmlFor={`item-description-${index}`}>Description</Label>
                    <Textarea 
                      id={`item-description-${index}`}
                      value={item.description}
                      onChange={(e) => handleMenuItemChange(index, 'description', e.target.value)}
                      placeholder="Describe your food item..."
                      rows={2}
                    />
                  </div>
                  
                  <div className="mt-4 flex items-center">
                    <input
                      type="checkbox"
                      id={`item-popular-${index}`}
                      checked={item.popular}
                      onChange={(e) => handleMenuItemChange(index, 'popular', e.target.checked)}
                      className="mr-2"
                    />
                    <Label htmlFor={`item-popular-${index}`}>Mark as popular item</Label>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddMenuItem}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Item
              </Button>
            </CardFooter>
          </Card>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="button-gradient px-8" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Listing'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFoodListing;
