
import React from 'react';
import { Message } from '@/types/food';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isCurrentUser }) => {
  const { content, userName, createdAt, isFromProvider } = message;
  const initial = userName[0].toUpperCase();
  
  return (
    <div className={cn(
      "flex w-full mb-4",
      isCurrentUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex max-w-[80%]",
        isCurrentUser ? "flex-row-reverse" : "flex-row"
      )}>
        <Avatar className={cn(
          "h-8 w-8 flex-shrink-0",
          isCurrentUser ? "ml-2" : "mr-2"
        )}>
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
        
        <div>
          <div className={cn(
            "rounded-lg px-4 py-2 text-sm",
            isCurrentUser 
              ? "bg-pi text-white" 
              : "bg-muted"
          )}>
            {content}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {isFromProvider ? "Provider" : userName} • {format(new Date(createdAt), 'h:mm a')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
