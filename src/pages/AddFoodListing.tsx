import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from '@/components/ui/container';
import Header from '@/components/Header';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader,
  CardDescription
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
import { Separator } from '@/components/ui/separator';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  ChefHat, 
  MapPin, 
  Phone,
  Image,
  Star,
  Clock,
  Utensils,
  Info
} from 'lucide-react';
import AdPlaceholder from '@/components/mining/AdPlaceholder';

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
  deliveryTime: z.string().optional(),
  openingHours: z.string().optional(),
  specialties: z.string().optional(),
  allergyInfo: z.string().optional()
});

const AddFoodListing = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { addProvider } = useHomeFood();
  const { user } = usePiAuth();
  const [acceptsPi, setAcceptsPi] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');
  const [imageUploaded, setImageUploaded] = useState(false);
  
  // Setup form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      cuisine: "",
      phone: "",
      deliveryTime: "",
      openingHours: "",
      specialties: "",
      allergyInfo: ""
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
        image: imageUploaded ? "/lovable-uploads/a8326833-2525-4059-956f-569750fb1bc4.png" : "/placeholder.svg", // Use uploaded image or placeholder
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
        menu: [], // Empty menu initially
        // Store additional fields that aren't in the FoodProvider type directly
        deliveryTime: values.deliveryTime || "30-45 min",
        openingHours: values.openingHours || "9:00 AM - 9:00 PM",
        specialties: values.specialties || "",
        allergyInfo: values.allergyInfo || ""
      };
      
      const providerId = addProvider(newProvider);
      toast.success("Food provider added successfully!");
      navigate(`/homefood/${providerId}`);
    } catch (error: any) {
      toast.error(`Failed to add food provider: ${error.message}`);
    }
  };

  // Handle image upload
  const handleImageUpload = () => {
    setImageUploaded(true);
    toast.success("Image uploaded successfully!");
  };

  return (
    <>
      <Helmet>
        <title>{language === 'ar' ? 'إضافة قائمة طعام جديدة | باي إيت' : 'Add Food Listing | Eat-Me-Pi'}</title>
      </Helmet>
      
      <Header />
      
      <Container className="py-8 mt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{language === 'ar' ? 'إضافة قائمة طعام جديدة' : 'Add New Food Listing'}</h1>
            <p className="text-muted-foreground mt-2">
              {language === 'ar' ? 'شارك مهاراتك في الطبخ واكسب عملة باي' : 'Share your cooking skills and earn Pi'}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <AdPlaceholder width="280px" height="90px" text={language === 'ar' ? 'مساحة إعلانية' : 'Advertisement'} variant="horizontal" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center">
                  <ChefHat className="mr-2 h-6 w-6 text-pi" />
                  <h2 className="text-2xl font-semibold">{language === 'ar' ? 'تفاصيل مقدم الطعام' : 'Provider Details'}</h2>
                </div>
                <CardDescription>
                  {language === 'ar' ? 'أدخل تفاصيل خدمة الطعام الخاصة بك' : 'Enter the details of your food service'}
                </CardDescription>
              </CardHeader>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
                  <TabsTrigger value="basic" className="text-sm">
                    <Info className="mr-1 h-4 w-4" />
                    {language === 'ar' ? 'معلومات أساسية' : 'Basic Info'}
                  </TabsTrigger>
                  <TabsTrigger value="details" className="text-sm">
                    <Utensils className="mr-1 h-4 w-4" />
                    {language === 'ar' ? 'تفاصيل إضافية' : 'Extra Details'}
                  </TabsTrigger>
                  <TabsTrigger value="image" className="text-sm">
                    <Image className="mr-1 h-4 w-4" />
                    {language === 'ar' ? 'الصور' : 'Images'}
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="text-sm">
                    <Star className="mr-1 h-4 w-4" />
                    {language === 'ar' ? 'معاينة' : 'Preview'}
                  </TabsTrigger>
                </TabsList>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <TabsContent value="basic" className="space-y-4 mt-4">
                      <CardContent className="space-y-4 p-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{language === 'ar' ? 'الاسم' : 'Name'}</FormLabel>
                              <FormControl>
                                <Input placeholder={language === 'ar' ? 'اسم مطبخك أو مطعمك' : 'Your kitchen or restaurant name'} {...field} />
                              </FormControl>
                              <FormDescription>
                                {language === 'ar' ? 'اسم خدمة الطعام الخاصة بك' : 'The name of your food business or home kitchen'}
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
                              <FormLabel>{language === 'ar' ? 'الوصف' : 'Description'}</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder={language === 'ar' ? 'أخبر العملاء عن خدمة الطعام الخاصة بك' : 'Tell customers about your food service'} 
                                  className="min-h-32" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                {language === 'ar' ? 'صف تخصصاتك وساعات العمل وما إلى ذلك' : 'Describe your specialties, operating hours, etc.'}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="cuisine"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{language === 'ar' ? 'نوع المطبخ' : 'Cuisine Type'}</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder={language === 'ar' ? 'حدد نوع المطبخ' : 'Select cuisine type'} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Egyptian">{language === 'ar' ? 'مصري' : 'Egyptian'}</SelectItem>
                                    <SelectItem value="Italian">{language === 'ar' ? 'إيطالي' : 'Italian'}</SelectItem>
                                    <SelectItem value="Asian">{language === 'ar' ? 'آسيوي' : 'Asian'}</SelectItem>
                                    <SelectItem value="American">{language === 'ar' ? 'أمريكي' : 'American'}</SelectItem>
                                    <SelectItem value="Mediterranean">{language === 'ar' ? 'متوسطي' : 'Mediterranean'}</SelectItem>
                                    <SelectItem value="Other">{language === 'ar' ? 'أخرى' : 'Other'}</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="deliveryTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{language === 'ar' ? 'وقت التوصيل' : 'Delivery Time'}</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder={language === 'ar' ? 'حدد وقت التوصيل' : 'Select delivery time'} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="15-30 min">15-30 {language === 'ar' ? 'دقيقة' : 'min'}</SelectItem>
                                    <SelectItem value="30-45 min">30-45 {language === 'ar' ? 'دقيقة' : 'min'}</SelectItem>
                                    <SelectItem value="45-60 min">45-60 {language === 'ar' ? 'دقيقة' : 'min'}</SelectItem>
                                    <SelectItem value="60-90 min">60-90 {language === 'ar' ? 'دقيقة' : 'min'}</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  {language === 'ar' ? 'متوسط وقت توصيل الطلبات' : 'Average time to deliver orders'}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>{language === 'ar' ? 'الموقع' : 'Location'}</FormLabel>
                                <div className="flex">
                                  <FormControl>
                                    <div className="relative w-full">
                                      <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                      <Input className="pl-8" placeholder={language === 'ar' ? 'عنوانك أو الحي' : 'Your address or neighborhood'} {...field} />
                                    </div>
                                  </FormControl>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</FormLabel>
                                <div className="flex">
                                  <FormControl>
                                    <div className="relative w-full">
                                      <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                      <Input className="pl-8" placeholder={language === 'ar' ? 'رقم الاتصال' : 'Contact number'} {...field} />
                                    </div>
                                  </FormControl>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
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
                            {language === 'ar' ? 'قبول عملة باي المشفرة' : 'Accept Pi Cryptocurrency'}
                          </label>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" type="button" onClick={() => navigate('/homefood')}>
                          {language === 'ar' ? 'إلغاء' : 'Cancel'}
                        </Button>
                        <Button type="button" onClick={() => setActiveTab('details')} className="button-gradient">
                          {language === 'ar' ? 'التالي' : 'Next'}
                        </Button>
                      </CardFooter>
                    </TabsContent>
                    
                    <TabsContent value="details" className="space-y-4 mt-4">
                      <CardContent className="space-y-4 p-4">
                        <FormField
                          control={form.control}
                          name="openingHours"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{language === 'ar' ? '��اعات العمل' : 'Opening Hours'}</FormLabel>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <FormControl>
                                  <Input placeholder={language === 'ar' ? 'مثال: 9:00 صباحاً - 9:00 مساءً' : 'Example: 9:00 AM - 9:00 PM'} {...field} />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="specialties"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{language === 'ar' ? 'التخصصات' : 'Specialties'}</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder={language === 'ar' ? 'ما هي أطباقك المميزة؟' : 'What are your signature dishes?'} 
                                  className="min-h-20" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                {language === 'ar' ? 'أخبر العملاء عن الأطباق التي تشتهر بها' : 'Tell customers about dishes you are famous for'}
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="allergyInfo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{language === 'ar' ? 'معلومات الحساسية' : 'Allergy Information'}</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder={language === 'ar' ? 'قدم معلومات عن الحساسية والمكونات المسببة للحساسية في أطباقك' : 'Provide information about allergens in your dishes'} 
                                  className="min-h-20" 
                                  {...field} 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                      
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" type="button" onClick={() => setActiveTab('basic')}>
                          {language === 'ar' ? 'السابق' : 'Previous'}
                        </Button>
                        <Button type="button" onClick={() => setActiveTab('image')} className="button-gradient">
                          {language === 'ar' ? 'التالي' : 'Next'}
                        </Button>
                      </CardFooter>
                    </TabsContent>
                    
                    <TabsContent value="image" className="space-y-4 mt-4">
                      <CardContent className="space-y-6 p-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">
                            {language === 'ar' ? 'صورة الغلاف' : 'Cover Image'}
                          </h3>
                          
                          <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                            {imageUploaded ? (
                              <div className="relative">
                                <img 
                                  src="/lovable-uploads/a8326833-2525-4059-956f-569750fb1bc4.png" 
                                  alt="Uploaded cover" 
                                  className="mx-auto max-h-64 object-contain" 
                                />
                                <p className="text-green-600 mt-2">
                                  {language === 'ar' ? 'تم تحميل الصورة بنجاح' : 'Image uploaded successfully!'}
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="mx-auto w-12 h-12 rounded-full bg-muted/80 flex items-center justify-center">
                                  <Image className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {language === 'ar' ? 'اسحب وأفلت الصورة هنا أو انقر للتصفح' : 'Drag and drop image here or click to browse'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {language === 'ar' ? 'PNG، JPG، GIF حتى 5MB' : 'PNG, JPG, GIF up to 5MB'}
                                </p>
                              </div>
                            )}
                            
                            {!imageUploaded && (
                              <Button 
                                type="button" 
                                variant="outline" 
                                className="mt-4"
                                onClick={handleImageUpload}
                              >
                                {language === 'ar' ? 'اختر صورة' : 'Choose Image'}
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-2">
                            {language === 'ar' ? 'صور إضافية (اختياري)' : 'Additional Images (Optional)'}
                          </h3>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[1, 2, 3].map(index => (
                              <div 
                                key={index}
                                className="border-2 border-dashed border-muted rounded-lg p-4 text-center h-32 flex items-center justify-center"
                              >
                                <div className="space-y-1">
                                  <div className="mx-auto w-8 h-8 rounded-full bg-muted/80 flex items-center justify-center">
                                    <Image className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {language === 'ar' ? 'إضافة' : 'Add'}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" type="button" onClick={() => setActiveTab('details')}>
                          {language === 'ar' ? 'السابق' : 'Previous'}
                        </Button>
                        <Button type="button" onClick={() => setActiveTab('preview')} className="button-gradient">
                          {language === 'ar' ? 'معاينة' : 'Preview'}
                        </Button>
                      </CardFooter>
                    </TabsContent>
                    
                    <TabsContent value="preview" className="space-y-4 mt-4">
                      <CardContent className="p-4">
                        <div className="rounded-lg overflow-hidden border mb-6">
                          <div className="aspect-video bg-muted relative overflow-hidden">
                            {imageUploaded ? (
                              <img 
                                src="/lovable-uploads/a8326833-2525-4059-956f-569750fb1bc4.png" 
                                alt={form.getValues().name || 'Food provider'} 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Image className="h-12 w-12 text-muted-foreground/50" />
                              </div>
                            )}
                          </div>
                          
                          <div className="p-6 space-y-4">
                            <div>
                              <h3 className="text-2xl font-bold">{form.getValues().name || (language === 'ar' ? 'اسم مقدم الطعام' : 'Food Provider Name')}</h3>
                              <div className="flex items-center mt-2">
                                <Star className="h-5 w-5 text-orange fill-orange" />
                                <span className="ml-1 text-sm">New</span>
                                <span className="mx-2 text-muted-foreground">•</span>
                                <span className="text-sm">{form.getValues().cuisine || (language === 'ar' ? 'نوع المطبخ' : 'Cuisine Type')}</span>
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground">
                              {form.getValues().description || (language === 'ar' ? 'وصف مقدم الطعام سيظهر هنا.' : 'Food provider description will appear here.')}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                                <span className="text-sm">{form.getValues().deliveryTime || '30-45 min'}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                                <span className="text-sm">{form.getValues().location || (language === 'ar' ? 'الموقع' : 'Location')}</span>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                                {language === 'ar' ? 'ساعات العمل' : 'Opening Hours'}
                              </h4>
                              <p className="text-sm">{form.getValues().openingHours || '9:00 AM - 9:00 PM'}</p>
                            </div>
                            
                            {form.getValues().specialties && (
                              <div>
                                <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                                  {language === 'ar' ? 'التخصصات' : 'Specialties'}
                                </h4>
                                <p className="text-sm">{form.getValues().specialties}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-muted-foreground">
                            {language === 'ar' 
                              ? 'هذه معاينة لقائمة الطعام الخاصة بك. يمكنك إضافة عناصر القائمة بعد الإنشاء.' 
                              : 'This is a preview of your food listing. You can add menu items after creation.'}
                          </p>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" type="button" onClick={() => setActiveTab('image')}>
                          {language === 'ar' ? 'السابق' : 'Previous'}
                        </Button>
                        <Button type="submit" className="button-gradient">
                          {language === 'ar' ? 'نشر القائمة' : 'Publish Listing'}
                        </Button>
                      </CardFooter>
                    </TabsContent>
                  </form>
                </Form>
              </Tabs>
            </Card>
          </div>
          
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">{language === 'ar' ? 'نصائح للنجاح' : 'Tips for Success'}</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <h4 className="font-semibold">{language === 'ar' ? 'صور جذابة' : 'Attractive Images'}</h4>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' 
                      ? 'استخدم صوراً عالية الجودة لأطباقك. الصور الجيدة تزيد من فرص المبيعات.' 
                      : 'Use high-quality images of your dishes. Good photos increase sales chances.'}
                  </p>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <h4 className="font-semibold">{language === 'ar' ? 'وصف مفصل' : 'Detailed Description'}</h4>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' 
                      ? 'اكتب وصفاً مفصلاً وجذاباً يشرح ما يميزك عن الآخرين.' 
                      : 'Write a detailed and compelling description explaining what makes you stand out.'}
                  </p>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <h4 className="font-semibold">{language === 'ar' ? 'تحديث منتظم' : 'Regular Updates'}</h4>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' 
                      ? 'قم بتحديث قائمتك بانتظام بأطباق جديدة وعروض خاصة.' 
                      : 'Update your menu regularly with new dishes and special offers.'}
                  </p>
                </div>
                
                <Separator />
                
                <div className="pt-2">
                  <AdPlaceholder width="100%" height="250px" text={language === 'ar' ? 'مساحة إعلانية' : 'Advertisement'} variant="vertical" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t">
          <AdPlaceholder width="100%" height="90px" text={language === 'ar' ? 'مساحة إعلانية' : 'Advertisement'} variant="horizontal" />
        </div>
        
        {!user && (
          <div className="mt-6 text-center p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-amber-600 dark:text-amber-400 font-medium">
              {language === 'ar' 
                ? 'الرجاء تسجيل الدخول باستخدام شبكة باي لإضافة خدمة الطعام الخاصة بك.' 
                : 'Please login with Pi Network to add your food service.'}
            </p>
          </div>
        )}
      </Container>
    </>
  );
};

export default AddFoodListing;
