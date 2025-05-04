
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { toast } from 'sonner';
import { FoodProvider } from '@/types/food';

interface ContactSectionProps {
  provider: FoodProvider;
  onSendMessage: (content: string) => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({ provider, onSendMessage }) => {
  const { user } = usePiAuth();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to send messages');
      return;
    }
    
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    setIsSending(true);
    
    try {
      onSendMessage(message.trim());
      setMessage('');
      toast.success('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Contact Information</h3>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
              <p>{provider.contactInfo.address}</p>
            </div>
            
            {provider.contactInfo.phone && (
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
                <a 
                  href={`tel:${provider.contactInfo.phone}`}
                  className="hover:underline"
                >
                  {provider.contactInfo.phone}
                </a>
              </div>
            )}
            
            {provider.contactInfo.email && (
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
                <a 
                  href={`mailto:${provider.contactInfo.email}`}
                  className="hover:underline"
                >
                  {provider.contactInfo.email}
                </a>
              </div>
            )}
            
            {provider.contactInfo.socialMedia && (
              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Social Media</p>
                <div className="flex space-x-4">
                  {provider.contactInfo.socialMedia.facebook && (
                    <a 
                      href={`https://facebook.com/${provider.contactInfo.socialMedia.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                  )}
                  
                  {provider.contactInfo.socialMedia.instagram && (
                    <a 
                      href={`https://instagram.com/${provider.contactInfo.socialMedia.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-800"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  )}
                  
                  {provider.contactInfo.socialMedia.whatsapp && (
                    <a 
                      href={`https://wa.me/${provider.contactInfo.socialMedia.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800"
                    >
                      <MessageSquare className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Send a Message</h3>
          
          {user ? (
            <form onSubmit={handleSendMessage}>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Ask ${provider.name} a question...`}
                className="min-h-[120px] resize-none mb-4"
                required
              />
              <Button 
                type="submit" 
                disabled={isSending || !message.trim()}
                className="w-full"
              >
                {isSending ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">
                Please login to send messages to this provider
              </p>
              <Button
                onClick={() => toast.info('Please use the login button in the header')}
              >
                Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactSection;
