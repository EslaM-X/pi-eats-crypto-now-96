
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Message } from '@/types/food';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isCurrentUser }) => {
  const formattedTime = formatDistanceToNow(new Date(message.createdAt), { addSuffix: true });
  
  return (
    <div className={cn(
      "flex",
      isCurrentUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "rounded-lg px-4 py-2 max-w-[80%]",
        isCurrentUser 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted"
      )}>
        <p className="text-sm">{message.content}</p>
        <p className="text-xs opacity-70 mt-1">{formattedTime}</p>
      </div>
    </div>
  );
};

export default MessageItem;
