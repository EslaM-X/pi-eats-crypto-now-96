
import React from 'react';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import MessageForm from '@/components/MessageForm';
import { FoodProvider } from '@/types/food';

interface ContactSectionProps {
  provider: FoodProvider;
  onSendMessage: (content: string) => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({ provider, onSendMessage }) => {
  return (
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
            onSendMessage={onSendMessage}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactSection;
