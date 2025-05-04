
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { usePiAuth } from '@/contexts/PiAuthContext';
import { toast } from 'sonner';

interface MessageFormProps {
  providerId: string;
  providerName: string;
  onSendMessage: (content: string) => void;
}

const MessageForm: React.FC<MessageFormProps> = ({
  providerId,
  providerName,
  onSendMessage
}) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = usePiAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to send messages');
      return;
    }
    
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      onSendMessage(message.trim());
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex items-end gap-2">
        <Textarea 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Message to ${providerName}...`}
          className="min-h-[80px] resize-none"
          disabled={isSubmitting}
        />
        <Button 
          type="submit"
          size="icon"
          className="h-10 w-10 rounded-full"
          disabled={isSubmitting || !message.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default MessageForm;
