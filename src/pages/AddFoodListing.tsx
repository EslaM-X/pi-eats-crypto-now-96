
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from '@/components/ui/container';
import Header from '@/components/Header';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useHomeFood } from '@/contexts/homefood/HomeFoodContext';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { FoodProvider } from '@/types/food';

// Define form validation schema
const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters."
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters."
  }),
  location: z.string().min(5, {
    message: "Location must be at least 5 characters."
  }),
  cuisine: z.string().min(3, {
    message: "Cuisine type must be at least 3 characters."
  }),
  phone: z.string().min(8, {
    message: "Phone number must be at least 8 characters."
  }),
  // Add more validation as needed
});

const AddFoodListing = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { addProvider } = useHomeFood();
  const { user } = usePiAuth();
  const [acceptsPi, setAcceptsPi] = useState(true);
  
  // Setup form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      cuisine: "",
      phone: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("Please login first to add a food provider");
      return;
    }
    
    try {
      // Create a new food provider with the form values that matches the FoodProvider structure
      const newProvider: Omit<FoodProvider, 'id'> = {
        name: values.name,
        description: values.description,
        image: "/placeholder.svg", // Default placeholder image
        rating: 0,
        reviewCount: 0,
        type: 'homemade', // Default value
        cuisine: [values.cuisine], // Convert to array as per FoodProvider type
        location: values.location,
        contactInfo: {
          phone: values.phone,
          address: values.location,
          email: user.username + "@example.com", // Default email based on username
        },
        menu: [] // Empty menu initially
      };
      
      const providerId = addProvider(newProvider);
      toast.success("Food provider added successfully!");
      navigate(`/homefood/${providerId}`);
    } catch (error: any) {
      toast.error(`Failed to add food provider: ${error.message}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Add Food Listing | Eat-Me-Pi</title>
      </Helmet>
      
      <Header />
      
      <Container className="py-8">
        <h1 className="text-3xl font-bold mb-8">Add New Food Listing</h1>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Provider Details</h2>
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your kitchen or restaurant name" {...field} />
                      </FormControl>
                      <FormDescription>
                        The name of your home kitchen or food business.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell customers about your food service" 
                          className="min-h-32" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Describe your specialties, operating hours, etc.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cuisine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cuisine Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select cuisine type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Egyptian">Egyptian</SelectItem>
                          <SelectItem value="Italian">Italian</SelectItem>
                          <SelectItem value="Asian">Asian</SelectItem>
                          <SelectItem value="American">American</SelectItem>
                          <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Your address or neighborhood" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Contact number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="accept-pi"
                    checked={acceptsPi}
                    onCheckedChange={setAcceptsPi}
                  />
                  <label
                    htmlFor="accept-pi"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Accept Pi Cryptocurrency
                  </label>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button type="submit" className="button-gradient w-full">
                  Add Food Provider
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
        
        {!user && (
          <div className="mt-4 text-center">
            <p className="text-amber-600 dark:text-amber-400">
              Please login with Pi Network to add your food service.
            </p>
          </div>
        )}
      </Container>
    </>
  );
};

export default AddFoodListing;
