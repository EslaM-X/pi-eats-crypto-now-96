
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { usePiAuth } from '@/contexts/PiAuthContext';

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
  const { user } = usePiAuth();
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to send messages');
      return;
    }
    
    if (!message.trim()) {
      return;
    }
    
    onSendMessage(message.trim());
    setMessage('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex items-start gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Message to ${providerName}...`}
          className="flex-1"
          disabled={!user}
        />
        <Button 
          type="submit"
          size="icon"
          className="button-gradient h-10 w-10"
          disabled={!message.trim() || !user}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default MessageForm;
