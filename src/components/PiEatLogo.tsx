
import React from 'react';

interface PiEatLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showEmoji?: boolean;
  textOnly?: boolean;
  piOnly?: boolean;
  showEat?: boolean;
}

const PiEatLogo: React.FC<PiEatLogoProps> = ({ 
  size = 'md', 
  className = '', 
  showEmoji = true,
  textOnly = false,
  piOnly = false,
  showEat = true
}) => {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-5xl',
  };
  
  if (textOnly) {
    return (
      <span className={`font-bold ${sizeClasses[size]} ${className}`}>
        {piOnly ? 'π' : 'πEat'}
      </span>
    );
  }

  const emojiSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };
  
  return (
    <div className={`font-bold ${sizeClasses[size]} bg-gradient-to-r from-pi to-orange bg-clip-text text-transparent flex items-center ${className}`}>
      <span className="relative">
        π
        {showEmoji && (
          <span className={`absolute -top-1 -right-2 ${emojiSize[size]} bg-orange text-white rounded-full h-5 w-5 flex items-center justify-center transform rotate-12 shadow-md border border-white`}>
            🍕
          </span>
        )}
      </span>
      {showEat && <span className="ml-0.5">Eat</span>}
    </div>
  );
};

export default PiEatLogo;
